# 🤖 TBTC Faucet Bot

A bot for automating testnet4 bitcoin faucet requests with proxy support and captcha solving.

## ✨ Features
- 🔑 Automatic captcha solving using 2captcha
- 🔄 Proxy support with auto-rotation
- 👛 Multiple wallet support

## ⚙️ Requirements
- Node.js 18+ (How to install Node.js: https://nodejs.org/en/download/)
- 2captcha API key (How to get 2captcha API key: https://2captcha.com)

## 🚀 Installation

1. Clone the repository:
```bash
git clone https://github.com/Tnodes/tbtc-faucet.git
cd tbtc-faucet
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file:
```env
TWO_CAPTCHA_API_KEY=your_2captcha_api_key_here
```

4. Configure wallets in `src/config/wallet.txt`:
```text
tb1your_wallet_address1
tb1your_wallet_address2
# Add one wallet address per line
```

5. (Optional) Add proxies in `src/config/proxy.txt`:
```text
# Format:
http://username:password@host:port
http://user1:pass1@host1:port1
http://user2:pass2@host2:port2
```

## 💻 Usage

Start the bot:
```bash
npm start
```

## ⚙️ Configuration (Optional)

Edit `src/config/config.js` to modify:
- ⏱️ Retry delay
- 🔄 Maximum retries

## 🔔 Telegram
Join to my telegram channel:
https://t.me/tdropid

## 💖 Support Our Work
🌟 If you have found this script helpful, we invite you to support its development by making a donation. Your generosity enables us to continue improving and expanding our work. Below are the wallet addresses where you can contribute:

```
EVM: 0xC76AE3B69478Eab1a093642548c0656e83c18623
SOL: 7xDtSzUS8Mrbfqa79ThyQHbcDsFK9h4143A1fqTsxJwt
BTC: bc1q7ulh39d644law0vfst4kl8shkd4k58qyjtlsyu
```

Thank you for your support! 🙏