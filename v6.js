(function(){
'use strict';
var $=function(s,c){return (c||document).querySelector(s)},$$=function(s,c){return Array.prototype.slice.call((c||document).querySelectorAll(s))};
var TEL='2250707727292',MAIL='info@silverplate-services.com';
var reduce=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
function icon(n,c){return '<svg class="'+(c||'ic sm')+'" aria-hidden="true"><use href="#i-'+n+'"/></svg>'}

/* en-tête */
var top=$('#top'),dock=$('.dock'),totop=$('#totop'),lastY=0;
function onScroll(){var y=window.scrollY;top.classList.toggle('solid',y>60);
 top.classList.toggle('hide',y>600&&y>lastY+4&&!document.body.classList.contains('lock'));if(y<lastY-4)top.classList.remove('hide');lastY=y;
 totop.classList.toggle('show',y>900);if(dock)dock.classList.toggle('show',y>500);}
window.addEventListener('scroll',onScroll,{passive:true});onScroll();
totop.addEventListener('click',function(){window.scrollTo({top:0,behavior:reduce?'auto':'smooth'})});

/* menu mobile */
var drawer=$('#drawer'),burger=$('#burger');
function drawerSet(o){drawer.classList.toggle('open',o);drawer.setAttribute('aria-hidden',!o);burger.setAttribute('aria-expanded',o);document.body.classList.toggle('lock',o)}
burger.addEventListener('click',function(){drawerSet(true)});$('#drawerX').addEventListener('click',function(){drawerSet(false)});
$$('#drawer nav a').forEach(function(a){a.addEventListener('click',function(){drawerSet(false)})});

/* rubrique active dans le menu */
var secs=['agence','services','realisations','ligue-foot-7','contact'].map(function(id){return document.getElementById(id)});
var links=$$('#menu a');
if('IntersectionObserver' in window){var so=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){links.forEach(function(a){a.classList.toggle('on',a.getAttribute('href')==='#'+e.target.id)})}})},{rootMargin:'-45% 0px -50% 0px'});secs.forEach(function(s){s&&so.observe(s)})}

/* ouverture en diaporama */
var slides=$$('.slide'),txts=$$('.htxt'),dots=$('#dots'),cap=$('#capTxt'),cur=0,timer;
slides.forEach(function(_,i){var d=document.createElement('i');d.addEventListener('click',function(){go(i)});dots.appendChild(d)});
function go(i){cur=(i+slides.length)%slides.length;slides.forEach(function(s,k){s.classList.toggle('on',k===cur)});txts.forEach(function(t,k){t.classList.toggle('on',k===cur)});
 $$('i',dots).forEach(function(d,k){d.classList.remove('on');if(k===cur){void d.offsetWidth;d.classList.add('on')}});cap.textContent=txts[cur].getAttribute('data-cap');
 clearTimeout(timer);timer=setTimeout(function(){go(cur+1)},6000)}
$('#hPrev').addEventListener('click',function(){go(cur-1)});$('#hNext').addEventListener('click',function(){go(cur+1)});
slides.slice(1).forEach(function(s){var u=s.style.backgroundImage.slice(5,-2);var im=new Image();im.src=u});
go(0);
var hero=$('.hero'),tx=0;hero.addEventListener('touchstart',function(e){tx=e.touches[0].clientX},{passive:true});
hero.addEventListener('touchend',function(e){var d=e.changedTouches[0].clientX-tx;if(Math.abs(d)>50)go(cur+(d<0?1:-1))});

/* révélation et compteurs */
function count(el){var to=+el.getAttribute('data-to');if(el.hasAttribute('data-plain')){el.textContent=to;return}
 if(reduce){el.textContent=to;return}var t0=null,dur=1800;function f(t){if(!t0)t0=t;var p=Math.min((t-t0)/dur,1);el.textContent=Math.round(to*(1-Math.pow(1-p,3)));if(p<1)requestAnimationFrame(f)}requestAnimationFrame(f)}
