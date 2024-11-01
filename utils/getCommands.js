import { Collection } from 'discord.js';
import { readdirSync } from 'fs';
import { join as joinPath } from 'path';
import { pathToFileURL } from 'url';

export const getCommands = async () => {
  const commands = new Collection();
  const foldersPath = joinPath(import.meta.dirname, '../commands');
  const commandFolders = readdirSync(foldersPath);

  for (const folder of commandFolders) {
    if (folder.startsWith('utils')) {
      continue;
    }
    const commandsPath = joinPath(foldersPath, folder);
    if (folder.endsWith('.js')) {
      await loadCommand(commandsPath, commands);
      continue;
    }
    const commandFiles = readdirSync(commandsPath).filter((file) =>
      file.endsWith('.js'),
    );
    for (const file of commandFiles) {
      const filePath = joinPath(commandsPath, file);
      await loadCommand(filePath, commands);
    }
  }
  return commands;
};

const loadCommand = async (filePath, commands) => {
  const command = await import(pathToFileURL(filePath));
  if (
    'data' in command &&
    'execute' in command &&
    command.data &&
    command.execute
  ) {
    commands.set(command.data.name, command);
  } else {
    console.log(
      `[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`,
    );
  }
};
