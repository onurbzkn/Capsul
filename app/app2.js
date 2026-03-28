// ══════════════════════════════════════════════════════
// GOOGLE DRIVE BACKUP
// ══════════════════════════════════════════════════════
var GDRIVE_CLIENT_ID='951927360233-2onoimfgc3p7s06jleg5eio3bc051u4i.apps.googleusercontent.com';
var GDRIVE_SCOPE='https://www.googleapis.com/auth/drive.appdata';
var _gdriveToken=null;
var _gdriveTokenClient=null;

function _initGdriveClient(){
if(_gdriveTokenClient)return;
if(typeof google==='undefined'||!google.accounts)return;
_gdriveTokenClient=google.accounts.oauth2.initTokenClient({
client_id:GDRIVE_CLIENT_ID,
scope:GDRIVE_SCOPE,
callback:function(resp){
if(resp.error){
_updateGdriveUI('error','Giriş başarısız: '+resp.error);
return;
}
_gdriveToken=resp.access_token;
localStorage.setItem('capsula_gdrive_connected','1');
_updateGdriveUI('connected','Google hesabına bağlı');
}
});
}

function _getGdriveToken(){
return new Promise(function(resolve,reject){
_initGdriveClient();
if(!_gdriveTokenClient){reject(new Error('Google kütüphanesi yüklenemedi'));return;}
if(_gdriveToken){resolve(_gdriveToken);return;}
_gdriveTokenClient.callback=function(resp){
if(resp.error){reject(new Error(resp.error));return;}
_gdriveToken=resp.access_token;
localStorage.setItem('capsula_gdrive_connected','1');
_updateGdriveUI('connected','Google hesabına bağlı');
resolve(_gdriveToken);
};
_gdriveTokenClient.requestAccessToken({prompt:'consent'});
});
}

function _mergeArrayById(existing,incoming){
var ids=new Set(existing.map(function(x){return x.id;}));
incoming.forEach(function(item){if(!ids.has(item.id)){existing.push(item);ids.add(item.id);}});
return existing;
}
function _gdriveDoMerge(imported){
// Array alanlarını birleştir (ID'ye göre, duplicate olmaz)
D.todos=_mergeArrayById(D.todos,imported.todos||[]);
D.completedTodos=_mergeArrayById(D.completedTodos,imported.completedTodos||[]);
D.notes=_mergeArrayById(D.notes,imported.notes||[]);
D.diary=_mergeArrayById(D.diary,imported.diary||[]);
D.reading=_mergeArrayById(D.reading,imported.reading||[]);
D.schedule=_mergeArrayById(D.schedule,imported.schedule||[]);
D.exams=_mergeArrayById(D.exams,imported.exams||[]);
D.notebook=_mergeArrayById(D.notebook,imported.notebook||[]);
D.habits=_mergeArrayById(D.habits||[],imported.habits||[]);
D.timeCapsules=_mergeArrayById(D.timeCapsules||[],imported.timeCapsules||[]);
D.trash=_mergeArrayById(D.trash||[],imported.trash||[]);
D.contentTrash=_mergeArrayById(D.contentTrash||[],imported.contentTrash||[]);
D.goals=_mergeArrayById(D.goals||[],imported.goals||[]);
// moodLog birleştir (obje)
if(imported.moodLog){if(!D.moodLog)D.moodLog={};Object.keys(imported.moodLog).forEach(function(k){if(!D.moodLog[k])D.moodLog[k]=imported.moodLog[k];});}
// scheduleWeeks birleştir
if(imported.scheduleWeeks){if(!D.scheduleWeeks)D.scheduleWeeks={};Object.keys(imported.scheduleWeeks).forEach(function(k){if(!D.scheduleWeeks[k])D.scheduleWeeks[k]=imported.scheduleWeeks[k];});}
// Kanban birleştir
if(imported.kanban){
['todo','doing','done'].forEach(function(col){
D.kanban[col]=_mergeArrayById(D.kanban[col]||[],imported.kanban[col]||[]);
});
}
// calPlans birleştir
if(imported.calPlans){
Object.keys(imported.calPlans).forEach(function(k){
if(!D.calPlans[k])D.calPlans[k]=[];
D.calPlans[k]=D.calPlans[k].concat(imported.calPlans[k]||[]);
});
}
if(imported.profile){
D.profile=Object.assign({},D.profile,imported.profile);
}
saveData();
updateProfileUI();
renderTodos();renderNotes();renderDiary();renderDashboard();renderKanban();renderReading();updTrashBadge();updateReminderBadge();
if(typeof renderSchedule==='function')renderSchedule();
if(typeof renderExams==='function')renderExams();
if(typeof renderNotebook==='function')renderNotebook();
if(typeof renderHabits==='function')renderHabits();
if(typeof renderMoodTracker==='function')renderMoodTracker();
if(typeof renderGoals==='function')renderGoals();
_updateGdriveUI('connected','Birleştirme tamamlandı ✓');
showToast(t('gdriveMerged'));
}
function _gdriveDoOverwrite(imported){
Object.assign(D,imported);
if(imported.profile){
D.profile=Object.assign({},D.profile,imported.profile);
}
if(!D.calPlans)D.calPlans={};
if(!D.kanban)D.kanban={todo:[],doing:[],done:[]};
if(!D.reading)D.reading=[];
if(!D.completedTodos)D.completedTodos=[];
if(!D.trash)D.trash=[];
if(!D.contentTrash)D.contentTrash=[];
if(!D.habits)D.habits=[];
if(!D.timeCapsules)D.timeCapsules=[];
if(!D.moodLog)D.moodLog={};
if(!D.goals)D.goals=[];
if(!D.schedule)D.schedule=[];
if(!D.scheduleWeeks)D.scheduleWeeks={};
if(!D.exams)D.exams=[];
if(!D.notebook)D.notebook=[];
saveData();
renderTodos();renderNotes();renderDiary();renderDashboard();renderKanban();renderReading();updTrashBadge();updateReminderBadge();
if(typeof renderSchedule==='function')renderSchedule();
if(typeof renderExams==='function')renderExams();
if(typeof renderNotebook==='function')renderNotebook();
if(typeof renderHabits==='function')renderHabits();
if(typeof renderMoodTracker==='function')renderMoodTracker();
if(typeof renderGoals==='function')renderGoals();
_updateGdriveUI('connected','Üzerine yazma tamamlandı ✓');
showToast(t('gdriveOverwritten'));
}
function _updateGdriveUI(state,msg){
var statusEl=document.getElementById('gdriveStatus');
var lastSync=document.getElementById('gdriveLastSync');
if(statusEl){
if(state==='connected')statusEl.innerHTML='<span style="color:var(--easy);">✓</span> '+msg;
else if(state==='error')statusEl.innerHTML='<span style="color:var(--hard);">✗</span> '+msg;
else if(state==='loading')statusEl.innerHTML='<span style="color:var(--mid);">⟳</span> '+msg;
else statusEl.textContent=msg||'Bağlı değil';
}
var lastTime=localStorage.getItem('capsula_gdrive_last');
if(lastSync&&lastTime){
lastSync.style.display='block';
lastSync.textContent='Son senkronizasyon: '+new Date(lastTime).toLocaleString('tr-TR',{day:'numeric',month:'short',hour:'2-digit',minute:'2-digit'});
}
}

async function _gdriveFindFile(token){
var res=await fetch('https://www.googleapis.com/drive/v3/files?spaces=appDataFolder&q=name%3D%27capsula_backup.json%27&fields=files(id,name,modifiedTime)',{
headers:{'Authorization':'Bearer '+token}
});
var data=await res.json();
return data.files&&data.files.length?data.files[0]:null;
}

async function gdriveBackup(){
try{
_updateGdriveUI('loading','Bağlanılıyor...');
var token=await _getGdriveToken();
_updateGdriveUI('loading','Yedekleniyor...');
var backupData=JSON.parse(JSON.stringify(D));
var payload=JSON.stringify({
meta:{exportedAt:new Date().toISOString(),version:'capsula-v4',source:'gdrive'},
data:backupData
});
var existing=await _gdriveFindFile(token);
if(existing){
await fetch('https://www.googleapis.com/upload/drive/v3/files/'+existing.id+'?uploadType=media',{
method:'PATCH',
headers:{'Authorization':'Bearer '+token,'Content-Type':'application/json'},
body:payload
});
} else {
var metadata={name:'capsula_backup.json',parents:['appDataFolder']};
var form=new FormData();
form.append('metadata',new Blob([JSON.stringify(metadata)],{type:'application/json'}));
form.append('file',new Blob([payload],{type:'application/json'}));
await fetch('https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart',{
method:'POST',
headers:{'Authorization':'Bearer '+token},
body:form
});
}
localStorage.setItem('capsula_gdrive_last',new Date().toISOString());
_updateGdriveUI('connected','Yedekleme tamamlandı ✓');
showToast(t('gdriveSaved'));
}catch(err){
console.error('GDrive backup error:',err);
_gdriveToken=null;
_updateGdriveUI('error','Hata: '+err.message);
showToast(t('gdriveBackupFailed'));
}
}

async function gdriveRestore(){
try{
_updateGdriveUI('loading','Bağlanılıyor...');
var token=await _getGdriveToken();
_updateGdriveUI('loading','Yedek aranıyor...');
var file=await _gdriveFindFile(token);
if(!file){
_updateGdriveUI('connected','Drive\'da yedek bulunamadı');
showToast(t('gdriveNoBackup'));
return;
}
var res=await fetch('https://www.googleapis.com/drive/v3/files/'+file.id+'?alt=media',{
headers:{'Authorization':'Bearer '+token}
});
var raw=await res.json();
var backupDate=raw.meta?new Date(raw.meta.exportedAt).toLocaleString('tr-TR'):'Bilinmiyor';
var imported=raw.data||raw;
// Özel restore modal: Birleştir veya Üzerine Yaz
var rModal=document.createElement('div');
rModal.id='gdriveRestoreModal';
rModal.style.cssText='position:fixed;inset:0;z-index:3600;background:rgba(0,0,0,.7);display:flex;align-items:center;justify-content:center;padding:20px;';
rModal.innerHTML='<div style="background:var(--bg2);border:1px solid var(--border);border-radius:16px;padding:24px;width:100%;max-width:340px;text-align:center;">'
+'<div style="font-size:1.5rem;margin-bottom:10px;">☁️</div>'
+'<div style="font-size:.88rem;font-weight:500;color:var(--text);margin-bottom:6px;">Drive Yedeği Bulundu</div>'
+'<div style="font-size:.68rem;color:var(--text3);margin-bottom:16px;line-height:1.6;">Yedek tarihi: '+backupDate+'</div>'
+'<div style="display:flex;flex-direction:column;gap:8px;">'
+'<button id="gdrMerge" style="padding:12px;background:linear-gradient(135deg,var(--accent),rgba(124,111,247,.8));border:none;border-radius:10px;color:#fff;font-family:Sora,sans-serif;font-size:.82rem;cursor:pointer;"><div style="font-weight:500;">Birleştir</div><div style="font-size:.6rem;opacity:.7;margin-top:2px;">Mevcut veriler korunur + yedektekiler eklenir</div></button>'
+'<button id="gdrOverwrite" style="padding:12px;background:rgba(248,113,113,.1);border:1px solid rgba(248,113,113,.25);border-radius:10px;color:var(--hard);font-family:Sora,sans-serif;font-size:.82rem;cursor:pointer;"><div style="font-weight:500;">Üzerine Yaz</div><div style="font-size:.6rem;opacity:.7;margin-top:2px;">Mevcut veriler silinir, sadece yedek yüklenir</div></button>'
+'<button id="gdrCancel" style="padding:10px;background:var(--bg3);border:1px solid var(--border);border-radius:10px;color:var(--text3);font-family:Sora,sans-serif;font-size:.78rem;cursor:pointer;">Vazgeç</button>'
+'</div></div>';
document.body.appendChild(rModal);
rModal.addEventListener('click',function(e){if(e.target===rModal)rModal.remove();});
document.getElementById('gdrCancel').onclick=function(){rModal.remove();};
document.getElementById('gdrMerge').onclick=function(){
rModal.remove();
_gdriveDoMerge(imported);
};
document.getElementById('gdrOverwrite').onclick=function(){
rModal.remove();
_gdriveDoOverwrite(imported);
};
_updateGdriveUI('connected','Google hesabına bağlı');
}catch(err){
console.error('GDrive restore error:',err);
_gdriveToken=null;
_updateGdriveUI('error','Hata: '+err.message);
showToast(t('gdriveRestoreFailed'));
}
}

function _initGdriveOnLoad(){
if(localStorage.getItem('capsula_gdrive_connected')){
_updateGdriveUI('connected','Google hesabıyla daha önce bağlandı');
} else {
_updateGdriveUI(null,'Bağlı değil');
}
}
setTimeout(_initGdriveOnLoad,1000);

