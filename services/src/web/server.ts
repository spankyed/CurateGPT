import createServer from '../shared/server';
import { ClientPath, ports } from '../shared/constants';
import { Server as IOServer } from 'socket.io';
// import eventHandlers from './service/handlers/socket';

import calendarRoutes from './calendar';
import paperEntryRoutes from './paper-entry';
import dateEntryRoutes from './date-entry';
import searchRoutes from './search';
import sharedRoutes from './shared';
import chatRoutes from './chat';

// import mocks from '../../../tests/mocks';
// const { calendarModel } = mocks;

export const routes = [
  ...calendarRoutes,
  ...dateEntryRoutes,
  ...paperEntryRoutes,
  ...chatRoutes,
  ...searchRoutes,
  ...sharedRoutes,
];

const server = createServer({
  port: ports.web,
  routes: {
    cors: {
      origin: [ClientPath], // allow web requests
      additionalHeaders: ['cache-control', 'x-requested-with']
    }
  }
}, routes);

export const io = new IOServer(server.listener, {
  cors: {
    origin: ClientPath,
    methods: ["GET", "POST"],
    // allowedHeaders: ["my-custom-header"],
    // credentials: true // Allow sending cookies from the client
  }
});

export let user = '';

(async function start () {

  io.on('connection', (socket) => {
    console.log('A user connected by ws!', socket.id);
    user = socket.id;
    // Object.keys(eventHandlers).forEach((event) => {
    //   const handler = eventHandlers[event as keyof typeof eventHandlers] || (() => {});
    //   socket.on(event, handler);
    // });
  });

  try {
    // await server.register(Cors);
    await server.start();
  }
  catch (err) {
    console.log(err);
    process.exit(1);
  }

  console.log('Web server running at:', server.info.uri);
})();
