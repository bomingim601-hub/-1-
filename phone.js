/* =====================================================
   핸드폰 (아이폰16 스타일)  — 전화 / 메시지 / X / 메모 / (히든) 인스타
   ===================================================== */
/* 사진이 진짜 있는지 확인해서 없으면 회색 자리표시로 대신함 */
const OKIMG={};
function preloadImages(list){return Promise.all(list.filter(Boolean).map(u=>new Promise(r=>{const i=new Image();i.onload=()=>{OKIMG[u]=1;r()};i.onerror=()=>r();i.src=u})))}
const U=u=>u&&OKIMG[u]?u:'';
let _ac;
/* 알림음: 한 번 터치했을 때 미리 풀어둔 소리를 계속 재사용 (아이폰에서 자동 재생 막히는 것 방지) */
const _ding=new Audio(SOUND.ding);_ding.preload='auto';_ding.volume=.8;
function playDing(){
  try{_ding.pause();_ding.currentTime=0;_ding.play().catch(webDing)}catch(e){webDing()}
}
function _unlockDing(){try{_ding.muted=true;_ding.play().then(()=>{_ding.pause();_ding.currentTime=0;_ding.muted=false}).catch(()=>{_ding.muted=false})}catch(e){}
  try{_ac=_ac||new(window.AudioContext||window.webkitAudioContext)();_ac.resume&&_ac.resume()}catch(e){}}
document.addEventListener('touchend',_unlockDing,{once:true});document.addEventListener('click',_unlockDing,{once:true});
function webDing(){try{_ac=_ac||new(window.AudioContext||window.webkitAudioContext)();const c=_ac,o=c.createOscillator(),g=c.createGain();o.connect(g);g.connect(c.destination);o.frequency.value=880;g.gain.setValueAtTime(.25,c.currentTime);g.gain.exponentialRampToValueAtTime(.001,c.currentTime+.7);o.start();o.stop(c.currentTime+.7)}catch(e){}}
const iconImg=(k,color,svg)=>U(IMG[k])?`<img src="${IMG[k]}">`:`<div class="fbi" style="background:${color}">${svg}</div>`;
const $=i=>document.getElementById(i),P=$('phone');
const FAV=['엄마','아빠','큰오빠','작은오빠'];
const REC=[['02-2006-0621','전화번호',1,'어제'],['큰오빠','휴대전화',0,'어제'],['엄마','휴대전화',0,'어제'],['엄마','휴대전화',0,'일요일'],['아빠','휴대전화',0,'일요일'],['작은오빠','휴대전화',0,'토요일']];
const MS=[['엄마','대영아 사랑해^^'],['큰오빠','쫄지말고 원래 잘 하잖아'],['작은오빠','대영아 대구여자 보여주라'],['아빠','아빠가 걱정이 많네.. 딸 사랑해']];
const thInit=k=>(typeof FAMILY_CHAT!=='undefined'&&FAMILY_CHAT[k])?FAMILY_CHAT[k].map(m=>m[0]=='t'?['t',m[1]]:[m[0],m[1]?1:0]):[[MS.find(m=>m[0]==k)[1],0]];
const TH={};MS.forEach(m=>TH[m[0]]=thInit(m[0]));
const KEYS=[['1',''],['2','ABC'],['3','DEF'],['4','GHI'],['5','JKL'],['6','MNO'],['7','PQRS'],['8','TUV'],['9','WXYZ'],['*',''],['0','+'],['#','']];
let tab='fav',num='',cur='home',curT='',NT=[],ci=-1,T,nTm,gi=0,igOn=false,curTW=[];
const S=(p,x='')=>`<svg viewBox="0 0 24 24" ${x}>${p}</svg>`;
const ico={back:S('<path d="M15 4l-8 8 8 8"/>','fill="none" stroke="currentColor" stroke-width="2.6"'),
star:S('<path d="M12 2l3 6.9 7.5.7-5.7 5 1.7 7.4L12 18l-6.5 4 1.7-7.4-5.7-5 7.5-.7z"/>','fill="currentColor"'),
clock:S('<circle cx="12" cy="12" r="10"/><path d="M12 6v6H8" stroke="#fff" stroke-width="2" fill="none"/>','fill="currentColor"'),
person:S('<circle cx="12" cy="12" r="10"/><circle cx="12" cy="10" r="3.5" fill="#fff"/><path d="M5.5 19a7 7 0 0113 0z" fill="#fff"/>','fill="currentColor"'),
keypad:S([5,12,19].flatMap(x=>[3.5,9,14.5,20].map(y=>`<circle cx="${x}" cy="${y}" r="2.3"/>`)).join(''),'fill="currentColor"'),
vm:'<svg viewBox="0 0 28 24" fill="none" stroke="currentColor" stroke-width="2.4"><circle cx="7" cy="12" r="5.5"/><circle cx="21" cy="12" r="5.5"/><path d="M7 17.5h14"/></svg>',
ph:S('<path d="M6.6 10.8a15 15 0 006.6 6.6l2.2-2.2a1 1 0 011-.25 11 11 0 003.6.6 1 1 0 011 1V20a1 1 0 01-1 1A17 17 0 013 4a1 1 0 011-1h3.5a1 1 0 011 1 11 11 0 00.6 3.6 1 1 0 01-.25 1z"/>'),
person2:S('<circle cx="12" cy="8" r="4.5"/><path d="M3 22a9 9 0 0118 0z"/>'),
home:S('<path d="M3 11l9-8 9 8v10h-6v-6H9v6H3z"/>'),search:S('<circle cx="10.5" cy="10.5" r="7"/><path d="M16 16l5 5"/>'),bell:S('<path d="M6 17V11a6 6 0 0112 0v6l2 2H4zM10 21h4"/>'),mail:S('<rect x="3" y="5" width="18" height="14" rx="2"/><path d="M3 7l9 7 9-7"/>'),
reel:S('<rect x="3" y="3" width="18" height="18" rx="5"/><path d="M10 8l6 4-6 4z"/>'),send:S('<path d="M21 3L3 10l7 3 3 7z"/>')};
const igI=()=>{const d='g'+gi++;return `<svg viewBox="0 0 100 100"><defs><linearGradient id="${d}" x1="0" y1="1" x2="1" y2="0"><stop offset="0" stop-color="#fdc468"/><stop offset=".35" stop-color="#f1565f"/><stop offset=".7" stop-color="#c13584"/><stop offset="1" stop-color="#5851db"/></linearGradient></defs><rect width="100" height="100" fill="url(#${d})"/><rect x="22" y="22" width="56" height="56" rx="16" fill="none" stroke="#fff" stroke-width="6"/><circle cx="50" cy="50" r="13" fill="none" stroke="#fff" stroke-width="6"/><circle cx="68" cy="32" r="3.8" fill="#fff"/></svg>`};
const xI=()=>'<svg viewBox="0 0 100 100"><rect width="100" height="100" fill="#000"/><path d="M26 24h15l33 52H59z" fill="#fff"/><path d="M73 24L28 76" stroke="#fff" stroke-width="6" stroke-linecap="round"/></svg>';
/* 트위터 영어 아이디 (이름마다 항상 같은 아이디로 나옴) */
const HW1=["moon","cozy","dreamy","peach","night","milky","sunny","lazy","mint","honey","cloudy","pinky","sleepy","blue","berry","soft"];
const HW2=["cat","bunny","holic","lover","diary","log","zip","toast","mochi","jelly","star","fan","bear","tea","day","bean"];
const handle=n=>{const F=(IMG.twFixed||{})[n];if(F&&F.id)return F.id;if(/^[a-z0-9_]+$/i.test(n))return n;let h=7;for(const c of n)h=(h*131+c.charCodeAt(0))%1000003;
  const sep=["_","","_",""][h%4];return HW1[h%16]+sep+HW2[(h>>4)%16]+(h%3?String(h%97).padStart(2,'0'):'')};
