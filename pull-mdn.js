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
exports.webxrayCssProperties = [
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

// Taken from:
// https://github.com/toolness/slowparse/blob/gh-pages/slowparse.js
exports.cssProperties = ["alignment-adjust","alignment-baseline","animation","animation-delay","animation-direction",
                "animation-duration","animation-iteration-count","animation-name","animation-play-state",
                "animation-timing-function","appearance","azimuth","backface-visibility","background",
                "background-attachment","background-clip","background-color","background-image","background-origin",
                "background-position","background-repeat","background-size","baseline-shift","binding","bleed",
                "bookmark-label","bookmark-level","bookmark-state","bookmark-target","border","border-bottom",
                "border-bottom-color","border-bottom-left-radius","border-bottom-right-radius","border-bottom-style",
                "border-bottom-width","border-collapse","border-color","border-image","border-image-outset",
                "border-image-repeat","border-image-slice","border-image-source","border-image-width",
                "border-left","border-left-color","border-left-style","border-left-width","border-radius",
                "border-right","border-right-color","border-right-style","border-right-width","border-spacing",
                "border-style","border-top","border-top-color","border-top-left-radius","border-top-right-radius",
                "border-top-style","border-top-width","border-width","bottom","box-decoration-break","box-shadow",
                "box-sizing","break-after","break-before","break-inside","caption-side","clear","clip","color",
                "color-profile","column-count","column-fill","column-gap","column-rule","column-rule-color",
                "column-rule-style","column-rule-width","column-span","column-width","columns","content",
                "counter-increment","counter-reset","crop","cue","cue-after","cue-before","cursor","direction",
                "display","dominant-baseline","drop-initial-after-adjust","drop-initial-after-align",
                "drop-initial-before-adjust","drop-initial-before-align","drop-initial-size","drop-initial-value",
                "elevation","empty-cells","fit","fit-position","flex-align","flex-flow","flex-line-pack",
                "flex-order","flex-pack","float","float-offset","font","font-family","font-size","font-size-adjust",
                "font-stretch","font-style","font-variant","font-weight","grid-columns","grid-rows",
                "hanging-punctuation","height","hyphenate-after","hyphenate-before","hyphenate-character",
                "hyphenate-lines","hyphenate-resource","hyphens","icon","image-orientation","image-rendering",
                "image-resolution","inline-box-align","left","letter-spacing","line-break","line-height",
                "line-stacking","line-stacking-ruby","line-stacking-shift","line-stacking-strategy","list-style",
                "list-style-image","list-style-position","list-style-type","margin","margin-bottom","margin-left",
                "margin-right","margin-top","marker-offset","marks","marquee-direction","marquee-loop",
                "marquee-play-count","marquee-speed","marquee-style","max-height","max-width","min-height",
                "min-width","move-to","nav-down","nav-index","nav-left","nav-right","nav-up","opacity","orphans",
                "outline","outline-color","outline-offset","outline-style","outline-width","overflow",
                "overflow-style","overflow-wrap","overflow-x","overflow-y","padding","padding-bottom",
                "padding-left","padding-right","padding-top","page","page-break-after","page-break-before",
                "page-break-inside","page-policy","pause","pause-after","pause-before","perspective",
                "perspective-origin","phonemes","pitch","pitch-range","play-during","position","presentation-level",
                "punctuation-trim","quotes","rendering-intent","resize","rest","rest-after","rest-before",
                "richness","right","rotation","rotation-point","ruby-align","ruby-overhang","ruby-position",
                "ruby-span","size","speak","speak-header","speak-numeral","speak-punctuation","speech-rate",
                "stress","string-set","tab-size","table-layout","target","target-name","target-new",
                "target-position","text-align","text-align-last","text-decoration","text-decoration-color",
                "text-decoration-line","text-decoration-skip","text-decoration-style","text-emphasis",
                "text-emphasis-color","text-emphasis-position","text-emphasis-style","text-height","text-indent",
                "text-justify","text-outline","text-shadow","text-space-collapse","text-transform",
                "text-underline-position","text-wrap","top","transform","transform-origin","transform-style",
                "transition","transition-delay","transition-duration","transition-property",
                "transition-timing-function","unicode-bidi","vertical-align","visibility","voice-balance",
                "voice-duration","voice-family","voice-pitch","voice-pitch-range","voice-rate","voice-stress",
                "voice-volume","volume","white-space","widows","width","word-break","word-spacing","word-wrap",
                "z-index"];

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
