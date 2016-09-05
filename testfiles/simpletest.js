// Dataset (data-* attribute)
document.body.dataset.someInput = 'test';
const body = document.body;
const inp = body.dataset.someInput;

const somedate = new Date();
const finaldate = somedate;
const somestring = 'string';

const obj = { toJSON() {} }

const json = toJSON('{ a: 1 }');
const json2 = $().toJSON('{ a: 1 }');
const json3 = obj.toJSON('{ a: 1 }');
const jsonDate = (new Date()).toJSON();
const jsonDate2 = finaldate.toJSON();

const isNull = Object.is(null, null);

let Index, Source, position = 12;
let date;

date = new Date();

var abort = function () {
  Index = Source = null;
  throw SyntaxError();
};

Index = position;

(function() {
  var Index = 12;
})()
