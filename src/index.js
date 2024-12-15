require('dotenv').config();
const { FaucetService } = require('./services/FaucetService.js');
const { WalletService } = require('./services/WalletService.js');
const { LogService } = require('./services/LogService.js');
const { FAUCET_CONFIG } = require('./config/config.js');
const { banner } = require('./services/banner.js'); 

async function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function main() {
    try {
        LogService.clearScreen();
        console.log(banner);
        
        const walletService = new WalletService();
        await walletService.loadWallets('src/config/wallet.txt');

        if (walletService.getTotalWallets() === 0) {
            throw new Error('No wallets found in wallet.txt');
        }

        while (true) {
            try {
                const currentAddress = walletService.getCurrentWallet();
                await LogService.info(`Processing wallet: ${currentAddress}`);

                const faucetService = new FaucetService(currentAddress);

                await faucetService.requestFaucet();
                
                walletService.rotateWallet();
                
                await LogService.info(`Waiting ${FAUCET_CONFIG.RETRY_DELAY/1000} seconds before next request...`);
                await sleep(FAUCET_CONFIG.RETRY_DELAY);
            } catch (error) {
                await LogService.error('Error in main loop', error);
                await sleep(FAUCET_CONFIG.RETRY_DELAY);
            }
        }
    } catch (error) {
        await LogService.error('Fatal error in main', error);
        process.exit(1);
    }
}

main(); 