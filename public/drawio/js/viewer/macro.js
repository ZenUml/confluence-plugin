
async function initializeMacro() {
    window.macro = new Macro(AP.confluence, 'graph');
    const { graphXml, comments } = await macro.load();

    if (graphXml) {
        setGraphStyle('styles/default.xml');
        setGraphXml(graphXml);
        setComments(comments || [])
    }

    setTimeout(function () {
        let width = document.body.scrollWidth;
        let height = document.body.scrollHeight;
        console.log('Resize to ', width, height);
        AP.resize(width, height);
    }, 1000);
}