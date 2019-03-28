// CREDIT: Thanks MDN: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/assign#Polyfill
// I know exactly how it is used so no need for lodash.assign
export default function assign() {
  const to = Object(arguments[0]);

  for (let index = 1; index < arguments.length; index++) {
    const curr = arguments[index];
    for (const key in curr) {
      to[key] = curr[key];
    }
  }

  return to;
}
