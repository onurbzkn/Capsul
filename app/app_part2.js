
// ─────────────────────────── POMODORO ─────────────────────────────────────
function setPomoMode(m){
  pomoMode=m;clearInterval(pomoInterval);pomoRunning=false;pomoSecs=POMO_DUR[m];
  ['work','short','long'].forEach(k=>document.getElementById('pomoBtn'+k.charAt(0).toUpperCase()+k.slice(1))?.classList.toggle('active',k===m));
  const labels={work:'Çalışma Seansı',short:'Kısa Mola',long:'Uzun Mola'};
  document.getElementById('pomoLabel').textContent=labels[m];
  document.getElementById('pomoRing').className='pomo-prog '+m;
  document.getElementById('pomoIcon').innerHTML='<polygon points="5 3 19 12 5 21 5 3" fill="currentColor"/>';
  updatePomoDisplay();
}
function resetPomo(){setPomoMode(pomoMode);}
function togglePomo(){
  if(pomoRunning){clearInterval(pomoInterval);pomoRunning=false;document.getElementById('pomoIcon').innerHTML='<polygon points="5 3 19 12 5 21 5 3" fill="currentColor"/>';}
  else{pomoRunning=true;document.getElementById('pomoIcon').innerHTML='<rect x="6" y="4" width="4" height="16" fill="currentColor"/><rect x="14" y="4" width="4" height="16" fill="currentColor"/>';pomoInterval=setInterval(()=>{pomoSecs--;if(pomoSecs<=0){clearInterval(pomoInterval);pomoRunning=false;if(pomoMode==='work'){pomoSessions++;updatePomoSessions();showToast('Seans tamamlandı! \ud83c\udf45');}else showToast('Mola bitti!');return;}updatePomoDisplay();},1000);}
}
function skipPomo(){pomoRunning=false;clearInterval(pomoInterval);setPomoMode(pomoMode==='work'?'short':'work');}
function updatePomoDisplay(){
  const m=Math.floor(pomoSecs/60),s=pomoSecs%60;
  const timeStr=`${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')}`;
  const total=POMO_DUR[pomoMode];const prog=(total-pomoSecs)/total;
  const st=pomoStyle||'ring';
  const ringWrap=document.getElementById('pomoRingSVG');
  const clockWrap=document.getElementById('pomoClockSVG');
  const flipWrap=document.getElementById('pomoFlipWrap');
  const minimalWrap=document.getElementById('pomoMinimalWrap');
  const timeEl=document.getElementById('pomoTime');
  if(ringWrap)ringWrap.style.display='none';
  if(clockWrap)clockWrap.style.display='none';
  if(flipWrap)flipWrap.style.display='none';
  if(minimalWrap)minimalWrap.style.display='none';
  if(timeEl)timeEl.style.display='none';
  if(st==='ring'||st==='digital'){
    if(ringWrap)ringWrap.style.display='block';
    if(timeEl){timeEl.style.display='block';timeEl.textContent=timeStr;}
    const ring=document.getElementById('pomoRing');
    if(ring)ring.style.strokeDashoffset=st==='ring'?2*Math.PI*60*(1-prog):2*Math.PI*60;
  } else if(st==='clock'){
    if(clockWrap)clockWrap.style.display='block';
    if(timeEl){timeEl.style.display='block';timeEl.textContent=timeStr;}
    const minAngle=(s/60)*360-90;const hrAngle=(m/60)*360-90;
    const hrEl=document.getElementById('clockHrHand');const minEl=document.getElementById('clockMinHand');
    if(hrEl){const r=hrAngle*Math.PI/180;hrEl.setAttribute('x2',String(70+40*Math.cos(r)));hrEl.setAttribute('y2',String(70+40*Math.sin(r)));}
    if(minEl){const r=minAngle*Math.PI/180;minEl.setAttribute('x2',String(70+50*Math.cos(r)));minEl.setAttribute('y2',String(70+50*Math.sin(r)));}
  } else if(st==='flip'){
    if(flipWrap)flipWrap.style.display='flex';
    const fMin=document.getElementById('pomoFlipMin');const fSec=document.getElementById('pomoFlipSec');
    if(fMin)fMin.textContent=String(m).padStart(2,'0');if(fSec)fSec.textContent=String(s).padStart(2,'0');
  } else if(st==='minimal'){
    if(minimalWrap){minimalWrap.style.display='flex';const deg=prog*360;minimalWrap.style.background=`conic-gradient(var(--accent) ${deg}deg, var(--bg3) ${deg}deg)`;}
    if(timeEl){timeEl.style.display='block';timeEl.textContent=timeStr;}
  }
}
function openPomoDurEdit(){
  // Zaten açıksa kapat
  const existing=document.getElementById('pomoDurModal');
  if(existing){existing.remove();return;}
  const w=POMO_DUR_CUSTOM.work,sh=POMO_DUR_CUSTOM.short,lo=POMO_DUR_CUSTOM.long;
  const modal=document.createElement('div');
  modal.id='pomoDurModal';
  modal.style.cssText='position:fixed;inset:0;z-index:3500;background:rgba(0,0,0,.6);display:flex;align-items:center;justify-content:center;padding:20px;';
  modal.innerHTML=`<div style="background:var(--bg2);border:1px solid var(--border);border-radius:16px;padding:22px;width:100%;max-width:320px;position:relative;">
    <button onclick="document.getElementById('pomoDurModal').remove()" style="position:absolute;top:10px;right:12px;background:none;border:none;font-size:1.1rem;cursor:pointer;color:var(--text3);">✕</button>
    <div style="font-size:.86rem;font-weight:500;color:var(--text);margin-bottom:16px;">⏱ Süre Ayarla</div>
    <div style="display:flex;flex-direction:column;gap:14px;">
      <div>
        <div style="display:flex;justify-content:space-between;margin-bottom:4px;"><span style="font-size:.74rem;color:var(--text2);">\ud83c\udf45 Çalışma</span><span id="pdr-work-val" style="font-size:.8rem;font-family:JetBrains Mono,monospace;color:var(--accent2);">${w} dk</span></div>
        <input type="range" min="5" max="90" value="${w}" id="pdr-work" style="width:100%;" oninput="document.getElementById('pdr-work-val').textContent=this.value+' dk'">
      </div>
      <div>
        <div style="display:flex;justify-content:space-between;margin-bottom:4px;"><span style="font-size:.74rem;color:var(--text2);">☕ Kısa Mola</span><span id="pdr-short-val" style="font-size:.8rem;font-family:JetBrains Mono,monospace;color:var(--easy);">${sh} dk</span></div>
        <input type="range" min="1" max="30" value="${sh}" id="pdr-short" style="width:100%;" oninput="document.getElementById('pdr-short-val').textContent=this.value+' dk'">
      </div>
      <div>
        <div style="display:flex;justify-content:space-between;margin-bottom:4px;"><span style="font-size:.74rem;color:var(--text2);">\ud83c\udf3f Uzun Mola</span><span id="pdr-long-val" style="font-size:.8rem;font-family:JetBrains Mono,monospace;color:var(--note);">${lo} dk</span></div>
        <input type="range" min="5" max="45" value="${lo}" id="pdr-long" style="width:100%;" oninput="document.getElementById('pdr-long-val').textContent=this.value+' dk'">
      </div>
    </div>
    <button onclick="savePomoDur()" style="width:100%;margin-top:16px;padding:11px;background:linear-gradient(135deg,var(--accent),rgba(124,111,247,.8));border:none;border-radius:10px;color:#fff;font-family:'Sora',sans-serif;font-size:.84rem;cursor:pointer;">Kaydet</button>
  </div>`;
  document.body.appendChild(modal);
  modal.addEventListener('click',e=>{if(e.target===modal)modal.remove();});
}
function savePomoDur(){
  const wEl=document.getElementById('pdr-work');
  const sEl=document.getElementById('pdr-short');
  const lEl=document.getElementById('pdr-long');
  if(!wEl||!sEl||!lEl){showToast('Hata: Slider bulunamadı');return;}
  POMO_DUR_CUSTOM.work=parseInt(wEl.value);
  POMO_DUR_CUSTOM.short=parseInt(sEl.value);
  POMO_DUR_CUSTOM.long=parseInt(lEl.value);
  localStorage.setItem('capsula_pomo_dur',JSON.stringify(POMO_DUR_CUSTOM));
  const wl=document.getElementById('pomoWorkLbl');const sl=document.getElementById('pomoShortLbl');const ll=document.getElementById('pomoLongLbl');
  if(wl)wl.textContent=POMO_DUR_CUSTOM.work;
  if(sl)sl.textContent=POMO_DUR_CUSTOM.short;
  if(ll)ll.textContent=POMO_DUR_CUSTOM.long;
  const durModal=document.getElementById('pomoDurModal');
  if(durModal)durModal.remove();
  setPomoMode(pomoMode);
  showToast('Süreler güncellendi ✓');
}
function setPomoStyle(s){
  pomoStyle=s;localStorage.setItem('capsula_pomo_style',s);
  document.querySelectorAll('.pomo-style-opt').forEach(el=>el.classList.toggle('active',el.id==='ps-'+s));
  updatePomoDisplay();showToast('Saat stili değiştirildi');
}
function updatePomoSessions(){const c=document.getElementById('pomoSessions');c.innerHTML=Array.from({length:4},(_,i)=>`<div class="pomo-sess-dot${i<pomoSessions%4?' done':''}"></div>`).join('');}
function renderPomoTodos(){
  const tk=new Date().toISOString().split('T')[0];
  const items=D.todos.filter(t=>!t.dueDate||t.dueDate<=tk).slice(0,8);
  document.getElementById('pomoTodoList').innerHTML=items.length?items.map(t=>`<div class="pomo-todo-item ${pomoTaskId===t.id?'selected':''}" onclick="setPomoTask(${t.id})"><div class="todo-dot ${t.priority}"></div><div class="todo-text">${escHtml(t.text)}</div></div>`).join(''):'<div class="empty-state">Görev yok</div>';
}
function setPomoTask(id){
  if(pomoTaskId===id){pomoTaskId=null;document.getElementById('pomoTaskLbl').textContent='Görev seçmek için aşağıya tıkla';}
  else{pomoTaskId=id;const t=D.todos.find(x=>x.id===id);if(t)document.getElementById('pomoTaskLbl').textContent='\ud83c\udfaf '+t.text;}
  renderPomoTodos();
}

