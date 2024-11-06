import { Collection } from 'discord.js';
import { readdirSync } from 'fs';
import { join as joinPath } from 'path';
import { pathToFileURL } from 'url';
import Logger from './logger.js';

export const getModals = async () => {
  const modals = new Collection();
  const foldersPath = joinPath(import.meta.dirname, '../modals');
  const modalFolders = readdirSync(foldersPath);

  for (const folder of modalFolders) {
    const modalsPath = joinPath(foldersPath, folder);
    const modalFiles = readdirSync(modalsPath).filter((file) =>
      file.endsWith('.js')
    );
    for (const file of modalFiles) {
      const filePath = joinPath(modalsPath, file);
      const modal = await import(pathToFileURL(filePath));
      if ('modal' in modal && 'handler' in modal) {
        modals.set(modal.modal.data.custom_id, modal);
      } else {
        Logger.warning(
          `[WARNING] The modal at ${filePath} is missing a required "modal" or "handler" property.`
        );
      }
    }
  }
  return modals;
};
