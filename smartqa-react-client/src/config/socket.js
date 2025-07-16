import { io } from 'socket.io-client';
import { serverEndpoint } from './appConfig';

const socket = io(serverEndpoint);

export default socket;