(function(){
  const form = document.getElementById('regForm');
  const u = document.getElementById('r_username');
  const p = document.getElementById('r_password');
  const d = document.getElementById('r_display');

  function ensureToastRoot(){
    let root = document.querySelector('.toast-root');
    if (!root){
      root = document.createElement('div');
      root.className = 'toast-root';
      document.body.appendChild(root);
    }
    return root;
  }
  function toast(msg){
    const root = ensureToastRoot();
    const el = document.createElement('div');
    el.className = 'toast';
    el.textContent = msg;
    root.appendChild(el);
    setTimeout(()=>{
      el.style.transition = 'opacity .2s, transform .2s';
      el.style.opacity = '0';
      el.style.transform = 'translateY(-6px)';
      setTimeout(()=>root.removeChild(el), 250);
    }, 1600);
  }

  form.addEventListener('submit', async (e)=>{
    e.preventDefault();
    const username = u.value.trim();
    const password = p.value.trim();
    const displayName = d.value.trim();
    if (!username || !password) { toast('请输入用户名与密码'); return; }
    const btn = form.querySelector('[type="submit"]');
    if (btn) { btn.disabled = true; const t = btn.textContent; btn.dataset._t = t; btn.textContent = '注册中...'; }
    try {
      const base = window.API_BASE || '';
      const res = await fetch(base + '/api/auth/register', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password, displayName })
      });
      if (res.status === 409) { toast('用户名已存在'); return; }
      if (!res.ok) throw new Error('注册失败');
      toast('注册成功，请登录');
      setTimeout(()=>{ location.href = '/'; }, 600);
    } catch (err) {
      toast(err.message || '注册失败');
    } finally {
      const btn2 = form.querySelector('[type="submit"]');
      if (btn2) { btn2.disabled = false; btn2.textContent = btn2.dataset._t || '注册'; }
    }
  });
})();