// ─────────────────────────── KANBAN ───────────────────────────────────────
function selKanbanP(p){kanbanPriority=p;document.querySelectorAll('[data-kp]').forEach(el=>el.classList.toggle('sel',el.dataset.kp===p));}
function openKanbanAdd(){openModal('kanbanAddModal');}
function saveKanbanCard(){const text=document.getElementById('kanbanAddText').value.trim();const col=document.getElementById('kanbanAddCol').value;if(!text)return;D.kanban[col].push({id:Date.now(),text,priority:kanbanPriority,createdAt:new Date().toISOString()});saveData();closeModal('kanbanAddModal');document.getElementById('kanbanAddText').value='';renderKanban();showToast('Kart eklendi');}
function moveKanbanCard(id,fromCol,dir){const cols=['todo','doing','done'];const fi=cols.indexOf(fromCol);const ti=fi+dir;if(ti<0||ti>2)return;const idx=D.kanban[fromCol].findIndex(c=>c.id===id);if(idx===-1)return;const card=D.kanban[fromCol].splice(idx,1)[0];D.kanban[cols[ti]].push(card);saveData();renderKanban();}
function syncKanbanFromTodos(){
  const notInKanban=D.todos.filter(t=>!Object.values(D.kanban).some(col=>col.some(c=>c.id===t.id)));
  if(!notInKanban.length){showToast('Tüm görevler zaten aktarılmış');return;}
  const modal=document.createElement('div');
  modal.id='kanbanImportModal';
  modal.style.cssText='position:fixed;inset:0;z-index:3500;background:rgba(0,0,0,.65);display:flex;align-items:center;justify-content:center;padding:20px;';
  const clr={easy:'var(--easy)',mid:'var(--mid)',hard:'var(--hard)'};
  modal.innerHTML=`<div style="background:var(--bg2);border:1px solid var(--border);border-radius:16px;padding:20px;width:100%;max-width:380px;max-height:80vh;display:flex;flex-direction:column;">
    <div style="font-size:.86rem;font-weight:500;color:var(--text);margin-bottom:12px;">\ud83d\udccb Hangi görevleri aktaralım?</div>
    <div style="overflow-y:auto;flex:1;display:flex;flex-direction:column;gap:6px;margin-bottom:14px;">
      ${notInKanban.map(t=>`<label style="display:flex;align-items:center;gap:10px;padding:9px 12px;background:var(--bg3);border-radius:9px;cursor:pointer;border:1px solid var(--border);">
        <input type="checkbox" value="${t.id}" checked style="accent-color:var(--accent);width:15px;height:15px;flex-shrink:0;">
        <div style="flex:1;min-width:0;"><div style="font-size:.78rem;color:var(--text);overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">${escHtml(t.text)}</div><div style="font-size:.58rem;color:${clr[t.priority||'mid']};">${t.priority==='easy'?'Kolay':t.priority==='hard'?'Zor':'Orta'}</div></div>
      </label>`).join('')}
    </div>
    <div style="display:flex;gap:8px;">
      <button onclick="document.getElementById('kanbanImportModal').remove()" style="flex:1;padding:10px;background:var(--bg3);border:1px solid var(--border);border-radius:9px;color:var(--text2);font-family:'Sora',sans-serif;font-size:.8rem;cursor:pointer;">İptal</button>
      <button id="kanbanImportBtn" style="flex:1;padding:10px;background:linear-gradient(135deg,var(--accent),rgba(124,111,247,.8));border:none;border-radius:9px;color:#fff;font-family:'Sora',sans-serif;font-size:.8rem;cursor:pointer;">Aktar</button>
    </div>
  </div>`;
  document.body.appendChild(modal);
  document.getElementById('kanbanImportBtn').onclick=()=>{
    const checked=[...modal.querySelectorAll('input[type=checkbox]:checked')].map(i=>parseInt(i.value));
    let count=0;
    D.todos.filter(t=>checked.includes(t.id)).forEach(t=>{
      D.kanban.todo.push({id:t.id,text:t.text,priority:t.priority,createdAt:t.createdAt});count++;
    });
    saveData();renderKanban();modal.remove();showToast(count+' görev aktarıldı ✓');
  };
  modal.addEventListener('click',e=>{if(e.target===modal)modal.remove();});
}
function renderKanban(){
  const cols=[{id:'todo',label:'Yapılacak'},{id:'doing',label:'Devam Eden'},{id:'done',label:'Tamamlandı'}];
  const clr={easy:'var(--easy)',mid:'var(--mid)',hard:'var(--hard)'};
  const lbl={easy:'Kolay',mid:'Orta',hard:'Zor'};
  // Otomatik silme kontrolü
  const autoDelete=localStorage.getItem('capsula_kanban_autodelete')!=='off';
  if(autoDelete){
    const cutoff=Date.now()-30*24*60*60*1000;
    D.kanban.done=D.kanban.done.filter(card=>{
      if(new Date(card.completedAt||card.createdAt||0).getTime()<cutoff){
        D.trash.push({...card,type:'kanban',deletedAt:new Date().toISOString()});
        return false;
      }
      return true;
    });
    saveData();
  }
  document.getElementById('kanbanBoard').innerHTML=cols.map(col=>`
    <div class="kanban-col col-${col.id}">
      <div class="kanban-col-header"><span class="kanban-col-title">${col.label}</span><span class="kanban-count">${D.kanban[col.id].length}</span></div>
      <div class="kanban-cards">${D.kanban[col.id].map(card=>`
        <div class="kanban-card" style="position:relative;">
          <button onclick="deleteKanbanCard(${card.id},'${col.id}')" style="position:absolute;top:4px;right:4px;background:none;border:none;cursor:pointer;color:var(--text3);font-size:.8rem;padding:2px 5px;border-radius:5px;transition:color .18s;" onmouseover="this.style.color='var(--hard)'" onmouseout="this.style.color='var(--text3)'">✕</button>
          <div class="kanban-card-text" style="padding-right:20px;">${escHtml(card.text)}</div>
          <div style="display:flex;align-items:center;gap:4px;margin-top:4px;"><span class="todo-badge" style="color:${clr[card.priority]};background:${clr[card.priority]}18;">${lbl[card.priority]}</span></div>
          <div class="kanban-move-btns">${col.id!=='todo'?`<button class="kmb" onclick="moveKanbanCard(${card.id},'${col.id}',-1)">← Geri</button>`:''} ${col.id!=='done'?`<button class="kmb" onclick="moveKanbanCard(${card.id},'${col.id}',1)">İleri →</button>`:''}</div>
        </div>`).join('')}
      </div>
      ${col.id==='done'?`<div style="font-size:.55rem;font-family:JetBrains Mono,monospace;color:var(--text3);padding:6px 4px;line-height:1.5;opacity:.7;">⏱ Tamamlananlar 30 gün sonra otomatik silinir.<br>Ayarlar → Kanban'dan kapatabilirsiniz.</div>`:''}
      <button class="kanban-add-btn" onclick="openKanbanAdd()">+ Kart Ekle</button>
    </div>`).join('');
}

function deleteKanbanCard(id,col){
  D.kanban[col]=D.kanban[col].filter(c=>c.id!==id);
  saveData();renderKanban();showToast('Kart silindi');
}

// ─────────────────────────── WEEKLY ───────────────────────────────────────
function renderWeekly(){
  const now=new Date();
  const ws=new Date(now);ws.setDate(now.getDate()-((now.getDay()+6)%7));ws.setHours(0,0,0,0);
  const we=new Date(ws);we.setDate(ws.getDate()+7);
  const todayKey=now.toISOString().split('T')[0];

  // Bu hafta istatistikleri
  const cw=D.completedTodos.filter(t=>new Date(t.completedAt)>=ws&&new Date(t.completedAt)<we);
  const dw=D.diary.filter(e=>new Date(e.createdAt)>=ws&&new Date(e.createdAt)<we);
  const nw=D.notes.filter(n=>new Date(n.createdAt)>=ws&&new Date(n.createdAt)<we);
  const streak=calcStreak();

  // Günlük bar verisi (Pzt-Paz)
  const days=['Pzt','Sal','Çar','Per','Cum','Cmt','Paz'];
  const barData=days.map((_,i)=>{
    const d=new Date(ws);d.setDate(ws.getDate()+i);
    const dk=d.toISOString().split('T')[0];
    return{
      count:D.completedTodos.filter(t=>t.completedAt?.startsWith(dk)).length,
      isToday:dk===todayKey,
      day:days[i]
    };
  });
  const maxBar=Math.max(...barData.map(b=>b.count),1);

  // Son 4 haftanın karşılaştırması
  const weeklyTrend=[];
  for(let w=0;w<4;w++){
    const wStart=new Date(ws);wStart.setDate(ws.getDate()-w*7);
    const wEnd=new Date(wStart);wEnd.setDate(wStart.getDate()+7);
    weeklyTrend.unshift(D.completedTodos.filter(t=>{const d=new Date(t.completedAt);return d>=wStart&&d<wEnd;}).length);
  }

  // Öncelik dağılımı
  const byPrio={easy:0,mid:0,hard:0};
  cw.forEach(t=>byPrio[t.priority||'mid']++);
  const prioTotal=cw.length||1;

  // Bugün tamamlanan
  const todayDone=D.completedTodos.filter(t=>t.completedAt?.startsWith(todayKey));

  document.getElementById('weeklyContent').innerHTML=`
    <!-- Streak kartı -->
    <div class="weekly-card" style="background:linear-gradient(135deg,rgba(124,111,247,.12),rgba(168,157,254,.06));border-color:rgba(124,111,247,.25);">
      <div style="display:flex;align-items:center;gap:16px;">
        <div style="font-size:2.4rem;line-height:1;">${streak>=7?'\ud83d\udd25':streak>=3?'⚡':'✨'}</div>
        <div style="flex:1;">
          <div style="font-size:1.8rem;font-weight:600;color:var(--accent2);font-family:JetBrains Mono,monospace;line-height:1;">${streak}</div>
          <div style="font-size:.72rem;color:var(--text2);margin-top:2px;">günlük seri \ud83d\udd25</div>
          <div style="font-size:.6rem;color:var(--text3);margin-top:1px;">${streak>=7?'Harika gidiyorsun! Devam et \ud83d\udcaa':streak>=3?'İyi momentum, devam!':'Her gün bir adım at'}</div>
        </div>
        <div style="text-align:center;">
          <div style="font-size:1.2rem;font-weight:600;color:var(--easy);font-family:JetBrains Mono,monospace;">${todayDone.length}</div>
          <div style="font-size:.56rem;color:var(--text3);">bugün</div>
        </div>
      </div>
    </div>

    <!-- Bu hafta özeti -->
    <div class="weekly-card">
      <div class="weekly-card-title" style="margin-bottom:12px;">Bu Hafta</div>
      <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:8px;margin-bottom:14px;">
        <div style="background:var(--bg3);border-radius:10px;padding:10px;text-align:center;">
          <div style="font-size:1.4rem;font-weight:600;color:var(--accent2);font-family:JetBrains Mono,monospace;">${cw.length}</div>
          <div style="font-size:.56rem;color:var(--text3);margin-top:2px;">Görev</div>
        </div>
        <div style="background:var(--bg3);border-radius:10px;padding:10px;text-align:center;">
          <div style="font-size:1.4rem;font-weight:600;color:var(--diary);font-family:JetBrains Mono,monospace;">${dw.length}</div>
          <div style="font-size:.56rem;color:var(--text3);margin-top:2px;">Günlük</div>
        </div>
        <div style="background:var(--bg3);border-radius:10px;padding:10px;text-align:center;">
          <div style="font-size:1.4rem;font-weight:600;color:var(--note);font-family:JetBrains Mono,monospace;">${nw.length}</div>
          <div style="font-size:.56rem;color:var(--text3);margin-top:2px;">Not</div>
        </div>
      </div>

      <!-- Günlük bar chart -->
      <div style="display:flex;align-items:flex-end;gap:4px;height:52px;margin-bottom:4px;">
        ${barData.map(b=>`
          <div style="flex:1;display:flex;flex-direction:column;align-items:center;gap:2px;height:100%;">
            <div style="flex:1;width:100%;display:flex;align-items:flex-end;">
              <div style="width:100%;height:${Math.max(3,(b.count/maxBar)*44)}px;background:${b.isToday?'var(--accent)':'var(--border2)'};border-radius:3px 3px 0 0;transition:height .4s;"></div>
            </div>
            ${b.count>0?`<div style="font-size:.42rem;font-family:JetBrains Mono,monospace;color:var(--accent2);">${b.count}</div>`:''}
          </div>`).join('')}
      </div>
      <div style="display:flex;gap:4px;">
        ${barData.map(b=>`<div style="flex:1;text-align:center;font-size:.48rem;font-family:JetBrains Mono,monospace;color:${b.isToday?'var(--accent2)':'var(--text3)'};">${b.day}</div>`).join('')}
      </div>
    </div>

    <!-- Öncelik dağılımı -->
    ${cw.length?`<div class="weekly-card">
      <div class="weekly-card-title" style="margin-bottom:10px;">Öncelik Dağılımı</div>
      <div style="display:flex;flex-direction:column;gap:6px;">
        ${[{k:'easy',lbl:'Kolay',clr:'var(--easy)'},{k:'mid',lbl:'Orta',clr:'var(--mid)'},{k:'hard',lbl:'Zor',clr:'var(--hard)'}].map(p=>`
          <div style="display:flex;align-items:center;gap:8px;">
            <div style="font-size:.66rem;color:var(--text3);width:36px;">${p.lbl}</div>
            <div style="flex:1;background:var(--bg3);border-radius:4px;height:7px;overflow:hidden;">
              <div style="height:100%;width:${(byPrio[p.k]/prioTotal*100).toFixed(0)}%;background:${p.clr};border-radius:4px;transition:width .5s;"></div>
            </div>
            <div style="font-size:.62rem;font-family:JetBrains Mono,monospace;color:${p.clr};width:16px;text-align:right;">${byPrio[p.k]}</div>
          </div>`).join('')}
      </div>
    </div>`:''}

    <!-- 4 haftalık trend -->
    <div class="weekly-card">
      <div class="weekly-card-title" style="margin-bottom:10px;">Son 4 Hafta</div>
      <div style="display:flex;align-items:flex-end;gap:8px;height:44px;margin-bottom:4px;">
        ${weeklyTrend.map((v,i)=>{const maxT=Math.max(...weeklyTrend,1);return`<div style="flex:1;display:flex;flex-direction:column;align-items:center;gap:2px;">
          <div style="font-size:.48rem;font-family:JetBrains Mono,monospace;color:${i===3?'var(--accent2)':'var(--text3)'};">${v}</div>
          <div style="width:100%;height:${Math.max(4,(v/maxT)*36)}px;background:${i===3?'var(--accent)':'var(--border2)'};border-radius:3px 3px 0 0;"></div>
        </div>`;}).join('')}
      </div>
      <div style="display:flex;gap:8px;">
        ${weeklyTrend.map((_,i)=>`<div style="flex:1;text-align:center;font-size:.48rem;color:${i===3?'var(--accent2)':'var(--text3)'};">${i===3?'Bu hafta':`-${3-i}h`}</div>`).join('')}
      </div>
    </div>

    <!-- Bu hafta tamamlananlar -->
    <div class="weekly-card">
      <div class="weekly-card-title" style="margin-bottom:8px;">Tamamlananlar</div>
      ${cw.length?cw.slice(0,8).map(t=>`
        <div style="display:flex;align-items:center;gap:8px;padding:6px 0;border-bottom:1px solid var(--border);">
          <svg viewBox="0 0 24 24" fill="none" stroke="var(--easy)" stroke-width="2.5" style="width:12px;height:12px;flex-shrink:0;"><polyline points="20 6 9 17 4 12"/></svg>
          <span style="flex:1;font-size:.76rem;font-weight:300;color:var(--text2);">${escHtml(t.text)}</span>
          <span style="font-size:.52rem;font-family:JetBrains Mono,monospace;color:var(--text3);">${t.completedAt?.split('T')[0]?.slice(5)||''}</span>
        </div>`).join('')
      :'<div style="color:var(--text3);font-size:.74rem;padding:8px 0;font-style:italic;">Bu hafta henüz tamamlanan görev yok.</div>'}
      ${cw.length>8?`<div style="font-size:.62rem;color:var(--text3);padding:6px 0;">+${cw.length-8} görev daha</div>`:''}
    </div>

    <div class="action-row">
      <button class="action-btn a-pro" onclick="exportData()">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width:13px;height:13px;"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>Dışa Aktar
      </button>
    </div>`;
}

function calcStreak(){
  let s=0;const now=new Date();now.setHours(0,0,0,0);
  for(let i=0;i<365;i++){
    const d=new Date(now);d.setDate(now.getDate()-i);
    const dk=d.toISOString().split('T')[0];
    const ok=D.completedTodos.some(t=>t.completedAt?.startsWith(dk))||D.diary.some(e=>e.createdAt?.startsWith(dk))||D.notes.some(n=>n.createdAt?.startsWith(dk));
    if(ok)s++;else if(i>0)break;
  }
  return s;
}

// ─────────────────────────── READING ──────────────────────────────────────
function openReadingAdd(){document.getElementById('readingTitleInput').value='';document.getElementById('readingAuthorInput').value='';document.getElementById('readingStatusInput').value='toread';openModal('readingAddModal');}
function saveReadingItem(){
  const title=document.getElementById('readingTitleInput').value.trim();
  if(!title)return;
  const today=new Date().toISOString().split('T')[0];
  D.reading.push({
    id:Date.now(),title,
    author:document.getElementById('readingAuthorInput').value.trim(),
    type:document.getElementById('readingTypeInput')?.value||'book',
    pages:parseInt(document.getElementById('readingPagesInput')?.value)||0,
    goalDate:document.getElementById('readingGoalDate')?.value||'',
    startDate:document.getElementById('readingStartDate')?.value||today,
    notes:document.getElementById('readingNotesInput')?.value.trim()||'',
    status:document.getElementById('readingStatusInput').value,
    pagesRead:0,
    createdAt:new Date().toISOString()
  });
  saveData();closeModal('readingAddModal');renderReading();showToast('Eklendi \ud83d\udcda');
}
function cycleReadingStatus(id){const item=D.reading.find(r=>r.id===id);if(!item)return;const cycle={toread:'reading',reading:'done',done:'toread'};item.status=cycle[item.status];saveData();renderReading();}
function renderReading(){
  const cols=[
    {key:'reading',lbl:'\ud83d\udcd6 Okunuyor',clr:'var(--accent2)'},
    {key:'toread',lbl:'\ud83d\udccc Okunacak',clr:'var(--text3)'},
    {key:'done',lbl:'✅ Bitti',clr:'var(--easy)'},
  ];
  const typeIco={book:'\ud83d\udcda',article:'\ud83d\udcc4',paper:'\ud83d\udd2c',other:'\ud83d\udcce'};
  // 3 sütun layout
  let html='<div style="display:grid;grid-template-columns:repeat(3,1fr);gap:10px;margin-bottom:14px;">';
  cols.forEach(col=>{
    const items=D.reading.filter(r=>r.status===col.key);
    html+=`<div style="background:var(--bg2);border:1px solid var(--border);border-radius:12px;overflow:hidden;">
      <div style="padding:9px 10px;border-bottom:1px solid var(--border);display:flex;align-items:center;gap:5px;">
        <span style="font-size:.68rem;font-weight:500;color:${col.clr};">${col.lbl}</span>
        <span style="font-size:.58rem;font-family:JetBrains Mono,monospace;color:var(--text3);margin-left:auto;">${items.length}</span>
      </div>
      <div style="padding:8px;display:flex;flex-direction:column;gap:6px;min-height:60px;">`;
    items.forEach(item=>{
      const ico=typeIco[item.type||'book']||'\ud83d\udcda';
      const pct=item.pages?Math.min(100,Math.round((item.pagesRead||0)/item.pages*100)):0;
      html+=`<div style="background:var(--bg3);border:1px solid var(--border);border-radius:9px;padding:8px;position:relative;">
        <div style="display:flex;align-items:flex-start;gap:5px;margin-bottom:${item.pages&&col.key==='reading'?'5px':'0'};">
          <span style="font-size:.8rem;flex-shrink:0;">${ico}</span>
          <div style="flex:1;min-width:0;">
            <div style="font-size:.68rem;color:var(--text2);line-height:1.3;overflow:hidden;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;">${escHtml(item.title)}</div>
            ${item.author?`<div style="font-size:.56rem;color:var(--text3);margin-top:1px;">${escHtml(item.author)}</div>`:''}
          </div>
          <div style="display:flex;gap:2px;flex-shrink:0;">
            <button onclick="cycleReadingStatus(${item.id})" title="Durum değiştir" style="background:none;border:1px solid var(--border);border-radius:5px;cursor:pointer;color:var(--text3);width:20px;height:20px;display:flex;align-items:center;justify-content:center;font-size:.58rem;transition:all .15s;" onmouseover="this.style.background='rgba(124,111,247,.15)'" onmouseout="this.style.background='none'">↕</button>
            <button onclick="openReadingEdit(${item.id})" title="Düzenle" style="background:none;border:1px solid var(--border);border-radius:5px;cursor:pointer;color:var(--text3);width:20px;height:20px;display:flex;align-items:center;justify-content:center;transition:all .15s;" onmouseover="this.style.color='var(--accent2)'" onmouseout="this.style.color='var(--text3)'">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" style="width:9px;height:9px;pointer-events:none;"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
            </button>
            <button onclick="deleteReadingItem(${item.id})" title="Sil" style="background:none;border:1px solid var(--border);border-radius:5px;cursor:pointer;color:var(--text3);width:20px;height:20px;display:flex;align-items:center;justify-content:center;font-size:.7rem;transition:all .15s;" onmouseover="this.style.color='var(--hard)'" onmouseout="this.style.color='var(--text3)'">✕</button>
          </div>
        </div>
        ${item.pages&&col.key==='reading'?`<div style="background:var(--bg2);border-radius:3px;height:3px;overflow:hidden;"><div style="height:100%;width:${pct}%;background:linear-gradient(90deg,var(--accent),var(--accent2));border-radius:3px;"></div></div><div style="font-size:.5rem;color:var(--accent2);font-family:JetBrains Mono,monospace;margin-top:2px;">${pct}%</div>`:''}
        ${item.goalDate&&col.key!=='done'?`<div style="font-size:.5rem;color:var(--text3);margin-top:2px;">\ud83c\udfaf ${item.goalDate}</div>`:''}
      </div>`;
    });
    if(!items.length)html+=`<div style="font-size:.62rem;color:var(--text3);text-align:center;padding:12px 0;font-style:italic;">Boş</div>`;
    html+='</div></div>';
  });
  html+='</div>';
  document.getElementById('readingList').innerHTML=html;
  updateReadingTodayCard();
}

function openReadingEdit(id){
  const item=D.reading.find(r=>r.id===id);if(!item)return;
  const modal=document.createElement('div');
  modal.id='readingEditModal';
  modal.style.cssText='position:fixed;inset:0;z-index:3500;background:rgba(0,0,0,.6);display:flex;align-items:center;justify-content:center;padding:20px;';
  modal.innerHTML=`<div style="background:var(--bg2);border:1px solid var(--border);border-radius:16px;padding:22px;width:100%;max-width:360px;max-height:88vh;overflow-y:auto;position:relative;">
    <button onclick="document.getElementById('readingEditModal').remove()" style="position:absolute;top:10px;right:12px;background:none;border:none;font-size:1.1rem;cursor:pointer;color:var(--text3);">✕</button>
    <div style="font-size:.86rem;font-weight:500;color:var(--text);margin-bottom:14px;">✏️ Düzenle</div>
    <input type="text" id="reTitle" value="${escHtml(item.title)}" style="width:100%;background:var(--bg3);border:1px solid var(--border);border-radius:8px;padding:9px 12px;font-family:'Sora',sans-serif;font-size:.84rem;color:var(--text);outline:none;margin-bottom:8px;box-sizing:border-box;">
    <input type="text" id="reAuthor" value="${escHtml(item.author||'')}" placeholder="Yazar..." style="width:100%;background:var(--bg3);border:1px solid var(--border);border-radius:8px;padding:9px 12px;font-family:'Sora',sans-serif;font-size:.82rem;color:var(--text);outline:none;margin-bottom:8px;box-sizing:border-box;">
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-bottom:8px;">
      <div><div style="font-size:.62rem;color:var(--text3);margin-bottom:3px;">Toplam Sayfa</div><input type="number" id="rePages" value="${item.pages||''}" style="width:100%;background:var(--bg3);border:1px solid var(--border);border-radius:8px;padding:8px 10px;font-family:'Sora',sans-serif;font-size:.8rem;color:var(--text);outline:none;box-sizing:border-box;"></div>
      <div><div style="font-size:.62rem;color:var(--text3);margin-bottom:3px;">Okunan Sayfa</div><input type="number" id="reRead" value="${item.pagesRead||0}" style="width:100%;background:var(--bg3);border:1px solid var(--border);border-radius:8px;padding:8px 10px;font-family:'Sora',sans-serif;font-size:.8rem;color:var(--text);outline:none;box-sizing:border-box;"></div>
    </div>
    <div style="font-size:.62rem;color:var(--text3);margin-bottom:3px;">Durum</div>
    <select id="reStatus" style="width:100%;background:var(--bg3);border:1px solid var(--border);border-radius:8px;padding:8px 12px;font-family:'Sora',sans-serif;font-size:.8rem;color:var(--text);outline:none;margin-bottom:8px;box-sizing:border-box;">
      <option value="toread" ${item.status==='toread'?'selected':''}>\ud83d\udccc Okunacak</option>
      <option value="reading" ${item.status==='reading'?'selected':''}>\ud83d\udcd6 Okunuyor</option>
      <option value="done" ${item.status==='done'?'selected':''}>✅ Tamamlandı</option>
    </select>
    <div style="display:flex;gap:8px;margin-top:6px;">
      <button onclick="saveReadingEdit(${id})" style="flex:1;padding:11px;background:linear-gradient(135deg,var(--accent),rgba(124,111,247,.8));border:none;border-radius:10px;color:#fff;font-family:'Sora',sans-serif;font-size:.84rem;cursor:pointer;">Kaydet</button>
      <button onclick="deleteReadingItem(${id});document.getElementById('readingEditModal')?.remove()" style="padding:11px 14px;background:rgba(248,113,113,.1);border:1px solid rgba(248,113,113,.25);border-radius:10px;color:var(--hard);font-family:'Sora',sans-serif;font-size:.84rem;cursor:pointer;">Sil</button>
    </div>
  </div>`;
  document.body.appendChild(modal);
  modal.addEventListener('click',e=>{if(e.target===modal)modal.remove();});
}
function saveReadingEdit(id){
  const item=D.reading.find(r=>r.id===id);if(!item)return;
  item.title=document.getElementById('reTitle')?.value.trim()||item.title;
  item.author=document.getElementById('reAuthor')?.value.trim()||'';
  item.pages=parseInt(document.getElementById('rePages')?.value)||0;
  item.pagesRead=parseInt(document.getElementById('reRead')?.value)||0;
  item.status=document.getElementById('reStatus')?.value||item.status;
  if(item.status==='done'&&!item.completedAt)item.completedAt=new Date().toISOString();
  saveData();renderReading();document.getElementById('readingEditModal')?.remove();showToast('Güncellendi ✓');
}
function deleteReadingItem(id){
  D.reading=D.reading.filter(r=>r.id!==id);
  saveData();renderReading();showToast('Silindi');
}
function getReadingAIEstimate(item){
  if(!item.pages||!item.pagesRead||!item.startDate)return'';
  const start=new Date(item.startDate);const now=new Date();
  const daysPassed=Math.max(1,Math.ceil((now-start)/(1000*60*60*24)));
  const rate=item.pagesRead/daysPassed; // sayfa/gün
  if(rate<0.1)return'';
  const remaining=item.pages-item.pagesRead;
  const daysLeft=Math.ceil(remaining/rate);
  const finishDate=new Date(now);finishDate.setDate(now.getDate()+daysLeft);
  const finishStr=finishDate.toLocaleDateString('tr-TR',{day:'numeric',month:'short'});
  const rateStr=rate>=1?`${rate.toFixed(1)} sayfa/gün`:`${Math.round(1/rate)} günde 1 sayfa`;
  return`<div style="font-size:.6rem;color:var(--text3);margin-top:4px;font-style:italic;">\ud83e\udd16 Bu hızda (${rateStr}) ${finishStr}'de bitirirsin — ${daysLeft} gün kaldı</div>`;
}

function updateReadingPage(){
  const active=D.reading.find(r=>r.status==='reading');
  if(!active){showToast('Okunuyor durumunda kitap yok');return;}
  const inp=document.getElementById('readingPageInput');
  const val=parseInt(inp?.value);
  if(isNaN(val)||val<0){showToast('Geçerli bir sayfa no gir');return;}
  active.pagesRead=val;
  if(active.pages&&val>=active.pages){
    active.status='done';
    active.completedAt=new Date().toISOString();
    addNotification(`\ud83c\udf89 "${active.title}" kitabını bitirdin! Tebrikler!`,'reading');
    showToast('Kitap tamamlandı! \ud83c\udf89');
  } else {
    showToast(`Sayfa güncellendi: ${val}${active.pages?' / '+active.pages:''}`);
  }
  if(inp)inp.value='';
  saveData();renderReading();
}

function updateReadingTodayCard(){
  const card=document.getElementById('readingTodayCard');
  if(!card)return;
  const active=D.reading.find(r=>r.status==='reading');
  if(!active){card.style.display='none';return;}
  card.style.display='block';
  const titleEl=document.getElementById('readingActiveTitle');
  const barEl=document.getElementById('readingProgressBar');
  const pctEl=document.getElementById('readingProgressPct');
  const estimateEl=document.getElementById('readingAIEstimate');
  if(titleEl)titleEl.textContent=active.title;
  const pct=active.pages?Math.min(100,Math.round((active.pagesRead||0)/active.pages*100)):0;
  if(barEl)barEl.style.width=pct+'%';
  if(pctEl)pctEl.textContent=pct+'%';
  const inp=document.getElementById('readingPageInput');
  if(inp)inp.placeholder=`Mevcut: sayfa ${active.pagesRead||0}${active.pages?' / '+active.pages:''}`;
  if(estimateEl){
    const est=getReadingAIEstimate(active);
    estimateEl.innerHTML=est?est.replace('<div ','<span ').replace('</div>','</span>'):'';
  }
}

function openReadingPageUpdate(id){
  const item=D.reading.find(r=>r.id===id);if(!item)return;
  const modal=document.createElement('div');
  modal.id='readingPageModal';
  modal.style.cssText='position:fixed;inset:0;z-index:3500;background:rgba(0,0,0,.6);display:flex;align-items:center;justify-content:center;padding:20px;';
  modal.innerHTML=`<div style="background:var(--bg2);border:1px solid var(--border);border-radius:16px;padding:22px;width:100%;max-width:300px;">
    <button onclick="document.getElementById('readingPageModal').remove()" style="float:right;background:none;border:none;cursor:pointer;color:var(--text3);font-size:1.1rem;">✕</button>
    <div style="font-size:.84rem;font-weight:500;color:var(--text);margin-bottom:4px;">${escHtml(item.title)}</div>
    <div style="font-size:.66rem;color:var(--text3);margin-bottom:14px;">${item.pages?`Toplam: ${item.pages} sayfa`:''}</div>
    <div style="font-size:.72rem;color:var(--text2);margin-bottom:6px;">Şu anki sayfa:</div>
    <input type="number" id="rpModalInput" min="0" max="${item.pages||9999}" value="${item.pagesRead||0}"
      style="width:100%;background:var(--bg3);border:1px solid var(--border);border-radius:8px;padding:10px 12px;font-size:1.1rem;font-family:JetBrains Mono,monospace;color:var(--text);outline:none;text-align:center;margin-bottom:12px;box-sizing:border-box;">
    <button onclick="saveReadingPage(${id})" style="width:100%;padding:11px;background:linear-gradient(135deg,var(--accent),rgba(124,111,247,.8));border:none;border-radius:10px;color:#fff;font-family:'Sora',sans-serif;font-size:.84rem;cursor:pointer;">Kaydet</button>
  </div>`;
  document.body.appendChild(modal);
  modal.addEventListener('click',e=>{if(e.target===modal)modal.remove();});
  setTimeout(()=>document.getElementById('rpModalInput')?.focus(),100);
}

function saveReadingPage(id){
  const item=D.reading.find(r=>r.id===id);if(!item)return;
  const val=parseInt(document.getElementById('rpModalInput')?.value)||0;
  item.pagesRead=val;
  if(item.pages&&val>=item.pages){
    item.status='done';
    item.completedAt=new Date().toISOString();
    addNotification(`\ud83c\udf89 "${item.title}" kitabını bitirdin! Tebrikler!`,'reading');
    showToast('Kitap tamamlandı! \ud83c\udf89');
  } else {
    showToast(`Sayfa güncellendi: ${val}${item.pages?' / '+item.pages:''}`);
  }
  document.getElementById('readingPageModal')?.remove();
  saveData();renderReading();
}

function openReadingDetail(id){
  openReadingPageUpdate(id);
}



// ─────────────────────────── DERS PROGRAMI ────────────────────────────────
let schedColor='#7c6ff7';
function selectSchedColor(el){schedColor=el.dataset.color;document.querySelectorAll('#scheduleColorPicker .color-dot').forEach(d=>d.classList.toggle('sel',d===el));}
function openScheduleAdd(){schedColor='#7c6ff7';document.getElementById('scheduleNameInput').value='';document.getElementById('scheduleRoomInput').value='';document.getElementById('scheduleStartInput').value='';document.getElementById('scheduleEndInput').value='';document.querySelectorAll('#scheduleDayPicker input').forEach(i=>i.checked=false);document.querySelectorAll('#scheduleColorPicker .color-dot').forEach((d,i)=>d.classList.toggle('sel',i===0));openModal('scheduleAddModal');}
function saveScheduleItem(){
  const name=document.getElementById('scheduleNameInput').value.trim();
  if(!name)return;
  const days=[...document.querySelectorAll('#scheduleDayPicker input:checked')].map(i=>parseInt(i.value));
  if(!days.length){showToast('En az bir gün seç');return;}
  const item={id:Date.now(),name,room:document.getElementById('scheduleRoomInput').value.trim(),start:document.getElementById('scheduleStartInput').value,end:document.getElementById('scheduleEndInput').value,days,color:schedColor,createdAt:new Date().toISOString()};
  const schedWeekly=localStorage.getItem('capsula_sched_weekly')==='on';
  if(schedWeekly){
    const wk=getViewWeekKey();
    if(!D.scheduleWeeks)D.scheduleWeeks={};
    if(!D.scheduleWeeks[wk])D.scheduleWeeks[wk]=[];
    D.scheduleWeeks[wk].push(item);
  } else {
    D.schedule.push(item);
  }
  saveData();closeModal('scheduleAddModal');renderSchedule();showToast('Ders eklendi');
}
function deleteScheduleItem(id){
  const schedWeekly=localStorage.getItem('capsula_sched_weekly')==='on';
  if(schedWeekly){
    const wk=getViewWeekKey();
    if(!D.scheduleWeeks)D.scheduleWeeks={};
    if(D.scheduleWeeks[wk])D.scheduleWeeks[wk]=D.scheduleWeeks[wk].filter(s=>s.id!==id);
  } else {
    D.schedule=D.schedule.filter(s=>s.id!==id);
  }
  saveData();renderSchedule();
}
function getCurrentWeekKey(){
  const now=new Date();const yr=now.getFullYear();
  const start=new Date(yr,0,1);
  const wk=Math.ceil(((now-start)/86400000+start.getDay()+1)/7);
  return `${yr}-W${String(wk).padStart(2,'0')}`;
}
function getCurrentWeekKeyFor(date){
  const yr=date.getFullYear();const start=new Date(yr,0,1);
  const wk=Math.ceil(((date-start)/86400000+start.getDay()+1)/7);
  return`${yr}-W${String(wk).padStart(2,'0')}`;
}
function getWeekRange(weekKey){
  const [yr,wPart]=weekKey.split('-W');const y=parseInt(yr),w=parseInt(wPart);
  const jan1=new Date(y,0,1);const dayOfWeek=jan1.getDay()||7;
  const monday=new Date(jan1);monday.setDate(jan1.getDate()+(1-dayOfWeek)+7*(w-1));
  const sunday=new Date(monday);sunday.setDate(monday.getDate()+6);
  const fmt=d=>d.toLocaleDateString('tr-TR',{day:'numeric',month:'short'});
  return`${fmt(monday)} – ${fmt(sunday)}`;
}
let schedWeekOffset=0;
function changeSchedWeek(offset){if(offset===0)schedWeekOffset=0;else schedWeekOffset+=offset;renderSchedule();}
function getViewWeekKey(){
  if(schedWeekOffset===0)return getCurrentWeekKey();
  const now=new Date();now.setDate(now.getDate()+schedWeekOffset*7);
  return getCurrentWeekKeyFor(now);
}
function renderSchedule(){
  const dayNames=['Pazar','Pazartesi','Salı','Çarşamba','Perşembe','Cuma','Cumartesi'];
  const orderedDays=[1,2,3,4,5,6,0];
  const schedWeekly=localStorage.getItem('capsula_sched_weekly')==='on';
  const curWk=getCurrentWeekKey();const viewWk=getViewWeekKey();
  const wNum=viewWk.split('-W')[1];const wRange=getWeekRange(viewWk);
  const wnEl=document.getElementById('schedWeekNum');const wrEl=document.getElementById('schedWeekRange');
  const mlEl=document.getElementById('schedModeLabel');const navEl=document.getElementById('schedWeekNav');
  if(wnEl)wnEl.textContent=`Hafta ${wNum}`;if(wrEl)wrEl.textContent=wRange;
  if(mlEl)mlEl.textContent=schedWeekly?'\ud83d\udcc5 Her hafta farklı':'\ud83d\udccc Sabit program';
  if(navEl)navEl.style.display=schedWeekly?'flex':'none';
  let lessons=[];
  if(schedWeekly){if(!D.scheduleWeeks)D.scheduleWeeks={};lessons=D.scheduleWeeks[viewWk]||[];}
  else{lessons=D.schedule||[];}
  let html='';
  if(schedWeekly&&viewWk!==curWk){
    html+=`<div style="text-align:center;padding:8px;font-size:.66rem;color:var(--text3);font-style:italic;margin-bottom:8px;">${schedWeekOffset<0?'Geçmiş hafta':'Gelecek hafta'} · ${wRange}</div>`;
  }
  const todayDay=new Date().getDay();
  orderedDays.forEach(dayIdx=>{
    const dayLessons=lessons.filter(s=>s.days.includes(dayIdx)).sort((a,b)=>a.start.localeCompare(b.start));
    const hasClass=dayLessons.length>0;const isToday=dayIdx===todayDay;
    html+=`<div class="sched-day-block"><div class="sched-day-header${hasClass?' has-class':''}" style="${isToday?'color:var(--accent2);':''}">${dayNames[dayIdx]}${isToday?' <span style="font-size:.48rem;background:var(--accent);color:#fff;border-radius:4px;padding:1px 5px;vertical-align:middle;">Bugün</span>':''}</div>`;
    if(dayLessons.length){dayLessons.forEach(l=>{html+=`<div class="sched-lesson"><div class="sched-color-bar" style="background:${l.color}"></div><div style="flex:1"><div class="sched-lesson-name">${escHtml(l.name)}</div>${l.room||l.sub?`<div class="sched-lesson-room">${escHtml(l.room||l.sub)}</div>`:''}</div>${l.link?`<a href="${escHtml(l.link)}" target="_blank" style="color:var(--accent2);font-size:.62rem;text-decoration:none;padding:2px 6px;border:1px solid rgba(124,111,247,.3);border-radius:5px;flex-shrink:0;">\ud83d\udd17</a>`:''}<div class="sched-lesson-time">${l.start||''}${l.start&&l.end?' – ':''  }${l.end||''}</div><button onclick="openScheduleEdit(${l.id})" style="background:none;border:none;cursor:pointer;color:var(--text3);padding:3px;border-radius:5px;flex-shrink:0;" title="Düzenle"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width:12px;height:12px;"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg></button><button class="sched-delete-btn" onclick="deleteScheduleItem(${l.id})">✕</button></div>`});}
    else{html+=`<div style="padding:8px 12px;font-size:.68rem;color:var(--text3);font-style:italic;">Ders yok</div>`;}
    html+='</div>';
  });
  document.getElementById('scheduleDays').innerHTML=html||'<div class="empty-state">Ders programı boş.<br>Üstten ders ekle.</div>';
}
function toggleSchedWeekly(){
  const cur=localStorage.getItem('capsula_sched_weekly')==='on';
  localStorage.setItem('capsula_sched_weekly',cur?'off':'on');
  const tog=document.getElementById('schedWeeklyToggle');if(tog)tog.classList.toggle('on',!cur);
  schedWeekOffset=0;renderSchedule();showToast(cur?'Sabit program modu':'Haftalık program modu');
}

// ─────────────────────────── SINAV TAKVİMİ ────────────────────────────────
function openExamAdd(){document.getElementById('examNameInput').value='';document.getElementById('examDateInput').value='';document.getElementById('examTimeInput').value='';document.getElementById('examNoteInput').value='';document.querySelector('[name="examType"][value="exam"]').checked=true;document.querySelectorAll('.exam-type-opt').forEach(el=>{el.classList.toggle('sel',el.querySelector('input').value==='exam');});openModal('examAddModal');}
document.addEventListener('change',e=>{if(e.target.name==='examType'){document.querySelectorAll('.exam-type-opt').forEach(el=>el.classList.toggle('sel',el.querySelector('input')===e.target));}});
function saveExamItem(){
  const name=document.getElementById('examNameInput').value.trim();
  if(!name)return;
  const type=document.querySelector('[name="examType"]:checked')?.value||'exam';
  D.exams.push({id:Date.now(),name,date:document.getElementById('examDateInput').value,time:document.getElementById('examTimeInput').value,type,note:document.getElementById('examNoteInput').value.trim(),createdAt:new Date().toISOString()});
  saveData();closeModal('examAddModal');renderExams();showToast('Eklendi');
}
function deleteExamItem(id){D.exams=D.exams.filter(e=>e.id!==id);saveData();renderExams();}
function renderExams(){
  const today=new Date();today.setHours(0,0,0,0);
  const typeLabels={exam:'\ud83d\udcdd Sınav',hw:'\ud83d\udcda Ödev',project:'\ud83d\udd2c Proje'};
  const sorted=[...D.exams].sort((a,b)=>{if(!a.date)return 1;if(!b.date)return -1;return a.date.localeCompare(b.date);});
  const upcoming=sorted.filter(e=>{if(!e.date)return true;const d=new Date(e.date);d.setHours(0,0,0,0);return d>=today;});
  const past=sorted.filter(e=>{if(!e.date)return false;const d=new Date(e.date);d.setHours(0,0,0,0);return d<today;});
  function examCard(e){
    let cls='',badge='',diff=null;
    if(e.date){const d=new Date(e.date);d.setHours(0,0,0,0);diff=Math.round((d-today)/(86400000));if(diff<0){cls='overdue';badge=`<span class="exam-countdown overdue">${Math.abs(diff)} gün geçti</span>`;}else if(diff===0){cls='today';badge=`<span class="exam-countdown today">Bugün!</span>`;}else if(diff<=7){badge=`<span class="exam-countdown soon">${diff} gün kaldı</span>`;}else{badge=`<span class="exam-countdown later">${diff} gün kaldı</span>`;}}
    return`<div class="exam-item ${cls}"><div>${badge}</div><div style="flex:1;min-width:0;"><div class="exam-name">${escHtml(e.name)}</div><div class="exam-meta"><span class="exam-type-badge">${typeLabels[e.type]||'\ud83d\udcdd'}</span>${e.date?fmtDate(e.date):'Tarih yok'}${e.time?' · '+e.time:''}${e.note?` · ${escHtml(e.note)}`:''}</div></div><button class="exam-delete-btn" onclick="deleteExamItem(${e.id})">✕</button></div>`;
  }
  let html='';
  if(upcoming.length){html+=`<div class="exam-section-label">Yaklaşan (${upcoming.length})</div>`;upcoming.forEach(e=>html+=examCard(e));}
  if(past.length){html+=`<div class="exam-section-label" style="margin-top:14px;">Geçmiş (${past.length})</div>`;past.forEach(e=>html+=examCard(e));}
  document.getElementById('examList').innerHTML=html||'<div class="empty-state">Sınav veya ödev yok.<br>Üstten ekle.</div>';
}

// ─────────────────────────── NOT DEFTERİ ─────────────────────────────────
let notebookCourseFilter='all';
function openNotebookAdd(){document.getElementById('notebookCourseInput').value='';document.getElementById('notebookTitleInput').value='';document.getElementById('notebookContentInput').value='';openModal('notebookAddModal');}
function saveNotebookItem(){
  const course=document.getElementById('notebookCourseInput').value.trim();
  const title=document.getElementById('notebookTitleInput').value.trim();
  if(!title)return;
  D.notebook.push({id:Date.now(),course,title,content:document.getElementById('notebookContentInput').value.trim(),createdAt:new Date().toISOString()});
  saveData();closeModal('notebookAddModal');renderNotebook();showToast('Not kaydedildi');
}
function deleteNotebookItem(id){D.notebook=D.notebook.filter(n=>n.id!==id);saveData();renderNotebook();}
function openNotebookDetail(id){
  const item=D.notebook.find(n=>n.id===id);if(!item)return;
  const ov=document.createElement('div');ov.className='notebook-detail-overlay';
  ov.innerHTML=`<div class="notebook-detail-header"><button onclick="this.closest('.notebook-detail-overlay').remove()" style="background:none;border:none;color:var(--text2);font-size:1.1rem;cursor:pointer;padding:2px 6px;">←</button><div style="flex:1"><div style="font-size:.82rem;font-weight:500;color:var(--text);">${escHtml(item.title)}</div>${item.course?`<div style="font-size:.6rem;font-family:JetBrains Mono,monospace;color:var(--text3);margin-top:1px;">${escHtml(item.course)}</div>`:''}</div><button onclick="deleteNotebookItem(${id});this.closest('.notebook-detail-overlay').remove();" style="background:none;border:none;color:var(--text3);font-size:.72rem;cursor:pointer;padding:4px 8px;">Sil</button></div><div class="notebook-detail-body">${escHtml(item.content)||'<em style="color:var(--text3)">İçerik yok</em>'}</div>`;
  document.body.appendChild(ov);
}
function renderNotebook(){
  const courses=['all',...new Set(D.notebook.map(n=>n.course).filter(Boolean))];
  const filterEl=document.getElementById('notebookFilter');
  filterEl.innerHTML=courses.map(c=>`<button class="notebook-filter-btn${notebookCourseFilter===c?' active':''}" onclick="notebookCourseFilter='${c}';renderNotebook()">${c==='all'?'Tümü':escHtml(c)}</button>`).join('');
  const filtered=notebookCourseFilter==='all'?D.notebook:D.notebook.filter(n=>n.course===notebookCourseFilter);
  const courseColors={};
  [...new Set(D.notebook.map(n=>n.course).filter(Boolean))].forEach((c,i)=>{const palette=['#7c6ff7','#60a5fa','#f472b6','#4ade80','#fb923c','#f87171','#fbbf24'];courseColors[c]=palette[i%palette.length];});
  document.getElementById('notebookList').innerHTML=filtered.length
    ?filtered.map(n=>`<div class="notebook-card" onclick="openNotebookDetail(${n.id})"><div class="notebook-course" style="color:${courseColors[n.course]||'var(--text3)'}">${escHtml(n.course)||'Derssiz'}</div><div class="notebook-title">${escHtml(n.title)}</div><div class="notebook-preview">${escHtml(n.content)}</div><div class="notebook-date">${fmtDate(n.createdAt)}</div></div>`).join('')
    :'<div class="empty-state">Not yok.<br>Üstten ders notu ekle.</div>';
}

// ─────────────────────────── PRO PAGE ─────────────────────────────────────
function saveQuickCapture(){const text=document.getElementById('qcInput').value.trim();if(!text)return;D.notes.unshift({id:Date.now(),title:'Hızlı Not',content:text,media:[],tags:['hızlı'],createdAt:new Date().toISOString()});saveData();document.getElementById('qcInput').value='';showToast('Notlara kaydedildi ✦');renderNotes();}
function exportData(){const d=JSON.parse(JSON.stringify(D));delete d.profile.avatar;const blob=new Blob([JSON.stringify(d,null,2)],{type:'application/json'});const a=document.createElement('a');const _u1=URL.createObjectURL(blob);a.href=_u1;a.download=`capsula_yedek_${new Date().toISOString().split('T')[0]}.json`;a.click();URL.revokeObjectURL(_u1);showToast('Dışa aktarıldı \ud83d\udcc1');}
function requestNotif(){if('Notification' in window)Notification.requestPermission().then(p=>showToast(p==='granted'?'Bildirimler aktif ✓':'İzin reddedildi'));else showToast('Tarayıcı desteklemiyor');}
function renderPro(){
  const tk=new Date().toISOString().split('T')[0];
  const items=D.todos.filter(t=>!t.dueDate||t.dueDate===tk);
  const clr={easy:'var(--easy)',mid:'var(--mid)',hard:'var(--hard)'};
  document.getElementById('proTodayList').innerHTML=items.length?items.map(t=>`<div class="dash-todo-row"><div class="dash-todo-dot" style="background:${clr[t.priority]}"></div><div class="dash-todo-text">${escHtml(t.text)}</div></div>`).join(''):'<div class="empty-state" style="padding:20px 0">Bugün için görev yok.</div>';
}

// ─────────────────────────── TEMPLATES ────────────────────────────────────
const TEMPLATES={
  meeting:{title:'Toplantı Notu',content:`\ud83d\udcc5 Tarih: ${new Date().toLocaleDateString('tr-TR')}
\ud83d\udc65 Katılımcılar:

\ud83d\udccc Gündem:
1. 
2. 

✅ Alınan Kararlar:
-

\ud83d\udd1c Sonraki Adımlar:
-`,tags:['toplantı']},
  book:{title:'Kitap: ',content:`\ud83d\udcd6 Yazar:
⭐ Puan: /5

\ud83d\udca1 Ana Fikir:

\ud83d\udcdd Önemli Alıntılar:
"..."

\ud83c\udfaf Öğrendiklerim:
-

\ud83d\udd11 Uygulayacaklarım:
-`,tags:['kitap']},
  daily:{title:`Günlük Plan — ${new Date().toLocaleDateString('tr-TR',{weekday:'long'})}`,content:`\ud83c\udf05 Sabah:
□ 
□ 

☀️ Öğle:
□ 
□ 

\ud83c\udf19 Akşam:
□ 
□ 

\ud83d\udcac Bugünün niyeti:
`,tags:['plan']},
  idea:{title:'Fikir: ',content:`❓ Problem:

\ud83d\udca1 Çözüm:

✅ Avantajlar:
-

⚠️ Riskler:
-

\ud83d\udee0 Sonraki adım:
`,tags:['fikir']},
  travel:{title:'Seyahat: ',content:`✈️ Tarihler:
\ud83d\udccd Konaklama:

\ud83d\uddfa Gidilecek Yerler:
□ 
□ 

\ud83c\udf7d Denenmesi Gerekenler:
-`,tags:['seyahat']},
  goal:{title:'Hedef: ',content:`\ud83c\udfaf Hedef:

\ud83e\udd14 Neden önemli?

\ud83d\udcc5 Tamamlanma tarihi:

\ud83d\udee4 Adımlar:
1. 
2. 
3. `,tags:['hedef']},
  lecture:{title:'Ders: ',content:`\ud83c\udf93 Ders:
\ud83d\udcc5 Tarih:

\ud83d\udccc Konular:
-

\ud83d\udcdd Notlar:

❓ Sorular:
-

\ud83e\uddee Formüller:
`,tags:['ders']},
  blank:{title:'',content:'',tags:[]},
};
function openTemplates(){document.getElementById('templateOverlay').classList.add('open');}
function closeTemplates(){document.getElementById('templateOverlay').classList.remove('open');}
function useTemplate(key){closeTemplates();const tmpl=TEMPLATES[key]||TEMPLATES.blank;openEditor('note',{title:tmpl.title,content:tmpl.content});setTimeout(()=>{editorTags=[...(tmpl.tags||[])];renderTagPreview();const t=document.getElementById('editorTitle');t.setSelectionRange(t.value.length,t.value.length);},430);}
document.getElementById('templateOverlay').addEventListener('click',e=>{if(e.target===document.getElementById('templateOverlay'))closeTemplates();});

// ─────────────────────────── SPLASH SCREEN ────────────────────────────────
function runSplash(onDone){
  const el=document.getElementById('splashScreen');
  const textEl=document.getElementById('splashText');
  const cursor=document.getElementById('splashCursor');
  const tagline=document.getElementById('splashTagline');
  const barWrap=document.getElementById('splashBarWrap');
  const bar=document.getElementById('splashBar');
  const particles=document.getElementById('splashParticles');

  // Parçacıklar
  for(let i=0;i<22;i++){
    const p=document.createElement('div');
    p.className='splash-particle';
    p.style.cssText=`left:${Math.random()*100}%;top:${40+Math.random()*40}%;animation-duration:${1.8+Math.random()*2.2}s;animation-delay:${Math.random()*1.5}s;width:${1+Math.random()*3}px;height:${1+Math.random()*3}px;opacity:0;`;
    particles.appendChild(p);
  }

  // Typewriter
  const word='CAPSULA';
  let i=0;
  setTimeout(()=>{
    const timer=setInterval(()=>{
      if(i<word.length){textEl.textContent=word.slice(0,++i);}
      else{
        clearInterval(timer);
        setTimeout(()=>{
          cursor.style.animation='none';cursor.style.opacity='0';
          tagline.classList.add('show');
          barWrap.classList.add('show');
          // Progress bar
          let pct=0;
          const pTimer=setInterval(()=>{
            pct+=Math.random()*4+1.5;
            if(pct>=100){pct=100;clearInterval(pTimer);
              setTimeout(()=>{
                el.classList.add('hiding');
                setTimeout(()=>{el.style.display='none';onDone();},620);
              },260);
            }
            bar.style.width=pct+'%';
          },40);
        },400);
      }
    },110);
  },600);
}

// ─────────────────────────── TOUR ─────────────────────────────────────────
const TOUR_STEPS=[
  {selector:'.mode-pill',title:'3 Farklı Mod',desc:'Üstteki pill ile Profesyonel, Ana Ekran veya Öğrenci modunu seç. Her mod farklı araçlar sunar.',side:'bottom',round:false},
  {selector:'#hamBtn',title:'Yan Menü',desc:'Profil, tema değiştirme ve uygulama ayarlarına buradan ulaşırsın.',side:'bottom',round:false},
  {selector:'#navGlass',title:'Alt Navigasyon',desc:'Sayfalar arasında geçiş yap. Ortadaki büyük buton aktif modun ana eylemine kısayol.',side:'top',round:false},
  {selector:'#avatarBtn',title:'Profil & Ayarlar',desc:'İsmini, avatarını ve PIN korumasını buradan düzenleyebilirsin.',side:'bottom',round:true},
];

let tourIdx=0;
let tourActive=false;

function startTour(){
  const ov=document.getElementById('tourOverlay');
  ov.classList.add('active');
  tourActive=true;tourIdx=0;
  buildTourDots();
  showTourStep(0);
}

function buildTourDots(){
  const row=document.getElementById('tourDots');
  row.innerHTML=TOUR_STEPS.map((_,i)=>`<div class="tour-dot" id="td${i}"></div>`).join('');
}

function showTourStep(idx){
  const step=TOUR_STEPS[idx];
  const el=document.querySelector(step.selector);
  const hl=document.getElementById('tourHighlight');
  const tt=document.getElementById('tourTooltip');
  const nextBtn=document.getElementById('tourNextBtn');

  // Dot'ları güncelle
  TOUR_STEPS.forEach((_,i)=>{
    const d=document.getElementById('td'+i);
    if(d)d.classList.toggle('active',i===idx);
  });

  nextBtn.textContent=idx===TOUR_STEPS.length-1?'Bitir ✓':'İleri →';
  document.getElementById('tourStep').textContent=`${idx+1} / ${TOUR_STEPS.length}`;
  document.getElementById('tourTitle').textContent=step.title;
  document.getElementById('tourDesc').textContent=step.desc;

  tt.classList.remove('visible');
  hl.style.opacity='0';

  if(!el){if(idx+1<TOUR_STEPS.length)showTourStep(idx+1);else endTour();return;}

  const r=el.getBoundingClientRect();
  const pad=step.round?6:8;
  const br=step.round?'50%':'10px';

  // Highlight: box-shadow ile etraf kararır ama elementin kendisi korunur
  hl.style.cssText=`
    top:${r.top-pad}px;
    left:${r.left-pad}px;
    width:${r.width+pad*2}px;
    height:${r.height+pad*2}px;
    border-radius:${br};
    opacity:1;
    box-shadow:0 0 0 4px var(--accent), 0 0 0 9999px rgba(0,0,0,0.6);
    background:transparent;
    position:absolute;
    z-index:1;
    pointer-events:none;
    transition:all .4s cubic-bezier(.4,0,.2,1);
  `;

  // Tooltip konumlandır
  const vw=window.innerWidth,vh=window.innerHeight;
  const ttW=268,ttH=170;
  let top,left;
  if(step.side==='bottom'){
    top=r.bottom+pad+14;
    left=Math.min(Math.max(r.left+r.width/2-ttW/2,10),vw-ttW-10);
    if(top+ttH>vh-10)top=r.top-ttH-16;
  } else {
    top=r.top-ttH-16;
    left=Math.min(Math.max(r.left+r.width/2-ttW/2,10),vw-ttW-10);
    if(top<10)top=r.bottom+14;
  }
  tt.style.cssText=`top:${top}px;left:${left}px;max-width:${ttW}px;position:absolute;`;
  setTimeout(()=>tt.classList.add('visible'),80);
}

function tourNext(){
  if(tourIdx<TOUR_STEPS.length-1){tourIdx++;showTourStep(tourIdx);}
  else endTour();
}

function endTour(){
  const ov=document.getElementById('tourOverlay');
  const tt=document.getElementById('tourTooltip');
  const hl=document.getElementById('tourHighlight');
  tt.classList.remove('visible');
  hl.style.opacity='0';
  hl.style.boxShadow='none';
  setTimeout(()=>{
    ov.classList.remove('active');
    tourActive=false;
  },350);
  localStorage.setItem('capsula_toured','1');
}

function showWelcomeCard(){
  const card=document.createElement('div');
  card.className='tour-welcome';
  card.id='tourWelcome';
  card.innerHTML=`
    <div class="tour-welcome-card">
      <div class="tour-welcome-icon">✦</div>
      <div class="tour-welcome-title">Capsula'ya Hoş Geldin!</div>
      <div class="tour-welcome-sub">Görevler, notlar, günlük ve daha fazlası — hepsi burada.<br>Sana kısa bir tur yapalım mı?</div>
      <div class="tour-welcome-btns">
        <button class="tour-welcome-skip" onclick="document.getElementById('tourWelcome').remove();localStorage.setItem('capsula_toured','1');">Geç</button>
        <button class="tour-welcome-start" onclick="document.getElementById('tourWelcome').remove();startTour();">Turu Başlat →</button>
      </div>
    </div>`;
  document.body.appendChild(card);
}

// ─────────────────────────── DİL SİSTEMİ ─────────────────────────────────
const LANGS={
  tr:{
    general:'Genel',profile:'Profilim',settings:'Ayarlar',calendar:'Takvim',
    trash:'Çöp Kutusu',backup:'Yedekle & Geri Yükle',friends:'Arkadaşlar',
    reminders:'Hatırlatıcılar',about:'Hakkında',privacy:'Gizlilik Politikası',
    terms:'Kullanım Koşulları',help:'Yardım',cleardata:'Tüm Verileri Sil',
    signout:'Çıkış Yap',
    addTodo:'Yeni görev...',notes:'Notlar',diary:'Günlük',search:'Arama',
    save:'Kaydet',cancel:'İptal',add:'Ekle',
    today:'Bugün',overdue:'Gecikmiş',
    noTask:'Bugün için görev yok.',
    pro:'Pro',home:'Ana',student:'Öğrenci',
    greeting_morning:'Günaydın,',greeting_afternoon:'İyi günler,',
    greeting_evening:'İyi akşamlar,',greeting_night:'İyi geceler,',
  },
  en:{
    general:'General',profile:'My Profile',settings:'Settings',calendar:'Calendar',
    trash:'Trash',backup:'Backup & Restore',friends:'Friends',
    reminders:'Reminders',about:'About',privacy:'Privacy Policy',
    terms:'Terms of Use',help:'Help',cleardata:'Delete All Data',
    signout:'Sign Out',
    addTodo:'New task...',notes:'Notes',diary:'Journal',search:'Search',
    save:'Save',cancel:'Cancel',add:'Add',
    today:'Today',overdue:'Overdue',
    noTask:'No tasks for today.',
    pro:'Pro',home:'Home',student:'Student',
    greeting_morning:'Good morning,',greeting_afternoon:'Good afternoon,',
    greeting_evening:'Good evening,',greeting_night:'Good night,',
  },
  de:{
    general:'Allgemein',profile:'Mein Profil',settings:'Einstellungen',calendar:'Kalender',
    trash:'Papierkorb',backup:'Sichern & Wiederherstellen',friends:'Freunde',
    reminders:'Erinnerungen',about:'Über',privacy:'Datenschutz',
    terms:'Nutzungsbedingungen',help:'Hilfe',cleardata:'Alle Daten löschen',
    signout:'Abmelden',
    addTodo:'Neue Aufgabe...',notes:'Notizen',diary:'Tagebuch',search:'Suche',
    save:'Speichern',cancel:'Abbrechen',add:'Hinzufügen',
    today:'Heute',overdue:'Überfällig',
    noTask:'Keine Aufgaben für heute.',
    pro:'Pro',home:'Start',student:'Student',
    greeting_morning:'Guten Morgen,',greeting_afternoon:'Guten Tag,',
    greeting_evening:'Guten Abend,',greeting_night:'Gute Nacht,',
  },
  fr:{
    general:'Général',profile:'Mon Profil',settings:'Paramètres',calendar:'Calendrier',
    trash:'Corbeille',backup:'Sauvegarder & Restaurer',friends:'Amis',
    reminders:'Rappels',about:'À propos',privacy:'Confidentialité',
    terms:'Conditions',help:'Aide',cleardata:'Supprimer tout',
    signout:'Se déconnecter',
    addTodo:'Nouvelle tâche...',notes:'Notes',diary:'Journal',search:'Recherche',
    save:'Enregistrer',cancel:'Annuler',add:'Ajouter',
    today:"Aujourd'hui",overdue:'En retard',
    noTask:"Pas de tâches aujourd'hui.",
    pro:'Pro',home:'Accueil',student:'Étudiant',
    greeting_morning:'Bonjour,',greeting_afternoon:'Bon après-midi,',
    greeting_evening:'Bonsoir,',greeting_night:'Bonne nuit,',
  },
  es:{
    general:'General',profile:'Mi Perfil',settings:'Ajustes',calendar:'Calendario',
    trash:'Papelera',backup:'Copia de seguridad',friends:'Amigos',
    reminders:'Recordatorios',about:'Acerca de',privacy:'Privacidad',
    terms:'Términos',help:'Ayuda',cleardata:'Borrar todo',
    signout:'Cerrar sesión',
    addTodo:'Nueva tarea...',notes:'Notas',diary:'Diario',search:'Buscar',
    save:'Guardar',cancel:'Cancelar',add:'Añadir',
    today:'Hoy',overdue:'Atrasado',
    noTask:'No hay tareas para hoy.',
    pro:'Pro',home:'Inicio',student:'Estudiante',
    greeting_morning:'Buenos días,',greeting_afternoon:'Buenas tardes,',
    greeting_evening:'Buenas tardes,',greeting_night:'Buenas noches,',
  },
  ar:{
    general:'عام',profile:'ملفي',settings:'الإعدادات',calendar:'التقويم',
    trash:'المهملات',backup:'نسخ احتياطي',friends:'الأصدقاء',
    reminders:'التذكيرات',about:'حول',privacy:'الخصوصية',
    terms:'الشروط',help:'المساعدة',cleardata:'حذف كل البيانات',
    signout:'تسجيل الخروج',
    addTodo:'مهمة جديدة...',notes:'ملاحظات',diary:'يوميات',search:'بحث',
    save:'حفظ',cancel:'إلغاء',add:'إضافة',
    today:'اليوم',overdue:'متأخر',
    noTask:'لا توجد مهام اليوم.',
    pro:'احترافي',home:'الرئيسية',student:'طالب',
    greeting_morning:'صباح الخير،',greeting_afternoon:'مساء الخير،',
    greeting_evening:'مساء الخير،',greeting_night:'تصبح على خير،',
  },
};
let curLang='tr';

function setLang(lang){
  curLang=lang;
  localStorage.setItem('capsula_lang',lang);
  document.querySelectorAll('.lang-btn').forEach(b=>b.classList.toggle('active',b.id==='langBtn-'+lang));
  const L=LANGS[lang]||LANGS.tr;
  // RTL desteği
  document.body.dir=lang==='ar'?'rtl':'ltr';
  // Drawer
  const ids={
    'dl-general':L.general,'dl-profile':L.profile,'dl-settings':L.settings,
    'dl-calendar':L.calendar,'dl-trash':L.trash,'dl-backup':L.backup,
    'dl-friends':L.friends,'dl-reminders':L.reminders,'dl-about':L.about,
    'dl-privacy':L.privacy,'dl-terms':L.terms,'dl-help':L.help,
    'dl-cleardata':L.cleardata,'dl-signout':L.signout,
  };
  Object.entries(ids).forEach(([id,txt])=>{const el=document.getElementById(id);if(el)el.textContent=txt;});
  // Todo input
  const ti=document.getElementById('todoInput');if(ti)ti.placeholder=L.addTodo;
  // Arama
  const si=document.getElementById('searchInput');if(si)si.placeholder=lang==='tr'?'Not, günlük veya görev ara...':lang==='en'?'Search notes, journal or tasks...':lang==='de'?'Notizen, Tagebuch oder Aufgaben suchen...':lang==='fr'?'Rechercher notes, journal ou tâches...':lang==='es'?'Buscar notas, diario o tareas...':'ابحث في الملاحظات أو المهام...';
  // Dashboard yenile
  renderDashboard();
}

function initLang(){
  const saved=localStorage.getItem('capsula_lang')||'tr';
  setLang(saved);
}

let calView='month';

function setCalView(v){
  calView=v;
  document.getElementById('calViewMonthBtn').classList.toggle('active',v==='month');
  document.getElementById('calViewWeekBtn').classList.toggle('active',v==='week');
  document.getElementById('calMonthView').style.display=v==='month'?'':'none';
  document.getElementById('calWeekView').style.display=v==='week'?'':'none';
  renderCalendar();
}

function renderWeekView(){
  const today=new Date();
  const cur=new Date(calYear,calMonth,selCalDay||today.getDate());
  const dow=cur.getDay();
  const diff=dow===0?-6:1-dow;
  const weekStart=new Date(cur);weekStart.setDate(cur.getDate()+diff);
  const dayNames=['Pt','Sa','Ça','Pe','Cu','Ct','Pz'];
  let stripHtml='';
  for(let i=0;i<7;i++){
    const d=new Date(weekStart);d.setDate(weekStart.getDate()+i);
    const isToday=d.toDateString()===today.toDateString();
    const isSel=d.getDate()===selCalDay&&d.getMonth()===calMonth&&d.getFullYear()===calYear;
    const dk=calDayKey(d.getFullYear(),d.getMonth(),d.getDate());
    const hasTodo=D.todos.some(t=>t.dueDate===dk);
    const hasDiary=D.diary.some(e=>{const ed=new Date(e.createdAt);return ed.toDateString()===d.toDateString();});
    let dots='';
    if(hasTodo)dots+=`<div class="cal-week-dot" style="background:var(--note)"></div>`;
    if(hasDiary)dots+=`<div class="cal-week-dot" style="background:var(--diary)"></div>`;
    stripHtml+=`<div class="cal-week-day${isToday?' today':''}${isSel?' selected':''}" onclick="selWeekDay(${d.getFullYear()},${d.getMonth()},${d.getDate()})"><div class="cal-week-day-name">${dayNames[i]}</div><div class="cal-week-day-num">${d.getDate()}</div><div class="cal-week-dot-row">${dots}</div></div>`;
  }
  document.getElementById('calWeekStrip').innerHTML=stripHtml;
  renderWeekAgenda(calYear,calMonth,selCalDay||today.getDate());
}

function selWeekDay(y,m,d){calYear=y;calMonth=m;selCalDay=d;renderWeekView();renderCalDayPanel();}

function renderWeekAgenda(y,m,d){
  const dk=calDayKey(y,m,d);
  const todosForDay=D.todos.filter(t=>t.dueDate===dk);
  const diaryForDay=D.diary.filter(e=>{const ed=new Date(e.createdAt);return ed.getFullYear()===y&&ed.getMonth()===m&&ed.getDate()===d;});
  const plan=D.calPlans&&D.calPlans[dk];
  const wdays=['Pazar','Pazartesi','Salı','Çarşamba','Perşembe','Cuma','Cumartesi'];
  const months2=['Ocak','Şubat','Mart','Nisan','Mayıs','Haziran','Temmuz','Ağustos','Eylül','Ekim','Kasım','Aralık'];
  const clr={easy:'var(--easy)',mid:'var(--mid)',hard:'var(--hard)'};
  let html=`<div style="font-size:.7rem;font-weight:500;color:var(--text);margin-bottom:10px;">${wdays[new Date(y,m,d).getDay()]}, ${d} ${months2[m]}</div>`;
  if(plan)html+=`<div class="cal-agenda-item" onclick="openCalDayModal(${y},${m},${d})"><div class="cal-agenda-dot" style="background:var(--accent)"></div><div><div class="cal-agenda-title">${escHtml(plan)}</div><div class="cal-agenda-meta">PLAN</div></div></div>`;
  todosForDay.forEach(t=>html+=`<div class="cal-agenda-item"><div class="cal-agenda-dot" style="background:${clr[t.priority]}"></div><div><div class="cal-agenda-title">${escHtml(t.text)}</div><div class="cal-agenda-meta">GÖREV</div></div></div>`);
  diaryForDay.forEach(e=>html+=`<div class="cal-agenda-item" onclick="viewEntry('diary',${e.id})"><div class="cal-agenda-dot" style="background:var(--diary)"></div><div><div class="cal-agenda-title">${escHtml(e.title)} ${e.mood||''}</div><div class="cal-agenda-meta">GÜNLÜK · ${fmtTime(e.createdAt)}</div></div></div>`);
  if(!plan&&!todosForDay.length&&!diaryForDay.length)html+=`<div style="color:var(--text3);font-size:.72rem;font-style:italic;padding:12px 0;text-align:center;">Bu gün için içerik yok.<br><span style="cursor:pointer;color:var(--accent2);text-decoration:underline;text-underline-offset:3px;" onclick="openCalDayModal(${y},${m},${d})">Ekle →</span></div>`;
  html+=`<div style="margin-top:10px;"><button onclick="openCalDayModal(${y},${m},${d})" style="width:100%;padding:9px;background:rgba(124,111,247,.08);border:1px dashed rgba(124,111,247,.25);border-radius:10px;color:var(--accent2);font-size:.72rem;font-family:Sora,sans-serif;cursor:pointer;transition:all .2s;" onmouseover="this.style.background='rgba(124,111,247,.14)'" onmouseout="this.style.background='rgba(124,111,247,.08)'">+ Bu güne ekle</button></div>`;
  document.getElementById('calWeekAgenda').innerHTML=html;
}

// ─────────────────────────── YEDEKLEME ────────────────────────────────────
function openBackupModal(){
  if(document.getElementById('drawer').classList.contains('open'))toggleDrawer();
  const stats=document.getElementById('backupStats');
  stats.innerHTML=`<div class="backup-stat"><div class="backup-stat-num">${D.todos.length+D.completedTodos.length}</div><div class="backup-stat-lbl">Görev</div></div><div class="backup-stat"><div class="backup-stat-num">${D.notes.length}</div><div class="backup-stat-lbl">Not</div></div><div class="backup-stat"><div class="backup-stat-num">${D.diary.length}</div><div class="backup-stat-lbl">Günlük</div></div>`;
  updateLastBackupUI();
  document.getElementById('backupImportResult').textContent='';
  openModal('backupModal');
}

function updateLastBackupUI(){
  const t=localStorage.getItem('capsula_last_backup');
  const el=document.getElementById('lastBackupTime');
  if(el)el.textContent=t?new Date(t).toLocaleString('tr-TR',{day:'numeric',month:'short',year:'numeric',hour:'2-digit',minute:'2-digit'}):'Henüz yedek alınmadı';
}

function exportBackup(format){
  if(format==='json'){
    const d=JSON.parse(JSON.stringify(D));delete d.profile.avatar;
    const meta={exportedAt:new Date().toISOString(),version:'capsula-v4',counts:{todos:D.todos.length,notes:D.notes.length,diary:D.diary.length,reading:D.reading.length}};
    const blob=new Blob([JSON.stringify({meta,...d},null,2)],{type:'application/json'});
    const a=document.createElement('a');const _u2=URL.createObjectURL(blob);a.href=_u2;a.download=`capsula_yedek_${new Date().toISOString().split('T')[0]}.json`;a.click();URL.revokeObjectURL(_u2);
  } else {
    let txt=`CAPSULA YEDEĞİ — ${new Date().toLocaleDateString('tr-TR',{weekday:'long',year:'numeric',month:'long',day:'numeric'})}
${'='.repeat(60)}

`;
    if(D.notes.length){txt+=`NOTLAR (${D.notes.length})
${'-'.repeat(40)}
`;D.notes.forEach(n=>{txt+=`
\ud83d\udcdd ${n.title}
Etiket: ${(n.tags||[]).join(', ')||'—'}
Tarih: ${fmtDate(n.createdAt)}

${n.content||''}

${'·'.repeat(30)}
`;});}
    if(D.diary.length){txt+=`
GÜNLÜK GİRİŞLERİ (${D.diary.length})
${'-'.repeat(40)}
`;D.diary.forEach(e=>{txt+=`
${e.mood||'\ud83d\udcd6'} ${e.title}
Tarih: ${fmtDate(e.createdAt)}

${e.content||''}

${'·'.repeat(30)}
`;});}
    if(D.todos.length){txt+=`
AKTİF GÖREVLER (${D.todos.length})
${'-'.repeat(40)}
`;D.todos.forEach(t=>txt+=`• [${t.priority.toUpperCase()}] ${t.text}${t.dueDate?' ('+t.dueDate+')':''}
`);}
    const blob=new Blob([txt],{type:'text/plain;charset=utf-8'});
    const a=document.createElement('a');const _u3=URL.createObjectURL(blob);a.href=_u3;a.download=`capsula_notlar_${new Date().toISOString().split('T')[0]}.txt`;a.click();URL.revokeObjectURL(_u3);
  }
  localStorage.setItem('capsula_last_backup',new Date().toISOString());
  updateLastBackupUI();showToast('Dışa aktarıldı \ud83d\udcc1');
}

function importBackup(input){
  const file=input.files[0];if(!file)return;
  const res=document.getElementById('backupImportResult');
  res.style.color='var(--text3)';res.textContent='Okunuyor...';
  const reader=new FileReader();
  reader.onload=e=>{
    try{
      const parsed=JSON.parse(e.target.result);
      const {meta,...data}=parsed;
      if(!['todos','notes','diary'].every(k=>Array.isArray(data[k])))throw new Error('format');
      const tarih=meta?.exportedAt?new Date(meta.exportedAt).toLocaleString('tr-TR'):'Bilinmiyor';
      showConfirm(`Yedek geri yüklenecek — mevcut veriler silinecek.

Yedek tarihi: ${tarih}

Emin misin?`,()=>{
        const profile=D.profile;Object.assign(D,data);
        D.profile=profile; // import edilen JSON'da ne olursa olsun mevcut profil korunur
        if(!D.calPlans)D.calPlans={};if(!D.kanban)D.kanban={todo:[],doing:[],done:[]};
        if(!D.reading)D.reading=[];if(!D.completedTodos)D.completedTodos=[];
        if(!D.trash)D.trash=[];if(!D.contentTrash)D.contentTrash=[];
        saveData();renderTodos();renderNotes();renderDiary();renderDashboard();renderCalendar();renderKanban();renderReading();updTrashBadge();updateReminderBadge();
        res.style.color='var(--easy)';res.textContent=`✓ Geri yüklendi — ${D.notes.length} not, ${D.diary.length} günlük, ${D.todos.length} görev`;
        showToast('Yedek geri yüklendi ✓');
      });
    }catch(err){res.style.color='var(--hard)';res.textContent='Hata: Geçersiz yedek dosyası';}
  };
  reader.readAsText(file);input.value='';
}

function exportData(){exportBackup('json');}

// ─────────────────────────── BİLDİRİM & HATIRLATICI ───────────────────────
let reminderCheckInterval=null;

function initReminders(){
  updateReminderBadge();
  if('Notification' in window && Notification.permission==='granted')startReminderInterval();
}

function startReminderInterval(){
  if(reminderCheckInterval)clearInterval(reminderCheckInterval);
  reminderCheckInterval=setInterval(checkAndFireNotifications,60*1000);
  checkAndFireNotifications();
}

function getReminders(){
  const today=new Date();today.setHours(0,0,0,0);
  const results=[];
  D.todos.forEach(t=>{
    if(!t.dueDate)return;
    const due=new Date(t.dueDate);due.setHours(0,0,0,0);
    const diff=Math.round((due-today)/(1000*60*60*24));
    let type=null;
    if(diff<0)type='overdue';else if(diff===0)type='today';else if(diff<=3)type='soon';
    if(type)results.push({todo:t,diff,type});
  });
  return results.sort((a,b)=>a.diff-b.diff);
}

function updateReminderBadge(){
  const reminders=getReminders();
  const urgent=reminders.filter(r=>r.type==='overdue'||r.type==='today');
  const drawerBadge=document.getElementById('drawerReminderBadge');
  if(urgent.length>0){
    if(drawerBadge){drawerBadge.style.display='flex';drawerBadge.textContent=urgent.length>9?'9+':urgent.length;}
  } else {
    if(drawerBadge)drawerBadge.style.display='none';
  }
}

function checkAndFireNotifications(){
  if(!('Notification' in window)||Notification.permission!=='granted')return;
  const now=new Date();if(now.getHours()!==9)return;
  const todayKey=now.toISOString().split('T')[0];
  if(localStorage.getItem('capsula_notif_fired')===todayKey)return;
  const todayTodos=D.todos.filter(t=>t.dueDate===todayKey);
  const overdue=D.todos.filter(t=>{if(!t.dueDate)return false;const d=new Date(t.dueDate);d.setHours(0,0,0,0);return d<new Date().setHours(0,0,0,0);});
  if(todayTodos.length||overdue.length){
    let body='';
    if(todayTodos.length)body+=`Bugün: ${todayTodos.length} görev. `;
    if(overdue.length)body+=`Gecikmiş: ${overdue.length} görev.`;
    try{new Notification('Capsula \ud83d\udccb',{body:body.trim()});}catch(e){}
    localStorage.setItem('capsula_notif_fired',todayKey);
  }
}

function openReminderModal(){
  if(document.getElementById('drawer').classList.contains('open'))toggleDrawer();
  const reminders=getReminders();
  const labels={overdue:'Gecikmiş',today:'Bugün',soon:'Yakında'};
  let html='';
  if(!reminders.length){
    html=`<div style="text-align:center;padding:20px 0;color:var(--text3);font-size:.76rem;">\ud83c\udf89 Gecikmiş ya da yaklaşan görev yok.</div>`;
  } else {
    reminders.forEach(r=>{
      const dueStr=r.type==='overdue'?`${Math.abs(r.diff)} gün gecikmeli`:r.type==='today'?'Bugün bitiyor':`${r.diff} gün kaldı`;
      html+=`<div class="reminder-item ${r.type}"><div><div class="reminder-badge ${r.type}">${labels[r.type]}</div></div><div style="flex:1;min-width:0;"><div class="reminder-text">${escHtml(r.todo.text)}</div><div class="reminder-date">${dueStr} · ${r.todo.dueDate}</div></div></div>`;
    });
  }
  document.getElementById('reminderList').innerHTML=html;
  const statusEl=document.getElementById('notifStatusText');
  if(!('Notification' in window))statusEl.textContent='Bu tarayıcı bildirimleri desteklemiyor';
  else if(Notification.permission==='granted')statusEl.textContent="✓ Bildirimler aktif — her gün saat 9'da uyarı alırsın";
  else if(Notification.permission==='denied')statusEl.textContent='⚠ Bildirimler engellendi (tarayıcı ayarından aç)';
  else statusEl.textContent='Bildirim izni verilmedi';
  openModal('reminderModal');
}

function requestAndSetupNotif(){
  if(!('Notification' in window)){showToast('Tarayıcı desteklemiyor');return;}
  Notification.requestPermission().then(p=>{
    if(p==='granted'){showToast('Bildirimler aktif ✓');startReminderInterval();document.getElementById('notifStatusText').textContent="✓ Bildirimler aktif — her gün saat 9'da uyarı alırsın";}
    else showToast('İzin reddedildi');
  });
}
function requestNotif(){requestAndSetupNotif();}

// ─────────────────────────── UTILS ────────────────────────────────────────
function escHtml(s){if(!s)return'';return s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');}


function fmtDate(iso){try{return new Date(iso).toLocaleDateString('tr-TR',{day:'numeric',month:'short',year:'numeric'});}catch{return iso||'';}}
function fmtDateFull(iso){try{return new Date(iso).toLocaleDateString('tr-TR',{weekday:'long',day:'numeric',month:'long',year:'numeric'});}catch{return iso||'';}}
function fmtTime(iso){try{return new Date(iso).toLocaleTimeString('tr-TR',{hour:'2-digit',minute:'2-digit'});}catch{return '';}}
function showToast(msg){const t=document.getElementById('toast');t.textContent=msg;t.classList.add('show');setTimeout(()=>t.classList.remove('show'),2600);}
function clearAllData(){showConfirm('Tüm veriler silinecek. Emin misin?',()=>{D={todos:[],completedTodos:[],trash:[],contentTrash:[],calPlans:{},notes:[],diary:[],kanban:{todo:[],doing:[],done:[]},reading:[],schedule:[],exams:[],notebook:[],profile:D.profile};saveData();toggleDrawer();renderTodos();renderNotes();renderDiary();renderDashboard();updTrashBadge();renderSchedule();renderExams();renderNotebook();showToast('Veriler silindi');});}

// ─────────────────────────── INIT ─────────────────────────────────────────
// ─────────────────────────── ACCORDION (SETTINGS) ─────────────────────────
function toggleAcc(id){
  const body=document.getElementById(id);
  if(!body)return;
  const isOpen=body.style.display!=='none';
  body.style.display=isOpen?'none':'block';
  const header=body.previousElementSibling;
  const arrow=header?.querySelector('.acc-arrow');
  if(arrow)arrow.classList.toggle('open',!isOpen);
}

// ─────────────────────────── KANBAN / OKUMA TOGGLELAR ─────────────────────
function toggleKanbanAutoDelete(){
  const tog=document.getElementById('kanbanAutoDelete');
  const cur=localStorage.getItem('capsula_kanban_autodelete')!=='off';
  localStorage.setItem('capsula_kanban_autodelete',cur?'off':'on');
  tog?.classList.toggle('on',!cur);
  showToast(cur?'Otomatik silme kapatıldı':'Otomatik silme açıldı');
}
function toggleReadingAutoArchive(){
  const tog=document.getElementById('readingAutoArchive');
  const cur=localStorage.getItem('capsula_reading_autoarchive')!=='off';
  localStorage.setItem('capsula_reading_autoarchive',cur?'off':'on');
  tog?.classList.toggle('on',!cur);
  showToast(cur?'Otomatik arşiv kapatıldı':'Otomatik arşiv açıldı');
}
function initSettingsToggles(){
  const kd=document.getElementById('kanbanAutoDelete');
  const ra=document.getElementById('readingAutoArchive');
  const sw=document.getElementById('schedWeeklyToggle');
  if(kd)kd.classList.toggle('on',localStorage.getItem('capsula_kanban_autodelete')!=='off');
  if(ra)ra.classList.toggle('on',localStorage.getItem('capsula_reading_autoarchive')!=='off');
  if(sw)sw.classList.toggle('on',localStorage.getItem('capsula_sched_weekly')==='on');
  const ps=document.getElementById('ps-'+pomoStyle);
  if(ps)ps.classList.add('active');
}

// ─────────────────────────── HIZLI NOT MEDIA ──────────────────────────────
let quickNoteMediaData=[];
let quickNotePrio='easy';
function selectQuickPrio(p){
  quickNotePrio=p;
  document.querySelectorAll('#quickNotePriority .pp').forEach(el=>{
    el.classList.toggle('sel',el.dataset.p===p);
  });
}
function quickNoteMedia(e,type){
  const file=e.target.files[0];if(!file)return;
  if(file.size>10*1024*1024){showToast('Max 10MB');return;}
  const reader=new FileReader();
  reader.onload=ev=>{
    quickNoteMediaData.push({type,data:ev.target.result,name:file.name});
    const prev=document.getElementById('quickNoteMediaPreview');
    if(prev){
      const tag=type==='image'?`<img src="${ev.target.result}" style="max-height:80px;border-radius:8px;margin-right:6px;">`
        :type==='video'?`<video src="${ev.target.result}" style="max-height:80px;border-radius:8px;" controls></video>`
        :`<div style="background:var(--bg3);border-radius:8px;padding:6px 10px;font-size:.7rem;color:var(--text2);">\ud83c\udfb5 ${file.name}</div>`;
      prev.innerHTML=(prev.innerHTML||'')+tag;
    }
  };
  reader.readAsDataURL(file);
}

// saveQuickNote'u güncelle
const _origSaveQN=window.saveQuickNote;
window.saveQuickNote=function(){
  const inp=document.getElementById('quickNoteInput');
  const text=inp?.value.trim();
  if(!text&&!quickNoteMediaData.length)return;
  const note={
    id:Date.now(),
    title:(text||'').slice(0,40)+(text.length>40?'...':''),
    content:text,
    media:[...quickNoteMediaData],
    tags:['hızlı'],
    priority:quickNotePrio,
    pinned:true,
    createdAt:new Date().toISOString()
  };
  D.notes.unshift(note);
  saveData();renderNotes();
  if(inp)inp.value='';
  quickNoteMediaData=[];
  const prev=document.getElementById('quickNoteMediaPreview');
  if(prev)prev.innerHTML='';
  showToast('Not eklendi ✓');
};

// ─────────────────────────── BİLDİRİMLER SİSTEMİ ─────────────────────────
function getNotifications(){
  return JSON.parse(localStorage.getItem('capsula_notifs')||'[]');
}
function addNotification(text,type='info'){
  const notifs=getNotifications();
  notifs.unshift({id:Date.now(),text,type,time:new Date().toISOString(),read:false});
  if(notifs.length>50)notifs.pop();
  localStorage.setItem('capsula_notifs',JSON.stringify(notifs));
  updateNotifBadge();
}
function updateNotifBadge(){
  const notifs=getNotifications();
  const unread=notifs.filter(n=>!n.read).length;
  const badge=document.getElementById('notifHeaderBadge');
  const drawerBadge=document.getElementById('drawerReminderBadge');
  if(badge)badge.style.display=unread>0?'block':'none';
  if(drawerBadge){
    if(unread>0){drawerBadge.style.display='flex';drawerBadge.textContent=unread>9?'9+':unread;}
    else drawerBadge.style.display='none';
  }
}
function openNotifications(){
  const notifs=getNotifications();
  notifs.forEach(n=>n.read=true);
  localStorage.setItem('capsula_notifs',JSON.stringify(notifs));
  updateNotifBadge();
  const list=document.getElementById('notifList');
  if(!notifs.length){
    list.innerHTML='<div style="text-align:center;padding:30px;color:var(--text3);font-size:.74rem;">Henüz bildirim yok</div>';
  } else {
    list.innerHTML=notifs.map((n,idx)=>`
      <div class="notif-item" style="position:relative;">
        <div class="notif-dot${n.read?'':' unread'}"></div>
        <div class="notif-text" style="flex:1;padding-right:28px;">${escHtml(n.text)}</div>
        <div style="display:flex;flex-direction:column;align-items:flex-end;gap:4px;">
          <div class="notif-time">${new Date(n.time).toLocaleDateString('tr-TR',{day:'numeric',month:'short',hour:'2-digit',minute:'2-digit'})}</div>
          <button onclick="deleteNotif(${n.id})" style="background:none;border:none;cursor:pointer;color:var(--text3);padding:2px 4px;border-radius:4px;font-size:.7rem;transition:color .15s;" onmouseover="this.style.color='var(--hard)'" onmouseout="this.style.color='var(--text3)'" title="Sil">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width:13px;height:13px;"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/></svg>
          </button>
        </div>
      </div>`).join('');
  }
  openModal('notificationsModal');
}
function deleteNotif(id){
  const notifs=getNotifications().filter(n=>n.id!==id);
  localStorage.setItem('capsula_notifs',JSON.stringify(notifs));
  updateNotifBadge();
  openNotifications(); // yenile
}
function clearAllNotifs(){
  localStorage.setItem('capsula_notifs','[]');
  updateNotifBadge();
  closeModal('notificationsModal');
  showToast('Bildirimler temizlendi');
}
function checkSmartNotifications(){
  const now=new Date();
  // Okuma listesi - hedef tarih yaklaşıyor mu?
  D.reading.filter(r=>r.status==='reading'&&r.goalDate).forEach(r=>{
    const goal=new Date(r.goalDate);
    const diff=Math.ceil((goal-now)/(1000*60*60*24));
    const key=`notif_reading_${r.id}_${r.goalDate}`;
    if(diff===3&&!localStorage.getItem(key)){
      addNotification(`\ud83d\udcda "${r.title}" için 3 gün kaldı! Okumayı hızlandırma vakti.`,'reading');
      localStorage.setItem(key,'1');
    } else if(diff===7&&!localStorage.getItem(key+'_7')){
      addNotification(`\ud83d\udcd6 "${r.title}" — hedefe 1 hafta kaldı.`,'reading');
      localStorage.setItem(key+'_7','1');
    }
  });
  // Haftalık özet - Pazar günü
  if(now.getDay()===0){
    const weekKey=`notif_weekly_${now.toISOString().split('T')[0]}`;
    if(!localStorage.getItem(weekKey)){
      const done=D.completedTodos.filter(t=>{
        const d=new Date(t.completedAt||0);
        return now-d<7*24*60*60*1000;
      }).length;
      const books=D.reading.filter(r=>r.status==='done'&&r.completedAt&&(now-new Date(r.completedAt))<7*24*60*60*1000).length;
      if(done>0||books>0){
        addNotification(`\ud83c\udf89 Bu hafta ${done} görev tamamladın${books>0?` ve ${books} kitap bitirdin`:''} — harika gidiyor!`,'weekly');
        localStorage.setItem(weekKey,'1');
      }
      // Ders programı hatırlatması - Pazar
      const schedWeekly=localStorage.getItem('capsula_sched_weekly')==='on';
      const nextWk=getCurrentWeekKeyFor(new Date(now.getTime()+7*24*60*60*1000));
      const schedKey=`notif_sched_${nextWk}`;
      if(schedWeekly&&!localStorage.getItem(schedKey)){
        if(!D.scheduleWeeks||!D.scheduleWeeks[nextWk]||!D.scheduleWeeks[nextWk].length){
          addNotification(`\ud83d\udcc5 Yeni hafta başlıyor (Hafta ${nextWk.split('-W')[1]})! Ders programını girmeyi unutma.`,'schedule');
          localStorage.setItem(schedKey,'1');
        }
      }
    }
  }
}

// ─────────────────────────── GÜNLÜK AI ÖNERİSİ ───────────────────────────
const DIARY_PROMPTS=[
  {emoji:'✍️',text:'Bugün seni en çok ne şaşırttı? Beklenmedik bir an, küçük bir detay bile olsa yaz.'},
  {emoji:'\ud83c\udf0a',text:'Bugün duygularınla nasıl bir akış yaşadın? Sabahtan akşama nasıl değişti?'},
  {emoji:'\ud83d\udca1',text:'Bugün aklına gelen en ilginç fikir neydi? Çılgın da olsa yaz!'},
  {emoji:'\ud83e\udd1d',text:'Bugün biriyle yaşadığın anı anlat. Seni nasıl hissettirdi?'},
  {emoji:'\ud83c\udfaf',text:'Bugün tamamladığın küçük bir şeyi kutla. Neydi ve nasıl hissettirdi?'},
  {emoji:'\ud83c\udf31',text:'Bugün neyi öğrendin? Bir bilgi, bir his, bir farkındalık...'},
  {emoji:'\ud83d\udd04',text:'Bugünü yeniden yaşasaydın ne farklı yapardın? Neden?'},
  {emoji:'\ud83c\udf05',text:'Bu anı, 10 yıl sonra nasıl hatırlamak istersin? Yaz, gelecekteki kendin okusun.'},
  {emoji:'\ud83d\udcad',text:'Şu an aklındaki en büyük soru nedir? Cevabını bilmesen de sorunu yaz.'},
  {emoji:'\ud83c\udf81',text:'Bugün sana "hediye" edilmiş gibi gelen bir an var mıydı? Küçük de olsa...'},
  {emoji:'\ud83e\udde0',text:'Bugün beyninin sana söylediği ile kalbinin söylediği çakıştı mı? Yoksa çelişti mi?'},
  {emoji:'\ud83c\udf0d',text:'Dünya bu gün sana nasıldı? Hava, insanlar, haberler — içinde nasıl bir yer kapladı?'},
];
function getDiaryPrompt(){
  const day=new Date().getDate()+new Date().getMonth()*31;
  return DIARY_PROMPTS[day%DIARY_PROMPTS.length];
}
function renderDiaryAIPrompt(){
  const p=getDiaryPrompt();
  const existing=document.getElementById('diaryAIPromptBox');
  if(existing)existing.remove();
  const page=document.getElementById('page-diary');
  if(!page)return;
  const box=document.createElement('div');
  box.id='diaryAIPromptBox';
  box.className='diary-ai-prompt';
  box.innerHTML=`<div class="diary-ai-prompt-label">✦ Bugünün İlham Sorusu</div>
    <div class="diary-ai-prompt-text">${p.emoji} ${escHtml(p.text)}</div>`;
  page.insertBefore(box,page.firstChild);
}

window.addEventListener('load',async ()=>{
  // Önce şifreli veriyi yükle
  const loaded=await loadDataEncrypted();
  if(loaded){
    D=loaded;
    if(!D.calPlans)D.calPlans={};
    if(!D.kanban)D.kanban={todo:[],doing:[],done:[]};
    if(!D.reading)D.reading=[];
    if(!D.schedule)D.schedule=[];
    if(!D.scheduleWeeks)D.scheduleWeeks={};
    if(!D.exams)D.exams=[];
    if(!D.notebook)D.notebook=[];
    if(!D.contentTrash)D.contentTrash=[];
    if(!D.trash)D.trash=[];
  }
  initTheme();
  // Auth state değişince initApp çağrılıyor, burada sadece splash ve seed data
  const isFirstVisit=!localStorage.getItem('capsula_toured')&&!localStorage.getItem('capsula_visited');
  localStorage.setItem('capsula_visited','1');

  // Auth state onAuthStateChanged hallediyor

  // Seed demo data
  if(!D.todos.length&&!D.notes.length&&!D.diary.length){
    const tmr=new Date();tmr.setDate(tmr.getDate()+1);
    D.todos=[
      {id:1,text:"Capsula'ya hoş geldin! Bu görevi tamamla ✓",priority:'easy',dueDate:null,createdAt:new Date().toISOString()},
      {id:2,text:"Profil fotoğrafını veya avatarını ayarla",priority:'easy',dueDate:null,createdAt:new Date().toISOString()},
      {id:3,text:"Bir görev ekle ve takvimde gün üzerine sürükle",priority:'mid',dueDate:tmr.toISOString().split('T')[0],createdAt:new Date().toISOString()},
    ];
    D.notes=[{id:101,title:'Capsula Rehberi',content:'Hoş geldin! 🎉\n\nNotlar, görevler, pomodoro, takvim ve daha fazlası burada.\n\nSol üstteki ≡ menüden tüm özelliklere ulaşabilirsin.',media:[],tags:['rehber'],createdAt:new Date().toISOString()}];
    D.diary=[{id:201,title:'İlk gün',content:'Capsula yolculuğum başlıyor. Bugün neler öğrenecek, neler yapacağım?',mood:'\ud83d\udcab',media:[],tags:[],createdAt:new Date().toISOString()}];
    saveData();
  }


  runSplash(()=>{
    initApp();
  });
});



// ── SERVICE WORKER KAYDI ─────────────────────────────────────────────────────
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/app/service-worker.js')
      .catch(err => console.warn('SW kayıt hatası:', err));
  });
}

