const { Collection } = require('discord.js');
const fs = require('node:fs');
const path = require('node:path');

const getCommands = () => {
	const commands = new Collection();
	const foldersPath = path.join(__dirname, '../commands');
	const commandFolders = fs.readdirSync(foldersPath);
	
	for (const folder of commandFolders) {
		const commandsPath = path.join(foldersPath, folder);
		const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));
		for (const file of commandFiles) {
			const filePath = path.join(commandsPath, file);
			const command = require(filePath);
			if (Array.isArray(command)) {
				command.forEach((singleCommand) => {
					validateCommand(singleCommand, commands)
				})
			} else {
				validateCommand(command, commands)
			}
		}
	}
	return commands;
}

const validateCommand = (command, commands) => {
	if ('data' in command && 'execute' in command) {
		commands.set(command.data.name, command);
	} else {
		console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
	}
}

module.exports = { getCommands };