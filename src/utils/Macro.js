import uuidv4 from './uuid'

class Macro {
  EXAMPLE = `// Sample! Declare the participants (optional)
BookService BookRepository Receipt Notification
@Starter(User)
"{id, dueDate, ...}" = BookService.Borrow(id) {
  BookRepository.Update(id, onLoan)

  // Send Event with "Source->Target:Event". "Source->" is optional
  Notification:BOOK_ON_LOAN event with id, due date, etc. 
  new Receipt(id, dueDate)
}
`
  _confluence;
  _key;
  _versionNumber;
  constructor(confluence) {
    this._confluence = confluence;
  }

  propertyKey(uuid) {
    const macroKey = 'zenuml-sequence-macro';
    return `${macroKey}-${uuid}-body`;
  }

  getMacroBody = () => {
    return new Promise((resolve) => {
      this._confluence.getMacroBody((body) => {
        resolve(body)
      })
    })
  }

  getMacroData = () => {
    return new Promise((resolve => {
      this._confluence.getMacroData((data) => {
        resolve(data)
      })
    }))
  }

  getContentProperty = async () => {
    const macroData = await this.getMacroData();

    const key = macroData?.uuid
    return new Promise((resolve => {
      if (!key) {
        resolve(null)
      } else {
        this._key = key
        this._confluence.getContentProperty(this.propertyKey(key), (cp) => {
          this._versionNumber = cp?.version?.number
          resolve(cp)
        })
      }
    }))
  }

  async load() {
    return (await this.getContentProperty())?.value || await this.getMacroBody() || this.EXAMPLE
  }

  // Warning! Do not call getXXX in onSubmit. Do retest if you want to call getXXX.
  // It does not work as of 17th May 2020. That is why we have stored key and version
  async onSubmit(code) {
    const key = this._key || uuidv4()
    this._confluence.saveMacro({uuid: key, updatedAt: new Date()}, code)
    const versionNumber = this._versionNumber
    const contentProperty = {
      key: this.propertyKey(key),
      value: code,
      version: {
        number: versionNumber ? versionNumber + 1 : 1
      }
    }
    this._confluence.setContentProperty(contentProperty)
  }
}
export default Macro