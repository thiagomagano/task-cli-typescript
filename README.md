# Task CLI - Gerenciador de Tarefas via Linha de Comando

Uma CLI (Command Line Interface) simples e eficiente para gerenciamento de tarefas, escrita em TypeScript e executada com Bun. Permite criar, listar, atualizar e excluir tarefas diretamente do terminal.

## ✨ Funcionalidades

- ✅ **Adicionar tarefas** - Crie novas tarefas com descrições
- 📋 **Listar tarefas** - Visualize todas as tarefas ou filtre por status
- ✏️ **Atualizar tarefas** - Modifique a descrição de tarefas existentes
- 🗑️ **Excluir tarefas** - Remova tarefas com confirmação
- 🔄 **Gerenciar status** - Mude o status das tarefas (todo → in-progress → done)
- 💾 **Armazenamento local** - Dados persistidos em arquivo JSON
- 🚀 **Execução rápida** - Utiliza Bun para performance otimizada

## 🚀 Instalação

### Pré-requisitos

- [Bun](https://bun.sh/) instalado (versão 1.0 ou superior)

### Passos de instalação

1. Clone o repositório:
```bash
git clone <url-do-repositorio>
cd task-cli
```

2. Instale as depedências:
```bash
bun install
```

3. Torne o script executável:
```bash
chmod +x tasks.ts
```
### Uso

Adicionar uma tarefa
```bash
./tasks.ts add "Descrição da tarefa"
```
Listar tarefas

```bash
# Listar todas as tarefas
./tasks.ts list

# Filtrar por status
./tasks.ts list todo
./tasks.ts list in-progress
./tasks.ts list done
```

Atualizar uma tarefa
```bash
./tasks.ts update <id> "Nova descrição"
# Exemplo:
./tasks.ts update 1 "Escrever README.md"
```
Excluir uma tarefa
```bash
./tasks.ts delete <id>
# Exemplo:
./tasks.ts delete 1
```

Alterar status da tarefa
```bash
# Marcar como em progresso
./tasks mark-in-progress <id>
# Marcar como concluída
./tasks.ts mark-done <id>
```

### Exemplos práticas
```bash
# Adicionar algumas tarefas
task add "Estudar TypeScript"
task add "Fazer compras no mercado"
task add "Revisar código do projeto"

# Listar todas as tarefas
task list

# Marcar primeira tarefa como em progresso
task mark-in-progress 1

# Atualizar descrição da segunda tarefa
task update 2 "Fazer compras no mercado e farmácia"

# Listar apenas tarefas em progresso
task list in-progress

# Marcar tarefa como concluída
task mark-done 1

# Excluir uma tarefa
task delete 3

```

### Melhorias planejadas

- [ ] Implementar testes unitários
- [ ] Melhorias de UX/UI
- [ ] Implementar busca por texto nas descrições
- [ ] Adicionar exportação para CSV/JSON

## 📝 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

## 🙏 Agradecimentos

- [Bun](https://bun.sh/) - Runtime JavaScript rápido e completo
- [TypeScript](https://www.typescriptlang.org/) - Superset tipado de JavaScript
- Comunidade open source por todas as inspirações

---

**Dica**: Para uso mais frequente, considere criar um alias permanente no seu shell:

```bash
# No ~/.bashrc ou ~/.zshrc
alias task="cd /caminho/para/task-cli && bun tasks.ts"
```

Feito com ❤️ por Thiago Magano.
