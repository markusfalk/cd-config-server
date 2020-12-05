import express from 'express';

const app = express();
const PORT = 8888;

// root
app.get('/', (req, res) => res.send('Continuous Delivery Config Server is running.'));

// config endpoint
// app.get('/:appid/:appversion/:environment');

app.listen(PORT, () => {
  console.log(`⚡️[server]: Server is running at https://localhost:${PORT}`);
});
