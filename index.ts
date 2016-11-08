import * as xml2js from 'xml2js';

console.dir('hello world');

var xml = "<root>Hello xml2js!</root>"
xml2js.parseString(xml, function (err, result) {
    console.dir(result);
});