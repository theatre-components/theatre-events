import {default as EventListener, NORMAL_PRIORITY} from './../event-listener';
import {default as EventDispatcher, EventTarget} from './../event-dispatcher';

/**
 * Dispatch events synchronously through your application.
 */
export default class SynchronousEventDispatcher implements EventDispatcher
{
    private eventListeners: Map<EventTarget, Map<number, Array<EventListener>>>;

    constructor()
    {
        this.eventListeners = new Map();
    }

    /**
     * {@inheritdoc}
     */
    dispatch<T>(name: EventTarget, payload?: T): void
    {
        if (!this.eventListeners.has(name)) {
            return;
        }

        let priorities: number[] = [];
        this.eventListeners.get(name).forEach((l, priority) => {
            priorities.push(priority);
        });

        priorities.sort().map((priority) => {
            this.eventListeners.get(name).get(priority).map(l => l(payload));
        });
    }

    /**
     * {@inheritdoc}
     */
    addEventListener(name: EventTarget, listener: EventListener): void
    {
        listener.priority = listener.priority || NORMAL_PRIORITY;

        if (!this.eventListeners.has(name)) {
            this.eventListeners.set(name, new Map());
        }

        if (!this.eventListeners.get(name).has(listener.priority)) {
            this.eventListeners.get(name).set(listener.priority, []);
        }

        this.eventListeners.get(name).get(listener.priority).push(listener);
    }

    /**
     * {@inheritdoc}
     */
    removeEventListener(name: EventTarget, listener: EventListener): void
    {
        if (!this.eventListeners.has(name)) {
            return;
        }

        this.eventListeners.get(name).forEach((listeners, index) => {
            listeners.map((registeredListener, i) => {
                if (registeredListener !== listener) {
                    return;
                }

                listeners.splice(i, 1);
            });

            if (!listeners.length) {
                this.eventListeners.get(name).delete(index);
            }
        });

        if (!this.eventListeners.get(name).size) {
            this.eventListeners.delete(name);
        }
    }

    /**
     * {@inheritdoc}
     */
    clearEventListeners(name?: EventTarget): void
    {
        if (!name) {
            this.eventListeners.clear();

            return;
        }

        if (!this.eventListeners.has(name)) {
            return;
        }

        this.eventListeners.get(name).clear();
    }
}
