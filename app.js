// ============= Theme =============
function initTheme(){
  const saved = localStorage.getItem('ssbs_theme') || 'dark';
  if(saved === 'light') document.body.classList.add('light');
  const btn = document.getElementById('themeBtn');
  if(btn){
    const setLabel = ()=> btn.textContent = document.body.classList.contains('light') ? '🌚 Dark' : '🌙 Dark';
    btn.onclick = ()=>{ document.body.classList.toggle('light'); localStorage.setItem('ssbs_theme', document.body.classList.contains('light') ? 'light' : 'dark'); setLabel(); };
    setLabel();
  }
}

// ============= Session + Auth (front-end only) =============
const SSBS = (function(){
  // Static users (as requested)
  const USERS = {
    'Sameer'        : { pass:'Sameer@1982', role:'ceo'   },
    'Mohamed Sabri' : { pass:'Sabri@1995',  role:'ceo'   },
    'Mohamed Afras' : { pass:'Afras@1997',  role:'agent' },
    'Mohamed Jebras': { pass:'Jebras@1996', role:'agent' }
  };

  // Per-user URL mapping (your /exec links)
  const LINKS = {
    'Sameer': {
      dashboard: 'https://script.google.com/macros/s/AKfycbxC6VK7gOCS_ET0ThOSsY89-N_QdmxGp8TQHmNk8G7wUKdZC73WEHihBKXJ79-dfOQ/exec',
      client   : 'https://script.google.com/macros/s/AKfycbwWu_wRihWzPBc9RrGY2uWjGHDYicmAiN_Hs49JoaiuPQlY4oLJ72zzMZOi2W4JEQ/exec?person=Sameer',
      task     : 'https://script.google.com/macros/s/AKfycbz8-QQAGgULJamv7u8i30EwZc8VUCEjCvLjxGwHNS0m104WpRB8NfZ2q_u4INR7mw/exec',
      mcp      : 'https://script.google.com/macros/s/AKfycbxDkDyTXSjLkJO__F7vqX7lItX-zc6nOUJJLMiETobKpLM49C13mLp38pR0oaHiVA/exec?agent=Sameer'
    },
    'Mohamed Sabri': {
      dashboard: 'https://script.google.com/macros/s/AKfycbzi8s2S-uYdIZ6nuT4QRwlAWbiz20JeBMgwksfO29aey_-AQUrDPiUwsqVkdZsrFSI/exec',
      client   : 'https://script.google.com/macros/s/AKfycbwWu_wRihWzPBc9RrGY2uWjGHDYicmAiN_Hs49JoaiuPQlY4oLJ72zzMZOi2W4JEQ/exec?person=Mohamed+Sabri',
      task     : 'https://script.google.com/macros/s/AKfycbwLNo55fFjPtXTfyVTEx72pTCzrLz5CtIZ1_eJmmHkz6YB_odtUadEq2jTvkvaaH0M/exec',
      mcp      : 'https://script.google.com/macros/s/AKfycbxDkDyTXSjLkJO__F7vqX7lItX-zc6nOUJJLMiETobKpLM49C13mLp38pR0oaHiVA/exec?agent=Mohamed+Sabri'
    },
    'Mohamed Afras': {
      dashboard: 'https://script.google.com/macros/s/AKfycbx34JMpAzYZPRzIndh_ydZOkK6EO_LVctS93R6-aEr-3DVINuKX-kHOUjW8bFcVMaTA/exec',
      client   : 'https://script.google.com/macros/s/AKfycbwWu_wRihWzPBc9RrGY2uWjGHDYicmAiN_Hs49JoaiuPQlY4oLJ72zzMZOi2W4JEQ/exec?person=Mohamed+Afras',
      task     : 'https://script.google.com/macros/s/AKfycbwQF4Qsrde3Ai6rs8P4xESnZ-vsnVdGyIMJ_DF0cYdPW_LfdTuy8CuGSAd6zTTS6NVX/exec',
      mcp      : 'https://script.google.com/macros/s/AKfycbxDkDyTXSjLkJO__F7vqX7lItX-zc6nOUJJLMiETobKpLM49C13mLp38pR0oaHiVA/exec?agent=Mohamed+Afras'
    },
    'Mohamed Jebras': {
      dashboard: 'https://script.google.com/macros/s/AKfycbzWNLNyJ6tXi9eDZnz83KdLndMDAIQx7O3q2R49yODawy1RI744vd-hrMOfoAv6Bc8/exec',
      client   : 'https://script.google.com/macros/s/AKfycbwWu_wRihWzPBc9RrGY2uWjGHDYicmAiN_Hs49JoaiuPQlY4oLJ72zzMZOi2W4JEQ/exec?person=Mohamed+Jebras',
      task     : 'https://script.google.com/macros/s/AKfycbwLKQN4wl6dpu_OUUcHvSe4FTVkCVSv6Z1PY_SvjN2uqL91YSIdZ56qwnjI_8cFNvo/exec',
      mcp      : 'https://script.google.com/macros/s/AKfycbxDkDyTXSjLkJO__F7vqX7lItX-zc6nOUJJLMiETobKpLM49C13mLp38pR0oaHiVA/exec?agent=Mohamed+Jebras'
    }
  };

  function saveSession(name, role){
    localStorage.setItem('ssbs_user', JSON.stringify({name, role}));
  }
  function readSession(){
    try{ return JSON.parse(localStorage.getItem('ssbs_user')||''); }catch(_){ return null; }
  }

  return {
    login(name, pass){
      const u = USERS[name];
      if(!u || u.pass !== pass) return false;
      saveSession(name, u.role);
      return true;
    },
    logout(){
      localStorage.removeItem('ssbs_user');
      location.href = 'index.html';
    },
    requireSession(){
      const s = readSession();
      if(!s){ location.href = 'index.html'; throw new Error('No session'); }
      return s;
    },
    urlFor(name, section){
      const m = LINKS[name]; if(!m) return '';
      if(section === 'client') return m.client;
      if(section === 'task')   return m.task;
      if(section === 'mcp')    return m.mcp;
      // default
      return m.dashboard || '';
    }
  };
})();