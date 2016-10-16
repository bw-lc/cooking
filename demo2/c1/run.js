
var grn_write_char = false;
var grn_device = false;
var grn_con_if = false;
var grn_read_char = false;


var grn_index = 0;
var grn_len = 0;
var grn_old_runing;

var grn_show_flg;


function rn_connect() {
  cb_showinfo('等待...', 0);
  navigator.bluetooth.requestDevice({filters:[{ 'namePrefix': ['bwdcl-']}], 'optionalServices': [0xffe5, 0xffe0]})
  .then(device => device.gatt.connect())
  .then(device => {
    grn_device = device;
    device.getPrimaryService(0xffe5)
      .then(service => service.getCharacteristic(0xffe9))
        .then(characteristic => {
          grn_write_char = characteristic;
        });
    device.getPrimaryService(0xffe0)
      .then(service => service.getCharacteristic(0xffe4))
        .then(characteristic => {
          grn_read_char = characteristic;
          cb_showinfo('已连接', 0);
          grn_con_if = true;
          cb_set_connect_flg(grn_con_if);
          return characteristic.startNotifications()
          .then(() => {
            grn_read_char.addEventListener('characteristicvaluechanged', event => {
            s = ''
            for (var i = 0; i < event.target.value.byteLength; i++) {
            s = s + String.fromCharCode(event.target.value.getInt8(i));
          }
          
          if (s.substring(0, 1) == ">"  && s.substring(i - 1, i) == ";") {
            if (s == ">await;") {
              cb_cook_end();
            } else if (s == ">OK;") {
              if (!rn_send_cmd()) {
                if (grn_show_flg) {
                  cb_showinfo("执行无误", 0);
                } else {
                  grn_show_flg = true;
                }
              }
            } else if (s == ">pause 0;") {
              cb_showinfo("继续执行", 0);
              cb_set_play_flg(true);
            } else if (s == ">pause 1;") {
              cb_showinfo("暂停执行", 0);
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

                cb_showinfo(s + " " + _t + " " + _s, 1);
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
        });
      });
    });
  });
}

function __rn_send_str2(s) {
  let bytes = new Uint8Array(s.split('').map(c => c.charCodeAt()));
  grn_write_char.writeValue(bytes);
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
  if (grn_con_if) {
    cb_showinfo("正在执行...", 0);
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
  if (!grn_con_if) {
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
