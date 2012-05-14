var jsdom = require('jsdom')
  , fs = require('fs')
  , mdn = require("./pull-mdn");

function scrapeFirstSectionParagraph(window) {
  var $ = window.jQuery;
  return $("#section_1 > p").first().html();
}

function scrapeElementDocs(window) {
  var desc = scrapeFirstSectionParagraph(window);
  if (!desc)
    return;
  var docs = {
    desc: desc,
    attrs: {}
  };
  var $ = window.jQuery;
  $("a[name^=attr-]").each(function() {
    var name = $(this).text();
    var desc = $(this).closest("dt").next("dd").text();
    var firstSentenceIndex = desc.indexOf(". ");
    
    if (firstSentenceIndex != -1)
      desc = desc.slice(0, firstSentenceIndex + 1);
    
    docs.attrs[name] = desc;
  });
  return docs;
}

var scrapers = {
  html: function(window) {
    var elements = {};
    
    mdn.htmlElements.forEach(function(name) {
      var html = fs.readFileSync(mdn.cachedHtmlElementFilename(name), "utf8");

      window.document.documentElement.innerHTML = html;

      var docs = scrapeElementDocs(window);
      if (docs) {
        elements[name] = docs;
        var attrCount = 0;
        for (var attrName in docs.attrs)
          attrCount++;
        console.log("found docs for " + name + " (" + docs.desc.length +
                    " character desc, " + attrCount + " attrs)");
      } else {
        console.log("ERROR: no docs found for " + name);
      }
    });
    var jsonFilename = 'html-elements.json';
    console.log("Done. Writing " + jsonFilename + ".");
    fs.writeFileSync(jsonFilename, JSON.stringify(elements, null, "  "));
  },
  css: function(window) {
    var properties = {};
    
    mdn.cssProperties.forEach(function(name) {
      var html = fs.readFileSync(mdn.cachedCssPropertyFilename(name), "utf8");

      window.document.documentElement.innerHTML = html;

      var docs = scrapeFirstSectionParagraph(window);
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
  }
};

function startScrape(window) {
  var scrapersToRun = process.argv[2] || "html,css";

  scrapersToRun.split(',').forEach(function(name) {
    console.log("scraping " + name + " docs.");
    scrapers[name](window);
  });
  // Not sure why, but node will hang unless we do this...
  process.exit(0);
}

jsdom.env({
  html: '<!DOCTYPE html><meta charset="utf-8"><title></title><p></p>',
  scripts: ['jquery-1.7.1.min.js']
}, function (err, window) {
  if (!err) {
    // If our current function throws an exception, it doesn't get
    // logged to stderr because of an apparent bug in jsdom, so we'll
    // run the "real" function on the next tick.
    process.nextTick(function() { startScrape(window); });
  } else {
    console.log("ERROR", name, err);
  }
});
