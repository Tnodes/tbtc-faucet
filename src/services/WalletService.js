const fs = require('fs/promises');
const path = require('path');
const { LogService } = require('./LogService.js');

class WalletService {
    constructor() {
        this.wallets = [];
        this.currentIndex = 0;
    }

    async loadWallets(filePath = 'src/config/wallet.txt') {
        try {
            const content = await fs.readFile(filePath, 'utf-8');
            this.wallets = content
                .split('\n')
                .map(line => line.trim())
                .filter(line => line && !line.startsWith('#'));

            await LogService.info(`Loaded ${this.wallets.length} wallets from ${filePath}`);
        } catch (error) {
            await LogService.error(`Failed to load wallets from ${filePath}`, error);
            throw error;
        }
    }

    getCurrentWallet() {
        return this.wallets[this.currentIndex];
    }

    rotateWallet() {
        this.currentIndex = (this.currentIndex + 1) % this.wallets.length;
        return this.getCurrentWallet();
    }

    getTotalWallets() {
        return this.wallets.length;
    }
}

module.exports = { WalletService }; 