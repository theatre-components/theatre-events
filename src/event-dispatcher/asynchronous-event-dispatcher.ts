import {default as EventDispatcher, EventTarget} from './../event-dispatcher';
import {default as EventListener} from './../event-listener';

/**
 * An asynchronous implementation of an event dispatcher.
 */
export default class AsynchronousEventDispatcher implements EventDispatcher
{
    private eventListeners: Map<EventTarget, Map<number, EventListener[]>>;

    constructor()
    {
        this.eventListeners = new Map();
    }
}
