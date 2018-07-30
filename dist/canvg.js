var canvg = (function (exports) {
  'use strict';

  var asyncToGenerator = function (fn) {
    return function () {
      var gen = fn.apply(this, arguments);
      return new Promise(function (resolve, reject) {
        function step(key, arg) {
          try {
            var info = gen[key](arg);
            var value = info.value;
          } catch (error) {
            reject(error);
            return;
          }

          if (info.done) {
            resolve(value);
          } else {
            return Promise.resolve(value).then(function (value) {
              step("next", value);
            }, function (err) {
              step("throw", err);
            });
          }
        }

        return step("next");
      });
    };
  };

  var classCallCheck = function (instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  };

  var createClass = function () {
    function defineProperties(target, props) {
      for (var i = 0; i < props.length; i++) {
        var descriptor = props[i];
        descriptor.enumerable = descriptor.enumerable || false;
        descriptor.configurable = true;
        if ("value" in descriptor) descriptor.writable = true;
        Object.defineProperty(target, descriptor.key, descriptor);
      }
    }

    return function (Constructor, protoProps, staticProps) {
      if (protoProps) defineProperties(Constructor.prototype, protoProps);
      if (staticProps) defineProperties(Constructor, staticProps);
      return Constructor;
    };
  }();

  var get = function get(object, property, receiver) {
    if (object === null) object = Function.prototype;
    var desc = Object.getOwnPropertyDescriptor(object, property);

    if (desc === undefined) {
      var parent = Object.getPrototypeOf(object);

      if (parent === null) {
        return undefined;
      } else {
        return get(parent, property, receiver);
      }
    } else if ("value" in desc) {
      return desc.value;
    } else {
      var getter = desc.get;

      if (getter === undefined) {
        return undefined;
      }

      return getter.call(receiver);
    }
  };

  var inherits = function (subClass, superClass) {
    if (typeof superClass !== "function" && superClass !== null) {
      throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);
    }

    subClass.prototype = Object.create(superClass && superClass.prototype, {
      constructor: {
        value: subClass,
        enumerable: false,
        writable: true,
        configurable: true
      }
    });
    if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
  };

  var possibleConstructorReturn = function (self, call) {
    if (!self) {
      throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
    }

    return call && (typeof call === "object" || typeof call === "function") ? call : self;
  };

  var slicedToArray = function () {
    function sliceIterator(arr, i) {
      var _arr = [];
      var _n = true;
      var _d = false;
      var _e = undefined;

      try {
        for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) {
          _arr.push(_s.value);

          if (i && _arr.length === i) break;
        }
      } catch (err) {
        _d = true;
        _e = err;
      } finally {
        try {
          if (!_n && _i["return"]) _i["return"]();
        } finally {
          if (_d) throw _e;
        }
      }

      return _arr;
    }

    return function (arr, i) {
      if (Array.isArray(arr)) {
        return arr;
      } else if (Symbol.iterator in Object(arr)) {
        return sliceIterator(arr, i);
      } else {
        throw new TypeError("Invalid attempt to destructure non-iterable instance");
      }
    };
  }();

  var toConsumableArray = function (arr) {
    if (Array.isArray(arr)) {
      for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) arr2[i] = arr[i];

      return arr2;
    } else {
      return Array.from(arr);
    }
  };

  var simpleColors = {
    aliceblue: 'f0f8ff',
    antiquewhite: 'faebd7',
    aqua: '00ffff',
    aquamarine: '7fffd4',
    azure: 'f0ffff',
    beige: 'f5f5dc',
    bisque: 'ffe4c4',
    black: '000000',
    blanchedalmond: 'ffebcd',
    blue: '0000ff',
    blueviolet: '8a2be2',
    brown: 'a52a2a',
    burlywood: 'deb887',
    cadetblue: '5f9ea0',
    chartreuse: '7fff00',
    chocolate: 'd2691e',
    coral: 'ff7f50',
    cornflowerblue: '6495ed',
    cornsilk: 'fff8dc',
    crimson: 'dc143c',
    cyan: '00ffff',
    darkblue: '00008b',
    darkcyan: '008b8b',
    darkgoldenrod: 'b8860b',
    darkgray: 'a9a9a9',
    darkgreen: '006400',
    darkkhaki: 'bdb76b',
    darkmagenta: '8b008b',
    darkolivegreen: '556b2f',
    darkorange: 'ff8c00',
    darkorchid: '9932cc',
    darkred: '8b0000',
    darksalmon: 'e9967a',
    darkseagreen: '8fbc8f',
    darkslateblue: '483d8b',
    darkslategray: '2f4f4f',
    darkturquoise: '00ced1',
    darkviolet: '9400d3',
    deeppink: 'ff1493',
    deepskyblue: '00bfff',
    dimgray: '696969',
    dodgerblue: '1e90ff',
    feldspar: 'd19275',
    firebrick: 'b22222',
    floralwhite: 'fffaf0',
    forestgreen: '228b22',
    fuchsia: 'ff00ff',
    gainsboro: 'dcdcdc',
    ghostwhite: 'f8f8ff',
    gold: 'ffd700',
    goldenrod: 'daa520',
    gray: '808080',
    green: '008000',
    greenyellow: 'adff2f',
    honeydew: 'f0fff0',
    hotpink: 'ff69b4',
    indianred: 'cd5c5c',
    indigo: '4b0082',
    ivory: 'fffff0',
    khaki: 'f0e68c',
    lavender: 'e6e6fa',
    lavenderblush: 'fff0f5',
    lawngreen: '7cfc00',
    lemonchiffon: 'fffacd',
    lightblue: 'add8e6',
    lightcoral: 'f08080',
    lightcyan: 'e0ffff',
    lightgoldenrodyellow: 'fafad2',
    lightgrey: 'd3d3d3',
    lightgreen: '90ee90',
    lightpink: 'ffb6c1',
    lightsalmon: 'ffa07a',
    lightseagreen: '20b2aa',
    lightskyblue: '87cefa',
    lightslateblue: '8470ff',
    lightslategray: '778899',
    lightsteelblue: 'b0c4de',
    lightyellow: 'ffffe0',
    lime: '00ff00',
    limegreen: '32cd32',
    linen: 'faf0e6',
    magenta: 'ff00ff',
    maroon: '800000',
    mediumaquamarine: '66cdaa',
    mediumblue: '0000cd',
    mediumorchid: 'ba55d3',
    mediumpurple: '9370d8',
    mediumseagreen: '3cb371',
    mediumslateblue: '7b68ee',
    mediumspringgreen: '00fa9a',
    mediumturquoise: '48d1cc',
    mediumvioletred: 'c71585',
    midnightblue: '191970',
    mintcream: 'f5fffa',
    mistyrose: 'ffe4e1',
    moccasin: 'ffe4b5',
    navajowhite: 'ffdead',
    navy: '000080',
    oldlace: 'fdf5e6',
    olive: '808000',
    olivedrab: '6b8e23',
    orange: 'ffa500',
    orangered: 'ff4500',
    orchid: 'da70d6',
    palegoldenrod: 'eee8aa',
    palegreen: '98fb98',
    paleturquoise: 'afeeee',
    palevioletred: 'd87093',
    papayawhip: 'ffefd5',
    peachpuff: 'ffdab9',
    peru: 'cd853f',
    pink: 'ffc0cb',
    plum: 'dda0dd',
    powderblue: 'b0e0e6',
    purple: '800080',
    red: 'ff0000',
    rosybrown: 'bc8f8f',
    royalblue: '4169e1',
    saddlebrown: '8b4513',
    salmon: 'fa8072',
    sandybrown: 'f4a460',
    seagreen: '2e8b57',
    seashell: 'fff5ee',
    sienna: 'a0522d',
    silver: 'c0c0c0',
    skyblue: '87ceeb',
    slateblue: '6a5acd',
    slategray: '708090',
    snow: 'fffafa',
    springgreen: '00ff7f',
    steelblue: '4682b4',
    tan: 'd2b48c',
    teal: '008080',
    thistle: 'd8bfd8',
    tomato: 'ff6347',
    turquoise: '40e0d0',
    violet: 'ee82ee',
    violetred: 'd02090',
    wheat: 'f5deb3',
    white: 'ffffff',
    whitesmoke: 'f5f5f5',
    yellow: 'ffff00',
    yellowgreen: '9acd32'
  };

  // array of color definition objects
  var colorDefs = [{
    re: /^rgb\((\d{1,3}),\s*(\d{1,3}),\s*(\d{1,3})\)$/,
    example: ['rgb(123, 234, 45)', 'rgb(255,234,245)'],
    process: function process(bits) {
      return [parseInt(bits[1], 10), parseInt(bits[2], 10), parseInt(bits[3], 10)];
    }
  }, {
    re: /^(\w{2})(\w{2})(\w{2})$/,
    example: ['#00ff00', '336699'],
    process: function process(bits) {
      return [parseInt(bits[1], 16), parseInt(bits[2], 16), parseInt(bits[3], 16)];
    }
  }, {
    re: /^(\w{1})(\w{1})(\w{1})$/,
    example: ['#fb0', 'f0f'],
    process: function process(bits) {
      return [parseInt(bits[1] + bits[1], 16), parseInt(bits[2] + bits[2], 16), parseInt(bits[3] + bits[3], 16)];
    }
  }];

  /**
   * A class to parse color values
   * @author Stoyan Stefanov <sstoo@gmail.com>
   * @link   https://www.phpied.com/rgb-color-parser-in-javascript/
   * @license MIT
   */

  var RGBColor = function () {
    function RGBColor(colorString) {
      classCallCheck(this, RGBColor);

      this.ok = false;

      // strip any leading #
      if (colorString.charAt(0) === '#') {
        // remove # if any
        colorString = colorString.substr(1, 6);
      }

      colorString = colorString.replace(/ /g, '');
      colorString = colorString.toLowerCase();

      // before getting into regexps, try simple matches
      // and overwrite the input
      if (colorString in simpleColors) {
        colorString = simpleColors[colorString];
      }
      // end of simple type-in colors

      // search through the definitions to find a match
      for (var i = 0; i < colorDefs.length; i++) {
        var re = colorDefs[i].re;

        var processor = colorDefs[i].process;
        var bits = re.exec(colorString);
        if (bits) {
          var _processor = processor(bits),
            _processor2 = slicedToArray(_processor, 3),
            r = _processor2[0],
            g = _processor2[1],
            b = _processor2[2];

          Object.assign(this, {
            r: r,
            g: g,
            b: b
          });
          this.ok = true;
        }
      }

      // validate/cleanup values
      this.r = this.r < 0 || isNaN(this.r) ? 0 : this.r > 255 ? 255 : this.r;
      this.g = this.g < 0 || isNaN(this.g) ? 0 : this.g > 255 ? 255 : this.g;
      this.b = this.b < 0 || isNaN(this.b) ? 0 : this.b > 255 ? 255 : this.b;
    }

    // some getters


    createClass(RGBColor, [{
      key: 'toRGB',
      value: function toRGB() {
        return 'rgb(' + this.r + ', ' + this.g + ', ' + this.b + ')';
      }
    }, {
      key: 'toHex',
      value: function toHex() {
        var r = this.r.toString(16);
        var g = this.g.toString(16);
        var b = this.b.toString(16);
        if (r.length === 1) {
          r = '0' + r;
        }
        if (g.length === 1) {
          g = '0' + g;
        }
        if (b.length === 1) {
          b = '0' + b;
        }
        return '#' + r + g + b;
      }

      // help

    }, {
      key: 'getHelpXML',
      value: function getHelpXML() {
        var examples = [];
        // add regexps
        for (var i = 0; i < colorDefs.length; i++) {
          var example = colorDefs[i].example;

          for (var j = 0; j < example.length; j++) {
            examples[examples.length] = example[j];
          }
        }
        // add type-in colors
        examples.push.apply(examples, toConsumableArray(Object.keys(simpleColors)));

        var xml = document.createElement('ul');
        xml.setAttribute('id', 'rgbcolor-examples');
        for (var _i = 0; _i < examples.length; _i++) {
          try {
            var listItem = document.createElement('li');
            var listColor = new RGBColor(examples[_i]);
            var exampleDiv = document.createElement('div');
            exampleDiv.style.cssText = 'margin: 3px;\nborder: 1px solid black;\nbackground: ' + listColor.toHex() + ';\ncolor: ' + listColor.toHex() + ';';
            exampleDiv.append('test');
            var listItemValue = ' ' + examples[_i] + ' -> ' + listColor.toRGB() + ' -> ' + listColor.toHex();
            listItem.append(exampleDiv, listItemValue);
            xml.append(listItem);
          } catch (e) {}
        }
        return xml;
      }
    }]);
    return RGBColor;
  }();

  /* eslint-disable new-cap */

  var stackBlurCanvasRGBA = void 0;
  var setStackBlurCanvasRGBA = function setStackBlurCanvasRGBA(value) {
    stackBlurCanvasRGBA = value;
  };

  // canvg(target, s)
  // empty parameters: replace all 'svg' elements on page with 'canvas' elements
  // target: canvas element or the id of a canvas element
  // s: svg string, url to svg file, or xml document
  // opts: optional hash of options
  //     ignoreMouse: true => ignore mouse events
  //     ignoreAnimation: true => ignore animations
  //     ignoreDimensions: true => does not try to resize canvas
  //     ignoreClear: true => does not clear canvas
  //     offsetX: int => draws at a x offset
  //     offsetY: int => draws at a y offset
  //     scaleWidth: int => scales horizontally to width
  //     scaleHeight: int => scales vertically to height
  //     forceRedraw: function => will call the function on every frame, if it returns true, will redraw
  // returns all the function after the first render is completed with dom
  var canvg = function canvg(target, s, opts) {
    // no parameters
    if (target == null && s == null && opts == null) {
      var svgTags = document.querySelectorAll('svg');
      return Promise.all([].concat(toConsumableArray(svgTags)).map(function (svgTag) {
        var c = document.createElement('canvas');
        c.width = svgTag.clientWidth;
        c.height = svgTag.clientHeight;
        svgTag.before(c);
        svgTag.remove();
        var div = document.createElement('div');
        div.append(svgTag);
        return canvg(c, div.innerHTML);
      }));
    }

    if (typeof target === 'string') {
      target = document.getElementById(target);
    }

    // store class on canvas
    if (target.svg != null) target.svg.stop();
    var svg = build(opts || {});
    // on i.e. 8 for flash canvas, we can't assign the property so check for it
    if (!(target.childNodes.length === 1 && target.childNodes[0].nodeName === 'OBJECT')) {
      target.svg = svg;
    }

    var ctx = target.getContext('2d');
    if (typeof s.documentElement !== 'undefined') {
      // load from xml doc
      return svg.loadXmlDoc(ctx, s);
    }
    if (s.substr(0, 1) === '<') {
      // load from xml string
      return svg.loadXml(ctx, s);
    }
    // load from url
    return svg.load(ctx, s);
  };

  function build(opts) {
    var svg = {
      opts: opts
    };

    svg.FRAMERATE = 30;
    svg.MAX_VIRTUAL_PIXELS = 30000;

    svg.log = function (msg) {};
    if (svg.opts.log === true && typeof console !== 'undefined') {
      svg.log = function (msg) {
        console.log(msg);
      };
    }

    // globals
    svg.init = function (ctx) {
      var uniqueId = 0;
      svg.UniqueId = function () {
        uniqueId++;
        return 'canvg' + uniqueId;
      };
      svg.Definitions = {};
      svg.Styles = {};
      svg.Animations = [];
      svg.Images = [];
      svg.ctx = ctx;
      svg.ViewPort = {
        viewPorts: [],
        Clear: function Clear() {
          this.viewPorts = [];
        },
        SetCurrent: function SetCurrent(width, height) {
          this.viewPorts.push({
            width: width,
            height: height
          });
        },
        RemoveCurrent: function RemoveCurrent() {
          this.viewPorts.pop();
        },
        Current: function Current() {
          return this.viewPorts[this.viewPorts.length - 1];
        },
        width: function width() {
          return this.Current().width;
        },
        height: function height() {
          return this.Current().height;
        },
        ComputeSize: function ComputeSize(d) {
          if (d != null && typeof d === 'number') return d;
          if (d === 'x') return this.width();
          if (d === 'y') return this.height();
          return Math.sqrt(Math.pow(this.width(), 2) + Math.pow(this.height(), 2)) / Math.sqrt(2);
        }
      };
    };
    svg.init();

    // images loaded
    svg.ImagesLoaded = function () {
      return svg.Images.every(function (img) {
        return img.loaded;
      });
    };

    // trim
    svg.trim = function (s) {
      return s.replace(/^\s+|\s+$/g, '');
    };

    // compress spaces
    svg.compressSpaces = function (s) {
      return s.replace(/[\s\r\t\n]+/gm, ' ');
    };

    // ajax
    svg.ajax = function (url, asynch) {
      var AJAX = window.XMLHttpRequest ? new XMLHttpRequest() : new window.ActiveXObject('Microsoft.XMLHTTP');
      if (!AJAX) {
        return null;
      }
      if (asynch) {
        return new Promise(function (resolve, reject) {
          var req = AJAX.open('GET', url, true);
          req.addEventListener('load', function () {
            resolve(AJAX.responseText);
          });
          AJAX.send(null);
        });
      }

      AJAX.open('GET', url, false);
      AJAX.send(null);
      return AJAX.responseText;
    };

    // parse xml
    svg.parseXml = function (xml) {
      if (window.DOMParser) {
        var parser = new DOMParser();
        return parser.parseFromString(xml, 'text/xml');
      } else {
        xml = xml.replace(/<!DOCTYPE svg[^>]*>/, '');
        var xmlDoc = new window.ActiveXObject('Microsoft.XMLDOM');
        xmlDoc.async = 'false';
        xmlDoc.loadXML(xml);
        return xmlDoc;
      }
    };

    // text extensions
    // get the text baseline
    var textBaselineMapping = {
      baseline: 'alphabetic',
      'before-edge': 'top',
      'text-before-edge': 'top',
      middle: 'middle',
      central: 'middle',
      'after-edge': 'bottom',
      'text-after-edge': 'bottom',
      ideographic: 'ideographic',
      alphabetic: 'alphabetic',
      hanging: 'hanging',
      mathematical: 'alphabetic'
    };

    svg.Property = function () {
      function Property(name, value) {
        classCallCheck(this, Property);

        this.name = name;
        this.value = value;
      }

      createClass(Property, [{
        key: 'getValue',
        value: function getValue() {
          return this.value;
        }
      }, {
        key: 'hasValue',
        value: function hasValue() {
          return this.value != null && this.value !== '';
        }

        // return the numerical value of the property

      }, {
        key: 'numValue',
        value: function numValue() {
          if (!this.hasValue()) return 0;

          var n = parseFloat(this.value);
          if ((this.value + '').match(/%$/)) {
            n = n / 100.0;
          }
          return n;
        }
      }, {
        key: 'valueOrDefault',
        value: function valueOrDefault(def) {
          if (this.hasValue()) return this.value;
          return def;
        }
      }, {
        key: 'numValueOrDefault',
        value: function numValueOrDefault(def) {
          if (this.hasValue()) return this.numValue();
          return def;
        }

        // color extensions
        // augment the current color value with the opacity

      }, {
        key: 'addOpacity',
        value: function addOpacity(opacityProp) {
          var newValue = this.value;
          if (opacityProp.value != null && opacityProp.value !== '' && typeof this.value === 'string') {
            // can only add opacity to colors, not patterns
            var color = new RGBColor(this.value);
            if (color.ok) {
              newValue = 'rgba(' + color.r + ', ' + color.g + ', ' + color.b + ', ' + opacityProp.numValue() + ')';
            }
          }
          return new svg.Property(this.name, newValue);
        }

        // definition extensions
        // get the definition from the definitions table

      }, {
        key: 'getDefinition',
        value: function getDefinition() {
          var name = this.value.match(/#([^)'"]+)/);
          if (name) {
            name = name[1];
          }
          if (!name) {
            name = this.value;
          }
          return svg.Definitions[name];
        }
      }, {
        key: 'isUrlDefinition',
        value: function isUrlDefinition() {
          return this.value.startsWith('url(');
        }
      }, {
        key: 'getFillStyleDefinition',
        value: function getFillStyleDefinition(e, opacityProp) {
          var def = this.getDefinition();

          // gradient
          if (def != null && def.createGradient) {
            return def.createGradient(svg.ctx, e, opacityProp);
          }

          // pattern
          if (def != null && def.createPattern) {
            if (def.getHrefAttribute().hasValue()) {
              var pt = def.attribute('patternTransform');
              def = def.getHrefAttribute().getDefinition();
              if (pt.hasValue()) {
                def.attribute('patternTransform', true).value = pt.value;
              }
            }
            return def.createPattern(svg.ctx, e);
          }

          return null;
        }

        // length extensions

      }, {
        key: 'getDPI',
        value: function getDPI(viewPort) {
          return 96.0; // TODO: compute?
        }
      }, {
        key: 'getEM',
        value: function getEM(viewPort) {
          var em = 12;

          var fontSize = new svg.Property('fontSize', svg.Font.Parse(svg.ctx.font).fontSize);
          if (fontSize.hasValue()) em = fontSize.toPixels(viewPort);

          return em;
        }
      }, {
        key: 'getUnits',
        value: function getUnits() {
          var s = this.value + '';
          return s.replace(/[0-9.-]/g, '');
        }

        // get the length as pixels

      }, {
        key: 'toPixels',
        value: function toPixels(viewPort, processPercent) {
          if (!this.hasValue()) return 0;
          var s = this.value + '';
          if (s.match(/em$/)) return this.numValue() * this.getEM(viewPort);
          if (s.match(/ex$/)) return this.numValue() * this.getEM(viewPort) / 2.0;
          if (s.match(/px$/)) return this.numValue();
          if (s.match(/pt$/)) return this.numValue() * this.getDPI(viewPort) * (1.0 / 72.0);
          if (s.match(/pc$/)) return this.numValue() * 15;
          if (s.match(/cm$/)) return this.numValue() * this.getDPI(viewPort) / 2.54;
          if (s.match(/mm$/)) return this.numValue() * this.getDPI(viewPort) / 25.4;
          if (s.match(/in$/)) return this.numValue() * this.getDPI(viewPort);
          if (s.match(/%$/)) return this.numValue() * svg.ViewPort.ComputeSize(viewPort);
          var n = this.numValue();
          if (processPercent && n < 1.0) return n * svg.ViewPort.ComputeSize(viewPort);
          return n;
        }

        // time extensions
        // get the time as milliseconds

      }, {
        key: 'toMilliseconds',
        value: function toMilliseconds() {
          if (!this.hasValue()) return 0;
          var s = this.value + '';
          if (s.match(/s$/)) return this.numValue() * 1000;
          if (s.match(/ms$/)) return this.numValue();
          return this.numValue();
        }

        // angle extensions
        // get the angle as radians

      }, {
        key: 'toRadians',
        value: function toRadians() {
          if (!this.hasValue()) return 0;
          var s = this.value + '';
          if (s.match(/deg$/)) return this.numValue() * (Math.PI / 180.0);
          if (s.match(/grad$/)) return this.numValue() * (Math.PI / 200.0);
          if (s.match(/rad$/)) return this.numValue();
          return this.numValue() * (Math.PI / 180.0);
        }
      }, {
        key: 'toTextBaseline',
        value: function toTextBaseline() {
          if (!this.hasValue()) return null;
          return textBaselineMapping[this.value];
        }
      }]);
      return Property;
    }();

    // fonts
    svg.Font = {
      Styles: 'normal|italic|oblique|inherit',
      Variants: 'normal|small-caps|inherit',
      Weights: 'normal|bold|bolder|lighter|100|200|300|400|500|600|700|800|900|inherit',

      CreateFont: function CreateFont(fontStyle, fontVariant, fontWeight, fontSize, fontFamily, inherit) {
        var f = inherit != null ? this.Parse(inherit) : this.CreateFont('', '', '', '', '', svg.ctx.font);
        return {
          fontFamily: fontFamily || f.fontFamily,
          fontSize: fontSize || f.fontSize,
          fontStyle: fontStyle || f.fontStyle,
          fontWeight: fontWeight || f.fontWeight,
          fontVariant: fontVariant || f.fontVariant,
          toString: function toString() {
            return [this.fontStyle, this.fontVariant, this.fontWeight, this.fontSize, this.fontFamily].join(' ');
          }
        };
      },
      Parse: function Parse(s) {
        var _this = this;

        var f = {};
        var d = svg.trim(svg.compressSpaces(s || '')).split(' ');
        var set$$1 = {
          fontSize: false,
          fontStyle: false,
          fontWeight: false,
          fontVariant: false
        };
        var ff = '';
        d.forEach(function (d) {
          if (!set$$1.fontStyle && _this.Styles.includes(d)) {
            if (d !== 'inherit') {
              f.fontStyle = d;
            }
            set$$1.fontStyle = true;
          } else if (!set$$1.fontVariant && _this.Variants.includes(d)) {
            if (d !== 'inherit') {
              f.fontVariant = d;
            }
            set$$1.fontStyle = set$$1.fontVariant = true;
          } else if (!set$$1.fontWeight && _this.Weights.includes(d)) {
            if (d !== 'inherit') {
              f.fontWeight = d;
            }
            set$$1.fontStyle = set$$1.fontVariant = set$$1.fontWeight = true;
          } else if (!set$$1.fontSize) {
            if (d !== 'inherit') {
              f.fontSize = d.split('/')[0];
            }
            set$$1.fontStyle = set$$1.fontVariant = set$$1.fontWeight = set$$1.fontSize = true;
          } else {
            if (d !== 'inherit') {
              ff += d;
            }
          }
        });
        if (ff !== '') {
          f.fontFamily = ff;
        }
        return f;
      }
    };

    // points and paths
    svg.ToNumberArray = function (s) {
      var a = svg.trim(svg.compressSpaces((s || '').replace(/,/g, ' '))).split(' ');
      return a.map(function (a) {
        return parseFloat(a);
      });
    };
    svg.Point = function () {
      function _class(x, y) {
        classCallCheck(this, _class);

        this.x = x;
        this.y = y;
      }

      createClass(_class, [{
        key: 'angleTo',
        value: function angleTo(p) {
          return Math.atan2(p.y - this.y, p.x - this.x);
        }
      }, {
        key: 'applyTransform',
        value: function applyTransform(v) {
          var xp = this.x * v[0] + this.y * v[2] + v[4];
          var yp = this.x * v[1] + this.y * v[3] + v[5];
          this.x = xp;
          this.y = yp;
        }
      }]);
      return _class;
    }();

    svg.CreatePoint = function (s) {
      var a = svg.ToNumberArray(s);
      return new svg.Point(a[0], a[1]);
    };
    svg.CreatePath = function (s) {
      var a = svg.ToNumberArray(s);
      var path = [];
      for (var i = 0; i < a.length; i += 2) {
        path.push(new svg.Point(a[i], a[i + 1]));
      }
      return path;
    };

    // bounding box
    svg.BoundingBox = function () {
      function _class2(x1, y1, x2, y2) {
        classCallCheck(this, _class2);
        // pass in initial points if you want
        this.x1 = Number.NaN;
        this.y1 = Number.NaN;
        this.x2 = Number.NaN;
        this.y2 = Number.NaN;
        this.addPoint(x1, y1);
        this.addPoint(x2, y2);
      }

      createClass(_class2, [{
        key: 'x',
        value: function x() {
          return this.x1;
        }
      }, {
        key: 'y',
        value: function y() {
          return this.y1;
        }
      }, {
        key: 'width',
        value: function width() {
          return this.x2 - this.x1;
        }
      }, {
        key: 'height',
        value: function height() {
          return this.y2 - this.y1;
        }
      }, {
        key: 'addPoint',
        value: function addPoint(x, y) {
          if (x != null) {
            if (isNaN(this.x1) || isNaN(this.x2)) {
              this.x1 = x;
              this.x2 = x;
            }
            if (x < this.x1) this.x1 = x;
            if (x > this.x2) this.x2 = x;
          }

          if (y != null) {
            if (isNaN(this.y1) || isNaN(this.y2)) {
              this.y1 = y;
              this.y2 = y;
            }
            if (y < this.y1) this.y1 = y;
            if (y > this.y2) this.y2 = y;
          }
        }
      }, {
        key: 'addX',
        value: function addX(x) {
          this.addPoint(x, null);
        }
      }, {
        key: 'addY',
        value: function addY(y) {
          this.addPoint(null, y);
        }
      }, {
        key: 'addBoundingBox',
        value: function addBoundingBox(bb) {
          this.addPoint(bb.x1, bb.y1);
          this.addPoint(bb.x2, bb.y2);
        }
      }, {
        key: 'addQuadraticCurve',
        value: function addQuadraticCurve(p0x, p0y, p1x, p1y, p2x, p2y) {
          var cp1x = p0x + 2 / 3 * (p1x - p0x); // CP1 = QP0 + 2/3 *(QP1-QP0)
          var cp1y = p0y + 2 / 3 * (p1y - p0y); // CP1 = QP0 + 2/3 *(QP1-QP0)
          var cp2x = cp1x + 1 / 3 * (p2x - p0x); // CP2 = CP1 + 1/3 *(QP2-QP0)
          var cp2y = cp1y + 1 / 3 * (p2y - p0y); // CP2 = CP1 + 1/3 *(QP2-QP0)
          this.addBezierCurve(p0x, p0y, cp1x, cp2x, cp1y, cp2y, p2x, p2y);
        }
      }, {
        key: 'addBezierCurve',
        value: function addBezierCurve(p0x, p0y, p1x, p1y, p2x, p2y, p3x, p3y) {
          var _this2 = this;

          // from http://blog.hackers-cafe.net/2009/06/how-to-calculate-bezier-curves-bounding.html
          var p0 = [p0x, p0y],
            p1 = [p1x, p1y],
            p2 = [p2x, p2y],
            p3 = [p3x, p3y];
          this.addPoint(p0[0], p0[1]);
          this.addPoint(p3[0], p3[1]);

          var _loop = function _loop(i) {
            var f = function f(t) {
              return Math.pow(1 - t, 3) * p0[i] + 3 * Math.pow(1 - t, 2) * t * p1[i] + 3 * (1 - t) * Math.pow(t, 2) * p2[i] + Math.pow(t, 3) * p3[i];
            };

            var b = 6 * p0[i] - 12 * p1[i] + 6 * p2[i];
            var a = -3 * p0[i] + 9 * p1[i] - 9 * p2[i] + 3 * p3[i];
            var c = 3 * p1[i] - 3 * p0[i];

            if (a === 0) {
              if (b === 0) return 'continue';
              var t = -c / b;
              if (t > 0 && t < 1) {
                if (i === 0) _this2.addX(f(t));
                if (i === 1) _this2.addY(f(t));
              }
              return 'continue';
            }

            var b2ac = Math.pow(b, 2) - 4 * c * a;
            if (b2ac < 0) return 'continue';
            var t1 = (-b + Math.sqrt(b2ac)) / (2 * a);
            if (t1 > 0 && t1 < 1) {
              if (i === 0) _this2.addX(f(t1));
              if (i === 1) _this2.addY(f(t1));
            }
            var t2 = (-b - Math.sqrt(b2ac)) / (2 * a);
            if (t2 > 0 && t2 < 1) {
              if (i === 0) _this2.addX(f(t2));
              if (i === 1) _this2.addY(f(t2));
            }
          };

          for (var i = 0; i <= 1; i++) {
            var _ret = _loop(i);

            if (_ret === 'continue') continue;
          }
        }
      }, {
        key: 'isPointInBox',
        value: function isPointInBox(x, y) {
          return this.x1 <= x && x <= this.x2 && this.y1 <= y && y <= this.y2;
        }
      }]);
      return _class2;
    }();

    // transforms
    svg.Transform = function () {
      function _class3(v) {
        var _this6 = this;

        classCallCheck(this, _class3);

        this.Type = {
          translate: function translate(s) {
            classCallCheck(this, translate);

            this.p = svg.CreatePoint(s);
            this.apply = function (ctx) {
              ctx.translate(this.p.x || 0.0, this.p.y || 0.0);
            };
            this.unapply = function (ctx) {
              ctx.translate(-1.0 * this.p.x || 0.0, -1.0 * this.p.y || 0.0);
            };
            this.applyToPoint = function (p) {
              p.applyTransform([1, 0, 0, 1, this.p.x || 0.0, this.p.y || 0.0]);
            };
          },
          rotate: function rotate(s) {
            classCallCheck(this, rotate);

            var a = svg.ToNumberArray(s);
            this.angle = new svg.Property('angle', a[0]);
            this.cx = a[1] || 0;
            this.cy = a[2] || 0;
            this.apply = function (ctx) {
              ctx.translate(this.cx, this.cy);
              ctx.rotate(this.angle.toRadians());
              ctx.translate(-this.cx, -this.cy);
            };
            this.unapply = function (ctx) {
              ctx.translate(this.cx, this.cy);
              ctx.rotate(-1.0 * this.angle.toRadians());
              ctx.translate(-this.cx, -this.cy);
            };
            this.applyToPoint = function (p) {
              var a = this.angle.toRadians();
              p.applyTransform([1, 0, 0, 1, this.p.x || 0.0, this.p.y || 0.0]);
              p.applyTransform([Math.cos(a), Math.sin(a), -Math.sin(a), Math.cos(a), 0, 0]);
              p.applyTransform([1, 0, 0, 1, -this.p.x || 0.0, -this.p.y || 0.0]);
            };
          },
          scale: function scale(s) {
            classCallCheck(this, scale);

            this.p = svg.CreatePoint(s);
            this.apply = function (ctx) {
              ctx.scale(this.p.x || 1.0, this.p.y || this.p.x || 1.0);
            };
            this.unapply = function (ctx) {
              ctx.scale(1.0 / this.p.x || 1.0, 1.0 / this.p.y || this.p.x || 1.0);
            };
            this.applyToPoint = function (p) {
              p.applyTransform([this.p.x || 0.0, 0, 0, this.p.y || 0.0, 0, 0]);
            };
          },
          matrix: function matrix(s) {
            classCallCheck(this, matrix);

            this.m = svg.ToNumberArray(s);
            this.apply = function (ctx) {
              ctx.transform(this.m[0], this.m[1], this.m[2], this.m[3], this.m[4], this.m[5]);
            };
            this.applyToPoint = function (p) {
              p.applyTransform(this.m);
            };
          }
        };
        Object.assign(this.Type, {
          SkewBase: function (_Type$matrix) {
            inherits(SkewBase, _Type$matrix);

            function SkewBase(s) {
              classCallCheck(this, SkewBase);

              var _this3 = possibleConstructorReturn(this, (SkewBase.__proto__ || Object.getPrototypeOf(SkewBase)).call(this, s));

              _this3.angle = new svg.Property('angle', s);
              return _this3;
            }

            return SkewBase;
          }(this.Type.matrix)
        });
        Object.assign(this.Type, {
          skewX: function (_Type$SkewBase) {
            inherits(skewX, _Type$SkewBase);

            function skewX(s) {
              classCallCheck(this, skewX);

              var _this4 = possibleConstructorReturn(this, (skewX.__proto__ || Object.getPrototypeOf(skewX)).call(this, s));

              _this4.m = [1, 0, Math.tan(_this4.angle.toRadians()), 1, 0, 0];
              return _this4;
            }

            return skewX;
          }(this.Type.SkewBase),
          skewY: function (_Type$SkewBase2) {
            inherits(skewY, _Type$SkewBase2);

            function skewY(s) {
              classCallCheck(this, skewY);

              var _this5 = possibleConstructorReturn(this, (skewY.__proto__ || Object.getPrototypeOf(skewY)).call(this, s));

              _this5.m = [1, Math.tan(_this5.angle.toRadians()), 0, 1, 0, 0];
              return _this5;
            }

            return skewY;
          }(this.Type.SkewBase)
        });

        var data = svg.trim(svg.compressSpaces(v)).replace(/\)([a-zA-Z])/g, ') $1').replace(/\)(\s?,\s?)/g, ') ').split(/\s(?=[a-z])/);
        this.transforms = data.map(function (d) {
          var type = svg.trim(d.split('(')[0]);
          var s = d.split('(')[1].replace(')', '');
          var transform = new _this6.Type[type](s);
          transform.type = type;
          return transform;
        });
      }

      createClass(_class3, [{
        key: 'apply',
        value: function apply(ctx) {
          this.transforms.forEach(function (transform) {
            transform.apply(ctx);
          });
        }
      }, {
        key: 'unapply',
        value: function unapply(ctx) {
          for (var i = this.transforms.length - 1; i >= 0; i--) {
            this.transforms[i].unapply(ctx);
          }
        }
      }, {
        key: 'applyToPoint',
        value: function applyToPoint(p) {
          this.transforms.forEach(function (transform) {
            transform.applyToPoint(p);
          });
        }
      }]);
      return _class3;
    }();

    // aspect ratio
    svg.AspectRatio = function (ctx, aspectRatio, width, desiredWidth, height, desiredHeight, minX, minY, refX, refY) {
      // aspect ratio - https://www.w3.org/TR/SVG/coords.html#PreserveAspectRatioAttribute
      aspectRatio = svg.compressSpaces(aspectRatio);
      aspectRatio = aspectRatio.replace(/^defer\s/, ''); // ignore defer
      var align = aspectRatio.split(' ')[0] || 'xMidYMid';
      var meetOrSlice = aspectRatio.split(' ')[1] || 'meet';

      // calculate scale
      var scaleX = width / desiredWidth;
      var scaleY = height / desiredHeight;
      var scaleMin = Math.min(scaleX, scaleY);
      var scaleMax = Math.max(scaleX, scaleY);
      if (meetOrSlice === 'meet') {
        desiredWidth *= scaleMin;
        desiredHeight *= scaleMin;
      }
      if (meetOrSlice === 'slice') {
        desiredWidth *= scaleMax;
        desiredHeight *= scaleMax;
      }

      refX = new svg.Property('refX', refX);
      refY = new svg.Property('refY', refY);
      if (refX.hasValue() && refY.hasValue()) {
        ctx.translate(-scaleMin * refX.toPixels('x'), -scaleMin * refY.toPixels('y'));
      } else {
        // align
        if (align.match(/^xMid/) && (meetOrSlice === 'meet' && scaleMin === scaleY || meetOrSlice === 'slice' && scaleMax === scaleY)) ctx.translate(width / 2.0 - desiredWidth / 2.0, 0);
        if (align.match(/YMid$/) && (meetOrSlice === 'meet' && scaleMin === scaleX || meetOrSlice === 'slice' && scaleMax === scaleX)) ctx.translate(0, height / 2.0 - desiredHeight / 2.0);
        if (align.match(/^xMax/) && (meetOrSlice === 'meet' && scaleMin === scaleY || meetOrSlice === 'slice' && scaleMax === scaleY)) ctx.translate(width - desiredWidth, 0);
        if (align.match(/YMax$/) && (meetOrSlice === 'meet' && scaleMin === scaleX || meetOrSlice === 'slice' && scaleMax === scaleX)) ctx.translate(0, height - desiredHeight);
      }

      // scale
      if (align === 'none') ctx.scale(scaleX, scaleY);
      else if (meetOrSlice === 'meet') ctx.scale(scaleMin, scaleMin);
      else if (meetOrSlice === 'slice') ctx.scale(scaleMax, scaleMax);

      // translate
      ctx.translate(minX == null ? 0 : -minX, minY == null ? 0 : -minY);
    };

    // elements
    svg.Element = {};

    svg.EmptyProperty = new svg.Property('EMPTY', '');

    svg.Element.ElementBase = function () {
      function _class4(node) {
        var _this7 = this;

        classCallCheck(this, _class4);

        this.attributes = {};
        this.styles = {};
        this.children = [];
        if (node != null && node.nodeType === 1) {
          // ELEMENT_NODE
          // add children
          [].concat(toConsumableArray(node.childNodes)).forEach(function (childNode) {
            if (childNode.nodeType === 1) {
              _this7.addChild(childNode, true); // ELEMENT_NODE
            }
            if (_this7.captureTextNodes && (childNode.nodeType === 3 || childNode.nodeType === 4)) {
              var text = childNode.nodeValue || childNode.text || '';
              if (svg.trim(svg.compressSpaces(text)) !== '') {
                _this7.addChild(new svg.Element.tspan(childNode), false); // TEXT_NODE
              }
            }
          });

          // add attributes
          [].concat(toConsumableArray(node.attributes)).forEach(function (_ref) {
            var nodeName = _ref.nodeName,
              nodeValue = _ref.nodeValue;

            _this7.attributes[nodeName] = new svg.Property(nodeName, nodeValue);
          });
          // add tag styles
          var styles = svg.Styles[node.nodeName];
          if (styles != null) {
            for (var name in styles) {
              this.styles[name] = styles[name];
            }
          }

          // add class styles
          if (this.attribute('class').hasValue()) {
            var classes = svg.compressSpaces(this.attribute('class').value).split(' ');
            classes.forEach(function (clss) {
              styles = svg.Styles['.' + clss];
              if (styles != null) {
                for (var _name in styles) {
                  _this7.styles[_name] = styles[_name];
                }
              }
              styles = svg.Styles[node.nodeName + '.' + clss];
              if (styles != null) {
                for (var _name2 in styles) {
                  _this7.styles[_name2] = styles[_name2];
                }
              }
            });
          }

          // add id styles
          if (this.attribute('id').hasValue()) {
            var _styles = svg.Styles['#' + this.attribute('id').value];
            if (_styles != null) {
              for (var _name3 in _styles) {
                this.styles[_name3] = _styles[_name3];
              }
            }
          }

          // add inline styles
          if (this.attribute('style').hasValue()) {
            var _styles2 = this.attribute('style').value.split(';');
            _styles2.forEach(function (style) {
              if (svg.trim(style) !== '') {
                var _style$split = style.split(':'),
                  _name4 = _style$split.name,
                  value = _style$split.value;

                _name4 = svg.trim(_name4);
                value = svg.trim(value);
                _this7.styles[_name4] = new svg.Property(_name4, value);
              }
            });
          }

          // add id
          if (this.attribute('id').hasValue()) {
            if (svg.Definitions[this.attribute('id').value] == null) {
              svg.Definitions[this.attribute('id').value] = this;
            }
          }
        }
      }

      // get or create attribute


      createClass(_class4, [{
        key: 'attribute',
        value: function attribute(name, createIfNotExists) {
          var a = this.attributes[name];
          if (a != null) return a;

          if (createIfNotExists === true) {
            a = new svg.Property(name, '');
            this.attributes[name] = a;
          }
          return a || svg.EmptyProperty;
        }
      }, {
        key: 'getHrefAttribute',
        value: function getHrefAttribute() {
          for (var a in this.attributes) {
            if (a.match(/:href$/)) {
              return this.attributes[a];
            }
          }
          return svg.EmptyProperty;
        }

        // get or create style, crawls up node tree

      }, {
        key: 'style',
        value: function style(name, createIfNotExists, skipAncestors) {
          var s = this.styles[name];
          if (s != null) return s;

          var a = this.attribute(name);
          if (a != null && a.hasValue()) {
            this.styles[name] = a; // move up to me to cache
            return a;
          }

          if (skipAncestors !== true) {
            var p = this.parent;
            if (p != null) {
              var ps = p.style(name);
              if (ps != null && ps.hasValue()) {
                return ps;
              }
            }
          }

          if (createIfNotExists === true) {
            s = new svg.Property(name, '');
            this.styles[name] = s;
          }
          return s || svg.EmptyProperty;
        }

        // base render

      }, {
        key: 'render',
        value: function render(ctx) {
          // don't render display=none
          if (this.style('display').value === 'none') return;

          // don't render visibility=hidden
          if (this.style('visibility').value === 'hidden') return;

          ctx.save();
          if (this.attribute('mask').hasValue()) {
            // mask
            var mask = this.attribute('mask').getDefinition();
            if (mask != null) mask.apply(ctx, this);
          } else if (this.style('filter').hasValue()) {
            // filter
            var filter = this.style('filter').getDefinition();
            if (filter != null) filter.apply(ctx, this);
          } else {
            this.setContext(ctx);
            this.renderChildren(ctx);
            this.clearContext(ctx);
          }
          ctx.restore();
        }

        // base set context

      }, {
        key: 'setContext',
        value: function setContext(ctx) {}
        // OVERRIDE ME!


        // base clear context

      }, {
        key: 'clearContext',
        value: function clearContext(ctx) {}
        // OVERRIDE ME!


        // base render children

      }, {
        key: 'renderChildren',
        value: function renderChildren(ctx) {
          this.children.forEach(function (child) {
            child.render(ctx);
          });
        }
      }, {
        key: 'addChild',
        value: function addChild(childNode, create) {
          var child = create ? svg.CreateElement(childNode) : childNode;
          child.parent = this;
          if (child.type !== 'title') {
            this.children.push(child);
          }
        }
      }]);
      return _class4;
    }();

    svg.Element.RenderedElementBase = function (_svg$Element$ElementB) {
      inherits(_class5, _svg$Element$ElementB);

      function _class5() {
        classCallCheck(this, _class5);
        return possibleConstructorReturn(this, (_class5.__proto__ || Object.getPrototypeOf(_class5)).apply(this, arguments));
      }

      createClass(_class5, [{
        key: 'setContext',
        value: function setContext(ctx) {
          // fill
          if (this.style('fill').isUrlDefinition()) {
            var fs = this.style('fill').getFillStyleDefinition(this, this.style('fill-opacity'));
            if (fs != null) ctx.fillStyle = fs;
          } else if (this.style('fill').hasValue()) {
            var fillStyle = this.style('fill');
            if (fillStyle.value === 'currentColor') fillStyle.value = this.style('color').value;
            ctx.fillStyle = fillStyle.value === 'none' ? 'rgba(0,0,0,0)' : fillStyle.value;
          }
          if (this.style('fill-opacity').hasValue()) {
            var _fillStyle = new svg.Property('fill', ctx.fillStyle);
            _fillStyle = _fillStyle.addOpacity(this.style('fill-opacity'));
            ctx.fillStyle = _fillStyle.value;
          }

          // stroke
          if (this.style('stroke').isUrlDefinition()) {
            var _fs = this.style('stroke').getFillStyleDefinition(this, this.style('stroke-opacity'));
            if (_fs != null) ctx.strokeStyle = _fs;
          } else if (this.style('stroke').hasValue()) {
            var strokeStyle = this.style('stroke');
            if (strokeStyle.value === 'currentColor') strokeStyle.value = this.style('color').value;
            ctx.strokeStyle = strokeStyle.value === 'none' ? 'rgba(0,0,0,0)' : strokeStyle.value;
          }
          if (this.style('stroke-opacity').hasValue()) {
            var _strokeStyle = new svg.Property('stroke', ctx.strokeStyle);
            _strokeStyle = _strokeStyle.addOpacity(this.style('stroke-opacity'));
            ctx.strokeStyle = _strokeStyle.value;
          }
          if (this.style('stroke-width').hasValue()) {
            var newLineWidth = this.style('stroke-width').toPixels();
            ctx.lineWidth = newLineWidth === 0 ? 0.001 : newLineWidth; // browsers don't respect 0
          }
          if (this.style('stroke-linecap').hasValue()) ctx.lineCap = this.style('stroke-linecap').value;
          if (this.style('stroke-linejoin').hasValue()) ctx.lineJoin = this.style('stroke-linejoin').value;
          if (this.style('stroke-miterlimit').hasValue()) ctx.miterLimit = this.style('stroke-miterlimit').value;
          if (this.style('stroke-dasharray').hasValue() && this.style('stroke-dasharray').value !== 'none') {
            var gaps = svg.ToNumberArray(this.style('stroke-dasharray').value);
            if (typeof ctx.setLineDash !== 'undefined') {
              ctx.setLineDash(gaps);
            } else if (typeof ctx.webkitLineDash !== 'undefined') {
              ctx.webkitLineDash = gaps;
            } else if (typeof ctx.mozDash !== 'undefined' && !(gaps.length === 1 && gaps[0] === 0)) {
              ctx.mozDash = gaps;
            }

            var offset = this.style('stroke-dashoffset').numValueOrDefault(1);
            if (typeof ctx.lineDashOffset !== 'undefined') {
              ctx.lineDashOffset = offset;
            } else if (typeof ctx.webkitLineDashOffset !== 'undefined') {
              ctx.webkitLineDashOffset = offset;
            } else if (typeof ctx.mozDashOffset !== 'undefined') {
              ctx.mozDashOffset = offset;
            }
          }

          // font
          if (typeof ctx.font !== 'undefined') {
            ctx.font = svg.Font.CreateFont(this.style('font-style').value, this.style('font-variant').value, this.style('font-weight').value, this.style('font-size').hasValue() ? this.style('font-size').toPixels() + 'px' : '', this.style('font-family').value).toString();
          }

          // transform
          if (this.attribute('transform').hasValue()) {
            var transform = new svg.Transform(this.attribute('transform').value);
            transform.apply(ctx);
          }

          // clip
          if (this.style('clip-path', false, true).hasValue()) {
            var clip = this.style('clip-path', false, true).getDefinition();
            if (clip != null) clip.apply(ctx);
          }

          // opacity
          if (this.style('opacity').hasValue()) {
            ctx.globalAlpha = this.style('opacity').numValue();
          }
        }
      }]);
      return _class5;
    }(svg.Element.ElementBase);

    svg.Element.PathElementBase = function (_svg$Element$Rendered) {
      inherits(_class6, _svg$Element$Rendered);

      function _class6() {
        classCallCheck(this, _class6);
        return possibleConstructorReturn(this, (_class6.__proto__ || Object.getPrototypeOf(_class6)).apply(this, arguments));
      }

      createClass(_class6, [{
        key: 'path',
        value: function path(ctx) {
          if (ctx != null) ctx.beginPath();
          return new svg.BoundingBox();
        }
      }, {
        key: 'renderChildren',
        value: function renderChildren(ctx) {
          this.path(ctx);
          svg.Mouse.checkPath(this, ctx);
          if (ctx.fillStyle !== '') {
            if (this.style('fill-rule').valueOrDefault('inherit') !== 'inherit') {
              ctx.fill(this.style('fill-rule').value);
            } else {
              ctx.fill();
            }
          }
          if (ctx.strokeStyle !== '') ctx.stroke();

          var markers = this.getMarkers();
          if (markers != null) {
            if (this.style('marker-start').isUrlDefinition()) {
              var marker = this.style('marker-start').getDefinition();
              marker.render(ctx, markers[0][0], markers[0][1]);
            }
            if (this.style('marker-mid').isUrlDefinition()) {
              var _marker = this.style('marker-mid').getDefinition();
              for (var i = 1; i < markers.length - 1; i++) {
                _marker.render(ctx, markers[i][0], markers[i][1]);
              }
            }
            if (this.style('marker-end').isUrlDefinition()) {
              var _marker2 = this.style('marker-end').getDefinition();
              _marker2.render(ctx, markers[markers.length - 1][0], markers[markers.length - 1][1]);
            }
          }
        }
      }, {
        key: 'getBoundingBox',
        value: function getBoundingBox() {
          return this.path();
        }
      }, {
        key: 'getMarkers',
        value: function getMarkers() {
          return null;
        }
      }]);
      return _class6;
    }(svg.Element.RenderedElementBase);

    // svg element
    svg.Element.svg = function (_svg$Element$Rendered2) {
      inherits(_class7, _svg$Element$Rendered2);

      function _class7() {
        classCallCheck(this, _class7);
        return possibleConstructorReturn(this, (_class7.__proto__ || Object.getPrototypeOf(_class7)).apply(this, arguments));
      }

      createClass(_class7, [{
        key: 'clearContext',
        value: function clearContext(ctx) {
          get(_class7.prototype.__proto__ || Object.getPrototypeOf(_class7.prototype), 'clearContext', this).call(this, ctx);
          svg.ViewPort.RemoveCurrent();
        }
      }, {
        key: 'setContext',
        value: function setContext(ctx) {
          // initial values and defaults
          ctx.strokeStyle = 'rgba(0,0,0,0)';
          ctx.lineCap = 'butt';
          ctx.lineJoin = 'miter';
          ctx.miterLimit = 4;
          if (typeof ctx.font !== 'undefined' && typeof window.getComputedStyle !== 'undefined') {
            ctx.font = window.getComputedStyle(ctx.canvas).getPropertyValue('font');
          }

          get(_class7.prototype.__proto__ || Object.getPrototypeOf(_class7.prototype), 'setContext', this).call(this, ctx);

          // create new view port
          if (!this.attribute('x').hasValue()) this.attribute('x', true).value = 0;
          if (!this.attribute('y').hasValue()) this.attribute('y', true).value = 0;
          ctx.translate(this.attribute('x').toPixels('x'), this.attribute('y').toPixels('y'));

          var width = svg.ViewPort.width();
          var height = svg.ViewPort.height();

          if (!this.attribute('width').hasValue()) this.attribute('width', true).value = '100%';
          if (!this.attribute('height').hasValue()) this.attribute('height', true).value = '100%';
          if (typeof this.root === 'undefined') {
            width = this.attribute('width').toPixels('x');
            height = this.attribute('height').toPixels('y');

            var x = 0;
            var y = 0;
            if (this.attribute('refX').hasValue() && this.attribute('refY').hasValue()) {
              x = -this.attribute('refX').toPixels('x');
              y = -this.attribute('refY').toPixels('y');
            }

            if (this.attribute('overflow').valueOrDefault('hidden') !== 'visible') {
              ctx.beginPath();
              ctx.moveTo(x, y);
              ctx.lineTo(width, y);
              ctx.lineTo(width, height);
              ctx.lineTo(x, height);
              ctx.closePath();
              ctx.clip();
            }
          }
          svg.ViewPort.SetCurrent(width, height);

          // viewbox
          if (this.attribute('viewBox').hasValue()) {
            var viewBox = svg.ToNumberArray(this.attribute('viewBox').value);
            var minX = viewBox[0];
            var minY = viewBox[1];
            width = viewBox[2];
            height = viewBox[3];

            svg.AspectRatio(ctx, this.attribute('preserveAspectRatio').value, svg.ViewPort.width(), width, svg.ViewPort.height(), height, minX, minY, this.attribute('refX').value, this.attribute('refY').value);

            svg.ViewPort.RemoveCurrent();
            svg.ViewPort.SetCurrent(viewBox[2], viewBox[3]);
          }
        }
      }]);
      return _class7;
    }(svg.Element.RenderedElementBase);

    // rect element
    svg.Element.rect = function (_svg$Element$PathElem) {
      inherits(_class8, _svg$Element$PathElem);

      function _class8() {
        classCallCheck(this, _class8);
        return possibleConstructorReturn(this, (_class8.__proto__ || Object.getPrototypeOf(_class8)).apply(this, arguments));
      }

      createClass(_class8, [{
        key: 'path',
        value: function path(ctx) {
          var x = this.attribute('x').toPixels('x');
          var y = this.attribute('y').toPixels('y');
          var width = this.attribute('width').toPixels('x');
          var height = this.attribute('height').toPixels('y');
          var rx = this.attribute('rx').toPixels('x');
          var ry = this.attribute('ry').toPixels('y');
          if (this.attribute('rx').hasValue() && !this.attribute('ry').hasValue()) ry = rx;
          if (this.attribute('ry').hasValue() && !this.attribute('rx').hasValue()) rx = ry;
          rx = Math.min(rx, width / 2.0);
          ry = Math.min(ry, height / 2.0);
          if (ctx != null) {
            ctx.beginPath();
            ctx.moveTo(x + rx, y);
            ctx.lineTo(x + width - rx, y);
            ctx.quadraticCurveTo(x + width, y, x + width, y + ry);
            ctx.lineTo(x + width, y + height - ry);
            ctx.quadraticCurveTo(x + width, y + height, x + width - rx, y + height);
            ctx.lineTo(x + rx, y + height);
            ctx.quadraticCurveTo(x, y + height, x, y + height - ry);
            ctx.lineTo(x, y + ry);
            ctx.quadraticCurveTo(x, y, x + rx, y);
            ctx.closePath();
          }

          return new svg.BoundingBox(x, y, x + width, y + height);
        }
      }]);
      return _class8;
    }(svg.Element.PathElementBase);

    // circle element
    svg.Element.circle = function (_svg$Element$PathElem2) {
      inherits(_class9, _svg$Element$PathElem2);

      function _class9() {
        classCallCheck(this, _class9);
        return possibleConstructorReturn(this, (_class9.__proto__ || Object.getPrototypeOf(_class9)).apply(this, arguments));
      }

      createClass(_class9, [{
        key: 'path',
        value: function path(ctx) {
          var cx = this.attribute('cx').toPixels('x');
          var cy = this.attribute('cy').toPixels('y');
          var r = this.attribute('r').toPixels();

          if (ctx != null) {
            ctx.beginPath();
            ctx.arc(cx, cy, r, 0, Math.PI * 2, true);
            ctx.closePath();
          }

          return new svg.BoundingBox(cx - r, cy - r, cx + r, cy + r);
        }
      }]);
      return _class9;
    }(svg.Element.PathElementBase);

    // ellipse element
    var KAPPA = 4 * ((Math.sqrt(2) - 1) / 3);
    svg.Element.ellipse = function (_svg$Element$PathElem3) {
      inherits(_class10, _svg$Element$PathElem3);

      function _class10() {
        classCallCheck(this, _class10);
        return possibleConstructorReturn(this, (_class10.__proto__ || Object.getPrototypeOf(_class10)).apply(this, arguments));
      }

      createClass(_class10, [{
        key: 'path',
        value: function path(ctx) {
          var rx = this.attribute('rx').toPixels('x');
          var ry = this.attribute('ry').toPixels('y');
          var cx = this.attribute('cx').toPixels('x');
          var cy = this.attribute('cy').toPixels('y');

          if (ctx != null) {
            ctx.beginPath();
            ctx.moveTo(cx, cy - ry);
            ctx.bezierCurveTo(cx + KAPPA * rx, cy - ry, cx + rx, cy - KAPPA * ry, cx + rx, cy);
            ctx.bezierCurveTo(cx + rx, cy + KAPPA * ry, cx + KAPPA * rx, cy + ry, cx, cy + ry);
            ctx.bezierCurveTo(cx - KAPPA * rx, cy + ry, cx - rx, cy + KAPPA * ry, cx - rx, cy);
            ctx.bezierCurveTo(cx - rx, cy - KAPPA * ry, cx - KAPPA * rx, cy - ry, cx, cy - ry);
            ctx.closePath();
          }

          return new svg.BoundingBox(cx - rx, cy - ry, cx + rx, cy + ry);
        }
      }]);
      return _class10;
    }(svg.Element.PathElementBase);

    // line element
    svg.Element.line = function (_svg$Element$PathElem4) {
      inherits(_class11, _svg$Element$PathElem4);

      function _class11() {
        classCallCheck(this, _class11);
        return possibleConstructorReturn(this, (_class11.__proto__ || Object.getPrototypeOf(_class11)).apply(this, arguments));
      }

      createClass(_class11, [{
        key: 'getPoints',
        value: function getPoints() {
          return [new svg.Point(this.attribute('x1').toPixels('x'), this.attribute('y1').toPixels('y')), new svg.Point(this.attribute('x2').toPixels('x'), this.attribute('y2').toPixels('y'))];
        }
      }, {
        key: 'path',
        value: function path(ctx) {
          var points = this.getPoints();

          if (ctx != null) {
            ctx.beginPath();
            ctx.moveTo(points[0].x, points[0].y);
            ctx.lineTo(points[1].x, points[1].y);
          }

          return new svg.BoundingBox(points[0].x, points[0].y, points[1].x, points[1].y);
        }
      }, {
        key: 'getMarkers',
        value: function getMarkers() {
          var points = this.getPoints();
          var a = points[0].angleTo(points[1]);
          return [
            [points[0], a],
            [points[1], a]
          ];
        }
      }]);
      return _class11;
    }(svg.Element.PathElementBase);

    // polyline element
    svg.Element.polyline = function (_svg$Element$PathElem5) {
      inherits(_class12, _svg$Element$PathElem5);

      function _class12(node) {
        classCallCheck(this, _class12);

        var _this15 = possibleConstructorReturn(this, (_class12.__proto__ || Object.getPrototypeOf(_class12)).call(this, node));

        _this15.points = svg.CreatePath(_this15.attribute('points').value);
        return _this15;
      }

      createClass(_class12, [{
        key: 'path',
        value: function path(ctx) {
          var _points$ = this.points[0],
            x = _points$.x,
            y = _points$.y;

          var bb = new svg.BoundingBox(x, y);
          if (ctx != null) {
            ctx.beginPath();
            ctx.moveTo(x, y);
          }
          for (var i = 1; i < this.points.length; i++) {
            var _points$i = this.points[i],
              _x = _points$i.x,
              _y = _points$i.y;

            bb.addPoint(_x, _y);
            if (ctx != null) ctx.lineTo(_x, _y);
          }
          return bb;
        }
      }, {
        key: 'getMarkers',
        value: function getMarkers() {
          var markers = [];
          for (var i = 0; i < this.points.length - 1; i++) {
            markers.push([this.points[i], this.points[i].angleTo(this.points[i + 1])]);
          }
          markers.push([this.points[this.points.length - 1], markers[markers.length - 1][1]]);
          return markers;
        }
      }]);
      return _class12;
    }(svg.Element.PathElementBase);

    // polygon element
    svg.Element.polygon = function (_svg$Element$polyline) {
      inherits(_class13, _svg$Element$polyline);

      function _class13() {
        classCallCheck(this, _class13);
        return possibleConstructorReturn(this, (_class13.__proto__ || Object.getPrototypeOf(_class13)).apply(this, arguments));
      }

      createClass(_class13, [{
        key: 'path',
        value: function path(ctx) {
          var bb = get(_class13.prototype.__proto__ || Object.getPrototypeOf(_class13.prototype), 'path', this).call(this, ctx);
          if (ctx != null) {
            ctx.lineTo(this.points[0].x, this.points[0].y);
            ctx.closePath();
          }
          return bb;
        }
      }]);
      return _class13;
    }(svg.Element.polyline);

    // path element
    svg.Element.path = function (_svg$Element$PathElem6) {
      inherits(_class14, _svg$Element$PathElem6);

      function _class14(node) {
        classCallCheck(this, _class14);

        var _this17 = possibleConstructorReturn(this, (_class14.__proto__ || Object.getPrototypeOf(_class14)).call(this, node));

        var d = _this17.attribute('d').value
          // TODO: convert to real lexer based on https://www.w3.org/TR/SVG11/paths.html#PathDataBNF
          .replace(/,/gm, ' ') // get rid of all commas
          .replace(/([MmZzLlHhVvCcSsQqTtAa])([MmZzLlHhVvCcSsQqTtAa])/gm, '$1 $2') // separate commands from commands
          .replace(/([MmZzLlHhVvCcSsQqTtAa])([MmZzLlHhVvCcSsQqTtAa])/gm, '$1 $2') // separate commands from commands
          .replace(/([MmZzLlHhVvCcSsQqTtAa])([^\s])/gm, '$1 $2') // separate commands from points
          .replace(/([^\s])([MmZzLlHhVvCcSsQqTtAa])/gm, '$1 $2') // separate commands from points
          .replace(/([0-9])([+-])/gm, '$1 $2') // separate digits when no comma
          .replace(/(\.[0-9]*)(\.)/gm, '$1 $2') // separate digits when no comma
          .replace(/([Aa](\s+[0-9]+){3})\s+([01])\s*([01])/gm, '$1 $3 $4 '); // shorthand elliptical arc path syntax
        d = svg.compressSpaces(d); // compress multiple spaces
        d = svg.trim(d);
        _this17.PathParser = {
          tokens: d.split(' '),

          reset: function reset() {
            this.i = -1;
            this.command = '';
            this.previousCommand = '';
            this.start = new svg.Point(0, 0);
            this.control = new svg.Point(0, 0);
            this.current = new svg.Point(0, 0);
            this.points = [];
            this.angles = [];
          },
          isEnd: function isEnd() {
            return this.i >= this.tokens.length - 1;
          },
          isCommandOrEnd: function isCommandOrEnd() {
            if (this.isEnd()) return true;
            return this.tokens[this.i + 1].match(/^[A-Za-z]$/) != null;
          },
          isRelativeCommand: function isRelativeCommand() {
            switch (this.command) {
              case 'm':
              case 'l':
              case 'h':
              case 'v':
              case 'c':
              case 's':
              case 'q':
              case 't':
              case 'a':
              case 'z':
                return true;
            }
            return false;
          },
          getToken: function getToken() {
            this.i++;
            return this.tokens[this.i];
          },
          getScalar: function getScalar() {
            return parseFloat(this.getToken());
          },
          nextCommand: function nextCommand() {
            this.previousCommand = this.command;
            this.command = this.getToken();
          },
          getPoint: function getPoint() {
            var p = new svg.Point(this.getScalar(), this.getScalar());
            return this.makeAbsolute(p);
          },
          getAsControlPoint: function getAsControlPoint() {
            var p = this.getPoint();
            this.control = p;
            return p;
          },
          getAsCurrentPoint: function getAsCurrentPoint() {
            var p = this.getPoint();
            this.current = p;
            return p;
          },
          getReflectedControlPoint: function getReflectedControlPoint() {
            if (this.previousCommand.toLowerCase() !== 'c' && this.previousCommand.toLowerCase() !== 's' && this.previousCommand.toLowerCase() !== 'q' && this.previousCommand.toLowerCase() !== 't') {
              return this.current;
            }

            // reflect point
            var p = new svg.Point(2 * this.current.x - this.control.x, 2 * this.current.y - this.control.y);
            return p;
          },
          makeAbsolute: function makeAbsolute(p) {
            if (this.isRelativeCommand()) {
              p.x += this.current.x;
              p.y += this.current.y;
            }
            return p;
          },
          addMarker: function addMarker(p, from, priorTo) {
            // if the last angle isn't filled in because we didn't have this point yet ...
            if (priorTo != null && this.angles.length > 0 && this.angles[this.angles.length - 1] == null) {
              this.angles[this.angles.length - 1] = this.points[this.points.length - 1].angleTo(priorTo);
            }
            this.addMarkerAngle(p, from == null ? null : from.angleTo(p));
          },
          addMarkerAngle: function addMarkerAngle(p, a) {
            this.points.push(p);
            this.angles.push(a);
          },
          getMarkerPoints: function getMarkerPoints() {
            return this.points;
          },
          getMarkerAngles: function getMarkerAngles() {
            for (var i = 0; i < this.angles.length; i++) {
              if (this.angles[i] == null) {
                for (var j = i + 1; j < this.angles.length; j++) {
                  if (this.angles[j] != null) {
                    this.angles[i] = this.angles[j];
                    break;
                  }
                }
              }
            }
            return this.angles;
          }
        };
        return _this17;
      }

      createClass(_class14, [{
        key: 'path',
        value: function path(ctx) {
          var pp = this.PathParser;
          pp.reset();

          var bb = new svg.BoundingBox();
          if (ctx != null) ctx.beginPath();
          while (!pp.isEnd()) {
            pp.nextCommand();
            switch (pp.command) {
              case 'M':
              case 'm':
                var p = pp.getAsCurrentPoint();
                pp.addMarker(p);
                bb.addPoint(p.x, p.y);
                if (ctx != null) ctx.moveTo(p.x, p.y);
                pp.start = pp.current;
                while (!pp.isCommandOrEnd()) {
                  var _p = pp.getAsCurrentPoint();
                  pp.addMarker(_p, pp.start);
                  bb.addPoint(_p.x, _p.y);
                  if (ctx != null) ctx.lineTo(_p.x, _p.y);
                }
                break;
              case 'L':
              case 'l':
                while (!pp.isCommandOrEnd()) {
                  var _c = pp.current;
                  var _p2 = pp.getAsCurrentPoint();
                  pp.addMarker(_p2, _c);
                  bb.addPoint(_p2.x, _p2.y);
                  if (ctx != null) ctx.lineTo(_p2.x, _p2.y);
                }
                break;
              case 'H':
              case 'h':
                while (!pp.isCommandOrEnd()) {
                  var newP = new svg.Point((pp.isRelativeCommand() ? pp.current.x : 0) + pp.getScalar(), pp.current.y);
                  pp.addMarker(newP, pp.current);
                  pp.current = newP;
                  bb.addPoint(pp.current.x, pp.current.y);
                  if (ctx != null) ctx.lineTo(pp.current.x, pp.current.y);
                }
                break;
              case 'V':
              case 'v':
                while (!pp.isCommandOrEnd()) {
                  var _newP = new svg.Point(pp.current.x, (pp.isRelativeCommand() ? pp.current.y : 0) + pp.getScalar());
                  pp.addMarker(_newP, pp.current);
                  pp.current = _newP;
                  bb.addPoint(pp.current.x, pp.current.y);
                  if (ctx != null) ctx.lineTo(pp.current.x, pp.current.y);
                }
                break;
              case 'C':
              case 'c':
                while (!pp.isCommandOrEnd()) {
                  var curr = pp.current;
                  var p1 = pp.getPoint();
                  var cntrl = pp.getAsControlPoint();
                  var cp = pp.getAsCurrentPoint();
                  pp.addMarker(cp, cntrl, p1);
                  bb.addBezierCurve(curr.x, curr.y, p1.x, p1.y, cntrl.x, cntrl.y, cp.x, cp.y);
                  if (ctx != null) ctx.bezierCurveTo(p1.x, p1.y, cntrl.x, cntrl.y, cp.x, cp.y);
                }
                break;
              case 'S':
              case 's':
                while (!pp.isCommandOrEnd()) {
                  var _curr = pp.current;
                  var _p3 = pp.getReflectedControlPoint();
                  var _cntrl = pp.getAsControlPoint();
                  var _cp = pp.getAsCurrentPoint();
                  pp.addMarker(_cp, _cntrl, _p3);
                  bb.addBezierCurve(_curr.x, _curr.y, _p3.x, _p3.y, _cntrl.x, _cntrl.y, _cp.x, _cp.y);
                  if (ctx != null) ctx.bezierCurveTo(_p3.x, _p3.y, _cntrl.x, _cntrl.y, _cp.x, _cp.y);
                }
                break;
              case 'Q':
              case 'q':
                while (!pp.isCommandOrEnd()) {
                  var _curr2 = pp.current;
                  var _cntrl2 = pp.getAsControlPoint();
                  var _cp2 = pp.getAsCurrentPoint();
                  pp.addMarker(_cp2, _cntrl2, _cntrl2);
                  bb.addQuadraticCurve(_curr2.x, _curr2.y, _cntrl2.x, _cntrl2.y, _cp2.x, _cp2.y);
                  if (ctx != null) ctx.quadraticCurveTo(_cntrl2.x, _cntrl2.y, _cp2.x, _cp2.y);
                }
                break;
              case 'T':
              case 't':
                while (!pp.isCommandOrEnd()) {
                  var _curr3 = pp.current;
                  var _cntrl3 = pp.getReflectedControlPoint();
                  pp.control = _cntrl3;
                  var _cp3 = pp.getAsCurrentPoint();
                  pp.addMarker(_cp3, _cntrl3, _cntrl3);
                  bb.addQuadraticCurve(_curr3.x, _curr3.y, _cntrl3.x, _cntrl3.y, _cp3.x, _cp3.y);
                  if (ctx != null) ctx.quadraticCurveTo(_cntrl3.x, _cntrl3.y, _cp3.x, _cp3.y);
                }
                break;
              case 'A':
              case 'a':
                var _loop2 = function _loop2() {
                  var curr = pp.current;
                  var rx = pp.getScalar();
                  var ry = pp.getScalar();
                  var xAxisRotation = pp.getScalar() * (Math.PI / 180.0);
                  var largeArcFlag = pp.getScalar();
                  var sweepFlag = pp.getScalar();
                  var cp = pp.getAsCurrentPoint();

                  // Conversion from endpoint to center parameterization
                  // https://www.w3.org/TR/SVG11/implnote.html#ArcConversionEndpointToCenter

                  // x1', y1'
                  var currp = new svg.Point(Math.cos(xAxisRotation) * (curr.x - cp.x) / 2.0 + Math.sin(xAxisRotation) * (curr.y - cp.y) / 2.0, -Math.sin(xAxisRotation) * (curr.x - cp.x) / 2.0 + Math.cos(xAxisRotation) * (curr.y - cp.y) / 2.0);
                  // adjust radii
                  var l = Math.pow(currp.x, 2) / Math.pow(rx, 2) + Math.pow(currp.y, 2) / Math.pow(ry, 2);
                  if (l > 1) {
                    rx *= Math.sqrt(l);
                    ry *= Math.sqrt(l);
                  }
                  // cx', cy'
                  var s = (largeArcFlag === sweepFlag ? -1 : 1) * Math.sqrt((Math.pow(rx, 2) * Math.pow(ry, 2) - Math.pow(rx, 2) * Math.pow(currp.y, 2) - Math.pow(ry, 2) * Math.pow(currp.x, 2)) / (Math.pow(rx, 2) * Math.pow(currp.y, 2) + Math.pow(ry, 2) * Math.pow(currp.x, 2)));
                  if (isNaN(s)) s = 0;
                  var cpp = new svg.Point(s * rx * currp.y / ry, s * -ry * currp.x / rx);
                  // cx, cy
                  var centp = new svg.Point((curr.x + cp.x) / 2.0 + Math.cos(xAxisRotation) * cpp.x - Math.sin(xAxisRotation) * cpp.y, (curr.y + cp.y) / 2.0 + Math.sin(xAxisRotation) * cpp.x + Math.cos(xAxisRotation) * cpp.y);
                  // vector magnitude
                  var m = function m(v) {
                    return Math.sqrt(Math.pow(v[0], 2) + Math.pow(v[1], 2));
                  };
                  // ratio between two vectors
                  var r = function r(u, v) {
                    return (u[0] * v[0] + u[1] * v[1]) / (m(u) * m(v));
                  };
                  // angle between two vectors
                  var a = function a(u, v) {
                    return (u[0] * v[1] < u[1] * v[0] ? -1 : 1) * Math.acos(r(u, v));
                  };
                  // initial angle
                  var a1 = a([1, 0], [(currp.x - cpp.x) / rx, (currp.y - cpp.y) / ry]);
                  // angle delta
                  var u = [(currp.x - cpp.x) / rx, (currp.y - cpp.y) / ry];
                  var v = [(-currp.x - cpp.x) / rx, (-currp.y - cpp.y) / ry];
                  var ad = a(u, v);
                  if (r(u, v) <= -1) ad = Math.PI;
                  if (r(u, v) >= 1) ad = 0;

                  // for markers
                  var dir = 1 - sweepFlag ? 1.0 : -1.0;
                  var ah = a1 + dir * (ad / 2.0);
                  var halfWay = new svg.Point(centp.x + rx * Math.cos(ah), centp.y + ry * Math.sin(ah));
                  pp.addMarkerAngle(halfWay, ah - dir * Math.PI / 2);
                  pp.addMarkerAngle(cp, ah - dir * Math.PI);

                  bb.addPoint(cp.x, cp.y); // TODO: this is too naive, make it better
                  if (ctx != null) {
                    var _r = rx > ry ? rx : ry;
                    var sx = rx > ry ? 1 : rx / ry;
                    var sy = rx > ry ? ry / rx : 1;

                    ctx.translate(centp.x, centp.y);
                    ctx.rotate(xAxisRotation);
                    ctx.scale(sx, sy);
                    ctx.arc(0, 0, _r, a1, a1 + ad, 1 - sweepFlag);
                    ctx.scale(1 / sx, 1 / sy);
                    ctx.rotate(-xAxisRotation);
                    ctx.translate(-centp.x, -centp.y);
                  }
                };

                while (!pp.isCommandOrEnd()) {
                  _loop2();
                }
                break;
              case 'Z':
              case 'z':
                if (ctx != null) ctx.closePath();
                pp.current = pp.start;
            }
          }

          return bb;
        }
      }, {
        key: 'getMarkers',
        value: function getMarkers() {
          var points = this.PathParser.getMarkerPoints();
          var angles = this.PathParser.getMarkerAngles();

          var markers = points.map(function (point, i) {
            return [point, angles[i]];
          });
          return markers;
        }
      }]);
      return _class14;
    }(svg.Element.PathElementBase);

    // pattern element
    svg.Element.pattern = function (_svg$Element$ElementB2) {
      inherits(_class15, _svg$Element$ElementB2);

      function _class15() {
        classCallCheck(this, _class15);
        return possibleConstructorReturn(this, (_class15.__proto__ || Object.getPrototypeOf(_class15)).apply(this, arguments));
      }

      createClass(_class15, [{
        key: 'createPattern',
        value: function createPattern(ctx, element) {
          var width = this.attribute('width').toPixels('x', true);
          var height = this.attribute('height').toPixels('y', true);

          // render me using a temporary svg element
          var tempSvg = new svg.Element.svg();
          tempSvg.attributes['viewBox'] = new svg.Property('viewBox', this.attribute('viewBox').value);
          tempSvg.attributes['width'] = new svg.Property('width', width + 'px');
          tempSvg.attributes['height'] = new svg.Property('height', height + 'px');
          tempSvg.attributes['transform'] = new svg.Property('transform', this.attribute('patternTransform').value);
          tempSvg.children = this.children;

          var c = document.createElement('canvas');
          c.width = width;
          c.height = height;
          var cctx = c.getContext('2d');
          if (this.attribute('x').hasValue() && this.attribute('y').hasValue()) {
            cctx.translate(this.attribute('x').toPixels('x', true), this.attribute('y').toPixels('y', true));
          }
          // render 3x3 grid so when we transform there's no white space on edges
          for (var x = -1; x <= 1; x++) {
            for (var y = -1; y <= 1; y++) {
              cctx.save();
              cctx.translate(x * c.width, y * c.height);
              tempSvg.render(cctx);
              cctx.restore();
            }
          }
          var pattern = ctx.createPattern(c, 'repeat');
          return pattern;
        }
      }]);
      return _class15;
    }(svg.Element.ElementBase);

    // marker element
    svg.Element.marker = function (_svg$Element$ElementB3) {
      inherits(_class16, _svg$Element$ElementB3);

      function _class16() {
        classCallCheck(this, _class16);
        return possibleConstructorReturn(this, (_class16.__proto__ || Object.getPrototypeOf(_class16)).apply(this, arguments));
      }

      createClass(_class16, [{
        key: 'render',
        value: function render(ctx, point, angle) {
          ctx.translate(point.x, point.y);
          if (this.attribute('orient').valueOrDefault('auto') === 'auto') ctx.rotate(angle);
          if (this.attribute('markerUnits').valueOrDefault('strokeWidth') === 'strokeWidth') ctx.scale(ctx.lineWidth, ctx.lineWidth);
          ctx.save();

          // render me using a temporary svg element
          var tempSvg = new svg.Element.svg();
          tempSvg.attributes['viewBox'] = new svg.Property('viewBox', this.attribute('viewBox').value);
          tempSvg.attributes['refX'] = new svg.Property('refX', this.attribute('refX').value);
          tempSvg.attributes['refY'] = new svg.Property('refY', this.attribute('refY').value);
          tempSvg.attributes['width'] = new svg.Property('width', this.attribute('markerWidth').value);
          tempSvg.attributes['height'] = new svg.Property('height', this.attribute('markerHeight').value);
          tempSvg.attributes['fill'] = new svg.Property('fill', this.attribute('fill').valueOrDefault('black'));
          tempSvg.attributes['stroke'] = new svg.Property('stroke', this.attribute('stroke').valueOrDefault('none'));
          tempSvg.children = this.children;
          tempSvg.render(ctx);

          ctx.restore();
          if (this.attribute('markerUnits').valueOrDefault('strokeWidth') === 'strokeWidth') ctx.scale(1 / ctx.lineWidth, 1 / ctx.lineWidth);
          if (this.attribute('orient').valueOrDefault('auto') === 'auto') ctx.rotate(-angle);
          ctx.translate(-point.x, -point.y);
        }
      }]);
      return _class16;
    }(svg.Element.ElementBase);

    // definitions element
    svg.Element.defs = function (_svg$Element$ElementB4) {
      inherits(_class17, _svg$Element$ElementB4);

      function _class17() {
        classCallCheck(this, _class17);
        return possibleConstructorReturn(this, (_class17.__proto__ || Object.getPrototypeOf(_class17)).apply(this, arguments));
      }

      createClass(_class17, [{
        key: 'render',
        value: function render(ctx) {
          // NOOP
        }
      }]);
      return _class17;
    }(svg.Element.ElementBase);

    // base for gradients
    svg.Element.GradientBase = function (_svg$Element$ElementB5) {
      inherits(_class18, _svg$Element$ElementB5);

      function _class18(node) {
        classCallCheck(this, _class18);

        var _this21 = possibleConstructorReturn(this, (_class18.__proto__ || Object.getPrototypeOf(_class18)).call(this, node));

        _this21.gradientUnits = _this21.attribute('gradientUnits').valueOrDefault('objectBoundingBox');

        _this21.stops = [];
        _this21.children.forEach(function (child) {
          if (child.type === 'stop') {
            _this21.stops.push(child);
          }
        });
        return _this21;
      }

      createClass(_class18, [{
        key: 'getGradient',
        value: function getGradient() {
          // OVERRIDE ME!
        }
      }, {
        key: 'createGradient',
        value: function createGradient(ctx, element, parentOpacityProp) {
          var stopsContainer = this.getHrefAttribute().hasValue() ? this.getHrefAttribute().getDefinition() : this;

          var addParentOpacity = function addParentOpacity(color) {
            if (parentOpacityProp.hasValue()) {
              var p = new svg.Property('color', color);
              return p.addOpacity(parentOpacityProp).value;
            }
            return color;
          };

          var g = this.getGradient(ctx, element);
          if (g == null) return addParentOpacity(stopsContainer.stops[stopsContainer.stops.length - 1].color);
          stopsContainer.stops.forEach(function (_ref2) {
            var offset = _ref2.offset,
              color = _ref2.color;

            g.addColorStop(offset, addParentOpacity(color));
          });

          if (this.attribute('gradientTransform').hasValue()) {
            // render as transformed pattern on temporary canvas
            var rootView = svg.ViewPort.viewPorts[0];

            var rect = new svg.Element.rect();
            rect.attributes['x'] = new svg.Property('x', -svg.MAX_VIRTUAL_PIXELS / 3.0);
            rect.attributes['y'] = new svg.Property('y', -svg.MAX_VIRTUAL_PIXELS / 3.0);
            rect.attributes['width'] = new svg.Property('width', svg.MAX_VIRTUAL_PIXELS);
            rect.attributes['height'] = new svg.Property('height', svg.MAX_VIRTUAL_PIXELS);

            var group = new svg.Element.g();
            group.attributes['transform'] = new svg.Property('transform', this.attribute('gradientTransform').value);
            group.children = [rect];

            var tempSvg = new svg.Element.svg();
            tempSvg.attributes['x'] = new svg.Property('x', 0);
            tempSvg.attributes['y'] = new svg.Property('y', 0);
            tempSvg.attributes['width'] = new svg.Property('width', rootView.width);
            tempSvg.attributes['height'] = new svg.Property('height', rootView.height);
            tempSvg.children = [group];

            var _c2 = document.createElement('canvas');
            _c2.width = rootView.width;
            _c2.height = rootView.height;
            var tempCtx = _c2.getContext('2d');
            tempCtx.fillStyle = g;
            tempSvg.render(tempCtx);
            return tempCtx.createPattern(_c2, 'no-repeat');
          }

          return g;
        }
      }]);
      return _class18;
    }(svg.Element.ElementBase);

    // linear gradient element
    svg.Element.linearGradient = function (_svg$Element$Gradient) {
      inherits(_class19, _svg$Element$Gradient);

      function _class19() {
        classCallCheck(this, _class19);
        return possibleConstructorReturn(this, (_class19.__proto__ || Object.getPrototypeOf(_class19)).apply(this, arguments));
      }

      createClass(_class19, [{
        key: 'getGradient',
        value: function getGradient(ctx, element) {
          var bb = this.gradientUnits === 'objectBoundingBox' ? element.getBoundingBox() : null;

          if (!this.attribute('x1').hasValue() && !this.attribute('y1').hasValue() && !this.attribute('x2').hasValue() && !this.attribute('y2').hasValue()) {
            this.attribute('x1', true).value = 0;
            this.attribute('y1', true).value = 0;
            this.attribute('x2', true).value = 1;
            this.attribute('y2', true).value = 0;
          }

          var x1 = this.gradientUnits === 'objectBoundingBox' ? bb.x() + bb.width() * this.attribute('x1').numValue() : this.attribute('x1').toPixels('x');
          var y1 = this.gradientUnits === 'objectBoundingBox' ? bb.y() + bb.height() * this.attribute('y1').numValue() : this.attribute('y1').toPixels('y');
          var x2 = this.gradientUnits === 'objectBoundingBox' ? bb.x() + bb.width() * this.attribute('x2').numValue() : this.attribute('x2').toPixels('x');
          var y2 = this.gradientUnits === 'objectBoundingBox' ? bb.y() + bb.height() * this.attribute('y2').numValue() : this.attribute('y2').toPixels('y');

          if (x1 === x2 && y1 === y2) return null;
          return ctx.createLinearGradient(x1, y1, x2, y2);
        }
      }]);
      return _class19;
    }(svg.Element.GradientBase);

    // radial gradient element
    svg.Element.radialGradient = function (_svg$Element$Gradient2) {
      inherits(_class20, _svg$Element$Gradient2);

      function _class20() {
        classCallCheck(this, _class20);
        return possibleConstructorReturn(this, (_class20.__proto__ || Object.getPrototypeOf(_class20)).apply(this, arguments));
      }

      createClass(_class20, [{
        key: 'getGradient',
        value: function getGradient(ctx, element) {
          var bb = element.getBoundingBox();

          if (!this.attribute('cx').hasValue()) this.attribute('cx', true).value = '50%';
          if (!this.attribute('cy').hasValue()) this.attribute('cy', true).value = '50%';
          if (!this.attribute('r').hasValue()) this.attribute('r', true).value = '50%';

          var cx = this.gradientUnits === 'objectBoundingBox' ? bb.x() + bb.width() * this.attribute('cx').numValue() : this.attribute('cx').toPixels('x');
          var cy = this.gradientUnits === 'objectBoundingBox' ? bb.y() + bb.height() * this.attribute('cy').numValue() : this.attribute('cy').toPixels('y');

          var fx = cx;
          var fy = cy;
          if (this.attribute('fx').hasValue()) {
            fx = this.gradientUnits === 'objectBoundingBox' ? bb.x() + bb.width() * this.attribute('fx').numValue() : this.attribute('fx').toPixels('x');
          }
          if (this.attribute('fy').hasValue()) {
            fy = this.gradientUnits === 'objectBoundingBox' ? bb.y() + bb.height() * this.attribute('fy').numValue() : this.attribute('fy').toPixels('y');
          }

          var r = this.gradientUnits === 'objectBoundingBox' ? (bb.width() + bb.height()) / 2.0 * this.attribute('r').numValue() : this.attribute('r').toPixels();

          return ctx.createRadialGradient(fx, fy, 0, cx, cy, r);
        }
      }]);
      return _class20;
    }(svg.Element.GradientBase);

    // gradient stop element
    svg.Element.stop = function (_svg$Element$ElementB6) {
      inherits(_class21, _svg$Element$ElementB6);

      function _class21(node) {
        classCallCheck(this, _class21);

        var _this24 = possibleConstructorReturn(this, (_class21.__proto__ || Object.getPrototypeOf(_class21)).call(this, node));

        _this24.offset = _this24.attribute('offset').numValue();
        if (_this24.offset < 0) _this24.offset = 0;
        if (_this24.offset > 1) _this24.offset = 1;

        var stopColor = _this24.style('stop-color');
        if (_this24.style('stop-opacity').hasValue()) {
          stopColor = stopColor.addOpacity(_this24.style('stop-opacity'));
        }
        _this24.color = stopColor.value;
        return _this24;
      }

      return _class21;
    }(svg.Element.ElementBase);

    // animation base element
    svg.Element.AnimateBase = function (_svg$Element$ElementB7) {
      inherits(_class22, _svg$Element$ElementB7);

      function _class22(node) {
        classCallCheck(this, _class22);

        var _this25 = possibleConstructorReturn(this, (_class22.__proto__ || Object.getPrototypeOf(_class22)).call(this, node));

        svg.Animations.push(_this25);

        _this25.duration = 0.0;
        _this25.begin = _this25.attribute('begin').toMilliseconds();
        _this25.maxDuration = _this25.begin + _this25.attribute('dur').toMilliseconds();

        _this25.initialValue = null;
        _this25.initialUnits = '';
        _this25.removed = false;

        _this25.from = _this25.attribute('from');
        _this25.to = _this25.attribute('to');
        _this25.values = _this25.attribute('values');
        if (_this25.values.hasValue()) _this25.values.value = _this25.values.value.split(';');
        return _this25;
      }

      createClass(_class22, [{
        key: 'getProperty',
        value: function getProperty() {
          var attributeType = this.attribute('attributeType').value;
          var attributeName = this.attribute('attributeName').value;

          if (attributeType === 'CSS') {
            return this.parent.style(attributeName, true);
          }
          return this.parent.attribute(attributeName, true);
        }
      }, {
        key: 'calcValue',
        value: function calcValue() {
          // OVERRIDE ME!
          return '';
        }
      }, {
        key: 'update',
        value: function update(delta) {
          // set initial value
          if (this.initialValue == null) {
            this.initialValue = this.getProperty().value;
            this.initialUnits = this.getProperty().getUnits();
          }

          // if we're past the end time
          if (this.duration > this.maxDuration) {
            // loop for indefinitely repeating animations
            if (this.attribute('repeatCount').value === 'indefinite' || this.attribute('repeatDur').value === 'indefinite') {
              this.duration = 0.0;
            } else if (this.attribute('fill').valueOrDefault('remove') === 'freeze' && !this.frozen) {
              this.frozen = true;
              this.parent.animationFrozen = true;
              this.parent.animationFrozenValue = this.getProperty().value;
            } else if (this.attribute('fill').valueOrDefault('remove') === 'remove' && !this.removed) {
              this.removed = true;
              this.getProperty().value = this.parent.animationFrozen ? this.parent.animationFrozenValue : this.initialValue;
              return true;
            }
            return false;
          }
          this.duration = this.duration + delta;

          // if we're past the begin time
          var updated = false;
          if (this.begin < this.duration) {
            var newValue = this.calcValue(); // tween

            if (this.attribute('type').hasValue()) {
              // for transform, etc.
              var type = this.attribute('type').value;
              newValue = type + '(' + newValue + ')';
            }

            this.getProperty().value = newValue;
            updated = true;
          }

          return updated;
        }

        // fraction of duration we've covered

      }, {
        key: 'progress',
        value: function progress() {
          var ret = {
            progress: (this.duration - this.begin) / (this.maxDuration - this.begin)
          };
          if (this.values.hasValue()) {
            var p = ret.progress * (this.values.value.length - 1);
            var lb = Math.floor(p),
              ub = Math.ceil(p);
            ret.from = new svg.Property('from', parseFloat(this.values.value[lb]));
            ret.to = new svg.Property('to', parseFloat(this.values.value[ub]));
            ret.progress = (p - lb) / (ub - lb);
          } else {
            ret.from = this.from;
            ret.to = this.to;
          }
          return ret;
        }
      }]);
      return _class22;
    }(svg.Element.ElementBase);

    // animate element
    svg.Element.animate = function (_svg$Element$AnimateB) {
      inherits(_class23, _svg$Element$AnimateB);

      function _class23() {
        classCallCheck(this, _class23);
        return possibleConstructorReturn(this, (_class23.__proto__ || Object.getPrototypeOf(_class23)).apply(this, arguments));
      }

      createClass(_class23, [{
        key: 'calcValue',
        value: function calcValue() {
          var p = this.progress();

          // tween value linearly
          var newValue = p.from.numValue() + (p.to.numValue() - p.from.numValue()) * p.progress;
          return newValue + this.initialUnits;
        }
      }]);
      return _class23;
    }(svg.Element.AnimateBase);

    // animate color element
    svg.Element.animateColor = function (_svg$Element$AnimateB2) {
      inherits(_class24, _svg$Element$AnimateB2);

      function _class24() {
        classCallCheck(this, _class24);
        return possibleConstructorReturn(this, (_class24.__proto__ || Object.getPrototypeOf(_class24)).apply(this, arguments));
      }

      createClass(_class24, [{
        key: 'calcValue',
        value: function calcValue() {
          var p = this.progress();
          var from = new RGBColor(p.from.value);
          var to = new RGBColor(p.to.value);

          if (from.ok && to.ok) {
            // tween color linearly
            var _r2 = from.r + (to.r - from.r) * p.progress;
            var g = from.g + (to.g - from.g) * p.progress;
            var _b = from.b + (to.b - from.b) * p.progress;
            return 'rgb(' + parseInt(_r2, 10) + ',' + parseInt(g, 10) + ',' + parseInt(_b, 10) + ')';
          }
          return this.attribute('from').value;
        }
      }]);
      return _class24;
    }(svg.Element.AnimateBase);

    // animate transform element
    svg.Element.animateTransform = function (_svg$Element$animate) {
      inherits(_class25, _svg$Element$animate);

      function _class25() {
        classCallCheck(this, _class25);
        return possibleConstructorReturn(this, (_class25.__proto__ || Object.getPrototypeOf(_class25)).apply(this, arguments));
      }

      createClass(_class25, [{
        key: 'calcValue',
        value: function calcValue() {
          var p = this.progress();

          // tween value linearly
          var from = svg.ToNumberArray(p.from.value);
          var to = svg.ToNumberArray(p.to.value);
          var newValue = '';
          from.forEach(function (fr, i) {
            newValue += fr + (to[i] - fr) * p.progress + ' ';
          });
          return newValue;
        }
      }]);
      return _class25;
    }(svg.Element.animate);

    // font element
    svg.Element.font = function (_svg$Element$ElementB8) {
      inherits(_class26, _svg$Element$ElementB8);

      function _class26(node) {
        classCallCheck(this, _class26);

        var _this29 = possibleConstructorReturn(this, (_class26.__proto__ || Object.getPrototypeOf(_class26)).call(this, node));

        _this29.horizAdvX = _this29.attribute('horiz-adv-x').numValue();

        _this29.isRTL = false;
        _this29.isArabic = false;
        _this29.fontFace = null;
        _this29.missingGlyph = null;
        _this29.glyphs = [];
        _this29.children.forEach(function (child) {
          if (child.type === 'font-face') {
            _this29.fontFace = child;
            if (child.style('font-family').hasValue()) {
              svg.Definitions[child.style('font-family').value] = _this29;
            }
          } else if (child.type === 'missing-glyph') {
            _this29.missingGlyph = child;
          } else if (child.type === 'glyph') {
            if (child.arabicForm !== '') {
              _this29.isRTL = true;
              _this29.isArabic = true;
              if (typeof _this29.glyphs[child.unicode] === 'undefined') {
                _this29.glyphs[child.unicode] = [];
              }
              _this29.glyphs[child.unicode][child.arabicForm] = child;
            } else {
              _this29.glyphs[child.unicode] = child;
            }
          }
        });
        return _this29;
      }

      return _class26;
    }(svg.Element.ElementBase);

    // font-face element
    svg.Element.fontface = function (_svg$Element$ElementB9) {
      inherits(_class27, _svg$Element$ElementB9);

      function _class27(node) {
        classCallCheck(this, _class27);

        var _this30 = possibleConstructorReturn(this, (_class27.__proto__ || Object.getPrototypeOf(_class27)).call(this, node));

        _this30.ascent = _this30.attribute('ascent').value;
        _this30.descent = _this30.attribute('descent').value;
        _this30.unitsPerEm = _this30.attribute('units-per-em').numValue();
        return _this30;
      }

      return _class27;
    }(svg.Element.ElementBase);

    // missing-glyph element
    svg.Element.missingglyph = function (_svg$Element$path) {
      inherits(_class28, _svg$Element$path);

      function _class28(node) {
        classCallCheck(this, _class28);

        var _this31 = possibleConstructorReturn(this, (_class28.__proto__ || Object.getPrototypeOf(_class28)).call(this, node));

        _this31.horizAdvX = 0;
        return _this31;
      }

      return _class28;
    }(svg.Element.path);

    // glyph element
    svg.Element.glyph = function (_svg$Element$path2) {
      inherits(_class29, _svg$Element$path2);

      function _class29(node) {
        classCallCheck(this, _class29);

        var _this32 = possibleConstructorReturn(this, (_class29.__proto__ || Object.getPrototypeOf(_class29)).call(this, node));

        _this32.horizAdvX = _this32.attribute('horiz-adv-x').numValue();
        _this32.unicode = _this32.attribute('unicode').value;
        _this32.arabicForm = _this32.attribute('arabic-form').value;
        return _this32;
      }

      return _class29;
    }(svg.Element.path);

    // text element
    svg.Element.text = function (_svg$Element$Rendered3) {
      inherits(_class30, _svg$Element$Rendered3);

      function _class30(node) {
        classCallCheck(this, _class30);

        var _this33 = possibleConstructorReturn(this, (_class30.__proto__ || Object.getPrototypeOf(_class30)).call(this, node));

        _this33.captureTextNodes = true;
        return _this33;
      }

      createClass(_class30, [{
        key: 'setContext',
        value: function setContext(ctx) {
          get(_class30.prototype.__proto__ || Object.getPrototypeOf(_class30.prototype), 'setContext', this).call(this, ctx);

          var textBaseline = this.style('dominant-baseline').toTextBaseline();
          if (textBaseline == null) textBaseline = this.style('alignment-baseline').toTextBaseline();
          if (textBaseline != null) ctx.textBaseline = textBaseline;
        }
      }, {
        key: 'getBoundingBox',
        value: function getBoundingBox() {
          var x = this.attribute('x').toPixels('x');
          var y = this.attribute('y').toPixels('y');
          var fontSize = this.parent.style('font-size').numValueOrDefault(svg.Font.Parse(svg.ctx.font).fontSize);
          return new svg.BoundingBox(x, y - fontSize, x + Math.floor(fontSize * 2.0 / 3.0) * this.children[0].getText().length, y);
        }
      }, {
        key: 'renderChildren',
        value: function renderChildren(ctx) {
          var _this34 = this;

          this.x = this.attribute('x').toPixels('x');
          this.y = this.attribute('y').toPixels('y');
          this.x += this.getAnchorDelta(ctx, this, 0);
          this.children.forEach(function (child, i) {
            _this34.renderChild(ctx, _this34, i);
          });
        }
      }, {
        key: 'getAnchorDelta',
        value: function getAnchorDelta(ctx, parent, startI) {
          var textAnchor = this.style('text-anchor').valueOrDefault('start');
          if (textAnchor !== 'start') {
            var width = 0;
            for (var i = startI; i < parent.children.length; i++) {
              var child = parent.children[i];
              if (i > startI && child.attribute('x').hasValue()) break; // new group
              width += child.measureTextRecursive(ctx);
            }
            return -1 * (textAnchor === 'end' ? width : width / 2.0);
          }
          return 0;
        }
      }, {
        key: 'renderChild',
        value: function renderChild(ctx, parent, i) {
          var child = parent.children[i];
          if (child.attribute('x').hasValue()) {
            child.x = child.attribute('x').toPixels('x') + this.getAnchorDelta(ctx, parent, i);
            if (child.attribute('dx').hasValue()) child.x += child.attribute('dx').toPixels('x');
          } else {
            if (this.attribute('dx').hasValue()) this.x += this.attribute('dx').toPixels('x');
            if (child.attribute('dx').hasValue()) this.x += child.attribute('dx').toPixels('x');
            child.x = this.x;
          }
          this.x = child.x + child.measureText(ctx);

          if (child.attribute('y').hasValue()) {
            child.y = child.attribute('y').toPixels('y');
            if (child.attribute('dy').hasValue()) child.y += child.attribute('dy').toPixels('y');
          } else {
            if (this.attribute('dy').hasValue()) this.y += this.attribute('dy').toPixels('y');
            if (child.attribute('dy').hasValue()) this.y += child.attribute('dy').toPixels('y');
            child.y = this.y;
          }
          this.y = child.y;

          child.render(ctx);

          for (var _i = 0; _i < child.children.length; _i++) {
            this.renderChild(ctx, child, _i);
          }
        }
      }]);
      return _class30;
    }(svg.Element.RenderedElementBase);

    // text base
    svg.Element.TextElementBase = function (_svg$Element$Rendered4) {
      inherits(_class31, _svg$Element$Rendered4);

      function _class31() {
        classCallCheck(this, _class31);
        return possibleConstructorReturn(this, (_class31.__proto__ || Object.getPrototypeOf(_class31)).apply(this, arguments));
      }

      createClass(_class31, [{
        key: 'getGlyph',
        value: function getGlyph(font, text, i) {
          var c = text[i];
          var glyph = null;
          if (font.isArabic) {
            var arabicForm = 'isolated';
            if ((i === 0 || text[i - 1] === ' ') && i < text.length - 2 && text[i + 1] !== ' ') arabicForm = 'terminal';
            if (i > 0 && text[i - 1] !== ' ' && i < text.length - 2 && text[i + 1] !== ' ') arabicForm = 'medial';
            if (i > 0 && text[i - 1] !== ' ' && (i === text.length - 1 || text[i + 1] === ' ')) arabicForm = 'initial';
            if (typeof font.glyphs[c] !== 'undefined') {
              glyph = font.glyphs[c][arabicForm];
              if (glyph == null && font.glyphs[c].type === 'glyph') glyph = font.glyphs[c];
            }
          } else {
            glyph = font.glyphs[c];
          }
          if (glyph == null) glyph = font.missingGlyph;
          return glyph;
        }
      }, {
        key: 'renderChildren',
        value: function renderChildren(ctx) {
          var customFont = this.parent.style('font-family').getDefinition();
          if (customFont != null) {
            var fontSize = this.parent.style('font-size').numValueOrDefault(svg.Font.Parse(svg.ctx.font).fontSize);
            var fontStyle = this.parent.style('font-style').valueOrDefault(svg.Font.Parse(svg.ctx.font).fontStyle);
            var text = this.getText();
            if (customFont.isRTL) text = text.split('').reverse().join('');

            var dx = svg.ToNumberArray(this.parent.attribute('dx').value);
            for (var i = 0; i < text.length; i++) {
              var glyph = this.getGlyph(customFont, text, i);
              var scale = fontSize / customFont.fontFace.unitsPerEm;
              ctx.translate(this.x, this.y);
              ctx.scale(scale, -scale);
              var lw = ctx.lineWidth;
              ctx.lineWidth = ctx.lineWidth * customFont.fontFace.unitsPerEm / fontSize;
              if (fontStyle === 'italic') ctx.transform(1, 0, 0.4, 1, 0, 0);
              glyph.render(ctx);
              if (fontStyle === 'italic') ctx.transform(1, 0, -0.4, 1, 0, 0);
              ctx.lineWidth = lw;
              ctx.scale(1 / scale, -1 / scale);
              ctx.translate(-this.x, -this.y);

              this.x += fontSize * (glyph.horizAdvX || customFont.horizAdvX) / customFont.fontFace.unitsPerEm;
              if (typeof dx[i] !== 'undefined' && !isNaN(dx[i])) {
                this.x += dx[i];
              }
            }
            return;
          }

          if (ctx.fillStyle !== '') ctx.fillText(svg.compressSpaces(this.getText()), this.x, this.y);
          if (ctx.strokeStyle !== '') ctx.strokeText(svg.compressSpaces(this.getText()), this.x, this.y);
        }
      }, {
        key: 'getText',
        value: function getText() {
          // OVERRIDE ME
        }
      }, {
        key: 'measureTextRecursive',
        value: function measureTextRecursive(ctx) {
          var width = this.measureText(ctx);
          this.children.forEach(function (child) {
            width += child.measureTextRecursive(ctx);
          });
          return width;
        }
      }, {
        key: 'measureText',
        value: function measureText(ctx) {
          var customFont = this.parent.style('font-family').getDefinition();
          if (customFont != null) {
            var fontSize = this.parent.style('font-size').numValueOrDefault(svg.Font.Parse(svg.ctx.font).fontSize);
            var measure = 0;
            var text = this.getText();
            if (customFont.isRTL) text = text.split('').reverse().join('');
            var dx = svg.ToNumberArray(this.parent.attribute('dx').value);
            for (var i = 0; i < text.length; i++) {
              var glyph = this.getGlyph(customFont, text, i);
              measure += (glyph.horizAdvX || customFont.horizAdvX) * fontSize / customFont.fontFace.unitsPerEm;
              if (typeof dx[i] !== 'undefined' && !isNaN(dx[i])) {
                measure += dx[i];
              }
            }
            return measure;
          }

          var textToMeasure = svg.compressSpaces(this.getText());
          if (!ctx.measureText) return textToMeasure.length * 10;

          ctx.save();
          this.setContext(ctx);

          var _ctx$measureText = ctx.measureText(textToMeasure),
            width = _ctx$measureText.width;

          ctx.restore();
          return width;
        }
      }]);
      return _class31;
    }(svg.Element.RenderedElementBase);

    // tspan
    svg.Element.tspan = function (_svg$Element$TextElem) {
      inherits(_class32, _svg$Element$TextElem);

      function _class32(node) {
        classCallCheck(this, _class32);

        var _this36 = possibleConstructorReturn(this, (_class32.__proto__ || Object.getPrototypeOf(_class32)).call(this, node));

        _this36.captureTextNodes = true;

        _this36.text = node.nodeValue || node.text || '';
        return _this36;
      }

      createClass(_class32, [{
        key: 'getText',
        value: function getText() {
          return this.text;
        }
      }]);
      return _class32;
    }(svg.Element.TextElementBase);

    // tref
    svg.Element.tref = function (_svg$Element$TextElem2) {
      inherits(_class33, _svg$Element$TextElem2);

      function _class33() {
        classCallCheck(this, _class33);
        return possibleConstructorReturn(this, (_class33.__proto__ || Object.getPrototypeOf(_class33)).apply(this, arguments));
      }

      createClass(_class33, [{
        key: 'getText',
        value: function getText() {
          var element = this.getHrefAttribute().getDefinition();
          if (element != null) return element.children[0].getText();
        }
      }]);
      return _class33;
    }(svg.Element.TextElementBase);

    // a element
    svg.Element.a = function (_svg$Element$TextElem3) {
      inherits(_class34, _svg$Element$TextElem3);

      function _class34(node) {
        classCallCheck(this, _class34);

        var _this38 = possibleConstructorReturn(this, (_class34.__proto__ || Object.getPrototypeOf(_class34)).call(this, node));

        _this38.hasText = true;
        [].concat(toConsumableArray(node.childNodes)).forEach(function (childNode) {
          if (childNode.nodeType !== 3) {
            _this38.hasText = false;
          }
        });
        // this might contain text
        _this38.text = _this38.hasText ? node.childNodes[0].nodeValue : '';
        return _this38;
      }

      createClass(_class34, [{
        key: 'getText',
        value: function getText() {
          return this.text;
        }
      }, {
        key: 'renderChildren',
        value: function renderChildren(ctx) {
          if (this.hasText) {
            // render as text element
            get(_class34.prototype.__proto__ || Object.getPrototypeOf(_class34.prototype), 'renderChildren', this).call(this, ctx);
            var fontSize = new svg.Property('fontSize', svg.Font.Parse(svg.ctx.font).fontSize);
            svg.Mouse.checkBoundingBox(this, new svg.BoundingBox(this.x, this.y - fontSize.toPixels('y'), this.x + this.measureText(ctx), this.y));
          } else {
            // render as temporary group
            var g = new svg.Element.g();
            g.children = this.children;
            g.parent = this;
            g.render(ctx);
          }
        }
      }, {
        key: 'onclick',
        value: function onclick() {
          window.open(this.getHrefAttribute().value);
        }
      }, {
        key: 'onmousemove',
        value: function onmousemove() {
          svg.ctx.canvas.style.cursor = 'pointer';
        }
      }]);
      return _class34;
    }(svg.Element.TextElementBase);

    // image element
    svg.Element.image = function (_svg$Element$Rendered5) {
      inherits(_class35, _svg$Element$Rendered5);

      function _class35(node) {
        classCallCheck(this, _class35);

        var _this39 = possibleConstructorReturn(this, (_class35.__proto__ || Object.getPrototypeOf(_class35)).call(this, node));

        var href = _this39.getHrefAttribute().value;
        if (href === '') {
          return possibleConstructorReturn(_this39);
        }
        _this39._isSvg = href.match(/\.svg$/);

        svg.Images.push(_this39);
        _this39.loaded = false;
        if (!_this39._isSvg) {
          _this39.img = document.createElement('img');
          if (svg.opts.useCORS === true) {
            _this39.img.crossOrigin = 'Anonymous';
          }
          var self = _this39;
          _this39.img.onload = function () {
            self.loaded = true;
          };
          _this39.img.onerror = function () {
            svg.log('ERROR: image "' + href + '" not found');
            self.loaded = true;
          };
          _this39.img.src = href;
        } else {
          svg.ajax(href, true).then(function (img) {
            _this39.img = img;
            _this39.loaded = true;
          });
        }
        return _this39;
      }

      createClass(_class35, [{
        key: 'renderChildren',
        value: function renderChildren(ctx) {
          var x = this.attribute('x').toPixels('x');
          var y = this.attribute('y').toPixels('y');

          var width = this.attribute('width').toPixels('x');
          var height = this.attribute('height').toPixels('y');
          if (width === 0 || height === 0) return;

          ctx.save();
          if (this._isSvg) {
            ctx.drawSvg(this.img, x, y, width, height);
          } else {
            ctx.translate(x, y);
            svg.AspectRatio(ctx, this.attribute('preserveAspectRatio').value, width, this.img.width, height, this.img.height, 0, 0);
            ctx.drawImage(this.img, 0, 0);
          }
          ctx.restore();
        }
      }, {
        key: 'getBoundingBox',
        value: function getBoundingBox() {
          var x = this.attribute('x').toPixels('x');
          var y = this.attribute('y').toPixels('y');
          var width = this.attribute('width').toPixels('x');
          var height = this.attribute('height').toPixels('y');
          return new svg.BoundingBox(x, y, x + width, y + height);
        }
      }]);
      return _class35;
    }(svg.Element.RenderedElementBase);

    // group element
    svg.Element.g = function (_svg$Element$Rendered6) {
      inherits(_class36, _svg$Element$Rendered6);

      function _class36() {
        classCallCheck(this, _class36);
        return possibleConstructorReturn(this, (_class36.__proto__ || Object.getPrototypeOf(_class36)).apply(this, arguments));
      }

      createClass(_class36, [{
        key: 'getBoundingBox',
        value: function getBoundingBox() {
          var bb = new svg.BoundingBox();
          this.children.forEach(function (child) {
            bb.addBoundingBox(child.getBoundingBox());
          });
          return bb;
        }
      }]);
      return _class36;
    }(svg.Element.RenderedElementBase);

    // symbol element
    svg.Element.symbol = function (_svg$Element$Rendered7) {
      inherits(_class37, _svg$Element$Rendered7);

      function _class37() {
        classCallCheck(this, _class37);
        return possibleConstructorReturn(this, (_class37.__proto__ || Object.getPrototypeOf(_class37)).apply(this, arguments));
      }

      createClass(_class37, [{
        key: 'render',
        value: function render(ctx) {
          // NO RENDER
        }
      }]);
      return _class37;
    }(svg.Element.RenderedElementBase);

    // style element
    svg.Element.style = function (_svg$Element$ElementB10) {
      inherits(_class38, _svg$Element$ElementB10);

      function _class38(node) {
        classCallCheck(this, _class38);

        // text, or spaces then CDATA
        var _this42 = possibleConstructorReturn(this, (_class38.__proto__ || Object.getPrototypeOf(_class38)).call(this, node));

        var css = '';
        [].concat(toConsumableArray(node.childNodes)).forEach(function (_ref3) {
          var nodeValue = _ref3.nodeValue;

          css += nodeValue;
        });
        css = css.replace(/(\/\*([^*]|[\r\n]|(\*+([^*/]|[\r\n])))*\*+\/)|(^[\s]*\/\/.*)/gm, ''); // remove comments
        css = svg.compressSpaces(css); // replace whitespace
        var cssDefs = css.split('}');
        cssDefs.forEach(function (cssDef) {
          if (svg.trim(cssDef) !== '') {
            var _cssDef$split = cssDef.split('{'),
              _cssDef$split2 = slicedToArray(_cssDef$split, 2),
              cssClasses = _cssDef$split2[0],
              cssProps = _cssDef$split2[1];

            cssClasses = cssClasses.split(',');
            cssProps = cssProps.split(';');
            cssClasses.forEach(function (cssClass) {
              cssClass = svg.trim(cssClass);
              if (cssClass !== '') {
                var props = {};
                cssProps.forEach(function (cssProp) {
                  var prop = cssProp.indexOf(':');
                  var name = cssProp.substr(0, prop);
                  var value = cssProp.substr(prop + 1, cssProp.length - prop);
                  if (name != null && value != null) {
                    props[svg.trim(name)] = new svg.Property(svg.trim(name), svg.trim(value));
                  }
                });
                svg.Styles[cssClass] = props;
                if (cssClass === '@font-face') {
                  var fontFamily = props['font-family'].value.replace(/"/g, '');
                  var srcs = props['src'].value.split(',');
                  srcs.forEach(function (src) {
                    if (src.includes('format("svg")')) {
                      var urlStart = src.indexOf('url');
                      var urlEnd = src.indexOf(')', urlStart);
                      var url = src.substr(urlStart + 5, urlEnd - urlStart - 6);
                      // Can this ajax safely be converted to async?
                      var doc = svg.parseXml(svg.ajax(url));
                      var fonts = doc.getElementsByTagName('font');
                      [].concat(toConsumableArray(fonts)).forEach(function (font) {
                        font = svg.CreateElement(font);
                        svg.Definitions[fontFamily] = font;
                      });
                    }
                  });
                }
              }
            });
          }
        });
        return _this42;
      }

      return _class38;
    }(svg.Element.ElementBase);

    // use element
    svg.Element.use = function (_svg$Element$Rendered8) {
      inherits(_class39, _svg$Element$Rendered8);

      function _class39(node) {
        classCallCheck(this, _class39);

        var _this43 = possibleConstructorReturn(this, (_class39.__proto__ || Object.getPrototypeOf(_class39)).call(this, node));

        _this43._el = _this43.getHrefAttribute().getDefinition();
        return _this43;
      }

      createClass(_class39, [{
        key: 'setContext',
        value: function setContext(ctx) {
          get(_class39.prototype.__proto__ || Object.getPrototypeOf(_class39.prototype), 'setContext', this).call(this, ctx);
          if (this.attribute('x').hasValue()) ctx.translate(this.attribute('x').toPixels('x'), 0);
          if (this.attribute('y').hasValue()) ctx.translate(0, this.attribute('y').toPixels('y'));
        }
      }, {
        key: 'path',
        value: function path(ctx) {
          var element = this._el;

          if (element != null) element.path(ctx);
        }
      }, {
        key: 'getBoundingBox',
        value: function getBoundingBox() {
          var element = this._el;

          if (element != null) return element.getBoundingBox();
        }
      }, {
        key: 'renderChildren',
        value: function renderChildren(ctx) {
          var element = this._el;

          if (element != null) {
            var tempSvg = element;
            if (element.type === 'symbol') {
              // render me using a temporary svg element in symbol cases (https://www.w3.org/TR/SVG/struct.html#UseElement)
              tempSvg = new svg.Element.svg();
              tempSvg.type = 'svg';
              tempSvg.attributes['viewBox'] = new svg.Property('viewBox', element.attribute('viewBox').value);
              tempSvg.attributes['preserveAspectRatio'] = new svg.Property('preserveAspectRatio', element.attribute('preserveAspectRatio').value);
              tempSvg.attributes['overflow'] = new svg.Property('overflow', element.attribute('overflow').value);
              tempSvg.children = element.children;
            }
            if (tempSvg.type === 'svg') {
              // if symbol or svg, inherit width/height from me
              if (this.attribute('width').hasValue()) tempSvg.attributes['width'] = new svg.Property('width', this.attribute('width').value);
              if (this.attribute('height').hasValue()) tempSvg.attributes['height'] = new svg.Property('height', this.attribute('height').value);
            }
            var oldParent = tempSvg.parent;
            tempSvg.parent = null;
            tempSvg.render(ctx);
            tempSvg.parent = oldParent;
          }
        }
      }]);
      return _class39;
    }(svg.Element.RenderedElementBase);

    // mask element
    svg.Element.mask = function (_svg$Element$ElementB11) {
      inherits(_class40, _svg$Element$ElementB11);

      function _class40() {
        classCallCheck(this, _class40);
        return possibleConstructorReturn(this, (_class40.__proto__ || Object.getPrototypeOf(_class40)).apply(this, arguments));
      }

      createClass(_class40, [{
        key: 'apply',
        value: function apply(ctx, element) {
          // render as temp svg
          var x = this.attribute('x').toPixels('x');
          var y = this.attribute('y').toPixels('y');
          var width = this.attribute('width').toPixels('x');
          var height = this.attribute('height').toPixels('y');

          if (width === 0 && height === 0) {
            var bb = new svg.BoundingBox();
            this.children.forEach(function (child) {
              bb.addBoundingBox(child.getBoundingBox());
            });
            x = Math.floor(bb.x1);
            y = Math.floor(bb.y1);
            width = Math.floor(bb.width());
            height = Math.floor(bb.height());
          }

          // temporarily remove mask to avoid recursion
          var mask = element.attribute('mask').value;
          element.attribute('mask').value = '';

          var cMask = document.createElement('canvas');
          cMask.width = x + width;
          cMask.height = y + height;
          var maskCtx = cMask.getContext('2d');
          this.renderChildren(maskCtx);

          var c = document.createElement('canvas');
          c.width = x + width;
          c.height = y + height;
          var tempCtx = c.getContext('2d');
          element.render(tempCtx);
          tempCtx.globalCompositeOperation = 'destination-in';
          tempCtx.fillStyle = maskCtx.createPattern(cMask, 'no-repeat');
          tempCtx.fillRect(0, 0, x + width, y + height);

          ctx.fillStyle = tempCtx.createPattern(c, 'no-repeat');
          ctx.fillRect(0, 0, x + width, y + height);

          // reassign mask
          element.attribute('mask').value = mask;
        }
      }, {
        key: 'render',
        value: function render(ctx) {
          // NO RENDER
        }
      }]);
      return _class40;
    }(svg.Element.ElementBase);

    // clip element
    svg.Element.clipPath = function (_svg$Element$ElementB12) {
      inherits(_class41, _svg$Element$ElementB12);

      function _class41() {
        classCallCheck(this, _class41);
        return possibleConstructorReturn(this, (_class41.__proto__ || Object.getPrototypeOf(_class41)).apply(this, arguments));
      }

      createClass(_class41, [{
        key: 'apply',
        value: function apply(ctx) {
          this.children.forEach(function (child) {
            if (typeof child.path !== 'undefined') {
              var transform = null;
              if (child.attribute('transform').hasValue()) {
                transform = new svg.Transform(child.attribute('transform').value);
                transform.apply(ctx);
              }
              child.path(ctx);
              ctx.clip();
              if (transform) {
                transform.unapply(ctx);
              }
            }
          });
        }
      }, {
        key: 'render',
        value: function render(ctx) {
          // NO RENDER
        }
      }]);
      return _class41;
    }(svg.Element.ElementBase);

    // filters
    svg.Element.filter = function (_svg$Element$ElementB13) {
      inherits(_class42, _svg$Element$ElementB13);

      function _class42() {
        classCallCheck(this, _class42);
        return possibleConstructorReturn(this, (_class42.__proto__ || Object.getPrototypeOf(_class42)).apply(this, arguments));
      }

      createClass(_class42, [{
        key: 'apply',
        value: function apply(ctx, element) {
          // render as temp svg
          var bb = element.getBoundingBox();
          var x = Math.floor(bb.x1);
          var y = Math.floor(bb.y1);
          var width = Math.floor(bb.width());
          var height = Math.floor(bb.height());

          // temporarily remove filter to avoid recursion
          var filter = element.style('filter').value;
          element.style('filter').value = '';

          var px = 0,
            py = 0;
          this.children.forEach(function (child) {
            var efd = child.extraFilterDistance || 0;
            px = Math.max(px, efd);
            py = Math.max(py, efd);
          });

          var c = document.createElement('canvas');
          c.width = width + 2 * px;
          c.height = height + 2 * py;
          var tempCtx = c.getContext('2d');
          tempCtx.translate(-x + px, -y + py);
          element.render(tempCtx);

          // apply filters
          this.children.forEach(function (child) {
            child.apply(tempCtx, 0, 0, width + 2 * px, height + 2 * py);
          });

          // render on me
          ctx.drawImage(c, 0, 0, width + 2 * px, height + 2 * py, x - px, y - py, width + 2 * px, height + 2 * py);

          // reassign filter
          element.style('filter', true).value = filter;
        }
      }, {
        key: 'render',
        value: function render(ctx) {
          // NO RENDER
        }
      }]);
      return _class42;
    }(svg.Element.ElementBase);

    svg.Element.feMorphology = function (_svg$Element$ElementB14) {
      inherits(_class43, _svg$Element$ElementB14);

      function _class43() {
        classCallCheck(this, _class43);
        return possibleConstructorReturn(this, (_class43.__proto__ || Object.getPrototypeOf(_class43)).apply(this, arguments));
      }

      createClass(_class43, [{
        key: 'apply',
        value: function apply(ctx, x, y, width, height) {
          // TODO: implement
        }
      }]);
      return _class43;
    }(svg.Element.ElementBase);

    svg.Element.feComposite = function (_svg$Element$ElementB15) {
      inherits(_class44, _svg$Element$ElementB15);

      function _class44() {
        classCallCheck(this, _class44);
        return possibleConstructorReturn(this, (_class44.__proto__ || Object.getPrototypeOf(_class44)).apply(this, arguments));
      }

      createClass(_class44, [{
        key: 'apply',
        value: function apply(ctx, x, y, width, height) {
          // TODO: implement
        }
      }]);
      return _class44;
    }(svg.Element.ElementBase);

    function imGet(img, x, y, width, height, rgba) {
      return img[y * width * 4 + x * 4 + rgba];
    }

    function imSet(img, x, y, width, height, rgba, val) {
      img[y * width * 4 + x * 4 + rgba] = val;
    }

    svg.Element.feColorMatrix = function (_svg$Element$ElementB16) {
      inherits(_class45, _svg$Element$ElementB16);

      function _class45(node) {
        classCallCheck(this, _class45);

        var _this49 = possibleConstructorReturn(this, (_class45.__proto__ || Object.getPrototypeOf(_class45)).call(this, node));

        var matrix = svg.ToNumberArray(_this49.attribute('values').value);
        switch (_this49.attribute('type').valueOrDefault('matrix')) { // https://www.w3.org/TR/SVG/filters.html#feColorMatrixElement
          case 'saturate':
            var s = matrix[0];
            matrix = [0.213 + 0.787 * s, 0.715 - 0.715 * s, 0.072 - 0.072 * s, 0, 0, 0.213 - 0.213 * s, 0.715 + 0.285 * s, 0.072 - 0.072 * s, 0, 0, 0.213 - 0.213 * s, 0.715 - 0.715 * s, 0.072 + 0.928 * s, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1];
            break;
          case 'hueRotate':
            var a = matrix[0] * Math.PI / 180.0;
            var _c3 = function _c3(m1, m2, m3) {
              return m1 + Math.cos(a) * m2 + Math.sin(a) * m3;
            };
            matrix = [_c3(0.213, 0.787, -0.213), _c3(0.715, -0.715, -0.715), _c3(0.072, -0.072, 0.928), 0, 0, _c3(0.213, -0.213, 0.143), _c3(0.715, 0.285, 0.140), _c3(0.072, -0.072, -0.283), 0, 0, _c3(0.213, -0.213, -0.787), _c3(0.715, -0.715, 0.715), _c3(0.072, 0.928, 0.072), 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1];
            break;
          case 'luminanceToAlpha':
            matrix = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0.2125, 0.7154, 0.0721, 0, 0, 0, 0, 0, 0, 1];
            break;
        }
        _this49.matrix = matrix;

        _this49._m = function (i, v) {
          var mi = matrix[i];
          return mi * (mi < 0 ? v - 255 : v);
        };
        return _this49;
      }

      createClass(_class45, [{
        key: 'apply',
        value: function apply(ctx, x, y, width, height) {
          var m = this._m;
          // assuming x==0 && y==0 for now

          var srcData = ctx.getImageData(0, 0, width, height);
          for (var _y2 = 0; _y2 < height; _y2++) {
            for (var _x2 = 0; _x2 < width; _x2++) {
              var _r3 = imGet(srcData.data, _x2, _y2, width, height, 0);
              var g = imGet(srcData.data, _x2, _y2, width, height, 1);
              var _b2 = imGet(srcData.data, _x2, _y2, width, height, 2);
              var a = imGet(srcData.data, _x2, _y2, width, height, 3);
              imSet(srcData.data, _x2, _y2, width, height, 0, m(0, _r3) + m(1, g) + m(2, _b2) + m(3, a) + m(4, 1));
              imSet(srcData.data, _x2, _y2, width, height, 1, m(5, _r3) + m(6, g) + m(7, _b2) + m(8, a) + m(9, 1));
              imSet(srcData.data, _x2, _y2, width, height, 2, m(10, _r3) + m(11, g) + m(12, _b2) + m(13, a) + m(14, 1));
              imSet(srcData.data, _x2, _y2, width, height, 3, m(15, _r3) + m(16, g) + m(17, _b2) + m(18, a) + m(19, 1));
            }
          }
          ctx.clearRect(0, 0, width, height);
          ctx.putImageData(srcData, 0, 0);
        }
      }]);
      return _class45;
    }(svg.Element.ElementBase);

    svg.Element.feGaussianBlur = function (_svg$Element$ElementB17) {
      inherits(_class46, _svg$Element$ElementB17);

      function _class46(node) {
        classCallCheck(this, _class46);

        var _this50 = possibleConstructorReturn(this, (_class46.__proto__ || Object.getPrototypeOf(_class46)).call(this, node));

        _this50.blurRadius = Math.floor(_this50.attribute('stdDeviation').numValue());
        _this50.extraFilterDistance = _this50.blurRadius;
        return _this50;
      }

      createClass(_class46, [{
        key: 'apply',
        value: function apply(ctx, x, y, width, height) {
          if (typeof stackBlurCanvasRGBA === 'undefined') {
            svg.log('ERROR: `setStackBlurCanvasRGBA` must be run for blur to work');
            return;
          }

          // StackBlur requires canvas be on document
          ctx.canvas.id = svg.UniqueId();
          ctx.canvas.style.display = 'none';
          document.body.append(ctx.canvas);
          stackBlurCanvasRGBA(ctx.canvas.id, x, y, width, height, this.blurRadius);
          ctx.canvas.remove();
        }
      }]);
      return _class46;
    }(svg.Element.ElementBase);

    // title element, do nothing
    svg.Element.title = function (_svg$Element$ElementB18) {
      inherits(_class47, _svg$Element$ElementB18);

      function _class47(node) {
        classCallCheck(this, _class47);
        return possibleConstructorReturn(this, (_class47.__proto__ || Object.getPrototypeOf(_class47)).call(this));
      }

      return _class47;
    }(svg.Element.ElementBase);

    // desc element, do nothing
    svg.Element.desc = function (_svg$Element$ElementB19) {
      inherits(_class48, _svg$Element$ElementB19);

      function _class48(node) {
        classCallCheck(this, _class48);
        return possibleConstructorReturn(this, (_class48.__proto__ || Object.getPrototypeOf(_class48)).call(this));
      }

      return _class48;
    }(svg.Element.ElementBase);

    svg.Element.MISSING = function (_svg$Element$ElementB20) {
      inherits(_class49, _svg$Element$ElementB20);

      function _class49(node) {
        classCallCheck(this, _class49);

        var _this53 = possibleConstructorReturn(this, (_class49.__proto__ || Object.getPrototypeOf(_class49)).call(this));

        svg.log('ERROR: Element \'' + node.nodeName + '\' not yet implemented.');
        return _this53;
      }

      return _class49;
    }(svg.Element.ElementBase);

    // element factory
    svg.CreateElement = function (node) {
      var className = node.nodeName.replace(/^[^:]+:/, '') // remove namespace
        .replace(/-/g, ''); // remove dashes
      var e = void 0;
      if (typeof svg.Element[className] !== 'undefined') {
        e = new svg.Element[className](node);
      } else {
        e = new svg.Element.MISSING(node);
      }

      e.type = node.nodeName;
      return e;
    };

    // load from url
    svg.load = function () {
      var _ref4 = asyncToGenerator( /*#__PURE__*/ regeneratorRuntime.mark(function _callee(ctx, url) {
        var dom;
        return regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                _context.next = 2;
                return svg.ajax(url, true);

              case 2:
                dom = _context.sent;
                return _context.abrupt('return', svg.loadXml(ctx, dom));

              case 4:
              case 'end':
                return _context.stop();
            }
          }
        }, _callee, this);
      }));

      return function (_x3, _x4) {
        return _ref4.apply(this, arguments);
      };
    }();

    // load from xml
    svg.loadXml = function (ctx, xml) {
      return svg.loadXmlDoc(ctx, svg.parseXml(xml));
    };

    svg.loadXmlDoc = function (ctx, dom) {
      svg.init(ctx);

      var mapXY = function mapXY(p) {
        var e = ctx.canvas;
        while (e) {
          p.x -= e.offsetLeft;
          p.y -= e.offsetTop;
          e = e.offsetParent;
        }
        if (window.scrollX) p.x += window.scrollX;
        if (window.scrollY) p.y += window.scrollY;
        return p;
      };

      // bind mouse
      if (svg.opts.ignoreMouse !== true) {
        ctx.canvas.onclick = function (e) {
          var args = e != null ? [e.clientX, e.clientY] : [event.clientX, event.clientY];

          var _mapXY = mapXY(new(Function.prototype.bind.apply(svg.Point, [null].concat(args)))()),
            x = _mapXY.x,
            y = _mapXY.y;

          svg.Mouse.onclick(x, y);
        };
        ctx.canvas.onmousemove = function (e) {
          var args = e != null ? [e.clientX, e.clientY] : [event.clientX, event.clientY];

          var _mapXY2 = mapXY(new(Function.prototype.bind.apply(svg.Point, [null].concat(args)))()),
            x = _mapXY2.x,
            y = _mapXY2.y;

          svg.Mouse.onmousemove(x, y);
        };
      }

      var e = svg.CreateElement(dom.documentElement);
      e.root = true;

      // render loop
      var isFirstRender = true;
      var draw = function draw(resolve) {
        svg.ViewPort.Clear();
        if (ctx.canvas.parentNode) {
          svg.ViewPort.SetCurrent(ctx.canvas.parentNode.clientWidth, ctx.canvas.parentNode.clientHeight);
        }

        if (svg.opts.ignoreDimensions !== true) {
          // set canvas size
          if (e.style('width').hasValue()) {
            ctx.canvas.width = e.style('width').toPixels('x');
            ctx.canvas.style.width = ctx.canvas.width + 'px';
          }
          if (e.style('height').hasValue()) {
            ctx.canvas.height = e.style('height').toPixels('y');
            ctx.canvas.style.height = ctx.canvas.height + 'px';
          }
        }
        var cWidth = ctx.canvas.clientWidth || ctx.canvas.width;
        var cHeight = ctx.canvas.clientHeight || ctx.canvas.height;
        if (svg.opts.ignoreDimensions === true && e.style('width').hasValue() && e.style('height').hasValue()) {
          cWidth = e.style('width').toPixels('x');
          cHeight = e.style('height').toPixels('y');
        }
        svg.ViewPort.SetCurrent(cWidth, cHeight);

        if (svg.opts.offsetX != null) {
          e.attribute('x', true).value = svg.opts.offsetX;
        }
        if (svg.opts.offsetY != null) {
          e.attribute('y', true).value = svg.opts.offsetY;
        }
        if (svg.opts.scaleWidth != null || svg.opts.scaleHeight != null) {
          var viewBox = svg.ToNumberArray(e.attribute('viewBox').value);
          var xRatio = null,
            yRatio = null;

          if (svg.opts.scaleWidth != null) {
            if (e.attribute('width').hasValue()) {
              xRatio = e.attribute('width').toPixels('x') / svg.opts.scaleWidth;
            } else if (!isNaN(viewBox[2])) {
              xRatio = viewBox[2] / svg.opts.scaleWidth;
            }
          }

          if (svg.opts.scaleHeight != null) {
            if (e.attribute('height').hasValue()) {
              yRatio = e.attribute('height').toPixels('y') / svg.opts.scaleHeight;
            } else if (!isNaN(viewBox[3])) {
              yRatio = viewBox[3] / svg.opts.scaleHeight;
            }
          }

          if (xRatio == null) {
            xRatio = yRatio;
          }
          if (yRatio == null) {
            yRatio = xRatio;
          }

          e.attribute('width', true).value = svg.opts.scaleWidth;
          e.attribute('height', true).value = svg.opts.scaleHeight;
          e.attribute('viewBox', true).value = '0 0 ' + cWidth * xRatio + ' ' + cHeight * yRatio;
          e.attribute('preserveAspectRatio', true).value = 'none';
        }

        // clear and render
        if (svg.opts.ignoreClear !== true) {
          ctx.clearRect(0, 0, cWidth, cHeight);
        }
        e.render(ctx);
        if (isFirstRender && resolve) {
          isFirstRender = false;
          resolve(dom);
        }
      };

      var waitingForImages = true;
      svg.intervalID = setInterval(function () {
        var needUpdate = false;

        if (waitingForImages && svg.ImagesLoaded()) {
          waitingForImages = false;
          needUpdate = true;
        }

        // need update from mouse events?
        if (svg.opts.ignoreMouse !== true) {
          needUpdate = needUpdate | svg.Mouse.hasEvents();
        }

        // need update from animations?
        if (svg.opts.ignoreAnimation !== true) {
          svg.Animations.forEach(function (animation) {
            needUpdate = needUpdate | animation.update(1000 / svg.FRAMERATE);
          });
        }

        // need update from redraw?
        if (typeof svg.opts.forceRedraw === 'function') {
          if (svg.opts.forceRedraw() === true) {
            needUpdate = true;
          }
        }

        // render if needed
        if (needUpdate) {
          draw();
          svg.Mouse.runEvents(); // run and clear our events
        }
      }, 1000 / svg.FRAMERATE);
      return new Promise(function (resolve, reject) {
        if (svg.ImagesLoaded()) {
          waitingForImages = false;
          draw(resolve);
        }
      });
    };

    svg.stop = function () {
      if (svg.intervalID) {
        clearInterval(svg.intervalID);
      }
    };

    svg.Mouse = {
      events: [],
      hasEvents: function hasEvents() {
        return this.events.length !== 0;
      },
      onclick: function onclick(x, y) {
        this.events.push({
          type: 'onclick',
          x: x,
          y: y,
          run: function run(e) {
            if (e.onclick) e.onclick();
          }
        });
      },
      onmousemove: function onmousemove(x, y) {
        this.events.push({
          type: 'onmousemove',
          x: x,
          y: y,
          run: function run(e) {
            if (e.onmousemove) e.onmousemove();
          }
        });
      },


      eventElements: [],

      checkPath: function checkPath(element, ctx) {
        var _this54 = this;

        this.events.forEach(function (_ref5, i) {
          var x = _ref5.x,
            y = _ref5.y;

          if (ctx.isPointInPath && ctx.isPointInPath(x, y)) {
            _this54.eventElements[i] = element;
          }
        });
      },
      checkBoundingBox: function checkBoundingBox(element, bb) {
        var _this55 = this;

        this.events.forEach(function (_ref6, i) {
          var x = _ref6.x,
            y = _ref6.y;

          if (bb.isPointInBox(x, y)) {
            _this55.eventElements[i] = element;
          }
        });
      },
      runEvents: function runEvents() {
        var _this56 = this;

        svg.ctx.canvas.style.cursor = '';

        this.events.forEach(function (e, i) {
          var element = _this56.eventElements[i];
          while (element) {
            e.run(element);
            element = element.parent;
          }
        });

        // done running, clear
        this.events = [];
        this.eventElements = [];
      }
    };

    return svg;
  }

  if (typeof CanvasRenderingContext2D !== 'undefined') {
    CanvasRenderingContext2D.prototype.drawSvg = function (s, dx, dy, dw, dh) {
      canvg(this.canvas, s, {
        ignoreMouse: true,
        ignoreAnimation: true,
        ignoreDimensions: true,
        ignoreClear: true,
        offsetX: dx,
        offsetY: dy,
        scaleWidth: dw,
        scaleHeight: dh
      });
    };
  }

  exports.setStackBlurCanvasRGBA = setStackBlurCanvasRGBA;
  exports.canvg = canvg;

  return exports;

}({}));