/* 트위터 프사: 모든 트윗 아이디를 순서대로 사진에 배정 */
let _avMap=null;
const twAv=n=>{const F=(IMG.twFixed||{})[n];if(F&&F.av)return `<div class="ta2" style="background:#333 url('${F.av}') center/cover"></div>`;const L=(IMG.twAvatars||[]);
  if(L.length){if(!_avMap){_avMap={};let k=0;for(const t of [...TW_DAY1,...TW_DAY3,...TW_FAIL,...TW_SUCCESS])if(!(t[0] in _avMap)&&!(IMG.twFixed||{})[t[0]])_avMap[t[0]]=k++}
    return `<div class="ta2" style="background:#333 url('${L[(_avMap[n]??0)%L.length]}') center/cover"></div>`}
  return `<div class="ta2" style="background:hsl(${hue(n)} 40% 38%)">${n[0]}</div>`};
const hue=s=>{let h=0;for(const c of s)h=(h*31+c.charCodeAt(0))%360;return h};
const av=(n,c='')=>`<div class="av ${c}">${/^\d/.test(n)?ico.person2:n.length<=2?n:n[0]}</div>`;
const bg=u=>U(u)?`style="background:url('${u}') center/cover"`:'';
const R={igp:()=>{},igf:()=>{},igr:()=>{},igs:()=>{},igme:()=>{},home:rHome,call:rCall,msg:rMsg,memo:rMemo,ig:rIG,dm:rDM,x:rX,lock:rLock};
function go(n){if(cur==='note'&&n!=='memo'&&$('ta'))saveNote();(R[n]||(()=>{}))();document.querySelectorAll('.v').forEach(v=>v.classList.toggle('on',v.id==='v-'+n));P.dataset.t={home:'l',x:'l',lock:'l',calling:'l'}[n]||'d';cur=n}
function rHome(){const a=[['call','전화',`${iconImg('iconCall','#34c759',ico.ph)}`,0],['msg','메시지',`${iconImg('iconMsg','#34c759',ico.ph)}`,0],['memo','메모',`${iconImg('iconMemo','#ffd60a',ico.home)}`,0],['x','X',xI(),0]];if(igOn)a.splice(3,1,['dm','인스타그램',igI(),1]);
$('v-home').style.backgroundImage=U(IMG.homeWallpaper)?`url('${IMG.homeWallpaper}')`:'';
$('v-home').innerHTML=`<div class="homehint">아래 바를 눌러(또는 위로 쓸어) 핸드폰 닫기</div><div class="apps">${a.map(x=>`<button class="ap" onclick="go('${x[0]}')"><div class="ic">${x[2]}</div>${x[3]?'<i class="bd">1</i>':''}${x[1]}</button>`).join('')}</div>`}
const tabbar=()=>`<nav class="tb">${[['fav','즐겨찾기',ico.star],['rec','최근 통화',ico.clock],['ct','연락처',ico.person],['kp','키패드',ico.keypad],['vm','음성 사서함',ico.vm]].map(t=>`<button class="${tab==t[0]?'on':''}" onclick="tab='${t[0]}';rCall()">${t[2]}${t[1]}</button>`).join('')}</nav>`;
const row=(n,s,m,d)=>`<div class="row" data-n="${n}" onclick="callTo(this.dataset.n)">${av(n)}<div class="rt"><b class="${m?'rd':''}">${n}</b><small>${m?'↙ ':''}${s}</small></div>${d?`<span class="dy">${d}</span>`:''}<button class="inf" onclick="event.stopPropagation()">i</button></div>`;
function rCall(){let b;
if(tab=='kp')b=`<div class="num">${num||'&nbsp;'}${num?'<button class="bs" onclick="bk()">⌫</button>':''}</div><div class="kp">${KEYS.map(k=>`<button onclick="num+='${k[0]}';rCall()"><b>${k[0]}</b><i>${k[1]}</i></button>`).join('')}</div><button class="cg" onclick="callTo(num)">${ico.ph}</button>`;
else{const L={fav:FAV.map(n=>row(n,'휴대전화')),rec:REC.map(r=>row(r[0],r[1],r[2],r[3])),ct:[...FAV].sort().map(n=>row(n,'휴대전화')),vm:[]}[tab];
b=`<div class="hd"><button class="pb">편집</button><button class="pb">${tab=='rec'?'☰':'＋'}</button></div><div class="sc"><h2 class="t">${{fav:'즐겨찾기',rec:'최근 통화',ct:'연락처',vm:'음성 사서함'}[tab]}</h2>${L.join('')||'<p class="em">음성 사서함이 없어요</p>'}</div>`}
$('v-call').innerHTML=b+tabbar()}
function bk(){num=num.slice(0,-1);rCall()}
function callTo(n){$('v-calling').innerHTML=`<div class="cn"><h3>${n||'번호 없음'}</h3><p id="ct">전화 거는 중...</p></div><button class="end" onclick="endCall()">${ico.ph}</button>`;go('calling');let s=0;clearInterval(T);setTimeout(()=>{T=setInterval(()=>{s++;const e=$('ct');if(e)e.textContent=String(s/60|0).padStart(2,'0')+':'+String(s%60).padStart(2,'0')},1000);const e=$('ct');if(e)e.textContent='00:00'},1500)}
function endCall(){clearInterval(T);go('call')}
function rMsg(){$('v-msg').innerHTML=`<div class="hd"><button class="pb">편집</button><button class="pb">☰</button></div><div class="sc"><h2 class="t">메시지</h2>${MS.map((m,i)=>`<div class="row" data-n="${m[0]}" onclick="openTh(this.dataset.n)">${i==0?'<i class="dot"></i>':''}${av(m[0])}<div class="rt"><b>${m[0]}</b><small>${m[1]}</small></div><span class="dy">어제 ›</span></div>`).join('')}</div><div class="sb"><div class="sp">⌕&nbsp;검색</div><button class="pb sq">✎</button></div>`}
function openTh(n){curT=n;rTh();go('thread');requestAnimationFrame(()=>{const t=$('ths');if(t)t.scrollTop=1e5})}
function rTh(){const L=TH[curT];let h='';
  const nowT=()=>{const d=new Date();return `오후 ${((d.getHours()+11)%12)+1}:${String(d.getMinutes()).padStart(2,'0')}`};
  L.forEach((m,i)=>{if(m[0]=='t'){h+=`<p class="tdt">${m[1].replace(/(\(.*?\))/,'<b>$1</b>')}</p>`;return}
    const nx=L[i+1],last=!nx||nx[0]=='t'||nx[1]!==m[1];
    h+=`<div class="bb ${m[1]?'me':''}${last?' tl':''}">${m[0]}</div>`});
  let li=-1;L.forEach((m,i)=>{if(m[0]!='t'&&m[1])li=i});
  const lastMe=li>=0&&L.slice(li+1).every(m=>m[0]=='t'||m[1]);
  if(lastMe)h+=`<p class="rd">${L[li][2]?'전송됨':'읽음'}</p>`;
  $('v-thread').innerHTML=`<div class="thh"><button class="pb" onclick="go('msg')">${ico.back}</button><div class="thp">${av(curT)}<div class="thn">${curT} <i>›</i></div></div><span class="thv"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"><rect x="2.5" y="6" width="13" height="12" rx="2.5"/><path d="m15.5 10.5 6-3.5v10l-6-3.5z"/></svg></span></div><div class="sc th" id="ths">${h}</div><div class="sb"><span class="tpl">＋</span><input id="ti" class="sp" placeholder="iMessage" onkeydown="if(event.key=='Enter')snd()"><button class="pb sq" onclick="snd()">↑</button></div>`;const s=$('ths');s.scrollTop=1e5}
