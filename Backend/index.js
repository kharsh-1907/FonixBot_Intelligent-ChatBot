require('dotenv').config();
const connectToMongo = require('./db');
const express = require('express');
const cors = require('cors');


connectToMongo();
const app = express();
const port = 5000;
// cors is uded to connect otther localhost to this(Backends localhost)
app.use(cors({
  origin: 'http://localhost:5173',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],//methods that can be done on connection of both localhosts
  allowedHeaders: ['Content-Type', 'auth-token']
}));
app.use(express.json());

app.use('/api/auth', require('./routes/auth')),
app.use('/api/notes', require('./routes/notes'))
app.use('/api/chats',require('./routes/chats'))
app.use('/api/message',require('./routes/messages'))

app.listen(port, () => {
  console.log(`Example app listening on port http://localhost:${port}`);
});
