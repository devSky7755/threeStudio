import EventEmitter from "eventemitter3";

export const EMIT_WEIGHT_CHANGED = "control/weight-changed";
export const EMIT_WEIGHT_CHANGED_BY_CONTROL =
  "control/weight-changed-by-control";
export const EMIT_TIME_SCALE_CHANGED_BY_CONTROL =
  "control/time-scale-changed-by-control";

const eventEmitter = new EventEmitter();

const Emitter = {
  on: (event: any, fn: (...args: any[]) => void) => eventEmitter.on(event, fn),
  once: (event: any, fn: (...args: any[]) => void) =>
    eventEmitter.once(event, fn),
  off: (event: any, fn: ((...args: any[]) => void) | undefined) =>
    eventEmitter.off(event, fn),
  emit: (event: any, payload: any) => eventEmitter.emit(event, payload),
  offAll: (event: any) => eventEmitter.removeAllListeners(event),
};

Object.freeze(Emitter);

export default Emitter;
