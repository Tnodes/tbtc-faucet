const chalk = require('chalk');
const { Zolt } = require('zolt');

class LogService {
    static spinner = null;

    static clearScreen() {
        process.stdout.write('\x1Bc');
    }

    static getTimestamp() {
        return new Date().toLocaleTimeString();
    }

    static startSpinner(text) {
        if (this.spinner) {
            Zolt.stop();
        }
        const timestamp = chalk.gray(`[${this.getTimestamp()}]`);
        const level = chalk.blue('[INFO]');
        this.spinner = true;
        Zolt.start('dots', 'blue', `${text}`);
    }

    static stopSpinner() {
        if (this.spinner) {
            Zolt.stop();
            this.spinner = null;
        }
    }

    static async info(message, data = null) {
        this.stopSpinner();
        const timestamp = chalk.gray(`[${this.getTimestamp()}]`);
        const level = chalk.blue('[INFO]');
        const msg = chalk.white(message);
        
        if (data) {
            console.log(`${timestamp} ${level} ${msg}`, data);
        } else {
            console.log(`${timestamp} ${level} ${msg}`);
        }
    }

    static async success(message, data = null) {
        this.stopSpinner();
        const timestamp = chalk.gray(`[${this.getTimestamp()}]`);
        const level = chalk.green('[SUCCESS]');
        const msg = chalk.white(message);
        
        if (data) {
            console.log(`${timestamp} ${level} ${msg}`, data);
        } else {
            console.log(`${timestamp} ${level} ${msg}`);
        }
    }

    static async error(message, error) {
        this.stopSpinner();
        const timestamp = chalk.gray(`[${this.getTimestamp()}]`);
        const level = chalk.red('[ERROR]');
        const msg = chalk.white(message);
        
        if (error instanceof Error) {
            console.error(`${timestamp} ${level} ${msg}\n${chalk.red(error.stack)}`);
        } else {
            console.error(`${timestamp} ${level} ${msg}`, error);
        }
    }
}

module.exports = { LogService }; 