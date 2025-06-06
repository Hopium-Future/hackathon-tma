import EventEmitter from 'eventemitter3';

const eventEmitter = new EventEmitter();

type EventHandler = (...args: any[]) => void;

const Emitter = {
    on: (event: string, fn: EventHandler) => eventEmitter.on(event, fn),
    once: (event: string, fn: EventHandler) => eventEmitter.once(event, fn),
    off: (event: string, fn: EventHandler) => eventEmitter.off(event, fn),
    emit: (event: string, payload?: any) => eventEmitter.emit(event, payload)
};

Object.freeze(Emitter);

export default Emitter;
