Theatre Events
==============

[![Circle CI](https://circleci.com/gh/theatre-components/theatre-events/tree/master.svg?style=shield)](https://circleci.com/gh/theatre-components/theatre-events/tree/master)
[![npm version](https://badge.fury.io/js/theatre-events.svg)](https://badge.fury.io/js/theatre-events)
[![dependencies](https://david-dm.org/theatre-components/theatre-events.svg)](https://david-dm.org/theatre-components/theatre-events)
[![WTFPL Licence](http://www.wtfpl.net/wp-content/uploads/2012/12/wtfpl-badge-1.png)](http://www.wtfpl.net/about/)


This library is a part of the **Theatre** module. You can use it ase is or with a complete **Theatre** installation.

## About

**Theatre Events** is a short but complete implementation of a standard `ÈventDispatcher`, `EventEmitter` and `EventBroadcaster`. It can be use as a standalone module in any project to start helping you building robust events system.

## Installation

```
npm install theatre-events --save
```

## Quick Start

This module brings 3 usefull and flexible components: the `EventDispatcher`, the `EventBroadcaster` and the `EventEmitter`. Both cames with a **synchronous** and **asynchronous** implementation.

### EventDispatcher: Synchronous

```javascript
import {SynchronousEventDispatcher} from 'theatre-events';

let dispatcher = new SynchronousEventDispatcher();

// Register also supports symbols
dispatcher.addEventListener('My Event', (myPayload) => {
    console.log(myPayload);
});

// This command will log "{name: 'test'}"
dispatcher.dispatch('My Event', {name: 'test'});
```

### EventDispatcher: Asynchronous

```javascript
import {AsynchronousEventDispatcher} from 'theatre/events';

let dispatcher = new AsynchronousEventDispatcher();

dispatcher.addEventListener('send email', (emailPayload) => {
    sendMail(emailPayload);
});

// The dispatch method will not be blocking, so you can send your email
// and do other stuff during the mail is processed
dispatcher.dispatch('send email', {
    subject: 'Do you heard about theatre components ?',
}).then(d => console.log('The email has been sent')).catch(console.error);
```

### Event Emitter: Synchronous

It is quite the same API as an `EventDispatcher`.

```javascript
import {SynchronousEventEmitter} from 'theatre-events';

// You can pass an instance of a `SynchronousEventDispatcher`. If you do so,
// the event emitter will be a simple wrap of the dispatcher.
let emitter = new SynchronousEventEmitter();

emitter.on('test', (payload) => {
    payload.name = 'test';
});

let data = {};
emitter.emit('test', data);

console.log(data.name);
```

### Event Emitter: Asynchronous

```javascript
import {AsynchronousEventEmitter} from 'theatre-events';

let emitter = new AsynchronousEventEmitter();

emitter.on('test', (payload) => {
    payload.name = 'test';
});

let data = {};
emitter.emit('test', data).then(() => {
    console.log(data.name);
}).catch(console.error);
```

### Event Broadcaster: Synchronous

Event broadcaster is very similar to an event dispatcher but it don't use
named event.

```javascript
import {SynchronousEventBroadcaster} from 'theatre-events';

let broadcaster = new SynchronousEventBroadcaster();

broadcaster.subscribe((data) => {
    data.name ='test';
});

let data = {};
broadcaster.broadcast(data);

console.log(data.name);
```

### Event Broadcaster: Asynchronous

```javascript
import {AsynchronousEventBroadcaster} from 'theatre-events';

let broadcaster = new AsynchronousEventBroadcaster();

broadcaster.subscribe((data) => {
    data.name ='test';
});

let data = {};
broadcaster.broadcast(data).then(() => {
    console.log(data.name);
}).catch(console.error);
```

### Event listener priority

You can control the execution priority of your listeners:

```javascript
import {SynchronousEventDispatcher, LOW_PRIORITY, HIGH_PRIORITY} from 'theatre-events';

let dispatcher = new SynchronousEventDispatcher();

function sendLast() {
    console.log('Must be the last event');
}

function sendFirst() {
    console.log('Must be the first');
}

// You can also assign an integer. The highest the integer is
// the latest it will be triggered. By default you can use:
// LOW_PRIORITY = 255
// NORMAL_PRIORITY = 0
// HIGH_PRIORITY = -255
sendLast.priority = LOW_PRIORITY;
sendFirst.priority = HIGH_PRIORITY;

dispatcher.addEventListener('send message', sendLast);
dispatcher.addEventListener('send message', sendFirst);

dispatcher.dispatch('test');
```
