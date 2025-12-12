const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();

const steveRoutes = require('./routes/steveRoutes');
const campaignRoutes = require('./routes/campaignRoutes');
const uploadRoutes = require('./routes/uploadRoutes');

const app = express();
app.use(cors());
app.use(bodyParser.json({ limit: '5mb' }));

app.get('/health', (req, res) => res.json({ status: 'ok', uptime: process.uptime() }));

app.use('/api/steve', steveRoutes);
app.use('/api/campaigns', campaignRoutes);
app.use('/api/upload', uploadRoutes);

app.use((req, res) => res.status(404).json({ error: 'not_found' }));

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log(`STEVE AI backend running on port ${PORT}`));
