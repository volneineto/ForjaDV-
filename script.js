/**
 * ============================================================================
 * FORJA DV - Script Principal (JavaScript Puro)
 * Plataforma de Treinamento Direcional Vendas
 * Compatível com GitHub Pages e Navegadores Modernos
 * ============================================================================
 */

// Estado global da aplicação
const state = {
  data: null,
  activeVideoCategory: "Todos",
  videoSearchTerm: "",
  activeMaterialCategory: "Todos",
  materialSearchTerm: "",
  currentModalVideo: null
};

// Dados padrão de segurança (Fallback para quando o arquivo for aberto via file:// sem servidor local)
const FALLBACK_DATA = {
  config: {
    nomePlataforma: "FORJA DV",
    subtitulo: "Forjando Corretores de Alta Performance",
    empresa: "Direcional Vendas",
    descricao: "Ambiente oficial de capacitação contínua, técnicas de fechamento e materiais estratégicos para o time comercial da Direcional.",
    links: {
      portalDirecional: "https://www.direcional.com.br",
      suporteComercial: "https://api.whatsapp.com"
    }
  },
  destaqueSemana: {
    id: "destaque-01",
    badge: "Destaque da Semana",
    categoria: "Técnicas de Fechamento",
    titulo: "Masterclass: Como Converter Leads Frios em Vendas em Menos de 7 Dias",
    subtitulo: "Estratégias comprovadas para contornar objeções de entrada e acelerar aprovação de crédito.",
    descricao: "Aprenda o passo a passo prático utilizado pelos top 1% corretores da Direcional para qualificar clientes no primeiro contato, criar senso de urgência legítimo e conduzir a negociação até a assinatura da proposta.",
    youtubeUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    duracao: "28 min",
    instrutor: "Coordenação de Performance DV",
    topicos: [
      "Qualificação em 3 perguntas-chave no WhatsApp",
      "Como apresentar o fluxo de pagamento sem assustar o cliente",
      "Gatilhos mentais de escassez e tabela de lançamento",
      "Fechamento assistido com simulação Caixa na hora"
    ],
    materialComplementar: "Guia de Contorno de Objeções (PDF)"
  },
  categorias: [
    "Todos",
    "Técnicas de Vendas",
    "Crédito & Financiamento",
    "Lançamentos Direcional",
    "Atendimento & CRM",
    "Mindset & Alta Performance"
  ],
  videos: [
    {
      id: "vid-01",
      titulo: "Scripts de Alta Conversão para Abordagem no WhatsApp",
      descricao: "Modelos prontos de mensagens para reativar leads antigos e responder novos contatos com taxa de resposta superior a 70%.",
      youtubeUrl: "https://www.youtube.com/watch?v=ScMzIvxBSi4",
      duracao: "14 min",
      categoria: "Técnicas de Vendas",
      nivel: "Iniciante / Intermediário",
      data: "Atualizado"
    },
    {
      id: "vid-02",
      titulo: "Dominando a Análise de Crédito Caixa & Minha Casa Minha Vida",
      descricao: "Entenda todas as regras de composição de renda, subsídios, FGTS e como evitar reprovações no correspondente bancário.",
      youtubeUrl: "https://www.youtube.com/watch?v=kJQP7kiw5Fk",
      duracao: "22 min",
      categoria: "Crédito & Financiamento",
      nivel: "Essencial",
      data: "Atualizado"
    },
    {
      id: "vid-03",
      titulo: "Apresentação de Produto de Alto Impacto no Stand de Vendas",
      descricao: "Como conduzir o tour pelo apartamento decorado, destacar os diferenciais construtivos da Direcional e encantar a família.",
      youtubeUrl: "https://www.youtube.com/watch?v=9bZkp7q19f0",
      duracao: "18 min",
      categoria: "Lançamentos Direcional",
      nivel: "Prático",
      data: "Atualizado"
    }
  ],
  materiais: [
    {
      id: "mat-01",
      titulo: "Manual de Objeções Direcional Vendas (Edição 2026)",
      descricao: "Guia prático com mais de 30 respostas prontas para 'Está caro', 'Vou pensar', 'Entrada muito alta' e 'Vou falar com meu cônjuge'.",
      pdfUrl: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
      categoria: "Técnicas de Vendas",
      formato: "PDF",
      paginas: "24 páginas",
      tamanho: "2.4 MB",
      destaque: true
    },
    {
      id: "mat-02",
      titulo: "Checklist de Documentação para Aprovação de Crédito Caixa",
      descricao: "Folha de conferência rápida para solicitar ao cliente todos os documentos necessários sem retrabalho na análise.",
      pdfUrl: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
      categoria: "Crédito & Financiamento",
      formato: "PDF",
      paginas: "4 páginas",
      tamanho: "850 KB",
      destaque: false
    }
  ]
};

