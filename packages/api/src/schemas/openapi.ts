import { EventCreateSchema } from './event';
import { BookingCreateSchema } from './booking';
import { MapPointCreateSchema } from './mappoint';

const registry = new OpenAPIRegistry();

registry.register('EventCreate', EventCreateSchema);
registry.register('BookingCreate', BookingCreateSchema);
registry.register('MapPointCreate', MapPointCreateSchema);

export default registry;
