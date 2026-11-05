/* ============================================================
   COOKIE CONSENT – plain JS, no dependencies.

   What it does
   - Shows a banner until the visitor chooses (Accept all / Reject all / Settings).
   - Nothing non-essential runs before consent:
       Google Analytics (gtag.js)  -> only with "Statisztika"
       Meta Pixel (fbevents.js)    -> only with "Marketing"
   - Google Consent Mode v2 is set to "denied" by default and updated on choice.
   - The choice is stored in a first-party cookie (CONFIG.cookieName).
   - Withdrawing consent deletes the tracking cookies and reloads the page.
   - Anything with [data-cookie-settings] (e.g. a footer link) reopens the settings.

   Maintenance
   - Add/change a tracker: edit CONFIG and loadAnalytics()/loadMarketing().
   - Changed what you collect? Bump CONFIG.version to ask everyone again.
   ============================================================ */
(function () {
  'use strict';

  var CONFIG = {
    cookieName: 'ubc_consent',
    version: 1,
    maxAgeDays: 180,
    gaId: 'G-CF0XF2BL5M',
    pixelId: '1480966523148553',
    privacyUrl: 'https://drive.google.com/file/d/1TfiXxspkw2NenUjFaOICq8roDLTPDU0N/view?usp=sharing'
  };

  var TEXT = {
    bannerTitle: '🍪 Süti-beállítások',
    bannerText: 'Az oldal működéséhez szükséges sütiket használunk. Statisztikai és marketing sütiket csak a hozzájárulásoddal helyezünk el. A döntésedet bármikor megváltoztathatod az oldal alján, a „Cookie beállítások” linkre kattintva.',
    privacy: 'Adatkezelési tájékoztató',
    acceptAll: 'Mindet elfogadom',
    rejectAll: 'Csak a szükségesek',
    settings: 'Beállítások',
    modalTitle: 'Süti-beállítások',
    close: 'Bezárás',
    intro: 'Itt döntheted el, hogy milyen sütiket engedélyezel. A szükséges sütik nélkül az oldal nem működne, a többi kategória kikapcsolva indul.',
    save: 'Választás mentése',
    always: 'Mindig aktív',
    provider: 'Szolgáltató',
    cookies: 'Sütik',
    cats: {
      necessary: {
        name: 'Szükséges',
        desc: 'Az oldal alapvető működéséhez kellenek: megjegyzik a süti-beállításaidat és a választott világos/sötét témát. Ezek nem kapcsolhatók ki.',
        provider: 'unicornbookclub.hu',
        cookies: 'ubc_consent (180 nap), ubc-theme (helyi tárolás)'
      },
      analytics: {
        name: 'Statisztika',
        desc: 'Segítenek megérteni, hogyan használják az oldalt (pl. mely oldalak népszerűek), hogy jobbá tehessük. A mérés összesített adatokra épül.',
        provider: 'Google Analytics (Google LLC)',
        cookies: '_ga, _ga_* (kb. 2 év)'
      },
      marketing: {
        name: 'Marketing',
        desc: 'Lehetővé teszik, hogy mérjük a Facebook és Instagram hirdetéseink hatékonyságát, és releváns hirdetéseket mutassunk.',
        provider: 'Meta Pixel (Meta Platforms Ireland Ltd.)',
        cookies: '_fbp (kb. 3 hónap)'
      }
    }
  };

  /* ---------- helpers ---------- */
  var applied = { analytics: false, marketing: false };  // what is loaded on THIS page
  var lastFocus = null;
  var banner = null, overlay = null, root = null;

  function el(tag, attrs, children) {
    var n = document.createElement(tag);
    Object.keys(attrs || {}).forEach(function (k) {
      if (k === 'text') n.textContent = attrs[k];
      else if (k === 'class') n.className = attrs[k];
      else n.setAttribute(k, attrs[k]);
    });
    (children || []).forEach(function (c) { n.appendChild(c); });
    return n;
  }

  function getCookie(name) {
    var parts = document.cookie ? document.cookie.split('; ') : [];
    for (var i = 0; i < parts.length; i++) {
      var eq = parts[i].indexOf('=');
      if (parts[i].slice(0, eq) === name) return decodeURIComponent(parts[i].slice(eq + 1));
    }
    return null;
  }

  function setCookie(name, value, days) {
    var c = name + '=' + encodeURIComponent(value) +
      '; Max-Age=' + Math.round(days * 86400) + '; Path=/; SameSite=Lax';
    if (location.protocol === 'https:') c += '; Secure';
    document.cookie = c;
  }

  function readConsent() {
    try {
      var raw = getCookie(CONFIG.cookieName);
      if (!raw) return null;
      var c = JSON.parse(raw);
      if (!c || c.v !== CONFIG.version) return null;
      return { analytics: !!c.analytics, marketing: !!c.marketing };
    } catch (e) { return null; }
  }

  function storeConsent(c) {
    setCookie(CONFIG.cookieName, JSON.stringify({
      v: CONFIG.version,
      analytics: !!c.analytics,
      marketing: !!c.marketing,
      ts: new Date().toISOString()
    }), CONFIG.maxAgeDays);
  }

  /* ---------- Google Consent Mode v2: denied until the visitor decides ---------- */
  window.dataLayer = window.dataLayer || [];
  function gtag() { window.dataLayer.push(arguments); }
  window.gtag = window.gtag || gtag;
  gtag('consent', 'default', {
    ad_storage: 'denied',
    ad_user_data: 'denied',
    ad_personalization: 'denied',
    analytics_storage: 'denied',
    wait_for_update: 500
  });

  /* ---------- trackers (loaded only after consent) ---------- */
  function loadAnalytics() {
    if (applied.analytics) return;
    applied.analytics = true;
    gtag('consent', 'update', { analytics_storage: 'granted' });
    var s = document.createElement('script');
    s.async = true;
    s.src = 'https://www.googletagmanager.com/gtag/js?id=' + CONFIG.gaId;
    document.head.appendChild(s);
    gtag('js', new Date());
    gtag('config', CONFIG.gaId);
  }

  function loadMarketing() {
    if (applied.marketing) return;
    applied.marketing = true;
    gtag('consent', 'update', {
      ad_storage: 'granted', ad_user_data: 'granted', ad_personalization: 'granted'
    });
    /* Standard Meta Pixel bootstrap */
    (function (f, b, e, v, n, t, s) {
      if (f.fbq) return;
      n = f.fbq = function () { n.callMethod ? n.callMethod.apply(n, arguments) : n.queue.push(arguments); };
      if (!f._fbq) f._fbq = n;
      n.push = n; n.loaded = true; n.version = '2.0'; n.queue = [];
      t = b.createElement(e); t.async = true; t.src = v;
      s = b.getElementsByTagName(e)[0]; s.parentNode.insertBefore(t, s);
    })(window, document, 'script', 'https://connect.facebook.net/en_US/fbevents.js');
    window.fbq('init', CONFIG.pixelId);
    window.fbq('track', 'PageView');
  }

  function applyConsent(c) {
    if (c.analytics) loadAnalytics();
    if (c.marketing) loadMarketing();
  }

  /* Remove tracking cookies (current host + parent domains) */
  function clearTrackingCookies() {
    var patterns = [/^_ga(_.*)?$/, /^_gid$/, /^_gat(_.*)?$/, /^_fbp$/, /^_fbc$/];
    var host = location.hostname.split('.');
    var domains = [''];
    for (var i = 0; i < host.length - 1; i++) {
      var d = host.slice(i).join('.');
      domains.push(d, '.' + d);
    }
    (document.cookie ? document.cookie.split('; ') : []).forEach(function (pair) {
      var name = pair.split('=')[0];
      if (!patterns.some(function (p) { return p.test(name); })) return;
      domains.forEach(function (d) {
        document.cookie = name + '=; Max-Age=0; Path=/' + (d ? '; Domain=' + d : '') + '; SameSite=Lax';
      });
    });
  }

  /* ---------- saving a choice ---------- */
  function save(c) {
    var revoked = (applied.analytics && !c.analytics) || (applied.marketing && !c.marketing);
    storeConsent(c);
    closeModal(true);
    hideBanner();
    window.dispatchEvent(new CustomEvent('ubc:consent', { detail: { analytics: !!c.analytics, marketing: !!c.marketing } }));
    if (revoked) {
      clearTrackingCookies();
      location.reload();   // loaded tracker scripts cannot be unloaded, so start clean
      return;
    }
    applyConsent(c);
  }

  /* ---------- UI: banner ---------- */
  function hideBanner() {
    if (banner && banner.parentNode) banner.parentNode.removeChild(banner);
    banner = null;
  }

  function buildBanner() {
    var privacy = el('a', { href: CONFIG.privacyUrl, target: '_blank', rel: 'noopener', text: TEXT.privacy });
    var text = el('p', { class: 'cc-text', id: 'cc-desc' });
    text.appendChild(document.createTextNode(TEXT.bannerText + ' '));
    text.appendChild(privacy);
    text.appendChild(document.createTextNode('.'));

    var reject = el('button', { type: 'button', class: 'cc-btn cc-btn-reject', text: TEXT.rejectAll });
    var settings = el('button', { type: 'button', class: 'cc-btn cc-btn-ghost', text: TEXT.settings });
    var accept = el('button', { type: 'button', class: 'cc-btn cc-btn-accept', text: TEXT.acceptAll });

    reject.addEventListener('click', function () { save({ analytics: false, marketing: false }); });
    accept.addEventListener('click', function () { save({ analytics: true, marketing: true }); });
    settings.addEventListener('click', function () { openModal(); });

    banner = el('div', {
      class: 'cc-banner', role: 'dialog', 'aria-modal': 'false', tabindex: '-1',
      'aria-labelledby': 'cc-title', 'aria-describedby': 'cc-desc'
    }, [
      el('div', {}, [el('h2', { class: 'cc-title', id: 'cc-title', text: TEXT.bannerTitle }), text]),
      el('div', { class: 'cc-actions' }, [reject, settings, accept])
    ]);
    root.appendChild(banner);
    banner.focus({ preventScroll: true });
  }

  /* ---------- UI: settings modal ---------- */
  function category(key, checked, locked) {
    var t = TEXT.cats[key];
    var id = 'cc-cat-' + key;
    var head = el('div', { class: 'cc-cat-head' }, [
      el('label', { class: 'cc-cat-name', for: id, text: t.name })
    ]);
    if (locked) {
      head.appendChild(el('span', { class: 'cc-always', text: TEXT.always }));
      var cb = el('input', { type: 'checkbox', id: id, checked: 'checked', disabled: 'disabled', hidden: 'hidden' });
      head.appendChild(cb);
    } else {
      var input = el('input', { type: 'checkbox', id: id, role: 'switch', 'data-cc-cat': key });
      input.checked = !!checked;
      head.appendChild(el('span', { class: 'cc-toggle' }, [input, el('span', { class: 'cc-switch', 'aria-hidden': 'true' })]));
    }
    var meta = el('p', { class: 'cc-cat-meta' });
    meta.appendChild(el('strong', { text: TEXT.provider + ': ' }));
    meta.appendChild(document.createTextNode(t.provider + ' · '));
    meta.appendChild(el('strong', { text: TEXT.cookies + ': ' }));
    meta.appendChild(document.createTextNode(t.cookies));
    return el('div', { class: 'cc-cat' }, [head, el('p', { class: 'cc-cat-desc', text: t.desc }), meta]);
  }

  function currentChoice() {
    return readConsent() || { analytics: false, marketing: false };
  }

  function openModal() {
    if (overlay) return;
    lastFocus = document.activeElement;
    var c = currentChoice();

    var closeBtn = el('button', { type: 'button', class: 'cc-close', 'aria-label': TEXT.close, text: '×' });
    var body = el('div', { class: 'cc-modal-body' }, [
      el('p', { class: 'cc-intro', text: TEXT.intro }),
      category('necessary', true, true),
      category('analytics', c.analytics, false),
      category('marketing', c.marketing, false)
    ]);

    var reject = el('button', { type: 'button', class: 'cc-btn cc-btn-reject', text: TEXT.rejectAll });
    var saveBtn = el('button', { type: 'button', class: 'cc-btn cc-btn-ghost', text: TEXT.save });
    var accept = el('button', { type: 'button', class: 'cc-btn cc-btn-accept', text: TEXT.acceptAll });

    var modal = el('div', {
      class: 'cc-modal', role: 'dialog', 'aria-modal': 'true', 'aria-labelledby': 'cc-modal-title'
    }, [
      el('div', { class: 'cc-modal-head' }, [el('h2', { class: 'cc-modal-title', id: 'cc-modal-title', text: TEXT.modalTitle }), closeBtn]),
      body,
      el('div', { class: 'cc-modal-foot' }, [reject, saveBtn, accept])
    ]);
    overlay = el('div', { class: 'cc-overlay' }, [modal]);
    root.appendChild(overlay);
    document.documentElement.classList.add('cc-lock');

    closeBtn.addEventListener('click', function () { closeModal(); });
    overlay.addEventListener('mousedown', function (e) { if (e.target === overlay) closeModal(); });
    reject.addEventListener('click', function () { save({ analytics: false, marketing: false }); });
    accept.addEventListener('click', function () { save({ analytics: true, marketing: true }); });
    saveBtn.addEventListener('click', function () {
      var pick = { analytics: false, marketing: false };
      overlay.querySelectorAll('[data-cc-cat]').forEach(function (i) { pick[i.getAttribute('data-cc-cat')] = i.checked; });
      save(pick);
    });
    overlay.addEventListener('keydown', trapFocus);
    closeBtn.focus();
  }

  function closeModal(skipRestore) {
    if (!overlay) return;
    overlay.parentNode.removeChild(overlay);
    overlay = null;
    document.documentElement.classList.remove('cc-lock');
    if (!skipRestore && lastFocus && lastFocus.focus) lastFocus.focus();
  }

  function trapFocus(e) {
    if (e.key === 'Escape') { e.preventDefault(); closeModal(); return; }
    if (e.key !== 'Tab') return;
    var f = overlay.querySelectorAll('button, [href], input:not([disabled]):not([hidden])');
    if (!f.length) return;
    var first = f[0], last = f[f.length - 1];
    if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
  }

  /* ---------- init ---------- */
  function init() {
    root = el('div', { class: 'cc-root' });
    document.body.appendChild(root);

    document.addEventListener('click', function (e) {
      var t = e.target.closest && e.target.closest('[data-cookie-settings]');
      if (t) { e.preventDefault(); openModal(); }
    });

    var stored = readConsent();
    if (stored) applyConsent(stored);
    else buildBanner();
  }

  window.UBCConsent = {
    open: openModal,
    get: function () { return readConsent(); },
    reset: function () { setCookie(CONFIG.cookieName, '', 0); location.reload(); }
  };

  /* Apply a stored choice as early as possible (before the page has finished loading). */
  var early = readConsent();
  if (early) applyConsent(early);

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
