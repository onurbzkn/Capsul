
let currentUser=null;
function initApp(){
initPinToggle();autoTrash();updTrashBadge();updateProfileUI();initReminders();
initSettingsToggles();
updateNotifBadge();
checkSmartNotifications();
checkRecurringTodos();
renderDiaryAIPrompt();
setMode(curMode);
renderTodos();renderNotes();renderDiary();renderDashboard();
renderKanban();renderReading();renderSchedule();renderExams();renderNotebook();renderPro();
}
const QUOTES=[
{text:"Başarı, her gün tekrarlanan küçük çabaların toplamıdır.",author:"Robert Collier",tag:"Motivasyon"},
{text:"Bugün yapabileceğini yarına bırakma.",author:"Benjamin Franklin",tag:"Verimlilik"},
{text:"Hayat bisiklete binmek gibidir. Dengeyi korumak için pedal çevirmeye devam et.",author:"Albert Einstein",tag:"Hayat"},
{text:"En büyük zafer, hiç düşmemek değil, her düşüşte ayağa kalkmaktır.",author:"Konfüçyüs",tag:"Kararlılık"},
{text:"Paranın değeri onu ne için harcadığında gizlidir.",author:"Warren Buffett",tag:"Ekonomi"},
{text:"Bir ağaç dikmek için en iyi zaman 20 yıl önceydi. İkinci en iyi zaman şimdisidir.",author:"Çin Atasözü",tag:"Girişim"},
{text:"Kendinize inanmak, başarının yarısıdır.",author:"Theodore Roosevelt",tag:"Motivasyon"},
{text:"Sabır, gücün en yüce biçimidir.",author:"Hz. Ali",tag:"Dini"},
{text:"İlim Çin'de de olsa gidiniz.",author:"Hz. Muhammed (s.a.v.)",tag:"Dini"},
{text:"Bir insan ancak bildiği kadar değerlidir.",author:"Mevlana",tag:"Bilgelik"},
{text:"Toplumların geleceği, eğitime verdikleri değerle orantılıdır.",author:"Atatürk",tag:"Eğitim"},
{text:"Başarısızlık, başarının anasıdır.",author:"Thomas Edison",tag:"Motivasyon"},
{text:"Sağlık en büyük nimettir, kanaat en büyük servettir.",author:"Platon",tag:"Sağlık"},
{text:"Her zaman doğruyu söyle; daha az şeyi hatırlamak zorunda kalırsın.",author:"Mark Twain",tag:"Dürüstlük"},
{text:"Hayatta en büyük risk, hiç risk almamaktır.",author:"Mark Zuckerberg",tag:"Girişim"},
{text:"Güzel şeyler görmek için güzel bir kalp gerekir.",author:"Rumi",tag:"Dini"},
{text:"Para parayı çeker; ama bilgi daha fazlasını.",author:"Robert Kiyosaki",tag:"Ekonomi"},
{text:"Cesaret, korkuya rağmen harekete geçtiğinde ortaya çıkar.",author:"Nelson Mandela",tag:"Cesaret"},
{text:"Zamanın kıymetini bil; çünkü o asla geri gelmez.",author:"Benjamin Franklin",tag:"Zaman"},
{text:"Gerçek zenginlik, ihtiyacın olmamasıdır.",author:"Epikür",tag:"Sadelik"},
{text:"Fırsat çalışkanlık kılığına bürünür.",author:"Thomas Edison",tag:"Çalışkanlık"},
{text:"Özgürlük, insanın kendi aklıyla düşünmesidir.",author:"Voltaire",tag:"Felsefe"},
{text:"Bugün acı çekmek istemiyorsan, yarın pişmanlık çekersin.",author:"Jim Rohn",tag:"Disiplin"},
{text:"Oku! Yaratan Rabbinin adıyla oku.",author:"Kuran-ı Kerim (Alak:1)",tag:"Dini"},
{text:"Kolaylıkla birlikte zorluk da vardır.",author:"Kuran-ı Kerim (İnşirah:6)",tag:"Dini"},
{text:"İnsanların en hayırlısı, insanlara en faydalı olandır.",author:"Hz. Muhammed (s.a.v.)",tag:"Dini"},
{text:"İki günü eşit olan, zarardadır.",author:"Hz. Muhammed (s.a.v.)",tag:"Dini"},
{text:"Gel, gel, ne olursan ol yine gel!",author:"Mevlana",tag:"Dini"},
{text:"Dün dündür, bugün yeni bir yaşamdır.",author:"Mevlana",tag:"Dini"},
{text:"Eline, diline, beline sahip ol.",author:"Hacı Bektaş Veli",tag:"Ahlak"},
{text:"Bilgini arttır ki azlığını bilmiş olasın.",author:"Hz. Ali",tag:"Dini"},
{text:"Borsa; sabırsızların paralarını sabırlılara aktardığı yerdir.",author:"Warren Buffett",tag:"Ekonomi"},
{text:"Risk, ne yaptığını bilmemektir.",author:"Warren Buffett",tag:"Ekonomi"},
{text:"Asla tek bir gelir kaynağına bağımlı olma.",author:"Warren Buffett",tag:"Ekonomi"},
{text:"Para biriktirmek için daha fazla kazanmak gerekmez; daha az harcamak gerekir.",author:"Robert Kiyosaki",tag:"Ekonomi"},
{text:"Zenginler para için çalışmaz; para onlar için çalışır.",author:"Robert Kiyosaki",tag:"Ekonomi"},
{text:"Başarı, hazırlık ile fırsatın buluştuğu andır.",author:"Seneca",tag:"Motivasyon"},
{text:"İnsan, taşıdığı düşüncenin ürünüdür.",author:"Marcus Aurelius",tag:"Felsefe"},
{text:"Her gün biraz daha iyi ol; bu yeterlidir.",author:"Marcus Aurelius",tag:"Gelişim"},
{text:"Zorlukların içindeki fırsatı ara.",author:"Albert Einstein",tag:"Motivasyon"},
{text:"Hayal gücü bilgiden daha önemlidir.",author:"Albert Einstein",tag:"Yaratıcılık"},
{text:"Tek gerçek bilgi, bilginin sınırlarını bilmektir.",author:"Sokrates",tag:"Felsefe"},
{text:"Sorgusuz hayat yaşamaya değmez.",author:"Sokrates",tag:"Felsefe"},
{text:"Neden yaptığından başla; ne ve nasıl sonra gelir.",author:"Simon Sinek",tag:"İş"},
{text:"Sağlık bir taç gibidir; yalnızca hastalar görür onu.",author:"Arap Atasözü",tag:"Sağlık"},
{text:"Vücuduna saygı göster; ona sahip çıkacak başka yerin yok.",author:"Bilinmiyor",tag:"Sağlık"},
{text:"Spor, zihnin en iyi terapistidir.",author:"Hippokrates",tag:"Sağlık"},
{text:"Küçük değişiklikler, büyük dönüşümler yaratır.",author:"James Clear",tag:"Alışkanlık"},
{text:"Her gün yüzde bir daha iyi olmak, yıl sonunda 37 kat büyümektir.",author:"James Clear",tag:"Alışkanlık"},
{text:"Sistemler hedeflerden daha güçlüdür.",author:"James Clear",tag:"Gelişim"},
{text:"Gönlü zengin olan, hiç yoksul olmaz.",author:"Hz. Ali",tag:"Dini"},
{text:"İyilik yap, suya bırak; balık bile bilir.",author:"Türk Atasözü",tag:"Ahlak"},
{text:"Damlaya damlaya göl olur.",author:"Türk Atasözü",tag:"Sabır"},
{text:"Ağaç yaşken eğilir.",author:"Türk Atasözü",tag:"Eğitim"},
{text:"Dost acı söyler.",author:"Türk Atasözü",tag:"Dürüstlük"},
{text:"Sabah rutinin, hayatının ritmidir.",author:"Robin Sharma",tag:"Disiplin"},
{text:"Erken kalkmak başarının yarısıdır.",author:"Robin Sharma",tag:"Disiplin"},
{text:"Odaklanmak, 'hayır' diyebilme sanatıdır.",author:"Steve Jobs",tag:"Verimlilik"},
{text:"Zaman yönetimi, enerji yönetimidir.",author:"Tony Schwartz",tag:"Verimlilik"},
{text:"Uzun bir yolculuk, tek bir adımla başlar.",author:"Lao Tzu",tag:"Başlangıç"},
{text:"Hayat kısa; güzel şeylere daha çok zaman ayır.",author:"Bilinmiyor",tag:"Hayat"},
{text:"Büyük rüyalar görmekten utanma.",author:"Bilinmiyor",tag:"Motivasyon"},
{text:"Korkudan değil; aşktan hareket et.",author:"Bilinmiyor",tag:"Motivasyon"},
{text:"Söz uçar, yazı kalır.",author:"Türk Atasözü",tag:"Yazı"},
{text:"Zor seçimler, kolay hayatlar doğurur.",author:"Bilinmiyor",tag:"Disiplin"},
{text:"Kolay seçimler, zor hayatlar doğurur.",author:"Bilinmiyor",tag:"Disiplin"},
{text:"Mutlu olmak için izin bekleme.",author:"Bilinmiyor",tag:"Mutluluk"},
{text:"Güne şükrederek başla; güne şükrederek son ver.",author:"Bilinmiyor",tag:"Dini"},
{text:"Bilmek yeterli değildir; uygulamak gerekir.",author:"Goethe",tag:"Eylem"},
{text:"Şimdi yaptığın şey, geleceğin temeli olur.",author:"Bilinmiyor",tag:"Motivasyon"},
{text:"Teknoloji araçtır; amaç değil.",author:"Bilinmiyor",tag:"Modern Hayat"},
{text:"Her başarının arkasında sessiz bir emek yatar.",author:"Bilinmiyor",tag:"Emek"},
{text:"Sabah güneş doğmadan önce gökyüzü en karanlık haldedir.",author:"Bilinmiyor",tag:"Umut"},
];
function getDayQuote(y,m,d){const seed=y*366+m*31+d;return QUOTES[((seed%QUOTES.length)+QUOTES.length)%QUOTES.length];}
const CRYPTO_KEY_NAME='capsula_ck_v1'; // IndexedDB record adı (eski localStorage key'i ile çakışmasın diye temizlenir)
const DATA_KEY='capsula_v4';
const IDB_NAME='capsula_keystore';
const IDB_STORE='keys';
let _cryptoKey=null;
function _openKeyDB(){
return new Promise((res,rej)=>{
const req=indexedDB.open(IDB_NAME,1);
req.onupgradeneeded=e=>e.target.result.createObjectStore(IDB_STORE);
req.onsuccess=e=>res(e.target.result);
req.onerror=e=>rej(e.target.error);
});
}
async function _idbGet(key){
const db=await _openKeyDB();
return new Promise((res,rej)=>{
const tx=db.transaction(IDB_STORE,'readonly');
const req=tx.objectStore(IDB_STORE).get(key);
req.onsuccess=e=>res(e.target.result);
req.onerror=e=>rej(e.target.error);
});
}
async function _idbSet(key,val){
const db=await _openKeyDB();
return new Promise((res,rej)=>{
const tx=db.transaction(IDB_STORE,'readwrite');
const req=tx.objectStore(IDB_STORE).put(val,key);
req.onsuccess=()=>res();
req.onerror=e=>rej(e.target.error);
});
}
async function getCryptoKey(){
if(_cryptoKey)return _cryptoKey;
localStorage.removeItem(CRYPTO_KEY_NAME);
try{
const stored=await _idbGet(CRYPTO_KEY_NAME);
if(stored){
_cryptoKey=stored; // zaten CryptoKey nesnesi, export edilemez
} else {
_cryptoKey=await crypto.subtle.generateKey({name:'AES-GCM',length:256},false,['encrypt','decrypt']);
await _idbSet(CRYPTO_KEY_NAME,_cryptoKey);
}
}catch(e){
if(!_cryptoKey)
_cryptoKey=await crypto.subtle.generateKey({name:'AES-GCM',length:256},false,['encrypt','decrypt']);
}
return _cryptoKey;
}
async function encryptData(obj){
try{
const key=await getCryptoKey();
const iv=crypto.getRandomValues(new Uint8Array(12));
const encoded=new TextEncoder().encode(JSON.stringify(obj));
const cipher=await crypto.subtle.encrypt({name:'AES-GCM',iv},key,encoded);
const combined=new Uint8Array(iv.length+cipher.byteLength);
combined.set(iv);combined.set(new Uint8Array(cipher),iv.length);
return btoa(String.fromCharCode(...combined));
}catch(e){
throw new Error('capsula_encrypt_failed: '+e.message);
}
}
async function decryptData(str){
try{
const key=await getCryptoKey();
const bytes=Uint8Array.from(atob(str),c=>c.charCodeAt(0));
const iv=bytes.slice(0,12);
const cipher=bytes.slice(12);
const plain=await crypto.subtle.decrypt({name:'AES-GCM',iv},key,cipher);
return JSON.parse(new TextDecoder().decode(plain));
}catch(e){
try{return JSON.parse(str);}catch{return null;}
}
}
async function saveDataEncrypted(){
const enc=await encryptData(D);
localStorage.setItem(DATA_KEY,enc);
}
async function loadDataEncrypted(){
const raw=localStorage.getItem(DATA_KEY);
if(!raw)return null;
try{
atob(raw); // base64 ise hata vermez
return await decryptData(raw);
}catch{
try{return JSON.parse(raw);}catch{return null;}
}
}
let D={
todos:[],completedTodos:[],trash:[],contentTrash:[],
calPlans:{},notes:[],diary:[],
kanban:{todo:[],doing:[],done:[]},
reading:[],schedule:[],exams:[],notebook:[],
profile:{name:'Kullanıcı',email:'ornek@eposta.com',avatar:'',theme:'default'},
};
let _saveErrorShown=false;
function saveData(){
saveDataEncrypted().catch(err=>{
console.error('Capsula kayıt hatası:',err);
if(!_saveErrorShown){
_saveErrorShown=true;
showToast('⚠️ Veri kaydedilemedi — tarayıcı şifrelemeyi desteklemiyor olabilir');
setTimeout(()=>{_saveErrorShown=false;},10000);
}
});
}
let curMode='home', curPage='notes', curPriority='easy', kanbanPriority='mid';
let editorType='note', editorMediaFiles=[], editorTags=[], selMoodVal='\ud83d\ude0a';
let viewingEntry=null, completedOpen=false, _confirmCb=null;
let pomoMode='work', pomoRunning=false, pomoSecs=25*60, pomoInterval=null, pomoSessions=0, pomoTaskId=null;
let pomoStyle=localStorage.getItem('capsula_pomo_style')||'ring';
const POMO_DUR_CUSTOM=JSON.parse(localStorage.getItem('capsula_pomo_dur')||'{"work":25,"short":5,"long":15}');
const POMO_DUR={get work(){return POMO_DUR_CUSTOM.work*60;},get short(){return POMO_DUR_CUSTOM.short*60;},get long(){return POMO_DUR_CUSTOM.long*60;}};
const ICO_SEARCH='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>';
const MODES={
home:[
{id:'notes',lbl:'Not',ico:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>'},
{id:'todo',lbl:'Görev',ico:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><polyline points="9 11 12 14 22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></svg>'},
{id:'pomodoro',lbl:'Odak',ico:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>',center:true},
{id:'diary',lbl:'Günlük',ico:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>'},
{id:'search',lbl:'Ara',ico:ICO_SEARCH},
],
pro:[
{id:'notes',lbl:'Not',ico:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>'},
{id:'todo',lbl:'Görev',ico:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><polyline points="9 11 12 14 22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></svg>'},
{id:'pomodoro',lbl:'Odak',ico:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>',center:true},
{id:'diary',lbl:'Günlük',ico:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>'},
{id:'search',lbl:'Ara',ico:ICO_SEARCH},
],
uni:[
{id:'notes',lbl:'Not',ico:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>'},
{id:'todo',lbl:'Görev',ico:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><polyline points="9 11 12 14 22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></svg>'},
{id:'pomodoro',lbl:'Odak',ico:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>',center:true},
{id:'schedule',lbl:'Program',ico:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>'},
{id:'search',lbl:'Ara',ico:ICO_SEARCH},
],
};
const PAGE_TITLES={home:'Ana Ekran',stats:'İstatistikler',slides:'Slaytlar',todo:'Görevler',notes:'Notlar',diary:'Günlük',search:'Arama',calendar:'Takvim',pomodoro:'Pomodoro',kanban:'Kanban',weekly:'Haftalık Özet',reading:'Okuma Listesi',pro:'Profesyonel',schedule:'Ders Programı',exams:'Sınav Takvimi',notebook:'Not Defteri',chat:'Sohbet'};
function setMode(mode){
curMode=mode;
buildNav();
switchPage(MODES[mode][0].id);
}
function buildNav(){
const ng=document.getElementById('navGlass');ng.innerHTML='';
MODES[curMode].forEach(item=>{
if(item.center){
const w=document.createElement('div');w.className='nav-center-wrap';
const b=document.createElement('button');b.className='nav-center-fab';b.id='centerFab';
b.innerHTML=item.ico;b.onclick=()=>switchPage(item.id);w.appendChild(b);ng.appendChild(w);
} else {
const b=document.createElement('button');b.className='nav-btn'+(curPage===item.id?' active':'');
b.dataset.pid=item.id;b.innerHTML=item.ico+`<span>${item.lbl}</span>`;
b.onclick=()=>switchPage(item.id);ng.appendChild(b);
}
});
}
function switchPage(page){
document.querySelector('.page.active')?.classList.remove('active');
const el=document.getElementById('page-'+page);if(el)el.classList.add('active');
curPage=page;
document.querySelectorAll('.nav-btn').forEach(b=>b.classList.toggle('active',b.dataset.pid===page));
const titleEl=document.getElementById('pageTitle');
if(titleEl)titleEl.textContent=PAGE_TITLES[page]||'Capsula';
document.getElementById('fabNotes').style.display=page==='notes'?'flex':'none';
document.getElementById('fabDiary').style.display=page==='diary'?'flex':'none';
if(page==='home')renderDashboard();
if(page==='todo')renderTodos();
if(page==='notes')renderNotes();
if(page==='diary')renderDiary();
if(page==='pomodoro'){renderPomoTodos();updatePomoDisplay();}
if(page==='kanban')renderKanban();
if(page==='weekly')renderWeekly();
if(page==='reading')renderReading();
if(page==='schedule')renderSchedule();
if(page==='exams')renderExams();
if(page==='notebook')renderNotebook();
if(page==='stats')renderStats();
if(page==='search'){document.getElementById('search-results').innerHTML='';setTimeout(()=>{const inp=document.getElementById('searchInput');if(inp){inp.value='';inp.focus();}},200);}
if(page==='pro')renderPro();
}
const THEMES=['default','midnight','forest','sunset','ocean','sand'];
function applyTheme(name,el){
setTimeout(updateThemeLabel, 50);
document.body.style.transition='background .4s,color .4s';
document.documentElement.style.transition='--bg .4s,--bg2 .4s,--bg3 .4s';
THEMES.forEach(t=>document.body.classList.remove('theme-'+t));
if(name!=='default')document.body.classList.add('theme-'+name);
document.querySelectorAll('.theme-swatch').forEach(s=>s.classList.remove('active'));
if(el)el.classList.add('active');
else{const sw=document.querySelector(`.theme-swatch[data-theme="${name}"]`);if(sw)sw.classList.add('active');}
D.profile.theme=name;saveData();
setTimeout(()=>document.body.style.transition='',500);
}
function initTheme(){
const t=D.profile.theme||'default';
THEMES.forEach(th=>document.body.classList.remove('theme-'+th));
if(t!=='default')document.body.classList.add('theme-'+t);
const sw=document.querySelector(`.theme-swatch[data-theme="${t}"]`);
if(sw){document.querySelectorAll('.theme-swatch').forEach(s=>s.classList.remove('active'));sw.classList.add('active');}
}
let pinBuffer='';
async function hashPin(pin){
const buf=await crypto.subtle.digest('SHA-256',new TextEncoder().encode('capsula_pin_salt:'+pin));
return btoa(String.fromCharCode(...new Uint8Array(buf)));
}
async function verifyPin(input,storedHash){
if(storedHash&&storedHash.length===4){
if(input!==storedHash)return false;
const hashed=await hashPin(input);
localStorage.setItem('capsula_pin',hashed);
return true;
}
return await hashPin(input)===storedHash;
}
function showPinScreen(){const ps=document.getElementById('pinScreen');ps.style.display='flex';pinBuffer='';updatePinDots();}
function hidePinScreen(){const ps=document.getElementById('pinScreen');ps.classList.add('hiding');setTimeout(()=>{ps.style.display='none';ps.classList.remove('hiding');const firstVisit=!localStorage.getItem('capsula_toured');if(firstVisit)setTimeout(showWelcomeCard,400);},420);}
function pinKey(k){if(pinBuffer.length>=4)return;pinBuffer+=k;updatePinDots();if(pinBuffer.length===4){setTimeout(async()=>{const stored=localStorage.getItem('capsula_pin');const ok=await verifyPin(pinBuffer,stored);if(ok)hidePinScreen();else{document.querySelectorAll('#pinDots .pin-dot').forEach(d=>d.classList.add('error'));setTimeout(()=>{document.querySelectorAll('#pinDots .pin-dot').forEach(d=>d.classList.remove('error'));pinBuffer='';updatePinDots();},500);}},80);}}
function pinDel(){if(pinBuffer.length>0){pinBuffer=pinBuffer.slice(0,-1);updatePinDots();}}
function updatePinDots(){for(let i=0;i<4;i++){const d=document.getElementById('pd'+i);if(d){d.classList.toggle('filled',i<pinBuffer.length);d.classList.remove('error');}}}
function pinForgot(){showConfirm('PIN sıfırlanacak? Bu işlem geri alınamaz.',()=>{localStorage.removeItem('capsula_pin');D.profile.pinEnabled=false;saveData();hidePinScreen();showToast('PIN kaldırıldı');});}
function togglePinSetting(){const tog=document.getElementById('pinToggle');if(tog.classList.contains('on'))showPinDisablePrompt();else{tog.classList.add('on');document.getElementById('pinSetupArea').style.display='block';}}
let _pinDisableBuf='';
function showPinDisablePrompt(){_pinDisableBuf='';for(let i=0;i<4;i++){const d=document.getElementById('dd'+i);if(d)d.classList.remove('filled','error');}openModal('pinDisableModal');}
function pinDisableKey(k){if(_pinDisableBuf.length>=4)return;_pinDisableBuf+=k;for(let i=0;i<4;i++){const d=document.getElementById('dd'+i);if(d)d.classList.toggle('filled',i<_pinDisableBuf.length);}if(_pinDisableBuf.length===4){setTimeout(async()=>{const stored=localStorage.getItem('capsula_pin');const ok=await verifyPin(_pinDisableBuf,stored);if(ok){closeModal('pinDisableModal');removePinCode();document.getElementById('pinToggle').classList.remove('on');document.getElementById('pinSetupArea').style.display='none';showToast('PIN kilidi kaldırıldı');}else{document.querySelectorAll('#pinDisableDots .pin-dot').forEach(d=>d.classList.add('error'));setTimeout(()=>{document.querySelectorAll('#pinDisableDots .pin-dot').forEach(d=>{d.classList.remove('error','filled');});_pinDisableBuf='';},600);}},80);}}
function pinDisableDel(){_pinDisableBuf=_pinDisableBuf.slice(0,-1);for(let i=0;i<4;i++){const d=document.getElementById('dd'+i);if(d)d.classList.toggle('filled',i<_pinDisableBuf.length);}}
function pinDisableCancel(){closeModal('pinDisableModal');_pinDisableBuf='';}
async function savePinCode(){const val=document.getElementById('newPinInput').value;if(!/^\d{4}$/.test(val)){showToast('4 haneli rakam gir');return;}const hashed=await hashPin(val);localStorage.setItem('capsula_pin',hashed);D.profile.pinEnabled=true;saveData();document.getElementById('newPinInput').value='';document.getElementById('pinSetupArea').style.display='none';document.getElementById('pinToggle').classList.add('on');showToast('PIN kaydedildi \ud83d\udd12');}
function removePinCode(){localStorage.removeItem('capsula_pin');D.profile.pinEnabled=false;saveData();}
function initPinToggle(){document.getElementById('pinToggle').classList.toggle('on',!!localStorage.getItem('capsula_pin'));}
function toggleDrawer(){document.getElementById('drawer').classList.toggle('open');document.getElementById('drawerOverlay').classList.toggle('open');document.getElementById('hamBtn').classList.toggle('open');}
function openFromDrawer(t){toggleDrawer();setTimeout(()=>{
if(t==='profile')openProfilePage();
else if(t==='settings')openSettingsPage();
else if(t==='trash')openTrash();
else if(t==='privacy')openModal('privacyModal');
else if(t==='terms')showInfoModal('Kullanım Koşulları','Bu uygulama kişisel kullanım için tasarlanmıştır. Verilerinizi düzenli yedeklemeniz önerilir.');
else if(t==='help')showInfoModal('Yardım','Üstte mod değiştirici: Profesyonel / Ana Ekran / Öğrenci. Her mod farklı araçlar gösterir. Silinen içerikler 30 gün çöpte kalır. Tema değişikliği Ayarlardan yapılır.');
},300);}
function showInfoModal(t,b){document.getElementById('infoModalTitle').textContent=t;document.getElementById('infoModalBody').textContent=b;openModal('infoModal');}
function updateWordCount(){
const el=document.getElementById('editorContent');
const wc=document.getElementById('editorWordCount');
if(!el||!wc)return;
const text=el.value;
const words=text.trim()?text.trim().split(/\s+/).length:0;
const chars=text.length;
wc.textContent=`${words} kelime · ${chars} karakter`;
}
function openModal(id){
document.getElementById(id).classList.add('open');
}
function closeModal(id){document.getElementById(id).classList.remove('open');}
document.querySelectorAll('.modal-overlay').forEach(el=>el.addEventListener('click',e=>{if(e.target===el)el.classList.remove('open');}));
const BADGES=[
{id:'student',ico:'\ud83c\udf93',lbl:'Öğrenci'},
{id:'developer',ico:'\ud83d\udcbb',lbl:'Geliştirici'},
{id:'creative',ico:'\ud83c\udfa8',lbl:'Yaratıcı'},
{id:'reader',ico:'\ud83d\udcda',lbl:'Okuyucu'},
{id:'athlete',ico:'\ud83c\udfc3',lbl:'Sporcu'},
{id:'scientist',ico:'\ud83d\udd2c',lbl:'Bilimci'},
{id:'musician',ico:'\ud83c\udfb5',lbl:'Müzisyen'},
{id:'writer',ico:'✍️',lbl:'Yazar'},
{id:'explorer',ico:'\ud83c\udf0d',lbl:'Kaşif'},
];
const ACCENT_COLORS=[
{name:'purple',val:'#7c6ff7',val2:'#a89ffe'},
{name:'blue',val:'#38bdf8',val2:'#7dd3fc'},
{name:'pink',val:'#f472b6',val2:'#f9a8d4'},
{name:'green',val:'#4ade80',val2:'#86efac'},
{name:'orange',val:'#fb923c',val2:'#fdba74'},
{name:'red',val:'#f87171',val2:'#fca5a5'},
{name:'yellow',val:'#fbbf24',val2:'#fcd34d'},
{name:'teal',val:'#2dd4bf',val2:'#5eead4'},
{name:'indigo',val:'#818cf8',val2:'#a5b4fc'},
{name:'rose',val:'#fb7185',val2:'#fda4af'},
{name:'lime',val:'#a3e635',val2:'#bef264'},
{name:'cyan',val:'#22d3ee',val2:'#67e8f9'},
];
const SYSTEM_AVATARS=[
{id:'av1',emoji:'\ud83e\udd81',bg:'linear-gradient(135deg,#f59e0b,#d97706)'},
{id:'av2',emoji:'\ud83d\udc3a',bg:'linear-gradient(135deg,#6366f1,#4f46e5)'},
{id:'av3',emoji:'\ud83e\udd8a',bg:'linear-gradient(135deg,#f97316,#ea580c)'},
{id:'av4',emoji:'\ud83d\udc3b',bg:'linear-gradient(135deg,#92400e,#78350f)'},
{id:'av5',emoji:'\ud83d\udc3c',bg:'linear-gradient(135deg,#374151,#111827)'},
{id:'av6',emoji:'\ud83e\udd8b',bg:'linear-gradient(135deg,#8b5cf6,#7c3aed)'},
{id:'av7',emoji:'\ud83e\udd85',bg:'linear-gradient(135deg,#0369a1,#075985)'},
{id:'av8',emoji:'\ud83c\udf3f',bg:'linear-gradient(135deg,#16a34a,#15803d)'},
{id:'av9',emoji:'\ud83d\udd25',bg:'linear-gradient(135deg,#ef4444,#dc2626)'},
{id:'av10',emoji:'⚡',bg:'linear-gradient(135deg,#eab308,#ca8a04)'},
{id:'av11',emoji:'\ud83c\udf19',bg:'linear-gradient(135deg,#312e81,#1e1b4b)'},
{id:'av12',emoji:'☀️',bg:'linear-gradient(135deg,#f59e0b,#b45309)'},
{id:'av13',emoji:'\ud83c\udf0a',bg:'linear-gradient(135deg,#0891b2,#0e7490)'},
{id:'av14',emoji:'\ud83c\udfd4️',bg:'linear-gradient(135deg,#475569,#334155)'},
{id:'av15',emoji:'\ud83c\udf38',bg:'linear-gradient(135deg,#ec4899,#db2777)'},
{id:'av16',emoji:'\ud83d\udc8e',bg:'linear-gradient(135deg,#06b6d4,#0284c7)'},
{id:'av17',emoji:'\ud83c\udfaf',bg:'linear-gradient(135deg,#7c3aed,#6d28d9)'},
{id:'av18',emoji:'\ud83d\ude80',bg:'linear-gradient(135deg,#1d4ed8,#1e40af)'},
{id:'av19',emoji:'\ud83c\udfad',bg:'linear-gradient(135deg,#9333ea,#7e22ce)'},
{id:'av20',emoji:'\ud83c\udf3a',bg:'linear-gradient(135deg,#f43f5e,#e11d48)'},
];
function renderAvatarPicker(){
const grid=document.getElementById('editAvatarPickerGrid');
if(!grid)return;
const cur=D.profile.avatarId||'';
grid.innerHTML=SYSTEM_AVATARS.map(av=>`
<div onclick="selectSystemAvatar('${av.id}')"
style="width:100%;aspect-ratio:1;border-radius:12px;background:${av.bg};display:flex;align-items:center;justify-content:center;font-size:1.4rem;cursor:pointer;border:2px solid ${cur===av.id?'var(--accent)':'transparent'};transition:all .18s;position:relative;"
id="avopt-${av.id}">
${av.emoji}
${cur===av.id?'<div style="position:absolute;bottom:2px;right:2px;width:10px;height:10px;border-radius:50%;background:var(--accent);border:2px solid var(--bg);"></div>':''}
</div>`).join('');
}
function selectSystemAvatar(id){
const av=SYSTEM_AVATARS.find(a=>a.id===id);
if(!av)return;
D.profile.avatarId=id;
D.profile.avatar=''; // özel fotoğraf varsa temizle
saveData();
const initials=D.profile.name.split(' ').map(w=>w[0]||'').join('').slice(0,2).toUpperCase()||'KY';
['avatarInitials','drawerAvatarInitials','profileAvatarInitials'].forEach(el=>{
const e=document.getElementById(el);if(e)e.textContent=av.emoji;
});
const style=`background:${av.bg};`;
['avatarImg','drawerAvatarImg','profileAvatarImg'].forEach(el=>{
const e=document.getElementById(el);if(e)e.style.display='none';
});
document.querySelectorAll('.prof-avatar-wrap,.drawer-avatar,.avatar-btn').forEach(el=>{
el.style.background=av.bg;
});
renderAvatarPicker();
showToast('Avatar seçildi '+av.emoji);
}
function openProfile(){
const p=D.profile;
document.getElementById('profileName').value=p.name||'';
document.getElementById('profileEmail').value=p.email||'';
document.getElementById('profileBio').value=p.bio||'';
document.getElementById('profileMotto').value=p.motto||'';
const usernameInp=document.getElementById('profileUsername');
if(usernameInp)usernameInp.value=p.username||'';
const uname=p.username||'—';
const uf=document.getElementById('profUsernameField');if(uf)uf.textContent=uname;
const ut=document.getElementById('profUsernameText');if(ut)ut.textContent=uname!=='—'?'@'+uname:'Kullanıcı adın henüz ayarlanmamış';
const img=document.getElementById('profileAvatarImg');
if(p.avatar){
img.src=p.avatar;img.style.display='block';
document.getElementById('profileAvatarInitials').style.display='none';
const rw=document.getElementById('removeAvatarWrap');if(rw)rw.style.display='block';
} else {
img.style.display='none';document.getElementById('profileAvatarInitials').style.display='';
const rw=document.getElementById('removeAvatarWrap');if(rw)rw.style.display='none';
}
renderBadgeGrid();renderProfileStats();
renderAvatarPicker();
switchProfTab('info',document.querySelector('.prof-tab'));
openModal('profileModal');
}
function switchProfTab(tab,btn){
document.querySelectorAll('.prof-tab').forEach(b=>b.classList.remove('active'));
document.querySelectorAll('.prof-tab-content').forEach(c=>c.classList.remove('active'));
if(btn)btn.classList.add('active');
else document.querySelector('.prof-tab').classList.add('active');
document.getElementById('profTab-'+tab).classList.add('active');
if(tab==='stats')renderProfileStats();
if(tab==='style')renderThemeGridInProfile();
}
function renderBadgeGrid(){
const sel=D.profile.badge||'student';
document.getElementById('profBadgeGrid').innerHTML=BADGES.map(b=>`
<div class="prof-badge-opt${sel===b.id?' sel':''}" onclick="selectBadge('${b.id}',this)">
<span class="badge-ico">${b.ico}</span>
<span class="badge-lbl">${b.lbl}</span>
</div>`).join('');
}
function selectBadge(id,el){
D.profile.badge=id;
document.querySelectorAll('.prof-badge-opt').forEach(e=>e.classList.remove('sel'));
el.classList.add('sel');
}
function renderColorGrid(){
const sel=D.profile.accentColor||'purple';
document.getElementById('profColorGrid').innerHTML=ACCENT_COLORS.map(c=>`
<div class="prof-color-opt${sel===c.name?' sel':''}" style="background:${c.val}"
onclick="selectAccentColor('${c.name}','${c.val}','${c.val2}',this)" title="${c.name}"></div>`).join('');
}
function selectAccentColor(name,val,val2,el){
D.profile.accentColor=name;
D.profile.accentVal=val;
D.profile.accentVal2=val2;
document.querySelectorAll('.prof-color-opt').forEach(e=>e.classList.remove('sel'));
el.classList.add('sel');
document.documentElement.style.setProperty('--accent',val);
document.documentElement.style.setProperty('--accent2',val2);
}
function renderThemeGridInProfile(){
const cont=document.getElementById('themeGridInProfile');
if(!cont)return;
const themes=['default','midnight','forest','sunset','ocean','sand'];
const labels={default:'Varsayılan',midnight:'Gece',forest:'Orman',sunset:'Gün Batımı',ocean:'Okyanus',sand:'Kum'};
const cur=D.profile.theme||'default';
cont.innerHTML=`<div style="display:grid;grid-template-columns:repeat(3,1fr);gap:7px;">
${themes.map(t=>`<div onclick="applyThemeFromProfile('${t}',this)" style="padding:8px 6px;border-radius:9px;border:1px solid ${cur===t?'var(--accent)':'var(--border)'};background:${cur===t?'rgba(124,111,247,.12)':'var(--bg3)'};cursor:pointer;text-align:center;transition:all .2s;">
<div style="font-size:.62rem;font-family:'JetBrains Mono',monospace;color:${cur===t?'var(--accent2)':'var(--text3)'};">${labels[t]}</div>
</div>`).join('')}
</div>`;
}
function applyThemeFromProfile(name,el){
applyTheme(name);
document.querySelectorAll('#themeGridInProfile [onclick]').forEach(e=>{
e.style.borderColor='var(--border)';e.style.background='var(--bg3)';
e.querySelector('div').style.color='var(--text3)';
});
el.style.borderColor='var(--accent)';el.style.background='rgba(124,111,247,.12)';
el.querySelector('div').style.color='var(--accent2)';
}
function renderProfileStats(){
const streak=calcStreak();
const totalCompleted=D.completedTodos.length;
const totalNotes=D.notes.length+D.diary.length;
const totalPomo=parseInt(localStorage.getItem('capsula_pomo_total')||'0');
document.getElementById('profStatGrid').innerHTML=`
<div class="prof-stat-card"><div class="prof-stat-num">${D.todos.length+totalCompleted}</div><div class="prof-stat-lbl">Toplam Görev</div></div>
<div class="prof-stat-card"><div class="prof-stat-num">${totalCompleted}</div><div class="prof-stat-lbl">Tamamlanan</div></div>
<div class="prof-stat-card"><div class="prof-stat-num">${totalNotes}</div><div class="prof-stat-lbl">Not & Günlük</div></div>
<div class="prof-stat-card"><div class="prof-stat-num">${D.reading.filter(r=>r.status==='done').length}</div><div class="prof-stat-lbl">Kitap Bitti</div></div>
`;
const badge=BADGES.find(b=>b.id===(D.profile.badge||'student'));
document.getElementById('profStreakRow').innerHTML=`
<div class="prof-streak-num">${streak}\ud83d\udd25</div>
<div><div class="prof-streak-info-lbl">Günlük Seri</div><div class="prof-streak-info-sub">Arka arkaya aktif gün</div></div>
`;
}
function saveProfile(){
D.profile.name=document.getElementById('profileName').value.trim()||'Kullanıcı';
D.profile.email=document.getElementById('profileEmail').value.trim()||'';
D.profile.bio=document.getElementById('profileBio').value.trim();
D.profile.motto=document.getElementById('profileMotto').value.trim();
const uname=document.getElementById('profileUsername')?.value.trim().toLowerCase().replace(/[^a-z0-9_.]/g,'')||'';
if(uname)D.profile.username=uname;
saveData();updateProfileUI();closeModal('profileModal');showToast('Profil güncellendi ✦');
}
function updateProfileUI(){
const p=D.profile;
const initials=p.name.split(' ').map(w=>w[0]||'').join('').slice(0,2).toUpperCase();
document.getElementById('drawerUserName').textContent=p.name;
const emailDisplay=p.email||'';
document.getElementById('drawerUserEmail').textContent=emailDisplay?'@'+(p.username||emailDisplay.split('@')[0]):'';
const hname=document.getElementById('profHeaderName');if(hname)hname.textContent=p.name;
const hbadge=document.getElementById('profHeaderBadge');
if(hbadge){const b=BADGES.find(x=>x.id===(p.badge||'student'));if(b)hbadge.textContent=b.ico+' '+b.lbl;}
if(p.accentVal){document.documentElement.style.setProperty('--accent',p.accentVal);document.documentElement.style.setProperty('--accent2',p.accentVal2||p.accentVal);}
const headerInfo=document.getElementById('headerUserInfo');
const headerName=document.getElementById('headerUserName');
const headerHandle=document.getElementById('headerUserHandle');
if(p.name&&p.name!=='Kullanıcı'&&p.name.trim()){
if(headerInfo)headerInfo.style.display='block';
if(headerName)headerName.textContent=p.name;
if(headerHandle)headerHandle.textContent=p.username?'@'+p.username:'';
} else {
if(headerInfo)headerInfo.style.display='none';
}
if(p.avatarId&&!p.avatar){
const av=SYSTEM_AVATARS.find(a=>a.id===p.avatarId);
if(av){
['avatarInitials','drawerAvatarInitials','profileAvatarInitials'].forEach(id=>{const el=document.getElementById(id);if(el)el.textContent=av.emoji;});
['avatarImg','drawerAvatarImg','profileAvatarImg'].forEach(id=>{const el=document.getElementById(id);if(el)el.style.display='none';});
document.querySelectorAll('.avatar-btn,.drawer-avatar,.prof-avatar-wrap').forEach(el=>{el.style.background=av.bg;});
return;
}
}
['avatarInitials','drawerAvatarInitials','profileAvatarInitials'].forEach(id=>{const el=document.getElementById(id);if(el)el.textContent=initials;});
if(p.avatar){
['avatarImg','drawerAvatarImg','profileAvatarImg'].forEach(id=>{const el=document.getElementById(id);if(el){el.src=p.avatar;el.style.display='block';}});
['avatarInitials','drawerAvatarInitials'].forEach(id=>{const el=document.getElementById(id);if(el)el.style.display='none';});
} else {
['avatarImg','drawerAvatarImg','profileAvatarImg'].forEach(id=>{const el=document.getElementById(id);if(el)el.style.display='none';});
}
}
function handleAvatarUpload(e){
const file=e.target.files[0];if(!file)return;
if(file.size>5*1024*1024){showToast("Fotoğraf 5MB'dan küçük olmalı");return;}
const r=new FileReader();
r.onload=ev=>{
const img2=new Image();
img2.onload=()=>{
const canvas=document.createElement('canvas');
canvas.width=80;canvas.height=80;
const ctx=canvas.getContext('2d');
const size=Math.min(img2.width,img2.height);
const sx=(img2.width-size)/2,sy=(img2.height-size)/2;
ctx.drawImage(img2,sx,sy,size,size,0,0,80,80);
const thumb=canvas.toDataURL('image/jpeg',0.7);
D.profile.avatar=thumb;
saveData();
updateProfileUI();
const imgEl=document.getElementById('profileAvatarImg');
imgEl.src=thumb;imgEl.style.display='block';
document.getElementById('profileAvatarInitials').style.display='none';
const rw=document.getElementById('removeAvatarWrap');if(rw)rw.style.display='block'; showToast('Fotoğraf güncellendi ✓');
};
img2.src=ev.target.result;
};
r.readAsDataURL(file);
}
function removeAvatar(){
D.profile.avatar='';
saveData();
updateProfileUI();
const img=document.getElementById('profileAvatarImg');
img.src='';img.style.display='none';
document.getElementById('profileAvatarInitials').style.display='';
const rw=document.getElementById('removeAvatarWrap');if(rw)rw.style.display='none';
if(false){// auth kaldırıldı
}
showToast('Fotoğraf kaldırıldı');
}
function generateProfileCard(){
const p=D.profile;
const badge=BADGES.find(b=>b.id===(p.badge||'student'))||BADGES[0];
const streak=calcStreak();
const accent=p.accentVal||'#7c6ff7';
const accent2=p.accentVal2||'#a89ffe';
const initials=p.name.split(' ').map(w=>w[0]||'').join('').slice(0,2).toUpperCase();
const card=`
<div style="width:320px;background:linear-gradient(145deg,#0d0d12,#1c1c28);border-radius:20px;padding:28px;font-family:'Sora',sans-serif;border:1px solid rgba(255,255,255,0.1);position:relative;overflow:hidden;">
<div style="position:absolute;top:-40px;right:-40px;width:160px;height:160px;border-radius:50%;background:radial-gradient(circle,${accent}33,transparent 70%);pointer-events:none;"></div>
<div style="display:flex;align-items:center;gap:14px;margin-bottom:20px;">
<div style="width:56px;height:56px;border-radius:50%;background:linear-gradient(135deg,${accent},#f472b6);display:flex;align-items:center;justify-content:center;font-size:1.1rem;font-weight:700;color:#fff;flex-shrink:0;box-shadow:0 0 20px ${accent}55;overflow:hidden;">
${p.avatar?`<img src="${p.avatar}" style="width:100%;height:100%;object-fit:cover;border-radius:50%;">`:`<span>${initials}</span>`}
</div>
<div>
<div style="font-size:1rem;font-weight:500;color:#f0eeff;">${escHtml(p.name)}</div>
${p.username?`<div style="font-size:.62rem;font-family:'JetBrains Mono',monospace;color:${accent};margin-top:1px;">@${escHtml(p.username)}</div>`:''}
<div style="font-size:.6rem;font-family:'JetBrains Mono',monospace;color:${accent2};margin-top:2px;">${badge.ico} ${badge.lbl}</div>
</div>
</div>
${p.motto?`<div style="font-size:.75rem;color:rgba(240,238,255,.55);font-style:italic;border-left:2px solid ${accent};padding-left:10px;margin-bottom:16px;line-height:1.5;">"${escHtml(p.motto)}"</div>`:''}
<div style="display:grid;grid-template-columns:repeat(3,1fr);gap:8px;margin-bottom:16px;">
<div style="text-align:center;background:rgba(255,255,255,.04);border-radius:10px;padding:10px 6px;">
<div style="font-size:1.1rem;font-family:'JetBrains Mono',monospace;font-weight:600;color:${accent2};">${D.completedTodos.length}</div>
<div style="font-size:.48rem;color:rgba(240,238,255,.3);font-family:'JetBrains Mono',monospace;text-transform:uppercase;letter-spacing:.1em;margin-top:3px;">Tamamlanan</div>
</div>
<div style="text-align:center;background:rgba(255,255,255,.04);border-radius:10px;padding:10px 6px;">
<div style="font-size:1.1rem;font-family:'JetBrains Mono',monospace;font-weight:600;color:${accent2};">${streak}\ud83d\udd25</div>
<div style="font-size:.48rem;color:rgba(240,238,255,.3);font-family:'JetBrains Mono',monospace;text-transform:uppercase;letter-spacing:.1em;margin-top:3px;">Seri</div>
</div>
<div style="text-align:center;background:rgba(255,255,255,.04);border-radius:10px;padding:10px 6px;">
<div style="font-size:1.1rem;font-family:'JetBrains Mono',monospace;font-weight:600;color:${accent2};">${D.notes.length+D.diary.length}</div>
<div style="font-size:.48rem;color:rgba(240,238,255,.3);font-family:'JetBrains Mono',monospace;text-transform:uppercase;letter-spacing:.1em;margin-top:3px;">Not</div>
</div>
</div>
<div style="display:flex;align-items:center;justify-content:space-between;">
<div style="font-size:.5rem;font-family:'JetBrains Mono',monospace;color:rgba(240,238,255,.2);letter-spacing:.15em;">CAPSULA ✦ ${new Date().toLocaleDateString('tr-TR')}</div>
</div>
</div>`;
document.getElementById('profileCardPreview').innerHTML=card;
closeModal('profileModal');
openModal('profileCardModal');
}
function applyCalPicker(){
const m=parseInt(document.getElementById('calPickerMonth').value);
const y=parseInt(document.getElementById('calPickerYear').value);
if(isNaN(y))return;
closeModal('calPickerModal');
showToast(`${['Ocak','Şubat','Mart','Nisan','Mayıs','Haziran','Temmuz','Ağustos','Eylül','Ekim','Kasım','Aralık'][m]} ${y}`);
}
let _calDayDate=null;
function openCalDay(dateStr){
_calDayDate=dateStr;
const el=document.getElementById('calDayModalTitle');if(el)el.textContent=fmtDate(dateStr);
document.getElementById('calDayModalInput').value='';
document.getElementById('calDayPrio').value='mid';
document.querySelectorAll('[name="calDayPrio"]').forEach(r=>r.checked=r.value==='mid');
const existing=document.getElementById('calDayModalExisting');
if(existing){
const plans=(D.calPlans[dateStr]||[]);
existing.innerHTML=plans.map((p,i)=>`<div style="display:flex;align-items:center;gap:6px;padding:6px 0;border-bottom:1px solid var(--border);"><span style="flex:1;font-size:.76rem;color:var(--text2);">${escHtml(p.text)}</span><button onclick="deleteCalPlan('${dateStr}',${i})" style="background:none;border:none;cursor:pointer;color:var(--text3);font-size:.7rem;">✕</button></div>`).join('');
}
openModal('calDayModal');
}
function saveCalDayEntry(addToTodo){
const text=document.getElementById('calDayModalInput').value.trim();
if(!text){showToast('Bir şeyler yaz');return;}
const prio=document.getElementById('calDayPrio').value||'mid';
if(!D.calPlans[_calDayDate])D.calPlans[_calDayDate]=[];
D.calPlans[_calDayDate].push({text,priority:prio,createdAt:new Date().toISOString()});
if(addToTodo){
D.todos.push({id:Date.now(),text,priority:prio,dueDate:_calDayDate,createdAt:new Date().toISOString()});
renderTodos();
}
saveData();closeModal('calDayModal');showToast(addToTodo?'Takvim + Görev eklendi':'Takvime eklendi');
}
function deleteCalPlan(dateStr,idx){
if(D.calPlans[dateStr]){D.calPlans[dateStr].splice(idx,1);if(!D.calPlans[dateStr].length)delete D.calPlans[dateStr];}
saveData();openCalDay(dateStr);
}
function showConfirm(msg,onYes){_confirmCb=onYes;document.getElementById('confirmMsg').textContent=msg;openModal('confirmModal');}
function confirmYes(){closeModal('confirmModal');if(_confirmCb){_confirmCb();_confirmCb=null;}}
function confirmNo(){closeModal('confirmModal');_confirmCb=null;}
function daysLeft(iso){if(!iso)return 30;return Math.max(0,30-Math.floor((Date.now()-new Date(iso).getTime())/86400000));}
function daysLeftLabel(d){if(d<=0)return'<span style="color:var(--hard);font-weight:500">Bugün silinecek!</span>';if(d<=7)return`<span style="color:var(--mid)">${d} gün kaldı</span>`;return`<span style="color:var(--text3)">${d} gün kaldı</span>`;}
function openTrash(){renderTrashList();openModal('trashModal');}
function renderTrashList(){
const list=document.getElementById('trashList');
const items=[];
(D.contentTrash||[]).forEach((e,i)=>items.push({kind:'content',idx:i,label:e._trashType==='note'?'NOT':'GÜNLÜK',title:e.title||'Başlıksız',trashedAt:e._trashedAt,accent:e._trashType==='note'?'var(--note)':'var(--diary)'}));
const tc={easy:'var(--easy)',mid:'var(--mid)',hard:'var(--hard)'};
(D.trash||[]).forEach((t,i)=>items.push({kind:'todo',idx:i,label:'GÖREV',title:t.text,trashedAt:t.trashedAt,accent:tc[t.priority]||'var(--text3)'}));
if(!items.length){list.innerHTML='<div class="empty-state" style="padding:18px">Çöp kutusu boş \ud83d\uddd1</div>';return;}
list.innerHTML=items.map(item=>{
const dl=daysLeft(item.trashedAt);
const rf=item.kind==='content'?`restoreContent(${item.idx})`:`restoreFromTrash(${item.idx})`;
const df=item.kind==='content'?`permDeleteContent(${item.idx})`:`permDeleteTrash(${item.idx})`;
return`<div class="trash-item"><div style="flex:1;min-width:0;"><div style="display:flex;align-items:center;gap:5px;margin-bottom:2px;"><span style="font-size:.4rem;font-family:'JetBrains Mono',monospace;color:${item.accent};letter-spacing:.1em;border:1px solid ${item.accent};border-radius:3px;padding:1px 4px;flex-shrink:0;opacity:.8;">${item.label}</span><div class="trash-item-text">${escHtml(item.title)}</div></div><div style="font-size:.5rem;font-family:'JetBrains Mono',monospace;">${daysLeftLabel(dl)}</div></div><button class="trash-restore-btn" onclick="${rf}">Geri Al</button><button class="trash-del-btn" onclick="${df}">✕</button></div>`;
}).join('');
}
function restoreContent(i){if(!D.contentTrash)return;const e=D.contentTrash.splice(i,1)[0];const tp=e._trashType;delete e._trashType;delete e._trashedAt;D[tp==='note'?'notes':'diary'].unshift(e);saveData();updTrashBadge();renderTrashList();if(tp==='note')renderNotes();else renderDiary();showToast('Geri alındı');}
function permDeleteContent(i){D.contentTrash.splice(i,1);saveData();updTrashBadge();renderTrashList();}
function restoreFromTrash(i){const t=D.trash.splice(i,1)[0];delete t.trashedAt;delete t.completedAt;D.todos.push(t);saveData();updTrashBadge();renderTrashList();renderTodos();showToast('Görev geri alındı');}
function permDeleteTrash(i){D.trash.splice(i,1);saveData();updTrashBadge();renderTrashList();}
function emptyAllTrash(){showConfirm('Çöpteki her şey kalıcı silinecek?',()=>{D.trash=[];D.contentTrash=[];saveData();updTrashBadge();renderTrashList();showToast('Çöp boşaltıldı');});}
function autoTrash(){if(!D.contentTrash)D.contentTrash=[];const now=Date.now(),mo=30*24*60*60*1000;const mv=D.completedTodos.filter(t=>now-new Date(t.completedAt).getTime()>mo);mv.forEach(t=>{t.trashedAt=new Date().toISOString();D.trash.push(t);});D.completedTodos=D.completedTodos.filter(t=>now-new Date(t.completedAt).getTime()<=mo);D.contentTrash=D.contentTrash.filter(e=>now-new Date(e._trashedAt).getTime()<mo);D.trash=D.trash.filter(t=>!t.trashedAt||(now-new Date(t.trashedAt).getTime()<mo));if(mv.length)saveData();}
function updTrashBadge(){if(!D.contentTrash)D.contentTrash=[];const total=(D.trash||[]).length+(D.contentTrash||[]).length;const b=document.getElementById('trashBadge');if(total>0){b.textContent=total;b.style.display='inline';}else b.style.display='none';}
function selectPriority(p){curPriority=p;document.querySelectorAll('.pp').forEach(el=>el.classList.toggle('sel',el.dataset.p===p));}
function addTodo(){
const inp=document.getElementById('todoInput');
const text=inp.value.trim();if(!text)return;
const rawDue=document.getElementById('todoDate').value;
let dueDate=null,dueTime=null;
if(rawDue){const[d,t]=rawDue.split('T');dueDate=d;dueTime=t?t.slice(0,5):null;}
const repeat=document.getElementById('todoRepeat')?.value||'';
D.todos.push({id:Date.now(),text,priority:curPriority,dueDate:dueDate||null,dueTime:dueTime||null,repeat:repeat||null,createdAt:new Date().toISOString()});
inp.value='';document.getElementById('todoDate').value='';
if(document.getElementById('todoRepeat'))document.getElementById('todoRepeat').value='';
saveData();renderTodos();updateReminderBadge();showToast('Görev eklendi');
}
function confirmReset(type){
const msgs={
kanban:'Tüm Kanban ilerlemen sıfırlanacak ve geri alınamayacaktır. Onaylıyor musun?',
reading:'Tüm okuma listesi ve ilerleme bilgileri silinecek. Onaylıyor musun?',
schedule:'Tüm ders programı verileri silinecek. Onaylıyor musun?'
};
document.getElementById('resetConfirmModal')?.remove();
const modal=document.createElement('div');
modal.id='resetConfirmModal';
modal.style.cssText='position:fixed;inset:0;z-index:9000;background:rgba(0,0,0,.75);display:flex;align-items:center;justify-content:center;padding:20px;';
modal.innerHTML=`<div style="background:var(--bg2);border:1px solid rgba(248,113,113,.35);border-radius:16px;padding:24px;width:100%;max-width:320px;text-align:center;">
<div style="font-size:1.5rem;margin-bottom:10px;">⚠️</div>
<div style="font-size:.86rem;font-weight:600;color:var(--text);margin-bottom:10px;">Emin misin?</div>
<div style="font-size:.76rem;color:var(--text3);line-height:1.6;margin-bottom:20px;">${msgs[type]}</div>
<div style="display:flex;gap:8px;">
<button id="resetCancelBtn" style="flex:1;padding:11px;background:var(--bg3);border:1px solid var(--border);border-radius:9px;color:var(--text2);font-family:'Sora',sans-serif;font-size:.82rem;cursor:pointer;">İptal</button>
<button id="resetConfirmBtn" style="flex:1;padding:11px;background:rgba(248,113,113,.15);border:2px solid rgba(248,113,113,.4);border-radius:9px;color:var(--hard);font-family:'Sora',sans-serif;font-size:.82rem;cursor:pointer;font-weight:600;">Onaylıyorum</button>
</div>
</div>`;
document.body.appendChild(modal);
document.getElementById('resetCancelBtn').onclick=()=>modal.remove();
document.getElementById('resetConfirmBtn').onclick=()=>{doReset(type);modal.remove();};
modal.addEventListener('click',e=>{if(e.target===modal)modal.remove();});
}
function doReset(type){
if(type==='kanban'){D.kanban={todo:[],doing:[],done:[]};saveData();renderKanban();showToast('Kanban sıfırlandı');}
else if(type==='reading'){D.reading=[];saveData();renderReading();showToast('Okuma listesi sıfırlandı');}
else if(type==='schedule'){D.schedule=[];D.scheduleWeeks={};saveData();renderSchedule();showToast('Ders programı sıfırlandı');}
}
function openNoteEdit(id){
const n=D.notes.find(x=>x.id===id);if(!n)return;
const modal=document.createElement('div');
modal.id='noteEditModal';
modal.style.cssText='position:fixed;inset:0;z-index:3500;background:rgba(0,0,0,.6);display:flex;align-items:center;justify-content:center;padding:20px;';
const tagsStr=(n.tags||[]).join(', ');
modal.innerHTML=`<div style="background:var(--bg2);border:1px solid var(--border);border-radius:16px;padding:22px;width:100%;max-width:380px;max-height:85vh;overflow-y:auto;position:relative;">
<button onclick="document.getElementById('noteEditModal').remove()" style="position:absolute;top:10px;right:12px;background:none;border:none;font-size:1.1rem;cursor:pointer;color:var(--text3);">✕</button>
<div style="font-size:.86rem;font-weight:500;color:var(--text);margin-bottom:14px;">✏️ Notu Düzenle</div>
<div style="font-size:.66rem;color:var(--text3);margin-bottom:4px;">Başlık</div>
<input type="text" id="neTitle" value="${escHtml(n.title||'')}" style="width:100%;background:var(--bg3);border:1px solid var(--border);border-radius:8px;padding:9px 12px;font-family:'Sora',sans-serif;font-size:.84rem;color:var(--text);outline:none;margin-bottom:10px;box-sizing:border-box;">
<div style="font-size:.66rem;color:var(--text3);margin-bottom:4px;">İçerik</div>
<textarea id="neContent" rows="5" style="width:100%;background:var(--bg3);border:1px solid var(--border);border-radius:8px;padding:9px 12px;font-family:'Sora',sans-serif;font-size:.82rem;color:var(--text);outline:none;resize:none;margin-bottom:10px;box-sizing:border-box;">${escHtml(n.content||'')}</textarea>
<div style="font-size:.66rem;color:var(--text3);margin-bottom:4px;">Etiketler (virgülle ayır)</div>
<input type="text" id="neTags" value="${escHtml(tagsStr)}" placeholder="ders, ödev, fikir..." style="width:100%;background:var(--bg3);border:1px solid var(--border);border-radius:8px;padding:9px 12px;font-family:'Sora',sans-serif;font-size:.82rem;color:var(--text);outline:none;margin-bottom:14px;box-sizing:border-box;">
<div style="display:flex;gap:8px;">
<button onclick="saveNoteEdit(${id})" style="flex:1;padding:11px;background:linear-gradient(135deg,var(--accent),rgba(124,111,247,.8));border:none;border-radius:10px;color:#fff;font-family:'Sora',sans-serif;font-size:.84rem;cursor:pointer;">Kaydet</button>
<button onclick="deleteNoteConfirm(${id})" style="padding:11px 14px;background:rgba(248,113,113,.1);border:1px solid rgba(248,113,113,.25);border-radius:10px;color:var(--hard);font-family:'Sora',sans-serif;font-size:.84rem;cursor:pointer;">Sil</button>
</div>
</div>`;
document.body.appendChild(modal);
modal.addEventListener('click',e=>{if(e.target===modal)modal.remove();});
}
function saveNoteEdit(id){
const n=D.notes.find(x=>x.id===id);if(!n)return;
n.title=document.getElementById('neTitle')?.value.trim()||n.title;
n.content=document.getElementById('neContent')?.value||'';
const tagsRaw=document.getElementById('neTags')?.value||'';
n.tags=tagsRaw.split(',').map(t=>t.trim()).filter(Boolean);
n.updatedAt=new Date().toISOString();
saveData();renderNotes();document.getElementById('noteEditModal')?.remove();showToast('Not güncellendi ✓');
}
function deleteNoteConfirm(id){
document.getElementById('noteEditModal')?.remove();
showConfirm('Bu notu silmek istiyor musun?',()=>{
const n=D.notes.find(x=>x.id===id);
if(n){D.contentTrash.push({...n,_trashType:'note',_trashedAt:new Date().toISOString()});}
D.notes=D.notes.filter(x=>x.id!==id);
saveData();renderNotes();showToast('Not silindi');
});
}
function openScheduleEdit(id){
const schedWeekly=localStorage.getItem('capsula_sched_weekly')==='on';
const arr=schedWeekly?(D.scheduleWeeks?.[getViewWeekKey()]||[]):D.schedule;
const s=arr.find(x=>x.id===id);if(!s)return;
const modal=document.createElement('div');
modal.id='schedEditModal';
modal.style.cssText='position:fixed;inset:0;z-index:3500;background:rgba(0,0,0,.6);display:flex;align-items:center;justify-content:center;padding:20px;';
const dayNames=['Paz','Pzt','Sal','Çar','Per','Cum','Cmt'];
const daysHtml=[1,2,3,4,5,6,0].map(di=>`
<label style="display:flex;align-items:center;gap:4px;font-size:.7rem;color:var(--text2);cursor:pointer;">
<input type="checkbox" value="${di}" ${s.days.includes(di)?'checked':''} style="accent-color:var(--accent);">
${dayNames[di]}
</label>`).join('');
modal.innerHTML=`<div style="background:var(--bg2);border:1px solid var(--border);border-radius:16px;padding:22px;width:100%;max-width:360px;max-height:90vh;overflow-y:auto;position:relative;">
<button onclick="document.getElementById('schedEditModal').remove()" style="position:absolute;top:10px;right:12px;background:none;border:none;font-size:1.1rem;cursor:pointer;color:var(--text3);">✕</button>
<div style="font-size:.86rem;font-weight:500;color:var(--text);margin-bottom:14px;">✏️ Dersi Düzenle</div>
<div style="font-size:.66rem;color:var(--text3);margin-bottom:4px;">Ders Adı</div>
<input type="text" id="seNameInp" value="${escHtml(s.name)}" style="width:100%;background:var(--bg3);border:1px solid var(--border);border-radius:8px;padding:9px 12px;font-family:'Sora',sans-serif;font-size:.84rem;color:var(--text);outline:none;margin-bottom:10px;box-sizing:border-box;">
<div style="font-size:.66rem;color:var(--text3);margin-bottom:4px;">Alt Başlık / Açıklama</div>
<input type="text" id="seSubInp" value="${escHtml(s.sub||s.room||'')}" placeholder="Ör: Prof. Ahmet Yılmaz, 203 nolu sınıf..." style="width:100%;background:var(--bg3);border:1px solid var(--border);border-radius:8px;padding:9px 12px;font-family:'Sora',sans-serif;font-size:.82rem;color:var(--text);outline:none;margin-bottom:10px;box-sizing:border-box;">
<div style="font-size:.66rem;color:var(--text3);margin-bottom:4px;">Ders Linki (Zoom, Meet vb.)</div>
<input type="url" id="seLinkInp" value="${escHtml(s.link||'')}" placeholder="https://..." style="width:100%;background:var(--bg3);border:1px solid var(--border);border-radius:8px;padding:9px 12px;font-family:'Sora',sans-serif;font-size:.82rem;color:var(--text);outline:none;margin-bottom:10px;box-sizing:border-box;">
<div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-bottom:10px;">
<div>
<div style="font-size:.66rem;color:var(--text3);margin-bottom:4px;">Başlangıç</div>
<input type="time" id="seStartInp" value="${s.start||''}" style="width:100%;background:var(--bg3);border:1px solid var(--border);border-radius:8px;padding:9px 12px;font-family:'Sora',sans-serif;font-size:.82rem;color:var(--text);outline:none;box-sizing:border-box;">
</div>
<div>
<div style="font-size:.66rem;color:var(--text3);margin-bottom:4px;">Bitiş</div>
<input type="time" id="seEndInp" value="${s.end||''}" style="width:100%;background:var(--bg3);border:1px solid var(--border);border-radius:8px;padding:9px 12px;font-family:'Sora',sans-serif;font-size:.82rem;color:var(--text);outline:none;box-sizing:border-box;">
</div>
</div>
<div style="font-size:.66rem;color:var(--text3);margin-bottom:6px;">Günler</div>
<div id="sedays" style="display:flex;flex-wrap:wrap;gap:8px;margin-bottom:14px;">${daysHtml}</div>
<div style="display:flex;gap:8px;">
<button onclick="saveScheduleEdit(${id})" style="flex:1;padding:11px;background:linear-gradient(135deg,var(--accent),rgba(124,111,247,.8));border:none;border-radius:10px;color:#fff;font-family:'Sora',sans-serif;font-size:.84rem;cursor:pointer;">Kaydet</button>
<button onclick="deleteScheduleItem(${id});document.getElementById('schedEditModal')?.remove();" style="padding:11px 14px;background:rgba(248,113,113,.1);border:1px solid rgba(248,113,113,.25);border-radius:10px;color:var(--hard);font-family:'Sora',sans-serif;font-size:.84rem;cursor:pointer;">Sil</button>
</div>
</div>`;
document.body.appendChild(modal);
modal.addEventListener('click',e=>{if(e.target===modal)modal.remove();});
}
function saveScheduleEdit(id){
const schedWeekly=localStorage.getItem('capsula_sched_weekly')==='on';
const arr=schedWeekly?(D.scheduleWeeks?.[getViewWeekKey()]||[]):D.schedule;
const s=arr.find(x=>x.id===id);if(!s)return;
s.name=document.getElementById('seNameInp')?.value.trim()||s.name;
s.room=document.getElementById('seSubInp')?.value.trim()||'';
s.sub=s.room;
s.link=document.getElementById('seLinkInp')?.value.trim()||'';
s.start=document.getElementById('seStartInp')?.value||'';
s.end=document.getElementById('seEndInp')?.value||'';
s.days=[...document.querySelectorAll('#sedays input:checked')].map(i=>parseInt(i.value));
saveData();renderSchedule();document.getElementById('schedEditModal')?.remove();showToast('Ders güncellendi ✓');
}
function openContactModal(){
document.getElementById('contactModal')?.remove();
const modal=document.createElement('div');
modal.id='contactModal';
modal.style.cssText='position:fixed;inset:0;z-index:3500;background:rgba(0,0,0,.65);display:flex;align-items:center;justify-content:center;padding:20px;';
modal.innerHTML=`<div style="background:var(--bg2);border:1px solid var(--border);border-radius:16px;padding:22px;width:100%;max-width:360px;position:relative;">
<button onclick="document.getElementById('contactModal').remove()" style="position:absolute;top:10px;right:12px;background:none;border:none;font-size:1.1rem;cursor:pointer;color:var(--text3);">✕</button>
<div style="font-size:.86rem;font-weight:500;color:var(--text);margin-bottom:4px;">✉️ Bize Ulaşın</div>
<div style="font-size:.62rem;color:var(--text3);margin-bottom:14px;">Öneri, hata bildirimi veya her türlü mesajınızı bekliyoruz.</div>
<div style="font-size:.66rem;color:var(--text3);margin-bottom:4px;">Adınız</div>
<input type="text" id="contactName" placeholder="Adınız..." style="width:100%;background:var(--bg3);border:1px solid var(--border);border-radius:8px;padding:9px 12px;font-family:'Sora',sans-serif;font-size:.82rem;color:var(--text);outline:none;margin-bottom:8px;box-sizing:border-box;">
<div style="font-size:.66rem;color:var(--text3);margin-bottom:4px;">E-posta (yanıt için)</div>
<input type="email" id="contactEmail" placeholder="ornek@mail.com" style="width:100%;background:var(--bg3);border:1px solid var(--border);border-radius:8px;padding:9px 12px;font-family:'Sora',sans-serif;font-size:.82rem;color:var(--text);outline:none;margin-bottom:8px;box-sizing:border-box;">
<div style="font-size:.66rem;color:var(--text3);margin-bottom:4px;">Mesajınız</div>
<textarea id="contactMsg" placeholder="Mesajınızı yazın..." rows="4" style="width:100%;background:var(--bg3);border:1px solid var(--border);border-radius:8px;padding:9px 12px;font-family:'Sora',sans-serif;font-size:.82rem;color:var(--text);outline:none;resize:none;margin-bottom:12px;box-sizing:border-box;"></textarea>
<button id="contactSendBtn" onclick="sendContactForm()" style="width:100%;padding:11px;background:linear-gradient(135deg,var(--accent),rgba(124,111,247,.8));border:none;border-radius:10px;color:#fff;font-family:'Sora',sans-serif;font-size:.84rem;cursor:pointer;transition:opacity .2s;">Gönder</button>
<div id="contactStatus" style="text-align:center;font-size:.68rem;color:var(--text3);margin-top:8px;display:none;"></div>
</div>`;
document.body.appendChild(modal);
modal.addEventListener('click',e=>{if(e.target===modal)modal.remove();});
}
async function sendContactForm(){
const name=document.getElementById('contactName')?.value.trim();
const email=document.getElementById('contactEmail')?.value.trim();
const msg=document.getElementById('contactMsg')?.value.trim();
if(!msg){showToast('Mesaj boş olamaz');return;}
const btn=document.getElementById('contactSendBtn');
const status=document.getElementById('contactStatus');
btn.disabled=true;btn.textContent='Gönderiliyor...';btn.style.opacity='.6';
try{
const formData=new FormData();
formData.append('name',name||'Anonim');
formData.append('email',email||'belirtilmedi');
formData.append('message',msg);
formData.append('_subject','Capsula Geri Bildirimi');
const res=await fetch('https://formspree.io/f/mpqybwjw',{
method:'POST',
body:formData,
headers:{'Accept':'application/json'}
});
const data=await res.json();
if(res.ok){
btn.style.display='none';
status.style.display='block';status.style.color='var(--easy)';
status.innerHTML='✓ Mesajınız iletildi! Teşekkür ederiz \ud83d\ude4f';
showToast('Mesaj gönderildi ✓');
} else {
throw new Error(JSON.stringify(data.errors));
}
}catch(e){
console.error('Form hatası:',e);
btn.disabled=false;btn.textContent='Gönder';btn.style.opacity='1';
status.style.display='block';status.style.color='var(--hard)';
status.innerHTML='Hata oluştu. <a href="mailto:onurbozkan472@gmail.com" style="color:var(--accent2)">Doğrudan mail gönder</a>';
}
}
function checkRecurringTodos(){
const today=new Date().toISOString().split('T')[0];
const lastCheck=localStorage.getItem('capsula_recurring_check');
if(lastCheck===today)return;
localStorage.setItem('capsula_recurring_check',today);
const toAdd=[];
D.completedTodos.filter(t=>t.repeat).forEach(t=>{
const completed=t.completedAt?.split('T')[0]||'';
if(!completed)return;
const cDate=new Date(completed);
const tDate=new Date(today);
let shouldAdd=false;
if(t.repeat==='daily')shouldAdd=true;
else if(t.repeat==='weekly'){const diff=(tDate-cDate)/(1000*60*60*24);shouldAdd=diff>=7;}
else if(t.repeat==='monthly'){shouldAdd=tDate.getMonth()!==cDate.getMonth()||tDate.getFullYear()!==cDate.getFullYear();}
if(shouldAdd&&!D.todos.some(x=>x.text===t.text&&x.repeat===t.repeat)){
toAdd.push({id:Date.now()+Math.random(),text:t.text,priority:t.priority,dueDate:today,dueTime:t.dueTime||null,repeat:t.repeat,createdAt:new Date().toISOString()});
}
});
if(toAdd.length){D.todos.push(...toAdd);saveData();renderTodos();showToast(`${toAdd.length} tekrarlayan görev eklendi \ud83d\udd01`);}
}
function completeTodo(id){const idx=D.todos.findIndex(t=>t.id===id);if(idx===-1)return;const el=document.getElementById('todo-'+id);if(el)el.classList.add('completing');setTimeout(()=>{const t=D.todos.splice(idx,1)[0];t.completedAt=new Date().toISOString();D.completedTodos.unshift(t);saveData();renderTodos();showToast('Tamamlandı ✓');},360);}
function uncompleteTodo(id){const idx=D.completedTodos.findIndex(t=>t.id===id);if(idx===-1)return;const t=D.completedTodos.splice(idx,1)[0];delete t.completedAt;D.todos.push(t);saveData();renderTodos();}
function moveTodoToTrash(id){const idx=D.completedTodos.findIndex(t=>t.id===id);if(idx===-1)return;const t=D.completedTodos.splice(idx,1)[0];t.trashedAt=new Date().toISOString();D.trash.push(t);saveData();updTrashBadge();renderTodos();showToast('Çöpe taşındı');}
function getDueClass(dd){if(!dd)return'';const diff=Math.ceil((new Date(dd)-new Date())/86400000);if(diff<0)return'overdue';if(diff===0)return'today';if(diff<=3)return'soon';return'';}
function getDueLabel(dd){if(!dd)return'';const diff=Math.ceil((new Date(dd)-new Date())/86400000);if(diff<0)return Math.abs(diff)+'g gecikti';if(diff===0)return'Bugün';if(diff===1)return'Yarın';return fmtDate(dd);}
function todoItemHtml(t,labels,dl,dc){
const timeStr=t.dueTime?`<span class="due-tag" style="color:var(--text3);">⏰ ${t.dueTime}</span>`:'';
const repeatIco=t.repeat?`<span style="font-size:.58rem;color:var(--accent2);margin-left:3px;">${t.repeat==='daily'?'\ud83d\udd01 Günlük':t.repeat==='weekly'?'\ud83d\udd01 Haftalık':'\ud83d\udd01 Aylık'}</span>`:'';
return`<div class="todo-item ${t.priority}" id="todo-${t.id}" draggable="true" ondragstart="dragTodo(event,${t.id})">
<div class="todo-check" onclick="completeTodo(${t.id})"></div>
<div class="todo-body" onclick="openTodoEdit(${t.id})" style="cursor:pointer;flex:1;">
<div class="todo-text">${escHtml(t.text)}</div>
<div class="todo-meta">
<span class="todo-badge">${labels[t.priority]}</span>
${dl?`<span class="due-tag ${dc}">${dl}</span>`:''}
${timeStr}${repeatIco}
</div>
</div>
<button onclick="event.stopPropagation();openTodoEdit(${t.id})" style="background:none;border:none;cursor:pointer;color:var(--text3);padding:4px;border-radius:6px;transition:color .15s;" onmouseover="this.style.color='var(--accent2)'" onmouseout="this.style.color='var(--text3)'" title="Düzenle">
<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width:13px;height:13px;"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
</button>
<button onclick="event.stopPropagation();deleteTodoPermanent(${t.id})" style="background:none;border:none;cursor:pointer;color:var(--text3);padding:4px;border-radius:6px;transition:color .15s;" onmouseover="this.style.color='var(--hard)'" onmouseout="this.style.color='var(--text3)'" title="Sil">
<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width:13px;height:13px;"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/></svg>
</button>
</div>`;
}
function openTodoEdit(id){
const t=D.todos.find(x=>x.id===id);if(!t)return;
const modal=document.createElement('div');
modal.id='todoEditModal';
modal.style.cssText='position:fixed;inset:0;z-index:3500;background:rgba(0,0,0,.6);display:flex;align-items:center;justify-content:center;padding:20px;';
const dueDT=t.dueDate?(t.dueTime?`${t.dueDate}T${t.dueTime}`:t.dueDate):'';
modal.innerHTML=`<div style="background:var(--bg2);border:1px solid var(--border);border-radius:16px;padding:22px;width:100%;max-width:360px;position:relative;">
<button onclick="document.getElementById('todoEditModal').remove()" style="position:absolute;top:10px;right:12px;background:none;border:none;font-size:1.1rem;cursor:pointer;color:var(--text3);">✕</button>
<div style="font-size:.86rem;font-weight:500;color:var(--text);margin-bottom:14px;">✏️ Görevi Düzenle</div>
<input type="text" id="teText" value="${escHtml(t.text)}" style="width:100%;background:var(--bg3);border:1px solid var(--border);border-radius:8px;padding:10px 12px;font-family:'Sora',sans-serif;font-size:.86rem;color:var(--text);outline:none;margin-bottom:10px;box-sizing:border-box;">
<div style="font-size:.66rem;color:var(--text3);margin-bottom:6px;">Öncelik</div>
<div style="display:flex;gap:6px;margin-bottom:10px;">
${['easy','mid','hard'].map(p=>`<button onclick="tePrio='${p}';document.querySelectorAll('.te-prio').forEach(b=>b.style.opacity='.4');this.style.opacity='1';" class="te-prio" style="flex:1;padding:6px;border:1px solid var(--border);border-radius:7px;background:var(--bg3);font-family:'Sora',sans-serif;font-size:.7rem;cursor:pointer;color:${p==='easy'?'var(--easy)':p==='mid'?'var(--mid)':'var(--hard)'};opacity:${t.priority===p?'1':'.4'};transition:opacity .15s;">${p==='easy'?'Kolay':p==='mid'?'Orta':'Zor'}</button>`).join('')}
</div>
<div style="font-size:.66rem;color:var(--text3);margin-bottom:6px;">Tarih ve Saat</div>
<input type="datetime-local" id="teDatetime" value="${dueDT}" style="width:100%;background:var(--bg3);border:1px solid var(--border);border-radius:8px;padding:8px 12px;font-family:'Sora',sans-serif;font-size:.78rem;color:var(--text);outline:none;margin-bottom:10px;box-sizing:border-box;">
<div style="font-size:.66rem;color:var(--text3);margin-bottom:6px;">Tekrar</div>
<select id="teRepeat" style="width:100%;background:var(--bg3);border:1px solid var(--border);border-radius:8px;padding:8px 12px;font-family:'Sora',sans-serif;font-size:.78rem;color:var(--text);outline:none;margin-bottom:14px;box-sizing:border-box;">
<option value="" ${!t.repeat?'selected':''}>Tekrar yok</option>
<option value="daily" ${t.repeat==='daily'?'selected':''}>Her gün \ud83d\udd01</option>
<option value="weekly" ${t.repeat==='weekly'?'selected':''}>Her hafta</option>
<option value="monthly" ${t.repeat==='monthly'?'selected':''}>Her ay</option>
</select>
<div style="display:flex;gap:8px;">
<button onclick="saveTodoEdit(${id})" style="flex:1;padding:11px;background:linear-gradient(135deg,var(--accent),rgba(124,111,247,.8));border:none;border-radius:10px;color:#fff;font-family:'Sora',sans-serif;font-size:.84rem;cursor:pointer;">Kaydet</button>
<button onclick="deleteTodoPermanent(${id});document.getElementById('todoEditModal')?.remove();" style="padding:11px 14px;background:rgba(248,113,113,.1);border:1px solid rgba(248,113,113,.25);border-radius:10px;color:var(--hard);font-family:'Sora',sans-serif;font-size:.84rem;cursor:pointer;">Sil</button>
</div>
</div>`;
window.tePrio=t.priority||'easy';
document.body.appendChild(modal);
modal.addEventListener('click',e=>{if(e.target===modal)modal.remove();});
setTimeout(()=>document.getElementById('teText')?.focus(),100);
}
function saveTodoEdit(id){
const t=D.todos.find(x=>x.id===id);if(!t)return;
const text=document.getElementById('teText')?.value.trim();if(!text)return;
const dt=document.getElementById('teDatetime')?.value||'';
let dueDate=null,dueTime=null;
if(dt){const[d,ti]=dt.split('T');dueDate=d;dueTime=ti?ti.slice(0,5):null;}
t.text=text;t.priority=window.tePrio||t.priority;
t.dueDate=dueDate;t.dueTime=dueTime;
t.repeat=document.getElementById('teRepeat')?.value||null;
saveData();renderTodos();document.getElementById('todoEditModal')?.remove();showToast('Güncellendi ✓');
}
function deleteTodoPermanent(id){
D.todos=D.todos.filter(t=>t.id!==id);
saveData();renderTodos();showToast('Görev silindi');
}
function renderStats(){
const el=document.getElementById('statsContent');
if(!el)return;
const now=new Date();
const todayKey=now.toISOString().split('T')[0];
const ws=new Date(now);ws.setDate(now.getDate()-((now.getDay()+6)%7));ws.setHours(0,0,0,0);
const totalTodos=D.todos.length+D.completedTodos.length;
const completedThisWeek=D.completedTodos.filter(t=>new Date(t.completedAt)>=ws).length;
const completedTotal=D.completedTodos.length;
const streak=calcStreak();
const notesCount=D.notes.length;
const diaryCount=D.diary.length;
const booksTotal=D.reading.length;
const booksDone=D.reading.filter(r=>r.status==='done').length;
const booksReading=D.reading.filter(r=>r.status==='reading');
const totalPagesRead=D.reading.reduce((s,r)=>s+(r.pagesRead||0),0);
const prioCount={easy:0,mid:0,hard:0};
D.completedTodos.forEach(t=>prioCount[t.priority||'mid']++);
const last30=[];
for(let i=29;i>=0;i--){
const d=new Date(now);d.setDate(now.getDate()-i);
const dk=d.toISOString().split('T')[0];
last30.push(D.completedTodos.filter(t=>t.completedAt?.startsWith(dk)).length);
}
const avgPerDay=(last30.reduce((s,v)=>s+v,0)/30).toFixed(1);
const maxDay=Math.max(...last30,1);
const kTotal=(D.kanban.todo||[]).length+(D.kanban.doing||[]).length+(D.kanban.done||[]).length;
const kDone=(D.kanban.done||[]).length;
const dayTotals=[0,0,0,0,0,0,0];
D.completedTodos.forEach(t=>{if(t.completedAt)dayTotals[new Date(t.completedAt).getDay()]++;});
const bestDay=['Paz','Pzt','Sal','Çar','Per','Cum','Cmt'][dayTotals.indexOf(Math.max(...dayTotals))];
const analysis=generateLocalAnalysis({streak,completedTotal,completedThisWeek,avgPerDay,notesCount,diaryCount,booksDone,booksTotal,totalPagesRead,prioCount,kDone,kTotal,booksReading});
el.innerHTML=`
<div style="display:grid;grid-template-columns:repeat(2,1fr);gap:8px;margin-bottom:14px;">
<div style="background:var(--bg2);border:1px solid var(--border);border-radius:12px;padding:14px;text-align:center;">
<div style="font-size:1.6rem;font-weight:700;color:var(--accent2);font-family:'JetBrains Mono',monospace;">${completedTotal}</div>
<div style="font-size:.58rem;color:var(--text3);margin-top:2px;">Toplam Görev ✓</div>
</div>
<div style="background:var(--bg2);border:1px solid var(--border);border-radius:12px;padding:14px;text-align:center;">
<div style="font-size:1.6rem;font-weight:700;color:${streak>=7?'var(--hard)':'var(--easy)'};font-family:'JetBrains Mono',monospace;">${streak}\ud83d\udd25</div>
<div style="font-size:.58rem;color:var(--text3);margin-top:2px;">Günlük Seri</div>
</div>
<div style="background:var(--bg2);border:1px solid var(--border);border-radius:12px;padding:14px;text-align:center;">
<div style="font-size:1.6rem;font-weight:700;color:var(--note);font-family:'JetBrains Mono',monospace;">${booksDone}</div>
<div style="font-size:.58rem;color:var(--text3);margin-top:2px;">Kitap Tamamlandı</div>
</div>
<div style="background:var(--bg2);border:1px solid var(--border);border-radius:12px;padding:14px;text-align:center;">
<div style="font-size:1.6rem;font-weight:700;color:var(--diary);font-family:'JetBrains Mono',monospace;">${avgPerDay}</div>
<div style="font-size:.58rem;color:var(--text3);margin-top:2px;">Görev/Gün (ort.)</div>
</div>
</div>
<div style="background:var(--bg2);border:1px solid var(--border);border-radius:12px;padding:14px;margin-bottom:14px;">
<div style="font-size:.6rem;letter-spacing:.15em;font-family:'JetBrains Mono',monospace;color:var(--text3);text-transform:uppercase;margin-bottom:10px;">Son 30 Gün Aktivitesi</div>
<div style="display:flex;align-items:flex-end;gap:2px;height:40px;">
${last30.map((v,i)=>{const h=Math.max(3,Math.round((v/maxDay)*38));const alpha=v===0?0.08:0.2+((v/maxDay)*0.8);const isToday=i===29;return`<div style="flex:1;height:${h}px;background:${isToday?'var(--accent)':`rgba(124,111,247,${alpha})`};border-radius:2px;" title="${v} görev"></div>`;}).join('')}
</div>
<div style="display:flex;justify-content:space-between;margin-top:4px;">
<span style="font-size:.48rem;font-family:'JetBrains Mono',monospace;color:var(--text3);">30 gün önce</span>
<span style="font-size:.48rem;font-family:'JetBrains Mono',monospace;color:var(--accent2);">Bugün</span>
</div>
</div>
<div style="background:var(--bg2);border:1px solid var(--border);border-radius:12px;padding:14px;margin-bottom:14px;">
<div style="font-size:.6rem;letter-spacing:.15em;font-family:'JetBrains Mono',monospace;color:var(--text3);text-transform:uppercase;margin-bottom:10px;">Öncelik Dağılımı</div>
<div style="display:flex;flex-direction:column;gap:6px;">
${[{k:'easy',lbl:'Kolay',clr:'var(--easy)'},{k:'mid',lbl:'Orta',clr:'var(--mid)'},{k:'hard',lbl:'Zor',clr:'var(--hard)'}].map(p=>{const tot=completedTotal||1;return`<div style="display:flex;align-items:center;gap:8px;"><div style="font-size:.66rem;color:var(--text3);width:36px;">${p.lbl}</div><div style="flex:1;background:var(--bg3);border-radius:4px;height:7px;overflow:hidden;"><div style="height:100%;width:${(prioCount[p.k]/tot*100).toFixed(0)}%;background:${p.clr};border-radius:4px;transition:width .5s;"></div></div><div style="font-size:.62rem;font-family:'JetBrains Mono',monospace;color:${p.clr};width:24px;text-align:right;">${prioCount[p.k]}</div></div>`;}).join('')}
</div>
</div>
<div style="background:var(--bg2);border:1px solid var(--border);border-radius:12px;padding:14px;margin-bottom:14px;">
<div style="font-size:.6rem;letter-spacing:.15em;font-family:'JetBrains Mono',monospace;color:var(--text3);text-transform:uppercase;margin-bottom:10px;">Genel Özet</div>
<div style="display:flex;flex-direction:column;gap:7px;">
${[
{lbl:'\ud83d\udcdd Toplam Not',val:notesCount},
{lbl:'\ud83d\udcd6 Günlük Girişi',val:diaryCount},
{lbl:'\ud83d\udccb Kanban Kart',val:`${kDone}/${kTotal} tamamlandı`},
{lbl:'\ud83d\udcda Kitap/Makale',val:`${booksDone}/${booksTotal} bitti`},
{lbl:'⚡ En Verimli Gün',val:bestDay},
{lbl:'\ud83d\udcca Bu Hafta',val:completedThisWeek+' görev'},
].map(r=>`<div style="display:flex;justify-content:space-between;align-items:center;"><span style="font-size:.74rem;color:var(--text2);">${r.lbl}</span><span style="font-size:.76rem;font-family:'JetBrains Mono',monospace;color:var(--accent2);">${r.val}</span></div>`).join('')}
</div>
</div>
${booksReading.length?`<div style="background:var(--bg2);border:1px solid var(--border);border-radius:12px;padding:14px;margin-bottom:14px;">
<div style="font-size:.6rem;letter-spacing:.15em;font-family:'JetBrains Mono',monospace;color:var(--text3);text-transform:uppercase;margin-bottom:10px;">\ud83d\udcda Şu An Okunanlar</div>
${booksReading.map(b=>{const pct=b.pages?Math.round((b.pagesRead||0)/b.pages*100):0;return`<div style="margin-bottom:10px;"><div style="display:flex;justify-content:space-between;margin-bottom:3px;"><span style="font-size:.72rem;color:var(--text2);">${escHtml(b.title)}</span><span style="font-size:.64rem;font-family:'JetBrains Mono',monospace;color:var(--accent2);">${pct}%</span></div><div style="background:var(--bg3);border-radius:4px;height:5px;overflow:hidden;"><div style="height:100%;width:${pct}%;background:linear-gradient(90deg,var(--accent),var(--accent2));border-radius:4px;"></div></div>${getReadingAIEstimate(b)}</div>`;}).join('')}
</div>`:''}
<div style="background:linear-gradient(135deg,rgba(124,111,247,.08),transparent);border:1px solid rgba(124,111,247,.2);border-radius:12px;padding:16px;margin-bottom:14px;">
<div style="font-size:.58rem;letter-spacing:.15em;font-family:'JetBrains Mono',monospace;color:var(--accent2);text-transform:uppercase;margin-bottom:10px;">✦ Capsula Analizi</div>
<div style="font-size:.8rem;color:var(--text2);line-height:1.8;font-weight:300;">${analysis}</div>
</div>
<button onclick="renderStats()" style="width:100%;padding:10px;background:var(--bg2);border:1px solid var(--border);border-radius:10px;color:var(--text2);font-family:'Sora',sans-serif;font-size:.76rem;cursor:pointer;" onmouseover="this.style.background='var(--bg3)'" onmouseout="this.style.background='var(--bg2)'">
\ud83d\udd04 Yenile
</button>
`;
}
function generateLocalAnalysis(d){
const lines=[];
if(d.streak>=14)lines.push(`\ud83d\udd25 ${d.streak} günlük serin var — bu ciddi bir disiplin! Devam et.`);
else if(d.streak>=7)lines.push(`⚡ ${d.streak} günlük aktif seri — momentum yakaladın, kaybetme.`);
else if(d.streak>=3)lines.push(`✨ ${d.streak} günlük seri — iyi başlangıç, her gün küçük bir şey yap.`);
else lines.push(`\ud83d\udca1 Günlük aktif kullanım serini ${d.streak}. Her gün bir görev bile sayılıyor.`);
const rate=parseFloat(d.avgPerDay);
if(rate>=3)lines.push(`\ud83d\udcc8 Günde ortalama ${d.avgPerDay} görev tamamlıyorsun — oldukça üretken bir hız.`);
else if(rate>=1)lines.push(`\ud83d\udcca Günde ~${d.avgPerDay} görev ortalaman var. Bu haftaki hedefin 1 fazlasını tamamlamayı dene.`);
else if(d.completedTotal>0)lines.push(`\ud83d\udcc9 Hız biraz yavaş görünüyor. Küçük, tamamlanabilir görevler eklemek motivasyonu artırır.`);
const total=d.completedTotal||1;
if(d.prioCount.hard/total>0.4)lines.push(`\ud83d\udcaa Görevlerinin ${Math.round(d.prioCount.hard/total*100)}%'i "Zor" kategorisinde — zorlu işlere girişmekten çekinmiyorsun.`);
if(d.prioCount.easy/total>0.6)lines.push(`\ud83d\udcad Görevlerin çoğu "Kolay" — biraz daha zorlu hedefler koymayı deneyebilirsin.`);
if(d.booksDone>0)lines.push(`\ud83d\udcda ${d.booksDone} kitap/makale tamamladın. Toplamda ${d.totalPagesRead} sayfa okudun.`);
if(d.booksReading.length>0){
const b=d.booksReading[0];
if(b.pages&&b.pagesRead){
const pct=Math.round(b.pagesRead/b.pages*100);
lines.push(`\ud83d\udcd6 "${b.title}" kitabındasın (${pct}%). ${pct<50?'Yarı yola gelmeden bırakma.':pct<80?'Bitiş çizgisi yaklaşıyor!':'Neredeyse bitti, azıcık kaldı!'}`);
}
}
if(d.notesCount>10)lines.push(`\ud83d\udcdd ${d.notesCount} notun var — bilgi biriktiriyorsun, bunları zaman zaman gözden geçirmeyi unutma.`);
if(d.diaryCount>5)lines.push(`✍️ ${d.diaryCount} günlük girişin var — kendini yansıtma alışkanlığı güçlü bir özellik.`);
return lines.join('<br><br>');
}
function dragTodo(e,id){e.dataTransfer.setData('todoId',String(id));e.dataTransfer.effectAllowed='move';}
function renderTodos(){
const labels={hard:'Zor',mid:'Orta',easy:'Kolay'};
const clr={easy:'var(--easy)',mid:'var(--mid)',hard:'var(--hard)'};
const today=new Date();today.setHours(0,0,0,0);
const todayKey=today.toISOString().split('T')[0];
const cols=[
{key:'easy',lbl:'Kolay',clr:'var(--easy)',ico:'\ud83d\udfe2'},
{key:'mid',lbl:'Orta',clr:'var(--mid)',ico:'\ud83d\udfe1'},
{key:'hard',lbl:'Zor',clr:'var(--hard)',ico:'\ud83d\udd34'},
];
let html='<div style="display:grid;grid-template-columns:repeat(3,1fr);gap:10px;margin-bottom:14px;">';
cols.forEach(col=>{
const items=D.todos.filter(t=>(t.priority||'mid')===col.key);
html+=`<div style="background:var(--bg2);border:1px solid var(--border);border-radius:12px;overflow:hidden;">
<div style="padding:9px 10px;border-bottom:1px solid var(--border);display:flex;align-items:center;gap:5px;">
<span style="font-size:.6rem;">${col.ico}</span>
<span style="font-size:.72rem;font-weight:500;color:${col.clr};">${col.lbl}</span>
<span style="font-size:.58rem;font-family:'JetBrains Mono',monospace;color:var(--text3);margin-left:auto;">${items.length}</span>
</div>
<div style="padding:8px 8px;display:flex;flex-direction:column;gap:5px;min-height:60px;">`;
items.forEach(t=>{
const isOverdue=t.dueDate&&new Date(t.dueDate)<today;
const isToday=t.dueDate===todayKey;
html+=`<div style="background:var(--bg3);border:1px solid ${isOverdue?'rgba(248,113,113,.3)':isToday?'rgba(124,111,247,.25)':'var(--border)'};border-radius:8px;padding:7px 8px;cursor:pointer;position:relative;" ondragstart="dragTodo(event,${t.id})" draggable="true">
<div style="font-size:.72rem;color:var(--text2);line-height:1.4;padding-right:28px;" onclick="openTodoEdit(${t.id})">${escHtml(t.text)}</div>
${t.dueDate?`<div style="font-size:.54rem;font-family:'JetBrains Mono',monospace;color:${isOverdue?'var(--hard)':isToday?'var(--accent2)':'var(--text3)'};margin-top:3px;">${isToday?'Bugün':getDueLabel(t.dueDate)}</div>`:''}
${t.repeat?`<div style="font-size:.5rem;color:var(--accent2);">\ud83d\udd01 ${t.repeat==='daily'?'Günlük':t.repeat==='weekly'?'Haftalık':'Aylık'}</div>`:''}
<button onclick="completeTodo(${t.id})" style="position:absolute;top:5px;right:5px;width:20px;height:20px;border-radius:50%;border:1.5px solid var(--border);background:none;cursor:pointer;display:flex;align-items:center;justify-content:center;transition:all .18s;" onmouseover="this.style.background='var(--easy)';this.style.borderColor='var(--easy)'" onmouseout="this.style.background='none';this.style.borderColor='var(--border)'">
<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" style="width:9px;height:9px;pointer-events:none;"><polyline points="20 6 9 17 4 12"/></svg>
</button>
</div>`;
});
if(!items.length)html+=`<div style="font-size:.64rem;color:var(--text3);text-align:center;padding:10px 0;font-style:italic;">Görev yok</div>`;
html+='</div></div>';
});
html+='</div>';
if(!D.todos.length)html='<div class="empty-state">'+'Aktif görev yok 🎉'+'</div>';
document.getElementById('todo-active-list').innerHTML=html;
let ch='';
if(D.completedTodos.length){
ch=`<button class="completed-toggle ${completedOpen?'open':''}" onclick="toggleCompleted()"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="9 18 15 12 9 6"/></svg>Tamamlananlar<span class="completed-badge">${D.completedTodos.length}</span></button>
<div class="completed-list ${completedOpen?'open':''}">`;
D.completedTodos.forEach(t=>{
ch+=`<div class="todo-item done ${t.priority}" id="todo-done-${t.id}"><div class="todo-check" onclick="uncompleteTodo(${t.id})"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" style="width:9px;height:9px;color:var(--text3)"><polyline points="20 6 9 17 4 12"/></svg></div><div class="todo-body"><div class="todo-text">${escHtml(t.text)}</div><div class="todo-meta"><span class="due-tag">${fmtDate(t.completedAt)}</span></div></div><button onclick="moveTodoToTrash(${t.id})" style="background:none;border:none;cursor:pointer;color:var(--text3);font-size:.75rem;padding:2px 4px;" onmouseover="this.style.color='var(--hard)'" onmouseout="this.style.color='var(--text3)'">\ud83d\uddd1</button></div>`;
});
ch+='</div>';
}
document.getElementById('todo-completed-section').innerHTML=ch;
}
function toggleCompleted(){completedOpen=!completedOpen;renderTodos();}
function tagColor(tag){const colors=['#60a5fa','#a78bfa','#f472b6','#4ade80','#fb923c','#f87171','#fbbf24','#34d399'];let h=0;for(let c of tag)h=(h*31+c.charCodeAt(0))%colors.length;return colors[h];}
function renderNotes(){
const grid=document.getElementById('notes-grid');
const empty=document.getElementById('notes-empty');
if(!D.notes.length){grid.innerHTML='';empty.style.display='block';return;}
empty.style.display='none';
const items=D.notes.map(n=>{
const tags=(n.tags||[]).map(t=>`<span class="note-tag-chip" style="color:${tagColor(t)};border-color:${tagColor(t)}44;">#${escHtml(t)}</span>`).join('');
const nid=n.id;
return '<div class="note-card">'
+'<div class="note-card-title">'+escHtml(n.title||'Başlıksız')+'</div>'
+'<div class="note-card-preview">'+escHtml((n.content||'').slice(0,80))+'</div>'
+(tags?'<div style="display:flex;gap:3px;flex-wrap:wrap;">'+tags+'</div>':'')
+'<div class="note-card-date">'+fmtDate(n.createdAt)+'</div>'
+'<div style="display:flex;gap:6px;margin-top:8px;padding-top:8px;border-top:1px solid var(--border);">'
+'<button style="flex:1;background:var(--bg3);border:1px solid var(--border);border-radius:7px;padding:5px 0;font-size:.6rem;color:var(--text2);cursor:pointer;" onclick="event.stopPropagation();openNoteEdit('+nid+')">✏️ Düzenle</button>'
+'<button style="flex:1;background:var(--bg3);border:1px solid var(--border);border-radius:7px;padding:5px 0;font-size:.6rem;color:var(--text2);cursor:pointer;" onclick="event.stopPropagation();deleteNoteConfirm('+nid+')">\ud83d\uddd1 Sil</button>'
+'</div>'
+'</div>';
});
grid.innerHTML=items.join('');
grid.querySelectorAll('.note-card').forEach((card,i)=>{
const n=D.notes[i];
if(!n)return;
card.style.cursor='pointer';
card.addEventListener('click',function(e){
if(e.target.tagName==='BUTTON')return;
viewEntry('note',n.id);
});
});
}
function renderDiary(){
renderDiaryAIPrompt();
const list=document.getElementById('diary-list');const empty=document.getElementById('diary-empty');
if(!D.diary.length){list.innerHTML='';empty.style.display='block';return;}
empty.style.display='none';
list.innerHTML=D.diary.map(e=>`<div class="diary-entry" onclick="viewEntry('diary',${e.id})"><div class="diary-entry-header"><span class="diary-entry-date">${fmtDateFull(e.createdAt)}</span><span class="diary-mood-icon">${e.mood||'\ud83d\ude0a'}</span></div><div class="diary-entry-title">${escHtml(e.title||'Günlük Girişi')}</div><div class="diary-entry-preview">${escHtml(e.content||'')}</div></div>`).join('');
}
function openEditor(type,prefill){
editorType=type;editorMediaFiles=[];editorTags=[];
document.getElementById('editorTitle').value=prefill?.title||'';
document.getElementById('editorContent').value=prefill?.content||'';
document.getElementById('mediaPreview').innerHTML='';
document.getElementById('tagInput').value='';
document.getElementById('tagPreview').innerHTML='';
document.getElementById('editorBadge').textContent=type==='note'?'Not':'Günlük Girişi';
document.getElementById('editorBadge').className='etb '+type;
document.getElementById('editorSaveBtn').className='editor-save-btn '+type;
document.getElementById('moodRow').style.display=type==='diary'?'block':'none';
setTimeout(updateWordCount,50);
document.getElementById('tagRow').style.display=type==='note'?'flex':'none';
selMoodVal='\ud83d\ude0a';
document.querySelectorAll('.mood-chip').forEach(c=>c.classList.toggle('sel',c.dataset.mood==='\ud83d\ude0a'));
if(type==='diary'){const now=new Date();document.getElementById('diaryDate').value=`${now.getFullYear()}-${String(now.getMonth()+1).padStart(2,'0')}-${String(now.getDate()).padStart(2,'0')}`;}
document.getElementById('editorOverlay').classList.add('open');
setTimeout(()=>document.getElementById('editorTitle').focus(),400);
}
function selMood(el){selMoodVal=el.dataset.mood;document.querySelectorAll('.mood-chip').forEach(c=>c.classList.remove('sel'));el.classList.add('sel');}
function addTag(){const inp=document.getElementById('tagInput');const raw=inp.value.replace('#','').replace(',','').trim();if(!raw||editorTags.includes(raw))return;editorTags.push(raw);inp.value='';renderTagPreview();}
function renderTagPreview(){document.getElementById('tagPreview').innerHTML=editorTags.map((t,i)=>`<span class="tag-chip" style="color:${tagColor(t)};border-color:${tagColor(t)}44;">#${escHtml(t)}<span onclick="removeTag(${i})" style="cursor:pointer;margin-left:3px;opacity:.6;">✕</span></span>`).join('');}
function removeTag(i){editorTags.splice(i,1);renderTagPreview();}
function handleMedia(e,type){Array.from(e.target.files).forEach(file=>{const r=new FileReader();r.onload=ev=>{editorMediaFiles.push({type,name:file.name,data:ev.target.result});renderMPrev();};r.readAsDataURL(file);});e.target.value='';}
function renderMPrev(){document.getElementById('mediaPreview').innerHTML=editorMediaFiles.map((m,i)=>{if(m.type==='image')return`<div class="media-thumb"><img src="${m.data}"><button class="media-remove" onclick="removeMedia(${i})">✕</button></div>`;if(m.type==='video')return`<div class="media-thumb"><video src="${m.data}"></video><button class="media-remove" onclick="removeMedia(${i})">✕</button></div>`;return`<div class="media-thumb audio"><span>\ud83c\udfb5 ${escHtml(m.name)}</span><button class="media-remove" onclick="removeMedia(${i})">✕</button></div>`;}).join('');}
function removeMedia(i){editorMediaFiles.splice(i,1);renderMPrev();}
function saveEntry(){
const title=document.getElementById('editorTitle').value.trim();
const content=document.getElementById('editorContent').value.trim();
if(!title&&!content){showToast('Bir şeyler yaz önce');return;}
let createdAt=new Date().toISOString();
if(editorType==='diary'){const dv=document.getElementById('diaryDate').value;if(dv){const[y,m,d]=dv.split('-');const dt=new Date();dt.setFullYear(+y,+m-1,+d);createdAt=dt.toISOString();}}
const entry={id:Date.now(),title:title||(editorType==='note'?'Başlıksız Not':'Günlük Girişi'),content,media:[...editorMediaFiles],tags:[...editorTags],createdAt};
if(editorType==='diary')entry.mood=selMoodVal;
D[editorType==='note'?'notes':'diary'].unshift(entry);
saveData();document.getElementById('editorOverlay').classList.remove('open');
if(editorType==='note')renderNotes();else renderDiary();
showToast(editorType==='note'?'Not kaydedildi ✦':'Günlük eklendi ✦');
}
document.getElementById('editorOverlay').addEventListener('click',e=>{if(e.target===document.getElementById('editorOverlay'))document.getElementById('editorOverlay').classList.remove('open');});
function viewEntry(type,id){
const arr=type==='note'?D.notes:D.diary;
const entry=arr.find(e=>e.id===id);if(!entry)return;
viewingEntry={type,id};
const overlay=document.getElementById('viewOverlay');
if(overlay&&overlay.parentElement!==document.body){
document.body.appendChild(overlay);
}
const badge=document.getElementById('viewBadge');badge.textContent=type==='note'?'Not':'Günlük Girişi';badge.className='etb '+type;
const editBtn=document.getElementById('viewEditBtn');
if(editBtn)editBtn.style.display=type==='note'?'inline-flex':'none';
let mH='';
if(entry.media?.length){const imgs=entry.media.filter(m=>m.type==='image').map(m=>`<img src="${m.data}">`).join('');const vids=entry.media.filter(m=>m.type==='video').map(m=>`<video src="${m.data}" controls style="width:100%;border-radius:9px;margin-top:7px"></video>`).join('');const auds=entry.media.filter(m=>m.type==='audio').map(m=>`<audio src="${m.data}" controls style="width:100%;margin-top:7px"></audio>`).join('');mH=`<div class="view-media-grid">${imgs}${vids}</div>${auds}`;}
const tagsH=(entry.tags||[]).length?`<div style="display:flex;gap:5px;flex-wrap:wrap;margin-bottom:10px;">${(entry.tags||[]).map(t=>`<span class="tag-chip" style="color:${tagColor(t)};border-color:${tagColor(t)}44;">#${escHtml(t)}</span>`).join('')}</div>`:'';
document.getElementById('viewBody').innerHTML=`${entry.mood?`<div style="font-size:1.3rem;margin-bottom:7px">${entry.mood}</div>`:''}<div class="view-title">${escHtml(entry.title)}</div><div class="view-meta">${fmtDateFull(entry.createdAt)}</div>${tagsH}<div class="view-text">${escHtml(entry.content)}</div>${mH}<button class="view-delete-btn" id="viewDeleteBtn">\ud83d\uddd1 Çöpe Taşı</button>`;
document.getElementById('viewDeleteBtn').addEventListener('click',()=>deleteEntry());
overlay.classList.add('open');
}
function openCurrentEntryEdit(){
if(!viewingEntry)return;
closeView();
setTimeout(()=>openNoteEdit(viewingEntry.id),200);
}
function closeView(){document.getElementById('viewOverlay').classList.remove('open');}
document.getElementById('viewOverlay').addEventListener('click',e=>{if(e.target===document.getElementById('viewOverlay'))closeView();});
function deleteEntry(){
if(!viewingEntry)return;
const key=viewingEntry.type==='note'?'notes':'diary';
const idx=D[key].findIndex(e=>e.id===viewingEntry.id);if(idx===-1)return;
const entry=D[key].splice(idx,1)[0];
if(!D.contentTrash)D.contentTrash=[];
entry._trashType=viewingEntry.type;entry._trashedAt=new Date().toISOString();
D.contentTrash.unshift(entry);saveData();closeView();
if(viewingEntry.type==='note')renderNotes();else renderDiary();
updTrashBadge();showToast('Çöpe taşındı · 30 gün içinde silinir');
}
function doSearch(query){
const results=document.getElementById('search-results');
if(!query.trim()){results.innerHTML='';return;}
const q=query.toLowerCase();const found=[];
D.notes.forEach(n=>{if((n.title+' '+n.content+' '+(n.tags||[]).join(' ')).toLowerCase().includes(q))found.push({type:'note',entry:n,section:'Not'});});
D.diary.forEach(e=>{if((e.title+' '+e.content).toLowerCase().includes(q))found.push({type:'diary',entry:e,section:'Günlük'});});
D.todos.forEach(t=>{if(t.text.toLowerCase().includes(q))found.push({type:'todo',entry:t,section:'Görev'});});
D.completedTodos.forEach(t=>{if(t.text.toLowerCase().includes(q))found.push({type:'todo-done',entry:t,section:'Görev ✓'});});
['todo','doing','done'].forEach(col=>{(D.kanban[col]||[]).forEach(c=>{if(c.text.toLowerCase().includes(q))found.push({type:'kanban',entry:c,section:'Kanban'});});});
D.reading.forEach(r=>{if((r.title+' '+(r.author||'')).toLowerCase().includes(q))found.push({type:'reading',entry:r,section:'Kitap'});});
D.schedule.forEach(s=>{if((s.name+' '+(s.room||'')).toLowerCase().includes(q))found.push({type:'schedule',entry:s,section:'Ders'});});
if(!found.length){results.innerHTML='<div style="text-align:center;padding:20px;color:var(--text3);font-size:.76rem;">Sonuç bulunamadı.</div>';return;}
function hl(text,q){if(!text)return'';const re=new RegExp('('+q.replace(/[.*+?^${}()|[\]\\]/g,'\\$&')+')','gi');return escHtml(text).replace(re,'<mark style="background:rgba(124,111,247,.25);color:var(--accent2);border-radius:3px;padding:0 2px;">$1</mark>');}
const sectionClr={not:'var(--accent)',günlük:'var(--diary)',görev:'var(--easy)','görev ✓':'var(--text3)',kanban:'var(--mid)',kitap:'var(--note)',ders:'var(--easy)'};
results.innerHTML=found.map(r=>{
const title=r.entry.text||r.entry.title||r.entry.name||'';
const snip=r.entry.content?(r.entry.content.slice(0,80)):r.entry.author||r.entry.room||'';
const clr=sectionClr[r.section.toLowerCase()]||'var(--text3)';
let action='';
if(r.type==='note')action=`viewEntry('note',${r.entry.id})`;
else if(r.type==='diary')action=`viewEntry('diary',${r.entry.id})`;
else if(r.type==='kanban')action=`switchPage('kanban')`;
else if(r.type==='reading')action=`switchPage('reading')`;
else if(r.type==='schedule')action=`switchPage('schedule')`;
else action=`switchPage('todo')`;
return`<div class="search-result-item" onclick="${action}"><div class="srt" style="background:${clr}18;color:${clr};border:1px solid ${clr}33;">${r.section}</div><div class="srTitle">${hl(title,q)}</div>${snip?`<div class="srSnip">${hl(snip,q)}</div>`:''}</div>`;
}).join('');
}
function renderDashboard(){
const now=new Date();
const hr=now.getHours();
const greet=hr<6?'Gece geç saatler…':hr<12?'Günaydın,':hr<17?'İyi günler,':hr<21?'İyi akşamlar,':'İyi geceler,';
document.getElementById('dashGreeting').textContent=greet+' '+D.profile.name.split(' ')[0]+'!';
document.getElementById('dashDate').textContent=fmtDateFull(now.toISOString());
if(curMode==='uni'){renderStudentDashboard(now);return;}
const todayKey=now.toISOString().split('T')[0];
const todayTodos=D.todos.filter(t=>t.dueDate===todayKey);
const overdue=D.todos.filter(t=>t.dueDate&&new Date(t.dueDate)<now);
const ex=document.getElementById('dashStudentExtra');if(ex)ex.innerHTML='';
document.getElementById('dashGrid').innerHTML=`
<div class="dash-card" onclick="switchPage('todo')"><div class="dash-card-icon">\ud83d\udccb</div><div class="dash-card-num">${D.todos.length}</div><div class="dash-card-label">Aktif Görev</div></div>
<div class="dash-card" onclick="switchPage('notes')"><div class="dash-card-icon">\ud83d\udcdd</div><div class="dash-card-num">${D.notes.length}</div><div class="dash-card-label">Not</div></div>
<div class="dash-card" onclick="switchPage('diary')"><div class="dash-card-icon">\ud83d\udcd6</div><div class="dash-card-num">${D.diary.length}</div><div class="dash-card-label">Günlük</div></div>
<div class="dash-card" onclick="switchPage('todo')" style="${overdue.length?'border-color:rgba(248,113,113,.3);':''}"><div class="dash-card-icon">${overdue.length?'⚠️':'✅'}</div><div class="dash-card-num" style="${overdue.length?'color:var(--hard)':''}">${overdue.length}</div><div class="dash-card-label" style="${overdue.length?'color:var(--hard)':''}">Gecikmiş</div></div>
`;
const tl=todayTodos.length?todayTodos.map(t=>`<div class="dash-todo-row"><div class="dash-todo-dot" style="background:${t.priority==='hard'?'var(--hard)':t.priority==='mid'?'var(--mid)':'var(--easy)'}"></div><div class="dash-todo-text">${escHtml(t.text)}</div></div>`).join(''):'<div style="color:var(--text3);font-size:.74rem;font-weight:300;font-style:italic;padding:6px 0;">'+'Bugün için görev yok.'+'</div>';
document.getElementById('dashTodayList').innerHTML=tl;
const q=getDayQuote(now.getFullYear(),now.getMonth(),now.getDate());
document.getElementById('dashQuote').innerHTML=`<div class="dash-quote-text">"${escHtml(q.text)}"</div><div class="dash-quote-author">— ${escHtml(q.author)}</div>`;
}
function renderStudentDashboard(now){
const todayKey=now.toISOString().split('T')[0];
const todayDow=now.getDay();
const todayLessons=D.schedule.filter(s=>s.days.includes(todayDow)).sort((a,b)=>a.start.localeCompare(b.start));
const todayMs=new Date().setHours(0,0,0,0);
const upcomingExams=[...D.exams].filter(e=>{if(!e.date)return false;const d=new Date(e.date);d.setHours(0,0,0,0);const diff=Math.round((d-todayMs)/86400000);return diff>=0&&diff<=7;}).sort((a,b)=>a.date.localeCompare(b.date));
const overdueCount=D.todos.filter(t=>t.dueDate&&new Date(t.dueDate)<new Date()).length;
document.getElementById('dashGrid').innerHTML=`
<div class="dash-card" onclick="switchPage('schedule')" style="border-color:rgba(244,114,182,.2)">
<div class="dash-card-icon">\ud83d\uddd3</div><div class="dash-card-num" style="color:#f9a8d4">${todayLessons.length}</div><div class="dash-card-label">Bugün Ders</div>
</div>
<div class="dash-card" onclick="switchPage('exams')" style="${upcomingExams.length?'border-color:rgba(251,146,60,.25);':''}">
<div class="dash-card-icon">${upcomingExams.length?'⚠️':'✅'}</div><div class="dash-card-num" style="${upcomingExams.length?'color:var(--mid)':''}">${upcomingExams.length}</div><div class="dash-card-label">7 Günde Sınav</div>
</div>
<div class="dash-card" onclick="switchPage('notebook')">
<div class="dash-card-icon">\ud83d\udcd3</div><div class="dash-card-num">${D.notebook.length}</div><div class="dash-card-label">Ders Notu</div>
</div>
<div class="dash-card" onclick="switchPage('pomodoro')" style="${overdueCount?'border-color:rgba(248,113,113,.25);':''}">
<div class="dash-card-icon">\ud83c\udf45</div><div class="dash-card-num" style="${overdueCount?'color:var(--hard)':''}">${overdueCount}</div><div class="dash-card-label">${overdueCount?'Gecikmiş':'Pomodoro'}</div>
</div>
`;
document.getElementById('dashTodayList').innerHTML='';
document.getElementById('dashQuote').innerHTML='';
const typeIco={exam:'\ud83d\udcdd',hw:'\ud83d\udcda',project:'\ud83d\udd2c'};
const lessonsHtml=todayLessons.length?todayLessons.map(l=>`<div class="sdash-lesson"><div class="sdash-lesson-bar" style="background:${l.color}"></div><div class="sdash-lesson-info"><div class="sdash-lesson-name">${escHtml(l.name)}</div>${l.room?`<div class="sdash-lesson-room">${escHtml(l.room)}</div>`:''}</div><div class="sdash-lesson-time">${l.start||''}${l.start&&l.end?' – ':''}${l.end||''}</div></div>`).join(''):'<div style="color:var(--text3);font-size:.72rem;font-style:italic;padding:6px 0;">Bugün ders yok \ud83c\udf89</div>';
const examsHtml=upcomingExams.length?upcomingExams.map(e=>{const d=new Date(e.date);d.setHours(0,0,0,0);const diff=Math.round((d-todayMs)/86400000);const diffStr=diff===0?'Bugün!':diff===1?'Yarın':`${diff} gün kaldı`;const cls=diff===0?'color:var(--mid)':diff<=3?'color:var(--accent2)':'color:var(--text3)';return`<div class="sdash-exam"><span class="sdash-exam-ico">${typeIco[e.type]||'\ud83d\udcdd'}</span><div class="sdash-exam-info"><div class="sdash-exam-name">${escHtml(e.name)}</div><div class="sdash-exam-date">${fmtDate(e.date)}${e.time?' · '+e.time:''}</div></div><div class="sdash-exam-diff" style="${cls}">${diffStr}</div></div>`;}).join(''):'<div style="color:var(--text3);font-size:.72rem;font-style:italic;padding:6px 0;">7 günde sınav yok \ud83d\udc4d</div>';
const q=getDayQuote(now.getFullYear(),now.getMonth(),now.getDate());
let extra=document.getElementById('dashStudentExtra');
if(!extra){extra=document.createElement('div');extra.id='dashStudentExtra';document.getElementById('page-home').appendChild(extra);}
extra.innerHTML=`
<div class="sdash-section"><div class="sdash-section-title"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width:12px;height:12px"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="3" y1="10" x2="21" y2="10"/></svg>Bugünün Programı<button onclick="switchPage('schedule')" class="sdash-more-btn">Tümü →</button></div><div class="sdash-lessons">${lessonsHtml}</div></div>
<div class="sdash-section"><div class="sdash-section-title"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width:12px;height:12px"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/></svg>Yaklaşan Sınavlar<button onclick="switchPage('exams')" class="sdash-more-btn">Tümü →</button></div><div class="sdash-exams">${examsHtml}</div></div>
<div class="dash-quote" style="margin-top:12px"><div class="dash-quote-text">"${escHtml(q.text)}"</div><div class="dash-quote-author">— ${escHtml(q.author)}</div></div>
`;
}
