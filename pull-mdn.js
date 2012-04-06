var fs = require('fs'),
    path = require('path'),
    request = require('request');

function exists(filename) {
  try {
    fs.statSync(filename);
    return true;
  } catch (e) {
    if (e.code == 'ENOENT')
      return false;
    throw e;
  }
}

exports.cacheDir = path.join(__dirname, 'mdn-cache');

// Taken from elements.json
exports.htmlElements = [
  "a",
  "abbr",
  "address",
  "area",
  "article",
  "aside",
  "audio",
  "b",
  "base",
  "bdi",
  "bdo",
  "blockquote",
  "body",
  "br",
  "button",
  "canvas",
  "caption",
  "cite",
  "code",
  "col",
  "colgroup",
  "command",
  "datalist",
  "dd",
  "del",
  "details",
  "dfn",
  "div",
  "dl",
  "dt",
  "doctype",
  "em",
  "embed",
  "fieldset",
  "figcaption",
  "figure",
  "footer",
  "form",
  "h1",
  "head",
  "header",
  "hgroup",
  "hr",
  "html",
  "i",
  "iframe",
  "img",
  "input",
  "ins",
  "kbd",
  "keygen",
  "label",
  "legend",
  "li",
  "link",
  "map",
  "mark",
  "menu",
  "meta",
  "meter",
  "nav",
  "noscript",
  "object",
  "ol",
  "optgroup",
  "option",
  "output",
  "p",
  "param",
  "pre",
  "progress",
  "q",
  "rp",
  "rt",
  "ruby",
  "s",
  "samp",
  "script",
  "section",
  "select",
  "small",
  "source",
  "span",
  "strong",
  "style",
  "sub",
  "summary",
  "sup",
  "table",
  "tbody",
  "td",
  "textarea",
  "tfoot",
  "th",
  "thead",
  "time",
  "title",
  "tr",
  "track",
  "u",
  "ul",
  "var",
  "video",
  "wbr"
];

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

exports.cachedHtmlElementFilename = function(elementName) {
  return path.join(exports.cacheDir, 'html-' + elementName + '.html');
};

exports.cachedCssPropertyFilename = function(propertyName) {
  return path.join(exports.cacheDir, 'css-' + propertyName + '.html');
};

exports.mdnHtmlUrl = function(propertyName) {
  return "https://developer.mozilla.org/en/HTML/Element/" + propertyName;
};

exports.mdnCssUrl = function(propertyName) {
  return "https://developer.mozilla.org/en/CSS/" + propertyName;
};

function cachePage(options) {
  var filename = options.filename;
  var url = options.url;
  if (exists(filename)) {
    console.log("docs for " + url + " are in cache, skipping.");
    return;
  };
  var req = request(url, function(err, response, body) {
    if (!err) {
      console.log("writing", filename);
      fs.writeFileSync(filename, body);
    } else {
      console.log("ERROR", url, err);
    }
  });
}

exports.recache = function() {
  console.log("fetching CSS and HTML documentation.");
  exports.cssProperties.forEach(function(name) {
    cachePage({
      filename: exports.cachedCssPropertyFilename(name),
      url: exports.mdnCssUrl(name)
    });
  });
  exports.htmlElements.forEach(function(name) {
    cachePage({
      filename: exports.cachedHtmlElementFilename(name),
      url: exports.mdnHtmlUrl(name)
    });
  });
};

if (!module.parent)
  exports.recache();
