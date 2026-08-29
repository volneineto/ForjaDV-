# FORJA DV — Forjando Corretores de Alta Performance

Plataforma de treinamento corporativo elegante, minimalista, ultrarrápida e 100% gratuita desenvolvida para a **Direcional Vendas**, pronta para ser hospedada diretamente no **GitHub Pages**.

---

## 🏛️ Identidade Visual & Conceito
- **Marca:** FORJA DV
- **Subtítulo:** Forjando Corretores de Alta Performance
- **Empresa:** Direcional Vendas
- **Paleta de Cores Institucional:**
  - Azul Institucional: `#174A9C`
  - Vermelho Institucional: `#D6222A`
  - Branco: `#FFFFFF`
  - Cinza Claro de Fundo: `#F5F7FA`
- **Inspiração de Design:** Apple, Notion, Stripe (minimalismo, espaçamento e tipografia) e Netflix (cards de vídeo imersivos).

---

## 📁 Estrutura de Pastas do Projeto

```text
forja-dv/
├── index.html       # Estrutura semântica da página única (Single Page)
├── style.css        # Estilos modernos, responsivos e tema Direcional
├── script.js        # Lógica em JavaScript puro (renderização, modal e filtros)
├── dados.json       # Banco de dados simples em JSON (vídeos, PDFs e destaque)
└── README.md        # Documentação completa de uso e publicação
```

---

## 🚀 Como Publicar no GitHub Pages (Passo a Passo)

### 1. Criar o Repositório no GitHub
1. Acesse sua conta no [GitHub](https://github.com).
2. Clique no botão **"New"** (ou **"+"** no topo direito > **"New repository"**).
3. No campo **Repository name**, digite: `forja-dv` (ou o nome que preferir).
4. Deixe marcado como **Public** (Público).
5. Clique em **"Create repository"**.

### 2. Enviar os Arquivos para o Repositório
Você pode enviar de duas maneiras:

#### Opção A: Pelo Navegador (Sem instalar nada)
1. Na página do seu repositório recém-criado, clique em **"uploading an existing file"**.
2. Arraste todos os arquivos do projeto (`index.html`, `style.css`, `script.js`, `dados.json`, `README.md`).
3. No campo inferior, escreva `Versão inicial do FORJA DV` e clique em **"Commit changes"**.

#### Opção B: Pelo Terminal / Git
```bash
git init
git add .
git commit -m "feat: lancamento forja dv"
git branch -M main
git remote add origin https://github.com/SEU-USUARIO/forja-dv.git
git push -u origin main
```

### 3. Ativar o GitHub Pages
1. No seu repositório no GitHub, clique na aba **"Settings"** (Configurações).
2. No menu lateral esquerdo, clique em **"Pages"**.
3. Na seção **"Build and deployment"** > **"Source"**, selecione:
   - **Branch:** `main` (ou `master`)
   - **Folder:** `/ (root)`
4. Clique em **"Save"**.
5. Aguarde cerca de 1 a 2 minutos. O GitHub exibirá o link oficial da sua plataforma:
   `https://SEU-USUARIO.github.io/forja-dv/`

---

## 📝 Como Gerenciar e Atualizar Conteúdos no `dados.json`

O site foi construído para ler dinamicamente o arquivo `dados.json`. Sempre que você alterar este arquivo no GitHub, o site atualizará automaticamente sem necessidade de mexer no código HTML!

### 1. Como Trocar ou Adicionar Vídeos do YouTube
No arquivo `dados.json`, localize o array `"videos"` e adicione ou edite os blocos:

```json
{
  "id": "vid-07",
  "titulo": "Novo Treinamento de Negociação",
  "descricao": "Como superar objeções de entrada parcelada.",
  "youtubeUrl": "https://www.youtube.com/watch?v=SEU_CODIGO_DO_VIDEO",
  "duracao": "15 min",
  "categoria": "Técnicas de Vendas",
  "nivel": "Prático",
  "data": "Atualizado"
}
```

> 💡 **Dica para Vídeos Não Listados:**  
> A plataforma é 100% compatível com vídeos **Não Listados** (*Unlisted*) do YouTube. Basta colar o link completo (`https://youtu.be/...` ou `https://www.youtube.com/watch?v=...`). A miniatura e o player funcionarão perfeitamente e o vídeo continuará protegido e restrito ao time.

---

### 2. Como Trocar ou Adicionar Materiais em PDF
No arquivo `dados.json`, localize o array `"materiais"`:

```json
{
  "id": "mat-07",
  "titulo": "Tabela de Vendas e Fluxo Atualizada",
  "descricao": "Resumo de coeficientes e condições especiais de lançamento.",
  "pdfUrl": "https://seusite.com/arquivos/tabela-vendas.pdf",
  "categoria": "Lançamentos Direcional",
  "formato": "PDF",
  "paginas": "15 páginas",
  "tamanho": "2.1 MB",
  "destaque": false
}
```

> 💡 **Onde hospedar os PDFs gratuitamente:**  
> Você pode subir os arquivos PDF na pasta do próprio repositório GitHub (ex: criar uma pasta `/materiais/meu-arquivo.pdf` e colocar o link `./materiais/meu-arquivo.pdf`) ou usar o Google Drive (com permissão de leitura pública).

---

### 3. Como Alterar o Treinamento "Destaque da Semana"
No topo de `dados.json`, edite o bloco `"destaqueSemana"`:

```json
"destaqueSemana": {
  "id": "destaque-01",
  "badge": "Destaque da Semana",
  "categoria": "Técnicas de Fechamento",
  "titulo": "Masterclass: Fechamento de Vendas Direcional",
  "subtitulo": "Roteiros de alta conversão.",
  "descricao": "Treinamento essencial para alavancar suas propostas.",
  "youtubeUrl": "https://www.youtube.com/watch?v=SEU_CODIGO",
  "duracao": "25 min",
  "topicos": [
    "Ponto 1 importante",
    "Ponto 2 importante",
    "Ponto 3 importante"
  ]
}
```

---

## 🎨 Como Personalizar Cores e Logotipo

### 1. Trocar as Cores Institucionais
Abra o arquivo `style.css` e altere as variáveis no topo:

```css
:root {
  --color-blue: #174A9C;       /* Azul Direcional */
  --color-blue-dark: #0f346e;  /* Azul Escuro / Hover */
  --color-red: #D6222A;        /* Vermelho Direcional */
  --color-bg: #F5F7FA;         /* Fundo da Página */
}
```

### 2. Trocar ou Inserir Logo em Imagem
No arquivo `index.html`, localize o bloco `.logo-direcional` no cabeçalho e substitua pelo seu arquivo de imagem (ex: `logo.png` ou `logo.svg`):

```html
<div class="logo-direcional">
  <img src="logo-direcional.svg" alt="Direcional Vendas" style="height: 38px;" />
</div>
```

---

## ⚡ Recursos Técnicos e Otimizações
- **Zero Dependências:** Construído em HTML5, CSS3 moderno e Vanilla JS.
- **Player Modal Integrado:** Não redireciona o corretor para fora do site, mantendo o foco nos estudos.
- **Filtros e Busca Instantânea:** Localize qualquer aula ou PDF em milissegundos por palavra-chave ou categoria.
- **Acessibilidade:** Navegação por teclado, suporte à tecla ESC para fechar vídeos e contraste auditado.
- **Responsividade Total:** Interface adaptável para celulares, tablets e desktops.

---

## 📄 Licença e Créditos
Desenvolvido com foco em alta performance comercial para **Direcional Vendas**.
Livre para uso, expansão e treinamento da equipe de vendas.
