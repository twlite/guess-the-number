export const name = "ping";

export function execute(message) {
    const latency = Math.trunc(message.client.ws.ping);
    return message.reply(`Pong! \`${latency}ms\``);
}