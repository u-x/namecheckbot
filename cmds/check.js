const { SlashCommandBuilder } = require('discord.js');
const https = require('https')

module.exports = {
	data: new SlashCommandBuilder()
		.setName('check')
		.setDescription('check if a name is taken')
        .addStringOption(opt =>
            opt.setName('name')
            .setDescription('the name to check')
            .setRequired(true)
            .setMaxLength(20)
            .setMinLength(3)
        ),
	async execute(interaction) {
		let name = interaction.options.getString('name')
        const rapi = {
            hostname: 'auth.roblox.com',
            port: 443,
            path: `/v1/usernames/validate?request.username=${name}&request.birthday=1337-04-20`,
            method: 'GET'
        }
        const req = https.request(rapi, res => {
            res.setEncoding('utf8')
            res.on('data', d => {
              let named = JSON.parse(d)
              if (named.code == 0) {
                return interaction.reply(`${name} is available go take it kiddo`)
              } else {
                return interaction.reply(`you cant have ${name} sorry`)
              }
            })
        })
        req.on('error', error => {
            console.error(error)
            return interaction.reply({ message: `ruh roh error\n\`\`\`\n${error}\n\`\`\``, ephemeral: true })
        })
        
        req.end()
	},
};