var jsdom = require('jsdom')
  , fs = require('fs')
  , _ = require('underscore');

var fileData = fs.readFileSync('./index.html').toString()
  , jquery = fs.readFileSync('./jquery-1.7.1.min.js').toString();


jsdom.env({
  html: fileData,
  src : [jquery]
}, function (err, window) {
  var doc = window.document
    , dl = doc.getElementsByTagName('dl');
  
  var elements = {};
  _.each(dl, function (el) {
    elements[el.getElementsByTagName('dt')[0].firstChild.nodeValue] =
      el.getElementsByTagName('dd')[0].innerHTML;
  });

  fs.writeFileSync('elements.json', JSON.stringify(elements));
})
