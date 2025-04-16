window.onload = () => {
  const btnLogin = document.getElementById('btn-login');
  const btnCadastro = document.getElementById('btn-cadastro');
  const formLogin = document.getElementById('form-login');
  const formCadastro = document.getElementById('form-cadastro');

  btnLogin.addEventListener('click', () => {
    formLogin.classList.add('active');
    formCadastro.classList.remove('active');
  });

  btnCadastro.addEventListener('click', () => {
    formLogin.classList.remove('active');
    formCadastro.classList.add('active');
  });
}