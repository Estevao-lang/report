# O que é Markdown

Markdown é uma linguagem de marcação leve criada em 2004 por John Gruber. O objetivo dela é simples: permitir que você escreva texto formatado usando caracteres comuns do teclado, sem precisar de um editor visual ou HTML.

Em vez de clicar em botões para deixar algo em negrito, você escreve `**assim**`. Em vez de criar um título clicando num menu, você escreve `# Assim`. O resultado é um texto que é fácil de ler mesmo sem ser renderizado — e que pode ser convertido para HTML, PDF, Word e outros formatos.

## Por que usar Markdown

- É simples de aprender em menos de 10 minutos
- Funciona em qualquer editor de texto simples
- É amplamente suportado: GitHub, Notion, Discord, WhatsApp (parcialmente), e este app
- Permite focar no conteúdo, não na formatação

## Sintaxe essencial do Markdown

### Títulos

```
# Título principal (H1)
## Subtítulo (H2)
### Título menor (H3)
```

### Ênfase de texto

```
**negrito**
*itálico*
`código inline`
```

### Listas

```
- Item de lista
- Outro item
  - Sub-item (com indentação)

1. Item numerado
2. Segundo item
3. Terceiro item
```

### Links e imagens

```
[Texto do link](https://exemplo.com)
![Legenda da imagem](image:nome-do-arquivo)
```

### Tabelas

```
| Coluna 1 | Coluna 2 | Coluna 3 |
|----------|----------|----------|
| Dado A   | Dado B   | Dado C   |
| Dado D   | Dado E   | Dado F   |
```

### Blocos de destaque

```
> [info] Informação importante
> [warning] Atenção a este ponto
> [danger] Erro crítico ou aviso grave
> [success] Operação concluída com sucesso
```

### Código

```
\`\`\`
function exemplo() {
  return "bloco de código";
}
\`\`\`
```

---

# Como usar o My Reports

O **My Reports** é uma aplicação web que transforma texto escrito em Markdown num relatório profissional em PDF, com capa, cabeçalho, rodapé e identidade visual da empresa selecionada.

## Passo a passo completo

### 1. Escolher o modelo de relatório

Na barra lateral esquerda, em **Report Cover**, selecione o campo **Report model**. As opções disponíveis são:

| Modelo | Empresa | Cor de destaque |
|--------|---------|-----------------|
| Snave UK Ltd | SnaveUK | Vermelho |
| MAIA / Maitrics | Maitrics | Azul índigo |
| Me Ve Um Site | Me Ve Um Site | Azul vivo |

Ao selecionar um modelo, o app aplica automaticamente o logo correto, a paleta de cores e o cabeçalho de página. Não é necessário inserir o logo manualmente no conteúdo.

### 2. Preencher a capa

Ainda na barra lateral, preencha os campos da capa:

- **Document type** — tipo do documento (ex: Technical Report, Proposta Comercial)
- **Title** — título do relatório (campo obrigatório)
- **Subtitle** — descrição curta, aparece abaixo do título
- **Project** — nome do projeto
- **Organization** — nome da empresa (preenchido automaticamente pelo modelo)
- **Author** — nome do autor
- **Date** — data do relatório (ex: Julho 2026)

### 3. Escrever o conteúdo em Markdown

Na área principal, campo **Report Content**, escreva ou cole o conteúdo do relatório usando a sintaxe Markdown. O app suporta todos os elementos descritos na seção anterior, além de alguns específicos:

#### Elementos exclusivos deste app

| Sintaxe | Resultado |
|---------|-----------|
| `===` | Quebra de página forçada |
| `---` | Divisor horizontal |
| `> [info] texto` | Caixa de informação azul |
| `> [warning] texto` | Caixa de aviso amarela |
| `> [danger] texto` | Caixa de erro vermelha |
| `> [success] texto` | Caixa de sucesso verde |
| `- [x] item` | Lista de tarefas com checkbox |
| `![Legenda](image:nome)` | Imagem inserida no PDF |
| `1. Título Principal` | Título numerado (quando em Title Case) |

#### Consultar a sintaxe dentro do app

Clique em **Show syntax** no canto superior direito da área de conteúdo para exibir uma tabela de referência rápida com todos os elementos suportados.

### 4. Adicionar imagens ao relatório

- Clique em **Upload images** na seção de imagens
- Selecione um ou mais arquivos de imagem (PNG, JPG, WebP)
- As imagens carregadas aparecem como miniaturas com um botão **Insert** e um botão de remoção (X)
- Clique em **Insert** para adicionar a imagem ao conteúdo na posição atual do cursor

A sintaxe inserida automaticamente é:

```
![nome-do-arquivo](image:id-da-imagem)
```

Você pode editar a legenda (o texto entre `[` e `]`) livremente.

> [warning] Não insira o logo da empresa manualmente. Ele é adicionado automaticamente pelo modelo selecionado. Se detectado no conteúdo, o app exibirá um aviso com um botão para removê-lo.

### 5. Visualizar antes de baixar

Após preencher a capa e o conteúdo, clique em **Preview Report**. O app exibirá uma pré-visualização fiel do PDF diretamente no navegador.

- Revise a formatação, os títulos, as tabelas e as imagens
- Se precisar corrigir algo, clique em **Edit report** para voltar ao editor
- Quando o resultado estiver correto, clique em **Download PDF**

### 6. Baixar o PDF

Na tela de preview, clique em **Download PDF**. O arquivo será gerado no servidor e baixado automaticamente com o nome baseado no título do relatório.

---

# Referência rápida de sintaxe

## Estrutura de um relatório típico

```
# Resumo Executivo

Texto introdutório do relatório.

## Contexto

Descreva o contexto do projeto aqui.

## Resultados

| Métrica | Valor |
|---------|-------|
| Acessos | 1.200 |
| Conversão | 3,4% |

> [success] A meta de acessos foi atingida com folga.

## Próximos passos

- [x] Levantamento de requisitos concluído
- [x] Protótipo aprovado
- [ ] Implementação em andamento
- [ ] Testes de qualidade

===

# Apêndice

Informações complementares aqui.

\`\`\`
exemplo de código ou dados técnicos
\`\`\`
```

---

# Dúvidas frequentes

**O logo da empresa aparece automaticamente?**
Sim. Ao selecionar o modelo no campo **Report model**, o logo é inserido na capa e no cabeçalho de todas as páginas de forma automática.

**Posso usar tabelas copiadas do Excel ou Notion?**
Sim. O app suporta tabelas no formato Markdown (`| col | col |`) e também tabelas separadas por tabulação (TSV), copiadas diretamente do Google Sheets ou Notion.

**O que acontece com emojis no texto?**
O app converte emojis para equivalentes seguros em PDF, evitando problemas de renderização.

**Posso forçar uma quebra de página?**
Sim. Use `===` numa linha separada para forçar o início de uma nova página no PDF.

**O título do relatório é obrigatório?**
Sim. O campo **Title** na capa é obrigatório. O botão de preview não avança sem ele.
