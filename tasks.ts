#!/usr/bin/env bun
import { argv } from "bun";

interface Task {
  id: number;
  description: string;
  status: "todo" | "in-progress" | "done";
  createdAt: string;
  updatedAt: string;
}
const DB_PATH = "./db.json";

function getNextId(tasks: Task[]): number {
  if (tasks.length === 0) return 1;

  const maxId = Math.max(...tasks.map((item) => item.id || 0));
  return maxId + 1;
}

async function read(path: string): Promise<Task[]> {
  const file = Bun.file(path);
  if (!(await file.exists())) {
    await file.write(JSON.stringify([]));
    return [];
  }

  try {
    return (await file.json()) as Task[];
  } catch (error) {
    console.error("Falha ao ler o arquivo:", error);
    throw error;
  }
}

async function write(path: string, data: Task[]): Promise<boolean> {
  try {
    const file = Bun.file(path);
    await file.write(JSON.stringify(data));
    return true;
  } catch (error) {
    console.error("Erro ao escrever no arquivo", error);
    return false;
  }
}

async function add(tasks: Task[], description: string) {
  try {
    //Criando a task
    const task: Task = {
      id: getNextId(tasks),
      description,
      status: "todo",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    //Colocando a task na lista de tasks.
    tasks.push(task);

    const success = await write(DB_PATH, tasks);

    if (!success) {
      console.error("Não consegui escrever no banco:");
      return;
    }

    console.log(
      `Tarefa adicionada com sucesso: ID (${task.id}) ->`,
      task.description,
    );
  } catch (error) {
    console.error("Não consegui carregar o banco:", error);
  }
}

async function list(tasks: Task[], filter?: string | undefined): Promise<void> {
  filter
    ? console.table(tasks.filter((t) => t.status === filter))
    : console.table(tasks);
}

async function update(
  tasks: Task[],
  id: number,
  description: string,
): Promise<void> {
  console.log("Atulizando tarefa de id: ", id);
  console.log("Descrição: ", description);

  const task = tasks.find((t) => t.id === id);
  if (!task) {
    console.error(`Tarefa com ID ${id} não encontrada.`);
  } else {
    task.description = description;
    task.updatedAt = new Date().toISOString();
    await write(DB_PATH, tasks);
    const newTasks = await read(DB_PATH);
    console.log("Tarefa editada com sucesso!");
  }
}

async function deleteTask(tasks: Task[], id: number): Promise<void> {
  const deletedTask = tasks.find((t) => t.id === id);

  if (!deletedTask) {
    console.error("Id não encontrado, nada foi excluido");
  } else {
    console.log(
      `Você tem certeza que deseja excluir a tarefa "${deletedTask.description}"? (y/n)`,
    );

    for await (const line of console) {
      if (line.trim().toLowerCase() !== "y") {
        console.log("Operação cancelada.");
        return;
      }
      break;
    }

    const newTasks = tasks.filter((t) => t.id !== deletedTask.id);
    await write(DB_PATH, newTasks);
    console.log("Tarefa: ", deletedTask.id, "deletada com sucesso");
  }
}

async function changeStatus(
  tasks: Task[],
  id: number,
  status: "in-progress" | "done",
): Promise<void> {
  const task = tasks.find((t) => t.id === id);
  if (!task) {
    console.error(`Tarefa com ID ${id} não encontrada.`);
    return;
  } else {
    task.status = status;
    task.updatedAt = new Date().toISOString();
    await write(DB_PATH, tasks);

    if (status === "in-progress") {
      console.log(`Tarefa ${task.description} agora está em progresso!`);
    }

    if (status === "done") {
      console.log(`Tarefa ${task.description} agora está concluída!`);
    }

    list(tasks);
  }
}

async function main() {
  if (argv.length >= 3) {
    //Tirando os argumentos do bun e do index.ts
    const argumentos = argv.slice(2);
    const command = argumentos[0];
    const argument = argumentos[1];

    const tasks: Task[] = await read(DB_PATH);

    switch (command) {
      case "add":
        const description = argument as string;
        if (!description) {
          return console.error(
            "Descrição não informada, tente: task-cli add <description>",
          );
        }
        if (description.length >= 3) {
          await add(tasks, description);
        } else {
          console.error("Descrição inválida, deve ter pelo menos 3 caracteres");
        }
        break;
      case "list":
        console.log("Listando as tarefas");

        if (argumentos.length >= 2) {
          const filter = argumentos[1];
          if (
            filter === "todo" ||
            filter === "in-progress" ||
            filter === "done"
          ) {
            list(tasks, argumentos[1]);
          } else {
            console.log(
              "Status não conhecido tente: task list <todo|in-progress|done>",
            );
          }
          break;
        }

        list(tasks);
        break;
      case "update":
        if (argumentos.length >= 3) {
          console.log("Atualizando tarefas...");
          const taskId = Number(argumentos[1]);
          const newDescription = argumentos[2] as string;
          await update(tasks, taskId, newDescription);
        } else {
          console.error(
            "Faltam argumentos para esse comando tente: task update <id> <description>",
          );
        }
        break;
      case "delete":
        if (argumentos.length >= 2) {
          console.log("Deletando tarefa...");
          const taskId = Number(argumentos[1]);
          await deleteTask(tasks, taskId);
        } else {
          console.error(
            "Faltam argumentos para esse comando tente: task delete <id> ",
          );
        }
        break;
      case "mark-in-progress":
        if (argumentos.length >= 2) {
          console.log("Atulizando status para in-progress...");
          const taskId = Number(argumentos[1]);
          await changeStatus(tasks, taskId, "in-progress");
        } else {
          console.error(
            "Faltam argumentos para esse comando tente: task mark-in-progress <id> ",
          );
        }
        break;
      case "mark-done":
        if (argumentos.length >= 2) {
          console.log("Atulizando status para concluído...");
          const taskId = Number(argumentos[1]);
          await changeStatus(tasks, taskId, "done");
        } else {
          console.error(
            "Faltam argumentos para esse comando tente: task mark-done <id> ",
          );
        }
        break;
      default:
        console.error(`Comando não encontrado tente --help para ajuda.`);
    }
  } else {
    console.error("Faltam argumentos, tente: task-cli <command> <args>");
  }
}

main();
