var _lang=localStorage.getItem('capsula_lang')||'tr';
function getLang(){return _lang;}
function t(k){return (LANG[_lang]&&LANG[_lang][k])||LANG.tr[k]||k;}
function setLang(lang){
_lang=lang;localStorage.setItem('capsula_lang',lang);
applyLangToDOM();
if(typeof renderTodos==='function'){renderTodos();renderNotes();renderDiary();renderDashboard();renderKanban();renderReading();renderSchedule();renderExams();renderNotebook();renderHabits();renderPro();buildNav();updateProfileUI();}
var el=document.getElementById('currentLangLabel');if(el)el.textContent=lang==='en'?'English':'Türkçe';
showToast(lang==='en'?'Language changed to English':'Dil Türkçe olarak değiştirildi');
}
function applyLangToDOM(){
document.querySelectorAll('[data-i18n]').forEach(function(el){var k=el.getAttribute('data-i18n');var v=t(k);if(v&&v!==k)el.textContent=v;});
document.querySelectorAll('[data-i18n-placeholder]').forEach(function(el){var k=el.getAttribute('data-i18n-placeholder');var v=t(k);if(v&&v!==k)el.placeholder=v;});
document.querySelectorAll('[data-i18n-title]').forEach(function(el){var k=el.getAttribute('data-i18n-title');var v=t(k);if(v&&v!==k)el.title=v;});
document.querySelectorAll('[data-i18n-html]').forEach(function(el){var k=el.getAttribute('data-i18n-html');var v=t(k);if(v&&v!==k)el.innerHTML=v;});
}
var LANG={
tr:{
// Nav
navNote:'Not',navTask:'Görev',navFocus:'Odak',navDiary:'Günlük',navSearch:'Ara',navSchedule:'Program',
// Page titles
pageHome:'Ana Ekran',pageStats:'İstatistikler',pageTodo:'Görevler',pageNotes:'Notlar',pageDiary:'Günlük',pageSearch:'Arama',pagePomodoro:'Pomodoro',pageKanban:'Kanban',pageWeekly:'Haftalık Özet',pageReading:'Okuma Listesi',pagePro:'Profesyonel',pageSchedule:'Ders Programı',pageExams:'Sınav Takvimi',pageNotebook:'Not Defteri',pageHabits:'Alışkanlıklar',
// Greetings
greetNight:'Gece geç saatler…',greetMorning:'Günaydın,',greetAfternoon:'İyi günler,',greetEvening:'İyi akşamlar,',greetGoodnight:'İyi geceler,',
// Priorities
easy:'Kolay',mid:'Orta',hard:'Zor',
// Common buttons
save:'Kaydet',cancel:'Vazgeç',delete:'Sil',edit:'Düzenle',add:'Ekle',close:'Kapat',restore:'Geri Al',send:'Gönder',go:'Git',update:'Güncelle',clear:'Temizle',
// Todo
todoPlaceholder:'Ne yapacaksın?',taskAdded:'Görev eklendi',completed:'Tamamlandı ✓',movedToTrash:'Çöpe taşındı',noActiveTasks:'Aktif görev yok 🎉',completedSection:'Tamamlananlar',taskDeleted:'Görev silindi',taskUpdated:'Güncellendi ✓',editTask:'✏️ Görevi Düzenle',dateAndTime:'Tarih ve Saat',repeat:'Tekrar',repeatNone:'Tekrar yok',repeatDaily:'Her gün 🔁',repeatWeekly:'Her hafta',repeatMonthly:'Her ay',dueToday:'Bugün',dueTomorrow:'Yarın',overdue:'Gecikmiş',daysOverdue:'g gecikti',selectDate:'Tarih Seç',
// Notes
noteSaved:'Not kaydedildi ✦',noteUpdated:'Not güncellendi ✓',noteDeleted:'Not silindi',editNote:'✏️ Notu Düzenle',noNotesYet:'Henüz not yok.\nSağ alttaki + ile başla.',untitled:'Başlıksız',title:'Başlık',content:'İçerik',tags:'Etiketler (virgülle ayır)',tagsPlaceholder:'ders, ödev, fikir...',
// Diary
diaryAdded:'Günlük eklendi ✦',diaryUpdated:'Günlük güncellendi ✓',diaryDeleted:'Günlük silindi',editDiary:'✏️ Günlüğü Düzenle',diaryEmpty:'Günlüğün boş.\nYukarıdaki + ile başla.',newDiaryEntry:'Yeni Günlük Girişi',diaryEntry:'Günlük Girişi',mood:'Ruh Hali',diaryPromptLabel:'✦ Bugünün İlham Sorusu',
// Pomodoro
workSession:'Çalışma Seansı',shortBreak:'Kısa Mola',longBreak:'Uzun Mola',sessionComplete:'Seans tamamlandı! 🍅',breakOver:'Mola bitti!',selectTaskBelow:'Görev seçmek için aşağıya tıkla',setDuration:'⏱ Süre Ayarla',durationsUpdated:'Süreler güncellendi ✓',clockStyleChanged:'Saat stili değiştirildi',noTasks:'Görev yok',work:'Çalışma',shortLabel:'Kısa',longLabel:'Uzun',min:'dk',todaysTasks:'Bugünün Görevleri',
// Kanban
addCard:'Kart Ekle',importFromTasks:'Görevlerden Aktar',cardAdded:'Kart eklendi',cardDeleted:'Kart silindi',kanbanTodo:'Yapılacak',kanbanDoing:'Devam Eden',kanbanDone:'Tamamlandı',newKanbanCard:'Yeni Kanban Kartı',kanbanPlaceholder:'Görev veya proje adı...',column:'Sütun',back:'← Geri',forward:'İleri →',
// Reading
addBookArticle:'Kitap / Makale Ekle',readingAdded:'Eklendi 📚',readingUpdated:'Güncellendi ✓',readingDeleted:'Silindi',currentlyReading:'Şu An Okuduğun',bookCompleted:'Kitap tamamlandı! 🎉',pageUpdated:'Sayfa güncellendi:',toRead:'📌 Okunacak',reading:'📖 Okunuyor',done:'✅ Tamamlandı',totalPages:'Toplam Sayfa',finishGoal:'Bitiş Hedefi',startDate:'Başlangıç Tarihi',status:'Durum',
// Schedule
addLesson:'Ders Ekle',lessonAdded:'Ders eklendi',lessonUpdated:'Ders güncellendi ✓',editLesson:'✏️ Dersi Düzenle',days:'Günler',color:'Renk',start:'Başlangıç',end:'Bitiş',noLesson:'Ders yok',prevWeek:'← Önceki Hafta',today:'Bugün',nextWeek:'Sonraki Hafta →',week:'Hafta',
// Exams
addExam:'Sınav / Ödev Ekle',examAdded:'Eklendi',noExams:'Sınav veya ödev yok.\nÜstten ekle.',upcoming:'Yaklaşan',past:'Geçmiş',daysLeft:'gün kaldı',daysAgo:'gün geçti',todayExam:'Bugün!',
// Notebook
addLessonNote:'Ders Notu Ekle',notebookSaved:'Not kaydedildi',all:'Tümü',noCourse:'Derssiz',notebookEmpty:'Not yok.\nÜstten ders notu ekle.',
// Habits
habitTracker:'Alışkanlık Takipçisi',newHabit:'Yeni Alışkanlık',habitNamePlaceholder:'Alışkanlık adı...',selectIcon:'İkon seç',habitAdded:'Alışkanlık eklendi',habitDeleted:'Alışkanlık silindi',deleteHabitConfirm:'Bu alışkanlığı silmek istiyor musun?',noHabitsYet:'Henüz alışkanlık yok',noHabitsDesc:'Yukarıdaki "Ekle" butonu ile\nilk alışkanlığını oluştur.',completedThisWeek:'bu hafta tamamlandı',dayStreak:'gün seri',thisWeek:'bu hafta',freqDaily:'Her gün',freqWeekdays:'Hafta içi',freqThreeX:'Haftada 3',goal:'Hedef (günlük tekrar)',
// Search
smartSearch:'Akıllı Arama',searchPlaceholder:'Her şeyde ara: not, görev, kanban, kitap...',noResults:'Sonuç bulunamadı.',
// Drawer
myProfile:'Profilim',statistics:'İstatistikler',readingList:'Okuma Listesi',habits:'Alışkanlıklar',backupRestore:'Yedekle & Geri Yükle',settings:'Ayarlar',diary:'Günlük',trashBin:'Çöp Kutusu',timeCapsule:'Zaman Kapsülü',privacy:'Gizlilik',help:'Yardım',contactUs:'Bize Ulaşın',deleteAllData:'Tüm Verileri Sil',
// Profile
profile:'Profil',editProfile:'Düzenle',fullName:'Ad Soyad',username:'Kullanıcı Adı',email:'E-posta',biography:'Biyografi',motto:'Motto',personalColor:'Kişisel Renk',selectAvatar:'Avatar Seç',changePhoto:'Fotoğraf Değiştir',taskLabel:'Görev',noteLabel:'Not',streakLabel:'Seri',notesTab:'Notlar',diaryTab:'Günlük',achievementsTab:'Başarılar',
// Achievements
achStreakMaster:'Seri Ustası',achBookworm:'Kitap Kurdu',achProductive:'Üretken',achDiarist:'Günlükçü',achNoteMaster:'Not Ustası',achFocusChamp:'Odak Şamp.',
// Badges
badgeStudent:'Öğrenci',badgeDeveloper:'Geliştirici',badgeCreative:'Yaratıcı',badgeReader:'Okuyucu',badgeAthlete:'Sporcu',badgeScientist:'Bilimci',badgeMusician:'Müzisyen',badgeWriter:'Yazar',badgeExplorer:'Kaşif',
// Settings
appearance:'Görünüm',theme:'Tema',security:'Güvenlik',pinLock:'PIN Kilidi',pinLockDesc:'Uygulamayı PIN ile kilitle',clockStyle:'Saat Stili',profileAppearance:'Profil Görünümü',profileLayout:'Profil Düzeni',autoDeleteCompleted:'Tamamlananları otomatik sil',autoDeleteDesc:'30 gün sonra çöpe taşır',data:'Veri',about:'Hakkında',language:'Dil',
// Trash
trashAutoDelete:'⚠ 30 gün sonra kalıcı silinir',emptyAllTrash:'Çöpü Tamamen Boşalt',trashEmpty:'Çöp kutusu boş 🗑',restored:'Geri alındı',trashEmptied:'Çöp boşaltıldı',emptyTrashConfirm:'Çöpteki her şey kalıcı silinecek?',
// Time Capsule
newCapsule:'+ Yeni',whatIsTimeCapsule:'⏳ Zaman Kapsülü nedir?',timeCapsuleDesc:'Bugün kendine bir mesaj yaz, gelecekte bir tarih seç. O tarih gelene kadar kilitli kalır. Açıldığında geçmişten bir sürprizle karşılaşırsın.',capsuleSealed:'Kapsül mühürlendi 🔒',capsuleDeleted:'Kapsül silindi',openingDate:'Açılış Tarihi',sealBtn:'Mühürle 🔒',
// Backup
dataManagement:'Veri Yönetimi',backupSubtitle:'Verilerinizi yedekleyin veya geri yükleyin',exportSection:'Dışa Aktar',importSection:'İçe Aktar',jsonBackup:'JSON Yedek İndir',readableText:'Okunabilir Metin İndir',jsonImport:'JSON Yedek Yükle',gdriveTitle:'Google Drive Yedekleme',gdriveDesc:'Verilerini buluta kaydet, telefon değişince geri yükle',backupToDrive:"Drive'a Yedekle",restoreFromDrive:"Drive'dan Geri Yükle",lastBackup:'Son yedek',backupNow:'Şimdi Yedekle',exported:'Dışa aktarıldı 📁',backupRestored:'Yedek geri yüklendi ✓',mergeBtn:'Birleştir',mergeDesc:'Mevcut veriler korunur + yedektekiler eklenir',overwriteBtn:'Üzerine Yaz',overwriteDesc:'Mevcut veriler silinir, sadece yedek yüklenir',
// Splash
splashTagline:'kişisel alan · her şey burada',
// Pin
enterPin:"PIN'ini gir",forgotPin:"PIN'i unuttum",pinSaved:'PIN kaydedildi 🔒',pinRemoved:'PIN kaldırıldı',
// Misc
writeFirst:'Bir şeyler yaz önce',deleteAllConfirm:'Tüm veriler silinecek. Emin misin?',dataDeleted:'Veriler silindi',noNotifications:'Henüz bildirim yok',notifCleared:'Bildirimler temizlendi',photo:'Fotoğraf',video:'Video',audio:'Ses',addNote:'+ Not',quickNote:'Hızlı Not',quickNotePlaceholder:'Aklına ne geldi? Yaz, kaydet...',noteAddedQuick:'Not eklendi ✓',selectTemplate:'Şablon Seç',startWriting:'Yazmaya başla...',
// Templates
tplMeeting:'Toplantı Notu',tplBook:'Kitap Özeti',tplDaily:'Günlük Plan',tplIdea:'Fikir Notu',tplTravel:'Seyahat',tplGoal:'Hedef',tplLecture:'Ders Notu',tplBlank:'Boş Not',
// Days
dayMon:'Pt',dayTue:'Sa',dayWed:'Ça',dayThu:'Pe',dayFri:'Cu',daySat:'Ct',daySun:'Pz',
dayFullMon:'Pazartesi',dayFullTue:'Salı',dayFullWed:'Çarşamba',dayFullThu:'Perşembe',dayFullFri:'Cuma',dayFullSat:'Cumartesi',dayFullSun:'Pazar',
},
en:{
navNote:'Note',navTask:'Task',navFocus:'Focus',navDiary:'Diary',navSearch:'Search',navSchedule:'Schedule',
pageHome:'Home',pageStats:'Statistics',pageTodo:'Tasks',pageNotes:'Notes',pageDiary:'Diary',pageSearch:'Search',pagePomodoro:'Pomodoro',pageKanban:'Kanban',pageWeekly:'Weekly Summary',pageReading:'Reading List',pagePro:'Professional',pageSchedule:'Lesson Schedule',pageExams:'Exam Calendar',pageNotebook:'Notebook',pageHabits:'Habits',
greetNight:'Late night hours…',greetMorning:'Good morning,',greetAfternoon:'Good afternoon,',greetEvening:'Good evening,',greetGoodnight:'Good night,',
easy:'Easy',mid:'Medium',hard:'Hard',
save:'Save',cancel:'Cancel',delete:'Delete',edit:'Edit',add:'Add',close:'Close',restore:'Restore',send:'Send',go:'Go',update:'Update',clear:'Clear',
todoPlaceholder:'What will you do?',taskAdded:'Task added',completed:'Completed ✓',movedToTrash:'Moved to trash',noActiveTasks:'No active tasks 🎉',completedSection:'Completed',taskDeleted:'Task deleted',taskUpdated:'Updated ✓',editTask:'✏️ Edit Task',dateAndTime:'Date and Time',repeat:'Repeat',repeatNone:'No repeat',repeatDaily:'Every day 🔁',repeatWeekly:'Every week',repeatMonthly:'Every month',dueToday:'Today',dueTomorrow:'Tomorrow',overdue:'Overdue',daysOverdue:'d overdue',selectDate:'Select Date',
noteSaved:'Note saved ✦',noteUpdated:'Note updated ✓',noteDeleted:'Note deleted',editNote:'✏️ Edit Note',noNotesYet:'No notes yet.\nStart with the + at the bottom right.',untitled:'Untitled',title:'Title',content:'Content',tags:'Tags (comma separated)',tagsPlaceholder:'lesson, homework, idea...',
diaryAdded:'Diary added ✦',diaryUpdated:'Diary updated ✓',diaryDeleted:'Diary deleted',editDiary:'✏️ Edit Diary',diaryEmpty:'Your diary is empty.\nStart with the + above.',newDiaryEntry:'New Diary Entry',diaryEntry:'Diary Entry',mood:'Mood',diaryPromptLabel:"✦ Today's Inspiration Question",
workSession:'Work Session',shortBreak:'Short Break',longBreak:'Long Break',sessionComplete:'Session completed! 🍅',breakOver:'Break over!',selectTaskBelow:'Click below to select a task',setDuration:'⏱ Set Duration',durationsUpdated:'Durations updated ✓',clockStyleChanged:'Clock style changed',noTasks:'No tasks',work:'Work',shortLabel:'Short',longLabel:'Long',min:'min',todaysTasks:"Today's Tasks",
addCard:'Add Card',importFromTasks:'Import from Tasks',cardAdded:'Card added',cardDeleted:'Card deleted',kanbanTodo:'To Do',kanbanDoing:'In Progress',kanbanDone:'Done',newKanbanCard:'New Kanban Card',kanbanPlaceholder:'Task or project name...',column:'Column',back:'← Back',forward:'Forward →',
addBookArticle:'Add Book / Article',readingAdded:'Added 📚',readingUpdated:'Updated ✓',readingDeleted:'Deleted',currentlyReading:'Currently Reading',bookCompleted:'Book completed! 🎉',pageUpdated:'Page updated:',toRead:'📌 To Read',reading:'📖 Reading',done:'✅ Completed',totalPages:'Total Pages',finishGoal:'Finish Goal',startDate:'Start Date',status:'Status',
addLesson:'Add Lesson',lessonAdded:'Lesson added',lessonUpdated:'Lesson updated ✓',editLesson:'✏️ Edit Lesson',days:'Days',color:'Color',start:'Start',end:'End',noLesson:'No lesson',prevWeek:'← Previous Week',today:'Today',nextWeek:'Next Week →',week:'Week',
addExam:'Add Exam / Homework',examAdded:'Added',noExams:'No exams or homework.\nAdd from above.',upcoming:'Upcoming',past:'Past',daysLeft:'days left',daysAgo:'days ago',todayExam:'Today!',
addLessonNote:'Add Lesson Note',notebookSaved:'Note saved',all:'All',noCourse:'No Course',notebookEmpty:'No notes.\nAdd a lesson note from above.',
habitTracker:'Habit Tracker',newHabit:'New Habit',habitNamePlaceholder:'Habit name...',selectIcon:'Select icon',habitAdded:'Habit added',habitDeleted:'Habit deleted',deleteHabitConfirm:'Do you want to delete this habit?',noHabitsYet:'No habits yet',noHabitsDesc:'Create your first habit\nwith the "Add" button above.',completedThisWeek:'completed this week',dayStreak:'day streak',thisWeek:'this week',freqDaily:'Every day',freqWeekdays:'Weekdays',freqThreeX:'3 times a week',goal:'Goal (daily repeat)',
smartSearch:'Smart Search',searchPlaceholder:'Search everything: notes, tasks, kanban, books...',noResults:'No results found.',
myProfile:'My Profile',statistics:'Statistics',readingList:'Reading List',habits:'Habits',backupRestore:'Backup & Restore',settings:'Settings',diary:'Diary',trashBin:'Trash Bin',timeCapsule:'Time Capsule',privacy:'Privacy',help:'Help',contactUs:'Contact Us',deleteAllData:'Delete All Data',
profile:'Profile',editProfile:'Edit',fullName:'Full Name',username:'Username',email:'Email',biography:'Biography',motto:'Motto',personalColor:'Personal Color',selectAvatar:'Select Avatar',changePhoto:'Change Photo',taskLabel:'Tasks',noteLabel:'Notes',streakLabel:'Streak',notesTab:'Notes',diaryTab:'Diary',achievementsTab:'Achievements',
achStreakMaster:'Streak Master',achBookworm:'Bookworm',achProductive:'Productive',achDiarist:'Diarist',achNoteMaster:'Note Master',achFocusChamp:'Focus Champ',
badgeStudent:'Student',badgeDeveloper:'Developer',badgeCreative:'Creative',badgeReader:'Reader',badgeAthlete:'Athlete',badgeScientist:'Scientist',badgeMusician:'Musician',badgeWriter:'Writer',badgeExplorer:'Explorer',
appearance:'Appearance',theme:'Theme',security:'Security',pinLock:'PIN Lock',pinLockDesc:'Lock app with PIN',clockStyle:'Clock Style',profileAppearance:'Profile Appearance',profileLayout:'Profile Layout',autoDeleteCompleted:'Auto-delete completed',autoDeleteDesc:'Moves to trash after 30 days',data:'Data',about:'About',language:'Language',
trashAutoDelete:'⚠ Permanently deleted after 30 days',emptyAllTrash:'Empty All Trash',trashEmpty:'Trash bin is empty 🗑',restored:'Restored',trashEmptied:'Trash emptied',emptyTrashConfirm:'Everything in trash will be permanently deleted?',
newCapsule:'+ New',whatIsTimeCapsule:'⏳ What is a Time Capsule?',timeCapsuleDesc:'Write a message to yourself today, pick a future date. It stays locked until that date. When opened, you get a surprise from the past.',capsuleSealed:'Capsule sealed 🔒',capsuleDeleted:'Capsule deleted',openingDate:'Opening Date',sealBtn:'Seal 🔒',
dataManagement:'Data Management',backupSubtitle:'Backup or restore your data',exportSection:'Export',importSection:'Import',jsonBackup:'Download JSON Backup',readableText:'Download Readable Text',jsonImport:'Upload JSON Backup',gdriveTitle:'Google Drive Backup',gdriveDesc:'Save data to cloud, restore when switching phones',backupToDrive:'Backup to Drive',restoreFromDrive:'Restore from Drive',lastBackup:'Last backup',backupNow:'Backup Now',exported:'Exported 📁',backupRestored:'Backup restored ✓',mergeBtn:'Merge',mergeDesc:'Current data preserved + backup data added',overwriteBtn:'Overwrite',overwriteDesc:'Current data deleted, only backup loaded',
splashTagline:'personal space · everything here',
enterPin:'Enter your PIN',forgotPin:'Forgot PIN',pinSaved:'PIN saved 🔒',pinRemoved:'PIN removed',
writeFirst:'Write something first',deleteAllConfirm:'All data will be deleted. Are you sure?',dataDeleted:'Data deleted',noNotifications:'No notifications yet',notifCleared:'Notifications cleared',photo:'Photo',video:'Video',audio:'Audio',addNote:'+ Note',quickNote:'Quick Note',quickNotePlaceholder:"What's on your mind? Write, save...",noteAddedQuick:'Note added ✓',selectTemplate:'Select Template',startWriting:'Start writing...',
tplMeeting:'Meeting Note',tplBook:'Book Summary',tplDaily:'Daily Plan',tplIdea:'Idea Note',tplTravel:'Travel',tplGoal:'Goal',tplLecture:'Lecture Note',tplBlank:'Blank Note',
dayMon:'Mon',dayTue:'Tue',dayWed:'Wed',dayThu:'Thu',dayFri:'Fri',daySat:'Sat',daySun:'Sun',
dayFullMon:'Monday',dayFullTue:'Tuesday',dayFullWed:'Wednesday',dayFullThu:'Thursday',dayFullFri:'Friday',dayFullSat:'Saturday',dayFullSun:'Sunday',
}
};
