import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import jsonSchemas from '../jsonschemas.json';
import { Express } from 'express';

export function setupSwagger(app: Express) {
  const swaggerDefinition = {
    openapi: '3.0.0',
    info: {
      title: 'KulturBooking API',
      version: '1.0.0',
    },
    components: {
      schemas: jsonSchemas,
    },
  };

  const options = {
    swaggerDefinition,
    apis: ['./src/routes/*.ts'], // Path to your route files for endpoint docs
  };

  const swaggerSpec = swaggerJsdoc(options);
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
}
