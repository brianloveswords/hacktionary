var fs = require('fs'),
    path = require('path'),
    request = require('request');

exports.cacheDir = path.join(__dirname, 'mdn-cache');

// Taken from:
// https://github.com/hackasaurus/webxray/blob/master/src/style-info.js
exports.cssProperties = [
  "background-attachment",
  "background-clip",
  "background-color",
  "background-image",
  "background-origin",
  "background-position",
  "background-repeat",
  "background-size",
  "font-family",
  "font-size",
  "font-style",
  "font-variant",
  "font-weight",
  "height",
  "list-style-image",
  "list-style-position",
  "list-style-type",
  "min-height",
  "min-width",
  "text-align",
  "text-anchor",
  "text-decoration",
  "text-indent",
  "text-overflow",
  "text-rendering",
  "text-shadow",
  "text-transform",
  "top",
  "left",
  "bottom",
  "right",
  "color",
  "clear",
  "cursor",
  "direction",
  "display",
  "position",
  "float",
  "letter-spacing",
  "line-height",
  "opacity",
  "visibility",
  "white-space",
  "width",
  "vertical-align",
  "word-spacing",
  "word-wrap",
  "z-index"
].sort();

exports.cachedPropertyFilename = function(propertyName) {
  return path.join(exports.cacheDir, propertyName + '.html');
};

exports.mdnUrl = function(propertyName) {
  return "https://developer.mozilla.org/en/CSS/" + propertyName;
};

if (!module.parent) {
  console.log("fetching CSS documentation.");
  exports.cssProperties.forEach(function(name) {
    var req = request(exports.mdnUrl(name), function(err, response, body) {
      if (!err) {
        var filename = exports.cachedPropertyFilename(name);
        console.log("writing", filename);
        fs.writeFileSync(filename, body);
      } else {
        console.log("ERROR", name, err);
      }
    });
  });
}
