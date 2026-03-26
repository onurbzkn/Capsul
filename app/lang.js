var _lang=localStorage.getItem('capsula_lang')||'tr';
function getLang(){return _lang;}
function t(k){return (LANG[_lang]&&LANG[_lang][k])||LANG.tr[k]||k;}
function setLang(lang){
_lang=lang;localStorage.setItem('capsula_lang',lang);
applyLangToDOM();
if(typeof initApp==='function'){renderTodos();renderNotes();renderDiary();renderDashboard();renderKanban();renderReading();renderSchedule();renderExams();renderNotebook();renderHabits();buildNav();}
var el=document.getElementById('currentLangLabel');if(el)el.textContent=lang==='en'?'English':'Türkçe';
showToast(lang==='en'?'Language changed to English':'Dil Türkçe olarak değiştirildi');
}
function applyLangToDOM(){
document.querySelectorAll('[data-i18n]').forEach(function(el){
var k=el.getAttribute('data-i18n');
var v=t(k);if(v&&v!==k)el.textContent=v;
});
document.querySelectorAll('[data-i18n-placeholder]').forEach(function(el){
var k=el.getAttribute('data-i18n-placeholder');
var v=t(k);if(v&&v!==k)el.placeholder=v;
});
document.querySelectorAll('[data-i18n-title]').forEach(function(el){
var k=el.getAttribute('data-i18n-title');
var v=t(k);if(v&&v!==k)el.title=v;
});
document.querySelectorAll('[data-i18n-html]').forEach(function(el){
var k=el.getAttribute('data-i18n-html');
var v=t(k);if(v&&v!==k)el.innerHTML=v;
});
}
function getQuotes(){return _lang==='en'?QUOTES_EN:QUOTES_TR;}
