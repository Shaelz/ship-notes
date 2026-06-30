import { exec } from 'node:child_process';
import { loadConfig } from './config.js';

export function open(): void {
  const config = loadConfig();

  if (!config.url || config.url === 'https://example.com') {
    console.error('Error: set url in ship-notes.toml before using ship-notes open');
    process.exit(1);
  }

  const cmd =
    process.platform === 'win32' ? `start "" "${config.url}"` :
    process.platform === 'darwin' ? `open "${config.url}"` :
    `xdg-open "${config.url}"`;

  exec(cmd, (err) => {
    if (err) {
      console.error(`Could not open browser: ${err.message}`);
      console.log(config.url);
    }
  });
}
