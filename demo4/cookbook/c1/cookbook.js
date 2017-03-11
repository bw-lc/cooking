/*cookbook.js*/

/*-------Initialize Swiper--------------------------------------------------------------------------------*/
var gcb_media = document.getElementById('media');
var gcb_media_end = document.getElementById('media_end');

var gcb_play_flg = true;
var gcb_connect_flg = false;
var gcb_mute_flg = true;

var gcb_running = false;

var gcb_swiper = new Swiper('.swiper-container', {
  pagination: '.swiper-pagination',
  paginationClickable: true,
  nextButton: '.button-next',
  playBgImg: '-128px',
  connectImg: '-313px',
  muteImg: '-254px',
  temperature: "___°",
  time: '_:__:__',
  onInit: cb_onInit,
  onSlideChangeStart: cb_onSlideChangeStart
});


function __cb_onInit(swiper) {
  var index = swiper.activeIndex;
  var __play = document.getElementsByClassName('play')[index];
  var __connect = document.getElementsByClassName('connect')[index];
  var __mute = document.getElementsByClassName('mute')[index];
  var __temperature = document.getElementsByClassName('cb_temperature')[index];
  var __time = document.getElementsByClassName('cb_time')[index];

  __play.style.backgroundPositionX=swiper.params.playBgImg;
  __connect.style.backgroundPositionX=swiper.params.connectImg;
  __mute.style.backgroundPositionX=swiper.params.muteImg;
  __temperature.textContent = swiper.params.temperature;
  __time.textContent = swiper.params.time;

  __play.onclick = cb_play_onclick;
  __connect.onclick = cb_connect_onclick;
  __mute.onclick = cb_mute_onclick;
  //__time.onclick = cb_last;
}  

function cb_onInit(swiper) {
  if(!swiper.isEnd) {
    __cb_onInit(swiper);
  }
}


function cb_onSlideChangeStart(swiper) {
  if (swiper.activeIndex == 1) {
    gcb_media.play();
    gcb_media_end.play();
    gcb_media.pause();
    gcb_media_end.pause();
  }
  
  if(!swiper.isEnd) {
    __cb_onInit(swiper);
  }
}

/*function cb_last() {
  rn_disconnect();
  history.go(-1);
}*/

function cb_set_play_flg(f) {
  var index = gcb_swiper.activeIndex;
  var __play = document.getElementsByClassName('play')[index];
  gcb_play_flg = f;
  if(gcb_play_flg) {
    __play.style.backgroundPositionX = "-128px";
    gcb_swiper.params.playBgImg = "-128px";
  } else {
    __play.style.backgroundPositionX = "-192px";
    gcb_swiper.params.playBgImg = "-192px";
  }
}

function cb_set_connect_flg(f) {
  var index = gcb_swiper.activeIndex;
  var __connect = document.getElementsByClassName('connect')[index];

  gcb_connect_flg = f;
  if(gcb_connect_flg) {
    __connect.style.backgroundPositionX = "-64px";
    gcb_swiper.params.connectImg = "-64px";
  } else {
    __connect.style.backgroundPositionX = "-313px";
    gcb_swiper.params.connectImg = "-313px";
  }
}

function cb_set_mute_flg(f) {
  var index = gcb_swiper.activeIndex;
  var __mute = document.getElementsByClassName('mute')[index];

  gcb_mute_flg = f;
  if(gcb_mute_flg) {
    __mute.style.backgroundPositionX = "-254px";
    gcb_swiper.params.muteImg = "-254px";
  } else {
    gcb_media.pause();
    gcb_media_end.pause();
    __mute.style.backgroundPositionX = "0px";
    gcb_swiper.params.muteImg = "0px";
  }
}

function cb_set_run_info(temperature, time) {
  var index = gcb_swiper.activeIndex;
  var __temperature = document.getElementsByClassName('cb_temperature')[index];
  var __time = document.getElementsByClassName('cb_time')[index];
  
  temperature = Math.floor(temperature / 1);
  __temperature.textContent = temperature + "°";
  gcb_swiper.params.temperature = temperature + "°";

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
  __time.textContent = s;
  gcb_swiper.params.time = s;
}

function cb_play_onclick() {
  if (gcb_play_flg) {
    rn_pause(1);
  } else {
    rn_pause(0);
  }
}

function cb_connect_onclick() {
  if (gcb_connect_flg) {
    rn_disconnect();
  } else {
    rn_connect();
  }
}

function cb_mute_onclick() {
  cb_set_mute_flg(!gcb_mute_flg);
}

function cb_slideTo(index) {
  gcb_swiper.slideTo(index, 300, true);
}

function cb_slideNext() {
  gcb_swiper.slideNext();
}

function cb_lockSwipes() {
  gcb_swiper.lockSwipes();
}

function cb_unlockSwipes() {
  gcb_swiper.unlockSwipes();
}

function cb_media_play() {
  if (gcb_mute_flg) {
    gcb_media.play();
  }
}


function cb_ok(url) {
  rn_leave();
  //window.location.href = url;
}


/*-----cookbook-------------------------------------------------------------------------------------------*/


