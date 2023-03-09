import axios from "axios";

class ChatGptClient {
  private key: string;

  constructor(apiKey: string) {
    this.key = apiKey.trim();
  }

  public async createChatCompletion(content: string): Promise<string> {
    const result = await axios
      .post(
        "https://api.openai.com/v1/chat/completions",
        {
          model: "gpt-3.5-turbo",
          messages: [{ role: "user", content }],
          user: this.key,
        },
        {
          headers: {
            Authorization: `Bearer ${this.key}`,
          },
        }
      )
      .then((res) => res.data);

    const response = result.choices[0].message.content.trim() || "出错啦！";

    return response;
  }

  public async checkAuth(): Promise<boolean> {
    try {
      await this.createChatCompletion("");
      return true;
    } catch (error) {
      return false;
    }
  }
}

export { ChatGptClient };
