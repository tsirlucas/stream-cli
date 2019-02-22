const { Command, flags } = require('@oclif/command');
const emoji = require('node-emoji');
const chalk = require('chalk');
const path = require('path');

const { auth } = require('../../../utils/auth');

export class ModerateMute extends Command {
    static flags = {
        user: flags.string({
            char: 'u',
            description: chalk.blue.bold('The ID of the offending user.'),
            required: true,
        }),
    };

    async run() {
        const { flags } = this.parse(ModerateMute);

        try {
            const client = await auth(
                path.join(this.config.configDir, 'config.json'),
                this
            );

            await client.muteUser(flags.user);

            this.log(
                `The message ${flags.user} has been flagged!`,
                emoji.get('two_flags')
            );
            this.exit(0);
        } catch (err) {
            this.error(err, { exit: 1 });
        }
    }
}

ModerateMute.description = 'Mute users within a channel.';
