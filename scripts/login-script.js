const formLogin = document.getElementById('form-login');

  formLogin.addEventListener('submit', async (e) => {
    e.preventDefault();

    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    const response = await fetch('/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    const text = await response.text();

    if (response.ok) {
      alert('Login bem-sucedido!');
      window.location.href = 'buscaProfissionais.html';
    } else {
      alert('Erro no login: ' + text);
    }
  });
