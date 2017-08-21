function GetQueryString(name) {
  var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
  var r = window.location.search.substr(1).match(reg);
  if(r!=null)return  unescape(r[2]); return null;
}

function url_jmp(cmd) {
  var l_i;
  __protocol = window.location.protocol;
  __host = window.location.host;
  __port = window.location.port;
  __pathname = window.location.pathname;
  url = __protocol + '//' + __host;
  if (__port) {
    url = url + ':' + __port;
  }
  url = url + __pathname;
  cookies = GetQueryString('cookies');
  url = url + '?cookies=' + cookies;
  l_i = GetQueryString('index');
  if (l_i == null) {
    l_i = 0;
  }
  l_i = parseInt(l_i) +1;
  url = url + '&cmd=' + cmd + '&index=' + l_i;
  //alert(url);
  window.location.href = url;
}
