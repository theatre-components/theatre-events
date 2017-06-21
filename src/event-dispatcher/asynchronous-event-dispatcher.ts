import {default as EventDispatcher, EventTarget} from './../event-dispatcher';
import {default as EventListener, NORMAL_PRIORITY} from './../event-listener';

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

    /**
     * {@inheritdoc}
     */
    dispatch<T>(name: EventTarget, payload?: T): Promise<T>
    {
        let promises = [];

        if (!this.eventListeners.has(name)) {
            return Promise.all(promises).then(() => payload);
        }

        let priorities: number[] = [];
        this.eventListeners.get(name).forEach((v, k) => {priorities.push(k)});

        priorities.sort().map(priority => this.eventListeners.get(name).get(priority).map(l => {
            promises.push(l(payload))
        }));

        return Promise.all(promises).then(() => payload);
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
        if (!this.eventListeners.get(name)) {
            return;
        }

        this.eventListeners.get(name).forEach((stack, priority) => {
            stack.map((callback, index) => {
                if (callback !== listener) {
                    return;
                }

                stack.splice(index, 1);
            });

            if (!stack.length) {
                this.eventListeners.get(name).delete(priority);
            }
        });

        if (!this.eventListeners.get(name).size) {
            this.eventListeners.delete(name);
        }
    }

    /**
     * {inheritdoc}
     */
    clearEventListeners(name?: EventTarget): void
    {
        if (!name) {
            this.eventListeners.clear();
        }

        this.eventListeners.has(name) && this.eventListeners.delete(name);
    }
}