// ═══════════════════════════════════════════════════════════
// PROFILE PAGE — Instagram style
// ═══════════════════════════════════════════════════════════
function openProfilePage(){
  var p=D.profile;
  var initials=p.name.split(' ').map(function(w){return w[0]||'';}).join('').slice(0,2).toUpperCase()||'KY';
  var igImg=document.getElementById('igAvatarImg');
  var igInit=document.getElementById('igAvatarInitials');
  var igAvEl=document.getElementById('igAvatar');
  if(p.avatarId&&!p.avatar){
    var av=SYSTEM_AVATARS.find(function(a){return a.id===p.avatarId;});
    if(av){if(igInit)igInit.textContent=av.emoji;if(igAvEl)igAvEl.style.background=av.bg;if(igImg)igImg.style.display='none';}
  } else if(p.avatar){
    if(igImg){igImg.src=p.avatar;igImg.style.display='block';}
    if(igInit)igInit.style.display='none';
  } else {
    if(igImg)igImg.style.display='none';
    if(igInit){igInit.style.display='';igInit.textContent=initials;}
    if(igAvEl)igAvEl.style.background='';
  }
  document.getElementById('igStatTodos').textContent=D.completedTodos.length;
  document.getElementById('igStatNotes').textContent=D.notes.length+D.diary.length;
  document.getElementById('igStatStreak').textContent=calcStreak()+'🔥';
  document.getElementById('igName').textContent=p.name||'';
  document.getElementById('igUsername').textContent=p.username?('@'+p.username):'';
  var badge=BADGES.find(function(b){return b.id===(p.badge||'student');});
  document.getElementById('igBadge').textContent=badge?(badge.ico+' '+badge.lbl):'';
  document.getElementById('igBio').textContent=p.bio||'';
  var mottoEl=document.getElementById('igMotto');
  if(mottoEl){if(p.motto){mottoEl.textContent='"'+p.motto+'"';mottoEl.style.display='block';}else{mottoEl.style.display='none';}}
  var titleEl=document.getElementById('profilePageTitle');
  if(titleEl)titleEl.textContent=p.username?('@'+p.username):(p.name||'Profil');
  switchIgTab(0);
  document.getElementById('profilePage').classList.add('open');
}
function closeProfilePage(){document.getElementById('profilePage').classList.remove('open');}

