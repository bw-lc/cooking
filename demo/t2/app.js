var statusText = document.querySelector('#statusText');
var statusText1 = document.querySelector('#statusText1');
var statusText2 = document.querySelector('#statusText2');
var g_write_char = false;
var g_device = false;
var con_if = false;
var g_read_char = false;
var g_index = 0;
var g_cmds = new Array();
var g_shows = new Array();


function connect() {
  statusText.textContent = '等待...';
  //navigator.bluetooth.requestDevice({filters:[{ 'namePrefix': ['Tv301u']}],	'optionalServices': [0xffe5, 0xffe0]})
  navigator.bluetooth.requestDevice({filters:[{ 'namePrefix': ['bwdcl-']}],	'optionalServices': [0xffe5, 0xffe0]})
  .then(device => device.gatt.connect())
  .then(device => {
    g_device = device;
    device.getPrimaryService(0xffe5)
      .then(service => service.getCharacteristic(0xffe9))
        .then(characteristic => {
          g_write_char = characteristic;
          //statusText.textContent = '已连接';
        });
    device.getPrimaryService(0xffe0)
      .then(service => service.getCharacteristic(0xffe4))
        .then(characteristic => {
          g_read_char = characteristic;
          statusText.textContent = '已连接';
          con_if = true;
          return characteristic.startNotifications()
          .then(() => {
            g_read_char.addEventListener('characteristicvaluechanged', event => {
            s = ''
            for (var i = 0; i < event.target.value.byteLength; i++) {
            s = s + String.fromCharCode(event.target.value.getInt8(i));
          }
          
          //alert(s);
          if (s.substring(0, 1) == ">"  && s.substring(i - 1, i) == ";") {

            statusText1.textContent = "";
            statusText2.textContent = "";
            if (s == ">await;") {
              statusText.textContent = "烹饪完成！";
            } else if (s == ">OK;") {
              statusText.textContent = "执行无误";
            } else if (s == ">pause 0;") {
              statusText.textContent = "继续执行";
            } else if (s == ">pause 1;") {
              statusText.textContent = "暂停执行";
            } else if (s == ">E1;") {
              statusText.textContent = "测温模块故障";
            } else if (s == ">E2;") {
              statusText.textContent = "温度传感器故障";
            } else if (s == ">E3;") {
              statusText.textContent = "命令参数数目不对";
            } else if (s == ">E4;") {
              statusText.textContent = "步骤超出范围";
            } else if (s == ">E5;") {
              statusText.textContent = "没有按照顺序设置食谱";
            } else if (s.substring(0, 6) != ">info "  || s.substring(i - 1, i) != ";") {
                statusText.textContent = s;
            } else {
              s2 = s.substring(6, i - 1);
              ss = s2.split(",");
              if (ss.length != 3) {
                statusText.textContent = s;
              } else {
                _i = parseInt(ss[0]);
                _s = parseInt(ss[1]);
                _t = parseFloat(ss[2]);
                if (_i < g_cmds.length) {
                  statusText.textContent = g_shows[_i];
                }
                statusText1.textContent = "剩余时间：" + _s + "秒，当前温度：" + _t + "度。";
                if (_s == 0) {
                  statusText1.textContent = "已经执行完当前步骤，请按\"下一步\"按钮";
                }
              }
            }
          }

        })
      })
    });

  });
}

function send_str(s) {
  statusText.textContent = "正在执行...";
  let bytes = new Uint8Array(s.split('').map(c => c.charCodeAt()));
  if (con_if) {
    g_write_char.writeValue(bytes);
  } else {
    alert("未连接,发送\"" + s + "\"失败");
  }
}

function set_c() {
  s = ">set_c " + g_index + "," + document.getElementById("in_2").value + "," + document.getElementById("in_3").value  + "," + document.getElementById("in_4").value + "," + document.getElementById("in_5").value + ";";
  send_str(s);
  if (con_if) {
    g_cmds[g_index] = s;
    g_shows[g_index] = document.getElementById("in_1").value;
    g_index = g_index + 1;
    document.getElementById("in_index").value = g_index.toString();
    document.getElementById("in_1").value = "第" + g_index + "步";
  }
}

function reset_c() {
  g_index = 0;
  document.getElementById("in_index").value = "0";
  document.getElementById("in_1").value = "第" + g_index + "步";
}

function run_c() {
  send_str(">run_c;");
}
