import 'reflect-metadata';
import path from 'path';

import Commando from 'discord.js-commando';
import EnvSchema from './../configuration/EnvSchema';
import { createConnection } from 'typeorm';

export default class BerserkBot extends Commando.CommandoClient {
  public constructor() {
    super({
      commandPrefix: 'b/',
      owner: EnvSchema.OWNER,
    });

    this.registry
      .registerDefaultTypes()
      .registerGroups([['gif', 'Devuelve los gifs']])
      .registerDefaultGroups()
      .registerDefaultCommands()
      .registerCommandsIn({
        dirname: path.join(__dirname, '../commands'),
        filter: /^([^.].*)\.[jt]s$/,
      });

    this.on('ready', async () => {
      console.log(`Logged in successfully as ${this.user?.tag}.`);

      await createConnection();
    });

    this.on('disconnect', () => {
      console.error(`The bot has been disconnected.`);
      this.shutdown();
    });

    this.login(EnvSchema.TOKEN);
  }

  shutdown(): void {
    console.log('The bot was asked to shutdown.');
    this.destroy();
  }
}
