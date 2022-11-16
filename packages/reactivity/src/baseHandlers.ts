import { track, trigger } from "./effect";
import { reactive, Target } from "./reactive";
import {isObject} from "shared";

function createGetter(isReadonly = false) {
  return function get (target: Target, key: string, receiver: Object) {
    const res = Reflect.get(target, key, receiver);
    track(target, key);
    if(isObject(res)) {
      return reactive(res);
    }
    return res;
  }
}
const get = createGetter();

function createSetter() {
  return function set (target: Target, key: string, value:unknown, receiver: Object) {
    const res = Reflect.set(target, key, value, receiver);
    trigger(target);
    return res;
  }
}
const set = createSetter();

export const mutableHandlers: ProxyHandler<object> =  {
  get,
  set,
}