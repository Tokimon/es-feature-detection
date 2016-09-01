// Dataset (data-* attribute)
document.body.dataset.someInput = 'test';
const body = document.body;
const inp = body.dataset.someInput;

const somedate = new Date();
const finaldate = somedate;
const somestring = 'string';

const json = toJSON('{ a: 1 }');
const json2 = $().toJSON('{ a: 1 }');
const json3 = obj.toJSON('{ a: 1 }');
const jsonDate = (new Date()).toJSON();
const jsonDate2 = finaldate.toJSON();

const isNull = Object.is(null, null);
