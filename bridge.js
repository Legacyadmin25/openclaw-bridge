const fs = require('fs');
const path = require('path');

// Set base directory to /data (this satisfies the platform requirement)
const BASE_DIR = '/data';
const INBOX = path.join(BASE_DIR, 'mailbox', 'inbox');
const PROCESSED = path.join(BASE_DIR, 'mailbox', 'processed');

// Force-create the necessary folder structure on startup
[INBOX, PROCESSED].forEach(dir => {
    if (!fs.existsSync(dir)) {
        console.log(`Creating directory: ${dir}`);
        fs.mkdirSync(dir, { recursive: true });
    }
});

console.log('--- Mailbox Listener Active (Polling Mode) ---');
console.log('Watching:', INBOX);

setInterval(() => {
    fs.readdir(INBOX, (err, files) => {
        if (err) {
            console.error('Error reading inbox:', err);
            return;
        }
        
        files.forEach(file => {
            if (file.endsWith('.json')) {
                const filePath = path.join(INBOX, file);
                console.log('New task detected:', file);
                
                try {
                    const task = JSON.parse(fs.readFileSync(filePath, 'utf8'));
                    console.log('Task content:', task);
                    
                    // Move the file to processed
                    fs.renameSync(filePath, path.join(PROCESSED, file));
                    console.log('Task moved to processed.');
                } catch (err) {
                    console.error('Error processing:', err);
                }
            }
        });
    });
}, 2000);
