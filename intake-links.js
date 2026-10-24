/* Send Stripe checkout clicks through /start/ (intake before checkout). */
document.addEventListener("click",function(e){var a=e.target.closest&&e.target.closest('a[href^="https://buy.stripe.com/"]');if(!a||e.ctrlKey||e.metaKey||e.shiftKey)return;
var row=a.closest("tr,li,.card,article,section"),h=row&&row.querySelector("b,strong,h3,h2"),item=(a.getAttribute("data-item")||(h?h.textContent:a.textContent)).replace(/\s+/g," ").trim().slice(0,120);
e.preventDefault();location.href="/start/?go="+encodeURIComponent(a.href)+"&item="+encodeURIComponent(item);});
