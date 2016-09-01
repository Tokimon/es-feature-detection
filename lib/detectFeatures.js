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
let assignments = new Map();
let objects, methods;




// Parser methods that determines which methods we are actually using
// (compared to the features test defined in 'features')
function visitNode(node) {
  if('MemberExpression' === node.type) {
    const propName = node.property && node.property.name;
    if(!node.object || !objects.has(propName)) { return; }
    return featuresUsed.add(propName);
  }

  // Log the various object assignments to determine the Object type of the variables
  if('AssignmentExpression' === node.type) {
    let type = node.right.name;

    // Object creation assignment (probably mostly Native objects)
    if(node.right.type === 'NewExpression') {
      type = node.right.callee.name;
    }

    if(type) {
      while(assignments.has(type)) { type = assignments.get(type); }
      assignments.set(node.left.name, type);
    }

    return;
  }

  const caller = node.callee;

  // We only care about objects, method calls and some properties
  if(!caller || ['NewExpression', 'CallExpression'].indexOf(node.type) < 0) {
    return;
  }

  const obj = caller.object;
  const prop = caller.property;

  // Function call have neither object nor property
  if(!obj && !prop) {
    if(objects.has(caller.name)) { featuresUsed.add(caller.name); }
    return;
  }

  // If we need to test for the object, add it to the list
  if(objects.has(obj.name)) { featuresUsed.add(obj.name); }

  // If it is just a function call or if the property is not one we need to
  // check for, then just move on to the next node
  if(!prop || (prop && !methods.has(prop.name))) { return; }

  const method = prop.name;
  const methodObject = assignments.get(obj.name) || obj.name;

  // For arrays we need to test for the function
  if(obj.type === 'ArrayExpression') {
    if(objects.has('Array')) { featuresUsed.add(`Array.${method}`); }

  // If the determined object has the method in question, then add that check
  } else if(methodObject && methods.get(method).indexOf(methodObject) > -1) {
    featuresUsed.add(`${methodObject}.${method}`);
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
