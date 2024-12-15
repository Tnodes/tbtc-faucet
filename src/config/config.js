const FAUCET_CONFIG = {
    API_URL: 'https://api.testnet4.dev/dispensefunds',
    PAGE_URL: 'https://faucet.testnet4.dev',
    SITE_KEY: '170c988a-ea92-4586-9988-48eafc7e973a',
    TWO_CAPTCHA_API_KEY: process.env.TWO_CAPTCHA_API_KEY,
    DEFAULT_AMOUNT: 0.005,
    RETRY_DELAY: 5000, // 5 seconds between retries
    MAX_RETRIES: 3 // Maximum number of retries
};

module.exports = { FAUCET_CONFIG }; 