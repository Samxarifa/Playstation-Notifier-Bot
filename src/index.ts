import { Client, Events, GatewayIntentBits } from "discord.js";
import PlaystationAPI from "./playstation";

const API = new PlaystationAPI(process.env.NPSSO!, process.env.GROUP_ID!);

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
    if (newState.member && newState.channel?.members.size === 1) {
        API.sendMessage(`<${newState.member?.displayName} has created a discord party in ${newState.guild?.name}>`);
    }
});