(function(){
'use strict';
/* en-tête et barre mobile */
var top=document.getElementById('top'),dock=document.querySelector('.dock');
function onScroll(){var y=window.scrollY;top.classList.toggle('solid',y>40);if(dock)dock.classList.toggle('show',y>window.innerHeight*0.6);}
window.addEventListener('scroll',onScroll,{passive:true});onScroll();

/* diaporama d'ouverture */
var slides=[].slice.call(document.querySelectorAll('.slide')),caps=['TCL West Africa Regional Launch, 2026','Les 20 ans de Parlym','Stand AFG Bank','Summer Tour de l\u2019Olympique de Marseille, 2026','Canal+, avant-premi\u00e8re Obatanga'];
var dots=document.getElementById('dots'),cap=document.getElementById('capTxt'),cur=0;
slides.forEach(function(_,i){var d=document.createElement('i');if(!i)d.className='on';dots.appendChild(d);});
var ds=[].slice.call(dots.children);
function go(n){slides[cur].classList.remove('on');ds[cur].classList.remove('on');cur=n;slides[cur].classList.add('on');ds[cur].classList.add('on');cap.textContent=caps[cur];}
if(!window.matchMedia('(prefers-reduced-motion: reduce)').matches){setInterval(function(){go((cur+1)%slides.length);},5500);}

/* révélation au défilement */
var rv=document.querySelectorAll('.rv');
if('IntersectionObserver' in window){var io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target);}});},{threshold:.12,rootMargin:'0px 0px -40px 0px'});rv.forEach(function(el){io.observe(el);});}
else rv.forEach(function(el){el.classList.add('in');});

/* filtres des réalisations */
var fb=[].slice.call(document.querySelectorAll('.filters button')),cards=[].slice.call(document.querySelectorAll('.card'));
fb.forEach(function(b){b.addEventListener('click',function(){
 fb.forEach(function(x){x.classList.remove('on');x.setAttribute('aria-selected','false');});b.classList.add('on');b.setAttribute('aria-selected','true');
 var f=b.dataset.f;cards.forEach(function(c){var ok=f==='tout'||c.dataset.c===f||c.dataset.c==='all';c.classList.toggle('hide',!ok);if(ok)c.classList.add('in');});
});});

/* marques (logos repris du site silverplate-services.com) */
var L=[['canal','Canal+'],['air-france','Air France'],['cfao','CFAO Motors'],['sunu','SUNU Assurances'],['socida','SOCIDA'],['wafa','Wafa Assurance'],['olam','Olam Agri'],['ofi','OFI'],['afd','AFD'],['geely','Geely'],['chery','Chery'],['heetch','Heetch'],['julaya','Julaya'],['nanawax','Nanawax'],['touton','Touton'],['aitek','Aitek'],['bia','BIA'],['autochek','Autochek'],['enko','ENKO'],['mane','MANE'],['mayelia','Mayelia'],['seafrigo','Seafrigo'],['sada-motors','Sada Motors'],['travel-blue','Travel Blue'],['youscribe','YouScribe'],['okplast','Ok Plast'],['luigong','LiuGong'],['sablux','Sablux'],['saco','SACO'],['otl','OTL'],['tisa','TISA'],['city-sport','City Sport'],['intermedic','Intermedic'],['orange-export','Orange Esport Experience'],['fine4africa','Fin4Africa'],['meta-boost','Meta Boost'],['totem-experience','Totem Experience'],['snps-ci','SNPS-CI'],['setr','SETR'],['morenos','Moreno\u2019s Secret'],['akoula','La Maison d\u2019Akoula'],['a-constant','A. Constant'],['ace','ACE'],['fiba','FIBA Africa'],['majx','MAJX'],['meet-africa','Meet Africa']];
var mq=document.querySelector('.marquee'),t1=document.getElementById('track'),t2=document.createElement('div');t2.className='track row2';mq.appendChild(t2);
function fill(t,arr){var h='';arr.concat(arr).forEach(function(l){h+='<div class="logo"><img src="img/clients/'+l[0]+'.png" alt="'+l[1]+'" loading="lazy"></div>';});t.innerHTML=h;}
var mid=Math.ceil(L.length/2);fill(t1,L.slice(0,mid));fill(t2,L.slice(mid));

/* devis en trois étapes vers WhatsApp */
var step=1,steps=[].slice.call(document.querySelectorAll('.step')),bar=document.getElementById('bar'),stepN=document.getElementById('stepN'),next=document.getElementById('next'),back=document.getElementById('back'),hint=document.getElementById('hint');
var val={};
[].slice.call(document.querySelectorAll('.chips')).forEach(function(g){g.addEventListener('click',function(e){var b=e.target.closest('button');if(!b)return;[].slice.call(g.children).forEach(function(x){x.classList.remove('on');});b.classList.add('on');val[g.dataset.name]=b.textContent;hint.textContent='';});});
function show(){steps.forEach(function(s){s.classList.toggle('on',+s.dataset.s===step);});bar.style.width=(step/3*100)+'%';stepN.textContent='\u00c9tape '+step+' sur 3';back.classList.toggle('show',step>1);next.innerHTML=step<3?'Continuer \u2192':'Envoyer sur WhatsApp \u2192';}
function fmt(d){if(!d)return '\u00e0 pr\u00e9ciser';var p=d.split('-');return p[2]+'/'+p[1]+'/'+p[0];}
next.addEventListener('click',function(){
 if(step===1&&!val.type){hint.textContent='Choisissez un type d\u2019\u00e9v\u00e9nement.';return;}
 if(step===2&&!val.invites){hint.textContent='Indiquez un nombre d\u2019invit\u00e9s.';return;}
 if(step===3&&!val.budget){hint.textContent='Choisissez une fourchette de budget.';return;}
 if(step<3){step++;show();return;}
 var nom=document.getElementById('nom').value.trim();
 var m='Bonjour SN Silverplate Services, je souhaite un devis.\n\n'+'Type d\u2019\u00e9v\u00e9nement : '+val.type+'\nDate souhait\u00e9e : '+fmt(document.getElementById('date').value)+'\nInvit\u00e9s : '+val.invites+'\nBudget : '+val.budget+(nom?'\n\n'+nom:'');
 window.open('https://wa.me/2250707727292?text='+encodeURIComponent(m),'_blank','noopener');
 hint.textContent='WhatsApp s\u2019ouvre avec votre demande d\u00e9j\u00e0 r\u00e9dig\u00e9e.';
});
back.addEventListener('click',function(){if(step>1){step--;show();}});
show();
})();
