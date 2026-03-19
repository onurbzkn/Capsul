
<html lang="tr">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Capsula</title>
<style>
@import url('https://fonts.googleapis.com/css2?family=Sora:wght@200;300;400;500;600&family=JetBrains+Mono:wght@300;400;500&display=swap');
:root{
  --bg:#0d0d12;--bg2:#14141d;--bg3:#1c1c28;
  --border:rgba(255,255,255,0.07);--border2:rgba(255,255,255,0.13);
  --text:#f0eeff;--text2:rgba(240,238,255,0.5);--text3:rgba(240,238,255,0.25);
  --accent:#7c6ff7;--accent2:#a89ffe;
  --diary:#f472b6;--diary2:#fb7bb8;
  --note:#60a5fa;--note2:#93c5fd;
  --easy:#4ade80;--mid:#fb923c;--hard:#f87171;
  --nav-h:90px;--header-h:56px;
}
body.theme-midnight{--bg:#050508;--bg2:#0e0e15;--bg3:#161620;--accent:#818cf8;--accent2:#a5b4fc;}
body.theme-forest{--bg:#060e08;--bg2:#0d1a10;--bg3:#152318;--accent:#4ade80;--accent2:#86efac;--diary:#fb923c;--diary2:#fdba74;--note:#34d399;--note2:#6ee7b7;}
body.theme-sunset{--bg:#12080a;--bg2:#1c0e12;--bg3:#26131a;--accent:#f472b6;--accent2:#f9a8d4;--diary:#fb923c;--diary2:#fdba74;--note:#f472b6;--note2:#f9a8d4;}
body.theme-ocean{--bg:#030d14;--bg2:#071726;--bg3:#0d2236;--accent:#38bdf8;--accent2:#7dd3fc;--diary:#818cf8;--diary2:#a5b4fc;--note:#38bdf8;--note2:#7dd3fc;}
body.theme-sand{--bg:#0f0d08;--bg2:#1a1710;--bg3:#242018;--accent:#fbbf24;--accent2:#fcd34d;--diary:#f472b6;--diary2:#f9a8d4;--note:#60a5fa;--note2:#93c5fd;}

*,*::before,*::after{box-sizing:border-box;margin:0;padding:0;}
html,body{height:100%;overflow:hidden;background:var(--bg);color:var(--text);font-family:'Sora',sans-serif;}
::-webkit-scrollbar{width:3px;}::-webkit-scrollbar-track{background:transparent;}::-webkit-scrollbar-thumb{background:rgba(255,255,255,0.1);border-radius:2px;}
#app{display:flex;flex-direction:column;height:100vh;}

/* ── PIN SCREEN ──────────────────────────────────────────────────────────── */
#pinScreen{position:fixed;inset:0;z-index:1000;background:var(--bg);display:flex;flex-direction:column;align-items:center;justify-content:center;gap:32px;transition:opacity 0.4s,transform 0.4s;}
#pinScreen.hiding{opacity:0;transform:scale(1.04);}
.pin-logo{font-family:'JetBrains Mono',monospace;font-size:0.7rem;letter-spacing:0.4em;color:var(--text3);text-transform:uppercase;}
.pin-title{font-size:1.1rem;font-weight:300;color:var(--text2);text-align:center;}
.pin-dots{display:flex;gap:14px;margin:4px 0;}
.pin-dot{width:14px;height:14px;border-radius:50%;border:2px solid var(--border2);background:transparent;transition:all 0.18s;}
.pin-dot.filled{background:var(--accent);border-color:var(--accent);box-shadow:0 0 10px rgba(124,111,247,0.5);}
.pin-dot.error{background:var(--hard);border-color:var(--hard);animation:psh .4s ease;}
@keyframes psh{0%,100%{transform:translateX(0);}20%,60%{transform:translateX(-5px);}40%,80%{transform:translateX(5px);}}
.pin-pad{display:grid;grid-template-columns:repeat(3,1fr);gap:10px;max-width:250px;width:100%;}
.pin-key{aspect-ratio:1;border-radius:50%;background:var(--bg2);border:1px solid var(--border);font-family:'Sora',sans-serif;font-size:1.2rem;font-weight:300;color:var(--text);cursor:pointer;display:flex;align-items:center;justify-content:center;transition:all .15s;}
.pin-key:hover{background:var(--bg3);border-color:var(--border2);}
.pin-key:active{transform:scale(.92);}
.pin-key.del{font-size:1rem;color:var(--text3);}
.pin-key.empty{background:transparent;border:none;cursor:default;}
.pin-hint{font-size:0.62rem;color:var(--text3);font-family:'JetBrains Mono',monospace;cursor:pointer;text-decoration:underline;text-underline-offset:3px;}
.pin-hint:hover{color:var(--text2);}

/* ── SPLASH SCREEN ───────────────────────────────────────────────────────── */
#splashScreen{position:fixed;inset:0;z-index:2000;background:var(--bg);display:flex;flex-direction:column;align-items:center;justify-content:center;gap:20px;transition:opacity 0.6s ease,transform 0.6s ease;}
#splashScreen.hiding{opacity:0;transform:scale(1.06) translateY(-8px);pointer-events:none;}
.splash-particles{position:absolute;inset:0;overflow:hidden;pointer-events:none;}
.splash-particle{position:absolute;width:2px;height:2px;border-radius:50%;background:var(--accent);opacity:0;animation:sparFloat linear infinite;}
@keyframes sparFloat{0%{opacity:0;transform:translateY(0) scale(0);}15%{opacity:.7;}85%{opacity:.3;}100%{opacity:0;transform:translateY(-120px) scale(1.5);}}
.splash-glow{position:absolute;width:320px;height:320px;border-radius:50%;background:radial-gradient(circle,rgba(124,111,247,.18) 0%,transparent 70%);top:50%;left:50%;transform:translate(-50%,-50%);animation:glowPulse 2.4s ease-in-out infinite;}
@keyframes glowPulse{0%,100%{opacity:.5;transform:translate(-50%,-50%) scale(1);}50%{opacity:1;transform:translate(-50%,-50%) scale(1.12);}}
.splash-logo-wrap{display:flex;flex-direction:column;align-items:center;gap:12px;position:relative;}
.splash-icon{width:56px;height:56px;border-radius:16px;background:linear-gradient(135deg,var(--accent),var(--diary));display:flex;align-items:center;justify-content:center;box-shadow:0 0 32px rgba(124,111,247,.5),0 0 64px rgba(124,111,247,.2);animation:iconAppear .8s cubic-bezier(.34,1.56,.64,1) forwards;opacity:0;}
@keyframes iconAppear{0%{opacity:0;transform:scale(.4) rotate(-15deg);}100%{opacity:1;transform:scale(1) rotate(0deg);}}
.splash-icon svg{width:28px;height:28px;stroke:#fff;fill:none;stroke-width:2;}
.splash-name{font-family:'JetBrains Mono',monospace;font-size:1.6rem;font-weight:500;letter-spacing:.12em;color:var(--text);text-transform:uppercase;overflow:hidden;}
.splash-name-text{display:inline-block;}
.splash-cursor{display:inline-block;width:2px;height:1.4em;background:var(--accent);margin-left:2px;vertical-align:middle;animation:blink .7s step-end infinite;}
@keyframes blink{0%,100%{opacity:1;}50%{opacity:0;}}
.splash-tagline{font-size:.72rem;letter-spacing:.3em;color:var(--text3);font-family:'JetBrains Mono',monospace;text-transform:uppercase;opacity:0;transition:opacity .5s ease;}
.splash-tagline.show{opacity:1;}
.splash-bar-wrap{width:160px;height:2px;background:rgba(255,255,255,.07);border-radius:2px;overflow:hidden;opacity:0;transition:opacity .4s;}
.splash-bar-wrap.show{opacity:1;}
.splash-bar{height:100%;width:0%;background:linear-gradient(90deg,var(--accent),var(--diary));border-radius:2px;transition:width .05s linear;}

/* ── TOUR TOOLTIP ────────────────────────────────────────────────────────── */
#tourOverlay{position:fixed;inset:0;z-index:1500;pointer-events:none;}
#tourOverlay.active{pointer-events:all;}
.tour-backdrop{display:none;}
.tour-highlight{position:absolute;border-radius:10px;transition:all .4s cubic-bezier(.4,0,.2,1);z-index:1;pointer-events:none;background:transparent;opacity:0;}
.tour-tooltip{position:absolute;background:var(--bg2);border:1px solid var(--border2);border-radius:14px;padding:16px 18px;max-width:260px;min-width:200px;box-shadow:0 8px 32px rgba(0,0,0,.4),0 0 0 1px rgba(255,255,255,.06) inset;z-index:2;opacity:0;transform:scale(.9) translateY(6px);transition:all .35s cubic-bezier(.34,1.2,.64,1);}
.tour-tooltip.visible{opacity:1;transform:scale(1) translateY(0);}
.tour-tooltip-step{font-family:'JetBrains Mono',monospace;font-size:.58rem;letter-spacing:.2em;color:var(--accent);text-transform:uppercase;margin-bottom:6px;}
.tour-tooltip-title{font-size:.9rem;font-weight:500;color:var(--text);margin-bottom:5px;}
.tour-tooltip-desc{font-size:.75rem;font-weight:300;color:var(--text2);line-height:1.55;}
.tour-tooltip-arrow{position:absolute;width:10px;height:10px;background:var(--bg2);border:1px solid var(--border2);transform:rotate(45deg);}
.tour-tooltip-footer{display:flex;align-items:center;justify-content:space-between;margin-top:14px;gap:8px;}
.tour-btn{padding:6px 14px;border-radius:8px;font-size:.72rem;font-family:'Sora',sans-serif;cursor:pointer;border:none;transition:all .2s;}
.tour-btn-skip{background:transparent;color:var(--text3);border:1px solid var(--border);}
.tour-btn-skip:hover{color:var(--text2);border-color:var(--border2);}
.tour-btn-next{background:var(--accent);color:#fff;font-weight:500;}
.tour-btn-next:hover{filter:brightness(1.12);}
.tour-dot-row{display:flex;gap:5px;align-items:center;}
.tour-dot{width:5px;height:5px;border-radius:50%;background:var(--border2);transition:all .2s;}
.tour-dot.active{background:var(--accent);transform:scale(1.3);}
.tour-welcome{position:fixed;inset:0;z-index:1600;display:flex;align-items:center;justify-content:center;background:rgba(0,0,0,.6);backdrop-filter:blur(6px);}
.tour-welcome-card{background:var(--bg2);border:1px solid var(--border2);border-radius:20px;padding:32px 28px;max-width:340px;width:90%;text-align:center;box-shadow:0 20px 60px rgba(0,0,0,.5);animation:cardPop .5s cubic-bezier(.34,1.3,.64,1) forwards;}
@keyframes cardPop{0%{opacity:0;transform:scale(.85);}100%{opacity:1;transform:scale(1);}}
.tour-welcome-icon{font-size:2.6rem;margin-bottom:14px;}
.tour-welcome-title{font-size:1.2rem;font-weight:500;color:var(--text);margin-bottom:8px;}
.tour-welcome-sub{font-size:.78rem;font-weight:300;color:var(--text2);line-height:1.6;margin-bottom:22px;}
.tour-welcome-btns{display:flex;gap:10px;justify-content:center;}
.tour-welcome-start{background:var(--accent);color:#fff;border:none;border-radius:10px;padding:10px 24px;font-size:.82rem;font-weight:500;font-family:'Sora',sans-serif;cursor:pointer;transition:filter .2s;}
.tour-welcome-start:hover{filter:brightness(1.12);}
.tour-welcome-skip{background:transparent;color:var(--text3);border:1px solid var(--border);border-radius:10px;padding:10px 18px;font-size:.78rem;font-family:'Sora',sans-serif;cursor:pointer;transition:all .2s;}
.tour-welcome-skip:hover{color:var(--text2);border-color:var(--border2);}

/* ── LIQUID GLASS HEADER ─────────────────────────────────────────────────── */
header{
  height:56px;flex-shrink:0;
  display:flex;flex-direction:row;align-items:center;
  padding:0 12px 0 10px;gap:10px;
  position:relative;z-index:60;
  background:rgba(13,13,18,0.75);
  backdrop-filter:blur(28px) saturate(180%);
  -webkit-backdrop-filter:blur(28px) saturate(180%);
  border-bottom:1px solid rgba(255,255,255,0.09);
  box-shadow:0 1px 0 rgba(255,255,255,0.05) inset,0 4px 24px rgba(0,0,0,0.3);
}
.header-top{display:contents;}
.header-left{display:flex;align-items:center;gap:8px;flex-shrink:0;}
.ham-btn{width:32px;height:32px;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:5px;cursor:pointer;background:none;border:none;padding:4px;flex-shrink:0;}
.ham-line{width:18px;height:1.5px;background:var(--text2);transition:all .35s cubic-bezier(.4,0,.2,1);transform-origin:center;}
.ham-btn.open .ham-line:nth-child(1){transform:translateY(6.5px) rotate(45deg);background:var(--text);}
.ham-btn.open .ham-line:nth-child(2){opacity:0;transform:scaleX(0);}
.ham-btn.open .ham-line:nth-child(3){transform:translateY(-6.5px) rotate(-45deg);background:var(--text);}
.app-title{display:none;}
.header-right{display:flex;align-items:center;gap:8px;flex-shrink:0;}
.avatar-btn{width:32px;height:32px;border-radius:50%;background:linear-gradient(135deg,var(--accent),var(--diary));border:none;cursor:pointer;display:flex;align-items:center;justify-content:center;font-size:.65rem;color:#fff;transition:transform .2s,box-shadow .2s;overflow:hidden;flex-shrink:0;}
.avatar-btn:hover{transform:scale(1.08);box-shadow:0 0 14px rgba(124,111,247,.4);}
.avatar-btn img{width:100%;height:100%;object-fit:cover;border-radius:50%;}
.avatar-initials{font-family:'JetBrains Mono',monospace;font-size:.6rem;}

/* ── MODE SWITCHER — tam ortada, büyük, aynı satırda ─────────────────────── */
.mode-switcher-row{
  flex:1;display:flex;align-items:center;justify-content:center;
  min-width:0;
}
.mode-pill{
  display:flex;align-items:center;
  background:rgba(255,255,255,0.05);
  backdrop-filter:blur(20px);
  -webkit-backdrop-filter:blur(20px);
  border:1px solid rgba(255,255,255,0.11);
  border-radius:26px;padding:4px;gap:2px;
  box-shadow:0 1px 0 rgba(255,255,255,0.08) inset,0 2px 16px rgba(0,0,0,0.25);
  position:relative;
}
.mode-pill::before{
  content:'';position:absolute;top:0;left:0;right:0;height:1px;
  background:linear-gradient(90deg,transparent 5%,rgba(255,255,255,.12) 35%,rgba(255,255,255,.18) 60%,transparent 95%);
  border-radius:26px 26px 0 0;pointer-events:none;
}
.mode-btn{
  display:flex;align-items:center;gap:5px;
  padding:5px 11px;border-radius:20px;border:none;cursor:pointer;
  font-family:'JetBrains Mono',monospace;font-size:.52rem;font-weight:500;
  letter-spacing:.1em;text-transform:uppercase;
  background:none;color:var(--text3);
  transition:all .28s cubic-bezier(.4,0,.2,1);white-space:nowrap;
}
.mode-btn svg{width:11px;height:11px;flex-shrink:0;opacity:.7;transition:opacity .2s;}
.mode-btn.active svg{opacity:1;}
.mode-btn.m-pro.active{background:rgba(56,189,248,.2);color:#7dd3fc;box-shadow:0 0 14px rgba(56,189,248,.2);}
.mode-btn.m-home.active{background:rgba(124,111,247,.22);color:var(--accent2);box-shadow:0 0 14px rgba(124,111,247,.2);}
.mode-btn.m-uni.active{background:rgba(244,114,182,.2);color:#f9a8d4;box-shadow:0 0 14px rgba(244,114,182,.2);}
.mode-btn:hover:not(.active){color:var(--text2);background:rgba(255,255,255,.04);}

/* ── MAIN ────────────────────────────────────────────────────────────────── */
main{flex:1;overflow:hidden;position:relative;}
.page{position:absolute;inset:0;overflow-y:auto;opacity:0;pointer-events:none;
  transition:opacity .22s,transform .22s;transform:translateY(6px);
  padding:16px 16px calc(var(--nav-h) + 20px);}
.page.active{opacity:1;pointer-events:all;transform:translateY(0);}

/* ── LIQUID GLASS NAV ────────────────────────────────────────────────────── */
.nav-wrap{position:fixed;bottom:0;left:0;right:0;height:calc(var(--nav-h) + env(safe-area-inset-bottom,0px));display:flex;align-items:flex-start;justify-content:center;padding:8px 16px 0;z-index:100;pointer-events:none;}
.nav-glass{
  pointer-events:all;display:flex;align-items:center;justify-content:space-between;
  background:rgba(13,13,20,.72);
  backdrop-filter:blur(32px) saturate(200%) brightness(1.1);
  -webkit-backdrop-filter:blur(32px) saturate(200%) brightness(1.1);
  border:1px solid rgba(255,255,255,.11);border-radius:38px;
  padding:8px 12px;
  box-shadow:0 8px 32px rgba(0,0,0,.55),0 1.5px 0 rgba(255,255,255,.1) inset,0 -1px 0 rgba(0,0,0,.4) inset,inset 0 0 24px rgba(124,111,247,.03);
  position:relative;min-width:min(380px,calc(100vw - 32px));max-width:480px;overflow:visible;
}
.nav-glass::before{content:'';position:absolute;top:0;left:0;right:0;height:1px;background:linear-gradient(90deg,transparent 8%,rgba(255,255,255,.14) 30%,rgba(255,255,255,.18) 50%,rgba(255,255,255,.14) 70%,transparent 92%);border-radius:38px 38px 0 0;pointer-events:none;}
.nav-btn{display:flex;flex-direction:column;align-items:center;gap:3px;background:none;border:none;cursor:pointer;padding:8px 10px;color:rgba(240,238,255,.28);font-family:'Sora',sans-serif;border-radius:24px;transition:color .2s,background .2s;flex:1;}
.nav-btn:hover{color:rgba(240,238,255,.55);background:rgba(255,255,255,.04);}
.nav-btn.active{color:var(--accent2);}
.nav-btn svg{width:20px;height:20px;transition:transform .2s;}
.nav-btn.active svg{transform:scale(1.1);}
.nav-btn span{font-size:.47rem;letter-spacing:.1em;text-transform:uppercase;font-weight:500;}
.nav-center-wrap{display:flex;align-items:center;justify-content:center;width:72px;flex-shrink:0;position:relative;}
.nav-center-fab{
  width:68px;height:68px;border-radius:50%;
  background:linear-gradient(145deg,#b97cfc,#7c6ff7 40%,#ec4899);
  border:none;cursor:pointer;display:flex;align-items:center;justify-content:center;
  box-shadow:0 4px 24px rgba(167,139,250,.5),0 0 0 3px rgba(255,255,255,.1),0 0 0 6px rgba(167,139,250,.08);
  transition:transform .28s cubic-bezier(.34,1.56,.64,1),box-shadow .25s;
  position:absolute;top:50%;transform:translateY(-50%);
}
.nav-center-fab:hover{transform:translateY(calc(-50% - 3px)) scale(1.06);box-shadow:0 10px 32px rgba(167,139,250,.6),0 0 0 4px rgba(255,255,255,.16);}
.nav-center-fab svg{width:26px;height:26px;color:#fff;}

/* ── FABs ────────────────────────────────────────────────────────────────── */
.fab{position:fixed;bottom:calc(var(--nav-h) + 14px);right:16px;width:50px;height:50px;border-radius:50%;border:none;cursor:pointer;display:flex;align-items:center;justify-content:center;color:#fff;box-shadow:0 4px 18px rgba(0,0,0,.4);transition:all .25s;z-index:40;}
.fab:hover{transform:scale(1.08) rotate(90deg);}
.fab-notes{background:linear-gradient(135deg,var(--note),var(--note2));}
.fab-diary{background:linear-gradient(135deg,var(--diary),var(--diary2));}
.fab svg{width:20px;height:20px;}

/* ── SECTION LABELS ──────────────────────────────────────────────────────── */
.sec-label{font-size:.52rem;letter-spacing:.22em;color:var(--text3);font-family:'JetBrains Mono',monospace;text-transform:uppercase;margin-bottom:10px;}
.empty-state{text-align:center;padding:40px 20px;color:var(--text3);font-size:.8rem;font-weight:300;font-style:italic;}

/* ── TODO ────────────────────────────────────────────────────────────────── */
.todo-add-card{background:var(--bg2);border:1px solid var(--border);border-radius:14px;padding:12px 14px;margin-bottom:16px;}
.todo-add-row1{display:flex;gap:8px;align-items:center;margin-bottom:10px;}
.todo-add-row1 input{flex:1;background:none;border:none;outline:none;font-family:'Sora',sans-serif;font-size:.88rem;color:var(--text);}
.todo-add-row1 input::placeholder{color:var(--text3);}
.todo-add-row2{display:flex;align-items:center;gap:6px;padding-top:8px;border-top:1px solid var(--border);flex-wrap:wrap;}
.priority-pills{display:flex;gap:4px;}
.pp{font-size:.55rem;font-weight:500;letter-spacing:.08em;padding:3px 8px;border-radius:20px;cursor:pointer;border:1px solid;font-family:'JetBrains Mono',monospace;transition:all .2s;text-transform:uppercase;}
.pp.easy{color:var(--easy);border-color:rgba(74,222,128,.2);}
.pp.easy.sel,.pp.easy:hover{background:rgba(74,222,128,.1);border-color:var(--easy);}
.pp.mid{color:var(--mid);border-color:rgba(251,146,60,.2);}
.pp.mid.sel,.pp.mid:hover{background:rgba(251,146,60,.1);border-color:var(--mid);}
.pp.hard{color:var(--hard);border-color:rgba(248,113,113,.2);}
.pp.hard.sel,.pp.hard:hover{background:rgba(248,113,113,.1);border-color:var(--hard);}
.date-pick{background:none;border:1px solid var(--border);border-radius:8px;padding:3px 7px;font-family:'JetBrains Mono',monospace;font-size:.58rem;color:var(--text2);outline:none;cursor:pointer;color-scheme:dark;transition:border-color .2s;}
.date-pick:focus{border-color:rgba(124,111,247,.4);color:var(--accent2);}
.add-todo-btn{width:26px;height:26px;border-radius:50%;background:var(--accent);border:none;cursor:pointer;display:flex;align-items:center;justify-content:center;flex-shrink:0;transition:transform .2s;margin-left:auto;}
.add-todo-btn:hover{transform:scale(1.1);}
.add-todo-btn svg{width:13px;height:13px;color:#fff;}
.todo-group{margin-bottom:14px;}
.todo-group-label{font-size:.52rem;letter-spacing:.2em;color:var(--text3);font-family:'JetBrains Mono',monospace;text-transform:uppercase;margin-bottom:7px;}
.todo-item{display:flex;align-items:flex-start;gap:10px;background:var(--bg2);border:1px solid var(--border);border-radius:10px;padding:10px 12px;margin-bottom:6px;transition:all .35s cubic-bezier(.4,0,.2,1);position:relative;overflow:hidden;}
.todo-item.completing{transform:translateX(110%);opacity:0;}
.todo-check{width:18px;height:18px;border-radius:50%;border:1.5px solid var(--border2);flex-shrink:0;cursor:pointer;display:flex;align-items:center;justify-content:center;margin-top:2px;transition:all .2s;}
.todo-check:hover{border-color:var(--accent2);background:rgba(124,111,247,.08);}
.todo-body{flex:1;}
.todo-text{font-size:.84rem;font-weight:300;color:var(--text);line-height:1.4;}
.todo-meta{display:flex;align-items:center;gap:5px;margin-top:3px;flex-wrap:wrap;}
.todo-badge{font-size:.48rem;font-weight:500;letter-spacing:.1em;padding:2px 6px;border-radius:7px;font-family:'JetBrains Mono',monospace;text-transform:uppercase;}
.todo-item.easy .todo-badge{color:var(--easy);background:rgba(74,222,128,.09);}
.todo-item.mid .todo-badge{color:var(--mid);background:rgba(251,146,60,.09);}
.todo-item.hard .todo-badge{color:var(--hard);background:rgba(248,113,113,.09);}
.todo-item.done{opacity:.4;}
.todo-item.done .todo-text{text-decoration:line-through;color:var(--text3);}
.due-tag{font-size:.48rem;color:var(--text3);font-family:'JetBrains Mono',monospace;}
.due-tag.overdue{color:var(--hard);}
.due-tag.today{color:var(--easy);}
.due-tag.soon{color:var(--mid);}
.todo-dot{width:7px;height:7px;border-radius:50%;flex-shrink:0;margin-top:4px;}
.todo-item.easy .todo-dot{background:var(--easy);box-shadow:0 0 6px rgba(74,222,128,.4);}
.todo-item.mid .todo-dot{background:var(--mid);box-shadow:0 0 6px rgba(251,146,60,.4);}
.todo-item.hard .todo-dot{background:var(--hard);box-shadow:0 0 6px rgba(248,113,113,.4);}
.completed-toggle{display:flex;align-items:center;gap:7px;cursor:pointer;padding:7px 0;margin-bottom:7px;color:var(--text3);font-size:.7rem;font-weight:300;border:none;background:none;font-family:'Sora',sans-serif;transition:color .2s;}
.completed-toggle:hover{color:var(--text2);}
.completed-toggle svg{width:13px;height:13px;transition:transform .25s;}
.completed-toggle.open svg{transform:rotate(90deg);}
.completed-badge{font-size:.5rem;font-family:'JetBrains Mono',monospace;background:var(--bg3);border:1px solid var(--border);border-radius:7px;padding:1px 6px;color:var(--text3);}
.completed-list{overflow:hidden;max-height:0;transition:max-height .4s cubic-bezier(.4,0,.2,1);}
.completed-list.open{max-height:2000px;}

/* ── NOTES ───────────────────────────────────────────────────────────────── */
.notes-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(150px,1fr));gap:10px;}
.note-card{background:var(--bg2);border:1px solid var(--border);border-radius:13px;padding:14px;cursor:pointer;transition:all .22s;min-height:120px;display:flex;flex-direction:column;gap:7px;position:relative;overflow:hidden;}
.note-card::after{content:'';position:absolute;inset:0;border-radius:13px;background:linear-gradient(135deg,rgba(96,165,250,.07),transparent);opacity:0;transition:opacity .22s;}
.note-card:hover{border-color:rgba(96,165,250,.3);transform:translateY(-2px);box-shadow:0 6px 22px rgba(0,0,0,.3);}
.note-card:hover::after{opacity:1;}
.note-card-title{font-size:.8rem;font-weight:500;color:var(--text);line-height:1.4;}
.note-card-preview{font-size:.7rem;font-weight:300;color:var(--text2);line-height:1.5;flex:1;overflow:hidden;display:-webkit-box;-webkit-line-clamp:4;-webkit-box-orient:vertical;}
.note-card-date{font-size:.5rem;color:var(--text3);font-family:'JetBrains Mono',monospace;margin-top:auto;}
.note-media-tag{font-size:.46rem;padding:2px 5px;border-radius:5px;background:rgba(96,165,250,.1);color:var(--note2);font-family:'JetBrains Mono',monospace;}
.note-tag-chip{display:inline-flex;align-items:center;gap:3px;padding:1px 6px;border-radius:8px;font-size:.46rem;font-family:'JetBrains Mono',monospace;border:1px solid;margin-right:3px;margin-top:2px;}

/* ── DIARY ───────────────────────────────────────────────────────────────── */
.diary-timeline{display:flex;flex-direction:column;gap:12px;}
.diary-entry{background:var(--bg2);border:1px solid var(--border);border-radius:14px;padding:16px 16px 16px 20px;cursor:pointer;transition:all .22s;position:relative;overflow:hidden;}
.diary-entry::before{content:'';position:absolute;left:0;top:0;bottom:0;width:3px;background:linear-gradient(to bottom,var(--diary),transparent);border-radius:3px 0 0 3px;}
.diary-entry:hover{border-color:rgba(244,114,182,.25);transform:translateX(3px);}
.diary-entry-header{display:flex;align-items:center;justify-content:space-between;margin-bottom:7px;}
.diary-entry-date{font-family:'JetBrains Mono',monospace;font-size:.56rem;color:var(--diary);letter-spacing:.1em;}
.diary-mood-icon{font-size:.95rem;}
.diary-entry-title{font-size:.9rem;font-weight:500;color:var(--text);margin-bottom:5px;}
.diary-entry-preview{font-size:.74rem;font-weight:300;color:var(--text2);line-height:1.6;overflow:hidden;display:-webkit-box;-webkit-line-clamp:3;-webkit-box-orient:vertical;}

/* ── SEARCH ──────────────────────────────────────────────────────────────── */
.search-bar-wrap{position:relative;margin-bottom:16px;}
.search-input{width:100%;background:var(--bg2);border:1px solid var(--border);border-radius:13px;padding:12px 65px 12px 40px;font-family:'Sora',sans-serif;font-size:.86rem;color:var(--text);outline:none;transition:border-color .22s,box-shadow .22s;}
.search-input:focus{border-color:rgba(124,111,247,.4);box-shadow:0 0 16px rgba(124,111,247,.08);}
.search-input::placeholder{color:var(--text3);}
.si-icon{position:absolute;left:13px;top:50%;transform:translateY(-50%);color:var(--text3);display:flex;}
.si-icon svg{width:16px;height:16px;}
.ai-badge{position:absolute;right:11px;top:50%;transform:translateY(-50%);font-size:.46rem;letter-spacing:.15em;font-family:'JetBrains Mono',monospace;background:linear-gradient(135deg,rgba(124,111,247,.15),rgba(168,157,254,.15));color:var(--accent2);padding:2px 7px;border-radius:7px;border:1px solid rgba(124,111,247,.2);}
.search-result-item{background:var(--bg2);border:1px solid var(--border);border-radius:11px;padding:12px 14px;cursor:pointer;transition:all .18s;margin-bottom:8px;}
.search-result-item:hover{border-color:rgba(124,111,247,.3);transform:translateX(2px);}
.srt{font-size:.48rem;font-weight:500;letter-spacing:.2em;font-family:'JetBrains Mono',monospace;text-transform:uppercase;margin-bottom:4px;}
.srt.note{color:var(--note);}
.srt.diary{color:var(--diary);}
.srt.todo{color:var(--easy);}
.srTitle{font-size:.82rem;font-weight:400;color:var(--text);margin-bottom:2px;}
.srSnip{font-size:.72rem;font-weight:300;color:var(--text2);line-height:1.5;}
.srSnip mark{background:rgba(124,111,247,.2);color:var(--accent2);border-radius:2px;padding:0 2px;font-style:normal;}
.ai-thinking{display:flex;align-items:center;gap:7px;padding:12px 0;color:var(--text3);font-size:.72rem;font-family:'JetBrains Mono',monospace;}
.ai-dots{display:flex;gap:4px;}
.ai-dot{width:5px;height:5px;border-radius:50%;background:var(--accent);animation:pd 1.2s ease-in-out infinite;}
.ai-dot:nth-child(2){animation-delay:.2s;}
.ai-dot:nth-child(3){animation-delay:.4s;}
@keyframes pd{0%,80%,100%{opacity:.2;transform:scale(.8);}40%{opacity:1;transform:scale(1.1);}}

/* ── CALENDAR ────────────────────────────────────────────────────────────── */
.calendar-header{display:flex;align-items:center;justify-content:space-between;margin-bottom:12px;}
.cal-nav-btn{background:none;border:none;cursor:pointer;color:var(--text2);width:28px;height:28px;display:flex;align-items:center;justify-content:center;border-radius:7px;transition:background .2s;}
.cal-nav-btn:hover{background:var(--bg3);}
.cal-grid-head{display:grid;grid-template-columns:repeat(7,1fr);text-align:center;margin-bottom:4px;}
.cal-dh{font-size:.56rem;color:var(--text3);font-family:'JetBrains Mono',monospace;padding:3px 0;}
.cal-grid{display:grid;grid-template-columns:repeat(7,1fr);gap:2px;}
.cal-day{aspect-ratio:1;display:flex;align-items:center;justify-content:center;border-radius:7px;cursor:pointer;font-size:.74rem;color:var(--text2);position:relative;transition:all .14s;font-family:'JetBrains Mono',monospace;}
.cal-day:hover{background:var(--bg3);color:var(--text);}
.cal-day.other{color:var(--text3);}
.cal-day.today{color:var(--accent2);font-weight:600;}
.cal-day.today::after{content:'';position:absolute;bottom:3px;left:50%;transform:translateX(-50%);width:4px;height:4px;border-radius:50%;background:var(--accent);}
.cal-day.has-entry::before{content:'';position:absolute;top:3px;right:4px;width:4px;height:4px;border-radius:50%;background:var(--diary);opacity:.8;}
.cal-day.has-plan::after{content:'';position:absolute;bottom:3px;right:4px;width:4px;height:4px;border-radius:50%;background:var(--accent);opacity:.7;}
.cal-day.selected{background:var(--accent)!important;color:#fff!important;}
.quote-card{margin-top:14px;background:linear-gradient(135deg,var(--bg2),var(--bg3));border:1px solid var(--border);border-radius:14px;padding:16px 18px;position:relative;overflow:hidden;}
.quote-card::before{content:'\201C';position:absolute;top:-8px;left:12px;font-size:4.5rem;color:rgba(124,111,247,.1);font-family:Georgia,serif;line-height:1;}
.quote-text{font-size:.84rem;font-weight:300;font-style:italic;color:var(--text2);line-height:1.7;margin-bottom:8px;position:relative;z-index:1;}
.quote-author{font-family:'JetBrains Mono',monospace;font-size:.56rem;color:var(--accent2);letter-spacing:.1em;text-transform:uppercase;}
.quote-tag{display:inline-block;margin-left:7px;font-size:.46rem;padding:2px 6px;border-radius:7px;background:rgba(124,111,247,.1);color:var(--accent2);border:1px solid rgba(124,111,247,.15);letter-spacing:.08em;text-transform:uppercase;vertical-align:middle;}
.cal-day-panel{margin-top:14px;}
.cal-plan-textarea{width:100%;background:var(--bg2);border:1px solid var(--border);border-radius:10px;padding:9px 11px;font-family:'Sora',sans-serif;font-size:.8rem;font-weight:300;color:var(--text2);line-height:1.6;resize:none;min-height:72px;outline:none;transition:border-color .2s;}
.cal-plan-textarea:focus{border-color:rgba(124,111,247,.35);}
.cal-plan-textarea::placeholder{color:var(--text3);}
.cal-plan-display{font-size:.82rem;font-weight:300;color:var(--text2);line-height:1.6;background:var(--bg2);border:1px solid var(--border);border-radius:10px;padding:10px 12px;margin-bottom:4px;white-space:pre-wrap;}
.cal-event-item{display:flex;align-items:flex-start;gap:9px;padding:8px 0;border-bottom:1px solid var(--border);cursor:pointer;}
.cal-event-dot{width:6px;height:6px;border-radius:50%;flex-shrink:0;margin-top:4px;background:var(--diary);}
.cal-event-text{font-size:.78rem;font-weight:300;color:var(--text2);}
.cal-event-time{font-size:.56rem;color:var(--text3);font-family:'JetBrains Mono',monospace;margin-top:1px;}
.cal-panel-section-title{font-size:.52rem;letter-spacing:.2em;color:var(--text3);font-family:'JetBrains Mono',monospace;text-transform:uppercase;margin-bottom:7px;}
.cal-view-btn{width:28px;height:28px;border-radius:7px;background:var(--bg2);border:1px solid var(--border);display:flex;align-items:center;justify-content:center;cursor:pointer;color:var(--text3);transition:all .18s;}
.cal-view-btn:hover{background:var(--bg3);color:var(--text2);}
.cal-view-btn.active{background:rgba(124,111,247,.15);border-color:rgba(124,111,247,.35);color:var(--accent2);}
.cal-week-strip{display:grid;grid-template-columns:repeat(7,1fr);gap:4px;margin-bottom:12px;}
.cal-week-day{display:flex;flex-direction:column;align-items:center;gap:3px;padding:7px 4px;border-radius:10px;cursor:pointer;transition:all .15s;border:1px solid transparent;}
.cal-week-day:hover{background:var(--bg3);}
.cal-week-day.today{background:rgba(124,111,247,.1);border-color:rgba(124,111,247,.2);}
.cal-week-day.selected{background:var(--accent)!important;border-color:var(--accent)!important;}
.cal-week-day-name{font-size:.52rem;font-family:'JetBrains Mono',monospace;color:var(--text3);text-transform:uppercase;letter-spacing:.06em;}
.cal-week-day-num{font-size:.88rem;font-family:'JetBrains Mono',monospace;color:var(--text2);font-weight:500;}
.cal-week-day.today .cal-week-day-num{color:var(--accent2);}
.cal-week-day.selected .cal-week-day-name,.cal-week-day.selected .cal-week-day-num{color:#fff;}
.cal-week-dot-row{display:flex;gap:2px;}
.cal-week-dot{width:4px;height:4px;border-radius:50%;}
.cal-agenda-item{display:flex;align-items:flex-start;gap:10px;padding:10px 12px;background:var(--bg2);border-radius:10px;border:1px solid var(--border);margin-bottom:7px;cursor:pointer;transition:border-color .18s;}
.cal-agenda-item:hover{border-color:var(--border2);}
.cal-agenda-dot{width:8px;height:8px;border-radius:50%;flex-shrink:0;margin-top:4px;}
.cal-agenda-title{font-size:.8rem;font-weight:400;color:var(--text);}
.cal-agenda-meta{font-size:.6rem;font-family:'JetBrains Mono',monospace;color:var(--text3);margin-top:2px;}
.cal-day.has-todo::before{content:'';position:absolute;top:3px;left:4px;width:4px;height:4px;border-radius:50%;background:var(--note);opacity:.8;}
.cal-day.overdue-dot::after{content:'';position:absolute;bottom:3px;left:50%;transform:translateX(-50%);width:4px;height:4px;border-radius:50%;background:var(--hard);animation:reminderPulse 1.8s ease-in-out infinite;}
@keyframes reminderPulse{0%,100%{opacity:.5;}50%{opacity:1;}}
.backup-stat-row{display:grid;grid-template-columns:repeat(3,1fr);gap:8px;margin-bottom:16px;}
.backup-stat{background:var(--bg3);border:1px solid var(--border);border-radius:10px;padding:10px 8px;text-align:center;}
.backup-stat-num{font-size:1.1rem;font-family:'JetBrains Mono',monospace;font-weight:500;color:var(--accent2);}
.backup-stat-lbl{font-size:.56rem;color:var(--text3);font-family:'JetBrains Mono',monospace;letter-spacing:.1em;text-transform:uppercase;margin-top:2px;}
.backup-section-title{font-size:.52rem;letter-spacing:.2em;color:var(--text3);font-family:'JetBrains Mono',monospace;text-transform:uppercase;margin-bottom:8px;}
.backup-btn{width:100%;display:flex;align-items:center;gap:12px;padding:11px 13px;background:var(--bg3);border:1px solid var(--border);border-radius:11px;cursor:pointer;color:var(--text2);transition:all .18s;margin-bottom:7px;text-align:left;}
.backup-btn:hover{background:rgba(255,255,255,.04);border-color:var(--border2);color:var(--text);}
.backup-auto-btn{background:rgba(124,111,247,.15);border:1px solid rgba(124,111,247,.3);border-radius:8px;padding:5px 12px;font-size:.64rem;font-family:'Sora',sans-serif;color:var(--accent2);cursor:pointer;transition:all .18s;white-space:nowrap;}
.backup-auto-btn:hover{background:rgba(124,111,247,.25);}
.reminder-item{display:flex;align-items:flex-start;gap:10px;padding:10px 12px;background:var(--bg3);border:1px solid var(--border);border-radius:10px;margin-bottom:7px;}
.reminder-item.overdue{border-color:rgba(248,113,113,.35);background:rgba(248,113,113,.05);}
.reminder-item.today{border-color:rgba(251,146,60,.35);background:rgba(251,146,60,.05);}
.reminder-item.soon{border-color:rgba(124,111,247,.2);}
.reminder-badge{font-size:.5rem;font-family:'JetBrains Mono',monospace;letter-spacing:.1em;text-transform:uppercase;padding:2px 6px;border-radius:4px;border:1px solid;flex-shrink:0;margin-top:2px;}
.reminder-badge.overdue{color:var(--hard);border-color:rgba(248,113,113,.4);}
.reminder-badge.today{color:var(--mid);border-color:rgba(251,146,60,.4);}
.reminder-badge.soon{color:var(--accent2);border-color:rgba(124,111,247,.3);}
.reminder-text{font-size:.78rem;color:var(--text2);font-weight:300;flex:1;}
.reminder-date{font-size:.6rem;font-family:'JetBrains Mono',monospace;color:var(--text3);margin-top:2px;}
/* notif-bell kaldırıldı - drawer'dan erişilir */

/* ── DASHBOARD (Ana Ekran) ───────────────────────────────────────────────── */
.dash-greeting h2{font-size:1.15rem;font-weight:300;color:var(--text);margin-bottom:3px;}
.dash-greeting p{font-size:.68rem;font-weight:300;color:var(--text3);font-family:'JetBrains Mono',monospace;margin-bottom:14px;}
.dash-grid{display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-bottom:14px;}
.dash-card{background:var(--bg2);border:1px solid var(--border);border-radius:13px;padding:14px;cursor:pointer;transition:all .2s;}
.dash-card:hover{border-color:var(--border2);transform:translateY(-1px);}
.dash-card-icon{font-size:1.25rem;margin-bottom:6px;}
.dash-card-num{font-family:'JetBrains Mono',monospace;font-size:1.45rem;font-weight:500;color:var(--accent2);line-height:1;margin-bottom:3px;}
.dash-card-label{font-size:.55rem;color:var(--text3);font-family:'JetBrains Mono',monospace;letter-spacing:.08em;text-transform:uppercase;}
.dash-section{background:var(--bg2);border:1px solid var(--border);border-radius:13px;padding:14px;margin-bottom:12px;}
.dash-section-title{font-size:.52rem;letter-spacing:.2em;color:var(--text3);font-family:'JetBrains Mono',monospace;text-transform:uppercase;margin-bottom:10px;}
.dash-todo-row{display:flex;align-items:center;gap:8px;padding:6px 0;border-bottom:1px solid var(--border);}
.dash-todo-row:last-child{border-bottom:none;}
.dash-todo-dot{width:6px;height:6px;border-radius:50%;flex-shrink:0;}
.dash-todo-text{font-size:.78rem;font-weight:300;color:var(--text2);flex:1;}
.dash-quote{background:linear-gradient(135deg,var(--bg2),var(--bg3));border:1px solid var(--border);border-radius:13px;padding:14px;margin-bottom:12px;}
.dash-quote-text{font-size:.82rem;font-weight:300;font-style:italic;color:var(--text2);line-height:1.65;margin-bottom:6px;}
.dash-quote-author{font-size:.54rem;color:var(--accent2);font-family:'JetBrains Mono',monospace;letter-spacing:.1em;}

/* ── POMODORO ────────────────────────────────────────────────────────────── */
.pomo-card{background:var(--bg2);border:1px solid var(--border);border-radius:16px;padding:20px;margin-bottom:16px;text-align:center;position:relative;overflow:hidden;}
.pomo-card::before{content:'';position:absolute;inset:0;background:radial-gradient(circle at 50% 0%,rgba(124,111,247,.08),transparent 60%);pointer-events:none;}
.pomo-modes{display:flex;gap:6px;justify-content:center;margin-bottom:16px;}
.pomo-mode-btn{padding:4px 12px;border-radius:12px;border:1px solid var(--border);background:none;cursor:pointer;font-family:'JetBrains Mono',monospace;font-size:.52rem;color:var(--text3);transition:all .2s;letter-spacing:.08em;}
.pomo-mode-btn.active{background:rgba(124,111,247,.15);border-color:var(--accent);color:var(--accent2);}
.pomo-ring{position:relative;width:140px;height:140px;margin:0 auto 14px;}
.pomo-svg{width:140px;height:140px;transform:rotate(-90deg);}
.pomo-track{fill:none;stroke:var(--bg3);stroke-width:8;}
.pomo-prog{fill:none;stroke-width:8;stroke-linecap:round;stroke-dasharray:377;transition:stroke-dashoffset 1s linear;}
.pomo-prog.work{stroke:var(--accent);}
.pomo-prog.short{stroke:var(--easy);}
.pomo-prog.long{stroke:var(--note);}
.pomo-time{position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);font-family:'JetBrains Mono',monospace;font-size:1.6rem;font-weight:500;color:var(--text);letter-spacing:.04em;}
.pomo-label{font-size:.58rem;font-family:'JetBrains Mono',monospace;color:var(--text3);letter-spacing:.15em;text-transform:uppercase;margin-bottom:12px;}
.pomo-controls{display:flex;gap:10px;justify-content:center;align-items:center;}
.pomo-btn{width:44px;height:44px;border-radius:50%;border:none;cursor:pointer;display:flex;align-items:center;justify-content:center;transition:all .2s;}
.pomo-btn.main{background:var(--accent);color:#fff;box-shadow:0 4px 14px rgba(124,111,247,.35);}
.pomo-btn.main:hover{transform:scale(1.08);box-shadow:0 6px 18px rgba(124,111,247,.45);}
.pomo-btn.sec{background:var(--bg3);border:1px solid var(--border2);color:var(--text2);}
.pomo-btn.sec:hover{background:rgba(255,255,255,.06);}
.pomo-sessions{display:flex;gap:5px;justify-content:center;margin-top:12px;}
.pomo-sess-dot{width:8px;height:8px;border-radius:50%;border:1.5px solid var(--accent);transition:all .3s;}
.pomo-sess-dot.done{background:var(--accent);}
.pomo-task-lbl{font-size:.72rem;font-weight:300;color:var(--text2);margin-top:10px;font-style:italic;}
.pomo-todo-item{display:flex;align-items:center;gap:10px;background:var(--bg2);border:1px solid var(--border);border-radius:10px;padding:10px 12px;margin-bottom:6px;cursor:pointer;transition:all .2s;}
.pomo-todo-item:hover{border-color:var(--border2);}
.pomo-todo-item.selected{border-color:var(--accent);background:rgba(124,111,247,.06);}

/* ── KANBAN ──────────────────────────────────────────────────────────────── */
.kanban-board{display:flex;gap:10px;overflow-x:auto;padding-bottom:8px;margin-top:4px;}
.kanban-col{flex:0 0 calc(33.333% - 7px);min-width:200px;background:var(--bg2);border:1px solid var(--border);border-radius:14px;padding:12px;min-height:200px;display:flex;flex-direction:column;}
.kanban-col-header{display:flex;align-items:center;justify-content:space-between;margin-bottom:10px;}
.kanban-col-title{font-size:.56rem;font-weight:500;letter-spacing:.18em;text-transform:uppercase;font-family:'JetBrains Mono',monospace;}
.kanban-col.col-todo .kanban-col-title{color:var(--text3);}
.kanban-col.col-doing .kanban-col-title{color:var(--mid);}
.kanban-col.col-done .kanban-col-title{color:var(--easy);}
.kanban-count{font-size:.5rem;font-family:'JetBrains Mono',monospace;background:var(--bg3);border:1px solid var(--border);border-radius:6px;padding:1px 6px;color:var(--text3);}
.kanban-cards{flex:1;display:flex;flex-direction:column;gap:7px;}
.kanban-card{background:var(--bg3);border:1px solid var(--border);border-radius:9px;padding:10px;transition:all .2s;}
.kanban-card:hover{border-color:var(--border2);transform:translateY(-1px);box-shadow:0 3px 10px rgba(0,0,0,.25);}
.kanban-card-text{font-size:.78rem;font-weight:300;color:var(--text);margin-bottom:5px;line-height:1.4;}
.kanban-move-btns{display:flex;gap:3px;margin-top:6px;}
.kmb{background:none;border:1px solid var(--border);border-radius:5px;padding:2px 7px;font-size:.5rem;font-family:'JetBrains Mono',monospace;color:var(--text3);cursor:pointer;transition:all .18s;}
.kmb:hover{border-color:var(--border2);color:var(--text2);}
.kanban-add-btn{width:100%;margin-top:8px;padding:7px;background:none;border:1px dashed var(--border);border-radius:8px;cursor:pointer;font-family:'JetBrains Mono',monospace;font-size:.54rem;color:var(--text3);letter-spacing:.1em;transition:all .2s;}
.kanban-add-btn:hover{border-color:var(--border2);color:var(--text2);}

/* ── WEEKLY SUMMARY ──────────────────────────────────────────────────────── */
.weekly-card{background:var(--bg2);border:1px solid var(--border);border-radius:14px;padding:16px;margin-bottom:12px;}
.weekly-card-title{font-size:.54rem;letter-spacing:.2em;color:var(--text3);font-family:'JetBrains Mono',monospace;text-transform:uppercase;margin-bottom:12px;}
.weekly-stats{display:grid;grid-template-columns:repeat(3,1fr);gap:10px;margin-bottom:14px;}
.wstat-box{background:var(--bg3);border:1px solid var(--border);border-radius:10px;padding:10px;text-align:center;}
.wstat-num{font-family:'JetBrains Mono',monospace;font-size:1.4rem;font-weight:500;color:var(--accent2);line-height:1;}
.wstat-label{font-size:.5rem;color:var(--text3);font-family:'JetBrains Mono',monospace;letter-spacing:.08em;margin-top:4px;}
.week-bars{display:flex;gap:4px;align-items:flex-end;height:48px;margin-bottom:4px;}
.week-bar{flex:1;border-radius:3px 3px 0 0;min-height:3px;opacity:.75;transition:height .5s cubic-bezier(.4,0,.2,1);}
.week-bar-labels{display:flex;gap:4px;}
.week-bar-label{flex:1;text-align:center;font-size:.46rem;color:var(--text3);font-family:'JetBrains Mono',monospace;}
.streak-row{display:flex;align-items:center;gap:10px;padding:10px;background:var(--bg3);border:1px solid var(--border);border-radius:10px;}
.streak-num{font-family:'JetBrains Mono',monospace;font-size:1.3rem;font-weight:500;color:var(--mid);}
.streak-info .streak-label{font-size:.72rem;font-weight:300;color:var(--text2);}
.streak-info .streak-sub{font-size:.54rem;color:var(--text3);font-family:'JetBrains Mono',monospace;}

/* ── QUICK CAPTURE (Pro) ─────────────────────────────────────────────────── */
.quick-capture{background:var(--bg2);border:1px solid rgba(56,189,248,.2);border-radius:14px;padding:14px;margin-bottom:14px;position:relative;overflow:hidden;}
.quick-capture::before{content:'';position:absolute;inset:0;background:linear-gradient(135deg,rgba(56,189,248,.04),transparent);pointer-events:none;}
.qc-label{font-size:.52rem;letter-spacing:.2em;color:#7dd3fc;font-family:'JetBrains Mono',monospace;text-transform:uppercase;margin-bottom:8px;display:flex;align-items:center;gap:6px;}
.qc-label::before{content:'';width:4px;height:4px;border-radius:50%;background:#7dd3fc;box-shadow:0 0 8px rgba(56,189,248,.5);}
.quick-capture textarea{width:100%;background:none;border:none;outline:none;font-family:'Sora',sans-serif;font-size:.84rem;color:var(--text);line-height:1.6;resize:none;min-height:60px;}
.quick-capture textarea::placeholder{color:var(--text3);}
.qc-actions{display:flex;justify-content:flex-end;gap:7px;margin-top:8px;padding-top:8px;border-top:1px solid var(--border);}
.qc-save-btn{padding:5px 14px;background:linear-gradient(135deg,#38bdf8,rgba(56,189,248,.7));border:none;border-radius:8px;cursor:pointer;font-family:'Sora',sans-serif;font-size:.72rem;color:#fff;transition:opacity .2s;}
.qc-save-btn:hover{opacity:.88;}
.qc-discard-btn{padding:5px 12px;background:none;border:1px solid var(--border2);border-radius:8px;cursor:pointer;font-family:'Sora',sans-serif;font-size:.72rem;color:var(--text3);transition:all .2s;}
.qc-discard-btn:hover{color:var(--text2);}

/* ── READING LIST ────────────────────────────────────────────────────────── */
.reading-group-title{font-size:.52rem;letter-spacing:.2em;color:var(--text3);font-family:'JetBrains Mono',monospace;text-transform:uppercase;margin:12px 0 7px;}
.reading-item{display:flex;align-items:center;gap:10px;background:var(--bg2);border:1px solid var(--border);border-radius:10px;padding:10px 12px;margin-bottom:7px;cursor:pointer;transition:all .2s;}
.reading-item:hover{border-color:var(--border2);}
.reading-dot{width:8px;height:8px;border-radius:50%;flex-shrink:0;}
.reading-dot.reading{background:var(--mid);box-shadow:0 0 8px rgba(251,146,60,.5);}
.reading-dot.toread{background:rgba(255,255,255,.2);}
.reading-dot.done{background:var(--easy);box-shadow:0 0 8px rgba(74,222,128,.4);}
.reading-info{flex:1;}
.reading-title{font-size:.82rem;font-weight:400;color:var(--text);margin-bottom:2px;}
.reading-author{font-size:.62rem;color:var(--text3);font-family:'JetBrains Mono',monospace;}
.reading-badge{font-size:.5rem;font-family:'JetBrains Mono',monospace;padding:2px 7px;border-radius:7px;text-transform:uppercase;letter-spacing:.08em;}
/* ── ÖĞRENCİ DASHBOARD ───────────────────────────────────────────────────── */
.sdash-section{background:var(--bg2);border:1px solid var(--border);border-radius:14px;padding:14px;margin-bottom:10px;}
.sdash-section-title{display:flex;align-items:center;gap:6px;font-size:.52rem;letter-spacing:.18em;color:var(--text3);font-family:'JetBrains Mono',monospace;text-transform:uppercase;margin-bottom:11px;}
.sdash-more-btn{margin-left:auto;background:none;border:none;color:var(--accent2);font-size:.58rem;font-family:'JetBrains Mono',monospace;cursor:pointer;padding:0;opacity:.8;}
.sdash-more-btn:hover{opacity:1;}
.sdash-lesson{display:flex;align-items:center;gap:9px;padding:7px 0;border-bottom:1px solid var(--border);}
.sdash-lesson:last-child{border-bottom:none;}
.sdash-lesson-bar{width:3px;height:28px;border-radius:2px;flex-shrink:0;}
.sdash-lesson-info{flex:1;}
.sdash-lesson-name{font-size:.8rem;font-weight:400;color:var(--text);}
.sdash-lesson-room{font-size:.6rem;color:var(--text3);margin-top:1px;}
.sdash-lesson-time{font-size:.6rem;font-family:'JetBrains Mono',monospace;color:var(--text3);white-space:nowrap;}
.sdash-exam{display:flex;align-items:center;gap:9px;padding:7px 0;border-bottom:1px solid var(--border);}
.sdash-exam:last-child{border-bottom:none;}
.sdash-exam-ico{font-size:.9rem;flex-shrink:0;}
.sdash-exam-info{flex:1;}
.sdash-exam-name{font-size:.8rem;font-weight:400;color:var(--text);}
.sdash-exam-date{font-size:.6rem;font-family:'JetBrains Mono',monospace;color:var(--text3);margin-top:1px;}
.sdash-exam-diff{font-size:.6rem;font-family:'JetBrains Mono',monospace;white-space:nowrap;}
/* ── SLIDES ──────────────────────────────────────────────────────────────── */
.slides-header{display:flex;align-items:center;gap:8px;margin-bottom:10px;flex-wrap:wrap;}
.slides-cats{display:flex;gap:6px;flex:1;overflow-x:auto;scrollbar-width:none;padding-bottom:2px;}
.slides-cats::-webkit-scrollbar{display:none;}
.slide-cat-btn{padding:4px 12px;border-radius:20px;border:1px solid var(--border);background:none;font-size:.65rem;color:var(--text3);cursor:pointer;white-space:nowrap;font-family:'Sora',sans-serif;transition:all .18s;flex-shrink:0;}
.slide-cat-btn.active{background:rgba(124,111,247,.15);border-color:rgba(124,111,247,.4);color:var(--accent2);}
.slides-upload-btn{display:flex;align-items:center;gap:6px;padding:7px 13px;border-radius:10px;background:linear-gradient(135deg,var(--accent),rgba(124,111,247,.8));border:none;color:#fff;font-size:.72rem;font-family:'Sora',sans-serif;cursor:pointer;white-space:nowrap;flex-shrink:0;transition:opacity .2s;}
.slides-upload-btn:hover{opacity:.85;}
.slides-search-bar{display:flex;align-items:center;gap:8px;background:var(--bg2);border:1px solid var(--border);border-radius:10px;padding:8px 12px;margin-bottom:14px;transition:border-color .2s;}
.slides-search-bar:focus-within{border-color:rgba(124,111,247,.4);}
.slides-grid{display:grid;grid-template-columns:repeat(2,1fr);gap:12px;padding-bottom:80px;}
.slide-card{background:var(--bg2);border:1px solid var(--border);border-radius:14px;overflow:hidden;cursor:pointer;transition:all .2s;position:relative;}
.slide-card:hover{transform:translateY(-2px);box-shadow:0 8px 24px rgba(0,0,0,.3);border-color:var(--border2);}
.slide-thumb{width:100%;height:110px;background:linear-gradient(135deg,#1a1a2e,#16213e);display:flex;align-items:center;justify-content:center;position:relative;overflow:hidden;}
.slide-thumb canvas{width:100%;height:100%;object-fit:cover;}
.slide-thumb-placeholder{display:flex;flex-direction:column;align-items:center;gap:6px;opacity:.5;}
.slide-info{padding:9px 10px;}
.slide-name{font-size:.75rem;font-weight:500;color:var(--text);white-space:nowrap;overflow:hidden;text-overflow:ellipsis;}
.slide-meta{font-size:.58rem;font-family:'JetBrains Mono',monospace;color:var(--text3);margin-top:3px;display:flex;align-items:center;justify-content:space-between;}
.slide-cat-tag{font-size:.52rem;padding:2px 7px;border-radius:8px;background:rgba(124,111,247,.12);color:var(--accent2);border:1px solid rgba(124,111,247,.2);}
.slide-actions{position:absolute;top:6px;right:6px;display:flex;gap:4px;opacity:0;transition:opacity .18s;}
.slide-card:hover .slide-actions{opacity:1;}
.slide-action-btn{width:26px;height:26px;border-radius:7px;background:rgba(13,13,18,.85);backdrop-filter:blur(8px);border:1px solid var(--border);display:flex;align-items:center;justify-content:center;cursor:pointer;color:var(--text2);transition:all .18s;}
.slide-action-btn:hover{background:var(--bg3);}
.slide-empty{grid-column:1/-1;text-align:center;padding:48px 20px;color:var(--text3);font-size:.75rem;font-weight:300;line-height:1.8;}
/* Yanıp sönen fab */
@keyframes fabPulse{0%,100%{box-shadow:0 8px 28px rgba(167,139,250,.5),0 0 0 3px rgba(255,255,255,.12);}50%{box-shadow:0 8px 28px rgba(248,113,113,.6),0 0 0 6px rgba(248,113,113,.15);}}
.nav-center-fab.has-msg{animation:fabPulse 2.4s ease-in-out infinite;}
/* ── CHAT ────────────────────────────────────────────────────────────────── */
.chat-layout{display:flex;flex-direction:column;height:calc(100vh - var(--header-h) - var(--nav-h));gap:0;margin:-16px;padding:0;}
.chat-list-panel{display:flex;flex-direction:column;height:100%;}
.chat-list-header{display:flex;align-items:center;justify-content:space-between;padding:14px 16px 10px;flex-shrink:0;}
.chat-list-title{font-size:.88rem;font-weight:500;color:var(--text);}
.chat-unread-total{background:var(--accent);color:#fff;font-size:.55rem;font-family:'JetBrains Mono',monospace;border-radius:10px;padding:2px 8px;}
.chat-conv-list{flex:1;overflow-y:auto;padding:0 10px 80px;}
.chat-conv-item{display:flex;align-items:center;gap:11px;padding:10px;border-radius:14px;cursor:pointer;transition:background .18s;margin-bottom:4px;}
.chat-conv-item:hover{background:var(--bg2);}
.chat-conv-item.active{background:rgba(124,111,247,.12);border:1px solid rgba(124,111,247,.2);}
.chat-conv-avatar{width:44px;height:44px;border-radius:50%;flex-shrink:0;overflow:hidden;background:linear-gradient(135deg,var(--accent),var(--diary));display:flex;align-items:center;justify-content:center;font-size:.82rem;font-weight:600;color:#fff;}
.chat-conv-avatar img{width:100%;height:100%;object-fit:cover;border-radius:50%;}
.chat-conv-info{flex:1;min-width:0;}
.chat-conv-name{font-size:.82rem;font-weight:500;color:var(--text);white-space:nowrap;overflow:hidden;text-overflow:ellipsis;}
.chat-conv-preview{font-size:.68rem;color:var(--text3);white-space:nowrap;overflow:hidden;text-overflow:ellipsis;margin-top:2px;}
.chat-conv-meta{display:flex;flex-direction:column;align-items:flex-end;gap:4px;flex-shrink:0;}
.chat-conv-time{font-size:.55rem;font-family:'JetBrains Mono',monospace;color:var(--text3);}
.chat-conv-badge{background:var(--accent);color:#fff;font-size:.52rem;font-family:'JetBrains Mono',monospace;border-radius:9px;padding:1px 6px;min-width:18px;text-align:center;}
.chat-empty-state{text-align:center;padding:48px 20px;color:var(--text3);font-size:.72rem;font-weight:300;line-height:1.7;}
.chat-active-panel{display:flex;flex-direction:column;height:100%;}
.chat-active-header{display:flex;align-items:center;gap:10px;padding:12px 14px;background:rgba(13,13,18,.85);backdrop-filter:blur(20px);-webkit-backdrop-filter:blur(20px);border-bottom:1px solid var(--border);flex-shrink:0;}
.chat-back-btn{background:none;border:none;color:var(--text2);cursor:pointer;padding:4px 6px;border-radius:8px;display:flex;align-items:center;transition:background .18s;}
.chat-back-btn:hover{background:var(--bg3);}
.chat-active-name{font-size:.86rem;font-weight:500;color:var(--text);flex:1;}
.chat-active-status{font-size:.58rem;font-family:'JetBrains Mono',monospace;color:var(--easy);}
.chat-messages{flex:1;overflow-y:auto;padding:14px 14px 8px;display:flex;flex-direction:column;gap:4px;}
.chat-msg-row{display:flex;align-items:flex-end;gap:7px;margin-bottom:2px;}
.chat-msg-row.mine{flex-direction:row-reverse;}
.chat-msg-avatar{width:28px;height:28px;border-radius:50%;overflow:hidden;background:linear-gradient(135deg,var(--accent),var(--diary));display:flex;align-items:center;justify-content:center;font-size:.55rem;font-weight:600;color:#fff;flex-shrink:0;}
.chat-msg-avatar img{width:100%;height:100%;object-fit:cover;border-radius:50%;}
.chat-bubble{max-width:72%;padding:9px 13px;border-radius:18px;font-size:.8rem;font-weight:300;line-height:1.55;word-break:break-word;}
.chat-bubble.theirs{background:var(--bg2);border:1px solid var(--border);color:var(--text);border-bottom-left-radius:4px;}
.chat-bubble.mine{background:linear-gradient(135deg,var(--accent),rgba(124,111,247,.85));color:#fff;border-bottom-right-radius:4px;}
.chat-bubble-time{font-size:.5rem;opacity:.5;margin-top:3px;font-family:'JetBrains Mono',monospace;}
.chat-bubble.mine .chat-bubble-time{text-align:right;}
.chat-date-divider{text-align:center;font-size:.54rem;font-family:'JetBrains Mono',monospace;color:var(--text3);letter-spacing:.08em;margin:10px 0;display:flex;align-items:center;gap:8px;}
.chat-date-divider::before,.chat-date-divider::after{content:'';flex:1;height:1px;background:var(--border);}
.chat-input-bar{display:flex;align-items:flex-end;gap:8px;padding:10px 12px 12px;background:rgba(13,13,18,.9);backdrop-filter:blur(20px);-webkit-backdrop-filter:blur(20px);border-top:1px solid var(--border);flex-shrink:0;}
.chat-input{flex:1;background:var(--bg2);border:1px solid var(--border);border-radius:20px;padding:10px 14px;font-family:'Sora',sans-serif;font-size:.82rem;color:var(--text);outline:none;resize:none;max-height:100px;line-height:1.5;transition:border-color .2s;}
.chat-input:focus{border-color:rgba(124,111,247,.4);}
.chat-input::placeholder{color:var(--text3);}
.chat-send-btn{width:40px;height:40px;border-radius:50%;background:linear-gradient(135deg,var(--accent),rgba(124,111,247,.8));border:none;cursor:pointer;display:flex;align-items:center;justify-content:center;flex-shrink:0;transition:all .2s;color:#fff;box-shadow:0 4px 14px rgba(124,111,247,.3);}
.chat-send-btn:hover{transform:scale(1.08);}
/* ── DERS PROGRAMI ───────────────────────────────────────────────────────── */
.schedule-days{display:flex;flex-direction:column;gap:10px;}
.sched-day-block{background:var(--bg2);border:1px solid var(--border);border-radius:12px;overflow:hidden;}
.sched-day-header{font-size:.55rem;font-family:'JetBrains Mono',monospace;letter-spacing:.18em;color:var(--text3);text-transform:uppercase;padding:7px 12px;border-bottom:1px solid var(--border);background:rgba(255,255,255,.02);}
.sched-day-header.has-class{color:var(--accent2);}
.sched-lesson{display:flex;align-items:center;gap:10px;padding:9px 12px;border-bottom:1px solid var(--border);}
.sched-lesson:last-child{border-bottom:none;}
.sched-color-bar{width:3px;height:32px;border-radius:2px;flex-shrink:0;}
.sched-lesson-name{font-size:.82rem;font-weight:400;color:var(--text);flex:1;}
.sched-lesson-time{font-size:.6rem;font-family:'JetBrains Mono',monospace;color:var(--text3);}
.sched-lesson-room{font-size:.6rem;color:var(--text3);margin-top:1px;}
.sched-delete-btn{background:none;border:none;color:var(--text3);cursor:pointer;font-size:.7rem;padding:2px 5px;border-radius:4px;opacity:0;transition:opacity .18s;}
.sched-lesson:hover .sched-delete-btn{opacity:1;}
.sched-day-opt{display:flex;align-items:center;gap:4px;padding:4px 10px;border-radius:14px;cursor:pointer;font-size:.6rem;font-family:'JetBrains Mono',monospace;letter-spacing:.08em;border:1px solid var(--border);color:var(--text3);transition:all .18s;}
.sched-day-opt input{display:none;}
.sched-day-opt:has(input:checked),.sched-day-opt.sel{background:rgba(244,114,182,.12);border-color:rgba(244,114,182,.35);color:#f9a8d4;}
.color-dot{width:18px;height:18px;border-radius:50%;cursor:pointer;transition:transform .15s,box-shadow .15s;border:2px solid transparent;}
.color-dot.sel,.color-dot:hover{transform:scale(1.25);box-shadow:0 0 0 2px rgba(255,255,255,.3);}
/* ── SINAV TAKVİMİ ───────────────────────────────────────────────────────── */
.exam-item{display:flex;align-items:flex-start;gap:10px;background:var(--bg2);border:1px solid var(--border);border-radius:12px;padding:12px 14px;margin-bottom:8px;transition:border-color .18s;}
.exam-item:hover{border-color:var(--border2);}
.exam-item.overdue{border-color:rgba(248,113,113,.3);background:rgba(248,113,113,.04);}
.exam-item.today{border-color:rgba(251,146,60,.3);background:rgba(251,146,60,.04);}
.exam-countdown{font-size:.52rem;font-family:'JetBrains Mono',monospace;letter-spacing:.1em;padding:2px 7px;border-radius:5px;border:1px solid;flex-shrink:0;margin-top:2px;white-space:nowrap;}
.exam-countdown.overdue{color:var(--hard);border-color:rgba(248,113,113,.35);}
.exam-countdown.today{color:var(--mid);border-color:rgba(251,146,60,.35);}
.exam-countdown.soon{color:var(--accent2);border-color:rgba(124,111,247,.3);}
.exam-countdown.later{color:var(--text3);border-color:var(--border);}
.exam-name{font-size:.84rem;font-weight:400;color:var(--text);margin-bottom:3px;}
.exam-meta{font-size:.62rem;font-family:'JetBrains Mono',monospace;color:var(--text3);}
.exam-type-badge{font-size:.5rem;padding:1px 6px;border-radius:4px;background:rgba(255,255,255,.06);margin-right:4px;}
.exam-section-label{font-size:.5rem;letter-spacing:.2em;color:var(--text3);font-family:'JetBrains Mono',monospace;text-transform:uppercase;margin:12px 0 7px;}
.exam-delete-btn{background:none;border:none;color:var(--text3);cursor:pointer;font-size:.7rem;padding:2px 5px;margin-left:auto;opacity:0;transition:opacity .18s;}
.exam-item:hover .exam-delete-btn{opacity:1;}
/* ── NOT DEFTERİ ─────────────────────────────────────────────────────────── */
.notebook-filter{display:flex;gap:6px;flex-wrap:wrap;margin-bottom:12px;}
.notebook-filter-btn{padding:4px 12px;border-radius:14px;border:1px solid var(--border);background:none;font-size:.62rem;font-family:'JetBrains Mono',monospace;color:var(--text3);cursor:pointer;transition:all .18s;}
.notebook-filter-btn.active{background:rgba(244,114,182,.12);border-color:rgba(244,114,182,.35);color:#f9a8d4;}
.notebook-card{background:var(--bg2);border:1px solid var(--border);border-radius:12px;padding:13px 14px;margin-bottom:8px;cursor:pointer;transition:border-color .18s;}
.notebook-card:hover{border-color:var(--border2);}
.notebook-course{font-size:.52rem;font-family:'JetBrains Mono',monospace;letter-spacing:.15em;text-transform:uppercase;margin-bottom:5px;}
.notebook-title{font-size:.86rem;font-weight:400;color:var(--text);margin-bottom:5px;}
.notebook-preview{font-size:.72rem;font-weight:300;color:var(--text3);line-height:1.5;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden;}
.notebook-date{font-size:.56rem;font-family:'JetBrains Mono',monospace;color:var(--text3);margin-top:7px;}
.notebook-detail-overlay{position:fixed;inset:0;background:rgba(0,0,0,.6);backdrop-filter:blur(6px);z-index:200;display:flex;flex-direction:column;}
.notebook-detail-header{display:flex;align-items:center;gap:12px;padding:14px 16px;border-bottom:1px solid var(--border);background:var(--bg2);}
.notebook-detail-body{flex:1;overflow-y:auto;padding:20px 16px;white-space:pre-wrap;font-size:.82rem;font-weight:300;color:var(--text2);line-height:1.8;}
.reading-badge.reading{color:var(--mid);background:rgba(251,146,60,.1);}
.reading-badge.toread{color:var(--text3);background:var(--bg3);}
.reading-badge.done{color:var(--easy);background:rgba(74,222,128,.1);}

/* ── ACTION ROW ──────────────────────────────────────────────────────────── */
.action-row{display:flex;gap:8px;flex-wrap:wrap;margin-bottom:14px;}
.action-btn{display:flex;align-items:center;gap:5px;padding:7px 12px;background:var(--bg2);border:1px solid var(--border);border-radius:10px;cursor:pointer;font-family:'JetBrains Mono',monospace;font-size:.58rem;color:var(--text2);letter-spacing:.08em;transition:all .2s;}
.action-btn:hover{border-color:var(--border2);color:var(--text);}
.action-btn svg{width:13px;height:13px;}
.action-btn.a-accent{color:var(--accent2);border-color:rgba(124,111,247,.25);background:rgba(124,111,247,.06);}
.action-btn.a-accent:hover{background:rgba(124,111,247,.12);}
.action-btn.a-pro{color:#7dd3fc;border-color:rgba(56,189,248,.25);background:rgba(56,189,248,.06);}
.action-btn.a-pro:hover{background:rgba(56,189,248,.12);}
.action-btn.a-uni{color:#f9a8d4;border-color:rgba(244,114,182,.25);background:rgba(244,114,182,.06);}
.action-btn.a-uni:hover{background:rgba(244,114,182,.12);}

/* ── DRAWER ──────────────────────────────────────────────────────────────── */
.drawer-overlay{position:fixed;inset:0;background:rgba(0,0,0,.6);z-index:150;opacity:0;pointer-events:none;transition:opacity .32s;backdrop-filter:blur(4px);}
.drawer-overlay.open{opacity:1;pointer-events:all;}
.drawer{position:fixed;top:0;left:0;bottom:0;width:272px;background:var(--bg2);border-right:1px solid var(--border);z-index:160;transform:translateX(-100%);transition:transform .36s cubic-bezier(.4,0,.2,1);display:flex;flex-direction:column;overflow:hidden;}
.drawer.open{transform:translateX(0);}
.drawer-header{padding:18px 18px 14px;border-bottom:1px solid var(--border);display:flex;align-items:center;gap:10px;}
.drawer-avatar{width:40px;height:40px;border-radius:50%;background:linear-gradient(135deg,var(--accent),var(--diary));display:flex;align-items:center;justify-content:center;font-size:.75rem;font-weight:600;color:#fff;flex-shrink:0;overflow:hidden;}
.drawer-avatar img{width:100%;height:100%;object-fit:cover;border-radius:50%;}
.drawer-user-name{font-size:.84rem;font-weight:500;color:var(--text);}
.drawer-user-email{font-size:.6rem;color:var(--text3);font-family:'JetBrains Mono',monospace;}
.drawer-menu{flex:1;padding:8px 0;overflow-y:auto;}
.drawer-item{display:flex;align-items:center;gap:10px;padding:10px 18px;cursor:pointer;transition:background .18s;color:var(--text2);font-size:.8rem;font-weight:300;border:none;background:none;width:100%;text-align:left;font-family:'Sora',sans-serif;}
.drawer-item:hover{background:rgba(255,255,255,.04);color:var(--text);}
.drawer-item svg{width:15px;height:15px;flex-shrink:0;opacity:.7;}
.drawer-divider{height:1px;background:var(--border);margin:5px 18px;}
.drawer-section-label{font-size:.48rem;letter-spacing:.2em;color:var(--text3);font-family:'JetBrains Mono',monospace;text-transform:uppercase;padding:5px 18px 2px;}
.drawer-item.danger{color:rgba(248,113,113,.65);}
.drawer-item.danger:hover{color:var(--hard);background:rgba(248,113,113,.05);}
.trash-badge{margin-left:auto;font-size:.48rem;font-family:'JetBrains Mono',monospace;background:rgba(248,113,113,.12);color:var(--hard);border-radius:7px;padding:1px 6px;border:1px solid rgba(248,113,113,.2);}
.drawer-footer{padding:12px 18px;border-top:1px solid var(--border);font-size:.5rem;color:var(--text3);font-family:'JetBrains Mono',monospace;}
.lang-btn{padding:3px 8px;border-radius:8px;border:1px solid var(--border);background:none;font-size:.62rem;color:var(--text3);cursor:pointer;transition:all .18s;font-family:'Sora',sans-serif;}
.lang-btn:hover{border-color:var(--border2);color:var(--text2);}
.lang-btn.active{background:rgba(124,111,247,.15);border-color:rgba(124,111,247,.35);color:var(--accent2);}

/* ── MODALS ──────────────────────────────────────────────────────────────── */
.modal-overlay{position:fixed;inset:0;background:rgba(0,0,0,.72);z-index:200;display:flex;align-items:center;justify-content:center;opacity:0;pointer-events:none;transition:opacity .28s;backdrop-filter:blur(8px);}
.modal-overlay.open{opacity:1;pointer-events:all;}
.modal-box{background:var(--bg2);border:1px solid var(--border);border-radius:18px;padding:24px;width:min(360px,90vw);transform:scale(.94) translateY(10px);transition:transform .32s cubic-bezier(.4,0,.2,1);position:relative;max-height:88vh;overflow-y:auto;}
.modal-overlay.open .modal-box{transform:scale(1) translateY(0);}
.modal-close-btn{position:absolute;top:12px;right:12px;background:none;border:none;cursor:pointer;color:var(--text3);width:26px;height:26px;display:flex;align-items:center;justify-content:center;border-radius:50%;transition:background .18s;}
.modal-close-btn:hover{background:rgba(255,255,255,.06);color:var(--text);}
.p-avatar-lg{width:64px;height:64px;border-radius:50%;background:linear-gradient(135deg,var(--accent),var(--diary));display:flex;align-items:center;justify-content:center;font-size:1.1rem;font-weight:600;color:#fff;margin:0 auto 14px;overflow:hidden;cursor:pointer;}
.p-avatar-lg img{width:100%;height:100%;object-fit:cover;border-radius:50%;}
.pf{width:100%;background:var(--bg3);border:1px solid var(--border);border-radius:9px;padding:9px 12px;font-family:'Sora',sans-serif;font-size:.83rem;color:var(--text);outline:none;margin-bottom:9px;transition:border-color .2s;}
.pf:focus{border-color:rgba(124,111,247,.4);}
.plabel{font-size:.54rem;letter-spacing:.15em;color:var(--text3);font-family:'JetBrains Mono',monospace;text-transform:uppercase;margin-bottom:4px;}
.p-save{width:100%;margin-top:2px;padding:9px;background:linear-gradient(135deg,var(--accent),rgba(124,111,247,.8));border:none;border-radius:9px;cursor:pointer;font-family:'Sora',sans-serif;font-size:.78rem;font-weight:500;color:#fff;transition:opacity .2s;}
.p-save:hover{opacity:.9;}
/* ── GENİŞLETİLMİŞ PROFİL ───────────────────────────────────────────────── */
.prof-header{background:linear-gradient(160deg,var(--bg3) 0%,var(--bg2) 100%);padding:28px 20px 16px;text-align:center;position:relative;border-bottom:1px solid var(--border);}
.prof-avatar-wrap{width:72px;height:72px;border-radius:50%;background:linear-gradient(135deg,var(--accent),var(--diary));display:flex;align-items:center;justify-content:center;font-size:1.2rem;font-weight:600;color:#fff;margin:0 auto 10px;overflow:hidden;cursor:pointer;position:relative;box-shadow:0 0 0 3px rgba(124,111,247,.3);}
.prof-avatar-wrap img{width:100%;height:100%;object-fit:cover;border-radius:50%;}
.prof-avatar-edit{position:absolute;bottom:0;right:0;width:22px;height:22px;border-radius:50%;background:var(--bg);border:1px solid var(--border2);display:flex;align-items:center;justify-content:center;font-size:.65rem;}
.prof-header-name{font-size:1rem;font-weight:500;color:var(--text);margin-bottom:4px;}
.prof-header-badge{font-size:.58rem;font-family:'JetBrains Mono',monospace;color:var(--accent2);letter-spacing:.12em;}
.prof-tabs{display:flex;border-bottom:1px solid var(--border);background:var(--bg2);}
.prof-tab{flex:1;padding:9px 0;background:none;border:none;font-family:'Sora',sans-serif;font-size:.7rem;color:var(--text3);cursor:pointer;border-bottom:2px solid transparent;transition:all .2s;}
.prof-tab.active{color:var(--accent2);border-bottom-color:var(--accent);}
.prof-body{padding:16px 18px;overflow-y:auto;max-height:58vh;}
.prof-tab-content{display:none;}
.prof-tab-content.active{display:block;}
.prof-badge-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:7px;margin-bottom:14px;}
.prof-badge-opt{padding:7px 6px;border-radius:10px;border:1px solid var(--border);background:var(--bg3);cursor:pointer;text-align:center;transition:all .2s;}
.prof-badge-opt:hover{border-color:var(--border2);}
.prof-badge-opt.sel{border-color:var(--accent);background:rgba(124,111,247,.12);}
.prof-badge-opt .badge-ico{font-size:1.1rem;display:block;margin-bottom:3px;}
.prof-badge-opt .badge-lbl{font-size:.52rem;font-family:'JetBrains Mono',monospace;color:var(--text3);letter-spacing:.06em;}
.prof-badge-opt.sel .badge-lbl{color:var(--accent2);}
.prof-color-grid{display:grid;grid-template-columns:repeat(6,1fr);gap:8px;margin-bottom:8px;}
.prof-color-opt{aspect-ratio:1;border-radius:50%;cursor:pointer;border:3px solid transparent;transition:all .2s;position:relative;}
.prof-color-opt.sel{border-color:#fff;transform:scale(1.15);}
.prof-color-opt::after{content:'✓';position:absolute;inset:0;display:flex;align-items:center;justify-content:center;font-size:.6rem;color:#fff;opacity:0;}
.prof-color-opt.sel::after{opacity:1;}
.prof-stat-grid{display:grid;grid-template-columns:repeat(2,1fr);gap:8px;margin-bottom:12px;}
.prof-stat-card{background:var(--bg3);border:1px solid var(--border);border-radius:11px;padding:12px;text-align:center;}
.prof-stat-num{font-size:1.4rem;font-family:'JetBrains Mono',monospace;font-weight:500;color:var(--accent2);}
.prof-stat-lbl{font-size:.52rem;font-family:'JetBrains Mono',monospace;color:var(--text3);text-transform:uppercase;letter-spacing:.1em;margin-top:3px;}
.prof-streak-row{background:linear-gradient(135deg,rgba(124,111,247,.15),rgba(244,114,182,.1));border:1px solid rgba(124,111,247,.2);border-radius:12px;padding:14px;display:flex;align-items:center;gap:12px;margin-bottom:14px;}
.prof-streak-num{font-size:2rem;font-family:'JetBrains Mono',monospace;font-weight:500;color:var(--accent2);}
.prof-streak-info-lbl{font-size:.78rem;font-weight:400;color:var(--text);}
.prof-streak-info-sub{font-size:.6rem;font-family:'JetBrains Mono',monospace;color:var(--text3);margin-top:2px;}
.prof-share-btn{width:100%;padding:11px;background:linear-gradient(135deg,var(--accent),var(--diary));border:none;border-radius:11px;cursor:pointer;font-family:'Sora',sans-serif;font-size:.78rem;font-weight:500;color:#fff;display:flex;align-items:center;justify-content:center;gap:8px;transition:opacity .2s;}
.prof-share-btn:hover{opacity:.9;}
.settings-row{display:flex;align-items:center;justify-content:space-between;padding:8px 0;border-bottom:1px solid var(--border);}
.settings-row:last-child{border-bottom:none;}
.settings-row-label{font-size:.78rem;font-weight:300;color:var(--text2);}
.settings-section{margin-bottom:16px;}
.settings-section-title{font-size:.5rem;letter-spacing:.2em;color:var(--text3);font-family:'JetBrains Mono',monospace;text-transform:uppercase;margin-bottom:9px;}
.toggle{width:34px;height:19px;background:var(--bg3);border-radius:10px;position:relative;cursor:pointer;border:1px solid var(--border2);transition:background .28s;flex-shrink:0;}
.toggle.on{background:var(--accent);}
.toggle::after{content:'';width:13px;height:13px;border-radius:50%;background:#fff;position:absolute;top:2px;left:2px;transition:transform .28s;}
.toggle.on::after{transform:translateX(15px);}
select.pf{appearance:none;background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='rgba(240,238,255,0.3)' stroke-width='2'%3E%3Cpolyline points='6 9 12 15 18 9'/%3E%3C/svg%3E");background-repeat:no-repeat;background-position:right 10px center;background-size:13px;padding-right:28px;cursor:pointer;color-scheme:dark;}
select.pf option{background:var(--bg2);color:var(--text);}
.theme-grid{display:grid;grid-template-columns:repeat(6,1fr);gap:7px;margin-top:6px;}
.theme-swatch{width:100%;aspect-ratio:1;border-radius:10px;cursor:pointer;border:2px solid transparent;transition:all .2s;position:relative;overflow:hidden;}
.theme-swatch.active{border-color:var(--accent2);box-shadow:0 0 10px rgba(124,111,247,.35);}
.theme-swatch:hover{transform:scale(1.06);}
.theme-swatch::after{content:attr(data-label);position:absolute;bottom:0;left:0;right:0;font-size:.38rem;font-family:'JetBrains Mono',monospace;text-align:center;padding:2px 0;background:rgba(0,0,0,.5);color:rgba(255,255,255,.7);}

/* ── TRASH ───────────────────────────────────────────────────────────────── */
.trash-item{display:flex;align-items:center;gap:8px;padding:8px 12px;background:var(--bg3);border-radius:9px;margin-bottom:7px;}
.trash-item-text{flex:1;font-size:.8rem;font-weight:300;color:var(--text2);overflow:hidden;text-overflow:ellipsis;white-space:nowrap;}
.trash-restore-btn{background:none;border:1px solid var(--border2);border-radius:6px;padding:2px 8px;font-size:.56rem;font-family:'JetBrains Mono',monospace;color:var(--accent2);cursor:pointer;transition:all .18s;flex-shrink:0;}
.trash-restore-btn:hover{background:rgba(124,111,247,.1);}
.trash-del-btn{background:none;border:none;color:rgba(248,113,113,.45);cursor:pointer;font-size:.85rem;transition:color .18s;padding:2px 5px;flex-shrink:0;}
.trash-del-btn:hover{color:var(--hard);}
.trash-empty-all{width:100%;margin-top:10px;padding:7px;background:none;border:1px solid rgba(248,113,113,.2);border-radius:9px;cursor:pointer;font-family:'JetBrains Mono',monospace;font-size:.58rem;color:rgba(248,113,113,.6);letter-spacing:.1em;text-transform:uppercase;transition:all .18s;}
.trash-empty-all:hover{background:rgba(248,113,113,.06);color:var(--hard);}

/* ── EDITOR ──────────────────────────────────────────────────────────────── */
.editor-overlay{position:fixed;inset:0;background:rgba(0,0,0,.8);z-index:300;display:flex;align-items:flex-end;justify-content:center;opacity:0;pointer-events:none;transition:opacity .28s;backdrop-filter:blur(6px);}
.editor-overlay.open{opacity:1;pointer-events:all;}
.editor-sheet{width:100%;max-width:680px;background:var(--bg2);border-radius:20px 20px 0 0;border:1px solid var(--border);border-bottom:none;max-height:92vh;display:flex;flex-direction:column;overflow:hidden;transform:translateY(100%);transition:transform .38s cubic-bezier(.4,0,.2,1);}
.editor-overlay.open .editor-sheet{transform:translateY(0);}
.editor-handle{width:34px;height:3px;background:var(--border2);border-radius:2px;margin:10px auto 0;flex-shrink:0;}
.editor-header{display:flex;align-items:center;justify-content:space-between;padding:12px 18px 10px;border-bottom:1px solid var(--border);flex-shrink:0;}
.etb{font-size:.52rem;letter-spacing:.18em;font-family:'JetBrains Mono',monospace;text-transform:uppercase;padding:3px 9px;border-radius:7px;font-weight:500;}
.etb.note{background:rgba(96,165,250,.12);color:var(--note2);}
.etb.diary{background:rgba(244,114,182,.12);color:var(--diary2);}
.editor-save-btn{background:none;border:1px solid var(--border2);border-radius:7px;padding:4px 12px;font-family:'Sora',sans-serif;font-size:.72rem;cursor:pointer;transition:all .18s;}
.editor-save-btn.note{color:var(--note2);border-color:rgba(96,165,250,.3);}
.editor-save-btn.note:hover{background:rgba(96,165,250,.1);}
.editor-save-btn.diary{color:var(--diary2);border-color:rgba(244,114,182,.3);}
.editor-save-btn.diary:hover{background:rgba(244,114,182,.08);}
.editor-body{flex:1;overflow-y:auto;padding:14px 18px;}
.editor-title-input{width:100%;background:none;border:none;outline:none;font-family:'Sora',sans-serif;font-size:1.05rem;font-weight:500;color:var(--text);margin-bottom:9px;}
.editor-title-input::placeholder{color:var(--text3);}
.editor-content-input{width:100%;background:none;border:none;outline:none;font-family:'Sora',sans-serif;font-size:.84rem;font-weight:300;color:var(--text2);line-height:1.8;resize:none;min-height:150px;}
.editor-content-input::placeholder{color:var(--text3);}
.mood-row{margin-bottom:10px;}
.mood-label{font-size:.54rem;letter-spacing:.12em;color:var(--text3);font-family:'JetBrains Mono',monospace;text-transform:uppercase;margin-bottom:5px;}
.mood-chips{display:flex;gap:5px;flex-wrap:wrap;}
.mood-chip{font-size:.92rem;padding:3px 7px;border-radius:7px;cursor:pointer;background:none;border:1px solid transparent;transition:all .18s;}
.mood-chip:hover,.mood-chip.sel{background:rgba(255,255,255,.07);border-color:var(--border2);}
.editor-toolbar{display:flex;gap:6px;padding:9px 18px;border-top:1px solid var(--border);flex-shrink:0;background:var(--bg2);flex-wrap:wrap;}
.toolbar-btn{display:flex;align-items:center;gap:4px;background:var(--bg3);border:1px solid var(--border);border-radius:7px;padding:5px 10px;cursor:pointer;font-size:.6rem;color:var(--text2);font-family:'JetBrains Mono',monospace;transition:all .18s;}
.toolbar-btn svg{width:11px;height:11px;}
.toolbar-btn:hover{border-color:var(--border2);color:var(--text);}
.media-preview-area{display:flex;flex-wrap:wrap;gap:7px;padding:0 18px 9px;flex-shrink:0;}
.media-thumb{position:relative;border-radius:7px;overflow:hidden;background:var(--bg3);}
.media-thumb img,.media-thumb video{width:62px;height:62px;object-fit:cover;display:block;}
.media-thumb.audio{width:120px;height:36px;display:flex;align-items:center;padding:0 9px;gap:5px;}
.media-thumb.audio span{font-size:.6rem;color:var(--text2);font-family:'JetBrains Mono',monospace;}
.media-remove{position:absolute;top:2px;right:2px;width:15px;height:15px;background:rgba(0,0,0,.7);border-radius:50%;border:none;cursor:pointer;display:flex;align-items:center;justify-content:center;color:#fff;font-size:.55rem;}
.tag-row{display:flex;align-items:center;gap:6px;flex-wrap:wrap;margin-bottom:10px;}
.tag-input{background:none;border:1px solid var(--border);border-radius:7px;padding:3px 8px;font-family:'JetBrains Mono',monospace;font-size:.6rem;color:var(--text2);outline:none;width:120px;}
.tag-input:focus{border-color:var(--border2);}
.tag-chip{display:inline-flex;align-items:center;gap:3px;padding:2px 7px;border-radius:8px;font-size:.5rem;font-family:'JetBrains Mono',monospace;border:1px solid;cursor:pointer;transition:all .18s;}

/* ── VIEW ────────────────────────────────────────────────────────────────── */
.view-overlay{position:fixed;inset:0;background:rgba(0,0,0,.86);z-index:250;display:flex;align-items:flex-end;justify-content:center;opacity:0;pointer-events:none;transition:opacity .28s;backdrop-filter:blur(8px);}
.view-overlay.open{opacity:1;pointer-events:all;}
.view-sheet{width:100%;max-width:680px;background:var(--bg2);border-radius:20px 20px 0 0;border:1px solid var(--border);border-bottom:none;max-height:88vh;display:flex;flex-direction:column;transform:translateY(100%);transition:transform .38s cubic-bezier(.4,0,.2,1);overflow:hidden;}
.view-overlay.open .view-sheet{transform:translateY(0);}
.view-handle{width:34px;height:3px;background:var(--border2);border-radius:2px;margin:10px auto 0;flex-shrink:0;}
.view-header{display:flex;align-items:center;justify-content:space-between;padding:10px 18px;border-bottom:1px solid var(--border);flex-shrink:0;}
.view-close-btn{background:none;border:none;cursor:pointer;color:var(--text3);width:26px;height:26px;display:flex;align-items:center;justify-content:center;border-radius:50%;transition:background .18s;}
.view-close-btn:hover{background:rgba(255,255,255,.06);color:var(--text);}
.view-body{flex:1;overflow-y:auto;padding:14px 18px 26px;}
.view-title{font-size:1.1rem;font-weight:500;color:var(--text);margin-bottom:6px;line-height:1.4;}
.view-meta{font-family:'JetBrains Mono',monospace;font-size:.54rem;color:var(--text3);margin-bottom:12px;}
.view-text{font-size:.84rem;font-weight:300;color:var(--text2);line-height:1.8;white-space:pre-wrap;}
.view-media-grid{display:flex;flex-wrap:wrap;gap:7px;margin-top:12px;}
.view-media-grid img,.view-media-grid video{width:calc(50% - 4px);border-radius:9px;object-fit:cover;max-height:190px;}
.view-delete-btn{margin-top:16px;background:none;border:1px solid rgba(248,113,113,.18);border-radius:7px;padding:6px 12px;cursor:pointer;font-family:'JetBrains Mono',monospace;font-size:.58rem;color:var(--hard);letter-spacing:.1em;text-transform:uppercase;transition:all .18s;}
.view-delete-btn:hover{background:rgba(248,113,113,.07);border-color:var(--hard);}

/* ── TEMPLATE PICKER ─────────────────────────────────────────────────────── */
.template-overlay{position:fixed;inset:0;background:rgba(0,0,0,.75);z-index:350;display:flex;align-items:flex-end;justify-content:center;opacity:0;pointer-events:none;transition:opacity .28s;backdrop-filter:blur(8px);}
.template-overlay.open{opacity:1;pointer-events:all;}
.template-sheet{width:100%;max-width:680px;background:var(--bg2);border-radius:20px 20px 0 0;border:1px solid var(--border);border-bottom:none;padding-bottom:24px;transform:translateY(100%);transition:transform .36s cubic-bezier(.4,0,.2,1);}
.template-overlay.open .template-sheet{transform:translateY(0);}
.template-handle{width:34px;height:3px;background:var(--border2);border-radius:2px;margin:10px auto 0;}
.template-header{padding:12px 18px 10px;border-bottom:1px solid var(--border);display:flex;align-items:center;justify-content:space-between;}
.template-title-txt{font-size:.58rem;letter-spacing:.2em;color:var(--text3);font-family:'JetBrains Mono',monospace;text-transform:uppercase;}
.template-close{background:none;border:none;cursor:pointer;color:var(--text3);width:24px;height:24px;border-radius:50%;display:flex;align-items:center;justify-content:center;transition:background .18s;}
.template-close:hover{background:rgba(255,255,255,.06);color:var(--text);}
.template-grid{display:grid;grid-template-columns:repeat(2,1fr);gap:8px;padding:12px 18px 0;}
.template-card{background:var(--bg3);border:1px solid var(--border);border-radius:11px;padding:12px;cursor:pointer;transition:all .18s;}
.template-card:hover{border-color:var(--border2);transform:translateY(-2px);}
.template-card-icon{font-size:1.2rem;margin-bottom:6px;}
.template-card-name{font-size:.76rem;font-weight:500;color:var(--text);margin-bottom:2px;}
.template-card-desc{font-size:.62rem;font-weight:300;color:var(--text3);line-height:1.4;}

/* ── CAL DAY MODAL ───────────────────────────────────────────────────────── */
.cdm-box{padding:24px 22px 20px;}
.cdm-date-title{font-size:1rem;font-weight:500;color:var(--text);margin-bottom:16px;letter-spacing:.02em;}
.cdm-priority-row{display:flex;gap:8px;margin-bottom:14px;}
.cdm-priority-opt{display:flex;align-items:center;gap:5px;padding:5px 12px;border-radius:20px;cursor:pointer;font-size:.62rem;font-weight:500;font-family:'JetBrains Mono',monospace;letter-spacing:.08em;border:1px solid;transition:all .2s;text-transform:uppercase;}
.cdm-priority-opt input{display:none;}
.cdm-priority-opt.easy{color:var(--easy);border-color:rgba(74,222,128,.2);}
.cdm-priority-opt.easy:has(input:checked),.cdm-priority-opt.easy:hover{background:rgba(74,222,128,.1);border-color:var(--easy);}
.cdm-priority-opt.mid{color:var(--mid);border-color:rgba(251,146,60,.2);}
.cdm-priority-opt.mid:has(input:checked),.cdm-priority-opt.mid:hover{background:rgba(251,146,60,.1);border-color:var(--mid);}
.cdm-priority-opt.hard{color:var(--hard);border-color:rgba(248,113,113,.2);}
.cdm-priority-opt.hard:has(input:checked),.cdm-priority-opt.hard:hover{background:rgba(248,113,113,.1);border-color:var(--hard);}
.cdm-btn-row{display:flex;gap:8px;margin-top:16px;}
.cdm-btn-secondary{flex:1;padding:10px 8px;background:var(--bg3);border:1px solid var(--border2);border-radius:10px;cursor:pointer;font-family:'Sora',sans-serif;font-size:.72rem;color:var(--text2);display:flex;align-items:center;justify-content:center;gap:5px;transition:all .2s;}
.cdm-btn-secondary:hover{background:rgba(255,255,255,.06);color:var(--text);}
.cdm-btn-primary{flex:1;padding:10px 8px;background:linear-gradient(135deg,var(--accent),rgba(124,111,247,.8));border:none;border-radius:10px;cursor:pointer;font-family:'Sora',sans-serif;font-size:.72rem;color:#fff;display:flex;align-items:center;justify-content:center;gap:5px;transition:opacity .2s;}
.cdm-btn-primary:hover{opacity:.88;}
.cdm-exist-section{border-top:1px solid var(--border);padding-top:12px;margin-top:4px;}
.cdm-exist-label{font-size:.52rem;letter-spacing:.18em;color:var(--text3);font-family:'JetBrains Mono',monospace;text-transform:uppercase;margin-bottom:6px;}
.cdm-exist-item{display:flex;align-items:center;gap:8px;padding:5px 0;}
.cdm-exist-dot{width:6px;height:6px;border-radius:50%;flex-shrink:0;}
.cdm-exist-text{font-size:.78rem;font-weight:300;color:var(--text2);flex:1;}
.cdm-exist-badge{font-size:.48rem;font-family:'JetBrains Mono',monospace;letter-spacing:.1em;text-transform:uppercase;}

/* ── TOAST ───────────────────────────────────────────────────────────────── */
.toast{position:fixed;bottom:calc(var(--nav-h) + 14px);left:50%;transform:translateX(-50%) translateY(10px);background:var(--bg3);border:1px solid var(--border2);border-radius:10px;padding:8px 18px;font-family:'JetBrains Mono',monospace;font-size:.62rem;color:var(--text2);letter-spacing:.1em;z-index:500;opacity:0;transition:all .3s;pointer-events:none;white-space:nowrap;}
.toast.show{opacity:1;transform:translateX(-50%) translateY(0);}
</style>
</head>
<body>
<div id="app">

  <!-- ── HEADER ──────────────────────────────────────────────────── -->
  <header>
    <div class="header-left">
      <button class="ham-btn" id="hamBtn" onclick="toggleDrawer()">
        <div class="ham-line"></div><div class="ham-line"></div><div class="ham-line"></div>
      </button>
    </div>
    <div style="flex:1;text-align:center;">
      <span id="pageTitle" style="font-size:.88rem;font-weight:500;color:var(--text);letter-spacing:.01em;">Capsula</span>
    </div>
    <div class="header-right">
      <button class="avatar-btn" id="avatarBtn" onclick="openProfile()">
        <img id="avatarImg" src="" style="display:none">
        <span class="avatar-initials" id="avatarInitials">KY</span>
      </button>
    </div>
  </header>

  <!-- ── PAGES ───────────────────────────────────────────────────── -->
  <main>

    <!-- HOME -->
    <div class="page active" id="page-home">
      <div class="dash-greeting"><h2 id="dashGreeting">Merhaba!</h2><p id="dashDate"></p></div>
      <div class="dash-grid" id="dashGrid"></div>
      <div class="dash-section"><div class="dash-section-title">Bugünün Görevleri</div><div id="dashTodayList"></div></div>
      <div class="dash-quote" id="dashQuote"></div>
    </div>

    <!-- TODO -->
    <div class="page" id="page-todo">
      <div class="todo-add-card">
        <div class="todo-add-row1">
          <input type="text" id="todoInput" placeholder="Yeni görev..." onkeydown="if(event.key==='Enter')addTodo()">
        </div>
        <div class="todo-add-row2">
          <div class="priority-pills">
            <div class="pp easy sel" data-p="easy" onclick="selectPriority('easy')">Kolay</div>
            <div class="pp mid" data-p="mid" onclick="selectPriority('mid')">Orta</div>
            <div class="pp hard" data-p="hard" onclick="selectPriority('hard')">Zor</div>
          </div>
          <input type="datetime-local" class="date-pick" id="todoDate" title="Tarih ve saat seç">
          <button class="add-todo-btn" onclick="addTodo()">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
          </button>
        </div>
      </div>
      <div id="todo-active-list"></div>
      <div id="todo-completed-section"></div>
    </div>

    <!-- NOTES -->
    <div class="page" id="page-notes">
      <!-- Hızlı Not -->
      <div id="quickNoteBar" style="display:flex;gap:8px;margin-bottom:12px;">
        <input type="text" id="quickNoteInput" placeholder="Hızlı not al..." style="flex:1;background:var(--bg2);border:1px solid var(--border);border-radius:10px;padding:9px 13px;font-family:'Sora',sans-serif;font-size:.82rem;color:var(--text);outline:none;transition:border-color .2s;" onfocus="this.style.borderColor='rgba(124,111,247,.4)'" onblur="this.style.borderColor='var(--border)'" onkeydown="if(event.key==='Enter')saveQuickNote()">
        <button onclick="saveQuickNote()" style="background:linear-gradient(135deg,var(--accent),rgba(124,111,247,.8));border:none;border-radius:10px;padding:9px 14px;cursor:pointer;color:#fff;font-size:.78rem;font-family:'Sora',sans-serif;white-space:nowrap;transition:opacity .2s;">+ Ekle</button>
      </div>
      <div class="notes-grid" id="notes-grid"></div>
      <div class="empty-state" id="notes-empty" style="display:none">Henüz not yok.<br>Sağ alttaki + ile başla.</div>
    </div>

    <!-- DIARY -->
    <div class="page" id="page-diary">
      <div class="diary-timeline" id="diary-list"></div>
      <div class="empty-state" id="diary-empty" style="display:none">Günlüğün boş.<br>Merkezdeki ✦ ile başla.</div>
    </div>

    <!-- SEARCH (tüm modlarda) -->
    <div class="page" id="page-search">
      <div style="display:flex;align-items:center;gap:8px;margin-bottom:12px;">
        <div style="font-size:.52rem;letter-spacing:.2em;color:var(--text3);font-family:'JetBrains Mono',monospace;text-transform:uppercase;">Akıllı Arama</div>
        <span style="font-size:.44rem;font-family:'JetBrains Mono',monospace;background:linear-gradient(135deg,rgba(124,111,247,.15),rgba(168,157,254,.15));color:var(--accent2);padding:2px 7px;border-radius:7px;border:1px solid rgba(124,111,247,.2);letter-spacing:.1em;">AI</span>
      </div>
      <div class="search-bar-wrap">
        <div class="si-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg></div>
        <input type="text" class="search-input" id="searchInput" placeholder="Not, günlük veya görev ara..." oninput="doSearch(this.value)">
        <span class="ai-badge">AI</span>
      </div>
      <div id="search-results"></div>
    </div>

    <!-- CALENDAR (shared) -->
    <div class="page" id="page-calendar">
      <div class="calendar-header">
        <button class="cal-nav-btn" onclick="calNav(-1)"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="15 18 9 12 15 6"/></svg></button>
        <div style="display:flex;align-items:center;gap:8px;">
          <button class="cal-month-label" id="calMonthLabel" onclick="openCalPicker()" style="background:none;border:none;cursor:pointer;color:var(--text);font-size:.88rem;font-weight:500;letter-spacing:.04em;padding:4px 8px;border-radius:8px;transition:background .2s;" onmouseover="this.style.background='var(--bg3)'" onmouseout="this.style.background='none'"></button>
          <button onclick="goToday()" style="background:rgba(124,111,247,.12);border:1px solid rgba(124,111,247,.25);border-radius:8px;padding:3px 10px;cursor:pointer;font-family:'JetBrains Mono',monospace;font-size:.55rem;color:var(--accent2);letter-spacing:.1em;transition:all .2s;" onmouseover="this.style.background='rgba(124,111,247,.2)'" onmouseout="this.style.background='rgba(124,111,247,.12)'">BUGÜN</button>
        </div>
        <div style="display:flex;align-items:center;gap:6px;">
          <button id="calViewMonthBtn" class="cal-view-btn active" onclick="setCalView('month')" title="Ay görünümü">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width:13px;height:13px;"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
          </button>
          <button id="calViewWeekBtn" class="cal-view-btn" onclick="setCalView('week')" title="Hafta görünümü">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width:13px;height:13px;"><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/></svg>
          </button>
          <button class="cal-nav-btn" onclick="calNav(1)"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="9 18 15 12 9 6"/></svg></button>
        </div>
      </div>
      <!-- AY görünümü -->
      <div id="calMonthView">
        <div class="cal-grid-head"><div class="cal-dh">Pt</div><div class="cal-dh">Sa</div><div class="cal-dh">Ça</div><div class="cal-dh">Pe</div><div class="cal-dh">Cu</div><div class="cal-dh">Ct</div><div class="cal-dh">Pz</div></div>
        <div class="cal-grid" id="calGrid"></div>
      </div>
      <!-- HAFTA görünümü -->
      <div id="calWeekView" style="display:none;">
        <div class="cal-week-strip" id="calWeekStrip"></div>
        <div id="calWeekAgenda"></div>
      </div>
      <div id="calQuote"></div>
      <div id="calEvents"></div>
    </div>

    <!-- SLIDES -->
    <div class="page" id="page-slides">
      <div class="slides-header">
        <div class="slides-cats" id="slidesCats"></div>
        <button class="slides-upload-btn" onclick="document.getElementById('slidesFileInput').click()">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width:16px;height:16px;"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
          PDF Yükle
        </button>
        <input type="file" id="slidesFileInput" accept=".pdf" multiple style="display:none" onchange="uploadSlides(event)">
      </div>
      <div class="slides-search-bar">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" style="width:15px;height:15px;flex-shrink:0;color:var(--text3);"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
        <input type="text" id="slidesSearchInput" placeholder="Slayt adı veya kategori ara..." oninput="renderSlides()" style="flex:1;background:none;border:none;outline:none;font-family:'Sora',sans-serif;font-size:.8rem;color:var(--text);">
      </div>
      <div id="slidesGrid" class="slides-grid"></div>
    </div>

    <!-- CHAT -->
    <div class="page" id="page-chat">
      <div class="chat-layout">
        <!-- Sol: Konuşma listesi -->
        <div class="chat-list-panel" id="chatListPanel">
          <div class="chat-list-header">
            <div class="chat-list-title">Sohbet</div>
            <div id="chatUnreadTotal" class="chat-unread-total" style="display:none;"></div>
          </div>
          <div id="chatConvList" class="chat-conv-list">
            <div class="chat-empty-state">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" style="width:36px;height:36px;opacity:.3;margin-bottom:12px;"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
              <div>Henüz sohbet yok</div>
              <div style="font-size:.65rem;margin-top:4px;opacity:.6;">Arkadaşlarına mesaj göndermek için<br>profil sayfalarını aç</div>
            </div>
          </div>
        </div>
        <!-- Sağ: Aktif sohbet -->
        <div class="chat-active-panel" id="chatActivePanel" style="display:none;">
          <div class="chat-active-header" id="chatActiveHeader"></div>
          <div class="chat-messages" id="chatMessages"></div>
          <div class="chat-input-bar">
            <textarea class="chat-input" id="chatInput" placeholder="Mesaj yaz..." rows="1" onkeydown="if(event.key==='Enter'&&!event.shiftKey){event.preventDefault();sendMessage();}"></textarea>
            <button class="chat-send-btn" onclick="sendMessage()">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width:18px;height:18px;"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- POMODORO (Uni + shared) -->
    <div class="page" id="page-pomodoro">
      <div class="pomo-card">
        <div class="pomo-modes">
          <button class="pomo-mode-btn active" id="pomoBtnWork" onclick="setPomoMode('work')">Çalışma · 25dk</button>
          <button class="pomo-mode-btn" id="pomoBtnShort" onclick="setPomoMode('short')">Kısa Mola · 5dk</button>
          <button class="pomo-mode-btn" id="pomoBtnLong" onclick="setPomoMode('long')">Uzun Mola · 15dk</button>
        </div>
        <div class="pomo-ring">
          <svg class="pomo-svg" viewBox="0 0 140 140">
            <circle class="pomo-track" cx="70" cy="70" r="60"/>
            <circle class="pomo-prog work" id="pomoRing" cx="70" cy="70" r="60"/>
          </svg>
          <div class="pomo-time" id="pomoTime">25:00</div>
        </div>
        <div class="pomo-label" id="pomoLabel">Çalışma Seansı</div>
        <div class="pomo-controls">
          <button class="pomo-btn sec" onclick="resetPomo()">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width:16px;height:16px;"><polyline points="1 4 1 10 7 10"/><path d="M3.51 15a9 9 0 1 0 .49-2.84"/></svg>
          </button>
          <button class="pomo-btn main" id="pomoPlayBtn" onclick="togglePomo()">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" id="pomoIcon" style="width:18px;height:18px;"><polygon points="5 3 19 12 5 21 5 3" fill="currentColor"/></svg>
          </button>
          <button class="pomo-btn sec" onclick="skipPomo()">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width:16px;height:16px;"><polyline points="5 4 15 12 5 20 5 4"/><line x1="19" y1="5" x2="19" y2="19"/></svg>
          </button>
        </div>
        <div class="pomo-sessions" id="pomoSessions"></div>
        <div class="pomo-task-lbl" id="pomoTaskLbl">Görev seçmek için aşağıya tıkla</div>
      </div>
      <div class="sec-label">Bugünün Görevleri</div>
      <div id="pomoTodoList"></div>
    </div>

    <!-- KANBAN (Pro) -->
    <div class="page" id="page-kanban">
      <div class="action-row">
        <button class="action-btn a-accent" onclick="openKanbanAdd()">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>Kart Ekle
        </button>
        <button class="action-btn" onclick="syncKanbanFromTodos()">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="1 4 1 10 7 10"/><path d="M3.51 15a9 9 0 1 0 .49-2.84"/></svg>Görevlerden Aktar
        </button>
      </div>
      <div class="kanban-board" id="kanbanBoard"></div>
    </div>

    <!-- WEEKLY (Pro) -->
    <div class="page" id="page-weekly">
      <div id="weeklyContent"></div>
    </div>

    <!-- READING (Uni) -->
    <div class="page" id="page-reading">
      <div class="action-row">
        <button class="action-btn a-uni" onclick="openReadingAdd()">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>Kitap / Makale Ekle
        </button>
      </div>
      <div id="readingList"></div>
    </div>

    <!-- DERS PROGRAMI (Uni) -->
    <div class="page" id="page-schedule">
      <div class="action-row">
        <button class="action-btn a-uni" onclick="openScheduleAdd()">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>Ders Ekle
        </button>
      </div>
      <div class="schedule-days" id="scheduleDays"></div>
    </div>

    <!-- SINAV TAKVİMİ (Uni) -->
    <div class="page" id="page-exams">
      <div class="action-row">
        <button class="action-btn a-uni" onclick="openExamAdd()">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>Sınav / Ödev Ekle
        </button>
      </div>
      <div id="examList"></div>
    </div>

    <!-- NOT DEFTERİ (Uni) -->
    <div class="page" id="page-notebook">
      <div class="action-row">
        <button class="action-btn a-uni" onclick="openNotebookAdd()">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>Ders Notu Ekle
        </button>
      </div>
      <div class="notebook-filter" id="notebookFilter"></div>
      <div id="notebookList"></div>
    </div>

    <!-- PRO QUICK CAPTURE page -->
    <div class="page" id="page-pro">
      <div class="quick-capture">
        <div class="qc-label">Hızlı Not</div>
        <textarea id="qcInput" placeholder="Aklına gelen her şeyi yaz, sonra kategorize et..."></textarea>
        <div class="qc-actions">
          <button class="qc-discard-btn" onclick="document.getElementById('qcInput').value=''">Temizle</button>
          <button class="qc-save-btn" onclick="saveQuickCapture()">Notlara Kaydet →</button>
        </div>
      </div>
      <div class="action-row">
        <button class="action-btn a-pro" onclick="exportData()">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>Tüm Veriyi Dışa Aktar
        </button>
        <button class="action-btn" onclick="requestNotif()">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>Bildirimler
        </button>
      </div>
      <div class="sec-label">Bugünün Görevleri</div>
      <div id="proTodayList"></div>
    </div>

  </main>
</div>

<!-- NAV -->
<div class="nav-wrap"><div class="nav-glass" id="navGlass"></div></div>

<!-- FABs -->
<button class="fab fab-notes" id="fabNotes" onclick="openTemplates()" style="display:none">
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
</button>
<button class="fab fab-diary" id="fabDiary" onclick="openEditor('diary')" style="display:none">
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
</button>

<!-- BİLDİRİM ÇANI KALDIRILDI - drawer'dan erişilir -->


<!-- DRAWER -->
<div class="drawer-overlay" id="drawerOverlay" onclick="toggleDrawer()"></div>
<div class="drawer" id="drawer">
  <div class="drawer-header">
    <div class="drawer-avatar" id="drawerAvatar" onclick="openFromDrawer('profile');toggleDrawer();" style="cursor:pointer;"><img id="drawerAvatarImg" src="" style="display:none"><span id="drawerAvatarInitials">KY</span></div>
    <div style="flex:1;min-width:0;">
      <div class="drawer-user-name" id="drawerUserName">Kullanıcı</div>
      <div class="drawer-user-email" id="drawerUserEmail"></div>
    </div>
    <button onclick="authSignOut()" title="Çıkış Yap" style="background:none;border:none;color:var(--text3);cursor:pointer;padding:6px;border-radius:8px;transition:all .18s;flex-shrink:0;" onmouseover="this.style.color='var(--hard)';this.style.background='rgba(248,113,113,.08)'" onmouseout="this.style.color='var(--text3)';this.style.background='none'">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" style="width:18px;height:18px;"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
    </button>
  </div>
  <!-- Dil seçici -->
  <div style="padding:8px 14px;border-bottom:1px solid var(--border);display:flex;gap:6px;flex-wrap:wrap;">
    <span style="font-size:.48rem;letter-spacing:.15em;color:var(--text3);font-family:'JetBrains Mono',monospace;text-transform:uppercase;display:flex;align-items:center;margin-right:2px;">Dil:</span>
    <button class="lang-btn active" id="langBtn-tr" onclick="setLang('tr')">🇹🇷 TR</button>
    <button class="lang-btn" id="langBtn-en" onclick="setLang('en')">🇬🇧 EN</button>
    <button class="lang-btn" id="langBtn-de" onclick="setLang('de')">🇩🇪 DE</button>
    <button class="lang-btn" id="langBtn-fr" onclick="setLang('fr')">🇫🇷 FR</button>
    <button class="lang-btn" id="langBtn-es" onclick="setLang('es')">🇪🇸 ES</button>
    <button class="lang-btn" id="langBtn-ar" onclick="setLang('ar')">🇸🇦 AR</button>
  </div>
  <div class="drawer-menu">
    <div class="drawer-section-label" id="dl-general">Genel</div>
    <button class="drawer-item" onclick="openFromDrawer('profile')"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg><span id="dl-profile">Profilim</span></button>
    <button class="drawer-item" onclick="openFromDrawer('settings')"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="12" cy="12" r="3"/><path d="M12 1v4M12 19v4M4.22 4.22l2.83 2.83M16.95 16.95l2.83 2.83M1 12h4M19 12h4M4.22 19.78l2.83-2.83M16.95 7.05l2.83-2.83"/></svg><span id="dl-settings">Ayarlar</span></button>
    <button class="drawer-item" onclick="openCalendarFromDrawer()"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg><span id="dl-calendar">Takvim</span></button>
    <button class="drawer-item" onclick="toggleDrawer();switchPage('diary')"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>Günlük</button>
    <button class="drawer-item" onclick="toggleDrawer();switchPage('kanban')"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="3" y="3" width="7" height="18" rx="1"/><rect x="14" y="3" width="7" height="10" rx="1"/><rect x="14" y="17" width="7" height="4" rx="1"/></svg>Kanban</button>
    <button class="drawer-item" onclick="toggleDrawer();switchPage('pomodoro')"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>Pomodoro</button>
    <button class="drawer-item" onclick="toggleDrawer();switchPage('schedule')"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>Ders Programı</button>
    <button class="drawer-item" onclick="toggleDrawer();switchPage('reading')"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>Okuma Listesi</button>
    <button class="drawer-item" onclick="openFromDrawer('trash')"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/></svg><span id="dl-trash">Çöp Kutusu</span><span class="trash-badge" id="trashBadge" style="display:none">0</span></button>
    <button class="drawer-item" onclick="openBackupModal()"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg><span id="dl-backup">Yedekle & Geri Yükle</span></button>
    <button class="drawer-item" onclick="openFriends()"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg><span id="dl-friends">Arkadaşlar</span><span id="friendRequestBadge" style="display:none;margin-left:auto;min-width:18px;height:18px;font-size:.52rem;border-radius:9px;background:var(--accent);color:#fff;align-items:center;justify-content:center;padding:0 4px;font-family:'JetBrains Mono',monospace;"></span></button>
    <button class="drawer-item" id="drawerReminderBtn" onclick="openReminderModal()"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg><span id="dl-reminders">Hatırlatıcılar</span><span id="drawerReminderBadge" style="display:none;margin-left:auto;min-width:18px;height:18px;font-size:.52rem;border-radius:9px;background:var(--hard);color:#fff;align-items:center;justify-content:center;padding:0 4px;font-family:JetBrains Mono,monospace;"></span></button>
    <div class="drawer-divider"></div>
    <div class="drawer-section-label" id="dl-about">Hakkında</div>
    <button class="drawer-item" onclick="openFromDrawer('privacy')"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg><span id="dl-privacy">Gizlilik Politikası</span></button>
    <button class="drawer-item" onclick="openFromDrawer('terms')"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg><span id="dl-terms">Kullanım Koşulları</span></button>
    <button class="drawer-item" onclick="openFromDrawer('help')"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg><span id="dl-help">Yardım</span></button>
    <div class="drawer-divider"></div>
    <button class="drawer-item danger" onclick="clearAllData()"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/></svg><span id="dl-cleardata">Tüm Verileri Sil</span></button>
    <button class="drawer-item" id="signOutBtn" onclick="authSignOut()"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg><span id="dl-signout">Çıkış Yap</span></button>
  </div>
  <div class="drawer-footer">Capsula v4 · Pro / Ana / Öğrenci</div>
</div>

<!-- PROFILE MODAL -->
<div class="modal-overlay" id="profileModal">
  <div class="modal-box" style="padding:0;overflow:hidden;max-height:92vh;">
    <div class="prof-header">
      <button class="modal-close-btn" onclick="closeModal('profileModal')" style="position:absolute;top:12px;right:12px;">✕</button>
      <div class="prof-avatar-wrap" onclick="document.getElementById('avatarUpload').click()">
        <img id="profileAvatarImg" src="" style="display:none"><span id="profileAvatarInitials">KY</span>
        <div class="prof-avatar-edit">📷</div>
      </div>
      <input type="file" id="avatarUpload" accept="image/*" style="display:none" onchange="handleAvatarUpload(event)">
      <div id="removeAvatarWrap" style="display:none;text-align:center;margin-top:-6px;margin-bottom:6px;">
        <button onclick="removeAvatar()" style="background:none;border:none;font-size:.6rem;color:var(--text3);cursor:pointer;font-family:'JetBrains Mono',monospace;text-decoration:underline;text-underline-offset:3px;">Fotoğrafı kaldır</button>
      </div>
      <div id="profHeaderName" class="prof-header-name">Kullanıcı</div>
      <div id="profHeaderBadge" class="prof-header-badge"></div>
    </div>
    <div class="prof-tabs">
      <button class="prof-tab active" onclick="switchProfTab('info',this)">Profil</button>
      <button class="prof-tab" onclick="switchProfTab('stats',this)">İstatistik</button>
    </div>
    <div class="prof-body">
      <!-- INFO -->
      <div id="profTab-info" class="prof-tab-content active">
        <!-- Kullanıcı adı göstergesi -->
        <div id="profUsernameDisplay" style="text-align:center;margin-bottom:14px;">
          <div style="font-size:.72rem;font-family:'JetBrains Mono',monospace;color:var(--accent2);letter-spacing:.08em;" id="profUsernameText"></div>
          <div style="font-size:.58rem;color:var(--text3);margin-top:2px;">Kullanıcı adın arkadaşların seni bulmak için kullanır</div>
        </div>
        <div class="plabel">Kullanıcı Adı</div>
        <div style="display:flex;gap:8px;margin-bottom:9px;">
          <div style="flex:1;background:var(--bg3);border:1px solid var(--border);border-radius:9px;padding:9px 12px;font-family:'JetBrains Mono',monospace;font-size:.82rem;color:var(--text2);display:flex;align-items:center;gap:6px;"><span style="color:var(--text3);">@</span><span id="profUsernameField">—</span></div>
          <button onclick="openChangeUsername()" style="background:rgba(124,111,247,.12);border:1px solid rgba(124,111,247,.25);border-radius:9px;padding:0 12px;font-size:.65rem;color:var(--accent2);cursor:pointer;font-family:'Sora',sans-serif;white-space:nowrap;transition:all .2s;">Değiştir</button>
        </div>
        <div class="plabel">Ad Soyad</div>
        <input type="text" class="pf" id="profileName" placeholder="Adınız Soyadınız">
        <div class="plabel">E-posta <span style="font-size:.5rem;color:var(--text3);">(değiştirilemez)</span></div>
        <input type="text" class="pf" id="profileEmail" placeholder="ornek@eposta.com" readonly style="opacity:.6;cursor:not-allowed;">
        <div class="plabel">Biyografi</div>
        <textarea class="pf" id="profileBio" placeholder="Kendini birkaç cümleyle anlat..." style="min-height:72px;resize:none;line-height:1.6;"></textarea>
        <div class="plabel">Motto</div>
        <input type="text" class="pf" id="profileMotto" placeholder="Seni motive eden bir söz...">
        <div class="plabel">Bu Dönem Hedefim</div>
        <input type="text" class="pf" id="profileGoal" placeholder="Hedefini yaz...">
        <div class="plabel" style="margin-bottom:8px;">Unvan</div>
        <div class="prof-badge-grid" id="profBadgeGrid"></div>
        <button class="p-save" onclick="saveProfile()">Kaydet</button>
      </div>
      <!-- STYLE -->
      <div id="profTab-style" class="prof-tab-content">
        <div class="plabel" style="margin-bottom:10px;">Kişisel Renk</div>
        <div class="prof-color-grid" id="profColorGrid"></div>
        <div class="plabel" style="margin-top:16px;margin-bottom:8px;">Tema</div>
        <div id="themeGridInProfile"></div>
        <button class="p-save" onclick="saveProfile()">Uygula</button>
      </div>
      <!-- STATS -->
      <div id="profTab-stats" class="prof-tab-content">
        <div class="prof-stat-grid" id="profStatGrid"></div>
        <div class="prof-streak-row" id="profStreakRow"></div>
        <button class="prof-share-btn" onclick="generateProfileCard()">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width:15px;height:15px"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/></svg>
          Profil Kartı Oluştur
        </button>
      </div>
    </div>
  </div>
</div>

<!-- PROFİL KARTI OVERLAY -->
<div class="modal-overlay" id="profileCardModal">
  <div class="modal-box" style="padding:20px;text-align:center;">
    <button class="modal-close-btn" onclick="closeModal('profileCardModal')">✕</button>
    <div style="font-size:.68rem;color:var(--text3);font-family:'JetBrains Mono',monospace;margin-bottom:14px;">Ekran görüntüsü alarak paylaş</div>
    <div id="profileCardPreview" style="border-radius:16px;overflow:hidden;margin-bottom:14px;"></div>
    <div style="font-size:.62rem;color:var(--text3);">Kartı basılı tut → Kaydet</div>
  </div>
</div>

<!-- SETTINGS MODAL -->
<div class="modal-overlay" id="settingsModal">
  <div class="modal-box" style="max-height:88vh;overflow-y:auto;">
    <button class="modal-close-btn" onclick="closeModal('settingsModal')">✕</button>
    <div class="plabel" style="margin-bottom:14px">Ayarlar</div>
    <div class="settings-section">
      <div class="settings-section-title">Tema</div>
      <div class="theme-grid">
        <div class="theme-swatch active" data-theme="default" data-label="Varsayılan" style="background:linear-gradient(135deg,#0d0d12,#7c6ff7)" onclick="applyTheme('default',this)"></div>
        <div class="theme-swatch" data-theme="midnight" data-label="Gece" style="background:linear-gradient(135deg,#050508,#818cf8)" onclick="applyTheme('midnight',this)"></div>
        <div class="theme-swatch" data-theme="forest" data-label="Orman" style="background:linear-gradient(135deg,#060e08,#4ade80)" onclick="applyTheme('forest',this)"></div>
        <div class="theme-swatch" data-theme="sunset" data-label="Batım" style="background:linear-gradient(135deg,#12080a,#f472b6)" onclick="applyTheme('sunset',this)"></div>
        <div class="theme-swatch" data-theme="ocean" data-label="Okyanus" style="background:linear-gradient(135deg,#030d14,#38bdf8)" onclick="applyTheme('ocean',this)"></div>
        <div class="theme-swatch" data-theme="sand" data-label="Kum" style="background:linear-gradient(135deg,#0f0d08,#fbbf24)" onclick="applyTheme('sand',this)"></div>
      </div>
    </div>
    <div class="settings-section" style="margin-top:16px;">
      <div class="settings-section-title">Güvenlik</div>
      <div class="settings-row"><span class="settings-row-label">PIN Kilidi</span><div class="toggle" id="pinToggle" onclick="togglePinSetting()"></div></div>
      <div id="pinSetupArea" style="display:none;margin-top:8px;">
        <div class="plabel" style="margin-bottom:4px">Yeni PIN (4 hane)</div>
        <div style="display:flex;gap:7px;align-items:center;">
          <input type="password" id="newPinInput" maxlength="4" inputmode="numeric" class="pf" style="letter-spacing:.3em;font-size:1rem;width:110px;margin-bottom:0;text-align:center;" placeholder="····">
          <button onclick="savePinCode()" style="background:var(--accent);border:none;border-radius:7px;padding:8px 13px;cursor:pointer;font-family:'Sora',sans-serif;font-size:.72rem;color:#fff;">Kaydet</button>
        </div>
      </div>
      <div class="settings-row" style="margin-top:10px;">
        <span class="settings-row-label">Şifre Değiştir</span>
        <button onclick="sendPasswordChangeEmail()" id="changePasswordBtn" style="background:rgba(124,111,247,.12);border:1px solid rgba(124,111,247,.25);border-radius:8px;padding:5px 12px;font-size:.65rem;color:var(--accent2);cursor:pointer;font-family:'Sora',sans-serif;transition:all .2s;">Link Gönder</button>
      </div>
      <div style="font-size:.6rem;color:var(--text3);margin-top:4px;line-height:1.5;">Email adresine şifre değiştirme linki gönderilir.</div>
    </div>
  </div>
</div>

<!-- TRASH MODAL -->
<div class="modal-overlay" id="trashModal">
  <div class="modal-box" style="max-height:82vh;display:flex;flex-direction:column;">
    <button class="modal-close-btn" onclick="closeModal('trashModal')">✕</button>
    <div class="plabel" style="margin-bottom:4px">Çöp Kutusu</div>
    <div style="font-size:.58rem;color:var(--hard);font-family:'JetBrains Mono',monospace;letter-spacing:.07em;margin-bottom:12px;opacity:.8;">⚠ 30 gün sonra kalıcı silinir</div>
    <div id="trashList" style="flex:1;overflow-y:auto;"></div>
    <button class="trash-empty-all" onclick="emptyAllTrash()">Çöpü Tamamen Boşalt</button>
  </div>
</div>

<!-- INFO MODAL -->
<div class="modal-overlay" id="infoModal">
  <div class="modal-box">
    <button class="modal-close-btn" onclick="closeModal('infoModal')">✕</button>
    <div class="plabel" id="infoModalTitle" style="margin-bottom:12px"></div>
    <div id="infoModalBody" style="font-size:.78rem;font-weight:300;color:var(--text2);line-height:1.8;white-space:pre-wrap;"></div>
  </div>
</div>

<!-- CONFIRM MODAL -->
<div class="modal-overlay" id="confirmModal">
  <div class="modal-box" style="text-align:center;padding:26px 22px;">
    <div style="font-size:.86rem;font-weight:300;color:var(--text2);line-height:1.6;margin-bottom:18px;" id="confirmMsg"></div>
    <div style="display:flex;gap:9px;justify-content:center;">
      <button onclick="confirmNo()" style="flex:1;padding:9px;background:var(--bg3);border:1px solid var(--border2);border-radius:9px;cursor:pointer;font-family:'Sora',sans-serif;font-size:.78rem;color:var(--text2);">Vazgeç</button>
      <button onclick="confirmYes()" style="flex:1;padding:9px;background:rgba(248,113,113,.14);border:1px solid rgba(248,113,113,.28);border-radius:9px;cursor:pointer;font-family:'Sora',sans-serif;font-size:.78rem;color:var(--hard);">Sil</button>
    </div>
  </div>
</div>

<!-- CAL PICKER MODAL -->
<div class="modal-overlay" id="calPickerModal">
  <div class="modal-box" style="padding:22px;">
    <button class="modal-close-btn" onclick="closeModal('calPickerModal')">✕</button>
    <div class="plabel" style="margin-bottom:14px">Tarih Seç</div>
    <div style="display:flex;gap:9px;margin-bottom:14px;">
      <div style="flex:1;"><div class="plabel" style="margin-bottom:4px">Ay</div>
        <select id="calPickerMonth" class="pf" style="margin-bottom:0;cursor:pointer;">
          <option value="0">Ocak</option><option value="1">Şubat</option><option value="2">Mart</option><option value="3">Nisan</option><option value="4">Mayıs</option><option value="5">Haziran</option><option value="6">Temmuz</option><option value="7">Ağustos</option><option value="8">Eylül</option><option value="9">Ekim</option><option value="10">Kasım</option><option value="11">Aralık</option>
        </select>
      </div>
      <div style="flex:1;"><div class="plabel" style="margin-bottom:4px">Yıl</div>
        <input type="number" id="calPickerYear" class="pf" style="margin-bottom:0;" min="0" max="2500">
      </div>
    </div>
    <button onclick="applyCalPicker()" class="p-save">Git</button>
  </div>
</div>

<!-- CAL DAY MODAL -->
<div class="modal-overlay" id="calDayModal">
  <div class="modal-box cdm-box">
    <button class="modal-close-btn" onclick="closeModal('calDayModal')">✕</button>
    <div class="cdm-date-title" id="calDayModalTitle"></div>
    <div class="plabel" style="margin-bottom:5px;">Not / Görev</div>
    <textarea id="calDayModalInput" class="cal-plan-textarea" placeholder="Bu gün için bir şeyler yaz..." style="min-height:90px;margin-bottom:10px;"></textarea>
    <div class="plabel" style="margin-bottom:5px;">Öncelik</div>
    <div class="cdm-priority-row">
      <label class="cdm-priority-opt easy"><input type="radio" name="calDayPrio" value="easy" onchange="document.getElementById('calDayPrio').value='easy'"><span>Kolay</span></label>
      <label class="cdm-priority-opt mid"><input type="radio" name="calDayPrio" value="mid" checked onchange="document.getElementById('calDayPrio').value='mid'"><span>Orta</span></label>
      <label class="cdm-priority-opt hard"><input type="radio" name="calDayPrio" value="hard" onchange="document.getElementById('calDayPrio').value='hard'"><span>Zor</span></label>
    </div>
    <input type="hidden" id="calDayPrio" value="mid">
    <div id="calDayModalExisting"></div>
    <div class="cdm-btn-row">
      <button class="cdm-btn-secondary" onclick="saveCalDayEntry(false)">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width:14px;height:14px;"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
        Sadece Takvime
      </button>
      <button class="cdm-btn-primary" onclick="saveCalDayEntry(true)">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width:14px;height:14px;"><polyline points="9 11 12 14 22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></svg>
        Göreve de Ekle
      </button>
    </div>
  </div>
</div>

<!-- PIN DISABLE MODAL -->
<div class="modal-overlay" id="pinDisableModal">
  <div class="modal-box" style="text-align:center;padding:26px 22px;">
    <div id="pinDisableMsg" style="font-size:.8rem;font-weight:300;color:var(--text2);margin-bottom:14px;">Mevcut PIN'ini gir:</div>
    <div style="display:flex;gap:12px;justify-content:center;margin-bottom:18px;" id="pinDisableDots">
      <div class="pin-dot" id="dd0"></div><div class="pin-dot" id="dd1"></div><div class="pin-dot" id="dd2"></div><div class="pin-dot" id="dd3"></div>
    </div>
    <div class="pin-pad" style="max-width:200px;margin:0 auto 12px;">
      <div class="pin-key" onclick="pinDisableKey('1')">1</div><div class="pin-key" onclick="pinDisableKey('2')">2</div><div class="pin-key" onclick="pinDisableKey('3')">3</div>
      <div class="pin-key" onclick="pinDisableKey('4')">4</div><div class="pin-key" onclick="pinDisableKey('5')">5</div><div class="pin-key" onclick="pinDisableKey('6')">6</div>
      <div class="pin-key" onclick="pinDisableKey('7')">7</div><div class="pin-key" onclick="pinDisableKey('8')">8</div><div class="pin-key" onclick="pinDisableKey('9')">9</div>
      <div class="pin-key empty"></div><div class="pin-key" onclick="pinDisableKey('0')">0</div><div class="pin-key del" onclick="pinDisableDel()">⌫</div>
    </div>
    <button onclick="pinDisableCancel()" style="background:none;border:none;cursor:pointer;font-family:'JetBrains Mono',monospace;font-size:.6rem;color:var(--text3);letter-spacing:.1em;">VAZGEÇ</button>
  </div>
</div>

<!-- KANBAN ADD MODAL -->
<div class="modal-overlay" id="kanbanAddModal">
  <div class="modal-box" style="padding:22px;">
    <button class="modal-close-btn" onclick="closeModal('kanbanAddModal')">✕</button>
    <div class="plabel" style="margin-bottom:12px">Yeni Kanban Kartı</div>
    <input type="text" class="pf" id="kanbanAddText" placeholder="Görev veya proje adı...">
    <div class="plabel" style="margin-bottom:5px">Sütun</div>
    <select id="kanbanAddCol" class="pf"><option value="todo">Yapılacak</option><option value="doing">Devam Eden</option><option value="done">Tamamlandı</option></select>
    <div class="plabel" style="margin-bottom:5px;margin-top:2px">Öncelik</div>
    <div style="display:flex;gap:6px;margin-bottom:12px;">
      <div class="pp easy" data-kp="easy" onclick="selKanbanP('easy')">Kolay</div>
      <div class="pp mid sel" data-kp="mid" onclick="selKanbanP('mid')">Orta</div>
      <div class="pp hard" data-kp="hard" onclick="selKanbanP('hard')">Zor</div>
    </div>
    <button class="p-save" onclick="saveKanbanCard()">Ekle</button>
  </div>
</div>

<!-- READING ADD MODAL -->
<div class="modal-overlay" id="readingAddModal">
  <div class="modal-box" style="padding:22px;">
    <button class="modal-close-btn" onclick="closeModal('readingAddModal')">✕</button>
    <div class="plabel" style="margin-bottom:12px">Kitap / Makale Ekle</div>
    <input type="text" class="pf" id="readingTitleInput" placeholder="Başlık...">
    <input type="text" class="pf" id="readingAuthorInput" placeholder="Yazar / Kaynak...">
    <div class="plabel" style="margin-bottom:5px">Durum</div>
    <select id="readingStatusInput" class="pf"><option value="toread">Okunacak</option><option value="reading">Okunuyor</option><option value="done">Tamamlandı</option></select>
    <button class="p-save" onclick="saveReadingItem()" style="margin-top:10px;">Ekle</button>
  </div>
</div>

<!-- DERS EKLE MODAL -->
<div class="modal-overlay" id="scheduleAddModal">
  <div class="modal-box" style="padding:22px;">
    <button class="modal-close-btn" onclick="closeModal('scheduleAddModal')">✕</button>
    <div class="plabel" style="margin-bottom:12px">Ders Ekle</div>
    <input type="text" class="pf" id="scheduleNameInput" placeholder="Ders adı...">
    <input type="text" class="pf" id="scheduleRoomInput" placeholder="Dershane / Link...">
    <div style="display:flex;gap:8px;">
      <div style="flex:1;"><div class="plabel" style="margin-bottom:4px">Başlangıç</div><input type="time" class="pf" id="scheduleStartInput" style="margin-bottom:0;color-scheme:dark;"></div>
      <div style="flex:1;"><div class="plabel" style="margin-bottom:4px">Bitiş</div><input type="time" class="pf" id="scheduleEndInput" style="margin-bottom:0;color-scheme:dark;"></div>
    </div>
    <div class="plabel" style="margin-bottom:6px;margin-top:10px;">Günler</div>
    <div style="display:flex;gap:5px;flex-wrap:wrap;margin-bottom:12px;" id="scheduleDayPicker">
      <label class="sched-day-opt"><input type="checkbox" value="1"><span>Pt</span></label>
      <label class="sched-day-opt"><input type="checkbox" value="2"><span>Sa</span></label>
      <label class="sched-day-opt"><input type="checkbox" value="3"><span>Ça</span></label>
      <label class="sched-day-opt"><input type="checkbox" value="4"><span>Pe</span></label>
      <label class="sched-day-opt"><input type="checkbox" value="5"><span>Cu</span></label>
      <label class="sched-day-opt"><input type="checkbox" value="6"><span>Ct</span></label>
      <label class="sched-day-opt"><input type="checkbox" value="0"><span>Pz</span></label>
    </div>
    <div class="plabel" style="margin-bottom:5px">Renk</div>
    <div style="display:flex;gap:6px;margin-bottom:12px;" id="scheduleColorPicker">
      <div class="color-dot sel" data-color="#7c6ff7" style="background:#7c6ff7" onclick="selectSchedColor(this)"></div>
      <div class="color-dot" data-color="#60a5fa" style="background:#60a5fa" onclick="selectSchedColor(this)"></div>
      <div class="color-dot" data-color="#f472b6" style="background:#f472b6" onclick="selectSchedColor(this)"></div>
      <div class="color-dot" data-color="#4ade80" style="background:#4ade80" onclick="selectSchedColor(this)"></div>
      <div class="color-dot" data-color="#fb923c" style="background:#fb923c" onclick="selectSchedColor(this)"></div>
      <div class="color-dot" data-color="#f87171" style="background:#f87171" onclick="selectSchedColor(this)"></div>
    </div>
    <button class="p-save" onclick="saveScheduleItem()">Ekle</button>
  </div>
</div>

<!-- SINAV EKLE MODAL -->
<div class="modal-overlay" id="examAddModal">
  <div class="modal-box" style="padding:22px;">
    <button class="modal-close-btn" onclick="closeModal('examAddModal')">✕</button>
    <div class="plabel" style="margin-bottom:12px">Sınav / Ödev Ekle</div>
    <input type="text" class="pf" id="examNameInput" placeholder="Ders / Konu adı...">
    <div style="display:flex;gap:8px;">
      <div style="flex:1;"><div class="plabel" style="margin-bottom:4px">Tarih</div><input type="date" class="pf" id="examDateInput" style="margin-bottom:0;color-scheme:dark;"></div>
      <div style="flex:1;"><div class="plabel" style="margin-bottom:4px">Saat</div><input type="time" class="pf" id="examTimeInput" style="margin-bottom:0;color-scheme:dark;"></div>
    </div>
    <div class="plabel" style="margin-bottom:5px;margin-top:10px;">Tür</div>
    <div style="display:flex;gap:6px;margin-bottom:12px;">
      <label class="sched-day-opt exam-type-opt sel" id="examTypeExam"><input type="radio" name="examType" value="exam" checked><span>📝 Sınav</span></label>
      <label class="sched-day-opt exam-type-opt" id="examTypeHw"><input type="radio" name="examType" value="hw"><span>📚 Ödev</span></label>
      <label class="sched-day-opt exam-type-opt" id="examTypeProject"><input type="radio" name="examType" value="project"><span>🔬 Proje</span></label>
    </div>
    <input type="text" class="pf" id="examNoteInput" placeholder="Not (opsiyonel)...">
    <button class="p-save" onclick="saveExamItem()">Ekle</button>
  </div>
</div>

<!-- NOT DEFTERİ EKLE MODAL -->
<div class="modal-overlay" id="notebookAddModal">
  <div class="modal-box" style="padding:22px;">
    <button class="modal-close-btn" onclick="closeModal('notebookAddModal')">✕</button>
    <div class="plabel" style="margin-bottom:12px">Ders Notu Ekle</div>
    <input type="text" class="pf" id="notebookCourseInput" placeholder="Ders adı...">
    <input type="text" class="pf" id="notebookTitleInput" placeholder="Konu başlığı...">
    <textarea class="pf" id="notebookContentInput" placeholder="Notlarını buraya yaz..." style="min-height:100px;resize:none;line-height:1.6;"></textarea>
    <button class="p-save" onclick="saveNotebookItem()">Kaydet</button>
  </div>
</div>

<!-- EDITOR -->
<div class="editor-overlay" id="editorOverlay">
  <div class="editor-sheet">
    <div class="editor-handle"></div>
    <div class="editor-header">
      <span class="etb" id="editorBadge">Not</span>
      <button class="editor-save-btn" id="editorSaveBtn" onclick="saveEntry()">Kaydet</button>
    </div>
    <div class="editor-body">
      <div id="moodRow" style="display:none">
        <div class="mood-row">
          <div class="mood-label">Ruh hali</div>
          <div class="mood-chips">
            <button class="mood-chip sel" data-mood="😊" onclick="selMood(this)">😊</button>
            <button class="mood-chip" data-mood="😔" onclick="selMood(this)">😔</button>
            <button class="mood-chip" data-mood="😤" onclick="selMood(this)">😤</button>
            <button class="mood-chip" data-mood="😌" onclick="selMood(this)">😌</button>
            <button class="mood-chip" data-mood="🤔" onclick="selMood(this)">🤔</button>
            <button class="mood-chip" data-mood="💫" onclick="selMood(this)">💫</button>
            <button class="mood-chip" data-mood="🌧" onclick="selMood(this)">🌧</button>
            <button class="mood-chip" data-mood="🔥" onclick="selMood(this)">🔥</button>
          </div>
        </div>
        <div style="margin-top:9px;padding-top:9px;border-top:1px solid var(--border);margin-bottom:10px;">
          <div class="mood-label" style="margin-bottom:4px;">Tarih</div>
          <input type="date" id="diaryDate" class="date-pick" style="color-scheme:dark;font-size:.63rem;padding:4px 9px;">
        </div>
      </div>
      <div class="tag-row" id="tagRow">
        <span style="font-size:.5rem;letter-spacing:.12em;color:var(--text3);font-family:'JetBrains Mono',monospace;text-transform:uppercase;flex-shrink:0;">Etiket:</span>
        <input type="text" class="tag-input" id="tagInput" placeholder="#iş #okul" onkeydown="if(event.key==='Enter'||event.key===','){event.preventDefault();addTag();}">
        <div id="tagPreview" style="display:flex;gap:4px;flex-wrap:wrap;"></div>
      </div>
      <input type="text" class="editor-title-input" id="editorTitle" placeholder="Başlık...">
      <textarea class="editor-content-input" id="editorContent" placeholder="Yazmaya başla..." oninput="updateWordCount()"></textarea>
      <div id="editorWordCount" style="font-size:.55rem;font-family:'JetBrains Mono',monospace;color:var(--text3);text-align:right;padding:2px 4px 4px;letter-spacing:.06em;">0 kelime · 0 karakter</div>
    </div>
    <div class="media-preview-area" id="mediaPreview"></div>
    <div class="editor-toolbar">
      <label class="toolbar-btn" for="mediaPhoto">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>Fotoğraf
        <input type="file" id="mediaPhoto" accept="image/*" multiple style="display:none" onchange="handleMedia(event,'image')">
      </label>
      <label class="toolbar-btn" for="mediaVideo">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="23 7 16 12 23 17 23 7"/><rect x="1" y="5" width="15" height="14" rx="2"/></svg>Video
        <input type="file" id="mediaVideo" accept="video/*" style="display:none" onchange="handleMedia(event,'video')">
      </label>
      <label class="toolbar-btn" for="mediaAudio">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/><line x1="12" y1="19" x2="12" y2="23"/><line x1="8" y1="23" x2="16" y2="23"/></svg>Ses
        <input type="file" id="mediaAudio" accept="audio/*" style="display:none" onchange="handleMedia(event,'audio')">
      </label>
    </div>
  </div>
</div>

<!-- VIEW -->
<div class="view-overlay" id="viewOverlay">
  <div class="view-sheet">
    <div class="view-handle"></div>
    <div class="view-header">
      <span class="etb" id="viewBadge">Not</span>
      <button class="view-close-btn" onclick="closeView()">✕</button>
    </div>
    <div class="view-body" id="viewBody"></div>
  </div>
</div>

<!-- TEMPLATE PICKER -->
<div class="template-overlay" id="templateOverlay">
  <div class="template-sheet">
    <div class="template-handle"></div>
    <div class="template-header"><span class="template-title-txt">Şablon Seç</span><button class="template-close" onclick="closeTemplates()">✕</button></div>
    <div class="template-grid">
      <div class="template-card" onclick="useTemplate('meeting')"><div class="template-card-icon">📋</div><div class="template-card-name">Toplantı Notu</div><div class="template-card-desc">Tarih, katılımcılar, kararlar</div></div>
      <div class="template-card" onclick="useTemplate('book')"><div class="template-card-icon">📖</div><div class="template-card-name">Kitap Özeti</div><div class="template-card-desc">Ana fikir, alıntılar, öğrendiklerim</div></div>
      <div class="template-card" onclick="useTemplate('daily')"><div class="template-card-icon">🗓</div><div class="template-card-name">Günlük Plan</div><div class="template-card-desc">Sabah, öğle, akşam hedefleri</div></div>
      <div class="template-card" onclick="useTemplate('idea')"><div class="template-card-icon">💡</div><div class="template-card-name">Fikir Notu</div><div class="template-card-desc">Problem, çözüm, adımlar</div></div>
      <div class="template-card" onclick="useTemplate('travel')"><div class="template-card-icon">✈️</div><div class="template-card-name">Seyahat</div><div class="template-card-desc">Yerler, yapılacaklar</div></div>
      <div class="template-card" onclick="useTemplate('goal')"><div class="template-card-icon">🎯</div><div class="template-card-name">Hedef</div><div class="template-card-desc">Hedef, neden, nasıl</div></div>
      <div class="template-card" onclick="useTemplate('lecture')"><div class="template-card-icon">🎓</div><div class="template-card-name">Ders Notu</div><div class="template-card-desc">Konu, formüller, sorular</div></div>
      <div class="template-card" onclick="useTemplate('blank')"><div class="template-card-icon">✦</div><div class="template-card-name">Boş Not</div><div class="template-card-desc">Şablonsuz, özgürce yaz</div></div>
    </div>
  </div>
</div>

<!-- YEDEKLEME MODALI -->
<div class="modal-overlay" id="backupModal">
  <div class="modal-box" style="padding:24px 22px;">
    <button class="modal-close-btn" onclick="closeModal('backupModal')">✕</button>
    <div class="plabel" style="margin-bottom:4px;font-size:.9rem;">Veri Yönetimi</div>
    <div style="font-size:.68rem;color:var(--text3);font-family:'JetBrains Mono',monospace;margin-bottom:18px;">Verilerinizi yedekleyin veya geri yükleyin</div>

    <div class="backup-stat-row" id="backupStats"></div>

    <div class="backup-section-title">Dışa Aktar</div>
    <button class="backup-btn" onclick="exportBackup('json')">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width:16px;height:16px;flex-shrink:0;"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
      <div><div style="font-size:.78rem;font-weight:500;">JSON Yedek İndir</div><div style="font-size:.64rem;color:var(--text3);margin-top:1px;">Tüm veriyi .json dosyası olarak kaydet</div></div>
    </button>
    <button class="backup-btn" onclick="exportBackup('txt')">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width:16px;height:16px;flex-shrink:0;"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>
      <div><div style="font-size:.78rem;font-weight:500;">Okunabilir Metin İndir</div><div style="font-size:.64rem;color:var(--text3);margin-top:1px;">Notlar ve günlükleri .txt olarak aktar</div></div>
    </button>

    <div class="backup-section-title" style="margin-top:14px;">İçe Aktar</div>
    <label class="backup-btn backup-btn-import" id="backupImportLabel">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width:16px;height:16px;flex-shrink:0;"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 5 17 10"/><line x1="12" y1="4" x2="12" y2="15"/></svg>
      <div><div style="font-size:.78rem;font-weight:500;">JSON Yedek Yükle</div><div style="font-size:.64rem;color:var(--text3);margin-top:1px;">Önceki yedeği geri yükle (üzerine yazar)</div></div>
      <input type="file" accept=".json" id="backupFileInput" style="display:none;" onchange="importBackup(this)">
    </label>
    <div id="backupImportResult" style="font-size:.68rem;margin-top:8px;text-align:center;min-height:16px;"></div>

    <div class="backup-section-title" style="margin-top:14px;">Otomatik Yedek</div>
    <div style="display:flex;align-items:center;justify-content:space-between;padding:10px 12px;background:var(--bg3);border-radius:10px;border:1px solid var(--border);">
      <div>
        <div style="font-size:.76rem;font-weight:400;color:var(--text2);">Son yedek</div>
        <div style="font-size:.62rem;font-family:'JetBrains Mono',monospace;color:var(--text3);margin-top:2px;" id="lastBackupTime">—</div>
      </div>
      <button class="backup-auto-btn" onclick="exportBackup('json');updateLastBackupUI()">Şimdi Yedekle</button>
    </div>
  </div>
</div>

<!-- HATIRLATICI MODALI -->
<div class="modal-overlay" id="reminderModal">
  <div class="modal-box" style="padding:24px 22px;">
    <button class="modal-close-btn" onclick="closeModal('reminderModal')">✕</button>
    <div class="plabel" style="margin-bottom:4px;font-size:.9rem;">Hatırlatıcılar</div>
    <div style="font-size:.68rem;color:var(--text3);font-family:'JetBrains Mono',monospace;margin-bottom:16px;">Yaklaşan ve gecikmiş görevler</div>
    <div id="reminderList"></div>
    <div style="margin-top:16px;padding-top:14px;border-top:1px solid var(--border);">
      <div class="backup-section-title">Bildirim İzni</div>
      <div style="display:flex;align-items:center;justify-content:space-between;padding:10px 12px;background:var(--bg3);border-radius:10px;border:1px solid var(--border);">
        <div style="font-size:.74rem;color:var(--text2);" id="notifStatusText">Bildirim durumu kontrol ediliyor...</div>
        <button class="backup-auto-btn" onclick="requestAndSetupNotif()">İzin Ver</button>
      </div>
    </div>
  </div>
</div>

<!-- AUTH SCREEN -->
<div id="authScreen" style="display:none;position:fixed;inset:0;z-index:3000;background:var(--bg);flex-direction:column;align-items:center;justify-content:center;padding:24px;">
  <div style="width:100%;max-width:340px;">
    <div style="text-align:center;margin-bottom:32px;">
      <div style="width:56px;height:56px;border-radius:16px;background:linear-gradient(135deg,var(--accent),var(--diary));display:flex;align-items:center;justify-content:center;margin:0 auto 12px;box-shadow:0 0 28px rgba(124,111,247,.4);">
        <svg viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2" style="width:26px;height:26px;"><rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/><rect x="3" y="14" width="7" height="7" rx="1.5"/><circle cx="17.5" cy="17.5" r="3.5"/></svg>
      </div>
      <div style="font-family:'JetBrains Mono',monospace;font-size:1.4rem;font-weight:500;letter-spacing:.1em;color:var(--text);">CAPSULA</div>
      <div style="font-size:.68rem;color:var(--text3);margin-top:4px;">kişisel alan · her şey burada</div>
    </div>

    <!-- Tab -->
    <div style="display:flex;background:var(--bg2);border:1px solid var(--border);border-radius:12px;padding:3px;margin-bottom:20px;">
      <button id="authTabLogin" onclick="switchAuthTab('login')" style="flex:1;padding:7px;border-radius:9px;border:none;background:var(--accent);color:#fff;font-family:'Sora',sans-serif;font-size:.75rem;font-weight:500;cursor:pointer;transition:all .2s;">Giriş Yap</button>
      <button id="authTabRegister" onclick="switchAuthTab('register')" style="flex:1;padding:7px;border-radius:9px;border:none;background:transparent;color:var(--text3);font-family:'Sora',sans-serif;font-size:.75rem;cursor:pointer;transition:all .2s;">Kayıt Ol</button>
    </div>

    <div id="authError" style="display:none;background:rgba(248,113,113,.1);border:1px solid rgba(248,113,113,.3);border-radius:9px;padding:9px 12px;font-size:.72rem;color:var(--hard);margin-bottom:12px;text-align:center;"></div>

    <input type="text" id="authNameInput" placeholder="Ad Soyad" style="display:none;width:100%;background:var(--bg2);border:1px solid var(--border);border-radius:10px;padding:11px 14px;font-family:'Sora',sans-serif;font-size:.84rem;color:var(--text);outline:none;margin-bottom:10px;transition:border-color .2s;" onfocus="this.style.borderColor='rgba(124,111,247,.4)'" onblur="this.style.borderColor='var(--border)'">
    <input type="text" id="authUsernameInput" placeholder="Kullanıcı adı (herkese görünür)" style="display:none;width:100%;background:var(--bg2);border:1px solid var(--border);border-radius:10px;padding:11px 14px;font-family:'Sora',sans-serif;font-size:.84rem;color:var(--text);outline:none;margin-bottom:10px;transition:border-color .2s;" onfocus="this.style.borderColor='rgba(124,111,247,.4)'" onblur="this.style.borderColor='var(--border)'">
    <input type="email" id="authEmailInput" placeholder="E-posta" style="width:100%;background:var(--bg2);border:1px solid var(--border);border-radius:10px;padding:11px 14px;font-family:'Sora',sans-serif;font-size:.84rem;color:var(--text);outline:none;margin-bottom:10px;transition:border-color .2s;" onfocus="this.style.borderColor='rgba(124,111,247,.4)'" onblur="this.style.borderColor='var(--border)'">
    <input type="password" id="authPasswordInput" placeholder="Şifre" style="width:100%;background:var(--bg2);border:1px solid var(--border);border-radius:10px;padding:11px 14px;font-family:'Sora',sans-serif;font-size:.84rem;color:var(--text);outline:none;margin-bottom:16px;transition:border-color .2s;" onfocus="this.style.borderColor='rgba(124,111,247,.4)'" onblur="this.style.borderColor='var(--border)'" onkeydown="if(event.key==='Enter')authSubmit()">

    <button onclick="authSubmit()" id="authSubmitBtn" style="width:100%;padding:12px;background:linear-gradient(135deg,var(--accent),rgba(124,111,247,.8));border:none;border-radius:10px;cursor:pointer;font-family:'Sora',sans-serif;font-size:.84rem;font-weight:500;color:#fff;margin-bottom:12px;transition:opacity .2s;">Giriş Yap</button>

    <div style="display:flex;align-items:center;gap:10px;margin-bottom:12px;">
      <div style="flex:1;height:1px;background:var(--border);"></div>
      <span style="font-size:.62rem;color:var(--text3);font-family:'JetBrains Mono',monospace;">VEYA</span>
      <div style="flex:1;height:1px;background:var(--border);"></div>
    </div>

    <button onclick="authGoogle()" style="width:100%;padding:11px;background:var(--bg2);border:1px solid var(--border2);border-radius:10px;cursor:pointer;font-family:'Sora',sans-serif;font-size:.82rem;color:var(--text2);display:flex;align-items:center;justify-content:center;gap:10px;transition:all .2s;" onmouseover="this.style.background='var(--bg3)'" onmouseout="this.style.background='var(--bg2)'">
      <svg viewBox="0 0 24 24" style="width:18px;height:18px;"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
      Google ile devam et
    </button>

    <div id="authForgotWrap" style="text-align:center;margin-top:12px;">
      <span onclick="authForgotPassword()" style="font-size:.65rem;color:var(--text3);cursor:pointer;font-family:'JetBrains Mono',monospace;text-decoration:underline;text-underline-offset:3px;">Şifremi unuttum</span>
    </div>
  </div>
</div>

<!-- KULLANICI ADI DEĞİŞTİR MODAL -->
<div class="modal-overlay" id="changeUsernameModal">
  <div class="modal-box" style="padding:22px;">
    <button class="modal-close-btn" onclick="closeModal('changeUsernameModal')">✕</button>
    <div class="plabel" style="font-size:.85rem;margin-bottom:4px;">Kullanıcı Adını Değiştir</div>
    <div style="font-size:.65rem;color:var(--text3);margin-bottom:14px;">Arkadaşların seni bu isimle arar. Sadece harf, rakam ve _ kullanabilirsin.</div>
    <div style="display:flex;align-items:center;background:var(--bg3);border:1px solid var(--border);border-radius:9px;padding:9px 12px;margin-bottom:9px;">
      <span style="color:var(--text3);font-family:'JetBrains Mono',monospace;margin-right:4px;">@</span>
      <input type="text" id="newUsernameInput" placeholder="yeni_kullanici_adi" style="flex:1;background:none;border:none;outline:none;font-family:'JetBrains Mono',monospace;font-size:.84rem;color:var(--text);" oninput="this.value=this.value.toLowerCase().replace(/[^a-z0-9_]/g,'')">
    </div>
    <div id="usernameChangeError" style="display:none;font-size:.68rem;color:var(--hard);margin-bottom:8px;"></div>
    <button class="p-save" onclick="changeUsername()">Kaydet</button>
  </div>
</div>

<!-- ARKADAŞ EKRANI -->
<div class="modal-overlay" id="friendsModal">
  <div class="modal-box" style="padding:0;overflow:hidden;max-height:88vh;">
    <div style="padding:16px 18px;border-bottom:1px solid var(--border);display:flex;align-items:center;gap:10px;">
      <button class="modal-close-btn" onclick="closeModal('friendsModal')" style="position:static;">✕</button>
      <div style="font-size:.88rem;font-weight:500;color:var(--text);">Arkadaşlar</div>
      <div id="friendsOnlineCount" style="margin-left:auto;font-size:.58rem;font-family:'JetBrains Mono',monospace;color:var(--easy);"></div>
    </div>
    <div style="padding:14px 16px;border-bottom:1px solid var(--border);">
      <div style="display:flex;gap:8px;">
        <input type="text" id="friendSearchInput" placeholder="Kullanıcı adı ara..." style="flex:1;background:var(--bg3);border:1px solid var(--border);border-radius:9px;padding:8px 12px;font-family:'Sora',sans-serif;font-size:.78rem;color:var(--text);outline:none;" oninput="searchUsers(this.value)">
        <button onclick="searchUsers(document.getElementById('friendSearchInput').value)" style="background:var(--accent);border:none;border-radius:9px;padding:8px 14px;color:#fff;cursor:pointer;font-size:.75rem;font-family:'Sora',sans-serif;">Ara</button>
      </div>
      <div id="friendSearchResults" style="margin-top:10px;"></div>
    </div>
    <div style="padding:14px 16px;overflow-y:auto;max-height:50vh;">
      <div style="font-size:.5rem;letter-spacing:.2em;color:var(--text3);font-family:'JetBrains Mono',monospace;text-transform:uppercase;margin-bottom:10px;">Arkadaşlarım</div>
      <div id="friendsList"></div>
    </div>
  </div>
</div>

<!-- ARKADAŞ PROFİL MODAL -->
<div class="modal-overlay" id="friendProfileModal">
  <div class="modal-box" style="padding:0;overflow:hidden;">
    <div id="friendProfileContent"></div>
  </div>
</div>

<!-- SPLASH SCREEN -->
<div id="splashScreen">
  <div class="splash-particles" id="splashParticles"></div>
  <div class="splash-glow"></div>
  <div class="splash-logo-wrap">
    <div class="splash-icon">
      <svg viewBox="0 0 24 24"><rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/><rect x="3" y="14" width="7" height="7" rx="1.5"/><circle cx="17.5" cy="17.5" r="3.5"/></svg>
    </div>
    <div class="splash-name">
      <span class="splash-name-text" id="splashText"></span><span class="splash-cursor" id="splashCursor"></span>
    </div>
    <div class="splash-tagline" id="splashTagline">kişisel alan · her şey burada</div>
  </div>
  <div class="splash-bar-wrap" id="splashBarWrap"><div class="splash-bar" id="splashBar"></div></div>
</div>

<!-- TOUR OVERLAY -->
<div id="tourOverlay">
  <div class="tour-backdrop" onclick="endTour()"></div>
  <div class="tour-highlight" id="tourHighlight"></div>
  <div class="tour-tooltip" id="tourTooltip">
    <div class="tour-tooltip-step" id="tourStep"></div>
    <div class="tour-tooltip-title" id="tourTitle"></div>
    <div class="tour-tooltip-desc" id="tourDesc"></div>
    <div class="tour-tooltip-footer">
      <div class="tour-dot-row" id="tourDots"></div>
      <div style="display:flex;gap:7px;">
        <button class="tour-btn tour-btn-skip" onclick="endTour()">Geç</button>
        <button class="tour-btn tour-btn-next" id="tourNextBtn" onclick="tourNext()">İleri →</button>
      </div>
    </div>
  </div>
</div>

<!-- PIN SCREEN -->
<div id="pinScreen" style="display:none;">
  <div class="pin-logo">Capsula</div>
  <div class="pin-title">PIN'ini gir</div>
  <div class="pin-dots" id="pinDots">
    <div class="pin-dot" id="pd0"></div><div class="pin-dot" id="pd1"></div><div class="pin-dot" id="pd2"></div><div class="pin-dot" id="pd3"></div>
  </div>
  <div class="pin-pad">
    <div class="pin-key" onclick="pinKey('1')">1</div><div class="pin-key" onclick="pinKey('2')">2</div><div class="pin-key" onclick="pinKey('3')">3</div>
    <div class="pin-key" onclick="pinKey('4')">4</div><div class="pin-key" onclick="pinKey('5')">5</div><div class="pin-key" onclick="pinKey('6')">6</div>
    <div class="pin-key" onclick="pinKey('7')">7</div><div class="pin-key" onclick="pinKey('8')">8</div><div class="pin-key" onclick="pinKey('9')">9</div>
    <div class="pin-key empty"></div><div class="pin-key" onclick="pinKey('0')">0</div><div class="pin-key del" onclick="pinDel()">⌫</div>
  </div>
  <div class="pin-hint" onclick="pinForgot()">PIN'i unuttum</div>
</div>

<div class="toast" id="toast"></div>

<script data-cfasync="false" src="/cdn-cgi/scripts/5c5dd728/cloudflare-static/email-decode.min.js"></script>
<!-- Firebase SDK -->
<script src="https://www.gstatic.com/firebasejs/10.12.0/firebase-app-compat.js"></script>
<script src="https://www.gstatic.com/firebasejs/10.12.0/firebase-auth-compat.js"></script>
<script src="https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore-compat.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js"></script>
<script>
// ─────────────────────────── FIREBASE ─────────────────────────────────────
const firebaseConfig = {
  apiKey: "AIzaSyDXxiqon0Q-E_AYLxT1Yhz01Kwb7WTuTJw",
  authDomain: "capsula-6b5b8.firebaseapp.com",
  projectId: "capsula-6b5b8",
  storageBucket: "capsula-6b5b8.firebasestorage.app",
  messagingSenderId: "951927360233",
  appId: "1:951927360233:web:b3d8c62eae93c668a0be78"
};

let auth=null, db=null;
try{
  firebase.initializeApp(firebaseConfig);
  auth=firebase.auth();
  db=firebase.firestore();
}catch(e){console.warn('Firebase yüklenemedi:',e);}

let currentUser=null;
let unsubscribeSnapshot=null;

// ── AUTH EKRANI ────────────────────────────────────────────────────────────
function showAuthScreen(){
  const el=document.getElementById('authScreen');
  el.style.display='flex';
}
function hideAuthScreen(){
  const el=document.getElementById('authScreen');
  el.style.display='none';
}

function switchAuthTab(tab){
  const isLogin = tab==='login';
  document.getElementById('authTabLogin').style.background = isLogin?'var(--accent)':'transparent';
  document.getElementById('authTabLogin').style.color = isLogin?'#fff':'var(--text3)';
  document.getElementById('authTabRegister').style.background = !isLogin?'var(--accent)':'transparent';
  document.getElementById('authTabRegister').style.color = !isLogin?'#fff':'var(--text3)';
  document.getElementById('authNameInput').style.display = isLogin?'none':'block';
  document.getElementById('authUsernameInput').style.display = isLogin?'none':'block';
  document.getElementById('authSubmitBtn').textContent = isLogin?'Giriş Yap':'Kayıt Ol';
  document.getElementById('authForgotWrap').style.display = isLogin?'block':'none';
  document.getElementById('authError').style.display='none';
  window._authTab = tab;
}
window._authTab = 'login';

function setAuthError(msg){
  const el=document.getElementById('authError');
  el.textContent=msg;el.style.display='block';
}

function authSubmit(){
  const email=document.getElementById('authEmailInput').value.trim();
  const password=document.getElementById('authPasswordInput').value;
  const btn=document.getElementById('authSubmitBtn');
  if(!email||!password){setAuthError('Email ve şifre gerekli');return;}
  btn.textContent='...';btn.disabled=true;
  if(window._authTab==='login'){
    auth.signInWithEmailAndPassword(email,password)
      .catch(e=>{btn.textContent='Giriş Yap';btn.disabled=false;setAuthError(authErrMsg(e.code));});
  } else {
    const name=document.getElementById('authNameInput').value.trim();
    const username=document.getElementById('authUsernameInput').value.trim().toLowerCase().replace(/[^a-z0-9_]/g,'');
    if(!name){setAuthError('Ad Soyad gerekli');btn.textContent='Kayıt Ol';btn.disabled=false;return;}
    if(username.length<3){setAuthError('Kullanıcı adı en az 3 karakter olmalı');btn.textContent='Kayıt Ol';btn.disabled=false;return;}
    // Kullanıcı adı benzersiz mi?
    db.collection('usernames').doc(username).get().then(doc=>{
      if(doc.exists){setAuthError('Bu kullanıcı adı alınmış');btn.textContent='Kayıt Ol';btn.disabled=false;return;}
      auth.createUserWithEmailAndPassword(email,password).then(cred=>{
        return Promise.all([
          cred.user.updateProfile({displayName:name}),
          db.collection('usernames').doc(username).set({uid:cred.user.uid}),
          db.collection('users').doc(cred.user.uid).set({
            name,username,email,badge:'student',bio:'',motto:'',goal:'',
            accentColor:'purple',createdAt:firebase.firestore.FieldValue.serverTimestamp(),
            friends:[],friendRequests:[]
          })
        ]);
      }).catch(e=>{btn.textContent='Kayıt Ol';btn.disabled=false;setAuthError(authErrMsg(e.code));});
    });
  }
}

function authGoogle(){
  const provider = new firebase.auth.GoogleAuthProvider();
  auth.signInWithPopup(provider).then(cred=>{
    return db.collection('users').doc(cred.user.uid).get().then(doc=>{
      if(!doc.exists){
        // Email'den kullanıcı adı oluştur, benzersiz yap
        let baseUsername = cred.user.email.split('@')[0].toLowerCase().replace(/[^a-z0-9_]/g,'');
        if(baseUsername.length<3) baseUsername='user'+baseUsername;
        // Benzersizlik kontrolü
        return db.collection('usernames').doc(baseUsername).get().then(uDoc=>{
          const finalUsername = uDoc.exists ? baseUsername+'_'+Math.floor(Math.random()*999) : baseUsername;
          return Promise.all([
            db.collection('users').doc(cred.user.uid).set({
              name:cred.user.displayName||'Kullanıcı',
              username:finalUsername,email:cred.user.email,badge:'student',
              bio:'',motto:'',goal:'',accentColor:'purple',
              createdAt:firebase.firestore.FieldValue.serverTimestamp(),
              friends:[],friendRequests:[]
            }),
            db.collection('usernames').doc(finalUsername).set({uid:cred.user.uid})
          ]);
        });
      }
    });
  }).catch(e=>setAuthError(authErrMsg(e.code)));
}

function authForgotPassword(){
  const email=document.getElementById('authEmailInput').value.trim();
  if(!email){setAuthError('Önce email adresini gir');return;}
  const errEl=document.getElementById('authError');
  errEl.style.color='var(--text3)';
  setAuthError('Gönderiliyor...');
  auth.sendPasswordResetEmail(email,{
    url: window.location.href, // Sıfırlamadan sonra geri dönsün
    handleCodeInApp: false
  })
  .then(()=>{
    errEl.style.color='var(--easy)';
    setAuthError('✓ Sıfırlama linki gönderildi! Spam klasörünü de kontrol et.');
  })
  .catch(e=>{
    errEl.style.color='var(--hard)';
    setAuthError(authErrMsg(e.code));
  });
}

// İçerideyken şifre değiştirme
function sendPasswordChangeEmail(){
  if(!currentUser?.email){showToast('Email bulunamadı');return;}
  auth.sendPasswordResetEmail(currentUser.email,{url:window.location.href})
    .then(()=>showToast('Şifre değiştirme linki emailine gönderildi ✓'))
    .catch(e=>showToast('Hata: '+authErrMsg(e.code)));
}

function authSignOut(){
  showConfirm('Çıkış yapmak istediğine emin misin?',()=>{
    if(unsubscribeSnapshot)unsubscribeSnapshot();
    auth.signOut().then(()=>{toggleDrawer();});
  });
}

function authErrMsg(code){
  const msgs={
    'auth/user-not-found':'Bu email ile kayıtlı hesap yok',
    'auth/wrong-password':'Şifre yanlış',
    'auth/email-already-in-use':'Bu email zaten kullanımda',
    'auth/weak-password':'Şifre en az 6 karakter olmalı',
    'auth/invalid-email':'Geçersiz email adresi',
    'auth/too-many-requests':'Çok fazla deneme. Bir süre bekle',
    'auth/popup-closed-by-user':'Giriş iptal edildi',
    'auth/network-request-failed':'Bağlantı hatası',
    'auth/invalid-api-key':'Geçersiz API key — lütfen geliştiriciye bildirin',
    'auth/api-key-not-valid':'API key geçersiz — config hatası',
  };
  return msgs[code]||'Hata kodu: '+code;
}

// ── FIRESTORE SYNC ─────────────────────────────────────────────────────────
function startFirestoreSync(uid){
  if(unsubscribeSnapshot)unsubscribeSnapshot();
  unsubscribeSnapshot = db.collection('userData').doc(uid)
    .onSnapshot(doc=>{
      if(doc.exists){
        const remote = doc.data();
        const savedAvatar=D.profile.avatar; // Avatar'ı koru
        const keys=['todos','completedTodos','trash','contentTrash','calPlans','notes','diary','kanban','reading','schedule','exams','notebook'];
        keys.forEach(k=>{if(remote[k]!==undefined)D[k]=remote[k];});
        D.profile.avatar=savedAvatar; // Avatar'ı geri yükle
        localStorage.setItem('capsula_v4',JSON.stringify(D));
        renderTodos();renderNotes();renderDiary();renderDashboard();
        renderCalendar();renderKanban();renderReading();
        renderSchedule();renderExams();renderNotebook();
        updTrashBadge();updateReminderBadge();
      }
    },err=>console.warn('Firestore sync err:',err));
}

function saveData(){
  localStorage.setItem('capsula_v4',JSON.stringify(D));
  if(!currentUser)return;
  const data={};
  const keys=['todos','completedTodos','trash','contentTrash','calPlans','notes','diary','kanban','reading','schedule','exams','notebook'];
  keys.forEach(k=>data[k]=D[k]||[]);
  data.calPlans=D.calPlans||{};
  data.kanban=D.kanban||{todo:[],doing:[],done:[]};
  data.updatedAt=firebase.firestore.FieldValue.serverTimestamp();
  db.collection('userData').doc(currentUser.uid).set(data,{merge:true}).catch(console.warn);
}

function loadUserData(uid){
  db.collection('userData').doc(uid).get().then(doc=>{
    if(doc.exists){
      const remote=doc.data();
      const keys=['todos','completedTodos','trash','contentTrash','notes','diary','reading','schedule','exams','notebook'];
      keys.forEach(k=>{if(remote[k])D[k]=remote[k];});
      if(remote.calPlans)D.calPlans=remote.calPlans;
      if(remote.kanban)D.kanban=remote.kanban;
      localStorage.setItem('capsula_v4',JSON.stringify(D));
    }
    // Profil bilgisini yükle
    db.collection('users').doc(uid).get().then(udoc=>{
      if(udoc.exists){
        const p=udoc.data();
        D.profile.name=p.name||D.profile.name;
        D.profile.bio=p.bio||'';
        D.profile.motto=p.motto||'';
        D.profile.goal=p.goal||'';
        D.profile.badge=p.badge||'student';
        D.profile.username=p.username||'';
        // Email otomatik Firebase'den al
        D.profile.email=currentUser.email||p.email||'';
        saveData();
        updateProfileUI();
        updateFriendRequestBadge(p.friendRequests||[]);
      }
    });
    startFirestoreSync(uid);
    initApp();
  }).catch(()=>initApp());
}

function saveProfileToFirestore(){
  if(!currentUser)return;
  const p=D.profile;
  db.collection('users').doc(currentUser.uid).update({
    name:p.name,bio:p.bio||'',motto:p.motto||'',goal:p.goal||'',
    badge:p.badge||'student',accentColor:p.accentColor||'purple',
    accentVal:p.accentVal||'',accentVal2:p.accentVal2||''
  }).catch(console.warn);
}

// saveProfile fonksiyonunu güncelle
const _origSaveProfile = window.saveProfile;

// ── ARKADAŞ SİSTEMİ ───────────────────────────────────────────────────────
function openFriends(){
  toggleDrawer();
  renderFriendsList();
  document.getElementById('friendSearchInput').value='';
  document.getElementById('friendSearchResults').innerHTML='';
  openModal('friendsModal');
}

// Avatar HTML yardımcısı — Firestore'dan gelen avatarThumb varsa göster, yoksa baş harfler
function userAvatarHtml(u,size=36){
  const initials=(u.name||'?').slice(0,2).toUpperCase();
  if(u.avatarThumb){
    return`<div style="width:${size}px;height:${size}px;border-radius:50%;overflow:hidden;flex-shrink:0;"><img src="${u.avatarThumb}" style="width:100%;height:100%;object-fit:cover;"></div>`;
  }
  return`<div style="width:${size}px;height:${size}px;border-radius:50%;background:linear-gradient(135deg,var(--accent),var(--diary));display:flex;align-items:center;justify-content:center;font-size:${size*0.28}rem;font-weight:600;color:#fff;flex-shrink:0;">${initials}</div>`;
}

function searchUsers(query){
  const q=query.trim().toLowerCase();
  const res=document.getElementById('friendSearchResults');
  if(q.length<2){res.innerHTML='';return;}
  res.innerHTML='<div style="font-size:.68rem;color:var(--text3);text-align:center;padding:8px;">Aranıyor...</div>';
  if(!currentUser){res.innerHTML='<div style="font-size:.68rem;color:var(--hard);text-align:center;padding:8px;">Giriş yapman gerekiyor</div>';return;}
  // Önce kendi güncel verilerini çek
  db.collection('users').doc(currentUser.uid).get().then(myDoc=>{
    const myData=myDoc.data()||{};
    const myFriends=myData.friends||[];
    const myRequests=(myData.friendRequests||[]).map(r=>r.uid);
    // Sonra arama yap
    return db.collection('users').where('username','>=',q).where('username','<=',q+'\uf8ff').limit(8).get().then(snap=>{
      if(snap.empty){res.innerHTML='<div style="font-size:.68rem;color:var(--text3);text-align:center;padding:8px;">Kullanıcı bulunamadı</div>';return;}
      res.innerHTML=snap.docs.filter(d=>d.id!==currentUser.uid).map(d=>{
        const u=d.data();
        const isFriend=myFriends.includes(d.id);
        const hasPendingRequest=myRequests.includes(d.id);
        const badge=BADGES?.find(b=>b.id===(u.badge||'student'))||{ico:'🎓',lbl:'Öğrenci'};
        let actionBtn='';
        if(isFriend){
          actionBtn=`<span style="font-size:.58rem;font-family:'JetBrains Mono',monospace;color:var(--easy);">Arkadaş ✓</span>`;
        } else if(hasPendingRequest){
          actionBtn=`<span style="font-size:.58rem;font-family:'JetBrains Mono',monospace;color:var(--text3);">İstek gönderildi</span>`;
        } else {
          actionBtn=`<button onclick="sendFriendRequest('${d.id}','${u.username}',this)" style="background:rgba(124,111,247,.15);border:1px solid rgba(124,111,247,.3);border-radius:7px;padding:4px 10px;font-size:.62rem;color:var(--accent2);cursor:pointer;font-family:'Sora',sans-serif;white-space:nowrap;flex-shrink:0;">+ Ekle</button>`;
        }
        return`<div style="display:flex;align-items:center;gap:10px;padding:9px;background:var(--bg3);border-radius:10px;margin-bottom:6px;">
          ${userAvatarHtml(u,36)}
          <div style="flex:1;min-width:0;overflow:hidden;"><div style="font-size:.8rem;font-weight:400;color:var(--text);">@${u.username}</div><div style="font-size:.6rem;color:var(--text3);white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">${badge.ico} ${u.name||''}</div></div>
          ${actionBtn}
        </div>`;
      }).join('');
    });
  }).catch(()=>{res.innerHTML='<div style="font-size:.68rem;color:var(--hard);text-align:center;padding:8px;">Hata oluştu</div>';});
}

function sendFriendRequest(toUid,toUsername,btn){
  if(!currentUser)return;
  btn.textContent='Gönderildi ✓';btn.disabled=true;btn.style.color='var(--easy)';
  db.collection('users').doc(toUid).update({
    friendRequests: firebase.firestore.FieldValue.arrayUnion({
      uid:currentUser.uid,
      name:D.profile.name,
      username:D.profile.username||currentUser.email?.split('@')[0]||'',
      sentAt:new Date().toISOString()
    })
  }).catch(()=>{btn.textContent='+ Ekle';btn.disabled=false;});
}

function renderFriendsList(){
  if(!currentUser){document.getElementById('friendsList').innerHTML='<div style="color:var(--text3);font-size:.72rem;text-align:center;padding:20px;">Giriş yapman gerekiyor</div>';return;}
  db.collection('users').doc(currentUser.uid).get().then(doc=>{
    if(!doc.exists)return;
    const data=doc.data();
    const requests=data.friendRequests||[];
    const friends=data.friends||[];
    let html='';
    // Bekleyen istekler
    if(requests.length){
      html+=`<div style="font-size:.5rem;letter-spacing:.18em;color:var(--mid);font-family:'JetBrains Mono',monospace;text-transform:uppercase;margin-bottom:8px;">Bekleyen İstekler (${requests.length})</div>`;
      requests.forEach(r=>{
        html+=`<div style="display:flex;align-items:center;gap:10px;padding:9px;background:rgba(251,146,60,.06);border:1px solid rgba(251,146,60,.2);border-radius:10px;margin-bottom:6px;">
          ${userAvatarHtml({name:r.name,avatarThumb:r.avatarThumb||''},34)}
          <div style="flex:1;"><div style="font-size:.78rem;color:var(--text);">@${r.username}</div><div style="font-size:.6rem;color:var(--text3);">${r.name}</div></div>
          <button onclick="acceptFriend('${r.uid}','${r.username}','${r.name}',this)" style="background:rgba(74,222,128,.15);border:1px solid rgba(74,222,128,.3);border-radius:7px;padding:4px 9px;font-size:.6rem;color:var(--easy);cursor:pointer;font-family:'Sora',sans-serif;">Kabul</button>
          <button onclick="declineFriend('${r.uid}',this)" style="background:none;border:1px solid var(--border);border-radius:7px;padding:4px 9px;font-size:.6rem;color:var(--text3);cursor:pointer;">Reddet</button>
        </div>`;
      });
    }
    // Arkadaşlar
    if(friends.length){
      html+=`<div style="font-size:.5rem;letter-spacing:.18em;color:var(--text3);font-family:'JetBrains Mono',monospace;text-transform:uppercase;margin:${requests.length?'14px':'0'} 0 8px;">Arkadaşlarım (${friends.length})</div>`;
      // Her arkadaşın profilini çek
      const promises=friends.map(uid=>db.collection('users').doc(uid).get());
      Promise.all(promises).then(docs=>{
        let fhtml='';
        docs.forEach(d=>{
          if(!d.exists)return;
          const u=d.data();
          const badge=BADGES?.find(b=>b.id===(u.badge||'student'))||{ico:'🎓',lbl:'Öğrenci'};
          fhtml+=`<div style="display:flex;align-items:center;gap:10px;padding:9px;background:var(--bg3);border-radius:10px;margin-bottom:6px;cursor:pointer;" onclick="viewFriendProfile('${d.id}')">
            ${userAvatarHtml(u,36)}
            <div style="flex:1;"><div style="font-size:.8rem;color:var(--text);">@${u.username||''}</div><div style="font-size:.6rem;color:var(--text3);">${badge.ico} ${u.name||''}</div></div>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width:14px;height:14px;color:var(--text3);"><polyline points="9 18 15 12 9 6"/></svg>
          </div>`;
        });
        document.getElementById('friendsList').innerHTML=html+fhtml;
      });
    } else {
      document.getElementById('friendsList').innerHTML=html+(html?'':'<div style="color:var(--text3);font-size:.72rem;font-style:italic;text-align:center;padding:16px;">Henüz arkadaş yok.<br>Yukarıdan ara ve ekle!</div>');
    }
  });
}

function acceptFriend(uid,username,name,btn){
  btn.textContent='...';btn.disabled=true;
  const myUid=currentUser.uid;
  Promise.all([
    db.collection('users').doc(myUid).update({
      friends:firebase.firestore.FieldValue.arrayUnion(uid),
      friendRequests:firebase.firestore.FieldValue.arrayRemove({uid,username,name})
    }),
    db.collection('users').doc(uid).update({
      friends:firebase.firestore.FieldValue.arrayUnion(myUid)
    })
  ]).then(()=>{showToast(name+' arkadaş olarak eklendi ✓');renderFriendsList();updateFriendRequestBadge([]);})
  .catch(()=>{btn.textContent='Kabul';btn.disabled=false;});
}

function declineFriend(uid,btn){
  btn.textContent='...';btn.disabled=true;
  db.collection('users').doc(currentUser.uid).get().then(doc=>{
    const reqs=(doc.data()?.friendRequests||[]).filter(r=>r.uid!==uid);
    return db.collection('users').doc(currentUser.uid).update({friendRequests:reqs});
  }).then(()=>renderFriendsList()).catch(()=>{btn.textContent='Reddet';btn.disabled=false;});
}

function viewFriendProfile(uid){
  db.collection('users').doc(uid).get().then(doc=>{
    if(!doc.exists)return;
    const u=doc.data();
    const badge=BADGES?.find(b=>b.id===(u.badge||'student'))||{ico:'🎓',lbl:'Öğrenci'};
    const accent=u.accentVal||'#7c6ff7';
    // Kullanıcı verisini çek
    db.collection('userData').doc(uid).get().then(dDoc=>{
      const data=dDoc.exists?dDoc.data():{};
      const completed=(data.completedTodos||[]).length;
      const notes=(data.notes||[]).length+(data.diary||[]).length;
      const books=(data.reading||[]).filter(r=>r.status==='done').length;
      document.getElementById('friendProfileContent').innerHTML=`
        <div style="background:linear-gradient(160deg,#1c1c28,#0d0d12);padding:28px 20px 20px;text-align:center;border-bottom:1px solid var(--border);">
          <button class="modal-close-btn" onclick="closeModal('friendProfileModal')" style="position:absolute;top:12px;right:12px;">✕</button>
          <div style="margin:0 auto 10px;width:64px;height:64px;box-shadow:0 0 24px ${accent}55;border-radius:50%;overflow:hidden;">
            ${u.avatarThumb
              ?`<img src="${u.avatarThumb}" style="width:100%;height:100%;object-fit:cover;">`
              :`<div style="width:100%;height:100%;background:linear-gradient(135deg,${accent},#f472b6);display:flex;align-items:center;justify-content:center;font-size:1.1rem;font-weight:700;color:#fff;">${(u.name||'?').slice(0,2).toUpperCase()}</div>`
            }
          </div>
          <div style="font-size:1rem;font-weight:500;color:var(--text);">${escHtml(u.name||'')}</div>
          <div style="font-size:.62rem;font-family:'JetBrains Mono',monospace;color:${accent};margin-top:3px;">@${u.username||''}</div>
          <div style="font-size:.68rem;color:var(--accent2);margin-top:4px;">${badge.ico} ${badge.lbl}</div>
        </div>
        <div style="padding:16px 18px;">
          ${u.motto?`<div style="font-size:.74rem;color:var(--text2);font-style:italic;border-left:2px solid ${accent};padding-left:10px;margin-bottom:14px;line-height:1.5;">"${escHtml(u.motto)}"</div>`:''}
          ${u.bio?`<div style="font-size:.74rem;color:var(--text2);line-height:1.6;margin-bottom:14px;">${escHtml(u.bio)}</div>`:''}
          ${u.goal?`<div style="background:var(--bg3);border-radius:10px;padding:10px 12px;margin-bottom:14px;"><div style="font-size:.48rem;letter-spacing:.15em;color:var(--text3);font-family:'JetBrains Mono',monospace;text-transform:uppercase;margin-bottom:4px;">Bu Dönem Hedef</div><div style="font-size:.76rem;color:var(--text2);">${escHtml(u.goal)}</div></div>`:''}
          <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:8px;margin-bottom:14px;">
            <div style="background:var(--bg3);border-radius:10px;padding:10px 6px;text-align:center;"><div style="font-size:1.1rem;font-family:'JetBrains Mono',monospace;font-weight:600;color:${accent};">${completed}</div><div style="font-size:.48rem;color:var(--text3);font-family:'JetBrains Mono',monospace;text-transform:uppercase;letter-spacing:.08em;margin-top:3px;">Tamamlanan</div></div>
            <div style="background:var(--bg3);border-radius:10px;padding:10px 6px;text-align:center;"><div style="font-size:1.1rem;font-family:'JetBrains Mono',monospace;font-weight:600;color:${accent};">${notes}</div><div style="font-size:.48rem;color:var(--text3);font-family:'JetBrains Mono',monospace;text-transform:uppercase;letter-spacing:.08em;margin-top:3px;">Not</div></div>
            <div style="background:var(--bg3);border-radius:10px;padding:10px 6px;text-align:center;"><div style="font-size:1.1rem;font-family:'JetBrains Mono',monospace;font-weight:600;color:${accent};">${books}</div><div style="font-size:.48rem;color:var(--text3);font-family:'JetBrains Mono',monospace;text-transform:uppercase;letter-spacing:.08em;margin-top:3px;">Kitap</div></div>
          </div>
          <button onclick="startChatWith('${uid}')" style="width:100%;margin-top:4px;padding:11px;background:linear-gradient(135deg,var(--accent),rgba(124,111,247,.8));border:none;border-radius:12px;cursor:pointer;font-family:'Sora',sans-serif;font-size:.82rem;font-weight:500;color:#fff;display:flex;align-items:center;justify-content:center;gap:8px;transition:opacity .2s;">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width:16px;height:16px;"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
            Mesaj Gönder
          </button>
        </div>`;
      closeModal('friendsModal');
      openModal('friendProfileModal');
    });
  });
}

function updateFriendRequestBadge(requests){
  const b=document.getElementById('friendRequestBadge');
  if(requests.length>0){b.style.display='flex';b.textContent=requests.length;}
  else b.style.display='none';
}

// ── AUTH STATE ─────────────────────────────────────────────────────────────
if(auth){auth.onAuthStateChanged(user=>{
  currentUser=user;
  if(user){
    document.getElementById('signOutBtn').style.display='flex';
    loadUserData(user.uid);
    db.collection('users').doc(user.uid).onSnapshot(doc=>{
      if(doc.exists)updateFriendRequestBadge(doc.data()?.friendRequests||[]);
    });
  } else {
    document.getElementById('signOutBtn').style.display='none';
    if(unsubscribeSnapshot){unsubscribeSnapshot();unsubscribeSnapshot=null;}
    D={todos:[],completedTodos:[],trash:[],contentTrash:[],calPlans:{},notes:[],diary:[],
       kanban:{todo:[],doing:[],done:[]},reading:[],schedule:[],exams:[],notebook:[],
       profile:{name:'Kullanıcı',email:'',avatar:'',theme:D?.profile?.theme||'default'}};
    showAuthScreen();
    document.getElementById('authEmailInput').value='';
    document.getElementById('authPasswordInput').value='';
    document.getElementById('authError').style.display='none';
    switchAuthTab('login');
  }
});}

function initApp(){
  hideAuthScreen();
  initPinToggle();autoTrash();updTrashBadge();updateProfileUI();initReminders();initLang();
  setMode(curMode);
  renderTodos();renderNotes();renderDiary();renderDashboard();renderCalendar();
  renderKanban();renderReading();renderSchedule();renderExams();renderNotebook();renderPro();
  // Chat konuşma listesini arka planda dinle (badge için)
  if(currentUser)loadConversations();
  if(currentUser)loadUserSlides();
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

// ─────────────────────────── DATA ─────────────────────────────────────────
let D=JSON.parse(localStorage.getItem('capsula_v4')||'null')||{
  todos:[],completedTodos:[],trash:[],contentTrash:[],
  calPlans:{},notes:[],diary:[],
  kanban:{todo:[],doing:[],done:[]},
  reading:[],schedule:[],exams:[],notebook:[],
  profile:{name:'Kullanıcı',email:'ornek@eposta.com',avatar:'',theme:'default'},
};
if(!D.calPlans)D.calPlans={};
if(!D.kanban)D.kanban={todo:[],doing:[],done:[]};
if(!D.reading)D.reading=[];
if(!D.schedule)D.schedule=[];
if(!D.exams)D.exams=[];
if(!D.notebook)D.notebook=[];
if(!D.slides)D.slides=[];
// PDF.js worker
if(typeof pdfjsLib!=='undefined')pdfjsLib.GlobalWorkerOptions.workerSrc='https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
if(!D.contentTrash)D.contentTrash=[];
if(!D.trash)D.trash=[];
function saveData(){localStorage.setItem('capsula_v4',JSON.stringify(D));}

// ─────────────────────────── MODE + NAV ───────────────────────────────────
let curMode='home', curPage='slides', curPriority='easy', kanbanPriority='mid';
let editorType='note', editorMediaFiles=[], editorTags=[], selMoodVal='😊';
let calYear=new Date().getFullYear(), calMonth=new Date().getMonth(), selCalDay=new Date().getDate();
let viewingEntry=null, completedOpen=false, _confirmCb=null;
let pomoMode='work', pomoRunning=false, pomoSecs=25*60, pomoInterval=null, pomoSessions=0, pomoTaskId=null;
const POMO_DUR={work:25*60,short:5*60,long:15*60};

const ICO_SEARCH='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>';
const ICO_CHAT='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>';
const MODES={
  home:[
    {id:'slides',lbl:'Slayt',ico:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="2" y="3" width="20" height="14" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>'},
    {id:'todo',lbl:'Görev',ico:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><polyline points="9 11 12 14 22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></svg>'},
    {id:'chat',lbl:'Sohbet',ico:ICO_CHAT,center:true},
    {id:'notes',lbl:'Not',ico:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>'},
    {id:'search',lbl:'Ara',ico:ICO_SEARCH},
  ],
  pro:[
    {id:'slides',lbl:'Slayt',ico:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="2" y="3" width="20" height="14" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>'},
    {id:'todo',lbl:'Görev',ico:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><polyline points="9 11 12 14 22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></svg>'},
    {id:'chat',lbl:'Sohbet',ico:ICO_CHAT,center:true},
    {id:'notes',lbl:'Not',ico:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>'},
    {id:'search',lbl:'Ara',ico:ICO_SEARCH},
  ],
  uni:[
    {id:'slides',lbl:'Slayt',ico:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="2" y="3" width="20" height="14" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>'},
    {id:'todo',lbl:'Görev',ico:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><polyline points="9 11 12 14 22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></svg>'},
    {id:'chat',lbl:'Sohbet',ico:ICO_CHAT,center:true},
    {id:'notes',lbl:'Not',ico:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>'},
    {id:'search',lbl:'Ara',ico:ICO_SEARCH},
  ],
};
const PAGE_TITLES={home:'Ana Ekran',slides:'Slaytlar',todo:'Görevler',notes:'Notlar',diary:'Günlük',search:'Arama',calendar:'Takvim',pomodoro:'Pomodoro',kanban:'Kanban',weekly:'Haftalık Özet',reading:'Okuma Listesi',pro:'Profesyonel',schedule:'Ders Programı',exams:'Sınav Takvimi',notebook:'Not Defteri',chat:'Sohbet'};

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
  // Sayfa başlığını güncelle
  const titleEl=document.getElementById('pageTitle');
  if(titleEl)titleEl.textContent=PAGE_TITLES[page]||'Capsula';
  document.getElementById('fabNotes').style.display=page==='notes'?'flex':'none';
  document.getElementById('fabDiary').style.display=page==='diary'?'flex':'none';
  if(page==='home')renderDashboard();
  if(page==='todo')renderTodos();
  if(page==='notes')renderNotes();
  if(page==='diary')renderDiary();
  if(page==='calendar')renderCalendar();
  if(page==='pomodoro'){renderPomoTodos();updatePomoDisplay();}
  if(page==='kanban')renderKanban();
  if(page==='weekly')renderWeekly();
  if(page==='reading')renderReading();
  if(page==='schedule')renderSchedule();
  if(page==='exams')renderExams();
  if(page==='notebook')renderNotebook();
  if(page==='chat'){renderChatPage();if(activeChatUid)openChat(activeChatUid);}
  if(page==='slides')renderSlides();
  if(page==='search'){document.getElementById('search-results').innerHTML='';setTimeout(()=>{const inp=document.getElementById('searchInput');if(inp){inp.value='';inp.focus();}},200);}
  if(page==='pro')renderPro();
}

// ─────────────────────────── THEME ────────────────────────────────────────
const THEMES=['default','midnight','forest','sunset','ocean','sand'];
function applyTheme(name,el){
  THEMES.forEach(t=>document.body.classList.remove('theme-'+t));
  if(name!=='default')document.body.classList.add('theme-'+name);
  document.querySelectorAll('.theme-swatch').forEach(s=>s.classList.remove('active'));
  if(el)el.classList.add('active');
  D.profile.theme=name;saveData();
}
function initTheme(){
  const t=D.profile.theme||'default';
  THEMES.forEach(th=>document.body.classList.remove('theme-'+th));
  if(t!=='default')document.body.classList.add('theme-'+t);
  const sw=document.querySelector(`.theme-swatch[data-theme="${t}"]`);
  if(sw){document.querySelectorAll('.theme-swatch').forEach(s=>s.classList.remove('active'));sw.classList.add('active');}
}

// ─────────────────────────── PIN ──────────────────────────────────────────
let pinBuffer='';
function showPinScreen(){const ps=document.getElementById('pinScreen');ps.style.display='flex';pinBuffer='';updatePinDots();}
function hidePinScreen(){const ps=document.getElementById('pinScreen');ps.classList.add('hiding');setTimeout(()=>{ps.style.display='none';ps.classList.remove('hiding');const firstVisit=!localStorage.getItem('capsula_toured');if(firstVisit)setTimeout(showWelcomeCard,400);},420);}
function pinKey(k){if(pinBuffer.length>=4)return;pinBuffer+=k;updatePinDots();if(pinBuffer.length===4){setTimeout(()=>{if(pinBuffer===localStorage.getItem('capsula_pin'))hidePinScreen();else{document.querySelectorAll('#pinDots .pin-dot').forEach(d=>d.classList.add('error'));setTimeout(()=>{document.querySelectorAll('#pinDots .pin-dot').forEach(d=>d.classList.remove('error'));pinBuffer='';updatePinDots();},500);}},80);}}
function pinDel(){if(pinBuffer.length>0){pinBuffer=pinBuffer.slice(0,-1);updatePinDots();}}
function updatePinDots(){for(let i=0;i<4;i++){const d=document.getElementById('pd'+i);if(d){d.classList.toggle('filled',i<pinBuffer.length);d.classList.remove('error');}}}
function pinForgot(){if(confirm('PIN sıfırlanacak?')){localStorage.removeItem('capsula_pin');D.profile.pinEnabled=false;saveData();hidePinScreen();showToast('PIN kaldırıldı');}}
function togglePinSetting(){const tog=document.getElementById('pinToggle');if(tog.classList.contains('on'))showPinDisablePrompt();else{tog.classList.add('on');document.getElementById('pinSetupArea').style.display='block';}}
function showPinDisablePrompt(){window._pinDisableBuf='';for(let i=0;i<4;i++){const d=document.getElementById('dd'+i);if(d)d.classList.remove('filled','error');}openModal('pinDisableModal');}
function pinDisableKey(k){if((window._pinDisableBuf||'').length>=4)return;window._pinDisableBuf=(window._pinDisableBuf||'')+k;for(let i=0;i<4;i++){const d=document.getElementById('dd'+i);if(d)d.classList.toggle('filled',i<window._pinDisableBuf.length);}if(window._pinDisableBuf.length===4){setTimeout(()=>{if(window._pinDisableBuf===localStorage.getItem('capsula_pin')){closeModal('pinDisableModal');removePinCode();document.getElementById('pinToggle').classList.remove('on');document.getElementById('pinSetupArea').style.display='none';showToast('PIN kilidi kaldırıldı');}else{document.querySelectorAll('#pinDisableDots .pin-dot').forEach(d=>d.classList.add('error'));setTimeout(()=>{document.querySelectorAll('#pinDisableDots .pin-dot').forEach(d=>{d.classList.remove('error','filled');});window._pinDisableBuf='';},600);}},80);}}
function pinDisableDel(){const b=window._pinDisableBuf||'';window._pinDisableBuf=b.slice(0,-1);for(let i=0;i<4;i++){const d=document.getElementById('dd'+i);if(d)d.classList.toggle('filled',i<window._pinDisableBuf.length);}}
function pinDisableCancel(){closeModal('pinDisableModal');window._pinDisableBuf='';}
function savePinCode(){const val=document.getElementById('newPinInput').value;if(!/^\d{4}$/.test(val)){showToast('4 haneli rakam gir');return;}localStorage.setItem('capsula_pin',val);D.profile.pinEnabled=true;saveData();document.getElementById('newPinInput').value='';document.getElementById('pinSetupArea').style.display='none';document.getElementById('pinToggle').classList.add('on');showToast('PIN kaydedildi 🔒');}
function removePinCode(){localStorage.removeItem('capsula_pin');D.profile.pinEnabled=false;saveData();}
function initPinToggle(){document.getElementById('pinToggle').classList.toggle('on',!!localStorage.getItem('capsula_pin'));}

// ─────────────────────────── DRAWER / MODALS ──────────────────────────────
function toggleDrawer(){document.getElementById('drawer').classList.toggle('open');document.getElementById('drawerOverlay').classList.toggle('open');document.getElementById('hamBtn').classList.toggle('open');}
function openCalendarFromDrawer(){
  toggleDrawer();
  setTimeout(()=>{
    // Takvim hangi modda yoksa geçici olarak ana moda geç, sayfayı aç
    const modes={home:true,pro:false,uni:false};
    const calInMode=MODES[curMode].some(item=>item.id==='calendar');
    if(!calInMode){setMode('home');}
    switchPage('calendar');
  },300);
}
function openFromDrawer(t){toggleDrawer();setTimeout(()=>{
  if(t==='profile')openProfile();
  else if(t==='settings')openModal('settingsModal');
  else if(t==='trash')openTrash();
  else if(t==='privacy')showInfoModal('Gizlilik Politikası','Tüm verileriniz yalnızca cihazınızda saklanır. Hiçbir veri sunuculara gönderilmez.');
  else if(t==='terms')showInfoModal('Kullanım Koşulları','Bu uygulama kişisel kullanım için tasarlanmıştır. Verilerinizi düzenli yedeklemeniz önerilir.');
  else if(t==='help')showInfoModal('Yardım','Üstte mod değiştirici: Profesyonel / Ana Ekran / Öğrenci.\nHer mod farklı araçlar gösterir.\n\nSilinen içerikler 30 gün çöpte kalır.\nTema değişikliği Ayarlar\'dan yapılır.');
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
function openModal(id){document.getElementById(id).classList.add('open');}
function closeModal(id){document.getElementById(id).classList.remove('open');}
document.querySelectorAll('.modal-overlay').forEach(el=>el.addEventListener('click',e=>{if(e.target===el)el.classList.remove('open');}));
const BADGES=[
  {id:'student',ico:'🎓',lbl:'Öğrenci'},
  {id:'developer',ico:'💻',lbl:'Geliştirici'},
  {id:'creative',ico:'🎨',lbl:'Yaratıcı'},
  {id:'reader',ico:'📚',lbl:'Okuyucu'},
  {id:'athlete',ico:'🏃',lbl:'Sporcu'},
  {id:'scientist',ico:'🔬',lbl:'Bilimci'},
  {id:'musician',ico:'🎵',lbl:'Müzisyen'},
  {id:'writer',ico:'✍️',lbl:'Yazar'},
  {id:'explorer',ico:'🌍',lbl:'Kaşif'},
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

function openProfile(){
  const p=D.profile;
  document.getElementById('profileName').value=p.name||'';
  document.getElementById('profileEmail').value=currentUser?.email||p.email||'';
  document.getElementById('profileBio').value=p.bio||'';
  document.getElementById('profileMotto').value=p.motto||'';
  document.getElementById('profileGoal').value=p.goal||'';
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
  switchProfTab('info',document.querySelector('.prof-tab'));
  openModal('profileModal');
}

function openChangeUsername(){
  document.getElementById('newUsernameInput').value='';
  document.getElementById('usernameChangeError').style.display='none';
  openModal('changeUsernameModal');
}

function changeUsername(){
  const newName=document.getElementById('newUsernameInput').value.trim();
  const errEl=document.getElementById('usernameChangeError');
  errEl.style.display='none';
  if(newName.length<3){errEl.textContent='En az 3 karakter olmalı';errEl.style.display='block';return;}
  if(newName.length>20){errEl.textContent='En fazla 20 karakter olabilir';errEl.style.display='block';return;}
  if(!currentUser){errEl.textContent='Giriş yapman gerekiyor';errEl.style.display='block';return;}
  const oldName=D.profile.username;
  // Kullanıcı adı müsait mi kontrol et
  db.collection('usernames').doc(newName).get().then(doc=>{
    if(doc.exists&&doc.data().uid!==currentUser.uid){
      errEl.textContent='Bu kullanıcı adı alınmış';errEl.style.display='block';return;
    }
    const batch=db.batch();
    // Yeni kullanıcı adını kaydet
    batch.set(db.collection('usernames').doc(newName),{uid:currentUser.uid});
    // Eskisini sil
    if(oldName&&oldName!==newName)batch.delete(db.collection('usernames').doc(oldName));
    // Profili güncelle
    batch.update(db.collection('users').doc(currentUser.uid),{username:newName});
    batch.commit().then(()=>{
      D.profile.username=newName;
      saveData();
      closeModal('changeUsernameModal');
      closeModal('profileModal');
      setTimeout(()=>{openProfile();showToast('Kullanıcı adı güncellendi ✓');},300);
    }).catch(e=>{errEl.textContent='Hata: '+e.message;errEl.style.display='block';});
  }).catch(e=>{errEl.textContent='Bağlantı hatası';errEl.style.display='block';});
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
  // Canlı önizleme
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
    <div class="prof-streak-num">${streak}🔥</div>
    <div><div class="prof-streak-info-lbl">Günlük Seri</div><div class="prof-streak-info-sub">Arka arkaya aktif gün</div></div>
  `;
}

function saveProfile(){
  D.profile.name=document.getElementById('profileName').value.trim()||'Kullanıcı';
  D.profile.email=document.getElementById('profileEmail').value.trim()||'';
  D.profile.bio=document.getElementById('profileBio').value.trim();
  D.profile.motto=document.getElementById('profileMotto').value.trim();
  D.profile.goal=document.getElementById('profileGoal').value.trim();
  saveData();updateProfileUI();closeModal('profileModal');showToast('Profil güncellendi ✦');
}

function updateProfileUI(){
  const p=D.profile;
  const initials=p.name.split(' ').map(w=>w[0]||'').join('').slice(0,2).toUpperCase();
  ['avatarInitials','drawerAvatarInitials','profileAvatarInitials'].forEach(id=>{const el=document.getElementById(id);if(el)el.textContent=initials;});
  document.getElementById('drawerUserName').textContent=p.name;
  // Email Firebase'den göster
  const emailDisplay=currentUser?.email||p.email||'';
  document.getElementById('drawerUserEmail').textContent=emailDisplay?'@'+(p.username||emailDisplay.split('@')[0]):'';
  // Header profil adı ve badge
  const hname=document.getElementById('profHeaderName');if(hname)hname.textContent=p.name;
  const hbadge=document.getElementById('profHeaderBadge');
  if(hbadge){const b=BADGES.find(x=>x.id===(p.badge||'student'));if(b)hbadge.textContent=b.ico+' '+b.lbl;}
  // Accent rengi uygula
  if(p.accentVal){document.documentElement.style.setProperty('--accent',p.accentVal);document.documentElement.style.setProperty('--accent2',p.accentVal2||p.accentVal);}
  if(p.avatar){
    ['avatarImg','drawerAvatarImg','profileAvatarImg'].forEach(id=>{const el=document.getElementById(id);if(el){el.src=p.avatar;el.style.display='block';}});
    ['avatarInitials','drawerAvatarInitials'].forEach(id=>{const el=document.getElementById(id);if(el)el.style.display='none';});
  }
}

function handleAvatarUpload(e){
  const file=e.target.files[0];if(!file)return;
  if(file.size>5*1024*1024){showToast("Fotoğraf 5MB'dan küçük olmalı");return;}
  const r=new FileReader();
  r.onload=ev=>{
    // Küçük thumbnail oluştur (80x80) — Firestore'a kaydedilecek
    const img2=new Image();
    img2.onload=()=>{
      const canvas=document.createElement('canvas');
      canvas.width=80;canvas.height=80;
      const ctx=canvas.getContext('2d');
      // Kare kırp
      const size=Math.min(img2.width,img2.height);
      const sx=(img2.width-size)/2,sy=(img2.height-size)/2;
      ctx.drawImage(img2,sx,sy,size,size,0,0,80,80);
      const thumb=canvas.toDataURL('image/jpeg',0.7);
      D.profile.avatar=thumb;
      localStorage.setItem('capsula_v4',JSON.stringify(D));
      updateProfileUI();
      const imgEl=document.getElementById('profileAvatarImg');
      imgEl.src=thumb;imgEl.style.display='block';
      document.getElementById('profileAvatarInitials').style.display='none';
      const rw=document.getElementById('removeAvatarWrap');if(rw)rw.style.display='block';
      // Firestore'daki users koleksiyonuna da kaydet (arkadaşlar görebilsin)
      if(currentUser){
        db.collection('users').doc(currentUser.uid).update({avatarThumb:thumb}).catch(console.warn);
      }
      showToast('Fotoğraf güncellendi ✓');
    };
    img2.src=ev.target.result;
  };
  r.readAsDataURL(file);
}

function removeAvatar(){
  D.profile.avatar='';
  localStorage.setItem('capsula_v4',JSON.stringify(D));
  updateProfileUI();
  const img=document.getElementById('profileAvatarImg');
  img.src='';img.style.display='none';
  document.getElementById('profileAvatarInitials').style.display='';
  const rw=document.getElementById('removeAvatarWrap');if(rw)rw.style.display='none';
  if(currentUser){
    db.collection('users').doc(currentUser.uid).update({avatarThumb:''}).catch(console.warn);
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
    ${p.goal?`<div style="background:rgba(255,255,255,.04);border-radius:10px;padding:10px 12px;margin-bottom:16px;"><div style="font-size:.48rem;letter-spacing:.18em;color:rgba(240,238,255,.3);font-family:'JetBrains Mono',monospace;text-transform:uppercase;margin-bottom:4px;">Bu Dönem Hedefim</div><div style="font-size:.76rem;color:rgba(240,238,255,.75);">${escHtml(p.goal)}</div></div>`:''}
    <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:8px;margin-bottom:16px;">
      <div style="text-align:center;background:rgba(255,255,255,.04);border-radius:10px;padding:10px 6px;">
        <div style="font-size:1.1rem;font-family:'JetBrains Mono',monospace;font-weight:600;color:${accent2};">${D.completedTodos.length}</div>
        <div style="font-size:.48rem;color:rgba(240,238,255,.3);font-family:'JetBrains Mono',monospace;text-transform:uppercase;letter-spacing:.1em;margin-top:3px;">Tamamlanan</div>
      </div>
      <div style="text-align:center;background:rgba(255,255,255,.04);border-radius:10px;padding:10px 6px;">
        <div style="font-size:1.1rem;font-family:'JetBrains Mono',monospace;font-weight:600;color:${accent2};">${streak}🔥</div>
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
// (handleAvatarUpload yukarıda tanımlı)
function showConfirm(msg,onYes){_confirmCb=onYes;document.getElementById('confirmMsg').textContent=msg;openModal('confirmModal');}
function confirmYes(){closeModal('confirmModal');if(_confirmCb){_confirmCb();_confirmCb=null;}}
function confirmNo(){closeModal('confirmModal');_confirmCb=null;}

// ─────────────────────────── TRASH ────────────────────────────────────────
function daysLeft(iso){if(!iso)return 30;return Math.max(0,30-Math.floor((Date.now()-new Date(iso).getTime())/86400000));}
function daysLeftLabel(d){if(d<=0)return'<span style="color:var(--hard);font-weight:500">Bugün silinecek!</span>';if(d<=7)return`<span style="color:var(--mid)">${d} gün kaldı</span>`;return`<span style="color:var(--text3)">${d} gün kaldı</span>`;}
function openTrash(){renderTrashList();openModal('trashModal');}
function renderTrashList(){
  const list=document.getElementById('trashList');
  const items=[];
  (D.contentTrash||[]).forEach((e,i)=>items.push({kind:'content',idx:i,label:e._trashType==='note'?'NOT':'GÜNLÜK',title:e.title||'Başlıksız',trashedAt:e._trashedAt,accent:e._trashType==='note'?'var(--note)':'var(--diary)'}));
  const tc={easy:'var(--easy)',mid:'var(--mid)',hard:'var(--hard)'};
  (D.trash||[]).forEach((t,i)=>items.push({kind:'todo',idx:i,label:'GÖREV',title:t.text,trashedAt:t.trashedAt,accent:tc[t.priority]||'var(--text3)'}));
  if(!items.length){list.innerHTML='<div class="empty-state" style="padding:18px">Çöp kutusu boş 🗑</div>';return;}
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

// ─────────────────────────── TODO ─────────────────────────────────────────
function selectPriority(p){curPriority=p;document.querySelectorAll('.pp').forEach(el=>el.classList.toggle('sel',el.dataset.p===p));}
function addTodo(){const inp=document.getElementById('todoInput');const text=inp.value.trim();if(!text)return;const rawDue=document.getElementById('todoDate').value;let dueDate=null,dueTime=null;if(rawDue){const[d,t]=rawDue.split('T');dueDate=d;dueTime=t?t.slice(0,5):null;}D.todos.push({id:Date.now(),text,priority:curPriority,dueDate:dueDate||null,dueTime:dueTime||null,createdAt:new Date().toISOString()});inp.value='';document.getElementById('todoDate').value='';saveData();renderTodos();updateReminderBadge();showToast('Görev eklendi');}
function completeTodo(id){const idx=D.todos.findIndex(t=>t.id===id);if(idx===-1)return;const el=document.getElementById('todo-'+id);if(el)el.classList.add('completing');setTimeout(()=>{const t=D.todos.splice(idx,1)[0];t.completedAt=new Date().toISOString();D.completedTodos.unshift(t);saveData();renderTodos();showToast('Tamamlandı ✓');},360);}
function uncompleteTodo(id){const idx=D.completedTodos.findIndex(t=>t.id===id);if(idx===-1)return;const t=D.completedTodos.splice(idx,1)[0];delete t.completedAt;D.todos.push(t);saveData();renderTodos();}
function moveTodoToTrash(id){const idx=D.completedTodos.findIndex(t=>t.id===id);if(idx===-1)return;const t=D.completedTodos.splice(idx,1)[0];t.trashedAt=new Date().toISOString();D.trash.push(t);saveData();updTrashBadge();renderTodos();showToast('Çöpe taşındı');}
function getDueClass(dd){if(!dd)return'';const diff=Math.ceil((new Date(dd)-new Date())/86400000);if(diff<0)return'overdue';if(diff===0)return'today';if(diff<=3)return'soon';return'';}
function getDueLabel(dd){if(!dd)return'';const diff=Math.ceil((new Date(dd)-new Date())/86400000);if(diff<0)return Math.abs(diff)+'g gecikti';if(diff===0)return'Bugün';if(diff===1)return'Yarın';return fmtDate(dd);}
function todoItemHtml(t,labels,dl,dc){const timeStr=t.dueTime?`<span class="due-tag" style="color:var(--text3);">⏰ ${t.dueTime}</span>`:'';return`<div class="todo-item ${t.priority}" id="todo-${t.id}"><div class="todo-check" onclick="completeTodo(${t.id})"></div><div class="todo-body"><div class="todo-text">${escHtml(t.text)}</div><div class="todo-meta"><span class="todo-badge">${labels[t.priority]}</span>${dl?`<span class="due-tag ${dc}">${dl}</span>`:''}${timeStr}</div></div><div class="todo-dot"></div></div>`;}
function renderTodos(){
  const labels={hard:'Zor',mid:'Orta',easy:'Kolay'};
  const today=new Date();today.setHours(0,0,0,0);
  const todayKey=today.toISOString().split('T')[0];
  const noDue=D.todos.filter(t=>!t.dueDate);
  const dated=D.todos.filter(t=>t.dueDate).sort((a,b)=>a.dueDate.localeCompare(b.dueDate));
  let html='';
  const overdue=dated.filter(t=>new Date(t.dueDate)<today);
  if(overdue.length){html+=`<div class="todo-group"><div class="todo-group-label" style="color:var(--hard)">⚠ Gecikmiş</div>`;overdue.forEach(t=>html+=todoItemHtml(t,labels,getDueLabel(t.dueDate),'overdue'));html+='</div>';}
  const todayTodos=dated.filter(t=>t.dueDate===todayKey);
  if(todayTodos.length){html+=`<div class="todo-group"><div class="todo-group-label" style="color:var(--easy)">Bugün</div>`;todayTodos.forEach(t=>html+=todoItemHtml(t,labels,'Bugün','today'));html+='</div>';}
  const future=dated.filter(t=>new Date(t.dueDate)>today&&t.dueDate!==todayKey);
  if(future.length){const mg={};future.forEach(t=>{const[y,m]=t.dueDate.split('-');const k=`${y}-${m}`;if(!mg[k])mg[k]=[];mg[k].push(t);});const mn=['','Ocak','Şubat','Mart','Nisan','Mayıs','Haziran','Temmuz','Ağustos','Eylül','Ekim','Kasım','Aralık'];Object.keys(mg).sort().forEach(k=>{const[y,m]=k.split('-');html+=`<div class="todo-group"><div class="todo-group-label">${mn[+m]} ${y}</div>`;mg[k].forEach(t=>html+=todoItemHtml(t,labels,getDueLabel(t.dueDate),getDueClass(t.dueDate)));html+='</div>';});}
  if(noDue.length){html+=`<div class="todo-group"><div class="todo-group-label">Tarihi Yok</div>`;noDue.forEach(t=>html+=todoItemHtml(t,labels,'',''));html+='</div>';}
  if(!D.todos.length)html='<div class="empty-state">Aktif görev yok 🎉</div>';
  document.getElementById('todo-active-list').innerHTML=html;
  let ch='';
  if(D.completedTodos.length){ch=`<button class="completed-toggle ${completedOpen?'open':''}" onclick="toggleCompleted()"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="9 18 15 12 9 6"/></svg>Tamamlananlar<span class="completed-badge">${D.completedTodos.length}</span></button><div class="completed-list ${completedOpen?'open':''}">`;D.completedTodos.forEach(t=>{ch+=`<div class="todo-item done ${t.priority}" id="todo-done-${t.id}"><div class="todo-check" onclick="uncompleteTodo(${t.id})"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" style="width:9px;height:9px;color:var(--text3)"><polyline points="20 6 9 17 4 12"/></svg></div><div class="todo-body"><div class="todo-text">${escHtml(t.text)}</div><div class="todo-meta"><span class="due-tag">${fmtDate(t.completedAt)}</span></div></div><button onclick="moveTodoToTrash(${t.id})" style="background:none;border:none;cursor:pointer;color:var(--text3);font-size:.75rem;padding:2px 4px;" onmouseover="this.style.color='var(--hard)'" onmouseout="this.style.color='var(--text3)'">🗑</button></div>`;});ch+='</div>';}
  document.getElementById('todo-completed-section').innerHTML=ch;
}
function toggleCompleted(){completedOpen=!completedOpen;renderTodos();}

// ─────────────────────────── NOTES ────────────────────────────────────────
function tagColor(tag){const colors=['#60a5fa','#a78bfa','#f472b6','#4ade80','#fb923c','#f87171','#fbbf24','#34d399'];let h=0;for(let c of tag)h=(h*31+c.charCodeAt(0))%colors.length;return colors[h];}
function saveQuickNote(){
  const inp=document.getElementById('quickNoteInput');
  const text=inp?.value.trim();
  if(!text)return;
  const note={
    id:Date.now(),
    title:text.slice(0,40)+(text.length>40?'...':''),
    content:text,
    media:[],tags:['hızlı'],
    pinned:true,
    createdAt:new Date().toISOString()
  };
  D.notes.unshift(note);
  saveData();
  renderNotes();
  inp.value='';
  showToast('Not eklendi ✓');
}

function renderNotes(){
  const grid=document.getElementById('notes-grid');const empty=document.getElementById('notes-empty');
  if(!D.notes.length){grid.innerHTML='';empty.style.display='block';return;}
  empty.style.display='none';
  grid.innerHTML=D.notes.map(n=>{
    const media=(n.media||[]).map(m=>`<span class="note-media-tag">${m.type}</span>`).join('');
    const tags=(n.tags||[]).map(t=>`<span class="note-tag-chip" style="color:${tagColor(t)};border-color:${tagColor(t)}44;">#${escHtml(t)}</span>`).join('');
    return`<div class="note-card" onclick="viewEntry('note',${n.id})"><div class="note-card-title">${escHtml(n.title||'Başlıksız')}</div><div class="note-card-preview">${escHtml(n.content||'')}</div>${tags?`<div style="display:flex;gap:3px;flex-wrap:wrap;">${tags}</div>`:''}<div style="display:flex;gap:3px;flex-wrap:wrap;">${media}</div><div class="note-card-date">${fmtDate(n.createdAt)}</div></div>`;
  }).join('');
}

// ─────────────────────────── DIARY ────────────────────────────────────────
function renderDiary(){
  const list=document.getElementById('diary-list');const empty=document.getElementById('diary-empty');
  if(!D.diary.length){list.innerHTML='';empty.style.display='block';return;}
  empty.style.display='none';
  list.innerHTML=D.diary.map(e=>`<div class="diary-entry" onclick="viewEntry('diary',${e.id})"><div class="diary-entry-header"><span class="diary-entry-date">${fmtDateFull(e.createdAt)}</span><span class="diary-mood-icon">${e.mood||'😊'}</span></div><div class="diary-entry-title">${escHtml(e.title||'Günlük Girişi')}</div><div class="diary-entry-preview">${escHtml(e.content||'')}</div></div>`).join('');
}

// ─────────────────────────── EDITOR ───────────────────────────────────────
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
  selMoodVal='😊';
  document.querySelectorAll('.mood-chip').forEach(c=>c.classList.toggle('sel',c.dataset.mood==='😊'));
  if(type==='diary'){const now=new Date();document.getElementById('diaryDate').value=`${now.getFullYear()}-${String(now.getMonth()+1).padStart(2,'0')}-${String(now.getDate()).padStart(2,'0')}`;}
  document.getElementById('editorOverlay').classList.add('open');
  setTimeout(()=>document.getElementById('editorTitle').focus(),400);
}
function selMood(el){selMoodVal=el.dataset.mood;document.querySelectorAll('.mood-chip').forEach(c=>c.classList.remove('sel'));el.classList.add('sel');}
function addTag(){const inp=document.getElementById('tagInput');const raw=inp.value.replace('#','').replace(',','').trim();if(!raw||editorTags.includes(raw))return;editorTags.push(raw);inp.value='';renderTagPreview();}
function renderTagPreview(){document.getElementById('tagPreview').innerHTML=editorTags.map((t,i)=>`<span class="tag-chip" style="color:${tagColor(t)};border-color:${tagColor(t)}44;">#${escHtml(t)}<span onclick="removeTag(${i})" style="cursor:pointer;margin-left:3px;opacity:.6;">✕</span></span>`).join('');}
function removeTag(i){editorTags.splice(i,1);renderTagPreview();}
function handleMedia(e,type){Array.from(e.target.files).forEach(file=>{const r=new FileReader();r.onload=ev=>{editorMediaFiles.push({type,name:file.name,data:ev.target.result});renderMPrev();};r.readAsDataURL(file);});e.target.value='';}
function renderMPrev(){document.getElementById('mediaPreview').innerHTML=editorMediaFiles.map((m,i)=>{if(m.type==='image')return`<div class="media-thumb"><img src="${m.data}"><button class="media-remove" onclick="removeMedia(${i})">✕</button></div>`;if(m.type==='video')return`<div class="media-thumb"><video src="${m.data}"></video><button class="media-remove" onclick="removeMedia(${i})">✕</button></div>`;return`<div class="media-thumb audio"><span>🎵 ${escHtml(m.name)}</span><button class="media-remove" onclick="removeMedia(${i})">✕</button></div>`;}).join('');}
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

// ─────────────────────────── VIEW ─────────────────────────────────────────
function viewEntry(type,id){
  const arr=type==='note'?D.notes:D.diary;
  const entry=arr.find(e=>e.id===id);if(!entry)return;
  viewingEntry={type,id};
  const badge=document.getElementById('viewBadge');badge.textContent=type==='note'?'Not':'Günlük Girişi';badge.className='etb '+type;
  let mH='';
  if(entry.media?.length){const imgs=entry.media.filter(m=>m.type==='image').map(m=>`<img src="${m.data}">`).join('');const vids=entry.media.filter(m=>m.type==='video').map(m=>`<video src="${m.data}" controls style="width:100%;border-radius:9px;margin-top:7px"></video>`).join('');const auds=entry.media.filter(m=>m.type==='audio').map(m=>`<audio src="${m.data}" controls style="width:100%;margin-top:7px"></audio>`).join('');mH=`<div class="view-media-grid">${imgs}${vids}</div>${auds}`;}
  const tagsH=(entry.tags||[]).length?`<div style="display:flex;gap:5px;flex-wrap:wrap;margin-bottom:10px;">${(entry.tags||[]).map(t=>`<span class="tag-chip" style="color:${tagColor(t)};border-color:${tagColor(t)}44;">#${escHtml(t)}</span>`).join('')}</div>`:'';
  document.getElementById('viewBody').innerHTML=`${entry.mood?`<div style="font-size:1.3rem;margin-bottom:7px">${entry.mood}</div>`:''}<div class="view-title">${escHtml(entry.title)}</div><div class="view-meta">${fmtDateFull(entry.createdAt)}</div>${tagsH}<div class="view-text">${escHtml(entry.content)}</div>${mH}<button class="view-delete-btn" id="viewDeleteBtn">🗑 Çöpe Taşı</button>`;
  document.getElementById('viewDeleteBtn').addEventListener('click',()=>deleteEntry());
  document.getElementById('viewOverlay').classList.add('open');
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

// ─────────────────────────── SEARCH ───────────────────────────────────────
// search state
function doSearch(query){
  const results=document.getElementById('search-results');
  if(!query.trim()){results.innerHTML='';return;}
  const q=query.toLowerCase();const found=[];
  D.notes.forEach(n=>{if((n.title+' '+n.content+' '+(n.tags||[]).join(' ')).toLowerCase().includes(q))found.push({type:'note',entry:n});});
  D.diary.forEach(e=>{if((e.title+' '+e.content).toLowerCase().includes(q))found.push({type:'diary',entry:e});});
  D.todos.forEach(t=>{if(t.text.toLowerCase().includes(q))found.push({type:'todo',entry:t});});
  if(!found.length){results.innerHTML='<div class="ai-thinking">Sonuç bulunamadı.</div>';return;}
  function hl(text,q){if(!text)return'';const re=new RegExp('('+q.replace(/[.*+?^${}()|[\]\\]/g,'\\$&')+')','gi');return escHtml(text).replace(re,'<mark>$1</mark>');}
  results.innerHTML=found.map(r=>{if(r.type==='todo')return`<div class="search-result-item" onclick="switchPage('todo')"><div class="srt todo">Görev</div><div class="srTitle">${hl(r.entry.text,q)}</div></div>`;return`<div class="search-result-item" onclick="viewEntry('${r.type}',${r.entry.id})"><div class="srt ${r.type}">${r.type==='note'?'Not':'Günlük'}</div><div class="srTitle">${hl(r.entry.title,q)}</div><div class="srSnip">${hl((r.entry.content||'').slice(0,100),q)}</div></div>`;}).join('');
}

// ─────────────────────────── CALENDAR ─────────────────────────────────────
function calDayKey(y,m,d){return`${y}-${String(m+1).padStart(2,'0')}-${String(d).padStart(2,'0')}`;}
function calNav(dir){
  if(calView==='week'){
    const cur=new Date(calYear,calMonth,selCalDay||1);
    cur.setDate(cur.getDate()+dir*7);
    calYear=cur.getFullYear();calMonth=cur.getMonth();selCalDay=cur.getDate();
  } else {
    calMonth+=dir;if(calMonth>11){calMonth=0;calYear++;}if(calMonth<0){calMonth=11;calYear--;}
  }
  renderCalendar();
}
function goToday(){const n=new Date();calYear=n.getFullYear();calMonth=n.getMonth();selCalDay=n.getDate();renderCalendar();}
function openCalPicker(){document.getElementById('calPickerMonth').value=calMonth;document.getElementById('calPickerYear').value=calYear;openModal('calPickerModal');}
function applyCalPicker(){const m=parseInt(document.getElementById('calPickerMonth').value);const y=parseInt(document.getElementById('calPickerYear').value);if(!isNaN(m)&&!isNaN(y)&&y>=0&&y<=2500){calMonth=m;calYear=y;}closeModal('calPickerModal');renderCalendar();}
function renderCalendar(){
  const months=['Ocak','Şubat','Mart','Nisan','Mayıs','Haziran','Temmuz','Ağustos','Eylül','Ekim','Kasım','Aralık'];
  document.getElementById('calMonthLabel').textContent=months[calMonth]+' '+calYear;
  if(calView==='week'){document.getElementById('calQuote').innerHTML='';renderWeekView();renderCalDayPanel();return;}
  const today=new Date();const firstDay=new Date(calYear,calMonth,1);let sd=firstDay.getDay();if(sd===0)sd=7;sd--;
  const dim=new Date(calYear,calMonth+1,0).getDate();const dip=new Date(calYear,calMonth,0).getDate();
  const diaryDays=new Set(D.diary.map(e=>{const d=new Date(e.createdAt);if(d.getFullYear()===calYear&&d.getMonth()===calMonth)return d.getDate();}).filter(Boolean));
  const todayMs=new Date().setHours(0,0,0,0);
  const todoDays=new Set(D.todos.filter(t=>t.dueDate).map(t=>{const p=t.dueDate.split('-');if(parseInt(p[0])===calYear&&parseInt(p[1])-1===calMonth)return parseInt(p[2]);}).filter(Boolean));
  const overdueDays=new Set(D.todos.filter(t=>t.dueDate).map(t=>{const d=new Date(t.dueDate);d.setHours(0,0,0,0);if(d.getFullYear()===calYear&&d.getMonth()===calMonth&&d<todayMs)return d.getDate();}).filter(Boolean));
  if(!D.calPlans)D.calPlans={};
  let html='';
  for(let i=0;i<sd;i++)html+=`<div class="cal-day other">${dip-sd+1+i}</div>`;
  for(let d=1;d<=dim;d++){const isToday=d===today.getDate()&&calMonth===today.getMonth()&&calYear===today.getFullYear();const hasPlan=!!D.calPlans[calDayKey(calYear,calMonth,d)];const hasTodo=todoDays.has(d);const isOverdue=overdueDays.has(d);html+=`<div class="cal-day${isToday?' today':''}${d===selCalDay?' selected':''}${diaryDays.has(d)?' has-entry':''}${hasPlan?' has-plan':''}${hasTodo?' has-todo':''}${isOverdue?' overdue-dot':''}" onclick="selectDay(${d})">${d}</div>`;}
  const rem=42-sd-dim;for(let d=1;d<=rem;d++)html+=`<div class="cal-day other">${d}</div>`;
  document.getElementById('calGrid').innerHTML=html;
  const q=getDayQuote(calYear,calMonth,selCalDay);
  document.getElementById('calQuote').innerHTML=`<div class="quote-card"><div class="quote-text">"${escHtml(q.text)}"</div><div class="quote-author">— ${escHtml(q.author)} <span class="quote-tag">${escHtml(q.tag)}</span></div></div>`;
  renderCalDayPanel();
}
function selectDay(d){selCalDay=d;renderCalendar();openCalDayModal(calYear,calMonth,d);}
function openCalDayModal(y,m,d){
  const key=calDayKey(y,m,d);if(!D.calPlans)D.calPlans={};
  const plan=D.calPlans[key]||'';
  const months=['Ocak','Şubat','Mart','Nisan','Mayıs','Haziran','Temmuz','Ağustos','Eylül','Ekim','Kasım','Aralık'];
  const wdays=['Pazar','Pazartesi','Salı','Çarşamba','Perşembe','Cuma','Cumartesi'];
  document.getElementById('calDayModalTitle').textContent=`${wdays[new Date(y,m,d).getDay()]}, ${d} ${months[m]} ${y}`;
  document.getElementById('calDayModalInput').value=plan;
  document.getElementById('calDayPrio').value='mid';
  const todos=D.todos.filter(t=>t.dueDate===key);
  const diaryE=D.diary.filter(e=>{const dt=new Date(e.createdAt);return dt.getFullYear()===y&&dt.getMonth()===m&&dt.getDate()===d;});
  const clr={easy:'var(--easy)',mid:'var(--mid)',hard:'var(--hard)'};
  let ex='';
  if(todos.length||diaryE.length){ex+='<div class="cdm-exist-section">';if(todos.length){ex+=`<div class="cdm-exist-label">Görevler</div>`;todos.forEach(t=>ex+=`<div class="cdm-exist-item"><span class="cdm-exist-dot" style="background:${clr[t.priority]}"></span><span class="cdm-exist-text">${escHtml(t.text)}</span></div>`);}if(diaryE.length){ex+=`<div class="cdm-exist-label" style="margin-top:6px;">Günlük</div>`;diaryE.forEach(e=>ex+=`<div class="cdm-exist-item"><span class="cdm-exist-dot" style="background:var(--diary)"></span><span class="cdm-exist-text">${escHtml(e.title)} ${e.mood||''}</span></div>`);}ex+='</div>';}
  document.getElementById('calDayModalExisting').innerHTML=ex;
  openModal('calDayModal');setTimeout(()=>document.getElementById('calDayModalInput').focus(),200);
}
function saveCalDayEntry(addToTodos){
  const key=calDayKey(calYear,calMonth,selCalDay);
  const text=document.getElementById('calDayModalInput').value.trim();
  const priority=document.getElementById('calDayPrio').value;
  if(!D.calPlans)D.calPlans={};
  if(text)D.calPlans[key]=text;else delete D.calPlans[key];
  saveData();
  if(addToTodos&&text){D.todos.push({id:Date.now(),text,priority,dueDate:key,createdAt:new Date().toISOString()});saveData();showToast('Takvime & göreve eklendi ✓');}
  else if(text)showToast('Takvime kaydedildi ✦');
  closeModal('calDayModal');renderCalendar();if(addToTodos)renderTodos();
}
function renderCalDayPanel(){
  if(!D.calPlans)D.calPlans={};
  const key=calDayKey(calYear,calMonth,selCalDay);
  const todosForDay=D.todos.filter(t=>t.dueDate===key);
  const dayEntries=D.diary.filter(e=>{const d=new Date(e.createdAt);return d.getFullYear()===calYear&&d.getMonth()===calMonth&&d.getDate()===selCalDay;});
  const months=['Ocak','Şubat','Mart','Nisan','Mayıs','Haziran','Temmuz','Ağustos','Eylül','Ekim','Kasım','Aralık'];
  let html='<div class="cal-day-panel">';
  if(D.calPlans[key])html+=`<div class="cal-panel-section-title">${selCalDay} ${months[calMonth]} ${calYear} — Plan</div><div class="cal-plan-display">${escHtml(D.calPlans[key])}</div>`;
  if(todosForDay.length){const lbl={easy:'Kolay',mid:'Orta',hard:'Zor'};const clr={easy:'var(--easy)',mid:'var(--mid)',hard:'var(--hard)'};html+=`<div class="cal-panel-section-title" style="margin-top:${D.calPlans[key]?'12px':'0'};">Görevler</div>`;todosForDay.forEach(t=>html+=`<div style="display:flex;align-items:center;gap:7px;padding:6px 0;border-bottom:1px solid var(--border);"><div style="width:6px;height:6px;border-radius:50%;background:${clr[t.priority]};flex-shrink:0;"></div><span style="font-size:.8rem;font-weight:300;color:var(--text2);flex:1;">${escHtml(t.text)}</span></div>`);}
  if(dayEntries.length){html+=`<div class="cal-panel-section-title" style="margin-top:12px;">Günlük</div>`;dayEntries.forEach(e=>html+=`<div class="cal-event-item" onclick="viewEntry('diary',${e.id})"><div class="cal-event-dot"></div><div><div class="cal-event-text">${escHtml(e.title)} ${e.mood||''}</div><div class="cal-event-time">${fmtTime(e.createdAt)}</div></div></div>`);}
  if(!D.calPlans[key]&&!todosForDay.length&&!dayEntries.length)html+=`<div style="color:var(--text3);font-size:.72rem;font-weight:300;font-style:italic;padding-top:5px;">Bu gün için içerik yok. Tıklayarak ekle.</div>`;
  html+='</div>';
  document.getElementById('calEvents').innerHTML=html;
}

// ─────────────────────────── DASHBOARD ────────────────────────────────────
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
  // Öğrenci ek alanını temizle
  const ex=document.getElementById('dashStudentExtra');if(ex)ex.innerHTML='';
  document.getElementById('dashGrid').innerHTML=`
    <div class="dash-card" onclick="switchPage('todo')"><div class="dash-card-icon">📋</div><div class="dash-card-num">${D.todos.length}</div><div class="dash-card-label">Aktif Görev</div></div>
    <div class="dash-card" onclick="switchPage('notes')"><div class="dash-card-icon">📝</div><div class="dash-card-num">${D.notes.length}</div><div class="dash-card-label">Not</div></div>
    <div class="dash-card" onclick="switchPage('diary')"><div class="dash-card-icon">📖</div><div class="dash-card-num">${D.diary.length}</div><div class="dash-card-label">Günlük</div></div>
    <div class="dash-card" onclick="switchPage('todo')" style="${overdue.length?'border-color:rgba(248,113,113,.3);':''}"><div class="dash-card-icon">${overdue.length?'⚠️':'✅'}</div><div class="dash-card-num" style="${overdue.length?'color:var(--hard)':''}">${overdue.length}</div><div class="dash-card-label" style="${overdue.length?'color:var(--hard)':''}">Gecikmiş</div></div>
  `;
  const tl=todayTodos.length?todayTodos.map(t=>`<div class="dash-todo-row"><div class="dash-todo-dot" style="background:${t.priority==='hard'?'var(--hard)':t.priority==='mid'?'var(--mid)':'var(--easy)'}"></div><div class="dash-todo-text">${escHtml(t.text)}</div></div>`).join(''):'<div style="color:var(--text3);font-size:.74rem;font-weight:300;font-style:italic;padding:6px 0;">Bugün için görev yok.</div>';
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
      <div class="dash-card-icon">🗓</div><div class="dash-card-num" style="color:#f9a8d4">${todayLessons.length}</div><div class="dash-card-label">Bugün Ders</div>
    </div>
    <div class="dash-card" onclick="switchPage('exams')" style="${upcomingExams.length?'border-color:rgba(251,146,60,.25);':''}">
      <div class="dash-card-icon">${upcomingExams.length?'⚠️':'✅'}</div><div class="dash-card-num" style="${upcomingExams.length?'color:var(--mid)':''}">${upcomingExams.length}</div><div class="dash-card-label">7 Günde Sınav</div>
    </div>
    <div class="dash-card" onclick="switchPage('notebook')">
      <div class="dash-card-icon">📓</div><div class="dash-card-num">${D.notebook.length}</div><div class="dash-card-label">Ders Notu</div>
    </div>
    <div class="dash-card" onclick="switchPage('pomodoro')" style="${overdueCount?'border-color:rgba(248,113,113,.25);':''}">
      <div class="dash-card-icon">🍅</div><div class="dash-card-num" style="${overdueCount?'color:var(--hard)':''}">${overdueCount}</div><div class="dash-card-label">${overdueCount?'Gecikmiş':'Pomodoro'}</div>
    </div>
  `;
  document.getElementById('dashTodayList').innerHTML='';
  document.getElementById('dashQuote').innerHTML='';
  const typeIco={exam:'📝',hw:'📚',project:'🔬'};
  const lessonsHtml=todayLessons.length?todayLessons.map(l=>`<div class="sdash-lesson"><div class="sdash-lesson-bar" style="background:${l.color}"></div><div class="sdash-lesson-info"><div class="sdash-lesson-name">${escHtml(l.name)}</div>${l.room?`<div class="sdash-lesson-room">${escHtml(l.room)}</div>`:''}</div><div class="sdash-lesson-time">${l.start||''}${l.start&&l.end?' – ':''}${l.end||''}</div></div>`).join(''):'<div style="color:var(--text3);font-size:.72rem;font-style:italic;padding:6px 0;">Bugün ders yok 🎉</div>';
  const examsHtml=upcomingExams.length?upcomingExams.map(e=>{const d=new Date(e.date);d.setHours(0,0,0,0);const diff=Math.round((d-todayMs)/86400000);const diffStr=diff===0?'Bugün!':diff===1?'Yarın':`${diff} gün kaldı`;const cls=diff===0?'color:var(--mid)':diff<=3?'color:var(--accent2)':'color:var(--text3)';return`<div class="sdash-exam"><span class="sdash-exam-ico">${typeIco[e.type]||'📝'}</span><div class="sdash-exam-info"><div class="sdash-exam-name">${escHtml(e.name)}</div><div class="sdash-exam-date">${fmtDate(e.date)}${e.time?' · '+e.time:''}</div></div><div class="sdash-exam-diff" style="${cls}">${diffStr}</div></div>`;}).join(''):'<div style="color:var(--text3);font-size:.72rem;font-style:italic;padding:6px 0;">7 günde sınav yok 👍</div>';
  const q=getDayQuote(now.getFullYear(),now.getMonth(),now.getDate());
  let extra=document.getElementById('dashStudentExtra');
  if(!extra){extra=document.createElement('div');extra.id='dashStudentExtra';document.getElementById('page-home').appendChild(extra);}
  extra.innerHTML=`
    <div class="sdash-section"><div class="sdash-section-title"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width:12px;height:12px"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="3" y1="10" x2="21" y2="10"/></svg>Bugünün Programı<button onclick="switchPage('schedule')" class="sdash-more-btn">Tümü →</button></div><div class="sdash-lessons">${lessonsHtml}</div></div>
    <div class="sdash-section"><div class="sdash-section-title"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width:12px;height:12px"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/></svg>Yaklaşan Sınavlar<button onclick="switchPage('exams')" class="sdash-more-btn">Tümü →</button></div><div class="sdash-exams">${examsHtml}</div></div>
    <div class="dash-quote" style="margin-top:12px"><div class="dash-quote-text">"${escHtml(q.text)}"</div><div class="dash-quote-author">— ${escHtml(q.author)}</div></div>
  `;
}


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
  else{pomoRunning=true;document.getElementById('pomoIcon').innerHTML='<rect x="6" y="4" width="4" height="16" fill="currentColor"/><rect x="14" y="4" width="4" height="16" fill="currentColor"/>';pomoInterval=setInterval(()=>{pomoSecs--;if(pomoSecs<=0){clearInterval(pomoInterval);pomoRunning=false;if(pomoMode==='work'){pomoSessions++;updatePomoSessions();showToast('Seans tamamlandı! 🍅');}else showToast('Mola bitti!');return;}updatePomoDisplay();},1000);}
}
function skipPomo(){pomoRunning=false;clearInterval(pomoInterval);setPomoMode(pomoMode==='work'?'short':'work');}
function updatePomoDisplay(){
  const m=Math.floor(pomoSecs/60),s=pomoSecs%60;
  document.getElementById('pomoTime').textContent=`${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')}`;
  const total=POMO_DUR[pomoMode];const prog=(total-pomoSecs)/total;
  document.getElementById('pomoRing').style.strokeDashoffset=2*Math.PI*60*(1-prog);
}
function updatePomoSessions(){const c=document.getElementById('pomoSessions');c.innerHTML=Array.from({length:4},(_,i)=>`<div class="pomo-sess-dot${i<pomoSessions%4?' done':''}"></div>`).join('');}
function renderPomoTodos(){
  const tk=new Date().toISOString().split('T')[0];
  const items=D.todos.filter(t=>!t.dueDate||t.dueDate<=tk).slice(0,8);
  document.getElementById('pomoTodoList').innerHTML=items.length?items.map(t=>`<div class="pomo-todo-item ${pomoTaskId===t.id?'selected':''}" onclick="setPomoTask(${t.id})"><div class="todo-dot ${t.priority}"></div><div class="todo-text">${escHtml(t.text)}</div></div>`).join(''):'<div class="empty-state">Görev yok</div>';
}
function setPomoTask(id){pomoTaskId=id;const t=D.todos.find(x=>x.id===id);if(t)document.getElementById('pomoTaskLbl').textContent='🎯 '+t.text;renderPomoTodos();}

// ─────────────────────────── KANBAN ───────────────────────────────────────
function selKanbanP(p){kanbanPriority=p;document.querySelectorAll('[data-kp]').forEach(el=>el.classList.toggle('sel',el.dataset.kp===p));}
function openKanbanAdd(){openModal('kanbanAddModal');}
function saveKanbanCard(){const text=document.getElementById('kanbanAddText').value.trim();const col=document.getElementById('kanbanAddCol').value;if(!text)return;D.kanban[col].push({id:Date.now(),text,priority:kanbanPriority,createdAt:new Date().toISOString()});saveData();closeModal('kanbanAddModal');document.getElementById('kanbanAddText').value='';renderKanban();showToast('Kart eklendi');}
function moveKanbanCard(id,fromCol,dir){const cols=['todo','doing','done'];const fi=cols.indexOf(fromCol);const ti=fi+dir;if(ti<0||ti>2)return;const idx=D.kanban[fromCol].findIndex(c=>c.id===id);if(idx===-1)return;const card=D.kanban[fromCol].splice(idx,1)[0];D.kanban[cols[ti]].push(card);saveData();renderKanban();}
function syncKanbanFromTodos(){D.todos.forEach(t=>{const exists=Object.values(D.kanban).some(col=>col.some(c=>c.id===t.id));if(!exists)D.kanban.todo.push({id:t.id,text:t.text,priority:t.priority,createdAt:t.createdAt});});saveData();renderKanban();showToast('Görevler aktarıldı');}
function renderKanban(){
  const cols=[{id:'todo',label:'Yapılacak'},{id:'doing',label:'Devam Eden'},{id:'done',label:'Tamamlandı'}];
  const clr={easy:'var(--easy)',mid:'var(--mid)',hard:'var(--hard)'};
  const lbl={easy:'Kolay',mid:'Orta',hard:'Zor'};
  document.getElementById('kanbanBoard').innerHTML=cols.map(col=>`
    <div class="kanban-col col-${col.id}">
      <div class="kanban-col-header"><span class="kanban-col-title">${col.label}</span><span class="kanban-count">${D.kanban[col.id].length}</span></div>
      <div class="kanban-cards">${D.kanban[col.id].map(card=>`<div class="kanban-card"><div class="kanban-card-text">${escHtml(card.text)}</div><div style="display:flex;align-items:center;gap:4px;"><span class="todo-badge" style="color:${clr[card.priority]};background:${clr[card.priority]}18;">${lbl[card.priority]}</span></div><div class="kanban-move-btns">${col.id!=='todo'?`<button class="kmb" onclick="moveKanbanCard(${card.id},'${col.id}',-1)">← Geri</button>`:''} ${col.id!=='done'?`<button class="kmb" onclick="moveKanbanCard(${card.id},'${col.id}',1)">İleri →</button>`:''}</div></div>`).join('')}</div>
      <button class="kanban-add-btn" onclick="openKanbanAdd()">+ Kart Ekle</button>
    </div>`).join('');
}

// ─────────────────────────── WEEKLY ───────────────────────────────────────
function renderWeekly(){
  const now=new Date();const ws=new Date(now);ws.setDate(now.getDate()-now.getDay()+1);ws.setHours(0,0,0,0);
  const we=new Date(ws);we.setDate(ws.getDate()+7);
  const cw=D.completedTodos.filter(t=>new Date(t.completedAt)>=ws&&new Date(t.completedAt)<we);
  const dw=D.diary.filter(e=>new Date(e.createdAt)>=ws&&new Date(e.createdAt)<we);
  const nw=D.notes.filter(n=>new Date(n.createdAt)>=ws&&new Date(n.createdAt)<we);
  const days=['Pt','Sa','Ça','Pe','Cu','Ct','Pz'];
  const barData=days.map((_,i)=>{const d=new Date(ws);d.setDate(ws.getDate()+i);const dk=d.toISOString().split('T')[0];return D.completedTodos.filter(t=>t.completedAt?.startsWith(dk)).length;});
  const maxBar=Math.max(...barData,1);
  const barColors=['var(--accent)','var(--note)','var(--easy)','var(--mid)','var(--hard)','var(--diary)','var(--accent2)'];
  const streak=calcStreak();
  document.getElementById('weeklyContent').innerHTML=`
    <div class="weekly-card">
      <div class="weekly-card-title">Bu Haftanın Özeti</div>
      <div class="weekly-stats">
        <div class="wstat-box"><div class="wstat-num">${cw.length}</div><div class="wstat-label">Görev</div></div>
        <div class="wstat-box"><div class="wstat-num">${dw.length}</div><div class="wstat-label">Günlük</div></div>
        <div class="wstat-box"><div class="wstat-num">${nw.length}</div><div class="wstat-label">Not</div></div>
      </div>
      <div class="week-bars">${barData.map((v,i)=>`<div class="week-bar" style="height:${Math.max(4,(v/maxBar)*44)}px;background:${barColors[i]};"></div>`).join('')}</div>
      <div class="week-bar-labels">${days.map(d=>`<div class="week-bar-label">${d}</div>`).join('')}</div>
    </div>
    <div class="weekly-card">
      <div class="streak-row"><div class="streak-num">${streak}</div><div class="streak-info"><div class="streak-label">Günlük Seri 🔥</div><div class="streak-sub">Arka arkaya aktif gün</div></div></div>
    </div>
    <div class="weekly-card">
      <div class="weekly-card-title">Tamamlananlar (Bu Hafta)</div>
      ${cw.length?cw.map(t=>`<div style="display:flex;align-items:center;gap:8px;padding:6px 0;border-bottom:1px solid var(--border);"><svg viewBox="0 0 24 24" fill="none" stroke="var(--easy)" stroke-width="2.5" style="width:13px;height:13px;flex-shrink:0;"><polyline points="20 6 9 17 4 12"/></svg><span style="font-size:.8rem;font-weight:300;color:var(--text2);">${escHtml(t.text)}</span></div>`).join(''):'<div style="color:var(--text3);font-size:.76rem;font-style:italic;padding:8px 0;">Bu hafta tamamlanan görev yok.</div>'}
    </div>
    <div class="action-row">
      <button class="action-btn a-pro" onclick="exportData()"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width:13px;height:13px;"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>Dışa Aktar</button>
    </div>`;
}
function calcStreak(){let s=0;const now=new Date();now.setHours(0,0,0,0);for(let i=0;i<365;i++){const d=new Date(now);d.setDate(now.getDate()-i);const dk=d.toISOString().split('T')[0];const ok=D.completedTodos.some(t=>t.completedAt?.startsWith(dk))||D.diary.some(e=>e.createdAt?.startsWith(dk))||D.notes.some(n=>n.createdAt?.startsWith(dk));if(ok)s++;else if(i>0)break;}return s;}

// ─────────────────────────── READING ──────────────────────────────────────
function openReadingAdd(){document.getElementById('readingTitleInput').value='';document.getElementById('readingAuthorInput').value='';document.getElementById('readingStatusInput').value='toread';openModal('readingAddModal');}
function saveReadingItem(){const title=document.getElementById('readingTitleInput').value.trim();if(!title)return;D.reading.push({id:Date.now(),title,author:document.getElementById('readingAuthorInput').value.trim(),status:document.getElementById('readingStatusInput').value,createdAt:new Date().toISOString()});saveData();closeModal('readingAddModal');renderReading();showToast('Eklendi');}
function cycleReadingStatus(id){const item=D.reading.find(r=>r.id===id);if(!item)return;const cycle={toread:'reading',reading:'done',done:'toread'};item.status=cycle[item.status];saveData();renderReading();}
function renderReading(){
  const groups={reading:[],toread:[],done:[]};D.reading.forEach(r=>groups[r.status].push(r));
  const labels={reading:'Okunuyor',toread:'Okunacak',done:'Tamamlandı'};
  let html='';
  ['reading','toread','done'].forEach(s=>{if(!groups[s].length)return;html+=`<div class="reading-group-title">${labels[s]}</div>`;groups[s].forEach(item=>html+=`<div class="reading-item" onclick="cycleReadingStatus(${item.id})"><div class="reading-dot ${item.status}"></div><div class="reading-info"><div class="reading-title">${escHtml(item.title)}</div>${item.author?`<div class="reading-author">${escHtml(item.author)}</div>`:''}</div><span class="reading-badge ${item.status}">${labels[item.status]}</span></div>`);});
  document.getElementById('readingList').innerHTML=html||'<div class="empty-state">Okuma listesi boş.<br>Üstten kitap ekle.</div>';
}

function loadUserSlides(){
  if(!currentUser||!db)return;
  showToast('Slaytlar kontrol ediliyor...');
  db.collection('userSlides').doc(currentUser.uid).collection('slides')
    .orderBy('addedAt','desc').get().then(snap=>{
      if(snap.empty){showToast('Bulutta slayt yok');return;}
      if(!D.slides)D.slides=[];
      const localIds=new Set(D.slides.map(s=>String(s.id)));
      const allRemote=snap.docs.map(d=>d.data());
      const newOnes=allRemote.filter(s=>!localIds.has(String(s.id)));
      if(!newOnes.length){showToast('Slaytlar güncel ✓');renderSlides();return;}
      showToast(newOnes.length+' yeni slayt indiriliyor...');
      let loaded=0;
      const sequential=(arr,fn)=>arr.reduce((p,item)=>p.then(()=>fn(item)),Promise.resolve());
      sequential(newOnes,s=>{
        return db.collection('userSlides').doc(currentUser.uid)
          .collection('slides').doc(String(s.id))
          .collection('chunks').orderBy('idx').get()
          .then(cSnap=>{
            if(cSnap.empty){D.slides.unshift({...s,base64:''});return;}
            const b64='data:application/pdf;base64,'+cSnap.docs.map(d=>d.data().data).join('');
            D.slides.unshift({...s,base64:b64});
            loaded++;
          }).catch(()=>{D.slides.unshift({...s,base64:''});});
      }).then(()=>{
        D.slides.sort((a,b)=>new Date(b.addedAt)-new Date(a.addedAt));
        localStorage.setItem('capsula_v4',JSON.stringify(D));
        renderSlides();
        showToast(loaded+' slayt indirildi ✓');
      });
    }).catch(err=>showToast('Hata: '+(err.code||err.message)));
}

// ─────────────────────────── SLIDES ────────────────────────────────────────
// D.slides = [{id, name, category, pages, size, addedAt, thumb, base64}]
let slidesCurCat='Tümü';

function uploadSlides(e){
  const files=[...e.target.files];
  if(!files.length)return;
  const pdfs=files.filter(f=>f.name.toLowerCase().endsWith('.pdf'));
  if(!pdfs.length){showToast('Sadece PDF destekleniyor');return;}
  const processOne=(file)=>new Promise(resolve=>{
    if(file.size>20*1024*1024){showToast(file.name+' çok büyük (max 20MB)');resolve();return;}
    showToast(file.name+' işleniyor...');
    const reader=new FileReader();
    reader.onload=ev=>{
      const base64=ev.target.result;
      const rawB64=base64.split(',')[1];
      const arr=new Uint8Array(rawB64.split('').map(c=>c.charCodeAt(0)));
      const makeSlide=(thumb,pages)=>{
        const slideId='slide-'+Date.now()+'-'+Math.random().toString(36).slice(2);
        const slide={id:slideId,name:file.name.replace(/\.pdf$/i,''),category:'Genel',pages,size:file.size,addedAt:new Date().toISOString(),thumb,base64};
        if(!D.slides)D.slides=[];
        D.slides.unshift(slide);
        localStorage.setItem('capsula_v4',JSON.stringify(D));
        renderSlides();
        if(currentUser&&db){
          const ref=db.collection('userSlides').doc(currentUser.uid).collection('slides').doc(slideId);
          ref.set({id:slideId,name:slide.name,category:slide.category,pages,size:file.size,addedAt:slide.addedAt,thumb})
            .then(()=>{
              const CHUNK=450*1024;
              const chunks=[];
              for(let i=0;i<rawB64.length;i+=CHUNK)chunks.push(rawB64.slice(i,i+CHUNK));
              return chunks.reduce((p,chunk,idx)=>p.then(()=>
                ref.collection('chunks').doc(String(idx).padStart(4,'0')).set({data:chunk,idx})
              ),Promise.resolve());
            }).then(()=>{showToast(slide.name+' buluta kaydedildi ✓');resolve();})
            .catch(err=>{showToast('Yerel kaydedildi (bulut hatası: '+(err.code||'?')+')');resolve();});
        } else resolve();
      };
      if(typeof pdfjsLib!=='undefined'){
        pdfjsLib.getDocument({data:arr}).promise.then(pdf=>{
          pdf.getPage(1).then(page=>{
            const vp=page.getViewport({scale:0.4});
            const cv=document.createElement('canvas');
            cv.width=vp.width;cv.height=vp.height;
            page.render({canvasContext:cv.getContext('2d'),viewport:vp}).promise
              .then(()=>makeSlide(cv.toDataURL('image/jpeg',0.6),pdf.numPages))
              .catch(()=>makeSlide('',pdf.numPages));
          }).catch(()=>makeSlide('',pdf.numPages));
        }).catch(()=>makeSlide('',0));
      } else makeSlide('',0);
    };
    reader.onerror=()=>{showToast('Dosya okunamadı');resolve();};
    reader.readAsDataURL(file);
  });
  pdfs.reduce((p,f)=>p.then(()=>processOne(f)),Promise.resolve());
  e.target.value='';
}

function renderSlides(){
  if(!D.slides)D.slides=[];
  const q=(document.getElementById('slidesSearchInput')?.value||'').toLowerCase();
  // Kategoriler
  const cats=['Tümü',...new Set(D.slides.map(s=>s.category||'Genel'))];
  const catEl=document.getElementById('slidesCats');
  if(catEl){
    catEl.innerHTML=cats.map(c=>`<button class="slide-cat-btn${c===slidesCurCat?' active':''}" onclick="slidesCurCat='${c}';renderSlides()">${c}</button>`
    +(c==='Tümü'?`<button class="slide-cat-btn" onclick="addSlideCat()" style="border-style:dashed;">+ Kategori</button>`:'')).join('');
  }
  // Filtrele
  let slides=D.slides;
  if(slidesCurCat!=='Tümü')slides=slides.filter(s=>(s.category||'Genel')===slidesCurCat);
  if(q)slides=slides.filter(s=>s.name.toLowerCase().includes(q)||(s.category||'').toLowerCase().includes(q));
  const grid=document.getElementById('slidesGrid');
  if(!grid)return;
  if(!slides.length){
    grid.innerHTML=`<div class="slide-empty"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" style="width:40px;height:40px;opacity:.3;margin-bottom:12px;"><rect x="2" y="3" width="20" height="14" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg><div>Henüz slayt yok</div><div style="font-size:.62rem;margin-top:4px;opacity:.6;">PDF Yükle butonuna basarak ekleyebilirsin</div></div>`;
    return;
  }
  grid.innerHTML=slides.map(s=>`
    <div class="slide-card" onclick="openSlide('${s.id}')">
      <div class="slide-thumb">
        ${s.thumb?`<img src="${s.thumb}" style="width:100%;height:100%;object-fit:cover;">`:`<div class="slide-thumb-placeholder"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" style="width:32px;height:32px;"><rect x="2" y="3" width="20" height="14" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg><span style="font-size:.6rem;font-family:'JetBrains Mono',monospace;">${s.pages} sayfa</span></div>`}
      </div>
      <div class="slide-actions">
        <div class="slide-action-btn" onclick="event.stopPropagation();changeSlideCat('${s.id}')" title="Kategori değiştir">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width:12px;height:12px;"><path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"/><line x1="7" y1="7" x2="7.01" y2="7"/></svg>
        </div>
        <div class="slide-action-btn" onclick="event.stopPropagation();shareSlide('${s.id}')" title="Paylaş">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width:12px;height:12px;"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/></svg>
        </div>
        <div class="slide-action-btn" onclick="event.stopPropagation();deleteSlide('${s.id}')" title="Sil" style="color:var(--hard);">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width:12px;height:12px;"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/></svg>
        </div>
      </div>
      <div class="slide-info">
        <div class="slide-name">${escHtml(s.name)}</div>
        <div class="slide-meta">
          <span>${s.pages} sayfa · ${(s.size/1024/1024).toFixed(1)}MB</span>
          <span class="slide-cat-tag">${escHtml(s.category||'Genel')}</span>
        </div>
      </div>
    </div>`).join('');
}

function openSlide(id){
  const s=D.slides.find(x=>String(x.id)===String(id));
  if(!s||!s.base64)return;

  // PDF.js ile tam ekran modal
  const modal=document.createElement('div');
  modal.id='pdfViewerModal';
  modal.style.cssText='position:fixed;inset:0;z-index:4000;background:#111;display:flex;flex-direction:column;';
  modal.innerHTML=`
    <div style="display:flex;align-items:center;gap:10px;padding:10px 14px;background:rgba(13,13,18,.97);border-bottom:1px solid rgba(255,255,255,.1);flex-shrink:0;">
      <button onclick="document.getElementById('pdfViewerModal').remove()" style="background:rgba(255,255,255,.08);border:1px solid rgba(255,255,255,.12);color:#fff;cursor:pointer;padding:6px 12px;border-radius:8px;font-size:.75rem;font-family:'Sora',sans-serif;display:flex;align-items:center;gap:6px;">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" style="width:14px;height:14px;"><polyline points="15 18 9 12 15 6"/></svg> Geri
      </button>
      <div style="flex:1;font-size:.82rem;font-weight:500;color:#f0eeff;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">${escHtml(s.name)}</div>
      <div style="display:flex;align-items:center;gap:8px;flex-shrink:0;">
        <button onclick="pdfPrevPage()" style="background:rgba(255,255,255,.08);border:1px solid rgba(255,255,255,.12);color:#fff;cursor:pointer;width:32px;height:32px;border-radius:8px;font-size:1rem;display:flex;align-items:center;justify-content:center;">‹</button>
        <span id="pdfPageInfo" style="font-size:.68rem;font-family:'JetBrains Mono',monospace;color:rgba(255,255,255,.5);white-space:nowrap;">1 / ?</span>
        <button onclick="pdfNextPage()" style="background:rgba(255,255,255,.08);border:1px solid rgba(255,255,255,.12);color:#fff;cursor:pointer;width:32px;height:32px;border-radius:8px;font-size:1rem;display:flex;align-items:center;justify-content:center;">›</button>
      </div>
    </div>
    <div style="flex:1;overflow:auto;display:flex;align-items:flex-start;justify-content:center;padding:16px;background:#1a1a1a;">
      <canvas id="pdfCanvas" style="max-width:100%;box-shadow:0 8px 32px rgba(0,0,0,.6);border-radius:4px;"></canvas>
    </div>
    <div id="pdfLoading" style="position:absolute;inset:0;display:flex;align-items:center;justify-content:center;background:rgba(17,17,17,.9);z-index:10;">
      <div style="text-align:center;color:rgba(255,255,255,.6);">
        <div style="font-size:.8rem;font-family:'Sora',sans-serif;margin-bottom:8px;">PDF yükleniyor...</div>
        <div style="width:48px;height:2px;background:rgba(124,111,247,.3);border-radius:2px;margin:0 auto;overflow:hidden;"><div style="width:40%;height:100%;background:var(--accent);animation:loadBar .8s ease-in-out infinite alternate;border-radius:2px;"></div></div>
      </div>
    </div>`;
  document.body.appendChild(modal);

  // PDF.js ile yükle
  const data=atob(s.base64.split(',')[1]);
  const arr=new Uint8Array(data.length);
  for(let i=0;i<data.length;i++)arr[i]=data.charCodeAt(i);

  window._pdfDoc=null;
  window._pdfPage=1;

  pdfjsLib.getDocument({data:arr}).promise.then(pdf=>{
    window._pdfDoc=pdf;
    window._pdfPage=1;
    document.getElementById('pdfLoading').style.display='none';
    renderPdfPage();
  }).catch(err=>{
    document.getElementById('pdfLoading').innerHTML='<div style="color:#f87171;font-size:.8rem;padding:20px;">PDF açılamadı: '+err.message+'</div>';
  });
}

function renderPdfPage(){
  if(!window._pdfDoc)return;
  const canvas=document.getElementById('pdfCanvas');
  if(!canvas)return;
  const pageInfo=document.getElementById('pdfPageInfo');
  if(pageInfo)pageInfo.textContent=window._pdfPage+' / '+window._pdfDoc.numPages;
  window._pdfDoc.getPage(window._pdfPage).then(page=>{
    const vw=canvas.parentElement.clientWidth-32;
    const vp0=page.getViewport({scale:1});
    const scale=Math.min(vw/vp0.width,3);
    const vp=page.getViewport({scale});
    canvas.width=vp.width;
    canvas.height=vp.height;
    page.render({canvasContext:canvas.getContext('2d'),viewport:vp});
  });
}

function pdfNextPage(){
  if(!window._pdfDoc)return;
  if(window._pdfPage<window._pdfDoc.numPages){window._pdfPage++;renderPdfPage();}
}

function pdfPrevPage(){
  if(!window._pdfDoc)return;
  if(window._pdfPage>1){window._pdfPage--;renderPdfPage();}
}

function dataURLtoBlob(dataURL){
  const arr=dataURL.split(',');
  const mime=arr[0].match(/:(.*?);/)[1];
  const bstr=atob(arr[1]);
  let n=bstr.length;
  const u8=new Uint8Array(n);
  while(n--)u8[n]=bstr.charCodeAt(n);
  return new Blob([u8],{type:mime});
}

function addSlideCat(){
  const name=prompt('Yeni kategori adı:');
  if(!name?.trim())return;
  slidesCurCat=name.trim();
  renderSlides();
}

function changeSlideCat(id){
  const s=D.slides.find(x=>x.id==id);if(!s)return;
  const cats=[...new Set(D.slides.map(x=>x.category||'Genel')),'+ Yeni kategori'];
  const cur=s.category||'Genel';
  const chosen=prompt(`Kategori seç (şu an: ${cur})\n${cats.join(', ')}\n\nYeni kategori adı yaz:`);
  if(!chosen?.trim())return;
  s.category=chosen.trim();
  localStorage.setItem('capsula_v4',JSON.stringify(D));
  renderSlides();
}

function deleteSlide(id){
  showConfirm('Bu slaytı silmek istediğine emin misin?',()=>{
    D.slides=D.slides.filter(x=>x.id!=id);
    localStorage.setItem('capsula_v4',JSON.stringify(D));
    renderSlides();
    showToast('Slayt silindi');
  });
}

function shareSlide(id){
  const s=D.slides.find(x=>x.id==id);if(!s)return;
  if(!currentUser){showToast('Paylaşmak için giriş yap');return;}
  // Arkadaş listesini çek ve seçtir
  if(!D.profile.friends?.length){showToast('Henüz arkadaşın yok');return;}
  db.collection('users').doc(currentUser.uid).get().then(doc=>{
    const friends=doc.data()?.friends||[];
    if(!friends.length){showToast('Henüz arkadaşın yok');return;}
    const promises=friends.map(uid=>db.collection('users').doc(uid).get());
    Promise.all(promises).then(docs=>{
      const modal=document.createElement('div');
      modal.className='modal-overlay';modal.style.display='flex';
      modal.innerHTML=`<div class="modal-box" style="padding:20px;">
        <button class="modal-close-btn" onclick="this.closest('.modal-overlay').remove()">✕</button>
        <div class="plabel" style="margin-bottom:12px;">Slaytı Paylaş — ${escHtml(s.name)}</div>
        ${docs.map(d=>{const u=d.data();return`<div onclick="sendSlideToFriend('${id}','${d.id}');this.closest('.modal-overlay').remove();" style="display:flex;align-items:center;gap:10px;padding:10px;border-radius:10px;cursor:pointer;background:var(--bg3);margin-bottom:6px;">
          ${userAvatarHtml(u,36)}
          <div><div style="font-size:.8rem;color:var(--text);">${escHtml(u.name||'')}</div><div style="font-size:.62rem;color:var(--text3);">@${u.username||''}</div></div>
        </div>`;}).join('')}
      </div>`;
      document.body.appendChild(modal);
    });
  });
}

function sendSlideToFriend(slideId,toUid){
  const s=D.slides.find(x=>x.id==slideId);if(!s)return;
  const cid=convId(currentUser.uid,toUid);
  const msg=`📄 **${s.name}** adlı slaytı paylaştı`;
  const batch=db.batch();
  const msgRef=db.collection('conversations').doc(cid).collection('messages').doc();
  batch.set(msgRef,{
    text:msg,senderId:currentUser.uid,
    sentAt:firebase.firestore.FieldValue.serverTimestamp(),
    type:'slide',slideThumb:s.thumb||'',slideName:s.name
  });
  batch.set(db.collection('conversations').doc(cid),{
    members:[currentUser.uid,toUid],
    lastMsg:`📄 ${s.name}`,
    lastMsgAt:firebase.firestore.FieldValue.serverTimestamp(),
    lastSenderId:currentUser.uid,
    [`unreadCount.${toUid}`]:firebase.firestore.FieldValue.increment(1),
    [`unreadCount.${currentUser.uid}`]:0
  },{merge:true});
  batch.commit().then(()=>showToast('Slayt gönderildi ✓')).catch(console.warn);
}

// ─────────────────────────── CHAT ─────────────────────────────────────────
let activeChatUid=null;
let activeChatUnsub=null;
let convListUnsub=null;

function convId(uid1,uid2){return[uid1,uid2].sort().join('_');}

function renderChatPage(){
  if(!currentUser){
    document.getElementById('chatConvList').innerHTML='<div class="chat-empty-state">Giriş yapman gerekiyor</div>';
    return;
  }
  loadConversations();
}

function loadConversations(){
  if(convListUnsub)convListUnsub();
  if(!currentUser||!db)return;
  const uid=currentUser.uid;

  // Index gerektirmeyen basit sorgu — sadece members filtrele, sıralama client'ta
  convListUnsub=db.collection('conversations')
    .where('members','array-contains',uid)
    .onSnapshot(snap=>{
      let totalUnread=0;
      const convItems=snap.docs
        .map(doc=>{
          const d=doc.data();
          const otherUid=d.members?.find(m=>m!==uid);
          if(!otherUid)return null;
          const unread=d.unreadCount?.[uid]||0;
          totalUnread+=unread;
          return{id:doc.id,otherUid,data:d,unread};
        })
        .filter(Boolean)
        .sort((a,b)=>{
          const ta=a.data.lastMsgAt?.toDate?.()||new Date(0);
          const tb=b.data.lastMsgAt?.toDate?.()||new Date(0);
          return tb-ta;
        });

      // Arkadaş listesini çek
      db.collection('users').doc(uid).get().then(myDoc=>{
        const myFriends=myDoc.data()?.friends||[];
        const convUids=convItems.map(c=>c.otherUid);
        const noConvFriends=myFriends.filter(f=>!convUids.includes(f));

        const allUids=[...convUids,...noConvFriends];
        if(!allUids.length){
          document.getElementById('chatConvList').innerHTML='<div class="chat-empty-state"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" style="width:36px;height:36px;opacity:.3;margin-bottom:12px;"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg><div>Henüz arkadaşın yok</div><div style="font-size:.65rem;margin-top:4px;opacity:.6;">Drawer\'dan arkadaş ekleyebilirsin</div></div>';
          updateChatNavBadge(0);
          return;
        }

        // Tüm kullanıcı profillerini çek
        Promise.all(allUids.map(u=>db.collection('users').doc(u).get())).then(userDocs=>{
          const userMap={};
          userDocs.forEach(d=>{if(d.exists)userMap[d.id]=d.data();});

          let html='';
          // Konuşmalar
          if(convItems.length){
            convItems.forEach(item=>{
              const u=userMap[item.otherUid]||{name:'Kullanıcı',username:'',avatarThumb:''};
              const d=item.data;
              const isActive=activeChatUid===item.otherUid;
              const timeStr=d.lastMsgAt?fmtChatTime(d.lastMsgAt.toDate?.()||new Date(d.lastMsgAt)):'';
              const avatarHtml=u.avatarThumb?`<img src="${u.avatarThumb}">`:`<span>${(u.name||'?').slice(0,2).toUpperCase()}</span>`;
              html+=`<div class="chat-conv-item${isActive?' active':''}" onclick="openChat('${item.otherUid}')">
                <div class="chat-conv-avatar">${avatarHtml}</div>
                <div class="chat-conv-info">
                  <div class="chat-conv-name">${escHtml(u.name||'')}</div>
                  <div class="chat-conv-preview">${item.unread>0?`<b>${escHtml(d.lastMsg||'')}</b>`:escHtml(d.lastMsg||'')}</div>
                </div>
                <div class="chat-conv-meta">
                  <div class="chat-conv-time">${timeStr}</div>
                  ${item.unread>0?`<div class="chat-conv-badge">${item.unread}</div>`:''}
                </div>
              </div>`;
            });
          }
          // Konuşması olmayan arkadaşlar
          if(noConvFriends.length){
            if(convItems.length)html+=`<div style="font-size:.52rem;letter-spacing:.15em;color:var(--text3);font-family:'JetBrains Mono',monospace;text-transform:uppercase;padding:12px 6px 6px;">Arkadaşlar</div>`;
            noConvFriends.forEach(fuid=>{
              const u=userMap[fuid];
              if(!u)return;
              const avatarHtml=u.avatarThumb?`<img src="${u.avatarThumb}">`:`<span>${(u.name||'?').slice(0,2).toUpperCase()}</span>`;
              html+=`<div class="chat-conv-item" onclick="openChat('${fuid}')">
                <div class="chat-conv-avatar">${avatarHtml}</div>
                <div class="chat-conv-info">
                  <div class="chat-conv-name">${escHtml(u.name||'')}</div>
                  <div class="chat-conv-preview" style="font-style:italic;opacity:.7;">Merhaba de 👋</div>
                </div>
                <div class="chat-conv-meta">
                  <div style="font-size:.55rem;color:var(--accent2);">Yeni</div>
                </div>
              </div>`;
            });
          }
          if(!html)html='<div class="chat-empty-state">Henüz kimse yok</div>';
          const el=document.getElementById('chatConvList');
          if(el)el.innerHTML=html;
          const tb=document.getElementById('chatUnreadTotal');
          if(tb){if(totalUnread>0){tb.style.display='';tb.textContent=totalUnread+' yeni';}else tb.style.display='none';}
          updateChatNavBadge(totalUnread);
        });
      }).catch(err=>console.warn('friends fetch err',err));
    },err=>{
      console.warn('conv list err',err);
      // Index hatası olabilir — sadece arkadaşları göster
      db.collection('users').doc(uid).get().then(myDoc=>{
        const myFriends=myDoc.data()?.friends||[];
        if(!myFriends.length){
          const el=document.getElementById('chatConvList');
          if(el)el.innerHTML='<div class="chat-empty-state">Henüz arkadaşın yok</div>';
          return;
        }
        Promise.all(myFriends.map(f=>db.collection('users').doc(f).get())).then(docs=>{
          let html='';
          docs.forEach(d=>{
            if(!d.exists)return;
            const u=d.data();
            const avatarHtml=u.avatarThumb?`<img src="${u.avatarThumb}">`:`<span>${(u.name||'?').slice(0,2).toUpperCase()}</span>`;
            html+=`<div class="chat-conv-item" onclick="openChat('${d.id}')">
              <div class="chat-conv-avatar">${avatarHtml}</div>
              <div class="chat-conv-info"><div class="chat-conv-name">${escHtml(u.name||'')}</div><div class="chat-conv-preview" style="font-style:italic;opacity:.7;">Merhaba de 👋</div></div>
            </div>`;
          });
          const el=document.getElementById('chatConvList');
          if(el)el.innerHTML=html||'<div class="chat-empty-state">Henüz kimse yok</div>';
        });
      });
    });
}

function updateChatNavBadge(count){
  const btn=document.querySelector('.nav-center-fab');
  if(!btn)return;
  let badge=btn.querySelector('.chat-nav-badge');
  if(count>0){
    btn.classList.add('has-msg');
    if(!badge){badge=document.createElement('div');badge.className='chat-nav-badge';btn.appendChild(badge);}
    badge.textContent=count>9?'9+':count;
    badge.style.cssText='position:absolute;top:-5px;right:-5px;background:var(--hard);color:#fff;font-size:.48rem;font-family:JetBrains Mono,monospace;border-radius:9px;padding:2px 5px;border:2px solid var(--bg);min-width:18px;text-align:center;font-weight:600;';
  } else {
    btn.classList.remove('has-msg');
    if(badge)badge.remove();
  }
}

function openChat(otherUid){
  activeChatUid=otherUid;
  // Aktif konuşmayı göster
  document.getElementById('chatListPanel').style.display='none';
  const panel=document.getElementById('chatActivePanel');
  panel.style.display='flex';
  // Karşı kullanıcının profilini çek
  db.collection('users').doc(otherUid).get().then(doc=>{
    const u=doc.exists?doc.data():{name:'Kullanıcı',avatarThumb:''};
    const avatarHtml=u.avatarThumb
      ?`<img src="${u.avatarThumb}" style="width:100%;height:100%;object-fit:cover;border-radius:50%;">`
      :`<span style="font-size:.65rem;font-weight:600;">${(u.name||'?').slice(0,2).toUpperCase()}</span>`;
    document.getElementById('chatActiveHeader').innerHTML=`
      <button class="chat-back-btn" onclick="closeChatActive()">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" style="width:18px;height:18px;"><polyline points="15 18 9 12 15 6"/></svg>
      </button>
      <div style="width:36px;height:36px;border-radius:50%;overflow:hidden;background:linear-gradient(135deg,var(--accent),var(--diary));display:flex;align-items:center;justify-content:center;flex-shrink:0;">${avatarHtml}</div>
      <div>
        <div class="chat-active-name">${escHtml(u.name||'')}</div>
        <div class="chat-active-status">● Çevrimiçi</div>
      </div>
    `;
    // Okunmadı sayacını sıfırla
    const cid=convId(currentUser.uid,otherUid);
    db.collection('conversations').doc(cid).update({
      [`unreadCount.${currentUser.uid}`]:0
    }).catch(()=>{});
    // Mesajları dinle
    listenMessages(cid,u);
  });
  // Listeyi güncelle
  loadConversations();
}

function closeChatActive(){
  activeChatUid=null;
  if(activeChatUnsub){activeChatUnsub();activeChatUnsub=null;}
  document.getElementById('chatActivePanel').style.display='none';
  document.getElementById('chatListPanel').style.display='flex';
}

function listenMessages(cid,otherUser){
  if(activeChatUnsub){activeChatUnsub();activeChatUnsub=null;}
  const msgs=document.getElementById('chatMessages');
  msgs.innerHTML='<div style="text-align:center;padding:20px;color:var(--text3);font-size:.68rem;">Yükleniyor...</div>';
  activeChatUnsub=db.collection('conversations').doc(cid)
    .collection('messages').orderBy('sentAt','asc')
    .onSnapshot(snap=>{
      if(snap.empty){msgs.innerHTML='<div style="text-align:center;padding:30px 20px;color:var(--text3);font-size:.72rem;">Henüz mesaj yok.<br>Merhaba de! 👋</div>';return;}
      let html='';
      let lastDate='';
      snap.docs.forEach(doc=>{
        const m=doc.data();
        const isMine=m.senderId===currentUser.uid;
        const d=m.sentAt?.toDate?m.sentAt.toDate():new Date(m.sentAt||Date.now());
        const dateStr=d.toLocaleDateString('tr-TR',{day:'numeric',month:'long'});
        if(dateStr!==lastDate){
          html+=`<div class="chat-date-divider">${dateStr}</div>`;
          lastDate=dateStr;
        }
        const timeStr=d.toLocaleTimeString('tr-TR',{hour:'2-digit',minute:'2-digit'});
        const avatarHtml=!isMine?(otherUser.avatarThumb
          ?`<div class="chat-msg-avatar"><img src="${otherUser.avatarThumb}"></div>`
          :`<div class="chat-msg-avatar">${(otherUser.name||'?').slice(0,2).toUpperCase()}</div>`):'';
        html+=`<div class="chat-msg-row${isMine?' mine':''}">
          ${avatarHtml}
          <div>
            <div class="chat-bubble ${isMine?'mine':'theirs'}">${escHtml(m.text||'')}<div class="chat-bubble-time">${timeStr}</div></div>
          </div>
        </div>`;
      });
      msgs.innerHTML=html;
      msgs.scrollTop=msgs.scrollHeight;
    },err=>console.warn('msg err',err));
}

function sendMessage(){
  const inp=document.getElementById('chatInput');
  const text=inp.value.trim();
  if(!text||!activeChatUid||!currentUser)return;
  inp.value='';
  inp.style.height='auto';
  const cid=convId(currentUser.uid,activeChatUid);
  const now=firebase.firestore.FieldValue.serverTimestamp();
  const msgRef=db.collection('conversations').doc(cid).collection('messages').doc();
  const batch=db.batch();
  batch.set(msgRef,{text,senderId:currentUser.uid,sentAt:now});
  batch.set(db.collection('conversations').doc(cid),{
    members:[currentUser.uid,activeChatUid],
    lastMsg:text,lastMsgAt:now,lastSenderId:currentUser.uid,
    [`unreadCount.${activeChatUid}`]:firebase.firestore.FieldValue.increment(1),
    [`unreadCount.${currentUser.uid}`]:0
  },{merge:true});
  batch.commit().catch(console.warn);
}

function startChatWith(otherUid){
  // Arkadaş profilinden veya listesinden çağrılır
  closeModal('friendProfileModal');
  closeModal('friendsModal');
  switchPage('chat');
  setTimeout(()=>openChat(otherUid),300);
}

function fmtChatTime(d){
  if(!d)return'';
  const now=new Date();
  const diff=now-d;
  if(diff<60000)return'Şimdi';
  if(diff<3600000)return Math.floor(diff/60000)+'dk';
  if(diff<86400000)return d.toLocaleTimeString('tr-TR',{hour:'2-digit',minute:'2-digit'});
  return d.toLocaleDateString('tr-TR',{day:'numeric',month:'short'});
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
  D.schedule.push({id:Date.now(),name,room:document.getElementById('scheduleRoomInput').value.trim(),start:document.getElementById('scheduleStartInput').value,end:document.getElementById('scheduleEndInput').value,days,color:schedColor,createdAt:new Date().toISOString()});
  saveData();closeModal('scheduleAddModal');renderSchedule();showToast('Ders eklendi');
}
function deleteScheduleItem(id){D.schedule=D.schedule.filter(s=>s.id!==id);saveData();renderSchedule();}
function renderSchedule(){
  const dayNames=['Pazar','Pazartesi','Salı','Çarşamba','Perşembe','Cuma','Cumartesi'];
  const orderedDays=[1,2,3,4,5,6,0];
  let html='';
  orderedDays.forEach(dayIdx=>{
    const lessons=D.schedule.filter(s=>s.days.includes(dayIdx)).sort((a,b)=>a.start.localeCompare(b.start));
    const hasClass=lessons.length>0;
    html+=`<div class="sched-day-block"><div class="sched-day-header${hasClass?' has-class':''}">${dayNames[dayIdx]}</div>`;
    if(lessons.length){
      lessons.forEach(l=>{
        html+=`<div class="sched-lesson"><div class="sched-color-bar" style="background:${l.color}"></div><div style="flex:1"><div class="sched-lesson-name">${escHtml(l.name)}</div>${l.room?`<div class="sched-lesson-room">${escHtml(l.room)}</div>`:''}</div><div class="sched-lesson-time">${l.start||''}${l.start&&l.end?' – ':''}${l.end||''}</div><button class="sched-delete-btn" onclick="deleteScheduleItem(${l.id})">✕</button></div>`;
      });
    } else {
      html+=`<div style="padding:8px 12px;font-size:.68rem;color:var(--text3);font-style:italic;">Ders yok</div>`;
    }
    html+='</div>';
  });
  document.getElementById('scheduleDays').innerHTML=html||'<div class="empty-state">Ders programı boş.<br>Üstten ders ekle.</div>';
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
  const typeLabels={exam:'📝 Sınav',hw:'📚 Ödev',project:'🔬 Proje'};
  const sorted=[...D.exams].sort((a,b)=>{if(!a.date)return 1;if(!b.date)return -1;return a.date.localeCompare(b.date);});
  const upcoming=sorted.filter(e=>{if(!e.date)return true;const d=new Date(e.date);d.setHours(0,0,0,0);return d>=today;});
  const past=sorted.filter(e=>{if(!e.date)return false;const d=new Date(e.date);d.setHours(0,0,0,0);return d<today;});
  function examCard(e){
    let cls='',badge='',diff=null;
    if(e.date){const d=new Date(e.date);d.setHours(0,0,0,0);diff=Math.round((d-today)/(86400000));if(diff<0){cls='overdue';badge=`<span class="exam-countdown overdue">${Math.abs(diff)} gün geçti</span>`;}else if(diff===0){cls='today';badge=`<span class="exam-countdown today">Bugün!</span>`;}else if(diff<=7){badge=`<span class="exam-countdown soon">${diff} gün kaldı</span>`;}else{badge=`<span class="exam-countdown later">${diff} gün kaldı</span>`;}}
    return`<div class="exam-item ${cls}"><div>${badge}</div><div style="flex:1;min-width:0;"><div class="exam-name">${escHtml(e.name)}</div><div class="exam-meta"><span class="exam-type-badge">${typeLabels[e.type]||'📝'}</span>${e.date?fmtDate(e.date):'Tarih yok'}${e.time?' · '+e.time:''}${e.note?` · ${escHtml(e.note)}`:''}</div></div><button class="exam-delete-btn" onclick="deleteExamItem(${e.id})">✕</button></div>`;
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
  ov.innerHTML=`<div class="notebook-detail-header"><button onclick="this.closest('.notebook-detail-overlay').remove()" style="background:none;border:none;color:var(--text2);font-size:1.1rem;cursor:pointer;padding:2px 6px;">←</button><div style="flex:1"><div style="font-size:.82rem;font-weight:500;color:var(--text);">${escHtml(item.title)}</div>${item.course?`<div style="font-size:.6rem;font-family:'JetBrains Mono',monospace;color:var(--text3);margin-top:1px;">${escHtml(item.course)}</div>`:''}</div><button onclick="deleteNotebookItem(${id});this.closest('.notebook-detail-overlay').remove();" style="background:none;border:none;color:var(--text3);font-size:.72rem;cursor:pointer;padding:4px 8px;">Sil</button></div><div class="notebook-detail-body">${escHtml(item.content)||'<em style="color:var(--text3)">İçerik yok</em>'}</div>`;
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
function exportData(){const d=JSON.parse(JSON.stringify(D));delete d.profile.avatar;const blob=new Blob([JSON.stringify(d,null,2)],{type:'application/json'});const a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download=`capsula_yedek_${new Date().toISOString().split('T')[0]}.json`;a.click();showToast('Dışa aktarıldı 📁');}
function requestNotif(){if('Notification' in window)Notification.requestPermission().then(p=>showToast(p==='granted'?'Bildirimler aktif ✓':'İzin reddedildi'));else showToast('Tarayıcı desteklemiyor');}
function renderPro(){
  const tk=new Date().toISOString().split('T')[0];
  const items=D.todos.filter(t=>!t.dueDate||t.dueDate===tk);
  const clr={easy:'var(--easy)',mid:'var(--mid)',hard:'var(--hard)'};
  document.getElementById('proTodayList').innerHTML=items.length?items.map(t=>`<div class="dash-todo-row"><div class="dash-todo-dot" style="background:${clr[t.priority]}"></div><div class="dash-todo-text">${escHtml(t.text)}</div></div>`).join(''):'<div class="empty-state" style="padding:20px 0">Bugün için görev yok.</div>';
}

// ─────────────────────────── TEMPLATES ────────────────────────────────────
const TEMPLATES={
  meeting:{title:'Toplantı Notu',content:`📅 Tarih: ${new Date().toLocaleDateString('tr-TR')}\n👥 Katılımcılar:\n\n📌 Gündem:\n1. \n2. \n\n✅ Alınan Kararlar:\n-\n\n🔜 Sonraki Adımlar:\n-`,tags:['toplantı']},
  book:{title:'Kitap: ',content:`📖 Yazar:\n⭐ Puan: /5\n\n💡 Ana Fikir:\n\n📝 Önemli Alıntılar:\n"..."\n\n🎯 Öğrendiklerim:\n-\n\n🔑 Uygulayacaklarım:\n-`,tags:['kitap']},
  daily:{title:`Günlük Plan — ${new Date().toLocaleDateString('tr-TR',{weekday:'long'})}`,content:`🌅 Sabah:\n□ \n□ \n\n☀️ Öğle:\n□ \n□ \n\n🌙 Akşam:\n□ \n□ \n\n💬 Bugünün niyeti:\n`,tags:['plan']},
  idea:{title:'Fikir: ',content:`❓ Problem:\n\n💡 Çözüm:\n\n✅ Avantajlar:\n-\n\n⚠️ Riskler:\n-\n\n🛠 Sonraki adım:\n`,tags:['fikir']},
  travel:{title:'Seyahat: ',content:`✈️ Tarihler:\n📍 Konaklama:\n\n🗺 Gidilecek Yerler:\n□ \n□ \n\n🍽 Denenmesi Gerekenler:\n-`,tags:['seyahat']},
  goal:{title:'Hedef: ',content:`🎯 Hedef:\n\n🤔 Neden önemli?\n\n📅 Tamamlanma tarihi:\n\n🛤 Adımlar:\n1. \n2. \n3. `,tags:['hedef']},
  lecture:{title:'Ders: ',content:`🎓 Ders:\n📅 Tarih:\n\n📌 Konular:\n-\n\n📝 Notlar:\n\n❓ Sorular:\n-\n\n🧮 Formüller:\n`,tags:['ders']},
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
  {selector:'.mode-pill',title:'3 Farklı Mod',desc:'Üstteki pill\'den Profesyonel, Ana Ekran veya Öğrenci modunu seç. Her mod farklı araçlar sunar.',side:'bottom',round:false},
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
    const a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download=`capsula_yedek_${new Date().toISOString().split('T')[0]}.json`;a.click();
  } else {
    let txt=`CAPSULA YEDEĞİ — ${new Date().toLocaleDateString('tr-TR',{weekday:'long',year:'numeric',month:'long',day:'numeric'})}\n${'='.repeat(60)}\n\n`;
    if(D.notes.length){txt+=`NOTLAR (${D.notes.length})\n${'-'.repeat(40)}\n`;D.notes.forEach(n=>{txt+=`\n📝 ${n.title}\nEtiket: ${(n.tags||[]).join(', ')||'—'}\nTarih: ${fmtDate(n.createdAt)}\n\n${n.content||''}\n\n${'·'.repeat(30)}\n`;});}
    if(D.diary.length){txt+=`\nGÜNLÜK GİRİŞLERİ (${D.diary.length})\n${'-'.repeat(40)}\n`;D.diary.forEach(e=>{txt+=`\n${e.mood||'📖'} ${e.title}\nTarih: ${fmtDate(e.createdAt)}\n\n${e.content||''}\n\n${'·'.repeat(30)}\n`;});}
    if(D.todos.length){txt+=`\nAKTİF GÖREVLER (${D.todos.length})\n${'-'.repeat(40)}\n`;D.todos.forEach(t=>txt+=`• [${t.priority.toUpperCase()}] ${t.text}${t.dueDate?' ('+t.dueDate+')':''}\n`);}
    const blob=new Blob([txt],{type:'text/plain;charset=utf-8'});
    const a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download=`capsula_notlar_${new Date().toISOString().split('T')[0]}.txt`;a.click();
  }
  localStorage.setItem('capsula_last_backup',new Date().toISOString());
  updateLastBackupUI();showToast('Dışa aktarıldı 📁');
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
      showConfirm(`Yedek geri yüklenecek — mevcut veriler silinecek.\n\nYedek tarihi: ${tarih}\n\nEmin misin?`,()=>{
        const profile=D.profile;Object.assign(D,data);
        if(!D.profile)D.profile=profile;
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
  if(Notification.permission==='granted')startReminderInterval();
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
  if(Notification.permission!=='granted')return;
  const now=new Date();if(now.getHours()!==9)return;
  const todayKey=now.toISOString().split('T')[0];
  if(localStorage.getItem('capsula_notif_fired')===todayKey)return;
  const todayTodos=D.todos.filter(t=>t.dueDate===todayKey);
  const overdue=D.todos.filter(t=>{if(!t.dueDate)return false;const d=new Date(t.dueDate);d.setHours(0,0,0,0);return d<new Date().setHours(0,0,0,0);});
  if(todayTodos.length||overdue.length){
    let body='';
    if(todayTodos.length)body+=`Bugün: ${todayTodos.length} görev. `;
    if(overdue.length)body+=`Gecikmiş: ${overdue.length} görev.`;
    new Notification('Capsula 📋',{body:body.trim()});
    localStorage.setItem('capsula_notif_fired',todayKey);
  }
}

function openReminderModal(){
  if(document.getElementById('drawer').classList.contains('open'))toggleDrawer();
  const reminders=getReminders();
  const labels={overdue:'Gecikmiş',today:'Bugün',soon:'Yakında'};
  let html='';
  if(!reminders.length){
    html=`<div style="text-align:center;padding:20px 0;color:var(--text3);font-size:.76rem;">🎉 Gecikmiş ya da yaklaşan görev yok.</div>`;
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
window.addEventListener('load',()=>{
  initTheme();
  // Auth state değişince initApp çağrılıyor, burada sadece splash ve seed data
  const isFirstVisit=!localStorage.getItem('capsula_toured')&&!localStorage.getItem('capsula_visited');
  localStorage.setItem('capsula_visited','1');

  // Auth state onAuthStateChanged hallediyor

  // Seed demo data
  if(!D.todos.length&&!D.notes.length&&!D.diary.length){
    const tmr=new Date();tmr.setDate(tmr.getDate()+1);
    const nw=new Date();nw.setDate(nw.getDate()+7);
    D.todos=[
      {id:1,text:"Capsula'ya hoş geldin! Bu görevi tamamla ✓",priority:'easy',dueDate:null,createdAt:new Date().toISOString()},
      {id:2,text:"Profesyonel mod'u dene — Kanban ve Haftalık Özet",priority:'mid',dueDate:tmr.toISOString().split('T')[0],createdAt:new Date().toISOString()},
      {id:3,text:"Arkadaş ekle — Drawer'dan Arkadaşlar'a tıkla",priority:'hard',dueDate:nw.toISOString().split('T')[0],createdAt:new Date().toISOString()},
    ];
    D.notes=[{id:101,title:'Capsula Rehberi',content:"Artık hesabın var! Verilerein buluta senkronize ediliyor.\n\nArkadaşlarını eklemek için sol üstteki ≡ → Arkadaşlar",media:[],tags:['rehber'],createdAt:new Date().toISOString()}];
    D.diary=[{id:201,title:'Capsula açıldı',content:'Firebase ile bulut senkronizasyonu aktif! 🚀',mood:'💫',media:[],tags:[],createdAt:new Date().toISOString()}];
    saveData();
  }

  // saveProfile'ı Firestore'a da kaydetmesi için güncelle
  const origSave=window.saveProfile;
  window.saveProfile=function(){
    D.profile.name=document.getElementById('profileName').value.trim()||'Kullanıcı';
    D.profile.email=document.getElementById('profileEmail').value.trim()||'';
    D.profile.bio=document.getElementById('profileBio')?.value.trim()||'';
    D.profile.motto=document.getElementById('profileMotto')?.value.trim()||'';
    D.profile.goal=document.getElementById('profileGoal')?.value.trim()||'';
    saveData();saveProfileToFirestore();updateProfileUI();closeModal('profileModal');showToast('Profil güncellendi ✦');
  };

  runSplash(()=>{
    if(!auth){
      // Firebase yüklenemedi — offline mod, direkt uygulamaya gir
      initApp();
      return;
    }
    if(currentUser){
      const hasPIN=localStorage.getItem('capsula_pin');
      if(hasPIN)document.getElementById('pinScreen').style.display='flex';
      else if(isFirstVisit)setTimeout(showWelcomeCard,500);
    } else {
      let authResolved=false;
      const unsub=auth.onAuthStateChanged(u=>{
        if(authResolved)return;
        authResolved=true;
        unsub();
        if(!u)showAuthScreen();
      });
      setTimeout(()=>{
        if(!authResolved){authResolved=true;showAuthScreen();}
      },4000);
    }
  });
});


</script>
</body>
</html>
