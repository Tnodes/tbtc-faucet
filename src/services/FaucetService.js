const { FAUCET_CONFIG } = require('../config/config.js');
const { LogService } = require('./LogService.js');
const { Solver } = require('@2captcha/captcha-solver');
const { ProxyService } = require('./ProxyService.js');

class FaucetService {
    constructor(address) {
        this.address = address;
        this.solver = new Solver(FAUCET_CONFIG.TWO_CAPTCHA_API_KEY);
        this.headers = {
            'accept': '*/*',
            'accept-encoding': 'gzip, deflate, br, zstd',
            'accept-language': 'id-ID,id;q=0.9,en-US;q=0.8,en;q=0.7',
            'cache-control': 'max-age=0',
            'content-type': 'application/json',
            'dnt': '1',
            'sec-ch-ua': '"Google Chrome";v="131", "Chromium";v="131", "Not_A Brand";v="24"',
            'sec-ch-ua-mobile': '?0',
            'sec-ch-ua-platform': '"Windows"',
            'sec-fetch-dest': 'empty',
            'sec-fetch-mode': 'cors',
            'sec-fetch-site': 'same-site',
            'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36'
        };
    }

    handleCaptchaError(error) {
        const errorMessage = error.message.toLowerCase();
        
        if (errorMessage.includes('unable to be solved after')) {
            return 'Captcha solving failed after multiple attempts. Retrying...';
        }
        
        if (errorMessage.includes('balance')) {
            return '2captcha balance too low. Please recharge your account.';
        }
        
        if (errorMessage.includes('token') || errorMessage.includes('key')) {
            return 'Invalid 2captcha API key. Please check your configuration.';
        }
        
        if (errorMessage.includes('timeout')) {
            return 'Captcha solving timed out. Retrying...';
        }
        
        return error.message;
    }

    async solveCaptcha() {
        try {
            LogService.startSpinner('Solving captcha...');
            
            const result = await this.solver.hcaptcha({
                pageurl: FAUCET_CONFIG.PAGE_URL,
                sitekey: FAUCET_CONFIG.SITE_KEY
            });

            await LogService.success('Captcha solved successfully');
            return result.data;
        } catch (error) {
            const errorMessage = this.handleCaptchaError(error);
            await LogService.error('Failed to solve captcha', errorMessage);
            
            if (errorMessage.includes('balance') || errorMessage.includes('API key')) {
                process.exit(1);
            }
            
            throw new Error(errorMessage);
        }
    }

    handleNetworkError(error) {
        const errorMessage = error.message.toLowerCase();
        
        if (errorMessage.includes('socket disconnected') || 
            errorMessage.includes('network socket') ||
            errorMessage.includes('fetch failed')) {
            return 'Network connection error. Retrying with new proxy...';
        }
        
        if (errorMessage.includes('timeout')) {
            return 'Request timed out. Retrying with new proxy...';
        }
        
        if (errorMessage.includes('proxy')) {
            return 'Proxy connection failed. Switching to next proxy...';
        }
        
        return error.message;
    }

    async requestFaucet(amount = FAUCET_CONFIG.DEFAULT_AMOUNT) {
        try {
            const proxyService = await ProxyService.getInstance();
            const fetchWithProxy = await proxyService.getFetchWithProxy();
            const hCaptchaToken = await this.solveCaptcha();

            const request = {
                btcAddress: this.address,
                hCaptchaToken,
                amount
            };

            LogService.startSpinner(`Requesting faucet for ${this.address}`);

            const body = JSON.stringify(request);
            const headers = {
                ...this.headers,
                'content-length': Buffer.byteLength(body, 'utf-8').toString()
            };

            const response = await fetchWithProxy(FAUCET_CONFIG.API_URL, {
                method: 'POST',
                headers,
                body,
                timeout: 30000
            });

            if (!response.ok) {
                const errorData = await response.json();
                await LogService.error('Faucet request failed', errorData);
                throw new Error(`Faucet request failed: ${JSON.stringify(errorData)}`);
            }

            const data = await response.json();
            
            await LogService.success(`Faucet sent ${amount} BTC to ${this.address}`);
            await LogService.info(`https://mempool.space/testnet4/tx/${data.txid}`);

            if (proxyService.isEnabled()) {
                proxyService.rotateProxy();
            }

            return data;
        } catch (error) {
            const errorMessage = this.handleNetworkError(error);
            await LogService.error('Error in requestFaucet', errorMessage);
            
            const proxyService = await ProxyService.getInstance();
            if (proxyService.isEnabled()) {
                proxyService.rotateProxy();
            }
            
            throw error;
        }
    }
}

module.exports = { FaucetService }; 