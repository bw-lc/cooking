document.write("<script language=javascript src='/cordova.js'></script>");

require("cordova!cordova-plugin-ble-central");
var ble = window.ble;

var g_device_id = false;
var g_char = false;

var g_index = 0;
var g_len = 0;
var g_old_runing;
var g_show_flg;


function suCallBack(info){
  cb_showinfo("成功："+JSON.stringify(info), 0);
}

function errCallBack(info){
  cb_showinfo("失败："+JSON.stringify(info)+JSON.stringify(info), 0);
}

function suCallBack2(info){
}

function errCallBack2(info){
}


var g_finding;
function finded() {
  if (g_finding > 0) {
    g_finding = g_finding - 1;
    cb_showinfo("正在查找设备，剩余" + g_finding + "秒...", 0);
    setTimeout("finded();", 1000);
  } else {
    if (g_device_id == false) {
      cb_showinfo("未找到设备。", 0);
    }
  }
}

function connect() {
  cb_showinfo("正在查找设备，剩余15秒...", 0);
  ble.scan([], 15, find_ble, errCallBack);
  g_finding = 15;
  setTimeout("finded();", 1000);
}


function find_ble(info) {
  cb_showinfo("连接...", 0);
  dname = info.name;
  rssi = parseInt(info.rssi);
  if (dname.search("bwdcl-") == 0) { // && rssi > -75) {
    g_device_id = info.id;
    ble.stopScan( suCallBack2, errCallBack2);
    ble.connect(g_device_id, conned, errCallBack);
  } else {
    alert(JSON.stringify(info));
  }
}

function conned(info) {
  g_finding = -1;
  cb_showinfo("已连接...", 0);
  g_char  = info.characteristics;
  ble.startNotification(g_device_id, "ffe0", "ffe4", onData, errCallBack);
}

function onData(buffer) {
  var data2 = new Uint8Array(buffer);
  var s = '';

  for (var i = 0; i < data2.length; i++) {
    s = s + String.fromCharCode(data2[i]);
  }

  if (s.substring(0, 1) == ">"  && s.substring(i - 1, i) == ";") {

    if (s == ">await;") {
      cb_cook_end();
    } else if (s == ">OK;") {
      if (!send_cmd()) {
        if (g_show_flg) {
          cb_showinfo("执行无误", 0);
        } else {
          g_show_flg = true;
        }
      }
    } else if (s == ">pause 0;") {
      cb_showinfo("继续执行", 0);
    } else if (s == ">pause 1;") {
      cb_showinfo("暂停执行", 0);
    } else if (s == ">E1;") {
      cb_showerr("测温模块故障", 0);
    } else if (s == ">E2;") {
      cb_showerr("温度传感器故障", 0);
    } else if (s == ">E3;") {
      cb_showerr("命令参数数目不对", 0);
    } else if (s == ">E4;") {
      cb_showerr("步骤超出范围", 0);
    } else if (s == ">E5;") {
      cb_showerr("没有按照顺序设置食谱", 0);
    } else if (s.substring(0, 6) != ">info "  || s.substring(i - 1, i) != ";") {
        cb_showinfo(s, 0);
    } else {
      s2 = s.substring(6, i - 1);
      ss = s2.split(",");

      if (ss.length != 3) {
        cb_showinfo(s, 0);
      } else {
        _i = parseInt(ss[0]);
        _s = parseInt(ss[1]);
        _t = parseFloat(ss[2]);
        if (_i < g_len) {
          if (_i != g_old_runing) {
            cb_show_start(_i);
            g_old_runing = _i;
          }
        }
        cb_showinfo("剩余时间：" + _s + "秒，当前温度：" + _t + "度。", 1);
        if (_s == 0) {
          cb_show_end(_i);
        }
      }
    }
  }
};


function disconnect() {
  ble.stopNotification(g_device_id, "ffe0", "ffe4", suCallBack2, errCallBack2);
  ble.disconnect(g_device_id, suCallBack2, errCallBack2);
  cb_showinfo("已断开...", 0);
  statusText.textContent = '已断开';
  g_device_id = false;
  g_char = false;
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

function send_cmd() {
  if (g_index < g_len) {
    s = cb_getcmd(g_index);
    g_index = g_index + 1;
    send_str(s);
    return true;
  }

  return false;
}

function run_c() {
  if (g_device_id == false) {
    cb_showerr("请先连接", 0);
    return;
  }
  g_len = cb_getlen();
  g_index = 0;
  g_old_runing = -1;
  g_show_flg = false;
  send_cmd();
}

function pause(f) {
  send_str(">pause " + f + ";");
}

function test2() {
  var access_id;
  try {
    access_id = parseInt(localStorage.getItem("access_id"));
  }
  catch(err) {
    access_id = 0;
  }
  if (isNaN(access_id)) {
    access_id = 0;
  }
  alert("access_id:" + access_id);
}