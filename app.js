const examples = [
  { id: 1, title: 'Computador não inicia', category: 'Computadores', priority: 'Alta', status: 'Em andamento', description: 'O computador da secretaria não inicia após ligar.', events: [{ title: 'Chamado registrado', note: 'Solicitação aberta pelo usuário.' }, { title: 'Atendimento iniciado', note: 'Equipe de suporte iniciou a análise.' }] },
  { id: 2, title: 'Impressora sem conexão', category: 'Impressoras', priority: 'Normal', status: 'Pendente', description: 'A impressora de rede está indisponível.', events: [{ title: 'Chamado registrado', note: 'Solicitação aberta pelo usuário.' }, { title: 'Aguardando informações', note: 'Pendente de detalhes do equipamento.' }] },
  { id: 3, title: 'Acesso ao sistema', category: 'Sistemas', priority: 'Normal', status: 'Resolvido', description: 'Dificuldade de acesso ao sistema de testes.', events: [{ title: 'Chamado registrado', note: 'Solicitação aberta pelo usuário.' }, { title: 'Chamado resolvido', note: 'Acesso restabelecido (simulação).' }] },
  { id: 4, title: 'Rede instável na sala', category: 'Rede e internet', priority: 'Baixa', status: 'Aberto', description: 'A conexão oscila durante as atividades.', events: [{ title: 'Chamado registrado', note: 'Solicitação aberta pelo usuário.' }] }
];
let tickets = structuredClone(examples);
let selectedId = null;
let role = 'solicitante';
const $ = id => document.getElementById(id);
const escapeHtml = value => String(value).replace(/[&<>"']/g, c => ({ '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;' })[c]);
const statusClass = status => status === 'Pendente' ? 'pending' : status === 'Resolvido' ? 'done' : status === 'Aberto' ? 'open' : '';
function show(view) {
  for (const section of document.querySelectorAll('.view')) section.hidden = section.id !== view;
  for (const button of document.querySelectorAll('.nav-item')) button.classList.toggle('active', button.dataset.view === view);
  $('page-title').textContent = ({ inicio:'Visão geral', chamados:'Chamados', novo:'Abrir chamado', detalhe:'Detalhes do chamado' })[view];
  if (view === 'inicio' || view === 'chamados') renderLists();
  window.scrollTo({ top:0, behavior:'instant' });
}
function ticketHtml(ticket) {
  return `<button class="ticket" data-ticket="${ticket.id}"><span><span class="ticket-title">#${ticket.id.toString().padStart(4,'0')} · ${escapeHtml(ticket.title)}</span><span class="ticket-meta">${escapeHtml(ticket.category)} · Prioridade ${escapeHtml(ticket.priority)}</span></span><span class="ticket-right"><span class="pill ${statusClass(ticket.status)}">${escapeHtml(ticket.status)}</span><span aria-hidden="true">›</span></span></button>`;
}
function renderLists() {
  $('total').textContent = tickets.length;
  $('andamento').textContent = tickets.filter(t => t.status === 'Em andamento').length;
  $('pendentes').textContent = tickets.filter(t => t.status === 'Pendente').length;
  $('resolvidos').textContent = tickets.filter(t => t.status === 'Resolvido').length;
  $('recent-list').innerHTML = tickets.slice(0, 4).map(ticketHtml).join('');
  const filter = $('status-filter').value;
  const filtered = tickets.filter(t => filter === 'todos' || t.status === filter);
  $('ticket-list').innerHTML = filtered.length ? filtered.map(ticketHtml).join('') : '<div class="empty">Nenhum chamado encontrado.</div>';
}
function showTicket(id) {
  selectedId = id;
  const ticket = tickets.find(t => t.id === id);
  if (!ticket) return;
  const timeline = ticket.events.map(event => `<div class="event"><strong>${escapeHtml(event.title)}</strong><p>${escapeHtml(event.note)}</p><small>Evento demonstrativo</small></div>`).join('');
  $('detail-content').innerHTML = `<h2 class="detail-title">#${ticket.id.toString().padStart(4,'0')} · ${escapeHtml(ticket.title)}</h2><div class="detail-meta"><span class="pill ${statusClass(ticket.status)}">${escapeHtml(ticket.status)}</span><span>${escapeHtml(ticket.category)}</span><span>Prioridade: ${escapeHtml(ticket.priority)}</span></div><div class="detail-description">${escapeHtml(ticket.description)}</div><h2>Histórico do chamado</h2><div class="timeline">${timeline}</div>${role === 'tecnico' ? `<div class="technician"><label for="next-status">Atualizar status (somente simulação)</label><select id="next-status"><option>Aberto</option><option>Em andamento</option><option>Pendente</option><option>Resolvido</option></select><button id="save-status" class="primary">Salvar status</button></div>` : ''}`;
  if (role === 'tecnico') {
    $('next-status').value = ticket.status;
    $('save-status').addEventListener('click', () => {
      const next = $('next-status').value;
      if (next !== ticket.status) { ticket.status = next; ticket.events.push({ title: 'Status alterado para ' + next, note: 'Alteração fictícia realizada na demonstração.' }); }
      showTicket(ticket.id);
    });
  }
  show('detalhe');
}
document.addEventListener('click', event => {
  const ticketButton = event.target.closest('[data-ticket]');
  if (ticketButton) return showTicket(Number(ticketButton.dataset.ticket));
  const viewButton = event.target.closest('[data-view]');
  if (viewButton) show(viewButton.dataset.view);
});
$('new-top').addEventListener('click', () => show('novo'));
$('back').addEventListener('click', () => show('chamados'));
$('status-filter').addEventListener('change', renderLists);
$('role').addEventListener('change', event => { role = event.target.value; if (!$('detalhe').hidden && selectedId !== null) showTicket(selectedId); });
$('new-form').addEventListener('submit', event => {
  event.preventDefault();
  const form = event.currentTarget;
  if (!form.reportValidity()) return;
  const data = new FormData(form);
  const id = Math.max(0, ...tickets.map(t => t.id)) + 1;
  tickets.unshift({ id, title: String(data.get('title')).trim(), category: String(data.get('category')), priority: String(data.get('priority')), description: String(data.get('description')).trim(), status: 'Aberto', events: [{ title: 'Chamado registrado', note: 'Criado neste protótipo offline, sem envio ao servidor.' }] });
  form.reset();
  showTicket(id);
});
show('inicio');
