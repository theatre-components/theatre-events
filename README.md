Theatre Events
========================

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

## The EventDispatcher

### Synchronous

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

### Asynchronous

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
