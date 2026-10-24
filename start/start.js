(function(){
var q=new URLSearchParams(location.search),go=q.get("go")||"",item=(q.get("item")||"").slice(0,120),t0=Date.now();
if(!/^https:\/\/buy\.stripe\.com\/[A-Za-z0-9_]+$/.test(go))go="";
var f=document.getElementById("st"),msg=document.getElementById("st-msg"),btn=document.getElementById("st-go"),skip=document.getElementById("st-skip");
if(item){var it=document.getElementById("st-item");it.textContent="You picked: "+item;it.hidden=false;}
if(!go){btn.textContent="Send";skip.parentNode.hidden=true;}
skip.onclick=function(e){e.preventDefault();if(go)location.href=go;};
function done(){if(go){msg.textContent="Thanks! Taking you to checkout…";setTimeout(function(){location.href=go;},900);}else msg.textContent="Thanks! You'll get your free mockup within 24 hours.";}
f.addEventListener("submit",function(e){e.preventDefault();
 var bad=[].filter.call(f.querySelectorAll("[required]"),function(x){return !x.value.trim()||(x.type=="email"&&!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(x.value));});
 if(bad.length){msg.textContent="Please fill in: "+bad.map(function(x){return f.querySelector('label[for="'+x.id+'"]').textContent.replace(" *","");}).join(", ");bad[0].focus();return;}
 var fields={};[].forEach.call(f.querySelectorAll("input[name],select[name],textarea[name]"),function(x){if(x.name!="website_url_confirm"&&x.value.trim())fields[x.name]=x.value.trim();});
 var body={fields:fields,item:item,go:go,t0:t0,website_url_confirm:document.getElementById("f-hp").value};
 btn.disabled=true;msg.textContent="Sending…";
 var file=document.getElementById("f-lg").files[0];
 function send(){fetch("https://api.ttawebdev.com/intake",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(body)}).then(function(r){return r.json();}).then(function(j){if(j.ok)done();else{btn.disabled=false;msg.textContent="Something went wrong. Please email tta.dev.web@gmail.com or call 720-477-8603.";}}).catch(function(){btn.disabled=false;msg.textContent="Could not send. Please email tta.dev.web@gmail.com or call 720-477-8603.";});}
 if(file&&file.size<2000000){var rd=new FileReader();rd.onload=function(){body.logo={name:file.name,type:file.type,data:String(rd.result).split(",")[1]};send();};rd.readAsDataURL(file);}else{if(file)msg.textContent="Logo too large; sending without it…";send();}
});
})();