if('IntersectionObserver' in window){
 var ro=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){e.target.classList.add('in');ro.unobserve(e.target)}})},{threshold:.12,rootMargin:'0px 0px -40px 0px'});
 $$('.rv').forEach(function(el){ro.observe(el)});
 var co=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){count(e.target);co.unobserve(e.target)}})},{threshold:.5});
 $$('.count').forEach(function(el){co.observe(el)});
}else{$$('.rv').forEach(function(el){el.classList.add('in')});$$('.count').forEach(count)}

/* vidéo */
var promo=$('#promo'),vcard=$('#videoCard');
$('#playBtn').addEventListener('click',function(){vcard.classList.add('playing');promo.play()});
promo.addEventListener('play',function(){vcard.classList.add('playing')});

/* services */
var modal=$('#svcModal'),lastFocus=null,SV=window.SVC||{},keys=Object.keys(SV);
function openSvc(id){var s=SV[id];if(!s)return;lastFocus=document.activeElement;
 $('#svcT').textContent=s.t;$('#svcP').textContent=s.txt;$('#svcIc').innerHTML=icon(s.ic,'ic');
 $('#svcL').innerHTML=s.pts.map(function(p){return '<li>'+p+'</li>'}).join('');
 $('#svcMedia').innerHTML=s.img==='vid'?'<video src="vid/production-1.mp4" poster="vid/production-1.jpg" autoplay muted loop playsinline></video>':'<img src="'+s.img+'" alt="'+s.t+'">';
 $('#svcTabs').innerHTML=keys.map(function(k){return '<button type="button" data-k="'+k+'" class="'+(k===id?'on':'')+'">'+SV[k].t+'</button>'}).join('');
 modal.hidden=false;document.body.classList.add('lock');$('.modal-x',modal).focus()}
function closeSvc(){modal.hidden=true;$('#svcMedia').innerHTML='';document.body.classList.remove('lock');lastFocus&&lastFocus.focus()}
$$('[data-svc]').forEach(function(b){b.addEventListener('click',function(){openSvc(b.getAttribute('data-svc'))})});
$$('[data-open]').forEach(function(a){a.addEventListener('click',function(e){e.preventDefault();openSvc(a.getAttribute('data-open'))})});
$$('[data-close]',modal).forEach(function(b){b.addEventListener('click',closeSvc)});
$('#svcTabs').addEventListener('click',function(e){var b=e.target.closest('button');b&&openSvc(b.getAttribute('data-k'))});

/* réalisations : filtres et chargement progressif */
var cards=$$('.ev'),fbtn=$$('.filters button'),more=$('#loadMore'),step=window.innerWidth<640?8:12,shown=step,filt='tout';
function lay(){var vis=cards.filter(function(c){return filt==='tout'||c.getAttribute('data-c').split(' ').indexOf(filt)>-1});
 cards.forEach(function(c){c.classList.add('off')});vis.forEach(function(c,i){if(i<shown){c.classList.remove('off');c.classList.add('in')}});
 $('#evCount').textContent=vis.length;more.parentNode.hidden=shown>=vis.length}
fbtn.forEach(function(b){b.addEventListener('click',function(){fbtn.forEach(function(x){x.classList.remove('on');x.setAttribute('aria-selected','false')});b.classList.add('on');b.setAttribute('aria-selected','true');filt=b.getAttribute('data-f');shown=step;lay()})});
more.addEventListener('click',function(){shown+=step;lay()});
lay();
$('#lf7Go').addEventListener('click',function(){filt='lf7';fbtn.forEach(function(x){x.classList.remove('on')});
 cards.forEach(function(c){var i=c.getAttribute('data-i');c.classList.toggle('off',i!=='2972'&&i!=='1942')});$('#evCount').textContent='2';more.parentNode.hidden=true;
 document.getElementById('realisations').scrollIntoView({behavior:reduce?'auto':'smooth'})});

