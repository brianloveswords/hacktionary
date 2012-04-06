var jsdom = require('jsdom')
  , fs = require('fs')
  , mdn = require("./pull-mdn");

var properties = {};
var propertiesLeft = mdn.cssProperties.slice();

function processNextProperty() {
  if (propertiesLeft.length) {
    var name = propertiesLeft.pop();
    var filename = mdn.cachedPropertyFilename(name);
    var fileData = fs.readFileSync(filename).toString();

    console.log("scraping", name);

    jsdom.env({
      html: fileData,
      scripts: ['jquery-1.7.1.min.js']
    }, function (err, window) {
      if (!err) {
        var $ = window.jQuery;
        var docs = $("#section_1 > p").first().html();
        if (docs) {
          properties[name] = docs;
          console.log("found docs for " + name + " (" + docs.length +
                      " characters)");
        } else {
          console.log("ERROR: no docs found for " + name);
        }
        processNextProperty();
      } else {
        console.log("ERROR", name, err);
      }
    });
  } else {
    var jsonFilename = 'css-properties.json';
    console.log("Done. Writing " + jsonFilename + ".");
    fs.writeFileSync(jsonFilename, JSON.stringify(properties, null, "  "));
  }
}

processNextProperty();
