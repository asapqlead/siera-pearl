/* ============================================================
   Siera Pearl — Product Manager (Supabase-backed)
   Premium Admin Dashboard
   Requires config.js to be filled in with a real project URL + anon key.
   ============================================================ */
(function () {
  "use strict";

  /* ---------- Config check ---------- */
  var cfg = window.SUPABASE_CONFIG || {};
  var configured = cfg.url && cfg.url.indexOf("YOUR_SUPABASE") === -1 &&
                    cfg.anonKey && cfg.anonKey.indexOf("YOUR_SUPABASE") === -1;

  var el = function (id) { return document.getElementById(id); };

  var loginScreen = el("loginScreen");
  var app = el("app");
  var configWarning = el("configWarning");

  if (!configured) {
    configWarning.hidden = false;
    el("loginBtn").disabled = true;
    return;
  }

  var sb = window.supabase.createClient(cfg.url, cfg.anonKey);

  var BUCKET = "product-photos";
  var MAX_STOCK = 30; // for inventory bar percentage calc

  var state = {
    products: [],
    editingPhotos: [],
    deletedPhotoUrls: [],
    currentView: "dashboard",
    sortCol: null,
    sortDir: "asc",
    selected: new Set()
  };

  /* ================================================================
     AUTH
     ================================================================ */
  el("loginForm").addEventListener("submit", function (e) {
    e.preventDefault();
    var btn = el("loginBtn");
    var errEl = el("loginError");
    errEl.hidden = true;
    btn.disabled = true;
    btn.innerHTML = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="12" cy="12" r="10" opacity="0.25"/><path d="M12 2a10 10 0 0 1 10 10" stroke-dasharray="31.4" stroke-dashoffset="0"><animateTransform attributeName="transform" type="rotate" from="0 12 12" to="360 12 12" dur="0.8s" repeatCount="indefinite"/></path></svg> Signing in…';

    sb.auth.signInWithPassword({
      email: el("email").value.trim(),
      password: el("password").value
    }).then(function (res) {
      btn.disabled = false;
      btn.innerHTML = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"/><polyline points="10 17 15 12 10 7"/><line x1="15" y1="12" x2="3" y2="12"/></svg> Sign in';
      if (res.error) {
        errEl.textContent = res.error.message;
        errEl.hidden = false;
        return;
      }
      showApp(res.data.session);
    });
  });

  el("logoutBtn").addEventListener("click", function () {
    sb.auth.signOut().then(function () { location.reload(); });
  });

  sb.auth.getSession().then(function (res) {
    if (res.data.session) showApp(res.data.session);
  });

  function showApp(session) {
    loginScreen.hidden = true;
    app.hidden = false;

    var email = session.user.email;
    el("userEmail").textContent = email;
    el("userAvatar").textContent = (email || "A").charAt(0).toUpperCase();

    loadProducts();
  }

  /* ================================================================
     NAVIGATION / VIEW ROUTING
     ================================================================ */
  var navItems = document.querySelectorAll("[data-view]");
  navItems.forEach(function (item) {
    item.addEventListener("click", function () {
      switchView(item.getAttribute("data-view"));
    });
  });

  function switchView(viewName) {
    state.currentView = viewName;

    // Update nav active state
    navItems.forEach(function (item) {
      item.classList.toggle("active", item.getAttribute("data-view") === viewName);
    });

    // Update breadcrumb
    var labels = { dashboard: "Dashboard", products: "Products", inventory: "Inventory" };
    el("breadcrumbPage").textContent = labels[viewName] || viewName;

    // Show/hide views
    document.querySelectorAll(".view").forEach(function (v) { v.classList.remove("active"); });
    var viewMap = { dashboard: "viewDashboard", products: "viewProducts", inventory: "viewInventory" };
    var target = el(viewMap[viewName]);
    if (target) {
      target.classList.add("active");
      // Force re-render of animation
      target.style.animation = "none";
      target.offsetHeight; // trigger reflow
      target.style.animation = "";
    }

    // Close mobile sidebar
    closeMobileSidebar();

    // Render view-specific content
    if (viewName === "dashboard") renderDashboard();
    if (viewName === "products") renderTable();
    if (viewName === "inventory") renderInventory();
  }

  /* Mobile sidebar toggle */
  el("sidebarToggle").addEventListener("click", function () {
    el("sidebar").classList.toggle("open");
    el("sidebarOverlay").classList.toggle("visible");
  });

  el("sidebarOverlay").addEventListener("click", closeMobileSidebar);

  function closeMobileSidebar() {
    el("sidebar").classList.remove("open");
    el("sidebarOverlay").classList.remove("visible");
  }

  /* Refresh button */
  el("refreshBtn").addEventListener("click", function () {
    loadProducts();
  });

  /* ================================================================
     DATA LOADING
     ================================================================ */
  function loadProducts() {
    var tbody = el("productTableBody");
    tbody.innerHTML = '<tr><td colspan="9" class="loading-row">Loading products…</td></tr>';

    sb.from("products").select("*").order("sort_order", { ascending: true })
      .then(function (res) {
        if (res.error) { showToast(res.error.message, "error"); return; }
        state.products = res.data || [];
        state.selected.clear();
        updateSelectAll();

        // Update low stock badge
        var lowCount = state.products.filter(function (p) { return p.in_stock && p.stock_qty <= 5; }).length;
        var outCount = state.products.filter(function (p) { return !p.in_stock || p.stock_qty === 0; }).length;
        var badgeEl = el("lowStockBadge");
        var alertCount = lowCount + outCount;
        if (alertCount > 0) {
          badgeEl.textContent = alertCount;
          badgeEl.hidden = false;
        } else {
          badgeEl.hidden = true;
        }

        // Re-render current view
        if (state.currentView === "dashboard") renderDashboard();
        if (state.currentView === "products") renderTable();
        if (state.currentView === "inventory") renderInventory();
      });
  }

  /* ================================================================
     DASHBOARD VIEW
     ================================================================ */
  function renderDashboard() {
    var products = state.products;
    var total = products.length;
    var inStock = products.filter(function (p) { return p.in_stock && p.stock_qty > 0; }).length;
    var outOfStock = products.filter(function (p) { return !p.in_stock || p.stock_qty === 0; }).length;
    var lowStock = products.filter(function (p) { return p.in_stock && p.stock_qty > 0 && p.stock_qty <= 5; }).length;
    var totalValue = products.reduce(function (sum, p) { return sum + (p.price * p.stock_qty); }, 0);
    var totalUnits = products.reduce(function (sum, p) { return sum + p.stock_qty; }, 0);

    el("statsGrid").innerHTML =
      statCard("gold", '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"/><line x1="7" y1="7" x2="7.01" y2="7"/></svg>', total, "Total Products") +
      statCard("green", '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>', inStock, "In Stock") +
      statCard("red", '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>', outOfStock, "Out of Stock") +
      statCard("warning", '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>', lowStock, "Low Stock (≤5)") +
      statCard("blue", '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>', "$" + totalValue.toLocaleString(), "Inventory Value") +
      statCard("gold", '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/></svg>', totalUnits.toLocaleString(), "Total Units");

    // Category breakdown
    var cats = {};
    products.forEach(function (p) { cats[p.cat] = (cats[p.cat] || 0) + 1; });
    var catEntries = Object.keys(cats).map(function (k) { return { name: k, count: cats[k] }; });
    catEntries.sort(function (a, b) { return b.count - a.count; });
    var maxCount = catEntries.length > 0 ? catEntries[0].count : 1;

    el("catBreakdown").innerHTML = catEntries.length === 0
      ? '<div class="empty-dash-message">No products yet</div>'
      : catEntries.map(function (c) {
          var pct = Math.round((c.count / total) * 100);
          return '<div class="cat-bar-item">' +
            '<div class="cat-bar-header"><span class="cat-bar-name">' + esc(c.name) + '</span><span class="cat-bar-count">' + c.count + ' (' + pct + '%)</span></div>' +
            '<div class="cat-bar-track"><div class="cat-bar-fill" style="width:' + ((c.count / maxCount) * 100) + '%"></div></div>' +
            '</div>';
        }).join("");

    // Low stock alerts
    var lowItems = products.filter(function (p) { return p.stock_qty <= 5; })
      .sort(function (a, b) { return a.stock_qty - b.stock_qty; })
      .slice(0, 8);

    el("lowStockAlerts").innerHTML = lowItems.length === 0
      ? '<div class="empty-dash-message">All products are well stocked 🎉</div>'
      : lowItems.map(function (p) {
          var photo = (p.photos && p.photos[0])
            ? '<img class="low-stock-thumb" src="' + esc(p.photos[0]) + '" alt="">'
            : '<div class="low-stock-thumb-fallback">' + esc((p.name || "?").charAt(0)) + '</div>';
          var qtyClass = p.stock_qty === 0 ? "danger" : "warn";
          return '<div class="low-stock-item" data-edit-id="' + p.id + '">' +
            photo +
            '<div class="low-stock-info"><div class="low-stock-name">' + esc(p.name) + '</div><div class="low-stock-cat">' + esc(p.cat) + '</div></div>' +
            '<span class="low-stock-qty ' + qtyClass + '">' + (p.stock_qty === 0 ? "Out" : p.stock_qty + " left") + '</span>' +
            '</div>';
        }).join("");

    // Click to edit from dashboard
    document.querySelectorAll("[data-edit-id]").forEach(function (item) {
      item.addEventListener("click", function () {
        switchView("products");
        setTimeout(function () { openModal(Number(item.getAttribute("data-edit-id"))); }, 100);
      });
    });
  }

  function statCard(colorClass, iconSvg, value, label) {
    return '<div class="stat-card">' +
      '<div class="stat-icon ' + colorClass + '">' + iconSvg + '</div>' +
      '<div class="stat-value">' + value + '</div>' +
      '<div class="stat-label">' + label + '</div>' +
      '</div>';
  }

  /* ================================================================
     PRODUCTS TABLE
     ================================================================ */
  function renderTable() {
    var search = el("searchInput").value.trim().toLowerCase();
    var cat = el("filterCat").value;
    var stockFilter = el("filterStock").value;

    var list = state.products.filter(function (p) {
      if (cat && p.cat !== cat) return false;
      if (stockFilter === "in" && (!p.in_stock || p.stock_qty === 0)) return false;
      if (stockFilter === "out" && (p.in_stock && p.stock_qty > 0)) return false;
      if (stockFilter === "low" && (p.stock_qty > 5 || p.stock_qty === 0)) return false;
      if (search && (p.name + " " + p.cat + " " + p.metal + " " + p.pearl + " " + p.slug).toLowerCase().indexOf(search) === -1) return false;
      return true;
    });

    // Sorting
    if (state.sortCol) {
      var col = state.sortCol;
      var dir = state.sortDir === "asc" ? 1 : -1;
      list.sort(function (a, b) {
        var av = a[col], bv = b[col];
        if (typeof av === "string") { av = av.toLowerCase(); bv = bv.toLowerCase(); }
        if (av < bv) return -1 * dir;
        if (av > bv) return 1 * dir;
        return 0;
      });
    }

    // Update count
    el("productCount").textContent = list.length + " of " + state.products.length + " products";

    var tbody = el("productTableBody");
    if (!list.length) {
      tbody.innerHTML = '<tr><td colspan="9" class="empty-row">No products match your filters.</td></tr>';
      el("tableInfo").textContent = "0 products";
      return;
    }

    tbody.innerHTML = list.map(function (p) {
      var photo = (p.photos && p.photos[0])
        ? '<img class="row-photo" src="' + esc(p.photos[0]) + '" alt="" loading="lazy">'
        : '<div class="row-photo-fallback">' + esc((p.name || "?").charAt(0)) + '</div>';
      var was = p.was ? '<span class="price-was">$' + Number(p.was).toLocaleString() + '</span>' : '';

      var stockClass = "in";
      var stockText = "In stock · " + p.stock_qty;
      if (!p.in_stock || p.stock_qty === 0) {
        stockClass = "out";
        stockText = "Out of stock";
      } else if (p.stock_qty <= 5) {
        stockClass = "low";
        stockText = "Low · " + p.stock_qty;
      }

      var badge = p.badge ? '<span class="badge-pill">' + esc(p.badge) + '</span>' : '<span style="color:var(--text-tertiary);">—</span>';
      var checked = state.selected.has(p.id) ? " checked" : "";

      return '<tr>' +
        '<td class="col-check"><input type="checkbox" class="row-check" data-id="' + p.id + '"' + checked + '></td>' +
        '<td class="col-photo">' + photo + '</td>' +
        '<td><div class="row-name">' + esc(p.name) + '</div><div class="row-sub">' + esc(p.slug) + '</div></td>' +
        '<td>' + esc(p.cat) + '</td>' +
        '<td><div>' + esc(p.metal) + '</div><div class="row-sub">' + esc(p.pearl) + '</div></td>' +
        '<td>$' + Number(p.price).toLocaleString() + was + '</td>' +
        '<td><span class="stock-pill ' + stockClass + '">' + stockText + '</span></td>' +
        '<td>' + badge + '</td>' +
        '<td><div class="row-actions">' +
          '<button class="btn-icon" data-edit="' + p.id + '" title="Edit product"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg></button>' +
        '</div></td>' +
        '</tr>';
    }).join("");

    el("tableInfo").textContent = "Showing " + list.length + " of " + state.products.length;

    // Event: edit buttons
    tbody.querySelectorAll("[data-edit]").forEach(function (btn) {
      btn.addEventListener("click", function () { openModal(Number(btn.getAttribute("data-edit"))); });
    });

    // Event: row checkboxes
    tbody.querySelectorAll(".row-check").forEach(function (cb) {
      cb.addEventListener("change", function () {
        var id = Number(cb.getAttribute("data-id"));
        if (cb.checked) { state.selected.add(id); } else { state.selected.delete(id); }
        updateSelectAll();
        updateBulkActions();
      });
    });

    updateBulkActions();
  }

  /* Sorting */
  document.querySelectorAll(".product-table th.sortable").forEach(function (th) {
    th.addEventListener("click", function () {
      var col = th.getAttribute("data-sort");
      if (state.sortCol === col) {
        state.sortDir = state.sortDir === "asc" ? "desc" : "asc";
      } else {
        state.sortCol = col;
        state.sortDir = "asc";
      }

      // Update sort indicators
      document.querySelectorAll(".product-table th.sortable").forEach(function (h) {
        h.classList.remove("sort-asc", "sort-desc");
      });
      th.classList.add(state.sortDir === "asc" ? "sort-asc" : "sort-desc");

      renderTable();
    });
  });

  /* Filters */
  el("searchInput").addEventListener("input", renderTable);
  el("filterCat").addEventListener("change", renderTable);
  el("filterStock").addEventListener("change", renderTable);

  /* Select All */
  el("selectAll").addEventListener("change", function () {
    var checked = el("selectAll").checked;
    state.selected.clear();
    if (checked) {
      state.products.forEach(function (p) { state.selected.add(p.id); });
    }
    document.querySelectorAll(".row-check").forEach(function (cb) { cb.checked = checked; });
    updateBulkActions();
  });

  function updateSelectAll() {
    var all = state.products.length;
    var sel = state.selected.size;
    el("selectAll").checked = all > 0 && sel === all;
    el("selectAll").indeterminate = sel > 0 && sel < all;
  }

  function updateBulkActions() {
    var ba = el("bulkActions");
    if (state.selected.size > 0) {
      ba.classList.add("visible");
      el("bulkDeleteBtn").textContent = "Delete " + state.selected.size + " selected";
    } else {
      ba.classList.remove("visible");
    }
  }

  /* Bulk delete */
  el("bulkDeleteBtn").addEventListener("click", function () {
    if (!state.selected.size) return;
    if (!confirm("Delete " + state.selected.size + " products? This can't be undone.")) return;

    var ids = Array.from(state.selected);
    sb.from("products").delete().in("id", ids).then(function (res) {
      if (res.error) { showToast(res.error.message, "error"); return; }
      showToast(ids.length + " products deleted.", "success");
      loadProducts();
    });
  });

  /* ================================================================
     INVENTORY VIEW
     ================================================================ */
  function renderInventory() {
    var search = el("invSearch").value.trim().toLowerCase();
    var stockFilter = el("invFilterStock").value;

    var list = state.products.filter(function (p) {
      if (stockFilter === "low" && (p.stock_qty > 5 || p.stock_qty === 0)) return false;
      if (stockFilter === "out" && (p.in_stock && p.stock_qty > 0)) return false;
      if (stockFilter === "in" && (!p.in_stock || p.stock_qty === 0)) return false;
      if (search && (p.name + " " + p.cat).toLowerCase().indexOf(search) === -1) return false;
      return true;
    });

    var grid = el("inventoryGrid");
    if (!list.length) {
      grid.innerHTML = '<div class="empty-dash-message" style="grid-column:1/-1;padding:60px 0;">No products match.</div>';
      return;
    }

    grid.innerHTML = list.map(function (p) {
      var photo = (p.photos && p.photos[0])
        ? '<img class="inv-card-photo" src="' + esc(p.photos[0]) + '" alt="" loading="lazy">'
        : '<div class="inv-card-photo-fallback">' + esc((p.name || "?").charAt(0)) + '</div>';

      var pct = Math.min(100, Math.round((p.stock_qty / MAX_STOCK) * 100));
      var level = "good";
      if (p.stock_qty === 0 || !p.in_stock) level = "crit";
      else if (p.stock_qty <= 5) level = "warn";

      return '<div class="inv-card" data-product-id="' + p.id + '">' +
        '<div class="inv-card-top">' + photo +
        '<div class="inv-card-info"><div class="inv-card-name">' + esc(p.name) + '</div>' +
        '<div class="inv-card-meta">' + esc(p.cat) + ' · $' + Number(p.price).toLocaleString() + '</div></div></div>' +
        '<div class="inv-stock-bar">' +
        '<div class="inv-stock-bar-header"><span class="inv-stock-label">Stock level</span>' +
        '<span class="inv-stock-num ' + level + '">' + p.stock_qty + ' units</span></div>' +
        '<div class="inv-stock-track"><div class="inv-stock-fill ' + level + '" style="width:' + pct + '%"></div></div></div>' +
        '<div class="inv-card-controls">' +
        '<div class="inv-qty-group">' +
        '<button class="inv-qty-btn" data-adj="-1" data-pid="' + p.id + '">−</button>' +
        '<input class="inv-qty-input" type="number" min="0" value="' + p.stock_qty + '" data-qty-input="' + p.id + '">' +
        '<button class="inv-qty-btn" data-adj="1" data-pid="' + p.id + '">+</button>' +
        '</div>' +
        '<label class="inv-toggle-stock">' +
        '<input type="checkbox" ' + (p.in_stock ? 'checked' : '') + ' data-stock-toggle="' + p.id + '"> Available</label>' +
        '</div></div>';
    }).join("");

    // Event: +/- buttons
    grid.querySelectorAll("[data-adj]").forEach(function (btn) {
      btn.addEventListener("click", function () {
        var pid = Number(btn.getAttribute("data-pid"));
        var adj = Number(btn.getAttribute("data-adj"));
        var input = grid.querySelector('[data-qty-input="' + pid + '"]');
        var newVal = Math.max(0, Number(input.value) + adj);
        input.value = newVal;
        saveStockQty(pid, newVal);
      });
    });

    // Event: qty input direct edit
    grid.querySelectorAll("[data-qty-input]").forEach(function (input) {
      var debounce = null;
      input.addEventListener("change", function () {
        clearTimeout(debounce);
        var pid = Number(input.getAttribute("data-qty-input"));
        var val = Math.max(0, Number(input.value));
        input.value = val;
        debounce = setTimeout(function () { saveStockQty(pid, val); }, 300);
      });
    });

    // Event: in-stock toggle
    grid.querySelectorAll("[data-stock-toggle]").forEach(function (cb) {
      cb.addEventListener("change", function () {
        var pid = Number(cb.getAttribute("data-stock-toggle"));
        saveInStock(pid, cb.checked);
      });
    });
  }

  function saveStockQty(id, qty) {
    sb.from("products").update({ stock_qty: qty }).eq("id", id).then(function (res) {
      if (res.error) { showToast("Failed to update stock: " + res.error.message, "error"); return; }
      var p = state.products.find(function (x) { return x.id === id; });
      if (p) p.stock_qty = qty;
      showToast("Stock updated", "success");
      // Re-render dashboard if we go back
      if (state.currentView === "dashboard") renderDashboard();
    });
  }

  function saveInStock(id, inStock) {
    sb.from("products").update({ in_stock: inStock }).eq("id", id).then(function (res) {
      if (res.error) { showToast("Failed to update: " + res.error.message, "error"); return; }
      var p = state.products.find(function (x) { return x.id === id; });
      if (p) p.in_stock = inStock;
      showToast(inStock ? "Product marked as available" : "Product marked as unavailable", "success");
    });
  }

  el("invSearch").addEventListener("input", renderInventory);
  el("invFilterStock").addEventListener("change", renderInventory);

  /* ================================================================
     TOAST / NOTIFICATIONS
     ================================================================ */
  function showToast(msg, type) {
    var container = el("toastContainer");
    var toast = document.createElement("div");
    toast.className = "toast " + (type || "success");

    var iconSvg = type === "error"
      ? '<svg class="toast-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>'
      : '<svg class="toast-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>';

    toast.innerHTML = iconSvg +
      '<span>' + esc(msg) + '</span>' +
      '<button class="toast-close" aria-label="Dismiss">' +
      '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg></button>';

    container.appendChild(toast);

    toast.querySelector(".toast-close").addEventListener("click", function () { removeToast(toast); });

    setTimeout(function () { removeToast(toast); }, 4000);
  }

  function removeToast(toast) {
    if (!toast.parentNode) return;
    toast.classList.add("removing");
    setTimeout(function () { if (toast.parentNode) toast.parentNode.removeChild(toast); }, 200);
  }

  /* ================================================================
     ESCAPE UTILITY
     ================================================================ */
  function esc(s) {
    return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }

  /* ================================================================
     MODAL: ADD / EDIT PRODUCT
     ================================================================ */
  var overlay = el("modalOverlay");
  var form = el("productForm");

  el("addProductBtn").addEventListener("click", function () { openModal(null); });
  el("modalClose").addEventListener("click", closeModal);
  el("cancelBtn").addEventListener("click", closeModal);
  overlay.addEventListener("click", function (e) { if (e.target === overlay) closeModal(); });

  /* Keyboard: Escape closes modal */
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && !overlay.hidden) closeModal();
  });

  /* Tab switching */
  document.querySelectorAll(".modal-tab").forEach(function (tab) {
    tab.addEventListener("click", function () {
      var tabName = tab.getAttribute("data-tab");
      document.querySelectorAll(".modal-tab").forEach(function (t) { t.classList.remove("active"); });
      document.querySelectorAll(".tab-panel").forEach(function (p) { p.classList.remove("active"); });
      tab.classList.add("active");

      var panelMap = { general: "tabGeneral", pricing: "tabPricing", inventory: "tabInventory", photos: "tabPhotos" };
      el(panelMap[tabName]).classList.add("active");
    });
  });

  function openModal(id) {
    var p = id ? state.products.find(function (x) { return x.id === id; }) : null;
    el("modalTitle").textContent = p ? "Edit product" : "New product";
    el("f_id").value = p ? p.id : "";
    el("f_name").value = p ? p.name : "";
    el("f_slug").value = p ? p.slug : "";
    el("f_cat").value = p ? p.cat : "Necklaces";
    el("f_metal").value = p ? p.metal : "Yellow Gold";
    el("f_pearl").value = p ? p.pearl : "Akoya";
    el("f_price").value = p ? p.price : "";
    el("f_was").value = p && p.was ? p.was : "";
    el("f_badge").value = p && p.badge ? p.badge : "";
    el("f_rating").value = p ? p.rating : "5";
    el("f_qty").value = p ? p.stock_qty : 0;
    el("f_instock").checked = p ? !!p.in_stock : true;
    el("f_desc").value = p ? p.description || "" : "";
    el("deleteBtn").hidden = !p;
    el("formError").hidden = true;

    state.editingPhotos = p && p.photos ? p.photos.slice() : [];
    state.deletedPhotoUrls = [];
    renderPhotoGrid();

    // Reset to General tab
    document.querySelectorAll(".modal-tab").forEach(function (t) { t.classList.remove("active"); });
    document.querySelectorAll(".tab-panel").forEach(function (p) { p.classList.remove("active"); });
    document.querySelector('.modal-tab[data-tab="general"]').classList.add("active");
    el("tabGeneral").classList.add("active");

    overlay.hidden = false;
    // Focus the name field after animation
    setTimeout(function () { el("f_name").focus(); }, 100);
  }

  function closeModal() {
    overlay.hidden = true;
  }

  /* Auto-slug from name for new products */
  el("f_name").addEventListener("input", function () {
    if (el("f_id").value) return;
    el("f_slug").value = el("f_name").value.toLowerCase()
      .trim().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
  });

  /* ================================================================
     PHOTOS
     ================================================================ */
  function renderPhotoGrid() {
    var grid = el("photoGrid");
    grid.innerHTML = state.editingPhotos.map(function (url, i) {
      return '<div class="photo-thumb' + (i === 0 ? ' main-photo' : '') + '" draggable="true" data-idx="' + i + '">' +
        '<img src="' + esc(url) + '" alt="">' +
        '<button type="button" class="photo-remove" data-remove="' + i + '">✕</button>' +
        '</div>';
    }).join("");

    grid.querySelectorAll("[data-remove]").forEach(function (btn) {
      btn.addEventListener("click", function () {
        var i = Number(btn.getAttribute("data-remove"));
        state.deletedPhotoUrls.push(state.editingPhotos[i]);
        state.editingPhotos.splice(i, 1);
        renderPhotoGrid();
      });
    });

    // Drag-to-reorder
    var dragIdx = null;
    grid.querySelectorAll(".photo-thumb").forEach(function (thumb) {
      thumb.addEventListener("dragstart", function () { dragIdx = Number(thumb.getAttribute("data-idx")); });
      thumb.addEventListener("dragover", function (e) { e.preventDefault(); });
      thumb.addEventListener("drop", function () {
        var dropIdx = Number(thumb.getAttribute("data-idx"));
        if (dragIdx === null || dragIdx === dropIdx) return;
        var moved = state.editingPhotos.splice(dragIdx, 1)[0];
        state.editingPhotos.splice(dropIdx, 0, moved);
        renderPhotoGrid();
      });
    });
  }

  /* Photo drop zone + click-to-upload */
  var dropZone = el("photoDropZone");

  dropZone.addEventListener("click", function () { el("photoInput").click(); });

  dropZone.addEventListener("dragover", function (e) {
    e.preventDefault();
    dropZone.classList.add("dragover");
  });

  dropZone.addEventListener("dragleave", function () {
    dropZone.classList.remove("dragover");
  });

  dropZone.addEventListener("drop", function (e) {
    e.preventDefault();
    dropZone.classList.remove("dragover");
    var files = Array.prototype.slice.call(e.dataTransfer.files).filter(function (f) {
      return f.type.startsWith("image/");
    });
    if (files.length) uploadPhotos(files);
  });

  el("photoInput").addEventListener("change", function () {
    var files = Array.prototype.slice.call(el("photoInput").files);
    if (files.length) uploadPhotos(files);
    el("photoInput").value = "";
  });

  function uploadPhotos(files) {
    var slug = el("f_slug").value.trim();
    if (!slug) { showFormError("Set a slug before uploading photos."); return; }

    dropZone.innerHTML = '<div style="color:var(--gold);">Uploading ' + files.length + ' file' + (files.length > 1 ? 's' : '') + '…</div>';

    var uploads = files.map(function (file) {
      var ext = (file.name.split(".").pop() || "jpg").toLowerCase();
      var path = slug + "/" + Date.now() + "-" + Math.random().toString(36).slice(2, 8) + "." + ext;
      return sb.storage.from(BUCKET).upload(path, file, { cacheControl: "3600", upsert: false })
        .then(function (res) {
          if (res.error) throw res.error;
          var pub = sb.storage.from(BUCKET).getPublicUrl(path);
          return pub.data.publicUrl;
        });
    });

    Promise.all(uploads).then(function (urls) {
      state.editingPhotos = state.editingPhotos.concat(urls);
      renderPhotoGrid();
      showToast(urls.length + " photo" + (urls.length > 1 ? "s" : "") + " uploaded", "success");
    }).catch(function (err) {
      showFormError("Photo upload failed: " + err.message);
    }).finally(function () {
      dropZone.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>' +
        '<div>Drop images here or <strong>click to upload</strong></div>' +
        '<div style="font-size:11px;margin-top:2px;opacity:0.6;">PNG, JPG, WebP up to 5MB</div>';
    });
  }

  function showFormError(msg) {
    var e = el("formError");
    e.textContent = msg;
    e.hidden = false;
    // Switch to the relevant tab if on photos
    // scroll error into view
    e.scrollIntoView({ behavior: "smooth", block: "nearest" });
  }

  /* ================================================================
     SAVE / DELETE
     ================================================================ */
  form.addEventListener("submit", function (e) {
    e.preventDefault();
    el("formError").hidden = true;

    // Basic validation
    var name = el("f_name").value.trim();
    var slug = el("f_slug").value.trim();
    if (!name) { showFormError("Product name is required."); return; }
    if (!slug) { showFormError("Slug is required."); return; }

    var was = el("f_was").value ? Number(el("f_was").value) : null;
    var payload = {
      name: name,
      slug: slug,
      cat: el("f_cat").value,
      metal: el("f_metal").value,
      pearl: el("f_pearl").value,
      price: Number(el("f_price").value),
      was: was,
      badge: el("f_badge").value || null,
      rating: Number(el("f_rating").value),
      stock_qty: Number(el("f_qty").value),
      in_stock: el("f_instock").checked,
      description: el("f_desc").value.trim(),
      photos: state.editingPhotos
    };

    var id = el("f_id").value;
    var saveBtn = el("saveBtn");
    saveBtn.disabled = true;
    saveBtn.innerHTML = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="12" cy="12" r="10" opacity="0.25"/><path d="M12 2a10 10 0 0 1 10 10" stroke-dasharray="31.4" stroke-dashoffset="0"><animateTransform attributeName="transform" type="rotate" from="0 12 12" to="360 12 12" dur="0.8s" repeatCount="indefinite"/></path></svg> Saving…';

    var query = id
      ? sb.from("products").update(payload).eq("id", Number(id))
      : sb.from("products").insert(payload);

    query.then(function (res) {
      saveBtn.disabled = false;
      saveBtn.innerHTML = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg> Save product';
      if (res.error) { showFormError(res.error.message); return; }

      // Cleanup removed photos from storage
      state.deletedPhotoUrls.forEach(function (url) {
        var path = url.split("/" + BUCKET + "/")[1];
        if (path) sb.storage.from(BUCKET).remove([path]);
      });

      closeModal();
      showToast(id ? "Product updated successfully." : "Product added successfully.", "success");
      loadProducts();
    });
  });

  el("deleteBtn").addEventListener("click", function () {
    var id = el("f_id").value;
    if (!id) return;
    if (!confirm("Delete this product? This can't be undone.")) return;

    sb.from("products").delete().eq("id", Number(id)).then(function (res) {
      if (res.error) { showFormError(res.error.message); return; }
      closeModal();
      showToast("Product deleted.", "success");
      loadProducts();
    });
  });
})();
