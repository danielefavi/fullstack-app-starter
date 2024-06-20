import express from 'express';
import bodyParser from 'body-parser';
import bootstrap from './bootstrap.js';
import initRoutes from './routes/index.js';

await bootstrap();


const httpApp = express();

// enable CORS
httpApp.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');

  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  
  next();
});

httpApp.use(bodyParser.json()); // support json encoded bodies
httpApp.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies

initRoutes(httpApp);

httpApp.listen(process.env.SERVER_PORT, () => {
  console.log(`Server is running on port ${process.env.SERVER_PORT}`);
});
