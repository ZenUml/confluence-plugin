function getUrlParam (param) {
  var codedParam = (new RegExp(param + '=([^&]*)')).exec(window.location.search)[1];
  return decodeURIComponent(codedParam);
}

//https://gist.github.com/hagenburger/500716
var JavaScript = {
  load: function (src, callback) {
    let loaded
    let script = document.createElement('script')
    script.setAttribute('src', src)

    if (callback) {
      script.onreadystatechange = script.onload = function () {
        if (!loaded) {
          callback()
        }
        loaded = true
      }
    }
    document.getElementsByTagName('head')[0].appendChild(script)
    return script
  }
};

function getConnectUrl() {
  return 'https://connect-cdn.atl-paas.net/all.js';
}

function loadConnect(callback) {
	return JavaScript.load(getConnectUrl(), callback);
}