function switchIgTab(idx){
  [0,1,2].forEach(function(i){
    var btn=document.getElementById('igTab'+i);
    if(btn){btn.style.color=(i===idx)?'var(--accent2)':'var(--text3)';btn.style.borderBottomColor=(i===idx)?'var(--accent)':'transparent';}
  });
  var cont=document.getElementById('igTabContent');
  if(!cont)return;
  if(idx===0){
    if(!D.notes.length){cont.innerHTML='<div class="empty-state">Henüz not yok</div>';return;}
    var html='<div style="display:grid;grid-template-columns:repeat(3,1fr);gap:2px;">';
    D.notes.slice(0,18).forEach(function(n){
      html+='<div data-nid="'+n.id+'" class="ig-note-thumb" style="aspect-ratio:1;background:var(--bg2);border:1px solid var(--border);border-radius:4px;padding:8px;cursor:pointer;display:flex;flex-direction:column;justify-content:space-between;overflow:hidden;">'
        +'<div style="font-size:.62rem;font-weight:500;color:var(--text);overflow:hidden;display:-webkit-box;-webkit-line-clamp:3;-webkit-box-orient:vertical;">'+escHtml(n.title||'Başlıksız')+'</div>'
        +'<div style="font-size:.48rem;color:var(--text3);">'+fmtDate(n.createdAt)+'</div></div>';
    });
    html+='</div>';
    cont.innerHTML=html;
    cont.querySelectorAll('.ig-note-thumb').forEach(function(el){
      el.addEventListener('click',function(){var nid=parseInt(el.dataset.nid);closeProfilePage();setTimeout(function(){viewEntry('note',nid);},300);});
    });
  } else if(idx===1){
    if(!D.diary.length){cont.innerHTML='<div class="empty-state">Günlük yok</div>';return;}
    var html2='';
    D.diary.slice(0,10).forEach(function(e){
      html2+='<div data-eid="'+e.id+'" class="ig-diary-item" style="display:flex;align-items:center;gap:10px;padding:10px;background:var(--bg2);border-radius:10px;margin-bottom:8px;cursor:pointer;border:1px solid var(--border);">'
        +'<span style="font-size:1.2rem;">'+(e.mood||'📖')+'</span>'
        +'<div style="flex:1;min-width:0;"><div style="font-size:.8rem;font-weight:400;color:var(--text);white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">'+escHtml(e.title||'Günlük Girişi')+'</div>'
        +'<div style="font-size:.58rem;color:var(--text3);margin-top:2px;">'+fmtDate(e.createdAt)+'</div></div></div>';
    });
    cont.innerHTML=html2;
    cont.querySelectorAll('.ig-diary-item').forEach(function(el){
      el.addEventListener('click',function(){var eid=parseInt(el.dataset.eid);closeProfilePage();setTimeout(function(){viewEntry('diary',eid);},300);});
    });
  } else {
    var streak=calcStreak(),booksRead=D.reading.filter(function(r){return r.status==='done';}).length,todoDone=D.completedTodos.length;
    var ach=[
      {icon:'🔥',title:'Seri Ustası',desc:streak+' gün',unlocked:streak>=3},
      {icon:'📚',title:'Kitap Kurdu',desc:booksRead+' kitap',unlocked:booksRead>=1},
      {icon:'✅',title:'Üretken',desc:todoDone+' görev',unlocked:todoDone>=10},
      {icon:'✍️',title:'Günlükçü',desc:D.diary.length+' giriş',unlocked:D.diary.length>=5},
      {icon:'📝',title:'Not Ustası',desc:D.notes.length+' not',unlocked:D.notes.length>=10},
      {icon:'🍅',title:'Odak Şamp.',desc:'Pomodoro',unlocked:parseInt(localStorage.getItem('capsula_pomo_total')||'0')>=5},
    ];
    var html3='<div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;">';
    ach.forEach(function(a){html3+='<div style="background:var(--bg2);border:1px solid '+(a.unlocked?'rgba(124,111,247,.3)':'var(--border)')+';border-radius:12px;padding:14px;text-align:center;opacity:'+(a.unlocked?'1':'.4')+';">'+'<div style="font-size:1.8rem;margin-bottom:6px;">'+a.icon+'</div>'+'<div style="font-size:.76rem;font-weight:500;">'+a.title+'</div>'+'<div style="font-size:.62rem;color:var(--text3);margin-top:2px;">'+a.desc+'</div>'+'</div>';});
    cont.innerHTML=html3+'</div>';
  }
}