/* visionneuse */
var lb=$('#lb'),lbI=$('#lbImg'),lbC=$('#lbCap'),lbN=$('#lbC'),li=0,list=[];
function lbShow(i){li=(i+list.length)%list.length;var c=list[li],im=$('img',c);lbI.src=im.getAttribute('data-full');lbI.alt=im.alt;
 lbC.innerHTML='<small>'+$('.ev-tag',c).textContent+'</small>'+$('b',c).textContent+($('i',c)?', '+$('i',c).textContent:'');lbN.textContent=(li+1)+' / '+list.length}
function lbOpen(c){list=cards.filter(function(x){return !x.classList.contains('off')});lastFocus=c;lbShow(list.indexOf(c));lb.hidden=false;document.body.classList.add('lock');$('#lbX').focus()}
function lbClose(){lb.hidden=true;lbI.src='';document.body.classList.remove('lock');lastFocus&&lastFocus.focus()}
cards.forEach(function(c){c.addEventListener('click',function(){lbOpen(c)});c.addEventListener('keydown',function(e){if(e.key==='Enter'||e.key===' '){e.preventDefault();lbOpen(c)}})});
$('#lbX').addEventListener('click',lbClose);$('#lbP').addEventListener('click',function(){lbShow(li-1)});$('#lbN').addEventListener('click',function(){lbShow(li+1)});
lb.addEventListener('click',function(e){if(e.target===lb)lbClose()});
var lx=0;lb.addEventListener('touchstart',function(e){lx=e.touches[0].clientX},{passive:true});lb.addEventListener('touchend',function(e){var d=e.changedTouches[0].clientX-lx;if(Math.abs(d)>50)lbShow(li+(d<0?1:-1))});
document.addEventListener('keydown',function(e){if(!lb.hidden){if(e.key==='Escape')lbClose();if(e.key==='ArrowLeft')lbShow(li-1);if(e.key==='ArrowRight')lbShow(li+1)}
 else if(!modal.hidden&&e.key==='Escape')closeSvc();else if(drawer.classList.contains('open')&&e.key==='Escape')drawerSet(false)});

/* stands : défilement */
var rail=$('#stRail');function railBy(d){rail.scrollBy({left:d*(rail.firstElementChild.offsetWidth+20),behavior:'smooth'})}
$('#stPrev').addEventListener('click',function(){railBy(-1)});$('#stNext').addEventListener('click',function(){railBy(1)});
var drag=false,sx=0,sl=0;rail.addEventListener('mousedown',function(e){drag=true;sx=e.pageX;sl=rail.scrollLeft;rail.style.scrollSnapType='none'});
window.addEventListener('mouseup',function(){if(drag){drag=false;rail.style.scrollSnapType=''}});rail.addEventListener('mousemove',function(e){if(drag){e.preventDefault();rail.scrollLeft=sl-(e.pageX-sx)}});

/* logos : sur écran tactile, un logo prend ses couleurs à tour de rôle */
if(window.matchMedia('(hover: none)').matches){var lg=$$('.logo'),lk=0;setInterval(function(){lg.forEach(function(l){l.classList.remove('hl')});var vis=lg.filter(function(l){var r=l.getBoundingClientRect();return r.top<innerHeight&&r.bottom>0});if(vis.length){vis[lk%vis.length].classList.add('hl');lk++}},900)}

/* devis en trois questions */
var form=$('#wizard'),steps=$$('.step',form),s=1,ans={type:'',date:'',invites:'',budget:''},hint=$('#hint');
var LBL=['Question 1 sur 3','Question 2 sur 3','Question 3 sur 3','Vos coordonnées'];
function show(n){s=n;steps.forEach(function(f){f.classList.toggle('on',+f.getAttribute('data-s')===n)});$('#bar').style.width=(n*25)+'%';$('#stepN').textContent=LBL[n-1];
 $$('.w-steps span').forEach(function(x,i){x.classList.toggle('on',i===n-1);x.classList.toggle('ok',i<n-1)});
 $('#back').classList.toggle('show',n>1);$('#navRow').classList.toggle('last',n===4);hint.textContent='';
 if(n===4){var r=[['party-popper',ans.type],['calendar-days',ans.date],['users',ans.invites],['wallet',ans.budget]];
  $('#recap').innerHTML=r.filter(function(x){return x[1]}).map(function(x){return '<span>'+icon(x[0])+x[1]+'</span>'}).join('');
  if(ans.budget)$('#fBudget').value=ans.budget}}