/**
 * Utilitário: Extrai o ID do vídeo do YouTube suportando todos os formatos
 * (incluindo links de vídeos Não Listados)
 * Exemplos:
 * - https://www.youtube.com/watch?v=VIDEO_ID
 * - https://youtu.be/VIDEO_ID
 * - https://www.youtube.com/embed/VIDEO_ID
 * - https://www.youtube.com/shorts/VIDEO_ID
 */
function extractYouTubeId(url) {
  if (!url) return null;
  
  // Regex universal para URLs do YouTube
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|shorts\/|live\/|watch\?v=|&v=)([^#&?]*).*/;
  const match = url.match(regExp);

  return (match && match[2].length === 11) ? match[2] : null;
}

/**
 * Utilitário: Gera URL de thumbnail do YouTube
 */
function getYouTubeThumbnail(videoId) {
  if (!videoId) {
    return 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800&auto=format&fit=crop&q=80';
  }
  return `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
}

/**
 * Inicialização e carregamento dos dados do JSON
 */
async function initApp() {
  try {
    // Adiciona timestamp para evitar cache no GitHub Pages ao editar o JSON
    const response = await fetch(`./dados.json?t=${new Date().getTime()}`);
    if (!response.ok) {
      throw new Error(`Falha na resposta HTTP: ${response.status}`);
    }
    state.data = await response.json();
  } catch (error) {
    console.warn("Aviso: Carregando dados de fallback integrados. Detalhes:", error);
    state.data = FALLBACK_DATA;
  }

  // Configurações dinâmicas
  setupHeaderAndFooter();
  renderHeroStats();
  renderDestaqueSemana();
  renderVideoFilters();
  renderVideosGrid();
  renderMaterialFilters();
  renderMaterialsGrid();
  setupEventListeners();
  setupScrollEffects();
}

/**
 * Configurações de cabeçalho, ano dinâmico no rodapé e links institucionais
 */
function setupHeaderAndFooter() {
  // Atualiza ano atual no rodapé
  const currentYearEl = document.getElementById("current-year");
  if (currentYearEl) {
    currentYearEl.textContent = new Date().getFullYear().toString();
  }
}

/**
 * Renderiza métricas rápidas no Hero
 */
function renderHeroStats() {
  const statsContainer = document.getElementById("hero-stats-container");
  if (!statsContainer || !state.data) return;

  const totalVideos = (state.data.videos ? state.data.videos.length : 0) + (state.data.destaqueSemana ? 1 : 0);
  const totalMateriais = state.data.materiais ? state.data.materiais.length : 0;

  statsContainer.innerHTML = `
    <div class="stat-item">
      <div class="stat-number">${totalVideos} <span class="stat-accent">+</span></div>
      <div class="stat-label">Aulas em Vídeo</div>
    </div>
    <div class="stat-item">
      <div class="stat-number">${totalMateriais} <span class="stat-accent">PDFs</span></div>
      <div class="stat-label">Materiais Práticos</div>
    </div>
    <div class="stat-item">
      <div class="stat-number">100<span class="stat-accent">%</span></div>
      <div class="stat-label">Foco em Performance</div>
    </div>
  `;
}

/**
 * Renderiza a seção Destaque da Semana
 */
function renderDestaqueSemana() {
  const container = document.getElementById("destaque-container");
  if (!container || !state.data || !state.data.destaqueSemana) return;

  const d = state.data.destaqueSemana;
  const youtubeId = extractYouTubeId(d.youtubeUrl);
  const thumbnail = getYouTubeThumbnail(youtubeId);

  const topicsHtml = d.topicos && d.topicos.length > 0
    ? `<ul class="destaque-topics">
        ${d.topicos.map(topic => `
          <li class="destaque-topic-item">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
              <polyline points="20 6 9 17 4 12"></polyline>
            </svg>
            <span>${topic}</span>
          </li>
        `).join('')}
       </ul>`
    : '';

  container.innerHTML = `
    <div class="destaque-card" id="card-destaque">
      <div class="destaque-media" onclick="openVideoModal('${d.titulo.replace(/'/g, "\\'")}', '${d.youtubeUrl}', '${d.categoria}', '${(d.descricao || '').replace(/'/g, "\\'")}')" role="button" aria-label="Assistir treinamento em destaque">
        <img src="${thumbnail}" alt="${d.titulo}" class="destaque-thumbnail" onerror="this.src='https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800&auto=format&fit=crop&q=80'" />
        <div class="destaque-overlay">
          <div class="play-btn-large">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor">
              <polygon points="5 3 19 12 5 21 5 3"></polygon>
            </svg>
          </div>
        </div>
        <div class="destaque-media-badge">
          <span class="badge-duration">${d.duracao || 'Vídeo Aula'}</span>
        </div>
      </div>
      <div class="destaque-info">
        <div>
          <div class="destaque-meta">
            <span class="badge-tag">${d.badge || 'Destaque'}</span>
            <span class="badge-category">${d.categoria || 'Geral'}</span>
          </div>
          <h3 class="destaque-title">${d.titulo}</h3>
          <p class="destaque-desc">${d.descricao}</p>
          ${topicsHtml}
        </div>
        <div class="destaque-footer-actions">
          <button class="btn-primary" onclick="openVideoModal('${d.titulo.replace(/'/g, "\\'")}', '${d.youtubeUrl}', '${d.categoria}', '${(d.descricao || '').replace(/'/g, "\\'")}')">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
              <polygon points="5 3 19 12 5 21 5 3"></polygon>
            </svg>
            Assistir Masterclass
          </button>
        </div>
      </div>
    </div>
  `;
}

/**
 * Renderiza os botões de filtro de categorias para Vídeos
 */
function renderVideoFilters() {
  const container = document.getElementById("video-filters");
  if (!container || !state.data || !state.data.categorias) return;

  container.innerHTML = state.data.categorias.map(cat => `
    <button 
      class="pill-btn ${state.activeVideoCategory === cat ? 'active' : ''}" 
      onclick="filterVideosByCategory('${cat}')"
      type="button"
    >
      ${cat}
    </button>
  `).join('');
}

/**
 * Filtra vídeos por categoria
 */
function filterVideosByCategory(category) {
  state.activeVideoCategory = category;
  renderVideoFilters();
  renderVideosGrid();
}

/**
 * Renderiza o Grid de Vídeos de acordo com a categoria e busca ativa
 */
function renderVideosGrid() {
  const container = document.getElementById("videos-grid");
  if (!container || !state.data || !state.data.videos) return;

  const term = state.videoSearchTerm.toLowerCase().trim();
  
  const filteredVideos = state.data.videos.filter(video => {
    const matchesCategory = state.activeVideoCategory === "Todos" || video.categoria === state.activeVideoCategory;
    const matchesSearch = !term || 
      video.titulo.toLowerCase().includes(term) || 
      video.descricao.toLowerCase().includes(term) ||
      (video.categoria && video.categoria.toLowerCase().includes(term));
    return matchesCategory && matchesSearch;
  });

  if (filteredVideos.length === 0) {
    container.innerHTML = `
      <div class="empty-state">
        <svg class="empty-state-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
          <circle cx="11" cy="11" r="8"></circle>
          <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
        </svg>
        <h4 class="empty-state-title">Nenhum treinamento encontrado</h4>
        <p class="empty-state-desc">Tente buscar por outros termos ou selecione a categoria "Todos".</p>
      </div>
    `;
    return;
  }

  container.innerHTML = filteredVideos.map(video => {
    const youtubeId = extractYouTubeId(video.youtubeUrl);
    const thumbnail = getYouTubeThumbnail(youtubeId);

    return `
      <article class="video-card" onclick="openVideoModal('${video.titulo.replace(/'/g, "\\'")}', '${video.youtubeUrl}', '${video.categoria || 'Treinamento'}', '${(video.descricao || '').replace(/'/g, "\\'")}')">
        <div class="video-card-thumbnail">
          <img src="${thumbnail}" alt="${video.titulo}" class="video-card-img" onerror="this.src='https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800&auto=format&fit=crop&q=80'" />
          <div class="video-card-overlay">
            <div class="video-card-play">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <polygon points="5 3 19 12 5 21 5 3"></polygon>
              </svg>
            </div>
          </div>
          <span class="video-card-duration">${video.duracao || 'Vídeo'}</span>
        </div>
        <div class="video-card-content">
          <span class="video-card-category">${video.categoria || 'Geral'}</span>
          <h4 class="video-card-title">${video.titulo}</h4>
          <p class="video-card-desc">${video.descricao}</p>
          <div class="video-card-footer">
            <span>${video.nivel || 'Treinamento Oficial'}</span>
            <span class="video-card-action">
              Assistir 
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                <polyline points="9 18 15 12 9 6"></polyline>
              </svg>
            </span>
          </div>
        </div>
      </article>
    `;
  }).join('');
}

/**
 * Renderiza os filtros de materiais PDF
 */
function renderMaterialFilters() {
  const container = document.getElementById("material-filters");
  if (!container || !state.data || !state.data.categorias) return;

  container.innerHTML = state.data.categorias.map(cat => `
    <button 
      class="pill-btn ${state.activeMaterialCategory === cat ? 'active' : ''}" 
      onclick="filterMaterialsByCategory('${cat}')"
      type="button"
    >
      ${cat}
    </button>
  `).join('');
}

/**
 * Filtra materiais por categoria
 */
function filterMaterialsByCategory(category) {
  state.activeMaterialCategory = category;
  renderMaterialFilters();
  renderMaterialsGrid();
}

/**
 * Renderiza o Grid da Biblioteca de Materiais
 */
function renderMaterialsGrid() {
  const container = document.getElementById("materials-grid");
  if (!container || !state.data || !state.data.materiais) return;

  const term = state.materialSearchTerm.toLowerCase().trim();

  const filteredMaterials = state.data.materiais.filter(mat => {
    const matchesCategory = state.activeMaterialCategory === "Todos" || mat.categoria === state.activeMaterialCategory;
    const matchesSearch = !term ||
      mat.titulo.toLowerCase().includes(term) ||
      mat.descricao.toLowerCase().includes(term) ||
      (mat.categoria && mat.categoria.toLowerCase().includes(term));
    return matchesCategory && matchesSearch;
  });

  if (filteredMaterials.length === 0) {
    container.innerHTML = `
      <div class="empty-state">
        <svg class="empty-state-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
          <polyline points="14 2 14 8 20 8"></polyline>
          <line x1="16" y1="13" x2="8" y2="13"></line>
          <line x1="16" y1="17" x2="8" y2="17"></line>
          <polyline points="10 9 9 9 8 9"></polyline>
        </svg>
        <h4 class="empty-state-title">Nenhum material encontrado</h4>
        <p class="empty-state-desc">Tente outra busca ou selecione outra categoria.</p>
      </div>
    `;
    return;
  }

  container.innerHTML = filteredMaterials.map(mat => `
    <div class="material-card ${mat.destaque ? 'featured-material' : ''}">
      <div>
        <div class="material-card-top">
          <div class="material-icon-box" aria-hidden="true">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
              <polyline points="14 2 14 8 20 8"></polyline>
              <line x1="12" y1="18" x2="12" y2="12"></line>
              <line x1="9" y1="15" x2="15" y2="15"></line>
            </svg>
          </div>
          <div class="material-title-area">
            <span class="material-category">${mat.categoria || 'PDF'}</span>
            <h4 class="material-title">${mat.titulo}</h4>
          </div>
        </div>
        <p class="material-desc">${mat.descricao}</p>
      </div>
      <div>
        <div class="material-meta-row">
          <span class="material-meta-item">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path></svg>
            ${mat.formato || 'PDF'}
          </span>
          <span class="material-meta-item">${mat.paginas || 'Completo'}</span>
          <span class="material-meta-item">${mat.tamanho || 'Download'}</span>
        </div>
        <a href="${mat.pdfUrl}" target="_blank" rel="noopener noreferrer" class="btn-open-material" id="btn-mat-${mat.id}">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
            <polyline points="15 3 21 3 21 9"></polyline>
            <line x1="10" y1="14" x2="21" y2="3"></line>
          </svg>
          Abrir Material
        </a>
      </div>
    </div>
  `).join('');
}

/**
 * Modal Player de Vídeo do YouTube
 */
function openVideoModal(titulo, youtubeUrl, categoria, descricao) {
  const modalBackdrop = document.getElementById("video-modal");
  const modalTitle = document.getElementById("modal-video-title");
  const modalCat = document.getElementById("modal-video-category");
  const modalDesc = document.getElementById("modal-video-desc");
  const modalFrame = document.getElementById("modal-video-iframe");

  if (!modalBackdrop || !modalFrame) return;

  const youtubeId = extractYouTubeId(youtubeUrl);
  if (!youtubeId) {
    alert("URL do YouTube inválida.");
    return;
  }

  modalTitle.textContent = titulo || "Treinamento em Vídeo";
  modalCat.textContent = categoria || "FORJA DV";
  modalDesc.textContent = descricao || "";
  
  // Embed com parâmetros otimizados para reprodução limpa
  modalFrame.src = `https://www.youtube.com/embed/${youtubeId}?autoplay=1&rel=0&modestbranding=1&enablejsapi=1`;

  modalBackdrop.classList.add("open");
  document.body.style.overflow = "hidden"; // Trava scroll da página
}

