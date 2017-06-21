import {AsynchronousEventBroadcaster, LOW_PRIORITY, HIGH_PRIORITY, EventListener} from './../../src';

describe('AsynchronousEventBroadcaster', () => {
    let broadcaster;

    beforeEach(() => {
        broadcaster = new AsynchronousEventBroadcaster();
    });

    it('can register subscribers and broadcast payload to all those subscribers', (next) => {
        broadcaster.subscribe(async (data) => {
            expect(data.name).toBe('test');

            data.name = 'passed';
        });

        broadcaster.subscribe(async (data) => {
            expect(data.quantity).toBe(10);

            data.quantity = 0;
        });

        broadcaster.broadcast({name: 'test', quantity: 10})
            .then(d => {
                expect(d).toEqual({name: 'passed', quantity: 0});

                next();
            })
            .catch(next)
        ;
    });

    it('can remove subscribers', (next) => {
        let s1 = async (data) => { data.s1 = true; };
        let s2 = async (data) => { data.s2 = true; };

        broadcaster.subscribe(s1);
        broadcaster.subscribe(s2);

        broadcaster.remove(s1);

        let data: any = {};
        broadcaster.broadcast(data).then(() => {
            expect(data.s1).not.toBeDefined();
            expect(data.s2).toBe(true);

            next();
        }).catch(next);
    });

    it('can clear all subscribers', (next) => {
        let s1 = async (data) => { data.s1 = true; };
        let s2 = async (data) => { data.s2 = true; };

        broadcaster.subscribe(s1);
        broadcaster.subscribe(s2);

        broadcaster.clear();

        let data: any = {};
        broadcaster.broadcast(data).then(() => {
            expect(data.s1).not.toBeDefined();
            expect(data.s2).not.toBeDefined();

            next();
        }).catch(next);
    });

    it('can handle subscribers priority', (next) => {
        let s1: EventListener = async (data) => { data.s1 = true; expect(data.s2).toBe(true); };
        let s2: EventListener = async (data) => { data.s2 = true; expect(data.s1).not.toBeDefined(); };

        s1.priority = LOW_PRIORITY;
        s2.priority = HIGH_PRIORITY;

        broadcaster.subscribe(s1);
        broadcaster.subscribe(s2);

        let data: any = {};
        broadcaster.broadcast(data).then(() => {
            expect(data.s1).toBe(true);
            expect(data.s2).toBe(true);

            next();
        }).catch(next);
    });
});
