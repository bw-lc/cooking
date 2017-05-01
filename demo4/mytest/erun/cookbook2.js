var cb_statusText = document.querySelector('#statusText');
var cb_info1 = document.querySelector('#info1');

var cb_cmds= new Array();
var cb_start = new Array();
var cb_end = new Array();
var cb_index = 0;


function cb_getlen() {
  return cb_cmds.length;
}

function cb_getcmd(i) {
  if (i < cb_cmds.length) {
    return cb_cmds[i];
  } else {
    return "";
  }
}

function cb_show_start(i) {
  if (i < cb_start.length) {
    if (cb_start[i] != "") {
      cb_statusText.textContent = cb_start[i];
    }
  }
}

function cb_show_end(i) {
  if (i < cb_end.length) {
    if (cb_end[i] != "") {
      cb_statusText.textContent = cb_end[i];
    }
  } else {
    cb_statusText.textContent = "已经执行完当前步骤，请按\"下一步\"按钮";
  }
}

function cb_cook_end() {
  cb_statusText.textContent = "烹饪完成！";
}

function cb_showerr(s, lv) {
  alert(s);
}

function cb_showinfo(s, lv) {
  cb_info1.textContent = s;
}

function set_c() {
  s = ">set_c " + cb_index + "," + document.getElementById("in_2").value + "," + document.getElementById("in_3").value  + "," + document.getElementById("in_4").value + "," + document.getElementById("in_5").value + ";";
  cb_cmds[cb_index] = s;
  cb_start[cb_index] = document.getElementById("in_s").value;
  cb_end[cb_index] = document.getElementById("in_e").value;
  cb_index = cb_index + 1;
  cb_cmds[cb_index] = ">run_c;";
  document.getElementById("in_index").value = cb_index.toString();
  document.getElementById("in_s").value = "第" + cb_index + "步";
  document.getElementById("in_e").value = "";
}


function reset_c() {
  cb_index = 0;
  cb_cmds = new Array();
  cb_start = new Array();
  cb_end= new Array();

  document.getElementById("in_index").value = "0";
  document.getElementById("in_s").value = "第" + cb_index + "步";
  document.getElementById("in_e").value = "";
}

var gcb_connect_flg = false;

function $(id) {
  return document.getElementById(id);
}

$('connect').onclick = function(e) {
  if ($('connect').checked != gcb_connect_flg) {
    cb_set_connect_flg(gcb_connect_flg);
  }
  cb_connect_onclick();
};

function cb_set_connect_flg(f) {
  gcb_connect_flg = f;
  $('connect').checked = f;
}

function cb_connect_onclick() {
  if (gcb_connect_flg) {
    disconnect();
  } else {
    connect();
  }
}

function cb_ok() {
  if (gcb_connect_flg) {
    rn_break();
  } else {
    history.go(-1);
  }
}
