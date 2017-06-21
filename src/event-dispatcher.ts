import EventListener from './event-listener';

/**
 * This is a type used to defined an event name. Event name is a subject
 * dispatched by the event dispatcher.
 */
type EventTarget = string|symbol;

/**
 * A standard event dispatcher interface wich define the behavior of an event dispatcher
 */
interface EventDispatcher
{
    /**
     * Dispatch an event. It can be synchronous or asynchronous depending
     * on the implementation of the event dispatcher.
     */
    dispatch<T>(eventName: EventTarget, payload?: T): T|Promise<T>;

    /**
     * Add a new event listener to the target eventName
     */
    addEventListener(eventName: EventTarget, listener: EventListener): void;

    /**
     * Remove an event listener from a target eventName
     */
    removeEventListener(eventName: EventTarget, listener: EventListener): void;

    /**
     * Clear all event listeners from a target or clear the entire listener
     * stack if no event name is provided.
     */
    clearEventListeners(eventName?: EventTarget): void;
}

export {EventTarget};
export default EventDispatcher;
