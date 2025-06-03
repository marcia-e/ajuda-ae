  window.onload = ()=>  {
    const form = document.getElementById('form-busca');
    const prestadoresContainer = document.getElementById('prestadoresContainer');

    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const especialidade = document.getElementById('especialidade').value;

      const resposta = await fetch(`/buscar-prestadores?especialidade=${encodeURIComponent(especialidade)}`);
      const dados = await resposta.json();

      prestadoresContainer.innerHTML = '';

      if (dados.length === 0) {
        resultados.innerHTML = '<li>Nenhum prestador encontrado</li>';
        return;
      }

dados.forEach(prestador => {
    console.log(prestador); 

    const cardDiv = document.createElement('div');

    cardDiv.classList.add('prestador-card');

    cardDiv.innerHTML = `
        <h3>${prestador.NOME}</h3>
        <p><strong>Especialidade:</strong> ${prestador.ESPECIALIDADE}</p>
        <p><strong>Telefone:</strong> ${prestador.TELEFONE}</p>
        <p><strong>Descrição:</strong> ${prestador.DESCRICAO || 'Nenhuma descrição fornecida.'}</p>
        <button class="contato-btn" data-email="${prestador.EMAIL}">Entrar em Contato</button>
    `;

    prestadoresContainer.appendChild(cardDiv);
});
    })
    }