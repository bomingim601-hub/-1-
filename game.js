/* =====================================================
   환승연애♥  게임 진행 (1일차 ~ 5일차)
   글자는 script-data.js, 사진은 config.js 에 있어.
   ===================================================== */
const scr=$('scr'),fadeEl=$('fade'),alarmEl=$('alarm'),stage=$('stage');
const sleep=ms=>new Promise(r=>setTimeout(r,ms));
let st,idleT=null,idleOff=null;
const newState=()=>({y:{},lie:0,pr:0,sms:[]});   // y: 일차별로 유우시를 눌렀는지 / lie: 3일차 거짓 / pr: 퍼스널룸에서 유우시

/* ---------- 화면 도구 ---------- */
function set(h,o={}){
  scr.onscroll=null;
  scr.className=o.light?'light':'';
  const b=o.bg&&U(IMG[o.bg]);scr.style.backgroundImage=b?`url('${IMG[o.bg]}')`:'';
  scr.innerHTML='<div class="in'+(o.top?' top':'')+'">'+h+'</div>';scr.scrollTop=0;
  fadeEl.classList.remove('on');
}
const black=async ms=>{fadeEl.classList.add('on');await sleep(450+ms)};
function ask(q,opts,o={}){const dis=o.dis||[],glow=o.glow||[];
  return new Promise(res=>{
    set((q?`<p class="q">${q}</p>`:'')+opts.map((t,i)=>`<button class="box ${dis.includes(i)?'off':''} ${glow.includes(i)?'glow':''}" data-i="${i}">${t}</button>`).join(''),o);
    scr.querySelectorAll('.box').forEach(b=>b.onclick=()=>res(+b.dataset.i));
  });
}
function tap(h,btn='계속',o={}){return new Promise(res=>{set(h+`<button class="box" id="tapnx">${btn}</button>`,o);$('tapnx').onclick=res})}
async function say(h,ms,o={}){set(`<p class="q" style="margin:0">${h}</p>`,o);await sleep(ms)}
/* 한 줄씩 나오고, 화면을 누르면 다음 줄 */
async function story(lines,o={}){
  set('',{...o,top:1});const box=scr.querySelector('.in');box.style.paddingTop='14cqw';
  if(o.win)box.classList.add('win');  /* 배경 단색 부분 안에서만 대사가 보이게 */
  for(let i=0;i<lines.length;i++){
    const p=document.createElement('p');p.className='line';p.textContent=lines[i];box.appendChild(p);if(!o.win)scr.scrollTop=1e5;
    await new Promise(r=>{const f=()=>{scr.removeEventListener('click',f);r()};setTimeout(()=>scr.addEventListener('click',f),350)});
  }
}
/* 위쪽 알람 배너. 눌러야 넘어감 */
function alarm(title,sub='',o={}){return new Promise(res=>{
  const icon=U(IMG.iconMsg)?`<img src="${IMG.iconMsg}" style="width:100%;height:100%">`:'<svg viewBox="0 0 24 24"><path fill="#fff" d="M12 4C7 4 3 7.3 3 11.5c0 2.3 1.2 4.3 3 5.7L5.5 21l4-2.2c.8.2 1.6.3 2.5.3 5 0 9-3.3 9-7.6S17 4 12 4z"/></svg>';
  alarmEl.innerHTML=o.from
    ?`<button class="al ios" id="alb"><div class="av">${o.from[0]}<i>${icon}</i></div><div><b>${o.from}</b><span>${title}</span>${sub?`<span>${sub}</span>`:''}</div><em>지금</em></button>`
    :`<button class="al" id="alb"><div class="ai">${icon}</div><div><b>${title}</b>${sub?`<span>${sub}</span>`:''}</div></button>`;
  alarmEl.classList.add('on');const b=$('alb');
  setTimeout(()=>{b.classList.add('on');playDing()},250);
  b.onclick=()=>{b.classList.remove('on');setTimeout(()=>{alarmEl.classList.remove('on');alarmEl.innerHTML='';res()},300)};
})}
const phoneTime=async(tw)=>{await Phone.open(tw)};

/* 책상 위 카드 고르기 */
function cardPick(title,opts){return new Promise(res=>{
  const rot=[-6,4,-3,7,-5,3],dy=[0,2,-1,1,-2,0];
  set(`<p class="q">${title}</p><p class="hint" style="margin-top:-2cqw">마음이 가는 카드를 한 장 골라보세요</p><div class="cards">${opts.map((t,i)=>`<button class="kc" data-i="${i}" style="--r:${rot[i%6]}deg;--y:${dy[i%6]}cqw;animation-delay:${i*90}ms"><span>${t}</span></button>`).join('')}</div>`,{bg:'wood'});
  scr.classList.add('woodbg');
  let done=false;
  scr.querySelectorAll('.kc').forEach(b=>b.onclick=async()=>{if(done)return;done=true;
    scr.querySelectorAll('.kc').forEach(c=>c!==b&&c.classList.add('away'));const r=b.getBoundingClientRect(),S=stage.getBoundingClientRect();b.style.setProperty('--tx',(S.left+S.width/2-(r.left+r.width/2))+'px');b.style.setProperty('--ty',(S.top+S.height/2-(r.top+r.height/2))+'px');b.classList.add('pick');scr.querySelectorAll('.q,.hint').forEach(e=>{e.style.transition='opacity .5s';e.style.opacity=0});
    await sleep(1700);res(+b.dataset.i)});
})}

