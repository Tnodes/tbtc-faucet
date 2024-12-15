const { HttpsProxyAgent } = require('https-proxy-agent');
const fs = require('fs/promises');
const path = require('path');
const { LogService } = require('./LogService.js');

class ProxyService {
    static instance = null;
    
    constructor() {
        this.proxies = [];
        this.currentProxyIndex = 0;
        this.fetch = null;
    }

    static async getInstance() {
        if (!this.instance) {
            this.instance = new ProxyService();
            await this.instance.init();
        }
        return this.instance;
    }

    async init() {
        const { default: fetch } = await import('node-fetch');
        this.fetch = fetch;
        await this.loadProxies('src/config/proxy.txt');
    }

    parseProxyUrl(proxyUrl) {
        try {
            const cleanUrl = proxyUrl.replace('http://', '');
            
            const [auth, address] = cleanUrl.split('@');
            
            if (!auth || !address) {
                throw new Error('Invalid proxy format');
            }

            const [username, password] = auth.split(':');
            
            const [host, port] = address.split(':');

            return {
                username,
                password,
                host,
                port: parseInt(port)
            };
        } catch (error) {
            throw new Error(`Failed to parse proxy URL: ${error.message}`);
        }
    }

    async loadProxies(filePath = 'src/config/proxy.txt') {
        try {
            const content = await fs.readFile(filePath, 'utf-8');
            this.proxies = content
                .split('\n')
                .map(line => line.trim())
                .filter(line => line && !line.startsWith('#'))
                .map(line => this.parseProxyUrl(line));

            await LogService.info(`Loaded ${this.proxies.length} proxies from ${filePath}`);
        } catch (error) {
            await LogService.error(`Failed to load proxies from ${filePath}`, error);
            this.proxies = [];
        }
    }

    isEnabled() {
        return this.proxies.length > 0;
    }

    getCurrentProxy() {
        return this.proxies[this.currentProxyIndex];
    }

    rotateProxy() {
        this.currentProxyIndex = (this.currentProxyIndex + 1) % this.proxies.length;
        const currentProxy = this.getCurrentProxy();
        LogService.info(`Rotated to proxy: ${currentProxy.host}:${currentProxy.port}`);
        return currentProxy;
    }

    async getFetchWithProxy() {
        if (!this.isEnabled()) {
            return this.fetch;
        }

        const proxy = this.getCurrentProxy();
        const proxyUrl = `http://${proxy.username}:${proxy.password}@${proxy.host}:${proxy.port}`;
        const agent = new HttpsProxyAgent(proxyUrl);

        return (url, options = {}) => {
            return this.fetch(url, { ...options, agent });
        };
    }
}

module.exports = { ProxyService }; 