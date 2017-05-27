import {EventTarget} from './event-dispatcher';
import EventListener from './event-listener';

/**
 * Define the behavior of a standard event emitter. Has you may noticed, it's
 * the same behavior as an event dispatcher. But for code semantic and clarity
 * it can be usefull.
 */
interface EventEmitter
{
    /**
     * Emit an event to all attached listeners
     */
    emit<T>(name: EventTarget, payload?: T): void|Promise<void|void[]>;

    /**
     * Attach a listener to the emitter
     */
    on(name: EventTarget, listener: EventListener): void;

    /**
     * Remove an event listener
     */
    removeEventListener(name: EventTarget, listener: EventListener): void;

    /**
     * Clear an event listener stack
     */
    clearEventListeners(name?: EventTarget): void;
}

export default EventEmitter;
