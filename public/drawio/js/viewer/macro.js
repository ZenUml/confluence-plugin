
async function initializeMacro() {
    const macro = new Macro(AP.confluence, 'graph');
    const { graphXml } = await macro.load();

    if (graphXml) {
        setGraphStyle('styles/default.xml');
        setGraphXml(graphXml);
    }

    setTimeout(function () {
        let width = document.body.scrollWidth;
        let height = document.body.scrollHeight;
        console.log('Resize to ', width, height);
        AP.resize(width, height);
    }, 1000);
}