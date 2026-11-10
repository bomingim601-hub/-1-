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
  const seenL=new Set();let seenR=false;
  const rot=[-4,3,2,-3,4];
  const lookHtml=()=>`<p class="hint">${seenL.size==5||seenR?'다시 ':''}주변을 둘러보세요</p>
    <button class="box" data-a="right">오른쪽으로 고개 돌리기${seenR?' ✓':''}</button>
    <button class="box" data-a="left">왼쪽으로 고개 돌리기${seenL.size==5?' ✓':''}</button>`;
  const M={
    right(){set(OBJ.map(o=>`<div class="oc">${pic(o[0],'',o[1])}<div><b>${o[1]}</b>${o[2]?`<p>${o[2]}</p>`:''}<p>${o[3]}</p></div></div>`).join('')+`<button class="box" data-a="rdone">다 봤어요</button>`);bindA(scr,M)},
    rdone(){seenR=true;M.look()},
    look(){if(seenL.size==5&&seenR)return M.desk();set(lookHtml());bindA(scr,M)},
    left(){set(`<p class="hint">사진을 눌러보세요 (${seenL.size}/5)</p><div class="board" ${bgUrl('cork')}>${POLA.map((p,i)=>`<button class="pol" style="transform:rotate(${rot[i]}deg)" data-i="${i}" data-a="open"><i class="pin"></i>${pic(p[0],i==3?'c':'')}${seenL.has(i)?'<span class="ck">✓</span>':''}</button>`).join('')}</div><button class="box" data-a="look">돌아보기</button>`);
      bindA(scr,{...M,open(b){M.zoom(+b.dataset.i)}})},
    zoom(i){const p=POLA[i],ov=$('ov');
      ov.innerHTML=`<div class="pv"><div class="fl" id="fl" data-a="flip"><div class="ff">${pic(p[0],i==3?'c':'')}</div><div class="fb" ${bgUrl('linedPaper')}></div></div></div><p class="hint" style="color:#fff">사진을 눌러 뒤집어보세요</p><button class="box" data-a="close">닫기</button>`;
      ov.querySelector('.fb').textContent=p[1];ov.classList.add('on');
      bindA(ov,{flip(){$('fl').classList.toggle('f');seenL.add(i)},close(){ov.classList.remove('on');seenL.size==5?M.look():M.left()}})},
    desk(){set(`<button class="box" data-a="note">${NOTE_INTRO}</button>`);bindA(scr,M)},
    note(){set(`<div class="sheet" ${bgUrl('linedPaper')} style="min-height:100cqw"></div><button class="box" data-a="fin">다음으로</button>`);
      scr.querySelector('.sheet').textContent=NOTE;bindA(scr,M)},
    fin(){done()}
  };
  letterScene(LETTER2,lookHtml(),M);
})}
