import TelegramBot from "node-telegram-bot-api";
import fetch from "node-fetch";

const TELEGRAM_TOKEN = process.env.TELEGRAM_TOKEN;
const OWNER_ID = process.env.OWNER_ID;

const bot = new TelegramBot(TELEGRAM_TOKEN, { polling: true });

async function getHuggingFaceResponse(text) {
  const response = await fetch(
    "https://api-inference.huggingface.co/models/facebook/blenderbot-400M-distill",
    {
      method: "POST",
      headers: {
        Authorization: "Bearer hf_xxxxxxxxxxxxxxxx", // va tu HuggingFace API key
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ inputs: text }),
    }
  );

  const data = await response.json();

  return data?.generated_text || "No entendí 😕 intenta otra vez.";
}

bot.on("message", async (msg) => {
  if (msg.from.id.toString() !== OWNER_ID) return;

  const reply = await getHuggingFaceResponse(msg.text);
  bot.sendMessage(msg.chat.id, reply);
});

console.log("Bot funcionando...");