$$('.chips',form).forEach(function(g){var name=g.getAttribute('data-name');$$('button',g).forEach(function(b){b.addEventListener('click',function(){
 $$('button',g).forEach(function(x){x.classList.remove('on');x.setAttribute('aria-checked','false')});b.classList.add('on');b.setAttribute('aria-checked','true');ans[name]=$('span',b).textContent;hint.textContent='';
 if(name==='type'||name==='budget')setTimeout(function(){next()},320)})})});
function valid(){if(s===1&&!ans.type)return 'Choisissez un type d\u2019événement.';if(s===2&&!ans.date)return 'Choisissez une date, ou « Date pas encore fixée ».';
 if(s===2&&!ans.invites)return 'Indiquez le nombre d\u2019invités.';if(s===3&&!ans.budget)return 'Choisissez une fourchette de budget.';return ''}
function next(){var m=valid();if(m){hint.textContent=m;return}if(s<4)show(s+1)}
$('#next').addEventListener('click',next);$('#back').addEventListener('click',function(){if(s>1)show(s-1)});

/* calendrier */
var MO=['janvier','février','mars','avril','mai','juin','juillet','août','septembre','octobre','novembre','décembre'],
 today=new Date();today.setHours(0,0,0,0);var vy=today.getFullYear(),vm=today.getMonth(),sel=null;
function cal(){$('#calMonth').textContent=MO[vm]+' '+vy;var first=new Date(vy,vm,1),off=(first.getDay()+6)%7,n=new Date(vy,vm+1,0).getDate(),h='';
 for(var i=0;i<off;i++)h+='<span></span>';
 for(var d=1;d<=n;d++){var dt=new Date(vy,vm,d),c=[];if(dt<today)c.push('past');if(+dt===+today)c.push('today');if(sel&&+dt===+sel)c.push('sel');var wd=dt.getDay();if(wd===0||wd===6)c.push('we');
  h+='<button type="button" class="'+c.join(' ')+'" data-d="'+d+'"'+(dt<today?' disabled':'')+' aria-label="'+d+' '+MO[vm]+' '+vy+'">'+d+'</button>'}
 $('#calDays').innerHTML=h;$('#calPrev').disabled=(vy===today.getFullYear()&&vm===today.getMonth())}
$('#calDays').addEventListener('click',function(e){var b=e.target.closest('button');if(!b||b.disabled)return;sel=new Date(vy,vm,+b.getAttribute('data-d'));
 var j=sel.toLocaleDateString('fr-FR',{weekday:'long',day:'numeric',month:'long',year:'numeric'});ans.date=j.charAt(0).toUpperCase()+j.slice(1);
 $('#calSel').innerHTML=icon('calendar-days')+ans.date;$('#calTbd').classList.remove('on');hint.textContent='';cal()});
$('#calPrev').addEventListener('click',function(){vm--;if(vm<0){vm=11;vy--}cal()});$('#calNext').addEventListener('click',function(){vm++;if(vm>11){vm=0;vy++}cal()});
$('#calTbd').addEventListener('click',function(){sel=null;ans.date='Date à fixer';this.classList.add('on');$('#calSel').innerHTML=icon('calendar-days')+'Date à fixer';hint.textContent='';cal()});
cal();

