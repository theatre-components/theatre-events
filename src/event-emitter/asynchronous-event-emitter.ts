import EventEmitter from './../event-emitter';
import {EventTarget} from './../event-dispatcher';
import EventListener from './../event-listener';
import AsynchronousEventDispatcher from './../event-dispatcher/asynchronous-event-dispatcher';

/**
 * An implementation of an asynchronous event emitter
 */
export default class AsynchronousEventEmitter implements EventEmitter
{
    private dispatcher: AsynchronousEventDispatcher;

    constructor(dispatcher?: AsynchronousEventDispatcher)
    {
        this.dispatcher = dispatcher || new AsynchronousEventDispatcher();
    }

    /**
     * {@inheritdoc}
     */
    emit<T>(name: EventTarget, payload?: T): Promise<void|void[]>
    {
        return this.dispatcher.dispatch(name, payload);
    }

    /**
     * {@inheritdoc}
     */
    on(name: EventTarget, listener: EventListener): void
    {
        this.dispatcher.addEventListener(name, listener);
    }

    /**
     * {@inheritdoc}
     */
    removeEventListener(name: EventTarget, listener: EventListener): void
    {
        this.dispatcher.removeEventListener(name, listener);
    }

    /**
     * {@inheritdoc}
     */
    clearEventListeners(name?: EventTarget): void
    {
        this.dispatcher.clearEventListeners(name);
    }
}

