document.write("<script language=javascript src='/cordova.js'></script>");
require("cordova!de.appplant.cordova.plugin.background-mode");
require("cordova!de.appplant.cordova.plugin.badge");
require("cordova!cordova-plugin-ble-central");
//var ble = window.ble;

cordova.plugins.backgroundMode.setDefaults({ text:'Doing heavy tasks.'});


var grn_device_id = false;
var grn_device_char = false;

var grn_index = 0;
var grn_len = 0;
var grn_old_runing;
var grn_show_flg;

function rn_suCallBack(info) {
  cb_showinfo("成功：" + JSON.stringify(info), 1, 3000);
}

function rn_errCallBack(info) {
  cb_showinfo("失败：" + JSON.stringify(info), 1, 3000);
}

function rn_suCallBack2(info) {
}

function rn_errCallBack2(info) {
}

var grn_finding;
function rn_finding() {
  grn_finding = grn_finding - 1;
  if (grn_finding > 0) {
    cb_showinfo("正在查找设备，剩余" + grn_finding + "秒...", 0, 1000);
    setTimeout("rn_finding();", 1000);
  } else {
    if (grn_device_id == false) {
      cb_showinfo("未找到设备。", 0, 5000);
    }
  }
}

function rn_connect() {
  grn_device_id = false;
  grn_device_char = false;
  cb_showinfo("正在查找设备，剩余15秒...", 0, 1000);
  grn_finding = 15;
  ble.scan([], 15, rn_find_ble, rn_errCallBack);
  setTimeout("rn_finding();", 1000);
  
}

function rn_find_ble(info) {
  cb_showinfo("连接...", 0, 1000);
  dname = info.name;
  rssi = parseInt(info.rssi);
  if (dname.search("bwdcl-") == 0) { // && rssi > -75) {
    grn_device_id = info.id;
    ble.stopScan( rn_suCallBack2, rn_errCallBack2);
    ble.connect(grn_device_id, rn_conned, rn_errCallBack);
  } else {
    cb_showinfo(JSON.stringify(info), 0, 5000);
  }
}

function rn_conned(info) {
  grn_finding = -1;
  cb_showinfo("已连接...", 0, 3000);
  cb_set_connect_flg(true);
  cordova.plugins.backgroundMode.enable();
  grn_device_char  = info.characteristics;
  ble.startNotification(grn_device_id, "ffe0", "ffe4", rn_char_onData, rn_errCallBack);
}

function rn_char_onData(buffer) {
  var data2 = new Uint8Array(buffer);
  var s = '';

  for (var i = 0; i < data2.length; i++) {
    s = s + String.fromCharCode(data2[i]);
  }

  if (s.substring(0, 1) == ">"  && s.substring(i - 1, i) == ";") {
    if (s == ">await;") {
      cb_cook_end();
    } else if (s == ">OK;") {
      if (!rn_send_cmd()) {
        if (grn_show_flg) {
          cb_showinfo("执行无误", 0, 1000);
        } else {
          grn_show_flg = true;
        }
      }
    } else if (s == ">pause 0;") {
      cb_showinfo("继续执行", 0, 2000);
      cb_set_play_flg(true);
    } else if (s == ">pause 1;") {
      cb_showinfo("暂停执行", 0, 2000);
      cb_set_play_flg(false);
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
        cb_showinfo(s, 0, 2000);
    } else {
      
      s2 = s.substring(6, i - 1);
      ss = s2.split(",");

      if (ss.length != 3) {
        cb_showinfo(s, 0, 2000);
      } else {
        _i = parseInt(ss[0]);
        _s = parseInt(ss[1]);
        _t = parseFloat(ss[2]);

        cb_showinfo(s + " " + _t + " " + _s, 1, 2000);
        cb_set_run_info(_t, _s);

        if (_i < grn_len) {
          if (_i != grn_old_runing) {
            cb_show_start(_i);
            grn_old_runing = _i;
          }
        }
        if (_s == 0) {
          cb_show_end(_i);
        }
      }
    }
  }
}

function rn_disconnect() {
  ble.stopNotification(grn_device_id, "ffe0", "ffe4", rn_suCallBack2, rn_errCallBack2);
  ble.disconnect(grn_device_id, rn_suCallBack2, rn_errCallBack2);
  cb_showinfo("已断开...", 0, 5000);
  cb_set_connect_flg(false);
  grn_device_id = false;
  grn_device_char = false;
  cordova.plugins.backgroundMode.disable();
}

function __rn_send_str2(s) {
  var data = new Uint8Array(s.length);
  ss = s.split('');
  for (var i = 0; i < s.length; i++) {
    data[i] = ss[i].charCodeAt();
  }
  ble.write(grn_device_id, "ffe5", "ffe9", data.buffer, rn_suCallBack, rn_errCallBack);
}

function __rn_send_str(s) {
  len = s.length;
  if (len > 20) {
    s1 = s.substring(0, 20);
    s2 = s.substring(20, len);
    __rn_send_str2(s1);
    setTimeout("__rn_send_str(s2);", 100);
  } else {
    __rn_send_str2(s);
  }
}

function rn_send_str(s) {
  if (grn_device_id != false) {
    cb_showinfo("正在执行...", 0, 1000);
    __rn_send_str(s);
  } else {
    cb_showerr("未连接,发送\"" + s + "\"失败", 0);
  }
}

function rn_send_cmd() {
  if (grn_index < grn_len) {
    s = cb_getcmd(grn_index);
    grn_index = grn_index + 1;
    rn_send_str(s);
    return true;
  }

  return false;
}

function rn_run_c() {
  if (grn_device_id == false) {
    cb_showerr("请先连接", 0);
    return false;
  }
  grn_len = cb_getlen();
  grn_index = 0;
  grn_old_runing = -1;
  grn_show_flg = false;
  rn_send_cmd();
  return true;
}

function rn_pause(f) {
  rn_send_str(">pause " + f + ";");
}

function rn_run_n() {
  rn_send_str(">run_n;");
}

function rn_leave() {
  rn_send_str(">bmute;");
  setTimeout("rn_disconnect();", 100);
  setTimeout("history.go(-1);", 300);
}

function rn_break() {
  rn_send_str(">run_o 0,1;");
  setTimeout("rn_leave();", 2200);
}
