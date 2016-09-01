'use strict';

const readline = require('readline');
const fs = require('fs');
const nPath = require('path');

function readFeatureTestLines(output) {
  return readline.createInterface({
    input: fs.createReadStream(nPath.join(__dirname, '../browser/features.js')),
    historySize: 0
  });
}

function lineParser() {
  let currObj;
  return (line) => {
    let m = /^\s+'([^']+)':\s+(.)/.exec(line);

    if(!m) {
      const res = currObj ? { closing: true, object: currObj } : null;
      currObj = null;
      return res;
    }

    const name = m[1];

    if(m[2] === '{') {
      currObj = name;
      return { opening: true, object: name };
    }

    if(!currObj) {
      return { object: name };
    }

    return { object: currObj, method: name };
  };
}


function composeFeatures(features) {
  return new Promise((resolve) => {
    const lines = [];
    const liner = readFeatureTestLines();
    const parseLine = lineParser();

    const methods = new Set();
    const objects = features.reduce((set, feature) => {
      const parts = feature.split('.');
      set.add(parts[0]);
      if(parts[1]) { methods.add(feature); }
      return set;
    }, new Set());

    liner.on('line', (line) => {
      const res = parseLine(line);

      if(
        ((res &&
        (
          objects.has(res.object)
          && (
            (res.method && methods.has(`${res.object}.${res.method}`)
            || !res.method)
          )
        ))
        || !res)
        && !/^\s*$/.test(line)
      ) {
        lines.push(line);
      }
    });

    liner.on('close', () => resolve({features: features, lines: lines}));
  });
}

function readFeatures() {
  return new Promise((resolve) => {
    const objects = new Set();
    const methods = new Map();

    const liner = readFeatureTestLines();
    const parseLine = lineParser();

    let waitForClosing;

    liner.on('line', (line) => {
      const res = parseLine(line);

      if(!res) { return; }

      if(res.opening) {
        waitForClosing = true;
      } else if(res.closing) {
        waitForClosing = false;
      } else if(waitForClosing && res.object === res.method) {
        objects.add(res.object);
      } else if(res.method) {
        const objList = methods.get(res.method) || [];
        objList.push(res.object);
        methods.set(res.method, objList);
      } else if(res.object) {
        objects.add(res.object);
      }
    });

    liner.on('close', () => resolve({objects: objects, methods: methods}));
  });

}

module.exports.compose = composeFeatures;
module.exports.read = readFeatures;
