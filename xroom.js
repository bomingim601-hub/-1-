/* =====================================================
   편지 / X룸  (1일차 X소개서 편지, 4일차 X룸)
   ===================================================== */
const bgUrl=k=>U(IMG[k])?`style="background-image:url('${IMG[k]}')"`:'';
const pic=(k,cls='',label='')=>U(IMG[k])?`<img class="${cls}" src="${IMG[k]}" alt="">`:`<div class="ph">${label||'사진 자리'}<br><small>${k}</small></div>`;
function bindA(root,map){root.querySelectorAll('[data-a]').forEach(b=>b.onclick=()=>map[b.dataset.a](b))}

/* 편지봉투 → 편지지. nextHtml 은 편지를 끝까지 내리면 서서히 나타남 */
function letterScene(text,nextHtml,map,light){
  set(U(IMG.envelope)?`<img class="env" src="${IMG.envelope}" data-a="open"><p class="hint">편지를 눌러보세요</p>`
                      :`<div class="envph" data-a="open">✉️</div><p class="hint">편지를 눌러보세요</p>`,{light});
  bindA(scr,{open(){
    set(`<div class="sheet" ${bgUrl('letterPaper')}></div><div class="nx" id="nx">${nextHtml}</div>`,{light});
    scr.querySelector('.sheet').textContent=text;
    bindA(scr,map);
    const rv=()=>{if(scr.scrollTop+scr.clientHeight>=scr.scrollHeight-30)$('nx').classList.add('on')};
    scr.onscroll=rv;setTimeout(rv,800);
  }});
}

/* 4일차 X룸 전체 흐름. 끝나면 Promise 종료 */
function xRoom(){return new Promise(done=>{
  const seenL=new Set(),seenO=new Set();let seenR=false;
  const OPOS=[[5,7,30,-12],[4,50,34,9],[38,9,40,6],[47,44,24,-18]];  /* 서랍 속 물건 위치 [왼쪽, 위, 크기, 기울기] (반지, 키링, 머그, 목도리) */
  const rot=[-4,3,2,-3,4];
  const lookHtml=()=>`<p class="hint">${seenL.size==5||seenR?'다시 ':''}주변을 둘러보세요</p>
    <button class="box" data-a="right">오른쪽으로 고개 돌리기${seenR?' ✓':''}</button>
    <button class="box" data-a="left">왼쪽으로 고개 돌리기${seenL.size==5?' ✓':''}</button>`;
  const M={
    right(){set(`<p class="hint">서랍을 눌러 열어보세요</p><button class="drw" data-a="opendr">${pic('drawer','','서랍장')}</button>`);bindA(scr,M)},
    opendr(){const all=seenO.size==OBJ.length;
      set(`<p class="hint">${all?'다 꺼내봤어요':`물건을 눌러 꺼내보세요 (${seenO.size}/${OBJ.length})`}</p><div class="tray">${OBJ.map((o,i)=>{const q=OPOS[i];return `<button class="it${seenO.has(i)?' seen':''}" data-i="${i}" data-a="take" style="left:${q[0]}cqw;top:${q[1]}cqw;width:${q[2]}cqw;transform:rotate(${q[3]}deg)">${pic(o[0],'',o[1])}</button>`}).join('')}</div>${all?'<button class="box" data-a="rdone">서랍 닫기</button>':''}`);
      bindA(scr,{...M,take(b){M.item(+b.dataset.i)}})},
    item(i){const o=OBJ[i],ov=$('ov');seenO.add(i);
      ov.innerHTML=`<div class="iv">${pic(o[0],'',o[1])}</div><div class="ivt"><b>${o[1]}</b>${o[2]?`<p>${o[2]}</p>`:''}<p>${o[3]}</p></div><button class="box" data-a="close">다시 넣기</button>`;
      ov.classList.add('on');bindA(ov,{close(){ov.classList.remove('on');M.opendr()}})},
    rdone(){seenR=true;M.look()},
    look(){if(seenL.size==5&&seenR)return M.desk();set(lookHtml());bindA(scr,M)},
    left(){const card=i=>`<button class="pol" style="transform:rotate(${rot[i]}deg)" data-i="${i}" data-a="open">${U(IMG.clothespin)?`<img class="cp" src="${IMG.clothespin}" alt="">`:'<i class="pin"></i>'}${pic(POLA[i][0],i==3?'c':'')}${seenL.has(i)?'<span class="ck">✓</span>':''}</button>`;
      set(`<p class="hint">사진을 눌러보세요 (${seenL.size}/5)</p><div class="board" ${bgUrl('cork')}>${[[0,1],[2,3],[4]].map(r=>`<div class="brow">${r.map(card).join('')}</div>`).join('')}</div><button class="box" data-a="look">돌아보기</button>`);
      bindA(scr,{...M,open(b){M.zoom(+b.dataset.i)}})},
    zoom(i){const p=POLA[i],ov=$('ov');
      ov.innerHTML=`<div class="pv"><div class="fl" id="fl" data-a="flip"><div class="ff">${pic(p[0],i==3?'c':'')}</div><div class="fb" ${bgUrl('linedPaper')}></div></div></div><p class="hint" style="color:#fff">사진을 눌러 뒤집어보세요</p><button class="box" data-a="close">닫기</button>`;
      ov.querySelector('.fb').textContent=p[1];ov.classList.add('on');
      bindA(ov,{flip(){$('fl').classList.toggle('f');seenL.add(i)},close(){ov.classList.remove('on');seenL.size==5?M.look():M.left()}})},
    desk(){set(`<p class="hint">${NOTE_INTRO}</p><div class="desk" ${bgUrl('desk')}><button class="memo" data-a="note" ${bgUrl('linedPaper')}><i class="mclip"></i><b>대영이</b><span></span><span></span><span></span></button></div>`);bindA(scr,M)},
    note(){const ov=$('ov');
      ov.innerHTML=`<div class="mbig" ${bgUrl('linedPaper')}></div><button class="box" data-a="close">메모 내려놓기</button>`;
      ov.querySelector('.mbig').textContent=NOTE;ov.classList.add('on');
      bindA(ov,{close(){ov.classList.remove('on');set(`<p class="hint">${NOTE_INTRO}</p><div class="desk" ${bgUrl('desk')}><button class="memo seen" data-a="note" ${bgUrl('linedPaper')}><i class="mclip"></i><b>대영이</b><span></span><span></span><span></span></button></div><button class="box" data-a="fin">다음으로</button>`);bindA(scr,M)}})},
    fin(){done()}
  };
  letterScene(LETTER2,lookHtml(),M);
})}
