Theatre Events
==============

This library is a part of the **Theatre** module. You can use it ase is or with
a complete **Theatre** installation.

## About

**Theatre Events** is a short but complete implementation of a standard `ÈventDispatcher` and
`EventBroadcaster`. It can be use as a standalone module in any project to start
helping you building robust events system.

## Installation

```
npm install @theatre/events --save
```

## Quick Start

This module brings 2 usefull and flexible components: the `EventDispatcher` and
the `EventBroadcaster`. Both cames with a **synchronous** and **asynchronous**
implementation.

### EventDispatcher: Synchronous

```javascript
import {SynchronousEventDispatcher} from '@theatre/events';

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
import {AsynchronousEventDispatcher} from '@theatre/events';

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

### Event listener priority

```javascript
import {SynchronousEventDispatcher, LOW_PRIORITY, HIGH_PRIORITY} from '@theatre/events';

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


