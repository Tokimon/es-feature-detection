module.exports = function(global) {
  return {
    'Array': {
      'from': () => typeof Array.from === 'function',
      'isArray': () => typeof Array.isArray === 'function',
      'of': () => () => typeof Array.of === 'function',
      'concat': () => () => typeof [].concat === 'function',
      'copyWithin': () => typeof [].copyWithin === 'function',
      'entries': () => typeof [].entries === 'function',
      'every': () => typeof [].every === 'function',
      'fill': () => typeof [].fill === 'function',
      'filter': () => typeof [].filter === 'function',
      'find': () => typeof [].find === 'function',
      'findIndex': () => typeof [].findIndex === 'function',
      'forEach': () => typeof [].forEach === 'function',
      'includes': () => typeof [].includes === 'function',
      'indexOf': () => typeof [].indexOf === 'function',
      'keys': () => typeof [].keys === 'function',
      'lastIndexOf': () => typeof [].lastIndexOf === 'function',
      'map': () => typeof [].map === 'function',
      'reduce': () => typeof [].reduce === 'function',
      'reduceRight': () => typeof [].reduceRight === 'function',
      'some': () => typeof [].some === 'function',
      'values': () => typeof [].values === 'function'
    },

    'Math': {
      'imul': () => typeof Math.imul === 'function',
      'clz32': () => typeof Math.clz32 === 'function',
      'fround': () => typeof Math.fround === 'function',
      'log10': () => typeof Math.log10 === 'function',
      'log2': () => typeof Math.log2 === 'function',
      'log1p': () => typeof Math.log1p === 'function',
      'expm1': () => typeof Math.expm1 === 'function',
      'cosh': () => typeof Math.cosh === 'function',
      'sinh': () => typeof Math.sinh === 'function',
      'tanh': () => typeof Math.tanh === 'function',
      'acosh': () => typeof Math.acosh === 'function',
      'asinh': () => typeof Math.asinh === 'function',
      'atanh': () => typeof Math.atanh === 'function',
      'hypot': () => typeof Math.hypot === 'function',
      'trunc': () => typeof Math.trunc === 'function',
      'sign': () => typeof Math.sign === 'function',
      'cbrt': () => typeof Math.cbrt === 'function'
    },

    'Object': {
      'assign': () => typeof Object.assign === 'function',
      'create': () => typeof Object.create === 'function',
      'entries': () => typeof Object.entries === 'function',
      'getPrototypeOf': () => typeof Object.getPrototypeOf === 'function',
      'is': () => typeof Object.is === 'function',
      'keys': () => typeof Object.keys === 'function',
      'setPrototypeOf': () => typeof Object.setPrototypeOf === 'function',
      'values': () => typeof Object.values === 'function',
    },

    'String': {
      'fromCodePoint': () => typeof String.fromCodePoint === 'function',
      'codePointAt': () => typeof ''.codePointAt === 'function',
      'endsWith': () => typeof ''.endsWith === 'function',
      'includes': () => typeof ''.includes === 'function',
      'localeCompare': () => typeof ''.localeCompare === 'function',
      'normalize': () => typeof ''.normalize === 'function',
      'padEnd': () => typeof ''.padEnd === 'function',
      'padStart': () => typeof ''.padStart === 'function',
      'repeat': () => typeof ''.repeat === 'function',
      'search': () => typeof ''.search === 'function',
      'startsWith': () => typeof ''.startsWith === 'function',
      'trim': () => typeof ''.trim === 'function',
      'raw': () => typeof String.raw === 'function',
    },

    'Function': {
      'bind': () => typeof (function() {}).bind === 'function'
    },

    'JSON': {
      'JSON': () => 'JSON' in global,
      'parse': () => 'JSON' in global && typeof JSON.parse === 'function',
      'stringify': () => 'JSON' in global && typeof JSON.stringify === 'function'
    },

    'Date': {
      'now': () => typeof Date.now === 'function',
      'toISOString': () => typeof (new Date()).toISOString === 'function',
      'toJSON': () => typeof (new Date()).toJSON === 'function',
    },

    'ArrayBufferView': () => typeof global.ArrayBufferView === 'function',
    'Animation': () => typeof global.Animation === 'function',
    'AnimationEvent': () => typeof global.AnimationEvent === 'function',
    'AnimationTimeline': () => typeof global.AnimationTimeline === 'function',
    'AudioBuffer': () => typeof global.AudioBuffer === 'function',
    'AudioBufferSourceNode': () => typeof global.AudioBufferSourceNode === 'function',
    'AudioContext': () => typeof global.AudioContext === 'function',
    'AudioDestinationNode': () => typeof global.AudioDestinationNode === 'function',
    'AudioListener': () => typeof global.AudioListener === 'function',
    'AudioNode': () => typeof global.AudioNode === 'function',
    'AudioParam': () => typeof global.AudioParam === 'function',
    'Blob': () => typeof global.Blob === 'function',
    'BlobEvent': () => typeof global.BlobEvent === 'function',

    'Canvas': {
      'Canvas': () => typeof global.HTMLCanvasElement === 'function',
      'getContext': () => 'getContext' in global.document.createElement('canvas')
    },

    'Crypto': () => typeof global.Crypto === 'function',
    'CryptoKey': () => typeof global.CryptoKey === 'function',
    'CustomEvent': () => typeof global.CustomEvent === 'function',
    'dataset': () => 'dataset' in global.document.body,
    'fetch': () => typeof global.fetch === 'function',
    'FormData': () => typeof global.FormData === 'function',
    'Headers': () => typeof global.Headers === 'function',

    'Intl': {
      'Intl': () => 'Intl' in global,
      'Collator': () => 'Intl' in global && typeof Intl.Collator === 'function',
      'DateTimeFormat': () => 'Intl' in global && typeof Intl.DateTimeFormat === 'function',
      'NumberFormat': () => 'Intl' in global && typeof Intl.NumberFormat === 'function'
    },

    'indexedDB': () => 'indexedDB' in global,
    'InputEvent': () => typeof global.InputEvent === 'function',
    'KeyboardEvent': () => typeof global.KeyboardEvent === 'function',
    'MouseEvent': () => typeof global.MouseEvent === 'function',
    'Request': () => typeof global.Request === 'function',
    'Response': () => typeof global.Response === 'function',
    'Map': () => typeof global.Map === 'function',
    'Promise': () => typeof global.Promise === 'function',
    'Proxy': () => typeof global.Proxy === 'function',
    'Reflect': () => typeof global.Reflect === 'function',
    'Set': () => typeof global.Set === 'function',
    'Symbol': () => typeof global.Symbol === 'function',
    'WeakMap': () => typeof global.WeakMap === 'function',
    'WeakSet': typeof global.WeakSet === 'function'
  };
};
