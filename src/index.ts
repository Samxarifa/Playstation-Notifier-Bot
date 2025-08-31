import { Client, Events, GatewayIntentBits } from "discord.js";
import PlaystationAPI from "./playstation";

const API = new PlaystationAPI(process.env.NPSSO!, process.env.GROUP_ID!);

let cooldown: number | undefined;

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildVoiceStates
    ]
});

client.login(process.env.BOT_TOKEN!);

client.once(Events.ClientReady, c => {
    console.log(`Logged in as ${c.user.tag}`);
});

client.on(Events.VoiceStateUpdate, (_, newState) => {
    if (newState.channel?.members.size === 1) {
        if (cooldown && Date.now() < cooldown) {
            console.log("Hit Cooldown");
            return;
        }
        const message = `${newState.member?.displayName} has created a discord party in ${newState.guild?.name}`;

        console.log(message);
        API.sendMessage(`<${message}>`);
        cooldown = Date.now() + Number(process.env.COOLDOWN) * 60_000;
    }
});