import express from 'express';

import { requestParams } from './_interfaces/requestParams.interface';
import Configurator from './loadConfig';

const app = express();
const PORT = 8888;
const configurator = new Configurator();

// root
app.get('/', (req, res) => res.send('Continuous Delivery Config Server is running.'));

// config endpoint
app.get<requestParams>('/:appid/:appversion/:environment', async (req, res) => {
  const config = await configurator.findConfig(req.params);
  res.send(config);
});

app.listen(PORT, () => {
  console.log(`⚡️[server]: Continuous Delivery Config Server is running at https://localhost:${PORT}`);
});
