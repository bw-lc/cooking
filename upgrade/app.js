document.write("<script language=javascript src='/cordova.js'></script>");

var statusText = document.querySelector('#statusText');
var g_device_id = false;

require("cordova!cordova-plugin-ble-central");
var ble = window.ble;

function suCallBack(info){
  statusText.textContent("成功："+JSON.stringify(info));
}

function errCallBack(info){
  statusText.textContent("失败："+JSON.stringify(info));
}

function suCallBack2(info){
}

function errCallBack2(info){
}

function connect(){
  statusText.textContent = '等待...';
  ble.scan([], 15, find_ble, errCallBack);
}

function find_ble(info) {
  statusText.textContent = '连接...';
  //alert(JSON.stringify(info));
  dname = info.name;
  rssi = parseInt(info.rssi);
  if (dname.search("bwdcl-") == 0 && rssi > -75) {
    g_device_id = info.id;
    ble.stopScan( suCallBack2, errCallBack2);
    ble.connect(g_device_id, conned, errCallBack);
  }
}

var characteristics = false;

function conned(info){
  statusText.textContent = '已连接';
  //alert(JSON.stringify(info));
  characteristics  = info.characteristics;
  ble.startNotification(g_device_id, "ffe0", "ffe4", onData, errCallBack);
}

var upgrade_i;


function onData(buffer) {
  var data2 = new Uint8Array(buffer);
  var s = '';

  for (var i = 0; i < data2.length; i++) {
    s = s + String.fromCharCode(data2[i]);
  }
  if (s.substring(0, 1) == ">"  && s.substring(i - 1, i) == ";") {
    if (s.substring(4, 5) == "+" || s.substring(4, 6) == "OK") {
        upgrade_send();
    } else {
        statusText.textContent = s;
    }
  } 
}


function upgrade_send() {
  if (upgrade_i < gcb_cmds.length) {
    statusText.textContent = "已经下载" + upgrade_i + ";共" + gcb_cmds.length;
    __send_str(gcb_cmds[upgrade_i]);
    upgrade_i = upgrade_i + 1;
  } else {
    statusText.textContent = "成功！";
  }    
}


function disconnect() {
  ble.disconnect(g_device_id, suCallBack, errCallBack);
  statusText.textContent = '已断开';
  ble.stopNotification(g_device_id, "ffe0", "ffe4", suCallBack, errCallBack);
  g_device_id = false;
  characteristics = false;
}

function __send_str2(s) {
  var data = new Uint8Array(s.length);
  ss = s.split('');
  for (var i = 0; i < s.length; i++) {
    data[i] = ss[i].charCodeAt();
  }
  ble.write(g_device_id, "ffe5", "ffe9", data.buffer, suCallBack, errCallBack);
}

function __send_str(s) {
  len = s.length;
  if (len > 20) {
    s1 = s.substring(0, 20);
    s2 = s.substring(20, len);
    __send_str2(s1);
    setTimeout("__send_str(s2);", 100);
  } else {
    __send_str2(s);
  }
}

function send_str(s) {
  if (g_device_id != false) {
    statusText.textContent = "正在执行...";
    __send_str(s);
  } else {
    alert("未连接,发送\"" + s + "\"失败");
  }
}

function upgrade() {
  if (g_device_id != false) {
    statusText.textContent = "正在执行...";
    upgrade_i = 0;
    upgrade_send();
  } else {
    alert("未连接,发送\"" + s + "\"失败");
  }
}
