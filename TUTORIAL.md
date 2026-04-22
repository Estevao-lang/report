# Como usar o Meus Relatórios

Gere PDFs profissionais colando texto com formatação simples.

---

## 1. Preencha a capa

No painel lateral esquerdo, preencha os campos:

| Campo            | Obrigatório | Exemplo                  |
|------------------|-------------|--------------------------|
| Tipo de documento| Não         | `Technical Report`       |
| Título           | **Sim**     | `AWS Maintenance Report` |
| Subtítulo        | Não         | `Q1 2026 Summary`        |
| Projeto          | Não         | `Infra Migration`        |
| Organização      | Não         | `SnaveUK`                |
| Autor            | Não         | `John Smith`             |
| Data             | Não         | `April 2026`             |

---

## 2. Escreva o conteúdo

Cole ou escreva no campo principal usando a sintaxe abaixo.

### Títulos

```
# Título principal (h1)
## Subtítulo (h2)
### Título menor (h3)
```

### Listas

```
- item simples
- outro item

1. primeiro item numerado
2. segundo item numerado

- [x] tarefa concluída
- [x] outra tarefa
```

### Tabelas

**Opção 1 — Cole direto do Notion ou Google Sheets:**

Selecione a tabela no Notion/Sheets, copie (`Ctrl+C`) e cole no campo.
As colunas são separadas por Tab automaticamente.

**Opção 2 — Formato pipe (markdown):**

```
| Coluna 1 | Coluna 2 | Coluna 3 |
|----------|----------|----------|
| valor    | valor    | valor    |
| valor    | valor    | valor    |
```

### Caixas de destaque

```
> [info] Texto informativo em azul
> [warning] Atenção — fundo amarelo
> [danger] Erro crítico — fundo vermelho
> [success] Operação concluída — fundo verde
```

### Bloco de código

````
```
function exemplo() {
  return 'resultado';
}
```
````

### Formatação inline

```
**negrito**
`código inline`
```

### Divisórias e quebra de página

```
---      ← linha divisória horizontal
===      ← quebra de página (nova página no PDF)
```

---

## 3. Gere o PDF

Clique em **Gerar Relatório (PDF)**.

O arquivo é baixado automaticamente com o nome baseado no título preenchido.

---

## Dicas

- **Tabelas do Notion/Sheets**: copie e cole diretamente — funciona automaticamente
- **Tabelas de PDF ou página web**: use o formato pipe `| col | col |`
- **Emojis** como ✅ ⏳ 🔴 são convertidos para equivalentes em texto (`[✓]`, `[!]`, etc.)
- Linhas em **CAIXA ALTA** são tratadas automaticamente como títulos
- Linhas terminando em `:` como `Actions Taken:` viram subtítulos no PDF
- O contador no rodapé do campo mostra caracteres e linhas em tempo real

---

## Exemplo completo

```
# AWS Maintenance Report

## Overview
This document summarizes the maintenance window performed on April 2026.

Actions Taken:
- [x] Database backup completed
- [x] Security patches applied
- [x] Load balancer reconfigured

## Affected Services

| Service      | Status  | Downtime |
|--------------|---------|----------|
| API Gateway  | OK      | 0 min    |
| Auth Service | OK      | 5 min    |
| Database     | OK      | 12 min   |

> [warning] The auth service restart caused a brief token invalidation window.

===

# Appendix

## Raw Logs

```
[2026-04-10 02:00] Maintenance window started
[2026-04-10 02:12] Database backup complete
[2026-04-10 04:30] Maintenance window closed
```
```
