/*cookbook.js*/

/*-------Initialize --------------------------------------------------------------------------------*/
var gcb_connect_flg = false;

function $(id) {
  return document.getElementById(id);
}

$('start').onclick = function(e) {
  if ($('x11').checked == true) {
    run_at();
  } else if ($('x12').checked == true) {
    run_to();
  }
};

$('connect').onclick = function(e) {
  if ($('connect').checked != gcb_connect_flg) {
    cb_set_connect_flg(gcb_connect_flg);
  }
  cb_connect_onclick();
};

/*--------------------------------------------------------------------------------------------------*/
function cb_set_play_flg(f) {
}

function cb_set_connect_flg(f) {
  gcb_connect_flg = f;
  $('connect').checked = f;
}

function cb_set_mute_flg(f) {
}

function rn_start_finding() {
  gcb_finding_flg = true;
}

function rn_end_finding() {
  gcb_finding_flg = false;
}

function cb_set_run_info(temperature, time) {
  temperature = Math.floor(temperature / 1);
  $('cTemperature').innerHTML = "当前温度:" + temperature + "℃  "; //"°";

  hh = Math.floor(time / 3600);
  mm = Math.floor((time % 3600) / 60);
  ss = time % 60;
  s = hh + ":";
  if (mm < 10) {
    s = s + "0" + mm + ":";
  } else {
    s = s + mm + ":";
  }
  if (ss < 10) {
    s = s + "0" + ss;
  } else {
    s = s + ss;
  }
  $('cTime').innerHTML = "剩余时间:" + s;
}

function cb_connect_onclick() {
  if (gcb_connect_flg) {
    rn_disconnect();
  } else {
    rn_connect();
  }
}

function cb_ok(url) {
  if (gcb_connect_flg) {
    rn_break();
  } else {
    "history.go(-1);"
  }
}

/*-----cookbook-------------------------------------------------------------------------------------------*/
var gcb_cmds_at = [
{"cmd": ">set_c 0,3,n,220,100;", "swiper_index": 0, "start_js": "", "end_js": ""},
{"cmd": ">set_c 1,4,n,0,1;", "swiper_index": 0, "start_js": "", "end_js": ""},
{"cmd": ">run_c;", "swiper_index": 0, "start_js": "", "end_js": ""}
];

var gcb_cmds_to = [
{"cmd": ">set_c 0,2,n,220,1;", "swiper_index": 0, "start_js": "", "end_js": ""},
{"cmd": ">set_c 1,3,n,220,100;", "swiper_index": 0, "start_js": "", "end_js": ""},
{"cmd": ">set_c 2,4,n,0,1;", "swiper_index": 0, "start_js": "", "end_js": ""},
{"cmd": ">run_c;", "swiper_index": 0, "start_js": "", "end_js": ""}
];

var gcb_cmds = false;

function cb_getlen() {
  return gcb_cmds.length;
}

function cb_getcmd(i) {
  if (i < gcb_cmds.length) {
    return gcb_cmds[i]["cmd"];
  } else {
    return "";
  }
}

function cb_show_start(i) {
  if (i < gcb_cmds.length) {
    if (gcb_cmds[i]["start_js"] != "") {
      eval(gcb_cmds[i]["start_js"]);
    }
  }
}

function cb_show_end(i) {
  if (i < gcb_cmds.length) {
    if (gcb_cmds[i]["end_js"] != "") {
      eval(gcb_cmds[i]["end_js"]);
    }
  }
}

function cb_cook_end() {
}

function cb_showerr(s, lv) {
  alert(s);
}

var cb_statusText = $('statusText');
function cb_showinfo_none() {
  cb_statusText.innerHTML = '&nbsp;';
}

function cb_showinfo(str, lv, ms) {
  if (lv == 0) {
    cb_statusText.innerHTML = str;
    setTimeout("cb_showinfo_none()", ms);
  }
}

function __cb_start() {
  gcb_running = rn_run_c();
}

function cb_start() {
  setTimeout("__cb_start();", 1);
}

function run_at() {
  gcb_cmds_at[0]["cmd"] = ">set_c 0,3,n," + $('setTemperature').value + "," + $('setTime').value + ";"
  gcb_cmds = gcb_cmds_at;
  cb_start();
}

function run_to() {
  gcb_cmds_to[0]["cmd"] = ">set_c 0,2,n," + $('setTemperature').value + ",1;"
  gcb_cmds_to[1]["cmd"] = ">set_c 1,3,n," + $('setTemperature').value + "," + $('setTime').value + ";"
  gcb_cmds = gcb_cmds_to;
  cb_start();
}

/*end file*/
