import {SynchronousEventDispatcher, SynchronousEventEmitter, EventListener, LOW_PRIORITY, HIGH_PRIORITY} from './../../src';

describe('SynchronousEventEmitter', () => {
    let dispatcher: SynchronousEventDispatcher;
    let emitter: SynchronousEventEmitter;

    beforeEach(() => {
        dispatcher = new SynchronousEventDispatcher();
        emitter = new SynchronousEventEmitter(dispatcher);
    });

    it('can register listeners and emit events through the wrapped dispatcher', () => {
        let l1 = (payload) => {
            payload.l1 = true;
        };
        let l2 = (payload) => {
            payload.l2 = true;
        };

        dispatcher.addEventListener('test', l1);
        emitter.on('test', l2);

        let data: any = {};
        let e = emitter.emit('test', data);

        expect(data.l1).toBe(true);
        expect(data.l2).toBe(true);
        expect(e).toBe(data);
    });

    it('can unregister a listener and/or clear it\'s listener stack', () => {
        let l1 = (payload) => {
            payload.l1 = true;
        };
        let l2 = (payload) => {
            payload.l2 = true;
        };
        let l3 = (payload) => { 
            payload.l3 = true;
        }

        emitter.on('test', l1);
        emitter.on('test', l2);
        emitter.on('test2', l3);

        emitter.removeEventListener('test', l2);

        let data: any = {};
        emitter.emit('test', data);

        expect(data.l1).toBe(true);
        expect(data.l2).not.toBeDefined();
        expect(data.l3).not.toBeDefined();

        emitter.clearEventListeners('test');

        data = {};
        emitter.emit('test', data);
        emitter.emit('test2', data);

        expect(data.l1).not.toBeDefined();
        expect(data.l2).not.toBeDefined();
        expect(data.l3).toBe(true);

        emitter.clearEventListeners();

        data = {};
        emitter.emit('test', data);
        emitter.emit('test2', data);

        expect(data.l1).not.toBeDefined();
        expect(data.l2).not.toBeDefined();
        expect(data.l3).not.toBeDefined();
    });

    it('can handle listeners priority', () => {
        let l1: EventListener = (p) => { expect(p.l2).not.toBeDefined(); expect(p.l3).toBe(true); p.l1 = true; };
        let l2: EventListener = (p) => { expect(p.l1).toBe(true); expect(p.l3).toBe(true); p.l2 = true; };
        let l3: EventListener = (p) => { expect(p.l1).not.toBeDefined(); expect(p.l2).not.toBeDefined(); p.l3 = true; };

        l2.priority = LOW_PRIORITY;
        l3.priority = HIGH_PRIORITY;

        emitter.on('test', l1);
        emitter.on('test', l2);
        emitter.on('test', l3);

        let data: any = {};
        emitter.emit('test', data);
    });
});
