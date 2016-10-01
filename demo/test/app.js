var statusText = document.querySelector('#statusText');
var g_write_char = false;
var g_device = false;
var con_if = false;
var g_read_char = false;

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

          statusText.textContent = s;
          

        })
      })
    });

  });
}

function disconnect() {
  if (g_read_char != false) {
    g_read_char.stopNotifications();
  }
  g_read_char = false;
  if (g_device != false) {
    g_device.disconnect();
    statusText.textContent = '已断开';
    con_if = false;
  }
  g_device = false;
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
    statusText.textContent = "正在执行...";
    __send_str(s);
  } else {
    alert("未连接,发送\"" + s + "\"失败");
  }
}

function run_p() {
  s = ">run_p " + document.getElementById("int11").value + "," + document.getElementById("int12").value + ";"
  send_str(s);
}

function run_at() {
  s = ">run_at " + document.getElementById("int21").value + "," + document.getElementById("int22").value + ";"
  send_str(s);
}

function run_to() {
  s = ">run_to " + document.getElementById("int31").value + "," + document.getElementById("int32").value + ";"
  send_str(s);
}
