const { SlashCommandBuilder } = require('discord.js');
const https = require('https');
const chars = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z', '1', '2', '3', '4', '5', '6', '7', '8', '9', '0', '_']

module.exports = {
	data: new SlashCommandBuilder()
		.setName('generate')
		.setDescription('make a bunch of random names')
        .addIntegerOption(int =>
            int.setName('amount')
            .setDescription('amount of names to generate/check. you may only receive a portion back depending on availability')
            .setRequired(true)
            .setMaxValue(100)
            .setMinValue(1)
        )
        .addIntegerOption(int =>
            int.setName('extra-chars')
            .setDescription('amount of extra characters to add on')
            .setMaxValue(20)
            .setMinValue(1)
            .setRequired(true)
        )
        .addIntegerOption(int =>
            int.setName('char-type')
            .setDescription('type of characters to generate')
            .addChoices(
                { name: "letters", value: 0 },
                { name: "numbers", value: 1 },
                { name: "both", value: 2 },
            )
            .setMinValue(0)
            .setMaxValue(2)
            .setRequired(true)
        )
        .addStringOption(opt =>
            opt.setName('name')
            .setDescription('prefix of name')
            .setRequired(false)
            .setMaxLength(20)
            .setMinLength(3)
        ),
	async execute(interaction) {
		let prefix = interaction.options.getString('name')
        if (!prefix) prefix = ''
        let amt = interaction.options.getInteger('amount')
        let extras = interaction.options.getInteger('extra-chars')
        let type = interaction.options.getInteger('char-type')
        let avails = []
        if (prefix !== null) {
            if (prefix.length + extras > 20 || prefix.length + extras < 3) return interaction.reply("you cant have more than 20 or less than 3 characters in a name")
        }
        if (!prefix && type == 1) return interaction.reply('you cant have number only names')
        interaction.reply("generating.. please wait")
        async function checkdestats() {
            let name
            if (prefix !== null) {
                name = prefix
            }
            console.log(prefix)
            for (i = 0; i < extras; i++) {
                if (type == 0) {
                    name += chars[Math.floor(Math.random() * (26 - 0) + 0)]
                } else if (type == 1) {
                    name += Math.floor(Math.random() * (10 - 0) + 0).toString()
                } else if (type == 2) {
                    name += chars[Math.floor(Math.random() * (36 - 0) + 0)]
                }
            }
            console.log(name)
            const rapi = {
                hostname: 'auth.roblox.com',
                port: 443,
                path: `/v1/usernames/validate?request.username=${name}&request.birthday=1337-04-20`,
                method: 'GET'
            }
            return new Promise((resolve, reject) => {
                const req = https.request(rapi, res => {
                    res.setEncoding('utf8')
                    res.on('data', d => {
                      let named = JSON.parse(d)
                      console.log(named)
                      if (named.code == 0) {
                        if (!avails.find(element => element == name)) {
                            resolve(avails.push(name))
                        } else {
                            resolve('ok')
                        }
                      } else {
                        resolve('ok')
                      }
                    })
                })
                req.on('error', error => {
                    console.error(error)
                    resolve()
                    return interaction.reply({ message: `ruh roh error\n\`\`\`\n${error}\n\`\`\``, ephemeral: true })
                })
                
                return req.end()
            })
            
        }
        for (f = 0; f < amt; f++) {
            await checkdestats()
        }
        
        setTimeout(async function() {
            if (avails.length == 0) return interaction.channel.send(`no names were found within ${amt} tries that match ur criteria.`)
            console.log(avails)
            let reply = `${interaction.member.user} heres ur names:\n\n`
            for (g = 0; g < avails.length; g++) {
                reply += `${avails[g]}, `
            }
            
            return interaction.channel.send(reply)
        }, 2500)
	},
};