function openProfileEditSheet(){
  var p=D.profile;
  var initials=p.name.split(' ').map(function(w){return w[0]||'';}).join('').slice(0,2).toUpperCase()||'KY';
  var esImg=document.getElementById('editSheetAvatarImg'),esInit=document.getElementById('editSheetInitials'),esAv=document.getElementById('editSheetAvatar');
  if(p.avatarId&&!p.avatar){var av=SYSTEM_AVATARS.find(function(a){return a.id===p.avatarId;});if(av){if(esImg)esImg.style.display='none';if(esInit){esInit.style.display='';esInit.textContent=av.emoji;}if(esAv)esAv.style.background=av.bg;}}
  else if(p.avatar){if(esImg){esImg.src=p.avatar;esImg.style.display='block';}if(esInit)esInit.style.display='none';}
  else{if(esImg)esImg.style.display='none';if(esInit){esInit.style.display='';esInit.textContent=initials;}}
  var removeBtn=document.getElementById('removeAvatarBtn');if(removeBtn)removeBtn.style.display=p.avatar?'inline':'none';
  document.getElementById('editProfileName').value=p.name||'';
  document.getElementById('editProfileUsername').value=p.username||'';
  document.getElementById('editProfileEmail').value=p.email||'';
  document.getElementById('editProfileBio').value=p.bio||'';
  document.getElementById('editProfileMotto').value=p.motto||'';
  var cur=p.avatarId||'';
  var pg=document.getElementById('editAvatarPickerGrid');
  if(pg){pg.innerHTML='';SYSTEM_AVATARS.forEach(function(av){var d=document.createElement('div');d.style.cssText='width:100%;aspect-ratio:1;border-radius:12px;background:'+av.bg+';display:flex;align-items:center;justify-content:center;font-size:1.4rem;cursor:pointer;border:2px solid '+(cur===av.id?'var(--accent)':'transparent')+';transition:all .18s;';d.id='avopt-'+av.id;d.textContent=av.emoji;d.addEventListener('click',function(){selectSystemAvatar(av.id);});pg.appendChild(d);});}
  var selBadge=p.badge||'student';
  var bg=document.getElementById('editBadgeGrid');
  if(bg){bg.innerHTML='';BADGES.forEach(function(b){var d=document.createElement('div');d.className='prof-badge-opt'+(selBadge===b.id?' sel':'');d.innerHTML='<span class="badge-ico">'+b.ico+'</span><span class="badge-lbl">'+b.lbl+'</span>';d.addEventListener('click',function(){selectBadge(b.id,d);});bg.appendChild(d);});}
  var selColor=p.accentColor||'purple';
  var cg=document.getElementById('editColorGrid');
  if(cg){cg.innerHTML='';ACCENT_COLORS.forEach(function(c){var d=document.createElement('div');d.className='prof-color-opt'+(selColor===c.name?' sel':'');d.style.background=c.val;d.addEventListener('click',function(){selectAccentColor(c.name,c.val,c.val2,d);});cg.appendChild(d);});}
  document.getElementById('profileEditSheet').classList.add('open');
}
function closeProfileEditSheet(){document.getElementById('profileEditSheet').classList.remove('open');}
function saveProfileFromSheet(){
  D.profile.name=document.getElementById('editProfileName').value.trim()||'Kullanıcı';
  D.profile.email=document.getElementById('editProfileEmail').value.trim()||'';
  D.profile.bio=document.getElementById('editProfileBio').value.trim();
  D.profile.motto=document.getElementById('editProfileMotto').value.trim();
  var uname=document.getElementById('editProfileUsername').value.trim().toLowerCase().replace(/[^a-z0-9_.]/g,'')||'';
  if(uname)D.profile.username=uname;
  saveData();updateProfileUI();closeProfileEditSheet();
  if(document.getElementById('profilePage').classList.contains('open'))openProfilePage();
  showToast('Profil güncellendi ✦');
}
function openProfile(){openProfilePage();}
function openPrivacyModal(){openModal('privacyModal');}
function openSettingsPage(){initSettingsToggles();initTheme();document.getElementById('settingsPage').classList.add('open');}
function closeSettingsPage(){document.getElementById('settingsPage').classList.remove('open');}

