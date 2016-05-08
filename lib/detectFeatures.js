'use strict';

const fs = require('fs');
const globby = require('globby');

const acorn = require("acorn/dist/acorn_loose");
const walker = require("acorn/dist/walk");



// Prepare the walk visitors and handlers
const visitors = {};
const handlers = Object.assign({}, walker.base);
Object.keys(walker.base).forEach((key) => visitors[key] = visitNode);



// Get the browser test object
const featureParser = require('./featureTestParser');

// Declare the initial mappings
let featuresUsed = new Set();
let objects, methods;




// Parser methods that determines which methods we are actually using
// (compared to the features test defined in 'features')
function visitNode(node) {
  if('MemberExpression' === node.type) {
    const propName = node.property && node.property.name;
    if(!node.object || !objects.has(propName)) { return; }
    return featuresUsed.add(propName);
  }

  const caller = node.callee;

  // We only care about objects, method calls and some properties
  if(!caller || ['NewExpression', 'CallExpression'].indexOf(node.type) < 0) {
    return;
  }

  const obj = caller.object;
  const objName = obj ? obj.name : caller.name;

  // Only add the test for the object if it is in the objects list
  if(objects.has(objName)) { featuresUsed.add(objName); }

  const prop = caller.property;

  // If it is just a function call or if the property is not one we need to
  // check for, then just move on to the next node
  if(!prop || !methods.has(prop.name)) { return; }

  const method = prop.name;
  const objNames = methods.get(method);

  // For arrays we check is we need to test for the function
  if(obj.type === 'ArrayExpression') {
    if(objNames.indexOf('Array') > -1) { featuresUsed.add(`Array.${method}`); }
  } else {
    // Otherwise it is unclear what kind of Object we are deaeling with so just
    // add the check for all objects with this method
    objNames.forEach((objName) => {
      if(objects.has(objName)) { featuresUsed.add(objName); }
      featuresUsed.add(`${objName}.${method}`);
    });
  }
}




// Parse a given file for any features used
function parseFile(filePath) {
  return (new Promise((resolve, reject) => {
    // first read the file
    fs.readFile(filePath, (err, content) => err? reject(err) : resolve(content));
  }))
    // Then parse the content
   .then((content) => acorn.parse_dammit(content.toString()))
   // Then walk the AST
   .then((ast) => walker.simple(ast, visitors, handlers));
}





module.exports = function detectFeatures(globs) {
  // Clear the tests before parsing the files
  featuresUsed.clear();

  return featureParser.read()
    // Get the files requested
    .then((feats) => {
      objects = feats.objects;
      methods = feats.methods;
      return globby(globs);
    })
    // Parse them
    .then((files) => Promise.all(files.map((file) => parseFile(file))))
    // Return the test results
    .then(() => Array.from(featuresUsed));
}
