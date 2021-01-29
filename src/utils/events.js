import * as ee from 'event-emitter'

const MyClass = function () { /* .. */ };
ee(MyClass.prototype);

export const events = new MyClass()