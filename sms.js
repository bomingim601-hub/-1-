/* =====================================================
   문자 투표 화면 (제작진에게 문자 보내기 · 아이폰 메시지 스타일)
   이름을 누르면 한 글자씩 타자가 쳐지고 → 전송 소리와 함께 보내짐
   ===================================================== */
const SMS_TEXT = {
  vote:  "오늘의 문자 투표 시간입니다.\n마음이 가는 사람의 이름을 보내주세요.",
  final: "최종 선택 시간입니다.\n함께 프로그램을 나갈 사람의 이름을 보내주세요."
};

/* 소리: 타자(합성음) + 전송(send.mp3) */
let _sac;
function keyTick(){try{_sac=_sac||new(window.AudioContext||window.webkitAudioContext)();const c=_sac,t=c.currentTime,
  b=c.createBuffer(1,c.sampleRate*.03,c.sampleRate),d=b.getChannelData(0);
  for(let i=0;i<d.length;i++)d[i]=(Math.random()*2-1)*Math.pow(1-i/d.length,6);
  const s=c.createBufferSource(),f=c.createBiquadFilter(),g=c.createGain();f.type='highpass';f.frequency.value=1800;
  g.gain.value=.35;s.buffer=b;s.connect(f);f.connect(g);g.connect(c.destination);s.start(t)}catch(e){}}
function sendSound(){try{const a=new Audio(SOUND.send||'send.mp3');a.volume=.9;a.play().catch(()=>{})}catch(e){}}

/* 한글을 자음/모음 순서로 쳐지게: 안 → ㅇ → 아 → 안 */
const CHO="ㄱㄲㄴㄷㄸㄹㅁㅂㅃㅅㅆㅇㅈㅉㅊㅋㅌㅍㅎ";
function typeSteps(str){const out=[];let done='';
  for(const ch of str){const c=ch.charCodeAt(0)-0xAC00;
    if(c>=0&&c<11172){const cho=Math.floor(c/588),jung=Math.floor(c%588/28),jong=c%28;
      out.push(done+CHO[cho]);out.push(done+String.fromCharCode(0xAC00+cho*588+jung*28));
      if(jong)out.push(done+ch);}
    else out.push(done+ch);
    done+=ch;}
  return out}

const smsIco={
  back:'<svg viewBox="0 0 24 24"><path d="M15 4 7 12l8 8" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  cam:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"><rect x="2.5" y="6" width="13" height="12" rx="2.5"/><path d="m15.5 10.5 6-3.5v10l-6-3.5z"/></svg>',
  up:'<svg viewBox="0 0 24 24"><path d="M12 19V6M6.5 11 12 5.5 17.5 11" fill="none" stroke="#fff" stroke-width="2.8" stroke-linecap="round" stroke-linejoin="round"/></svg>'
};

/* smsAsk(종류, 이름목록, {dis, glow, reject, rejectText}) → 고른 번호 */
function smsAsk(kind,opts,o={}){return new Promise(async done=>{
  const dis=new Set(o.dis||[]),glow=o.glow||[];
  let el=document.getElementById('sms');
  if(!el){el=document.createElement('div');el.id='sms';document.getElementById('stage').appendChild(el)}
  const now=new Date(),hm=`오후 ${((now.getHours()+11)%12)+1}:${String(now.getMinutes()).padStart(2,'0')}`;
  el.innerHTML=`<div class="q-sh"><span class="q-sbk">${smsIco.back}</span><div class="q-sp"><div class="q-sav">제</div><div class="q-snm">제작진 <i>›</i></div></div><span class="q-scm">${smsIco.cam}</span></div>
    <div class="q-sb" id="qsb"><p class="q-sdt">오늘 ${hm}</p><div class="q-bl q-in">${(SMS_TEXT[kind]||kind).replace(/\n/g,'<br>')}</div></div>
    <div class="q-sf"><div class="q-sch" id="qsch"></div><p class="q-snote" id="qsnote"></p>
      <div class="q-sin"><span class="q-spl">＋</span><div class="q-sbox"><span id="qstx"></span><i class="q-scur"></i><span class="q-sph" id="qsph">iMessage</span><button class="q-ssend" id="qssend">${smsIco.up}</button></div></div></div>`;
  el.classList.add('on');
  const chips=()=>{$('qsch').innerHTML=opts.map((t,i)=>`<button class="q-chip${dis.has(i)?' off':''}${glow.includes(i)?' glow':''}" data-i="${i}">${t}</button>`).join('');
    $('qsch').querySelectorAll('.q-chip').forEach(b=>b.onclick=()=>pick(+b.dataset.i))};
  let busy=false;
  const show=t=>{$('qstx').textContent=t;$('qsph').style.display=t?'none':'';$('qssend').classList.toggle('on',!!t)};
  async function type(t){for(const s of typeSteps(t)){show(s);keyTick();await sleep(85+Math.random()*70)}}
  async function erase(t){for(let k=t.length;k>=0;k--){show(t.slice(0,k));keyTick();await sleep(120)}}
  async function pick(i){if(busy||dis.has(i))return;busy=true;$('qsch').classList.add('lock');
    const t=opts[i];await type(t);await sleep(380);
    if(o.reject===i){await sleep(500);await erase(t);$('qsnote').textContent=o.rejectText||'';$('qsnote').classList.add('on');
      await sleep(1900);$('qsnote').classList.remove('on');dis.add(i);if(o.onReject)o.onReject(i);chips();$('qsch').classList.remove('lock');busy=false;return}
    $('qssend').classList.add('press');sendSound();show('');
    const b=document.createElement('div');b.className='q-bl q-out';b.textContent=t;$('qsb').appendChild(b);
    await sleep(700);const r=document.createElement('p');r.className='q-sread';r.textContent='전송됨';$('qsb').appendChild(r);
    await sleep(1100);el.classList.remove('on');done(i)}
  chips();
})}
