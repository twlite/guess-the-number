import { GTNStore } from "../utils/store.js";

export const name = "start";

export function execute(message) {
    if (!message.member.permissions.has("MANAGE_GUILD")) return;
    if (GTNStore.has(message.guildId)) return message.reply(`❌ | Event is already running at <#${GTNStore.get(message.guildId).channel}>!`);

    const channel = message.mentions.channels.first();
    if (!channel || !channel.isText()) return message.reply("❌ | You need to mention a channel where I can send messages");

    const number = Math.floor(Math.random() * 3000) + 1;

    GTNStore.set(message.guildId, {
        channel: channel.id,
        number
    });

    channel.send(`The number is in between 1-3000. Good luck!`);

    return message.reply(`✅ | Game started at <#${channel.id}>! Guess the number between 1-3000.`);
}