const fs = require('fs');
const path = require('path');

const INBOX = path.join(__dirname, 'data', 'mailbox', 'inbox');
const PROCESSED = path.join(__dirname, 'data', 'mailbox', 'processed');

console.log('--- Mailbox Listener Active (Polling Mode) ---');
console.log('Watching:', INBOX);

setInterval(() => {
    fs.readdir(INBOX, (err, files) => {
        if (err) return;
        files.forEach(file => {
            if (file.endsWith('.json')) {
                const filePath = path.join(INBOX, file);
                console.log('New task detected:', file);
                try {
                    const task = JSON.parse(fs.readFileSync(filePath, 'utf8'));
                    console.log('Task content:', task);
                    fs.renameSync(filePath, path.join(PROCESSED, file));
                    console.log('Task moved to processed.');
                } catch (err) {
                    console.error('Error processing:', err);
                }
            }
        });
    });
}, 2000);
