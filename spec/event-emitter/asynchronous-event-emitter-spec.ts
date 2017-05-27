import {AsynchronousEventDispatcher, AsynchronousEventEmitter, EventListener, LOW_PRIORITY, HIGH_PRIORITY} from './../../src';

describe('AsynchronousEventEmitter', () => {
    let dispatcher: AsynchronousEventDispatcher;
    let emitter: AsynchronousEventEmitter;

    beforeEach(() => {
        dispatcher = new AsynchronousEventDispatcher();
        emitter = new AsynchronousEventEmitter(dispatcher);
    });

    it('can register listeners and emit events through the decorated dispatcher asynchronously', (next) => {
        let l1 = (payload) => {
            payload.l1 = true;
        };
        let l2 = (payload) => {
            payload.l2 = true;
        };

        dispatcher.addEventListener('test', l1);
        emitter.on('test', l2);

        let data: any = {};
        emitter.emit('test', data).then(() => {
            expect(data.l1).toBe(true);
            expect(data.l2).toBe(true);

            next();
        }).catch(e => console.error(e) || expect(e).not.toBeDefined() || next());
    });

    it('can unregister a listener and/or clear it\'s listener stack', (next) => {
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
        emitter.emit('test', data).then(() => {
            expect(data.l1).toBe(true);
            expect(data.l2).not.toBeDefined();
            expect(data.l3).not.toBeDefined();

            emitter.clearEventListeners('test');

            data = {};

            return emitter.emit('test', data);
        }).then(e => {
            return emitter.emit('test2', data);
        }).then(e => {
            expect(data.l1).not.toBeDefined();
            expect(data.l2).not.toBeDefined();
            expect(data.l3).toBe(true);

            emitter.clearEventListeners();

            data = {};
            return emitter.emit('test', data);
        }).then(e => {
            return emitter.emit('test2', data);
        }).then(e => {
            expect(data.l1).not.toBeDefined();
            expect(data.l2).not.toBeDefined();
            expect(data.l3).not.toBeDefined();

            next();
        }).catch(e => console.error(e) || expect(e).not.toBeDefined() || next());
    });

    it('can handle listeners priority', (next) => {
        let l1: EventListener = (p) => { expect(p.l2).not.toBeDefined(); expect(p.l3).toBe(true); p.l1 = true; };
        let l2: EventListener = (p) => { expect(p.l1).toBe(true); expect(p.l3).toBe(true); p.l2 = true; };
        let l3: EventListener = (p) => { expect(p.l1).not.toBeDefined(); expect(p.l2).not.toBeDefined(); p.l3 = true; };

        l2.priority = LOW_PRIORITY;
        l3.priority = HIGH_PRIORITY;

        emitter.on('test', l1);
        emitter.on('test', l2);
        emitter.on('test', l3);

        let data: any = {};
        emitter.emit('test', data).then(next).catch(e => console.error(e) || expect(e).not.toBeDefined() || next());
    });
});
