var cb_statusText = document.querySelector('#statusText');
var cb_info1 = document.querySelector('#info1');
var cb_info2 = document.querySelector('#info2');
var cb_info3 = document.querySelector('#info3');


var cb_cmds = [
">set_c 0,0,s,0,1;",
">set_c 1,2,s,180,1;",
">set_c 2,3,n,180,90;",
">set_c 3,4,s,0,1;",
">set_c 4,2,s,220,1;",
">set_c 5,3,n,220,30;",
">set_c 6,4,s,0,1;",

">run_c;"
];


/*
var cb_cmds = [
">set_c 0,0,s,0,1;",
">set_c 1,3,s,180,20;",
">set_c 2,3,n,180,90;",
">set_c 3,4,s,0,1;",
">set_c 4,3,s,220,10;",
">set_c 5,3,n,220,30;",
">set_c 6,4,s,0,1;",

">run_c;"
];
*/

var cb_start = [
"准备好食材,并把油放入锅中,然后点\"下一步\"",
"加热到180摄氏度",
"炸熟排骨",
"请捞出排骨,然后点\"下一步\"",
"加热到220摄氏度",
"炸脆排骨",
"",

""
];

var cb_end = [
"",
"把排骨放入锅中,然后点\"下一步\"",
"",
"",
"把排骨放入锅中,然后点\"下一步\"",
"",
"请捞出排骨并装盘,然后点\"下一步\"完成烹饪",

""
];


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
  if (lv == 0) {
    cb_info1.textContent = s;
  } else if (lv == 1) {
    cb_info2.textContent = s;
  } else {
    cb_info3.textContent = s;
  }
}
