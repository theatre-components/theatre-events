import {SynchronousEventBroadcaster, LOW_PRIORITY, HIGH_PRIORITY, EventListener} from './../../src';

describe('SynchronousEventBroadcaster', () => {
    let broadcaster;

    beforeEach(() => {
        broadcaster = new SynchronousEventBroadcaster();
    });

    it('can register subscribers and broadcast payload to all those subscribers', () => {
        broadcaster.subscribe((data) => {
            expect(data.name).toBe('test');
        });

        broadcaster.subscribe((data) => {
            expect(data.quantity).toBe(10);
        });

        let data = broadcaster.broadcast({name: 'test', quantity: 10});

        expect(data).toEqual({name: 'test', quantity: 10});
    });

    it('can remove subscribers', () => {
        let s1 = (data) => { data.s1 = true; };
        let s2 = (data) => { data.s2 = true; };

        broadcaster.subscribe(s1);
        broadcaster.subscribe(s2);

        broadcaster.remove(s1);

        let data: any = {};
        broadcaster.broadcast(data);

        expect(data.s1).not.toBeDefined();
        expect(data.s2).toBe(true);
    });

    it('can clear all subscribers', () => {
        let s1 = (data) => { data.s1 = true; };
        let s2 = (data) => { data.s2 = true; };

        broadcaster.subscribe(s1);
        broadcaster.subscribe(s2);

        broadcaster.clear();

        let data: any = {};
        broadcaster.broadcast(data);

        expect(data.s1).not.toBeDefined();
        expect(data.s2).not.toBeDefined();
    });

    it('can handle subscribers priority', () => {
        let s1: EventListener = (data) => { data.s1 = true; expect(data.s2).toBe(true); };
        let s2: EventListener = (data) => { data.s2 = true; expect(data.s1).not.toBeDefined(); };

        s1.priority = LOW_PRIORITY;
        s2.priority = HIGH_PRIORITY;

        broadcaster.subscribe(s1);
        broadcaster.subscribe(s2);

        let data: any = {};
        broadcaster.broadcast(data);

        expect(data.s1).toBe(true);
        expect(data.s2).toBe(true);
    });
});
