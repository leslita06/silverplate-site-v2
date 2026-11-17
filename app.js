(function(){
  var D = window.SP, V = '?v=2';
  var $ = function(s,c){return (c||document).querySelector(s)};

  /* Bandeau d'accueil : vraies photos des événements */
  var diapos = [
    ['e5_1','TCL West Africa Regional Launch · septembre 2026'],
    ['e0_4','Summer Tour de l\'Olympique de Marseille · juillet 2026'],
    ['e2_9','Célébration des 20 ans de Parlym'],
    ['e3_4','Ivoire Tech Next 15 & Scale Up · juillet 2026'],
    ['e6_2','Les Nouveaux Boss · avant-première'],
    ['e7_9','Salon International du Tourisme et des Loisirs d\'Abidjan']
  ];
  var sl = $('#slides'), lg = $('#legende');
  diapos.forEach(function(d,i){
    var im = new Image(); im.src = 'img/evt/'+d[0]+'.jpg'+V; im.alt = d[1];
    if(i===0) im.className='on'; else im.loading='lazy';
    sl.appendChild(im);
  });
  lg.textContent = diapos[0][1];
  var cur = 0, imgs = sl.querySelectorAll('img');
  setInterval(function(){
    imgs[cur].classList.remove('on'); cur = (cur+1)%imgs.length;
    imgs[cur].classList.add('on'); lg.textContent = diapos[cur][1];
  }, 5500);

  /* Navigation */
  var nav = $('#haut'), menu = $('#menu'), burger = $('#burger');
  function scr(){ nav.classList.toggle('plein', window.scrollY > 40); }
  window.addEventListener('scroll', scr, {passive:true}); scr();
  burger.addEventListener('click', function(){
    var o = menu.classList.toggle('ouvert'); nav.classList.toggle('ouvert', o);
    burger.setAttribute('aria-expanded', o);
  });
  menu.addEventListener('click', function(e){ if(e.target.tagName==='A'){ menu.classList.remove('ouvert'); nav.classList.remove('ouvert'); burger.setAttribute('aria-expanded',false);} });
  var liens = menu.querySelectorAll('a');
  var obsNav = new IntersectionObserver(function(es){
    es.forEach(function(e){ if(e.isIntersecting){ liens.forEach(function(a){ a.classList.toggle('actif', a.getAttribute('href')==='#'+e.target.id); }); } });
  },{rootMargin:'-45% 0px -50% 0px'});
  ['accueil','a-propos','services','evenements','archives','contact'].forEach(function(id){ obsNav.observe(document.getElementById(id)); });

  /* Compteurs */
  var obsN = new IntersectionObserver(function(es){
    es.forEach(function(e){
      if(!e.isIntersecting) return; obsN.unobserve(e.target);
      var n = +e.target.dataset.n, t0 = performance.now();
      (function f(t){ var p = Math.min(1,(t-t0)/1600); e.target.textContent = Math.round(n*(1-Math.pow(1-p,3))); if(p<1) requestAnimationFrame(f); })(t0);
    });
  },{threshold:.5});
  document.querySelectorAll('[data-n]').forEach(function(b){ obsN.observe(b); });

  /* Services : textes du site actuel */
  var ico = {
    agence:'<path d="M4 20V9l8-5 8 5v11h-5v-6H9v6H4Z"/>',
    stand:'<path d="M3 4h18v3H3zM5 7h2v13H5zm12 0h2v13h-2zM9 10h6v5H9z"/>',
    td:'<path d="M12 2 3 7v10l9 5 9-5V7l-9-5Zm0 2.3 6.4 3.6L12 11.4 5.6 7.9 12 4.3ZM5 9.6l6 3.4v6.8l-6-3.4V9.6Zm8 10.2V13l6-3.4v6.8l-6 3.4Z"/>',
    video:'<path d="M3 6h12a2 2 0 0 1 2 2v1.5l4-2.5v10l-4-2.5V16a2 2 0 0 1-2 2H3V6Z"/>',
    goodies:'<path d="M20 7h-3.2A3 3 0 0 0 12 3.8 3 3 0 0 0 7.2 7H4v5h1v8h14v-8h1V7Zm-6-1a1 1 0 1 1 1 1h-1V6Zm-4 0v1H9a1 1 0 1 1 1-1Zm-4 3h5v1H6V9Zm1 3h4v6H7v-6Zm6 6v-6h4v6h-4Zm5-8h-5V9h5v1Z"/>',
    web:'<path d="M3 4h18v13H3V4Zm2 2v9h14V6H5Zm3 13h8v2H8v-2Z"/>'
  };
  var serv = [
    ['agence','Agence événementielle','Un regard 360 sur votre marque, votre business ou vos projets ; un partenaire de confiance qui comprend le marché et ses subtilités.',['Séminaires','Dîners de gala','Lancements','Vœux'],'e5_1'],
    ['stand','Stand','Nous mettons en place votre stand pour développer votre activité et votre audience, et nous suivons sa réalisation du début jusqu\'à la fin.',['Conception','Fabrication','Suivi'],'e4_4'],
    ['td','Réalisation 3D','Riche, dynamique et puissante, la 3D offre à votre audience un contenu visuel unique, à fort impact, pour dynamiser votre stratégie marketing.',['Stands','Scènes','Décors'],'e2_8'],
    ['video','Production audiovisuelle','Montage, film événementiel, clip, film d\'entreprise, captation multi-caméras, motion design, team building vidéo, captation drone.',['Aftermovie','Drone','Motion design'],'e6_0'],
    ['goodies','Goodies','Nous développons et déclinons votre charte graphique sur papier et sur objets : cartes de visite, flyers, brochures, kakémonos, t-shirts, casquettes, packaging.',['Print','Textile','Packaging'],'e2_7'],
    ['web','Web','Site vitrine ou dynamique, e-réputation, stratégie social media, campagnes digitales : une solution personnalisée pour vos projets digitaux.',['Sites','Réseaux sociaux','Campagnes'],'e3_5']
  ];
  $('#servGrid').innerHTML = serv.map(function(s){
    return '<article class="serv apparait"><img src="img/evt/'+s[4]+'.jpg'+V+'" alt="" loading="lazy">'+
      '<div class="serv__ico"><svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">'+ico[s[0]]+'</svg></div>'+
      '<h3>'+s[1]+'</h3><p>'+s[2]+'</p><ul>'+s[3].map(function(x){return '<li>'+x+'</li>'}).join('')+'</ul></article>';
  }).join('');

  /* Evenements */
  var E = D.evenements, cats = ['Tout'];
  E.forEach(function(e){ e.cats.forEach(function(c){ if(cats.indexOf(c)<0) cats.push(c); }); });
  var lib = {'avant-première':'Avant-première'};
  $('#filtres').innerHTML = cats.map(function(c,i){ return '<button role="tab" class="'+(i?'':'on')+'" data-c="'+c+'">'+(lib[c]||c)+'</button>'; }).join('');
  function meta(e){ return [e.client, e.date].filter(Boolean).join(' · '); }
  $('#evtGrid').innerHTML = E.map(function(e,i){
    return '<button class="evt apparait'+(i<2?' evt--grand':'')+'" data-i="'+i+'" data-cats="'+e.cats.join('|')+'">'+
      '<img src="img/evt/'+e.couv+V+'" alt="'+e.titre+'" loading="lazy">'+
      '<span class="evt__nb">'+e.photos.length+' photos</span>'+
      '<span class="evt__txt"><span class="evt__type">'+e.type+'</span><h3>'+e.titre+'</h3><span class="evt__meta">'+meta(e)+'</span></span></button>';
  }).join('');
  $('#filtres').addEventListener('click', function(ev){
    var b = ev.target.closest('button'); if(!b) return;
    this.querySelectorAll('button').forEach(function(x){ x.classList.toggle('on', x===b); });
    var c = b.dataset.c;
    document.querySelectorAll('.evt').forEach(function(x){ x.hidden = !(c==='Tout' || x.dataset.cats.split('|').indexOf(c)>=0); });
  });

  /* Boite photos */
  var boite = $('#boite'), bi = $('#bImg'), ce = null, cp = 0;
  function montre(){
    var p = ce.photos[cp]; bi.src = 'img/evt/'+p[0]+V; bi.alt = ce.titre+' · photo '+(cp+1);
    $('#bCpt').textContent = (cp+1)+' / '+ce.photos.length;
    $('#bVign').querySelectorAll('button').forEach(function(b,k){ b.classList.toggle('on', k===cp); });
  }
  function ouvre(i){
    ce = E[i]; cp = 0;
    $('#bType').textContent = ce.type; $('#bTitre').textContent = ce.titre;
    $('#bInfo').textContent = [ce.client ? 'Client : '+ce.client : '', ce.date || '', ce.cats.map(function(c){return lib[c]||c}).join(', ')].filter(Boolean).join(' · ');
    $('#bVign').innerHTML = ce.photos.map(function(p,k){ return '<button aria-label="Photo '+(k+1)+'"><img src="img/evt/'+p[0]+V+'" alt="" loading="lazy"></button>'; }).join('');
    montre(); boite.hidden = false; document.body.style.overflow = 'hidden';
  }
  function ferme(){ boite.hidden = true; document.body.style.overflow = ''; }
  $('#evtGrid').addEventListener('click', function(ev){ var b = ev.target.closest('.evt'); if(b) ouvre(+b.dataset.i); });
  $('#bVign').addEventListener('click', function(ev){ var b = ev.target.closest('button'); if(!b) return; cp = [].indexOf.call(this.children,b); montre(); });
  $('#bPrev').onclick = function(){ cp = (cp-1+ce.photos.length)%ce.photos.length; montre(); };
  $('#bNext').onclick = function(){ cp = (cp+1)%ce.photos.length; montre(); };
  boite.addEventListener('click', function(ev){ if(ev.target.hasAttribute('data-fermer')) ferme(); });
  var tx = null;
  boite.addEventListener('touchstart', function(ev){ tx = ev.touches[0].clientX; }, {passive:true});
  boite.addEventListener('touchend', function(ev){
    if(tx === null) return; var dx = ev.changedTouches[0].clientX - tx; tx = null;
    if(Math.abs(dx) > 50){ (dx < 0 ? $('#bNext') : $('#bPrev')).click(); }
  });
  document.addEventListener('keydown', function(ev){
    if(boite.hidden) return;
    if(ev.key==='Escape') ferme(); if(ev.key==='ArrowLeft') $('#bPrev').click(); if(ev.key==='ArrowRight') $('#bNext').click();
  });

  /* Archives */
  $('#archList').innerHTML = D.archives.map(function(a){ return '<li>'+a+'</li>'; }).join('');

  /* Clients : deux bandes qui défilent */
  function bande(l){ var h = l.map(function(c){ return '<div class="logo-cl" title="'+c[1]+'"><img src="img/clients/'+c[0]+'.png'+V+'" alt="'+c[1]+'" loading="lazy"></div>'; }).join(''); return h+h; }
  var C = D.clients, m = Math.ceil(C.length/2);
  $('#piste1').innerHTML = bande(C.slice(0,m)); $('#piste2').innerHTML = bande(C.slice(m));
  document.querySelectorAll('#piste1 .logo-cl:nth-child(n+'+(m+1)+'), #piste2 .logo-cl:nth-child(n+'+(C.length-m+1)+')').forEach(function(x){ x.setAttribute('aria-hidden','true'); });

  /* Apparition au défilement */
  var obsA = new IntersectionObserver(function(es){ es.forEach(function(e){ if(e.isIntersecting){ e.target.classList.add('vu'); obsA.unobserve(e.target);} }); },{threshold:.12});
  document.querySelectorAll('.apparait').forEach(function(x){ obsA.observe(x); });

  /* Demande de devis : rien n'est transmis, confirmation à l'écran */
  var f = $('#devis'), merci = $('#merci');
  f.addEventListener('submit', function(ev){
    ev.preventDefault();
    var ok = true;
    f.querySelectorAll('.err').forEach(function(x){ x.classList.remove('err'); });
    ['nom','email','tel'].forEach(function(n){
      var i = f.elements[n], v = i.value.trim();
      var bad = !v || (n==='email' && !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(v)) || (n==='tel' && v.replace(/\D/g,'').length < 8);
      if(bad){ i.classList.add('err'); ok = false; }
    });
    if(!f.querySelector('input[name=type]:checked')){ f.querySelector('.devis__types').classList.add('err'); ok = false; }
    $('#devisErr').hidden = ok;
    if(!ok){ var p = f.querySelector('.err'); if(p) p.scrollIntoView({block:'center',behavior:'smooth'}); return; }
    var g = function(n){ return f.elements[n].value.trim(); };
    var besoins = [].map.call(f.querySelectorAll('input[name=besoins]:checked'), function(x){ return x.value; });
    var dt = g('date') ? new Date(g('date')+'T12:00').toLocaleDateString('fr-FR',{weekday:'long',day:'numeric',month:'long',year:'numeric'}) : 'à définir';
    var rows = [['Événement', f.querySelector('input[name=type]:checked').value],['Société', g('societe')||'—'],['Date', dt],['Invités', g('invites')||'à définir'],['Ville', g('ville')||'—'],['Besoins', besoins.join(', ')||'à définir'],['Contact', g('email')+' · '+g('tel')]];
    var esc = function(s){ return s.replace(/[&<>"]/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]}); };
    $('#mRecap').innerHTML = rows.map(function(r){ return '<dt>'+r[0]+'</dt><dd>'+esc(r[1])+'</dd>'; }).join('');
    $('#mNom').textContent = g('nom').split(' ')[0];
    f.hidden = true; merci.hidden = false; merci.scrollIntoView({block:'center',behavior:'smooth'});
  });
  $('#mNouveau').onclick = function(){ f.reset(); f.elements.ville.value='Abidjan'; merci.hidden = true; f.hidden = false; };
})();
