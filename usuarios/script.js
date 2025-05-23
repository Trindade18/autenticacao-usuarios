async function cadastrar() {
  const nome = document.getElementById("cad-nome").value.trim();
  const email = document.getElementById("cad-email").value.trim();
  const telefone = document.getElementById("cad-telefone").value.trim();
  const senha = document.getElementById("cad-senha").value;
  const confirmar = document.getElementById("cad-confirmar").value;

  if (senha !== confirmar) {
    alert("As senhas não coincidem!");
    return;
  }

  if (!/(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}/.test(senha)) {
    alert("A senha deve conter pelo menos 6 caracteres, incluindo uma letra maiúscula, um número e um caractere especial.");
    return;
  }

  const resposta = await fetch("http://localhost:3000/cadastrar", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ nome, email, telefone, senha }),
  });

  const dados = await resposta.json();
  alert(dados.mensagem);
  if (resposta.ok) {
    window.location.href = "tela--de-login.html";
  }
}

async function logar() {
  const nome = document.getElementById("login-nome").value.trim();
  const sobrenome = document.getElementById("login-sobrenome").value.trim();
  const senha = document.getElementById("login-senha").value;

  const resposta = await fetch("http://localhost:3000/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ nome, sobrenome, senha }),
  });

  const dados = await resposta.json();
  alert(dados.mensagem);
}
