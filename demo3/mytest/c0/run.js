
var g_write_char = false;
var g_device = false;
var con_if = false;
var g_read_char = false;


var g_index = 0;
var g_len = 0;
var g_old_runing;

var g_show_flg;

function connect() {
  cb_showinfo('等待...', 0);
  navigator.bluetooth.requestDevice({filters:[{ 'namePrefix': ['bwdcl-']}], 'optionalServices': [0xffe5, 0xffe0]})
  .then(device => device.gatt.connect())
  .then(device => {
    g_device = device;
    device.getPrimaryService(0xffe5)
      .then(service => service.getCharacteristic(0xffe9))
        .then(characteristic => {
          g_write_char = characteristic;
        });
    device.getPrimaryService(0xffe0)
      .then(service => service.getCharacteristic(0xffe4))
        .then(characteristic => {
          g_read_char = characteristic;
          cb_showinfo('已连接', 0);
          con_if = true;
          return characteristic.startNotifications()
          .then(() => {
            g_read_char.addEventListener('characteristicvaluechanged', event => {
            s = ''
            for (var i = 0; i < event.target.value.byteLength; i++) {
            s = s + String.fromCharCode(event.target.value.getInt8(i));
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
        });
      });
    });
  });
}

function __send_str2(s) {
  let bytes = new Uint8Array(s.split('').map(c => c.charCodeAt()));
  g_write_char.writeValue(bytes);
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
  if (con_if) {
    cb_showinfo("正在执行...", 0);
    __send_str(s);
  } else {
    cb_showerr("未连接,发送\"" + s + "\"失败", 0);
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
  if (!con_if) {
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
