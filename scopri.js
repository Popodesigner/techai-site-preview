const themeButton = document.querySelector('#themeToggle');
if (localStorage.getItem('techai-site-theme') === 'dark') document.body.classList.remove('light');
function applyTheme() {
  const light = document.body.classList.contains('light');
  themeButton.textContent = light ? '☾' : '☼';
  themeButton.setAttribute('aria-label', light ? 'Attiva il tema scuro' : 'Attiva il tema chiaro');
  document.querySelector('meta[name="theme-color"]').content = light ? '#f4f7fb' : '#080d16';
}
applyTheme();
themeButton.addEventListener('click', () => {
  document.body.classList.toggle('light');
  localStorage.setItem('techai-site-theme', document.body.classList.contains('light') ? 'light' : 'dark');
  applyTheme();
});

const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
if ('IntersectionObserver' in window && !reducedMotion) {
  const revealObserver = new IntersectionObserver(entries => {
    for (const entry of entries) {
      if (!entry.isIntersecting) continue;
      entry.target.classList.add('shown');
      revealObserver.unobserve(entry.target);
    }
  }, { rootMargin: '0px 0px -8% 0px', threshold: .1 });
  document.querySelectorAll('[data-reveal]').forEach(element => revealObserver.observe(element));
} else {
  document.querySelectorAll('[data-reveal]').forEach(element => element.classList.add('shown'));
}

const progressFill = document.querySelector('#progressFill');
const jumpLinks = [...document.querySelectorAll('.detail-jump a')];
const jumpSections = jumpLinks.map(link => document.querySelector(link.getAttribute('href'))).filter(Boolean);
let ticking = false;
function updateScroll() {
  const range = document.documentElement.scrollHeight - innerHeight;
  progressFill.style.width = `${range > 0 ? Math.min(100, Math.max(0, scrollY / range * 100)) : 0}%`;
  const focusLine = scrollY + 210;
  let current = jumpSections[0];
  for (const section of jumpSections) if (section.offsetTop <= focusLine) current = section;
  jumpLinks.forEach(link => link.classList.toggle('active', current && link.hash === `#${current.id}`));
  ticking = false;
}
addEventListener('scroll', () => {
  if (ticking) return;
  ticking = true;
  requestAnimationFrame(updateScroll);
}, { passive: true });
updateScroll();

function wireTabs(selector, callback) {
  const buttons = [...document.querySelectorAll(selector)];
  buttons.forEach((button, index) => {
    button.addEventListener('click', () => {
      buttons.forEach(item => item.setAttribute('aria-selected', String(item === button)));
      callback(button);
    });
    button.addEventListener('keydown', event => {
      const direction = event.key === 'ArrowRight' || event.key === 'ArrowDown' ? 1 : event.key === 'ArrowLeft' || event.key === 'ArrowUp' ? -1 : 0;
      if (!direction) return;
      event.preventDefault();
      const next = buttons[(index + direction + buttons.length) % buttons.length];
      next.focus();
      next.click();
    });
  });
}