/* 퍼스널룸: 복도의 문 5개 중 하나 열기 */
function roomPick(){return new Promise(res=>{
  set(`<p class="q">출연자 퍼스널룸 공개 정보<small>기회는 단 한 번뿐이에요</small></p><div class="hall">${ROOM.map((r,i)=>`<button class="door" data-i="${i}" style="animation-delay:${i*80}ms"><span class="dlt"></span><span class="dlf"><i class="dp"></i><i class="dp"></i><b class="dn"><small>ROOM 0${i+1}</small>${r[0]}</b><i class="dk"></i></span></button>`).join('')}</div>`);
  let done=false;
  scr.querySelectorAll('.door').forEach(b=>b.onclick=async()=>{if(done)return;done=true;
    scr.querySelectorAll('.door').forEach(d=>d!==b&&d.classList.add('dim'));b.classList.add('open');
    await sleep(1300);fadeEl.classList.add('on');await sleep(500);res(+b.dataset.i)});
})}
function roomInfo(i){return new Promise(res=>{
  set(`<div class="pcard"><p class="pct">PERSONAL ROOM · 0${i+1}</p><b class="pcn">${ROOM[i][0]}</b><i class="pcl"></i><p class="pci">${ROOM[i][1]}</p><p class="pcs">공개 정보</p></div><button class="box" id="tapnx">방에서 나가기</button>`);
  $('tapnx').onclick=res;
})}

/* ---------- 공통 장면 ---------- */
async function dayCard(n,sub=''){await black(0);await say(`<span class="big">${n}일차</span>${sub?`<span class="sub">${sub}</span>`:''}`,sub?2400:1800)}

/* 문자 투표: 유우시를 누르면 '이제 잊기로 했잖아...' 후 유우시 칸이 까맣게 */
async function vote(d){
  const Y=NAMES.length-1;
  /* 성공 루트(1~3일차 유우시 시도 + 3일차 거짓말 + 퍼스널룸 유우시)면 4일차부터 유우시에게 투표 가능 */
  const open=d>=4&&st.lie&&st.pr&&st.y[1]&&st.y[2]&&st.y[3];
  const i=await smsAsk('vote',NAMES,open?{log:st.sms,day:d}:{reject:Y,rejectText:FORGET,onReject:()=>{st.y[d]=1},log:st.sms,day:d});
  if(open&&i==Y)st.y[d]=1;
  st.sms.push({day:d,kind:'vote',name:NAMES[i]});
  return i;
}
/* 투표 후: 1시간 후 → 알람 (→ 핸드폰) */
async function afterVote(d,o={}){
  await black(300);await say('1시간 후',1500);
  const special=(d>=3&&st.lie&&st.y[3]&&st.y[d]);   // 3일차 거짓말 이후로 X가 계속 고름
  if(special){
    await alarm(ALARM_PICKED,'',{from:'제작진'});
    await sleep(600);await alarm('X가 보낸 메시지입니다.',`"${X_MSG[d]||ALARM_PICKED_MSG}"`,{from:'제작진'});
    if(o.tweets){await black(1200);await alarm('메시지',ALARM_CHECK)}
  }else{
    await alarm(ALARM_NOPICK,'',{from:'제작진'});
    if(o.tweets){await sleep(600);await alarm('메시지',ALARM_CHECK)}
  }
  if(o.tweets)await Phone.open(o.tweets);
}

