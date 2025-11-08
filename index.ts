#!/home/thi/.bun/bin/bun
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
    return await file.json() as Task[];
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

    //Colando a task na lista de tasks.
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

async function list(tasks: Task[]): Promise<void> {
  console.table(tasks);
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
          return console.error("Descrição não informada");
        }
        if (description.length >= 3) {
          await add(tasks, description);
        } else {
          console.error("Descrição inválida, deve ter pelo menos 3 caracteres");
        }
        break;
      case "list":
        console.log("Listando as tarefa");
        list(tasks);
        break;
      default:
        console.error(`Comando não encontrado tente --help para ajuda.`);
    }
  } else {
    console.error("Faltam argumentos, tente index.ts <command> <arg>");
  }
}

main();