// ── FIX 2: handleIgAvatarClick — profil resmine tıklayınca fotoğraf değiştir ──
function handleIgAvatarClick(){
  openProfileEditSheet();
  setTimeout(function(){
    var upload=document.getElementById('avatarUpload2');
    if(upload)upload.click();
  },420);
}


// ═══════════════════════════════════════════════════════════════
// ZAMAN KAPSÜLü — Time Capsule Feature
// ═══════════════════════════════════════════════════════════════

function initTimeCapsule() {
  if (!D.timeCapsules) D.timeCapsules = [];
}

function openTimeCapsulePage() {
  initTimeCapsule();
  renderTimeCapsules();
  document.getElementById('timeCapsulePage').classList.add('open');
}

function closeTimeCapsulePage() {
  document.getElementById('timeCapsulePage').classList.remove('open');
}

function openNewCapsuleSheet() {
  document.getElementById('capsuleTitleInput').value = '';
  document.getElementById('capsuleContentInput').value = '';
  document.getElementById('capsuleDateInput').value = '';
  document.getElementById('capsuleEmojiInput').value = '⏳';
  // Set min date to tomorrow
  var tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  document.getElementById('capsuleDateInput').min = tomorrow.toISOString().split('T')[0];
  // Quick date buttons
  var now = new Date();
  document.getElementById('capBtn3m').dataset.date = new Date(now.setMonth(now.getMonth()+3)).toISOString().split('T')[0];
  now = new Date();
  document.getElementById('capBtn6m').dataset.date = new Date(now.setMonth(now.getMonth()+6)).toISOString().split('T')[0];
  now = new Date();
  document.getElementById('capBtn1y').dataset.date = new Date(now.setFullYear(now.getFullYear()+1)).toISOString().split('T')[0];
  now = new Date();
  document.getElementById('capBtn2y').dataset.date = new Date(now.setFullYear(now.getFullYear()+2)).toISOString().split('T')[0];
  now = new Date();
  document.getElementById('capBtn5y').dataset.date = new Date(now.setFullYear(now.getFullYear()+5)).toISOString().split('T')[0];
  document.getElementById('newCapsuleSheet').classList.add('open');
  setTimeout(function() { document.getElementById('capsuleTitleInput').focus(); }, 400);
}

