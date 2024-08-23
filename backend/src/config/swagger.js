import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

// Resolve the current directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Swagger definition
const swaggerDefinition = {
  openapi: '3.0.0',
  info: {
    title: 'Your API Title',
    version: '1.0.0',
    description: 'A description of your API',
  },
  servers: [
    {
      url: 'http://localhost:3000/api', // Adjust to your server URL
      description: 'Development server',
    },
  ],
  components: {
    securitySchemes: {
      BearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
      },
    },
  },
  security: [
    {
      BearerAuth: [],
    },
  ],
};

// Options for the Swagger docs
const options = {
  swaggerDefinition,
  apis: [join(__dirname, '../routes/authRouter.js'),join(__dirname, '../routes/postRouter.js')], 
};

const swaggerSpec = swaggerJsdoc(options);

export { swaggerUi, swaggerSpec };
