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

async function getNextId(): Promise<number> {
  const tasks: Task[] = await lerDB(DB_PATH);
  if (tasks.length === 0) return 1;

  const maxId = Math.max(...tasks.map((item) => item.id || 0));
  return maxId + 1;
}

async function lerDB(path: string) {
  const file = Bun.file(path);
  if (!(await file.exists())) {
    file.write(JSON.stringify([]));
  }

  try {
    return await file.json();
  } catch (error) {
    console.error("Falha ao ler o arquivo:", error);
    throw error;
  }
}

async function escreveDB(path: string, data: Task[]): Promise<boolean> {
  try {
    const file = Bun.file(path);
    await file.write(JSON.stringify(data));
    return true;
  } catch (error) {
    console.error("Erro ao escrever no arquivo", error);
    return false;
  }
}

async function add(description: string) {
  try {
    const tasks: Task[] = await lerDB(DB_PATH);

    //Criando a task
    const task: Task = {
      id: await getNextId(),
      description,
      status: "todo",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    //Colando a task na lista de tasks.
    tasks.push(task);

    await escreveDB(DB_PATH, tasks);

    console.log(
      `Tarefa adicionada com sucesso: ID (${task.id}) ->`,
      task.description,
    );
  } catch (error) {
    console.error("Não consegui carregar o banco:", error);
  }
}

async function list(): Promise<void> {
  const tasks: Task[] = await lerDB("db.json");
  console.table(tasks);
}

async function main() {
  if (argv.length >= 3) {
    //Tirando os argumentos do bun e do index.ts
    const argumentos = argv.slice(2);
    const command = argumentos[0];
    const argumento = argumentos[1];

    switch (command) {
      case "add":
        if (argumento) {
          await add(argumento);
        } else {
          console.error("Argumento inválido");
        }
        break;
      case "list":
        console.log("Listando as tarefa");
        await list();
        break;
      default:
        console.error(`Comando não encontrado tente --help para ajuda.`);
    }
  } else {
    console.error("Faltam argumentos, tente index.ts <command> <arg>");
  }
}

main();