/* coordonnées et envoi */
function fields(){return{nom:$('#fNom').value.trim(),ent:$('#fEnt').value.trim(),tel:$('#fTel').value.trim(),mail:$('#fMail').value.trim(),budget:$('#fBudget').value||ans.budget,msg:$('#fMsg').value.trim()}}
function check(){var f=fields(),ok=true;$('#fNom').parentNode.classList.toggle('err',!f.nom);$('#fTel').parentNode.classList.toggle('err',f.tel.replace(/\D/g,'').length<8);
 if(!f.nom){hint.textContent='Indiquez votre nom.';return null}if(f.tel.replace(/\D/g,'').length<8){hint.textContent='Indiquez un numéro de téléphone valide.';return null}
 if(f.mail&&!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(f.mail)){hint.textContent='Vérifiez l\u2019adresse e-mail.';return null}return f}
function text(f){return ['Bonjour SN Silverplate Services,','','Je souhaite un devis pour un événement.','Type : '+ans.type,'Date : '+ans.date,'Invités : '+ans.invites,'Budget : '+(f.budget||'À définir'),'',
 'Nom : '+f.nom,f.ent?'Entreprise : '+f.ent:'','Téléphone : '+f.tel,f.mail?'E-mail : '+f.mail:'',f.msg?'Projet : '+f.msg:''].filter(function(l,i,a){return l!==''||(a[i-1]!=='')}).join('\n')}
function finish(t){steps.forEach(function(x){x.classList.remove('on')});$('#navRow').hidden=true;$('.progress').style.display='none';$('#stepN').hidden=true;$('.w-steps').style.display='none';hint.textContent='';$('#doneTxt').textContent=t;$('#done').hidden=false}
form.addEventListener('submit',function(e){e.preventDefault();var f=check();if(!f)return;var body=text(f),ep=form.getAttribute('data-endpoint');
 if(ep){fetch(ep,{method:'POST',headers:{'Content-Type':'application/json','Accept':'application/json'},body:JSON.stringify({sujet:'Demande de rappel',message:body,nom:f.nom,entreprise:f.ent,telephone:f.tel,email:f.mail,budget:f.budget})})
  .then(function(){finish('Merci '+f.nom+', notre équipe vous rappelle au '+f.tel+'.')}).catch(function(){location.href='mailto:'+MAIL+'?subject='+encodeURIComponent('Demande de rappel, '+f.nom)+'&body='+encodeURIComponent(body)})}
 else{location.href='mailto:'+MAIL+'?subject='+encodeURIComponent('Demande de rappel, '+f.nom)+'&body='+encodeURIComponent(body);finish('Votre demande est prête dans votre messagerie, adressée à '+MAIL+'. Notre équipe vous rappelle au '+f.tel+'.')}});
$('#sendWa').addEventListener('click',function(){var f=check();if(!f)return;window.open('https://wa.me/'+TEL+'?text='+encodeURIComponent(text(f)),'_blank','noopener');finish('WhatsApp s\u2019est ouvert avec votre message déjà rédigé. Il ne reste qu\u2019à l\u2019envoyer.')});
$('#restart').addEventListener('click',function(){form.reset();ans={type:'',date:'',invites:'',budget:''};sel=null;$$('.chips button',form).forEach(function(b){b.classList.remove('on')});
 $('#calSel').innerHTML=icon('calendar-days')+'Aucune date choisie';$('#calTbd').classList.remove('on');cal();$('#done').hidden=true;$('#navRow').hidden=false;$('.progress').style.display='';$('#stepN').hidden=false;$('.w-steps').style.display='';show(1)});
show(1);

/* lettre d'information */
$('#newsF').addEventListener('submit',function(e){e.preventDefault();var m=$('#newsMail').value.trim();if(!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(m)){$('#newsMsg').textContent='Indiquez une adresse e-mail valide.';return}
 location.href='mailto:'+MAIL+'?subject='+encodeURIComponent('Inscription à la newsletter')+'&body='+encodeURIComponent('Bonjour, je souhaite recevoir votre newsletter : '+m);$('#newsMsg').textContent='Votre demande d\u2019inscription est prête dans votre messagerie.'});
})();
