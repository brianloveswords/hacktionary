var fs = require('fs');

function load(filename) {
  return JSON.parse(fs.readFileSync(filename));
}

var htmlElements = load('html-elements.json'),
    filename = "webxray-strings.json",
    strings = {
      "html-element-docs": {},
      "html-attribute-docs": {},
      "css-property-docs": load('css-properties.json')
    };

for (var name in htmlElements) {
  strings["html-element-docs"][name] = htmlElements[name].desc;
  for (var attr in htmlElements[name].attrs) {
    var attrKey = name + "." + attr;
    strings["html-attribute-docs"][attrKey] = htmlElements[name].attrs[attr];
  }
}

console.log("Writing " + filename + ".");

fs.writeFileSync(filename, JSON.stringify(strings, null, "  "));