/* ---------- 1일차 ---------- */
async function d1(){
  await dayCard(1,'인터뷰룸');
  const L={light:1,bg:'interviewBg'};
  await say(INTRO,3000,L);
  const a=await ask(Q1,Q1_OPTS,L);
  await say(`${Q1_OPTS[a]}?<br><span style="font-size:4.6cqw;line-height:1.7;display:block;margin-top:3cqw">${Q1_ANSWERS[a]}</span>`,3500+Q1_ANSWERS[a].length*45,L);
  await ask(Q2,Q2_OPTS,L);
  await black(1000);
  await new Promise(res=>letterScene(LETTER1,`<button class="box" data-a="ok">다 읽었어요</button>`,{ok:res}));
  await black(3000);
  await vote(1);
  await afterVote(1,{tweets:TW_DAY1});
}
/* ---------- 2일차 (핸드폰 없음) ---------- */
async function d2(){
  await dayCard(2);
  await cardPick(DATE_Q,DATE_OPTS);
  await black(1000);
  await say(DATE_AFTER,3000);
  await black(2000);
  await vote(2);
  await afterVote(2);
}
/* ---------- 3일차 ---------- */
const CAV='<div class="cav"><svg viewBox="0 0 24 24"><circle cx="12" cy="8" r="4.5"/><path d="M3 22a9 9 0 0118 0z"/></svg></div>';
async function d3(){
  await dayCard(3);
  set(`<div class="chat" id="chat"><div class="ttl">${SECRET.title}</div></div>`,{top:1});
  const chat=$('chat'),push=(t,me)=>{const r=document.createElement('div');r.className='crow'+(me?' me':'');r.innerHTML=(me?'':CAV)+'<div class="bub"></div>';r.querySelector('.bub').textContent=t;chat.appendChild(r);scr.scrollTop=1e5};
  await sleep(900);push(SECRET.ask);await sleep(900);
  const o=document.createElement('div');o.style.cssText='display:flex;flex-direction:column;gap:3cqw;margin-top:4cqw';
  o.innerHTML=`<button class="box" data-i="0">${SECRET.truth.label}</button><button class="box" data-i="1">${SECRET.lie.label}</button>`;chat.appendChild(o);scr.scrollTop=1e5;
  const c=await new Promise(r=>o.querySelectorAll('.box').forEach(b=>b.onclick=()=>r(+b.dataset.i)));
  st.lie=c;o.remove();
  await sleep(500);push(c?SECRET.lie.say:SECRET.truth.say,1);
  await sleep(1300);push(SECRET.thanks);
  await sleep(2500);
  await black(1200);
  await say(EVENING,2000);
  await black(800);
  await story(KNIFE);
  await black(300);
  await vote(3);
  await afterVote(3,{tweets:TW_DAY3});
}
/* ---------- 4일차 (핸드폰 없음) ---------- */
async function d4(){
  await dayCard(4);
  await story(st.lie?SUCC_CONV:FAIL_CONV,{bg:'lastChatBg',win:1});
  await black(500);
  const c=await ask('',['X룸에 들어간다','퍼스널룸에 들어간다']);
  if(c==0){await xRoom()}
  else{
    const i=await roomPick();
    if(i==NAMES.length-1)st.pr=1;
    await roomInfo(i);
  }
  await black(300);
  await vote(4);
  await afterVote(4);
}
/* ---------- 5일차 ---------- */
async function d5(){
  await dayCard(5);
  const ok=!!(st.lie&&st.pr&&st.y[1]&&st.y[2]&&st.y[3]&&st.y[4]);
  const Y=NAMES.length-1,others=NAMES.map((_,i)=>i).filter(i=>i!=Y);
  await smsAsk('final',NAMES,ok?{dis:others,glow:[Y],log:st.sms,day:5}:{dis:[Y],log:st.sms,day:5});
  await black(300);
  const tw=ok?TW_SUCCESS:TW_FAIL;   // 실제 엔딩(재회 성공 여부)에 맞는 트윗
  if(ok){await alarm(ALARM_PICKED,'',{from:'제작진'});await sleep(600);await alarm('메시지',ALARM_CHECK)}
  else{await say('1시간 후',1500);await alarm(ALARM_NOPICK,'',{from:'제작진'});await sleep(600);await alarm('메시지',ALARM_CHECK)}
  await Phone.open(tw);
  await black(600);
  if(ok)end(SETTINGS.endingTitle,SETTINGS.endingText,true);
  else end(SETTINGS.badTitle,SETTINGS.badText,false);
}

/* ---------- 엔딩 / 처음으로 / 히든 ---------- */
function stopIdle(){clearTimeout(idleT);if(idleOff){idleOff();idleOff=null}}
function end(t,d,hid){
  set(`<div class="endbox"><h2>${t}</h2></div><p class="q">${d}</p><button class="box" id="re">처음으로 돌아가기</button>`);
  $('re').onclick=title;
  if(hid){
    const arm=()=>{clearTimeout(idleT);idleT=setTimeout(runHidden,SETTINGS.hiddenIdleSeconds*1000)};
    ['pointerdown','keydown'].forEach(e=>stage.addEventListener(e,arm));
    idleOff=()=>['pointerdown','keydown'].forEach(e=>stage.removeEventListener(e,arm));
    arm();
  }
}
async function runHidden(){
  stopIdle();
  await black(500);
  await say(HIDDEN_WAIT,2200);
  await black(600);
  await Phone.openHidden();          // 폰 아래 바로 닫으면 끝
  end(SETTINGS.endingTitle,SETTINGS.endingText,false);
}
function title(){
  stopIdle();Phone.reset();alarmEl.classList.remove('on');$('ov').classList.remove('on');
  st=newState();
  set(`<h1 class="title">환승연애♥</h1><button class="box" id="go">시작</button>`);
  $('go').onclick=play;
}
async function play(){st=newState();await d1();await d2();await d3();await d4();await d5()}

/* ---------- 시작: 사진 확인 후 타이틀 ---------- */
(async()=>{
  const all=Object.values(IMG).flat();
  await Promise.race([preloadImages(all),sleep(4000)]);
  title();
})();
