export default function features() {
  return {
    'Array': {
      'from': typeof Array.from === 'function',
      'isArray': typeof Array.isArray === 'function',
      'of': typeof Array.of === 'function',
      'concat': typeof [].concat === 'function',
      'copyWithin': typeof [].copyWithin === 'function',
      'entries': typeof [].entries === 'function',
      'every': typeof [].every === 'function',
      'fill': typeof [].fill === 'function',
      'filter': typeof [].filter === 'function',
      'find': typeof [].find === 'function',
      'findIndex': typeof [].findIndex === 'function',
      'forEach': typeof [].forEach === 'function',
      'includes': typeof [].includes === 'function',
      'indexOf': typeof [].indexOf === 'function',
      'keys': typeof [].keys === 'function',
      'lastIndexOf': typeof [].lastIndexOf === 'function',
      'map': typeof [].map === 'function',
      'reduce': typeof [].reduce === 'function',
      'reduceRight': typeof [].reduceRight === 'function',
      'some': typeof [].some === 'function',
      'values': typeof [].values === 'function'
    },

    'Math': {
      'imul': typeof Math.imul === 'function',
      'clz32': typeof Math.clz32 === 'function',
      'fround': typeof Math.fround === 'function',
      'log10': typeof Math.log10 === 'function',
      'log2': typeof Math.log2 === 'function',
      'log1p': typeof Math.log1p === 'function',
      'expm1': typeof Math.expm1 === 'function',
      'cosh': typeof Math.cosh === 'function',
      'sinh': typeof Math.sinh === 'function',
      'tanh': typeof Math.tanh === 'function',
      'acosh': typeof Math.acosh === 'function',
      'asinh': typeof Math.asinh === 'function',
      'atanh': typeof Math.atanh === 'function',
      'hypot': typeof Math.hypot === 'function',
      'trunc': typeof Math.trunc === 'function',
      'sign': typeof Math.sign === 'function',
      'cbrt': typeof Math.cbrt === 'function'
    },

    'Object': {
      'assign': typeof Object.assign === 'function',
      'create': typeof Object.create === 'function',
      'entries': typeof Object.entries === 'function',
      'getPrototypeOf': typeof Object.getPrototypeOf === 'function',
      'is': typeof Object.is === 'function',
      'keys': typeof Object.keys === 'function',
      'setPrototypeOf': typeof Object.setPrototypeOf === 'function',
      'values': typeof Object.values === 'function',
    },

    'String': {
      'fromCodePoint': typeof String.fromCodePoint === 'function',
      'codePointAt': typeof ''.codePointAt === 'function',
      'endsWith': typeof ''.endsWith === 'function',
      'includes': typeof ''.includes === 'function',
      'localeCompare': typeof ''.localeCompare === 'function',
      'normalize': typeof ''.normalize === 'function',
      'padEnd': typeof ''.padEnd === 'function',
      'padStart': typeof ''.padStart === 'function',
      'repeat': typeof ''.repeat === 'function',
      'search': typeof ''.search === 'function',
      'startsWith': typeof ''.startsWith === 'function',
      'trim': typeof ''.trim === 'function',
      'raw': typeof String.raw === 'function',
    },

    'Function': {
      'bind': typeof (function() {}).bind === 'function'
    },

    'JSON': {
      'JSON': 'JSON' in window,
      'parse': 'JSON' in window && typeof JSON.parse === 'function',
      'stringify': 'JSON' in window && typeof JSON.stringify === 'function'
    },

    'Date': {
      'now': typeof Date.now === 'function',
      'toISOString': typeof (new Date()).toISOString === 'function',
      'toJSON': typeof (new Date()).toJSON === 'function',
    },

    'ArrayBufferView': typeof window.ArrayBufferView === 'function',
    'Animation': typeof window.Animation === 'function',
    'AnimationEvent': typeof window.AnimationEvent === 'function',
    'AnimationTimeline': typeof window.AnimationTimeline === 'function',
    'AudioBuffer': typeof window.AudioBuffer === 'function',
    'AudioBufferSourceNode': typeof window.AudioBufferSourceNode === 'function',
    'AudioContext': typeof window.AudioContext === 'function',
    'AudioDestinationNode': typeof window.AudioDestinationNode === 'function',
    'AudioListener': typeof window.AudioListener === 'function',
    'AudioNode': typeof window.AudioNode === 'function',
    'AudioParam': typeof window.AudioParam === 'function',
    'Blob': typeof window.Blob === 'function',
    'BlobEvent': typeof window.BlobEvent === 'function',

    'Canvas': {
      'Canvas': typeof window.HTMLCanvasElement === 'function',
      'getContext': 'getContext' in window.document.createElement('canvas')
    },

    'Crypto': typeof window.Crypto === 'function',
    'CryptoKey': typeof window.CryptoKey === 'function',
    'CustomEvent': typeof window.CustomEvent === 'function',
    'dataset': 'dataset' in window.document.body,
    'fetch': typeof window.fetch === 'function',
    'FormData': typeof window.FormData === 'function',
    'Headers': typeof window.Headers === 'function',

    'Intl': {
      'Intl': 'Intl' in window,
      'Collator': 'Intl' in window && typeof Intl.Collator === 'function',
      'DateTimeFormat': 'Intl' in window && typeof Intl.DateTimeFormat === 'function',
      'NumberFormat': 'Intl' in window && typeof Intl.NumberFormat === 'function'
    },

    'indexedDB': 'indexedDB' in window,
    'InputEvent': typeof window.InputEvent === 'function',
    'KeyboardEvent': typeof window.KeyboardEvent === 'function',
    'MouseEvent': typeof window.MouseEvent === 'function',
    'Request': typeof window.Request === 'function',
    'Response': typeof window.Response === 'function',
    'Map': typeof window.Map === 'function',
    'Promise': typeof window.Promise === 'function',
    'Proxy': typeof window.Proxy === 'function',
    'Reflect': typeof window.Reflect === 'function',
    'Set': typeof window.Set === 'function',
    'Symbol': typeof window.Symbol === 'function',
    'WeakMap': typeof window.WeakMap === 'function',
    'WeakSet': typeof window.WeakSet === 'function'
  };
}
