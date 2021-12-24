import "./utils/loadenv.js";

import { Client, Collection, Intents } from "discord.js";
import fs from "fs/promises";
import { GTNStore } from "./utils/store.js";

const client = new Client({
    intents: [Intents.FLAGS.GUILD_MEMBERS, Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES],
    ws: {
        properties: {
            $browser: "Discord Android"
        }
    },
    allowedMentions: {
        parse: []
    }
});
const prefix = "!";

const commands = new Collection();

async function loadCommands() {
    const commandFiles = await fs.readdir("./commands");
    await Promise.allSettled(commandFiles.map(async file => {
        const commandFile = await import(`./commands/${file}`).then(x => x.default ?? x);
        commands.set(commandFile.name, commandFile);
        console.log(`Loaded command ${commandFile.name}`);
    }));
}

client.once("ready", () => {
    console.log("I am ready!");
});

client.on("messageCreate", async message => {
    if (!message.guild || message.author.bot) return;
    if (message.content.indexOf(prefix) !== 0) return checkWinner(message);

    const args = message.content.slice(prefix.length).trim().split(/ +/);
    const command = args.shift().toLowerCase();
    if (!commands.has(command)) return;

    try {
        const commandFile = commands.get(command);
        await commandFile.execute(message, args);
    } catch(e) {
        message.reply(`❌ | Some error opps:\n\`\`\`js\n${e}\`\`\``);
    }
});

function checkWinner(message) {
    const data = GTNStore.get(message.guildId);
    if (!data) return;
    const { number, channel } = data;
    if (message.channelId !== channel) return;
    if (isNaN(message.content)) return;
    if (message.content == number) {
        GTNStore.delete(message.guildId);
        return message.reply({
            content: `🎉 <@${message.author.id}> guessed the number. The number was **${number}**`,
            allowedMentions: {
                repliedUser: true
            }
        });
    }
}

await loadCommands();
await client.login();