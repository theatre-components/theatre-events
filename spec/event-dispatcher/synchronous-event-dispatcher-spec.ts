import {SynchronousEventDispatcher, EventListener, LOW_PRIORITY, HIGH_PRIORITY} from './../../src';

interface Payload
{
    name: string;
}

describe('SynchronousEventDispatcher', () => {
    let dispatcher: SynchronousEventDispatcher;

    beforeEach(() => {
        dispatcher = new SynchronousEventDispatcher();
    });

    it('can register listeners and dispatch an event and a payload', () => {
        let trigger: boolean = false;
        let untriggered: boolean = false;
        let listener: EventListener = (payload: Payload) => {
            trigger = true;
            expect(payload.name).toBe('payload');
        };
        let undispactchedListener: EventListener = () => {
            untriggered = true;
        };

        dispatcher.addEventListener('test', listener);
        dispatcher.addEventListener('untriggered', undispactchedListener);
        let event = dispatcher.dispatch<Payload>('test', {name: 'payload'});

        expect(trigger).toBe(true);
        expect(untriggered).toBe(false);
        expect(event).toEqual({name: 'payload'});
    });

    it('can unregister a listener and/or clear it\'s listener stack', () => {
        let t1: boolean = false;
        let t2: boolean = false;
        let t3: boolean = false;
        let l1: EventListener = (payload: Payload) => {
            t1 = true;
            expect(payload.name).toBe('payload');
        };
        let l2: EventListener = () => {
            t2 = true;
        };
        let l3: EventListener = () => { t3 = true; }

        dispatcher.addEventListener('test', l1);
        dispatcher.addEventListener('test', l2);
        dispatcher.addEventListener('test2', l3);
        dispatcher.removeEventListener('test', l2);

        dispatcher.dispatch<Payload>('test', {name: 'payload'});

        expect(t1).toBe(true);
        expect(t2).toBe(false);
        expect(t3).toBe(false);

        t1 = false;

        dispatcher.clearEventListeners('test');

        dispatcher.dispatch<Payload>('test', {name: 'payload'});
        dispatcher.dispatch('test2');

        expect(t1).toBe(false);
        expect(t2).toBe(false);
        expect(t3).toBe(true);

        t3 = false;

        dispatcher.clearEventListeners();

        dispatcher.dispatch<Payload>('test', {name: 'payload'});
        dispatcher.dispatch('test2');

        expect(t1).toBe(false);
        expect(t2).toBe(false);
        expect(t3).toBe(false);
    });

    it('can handle listeners priority', () => {
        let t1 = false;
        let t2 = false;
        let t3 = false;

        let l1: EventListener = () => { expect(t2).toBe(false); expect(t3).toBe(true); t1 = true; };
        let l2: EventListener = () => { expect(t1).toBe(true); expect(t3).toBe(true); t2 = true; };
        let l3: EventListener = () => { expect(t1).toBe(false); expect(t2).toBe(false); t3 = true; };

        l2.priority = LOW_PRIORITY;
        l3.priority = HIGH_PRIORITY;

        dispatcher.addEventListener('test', l1);
        dispatcher.addEventListener('test', l2);
        dispatcher.addEventListener('test', l3);

        dispatcher.dispatch('test');
    });
});
