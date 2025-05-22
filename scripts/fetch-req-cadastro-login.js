          document.getElementById('form-cadastro').addEventListener('submit', function(e) {
            e.preventDefault(); // impede reload
            const formData = new FormData(this);

            fetch('/cadastrar', {
                method: 'POST',
                body: new URLSearchParams(formData)
            })
            .then(res => {
                if (!res.ok) throw new Error('Erro no cadastro');
                return res.text();
            })
            .then(msg => {
                alert(msg);
                window.location.href = 'buscaProfissionais.html'; // redireciona
            })
            .catch(err => alert('Erro: ' + err.message));
        });

        document.getElementById('form-cadastro-prestador').addEventListener('submit', function(e) {
            e.preventDefault(); // impede reload
            const formData = new FormData(this);

            fetch('/cadastrarP', {
                method: 'POST',
                body: new URLSearchParams(formData)
            })
            .then(res => {
                if (!res.ok) throw new Error('Erro no cadastro');
                return res.text();
            })
            .then(msg => {
                alert(msg);
                window.location.href = 'buscaProfissionais.html'; // redireciona
            })
            .catch(err => alert('Erro: ' + err.message));
        });