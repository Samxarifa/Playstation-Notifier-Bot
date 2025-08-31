import PlaystationAPI from "./playstation";

const API = new PlaystationAPI(process.env.NPSSO!, process.env.GROUP_ID!);

API.sendMessage("<Test Automated Message>");