const {Client, LegacySessionAuth} = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
const fs = require('fs');
// const { Client, LegacySessionAuth } = require('whatsapp-web.js');
// // import qrcode from 'qrcode-terminal';
// const qrcode = require('qrcode-terminal');

// Path where the session data will be stored
const SESSION_FILE_PATH = './session.json';

// Load the session data if it has been previously saved
let sessionData;
if(fs.existsSync(SESSION_FILE_PATH)) {
    sessionData = require(SESSION_FILE_PATH);
}

// Use the saved values
const client = new Client({
    authStrategy: new LegacySessionAuth({
        session: sessionData
    }),
    puppeteer: {
        args: [
            '--no-sandbox',
            '--disable-setuid-sandbox',
            '--disable-dev-shm-usage',
            '--disable-accelerated-2d-canvas',
            '--no-first-run',
            '--no-zygote',
            '--single-process', // <- this one doesn't works in Windows
            '--disable-gpu'
        ],
        headless: true
    }
});

// Save session values to the file upon successful auth
client.on('authenticated', (session) => {
    sessionData = session;
    fs.writeFile(SESSION_FILE_PATH, JSON.stringify(session), (err) => {
        if (err) {
            console.error(err);
        }
    });
});
client.on('qr', (qr) => {
    qrcode.generate(qr, {small: true});
});
client.on('ready', () => {
    console.log('Client is ready!');
});
client.initialize();