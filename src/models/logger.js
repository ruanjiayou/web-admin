import { types } from "mobx-state-tree";

const log = types.model('log', {
  level: types.enumeration(['log', 'warn', 'error']),
  message: types.string,
  no: types.optional(types.number, 0),
})
const logger = types.model('logger', {
  logs: types.array(log),
  progress: types.map(log),
  keys: types.array(types.string),
  status: types.enumeration(['open', 'close']),
  maxLength: types.optional(types.number, 999),
  counter: types.optional(types.number, 0),
}).actions(self => ({
  append(data) {
    self.counter++;
    self.logs.push({ ...data, no: self.counter });
    if (self.logs > self.maxLength) {
      self.logs.shift();
    }
  },
  update(key, data) {
    self.progress.set(key, data);
    if (!self.keys.includes(key)) {
      self.keys.push(key);
    }
  },
  finish(key) {
    const index = self.keys.indexOf(key);
    if (index !== -1) {
      self.keys.splice(index, 1);
    }
    if (self.progress[key]) {
      delete self.progress[key];
    }
  },
  toggle() {
    self.status = self.status === 'open' ? 'close' : 'open'
  }
}));

export default logger;