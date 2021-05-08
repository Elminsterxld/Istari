const DisTube = require('distube')
const distube = new DisTube(client, { searchSongs: true, emitNewSongOnly: true })
client.on("message", async (message) => {
    if (message.author.bot) return;
    if (!message.content.startsWith(ayarlar.prefix)) return;
    const args = message.content.slice(ayarlar.prefix.length).trim().split(/ +/g);
    const command = args.shift();


    if (["p", "play","çal"].includes(command)) {
         let channel = message.member.voice.channel;
        if (!channel) return message.channel.send("<:zencarpi:835797685209661550> Bir Sesli Kanala Katılmalısın!", message.channel);
       const permissions = channel.permissionsFor(message.client.user);
        if (!permissions.has("CONNECT")) return message.channel.send("<:zencarpi:835797685209661550>  Senin Olduğun Kanala Giremiyorum Yetkim Yok!", message.channel);
        if (!permissions.has("SPEAK")) return message.channel.send("<:zencarpi:835797685209661550>  Bu Kanalda Konuşamıyorum!", message.channel);
   var searchString = args.join(" ");
        if (!searchString) return message.channel.send("<:zencarpi:835797685209661550> Bir Şarkı İsmi Girmelisin!")
      distube.play(message, searchString);

      }


    if (["repeat", "loop"].includes(command)) {
        distube.setRepeatMode(message, parseInt(args[0]));
message.channel.send('<:zentik:835797684626915399> Tekrar Açıldı')
      }
    if (["durdur", "stop"].includes(command)) {
        distube.stop(message);
        message.channel.send("<:zentik:835797684626915399> Müzik başarı ile durduruldu");
    }

    if (["geç", "skip"].includes(command)) {
        distube.skip(message);
      message.channel.send("<:zentik:835797684626915399> Müzik başarı ile geçildi!");
    }

 if (["ses", "volume"].includes(command)) {
     if(!args[0]) return message.reply("Ses Seviyesi Girmedin!")
   if(isNaN(args[0])) return message.reply(`Ses Sadece Sayı Olabilir.`);
    if(args[0] > 100) return message.reply("Ses Seviyesi 100 den büyük olamaz")
    if(args[0] < 0) return message.reply("Ses Seviyesi 0 dan Küçük Olamaz!")
        distube.setVolume(message, args[0]);
    message.channel.send(`<:zentik:835797684626915399> Ses Seviyesi \`${args[0]}\` Olarak Ayarlandı!`);
};
 if (command == "autoplay") {
        let mode = distube.toggleAutoplay(message);
        message.channel.send("Otomatik Oynatma : `" + (mode ? "On" : "Off") + "`");
    }

    if (["sıra", "queue"].includes(command)){
        let queue = distube.getQueue(message);
        message.channel.send('Şuan Sırada:\n' + queue.songs.map((song, id) =>
            `**${id + 1}**. ${song.name} - \`${song.formattedDuration}\``
        ).slice(0, 10).join("\n"));
    }
   
    if ([`bassboost`, `echo`, `karaoke`, `nightcore`, `vaporwave`].includes(command)) {
        let filter = distube.setFilter(message, command);
        message.channel.send("Şuanki Sıradakiler Fitrelemesi: " + (filter || "Kapalı"));
    }
});



const status = (queue) => `Ses: \`${queue.volume}%\` | Filre: \`${queue.filter || "Kapalı"}\` | Loop: \`${queue.repeatMode ? queue.repeatMode == 2 ? "Bütün sıradakı" : "Bu şarkı" : "Kapalı"}\` | Otomatik oynatma: \`${queue.autoplay ? "Açık" : "Kapalı"}\``;

distube
    .on("playSong", (message, queue, song) => { 
   const minsterrrr =new Discord.MessageEmbed()
         .setColor("#E70000")
   .setThumbnail(song.thumbnail)
.setDescription(`Oynatılıyor \`${song.name}\` - \`${song.formattedDuration}\`\nŞu kişi tarafından istendi: ${song.user}\n${status(queue)}`)
         message.channel.send(minsterrrr)
}) 
       
    
    .on("addSong", (message, queue, song) => { 
   const minsterrr =new Discord.MessageEmbed()
         .setColor("#E70000")
   .setThumbnail(song.thumbnail)
.setDescription(` Şarkı ${song.name} - \`${song.formattedDuration}\` şu kişi tarafından sıraya eklendi ${song.user}`)
         message.channel.send(minsterrr)
})
        
 
   
    .on("addList", (message, queue, playlist) => {
         const minsterr =new Discord.MessageEmbed()
         .setColor("#E70000")
         .setThumbnail(playlist.thumbnail)
.setDescription(`<:zentik:835797684626915399> Eklendi \`${playlist.name}\` oynatma listesine (${playlist.songs.length} songs) şu kişi tarafından \n${status(queue)}`)
         message.channel.send(minsterr)
         })

    .on("searchResult", (message, result) => {
        let i = 0;
         const minster =new Discord.MessageEmbed()
         .setColor("#E70000")
         .setDescription(`**1 ile 10 arasında bir sayı seçin lütfen**\n${result.map(song => `**${++i}**. ${song.name} - \`${song.formattedDuration}\``).join("\n")}\n*1-10 arasında bir sayı girmesseniz seçim 60 saniye içinde iptal edilir*`);
    message.channel.send(minster)
           })
    .on("searchCancel", (message) => message.channel.send(`Arama iptal edildi`))
.on("finish", message => message.channel.send("<:zencarpi:835797685209661550> Sırada Başka Şarkı Yok"))
.on("empty", message => message.channel.send("<:zencarpi:835797685209661550> Kanalda Kimse Yok Çıkıyorum"))
    .on("error", (message, e) => {
        console.error(e)
        message.channel.send("<:zencarpi:835797685209661550> Beklenmedik bir hatayla karşılaştım: " + e);
    });
