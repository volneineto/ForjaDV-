/**
 * FORJA DV — Plataforma Corporativa Direcional Vendas
 * Arquitetura Minimalista: 2 Dobras Principais (Carrossel de Vídeos + PDFs)
 */

let appData = {
  config: {
    nomePlataforma: "FORJA DV",
    subtitulo: "Forjando Corretores de Alta Performance",
    empresa: "Direcional Vendas"
  },
  videos: [],
  materiais: []
};

// Dados padrão iniciais (caso haja falha de carregamento de arquivo ou primeira inicialização)
const defaultData = {
  videos: [
    {
      id: "vid-01",
      titulo: "Resumo do best seller Prospecção Fanática",
      descricao: "Estratégias essenciais de prospecção e abordagem de alta conversão.",
      youtubeUrl: "https://youtu.be/-GFRTaa2t3M?si=9eVnZP6T-R5JMQ8-",
      categoria: "Alta Performance"
    },
    {
      id: "vid-02",
      titulo: "Simulador Pro Soluto Direcional",
      descricao: "Aprenda a utilizar o simulador e montar fluxos de pagamento eficientes.",
      youtubeUrl: "https://www.youtube.com/watch?v=Rr_jJeXCKsQ",
      categoria: "Ferramentas DV"
    }
  ],
  materiais: [
    {
      id: "mat-01",
      titulo: "Manual de Objeções Direcional Vendas",
      descricao: "Respostas práticas e argumentos de fechamento para as principais objeções de clientes.",
      pdfUrl: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
      categoria: "Técnicas de Vendas"
    },
    {
      id: "mat-02",
      titulo: "Checklist de Documentação Crédito Caixa",
      descricao: "Guia de conferência de documentos para agilizar aprovação no correspondente.",
      pdfUrl: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
      categoria: "Financiamento"
    },
    {
      id: "mat-03",
      titulo: "Tabela de Benefícios e Diferenciais Direcional",
      descricao: "Material comparativo com atributos construtivos e vantagens competitivas.",
      pdfUrl: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
      categoria: "Lançamentos"
    }
  ]
};