function closeNewCapsuleSheet() {
  document.getElementById('newCapsuleSheet').classList.remove('open');
}

function setCapsuleDate(btn) {
  document.getElementById('capsuleDateInput').value = btn.dataset.date;
  document.querySelectorAll('.cap-quick-btn').forEach(function(b) { b.classList.remove('sel'); });
  btn.classList.add('sel');
}

function saveNewCapsule() {
  var title = document.getElementById('capsuleTitleInput').value.trim();
  var content = document.getElementById('capsuleContentInput').value.trim();
  var openDate = document.getElementById('capsuleDateInput').value;
  var emoji = document.getElementById('capsuleEmojiInput').value.trim() || '⏳';
  if (!title) { showToast('Başlık gerekli'); return; }
  if (!openDate) { showToast('Açılış tarihi seç'); return; }
  var today = new Date().toISOString().split('T')[0];
  if (openDate <= today) { showToast('Gelecekte bir tarih seç'); return; }
  initTimeCapsule();
  D.timeCapsules.push({
    id: Date.now(),
    title: title,
    content: content,
    emoji: emoji,
    createdAt: new Date().toISOString(),
    openDate: openDate,
    opened: false
  });
  saveData();
  closeNewCapsuleSheet();
  renderTimeCapsules();
  showToast('Kapsül mühürlendi 🔒');
  addNotification('⏳ "' + title + '" kapsülü oluşturuldu. ' + openDate + ' tarihinde açılacak!', 'capsule');
}

function renderTimeCapsules() {
  initTimeCapsule();
  var cont = document.getElementById('capsuleList');
  if (!cont) return;
  var today = new Date();
  today.setHours(0, 0, 0, 0);

  if (!D.timeCapsules.length) {
    cont.innerHTML = '<div class="empty-state" style="padding:48px 20px;">'
      + '<div style="font-size:2.5rem;margin-bottom:12px;">⏳</div>'
      + '<div style="font-size:.88rem;color:var(--text2);margin-bottom:6px;">Henüz kapsül yok</div>'
      + '<div style="font-size:.72rem;color:var(--text3);line-height:1.6;">Bugün kendine bir mesaj yaz,<br>gelecekte sürprizle karşılaş.</div>'
      + '</div>';
    return;
  }

  // Sort: unlocked first, then by openDate
  var sorted = D.timeCapsules.slice().sort(function(a, b) {
    var aUnlocked = new Date(a.openDate) <= today;
    var bUnlocked = new Date(b.openDate) <= today;
    if (aUnlocked && !bUnlocked) return -1;
    if (!aUnlocked && bUnlocked) return 1;
    return a.openDate.localeCompare(b.openDate);
  });

  cont.innerHTML = sorted.map(function(cap) {
    var openDate = new Date(cap.openDate);
    openDate.setHours(0, 0, 0, 0);
    var isUnlocked = openDate <= today;
    var daysLeft = Math.ceil((openDate - today) / (1000 * 60 * 60 * 24));
    var countdownClass = isUnlocked ? 'unlocked' : (daysLeft <= 30 ? 'soon' : 'locked');
    var countdownText = isUnlocked
      ? (cap.opened ? '✓ Okundu' : '🎉 Açılabilir!')
      : (daysLeft === 1 ? 'Yarın açılıyor!' : daysLeft + ' gün kaldı');

    return '<div class="capsule-card ' + (isUnlocked ? 'unlocked' : 'locked') + '" onclick="viewCapsule(' + cap.id + ')">'
      + '<div style="display:flex;align-items:flex-start;gap:12px;">'
      + '<div style="font-size:2rem;flex-shrink:0;line-height:1.2;">' + cap.emoji + '</div>'
      + '<div style="flex:1;min-width:0;">'
      + '<div class="capsule-title">' + escHtml(cap.title) + '</div>'
      + '<div class="capsule-meta">'
      + 'Oluşturuldu: ' + fmtDate(cap.createdAt) + ' · '
      + 'Açılış: ' + fmtDate(cap.openDate)
      + '</div>'
      + '<span class="capsule-countdown ' + countdownClass + '">'
      + (isUnlocked ? '' : '🔒 ') + countdownText
      + '</span>'
      + '</div>'
      + '<button onclick="event.stopPropagation();deleteCapsuleConfirm(' + cap.id + ')" '
      + 'style="background:none;border:none;cursor:pointer;color:var(--text3);padding:4px;border-radius:6px;flex-shrink:0;opacity:0;transition:all .18s;" '
      + 'onmouseover="this.style.color=var(--hard);this.style.opacity=1" '
      + 'onmouseout="this.style.color=var(--text3);this.style.opacity=0" '
      + 'class="cap-del-btn">✕</button>'
      + '</div>'
      + '</div>';
  }).join('');

  // Show delete buttons on hover of parent
  cont.querySelectorAll('.capsule-card').forEach(function(card) {
    card.addEventListener('mouseenter', function() {
      var btn = card.querySelector('.cap-del-btn');
      if (btn) btn.style.opacity = '1';
    });
    card.addEventListener('mouseleave', function() {
      var btn = card.querySelector('.cap-del-btn');
      if (btn) btn.style.opacity = '0';
    });
  });

  // Check for newly unlocked capsules and notify
  checkCapsuleNotifications();
}

