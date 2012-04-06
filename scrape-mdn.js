var jsdom = require('jsdom')
  , fs = require('fs')
  , mdn = require("./pull-mdn");

function scrapeCssPropertyDocs(window) {
  var $ = window.jQuery;
  return $("#section_1 > p").first().html();
}

function startScrape(window) {
  var properties = {};
  mdn.cssProperties.forEach(function(name) {
    var html = fs.readFileSync(mdn.cachedCssPropertyFilename(name), "utf8");

    window.document.documentElement.innerHTML = html;

    var docs = scrapeCssPropertyDocs(window);
    if (docs) {
      properties[name] = docs;
      console.log("found docs for " + name + " (" + docs.length +
                  " characters)");
    } else {
      console.log("ERROR: no docs found for " + name);
    }
  });
  var jsonFilename = 'css-properties.json';
  console.log("Done. Writing " + jsonFilename + ".");
  fs.writeFileSync(jsonFilename, JSON.stringify(properties, null, "  "));
  // Not sure why, but node will hang unless we do this...
  process.exit(0);
}

jsdom.env({
  html: '<!DOCTYPE html><meta charset="utf-8"><title></title><p></p>',
  scripts: ['jquery-1.7.1.min.js']
}, function (err, window) {
  if (!err) {
    process.nextTick(function() { startScrape(window); });
  } else {
    console.log("ERROR", name, err);
  }
});
