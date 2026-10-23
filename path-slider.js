/* Path 1 / Path 2 slider: same .seg tablist markup and look as /compare/. Scoped per tablist; arrow, Home, End keys. */
(function(){
var css='.seg{display:flex;gap:4px;background:#E2E8F0;border-radius:var(--r,12px);padding:4px;max-width:480px;margin:0 auto 1rem}.seg button,.seg a{flex:1;min-height:44px;border:0;border-radius:10px;background:transparent;color:var(--ink,#0f172a);font:500 1rem Inter,sans-serif;cursor:pointer;text-align:center;text-decoration:none;display:flex;align-items:center;justify-content:center}.seg [aria-selected=true]{background:var(--accent,#2563eb);color:#fff}.seg [role=tab]:focus-visible{outline:3px solid #0f172a;outline-offset:2px}';
if(!document.getElementById('seg-css')){var s=document.createElement('style');s.id='seg-css';s.textContent=css;document.head.appendChild(s);}
function init(root){(root||document).querySelectorAll('.seg[role=tablist]:not([data-ready])').forEach(function(l){l.setAttribute('data-ready','1');
var tabs=[].slice.call(l.querySelectorAll('[role=tab]'));
function show(id){tabs.forEach(function(t){var on=t.getAttribute('aria-controls')==id;t.setAttribute('aria-selected',on);t.tabIndex=on?0:-1;var p=document.getElementById(t.getAttribute('aria-controls'));if(p)p.hidden=!on;});}
tabs.forEach(function(t,i){t.onclick=function(e){e.preventDefault();show(t.getAttribute('aria-controls'));};
t.onkeydown=function(e){var n=null;if(e.key=='ArrowRight')n=tabs[(i+1)%tabs.length];else if(e.key=='ArrowLeft')n=tabs[(i+tabs.length-1)%tabs.length];else if(e.key=='Home')n=tabs[0];else if(e.key=='End')n=tabs[tabs.length-1];if(n){e.preventDefault();n.focus();n.click();}};});
var pre=/[?&]path=(monthly|2)/.test(location.search)?1:0;show(tabs[l.dataset.start=='2'?1:pre].getAttribute('aria-controls'));});}
window.PathSlider={init:init};if(document.readyState!='loading')init();else document.addEventListener('DOMContentLoaded',function(){init()});
})();
