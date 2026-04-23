let pacientes = JSON.parse(localStorage.getItem('fisio_data')) || [];
let pacienteAtualIndex = null;

function salvarPaciente() {
  const nome = document.getElementById('nome').value;
  const idade = document.getElementById('idade').value;
  const cid = document.getElementById('cid').value;
  
  if (!nome) return alert("Preencha o nome!");
  
  pacientes.push({ nome, idade, cid, evolucoes: [] });
  localStorage.setItem('fisio_data', JSON.stringify(pacientes));
  
  // Limpar e fechar
  document.getElementById('nome').value = '';
  toggleForm();
  renderizarPacientes();
}

function buscarPaciente() {
  const termo = document.getElementById('inputBusca').value.toLowerCase();
  renderizarPacientes(termo);
}

function renderizarPacientes(filtro = "") {
  const lista = document.getElementById('listaPacientes');
  lista.innerHTML = '';
  
  pacientes.forEach((p, index) => {
    if (p.nome.toLowerCase().includes(filtro)) {
      // Pega a última evolução se existir
      const ultima = p.evolucoes.length > 0 ? p.evolucoes[0].texto.substring(0, 45) + "..." : "Nenhuma evolução registrada";
      
      lista.innerHTML += `
                <div class="paciente-card">
                    <div class="paciente-info" onclick="abrirEvolucoes(${index})">
                        <h4>${p.nome}</h4>
                        <small>${p.idade} anos | CID: ${p.cid}</small>
                        <div class="ultima-evolucao"><strong>Última:</strong> ${ultima}</div>
                    </div>
                    <button class="btn-del" onclick="deletarPaciente(${index})">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            `;
    }
  });
}

function deletarPaciente(index) {
  if (confirm("Deseja apagar este registro permanentemente?")) {
    pacientes.splice(index, 1);
    localStorage.setItem('fisio_data', JSON.stringify(pacientes));
    renderizarPacientes();
  }
}

function abrirEvolucoes(index) {
  pacienteAtualIndex = index;
  const p = pacientes[index];
  document.getElementById('modalNomePaciente').innerText = p.nome;
  document.getElementById('modalInfoPaciente').innerText = `${p.idade} anos - CID: ${p.cid}`;
  document.getElementById('modalEvolucao').style.display = 'block';
  renderizarEvolucoes();
}

function adicionarEvolucao() {
  const texto = document.getElementById('textoEvolucao').value;
  if (!texto) return;
  
  const data = new Date().toLocaleDateString('pt-BR');
  pacientes[pacienteAtualIndex].evolucoes.unshift({ data, texto });
  
  localStorage.setItem('fisio_data', JSON.stringify(pacientes));
  document.getElementById('textoEvolucao').value = '';
  renderizarEvolucoes();
  renderizarPacientes(); // Atualiza a "playlist" com a nova última evolução
}

function renderizarEvolucoes() {
  const container = document.getElementById('historicoEvolucoes');
  container.innerHTML = '';
  pacientes[pacienteAtualIndex].evolucoes.forEach(ev => {
    container.innerHTML += `
            <div style="border-bottom: 1px solid #eee; padding: 10px 0;">
                <small style="color: var(--primary); font-weight: bold;">${ev.data}</small>
                <p style="margin: 5px 0;">${ev.texto}</p>
            </div>
        `;
  });
}

function fecharModal() { document.getElementById('modalEvolucao').style.display = 'none'; }

function toggleForm() { document.getElementById('formCadastro').classList.toggle('hidden'); }

// Inicialização
renderizarPacientes();