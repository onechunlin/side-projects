import chalk from "chalk";

export function successLog(msg: string): void {
  console.log(chalk.green(msg));
}

export function warningLog(msg: string): void {
  console.log(chalk.yellow(msg));
}

export function errorLog(msg: string): void {
  console.log(chalk.red(msg));
}
