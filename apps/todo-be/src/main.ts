/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 */
import * as express from 'express';

const app = express()

app.get('/api', (req, res) => {
  res.set('Access-Control-Allow-Origin', '*');
  res.send({tasks: ['Build a Todo backend', 'Display Todos']});
});

const port = process.env.port || 3333;
const server = app.listen(port, () => {
  console.log(`Listening at http://localhost:${port}/api`);
});
server.on('error', console.error);