function viewCapsule(id) {
  initTimeCapsule();
  var cap = D.timeCapsules.find(function(c) { return c.id === id; });
  if (!cap) return;
  var today = new Date();
  today.setHours(0, 0, 0, 0);
  var openDate = new Date(cap.openDate);
  openDate.setHours(0, 0, 0, 0);
  var isUnlocked = openDate <= today;

  if (!isUnlocked) {
    var daysLeft = Math.ceil((openDate - today) / (1000 * 60 * 60 * 24));
    var modal = document.createElement('div');
    modal.className = 'capsule-open-overlay open';
    var lockedHtml = '<div class="capsule-open-card">'
      + '<div style="font-size:3rem;margin-bottom:12px;">🔒</div>'
      + '<div style="font-size:1rem;font-weight:500;color:var(--text);margin-bottom:8px;">' + escHtml(cap.title) + '</div>'
      + '<div style="font-size:.78rem;color:var(--text3);margin-bottom:16px;line-height:1.6;">'
      + 'Bu kapsül henüz açılmadı.<br>'
      + '<span style="color:var(--accent2);font-weight:500;">' + daysLeft + ' gün</span> sonra açılacak.'
      + '</div>'
      + '<div style="font-size:.7rem;color:var(--text3);margin-bottom:20px;">'
      + fmtDate(cap.openDate) + ' - ' + fmtDate(cap.createdAt) + 'de mühürlendi'
      + '</div>'
      + '<button id="closeLocked" style="background:var(--bg3);border:1px solid var(--border);border-radius:10px;padding:10px 24px;cursor:pointer;font-family:Sora,sans-serif;font-size:.8rem;color:var(--text2);">Kapat</button>'
      + '</div>';
    modal.innerHTML = lockedHtml;
    modal.querySelector('#closeLocked').onclick = function() { modal.remove(); };
    modal.addEventListener('click', function(e) { if (e.target === modal) modal.remove(); });
    document.body.appendChild(modal);
    return;
  }

  var isFirstOpen = !cap.opened;
  if (isFirstOpen) {
    cap.opened = true;
    saveData();
    renderTimeCapsules();
  }

  var overlay = document.createElement('div');
  overlay.className = 'capsule-open-overlay';
  var contentHtml = cap.content
    ? '<div style="background:var(--bg3);border:1px solid var(--border);border-radius:12px;padding:16px;text-align:left;font-size:.84rem;color:var(--text2);line-height:1.8;white-space:pre-wrap;max-height:240px;overflow-y:auto;margin-bottom:18px;">' + escHtml(cap.content) + '</div>'
    : '<div style="color:var(--text3);font-style:italic;margin-bottom:18px;font-size:.8rem;">Bu kapsülde içerik yok.</div>';

  var daysSince = Math.ceil((new Date() - new Date(cap.createdAt)) / (1000 * 60 * 60 * 24));
  overlay.innerHTML = '<div class="capsule-open-card' + (isFirstOpen ? ' capsule-open-anim' : '') + '">'
    + '<div style="font-size:3.5rem;margin-bottom:10px;">' + cap.emoji + '</div>'
    + (isFirstOpen ? '<div style="font-size:.6rem;letter-spacing:.2em;color:var(--accent2);text-transform:uppercase;margin-bottom:10px;">✨ Kapsül Açıldı!</div>' : '')
    + '<div style="font-size:1.05rem;font-weight:500;color:var(--text);margin-bottom:6px;">' + escHtml(cap.title) + '</div>'
    + '<div style="font-size:.62rem;color:var(--text3);margin-bottom:16px;">'
    + fmtDate(cap.createdAt) + 'den · ' + daysSince + ' gün önce yazıldı'
    + '</div>'
    + contentHtml
    + '<button id="closeCapsule" style="background:linear-gradient(135deg,var(--accent),var(--diary));border:none;border-radius:10px;padding:11px 28px;cursor:pointer;font-family:Sora,sans-serif;font-size:.82rem;color:#fff;font-weight:500;">Kapat ✓</button>'
    + '</div>';

  overlay.querySelector('#closeCapsule').onclick = function() { overlay.remove(); };
  overlay.addEventListener('click', function(e) { if (e.target === overlay) overlay.remove(); });
  document.body.appendChild(overlay);
  requestAnimationFrame(function() { overlay.classList.add('open'); });

  if (isFirstOpen) {
    addNotification('🎉 "' + cap.title + '" zaman kapsülünü açtın! ' + daysSince + ' gün önce yazmıştın.', 'capsule');
  }
}
function deleteCapsuleConfirm(id) {
  initTimeCapsule();
  var cap = D.timeCapsules.find(function(c) { return c.id === id; });
  if (!cap) return;
  showConfirm('"' + cap.title + '" kapsülü silinsin mi?', function() {
    D.timeCapsules = D.timeCapsules.filter(function(c) { return c.id !== id; });
    saveData();
    renderTimeCapsules();
    showToast('Kapsül silindi');
  });
}

function checkCapsuleNotifications() {
  if (!D.timeCapsules) return;
  var today = new Date();
  today.setHours(0, 0, 0, 0);
  var todayKey = today.toISOString().split('T')[0];
  D.timeCapsules.forEach(function(cap) {
    if (cap.opened) return;
    var openDate = new Date(cap.openDate);
    openDate.setHours(0, 0, 0, 0);
    var daysLeft = Math.ceil((openDate - today) / (1000 * 60 * 60 * 24));
    // Notify on exact open day
    var notifKey = 'capsule_notif_' + cap.id + '_' + todayKey;
    if (daysLeft <= 0 && !localStorage.getItem(notifKey)) {
      addNotification('⏰ "' + cap.title + '" zaman kapsülü bugün açılıyor! Hemen bak 🎉', 'capsule');
      localStorage.setItem(notifKey, '1');
    }
    // Notify 1 day before
    if (daysLeft === 1 && !localStorage.getItem(notifKey + '_1d')) {
      addNotification('⏳ "' + cap.title + '" kapsülü yarın açılıyor!', 'capsule');
      localStorage.setItem(notifKey + '_1d', '1');
    }
  });
}


// ═══════════════════════════════════════════════════════
// FIXES & NEW FEATURES
// ═══════════════════════════════════════════════════════

// FIX: Avatar upload in profile page
function handleIgAvatarClick() {
  var inp = document.getElementById('avatarUpload');
  if (!inp) {
    inp = document.createElement('input');
    inp.type = 'file';
    inp.accept = 'image/*';
    inp.id = 'avatarUpload';
    inp.style.display = 'none';
    inp.onchange = function(e) { handleAvatarUpload(e); };
    document.body.appendChild(inp);
  }
  inp.click();
}

// ═══════════════════════════════════════════════════════
// MÜHÜRLÜ NOT & GÜNLÜK (Sealed Notes/Diary)
// ═══════════════════════════════════════════════════════
function sealEntry(type, id) {
  var arr = type === 'note' ? D.notes : D.diary;
  var entry = arr.find(function(e) { return e.id === id; });
  if (!entry) return;
  if (entry.sealed) {
    // Mühürü kaldır
    showConfirm('Mühürü kaldırmak istiyor musun?', function() {
      delete entry.sealed;
      saveData();
      if (type === 'note') renderNotes(); else renderDiary();
      showToast('Mühür kaldırıldı');
    });
    return;
  }
  // PIN varsa PIN ile mühürle, yoksa direkt mühürle
  var hasPIN = !!localStorage.getItem('capsula_pin');
  if (hasPIN) {
    openSealPinModal(type, id);
  } else {
    entry.sealed = true;
    saveData();
    if (type === 'note') renderNotes(); else renderDiary();
    showToast('Mühürlendi 🔒 — Tekrar basmak için PIN gerekir');
  }
}

function openSealPinModal(type, id) {
  document.getElementById('sealPinModal') && document.getElementById('sealPinModal').remove();
  var modal = document.createElement('div');
  modal.id = 'sealPinModal';
  modal.style.cssText = 'position:fixed;inset:0;z-index:3500;background:rgba(0,0,0,.7);display:flex;align-items:center;justify-content:center;backdrop-filter:blur(6px);';
  modal.innerHTML = '<div style="background:var(--bg2);border:1px solid var(--border);border-radius:18px;padding:28px 24px;text-align:center;width:min(320px,90vw);">'
    + '<div style="font-size:1.8rem;margin-bottom:10px;">🔒</div>'
    + '<div style="font-size:.9rem;font-weight:500;color:var(--text);margin-bottom:6px;">PIN ile Mühürle</div>'
    + '<div style="font-size:.74rem;color:var(--text3);margin-bottom:20px;line-height:1.6;">Bu içerik PIN girilmeden görüntülenemez.</div>'
    + '<div style="display:flex;gap:8px;justify-content:center;">'
    + '<button id="sealCancel" style="flex:1;padding:10px;background:var(--bg3);border:1px solid var(--border);border-radius:10px;cursor:pointer;font-family:Sora,sans-serif;font-size:.8rem;color:var(--text2);">Vazgeç</button>'
    + '<button id="sealConfirm" style="flex:1;padding:10px;background:linear-gradient(135deg,var(--accent),var(--diary));border:none;border-radius:10px;cursor:pointer;font-family:Sora,sans-serif;font-size:.8rem;color:#fff;font-weight:500;">Mühürle</button>'
    + '</div></div>';
  document.body.appendChild(modal);
  modal.querySelector('#sealCancel').onclick = function() { modal.remove(); };
  modal.querySelector('#sealConfirm').onclick = function() {
    var arr = type === 'note' ? D.notes : D.diary;
    var entry = arr.find(function(e) { return e.id === id; });
    if (entry) {
      entry.sealed = true;
      saveData();
      if (type === 'note') renderNotes(); else renderDiary();
      showToast('Mühürlendi 🔒');
    }
    modal.remove();
  };
  modal.addEventListener('click', function(e) { if (e.target === modal) modal.remove(); });
}

function viewSealedEntry(type, id) {
  var hasPIN = !!localStorage.getItem('capsula_pin');
  if (!hasPIN) {
    // PIN yok, direkt aç
    viewEntry(type, id);
    return;
  }
  // PIN iste
  var pinBuf = '';
  var modal = document.createElement('div');
  modal.id = 'sealViewModal';
  modal.style.cssText = 'position:fixed;inset:0;z-index:3500;background:rgba(0,0,0,.75);display:flex;align-items:center;justify-content:center;backdrop-filter:blur(8px);';
  modal.innerHTML = '<div style="background:var(--bg2);border:1px solid var(--border);border-radius:18px;padding:28px 24px;text-align:center;width:min(300px,90vw);">'
    + '<div style="font-size:1.8rem;margin-bottom:8px;">🔒</div>'
    + '<div style="font-size:.88rem;font-weight:500;color:var(--text);margin-bottom:16px;">PIN Gir</div>'
    + '<div style="display:flex;gap:10px;justify-content:center;margin-bottom:16px;" id="svDots">'
    + '<div class="pin-dot" id="sv0"></div><div class="pin-dot" id="sv1"></div><div class="pin-dot" id="sv2"></div><div class="pin-dot" id="sv3"></div>'
    + '</div>'
    + '<div class="pin-pad" style="max-width:200px;margin:0 auto 12px;">'
    + [1,2,3,4,5,6,7,8,9,'',0,'⌫'].map(function(k,i) {
        if (k === '') return '<div class="pin-key empty"></div>';
        if (k === '⌫') return '<div class="pin-key del" id="svDel">⌫</div>';
        return '<div class="pin-key" data-k="' + k + '">' + k + '</div>';
      }).join('')
    + '</div>'
    + '<button id="svCancel" style="background:none;border:none;cursor:pointer;font-size:.64rem;color:var(--text3);font-family:JetBrains Mono,monospace;text-decoration:underline;">İptal</button>'
    + '</div>';
  document.body.appendChild(modal);

  function updateDots() {
    for (var i = 0; i < 4; i++) {
      var d = document.getElementById('sv' + i);
      if (d) d.classList.toggle('filled', i < pinBuf.length);
    }
  }
  modal.querySelectorAll('.pin-key[data-k]').forEach(function(el) {
    el.addEventListener('click', function() {
      if (pinBuf.length >= 4) return;
      pinBuf += el.dataset.k;
      updateDots();
      if (pinBuf.length === 4) {
        setTimeout(async function() {
          var stored = localStorage.getItem('capsula_pin');
          var ok = await verifyPin(pinBuf, stored);
          if (ok) {
            modal.remove();
            viewEntry(type, id);
          } else {
            document.querySelectorAll('#svDots .pin-dot').forEach(function(d) { d.classList.add('error'); });
            setTimeout(function() {
              document.querySelectorAll('#svDots .pin-dot').forEach(function(d) { d.classList.remove('error', 'filled'); });
              pinBuf = '';
            }, 500);
          }
        }, 80);
      }
    });
  });
  document.getElementById('svDel').addEventListener('click', function() {
    pinBuf = pinBuf.slice(0, -1);
    updateDots();
  });
  document.getElementById('svCancel').addEventListener('click', function() { modal.remove(); });
}


// ── SEALED NOTES & DIARY — renderNotes/renderDiary override ──────────────
(function() {
  var _origRenderNotes = window.renderNotes || renderNotes;
  
  // renderNotes'u sealed note desteğiyle güncelle
  window.renderNotes = function() {
    var grid = document.getElementById('notes-grid');
    var empty = document.getElementById('notes-empty');
    if (!D.notes.length) {
      if (grid) grid.innerHTML = '';
      if (empty) empty.style.display = 'block';
      return;
    }
    if (empty) empty.style.display = 'none';
    
    if (grid) {
      grid.innerHTML = D.notes.map(function(n) {
        var tags = (n.tags || []).map(function(t) {
          return '<span class="note-tag-chip" style="color:' + tagColor(t) + ';border-color:' + tagColor(t) + '44;">#' + escHtml(t) + '</span>';
        }).join('');
        
        if (n.sealed) {
          return '<div class="note-card" data-nid="' + n.id + '" style="justify-content:center;align-items:center;background:linear-gradient(135deg,var(--bg2),var(--bg3));">'
            + '<div style="text-align:center;">'
            + '<div style="font-size:2rem;margin-bottom:8px;">🔒</div>'
            + '<div style="font-size:.76rem;font-weight:500;color:var(--text2);">' + escHtml(n.title || 'Mühürlü Not') + '</div>'
            + '<div style="font-size:.58rem;color:var(--text3);margin-top:4px;">Görüntülemek için dokun</div>'
            + '</div>'
            + '<button data-seal="' + n.id + '" data-type="note" style="position:absolute;top:8px;right:8px;background:none;border:none;cursor:pointer;font-size:.7rem;color:var(--accent2);padding:3px 6px;border-radius:6px;border:1px solid rgba(124,111,247,.25);">🔒</button>'
            + '</div>';
        }
        
        return '<div class="note-card" data-nid="' + n.id + '">'
          + '<div class="note-card-title">' + escHtml(n.title || 'Başlıksız') + '</div>'
          + '<div class="note-card-preview">' + escHtml((n.content || '').slice(0, 80)) + '</div>'
          + (tags ? '<div style="display:flex;gap:3px;flex-wrap:wrap;">' + tags + '</div>' : '')
          + '<div class="note-card-date">' + fmtDate(n.createdAt) + '</div>'
          + '<button data-seal="' + n.id + '" data-type="note" style="position:absolute;top:8px;right:8px;background:none;border:none;cursor:pointer;font-size:.7rem;color:var(--text3);padding:3px 6px;border-radius:6px;border:1px solid var(--border);opacity:0;transition:opacity .18s;" class="seal-btn">🔓</button>'
          + '</div>';
      }).join('');
      
      // Event listeners
      grid.querySelectorAll('.note-card').forEach(function(card) {
        var nid = parseInt(card.dataset.nid);
        var n = D.notes.find(function(x) { return x.id === nid; });
        if (!n) return;
        
        card.style.position = 'relative';
        
        // Show seal button on hover
        var sealBtn = card.querySelector('.seal-btn');
        if (sealBtn) {
          card.addEventListener('mouseenter', function() { sealBtn.style.opacity = '1'; });
          card.addEventListener('mouseleave', function() { sealBtn.style.opacity = '0'; });
          card.addEventListener('touchstart', function() { sealBtn.style.opacity = '1'; }, {passive:true});
        }
        
        // Seal button click
        card.querySelectorAll('[data-seal]').forEach(function(btn) {
          btn.addEventListener('click', function(e) {
            e.stopPropagation();
            sealEntry('note', nid);
          });
        });
        
        // Card click — sealed = PIN, normal = view
        card.addEventListener('click', function(e) {
          if (e.target.closest('[data-seal]')) return;
          if (n.sealed) {
            viewSealedEntry('note', nid);
          } else {
            viewEntry('note', nid);
          }
        });
      });
    }
  };

  // renderDiary'yi sealed diary desteğiyle güncelle  
  window.renderDiary = function() {
    if (typeof renderDiaryAIPrompt === 'function') renderDiaryAIPrompt();
    var list = document.getElementById('diary-list');
    var empty = document.getElementById('diary-empty');
    if (!D.diary.length) {
      if (list) list.innerHTML = '';
      if (empty) empty.style.display = 'block';
      return;
    }
    if (empty) empty.style.display = 'none';
    
    if (list) {
      list.innerHTML = D.diary.map(function(e) {
        if (e.sealed) {
          return '<div class="diary-entry" data-eid="' + e.id + '" style="justify-content:center;align-items:center;">'
            + '<div style="display:flex;align-items:center;gap:12px;">'
            + '<div style="font-size:1.8rem;">🔒</div>'
            + '<div>'
            + '<div class="diary-entry-title">' + escHtml(e.title || 'Mühürlü Günlük') + '</div>'
            + '<div class="diary-entry-date">' + fmtDate(e.createdAt) + ' · Görüntülemek için dokun</div>'
            + '</div>'
            + '</div>'
            + '<button data-seal="' + e.id + '" data-type="diary" style="position:absolute;top:10px;right:12px;background:none;border:1px solid rgba(124,111,247,.25);border-radius:6px;cursor:pointer;font-size:.7rem;color:var(--accent2);padding:3px 7px;">🔒</button>'
            + '</div>';
        }
        return '<div class="diary-entry" data-eid="' + e.id + '" style="position:relative;">'
          + '<div class="diary-entry-header"><span class="diary-entry-date">' + fmtDateFull(e.createdAt) + '</span><span class="diary-mood-icon">' + (e.mood || '😊') + '</span></div>'
          + '<div class="diary-entry-title">' + escHtml(e.title || 'Günlük Girişi') + '</div>'
          + '<div class="diary-entry-preview">' + escHtml(e.content || '') + '</div>'
          + '<button data-seal="' + e.id + '" data-type="diary" style="position:absolute;top:10px;right:12px;background:none;border:1px solid var(--border);border-radius:6px;cursor:pointer;font-size:.7rem;color:var(--text3);padding:3px 7px;opacity:0;transition:opacity .18s;" class="seal-btn">🔓</button>'
          + '</div>';
      }).join('');
      
      list.querySelectorAll('.diary-entry').forEach(function(card) {
        var eid = parseInt(card.dataset.eid);
        var e = D.diary.find(function(x) { return x.id === eid; });
        if (!e) return;
        
        var sealBtn = card.querySelector('.seal-btn');
        if (sealBtn) {
          card.addEventListener('mouseenter', function() { sealBtn.style.opacity = '1'; });
          card.addEventListener('mouseleave', function() { sealBtn.style.opacity = '0'; });
          card.addEventListener('touchstart', function() { sealBtn.style.opacity = '1'; }, {passive:true});
        }
        
        card.querySelectorAll('[data-seal]').forEach(function(btn) {
          btn.addEventListener('click', function(ev) {
            ev.stopPropagation();
            sealEntry('diary', eid);
          });
        });
        
        card.addEventListener('click', function(ev) {
          if (ev.target.closest('[data-seal]')) return;
          if (e.sealed) {
            viewSealedEntry('diary', eid);
          } else {
            viewEntry('diary', eid);
          }
        });
      });
    }
  };
})();
