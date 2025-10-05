import { writeFileSync } from 'fs';
import { join } from 'path';
import { zodToJsonSchema } from 'zod-to-json-schema';
import { BookingCreateSchema } from '../src/schemas/booking';
import { EventCreateSchema } from '../src/schemas/event';
import { MapPointCreateSchema } from '../src/schemas/mappoint';

const schemas = {
  BookingCreate: BookingCreateSchema,
  EventCreate: EventCreateSchema,
  MapPointCreate: MapPointCreateSchema,
};

const jsonSchemas: Record<string, any> = {};

for (const [name, schema] of Object.entries(schemas)) {
  jsonSchemas[name] = zodToJsonSchema(schema);
}

writeFileSync(
  join(__dirname, '../jsonschemas.json'),
  JSON.stringify(jsonSchemas, null, 2)
);
console.log('JSON Schemas generated at jsonschemas.json');
