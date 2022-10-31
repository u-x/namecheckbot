const { SlashCommandBuilder } = require('discord.js');
const fs = require('fs')

module.exports = {
    data: new SlashCommandBuilder()
		.setName('count')
		.setDescription('how many accs we got')
        .setDefaultMemberPermissions('0'),
    async execute(interaction) {
        let snipes = JSON.parse(fs.readFileSync('./currentsnipes.json', 'utf-8'))
        return interaction.reply({ content: `you have ${snipes.length} accounts`, ephemeral: true })
    }
}