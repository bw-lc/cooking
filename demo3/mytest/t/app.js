var statusText = document.querySelector('#statusText');
var statusText2 = document.querySelector('#statusText2');

var write_char;
statusText.addEventListener('click', function() {
  statusText.textContent = 'Breathe...';
  navigator.bluetooth.requestDevice({filters:[{ 'namePrefix': ['Tv301u']}],	'optionalServices': [0xffe5, 0xffe0]})
  //navigator.bluetooth.requestDevice({filters:[{ 'namePrefix': ['bwdcl-']}],	'optionalServices': [0xffe5, 0xffe0]})
  .then(device => device.gatt.connect())
  .then(device => {
    device.getPrimaryService(0xffe5)
      .then(service => service.getCharacteristic(0xffe9))
        .then(characteristic => {
          write_char = characteristic;
          let bytes = new Uint8Array('Wait...'.split('').map(c => c.charCodeAt()));
          characteristic.writeValue(bytes);
          statusText.textContent = 'Wait...';
        });
    device.getPrimaryService(0xffe0)
      .then(service => service.getCharacteristic(0xffe4))
        .then(characteristic => {
          readCharacteristic = characteristic;
          return characteristic.startNotifications()
          .then(() => {
            readCharacteristic.addEventListener('characteristicvaluechanged', event => {
            s = '' 
            for (var i = 0; i < event.target.value.byteLength; i++) {
            s = s + String.fromCharCode(event.target.value.getInt8(i));
          }
          //alert(s);
          //statusText.textContent = statusText.textContent + s;
          statusText2.appendChild(document.createTextNode(s));

          let bytes = new Uint8Array(s.split('').map(c => c.charCodeAt()));
          write_char.writeValue(bytes);
        })
      })
    });

  });
});

