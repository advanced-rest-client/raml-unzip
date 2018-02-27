var RamlUnzipTestHelpers = {};
RamlUnzipTestHelpers.getZip = function(fileName) {
  var url = location.href.substr(0, location.href.lastIndexOf('/') + 1);
  url = url.replace('/test', '/demo');
  if (url[url.length - 1] !== '/') {
    url += '/';
  }
  url += fileName;
  var xhr = new XMLHttpRequest();
  xhr.open('GET', url, true);
  xhr.responseType = 'blob';
  return new Promise(function(resolve, reject) {
    xhr.onload = function(e) {
      resolve(e.target.response);
    };
    xhr.onerror = reject;
    xhr.send();
  });
};
