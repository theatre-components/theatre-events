import EventBroadcaster from './../event-broadcaster';
import {default as EventListener, NORMAL_PRIORITY} from './../event-listener';

/**
 * An asynchronous implementation of an event broadcaster
 */
export default class AsynchronousEventBroadcaster implements EventBroadcaster
{
    private subscribers: Map<number, EventListener[]>;

    constructor()
    {
        this.subscribers = new Map();
    }

    /**
     * {@inheritdoc}
     */
    broadcast<T>(payload?: T): Promise<T>
    {
        let promises = [];
        let priorities = [];
        this.subscribers.forEach((s, priority) => priorities.push(priority));

        priorities.sort().map((priority) => {
            this.subscribers.get(priority).map(s => promises.push(s(payload)));
        });

        return Promise.all(promises).then(() => payload);
    }

    /**
     * {@inheritdoc}
     */
    subscribe(subscriber: EventListener): void
    {
        subscriber.priority = subscriber.priority || NORMAL_PRIORITY;

        if (!this.subscribers.get(subscriber.priority)) {
            this.subscribers.set(subscriber.priority, []);
        }

        this.subscribers.get(subscriber.priority).push(subscriber);
    }

    /**
     * {@inheritdoc}
     */
    remove(subscriber: EventListener): void
    {
        this.subscribers.forEach((subscribers, priority) => {
            subscribers.map((s, i) => {
                if (s !== subscriber) {
                    return;
                }

                subscribers.splice(i, 1);
            });

            if (!subscribers.length) {
                this.subscribers.delete(priority);
            }
        });
    }

    /**
     * {@inheritdoc}
     */
    clear(): void
    {
        this.subscribers = new Map();
    }
}
