const figlet = require('figlet');
const chalk = require('chalk');

const banner = figlet.textSync('Tdrop', {
    font: 'Larry 3D',
    horizontalLayout: 'default',
    verticalLayout: 'default',
    width: 80,
    whitespaceBreak: true
});

const formattedBanner = `
${chalk.yellow(banner)}
${chalk.blue('Program Name  :')} ${chalk.green('Tbtc Faucet')}
${chalk.blue('Telegram      :')} ${chalk.green('https://t.me/tdropid')}
${chalk.blue('Github        :')} ${chalk.green('https://github.com/Tnodes/tbtc-faucet')}
`;

module.exports = { banner: formattedBanner };
