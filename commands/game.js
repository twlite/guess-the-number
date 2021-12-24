import { GTNStore } from "../utils/store.js";

export const name = "game";

export function execute(message) {
    if (!message.member.permissions.has("MANAGE_GUILD")) return;
    if (!GTNStore.has(message.guildId)) return message.reply(`❌ | The event is currently not running!`);

    const { channel } = GTNStore.get(message.guildId);

    return message.reply(`✅ | The event is currently going on <#${channel}>!`);
}