function setPomoMode(m){
pomoMode=m;clearInterval(pomoInterval);pomoRunning=false;pomoSecs=POMO_DUR[m];
['work','short','long'].forEach(k=>document.getElementById('pomoBtn'+k.charAt(0).toUpperCase()+k.slice(1))?.classList.toggle('active',k===m));
const labels={work:'Çalışma Seansı',short:'Mola',long:'Mola'};
document.getElementById('pomoLabel').textContent=labels[m];
document.getElementById('pomoRing').className='pomo-prog '+m;
document.getElementById('pomoIcon').innerHTML='<polygon points="5 3 19 12 5 21 5 3" fill="currentColor"/>';
updatePomoDisplay();
}
function resetPomo(){setPomoMode(pomoMode);}
function togglePomo(){
if(pomoRunning){clearInterval(pomoInterval);pomoRunning=false;document.getElementById('pomoIcon').innerHTML='<polygon points="5 3 19 12 5 21 5 3" fill="currentColor"/>';}
else{pomoRunning=true;document.getElementById('pomoIcon').innerHTML='<rect x="6" y="4" width="4" height="16" fill="currentColor"/><rect x="14" y="4" width="4" height="16" fill="currentColor"/>';pomoInterval=setInterval(()=>{pomoSecs--;if(pomoSecs<=0){clearInterval(pomoInterval);pomoRunning=false;if(pomoMode==='work'){pomoSessions++;updatePomoSessions();showToast(t('sessionComplete'));}else showToast(t('breakOver'));return;}updatePomoDisplay();},1000);}
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
function _fmtDurInput(mins){var h=Math.floor(mins/60);var m=mins%60;return h>0?h+'s '+m+'dk':m+'dk';}
function openPomoDurEdit(){
const existing=document.getElementById('pomoDurModal');
if(existing){existing.remove();return;}
const w=POMO_DUR_CUSTOM.work,sh=POMO_DUR_CUSTOM.short;
const wH=Math.floor(w/60),wM=w%60,sH=Math.floor(sh/60),sM=sh%60;
const modal=document.createElement('div');
modal.id='pomoDurModal';
modal.style.cssText='position:fixed;inset:0;z-index:3500;background:rgba(0,0,0,.6);display:flex;align-items:center;justify-content:center;padding:20px;';
modal.innerHTML=`<div style="background:var(--bg2);border:1px solid var(--border);border-radius:16px;padding:22px;width:100%;max-width:320px;position:relative;">
<button onclick="document.getElementById('pomoDurModal').remove()" style="position:absolute;top:10px;right:12px;background:none;border:none;font-size:1.1rem;cursor:pointer;color:var(--text3);">✕</button>
<div style="font-size:.86rem;font-weight:500;color:var(--text);margin-bottom:16px;">⏱ Süre Ayarla</div>
<div style="display:flex;flex-direction:column;gap:16px;">
<div>
<div style="font-size:.74rem;color:var(--accent2);margin-bottom:8px;">🍅 Çalışma Süresi</div>
<div style="display:flex;gap:8px;align-items:center;">
<div style="flex:1;"><div style="font-size:.56rem;color:var(--text3);margin-bottom:3px;">Saat</div><input type="number" id="pdr-work-h" min="0" max="12" value="${wH}" style="width:100%;background:var(--bg3);border:1px solid var(--border);border-radius:8px;padding:10px;font-family:JetBrains Mono,monospace;font-size:1.1rem;color:var(--text);text-align:center;outline:none;box-sizing:border-box;"></div>
<div style="font-size:1.2rem;color:var(--text3);padding-top:14px;">:</div>
<div style="flex:1;"><div style="font-size:.56rem;color:var(--text3);margin-bottom:3px;">Dakika</div><input type="number" id="pdr-work-m" min="0" max="59" value="${wM}" style="width:100%;background:var(--bg3);border:1px solid var(--border);border-radius:8px;padding:10px;font-family:JetBrains Mono,monospace;font-size:1.1rem;color:var(--text);text-align:center;outline:none;box-sizing:border-box;"></div>
</div>
</div>
<div>
<div style="font-size:.74rem;color:var(--easy);margin-bottom:8px;">☕ Mola Süresi</div>
<div style="display:flex;gap:8px;align-items:center;">
<div style="flex:1;"><div style="font-size:.56rem;color:var(--text3);margin-bottom:3px;">Saat</div><input type="number" id="pdr-short-h" min="0" max="12" value="${sH}" style="width:100%;background:var(--bg3);border:1px solid var(--border);border-radius:8px;padding:10px;font-family:JetBrains Mono,monospace;font-size:1.1rem;color:var(--text);text-align:center;outline:none;box-sizing:border-box;"></div>
<div style="font-size:1.2rem;color:var(--text3);padding-top:14px;">:</div>
<div style="flex:1;"><div style="font-size:.56rem;color:var(--text3);margin-bottom:3px;">Dakika</div><input type="number" id="pdr-short-m" min="0" max="59" value="${sM}" style="width:100%;background:var(--bg3);border:1px solid var(--border);border-radius:8px;padding:10px;font-family:JetBrains Mono,monospace;font-size:1.1rem;color:var(--text);text-align:center;outline:none;box-sizing:border-box;"></div>
</div>
</div>
</div>
<button onclick="savePomoDur()" style="width:100%;margin-top:16px;padding:11px;background:linear-gradient(135deg,var(--accent),rgba(124,111,247,.8));border:none;border-radius:10px;color:#fff;font-family:'Sora',sans-serif;font-size:.84rem;cursor:pointer;">Kaydet</button>
</div>`;
document.body.appendChild(modal);
modal.addEventListener('click',e=>{if(e.target===modal)modal.remove();});
}
function savePomoDur(){
const wH=parseInt(document.getElementById('pdr-work-h')?.value)||0;
const wM=parseInt(document.getElementById('pdr-work-m')?.value)||0;
const sH=parseInt(document.getElementById('pdr-short-h')?.value)||0;
const sM=parseInt(document.getElementById('pdr-short-m')?.value)||0;
const workTotal=wH*60+wM;const shortTotal=sH*60+sM;
if(workTotal<1){showToast('Çalışma en az 1 dk olmalı');return;}
if(shortTotal<1){showToast('Mola en az 1 dk olmalı');return;}
POMO_DUR_CUSTOM.work=workTotal;
POMO_DUR_CUSTOM.short=shortTotal;
POMO_DUR_CUSTOM.long=shortTotal;
localStorage.setItem('capsula_pomo_dur',JSON.stringify(POMO_DUR_CUSTOM));
const wl=document.getElementById('pomoWorkLbl');const sl=document.getElementById('pomoShortLbl');
if(wl)wl.textContent=workTotal;
if(sl)sl.textContent=shortTotal;
const durModal=document.getElementById('pomoDurModal');
if(durModal)durModal.remove();
setPomoMode(pomoMode);
showToast(t('durationsUpdated'));
}
function setPomoStyle(s){
pomoStyle=s;localStorage.setItem('capsula_pomo_style',s);
document.querySelectorAll('.pomo-style-opt').forEach(el=>el.classList.toggle('active',el.id==='ps-'+s));
updatePomoDisplay();showToast(t('clockStyleChanged'));
}
function updatePomoSessions(){const c=document.getElementById('pomoSessions');c.innerHTML=Array.from({length:4},(_,i)=>`<div class="pomo-sess-dot${i<pomoSessions%4?' done':''}"></div>`).join('');}
function renderPomoTodos(){
const tk=new Date().toISOString().split('T')[0];
const items=D.todos.filter(t=>!t.dueDate||t.dueDate<=tk).slice(0,8);
document.getElementById('pomoTodoList').innerHTML=items.length?items.map(t=>`<div class="pomo-todo-item ${pomoTaskId===t.id?'selected':''}" onclick="setPomoTask(${t.id})"><div class="todo-dot ${t.priority}"></div><div class="todo-text">${escHtml(t.text)}</div></div>`).join(''):'<div class="empty-state">'+'Görev yok'+'</div>';
}
function setPomoTask(id){
if(pomoTaskId===id){pomoTaskId=null;document.getElementById('pomoTaskLbl').textContent='Görev seçmek için aşağıya tıkla';}
else{pomoTaskId=id;const t=D.todos.find(x=>x.id===id);if(t)document.getElementById('pomoTaskLbl').textContent='\ud83c\udfaf '+t.text;}
renderPomoTodos();
}
function selKanbanP(p){kanbanPriority=p;document.querySelectorAll('[data-kp]').forEach(el=>el.classList.toggle('sel',el.dataset.kp===p));}
function openKanbanAdd(){openModal('kanbanAddModal');}
function saveKanbanCard(){const text=document.getElementById('kanbanAddText').value.trim();const col=document.getElementById('kanbanAddCol').value;if(!text)return;D.kanban[col].push({id:Date.now(),text,priority:kanbanPriority,createdAt:new Date().toISOString()});saveData();closeModal('kanbanAddModal');document.getElementById('kanbanAddText').value='';renderKanban();showToast('Kart eklendi');}
function moveKanbanCard(id,fromCol,dir){const cols=['todo','doing','done'];const fi=cols.indexOf(fromCol);const ti=fi+dir;if(ti<0||ti>2)return;const idx=D.kanban[fromCol].findIndex(c=>c.id===id);if(idx===-1)return;const card=D.kanban[fromCol].splice(idx,1)[0];D.kanban[cols[ti]].push(card);saveData();renderKanban();}
function syncKanbanFromTodos(){
const notInKanban=D.todos.filter(t=>!Object.values(D.kanban).some(col=>col.some(c=>c.id===t.id)));
if(!notInKanban.length){showToast('Görevlerden Aktar'+': OK');return;}
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
const vs=typeof getViewStyle==='function'?getViewStyle('kanban'):'columns';
if(vs==='swim'){
// Swim lane: öncelik bazlı yatay satırlar
let html='';
['easy','mid','hard'].forEach(p=>{
const allCards=[].concat(D.kanban.todo.filter(c=>c.priority===p),D.kanban.doing.filter(c=>c.priority===p),D.kanban.done.filter(c=>c.priority===p));
html+=`<div style="background:var(--bg2);border:1px solid var(--border);border-radius:12px;padding:12px;margin-bottom:10px;">
<div style="display:flex;align-items:center;gap:6px;margin-bottom:8px;"><div style="width:8px;height:8px;border-radius:50%;background:${clr[p]};"></div><span style="font-size:.74rem;font-weight:500;color:${clr[p]};">${lbl[p]}</span><span style="font-size:.56rem;color:var(--text3);font-family:JetBrains Mono,monospace;margin-left:auto;">${allCards.length}</span></div>
<div style="display:flex;gap:6px;overflow-x:auto;padding-bottom:4px;">`;
if(!allCards.length)html+='<div style="font-size:.64rem;color:var(--text3);padding:8px;">Boş</div>';
allCards.forEach(card=>{
const colId=D.kanban.todo.includes(card)?'todo':D.kanban.doing.includes(card)?'doing':'done';
const colLbl=colId==='todo'?'Yapılacak':colId==='doing'?'Devam Eden':'Bitti';
html+=`<div style="min-width:140px;background:var(--bg3);border:1px solid var(--border);border-radius:8px;padding:8px;flex-shrink:0;">
<div style="font-size:.68rem;color:var(--text);margin-bottom:4px;">${escHtml(card.text)}</div>
<div style="font-size:.48rem;color:var(--text3);background:var(--bg2);display:inline-block;padding:1px 5px;border-radius:3px;">${colLbl}</div>
<div style="display:flex;gap:3px;margin-top:4px;">
${colId!=='todo'?`<button class="kmb" onclick="moveKanbanCard(${card.id},'${colId}',-1)" style="font-size:.5rem;padding:2px 5px;">←</button>`:''}
${colId!=='done'?`<button class="kmb" onclick="moveKanbanCard(${card.id},'${colId}',1)" style="font-size:.5rem;padding:2px 5px;">→</button>`:''}
<button onclick="deleteKanbanCard(${card.id},'${colId}')" style="font-size:.5rem;padding:2px 5px;background:none;border:1px solid var(--border);border-radius:4px;cursor:pointer;color:var(--text3);margin-left:auto;">✕</button>
</div></div>`;
});
html+='</div></div>';
});
document.getElementById('kanbanBoard').innerHTML=html;
return;
} else if(vs==='compact'){
// Kompakt: tek liste
let html='<div style="display:flex;flex-direction:column;gap:4px;">';
cols.forEach(col=>{
D.kanban[col.id].forEach(card=>{
html+=`<div style="display:flex;align-items:center;gap:8px;padding:8px 10px;background:var(--bg2);border-radius:8px;border:1px solid var(--border);">
<div style="width:6px;height:6px;border-radius:50%;background:${clr[card.priority]};flex-shrink:0;"></div>
<span style="flex:1;font-size:.74rem;color:var(--text);overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">${escHtml(card.text)}</span>
<span style="font-size:.48rem;color:var(--text3);background:var(--bg3);padding:1px 5px;border-radius:3px;flex-shrink:0;">${col.label}</span>
${col.id!=='done'?`<button class="kmb" onclick="moveKanbanCard(${card.id},'${col.id}',1)" style="font-size:.5rem;padding:2px 6px;">→</button>`:''}
<button onclick="deleteKanbanCard(${card.id},'${col.id}')" style="background:none;border:none;cursor:pointer;color:var(--text3);font-size:.66rem;padding:2px;">✕</button>
</div>`;
});
});
html+='</div>';
if(!(D.kanban.todo.length+D.kanban.doing.length+D.kanban.done.length))html='<div class="empty-state">Kanban boş</div>';
document.getElementById('kanbanBoard').innerHTML=html;
return;
}
// Default: columns
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
function renderWeekly(){
const now=new Date();
const ws=new Date(now);ws.setDate(now.getDate()-((now.getDay()+6)%7));ws.setHours(0,0,0,0);
const we=new Date(ws);we.setDate(ws.getDate()+7);
const todayKey=now.toISOString().split('T')[0];
const cw=D.completedTodos.filter(t=>new Date(t.completedAt)>=ws&&new Date(t.completedAt)<we);
const dw=D.diary.filter(e=>new Date(e.createdAt)>=ws&&new Date(e.createdAt)<we);
const nw=D.notes.filter(n=>new Date(n.createdAt)>=ws&&new Date(n.createdAt)<we);
const streak=calcStreak();
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
const weeklyTrend=[];
for(let w=0;w<4;w++){
const wStart=new Date(ws);wStart.setDate(ws.getDate()-w*7);
const wEnd=new Date(wStart);wEnd.setDate(wStart.getDate()+7);
weeklyTrend.unshift(D.completedTodos.filter(t=>{const d=new Date(t.completedAt);return d>=wStart&&d<wEnd;}).length);
}
const byPrio={easy:0,mid:0,hard:0};
cw.forEach(t=>byPrio[t.priority||'mid']++);
const prioTotal=cw.length||1;
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
let s=0;
const now=new Date();
function localDateStr(date){
const y=date.getFullYear();
const m=String(date.getMonth()+1).padStart(2,'0');
const d2=String(date.getDate()).padStart(2,'0');
return y+'-'+m+'-'+d2;
}
function hasActivityOn(dk){
return D.completedTodos.some(t=>{
if(!t.completedAt)return false;
const d=new Date(t.completedAt);
return localDateStr(d)===dk;
})||D.diary.some(e=>{
if(!e.createdAt)return false;
const d=new Date(e.createdAt);
return localDateStr(d)===dk;
})||D.notes.some(n=>{
if(!n.createdAt)return false;
const d=new Date(n.createdAt);
return localDateStr(d)===dk;
});
}
for(let i=0;i<365;i++){
const d=new Date(now);
d.setDate(now.getDate()-i);
const dk=localDateStr(d);
if(hasActivityOn(dk)){s++;}
else if(i===0){
continue;
}
else{break;}
}
return s;
}
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
saveData();closeModal('readingAddModal');renderReading();showToast(t('readingAdded'));
}
function cycleReadingStatus(id){const item=D.reading.find(r=>r.id===id);if(!item)return;const cycle={toread:'reading',reading:'done',done:'toread'};item.status=cycle[item.status];saveData();renderReading();}
function renderReading(){
const cols=[
{key:'reading',lbl:'\ud83d\udcd6 '+'Okunuyor',clr:'var(--accent2)'},
{key:'toread',lbl:'\ud83d\udccc '+'Okunacak',clr:'var(--text3)'},
{key:'done',lbl:'\u2705 '+'Bitti',clr:'var(--easy)'},
];
const typeIco={book:'\ud83d\udcda',article:'\ud83d\udcc4',paper:'\ud83d\udd2c',other:'\ud83d\udcce'};
const vs=typeof getViewStyle==='function'?getViewStyle('reading'):'grid';
if(vs==='list'){
// Liste görünümü
let html='';
cols.forEach(col=>{
const items=D.reading.filter(r=>r.status===col.key);
if(!items.length)return;
html+=`<div style="margin-bottom:14px;"><div style="font-size:.72rem;font-weight:500;color:${col.clr};margin-bottom:8px;">${col.lbl} (${items.length})</div>`;
items.forEach(item=>{
const ico=typeIco[item.type||'book']||'\ud83d\udcda';
const pct=item.pages?Math.min(100,Math.round((item.pagesRead||0)/item.pages*100)):0;
html+=`<div style="display:flex;align-items:center;gap:10px;padding:10px 12px;background:var(--bg2);border:1px solid var(--border);border-radius:10px;margin-bottom:6px;">
<span style="font-size:1rem;">${ico}</span>
<div style="flex:1;min-width:0;">
<div style="font-size:.78rem;color:var(--text);overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">${escHtml(item.title)}</div>
${item.author?`<div style="font-size:.58rem;color:var(--text3);">${escHtml(item.author)}</div>`:''}
${item.pages&&col.key==='reading'?`<div style="margin-top:4px;background:var(--bg3);border-radius:3px;height:3px;overflow:hidden;"><div style="height:100%;width:${pct}%;background:var(--accent);border-radius:3px;"></div></div>`:''}
</div>
<div style="display:flex;gap:4px;">
<button onclick="cycleReadingStatus(${item.id})" style="background:none;border:1px solid var(--border);border-radius:5px;cursor:pointer;color:var(--text3);width:24px;height:24px;display:flex;align-items:center;justify-content:center;font-size:.6rem;">↕</button>
<button onclick="deleteReadingItem(${item.id})" style="background:none;border:1px solid var(--border);border-radius:5px;cursor:pointer;color:var(--text3);width:24px;height:24px;display:flex;align-items:center;justify-content:center;font-size:.6rem;">✕</button>
</div>
</div>`;
});
html+='</div>';
});
if(!D.reading.length)html='<div class="empty-state">Okuma listesi boş</div>';
document.getElementById('readingList').innerHTML=html;
updateReadingTodayCard();
return;
} else if(vs==='shelf'){
// Raf görünümü: kitap sırtı tarzı
let html='<div style="display:flex;flex-wrap:wrap;gap:8px;">';
D.reading.forEach(item=>{
const ico=typeIco[item.type||'book']||'\ud83d\udcda';
const statusClr=item.status==='reading'?'var(--accent2)':item.status==='done'?'var(--easy)':'var(--text3)';
const pct=item.pages?Math.min(100,Math.round((item.pagesRead||0)/item.pages*100)):0;
html+=`<div onclick="openReadingEdit(${item.id})" style="width:90px;background:var(--bg2);border:1px solid var(--border);border-radius:10px;padding:12px 8px;text-align:center;cursor:pointer;position:relative;overflow:hidden;transition:all .2s;" onmouseover="this.style.borderColor='var(--accent)'" onmouseout="this.style.borderColor='var(--border)'">
<div style="position:absolute;bottom:0;left:0;right:0;height:${pct}%;background:${statusClr}08;transition:height .3s;"></div>
<div style="font-size:1.4rem;margin-bottom:6px;">${ico}</div>
<div style="font-size:.58rem;color:var(--text);line-height:1.3;overflow:hidden;display:-webkit-box;-webkit-line-clamp:3;-webkit-box-orient:vertical;margin-bottom:4px;">${escHtml(item.title)}</div>
<div style="font-size:.44rem;color:${statusClr};font-family:JetBrains Mono,monospace;">${item.status==='reading'?pct+'%':item.status==='done'?'Bitti':'Okunacak'}</div>
</div>`;
});
if(!D.reading.length)html='<div class="empty-state">Okuma listesi boş</div>';
else html+='</div>';
document.getElementById('readingList').innerHTML=html;
updateReadingTodayCard();
return;
}
// Default: grid (3 sütun)
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
saveData();renderReading();showToast(t('readingDeleted'));
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
if(dayLessons.length){dayLessons.forEach(l=>{html+=`<div class="sched-lesson"><div class="sched-color-bar" style="background:${l.color}"></div><div style="flex:1"><div class="sched-lesson-name">${escHtml(l.name)}</div>${l.room||l.sub?`<div class="sched-lesson-room">${escHtml(l.room||l.sub)}</div>`:''}</div>${l.link?`<a href="${escHtml(l.link)}" target="_blank" style="color:var(--accent2);font-size:.62rem;text-decoration:none;padding:2px 6px;border:1px solid rgba(124,111,247,.3);border-radius:5px;flex-shrink:0;">\ud83d\udd17</a>`:''}<div class="sched-lesson-time">${l.start||''}${l.start&&l.end?' – ':'' }${l.end||''}</div><button onclick="openScheduleEdit(${l.id})" style="background:none;border:none;cursor:pointer;color:var(--text3);padding:3px;border-radius:5px;flex-shrink:0;" title="Düzenle"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width:12px;height:12px;"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg></button><button class="sched-delete-btn" onclick="deleteScheduleItem(${l.id})">✕</button></div>`});}
else{html+=`<div style="padding:8px 12px;font-size:.68rem;color:var(--text3);font-style:italic;">${'Ders yok'}</div>`;}
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
function openExamAdd(){document.getElementById('examNameInput').value='';document.getElementById('examDateInput').value='';document.getElementById('examTimeInput').value='';document.getElementById('examNoteInput').value='';document.querySelector('[name="examType"][value="exam"]').checked=true;document.querySelectorAll('.exam-type-opt').forEach(el=>{el.classList.toggle('sel',el.querySelector('input').value==='exam');});openModal('examAddModal');}
document.addEventListener('change',e=>{if(e.target.name==='examType'){document.querySelectorAll('.exam-type-opt').forEach(el=>el.classList.toggle('sel',el.querySelector('input')===e.target));}});
function saveExamItem(){
const name=document.getElementById('examNameInput').value.trim();
if(!name)return;
const type=document.querySelector('[name="examType"]:checked')?.value||'exam';
D.exams.push({id:Date.now(),name,date:document.getElementById('examDateInput').value,time:document.getElementById('examTimeInput').value,type,note:document.getElementById('examNoteInput').value.trim(),createdAt:new Date().toISOString()});
saveData();closeModal('examAddModal');renderExams();showToast(t('examAdded'));
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
function saveQuickCapture(){const text=document.getElementById('qcInput').value.trim();if(!text)return;D.notes.unshift({id:Date.now(),title:'Hızlı Not',content:text,media:[],tags:['hızlı'],createdAt:new Date().toISOString()});saveData();document.getElementById('qcInput').value='';showToast('Notlara kaydedildi ✦');renderNotes();}
function exportData(){const d=JSON.parse(JSON.stringify(D));const blob=new Blob([JSON.stringify(d,null,2)],{type:'application/json'});const a=document.createElement('a');const _u1=URL.createObjectURL(blob);a.href=_u1;a.download=`capsula_yedek_${new Date().toISOString().split('T')[0]}.json`;a.click();URL.revokeObjectURL(_u1);showToast('Dışa aktarıldı \ud83d\udcc1');}
function requestNotif(){if('Notification' in window)Notification.requestPermission().then(p=>showToast(p==='granted'?'Bildirimler aktif ✓':'İzin reddedildi'));else showToast('Tarayıcı desteklemiyor');}
function renderPro(){
const tk=new Date().toISOString().split('T')[0];
const items=D.todos.filter(t=>!t.dueDate||t.dueDate===tk);
const clr={easy:'var(--easy)',mid:'var(--mid)',hard:'var(--hard)'};
document.getElementById('proTodayList').innerHTML=items.length?items.map(t=>`<div class="dash-todo-row"><div class="dash-todo-dot" style="background:${clr[t.priority]}"></div><div class="dash-todo-text">${escHtml(t.text)}</div></div>`).join(''):'<div class="empty-state" style="padding:20px 0">Bugün için görev yok.</div>';
}
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
function runSplash(onDone){
const el=document.getElementById('splashScreen');
const textEl=document.getElementById('splashText');
const cursor=document.getElementById('splashCursor');
const tagline=document.getElementById('splashTagline');
const barWrap=document.getElementById('splashBarWrap');
const bar=document.getElementById('splashBar');
const particles=document.getElementById('splashParticles');
for(let i=0;i<22;i++){
const p=document.createElement('div');
p.className='splash-particle';
p.style.cssText=`left:${Math.random()*100}%;top:${40+Math.random()*40}%;animation-duration:${1.8+Math.random()*2.2}s;animation-delay:${Math.random()*1.5}s;width:${1+Math.random()*3}px;height:${1+Math.random()*3}px;opacity:0;`;
particles.appendChild(p);
}
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
const TOUR_STEPS=[
{selector:'#navGlass',title:'3 Farklı Mod',desc:'Alt menüden sayfalar arasında geçiş yap. Drawer menüden modu değiştirebilirsin.',side:'top',round:false},
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
var step=0;
var overlay=document.createElement('div');
overlay.id='onboardingOverlay';
overlay.style.cssText='position:fixed;inset:0;z-index:9000;background:var(--bg);display:flex;align-items:center;justify-content:center;padding:20px;';
function renderStep(){
var steps=[
// Step 0: Hoş geldin
'<div style="text-align:center;max-width:340px;">'
+'<div style="font-size:3rem;margin-bottom:16px;">✦</div>'
+'<div style="font-size:1.4rem;font-weight:600;color:var(--text);margin-bottom:8px;">Capsula\'ya Hoş Geldin!</div>'
+'<div style="font-size:.82rem;color:var(--text2);line-height:1.7;margin-bottom:24px;">Görevler, notlar, günlük, pomodoro, alışkanlıklar ve daha fazlası — hepsi burada.</div>'
+'<button onclick="onboardNext()" style="width:100%;padding:14px;background:linear-gradient(135deg,var(--accent),rgba(124,111,247,.8));border:none;border-radius:12px;color:#fff;font-family:Sora,sans-serif;font-size:.9rem;cursor:pointer;">Başlayalım →</button>'
+'</div>',
// Step 1: İsim
'<div style="text-align:center;max-width:340px;">'
+'<div style="font-size:2.5rem;margin-bottom:16px;">👋</div>'
+'<div style="font-size:1.1rem;font-weight:500;color:var(--text);margin-bottom:6px;">Adın ne?</div>'
+'<div style="font-size:.72rem;color:var(--text3);margin-bottom:16px;">Sana nasıl hitap edelim?</div>'
+'<input type="text" id="obName" placeholder="Adın..." style="width:100%;background:var(--bg3);border:1px solid var(--border);border-radius:10px;padding:14px;font-family:Sora,sans-serif;font-size:.92rem;color:var(--text);outline:none;text-align:center;margin-bottom:16px;box-sizing:border-box;">'
+'<button onclick="onboardSaveName()" style="width:100%;padding:14px;background:linear-gradient(135deg,var(--accent),rgba(124,111,247,.8));border:none;border-radius:12px;color:#fff;font-family:Sora,sans-serif;font-size:.9rem;cursor:pointer;">Devam →</button>'
+'</div>',
// Step 2: Tema seç
'<div style="text-align:center;max-width:360px;">'
+'<div style="font-size:2.5rem;margin-bottom:16px;">🎨</div>'
+'<div style="font-size:1.1rem;font-weight:500;color:var(--text);margin-bottom:6px;">Tema seç</div>'
+'<div style="font-size:.72rem;color:var(--text3);margin-bottom:16px;">İstediğin zaman değiştirebilirsin</div>'
+'<div style="display:grid;grid-template-columns:repeat(4,1fr);gap:8px;margin-bottom:16px;">'
+'<div onclick="applyTheme(\'default\');this.parentElement.querySelectorAll(\'div\').forEach(d=>d.style.borderColor=\'transparent\');this.style.borderColor=\'var(--accent)\'" style="height:48px;border-radius:10px;background:linear-gradient(135deg,#0d0d12,#7c6ff7);cursor:pointer;border:2px solid var(--accent);"></div>'
+'<div onclick="applyTheme(\'midnight\');this.parentElement.querySelectorAll(\'div\').forEach(d=>d.style.borderColor=\'transparent\');this.style.borderColor=\'var(--accent)\'" style="height:48px;border-radius:10px;background:linear-gradient(135deg,#050508,#818cf8);cursor:pointer;border:2px solid transparent;"></div>'
+'<div onclick="applyTheme(\'forest\');this.parentElement.querySelectorAll(\'div\').forEach(d=>d.style.borderColor=\'transparent\');this.style.borderColor=\'var(--accent)\'" style="height:48px;border-radius:10px;background:linear-gradient(135deg,#060e08,#4ade80);cursor:pointer;border:2px solid transparent;"></div>'
+'<div onclick="applyTheme(\'sunset\');this.parentElement.querySelectorAll(\'div\').forEach(d=>d.style.borderColor=\'transparent\');this.style.borderColor=\'var(--accent)\'" style="height:48px;border-radius:10px;background:linear-gradient(135deg,#12080a,#f472b6);cursor:pointer;border:2px solid transparent;"></div>'
+'<div onclick="applyTheme(\'ocean\');this.parentElement.querySelectorAll(\'div\').forEach(d=>d.style.borderColor=\'transparent\');this.style.borderColor=\'var(--accent)\'" style="height:48px;border-radius:10px;background:linear-gradient(135deg,#030d14,#38bdf8);cursor:pointer;border:2px solid transparent;"></div>'
+'<div onclick="applyTheme(\'sand\');this.parentElement.querySelectorAll(\'div\').forEach(d=>d.style.borderColor=\'transparent\');this.style.borderColor=\'var(--accent)\'" style="height:48px;border-radius:10px;background:linear-gradient(135deg,#0f0d08,#fbbf24);cursor:pointer;border:2px solid transparent;"></div>'
+'<div onclick="applyTheme(\'light\');this.parentElement.querySelectorAll(\'div\').forEach(d=>d.style.borderColor=\'transparent\');this.style.borderColor=\'var(--accent)\'" style="height:48px;border-radius:10px;background:linear-gradient(135deg,#f8f9fa,#7c6ff7);cursor:pointer;border:2px solid transparent;"></div>'
+'<div onclick="applyTheme(\'light-warm\');this.parentElement.querySelectorAll(\'div\').forEach(d=>d.style.borderColor=\'transparent\');this.style.borderColor=\'var(--accent)\'" style="height:48px;border-radius:10px;background:linear-gradient(135deg,#fffbeb,#f59e0b);cursor:pointer;border:2px solid transparent;"></div>'
+'</div>'
+'<button onclick="onboardNext()" style="width:100%;padding:14px;background:linear-gradient(135deg,var(--accent),rgba(124,111,247,.8));border:none;border-radius:12px;color:#fff;font-family:Sora,sans-serif;font-size:.9rem;cursor:pointer;">Devam →</button>'
+'</div>',
// Step 3: İlk görev
'<div style="text-align:center;max-width:340px;">'
+'<div style="font-size:2.5rem;margin-bottom:16px;">✅</div>'
+'<div style="font-size:1.1rem;font-weight:500;color:var(--text);margin-bottom:6px;">İlk görevini yaz</div>'
+'<div style="font-size:.72rem;color:var(--text3);margin-bottom:16px;">Bugün ne yapmak istiyorsun?</div>'
+'<input type="text" id="obTask" placeholder="örn: Kitap oku, spor yap..." style="width:100%;background:var(--bg3);border:1px solid var(--border);border-radius:10px;padding:14px;font-family:Sora,sans-serif;font-size:.92rem;color:var(--text);outline:none;text-align:center;margin-bottom:16px;box-sizing:border-box;">'
+'<button onclick="onboardSaveTask()" style="width:100%;padding:14px;background:linear-gradient(135deg,var(--accent),rgba(124,111,247,.8));border:none;border-radius:12px;color:#fff;font-family:Sora,sans-serif;font-size:.9rem;cursor:pointer;">Tamamla ✦</button>'
+'<button onclick="onboardFinish()" style="width:100%;padding:10px;background:none;border:none;color:var(--text3);font-size:.72rem;cursor:pointer;margin-top:8px;">Atla</button>'
+'</div>',
];
overlay.innerHTML='<div style="position:absolute;top:20px;right:20px;"><button onclick="onboardFinish()" style="background:none;border:none;color:var(--text3);font-size:.72rem;cursor:pointer;font-family:Sora,sans-serif;">Geç</button></div>'
+'<div style="position:absolute;bottom:30px;display:flex;gap:6px;">'+[0,1,2,3].map(function(i){return '<div style="width:'+(i===step?'20':'8')+'px;height:4px;border-radius:2px;background:'+(i===step?'var(--accent)':'var(--border2)')+';transition:all .3s;"></div>';}).join('')+'</div>'
+steps[step];
}
renderStep();
document.body.appendChild(overlay);
window.onboardNext=function(){step++;if(step>3)onboardFinish();else renderStep();};
window.onboardSaveName=function(){
var name=document.getElementById('obName')?.value.trim();
if(name){D.profile.name=name;saveData();updateProfileUI();}
step++;renderStep();
};
window.onboardSaveTask=function(){
var task=document.getElementById('obTask')?.value.trim();
if(task){D.todos.push({id:Date.now(),text:task,priority:'easy',subtasks:[],createdAt:new Date().toISOString()});saveData();}
onboardFinish();
};
window.onboardFinish=function(){
overlay.remove();
localStorage.setItem('capsula_toured','1');
renderDashboard();renderTodos();
};
}
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
const d=JSON.parse(JSON.stringify(D));
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
if(format==='csv'){
var csvRows=[];
// Görevler
csvRows.push('TÜR,BAŞLIK,ÖNCELİK,TARİH,DURUM,TEKRAR');
D.todos.forEach(function(t){csvRows.push('Görev,"'+escCsv(t.text)+'",'+t.priority+','+(t.dueDate||'')+',Aktif,'+(t.repeat||''));});
D.completedTodos.forEach(function(t){csvRows.push('Görev,"'+escCsv(t.text)+'",'+t.priority+','+(t.completedAt?.split('T')[0]||'')+',Tamamlandı,'+(t.repeat||''));});
csvRows.push('');
// Notlar
csvRows.push('TÜR,BAŞLIK,ETİKETLER,TARİH,İÇERİK');
D.notes.forEach(function(n){csvRows.push('Not,"'+escCsv(n.title||'')+'","'+(n.tags||[]).join('; ')+'",'+fmtDate(n.createdAt)+',"'+escCsv((n.content||'').slice(0,200))+'#');});
csvRows.push('');
// Günlük
csvRows.push('TÜR,BAŞLIK,RUH HALİ,TARİH,İÇERİK');
D.diary.forEach(function(e){csvRows.push('Günlük,"'+escCsv(e.title||'')+'",'+( e.mood||'')+','+fmtDate(e.createdAt)+',"'+escCsv((e.content||'').slice(0,200))+'"');});
csvRows.push('');
// Alışkanlıklar
csvRows.push('ALIŞKANLIK,SERİ');
(D.habits||[]).forEach(function(h){csvRows.push('"'+escCsv(h.name)+'",'+getHabitStreak(h));});
csvRows.push('');
// Okuma
csvRows.push('KİTAP,YAZAR,DURUM,SAYFA,TOPLAM');
D.reading.forEach(function(r){csvRows.push('"'+escCsv(r.title)+'","'+(r.author||'')+'",'+r.status+','+(r.pagesRead||0)+','+(r.pages||0));});
var csvStr=csvRows.join('\n');
var bom='\uFEFF';
var blob=new Blob([bom+csvStr],{type:'text/csv;charset=utf-8'});
var a=document.createElement('a');var u=URL.createObjectURL(blob);a.href=u;a.download='capsula_'+new Date().toISOString().split('T')[0]+'.csv';a.click();URL.revokeObjectURL(u);
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
Object.assign(D,data);
if(data.profile)D.profile=Object.assign({},D.profile,data.profile);
if(!D.calPlans)D.calPlans={};if(!D.kanban)D.kanban={todo:[],doing:[],done:[]};
if(!D.reading)D.reading=[];if(!D.completedTodos)D.completedTodos=[];
if(!D.trash)D.trash=[];if(!D.contentTrash)D.contentTrash=[];
saveData();renderTodos();renderNotes();renderDiary();renderDashboard();renderKanban();renderReading();updTrashBadge();updateReminderBadge();
res.style.color='var(--easy)';res.textContent=`✓ Geri yüklendi — ${D.notes.length} not, ${D.diary.length} günlük, ${D.todos.length} görev`;
showToast('Yedek geri yüklendi ✓');
});
}catch(err){res.style.color='var(--hard)';res.textContent='Hata: Geçersiz yedek dosyası';}
};
reader.readAsText(file);input.value='';
}
function exportData(){exportBackup('json');}
let reminderCheckInterval=null;
function initReminders(){
updateReminderBadge();
if('Notification' in window && Notification.permission==='granted')startReminderInterval();
}
function startReminderInterval(){
if(reminderCheckInterval)clearInterval(reminderCheckInterval);
reminderCheckInterval=setInterval(checkAndFireNotifications,60*1000);
checkAndFireNotifications();
// Periodic Background Sync kaydı (PWA arka plan bildirimi)
if('serviceWorker' in navigator&&'periodicSync' in (navigator.serviceWorker.controller||{})){
navigator.serviceWorker.ready.then(function(reg){
if(reg.periodicSync){
reg.periodicSync.register('capsula-daily-check',{minInterval:12*60*60*1000}).catch(function(){});
}
});
}
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
const now=new Date();
const todayKey=now.toISOString().split('T')[0];
if(localStorage.getItem('capsula_notif_fired')===todayKey)return;
// Sadece 7-22 arası bildirim gönder
if(now.getHours()<7||now.getHours()>22)return;
const streak=calcStreak();
const todayTodos=D.todos.filter(t=>t.dueDate===todayKey);
const overdue=D.todos.filter(t=>{if(!t.dueDate)return false;const d=new Date(t.dueDate);d.setHours(0,0,0,0);return d<new Date().setHours(0,0,0,0);});
const totalActive=D.todos.length;
const habitsToday=(D.habits||[]).length;
const habitsDone=(D.habits||[]).filter(function(h){return h.log&&h.log[todayKey];}).length;
const hr=now.getHours();
const greet=hr<12?'Günaydın':'İyi günler';
let body=greet+' '+D.profile.name.split(' ')[0]+'! ';
if(streak>=3)body+=streak+' günlük serin devam ediyor 🔥 ';
if(todayTodos.length)body+=todayTodos.length+' görev bugün bitmeli. ';
if(overdue.length)body+=overdue.length+' gecikmiş görev var! ';
if(!todayTodos.length&&!overdue.length&&totalActive)body+=totalActive+' aktif görevin var. ';
if(habitsToday&&habitsDone<habitsToday)body+=(habitsToday-habitsDone)+' alışkanlık seni bekliyor 💪';
if(!totalActive&&!habitsToday)body+='Bugün harika bir gün! Yeni bir görev ekle ✨';
try{new Notification('Capsula ✦',{body:body.trim(),icon:'/app/icon-192.png',badge:'/app/icon-192.png'});}catch(e){}
localStorage.setItem('capsula_notif_fired',todayKey);
addNotification(body.trim(),'daily');
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
function escHtml(s){if(!s)return'';return s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');}
function escCsv(s){if(!s)return'';return s.replace(/"/g,'""').replace(/\n/g,' ');}
function fmtDate(iso){try{return new Date(iso).toLocaleDateString('tr-TR',{day:'numeric',month:'short',year:'numeric'});}catch{return iso||'';}}
function fmtDateFull(iso){try{return new Date(iso).toLocaleDateString('tr-TR',{weekday:'long',day:'numeric',month:'long',year:'numeric'});}catch{return iso||'';}}
function fmtTime(iso){try{return new Date(iso).toLocaleTimeString('tr-TR',{hour:'2-digit',minute:'2-digit'});}catch{return '';}}
function showToast(msg){const t=document.getElementById('toast');t.textContent=msg;t.classList.add('show');setTimeout(()=>t.classList.remove('show'),2600);}
function clearAllData(){showConfirm('Tüm veriler silinecek. Emin misin?',()=>{D={todos:[],completedTodos:[],trash:[],contentTrash:[],calPlans:{},notes:[],diary:[],kanban:{todo:[],doing:[],done:[]},reading:[],schedule:[],exams:[],notebook:[],profile:D.profile};saveData();toggleDrawer();renderTodos();renderNotes();renderDiary();renderDashboard();updTrashBadge();renderSchedule();renderExams();renderNotebook();showToast('Veriler silindi');});}
function toggleAcc(id){
const body=document.getElementById(id);
if(!body)return;
const isOpen=body.style.display!=='none';
body.style.display=isOpen?'none':'block';
const header=body.previousElementSibling;
const arrow=header?.querySelector('.acc-arrow');
if(arrow)arrow.classList.toggle('open',!isOpen);
}
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
function setViewStyle(section,style){
localStorage.setItem('capsula_view_'+section,style);
var prefixes={todo:'tv',kanban:'kv',reading:'rv'};
var pre=prefixes[section];
if(pre){document.querySelectorAll('#'+section+'ViewPicker .pomo-style-opt').forEach(function(el){el.classList.toggle('active',el.id===pre+'-'+style);});}
if(section==='todo')renderTodos();
else if(section==='kanban')renderKanban();
else if(section==='reading')renderReading();
showToast('Görünüm değiştirildi');
}
function getViewStyle(section){return localStorage.getItem('capsula_view_'+section)||{todo:'board',kanban:'columns',reading:'grid'}[section]||'board';}
function toggleAutoSync(){
var tog=document.getElementById('autoSyncToggle');
var cur=localStorage.getItem('capsula_auto_sync')==='on';
localStorage.setItem('capsula_auto_sync',cur?'off':'on');
if(tog)tog.classList.toggle('on',!cur);
showToast(cur?'Otomatik senkronizasyon kapatıldı':'Otomatik senkronizasyon açıldı');
}
function initSettingsToggles(){
var curLang=getLang();
var trBtn=document.getElementById('langBtnTr');var enBtn=document.getElementById('langBtnEn');
if(trBtn)trBtn.style.borderColor=curLang==='tr'?'var(--accent)':'transparent';
if(enBtn)enBtn.style.borderColor=curLang==='en'?'var(--accent)':'transparent';
var lngLbl=document.getElementById('currentLangLabel');if(lngLbl)lngLbl.textContent=curLang==='en'?'English':'Türkçe';
if(typeof applyLangToDOM==='function')applyLangToDOM();
const kd=document.getElementById('kanbanAutoDelete');
const ra=document.getElementById('readingAutoArchive');
const sw=document.getElementById('schedWeeklyToggle');
if(kd)kd.classList.toggle('on',localStorage.getItem('capsula_kanban_autodelete')!=='off');
if(ra)ra.classList.toggle('on',localStorage.getItem('capsula_reading_autoarchive')!=='off');
if(sw)sw.classList.toggle('on',localStorage.getItem('capsula_sched_weekly')==='on');
const ps=document.getElementById('ps-'+pomoStyle);
if(ps)ps.classList.add('active');
['todo','kanban','reading'].forEach(function(s){var pre={todo:'tv',kanban:'kv',reading:'rv'}[s];var cur=getViewStyle(s);document.querySelectorAll('#'+s+'ViewPicker .pomo-style-opt').forEach(function(el){el.classList.toggle('active',el.id===pre+'-'+cur);});});
var asToggle=document.getElementById('autoSyncToggle');
if(asToggle)asToggle.classList.toggle('on',localStorage.getItem('capsula_auto_sync')==='on');
var pl=localStorage.getItem('capsula_profile_layout')||'classic';
document.querySelectorAll('#profileLayoutGrid .pomo-style-opt').forEach(function(el){el.classList.toggle('active',el.id==='pl-'+pl);});
var plLbl=document.getElementById('currentLayoutLabel');
if(plLbl){var plLabels={classic:'Klasik',card:'Kart',minimal:'Minimal',hero:'Hero',terminal:'Terminal'};plLbl.textContent=plLabels[pl]||pl;}
}
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
showToast(t('noteAddedQuick'));
};
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
showToast(t('notifCleared'));
}
function checkSmartNotifications(){
const now=new Date();
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
window.addEventListener('load', function() {
var startTimeout = setTimeout(function() {
console.warn('Veri yükleme zaman aşımı, boş başlatılıyor');
_startApp(null);
}, 3000);
loadDataEncrypted().then(function(loaded) {
clearTimeout(startTimeout);
_startApp(loaded);
}).catch(function(err) {
clearTimeout(startTimeout);
console.warn('Veri yükleme hatası:', err);
try {
var raw = localStorage.getItem('capsula_v4');
var loaded = raw ? JSON.parse(raw) : null;
_startApp(loaded);
} catch(e) {
_startApp(null);
}
});
});
function _startApp(loaded) {
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
if(!D.timeCapsules)D.timeCapsules=[];
if(!D.habits)D.habits=[];
if(!D.moodLog)D.moodLog={};
if(!D.goals)D.goals=[];
}
initTheme();
if(typeof applyLangToDOM==='function')applyLangToDOM();
localStorage.setItem('capsula_visited','1');
if(!D.todos.length&&!D.notes.length&&!D.diary.length){
var tmr=new Date();tmr.setDate(tmr.getDate()+1);
D.todos=[
{id:1,text:"Capsula'ya hoş geldin! Bu görevi tamamla ✓",priority:'easy',dueDate:null,createdAt:new Date().toISOString()},
{id:2,text:"Profil fotoğrafını veya avatarını ayarla",priority:'easy',dueDate:null,createdAt:new Date().toISOString()},
{id:3,text:"Bir görev ekle ve not yaz",priority:'mid',dueDate:tmr.toISOString().split('T')[0],createdAt:new Date().toISOString()},
];
D.notes=[{id:101,title:'Capsula Rehberi',content:'Hoş geldin! 🎉\n\nNotlar, görevler, pomodoro ve daha fazlası burada.\n\nSol üstteki ≡ menüden tüm özelliklere ulaşabilirsin.',media:[],tags:['rehber'],createdAt:new Date().toISOString()}];
D.diary=[{id:201,title:'İlk gün',content:'Capsula yolculuğum başlıyor.',mood:'\ud83d\udcab',media:[],tags:[],createdAt:new Date().toISOString()}];
saveData();
}
runSplash(function(){
initApp();
if(localStorage.getItem('capsula_pin')){showPinScreen();}
// Shortcut hash navigasyonu
var hash=window.location.hash.replace('#','');
if(hash&&typeof switchPage==='function'){
setTimeout(function(){switchPage(hash);},500);
}
});
};
if ('serviceWorker' in navigator) {
window.addEventListener('load', () => {
navigator.serviceWorker.register('/app/service-worker.js')
.catch(err => console.warn('SW kayıt hatası:', err));
});
}
var _profileLayout=localStorage.getItem('capsula_profile_layout')||'classic';
function setProfileLayout(layout){
_profileLayout=layout;localStorage.setItem('capsula_profile_layout',layout);
document.querySelectorAll('#profileLayoutGrid .pomo-style-opt').forEach(function(el){el.classList.toggle('active',el.id==='pl-'+layout);});
var lbl=document.getElementById('currentLayoutLabel');
var labels={classic:'Klasik',card:'Kart',minimal:'Minimal',hero:'Hero',terminal:'Terminal'};
if(lbl)lbl.textContent=labels[layout]||layout;
if(document.getElementById('profilePage').classList.contains('open'))openProfilePage();
}
function _getAvatarHtml(p,size,initials){
var av=p.avatarId&&!p.avatar?SYSTEM_AVATARS.find(function(a){return a.id===p.avatarId;}):null;
var bg=av?av.bg:'linear-gradient(135deg,var(--accent),var(--diary))';
var inner=p.avatar?'<img src="'+p.avatar+'" style="width:100%;height:100%;object-fit:cover;border-radius:50%;">':('<span style="font-size:'+(size*0.4)+'px;">'+(av?av.emoji:initials)+'</span>');
return '<div style="width:'+size+'px;height:'+size+'px;border-radius:50%;background:'+bg+';display:flex;align-items:center;justify-content:center;color:#fff;overflow:hidden;box-shadow:0 0 0 3px rgba(124,111,247,.35);cursor:pointer;flex-shrink:0;" onclick="handleIgAvatarClick()">'+inner+'</div>';
}
function _profileStats(){
var streak=calcStreak();
return '<div style="display:flex;gap:0;flex:1;justify-content:space-around;padding-top:4px;">'
+'<div style="text-align:center;"><div style="font-size:1.2rem;font-weight:700;color:var(--text);font-family:JetBrains Mono,monospace;">'+D.completedTodos.length+'</div><div style="font-size:.58rem;color:var(--text3);margin-top:2px;">Görev</div></div>'
+'<div style="text-align:center;"><div style="font-size:1.2rem;font-weight:700;color:var(--text);font-family:JetBrains Mono,monospace;">'+(D.notes.length+D.diary.length)+'</div><div style="font-size:.58rem;color:var(--text3);margin-top:2px;">Not</div></div>'
+'<div style="text-align:center;"><div style="font-size:1.2rem;font-weight:700;color:var(--text);font-family:JetBrains Mono,monospace;">'+streak+'\ud83d\udd25</div><div style="font-size:.58rem;color:var(--text3);margin-top:2px;">Seri</div></div>'
+'</div>';
}
function _profileTabs(){
return '<div style="display:flex;border-bottom:1px solid var(--border);margin-top:16px;">'
+'<button id="igTab0" onclick="switchIgTab(0)" style="flex:1;padding:10px;background:none;border:none;cursor:pointer;font-size:.72rem;color:var(--accent2);border-bottom:2px solid var(--accent);transition:all .2s;font-family:Sora,sans-serif;">Notlar</button>'
+'<button id="igTab1" onclick="switchIgTab(1)" style="flex:1;padding:10px;background:none;border:none;cursor:pointer;font-size:.72rem;color:var(--text3);border-bottom:2px solid transparent;transition:all .2s;font-family:Sora,sans-serif;">Günlük</button>'
+'<button id="igTab2" onclick="switchIgTab(2)" style="flex:1;padding:10px;background:none;border:none;cursor:pointer;font-size:.72rem;color:var(--text3);border-bottom:2px solid transparent;transition:all .2s;font-family:Sora,sans-serif;">Başarılar</button>'
+'</div>';
}
function _profileInfo(p,badge){
return (p.bio?'<div style="font-size:.78rem;font-weight:300;color:var(--text2);line-height:1.6;margin-bottom:6px;white-space:pre-wrap;">'+escHtml(p.bio)+'</div>':'')
+(p.motto?'<div style="font-size:.72rem;font-style:italic;color:var(--text3);padding-left:10px;border-left:2px solid var(--accent);margin-bottom:4px;">"'+escHtml(p.motto)+'"</div>':'');
}
function renderProfileLayout(){
var p=D.profile;
var initials=p.name.split(' ').map(function(w){return w[0]||'';}).join('').slice(0,2).toUpperCase()||'KY';
var badge=BADGES.find(function(b){return b.id===(p.badge||'student');});
var badgeStr=badge?(badge.ico+' '+badge.lbl):'';
var cont=document.getElementById('igProfileContainer');
if(!cont)return;
var layout=_profileLayout;
var html='';
if(layout==='card'){
html='<div style="padding:20px 16px 0;"><div style="background:linear-gradient(145deg,var(--bg2),var(--bg3));border:1px solid var(--border);border-radius:20px;padding:24px;text-align:center;position:relative;overflow:hidden;">'
+'<div style="position:absolute;top:-30px;right:-30px;width:120px;height:120px;border-radius:50%;background:radial-gradient(circle,var(--accent)22,transparent 70%);pointer-events:none;"></div>'
+_getAvatarHtml(p,88,initials).replace('onclick="handleIgAvatarClick()"','onclick="handleIgAvatarClick()" style="'+arguments[0]+';margin:0 auto 12px;"').replace(/style="([^"]*)"/, function(m,s){return 'style="'+s+';margin:0 auto 12px;"';})
+'<div style="font-size:1.1rem;font-weight:600;color:var(--text);margin-bottom:2px;">'+escHtml(p.name||'')+'</div>'
+(p.username?'<div style="font-size:.72rem;color:var(--text3);font-family:JetBrains Mono,monospace;margin-bottom:6px;">@'+escHtml(p.username)+'</div>':'')
+'<div style="font-size:.65rem;color:var(--accent2);margin-bottom:10px;">'+badgeStr+'</div>'
+_profileInfo(p,badge)
+'<div style="display:grid;grid-template-columns:repeat(3,1fr);gap:8px;margin-top:14px;padding-top:14px;border-top:1px solid var(--border);">'
+'<div><div style="font-size:1.3rem;font-weight:700;color:var(--accent2);font-family:JetBrains Mono,monospace;">'+D.completedTodos.length+'</div><div style="font-size:.52rem;color:var(--text3);">Görev</div></div>'
+'<div><div style="font-size:1.3rem;font-weight:700;color:var(--note);font-family:JetBrains Mono,monospace;">'+(D.notes.length+D.diary.length)+'</div><div style="font-size:.52rem;color:var(--text3);">Not</div></div>'
+'<div><div style="font-size:1.3rem;font-weight:700;color:var(--diary);font-family:JetBrains Mono,monospace;">'+calcStreak()+'\ud83d\udd25</div><div style="font-size:.52rem;color:var(--text3);">Seri</div></div>'
+'</div></div>'+_profileTabs()+'</div>';
} else if(layout==='minimal'){
html='<div style="padding:28px 20px 0;display:flex;align-items:center;gap:16px;margin-bottom:12px;">'
+_getAvatarHtml(p,56,initials)
+'<div style="flex:1;"><div style="font-size:1rem;font-weight:600;color:var(--text);">'+escHtml(p.name||'')+'</div>'
+(p.username?'<div style="font-size:.68rem;color:var(--text3);font-family:JetBrains Mono,monospace;">@'+escHtml(p.username)+'</div>':'')
+'<div style="font-size:.6rem;color:var(--accent2);margin-top:2px;">'+badgeStr+'</div></div>'
+'<div style="display:flex;gap:14px;">'
+'<div style="text-align:center;"><div style="font-size:1rem;font-weight:700;color:var(--text);font-family:JetBrains Mono,monospace;">'+D.completedTodos.length+'</div><div style="font-size:.5rem;color:var(--text3);">görev</div></div>'
+'<div style="text-align:center;"><div style="font-size:1rem;font-weight:700;color:var(--text);font-family:JetBrains Mono,monospace;">'+(D.notes.length+D.diary.length)+'</div><div style="font-size:.5rem;color:var(--text3);">not</div></div>'
+'</div></div>'
+'<div style="padding:0 20px;">'+_profileInfo(p,badge)+_profileTabs()+'</div>';
} else if(layout==='hero'){
var heroBg=p.avatar?'url('+p.avatar+')':'linear-gradient(135deg,var(--accent),var(--diary))';
html='<div style="position:relative;height:140px;background:'+heroBg+';background-size:cover;background-position:center;overflow:hidden;">'
+'<div style="position:absolute;inset:0;background:linear-gradient(transparent 40%,var(--bg) 100%);"></div></div>'
+'<div style="padding:0 20px;margin-top:-40px;position:relative;z-index:1;">'
+_getAvatarHtml(p,76,initials)
+'<div style="margin-top:10px;"><div style="font-size:1.1rem;font-weight:600;color:var(--text);">'+escHtml(p.name||'')+'</div>'
+(p.username?'<div style="font-size:.68rem;color:var(--text3);font-family:JetBrains Mono,monospace;margin-bottom:4px;">@'+escHtml(p.username)+'</div>':'')
+'<div style="font-size:.6rem;color:var(--accent2);margin-bottom:8px;">'+badgeStr+'</div>'
+_profileInfo(p,badge)
+_profileStats()+_profileTabs()+'</div></div>';
} else if(layout==='terminal'){
var streak=calcStreak();
html='<div style="padding:20px 16px 0;"><div style="background:#0a0a10;border:1px solid rgba(124,111,247,.2);border-radius:12px;padding:16px;font-family:JetBrains Mono,monospace;font-size:.72rem;line-height:1.9;">'
+'<div style="color:var(--text3);margin-bottom:2px;">capsula@terminal:~$ whoami</div>'
+'<div style="color:var(--accent2);">'+escHtml(p.name||'user')+(p.username?' <span style="color:var(--text3);">(@'+escHtml(p.username)+')</span>':'')+'</div>'
+'<div style="color:var(--text3);margin-top:6px;">capsula@terminal:~$ stats</div>'
+'<div style="color:var(--easy);">tasks_done: <span style="color:var(--text);">'+D.completedTodos.length+'</span></div>'
+'<div style="color:var(--note);">notes: <span style="color:var(--text);">'+(D.notes.length+D.diary.length)+'</span></div>'
+'<div style="color:var(--diary);">streak: <span style="color:var(--text);">'+streak+' \ud83d\udd25</span></div>'
+'<div style="color:var(--accent2);">badge: <span style="color:var(--text);">'+badgeStr+'</span></div>'
+(p.motto?'<div style="color:var(--text3);margin-top:6px;">capsula@terminal:~$ echo motto</div><div style="color:var(--mid);font-style:italic;">"'+escHtml(p.motto)+'"</div>':'')
+(p.bio?'<div style="color:var(--text3);margin-top:6px;">capsula@terminal:~$ cat bio.txt</div><div style="color:var(--text2);">'+escHtml(p.bio)+'</div>':'')
+'<div style="color:var(--text3);margin-top:6px;">capsula@terminal:~$ <span class="splash-cursor" style="animation:blink 1s infinite;">_</span></div>'
+'</div>'+_profileTabs()+'</div>';
} else {
// classic (default)
html='<div style="padding:24px 20px 0;">'
+'<div style="display:flex;align-items:flex-start;gap:20px;margin-bottom:16px;">'
+_getAvatarHtml(p,80,initials)
+_profileStats()
+'</div>'
+'<div style="font-size:1rem;font-weight:600;color:var(--text);margin-bottom:2px;">'+escHtml(p.name||'')+'</div>'
+(p.username?'<div style="font-size:.72rem;color:var(--text3);font-family:JetBrains Mono,monospace;margin-bottom:6px;">@'+escHtml(p.username)+'</div>':'')
+'<div style="font-size:.65rem;color:var(--accent2);margin-bottom:6px;">'+badgeStr+'</div>'
+_profileInfo(p,badge)
+_profileTabs()+'</div>';
}
cont.innerHTML=html;
}
function openProfilePage(){
var p=D.profile;
var titleEl=document.getElementById('profilePageTitle');
if(titleEl)titleEl.textContent=p.username?('@'+p.username):(p.name||'Profil');
renderProfileLayout();
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
if(!D.notes.length){cont.innerHTML='<div style="text-align:center;padding:40px 20px;"><div style="font-size:2rem;margin-bottom:8px;">📝</div><div style="font-size:.82rem;color:var(--text2);margin-bottom:4px;">Henüz not yok</div><div style="font-size:.68rem;color:var(--text3);">İlk notunu yaz!</div></div>';return;}
var html='<div style="display:grid;grid-template-columns:repeat(2,1fr);gap:10px;">';
D.notes.slice(0,12).forEach(function(n){
var tags=(n.tags||[]).slice(0,2).map(function(t){return '<span style="font-size:.48rem;color:'+tagColor(t)+';background:'+tagColor(t)+'15;border-radius:4px;padding:1px 5px;">#'+escHtml(t)+'</span>';}).join(' ');
var hasMedia=n.media&&n.media.length>0;
html+='<div data-nid="'+n.id+'" class="ig-note-thumb" style="background:var(--bg2);border:1px solid var(--border);border-radius:14px;padding:14px;cursor:pointer;display:flex;flex-direction:column;gap:8px;transition:all .2s;position:relative;overflow:hidden;">'
+(hasMedia?'<div style="position:absolute;top:8px;right:8px;font-size:.5rem;color:var(--text3);">📎</div>':'')
+'<div style="font-size:.78rem;font-weight:500;color:var(--text);overflow:hidden;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;line-height:1.4;">'+escHtml(n.title||'Başlıksız')+'</div>'
+'<div style="font-size:.64rem;color:var(--text3);overflow:hidden;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;line-height:1.5;">'+escHtml((n.content||'').slice(0,60))+'</div>'
+(tags?'<div style="display:flex;gap:4px;flex-wrap:wrap;">'+tags+'</div>':'')
+'<div style="font-size:.52rem;color:var(--text3);font-family:JetBrains Mono,monospace;margin-top:auto;">'+fmtDate(n.createdAt)+'</div>'
+'</div>';
});
html+='</div>';
cont.innerHTML=html;
cont.querySelectorAll('.ig-note-thumb').forEach(function(el){
el.addEventListener('click',function(){var nid=parseInt(el.dataset.nid);closeProfilePage();setTimeout(function(){viewEntry('note',nid);},300);});
});
} else if(idx===1){
if(!D.diary.length){cont.innerHTML='<div style="text-align:center;padding:40px 20px;"><div style="font-size:2rem;margin-bottom:8px;">📖</div><div style="font-size:.82rem;color:var(--text2);margin-bottom:4px;">Günlük yok</div><div style="font-size:.68rem;color:var(--text3);">İlk günlüğünü yaz!</div></div>';return;}
var html2='';
D.diary.slice(0,10).forEach(function(e,i){
var preview=(e.content||'').slice(0,80);
html2+='<div data-eid="'+e.id+'" class="ig-diary-item" style="display:flex;align-items:flex-start;gap:14px;padding:16px;background:var(--bg2);border-radius:14px;margin-bottom:10px;cursor:pointer;border:1px solid var(--border);transition:all .2s;position:relative;">'
+'<div style="display:flex;flex-direction:column;align-items:center;gap:2px;flex-shrink:0;">'
+'<span style="font-size:1.5rem;line-height:1;">'+(e.mood||'📖')+'</span>'
+'<div style="font-size:.44rem;color:var(--text3);font-family:JetBrains Mono,monospace;">'+new Date(e.createdAt).toLocaleDateString('tr-TR',{day:'numeric',month:'short'})+'</div>'
+'</div>'
+'<div style="flex:1;min-width:0;">'
+'<div style="font-size:.82rem;font-weight:500;color:var(--text);margin-bottom:4px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">'+escHtml(e.title||'Günlük Girişi')+'</div>'
+(preview?'<div style="font-size:.68rem;color:var(--text3);line-height:1.5;overflow:hidden;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;">'+escHtml(preview)+'</div>':'')
+'</div></div>';
});
cont.innerHTML=html2;
cont.querySelectorAll('.ig-diary-item').forEach(function(el){
el.addEventListener('click',function(){var eid=parseInt(el.dataset.eid);closeProfilePage();setTimeout(function(){viewEntry('diary',eid);},300);});
});
} else {
var streak=calcStreak(),booksRead=D.reading.filter(function(r){return r.status==='done';}).length,todoDone=D.completedTodos.length;
var totalNotes=D.notes.length,totalDiary=D.diary.length,totalHabits=(D.habits||[]).length;
var kanbanDone=(D.kanban.done||[]).length,schedCount=(D.schedule||[]).length;
var capsuleCount=(D.timeCapsules||[]).filter(function(c){return c.opened;}).length;
var ach=[
{icon:'🔥',title:'İlk Kıvılcım',desc:streak+'/1 gün',unlocked:streak>=1,color:'var(--mid)',how:'1 gün aktif ol'},
{icon:'🔥',title:'Seri Ustası',desc:streak+'/3 gün',unlocked:streak>=3,color:'var(--mid)',how:'3 gün arka arkaya aktif ol'},
{icon:'🔥',title:'Alev Topu',desc:streak+'/7 gün',unlocked:streak>=7,color:'var(--hard)',how:'7 gün arka arkaya aktif ol'},
{icon:'🔥',title:'Durdurulamaz',desc:streak+'/30 gün',unlocked:streak>=30,color:'var(--hard)',how:'30 gün arka arkaya aktif ol'},
{icon:'✅',title:'İlk Adım',desc:todoDone+'/1 görev',unlocked:todoDone>=1,color:'var(--easy)',how:'1 görev tamamla'},
{icon:'✅',title:'Üretken',desc:todoDone+'/10 görev',unlocked:todoDone>=10,color:'var(--easy)',how:'10 görev tamamla'},
{icon:'✅',title:'Görev Makinesi',desc:todoDone+'/50 görev',unlocked:todoDone>=50,color:'var(--easy)',how:'50 görev tamamla'},
{icon:'✅',title:'Yüzlerce',desc:todoDone+'/100 görev',unlocked:todoDone>=100,color:'var(--easy)',how:'100 görev tamamla'},
{icon:'📝',title:'İlk Not',desc:totalNotes+'/1 not',unlocked:totalNotes>=1,color:'var(--accent2)',how:'1 not yaz'},
{icon:'📝',title:'Not Ustası',desc:totalNotes+'/10 not',unlocked:totalNotes>=10,color:'var(--accent2)',how:'10 not yaz'},
{icon:'📝',title:'Ansiklopedist',desc:totalNotes+'/50 not',unlocked:totalNotes>=50,color:'var(--accent2)',how:'50 not yaz'},
{icon:'✍️',title:'Günlükçü',desc:totalDiary+'/5 giriş',unlocked:totalDiary>=5,color:'var(--diary)',how:'5 günlük girişi yaz'},
{icon:'✍️',title:'Yansıtıcı',desc:totalDiary+'/20 giriş',unlocked:totalDiary>=20,color:'var(--diary)',how:'20 günlük girişi yaz'},
{icon:'✍️',title:'İç Ses',desc:totalDiary+'/50 giriş',unlocked:totalDiary>=50,color:'var(--diary)',how:'50 günlük girişi yaz'},
{icon:'📚',title:'İlk Kitap',desc:booksRead+'/1 kitap',unlocked:booksRead>=1,color:'var(--note)',how:'1 kitap/makale bitir'},
{icon:'📚',title:'Kitap Kurdu',desc:booksRead+'/5 kitap',unlocked:booksRead>=5,color:'var(--note)',how:'5 kitap/makale bitir'},
{icon:'📚',title:'Kütüphaneci',desc:booksRead+'/15 kitap',unlocked:booksRead>=15,color:'var(--note)',how:'15 kitap/makale bitir'},
{icon:'🍅',title:'Odaklanıcı',desc:'Pomodoro',unlocked:parseInt(localStorage.getItem('capsula_pomo_total')||'0')>=5,color:'var(--mid)',how:'5 pomodoro seansı tamamla'},
{icon:'🍅',title:'Derin Odak',desc:'Pomodoro',unlocked:parseInt(localStorage.getItem('capsula_pomo_total')||'0')>=25,color:'var(--mid)',how:'25 pomodoro seansı tamamla'},
{icon:'💪',title:'Alışkanlık',desc:totalHabits+'/1',unlocked:totalHabits>=1,color:'var(--accent)',how:'1 alışkanlık oluştur'},
{icon:'💪',title:'Disiplinli',desc:totalHabits+'/3',unlocked:totalHabits>=3,color:'var(--accent)',how:'3 alışkanlık oluştur'},
{icon:'📊',title:'Kanban Pro',desc:kanbanDone+'/5 kart',unlocked:kanbanDone>=5,color:'var(--accent2)',how:"5 kanban kartını 'Tamamlandı'ya taşı"},
{icon:'⏳',title:'Zaman Yolcusu',desc:capsuleCount+'/1',unlocked:capsuleCount>=1,color:'var(--diary)',how:'1 zaman kapsülü aç'},
{icon:'🎨',title:'Kişiselleştirici',desc:'Tema',unlocked:(D.profile.theme||'default')!=='default',color:'var(--accent)',how:'Varsayılan dışında bir tema seç'},
{icon:'🔒',title:'Güvenlikçi',desc:'PIN',unlocked:!!localStorage.getItem('capsula_pin'),color:'var(--hard)',how:'PIN kilidi ayarla'},
];
var html3='<div style="display:grid;grid-template-columns:repeat(3,1fr);gap:8px;">';
ach.forEach(function(a,idx){
var bg=a.unlocked?a.color+'12':'var(--bg2)';
var bdr=a.unlocked?a.color+'30':'var(--border)';
html3+='<div onclick="showAchDetail('+idx+')" style="background:'+bg+';border:1px solid '+bdr+';border-radius:14px;padding:14px 8px;text-align:center;opacity:'+(a.unlocked?'1':'.35')+';transition:all .3s;cursor:pointer;">'
+'<div style="font-size:1.4rem;margin-bottom:4px;filter:'+(a.unlocked?'none':'grayscale(1)')+';">'+a.icon+'</div>'
+'<div style="font-size:.64rem;font-weight:500;color:var(--text);">'+a.title+'</div>'
+'<div style="font-size:.48rem;color:'+(a.unlocked?a.color:'var(--text3)')+';margin-top:2px;font-family:JetBrains Mono,monospace;">'+a.desc+'</div>'
+'</div>';
});
cont.innerHTML=html3+'</div>';
window._achList=ach;
}
}
function shareProfileCard(){
var p=D.profile;var streak=calcStreak();
var badge=BADGES.find(function(b){return b.id===(p.badge||'student');})||BADGES[0];
var accent=p.accentVal||'#7c6ff7';
var initials=p.name.split(' ').map(function(w){return w[0]||'';}).join('').slice(0,2).toUpperCase();
var m=document.createElement('div');
m.style.cssText='position:fixed;inset:0;z-index:3600;background:rgba(0,0,0,.75);display:flex;align-items:center;justify-content:center;padding:16px;';
m.innerHTML='<div style="background:var(--bg2);border:1px solid var(--border);border-radius:18px;padding:20px;width:min(360px,95vw);text-align:center;">'
+'<div style="font-size:.68rem;color:var(--text3);font-family:JetBrains Mono,monospace;margin-bottom:14px;">Ekran görüntüsü alarak paylaş</div>'
+'<div style="background:linear-gradient(145deg,#0d0d12,#1c1c28);border-radius:20px;padding:28px;text-align:center;border:1px solid rgba(255,255,255,0.08);position:relative;overflow:hidden;">'
+'<div style="position:absolute;top:-40px;right:-40px;width:160px;height:160px;border-radius:50%;background:radial-gradient(circle,'+accent+'33,transparent 70%);"></div>'
+'<div style="width:64px;height:64px;border-radius:50%;background:linear-gradient(135deg,'+accent+',#f472b6);display:flex;align-items:center;justify-content:center;font-size:1.2rem;font-weight:700;color:#fff;margin:0 auto 12px;box-shadow:0 0 20px '+accent+'55;overflow:hidden;">'
+(p.avatar?'<img src="'+p.avatar+'" style="width:100%;height:100%;object-fit:cover;border-radius:50%;">':initials)
+'</div>'
+'<div style="font-size:1.1rem;font-weight:500;color:#f0eeff;">'+escHtml(p.name)+'</div>'
+(p.username?'<div style="font-size:.64rem;font-family:JetBrains Mono,monospace;color:'+accent+';margin-top:2px;">@'+escHtml(p.username)+'</div>':'')
+'<div style="font-size:.62rem;color:rgba(240,238,255,.5);margin-top:4px;">'+badge.ico+' '+badge.lbl+'</div>'
+(p.motto?'<div style="font-size:.72rem;color:rgba(240,238,255,.4);font-style:italic;margin-top:10px;padding:0 10px;">"'+escHtml(p.motto)+'"</div>':'')
+'<div style="display:grid;grid-template-columns:repeat(3,1fr);gap:8px;margin-top:16px;padding-top:14px;border-top:1px solid rgba(255,255,255,.06);">'
+'<div><div style="font-size:1.2rem;font-weight:700;font-family:JetBrains Mono,monospace;color:'+accent+';">'+D.completedTodos.length+'</div><div style="font-size:.48rem;color:rgba(240,238,255,.3);text-transform:uppercase;letter-spacing:.1em;margin-top:3px;">Görev</div></div>'
+'<div><div style="font-size:1.2rem;font-weight:700;font-family:JetBrains Mono,monospace;color:'+accent+';">'+(D.notes.length+D.diary.length)+'</div><div style="font-size:.48rem;color:rgba(240,238,255,.3);text-transform:uppercase;letter-spacing:.1em;margin-top:3px;">Not</div></div>'
+'<div><div style="font-size:1.2rem;font-weight:700;font-family:JetBrains Mono,monospace;color:'+accent+';">'+streak+'\ud83d\udd25</div><div style="font-size:.48rem;color:rgba(240,238,255,.3);text-transform:uppercase;letter-spacing:.1em;margin-top:3px;">Seri</div></div>'
+'</div>'
+'<div style="margin-top:14px;font-size:.46rem;font-family:JetBrains Mono,monospace;color:rgba(240,238,255,.2);letter-spacing:.15em;">CAPSULA \u2726 '+new Date().toLocaleDateString('tr-TR')+'</div>'
+'</div>'
+'<div style="display:flex;gap:8px;margin-top:14px;">'
+'<button onclick="this.closest(\'div[style*=fixed]\').remove()" style="flex:1;padding:10px;background:var(--bg3);border:1px solid var(--border);border-radius:10px;cursor:pointer;font-family:Sora,sans-serif;font-size:.78rem;color:var(--text2);">Kapat</button>'
+'<button onclick="shareCardNative()" style="flex:1;padding:10px;background:linear-gradient(135deg,var(--accent),rgba(124,111,247,.8));border:none;border-radius:10px;cursor:pointer;font-family:Sora,sans-serif;font-size:.78rem;color:#fff;">Paylaş</button>'
+'</div>'
+'<div style="font-size:.56rem;color:var(--text3);margin-top:8px;">Kartı basılı tut veya ekran görüntüsü al</div>'
+'</div>';
document.body.appendChild(m);
m.addEventListener('click',function(e){if(e.target===m)m.remove();});
}
function shareCardNative(){
if(navigator.share){
navigator.share({title:'Capsula Profilim',text:D.profile.name+' - '+calcStreak()+' günlük seri \ud83d\udd25 | Capsula',url:'https://capsulaapp.com'}).catch(function(){});
} else {
navigator.clipboard.writeText(D.profile.name+' - '+calcStreak()+' günlük seri \ud83d\udd25 | capsulaapp.com').then(function(){showToast('Link kopyalandı ✓');}).catch(function(){showToast('Kopyalanamadı');});
}
}
function showAchDetail(idx){
var a=window._achList&&window._achList[idx];if(!a)return;
var m=document.createElement('div');m.style.cssText='position:fixed;inset:0;z-index:3600;background:rgba(0,0,0,.7);display:flex;align-items:center;justify-content:center;padding:20px;';
m.innerHTML='<div style="background:var(--bg2);border:1px solid '+(a.unlocked?a.color+'40':'var(--border)')+';border-radius:18px;padding:28px 24px;text-align:center;width:min(300px,90vw);">'
+'<div style="font-size:2.5rem;margin-bottom:10px;filter:'+(a.unlocked?'none':'grayscale(1)')+';">'+a.icon+'</div>'
+'<div style="font-size:1rem;font-weight:600;color:var(--text);margin-bottom:4px;">'+a.title+'</div>'
+'<div style="font-size:.72rem;font-family:JetBrains Mono,monospace;color:'+(a.unlocked?a.color:'var(--text3)')+';margin-bottom:12px;">'+a.desc+'</div>'
+'<div style="font-size:.78rem;color:var(--text2);line-height:1.6;margin-bottom:6px;">'+(a.unlocked?'<span style="color:var(--easy);">✓ Kazanıldı!</span>':'<span style="color:var(--text3);">🔒 Kilitli</span>')+'</div>'
+'<div style="font-size:.74rem;color:var(--text3);background:var(--bg3);border-radius:8px;padding:10px;margin-bottom:16px;">💡 '+a.how+'</div>'
+'<button onclick="this.closest(\'div[style]\').parentElement.remove()" style="background:var(--bg3);border:1px solid var(--border);border-radius:9px;padding:8px 20px;cursor:pointer;font-family:Sora,sans-serif;font-size:.78rem;color:var(--text2);">Kapat</button>'
+'</div>';
document.body.appendChild(m);
m.addEventListener('click',function(e){if(e.target===m)m.remove();});
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
showToast(t('profileUpdated'));
}
function openProfile(){openProfilePage();}
function openPrivacyModal(){openModal('privacyModal');}
function openSettingsPage(){initSettingsToggles();initTheme();updateThemeLabel();document.getElementById('settingsPage').classList.add('open');}
function updateThemeLabel(){
var t=D.profile.theme||'default';
var labels={default:'Varsayılan',midnight:'Gece',forest:'Orman',sunset:'Batım',ocean:'Okyanus',sand:'Kum',light:'Aydınlık','light-warm':'Sıcak Aydınlık'};
var el=document.getElementById('currentThemeLabel');
if(el)el.textContent=labels[t]||t;
}
function closeSettingsPage(){document.getElementById('settingsPage').classList.remove('open');}
function handleIgAvatarClick(){
openProfileEditSheet();
setTimeout(function(){
var upload=document.getElementById('avatarUpload2');
if(upload)upload.click();
},420);
}
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
var sheet = document.getElementById('newCapsuleSheet');
sheet.onclick = function(e){ if(e.target === sheet) closeNewCapsuleSheet(); };
var tomorrow = new Date();
tomorrow.setDate(tomorrow.getDate() + 1);
document.getElementById('capsuleDateInput').min = tomorrow.toISOString().split('T')[0];
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
+ 'style="background:rgba(248,113,113,.08);border:1px solid rgba(248,113,113,.2);cursor:pointer;color:var(--hard);padding:6px 8px;border-radius:8px;flex-shrink:0;transition:all .18s;font-size:.62rem;font-family:Sora,sans-serif;display:flex;align-items:center;gap:4px;" '
+ "onmouseover=\"this.style.background='rgba(248,113,113,.18)'\" "
+ "onmouseout=\"this.style.background='rgba(248,113,113,.08)'\" "
+ 'class="cap-del-btn"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width:12px;height:12px;"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/></svg>Sil</button>'
+ '</div>'
+ '</div>';
}).join('');
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
showToast(t('capsuleDeleted'));
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
var notifKey = 'capsule_notif_' + cap.id + '_' + todayKey;
if (daysLeft <= 0 && !localStorage.getItem(notifKey)) {
addNotification('⏰ "' + cap.title + '" zaman kapsülü bugün açılıyor! Hemen bak 🎉', 'capsule');
localStorage.setItem(notifKey, '1');
}
if (daysLeft === 1 && !localStorage.getItem(notifKey + '_1d')) {
addNotification('⏳ "' + cap.title + '" kapsülü yarın açılıyor!', 'capsule');
localStorage.setItem(notifKey + '_1d', '1');
}
});
}
function sealEntry(type, id) {
var arr = type === 'note' ? D.notes : D.diary;
var entry = arr.find(function(e) { return e.id === id; });
if (!entry) return;
if (entry.sealed) {
showConfirm('Mühürü kaldırmak istiyor musun?', function() {
delete entry.sealed;
saveData();
if (type === 'note') renderNotes(); else renderDiary();
showToast('Mühür kaldırıldı');
});
return;
}
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
viewEntry(type, id);
return;
}
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
(function() {
var _origRenderNotes = window.renderNotes || renderNotes;
window._noteTagFilter=window._noteTagFilter||null;
window.filterNotesByTag=function(tag){
window._noteTagFilter=(window._noteTagFilter===tag)?null:tag;
window.renderNotes();
};
window.renderNotes = function() {
var grid = document.getElementById('notes-grid');
var empty = document.getElementById('notes-empty');
var filterEl=document.getElementById('notesTagFilter');
if (!D.notes.length) {
if (grid) grid.innerHTML = '';
if (empty) empty.style.display = 'block';
if(filterEl)filterEl.style.display='none';
return;
}
if (empty) empty.style.display = 'none';
// Tag filter bar
var allTags=[];
D.notes.forEach(function(n){(n.tags||[]).forEach(function(t){if(allTags.indexOf(t)===-1)allTags.push(t);});});
if(filterEl){
if(allTags.length){
filterEl.style.display='block';
filterEl.innerHTML='<button onclick="filterNotesByTag(null)" style="display:inline-block;padding:5px 12px;border-radius:20px;border:1px solid '+(window._noteTagFilter===null?'var(--accent)':'var(--border)')+';background:'+(window._noteTagFilter===null?'rgba(124,111,247,.15)':'transparent')+';color:'+(window._noteTagFilter===null?'var(--accent2)':'var(--text3)')+';font-size:.66rem;font-family:Sora,sans-serif;cursor:pointer;margin-right:6px;transition:all .15s;">Tümü</button>'
+allTags.map(function(tag){var sel=window._noteTagFilter===tag;return '<button onclick="filterNotesByTag(\''+tag+'\')" style="display:inline-block;padding:5px 12px;border-radius:20px;border:1px solid '+(sel?tagColor(tag)+'88':'var(--border)')+';background:'+(sel?tagColor(tag)+'18':'transparent')+';color:'+(sel?tagColor(tag):'var(--text3)')+';font-size:.66rem;font-family:Sora,sans-serif;cursor:pointer;margin-right:6px;transition:all .15s;">#'+escHtml(tag)+'</button>';}).join('');
} else {filterEl.style.display='none';}
}
var notesToRender=window._noteTagFilter?D.notes.filter(function(n){return (n.tags||[]).indexOf(window._noteTagFilter)!==-1;}):D.notes;
if(!notesToRender.length&&window._noteTagFilter){if(grid)grid.innerHTML='<div style="text-align:center;padding:20px;color:var(--text3);font-size:.76rem;">Bu etikette not yok.</div>';return;}
if (grid) {
var _notesData=notesToRender;
grid.innerHTML = _notesData.map(function(n) {
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
grid.querySelectorAll('.note-card').forEach(function(card) {
var nid = parseInt(card.dataset.nid);
var n = D.notes.find(function(x) { return x.id === nid; });
if (!n) return;
card.style.position = 'relative';
var sealBtn = card.querySelector('.seal-btn');
if (sealBtn) {
card.addEventListener('mouseenter', function() { sealBtn.style.opacity = '1'; });
card.addEventListener('mouseleave', function() { sealBtn.style.opacity = '0'; });
card.addEventListener('touchstart', function() { sealBtn.style.opacity = '1'; }, {passive:true});
}
card.querySelectorAll('[data-seal]').forEach(function(btn) {
btn.addEventListener('click', function(e) {
e.stopPropagation();
sealEntry('note', nid);
});
});
card.addEventListener('click', function(e) {
if (e.target.closest('[data-seal]')) return;
if (n.content==='[Çizim Notu]'&&n.media&&n.media.length) {
openCanvasNote(nid);
return;
}
if (n.sealed) {
viewSealedEntry('note', nid);
} else {
viewEntry('note', nid);
}
});
});
}
};
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
+ '<button data-edit-diary="' + e.id + '" style="position:absolute;top:10px;right:12px;background:none;border:1px solid var(--border);border-radius:6px;cursor:pointer;font-size:.58rem;color:var(--text3);padding:3px 7px;opacity:0;transition:opacity .18s;" class="seal-btn">✏️</button>'
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
card.querySelectorAll('[data-edit-diary]').forEach(function(btn) {
btn.addEventListener('click', function(ev) {
ev.stopPropagation();
openDiaryEdit(eid);
});
});
card.addEventListener('click', function(ev) {
if (ev.target.closest('[data-edit-diary]')) return;
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
// ══════════════════════════════════════════════════════
// HABIT TRACKER
// ══════════════════════════════════════════════════════
// ══════════════════════════════════════════════════════
// MOOD TRACKER
// ══════════════════════════════════════════════════════
var MOOD_OPTIONS=[
{emoji:'😊',label:'Harika',color:'#4ade80'},
{emoji:'🙂',label:'İyi',color:'#60a5fa'},
{emoji:'😐',label:'Normal',color:'#fbbf24'},
{emoji:'😔',label:'Kötü',color:'#fb923c'},
{emoji:'😤',label:'Sinirli',color:'#f87171'},
{emoji:'😌',label:'Huzurlu',color:'#a78bfa'},
{emoji:'🤔',label:'Düşünceli',color:'#818cf8'},
{emoji:'😴',label:'Yorgun',color:'#94a3b8'},
];
function setMood(emoji){
if(!D.moodLog)D.moodLog={};
var today=new Date().toISOString().split('T')[0];
D.moodLog[today]=emoji;
saveData();renderMoodTracker();
showToast('Ruh halin kaydedildi '+emoji);
}
function renderMoodTracker(){
if(!D.moodLog)D.moodLog={};
var today=new Date().toISOString().split('T')[0];
var todayMood=D.moodLog[today];
var todayCard=document.getElementById('moodTodayCard');
var calEl=document.getElementById('moodCalendar');
var statsEl=document.getElementById('moodStats');
var summaryEl=document.getElementById('moodSummary');
// Bugünkü mod seçici
if(todayCard){
todayCard.innerHTML='<div style="background:linear-gradient(135deg,rgba(124,111,247,.08),rgba(168,157,254,.04));border:1px solid rgba(124,111,247,.2);border-radius:14px;padding:16px;">'
+'<div style="font-size:.72rem;color:var(--text2);margin-bottom:10px;">'+(todayMood?'Bugün nasıl hissediyorsun? (Değiştir)':'Bugün nasıl hissediyorsun?')+'</div>'
+'<div style="display:flex;gap:6px;flex-wrap:wrap;">'+MOOD_OPTIONS.map(function(m){
var sel=todayMood===m.emoji;
return '<button onclick="setMood(\''+m.emoji+'\')" style="display:flex;flex-direction:column;align-items:center;gap:3px;padding:8px 10px;border-radius:12px;border:2px solid '+(sel?m.color:'transparent')+';background:'+(sel?m.color+'18':'var(--bg3)')+';cursor:pointer;transition:all .15s;">'
+'<span style="font-size:1.4rem;">'+m.emoji+'</span>'
+'<span style="font-size:.5rem;color:'+(sel?m.color:'var(--text3)')+';">'+m.label+'</span>'
+'</button>';
}).join('')+'</div>'
+'</div>';
}
// Aylık takvim grid
if(calEl){
var now=new Date();var year=now.getFullYear();var month=now.getMonth();
var firstDay=new Date(year,month,1).getDay();var daysInMonth=new Date(year,month+1,0).getDate();
var monthNames=['Ocak','Şubat','Mart','Nisan','Mayıs','Haziran','Temmuz','Ağustos','Eylül','Ekim','Kasım','Aralık'];
var html='<div style="background:var(--bg2);border:1px solid var(--border);border-radius:14px;padding:14px;">'
+'<div style="font-size:.78rem;font-weight:500;color:var(--text);margin-bottom:10px;">'+monthNames[month]+' '+year+'</div>'
+'<div style="display:grid;grid-template-columns:repeat(7,1fr);gap:4px;text-align:center;">';
['Pt','Sa','Ça','Pe','Cu','Ct','Pz'].forEach(function(d){html+='<div style="font-size:.48rem;color:var(--text3);padding:2px;">'+d+'</div>';});
var startDay=(firstDay+6)%7;
for(var i=0;i<startDay;i++)html+='<div></div>';
for(var d=1;d<=daysInMonth;d++){
var dk=year+'-'+String(month+1).padStart(2,'0')+'-'+String(d).padStart(2,'0');
var mood=D.moodLog[dk];
var isToday=dk===today;
var moodObj=mood?MOOD_OPTIONS.find(function(m){return m.emoji===mood;}):null;
html+='<div style="aspect-ratio:1;border-radius:8px;display:flex;align-items:center;justify-content:center;font-size:'+(mood?'.9rem':'.56rem')+';'
+'background:'+(mood&&moodObj?moodObj.color+'18':isToday?'rgba(124,111,247,.1)':'transparent')+';'
+'border:1px solid '+(isToday?'var(--accent)':'transparent')+';'
+'color:'+(mood?'inherit':'var(--text3)')+';cursor:default;">'
+(mood||d)+'</div>';
}
html+='</div></div>';
calEl.innerHTML=html;
}
// İstatistikler
if(statsEl){
var entries=Object.keys(D.moodLog);
if(entries.length<2){statsEl.innerHTML='';if(summaryEl)summaryEl.textContent=entries.length+' gün kaydedildi';return;}
var counts={};MOOD_OPTIONS.forEach(function(m){counts[m.emoji]=0;});
entries.forEach(function(k){var e=D.moodLog[k];if(counts[e]!==undefined)counts[e]++;});
var topMood=MOOD_OPTIONS.reduce(function(a,b){return counts[a.emoji]>=counts[b.emoji]?a:b;});
if(summaryEl)summaryEl.textContent=entries.length+' gün kaydedildi · En çok: '+topMood.emoji+' '+topMood.label;
var sHtml='<div style="background:var(--bg2);border:1px solid var(--border);border-radius:14px;padding:14px;">'
+'<div style="font-size:.68rem;font-weight:500;color:var(--text);margin-bottom:10px;">Ruh Hali Dağılımı</div>'
+'<div style="display:flex;flex-direction:column;gap:6px;">';
MOOD_OPTIONS.forEach(function(m){
var c=counts[m.emoji]||0;var pct=entries.length?Math.round(c/entries.length*100):0;
if(!c)return;
sHtml+='<div style="display:flex;align-items:center;gap:8px;">'
+'<span style="font-size:.9rem;width:24px;text-align:center;">'+m.emoji+'</span>'
+'<div style="flex:1;background:var(--bg3);border-radius:4px;height:8px;overflow:hidden;">'
+'<div style="height:100%;width:'+pct+'%;background:'+m.color+';border-radius:4px;transition:width .4s;"></div></div>'
+'<span style="font-size:.58rem;font-family:JetBrains Mono,monospace;color:'+m.color+';width:28px;text-align:right;">'+c+'</span>'
+'</div>';
});
sHtml+='</div></div>';
statsEl.innerHTML=sHtml;
}
}
// ══════════════════════════════════════════════════════
// GOALS (Hedef Belirleme)
// ══════════════════════════════════════════════════════
function openGoalAdd(){
document.getElementById('goalAddModal')&&document.getElementById('goalAddModal').remove();
var m=document.createElement('div');m.id='goalAddModal';
m.style.cssText='position:fixed;inset:0;z-index:3500;background:rgba(0,0,0,.65);display:flex;align-items:center;justify-content:center;padding:20px;';
m.innerHTML='<div style="background:var(--bg2);border:1px solid var(--border);border-radius:16px;padding:22px;width:100%;max-width:360px;">'
+'<button onclick="document.getElementById(\'goalAddModal\').remove()" style="position:absolute;top:10px;right:12px;background:none;border:none;font-size:1.1rem;cursor:pointer;color:var(--text3);">✕</button>'
+'<div style="font-size:.86rem;font-weight:500;color:var(--text);margin-bottom:14px;">🎯 Yeni Hedef</div>'
+'<input type="text" id="goalTitleInput" placeholder="Hedef adı (örn: 10 kitap oku)" style="width:100%;background:var(--bg3);border:1px solid var(--border);border-radius:8px;padding:10px 12px;font-family:Sora,sans-serif;font-size:.84rem;color:var(--text);outline:none;margin-bottom:10px;box-sizing:border-box;">'
+'<div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-bottom:10px;">'
+'<div><div style="font-size:.62rem;color:var(--text3);margin-bottom:3px;">Hedef sayı</div><input type="number" id="goalTargetInput" min="1" value="10" style="width:100%;background:var(--bg3);border:1px solid var(--border);border-radius:8px;padding:8px 10px;font-family:Sora,sans-serif;font-size:.82rem;color:var(--text);outline:none;box-sizing:border-box;"></div>'
+'<div><div style="font-size:.62rem;color:var(--text3);margin-bottom:3px;">Bitiş tarihi</div><input type="date" id="goalDeadlineInput" style="width:100%;background:var(--bg3);border:1px solid var(--border);border-radius:8px;padding:8px 10px;font-family:Sora,sans-serif;font-size:.82rem;color:var(--text);outline:none;box-sizing:border-box;"></div>'
+'</div>'
+'<div style="font-size:.62rem;color:var(--text3);margin-bottom:3px;">Takip türü</div>'
+'<select id="goalTypeInput" style="width:100%;background:var(--bg3);border:1px solid var(--border);border-radius:8px;padding:8px 12px;font-family:Sora,sans-serif;font-size:.8rem;color:var(--text);outline:none;margin-bottom:14px;box-sizing:border-box;">'
+'<option value="manual">Manuel güncelle</option>'
+'<option value="tasks">Tamamlanan görevler</option>'
+'<option value="books">Bitirilen kitaplar</option>'
+'<option value="notes">Yazılan notlar</option>'
+'<option value="diary">Günlük girişleri</option>'
+'<option value="streak">Günlük seri</option>'
+'</select>'
+'<button onclick="saveGoal()" style="width:100%;padding:11px;background:linear-gradient(135deg,var(--accent),rgba(124,111,247,.8));border:none;border-radius:10px;color:#fff;font-family:Sora,sans-serif;font-size:.84rem;cursor:pointer;">Ekle</button>'
+'</div>';
document.body.appendChild(m);
m.addEventListener('click',function(e){if(e.target===m)m.remove();});
}
function saveGoal(){
var title=document.getElementById('goalTitleInput').value.trim();
if(!title){showToast('Hedef adı gir');return;}
if(!D.goals)D.goals=[];
D.goals.push({
id:Date.now(),title:title,
target:parseInt(document.getElementById('goalTargetInput').value)||10,
current:0,
type:document.getElementById('goalTypeInput').value,
deadline:document.getElementById('goalDeadlineInput').value||null,
createdAt:new Date().toISOString()
});
saveData();document.getElementById('goalAddModal').remove();renderGoals();showToast('Hedef eklendi 🎯');
}
function updateGoalProgress(id,val){
var g=(D.goals||[]).find(function(x){return x.id===id;});if(!g)return;
g.current=Math.max(0,Math.min(g.target,val));
if(g.current>=g.target){showToast('🎉 Hedef tamamlandı: '+g.title);addNotification('🎯 "'+g.title+'" hedefini tamamladın!','goal');}
saveData();renderGoals();
}
function deleteGoal(id){
showConfirm('Bu hedefi silmek istiyor musun?',function(){
D.goals=(D.goals||[]).filter(function(x){return x.id!==id;});
saveData();renderGoals();showToast('Hedef silindi');
});
}
function _autoCalcGoal(g){
if(g.type==='tasks')return D.completedTodos.length;
if(g.type==='books')return D.reading.filter(function(r){return r.status==='done';}).length;
if(g.type==='notes')return D.notes.length;
if(g.type==='diary')return D.diary.length;
if(g.type==='streak')return calcStreak();
return g.current;
}
function renderGoals(){
if(!D.goals)D.goals=[];
var cont=document.getElementById('goalsList');if(!cont)return;
if(!D.goals.length){
cont.innerHTML='<div style="text-align:center;padding:30px 20px;"><div style="font-size:2rem;margin-bottom:8px;">🎯</div><div style="font-size:.82rem;color:var(--text2);margin-bottom:4px;">Henüz hedef yok</div><div style="font-size:.68rem;color:var(--text3);">Yukarıdaki "Hedef Ekle" ile başla</div></div>';
return;}
var html='';
D.goals.forEach(function(g){
var cur=g.type==='manual'?g.current:_autoCalcGoal(g);
if(g.type!=='manual')g.current=cur;
var pct=g.target?Math.min(100,Math.round(cur/g.target*100)):0;
var done=pct>=100;
var daysLeft=g.deadline?Math.ceil((new Date(g.deadline)-new Date())/(1000*60*60*24)):null;
html+='<div style="background:var(--bg2);border:1px solid '+(done?'rgba(74,222,128,.3)':'var(--border)')+';border-radius:14px;padding:14px;margin-bottom:10px;">'
+'<div style="display:flex;align-items:flex-start;gap:10px;margin-bottom:10px;">'
+'<div style="font-size:1.3rem;">'+(done?'✅':'🎯')+'</div>'
+'<div style="flex:1;"><div style="font-size:.82rem;font-weight:500;color:var(--text);">'+escHtml(g.title)+'</div>'
+'<div style="font-size:.58rem;color:var(--text3);margin-top:2px;">'+cur+' / '+g.target+(daysLeft!==null?' · '+(daysLeft>0?daysLeft+' gün kaldı':'Süre doldu!'):'')+'</div></div>'
+'<button onclick="deleteGoal('+g.id+')" style="background:none;border:none;cursor:pointer;color:var(--text3);font-size:.7rem;padding:2px;">✕</button>'
+'</div>'
+'<div style="background:var(--bg3);border-radius:6px;height:10px;overflow:hidden;margin-bottom:6px;">'
+'<div style="height:100%;width:'+pct+'%;background:'+(done?'var(--easy)':'linear-gradient(90deg,var(--accent),var(--accent2))')+';border-radius:6px;transition:width .4s;"></div></div>'
+'<div style="display:flex;align-items:center;justify-content:space-between;">'
+'<span style="font-size:.64rem;font-family:JetBrains Mono,monospace;color:'+(done?'var(--easy)':'var(--accent2)')+';">'+pct+'%</span>'
+(g.type==='manual'?'<div style="display:flex;gap:4px;"><button onclick="updateGoalProgress('+g.id+','+(cur-1)+')" style="background:var(--bg3);border:1px solid var(--border);border-radius:6px;padding:3px 8px;cursor:pointer;color:var(--text3);font-size:.7rem;">−</button><button onclick="updateGoalProgress('+g.id+','+(cur+1)+')" style="background:var(--bg3);border:1px solid var(--border);border-radius:6px;padding:3px 8px;cursor:pointer;color:var(--accent2);font-size:.7rem;">+</button></div>':'<span style="font-size:.52rem;color:var(--text3);">Otomatik takip</span>')
+'</div></div>';
});
cont.innerHTML=html;
}
var HABIT_ICONS=['💪','📚','🏃','💧','🧘','🎯','✍️','🎵','🌅','💤','🥗','📵','🚶','💊','🧹','🌿'];
function _todayKey(){return new Date().toISOString().split('T')[0];}
function _getWeekDays(){
var days=[];var now=new Date();
var monday=new Date(now);monday.setDate(now.getDate()-((now.getDay()+6)%7));
for(var i=0;i<7;i++){var d=new Date(monday);d.setDate(monday.getDate()+i);days.push(d.toISOString().split('T')[0]);}
return days;
}
function openHabitAdd(){
document.getElementById('habitAddModal')&&document.getElementById('habitAddModal').remove();
var modal=document.createElement('div');
modal.id='habitAddModal';
modal.style.cssText='position:fixed;inset:0;z-index:3500;background:rgba(0,0,0,.65);display:flex;align-items:center;justify-content:center;padding:20px;';
modal.innerHTML='<div style="background:var(--bg2);border:1px solid var(--border);border-radius:16px;padding:22px;width:100%;max-width:360px;position:relative;">'
+'<button onclick="document.getElementById(\'habitAddModal\').remove()" style="position:absolute;top:10px;right:12px;background:none;border:none;font-size:1.1rem;cursor:pointer;color:var(--text3);">✕</button>'
+'<div style="font-size:.86rem;font-weight:500;color:var(--text);margin-bottom:14px;">Yeni Alışkanlık</div>'
+'<input type="text" id="habitNameInput" placeholder="Alışkanlık adı..." style="width:100%;background:var(--bg3);border:1px solid var(--border);border-radius:8px;padding:10px 12px;font-family:Sora,sans-serif;font-size:.84rem;color:var(--text);outline:none;margin-bottom:10px;box-sizing:border-box;">'
+'<div style="font-size:.66rem;color:var(--text3);margin-bottom:6px;">İkon seç</div>'
+'<div style="display:flex;gap:6px;flex-wrap:wrap;margin-bottom:12px;" id="habitIconPicker">'
+HABIT_ICONS.map(function(ico,i){return '<button onclick="document.getElementById(\'habitIconVal\').value=\''+ico+'\';document.querySelectorAll(\'#habitIconPicker button\').forEach(function(b){b.style.borderColor=\'var(--border)\';});this.style.borderColor=\'var(--accent)\'" style="font-size:1.2rem;background:var(--bg3);border:2px solid '+(i===0?'var(--accent)':'var(--border)')+';border-radius:8px;padding:6px 8px;cursor:pointer;transition:all .15s;">'+ico+'</button>';}).join('')
+'</div>'
+'<input type="hidden" id="habitIconVal" value="'+HABIT_ICONS[0]+'">'
+'<div style="font-size:.66rem;color:var(--text3);margin-bottom:6px;">Hedef (günlük tekrar)</div>'
+'<select id="habitFreqInput" style="width:100%;background:var(--bg3);border:1px solid var(--border);border-radius:8px;padding:8px 12px;font-family:Sora,sans-serif;font-size:.8rem;color:var(--text);outline:none;margin-bottom:14px;box-sizing:border-box;">'
+'<option value="daily">Her gün</option><option value="weekdays">Hafta içi</option><option value="3x">Haftada 3</option></select>'
+'<button onclick="saveHabit()" style="width:100%;padding:11px;background:linear-gradient(135deg,var(--accent),rgba(124,111,247,.8));border:none;border-radius:10px;color:#fff;font-family:Sora,sans-serif;font-size:.84rem;cursor:pointer;">Ekle</button>'
+'</div>';
document.body.appendChild(modal);
modal.addEventListener('click',function(e){if(e.target===modal)modal.remove();});
setTimeout(function(){document.getElementById('habitNameInput').focus();},100);
}
function saveHabit(){
var name=document.getElementById('habitNameInput').value.trim();
if(!name){showToast('Alışkanlık adı gir');return;}
var icon=document.getElementById('habitIconVal').value;
var freq=document.getElementById('habitFreqInput').value;
if(!D.habits)D.habits=[];
D.habits.push({id:Date.now(),name:name,icon:icon,freq:freq,log:{},createdAt:new Date().toISOString()});
saveData();document.getElementById('habitAddModal').remove();renderHabits();showToast(t('habitAdded')+' '+icon);
}
function toggleHabitDay(habitId,dateKey){
if(!D.habits)return;
var h=D.habits.find(function(x){return x.id===habitId;});
if(!h)return;
if(!h.log)h.log={};
h.log[dateKey]=!h.log[dateKey];
saveData();renderHabits();
}
function deleteHabit(id){
showConfirm('Bu alışkanlığı silmek istiyor musun?',function(){
D.habits=D.habits.filter(function(h){return h.id!==id;});
saveData();renderHabits();showToast(t('habitDeleted'));
});
}
function getHabitStreak(habit){
var s=0;var d=new Date();
for(var i=0;i<365;i++){
var dk=new Date(d);dk.setDate(d.getDate()-i);
var key=dk.toISOString().split('T')[0];
if(habit.log&&habit.log[key])s++;
else if(i>0)break;
}
return s;
}
function renderHabits(){
if(!D.habits)D.habits=[];
var cont=document.getElementById('habitsList');
var weekInfo=document.getElementById('habitsWeekGrid');
var streakInfo=document.getElementById('habitsStreakInfo');
if(!cont)return;
var today=_todayKey();
var weekDays=_getWeekDays();
var dayLabels=['Pt','Sa','Ça','Pe','Cu','Ct','Pz'];
var totalDone=0;var totalPossible=0;
D.habits.forEach(function(h){weekDays.forEach(function(dk){totalPossible++;if(h.log&&h.log[dk])totalDone++;});});
if(streakInfo)streakInfo.textContent=D.habits.length?totalDone+'/'+totalPossible+' bu hafta tamamlandı':'';
if(!D.habits.length){
cont.innerHTML='<div style="text-align:center;padding:48px 20px;">'
+'<div style="font-size:2.5rem;margin-bottom:12px;">💪</div>'
+'<div style="font-size:.88rem;color:var(--text2);margin-bottom:6px;">Henüz alışkanlık yok</div>'
+'<div style="font-size:.72rem;color:var(--text3);line-height:1.6;">Yukarıdaki "Ekle" butonu ile<br>ilk alışkanlığını oluştur.</div></div>';
if(weekInfo)weekInfo.innerHTML='';
return;
}
// Week overview grid
var wHtml='<div style="background:var(--bg2);border:1px solid var(--border);border-radius:14px;padding:14px;overflow-x:auto;">';
wHtml+='<table style="width:100%;border-collapse:collapse;"><thead><tr><th style="text-align:left;font-size:.68rem;color:var(--text3);padding:4px 6px;font-weight:400;min-width:90px;"></th>';
weekDays.forEach(function(dk,i){
var isToday=dk===today;
wHtml+='<th style="text-align:center;font-size:.52rem;font-family:JetBrains Mono,monospace;color:'+(isToday?'var(--accent2)':'var(--text3)')+';padding:4px 2px;font-weight:'+(isToday?'600':'400')+';">'+dayLabels[i]+'<br><span style="font-size:.44rem;">'+dk.slice(8)+'</span></th>';
});
wHtml+='</tr></thead><tbody>';
D.habits.forEach(function(h){
wHtml+='<tr><td style="font-size:.72rem;color:var(--text);padding:6px;white-space:nowrap;"><span style="margin-right:4px;">'+h.icon+'</span>'+escHtml(h.name)+'</td>';
weekDays.forEach(function(dk){
var done=h.log&&h.log[dk];
var isToday=dk===today;
var isPast=dk<today;
wHtml+='<td style="text-align:center;padding:4px 2px;">'
+'<button onclick="toggleHabitDay('+h.id+',\''+dk+'\')" style="width:28px;height:28px;border-radius:8px;border:1.5px solid '+(done?'var(--easy)':isToday?'var(--accent)':'var(--border)')+';background:'+(done?'var(--easy)':'transparent')+';cursor:pointer;display:flex;align-items:center;justify-content:center;margin:0 auto;transition:all .15s;">'
+(done?'<svg viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="3" style="width:14px;height:14px;"><polyline points="20 6 9 17 4 12"/></svg>':'')
+'</button></td>';
});
wHtml+='</tr>';
});
wHtml+='</tbody></table></div>';
if(weekInfo)weekInfo.innerHTML=wHtml;
// Habit cards
var cards='';
D.habits.forEach(function(h){
var streak=getHabitStreak(h);
var todayDone=h.log&&h.log[today];
var last7=0;weekDays.forEach(function(dk){if(h.log&&h.log[dk])last7++;});
cards+='<div style="background:var(--bg2);border:1px solid '+(todayDone?'rgba(74,222,128,.25)':'var(--border)')+';border-radius:14px;padding:14px;margin-bottom:10px;display:flex;align-items:center;gap:12px;transition:all .2s;">'
+'<button onclick="toggleHabitDay('+h.id+',\''+today+'\')" style="width:44px;height:44px;border-radius:12px;border:2px solid '+(todayDone?'var(--easy)':'var(--border)')+';background:'+(todayDone?'rgba(74,222,128,.12)':'transparent')+';cursor:pointer;display:flex;align-items:center;justify-content:center;font-size:1.3rem;transition:all .2s;flex-shrink:0;">'
+(todayDone?'<svg viewBox="0 0 24 24" fill="none" stroke="var(--easy)" stroke-width="3" style="width:22px;height:22px;"><polyline points="20 6 9 17 4 12"/></svg>':h.icon)
+'</button>'
+'<div style="flex:1;min-width:0;">'
+'<div style="font-size:.82rem;font-weight:500;color:var(--text);margin-bottom:2px;">'+escHtml(h.name)+'</div>'
+'<div style="display:flex;gap:8px;font-size:.58rem;font-family:JetBrains Mono,monospace;">'
+'<span style="color:'+(streak>=3?'var(--easy)':'var(--text3)')+';">'+streak+' gün seri</span>'
+'<span style="color:var(--text3);">'+last7+'/7 bu hafta</span>'
+'</div>'
+'</div>'
+'<button onclick="deleteHabit('+h.id+')" style="background:none;border:1px solid var(--border);border-radius:8px;cursor:pointer;color:var(--text3);padding:6px;transition:all .15s;" onmouseover="this.style.color=\'var(--hard)\'" onmouseout="this.style.color=\'var(--text3)\'">'
+'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width:14px;height:14px;"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/></svg>'
+'</button>'
+'</div>';
});
cont.innerHTML=cards;
}

// ══════════════════════════════════════════════════════
// BACK BUTTON / HISTORY NAVIGATION
// ══════════════════════════════════════════════════════
(function(){
// İlk state
try{history.replaceState({page:'home'},'',null);}catch(e){}

window.addEventListener('popstate',function(e){
// 1. Açık overlay/modal varsa kapat
var closed=false;

// Fullpage overlay'lar
var overlays=['profilePage','settingsPage','timeCapsulePage','profileEditSheet'];
for(var i=0;i<overlays.length;i++){
var el=document.getElementById(overlays[i]);
if(el&&el.classList.contains('open')){
el.classList.remove('open');
closed=true;
break;
}
}

// Modal overlay'lar
if(!closed){
var modals=document.querySelectorAll('.modal-overlay.open');
if(modals.length){
modals[modals.length-1].classList.remove('open');
closed=true;
}
}

// Editor/View overlay
if(!closed){
var editor=document.getElementById('editorOverlay');
if(editor&&editor.classList.contains('open')){editor.classList.remove('open');closed=true;}
}
if(!closed){
var view=document.getElementById('viewOverlay');
if(view&&view.classList.contains('open')){view.classList.remove('open');closed=true;}
}

// Template overlay
if(!closed){
var tmpl=document.getElementById('templateOverlay');
if(tmpl&&tmpl.classList.contains('open')){tmpl.classList.remove('open');closed=true;}
}

// Drawer açıksa kapat
if(!closed){
var drawer=document.getElementById('drawer');
if(drawer&&drawer.classList.contains('open')){toggleDrawer();closed=true;}
}

// Dinamik modal'lar (JS ile oluşturulanlar)
if(!closed){
var dynModals=['helpPageModal','noteEditModal','diaryEditModal','todoEditModal','schedEditModal','readingEditModal','readingPageModal','contactModal','kanbanImportModal','resetConfirmModal','pomoDurModal','sealPinModal','sealViewModal','goalAddModal','habitAddModal','gdriveRestoreModal'];
for(var j=0;j<dynModals.length;j++){
var dm=document.getElementById(dynModals[j]);
if(dm){dm.remove();closed=true;break;}
}
}

if(closed){
// Kapattık, state'i geri koy ki tekrar geri basınca çalışsın
try{history.pushState({page:curPage},'',null);}catch(ex){}
return;
}

// 2. Sayfa navigasyonu - home'da değilsek home'a git
if(e.state&&e.state.page){
switchPage(e.state.page,true);
} else if(curPage!=='home'){
switchPage('home',true);
try{history.pushState({page:'home'},'',null);}catch(ex){}
} else {
// Ana ekrandayız ve hiçbir şey açık değil - uygulamadan çıkmayı engelle
try{history.pushState({page:'home'},'',null);}catch(ex){}
}
});

// Overlay/modal açılınca history state ekle
var _origOpenModal=window.openModal||function(){};
window.openModal=function(id){
_origOpenModal(id);
try{history.pushState({page:curPage,modal:id},'',null);}catch(e){}
};

// Fullpage overlay'lar açılınca
['openProfilePage','openSettingsPage','openTimeCapsulePage','openProfileEditSheet'].forEach(function(fnName){
var orig=window[fnName];
if(orig){
window[fnName]=function(){
orig.apply(this,arguments);
try{history.pushState({page:curPage,overlay:fnName},'',null);}catch(e){}
};
}
});
})();

// ══════════════════════════════════════════════════════
// TIMER TABS + STOPWATCH + FULLSCREEN
// ══════════════════════════════════════════════════════
function switchTimerTab(tab){
var pomoEl=document.getElementById('pomoSection');
var swEl=document.getElementById('stopwatchSection');
var tabPomo=document.getElementById('timerTabPomo');
var tabSw=document.getElementById('timerTabStopwatch');
if(tab==='pomo'){
if(pomoEl)pomoEl.style.display='block';
if(swEl)swEl.style.display='none';
if(tabPomo){tabPomo.style.background='var(--accent)';tabPomo.style.color='#fff';}
if(tabSw){tabSw.style.background='transparent';tabSw.style.color='var(--text3)';}
} else {
if(pomoEl)pomoEl.style.display='none';
if(swEl)swEl.style.display='block';
if(tabSw){tabSw.style.background='var(--accent)';tabSw.style.color='#fff';}
if(tabPomo){tabPomo.style.background='transparent';tabPomo.style.color='var(--text3)';}
}
}

// Stopwatch
var _swRunning=false,_swStart=0,_swElapsed=0,_swInterval=null,_swLaps=[];
function _fmtSw(ms){
var s=Math.floor(ms/1000);var m=Math.floor(s/60);s=s%60;var cs=Math.floor((ms%1000)/10);
var h=Math.floor(m/60);m=m%60;
if(h>0)return String(h).padStart(2,'0')+':'+String(m).padStart(2,'0')+':'+String(s).padStart(2,'0');
return String(m).padStart(2,'0')+':'+String(s).padStart(2,'0')+'.'+String(cs).padStart(2,'0');
}
function _updateSwDisplay(){
var now=_swRunning?Date.now()-_swStart+_swElapsed:_swElapsed;
var el=document.getElementById('swDisplay');
if(el)el.textContent=_fmtSw(now);
var fs=document.getElementById('fsTimerDisplay');
if(fs&&_fsMode==='stopwatch')fs.textContent=_fmtSw(now);
}
function toggleStopwatch(){
if(_swRunning){
_swElapsed+=Date.now()-_swStart;
_swRunning=false;
clearInterval(_swInterval);
document.getElementById('swIcon').innerHTML='<polygon points="5 3 19 12 5 21 5 3" fill="currentColor"/>';
} else {
_swStart=Date.now();
_swRunning=true;
_swInterval=setInterval(_updateSwDisplay,30);
document.getElementById('swIcon').innerHTML='<rect x="6" y="4" width="4" height="16" fill="currentColor"/><rect x="14" y="4" width="4" height="16" fill="currentColor"/>';
}
_updateFsPlayIcon();
}
function resetStopwatch(){
_swRunning=false;_swElapsed=0;_swLaps=[];
clearInterval(_swInterval);
document.getElementById('swIcon').innerHTML='<polygon points="5 3 19 12 5 21 5 3" fill="currentColor"/>';
_updateSwDisplay();
document.getElementById('swLaps').innerHTML='';
}
function lapStopwatch(){
if(!_swRunning)return;
var now=Date.now()-_swStart+_swElapsed;
var prev=_swLaps.length?_swLaps[_swLaps.length-1].total:0;
_swLaps.push({total:now,split:now-prev});
var el=document.getElementById('swLaps');
if(el){
el.innerHTML=_swLaps.map(function(l,i){
var best=Math.min.apply(null,_swLaps.map(function(x){return x.split;}));
var worst=Math.max.apply(null,_swLaps.map(function(x){return x.split;}));
var clr=l.split===best&&_swLaps.length>1?'var(--easy)':l.split===worst&&_swLaps.length>1?'var(--hard)':'var(--text2)';
return '<div style="display:flex;align-items:center;padding:8px 12px;background:var(--bg2);border:1px solid var(--border);border-radius:8px;margin-bottom:4px;">'
+'<span style="font-size:.62rem;color:var(--text3);font-family:JetBrains Mono,monospace;width:36px;">L'+(i+1)+'</span>'
+'<span style="flex:1;font-size:.78rem;font-family:JetBrains Mono,monospace;color:'+clr+';">'+_fmtSw(l.split)+'</span>'
+'<span style="font-size:.62rem;color:var(--text3);font-family:JetBrains Mono,monospace;">'+_fmtSw(l.total)+'</span>'
+'</div>';
}).reverse().join('');
}
}

// Fullscreen Timer
var _fsMode=null;
function toggleFullscreenTimer(mode){
_fsMode=mode;
var ov=document.getElementById('fullscreenTimerOverlay');
if(!ov)return;
ov.style.display='flex';
var label=document.getElementById('fsTimerLabel');
if(mode==='pomo'){
if(label)label.textContent=pomoMode==='work'?'Çalışma Seansı':'Mola';
_updateFsPomoDisplay();
} else {
if(label)label.textContent='Kronometre';
_updateSwDisplay();
}
_updateFsPlayIcon();
try{history.pushState({page:curPage,overlay:'fullscreen'},'',null);}catch(e){}
}
function closeFullscreenTimer(){
var ov=document.getElementById('fullscreenTimerOverlay');
if(ov)ov.style.display='none';
_fsMode=null;
}
function _updateFsPlayIcon(){
var icon=document.getElementById('fsPlayIcon');
if(!icon)return;
var running=_fsMode==='pomo'?pomoRunning:_swRunning;
icon.innerHTML=running?'<rect x="6" y="4" width="4" height="16" fill="currentColor"/><rect x="14" y="4" width="4" height="16" fill="currentColor"/>':'<polygon points="5 3 19 12 5 21 5 3" fill="currentColor"/>';
}
function _updateFsPomoDisplay(){
var fs=document.getElementById('fsTimerDisplay');
if(!fs||_fsMode!=='pomo')return;
var m=Math.floor(pomoSecs/60),s=pomoSecs%60;
fs.textContent=String(m).padStart(2,'0')+':'+String(s).padStart(2,'0');
}
function fsTogglePlay(){
if(_fsMode==='pomo'){
togglePomo();
} else {
toggleStopwatch();
}
_updateFsPlayIcon();
}
// Hook into pomodoro display update for fullscreen
var _origUpdatePomoDisplay=window.updatePomoDisplay;
if(typeof updatePomoDisplay==='function'){
var _ouPD=updatePomoDisplay;
window.updatePomoDisplay=function(){
_ouPD();
_updateFsPomoDisplay();
_updateFsPlayIcon();
};
}

// ══════════════════════════════════════════════════════
// CANVAS NOTE (Tablet kalemle yazma)
// ══════════════════════════════════════════════════════
var _canvasTool='pen',_canvasColor='#f0eeff',_canvasDrawing=false,_canvasHistory=[],_canvasCtx=null;
var _canvasInputMode='stylus'; // 'stylus' veya 'finger'
var _canvasBrushSizes={fountain:2,ballpoint:3,pencil:1,highlighter:14,tape:20,laser:4,lasso:1,eraser:18};
var _laserTimeout=null;
var _laserSnapshot=null;
var _canvasRedoStack=[];
var _lassoPath=[];
var _lassoActive=false; // her araç kendi boyutunu hatırlar
var _canvasEditingNoteId=null; // düzenleme modunda not id'si
function _getCanvasBrush(){return _canvasBrushSizes[_canvasTool]||3;}
function openCanvasNote(editNoteId){
var ov=document.getElementById('canvasNoteOverlay');
if(!ov)return;
ov.style.display='flex';
_canvasEditingNoteId=editNoteId||null;
_canvasHistory=[];
var canvas=document.getElementById('canvasNote');
canvas.style.background='#1a1a2e';
if(editNoteId){
var note=D.notes.find(function(n){return n.id===editNoteId;});
if(note)document.getElementById('canvasNoteTitle').value=note.title||'';
} else {
document.getElementById('canvasNoteTitle').value='';
}
_setupCanvasEvents(canvas);
// Input mode butonunu güncelle
_updateInputModeBtn();
// Brush size slider'ı güncelle
var slider=document.getElementById('canvasBrushSize');
if(slider){slider.value=_getCanvasBrush();document.getElementById('canvasSizeLbl').textContent=_getCanvasBrush();}
try{history.pushState({page:curPage,overlay:'canvas'},'',null);}catch(e){}
}
function closeCanvasNote(){
var ov=document.getElementById('canvasNoteOverlay');
if(ov)ov.style.display='none';
_canvasEditingNoteId=null;
}
function _setupCanvasEvents(canvas){
// Önce eski listener'ları temizle (clone ile)
var newCanvas=canvas.cloneNode(true);
canvas.parentNode.replaceChild(newCanvas,canvas);
var c=newCanvas;
// Canvas boyutunu ayarla
c.width=c.offsetWidth*2;
c.height=c.offsetHeight*2;
_canvasCtx=c.getContext('2d');
_canvasCtx.scale(2,2);
_canvasCtx.lineCap='round';_canvasCtx.lineJoin='round';
// Düzenleme moduysa mevcut çizimi yükle
if(_canvasEditingNoteId){
var note=D.notes.find(function(n){return n.id===_canvasEditingNoteId;});
if(note&&note.media&&note.media.length&&note.media[0].data){
var loadImg=new Image();
loadImg.onload=function(){_canvasCtx.drawImage(loadImg,0,0,c.offsetWidth,c.offsetHeight);_saveCanvasState();};
loadImg.src=note.media[0].data;
}
}
var getPos=function(e){
var rect=c.getBoundingClientRect();
var scaleX=c.offsetWidth/rect.width;
var scaleY=c.offsetHeight/rect.height;
return{x:(e.clientX-rect.left)*scaleX,y:(e.clientY-rect.top)*scaleY};
};
var onStart=function(e){
// Stylus modunda parmağı engelle
if(_canvasInputMode==='stylus'&&e.pointerType==='touch')return;
e.preventDefault();
_canvasDrawing=true;
if(_canvasTool==='laser'){
// Lazer başlamadan önce canvas'ın anlık görüntüsünü al
var _lc=document.querySelector('#canvasNoteOverlay canvas');
if(_lc)_laserSnapshot=_lc.toDataURL();
} else {
_saveCanvasState();
}
var pos=getPos(e);
_lastCanvasPos=pos;
_canvasCtx.beginPath();
_canvasCtx.moveTo(pos.x,pos.y);
};
var _lastCanvasPos=null;
var onMove=function(e){
if(!_canvasDrawing)return;
if(_canvasInputMode==='stylus'&&e.pointerType==='touch')return;
e.preventDefault();
// Coalesced events kullan (ara noktalar)
var events=e.getCoalescedEvents?e.getCoalescedEvents():[];
if(!events.length)events=[e];
for(var ei=0;ei<events.length;ei++){
var ce=events[ei];
var pos=getPos(ce);
var brush=_getCanvasBrush();
var tool=_canvasTool;
var pr=e.pressure||0.5;
_canvasCtx.globalCompositeOperation='source-over';
_canvasCtx.setLineDash([]);
if(tool==='eraser'){
_canvasCtx.globalCompositeOperation='destination-out';
_canvasCtx.lineWidth=brush;
_canvasCtx.strokeStyle='rgba(0,0,0,1)';
} else if(tool==='fountain'){
// Dolma kalem: basınca çok duyarlı, kalın-ince geçişli
var fw=e.pointerType==='pen'?brush*0.5+brush*pr*2.5:brush;
_canvasCtx.lineWidth=Math.max(0.5,fw);
_canvasCtx.strokeStyle=_canvasColor;
_canvasCtx.globalAlpha=0.85;
} else if(tool==='ballpoint'){
// Tükenmez: sabit kalınlık, tam opak
_canvasCtx.lineWidth=brush;
_canvasCtx.strokeStyle=_canvasColor;
_canvasCtx.globalAlpha=1;
} else if(tool==='pencil'){
// Kurşun kalem: ince, gri-ımsı, hafif pürüzlü
var pw=e.pointerType==='pen'?brush*0.3+brush*pr*0.7:brush*0.7;
_canvasCtx.lineWidth=Math.max(0.3,pw);
_canvasCtx.strokeStyle=_canvasColor;
_canvasCtx.globalAlpha=0.45;
} else if(tool==='highlighter'){
// Vurgulayıcı: düz geniş çizgi, yarı saydam
_canvasCtx.lineWidth=brush;
_canvasCtx.strokeStyle=_canvasColor;
_canvasCtx.globalAlpha=0.3;
} else if(tool==='tape'){
// Bant: seçili renkte, mat, yarı saydam geniş şerit
_canvasCtx.lineWidth=brush;
_canvasCtx.strokeStyle=_canvasColor;
_canvasCtx.globalAlpha=0.6;
} else if(tool==='laser'){
_canvasCtx.lineWidth=brush;
_canvasCtx.strokeStyle=_canvasColor;
_canvasCtx.globalAlpha=0.8;
clearTimeout(_laserTimeout);
} else if(tool==='lasso'){
_canvasCtx.lineWidth=1.5;
_canvasCtx.strokeStyle='var(--accent)';
_canvasCtx.setLineDash([6,4]);
_canvasCtx.globalAlpha=1;
_lassoPath.push(pos);
} else {
_canvasCtx.lineWidth=brush;
_canvasCtx.strokeStyle=_canvasColor;
}
_canvasCtx.lineTo(pos.x,pos.y);
_canvasCtx.stroke();
_canvasCtx.globalAlpha=1;
_lastCanvasPos=pos;
}// end for loop
};
var _laserBaseState=null;
var onEnd=function(e){
if(_canvasInputMode==='stylus'&&e.pointerType==='touch')return;
if(_canvasTool==='lasso'&&_lassoPath.length>5){
_showLassoMenu();
}
if(_canvasTool==='laser'&&_laserSnapshot){
clearTimeout(_laserTimeout);
_laserTimeout=setTimeout(function(){
var canvas=document.querySelector('#canvasNoteOverlay canvas');
if(!canvas||!_laserSnapshot)return;
var img=new Image();
img.onload=function(){
_canvasCtx.clearRect(0,0,canvas.width/2,canvas.height/2);
_canvasCtx.drawImage(img,0,0,canvas.width/2,canvas.height/2);
_laserSnapshot=null;
};
img.src=_laserSnapshot;
},1500);
}
_canvasDrawing=false;_canvasCtx.beginPath();
};
c.addEventListener('pointerdown',onStart);
c.addEventListener('pointermove',onMove);
c.addEventListener('pointerup',onEnd);
c.addEventListener('pointerleave',onEnd);
_setupPinchZoom(c);
_canvasZoom=1;c.style.transform='scale(1)';
}
function toggleCanvasInputMode(){
_canvasInputMode=_canvasInputMode==='stylus'?'finger':'stylus';
_updateInputModeBtn();
showToast(_canvasInputMode==='stylus'?'Sadece kalem modu ✏️':'Parmak + kalem modu 👆');
}
function _updateInputModeBtn(){
var btn=document.getElementById('ct-inputmode');
if(btn)btn.innerHTML=_canvasInputMode==='stylus'?'✏️':'👆';
}
function setCanvasTool(tool){
_canvasTool=tool;
var toolBtns=['ct-fountain','ct-ballpoint','ct-pencil','ct-highlighter','ct-tape','ct-laser','ct-lasso','ct-eraser'];
toolBtns.forEach(function(id){var el=document.getElementById(id);if(el)el.classList.remove('ct-active');});
var btn=document.getElementById('ct-'+tool);
if(btn)btn.classList.add('ct-active');
// Araç boyutunu slider'a yansıt
var slider=document.getElementById('canvasBrushSize');
if(slider){slider.value=_getCanvasBrush();document.getElementById('canvasSizeLbl').textContent=_getCanvasBrush();}
}
function setCanvasColor(color){
_canvasColor=color;
document.querySelectorAll('.ct-color').forEach(function(b){b.classList.toggle('ct-color-active',b.dataset.color===color);});
}
function updateCanvasBrush(){
var val=parseInt(document.getElementById('canvasBrushSize').value)||3;
_canvasBrushSizes[_canvasTool]=val;
document.getElementById('canvasSizeLbl').textContent=val;
}
function _saveCanvasState(){
_canvasRedoStack=[];
var canvas=document.getElementById('canvasNote');
if(!canvas){canvas=document.querySelector('#canvasNoteOverlay canvas');}
if(canvas)_canvasHistory.push(canvas.toDataURL());
if(_canvasHistory.length>30)_canvasHistory.shift();
}
function _showLassoMenu(){
if(!_lassoPath.length)return;
var minX=Infinity,minY=Infinity,maxX=0,maxY=0;
_lassoPath.forEach(function(p){minX=Math.min(minX,p.x);minY=Math.min(minY,p.y);maxX=Math.max(maxX,p.x);maxY=Math.max(maxY,p.y);});
var cx=(minX+maxX)/2;var cy=minY-30;
var m=document.createElement('div');m.id='lassoMenu';
m.style.cssText='position:absolute;left:'+cx+'px;top:'+Math.max(10,cy)+'px;transform:translateX(-50%);background:var(--bg2);border:1px solid var(--border);border-radius:10px;padding:6px;display:flex;gap:4px;z-index:10;box-shadow:0 4px 16px rgba(0,0,0,.4);';
m.innerHTML='<button onclick="lassoDelete()" style="background:rgba(248,113,113,.15);border:1px solid rgba(248,113,113,.3);border-radius:7px;padding:5px 10px;cursor:pointer;color:var(--hard);font-size:.62rem;font-family:Sora,sans-serif;">Sil</button>'
+'<button onclick="lassoCancel()" style="background:var(--bg3);border:1px solid var(--border);border-radius:7px;padding:5px 10px;cursor:pointer;color:var(--text3);font-size:.62rem;font-family:Sora,sans-serif;">İptal</button>';
var canvasWrap=document.getElementById('canvasNoteOverlay');
if(canvasWrap)canvasWrap.style.position='relative';
canvasWrap.appendChild(m);
}
function lassoDelete(){
if(_lassoPath.length<3)return;
_saveCanvasState();
_canvasCtx.save();
_canvasCtx.beginPath();
_lassoPath.forEach(function(p,i){i===0?_canvasCtx.moveTo(p.x,p.y):_canvasCtx.lineTo(p.x,p.y);});
_canvasCtx.closePath();
_canvasCtx.clip();
var canvas=document.querySelector('#canvasNoteOverlay canvas');
_canvasCtx.clearRect(0,0,canvas.width,canvas.height);
_canvasCtx.restore();
_canvasCtx.setLineDash([]);
_lassoPath=[];
var lm=document.getElementById('lassoMenu');if(lm)lm.remove();
canvasUndo();// lasso çizgisini de geri al (sadece silinen alan kalsın)
_saveCanvasState();
showToast('Seçili alan silindi');
}
function lassoCancel(){
_lassoPath=[];
canvasUndo();// lasso çizgisini geri al
var lm=document.getElementById('lassoMenu');if(lm)lm.remove();
}
function canvasUndo(){
if(!_canvasHistory.length)return;
var canvas=document.getElementById('canvasNote');
if(!canvas)canvas=document.querySelector('#canvasNoteOverlay canvas');
var current=canvas.toDataURL();
_canvasRedoStack.push(current);
_canvasHistory.pop();
if(_canvasHistory.length){
var img=new Image();
img.onload=function(){
_canvasCtx.clearRect(0,0,canvas.width/2,canvas.height/2);
_canvasCtx.drawImage(img,0,0,canvas.width/2,canvas.height/2);
};
img.src=_canvasHistory[_canvasHistory.length-1];
} else {
_canvasCtx.clearRect(0,0,canvas.width/2,canvas.height/2);
}
}
function canvasRedo(){
if(!_canvasRedoStack.length)return;
var canvas=document.getElementById('canvasNote');
if(!canvas)canvas=document.querySelector('#canvasNoteOverlay canvas');
var data=_canvasRedoStack.pop();
_canvasHistory.push(data);
var img=new Image();
img.onload=function(){
_canvasCtx.clearRect(0,0,canvas.width/2,canvas.height/2);
_canvasCtx.drawImage(img,0,0,canvas.width/2,canvas.height/2);
};
img.src=data;
}
function canvasClear(){
if(!_canvasCtx)return;
_saveCanvasState();
var canvas=document.getElementById('canvasNote');
if(!canvas)canvas=document.querySelector('#canvasNoteOverlay canvas');
_canvasCtx.clearRect(0,0,canvas.width/2,canvas.height/2);
}
// Canvas zoom & page management
var _canvasZoom=1;
var _canvasPages=[];
var _canvasCurrentPage=0;
function toggleCanvasPageMenu(){
var m=document.getElementById('canvasPageMenu');
if(!m)return;
var isOpen=m.style.display!=='none';
m.style.display=isOpen?'none':'block';
if(!isOpen){
setTimeout(function(){
var closer=function(e){
if(!m.contains(e.target)&&e.target.id!=='canvasMenuBtn'&&!e.target.closest('#canvasMenuBtn')){
m.style.display='none';
document.removeEventListener('pointerdown',closer);
}
};
document.addEventListener('pointerdown',closer);
},50);
}
}
function canvasPageAction(action){
var m=document.getElementById('canvasPageMenu');if(m)m.style.display='none';
var canvas=document.querySelector('#canvasNoteOverlay canvas');
if(!canvas)return;
if(action==='zoomIn'){
_canvasZoom=Math.min(4,_canvasZoom*1.3);
canvas.style.transform='scale('+_canvasZoom+')';
canvas.style.transformOrigin='center center';
showToast(Math.round(_canvasZoom*100)+'%');
} else if(action==='zoomOut'){
_canvasZoom=Math.max(0.3,_canvasZoom/1.3);
canvas.style.transform='scale('+_canvasZoom+')';
showToast(Math.round(_canvasZoom*100)+'%');
} else if(action==='resetZoom'){
_canvasZoom=1;
canvas.style.transform='scale(1)';
showToast('100%');
} else if(action==='rotateCW'){
_saveCanvasState();
var w=canvas.width/2,h=canvas.height/2;
var imgData=_canvasCtx.getImageData(0,0,canvas.width,canvas.height);
var tempCanvas=document.createElement('canvas');
tempCanvas.width=canvas.width;tempCanvas.height=canvas.height;
var tCtx=tempCanvas.getContext('2d');
tCtx.putImageData(imgData,0,0);
_canvasCtx.clearRect(0,0,w,h);
_canvasCtx.save();
_canvasCtx.translate(w/2,h/2);
_canvasCtx.rotate(Math.PI/2);
_canvasCtx.drawImage(tempCanvas,-w/2,-h/2,w,h);
_canvasCtx.restore();
showToast('Sağa döndürüldü');
} else if(action==='rotateCCW'){
_saveCanvasState();
var w2=canvas.width/2,h2=canvas.height/2;
var imgData2=_canvasCtx.getImageData(0,0,canvas.width,canvas.height);
var tempCanvas2=document.createElement('canvas');
tempCanvas2.width=canvas.width;tempCanvas2.height=canvas.height;
var tCtx2=tempCanvas2.getContext('2d');
tCtx2.putImageData(imgData2,0,0);
_canvasCtx.clearRect(0,0,w2,h2);
_canvasCtx.save();
_canvasCtx.translate(w2/2,h2/2);
_canvasCtx.rotate(-Math.PI/2);
_canvasCtx.drawImage(tempCanvas2,-w2/2,-h2/2,w2,h2);
_canvasCtx.restore();
showToast('Sola döndürüldü');
} else if(action==='new'){
// Yeni sayfa: yeni canvas div olarak altına ekle
var wrap=document.getElementById('canvasScrollWrap');
if(!wrap)return;
var pageNum=wrap.querySelectorAll('canvas').length+1;
// Ayırıcı
var sep=document.createElement('div');
sep.style.cssText='height:2px;background:linear-gradient(90deg,transparent,var(--accent),transparent);margin:4px 0;opacity:.4;';
wrap.appendChild(sep);
// Sayfa numarası
var pLbl=document.createElement('div');
pLbl.style.cssText='text-align:right;font-size:.48rem;color:var(--text3);font-family:JetBrains Mono,monospace;padding:2px 8px;';
pLbl.textContent=pageNum+'/'+pageNum;
wrap.appendChild(pLbl);
// Yeni canvas
var nc=document.createElement('canvas');
nc.id='canvasNote';
nc.style.cssText='width:100%;touch-action:none;cursor:crosshair;display:block;background:#1a1a2e;';
wrap.appendChild(nc);
nc.width=nc.offsetWidth*2;
nc.height=Math.round(nc.offsetWidth*1.414)*2;// A4 dikey default
nc.style.height=(nc.height/2)+'px';
_canvasCtx=nc.getContext('2d');
_canvasCtx.scale(2,2);
_canvasCtx.lineCap='round';_canvasCtx.lineJoin='round';
_canvasHistory=[];_canvasRedoStack=[];
_setupCanvasEvents(nc);
wrap.scrollTop=wrap.scrollHeight;
showToast('Sayfa '+pageNum+' eklendi');
} else if(action==='delete'){
var wrap2=document.getElementById('canvasScrollWrap');
var canvases=wrap2?wrap2.querySelectorAll('canvas'):[];
if(canvases.length<=1){
_canvasCtx.clearRect(0,0,canvas.width/2,canvas.height/2);
_canvasHistory=[];
showToast('Sayfa temizlendi');
} else {
// Son canvas'ı ve ayırıcılarını kaldır
var last=canvases[canvases.length-1];
if(last.previousElementSibling)last.previousElementSibling.remove();// sayfa no
if(last.previousElementSibling)last.previousElementSibling.remove();// ayırıcı
last.remove();
// Önceki canvas'a geç
var prev=wrap2.querySelector('canvas:last-of-type');
if(prev){_canvasCtx=prev.getContext('2d');_setupCanvasEvents(prev);}
showToast('Sayfa silindi');
}
} else if(action==='a4portrait'||action==='a4landscape'||action==='square'){
_saveCanvasState();
var cw=canvas.offsetWidth;
var newH=action==='a4portrait'?Math.round(cw*1.414):action==='a4landscape'?Math.round(cw*0.707):cw;
// Mevcut çizimi koru
var tmpImg=new Image();
var tmpData=canvas.toDataURL();
canvas.height=newH*2;
canvas.style.height=newH+'px';
_canvasCtx=canvas.getContext('2d');
_canvasCtx.scale(2,2);
_canvasCtx.lineCap='round';_canvasCtx.lineJoin='round';
tmpImg.onload=function(){_canvasCtx.drawImage(tmpImg,0,0,cw,newH);};
tmpImg.src=tmpData;
var labels={a4portrait:'A4 Dikey',a4landscape:'A4 Yatay',square:'Kare'};
showToast(labels[action]);
}
}
// Pinch zoom desteği
function _setupPinchZoom(canvas){
var lastDist=0;
canvas.addEventListener('touchstart',function(e){
if(e.touches.length===2){
var dx=e.touches[0].clientX-e.touches[1].clientX;
var dy=e.touches[0].clientY-e.touches[1].clientY;
lastDist=Math.sqrt(dx*dx+dy*dy);
}
},{passive:true});
canvas.addEventListener('touchmove',function(e){
if(e.touches.length===2){
var dx=e.touches[0].clientX-e.touches[1].clientX;
var dy=e.touches[0].clientY-e.touches[1].clientY;
var dist=Math.sqrt(dx*dx+dy*dy);
if(lastDist>0){
var scale=dist/lastDist;
_canvasZoom=Math.max(0.3,Math.min(4,_canvasZoom*scale));
canvas.style.transform='scale('+_canvasZoom+')';
canvas.style.transformOrigin='center center';
}
lastDist=dist;
e.preventDefault();
}
},{passive:false});
canvas.addEventListener('touchend',function(){lastDist=0;},{passive:true});
}
function canvasAddImage(){
var inp=document.getElementById('canvasImageInput');
if(!inp){inp=document.createElement('input');inp.type='file';inp.accept='image/*';inp.id='canvasImageInput';inp.style.display='none';inp.onchange=function(e){canvasInsertImage(e);};document.body.appendChild(inp);}
inp.click();
}
function canvasTakePhoto(){
var inp=document.getElementById('canvasCameraInput');
if(!inp){inp=document.createElement('input');inp.type='file';inp.accept='image/*';inp.capture='environment';inp.id='canvasCameraInput';inp.style.display='none';inp.onchange=function(e){canvasInsertImage(e);};document.body.appendChild(inp);}
inp.click();
}
function canvasInsertImage(e){
var file=e.target.files[0];if(!file)return;
var reader=new FileReader();
reader.onload=function(ev){
var img=new Image();
img.onload=function(){
_saveCanvasState();
var canvas=document.querySelector('#canvasNoteOverlay canvas');
var maxW=canvas.offsetWidth*0.6;var maxH=canvas.offsetHeight*0.4;
var scale=Math.min(maxW/img.width,maxH/img.height,1);
var w=img.width*scale;var h=img.height*scale;
var x=(canvas.offsetWidth-w)/2;var y=(canvas.offsetHeight-h)/2;
_canvasCtx.drawImage(img,x,y,w,h);
showToast('Resim eklendi');
};
img.src=ev.target.result;
};
reader.readAsDataURL(file);
e.target.value='';
}
function scrollToCanvasPage(dir){
var wrap=document.getElementById('canvasScrollWrap');
if(!wrap)return;
var canvases=wrap.querySelectorAll('canvas');
if(canvases.length<=1)return;
var scrollH=wrap.scrollTop;
var target=null;
for(var i=0;i<canvases.length;i++){
if(dir>0&&canvases[i].offsetTop>scrollH+10){target=canvases[i];break;}
if(dir<0&&i>0&&canvases[i].offsetTop>=scrollH-10){target=canvases[i-1];break;}
}
if(target)wrap.scrollTo({top:target.offsetTop,behavior:'smooth'});
}
function saveCanvasNote(){
// Tüm canvas'ları birleştirerek kaydet
var wrap=document.getElementById('canvasScrollWrap');
var canvases=wrap?wrap.querySelectorAll('canvas'):[];
var canvas=canvases.length?canvases[0]:document.querySelector('#canvasNoteOverlay canvas');
if(!canvas)return;
var title=document.getElementById('canvasNoteTitle').value.trim()||'Çizim Notu';
var dataUrl;
if(canvases.length>1){
// Çoklu sayfa: hepsini birleştir
var totalH=0;
canvases.forEach(function(c){totalH+=c.height;});
var merged=document.createElement('canvas');
merged.width=canvases[0].width;merged.height=totalH;
var mCtx=merged.getContext('2d');
var y=0;
canvases.forEach(function(c){mCtx.drawImage(c,0,y);y+=c.height;});
dataUrl=merged.toDataURL('image/png',0.8);
} else {
dataUrl=canvas.toDataURL('image/png',0.8);
}
if(_canvasEditingNoteId){
// Mevcut notu güncelle
var note=D.notes.find(function(n){return n.id===_canvasEditingNoteId;});
if(note){
note.title=title;
note.media=[{type:'image',name:'canvas.png',data:dataUrl}];
note.updatedAt=new Date().toISOString();
}
showToast('Çizim güncellendi ✓');
} else {
// Yeni not
D.notes.unshift({
id:Date.now(),title:title,content:'[Çizim Notu]',
media:[{type:'image',name:'canvas.png',data:dataUrl}],
tags:['çizim'],createdAt:new Date().toISOString()
});
showToast('Çizim kaydedildi ✏️');
}
saveData();
closeCanvasNote();
renderNotes();
switchPage('notes');
}

// ══════════════════════════════════════════════════════
// CALENDAR VIEW
// ══════════════════════════════════════════════════════
var _calYear=new Date().getFullYear(),_calMonth=new Date().getMonth();
function changeCalMonth(dir){
_calMonth+=dir;
if(_calMonth>11){_calMonth=0;_calYear++;}
if(_calMonth<0){_calMonth=11;_calYear--;}
renderCalendar();
}
function renderCalendar(){
var months=['Ocak','Şubat','Mart','Nisan','Mayıs','Haziran','Temmuz','Ağustos','Eylül','Ekim','Kasım','Aralık'];
document.getElementById('calMonthTitle').textContent=months[_calMonth]+' '+_calYear;
var firstDay=new Date(_calYear,_calMonth,1).getDay();
var daysInMonth=new Date(_calYear,_calMonth+1,0).getDate();
var startDay=(firstDay+6)%7;
var today=new Date();var todayKey=today.toISOString().split('T')[0];
var html='<div style="display:grid;grid-template-columns:repeat(7,1fr);gap:4px;">';
['Pt','Sa','Ça','Pe','Cu','Ct','Pz'].forEach(function(d){
html+='<div style="text-align:center;font-size:.52rem;color:var(--text3);padding:4px;font-family:JetBrains Mono,monospace;">'+d+'</div>';
});
for(var i=0;i<startDay;i++)html+='<div></div>';
for(var d=1;d<=daysInMonth;d++){
var dk=_calYear+'-'+String(_calMonth+1).padStart(2,'0')+'-'+String(d).padStart(2,'0');
var isToday=dk===todayKey;
var todos=D.todos.filter(function(t){return t.dueDate===dk;});
var completed=D.completedTodos.filter(function(t){return t.completedAt&&t.completedAt.startsWith(dk);});
var diary=D.diary.filter(function(e){return e.createdAt&&e.createdAt.startsWith(dk);});
var mood=D.moodLog?D.moodLog[dk]:null;
var hasEvent=todos.length||completed.length||diary.length||mood;
html+='<div onclick="showCalDay(\''+dk+'\')" style="aspect-ratio:1;border-radius:10px;display:flex;flex-direction:column;align-items:center;justify-content:center;cursor:pointer;'
+'background:'+(isToday?'rgba(124,111,247,.15)':hasEvent?'var(--bg2)':'transparent')+';'
+'border:1px solid '+(isToday?'var(--accent)':'transparent')+';'
+'transition:all .15s;"'
+' onmouseover="this.style.background=\'var(--bg3)\'" onmouseout="this.style.background=\''+(isToday?'rgba(124,111,247,.15)':hasEvent?'var(--bg2)':'transparent')+'\'">'
+'<div style="font-size:.72rem;color:'+(isToday?'var(--accent2)':'var(--text)')+';font-weight:'+(isToday?'600':'400')+';">'+d+'</div>';
if(hasEvent){
var dots='';
if(todos.length)dots+='<div style="width:4px;height:4px;border-radius:50%;background:var(--mid);"></div>';
if(completed.length)dots+='<div style="width:4px;height:4px;border-radius:50%;background:var(--easy);"></div>';
if(diary.length)dots+='<div style="width:4px;height:4px;border-radius:50%;background:var(--diary);"></div>';
if(mood)dots+='<div style="font-size:.4rem;">'+mood+'</div>';
html+='<div style="display:flex;gap:2px;margin-top:2px;">'+dots+'</div>';
}
html+='</div>';
}
html+='</div>';
document.getElementById('calGrid').innerHTML=html;
document.getElementById('calDayDetail').innerHTML='';
}
function showCalDay(dk){
var todos=D.todos.filter(function(t){return t.dueDate===dk;});
var completed=D.completedTodos.filter(function(t){return t.completedAt&&t.completedAt.startsWith(dk);});
var diary=D.diary.filter(function(e){return e.createdAt&&e.createdAt.startsWith(dk);});
var mood=D.moodLog?D.moodLog[dk]:null;
var html='<div style="background:var(--bg2);border:1px solid var(--border);border-radius:14px;padding:14px;">';
html+='<div style="font-size:.78rem;font-weight:500;color:var(--text);margin-bottom:10px;">'+fmtDate(dk)+(mood?' · '+mood:'')+'</div>';
if(todos.length){
html+='<div style="font-size:.56rem;color:var(--mid);font-family:JetBrains Mono,monospace;margin-bottom:4px;">GÖREVLER</div>';
todos.forEach(function(t){html+='<div style="display:flex;align-items:center;gap:6px;padding:4px 0;"><div style="width:6px;height:6px;border-radius:50%;background:var(--'+t.priority+');"></div><span style="font-size:.74rem;color:var(--text2);">'+escHtml(t.text)+'</span></div>';});
}
if(completed.length){
html+='<div style="font-size:.56rem;color:var(--easy);font-family:JetBrains Mono,monospace;margin:8px 0 4px;">TAMAMLANAN</div>';
completed.forEach(function(t){html+='<div style="display:flex;align-items:center;gap:6px;padding:4px 0;"><svg viewBox="0 0 24 24" fill="none" stroke="var(--easy)" stroke-width="2.5" style="width:10px;height:10px;flex-shrink:0;"><polyline points="20 6 9 17 4 12"/></svg><span style="font-size:.74rem;color:var(--text3);text-decoration:line-through;">'+escHtml(t.text)+'</span></div>';});
}
if(diary.length){
html+='<div style="font-size:.56rem;color:var(--diary);font-family:JetBrains Mono,monospace;margin:8px 0 4px;">GÜNLÜK</div>';
diary.forEach(function(e){html+='<div style="padding:4px 0;"><span style="font-size:.74rem;color:var(--text2);">'+(e.mood||'📖')+' '+escHtml(e.title||'Günlük')+'</span></div>';});
}
if(!todos.length&&!completed.length&&!diary.length){
html+='<div style="font-size:.72rem;color:var(--text3);font-style:italic;">Bu günde kayıt yok</div>';
}
html+='</div>';
document.getElementById('calDayDetail').innerHTML=html;
}

// ══════════════════════════════════════════════════════
// FOCUS MODE
// ══════════════════════════════════════════════════════
var _focusStartTime=null,_focusInterval=null;
function openFocusMode(){
var ov=document.createElement('div');
ov.id='focusModeOverlay';
ov.style.cssText='position:fixed;inset:0;z-index:8000;background:var(--bg);display:flex;flex-direction:column;align-items:center;justify-content:center;';
_focusStartTime=Date.now();
ov.innerHTML='<div style="text-align:center;max-width:340px;padding:20px;">'
+'<div style="font-size:.52rem;letter-spacing:.25em;color:var(--text3);font-family:JetBrains Mono,monospace;text-transform:uppercase;margin-bottom:20px;">Odak Modu</div>'
+'<div id="focusTimer" style="font-family:JetBrains Mono,monospace;font-size:4rem;font-weight:200;color:var(--text);letter-spacing:.05em;margin-bottom:8px;">00:00</div>'
+'<div id="focusLabel" style="font-size:.78rem;color:var(--text3);margin-bottom:40px;">Odaklan, telefonu bırak</div>'
+'<div style="display:flex;gap:16px;justify-content:center;margin-bottom:30px;">'
+'<button onclick="toggleFocusPomodoro()" style="width:56px;height:56px;border-radius:50%;border:1px solid var(--border);background:var(--bg3);cursor:pointer;display:flex;align-items:center;justify-content:center;color:var(--accent2);font-size:1.2rem;" title="Pomodoro">🍅</button>'
+'<button onclick="toggleFocusStopwatch()" style="width:56px;height:56px;border-radius:50%;border:1px solid var(--border);background:var(--bg3);cursor:pointer;display:flex;align-items:center;justify-content:center;color:var(--accent2);font-size:1.2rem;" title="Kronometre">⏱</button>'
+'</div>'
+'<div id="focusQuote" style="font-size:.76rem;color:var(--text2);font-style:italic;line-height:1.7;margin-bottom:40px;padding:0 10px;"></div>'
+'<button onclick="closeFocusMode()" style="background:rgba(248,113,113,.1);border:1px solid rgba(248,113,113,.25);border-radius:12px;padding:12px 32px;cursor:pointer;color:var(--hard);font-family:Sora,sans-serif;font-size:.82rem;">Odak Modundan Çık</button>'
+'<div id="focusStats" style="margin-top:20px;font-size:.62rem;color:var(--text3);font-family:JetBrains Mono,monospace;"></div>'
+'</div>';
document.body.appendChild(ov);
// Quote
var quotes=typeof getQuotes==='function'?getQuotes():QUOTES||[];
if(quotes.length){var q=quotes[Math.floor(Math.random()*quotes.length)];document.getElementById('focusQuote').innerHTML='"'+escHtml(q.text)+'"<br><span style="font-size:.62rem;color:var(--text3);">— '+escHtml(q.author)+'</span>';}
// Timer
_focusInterval=setInterval(function(){
var elapsed=Date.now()-_focusStartTime;
var s=Math.floor(elapsed/1000);var m=Math.floor(s/60);var h=Math.floor(m/60);
s=s%60;m=m%60;
var el=document.getElementById('focusTimer');
if(el)el.textContent=(h?String(h).padStart(2,'0')+':':'')+String(m).padStart(2,'0')+':'+String(s).padStart(2,'0');
},1000);
try{history.pushState({page:curPage,overlay:'focus'},'',null);}catch(e){}
}
function closeFocusMode(){
if(_focusInterval)clearInterval(_focusInterval);
var elapsed=_focusStartTime?Math.round((Date.now()-_focusStartTime)/60000):0;
var ov=document.getElementById('focusModeOverlay');
if(ov)ov.remove();
_focusStartTime=null;
if(elapsed>0)showToast(elapsed+' dakika odaklandın 🎯');
}
function toggleFocusPomodoro(){switchTimerTab('pomo');closeFocusMode();switchPage('pomodoro');toggleFullscreenTimer('pomo');}
function toggleFocusStopwatch(){switchTimerTab('stopwatch');closeFocusMode();switchPage('pomodoro');toggleFullscreenTimer('stopwatch');}
