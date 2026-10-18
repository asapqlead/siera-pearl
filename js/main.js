(function(){
"use strict";

/* ================= LOGO ================= */
var LOGO_SRC = "assets/images/logo.webp";
document.getElementById('headerLogo').src = LOGO_SRC;
document.getElementById('footerLogo').src = LOGO_SRC;

/* ================= ICON GENERATOR ================= */
var METAL_GRADS = {
  "Yellow Gold": ["#EBCB88","#8C6A2F"],
  "Rose Gold": ["#E9BBA0","#B0703F"],
  "White Gold": ["#EDEDED","#AEAEAE"]
};
var PEARL_GRADS = {
  "Akoya": ["#FFFFFF","#D9D2BE"],
  "South Sea": ["#F4E7BC","#C9A15E"],
  "Tahitian": ["#6E7A78","#1C1E20"],
  "Freshwater": ["#F7EFE6","#DCCFC0"],
  "Keshi": ["#F3E3D6","#CBB6A4"]
};
var iconUid = 0;
function grad(defs, colors){
  iconUid++;
  var id = "g"+iconUid;
  defs.push('<radialGradient id="'+id+'" cx="35%" cy="30%" r="75%"><stop offset="0%" stop-color="'+colors[0]+'"/><stop offset="100%" stop-color="'+colors[1]+'"/></radialGradient>');
  return "url(#"+id+")";
}
function lgrad(defs, colors){
  iconUid++;
  var id = "lg"+iconUid;
  defs.push('<linearGradient id="'+id+'" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="'+colors[0]+'"/><stop offset="100%" stop-color="'+colors[1]+'"/></linearGradient>');
  return "url(#"+id+")";
}
function makeIcon(category, metal, pearl){
  var defs = [];
  var mCol = METAL_GRADS[metal] || METAL_GRADS["Yellow Gold"];
  var pCol = PEARL_GRADS[pearl] || PEARL_GRADS["Akoya"];
  var mg = lgrad(defs, mCol);
  var body = "";
  if(category === "Necklaces"){
    var pg = grad(defs, pCol);
    body = '<path d="M15 22 C15 62 40 88 62 88 C84 88 109 62 109 22" stroke="'+mg+'" stroke-width="4" fill="none" stroke-linecap="round"/>'+
           '<circle cx="62" cy="90" r="15" fill="'+pg+'"/><circle cx="56" cy="84" r="4" fill="#fff" opacity="0.6"/>';
  } else if(category === "Earrings"){
    var pg1 = grad(defs, pCol); var pg2 = grad(defs, pCol);
    body = '<path d="M45 15 q-6 10 0 20" stroke="'+mg+'" stroke-width="3.4" fill="none" stroke-linecap="round"/><circle cx="45" cy="46" r="13" fill="'+pg1+'"/><circle cx="41" cy="42" r="3.4" fill="#fff" opacity="0.6"/>'+
           '<path d="M79 15 q6 10 0 20" stroke="'+mg+'" stroke-width="3.4" fill="none" stroke-linecap="round"/><circle cx="79" cy="46" r="13" fill="'+pg2+'"/><circle cx="75" cy="42" r="3.4" fill="#fff" opacity="0.6"/>';
  } else if(category === "Bracelets"){
    var pts = [[20,62],[38,30],[68,20],[98,30],[112,62],[98,90],[68,100],[38,90]];
    var circles = "";
    for(var i=0;i<pts.length;i++){
      var pg = grad(defs, pCol);
      circles += '<circle cx="'+pts[i][0]+'" cy="'+pts[i][1]+'" r="10" fill="'+pg+'"/>';
    }
    body = '<ellipse cx="66" cy="60" rx="46" ry="34" stroke="'+mg+'" stroke-width="2" fill="none" opacity="0.5"/>' + circles;
  } else { /* Rings */
    var pg = grad(defs, pCol);
    body = '<ellipse cx="62" cy="82" rx="34" ry="20" stroke="'+mg+'" stroke-width="6" fill="none"/>'+
           '<circle cx="62" cy="42" r="19" fill="'+pg+'"/><circle cx="55" cy="35" r="5" fill="#fff" opacity="0.6"/>';
  }
  return '<svg viewBox="0 0 124 124" xmlns="http://www.w3.org/2000/svg"><defs>'+defs.join('')+'</defs>'+body+'</svg>';
}

/* ================= PRODUCT DATA ================= */
var METALS = ["Yellow Gold","Rose Gold","White Gold"];
var PEARLS = ["Akoya","South Sea","Tahitian","Freshwater","Keshi"];

var PRODUCTS = [];
var supabaseUrl = import.meta.env.VITE_SUPABASE_URL || (window.SUPABASE_CONFIG && window.SUPABASE_CONFIG.url) || "";
var supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || (window.SUPABASE_CONFIG && window.SUPABASE_CONFIG.anonKey) || "";
var sb = (supabaseUrl && supabaseAnonKey && window.supabase)
  ? window.supabase.createClient(supabaseUrl, supabaseAnonKey)
  : null;

function mapDbProduct(db_p) {
  var inStock = Boolean(db_p.in_stock && (db_p.stock_qty === undefined || db_p.stock_qty === null || db_p.stock_qty > 0));
  return {
    id: db_p.id,
    cat: db_p.cat,
    name: db_p.name,
    metal: db_p.metal,
    pearl: db_p.pearl,
    price: Number(db_p.price),
    was: db_p.was ? Number(db_p.was) : null,
    desc: db_p.description || "",
    badge: db_p.badge || null,
    rating: db_p.rating || 5,
    stock: inStock,
    stock_qty: db_p.stock_qty !== undefined ? db_p.stock_qty : (inStock ? 1 : 0),
    date: db_p.id,
    photos: Array.isArray(db_p.photos) ? db_p.photos : [],
    icon: makeIcon(db_p.cat, db_p.metal, db_p.pearl)
  };
}

function fetchProductsFromSupabase(cb) {
  if (!sb) {
    console.warn("Supabase not configured in .env (VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY).");
    if (cb) cb();
    return;
  }
  
  sb.from("products").select("*").order("sort_order", { ascending: true })
    .then(function(res) {
      if (res.error) {
        console.error("Failed to load products from Supabase:", res.error);
      } else {
        PRODUCTS = (res.data || []).map(mapDbProduct);
      }
      if (cb) cb();
    });
}

function initProducts(cb) {
  fetchProductsFromSupabase(function() {
    if (cb) cb();
    setupSyncListeners();
  });
}

function setupSyncListeners() {
  if (!sb) return;

  function refreshStorefront() {
    fetchProductsFromSupabase(function() {
      updateFilterCounts();
      renderShop();
      renderCart();
    });
  }

  // Auto re-sync whenever user focuses or switches back to the storefront tab
  document.addEventListener("visibilitychange", function() {
    if (document.visibilityState === "visible") {
      refreshStorefront();
    }
  });

  // Supabase Realtime subscription for instant updates across tabs
  try {
    if (typeof sb.channel === "function") {
      sb.channel("storefront-products-sync")
        .on("postgres_changes", { event: "*", schema: "public", table: "products" }, function() {
          refreshStorefront();
        })
        .subscribe();
    }
  } catch (err) {
    console.warn("Realtime sync unavailable:", err);
  }
}

/* ================= STATE ================= */
var state = {
  filters:{ cat:[], pearl:[], metal:[], maxPrice:5000, inStock:false, search:"" },
  sort:"featured",
  cart:[] /* {id, qty} */
};

/* ================= HELPERS ================= */
function money(n){ return "$" + n.toLocaleString('en-US', {maximumFractionDigits:0}); }
function byId(id){ return PRODUCTS.find(function(p){return p.id===id;}); }
function starsHTML(n){
  var s = "";
  for(var i=0;i<5;i++){
    s += '<svg viewBox="0 0 20 20" fill="'+(i<n?'currentColor':'none')+'" stroke="currentColor" stroke-width="1"><polygon points="10,1 12.6,7 19,7.6 14.2,11.9 15.6,18.2 10,14.9 4.4,18.2 5.8,11.9 1,7.6 7.4,7"/></svg>';
  }
  return s;
}

/* ================= FILTER PANEL BUILD ================= */
function countFor(field, val){
  return PRODUCTS.filter(function(p){ return p[field]===val; }).length;
}
function updateFilterCounts(){
  ["Necklaces","Earrings","Bracelets","Rings","Bridal"].forEach(function(c){
    var el = document.querySelector('#fCategory input[value="'+c+'"] ~ .count');
    if (el) el.textContent = countFor('cat', c);
  });
  PEARLS.forEach(function(c){
    var el = document.querySelector('#fPearl input[value="'+c+'"] ~ .count');
    if (el) el.textContent = countFor('pearl', c);
  });
  METALS.forEach(function(c){
    var el = document.querySelector('#fMetal input[value="'+c+'"] ~ .count');
    if (el) el.textContent = countFor('metal', c);
  });
}
function buildFilterOpts(){
  var catWrap = document.getElementById('fCategory');
  ["Necklaces","Earrings","Bracelets","Rings","Bridal"].forEach(function(c){
    var lab = document.createElement('label');
    lab.innerHTML = '<input type="checkbox" value="'+c+'"><span>'+c+'</span><span class="count">'+countFor('cat',c)+'</span>';
    catWrap.appendChild(lab);
  });
  var pearlWrap = document.getElementById('fPearl');
  PEARLS.forEach(function(c){
    var lab = document.createElement('label');
    lab.innerHTML = '<input type="checkbox" value="'+c+'"><span>'+c+'</span><span class="count">'+countFor('pearl',c)+'</span>';
    pearlWrap.appendChild(lab);
  });
  var metalWrap = document.getElementById('fMetal');
  METALS.forEach(function(c){
    var lab = document.createElement('label');
    lab.innerHTML = '<input type="checkbox" value="'+c+'"><span>'+c+'</span><span class="count">'+countFor('metal',c)+'</span>';
    metalWrap.appendChild(lab);
  });

  document.querySelectorAll('#fCategory input').forEach(function(cb){
    cb.addEventListener('change', function(){ syncCheckState('cat','#fCategory'); });
  });
  document.querySelectorAll('#fPearl input').forEach(function(cb){
    cb.addEventListener('change', function(){ syncCheckState('pearl','#fPearl'); });
  });
  document.querySelectorAll('#fMetal input').forEach(function(cb){
    cb.addEventListener('change', function(){ syncCheckState('metal','#fMetal'); });
  });
  document.getElementById('fPrice').addEventListener('input', function(e){
    state.filters.maxPrice = parseInt(e.target.value,10);
    document.getElementById('fPriceVal').textContent = state.filters.maxPrice>=5000 ? "$5,000+" : money(state.filters.maxPrice);
    renderShop();
  });
  document.getElementById('fInStock').addEventListener('change', function(e){
    state.filters.inStock = e.target.checked;
    renderShop();
  });
  document.getElementById('clearFilters').addEventListener('click', function(){
    state.filters = { cat:[], pearl:[], metal:[], maxPrice:5000, inStock:false, search: state.filters.search };
    document.querySelectorAll('.filters input[type=checkbox]').forEach(function(cb){cb.checked=false;});
    document.getElementById('fPrice').value = 5000;
    document.getElementById('fPriceVal').textContent = "$5,000+";
    renderShop();
  });
}
function syncCheckState(field, sel){
  var vals = [];
  document.querySelectorAll(sel+' input:checked').forEach(function(cb){ vals.push(cb.value); });
  state.filters[field] = vals;
  renderShop();
}
function setCategoryFilter(cat){
  state.filters.cat = (cat==="all") ? [] : [cat];
  document.querySelectorAll('#fCategory input').forEach(function(cb){
    cb.checked = state.filters.cat.indexOf(cb.value) > -1;
  });
  renderShop();
  document.getElementById('shop').scrollIntoView({behavior:'smooth', block:'start'});
}

/* ================= CHIPS ================= */
function renderChips(){
  var wrap = document.getElementById('activeChips');
  wrap.innerHTML = "";
  var f = state.filters;
  function chip(label, onRemove){
    var el = document.createElement('div');
    el.className = 'chip';
    el.innerHTML = '<span>'+label+'</span>';
    var btn = document.createElement('button');
    btn.textContent = '✕';
    btn.setAttribute('aria-label','Remove filter '+label);
    btn.addEventListener('click', onRemove);
    el.appendChild(btn);
    wrap.appendChild(el);
  }
  f.cat.forEach(function(v){ chip(v, function(){
    f.cat = f.cat.filter(function(x){return x!==v;});
    document.querySelectorAll('#fCategory input').forEach(function(cb){ if(cb.value===v) cb.checked=false; });
    renderShop();
  });});
  f.pearl.forEach(function(v){ chip(v+' Pearl', function(){
    f.pearl = f.pearl.filter(function(x){return x!==v;});
    document.querySelectorAll('#fPearl input').forEach(function(cb){ if(cb.value===v) cb.checked=false; });
    renderShop();
  });});
  f.metal.forEach(function(v){ chip(v, function(){
    f.metal = f.metal.filter(function(x){return x!==v;});
    document.querySelectorAll('#fMetal input').forEach(function(cb){ if(cb.value===v) cb.checked=false; });
    renderShop();
  });});
  if(f.maxPrice < 5000){ chip('Under '+money(f.maxPrice), function(){
    f.maxPrice = 5000; document.getElementById('fPrice').value=5000; document.getElementById('fPriceVal').textContent="$5,000+"; renderShop();
  });}
  if(f.inStock){ chip('In stock', function(){ f.inStock=false; document.getElementById('fInStock').checked=false; renderShop(); }); }
  if(f.search){ chip('“'+f.search+'”', function(){ f.search=""; document.getElementById('searchInput').value=""; renderShop(); }); }
}

/* ================= PRODUCT GRID ================= */
function getFiltered(){
  var f = state.filters;
  var list = PRODUCTS.filter(function(p){
    if(f.cat.length && f.cat.indexOf(p.cat)===-1) return false;
    if(f.pearl.length && f.pearl.indexOf(p.pearl)===-1) return false;
    if(f.metal.length && f.metal.indexOf(p.metal)===-1) return false;
    if(p.price > f.maxPrice) return false;
    if(f.inStock && !p.stock) return false;
    if(f.search){
      var s = f.search.toLowerCase();
      if(p.name.toLowerCase().indexOf(s)===-1 && p.cat.toLowerCase().indexOf(s)===-1 && p.pearl.toLowerCase().indexOf(s)===-1) return false;
    }
    return true;
  });
  if(state.sort==="price-asc") list.sort(function(a,b){return a.price-b.price;});
  else if(state.sort==="price-desc") list.sort(function(a,b){return b.price-a.price;});
  else if(state.sort==="newest") list.sort(function(a,b){return a.date-b.date;});
  else if(state.sort==="name") list.sort(function(a,b){return a.name.localeCompare(b.name);});
  else list.sort(function(a,b){ return (b.badge==="Bestseller") - (a.badge==="Bestseller"); });
  return list;
}
var wishlist = {};
function renderShop(){
  renderChips();
  var list = getFiltered();
  document.getElementById('resultCount').textContent = list.length + (list.length===1?' piece':' pieces');
  var grid = document.getElementById('productGrid');
  if(!list.length){
    grid.innerHTML = '<div class="empty-state"><svg viewBox="0 0 24 24" fill="none"><circle cx="11" cy="11" r="7" stroke="currentColor" stroke-width="1.6"/><path d="M20 20l-3.5-3.5" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/></svg><h3 class="serif" style="font-size:19px;">No pieces match those filters</h3><p style="margin-top:8px;font-size:13.5px;">Try widening your price range or clearing a filter.</p></div>';
    updateHeaderOnScroll();
    return;
  }
  grid.innerHTML = list.map(function(p){
    var badge = p.badge ? '<span class="product-badge'+(p.badge==="Sale"?" sale":"")+'">'+p.badge+'</span>' : '';
    var priceHTML = p.was ? '<span>'+money(p.price)+'</span><span class="was">'+money(p.was)+'</span>' : '<span>'+money(p.price)+'</span>';
    var wished = wishlist[p.id];
    var media = p.photos.length
      ? '<img class="product-photo" src="'+p.photos[0]+'" alt="'+p.name+'" loading="lazy" onload="this.classList.add(\'loaded\')">'
      : '<div class="product-photo-fallback">'+p.icon+'</div>';
    return '<div class="product-card" data-id="'+p.id+'">'+
      '<div class="product-media" data-open="'+p.id+'" data-main="'+(p.photos[0]||'')+'" data-hover="'+(p.photos[1]||'')+'">'+
        badge+
        '<button class="wish-btn'+(wished?' active':'')+'" data-wish="'+p.id+'" aria-label="Add to wishlist"><svg viewBox="0 0 24 24" fill="none"><path d="M12 20s-7.5-4.6-9.6-9.3C1 7.4 3 4.5 6.2 4.5c2 0 3.5 1.1 5.8 3.4 2.3-2.3 3.8-3.4 5.8-3.4 3.2 0 5.2 2.9 3.8 6.2C19.5 15.4 12 20 12 20z" stroke="currentColor" stroke-width="1.6"/></svg></button>'+
        media+
        '<div class="quick-add"><button data-quickadd="'+p.id+'">'+(p.stock?'Quick Add':'Notify Me')+'</button></div>'+
      '</div>'+
      '<div class="product-info">'+
        '<div class="p-cat">'+p.pearl+' Pearl · '+p.metal+'</div>'+
        '<h3>'+p.name+'</h3>'+
        '<div class="stars">'+starsHTML(p.rating)+'</div>'+
        '<div class="p-price">'+priceHTML+'</div>'+
        (p.stock?'':'<div style="font-size:11px;color:#A5433A;margin-top:5px;font-weight:700;">Out of stock</div>')+
      '</div>'+
    '</div>';
  }).join('');

  grid.removeAttribute('aria-busy');
  grid.querySelectorAll('.product-photo').forEach(function(img){
    if (img.complete) img.classList.add('loaded');
  });

  grid.querySelectorAll('[data-open]').forEach(function(el){
    el.addEventListener('click', function(){ openQuickView(parseInt(el.getAttribute('data-open'),10)); });
    var hover = el.getAttribute('data-hover');
    var main = el.getAttribute('data-main');
    if(hover){
      var photoEl = el.querySelector('.product-photo');
      el.addEventListener('mouseenter', function(){ if(photoEl) photoEl.src = hover; });
      el.addEventListener('mouseleave', function(){ if(photoEl) photoEl.src = main; });
    }
  });
  grid.querySelectorAll('[data-wish]').forEach(function(el){
    el.addEventListener('click', function(e){
      e.stopPropagation();
      var id = parseInt(el.getAttribute('data-wish'),10);
      wishlist[id] = !wishlist[id];
      el.classList.toggle('active');
      showToast(wishlist[id] ? 'Saved to your wishlist' : 'Removed from wishlist');
    });
  });
  grid.querySelectorAll('[data-quickadd]').forEach(function(el){
    el.addEventListener('click', function(e){
      e.stopPropagation();
      var id = parseInt(el.getAttribute('data-quickadd'),10);
      var p = byId(id);
      if(!p.stock){ showToast("We'll email you when it's back"); return; }
      addToCart(id,1);
    });
  });
  updateHeaderOnScroll();
}

/* ================= QUICK VIEW ================= */
var qvState = { id:null };
function openQuickView(id){
  var p = byId(id);
  qvState.id = id;
  qvState.metal = p.metal;
  var grid = document.getElementById('qvGrid');
  var metalOpts = METALS.map(function(m){ return '<button class="swatch'+(m===p.metal?' active':'')+'" data-metal="'+m+'">'+m+'</button>'; }).join('');
  var mediaHTML;
  if(p.photos.length){
    var thumbs = p.photos.map(function(url,i){
      return '<button class="qv-thumb'+(i===0?' active':'')+'" data-photo="'+url+'"><img src="'+url+'" alt="'+p.name+' view '+(i+1)+'" loading="lazy"></button>';
    }).join('');
    mediaHTML = '<div class="qv-media qv-media-photo">'+
      '<img class="qv-main-img" id="qvMainImg" src="'+p.photos[0]+'" alt="'+p.name+'">'+
      (p.photos.length>1 ? '<div class="qv-thumbs">'+thumbs+'</div>' : '')+
    '</div>';
  } else {
    mediaHTML = '<div class="qv-media">'+p.icon+'</div>';
  }
  grid.innerHTML =
    mediaHTML+
    '<div class="qv-body">'+
      '<div class="p-cat">'+p.pearl+' Pearl Collection</div>'+
      '<h2>'+p.name+'</h2>'+
      '<div class="stars">'+starsHTML(p.rating)+'</div>'+
      '<div class="price">'+money(p.price)+(p.was?' <span class="was" style="font-size:14px;">'+money(p.was)+'</span>':'')+'</div>'+
      '<p class="qv-desc">'+p.desc+'</p>'+
      '<div class="opt-group"><label class="title">Metal</label><div class="swatches" id="qvMetalSwatches">'+metalOpts+'</div></div>'+
      '<div class="opt-group"><label class="title">Quantity</label><div class="qty-stepper" style="width:96px;" id="qvQty"><button data-qv-dec>−</button><span id="qvQtyVal">1</span><button data-qv-inc>+</button></div></div>'+
      '<div class="qv-actions">'+
        '<button class="btn '+(p.stock?'btn-dark':'btn-line')+'" style="flex:1;" id="qvAddBtn">'+(p.stock?'Add to Bag — '+money(p.price):'Notify When Available')+'</button>'+
        '<button class="icon-btn" style="border:1px solid var(--line);width:44px;height:44px;" id="qvWishBtn" aria-label="Wishlist"><svg viewBox="0 0 24 24" fill="'+(wishlist[id]?'currentColor':'none')+'" style="color:'+(wishlist[id]?'#A5433A':'inherit')+';"><path d="M12 20s-7.5-4.6-9.6-9.3C1 7.4 3 4.5 6.2 4.5c2 0 3.5 1.1 5.8 3.4 2.3-2.3 3.8-3.4 5.8-3.4 3.2 0 5.2 2.9 3.8 6.2C19.5 15.4 12 20 12 20z" stroke="currentColor" stroke-width="1.6"/></svg></button>'+
      '</div>'+
      '<div class="qv-accordion">'+
        '<div class="acc-item"><div class="acc-head">Details &amp; Materials<svg viewBox="0 0 24 24" fill="none"><path d="M12 5v14M5 12h14" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg></div><div class="acc-body"><p>Hand-finished in '+p.metal+' and set with genuine '+p.pearl+' pearls. Hallmarked, with a signed Siera Pearl authenticity card included.</p></div></div>'+
        '<div class="acc-item"><div class="acc-head">Shipping &amp; Returns<svg viewBox="0 0 24 24" fill="none"><path d="M12 5v14M5 12h14" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg></div><div class="acc-body"><p>Complimentary insured shipping on every order. Free 30-day returns — pearls should be worn, not agonized over.</p></div></div>'+
        '<div class="acc-item"><div class="acc-head">Pearl Care<svg viewBox="0 0 24 24" fill="none"><path d="M12 5v14M5 12h14" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg></div><div class="acc-body"><p>Apply perfume and lotion before jewelry, wipe with a soft cloth after wear, and store flat away from other hard jewelry.</p></div></div>'+
      '</div>'+
    '</div>';

  grid.querySelectorAll('.acc-head').forEach(function(h){
    h.addEventListener('click', function(){ h.parentElement.classList.toggle('open'); });
  });
  grid.querySelectorAll('.qv-thumb').forEach(function(t){
    t.addEventListener('click', function(){
      var mainImg = grid.querySelector('#qvMainImg');
      var newSrc = t.getAttribute('data-photo');
      if (mainImg && mainImg.src !== newSrc) {
        mainImg.style.opacity = '0.35';
        mainImg.src = newSrc;
        mainImg.onload = function(){ mainImg.style.opacity = '1'; };
        if (mainImg.complete) mainImg.style.opacity = '1';
      }
      grid.querySelectorAll('.qv-thumb').forEach(function(x){ x.classList.remove('active'); });
      t.classList.add('active');
    });
  });
  grid.querySelectorAll('#qvMetalSwatches .swatch').forEach(function(s){
    s.addEventListener('click', function(){
      qvState.metal = s.getAttribute('data-metal');
      grid.querySelectorAll('#qvMetalSwatches .swatch').forEach(function(x){x.classList.remove('active');});
      s.classList.add('active');
    });
  });
  var qty = 1;
  grid.querySelector('[data-qv-dec]').addEventListener('click', function(){ qty=Math.max(1,qty-1); grid.querySelector('#qvQtyVal').textContent=qty; });
  grid.querySelector('[data-qv-inc]').addEventListener('click', function(){ qty=Math.min(10,qty+1); grid.querySelector('#qvQtyVal').textContent=qty; });
  grid.querySelector('#qvAddBtn').addEventListener('click', function(){
    if(!p.stock){ showToast("We'll email you when it's back"); return; }
    addToCart(id, qty, qvState.metal);
    closeQuickView();
  });
  grid.querySelector('#qvWishBtn').addEventListener('click', function(){
    wishlist[id] = !wishlist[id];
    openQuickView(id);
  });

  document.getElementById('qvModal').classList.add('open');
  document.getElementById('overlayBg').classList.add('show');
  document.body.style.overflow='hidden';
}
function closeQuickView(){
  document.getElementById('qvModal').classList.remove('open');
  if(!isAnyOverlayOpen()) { document.getElementById('overlayBg').classList.remove('show'); document.body.style.overflow=''; }
}

/* ================= CART ================= */
function addToCart(id, qty, metalOverride){
  qty = qty || 1;
  var existing = state.cart.find(function(l){ return l.id===id && l.metal===(metalOverride||byId(id).metal); });
  if(existing){ existing.qty += qty; }
  else{ state.cart.push({id:id, qty:qty, metal: metalOverride || byId(id).metal}); }
  renderCart();
  showToast('Added to your bag');
}
function removeFromCart(idx){ state.cart.splice(idx,1); renderCart(); }
function changeQty(idx, delta){
  state.cart[idx].qty += delta;
  if(state.cart[idx].qty<=0) state.cart.splice(idx,1);
  renderCart();
}
function cartTotals(){
  var subtotal = state.cart.reduce(function(sum,l){ return sum + byId(l.id).price*l.qty; },0);
  return { subtotal: subtotal };
}
function renderCart(){
  var count = state.cart.reduce(function(s,l){return s+l.qty;},0);
  document.getElementById('cartCount').textContent = count;
  document.getElementById('drawerCount').textContent = count;
  var wrap = document.getElementById('cartItemsWrap');
  var foot = document.getElementById('drawerFoot');
  if(!state.cart.length){
    wrap.innerHTML = '<div class="cart-empty"><svg viewBox="0 0 24 24" fill="none"><path d="M6 8h12l-1 12H7L6 8z" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/><path d="M9 8V6.5a3 3 0 0 1 6 0V8" stroke="currentColor" stroke-width="1.5"/></svg><h4 class="serif" style="font-size:17px;">Your bag is empty</h4><p style="font-size:13px;margin-top:6px;">Pearls are waiting to be found.</p><button class="btn btn-dark" style="margin-top:18px;" id="emptyShopBtn">Start Shopping</button></div>';
    document.getElementById('emptyShopBtn').addEventListener('click', function(){ closeCart(); document.getElementById('shop').scrollIntoView({behavior:'smooth'}); });
    foot.style.display='none';
  } else {
    foot.style.display='block';
    wrap.innerHTML = state.cart.map(function(l,idx){
      var p = byId(l.id);
      return '<div class="cart-line">'+
        '<div class="thumb">'+p.icon+'</div>'+
        '<div class="cart-line-info">'+
          '<div class="p-cat">'+p.pearl+' Pearl</div>'+
          '<h4>'+p.name+'</h4>'+
          '<div class="meta">'+l.metal+'</div>'+
          '<div class="line-bottom">'+
            '<div class="qty-stepper"><button data-dec="'+idx+'">−</button><span>'+l.qty+'</span><button data-inc="'+idx+'">+</button></div>'+
            '<div class="line-price">'+money(p.price*l.qty)+'</div>'+
          '</div>'+
          '<button class="remove-line" data-remove="'+idx+'">Remove</button>'+
        '</div>'+
      '</div>';
    }).join('');
    wrap.querySelectorAll('[data-inc]').forEach(function(b){ b.addEventListener('click', function(){ changeQty(parseInt(b.getAttribute('data-inc'),10), 1); }); });
    wrap.querySelectorAll('[data-dec]').forEach(function(b){ b.addEventListener('click', function(){ changeQty(parseInt(b.getAttribute('data-dec'),10), -1); }); });
    wrap.querySelectorAll('[data-remove]').forEach(function(b){ b.addEventListener('click', function(){ removeFromCart(parseInt(b.getAttribute('data-remove'),10)); }); });
  }
  var t = cartTotals();
  document.getElementById('cartSubtotal').textContent = money(t.subtotal);
  document.getElementById('cartTotal').textContent = money(t.subtotal);
  document.getElementById('checkoutBtn').disabled = state.cart.length===0;
  renderCheckoutSummary();
}
function isAnyOverlayOpen(){
  return document.getElementById('cartDrawer').classList.contains('open') ||
         document.getElementById('qvModal').classList.contains('open') ||
         document.getElementById('coModal').classList.contains('open') ||
         document.getElementById('mobileNav').classList.contains('open');
}
function openCart(){
  document.getElementById('cartDrawer').classList.add('open');
  document.getElementById('overlayBg').classList.add('show');
  document.body.style.overflow='hidden';
}
function closeCart(){
  document.getElementById('cartDrawer').classList.remove('open');
  if(!isAnyOverlayOpen()){ document.getElementById('overlayBg').classList.remove('show'); document.body.style.overflow=''; }
}

/* ================= TOAST ================= */
var toastTimer;
function showToast(msg){
  var t = document.getElementById('toast');
  document.getElementById('toastMsg').textContent = msg;
  t.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(function(){ t.classList.remove('show'); }, 2400);
}

/* ================= CHECKOUT ================= */
var coStep = 1;
var selectedShip = { price:0, days:"5–7 business days" };
function renderCheckoutSummary(){
  var items = document.getElementById('coItems');
  items.innerHTML = state.cart.map(function(l){
    var p = byId(l.id);
    return '<div class="co-item"><div class="thumb">'+p.icon+'</div><div><div class="ci-name">'+p.name+'</div><div class="ci-meta">'+l.metal+' · Qty '+l.qty+'</div></div><div class="ci-price">'+money(p.price*l.qty)+'</div></div>';
  }).join('');
  var t = cartTotals();
  var shipping = selectedShip.price;
  var tax = Math.round(t.subtotal*0.0);
  var total = t.subtotal + shipping + tax;
  document.getElementById('coSubtotal').textContent = money(t.subtotal);
  document.getElementById('coShipping').textContent = shipping===0 ? "Free" : money(shipping);
  document.getElementById('coTax').textContent = money(tax);
  document.getElementById('coGrandTotal').textContent = money(total);
  return total;
}
function goToStep(n){
  coStep = n;
  document.querySelectorAll('.co-panel').forEach(function(p){ p.classList.toggle('active', parseInt(p.getAttribute('data-panel'),10)===n); });
  document.querySelectorAll('.co-step').forEach(function(s){
    var sn = parseInt(s.getAttribute('data-step'),10);
    s.classList.toggle('active', sn===n);
    s.classList.toggle('done', sn<n);
  });
}
function validateField(fieldId, testFn){
  var el = document.getElementById(fieldId);
  var input = el.querySelector('input, select');
  var ok = testFn(input.value.trim());
  el.classList.toggle('error', !ok);
  return ok;
}
function openCheckout(){
  if(!state.cart.length) return;
  renderCheckoutSummary();
  goToStep(1);
  document.getElementById('coProcessing').style.display='flex';
  document.getElementById('coConfirm').style.display='none';
  document.getElementById('coModal').classList.add('open');
  document.getElementById('overlayBg').classList.add('show');
  document.body.style.overflow='hidden';
}
function closeCheckout(){
  document.getElementById('coModal').classList.remove('open');
  if(!isAnyOverlayOpen()){ document.getElementById('overlayBg').classList.remove('show'); document.body.style.overflow=''; }
}

document.getElementById('toStep2').addEventListener('click', function(){
  var ok = true;
  ok = validateField('f_fullName', function(v){return v.length>1;}) && ok;
  ok = validateField('f_email', function(v){return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);}) && ok;
  ok = validateField('f_address', function(v){return v.length>3;}) && ok;
  ok = validateField('f_city', function(v){return v.length>1;}) && ok;
  ok = validateField('f_state', function(v){return v.length>0;}) && ok;
  ok = validateField('f_zip', function(v){return v.length>=3;}) && ok;
  ok = validateField('f_phone', function(v){return v.replace(/\D/g,'').length>=7;}) && ok;
  if(ok) goToStep(2);
});
document.getElementById('toStep1').addEventListener('click', function(){ goToStep(1); });
document.getElementById('toStep3').addEventListener('click', function(){ goToStep(3); });
document.getElementById('toStep2b').addEventListener('click', function(){ goToStep(2); });

document.querySelectorAll('.ship-method').forEach(function(m){
  m.addEventListener('click', function(){
    document.querySelectorAll('.ship-method').forEach(function(x){ x.classList.remove('active'); x.querySelector('input').checked=false; });
    m.classList.add('active'); m.querySelector('input').checked=true;
    selectedShip = { price: parseInt(m.getAttribute('data-price'),10), days: m.getAttribute('data-days') };
    renderCheckoutSummary();
  });
});

/* card number formatting */
var cardNumInput = document.querySelector('#f_cardNum input');
cardNumInput.addEventListener('input', function(e){
  var v = e.target.value.replace(/\D/g,'').slice(0,16);
  var parts = v.match(/.{1,4}/g) || [];
  e.target.value = parts.join(' ');
  document.getElementById('cardVisualNum').textContent = (parts.join(' ') || '•••• •••• •••• ••••').padEnd(19,' ');
});
var cardExpInput = document.querySelector('#f_cardExp input');
cardExpInput.addEventListener('input', function(e){
  var v = e.target.value.replace(/\D/g,'').slice(0,4);
  if(v.length>=3) v = v.slice(0,2)+'/'+v.slice(2);
  e.target.value = v;
  document.getElementById('cardVisualExp').textContent = v || 'MM/YY';
});
var cardCvcInput = document.querySelector('#f_cardCvc input');
cardCvcInput.addEventListener('input', function(e){ e.target.value = e.target.value.replace(/\D/g,'').slice(0,4); });
var cardNameInput = document.querySelector('#f_cardName input');
cardNameInput.addEventListener('input', function(e){ document.getElementById('cardVisualName').textContent = e.target.value || 'Full Name'; });

document.getElementById('placeOrderBtn').addEventListener('click', function(){
  var ok = true;
  ok = validateField('f_cardName', function(v){return v.length>1;}) && ok;
  ok = validateField('f_cardNum', function(v){return v.replace(/\s/g,'').length===16;}) && ok;
  ok = validateField('f_cardExp', function(v){
    if(!/^\d{2}\/\d{2}$/.test(v)) return false;
    var mm = parseInt(v.slice(0,2),10), yy = parseInt(v.slice(3,5),10);
    if(mm<1||mm>12) return false;
    var now = new Date(); var curYY = now.getFullYear()%100; var curMM = now.getMonth()+1;
    if(yy<curYY || (yy===curYY && mm<curMM)) return false;
    return true;
  }) && ok;
  ok = validateField('f_cardCvc', function(v){return v.length>=3;}) && ok;
  if(!ok) return;

  goToStep(4);
  document.getElementById('coProcessing').style.display='flex';
  document.getElementById('coConfirm').style.display='none';

  setTimeout(function(){
    var total = renderCheckoutSummary();
    var orderNum = 'SP-' + Math.floor(100000 + Math.random()*899999);
    var email = document.querySelector('#f_email input').value.trim();
    var d = new Date();
    var minDays = selectedShip.price===65 ? 1 : (selectedShip.price===28 ? 2 : 5);
    var maxDays = selectedShip.price===65 ? 1 : (selectedShip.price===28 ? 3 : 7);
    var fmt = function(dt){ return dt.toLocaleDateString('en-US', {month:'short', day:'numeric'}); };
    var d1 = new Date(d); d1.setDate(d.getDate()+minDays);
    var d2 = new Date(d); d2.setDate(d.getDate()+maxDays);
    document.getElementById('confirmEmail').textContent = email || 'your inbox';
    document.getElementById('confirmOrderNum').textContent = orderNum;
    document.getElementById('confirmDelivery').textContent = (minDays===maxDays) ? fmt(d1) : (fmt(d1)+' – '+fmt(d2));
    document.getElementById('confirmTotal').textContent = money(total);

    document.getElementById('coProcessing').style.display='none';
    document.getElementById('coConfirm').style.display='block';

    state.cart = [];
    renderCart();
  }, 1900);
});

document.getElementById('backToShopBtn').addEventListener('click', function(){
  closeCheckout();
  document.getElementById('shop').scrollIntoView({behavior:'smooth'});
});

document.getElementById('promoBtn').addEventListener('click', function(){
  var v = document.getElementById('promoInput').value.trim();
  if(v) showToast('Promo codes are validated at checkout confirmation');
});

/* ================= TESTIMONIALS ================= */
var TESTIMONIALS = [
  {name:"Naly S.", loc:"Verified Buyer", rating:5, text:"The Akoya strand is even more luminous in person. It arrived beautifully boxed with an authenticity card — already an heirloom."},
  {name:"Marcus T.", loc:"Verified Buyer", rating:5, text:"Bought the Tahitian statement ring for my wife. The colour shifts from green to violet in the light — nothing off the shelf compares."},
  {name:"Priya R.", loc:"Verified Buyer", rating:4, text:"Checkout was refreshingly quick and the packaging felt genuinely special. My freshwater studs are now in daily rotation."}
];
document.getElementById('testiGrid').innerHTML = TESTIMONIALS.map(function(t){
  return '<div class="testi-card"><div class="stars">'+starsHTML(t.rating)+'</div><p>“'+t.text+'”</p><div class="who">'+t.name+' · '+t.loc+'</div></div>';
}).join('');

/* ================= WIRING ================= */
initProducts(function() {
  buildFilterOpts();
  renderShop();
  renderCart();
});

document.querySelectorAll('[data-cat]').forEach(function(el){
  el.addEventListener('click', function(e){
    e.preventDefault();
    setCategoryFilter(el.getAttribute('data-cat'));
    closeMobileNav();
  });
});
document.getElementById('storyLink').addEventListener('click', function(){ document.getElementById('story').scrollIntoView({behavior:'smooth'}); });
document.getElementById('storyShopBtn').addEventListener('click', function(){ setCategoryFilter('all'); });
document.getElementById('heroShopBtn').addEventListener('click', function(){ setCategoryFilter('all'); });
document.getElementById('heroStoryBtn').addEventListener('click', function(){ document.getElementById('story').scrollIntoView({behavior:'smooth'}); });

document.getElementById('cartBtn').addEventListener('click', openCart);
document.getElementById('cartCloseBtn').addEventListener('click', closeCart);
document.getElementById('continueShoppingBtn').addEventListener('click', closeCart);
document.getElementById('checkoutBtn').addEventListener('click', function(){ closeCart(); openCheckout(); });
document.getElementById('coCloseBtn').addEventListener('click', closeCheckout);
document.getElementById('qvCloseBtn').addEventListener('click', closeQuickView);
document.getElementById('overlayBg').addEventListener('click', function(){
  closeCart(); closeQuickView(); closeCheckout(); closeMobileNav();
});
document.getElementById('acctBtn').addEventListener('click', function(){ showToast('Account sign-in coming soon'); });
document.getElementById('wishHeaderBtn').addEventListener('click', function(){
  var n = Object.keys(wishlist).filter(function(k){return wishlist[k];}).length;
  showToast(n ? (n+' item'+(n>1?'s':'')+' saved to your wishlist') : 'Your wishlist is empty');
});

document.getElementById('sortSelect').addEventListener('change', function(e){ state.sort = e.target.value; renderShop(); });

var searchDebounce;
document.getElementById('searchInput').addEventListener('input', function(e){
  clearTimeout(searchDebounce);
  var v = e.target.value;
  searchDebounce = setTimeout(function(){ state.filters.search = v.trim(); renderShop(); }, 200);
});

document.getElementById('newsletterForm').addEventListener('submit', function(e){
  e.preventDefault();
  showToast('Welcome to the Siera circle');
  e.target.reset();
});

function closeMobileNav(){
  document.getElementById('mobileNav').classList.remove('open');
  if(!isAnyOverlayOpen()){ document.getElementById('overlayBg').classList.remove('show'); document.body.style.overflow=''; }
}
document.getElementById('hamburgerBtn').addEventListener('click', function(){
  document.getElementById('mobileNav').classList.add('open');
  document.getElementById('overlayBg').classList.add('show');
});

document.addEventListener('keydown', function(e){
  if(e.key==='Escape'){ closeCart(); closeQuickView(); closeCheckout(); closeMobileNav(); }
});

/* ================= HEADER SCROLL BEHAVIOR ================= */
var scrollTicking = false;

function updateHeaderOnScroll() {
  var header = document.querySelector('header.site');
  if (!header) return;

  var currentScroll = window.pageYOffset || document.documentElement.scrollTop || 0;
  var scrollableHeight = document.documentElement.scrollHeight - window.innerHeight;

  // 1. If the page doesn't have enough scrollable room (less than 120px),
  // never shrink to prevent scroll clamping, layout shifts, and visual twitching.
  if (scrollableHeight < 120) {
    if (header.classList.contains('shrink')) {
      header.classList.remove('shrink');
    }
    return;
  }

  // 2. Threshold with hysteresis to prevent any boundary oscillation:
  // - Shrink once scrolled past the announcement bar & initial header (>= 80px)
  // - Only unshrink when scrolled cleanly back to the top (<= 25px)
  // The 55px gap ensures header height transition (26px) can never trigger an unshrink loop.
  if (currentScroll >= 80) {
    if (!header.classList.contains('shrink')) {
      header.classList.add('shrink');
    }
  } else if (currentScroll <= 25) {
    if (header.classList.contains('shrink')) {
      header.classList.remove('shrink');
    }
  }
}

window.addEventListener('scroll', function() {
  if (!scrollTicking) {
    window.requestAnimationFrame(function() {
      updateHeaderOnScroll();
      scrollTicking = false;
    });
    scrollTicking = true;
  }
}, { passive: true });

window.addEventListener('resize', function() {
  if (!scrollTicking) {
    window.requestAnimationFrame(function() {
      updateHeaderOnScroll();
      scrollTicking = false;
    });
    scrollTicking = true;
  }
}, { passive: true });

})();