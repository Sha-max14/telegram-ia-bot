import TelegramBot from "node-telegram-bot-api";
import OpenAI from "openai";

const TELEGRAM_TOKEN = process.env.TELEGRAM_TOKEN;
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const OWNER_ID = process.env.OWNER_ID;

const bot = new TelegramBot(TELEGRAM_TOKEN, { polling: true });

const openai = new OpenAI({
  apiKey: OPENAI_API_KEY,
});

bot.on("message", async (msg) => {
  if (msg.from.id.toString() !== OWNER_ID) {
    return; // Solo tú puedes usarlo
  }

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: "Eres un asistente amable, inteligente y conversador." },
        { role: "user", content: msg.text }
      ],
    });

    const reply = completion.choices[0].message.content;
    bot.sendMessage(msg.chat.id, reply);
  } catch (error) {
    bot.sendMessage(msg.chat.id, "Error conectando con la IA.");
  }
});

console.log("Bot funcionando...");