const stories = {
  acqua: {
    index: '01 / 03',
    title: "L'impianto ha una storia. Il tecnico vede il prossimo segnale.",
    lead: "Una visita aggiunge una rilevazione al percorso del trattamento. Lo storico aiuta a leggere l'andamento e a capire cosa controllare.",
    steps: [['Rileva', 'Registra ciò che osservi.'], ['Leggi', "Segui l'andamento nel tempo."], ['Prepara', 'Porta il contesto alla visita successiva.']],
    outcome: 'La continuità dei dati rende più utile ogni nuova visita.'
  },
  guasto: {
    index: '02 / 03',
    title: 'Una domanda sul campo trova il manuale più vicino al problema.',
    lead: 'Il tecnico parte dal prodotto e consulta documenti e assistenti nel contesto della domanda. Le fonti disponibili restano il riferimento.',
    steps: [['Individua', 'Apri la scheda del prodotto.'], ['Domanda', 'Descrivi il problema con parole tue.'], ['Verifica', 'Controlla il documento collegato.']],
    outcome: 'La risposta aiuta a trovare la fonte da usare sul campo.'
  },
  relazione: {
    index: '03 / 03',
    title: "L'intervento è concluso. La conoscenza continua a circolare.",
    lead: 'Le attività registrate restano nella storia dell’impianto. Gli appunti possono diventare un testo più leggibile e le soluzioni utili possono essere condivise.',
    steps: [['Registra', 'Conserva le attività svolte.'], ['Racconta', 'Dai forma agli appunti.'], ['Condividi', 'Proponi una soluzione al team.']],
    outcome: 'Il lavoro svolto oggi può aiutare il prossimo tecnico.'
  }
};
const storyContent = document.querySelector('#storyContent');
wireTabs('.story-controls button', button => {
  const story = stories[button.dataset.story];
  storyContent.classList.add('changing');
  setTimeout(() => {
    document.querySelector('#storyIndex').textContent = story.index;
    document.querySelector('#storyTitle').textContent = story.title;
    document.querySelector('#storyLead').textContent = story.lead;
    document.querySelector('#storyOutcome').textContent = story.outcome;
    document.querySelector('#storyStages').replaceChildren(...story.steps.map(([title, description], index) => {
      const stage = document.createElement('div');
      const number = document.createElement('span');
      const heading = document.createElement('b');
      const detail = document.createElement('small');
      number.textContent = `0${index + 1}`;
      heading.textContent = title;
      detail.textContent = description;
      stage.append(number, heading, detail);
      return stage;
    }));
    storyContent.classList.remove('changing');
  }, reducedMotion ? 0 : 170);
});

const predictionPhases = [
  ['Tutto parte dalla prima rilevazione.', "La scheda conserva ciò che il tecnico osserva. Con il tempo, la storia dell'impianto acquista significato.", 'IN FORMAZIONE'],
  ['Le visite diventano una linea leggibile.', "Rilevazioni ripetute rendono visibile un andamento. L'informazione non resta isolata nella singola scheda.", 'STORICO ATTIVO'],
  ['Il segnale arriva prima della prossima visita.', "Quando lo storico lo consente, TECHAI evidenzia autonomia e scostamenti che meritano attenzione.", 'ATTENZIONE OPERATIVA']
];
const signalBoard = document.querySelector('.signal-board');
signalBoard.dataset.phase = '0';
wireTabs('.prediction-controls button', button => {
  const phase = Number(button.dataset.phase);
  const [title, description, status] = predictionPhases[phase];
  document.querySelector('#predictionTitle').textContent = title;
  document.querySelector('#predictionText').textContent = description;
  document.querySelector('#signalStatus').textContent = status;
  signalBoard.dataset.phase = String(phase);
});

const conversations = {
  eva: ['E.V.A. / CONTESTO OPERATIVO', "Che cosa è stato fatto nell'ultima visita?", 'E.V.A.', 'Posso aiutarti a ripercorrere le registrazioni disponibili e portare il contesto alla prossima attività.', '↳ Storico dell’impianto'],
  teco: ['TECO / MANUALI E GUASTI', 'Dove trovo la procedura per questo prodotto?', 'TECO', 'Cerchiamo nel manuale disponibile e apriamo il passaggio pertinente prima di procedere.', '↳ Manuale collegato'],
  idra: ['IDRA / TRATTAMENTO ACQUA', 'Cosa dovrei controllare in questo trattamento?', 'IDRA', 'Partiamo dalle analisi e dalle rilevazioni disponibili per capire quali aspetti richiedono attenzione.', '↳ Dati del trattamento']
};
const conversation = document.querySelector('.conversation');
wireTabs('.assistant-selector button', button => {
  const [name, question, label, answer, source] = conversations[button.dataset.agent];
  conversation.classList.add('changing');
  setTimeout(() => {
    document.querySelector('#conversationName').textContent = name;
    document.querySelector('#userMessage').textContent = question;
    document.querySelector('#assistantLabel').textContent = label;
    document.querySelector('#assistantMessage').textContent = answer;
    document.querySelector('#sourcePill').textContent = source;
    conversation.classList.remove('changing');
  }, reducedMotion ? 0 : 150);
});

document.querySelector('#year').textContent = new Date().getFullYear();
