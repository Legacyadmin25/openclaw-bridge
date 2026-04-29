const express = require('express');

const PORT = process.env.PORT || process.env.BRIDGE_PORT || 3000;

const app = express();
app.use(express.json({ limit: '1mb' }));

app.get('/healthz', (req, res) => {
res.json({ status: 'ok' });
});

app.post('/tasks', (req, res) => {
try {
const task = req.body;
const label = task?.id || task?.type || 'unlabeled-task';
console.log(`Architect received task: ${label}`);
console.dir(task, { depth: null });
res.status(200).json({ status: 'accepted' });
} catch (err) {
console.error('Failed to process incoming task:', err);
res.status(500).json({ status: 'error', message: err.message });
}
});

app.use((req, res) => {
res.status(404).json({ status: 'not_found' });
});

app.listen(PORT, () => {
console.log(`Architect bridge listening on port ${PORT}`);
});
