/* Pagina di presentazione di una lezione accessibile: altezza del menu e indice che segue la lettura.
   Fonte unica dal 06/11/2026 (prima copiato in ogni pagina). */
(function(){
function fit(){var h=document.querySelector('#site-menu .header');var mh=h?h.offsetHeight:72;
document.documentElement.style.setProperty('--menu-h',mh+'px')}
fit();window.addEventListener('resize',fit);setTimeout(fit,300);
var links=[].slice.call(document.querySelectorAll('.sp-toc a'));
var secs=links.map(function(a){return document.getElementById(a.getAttribute('href').slice(1))});
function spy(){var y=window.scrollY+(parseInt(getComputedStyle(document.documentElement).getPropertyValue('--menu-h'))||72)+60,cur=secs[0];secs.forEach(function(s){if(s&&s.offsetTop<=y)cur=s});
links.forEach(function(a){a.getAttribute('href')==='#'+cur.id?a.setAttribute('aria-current','true'):a.removeAttribute('aria-current')})}
window.addEventListener('scroll',spy,{passive:true});spy();
})();
