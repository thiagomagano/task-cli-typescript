#!/home/thi/.bun/bin/bun

import { argv } from "bun";

function main() {
  if (argv.length >= 3) {
    //Tirando os argumentos do bun e do index.ts
    const argumentos = argv.slice(2);
    const command = argumentos[0];
    const argumento = argumentos[1];

    switch (command) {
      case "add":
        if (argumento) {
          console.log("Tarefa adicionada com sucesso: ID (x)");
          break;
        } else {
          console.error("Argumento inválido");
          break;
        }
      default:
        console.error(`Comando não encontrado tente --help para ajuda.`);
    }
  } else {
    console.error("Faltam argumentos, tente index.ts <command> <arg>");
  }
}

main();
