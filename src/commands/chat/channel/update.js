const { Command, flags } = require('@oclif/command');
const chalk = require('chalk');

const { auth } = require('../../../utils/auth');
const { credentials } = require('../../../utils/config');

class ChannelUpdate extends Command {
    async run() {
        const { flags } = this.parse(ChannelUpdate);

        try {
            const { name, email } = await credentials(this);

            const client = await auth(this);
            const channel = await client.channel(flags.type, flags.channel);

            let payload = {
                name: flags.name,
                updated_by: {
                    id: email,
                    name,
                },
            };
            if (flags.image) payload.image = flags.image;

            if (flags.data) {
                const parsed = JSON.parse(flags.data);
                payload = Object.assign({}, payload, parsed);
            }

            const update = await channel.update(payload);

            if (flags.json) {
                this.log(JSON.stringify(update));
                this.exit(0);
            }

            this.log(`Channel ${chalk.bold(flags.channel)} has been modified.`);
        } catch (error) {
            this.error(error.message || 'A Stream CLI error has occurred.', {
                exit: 1,
            });
        }
    }
}

ChannelUpdate.flags = {
    channel: flags.string({
        char: 'c',
        description: 'The ID of the channel you wish to update.',
        required: false,
    }),
    type: flags.string({
        char: 't',
        description: 'Type of channel.',
        options: ['livestream', 'messaging', 'gaming', 'commerce', 'team'],
        required: false,
    }),
    name: flags.string({
        char: 'n',
        description: 'Name of the channel room.',
        required: false,
    }),
    image: flags.string({
        char: 'i',
        description: 'URL to the channel image.',
        required: false,
    }),
    reason: flags.string({
        char: 'r',
        description: 'Reason for changing channel.',
        required: false,
    }),
    data: flags.string({
        char: 'd',
        description: 'Additional data as JSON.',
        required: false,
    }),
    json: flags.boolean({
        char: 'j',
        description:
            'Output results in JSON. When not specified, returns output in a human friendly format.',
        required: false,
    }),
};

module.exports.ChannelUpdate = ChannelUpdate;
