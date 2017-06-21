import EventListener from './../event-listener';
import {EventTarget} from './../event-dispatcher';
import SynchronousEventDispatcher from './../event-dispatcher/synchronous-event-dispatcher';
import EventEmitter from './../event-emitter';

/**
 * A synchronous implementation of an event emitter
 */
export default class SynchronousEventEmitter implements EventEmitter
{
    private dispatcher: SynchronousEventDispatcher;

    constructor(dispatcher?: SynchronousEventDispatcher)
    {
        this.dispatcher = dispatcher || new SynchronousEventDispatcher();
    }

    /**
     * {@inheritdoc}
     */
    emit<T>(name: EventTarget, payload?: T): T
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
