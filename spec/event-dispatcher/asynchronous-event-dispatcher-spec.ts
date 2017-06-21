import {AsynchronousEventDispatcher, EventListener, LOW_PRIORITY, HIGH_PRIORITY} from './../../src';

interface Payload
{
    name: string;
}

describe('AsynchronousEventDispatcher', () => {
    let dispatcher: AsynchronousEventDispatcher;

    beforeEach(() => {
        dispatcher = new AsynchronousEventDispatcher();
    });

    it('can register listeners and dispatch asynchronously an event and a payload', (next) => {
        let trigger: boolean = false;
        let untriggered: boolean = false;
        let listener: EventListener = async (payload: Payload) => {
            trigger = true;
            expect(payload.name).toBe('payload');
        };
        let undispactchedListener: EventListener = async () => {
            untriggered = true;
        };

        dispatcher.addEventListener('test', listener);
        dispatcher.addEventListener('untriggered', undispactchedListener);
        dispatcher.dispatch<Payload>('test', {name: 'payload'}).then(d => {
            expect(trigger).toBe(true);
            expect(untriggered).toBe(false);

            expect(d).toEqual({name: 'payload'});

            next()
        });
    });

    it('can unregister a listener and/or clear it\'s listener xstack', (next) => {
        let t1: boolean = false;
        let t2: boolean = false;
        let t3: boolean = false;
        let l1: EventListener = async (payload: Payload) => {
            t1 = true;
            expect(payload.name).toBe('payload');
        };
        let l2: EventListener = async () => {
            t2 = true;
        };
        let l3: EventListener = async () => { t3 = true; }

        dispatcher.addEventListener('test', l1);
        dispatcher.addEventListener('test', l2);
        dispatcher.addEventListener('test2', l3);
        dispatcher.removeEventListener('test', l2);

        dispatcher.dispatch<Payload>('test', {name: 'payload'}).then(d => {
            expect(t1).toBe(true);
            expect(t2).toBe(false);
            expect(t3).toBe(false);

            t1 = false;

            dispatcher.clearEventListeners('test');

            return dispatcher.dispatch<Payload>('test', {name: 'payload'});
        }).then(n => {
            return dispatcher.dispatch('test2');
        }).then(d => {
            expect(t1).toBe(false);
            expect(t2).toBe(false);
            expect(t3).toBe(true);

            t3 = false;

            dispatcher.clearEventListeners();

            return dispatcher.dispatch<Payload>('test', {name: 'payload'});
        }).then(d => {
            return dispatcher.dispatch('test2');
        }).then(d => {
            expect(t1).toBe(false);
            expect(t2).toBe(false);
            expect(t3).toBe(false);

            next();
        });
    });

    it('can handle listeners priority', (next) => {
        let t1 = false;
        let t2 = false;
        let t3 = false;

        let l1: EventListener = async () => { expect(t2).toBe(false); expect(t3).toBe(true); t1 = true; };
        let l2: EventListener = async () => { expect(t1).toBe(true); expect(t3).toBe(true); t2 = true; };
        let l3: EventListener = async () => { expect(t1).toBe(false); expect(t2).toBe(false); t3 = true; };

        l2.priority = LOW_PRIORITY;
        l3.priority = HIGH_PRIORITY;

        dispatcher.addEventListener('test', l1);
        dispatcher.addEventListener('test', l2);
        dispatcher.addEventListener('test', l3);

        dispatcher.dispatch('test').then(next);
    });
});
