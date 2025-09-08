/* =======================================================================
    SSBS Portal – unified routing for ALL modules (Afras/Jebras/Sabri/Sameer)
    ======================================================================= */

/* ---------- theme toggle ---------- */
(function () {
  const saved = localStorage.getItem('ssbs_theme') || 'dark';
  if (saved === 'light') document.body.classList.add('light');
  if (saved === 'dark') document.body.classList.remove('light');

  const btn = document.getElementById('themeBtn');
  if (!btn) return;

  const setLabel = () =>
    (btn.textContent = document.body.classList.contains('light') ? '🌚 Dark' : '☀️ Light');

  btn.onclick = () => {
    document.body.classList.toggle('light');
    localStorage.setItem('ssbs_theme', document.body.classList.contains('light') ? 'light' : 'dark');
    setLabel();
  };
  setLabel();
})();

/* ================= Session + Auth (front-end only) ================= */
const SSBS = (function () {
  // --- Users (exact display names & passwords you requested) ---
  const USERS = {
    'Sameer': { pass: 'Sameer@1982', role: 'ceo', nameParam: 'Sameer' },
    'Mohamed Sabri': { pass: 'Sabri@1995', role: 'ceo', nameParam: 'Mohamed+Sabri' },
    'Mohamed Afras': { pass: 'Afras@1997', role: 'agent', nameParam: 'Mohamed+Afras' },
    'Mohamed Jebras': { pass: 'Jebras@1996', role: 'agent', nameParam: 'Mohamed+Jebras' },
  };

  // --- Shared module base URLs (these only need the ?Agent / ?agent / ?person suffix) ---
  const BASE = {
    daily: 'https://script.google.com/macros/s/AKfycbyzA1NGCX8X1W3tJK3js_mo65lcweTuxSbC7__Z1d2-QiRwBdRaFLSpcHAD1BjUq5qh/exec',
    expense: 'https://script.google.com/macros/s/AKfycbxvoKPAqgbIc_di7rlC6yz4ll-L2LuWUE1LFEuogUC5XHi9Fc48r_G-8WoKk6vFpto/exec',
    receive: 'https://script.google.com/macros/s/AKfycbw6DXVH0sGOlV00lcxnVHXNzkmEH5VYE1-oMbbCbw76N4-nPJQPcMtdb98tZ_Us0Ygy/exec',
    transfer: 'https://script.google.com/macros/s/AKfycbymcNcdzr-G_n7BJ5rMs72VCMQOm0JeJSuV8OxQ363HT9h2ZmKctnmaQJkNdocdlA1B/exec',
    invoice: 'https://script.google.com/macros/s/AKfycbzLSyED2J_zEnCe1EiemyptQSrQai6aQCR-bmir-GSzn4Z6P3o7KgLoT3c-s9sZFwfH/exec',
    invoice_d: 'https://script.google.com/macros/s/AKfycbxJfxaCC8-B6Y7C-dVmVZYbyBv8m_LK3JunJicvA_MsF6aNptm1GvDWamFJA39UNjk/exec',
    quote: 'https://script.google.com/macros/s/AKfycbz-NcpaX6EMyFD_zF2UDDBUtDy6wJTsNcnase0G8M0b7TVUAjhmUEA4OZnydV8sXd2C/exec',
    statement: 'https://script.google.com/macros/s/AKfycbwb_3Fmt1uiWQxVEAX-TvbZpmB6B_4r9a3YxizwsEawlOqB58eX8T58T_M8fcw1oTE/exec',
    docs: 'https://script.google.com/macros/s/AKfycbz-j5d4Tv2awKAPVpVS1JZ6VnTlPM8ZE1fMbEmEJ2G1DyKIRUNnNPhq-363ePU9OJE/exec',
    client: 'https://script.google.com/macros/s/AKfycbwWu_wRihWzPBc9RrGY2uWjGHDYicmAiN_Hs49JoaiuPQlY4oLJ72zzMZOi2W4JEQ/exec',
    mcp: 'https://script.google.com/macros/s/AKfycbxDkDyTXSjLkJO__F7vqX7lItX-zc6nOUJJLMiETobKpLM49C13mLp38pR0oaHiVA/exec',
  };

  // --- Per-user overrides (dashboard & task are unique URLs) ---
  const OVERRIDES = {
    'Sameer': {
      dashboard: 'https://script.google.com/macros/s/AKfycbxC6VK7gOCS_ET0ThOSsY89-N_QdmxGp8TQHmNk8G7wUKdZC73WEHihBKXJ79-dfOQ/exec',
      task: 'https://script.google.com/macros/s/AKfycbz8-QQAGgULJamv7u8i30EwZc8VUCEjCvLjxGwHNS0m104WpRB8NfZ2q_u4INR7mw/exec',
    },
    'Mohamed Sabri': {
      dashboard: 'https://script.google.com/macros/s/AKfycbzi8s2S-uYdIZ6nuT4QRwlAWbiz20JeBMgwksfO29aey_-AQUrDPiUwsqVkdZsrFSI/exec',
      task: 'https://script.google.com/macros/s/AKfycbwLNo55fFjPtXTfyVTEx72pTCzrLz5CtIZ1_eJmmHkz6YB_odtUadEq2jTvkvaaH0M/exec',
    },
    'Mohamed Afras': {
      dashboard: 'https://script.google.com/macros/s/AKfycbx34JMpAzYZPRzIndh_ydZOkK6EO_LVctS93R6-aEr-3DVINuKX-kHOUjW8bFcVMaTA/exec',
      task: 'https://script.google.com/macros/s/AKfycbwQF4Qsrde3Ai6rs8P4xESnZ-vsnVdGyIMJ_DF0cYdPW_LfdTuy8CuGSAd6zTTS6NVX/exec',
    },
    'Mohamed Jebras': {
      dashboard: 'https://script.google.com/macros/s/AKfycbzWNLNyJ6tXi9eDZnz83KdLndMDAIQx7O3q2R49yODawy1RI744vd-hrMOfoAv6Bc8/exec',
      task: 'https://script.google.com/macros/s/AKfycbwLKQN4wl6dpu_OUUcHvSe4FTVkCVSv6Z1PY_SvjN2uqL91YSIdZ56qwnjI_8cFNvo/exec',
    },
  };

  function buildLink(userLabel, moduleKey) {
    const u = USERS[userLabel];
    if (!u) return '';
    if (Overrides[userLabel] && Overrides[userLabel][moduleKey]) {
      return Overrides[userLabel][moduleKey];
    }
    switch (moduleKey) {
      case 'daily': return `${BASE.daily}?Agent=${u.nameParam}`;
      case 'expense': return `${BASE.expense}?agent=${u.nameParam}`;
      case 'receive': return `${BASE.receive}?agent=${u.nameParam}`;
      case 'transfer': return `${BASE.transfer}?agent=${u.nameParam}`;
      case 'invoice': return `${BASE.invoice}?Agent=${u.nameParam}`;
      case 'invoice_d': return `${BASE.invoice_d}?Agent=${u.nameParam}`;
      case 'quote': return `${BASE.quote}?Agent=${u.nameParam}`;
      case 'statement': return `${BASE.statement}?agent=${u.nameParam}`;
      case 'docs': return `${BASE.docs}?agent=${u.nameParam}`;
      case 'client': return `${BASE.client}?person=${u.nameParam}`;
      case 'mcp': return `${BASE.mcp}?agent=${u.nameParam}`;
      default: return '';
    }
  }

  /* -------- simple session store -------- */
  const KEY = 'ssbs_user';
  const TTL_MS = 20 * 60 * 1000; // 20 minutes

  function login(name, pass) {
    const u = USERS[name];
    if (!u || u.pass !== pass) return { ok: false, msg: 'Invalid username or password' };
    const now = Date.now();
    localStorage.setItem(KEY, JSON.stringify({ name, role: u.role, t: now }));
    return { ok: true, role: u.role };
  }

  function currentUser() {
    const raw = localStorage.getItem(KEY);
    if (!raw) return null;
    try {
      const obj = JSON.parse(raw);
      if (!obj || !obj.t) return null;
      if (Date.now() - obj.t > TTL_MS) { logout(); return null; }
      return obj;
    } catch { return null; }
  }

  function touch() {
    const u = currentUser();
    if (!u) return;
    u.t = Date.now();
    localStorage.setItem(KEY, JSON.stringify(u));
  }

  function logout() { localStorage.removeItem(KEY); }

  function openModule(key) {
    const u = currentUser();
    if (!u) { alert('Session expired. Please log in again.'); location.href = 'index.html'; return; }
    const url = buildLink(u.name, key);
    if (!url) { alert('Missing link for: ' + key); return; }
    window.open(url, '_blank', 'noopener');
    touch();
  }

  return { login, currentUser, logout, openModule, USERS: Object.keys(USERS) };
})();

