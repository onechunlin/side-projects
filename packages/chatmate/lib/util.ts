import axios from "axios";

type Message = {
  role: "user" | "assistant" | "system";
  content: string;
};

class ChatGptClient {
  private key: string;
  private messages: Message[];

  constructor(apiKey: string) {
    this.key = apiKey.trim();
    this.messages = [];
  }

  public async createChatCompletion(content: string): Promise<string> {
    // 将用户发送信息放进消息队列
    this.messages.push({ role: "user", content });
    const result = await axios
      .post(
        "https://api.openai.com/v1/chat/completions",
        {
          model: "gpt-3.5-turbo",
          messages: this.messages,
        },
        {
          headers: {
            Authorization: `Bearer ${this.key}`,
          },
          timeout: 30000,
        }
      )
      .then((res) => res.data);

    const assistantMessage = result.choices[0].message;
    // 将助手返回信息放进消息队列
    this.messages.push(assistantMessage);
    const response = assistantMessage.content.trim();

    return response;
  }

  public async checkAuth(): Promise<boolean> {
    try {
      await this.createChatCompletion("hi");
      return true;
    } catch (error) {
      return false;
    }
  }
}

export { ChatGptClient };
