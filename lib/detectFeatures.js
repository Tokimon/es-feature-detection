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
let variables = new Map();
let objects, methods;


function flatten(arr) {
  return arr.reduce((a, v) => {
    if(!Array.isArray(v)) { a.push(v); }
    else { a = a.concat(flatten(v)); }
    return a;
  }, []);
}

function nodeName(node) {
  let name = null;

  if(node.name) {
    name = node.name;
  } else if(node.type === 'MemberExpression') {
    name = node.property ? node.property.name : null;
  }

  return name;
}

// We register an array of possible values for a given variable
// - This doesn't look at context or other as we just want potential object names
function registerVarVal(varNode, valNode) {
  if(!varNode || !valNode) { return; }

  const isNew = valNode.type === 'NewExpression';
  const isVar = valNode.type === 'Identifier';

  const varName = nodeName(varNode);
  let valName = nodeName(isNew ? valNode.callee : valNode);

  if(!(isVar || isNew) || !valName) { return; }

  const savedVals = variables.get(varName) || [];
  valName = (valName ? [valName] : []).filter((v) => v !== varName);
  variables.set(varName, savedVals.concat(valName));
}

// Get Variable values so we can match for object names
function getVarVal(varName) {
  const _var = variables.get(varName);
  if(!_var) { return null; }

  return flatten(_var.map((val) => {
    if(!variables.has(val)) { return val; }
    return getVarVal(val);
  }));
}


// Parser methods that determines which methods we are actually using
// (compared to the features test defined in 'features')
function visitNode(node) {
  if('MemberExpression' === node.type) {
    const propName = nodeName(node)
    if(!propName || !node.object || !objects.has(propName)) { return; }
    return featuresUsed.add(propName);
  }

  if('VariableDeclarator' === node.type) {
    return registerVarVal(node.id, node.init);
  }

  // Log the various object assignments to determine the Object type of the variables
  if('AssignmentExpression' === node.type) {
    return registerVarVal(node.left, node.right);
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

  // For arrays we need to test for the function
  if(obj.type === 'ArrayExpression') {
    if(objects.has('Array')) { featuresUsed.add(`Array.${method}`); }

  // If the determined object has the method in question, then add that check
  } else {
    const methodObjects = methods.get(method);
    let varObjects = getVarVal(obj.name) || obj.name;
    if(!varObjects) { return; }
    if(!Array.isArray(varObjects)) { varObjects = [varObjects]; }

    varObjects
      .filter((objName) => methodObjects.indexOf(objName) > -1)
      .forEach((objName) => featuresUsed.add(`${objName}.${method}`));
  }
}




// Parse a given file for any features used
function parseFile(filePath) {
  return (new Promise((resolve, reject) => {
    // first read the file
    fs.readFile(filePath, (err, content) => err? reject(err) : resolve(content));
  }))
    // Then parse the content
   .then((content) => acorn.parse_dammit(content.toString(), {}))
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
