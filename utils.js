import fetch from 'node-fetch';
import { verifyKey } from 'discord-interactions';

import Discord from "discord.js";
import { Client, GatewayIntentBits } from "discord.js";
import {
  joinVoiceChannel,
  createAudioPlayer,
  createAudioResource,
  VoiceConnectionStatus,
  generateDependencyReport,
} from "@discordjs/voice";

export function VerifyDiscordRequest(clientKey) {
  return function (req, res, buf, encoding) {
    const signature = req.get('X-Signature-Ed25519');
    const timestamp = req.get('X-Signature-Timestamp');

    const isValidRequest = verifyKey(buf, signature, timestamp, clientKey);
    if (!isValidRequest) {
      res.status(401).send('Bad request signature');
      throw new Error('Bad request signature');
    }
  };
}

export async function DiscordRequest(endpoint, options) {
  // append endpoint to root API URL
  const url = 'https://discord.com/api/v10/' + endpoint;
  // Stringify payloads
  if (options.body) options.body = JSON.stringify(options.body);
  // Use node-fetch to make requests
  const res = await fetch(url, {
    headers: {
      Authorization: `Bot ${process.env.DISCORD_TOKEN}`,
      'Content-Type': 'application/json; charset=UTF-8',
      'User-Agent': 'DiscordBot (https://github.com/discord/discord-example-app, 1.0.0)'
    },
    ...options
  });
  // throw API errors
  if (!res.ok) {
    const data = await res.json();
    console.log(res.status);
    throw new Error(JSON.stringify(data));
  }
  // return original response
  return res;
}

// Simple method that returns a random emoji from list
export function getRandomEmoji() {
  const emojiList = ['ð­','ð','ð','ð¤','ð','ð¤','ð¤','ð¶âð«ï¸','ð','ð¸','ð¿','ð','ð','â¨'];
  return emojiList[Math.floor(Math.random() * emojiList.length)];
}

export function getRandomNiTian() {
  const nitianList = ['555ä½ æ¯ä¾æç­è¾©ð­','äºäºæ¬¸æ¬¸ååå¾ä¸ªå¾ä¸ªð','ä½ çæ¯ä¸ªsbð','wowï¼çµæ£å£°ï¼ð¤',
                      'ææ¯ä½ ç¹ð','ååï¼ä¸¾åäºð¤','ä½ å¥½ï¼ç¬¬ä¸å¤©æ¥è¿ä¸ªé¢éï¼æè§åå®¶ä¸æ ·ð¤','ä¿¡èªæ¯å·¾ éæ°´åå¤§åé«ð§»',
                      'ææ¯ä½ ç·ç·ð¶âð«ï¸','ååç±³è¯ºð','èï¼æ±¤å£°ï¼ð¸','åé¦èåé¦èåé¦èð','ç¬¨æ¯ ç¯äºð',
                      'ä»å¤©å»è´­ç©äº è¶å¸é æ«è´§ð','ä»å¤©å¼è½¦ä¸é«éäº åé¢çè½¦ è½½é è¶äºâ¨', 'ï¼\nä½ åè¯´ä¸ç¿ï¼ð'];
  return nitianList[Math.floor(Math.random() * nitianList.length)];
}

export function getRandomDaily() {
  const dailyList = ['<:soupWatching:1012882586030317619>  æäº <:373high:948851215490486303> ç ð', 
                      '<:373high:948851215490486303> ð« äº <:soupWatching:1012882586030317619>  ç ðª',
                     '<:soupWatching:1012882586030317619> å¸æç¾¤éçå¤§å®¶ ææ´ ä»ç ð',
                     '<:LOL:998435504796225596> æ³è¦æ¥è¯¢æ¨ç æ·å£ðð',
                     '<:bushchick:957824298112933888> è¯´ï¼ææ©è°¢å¦ï¼<:gee:1002694442836308018>',
                     "<:soupWatching:1012882586030317619> è¯´ï¼èå­å¨20å²æ¶è½å¨30åéåcarryä½ owè¿è30æï¼ä½ä»ç°å¨30å²äºï¼åªè½åä¸ç¢é¥­ <:kindsenior:1002693471846547526> "];
  return dailyList[Math.floor(Math.random() * dailyList.length)];
}

export function playNitianAudio(msg, audioUrl, audioLen) {
  console.log(msg.channelId, msg.member.voice.channel.id, msg.guildId);
  const connection = joinVoiceChannel({
    selfDeaf: false,
    channelId: msg.member.voice.channel.id,
    guildId: msg.guildId,
    adapterCreator: msg.guild.voiceAdapterCreator,
  });

  const resource = createAudioResource(audioUrl, { inlineVolume: true });

  const player = createAudioPlayer();
  connection.on(VoiceConnectionStatus.Ready, () => {
    console.log(
      "The connection has entered the Ready state - ready to play audio!"
    );

    const subscription = connection.subscribe(player);

    player.play(resource);

    if (subscription) {
      // unsub after n sec
      setTimeout(() => subscription.unsubscribe(), audioLen);
    }
    setTimeout(() => connection.destroy(), audioLen);
  });
  
  return 0;
}

export const dict = {};

// export const 
export function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}
