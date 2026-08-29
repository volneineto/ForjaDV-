# FORJA DV — Direcional Vendas

Plataforma de capacitação prática minimalista para corretores da Direcional Vendas.

## Estrutura do Site (2 Dobras)
1. **Dobra 1 (Vídeos em Carrossel)**: Treinamentos em vídeo com carrossel deslizante suave (estilo Netflix/Apple) e player embutido em modal de alta resolução.
2. **Dobra 2 (PDFs)**: Biblioteca limpa com manuais de objeções, simuladores e roteiros para download/visualização direta.

## Como incluir novos vídeos

Você pode incluir novos vídeos de duas maneiras:

### Método 1: Direto no arquivo `dados.json` (Permanente no GitHub / Deploy)
Abra o arquivo `dados.json` e adicione o link do seu vídeo na lista `"videos"`:

```json
{
  "videos": [
    {
      "id": "vid-01",
      "titulo": "Resumo do best seller Prospecção Fanática",
      "descricao": "Estratégias essenciais de prospecção.",
      "youtubeUrl": "https://youtu.be/-GFRTaa2t3M?si=9eVnZP6T-R5JMQ8-",
      "categoria": "Alta Performance"
    },
    {
      "id": "vid-02",
      "titulo": "Simulador Pro Soluto Direcional",
      "descricao": "Aprenda a utilizar o simulador.",
      "youtubeUrl": "https://www.youtube.com/watch?v=Rr_jJeXCKsQ",
      "categoria": "Ferramentas DV"
    }
  ]
}
```

### Método 2: Pelo botão "+ Incluir Vídeo" no site
Clique no botão **"Incluir Vídeo"** no cabeçalho ou no último card do carrossel para colar o link e o título diretamente na tela.

---

## Como incluir novos PDFs

### Método 1: Direto no arquivo `dados.json` (Permanente no GitHub / Deploy)
Abra o arquivo `dados.json` e adicione o material na lista `"materiais"`:

```json
{
  "materiais": [
    {
      "id": "mat-04",
      "titulo": "Novo Manual de Fechamento",
      "descricao": "Guia prático de negociação e tabela.",
      "pdfUrl": "https://link-do-seu-pdf.com/arquivo.pdf",
      "categoria": "Técnicas de Vendas"
    }
  ]
}
```

### Método 2: Pelo botão "+ Incluir PDF" no site
Clique no botão **"Incluir PDF"** no cabeçalho, no topo da Dobra 2 ou no último card da biblioteca para colar o link do PDF (Google Drive, Notion, link direto ou CDN).