// ============================================================================
// Utilitários de YouTube
// ============================================================================
function extractYoutubeId(url) {
  if (!url) return null;
  const cleanUrl = url.trim();
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=|shorts\/)([^#&?]*).*/;
  const match = cleanUrl.match(regExp);
  return (match && match[2].length === 11) ? match[2] : null;
}

function getYoutubeThumbnail(url) {
  const id = extractYoutubeId(url);
  return id 
    ? `https://img.youtube.com/vi/${id}/hqdefault.jpg` 
    : 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=600&auto=format&fit=crop&q=80';
}

function getYoutubeEmbedUrl(url) {
  const id = extractYoutubeId(url);
  return id ? `https://www.youtube.com/embed/${id}?autoplay=1&rel=0` : '';
}

// ============================================================================
// Inicialização e Carregamento de Dados
// ============================================================================
document.addEventListener('DOMContentLoaded', () => {
  const yearEl = document.getElementById('current-year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  loadData();
});

async function loadData() {
  try {
    const res = await fetch('dados.json?t=' + Date.now());
    if (res.ok) {
      const data = await res.json();
      appData = {
        config: data.config || defaultData.config,
        videos: Array.isArray(data.videos) && data.videos.length > 0 ? data.videos : defaultData.videos,
        materiais: Array.isArray(data.materiais) && data.materiais.length > 0 ? data.materiais : defaultData.materiais
      };
    } else {
      throw new Error('Falha no fetch');
    }
  } catch (err) {
    console.warn('Carregando dados locais de fallback:', err);
    // Verificar se há dados salvos no localStorage
    const savedVideos = localStorage.getItem('forja_custom_videos');
    if (savedVideos) {
      try {
        appData.videos = JSON.parse(savedVideos);
      } catch (e) {
        appData.videos = defaultData.videos;
      }
    } else {
      appData.videos = defaultData.videos;
    }
    appData.materiais = defaultData.materiais;
  }

  // Mesclar com possíveis vídeos extras adicionados pelo usuário no navegador
  const localExtra = localStorage.getItem('forja_local_videos');
  if (localExtra) {
    try {
      const extraList = JSON.parse(localExtra);
      if (Array.isArray(extraList) && extraList.length > 0) {
        extraList.forEach(item => {
          if (!appData.videos.some(v => v.youtubeUrl === item.youtubeUrl)) {
            appData.videos.push(item);
          }
        });
      }
    } catch (e) {
      console.error(e);
    }
  }

  // Mesclar com possíveis PDFs extras adicionados pelo usuário no navegador
  const localPdfExtra = localStorage.getItem('forja_local_pdfs');
  if (localPdfExtra) {
    try {
      const extraPdfList = JSON.parse(localPdfExtra);
      if (Array.isArray(extraPdfList) && extraPdfList.length > 0) {
        extraPdfList.forEach(item => {
          if (!appData.materiais.some(m => m.pdfUrl === item.pdfUrl && m.titulo === item.titulo)) {
            appData.materiais.push(item);
          }
        });
      }
    } catch (e) {
      console.error(e);
    }
  }

  renderVideosCarousel();
  renderPdfGrid();
}

// ============================================================================
// DOBRA 1: Renderização do Carrossel de Vídeos (Estilo Netflix / Apple)
// ============================================================================
function renderVideosCarousel() {
  const track = document.getElementById('carousel-videos-track');
  if (!track) return;

  track.innerHTML = '';

  appData.videos.forEach((video) => {
    const thumb = getYoutubeThumbnail(video.youtubeUrl);
    const card = document.createElement('div');
    card.className = 'carousel-card';
    card.onclick = () => openVideoModal(video);

    card.innerHTML = `
      <div class="card-media">
        <img 
          src="${thumb}" 
          alt="${escapeHtml(video.titulo)}" 
          class="card-thumb" 
          loading="lazy" 
          onerror="this.src='https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=600&auto=format&fit=crop&q=80'"
        />
        <div class="card-overlay">
          <div class="play-badge" aria-label="Assistir Vídeo">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <polygon points="6 3 20 12 6 21 6 3"></polygon>
            </svg>
          </div>
        </div>
      </div>
      <div class="card-content">
        <span class="card-cat">${escapeHtml(video.categoria || 'Treinamento')}</span>
        <h3 class="card-title">${escapeHtml(video.titulo)}</h3>
        <p class="card-desc">${escapeHtml(video.descricao || '')}</p>
        <div class="card-action">
          <span>Assistir Agora</span>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
            <polyline points="9 18 15 12 9 6"></polyline>
          </svg>
        </div>
      </div>
    `;

    track.appendChild(card);
  });

  // Card para Adicionar Vídeo no final do Carrossel
  const addCard = document.createElement('div');
  addCard.className = 'carousel-card carousel-card-add';
  addCard.onclick = () => openAddVideoModal();
  addCard.innerHTML = `
    <div class="add-icon-circle">
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
        <line x1="12" y1="5" x2="12" y2="19"></line>
        <line x1="5" y1="12" x2="19" y2="12"></line>
      </svg>
    </div>
    <h3 class="add-card-title">Incluir Novo Vídeo</h3>
    <p class="add-card-desc">Cole o link do YouTube para aparecer na página</p>
  `;
  track.appendChild(addCard);
}

// Navegação do Carrossel por botões
function scrollCarousel(direction) {
  const track = document.getElementById('carousel-videos-track');
  if (!track) return;
  const scrollAmount = 380 * direction;
  track.scrollBy({ left: scrollAmount, behavior: 'smooth' });
}

// ============================================================================
// DOBRA 2: Renderização da Biblioteca de PDFs
// ============================================================================
function renderPdfGrid() {
  const grid = document.getElementById('pdf-grid');
  if (!grid) return;

  grid.innerHTML = '';

  appData.materiais.forEach((mat) => {
    const card = document.createElement('div');
    card.className = 'pdf-card';

    card.innerHTML = `
      <div>
        <div class="pdf-card-top">
          <div class="pdf-icon-box">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
              <polyline points="14 2 14 8 20 8"></polyline>
              <line x1="16" y1="13" x2="8" y2="13"></line>
              <line x1="16" y1="17" x2="8" y2="17"></line>
              <polyline points="10 9 9 9 8 9"></polyline>
            </svg>
          </div>
          <div>
            <span class="pdf-cat">${escapeHtml(mat.categoria || 'Material')}</span>
            <h3 class="pdf-title">${escapeHtml(mat.titulo)}</h3>
          </div>
        </div>
        <p class="pdf-desc">${escapeHtml(mat.descricao || '')}</p>
      </div>

      <a href="${mat.pdfUrl}" target="_blank" rel="noopener noreferrer" class="btn-open-pdf">
        <span>Abrir Documento PDF</span>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
          <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
          <polyline points="15 3 21 3 21 9"></polyline>
          <line x1="10" y1="14" x2="21" y2="3"></line>
        </svg>
      </a>
    `;

    grid.appendChild(card);
  });

  // Card para Adicionar PDF no final da lista
  const addCard = document.createElement('div');
  addCard.className = 'pdf-card pdf-card-add';
  addCard.onclick = () => openAddPdfModal();
  addCard.innerHTML = `
    <div class="add-icon-circle">
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
        <line x1="12" y1="5" x2="12" y2="19"></line>
        <line x1="5" y1="12" x2="19" y2="12"></line>
      </svg>
    </div>
    <h3 class="add-card-title">Incluir Novo PDF</h3>
    <p class="add-card-desc">Cole o link do seu documento para aparecer na biblioteca</p>
  `;
  grid.appendChild(addCard);
}

// ============================================================================
// Modal do Player de Vídeo
// ============================================================================
function openVideoModal(video) {
  const modal = document.getElementById('video-modal');
  const iframe = document.getElementById('modal-video-iframe');
  const title = document.getElementById('modal-video-title');
  const cat = document.getElementById('modal-video-category');
  const desc = document.getElementById('modal-video-desc');

  if (!modal || !iframe) return;

  const embedUrl = getYoutubeEmbedUrl(video.youtubeUrl);
  iframe.src = embedUrl;
  if (title) title.textContent = video.titulo;
  if (cat) cat.textContent = video.categoria || 'FORJA DV';
  if (desc) desc.textContent = video.descricao || '';

  modal.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeVideoModal() {
  const modal = document.getElementById('video-modal');
  const iframe = document.getElementById('modal-video-iframe');

  if (iframe) iframe.src = '';
  if (modal) modal.classList.remove('open');
  document.body.style.overflow = '';
}

// ============================================================================
// Modal de Inclusão de Vídeos (Painel para o usuário colar links)
// ============================================================================
function openAddVideoModal() {
  const modal = document.getElementById('add-video-modal');
  if (modal) {
    modal.classList.add('open');
    document.body.style.overflow = 'hidden';
    const input = document.getElementById('new-video-url');
    if (input) setTimeout(() => input.focus(), 150);
  }
}

function closeAddVideoModal() {
  const modal = document.getElementById('add-video-modal');
  if (modal) {
    modal.classList.remove('open');
    document.body.style.overflow = '';
  }
}

function handleAddNewVideo(e) {
  e.preventDefault();
  const urlInput = document.getElementById('new-video-url');
  const titleInput = document.getElementById('new-video-title');
  const descInput = document.getElementById('new-video-desc');

  const url = urlInput ? urlInput.value.trim() : '';
  const title = titleInput ? titleInput.value.trim() : '';
  const desc = descInput ? descInput.value.trim() : '';

  if (!url || !title) {
    alert('Por favor, preencha o link do YouTube e o título.');
    return;
  }

  const id = extractYoutubeId(url);
  if (!id) {
    alert('Link do YouTube inválido. Certifique-se de que é um link válido do YouTube.');
    return;
  }

  const newVideo = {
    id: 'vid-' + Date.now(),
    titulo: title,
    descricao: desc,
    youtubeUrl: url,
    categoria: 'Treinamento DV'
  };

  appData.videos.push(newVideo);

  // Salvar no localStorage para persistir na sessão do navegador
  try {
    let localVideos = [];
    const saved = localStorage.getItem('forja_local_videos');
    if (saved) localVideos = JSON.parse(saved);
    localVideos.push(newVideo);
    localStorage.setItem('forja_local_videos', JSON.stringify(localVideos));
  } catch (err) {
    console.error(err);
  }

  renderVideosCarousel();
  closeAddVideoModal();

  // Limpar campos
  if (urlInput) urlInput.value = '';
  if (titleInput) titleInput.value = '';
  if (descInput) descInput.value = '';

  // Rolar até o final do carrossel
  setTimeout(() => {
    const track = document.getElementById('carousel-videos-track');
    if (track) track.scrollTo({ left: track.scrollWidth, behavior: 'smooth' });
  }, 200);
}

function exportJsonConfig() {
  const jsonContent = JSON.stringify(appData, null, 2);
  navigator.clipboard.writeText(jsonContent).then(() => {
    alert('Código JSON copiado para sua área de transferência! Você pode colá-lo no arquivo dados.json para atualizar permanentemente no GitHub.');
  }).catch(() => {
    prompt('Copie o código JSON abaixo para colar no seu dados.json:', jsonContent);
  });
}

// ============================================================================
// Modal de Inclusão de PDFs (Painel para o usuário colar links de PDF)
// ============================================================================
function openAddPdfModal() {
  const modal = document.getElementById('add-pdf-modal');
  if (modal) {
    modal.classList.add('open');
    document.body.style.overflow = 'hidden';
    const input = document.getElementById('new-pdf-url');
    if (input) setTimeout(() => input.focus(), 150);
  }
}

function closeAddPdfModal() {
  const modal = document.getElementById('add-pdf-modal');
  if (modal) {
    modal.classList.remove('open');
    document.body.style.overflow = '';
  }
}

function handleAddNewPdf(e) {
  e.preventDefault();
  const urlInput = document.getElementById('new-pdf-url');
  const titleInput = document.getElementById('new-pdf-title');
  const catInput = document.getElementById('new-pdf-cat');
  const descInput = document.getElementById('new-pdf-desc');

  const url = urlInput ? urlInput.value.trim() : '';
  const title = titleInput ? titleInput.value.trim() : '';
  const cat = catInput && catInput.value.trim() ? catInput.value.trim() : 'Material de Apoio';
  const desc = descInput ? descInput.value.trim() : '';

  if (!url || !title) {
    alert('Por favor, preencha o link do PDF e o título.');
    return;
  }

  const newPdf = {
    id: 'mat-' + Date.now(),
    titulo: title,
    descricao: desc,
    pdfUrl: url,
    categoria: cat
  };

  appData.materiais.push(newPdf);

  // Salvar no localStorage para persistir na sessão do navegador
  try {
    let localPdfs = [];
    const saved = localStorage.getItem('forja_local_pdfs');
    if (saved) localPdfs = JSON.parse(saved);
    localPdfs.push(newPdf);
    localStorage.setItem('forja_local_pdfs', JSON.stringify(localPdfs));
  } catch (err) {
    console.error(err);
  }

  renderPdfGrid();
  closeAddPdfModal();

  // Limpar campos
  if (urlInput) urlInput.value = '';
  if (titleInput) titleInput.value = '';
  if (catInput) catInput.value = '';
  if (descInput) descInput.value = '';

  // Rolar até a seção de PDFs
  setTimeout(() => {
    const pdfSection = document.getElementById('pdf-section');
    if (pdfSection) pdfSection.scrollIntoView({ behavior: 'smooth' });
  }, 200);
}

// Fechamento de modais com clique fora ou tecla ESC
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    closeVideoModal();
    closeAddVideoModal();
    closeAddPdfModal();
  }
});

document.addEventListener('click', (e) => {
  const videoModal = document.getElementById('video-modal');
  const addModal = document.getElementById('add-video-modal');
  const addPdfModal = document.getElementById('add-pdf-modal');

  if (videoModal && e.target === videoModal) closeVideoModal();
  if (addModal && e.target === addModal) closeAddVideoModal();
  if (addPdfModal && e.target === addPdfModal) closeAddPdfModal();
});

function escapeHtml(str) {
  if (!str) return '';
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}
