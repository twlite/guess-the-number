import { GTNStore } from "../utils/store.js";

export const name = "stop";

export function execute(message) {
    if (!message.member.permissions.has("MANAGE_GUILD")) return;
    if (!GTNStore.has(message.guildId)) return message.reply(`❌ | Event is already stopped!`);

    GTNStore.delete(message.guildId);

    return message.reply(`✅ | Game stopped.`);
}