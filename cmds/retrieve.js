const { SlashCommandBuilder } = require('discord.js');
const fs = require('fs')

module.exports = {
    data: new SlashCommandBuilder()
		.setName('retrieve')
		.setDescription('retrieve amount of names in database')
        .addIntegerOption(opt =>
            opt.setName('amount')
            .setDescription('number of names to get')
            .setRequired(true)
        )
        .setDefaultMemberPermissions('0'),
    async execute(interaction) {
        let amt = interaction.options.getInteger('amount')
        names = []
        function validate(namepulled) {
            let namepulled = snipes[Math.floor(Math.random() * snipes.length)]
            if (!names.find(element => element == namepulled)) {
                names.push(namepulled)
            } else {
                validate()
            }
        }
        let snipes = JSON.parse(fs.readFileSync('./currentsnipes.json', 'utf-8'))
        if (amt > snipes.length) return interaction.reply({ content: "i dont even have that many geez", ephemeral: true })
        for (i = 0; i < amt; i++) {
            validate()
        }

        setTimeout(async function() {
            let reply = `${interaction.member.user} heres ur names:\n\n`
            for (g = 0; g < names.length; g++) {
                reply += `${names[g]}, `
            }
            
            return interaction.reply({content: reply, ephemeral: true})
        }, 1000)
    }
}