import TelegramBot from "node-telegram-bot-api";
import fetch from "node-fetch";

const TELEGRAM_TOKEN = process.env.TELEGRAM_TOKEN;
const OWNER_ID = process.env.OWNER_ID;
const HUGGINGFACE_API_KEY = process.env.HUGGINGFACE_API_KEY;

if (!TELEGRAM_TOKEN) {
  console.error("❌ Falta TELEGRAM_TOKEN");
  process.exit(1);
}

if (!HUGGINGFACE_API_KEY) {
  console.error("❌ Falta HUGGINGFACE_API_KEY");
  process.exit(1);
}

const bot = new TelegramBot(TELEGRAM_TOKEN, { polling: true });

async function getAIResponse(text) {
  try {
    const response = await fetch(
      "https://api-inference.huggingface.co/models/facebook/blenderbot-400M-distill",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${HUGGINGFACE_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ inputs: text }),
      }
    );

    const data = await response.json();

    if (Array.isArray(data) && data[0]?.generated_text) {
      return data[0].generated_text;
    }

    if (data?.error) {
      console.error("Error HuggingFace:", data.error);
      return "La IA está ocupada 😅 intenta en un momento.";
    }

    return "No entendí bien 😕 intenta otra vez.";
  } catch (error) {
    console.error("Error general:", error);
    return "Error al conectar con la IA 😓";
  }
}

bot.on("message", async (msg) => {
  if (msg.from.id.toString() !== OWNER_ID) return;

  const chatId = msg.chat.id;
  const userText = msg.text;

  if (!userText) return;

  try {
    await bot.sendMessage(chatId, "Pensando... 🤔");

    const reply = await getAIResponse(userText);
    await bot.sendMessage(chatId, reply);
  } catch (err) {
    console.error(err);
  }
});

console.log("🚀 Bot funcionando correctamente");
