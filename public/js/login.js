(function(){
  const form = document.getElementById('loginForm');
  const usernameEl = document.getElementById('username');
  const passwordEl = document.getElementById('password');
  

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

  // 不再记住密码，不做任何预填处理

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const username = usernameEl.value.trim();
    const password = passwordEl.value.trim();
    const submitBtn = form.querySelector('[type="submit"]');
    if (submitBtn) { submitBtn.disabled = true; const oldText = submitBtn.textContent; submitBtn.dataset._t = oldText; submitBtn.textContent = '登录中...'; }

    try {
      const base = window.API_BASE || '';
      const res = await fetch(base + '/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });
      if (!res.ok) throw new Error('登录失败');
      const user = await res.json();

      // 不保存用户名与密码，不再提供记住密码功能
      localStorage.setItem('user', JSON.stringify(user));
      toast('登录成功');
      location.href = '/app.html';
    } catch (err) {
      toast(err.message || '登录失败');
    } finally {
      const submitBtn2 = form.querySelector('[type="submit"]');
      if (submitBtn2) { submitBtn2.disabled = false; submitBtn2.textContent = submitBtn2.dataset._t || '登录'; }
    }
  });
})();
