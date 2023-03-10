#!/usr/bin/env node

import inquirer from "inquirer";
import fs from "fs";
import { ChatGptClient } from "./util";
import { errorLog, successLog, warningLog } from "./ui";

const keyFilePath = `${process.env.HOME}/open_api_keys`;

async function main() {
  console.log("欢迎使用 Chatmate！\n");

  let openApiKey = "";
  // 如果没有输入过 API key 则需要输入
  if (!fs.existsSync(keyFilePath)) {
    const { hasOpenApiKey } = await inquirer.prompt<{ hasOpenApiKey: boolean }>(
      [
        {
          type: "confirm",
          name: "hasOpenApiKey",
          message: "您是否已经获取了 ChatGPT 的 API key?",
        },
      ]
    );

    if (!hasOpenApiKey) {
      warningLog(
        "请先登录 https://platform.openai.com/account/api-keys 获取 API key"
      );
      return;
    }

    const { key } = await inquirer.prompt<{ key: string }>([
      {
        type: "password",
        name: "key",
        message: "请输入您的 ChatGPT 的 API key：",
        validate: async (value) => {
          if (!value) {
            return "请输入您的 ChatGPT 的 API key!";
          }
          const client = new ChatGptClient(value);
          const valid = await client.checkAuth();

          return valid ? true : "请检查网络或 API key 是否正确！";
        },
      },
    ]);
    successLog("登录成功！\n");
    openApiKey = key;
    // 文件写入
    fs.writeFile(keyFilePath, openApiKey, (err) => {
      if (err) {
        warningLog("API key 写入存储失败！");
      }
      // 更改文件权限为仅可读
      fs.chmod(keyFilePath, 0o444, (err) => {
        if (err) {
          warningLog("更改文件权限失败！");
        }
      });
    });
  } else {
    openApiKey = fs.readFileSync(keyFilePath).toString();
  }

  const client = new ChatGptClient(openApiKey);
  await startConversation(client);
}

async function startConversation(client: ChatGptClient) {
  try {
    const { question } = await inquirer.prompt<{ question: string }>([
      {
        type: "input",
        name: "question",
        message: "请输入您的问题：",
      },
    ]);

    await client.createChatCompletion(question);
    await startConversation(client);
  } catch (error) {
    errorLog(error instanceof Error ? error.message : "出错啦！");
    await startConversation(client);
  }
}

main();
