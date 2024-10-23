const { REST, Routes } = require('discord.js');
const dotenv = require('dotenv');
const { getCommands } = require('./getCommands');
dotenv.config();

const deployCommands = async () => {
	const commands = getCommands().map((command) => command.data.toJSON());

	const rest = new REST().setToken(process.env.DISCORD_TOKEN);

	try {
		console.log(`Started refreshing ${commands.length} application (/) commands.`);

		const data = await rest.put(
			Routes.applicationGuildCommands(process.env.CLIENT_ID, process.env.GUILD_ID),
			{ body: commands },
		);

		console.log(`Successfully reloaded ${data.length} application (/) commands.`);
	} catch (error) {
		console.error(error);
	}
}

module.exports = { deployCommands }