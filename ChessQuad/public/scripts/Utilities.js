const Utils = {
  ORDER: 10,
  get UI_ORDER () { return this.ORDER - 2; },
  TOT_SQR: 100,
  range: function (a, b) {
    const [from, to] = arguments.sort();
    return Array.from({ length: to - from + 1 }).map((_, i) => i + from);
  },

}

export function objectEquality (obj1, obj2) {
  if (obj1 == obj2) return true;

  const obj1Keys = Object.keys(obj1);
  if (obj1Keys.length == Object.keys(obj2).length) {
    return obj1Keys.every(prop => obj1[prop] === obj2[prop]);
  }
  return false;
}

export function cloneObject (obj) {
  return Object.create(
    Object.getPrototypeOf(obj),
    Object.getOwnPropertyDescriptors(obj)
  );
}

export function convertForEngine (id) {
  const row = 1 + id / 8 | 0;
  const col = 1 + id % 8;
  return row * 10 + col;
}
export function convertForGUI (index) {
  return (index / 10 | 0) * 8 + index % 10 - 9;
}

export default Utils;