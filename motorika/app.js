/* Общий движок витрины: шапка, корзина, каталог, карточка товара, кабинет, новости, отзывы.
   Конфиг магазина приходит из data.js (window.SHOP). Состояние — в localStorage. */
(() => {
  const S = window.SHOP;
  const L = S.labels;
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const fmt = n => Math.round(n).toLocaleString('ru-RU') + ' ₽';
  const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const byId = id => S.products.find(p => p.id === id);
  const params = new URLSearchParams(location.search);
  const page = document.body.dataset.page;

  const store = {
    get(k, d) { try { const v = localStorage.getItem(S.key + ':' + k); return v === null ? d : JSON.parse(v); } catch { return d; } },
    set(k, v) { try { localStorage.setItem(S.key + ':' + k, JSON.stringify(v)); } catch { /* приватный режим */ } }
  };

  const icon = {
    heart: '<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M12 20s-7-4.4-9.3-9A5 5 0 0 1 12 6a5 5 0 0 1 9.3 5c-2.3 4.6-9.3 9-9.3 9Z"/></svg>',
    user: '<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="12" cy="8" r="4"/><path d="M4 21c1.5-4 4.5-6 8-6s6.5 2 8 6"/></svg>',
    bag: '<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M5 8h14l-1 12H6L5 8Z"/><path d="M9 8V6a3 3 0 0 1 6 0v2"/></svg>',
    menu: '<svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M4 7h16M4 12h16M4 17h16"/></svg>',
    close: '<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M6 6l12 12M18 6 6 18"/></svg>',
    star: '<svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor"><path d="m12 2.8 2.8 5.8 6.3.9-4.6 4.4 1.1 6.3L12 17.2l-5.6 3 1.1-6.3L2.9 9.5l6.3-.9L12 2.8Z"/></svg>',
    phone: '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2Z"/></svg>'
  };

  /* ---------- состояние ---------- */
  const cart = {
    items: () => store.get('cart', []),
    save(items) { store.set('cart', items); renderCartCount(); },
    add(id, size) {
      const items = cart.items();
      const hit = items.find(i => i.id === id && i.size === size);
      if (hit) { if (S.allowQty) hit.qty++; else return toast(L.alreadyInCart); }
      else items.push({ id, size: size || null, qty: 1 });
      cart.save(items);
      toast(L.addedToCart);
      openCart();
    },
    total(items = cart.items()) { return items.reduce((s, i) => s + (byId(i.id)?.price || 0) * i.qty, 0); }
  };
  const favs = {
    list: () => store.get('fav', []),
    toggle(id) {
      const f = favs.list();
      const i = f.indexOf(id);
      i >= 0 ? f.splice(i, 1) : f.push(id);
      store.set('fav', f);
      $$(`[data-fav="${id}"]`).forEach(b => b.classList.toggle('on', i < 0));
      toast(i < 0 ? 'Добавлено в избранное' : 'Убрано из избранного');
      renderCartCount();
    }
  };
  const user = () => store.get('user', null);

  /* ---------- общий каркас ---------- */
  function renderShell() {
    const nav = S.nav.map(([href, t]) => `<a href="${href}" class="${location.pathname.endsWith(href) || (href === 'index.html' && /\/$/.test(location.pathname)) ? 'active' : ''}">${t}</a>`).join('');
    $('#site-header').innerHTML = `
      <div class="topbar"><div class="wrap">${S.topbar}</div></div>
      <div class="header wrap">
        <button class="icon-btn burger" aria-label="Меню">${icon.menu}</button>
        <a href="index.html" class="logo">${S.logo}</a>
        <nav class="nav">${nav}</nav>
        <div class="header-actions">
          <a class="icon-btn hide-sm" href="tel:${S.contacts.phoneRaw}" aria-label="Позвонить">${icon.phone}<span class="phone-text">${S.contacts.phone}</span></a>
          <a class="icon-btn" href="account.html#fav" aria-label="Избранное">${icon.heart}<i class="badge-count" data-count="fav"></i></a>
          <a class="icon-btn" href="account.html" aria-label="Личный кабинет">${icon.user}</a>
          <button class="icon-btn cart-btn" aria-label="${L.cart}">${icon.bag}<i class="badge-count" data-count="cart"></i></button>
        </div>
      </div>
      <div class="mobile-nav"><div class="mobile-nav-inner">${nav}<a href="account.html">Личный кабинет</a><a href="tel:${S.contacts.phoneRaw}">${S.contacts.phone}</a></div></div>`;

    $('#site-footer').innerHTML = `
      <div class="wrap footer-grid">
        <div><a href="index.html" class="logo">${S.logo}</a><p class="muted">${S.footerAbout}</p></div>
        <div><h4>Разделы</h4>${S.nav.map(([h, t]) => `<a href="${h}">${t}</a>`).join('')}<a href="account.html">Личный кабинет</a></div>
        <div><h4>Контакты</h4><p>${S.contacts.address}</p><p><a href="tel:${S.contacts.phoneRaw}">${S.contacts.phone}</a></p><p><a href="mailto:${S.contacts.email}">${S.contacts.email}</a></p><p class="muted">${S.contacts.hoursShort}</p></div>
      </div>
      <div class="wrap footer-note">© ${new Date().getFullYear()} ${S.name}. Концепт для портфолио: магазин вымышленный, фото — Unsplash.</div>`;

    document.body.insertAdjacentHTML('beforeend', `
      <div class="overlay" hidden></div>
      <aside class="drawer" aria-label="${L.cart}" hidden>
        <div class="drawer-head"><h3>${L.cart}</h3><button class="icon-btn drawer-close" aria-label="Закрыть">${icon.close}</button></div>
        <div class="drawer-body"></div>
        <div class="drawer-foot"></div>
      </aside>
      <div class="modal" hidden><div class="modal-box"><button class="icon-btn modal-close" aria-label="Закрыть">${icon.close}</button><div class="modal-content"></div></div></div>
      <div class="toast" role="status"></div>`);

    $('.burger').onclick = () => document.body.classList.toggle('nav-open');
    $('.cart-btn').onclick = openCart;
    $('.drawer-close').onclick = closeCart;
    $('.overlay').onclick = () => { closeCart(); closeModal(); };
    $('.modal-close').onclick = closeModal;
    $('.modal').onclick = e => { if (e.target.classList.contains('modal')) closeModal(); };
    document.addEventListener('keydown', e => { if (e.key === 'Escape') { closeCart(); closeModal(); } });
    renderCartCount();
  }

  function renderCartCount() {
    const n = cart.items().reduce((s, i) => s + i.qty, 0);
    const f = favs.list().length;
    $$('[data-count="cart"]').forEach(e => { e.textContent = n || ''; e.hidden = !n; });
    $$('[data-count="fav"]').forEach(e => { e.textContent = f || ''; e.hidden = !f; });
  }

  let toastTimer;
  function toast(msg) {
    const t = $('.toast');
    t.textContent = msg;
    t.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => t.classList.remove('show'), 2400);
  }

  function openModal(html) {
    $('.modal-content').innerHTML = html;
    $('.modal').hidden = false;
    document.body.classList.add('locked');
  }
  function closeModal() { $('.modal').hidden = true; document.body.classList.remove('locked'); }

  /* ---------- корзина ---------- */
  function openCart() {
    renderCart();
    $('.drawer').hidden = false; $('.overlay').hidden = false;
    requestAnimationFrame(() => $('.drawer').classList.add('open'));
    document.body.classList.add('locked');
  }
  function closeCart() {
    const d = $('.drawer');
    if (!d || d.hidden) return;
    d.classList.remove('open'); $('.overlay').hidden = true;
    document.body.classList.remove('locked');
    setTimeout(() => { d.hidden = true; }, 250);
  }

  function promoDiscount(sum) {
    const code = store.get('promo', null);
    const p = code && S.promoCodes?.[code];
    return p ? { code, amount: Math.round(sum * p.percent / 100), label: p.label } : null;
  }

  function renderCart() {
    const items = cart.items();
    const body = $('.drawer-body'), foot = $('.drawer-foot');
    if (!items.length) {
      body.innerHTML = `<div class="empty"><p>${L.cartEmpty}</p><a class="btn" href="catalog.html">Перейти в каталог</a></div>`;
      foot.innerHTML = '';
      return;
    }
    body.innerHTML = items.map((i, idx) => {
      const p = byId(i.id); if (!p) return '';
      return `<div class="cart-item">
        <img src="${p.img}" alt="">
        <div><a href="product.html?id=${p.id}" class="cart-title">${esc(p.title)}</a>
          <div class="muted small">${i.size ? 'Размер ' + i.size : esc(S.cartMeta(p))}</div>
          ${S.allowQty ? `<div class="qty"><button data-q="${idx}" data-d="-1" aria-label="Меньше">−</button><span>${i.qty}</span><button data-q="${idx}" data-d="1" aria-label="Больше">+</button></div>` : ''}
        </div>
        <div class="cart-right"><b>${fmt(p.price * i.qty)}</b><button class="link small" data-rm="${idx}">Удалить</button></div>
      </div>`;
    }).join('');
    const sum = cart.total(items);
    const disc = promoDiscount(sum);
    const pay = sum - (disc?.amount || 0);
    foot.innerHTML = `
      ${S.promoCodes ? `<form class="promo-form"><input name="code" placeholder="Промокод" value="${esc(disc?.code || '')}" autocomplete="off"><button class="btn btn-ghost">Применить</button></form>` : ''}
      <div class="sum-row"><span>Товары</span><span>${fmt(sum)}</span></div>
      ${disc ? `<div class="sum-row accent"><span>${esc(disc.label)}</span><span>−${fmt(disc.amount)}</span></div>` : ''}
      ${S.deposit ? `<div class="sum-row"><span>${L.depositLabel}</span><span>${fmt(S.deposit * items.length)}</span></div>` : ''}
      <div class="sum-row total"><span>Итого</span><span>${fmt(pay)}</span></div>
      <button class="btn btn-block checkout-btn">${L.checkout}</button>
      <p class="muted small center">${L.checkoutNote}</p>`;

    $$('[data-q]', body).forEach(b => b.onclick = () => {
      const it = cart.items(); const i = it[+b.dataset.q];
      i.qty = Math.max(1, i.qty + +b.dataset.d); cart.save(it); renderCart();
    });
    $$('[data-rm]', body).forEach(b => b.onclick = () => {
      const it = cart.items(); it.splice(+b.dataset.rm, 1); cart.save(it); renderCart();
    });
    const pf = $('.promo-form', foot);
    if (pf) pf.onsubmit = e => {
      e.preventDefault();
      const code = pf.code.value.trim().toUpperCase();
      if (!code) { store.set('promo', null); renderCart(); return; }
      if (S.promoCodes[code]) { store.set('promo', code); toast('Промокод применён'); }
      else toast('Такого промокода нет');
      renderCart();
    };
    $('.checkout-btn', foot).onclick = checkout;
  }

  function checkout() {
    const u = user();
    if (!u) { closeCart(); location.href = 'account.html?next=checkout'; return; }
    closeCart();
    openModal(`<h3>${L.checkout}</h3>
      <form class="form checkout-form">
        <label>Имя<input name="name" required value="${esc(u.name)}"></label>
        <label>Телефон<input name="phone" type="tel" required value="${esc(u.phone || '')}" placeholder="+7"></label>
        <label>${L.deliveryLabel}<select name="delivery">${S.deliveryOptions.map(o => `<option>${o}</option>`).join('')}</select></label>
        <label>Комментарий<textarea name="comment" rows="2"></textarea></label>
        <button class="btn btn-block">Подтвердить — ${fmt(cart.total() - (promoDiscount(cart.total())?.amount || 0))}</button>
      </form>`);
    $('.checkout-form').onsubmit = e => {
      e.preventDefault();
      const f = e.target, items = cart.items(), sum = cart.total(items);
      const order = {
        no: String(Date.now()).slice(-6), date: new Date().toLocaleDateString('ru-RU'),
        items, total: sum - (promoDiscount(sum)?.amount || 0), status: L.orderNewStatus, delivery: f.delivery.value
      };
      store.set('orders', [order, ...store.get('orders', [])]);
      const u2 = user(); u2.bonus = (u2.bonus || 0) + Math.round(order.total * S.bonusRate); store.set('user', u2);
      cart.save([]); store.set('promo', null);
      openModal(`<div class="center"><div class="success-mark">✓</div><h3>${L.orderDone} №${order.no}</h3><p class="muted">${L.orderDoneText}</p><a class="btn" href="account.html#orders">Перейти в кабинет</a></div>`);
    };
  }

  /* ---------- карточки ---------- */
  function card(p) {
    const fav = favs.list().includes(p.id);
    return `<article class="card">
      <a href="product.html?id=${p.id}" class="card-img"><img loading="lazy" src="${p.img}" alt="${esc(p.title)}">${p.badge ? `<span class="tag">${p.badge}</span>` : ''}</a>
      <button class="fav ${fav ? 'on' : ''}" data-fav="${p.id}" aria-label="В избранное">${icon.heart}</button>
      <div class="card-body">
        <div class="card-meta">${esc(S.cardMeta(p))}</div>
        <h3><a href="product.html?id=${p.id}">${esc(p.title)}</a></h3>
        <div class="price">${fmt(p.price)}${p.oldPrice ? `<s>${fmt(p.oldPrice)}</s>` : ''}</div>
        <button class="btn btn-sm" data-add="${p.id}">${L.addBtn}</button>
      </div>
    </article>`;
  }

  function bindCards(root = document) {
    $$('[data-fav]', root).forEach(b => b.onclick = e => { e.preventDefault(); favs.toggle(b.dataset.fav); });
    $$('[data-add]', root).forEach(b => b.onclick = () => {
      const p = byId(b.dataset.add);
      if (p.sizes) location.href = 'product.html?id=' + p.id + '#sizes';
      else cart.add(p.id);
    });
  }

  function renderFeatured() {
    const el = $('#featured'); if (!el) return;
    el.innerHTML = S.products.filter(p => p.featured).map(card).join('');
    bindCards(el);
  }

  /* ---------- каталог ---------- */
  function renderCatalog() {
    const grid = $('#catalog-grid'); if (!grid) return;
    const cats = ['Все', ...new Set(S.products.map(p => p.cat))];
    const brands = S.brandFilter ? [...new Set(S.products.map(p => p.brand))].sort() : [];
    const maxPrice = Math.max(...S.products.map(p => p.price));
    const st = { cat: params.get('cat') || 'Все', brand: '', q: '', max: maxPrice, sort: 'popular', sale: false };

    $('#filters').innerHTML = `
      <div class="filter-block"><input type="search" class="search" placeholder="${L.searchPh}" aria-label="Поиск"></div>
      <div class="filter-block"><h4>Категория</h4><div class="chips">${cats.map(c => `<button class="chip" data-cat="${c}">${c}</button>`).join('')}</div></div>
      ${brands.length ? `<div class="filter-block"><h4>Марка</h4><select class="brand"><option value="">Все марки</option>${brands.map(b => `<option>${b}</option>`).join('')}</select></div>` : ''}
      <div class="filter-block"><h4>Цена до: <span class="max-out">${fmt(maxPrice)}</span></h4><input type="range" class="max" min="0" max="${maxPrice}" step="${S.priceStep}" value="${maxPrice}"></div>
      <div class="filter-block"><label class="check"><input type="checkbox" class="sale"> ${L.saleFilter}</label></div>
      <button class="link reset">Сбросить фильтры</button>`;

    const draw = () => {
      let list = S.products.filter(p =>
        (st.cat === 'Все' || p.cat === st.cat) && (!st.brand || p.brand === st.brand) && p.price <= st.max &&
        (!st.sale || p.oldPrice) && (!st.q || (p.title + ' ' + p.brand + ' ' + p.cat).toLowerCase().includes(st.q)));
      const sorters = { cheap: (a, b) => a.price - b.price, expensive: (a, b) => b.price - a.price, new: (a, b) => (b.year || b.order || 0) - (a.year || a.order || 0), popular: () => 0 };
      list = [...list].sort(sorters[st.sort]);
      $('#catalog-count').textContent = `${list.length} ${plural(list.length, L.unitForms)}`;
      grid.innerHTML = list.length ? list.map(card).join('') : `<div class="empty wide"><p>Ничего не нашлось. Попробуйте изменить фильтры.</p></div>`;
      bindCards(grid);
      $$('.chip[data-cat]').forEach(c => c.classList.toggle('active', c.dataset.cat === st.cat));
    };

    $$('.chip[data-cat]').forEach(c => c.onclick = () => { st.cat = c.dataset.cat; draw(); });
    $('.search').oninput = e => { st.q = e.target.value.trim().toLowerCase(); draw(); };
    if ($('.brand')) $('.brand').onchange = e => { st.brand = e.target.value; draw(); };
    $('.max').oninput = e => { st.max = +e.target.value; $('.max-out').textContent = fmt(st.max); draw(); };
    $('.sale').onchange = e => { st.sale = e.target.checked; draw(); };
    $('#sort').onchange = e => { st.sort = e.target.value; draw(); };
    $('.reset').onclick = () => location.href = 'catalog.html';
    $('#filters-toggle').onclick = () => $('#filters').classList.toggle('open');
    draw();
  }

  function plural(n, [one, few, many]) {
    const m10 = n % 10, m100 = n % 100;
    return m10 === 1 && m100 !== 11 ? one : m10 >= 2 && m10 <= 4 && (m100 < 12 || m100 > 14) ? few : many;
  }

  /* ---------- карточка товара ---------- */
  function renderProduct() {
    const el = $('#product'); if (!el) return;
    const p = byId(params.get('id')) || S.products[0];
    document.title = `${p.title} — ${S.name}`;
    const fav = favs.list().includes(p.id);
    el.innerHTML = `
      <nav class="crumbs"><a href="index.html">Главная</a> / <a href="catalog.html">Каталог</a> / <a href="catalog.html?cat=${encodeURIComponent(p.cat)}">${p.cat}</a></nav>
      <div class="product-grid">
        <div class="product-img"><img src="${p.img}" alt="${esc(p.title)}">${p.badge ? `<span class="tag">${p.badge}</span>` : ''}</div>
        <div class="product-info">
          <div class="card-meta">${esc(S.cardMeta(p))}</div>
          <h1>${esc(p.title)}</h1>
          <div class="price big">${fmt(p.price)}${p.oldPrice ? `<s>${fmt(p.oldPrice)}</s>` : ''}</div>
          ${S.credit ? `<p class="muted">В кредит от <b class="accent-text">${fmt(monthly(p.price * 0.8, S.credit.rate, 60))}/мес</b> · ставка от ${S.credit.rate}%</p>` : ''}
          ${p.sizes ? `<div id="sizes" class="sizes"><h4>Размер</h4><div class="chips">${p.sizes.map(s => `<button class="chip size" data-size="${s}">${s}</button>`).join('')}</div><button class="link small size-guide">Таблица размеров</button></div>` : ''}
          <div class="product-actions">
            <button class="btn add-main">${L.addBtn}</button>
            <button class="btn btn-ghost fav-main ${fav ? 'on' : ''}" data-fav="${p.id}">${icon.heart} В избранное</button>
          </div>
          ${S.extraAction ? `<button class="btn btn-ghost btn-block extra-action">${S.extraAction.label}</button>` : ''}
          <p class="desc">${esc(p.desc)}</p>
          <dl class="specs">${S.specs(p).map(([k, v]) => `<div><dt>${k}</dt><dd>${esc(v)}</dd></div>`).join('')}</dl>
          <ul class="perks">${S.productPerks.map(x => `<li>${x}</li>`).join('')}</ul>
        </div>
      </div>
      ${S.credit ? creditCalc(p) : ''}
      <section class="section"><h2>${L.related}</h2><div class="grid">${S.products.filter(x => x.cat === p.cat && x.id !== p.id).concat(S.products.filter(x => x.cat !== p.cat)).slice(0, 4).map(card).join('')}</div></section>`;

    let size = null;
    $$('.size', el).forEach(b => b.onclick = () => { size = b.dataset.size; $$('.size', el).forEach(x => x.classList.toggle('active', x === b)); });
    $('.add-main', el).onclick = () => {
      if (p.sizes && !size) { toast('Выберите размер'); $('#sizes').classList.add('shake'); setTimeout(() => $('#sizes').classList.remove('shake'), 500); return; }
      cart.add(p.id, size);
    };
    $('.size-guide', el)?.addEventListener('click', () => openModal(S.sizeGuide));
    $('.extra-action', el)?.addEventListener('click', () => requestForm(S.extraAction.title, p));
    if (S.credit) bindCredit(p);
    bindCards(el);
  }

  function monthly(sum, rate, months) {
    const r = rate / 1200;
    return sum * r / (1 - Math.pow(1 + r, -months));
  }
  function creditCalc(p) {
    return `<section class="section calc" id="calc"><h2>Кредитный калькулятор</h2>
      <div class="calc-grid">
        <div class="form">
          <label>Первоначальный взнос: <b class="out-down"></b><input type="range" class="c-down" min="0" max="${Math.round(p.price * 0.9)}" step="50000" value="${Math.round(p.price * 0.2 / 50000) * 50000}"></label>
          <label>Срок: <b class="out-term"></b><input type="range" class="c-term" min="12" max="84" step="12" value="60"></label>
        </div>
        <div class="calc-result"><span class="muted">Платёж в месяц</span><b class="out-pay"></b><span class="muted small">Ставка от ${S.credit.rate}% годовых. Расчёт предварительный, не оферта.</span><button class="btn btn-sm calc-apply">Отправить заявку</button></div>
      </div></section>`;
  }
  function bindCredit(p) {
    const d = $('.c-down'), t = $('.c-term');
    const upd = () => {
      $('.out-down').textContent = fmt(+d.value);
      $('.out-term').textContent = `${t.value} мес.`;
      $('.out-pay').textContent = fmt(monthly(p.price - +d.value, S.credit.rate, +t.value));
    };
    d.oninput = t.oninput = upd; upd();
    $('.calc-apply').onclick = () => requestForm('Заявка на кредит', p);
  }

  function requestForm(title, p) {
    const u = user() || {};
    openModal(`<h3>${title}</h3>${p ? `<p class="muted">${esc(p.title)}</p>` : ''}
      <form class="form req-form">
        <label>Имя<input name="name" required value="${esc(u.name || '')}"></label>
        <label>Телефон<input name="phone" type="tel" required value="${esc(u.phone || '')}" placeholder="+7"></label>
        ${S.extraAction?.dateField ? '<label>Удобная дата<input name="date" type="date" required></label>' : ''}
        <label class="check"><input type="checkbox" required> Согласен на обработку персональных данных</label>
        <button class="btn btn-block">Отправить</button>
      </form>`);
    $('.req-form').onsubmit = e => {
      e.preventDefault();
      const f = e.target;
      const reqs = store.get('requests', []);
      reqs.unshift({ title, item: p?.title || '', date: f.date?.value || new Date().toISOString().slice(0, 10), status: 'Ожидает звонка' });
      store.set('requests', reqs);
      openModal(`<div class="center"><div class="success-mark">✓</div><h3>Заявка отправлена</h3><p class="muted">Менеджер перезвонит в течение 15 минут в рабочее время.</p></div>`);
    };
  }

  /* ---------- новости и акции ---------- */
  function newsCard(n) {
    return `<article class="news-card">
      <div class="news-img"><img loading="lazy" src="${n.img}" alt=""><span class="tag ${n.type === 'Акция' ? 'tag-accent' : ''}">${n.type}</span></div>
      <div class="news-body"><time class="muted small">${n.date}${n.until ? ' · до ' + n.until : ''}</time><h3>${esc(n.title)}</h3><p>${esc(n.lead)}</p><button class="link" data-news="${n.id}">Подробнее →</button></div>
    </article>`;
  }
  function bindNews(root) {
    $$('[data-news]', root).forEach(b => b.onclick = () => {
      const n = S.news.find(x => x.id === b.dataset.news);
      openModal(`<img class="modal-img" src="${n.img}" alt=""><span class="tag ${n.type === 'Акция' ? 'tag-accent' : ''}">${n.type}</span><h3>${esc(n.title)}</h3><time class="muted small">${n.date}${n.until ? ' · действует до ' + n.until : ''}</time>${n.body.map(t => `<p>${esc(t)}</p>`).join('')}${n.code ? `<div class="promo-code"><span>Промокод</span><b>${n.code}</b><button class="btn btn-sm copy-code">Скопировать</button></div>` : ''}`);
      $('.copy-code')?.addEventListener('click', () => { navigator.clipboard?.writeText(n.code); store.set('promo', n.code); toast('Промокод скопирован и применён к корзине'); });
    });
  }
  function renderNews() {
    const el = $('#news-list');
    if (el) {
      const types = ['Все', ...new Set(S.news.map(n => n.type))];
      $('#news-filter').innerHTML = types.map(t => `<button class="chip" data-type="${t}">${t}</button>`).join('');
      const draw = t => {
        el.innerHTML = S.news.filter(n => t === 'Все' || n.type === t).map(newsCard).join('');
        bindNews(el);
        $$('[data-type]').forEach(c => c.classList.toggle('active', c.dataset.type === t));
      };
      $$('[data-type]').forEach(c => c.onclick = () => draw(c.dataset.type));
      draw(params.get('type') || 'Все');
    }
    const latest = $('#news-latest');
    if (latest) { latest.innerHTML = S.news.slice(0, 3).map(newsCard).join(''); bindNews(latest); }
  }

  /* ---------- отзывы ---------- */
  function renderReviews() {
    const el = $('#reviews'); if (!el) return;
    const all = [...store.get('myReviews', []), ...S.reviews];
    const avg = all.reduce((s, r) => s + r.rating, 0) / all.length;
    const stars = n => `<span class="stars">${Array.from({ length: 5 }, (_, i) => `<i class="${i < n ? 'on' : ''}">${icon.star}</i>`).join('')}</span>`;
    el.innerHTML = `
      <div class="reviews-head">
        <div class="rating-big"><b>${avg.toFixed(1)}</b>${stars(Math.round(avg))}<span class="muted small">${all.length} ${plural(all.length, ['отзыв', 'отзыва', 'отзывов'])} · ${S.reviewSources}</span></div>
        <button class="btn btn-ghost write-review">Оставить отзыв</button>
      </div>
      <div class="reviews-track">${all.map(r => `<figure class="review">${stars(r.rating)}<blockquote>${esc(r.text)}</blockquote><figcaption><b>${esc(r.name)}</b><span class="muted small">${esc(r.date)}${r.about ? ' · ' + esc(r.about) : ''}</span></figcaption></figure>`).join('')}</div>`;
    $('.write-review', el).onclick = () => {
      const u = user() || {};
      openModal(`<h3>Ваш отзыв</h3><form class="form rev-form">
        <div class="rate-input">${[5, 4, 3, 2, 1].map(n => `<input type="radio" name="r" value="${n}" id="r${n}" ${n === 5 ? 'checked' : ''}><label for="r${n}" aria-label="${n}">${icon.star}</label>`).join('')}</div>
        <label>Имя<input name="name" required value="${esc(u.name || '')}"></label>
        <label>Отзыв<textarea name="text" rows="4" required minlength="10"></textarea></label>
        <button class="btn btn-block">Опубликовать</button></form>`);
      $('.rev-form').onsubmit = e => {
        e.preventDefault();
        const f = e.target;
        store.set('myReviews', [{ name: f.name.value, text: f.text.value, rating: +f.r.value, date: new Date().toLocaleDateString('ru-RU') }, ...store.get('myReviews', [])]);
        closeModal(); renderReviews(); toast('Спасибо! Отзыв опубликован');
      };
    };
  }

  /* ---------- личный кабинет ---------- */
  function renderAccount() {
    const el = $('#account'); if (!el) return;
    const u = user();
    if (!u) return renderAuth(el);
    if (params.get('next') === 'checkout' && cart.items().length) { history.replaceState(null, '', 'account.html'); openCart(); }

    const tabs = [['profile', 'Профиль'], ['orders', L.ordersTab], ['requests', L.requestsTab], ['fav', 'Избранное'], ['bonus', L.bonusTab]].filter(([k]) => k !== 'requests' || L.requestsTab);
    const active = () => (location.hash.slice(1) || 'profile');
    const level = S.levels.slice().reverse().find(l => (u.spent || 0) + store.get('orders', []).reduce((s, o) => s + o.total, 0) >= l.from) || S.levels[0];

    el.innerHTML = `
      <div class="acc-head">
        <div class="avatar">${esc(u.name.trim()[0] || '?').toUpperCase()}</div>
        <div><h1>${esc(u.name)}</h1><p class="muted">${esc(u.email)} · уровень <b class="accent-text">${level.name}</b></p></div>
        <button class="btn btn-ghost btn-sm logout">Выйти</button>
      </div>
      <div class="acc-grid">
        <nav class="acc-nav">${tabs.map(([k, t]) => `<a href="#${k}" data-tab="${k}">${t}</a>`).join('')}</nav>
        <div class="acc-panel"></div>
      </div>`;
    $('.logout', el).onclick = () => { store.set('user', null); location.hash = ''; renderAccount(); };

    const panels = {
      profile: () => `<h2>Личные данные</h2><form class="form profile-form two-col">
          <label>Имя<input name="name" value="${esc(u.name)}" required></label>
          <label>Телефон<input name="phone" type="tel" value="${esc(u.phone || '')}" placeholder="+7"></label>
          <label>Email<input name="email" type="email" value="${esc(u.email)}" required></label>
          <label>${L.profileExtra}<input name="extra" value="${esc(u.extra || '')}"></label>
          <label class="check full"><input type="checkbox" name="news" ${u.news !== false ? 'checked' : ''}> Получать письма об акциях и новинках</label>
          <button class="btn">Сохранить</button></form>`,
      orders: () => {
        const orders = store.get('orders', []);
        return `<h2>${L.ordersTab}</h2>${orders.length ? orders.map(o => `<div class="order">
          <div class="order-head"><b>№${o.no}</b><span class="muted">${o.date}</span><span class="status">${o.status}</span><b class="order-sum">${fmt(o.total)}</b></div>
          <div class="order-items">${o.items.map(i => { const p = byId(i.id); return p ? `<a href="product.html?id=${p.id}"><img src="${p.img}" alt="" title="${esc(p.title)}"></a>` : ''; }).join('')}</div>
          <div class="muted small">${o.delivery || ''}</div></div>`).join('') : `<div class="empty"><p>${L.noOrders}</p><a class="btn" href="catalog.html">В каталог</a></div>`}`;
      },
      requests: () => {
        const r = store.get('requests', []);
        return `<h2>${L.requestsTab}</h2>${r.length ? `<div class="table">${r.map(x => `<div class="tr"><b>${esc(x.title)}</b><span>${esc(x.item)}</span><span class="muted">${esc(x.date)}</span><span class="status">${esc(x.status)}</span></div>`).join('')}</div>` : `<div class="empty"><p>${L.noRequests}</p><a class="btn" href="catalog.html">Выбрать ${L.requestTarget}</a></div>`}`;
      },
      fav: () => {
        const f = favs.list().map(byId).filter(Boolean);
        return `<h2>Избранное</h2>${f.length ? `<div class="grid grid-3">${f.map(card).join('')}</div>` : `<div class="empty"><p>Вы ещё ничего не добавили в избранное.</p><a class="btn" href="catalog.html">В каталог</a></div>`}`;
      },
      bonus: () => {
        const spent = (u.spent || 0) + store.get('orders', []).reduce((s, o) => s + o.total, 0);
        const next = S.levels.find(l => l.from > spent);
        const pct = next ? Math.min(100, spent / next.from * 100) : 100;
        return `<h2>${L.bonusTab}</h2>
          <div class="loyalty-card"><span>${S.name}</span><b>${(u.bonus || 0).toLocaleString('ru-RU')} ${L.bonusUnit}</b><span class="muted">Уровень ${level.name} · ${level.perk}</span><code>${u.card}</code></div>
          <div class="progress"><div style="width:${pct}%"></div></div>
          <p class="muted">${next ? `До уровня «${next.name}» осталось ${fmt(next.from - spent)} покупок.` : 'У вас максимальный уровень.'}</p>
          <div class="levels">${S.levels.map(l => `<div class="${l.name === level.name ? 'active' : ''}"><b>${l.name}</b><span class="muted small">от ${fmt(l.from)}</span><span>${l.perk}</span></div>`).join('')}</div>`;
      }
    };

    const show = () => {
      Object.assign(u, user()); // баллы могли измениться после оформления заказа
      const k = panels[active()] ? active() : 'profile';
      $('.acc-panel', el).innerHTML = panels[k]();
      $$('[data-tab]', el).forEach(a => a.classList.toggle('active', a.dataset.tab === k));
      bindCards($('.acc-panel', el));
      const pf = $('.profile-form', el);
      if (pf) pf.onsubmit = e => {
        e.preventDefault();
        Object.assign(u, { name: pf.name.value, phone: pf.phone.value, email: pf.email.value, extra: pf.extra.value, news: pf.news.checked });
        store.set('user', u); toast('Данные сохранены'); renderAccount();
      };
    };
    window.onhashchange = show;
    show();
  }

  function renderAuth(el) {
    el.innerHTML = `
      <div class="auth">
        <div class="auth-side"><h1>Личный кабинет</h1><ul class="perks">${S.accountPerks.map(x => `<li>${x}</li>`).join('')}</ul></div>
        <div class="auth-box">
          <div class="tabs"><button class="tab active" data-mode="login">Вход</button><button class="tab" data-mode="reg">Регистрация</button></div>
          <form class="form auth-form">
            <label class="reg-only" hidden>Имя<input name="name" autocomplete="name"></label>
            <label>Email<input name="email" type="email" required autocomplete="email"></label>
            <label class="reg-only" hidden>Телефон<input name="phone" type="tel" placeholder="+7" autocomplete="tel"></label>
            <label>Пароль<input name="pass" type="password" required minlength="4" autocomplete="current-password"></label>
            <button class="btn btn-block submit">Войти</button>
            <button type="button" class="btn btn-ghost btn-block demo-login">Войти в демо-аккаунт</button>
            <p class="muted small center">Демо-режим: данные хранятся только в вашем браузере.</p>
          </form>
        </div>
      </div>`;
    let mode = 'login';
    $$('.tab', el).forEach(t => t.onclick = () => {
      mode = t.dataset.mode;
      $$('.tab', el).forEach(x => x.classList.toggle('active', x === t));
      $$('.reg-only', el).forEach(x => { x.hidden = mode !== 'reg'; x.querySelector('input').required = mode === 'reg' && x.querySelector('input').name === 'name'; });
      $('.submit', el).textContent = mode === 'reg' ? 'Зарегистрироваться' : 'Войти';
    });
    const login = data => {
      store.set('user', { card: S.cardPrefix + String(Math.floor(1e7 + Math.random() * 9e7)), bonus: S.welcomeBonus, spent: 0, ...data });
      if (!store.get('orders', null)) store.set('orders', data.demo ? S.demoOrders : []);
      toast(mode === 'reg' ? `Добро пожаловать! Начислено ${S.welcomeBonus} ${L.bonusUnit}` : 'Вы вошли');
      renderAccount();
    };
    $('.auth-form', el).onsubmit = e => {
      e.preventDefault();
      const f = e.target;
      login({ name: f.name.value || f.email.value.split('@')[0], email: f.email.value, phone: f.phone.value });
    };
    $('.demo-login', el).onclick = () => login({ ...S.demoUser, demo: true });
  }

  /* ---------- формы на страницах ---------- */
  function bindStaticForms() {
    $$('form[data-demo]').forEach(f => f.onsubmit = e => {
      e.preventDefault();
      f.reset();
      openModal(`<div class="center"><div class="success-mark">✓</div><h3>${f.dataset.demo}</h3><p class="muted">Мы свяжемся с вами в ближайшее время.</p></div>`);
    });
    $$('[data-request]').forEach(b => b.onclick = () => requestForm(b.dataset.request));
    $$('[data-faq] button').forEach(b => b.onclick = () => b.parentElement.classList.toggle('open'));
  }

  renderShell();
  renderFeatured();
  renderCatalog();
  renderProduct();
  renderNews();
  renderReviews();
  renderAccount();
  bindStaticForms();
  if (page === 'home' && S.onHome) S.onHome({ $, $$, fmt, monthly });

  const io = 'IntersectionObserver' in window && new IntersectionObserver(es => es.forEach(e => {
    if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
  }), { threshold: 0.12 });
  $$('.reveal').forEach(el => io ? io.observe(el) : el.classList.add('in'));
})();