/* =========================== Login page =========================== */
(function wireLogin() {
  const btn = document.getElementById('loginBtn');
  if (!btn) return;
  btn.onclick = (e) => {
    e.preventDefault(); // Prevent form submission
    const userSel = document.getElementById('userPick');
    const u = (userSel && userSel.value) || (document.getElementById('user')?.value || '').trim();
    const p = (document.getElementById('pass')?.value || '').trim();
    const res = SSBS.login(u, p);
    if (!res.ok) { alert(res.msg); return; }
    location.href = 'dashboard.html';
  };
})();

/* ========================= Dashboard page ========================= */
(function wireDashboard() {
  const u = SSBS.currentUser();
  if (!document.getElementById('btn_logout')) return;
  if (!u) { location.href = 'index.html'; return; }

  const hi = document.getElementById('hiUser');
  if (hi) hi.textContent = u.name;

  const map = {
    btn_dashboard: 'dashboard',
    btn_daily: 'daily',
    btn_expense: 'expense',
    btn_receive: 'receive',
    btn_transfer: 'transfer',
    btn_invoice: 'invoice',
    btn_invoice_dummy: 'invoice_d',
    btn_quote: 'quote',
    btn_statement: 'statement',
    btn_docs: 'docs',
    btn_client: 'client',
    btn_task: 'task',
    btn_mcp: 'mcp',
  };

  Object.entries(map).forEach(([id, key]) => {
    const el = document.getElementById(id);
    if (el) el.onclick = () => SSBS.openModule(key);
  });

  const logoutBtn = document.getElementById('btn_logout');
  if (logoutBtn) {
    logoutBtn.onclick = () => {
      SSBS.logout();
      location.href = 'index.html';
    };
  }

  ['click', 'keydown', 'touchstart'].forEach(evt => document.addEventListener(evt, () => {
    const cu = SSBS.currentUser();
    if (!cu) { location.href = 'index.html'; }
  }, { passive: true }));
})();