function snd(){const v=$('ti').value.trim();if(!v)return;const L=TH[curT],d=new Date();if(!L.some(m=>m[0]=='t'&&m[1].startsWith('오늘')))L.push(['t',`오늘 오후 ${((d.getHours()+11)%12)+1}:${String(d.getMinutes()).padStart(2,'0')}`]);L.push([v,1,1]);if(typeof sendSound=='function')sendSound();rTh();$('ti').focus()}
function rMemo(){$('v-memo').innerHTML=`<div class="hd"><button class="pb" onclick="go('home')">${ico.back}</button><span></span></div><div class="sc"><h2 class="t">메모</h2><small class="cnt">${NT.length}개의 메모</small>${NT.length?'<div class="card">'+NT.map((t,i)=>{const [a,...b]=t.split('\n');return `<div class="row" onclick="openNote(${i})"><div class="rt"><b>${a||'새로운 메모'}</b><small>${b.join(' ')||'추가 텍스트 없음'}</small></div></div>`}).join('')+'</div>':'<p class="em">오른쪽 아래 버튼으로<br>새 메모를 만들어보세요</p>'}</div><div class="sb"><div class="sp">⌕&nbsp;검색</div><button class="pb sq" onclick="NT.unshift('');openNote(0)">✎</button></div>`}
function openNote(i){ci=i;$('v-note').innerHTML=`<div class="hd"><button class="pb" onclick="saveNote();go('memo')">${ico.back}</button><button class="pb" onclick="saveNote();go('memo')">완료</button></div><textarea id="ta" class="ta" placeholder="메모를 적어보세요">${NT[i]}</textarea>`;go('note');setTimeout(()=>$('ta')&&$('ta').focus(),300)}
function saveNote(){const e=$('ta');if(!e||ci<0)return;const v=e.value;if(v.trim())NT[ci]=v;else NT.splice(ci,1);ci=-1}
const hl=x=>x.replace(/(#\S+)/g,'<em>$1</em>');
function rX(){$('v-x').innerHTML=`<div class="xh"><button class="xbk" onclick="go('home')">${XI.bk}</button><div class="xs">${XI.sr}<span>#환승연애</span></div><span class="xfl">${XI.fl}</span></div><div class="xt"><b class="on">인기</b><b>최근</b><b>사용자</b><b>동영상</b><b>사진</b></div><div class="sc x">${curTW.map(t=>`<div class="tw">${twAv(t[0])}<div class="tc"><b>${t[0]}</b> <span>@${handle(t[0])} · ${t[1]}</span><p>${hl(t[4])}</p><div class="act"><span>${XI.re}0</span><span class="xrt" data-n="${t[3]}" onclick="tg(this)">${XI.rt}<i>${t[3].toLocaleString()}</i></span><span class="lk" data-n="${t[2]}" onclick="tg(this)">${XI.ht}<i>${t[2].toLocaleString()}</i></span><span class="xbm" onclick="tg(this)">${XI.bm}</span><span>${XI.sh}</span></div></div></div>`).join('')}</div><div class="fab">＋</div><nav class="xn">${[ico.home,ico.search,ico.bell,ico.mail].join('')}</nav>`}
/* X 아이콘 (답글, 리트윗, 하트, 북마크, 공유) */
const XS=d=>`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">${d}</svg>`;
const XI={
  re:XS('<path d="M4.5 11.2c0-3.9 3.3-6.7 7.6-6.7 4.2 0 7.4 2.9 7.4 6.6 0 3.8-3.4 6.6-7.6 6.6h-.3l-4.1 2.6v-3.3c-1.8-1.2-3-3.2-3-5.8z"/>'),
  rt:XS('<path d="M4.5 9.5V8a2.5 2.5 0 0 1 2.5-2.5h9.5"/><path d="M14 3l2.5 2.5L14 8"/><path d="M19.5 14.5V16a2.5 2.5 0 0 1-2.5 2.5H7.5"/><path d="M10 21l-2.5-2.5L10 16"/><path d="M4.5 9.5"/>').replace('<path d="M4.5 9.5"/>',''),
  ht:XS('<path class="hp" d="M12 20s-7.5-4.4-7.5-10A4.3 4.3 0 0 1 12 7.6 4.3 4.3 0 0 1 19.5 10c0 5.6-7.5 10-7.5 10z"/>'),
  bm:XS('<path class="hp" d="M6.5 4h11v16l-5.5-4-5.5 4z"/>'),
  bk:XS('<path d="M19 12H5M11 5l-7 7 7 7"/>'),
  sr:XS('<circle cx="10.5" cy="10.5" r="6.5"/><path d="m15.5 15.5 5 5"/>'),
  fl:XS('<path d="M4 8h9M17 8h3M4 16h3M11 16h9"/><path d="M15 5.5v5M9 13.5v5"/>'),
  sh:XS('<path d="M12 15V4"/><path d="M7.5 8.5 12 4l4.5 4.5"/><path d="M5 14v4.5A1.5 1.5 0 0 0 6.5 20h11a1.5 1.5 0 0 0 1.5-1.5V14"/>')
};
function tg(e){const on=e.classList.toggle('on'),i=e.querySelector('i');if(i)i.textContent=(+e.dataset.n+(on?1:0)).toLocaleString()}
function rIG(){const g=IMG.insta.map((u,i)=>`<div ${bg(u)} onclick="openPost(${i})">${U(u)?'':'대영 사진 '+(i+1)}</div>`).join('');
$('v-ig').innerHTML=`<div class="hd"><button class="pb" onclick="go('dm')">${ico.back}</button><span>🔒 yushi</span><b style="font-size:6cqw;width:11cqw;text-align:center">⋯</b></div><div class="sc" style="padding:0 0 30cqw"><div class="pr"><div class="pa" ${bg(IMG.yushiProfile)}>${U(IMG.yushiProfile)?'':ico.person2.replace('<svg','<svg width="50%" fill="#aaa"')}</div><div class="st"><div><b>${IMG.insta.length}</b>게시물</div><div><b>128</b>팔로워</div><div><b>97</b>팔로잉</div></div></div><div style="padding:0 5cqw;font-size:4.2cqw"><b>유우시</b></div><div class="bt"><button>팔로잉</button><button onclick="go('dm')">메시지</button></div><div class="gr">${g}</div></div>${igNav('')}`}
const DMS=[];
const dmTime=()=>{const d=new Date(),h=d.getHours();return (h<12?'오전 ':'오후 ')+(h%12||12)+':'+String(d.getMinutes()).padStart(2,'0')};
const dg=x=>`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">${x}</svg>`;
function rDM(){
$('v-dm').innerHTML=`<div class="dh"><button class="pb" onclick="go('home')">${ico.back}</button><div class="dav" ${bg(IMG.yushiProfile)}></div><div class="dt" onclick="go('ig')"><b>yushi ›</b><small>유우시</small></div><button class="pb">${ico.ph.replace('<svg','<svg fill="none" stroke="currentColor" stroke-width="1.8"')}</button><button class="pb">${dg('<rect x="2.5" y="6" width="13" height="12" rx="3"/><path d="M15.5 10.5l6-3v9l-6-3z"/>')}</button></div><div class="sc th" style="top:30cqw"><small class="cnt" style="text-align:center">${dmTime()}</small><div class="rw"><div class="rv" ${bg(IMG.yushiProfile)}></div><div class="bb">대영 마지막화 같이 볼거야? 볼거면 우리집 와</div></div>${DMS.map(m=>`<div class="bb me">${m}</div>`).join('')}</div><div class="ib"><i class="cm"><svg viewBox="0 0 24 24" fill="#fff"><path d="M9 4L7.5 6H5a2 2 0 00-2 2v10a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-2.5L15 4z"/><circle cx="12" cy="13" r="3.6" fill="#5b5ce6"/></svg></i><input id="di" placeholder="메시지 보내기..." onkeydown="if(event.key=='Enter')dmSend()"><span>${dg('<rect x="9" y="3" width="6" height="11" rx="3"/><path d="M5.5 11a6.5 6.5 0 0013 0M12 17.5V21"/>')}${dg('<rect x="3" y="3" width="18" height="18" rx="3"/><circle cx="9" cy="9" r="1.6"/><path d="M3 17l5-5 4 4 3-3 6 6"/>')}${dg('<path d="M4 6a2 2 0 012-2h12a2 2 0 012 2v8l-6 6H6a2 2 0 01-2-2z"/><path d="M14 20v-4a2 2 0 012-2h6M8.5 9.5v1M15.5 9.5v1M8.5 14c1.5 1.5 3.5 1.5 5 0"/>')}${dg('<circle cx="12" cy="12" r="9"/><path d="M12 8v8M8 12h8"/>')}</span></div>`;
$('v-dm').querySelector('.sc').scrollTop=1e5}
function dmSend(){const v=$('di').value.trim();if(!v)return;DMS.push(v);rDM();$('di').focus()}
function rLock(){const v=$('v-lock');v.style.backgroundImage=U(IMG.lockWallpaper)?`url('${IMG.lockWallpaper}')`:'';v.innerHTML=`<p>몇 달 뒤</p><h1>${tm()}</h1>`}
const tm=()=>{const d=new Date();return d.getHours()+':'+String(d.getMinutes()).padStart(2,'0')};
function notify(o){const n=$('nt');n.innerHTML=`<div class="ni">${o.icon}</div><div><b>${o.title}</b><p>${o.body}</p></div>`;n.classList.add('on');playDing();n.onclick=()=>{n.classList.remove('on');o.tap&&o.tap()};clearTimeout(nTm);if(!o.sticky)nTm=setTimeout(()=>n.classList.remove('on'),4000)}
setInterval(()=>$('clk').textContent=tm(),20000);$('clk').textContent=tm();
/* ===== 게임이 쓰는 핸드폰 조작 ===== */
let _closeRes=null,_hid=null;
const Phone={
  /* 폰 열기. 아래 바를 누르면 닫히고 Promise가 끝남 */
  open(tweets){curTW=tweets||[];$('phone').hidden=false;go('home');return new Promise(r=>{_closeRes=r})},
  close(){clearTimeout(_hid);if(cur==='note')saveNote();$('nt').classList.remove('on');$('phone').hidden=true;const r=_closeRes;_closeRes=null;r&&r()},
  /* 히든: 몇 달 뒤 잠금화면 → 인스타 DM 알림 */
  openHidden(){igOn=false;curTW=[];$('phone').hidden=false;go('lock');_hid=setTimeout(()=>{igOn=true;notify({icon:igI(),title:'유우시',body:'대영 마지막화 같이 볼거야? 볼거면 우리집 와',sticky:1,tap:()=>go('dm')})},1200);return new Promise(r=>{_closeRes=r})},
  /* 처음으로 돌아가기 (메모·문자·히든 전부 초기화) */
  reset(){clearTimeout(_hid);clearInterval(T);NT=[];DMS.length=0;igOn=false;tab='fav';num='';ci=-1;curT='';for(const k in TH)TH[k]=thInit(k);$('nt').classList.remove('on');$('phone').hidden=true;_closeRes=null;go('home')},
  notify
};
/* 아래 홈 바: 앱 안이면 홈으로, 홈이면 폰 닫기 (눌러도 되고 위로 쓸어도 됨) */
(()=>{const hb=$('hb');let y0=null;
  hb.addEventListener('pointerdown',e=>{y0=e.clientY});
  hb.addEventListener('pointerup',()=>{y0=null;(cur==='home')?Phone.close():go('home')});
  hb.addEventListener('pointercancel',()=>{y0=null});
})();

/* 유우시 인스타 게시물 보기 */
const IGI={
  ht:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linejoin="round"><path class="hp" d="M12 20.5s-8-4.7-8-10.6A4.6 4.6 0 0 1 12 7a4.6 4.6 0 0 1 8 2.9c0 5.9-8 10.6-8 10.6z"/></svg>',
  cm:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linejoin="round"><path d="M20.5 11.5a8.5 8.5 0 0 1-12.4 7.6L3.5 20.5l1.4-4.4A8.5 8.5 0 1 1 20.5 11.5z"/></svg>',
  sd:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linejoin="round"><path d="M21.5 3 3 10.2l7.3 2.6L21.5 3zM10.3 12.8l2.7 7.7L21.5 3"/></svg>',
  bm:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linejoin="round"><path class="hp" d="M6 3.5h12v17l-6-4.3-6 4.3z"/></svg>',
  mn:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M4 8h16M8 16h12"/></svg>'
};
function openPost(i){const p=(typeof INSTA_POSTS!=='undefined'&&INSTA_POSTS[i])||['',0,''],u=IMG.insta[i],n=IMG.insta.length;
  const pa=`<div class="pav" ${bg(IMG.yushiProfile)}></div>`;
  $('v-igp').innerHTML=`<div class="igph"><button class="pb" onclick="go('ig')">${ico.back}</button><div class="igpt"><b>게시물</b><small>yushi</small></div><span style="width:12cqw"></span></div>
  <div class="sc igps"><div class="igpu">${pa}<b>yushi</b><span class="igm">${IGI.mn}</span></div>
  <div class="igpi" ${bg(u)}><span class="igpn">${i+1}/${n}</span></div>
  <div class="igpd">${IMG.insta.map((_,k)=>`<i class="${k==i?'on':''}"></i>`).join('')}</div>
  <div class="igpa"><span class="ilk" data-n="${p[1]}" onclick="tg(this)">${IGI.ht}<i>${p[1]}</i></span><span>${IGI.cm}<i>${Math.max(1,Math.round(p[1]/9))}</i></span><span>${IGI.sd}</span><span class="ibm" onclick="tg(this)">${IGI.bm}</span></div>
  <div class="igpl"><b>좋아요 ${p[1].toLocaleString()}개</b></div>
  <p class="igpc"><b>yushi</b> ${p[0]}</p><p class="igpt2">${p[2]}</p></div>`;
  go('igp')}

/* 인스타 홈 피드 (카드뉴스 넘기기) */
function openFeed(){if(typeof FEED_POST==='undefined')return;const f=FEED_POST,n=f.cards.length;
  const av=u=>`<div class="pav" style="background-image:url('${u}')"></div>`;
  $('v-igf').innerHTML=`<div class="igfh"><b class="igfl">Instagram</b><span>${IGI.ht}${IGI.sd}</span></div>
  <div class="sc igfs"><div class="igpu">${av(f.av)}<b>${f.user}</b><span class="igm">${IGI.mn}</span></div>
  <div class="igcw"><div class="igcar" id="igcar">${f.cards.map(u=>`<div class="igc" style="background-image:url('${u}')"></div>`).join('')}</div><span class="igpn" id="igcn">1/${n}</span></div>
  <div class="igpd" id="igcd">${f.cards.map((_,k)=>`<i class="${k?'':'on'}"></i>`).join('')}</div>
  <div class="igpa"><span class="ilk" data-n="${f.likes}" onclick="tg(this)">${IGI.ht}<i>${f.likes.toLocaleString()}</i></span><span>${IGI.cm}<i>${f.comments}</i></span><span>${IGI.sd}</span><span class="ibm" onclick="tg(this)">${IGI.bm}</span></div>
  <div class="igpl"><b>좋아요 ${f.likes.toLocaleString()}개</b></div>
  <p class="igpc"><b>${f.user}</b> ${f.caption}</p><p class="igpt2">${f.date}</p></div>
  ${igNav('home')}`;
  go('igf');
  const c=$('igcar');c.onscroll=()=>{const k=Math.round(c.scrollLeft/c.clientWidth);$('igcn').textContent=`${k+1}/${n}`;$('igcd').querySelectorAll('i').forEach((d,j)=>d.classList.toggle('on',j==k))};
}

/* ===== 인스타 아래 메뉴 (홈 / 릴스 / DM / 검색 / 내 프로필=대영) ===== */
const ME_ID=(typeof IG_ME!=='undefined'&&IG_ME.id)||'daeyoung_';
function igNav(a){const st=(on,svg,w)=>svg.replace('<svg',on?'<svg fill="currentColor"':`<svg fill="none" stroke="currentColor" stroke-width="${w||2}"`);
  return `<nav class="tb igfn${a=='reel'?' igdk':''}"><button onclick="openFeed()">${st(a=='home',ico.home)}</button><button onclick="openReels()">${st(a=='reel',ico.reel)}</button><button onclick="go('dm')">${st(0,ico.send)}</button><button onclick="openSearch()">${st(0,ico.search,a=='search'?3:2.4)}</button><button onclick="openMe()"><div class="av s ni8 meav${a=='me'?' on':''}">${ico.person2}</div></button></nav>`}
const defAv=s=>`<div class="pa" style="background:#c7c7cc;overflow:hidden">${ico.person2.replace('<svg','<svg width="'+(s||'78%')+'" fill="#fff" style="margin-top:28%"')}</div>`;

/* 릴스 */
function openReels(){const R=typeof REELS!=='undefined'?REELS:[];
  $('v-igr').innerHTML=`<div class="rlh"><b>릴스 ⌄</b><span>${ico.search.replace('<svg','<svg fill="none" stroke="#fff" stroke-width="2.4"')}</span></div><div class="rls">${R.map((r,i)=>`<div class="rl" style="--a:${r.c[0]};--b:${r.c[1]};--c:${r.c[2]}"><div class="rlbg"></div>
    <div class="rlwave">${Array.from({length:23},(_,k)=>`<i style="animation-delay:${(k*67%700)}ms"></i>`).join('')}</div>
    <div class="rlt"><small>${r.top}</small><b>${r.title}</b><span>${r.sub}</span></div>
    <div class="rlr"><span class="ilk" data-n="${r.likes}" onclick="tg(this)">${IGI.ht}<i>${r.likes.toLocaleString()}</i></span><span>${IGI.cm}<i>${r.cm}</i></span><span>${IGI.sd}<i>${r.sh}</i></span><span style="font-size:6cqw;line-height:1">⋯</span><div class="rlc" style="background:linear-gradient(135deg,${r.c[0]},${r.c[2]})"></div></div>
    <div class="rlu"><p><span class="rlav" style="background:linear-gradient(135deg,${r.c[1]},${r.c[0]})">${r.user[0].toUpperCase()}</span><b>${r.user}</b><button>팔로우</button></p><p class="rlcap">${r.cap}</p><p class="rlau">♫ ${r.audio}</p></div></div>`).join('')}</div>${igNav('reel')}`;
  go('igr')}

/* 검색: 입력하면 유우시/대영 아이디만 나옴 */
function openSearch(){$('v-igs').innerHTML=`<div class="igsh"><div class="igsb">${ico.search.replace('<svg','<svg fill="none" stroke="#8e8e8e" stroke-width="2.4"')}<input id="igq" placeholder="검색" autocomplete="off" oninput="igSearch(this.value)"></div></div><div class="sc igsr" id="igsr"><p class="igse">최근 검색 항목이 없습니다.</p></div>${igNav('search')}`;go('igs');setTimeout(()=>$('igq')&&$('igq').focus(),300)}
function igSearch(q){q=q.trim().toLowerCase();const L=[{id:'yushi',nm:'유우시',k:'yushi 유우시 우시 yu',me:0},{id:ME_ID,nm:(typeof IG_ME!=='undefined'&&IG_ME.name)||'김대영',k:ME_ID+' 김대영 대영 dae',me:1}];
  const r=q?L.filter(u=>u.k.toLowerCase().includes(q)):[];
  $('igsr').innerHTML=q?(r.length?r.map(u=>`<div class="igsu" onclick="${u.me?'openMe()':"go('ig')"}">${u.me?defAv('70%'):`<div class="pa" ${bg(IMG.yushiProfile)}></div>`}<div><b>${u.id}</b><small>${u.nm}${u.me?'':' · 팔로잉'}</small></div></div>`).join(''):`<p class="igse">"${q}"에 대한 결과가 없습니다.</p>`):'<p class="igse">최근 검색 항목이 없습니다.</p>'}

/* 내 프로필 (대영) */
function openMe(){const M=typeof IG_ME!=='undefined'?IG_ME:{id:'daeyoung_',name:'김대영',followers:335,following:332};
  $('v-igme').innerHTML=`<div class="hd"><span style="width:11cqw"></span><span>${M.id} ⌄</span><b style="font-size:6cqw;width:11cqw;text-align:center">☰</b></div><div class="sc" style="padding:0 0 30cqw"><div class="pr">${defAv()}<div class="st"><div><b>0</b>게시물</div><div><b>${M.followers}</b>팔로워</div><div><b>${M.following}</b>팔로잉</div></div></div><div style="padding:0 5cqw;font-size:4.2cqw"><b>${M.name}</b></div><div class="bt"><button>프로필 편집</button><button>프로필 공유</button></div>
  <div class="igtab"><span class="on">${dg('<rect x="3.5" y="3.5" width="17" height="17" rx="1"/><path d="M3.5 9.2h17M3.5 14.8h17M9.2 3.5v17M14.8 3.5v17"/>')}</span><span>${ico.reel.replace('<svg','<svg fill="none" stroke="currentColor" stroke-width="1.8"')}</span><span>${dg('<rect x="3.5" y="3.5" width="17" height="17" rx="3"/><circle cx="12" cy="10" r="3"/><path d="M6.5 18.5c1.2-2.4 3.2-3.5 5.5-3.5s4.3 1.1 5.5 3.5"/>')}</span></div>
  <div class="igempty"><div class="igcam">${dg('<path d="M4 8h3l1.6-2.4h6.8L17 8h3v11H4z"/><circle cx="12" cy="13" r="3.4"/>')}</div><b>게시물 없음</b></div></div>${igNav('me')}`;
  go('igme')}
