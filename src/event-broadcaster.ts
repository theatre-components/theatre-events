import EventListener from './event-listener';

/**
 * Broadcast payload without any target. It means that triggered event are globaly
 * broadcasted inside an application with no specified target.
 */
interface EventBroadcaster
{
    /**
     * Broadcast synchronously or not a given payload
     */
    broadcast<T>(payload?: T): void|Promise<void|void[]>;

    /**
     * Attach an event listener to the broadcaster
     */
    addEventListener(listener: EventListener): void;

    /**
     * Remove an event listener from the broadcaster
     */
    removeEventListener(listener: EventListener): void;

    /**
     * Clear the entire broadcaster
     */
    clearEventListeners(): void;
}

export default EventBroadcaster;
