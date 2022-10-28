const { SlashCommandBuilder } = require('discord.js');
const fs = require('fs')

module.exports = {
    data: new SlashCommandBuilder()
		.setName('store')
		.setDescription('store a name in database')
        .addStringOption(opt =>
            opt.setName('name')
            .setDescription('the name to store')
            .setRequired(true)
            .setMaxLength(20)
            .setMinLength(3)
        )
        .setDefaultMemberPermissions('0'),
    async execute(interaction) {
        let name = interaction.options.getString('name')
        let snipes = JSON.parse(fs.readFileSync('./currentsnipes.json', 'utf-8'))
        if (!snipes.find(element => element == name)) {
            snipes.push(name)
            fs.writeFileSync('./currentsnipes.json', JSON.stringify(snipes, null, 4))
            return interaction.reply({ content: `stored`, ephemeral: true })
        } else {
            return interaction.reply({ content: `i already have this name`, ephemeral: true })
        }
    }
}