const ytdl = require("ytdl-core");
const { joinVoiceChannel, createAudioPlayer, createAudioResource, StreamType } = require('@discordjs/voice');
const ytS = require("yt-search")

const { Client, GatewayIntentBits } = require('discord.js');
const client = new Client({ intents: [32767, GatewayIntentBits.Guilds, GatewayIntentBits.MessageContent, GatewayIntentBits.GuildVoiceStates] });

let player = createAudioPlayer()

client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
    client.user.setActivity('Youtube')
});

client.on("messageCreate", async message => {
    console.log(message.content);
    if (message.content.startsWith("-play")) {

        const args = message.content.split("-play");
        const url = args[1];
        const voiceChannel = message.member.voice.channel;
        if (!voiceChannel) {
            return message.reply("You need to be in a voice channel to play music.");
        }
        const channel = client.channels.cache.get(voiceChannel.id)
        const vdE = await ytS(url)
        const stream = ytdl(vdE.all[0].url, { filter: "audioonly",
        fmt: "mp3",
        highWaterMark: 1 << 62,
        liveBuffer: 1 << 62,
        dlChunkSize: 0,
        bitrate: 128,
        quality: "highestaudio" });
        
        const joinConnect = joinVoiceChannel({
            channelId: channel.id,
            guildId: channel.guild.id,
            adapterCreator: channel.guild.voiceAdapterCreator,
        })
        let resource = createAudioResource(stream, { inputType: StreamType.Arbitrary })
        player.play(resource)
        joinConnect.subscribe(player)

        player.on("error", function(err) {
            console.log('error', err)
        })

        return message.reply(`Reproduciendo: ${vdE.all[0].url}`);

    }

    if (message.content.startsWith("-stop")) {
        player.stop();
    }
});

client.login(`${process.env.TOKEN}`)