function closeVideoModal() {
  const modalBackdrop = document.getElementById("video-modal");
  const modalFrame = document.getElementById("modal-video-iframe");

  if (!modalBackdrop || !modalFrame) return;

  modalFrame.src = ""; // Interrompe áudio/vídeo imediatamente
  modalBackdrop.classList.remove("open");
  document.body.style.overflow = ""; // Restaura scroll
}

/**
 * Registra ouvintes de eventos para busca e modal
 */
function setupEventListeners() {
  // Busca de vídeos
  const videoSearchInput = document.getElementById("video-search-input");
  if (videoSearchInput) {
    videoSearchInput.addEventListener("input", (e) => {
      state.videoSearchTerm = e.target.value;
      renderVideosGrid();
    });
  }

  // Busca de materiais
  const materialSearchInput = document.getElementById("material-search-input");
  if (materialSearchInput) {
    materialSearchInput.addEventListener("input", (e) => {
      state.materialSearchTerm = e.target.value;
      renderMaterialsGrid();
    });
  }

  // Fechamento do modal ao pressionar tecla ESC
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      closeVideoModal();
    }
  });

  // Fechamento ao clicar fora da caixa do modal
  const modalBackdrop = document.getElementById("video-modal");
  if (modalBackdrop) {
    modalBackdrop.addEventListener("click", (e) => {
      if (e.target === modalBackdrop) {
        closeVideoModal();
      }
    });
  }
}

/**
 * Efeitos de scroll suave e sombra do cabeçalho
 */
function setupScrollEffects() {
  const header = document.querySelector(".header");
  if (!header) return;

  window.addEventListener("scroll", () => {
    if (window.scrollY > 20) {
      header.classList.add("scrolled");
    } else {
      header.classList.remove("scrolled");
    }
  });
}

// Inicializa a aplicação ao carregar o DOM
document.addEventListener("DOMContentLoaded", initApp);
