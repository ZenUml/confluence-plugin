import uuidv4 from './uuid'

class Macro {
  EXAMPLE = `//\`POST /orders\`
// 
// - [ ] Setup loadbalancer 
// - [x] Config Kong gateway
OrderController.create(payload) {
  
  // Create an **immutable** \`order\`
  // 1. Validate \`payload\`
  // 1. Log with \`x-correlationid\`
  OrderService.create(payload) {
    // | id | Prod_Name | Price | Inserted_At |
    // |----|-----------|-------|-------------|
    // |123 | book 1    | $10.00| 2020-06-30  |
    OrderRepo.save()
  }
}`
  EXAMPLE_GRAPHXML = `<mxGraphModel dx="1135" dy="370" grid="1" gridSize="10" guides="1" tooltips="1" connect="1" arrows="1" fold="1" page="1" pageScale="1" pageWidth="827" pageHeight="1169"><root><mxCell id="0"/><mxCell id="1" parent="0"/><mxCell id="2" value="" style="rounded=0;whiteSpace=wrap;html=1;" vertex="1" parent="1"><mxGeometry x="80" y="30" width="120" height="60" as="geometry"/></mxCell><mxCell id="4" style="edgeStyle=orthogonalEdgeStyle;rounded=0;orthogonalLoop=1;jettySize=auto;html=1;entryX=1;entryY=0.5;entryDx=0;entryDy=0;" edge="1" parent="1" source="3" target="2"><mxGeometry relative="1" as="geometry"/></mxCell><mxCell id="3" value="" style="ellipse;whiteSpace=wrap;html=1;aspect=fixed;" vertex="1" parent="1"><mxGeometry x="360" y="20" width="80" height="80" as="geometry"/></mxCell></root></mxGraphModel>`;
  _confluence;
  _key;
  _versionNumber;
  _loaded = false;
  _macroIdentifier;
  _code;
  _graphXml;
  _comments = [];

  // eslint-disable-next-line
  constructor(confluence = AP.confluence, macroIdentifier = 'sequence') {
    this._confluence = confluence;
    this._macroIdentifier = macroIdentifier;
  }

  propertyKey(uuid) {
    const macroKey = `zenuml-${this._macroIdentifier}-macro`;
    return `${macroKey}-${uuid}-body`;
  }

  getMacroBody = () => {
    return new Promise((resolve) => {
      try {
      this._confluence.getMacroBody((body) => {
        resolve(body)
      })
      } catch (e) {
        // eslint-disable-next-line
        console.error('Failed to retrieve macro body.', e)
        resolve(null)
      }
    })
  }

  getMacroData = () => {
    return new Promise(((resolve) => {
      try {
        this._confluence.getMacroData((data) => {
          resolve(data)
        })
      } catch (e) {
        // eslint-disable-next-line
        console.error('Failed to retrieve macro data.', e)
        resolve(null)
      }
    }))
  }

  getUrlParam (param) {
    const matches = (new RegExp(param + '=([^&]*)')).exec(window.location.search);
    return matches && matches[1] && decodeURIComponent(matches[1]);
  }

  getContentProperty = async () => {
    const macroData = await this.getMacroData();

    // When the macro is edited for the first time, macro data is not available in the preview mode
    // Fall back to the uuid parameter in the URL. This is defined in the descriptor and is only available for view.html.
    const key = macroData?.uuid || this.getUrlParam('uuid')
    return new Promise(resolve => {
      if (!key) {
        resolve(null)
      } else {
        this._key = key
        try {
          this._confluence.getContentProperty(this.propertyKey(key), (cp) => {
            this._versionNumber = cp?.version?.number
            resolve(cp)
          })
        } catch (e) {
          // eslint-disable-next-line
          console.error('Failed to retrieve content property.', e)
          resolve(null)
        }
      }
    })
  }

  setContentProperty = async (content) => {
    return new Promise((resolve, reject) => {
      this._confluence.setContentProperty(content, (result) => {
        if(result.error) {
          // eslint-disable-next-line
          console.error('Failed to update content property.', result.error)
          reject(result.error)
        } else {
          resolve(true)
        }
      })
    })
  }

  async load() {
    this._loaded = true
    const contentProp = await this.getContentProperty();
    let code;
    let styles;
    let mermaidCode;
    let diagramType;
    let graphXml;
    if(typeof contentProp?.value === 'string') {
      code = contentProp?.value
    } else {
      code = contentProp?.value?.code
      this._comments = contentProp?.value?.comments || []
      styles = contentProp?.value?.styles
      mermaidCode = contentProp?.value?.mermaidCode
      diagramType = contentProp?.value?.diagramType
      graphXml = contentProp?.value?.graphXml
    }
    code = code || await this.getMacroBody();

    if(!mermaidCode && !code) {
      code = this.EXAMPLE;
    }

    if(this._macroIdentifier === 'graph' && !graphXml) {
      graphXml = this.EXAMPLE_GRAPHXML;
    }

    styles = styles || {}
    this._graphXml = graphXml
    return {code, styles, mermaidCode, diagramType, graphXml, comments: this._comments };
  }

  // comments: [{ cellId: "1", commentId: "c1" }, { cellId: "2", commentId: "b1" }]

  async comment(cellId, commentId) {
    const key = this._key
    const versionNumber = this._versionNumber;
    this._comments.push({cellId: cellId, commentId: commentId})
    const contentProperty = {
      key: this.propertyKey(key),
      value: {
        graphXml: this._graphXml,
        comments: this._comments
      },
      version: {
        number: versionNumber ? versionNumber + 1 : 1
      }
    }
    await this.setContentProperty(contentProperty)
  }
  // Warning! Do not call getXXX in save. Do retest if you want to call getXXX.
  // It does not work as of 17th May 2020. That is why we have stored key and version
  async save(code, styles, mermaidCode, diagramType) {
    if (!this._loaded) {
      throw new Error('You have to call load before calling save()')
    }
    const key = this._key || uuidv4()
    this._confluence.saveMacro({uuid: key, updatedAt: new Date()}, code);
    const versionNumber = this._versionNumber;

    const value = this._macroIdentifier === 'graph' ? {graphXml: code, comments: this._comments} : {code, styles, mermaidCode, diagramType};

    const contentProperty = {
      key: this.propertyKey(key),
      value: value,
      version: {
        number: versionNumber ? versionNumber + 1 : 1
      }
    }
    await this.setContentProperty(contentProperty)
  }
}

export default Macro