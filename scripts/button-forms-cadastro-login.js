window.onload = () => {
  const btnLogin = document.getElementById('btn-login');
  const btnCadastro = document.getElementById('btn-cadastro');
  const btnCadastroPrestador = document.getElementById('btn-cadastro-prestador');

  const formLogin = document.getElementById('form-login');
  const formCadastro = document.getElementById('form-cadastro');
  const formCadastroPrestador = document.getElementById('form-cadastro-prestador');


  btnLogin.addEventListener('click', () => {
    formLogin.classList.add('active');
    formCadastro.classList.remove('active');
    formCadastroPrestador.classList.remove('active');
  });

  btnCadastro.addEventListener('click', () => {
    formLogin.classList.remove('active');
    formCadastro.classList.add('active');
    formCadastroPrestador.classList.remove('active');
  });

    btnCadastroPrestador.addEventListener('click', () => {
    formLogin.classList.remove('active');
    formCadastro.classList.remove('active');
    formCadastroPrestador.classList.add('active');
  });
}