var gcb_cmds = [
{"cmd": ">set_c 0,2,s,140,1;", "swiper_index": 1, "start_js": "gcb_media.pause()", "end_js": "cb_media_play()"},
{"cmd": ">set_c 1,3,n,140,180;", "swiper_index": 2, "start_js": "gcb_media.pause()", "end_js": ""},
{"cmd": ">set_c 2,4,s,0,1;", "swiper_index": 3, "start_js": "", "end_js": "cb_media_play()"},

{"cmd": ">set_c 3,2,s,180,1;", "swiper_index": 4, "start_js": "gcb_media.pause()", "end_js": "cb_media_play()"},
{"cmd": ">set_c 4,3,n,180,600;", "swiper_index": 5, "start_js": "gcb_media.pause()", "end_js": ""},
{"cmd": ">set_c 5,4,s,0,1;", "swiper_index": 6, "start_js": "", "end_js": "cb_media_play()"},

{"cmd": ">set_c 6,2,s,220,1;", "swiper_index": 7, "start_js": "gcb_media.pause()", "end_js": "cb_media_play()"},
{"cmd": ">set_c 7,3,n,220,300;", "swiper_index": 8, "start_js": "gcb_media.pause()", "end_js": ""},
{"cmd": ">set_c 8,4,s,0,1;", "swiper_index": 9, "start_js": "", "end_js": "cb_media_play()"},

{"cmd": ">set_c 9,2,s,260,1;", "swiper_index": 10, "start_js": "gcb_media.pause()", "end_js": "cb_media_play()"},
{"cmd": ">set_c 10,3,n,260,30;", "swiper_index": 11, "start_js": "gcb_media.pause()", "end_js": ""},
{"cmd": ">set_c 11,4,n,0,1;", "swiper_index": 12, "start_js": "", "end_js": "cb_media_play()"},

{"cmd": ">run_c;", "swiper_index": 13, "start_js": "", "end_js": ""}
];

/*

var gcb_cmds = [
{"cmd": ">set_c 0,2,s,45,1;", "swiper_index": 1, "start_js": "gcb_media.pause()", "end_js": "cb_media_play()"},
{"cmd": ">set_c 1,3,n,45,18;", "swiper_index": 2, "start_js": "gcb_media.pause()", "end_js": ""},
{"cmd": ">set_c 2,4,s,0,1;", "swiper_index": 3, "start_js": "", "end_js": "cb_media_play()"},

{"cmd": ">set_c 3,2,s,55,1;", "swiper_index": 4, "start_js": "gcb_media.pause()", "end_js": "cb_media_play()"},
{"cmd": ">set_c 4,3,n,55,60;", "swiper_index": 5, "start_js": "gcb_media.pause()", "end_js": ""},
{"cmd": ">set_c 5,4,s,0,1;", "swiper_index": 6, "start_js": "", "end_js": "cb_media_play()"},

{"cmd": ">set_c 6,2,s,65,1;", "swiper_index": 7, "start_js": "gcb_media.pause()", "end_js": "cb_media_play()"},
{"cmd": ">set_c 7,3,n,65,30;", "swiper_index": 8, "start_js": "gcb_media.pause()", "end_js": ""},
{"cmd": ">set_c 8,4,s,0,1;", "swiper_index": 9, "start_js": "", "end_js": "cb_media_play()"},

{"cmd": ">set_c 9,2,s,75,1;", "swiper_index": 10, "start_js": "gcb_media.pause()", "end_js": "cb_media_play()"},
{"cmd": ">set_c 10,3,n,75,10;", "swiper_index": 11, "start_js": "gcb_media.pause()", "end_js": ""},
{"cmd": ">set_c 11,4,n,0,1;", "swiper_index": 12, "start_js": "", "end_js": "cb_media_play()"},

{"cmd": ">run_c;", "swiper_index": 13, "start_js": "", "end_js": ""}
];
*/

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
    cb_unlockSwipes();
    cb_slideTo(gcb_cmds[i]["swiper_index"]);
    cb_lockSwipes();
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
  if (gcb_mute_flg) {
    gcb_media_end.play();
  }
  cb_unlockSwipes();
  cb_slideTo(13);
  cb_lockSwipes();
}


function cb_showerr(s, lv) {
  alert(s);
}

/*
//var cb_statusText = document.getElementById('statusText');
function cb_showinfo(str, lv, ms) {
  var cb_statusText = document.getElementById('statusText');
  if(str !== 'undefined') {
    cb_statusText.innerHTML = str;
    setTimeout("document.getElementById('statusText').style.display = 'none';", ms);
  }
}
*/

var cb_statusText = document.getElementsByClassName('statusText');
function cb_showinfo_none() {
  for (var i = 0; i < cb_statusText.length; i++) {
    //cb_statusText[i].style.color = '#ff0000';
    cb_statusText[i].innerHTML = '';
  }
}
function cb_showinfo(str, lv, ms) {
  if (lv == 0) {
    for (var i = 0; i < cb_statusText.length; i++) {
      //cb_statusText[i].style.color = '#ff0000';
      cb_statusText[i].innerHTML = str;
      setTimeout("cb_showinfo_none()", ms);
    }
  }
}

function cb_next() {
  
  if (gcb_running) {
    //cb_unlockSwipes();
    //cb_slideNext();
    //cb_lockSwipes();
    rn_run_n();
  } else {
    cb_slideNext();
  }
}

function cb_end() {
  
  if (gcb_running) {
    //cb_unlockSwipes();
    //cb_slideNext();
    //cb_lockSwipes();
    rn_run_n();
  } else {
    rn_disconnect();
    cb_slideNext();
  }

}

function __cb_start() {
  gcb_running = rn_run_c();
  if (gcb_running) {
    cb_lockSwipes();
  }
}

function cb_start() {
  cb_slideNext();
  setTimeout("__cb_start();", 1);
}

/*end file*/
