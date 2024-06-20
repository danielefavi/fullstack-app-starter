import express from 'express';
import userRoutes from './user-api.js';

export default function(httpApp) {
  const router = express.Router();


  
  // define the routes
  httpApp.use('/api/users', userRoutes(router));



  // on root "/" return the file "views/index.html"
  httpApp.get('/', (req, res) => res.sendFile('index.html', { root: 'server/app/views' }));
  httpApp.use('/public', express.static('server/public'));



  // return 404 for unknown routes
  httpApp.use((req, res) => {
    res.status(404).json({ message: 'Not Found' });
  });



  // error handler
  httpApp.use(async (err, req, res, next) => {
    let status = 500;
    let message = err.message || 'Internal Server Error';
    let data = null;
    let errors = null;
    
    if (err.name === 'HttpException') {
      status = err.statusCode;
      message = err.message;
      errors = err.errors;
    }

    if (err.name === 'ApiException') {
      status = err.response.status;
      message = await err.getBodyMessage();
      data = await err.getBodyResponse();
    }

    res.status(status).json({
      message,
      exceptionType: err.name,
      stacktrace: err.stack ? err.stack.split("\n") : 'no stacktrace available',
      data,
      errors
    });
  });



}