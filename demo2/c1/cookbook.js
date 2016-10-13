var cb_statusText = document.querySelector('#statusText');
var cb_info1 = document.querySelector('#info1');
var cb_info2 = document.querySelector('#info2');

var container = document.getElementById(container);

var cb_cmds = [
">set_c 0,0,s,0,1;",
">set_c 1,2,s,180,1;",
">set_c 2,3,n,180,900;",
">set_c 3,4,s,0,1;",
">set_c 4,2,s,220,1;",
">set_c 5,3,n,220,300;",
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

var cb_start = 
[
"<img src=\"img/QQ图片20160829100748.png\" style=\"width:100%;height: 240px;\"><ul  style=\"list-style:none;margin-left: 20px;margin-right: 20px;margin-top: 10px; display:inline-block;\"><li>1.葱洗净切段，姜切丝</li><li>2.大蒜去皮洗净剁碎</li><li>3.排骨化冻切成寸段，洗净控干放盆。</li><li>4.加入生抽，料酒，盐，味精，白糖，胡椒粉，切好的葱姜。</li><li>5.抓匀腌30分钟。颜色不要太深，盐味不要太重。</li></ul><button onclick=run_n(); class=\"weui_btn weui_btn_plain_primary\" style=\"margin-top: 20px;background-color: #08607F;color:#fff;border:none; position:absolute; bottom:50px;left:5%; width:90%;\">准备完毕，开始做菜</button><div class=\"b\" style=\"margin-top: 30px;\"></div>",
"<img src=\"img/QQ图片20160901164649.png\" style=\"width:100%;height: 240px;\"><ul  style=\"list-style:none; line-height: 30px;margin-left: 20px;margin-right: 20px;margin-top: 10px;\"><li>1 智控锅内放适量色拉油，烧热到150度</li></ul><button onclick=run_n(); class=\"weui_btn weui_btn_plain_primary\" style=\"margin-top: 20px;background-color: #08607F;color:#fff;border:none; position:absolute; bottom:50px;left:5%; width:90%;\">下一步</button></div>",
"<img src=\"img/QQ图片20160901164715.png\" style=\"width:100%;height: 240px;\"><ul  style=\"list-style:none; line-height: 30px;margin-left: 20px;margin-right: 20px;margin-top: 10px;\"><li>2 放入蒜末，温度调至60度，煸炒90秒</li></ul></ul><button onclick=run_n(); class=\"weui_btn weui_btn_plain_primary\" style=\"margin-top: 20px;background-color: #08607F;color:#fff;border:none; position:absolute; bottom:50px;left:5%; width:90%;\">下一步</button>",
"请捞出排骨,然后点\"下一步\"",
"加热到220摄氏度",
"炸脆排骨",
"",

""
];


<button onclick=run_n(); class=\"weui_btn weui_btn_plain_primary\" style=\"margin-top: 20px;background-color: #08607F;color:#fff;border:none; position:absolute; bottom:50px;left:5%; width:90%;\">下一步</button>



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
      container.innerHTML = cb_start[i];
    }
  }
}

function cb_show_end(i) {
  if (i < cb_end.length) {
    if (cb_end[i] != "") {
      container.innerHTML = cb_end[i];
    }
  } else {
    cb_statusText.textContent = "<button onclick=run_n(); class=\"weui_btn weui_btn_plain_primary\" style=\"margin-top: 20px;background-color: #08607F;color:#fff;border:none; position:absolute; bottom:50px;left:5%; width:90%;\">准备完毕，开始做菜</button><div class=\"b\" style=\"margin-top: 30px;\">";
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
  }
}
