// http://ross.posterous.com/2008/08/19/iphone-touch-events-in-javascript/
function touchHandler(event) {
  var touches = event.changedTouches,
      first = touches[0];
  var type = '';
  switch (event.type) {
    case 'touchstart':
      type = 'mousedown';break;
    case 'touchmove':
      type = 'mousemove';break;
    case 'touchend':
      type = 'mouseup';break;
    default:
      return;
  }

  // initMouseEvent(type, canBubble, cancelable, view, clickCount,
  //  screenX, screenY, clientX, clientY, ctrlKey,
  //  altKey, shiftKey, metaKey, button, relatedTarget);

  var simulatedEvent = document.createEvent('MouseEvent');
  simulatedEvent.initMouseEvent(type, true, true, window, 1, first.screenX, first.screenY, first.clientX, first.clientY, false, false, false, false, 0 /* left */, null);
  if (touches.length < 2) {
    first.target.dispatchEvent(simulatedEvent);
    event.preventDefault();
  }
}

document.addEventListener('touchstart', touchHandler, true);
document.addEventListener('touchmove', touchHandler, true);
document.addEventListener('touchend', touchHandler, true);
document.addEventListener('touchcancel', touchHandler, true);

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) {
  return typeof obj;
} : function (obj) {
  return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
};

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

var _extends = Object.assign || function (target) {
  for (var i = 1; i < arguments.length; i++) {
    var source = arguments[i];

    for (var key in source) {
      if (Object.prototype.hasOwnProperty.call(source, key)) {
        target[key] = source[key];
      }
    }
  }

  return target;
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

/**
 *
 * Licensed under the MIT License
 */

/**
* Common namepaces constants in alpha order
*/
var NS = {
  HTML: 'http://www.w3.org/1999/xhtml',
  MATH: 'http://www.w3.org/1998/Math/MathML',
  SE: 'http://svg-edit.googlecode.com',
  SVG: 'http://www.w3.org/2000/svg',
  XLINK: 'http://www.w3.org/1999/xlink',
  XML: 'http://www.w3.org/XML/1998/namespace',
  XMLNS: 'http://www.w3.org/2000/xmlns/' // see http://www.w3.org/TR/REC-xml-names/#xmlReserved
};

/**
* @returns The NS with key values switched and lowercase
*/
var getReverseNS = function getReverseNS() {
  var reverseNS = {};
  Object.entries(NS).forEach(function (_ref) {
    var _ref2 = slicedToArray(_ref, 2),
        name = _ref2[0],
        URI = _ref2[1];

    reverseNS[URI] = name.toLowerCase();
  });
  return reverseNS;
};

// SVGPathSeg API polyfill
// https://github.com/progers/pathseg
//
// This is a drop-in replacement for the SVGPathSeg and SVGPathSegList APIs that were removed from
// SVG2 (https://lists.w3.org/Archives/Public/www-svg/2015Jun/0044.html), including the latest spec
// changes which were implemented in Firefox 43 and Chrome 46.

(function () {
  if (!('SVGPathSeg' in window)) {
    // Spec: https://www.w3.org/TR/SVG11/single-page.html#paths-InterfaceSVGPathSeg
    var _SVGPathSeg = function () {
      function _SVGPathSeg(type, typeAsLetter, owningPathSegList) {
        classCallCheck(this, _SVGPathSeg);

        this.pathSegType = type;
        this.pathSegTypeAsLetter = typeAsLetter;
        this._owningPathSegList = owningPathSegList;
      }
      // Notify owning PathSegList on any changes so they can be synchronized back to the path element.


      createClass(_SVGPathSeg, [{
        key: '_segmentChanged',
        value: function _segmentChanged() {
          if (this._owningPathSegList) {
            this._owningPathSegList.segmentChanged(this);
          }
        }
      }]);
      return _SVGPathSeg;
    }();

    _SVGPathSeg.prototype.classname = 'SVGPathSeg';

    _SVGPathSeg.PATHSEG_UNKNOWN = 0;
    _SVGPathSeg.PATHSEG_CLOSEPATH = 1;
    _SVGPathSeg.PATHSEG_MOVETO_ABS = 2;
    _SVGPathSeg.PATHSEG_MOVETO_REL = 3;
    _SVGPathSeg.PATHSEG_LINETO_ABS = 4;
    _SVGPathSeg.PATHSEG_LINETO_REL = 5;
    _SVGPathSeg.PATHSEG_CURVETO_CUBIC_ABS = 6;
    _SVGPathSeg.PATHSEG_CURVETO_CUBIC_REL = 7;
    _SVGPathSeg.PATHSEG_CURVETO_QUADRATIC_ABS = 8;
    _SVGPathSeg.PATHSEG_CURVETO_QUADRATIC_REL = 9;
    _SVGPathSeg.PATHSEG_ARC_ABS = 10;
    _SVGPathSeg.PATHSEG_ARC_REL = 11;
    _SVGPathSeg.PATHSEG_LINETO_HORIZONTAL_ABS = 12;
    _SVGPathSeg.PATHSEG_LINETO_HORIZONTAL_REL = 13;
    _SVGPathSeg.PATHSEG_LINETO_VERTICAL_ABS = 14;
    _SVGPathSeg.PATHSEG_LINETO_VERTICAL_REL = 15;
    _SVGPathSeg.PATHSEG_CURVETO_CUBIC_SMOOTH_ABS = 16;
    _SVGPathSeg.PATHSEG_CURVETO_CUBIC_SMOOTH_REL = 17;
    _SVGPathSeg.PATHSEG_CURVETO_QUADRATIC_SMOOTH_ABS = 18;
    _SVGPathSeg.PATHSEG_CURVETO_QUADRATIC_SMOOTH_REL = 19;

    var _SVGPathSegClosePath = function (_SVGPathSeg2) {
      inherits(_SVGPathSegClosePath, _SVGPathSeg2);

      function _SVGPathSegClosePath(owningPathSegList) {
        classCallCheck(this, _SVGPathSegClosePath);
        return possibleConstructorReturn(this, (_SVGPathSegClosePath.__proto__ || Object.getPrototypeOf(_SVGPathSegClosePath)).call(this, _SVGPathSeg.PATHSEG_CLOSEPATH, 'z', owningPathSegList));
      }

      createClass(_SVGPathSegClosePath, [{
        key: 'toString',
        value: function toString() {
          return '[object SVGPathSegClosePath]';
        }
      }, {
        key: '_asPathString',
        value: function _asPathString() {
          return this.pathSegTypeAsLetter;
        }
      }, {
        key: 'clone',
        value: function clone() {
          return new _SVGPathSegClosePath(undefined);
        }
      }]);
      return _SVGPathSegClosePath;
    }(_SVGPathSeg);

    var _SVGPathSegMovetoAbs = function (_SVGPathSeg3) {
      inherits(_SVGPathSegMovetoAbs, _SVGPathSeg3);

      function _SVGPathSegMovetoAbs(owningPathSegList, x, y) {
        classCallCheck(this, _SVGPathSegMovetoAbs);

        var _this2 = possibleConstructorReturn(this, (_SVGPathSegMovetoAbs.__proto__ || Object.getPrototypeOf(_SVGPathSegMovetoAbs)).call(this, _SVGPathSeg.PATHSEG_MOVETO_ABS, 'M', owningPathSegList));

        _this2._x = x;
        _this2._y = y;
        return _this2;
      }

      createClass(_SVGPathSegMovetoAbs, [{
        key: 'toString',
        value: function toString() {
          return '[object SVGPathSegMovetoAbs]';
        }
      }, {
        key: '_asPathString',
        value: function _asPathString() {
          return this.pathSegTypeAsLetter + ' ' + this._x + ' ' + this._y;
        }
      }, {
        key: 'clone',
        value: function clone() {
          return new _SVGPathSegMovetoAbs(undefined, this._x, this._y);
        }
      }]);
      return _SVGPathSegMovetoAbs;
    }(_SVGPathSeg);

    Object.defineProperties(_SVGPathSegMovetoAbs.prototype, {
      x: {
        get: function get$$1() {
          return this._x;
        },
        set: function set$$1(x) {
          this._x = x;this._segmentChanged();
        },
        enumerable: true
      },
      y: {
        get: function get$$1() {
          return this._y;
        },
        set: function set$$1(y) {
          this._y = y;this._segmentChanged();
        },
        enumerable: true
      }
    });

    var _SVGPathSegMovetoRel = function (_SVGPathSeg4) {
      inherits(_SVGPathSegMovetoRel, _SVGPathSeg4);

      function _SVGPathSegMovetoRel(owningPathSegList, x, y) {
        classCallCheck(this, _SVGPathSegMovetoRel);

        var _this3 = possibleConstructorReturn(this, (_SVGPathSegMovetoRel.__proto__ || Object.getPrototypeOf(_SVGPathSegMovetoRel)).call(this, _SVGPathSeg.PATHSEG_MOVETO_REL, 'm', owningPathSegList));

        _this3._x = x;
        _this3._y = y;
        return _this3;
      }

      createClass(_SVGPathSegMovetoRel, [{
        key: 'toString',
        value: function toString() {
          return '[object SVGPathSegMovetoRel]';
        }
      }, {
        key: '_asPathString',
        value: function _asPathString() {
          return this.pathSegTypeAsLetter + ' ' + this._x + ' ' + this._y;
        }
      }, {
        key: 'clone',
        value: function clone() {
          return new _SVGPathSegMovetoRel(undefined, this._x, this._y);
        }
      }]);
      return _SVGPathSegMovetoRel;
    }(_SVGPathSeg);

    Object.defineProperties(_SVGPathSegMovetoRel.prototype, {
      x: {
        get: function get$$1() {
          return this._x;
        },
        set: function set$$1(x) {
          this._x = x;this._segmentChanged();
        },
        enumerable: true },
      y: {
        get: function get$$1() {
          return this._y;
        },
        set: function set$$1(y) {
          this._y = y;this._segmentChanged();
        },
        enumerable: true }
    });

    var _SVGPathSegLinetoAbs = function (_SVGPathSeg5) {
      inherits(_SVGPathSegLinetoAbs, _SVGPathSeg5);

      function _SVGPathSegLinetoAbs(owningPathSegList, x, y) {
        classCallCheck(this, _SVGPathSegLinetoAbs);

        var _this4 = possibleConstructorReturn(this, (_SVGPathSegLinetoAbs.__proto__ || Object.getPrototypeOf(_SVGPathSegLinetoAbs)).call(this, _SVGPathSeg.PATHSEG_LINETO_ABS, 'L', owningPathSegList));

        _this4._x = x;
        _this4._y = y;
        return _this4;
      }

      createClass(_SVGPathSegLinetoAbs, [{
        key: 'toString',
        value: function toString() {
          return '[object SVGPathSegLinetoAbs]';
        }
      }, {
        key: '_asPathString',
        value: function _asPathString() {
          return this.pathSegTypeAsLetter + ' ' + this._x + ' ' + this._y;
        }
      }, {
        key: 'clone',
        value: function clone() {
          return new _SVGPathSegLinetoAbs(undefined, this._x, this._y);
        }
      }]);
      return _SVGPathSegLinetoAbs;
    }(_SVGPathSeg);

    Object.defineProperties(_SVGPathSegLinetoAbs.prototype, {
      x: {
        get: function get$$1() {
          return this._x;
        },
        set: function set$$1(x) {
          this._x = x;this._segmentChanged();
        },
        enumerable: true },
      y: {
        get: function get$$1() {
          return this._y;
        },
        set: function set$$1(y) {
          this._y = y;this._segmentChanged();
        },
        enumerable: true }
    });

    var _SVGPathSegLinetoRel = function (_SVGPathSeg6) {
      inherits(_SVGPathSegLinetoRel, _SVGPathSeg6);

      function _SVGPathSegLinetoRel(owningPathSegList, x, y) {
        classCallCheck(this, _SVGPathSegLinetoRel);

        var _this5 = possibleConstructorReturn(this, (_SVGPathSegLinetoRel.__proto__ || Object.getPrototypeOf(_SVGPathSegLinetoRel)).call(this, _SVGPathSeg.PATHSEG_LINETO_REL, 'l', owningPathSegList));

        _this5._x = x;
        _this5._y = y;
        return _this5;
      }

      createClass(_SVGPathSegLinetoRel, [{
        key: 'toString',
        value: function toString() {
          return '[object SVGPathSegLinetoRel]';
        }
      }, {
        key: '_asPathString',
        value: function _asPathString() {
          return this.pathSegTypeAsLetter + ' ' + this._x + ' ' + this._y;
        }
      }, {
        key: 'clone',
        value: function clone() {
          return new _SVGPathSegLinetoRel(undefined, this._x, this._y);
        }
      }]);
      return _SVGPathSegLinetoRel;
    }(_SVGPathSeg);

    Object.defineProperties(_SVGPathSegLinetoRel.prototype, {
      x: {
        get: function get$$1() {
          return this._x;
        },
        set: function set$$1(x) {
          this._x = x;this._segmentChanged();
        },
        enumerable: true },
      y: {
        get: function get$$1() {
          return this._y;
        },
        set: function set$$1(y) {
          this._y = y;this._segmentChanged();
        },
        enumerable: true }
    });

    var _SVGPathSegCurvetoCubicAbs = function (_SVGPathSeg7) {
      inherits(_SVGPathSegCurvetoCubicAbs, _SVGPathSeg7);

      function _SVGPathSegCurvetoCubicAbs(owningPathSegList, x, y, x1, y1, x2, y2) {
        classCallCheck(this, _SVGPathSegCurvetoCubicAbs);

        var _this6 = possibleConstructorReturn(this, (_SVGPathSegCurvetoCubicAbs.__proto__ || Object.getPrototypeOf(_SVGPathSegCurvetoCubicAbs)).call(this, _SVGPathSeg.PATHSEG_CURVETO_CUBIC_ABS, 'C', owningPathSegList));

        _this6._x = x;
        _this6._y = y;
        _this6._x1 = x1;
        _this6._y1 = y1;
        _this6._x2 = x2;
        _this6._y2 = y2;
        return _this6;
      }

      createClass(_SVGPathSegCurvetoCubicAbs, [{
        key: 'toString',
        value: function toString() {
          return '[object SVGPathSegCurvetoCubicAbs]';
        }
      }, {
        key: '_asPathString',
        value: function _asPathString() {
          return this.pathSegTypeAsLetter + ' ' + this._x1 + ' ' + this._y1 + ' ' + this._x2 + ' ' + this._y2 + ' ' + this._x + ' ' + this._y;
        }
      }, {
        key: 'clone',
        value: function clone() {
          return new _SVGPathSegCurvetoCubicAbs(undefined, this._x, this._y, this._x1, this._y1, this._x2, this._y2);
        }
      }]);
      return _SVGPathSegCurvetoCubicAbs;
    }(_SVGPathSeg);

    Object.defineProperties(_SVGPathSegCurvetoCubicAbs.prototype, {
      x: {
        get: function get$$1() {
          return this._x;
        },
        set: function set$$1(x) {
          this._x = x;this._segmentChanged();
        },
        enumerable: true },
      y: {
        get: function get$$1() {
          return this._y;
        },
        set: function set$$1(y) {
          this._y = y;this._segmentChanged();
        },
        enumerable: true },
      x1: {
        get: function get$$1() {
          return this._x1;
        },
        set: function set$$1(x1) {
          this._x1 = x1;this._segmentChanged();
        },
        enumerable: true },
      y1: {
        get: function get$$1() {
          return this._y1;
        },
        set: function set$$1(y1) {
          this._y1 = y1;this._segmentChanged();
        },
        enumerable: true },
      x2: {
        get: function get$$1() {
          return this._x2;
        },
        set: function set$$1(x2) {
          this._x2 = x2;this._segmentChanged();
        },
        enumerable: true },
      y2: {
        get: function get$$1() {
          return this._y2;
        },
        set: function set$$1(y2) {
          this._y2 = y2;this._segmentChanged();
        },
        enumerable: true }
    });

    var _SVGPathSegCurvetoCubicRel = function (_SVGPathSeg8) {
      inherits(_SVGPathSegCurvetoCubicRel, _SVGPathSeg8);

      function _SVGPathSegCurvetoCubicRel(owningPathSegList, x, y, x1, y1, x2, y2) {
        classCallCheck(this, _SVGPathSegCurvetoCubicRel);

        var _this7 = possibleConstructorReturn(this, (_SVGPathSegCurvetoCubicRel.__proto__ || Object.getPrototypeOf(_SVGPathSegCurvetoCubicRel)).call(this, _SVGPathSeg.PATHSEG_CURVETO_CUBIC_REL, 'c', owningPathSegList));

        _this7._x = x;
        _this7._y = y;
        _this7._x1 = x1;
        _this7._y1 = y1;
        _this7._x2 = x2;
        _this7._y2 = y2;
        return _this7;
      }

      createClass(_SVGPathSegCurvetoCubicRel, [{
        key: 'toString',
        value: function toString() {
          return '[object SVGPathSegCurvetoCubicRel]';
        }
      }, {
        key: '_asPathString',
        value: function _asPathString() {
          return this.pathSegTypeAsLetter + ' ' + this._x1 + ' ' + this._y1 + ' ' + this._x2 + ' ' + this._y2 + ' ' + this._x + ' ' + this._y;
        }
      }, {
        key: 'clone',
        value: function clone() {
          return new _SVGPathSegCurvetoCubicRel(undefined, this._x, this._y, this._x1, this._y1, this._x2, this._y2);
        }
      }]);
      return _SVGPathSegCurvetoCubicRel;
    }(_SVGPathSeg);

    Object.defineProperties(_SVGPathSegCurvetoCubicRel.prototype, {
      x: {
        get: function get$$1() {
          return this._x;
        },
        set: function set$$1(x) {
          this._x = x;this._segmentChanged();
        },
        enumerable: true },
      y: {
        get: function get$$1() {
          return this._y;
        },
        set: function set$$1(y) {
          this._y = y;this._segmentChanged();
        },
        enumerable: true },
      x1: {
        get: function get$$1() {
          return this._x1;
        },
        set: function set$$1(x1) {
          this._x1 = x1;this._segmentChanged();
        },
        enumerable: true },
      y1: {
        get: function get$$1() {
          return this._y1;
        },
        set: function set$$1(y1) {
          this._y1 = y1;this._segmentChanged();
        },
        enumerable: true },
      x2: {
        get: function get$$1() {
          return this._x2;
        },
        set: function set$$1(x2) {
          this._x2 = x2;this._segmentChanged();
        },
        enumerable: true },
      y2: {
        get: function get$$1() {
          return this._y2;
        },
        set: function set$$1(y2) {
          this._y2 = y2;this._segmentChanged();
        },
        enumerable: true }
    });

    var _SVGPathSegCurvetoQuadraticAbs = function (_SVGPathSeg9) {
      inherits(_SVGPathSegCurvetoQuadraticAbs, _SVGPathSeg9);

      function _SVGPathSegCurvetoQuadraticAbs(owningPathSegList, x, y, x1, y1) {
        classCallCheck(this, _SVGPathSegCurvetoQuadraticAbs);

        var _this8 = possibleConstructorReturn(this, (_SVGPathSegCurvetoQuadraticAbs.__proto__ || Object.getPrototypeOf(_SVGPathSegCurvetoQuadraticAbs)).call(this, _SVGPathSeg.PATHSEG_CURVETO_QUADRATIC_ABS, 'Q', owningPathSegList));

        _this8._x = x;
        _this8._y = y;
        _this8._x1 = x1;
        _this8._y1 = y1;
        return _this8;
      }

      createClass(_SVGPathSegCurvetoQuadraticAbs, [{
        key: 'toString',
        value: function toString() {
          return '[object SVGPathSegCurvetoQuadraticAbs]';
        }
      }, {
        key: '_asPathString',
        value: function _asPathString() {
          return this.pathSegTypeAsLetter + ' ' + this._x1 + ' ' + this._y1 + ' ' + this._x + ' ' + this._y;
        }
      }, {
        key: 'clone',
        value: function clone() {
          return new _SVGPathSegCurvetoQuadraticAbs(undefined, this._x, this._y, this._x1, this._y1);
        }
      }]);
      return _SVGPathSegCurvetoQuadraticAbs;
    }(_SVGPathSeg);

    Object.defineProperties(_SVGPathSegCurvetoQuadraticAbs.prototype, {
      x: {
        get: function get$$1() {
          return this._x;
        },
        set: function set$$1(x) {
          this._x = x;this._segmentChanged();
        },
        enumerable: true },
      y: {
        get: function get$$1() {
          return this._y;
        },
        set: function set$$1(y) {
          this._y = y;this._segmentChanged();
        },
        enumerable: true },
      x1: {
        get: function get$$1() {
          return this._x1;
        },
        set: function set$$1(x1) {
          this._x1 = x1;this._segmentChanged();
        },
        enumerable: true },
      y1: {
        get: function get$$1() {
          return this._y1;
        },
        set: function set$$1(y1) {
          this._y1 = y1;this._segmentChanged();
        },
        enumerable: true }
    });

    var _SVGPathSegCurvetoQuadraticRel = function (_SVGPathSeg10) {
      inherits(_SVGPathSegCurvetoQuadraticRel, _SVGPathSeg10);

      function _SVGPathSegCurvetoQuadraticRel(owningPathSegList, x, y, x1, y1) {
        classCallCheck(this, _SVGPathSegCurvetoQuadraticRel);

        var _this9 = possibleConstructorReturn(this, (_SVGPathSegCurvetoQuadraticRel.__proto__ || Object.getPrototypeOf(_SVGPathSegCurvetoQuadraticRel)).call(this, _SVGPathSeg.PATHSEG_CURVETO_QUADRATIC_REL, 'q', owningPathSegList));

        _this9._x = x;
        _this9._y = y;
        _this9._x1 = x1;
        _this9._y1 = y1;
        return _this9;
      }

      createClass(_SVGPathSegCurvetoQuadraticRel, [{
        key: 'toString',
        value: function toString() {
          return '[object SVGPathSegCurvetoQuadraticRel]';
        }
      }, {
        key: '_asPathString',
        value: function _asPathString() {
          return this.pathSegTypeAsLetter + ' ' + this._x1 + ' ' + this._y1 + ' ' + this._x + ' ' + this._y;
        }
      }, {
        key: 'clone',
        value: function clone() {
          return new _SVGPathSegCurvetoQuadraticRel(undefined, this._x, this._y, this._x1, this._y1);
        }
      }]);
      return _SVGPathSegCurvetoQuadraticRel;
    }(_SVGPathSeg);

    Object.defineProperties(_SVGPathSegCurvetoQuadraticRel.prototype, {
      x: {
        get: function get$$1() {
          return this._x;
        },
        set: function set$$1(x) {
          this._x = x;this._segmentChanged();
        },
        enumerable: true },
      y: {
        get: function get$$1() {
          return this._y;
        },
        set: function set$$1(y) {
          this._y = y;this._segmentChanged();
        },
        enumerable: true },
      x1: {
        get: function get$$1() {
          return this._x1;
        },
        set: function set$$1(x1) {
          this._x1 = x1;this._segmentChanged();
        },
        enumerable: true },
      y1: {
        get: function get$$1() {
          return this._y1;
        },
        set: function set$$1(y1) {
          this._y1 = y1;this._segmentChanged();
        },
        enumerable: true }
    });

    var _SVGPathSegArcAbs = function (_SVGPathSeg11) {
      inherits(_SVGPathSegArcAbs, _SVGPathSeg11);

      function _SVGPathSegArcAbs(owningPathSegList, x, y, r1, r2, angle, largeArcFlag, sweepFlag) {
        classCallCheck(this, _SVGPathSegArcAbs);

        var _this10 = possibleConstructorReturn(this, (_SVGPathSegArcAbs.__proto__ || Object.getPrototypeOf(_SVGPathSegArcAbs)).call(this, _SVGPathSeg.PATHSEG_ARC_ABS, 'A', owningPathSegList));

        _this10._x = x;
        _this10._y = y;
        _this10._r1 = r1;
        _this10._r2 = r2;
        _this10._angle = angle;
        _this10._largeArcFlag = largeArcFlag;
        _this10._sweepFlag = sweepFlag;
        return _this10;
      }

      createClass(_SVGPathSegArcAbs, [{
        key: 'toString',
        value: function toString() {
          return '[object SVGPathSegArcAbs]';
        }
      }, {
        key: '_asPathString',
        value: function _asPathString() {
          return this.pathSegTypeAsLetter + ' ' + this._r1 + ' ' + this._r2 + ' ' + this._angle + ' ' + (this._largeArcFlag ? '1' : '0') + ' ' + (this._sweepFlag ? '1' : '0') + ' ' + this._x + ' ' + this._y;
        }
      }, {
        key: 'clone',
        value: function clone() {
          return new _SVGPathSegArcAbs(undefined, this._x, this._y, this._r1, this._r2, this._angle, this._largeArcFlag, this._sweepFlag);
        }
      }]);
      return _SVGPathSegArcAbs;
    }(_SVGPathSeg);

    Object.defineProperties(_SVGPathSegArcAbs.prototype, {
      x: {
        get: function get$$1() {
          return this._x;
        },
        set: function set$$1(x) {
          this._x = x;this._segmentChanged();
        },
        enumerable: true },
      y: {
        get: function get$$1() {
          return this._y;
        },
        set: function set$$1(y) {
          this._y = y;this._segmentChanged();
        },
        enumerable: true },
      r1: {
        get: function get$$1() {
          return this._r1;
        },
        set: function set$$1(r1) {
          this._r1 = r1;this._segmentChanged();
        },
        enumerable: true },
      r2: {
        get: function get$$1() {
          return this._r2;
        },
        set: function set$$1(r2) {
          this._r2 = r2;this._segmentChanged();
        },
        enumerable: true },
      angle: {
        get: function get$$1() {
          return this._angle;
        },
        set: function set$$1(angle) {
          this._angle = angle;this._segmentChanged();
        },
        enumerable: true },
      largeArcFlag: {
        get: function get$$1() {
          return this._largeArcFlag;
        },
        set: function set$$1(largeArcFlag) {
          this._largeArcFlag = largeArcFlag;this._segmentChanged();
        },
        enumerable: true },
      sweepFlag: {
        get: function get$$1() {
          return this._sweepFlag;
        },
        set: function set$$1(sweepFlag) {
          this._sweepFlag = sweepFlag;this._segmentChanged();
        },
        enumerable: true }
    });

    var _SVGPathSegArcRel = function (_SVGPathSeg12) {
      inherits(_SVGPathSegArcRel, _SVGPathSeg12);

      function _SVGPathSegArcRel(owningPathSegList, x, y, r1, r2, angle, largeArcFlag, sweepFlag) {
        classCallCheck(this, _SVGPathSegArcRel);

        var _this11 = possibleConstructorReturn(this, (_SVGPathSegArcRel.__proto__ || Object.getPrototypeOf(_SVGPathSegArcRel)).call(this, _SVGPathSeg.PATHSEG_ARC_REL, 'a', owningPathSegList));

        _this11._x = x;
        _this11._y = y;
        _this11._r1 = r1;
        _this11._r2 = r2;
        _this11._angle = angle;
        _this11._largeArcFlag = largeArcFlag;
        _this11._sweepFlag = sweepFlag;
        return _this11;
      }

      createClass(_SVGPathSegArcRel, [{
        key: 'toString',
        value: function toString() {
          return '[object SVGPathSegArcRel]';
        }
      }, {
        key: '_asPathString',
        value: function _asPathString() {
          return this.pathSegTypeAsLetter + ' ' + this._r1 + ' ' + this._r2 + ' ' + this._angle + ' ' + (this._largeArcFlag ? '1' : '0') + ' ' + (this._sweepFlag ? '1' : '0') + ' ' + this._x + ' ' + this._y;
        }
      }, {
        key: 'clone',
        value: function clone() {
          return new _SVGPathSegArcRel(undefined, this._x, this._y, this._r1, this._r2, this._angle, this._largeArcFlag, this._sweepFlag);
        }
      }]);
      return _SVGPathSegArcRel;
    }(_SVGPathSeg);

    Object.defineProperties(_SVGPathSegArcRel.prototype, {
      x: {
        get: function get$$1() {
          return this._x;
        },
        set: function set$$1(x) {
          this._x = x;this._segmentChanged();
        },
        enumerable: true },
      y: {
        get: function get$$1() {
          return this._y;
        },
        set: function set$$1(y) {
          this._y = y;this._segmentChanged();
        },
        enumerable: true },
      r1: {
        get: function get$$1() {
          return this._r1;
        },
        set: function set$$1(r1) {
          this._r1 = r1;this._segmentChanged();
        },
        enumerable: true },
      r2: {
        get: function get$$1() {
          return this._r2;
        },
        set: function set$$1(r2) {
          this._r2 = r2;this._segmentChanged();
        },
        enumerable: true },
      angle: {
        get: function get$$1() {
          return this._angle;
        },
        set: function set$$1(angle) {
          this._angle = angle;this._segmentChanged();
        },
        enumerable: true },
      largeArcFlag: {
        get: function get$$1() {
          return this._largeArcFlag;
        },
        set: function set$$1(largeArcFlag) {
          this._largeArcFlag = largeArcFlag;this._segmentChanged();
        },
        enumerable: true },
      sweepFlag: {
        get: function get$$1() {
          return this._sweepFlag;
        },
        set: function set$$1(sweepFlag) {
          this._sweepFlag = sweepFlag;this._segmentChanged();
        },
        enumerable: true }
    });

    var _SVGPathSegLinetoHorizontalAbs = function (_SVGPathSeg13) {
      inherits(_SVGPathSegLinetoHorizontalAbs, _SVGPathSeg13);

      function _SVGPathSegLinetoHorizontalAbs(owningPathSegList, x) {
        classCallCheck(this, _SVGPathSegLinetoHorizontalAbs);

        var _this12 = possibleConstructorReturn(this, (_SVGPathSegLinetoHorizontalAbs.__proto__ || Object.getPrototypeOf(_SVGPathSegLinetoHorizontalAbs)).call(this, _SVGPathSeg.PATHSEG_LINETO_HORIZONTAL_ABS, 'H', owningPathSegList));

        _this12._x = x;
        return _this12;
      }

      createClass(_SVGPathSegLinetoHorizontalAbs, [{
        key: 'toString',
        value: function toString() {
          return '[object SVGPathSegLinetoHorizontalAbs]';
        }
      }, {
        key: '_asPathString',
        value: function _asPathString() {
          return this.pathSegTypeAsLetter + ' ' + this._x;
        }
      }, {
        key: 'clone',
        value: function clone() {
          return new _SVGPathSegLinetoHorizontalAbs(undefined, this._x);
        }
      }]);
      return _SVGPathSegLinetoHorizontalAbs;
    }(_SVGPathSeg);

    Object.defineProperty(_SVGPathSegLinetoHorizontalAbs.prototype, 'x', {
      get: function get$$1() {
        return this._x;
      },
      set: function set$$1(x) {
        this._x = x;this._segmentChanged();
      },
      enumerable: true });

    var _SVGPathSegLinetoHorizontalRel = function (_SVGPathSeg14) {
      inherits(_SVGPathSegLinetoHorizontalRel, _SVGPathSeg14);

      function _SVGPathSegLinetoHorizontalRel(owningPathSegList, x) {
        classCallCheck(this, _SVGPathSegLinetoHorizontalRel);

        var _this13 = possibleConstructorReturn(this, (_SVGPathSegLinetoHorizontalRel.__proto__ || Object.getPrototypeOf(_SVGPathSegLinetoHorizontalRel)).call(this, _SVGPathSeg.PATHSEG_LINETO_HORIZONTAL_REL, 'h', owningPathSegList));

        _this13._x = x;
        return _this13;
      }

      createClass(_SVGPathSegLinetoHorizontalRel, [{
        key: 'toString',
        value: function toString() {
          return '[object SVGPathSegLinetoHorizontalRel]';
        }
      }, {
        key: '_asPathString',
        value: function _asPathString() {
          return this.pathSegTypeAsLetter + ' ' + this._x;
        }
      }, {
        key: 'clone',
        value: function clone() {
          return new _SVGPathSegLinetoHorizontalRel(undefined, this._x);
        }
      }]);
      return _SVGPathSegLinetoHorizontalRel;
    }(_SVGPathSeg);

    Object.defineProperty(_SVGPathSegLinetoHorizontalRel.prototype, 'x', {
      get: function get$$1() {
        return this._x;
      },
      set: function set$$1(x) {
        this._x = x;this._segmentChanged();
      },
      enumerable: true });

    var _SVGPathSegLinetoVerticalAbs = function (_SVGPathSeg15) {
      inherits(_SVGPathSegLinetoVerticalAbs, _SVGPathSeg15);

      function _SVGPathSegLinetoVerticalAbs(owningPathSegList, y) {
        classCallCheck(this, _SVGPathSegLinetoVerticalAbs);

        var _this14 = possibleConstructorReturn(this, (_SVGPathSegLinetoVerticalAbs.__proto__ || Object.getPrototypeOf(_SVGPathSegLinetoVerticalAbs)).call(this, _SVGPathSeg.PATHSEG_LINETO_VERTICAL_ABS, 'V', owningPathSegList));

        _this14._y = y;
        return _this14;
      }

      createClass(_SVGPathSegLinetoVerticalAbs, [{
        key: 'toString',
        value: function toString() {
          return '[object SVGPathSegLinetoVerticalAbs]';
        }
      }, {
        key: '_asPathString',
        value: function _asPathString() {
          return this.pathSegTypeAsLetter + ' ' + this._y;
        }
      }, {
        key: 'clone',
        value: function clone() {
          return new _SVGPathSegLinetoVerticalAbs(undefined, this._y);
        }
      }]);
      return _SVGPathSegLinetoVerticalAbs;
    }(_SVGPathSeg);

    Object.defineProperty(_SVGPathSegLinetoVerticalAbs.prototype, 'y', {
      get: function get$$1() {
        return this._y;
      },
      set: function set$$1(y) {
        this._y = y;this._segmentChanged();
      },
      enumerable: true });

    var _SVGPathSegLinetoVerticalRel = function (_SVGPathSeg16) {
      inherits(_SVGPathSegLinetoVerticalRel, _SVGPathSeg16);

      function _SVGPathSegLinetoVerticalRel(owningPathSegList, y) {
        classCallCheck(this, _SVGPathSegLinetoVerticalRel);

        var _this15 = possibleConstructorReturn(this, (_SVGPathSegLinetoVerticalRel.__proto__ || Object.getPrototypeOf(_SVGPathSegLinetoVerticalRel)).call(this, _SVGPathSeg.PATHSEG_LINETO_VERTICAL_REL, 'v', owningPathSegList));

        _this15._y = y;
        return _this15;
      }

      createClass(_SVGPathSegLinetoVerticalRel, [{
        key: 'toString',
        value: function toString() {
          return '[object SVGPathSegLinetoVerticalRel]';
        }
      }, {
        key: '_asPathString',
        value: function _asPathString() {
          return this.pathSegTypeAsLetter + ' ' + this._y;
        }
      }, {
        key: 'clone',
        value: function clone() {
          return new _SVGPathSegLinetoVerticalRel(undefined, this._y);
        }
      }]);
      return _SVGPathSegLinetoVerticalRel;
    }(_SVGPathSeg);

    Object.defineProperty(_SVGPathSegLinetoVerticalRel.prototype, 'y', {
      get: function get$$1() {
        return this._y;
      },
      set: function set$$1(y) {
        this._y = y;this._segmentChanged();
      },
      enumerable: true });

    var _SVGPathSegCurvetoCubicSmoothAbs = function (_SVGPathSeg17) {
      inherits(_SVGPathSegCurvetoCubicSmoothAbs, _SVGPathSeg17);

      function _SVGPathSegCurvetoCubicSmoothAbs(owningPathSegList, x, y, x2, y2) {
        classCallCheck(this, _SVGPathSegCurvetoCubicSmoothAbs);

        var _this16 = possibleConstructorReturn(this, (_SVGPathSegCurvetoCubicSmoothAbs.__proto__ || Object.getPrototypeOf(_SVGPathSegCurvetoCubicSmoothAbs)).call(this, _SVGPathSeg.PATHSEG_CURVETO_CUBIC_SMOOTH_ABS, 'S', owningPathSegList));

        _this16._x = x;
        _this16._y = y;
        _this16._x2 = x2;
        _this16._y2 = y2;
        return _this16;
      }

      createClass(_SVGPathSegCurvetoCubicSmoothAbs, [{
        key: 'toString',
        value: function toString() {
          return '[object SVGPathSegCurvetoCubicSmoothAbs]';
        }
      }, {
        key: '_asPathString',
        value: function _asPathString() {
          return this.pathSegTypeAsLetter + ' ' + this._x2 + ' ' + this._y2 + ' ' + this._x + ' ' + this._y;
        }
      }, {
        key: 'clone',
        value: function clone() {
          return new _SVGPathSegCurvetoCubicSmoothAbs(undefined, this._x, this._y, this._x2, this._y2);
        }
      }]);
      return _SVGPathSegCurvetoCubicSmoothAbs;
    }(_SVGPathSeg);

    Object.defineProperties(_SVGPathSegCurvetoCubicSmoothAbs.prototype, {
      x: {
        get: function get$$1() {
          return this._x;
        },
        set: function set$$1(x) {
          this._x = x;this._segmentChanged();
        },
        enumerable: true },
      y: {
        get: function get$$1() {
          return this._y;
        },
        set: function set$$1(y) {
          this._y = y;this._segmentChanged();
        },
        enumerable: true },
      x2: {
        get: function get$$1() {
          return this._x2;
        },
        set: function set$$1(x2) {
          this._x2 = x2;this._segmentChanged();
        },
        enumerable: true },
      y2: {
        get: function get$$1() {
          return this._y2;
        },
        set: function set$$1(y2) {
          this._y2 = y2;this._segmentChanged();
        },
        enumerable: true }
    });

    var _SVGPathSegCurvetoCubicSmoothRel = function (_SVGPathSeg18) {
      inherits(_SVGPathSegCurvetoCubicSmoothRel, _SVGPathSeg18);

      function _SVGPathSegCurvetoCubicSmoothRel(owningPathSegList, x, y, x2, y2) {
        classCallCheck(this, _SVGPathSegCurvetoCubicSmoothRel);

        var _this17 = possibleConstructorReturn(this, (_SVGPathSegCurvetoCubicSmoothRel.__proto__ || Object.getPrototypeOf(_SVGPathSegCurvetoCubicSmoothRel)).call(this, _SVGPathSeg.PATHSEG_CURVETO_CUBIC_SMOOTH_REL, 's', owningPathSegList));

        _this17._x = x;
        _this17._y = y;
        _this17._x2 = x2;
        _this17._y2 = y2;
        return _this17;
      }

      createClass(_SVGPathSegCurvetoCubicSmoothRel, [{
        key: 'toString',
        value: function toString() {
          return '[object SVGPathSegCurvetoCubicSmoothRel]';
        }
      }, {
        key: '_asPathString',
        value: function _asPathString() {
          return this.pathSegTypeAsLetter + ' ' + this._x2 + ' ' + this._y2 + ' ' + this._x + ' ' + this._y;
        }
      }, {
        key: 'clone',
        value: function clone() {
          return new _SVGPathSegCurvetoCubicSmoothRel(undefined, this._x, this._y, this._x2, this._y2);
        }
      }]);
      return _SVGPathSegCurvetoCubicSmoothRel;
    }(_SVGPathSeg);

    Object.defineProperties(_SVGPathSegCurvetoCubicSmoothRel.prototype, {
      x: {
        get: function get$$1() {
          return this._x;
        },
        set: function set$$1(x) {
          this._x = x;this._segmentChanged();
        },
        enumerable: true },
      y: {
        get: function get$$1() {
          return this._y;
        },
        set: function set$$1(y) {
          this._y = y;this._segmentChanged();
        },
        enumerable: true },
      x2: {
        get: function get$$1() {
          return this._x2;
        },
        set: function set$$1(x2) {
          this._x2 = x2;this._segmentChanged();
        },
        enumerable: true },
      y2: {
        get: function get$$1() {
          return this._y2;
        },
        set: function set$$1(y2) {
          this._y2 = y2;this._segmentChanged();
        },
        enumerable: true }
    });

    var _SVGPathSegCurvetoQuadraticSmoothAbs = function (_SVGPathSeg19) {
      inherits(_SVGPathSegCurvetoQuadraticSmoothAbs, _SVGPathSeg19);

      function _SVGPathSegCurvetoQuadraticSmoothAbs(owningPathSegList, x, y) {
        classCallCheck(this, _SVGPathSegCurvetoQuadraticSmoothAbs);

        var _this18 = possibleConstructorReturn(this, (_SVGPathSegCurvetoQuadraticSmoothAbs.__proto__ || Object.getPrototypeOf(_SVGPathSegCurvetoQuadraticSmoothAbs)).call(this, _SVGPathSeg.PATHSEG_CURVETO_QUADRATIC_SMOOTH_ABS, 'T', owningPathSegList));

        _this18._x = x;
        _this18._y = y;
        return _this18;
      }

      createClass(_SVGPathSegCurvetoQuadraticSmoothAbs, [{
        key: 'toString',
        value: function toString() {
          return '[object SVGPathSegCurvetoQuadraticSmoothAbs]';
        }
      }, {
        key: '_asPathString',
        value: function _asPathString() {
          return this.pathSegTypeAsLetter + ' ' + this._x + ' ' + this._y;
        }
      }, {
        key: 'clone',
        value: function clone() {
          return new _SVGPathSegCurvetoQuadraticSmoothAbs(undefined, this._x, this._y);
        }
      }]);
      return _SVGPathSegCurvetoQuadraticSmoothAbs;
    }(_SVGPathSeg);

    Object.defineProperties(_SVGPathSegCurvetoQuadraticSmoothAbs.prototype, {
      x: {
        get: function get$$1() {
          return this._x;
        },
        set: function set$$1(x) {
          this._x = x;this._segmentChanged();
        },
        enumerable: true },
      y: {
        get: function get$$1() {
          return this._y;
        },
        set: function set$$1(y) {
          this._y = y;this._segmentChanged();
        },
        enumerable: true }
    });

    var _SVGPathSegCurvetoQuadraticSmoothRel = function (_SVGPathSeg20) {
      inherits(_SVGPathSegCurvetoQuadraticSmoothRel, _SVGPathSeg20);

      function _SVGPathSegCurvetoQuadraticSmoothRel(owningPathSegList, x, y) {
        classCallCheck(this, _SVGPathSegCurvetoQuadraticSmoothRel);

        var _this19 = possibleConstructorReturn(this, (_SVGPathSegCurvetoQuadraticSmoothRel.__proto__ || Object.getPrototypeOf(_SVGPathSegCurvetoQuadraticSmoothRel)).call(this, _SVGPathSeg.PATHSEG_CURVETO_QUADRATIC_SMOOTH_REL, 't', owningPathSegList));

        _this19._x = x;
        _this19._y = y;
        return _this19;
      }

      createClass(_SVGPathSegCurvetoQuadraticSmoothRel, [{
        key: 'toString',
        value: function toString() {
          return '[object SVGPathSegCurvetoQuadraticSmoothRel]';
        }
      }, {
        key: '_asPathString',
        value: function _asPathString() {
          return this.pathSegTypeAsLetter + ' ' + this._x + ' ' + this._y;
        }
      }, {
        key: 'clone',
        value: function clone() {
          return new _SVGPathSegCurvetoQuadraticSmoothRel(undefined, this._x, this._y);
        }
      }]);
      return _SVGPathSegCurvetoQuadraticSmoothRel;
    }(_SVGPathSeg);

    Object.defineProperties(_SVGPathSegCurvetoQuadraticSmoothRel.prototype, {
      x: {
        get: function get$$1() {
          return this._x;
        },
        set: function set$$1(x) {
          this._x = x;this._segmentChanged();
        },
        enumerable: true },
      y: {
        get: function get$$1() {
          return this._y;
        },
        set: function set$$1(y) {
          this._y = y;this._segmentChanged();
        },
        enumerable: true }
    });

    // Add createSVGPathSeg* functions to SVGPathElement.
    // Spec: https://www.w3.org/TR/SVG11/single-page.html#paths-InterfaceSVGPathElement.
    SVGPathElement.prototype.createSVGPathSegClosePath = function () {
      return new _SVGPathSegClosePath(undefined);
    };
    SVGPathElement.prototype.createSVGPathSegMovetoAbs = function (x, y) {
      return new _SVGPathSegMovetoAbs(undefined, x, y);
    };
    SVGPathElement.prototype.createSVGPathSegMovetoRel = function (x, y) {
      return new _SVGPathSegMovetoRel(undefined, x, y);
    };
    SVGPathElement.prototype.createSVGPathSegLinetoAbs = function (x, y) {
      return new _SVGPathSegLinetoAbs(undefined, x, y);
    };
    SVGPathElement.prototype.createSVGPathSegLinetoRel = function (x, y) {
      return new _SVGPathSegLinetoRel(undefined, x, y);
    };
    SVGPathElement.prototype.createSVGPathSegCurvetoCubicAbs = function (x, y, x1, y1, x2, y2) {
      return new _SVGPathSegCurvetoCubicAbs(undefined, x, y, x1, y1, x2, y2);
    };
    SVGPathElement.prototype.createSVGPathSegCurvetoCubicRel = function (x, y, x1, y1, x2, y2) {
      return new _SVGPathSegCurvetoCubicRel(undefined, x, y, x1, y1, x2, y2);
    };
    SVGPathElement.prototype.createSVGPathSegCurvetoQuadraticAbs = function (x, y, x1, y1) {
      return new _SVGPathSegCurvetoQuadraticAbs(undefined, x, y, x1, y1);
    };
    SVGPathElement.prototype.createSVGPathSegCurvetoQuadraticRel = function (x, y, x1, y1) {
      return new _SVGPathSegCurvetoQuadraticRel(undefined, x, y, x1, y1);
    };
    SVGPathElement.prototype.createSVGPathSegArcAbs = function (x, y, r1, r2, angle, largeArcFlag, sweepFlag) {
      return new _SVGPathSegArcAbs(undefined, x, y, r1, r2, angle, largeArcFlag, sweepFlag);
    };
    SVGPathElement.prototype.createSVGPathSegArcRel = function (x, y, r1, r2, angle, largeArcFlag, sweepFlag) {
      return new _SVGPathSegArcRel(undefined, x, y, r1, r2, angle, largeArcFlag, sweepFlag);
    };
    SVGPathElement.prototype.createSVGPathSegLinetoHorizontalAbs = function (x) {
      return new _SVGPathSegLinetoHorizontalAbs(undefined, x);
    };
    SVGPathElement.prototype.createSVGPathSegLinetoHorizontalRel = function (x) {
      return new _SVGPathSegLinetoHorizontalRel(undefined, x);
    };
    SVGPathElement.prototype.createSVGPathSegLinetoVerticalAbs = function (y) {
      return new _SVGPathSegLinetoVerticalAbs(undefined, y);
    };
    SVGPathElement.prototype.createSVGPathSegLinetoVerticalRel = function (y) {
      return new _SVGPathSegLinetoVerticalRel(undefined, y);
    };
    SVGPathElement.prototype.createSVGPathSegCurvetoCubicSmoothAbs = function (x, y, x2, y2) {
      return new _SVGPathSegCurvetoCubicSmoothAbs(undefined, x, y, x2, y2);
    };
    SVGPathElement.prototype.createSVGPathSegCurvetoCubicSmoothRel = function (x, y, x2, y2) {
      return new _SVGPathSegCurvetoCubicSmoothRel(undefined, x, y, x2, y2);
    };
    SVGPathElement.prototype.createSVGPathSegCurvetoQuadraticSmoothAbs = function (x, y) {
      return new _SVGPathSegCurvetoQuadraticSmoothAbs(undefined, x, y);
    };
    SVGPathElement.prototype.createSVGPathSegCurvetoQuadraticSmoothRel = function (x, y) {
      return new _SVGPathSegCurvetoQuadraticSmoothRel(undefined, x, y);
    };

    if (!('getPathSegAtLength' in SVGPathElement.prototype)) {
      // Add getPathSegAtLength to SVGPathElement.
      // Spec: https://www.w3.org/TR/SVG11/single-page.html#paths-__svg__SVGPathElement__getPathSegAtLength
      // This polyfill requires SVGPathElement.getTotalLength to implement the distance-along-a-path algorithm.
      SVGPathElement.prototype.getPathSegAtLength = function (distance) {
        if (distance === undefined || !isFinite(distance)) {
          throw new Error('Invalid arguments.');
        }

        var measurementElement = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        measurementElement.setAttribute('d', this.getAttribute('d'));
        var lastPathSegment = measurementElement.pathSegList.numberOfItems - 1;

        // If the path is empty, return 0.
        if (lastPathSegment <= 0) {
          return 0;
        }

        do {
          measurementElement.pathSegList.removeItem(lastPathSegment);
          if (distance > measurementElement.getTotalLength()) {
            break;
          }
          lastPathSegment--;
        } while (lastPathSegment > 0);
        return lastPathSegment;
      };
    }

    window.SVGPathSeg = _SVGPathSeg;
    window.SVGPathSegClosePath = _SVGPathSegClosePath;
    window.SVGPathSegMovetoAbs = _SVGPathSegMovetoAbs;
    window.SVGPathSegMovetoRel = _SVGPathSegMovetoRel;
    window.SVGPathSegLinetoAbs = _SVGPathSegLinetoAbs;
    window.SVGPathSegLinetoRel = _SVGPathSegLinetoRel;
    window.SVGPathSegCurvetoCubicAbs = _SVGPathSegCurvetoCubicAbs;
    window.SVGPathSegCurvetoCubicRel = _SVGPathSegCurvetoCubicRel;
    window.SVGPathSegCurvetoQuadraticAbs = _SVGPathSegCurvetoQuadraticAbs;
    window.SVGPathSegCurvetoQuadraticRel = _SVGPathSegCurvetoQuadraticRel;
    window.SVGPathSegArcAbs = _SVGPathSegArcAbs;
    window.SVGPathSegArcRel = _SVGPathSegArcRel;
    window.SVGPathSegLinetoHorizontalAbs = _SVGPathSegLinetoHorizontalAbs;
    window.SVGPathSegLinetoHorizontalRel = _SVGPathSegLinetoHorizontalRel;
    window.SVGPathSegLinetoVerticalAbs = _SVGPathSegLinetoVerticalAbs;
    window.SVGPathSegLinetoVerticalRel = _SVGPathSegLinetoVerticalRel;
    window.SVGPathSegCurvetoCubicSmoothAbs = _SVGPathSegCurvetoCubicSmoothAbs;
    window.SVGPathSegCurvetoCubicSmoothRel = _SVGPathSegCurvetoCubicSmoothRel;
    window.SVGPathSegCurvetoQuadraticSmoothAbs = _SVGPathSegCurvetoQuadraticSmoothAbs;
    window.SVGPathSegCurvetoQuadraticSmoothRel = _SVGPathSegCurvetoQuadraticSmoothRel;
  }

  // Checking for SVGPathSegList in window checks for the case of an implementation without the
  // SVGPathSegList API.
  // The second check for appendItem is specific to Firefox 59+ which removed only parts of the
  // SVGPathSegList API (e.g., appendItem). In this case we need to re-implement the entire API
  // so the polyfill data (i.e., _list) is used throughout.
  if (!('SVGPathSegList' in window) || !('appendItem' in SVGPathSegList.prototype)) {
    // Spec: https://www.w3.org/TR/SVG11/single-page.html#paths-InterfaceSVGPathSegList
    var _SVGPathSegList = function () {
      function _SVGPathSegList(pathElement) {
        classCallCheck(this, _SVGPathSegList);

        this._pathElement = pathElement;
        this._list = this._parsePath(this._pathElement.getAttribute('d'));

        // Use a MutationObserver to catch changes to the path's "d" attribute.
        this._mutationObserverConfig = { attributes: true, attributeFilter: ['d'] };
        this._pathElementMutationObserver = new MutationObserver(this._updateListFromPathMutations.bind(this));
        this._pathElementMutationObserver.observe(this._pathElement, this._mutationObserverConfig);
      }
      // Process any pending mutations to the path element and update the list as needed.
      // This should be the first call of all public functions and is needed because
      // MutationObservers are not synchronous so we can have pending asynchronous mutations.


      createClass(_SVGPathSegList, [{
        key: '_checkPathSynchronizedToList',
        value: function _checkPathSynchronizedToList() {
          this._updateListFromPathMutations(this._pathElementMutationObserver.takeRecords());
        }
      }, {
        key: '_updateListFromPathMutations',
        value: function _updateListFromPathMutations(mutationRecords) {
          if (!this._pathElement) {
            return;
          }
          var hasPathMutations = false;
          mutationRecords.forEach(function (record) {
            if (record.attributeName === 'd') {
              hasPathMutations = true;
            }
          });
          if (hasPathMutations) {
            this._list = this._parsePath(this._pathElement.getAttribute('d'));
          }
        }

        // Serialize the list and update the path's 'd' attribute.

      }, {
        key: '_writeListToPath',
        value: function _writeListToPath() {
          this._pathElementMutationObserver.disconnect();
          this._pathElement.setAttribute('d', _SVGPathSegList._pathSegArrayAsString(this._list));
          this._pathElementMutationObserver.observe(this._pathElement, this._mutationObserverConfig);
        }

        // When a path segment changes the list needs to be synchronized back to the path element.

      }, {
        key: 'segmentChanged',
        value: function segmentChanged(pathSeg) {
          this._writeListToPath();
        }
      }, {
        key: 'clear',
        value: function clear() {
          this._checkPathSynchronizedToList();

          this._list.forEach(function (pathSeg) {
            pathSeg._owningPathSegList = null;
          });
          this._list = [];
          this._writeListToPath();
        }
      }, {
        key: 'initialize',
        value: function initialize(newItem) {
          this._checkPathSynchronizedToList();

          this._list = [newItem];
          newItem._owningPathSegList = this;
          this._writeListToPath();
          return newItem;
        }
      }, {
        key: '_checkValidIndex',
        value: function _checkValidIndex(index) {
          if (isNaN(index) || index < 0 || index >= this.numberOfItems) {
            throw new Error('INDEX_SIZE_ERR');
          }
        }
      }, {
        key: 'getItem',
        value: function getItem(index) {
          this._checkPathSynchronizedToList();

          this._checkValidIndex(index);
          return this._list[index];
        }
      }, {
        key: 'insertItemBefore',
        value: function insertItemBefore(newItem, index) {
          this._checkPathSynchronizedToList();

          // Spec: If the index is greater than or equal to numberOfItems, then the new item is appended to the end of the list.
          if (index > this.numberOfItems) {
            index = this.numberOfItems;
          }
          if (newItem._owningPathSegList) {
            // SVG2 spec says to make a copy.
            newItem = newItem.clone();
          }
          this._list.splice(index, 0, newItem);
          newItem._owningPathSegList = this;
          this._writeListToPath();
          return newItem;
        }
      }, {
        key: 'replaceItem',
        value: function replaceItem(newItem, index) {
          this._checkPathSynchronizedToList();

          if (newItem._owningPathSegList) {
            // SVG2 spec says to make a copy.
            newItem = newItem.clone();
          }
          this._checkValidIndex(index);
          this._list[index] = newItem;
          newItem._owningPathSegList = this;
          this._writeListToPath();
          return newItem;
        }
      }, {
        key: 'removeItem',
        value: function removeItem(index) {
          this._checkPathSynchronizedToList();

          this._checkValidIndex(index);
          var item = this._list[index];
          this._list.splice(index, 1);
          this._writeListToPath();
          return item;
        }
      }, {
        key: 'appendItem',
        value: function appendItem(newItem) {
          this._checkPathSynchronizedToList();

          if (newItem._owningPathSegList) {
            // SVG2 spec says to make a copy.
            newItem = newItem.clone();
          }
          this._list.push(newItem);
          newItem._owningPathSegList = this;
          // TODO: Optimize this to just append to the existing attribute.
          this._writeListToPath();
          return newItem;
        }

        // This closely follows SVGPathParser::parsePath from Source/core/svg/SVGPathParser.cpp.

      }, {
        key: '_parsePath',
        value: function _parsePath(string) {
          if (!string || !string.length) {
            return [];
          }

          var owningPathSegList = this;

          var Builder = function () {
            function Builder() {
              classCallCheck(this, Builder);

              this.pathSegList = [];
            }

            createClass(Builder, [{
              key: 'appendSegment',
              value: function appendSegment(pathSeg) {
                this.pathSegList.push(pathSeg);
              }
            }]);
            return Builder;
          }();

          var Source = function () {
            function Source(string) {
              classCallCheck(this, Source);

              this._string = string;
              this._currentIndex = 0;
              this._endIndex = this._string.length;
              this._previousCommand = SVGPathSeg.PATHSEG_UNKNOWN;

              this._skipOptionalSpaces();
            }

            createClass(Source, [{
              key: '_isCurrentSpace',
              value: function _isCurrentSpace() {
                var character = this._string[this._currentIndex];
                return character <= ' ' && (character === ' ' || character === '\n' || character === '\t' || character === '\r' || character === '\f');
              }
            }, {
              key: '_skipOptionalSpaces',
              value: function _skipOptionalSpaces() {
                while (this._currentIndex < this._endIndex && this._isCurrentSpace()) {
                  this._currentIndex++;
                }
                return this._currentIndex < this._endIndex;
              }
            }, {
              key: '_skipOptionalSpacesOrDelimiter',
              value: function _skipOptionalSpacesOrDelimiter() {
                if (this._currentIndex < this._endIndex && !this._isCurrentSpace() && this._string.charAt(this._currentIndex) !== ',') {
                  return false;
                }
                if (this._skipOptionalSpaces()) {
                  if (this._currentIndex < this._endIndex && this._string.charAt(this._currentIndex) === ',') {
                    this._currentIndex++;
                    this._skipOptionalSpaces();
                  }
                }
                return this._currentIndex < this._endIndex;
              }
            }, {
              key: 'hasMoreData',
              value: function hasMoreData() {
                return this._currentIndex < this._endIndex;
              }
            }, {
              key: 'peekSegmentType',
              value: function peekSegmentType() {
                var lookahead = this._string[this._currentIndex];
                return this._pathSegTypeFromChar(lookahead);
              }
            }, {
              key: '_pathSegTypeFromChar',
              value: function _pathSegTypeFromChar(lookahead) {
                switch (lookahead) {
                  case 'Z':
                  case 'z':
                    return SVGPathSeg.PATHSEG_CLOSEPATH;
                  case 'M':
                    return SVGPathSeg.PATHSEG_MOVETO_ABS;
                  case 'm':
                    return SVGPathSeg.PATHSEG_MOVETO_REL;
                  case 'L':
                    return SVGPathSeg.PATHSEG_LINETO_ABS;
                  case 'l':
                    return SVGPathSeg.PATHSEG_LINETO_REL;
                  case 'C':
                    return SVGPathSeg.PATHSEG_CURVETO_CUBIC_ABS;
                  case 'c':
                    return SVGPathSeg.PATHSEG_CURVETO_CUBIC_REL;
                  case 'Q':
                    return SVGPathSeg.PATHSEG_CURVETO_QUADRATIC_ABS;
                  case 'q':
                    return SVGPathSeg.PATHSEG_CURVETO_QUADRATIC_REL;
                  case 'A':
                    return SVGPathSeg.PATHSEG_ARC_ABS;
                  case 'a':
                    return SVGPathSeg.PATHSEG_ARC_REL;
                  case 'H':
                    return SVGPathSeg.PATHSEG_LINETO_HORIZONTAL_ABS;
                  case 'h':
                    return SVGPathSeg.PATHSEG_LINETO_HORIZONTAL_REL;
                  case 'V':
                    return SVGPathSeg.PATHSEG_LINETO_VERTICAL_ABS;
                  case 'v':
                    return SVGPathSeg.PATHSEG_LINETO_VERTICAL_REL;
                  case 'S':
                    return SVGPathSeg.PATHSEG_CURVETO_CUBIC_SMOOTH_ABS;
                  case 's':
                    return SVGPathSeg.PATHSEG_CURVETO_CUBIC_SMOOTH_REL;
                  case 'T':
                    return SVGPathSeg.PATHSEG_CURVETO_QUADRATIC_SMOOTH_ABS;
                  case 't':
                    return SVGPathSeg.PATHSEG_CURVETO_QUADRATIC_SMOOTH_REL;
                  default:
                    return SVGPathSeg.PATHSEG_UNKNOWN;
                }
              }
            }, {
              key: '_nextCommandHelper',
              value: function _nextCommandHelper(lookahead, previousCommand) {
                // Check for remaining coordinates in the current command.
                if ((lookahead === '+' || lookahead === '-' || lookahead === '.' || lookahead >= '0' && lookahead <= '9') && previousCommand !== SVGPathSeg.PATHSEG_CLOSEPATH) {
                  if (previousCommand === SVGPathSeg.PATHSEG_MOVETO_ABS) {
                    return SVGPathSeg.PATHSEG_LINETO_ABS;
                  }
                  if (previousCommand === SVGPathSeg.PATHSEG_MOVETO_REL) {
                    return SVGPathSeg.PATHSEG_LINETO_REL;
                  }
                  return previousCommand;
                }
                return SVGPathSeg.PATHSEG_UNKNOWN;
              }
            }, {
              key: 'initialCommandIsMoveTo',
              value: function initialCommandIsMoveTo() {
                // If the path is empty it is still valid, so return true.
                if (!this.hasMoreData()) {
                  return true;
                }
                var command = this.peekSegmentType();
                // Path must start with moveTo.
                return command === SVGPathSeg.PATHSEG_MOVETO_ABS || command === SVGPathSeg.PATHSEG_MOVETO_REL;
              }

              // Parse a number from an SVG path. This very closely follows genericParseNumber(...) from Source/core/svg/SVGParserUtilities.cpp.
              // Spec: https://www.w3.org/TR/SVG11/single-page.html#paths-PathDataBNF

            }, {
              key: '_parseNumber',
              value: function _parseNumber() {
                var exponent = 0;
                var integer = 0;
                var frac = 1;
                var decimal = 0;
                var sign = 1;
                var expsign = 1;

                var startIndex = this._currentIndex;

                this._skipOptionalSpaces();

                // Read the sign.
                if (this._currentIndex < this._endIndex && this._string.charAt(this._currentIndex) === '+') {
                  this._currentIndex++;
                } else if (this._currentIndex < this._endIndex && this._string.charAt(this._currentIndex) === '-') {
                  this._currentIndex++;
                  sign = -1;
                }

                if (this._currentIndex === this._endIndex || (this._string.charAt(this._currentIndex) < '0' || this._string.charAt(this._currentIndex) > '9') && this._string.charAt(this._currentIndex) !== '.') {
                  // The first character of a number must be one of [0-9+-.].
                  return undefined;
                }

                // Read the integer part, build right-to-left.
                var startIntPartIndex = this._currentIndex;
                while (this._currentIndex < this._endIndex && this._string.charAt(this._currentIndex) >= '0' && this._string.charAt(this._currentIndex) <= '9') {
                  this._currentIndex++; // Advance to first non-digit.
                }

                if (this._currentIndex !== startIntPartIndex) {
                  var scanIntPartIndex = this._currentIndex - 1;
                  var multiplier = 1;
                  while (scanIntPartIndex >= startIntPartIndex) {
                    integer += multiplier * (this._string.charAt(scanIntPartIndex--) - '0');
                    multiplier *= 10;
                  }
                }

                // Read the decimals.
                if (this._currentIndex < this._endIndex && this._string.charAt(this._currentIndex) === '.') {
                  this._currentIndex++;

                  // There must be a least one digit following the .
                  if (this._currentIndex >= this._endIndex || this._string.charAt(this._currentIndex) < '0' || this._string.charAt(this._currentIndex) > '9') {
                    return undefined;
                  }
                  while (this._currentIndex < this._endIndex && this._string.charAt(this._currentIndex) >= '0' && this._string.charAt(this._currentIndex) <= '9') {
                    frac *= 10;
                    decimal += (this._string.charAt(this._currentIndex) - '0') / frac;
                    this._currentIndex += 1;
                  }
                }

                // Read the exponent part.
                if (this._currentIndex !== startIndex && this._currentIndex + 1 < this._endIndex && (this._string.charAt(this._currentIndex) === 'e' || this._string.charAt(this._currentIndex) === 'E') && this._string.charAt(this._currentIndex + 1) !== 'x' && this._string.charAt(this._currentIndex + 1) !== 'm') {
                  this._currentIndex++;

                  // Read the sign of the exponent.
                  if (this._string.charAt(this._currentIndex) === '+') {
                    this._currentIndex++;
                  } else if (this._string.charAt(this._currentIndex) === '-') {
                    this._currentIndex++;
                    expsign = -1;
                  }

                  // There must be an exponent.
                  if (this._currentIndex >= this._endIndex || this._string.charAt(this._currentIndex) < '0' || this._string.charAt(this._currentIndex) > '9') {
                    return undefined;
                  }

                  while (this._currentIndex < this._endIndex && this._string.charAt(this._currentIndex) >= '0' && this._string.charAt(this._currentIndex) <= '9') {
                    exponent *= 10;
                    exponent += this._string.charAt(this._currentIndex) - '0';
                    this._currentIndex++;
                  }
                }

                var number = integer + decimal;
                number *= sign;

                if (exponent) {
                  number *= Math.pow(10, expsign * exponent);
                }

                if (startIndex === this._currentIndex) {
                  return undefined;
                }

                this._skipOptionalSpacesOrDelimiter();

                return number;
              }
            }, {
              key: '_parseArcFlag',
              value: function _parseArcFlag() {
                if (this._currentIndex >= this._endIndex) {
                  return undefined;
                }
                var flag = false;
                var flagChar = this._string.charAt(this._currentIndex++);
                if (flagChar === '0') {
                  flag = false;
                } else if (flagChar === '1') {
                  flag = true;
                } else {
                  return undefined;
                }

                this._skipOptionalSpacesOrDelimiter();
                return flag;
              }
            }, {
              key: 'parseSegment',
              value: function parseSegment() {
                var lookahead = this._string[this._currentIndex];
                var command = this._pathSegTypeFromChar(lookahead);
                if (command === SVGPathSeg.PATHSEG_UNKNOWN) {
                  // Possibly an implicit command. Not allowed if this is the first command.
                  if (this._previousCommand === SVGPathSeg.PATHSEG_UNKNOWN) {
                    return null;
                  }
                  command = this._nextCommandHelper(lookahead, this._previousCommand);
                  if (command === SVGPathSeg.PATHSEG_UNKNOWN) {
                    return null;
                  }
                } else {
                  this._currentIndex++;
                }

                this._previousCommand = command;

                switch (command) {
                  case SVGPathSeg.PATHSEG_MOVETO_REL:
                    return new SVGPathSegMovetoRel(owningPathSegList, this._parseNumber(), this._parseNumber());
                  case SVGPathSeg.PATHSEG_MOVETO_ABS:
                    return new SVGPathSegMovetoAbs(owningPathSegList, this._parseNumber(), this._parseNumber());
                  case SVGPathSeg.PATHSEG_LINETO_REL:
                    return new SVGPathSegLinetoRel(owningPathSegList, this._parseNumber(), this._parseNumber());
                  case SVGPathSeg.PATHSEG_LINETO_ABS:
                    return new SVGPathSegLinetoAbs(owningPathSegList, this._parseNumber(), this._parseNumber());
                  case SVGPathSeg.PATHSEG_LINETO_HORIZONTAL_REL:
                    return new SVGPathSegLinetoHorizontalRel(owningPathSegList, this._parseNumber());
                  case SVGPathSeg.PATHSEG_LINETO_HORIZONTAL_ABS:
                    return new SVGPathSegLinetoHorizontalAbs(owningPathSegList, this._parseNumber());
                  case SVGPathSeg.PATHSEG_LINETO_VERTICAL_REL:
                    return new SVGPathSegLinetoVerticalRel(owningPathSegList, this._parseNumber());
                  case SVGPathSeg.PATHSEG_LINETO_VERTICAL_ABS:
                    return new SVGPathSegLinetoVerticalAbs(owningPathSegList, this._parseNumber());
                  case SVGPathSeg.PATHSEG_CLOSEPATH:
                    this._skipOptionalSpaces();
                    return new SVGPathSegClosePath(owningPathSegList);
                  case SVGPathSeg.PATHSEG_CURVETO_CUBIC_REL:
                    {
                      var _points = { x1: this._parseNumber(), y1: this._parseNumber(), x2: this._parseNumber(), y2: this._parseNumber(), x: this._parseNumber(), y: this._parseNumber() };
                      return new SVGPathSegCurvetoCubicRel(owningPathSegList, _points.x, _points.y, _points.x1, _points.y1, _points.x2, _points.y2);
                    }case SVGPathSeg.PATHSEG_CURVETO_CUBIC_ABS:
                    {
                      var _points2 = { x1: this._parseNumber(), y1: this._parseNumber(), x2: this._parseNumber(), y2: this._parseNumber(), x: this._parseNumber(), y: this._parseNumber() };
                      return new SVGPathSegCurvetoCubicAbs(owningPathSegList, _points2.x, _points2.y, _points2.x1, _points2.y1, _points2.x2, _points2.y2);
                    }case SVGPathSeg.PATHSEG_CURVETO_CUBIC_SMOOTH_REL:
                    {
                      var _points3 = { x2: this._parseNumber(), y2: this._parseNumber(), x: this._parseNumber(), y: this._parseNumber() };
                      return new SVGPathSegCurvetoCubicSmoothRel(owningPathSegList, _points3.x, _points3.y, _points3.x2, _points3.y2);
                    }case SVGPathSeg.PATHSEG_CURVETO_CUBIC_SMOOTH_ABS:
                    {
                      var _points4 = { x2: this._parseNumber(), y2: this._parseNumber(), x: this._parseNumber(), y: this._parseNumber() };
                      return new SVGPathSegCurvetoCubicSmoothAbs(owningPathSegList, _points4.x, _points4.y, _points4.x2, _points4.y2);
                    }case SVGPathSeg.PATHSEG_CURVETO_QUADRATIC_REL:
                    {
                      var _points5 = { x1: this._parseNumber(), y1: this._parseNumber(), x: this._parseNumber(), y: this._parseNumber() };
                      return new SVGPathSegCurvetoQuadraticRel(owningPathSegList, _points5.x, _points5.y, _points5.x1, _points5.y1);
                    }case SVGPathSeg.PATHSEG_CURVETO_QUADRATIC_ABS:
                    var points = { x1: this._parseNumber(), y1: this._parseNumber(), x: this._parseNumber(), y: this._parseNumber() };
                    return new SVGPathSegCurvetoQuadraticAbs(owningPathSegList, points.x, points.y, points.x1, points.y1);
                  case SVGPathSeg.PATHSEG_CURVETO_QUADRATIC_SMOOTH_REL:
                    return new SVGPathSegCurvetoQuadraticSmoothRel(owningPathSegList, this._parseNumber(), this._parseNumber());
                  case SVGPathSeg.PATHSEG_CURVETO_QUADRATIC_SMOOTH_ABS:
                    return new SVGPathSegCurvetoQuadraticSmoothAbs(owningPathSegList, this._parseNumber(), this._parseNumber());
                  case SVGPathSeg.PATHSEG_ARC_REL:
                    {
                      var _points6 = { x1: this._parseNumber(), y1: this._parseNumber(), arcAngle: this._parseNumber(), arcLarge: this._parseArcFlag(), arcSweep: this._parseArcFlag(), x: this._parseNumber(), y: this._parseNumber() };
                      return new SVGPathSegArcRel(owningPathSegList, _points6.x, _points6.y, _points6.x1, _points6.y1, _points6.arcAngle, _points6.arcLarge, _points6.arcSweep);
                    }case SVGPathSeg.PATHSEG_ARC_ABS:
                    {
                      var _points7 = { x1: this._parseNumber(), y1: this._parseNumber(), arcAngle: this._parseNumber(), arcLarge: this._parseArcFlag(), arcSweep: this._parseArcFlag(), x: this._parseNumber(), y: this._parseNumber() };
                      return new SVGPathSegArcAbs(owningPathSegList, _points7.x, _points7.y, _points7.x1, _points7.y1, _points7.arcAngle, _points7.arcLarge, _points7.arcSweep);
                    }default:
                    throw new Error('Unknown path seg type.');
                }
              }
            }]);
            return Source;
          }();

          var builder = new Builder();
          var source = new Source(string);

          if (!source.initialCommandIsMoveTo()) {
            return [];
          }
          while (source.hasMoreData()) {
            var pathSeg = source.parseSegment();
            if (!pathSeg) {
              return [];
            }
            builder.appendSegment(pathSeg);
          }

          return builder.pathSegList;
        }
      }]);
      return _SVGPathSegList;
    }();

    _SVGPathSegList.prototype.classname = 'SVGPathSegList';

    Object.defineProperty(_SVGPathSegList.prototype, 'numberOfItems', {
      get: function get$$1() {
        this._checkPathSynchronizedToList();
        return this._list.length;
      },

      enumerable: true
    });

    _SVGPathSegList._pathSegArrayAsString = function (pathSegArray) {
      var string = '';
      var first = true;
      pathSegArray.forEach(function (pathSeg) {
        if (first) {
          first = false;
          string += pathSeg._asPathString();
        } else {
          string += ' ' + pathSeg._asPathString();
        }
      });
      return string;
    };

    // Add the pathSegList accessors to SVGPathElement.
    // Spec: https://www.w3.org/TR/SVG11/single-page.html#paths-InterfaceSVGAnimatedPathData
    Object.defineProperties(SVGPathElement.prototype, {
      pathSegList: {
        get: function get$$1() {
          if (!this._pathSegList) {
            this._pathSegList = new _SVGPathSegList(this);
          }
          return this._pathSegList;
        },

        enumerable: true
      },
      // FIXME: The following are not implemented and simply return SVGPathElement.pathSegList.
      normalizedPathSegList: {
        get: function get$$1() {
          return this.pathSegList;
        },
        enumerable: true },
      animatedPathSegList: {
        get: function get$$1() {
          return this.pathSegList;
        },
        enumerable: true },
      animatedNormalizedPathSegList: {
        get: function get$$1() {
          return this.pathSegList;
        },
        enumerable: true }
    });
    window.SVGPathSegList = _SVGPathSegList;
  }
})();

/* globals jQuery */

var $ = jQuery;

var supportsSvg_ = function () {
  return !!document.createElementNS && !!document.createElementNS(NS.SVG, 'svg').createSVGRect;
}();

var _navigator = navigator,
    userAgent = _navigator.userAgent;

var svg = document.createElementNS(NS.SVG, 'svg');

// Note: Browser sniffing should only be used if no other detection method is possible
var isOpera_ = !!window.opera;
var isWebkit_ = userAgent.includes('AppleWebKit');
var isGecko_ = userAgent.includes('Gecko/');
var isIE_ = userAgent.includes('MSIE');
var isChrome_ = userAgent.includes('Chrome/');
var isWindows_ = userAgent.includes('Windows');
var isMac_ = userAgent.includes('Macintosh');
var isTouch_ = 'ontouchstart' in window;

var supportsSelectors_ = function () {
  return !!svg.querySelector;
}();

var supportsXpath_ = function () {
  return !!document.evaluate;
}();

// segList functions (for FF1.5 and 2.0)
var supportsPathReplaceItem_ = function () {
  var path = document.createElementNS(NS.SVG, 'path');
  path.setAttribute('d', 'M0,0 10,10');
  var seglist = path.pathSegList;
  var seg = path.createSVGPathSegLinetoAbs(5, 5);
  try {
    seglist.replaceItem(seg, 1);
    return true;
  } catch (err) {}
  return false;
}();

var supportsPathInsertItemBefore_ = function () {
  var path = document.createElementNS(NS.SVG, 'path');
  path.setAttribute('d', 'M0,0 10,10');
  var seglist = path.pathSegList;
  var seg = path.createSVGPathSegLinetoAbs(5, 5);
  try {
    seglist.insertItemBefore(seg, 1);
    return true;
  } catch (err) {}
  return false;
}();

// text character positioning (for IE9)
var supportsGoodTextCharPos_ = function () {
  var svgroot = document.createElementNS(NS.SVG, 'svg');
  var svgcontent = document.createElementNS(NS.SVG, 'svg');
  document.documentElement.append(svgroot);
  svgcontent.setAttribute('x', 5);
  svgroot.append(svgcontent);
  var text = document.createElementNS(NS.SVG, 'text');
  text.textContent = 'a';
  svgcontent.append(text);
  var pos = text.getStartPositionOfChar(0).x;
  svgroot.remove();
  return pos === 0;
}();

var supportsPathBBox_ = function () {
  var svgcontent = document.createElementNS(NS.SVG, 'svg');
  document.documentElement.append(svgcontent);
  var path = document.createElementNS(NS.SVG, 'path');
  path.setAttribute('d', 'M0,0 C0,0 10,10 10,0');
  svgcontent.append(path);
  var bbox = path.getBBox();
  svgcontent.remove();
  return bbox.height > 4 && bbox.height < 5;
}();

// Support for correct bbox sizing on groups with horizontal/vertical lines
var supportsHVLineContainerBBox_ = function () {
  var svgcontent = document.createElementNS(NS.SVG, 'svg');
  document.documentElement.append(svgcontent);
  var path = document.createElementNS(NS.SVG, 'path');
  path.setAttribute('d', 'M0,0 10,0');
  var path2 = document.createElementNS(NS.SVG, 'path');
  path2.setAttribute('d', 'M5,0 15,0');
  var g = document.createElementNS(NS.SVG, 'g');
  g.append(path, path2);
  svgcontent.append(g);
  var bbox = g.getBBox();
  svgcontent.remove();
  // Webkit gives 0, FF gives 10, Opera (correctly) gives 15
  return bbox.width === 15;
}();

var supportsGoodDecimals_ = function () {
  // Correct decimals on clone attributes (Opera < 10.5/win/non-en)
  var rect = document.createElementNS(NS.SVG, 'rect');
  rect.setAttribute('x', 0.1);
  var crect = rect.cloneNode(false);
  var retValue = !crect.getAttribute('x').includes(',');
  if (!retValue) {
    // Todo: i18nize or remove
    $.alert('NOTE: This version of Opera is known to contain bugs in SVG-edit.\n' + 'Please upgrade to the <a href="http://opera.com">latest version</a> in which the problems have been fixed.');
  }
  return retValue;
}();

var supportsNonScalingStroke_ = function () {
  var rect = document.createElementNS(NS.SVG, 'rect');
  rect.setAttribute('style', 'vector-effect:non-scaling-stroke');
  return rect.style.vectorEffect === 'non-scaling-stroke';
}();

var supportsNativeSVGTransformLists_ = function () {
  var rect = document.createElementNS(NS.SVG, 'rect');
  var rxform = rect.transform.baseVal;
  var t1 = svg.createSVGTransform();
  rxform.appendItem(t1);
  var r1 = rxform.getItem(0);
  // Todo: Do frame-independent instance checking
  return r1 instanceof SVGTransform && t1 instanceof SVGTransform && r1.type === t1.type && r1.angle === t1.angle && r1.matrix.a === t1.matrix.a && r1.matrix.b === t1.matrix.b && r1.matrix.c === t1.matrix.c && r1.matrix.d === t1.matrix.d && r1.matrix.e === t1.matrix.e && r1.matrix.f === t1.matrix.f;
}();

// Public API

var isOpera = function isOpera() {
  return isOpera_;
};
var isWebkit = function isWebkit() {
  return isWebkit_;
};
var isGecko = function isGecko() {
  return isGecko_;
};
var isIE = function isIE() {
  return isIE_;
};
var isChrome = function isChrome() {
  return isChrome_;
};
var isMac = function isMac() {
  return isMac_;
};
var isTouch = function isTouch() {
  return isTouch_;
};

var supportsSelectors = function supportsSelectors() {
  return supportsSelectors_;
};
var supportsXpath = function supportsXpath() {
  return supportsXpath_;
};

var supportsPathReplaceItem = function supportsPathReplaceItem() {
  return supportsPathReplaceItem_;
};
var supportsPathInsertItemBefore = function supportsPathInsertItemBefore() {
  return supportsPathInsertItemBefore_;
};
var supportsPathBBox = function supportsPathBBox() {
  return supportsPathBBox_;
};
var supportsHVLineContainerBBox = function supportsHVLineContainerBBox() {
  return supportsHVLineContainerBBox_;
};
var supportsGoodTextCharPos = function supportsGoodTextCharPos() {
  return supportsGoodTextCharPos_;
};
var supportsNonScalingStroke = function supportsNonScalingStroke() {
  return supportsNonScalingStroke_;
};
var supportsNativeTransformLists = function supportsNativeTransformLists() {
  return supportsNativeSVGTransformLists_;
};

/**
 * jQuery module to work with SVG.
 *
 * Licensed under the MIT License
 *
 */

// This fixes $(...).attr() to work as expected with SVG elements.
// Does not currently use *AttributeNS() since we rarely need that.

// See https://api.jquery.com/attr/ for basic documentation of .attr()

// Additional functionality:
// - When getting attributes, a string that's a number is returned as type number.
// - If an array is supplied as the first parameter, multiple values are returned
//    as an object with values for each given attribute

function jqPluginSVG ($) {
  var proxied = $.fn.attr,
      svgns = 'http://www.w3.org/2000/svg';
  $.fn.attr = function (key, value) {
    var len = this.length;
    if (!len) {
      return proxied.apply(this, arguments);
    }
    for (var i = 0; i < len; ++i) {
      var elem = this[i];
      // set/get SVG attribute
      if (elem.namespaceURI === svgns) {
        // Setting attribute
        if (value !== undefined) {
          elem.setAttribute(key, value);
        } else if (Array.isArray(key)) {
          // Getting attributes from array
          var obj = {};
          var j = key.length;

          while (j--) {
            var aname = key[j];
            var attr = elem.getAttribute(aname);
            // This returns a number when appropriate
            if (attr || attr === '0') {
              attr = isNaN(attr) ? attr : attr - 0;
            }
            obj[aname] = attr;
          }
          return obj;
        }
        if ((typeof key === 'undefined' ? 'undefined' : _typeof(key)) === 'object') {
          // Setting attributes from object
          for (var v in key) {
            elem.setAttribute(v, key[v]);
          }
          // Getting attribute
        } else {
          var _attr = elem.getAttribute(key);
          if (_attr || _attr === '0') {
            _attr = isNaN(_attr) ? _attr : _attr - 0;
          }
          return _attr;
        }
      } else {
        return proxied.apply(this, arguments);
      }
    }
    return this;
  };
  return $;
}

/**
 * SVGTransformList
 *
 * Licensed under the MIT License
 *
 * Copyright(c) 2010 Alexis Deveria
 * Copyright(c) 2010 Jeff Schiller
 */

var svgroot = document.createElementNS(NS.SVG, 'svg');

// Helper function.
function transformToString(xform) {
  var m = xform.matrix;
  var text = '';
  switch (xform.type) {
    case 1:
      // MATRIX
      text = 'matrix(' + [m.a, m.b, m.c, m.d, m.e, m.f].join(',') + ')';
      break;
    case 2:
      // TRANSLATE
      text = 'translate(' + m.e + ',' + m.f + ')';
      break;
    case 3:
      // SCALE
      if (m.a === m.d) {
        text = 'scale(' + m.a + ')';
      } else {
        text = 'scale(' + m.a + ',' + m.d + ')';
      }
      break;
    case 4:
      {
        // ROTATE
        var cx = 0;
        var cy = 0;
        // this prevents divide by zero
        if (xform.angle !== 0) {
          var K = 1 - m.a;
          cy = (K * m.f + m.b * m.e) / (K * K + m.b * m.b);
          cx = (m.e - m.b * cy) / K;
        }
        text = 'rotate(' + xform.angle + ' ' + cx + ',' + cy + ')';
        break;
      }
  }
  return text;
}

/**
 * Map of SVGTransformList objects.
 */
var listMap_ = {};

// **************************************************************************************
// SVGTransformList implementation for Webkit
// These methods do not currently raise any exceptions.
// These methods also do not check that transforms are being inserted.  This is basically
// implementing as much of SVGTransformList that we need to get the job done.
//
//  interface SVGEditTransformList {
//    attribute unsigned long numberOfItems;
//    void   clear (  )
//    SVGTransform initialize ( in SVGTransform newItem )
//    SVGTransform getItem ( in unsigned long index ) (DOES NOT THROW DOMException, INDEX_SIZE_ERR)
//    SVGTransform insertItemBefore ( in SVGTransform newItem, in unsigned long index ) (DOES NOT THROW DOMException, INDEX_SIZE_ERR)
//    SVGTransform replaceItem ( in SVGTransform newItem, in unsigned long index ) (DOES NOT THROW DOMException, INDEX_SIZE_ERR)
//    SVGTransform removeItem ( in unsigned long index ) (DOES NOT THROW DOMException, INDEX_SIZE_ERR)
//    SVGTransform appendItem ( in SVGTransform newItem )
//    NOT IMPLEMENTED: SVGTransform createSVGTransformFromMatrix ( in SVGMatrix matrix );
//    NOT IMPLEMENTED: SVGTransform consolidate (  );
//  }
// **************************************************************************************
var SVGTransformList = function SVGTransformList(elem) {
  classCallCheck(this, SVGTransformList);

  this._elem = elem || null;
  this._xforms = [];
  // TODO: how do we capture the undo-ability in the changed transform list?
  this._update = function () {
    var tstr = '';
    /* const concatMatrix = */svgroot.createSVGMatrix();
    for (var i = 0; i < this.numberOfItems; ++i) {
      var xform = this._list.getItem(i);
      tstr += transformToString(xform) + ' ';
    }
    this._elem.setAttribute('transform', tstr);
  };
  this._list = this;
  this._init = function () {
    var _this = this;

    // Transform attribute parser
    var str = this._elem.getAttribute('transform');
    if (!str) {
      return;
    }

    // TODO: Add skew support in future
    var re = /\s*((scale|matrix|rotate|translate)\s*\(.*?\))\s*,?\s*/;
    var m = true;
    while (m) {
      m = str.match(re);
      str = str.replace(re, '');
      if (m && m[1]) {
        (function () {
          var x = m[1];
          var bits = x.split(/\s*\(/);
          var name = bits[0];
          var valBits = bits[1].match(/\s*(.*?)\s*\)/);
          valBits[1] = valBits[1].replace(/(\d)-/g, '$1 -');
          var valArr = valBits[1].split(/[, ]+/);
          var letters = 'abcdef'.split('');
          var mtx = svgroot.createSVGMatrix();
          Object.values(valArr).forEach(function (item, i) {
            valArr[i] = parseFloat(item);
            if (name === 'matrix') {
              mtx[letters[i]] = valArr[i];
            }
          });
          var xform = svgroot.createSVGTransform();
          var fname = 'set' + name.charAt(0).toUpperCase() + name.slice(1);
          var values = name === 'matrix' ? [mtx] : valArr;

          if (name === 'scale' && values.length === 1) {
            values.push(values[0]);
          } else if (name === 'translate' && values.length === 1) {
            values.push(0);
          } else if (name === 'rotate' && values.length === 1) {
            values.push(0, 0);
          }
          xform[fname].apply(xform, values);
          _this._list.appendItem(xform);
        })();
      }
    }
  };
  this._removeFromOtherLists = function (item) {
    if (item) {
      // Check if this transform is already in a transformlist, and
      // remove it if so.
      var found = false;
      for (var id in listMap_) {
        var tl = listMap_[id];
        for (var i = 0, len = tl._xforms.length; i < len; ++i) {
          if (tl._xforms[i] === item) {
            found = true;
            tl.removeItem(i);
            break;
          }
        }
        if (found) {
          break;
        }
      }
    }
  };

  this.numberOfItems = 0;
  this.clear = function () {
    this.numberOfItems = 0;
    this._xforms = [];
  };

  this.initialize = function (newItem) {
    this.numberOfItems = 1;
    this._removeFromOtherLists(newItem);
    this._xforms = [newItem];
  };

  this.getItem = function (index) {
    if (index < this.numberOfItems && index >= 0) {
      return this._xforms[index];
    }
    var err = new Error('DOMException with code=INDEX_SIZE_ERR');
    err.code = 1;
    throw err;
  };

  this.insertItemBefore = function (newItem, index) {
    var retValue = null;
    if (index >= 0) {
      if (index < this.numberOfItems) {
        this._removeFromOtherLists(newItem);
        var newxforms = new Array(this.numberOfItems + 1);
        // TODO: use array copying and slicing
        var i = void 0;
        for (i = 0; i < index; ++i) {
          newxforms[i] = this._xforms[i];
        }
        newxforms[i] = newItem;
        for (var j = i + 1; i < this.numberOfItems; ++j, ++i) {
          newxforms[j] = this._xforms[i];
        }
        this.numberOfItems++;
        this._xforms = newxforms;
        retValue = newItem;
        this._list._update();
      } else {
        retValue = this._list.appendItem(newItem);
      }
    }
    return retValue;
  };

  this.replaceItem = function (newItem, index) {
    var retValue = null;
    if (index < this.numberOfItems && index >= 0) {
      this._removeFromOtherLists(newItem);
      this._xforms[index] = newItem;
      retValue = newItem;
      this._list._update();
    }
    return retValue;
  };

  this.removeItem = function (index) {
    if (index < this.numberOfItems && index >= 0) {
      var retValue = this._xforms[index];
      var newxforms = new Array(this.numberOfItems - 1);
      var i = void 0;
      for (i = 0; i < index; ++i) {
        newxforms[i] = this._xforms[i];
      }
      for (var j = i; j < this.numberOfItems - 1; ++j, ++i) {
        newxforms[j] = this._xforms[i + 1];
      }
      this.numberOfItems--;
      this._xforms = newxforms;
      this._list._update();
      return retValue;
    }
    var err = new Error('DOMException with code=INDEX_SIZE_ERR');
    err.code = 1;
    throw err;
  };

  this.appendItem = function (newItem) {
    this._removeFromOtherLists(newItem);
    this._xforms.push(newItem);
    this.numberOfItems++;
    this._list._update();
    return newItem;
  };
};

var resetListMap = function resetListMap() {
  listMap_ = {};
};

/**
 * Removes transforms of the given element from the map.
 * Parameters:
 * elem - a DOM Element
 */
var removeElementFromListMap = function removeElementFromListMap(elem) {
  if (elem.id && listMap_[elem.id]) {
    delete listMap_[elem.id];
  }
};

/**
* Returns an object that behaves like a SVGTransformList for the given DOM element
* @param elem - DOM element to get a transformlist from
*/
var getTransformList = function getTransformList(elem) {
  if (!supportsNativeTransformLists()) {
    var id = elem.id || 'temp';
    var t = listMap_[id];
    if (!t || id === 'temp') {
      listMap_[id] = new SVGTransformList(elem);
      listMap_[id]._init();
      t = listMap_[id];
    }
    return t;
  }
  if (elem.transform) {
    return elem.transform.baseVal;
  }
  if (elem.gradientTransform) {
    return elem.gradientTransform.baseVal;
  }
  if (elem.patternTransform) {
    return elem.patternTransform.baseVal;
  }

  return null;
};

/**
 * Package: svgedit.units
 *
 * Licensed under the MIT License
 *
 * Copyright(c) 2010 Alexis Deveria
 * Copyright(c) 2010 Jeff Schiller
 */

var wAttrs = ['x', 'x1', 'cx', 'rx', 'width'];
var hAttrs = ['y', 'y1', 'cy', 'ry', 'height'];
var unitAttrs = ['r', 'radius'].concat(wAttrs, hAttrs);
// unused
/*
const unitNumMap = {
  '%': 2,
  em: 3,
  ex: 4,
  px: 5,
  cm: 6,
  mm: 7,
  in: 8,
  pt: 9,
  pc: 10
};
*/
// Container of elements.
var elementContainer_ = void 0;

/**
 * Stores mapping of unit type to user coordinates.
 */
var typeMap_ = {};

/**
 * ElementContainer interface
 *
 * function getBaseUnit() - Returns a string of the base unit type of the container ('em')
 * function getElement() - Returns an element in the container given an id
 * function getHeight() - Returns the container's height
 * function getWidth() - Returns the container's width
 * function getRoundDigits() - Returns the number of digits number should be rounded to
 */

/**
 * Initializes this module.
 *
 * @param elementContainer - An object implementing the ElementContainer interface.
 */
var init = function init(elementContainer) {
  elementContainer_ = elementContainer;

  // Get correct em/ex values by creating a temporary SVG.
  var svg = document.createElementNS(NS.SVG, 'svg');
  document.body.append(svg);
  var rect = document.createElementNS(NS.SVG, 'rect');
  rect.setAttribute('width', '1em');
  rect.setAttribute('height', '1ex');
  rect.setAttribute('x', '1in');
  svg.append(rect);
  var bb = rect.getBBox();
  svg.remove();

  var inch = bb.x;
  typeMap_ = {
    em: bb.width,
    ex: bb.height,
    in: inch,
    cm: inch / 2.54,
    mm: inch / 25.4,
    pt: inch / 72,
    pc: inch / 6,
    px: 1,
    '%': 0
  };
};

/**
* Group: Unit conversion functions
*/

/**
* @returns The unit object with values for each unit
*/
var getTypeMap = function getTypeMap() {
  return typeMap_;
};

/**
* Rounds a given value to a float with number of digits defined in save_options
*
* @param val - The value as a String, Number or Array of two numbers to be rounded
*
* @returns
* If a string/number was given, returns a Float. If an array, return a string
* with comma-separated floats
*/
var shortFloat = function shortFloat(val) {
  var digits = elementContainer_.getRoundDigits();
  if (!isNaN(val)) {
    // Note that + converts to Number
    return +(+val).toFixed(digits);
  }
  if (Array.isArray(val)) {
    return shortFloat(val[0]) + ',' + shortFloat(val[1]);
  }
  return parseFloat(val).toFixed(digits) - 0;
};

/**
* Converts the number to given unit or baseUnit
* @returns {number}
*/
var convertUnit = function convertUnit(val, unit) {
  unit = unit || elementContainer_.getBaseUnit();
  // baseVal.convertToSpecifiedUnits(unitNumMap[unit]);
  // const val = baseVal.valueInSpecifiedUnits;
  // baseVal.convertToSpecifiedUnits(1);
  return shortFloat(val / typeMap_[unit]);
};

/**
* Sets an element's attribute based on the unit in its current value.
*
* @param elem - DOM element to be changed
* @param attr - String with the name of the attribute associated with the value
* @param val - String with the attribute value to convert
*/
var setUnitAttr = function setUnitAttr(elem, attr, val) {
  //  if (!isNaN(val)) {
  // New value is a number, so check currently used unit
  // const oldVal = elem.getAttribute(attr);

  // Enable this for alternate mode
  // if (oldVal !== null && (isNaN(oldVal) || elementContainer_.getBaseUnit() !== 'px')) {
  //   // Old value was a number, so get unit, then convert
  //   let unit;
  //   if (oldVal.substr(-1) === '%') {
  //     const res = getResolution();
  //     unit = '%';
  //     val *= 100;
  //     if (wAttrs.includes(attr)) {
  //       val = val / res.w;
  //     } else if (hAttrs.includes(attr)) {
  //       val = val / res.h;
  //     } else {
  //       return val / Math.sqrt((res.w*res.w) + (res.h*res.h))/Math.sqrt(2);
  //     }
  //   } else {
  //     if (elementContainer_.getBaseUnit() !== 'px') {
  //       unit = elementContainer_.getBaseUnit();
  //     } else {
  //       unit = oldVal.substr(-2);
  //     }
  //     val = val / typeMap_[unit];
  //   }
  //
  // val += unit;
  // }
  // }
  elem.setAttribute(attr, val);
};

/**
* Converts given values to numbers. Attributes must be supplied in
* case a percentage is given
*
* @param attr - String with the name of the attribute associated with the value
* @param val - String with the attribute value to convert
*/
var convertToNum = function convertToNum(attr, val) {
  // Return a number if that's what it already is
  if (!isNaN(val)) {
    return val - 0;
  }
  if (val.substr(-1) === '%') {
    // Deal with percentage, depends on attribute
    var _num = val.substr(0, val.length - 1) / 100;
    var width = elementContainer_.getWidth();
    var height = elementContainer_.getHeight();

    if (wAttrs.includes(attr)) {
      return _num * width;
    }
    if (hAttrs.includes(attr)) {
      return _num * height;
    }
    return _num * Math.sqrt(width * width + height * height) / Math.sqrt(2);
  }
  var unit = val.substr(-2);
  var num = val.substr(0, val.length - 2);
  // Note that this multiplication turns the string into a number
  return num * typeMap_[unit];
};

/**
* Check if an attribute's value is in a valid format
* @param attr - String with the name of the attribute associated with the value
* @param val - String with the attribute value to check
*/
var isValidUnit = function isValidUnit(attr, val, selectedElement) {
  if (unitAttrs.includes(attr)) {
    // True if it's just a number
    if (!isNaN(val)) {
      return true;
    }
    // Not a number, check if it has a valid unit
    val = val.toLowerCase();
    return Object.keys(typeMap_).some(function (unit) {
      var re = new RegExp('^-?[\\d\\.]+' + unit + '$');
      return re.test(val);
    });
  }
  if (attr === 'id') {
    // if we're trying to change the id, make sure it's not already present in the doc
    // and the id value is valid.

    var result = false;
    // because getElem() can throw an exception in the case of an invalid id
    // (according to https://www.w3.org/TR/xml-id/ IDs must be a NCName)
    // we wrap it in an exception and only return true if the ID was valid and
    // not already present
    try {
      var elem = elementContainer_.getElement(val);
      result = elem == null || elem === selectedElement;
    } catch (e) {}
    return result;
  }
  return true;
};

/**
 * Package: svedit.history
 *
 * Licensed under the MIT License
 *
 * Copyright(c) 2010 Jeff Schiller
 */

/**
* Group: Undo/Redo history management
*/
var HistoryEventTypes = {
  BEFORE_APPLY: 'before_apply',
  AFTER_APPLY: 'after_apply',
  BEFORE_UNAPPLY: 'before_unapply',
  AFTER_UNAPPLY: 'after_unapply'
};

// const removedElements = {};

/**
 * An interface that all command objects must implement.
 * @typedef {Object} svgedit.history.HistoryCommand
 *   void apply(svgedit.history.HistoryEventHandler);
 *   void unapply(svgedit.history.HistoryEventHandler);
 *   Element[] elements();
 *   String getText();
 *
 *   static String type();
 * }
 *
 * Interface: svgedit.history.HistoryEventHandler
 * An interface for objects that will handle history events.
 *
 * interface svgedit.history.HistoryEventHandler {
 *   void handleHistoryEvent(eventType, command);
 * }
 *
 * eventType is a string conforming to one of the HistoryEvent types.
 * command is an object fulfilling the HistoryCommand interface.
 */

/**
 * @class svgedit.history.MoveElementCommand
 * @implements svgedit.history.HistoryCommand
 * History command for an element that had its DOM position changed
 * @param {Element} elem - The DOM element that was moved
 * @param {Element} oldNextSibling - The element's next sibling before it was moved
 * @param {Element} oldParent - The element's parent before it was moved
 * @param {string} [text] - An optional string visible to user related to this change
*/
var MoveElementCommand = function () {
  function MoveElementCommand(elem, oldNextSibling, oldParent, text) {
    classCallCheck(this, MoveElementCommand);

    this.elem = elem;
    this.text = text ? 'Move ' + elem.tagName + ' to ' + text : 'Move ' + elem.tagName;
    this.oldNextSibling = oldNextSibling;
    this.oldParent = oldParent;
    this.newNextSibling = elem.nextSibling;
    this.newParent = elem.parentNode;
  }

  createClass(MoveElementCommand, [{
    key: 'getText',
    value: function getText() {
      return this.text;
    }
  }, {
    key: 'type',
    value: function type() {
      return 'svgedit.history.MoveElementCommand';
    }

    /**
     * Re-positions the element
     * @param {{handleHistoryEvent: function}} handler
    */

  }, {
    key: 'apply',
    value: function apply(handler) {
      // TODO(codedread): Refactor this common event code into a base HistoryCommand class.
      if (handler) {
        handler.handleHistoryEvent(HistoryEventTypes.BEFORE_APPLY, this);
      }

      this.elem = this.newParent.insertBefore(this.elem, this.newNextSibling);

      if (handler) {
        handler.handleHistoryEvent(HistoryEventTypes.AFTER_APPLY, this);
      }
    }

    /**
     * Positions the element back to its original location
     * @param {{handleHistoryEvent: function}} handler
    */

  }, {
    key: 'unapply',
    value: function unapply(handler) {
      if (handler) {
        handler.handleHistoryEvent(HistoryEventTypes.BEFORE_UNAPPLY, this);
      }

      this.elem = this.oldParent.insertBefore(this.elem, this.oldNextSibling);

      if (handler) {
        handler.handleHistoryEvent(HistoryEventTypes.AFTER_UNAPPLY, this);
      }
    }

    /**
    * @returns {Array} Array with element associated with this command
    */

  }, {
    key: 'elements',
    value: function elements() {
      return [this.elem];
    }
  }]);
  return MoveElementCommand;
}();
MoveElementCommand.type = MoveElementCommand.prototype.type;

/**
* @implements svgedit.history.HistoryCommand
* History command for an element that was added to the DOM
*
* @param elem - The newly added DOM element
* @param text - An optional string visible to user related to this change
*/
var InsertElementCommand = function () {
  function InsertElementCommand(elem, text) {
    classCallCheck(this, InsertElementCommand);

    this.elem = elem;
    this.text = text || 'Create ' + elem.tagName;
    this.parent = elem.parentNode;
    this.nextSibling = this.elem.nextSibling;
  }

  createClass(InsertElementCommand, [{
    key: 'type',
    value: function type() {
      return 'svgedit.history.InsertElementCommand';
    }
  }, {
    key: 'getText',
    value: function getText() {
      return this.text;
    }

    // Re-Inserts the new element

  }, {
    key: 'apply',
    value: function apply(handler) {
      if (handler) {
        handler.handleHistoryEvent(HistoryEventTypes.BEFORE_APPLY, this);
      }

      this.elem = this.parent.insertBefore(this.elem, this.nextSibling);

      if (handler) {
        handler.handleHistoryEvent(HistoryEventTypes.AFTER_APPLY, this);
      }
    }

    // Removes the element

  }, {
    key: 'unapply',
    value: function unapply(handler) {
      if (handler) {
        handler.handleHistoryEvent(HistoryEventTypes.BEFORE_UNAPPLY, this);
      }

      this.parent = this.elem.parentNode;
      this.elem = this.elem.parentNode.removeChild(this.elem);

      if (handler) {
        handler.handleHistoryEvent(HistoryEventTypes.AFTER_UNAPPLY, this);
      }
    }

    /**
    * @returns {Array} Array with element associated with this command
    */

  }, {
    key: 'elements',
    value: function elements() {
      return [this.elem];
    }
  }]);
  return InsertElementCommand;
}();
InsertElementCommand.type = InsertElementCommand.prototype.type;

/**
* @implements svgedit.history.HistoryCommand
* History command for an element removed from the DOM
* @param elem - The removed DOM element
* @param oldNextSibling - The DOM element's nextSibling when it was in the DOM
* @param oldParent - The DOM element's parent
* @param {String} [text] - An optional string visible to user related to this change
*/
var RemoveElementCommand = function () {
  function RemoveElementCommand(elem, oldNextSibling, oldParent, text) {
    classCallCheck(this, RemoveElementCommand);

    this.elem = elem;
    this.text = text || 'Delete ' + elem.tagName;
    this.nextSibling = oldNextSibling;
    this.parent = oldParent;

    // special hack for webkit: remove this element's entry in the svgTransformLists map
    removeElementFromListMap(elem);
  }

  createClass(RemoveElementCommand, [{
    key: 'type',
    value: function type() {
      return 'svgedit.history.RemoveElementCommand';
    }
  }, {
    key: 'getText',
    value: function getText() {
      return this.text;
    }

    // Re-removes the new element

  }, {
    key: 'apply',
    value: function apply(handler) {
      if (handler) {
        handler.handleHistoryEvent(HistoryEventTypes.BEFORE_APPLY, this);
      }

      removeElementFromListMap(this.elem);
      this.parent = this.elem.parentNode;
      this.elem = this.parent.removeChild(this.elem);

      if (handler) {
        handler.handleHistoryEvent(HistoryEventTypes.AFTER_APPLY, this);
      }
    }

    // Re-adds the new element

  }, {
    key: 'unapply',
    value: function unapply(handler) {
      if (handler) {
        handler.handleHistoryEvent(HistoryEventTypes.BEFORE_UNAPPLY, this);
      }

      removeElementFromListMap(this.elem);
      if (this.nextSibling == null) {
        if (window.console) {
          console.log('Error: reference element was lost');
        }
      }
      this.parent.insertBefore(this.elem, this.nextSibling); // Don't use `before` or `prepend` as `this.nextSibling` may be `null`

      if (handler) {
        handler.handleHistoryEvent(HistoryEventTypes.AFTER_UNAPPLY, this);
      }
    }

    /**
    * @returns {Array} Array with element associated with this command
    */

  }, {
    key: 'elements',
    value: function elements() {
      return [this.elem];
    }
  }]);
  return RemoveElementCommand;
}();
RemoveElementCommand.type = RemoveElementCommand.prototype.type;

/**
* @implements svgedit.history.HistoryCommand
* History command to make a change to an element.
* Usually an attribute change, but can also be textcontent.
* @param elem - The DOM element that was changed
* @param attrs - An object with the attributes to be changed and the values they had *before* the change
* @param {String} text - An optional string visible to user related to this change
*/
var ChangeElementCommand = function () {
  function ChangeElementCommand(elem, attrs, text) {
    classCallCheck(this, ChangeElementCommand);

    this.elem = elem;
    this.text = text ? 'Change ' + elem.tagName + ' ' + text : 'Change ' + elem.tagName;
    this.newValues = {};
    this.oldValues = attrs;
    for (var attr in attrs) {
      if (attr === '#text') {
        this.newValues[attr] = elem.textContent;
      } else if (attr === '#href') {
        this.newValues[attr] = getHref(elem);
      } else {
        this.newValues[attr] = elem.getAttribute(attr);
      }
    }
  }

  createClass(ChangeElementCommand, [{
    key: 'type',
    value: function type() {
      return 'svgedit.history.ChangeElementCommand';
    }
  }, {
    key: 'getText',
    value: function getText() {
      return this.text;
    }

    // Performs the stored change action

  }, {
    key: 'apply',
    value: function apply(handler) {
      if (handler) {
        handler.handleHistoryEvent(HistoryEventTypes.BEFORE_APPLY, this);
      }

      var bChangedTransform = false;
      for (var attr in this.newValues) {
        if (this.newValues[attr]) {
          if (attr === '#text') {
            this.elem.textContent = this.newValues[attr];
          } else if (attr === '#href') {
            setHref(this.elem, this.newValues[attr]);
          } else {
            this.elem.setAttribute(attr, this.newValues[attr]);
          }
        } else {
          if (attr === '#text') {
            this.elem.textContent = '';
          } else {
            this.elem.setAttribute(attr, '');
            this.elem.removeAttribute(attr);
          }
        }

        if (attr === 'transform') {
          bChangedTransform = true;
        }
      }

      // relocate rotational transform, if necessary
      if (!bChangedTransform) {
        var angle = getRotationAngle(this.elem);
        if (angle) {
          var bbox = this.elem.getBBox();
          var cx = bbox.x + bbox.width / 2,
              cy = bbox.y + bbox.height / 2;
          var rotate = ['rotate(', angle, ' ', cx, ',', cy, ')'].join('');
          if (rotate !== this.elem.getAttribute('transform')) {
            this.elem.setAttribute('transform', rotate);
          }
        }
      }

      if (handler) {
        handler.handleHistoryEvent(HistoryEventTypes.AFTER_APPLY, this);
      }

      return true;
    }

    // Reverses the stored change action

  }, {
    key: 'unapply',
    value: function unapply(handler) {
      if (handler) {
        handler.handleHistoryEvent(HistoryEventTypes.BEFORE_UNAPPLY, this);
      }

      var bChangedTransform = false;
      for (var attr in this.oldValues) {
        if (this.oldValues[attr]) {
          if (attr === '#text') {
            this.elem.textContent = this.oldValues[attr];
          } else if (attr === '#href') {
            setHref(this.elem, this.oldValues[attr]);
          } else {
            this.elem.setAttribute(attr, this.oldValues[attr]);
          }
        } else {
          if (attr === '#text') {
            this.elem.textContent = '';
          } else {
            this.elem.removeAttribute(attr);
          }
        }
        if (attr === 'transform') {
          bChangedTransform = true;
        }
      }
      // relocate rotational transform, if necessary
      if (!bChangedTransform) {
        var angle = getRotationAngle(this.elem);
        if (angle) {
          var bbox = this.elem.getBBox();
          var cx = bbox.x + bbox.width / 2,
              cy = bbox.y + bbox.height / 2;
          var rotate = ['rotate(', angle, ' ', cx, ',', cy, ')'].join('');
          if (rotate !== this.elem.getAttribute('transform')) {
            this.elem.setAttribute('transform', rotate);
          }
        }
      }

      // Remove transformlist to prevent confusion that causes bugs like 575.
      removeElementFromListMap(this.elem);

      if (handler) {
        handler.handleHistoryEvent(HistoryEventTypes.AFTER_UNAPPLY, this);
      }

      return true;
    }

    /**
    * @returns {Array} Array with element associated with this command
    */

  }, {
    key: 'elements',
    value: function elements() {
      return [this.elem];
    }
  }]);
  return ChangeElementCommand;
}();
ChangeElementCommand.type = ChangeElementCommand.prototype.type;

// TODO: create a 'typing' command object that tracks changes in text
// if a new Typing command is created and the top command on the stack is also a Typing
// and they both affect the same element, then collapse the two commands into one

/**
* @implements svgedit.history.HistoryCommand
* History command that can contain/execute multiple other commands
* @param {String} [text] - An optional string visible to user related to this change
*/
var BatchCommand = function () {
  function BatchCommand(text) {
    classCallCheck(this, BatchCommand);

    this.text = text || 'Batch Command';
    this.stack = [];
  }

  createClass(BatchCommand, [{
    key: 'type',
    value: function type() {
      return 'svgedit.history.BatchCommand';
    }
  }, {
    key: 'getText',
    value: function getText() {
      return this.text;
    }

    // Runs "apply" on all subcommands

  }, {
    key: 'apply',
    value: function apply(handler) {
      if (handler) {
        handler.handleHistoryEvent(HistoryEventTypes.BEFORE_APPLY, this);
      }

      var len = this.stack.length;
      for (var i = 0; i < len; ++i) {
        this.stack[i].apply(handler);
      }

      if (handler) {
        handler.handleHistoryEvent(HistoryEventTypes.AFTER_APPLY, this);
      }
    }

    // Runs "unapply" on all subcommands

  }, {
    key: 'unapply',
    value: function unapply(handler) {
      if (handler) {
        handler.handleHistoryEvent(HistoryEventTypes.BEFORE_UNAPPLY, this);
      }

      for (var i = this.stack.length - 1; i >= 0; i--) {
        this.stack[i].unapply(handler);
      }

      if (handler) {
        handler.handleHistoryEvent(HistoryEventTypes.AFTER_UNAPPLY, this);
      }
    }

    // Iterate through all our subcommands and returns all the elements we are changing

  }, {
    key: 'elements',
    value: function elements() {
      var elems = [];
      var cmd = this.stack.length;
      while (cmd--) {
        var thisElems = this.stack[cmd].elements();
        var elem = thisElems.length;
        while (elem--) {
          if (!elems.includes(thisElems[elem])) {
            elems.push(thisElems[elem]);
          }
        }
      }
      return elems;
    }

    /**
    * Adds a given command to the history stack
    * @param cmd - The undo command object to add
    */

  }, {
    key: 'addSubCommand',
    value: function addSubCommand(cmd) {
      this.stack.push(cmd);
    }

    /**
    * @returns {Boolean} Indicates whether or not the batch command is empty
    */

  }, {
    key: 'isEmpty',
    value: function isEmpty() {
      return !this.stack.length;
    }
  }]);
  return BatchCommand;
}();
BatchCommand.type = BatchCommand.prototype.type;

/**
* @param historyEventHandler - an object that conforms to the HistoryEventHandler interface
* (see above)
*/
var UndoManager = function () {
  function UndoManager(historyEventHandler) {
    classCallCheck(this, UndoManager);

    this.handler_ = historyEventHandler || null;
    this.undoStackPointer = 0;
    this.undoStack = [];

    // this is the stack that stores the original values, the elements and
    // the attribute name for begin/finish
    this.undoChangeStackPointer = -1;
    this.undoableChangeStack = [];
  }

  // Resets the undo stack, effectively clearing the undo/redo history


  createClass(UndoManager, [{
    key: 'resetUndoStack',
    value: function resetUndoStack() {
      this.undoStack = [];
      this.undoStackPointer = 0;
    }

    /**
    * @returns {Number} Integer with the current size of the undo history stack
    */

  }, {
    key: 'getUndoStackSize',
    value: function getUndoStackSize() {
      return this.undoStackPointer;
    }

    /**
    * @returns {Number} Integer with the current size of the redo history stack
    */

  }, {
    key: 'getRedoStackSize',
    value: function getRedoStackSize() {
      return this.undoStack.length - this.undoStackPointer;
    }

    /**
    * @returns {String} String associated with the next undo command
    */

  }, {
    key: 'getNextUndoCommandText',
    value: function getNextUndoCommandText() {
      return this.undoStackPointer > 0 ? this.undoStack[this.undoStackPointer - 1].getText() : '';
    }

    /**
    * @returns {String} String associated with the next redo command
    */

  }, {
    key: 'getNextRedoCommandText',
    value: function getNextRedoCommandText() {
      return this.undoStackPointer < this.undoStack.length ? this.undoStack[this.undoStackPointer].getText() : '';
    }

    // Performs an undo step

  }, {
    key: 'undo',
    value: function undo() {
      if (this.undoStackPointer > 0) {
        var cmd = this.undoStack[--this.undoStackPointer];
        cmd.unapply(this.handler_);
      }
    }

    // Performs a redo step

  }, {
    key: 'redo',
    value: function redo() {
      if (this.undoStackPointer < this.undoStack.length && this.undoStack.length > 0) {
        var cmd = this.undoStack[this.undoStackPointer++];
        cmd.apply(this.handler_);
      }
    }

    /**
    * Adds a command object to the undo history stack
    * @param cmd - The command object to add
    */

  }, {
    key: 'addCommandToHistory',
    value: function addCommandToHistory(cmd) {
      // FIXME: we MUST compress consecutive text changes to the same element
      // (right now each keystroke is saved as a separate command that includes the
      // entire text contents of the text element)
      // TODO: consider limiting the history that we store here (need to do some slicing)

      // if our stack pointer is not at the end, then we have to remove
      // all commands after the pointer and insert the new command
      if (this.undoStackPointer < this.undoStack.length && this.undoStack.length > 0) {
        this.undoStack = this.undoStack.splice(0, this.undoStackPointer);
      }
      this.undoStack.push(cmd);
      this.undoStackPointer = this.undoStack.length;
    }

    /**
    * This function tells the canvas to remember the old values of the
    * attrName attribute for each element sent in.  The elements and values
    * are stored on a stack, so the next call to finishUndoableChange() will
    * pop the elements and old values off the stack, gets the current values
    * from the DOM and uses all of these to construct the undo-able command.
    * @param attrName - The name of the attribute being changed
    * @param elems - Array of DOM elements being changed
    */

  }, {
    key: 'beginUndoableChange',
    value: function beginUndoableChange(attrName, elems) {
      var p = ++this.undoChangeStackPointer;
      var i = elems.length;
      var oldValues = new Array(i),
          elements = new Array(i);
      while (i--) {
        var elem = elems[i];
        if (elem == null) {
          continue;
        }
        elements[i] = elem;
        oldValues[i] = elem.getAttribute(attrName);
      }
      this.undoableChangeStack[p] = {
        attrName: attrName,
        oldValues: oldValues,
        elements: elements
      };
    }

    /**
    * This function returns a BatchCommand object which summarizes the
    * change since beginUndoableChange was called.  The command can then
    * be added to the command history
    * @returns Batch command object with resulting changes
    */

  }, {
    key: 'finishUndoableChange',
    value: function finishUndoableChange() {
      var p = this.undoChangeStackPointer--;
      var changeset = this.undoableChangeStack[p];
      var attrName = changeset.attrName;

      var batchCmd = new BatchCommand('Change ' + attrName);
      var i = changeset.elements.length;
      while (i--) {
        var elem = changeset.elements[i];
        if (elem == null) {
          continue;
        }
        var changes = {};
        changes[attrName] = changeset.oldValues[i];
        if (changes[attrName] !== elem.getAttribute(attrName)) {
          batchCmd.addSubCommand(new ChangeElementCommand(elem, changes, attrName));
        }
      }
      this.undoableChangeStack[p] = null;
      return batchCmd;
    }
  }]);
  return UndoManager;
}();

var history = /*#__PURE__*/Object.freeze({
  HistoryEventTypes: HistoryEventTypes,
  MoveElementCommand: MoveElementCommand,
  InsertElementCommand: InsertElementCommand,
  RemoveElementCommand: RemoveElementCommand,
  ChangeElementCommand: ChangeElementCommand,
  BatchCommand: BatchCommand,
  UndoManager: UndoManager
});

/**
 * Package: svedit.math
 *
 * Licensed under the MIT License
 *
 * Copyright(c) 2010 Alexis Deveria
 * Copyright(c) 2010 Jeff Schiller
 */

// Constants
var NEAR_ZERO = 1e-14;

// Throw away SVGSVGElement used for creating matrices/transforms.
var svg$1 = document.createElementNS(NS.SVG, 'svg');

/**
 * A (hopefully) quicker function to transform a point by a matrix
 * (this function avoids any DOM calls and just does the math)
 * @param {number} x - Float representing the x coordinate
 * @param {number} y - Float representing the y coordinate
 * @param {SVGMatrix} m - Matrix object to transform the point with
 * @returns {Object} An x, y object representing the transformed point
*/
var transformPoint = function transformPoint(x, y, m) {
  return { x: m.a * x + m.c * y + m.e, y: m.b * x + m.d * y + m.f };
};

/**
 * Helper function to check if the matrix performs no actual transform
 * (i.e. exists for identity purposes)
 * @param {SVGMatrix} m - The matrix object to check
 * @returns {boolean} Indicates whether or not the matrix is 1,0,0,1,0,0
*/
var isIdentity = function isIdentity(m) {
  return m.a === 1 && m.b === 0 && m.c === 0 && m.d === 1 && m.e === 0 && m.f === 0;
};

/**
 * This function tries to return a SVGMatrix that is the multiplication m1*m2.
 * We also round to zero when it's near zero
 * @param {...SVGMatrix} args - Matrix objects to multiply
 * @returns {SVGMatrix} The matrix object resulting from the calculation
*/
var matrixMultiply = function matrixMultiply() {
  for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
    args[_key] = arguments[_key];
  }

  var m = args.reduceRight(function (prev, m1) {
    return m1.multiply(prev);
  });

  if (Math.abs(m.a) < NEAR_ZERO) {
    m.a = 0;
  }
  if (Math.abs(m.b) < NEAR_ZERO) {
    m.b = 0;
  }
  if (Math.abs(m.c) < NEAR_ZERO) {
    m.c = 0;
  }
  if (Math.abs(m.d) < NEAR_ZERO) {
    m.d = 0;
  }
  if (Math.abs(m.e) < NEAR_ZERO) {
    m.e = 0;
  }
  if (Math.abs(m.f) < NEAR_ZERO) {
    m.f = 0;
  }

  return m;
};

/**
 * See if the given transformlist includes a non-indentity matrix transform
 * @param {Object} [tlist] - The transformlist to check
 * @returns {boolean} Whether or not a matrix transform was found
*/
var hasMatrixTransform = function hasMatrixTransform(tlist) {
  if (!tlist) {
    return false;
  }
  var num = tlist.numberOfItems;
  while (num--) {
    var xform = tlist.getItem(num);
    if (xform.type === 1 && !isIdentity(xform.matrix)) {
      return true;
    }
  }
  return false;
};

/**
 * Transforms a rectangle based on the given matrix
 * @param {number} l - Float with the box's left coordinate
 * @param {number} t - Float with the box's top coordinate
 * @param {number} w - Float with the box width
 * @param {number} h - Float with the box height
 * @param {SVGMatrix} m - Matrix object to transform the box by
 * @returns {Object} An object with the following values:
 * tl - The top left coordinate (x,y object)
 * tr - The top right coordinate (x,y object)
 * bl - The bottom left coordinate (x,y object)
 * br - The bottom right coordinate (x,y object)
 * aabox - Object with the following values:
 * x - Float with the axis-aligned x coordinate
 * y - Float with the axis-aligned y coordinate
 * width - Float with the axis-aligned width coordinate
 * height - Float with the axis-aligned height coordinate
*/
var transformBox = function transformBox(l, t, w, h, m) {
  var tl = transformPoint(l, t, m),
      tr = transformPoint(l + w, t, m),
      bl = transformPoint(l, t + h, m),
      br = transformPoint(l + w, t + h, m),
      minx = Math.min(tl.x, tr.x, bl.x, br.x),
      maxx = Math.max(tl.x, tr.x, bl.x, br.x),
      miny = Math.min(tl.y, tr.y, bl.y, br.y),
      maxy = Math.max(tl.y, tr.y, bl.y, br.y);

  return {
    tl: tl,
    tr: tr,
    bl: bl,
    br: br,
    aabox: {
      x: minx,
      y: miny,
      width: maxx - minx,
      height: maxy - miny
    }
  };
};

/**
 * This returns a single matrix Transform for a given Transform List
 * (this is the equivalent of SVGTransformList.consolidate() but unlike
 * that method, this one does not modify the actual SVGTransformList)
 * This function is very liberal with its min, max arguments
 * @param {Object} tlist - The transformlist object
 * @param {integer} [min=0] - Optional integer indicating start transform position
 * @param {integer} [max] - Optional integer indicating end transform position;
 *   defaults to one less than the tlist's numberOfItems
 * @returns {Object} A single matrix transform object
*/
var transformListToTransform = function transformListToTransform(tlist, min, max) {
  if (tlist == null) {
    // Or should tlist = null have been prevented before this?
    return svg$1.createSVGTransformFromMatrix(svg$1.createSVGMatrix());
  }
  min = min || 0;
  max = max || tlist.numberOfItems - 1;
  min = parseInt(min, 10);
  max = parseInt(max, 10);
  if (min > max) {
    var temp = max;max = min;min = temp;
  }
  var m = svg$1.createSVGMatrix();
  for (var i = min; i <= max; ++i) {
    // if our indices are out of range, just use a harmless identity matrix
    var mtom = i >= 0 && i < tlist.numberOfItems ? tlist.getItem(i).matrix : svg$1.createSVGMatrix();
    m = matrixMultiply(m, mtom);
  }
  return svg$1.createSVGTransformFromMatrix(m);
};

/**
 * Get the matrix object for a given element
 * @param {Element} elem - The DOM element to check
 * @returns {SVGMatrix} The matrix object associated with the element's transformlist
*/
var getMatrix = function getMatrix(elem) {
  var tlist = getTransformList(elem);
  return transformListToTransform(tlist).matrix;
};

/**
 * Returns a 45 degree angle coordinate associated with the two given
 * coordinates
 * @param {number} x1 - First coordinate's x value
 * @param {number} x2 - Second coordinate's x value
 * @param {number} y1 - First coordinate's y value
 * @param {number} y2 - Second coordinate's y value
 * @returns {AngleCoord45}
*/
var snapToAngle = function snapToAngle(x1, y1, x2, y2) {
  var snap = Math.PI / 4; // 45 degrees
  var dx = x2 - x1;
  var dy = y2 - y1;
  var angle = Math.atan2(dy, dx);
  var dist = Math.sqrt(dx * dx + dy * dy);
  var snapangle = Math.round(angle / snap) * snap;

  return {
    x: x1 + dist * Math.cos(snapangle),
    y: y1 + dist * Math.sin(snapangle),
    a: snapangle
  };
};

/**
 * Check if two rectangles (BBoxes objects) intersect each other
 * @param {SVGRect} r1 - The first BBox-like object
 * @param {SVGRect} r2 - The second BBox-like object
 * @returns {boolean} True if rectangles intersect
 */
var rectsIntersect = function rectsIntersect(r1, r2) {
  return r2.x < r1.x + r1.width && r2.x + r2.width > r1.x && r2.y < r1.y + r1.height && r2.y + r2.height > r1.y;
};

/* globals jQuery */

var $$1 = jQuery;

var segData = {
  2: ['x', 'y'],
  4: ['x', 'y'],
  6: ['x', 'y', 'x1', 'y1', 'x2', 'y2'],
  8: ['x', 'y', 'x1', 'y1'],
  10: ['x', 'y', 'r1', 'r2', 'angle', 'largeArcFlag', 'sweepFlag'],
  12: ['x'],
  14: ['y'],
  16: ['x', 'y', 'x2', 'y2'],
  18: ['x', 'y']
};

var uiStrings = {};
var setUiStrings = function setUiStrings(strs) {
  Object.assign(uiStrings, strs.ui);
};

var pathFuncs = [];

var linkControlPts = true;

// Stores references to paths via IDs.
// TODO: Make this cross-document happy.
var pathData = {};

var setLinkControlPoints = function setLinkControlPoints(lcp) {
  linkControlPts = lcp;
};

var path = null;

var editorContext_ = null;

var init$1 = function init$$1(editorContext) {
  editorContext_ = editorContext;

  pathFuncs = [0, 'ClosePath'];
  var pathFuncsStrs = ['Moveto', 'Lineto', 'CurvetoCubic', 'CurvetoQuadratic', 'Arc', 'LinetoHorizontal', 'LinetoVertical', 'CurvetoCubicSmooth', 'CurvetoQuadraticSmooth'];
  $$1.each(pathFuncsStrs, function (i, s) {
    pathFuncs.push(s + 'Abs');
    pathFuncs.push(s + 'Rel');
  });
};

var insertItemBefore = function insertItemBefore(elem, newseg, index) {
  // Support insertItemBefore on paths for FF2
  var list = elem.pathSegList;

  if (supportsPathInsertItemBefore()) {
    list.insertItemBefore(newseg, index);
    return;
  }
  var len = list.numberOfItems;
  var arr = [];
  for (var i = 0; i < len; i++) {
    var curSeg = list.getItem(i);
    arr.push(curSeg);
  }
  list.clear();
  for (var _i = 0; _i < len; _i++) {
    if (_i === index) {
      // index + 1
      list.appendItem(newseg);
    }
    list.appendItem(arr[_i]);
  }
};

// TODO: See if this should just live in replacePathSeg
var ptObjToArr = function ptObjToArr(type, segItem) {
  var arr = segData[type],
      len = arr.length;
  var out = [];
  for (var i = 0; i < len; i++) {
    out[i] = segItem[arr[i]];
  }
  return out;
};

var getGripPt = function getGripPt(seg, altPt) {
  var path = seg.path;

  var out = {
    x: altPt ? altPt.x : seg.item.x,
    y: altPt ? altPt.y : seg.item.y
  };

  if (path.matrix) {
    var pt = transformPoint(out.x, out.y, path.matrix);
    out = pt;
  }

  var currentZoom = editorContext_.getCurrentZoom();
  out.x *= currentZoom;
  out.y *= currentZoom;

  return out;
};

var getPointFromGrip = function getPointFromGrip(pt, path) {
  var out = {
    x: pt.x,
    y: pt.y
  };

  if (path.matrix) {
    pt = transformPoint(out.x, out.y, path.imatrix);
    out.x = pt.x;
    out.y = pt.y;
  }

  var currentZoom = editorContext_.getCurrentZoom();
  out.x /= currentZoom;
  out.y /= currentZoom;

  return out;
};

/**
* Requires prior call to `setUiStrings` if `xlink:title`
*    to be set on the grip
*/
var addPointGrip = function addPointGrip(index, x, y) {
  // create the container of all the point grips
  var pointGripContainer = getGripContainer();

  var pointGrip = getElem('pathpointgrip_' + index);
  // create it
  if (!pointGrip) {
    pointGrip = document.createElementNS(NS.SVG, 'circle');
    var atts = {
      id: 'pathpointgrip_' + index,
      display: 'none',
      r: 4,
      fill: '#0FF',
      stroke: '#00F',
      'stroke-width': 2,
      cursor: 'move',
      style: 'pointer-events:all'
    };
    if ('pathNodeTooltip' in uiStrings) {
      // May be empty if running path.js without svg-editor
      atts['xlink:title'] = uiStrings.pathNodeTooltip;
    }
    assignAttributes(pointGrip, atts);
    pointGrip = pointGripContainer.appendChild(pointGrip);

    var grip = $$1('#pathpointgrip_' + index);
    grip.dblclick(function () {
      if (path) {
        path.setSegType();
      }
    });
  }
  if (x && y) {
    // set up the point grip element and display it
    assignAttributes(pointGrip, {
      cx: x,
      cy: y,
      display: 'inline'
    });
  }
  return pointGrip;
};

var getGripContainer = function getGripContainer() {
  var c = getElem('pathpointgrip_container');
  if (!c) {
    var parent = getElem('selectorParentGroup');
    c = parent.appendChild(document.createElementNS(NS.SVG, 'g'));
    c.id = 'pathpointgrip_container';
  }
  return c;
};

/**
* Requires prior call to `setUiStrings` if `xlink:title`
*    to be set on the grip
*/
var addCtrlGrip = function addCtrlGrip(id) {
  var pointGrip = getElem('ctrlpointgrip_' + id);
  if (pointGrip) {
    return pointGrip;
  }

  pointGrip = document.createElementNS(NS.SVG, 'circle');
  var atts = {
    id: 'ctrlpointgrip_' + id,
    display: 'none',
    r: 4,
    fill: '#0FF',
    stroke: '#55F',
    'stroke-width': 1,
    cursor: 'move',
    style: 'pointer-events:all'
  };
  if ('pathCtrlPtTooltip' in uiStrings) {
    // May be empty if running path.js without svg-editor
    atts['xlink:title'] = uiStrings.pathCtrlPtTooltip;
  }
  assignAttributes(pointGrip, atts);
  getGripContainer().append(pointGrip);
  return pointGrip;
};

var getCtrlLine = function getCtrlLine(id) {
  var ctrlLine = getElem('ctrlLine_' + id);
  if (ctrlLine) {
    return ctrlLine;
  }

  ctrlLine = document.createElementNS(NS.SVG, 'line');
  assignAttributes(ctrlLine, {
    id: 'ctrlLine_' + id,
    stroke: '#555',
    'stroke-width': 1,
    style: 'pointer-events:none'
  });
  getGripContainer().append(ctrlLine);
  return ctrlLine;
};

var getPointGrip = function getPointGrip(seg, update) {
  var index = seg.index;

  var pointGrip = addPointGrip(index);

  if (update) {
    var pt = getGripPt(seg);
    assignAttributes(pointGrip, {
      cx: pt.x,
      cy: pt.y,
      display: 'inline'
    });
  }

  return pointGrip;
};

var getControlPoints = function getControlPoints(seg) {
  var item = seg.item,
      index = seg.index;

  if (!('x1' in item) || !('x2' in item)) {
    return null;
  }
  var cpt = {};
  /* const pointGripContainer = */getGripContainer();

  // Note that this is intentionally not seg.prev.item
  var prev = path.segs[index - 1].item;

  var segItems = [prev, item];

  for (var i = 1; i < 3; i++) {
    var id = index + 'c' + i;

    var ctrlLine = cpt['c' + i + '_line'] = getCtrlLine(id);

    var pt = getGripPt(seg, { x: item['x' + i], y: item['y' + i] });
    var gpt = getGripPt(seg, { x: segItems[i - 1].x, y: segItems[i - 1].y });

    assignAttributes(ctrlLine, {
      x1: pt.x,
      y1: pt.y,
      x2: gpt.x,
      y2: gpt.y,
      display: 'inline'
    });

    cpt['c' + i + '_line'] = ctrlLine;

    // create it
    var pointGrip = cpt['c' + i] = addCtrlGrip(id);

    assignAttributes(pointGrip, {
      cx: pt.x,
      cy: pt.y,
      display: 'inline'
    });
    cpt['c' + i] = pointGrip;
  }
  return cpt;
};

// This replaces the segment at the given index. Type is given as number.
var replacePathSeg = function replacePathSeg(type, index, pts, elem) {
  var pth = elem || path.elem;

  var func = 'createSVGPathSeg' + pathFuncs[type];
  var seg = pth[func].apply(pth, pts);

  if (supportsPathReplaceItem()) {
    pth.pathSegList.replaceItem(seg, index);
  } else {
    var segList = pth.pathSegList;
    var len = segList.numberOfItems;
    var arr = [];
    for (var i = 0; i < len; i++) {
      var curSeg = segList.getItem(i);
      arr.push(curSeg);
    }
    segList.clear();
    for (var _i2 = 0; _i2 < len; _i2++) {
      if (_i2 === index) {
        segList.appendItem(seg);
      } else {
        segList.appendItem(arr[_i2]);
      }
    }
  }
};

var getSegSelector = function getSegSelector(seg, update) {
  var index = seg.index;

  var segLine = getElem('segline_' + index);
  if (!segLine) {
    var pointGripContainer = getGripContainer();
    // create segline
    segLine = document.createElementNS(NS.SVG, 'path');
    assignAttributes(segLine, {
      id: 'segline_' + index,
      display: 'none',
      fill: 'none',
      stroke: '#0FF',
      'stroke-width': 2,
      style: 'pointer-events:none',
      d: 'M0,0 0,0'
    });
    pointGripContainer.append(segLine);
  }

  if (update) {
    var prev = seg.prev;

    if (!prev) {
      segLine.setAttribute('display', 'none');
      return segLine;
    }

    var pt = getGripPt(prev);
    // Set start point
    replacePathSeg(2, 0, [pt.x, pt.y], segLine);

    var pts = ptObjToArr(seg.type, seg.item, true);
    for (var i = 0; i < pts.length; i += 2) {
      var _pt = getGripPt(seg, { x: pts[i], y: pts[i + 1] });
      pts[i] = _pt.x;
      pts[i + 1] = _pt.y;
    }

    replacePathSeg(seg.type, 1, pts, segLine);
  }
  return segLine;
};

/**
* Takes three points and creates a smoother line based on them
* @param ct1 - Object with x and y values (first control point)
* @param ct2 - Object with x and y values (second control point)
* @param pt - Object with x and y values (third point)
* @returns Array of two "smoothed" point objects
*/
var smoothControlPoints = function smoothControlPoints(ct1, ct2, pt) {
  // each point must not be the origin
  var x1 = ct1.x - pt.x,
      y1 = ct1.y - pt.y,
      x2 = ct2.x - pt.x,
      y2 = ct2.y - pt.y;

  if ((x1 !== 0 || y1 !== 0) && (x2 !== 0 || y2 !== 0)) {
    var r1 = Math.sqrt(x1 * x1 + y1 * y1),
        r2 = Math.sqrt(x2 * x2 + y2 * y2),
        nct1 = editorContext_.getSVGRoot().createSVGPoint(),
        nct2 = editorContext_.getSVGRoot().createSVGPoint();
    var anglea = Math.atan2(y1, x1),
        angleb = Math.atan2(y2, x2);
    if (anglea < 0) {
      anglea += 2 * Math.PI;
    }
    if (angleb < 0) {
      angleb += 2 * Math.PI;
    }

    var angleBetween = Math.abs(anglea - angleb),
        angleDiff = Math.abs(Math.PI - angleBetween) / 2;

    var newAnglea = void 0,
        newAngleb = void 0;
    if (anglea - angleb > 0) {
      newAnglea = angleBetween < Math.PI ? anglea + angleDiff : anglea - angleDiff;
      newAngleb = angleBetween < Math.PI ? angleb - angleDiff : angleb + angleDiff;
    } else {
      newAnglea = angleBetween < Math.PI ? anglea - angleDiff : anglea + angleDiff;
      newAngleb = angleBetween < Math.PI ? angleb + angleDiff : angleb - angleDiff;
    }

    // rotate the points
    nct1.x = r1 * Math.cos(newAnglea) + pt.x;
    nct1.y = r1 * Math.sin(newAnglea) + pt.y;
    nct2.x = r2 * Math.cos(newAngleb) + pt.x;
    nct2.y = r2 * Math.sin(newAngleb) + pt.y;

    return [nct1, nct2];
  }
  return undefined;
};

var Segment = function () {
  function Segment(index, item) {
    classCallCheck(this, Segment);

    this.selected = false;
    this.index = index;
    this.item = item;
    this.type = item.pathSegType;

    this.ctrlpts = [];
    this.ptgrip = null;
    this.segsel = null;
  }

  createClass(Segment, [{
    key: 'showCtrlPts',
    value: function showCtrlPts(y) {
      for (var i in this.ctrlpts) {
        if (this.ctrlpts.hasOwnProperty(i)) {
          this.ctrlpts[i].setAttribute('display', y ? 'inline' : 'none');
        }
      }
    }
  }, {
    key: 'selectCtrls',
    value: function selectCtrls(y) {
      $$1('#ctrlpointgrip_' + this.index + 'c1, #ctrlpointgrip_' + this.index + 'c2').attr('fill', y ? '#0FF' : '#EEE');
    }
  }, {
    key: 'show',
    value: function show(y) {
      if (this.ptgrip) {
        this.ptgrip.setAttribute('display', y ? 'inline' : 'none');
        this.segsel.setAttribute('display', y ? 'inline' : 'none');
        // Show/hide all control points if available
        this.showCtrlPts(y);
      }
    }
  }, {
    key: 'select',
    value: function select(y) {
      if (this.ptgrip) {
        this.ptgrip.setAttribute('stroke', y ? '#0FF' : '#00F');
        this.segsel.setAttribute('display', y ? 'inline' : 'none');
        if (this.ctrlpts) {
          this.selectCtrls(y);
        }
        this.selected = y;
      }
    }
  }, {
    key: 'addGrip',
    value: function addGrip() {
      this.ptgrip = getPointGrip(this, true);
      this.ctrlpts = getControlPoints(this, true);
      this.segsel = getSegSelector(this, true);
    }
  }, {
    key: 'update',
    value: function update(full) {
      if (this.ptgrip) {
        var pt = getGripPt(this);
        assignAttributes(this.ptgrip, {
          cx: pt.x,
          cy: pt.y
        });

        getSegSelector(this, true);

        if (this.ctrlpts) {
          if (full) {
            this.item = path.elem.pathSegList.getItem(this.index);
            this.type = this.item.pathSegType;
          }
          getControlPoints(this);
        }
        // this.segsel.setAttribute('display', y ? 'inline' : 'none');
      }
    }
  }, {
    key: 'move',
    value: function move(dx, dy) {
      var item = this.item;


      var curPts = this.ctrlpts ? [item.x += dx, item.y += dy, item.x1, item.y1, item.x2 += dx, item.y2 += dy] : [item.x += dx, item.y += dy];

      replacePathSeg(this.type, this.index, curPts);

      if (this.next && this.next.ctrlpts) {
        var next = this.next.item;
        var nextPts = [next.x, next.y, next.x1 += dx, next.y1 += dy, next.x2, next.y2];
        replacePathSeg(this.next.type, this.next.index, nextPts);
      }

      if (this.mate) {
        // The last point of a closed subpath has a 'mate',
        // which is the 'M' segment of the subpath
        var _item = this.mate.item;

        var pts = [_item.x += dx, _item.y += dy];
        replacePathSeg(this.mate.type, this.mate.index, pts);
        // Has no grip, so does not need 'updating'?
      }

      this.update(true);
      if (this.next) {
        this.next.update(true);
      }
    }
  }, {
    key: 'setLinked',
    value: function setLinked(num) {
      var seg = void 0,
          anum = void 0,
          pt = void 0;
      if (num === 2) {
        anum = 1;
        seg = this.next;
        if (!seg) {
          return;
        }
        pt = this.item;
      } else {
        anum = 2;
        seg = this.prev;
        if (!seg) {
          return;
        }
        pt = seg.item;
      }

      var _seg = seg,
          item = _seg.item;

      item['x' + anum] = pt.x + (pt.x - this.item['x' + num]);
      item['y' + anum] = pt.y + (pt.y - this.item['y' + num]);

      var pts = [item.x, item.y, item.x1, item.y1, item.x2, item.y2];

      replacePathSeg(seg.type, seg.index, pts);
      seg.update(true);
    }
  }, {
    key: 'moveCtrl',
    value: function moveCtrl(num, dx, dy) {
      var item = this.item;

      item['x' + num] += dx;
      item['y' + num] += dy;

      var pts = [item.x, item.y, item.x1, item.y1, item.x2, item.y2];

      replacePathSeg(this.type, this.index, pts);
      this.update(true);
    }
  }, {
    key: 'setType',
    value: function setType(newType, pts) {
      replacePathSeg(newType, this.index, pts);
      this.type = newType;
      this.item = path.elem.pathSegList.getItem(this.index);
      this.showCtrlPts(newType === 6);
      this.ctrlpts = getControlPoints(this);
      this.update(true);
    }
  }]);
  return Segment;
}();

var Path = function () {
  function Path(elem) {
    classCallCheck(this, Path);

    if (!elem || elem.tagName !== 'path') {
      throw new Error('svgedit.path.Path constructed without a <path> element');
    }

    this.elem = elem;
    this.segs = [];
    this.selected_pts = [];
    path = this;

    this.init();
  }

  // Reset path data


  createClass(Path, [{
    key: 'init',
    value: function init$$1() {
      // Hide all grips, etc

      // fixed, needed to work on all found elements, not just first
      $$1(getGripContainer()).find('*').each(function () {
        $$1(this).attr('display', 'none');
      });

      var segList = this.elem.pathSegList;
      var len = segList.numberOfItems;
      this.segs = [];
      this.selected_pts = [];
      this.first_seg = null;

      // Set up segs array
      for (var i = 0; i < len; i++) {
        var item = segList.getItem(i);
        var segment = new Segment(i, item);
        segment.path = this;
        this.segs.push(segment);
      }

      var segs = this.segs;


      var startI = null;
      for (var _i3 = 0; _i3 < len; _i3++) {
        var seg = segs[_i3];
        var nextSeg = _i3 + 1 >= len ? null : segs[_i3 + 1];
        var prevSeg = _i3 - 1 < 0 ? null : segs[_i3 - 1];
        if (seg.type === 2) {
          if (prevSeg && prevSeg.type !== 1) {
            // New sub-path, last one is open,
            // so add a grip to last sub-path's first point
            var startSeg = segs[startI];
            startSeg.next = segs[startI + 1];
            startSeg.next.prev = startSeg;
            startSeg.addGrip();
          }
          // Remember that this is a starter seg
          startI = _i3;
        } else if (nextSeg && nextSeg.type === 1) {
          // This is the last real segment of a closed sub-path
          // Next is first seg after "M"
          seg.next = segs[startI + 1];

          // First seg after "M"'s prev is this
          seg.next.prev = seg;
          seg.mate = segs[startI];
          seg.addGrip();
          if (this.first_seg == null) {
            this.first_seg = seg;
          }
        } else if (!nextSeg) {
          if (seg.type !== 1) {
            // Last seg, doesn't close so add a grip
            // to last sub-path's first point
            var _startSeg = segs[startI];
            _startSeg.next = segs[startI + 1];
            _startSeg.next.prev = _startSeg;
            _startSeg.addGrip();
            seg.addGrip();

            if (!this.first_seg) {
              // Open path, so set first as real first and add grip
              this.first_seg = segs[startI];
            }
          }
        } else if (seg.type !== 1) {
          // Regular segment, so add grip and its "next"
          seg.addGrip();

          // Don't set its "next" if it's an "M"
          if (nextSeg && nextSeg.type !== 2) {
            seg.next = nextSeg;
            seg.next.prev = seg;
          }
        }
      }
      return this;
    }
  }, {
    key: 'eachSeg',
    value: function eachSeg(fn) {
      var len = this.segs.length;
      for (var i = 0; i < len; i++) {
        var ret = fn.call(this.segs[i], i);
        if (ret === false) {
          break;
        }
      }
    }
  }, {
    key: 'addSeg',
    value: function addSeg(index) {
      // Adds a new segment
      var seg = this.segs[index];
      if (!seg.prev) {
        return;
      }

      var prev = seg.prev;

      var newseg = void 0,
          newX = void 0,
          newY = void 0;
      switch (seg.item.pathSegType) {
        case 4:
          {
            newX = (seg.item.x + prev.item.x) / 2;
            newY = (seg.item.y + prev.item.y) / 2;
            newseg = this.elem.createSVGPathSegLinetoAbs(newX, newY);
            break;
          }case 6:
          {
            // make it a curved segment to preserve the shape (WRS)
            // https://en.wikipedia.org/wiki/De_Casteljau%27s_algorithm#Geometric_interpretation
            var p0x = (prev.item.x + seg.item.x1) / 2;
            var p1x = (seg.item.x1 + seg.item.x2) / 2;
            var p2x = (seg.item.x2 + seg.item.x) / 2;
            var p01x = (p0x + p1x) / 2;
            var p12x = (p1x + p2x) / 2;
            newX = (p01x + p12x) / 2;
            var p0y = (prev.item.y + seg.item.y1) / 2;
            var p1y = (seg.item.y1 + seg.item.y2) / 2;
            var p2y = (seg.item.y2 + seg.item.y) / 2;
            var p01y = (p0y + p1y) / 2;
            var p12y = (p1y + p2y) / 2;
            newY = (p01y + p12y) / 2;
            newseg = this.elem.createSVGPathSegCurvetoCubicAbs(newX, newY, p0x, p0y, p01x, p01y);
            var pts = [seg.item.x, seg.item.y, p12x, p12y, p2x, p2y];
            replacePathSeg(seg.type, index, pts);
            break;
          }
      }

      insertItemBefore(this.elem, newseg, index);
    }
  }, {
    key: 'deleteSeg',
    value: function deleteSeg(index) {
      var seg = this.segs[index];
      var list = this.elem.pathSegList;

      seg.show(false);
      var next = seg.next;

      if (seg.mate) {
        // Make the next point be the "M" point
        var pt = [next.item.x, next.item.y];
        replacePathSeg(2, next.index, pt);

        // Reposition last node
        replacePathSeg(4, seg.index, pt);

        list.removeItem(seg.mate.index);
      } else if (!seg.prev) {
        // First node of open path, make next point the M
        // const {item} = seg;
        var _pt2 = [next.item.x, next.item.y];
        replacePathSeg(2, seg.next.index, _pt2);
        list.removeItem(index);
      } else {
        list.removeItem(index);
      }
    }
  }, {
    key: 'subpathIsClosed',
    value: function subpathIsClosed(index) {
      var closed = false;
      // Check if subpath is already open
      path.eachSeg(function (i) {
        if (i <= index) {
          return true;
        }
        if (this.type === 2) {
          // Found M first, so open
          return false;
        }
        if (this.type === 1) {
          // Found Z first, so closed
          closed = true;
          return false;
        }
      });

      return closed;
    }
  }, {
    key: 'removePtFromSelection',
    value: function removePtFromSelection(index) {
      var pos = this.selected_pts.indexOf(index);
      if (pos === -1) {
        return;
      }
      this.segs[index].select(false);
      this.selected_pts.splice(pos, 1);
    }
  }, {
    key: 'clearSelection',
    value: function clearSelection() {
      this.eachSeg(function () {
        // 'this' is the segment here
        this.select(false);
      });
      this.selected_pts = [];
    }
  }, {
    key: 'storeD',
    value: function storeD() {
      this.last_d = this.elem.getAttribute('d');
    }
  }, {
    key: 'show',
    value: function show(y) {
      // Shows this path's segment grips
      this.eachSeg(function () {
        // 'this' is the segment here
        this.show(y);
      });
      if (y) {
        this.selectPt(this.first_seg.index);
      }
      return this;
    }

    // Move selected points

  }, {
    key: 'movePts',
    value: function movePts(dx, dy) {
      var i = this.selected_pts.length;
      while (i--) {
        var seg = this.segs[this.selected_pts[i]];
        seg.move(dx, dy);
      }
    }
  }, {
    key: 'moveCtrl',
    value: function moveCtrl(dx, dy) {
      var seg = this.segs[this.selected_pts[0]];
      seg.moveCtrl(this.dragctrl, dx, dy);
      if (linkControlPts) {
        seg.setLinked(this.dragctrl);
      }
    }
  }, {
    key: 'setSegType',
    value: function setSegType(newType) {
      this.storeD();
      var i = this.selected_pts.length;
      var text = void 0;
      while (i--) {
        var selPt = this.selected_pts[i];

        // Selected seg
        var cur = this.segs[selPt];
        var prev = cur.prev;

        if (!prev) {
          continue;
        }

        if (!newType) {
          // double-click, so just toggle
          text = 'Toggle Path Segment Type';

          // Toggle segment to curve/straight line
          var oldType = cur.type;

          newType = oldType === 6 ? 4 : 6;
        }

        newType = Number(newType);

        var curX = cur.item.x;
        var curY = cur.item.y;
        var prevX = prev.item.x;
        var prevY = prev.item.y;
        var points = void 0;
        switch (newType) {
          case 6:
            {
              if (cur.olditem) {
                var old = cur.olditem;
                points = [curX, curY, old.x1, old.y1, old.x2, old.y2];
              } else {
                var diffX = curX - prevX;
                var diffY = curY - prevY;
                // get control points from straight line segment
                /*
                const ct1x = (prevX + (diffY/2));
                const ct1y = (prevY - (diffX/2));
                const ct2x = (curX + (diffY/2));
                const ct2y = (curY - (diffX/2));
                */
                // create control points on the line to preserve the shape (WRS)
                var ct1x = prevX + diffX / 3;
                var ct1y = prevY + diffY / 3;
                var ct2x = curX - diffX / 3;
                var ct2y = curY - diffY / 3;
                points = [curX, curY, ct1x, ct1y, ct2x, ct2y];
              }
              break;
            }case 4:
            {
              points = [curX, curY];

              // Store original prevve segment nums
              cur.olditem = cur.item;
              break;
            }
        }

        cur.setType(newType, points);
      }
      path.endChanges(text);
    }
  }, {
    key: 'selectPt',
    value: function selectPt(pt, ctrlNum) {
      this.clearSelection();
      if (pt == null) {
        this.eachSeg(function (i) {
          // 'this' is the segment here.
          if (this.prev) {
            pt = i;
          }
        });
      }
      this.addPtsToSelection(pt);
      if (ctrlNum) {
        this.dragctrl = ctrlNum;

        if (linkControlPts) {
          this.segs[pt].setLinked(ctrlNum);
        }
      }
    }

    // Update position of all points

  }, {
    key: 'update',
    value: function update() {
      var elem = this.elem;

      if (getRotationAngle(elem)) {
        this.matrix = getMatrix(elem);
        this.imatrix = this.matrix.inverse();
      } else {
        this.matrix = null;
        this.imatrix = null;
      }

      this.eachSeg(function (i) {
        this.item = elem.pathSegList.getItem(i);
        this.update();
      });

      return this;
    }
  }, {
    key: 'endChanges',
    value: function endChanges(text) {
      if (isWebkit()) {
        editorContext_.resetD(this.elem);
      }
      var cmd = new ChangeElementCommand(this.elem, { d: this.last_d }, text);
      editorContext_.endChanges({ cmd: cmd, elem: this.elem });
    }
  }, {
    key: 'addPtsToSelection',
    value: function addPtsToSelection(indexes) {
      if (!Array.isArray(indexes)) {
        indexes = [indexes];
      }
      for (var _i4 = 0; _i4 < indexes.length; _i4++) {
        var index = indexes[_i4];
        var seg = this.segs[index];
        if (seg.ptgrip) {
          if (!this.selected_pts.includes(index) && index >= 0) {
            this.selected_pts.push(index);
          }
        }
      }
      this.selected_pts.sort();
      var i = this.selected_pts.length;
      var grips = [];
      grips.length = i;
      // Loop through points to be selected and highlight each
      while (i--) {
        var pt = this.selected_pts[i];
        var _seg2 = this.segs[pt];
        _seg2.select(true);
        grips[i] = _seg2.ptgrip;
      }

      var closedSubpath = this.subpathIsClosed(this.selected_pts[0]);
      editorContext_.addPtsToSelection({ grips: grips, closedSubpath: closedSubpath });
    }
  }]);
  return Path;
}();

var getPath_ = function getPath_(elem) {
  var p = pathData[elem.id];
  if (!p) {
    p = pathData[elem.id] = new Path(elem);
  }
  return p;
};

var removePath_ = function removePath_(id) {
  if (id in pathData) {
    delete pathData[id];
  }
};

var newcx = void 0,
    newcy = void 0,
    oldcx = void 0,
    oldcy = void 0,
    angle = void 0;

var getRotVals = function getRotVals(x, y) {
  var dx = x - oldcx;
  var dy = y - oldcy;

  // rotate the point around the old center
  var r = Math.sqrt(dx * dx + dy * dy);
  var theta = Math.atan2(dy, dx) + angle;
  dx = r * Math.cos(theta) + oldcx;
  dy = r * Math.sin(theta) + oldcy;

  // dx,dy should now hold the actual coordinates of each
  // point after being rotated

  // now we want to rotate them around the new center in the reverse direction
  dx -= newcx;
  dy -= newcy;

  r = Math.sqrt(dx * dx + dy * dy);
  theta = Math.atan2(dy, dx) - angle;

  return { x: r * Math.cos(theta) + newcx,
    y: r * Math.sin(theta) + newcy };
};

// If the path was rotated, we must now pay the piper:
// Every path point must be rotated into the rotated coordinate system of
// its old center, then determine the new center, then rotate it back
// This is because we want the path to remember its rotation

// TODO: This is still using ye olde transform methods, can probably
// be optimized or even taken care of by `recalculateDimensions`
var recalcRotatedPath = function recalcRotatedPath() {
  var currentPath = path.elem;
  angle = getRotationAngle(currentPath, true);
  if (!angle) {
    return;
  }
  // selectedBBoxes[0] = path.oldbbox;
  var oldbox = path.oldbbox; // selectedBBoxes[0],
  oldcx = oldbox.x + oldbox.width / 2;
  oldcy = oldbox.y + oldbox.height / 2;
  var box = getBBox(currentPath);
  newcx = box.x + box.width / 2;
  newcy = box.y + box.height / 2;

  // un-rotate the new center to the proper position
  var dx = newcx - oldcx,
      dy = newcy - oldcy,
      r = Math.sqrt(dx * dx + dy * dy),
      theta = Math.atan2(dy, dx) + angle;

  newcx = r * Math.cos(theta) + oldcx;
  newcy = r * Math.sin(theta) + oldcy;

  var list = currentPath.pathSegList;

  var i = list.numberOfItems;
  while (i) {
    i -= 1;
    var seg = list.getItem(i),
        type = seg.pathSegType;
    if (type === 1) {
      continue;
    }

    var rvals = getRotVals(seg.x, seg.y),
        points = [rvals.x, rvals.y];
    if (seg.x1 != null && seg.x2 != null) {
      var cVals1 = getRotVals(seg.x1, seg.y1);
      var cVals2 = getRotVals(seg.x2, seg.y2);
      points.splice(points.length, 0, cVals1.x, cVals1.y, cVals2.x, cVals2.y);
    }
    replacePathSeg(type, i, points);
  } // loop for each point

  box = getBBox(currentPath);
  // selectedBBoxes[0].x = box.x; selectedBBoxes[0].y = box.y;
  // selectedBBoxes[0].width = box.width; selectedBBoxes[0].height = box.height;

  // now we must set the new transform to be rotated around the new center
  var Rnc = editorContext_.getSVGRoot().createSVGTransform(),
      tlist = getTransformList(currentPath);
  Rnc.setRotate(angle * 180.0 / Math.PI, newcx, newcy);
  tlist.replaceItem(Rnc, 0);
};

// ====================================
// Public API starts here

var clearData = function clearData() {
  pathData = {};
};

// Making public for mocking
var reorientGrads = function reorientGrads(elem, m) {
  var bb = getBBox(elem);
  for (var i = 0; i < 2; i++) {
    var type = i === 0 ? 'fill' : 'stroke';
    var attrVal = elem.getAttribute(type);
    if (attrVal && attrVal.startsWith('url(')) {
      var grad = getRefElem(attrVal);
      if (grad.tagName === 'linearGradient') {
        var x1 = grad.getAttribute('x1') || 0;
        var y1 = grad.getAttribute('y1') || 0;
        var x2 = grad.getAttribute('x2') || 1;
        var y2 = grad.getAttribute('y2') || 0;

        // Convert to USOU points
        x1 = bb.width * x1 + bb.x;
        y1 = bb.height * y1 + bb.y;
        x2 = bb.width * x2 + bb.x;
        y2 = bb.height * y2 + bb.y;

        // Transform those points
        var pt1 = transformPoint(x1, y1, m);
        var pt2 = transformPoint(x2, y2, m);

        // Convert back to BB points
        var gCoords = {};

        gCoords.x1 = (pt1.x - bb.x) / bb.width;
        gCoords.y1 = (pt1.y - bb.y) / bb.height;
        gCoords.x2 = (pt2.x - bb.x) / bb.width;
        gCoords.y2 = (pt2.y - bb.y) / bb.height;

        var newgrad = grad.cloneNode(true);
        $$1(newgrad).attr(gCoords);

        newgrad.id = editorContext_.getNextId();
        findDefs().append(newgrad);
        elem.setAttribute(type, 'url(#' + newgrad.id + ')');
      }
    }
  }
};

// this is how we map paths to our preferred relative segment types
var pathMap = [0, 'z', 'M', 'm', 'L', 'l', 'C', 'c', 'Q', 'q', 'A', 'a', 'H', 'h', 'V', 'v', 'S', 's', 'T', 't'];

/**
 * TODO: move to pathActions.js
 * Convert a path to one with only absolute or relative values
 * @param {Object} path - the path to convert
 * @param {boolean} toRel - true of convert to relative
 * @returns {string}
 */
var convertPath = function convertPath(path, toRel) {
  var segList = path.pathSegList;
  var len = segList.numberOfItems;
  var curx = 0,
      cury = 0;
  var d = '';
  var lastM = null;

  for (var i = 0; i < len; ++i) {
    var seg = segList.getItem(i);
    // if these properties are not in the segment, set them to zero
    var x = seg.x || 0,
        y = seg.y || 0,
        x1 = seg.x1 || 0,
        y1 = seg.y1 || 0,
        x2 = seg.x2 || 0,
        y2 = seg.y2 || 0;

    var type = seg.pathSegType;
    var letter = pathMap[type]['to' + (toRel ? 'Lower' : 'Upper') + 'Case']();

    switch (type) {
      case 1:
        // z,Z closepath (Z/z)
        d += 'z';
        if (lastM && !toRel) {
          curx = lastM[0];
          cury = lastM[1];
        }
        break;
      case 12:
        // absolute horizontal line (H)
        x -= curx;
      // Fallthrough
      case 13:
        // relative horizontal line (h)
        if (toRel) {
          curx += x;
          letter = 'l';
        } else {
          x += curx;
          curx = x;
          letter = 'L';
        }
        // Convert to "line" for easier editing
        d += pathDSegment(letter, [[x, cury]]);
        break;
      case 14:
        // absolute vertical line (V)
        y -= cury;
      // Fallthrough
      case 15:
        // relative vertical line (v)
        if (toRel) {
          cury += y;
          letter = 'l';
        } else {
          y += cury;
          cury = y;
          letter = 'L';
        }
        // Convert to "line" for easier editing
        d += pathDSegment(letter, [[curx, y]]);
        break;
      case 2: // absolute move (M)
      case 4: // absolute line (L)
      case 18:
        // absolute smooth quad (T)
        x -= curx;
        y -= cury;
      // Fallthrough
      case 5: // relative line (l)
      case 3: // relative move (m)
      case 19:
        // relative smooth quad (t)
        if (toRel) {
          curx += x;
          cury += y;
        } else {
          x += curx;
          y += cury;
          curx = x;
          cury = y;
        }
        if (type === 2 || type === 3) {
          lastM = [curx, cury];
        }

        d += pathDSegment(letter, [[x, y]]);
        break;
      case 6:
        // absolute cubic (C)
        x -= curx;x1 -= curx;x2 -= curx;
        y -= cury;y1 -= cury;y2 -= cury;
      // Fallthrough
      case 7:
        // relative cubic (c)
        if (toRel) {
          curx += x;
          cury += y;
        } else {
          x += curx;x1 += curx;x2 += curx;
          y += cury;y1 += cury;y2 += cury;
          curx = x;
          cury = y;
        }
        d += pathDSegment(letter, [[x1, y1], [x2, y2], [x, y]]);
        break;
      case 8:
        // absolute quad (Q)
        x -= curx;x1 -= curx;
        y -= cury;y1 -= cury;
      // Fallthrough
      case 9:
        // relative quad (q)
        if (toRel) {
          curx += x;
          cury += y;
        } else {
          x += curx;x1 += curx;
          y += cury;y1 += cury;
          curx = x;
          cury = y;
        }
        d += pathDSegment(letter, [[x1, y1], [x, y]]);
        break;
      case 10:
        // absolute elliptical arc (A)
        x -= curx;
        y -= cury;
      // Fallthrough
      case 11:
        // relative elliptical arc (a)
        if (toRel) {
          curx += x;
          cury += y;
        } else {
          x += curx;
          y += cury;
          curx = x;
          cury = y;
        }
        d += pathDSegment(letter, [[seg.r1, seg.r2]], [seg.angle, seg.largeArcFlag ? 1 : 0, seg.sweepFlag ? 1 : 0], [x, y]);
        break;
      case 16:
        // absolute smooth cubic (S)
        x -= curx;x2 -= curx;
        y -= cury;y2 -= cury;
      // Fallthrough
      case 17:
        // relative smooth cubic (s)
        if (toRel) {
          curx += x;
          cury += y;
        } else {
          x += curx;x2 += curx;
          y += cury;y2 += cury;
          curx = x;
          cury = y;
        }
        d += pathDSegment(letter, [[x2, y2], [x, y]]);
        break;
    } // switch on path segment type
  } // for each segment
  return d;
};

/**
 * TODO: refactor callers in convertPath to use getPathDFromSegments instead of this function.
 * Legacy code refactored from svgcanvas.pathActions.convertPath
 * @param letter - path segment command
 * @param {Array.<Array.<number>>} points - x,y points.
 * @param {Array.<Array.<number>>=} morePoints - x,y points
 * @param {Array.<number>=}lastPoint - x,y point
 * @returns {string}
 */
function pathDSegment(letter, points, morePoints, lastPoint) {
  $$1.each(points, function (i, pnt) {
    points[i] = shortFloat(pnt);
  });
  var segment = letter + points.join(' ');
  if (morePoints) {
    segment += ' ' + morePoints.join(' ');
  }
  if (lastPoint) {
    segment += ' ' + shortFloat(lastPoint);
  }
  return segment;
}

/**
* Group: Path edit functions
* Functions relating to editing path elements
*/
var pathActions = function () {
  var subpath = false;
  var newPoint = void 0,
      firstCtrl = void 0;

  var currentPath = null;
  var hasMoved = false;
  // No `editorContext_` yet but should be ok as is `null` by default
  // editorContext_.setDrawnPath(null);

  // This function converts a polyline (created by the fh_path tool) into
  // a path element and coverts every three line segments into a single bezier
  // curve in an attempt to smooth out the free-hand
  var smoothPolylineIntoPath = function smoothPolylineIntoPath(element) {
    var i = void 0;
    var _element = element,
        points = _element.points;

    var N = points.numberOfItems;
    if (N >= 4) {
      // loop through every 3 points and convert to a cubic bezier curve segment
      //
      // NOTE: this is cheating, it means that every 3 points has the potential to
      // be a corner instead of treating each point in an equal manner. In general,
      // this technique does not look that good.
      //
      // I am open to better ideas!
      //
      // Reading:
      // - http://www.efg2.com/Lab/Graphics/Jean-YvesQueinecBezierCurves.htm
      // - https://www.codeproject.com/KB/graphics/BezierSpline.aspx?msg=2956963
      // - https://www.ian-ko.com/ET_GeoWizards/UserGuide/smooth.htm
      // - https://www.cs.mtu.edu/~shene/COURSES/cs3621/NOTES/spline/Bezier/bezier-der.html
      var curpos = points.getItem(0),
          prevCtlPt = null;
      var d = [];
      d.push(['M', curpos.x, ',', curpos.y, ' C'].join(''));
      for (i = 1; i <= N - 4; i += 3) {
        var ct1 = points.getItem(i);
        var ct2 = points.getItem(i + 1);
        var end = points.getItem(i + 2);

        // if the previous segment had a control point, we want to smooth out
        // the control points on both sides
        if (prevCtlPt) {
          var newpts = smoothControlPoints(prevCtlPt, ct1, curpos);
          if (newpts && newpts.length === 2) {
            var prevArr = d[d.length - 1].split(',');
            prevArr[2] = newpts[0].x;
            prevArr[3] = newpts[0].y;
            d[d.length - 1] = prevArr.join(',');
            ct1 = newpts[1];
          }
        }

        d.push([ct1.x, ct1.y, ct2.x, ct2.y, end.x, end.y].join(','));

        curpos = end;
        prevCtlPt = ct2;
      }
      // handle remaining line segments
      d.push('L');
      while (i < N) {
        var pt = points.getItem(i);
        d.push([pt.x, pt.y].join(','));
        i++;
      }
      d = d.join(' ');

      // create new path element
      element = editorContext_.addSvgElementFromJson({
        element: 'path',
        curStyles: true,
        attr: {
          id: editorContext_.getId(),
          d: d,
          fill: 'none'
        }
      });
      // No need to call "changed", as this is already done under mouseUp
    }
    return element;
  };

  return {
    mouseDown: function mouseDown(evt, mouseTarget, startX, startY) {
      var id = void 0;
      if (editorContext_.getCurrentMode() === 'path') {
        var mouseX = startX; // Was this meant to work with the other `mouseX`? (was defined globally so adding `let` to at least avoid a global)
        var mouseY = startY; // Was this meant to work with the other `mouseY`? (was defined globally so adding `let` to at least avoid a global)

        var currentZoom = editorContext_.getCurrentZoom();
        var x = mouseX / currentZoom,
            y = mouseY / currentZoom,
            stretchy = getElem('path_stretch_line');
        newPoint = [x, y];

        if (editorContext_.getGridSnapping()) {
          x = snapToGrid(x);
          y = snapToGrid(y);
          mouseX = snapToGrid(mouseX);
          mouseY = snapToGrid(mouseY);
        }

        if (!stretchy) {
          stretchy = document.createElementNS(NS.SVG, 'path');
          assignAttributes(stretchy, {
            id: 'path_stretch_line',
            stroke: '#22C',
            'stroke-width': '0.5',
            fill: 'none'
          });
          stretchy = getElem('selectorParentGroup').appendChild(stretchy);
        }
        stretchy.setAttribute('display', 'inline');

        var keep = null;
        var index = void 0;
        // if pts array is empty, create path element with M at current point
        var drawnPath = editorContext_.getDrawnPath();
        if (!drawnPath) {
          var dAttr = 'M' + x + ',' + y + ' '; // Was this meant to work with the other `dAttr`? (was defined globally so adding `var` to at least avoid a global)
          drawnPath = editorContext_.setDrawnPath(editorContext_.addSvgElementFromJson({
            element: 'path',
            curStyles: true,
            attr: {
              d: dAttr,
              id: editorContext_.getNextId(),
              opacity: editorContext_.getOpacity() / 2
            }
          }));
          // set stretchy line to first point
          stretchy.setAttribute('d', ['M', mouseX, mouseY, mouseX, mouseY].join(' '));
          index = subpath ? path.segs.length : 0;
          addPointGrip(index, mouseX, mouseY);
        } else {
          // determine if we clicked on an existing point
          var seglist = drawnPath.pathSegList;
          var i = seglist.numberOfItems;
          var FUZZ = 6 / currentZoom;
          var clickOnPoint = false;
          while (i) {
            i--;
            var item = seglist.getItem(i);
            var px = item.x,
                py = item.y;
            // found a matching point
            if (x >= px - FUZZ && x <= px + FUZZ && y >= py - FUZZ && y <= py + FUZZ) {
              clickOnPoint = true;
              break;
            }
          }

          // get path element that we are in the process of creating
          id = editorContext_.getId();

          // Remove previous path object if previously created
          removePath_(id);

          var newpath = getElem(id);
          var newseg = void 0;
          var sSeg = void 0;
          var len = seglist.numberOfItems;
          // if we clicked on an existing point, then we are done this path, commit it
          // (i, i+1) are the x,y that were clicked on
          if (clickOnPoint) {
            // if clicked on any other point but the first OR
            // the first point was clicked on and there are less than 3 points
            // then leave the path open
            // otherwise, close the path
            if (i <= 1 && len >= 2) {
              // Create end segment
              var absX = seglist.getItem(0).x;
              var absY = seglist.getItem(0).y;

              sSeg = stretchy.pathSegList.getItem(1);
              if (sSeg.pathSegType === 4) {
                newseg = drawnPath.createSVGPathSegLinetoAbs(absX, absY);
              } else {
                newseg = drawnPath.createSVGPathSegCurvetoCubicAbs(absX, absY, sSeg.x1 / currentZoom, sSeg.y1 / currentZoom, absX, absY);
              }

              var endseg = drawnPath.createSVGPathSegClosePath();
              seglist.appendItem(newseg);
              seglist.appendItem(endseg);
            } else if (len < 3) {
              keep = false;
              return keep;
            }
            $$1(stretchy).remove();

            // This will signal to commit the path
            // const element = newpath; // Other event handlers define own `element`, so this was probably not meant to interact with them or one which shares state (as there were none); I therefore adding a missing `var` to avoid a global
            drawnPath = editorContext_.setDrawnPath(null);
            editorContext_.setStarted(false);

            if (subpath) {
              if (path.matrix) {
                editorContext_.remapElement(newpath, {}, path.matrix.inverse());
              }

              var newD = newpath.getAttribute('d');
              var origD = $$1(path.elem).attr('d');
              $$1(path.elem).attr('d', origD + newD);
              $$1(newpath).remove();
              if (path.matrix) {
                recalcRotatedPath();
              }
              init$1();
              pathActions.toEditMode(path.elem);
              path.selectPt();
              return false;
            }
            // else, create a new point, update path element
          } else {
            // Checks if current target or parents are #svgcontent
            if (!$$1.contains(editorContext_.getContainer(), editorContext_.getMouseTarget(evt))) {
              // Clicked outside canvas, so don't make point
              console.log('Clicked outside canvas');
              return false;
            }

            var num = drawnPath.pathSegList.numberOfItems;
            var last = drawnPath.pathSegList.getItem(num - 1);
            var lastx = last.x,
                lasty = last.y;

            if (evt.shiftKey) {
              var xya = snapToAngle(lastx, lasty, x, y);
              x = xya.x;
              y = xya.y;
            }

            // Use the segment defined by stretchy
            sSeg = stretchy.pathSegList.getItem(1);
            if (sSeg.pathSegType === 4) {
              newseg = drawnPath.createSVGPathSegLinetoAbs(editorContext_.round(x), editorContext_.round(y));
            } else {
              newseg = drawnPath.createSVGPathSegCurvetoCubicAbs(editorContext_.round(x), editorContext_.round(y), sSeg.x1 / currentZoom, sSeg.y1 / currentZoom, sSeg.x2 / currentZoom, sSeg.y2 / currentZoom);
            }

            drawnPath.pathSegList.appendItem(newseg);

            x *= currentZoom;
            y *= currentZoom;

            // set stretchy line to latest point
            stretchy.setAttribute('d', ['M', x, y, x, y].join(' '));
            index = num;
            if (subpath) {
              index += path.segs.length;
            }
            addPointGrip(index, x, y);
          }
          // keep = true;
        }

        return;
      }

      // TODO: Make sure currentPath isn't null at this point
      if (!path) {
        return;
      }

      path.storeD();

      id = evt.target.id;

      var curPt = void 0;
      if (id.substr(0, 14) === 'pathpointgrip_') {
        // Select this point
        curPt = path.cur_pt = parseInt(id.substr(14), 10);
        path.dragging = [startX, startY];
        var seg = path.segs[curPt];

        // only clear selection if shift is not pressed (otherwise, add
        // node to selection)
        if (!evt.shiftKey) {
          if (path.selected_pts.length <= 1 || !seg.selected) {
            path.clearSelection();
          }
          path.addPtsToSelection(curPt);
        } else if (seg.selected) {
          path.removePtFromSelection(curPt);
        } else {
          path.addPtsToSelection(curPt);
        }
      } else if (id.startsWith('ctrlpointgrip_')) {
        path.dragging = [startX, startY];

        var parts = id.split('_')[1].split('c');
        curPt = Number(parts[0]);
        var ctrlNum = Number(parts[1]);
        path.selectPt(curPt, ctrlNum);
      }

      // Start selection box
      if (!path.dragging) {
        var rubberBox = editorContext_.getRubberBox();
        if (rubberBox == null) {
          rubberBox = editorContext_.setRubberBox(editorContext_.selectorManager.getRubberBandBox());
        }
        var _currentZoom = editorContext_.getCurrentZoom();
        assignAttributes(rubberBox, {
          x: startX * _currentZoom,
          y: startY * _currentZoom,
          width: 0,
          height: 0,
          display: 'inline'
        }, 100);
      }
    },
    mouseMove: function mouseMove(mouseX, mouseY) {
      var currentZoom = editorContext_.getCurrentZoom();
      hasMoved = true;
      var drawnPath = editorContext_.getDrawnPath();
      if (editorContext_.getCurrentMode() === 'path') {
        if (!drawnPath) {
          return;
        }
        var seglist = drawnPath.pathSegList;
        var index = seglist.numberOfItems - 1;

        if (newPoint) {
          // First point
          // if (!index) { return; }

          // Set control points
          var pointGrip1 = addCtrlGrip('1c1');
          var pointGrip2 = addCtrlGrip('0c2');

          // dragging pointGrip1
          pointGrip1.setAttribute('cx', mouseX);
          pointGrip1.setAttribute('cy', mouseY);
          pointGrip1.setAttribute('display', 'inline');

          var ptX = newPoint[0];
          var ptY = newPoint[1];

          // set curve
          // const seg = seglist.getItem(index);
          var curX = mouseX / currentZoom;
          var curY = mouseY / currentZoom;
          var altX = ptX + (ptX - curX);
          var altY = ptY + (ptY - curY);

          pointGrip2.setAttribute('cx', altX * currentZoom);
          pointGrip2.setAttribute('cy', altY * currentZoom);
          pointGrip2.setAttribute('display', 'inline');

          var ctrlLine = getCtrlLine(1);
          assignAttributes(ctrlLine, {
            x1: mouseX,
            y1: mouseY,
            x2: altX * currentZoom,
            y2: altY * currentZoom,
            display: 'inline'
          });

          if (index === 0) {
            firstCtrl = [mouseX, mouseY];
          } else {
            var last = seglist.getItem(index - 1);
            var lastX = last.x;
            var lastY = last.y;

            if (last.pathSegType === 6) {
              lastX += lastX - last.x2;
              lastY += lastY - last.y2;
            } else if (firstCtrl) {
              lastX = firstCtrl[0] / currentZoom;
              lastY = firstCtrl[1] / currentZoom;
            }
            replacePathSeg(6, index, [ptX, ptY, lastX, lastY, altX, altY], drawnPath);
          }
        } else {
          var stretchy = getElem('path_stretch_line');
          if (stretchy) {
            var prev = seglist.getItem(index);
            if (prev.pathSegType === 6) {
              var prevX = prev.x + (prev.x - prev.x2);
              var prevY = prev.y + (prev.y - prev.y2);
              replacePathSeg(6, 1, [mouseX, mouseY, prevX * currentZoom, prevY * currentZoom, mouseX, mouseY], stretchy);
            } else if (firstCtrl) {
              replacePathSeg(6, 1, [mouseX, mouseY, firstCtrl[0], firstCtrl[1], mouseX, mouseY], stretchy);
            } else {
              replacePathSeg(4, 1, [mouseX, mouseY], stretchy);
            }
          }
        }
        return;
      }
      // if we are dragging a point, let's move it
      if (path.dragging) {
        var pt = getPointFromGrip({
          x: path.dragging[0],
          y: path.dragging[1]
        }, path);
        var mpt = getPointFromGrip({
          x: mouseX,
          y: mouseY
        }, path);
        var diffX = mpt.x - pt.x;
        var diffY = mpt.y - pt.y;
        path.dragging = [mouseX, mouseY];

        if (path.dragctrl) {
          path.moveCtrl(diffX, diffY);
        } else {
          path.movePts(diffX, diffY);
        }
      } else {
        path.selected_pts = [];
        path.eachSeg(function (i) {
          var seg = this;
          if (!seg.next && !seg.prev) {
            return;
          }

          // const {item} = seg;
          var rubberBox = editorContext_.getRubberBox();
          var rbb = rubberBox.getBBox();

          var pt = getGripPt(seg);
          var ptBb = {
            x: pt.x,
            y: pt.y,
            width: 0,
            height: 0
          };

          var sel = rectsIntersect(rbb, ptBb);

          this.select(sel);
          // Note that addPtsToSelection is not being run
          if (sel) {
            path.selected_pts.push(seg.index);
          }
        });
      }
    },
    mouseUp: function mouseUp(evt, element, mouseX, mouseY) {
      var drawnPath = editorContext_.getDrawnPath();
      // Create mode
      if (editorContext_.getCurrentMode() === 'path') {
        newPoint = null;
        if (!drawnPath) {
          element = getElem(editorContext_.getId());
          editorContext_.setStarted(false);
          firstCtrl = null;
        }

        return {
          keep: true,
          element: element
        };
      }

      // Edit mode
      var rubberBox = editorContext_.getRubberBox();
      if (path.dragging) {
        var lastPt = path.cur_pt;

        path.dragging = false;
        path.dragctrl = false;
        path.update();

        if (hasMoved) {
          path.endChanges('Move path point(s)');
        }

        if (!evt.shiftKey && !hasMoved) {
          path.selectPt(lastPt);
        }
      } else if (rubberBox && rubberBox.getAttribute('display') !== 'none') {
        // Done with multi-node-select
        rubberBox.setAttribute('display', 'none');

        if (rubberBox.getAttribute('width') <= 2 && rubberBox.getAttribute('height') <= 2) {
          pathActions.toSelectMode(evt.target);
        }

        // else, move back to select mode
      } else {
        pathActions.toSelectMode(evt.target);
      }
      hasMoved = false;
    },
    toEditMode: function toEditMode(element) {
      path = getPath_(element);
      editorContext_.setCurrentMode('pathedit');
      editorContext_.clearSelection();
      path.show(true).update();
      path.oldbbox = getBBox(path.elem);
      subpath = false;
    },
    toSelectMode: function toSelectMode(elem) {
      var selPath = elem === path.elem;
      editorContext_.setCurrentMode('select');
      path.show(false);
      currentPath = false;
      editorContext_.clearSelection();

      if (path.matrix) {
        // Rotated, so may need to re-calculate the center
        recalcRotatedPath();
      }

      if (selPath) {
        editorContext_.call('selected', [elem]);
        editorContext_.addToSelection([elem], true);
      }
    },
    addSubPath: function addSubPath(on) {
      if (on) {
        // Internally we go into "path" mode, but in the UI it will
        // still appear as if in "pathedit" mode.
        editorContext_.setCurrentMode('path');
        subpath = true;
      } else {
        pathActions.clear(true);
        pathActions.toEditMode(path.elem);
      }
    },
    select: function select(target) {
      if (currentPath === target) {
        pathActions.toEditMode(target);
        editorContext_.setCurrentMode('pathedit');
        // going into pathedit mode
      } else {
        currentPath = target;
      }
    },
    reorient: function reorient() {
      var elem = editorContext_.getSelectedElements()[0];
      if (!elem) {
        return;
      }
      var angle = getRotationAngle(elem);
      if (angle === 0) {
        return;
      }

      var batchCmd = new BatchCommand('Reorient path');
      var changes = {
        d: elem.getAttribute('d'),
        transform: elem.getAttribute('transform')
      };
      batchCmd.addSubCommand(new ChangeElementCommand(elem, changes));
      editorContext_.clearSelection();
      this.resetOrientation(elem);

      editorContext_.addCommandToHistory(batchCmd);

      // Set matrix to null
      getPath_(elem).show(false).matrix = null;

      this.clear();

      editorContext_.addToSelection([elem], true);
      editorContext_.call('changed', editorContext_.getSelectedElements());
    },
    clear: function clear(remove) {
      var drawnPath = editorContext_.getDrawnPath();
      currentPath = null;
      if (drawnPath) {
        var elem = getElem(editorContext_.getId());
        $$1(getElem('path_stretch_line')).remove();
        $$1(elem).remove();
        $$1(getElem('pathpointgrip_container')).find('*').attr('display', 'none');
        firstCtrl = null;
        editorContext_.setDrawnPath(null);
        editorContext_.setStarted(false);
      } else if (editorContext_.getCurrentMode() === 'pathedit') {
        this.toSelectMode();
      }
      if (path) {
        path.init().show(false);
      }
    },
    resetOrientation: function resetOrientation(pth) {
      if (pth == null || pth.nodeName !== 'path') {
        return false;
      }
      var tlist = getTransformList(pth);
      var m = transformListToTransform(tlist).matrix;
      tlist.clear();
      pth.removeAttribute('transform');
      var segList = pth.pathSegList;

      // Opera/win/non-EN throws an error here.
      // TODO: Find out why!
      // Presumed fixed in Opera 10.5, so commented out for now

      // try {
      var len = segList.numberOfItems;
      // } catch(err) {
      //   const fixed_d = pathActions.convertPath(pth);
      //   pth.setAttribute('d', fixed_d);
      //   segList = pth.pathSegList;
      //   const len = segList.numberOfItems;
      // }
      // let lastX, lastY;

      var _loop = function _loop(i) {
        var seg = segList.getItem(i);
        var type = seg.pathSegType;
        if (type === 1) {
          return 'continue';
        }
        var pts = [];
        $$1.each(['', 1, 2], function (j, n) {
          var x = seg['x' + n],
              y = seg['y' + n];
          if (x !== undefined && y !== undefined) {
            var pt = transformPoint(x, y, m);
            pts.splice(pts.length, 0, pt.x, pt.y);
          }
        });
        replacePathSeg(type, i, pts, pth);
      };

      for (var i = 0; i < len; ++i) {
        var _ret = _loop(i);

        if (_ret === 'continue') continue;
      }

      reorientGrads(pth, m);
    },
    zoomChange: function zoomChange() {
      if (editorContext_.getCurrentMode() === 'pathedit') {
        path.update();
      }
    },
    getNodePoint: function getNodePoint() {
      var selPt = path.selected_pts.length ? path.selected_pts[0] : 1;

      var seg = path.segs[selPt];
      return {
        x: seg.item.x,
        y: seg.item.y,
        type: seg.type
      };
    },
    linkControlPoints: function linkControlPoints(linkPoints) {
      setLinkControlPoints(linkPoints);
    },
    clonePathNode: function clonePathNode() {
      path.storeD();

      var selPts = path.selected_pts;
      // const {segs} = path;

      var i = selPts.length;
      var nums = [];

      while (i--) {
        var pt = selPts[i];
        path.addSeg(pt);

        nums.push(pt + i);
        nums.push(pt + i + 1);
      }
      path.init().addPtsToSelection(nums);

      path.endChanges('Clone path node(s)');
    },
    opencloseSubPath: function opencloseSubPath() {
      var selPts = path.selected_pts;
      // Only allow one selected node for now
      if (selPts.length !== 1) {
        return;
      }

      var _path = path,
          elem = _path.elem;

      var list = elem.pathSegList;

      // const len = list.numberOfItems;

      var index = selPts[0];

      var openPt = null;
      var startItem = null;

      // Check if subpath is already open
      path.eachSeg(function (i) {
        if (this.type === 2 && i <= index) {
          startItem = this.item;
        }
        if (i <= index) {
          return true;
        }
        if (this.type === 2) {
          // Found M first, so open
          openPt = i;
          return false;
        }
        if (this.type === 1) {
          // Found Z first, so closed
          openPt = false;
          return false;
        }
      });

      if (openPt == null) {
        // Single path, so close last seg
        openPt = path.segs.length - 1;
      }

      if (openPt !== false) {
        // Close this path

        // Create a line going to the previous "M"
        var newseg = elem.createSVGPathSegLinetoAbs(startItem.x, startItem.y);

        var closer = elem.createSVGPathSegClosePath();
        if (openPt === path.segs.length - 1) {
          list.appendItem(newseg);
          list.appendItem(closer);
        } else {
          insertItemBefore(elem, closer, openPt);
          insertItemBefore(elem, newseg, openPt);
        }

        path.init().selectPt(openPt + 1);
        return;
      }

      // M 1,1 L 2,2 L 3,3 L 1,1 z // open at 2,2
      // M 2,2 L 3,3 L 1,1

      // M 1,1 L 2,2 L 1,1 z M 4,4 L 5,5 L6,6 L 5,5 z
      // M 1,1 L 2,2 L 1,1 z [M 4,4] L 5,5 L(M)6,6 L 5,5 z

      var seg = path.segs[index];

      if (seg.mate) {
        list.removeItem(index); // Removes last "L"
        list.removeItem(index); // Removes the "Z"
        path.init().selectPt(index - 1);
        return;
      }

      var lastM = void 0,
          zSeg = void 0;

      // Find this sub-path's closing point and remove
      for (var i = 0; i < list.numberOfItems; i++) {
        var item = list.getItem(i);

        if (item.pathSegType === 2) {
          // Find the preceding M
          lastM = i;
        } else if (i === index) {
          // Remove it
          list.removeItem(lastM);
          // index--;
        } else if (item.pathSegType === 1 && index < i) {
          // Remove the closing seg of this subpath
          zSeg = i - 1;
          list.removeItem(i);
          break;
        }
      }

      var num = index - lastM - 1;

      while (num--) {
        insertItemBefore(elem, list.getItem(lastM), zSeg);
      }

      var pt = list.getItem(lastM);

      // Make this point the new "M"
      replacePathSeg(2, lastM, [pt.x, pt.y]);

      // i = index; // i is local here, so has no effect; what was the intent for this?

      path.init().selectPt(0);
    },
    deletePathNode: function deletePathNode() {
      if (!pathActions.canDeleteNodes) {
        return;
      }
      path.storeD();

      var selPts = path.selected_pts;

      var i = selPts.length;
      while (i--) {
        var pt = selPts[i];
        path.deleteSeg(pt);
      }

      // Cleanup
      var cleanup = function cleanup() {
        var segList = path.elem.pathSegList;
        var len = segList.numberOfItems;

        var remItems = function remItems(pos, count) {
          while (count--) {
            segList.removeItem(pos);
          }
        };

        if (len <= 1) {
          return true;
        }

        while (len--) {
          var item = segList.getItem(len);
          if (item.pathSegType === 1) {
            var prev = segList.getItem(len - 1);
            var nprev = segList.getItem(len - 2);
            if (prev.pathSegType === 2) {
              remItems(len - 1, 2);
              cleanup();
              break;
            } else if (nprev.pathSegType === 2) {
              remItems(len - 2, 3);
              cleanup();
              break;
            }
          } else if (item.pathSegType === 2) {
            if (len > 0) {
              var prevType = segList.getItem(len - 1).pathSegType;
              // Path has M M
              if (prevType === 2) {
                remItems(len - 1, 1);
                cleanup();
                break;
                // Entire path ends with Z M
              } else if (prevType === 1 && segList.numberOfItems - 1 === len) {
                remItems(len, 1);
                cleanup();
                break;
              }
            }
          }
        }
        return false;
      };

      cleanup();

      // Completely delete a path with 1 or 0 segments
      if (path.elem.pathSegList.numberOfItems <= 1) {
        pathActions.toSelectMode(path.elem);
        editorContext_.canvas.deleteSelectedElements();
        return;
      }

      path.init();
      path.clearSelection();

      // TODO: Find right way to select point now
      // path.selectPt(selPt);
      if (window.opera) {
        // Opera repaints incorrectly
        var cp = $$1(path.elem);
        cp.attr('d', cp.attr('d'));
      }
      path.endChanges('Delete path node(s)');
    },

    smoothPolylineIntoPath: smoothPolylineIntoPath,
    setSegType: function setSegType(v) {
      path.setSegType(v);
    },
    moveNode: function moveNode(attr, newValue) {
      var selPts = path.selected_pts;
      if (!selPts.length) {
        return;
      }

      path.storeD();

      // Get first selected point
      var seg = path.segs[selPts[0]];
      var diff = { x: 0, y: 0 };
      diff[attr] = newValue - seg.item[attr];

      seg.move(diff.x, diff.y);
      path.endChanges('Move path point');
    },
    fixEnd: function fixEnd(elem) {
      // Adds an extra segment if the last seg before a Z doesn't end
      // at its M point
      // M0,0 L0,100 L100,100 z
      var segList = elem.pathSegList;
      var len = segList.numberOfItems;
      var lastM = void 0;
      for (var i = 0; i < len; ++i) {
        var item = segList.getItem(i);
        if (item.pathSegType === 2) {
          lastM = item;
        }

        if (item.pathSegType === 1) {
          var prev = segList.getItem(i - 1);
          if (prev.x !== lastM.x || prev.y !== lastM.y) {
            // Add an L segment here
            var newseg = elem.createSVGPathSegLinetoAbs(lastM.x, lastM.y);
            insertItemBefore(elem, newseg, i);
            // Can this be done better?
            pathActions.fixEnd(elem);
            break;
          }
        }
      }
      if (isWebkit()) {
        editorContext_.resetD(elem);
      }
    },

    // Convert a path to one with only absolute or relative values
    convertPath: convertPath
  };
}();

/* globals jQuery */

// Constants
var $$2 = jqPluginSVG(jQuery);

// String used to encode base64.
var KEYSTR = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';

// Much faster than running getBBox() every time
var visElems = 'a,circle,ellipse,foreignObject,g,image,line,path,polygon,polyline,rect,svg,text,tspan,use';
var visElemsArr = visElems.split(',');
// const hidElems = 'clipPath,defs,desc,feGaussianBlur,filter,linearGradient,marker,mask,metadata,pattern,radialGradient,stop,switch,symbol,title,textPath';

var editorContext_$1 = null;
var domdoc_ = null;
var domcontainer_ = null;
var svgroot_ = null;

var init$2 = function init$$1(editorContext) {
  editorContext_$1 = editorContext;
  domdoc_ = editorContext.getDOMDocument();
  domcontainer_ = editorContext.getDOMContainer();
  svgroot_ = editorContext.getSVGRoot();
};

/**
* Converts characters in a string to XML-friendly entities.
* @example: '&' becomes '&amp;'
* @param str - The string to be converted
* @returns {String} The converted string
*/
var toXml = function toXml(str) {
  // &apos; is ok in XML, but not HTML
  // &gt; does not normally need escaping, though it can if within a CDATA expression (and preceded by "]]")
  return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/, '&#x27;');
};

// This code was written by Tyler Akins and has been placed in the
// public domain.  It would be nice if you left this header intact.
// Base64 code from Tyler Akins -- http://rumkin.com

// schiller: Removed string concatenation in favour of Array.join() optimization,
//        also precalculate the size of the array needed.

// Converts a string to base64
var encode64 = function encode64(input) {
  // base64 strings are 4/3 larger than the original string
  input = encodeUTF8(input); // convert non-ASCII characters
  // input = convertToXMLReferences(input);
  if (window.btoa) {
    return window.btoa(input); // Use native if available
  }
  var output = [];
  output.length = Math.floor((input.length + 2) / 3) * 4;

  var i = 0,
      p = 0;
  do {
    var chr1 = input.charCodeAt(i++);
    var chr2 = input.charCodeAt(i++);
    var chr3 = input.charCodeAt(i++);

    var enc1 = chr1 >> 2;
    var enc2 = (chr1 & 3) << 4 | chr2 >> 4;

    var enc3 = (chr2 & 15) << 2 | chr3 >> 6;
    var enc4 = chr3 & 63;

    if (isNaN(chr2)) {
      enc3 = enc4 = 64;
    } else if (isNaN(chr3)) {
      enc4 = 64;
    }

    output[p++] = KEYSTR.charAt(enc1);
    output[p++] = KEYSTR.charAt(enc2);
    output[p++] = KEYSTR.charAt(enc3);
    output[p++] = KEYSTR.charAt(enc4);
  } while (i < input.length);

  return output.join('');
};

// Converts a string from base64
var decode64 = function decode64(input) {
  if (window.atob) {
    return decodeUTF8(window.atob(input));
  }

  // remove all characters that are not A-Z, a-z, 0-9, +, /, or =
  input = input.replace(/[^A-Za-z0-9+/=]/g, '');

  var output = '';
  var i = 0;

  do {
    var enc1 = KEYSTR.indexOf(input.charAt(i++));
    var enc2 = KEYSTR.indexOf(input.charAt(i++));
    var enc3 = KEYSTR.indexOf(input.charAt(i++));
    var enc4 = KEYSTR.indexOf(input.charAt(i++));

    var chr1 = enc1 << 2 | enc2 >> 4;
    var chr2 = (enc2 & 15) << 4 | enc3 >> 2;
    var chr3 = (enc3 & 3) << 6 | enc4;

    output += String.fromCharCode(chr1);

    if (enc3 !== 64) {
      output = output + String.fromCharCode(chr2);
    }
    if (enc4 !== 64) {
      output = output + String.fromCharCode(chr3);
    }
  } while (i < input.length);
  return decodeUTF8(output);
};

var decodeUTF8 = function decodeUTF8(argString) {
  return decodeURIComponent(escape(argString));
};

// codedread:does not seem to work with webkit-based browsers on OSX // Brettz9: please test again as function upgraded
var encodeUTF8 = function encodeUTF8(argString) {
  return unescape(encodeURIComponent(argString));
};

/**
 * convert dataURL to object URL
 * @param {string} dataurl
 * @return {string} object URL or empty string
 */
var dataURLToObjectURL = function dataURLToObjectURL(dataurl) {
  if (typeof Uint8Array === 'undefined' || typeof Blob === 'undefined' || typeof URL === 'undefined' || !URL.createObjectURL) {
    return '';
  }
  var arr = dataurl.split(','),
      mime = arr[0].match(/:(.*?);/)[1],
      bstr = atob(arr[1]);
  var n = bstr.length;
  var u8arr = new Uint8Array(n);
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }
  var blob = new Blob([u8arr], { type: mime });
  return URL.createObjectURL(blob);
};

/**
 * get object URL for a blob object
 * @param {Blob} blob A Blob object or File object
 * @return {string} object URL or empty string
 */
var createObjectURL = function createObjectURL(blob) {
  if (!blob || typeof URL === 'undefined' || !URL.createObjectURL) {
    return '';
  }
  return URL.createObjectURL(blob);
};

/**
 * @property {string} blankPageObjectURL
 */
var blankPageObjectURL = function () {
  if (typeof Blob === 'undefined') {
    return '';
  }
  var blob = new Blob(['<html><head><title>SVG-edit</title></head><body>&nbsp;</body></html>'], { type: 'text/html' });
  return createObjectURL(blob);
}();

// Cross-browser compatible method of converting a string to an XML tree
// found this function here: http://groups.google.com/group/jquery-dev/browse_thread/thread/c6d11387c580a77f
var text2xml = function text2xml(sXML) {
  if (sXML.includes('<svg:svg')) {
    sXML = sXML.replace(/<(\/?)svg:/g, '<$1').replace('xmlns:svg', 'xmlns');
  }

  var out = void 0,
      dXML = void 0;
  try {
    dXML = window.DOMParser ? new DOMParser() : new window.ActiveXObject('Microsoft.XMLDOM');
    dXML.async = false;
  } catch (e) {
    throw new Error('XML Parser could not be instantiated');
  }
  try {
    if (dXML.loadXML) {
      out = dXML.loadXML(sXML) ? dXML : false;
    } else {
      out = dXML.parseFromString(sXML, 'text/xml');
    }
  } catch (e2) {
    throw new Error('Error parsing XML string');
  }
  return out;
};

/**
* Converts a SVGRect into an object.
* @param bbox - a SVGRect
* @returns An object with properties names x, y, width, height.
*/
var bboxToObj = function bboxToObj(bbox) {
  return {
    x: bbox.x,
    y: bbox.y,
    width: bbox.width,
    height: bbox.height
  };
};

/**
* Walks the tree and executes the callback on each element in a top-down fashion
* @param elem - DOM element to traverse
* @param {Function} cbFn - Callback function to run on each element
*/
var walkTree = function walkTree(elem, cbFn) {
  if (elem && elem.nodeType === 1) {
    cbFn(elem);
    var i = elem.childNodes.length;
    while (i--) {
      walkTree(elem.childNodes.item(i), cbFn);
    }
  }
};

/**
* Walks the tree and executes the callback on each element in a depth-first fashion
* @todo FIXME: Shouldn't this be calling walkTreePost?
* @param elem - DOM element to traverse
* @param {Function} cbFn - Callback function to run on each element
*/
var walkTreePost = function walkTreePost(elem, cbFn) {
  if (elem && elem.nodeType === 1) {
    var i = elem.childNodes.length;
    while (i--) {
      walkTree(elem.childNodes.item(i), cbFn);
    }
    cbFn(elem);
  }
};

/**
* Extracts the URL from the url(...) syntax of some attributes.
* Three variants:
*  - <circle fill="url(someFile.svg#foo)" />
*  - <circle fill="url('someFile.svg#foo')" />
*  - <circle fill='url("someFile.svg#foo")' />
* @param attrVal - The attribute value as a string
* @returns {String} String with just the URL, like "someFile.svg#foo"
*/
var getUrlFromAttr = function getUrlFromAttr(attrVal) {
  if (attrVal) {
    // url('#somegrad')
    if (attrVal.startsWith('url("')) {
      return attrVal.substring(5, attrVal.indexOf('"', 6));
    }
    // url('#somegrad')
    if (attrVal.startsWith("url('")) {
      return attrVal.substring(5, attrVal.indexOf("'", 6));
    }
    if (attrVal.startsWith('url(')) {
      return attrVal.substring(4, attrVal.indexOf(')'));
    }
  }
  return null;
};

/**
* @returns The given element's xlink:href value
*/
var getHref = function getHref(elem) {
  return elem.getAttributeNS(NS.XLINK, 'href');
};

/**
* Sets the given element's xlink:href value
* @param elem
* @param {String} val
*/
var setHref = function setHref(elem, val) {
  elem.setAttributeNS(NS.XLINK, 'xlink:href', val);
};

/**
* @returns The document's &lt;defs> element, create it first if necessary
*/
var findDefs = function findDefs() {
  var svgElement = editorContext_$1.getSVGContent();
  var defs = svgElement.getElementsByTagNameNS(NS.SVG, 'defs');
  if (defs.length > 0) {
    defs = defs[0];
  } else {
    defs = svgElement.ownerDocument.createElementNS(NS.SVG, 'defs');
    if (svgElement.firstChild) {
      // first child is a comment, so call nextSibling
      svgElement.insertBefore(defs, svgElement.firstChild.nextSibling);
      // svgElement.firstChild.nextSibling.before(defs); // Not safe
    } else {
      svgElement.append(defs);
    }
  }
  return defs;
};

// TODO(codedread): Consider moving the next to functions to bbox.js

/**
* Get correct BBox for a path in Webkit
* Converted from code found here:
* http://blog.hackers-cafe.net/2009/06/how-to-calculate-bezier-curves-bounding.html
* @param path - The path DOM element to get the BBox for
* @returns A BBox-like object
*/
var getPathBBox = function getPathBBox(path$$1) {
  var seglist = path$$1.pathSegList;
  var tot = seglist.numberOfItems;

  var bounds = [[], []];
  var start = seglist.getItem(0);
  var P0 = [start.x, start.y];

  for (var i = 0; i < tot; i++) {
    var seg = seglist.getItem(i);

    if (seg.x === undefined) {
      continue;
    }

    // Add actual points to limits
    bounds[0].push(P0[0]);
    bounds[1].push(P0[1]);

    if (seg.x1) {
      (function () {
        var P1 = [seg.x1, seg.y1],
            P2 = [seg.x2, seg.y2],
            P3 = [seg.x, seg.y];

        var _loop = function _loop(j) {
          var calc = function calc(t) {
            return Math.pow(1 - t, 3) * P0[j] + 3 * Math.pow(1 - t, 2) * t * P1[j] + 3 * (1 - t) * Math.pow(t, 2) * P2[j] + Math.pow(t, 3) * P3[j];
          };

          var b = 6 * P0[j] - 12 * P1[j] + 6 * P2[j];
          var a = -3 * P0[j] + 9 * P1[j] - 9 * P2[j] + 3 * P3[j];
          var c = 3 * P1[j] - 3 * P0[j];

          if (a === 0) {
            if (b === 0) {
              return 'continue';
            }
            var t = -c / b;
            if (t > 0 && t < 1) {
              bounds[j].push(calc(t));
            }
            return 'continue';
          }
          var b2ac = Math.pow(b, 2) - 4 * c * a;
          if (b2ac < 0) {
            return 'continue';
          }
          var t1 = (-b + Math.sqrt(b2ac)) / (2 * a);
          if (t1 > 0 && t1 < 1) {
            bounds[j].push(calc(t1));
          }
          var t2 = (-b - Math.sqrt(b2ac)) / (2 * a);
          if (t2 > 0 && t2 < 1) {
            bounds[j].push(calc(t2));
          }
        };

        for (var j = 0; j < 2; j++) {
          var _ret2 = _loop(j);

          if (_ret2 === 'continue') continue;
        }
        P0 = P3;
      })();
    } else {
      bounds[0].push(seg.x);
      bounds[1].push(seg.y);
    }
  }

  var x = Math.min.apply(null, bounds[0]);
  var w = Math.max.apply(null, bounds[0]) - x;
  var y = Math.min.apply(null, bounds[1]);
  var h = Math.max.apply(null, bounds[1]) - y;
  return {
    x: x,
    y: y,
    width: w,
    height: h
  };
};

/**
* Get the given/selected element's bounding box object, checking for
* horizontal/vertical lines (see issue 717)
* Note that performance is currently terrible, so some way to improve would
* be great.
* @param selected - Container or &lt;use> DOM element
* @returns Bounding box object
*/
function groupBBFix(selected) {
  if (supportsHVLineContainerBBox()) {
    try {
      return selected.getBBox();
    } catch (e) {}
  }
  var ref = $$2.data(selected, 'ref');
  var matched = null;
  var ret = void 0,
      copy = void 0;

  if (ref) {
    copy = $$2(ref).children().clone().attr('visibility', 'hidden');
    $$2(svgroot_).append(copy);
    matched = copy.filter('line, path');
  } else {
    matched = $$2(selected).find('line, path');
  }

  var issue = false;
  if (matched.length) {
    matched.each(function () {
      var bb = this.getBBox();
      if (!bb.width || !bb.height) {
        issue = true;
      }
    });
    if (issue) {
      var elems = ref ? copy : $$2(selected).children();
      ret = getStrokedBBox(elems); // getStrokedBBox defined in svgcanvas
    } else {
      ret = selected.getBBox();
    }
  } else {
    ret = selected.getBBox();
  }
  if (ref) {
    copy.remove();
  }
  return ret;
}

/**
* Get the given/selected element's bounding box object, convert it to be more
* usable when necessary
* @param elem - Optional DOM element to get the BBox for
* @returns Bounding box object
*/
var getBBox = function getBBox(elem) {
  var selected = elem || editorContext_$1.geSelectedElements()[0];
  if (elem.nodeType !== 1) {
    return null;
  }
  var elname = selected.nodeName;

  var ret = null;
  switch (elname) {
    case 'text':
      if (selected.textContent === '') {
        selected.textContent = 'a'; // Some character needed for the selector to use.
        ret = selected.getBBox();
        selected.textContent = '';
      } else {
        if (selected.getBBox) {
          ret = selected.getBBox();
        }
      }
      break;
    case 'path':
      if (!supportsPathBBox()) {
        ret = getPathBBox(selected);
      } else {
        if (selected.getBBox) {
          ret = selected.getBBox();
        }
      }
      break;
    case 'g':
    case 'a':
      ret = groupBBFix(selected);
      break;
    default:

      if (elname === 'use') {
        ret = groupBBFix(selected, true);
      }
      if (elname === 'use' || elname === 'foreignObject' && isWebkit()) {
        if (!ret) {
          ret = selected.getBBox();
        }
        // This is resolved in later versions of webkit, perhaps we should
        // have a featured detection for correct 'use' behavior?
        // ——————————
        if (!isWebkit()) {
          var bb = {};
          bb.width = ret.width;
          bb.height = ret.height;
          bb.x = ret.x + parseFloat(selected.getAttribute('x') || 0);
          bb.y = ret.y + parseFloat(selected.getAttribute('y') || 0);
          ret = bb;
        }
      } else if (visElemsArr.includes(elname)) {
        if (selected) {
          try {
            ret = selected.getBBox();
          } catch (err) {
            // tspan (and textPath apparently) have no `getBBox` in Firefox: https://bugzilla.mozilla.org/show_bug.cgi?id=937268
            // Re: Chrome returning bbox for containing text element, see: https://bugs.chromium.org/p/chromium/issues/detail?id=349835
            var extent = selected.getExtentOfChar(0); // pos+dimensions of the first glyph
            var width = selected.getComputedTextLength(); // width of the tspan
            ret = {
              x: extent.x,
              y: extent.y,
              width: width,
              height: extent.height
            };
          }
        } else {
          // Check if element is child of a foreignObject
          var fo = $$2(selected).closest('foreignObject');
          if (fo.length) {
            if (fo[0].getBBox) {
              ret = fo[0].getBBox();
            }
          }
        }
      }
  }
  if (ret) {
    ret = bboxToObj(ret);
  }

  // get the bounding box from the DOM (which is in that element's coordinate system)
  return ret;
};

/**
* Create a path 'd' attribute from path segments.
* Each segment is an array of the form: [singleChar, [x,y, x,y, ...]]
* @param pathSegments - An array of path segments to be converted
* @returns The converted path d attribute.
*/
var getPathDFromSegments = function getPathDFromSegments(pathSegments) {
  var d = '';

  $$2.each(pathSegments, function (j, seg) {
    var pts = seg[1];
    d += seg[0];
    for (var i = 0; i < pts.length; i += 2) {
      d += pts[i] + ',' + pts[i + 1] + ' ';
    }
  });

  return d;
};

/**
* Make a path 'd' attribute from a simple SVG element shape.
* @param elem - The element to be converted
* @returns The path d attribute or `undefined` if the element type is unknown.
*/
var getPathDFromElement = function getPathDFromElement(elem) {
  // Possibly the cubed root of 6, but 1.81 works best
  var num = 1.81;
  var d = void 0,
      a = void 0,
      rx = void 0,
      ry = void 0;
  switch (elem.tagName) {
    case 'ellipse':
    case 'circle':
      a = $$2(elem).attr(['rx', 'ry', 'cx', 'cy']);
      var _a = a,
          cx = _a.cx,
          cy = _a.cy;
      var _a2 = a;
      rx = _a2.rx;
      ry = _a2.ry;

      if (elem.tagName === 'circle') {
        rx = ry = $$2(elem).attr('r');
      }

      d = getPathDFromSegments([['M', [cx - rx, cy]], ['C', [cx - rx, cy - ry / num, cx - rx / num, cy - ry, cx, cy - ry]], ['C', [cx + rx / num, cy - ry, cx + rx, cy - ry / num, cx + rx, cy]], ['C', [cx + rx, cy + ry / num, cx + rx / num, cy + ry, cx, cy + ry]], ['C', [cx - rx / num, cy + ry, cx - rx, cy + ry / num, cx - rx, cy]], ['Z', []]]);
      break;
    case 'path':
      d = elem.getAttribute('d');
      break;
    case 'line':
      a = $$2(elem).attr(['x1', 'y1', 'x2', 'y2']);
      d = 'M' + a.x1 + ',' + a.y1 + 'L' + a.x2 + ',' + a.y2;
      break;
    case 'polyline':
      d = 'M' + elem.getAttribute('points');
      break;
    case 'polygon':
      d = 'M' + elem.getAttribute('points') + ' Z';
      break;
    case 'rect':
      var r = $$2(elem).attr(['rx', 'ry']);
      rx = r.rx;
      ry = r.ry;

      var _b = elem.getBBox();
      var x = _b.x,
          y = _b.y,
          w = _b.width,
          h = _b.height;

      num = 4 - num; // Why? Because!

      if (!rx && !ry) {
        // Regular rect
        d = getPathDFromSegments([['M', [x, y]], ['L', [x + w, y]], ['L', [x + w, y + h]], ['L', [x, y + h]], ['L', [x, y]], ['Z', []]]);
      } else {
        d = getPathDFromSegments([['M', [x, y + ry]], ['C', [x, y + ry / num, x + rx / num, y, x + rx, y]], ['L', [x + w - rx, y]], ['C', [x + w - rx / num, y, x + w, y + ry / num, x + w, y + ry]], ['L', [x + w, y + h - ry]], ['C', [x + w, y + h - ry / num, x + w - rx / num, y + h, x + w - rx, y + h]], ['L', [x + rx, y + h]], ['C', [x + rx / num, y + h, x, y + h - ry / num, x, y + h - ry]], ['L', [x, y + ry]], ['Z', []]]);
      }
      break;
    default:
      break;
  }

  return d;
};

/**
* Get a set of attributes from an element that is useful for convertToPath.
* @param elem - The element to be probed
* @returns {Object} An object with attributes.
*/
var getExtraAttributesForConvertToPath = function getExtraAttributesForConvertToPath(elem) {
  var attrs = {};
  // TODO: make this list global so that we can properly maintain it
  // TODO: what about @transform, @clip-rule, @fill-rule, etc?
  $$2.each(['marker-start', 'marker-end', 'marker-mid', 'filter', 'clip-path'], function () {
    var a = elem.getAttribute(this);
    if (a) {
      attrs[this] = a;
    }
  });
  return attrs;
};

/**
* Get the BBox of an element-as-path
* @param elem - The DOM element to be probed
* @param addSvgElementFromJson - Function to add the path element to the current layer. See canvas.addSvgElementFromJson
* @param pathActions - If a transform exists, `pathActions.resetOrientation()` is used. See: canvas.pathActions.
* @returns The resulting path's bounding box object.
*/
var getBBoxOfElementAsPath = function getBBoxOfElementAsPath(elem, addSvgElementFromJson, pathActions$$1) {
  var path$$1 = addSvgElementFromJson({
    element: 'path',
    attr: getExtraAttributesForConvertToPath(elem)
  });

  var eltrans = elem.getAttribute('transform');
  if (eltrans) {
    path$$1.setAttribute('transform', eltrans);
  }

  var parent = elem.parentNode;
  if (elem.nextSibling) {
    elem.before(path$$1);
  } else {
    parent.append(path$$1);
  }

  var d = getPathDFromElement(elem);
  if (d) {
    path$$1.setAttribute('d', d);
  } else {
    path$$1.remove();
  }

  // Get the correct BBox of the new path, then discard it
  pathActions$$1.resetOrientation(path$$1);
  var bb = false;
  try {
    bb = path$$1.getBBox();
  } catch (e) {
    // Firefox fails
  }
  path$$1.remove();
  return bb;
};

/**
* Convert selected element to a path.
* @param elem - The DOM element to be converted
* @param attrs - Apply attributes to new path. see canvas.convertToPath
* @param addSvgElementFromJson - Function to add the path element to the current layer. See canvas.addSvgElementFromJson
* @param pathActions - If a transform exists, pathActions.resetOrientation() is used. See: canvas.pathActions.
* @param clearSelection - see canvas.clearSelection
* @param addToSelection - see canvas.addToSelection
* @param history - see svgedit.history
* @param addCommandToHistory - see canvas.addCommandToHistory
* @returns The converted path element or null if the DOM element was not recognized.
*/
var convertToPath = function convertToPath(elem, attrs, addSvgElementFromJson, pathActions$$1, clearSelection, addToSelection, history, addCommandToHistory) {
  var batchCmd = new history.BatchCommand('Convert element to Path');

  // Any attribute on the element not covered by the passed-in attributes
  attrs = $$2.extend({}, attrs, getExtraAttributesForConvertToPath(elem));

  var path$$1 = addSvgElementFromJson({
    element: 'path',
    attr: attrs
  });

  var eltrans = elem.getAttribute('transform');
  if (eltrans) {
    path$$1.setAttribute('transform', eltrans);
  }

  var id = elem.id;

  var parent = elem.parentNode;
  if (elem.nextSibling) {
    elem.before(path$$1);
  } else {
    parent.append(path$$1);
  }

  var d = getPathDFromElement(elem);
  if (d) {
    path$$1.setAttribute('d', d);

    // Replace the current element with the converted one

    // Reorient if it has a matrix
    if (eltrans) {
      var tlist = getTransformList(path$$1);
      if (hasMatrixTransform(tlist)) {
        pathActions$$1.resetOrientation(path$$1);
      }
    }

    var nextSibling = elem.nextSibling;

    batchCmd.addSubCommand(new history.RemoveElementCommand(elem, nextSibling, parent));
    batchCmd.addSubCommand(new history.InsertElementCommand(path$$1));

    clearSelection();
    elem.remove();
    path$$1.setAttribute('id', id);
    path$$1.removeAttribute('visibility');
    addToSelection([path$$1], true);

    addCommandToHistory(batchCmd);

    return path$$1;
  } else {
    // the elem.tagName was not recognized, so no "d" attribute. Remove it, so we've haven't changed anything.
    path$$1.remove();
    return null;
  }
};

/**
* Can the bbox be optimized over the native getBBox? The optimized bbox is the same as the native getBBox when
* the rotation angle is a multiple of 90 degrees and there are no complex transforms.
* Getting an optimized bbox can be dramatically slower, so we want to make sure it's worth it.
*
* The best example for this is a circle rotate 45 degrees. The circle doesn't get wider or taller when rotated
* about it's center.
*
* The standard, unoptimized technique gets the native bbox of the circle, rotates the box 45 degrees, uses
* that width and height, and applies any transforms to get the final bbox. This means the calculated bbox
* is much wider than the original circle. If the angle had been 0, 90, 180, etc. both techniques render the
* same bbox.
*
* The optimization is not needed if the rotation is a multiple 90 degrees. The default technique is to call
* getBBox then apply the angle and any transforms.
*
* @param angle - The rotation angle in degrees
* @param {Boolean} hasMatrixTransform - True if there is a matrix transform
* @returns {Boolean} True if the bbox can be optimized.
*/
function bBoxCanBeOptimizedOverNativeGetBBox(angle, hasMatrixTransform$$1) {
  var angleModulo90 = angle % 90;
  var closeTo90 = angleModulo90 < -89.99 || angleModulo90 > 89.99;
  var closeTo0 = angleModulo90 > -0.001 && angleModulo90 < 0.001;
  return hasMatrixTransform$$1 || !(closeTo0 || closeTo90);
}

/**
* Get bounding box that includes any transforms.
* @param elem - The DOM element to be converted
* @param  addSvgElementFromJson - Function to add the path element to the current layer. See canvas.addSvgElementFromJson
* @param  pathActions - If a transform exists, pathActions.resetOrientation() is used. See: canvas.pathActions.
* @returns A single bounding box object
*/
var getBBoxWithTransform = function getBBoxWithTransform(elem, addSvgElementFromJson, pathActions$$1) {
  // TODO: Fix issue with rotated groups. Currently they work
  // fine in FF, but not in other browsers (same problem mentioned
  // in Issue 339 comment #2).

  var bb = getBBox(elem);

  if (!bb) {
    return null;
  }

  var tlist = getTransformList(elem);
  var angle = getRotationAngleFromTransformList(tlist);
  var hasMatrixXForm = hasMatrixTransform(tlist);

  if (angle || hasMatrixXForm) {
    var goodBb = false;
    if (bBoxCanBeOptimizedOverNativeGetBBox(angle, hasMatrixXForm)) {
      // Get the BBox from the raw path for these elements
      // TODO: why ellipse and not circle
      var elemNames = ['ellipse', 'path', 'line', 'polyline', 'polygon'];
      if (elemNames.includes(elem.tagName)) {
        bb = goodBb = getBBoxOfElementAsPath(elem, addSvgElementFromJson, pathActions$$1);
      } else if (elem.tagName === 'rect') {
        // Look for radius
        var rx = elem.getAttribute('rx');
        var ry = elem.getAttribute('ry');
        if (rx || ry) {
          bb = goodBb = getBBoxOfElementAsPath(elem, addSvgElementFromJson, pathActions$$1);
        }
      }
    }

    if (!goodBb) {
      var _transformListToTrans = transformListToTransform(tlist),
          matrix = _transformListToTrans.matrix;

      bb = transformBox(bb.x, bb.y, bb.width, bb.height, matrix).aabox;

      // Old technique that was exceedingly slow with large documents.
      //
      // Accurate way to get BBox of rotated element in Firefox:
      // Put element in group and get its BBox
      //
      // Must use clone else FF freaks out
      // const clone = elem.cloneNode(true);
      // const g = document.createElementNS(NS.SVG, 'g');
      // const parent = elem.parentNode;
      // parent.append(g);
      // g.append(clone);
      // const bb2 = bboxToObj(g.getBBox());
      // g.remove();
    }
  }
  return bb;
};

// TODO: This is problematic with large stroke-width and, for example, a single horizontal line. The calculated BBox extends way beyond left and right sides.
function getStrokeOffsetForBBox(elem) {
  var sw = elem.getAttribute('stroke-width');
  return !isNaN(sw) && elem.getAttribute('stroke') !== 'none' ? sw / 2 : 0;
}

/**
* Get the bounding box for one or more stroked and/or transformed elements
* @param elems - Array with DOM elements to check
* @param addSvgElementFromJson - Function to add the path element to the current layer. See canvas.addSvgElementFromJson
* @param pathActions - If a transform exists, pathActions.resetOrientation() is used. See: canvas.pathActions.
* @returns A single bounding box object
*/
var getStrokedBBox = function getStrokedBBox(elems, addSvgElementFromJson, pathActions$$1) {
  if (!elems || !elems.length) {
    return false;
  }

  var fullBb = void 0;
  $$2.each(elems, function () {
    if (fullBb) {
      return;
    }
    if (!this.parentNode) {
      return;
    }
    fullBb = getBBoxWithTransform(this, addSvgElementFromJson, pathActions$$1);
  });

  // This shouldn't ever happen...
  if (fullBb === undefined) {
    return null;
  }

  // fullBb doesn't include the stoke, so this does no good!
  // if (elems.length == 1) return fullBb;

  var maxX = fullBb.x + fullBb.width;
  var maxY = fullBb.y + fullBb.height;
  var minX = fullBb.x;
  var minY = fullBb.y;

  // If only one elem, don't call the potentially slow getBBoxWithTransform method again.
  if (elems.length === 1) {
    var offset = getStrokeOffsetForBBox(elems[0]);
    minX -= offset;
    minY -= offset;
    maxX += offset;
    maxY += offset;
  } else {
    $$2.each(elems, function (i, elem) {
      var curBb = getBBoxWithTransform(elem, addSvgElementFromJson, pathActions$$1);
      if (curBb) {
        var _offset = getStrokeOffsetForBBox(elem);
        minX = Math.min(minX, curBb.x - _offset);
        minY = Math.min(minY, curBb.y - _offset);
        // TODO: The old code had this test for max, but not min. I suspect this test should be for both min and max
        if (elem.nodeType === 1) {
          maxX = Math.max(maxX, curBb.x + curBb.width + _offset);
          maxY = Math.max(maxY, curBb.y + curBb.height + _offset);
        }
      }
    });
  }

  fullBb.x = minX;
  fullBb.y = minY;
  fullBb.width = maxX - minX;
  fullBb.height = maxY - minY;
  return fullBb;
};

/**
* Get all elements that have a BBox (excludes `&lt;defs>`, `&lt;title>`, etc).
* Note that 0-opacity, off-screen etc elements are still considered "visible"
* for this function
* @param parent - The parent DOM element to search within
* @returns {Array} All "visible" elements.
*/
var getVisibleElements = function getVisibleElements(parent) {
  if (!parent) {
    parent = $$2(editorContext_$1.getSVGContent()).children(); // Prevent layers from being included
  }

  var contentElems = [];
  $$2(parent).children().each(function (i, elem) {
    if (elem.getBBox) {
      contentElems.push(elem);
    }
  });
  return contentElems.reverse();
};

/**
* Get the bounding box for one or more stroked and/or transformed elements
* @param elems - Array with DOM elements to check
* @returns A single bounding box object
*/
var getStrokedBBoxDefaultVisible = function getStrokedBBoxDefaultVisible(elems) {
  if (!elems) {
    elems = getVisibleElements();
  }
  return getStrokedBBox(elems, editorContext_$1.addSvgElementFromJson, editorContext_$1.pathActions);
};

/**
* Get the rotation angle of the given transform list.
* @param tlist - List of transforms
* @param {Boolean} toRad - When true returns the value in radians rather than degrees
* @returns {Number} Float with the angle in degrees or radians
*/
var getRotationAngleFromTransformList = function getRotationAngleFromTransformList(tlist, toRad) {
  if (!tlist) {
    return 0;
  } // <svg> elements have no tlist
  var N = tlist.numberOfItems;
  for (var i = 0; i < N; ++i) {
    var xform = tlist.getItem(i);
    if (xform.type === 4) {
      return toRad ? xform.angle * Math.PI / 180.0 : xform.angle;
    }
  }
  return 0.0;
};

/**
* Get the rotation angle of the given/selected DOM element
* @param elem - Optional DOM element to get the angle for
* @param {Boolean} toRad - When true returns the value in radians rather than degrees
* @returns {Number} Float with the angle in degrees or radians
*/
var getRotationAngle = function getRotationAngle(elem, toRad) {
  var selected = elem || editorContext_$1.getSelectedElements()[0];
  // find the rotation transform (if any) and set it
  var tlist = getTransformList(selected);
  return getRotationAngleFromTransformList(tlist, toRad);
};

/**
* Get the reference element associated with the given attribute value
* @param {String} attrVal - The attribute value as a string
* @returns Reference element
*/
var getRefElem = function getRefElem(attrVal) {
  return getElem(getUrlFromAttr(attrVal).substr(1));
};

/**
* Get a DOM element by ID within the SVG root element.
* @param {String} id - String with the element's new ID
*/
var getElem = supportsSelectors() ? function (id) {
  // querySelector lookup
  return svgroot_.querySelector('#' + id);
} : supportsXpath() ? function (id) {
  // xpath lookup
  return domdoc_.evaluate('svg:svg[@id="svgroot"]//svg:*[@id="' + id + '"]', domcontainer_, function () {
    return NS.SVG;
  }, 9, null).singleNodeValue;
} : function (id) {
  // jQuery lookup: twice as slow as xpath in FF
  return $$2(svgroot_).find('[id=' + id + ']')[0];
};

/**
* Assigns multiple attributes to an element.
* @param node - DOM element to apply new attribute values to
* @param {Object} attrs - Object with attribute keys/values
* @param {Number} suspendLength - Optional integer of milliseconds to suspend redraw
* @param {Boolean} unitCheck - Boolean to indicate the need to use svgedit.units.setUnitAttr
*/
var assignAttributes = function assignAttributes(node, attrs, suspendLength, unitCheck) {
  for (var i in attrs) {
    var ns = i.substr(0, 4) === 'xml:' ? NS.XML : i.substr(0, 6) === 'xlink:' ? NS.XLINK : null;

    if (ns) {
      node.setAttributeNS(ns, i, attrs[i]);
    } else if (!unitCheck) {
      node.setAttribute(i, attrs[i]);
    } else {
      setUnitAttr(node, i, attrs[i]);
    }
  }
};

/**
* Remove unneeded (default) attributes, makes resulting SVG smaller
* @param element - DOM element to clean up
*/
var cleanupElement = function cleanupElement(element) {
  var defaults = {
    'fill-opacity': 1,
    'stop-opacity': 1,
    opacity: 1,
    stroke: 'none',
    'stroke-dasharray': 'none',
    'stroke-linejoin': 'miter',
    'stroke-linecap': 'butt',
    'stroke-opacity': 1,
    'stroke-width': 1,
    rx: 0,
    ry: 0
  };

  if (element.nodeName === 'ellipse') {
    // Ellipse elements requires rx and ry attributes
    delete defaults.rx;
    delete defaults.ry;
  }

  for (var attr in defaults) {
    var val = defaults[attr];
    if (element.getAttribute(attr) === String(val)) {
      element.removeAttribute(attr);
    }
  }
};

// round value to for snapping
var snapToGrid = function snapToGrid(value) {
  var unit = editorContext_$1.getBaseUnit();
  var stepSize = editorContext_$1.getSnappingStep();
  if (unit !== 'px') {
    stepSize *= getTypeMap()[unit];
  }
  value = Math.round(value / stepSize) * stepSize;
  return value;
};

var regexEscape = function regexEscape(str, delimiter) {
  // From: http://phpjs.org/functions
  return String(str).replace(new RegExp('[.\\\\+*?\\[\\^\\]$(){}=!<>|:\\' + (delimiter || '') + '-]', 'g'), '\\$&');
};

/**
 * Prevents default browser click behaviour on the given element
 * @param img - The DOM element to prevent the click on
 */
var preventClickDefault = function preventClickDefault(img) {
  $$2(img).click(function (e) {
    e.preventDefault();
  });
};

/**
 * Create a clone of an element, updating its ID and its children's IDs when needed
 * @param {Element} el - DOM element to clone
 * @param {Function} getNextId - The getter of the next unique ID.
 * @returns {Element}
 */
var copyElem = function copyElem(el, getNextId) {
  // manually create a copy of the element
  var newEl = document.createElementNS(el.namespaceURI, el.nodeName);
  $$2.each(el.attributes, function (i, attr) {
    if (attr.localName !== '-moz-math-font-style') {
      newEl.setAttributeNS(attr.namespaceURI, attr.nodeName, attr.value);
    }
  });
  // set the copied element's new id
  newEl.removeAttribute('id');
  newEl.id = getNextId();

  // Opera's "d" value needs to be reset for Opera/Win/non-EN
  // Also needed for webkit (else does not keep curved segments on clone)
  if (isWebkit() && el.nodeName === 'path') {
    var fixedD = convertPath(el);
    newEl.setAttribute('d', fixedD);
  }

  // now create copies of all children
  $$2.each(el.childNodes, function (i, child) {
    switch (child.nodeType) {
      case 1:
        // element node
        newEl.append(copyElem(child, getNextId));
        break;
      case 3:
        // text node
        newEl.textContent = child.nodeValue;
        break;
      default:
        break;
    }
  });

  if ($$2(el).data('gsvg')) {
    $$2(newEl).data('gsvg', newEl.firstChild);
  } else if ($$2(el).data('symbol')) {
    var ref = $$2(el).data('symbol');
    $$2(newEl).data('ref', ref).data('symbol', ref);
  } else if (newEl.tagName === 'image') {
    preventClickDefault(newEl);
  }

  return newEl;
};

/* globals jQuery */
/**
 * Package: svgedit.contextmenu
 *
 * Licensed under the Apache License, Version 2
 *
 * Author: Adam Bender
 */
// Dependencies:
// 1) jQuery (for dom injection of context menus)

var $$3 = jQuery;

var contextMenuExtensions = {};
var hasCustomHandler = function hasCustomHandler(handlerKey) {
  return Boolean(contextMenuExtensions[handlerKey]);
};
var getCustomHandler = function getCustomHandler(handlerKey) {
  return contextMenuExtensions[handlerKey].action;
};
var injectExtendedContextMenuItemIntoDom = function injectExtendedContextMenuItemIntoDom(menuItem) {
  if (!Object.keys(contextMenuExtensions).length) {
    // all menuItems appear at the bottom of the menu in their own container.
    // if this is the first extension menu we need to add the separator.
    $$3('#cmenu_canvas').append("<li class='separator'>");
  }
  var shortcut = menuItem.shortcut || '';
  $$3('#cmenu_canvas').append("<li class='disabled'><a href='#" + menuItem.id + "'>" + menuItem.label + "<span class='shortcut'>" + shortcut + '</span></a></li>');
};

var injectExtendedContextMenuItemsIntoDom = function injectExtendedContextMenuItemsIntoDom() {
  for (var menuItem in contextMenuExtensions) {
    injectExtendedContextMenuItemIntoDom(contextMenuExtensions[menuItem]);
  }
};

// MIT License
// From: https://github.com/uupaa/dynamic-import-polyfill/blob/master/importModule.js

function toAbsoluteURL(url) {
  var a = document.createElement('a');
  a.setAttribute('href', url); // <a href="hoge.html">
  return a.cloneNode(false).href; // -> "http://example.com/hoge.html"
}

function addScriptAtts(script, atts) {
  ['id', 'class', 'type'].forEach(function (prop) {
    if (prop in atts) {
      script[prop] = atts[prop];
    }
  });
}

// Additions by Brett
var importSetGlobalDefault = function () {
  var _ref = asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(url, config) {
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            return _context.abrupt('return', importSetGlobal(url, _extends({}, config, { returnDefault: true })));

          case 1:
          case 'end':
            return _context.stop();
        }
      }
    }, _callee, this);
  }));

  return function importSetGlobalDefault(_x, _x2) {
    return _ref.apply(this, arguments);
  };
}();
var importSetGlobal = function () {
  var _ref3 = asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(url, _ref2) {
    var global = _ref2.global,
        returnDefault = _ref2.returnDefault;
    var modularVersion;
    return regeneratorRuntime.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            // Todo: Replace calls to this function with `import()` when supported
            modularVersion = !('svgEditor' in window) || !window.svgEditor || window.svgEditor.modules !== false;

            if (!modularVersion) {
              _context2.next = 3;
              break;
            }

            return _context2.abrupt('return', importModule(url, undefined, { returnDefault: returnDefault }));

          case 3:
            _context2.next = 5;
            return importScript(url);

          case 5:
            return _context2.abrupt('return', window[global]);

          case 6:
          case 'end':
            return _context2.stop();
        }
      }
    }, _callee2, this);
  }));

  return function importSetGlobal(_x3, _x4) {
    return _ref3.apply(this, arguments);
  };
}();
// Addition by Brett
function importScript(url) {
  var atts = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

  if (Array.isArray(url)) {
    return Promise.all(url.map(function (u) {
      return importScript(u, atts);
    }));
  }
  return new Promise(function (resolve, reject) {
    var script = document.createElement('script');
    var destructor = function destructor() {
      script.onerror = null;
      script.onload = null;
      script.remove();
      script.src = '';
    };
    script.defer = 'defer';
    addScriptAtts(script, atts);
    script.onerror = function () {
      reject(new Error('Failed to import: ' + url));
      destructor();
    };
    script.onload = function () {
      resolve();
      destructor();
    };
    script.src = url;

    document.head.append(script);
  });
}

function importModule(url) {
  var atts = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

  var _ref4 = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {},
      _ref4$returnDefault = _ref4.returnDefault,
      returnDefault = _ref4$returnDefault === undefined ? false : _ref4$returnDefault;

  if (Array.isArray(url)) {
    return Promise.all(url.map(function (u) {
      return importModule(u, atts);
    }));
  }
  return new Promise(function (resolve, reject) {
    var vector = '$importModule$' + Math.random().toString(32).slice(2);
    var script = document.createElement('script');
    var destructor = function destructor() {
      delete window[vector];
      script.onerror = null;
      script.onload = null;
      script.remove();
      URL.revokeObjectURL(script.src);
      script.src = '';
    };
    addScriptAtts(script, atts);
    script.defer = 'defer';
    script.type = 'module';
    script.onerror = function () {
      reject(new Error('Failed to import: ' + url));
      destructor();
    };
    script.onload = function () {
      resolve(window[vector]);
      destructor();
    };
    var absURL = toAbsoluteURL(url);
    var loader = 'import * as m from \'' + absURL.replace(/'/g, "\\'") + '\'; window.' + vector + ' = ' + (returnDefault ? 'm.default || ' : '') + 'm;'; // export Module
    var blob = new Blob([loader], { type: 'text/javascript' });
    script.src = URL.createObjectURL(blob);

    document.head.append(script);
  });
}

/* globals jQuery */

var $$4 = jQuery;

/**
 * This class encapsulates the concept of a layer in the drawing. It can be constructed with
 * an existing group element or, with three parameters, will create a new layer group element.
 *
 * Usage:
 * new Layer'name', group)          // Use the existing group for this layer.
 * new Layer('name', group, svgElem) // Create a new group and add it to the DOM after group.
 * new Layer('name', null, svgElem)  // Create a new group and add it to the DOM as the last layer.
 *
 * @param {string} name - Layer name
 * @param {SVGGElement|null} group - An existing SVG group element or null.
 *     If group and no svgElem, use group for this layer.
 *     If group and svgElem, create a new group element and insert it in the DOM after group.
 *     If no group and svgElem, create a new group element and insert it in the DOM as the last layer.
 * @param {SVGGElement=} svgElem - The SVG DOM element. If defined, use this to add
 *     a new layer to the document.
 */

var Layer = function () {
  function Layer(name, group, svgElem) {
    classCallCheck(this, Layer);

    this.name_ = name;
    this.group_ = svgElem ? null : group;

    if (svgElem) {
      // Create a group element with title and add it to the DOM.
      var svgdoc = svgElem.ownerDocument;
      this.group_ = svgdoc.createElementNS(NS.SVG, 'g');
      var layerTitle = svgdoc.createElementNS(NS.SVG, 'title');
      layerTitle.textContent = name;
      this.group_.append(layerTitle);
      if (group) {
        $$4(group).after(this.group_);
      } else {
        svgElem.append(this.group_);
      }
    }

    addLayerClass(this.group_);
    walkTree(this.group_, function (e) {
      e.setAttribute('style', 'pointer-events:inherit');
    });

    this.group_.setAttribute('style', svgElem ? 'pointer-events:all' : 'pointer-events:none');
  }

  /**
   * Get the layer's name.
   * @returns {string} The layer name
   */


  createClass(Layer, [{
    key: 'getName',
    value: function getName() {
      return this.name_;
    }

    /**
     * Get the group element for this layer.
     * @returns {SVGGElement} The layer SVG group
     */

  }, {
    key: 'getGroup',
    value: function getGroup() {
      return this.group_;
    }

    /**
     * Active this layer so it takes pointer events.
     */

  }, {
    key: 'activate',
    value: function activate() {
      this.group_.setAttribute('style', 'pointer-events:all');
    }

    /**
     * Deactive this layer so it does NOT take pointer events.
     */

  }, {
    key: 'deactivate',
    value: function deactivate() {
      this.group_.setAttribute('style', 'pointer-events:none');
    }

    /**
     * Set this layer visible or hidden based on 'visible' parameter.
     * @param {boolean} visible - If true, make visible; otherwise, hide it.
     */

  }, {
    key: 'setVisible',
    value: function setVisible(visible) {
      var expected = visible === undefined || visible ? 'inline' : 'none';
      var oldDisplay = this.group_.getAttribute('display');
      if (oldDisplay !== expected) {
        this.group_.setAttribute('display', expected);
      }
    }

    /**
     * Is this layer visible?
     * @returns {boolean} True if visible.
     */

  }, {
    key: 'isVisible',
    value: function isVisible() {
      return this.group_.getAttribute('display') !== 'none';
    }

    /**
     * Get layer opacity.
     * @returns {number} Opacity value.
     */

  }, {
    key: 'getOpacity',
    value: function getOpacity() {
      var opacity = this.group_.getAttribute('opacity');
      if (opacity === null || opacity === undefined) {
        return 1;
      }
      return parseFloat(opacity);
    }

    /**
     * Sets the opacity of this layer. If opacity is not a value between 0.0 and 1.0,
     * nothing happens.
     * @param {number} opacity - A float value in the range 0.0-1.0
     */

  }, {
    key: 'setOpacity',
    value: function setOpacity(opacity) {
      if (typeof opacity === 'number' && opacity >= 0.0 && opacity <= 1.0) {
        this.group_.setAttribute('opacity', opacity);
      }
    }

    /**
     * Append children to this layer.
     * @param {SVGGElement} children - The children to append to this layer.
     */

  }, {
    key: 'appendChildren',
    value: function appendChildren(children) {
      for (var i = 0; i < children.length; ++i) {
        this.group_.append(children[i]);
      }
    }
  }, {
    key: 'getTitleElement',
    value: function getTitleElement() {
      var len = this.group_.childNodes.length;
      for (var i = 0; i < len; ++i) {
        var child = this.group_.childNodes.item(i);
        if (child && child.tagName === 'title') {
          return child;
        }
      }
      return null;
    }

    /**
     * Set the name of this layer.
     * @param {string} name - The new name.
     * @param {svgedit.history.HistoryRecordingService} hrService - History recording service
     * @returns {string|null} The new name if changed; otherwise, null.
     */

  }, {
    key: 'setName',
    value: function setName(name, hrService) {
      var previousName = this.name_;
      name = toXml(name);
      // now change the underlying title element contents
      var title = this.getTitleElement();
      if (title) {
        $$4(title).empty();
        title.textContent = name;
        this.name_ = name;
        if (hrService) {
          hrService.changeElement(title, { '#text': previousName });
        }
        return this.name_;
      }
      return null;
    }

    /**
     * Remove this layer's group from the DOM. No more functions on group can be called after this.
     * @param {SVGGElement} children - The children to append to this layer.
     * @returns {SVGGElement} The layer SVG group that was just removed.
     */

  }, {
    key: 'removeGroup',
    value: function removeGroup() {
      var parent = this.group_.parentNode;
      var group = parent.removeChild(this.group_);
      this.group_ = undefined;
      return group;
    }
  }]);
  return Layer;
}();
/**
 * @property {string} CLASS_NAME - class attribute assigned to all layer groups.
 */


Layer.CLASS_NAME = 'layer';

/**
 * @property {RegExp} CLASS_REGEX - Used to test presence of class Layer.CLASS_NAME
 */
Layer.CLASS_REGEX = new RegExp('(\\s|^)' + Layer.CLASS_NAME + '(\\s|$)');

/**
 * Add class Layer.CLASS_NAME to the element (usually class='layer').
 *
 * Parameters:
 * @param {SVGGElement} elem - The SVG element to update
 */
function addLayerClass(elem) {
  var classes = elem.getAttribute('class');
  if (classes === null || classes === undefined || !classes.length) {
    elem.setAttribute('class', Layer.CLASS_NAME);
  } else if (!Layer.CLASS_REGEX.test(classes)) {
    elem.setAttribute('class', classes + ' ' + Layer.CLASS_NAME);
  }
}

/**
 * Package: svgedit.history
 *
 * Licensed under the MIT License
 *
 * Copyright(c) 2016 Flint O'Brien
 */

/**
 * History recording service.
 *
 * A self-contained service interface for recording history. Once injected, no other dependencies
 * or globals are required (example: UndoManager, command types, etc.). Easy to mock for unit tests.
 * Built on top of history classes in history.js.
 *
 * There is a simple start/end interface for batch commands.
 *
 * HistoryRecordingService.NO_HISTORY is a singleton that can be passed in to functions
 * that record history. This helps when the caller requires that no history be recorded.
 *
 * Usage:
 * The following will record history: insert, batch, insert.
 * ```
 * hrService = new svgedit.history.HistoryRecordingService(this.undoMgr);
 * hrService.insertElement(elem, text);         // add simple command to history.
 * hrService.startBatchCommand('create two elements');
 * hrService.changeElement(elem, attrs, text);  // add to batchCommand
 * hrService.changeElement(elem, attrs2, text); // add to batchCommand
 * hrService.endBatchCommand();                  // add batch command with two change commands to history.
 * hrService.insertElement(elem, text);         // add simple command to history.
 * ```
 *
 * Note that all functions return this, so commands can be chained, like so:
 *
 * ```
 * hrService
 *   .startBatchCommand('create two elements')
 *   .insertElement(elem, text)
 *   .changeElement(elem, attrs, text)
 *   .endBatchCommand();
 * ```
 *
 * @param {svgedit.history.UndoManager} undoManager - The undo manager.
 *     A value of null is valid for cases where no history recording is required.
 *     See singleton: HistoryRecordingService.NO_HISTORY
 */

var HistoryRecordingService = function () {
  function HistoryRecordingService(undoManager) {
    classCallCheck(this, HistoryRecordingService);

    this.undoManager_ = undoManager;
    this.currentBatchCommand_ = null;
    this.batchCommandStack_ = [];
  }

  /**
   * Start a batch command so multiple commands can recorded as a single history command.
   * Requires a corresponding call to endBatchCommand. Start and end commands can be nested.
   *
   * @param {string} text - Optional string describing the batch command.
   * @returns {svgedit.history.HistoryRecordingService}
   */


  createClass(HistoryRecordingService, [{
    key: 'startBatchCommand',
    value: function startBatchCommand(text) {
      if (!this.undoManager_) {
        return this;
      }
      this.currentBatchCommand_ = new BatchCommand(text);
      this.batchCommandStack_.push(this.currentBatchCommand_);
      return this;
    }

    /**
     * End a batch command and add it to the history or a parent batch command.
     * @returns {svgedit.history.HistoryRecordingService}
     */

  }, {
    key: 'endBatchCommand',
    value: function endBatchCommand() {
      if (!this.undoManager_) {
        return this;
      }
      if (this.currentBatchCommand_) {
        var batchCommand = this.currentBatchCommand_;
        this.batchCommandStack_.pop();
        var length = this.batchCommandStack_.length;

        this.currentBatchCommand_ = length ? this.batchCommandStack_[length - 1] : null;
        this.addCommand_(batchCommand);
      }
      return this;
    }

    /**
     * Add a MoveElementCommand to the history or current batch command
     * @param {Element} elem - The DOM element that was moved
     * @param {Element} oldNextSibling - The element's next sibling before it was moved
     * @param {Element} oldParent - The element's parent before it was moved
     * @param {string} [text] - An optional string visible to user related to this change
     * @returns {svgedit.history.HistoryRecordingService}
     */

  }, {
    key: 'moveElement',
    value: function moveElement(elem, oldNextSibling, oldParent, text) {
      if (!this.undoManager_) {
        return this;
      }
      this.addCommand_(new MoveElementCommand(elem, oldNextSibling, oldParent, text));
      return this;
    }

    /**
     * Add an InsertElementCommand to the history or current batch command
     * @param {Element} elem - The DOM element that was added
     * @param {string} [text] - An optional string visible to user related to this change
     * @returns {svgedit.history.HistoryRecordingService}
     */

  }, {
    key: 'insertElement',
    value: function insertElement(elem, text) {
      if (!this.undoManager_) {
        return this;
      }
      this.addCommand_(new InsertElementCommand(elem, text));
      return this;
    }

    /**
     * Add a RemoveElementCommand to the history or current batch command
     * @param {Element} elem - The DOM element that was removed
     * @param {Element} oldNextSibling - The element's next sibling before it was removed
     * @param {Element} oldParent - The element's parent before it was removed
     * @param {string} [text] - An optional string visible to user related to this change
     * @returns {svgedit.history.HistoryRecordingService}
     */

  }, {
    key: 'removeElement',
    value: function removeElement(elem, oldNextSibling, oldParent, text) {
      if (!this.undoManager_) {
        return this;
      }
      this.addCommand_(new RemoveElementCommand(elem, oldNextSibling, oldParent, text));
      return this;
    }

    /**
     * Add a ChangeElementCommand to the history or current batch command
     * @param {Element} elem - The DOM element that was changed
     * @param {Object} attrs - An object with the attributes to be changed and the values they had *before* the change
     * @param {string} [text] - An optional string visible to user related to this change
     * @returns {svgedit.history.HistoryRecordingService}
     */

  }, {
    key: 'changeElement',
    value: function changeElement(elem, attrs, text) {
      if (!this.undoManager_) {
        return this;
      }
      this.addCommand_(new ChangeElementCommand(elem, attrs, text));
      return this;
    }

    /**
     * Private function to add a command to the history or current batch command.
     * @param cmd
     * @returns {svgedit.history.HistoryRecordingService}
     * @private
     */

  }, {
    key: 'addCommand_',
    value: function addCommand_(cmd) {
      if (!this.undoManager_) {
        return this;
      }
      if (this.currentBatchCommand_) {
        this.currentBatchCommand_.addSubCommand(cmd);
      } else {
        this.undoManager_.addCommandToHistory(cmd);
      }
    }
  }]);
  return HistoryRecordingService;
}();
/**
 * @property {HistoryRecordingService} NO_HISTORY - Singleton that can be passed to functions that record history, but the caller requires that no history be recorded.
 */


HistoryRecordingService.NO_HISTORY = new HistoryRecordingService();

/* globals jQuery */

var $$5 = jQuery;

var visElems$1 = 'a,circle,ellipse,foreignObject,g,image,line,path,polygon,polyline,rect,svg,text,tspan,use'.split(',');

var RandomizeModes = {
  LET_DOCUMENT_DECIDE: 0,
  ALWAYS_RANDOMIZE: 1,
  NEVER_RANDOMIZE: 2
};
var randIds = RandomizeModes.LET_DOCUMENT_DECIDE;
// Array with current disabled elements (for in-group editing)
var disabledElems = [];

/**
 * Get a HistoryRecordingService.
 * @param {svgedit.history.HistoryRecordingService=} hrService - if exists, return it instead of creating a new service.
 * @returns {svgedit.history.HistoryRecordingService}
 */
function historyRecordingService(hrService) {
  return hrService || new HistoryRecordingService(canvas_.undoMgr);
}

/**
 * Find the layer name in a group element.
 * @param group The group element to search in.
 * @returns {string} The layer name or empty string.
 */
function findLayerNameInGroup(group) {
  return $$5('title', group).text() || (isOpera() && group.querySelectorAll
  // Hack for Opera 10.60
  ? $$5(group.querySelectorAll('title')).text() : '');
}

/**
 * Given a set of names, return a new unique name.
 * @param {Array.<string>} existingLayerNames - Existing layer names.
 * @returns {string} - The new name.
 */
function getNewLayerName(existingLayerNames) {
  var i = 1;
  // TODO(codedread): What about internationalization of "Layer"?
  while (existingLayerNames.includes('Layer ' + i)) {
    i++;
  }
  return 'Layer ' + i;
}

/**
 * This class encapsulates the concept of a SVG-edit drawing
 * @param {SVGSVGElement} svgElem - The SVG DOM Element that this JS object
 *     encapsulates.  If the svgElem has a se:nonce attribute on it, then
 *     IDs will use the nonce as they are generated.
 * @param {String} [optIdPrefix=svg_] - The ID prefix to use.
 */
var Drawing = function () {
  function Drawing(svgElem, optIdPrefix) {
    classCallCheck(this, Drawing);

    if (!svgElem || !svgElem.tagName || !svgElem.namespaceURI || svgElem.tagName !== 'svg' || svgElem.namespaceURI !== NS.SVG) {
      throw new Error('Error: svgedit.draw.Drawing instance initialized without a <svg> element');
    }

    /**
    * The SVG DOM Element that represents this drawing.
    * @type {SVGSVGElement}
    */
    this.svgElem_ = svgElem;

    /**
    * The latest object number used in this drawing.
    * @type {number}
    */
    this.obj_num = 0;

    /**
    * The prefix to prepend to each element id in the drawing.
    * @type {String}
    */
    this.idPrefix = optIdPrefix || 'svg_';

    /**
    * An array of released element ids to immediately reuse.
    * @type {Array.<number>}
    */
    this.releasedNums = [];

    /**
    * The z-ordered array of Layer objects. Each layer has a name
    * and group element.
    * The first layer is the one at the bottom of the rendering.
    * @type {Array.<Layer>}
    */
    this.all_layers = [];

    /**
    * Map of all_layers by name.
    *
    * Note: Layers are ordered, but referenced externally by name; so, we need both container
    * types depending on which function is called (i.e. all_layers and layer_map).
    *
    * @type {Object.<string, Layer>}
    */
    this.layer_map = {};

    /**
    * The current layer being used.
    * @type {Layer}
    */
    this.current_layer = null;

    /**
    * The nonce to use to uniquely identify elements across drawings.
    * @type {!String}
    */
    this.nonce_ = '';
    var n = this.svgElem_.getAttributeNS(NS.SE, 'nonce');
    // If already set in the DOM, use the nonce throughout the document
    // else, if randomizeIds(true) has been called, create and set the nonce.
    if (!!n && randIds !== RandomizeModes.NEVER_RANDOMIZE) {
      this.nonce_ = n;
    } else if (randIds === RandomizeModes.ALWAYS_RANDOMIZE) {
      this.setNonce(Math.floor(Math.random() * 100001));
    }
  }

  /**
   * @param {string} id Element ID to retrieve
   * @returns {Element} SVG element within the root SVGSVGElement
  */


  createClass(Drawing, [{
    key: 'getElem_',
    value: function getElem_(id) {
      if (this.svgElem_.querySelector) {
        // querySelector lookup
        return this.svgElem_.querySelector('#' + id);
      }
      // jQuery lookup: twice as slow as xpath in FF
      return $$5(this.svgElem_).find('[id=' + id + ']')[0];
    }

    /**
     * @returns {SVGSVGElement}
     */

  }, {
    key: 'getSvgElem',
    value: function getSvgElem() {
      return this.svgElem_;
    }

    /**
     * @returns {!string|number} The previously set nonce
     */

  }, {
    key: 'getNonce',
    value: function getNonce() {
      return this.nonce_;
    }

    /**
     * @param {!string|number} n The nonce to set
     */

  }, {
    key: 'setNonce',
    value: function setNonce(n) {
      this.svgElem_.setAttributeNS(NS.XMLNS, 'xmlns:se', NS.SE);
      this.svgElem_.setAttributeNS(NS.SE, 'se:nonce', n);
      this.nonce_ = n;
    }

    /**
     * Clears any previously set nonce
     */

  }, {
    key: 'clearNonce',
    value: function clearNonce() {
      // We deliberately leave any se:nonce attributes alone,
      // we just don't use it to randomize ids.
      this.nonce_ = '';
    }

    /**
     * Returns the latest object id as a string.
     * @return {String} The latest object Id.
     */

  }, {
    key: 'getId',
    value: function getId() {
      return this.nonce_ ? this.idPrefix + this.nonce_ + '_' + this.obj_num : this.idPrefix + this.obj_num;
    }

    /**
     * Returns the next object Id as a string.
     * @return {String} The next object Id to use.
     */

  }, {
    key: 'getNextId',
    value: function getNextId() {
      var oldObjNum = this.obj_num;
      var restoreOldObjNum = false;

      // If there are any released numbers in the release stack,
      // use the last one instead of the next obj_num.
      // We need to temporarily use obj_num as that is what getId() depends on.
      if (this.releasedNums.length > 0) {
        this.obj_num = this.releasedNums.pop();
        restoreOldObjNum = true;
      } else {
        // If we are not using a released id, then increment the obj_num.
        this.obj_num++;
      }

      // Ensure the ID does not exist.
      var id = this.getId();
      while (this.getElem_(id)) {
        if (restoreOldObjNum) {
          this.obj_num = oldObjNum;
          restoreOldObjNum = false;
        }
        this.obj_num++;
        id = this.getId();
      }
      // Restore the old object number if required.
      if (restoreOldObjNum) {
        this.obj_num = oldObjNum;
      }
      return id;
    }

    /**
     * Releases the object Id, letting it be used as the next id in getNextId().
     * This method DOES NOT remove any elements from the DOM, it is expected
     * that client code will do this.
     * @param {string} id - The id to release.
     * @returns {boolean} True if the id was valid to be released, false otherwise.
    */

  }, {
    key: 'releaseId',
    value: function releaseId(id) {
      // confirm if this is a valid id for this Document, else return false
      var front = this.idPrefix + (this.nonce_ ? this.nonce_ + '_' : '');
      if (typeof id !== 'string' || !id.startsWith(front)) {
        return false;
      }
      // extract the obj_num of this id
      var num = parseInt(id.substr(front.length), 10);

      // if we didn't get a positive number or we already released this number
      // then return false.
      if (typeof num !== 'number' || num <= 0 || this.releasedNums.includes(num)) {
        return false;
      }

      // push the released number into the released queue
      this.releasedNums.push(num);

      return true;
    }

    /**
     * Returns the number of layers in the current drawing.
     * @returns {integer} The number of layers in the current drawing.
    */

  }, {
    key: 'getNumLayers',
    value: function getNumLayers() {
      return this.all_layers.length;
    }

    /**
     * Check if layer with given name already exists
     * @param {string} name - The layer name to check
    */

  }, {
    key: 'hasLayer',
    value: function hasLayer(name) {
      return this.layer_map[name] !== undefined;
    }

    /**
     * Returns the name of the ith layer. If the index is out of range, an empty string is returned.
     * @param {integer} i - The zero-based index of the layer you are querying.
     * @returns {string} The name of the ith layer (or the empty string if none found)
    */

  }, {
    key: 'getLayerName',
    value: function getLayerName(i) {
      return i >= 0 && i < this.getNumLayers() ? this.all_layers[i].getName() : '';
    }

    /**
     * @returns {SVGGElement} The SVGGElement representing the current layer.
     */

  }, {
    key: 'getCurrentLayer',
    value: function getCurrentLayer() {
      return this.current_layer ? this.current_layer.getGroup() : null;
    }

    /**
     * Get a layer by name.
     * @returns {SVGGElement} The SVGGElement representing the named layer or null.
     */

  }, {
    key: 'getLayerByName',
    value: function getLayerByName(name) {
      var layer = this.layer_map[name];
      return layer ? layer.getGroup() : null;
    }

    /**
     * Returns the name of the currently selected layer. If an error occurs, an empty string
     * is returned.
     * @returns {string} The name of the currently active layer (or the empty string if none found).
    */

  }, {
    key: 'getCurrentLayerName',
    value: function getCurrentLayerName() {
      return this.current_layer ? this.current_layer.getName() : '';
    }

    /**
     * Set the current layer's name.
     * @param {string} name - The new name.
     * @param {svgedit.history.HistoryRecordingService} hrService - History recording service
     * @returns {string|null} The new name if changed; otherwise, null.
     */

  }, {
    key: 'setCurrentLayerName',
    value: function setCurrentLayerName(name, hrService) {
      var finalName = null;
      if (this.current_layer) {
        var oldName = this.current_layer.getName();
        finalName = this.current_layer.setName(name, hrService);
        if (finalName) {
          delete this.layer_map[oldName];
          this.layer_map[finalName] = this.current_layer;
        }
      }
      return finalName;
    }

    /**
     * Set the current layer's position.
     * @param {number} newpos - The zero-based index of the new position of the layer. Range should be 0 to layers-1
     * @returns {Object} If the name was changed, returns {title:SVGGElement, previousName:string}; otherwise null.
     */

  }, {
    key: 'setCurrentLayerPosition',
    value: function setCurrentLayerPosition(newpos) {
      var layerCount = this.getNumLayers();
      if (!this.current_layer || newpos < 0 || newpos >= layerCount) {
        return null;
      }

      var oldpos = void 0;
      for (oldpos = 0; oldpos < layerCount; ++oldpos) {
        if (this.all_layers[oldpos] === this.current_layer) {
          break;
        }
      }
      // some unknown error condition (current_layer not in all_layers)
      if (oldpos === layerCount) {
        return null;
      }

      if (oldpos !== newpos) {
        // if our new position is below us, we need to insert before the node after newpos
        var currentGroup = this.current_layer.getGroup();
        var oldNextSibling = currentGroup.nextSibling;

        var refGroup = null;
        if (newpos > oldpos) {
          if (newpos < layerCount - 1) {
            refGroup = this.all_layers[newpos + 1].getGroup();
          }
          // if our new position is above us, we need to insert before the node at newpos
        } else {
          refGroup = this.all_layers[newpos].getGroup();
        }
        this.svgElem_.insertBefore(currentGroup, refGroup); // Ok to replace with `refGroup.before(currentGroup);`?

        this.identifyLayers();
        this.setCurrentLayer(this.getLayerName(newpos));

        return {
          currentGroup: currentGroup,
          oldNextSibling: oldNextSibling
        };
      }
      return null;
    }
  }, {
    key: 'mergeLayer',
    value: function mergeLayer(hrService) {
      var currentGroup = this.current_layer.getGroup();
      var prevGroup = $$5(currentGroup).prev()[0];
      if (!prevGroup) {
        return;
      }

      hrService.startBatchCommand('Merge Layer');

      var layerNextSibling = currentGroup.nextSibling;
      hrService.removeElement(currentGroup, layerNextSibling, this.svgElem_);

      while (currentGroup.firstChild) {
        var child = currentGroup.firstChild;
        if (child.localName === 'title') {
          hrService.removeElement(child, child.nextSibling, currentGroup);
          child.remove();
          continue;
        }
        var oldNextSibling = child.nextSibling;
        prevGroup.append(child);
        hrService.moveElement(child, oldNextSibling, currentGroup);
      }

      // Remove current layer's group
      this.current_layer.removeGroup();
      // Remove the current layer and set the previous layer as the new current layer
      var index = this.all_layers.indexOf(this.current_layer);
      if (index > 0) {
        var _name = this.current_layer.getName();
        this.current_layer = this.all_layers[index - 1];
        this.all_layers.splice(index, 1);
        delete this.layer_map[_name];
      }

      hrService.endBatchCommand();
    }
  }, {
    key: 'mergeAllLayers',
    value: function mergeAllLayers(hrService) {
      // Set the current layer to the last layer.
      this.current_layer = this.all_layers[this.all_layers.length - 1];

      hrService.startBatchCommand('Merge all Layers');
      while (this.all_layers.length > 1) {
        this.mergeLayer(hrService);
      }
      hrService.endBatchCommand();
    }

    /**
     * Sets the current layer. If the name is not a valid layer name, then this
     * function returns false. Otherwise it returns true. This is not an
     * undo-able action.
     * @param {string} name - The name of the layer you want to switch to.
     * @returns {boolean} true if the current layer was switched, otherwise false
     */

  }, {
    key: 'setCurrentLayer',
    value: function setCurrentLayer(name) {
      var layer = this.layer_map[name];
      if (layer) {
        if (this.current_layer) {
          this.current_layer.deactivate();
        }
        this.current_layer = layer;
        this.current_layer.activate();
        return true;
      }
      return false;
    }

    /**
     * Deletes the current layer from the drawing and then clears the selection.
     * This function then calls the 'changed' handler.  This is an undoable action.
     * @returns {SVGGElement} The SVGGElement of the layer removed or null.
     */

  }, {
    key: 'deleteCurrentLayer',
    value: function deleteCurrentLayer() {
      if (this.current_layer && this.getNumLayers() > 1) {
        var oldLayerGroup = this.current_layer.removeGroup();
        this.identifyLayers();
        return oldLayerGroup;
      }
      return null;
    }

    /**
     * Updates layer system and sets the current layer to the
     * top-most layer (last <g> child of this drawing).
    */

  }, {
    key: 'identifyLayers',
    value: function identifyLayers() {
      this.all_layers = [];
      this.layer_map = {};
      var numchildren = this.svgElem_.childNodes.length;
      // loop through all children of SVG element
      var orphans = [],
          layernames = [];
      var layer = null;
      var childgroups = false;
      for (var i = 0; i < numchildren; ++i) {
        var child = this.svgElem_.childNodes.item(i);
        // for each g, find its layer name
        if (child && child.nodeType === 1) {
          if (child.tagName === 'g') {
            childgroups = true;
            var _name2 = findLayerNameInGroup(child);
            if (_name2) {
              layernames.push(_name2);
              layer = new Layer(_name2, child);
              this.all_layers.push(layer);
              this.layer_map[_name2] = layer;
            } else {
              // if group did not have a name, it is an orphan
              orphans.push(child);
            }
          } else if (visElems$1.includes(child.nodeName)) {
            // Child is "visible" (i.e. not a <title> or <defs> element), so it is an orphan
            orphans.push(child);
          }
        }
      }

      // If orphans or no layers found, create a new layer and add all the orphans to it
      if (orphans.length > 0 || !childgroups) {
        layer = new Layer(getNewLayerName(layernames), null, this.svgElem_);
        layer.appendChildren(orphans);
        this.all_layers.push(layer);
        this.layer_map[name] = layer;
      } else {
        layer.activate();
      }
      this.current_layer = layer;
    }

    /**
     * Creates a new top-level layer in the drawing with the given name and
     * makes it the current layer.
     * @param {string} name - The given name. If the layer name exists, a new name will be generated.
     * @param {svgedit.history.HistoryRecordingService} hrService - History recording service
     * @returns {SVGGElement} The SVGGElement of the new layer, which is
     *     also the current layer of this drawing.
    */

  }, {
    key: 'createLayer',
    value: function createLayer(name, hrService) {
      if (this.current_layer) {
        this.current_layer.deactivate();
      }
      // Check for duplicate name.
      if (name === undefined || name === null || name === '' || this.layer_map[name]) {
        name = getNewLayerName(Object.keys(this.layer_map));
      }

      // Crate new layer and add to DOM as last layer
      var layer = new Layer(name, null, this.svgElem_);
      // Like to assume hrService exists, but this is backwards compatible with old version of createLayer.
      if (hrService) {
        hrService.startBatchCommand('Create Layer');
        hrService.insertElement(layer.getGroup());
        hrService.endBatchCommand();
      }

      this.all_layers.push(layer);
      this.layer_map[name] = layer;
      this.current_layer = layer;
      return layer.getGroup();
    }

    /**
     * Creates a copy of the current layer with the given name and makes it the current layer.
     * @param {string} name - The given name. If the layer name exists, a new name will be generated.
     * @param {svgedit.history.HistoryRecordingService} hrService - History recording service
     * @returns {SVGGElement} The SVGGElement of the new layer, which is
     *     also the current layer of this drawing.
    */

  }, {
    key: 'cloneLayer',
    value: function cloneLayer(name, hrService) {
      if (!this.current_layer) {
        return null;
      }
      this.current_layer.deactivate();
      // Check for duplicate name.
      if (name === undefined || name === null || name === '' || this.layer_map[name]) {
        name = getNewLayerName(Object.keys(this.layer_map));
      }

      // Create new group and add to DOM just after current_layer
      var currentGroup = this.current_layer.getGroup();
      var layer = new Layer(name, currentGroup, this.svgElem_);
      var group = layer.getGroup();

      // Clone children
      var children = currentGroup.childNodes;
      for (var _index = 0; _index < children.length; _index++) {
        var ch = children[_index];
        if (ch.localName === 'title') {
          continue;
        }
        group.append(this.copyElem(ch));
      }

      if (hrService) {
        hrService.startBatchCommand('Duplicate Layer');
        hrService.insertElement(group);
        hrService.endBatchCommand();
      }

      // Update layer containers and current_layer.
      var index = this.all_layers.indexOf(this.current_layer);
      if (index >= 0) {
        this.all_layers.splice(index + 1, 0, layer);
      } else {
        this.all_layers.push(layer);
      }
      this.layer_map[name] = layer;
      this.current_layer = layer;
      return group;
    }

    /**
     * Returns whether the layer is visible.  If the layer name is not valid,
     * then this function returns false.
     * @param {string} layername - The name of the layer which you want to query.
     * @returns {boolean} The visibility state of the layer, or false if the layer name was invalid.
    */

  }, {
    key: 'getLayerVisibility',
    value: function getLayerVisibility(layername) {
      var layer = this.layer_map[layername];
      return layer ? layer.isVisible() : false;
    }

    /**
     * Sets the visibility of the layer. If the layer name is not valid, this
     * function returns false, otherwise it returns true. This is an
     * undo-able action.
     * @param {string} layername - The name of the layer to change the visibility
     * @param {boolean} bVisible - Whether the layer should be visible
     * @returns {?SVGGElement} The SVGGElement representing the layer if the
     *   layername was valid, otherwise null.
    */

  }, {
    key: 'setLayerVisibility',
    value: function setLayerVisibility(layername, bVisible) {
      if (typeof bVisible !== 'boolean') {
        return null;
      }
      var layer = this.layer_map[layername];
      if (!layer) {
        return null;
      }
      layer.setVisible(bVisible);
      return layer.getGroup();
    }

    /**
     * Returns the opacity of the given layer.  If the input name is not a layer, null is returned.
     * @param {string} layername - name of the layer on which to get the opacity
     * @returns {?number} The opacity value of the given layer.  This will be a value between 0.0 and 1.0, or null
     * if layername is not a valid layer
    */

  }, {
    key: 'getLayerOpacity',
    value: function getLayerOpacity(layername) {
      var layer = this.layer_map[layername];
      if (!layer) {
        return null;
      }
      return layer.getOpacity();
    }

    /**
     * Sets the opacity of the given layer.  If the input name is not a layer,
     * nothing happens. If opacity is not a value between 0.0 and 1.0, then
     * nothing happens.
     * @param {string} layername - Name of the layer on which to set the opacity
     * @param {number} opacity - A float value in the range 0.0-1.0
    */

  }, {
    key: 'setLayerOpacity',
    value: function setLayerOpacity(layername, opacity) {
      if (typeof opacity !== 'number' || opacity < 0.0 || opacity > 1.0) {
        return;
      }
      var layer = this.layer_map[layername];
      if (layer) {
        layer.setOpacity(opacity);
      }
    }

    /**
     * Create a clone of an element, updating its ID and its children's IDs when needed
     * @param {Element} el - DOM element to clone
     * @returns {Element}
     */

  }, {
    key: 'copyElem',
    value: function copyElem$$1(el) {
      var self = this;
      var getNextIdClosure = function getNextIdClosure() {
        return self.getNextId();
      };
      return copyElem(el, getNextIdClosure);
    }
  }]);
  return Drawing;
}();

/**
 * Called to ensure that drawings will or will not have randomized ids.
 * The currentDrawing will have its nonce set if it doesn't already.
 * @param {boolean} enableRandomization - flag indicating if documents should have randomized ids
 * @param {svgedit.draw.Drawing} currentDrawing
 */
var randomizeIds = function randomizeIds(enableRandomization, currentDrawing) {
  randIds = enableRandomization === false ? RandomizeModes.NEVER_RANDOMIZE : RandomizeModes.ALWAYS_RANDOMIZE;

  if (randIds === RandomizeModes.ALWAYS_RANDOMIZE && !currentDrawing.getNonce()) {
    currentDrawing.setNonce(Math.floor(Math.random() * 100001));
  } else if (randIds === RandomizeModes.NEVER_RANDOMIZE && currentDrawing.getNonce()) {
    currentDrawing.clearNonce();
  }
};

// Layer API Functions

/**
* Group: Layers
*/

var canvas_ = void 0;
var init$3 = function init(canvas) {
  canvas_ = canvas;
};

// Updates layer system
var identifyLayers = function identifyLayers() {
  leaveContext();
  canvas_.getCurrentDrawing().identifyLayers();
};

/**
* Creates a new top-level layer in the drawing with the given name, sets the current layer
* to it, and then clears the selection. This function then calls the 'changed' handler.
* This is an undoable action.
* @param name - The given name
* @param hrService
*/
var createLayer = function createLayer(name, hrService) {
  var newLayer = canvas_.getCurrentDrawing().createLayer(name, historyRecordingService(hrService));
  canvas_.clearSelection();
  canvas_.call('changed', [newLayer]);
};

/**
 * Creates a new top-level layer in the drawing with the given name, copies all the current layer's contents
 * to it, and then clears the selection. This function then calls the 'changed' handler.
 * This is an undoable action.
 * @param {string} name - The given name. If the layer name exists, a new name will be generated.
 * @param {svgedit.history.HistoryRecordingService} hrService - History recording service
 */
var cloneLayer = function cloneLayer(name, hrService) {
  // Clone the current layer and make the cloned layer the new current layer
  var newLayer = canvas_.getCurrentDrawing().cloneLayer(name, historyRecordingService(hrService));

  canvas_.clearSelection();
  leaveContext();
  canvas_.call('changed', [newLayer]);
};

/**
* Deletes the current layer from the drawing and then clears the selection. This function
* then calls the 'changed' handler. This is an undoable action.
*/
var deleteCurrentLayer = function deleteCurrentLayer() {
  var currentLayer = canvas_.getCurrentDrawing().getCurrentLayer();
  var _currentLayer = currentLayer,
      nextSibling = _currentLayer.nextSibling;

  var parent = currentLayer.parentNode;
  currentLayer = canvas_.getCurrentDrawing().deleteCurrentLayer();
  if (currentLayer) {
    var batchCmd = new BatchCommand('Delete Layer');
    // store in our Undo History
    batchCmd.addSubCommand(new RemoveElementCommand(currentLayer, nextSibling, parent));
    canvas_.addCommandToHistory(batchCmd);
    canvas_.clearSelection();
    canvas_.call('changed', [parent]);
    return true;
  }
  return false;
};

/**
* Sets the current layer. If the name is not a valid layer name, then this function returns
* false. Otherwise it returns true. This is not an undo-able action.
* @param name - The name of the layer you want to switch to.
*
* @returns true if the current layer was switched, otherwise false
*/
var setCurrentLayer = function setCurrentLayer(name) {
  var result = canvas_.getCurrentDrawing().setCurrentLayer(toXml(name));
  if (result) {
    canvas_.clearSelection();
  }
  return result;
};

/**
* Renames the current layer. If the layer name is not valid (i.e. unique), then this function
* does nothing and returns false, otherwise it returns true. This is an undo-able action.
*
* @param newname - the new name you want to give the current layer. This name must be unique
* among all layer names.
* @returns {Boolean} Whether the rename succeeded
*/
var renameCurrentLayer = function renameCurrentLayer(newname) {
  var drawing = canvas_.getCurrentDrawing();
  var layer = drawing.getCurrentLayer();
  if (layer) {
    var result = drawing.setCurrentLayerName(newname, historyRecordingService());
    if (result) {
      canvas_.call('changed', [layer]);
      return true;
    }
  }
  return false;
};

/**
* Changes the position of the current layer to the new value. If the new index is not valid,
* this function does nothing and returns false, otherwise it returns true. This is an
* undo-able action.
* @param newpos - The zero-based index of the new position of the layer. This should be between
* 0 and (number of layers - 1)
*
* @returns {Boolean} true if the current layer position was changed, false otherwise.
*/
var setCurrentLayerPosition = function setCurrentLayerPosition(newpos) {
  var drawing = canvas_.getCurrentDrawing();
  var result = drawing.setCurrentLayerPosition(newpos);
  if (result) {
    canvas_.addCommandToHistory(new MoveElementCommand(result.currentGroup, result.oldNextSibling, canvas_.getSVGContent()));
    return true;
  }
  return false;
};

/**
* Sets the visibility of the layer. If the layer name is not valid, this function return
* false, otherwise it returns true. This is an undo-able action.
* @param layername - The name of the layer to change the visibility
* @param {Boolean} bVisible - Whether the layer should be visible
* @returns {Boolean} true if the layer's visibility was set, false otherwise
*/
var setLayerVisibility = function setLayerVisibility(layername, bVisible) {
  var drawing = canvas_.getCurrentDrawing();
  var prevVisibility = drawing.getLayerVisibility(layername);
  var layer = drawing.setLayerVisibility(layername, bVisible);
  if (layer) {
    var oldDisplay = prevVisibility ? 'inline' : 'none';
    canvas_.addCommandToHistory(new ChangeElementCommand(layer, { display: oldDisplay }, 'Layer Visibility'));
  } else {
    return false;
  }

  if (layer === drawing.getCurrentLayer()) {
    canvas_.clearSelection();
    canvas_.pathActions.clear();
  }
  // call('changed', [selected]);
  return true;
};

/**
* Moves the selected elements to layername. If the name is not a valid layer name, then false
* is returned. Otherwise it returns true. This is an undo-able action.
*
* @param layername - The name of the layer you want to which you want to move the selected elements
* @returns {Boolean} Whether the selected elements were moved to the layer.
*/
var moveSelectedToLayer = function moveSelectedToLayer(layername) {
  // find the layer
  var drawing = canvas_.getCurrentDrawing();
  var layer = drawing.getLayerByName(layername);
  if (!layer) {
    return false;
  }

  var batchCmd = new BatchCommand('Move Elements to Layer');

  // loop for each selected element and move it
  var selElems = canvas_.getSelectedElements();
  var i = selElems.length;
  while (i--) {
    var elem = selElems[i];
    if (!elem) {
      continue;
    }
    var oldNextSibling = elem.nextSibling;
    // TODO: this is pretty brittle!
    var oldLayer = elem.parentNode;
    layer.append(elem);
    batchCmd.addSubCommand(new MoveElementCommand(elem, oldNextSibling, oldLayer));
  }

  canvas_.addCommandToHistory(batchCmd);

  return true;
};

var mergeLayer = function mergeLayer(hrService) {
  canvas_.getCurrentDrawing().mergeLayer(historyRecordingService(hrService));
  canvas_.clearSelection();
  leaveContext();
  canvas_.changeSvgcontent();
};

var mergeAllLayers = function mergeAllLayers(hrService) {
  canvas_.getCurrentDrawing().mergeAllLayers(historyRecordingService(hrService));
  canvas_.clearSelection();
  leaveContext();
  canvas_.changeSvgcontent();
};

// Return from a group context to the regular kind, make any previously
// disabled elements enabled again
var leaveContext = function leaveContext() {
  var len = disabledElems.length;
  if (len) {
    for (var i = 0; i < len; i++) {
      var elem = disabledElems[i];
      var orig = canvas_.elData(elem, 'orig_opac');
      if (orig !== 1) {
        elem.setAttribute('opacity', orig);
      } else {
        elem.removeAttribute('opacity');
      }
      elem.setAttribute('style', 'pointer-events: inherit');
    }
    disabledElems = [];
    canvas_.clearSelection(true);
    canvas_.call('contextset', null);
  }
  canvas_.setCurrentGroup(null);
};

// Set the current context (for in-group editing)
var setContext = function setContext(elem) {
  leaveContext();
  if (typeof elem === 'string') {
    elem = getElem(elem);
  }

  // Edit inside this group
  canvas_.setCurrentGroup(elem);

  // Disable other elements
  $$5(elem).parentsUntil('#svgcontent').andSelf().siblings().each(function () {
    var opac = this.getAttribute('opacity') || 1;
    // Store the original's opacity
    canvas_.elData(this, 'orig_opac', opac);
    this.setAttribute('opacity', opac * 0.33);
    this.setAttribute('style', 'pointer-events: none');
    disabledElems.push(this);
  });

  canvas_.clearSelection();
  canvas_.call('contextset', canvas_.getCurrentGroup());
};

var draw = /*#__PURE__*/Object.freeze({
  Drawing: Drawing,
  randomizeIds: randomizeIds,
  init: init$3,
  identifyLayers: identifyLayers,
  createLayer: createLayer,
  cloneLayer: cloneLayer,
  deleteCurrentLayer: deleteCurrentLayer,
  setCurrentLayer: setCurrentLayer,
  renameCurrentLayer: renameCurrentLayer,
  setCurrentLayerPosition: setCurrentLayerPosition,
  setLayerVisibility: setLayerVisibility,
  moveSelectedToLayer: moveSelectedToLayer,
  mergeLayer: mergeLayer,
  mergeAllLayers: mergeAllLayers,
  leaveContext: leaveContext,
  setContext: setContext,
  Layer: Layer
});

/**
 * Package: svgedit.sanitize
 *
 * Licensed under the MIT License
 *
 * Copyright(c) 2010 Alexis Deveria
 * Copyright(c) 2010 Jeff Schiller
 */

var REVERSE_NS = getReverseNS();

// this defines which elements and attributes that we support
var svgWhiteList_ = {
  // SVG Elements
  a: ['class', 'clip-path', 'clip-rule', 'fill', 'fill-opacity', 'fill-rule', 'filter', 'id', 'mask', 'opacity', 'stroke', 'stroke-dasharray', 'stroke-dashoffset', 'stroke-linecap', 'stroke-linejoin', 'stroke-miterlimit', 'stroke-opacity', 'stroke-width', 'style', 'systemLanguage', 'transform', 'xlink:href', 'xlink:title'],
  circle: ['class', 'clip-path', 'clip-rule', 'cx', 'cy', 'fill', 'fill-opacity', 'fill-rule', 'filter', 'id', 'mask', 'opacity', 'r', 'requiredFeatures', 'stroke', 'stroke-dasharray', 'stroke-dashoffset', 'stroke-linecap', 'stroke-linejoin', 'stroke-miterlimit', 'stroke-opacity', 'stroke-width', 'style', 'systemLanguage', 'transform'],
  clipPath: ['class', 'clipPathUnits', 'id'],
  defs: [],
  style: ['type'],
  desc: [],
  ellipse: ['class', 'clip-path', 'clip-rule', 'cx', 'cy', 'fill', 'fill-opacity', 'fill-rule', 'filter', 'id', 'mask', 'opacity', 'requiredFeatures', 'rx', 'ry', 'stroke', 'stroke-dasharray', 'stroke-dashoffset', 'stroke-linecap', 'stroke-linejoin', 'stroke-miterlimit', 'stroke-opacity', 'stroke-width', 'style', 'systemLanguage', 'transform'],
  feGaussianBlur: ['class', 'color-interpolation-filters', 'id', 'requiredFeatures', 'stdDeviation'],
  filter: ['class', 'color-interpolation-filters', 'filterRes', 'filterUnits', 'height', 'id', 'primitiveUnits', 'requiredFeatures', 'width', 'x', 'xlink:href', 'y'],
  foreignObject: ['class', 'font-size', 'height', 'id', 'opacity', 'requiredFeatures', 'style', 'transform', 'width', 'x', 'y'],
  g: ['class', 'clip-path', 'clip-rule', 'id', 'display', 'fill', 'fill-opacity', 'fill-rule', 'filter', 'mask', 'opacity', 'requiredFeatures', 'stroke', 'stroke-dasharray', 'stroke-dashoffset', 'stroke-linecap', 'stroke-linejoin', 'stroke-miterlimit', 'stroke-opacity', 'stroke-width', 'style', 'systemLanguage', 'transform', 'font-family', 'font-size', 'font-style', 'font-weight', 'text-anchor'],
  image: ['class', 'clip-path', 'clip-rule', 'filter', 'height', 'id', 'mask', 'opacity', 'requiredFeatures', 'style', 'systemLanguage', 'transform', 'width', 'x', 'xlink:href', 'xlink:title', 'y'],
  line: ['class', 'clip-path', 'clip-rule', 'fill', 'fill-opacity', 'fill-rule', 'filter', 'id', 'marker-end', 'marker-mid', 'marker-start', 'mask', 'opacity', 'requiredFeatures', 'stroke', 'stroke-dasharray', 'stroke-dashoffset', 'stroke-linecap', 'stroke-linejoin', 'stroke-miterlimit', 'stroke-opacity', 'stroke-width', 'style', 'systemLanguage', 'transform', 'x1', 'x2', 'y1', 'y2'],
  linearGradient: ['class', 'id', 'gradientTransform', 'gradientUnits', 'requiredFeatures', 'spreadMethod', 'systemLanguage', 'x1', 'x2', 'xlink:href', 'y1', 'y2'],
  marker: ['id', 'class', 'markerHeight', 'markerUnits', 'markerWidth', 'orient', 'preserveAspectRatio', 'refX', 'refY', 'systemLanguage', 'viewBox'],
  mask: ['class', 'height', 'id', 'maskContentUnits', 'maskUnits', 'width', 'x', 'y'],
  metadata: ['class', 'id'],
  path: ['class', 'clip-path', 'clip-rule', 'd', 'fill', 'fill-opacity', 'fill-rule', 'filter', 'id', 'marker-end', 'marker-mid', 'marker-start', 'mask', 'opacity', 'requiredFeatures', 'stroke', 'stroke-dasharray', 'stroke-dashoffset', 'stroke-linecap', 'stroke-linejoin', 'stroke-miterlimit', 'stroke-opacity', 'stroke-width', 'style', 'systemLanguage', 'transform'],
  pattern: ['class', 'height', 'id', 'patternContentUnits', 'patternTransform', 'patternUnits', 'requiredFeatures', 'style', 'systemLanguage', 'viewBox', 'width', 'x', 'xlink:href', 'y'],
  polygon: ['class', 'clip-path', 'clip-rule', 'id', 'fill', 'fill-opacity', 'fill-rule', 'filter', 'id', 'class', 'marker-end', 'marker-mid', 'marker-start', 'mask', 'opacity', 'points', 'requiredFeatures', 'stroke', 'stroke-dasharray', 'stroke-dashoffset', 'stroke-linecap', 'stroke-linejoin', 'stroke-miterlimit', 'stroke-opacity', 'stroke-width', 'style', 'systemLanguage', 'transform'],
  polyline: ['class', 'clip-path', 'clip-rule', 'id', 'fill', 'fill-opacity', 'fill-rule', 'filter', 'marker-end', 'marker-mid', 'marker-start', 'mask', 'opacity', 'points', 'requiredFeatures', 'stroke', 'stroke-dasharray', 'stroke-dashoffset', 'stroke-linecap', 'stroke-linejoin', 'stroke-miterlimit', 'stroke-opacity', 'stroke-width', 'style', 'systemLanguage', 'transform'],
  radialGradient: ['class', 'cx', 'cy', 'fx', 'fy', 'gradientTransform', 'gradientUnits', 'id', 'r', 'requiredFeatures', 'spreadMethod', 'systemLanguage', 'xlink:href'],
  rect: ['class', 'clip-path', 'clip-rule', 'fill', 'fill-opacity', 'fill-rule', 'filter', 'height', 'id', 'mask', 'opacity', 'requiredFeatures', 'rx', 'ry', 'stroke', 'stroke-dasharray', 'stroke-dashoffset', 'stroke-linecap', 'stroke-linejoin', 'stroke-miterlimit', 'stroke-opacity', 'stroke-width', 'style', 'systemLanguage', 'transform', 'width', 'x', 'y'],
  stop: ['class', 'id', 'offset', 'requiredFeatures', 'stop-color', 'stop-opacity', 'style', 'systemLanguage'],
  svg: ['class', 'clip-path', 'clip-rule', 'filter', 'id', 'height', 'mask', 'preserveAspectRatio', 'requiredFeatures', 'style', 'systemLanguage', 'viewBox', 'width', 'x', 'xmlns', 'xmlns:se', 'xmlns:xlink', 'y'],
  switch: ['class', 'id', 'requiredFeatures', 'systemLanguage'],
  symbol: ['class', 'fill', 'fill-opacity', 'fill-rule', 'filter', 'font-family', 'font-size', 'font-style', 'font-weight', 'id', 'opacity', 'preserveAspectRatio', 'requiredFeatures', 'stroke', 'stroke-dasharray', 'stroke-dashoffset', 'stroke-linecap', 'stroke-linejoin', 'stroke-miterlimit', 'stroke-opacity', 'stroke-width', 'style', 'systemLanguage', 'transform', 'viewBox'],
  text: ['class', 'clip-path', 'clip-rule', 'fill', 'fill-opacity', 'fill-rule', 'filter', 'font-family', 'font-size', 'font-style', 'font-weight', 'id', 'mask', 'opacity', 'requiredFeatures', 'stroke', 'stroke-dasharray', 'stroke-dashoffset', 'stroke-linecap', 'stroke-linejoin', 'stroke-miterlimit', 'stroke-opacity', 'stroke-width', 'style', 'systemLanguage', 'text-anchor', 'transform', 'x', 'xml:space', 'y'],
  textPath: ['class', 'id', 'method', 'requiredFeatures', 'spacing', 'startOffset', 'style', 'systemLanguage', 'transform', 'xlink:href'],
  title: [],
  tspan: ['class', 'clip-path', 'clip-rule', 'dx', 'dy', 'fill', 'fill-opacity', 'fill-rule', 'filter', 'font-family', 'font-size', 'font-style', 'font-weight', 'id', 'mask', 'opacity', 'requiredFeatures', 'rotate', 'stroke', 'stroke-dasharray', 'stroke-dashoffset', 'stroke-linecap', 'stroke-linejoin', 'stroke-miterlimit', 'stroke-opacity', 'stroke-width', 'style', 'systemLanguage', 'text-anchor', 'textLength', 'transform', 'x', 'xml:space', 'y'],
  use: ['class', 'clip-path', 'clip-rule', 'fill', 'fill-opacity', 'fill-rule', 'filter', 'height', 'id', 'mask', 'stroke', 'stroke-dasharray', 'stroke-dashoffset', 'stroke-linecap', 'stroke-linejoin', 'stroke-miterlimit', 'stroke-opacity', 'stroke-width', 'style', 'transform', 'width', 'x', 'xlink:href', 'y'],

  // MathML Elements
  annotation: ['encoding'],
  'annotation-xml': ['encoding'],
  maction: ['actiontype', 'other', 'selection'],
  math: ['class', 'id', 'display', 'xmlns'],
  menclose: ['notation'],
  merror: [],
  mfrac: ['linethickness'],
  mi: ['mathvariant'],
  mmultiscripts: [],
  mn: [],
  mo: ['fence', 'lspace', 'maxsize', 'minsize', 'rspace', 'stretchy'],
  mover: [],
  mpadded: ['lspace', 'width', 'height', 'depth', 'voffset'],
  mphantom: [],
  mprescripts: [],
  mroot: [],
  mrow: ['xlink:href', 'xlink:type', 'xmlns:xlink'],
  mspace: ['depth', 'height', 'width'],
  msqrt: [],
  mstyle: ['displaystyle', 'mathbackground', 'mathcolor', 'mathvariant', 'scriptlevel'],
  msub: [],
  msubsup: [],
  msup: [],
  mtable: ['align', 'columnalign', 'columnlines', 'columnspacing', 'displaystyle', 'equalcolumns', 'equalrows', 'frame', 'rowalign', 'rowlines', 'rowspacing', 'width'],
  mtd: ['columnalign', 'columnspan', 'rowalign', 'rowspan'],
  mtext: [],
  mtr: ['columnalign', 'rowalign'],
  munder: [],
  munderover: [],
  none: [],
  semantics: []
};

// Produce a Namespace-aware version of svgWhitelist
var svgWhiteListNS_ = {};
Object.entries(svgWhiteList_).forEach(function (_ref) {
  var _ref2 = slicedToArray(_ref, 2),
      elt = _ref2[0],
      atts = _ref2[1];

  var attNS = {};
  Object.entries(atts).forEach(function (_ref3) {
    var _ref4 = slicedToArray(_ref3, 2),
        i = _ref4[0],
        att = _ref4[1];

    if (att.includes(':')) {
      var v = att.split(':');
      attNS[v[1]] = NS[v[0].toUpperCase()];
    } else {
      attNS[att] = att === 'xmlns' ? NS.XMLNS : null;
    }
  });
  svgWhiteListNS_[elt] = attNS;
});

/**
* Sanitizes the input node and its children
* It only keeps what is allowed from our whitelist defined above
* @param node - The DOM element to be checked (we'll also check its children)
*/
var sanitizeSvg = function sanitizeSvg(node) {
  // Cleanup text nodes
  if (node.nodeType === 3) {
    // 3 === TEXT_NODE
    // Trim whitespace
    node.nodeValue = node.nodeValue.replace(/^\s+|\s+$/g, '');
    // Remove if empty
    if (!node.nodeValue.length) {
      node.remove();
    }
  }

  // We only care about element nodes.
  // Automatically return for all non-element nodes, such as comments, etc.
  if (node.nodeType !== 1) {
    // 1 == ELEMENT_NODE
    return;
  }

  var doc = node.ownerDocument;
  var parent = node.parentNode;
  // can parent ever be null here?  I think the root node's parent is the document...
  if (!doc || !parent) {
    return;
  }

  var allowedAttrs = svgWhiteList_[node.nodeName];
  var allowedAttrsNS = svgWhiteListNS_[node.nodeName];
  // if this element is supported, sanitize it
  if (typeof allowedAttrs !== 'undefined') {
    var seAttrs = [];
    var i = node.attributes.length;
    while (i--) {
      // if the attribute is not in our whitelist, then remove it
      // could use jQuery's inArray(), but I don't know if that's any better
      var attr = node.attributes.item(i);
      var attrName = attr.nodeName;
      var attrLocalName = attr.localName;
      var attrNsURI = attr.namespaceURI;
      // Check that an attribute with the correct localName in the correct namespace is on
      // our whitelist or is a namespace declaration for one of our allowed namespaces
      if (!(allowedAttrsNS.hasOwnProperty(attrLocalName) && attrNsURI === allowedAttrsNS[attrLocalName] && attrNsURI !== NS.XMLNS) && !(attrNsURI === NS.XMLNS && REVERSE_NS[attr.value])) {
        // TODO(codedread): Programmatically add the se: attributes to the NS-aware whitelist.
        // Bypassing the whitelist to allow se: prefixes.
        // Is there a more appropriate way to do this?
        if (attrName.startsWith('se:') || attrName.startsWith('data-')) {
          seAttrs.push([attrName, attr.value]);
        }
        node.removeAttributeNS(attrNsURI, attrLocalName);
      }

      // Add spaces before negative signs where necessary
      if (isGecko()) {
        switch (attrName) {
          case 'transform':
          case 'gradientTransform':
          case 'patternTransform':
            var val = attr.value.replace(/(\d)-/g, '$1 -');
            node.setAttribute(attrName, val);
            break;
        }
      }

      // For the style attribute, rewrite it in terms of XML presentational attributes
      if (attrName === 'style') {
        var props = attr.value.split(';');
        var p = props.length;
        while (p--) {
          var _props$p$split = props[p].split(':'),
              _props$p$split2 = slicedToArray(_props$p$split, 2),
              name = _props$p$split2[0],
              _val = _props$p$split2[1];

          var styleAttrName = (name || '').trim();
          var styleAttrVal = (_val || '').trim();
          // Now check that this attribute is supported
          if (allowedAttrs.includes(styleAttrName)) {
            node.setAttribute(styleAttrName, styleAttrVal);
          }
        }
        node.removeAttribute('style');
      }
    }

    Object.values(seAttrs).forEach(function (_ref5) {
      var _ref6 = slicedToArray(_ref5, 2),
          att = _ref6[0],
          val = _ref6[1];

      node.setAttributeNS(NS.SE, att, val);
    });

    // for some elements that have a xlink:href, ensure the URI refers to a local element
    // (but not for links)
    var href = getHref(node);
    if (href && ['filter', 'linearGradient', 'pattern', 'radialGradient', 'textPath', 'use'].includes(node.nodeName)) {
      // TODO: we simply check if the first character is a #, is this bullet-proof?
      if (href[0] !== '#') {
        // remove the attribute (but keep the element)
        setHref(node, '');
        node.removeAttributeNS(NS.XLINK, 'href');
      }
    }

    // Safari crashes on a <use> without a xlink:href, so we just remove the node here
    if (node.nodeName === 'use' && !getHref(node)) {
      node.remove();
      return;
    }
    // if the element has attributes pointing to a non-local reference,
    // need to remove the attribute
    Object.values(['clip-path', 'fill', 'filter', 'marker-end', 'marker-mid', 'marker-start', 'mask', 'stroke'], function (attr) {
      var val = node.getAttribute(attr);
      if (val) {
        val = getUrlFromAttr(val);
        // simply check for first character being a '#'
        if (val && val[0] !== '#') {
          node.setAttribute(attr, '');
          node.removeAttribute(attr);
        }
      }
    });

    // recurse to children
    i = node.childNodes.length;
    while (i--) {
      sanitizeSvg(node.childNodes.item(i));
    }
    // else (element not supported), remove it
  } else {
    // remove all children from this node and insert them before this node
    // FIXME: in the case of animation elements this will hardly ever be correct
    var children = [];
    while (node.hasChildNodes()) {
      children.push(parent.insertBefore(node.firstChild, node));
    }

    // remove this node from the document altogether
    node.remove();

    // call sanitizeSvg on each of those children
    var _i = children.length;
    while (_i--) {
      sanitizeSvg(children[_i]);
    }
  }
};

/* globals jQuery */

var $$6 = jQuery;

// this is how we map paths to our preferred relative segment types
var pathMap$1 = [0, 'z', 'M', 'm', 'L', 'l', 'C', 'c', 'Q', 'q', 'A', 'a', 'H', 'h', 'V', 'v', 'S', 's', 'T', 't'];

/**
 * @typedef editorContext
 * @type {?object}
 * @property {function} getGridSnapping
 * @property {function} getDrawing
*/
var editorContext_$2 = null;

/**
* @param {editorContext} editorContext
*/
var init$4 = function init(editorContext) {
  editorContext_$2 = editorContext;
};

/**
 * Applies coordinate changes to an element based on the given matrix
 * @param {Element} selected - DOM element to be changed
 * @param {Object} changes - Object with changes to be remapped
 * @param {SVGMatrix} m - Matrix object to use for remapping coordinates
*/
var remapElement = function remapElement(selected, changes, m) {
  var remap = function remap(x, y) {
    return transformPoint(x, y, m);
  },
      scalew = function scalew(w) {
    return m.a * w;
  },
      scaleh = function scaleh(h) {
    return m.d * h;
  },
      doSnapping = editorContext_$2.getGridSnapping() && selected.parentNode.parentNode.localName === 'svg',
      finishUp = function finishUp() {
    if (doSnapping) {
      for (var o in changes) {
        changes[o] = snapToGrid(changes[o]);
      }
    }
    assignAttributes(selected, changes, 1000, true);
  },
      box = getBBox(selected);

  for (var i = 0; i < 2; i++) {
    var type = i === 0 ? 'fill' : 'stroke';
    var attrVal = selected.getAttribute(type);
    if (attrVal && attrVal.startsWith('url(')) {
      if (m.a < 0 || m.d < 0) {
        var grad = getRefElem(attrVal);
        var newgrad = grad.cloneNode(true);
        if (m.a < 0) {
          // flip x
          var x1 = newgrad.getAttribute('x1');
          var x2 = newgrad.getAttribute('x2');
          newgrad.setAttribute('x1', -(x1 - 1));
          newgrad.setAttribute('x2', -(x2 - 1));
        }

        if (m.d < 0) {
          // flip y
          var y1 = newgrad.getAttribute('y1');
          var y2 = newgrad.getAttribute('y2');
          newgrad.setAttribute('y1', -(y1 - 1));
          newgrad.setAttribute('y2', -(y2 - 1));
        }
        newgrad.id = editorContext_$2.getDrawing().getNextId();
        findDefs().append(newgrad);
        selected.setAttribute(type, 'url(#' + newgrad.id + ')');
      }

      // Not really working :(
      // if (selected.tagName === 'path') {
      //   reorientGrads(selected, m);
      // }
    }
  }

  var elName = selected.tagName;
  if (elName === 'g' || elName === 'text' || elName === 'tspan' || elName === 'use') {
    // if it was a translate, then just update x,y
    if (m.a === 1 && m.b === 0 && m.c === 0 && m.d === 1 && (m.e !== 0 || m.f !== 0)) {
      // [T][M] = [M][T']
      // therefore [T'] = [M_inv][T][M]
      var existing = transformListToTransform(selected).matrix,
          tNew = matrixMultiply(existing.inverse(), m, existing);
      changes.x = parseFloat(changes.x) + tNew.e;
      changes.y = parseFloat(changes.y) + tNew.f;
    } else {
      // we just absorb all matrices into the element and don't do any remapping
      var chlist = getTransformList(selected);
      var mt = editorContext_$2.getSVGRoot().createSVGTransform();
      mt.setMatrix(matrixMultiply(transformListToTransform(chlist).matrix, m));
      chlist.clear();
      chlist.appendItem(mt);
    }
  }

  // now we have a set of changes and an applied reduced transform list
  // we apply the changes directly to the DOM
  switch (elName) {
    case 'foreignObject':
    case 'rect':
    case 'image':
      {
        // Allow images to be inverted (give them matrix when flipped)
        if (elName === 'image' && (m.a < 0 || m.d < 0)) {
          // Convert to matrix
          var _chlist = getTransformList(selected);
          var _mt = editorContext_$2.getSVGRoot().createSVGTransform();
          _mt.setMatrix(matrixMultiply(transformListToTransform(_chlist).matrix, m));
          _chlist.clear();
          _chlist.appendItem(_mt);
        } else {
          var pt1 = remap(changes.x, changes.y);
          changes.width = scalew(changes.width);
          changes.height = scaleh(changes.height);
          changes.x = pt1.x + Math.min(0, changes.width);
          changes.y = pt1.y + Math.min(0, changes.height);
          changes.width = Math.abs(changes.width);
          changes.height = Math.abs(changes.height);
        }
        finishUp();
        break;
      }case 'ellipse':
      {
        var c = remap(changes.cx, changes.cy);
        changes.cx = c.x;
        changes.cy = c.y;
        changes.rx = scalew(changes.rx);
        changes.ry = scaleh(changes.ry);
        changes.rx = Math.abs(changes.rx);
        changes.ry = Math.abs(changes.ry);
        finishUp();
        break;
      }case 'circle':
      {
        var _c = remap(changes.cx, changes.cy);
        changes.cx = _c.x;
        changes.cy = _c.y;
        // take the minimum of the new selected box's dimensions for the new circle radius
        var tbox = transformBox(box.x, box.y, box.width, box.height, m);
        var w = tbox.tr.x - tbox.tl.x,
            h = tbox.bl.y - tbox.tl.y;
        changes.r = Math.min(w / 2, h / 2);

        if (changes.r) {
          changes.r = Math.abs(changes.r);
        }
        finishUp();
        break;
      }case 'line':
      {
        var _pt = remap(changes.x1, changes.y1);
        var pt2 = remap(changes.x2, changes.y2);
        changes.x1 = _pt.x;
        changes.y1 = _pt.y;
        changes.x2 = pt2.x;
        changes.y2 = pt2.y;
      } // Fallthrough
    case 'text':
    case 'tspan':
    case 'use':
      {
        finishUp();
        break;
      }case 'g':
      {
        var gsvg = $$6(selected).data('gsvg');
        if (gsvg) {
          assignAttributes(gsvg, changes, 1000, true);
        }
        break;
      }case 'polyline':
    case 'polygon':
      {
        var len = changes.points.length;
        for (var _i = 0; _i < len; ++_i) {
          var pt = changes.points[_i];

          var _remap = remap(pt.x, pt.y),
              x = _remap.x,
              y = _remap.y;

          changes.points[_i].x = x;
          changes.points[_i].y = y;
        }

        // const len = changes.points.length;
        var pstr = '';
        for (var _i2 = 0; _i2 < len; ++_i2) {
          var _pt2 = changes.points[_i2];
          pstr += _pt2.x + ',' + _pt2.y + ' ';
        }
        selected.setAttribute('points', pstr);
        break;
      }case 'path':
      {
        var segList = selected.pathSegList;
        var _len = segList.numberOfItems;
        changes.d = [];
        for (var _i3 = 0; _i3 < _len; ++_i3) {
          var seg = segList.getItem(_i3);
          changes.d[_i3] = {
            type: seg.pathSegType,
            x: seg.x,
            y: seg.y,
            x1: seg.x1,
            y1: seg.y1,
            x2: seg.x2,
            y2: seg.y2,
            r1: seg.r1,
            r2: seg.r2,
            angle: seg.angle,
            largeArcFlag: seg.largeArcFlag,
            sweepFlag: seg.sweepFlag
          };
        }

        _len = changes.d.length;
        var firstseg = changes.d[0],
            currentpt = remap(firstseg.x, firstseg.y);
        changes.d[0].x = currentpt.x;
        changes.d[0].y = currentpt.y;
        for (var _i4 = 1; _i4 < _len; ++_i4) {
          var _seg = changes.d[_i4];
          var _type = _seg.type;
          // if absolute or first segment, we want to remap x, y, x1, y1, x2, y2
          // if relative, we want to scalew, scaleh

          if (_type % 2 === 0) {
            // absolute
            var thisx = _seg.x !== undefined ? _seg.x : currentpt.x,
                // for V commands
            thisy = _seg.y !== undefined ? _seg.y : currentpt.y; // for H commands
            var _pt3 = remap(thisx, thisy);
            var _pt4 = remap(_seg.x1, _seg.y1);
            var _pt5 = remap(_seg.x2, _seg.y2);
            _seg.x = _pt3.x;
            _seg.y = _pt3.y;
            _seg.x1 = _pt4.x;
            _seg.y1 = _pt4.y;
            _seg.x2 = _pt5.x;
            _seg.y2 = _pt5.y;
            _seg.r1 = scalew(_seg.r1);
            _seg.r2 = scaleh(_seg.r2);
          } else {
            // relative
            _seg.x = scalew(_seg.x);
            _seg.y = scaleh(_seg.y);
            _seg.x1 = scalew(_seg.x1);
            _seg.y1 = scaleh(_seg.y1);
            _seg.x2 = scalew(_seg.x2);
            _seg.y2 = scaleh(_seg.y2);
            _seg.r1 = scalew(_seg.r1);
            _seg.r2 = scaleh(_seg.r2);
          }
        } // for each segment

        var dstr = '';
        _len = changes.d.length;
        for (var _i5 = 0; _i5 < _len; ++_i5) {
          var _seg2 = changes.d[_i5];
          var _type2 = _seg2.type;

          dstr += pathMap$1[_type2];
          switch (_type2) {
            case 13: // relative horizontal line (h)
            case 12:
              // absolute horizontal line (H)
              dstr += _seg2.x + ' ';
              break;
            case 15: // relative vertical line (v)
            case 14:
              // absolute vertical line (V)
              dstr += _seg2.y + ' ';
              break;
            case 3: // relative move (m)
            case 5: // relative line (l)
            case 19: // relative smooth quad (t)
            case 2: // absolute move (M)
            case 4: // absolute line (L)
            case 18:
              // absolute smooth quad (T)
              dstr += _seg2.x + ',' + _seg2.y + ' ';
              break;
            case 7: // relative cubic (c)
            case 6:
              // absolute cubic (C)
              dstr += _seg2.x1 + ',' + _seg2.y1 + ' ' + _seg2.x2 + ',' + _seg2.y2 + ' ' + _seg2.x + ',' + _seg2.y + ' ';
              break;
            case 9: // relative quad (q)
            case 8:
              // absolute quad (Q)
              dstr += _seg2.x1 + ',' + _seg2.y1 + ' ' + _seg2.x + ',' + _seg2.y + ' ';
              break;
            case 11: // relative elliptical arc (a)
            case 10:
              // absolute elliptical arc (A)
              dstr += _seg2.r1 + ',' + _seg2.r2 + ' ' + _seg2.angle + ' ' + +_seg2.largeArcFlag + ' ' + +_seg2.sweepFlag + ' ' + _seg2.x + ',' + _seg2.y + ' ';
              break;
            case 17: // relative smooth cubic (s)
            case 16:
              // absolute smooth cubic (S)
              dstr += _seg2.x2 + ',' + _seg2.y2 + ' ' + _seg2.x + ',' + _seg2.y + ' ';
              break;
          }
        }

        selected.setAttribute('d', dstr);
        break;
      }
  }
};

/* globals jQuery */

var $$7 = jqPluginSVG(jQuery);

var context_ = void 0;

/**
* @param editorContext
*/
var init$5 = function init$$1(editorContext) {
  context_ = editorContext;
};

/**
* Updates a <clipPath>s values based on the given translation of an element
* @param attr - The clip-path attribute value with the clipPath's ID
* @param tx - The translation's x value
* @param ty - The translation's y value
*/
var updateClipPath = function updateClipPath(attr, tx, ty) {
  var path = getRefElem(attr).firstChild;
  var cpXform = getTransformList(path);
  var newxlate = context_.getSVGRoot().createSVGTransform();
  newxlate.setTranslate(tx, ty);

  cpXform.appendItem(newxlate);

  // Update clipPath's dimensions
  recalculateDimensions(path);
};

/**
* Decides the course of action based on the element's transform list
* @param selected - The DOM element to recalculate
* @returns Undo command object with the resulting change
*/
var recalculateDimensions = function recalculateDimensions(selected) {
  if (selected == null) {
    return null;
  }

  // Firefox Issue - 1081
  if (selected.nodeName === 'svg' && navigator.userAgent.includes('Firefox/20')) {
    return null;
  }

  var svgroot = context_.getSVGRoot();
  var tlist = getTransformList(selected);

  // remove any unnecessary transforms
  if (tlist && tlist.numberOfItems > 0) {
    var k = tlist.numberOfItems;
    var noi = k;
    while (k--) {
      var xform = tlist.getItem(k);
      if (xform.type === 0) {
        tlist.removeItem(k);
        // remove identity matrices
      } else if (xform.type === 1) {
        if (isIdentity(xform.matrix)) {
          if (noi === 1) {
            // Overcome Chrome bug (though only when noi is 1) with
            //    `removeItem` preventing `removeAttribute` from
            //    subsequently working
            // See https://bugs.chromium.org/p/chromium/issues/detail?id=843901
            selected.removeAttribute('transform');
            return null;
          }
          tlist.removeItem(k);
        }
        // remove zero-degree rotations
      } else if (xform.type === 4) {
        if (xform.angle === 0) {
          tlist.removeItem(k);
        }
      }
    }
    // End here if all it has is a rotation
    if (tlist.numberOfItems === 1 && getRotationAngle(selected)) {
      return null;
    }
  }

  // if this element had no transforms, we are done
  if (!tlist || tlist.numberOfItems === 0) {
    // Chrome apparently had a bug that requires clearing the attribute first.
    selected.setAttribute('transform', '');
    // However, this still next line currently doesn't work at all in Chrome
    selected.removeAttribute('transform');
    // selected.transform.baseVal.clear(); // Didn't help for Chrome bug
    return null;
  }

  // TODO: Make this work for more than 2
  if (tlist) {
    var mxs = [];
    var _k = tlist.numberOfItems;
    while (_k--) {
      var _xform = tlist.getItem(_k);
      if (_xform.type === 1) {
        mxs.push([_xform.matrix, _k]);
      } else if (mxs.length) {
        mxs = [];
      }
    }
    if (mxs.length === 2) {
      var mNew = svgroot.createSVGTransformFromMatrix(matrixMultiply(mxs[1][0], mxs[0][0]));
      tlist.removeItem(mxs[0][1]);
      tlist.removeItem(mxs[1][1]);
      tlist.insertItemBefore(mNew, mxs[1][1]);
    }

    // combine matrix + translate
    _k = tlist.numberOfItems;
    if (_k >= 2 && tlist.getItem(_k - 2).type === 1 && tlist.getItem(_k - 1).type === 2) {
      var mt = svgroot.createSVGTransform();

      var m = matrixMultiply(tlist.getItem(_k - 2).matrix, tlist.getItem(_k - 1).matrix);
      mt.setMatrix(m);
      tlist.removeItem(_k - 2);
      tlist.removeItem(_k - 2);
      tlist.appendItem(mt);
    }
  }

  // If it still has a single [M] or [R][M], return null too (prevents BatchCommand from being returned).
  switch (selected.tagName) {
    // Ignore these elements, as they can absorb the [M]
    case 'line':
    case 'polyline':
    case 'polygon':
    case 'path':
      break;
    default:
      if (tlist.numberOfItems === 1 && tlist.getItem(0).type === 1 || tlist.numberOfItems === 2 && tlist.getItem(0).type === 1 && tlist.getItem(0).type === 4) {
        return null;
      }
  }

  // Grouped SVG element
  var gsvg = $$7(selected).data('gsvg');

  // we know we have some transforms, so set up return variable
  var batchCmd = new BatchCommand('Transform');

  // store initial values that will be affected by reducing the transform list
  var changes = {};
  var initial = null;
  var attrs = [];
  switch (selected.tagName) {
    case 'line':
      attrs = ['x1', 'y1', 'x2', 'y2'];
      break;
    case 'circle':
      attrs = ['cx', 'cy', 'r'];
      break;
    case 'ellipse':
      attrs = ['cx', 'cy', 'rx', 'ry'];
      break;
    case 'foreignObject':
    case 'rect':
    case 'image':
      attrs = ['width', 'height', 'x', 'y'];
      break;
    case 'use':
    case 'text':
    case 'tspan':
      attrs = ['x', 'y'];
      break;
    case 'polygon':
    case 'polyline':
      {
        initial = {};
        initial.points = selected.getAttribute('points');
        var list = selected.points;
        var len = list.numberOfItems;
        changes.points = new Array(len);
        for (var i = 0; i < len; ++i) {
          var pt = list.getItem(i);
          changes.points[i] = { x: pt.x, y: pt.y };
        }
        break;
      }case 'path':
      initial = {};
      initial.d = selected.getAttribute('d');
      changes.d = selected.getAttribute('d');
      break;
  } // switch on element type to get initial values

  if (attrs.length) {
    changes = $$7(selected).attr(attrs);
    $$7.each(changes, function (attr, val) {
      changes[attr] = convertToNum(attr, val);
    });
  } else if (gsvg) {
    // GSVG exception
    changes = {
      x: $$7(gsvg).attr('x') || 0,
      y: $$7(gsvg).attr('y') || 0
    };
  }

  // if we haven't created an initial array in polygon/polyline/path, then
  // make a copy of initial values and include the transform
  if (initial == null) {
    initial = $$7.extend(true, {}, changes);
    $$7.each(initial, function (attr, val) {
      initial[attr] = convertToNum(attr, val);
    });
  }
  // save the start transform value too
  initial.transform = context_.getStartTransform() || '';

  var oldcenter = void 0,
      newcenter = void 0;

  // if it's a regular group, we have special processing to flatten transforms
  if (selected.tagName === 'g' && !gsvg || selected.tagName === 'a') {
    var box = getBBox(selected);

    oldcenter = { x: box.x + box.width / 2, y: box.y + box.height / 2 };
    newcenter = transformPoint(box.x + box.width / 2, box.y + box.height / 2, transformListToTransform(tlist).matrix);
    var _m = svgroot.createSVGMatrix();

    // temporarily strip off the rotate and save the old center
    var gangle = getRotationAngle(selected);
    if (gangle) {
      var a = gangle * Math.PI / 180;
      var s = void 0;
      if (Math.abs(a) > 1.0e-10) {
        s = Math.sin(a) / (1 - Math.cos(a));
      } else {
        // FIXME: This blows up if the angle is exactly 0!
        s = 2 / a;
      }
      for (var _i = 0; _i < tlist.numberOfItems; ++_i) {
        var _xform2 = tlist.getItem(_i);
        if (_xform2.type === 4) {
          // extract old center through mystical arts
          var rm = _xform2.matrix;
          oldcenter.y = (s * rm.e + rm.f) / 2;
          oldcenter.x = (rm.e - s * rm.f) / 2;
          tlist.removeItem(_i);
          break;
        }
      }
    }
    var N = tlist.numberOfItems;
    var tx = 0,
        ty = 0,
        operation = 0;

    var firstM = void 0;
    if (N) {
      firstM = tlist.getItem(0).matrix;
    }

    var oldStartTransform = void 0;
    // first, if it was a scale then the second-last transform will be it
    if (N >= 3 && tlist.getItem(N - 2).type === 3 && tlist.getItem(N - 3).type === 2 && tlist.getItem(N - 1).type === 2) {
      operation = 3; // scale

      // if the children are unrotated, pass the scale down directly
      // otherwise pass the equivalent matrix() down directly
      var tm = tlist.getItem(N - 3).matrix,
          sm = tlist.getItem(N - 2).matrix,
          tmn = tlist.getItem(N - 1).matrix;

      var children = selected.childNodes;
      var c = children.length;
      while (c--) {
        var child = children.item(c);
        tx = 0;
        ty = 0;
        if (child.nodeType === 1) {
          var childTlist = getTransformList(child);

          // some children might not have a transform (<metadata>, <defs>, etc)
          if (!childTlist) {
            continue;
          }

          var _m2 = transformListToTransform(childTlist).matrix;

          // Convert a matrix to a scale if applicable
          // if (hasMatrixTransform(childTlist) && childTlist.numberOfItems == 1) {
          //   if (m.b==0 && m.c==0 && m.e==0 && m.f==0) {
          //     childTlist.removeItem(0);
          //     const translateOrigin = svgroot.createSVGTransform(),
          //       scale = svgroot.createSVGTransform(),
          //       translateBack = svgroot.createSVGTransform();
          //     translateOrigin.setTranslate(0, 0);
          //     scale.setScale(m.a, m.d);
          //     translateBack.setTranslate(0, 0);
          //     childTlist.appendItem(translateBack);
          //     childTlist.appendItem(scale);
          //     childTlist.appendItem(translateOrigin);
          //   }
          // }

          var angle = getRotationAngle(child);
          oldStartTransform = context_.getStartTransform();
          context_.setStartTransform(child.getAttribute('transform'));
          if (angle || hasMatrixTransform(childTlist)) {
            var e2t = svgroot.createSVGTransform();
            e2t.setMatrix(matrixMultiply(tm, sm, tmn, _m2));
            childTlist.clear();
            childTlist.appendItem(e2t);
            // if not rotated or skewed, push the [T][S][-T] down to the child
          } else {
            // update the transform list with translate,scale,translate

            // slide the [T][S][-T] from the front to the back
            // [T][S][-T][M] = [M][T2][S2][-T2]

            // (only bringing [-T] to the right of [M])
            // [T][S][-T][M] = [T][S][M][-T2]
            // [-T2] = [M_inv][-T][M]
            var t2n = matrixMultiply(_m2.inverse(), tmn, _m2);
            // [T2] is always negative translation of [-T2]
            var t2 = svgroot.createSVGMatrix();
            t2.e = -t2n.e;
            t2.f = -t2n.f;

            // [T][S][-T][M] = [M][T2][S2][-T2]
            // [S2] = [T2_inv][M_inv][T][S][-T][M][-T2_inv]
            var s2 = matrixMultiply(t2.inverse(), _m2.inverse(), tm, sm, tmn, _m2, t2n.inverse());

            var translateOrigin = svgroot.createSVGTransform(),
                scale = svgroot.createSVGTransform(),
                translateBack = svgroot.createSVGTransform();
            translateOrigin.setTranslate(t2n.e, t2n.f);
            scale.setScale(s2.a, s2.d);
            translateBack.setTranslate(t2.e, t2.f);
            childTlist.appendItem(translateBack);
            childTlist.appendItem(scale);
            childTlist.appendItem(translateOrigin);
            // logMatrix(translateBack.matrix);
            // logMatrix(scale.matrix);
          } // not rotated
          batchCmd.addSubCommand(recalculateDimensions(child));
          // TODO: If any <use> have this group as a parent and are
          // referencing this child, then we need to impose a reverse
          // scale on it so that when it won't get double-translated
          // const uses = selected.getElementsByTagNameNS(NS.SVG, 'use');
          // const href = '#' + child.id;
          // let u = uses.length;
          // while (u--) {
          //   const useElem = uses.item(u);
          //   if (href == getHref(useElem)) {
          //     const usexlate = svgroot.createSVGTransform();
          //     usexlate.setTranslate(-tx,-ty);
          //     getTransformList(useElem).insertItemBefore(usexlate,0);
          //     batchCmd.addSubCommand( recalculateDimensions(useElem) );
          //   }
          // }
          context_.setStartTransform(oldStartTransform);
        } // element
      } // for each child
      // Remove these transforms from group
      tlist.removeItem(N - 1);
      tlist.removeItem(N - 2);
      tlist.removeItem(N - 3);
    } else if (N >= 3 && tlist.getItem(N - 1).type === 1) {
      operation = 3; // scale
      _m = transformListToTransform(tlist).matrix;
      var _e2t = svgroot.createSVGTransform();
      _e2t.setMatrix(_m);
      tlist.clear();
      tlist.appendItem(_e2t);
      // next, check if the first transform was a translate
      // if we had [ T1 ] [ M ] we want to transform this into [ M ] [ T2 ]
      // therefore [ T2 ] = [ M_inv ] [ T1 ] [ M ]
    } else if ((N === 1 || N > 1 && tlist.getItem(1).type !== 3) && tlist.getItem(0).type === 2) {
      operation = 2; // translate
      var T_M = transformListToTransform(tlist).matrix;
      tlist.removeItem(0);
      var mInv = transformListToTransform(tlist).matrix.inverse();
      var M2 = matrixMultiply(mInv, T_M);

      tx = M2.e;
      ty = M2.f;

      if (tx !== 0 || ty !== 0) {
        // we pass the translates down to the individual children
        var _children = selected.childNodes;
        var _c = _children.length;

        var clipPathsDone = [];

        while (_c--) {
          var _child = _children.item(_c);
          if (_child.nodeType === 1) {
            // Check if child has clip-path
            if (_child.getAttribute('clip-path')) {
              // tx, ty
              var attr = _child.getAttribute('clip-path');
              if (!clipPathsDone.includes(attr)) {
                updateClipPath(attr, tx, ty);
                clipPathsDone.push(attr);
              }
            }

            oldStartTransform = context_.getStartTransform();
            context_.setStartTransform(_child.getAttribute('transform'));

            var _childTlist = getTransformList(_child);
            // some children might not have a transform (<metadata>, <defs>, etc)
            if (_childTlist) {
              var newxlate = svgroot.createSVGTransform();
              newxlate.setTranslate(tx, ty);
              if (_childTlist.numberOfItems) {
                _childTlist.insertItemBefore(newxlate, 0);
              } else {
                _childTlist.appendItem(newxlate);
              }
              batchCmd.addSubCommand(recalculateDimensions(_child));
              // If any <use> have this group as a parent and are
              // referencing this child, then impose a reverse translate on it
              // so that when it won't get double-translated
              var uses = selected.getElementsByTagNameNS(NS.SVG, 'use');
              var href = '#' + _child.id;
              var u = uses.length;
              while (u--) {
                var useElem = uses.item(u);
                if (href === getHref(useElem)) {
                  var usexlate = svgroot.createSVGTransform();
                  usexlate.setTranslate(-tx, -ty);
                  getTransformList(useElem).insertItemBefore(usexlate, 0);
                  batchCmd.addSubCommand(recalculateDimensions(useElem));
                }
              }
              context_.setStartTransform(oldStartTransform);
            }
          }
        }

        clipPathsDone = [];
        context_.setStartTransform(oldStartTransform);
      }
      // else, a matrix imposition from a parent group
      // keep pushing it down to the children
    } else if (N === 1 && tlist.getItem(0).type === 1 && !gangle) {
      operation = 1;
      var _m3 = tlist.getItem(0).matrix,
          _children2 = selected.childNodes;
      var _c2 = _children2.length;
      while (_c2--) {
        var _child2 = _children2.item(_c2);
        if (_child2.nodeType === 1) {
          oldStartTransform = context_.getStartTransform();
          context_.setStartTransform(_child2.getAttribute('transform'));
          var _childTlist2 = getTransformList(_child2);

          if (!_childTlist2) {
            continue;
          }

          var em = matrixMultiply(_m3, transformListToTransform(_childTlist2).matrix);
          var e2m = svgroot.createSVGTransform();
          e2m.setMatrix(em);
          _childTlist2.clear();
          _childTlist2.appendItem(e2m, 0);

          batchCmd.addSubCommand(recalculateDimensions(_child2));
          context_.setStartTransform(oldStartTransform);

          // Convert stroke
          // TODO: Find out if this should actually happen somewhere else
          var sw = _child2.getAttribute('stroke-width');
          if (_child2.getAttribute('stroke') !== 'none' && !isNaN(sw)) {
            var avg = (Math.abs(em.a) + Math.abs(em.d)) / 2;
            _child2.setAttribute('stroke-width', sw * avg);
          }
        }
      }
      tlist.clear();
      // else it was just a rotate
    } else {
      if (gangle) {
        var newRot = svgroot.createSVGTransform();
        newRot.setRotate(gangle, newcenter.x, newcenter.y);
        if (tlist.numberOfItems) {
          tlist.insertItemBefore(newRot, 0);
        } else {
          tlist.appendItem(newRot);
        }
      }
      if (tlist.numberOfItems === 0) {
        selected.removeAttribute('transform');
      }
      return null;
    }

    // if it was a translate, put back the rotate at the new center
    if (operation === 2) {
      if (gangle) {
        newcenter = {
          x: oldcenter.x + firstM.e,
          y: oldcenter.y + firstM.f
        };

        var _newRot = svgroot.createSVGTransform();
        _newRot.setRotate(gangle, newcenter.x, newcenter.y);
        if (tlist.numberOfItems) {
          tlist.insertItemBefore(_newRot, 0);
        } else {
          tlist.appendItem(_newRot);
        }
      }
      // if it was a resize
    } else if (operation === 3) {
      var _m4 = transformListToTransform(tlist).matrix;
      var roldt = svgroot.createSVGTransform();
      roldt.setRotate(gangle, oldcenter.x, oldcenter.y);
      var rold = roldt.matrix;
      var rnew = svgroot.createSVGTransform();
      rnew.setRotate(gangle, newcenter.x, newcenter.y);
      var rnewInv = rnew.matrix.inverse(),
          _mInv = _m4.inverse(),
          extrat = matrixMultiply(_mInv, rnewInv, rold, _m4);

      tx = extrat.e;
      ty = extrat.f;

      if (tx !== 0 || ty !== 0) {
        // now push this transform down to the children
        // we pass the translates down to the individual children
        var _children3 = selected.childNodes;
        var _c3 = _children3.length;
        while (_c3--) {
          var _child3 = _children3.item(_c3);
          if (_child3.nodeType === 1) {
            oldStartTransform = context_.getStartTransform();
            context_.setStartTransform(_child3.getAttribute('transform'));
            var _childTlist3 = getTransformList(_child3);
            var _newxlate = svgroot.createSVGTransform();
            _newxlate.setTranslate(tx, ty);
            if (_childTlist3.numberOfItems) {
              _childTlist3.insertItemBefore(_newxlate, 0);
            } else {
              _childTlist3.appendItem(_newxlate);
            }

            batchCmd.addSubCommand(recalculateDimensions(_child3));
            context_.setStartTransform(oldStartTransform);
          }
        }
      }

      if (gangle) {
        if (tlist.numberOfItems) {
          tlist.insertItemBefore(rnew, 0);
        } else {
          tlist.appendItem(rnew);
        }
      }
    }
    // else, it's a non-group
  } else {
    // FIXME: box might be null for some elements (<metadata> etc), need to handle this
    var _box = getBBox(selected);

    // Paths (and possbly other shapes) will have no BBox while still in <defs>,
    // but we still may need to recalculate them (see issue 595).
    // TODO: Figure out how to get BBox from these elements in case they
    // have a rotation transform

    if (!_box && selected.tagName !== 'path') return null;

    var _m5 = svgroot.createSVGMatrix();
    // temporarily strip off the rotate and save the old center
    var _angle = getRotationAngle(selected);
    if (_angle) {
      oldcenter = { x: _box.x + _box.width / 2, y: _box.y + _box.height / 2 };
      newcenter = transformPoint(_box.x + _box.width / 2, _box.y + _box.height / 2, transformListToTransform(tlist).matrix);

      var _a = _angle * Math.PI / 180;
      var _s = Math.abs(_a) > 1.0e-10 ? Math.sin(_a) / (1 - Math.cos(_a))
      // FIXME: This blows up if the angle is exactly 0!
      : 2 / _a;

      for (var _i2 = 0; _i2 < tlist.numberOfItems; ++_i2) {
        var _xform3 = tlist.getItem(_i2);
        if (_xform3.type === 4) {
          // extract old center through mystical arts
          var _rm = _xform3.matrix;
          oldcenter.y = (_s * _rm.e + _rm.f) / 2;
          oldcenter.x = (_rm.e - _s * _rm.f) / 2;
          tlist.removeItem(_i2);
          break;
        }
      }
    }

    // 2 = translate, 3 = scale, 4 = rotate, 1 = matrix imposition
    var _operation = 0;
    var _N = tlist.numberOfItems;

    // Check if it has a gradient with userSpaceOnUse, in which case
    // adjust it by recalculating the matrix transform.
    // TODO: Make this work in Webkit using svgedit.transformlist.SVGTransformList
    if (!isWebkit()) {
      var fill = selected.getAttribute('fill');
      if (fill && fill.startsWith('url(')) {
        var paint = getRefElem(fill);
        var type = 'pattern';
        if (paint.tagName !== type) type = 'gradient';
        var attrVal = paint.getAttribute(type + 'Units');
        if (attrVal === 'userSpaceOnUse') {
          // Update the userSpaceOnUse element
          _m5 = transformListToTransform(tlist).matrix;
          var gtlist = getTransformList(paint);
          var gmatrix = transformListToTransform(gtlist).matrix;
          _m5 = matrixMultiply(_m5, gmatrix);
          var mStr = 'matrix(' + [_m5.a, _m5.b, _m5.c, _m5.d, _m5.e, _m5.f].join(',') + ')';
          paint.setAttribute(type + 'Transform', mStr);
        }
      }
    }

    // first, if it was a scale of a non-skewed element, then the second-last
    // transform will be the [S]
    // if we had [M][T][S][T] we want to extract the matrix equivalent of
    // [T][S][T] and push it down to the element
    if (_N >= 3 && tlist.getItem(_N - 2).type === 3 && tlist.getItem(_N - 3).type === 2 && tlist.getItem(_N - 1).type === 2) {
      // Removed this so a <use> with a given [T][S][T] would convert to a matrix.
      // Is that bad?
      //  && selected.nodeName != 'use'
      _operation = 3; // scale
      _m5 = transformListToTransform(tlist, _N - 3, _N - 1).matrix;
      tlist.removeItem(_N - 1);
      tlist.removeItem(_N - 2);
      tlist.removeItem(_N - 3);
      // if we had [T][S][-T][M], then this was a skewed element being resized
      // Thus, we simply combine it all into one matrix
    } else if (_N === 4 && tlist.getItem(_N - 1).type === 1) {
      _operation = 3; // scale
      _m5 = transformListToTransform(tlist).matrix;
      var _e2t2 = svgroot.createSVGTransform();
      _e2t2.setMatrix(_m5);
      tlist.clear();
      tlist.appendItem(_e2t2);
      // reset the matrix so that the element is not re-mapped
      _m5 = svgroot.createSVGMatrix();
      // if we had [R][T][S][-T][M], then this was a rotated matrix-element
      // if we had [T1][M] we want to transform this into [M][T2]
      // therefore [ T2 ] = [ M_inv ] [ T1 ] [ M ] and we can push [T2]
      // down to the element
    } else if ((_N === 1 || _N > 1 && tlist.getItem(1).type !== 3) && tlist.getItem(0).type === 2) {
      _operation = 2; // translate
      var oldxlate = tlist.getItem(0).matrix,
          meq = transformListToTransform(tlist, 1).matrix,
          meqInv = meq.inverse();
      _m5 = matrixMultiply(meqInv, oldxlate, meq);
      tlist.removeItem(0);
      // else if this child now has a matrix imposition (from a parent group)
      // we might be able to simplify
    } else if (_N === 1 && tlist.getItem(0).type === 1 && !_angle) {
      // Remap all point-based elements
      _m5 = transformListToTransform(tlist).matrix;
      switch (selected.tagName) {
        case 'line':
          changes = $$7(selected).attr(['x1', 'y1', 'x2', 'y2']);
        // Fallthrough
        case 'polyline':
        case 'polygon':
          changes.points = selected.getAttribute('points');
          if (changes.points) {
            var _list = selected.points;
            var _len = _list.numberOfItems;
            changes.points = new Array(_len);
            for (var _i3 = 0; _i3 < _len; ++_i3) {
              var _pt = _list.getItem(_i3);
              changes.points[_i3] = { x: _pt.x, y: _pt.y };
            }
          }
        // Fallthrough
        case 'path':
          changes.d = selected.getAttribute('d');
          _operation = 1;
          tlist.clear();
          break;
        default:
          break;
      }
      // if it was a rotation, put the rotate back and return without a command
      // (this function has zero work to do for a rotate())
    } else {
      _operation = 4; // rotation
      if (_angle) {
        var _newRot2 = svgroot.createSVGTransform();
        _newRot2.setRotate(_angle, newcenter.x, newcenter.y);

        if (tlist.numberOfItems) {
          tlist.insertItemBefore(_newRot2, 0);
        } else {
          tlist.appendItem(_newRot2);
        }
      }
      if (tlist.numberOfItems === 0) {
        selected.removeAttribute('transform');
      }
      return null;
    }

    // if it was a translate or resize, we need to remap the element and absorb the xform
    if (_operation === 1 || _operation === 2 || _operation === 3) {
      remapElement(selected, changes, _m5);
    } // if we are remapping

    // if it was a translate, put back the rotate at the new center
    if (_operation === 2) {
      if (_angle) {
        if (!hasMatrixTransform(tlist)) {
          newcenter = {
            x: oldcenter.x + _m5.e,
            y: oldcenter.y + _m5.f
          };
        }
        var _newRot3 = svgroot.createSVGTransform();
        _newRot3.setRotate(_angle, newcenter.x, newcenter.y);
        if (tlist.numberOfItems) {
          tlist.insertItemBefore(_newRot3, 0);
        } else {
          tlist.appendItem(_newRot3);
        }
      }
      // We have special processing for tspans:  Tspans are not transformable
      // but they can have x,y coordinates (sigh).  Thus, if this was a translate,
      // on a text element, also translate any tspan children.
      if (selected.tagName === 'text') {
        var _children4 = selected.childNodes;
        var _c4 = _children4.length;
        while (_c4--) {
          var _child4 = _children4.item(_c4);
          if (_child4.tagName === 'tspan') {
            var tspanChanges = {
              x: $$7(_child4).attr('x') || 0,
              y: $$7(_child4).attr('y') || 0
            };
            remapElement(_child4, tspanChanges, _m5);
          }
        }
      }
      // [Rold][M][T][S][-T] became [Rold][M]
      // we want it to be [Rnew][M][Tr] where Tr is the
      // translation required to re-center it
      // Therefore, [Tr] = [M_inv][Rnew_inv][Rold][M]
    } else if (_operation === 3 && _angle) {
      var _m6 = transformListToTransform(tlist).matrix;
      var _roldt = svgroot.createSVGTransform();
      _roldt.setRotate(_angle, oldcenter.x, oldcenter.y);
      var _rold = _roldt.matrix;
      var _rnew = svgroot.createSVGTransform();
      _rnew.setRotate(_angle, newcenter.x, newcenter.y);
      var _rnewInv = _rnew.matrix.inverse();
      var _mInv2 = _m6.inverse();
      var _extrat = matrixMultiply(_mInv2, _rnewInv, _rold, _m6);

      remapElement(selected, changes, _extrat);
      if (_angle) {
        if (tlist.numberOfItems) {
          tlist.insertItemBefore(_rnew, 0);
        } else {
          tlist.appendItem(_rnew);
        }
      }
    }
  } // a non-group

  // if the transform list has been emptied, remove it
  if (tlist.numberOfItems === 0) {
    selected.removeAttribute('transform');
  }

  batchCmd.addSubCommand(new ChangeElementCommand(selected, initial));

  return batchCmd;
};

/* globals jQuery */

var $$8 = jQuery;

var svgFactory_ = void 0;
var config_ = void 0;
var selectorManager_ = void 0; // A Singleton
var gripRadius = isTouch() ? 10 : 4;

/**
* Private class for DOM element selection boxes
* @param id - integer to internally indentify the selector
* @param elem - DOM element associated with this selector
* @param bbox - Optional bbox to use for initialization (prevents duplicate getBBox call).
*/
var Selector = function () {
  function Selector(id, elem, bbox) {
    classCallCheck(this, Selector);

    // this is the selector's unique number
    this.id = id;

    // this holds a reference to the element for which this selector is being used
    this.selectedElement = elem;

    // this is a flag used internally to track whether the selector is being used or not
    this.locked = true;

    // this holds a reference to the <g> element that holds all visual elements of the selector
    this.selectorGroup = svgFactory_.createSVGElement({
      element: 'g',
      attr: { id: 'selectorGroup' + this.id }
    });

    // this holds a reference to the path rect
    this.selectorRect = this.selectorGroup.appendChild(svgFactory_.createSVGElement({
      element: 'path',
      attr: {
        id: 'selectedBox' + this.id,
        fill: 'none',
        stroke: '#22C',
        'stroke-width': '1',
        'stroke-dasharray': '5,5',
        // need to specify this so that the rect is not selectable
        style: 'pointer-events:none'
      }
    }));

    // this holds a reference to the grip coordinates for this selector
    this.gripCoords = {
      nw: null,
      n: null,
      ne: null,
      e: null,
      se: null,
      s: null,
      sw: null,
      w: null
    };

    this.reset(this.selectedElement, bbox);
  }

  /**
  * Used to reset the id and element that the selector is attached to
  * @param e - DOM element associated with this selector
  * @param bbox - Optional bbox to use for reset (prevents duplicate getBBox call).
  */


  createClass(Selector, [{
    key: 'reset',
    value: function reset(e, bbox) {
      this.locked = true;
      this.selectedElement = e;
      this.resize(bbox);
      this.selectorGroup.setAttribute('display', 'inline');
    }

    /**
    * Updates cursors for corner grips on rotation so arrows point the right way
    * @param {Number} angle - Float indicating current rotation angle in degrees
    */

  }, {
    key: 'updateGripCursors',
    value: function updateGripCursors(angle) {
      var dir = void 0;
      var dirArr = [];
      var steps = Math.round(angle / 45);
      if (steps < 0) {
        steps += 8;
      }
      for (dir in selectorManager_.selectorGrips) {
        dirArr.push(dir);
      }
      while (steps > 0) {
        dirArr.push(dirArr.shift());
        steps--;
      }
      var i = 0;
      for (dir in selectorManager_.selectorGrips) {
        selectorManager_.selectorGrips[dir].setAttribute('style', 'cursor:' + dirArr[i] + '-resize');
        i++;
      }
    }

    /**
    * Show the resize grips of this selector
    *
    * @param {Boolean} show - Indicates whether grips should be shown or not
    */

  }, {
    key: 'showGrips',
    value: function showGrips(show) {
      var bShow = show ? 'inline' : 'none';
      selectorManager_.selectorGripsGroup.setAttribute('display', bShow);
      var elem = this.selectedElement;
      this.hasGrips = show;
      if (elem && show) {
        this.selectorGroup.append(selectorManager_.selectorGripsGroup);
        this.updateGripCursors(getRotationAngle(elem));
      }
    }

    /**
    * Updates the selector to match the element's size
    * @param bbox - Optional bbox to use for resize (prevents duplicate getBBox call).
    */

  }, {
    key: 'resize',
    value: function resize(bbox) {
      var selectedBox = this.selectorRect,
          mgr = selectorManager_,
          selectedGrips = mgr.selectorGrips,
          selected = this.selectedElement,
          sw = selected.getAttribute('stroke-width'),
          currentZoom = svgFactory_.getCurrentZoom();
      var offset = 1 / currentZoom;
      if (selected.getAttribute('stroke') !== 'none' && !isNaN(sw)) {
        offset += sw / 2;
      }

      var tagName = selected.tagName;

      if (tagName === 'text') {
        offset += 2 / currentZoom;
      }

      // loop and transform our bounding box until we reach our first rotation
      var tlist = getTransformList(selected);
      var m = transformListToTransform(tlist).matrix;

      // This should probably be handled somewhere else, but for now
      // it keeps the selection box correctly positioned when zoomed
      m.e *= currentZoom;
      m.f *= currentZoom;

      if (!bbox) {
        bbox = getBBox(selected);
      }
      // TODO: getBBox (previous line) already knows to call getStrokedBBox when tagName === 'g'. Remove this?
      // TODO: getBBox doesn't exclude 'gsvg' and calls getStrokedBBox for any 'g'. Should getBBox be updated?
      if (tagName === 'g' && !$$8.data(selected, 'gsvg')) {
        // The bbox for a group does not include stroke vals, so we
        // get the bbox based on its children.
        var strokedBbox = getStrokedBBox([selected.childNodes]);
        if (strokedBbox) {
          bbox = strokedBbox;
        }
      }

      // apply the transforms
      var l = bbox.x,
          t = bbox.y,
          w = bbox.width,
          h = bbox.height;
      bbox = { x: l, y: t, width: w, height: h };

      // we need to handle temporary transforms too
      // if skewed, get its transformed box, then find its axis-aligned bbox

      // *
      offset *= currentZoom;

      var nbox = transformBox(l * currentZoom, t * currentZoom, w * currentZoom, h * currentZoom, m),
          aabox = nbox.aabox;

      var nbax = aabox.x - offset,
          nbay = aabox.y - offset,
          nbaw = aabox.width + offset * 2,
          nbah = aabox.height + offset * 2;

      // now if the shape is rotated, un-rotate it
      var cx = nbax + nbaw / 2,
          cy = nbay + nbah / 2;

      var angle = getRotationAngle(selected);
      if (angle) {
        var rot = svgFactory_.svgRoot().createSVGTransform();
        rot.setRotate(-angle, cx, cy);
        var rotm = rot.matrix;
        nbox.tl = transformPoint(nbox.tl.x, nbox.tl.y, rotm);
        nbox.tr = transformPoint(nbox.tr.x, nbox.tr.y, rotm);
        nbox.bl = transformPoint(nbox.bl.x, nbox.bl.y, rotm);
        nbox.br = transformPoint(nbox.br.x, nbox.br.y, rotm);

        // calculate the axis-aligned bbox
        var tl = nbox.tl;

        var minx = tl.x,
            miny = tl.y,
            maxx = tl.x,
            maxy = tl.y;

        var min = Math.min,
            max = Math.max;


        minx = min(minx, min(nbox.tr.x, min(nbox.bl.x, nbox.br.x))) - offset;
        miny = min(miny, min(nbox.tr.y, min(nbox.bl.y, nbox.br.y))) - offset;
        maxx = max(maxx, max(nbox.tr.x, max(nbox.bl.x, nbox.br.x))) + offset;
        maxy = max(maxy, max(nbox.tr.y, max(nbox.bl.y, nbox.br.y))) + offset;

        nbax = minx;
        nbay = miny;
        nbaw = maxx - minx;
        nbah = maxy - miny;
      }

      var dstr = 'M' + nbax + ',' + nbay + ' L' + (nbax + nbaw) + ',' + nbay + ' ' + (nbax + nbaw) + ',' + (nbay + nbah) + ' ' + nbax + ',' + (nbay + nbah) + 'z';
      selectedBox.setAttribute('d', dstr);

      var xform = angle ? 'rotate(' + [angle, cx, cy].join(',') + ')' : '';
      this.selectorGroup.setAttribute('transform', xform);

      // TODO(codedread): Is this needed?
      //  if (selected === selectedElements[0]) {
      this.gripCoords = {
        nw: [nbax, nbay],
        ne: [nbax + nbaw, nbay],
        sw: [nbax, nbay + nbah],
        se: [nbax + nbaw, nbay + nbah],
        n: [nbax + nbaw / 2, nbay],
        w: [nbax, nbay + nbah / 2],
        e: [nbax + nbaw, nbay + nbah / 2],
        s: [nbax + nbaw / 2, nbay + nbah]
      };
      for (var dir in this.gripCoords) {
        var coords = this.gripCoords[dir];
        selectedGrips[dir].setAttribute('cx', coords[0]);
        selectedGrips[dir].setAttribute('cy', coords[1]);
      }

      // we want to go 20 pixels in the negative transformed y direction, ignoring scale
      mgr.rotateGripConnector.setAttribute('x1', nbax + nbaw / 2);
      mgr.rotateGripConnector.setAttribute('y1', nbay);
      mgr.rotateGripConnector.setAttribute('x2', nbax + nbaw / 2);
      mgr.rotateGripConnector.setAttribute('y2', nbay - gripRadius * 5);

      mgr.rotateGrip.setAttribute('cx', nbax + nbaw / 2);
      mgr.rotateGrip.setAttribute('cy', nbay - gripRadius * 5);
      // }
    }
  }]);
  return Selector;
}();

/**
*
*/
var SelectorManager = function () {
  function SelectorManager() {
    classCallCheck(this, SelectorManager);

    // this will hold the <g> element that contains all selector rects/grips
    this.selectorParentGroup = null;

    // this is a special rect that is used for multi-select
    this.rubberBandBox = null;

    // this will hold objects of type Selector (see above)
    this.selectors = [];

    // this holds a map of SVG elements to their Selector object
    this.selectorMap = {};

    // this holds a reference to the grip elements
    this.selectorGrips = {
      nw: null,
      n: null,
      ne: null,
      e: null,
      se: null,
      s: null,
      sw: null,
      w: null
    };

    this.selectorGripsGroup = null;
    this.rotateGripConnector = null;
    this.rotateGrip = null;

    this.initGroup();
  }

  /**
  * Resets the parent selector group element
  */


  createClass(SelectorManager, [{
    key: 'initGroup',
    value: function initGroup() {
      // remove old selector parent group if it existed
      if (this.selectorParentGroup && this.selectorParentGroup.parentNode) {
        this.selectorParentGroup.remove();
      }

      // create parent selector group and add it to svgroot
      this.selectorParentGroup = svgFactory_.createSVGElement({
        element: 'g',
        attr: { id: 'selectorParentGroup' }
      });
      this.selectorGripsGroup = svgFactory_.createSVGElement({
        element: 'g',
        attr: { display: 'none' }
      });
      this.selectorParentGroup.append(this.selectorGripsGroup);
      svgFactory_.svgRoot().append(this.selectorParentGroup);

      this.selectorMap = {};
      this.selectors = [];
      this.rubberBandBox = null;

      // add the corner grips
      for (var dir in this.selectorGrips) {
        var grip = svgFactory_.createSVGElement({
          element: 'circle',
          attr: {
            id: 'selectorGrip_resize_' + dir,
            fill: '#22C',
            r: gripRadius,
            style: 'cursor:' + dir + '-resize',
            // This expands the mouse-able area of the grips making them
            // easier to grab with the mouse.
            // This works in Opera and WebKit, but does not work in Firefox
            // see https://bugzilla.mozilla.org/show_bug.cgi?id=500174
            'stroke-width': 2,
            'pointer-events': 'all'
          }
        });

        $$8.data(grip, 'dir', dir);
        $$8.data(grip, 'type', 'resize');
        this.selectorGrips[dir] = this.selectorGripsGroup.appendChild(grip);
      }

      // add rotator elems
      this.rotateGripConnector = this.selectorGripsGroup.appendChild(svgFactory_.createSVGElement({
        element: 'line',
        attr: {
          id: 'selectorGrip_rotateconnector',
          stroke: '#22C',
          'stroke-width': '1'
        }
      }));

      this.rotateGrip = this.selectorGripsGroup.appendChild(svgFactory_.createSVGElement({
        element: 'circle',
        attr: {
          id: 'selectorGrip_rotate',
          fill: 'lime',
          r: gripRadius,
          stroke: '#22C',
          'stroke-width': 2,
          style: 'cursor:url(' + config_.imgPath + 'rotate.png) 12 12, auto;'
        }
      }));
      $$8.data(this.rotateGrip, 'type', 'rotate');

      if ($$8('#canvasBackground').length) {
        return;
      }

      var dims = config_.dimensions;
      var canvasbg = svgFactory_.createSVGElement({
        element: 'svg',
        attr: {
          id: 'canvasBackground',
          width: dims[0],
          height: dims[1],
          x: 0,
          y: 0,
          overflow: isWebkit() ? 'none' : 'visible', // Chrome 7 has a problem with this when zooming out
          style: 'pointer-events:none'
        }
      });

      var rect = svgFactory_.createSVGElement({
        element: 'rect',
        attr: {
          width: '100%',
          height: '100%',
          x: 0,
          y: 0,
          'stroke-width': 1,
          stroke: '#000',
          fill: '#FFF',
          style: 'pointer-events:none'
        }
      });

      // Both Firefox and WebKit are too slow with this filter region (especially at higher
      // zoom levels) and Opera has at least one bug
      // if (!isOpera()) rect.setAttribute('filter', 'url(#canvashadow)');
      canvasbg.append(rect);
      svgFactory_.svgRoot().insertBefore(canvasbg, svgFactory_.svgContent());
      // Ok to replace above with `svgFactory_.svgContent().before(canvasbg);`?
    }

    /**
    *
    * @param elem - DOM element to get the selector for
    * @param [bbox] - Optional bbox to use for reset (prevents duplicate getBBox call).
    * @returns The selector based on the given element
    */

  }, {
    key: 'requestSelector',
    value: function requestSelector(elem, bbox) {
      if (elem == null) {
        return null;
      }

      var N = this.selectors.length;
      // If we've already acquired one for this element, return it.
      if (_typeof(this.selectorMap[elem.id]) === 'object') {
        this.selectorMap[elem.id].locked = true;
        return this.selectorMap[elem.id];
      }
      for (var i = 0; i < N; ++i) {
        if (this.selectors[i] && !this.selectors[i].locked) {
          this.selectors[i].locked = true;
          this.selectors[i].reset(elem, bbox);
          this.selectorMap[elem.id] = this.selectors[i];
          return this.selectors[i];
        }
      }
      // if we reached here, no available selectors were found, we create one
      this.selectors[N] = new Selector(N, elem, bbox);
      this.selectorParentGroup.append(this.selectors[N].selectorGroup);
      this.selectorMap[elem.id] = this.selectors[N];
      return this.selectors[N];
    }

    /**
    * Removes the selector of the given element (hides selection box)
    *
    * @param elem - DOM element to remove the selector for
    */

  }, {
    key: 'releaseSelector',
    value: function releaseSelector(elem) {
      if (elem == null) {
        return;
      }
      var N = this.selectors.length,
          sel = this.selectorMap[elem.id];
      if (!sel.locked) {
        // TODO(codedread): Ensure this exists in this module.
        console.log('WARNING! selector was released but was already unlocked');
      }
      for (var i = 0; i < N; ++i) {
        if (this.selectors[i] && this.selectors[i] === sel) {
          delete this.selectorMap[elem.id];
          sel.locked = false;
          sel.selectedElement = null;
          sel.showGrips(false);

          // remove from DOM and store reference in JS but only if it exists in the DOM
          try {
            sel.selectorGroup.setAttribute('display', 'none');
          } catch (e) {}

          break;
        }
      }
    }

    /**
    * @returns The rubberBandBox DOM element. This is the rectangle drawn by
    * the user for selecting/zooming
    */

  }, {
    key: 'getRubberBandBox',
    value: function getRubberBandBox() {
      if (!this.rubberBandBox) {
        this.rubberBandBox = this.selectorParentGroup.appendChild(svgFactory_.createSVGElement({
          element: 'rect',
          attr: {
            id: 'selectorRubberBand',
            fill: '#22C',
            'fill-opacity': 0.15,
            stroke: '#22C',
            'stroke-width': 0.5,
            display: 'none',
            style: 'pointer-events:none'
          }
        }));
      }
      return this.rubberBandBox;
    }
  }]);
  return SelectorManager;
}();

/**
 * An object that creates SVG elements for the canvas.
 *
 * interface svgedit.select.SVGFactory {
 *   SVGElement createSVGElement(jsonMap);
 *   SVGSVGElement svgRoot();
 *   SVGSVGElement svgContent();
 *
 *   Number currentZoom();
 * }
 */

/**
 * Initializes this module.
 *
 * @param config - An object containing configurable parameters (imgPath)
 * @param svgFactory - An object implementing the SVGFactory interface (see above).
 */
var init$6 = function init(config, svgFactory) {
  config_ = config;
  svgFactory_ = svgFactory;
  selectorManager_ = new SelectorManager();
};

/**
 *
 * @returns The SelectorManager instance.
 */
var getSelectorManager = function getSelectorManager() {
  return selectorManager_;
};

/* eslint-disable indent */

var $$9 = jqPluginSVG(jQuery);
var MoveElementCommand$1 = MoveElementCommand,
    InsertElementCommand$1 = InsertElementCommand,
    RemoveElementCommand$1 = RemoveElementCommand,
    ChangeElementCommand$1 = ChangeElementCommand,
    BatchCommand$1 = BatchCommand,
    UndoManager$1 = UndoManager,
    HistoryEventTypes$1 = HistoryEventTypes;


if (!window.console) {
  window.console = {};
  window.console.log = function (str) {};
  window.console.dir = function (str) {};
}

if (window.opera) {
  window.console.log = function (str) {
    opera.postError(str);
  };
  window.console.dir = function (str) {};
}

/**
* The main SvgCanvas class that manages all SVG-related functions
* @param container - The container HTML element that should hold the SVG root element
* @param {Object} config - An object that contains configuration data
*/

var SvgCanvas = function SvgCanvas(container, config) {
  classCallCheck(this, SvgCanvas);

  // Alias Namespace constants

  // Default configuration options
  var curConfig = {
    show_outside_canvas: true,
    selectNew: true,
    dimensions: [640, 480]
  };

  // Update config with new one if given
  if (config) {
    $$9.extend(curConfig, config);
  }

  // Array with width/height of canvas
  var dimensions = curConfig.dimensions;


  var canvas = this;

  // "document" element associated with the container (same as window.document using default svg-editor.js)
  // NOTE: This is not actually a SVG document, but an HTML document.
  var svgdoc = container.ownerDocument;

  // This is a container for the document being edited, not the document itself.
  var svgroot = svgdoc.importNode(text2xml('<svg id="svgroot" xmlns="' + NS.SVG + '" xlinkns="' + NS.XLINK + '" ' + 'width="' + dimensions[0] + '" height="' + dimensions[1] + '" x="' + dimensions[0] + '" y="' + dimensions[1] + '" overflow="visible">' + '<defs>' + '<filter id="canvashadow" filterUnits="objectBoundingBox">' + '<feGaussianBlur in="SourceAlpha" stdDeviation="4" result="blur"/>' + '<feOffset in="blur" dx="5" dy="5" result="offsetBlur"/>' + '<feMerge>' + '<feMergeNode in="offsetBlur"/>' + '<feMergeNode in="SourceGraphic"/>' + '</feMerge>' + '</filter>' + '</defs>' + '</svg>').documentElement, true);
  container.append(svgroot);

  // The actual element that represents the final output SVG element
  var svgcontent = svgdoc.createElementNS(NS.SVG, 'svg');

  // This function resets the svgcontent element while keeping it in the DOM.
  var clearSvgContentElement = canvas.clearSvgContentElement = function () {
    $$9(svgcontent).empty();

    // TODO: Clear out all other attributes first?
    $$9(svgcontent).attr({
      id: 'svgcontent',
      width: dimensions[0],
      height: dimensions[1],
      x: dimensions[0],
      y: dimensions[1],
      overflow: curConfig.show_outside_canvas ? 'visible' : 'hidden',
      xmlns: NS.SVG,
      'xmlns:se': NS.SE,
      'xmlns:xlink': NS.XLINK
    }).appendTo(svgroot);

    // TODO: make this string optional and set by the client
    var comment = svgdoc.createComment(' Created with SVG-edit - https://github.com/SVG-Edit/svgedit');
    svgcontent.append(comment);
  };
  clearSvgContentElement();

  // Prefix string for element IDs
  var idprefix = 'svg_';

  /**
  * Changes the ID prefix to the given value
  * @param {String} p - String with the new prefix
  */
  canvas.setIdPrefix = function (p) {
    idprefix = p;
  };

  // Current svgedit.draw.Drawing object
  // @type {svgedit.draw.Drawing}
  canvas.current_drawing_ = new Drawing(svgcontent, idprefix);

  /**
  * Returns the current Drawing.
  * @returns {svgedit.draw.Drawing}
  */
  var getCurrentDrawing = canvas.getCurrentDrawing = function () {
    return canvas.current_drawing_;
  };

  // Float displaying the current zoom level (1 = 100%, .5 = 50%, etc)
  var currentZoom = 1;

  // pointer to current group (for in-group editing)
  var currentGroup = null;

  // Object containing data for the currently selected styles
  var allProperties = {
    shape: {
      fill: (curConfig.initFill.color === 'none' ? '' : '#') + curConfig.initFill.color,
      fill_paint: null,
      fill_opacity: curConfig.initFill.opacity,
      stroke: '#' + curConfig.initStroke.color,
      stroke_paint: null,
      stroke_opacity: curConfig.initStroke.opacity,
      stroke_width: curConfig.initStroke.width,
      stroke_dasharray: 'none',
      stroke_linejoin: 'miter',
      stroke_linecap: 'butt',
      opacity: curConfig.initOpacity
    }
  };

  allProperties.text = $$9.extend(true, {}, allProperties.shape);
  $$9.extend(allProperties.text, {
    fill: '#000000',
    stroke_width: curConfig.text && curConfig.text.stroke_width,
    font_size: curConfig.text && curConfig.text.font_size,
    font_family: curConfig.text && curConfig.text.font_family
  });

  // Current shape style properties
  var curShape = allProperties.shape;

  // Array with all the currently selected elements
  // default size of 1 until it needs to grow bigger
  var selectedElements = [];

  var getJsonFromSvgElement = this.getJsonFromSvgElement = function (data) {
    // Text node
    if (data.nodeType === 3) return data.nodeValue;

    var retval = {
      element: data.tagName,
      // namespace: nsMap[data.namespaceURI],
      attr: {},
      children: []
    };

    // Iterate attributes
    for (var i = 0, attr; attr = data.attributes[i]; i++) {
      retval.attr[attr.name] = attr.value;
    }

    // Iterate children
    for (var _i = 0, node; node = data.childNodes[_i]; _i++) {
      retval.children[_i] = getJsonFromSvgElement(node);
    }

    return retval;
  };

  /**
  * Create a new SVG element based on the given object keys/values and add it to the current layer
  * The element will be ran through cleanupElement before being returned
  *
  * @param data - Object with the following keys/values:
  * @param {String} data.element - tag name of the SVG element to create
  * @param {Object} data.attr - Has key-value attributes to assign to the new element
  * @param {Boolean} [data.curStyles] - Indicates whether current style attributes should be applied first
  * @param {Array} [data.children] - Data objects to be added recursively as children
  * @param {String} [data.namespace="http://www.w3.org/2000/svg"] - Indicate a (non-SVG) namespace
  *
  * @returns The new element
  */
  var addSvgElementFromJson = this.addSvgElementFromJson = function (data) {
    if (typeof data === 'string') return svgdoc.createTextNode(data);

    var shape = getElem(data.attr.id);
    // if shape is a path but we need to create a rect/ellipse, then remove the path
    var currentLayer = getCurrentDrawing().getCurrentLayer();
    if (shape && data.element !== shape.tagName) {
      shape.remove();
      shape = null;
    }
    if (!shape) {
      var ns = data.namespace || NS.SVG;
      shape = svgdoc.createElementNS(ns, data.element);
      if (currentLayer) {
        (currentGroup || currentLayer).append(shape);
      }
    }
    if (data.curStyles) {
      assignAttributes(shape, {
        fill: curShape.fill,
        stroke: curShape.stroke,
        'stroke-width': curShape.stroke_width,
        'stroke-dasharray': curShape.stroke_dasharray,
        'stroke-linejoin': curShape.stroke_linejoin,
        'stroke-linecap': curShape.stroke_linecap,
        'stroke-opacity': curShape.stroke_opacity,
        'fill-opacity': curShape.fill_opacity,
        opacity: curShape.opacity / 2,
        style: 'pointer-events:inherit'
      }, 100);
    }
    assignAttributes(shape, data.attr, 100);
    cleanupElement(shape);

    // Children
    if (data.children) {
      data.children.forEach(function (child) {
        shape.append(addSvgElementFromJson(child));
      });
    }

    return shape;
  };

  canvas.getTransformList = getTransformList;

  canvas.matrixMultiply = matrixMultiply;
  canvas.hasMatrixTransform = hasMatrixTransform;
  canvas.transformListToTransform = transformListToTransform;

  // initialize from units.js
  // send in an object implementing the ElementContainer interface (see units.js)
  init({
    getBaseUnit: function getBaseUnit() {
      return curConfig.baseUnit;
    },

    getElement: getElem,
    getHeight: function getHeight() {
      return svgcontent.getAttribute('height') / currentZoom;
    },
    getWidth: function getWidth() {
      return svgcontent.getAttribute('width') / currentZoom;
    },
    getRoundDigits: function getRoundDigits() {
      return saveOptions.round_digits;
    }
  });

  canvas.convertToNum = convertToNum;

  var getSVGContent = function getSVGContent() {
    return svgcontent;
  };

  /**
  * @returns {Array} the array with selected DOM elements
  */
  var getSelectedElements = this.getSelectedElems = function () {
    return selectedElements;
  };

  var pathActions$$1 = pathActions;

  init$2({
    pathActions: pathActions$$1, // Ok since not modifying
    getSVGContent: getSVGContent,
    addSvgElementFromJson: addSvgElementFromJson,
    getSelectedElements: getSelectedElements,
    getDOMDocument: function getDOMDocument() {
      return svgdoc;
    },
    getDOMContainer: function getDOMContainer() {
      return container;
    },
    getSVGRoot: function getSVGRoot() {
      return svgroot;
    },

    // TODO: replace this mostly with a way to get the current drawing.
    getBaseUnit: function getBaseUnit() {
      return curConfig.baseUnit;
    },
    getSnappingStep: function getSnappingStep() {
      return curConfig.snappingStep;
    }
  });

  canvas.findDefs = findDefs;
  canvas.getUrlFromAttr = getUrlFromAttr;
  canvas.getHref = getHref;
  canvas.setHref = setHref;
  /* const getBBox = */canvas.getBBox = getBBox;
  canvas.getRotationAngle = getRotationAngle;
  canvas.getElem = getElem;
  canvas.getRefElem = getRefElem;
  canvas.assignAttributes = assignAttributes;
  this.cleanupElement = cleanupElement;

  var getGridSnapping = function getGridSnapping() {
    return curConfig.gridSnapping;
  };
  init$4({
    getDrawing: function getDrawing() {
      return getCurrentDrawing();
    },
    getSVGRoot: function getSVGRoot() {
      return svgroot;
    },

    getGridSnapping: getGridSnapping
  });
  this.remapElement = remapElement;

  init$5({
    getSVGRoot: function getSVGRoot() {
      return svgroot;
    },
    getStartTransform: function getStartTransform() {
      return startTransform;
    },
    setStartTransform: function setStartTransform(transform) {
      startTransform = transform;
    }
  });
  this.recalculateDimensions = recalculateDimensions;

  // import from sanitize.js
  var nsMap = getReverseNS();
  canvas.sanitizeSvg = sanitizeSvg;

  // Implement the svgedit.history.HistoryEventHandler interface.
  var undoMgr = canvas.undoMgr = new UndoManager$1({
    handleHistoryEvent: function handleHistoryEvent(eventType, cmd) {
      var EventTypes = HistoryEventTypes$1;
      // TODO: handle setBlurOffsets.
      if (eventType === EventTypes.BEFORE_UNAPPLY || eventType === EventTypes.BEFORE_APPLY) {
        canvas.clearSelection();
      } else if (eventType === EventTypes.AFTER_APPLY || eventType === EventTypes.AFTER_UNAPPLY) {
        var elems = cmd.elements();
        canvas.pathActions.clear();
        call('changed', elems);
        var cmdType = cmd.type();
        var isApply = eventType === EventTypes.AFTER_APPLY;
        if (cmdType === MoveElementCommand$1.type()) {
          var parent = isApply ? cmd.newParent : cmd.oldParent;
          if (parent === svgcontent) {
            identifyLayers();
          }
        } else if (cmdType === InsertElementCommand$1.type() || cmdType === RemoveElementCommand$1.type()) {
          if (cmd.parent === svgcontent) {
            identifyLayers();
          }
          if (cmdType === InsertElementCommand$1.type()) {
            if (isApply) {
              restoreRefElems(cmd.elem);
            }
          } else {
            if (!isApply) {
              restoreRefElems(cmd.elem);
            }
          }
          if (cmd.elem.tagName === 'use') {
            setUseData(cmd.elem);
          }
        } else if (cmdType === ChangeElementCommand$1.type()) {
          // if we are changing layer names, re-identify all layers
          if (cmd.elem.tagName === 'title' && cmd.elem.parentNode.parentNode === svgcontent) {
            identifyLayers();
          }
          var values = isApply ? cmd.newValues : cmd.oldValues;
          // If stdDeviation was changed, update the blur.
          if (values.stdDeviation) {
            canvas.setBlurOffsets(cmd.elem.parentNode, values.stdDeviation);
          }
          // This is resolved in later versions of webkit, perhaps we should
          // have a featured detection for correct 'use' behavior?
          // ——————————
          // Remove & Re-add hack for Webkit (issue 775)
          // if (cmd.elem.tagName === 'use' && isWebkit()) {
          //  const {elem} = cmd;
          //  if (!elem.getAttribute('x') && !elem.getAttribute('y')) {
          //    const parent = elem.parentNode;
          //    const sib = elem.nextSibling;
          //    elem.remove();
          //    parent.insertBefore(elem, sib);
          //    // Ok to replace above with this? `sib.before(elem);`
          //  }
          // }
        }
      }
    }
  });
  var addCommandToHistory = function addCommandToHistory(cmd) {
    canvas.undoMgr.addCommandToHistory(cmd);
  };

  /**
  * @returns The current zoom level
  */
  var getCurrentZoom = this.getZoom = function () {
    return currentZoom;
  };

  /**
  * This method rounds the incoming value to the nearest value based on the `currentZoom`
  * @param {Number} val
  * @returns Rounded value to nearest value based on `currentZoom`
  */
  var round = this.round = function (val) {
    return parseInt(val * currentZoom, 10) / currentZoom;
  };

  // import from select.js
  init$6(curConfig, {
    createSVGElement: function createSVGElement(jsonMap) {
      return canvas.addSvgElementFromJson(jsonMap);
    },
    svgRoot: function svgRoot() {
      return svgroot;
    },
    svgContent: function svgContent() {
      return svgcontent;
    },

    getCurrentZoom: getCurrentZoom
  });
  // this object manages selectors for us
  var selectorManager = this.selectorManager = getSelectorManager();

  var getNextId = canvas.getNextId = function () {
    return getCurrentDrawing().getNextId();
  };
  var getId = canvas.getId = function () {
    return getCurrentDrawing().getId();
  };

  /**
  * Run the callback function associated with the given event
  * @param ev - String with the event name
  * @param arg - Argument to pass through to the callback function
  */
  var call = function call(ev, arg) {
    if (events[ev]) {
      return events[ev](window, arg);
    }
  };

  /**
  * Clears the selection. The 'selected' handler is then called.
  * @param {Boolean} [noCall] - When true does not call the "selected" handler
  */
  var clearSelection = function clearSelection(noCall) {
    selectedElements.map(function (elem) {
      if (elem == null) return;

      selectorManager.releaseSelector(elem);
    });
    selectedElements = [];

    if (!noCall) {
      call('selected', selectedElements);
    }
  };

  /**
  * Adds a list of elements to the selection. The 'selected' handler is then called.
  * @param {Array} elemsToAdd - An array of DOM elements to add to the selection
  * @param {Boolean} showGrips - Indicates whether the resize grips should be shown
  */
  var addToSelection = function addToSelection(elemsToAdd, showGrips) {
    if (!elemsToAdd.length) {
      return;
    }
    // find the first null in our selectedElements array

    var j = 0;
    while (j < selectedElements.length) {
      if (selectedElements[j] == null) {
        break;
      }
      ++j;
    }

    // now add each element consecutively
    var i = elemsToAdd.length;
    while (i--) {
      var elem = elemsToAdd[i];
      if (!elem) {
        continue;
      }
      var bbox = getBBox(elem);
      if (!bbox) {
        continue;
      }

      if (elem.tagName === 'a' && elem.childNodes.length === 1) {
        // Make "a" element's child be the selected element
        elem = elem.firstChild;
      }

      // if it's not already there, add it
      if (!selectedElements.includes(elem)) {
        selectedElements[j] = elem;

        // only the first selectedBBoxes element is ever used in the codebase these days
        // if (j === 0) selectedBBoxes[0] = utilsGetBBox(elem);
        j++;
        var sel = selectorManager.requestSelector(elem, bbox);

        if (selectedElements.length > 1) {
          sel.showGrips(false);
        }
      }
    }
    call('selected', selectedElements);

    if (showGrips || selectedElements.length === 1) {
      selectorManager.requestSelector(selectedElements[0]).showGrips(true);
    } else {
      selectorManager.requestSelector(selectedElements[0]).showGrips(false);
    }

    // make sure the elements are in the correct order
    // See: https://www.w3.org/TR/DOM-Level-3-Core/core.html#Node3-compareDocumentPosition

    selectedElements.sort(function (a, b) {
      if (a && b && a.compareDocumentPosition) {
        return 3 - (b.compareDocumentPosition(a) & 6);
      }
      if (a == null) {
        return 1;
      }
    });

    // Make sure first elements are not null
    while (selectedElements[0] == null) {
      selectedElements.shift(0);
    }
  };

  var getOpacity = function getOpacity() {
    return curShape.opacity;
  };

  /**
  * Gets the desired element from a mouse event
  * @param evt - Event object from the mouse event
  * @returns DOM element we want
  */
  var getMouseTarget = this.getMouseTarget = function (evt) {
    if (evt == null) {
      return null;
    }
    var mouseTarget = evt.target;

    // if it was a <use>, Opera and WebKit return the SVGElementInstance
    if (mouseTarget.correspondingUseElement) {
      mouseTarget = mouseTarget.correspondingUseElement;
    }

    // for foreign content, go up until we find the foreignObject
    // WebKit browsers set the mouse target to the svgcanvas div
    if ([NS.MATH, NS.HTML].includes(mouseTarget.namespaceURI) && mouseTarget.id !== 'svgcanvas') {
      while (mouseTarget.nodeName !== 'foreignObject') {
        mouseTarget = mouseTarget.parentNode;
        if (!mouseTarget) {
          return svgroot;
        }
      }
    }

    // Get the desired mouseTarget with jQuery selector-fu
    // If it's root-like, select the root
    var currentLayer = getCurrentDrawing().getCurrentLayer();
    if ([svgroot, container, svgcontent, currentLayer].includes(mouseTarget)) {
      return svgroot;
    }

    var $target = $$9(mouseTarget);

    // If it's a selection grip, return the grip parent
    if ($target.closest('#selectorParentGroup').length) {
      // While we could instead have just returned mouseTarget,
      // this makes it easier to indentify as being a selector grip
      return selectorManager.selectorParentGroup;
    }

    while (mouseTarget.parentNode !== (currentGroup || currentLayer)) {
      mouseTarget = mouseTarget.parentNode;
    }

    //
    // // go up until we hit a child of a layer
    // while (mouseTarget.parentNode.parentNode.tagName == 'g') {
    //   mouseTarget = mouseTarget.parentNode;
    // }
    // Webkit bubbles the mouse event all the way up to the div, so we
    // set the mouseTarget to the svgroot like the other browsers
    // if (mouseTarget.nodeName.toLowerCase() == 'div') {
    //   mouseTarget = svgroot;
    // }

    return mouseTarget;
  };

  canvas.pathActions = pathActions$$1;
  function resetD(p) {
    p.setAttribute('d', pathActions$$1.convertPath(p));
  }
  init$1({
    selectorManager: selectorManager, // Ok since not changing
    canvas: canvas, // Ok since not changing
    call: call,
    resetD: resetD,
    round: round,
    clearSelection: clearSelection,
    addToSelection: addToSelection,
    addCommandToHistory: addCommandToHistory,
    remapElement: remapElement,
    addSvgElementFromJson: addSvgElementFromJson,
    getGridSnapping: getGridSnapping,
    getOpacity: getOpacity,
    getSelectedElements: getSelectedElements,
    getContainer: function getContainer() {
      return container;
    },
    setStarted: function setStarted(s) {
      started = s;
    },
    getRubberBox: function getRubberBox() {
      return rubberBox;
    },
    setRubberBox: function setRubberBox(rb) {
      rubberBox = rb;
      return rubberBox;
    },
    addPtsToSelection: function addPtsToSelection(_ref) {
      var closedSubpath = _ref.closedSubpath,
          grips = _ref.grips;

      // TODO: Correct this:
      pathActions$$1.canDeleteNodes = true;
      pathActions$$1.closed_subpath = closedSubpath;
      call('pointsAdded', { closedSubpath: closedSubpath, grips: grips });
      call('selected', grips);
    },
    endChanges: function endChanges(_ref2) {
      var cmd = _ref2.cmd,
          elem = _ref2.elem;

      addCommandToHistory(cmd);
      call('changed', [elem]);
    },

    getCurrentZoom: getCurrentZoom,
    getId: getId,
    getNextId: getNextId,
    getMouseTarget: getMouseTarget,
    getCurrentMode: function getCurrentMode() {
      return currentMode;
    },
    setCurrentMode: function setCurrentMode(cm) {
      currentMode = cm;
      return currentMode;
    },
    getDrawnPath: function getDrawnPath() {
      return drawnPath;
    },
    setDrawnPath: function setDrawnPath(dp) {
      drawnPath = dp;
      return drawnPath;
    },
    getSVGRoot: function getSVGRoot() {
      return svgroot;
    }
  });

  // Interface strings, usually for title elements
  var uiStrings = {};

  var visElems = 'a,circle,ellipse,foreignObject,g,image,line,path,polygon,polyline,rect,svg,text,tspan,use';
  var refAttrs = ['clip-path', 'fill', 'filter', 'marker-end', 'marker-mid', 'marker-start', 'mask', 'stroke'];

  var elData = $$9.data;

  // Animation element to change the opacity of any newly created element
  var opacAni = document.createElementNS(NS.SVG, 'animate');
  $$9(opacAni).attr({
    attributeName: 'opacity',
    begin: 'indefinite',
    dur: 1,
    fill: 'freeze'
  }).appendTo(svgroot);

  var restoreRefElems = function restoreRefElems(elem) {
    // Look for missing reference elements, restore any found
    var attrs = $$9(elem).attr(refAttrs);
    for (var o in attrs) {
      var val = attrs[o];
      if (val && val.startsWith('url(')) {
        var id = getUrlFromAttr(val).substr(1);
        var ref = getElem(id);
        if (!ref) {
          findDefs().append(removedElements[id]);
          delete removedElements[id];
        }
      }
    }

    var childs = elem.getElementsByTagName('*');

    if (childs.length) {
      for (var i = 0, l = childs.length; i < l; i++) {
        restoreRefElems(childs[i]);
      }
    }
  };

  // (function () {
  // TODO For Issue 208: this is a start on a thumbnail
  //  const svgthumb = svgdoc.createElementNS(NS.SVG, 'use');
  //  svgthumb.setAttribute('width', '100');
  //  svgthumb.setAttribute('height', '100');
  //  setHref(svgthumb, '#svgcontent');
  //  svgroot.append(svgthumb);
  // }());

  // Object to contain image data for raster images that were found encodable
  var encodableImages = {},


  // Object with save options
  saveOptions = { round_digits: 5 },


  // Object with IDs for imported files, to see if one was already added
  importIds = {},


  // Current text style properties
  curText = allProperties.text,


  // Object to contain all included extensions
  extensions = {},


  // Map of deleted reference elements
  removedElements = {};

  var
  // String with image URL of last loadable image
  lastGoodImgUrl = curConfig.imgPath + 'logo.png',


  // Boolean indicating whether or not a draw action has been started
  started = false,


  // String with an element's initial transform attribute value
  startTransform = null,


  // String indicating the current editor mode
  currentMode = 'select',


  // String with the current direction in which an element is being resized
  currentResizeMode = 'none',


  // Current general properties
  curProperties = curShape,


  // Array with selected elements' Bounding box object
  // selectedBBoxes = new Array(1),

  // The DOM element that was just selected
  justSelected = null,


  // DOM element for selection rectangle drawn by the user
  rubberBox = null,


  // Array of current BBoxes, used in getIntersectionList().
  curBBoxes = [],


  // Canvas point for the most recent right click
  lastClickPoint = null;

  // Should this return an array by default, so extension results aren't overwritten?
  var runExtensions = this.runExtensions = function (action, vars, returnArray) {
    var result = returnArray ? [] : false;
    $$9.each(extensions, function (name, opts) {
      if (opts && action in opts) {
        if (returnArray) {
          result.push(opts[action](vars));
        } else {
          result = opts[action](vars);
        }
      }
    });
    return result;
  };

  /**
  * Add an extension to the editor
  * @param {String} name - String with the ID of the extension
  * @param {Function} extFunc - Function supplied by the extension with its data
  */
  this.addExtension = function (name, extFunc) {
    var ext = void 0;
    if (!(name in extensions)) {
      // Provide private vars/funcs here. Is there a better way to do this?
      var argObj = $$9.extend(canvas.getPrivateMethods(), {
        svgroot: svgroot,
        svgcontent: svgcontent,
        nonce: getCurrentDrawing().getNonce(),
        selectorManager: selectorManager
      });
      if (typeof extFunc === 'function') {
        ext = extFunc(argObj);
      } else {
        ext = extFunc;
        if (ext.callback) {
          ext.callback = ext.callback.bind(ext, argObj);
        }
      }
      extensions[name] = ext;
      call('extension_added', ext);
    } else {
      console.log('Cannot add extension "' + name + '", an extension by that name already exists.');
    }
  };

  /**
  * This method sends back an array or a NodeList full of elements that
  * intersect the multi-select rubber-band-box on the currentLayer only.
  *
  * We brute-force getIntersectionList for browsers that do not support it (Firefox).
  *
  * Reference:
  * Firefox does not implement getIntersectionList(), see https://bugzilla.mozilla.org/show_bug.cgi?id=501421
  * @param rect
  * @returns {Array|NodeList} Bbox elements
  */
  var getIntersectionList = this.getIntersectionList = function (rect) {
    if (rubberBox == null) {
      return null;
    }

    var parent = currentGroup || getCurrentDrawing().getCurrentLayer();

    var rubberBBox = void 0;
    if (!rect) {
      rubberBBox = rubberBox.getBBox();
      var bb = svgcontent.createSVGRect();

      for (var o in rubberBBox) {
        bb[o] = rubberBBox[o] / currentZoom;
      }
      rubberBBox = bb;
    } else {
      rubberBBox = svgcontent.createSVGRect();
      rubberBBox.x = rect.x;
      rubberBBox.y = rect.y;
      rubberBBox.width = rect.width;
      rubberBBox.height = rect.height;
    }

    var resultList = null;
    if (!isIE) {
      if (typeof svgroot.getIntersectionList === 'function') {
        // Offset the bbox of the rubber box by the offset of the svgcontent element.
        rubberBBox.x += parseInt(svgcontent.getAttribute('x'), 10);
        rubberBBox.y += parseInt(svgcontent.getAttribute('y'), 10);

        resultList = svgroot.getIntersectionList(rubberBBox, parent);
      }
    }

    if (resultList == null || typeof resultList.item !== 'function') {
      resultList = [];

      if (!curBBoxes.length) {
        // Cache all bboxes
        curBBoxes = getVisibleElementsAndBBoxes(parent);
      }
      var i = curBBoxes.length;
      while (i--) {
        if (!rubberBBox.width) {
          continue;
        }
        if (rectsIntersect(rubberBBox, curBBoxes[i].bbox)) {
          resultList.push(curBBoxes[i].elem);
        }
      }
    }

    // addToSelection expects an array, but it's ok to pass a NodeList
    // because using square-bracket notation is allowed:
    // https://www.w3.org/TR/DOM-Level-2-Core/ecma-script-binding.html
    return resultList;
  };

  this.getStrokedBBox = getStrokedBBoxDefaultVisible;

  this.getVisibleElements = getVisibleElements;

  /**
  * Get all elements that have a BBox (excludes &lt;defs>, &lt;title>, etc).
  * Note that 0-opacity, off-screen etc elements are still considered "visible"
  * for this function
  * @param parent - The parent DOM element to search within
  * @returns {Array} An array with objects that include:
  * - elem - The element
  * - bbox - The element's BBox as retrieved from `getStrokedBBoxDefaultVisible`
  */
  var getVisibleElementsAndBBoxes = this.getVisibleElementsAndBBoxes = function (parent) {
    if (!parent) {
      parent = $$9(svgcontent).children(); // Prevent layers from being included
    }
    var contentElems = [];
    $$9(parent).children().each(function (i, elem) {
      if (elem.getBBox) {
        contentElems.push({ elem: elem, bbox: getStrokedBBoxDefaultVisible([elem]) });
      }
    });
    return contentElems.reverse();
  };

  /**
  * Wrap an SVG element into a group element, mark the group as 'gsvg'
  * @param elem - SVG element to wrap
  */
  var groupSvgElem = this.groupSvgElem = function (elem) {
    var g = document.createElementNS(NS.SVG, 'g');
    elem.replaceWith(g);
    $$9(g).append(elem).data('gsvg', elem)[0].id = getNextId();
  };

  // Set scope for these functions

  // Object to contain editor event names and callback functions
  var events = {};

  canvas.call = call;

  /**
  * Attaches a callback function to an event
  * @param {String} ev - String indicating the name of the event
  * @param {Function} f - The callback function to bind to the event
  * @returns The previous event
  */
  canvas.bind = function (ev, f) {
    var old = events[ev];
    events[ev] = f;
    return old;
  };

  /**
  * Runs the SVG Document through the sanitizer and then updates its paths.
  * @param newDoc - The SVG DOM document
  */
  this.prepareSvg = function (newDoc) {
    this.sanitizeSvg(newDoc.documentElement);

    // convert paths into absolute commands
    var paths = newDoc.getElementsByTagNameNS(NS.SVG, 'path');
    for (var i = 0, len = paths.length; i < len; ++i) {
      var path$$1 = paths[i];
      path$$1.setAttribute('d', pathActions$$1.convertPath(path$$1));
      pathActions$$1.fixEnd(path$$1);
    }
  };

  /**
  * Hack for Firefox bugs where text element features aren't updated or get
  * messed up. See issue 136 and issue 137.
  * This function clones the element and re-selects it
  * @todo Test for this bug on load and add it to "support" object instead of
  * browser sniffing
  * @param elem - The (text) DOM element to clone
  * @returns Cloned element
  */
  var ffClone = function ffClone(elem) {
    if (!isGecko()) {
      return elem;
    }
    var clone = elem.cloneNode(true);
    elem.before(clone);
    elem.remove();
    selectorManager.releaseSelector(elem);
    selectedElements[0] = clone;
    selectorManager.requestSelector(clone).showGrips(true);
    return clone;
  };

  // this.each is deprecated, if any extension used this it can be recreated by doing this:
  // $(canvas.getRootElem()).children().each(...)

  // this.each = function (cb) {
  //  $(svgroot).children().each(cb);
  // };

  /**
  * Removes any old rotations if present, prepends a new rotation at the
  * transformed center
  * @param val - The new rotation angle in degrees
  * @param {Boolean} preventUndo - Indicates whether the action should be undoable or not
  */
  this.setRotationAngle = function (val, preventUndo) {
    // ensure val is the proper type
    val = parseFloat(val);
    var elem = selectedElements[0];
    var oldTransform = elem.getAttribute('transform');
    var bbox = getBBox(elem);
    var cx = bbox.x + bbox.width / 2,
        cy = bbox.y + bbox.height / 2;
    var tlist = getTransformList(elem);

    // only remove the real rotational transform if present (i.e. at index=0)
    if (tlist.numberOfItems > 0) {
      var xform = tlist.getItem(0);
      if (xform.type === 4) {
        tlist.removeItem(0);
      }
    }
    // find Rnc and insert it
    if (val !== 0) {
      var center = transformPoint(cx, cy, transformListToTransform(tlist).matrix);
      var Rnc = svgroot.createSVGTransform();
      Rnc.setRotate(val, center.x, center.y);
      if (tlist.numberOfItems) {
        tlist.insertItemBefore(Rnc, 0);
      } else {
        tlist.appendItem(Rnc);
      }
    } else if (tlist.numberOfItems === 0) {
      elem.removeAttribute('transform');
    }

    if (!preventUndo) {
      // we need to undo it, then redo it so it can be undo-able! :)
      // TODO: figure out how to make changes to transform list undo-able cross-browser?
      var newTransform = elem.getAttribute('transform');
      elem.setAttribute('transform', oldTransform);
      changeSelectedAttribute('transform', newTransform, selectedElements);
      call('changed', selectedElements);
    }
    // const pointGripContainer = getElem('pathpointgrip_container');
    // if (elem.nodeName === 'path' && pointGripContainer) {
    //   pathActions.setPointContainerTransform(elem.getAttribute('transform'));
    // }
    var selector = selectorManager.requestSelector(selectedElements[0]);
    selector.resize();
    selector.updateGripCursors(val);
  };

  // Runs recalculateDimensions on the selected elements,
  // adding the changes to a single batch command
  var recalculateAllSelectedDimensions = this.recalculateAllSelectedDimensions = function () {
    var text = currentResizeMode === 'none' ? 'position' : 'size';
    var batchCmd = new BatchCommand$1(text);

    var i = selectedElements.length;
    while (i--) {
      var elem = selectedElements[i];
      // if (getRotationAngle(elem) && !hasMatrixTransform(getTransformList(elem))) { continue; }
      var cmd = recalculateDimensions(elem);
      if (cmd) {
        batchCmd.addSubCommand(cmd);
      }
    }

    if (!batchCmd.isEmpty()) {
      addCommandToHistory(batchCmd);
      call('changed', selectedElements);
    }
  };

  // Debug tool to easily see the current matrix in the browser's console
  var logMatrix = function logMatrix(m) {
    console.log([m.a, m.b, m.c, m.d, m.e, m.f]);
  };

  // Root Current Transformation Matrix in user units
  var rootSctm = null;

  /**
  * Group: Selection
  */

  this.clearSelection = clearSelection;

  // TODO: do we need to worry about selectedBBoxes here?

  this.addToSelection = addToSelection;

  /**
  * Selects only the given elements, shortcut for clearSelection(); addToSelection()
  * @param {Array} elems - an array of DOM elements to be selected
  */
  var selectOnly = this.selectOnly = function (elems, showGrips) {
    clearSelection(true);
    addToSelection(elems, showGrips);
  };

  // TODO: could use slice here to make this faster?
  // TODO: should the 'selected' handler

  /**
  * Removes elements from the selection.
  * @param {Array} elemsToRemove - an array of elements to remove from selection
  */
  /* const removeFromSelection = */this.removeFromSelection = function (elemsToRemove) {
    if (selectedElements[0] == null) {
      return;
    }
    if (!elemsToRemove.length) {
      return;
    }

    // find every element and remove it from our array copy
    var newSelectedItems = [],
        len = selectedElements.length;
    for (var i = 0; i < len; ++i) {
      var elem = selectedElements[i];
      if (elem) {
        // keep the item
        if (!elemsToRemove.includes(elem)) {
          newSelectedItems.push(elem);
        } else {
          // remove the item and its selector
          selectorManager.releaseSelector(elem);
        }
      }
    }
    // the copy becomes the master now
    selectedElements = newSelectedItems;
  };

  // Clears the selection, then adds all elements in the current layer to the selection.
  this.selectAllInCurrentLayer = function () {
    var currentLayer = getCurrentDrawing().getCurrentLayer();
    if (currentLayer) {
      currentMode = 'select';
      selectOnly($$9(currentGroup || currentLayer).children());
    }
  };

  var drawnPath = null;

  // Mouse events
  (function () {
    var freehand = {
      minx: null,
      miny: null,
      maxx: null,
      maxy: null
    };
    var THRESHOLD_DIST = 0.8,
        STEP_COUNT = 10;
    var dAttr = null,
        startX = null,
        startY = null,
        rStartX = null,
        rStartY = null,
        initBbox = {},
        sumDistance = 0,
        controllPoint2 = { x: 0, y: 0 },
        controllPoint1 = { x: 0, y: 0 },
        start = { x: 0, y: 0 },
        end = { x: 0, y: 0 },
        bSpline = { x: 0, y: 0 },
        nextPos = { x: 0, y: 0 },
        parameter = void 0,
        nextParameter = void 0;

    var getBsplinePoint = function getBsplinePoint(t) {
      var spline = { x: 0, y: 0 },
          p0 = controllPoint2,
          p1 = controllPoint1,
          p2 = start,
          p3 = end,
          S = 1.0 / 6.0,
          t2 = t * t,
          t3 = t2 * t;

      var m = [[-1, 3, -3, 1], [3, -6, 3, 0], [-3, 0, 3, 0], [1, 4, 1, 0]];

      spline.x = S * ((p0.x * m[0][0] + p1.x * m[0][1] + p2.x * m[0][2] + p3.x * m[0][3]) * t3 + (p0.x * m[1][0] + p1.x * m[1][1] + p2.x * m[1][2] + p3.x * m[1][3]) * t2 + (p0.x * m[2][0] + p1.x * m[2][1] + p2.x * m[2][2] + p3.x * m[2][3]) * t + (p0.x * m[3][0] + p1.x * m[3][1] + p2.x * m[3][2] + p3.x * m[3][3]));
      spline.y = S * ((p0.y * m[0][0] + p1.y * m[0][1] + p2.y * m[0][2] + p3.y * m[0][3]) * t3 + (p0.y * m[1][0] + p1.y * m[1][1] + p2.y * m[1][2] + p3.y * m[1][3]) * t2 + (p0.y * m[2][0] + p1.y * m[2][1] + p2.y * m[2][2] + p3.y * m[2][3]) * t + (p0.y * m[3][0] + p1.y * m[3][1] + p2.y * m[3][2] + p3.y * m[3][3]));

      return {
        x: spline.x,
        y: spline.y
      };
    };
    // - when we are in a create mode, the element is added to the canvas
    // but the action is not recorded until mousing up
    // - when we are in select mode, select the element, remember the position
    // and do nothing else
    var mouseDown = function mouseDown(evt) {
      if (canvas.spaceKey || evt.button === 1) {
        return;
      }

      var rightClick = evt.button === 2;

      if (evt.altKey) {
        // duplicate when dragging
        canvas.cloneSelectedElements(0, 0);
      }

      rootSctm = $$9('#svgcontent g')[0].getScreenCTM().inverse();

      var pt = transformPoint(evt.pageX, evt.pageY, rootSctm),
          mouseX = pt.x * currentZoom,
          mouseY = pt.y * currentZoom;

      evt.preventDefault();

      if (rightClick) {
        currentMode = 'select';
        lastClickPoint = pt;
      }

      // This would seem to be unnecessary...
      // if (!['select', 'resize'].includes(currentMode)) {
      //   setGradient();
      // }

      var x = mouseX / currentZoom,
          y = mouseY / currentZoom;
      var mouseTarget = getMouseTarget(evt);

      if (mouseTarget.tagName === 'a' && mouseTarget.childNodes.length === 1) {
        mouseTarget = mouseTarget.firstChild;
      }

      // realX/y ignores grid-snap value
      var realX = x;
      rStartX = startX = x;
      var realY = y;
      rStartY = startY = y;

      if (curConfig.gridSnapping) {
        x = snapToGrid(x);
        y = snapToGrid(y);
        startX = snapToGrid(startX);
        startY = snapToGrid(startY);
      }

      // if it is a selector grip, then it must be a single element selected,
      // set the mouseTarget to that and update the mode to rotate/resize

      if (mouseTarget === selectorManager.selectorParentGroup && selectedElements[0] != null) {
        var grip = evt.target;
        var griptype = elData(grip, 'type');
        // rotating
        if (griptype === 'rotate') {
          currentMode = 'rotate';
          // resizing
        } else if (griptype === 'resize') {
          currentMode = 'resize';
          currentResizeMode = elData(grip, 'dir');
        }
        mouseTarget = selectedElements[0];
      }

      startTransform = mouseTarget.getAttribute('transform');
      var i = void 0,
          strokeW = void 0;
      var tlist = getTransformList(mouseTarget);
      switch (currentMode) {
        case 'select':
          started = true;
          currentResizeMode = 'none';
          if (rightClick) {
            started = false;
          }

          if (mouseTarget !== svgroot) {
            // if this element is not yet selected, clear selection and select it
            if (!selectedElements.includes(mouseTarget)) {
              // only clear selection if shift is not pressed (otherwise, add
              // element to selection)
              if (!evt.shiftKey) {
                // No need to do the call here as it will be done on addToSelection
                clearSelection(true);
              }
              addToSelection([mouseTarget]);
              justSelected = mouseTarget;
              pathActions$$1.clear();
            }
            // else if it's a path, go into pathedit mode in mouseup

            if (!rightClick) {
              // insert a dummy transform so if the element(s) are moved it will have
              // a transform to use for its translate
              for (i = 0; i < selectedElements.length; ++i) {
                if (selectedElements[i] == null) {
                  continue;
                }
                var slist = getTransformList(selectedElements[i]);
                if (slist.numberOfItems) {
                  slist.insertItemBefore(svgroot.createSVGTransform(), 0);
                } else {
                  slist.appendItem(svgroot.createSVGTransform());
                }
              }
            }
          } else if (!rightClick) {
            clearSelection();
            currentMode = 'multiselect';
            if (rubberBox == null) {
              rubberBox = selectorManager.getRubberBandBox();
            }
            rStartX *= currentZoom;
            rStartY *= currentZoom;
            // console.log('p',[evt.pageX, evt.pageY]);
            // console.log('c',[evt.clientX, evt.clientY]);
            // console.log('o',[evt.offsetX, evt.offsetY]);
            // console.log('s',[startX, startY]);

            assignAttributes(rubberBox, {
              x: rStartX,
              y: rStartY,
              width: 0,
              height: 0,
              display: 'inline'
            }, 100);
          }
          break;
        case 'zoom':
          started = true;
          if (rubberBox == null) {
            rubberBox = selectorManager.getRubberBandBox();
          }
          assignAttributes(rubberBox, {
            x: realX * currentZoom,
            y: realX * currentZoom,
            width: 0,
            height: 0,
            display: 'inline'
          }, 100);
          break;
        case 'resize':
          started = true;
          startX = x;
          startY = y;

          // Getting the BBox from the selection box, since we know we
          // want to orient around it
          initBbox = getBBox($$9('#selectedBox0')[0]);
          var bb = {};
          $$9.each(initBbox, function (key, val) {
            bb[key] = val / currentZoom;
          });
          initBbox = bb;

          // append three dummy transforms to the tlist so that
          // we can translate,scale,translate in mousemove
          var pos = getRotationAngle(mouseTarget) ? 1 : 0;

          if (hasMatrixTransform(tlist)) {
            tlist.insertItemBefore(svgroot.createSVGTransform(), pos);
            tlist.insertItemBefore(svgroot.createSVGTransform(), pos);
            tlist.insertItemBefore(svgroot.createSVGTransform(), pos);
          } else {
            tlist.appendItem(svgroot.createSVGTransform());
            tlist.appendItem(svgroot.createSVGTransform());
            tlist.appendItem(svgroot.createSVGTransform());

            if (supportsNonScalingStroke()) {
              // Handle crash for newer Chrome and Safari 6 (Mobile and Desktop):
              // https://code.google.com/p/svg-edit/issues/detail?id=904
              // Chromium issue: https://code.google.com/p/chromium/issues/detail?id=114625
              // TODO: Remove this workaround once vendor fixes the issue
              var iswebkit = isWebkit();

              var delayedStroke = void 0;
              if (iswebkit) {
                delayedStroke = function delayedStroke(ele) {
                  var _stroke = ele.getAttributeNS(null, 'stroke');
                  ele.removeAttributeNS(null, 'stroke');
                  // Re-apply stroke after delay. Anything higher than 1 seems to cause flicker
                  if (_stroke !== null) setTimeout(function () {
                    ele.setAttributeNS(null, 'stroke', _stroke);
                  }, 0);
                };
              }
              mouseTarget.style.vectorEffect = 'non-scaling-stroke';
              if (iswebkit) {
                delayedStroke(mouseTarget);
              }

              var all = mouseTarget.getElementsByTagName('*'),
                  len = all.length;
              for (i = 0; i < len; i++) {
                if (!all[i].style) {
                  // mathML
                  continue;
                }
                all[i].style.vectorEffect = 'non-scaling-stroke';
                if (iswebkit) {
                  delayedStroke(all[i]);
                }
              }
            }
          }
          break;
        case 'fhellipse':
        case 'fhrect':
        case 'fhpath':
          start.x = realX;
          start.y = realY;
          started = true;
          dAttr = realX + ',' + realY + ' ';
          strokeW = parseFloat(curShape.stroke_width) === 0 ? 1 : curShape.stroke_width;
          addSvgElementFromJson({
            element: 'polyline',
            curStyles: true,
            attr: {
              points: dAttr,
              id: getNextId(),
              fill: 'none',
              opacity: curShape.opacity / 2,
              'stroke-linecap': 'round',
              style: 'pointer-events:none'
            }
          });
          freehand.minx = realX;
          freehand.maxx = realX;
          freehand.miny = realY;
          freehand.maxy = realY;
          break;
        case 'image':
          started = true;
          var newImage = addSvgElementFromJson({
            element: 'image',
            attr: {
              x: x,
              y: y,
              width: 0,
              height: 0,
              id: getNextId(),
              opacity: curShape.opacity / 2,
              style: 'pointer-events:inherit'
            }
          });
          setHref(newImage, lastGoodImgUrl);
          preventClickDefault(newImage);
          break;
        case 'square':
        // FIXME: once we create the rect, we lose information that this was a square
        // (for resizing purposes this could be important)
        // Fallthrough
        case 'rect':
          started = true;
          startX = x;
          startY = y;
          addSvgElementFromJson({
            element: 'rect',
            curStyles: true,
            attr: {
              x: x,
              y: y,
              width: 0,
              height: 0,
              id: getNextId(),
              opacity: curShape.opacity / 2
            }
          });
          break;
        case 'line':
          started = true;
          strokeW = Number(curShape.stroke_width) === 0 ? 1 : curShape.stroke_width;
          addSvgElementFromJson({
            element: 'line',
            curStyles: true,
            attr: {
              x1: x,
              y1: y,
              x2: x,
              y2: y,
              id: getNextId(),
              stroke: curShape.stroke,
              'stroke-width': strokeW,
              'stroke-dasharray': curShape.stroke_dasharray,
              'stroke-linejoin': curShape.stroke_linejoin,
              'stroke-linecap': curShape.stroke_linecap,
              'stroke-opacity': curShape.stroke_opacity,
              fill: 'none',
              opacity: curShape.opacity / 2,
              style: 'pointer-events:none'
            }
          });
          break;
        case 'circle':
          started = true;
          addSvgElementFromJson({
            element: 'circle',
            curStyles: true,
            attr: {
              cx: x,
              cy: y,
              r: 0,
              id: getNextId(),
              opacity: curShape.opacity / 2
            }
          });
          break;
        case 'ellipse':
          started = true;
          addSvgElementFromJson({
            element: 'ellipse',
            curStyles: true,
            attr: {
              cx: x,
              cy: y,
              rx: 0,
              ry: 0,
              id: getNextId(),
              opacity: curShape.opacity / 2
            }
          });
          break;
        case 'text':
          started = true;
          /* const newText = */addSvgElementFromJson({
            element: 'text',
            curStyles: true,
            attr: {
              x: x,
              y: y,
              id: getNextId(),
              fill: curText.fill,
              'stroke-width': curText.stroke_width,
              'font-size': curText.font_size,
              'font-family': curText.font_family,
              'text-anchor': 'middle',
              'xml:space': 'preserve',
              opacity: curShape.opacity
            }
          });
          // newText.textContent = 'text';
          break;
        case 'path':
        // Fall through
        case 'pathedit':
          startX *= currentZoom;
          startY *= currentZoom;
          pathActions$$1.mouseDown(evt, mouseTarget, startX, startY);
          started = true;
          break;
        case 'textedit':
          startX *= currentZoom;
          startY *= currentZoom;
          textActions.mouseDown(evt, mouseTarget, startX, startY);
          started = true;
          break;
        case 'rotate':
          started = true;
          // we are starting an undoable change (a drag-rotation)
          canvas.undoMgr.beginUndoableChange('transform', selectedElements);
          break;
        default:
          // This could occur in an extension
          break;
      }

      var extResult = runExtensions('mouseDown', {
        event: evt,
        start_x: startX,
        start_y: startY,
        selectedElements: selectedElements
      }, true);

      $$9.each(extResult, function (i, r) {
        if (r && r.started) {
          started = true;
        }
      });
    };

    // in this function we do not record any state changes yet (but we do update
    // any elements that are still being created, moved or resized on the canvas)
    var mouseMove = function mouseMove(evt) {
      if (!started) {
        return;
      }
      if (evt.button === 1 || canvas.spaceKey) {
        return;
      }

      var i = void 0,
          xya = void 0,
          c = void 0,
          cx = void 0,
          cy = void 0,
          dx = void 0,
          dy = void 0,
          len = void 0,
          angle = void 0,
          box = void 0,
          selected = selectedElements[0];
      var pt = transformPoint(evt.pageX, evt.pageY, rootSctm),
          mouseX = pt.x * currentZoom,
          mouseY = pt.y * currentZoom,
          shape = getElem(getId());

      var realX = mouseX / currentZoom;
      var x = realX;
      var realY = mouseY / currentZoom;
      var y = realY;

      if (curConfig.gridSnapping) {
        x = snapToGrid(x);
        y = snapToGrid(y);
      }

      evt.preventDefault();
      var tlist = void 0;
      switch (currentMode) {
        case 'select':
          {
            // we temporarily use a translate on the element(s) being dragged
            // this transform is removed upon mousing up and the element is
            // relocated to the new location
            if (selectedElements[0] !== null) {
              dx = x - startX;
              dy = y - startY;

              if (curConfig.gridSnapping) {
                dx = snapToGrid(dx);
                dy = snapToGrid(dy);
              }

              if (evt.shiftKey) {
                xya = snapToAngle(startX, startY, x, y);
                var _xya = xya;
                x = _xya.x;
                y = _xya.y;
              }

              if (dx !== 0 || dy !== 0) {
                len = selectedElements.length;
                for (i = 0; i < len; ++i) {
                  selected = selectedElements[i];
                  if (selected == null) {
                    break;
                  }
                  // if (i === 0) {
                  //   const box = utilsGetBBox(selected);
                  //     selectedBBoxes[i].x = box.x + dx;
                  //     selectedBBoxes[i].y = box.y + dy;
                  // }

                  // update the dummy transform in our transform list
                  // to be a translate
                  var xform = svgroot.createSVGTransform();
                  tlist = getTransformList(selected);
                  // Note that if Webkit and there's no ID for this
                  // element, the dummy transform may have gotten lost.
                  // This results in unexpected behaviour

                  xform.setTranslate(dx, dy);
                  if (tlist.numberOfItems) {
                    tlist.replaceItem(xform, 0);
                  } else {
                    tlist.appendItem(xform);
                  }

                  // update our internal bbox that we're tracking while dragging
                  selectorManager.requestSelector(selected).resize();
                }

                call('transition', selectedElements);
              }
            }
            break;
          }case 'multiselect':
          {
            realX *= currentZoom;
            realY *= currentZoom;
            assignAttributes(rubberBox, {
              x: Math.min(rStartX, realX),
              y: Math.min(rStartY, realY),
              width: Math.abs(realX - rStartX),
              height: Math.abs(realY - rStartY)
            }, 100);

            // for each selected:
            // - if newList contains selected, do nothing
            // - if newList doesn't contain selected, remove it from selected
            // - for any newList that was not in selectedElements, add it to selected
            var elemsToRemove = selectedElements.slice(),
                elemsToAdd = [],
                newList = getIntersectionList();

            // For every element in the intersection, add if not present in selectedElements.
            len = newList.length;
            for (i = 0; i < len; ++i) {
              var intElem = newList[i];
              // Found an element that was not selected before, so we should add it.
              if (!selectedElements.includes(intElem)) {
                elemsToAdd.push(intElem);
              }
              // Found an element that was already selected, so we shouldn't remove it.
              var foundInd = elemsToRemove.indexOf(intElem);
              if (foundInd !== -1) {
                elemsToRemove.splice(foundInd, 1);
              }
            }

            if (elemsToRemove.length > 0) {
              canvas.removeFromSelection(elemsToRemove);
            }

            if (elemsToAdd.length > 0) {
              canvas.addToSelection(elemsToAdd);
            }

            break;
          }case 'resize':
          {
            // we track the resize bounding box and translate/scale the selected element
            // while the mouse is down, when mouse goes up, we use this to recalculate
            // the shape's coordinates
            tlist = getTransformList(selected);
            var hasMatrix = hasMatrixTransform(tlist);
            box = hasMatrix ? initBbox : getBBox(selected);
            var left = box.x,
                top = box.y,
                _box = box,
                width = _box.width,
                height = _box.height;

            dx = x - startX;
            dy = y - startY;

            if (curConfig.gridSnapping) {
              dx = snapToGrid(dx);
              dy = snapToGrid(dy);
              height = snapToGrid(height);
              width = snapToGrid(width);
            }

            // if rotated, adjust the dx,dy values
            angle = getRotationAngle(selected);
            if (angle) {
              var r = Math.sqrt(dx * dx + dy * dy),
                  theta = Math.atan2(dy, dx) - angle * Math.PI / 180.0;
              dx = r * Math.cos(theta);
              dy = r * Math.sin(theta);
            }

            // if not stretching in y direction, set dy to 0
            // if not stretching in x direction, set dx to 0
            if (!currentResizeMode.includes('n') && !currentResizeMode.includes('s')) {
              dy = 0;
            }
            if (!currentResizeMode.includes('e') && !currentResizeMode.includes('w')) {
              dx = 0;
            }

            var // ts = null,
            tx = 0,
                ty = 0,
                sy = height ? (height + dy) / height : 1,
                sx = width ? (width + dx) / width : 1;
            // if we are dragging on the north side, then adjust the scale factor and ty
            if (currentResizeMode.includes('n')) {
              sy = height ? (height - dy) / height : 1;
              ty = height;
            }

            // if we dragging on the east side, then adjust the scale factor and tx
            if (currentResizeMode.includes('w')) {
              sx = width ? (width - dx) / width : 1;
              tx = width;
            }

            // update the transform list with translate,scale,translate
            var translateOrigin = svgroot.createSVGTransform(),
                scale = svgroot.createSVGTransform(),
                translateBack = svgroot.createSVGTransform();

            if (curConfig.gridSnapping) {
              left = snapToGrid(left);
              tx = snapToGrid(tx);
              top = snapToGrid(top);
              ty = snapToGrid(ty);
            }

            translateOrigin.setTranslate(-(left + tx), -(top + ty));
            if (evt.shiftKey) {
              if (sx === 1) {
                sx = sy;
              } else {
                sy = sx;
              }
            }
            scale.setScale(sx, sy);

            translateBack.setTranslate(left + tx, top + ty);
            if (hasMatrix) {
              var diff = angle ? 1 : 0;
              tlist.replaceItem(translateOrigin, 2 + diff);
              tlist.replaceItem(scale, 1 + diff);
              tlist.replaceItem(translateBack, Number(diff));
            } else {
              var N = tlist.numberOfItems;
              tlist.replaceItem(translateBack, N - 3);
              tlist.replaceItem(scale, N - 2);
              tlist.replaceItem(translateOrigin, N - 1);
            }

            selectorManager.requestSelector(selected).resize();

            call('transition', selectedElements);

            break;
          }case 'zoom':
          {
            realX *= currentZoom;
            realY *= currentZoom;
            assignAttributes(rubberBox, {
              x: Math.min(rStartX * currentZoom, realX),
              y: Math.min(rStartY * currentZoom, realY),
              width: Math.abs(realX - rStartX * currentZoom),
              height: Math.abs(realY - rStartY * currentZoom)
            }, 100);
            break;
          }case 'text':
          {
            assignAttributes(shape, {
              x: x,
              y: y
            }, 1000);
            break;
          }case 'line':
          {
            if (curConfig.gridSnapping) {
              x = snapToGrid(x);
              y = snapToGrid(y);
            }

            var x2 = x;
            var y2 = y;

            if (evt.shiftKey) {
              xya = snapToAngle(startX, startY, x2, y2);
              x2 = xya.x;
              y2 = xya.y;
            }

            shape.setAttributeNS(null, 'x2', x2);
            shape.setAttributeNS(null, 'y2', y2);
            break;
          }case 'foreignObject':
        // fall through
        case 'square':
        // fall through
        case 'rect':
        // fall through
        case 'image':
          {
            var square = currentMode === 'square' || evt.shiftKey;
            var w = Math.abs(x - startX),
                h = Math.abs(y - startY);
            var newX = void 0,
                newY = void 0;
            if (square) {
              w = h = Math.max(w, h);
              newX = startX < x ? startX : startX - w;
              newY = startY < y ? startY : startY - h;
            } else {
              newX = Math.min(startX, x);
              newY = Math.min(startY, y);
            }

            if (curConfig.gridSnapping) {
              w = snapToGrid(w);
              h = snapToGrid(h);
              newX = snapToGrid(newX);
              newY = snapToGrid(newY);
            }

            assignAttributes(shape, {
              width: w,
              height: h,
              x: newX,
              y: newY
            }, 1000);

            break;
          }case 'circle':
          {
            c = $$9(shape).attr(['cx', 'cy']);
            var _c = c;
            cx = _c.cx;
            cy = _c.cy;

            var rad = Math.sqrt((x - cx) * (x - cx) + (y - cy) * (y - cy));
            if (curConfig.gridSnapping) {
              rad = snapToGrid(rad);
            }
            shape.setAttributeNS(null, 'r', rad);
            break;
          }case 'ellipse':
          {
            c = $$9(shape).attr(['cx', 'cy']);
            var _c2 = c;
            cx = _c2.cx;
            cy = _c2.cy;

            if (curConfig.gridSnapping) {
              x = snapToGrid(x);
              cx = snapToGrid(cx);
              y = snapToGrid(y);
              cy = snapToGrid(cy);
            }
            shape.setAttributeNS(null, 'rx', Math.abs(x - cx));
            var ry = Math.abs(evt.shiftKey ? x - cx : y - cy);
            shape.setAttributeNS(null, 'ry', ry);
            break;
          }
        case 'fhellipse':
        case 'fhrect':
          {
            freehand.minx = Math.min(realX, freehand.minx);
            freehand.maxx = Math.max(realX, freehand.maxx);
            freehand.miny = Math.min(realY, freehand.miny);
            freehand.maxy = Math.max(realY, freehand.maxy);
          }
        // Fallthrough
        case 'fhpath':
          {
            // dAttr += + realX + ',' + realY + ' ';
            // shape.setAttributeNS(null, 'points', dAttr);
            end.x = realX;end.y = realY;
            if (controllPoint2.x && controllPoint2.y) {
              for (i = 0; i < STEP_COUNT - 1; i++) {
                parameter = i / STEP_COUNT;
                nextParameter = (i + 1) / STEP_COUNT;
                bSpline = getBsplinePoint(nextParameter);
                nextPos = bSpline;
                bSpline = getBsplinePoint(parameter);
                sumDistance += Math.sqrt((nextPos.x - bSpline.x) * (nextPos.x - bSpline.x) + (nextPos.y - bSpline.y) * (nextPos.y - bSpline.y));
                if (sumDistance > THRESHOLD_DIST) {
                  dAttr += +bSpline.x + ',' + bSpline.y + ' ';
                  shape.setAttributeNS(null, 'points', dAttr);
                  sumDistance -= THRESHOLD_DIST;
                }
              }
            }
            controllPoint2 = { x: controllPoint1.x, y: controllPoint1.y };
            controllPoint1 = { x: start.x, y: start.y };
            start = { x: end.x, y: end.y };
            break;
            // update path stretch line coordinates
          }case 'path':

        // fall through
        case 'pathedit':
          {
            x *= currentZoom;
            y *= currentZoom;

            if (curConfig.gridSnapping) {
              x = snapToGrid(x);
              y = snapToGrid(y);
              startX = snapToGrid(startX);
              startY = snapToGrid(startY);
            }
            if (evt.shiftKey) {
              var path$$1 = path;

              var x1 = void 0,
                  y1 = void 0;
              if (path$$1) {
                x1 = path$$1.dragging ? path$$1.dragging[0] : startX;
                y1 = path$$1.dragging ? path$$1.dragging[1] : startY;
              } else {
                x1 = startX;
                y1 = startY;
              }
              xya = snapToAngle(x1, y1, x, y);
              var _xya2 = xya;
              x = _xya2.x;
              y = _xya2.y;
            }

            if (rubberBox && rubberBox.getAttribute('display') !== 'none') {
              realX *= currentZoom;
              realY *= currentZoom;
              assignAttributes(rubberBox, {
                x: Math.min(rStartX * currentZoom, realX),
                y: Math.min(rStartY * currentZoom, realY),
                width: Math.abs(realX - rStartX * currentZoom),
                height: Math.abs(realY - rStartY * currentZoom)
              }, 100);
            }
            pathActions$$1.mouseMove(x, y);

            break;
          }case 'textedit':
          {
            x *= currentZoom;
            y *= currentZoom;
            // if (rubberBox && rubberBox.getAttribute('display') !== 'none') {
            //   assignAttributes(rubberBox, {
            //     x: Math.min(startX, x),
            //     y: Math.min(startY, y),
            //     width: Math.abs(x - startX),
            //     height: Math.abs(y - startY)
            //   }, 100);
            // }

            textActions.mouseMove(mouseX, mouseY);

            break;
          }case 'rotate':
          {
            box = getBBox(selected);
            cx = box.x + box.width / 2;
            cy = box.y + box.height / 2;
            var m = getMatrix(selected),
                center = transformPoint(cx, cy, m);
            cx = center.x;
            cy = center.y;
            angle = (Math.atan2(cy - y, cx - x) * (180 / Math.PI) - 90) % 360;
            if (curConfig.gridSnapping) {
              angle = snapToGrid(angle);
            }
            if (evt.shiftKey) {
              // restrict rotations to nice angles (WRS)
              var snap = 45;
              angle = Math.round(angle / snap) * snap;
            }

            canvas.setRotationAngle(angle < -180 ? 360 + angle : angle, true);
            call('transition', selectedElements);
            break;
          }default:
          break;
      }

      runExtensions('mouseMove', {
        event: evt,
        mouse_x: mouseX,
        mouse_y: mouseY,
        selected: selected
      });
    }; // mouseMove()

    // - in create mode, the element's opacity is set properly, we create an InsertElementCommand
    // and store it on the Undo stack
    // - in move/resize mode, the element's attributes which were affected by the move/resize are
    // identified, a ChangeElementCommand is created and stored on the stack for those attrs
    // this is done in when we recalculate the selected dimensions()
    var mouseUp = function mouseUp(evt) {
      if (evt.button === 2) {
        return;
      }
      var tempJustSelected = justSelected;
      justSelected = null;
      if (!started) {
        return;
      }
      var pt = transformPoint(evt.pageX, evt.pageY, rootSctm),
          mouseX = pt.x * currentZoom,
          mouseY = pt.y * currentZoom,
          x = mouseX / currentZoom,
          y = mouseY / currentZoom;

      var element = getElem(getId());
      var keep = false;

      var realX = x;
      var realY = y;
      started = false;
      var attrs = void 0,
          t = void 0;
      switch (currentMode) {
        // intentionally fall-through to select here
        case 'resize':
        case 'multiselect':
          if (rubberBox != null) {
            rubberBox.setAttribute('display', 'none');
            curBBoxes = [];
          }
          currentMode = 'select';
        // Fallthrough
        case 'select':
          if (selectedElements[0] != null) {
            // if we only have one selected element
            if (selectedElements[1] == null) {
              // set our current stroke/fill properties to the element's
              var selected = selectedElements[0];
              switch (selected.tagName) {
                case 'g':
                case 'use':
                case 'image':
                case 'foreignObject':
                  break;
                default:
                  curProperties.fill = selected.getAttribute('fill');
                  curProperties.fill_opacity = selected.getAttribute('fill-opacity');
                  curProperties.stroke = selected.getAttribute('stroke');
                  curProperties.stroke_opacity = selected.getAttribute('stroke-opacity');
                  curProperties.stroke_width = selected.getAttribute('stroke-width');
                  curProperties.stroke_dasharray = selected.getAttribute('stroke-dasharray');
                  curProperties.stroke_linejoin = selected.getAttribute('stroke-linejoin');
                  curProperties.stroke_linecap = selected.getAttribute('stroke-linecap');
              }

              if (selected.tagName === 'text') {
                curText.font_size = selected.getAttribute('font-size');
                curText.font_family = selected.getAttribute('font-family');
              }
              selectorManager.requestSelector(selected).showGrips(true);

              // This shouldn't be necessary as it was done on mouseDown...
              // call('selected', [selected]);
            }
            // always recalculate dimensions to strip off stray identity transforms
            recalculateAllSelectedDimensions();
            // if it was being dragged/resized
            if (realX !== rStartX || realY !== rStartY) {
              var len = selectedElements.length;
              for (var i = 0; i < len; ++i) {
                if (selectedElements[i] == null) {
                  break;
                }
                if (!selectedElements[i].firstChild) {
                  // Not needed for groups (incorrectly resizes elems), possibly not needed at all?
                  selectorManager.requestSelector(selectedElements[i]).resize();
                }
              }
              // no change in position/size, so maybe we should move to pathedit
            } else {
              t = evt.target;
              if (selectedElements[0].nodeName === 'path' && selectedElements[1] == null) {
                pathActions$$1.select(selectedElements[0]);
                // if it was a path
                // else, if it was selected and this is a shift-click, remove it from selection
              } else if (evt.shiftKey) {
                if (tempJustSelected !== t) {
                  canvas.removeFromSelection([t]);
                }
              }
            } // no change in mouse position

            // Remove non-scaling stroke
            if (supportsNonScalingStroke()) {
              var elem = selectedElements[0];
              if (elem) {
                elem.removeAttribute('style');
                walkTree(elem, function (elem) {
                  elem.removeAttribute('style');
                });
              }
            }
          }
          return;
        case 'zoom':
          if (rubberBox != null) {
            rubberBox.setAttribute('display', 'none');
          }
          var factor = evt.shiftKey ? 0.5 : 2;
          call('zoomed', {
            x: Math.min(rStartX, realX),
            y: Math.min(rStartY, realY),
            width: Math.abs(realX - rStartX),
            height: Math.abs(realY - rStartY),
            factor: factor
          });
          return;
        case 'fhpath':
          // Check that the path contains at least 2 points; a degenerate one-point path
          // causes problems.
          // Webkit ignores how we set the points attribute with commas and uses space
          // to separate all coordinates, see https://bugs.webkit.org/show_bug.cgi?id=29870
          sumDistance = 0;
          controllPoint2 = { x: 0, y: 0 };
          controllPoint1 = { x: 0, y: 0 };
          start = { x: 0, y: 0 };
          end = { x: 0, y: 0 };
          var coords = element.getAttribute('points');
          var commaIndex = coords.indexOf(',');
          if (commaIndex >= 0) {
            keep = coords.indexOf(',', commaIndex + 1) >= 0;
          } else {
            keep = coords.indexOf(' ', coords.indexOf(' ') + 1) >= 0;
          }
          if (keep) {
            element = pathActions$$1.smoothPolylineIntoPath(element);
          }
          break;
        case 'line':
          attrs = $$9(element).attr(['x1', 'x2', 'y1', 'y2']);
          keep = attrs.x1 !== attrs.x2 || attrs.y1 !== attrs.y2;
          break;
        case 'foreignObject':
        case 'square':
        case 'rect':
        case 'image':
          attrs = $$9(element).attr(['width', 'height']);
          // Image should be kept regardless of size (use inherit dimensions later)
          keep = attrs.width || attrs.height || currentMode === 'image';
          break;
        case 'circle':
          keep = element.getAttribute('r') !== '0';
          break;
        case 'ellipse':
          attrs = $$9(element).attr(['rx', 'ry']);
          keep = attrs.rx || attrs.ry;
          break;
        case 'fhellipse':
          if (freehand.maxx - freehand.minx > 0 && freehand.maxy - freehand.miny > 0) {
            element = addSvgElementFromJson({
              element: 'ellipse',
              curStyles: true,
              attr: {
                cx: (freehand.minx + freehand.maxx) / 2,
                cy: (freehand.miny + freehand.maxy) / 2,
                rx: (freehand.maxx - freehand.minx) / 2,
                ry: (freehand.maxy - freehand.miny) / 2,
                id: getId()
              }
            });
            call('changed', [element]);
            keep = true;
          }
          break;
        case 'fhrect':
          if (freehand.maxx - freehand.minx > 0 && freehand.maxy - freehand.miny > 0) {
            element = addSvgElementFromJson({
              element: 'rect',
              curStyles: true,
              attr: {
                x: freehand.minx,
                y: freehand.miny,
                width: freehand.maxx - freehand.minx,
                height: freehand.maxy - freehand.miny,
                id: getId()
              }
            });
            call('changed', [element]);
            keep = true;
          }
          break;
        case 'text':
          keep = true;
          selectOnly([element]);
          textActions.start(element);
          break;
        case 'path':
          // set element to null here so that it is not removed nor finalized
          element = null;
          // continue to be set to true so that mouseMove happens
          started = true;

          var res = pathActions$$1.mouseUp(evt, element, mouseX, mouseY);
          element = res.element;
          keep = res.keep;

          break;
        case 'pathedit':
          keep = true;
          element = null;
          pathActions$$1.mouseUp(evt);
          break;
        case 'textedit':
          keep = false;
          element = null;
          textActions.mouseUp(evt, mouseX, mouseY);
          break;
        case 'rotate':
          keep = true;
          element = null;
          currentMode = 'select';
          var batchCmd = canvas.undoMgr.finishUndoableChange();
          if (!batchCmd.isEmpty()) {
            addCommandToHistory(batchCmd);
          }
          // perform recalculation to weed out any stray identity transforms that might get stuck
          recalculateAllSelectedDimensions();
          call('changed', selectedElements);
          break;
        default:
          // This could occur in an extension
          break;
      }

      var extResult = runExtensions('mouseUp', {
        event: evt,
        mouse_x: mouseX,
        mouse_y: mouseY
      }, true);

      $$9.each(extResult, function (i, r) {
        if (r) {
          keep = r.keep || keep;
          element = r.element;

          started = r.started || started;
        }
      });

      if (!keep && element != null) {
        getCurrentDrawing().releaseId(getId());
        element.remove();
        element = null;

        t = evt.target;

        // if this element is in a group, go up until we reach the top-level group
        // just below the layer groups
        // TODO: once we implement links, we also would have to check for <a> elements
        while (t && t.parentNode && t.parentNode.parentNode && t.parentNode.parentNode.tagName === 'g') {
          t = t.parentNode;
        }
        // if we are not in the middle of creating a path, and we've clicked on some shape,
        // then go to Select mode.
        // WebKit returns <div> when the canvas is clicked, Firefox/Opera return <svg>
        if ((currentMode !== 'path' || !drawnPath) && t && t.parentNode && t.parentNode.id !== 'selectorParentGroup' && t.id !== 'svgcanvas' && t.id !== 'svgroot') {
          // switch into "select" mode if we've clicked on an element
          canvas.setMode('select');
          selectOnly([t], true);
        }
      } else if (element != null) {
        canvas.addedNew = true;

        var aniDur = 0.2;
        var cAni = void 0;
        if (opacAni.beginElement && parseFloat(element.getAttribute('opacity')) !== curShape.opacity) {
          cAni = $$9(opacAni).clone().attr({
            to: curShape.opacity,
            dur: aniDur
          }).appendTo(element);
          try {
            // Fails in FF4 on foreignObject
            cAni[0].beginElement();
          } catch (e) {}
        } else {
          aniDur = 0;
        }

        // Ideally this would be done on the endEvent of the animation,
        // but that doesn't seem to be supported in Webkit
        setTimeout(function () {
          if (cAni) {
            cAni.remove();
          }
          element.setAttribute('opacity', curShape.opacity);
          element.setAttribute('style', 'pointer-events:inherit');
          cleanupElement(element);
          if (currentMode === 'path') {
            pathActions$$1.toEditMode(element);
          } else if (curConfig.selectNew) {
            selectOnly([element], true);
          }
          // we create the insert command that is stored on the stack
          // undo means to call cmd.unapply(), redo means to call cmd.apply()
          addCommandToHistory(new InsertElementCommand$1(element));

          call('changed', [element]);
        }, aniDur * 1000);
      }

      startTransform = null;
    };

    var dblClick = function dblClick(evt) {
      var evtTarget = evt.target;
      var parent = evtTarget.parentNode;

      // Do nothing if already in current group
      if (parent === currentGroup) {
        return;
      }

      var mouseTarget = getMouseTarget(evt);
      var _mouseTarget = mouseTarget,
          tagName = _mouseTarget.tagName;


      if (tagName === 'text' && currentMode !== 'textedit') {
        var pt = transformPoint(evt.pageX, evt.pageY, rootSctm);
        textActions.select(mouseTarget, pt.x, pt.y);
      }

      if ((tagName === 'g' || tagName === 'a') && getRotationAngle(mouseTarget)) {
        // TODO: Allow method of in-group editing without having to do
        // this (similar to editing rotated paths)

        // Ungroup and regroup
        pushGroupProperties(mouseTarget);
        mouseTarget = selectedElements[0];
        clearSelection(true);
      }
      // Reset context
      if (currentGroup) {
        leaveContext();
      }

      if (parent.tagName !== 'g' && parent.tagName !== 'a' || parent === getCurrentDrawing().getCurrentLayer() || mouseTarget === selectorManager.selectorParentGroup) {
        // Escape from in-group edit
        return;
      }
      setContext(mouseTarget);
    };

    // prevent links from being followed in the canvas
    var handleLinkInCanvas = function handleLinkInCanvas(e) {
      e.preventDefault();
      return false;
    };

    // Added mouseup to the container here.
    // TODO(codedread): Figure out why after the Closure compiler, the window mouseup is ignored.
    $$9(container).mousedown(mouseDown).mousemove(mouseMove).click(handleLinkInCanvas).dblclick(dblClick).mouseup(mouseUp);
    // $(window).mouseup(mouseUp);

    // TODO(rafaelcastrocouto): User preference for shift key and zoom factor
    $$9(container).bind('mousewheel DOMMouseScroll', function (e) {
      if (!e.shiftKey) {
        return;
      }

      e.preventDefault();
      var evt = e.originalEvent;

      rootSctm = $$9('#svgcontent g')[0].getScreenCTM().inverse();

      var workarea = $$9('#workarea');
      var scrbar = 15;
      var rulerwidth = curConfig.showRulers ? 16 : 0;

      // mouse relative to content area in content pixels
      var pt = transformPoint(evt.pageX, evt.pageY, rootSctm);

      // full work area width in screen pixels
      var editorFullW = workarea.width();
      var editorFullH = workarea.height();

      // work area width minus scroll and ruler in screen pixels
      var editorW = editorFullW - scrbar - rulerwidth;
      var editorH = editorFullH - scrbar - rulerwidth;

      // work area width in content pixels
      var workareaViewW = editorW * rootSctm.a;
      var workareaViewH = editorH * rootSctm.d;

      // content offset from canvas in screen pixels
      var wOffset = workarea.offset();
      var wOffsetLeft = wOffset['left'] + rulerwidth;
      var wOffsetTop = wOffset['top'] + rulerwidth;

      var delta = evt.wheelDelta ? evt.wheelDelta : evt.detail ? -evt.detail : 0;
      if (!delta) {
        return;
      }

      var factor = Math.max(3 / 4, Math.min(4 / 3, delta));

      var wZoom = void 0,
          hZoom = void 0;
      if (factor > 1) {
        wZoom = Math.ceil(editorW / workareaViewW * factor * 100) / 100;
        hZoom = Math.ceil(editorH / workareaViewH * factor * 100) / 100;
      } else {
        wZoom = Math.floor(editorW / workareaViewW * factor * 100) / 100;
        hZoom = Math.floor(editorH / workareaViewH * factor * 100) / 100;
      }
      var zoomlevel = Math.min(wZoom, hZoom);
      zoomlevel = Math.min(10, Math.max(0.01, zoomlevel));
      if (zoomlevel === currentZoom) {
        return;
      }
      factor = zoomlevel / currentZoom;

      // top left of workarea in content pixels before zoom
      var topLeftOld = transformPoint(wOffsetLeft, wOffsetTop, rootSctm);

      // top left of workarea in content pixels after zoom
      var topLeftNew = {
        x: pt.x - (pt.x - topLeftOld.x) / factor,
        y: pt.y - (pt.y - topLeftOld.y) / factor
      };

      // top left of workarea in canvas pixels relative to content after zoom
      var topLeftNewCanvas = {
        x: topLeftNew.x * zoomlevel,
        y: topLeftNew.y * zoomlevel
      };

      // new center in canvas pixels
      var newCtr = {
        x: topLeftNewCanvas.x - rulerwidth + editorFullW / 2,
        y: topLeftNewCanvas.y - rulerwidth + editorFullH / 2
      };

      canvas.setZoom(zoomlevel);
      $$9('#zoom').val((zoomlevel * 100).toFixed(1));

      call('updateCanvas', { center: false, newCtr: newCtr });
      call('zoomDone');
    });
  })();

  /**
  * Group: Text edit functions
  * Functions relating to editing text elements
  */
  var textActions = canvas.textActions = function () {
    var curtext = void 0;
    var textinput = void 0;
    var cursor = void 0;
    var selblock = void 0;
    var blinker = void 0;
    var chardata = [];
    var textbb = void 0; // , transbb;
    var matrix = void 0;
    var lastX = void 0,
        lastY = void 0;
    var allowDbl = void 0;

    function setCursor(index) {
      var empty = textinput.value === '';
      $$9(textinput).focus();

      if (!arguments.length) {
        if (empty) {
          index = 0;
        } else {
          if (textinput.selectionEnd !== textinput.selectionStart) {
            return;
          }
          index = textinput.selectionEnd;
        }
      }

      var charbb = chardata[index];
      if (!empty) {
        textinput.setSelectionRange(index, index);
      }
      cursor = getElem('text_cursor');
      if (!cursor) {
        cursor = document.createElementNS(NS.SVG, 'line');
        assignAttributes(cursor, {
          id: 'text_cursor',
          stroke: '#333',
          'stroke-width': 1
        });
        cursor = getElem('selectorParentGroup').appendChild(cursor);
      }

      if (!blinker) {
        blinker = setInterval(function () {
          var show = cursor.getAttribute('display') === 'none';
          cursor.setAttribute('display', show ? 'inline' : 'none');
        }, 600);
      }

      var startPt = ptToScreen(charbb.x, textbb.y);
      var endPt = ptToScreen(charbb.x, textbb.y + textbb.height);

      assignAttributes(cursor, {
        x1: startPt.x,
        y1: startPt.y,
        x2: endPt.x,
        y2: endPt.y,
        visibility: 'visible',
        display: 'inline'
      });

      if (selblock) {
        selblock.setAttribute('d', '');
      }
    }

    function setSelection(start, end, skipInput) {
      if (start === end) {
        setCursor(end);
        return;
      }

      if (!skipInput) {
        textinput.setSelectionRange(start, end);
      }

      selblock = getElem('text_selectblock');
      if (!selblock) {
        selblock = document.createElementNS(NS.SVG, 'path');
        assignAttributes(selblock, {
          id: 'text_selectblock',
          fill: 'green',
          opacity: 0.5,
          style: 'pointer-events:none'
        });
        getElem('selectorParentGroup').append(selblock);
      }

      var startbb = chardata[start];
      var endbb = chardata[end];

      cursor.setAttribute('visibility', 'hidden');

      var tl = ptToScreen(startbb.x, textbb.y),
          tr = ptToScreen(startbb.x + (endbb.x - startbb.x), textbb.y),
          bl = ptToScreen(startbb.x, textbb.y + textbb.height),
          br = ptToScreen(startbb.x + (endbb.x - startbb.x), textbb.y + textbb.height);

      var dstr = 'M' + tl.x + ',' + tl.y + ' L' + tr.x + ',' + tr.y + ' ' + br.x + ',' + br.y + ' ' + bl.x + ',' + bl.y + 'z';

      assignAttributes(selblock, {
        d: dstr,
        display: 'inline'
      });
    }

    function getIndexFromPoint(mouseX, mouseY) {
      // Position cursor here
      var pt = svgroot.createSVGPoint();
      pt.x = mouseX;
      pt.y = mouseY;

      // No content, so return 0
      if (chardata.length === 1) {
        return 0;
      }
      // Determine if cursor should be on left or right of character
      var charpos = curtext.getCharNumAtPosition(pt);
      if (charpos < 0) {
        // Out of text range, look at mouse coords
        charpos = chardata.length - 2;
        if (mouseX <= chardata[0].x) {
          charpos = 0;
        }
      } else if (charpos >= chardata.length - 2) {
        charpos = chardata.length - 2;
      }
      var charbb = chardata[charpos];
      var mid = charbb.x + charbb.width / 2;
      if (mouseX > mid) {
        charpos++;
      }
      return charpos;
    }

    function setCursorFromPoint(mouseX, mouseY) {
      setCursor(getIndexFromPoint(mouseX, mouseY));
    }

    function setEndSelectionFromPoint(x, y, apply) {
      var i1 = textinput.selectionStart;
      var i2 = getIndexFromPoint(x, y);

      var start = Math.min(i1, i2);
      var end = Math.max(i1, i2);
      setSelection(start, end, !apply);
    }

    function screenToPt(xIn, yIn) {
      var out = {
        x: xIn,
        y: yIn
      };

      out.x /= currentZoom;
      out.y /= currentZoom;

      if (matrix) {
        var pt = transformPoint(out.x, out.y, matrix.inverse());
        out.x = pt.x;
        out.y = pt.y;
      }

      return out;
    }

    function ptToScreen(xIn, yIn) {
      var out = {
        x: xIn,
        y: yIn
      };

      if (matrix) {
        var pt = transformPoint(out.x, out.y, matrix);
        out.x = pt.x;
        out.y = pt.y;
      }

      out.x *= currentZoom;
      out.y *= currentZoom;

      return out;
    }

    /*
    // Not currently in use
    function hideCursor () {
      if (cursor) {
        cursor.setAttribute('visibility', 'hidden');
      }
    }
    */

    function selectAll(evt) {
      setSelection(0, curtext.textContent.length);
      $$9(this).unbind(evt);
    }

    function selectWord(evt) {
      if (!allowDbl || !curtext) {
        return;
      }

      var ept = transformPoint(evt.pageX, evt.pageY, rootSctm),
          mouseX = ept.x * currentZoom,
          mouseY = ept.y * currentZoom;
      var pt = screenToPt(mouseX, mouseY);

      var index = getIndexFromPoint(pt.x, pt.y);
      var str = curtext.textContent;
      var first = str.substr(0, index).replace(/[a-z0-9]+$/i, '').length;
      var m = str.substr(index).match(/^[a-z0-9]+/i);
      var last = (m ? m[0].length : 0) + index;
      setSelection(first, last);

      // Set tripleclick
      $$9(evt.target).click(selectAll);
      setTimeout(function () {
        $$9(evt.target).unbind('click', selectAll);
      }, 300);
    }

    return {
      select: function select(target, x, y) {
        curtext = target;
        textActions.toEditMode(x, y);
      },
      start: function start(elem) {
        curtext = elem;
        textActions.toEditMode();
      },
      mouseDown: function mouseDown(evt, mouseTarget, startX, startY) {
        var pt = screenToPt(startX, startY);

        textinput.focus();
        setCursorFromPoint(pt.x, pt.y);
        lastX = startX;
        lastY = startY;

        // TODO: Find way to block native selection
      },
      mouseMove: function mouseMove(mouseX, mouseY) {
        var pt = screenToPt(mouseX, mouseY);
        setEndSelectionFromPoint(pt.x, pt.y);
      },
      mouseUp: function mouseUp(evt, mouseX, mouseY) {
        var pt = screenToPt(mouseX, mouseY);

        setEndSelectionFromPoint(pt.x, pt.y, true);

        // TODO: Find a way to make this work: Use transformed BBox instead of evt.target
        // if (lastX === mouseX && lastY === mouseY
        //   && !rectsIntersect(transbb, {x: pt.x, y: pt.y, width: 0, height: 0})) {
        //   textActions.toSelectMode(true);
        // }

        if (evt.target !== curtext && mouseX < lastX + 2 && mouseX > lastX - 2 && mouseY < lastY + 2 && mouseY > lastY - 2) {
          textActions.toSelectMode(true);
        }
      },

      setCursor: setCursor,
      toEditMode: function toEditMode(x, y) {
        allowDbl = false;
        currentMode = 'textedit';
        selectorManager.requestSelector(curtext).showGrips(false);
        // Make selector group accept clicks
        /* const selector = */selectorManager.requestSelector(curtext); // Do we need this? Has side effect of setting lock, so keeping for now, but next line wasn't being used
        // const sel = selector.selectorRect;

        textActions.init();

        $$9(curtext).css('cursor', 'text');

        // if (supportsEditableText()) {
        //   curtext.setAttribute('editable', 'simple');
        //   return;
        // }

        if (!arguments.length) {
          setCursor();
        } else {
          var pt = screenToPt(x, y);
          setCursorFromPoint(pt.x, pt.y);
        }

        setTimeout(function () {
          allowDbl = true;
        }, 300);
      },
      toSelectMode: function toSelectMode(selectElem) {
        currentMode = 'select';
        clearInterval(blinker);
        blinker = null;
        if (selblock) {
          $$9(selblock).attr('display', 'none');
        }
        if (cursor) {
          $$9(cursor).attr('visibility', 'hidden');
        }
        $$9(curtext).css('cursor', 'move');

        if (selectElem) {
          clearSelection();
          $$9(curtext).css('cursor', 'move');

          call('selected', [curtext]);
          addToSelection([curtext], true);
        }
        if (curtext && !curtext.textContent.length) {
          // No content, so delete
          canvas.deleteSelectedElements();
        }

        $$9(textinput).blur();

        curtext = false;

        // if (supportsEditableText()) {
        //   curtext.removeAttribute('editable');
        // }
      },
      setInputElem: function setInputElem(elem) {
        textinput = elem;
        // $(textinput).blur(hideCursor);
      },
      clear: function clear() {
        if (currentMode === 'textedit') {
          textActions.toSelectMode();
        }
      },
      init: function init$$1(inputElem) {
        if (!curtext) {
          return;
        }
        var i = void 0,
            end = void 0;
        // if (supportsEditableText()) {
        //   curtext.select();
        //   return;
        // }

        if (!curtext.parentNode) {
          // Result of the ffClone, need to get correct element
          curtext = selectedElements[0];
          selectorManager.requestSelector(curtext).showGrips(false);
        }

        var str = curtext.textContent;
        var len = str.length;

        var xform = curtext.getAttribute('transform');

        textbb = getBBox(curtext);

        matrix = xform ? getMatrix(curtext) : null;

        chardata = [];
        chardata.length = len;
        textinput.focus();

        $$9(curtext).unbind('dblclick', selectWord).dblclick(selectWord);

        if (!len) {
          end = { x: textbb.x + textbb.width / 2, width: 0 };
        }

        for (i = 0; i < len; i++) {
          var start = curtext.getStartPositionOfChar(i);
          end = curtext.getEndPositionOfChar(i);

          if (!supportsGoodTextCharPos()) {
            var offset = canvas.contentW * currentZoom;
            start.x -= offset;
            end.x -= offset;

            start.x /= currentZoom;
            end.x /= currentZoom;
          }

          // Get a "bbox" equivalent for each character. Uses the
          // bbox data of the actual text for y, height purposes

          // TODO: Decide if y, width and height are actually necessary
          chardata[i] = {
            x: start.x,
            y: textbb.y, // start.y?
            width: end.x - start.x,
            height: textbb.height
          };
        }

        // Add a last bbox for cursor at end of text
        chardata.push({
          x: end.x,
          width: 0
        });
        setSelection(textinput.selectionStart, textinput.selectionEnd, true);
      }
    };
  }();

  /**
  * Group: Serialization
  */

  /**
  * Looks at DOM elements inside the <defs> to see if they are referred to,
  * removes them from the DOM if they are not.
  * @returns The amount of elements that were removed
  */
  var removeUnusedDefElems = this.removeUnusedDefElems = function () {
    var defs = svgcontent.getElementsByTagNameNS(NS.SVG, 'defs');
    if (!defs || !defs.length) {
      return 0;
    }

    // if (!defs.firstChild) { return; }

    var defelemUses = [];
    var numRemoved = 0;
    var attrs = ['fill', 'stroke', 'filter', 'marker-start', 'marker-mid', 'marker-end'];
    var alen = attrs.length;

    var allEls = svgcontent.getElementsByTagNameNS(NS.SVG, '*');
    var allLen = allEls.length;

    var i = void 0,
        j = void 0;
    for (i = 0; i < allLen; i++) {
      var el = allEls[i];
      for (j = 0; j < alen; j++) {
        var ref = getUrlFromAttr(el.getAttribute(attrs[j]));
        if (ref) {
          defelemUses.push(ref.substr(1));
        }
      }

      // gradients can refer to other gradients
      var href = getHref(el);
      if (href && href.startsWith('#')) {
        defelemUses.push(href.substr(1));
      }
    }

    var defelems = $$9(defs).find('linearGradient, radialGradient, filter, marker, svg, symbol');
    i = defelems.length;
    while (i--) {
      var defelem = defelems[i];
      var id = defelem.id;

      if (!defelemUses.includes(id)) {
        // Not found, so remove (but remember)
        removedElements[id] = defelem;
        defelem.remove();
        numRemoved++;
      }
    }

    return numRemoved;
  };

  /**
  * Main function to set up the SVG content for output
  * @returns {String} The SVG image for output
  */
  this.svgCanvasToString = function () {
    // keep calling it until there are none to remove
    while (removeUnusedDefElems() > 0) {}

    pathActions$$1.clear(true);

    // Keep SVG-Edit comment on top
    $$9.each(svgcontent.childNodes, function (i, node) {
      if (i && node.nodeType === 8 && node.data.includes('Created with')) {
        svgcontent.firstChild.before(node);
      }
    });

    // Move out of in-group editing mode
    if (currentGroup) {
      leaveContext();
      selectOnly([currentGroup]);
    }

    var nakedSvgs = [];

    // Unwrap gsvg if it has no special attributes (only id and style)
    $$9(svgcontent).find('g:data(gsvg)').each(function () {
      var attrs = this.attributes;
      var len = attrs.length;
      for (var i = 0; i < len; i++) {
        if (attrs[i].nodeName === 'id' || attrs[i].nodeName === 'style') {
          len--;
        }
      }
      // No significant attributes, so ungroup
      if (len <= 0) {
        var svg = this.firstChild;
        nakedSvgs.push(svg);
        $$9(this).replaceWith(svg);
      }
    });
    var output = this.svgToString(svgcontent, 0);

    // Rewrap gsvg
    if (nakedSvgs.length) {
      $$9(nakedSvgs).each(function () {
        groupSvgElem(this);
      });
    }

    return output;
  };

  /**
  * Sub function ran on each SVG element to convert it to a string as desired
  * @param elem - The SVG element to convert
  * @param {Number} indent - Integer with the amount of spaces to indent this tag
  * @returns {String} The given element as an SVG tag
  */
  this.svgToString = function (elem, indent) {
    var out = [];
    var unit = curConfig.baseUnit;
    var unitRe = new RegExp('^-?[\\d\\.]+' + unit + '$');

    if (elem) {
      cleanupElement(elem);
      var attrs = Array.from(elem.attributes);
      var i = void 0;
      var childs = elem.childNodes;
      attrs.sort(function (a, b) {
        return a.name > b.name ? -1 : 1;
      });

      for (i = 0; i < indent; i++) {
        out.push(' ');
      }
      out.push('<');out.push(elem.nodeName);
      if (elem.id === 'svgcontent') {
        // Process root element separately
        var res = getResolution();

        var vb = '';
        // TODO: Allow this by dividing all values by current baseVal
        // Note that this also means we should properly deal with this on import
        // if (curConfig.baseUnit !== 'px') {
        //   const unit = curConfig.baseUnit;
        //   const unitM = getTypeMap()[unit];
        //   res.w = shortFloat(res.w / unitM);
        //   res.h = shortFloat(res.h / unitM);
        //   vb = ' viewBox="' + [0, 0, res.w, res.h].join(' ') + '"';
        //   res.w += unit;
        //   res.h += unit;
        // }

        if (unit !== 'px') {
          res.w = convertUnit(res.w, unit) + unit;
          res.h = convertUnit(res.h, unit) + unit;
        }

        out.push(' width="' + res.w + '" height="' + res.h + '"' + vb + ' xmlns="' + NS.SVG + '"');

        var nsuris = {};

        // Check elements for namespaces, add if found
        $$9(elem).find('*').andSelf().each(function () {
          // const el = this;
          // for some elements have no attribute
          var uri = this.namespaceURI;
          if (uri && !nsuris[uri] && nsMap[uri] && nsMap[uri] !== 'xmlns' && nsMap[uri] !== 'xml') {
            nsuris[uri] = true;
            out.push(' xmlns:' + nsMap[uri] + '="' + uri + '"');
          }

          $$9.each(this.attributes, function (i, attr) {
            var uri = attr.namespaceURI;
            if (uri && !nsuris[uri] && nsMap[uri] !== 'xmlns' && nsMap[uri] !== 'xml') {
              nsuris[uri] = true;
              out.push(' xmlns:' + nsMap[uri] + '="' + uri + '"');
            }
          });
        });

        i = attrs.length;
        var attrNames = ['width', 'height', 'xmlns', 'x', 'y', 'viewBox', 'id', 'overflow'];
        while (i--) {
          var attr = attrs[i];
          var attrVal = toXml(attr.value);

          // Namespaces have already been dealt with, so skip
          if (attr.nodeName.startsWith('xmlns:')) {
            continue;
          }

          // only serialize attributes we don't use internally
          if (attrVal !== '' && !attrNames.includes(attr.localName)) {
            if (!attr.namespaceURI || nsMap[attr.namespaceURI]) {
              out.push(' ');
              out.push(attr.nodeName);out.push('="');
              out.push(attrVal);out.push('"');
            }
          }
        }
      } else {
        // Skip empty defs
        if (elem.nodeName === 'defs' && !elem.firstChild) {
          return;
        }

        var mozAttrs = ['-moz-math-font-style', '_moz-math-font-style'];
        for (i = attrs.length - 1; i >= 0; i--) {
          var _attr = attrs[i];
          var _attrVal = toXml(_attr.value);
          // remove bogus attributes added by Gecko
          if (mozAttrs.includes(_attr.localName)) {
            continue;
          }
          if (_attrVal !== '') {
            if (_attrVal.startsWith('pointer-events')) {
              continue;
            }
            if (_attr.localName === 'class' && _attrVal.startsWith('se_')) {
              continue;
            }
            out.push(' ');
            if (_attr.localName === 'd') {
              _attrVal = pathActions$$1.convertPath(elem, true);
            }
            if (!isNaN(_attrVal)) {
              _attrVal = shortFloat(_attrVal);
            } else if (unitRe.test(_attrVal)) {
              _attrVal = shortFloat(_attrVal) + unit;
            }

            // Embed images when saving
            if (saveOptions.apply && elem.nodeName === 'image' && _attr.localName === 'href' && saveOptions.images && saveOptions.images === 'embed') {
              var img = encodableImages[_attrVal];
              if (img) {
                _attrVal = img;
              }
            }

            // map various namespaces to our fixed namespace prefixes
            // (the default xmlns attribute itself does not get a prefix)
            if (!_attr.namespaceURI || _attr.namespaceURI === NS.SVG || nsMap[_attr.namespaceURI]) {
              out.push(_attr.nodeName);out.push('="');
              out.push(_attrVal);out.push('"');
            }
          }
        }
      }

      if (elem.hasChildNodes()) {
        out.push('>');
        indent++;
        var bOneLine = false;

        for (i = 0; i < childs.length; i++) {
          var child = childs.item(i);
          switch (child.nodeType) {
            case 1:
              // element node
              out.push('\n');
              out.push(this.svgToString(childs.item(i), indent));
              break;
            case 3:
              // text node
              var str = child.nodeValue.replace(/^\s+|\s+$/g, '');
              if (str !== '') {
                bOneLine = true;
                out.push(String(toXml(str)));
              }
              break;
            case 4:
              // cdata node
              out.push('\n');
              out.push(new Array(indent + 1).join(' '));
              out.push('<![CDATA[');
              out.push(child.nodeValue);
              out.push(']]>');
              break;
            case 8:
              // comment
              out.push('\n');
              out.push(new Array(indent + 1).join(' '));
              out.push('<!--');
              out.push(child.data);
              out.push('-->');
              break;
          } // switch on node type
        }
        indent--;
        if (!bOneLine) {
          out.push('\n');
          for (i = 0; i < indent; i++) {
            out.push(' ');
          }
        }
        out.push('</');out.push(elem.nodeName);out.push('>');
      } else {
        out.push('/>');
      }
    }
    return out.join('');
  }; // end svgToString()

  /**
  * Converts a given image file to a data URL when possible, then runs a given callback
  * @param {String} val - String with the path/URL of the image
  * @param {Function} callback - Optional function to run when image data is found, supplies the
  * result (data URL or false) as first parameter.
  */
  this.embedImage = function (val, callback) {
    // load in the image and once it's loaded, get the dimensions
    $$9(new Image()).load(function () {
      // create a canvas the same size as the raster image
      var canvas = document.createElement('canvas');
      canvas.width = this.width;
      canvas.height = this.height;
      // load the raster image into the canvas
      canvas.getContext('2d').drawImage(this, 0, 0);
      // retrieve the data: URL
      try {
        var urldata = ';svgedit_url=' + encodeURIComponent(val);
        urldata = canvas.toDataURL().replace(';base64', urldata + ';base64');
        encodableImages[val] = urldata;
      } catch (e) {
        encodableImages[val] = false;
      }
      lastGoodImgUrl = val;
      if (callback) {
        callback(encodableImages[val]);
      }
    }).attr('src', val);
  };

  /**
  * Sets a given URL to be a "last good image" URL
  */
  this.setGoodImage = function (val) {
    lastGoodImgUrl = val;
  };

  /**
  *
  */
  this.open = function () {
    // Nothing by default, handled by optional widget/extension
  };

  /**
  * Serializes the current drawing into SVG XML text and returns it to the 'saved' handler.
  * This function also includes the XML prolog. Clients of the SvgCanvas bind their save
  * function to the 'saved' event.
  */
  this.save = function (opts) {
    // remove the selected outline before serializing
    clearSelection();
    // Update save options if provided
    if (opts) {
      $$9.extend(saveOptions, opts);
    }
    saveOptions.apply = true;

    // no need for doctype, see https://jwatt.org/svg/authoring/#doctype-declaration
    var str = this.svgCanvasToString();
    call('saved', str);
  };

  /**
  * Codes only is useful for locale-independent detection
  */
  function getIssues() {
    // remove the selected outline before serializing
    clearSelection();

    // Check for known CanVG issues
    var issues = [];
    var issueCodes = [];

    // Selector and notice
    var issueList = {
      feGaussianBlur: uiStrings.exportNoBlur,
      foreignObject: uiStrings.exportNoforeignObject,
      '[stroke-dasharray]': uiStrings.exportNoDashArray
    };
    var content = $$9(svgcontent);

    // Add font/text check if Canvas Text API is not implemented
    if (!('font' in $$9('<canvas>')[0].getContext('2d'))) {
      issueList.text = uiStrings.exportNoText;
    }

    $$9.each(issueList, function (sel, descr) {
      if (content.find(sel).length) {
        issueCodes.push(sel);
        issues.push(descr);
      }
    });
    return { issues: issues, issueCodes: issueCodes };
  }

  var canvg = void 0;
  /**
  * Generates a Data URL based on the current image, then calls "exported"
  * with an object including the string, image information, and any issues found
  * @param {String} [imgType="PNG"]
  * @param {Number} [quality] Between 0 and 1
  * @param {String} [exportWindowName]
  * @param {Function} [cb]
  * @returns {Promise}
  */
  this.rasterExport = function (imgType, quality, exportWindowName, cb) {
    var _this = this;

    var mimeType = 'image/' + imgType.toLowerCase();

    var _getIssues = getIssues(),
        issues = _getIssues.issues,
        issueCodes = _getIssues.issueCodes;

    var svg = this.svgCanvasToString();

    return new Promise(function () {
      var _ref3 = asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(resolve, reject) {
        var _ref4, type, c, dataURLType, datauri, bloburl, done;

        return regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                done = function done() {
                  var obj = {
                    datauri: datauri, bloburl: bloburl, svg: svg, issues: issues, issueCodes: issueCodes, type: imgType,
                    mimeType: mimeType, quality: quality, exportWindowName: exportWindowName
                  };
                  call('exported', obj);
                  if (cb) {
                    cb(obj);
                  }
                  resolve(obj);
                };

                if (canvg) {
                  _context.next = 6;
                  break;
                }

                _context.next = 4;
                return importSetGlobal(curConfig.canvgPath + 'canvg.js', {
                  global: 'canvg'
                });

              case 4:
                _ref4 = _context.sent;
                canvg = _ref4.canvg;

              case 6:
                type = imgType || 'PNG';

                if (!$$9('#export_canvas').length) {
                  $$9('<canvas>', { id: 'export_canvas' }).hide().appendTo('body');
                }
                c = $$9('#export_canvas')[0];

                c.width = canvas.contentW;
                c.height = canvas.contentH;

                _context.next = 13;
                return canvg(c, svg);

              case 13:
                dataURLType = (type === 'ICO' ? 'BMP' : type).toLowerCase();
                datauri = quality ? c.toDataURL('image/' + dataURLType, quality) : c.toDataURL('image/' + dataURLType);
                bloburl = void 0;

                if (!c.toBlob) {
                  _context.next = 19;
                  break;
                }

                c.toBlob(function (blob) {
                  bloburl = createObjectURL(blob);
                  done();
                }, mimeType, quality);
                return _context.abrupt('return');

              case 19:
                bloburl = dataURLToObjectURL(datauri);
                done();

              case 21:
              case 'end':
                return _context.stop();
            }
          }
        }, _callee, _this);
      }));

      return function (_x, _x2) {
        return _ref3.apply(this, arguments);
      };
    }());
  };

  /**
  * @param {String} exportWindowName
  * @param outputType Needed?
  * @param {Function} cb
  * @returns {Promise}
  */
  this.exportPDF = function (exportWindowName, outputType, cb) {
    var _this2 = this;

    var that = this;
    return new Promise(function () {
      var _ref5 = asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(resolve, reject) {
        var modularVersion, res, orientation, unit, doc, docTitle, _getIssues2, issues, issueCodes, svg, obj, method;

        return regeneratorRuntime.wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                if (window.jsPDF) {
                  _context2.next = 6;
                  break;
                }

                _context2.next = 3;
                return importScript([
                // We do not currently have these paths configurable as they are
                //   currently global-only, so not Rolled-up
                'jspdf/underscore-min.js', 'jspdf/jspdf.min.js']);

              case 3:
                modularVersion = !('svgEditor' in window) || !window.svgEditor || window.svgEditor.modules !== false;
                // Todo: Switch to `import()` when widely supported and available (also allow customization of path)

                _context2.next = 6;
                return importScript(curConfig.jspdfPath + 'jspdf.plugin.svgToPdf.js', {
                  type: modularVersion ? 'module' : 'text/javascript'
                });

              case 6:
                res = getResolution();
                orientation = res.w > res.h ? 'landscape' : 'portrait';
                unit = 'pt'; // curConfig.baseUnit; // We could use baseUnit, but that is presumably not intended for export purposes

                doc = jsPDF({
                  orientation: orientation,
                  unit: unit,
                  format: [res.w, res.h]
                  // , compressPdf: true
                }); // Todo: Give options to use predefined jsPDF formats like "a4", etc. from pull-down (with option to keep customizable)

                docTitle = getDocumentTitle();

                doc.setProperties({
                  title: docTitle /* ,
                                  subject: '',
                                  author: '',
                                  keywords: '',
                                  creator: '' */
                });
                _getIssues2 = getIssues(), issues = _getIssues2.issues, issueCodes = _getIssues2.issueCodes;
                svg = that.svgCanvasToString();

                doc.addSVG(svg, 0, 0);

                // doc.output('save'); // Works to open in a new
                //  window; todo: configure this and other export
                //  options to optionally work in this manner as
                //  opposed to opening a new tab
                obj = { svg: svg, issues: issues, issueCodes: issueCodes, exportWindowName: exportWindowName };
                method = outputType || 'dataurlstring';

                obj[method] = doc.output(method);
                if (cb) {
                  cb(obj);
                }
                resolve(obj);
                call('exportedPDF', obj);

              case 21:
              case 'end':
                return _context2.stop();
            }
          }
        }, _callee2, _this2);
      }));

      return function (_x3, _x4) {
        return _ref5.apply(this, arguments);
      };
    }());
  };

  /**
  * Returns the current drawing as raw SVG XML text.
  * @returns The current drawing as raw SVG XML text.
  */
  this.getSvgString = function () {
    saveOptions.apply = false;
    return this.svgCanvasToString();
  };

  /**
  * This function determines whether to use a nonce in the prefix, when
  * generating IDs for future documents in SVG-Edit.
  * @param {Boolean} [enableRandomization] If true, adds a nonce to the prefix. Thus
  * svgCanvas.randomizeIds() <==> svgCanvas.randomizeIds(true)
  *
  * if you're controlling SVG-Edit externally, and want randomized IDs, call
  * this BEFORE calling svgCanvas.setSvgString
  */
  this.randomizeIds = function (enableRandomization) {
    if (arguments.length > 0 && enableRandomization === false) {
      randomizeIds(false, getCurrentDrawing());
    } else {
      randomizeIds(true, getCurrentDrawing());
    }
  };

  /**
  * Ensure each element has a unique ID
  * @param g - The parent element of the tree to give unique IDs
  */
  var uniquifyElems = this.uniquifyElems = function (g) {
    var ids = {};
    // TODO: Handle markers and connectors. These are not yet re-identified properly
    // as their referring elements do not get remapped.
    //
    // <marker id='se_marker_end_svg_7'/>
    // <polyline id='svg_7' se:connector='svg_1 svg_6' marker-end='url(#se_marker_end_svg_7)'/>
    //
    // Problem #1: if svg_1 gets renamed, we do not update the polyline's se:connector attribute
    // Problem #2: if the polyline svg_7 gets renamed, we do not update the marker id nor the polyline's marker-end attribute
    var refElems = ['filter', 'linearGradient', 'pattern', 'radialGradient', 'symbol', 'textPath', 'use'];

    walkTree(g, function (n) {
      // if it's an element node
      if (n.nodeType === 1) {
        // and the element has an ID
        if (n.id) {
          // and we haven't tracked this ID yet
          if (!(n.id in ids)) {
            // add this id to our map
            ids[n.id] = { elem: null, attrs: [], hrefs: [] };
          }
          ids[n.id].elem = n;
        }

        // now search for all attributes on this element that might refer
        // to other elements
        $$9.each(refAttrs, function (i, attr) {
          var attrnode = n.getAttributeNode(attr);
          if (attrnode) {
            // the incoming file has been sanitized, so we should be able to safely just strip off the leading #
            var url = getUrlFromAttr(attrnode.value),
                refid = url ? url.substr(1) : null;
            if (refid) {
              if (!(refid in ids)) {
                // add this id to our map
                ids[refid] = { elem: null, attrs: [], hrefs: [] };
              }
              ids[refid].attrs.push(attrnode);
            }
          }
        });

        // check xlink:href now
        var href = getHref(n);
        // TODO: what if an <image> or <a> element refers to an element internally?
        if (href && refElems.includes(n.nodeName)) {
          var refid = href.substr(1);
          if (refid) {
            if (!(refid in ids)) {
              // add this id to our map
              ids[refid] = { elem: null, attrs: [], hrefs: [] };
            }
            ids[refid].hrefs.push(n);
          }
        }
      }
    });

    // in ids, we now have a map of ids, elements and attributes, let's re-identify
    for (var oldid in ids) {
      if (!oldid) {
        continue;
      }
      var elem = ids[oldid].elem;

      if (elem) {
        var newid = getNextId();

        // assign element its new id
        elem.id = newid;

        // remap all url() attributes
        var attrs = ids[oldid].attrs;

        var j = attrs.length;
        while (j--) {
          var attr = attrs[j];
          attr.ownerElement.setAttribute(attr.name, 'url(#' + newid + ')');
        }

        // remap all href attributes
        var hreffers = ids[oldid].hrefs;
        var k = hreffers.length;
        while (k--) {
          var hreffer = hreffers[k];
          setHref(hreffer, '#' + newid);
        }
      }
    }
  };

  /**
  * Assigns reference data for each use element
  */
  var setUseData = this.setUseData = function (parent) {
    var elems = $$9(parent);

    if (parent.tagName !== 'use') {
      elems = elems.find('use');
    }

    elems.each(function () {
      var id = getHref(this).substr(1);
      var refElem = getElem(id);
      if (!refElem) {
        return;
      }
      $$9(this).data('ref', refElem);
      if (refElem.tagName === 'symbol' || refElem.tagName === 'svg') {
        $$9(this).data('symbol', refElem).data('ref', refElem);
      }
    });
  };

  /**
  * Converts gradients from userSpaceOnUse to objectBoundingBox
  * @param elem
  */
  var convertGradients = this.convertGradients = function (elem) {
    var elems = $$9(elem).find('linearGradient, radialGradient');
    if (!elems.length && isWebkit()) {
      // Bug in webkit prevents regular *Gradient selector search
      elems = $$9(elem).find('*').filter(function () {
        return this.tagName.includes('Gradient');
      });
    }

    elems.each(function () {
      var grad = this;
      if ($$9(grad).attr('gradientUnits') === 'userSpaceOnUse') {
        // TODO: Support more than one element with this ref by duplicating parent grad
        var _elems = $$9(svgcontent).find('[fill="url(#' + grad.id + ')"],[stroke="url(#' + grad.id + ')"]');
        if (!_elems.length) {
          return;
        }

        // get object's bounding box
        var bb = getBBox(_elems[0]);

        // This will occur if the element is inside a <defs> or a <symbol>,
        // in which we shouldn't need to convert anyway.
        if (!bb) {
          return;
        }

        if (grad.tagName === 'linearGradient') {
          var gCoords = $$9(grad).attr(['x1', 'y1', 'x2', 'y2']);

          // If has transform, convert
          var tlist = grad.gradientTransform.baseVal;
          if (tlist && tlist.numberOfItems > 0) {
            var m = transformListToTransform(tlist).matrix;
            var pt1 = transformPoint(gCoords.x1, gCoords.y1, m);
            var pt2 = transformPoint(gCoords.x2, gCoords.y2, m);

            gCoords.x1 = pt1.x;
            gCoords.y1 = pt1.y;
            gCoords.x2 = pt2.x;
            gCoords.y2 = pt2.y;
            grad.removeAttribute('gradientTransform');
          }

          $$9(grad).attr({
            x1: (gCoords.x1 - bb.x) / bb.width,
            y1: (gCoords.y1 - bb.y) / bb.height,
            x2: (gCoords.x2 - bb.x) / bb.width,
            y2: (gCoords.y2 - bb.y) / bb.height
          });
          grad.removeAttribute('gradientUnits');
        }
        // else {
        //   Note: radialGradient elements cannot be easily converted
        //   because userSpaceOnUse will keep circular gradients, while
        //   objectBoundingBox will x/y scale the gradient according to
        //   its bbox.
        //
        //   For now we'll do nothing, though we should probably have
        //   the gradient be updated as the element is moved, as
        //   inkscape/illustrator do.
        //
        //   const gCoords = $(grad).attr(['cx', 'cy', 'r']);
        //
        //   $(grad).attr({
        //     cx: (gCoords.cx - bb.x) / bb.width,
        //     cy: (gCoords.cy - bb.y) / bb.height,
        //     r: gCoords.r
        //   });
        //
        //   grad.removeAttribute('gradientUnits');
        // }
      }
    });
  };

  /**
  * Converts selected/given <use> or child SVG element to a group
  * @param elem
  */
  var convertToGroup = this.convertToGroup = function (elem) {
    if (!elem) {
      elem = selectedElements[0];
    }
    var $elem = $$9(elem);
    var batchCmd = new BatchCommand$1();
    var ts = void 0;

    if ($elem.data('gsvg')) {
      // Use the gsvg as the new group
      var svg = elem.firstChild;
      var pt = $$9(svg).attr(['x', 'y']);

      $$9(elem.firstChild.firstChild).unwrap();
      $$9(elem).removeData('gsvg');

      var tlist = getTransformList(elem);
      var xform = svgroot.createSVGTransform();
      xform.setTranslate(pt.x, pt.y);
      tlist.appendItem(xform);
      recalculateDimensions(elem);
      call('selected', [elem]);
    } else if ($elem.data('symbol')) {
      elem = $elem.data('symbol');

      ts = $elem.attr('transform');
      var pos = $elem.attr(['x', 'y']);

      var vb = elem.getAttribute('viewBox');

      if (vb) {
        var nums = vb.split(' ');
        pos.x -= +nums[0];
        pos.y -= +nums[1];
      }

      // Not ideal, but works
      ts += ' translate(' + (pos.x || 0) + ',' + (pos.y || 0) + ')';

      var prev = $elem.prev();

      // Remove <use> element
      batchCmd.addSubCommand(new RemoveElementCommand$1($elem[0], $elem[0].nextSibling, $elem[0].parentNode));
      $elem.remove();

      // See if other elements reference this symbol
      var hasMore = $$9(svgcontent).find('use:data(symbol)').length;

      var g = svgdoc.createElementNS(NS.SVG, 'g');
      var childs = elem.childNodes;

      var i = void 0;
      for (i = 0; i < childs.length; i++) {
        g.append(childs[i].cloneNode(true));
      }

      // Duplicate the gradients for Gecko, since they weren't included in the <symbol>
      if (isGecko()) {
        var dupeGrads = $$9(findDefs()).children('linearGradient,radialGradient,pattern').clone();
        $$9(g).append(dupeGrads);
      }

      if (ts) {
        g.setAttribute('transform', ts);
      }

      var parent = elem.parentNode;

      uniquifyElems(g);

      // Put the dupe gradients back into <defs> (after uniquifying them)
      if (isGecko()) {
        $$9(findDefs()).append($$9(g).find('linearGradient,radialGradient,pattern'));
      }

      // now give the g itself a new id
      g.id = getNextId();

      prev.after(g);

      if (parent) {
        if (!hasMore) {
          // remove symbol/svg element
          var _elem = elem,
              nextSibling = _elem.nextSibling;

          elem.remove();
          batchCmd.addSubCommand(new RemoveElementCommand$1(elem, nextSibling, parent));
        }
        batchCmd.addSubCommand(new InsertElementCommand$1(g));
      }

      setUseData(g);

      if (isGecko()) {
        convertGradients(findDefs());
      } else {
        convertGradients(g);
      }

      // recalculate dimensions on the top-level children so that unnecessary transforms
      // are removed
      walkTreePost(g, function (n) {
        try {
          recalculateDimensions(n);
        } catch (e) {
          console.log(e);
        }
      });

      // Give ID for any visible element missing one
      $$9(g).find(visElems).each(function () {
        if (!this.id) {
          this.id = getNextId();
        }
      });

      selectOnly([g]);

      var cm = pushGroupProperties(g, true);
      if (cm) {
        batchCmd.addSubCommand(cm);
      }

      addCommandToHistory(batchCmd);
    } else {
      console.log('Unexpected element to ungroup:', elem);
    }
  };

  /**
  * This function sets the current drawing as the input SVG XML.
  * @param {String} xmlString - The SVG as XML text.
  * @param {Boolean} [preventUndo=false] - Indicates if we want to do the
  * changes without adding them to the undo stack - e.g. for initializing a
  * drawing on page load.
  * @returns {Boolean} This function returns false if the set was
  *     unsuccessful, true otherwise.
  */
  this.setSvgString = function (xmlString, preventUndo) {
    try {
      // convert string into XML document
      var newDoc = text2xml(xmlString);
      if (newDoc.firstElementChild && newDoc.firstElementChild.namespaceURI !== NS.SVG) {
        return false;
      }

      this.prepareSvg(newDoc);

      var batchCmd = new BatchCommand$1('Change Source');

      // remove old svg document
      var _svgcontent = svgcontent,
          nextSibling = _svgcontent.nextSibling;

      var oldzoom = svgroot.removeChild(svgcontent);
      batchCmd.addSubCommand(new RemoveElementCommand$1(oldzoom, nextSibling, svgroot));

      // set new svg document
      // If DOM3 adoptNode() available, use it. Otherwise fall back to DOM2 importNode()
      if (svgdoc.adoptNode) {
        svgcontent = svgdoc.adoptNode(newDoc.documentElement);
      } else {
        svgcontent = svgdoc.importNode(newDoc.documentElement, true);
      }

      svgroot.append(svgcontent);
      var content = $$9(svgcontent);

      canvas.current_drawing_ = new Drawing(svgcontent, idprefix);

      // retrieve or set the nonce
      var nonce = getCurrentDrawing().getNonce();
      if (nonce) {
        call('setnonce', nonce);
      } else {
        call('unsetnonce');
      }

      // change image href vals if possible
      content.find('image').each(function () {
        var image = this;
        preventClickDefault(image);
        var val = getHref(this);
        if (val) {
          if (val.startsWith('data:')) {
            // Check if an SVG-edit data URI
            var m = val.match(/svgedit_url=(.*?);/);
            if (m) {
              var url = decodeURIComponent(m[1]);
              $$9(new Image()).load(function () {
                image.setAttributeNS(NS.XLINK, 'xlink:href', url);
              }).attr('src', url);
            }
          }
          // Add to encodableImages if it loads
          canvas.embedImage(val);
        }
      });

      // Wrap child SVGs in group elements
      content.find('svg').each(function () {
        // Skip if it's in a <defs>
        if ($$9(this).closest('defs').length) {
          return;
        }

        uniquifyElems(this);

        // Check if it already has a gsvg group
        var pa = this.parentNode;
        if (pa.childNodes.length === 1 && pa.nodeName === 'g') {
          $$9(pa).data('gsvg', this);
          pa.id = pa.id || getNextId();
        } else {
          groupSvgElem(this);
        }
      });

      // For Firefox: Put all paint elems in defs
      if (isGecko()) {
        content.find('linearGradient, radialGradient, pattern').appendTo(findDefs());
      }

      // Set ref element for <use> elements

      // TODO: This should also be done if the object is re-added through "redo"
      setUseData(content);

      convertGradients(content[0]);

      var attrs = {
        id: 'svgcontent',
        overflow: curConfig.show_outside_canvas ? 'visible' : 'hidden'
      };

      var percs = false;

      // determine proper size
      if (content.attr('viewBox')) {
        var vb = content.attr('viewBox').split(' ');
        attrs.width = vb[2];
        attrs.height = vb[3];
        // handle content that doesn't have a viewBox
      } else {
        $$9.each(['width', 'height'], function (i, dim) {
          // Set to 100 if not given
          var val = content.attr(dim) || '100%';

          if (String(val).substr(-1) === '%') {
            // Use user units if percentage given
            percs = true;
          } else {
            attrs[dim] = convertToNum(dim, val);
          }
        });
      }

      // identify layers
      identifyLayers();

      // Give ID for any visible layer children missing one
      content.children().find(visElems).each(function () {
        if (!this.id) {
          this.id = getNextId();
        }
      });

      // Percentage width/height, so let's base it on visible elements
      if (percs) {
        var bb = getStrokedBBoxDefaultVisible();
        attrs.width = bb.width + bb.x;
        attrs.height = bb.height + bb.y;
      }

      // Just in case negative numbers are given or
      // result from the percs calculation
      if (attrs.width <= 0) {
        attrs.width = 100;
      }
      if (attrs.height <= 0) {
        attrs.height = 100;
      }

      content.attr(attrs);
      this.contentW = attrs.width;
      this.contentH = attrs.height;

      batchCmd.addSubCommand(new InsertElementCommand$1(svgcontent));
      // update root to the correct size
      var changes = content.attr(['width', 'height']);
      batchCmd.addSubCommand(new ChangeElementCommand$1(svgroot, changes));

      // reset zoom
      currentZoom = 1;

      // reset transform lists
      resetListMap();
      clearSelection();
      clearData();
      svgroot.append(selectorManager.selectorParentGroup);

      if (!preventUndo) addCommandToHistory(batchCmd);
      call('changed', [svgcontent]);
    } catch (e) {
      console.log(e);
      return false;
    }

    return true;
  };

  /**
  * This function imports the input SVG XML as a &lt;symbol> in the &lt;defs>, then adds a
  * &lt;use> to the current layer.
  * @param {String} xmlString - The SVG as XML text.
  * @returns This function returns null if the import was unsuccessful, or the element otherwise.
  * @todo
  * - properly handle if namespace is introduced by imported content (must add to svgcontent
  * and update all prefixes in the imported node)
  * - properly handle recalculating dimensions, recalculateDimensions() doesn't handle
  * arbitrary transform lists, but makes some assumptions about how the transform list
  * was obtained
  * - import should happen in top-left of current zoomed viewport
  */
  this.importSvgString = function (xmlString) {
    var j = void 0,
        ts = void 0,
        useEl = void 0;
    try {
      // Get unique ID
      var uid = encode64(xmlString.length + xmlString).substr(0, 32);

      var useExisting = false;
      // Look for symbol and make sure symbol exists in image
      if (importIds[uid]) {
        if ($$9(importIds[uid].symbol).parents('#svgroot').length) {
          useExisting = true;
        }
      }

      var batchCmd = new BatchCommand$1('Import Image');
      var symbol = void 0;
      if (useExisting) {
        symbol = importIds[uid].symbol;

        ts = importIds[uid].xform;
      } else {
        // convert string into XML document
        var newDoc = text2xml(xmlString);

        this.prepareSvg(newDoc);

        // import new svg document into our document
        var svg = void 0;
        // If DOM3 adoptNode() available, use it. Otherwise fall back to DOM2 importNode()
        if (svgdoc.adoptNode) {
          svg = svgdoc.adoptNode(newDoc.documentElement);
        } else {
          svg = svgdoc.importNode(newDoc.documentElement, true);
        }

        uniquifyElems(svg);

        var innerw = convertToNum('width', svg.getAttribute('width')),
            innerh = convertToNum('height', svg.getAttribute('height')),
            innervb = svg.getAttribute('viewBox'),

        // if no explicit viewbox, create one out of the width and height
        vb = innervb ? innervb.split(' ') : [0, 0, innerw, innerh];
        for (j = 0; j < 4; ++j) {
          vb[j] = +vb[j];
        }

        // TODO: properly handle preserveAspectRatio
        var // canvasw = +svgcontent.getAttribute('width'),
        canvash = +svgcontent.getAttribute('height');
        // imported content should be 1/3 of the canvas on its largest dimension

        if (innerh > innerw) {
          ts = 'scale(' + canvash / 3 / vb[3] + ')';
        } else {
          ts = 'scale(' + canvash / 3 / vb[2] + ')';
        }

        // Hack to make recalculateDimensions understand how to scale
        ts = 'translate(0) ' + ts + ' translate(0)';

        symbol = svgdoc.createElementNS(NS.SVG, 'symbol');
        var defs = findDefs();

        if (isGecko()) {
          // Move all gradients into root for Firefox, workaround for this bug:
          // https://bugzilla.mozilla.org/show_bug.cgi?id=353575
          // TODO: Make this properly undo-able.
          $$9(svg).find('linearGradient, radialGradient, pattern').appendTo(defs);
        }

        while (svg.firstChild) {
          var first = svg.firstChild;
          symbol.append(first);
        }
        var attrs = svg.attributes;
        for (var i = 0; i < attrs.length; i++) {
          var attr = attrs[i];
          symbol.setAttribute(attr.nodeName, attr.value);
        }
        symbol.id = getNextId();

        // Store data
        importIds[uid] = {
          symbol: symbol,
          xform: ts
        };

        findDefs().append(symbol);
        batchCmd.addSubCommand(new InsertElementCommand$1(symbol));
      }

      useEl = svgdoc.createElementNS(NS.SVG, 'use');
      useEl.id = getNextId();
      setHref(useEl, '#' + symbol.id);

      (currentGroup || getCurrentDrawing().getCurrentLayer()).append(useEl);
      batchCmd.addSubCommand(new InsertElementCommand$1(useEl));
      clearSelection();

      useEl.setAttribute('transform', ts);
      recalculateDimensions(useEl);
      $$9(useEl).data('symbol', symbol).data('ref', symbol);
      addToSelection([useEl]);

      // TODO: Find way to add this in a recalculateDimensions-parsable way
      // if (vb[0] !== 0 || vb[1] !== 0) {
      //   ts = 'translate(' + (-vb[0]) + ',' + (-vb[1]) + ') ' + ts;
      // }
      addCommandToHistory(batchCmd);
      call('changed', [svgcontent]);
    } catch (e) {
      console.log(e);
      return null;
    }

    // we want to return the element so we can automatically select it
    return useEl;
  };

  // Could deprecate, but besides external uses, their usage makes clear that
  //  canvas is a dependency for all of these
  ['identifyLayers', 'createLayer', 'cloneLayer', 'deleteCurrentLayer', 'setCurrentLayer', 'renameCurrentLayer', 'setCurrentLayerPosition', 'setLayerVisibility', 'moveSelectedToLayer', 'mergeLayer', 'mergeAllLayers', 'leaveContext', 'setContext'].forEach(function (prop) {
    canvas[prop] = draw[prop];
  });
  init$3({
    pathActions: pathActions$$1,
    getCurrentGroup: function getCurrentGroup() {
      return currentGroup;
    },
    setCurrentGroup: function setCurrentGroup(cg) {
      currentGroup = cg;
    },

    getSelectedElements: getSelectedElements,
    getSVGContent: getSVGContent,
    undoMgr: undoMgr,
    elData: elData,
    getCurrentDrawing: getCurrentDrawing,
    clearSelection: clearSelection,
    call: call,
    addCommandToHistory: addCommandToHistory,
    changeSvgcontent: function changeSvgcontent() {
      call('changed', [svgcontent]);
    }
  });

  /**
  * Group: Document functions
  */

  /**
  * Clears the current document. This is not an undoable action.
  */
  this.clear = function () {
    pathActions$$1.clear();

    clearSelection();

    // clear the svgcontent node
    canvas.clearSvgContentElement();

    // create new document
    canvas.current_drawing_ = new Drawing(svgcontent);

    // create empty first layer
    canvas.createLayer('Layer 1');

    // clear the undo stack
    canvas.undoMgr.resetUndoStack();

    // reset the selector manager
    selectorManager.initGroup();

    // reset the rubber band box
    rubberBox = selectorManager.getRubberBandBox();

    call('cleared');
  };

  /**
  * Alias function
  */
  this.linkControlPoints = pathActions$$1.linkControlPoints;

  /**
  * @returns The content DOM element
  */
  this.getContentElem = function () {
    return svgcontent;
  };

  /**
  * @returns The root DOM element
  */
  this.getRootElem = function () {
    return svgroot;
  };

  /**
  * @returns {Object} The current dimensions and zoom level in an object
  */
  var getResolution = this.getResolution = function () {
    //    const vb = svgcontent.getAttribute('viewBox').split(' ');
    //    return {w:vb[2], h:vb[3], zoom: currentZoom};

    var w = svgcontent.getAttribute('width') / currentZoom;
    var h = svgcontent.getAttribute('height') / currentZoom;

    return {
      w: w,
      h: h,
      zoom: currentZoom
    };
  };

  /**
  * @returns The current snap to grid setting
  */
  this.getSnapToGrid = function () {
    return curConfig.gridSnapping;
  };

  /**
  * @returns {String} A string which describes the revision number of SvgCanvas.
  */
  this.getVersion = function () {
    return 'svgcanvas.js ($Rev$)';
  };

  /**
  * Update interface strings with given values
  * @param strs - Object with strings (see locales file)
  */
  this.setUiStrings = function (strs) {
    Object.assign(uiStrings, strs.notification);
    setUiStrings(strs);
  };

  /**
  * Update configuration options with given values
  * @param {Object} opts - Object with options (see curConfig for examples)
  */
  this.setConfig = function (opts) {
    Object.assign(curConfig, opts);
  };

  /**
  * @param elem
  * @returns {String|undefined} the current group/SVG's title contents
  */
  this.getTitle = function (elem) {
    elem = elem || selectedElements[0];
    if (!elem) {
      return;
    }
    elem = $$9(elem).data('gsvg') || $$9(elem).data('symbol') || elem;
    var childs = elem.childNodes;
    for (var i = 0; i < childs.length; i++) {
      if (childs[i].nodeName === 'title') {
        return childs[i].textContent;
      }
    }
    return '';
  };

  /**
  * Sets the group/SVG's title content
  * @param val
  * @todo Combine this with `setDocumentTitle`
  */
  this.setGroupTitle = function (val) {
    var elem = selectedElements[0];
    elem = $$9(elem).data('gsvg') || elem;

    var ts = $$9(elem).children('title');

    var batchCmd = new BatchCommand$1('Set Label');

    var title = void 0;
    if (!val.length) {
      // Remove title element
      var tsNextSibling = ts.nextSibling;
      batchCmd.addSubCommand(new RemoveElementCommand$1(ts[0], tsNextSibling, elem));
      ts.remove();
    } else if (ts.length) {
      // Change title contents
      title = ts[0];
      batchCmd.addSubCommand(new ChangeElementCommand$1(title, { '#text': title.textContent }));
      title.textContent = val;
    } else {
      // Add title element
      title = svgdoc.createElementNS(NS.SVG, 'title');
      title.textContent = val;
      $$9(elem).prepend(title);
      batchCmd.addSubCommand(new InsertElementCommand$1(title));
    }

    addCommandToHistory(batchCmd);
  };

  /**
  * @returns {String|undefined} The current document title or an empty string if not found
  */
  var getDocumentTitle = this.getDocumentTitle = function () {
    return canvas.getTitle(svgcontent);
  };

  /**
  * Adds/updates a title element for the document with the given name.
  * This is an undoable action
  * @param {String} newtitle - String with the new title
  */
  this.setDocumentTitle = function (newtitle) {
    var childs = svgcontent.childNodes;
    var docTitle = false,
        oldTitle = '';

    var batchCmd = new BatchCommand$1('Change Image Title');

    for (var i = 0; i < childs.length; i++) {
      if (childs[i].nodeName === 'title') {
        docTitle = childs[i];
        oldTitle = docTitle.textContent;
        break;
      }
    }
    if (!docTitle) {
      docTitle = svgdoc.createElementNS(NS.SVG, 'title');
      svgcontent.insertBefore(docTitle, svgcontent.firstChild);
      // svgcontent.firstChild.before(docTitle); // Ok to replace above with this?
    }

    if (newtitle.length) {
      docTitle.textContent = newtitle;
    } else {
      // No title given, so element is not necessary
      docTitle.remove();
    }
    batchCmd.addSubCommand(new ChangeElementCommand$1(docTitle, { '#text': oldTitle }));
    addCommandToHistory(batchCmd);
  };

  /**
  * Returns the editor's namespace URL, optionally adds it to root element
  * @param {Boolean} add - Indicates whether or not to add the namespace value
  * @returns {String} The editor's namespace URL
  */
  this.getEditorNS = function (add) {
    if (add) {
      svgcontent.setAttribute('xmlns:se', NS.SE);
    }
    return NS.SE;
  };

  /**
  * Changes the document's dimensions to the given size
  * @param x - Number with the width of the new dimensions in user units.
  * Can also be the string "fit" to indicate "fit to content"
  * @param y - Number with the height of the new dimensions in user units.
  * @returns {Boolean} Indicates if resolution change was succesful.
  * It will fail on "fit to content" option with no content to fit to.
  */
  this.setResolution = function (x, y) {
    var res = getResolution();
    var w = res.w,
        h = res.h;

    var batchCmd = void 0;

    if (x === 'fit') {
      // Get bounding box
      var bbox = getStrokedBBoxDefaultVisible();

      if (bbox) {
        batchCmd = new BatchCommand$1('Fit Canvas to Content');
        var visEls = getVisibleElements();
        addToSelection(visEls);
        var dx = [],
            dy = [];
        $$9.each(visEls, function (i, item) {
          dx.push(bbox.x * -1);
          dy.push(bbox.y * -1);
        });

        var cmd = canvas.moveSelectedElements(dx, dy, true);
        batchCmd.addSubCommand(cmd);
        clearSelection();

        x = Math.round(bbox.width);
        y = Math.round(bbox.height);
      } else {
        return false;
      }
    }
    if (x !== w || y !== h) {
      if (!batchCmd) {
        batchCmd = new BatchCommand$1('Change Image Dimensions');
      }

      x = convertToNum('width', x);
      y = convertToNum('height', y);

      svgcontent.setAttribute('width', x);
      svgcontent.setAttribute('height', y);

      this.contentW = x;
      this.contentH = y;
      batchCmd.addSubCommand(new ChangeElementCommand$1(svgcontent, { width: w, height: h }));

      svgcontent.setAttribute('viewBox', [0, 0, x / currentZoom, y / currentZoom].join(' '));
      batchCmd.addSubCommand(new ChangeElementCommand$1(svgcontent, { viewBox: ['0 0', w, h].join(' ') }));

      addCommandToHistory(batchCmd);
      call('changed', [svgcontent]);
    }
    return true;
  };

  /**
  * @returns An object with x, y values indicating the svgcontent element's
  * position in the editor's canvas.
  */
  this.getOffset = function () {
    return $$9(svgcontent).attr(['x', 'y']);
  };

  /**
  * Sets the zoom level on the canvas-side based on the given value
  * @param val - Bounding box object to zoom to or string indicating zoom option
  * @param {Number} editorW - Integer with the editor's workarea box's width
  * @param {Number} editorH - Integer with the editor's workarea box's height
  * @returns {Object|undefined}
  */
  this.setBBoxZoom = function (val, editorW, editorH) {
    var spacer = 0.85;
    var bb = void 0;
    var calcZoom = function calcZoom(bb) {
      if (!bb) {
        return false;
      }
      var wZoom = Math.round(editorW / bb.width * 100 * spacer) / 100;
      var hZoom = Math.round(editorH / bb.height * 100 * spacer) / 100;
      var zoom = Math.min(wZoom, hZoom);
      canvas.setZoom(zoom);
      return { zoom: zoom, bbox: bb };
    };

    if ((typeof val === 'undefined' ? 'undefined' : _typeof(val)) === 'object') {
      bb = val;
      if (bb.width === 0 || bb.height === 0) {
        var newzoom = bb.zoom ? bb.zoom : currentZoom * bb.factor;
        canvas.setZoom(newzoom);
        return { zoom: currentZoom, bbox: bb };
      }
      return calcZoom(bb);
    }

    switch (val) {
      case 'selection':
        if (!selectedElements[0]) {
          return;
        }
        var selectedElems = $$9.map(selectedElements, function (n) {
          if (n) {
            return n;
          }
        });
        bb = getStrokedBBoxDefaultVisible(selectedElems);
        break;
      case 'canvas':
        var res = getResolution();
        spacer = 0.95;
        bb = { width: res.w, height: res.h, x: 0, y: 0 };
        break;
      case 'content':
        bb = getStrokedBBoxDefaultVisible();
        break;
      case 'layer':
        bb = getStrokedBBoxDefaultVisible(getVisibleElements(getCurrentDrawing().getCurrentLayer()));
        break;
      default:
        return;
    }
    return calcZoom(bb);
  };

  /**
  * Sets the zoom to the given level
  * @param {Number} zoomlevel - Float indicating the zoom level to change to
  */
  this.setZoom = function (zoomlevel) {
    var res = getResolution();
    svgcontent.setAttribute('viewBox', '0 0 ' + res.w / zoomlevel + ' ' + res.h / zoomlevel);
    currentZoom = zoomlevel;
    $$9.each(selectedElements, function (i, elem) {
      if (!elem) {
        return;
      }
      selectorManager.requestSelector(elem).resize();
    });
    pathActions$$1.zoomChange();
    runExtensions('zoomChanged', zoomlevel);
  };

  /**
  * @returns {String} The current editor mode string
  */
  this.getMode = function () {
    return currentMode;
  };

  /**
  * Sets the editor's mode to the given string
  * @param {String} name - String with the new mode to change to
  */
  this.setMode = function (name) {
    pathActions$$1.clear(true);
    textActions.clear();
    curProperties = selectedElements[0] && selectedElements[0].nodeName === 'text' ? curText : curShape;
    currentMode = name;
  };

  /**
  * Group: Element Styling
  */

  /**
  * @returns The current fill/stroke option
  */
  this.getColor = function (type) {
    return curProperties[type];
  };

  /**
  * Change the current stroke/fill color/gradient value
  * @param {String} type - String indicating fill or stroke
  * @param val - The value to set the stroke attribute to
  * @param {Boolean} preventUndo - Boolean indicating whether or not this should be and undoable option
  */
  this.setColor = function (type, val, preventUndo) {
    curShape[type] = val;
    curProperties[type + '_paint'] = { type: 'solidColor' };
    var elems = [];
    function addNonG(e) {
      if (e.nodeName !== 'g') {
        elems.push(e);
      }
    }
    var i = selectedElements.length;
    while (i--) {
      var elem = selectedElements[i];
      if (elem) {
        if (elem.tagName === 'g') {
          walkTree(elem, addNonG);
        } else {
          if (type === 'fill') {
            if (elem.tagName !== 'polyline' && elem.tagName !== 'line') {
              elems.push(elem);
            }
          } else {
            elems.push(elem);
          }
        }
      }
    }
    if (elems.length > 0) {
      if (!preventUndo) {
        changeSelectedAttribute(type, val, elems);
        call('changed', elems);
      } else {
        changeSelectedAttributeNoUndo(type, val, elems);
      }
    }
  };

  // Apply the current gradient to selected element's fill or stroke
  //
  // Parameters
  // type - String indicating "fill" or "stroke" to apply to an element
  var setGradient = this.setGradient = function (type) {
    if (!curProperties[type + '_paint'] || curProperties[type + '_paint'].type === 'solidColor') {
      return;
    }
    var grad = canvas[type + 'Grad'];
    // find out if there is a duplicate gradient already in the defs
    var duplicateGrad = findDuplicateGradient(grad);
    var defs = findDefs();
    // no duplicate found, so import gradient into defs
    if (!duplicateGrad) {
      // const origGrad = grad;
      grad = defs.appendChild(svgdoc.importNode(grad, true));
      // get next id and set it on the grad
      grad.id = getNextId();
    } else {
      // use existing gradient
      grad = duplicateGrad;
    }
    canvas.setColor(type, 'url(#' + grad.id + ')');
  };

  /**
  * Check if exact gradient already exists
  * @param grad - The gradient DOM element to compare to others
  * @returns The existing gradient if found, null if not
  */
  var findDuplicateGradient = function findDuplicateGradient(grad) {
    var defs = findDefs();
    var existingGrads = $$9(defs).find('linearGradient, radialGradient');
    var i = existingGrads.length;
    var radAttrs = ['r', 'cx', 'cy', 'fx', 'fy'];
    while (i--) {
      var og = existingGrads[i];
      if (grad.tagName === 'linearGradient') {
        if (grad.getAttribute('x1') !== og.getAttribute('x1') || grad.getAttribute('y1') !== og.getAttribute('y1') || grad.getAttribute('x2') !== og.getAttribute('x2') || grad.getAttribute('y2') !== og.getAttribute('y2')) {
          continue;
        }
      } else {
        var _ret = function () {
          var gradAttrs = $$9(grad).attr(radAttrs);
          var ogAttrs = $$9(og).attr(radAttrs);

          var diff = false;
          $$9.each(radAttrs, function (i, attr) {
            if (gradAttrs[attr] !== ogAttrs[attr]) {
              diff = true;
            }
          });

          if (diff) {
            return 'continue';
          }
        }();

        if (_ret === 'continue') continue;
      }

      // else could be a duplicate, iterate through stops
      var stops = grad.getElementsByTagNameNS(NS.SVG, 'stop');
      var ostops = og.getElementsByTagNameNS(NS.SVG, 'stop');

      if (stops.length !== ostops.length) {
        continue;
      }

      var j = stops.length;
      while (j--) {
        var stop = stops[j];
        var ostop = ostops[j];

        if (stop.getAttribute('offset') !== ostop.getAttribute('offset') || stop.getAttribute('stop-opacity') !== ostop.getAttribute('stop-opacity') || stop.getAttribute('stop-color') !== ostop.getAttribute('stop-color')) {
          break;
        }
      }

      if (j === -1) {
        return og;
      }
    } // for each gradient in defs

    return null;
  };

  /**
  * Set a color/gradient to a fill/stroke
  * @param {"fill"|"stroke"} type - String with "fill" or "stroke"
  * @param paint - The jGraduate paint object to apply
  */
  this.setPaint = function (type, paint) {
    // make a copy
    var p = new $$9.jGraduate.Paint(paint);
    this.setPaintOpacity(type, p.alpha / 100, true);

    // now set the current paint object
    curProperties[type + '_paint'] = p;
    switch (p.type) {
      case 'solidColor':
        this.setColor(type, p.solidColor !== 'none' ? '#' + p.solidColor : 'none');
        break;
      case 'linearGradient':
      case 'radialGradient':
        canvas[type + 'Grad'] = p[p.type];
        setGradient(type);
        break;
    }
  };

  // alias
  this.setStrokePaint = function (paint) {
    this.setPaint('stroke', paint);
  };

  this.setFillPaint = function (paint) {
    this.setPaint('fill', paint);
  };

  /**
  * @returns The current stroke-width value
  */
  this.getStrokeWidth = function () {
    return curProperties.stroke_width;
  };

  /**
  * Sets the stroke width for the current selected elements
  * When attempting to set a line's width to 0, this changes it to 1 instead
  * @param {Number} val - A Float indicating the new stroke width value
  */
  this.setStrokeWidth = function (val) {
    if (val === 0 && ['line', 'path'].includes(currentMode)) {
      canvas.setStrokeWidth(1);
      return;
    }
    curProperties.stroke_width = val;

    var elems = [];
    function addNonG(e) {
      if (e.nodeName !== 'g') {
        elems.push(e);
      }
    }
    var i = selectedElements.length;
    while (i--) {
      var elem = selectedElements[i];
      if (elem) {
        if (elem.tagName === 'g') {
          walkTree(elem, addNonG);
        } else {
          elems.push(elem);
        }
      }
    }
    if (elems.length > 0) {
      changeSelectedAttribute('stroke-width', val, elems);
      call('changed', selectedElements);
    }
  };

  /**
  * Set the given stroke-related attribute the given value for selected elements
  * @param {String} attr - String with the attribute name
  * @param {String|Number} val - String or number with the attribute value
  */
  this.setStrokeAttr = function (attr, val) {
    curShape[attr.replace('-', '_')] = val;
    var elems = [];

    var i = selectedElements.length;
    while (i--) {
      var elem = selectedElements[i];
      if (elem) {
        if (elem.tagName === 'g') {
          walkTree(elem, function (e) {
            if (e.nodeName !== 'g') {
              elems.push(e);
            }
          });
        } else {
          elems.push(elem);
        }
      }
    }
    if (elems.length > 0) {
      changeSelectedAttribute(attr, val, elems);
      call('changed', selectedElements);
    }
  };

  /**
  * @returns current style options
  */
  this.getStyle = function () {
    return curShape;
  };

  /**
  * @returns the current opacity
  */
  this.getOpacity = getOpacity;

  /**
  * Sets the given opacity to the current selected elements
  * @param val
  */
  this.setOpacity = function (val) {
    curShape.opacity = val;
    changeSelectedAttribute('opacity', val);
  };

  /**
  * @returns the current fill opacity
  */
  this.getFillOpacity = function () {
    return curShape.fill_opacity;
  };

  /**
  * @returns the current stroke opacity
  */
  this.getStrokeOpacity = function () {
    return curShape.stroke_opacity;
  };

  /**
  * Sets the current fill/stroke opacity
  * @param {String} type - String with "fill" or "stroke"
  * @param {Number} val - Float with the new opacity value
  * @param {Boolean} preventUndo - Indicates whether or not this should be an undoable action
  */
  this.setPaintOpacity = function (type, val, preventUndo) {
    curShape[type + '_opacity'] = val;
    if (!preventUndo) {
      changeSelectedAttribute(type + '-opacity', val);
    } else {
      changeSelectedAttributeNoUndo(type + '-opacity', val);
    }
  };

  /**
  * Gets the current fill/stroke opacity
  * @param {"fill"|"stroke"} type - String with "fill" or "stroke"
  * @returns Fill/stroke opacity
  */
  this.getPaintOpacity = function (type) {
    return type === 'fill' ? this.getFillOpacity() : this.getStrokeOpacity();
  };

  /**
  * Gets the stdDeviation blur value of the given element
  * @param elem - The element to check the blur value for
  * @returns stdDeviation blur attribute value
  */
  this.getBlur = function (elem) {
    var val = 0;
    // const elem = selectedElements[0];

    if (elem) {
      var filterUrl = elem.getAttribute('filter');
      if (filterUrl) {
        var blur = getElem(elem.id + '_blur');
        if (blur) {
          val = blur.firstChild.getAttribute('stdDeviation');
        }
      }
    }
    return val;
  };

  (function () {
    var curCommand = null;
    var filter = null;
    var filterHidden = false;

    /**
    * Sets the stdDeviation blur value on the selected element without being undoable
    * @param val - The new stdDeviation value
    */
    canvas.setBlurNoUndo = function (val) {
      if (!filter) {
        canvas.setBlur(val);
        return;
      }
      if (val === 0) {
        // Don't change the StdDev, as that will hide the element.
        // Instead, just remove the value for "filter"
        changeSelectedAttributeNoUndo('filter', '');
        filterHidden = true;
      } else {
        var elem = selectedElements[0];
        if (filterHidden) {
          changeSelectedAttributeNoUndo('filter', 'url(#' + elem.id + '_blur)');
        }
        if (isWebkit()) {
          console.log('e', elem);
          elem.removeAttribute('filter');
          elem.setAttribute('filter', 'url(#' + elem.id + '_blur)');
        }
        changeSelectedAttributeNoUndo('stdDeviation', val, [filter.firstChild]);
        canvas.setBlurOffsets(filter, val);
      }
    };

    function finishChange() {
      var bCmd = canvas.undoMgr.finishUndoableChange();
      curCommand.addSubCommand(bCmd);
      addCommandToHistory(curCommand);
      curCommand = null;
      filter = null;
    }

    /**
    * Sets the x, y, with, height values of the filter element in order to
    * make the blur not be clipped. Removes them if not neeeded
    * @param filter - The filter DOM element to update
    * @param stdDev - The standard deviation value on which to base the offset size
    */
    canvas.setBlurOffsets = function (filter, stdDev) {
      if (stdDev > 3) {
        // TODO: Create algorithm here where size is based on expected blur
        assignAttributes(filter, {
          x: '-50%',
          y: '-50%',
          width: '200%',
          height: '200%'
        }, 100);
      } else {
        // Removing these attributes hides text in Chrome (see Issue 579)
        if (!isWebkit()) {
          filter.removeAttribute('x');
          filter.removeAttribute('y');
          filter.removeAttribute('width');
          filter.removeAttribute('height');
        }
      }
    };

    /**
    * Adds/updates the blur filter to the selected element
    * @param {Number} val - Float with the new stdDeviation blur value
    * @param {Boolean} complete - Boolean indicating whether or not the action should be completed (to add to the undo manager)
    */
    canvas.setBlur = function (val, complete) {
      if (curCommand) {
        finishChange();
        return;
      }

      // Looks for associated blur, creates one if not found
      var elem = selectedElements[0];
      var elemId = elem.id;
      filter = getElem(elemId + '_blur');

      val -= 0;

      var batchCmd = new BatchCommand$1();

      // Blur found!
      if (filter) {
        if (val === 0) {
          filter = null;
        }
      } else {
        // Not found, so create
        var newblur = addSvgElementFromJson({ element: 'feGaussianBlur',
          attr: {
            in: 'SourceGraphic',
            stdDeviation: val
          }
        });

        filter = addSvgElementFromJson({ element: 'filter',
          attr: {
            id: elemId + '_blur'
          }
        });

        filter.append(newblur);
        findDefs().append(filter);

        batchCmd.addSubCommand(new InsertElementCommand$1(filter));
      }

      var changes = { filter: elem.getAttribute('filter') };

      if (val === 0) {
        elem.removeAttribute('filter');
        batchCmd.addSubCommand(new ChangeElementCommand$1(elem, changes));
        return;
      }

      changeSelectedAttribute('filter', 'url(#' + elemId + '_blur)');
      batchCmd.addSubCommand(new ChangeElementCommand$1(elem, changes));
      canvas.setBlurOffsets(filter, val);

      curCommand = batchCmd;
      canvas.undoMgr.beginUndoableChange('stdDeviation', [filter ? filter.firstChild : null]);
      if (complete) {
        canvas.setBlurNoUndo(val);
        finishChange();
      }
    };
  })();

  /**
  * Check whether selected element is bold or not
  * @returns {Boolean} Indicates whether or not element is bold
  */
  this.getBold = function () {
    // should only have one element selected
    var selected = selectedElements[0];
    if (selected != null && selected.tagName === 'text' && selectedElements[1] == null) {
      return selected.getAttribute('font-weight') === 'bold';
    }
    return false;
  };

  /**
  * Make the selected element bold or normal
  * @param {Boolean} b - Indicates bold (true) or normal (false)
  */
  this.setBold = function (b) {
    var selected = selectedElements[0];
    if (selected != null && selected.tagName === 'text' && selectedElements[1] == null) {
      changeSelectedAttribute('font-weight', b ? 'bold' : 'normal');
    }
    if (!selectedElements[0].textContent) {
      textActions.setCursor();
    }
  };

  /**
  * Check whether selected element is italic or not
  * @returns {Boolean} Indicates whether or not element is italic
  */
  this.getItalic = function () {
    var selected = selectedElements[0];
    if (selected != null && selected.tagName === 'text' && selectedElements[1] == null) {
      return selected.getAttribute('font-style') === 'italic';
    }
    return false;
  };

  /**
  * Make the selected element italic or normal
  * @param {Boolean} b - Indicates italic (true) or normal (false)
  */
  this.setItalic = function (i) {
    var selected = selectedElements[0];
    if (selected != null && selected.tagName === 'text' && selectedElements[1] == null) {
      changeSelectedAttribute('font-style', i ? 'italic' : 'normal');
    }
    if (!selectedElements[0].textContent) {
      textActions.setCursor();
    }
  };

  /**
  * @returns The current font family
  */
  this.getFontFamily = function () {
    return curText.font_family;
  };

  /**
  * Set the new font family
  * @param {String} val - String with the new font family
  */
  this.setFontFamily = function (val) {
    curText.font_family = val;
    changeSelectedAttribute('font-family', val);
    if (selectedElements[0] && !selectedElements[0].textContent) {
      textActions.setCursor();
    }
  };

  /**
  * Set the new font color
  * @param {String} val - String with the new font color
  */
  this.setFontColor = function (val) {
    curText.fill = val;
    changeSelectedAttribute('fill', val);
  };

  /**
  * @returns The current font color
  */
  this.getFontColor = function () {
    return curText.fill;
  };

  /**
  * Returns the current font size
  */
  this.getFontSize = function () {
    return curText.font_size;
  };

  /**
  * Applies the given font size to the selected element
  * @param {Number} val - Float with the new font size
  */
  this.setFontSize = function (val) {
    curText.font_size = val;
    changeSelectedAttribute('font-size', val);
    if (!selectedElements[0].textContent) {
      textActions.setCursor();
    }
  };

  /**
  * @returns The current text (textContent) of the selected element
  */
  this.getText = function () {
    var selected = selectedElements[0];
    if (selected == null) {
      return '';
    }
    return selected.textContent;
  };

  /**
  * Updates the text element with the given string
  * @param {String} val - String with the new text
  */
  this.setTextContent = function (val) {
    changeSelectedAttribute('#text', val);
    textActions.init(val);
    textActions.setCursor();
  };

  /**
  * Sets the new image URL for the selected image element. Updates its size if
  * a new URL is given
  * @param {String} val - String with the image URL/path
  */
  this.setImageURL = function (val) {
    var elem = selectedElements[0];
    if (!elem) {
      return;
    }

    var attrs = $$9(elem).attr(['width', 'height']);
    var setsize = !attrs.width || !attrs.height;

    var curHref = getHref(elem);

    // Do nothing if no URL change or size change
    if (curHref !== val) {
      setsize = true;
    } else if (!setsize) {
      return;
    }

    var batchCmd = new BatchCommand$1('Change Image URL');

    setHref(elem, val);
    batchCmd.addSubCommand(new ChangeElementCommand$1(elem, {
      '#href': curHref
    }));

    if (setsize) {
      $$9(new Image()).load(function () {
        var changes = $$9(elem).attr(['width', 'height']);

        $$9(elem).attr({
          width: this.width,
          height: this.height
        });

        selectorManager.requestSelector(elem).resize();

        batchCmd.addSubCommand(new ChangeElementCommand$1(elem, changes));
        addCommandToHistory(batchCmd);
        call('changed', [elem]);
      }).attr('src', val);
    } else {
      addCommandToHistory(batchCmd);
    }
  };

  /**
  * Sets the new link URL for the selected anchor element.
  * @param {String} val - String with the link URL/path
  */
  this.setLinkURL = function (val) {
    var elem = selectedElements[0];
    if (!elem) {
      return;
    }
    if (elem.tagName !== 'a') {
      // See if parent is an anchor
      var parentsA = $$9(elem).parents('a');
      if (parentsA.length) {
        elem = parentsA[0];
      } else {
        return;
      }
    }

    var curHref = getHref(elem);

    if (curHref === val) {
      return;
    }

    var batchCmd = new BatchCommand$1('Change Link URL');

    setHref(elem, val);
    batchCmd.addSubCommand(new ChangeElementCommand$1(elem, {
      '#href': curHref
    }));

    addCommandToHistory(batchCmd);
  };

  /**
  * Sets the rx & ry values to the selected rect element to change its corner radius
  * @param val - The new radius
  */
  this.setRectRadius = function (val) {
    var selected = selectedElements[0];
    if (selected != null && selected.tagName === 'rect') {
      var r = selected.getAttribute('rx');
      if (r !== String(val)) {
        selected.setAttribute('rx', val);
        selected.setAttribute('ry', val);
        addCommandToHistory(new ChangeElementCommand$1(selected, { rx: r, ry: r }, 'Radius'));
        call('changed', [selected]);
      }
    }
  };

  /**
  * Wraps the selected element(s) in an anchor element or converts group to one
  * @param url
  */
  this.makeHyperlink = function (url) {
    canvas.groupSelectedElements('a', url);

    // TODO: If element is a single "g", convert to "a"
    //  if (selectedElements.length > 1 && selectedElements[1]) {
  };

  /**
  *
  */
  this.removeHyperlink = function () {
    canvas.ungroupSelectedElement();
  };

  /**
  * Group: Element manipulation
  */

  /**
  * Sets the new segment type to the selected segment(s).
  * @param {Number} newType - Integer with the new segment type
  * See https://www.w3.org/TR/SVG/paths.html#InterfaceSVGPathSeg for list
  */
  this.setSegType = function (newType) {
    pathActions$$1.setSegType(newType);
  };

  /**
  * @todo (codedread): Remove the getBBox argument and split this function into two.
  * Convert selected element to a path, or get the BBox of an element-as-path
  * @param elem - The DOM element to be converted
  * @param getBBox - Boolean on whether or not to only return the path's BBox
  * @returns If the getBBox flag is true, the resulting path's bounding box object.
  * Otherwise the resulting path element is returned.
  */
  this.convertToPath = function (elem, getBBox$$1) {
    if (elem == null) {
      var elems = selectedElements;
      $$9.each(elems, function (i, elem) {
        if (elem) {
          canvas.convertToPath(elem);
        }
      });
      return;
    }
    if (getBBox$$1) {
      return getBBoxOfElementAsPath(elem, addSvgElementFromJson, pathActions$$1);
    } else {
      // TODO: Why is this applying attributes from curShape, then inside utilities.convertToPath it's pulling addition attributes from elem?
      // TODO: If convertToPath is called with one elem, curShape and elem are probably the same; but calling with multiple is a bug or cool feature.
      var attrs = {
        fill: curShape.fill,
        'fill-opacity': curShape.fill_opacity,
        stroke: curShape.stroke,
        'stroke-width': curShape.stroke_width,
        'stroke-dasharray': curShape.stroke_dasharray,
        'stroke-linejoin': curShape.stroke_linejoin,
        'stroke-linecap': curShape.stroke_linecap,
        'stroke-opacity': curShape.stroke_opacity,
        opacity: curShape.opacity,
        visibility: 'hidden'
      };
      return convertToPath(elem, attrs, addSvgElementFromJson, pathActions$$1, clearSelection, addToSelection, history, addCommandToHistory);
    }
  };

  /**
  * This function makes the changes to the elements. It does not add the change
  * to the history stack.
  * @param {String} attr - Attribute name
  * @param {String|Number} newValue - String or number with the new attribute value
  * @param elems - The DOM elements to apply the change to
  */
  var changeSelectedAttributeNoUndo = function changeSelectedAttributeNoUndo(attr, newValue, elems) {
    if (currentMode === 'pathedit') {
      // Editing node
      pathActions$$1.moveNode(attr, newValue);
    }
    elems = elems || selectedElements;
    var i = elems.length;
    var noXYElems = ['g', 'polyline', 'path'];
    var goodGAttrs = ['transform', 'opacity', 'filter'];

    var _loop = function _loop() {
      var elem = elems[i];
      if (elem == null) {
        return 'continue';
      }

      // Set x,y vals on elements that don't have them
      if ((attr === 'x' || attr === 'y') && noXYElems.includes(elem.tagName)) {
        var bbox = getStrokedBBoxDefaultVisible([elem]);
        var diffX = attr === 'x' ? newValue - bbox.x : 0;
        var diffY = attr === 'y' ? newValue - bbox.y : 0;
        canvas.moveSelectedElements(diffX * currentZoom, diffY * currentZoom, true);
        return 'continue';
      }

      // only allow the transform/opacity/filter attribute to change on <g> elements, slightly hacky
      // TODO: FIXME: This doesn't seem right. Where's the body of this if statement?
      if (elem.tagName === 'g' && goodGAttrs.includes(attr)) ;
      var oldval = attr === '#text' ? elem.textContent : elem.getAttribute(attr);
      if (oldval == null) {
        oldval = '';
      }
      if (oldval !== String(newValue)) {
        if (attr === '#text') {
          // const oldW = utilsGetBBox(elem).width;
          elem.textContent = newValue;

          // FF bug occurs on on rotated elements
          if (/rotate/.test(elem.getAttribute('transform'))) {
            elem = ffClone(elem);
          }
          // Hoped to solve the issue of moving text with text-anchor="start",
          // but this doesn't actually fix it. Hopefully on the right track, though. -Fyrd
          // const box = getBBox(elem), left = box.x, top = box.y, {width, height} = box,
          //   dx = width - oldW, dy = 0;
          // const angle = getRotationAngle(elem, true);
          // if (angle) {
          //   const r = Math.sqrt(dx * dx + dy * dy);
          //   const theta = Math.atan2(dy, dx) - angle;
          //   dx = r * Math.cos(theta);
          //   dy = r * Math.sin(theta);
          //
          //   elem.setAttribute('x', elem.getAttribute('x') - dx);
          //   elem.setAttribute('y', elem.getAttribute('y') - dy);
          // }
        } else if (attr === '#href') {
          setHref(elem, newValue);
        } else {
          elem.setAttribute(attr, newValue);
        }

        // Go into "select" mode for text changes
        // NOTE: Important that this happens AFTER elem.setAttribute() or else attributes like
        // font-size can get reset to their old value, ultimately by svgEditor.updateContextPanel(),
        // after calling textActions.toSelectMode() below
        if (currentMode === 'textedit' && attr !== '#text' && elem.textContent.length) {
          textActions.toSelectMode(elem);
        }

        // if (i === 0) {
        //   selectedBBoxes[0] = utilsGetBBox(elem);
        // }

        // Use the Firefox ffClone hack for text elements with gradients or
        // where other text attributes are changed.
        if (isGecko() && elem.nodeName === 'text' && /rotate/.test(elem.getAttribute('transform'))) {
          if (String(newValue).startsWith('url') || ['font-size', 'font-family', 'x', 'y'].includes(attr) && elem.textContent) {
            elem = ffClone(elem);
          }
        }
        // Timeout needed for Opera & Firefox
        // codedread: it is now possible for this function to be called with elements
        // that are not in the selectedElements array, we need to only request a
        // selector if the element is in that array
        if (selectedElements.includes(elem)) {
          setTimeout(function () {
            // Due to element replacement, this element may no longer
            // be part of the DOM
            if (!elem.parentNode) {
              return;
            }
            selectorManager.requestSelector(elem).resize();
          }, 0);
        }
        // if this element was rotated, and we changed the position of this element
        // we need to update the rotational transform attribute
        var angle = getRotationAngle(elem);
        if (angle !== 0 && attr !== 'transform') {
          var tlist = getTransformList(elem);
          var n = tlist.numberOfItems;
          while (n--) {
            var xform = tlist.getItem(n);
            if (xform.type === 4) {
              // remove old rotate
              tlist.removeItem(n);

              var box = getBBox(elem);
              var center = transformPoint(box.x + box.width / 2, box.y + box.height / 2, transformListToTransform(tlist).matrix);
              var cx = center.x,
                  cy = center.y;
              var newrot = svgroot.createSVGTransform();
              newrot.setRotate(angle, cx, cy);
              tlist.insertItemBefore(newrot, n);
              break;
            }
          }
        }
      } // if oldValue != newValue
    };

    while (i--) {
      var _ret2 = _loop();

      if (_ret2 === 'continue') continue;
    } // for each elem
  };

  /**
  * Change the given/selected element and add the original value to the history stack
  * If you want to change all selectedElements, ignore the elems argument.
  * If you want to change only a subset of selectedElements, then send the
  * subset to this function in the elems argument.
  * @param {String} attr - String with the attribute name
  * @param {String|Number} newValue - String or number with the new attribute value
  * @param elems - The DOM elements to apply the change to
  */
  var changeSelectedAttribute = this.changeSelectedAttribute = function (attr, val, elems) {
    elems = elems || selectedElements;
    canvas.undoMgr.beginUndoableChange(attr, elems);
    // const i = elems.length;

    changeSelectedAttributeNoUndo(attr, val, elems);

    var batchCmd = canvas.undoMgr.finishUndoableChange();
    if (!batchCmd.isEmpty()) {
      addCommandToHistory(batchCmd);
    }
  };

  // Removes all selected elements from the DOM and adds the change to the
  // history stack
  this.deleteSelectedElements = function () {
    var batchCmd = new BatchCommand$1('Delete Elements');
    var len = selectedElements.length;
    var selectedCopy = []; // selectedElements is being deleted

    for (var i = 0; i < len; ++i) {
      var selected = selectedElements[i];
      if (selected == null) {
        break;
      }

      var parent = selected.parentNode;
      var t = selected;

      // this will unselect the element and remove the selectedOutline
      selectorManager.releaseSelector(t);

      // Remove the path if present.
      removePath_(t.id);

      // Get the parent if it's a single-child anchor
      if (parent.tagName === 'a' && parent.childNodes.length === 1) {
        t = parent;
        parent = parent.parentNode;
      }

      var _t = t,
          nextSibling = _t.nextSibling;

      var _elem2 = parent.removeChild(t);
      selectedCopy.push(selected); // for the copy
      batchCmd.addSubCommand(new RemoveElementCommand$1(_elem2, nextSibling, parent));
    }
    selectedElements = [];

    if (!batchCmd.isEmpty()) {
      addCommandToHistory(batchCmd);
    }
    call('changed', selectedCopy);
    clearSelection();
  };

  /**
  * Removes all selected elements from the DOM and adds the change to the
  * history stack. Remembers removed elements on the clipboard
  */
  this.cutSelectedElements = function () {
    canvas.copySelectedElements();
    canvas.deleteSelectedElements();
  };

  /**
  * Remembers the current selected elements on the clipboard
  */
  this.copySelectedElements = function () {
    localStorage.setItem('svgedit_clipboard', JSON.stringify(selectedElements.map(function (x) {
      return getJsonFromSvgElement(x);
    })));

    $$9('#cmenu_canvas').enableContextMenuItems('#paste,#paste_in_place');
  };

  /**
  * @param {"in_place"|"point"|undefined} type
  * @param {Number|undefined} x Expected if type is "point"
  * @param {Number|undefined} y Expected if type is "point"
  */
  this.pasteElements = function (type, x, y) {
    var cb = JSON.parse(localStorage.getItem('svgedit_clipboard'));
    var len = cb.length;
    if (!len) {
      return;
    }

    var pasted = [];
    var batchCmd = new BatchCommand$1('Paste elements');
    // const drawing = getCurrentDrawing();
    var changedIDs = {};

    // Recursively replace IDs and record the changes
    function checkIDs(elem) {
      if (elem.attr && elem.attr.id) {
        changedIDs[elem.attr.id] = getNextId();
        elem.attr.id = changedIDs[elem.attr.id];
      }
      if (elem.children) elem.children.forEach(checkIDs);
    }
    cb.forEach(checkIDs);

    // Give extensions like the connector extension a chance to reflect new IDs and remove invalid elements
    runExtensions('IDsUpdated', { elems: cb, changes: changedIDs }, true).forEach(function (extChanges) {
      if (!extChanges || !('remove' in extChanges)) return;

      extChanges.remove.forEach(function (removeID) {
        cb = cb.filter(function (cbItem) {
          return cbItem.attr.id !== removeID;
        });
      });
    });

    // Move elements to lastClickPoint
    while (len--) {
      var _elem3 = cb[len];
      if (!_elem3) {
        continue;
      }

      var copy = addSvgElementFromJson(_elem3);
      pasted.push(copy);
      batchCmd.addSubCommand(new InsertElementCommand$1(copy));

      restoreRefElems(copy);
    }

    selectOnly(pasted);

    if (type !== 'in_place') {
      var ctrX = void 0,
          ctrY = void 0;

      if (!type) {
        ctrX = lastClickPoint.x;
        ctrY = lastClickPoint.y;
      } else if (type === 'point') {
        ctrX = x;
        ctrY = y;
      }

      var bbox = getStrokedBBoxDefaultVisible(pasted);
      var cx = ctrX - (bbox.x + bbox.width / 2),
          cy = ctrY - (bbox.y + bbox.height / 2),
          dx = [],
          dy = [];

      $$9.each(pasted, function (i, item) {
        dx.push(cx);
        dy.push(cy);
      });

      var cmd = canvas.moveSelectedElements(dx, dy, false);
      if (cmd) batchCmd.addSubCommand(cmd);
    }

    addCommandToHistory(batchCmd);
    call('changed', pasted);
  };

  /**
  * Wraps all the selected elements in a group (g) element
  * @param type - type of element to group into, defaults to &lt;g>
  */
  this.groupSelectedElements = function (type, urlArg) {
    if (!type) {
      type = 'g';
    }
    var cmdStr = '';
    var url = void 0;

    switch (type) {
      case 'a':
        {
          cmdStr = 'Make hyperlink';
          url = '';
          if (arguments.length > 1) {
            url = urlArg;
          }
          break;
        }default:
        {
          type = 'g';
          cmdStr = 'Group Elements';
          break;
        }
    }

    var batchCmd = new BatchCommand$1(cmdStr);

    // create and insert the group element
    var g = addSvgElementFromJson({
      element: type,
      attr: {
        id: getNextId()
      }
    });
    if (type === 'a') {
      setHref(g, url);
    }
    batchCmd.addSubCommand(new InsertElementCommand$1(g));

    // now move all children into the group
    var i = selectedElements.length;
    while (i--) {
      var _elem4 = selectedElements[i];
      if (_elem4 == null) {
        continue;
      }

      if (_elem4.parentNode.tagName === 'a' && _elem4.parentNode.childNodes.length === 1) {
        _elem4 = _elem4.parentNode;
      }

      var oldNextSibling = _elem4.nextSibling;
      var oldParent = _elem4.parentNode;
      g.append(_elem4);
      batchCmd.addSubCommand(new MoveElementCommand$1(_elem4, oldNextSibling, oldParent));
    }
    if (!batchCmd.isEmpty()) {
      addCommandToHistory(batchCmd);
    }

    // update selection
    selectOnly([g], true);
  };

  // Pushes all appropriate parent group properties down to its children, then
  // removes them from the group
  var pushGroupProperties = this.pushGroupProperties = function (g, undoable) {
    var children = g.childNodes;
    var len = children.length;
    var xform = g.getAttribute('transform');

    var glist = getTransformList(g);
    var m = transformListToTransform(glist).matrix;

    var batchCmd = new BatchCommand$1('Push group properties');

    // TODO: get all fill/stroke properties from the group that we are about to destroy
    // "fill", "fill-opacity", "fill-rule", "stroke", "stroke-dasharray", "stroke-dashoffset",
    // "stroke-linecap", "stroke-linejoin", "stroke-miterlimit", "stroke-opacity",
    // "stroke-width"
    // and then for each child, if they do not have the attribute (or the value is 'inherit')
    // then set the child's attribute

    var gangle = getRotationAngle(g);

    var gattrs = $$9(g).attr(['filter', 'opacity']);
    var gfilter = void 0,
        gblur = void 0,
        changes = void 0;
    var drawing = getCurrentDrawing();

    for (var i = 0; i < len; i++) {
      var _elem5 = children[i];

      if (_elem5.nodeType !== 1) {
        continue;
      }

      if (gattrs.opacity !== null && gattrs.opacity !== 1) {
        // const c_opac = elem.getAttribute('opacity') || 1;
        var newOpac = Math.round((_elem5.getAttribute('opacity') || 1) * gattrs.opacity * 100) / 100;
        changeSelectedAttribute('opacity', newOpac, [_elem5]);
      }

      if (gattrs.filter) {
        var cblur = this.getBlur(_elem5);
        var origCblur = cblur;
        if (!gblur) {
          gblur = this.getBlur(g);
        }
        if (cblur) {
          // Is this formula correct?
          cblur = Number(gblur) + Number(cblur);
        } else if (cblur === 0) {
          cblur = gblur;
        }

        // If child has no current filter, get group's filter or clone it.
        if (!origCblur) {
          // Set group's filter to use first child's ID
          if (!gfilter) {
            gfilter = getRefElem(gattrs.filter);
          } else {
            // Clone the group's filter
            gfilter = drawing.copyElem(gfilter);
            findDefs().append(gfilter);
          }
        } else {
          gfilter = getRefElem(_elem5.getAttribute('filter'));
        }

        // Change this in future for different filters
        var suffix = gfilter.firstChild.tagName === 'feGaussianBlur' ? 'blur' : 'filter';
        gfilter.id = _elem5.id + '_' + suffix;
        changeSelectedAttribute('filter', 'url(#' + gfilter.id + ')', [_elem5]);

        // Update blur value
        if (cblur) {
          changeSelectedAttribute('stdDeviation', cblur, [gfilter.firstChild]);
          canvas.setBlurOffsets(gfilter, cblur);
        }
      }

      var chtlist = getTransformList(_elem5);

      // Don't process gradient transforms
      if (_elem5.tagName.includes('Gradient')) {
        chtlist = null;
      }

      // Hopefully not a problem to add this. Necessary for elements like <desc/>
      if (!chtlist) {
        continue;
      }

      // Apparently <defs> can get get a transformlist, but we don't want it to have one!
      if (_elem5.tagName === 'defs') {
        continue;
      }

      if (glist.numberOfItems) {
        // TODO: if the group's transform is just a rotate, we can always transfer the
        // rotate() down to the children (collapsing consecutive rotates and factoring
        // out any translates)
        if (gangle && glist.numberOfItems === 1) {
          // [Rg] [Rc] [Mc]
          // we want [Tr] [Rc2] [Mc] where:
          //  - [Rc2] is at the child's current center but has the
          // sum of the group and child's rotation angles
          //  - [Tr] is the equivalent translation that this child
          // undergoes if the group wasn't there

          // [Tr] = [Rg] [Rc] [Rc2_inv]

          // get group's rotation matrix (Rg)
          var rgm = glist.getItem(0).matrix;

          // get child's rotation matrix (Rc)
          var rcm = svgroot.createSVGMatrix();
          var cangle = getRotationAngle(_elem5);
          if (cangle) {
            rcm = chtlist.getItem(0).matrix;
          }

          // get child's old center of rotation
          var cbox = getBBox(_elem5);
          var ceqm = transformListToTransform(chtlist).matrix;
          var coldc = transformPoint(cbox.x + cbox.width / 2, cbox.y + cbox.height / 2, ceqm);

          // sum group and child's angles
          var sangle = gangle + cangle;

          // get child's rotation at the old center (Rc2_inv)
          var r2 = svgroot.createSVGTransform();
          r2.setRotate(sangle, coldc.x, coldc.y);

          // calculate equivalent translate
          var trm = matrixMultiply(rgm, rcm, r2.matrix.inverse());

          // set up tlist
          if (cangle) {
            chtlist.removeItem(0);
          }

          if (sangle) {
            if (chtlist.numberOfItems) {
              chtlist.insertItemBefore(r2, 0);
            } else {
              chtlist.appendItem(r2);
            }
          }

          if (trm.e || trm.f) {
            var tr = svgroot.createSVGTransform();
            tr.setTranslate(trm.e, trm.f);
            if (chtlist.numberOfItems) {
              chtlist.insertItemBefore(tr, 0);
            } else {
              chtlist.appendItem(tr);
            }
          }
        } else {
          // more complicated than just a rotate
          // transfer the group's transform down to each child and then
          // call recalculateDimensions()
          var oldxform = _elem5.getAttribute('transform');
          changes = {};
          changes.transform = oldxform || '';

          var newxform = svgroot.createSVGTransform();

          // [ gm ] [ chm ] = [ chm ] [ gm' ]
          // [ gm' ] = [ chmInv ] [ gm ] [ chm ]
          var chm = transformListToTransform(chtlist).matrix,
              chmInv = chm.inverse();
          var gm = matrixMultiply(chmInv, m, chm);
          newxform.setMatrix(gm);
          chtlist.appendItem(newxform);
        }
        var cmd = recalculateDimensions(_elem5);
        if (cmd) {
          batchCmd.addSubCommand(cmd);
        }
      }
    }

    // remove transform and make it undo-able
    if (xform) {
      changes = {};
      changes.transform = xform;
      g.setAttribute('transform', '');
      g.removeAttribute('transform');
      batchCmd.addSubCommand(new ChangeElementCommand$1(g, changes));
    }

    if (undoable && !batchCmd.isEmpty()) {
      return batchCmd;
    }
  };

  /**
  * Unwraps all the elements in a selected group (g) element. This requires
  * significant recalculations to apply group's transforms, etc to its children
  */
  this.ungroupSelectedElement = function () {
    var g = selectedElements[0];
    if (!g) {
      return;
    }
    if ($$9(g).data('gsvg') || $$9(g).data('symbol')) {
      // Is svg, so actually convert to group
      convertToGroup(g);
      return;
    }
    if (g.tagName === 'use') {
      // Somehow doesn't have data set, so retrieve
      var symbol = getElem(getHref(g).substr(1));
      $$9(g).data('symbol', symbol).data('ref', symbol);
      convertToGroup(g);
      return;
    }
    var parentsA = $$9(g).parents('a');
    if (parentsA.length) {
      g = parentsA[0];
    }

    // Look for parent "a"
    if (g.tagName === 'g' || g.tagName === 'a') {
      var batchCmd = new BatchCommand$1('Ungroup Elements');
      var cmd = pushGroupProperties(g, true);
      if (cmd) {
        batchCmd.addSubCommand(cmd);
      }

      var parent = g.parentNode;
      var anchor = g.nextSibling;
      var children = new Array(g.childNodes.length);

      var i = 0;
      while (g.firstChild) {
        var _elem6 = g.firstChild;
        var oldNextSibling = _elem6.nextSibling;
        var oldParent = _elem6.parentNode;

        // Remove child title elements
        if (_elem6.tagName === 'title') {
          var _elem7 = _elem6,
              nextSibling = _elem7.nextSibling;

          batchCmd.addSubCommand(new RemoveElementCommand$1(_elem6, nextSibling, oldParent));
          _elem6.remove();
          continue;
        }

        children[i++] = _elem6 = parent.insertBefore(_elem6, anchor);
        batchCmd.addSubCommand(new MoveElementCommand$1(_elem6, oldNextSibling, oldParent));
      }

      // remove the group from the selection
      clearSelection();

      // delete the group element (but make undo-able)
      var gNextSibling = g.nextSibling;
      g = parent.removeChild(g);
      batchCmd.addSubCommand(new RemoveElementCommand$1(g, gNextSibling, parent));

      if (!batchCmd.isEmpty()) {
        addCommandToHistory(batchCmd);
      }

      // update selection
      addToSelection(children);
    }
  };

  /**
  * Repositions the selected element to the bottom in the DOM to appear on top of
  * other elements
  */
  this.moveToTopSelectedElement = function () {
    var selected = selectedElements[0];
    if (selected != null) {
      var t = selected;
      var oldParent = t.parentNode;
      var oldNextSibling = t.nextSibling;
      t = t.parentNode.appendChild(t);
      // If the element actually moved position, add the command and fire the changed
      // event handler.
      if (oldNextSibling !== t.nextSibling) {
        addCommandToHistory(new MoveElementCommand$1(t, oldNextSibling, oldParent, 'top'));
        call('changed', [t]);
      }
    }
  };

  /**
  * Repositions the selected element to the top in the DOM to appear under
  * other elements
  */
  this.moveToBottomSelectedElement = function () {
    var selected = selectedElements[0];
    if (selected != null) {
      var t = selected;
      var oldParent = t.parentNode;
      var oldNextSibling = t.nextSibling;
      var firstChild = t.parentNode.firstChild;

      if (firstChild.tagName === 'title') {
        firstChild = firstChild.nextSibling;
      }
      // This can probably be removed, as the defs should not ever apppear
      // inside a layer group
      if (firstChild.tagName === 'defs') {
        firstChild = firstChild.nextSibling;
      }
      t = t.parentNode.insertBefore(t, firstChild);
      // If the element actually moved position, add the command and fire the changed
      // event handler.
      if (oldNextSibling !== t.nextSibling) {
        addCommandToHistory(new MoveElementCommand$1(t, oldNextSibling, oldParent, 'bottom'));
        call('changed', [t]);
      }
    }
  };

  /**
  * Moves the select element up or down the stack, based on the visibly
  * intersecting elements
  * @param {"Up"|"Down"} dir - String that's either 'Up' or 'Down'
  */
  this.moveUpDownSelected = function (dir) {
    var selected = selectedElements[0];
    if (!selected) {
      return;
    }

    curBBoxes = [];
    var closest = void 0,
        foundCur = void 0;
    // jQuery sorts this list
    var list = $$9(getIntersectionList(getStrokedBBoxDefaultVisible([selected]))).toArray();
    if (dir === 'Down') {
      list.reverse();
    }

    $$9.each(list, function () {
      if (!foundCur) {
        if (this === selected) {
          foundCur = true;
        }
        return;
      }
      closest = this;
      return false;
    });
    if (!closest) {
      return;
    }

    var t = selected;
    var oldParent = t.parentNode;
    var oldNextSibling = t.nextSibling;
    $$9(closest)[dir === 'Down' ? 'before' : 'after'](t);
    // If the element actually moved position, add the command and fire the changed
    // event handler.
    if (oldNextSibling !== t.nextSibling) {
      addCommandToHistory(new MoveElementCommand$1(t, oldNextSibling, oldParent, 'Move ' + dir));
      call('changed', [t]);
    }
  };

  /**
  * Moves selected elements on the X/Y axis
  * @param {Number} dx - Float with the distance to move on the x-axis
  * @param {Number} dy - Float with the distance to move on the y-axis
  * @param {Boolean} undoable - Boolean indicating whether or not the action should be undoable
  * @returns Batch command for the move
  */
  this.moveSelectedElements = function (dx, dy, undoable) {
    // if undoable is not sent, default to true
    // if single values, scale them to the zoom
    if (dx.constructor !== Array) {
      dx /= currentZoom;
      dy /= currentZoom;
    }
    undoable = undoable || true;
    var batchCmd = new BatchCommand$1('position');
    var i = selectedElements.length;
    while (i--) {
      var selected = selectedElements[i];
      if (selected != null) {
        // if (i === 0) {
        //   selectedBBoxes[0] = utilsGetBBox(selected);
        // }
        // const b = {};
        // for (const j in selectedBBoxes[i]) b[j] = selectedBBoxes[i][j];
        // selectedBBoxes[i] = b;

        var xform = svgroot.createSVGTransform();
        var tlist = getTransformList(selected);

        // dx and dy could be arrays
        if (dx.constructor === Array) {
          // if (i === 0) {
          //   selectedBBoxes[0].x += dx[0];
          //   selectedBBoxes[0].y += dy[0];
          // }
          xform.setTranslate(dx[i], dy[i]);
        } else {
          // if (i === 0) {
          //   selectedBBoxes[0].x += dx;
          //   selectedBBoxes[0].y += dy;
          // }
          xform.setTranslate(dx, dy);
        }

        if (tlist.numberOfItems) {
          tlist.insertItemBefore(xform, 0);
        } else {
          tlist.appendItem(xform);
        }

        var cmd = recalculateDimensions(selected);
        if (cmd) {
          batchCmd.addSubCommand(cmd);
        }

        selectorManager.requestSelector(selected).resize();
      }
    }
    if (!batchCmd.isEmpty()) {
      if (undoable) {
        addCommandToHistory(batchCmd);
      }
      call('changed', selectedElements);
      return batchCmd;
    }
  };

  /**
  * Create deep DOM copies (clones) of all selected elements and move them slightly
  * from their originals
  */
  this.cloneSelectedElements = function (x, y) {
    var i = void 0,
        elem = void 0;
    var batchCmd = new BatchCommand$1('Clone Elements');
    // find all the elements selected (stop at first null)
    var len = selectedElements.length;
    function sortfunction(a, b) {
      return $$9(b).index() - $$9(a).index(); // causes an array to be sorted numerically and ascending
    }
    selectedElements.sort(sortfunction);
    for (i = 0; i < len; ++i) {
      elem = selectedElements[i];
      if (elem == null) {
        break;
      }
    }
    // use slice to quickly get the subset of elements we need
    var copiedElements = selectedElements.slice(0, i);
    this.clearSelection(true);
    // note that we loop in the reverse way because of the way elements are added
    // to the selectedElements array (top-first)
    var drawing = getCurrentDrawing();
    i = copiedElements.length;
    while (i--) {
      // clone each element and replace it within copiedElements
      elem = copiedElements[i] = drawing.copyElem(copiedElements[i]);
      (currentGroup || drawing.getCurrentLayer()).append(elem);
      batchCmd.addSubCommand(new InsertElementCommand$1(elem));
    }

    if (!batchCmd.isEmpty()) {
      addToSelection(copiedElements.reverse()); // Need to reverse for correct selection-adding
      this.moveSelectedElements(x, y, false);
      addCommandToHistory(batchCmd);
    }
  };

  /**
  * Aligns selected elements
  * @param {String} type - String with single character indicating the alignment type
  * @param {"selected"|"largest"|"smallest"|"page"} relativeTo
  */
  this.alignSelectedElements = function (type, relativeTo) {
    var bboxes = []; // angles = [];
    var len = selectedElements.length;
    if (!len) {
      return;
    }
    var minx = Number.MAX_VALUE,
        maxx = Number.MIN_VALUE,
        miny = Number.MAX_VALUE,
        maxy = Number.MIN_VALUE;
    var curwidth = Number.MIN_VALUE,
        curheight = Number.MIN_VALUE;
    for (var i = 0; i < len; ++i) {
      if (selectedElements[i] == null) {
        break;
      }
      var _elem8 = selectedElements[i];
      bboxes[i] = getStrokedBBoxDefaultVisible([_elem8]);

      // now bbox is axis-aligned and handles rotation
      switch (relativeTo) {
        case 'smallest':
          if ((type === 'l' || type === 'c' || type === 'r') && (curwidth === Number.MIN_VALUE || curwidth > bboxes[i].width) || (type === 't' || type === 'm' || type === 'b') && (curheight === Number.MIN_VALUE || curheight > bboxes[i].height)) {
            minx = bboxes[i].x;
            miny = bboxes[i].y;
            maxx = bboxes[i].x + bboxes[i].width;
            maxy = bboxes[i].y + bboxes[i].height;
            curwidth = bboxes[i].width;
            curheight = bboxes[i].height;
          }
          break;
        case 'largest':
          if ((type === 'l' || type === 'c' || type === 'r') && (curwidth === Number.MIN_VALUE || curwidth < bboxes[i].width) || (type === 't' || type === 'm' || type === 'b') && (curheight === Number.MIN_VALUE || curheight < bboxes[i].height)) {
            minx = bboxes[i].x;
            miny = bboxes[i].y;
            maxx = bboxes[i].x + bboxes[i].width;
            maxy = bboxes[i].y + bboxes[i].height;
            curwidth = bboxes[i].width;
            curheight = bboxes[i].height;
          }
          break;
        default:
          // 'selected'
          if (bboxes[i].x < minx) {
            minx = bboxes[i].x;
          }
          if (bboxes[i].y < miny) {
            miny = bboxes[i].y;
          }
          if (bboxes[i].x + bboxes[i].width > maxx) {
            maxx = bboxes[i].x + bboxes[i].width;
          }
          if (bboxes[i].y + bboxes[i].height > maxy) {
            maxy = bboxes[i].y + bboxes[i].height;
          }
          break;
      }
    } // loop for each element to find the bbox and adjust min/max

    if (relativeTo === 'page') {
      minx = 0;
      miny = 0;
      maxx = canvas.contentW;
      maxy = canvas.contentH;
    }

    var dx = new Array(len);
    var dy = new Array(len);
    for (var _i2 = 0; _i2 < len; ++_i2) {
      if (selectedElements[_i2] == null) {
        break;
      }
      // const elem = selectedElements[i];
      var bbox = bboxes[_i2];
      dx[_i2] = 0;
      dy[_i2] = 0;
      switch (type) {
        case 'l':
          // left (horizontal)
          dx[_i2] = minx - bbox.x;
          break;
        case 'c':
          // center (horizontal)
          dx[_i2] = (minx + maxx) / 2 - (bbox.x + bbox.width / 2);
          break;
        case 'r':
          // right (horizontal)
          dx[_i2] = maxx - (bbox.x + bbox.width);
          break;
        case 't':
          // top (vertical)
          dy[_i2] = miny - bbox.y;
          break;
        case 'm':
          // middle (vertical)
          dy[_i2] = (miny + maxy) / 2 - (bbox.y + bbox.height / 2);
          break;
        case 'b':
          // bottom (vertical)
          dy[_i2] = maxy - (bbox.y + bbox.height);
          break;
      }
    }
    this.moveSelectedElements(dx, dy);
  };

  /**
  * Group: Additional editor tools
  */

  this.contentW = getResolution().w;
  this.contentH = getResolution().h;

  /**
  * Updates the editor canvas width/height/position after a zoom has occurred
  * @param {Number} w - Float with the new width
  * @param {Number} h - Float with the new height
  * @returns Object with the following values:
  * - x - The canvas' new x coordinate
  * - y - The canvas' new y coordinate
  * - oldX - The canvas' old x coordinate
  * - oldY - The canvas' old y coordinate
  * - d_x - The x position difference
  * - d_y - The y position difference
  */
  this.updateCanvas = function (w, h) {
    svgroot.setAttribute('width', w);
    svgroot.setAttribute('height', h);
    var bg = $$9('#canvasBackground')[0];
    var oldX = svgcontent.getAttribute('x');
    var oldY = svgcontent.getAttribute('y');
    var x = w / 2 - this.contentW * currentZoom / 2;
    var y = h / 2 - this.contentH * currentZoom / 2;

    assignAttributes(svgcontent, {
      width: this.contentW * currentZoom,
      height: this.contentH * currentZoom,
      x: x,
      y: y,
      viewBox: '0 0 ' + this.contentW + ' ' + this.contentH
    });

    assignAttributes(bg, {
      width: svgcontent.getAttribute('width'),
      height: svgcontent.getAttribute('height'),
      x: x,
      y: y
    });

    var bgImg = getElem('background_image');
    if (bgImg) {
      assignAttributes(bgImg, {
        width: '100%',
        height: '100%'
      });
    }

    selectorManager.selectorParentGroup.setAttribute('transform', 'translate(' + x + ',' + y + ')');
    runExtensions('canvasUpdated', { new_x: x, new_y: y, old_x: oldX, old_y: oldY, d_x: x - oldX, d_y: y - oldY });
    return { x: x, y: y, old_x: oldX, old_y: oldY, d_x: x - oldX, d_y: y - oldY };
  };

  /**
  * Set the background of the editor (NOT the actual document)
  * @param {String} color - String with fill color to apply
  * @param url - URL or path to image to use
  */
  this.setBackground = function (color, url) {
    var bg = getElem('canvasBackground');
    var border = $$9(bg).find('rect')[0];
    var bgImg = getElem('background_image');
    border.setAttribute('fill', color);
    if (url) {
      if (!bgImg) {
        bgImg = svgdoc.createElementNS(NS.SVG, 'image');
        assignAttributes(bgImg, {
          id: 'background_image',
          width: '100%',
          height: '100%',
          preserveAspectRatio: 'xMinYMin',
          style: 'pointer-events:none'
        });
      }
      setHref(bgImg, url);
      bg.append(bgImg);
    } else if (bgImg) {
      bgImg.remove();
    }
  };

  /**
  * Select the next/previous element within the current layer
  * @param {Boolean} next - true = next and false = previous element
  */
  this.cycleElement = function (next) {
    var num = void 0;
    var curElem = selectedElements[0];
    var elem = false;
    var allElems = getVisibleElements(currentGroup || getCurrentDrawing().getCurrentLayer());
    if (!allElems.length) {
      return;
    }
    if (curElem == null) {
      num = next ? allElems.length - 1 : 0;
      elem = allElems[num];
    } else {
      var i = allElems.length;
      while (i--) {
        if (allElems[i] === curElem) {
          num = next ? i - 1 : i + 1;
          if (num >= allElems.length) {
            num = 0;
          } else if (num < 0) {
            num = allElems.length - 1;
          }
          elem = allElems[num];
          break;
        }
      }
    }
    selectOnly([elem], true);
    call('selected', selectedElements);
  };

  this.clear();

  /**
  * @deprecated getPrivateMethods
  * Since all methods are/should be public somehow, this function should be removed;
  *  we might require `import` in place of this in the future once ES6 Modules
  *  widespread
  
  * Being able to access private methods publicly seems wrong somehow,
  * but currently appears to be the best way to allow testing and provide
  * access to them to plugins.
  */
  this.getPrivateMethods = function () {
    var obj = {
      addCommandToHistory: addCommandToHistory,
      setGradient: setGradient,
      addSvgElementFromJson: addSvgElementFromJson,
      assignAttributes: assignAttributes,
      BatchCommand: BatchCommand$1,
      call: call,
      ChangeElementCommand: ChangeElementCommand$1,
      copyElem: function copyElem$$1(elem) {
        return getCurrentDrawing().copyElem(elem);
      },

      decode64: decode64,
      encode64: encode64,
      ffClone: ffClone,
      findDefs: findDefs,
      findDuplicateGradient: findDuplicateGradient,
      getElem: getElem,
      getId: getId,
      getIntersectionList: getIntersectionList,
      getMouseTarget: getMouseTarget,
      getNextId: getNextId,
      getPathBBox: getPathBBox,
      getTypeMap: getTypeMap,
      getUrlFromAttr: getUrlFromAttr,
      hasMatrixTransform: hasMatrixTransform,
      identifyLayers: identifyLayers,
      InsertElementCommand: InsertElementCommand$1,
      isChrome: isChrome,
      isIdentity: isIdentity,
      isIE: isIE,
      logMatrix: logMatrix,
      matrixMultiply: matrixMultiply,
      MoveElementCommand: MoveElementCommand$1,
      NS: NS,
      preventClickDefault: preventClickDefault,
      recalculateAllSelectedDimensions: recalculateAllSelectedDimensions,
      recalculateDimensions: recalculateDimensions,
      remapElement: remapElement,
      RemoveElementCommand: RemoveElementCommand$1,
      removeUnusedDefElems: removeUnusedDefElems,
      round: round,
      runExtensions: runExtensions,
      sanitizeSvg: sanitizeSvg,
      SVGEditTransformList: SVGTransformList,
      text2xml: text2xml,
      toString: toString,
      transformBox: transformBox,
      transformListToTransform: transformListToTransform,
      transformPoint: transformPoint,
      walkTree: walkTree
    };
    return obj;
  };
} // End constructor
; // End class

// Todo: Update: https://github.com/jeresig/jquery.hotkeys
/*
 * jQuery Hotkeys Plugin
 * Copyright 2010, John Resig
 * Dual licensed under the MIT or GPL Version 2 licenses.
 *
 * http://github.com/jeresig/jquery.hotkeys
 *
 * Based upon the plugin by Tzury Bar Yochay:
 * http://github.com/tzuryby/hotkeys
 *
 * Original idea by:
 * Binny V A, http://www.openjs.com/scripts/events/keyboard_shortcuts/
*/

function jqPluginJSHotkeys (b) {
  b.hotkeys = { version: "0.8", specialKeys: { 8: "backspace", 9: "tab", 13: "return", 16: "shift", 17: "ctrl", 18: "alt", 19: "pause", 20: "capslock", 27: "esc", 32: "space", 33: "pageup", 34: "pagedown", 35: "end", 36: "home", 37: "left", 38: "up", 39: "right", 40: "down", 45: "insert", 46: "del", 96: "0", 97: "1", 98: "2", 99: "3", 100: "4", 101: "5", 102: "6", 103: "7", 104: "8", 105: "9", 106: "*", 107: "+", 109: "-", 110: ".", 111: "/", 112: "f1", 113: "f2", 114: "f3", 115: "f4", 116: "f5", 117: "f6", 118: "f7", 119: "f8", 120: "f9", 121: "f10", 122: "f11", 123: "f12", 144: "numlock", 145: "scroll", 191: "/", 224: "meta", 219: "[", 221: "]" }, shiftNums: { "`": "~", "1": "!", "2": "@", "3": "#", "4": "$", "5": "%", "6": "^", "7": "&", "8": "*", "9": "(", "0": ")", "-": "_", "=": "+", ";": ": ", "'": '"', ",": "<", ".": ">", "/": "?", "\\": "|" } };function a(d) {
    if (typeof d.data !== "string") {
      return;
    }var c = d.handler,
        e = d.data.toLowerCase().split(" ");d.handler = function (n) {
      if (this !== n.target && (/textarea|select/i.test(n.target.nodeName) || n.target.type === "text")) {
        return;
      }var h = n.type !== "keypress" && b.hotkeys.specialKeys[n.which],
          o = String.fromCharCode(n.which).toLowerCase(),
          m = "",
          g = {};if (n.altKey && h !== "alt") {
        m += "alt+";
      }if (n.ctrlKey && h !== "ctrl") {
        m += "ctrl+";
      }if (n.metaKey && !n.ctrlKey && h !== "meta") {
        m += "meta+";
      }if (n.shiftKey && h !== "shift") {
        m += "shift+";
      }if (h) {
        g[m + h] = true;
      } else {
        g[m + o] = true;g[m + b.hotkeys.shiftNums[o]] = true;if (m === "shift+") {
          g[b.hotkeys.shiftNums[o]] = true;
        }
      }for (var j = 0, f = e.length; j < f; j++) {
        if (g[e[j]]) {
          return c.apply(this, arguments);
        }
      }
    };
  }b.each(["keydown", "keyup", "keypress"], function () {
    b.event.special[this] = { add: a };
  });

  return b;
}

/*
 * Todo: Update to latest at https://github.com/cowboy/jquery-bbq ?
 * jQuery BBQ: Back Button & Query Library - v1.2.1 - 2/17/2010
 * http://benalman.com/projects/jquery-bbq-plugin/
 *
 * Copyright (c) 2010 "Cowboy" Ben Alman
 * Dual licensed under the MIT and GPL licenses.
 * http://benalman.com/about/license/
 */

// For sake of modules, added this wrapping export and changed `this` to `window`
function jqPluginBBQ (jQuery) {

  (function ($, p) {
    var i,
        m = Array.prototype.slice,
        r = decodeURIComponent,
        a = $.param,
        c,
        l,
        v,
        b = $.bbq = $.bbq || {},
        q,
        u,
        j,
        e = $.event.special,
        d = "hashchange",
        A = "querystring",
        D = "fragment",
        y = "elemUrlAttr",
        g = "location",
        k = "href",
        t = "src",
        x = /^.*\?|#.*$/g,
        w = /^.*\#/,
        h,
        C = {};function E(F) {
      return typeof F === "string";
    }function B(G) {
      var F = m.call(arguments, 1);return function () {
        return G.apply(this, F.concat(m.call(arguments)));
      };
    }function n(F) {
      return F.replace(/^[^#]*#?(.*)$/, "$1");
    }function o(F) {
      return F.replace(/(?:^[^?#]*\?([^#]*).*$)?.*/, "$1");
    }function f(H, M, F, I, G) {
      var O, L, K, N, J;if (I !== i) {
        K = F.match(H ? /^([^#]*)\#?(.*)$/ : /^([^#?]*)\??([^#]*)(#?.*)/);J = K[3] || "";if (G === 2 && E(I)) {
          L = I.replace(H ? w : x, "");
        } else {
          N = l(K[2]);I = E(I) ? l[H ? D : A](I) : I;L = G === 2 ? I : G === 1 ? $.extend({}, I, N) : $.extend({}, N, I);L = a(L);if (H) {
            L = L.replace(h, r);
          }
        }O = K[1] + (H ? "#" : L || !K[1] ? "?" : "") + L + J;
      } else {
        O = M(F !== i ? F : p[g][k]);
      }return O;
    }a[A] = B(f, 0, o);a[D] = c = B(f, 1, n);c.noEscape = function (G) {
      G = G || "";var F = $.map(G.split(""), encodeURIComponent);h = new RegExp(F.join("|"), "g");
    };c.noEscape(",/");$.deparam = l = function l(I, F) {
      var H = {},
          G = { "true": !0, "false": !1, "null": null };$.each(I.replace(/\+/g, " ").split("&"), function (L, Q) {
        var K = Q.split("="),
            P = r(K[0]),
            J,
            O = H,
            M = 0,
            R = P.split("]["),
            N = R.length - 1;if (/\[/.test(R[0]) && /\]$/.test(R[N])) {
          R[N] = R[N].replace(/\]$/, "");R = R.shift().split("[").concat(R);N = R.length - 1;
        } else {
          N = 0;
        }if (K.length === 2) {
          J = r(K[1]);if (F) {
            J = J && !isNaN(J) ? +J : J === "undefined" ? i : G[J] !== i ? G[J] : J;
          }if (N) {
            for (; M <= N; M++) {
              P = R[M] === "" ? O.length : R[M];O = O[P] = M < N ? O[P] || (R[M + 1] && isNaN(R[M + 1]) ? {} : []) : J;
            }
          } else {
            if ($.isArray(H[P])) {
              H[P].push(J);
            } else {
              if (H[P] !== i) {
                H[P] = [H[P], J];
              } else {
                H[P] = J;
              }
            }
          }
        } else {
          if (P) {
            H[P] = F ? i : "";
          }
        }
      });return H;
    };function z(H, F, G) {
      if (F === i || typeof F === "boolean") {
        G = F;F = a[H ? D : A]();
      } else {
        F = E(F) ? F.replace(H ? w : x, "") : F;
      }return l(F, G);
    }l[A] = B(z, 0);l[D] = v = B(z, 1);$[y] || ($[y] = function (F) {
      return $.extend(C, F);
    })({ a: k, base: k, iframe: t, img: t, input: t, form: "action", link: k, script: t });j = $[y];function s(I, G, H, F) {
      if (!E(H) && (typeof H === "undefined" ? "undefined" : _typeof(H)) !== "object") {
        F = H;H = G;G = i;
      }return this.each(function () {
        var L = $(this),
            J = G || j()[(this.nodeName || "").toLowerCase()] || "",
            K = J && L.attr(J) || "";L.attr(J, a[I](K, H, F));
      });
    }$.fn[A] = B(s, A);$.fn[D] = B(s, D);b.pushState = q = function q(I, F) {
      if (E(I) && /^#/.test(I) && F === i) {
        F = 2;
      }var H = I !== i,
          G = c(p[g][k], H ? I : {}, H ? F : 2);p[g][k] = G + (/#/.test(G) ? "" : "#");
    };b.getState = u = function u(F, G) {
      return F === i || typeof F === "boolean" ? v(F) : v(G)[F];
    };b.removeState = function (F) {
      var G = {};if (F !== i) {
        G = u();$.each($.isArray(F) ? F : arguments, function (I, H) {
          delete G[H];
        });
      }q(G, 2);
    };e[d] = $.extend(e[d], { add: function add(F) {
        var H;function G(J) {
          var I = J[D] = c();J.getState = function (K, L) {
            return K === i || typeof K === "boolean" ? l(I, K) : l(I, L)[K];
          };H.apply(this, arguments);
        }if ($.isFunction(F)) {
          H = F;return G;
        } else {
          H = F.handler;F.handler = G;
        }
      } });
  })(jQuery, window);
  /*
   * jQuery hashchange event - v1.2 - 2/11/2010
   * http://benalman.com/projects/jquery-hashchange-plugin/
   *
   * Copyright (c) 2010 "Cowboy" Ben Alman
   * Dual licensed under the MIT and GPL licenses.
   * http://benalman.com/about/license/
   */
  (function ($, i, b) {
    var j,
        k = $.event.special,
        c = "location",
        d = "hashchange",
        l = "href",
        f = $.browser,
        g = document.documentMode,
        h = f.msie && (g === b || g < 8),
        e = "on" + d in i && !h;function a(m) {
      m = m || i[c][l];return m.replace(/^[^#]*#?(.*)$/, "$1");
    }$[d + "Delay"] = 100;k[d] = $.extend(k[d], { setup: function setup() {
        if (e) {
          return false;
        }$(j.start);
      }, teardown: function teardown() {
        if (e) {
          return false;
        }$(j.stop);
      } });j = function () {
      var m = {},
          r,
          n,
          o,
          q;function p() {
        o = q = function q(s) {
          return s;
        };if (h) {
          n = $('<iframe src="javascript:0"/>').hide().insertAfter("body")[0].contentWindow;q = function q() {
            return a(n.document[c][l]);
          };o = function o(u, s) {
            if (u !== s) {
              var t = n.document;t.open().close();t[c].hash = "#" + u;
            }
          };o(a());
        }
      }m.start = function () {
        if (r) {
          return;
        }var t = a();o || p();(function s() {
          var v = a(),
              u = q(t);if (v !== t) {
            o(t = v, u);$(i).trigger(d);
          } else {
            if (u !== t) {
              i[c][l] = i[c][l].replace(/#.*/, "") + "#" + u;
            }
          }r = setTimeout(s, $[d + "Delay"]);
        })();
      };m.stop = function () {
        if (!n) {
          r && clearTimeout(r);r = 0;
        }
      };return m;
    }();
  })(jQuery, window);

  return jQuery;
}

/*
 * SVG Icon Loader 2.0
 *
 * jQuery Plugin for loading SVG icons from a single file
 *
 * Copyright (c) 2009 Alexis Deveria
 * http://a.deveria.com
 *
 * MIT License

How to use:

1. Create the SVG master file that includes all icons:

The master SVG icon-containing file is an SVG file that contains
<g> elements. Each <g> element should contain the markup of an SVG
icon. The <g> element has an ID that should
correspond with the ID of the HTML element used on the page that should contain
or optionally be replaced by the icon. Additionally, one empty element should be
added at the end with id "svg_eof".

2. Optionally create fallback raster images for each SVG icon.

3. Include the jQuery and the SVG Icon Loader scripts on your page.

4. Run $.svgIcons() when the document is ready:

$.svgIcons( file [string], options [object literal]);

File is the location of a local SVG or SVGz file.

All options are optional and can include:

- 'w (number)': The icon widths

- 'h (number)': The icon heights

- 'fallback (object literal)': List of raster images with each
  key being the SVG icon ID to replace, and the value the image file name.

- 'fallback_path (string)': The path to use for all images
  listed under "fallback"

- 'replace (boolean)': If set to true, HTML elements will be replaced by,
  rather than include the SVG icon.

- 'placement (object literal)': List with selectors for keys and SVG icon ids
  as values. This provides a custom method of adding icons.

- 'resize (object literal)': List with selectors for keys and numbers
  as values. This allows an easy way to resize specific icons.

- 'callback (function)': A function to call when all icons have been loaded.
  Includes an object literal as its argument with as keys all icon IDs and the
  icon as a jQuery object as its value.

- 'id_match (boolean)': Automatically attempt to match SVG icon ids with
  corresponding HTML id (default: true)

- 'no_img (boolean)': Prevent attempting to convert the icon into an <img>
  element (may be faster, help for browser consistency)

- 'svgz (boolean)': Indicate that the file is an SVGZ file, and thus not to
  parse as XML. SVGZ files add compression benefits, but getting data from
  them fails in Firefox 2 and older.

5. To access an icon at a later point without using the callback, use this:
  $.getSvgIcon(id (string));

This will return the icon (as jQuery object) with a given ID.

6. To resize icons at a later point without using the callback, use this:
  $.resizeSvgIcons(resizeOptions) (use the same way as the "resize" parameter)

Example usage #1:

$(function() {
  $.svgIcons('my_icon_set.svg'); // The SVG file that contains all icons
  // No options have been set, so all icons will automatically be inserted
  // into HTML elements that match the same IDs.
});

Example usage #2:

$(function() {
  $.svgIcons('my_icon_set.svg', { // The SVG file that contains all icons
    callback (icons) { // Custom callback function that sets click
                  // events for each icon
      $.each(icons, function(id, icon) {
        icon.click(function() {
          alert('You clicked on the icon with id ' + id);
        });
      });
    }
  }); //The SVG file that contains all icons
});

Example usage #3:

$(function() {
  $.svgIcons('my_icon_set.svgz', { // The SVGZ file that contains all icons
    w: 32,  // All icons will be 32px wide
    h: 32,  // All icons will be 32px high
    fallback_path: 'icons/',  // All fallback files can be found here
    fallback: {
      '#open_icon': 'open.png',  // The "open.png" will be appended to the
                    // HTML element with ID "open_icon"
      '#close_icon': 'close.png',
      '#save_icon': 'save.png'
    },
    placement: {'.open_icon','open'}, // The "open" icon will be added
                    // to all elements with class "open_icon"
    resize () {
      '#save_icon .svg_icon': 64  // The "save" icon will be resized to 64 x 64px
    },

    callback (icons) { // Sets background color for "close" icon
      icons['close'].css('background','red');
    },

    svgz: true // Indicates that an SVGZ file is being used

  })
});
*/

function jqPluginSVGIcons ($) {
  var svgIcons = {};

  var fixIDs = void 0;
  $.svgIcons = function (file, opts) {
    var svgns = 'http://www.w3.org/2000/svg',
        xlinkns = 'http://www.w3.org/1999/xlink',
        iconW = opts.w || 24,
        iconH = opts.h || 24;
    var elems = void 0,
        svgdoc = void 0,
        testImg = void 0,
        iconsMade = false,
        dataLoaded = false,
        loadAttempts = 0;
    var isOpera = !!window.opera,

    // ua = navigator.userAgent,
    // isSafari = (ua.includes('Safari/') && !ua.includes('Chrome/')),
    dataPre = 'data:image/svg+xml;charset=utf-8;base64,';

    var dataEl = void 0;
    if (opts.svgz) {
      dataEl = $('<object data="' + file + '" type=image/svg+xml>').appendTo('body').hide();
      try {
        svgdoc = dataEl[0].contentDocument;
        dataEl.load(getIcons);
        getIcons(0, true); // Opera will not run "load" event if file is already cached
      } catch (err1) {
        useFallback();
      }
    } else {
      var parser = new DOMParser();
      $.ajax({
        url: file,
        dataType: 'string',
        success: function success(data) {
          if (!data) {
            $(useFallback);
            return;
          }
          svgdoc = parser.parseFromString(data, 'text/xml');
          $(function () {
            getIcons('ajax');
          });
        },
        error: function error(err) {
          // TODO: Fix Opera widget icon bug
          if (window.opera) {
            $(function () {
              useFallback();
            });
          } else {
            if (err.responseText) {
              svgdoc = parser.parseFromString(err.responseText, 'text/xml');

              if (!svgdoc.childNodes.length) {
                $(useFallback);
              }
              $(function () {
                getIcons('ajax');
              });
            } else {
              $(useFallback);
            }
          }
        }
      });
    }

    function getIcons(evt, noWait) {
      if (evt !== 'ajax') {
        if (dataLoaded) return;
        // Webkit sometimes says svgdoc is undefined, other times
        // it fails to load all nodes. Thus we must make sure the "eof"
        // element is loaded.
        svgdoc = dataEl[0].contentDocument; // Needed again for Webkit
        var isReady = svgdoc && svgdoc.getElementById('svg_eof');
        if (!isReady && !(noWait && isReady)) {
          loadAttempts++;
          if (loadAttempts < 50) {
            setTimeout(getIcons, 20);
          } else {
            useFallback();
            dataLoaded = true;
          }
          return;
        }
        dataLoaded = true;
      }

      elems = $(svgdoc.firstChild).children(); // .getElementsByTagName('foreignContent');

      if (!opts.no_img) {
        var testSrc = dataPre + 'PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNzUiIGhlaWdodD0iMjc1Ij48L3N2Zz4%3D';

        testImg = $(new Image()).attr({
          src: testSrc,
          width: 0,
          height: 0
        }).appendTo('body').load(function () {
          // Safari 4 crashes, Opera and Chrome don't
          makeIcons(true);
        }).error(function () {
          makeIcons();
        });
      } else {
        setTimeout(function () {
          if (!iconsMade) makeIcons();
        }, 500);
      }
    }

    var setIcon = function setIcon(target, icon, id, setID) {
      if (isOpera) icon.css('visibility', 'hidden');
      if (opts.replace) {
        if (setID) icon.attr('id', id);
        var cl = target.attr('class');
        if (cl) icon.attr('class', 'svg_icon ' + cl);
        target.replaceWith(icon);
      } else {
        target.append(icon);
      }
      if (isOpera) {
        setTimeout(function () {
          icon.removeAttr('style');
        }, 1);
      }
    };

    var holder = void 0;
    var addIcon = function addIcon(icon, id) {
      if (opts.id_match === undefined || opts.id_match !== false) {
        setIcon(holder, icon, id, true);
      }
      svgIcons[id] = icon;
    };

    function makeIcons(toImage, fallback) {
      if (iconsMade) return;
      if (opts.no_img) toImage = false;

      var tempHolder = void 0;
      if (toImage) {
        tempHolder = $(document.createElement('div'));
        tempHolder.hide().appendTo('body');
      }
      if (fallback) {
        var path = opts.fallback_path || '';
        $.each(fallback, function (id, imgsrc) {
          holder = $('#' + id);
          var icon = $(new Image()).attr({
            class: 'svg_icon',
            src: path + imgsrc,
            width: iconW,
            height: iconH,
            alt: 'icon'
          });

          addIcon(icon, id);
        });
      } else {
        var len = elems.length;
        for (var i = 0; i < len; i++) {
          var elem = elems[i];
          var id = elem.id;

          if (id === 'svg_eof') break;
          holder = $('#' + id);
          var svgroot = document.createElementNS(svgns, 'svg');
          // Per https://www.w3.org/TR/xml-names11/#defaulting, the namespace for
          // attributes should have no value.
          svgroot.setAttributeNS(null, 'viewBox', [0, 0, iconW, iconH].join(' '));

          var svg = elem.getElementsByTagNameNS(svgns, 'svg')[0];

          // Make flexible by converting width/height to viewBox
          var w = svg.getAttribute('width');
          var h = svg.getAttribute('height');
          svg.removeAttribute('width');
          svg.removeAttribute('height');

          var vb = svg.getAttribute('viewBox');
          if (!vb) {
            svg.setAttribute('viewBox', [0, 0, w, h].join(' '));
          }

          // Not using jQuery to be a bit faster
          svgroot.setAttribute('xmlns', svgns);
          svgroot.setAttribute('width', iconW);
          svgroot.setAttribute('height', iconH);
          svgroot.setAttribute('xmlns:xlink', xlinkns);
          svgroot.setAttribute('class', 'svg_icon');

          // Without cloning, Firefox will make another GET request.
          // With cloning, causes issue in Opera/Win/Non-EN
          if (!isOpera) svg = svg.cloneNode(true);

          svgroot.append(svg);

          var icon = void 0;
          if (toImage) {
            tempHolder.empty().append(svgroot);
            var str = dataPre + encode64(unescape(encodeURIComponent(new XMLSerializer().serializeToString(svgroot))));
            icon = $(new Image()).attr({ class: 'svg_icon', src: str });
          } else {
            icon = fixIDs($(svgroot), i);
          }
          addIcon(icon, id);
        }
      }

      if (opts.placement) {
        $.each(opts.placement, function (sel, id) {
          if (!svgIcons[id]) return;
          $(sel).each(function (i) {
            var copy = svgIcons[id].clone();
            if (i > 0 && !toImage) copy = fixIDs(copy, i, true);
            setIcon($(this), copy, id);
          });
        });
      }
      if (!fallback) {
        if (toImage) tempHolder.remove();
        if (dataEl) dataEl.remove();
        if (testImg) testImg.remove();
      }
      if (opts.resize) $.resizeSvgIcons(opts.resize);
      iconsMade = true;

      if (opts.callback) opts.callback(svgIcons);
    }

    fixIDs = function fixIDs(svgEl, svgNum, force) {
      var defs = svgEl.find('defs');
      if (!defs.length) return svgEl;

      var idElems = void 0;
      if (isOpera) {
        idElems = defs.find('*').filter(function () {
          return !!this.id;
        });
      } else {
        idElems = defs.find('[id]');
      }

      var allElems = svgEl[0].getElementsByTagName('*'),
          len = allElems.length;

      idElems.each(function (i) {
        var id = this.id;
        /*
        const noDupes = ($(svgdoc).find('#' + id).length <= 1);
        if (isOpera) noDupes = false; // Opera didn't clone svgEl, so not reliable
        if(!force && noDupes) return;
        */

        var newId = 'x' + id + svgNum + i;
        this.id = newId;

        var oldVal = 'url(#' + id + ')';
        var newVal = 'url(#' + newId + ')';

        // Selector method, possibly faster but fails in Opera / jQuery 1.4.3
        //  svgEl.find('[fill="url(#' + id + ')"]').each(function() {
        //    this.setAttribute('fill', 'url(#' + newId + ')');
        //  }).end().find('[stroke="url(#' + id + ')"]').each(function() {
        //    this.setAttribute('stroke', 'url(#' + newId + ')');
        //  }).end().find('use').each(function() {
        //    if(this.getAttribute('xlink:href') == '#' + id) {
        //      this.setAttributeNS(xlinkns,'href','#' + newId);
        //    }
        //  }).end().find('[filter="url(#' + id + ')"]').each(function() {
        //    this.setAttribute('filter', 'url(#' + newId + ')');
        //  });

        for (i = 0; i < len; i++) {
          var elem = allElems[i];
          if (elem.getAttribute('fill') === oldVal) {
            elem.setAttribute('fill', newVal);
          }
          if (elem.getAttribute('stroke') === oldVal) {
            elem.setAttribute('stroke', newVal);
          }
          if (elem.getAttribute('filter') === oldVal) {
            elem.setAttribute('filter', newVal);
          }
        }
      });
      return svgEl;
    };

    function useFallback() {
      if (file.includes('.svgz')) {
        var regFile = file.replace('.svgz', '.svg');
        if (window.console) {
          console.log('.svgz failed, trying with .svg');
        }
        $.svgIcons(regFile, opts);
      } else if (opts.fallback) {
        makeIcons(false, opts.fallback);
      }
    }

    function encode64(input) {
      // base64 strings are 4/3 larger than the original string
      if (window.btoa) return window.btoa(input);
      var _keyStr = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';
      var output = new Array(Math.floor((input.length + 2) / 3) * 4);

      var i = 0,
          p = 0;
      do {
        var chr1 = input.charCodeAt(i++);
        var chr2 = input.charCodeAt(i++);
        var chr3 = input.charCodeAt(i++);

        var enc1 = chr1 >> 2;
        var enc2 = (chr1 & 3) << 4 | chr2 >> 4;

        var enc3 = (chr2 & 15) << 2 | chr3 >> 6;
        var enc4 = chr3 & 63;
        if (isNaN(chr2)) {
          enc3 = enc4 = 64;
        } else if (isNaN(chr3)) {
          enc4 = 64;
        }

        output[p++] = _keyStr.charAt(enc1);
        output[p++] = _keyStr.charAt(enc2);
        output[p++] = _keyStr.charAt(enc3);
        output[p++] = _keyStr.charAt(enc4);
      } while (i < input.length);

      return output.join('');
    }
  };

  $.getSvgIcon = function (id, uniqueClone) {
    var icon = svgIcons[id];
    if (uniqueClone && icon) {
      icon = fixIDs(icon, 0, true).clone(true);
    }
    return icon;
  };

  $.resizeSvgIcons = function (obj) {
    // FF2 and older don't detect .svg_icon, so we change it detect svg elems instead
    var changeSel = !$('.svg_icon:first').length;
    $.each(obj, function (sel, size) {
      var arr = Array.isArray(size);
      var w = arr ? size[0] : size,
          h = arr ? size[1] : size;
      if (changeSel) {
        sel = sel.replace(/\.svg_icon/g, 'svg');
      }
      $(sel).each(function () {
        this.setAttribute('width', w);
        this.setAttribute('height', h);
        if (window.opera && window.widget) {
          this.parentNode.style.width = w + 'px';
          this.parentNode.style.height = h + 'px';
        }
      });
    });
  };
  return $;
}

/**
 * jGraduate 0.4
 *
 * jQuery Plugin for a gradient picker
 *
 * Copyright (c) 2010 Jeff Schiller
 * http://blog.codedread.com/
 * Copyright (c) 2010 Alexis Deveria
 * http://a.deveria.com/
 *
 * Apache 2 License

jGraduate(options, okCallback, cancelCallback)

where options is an object literal:
  {
    window: { title: 'Pick the start color and opacity for the gradient' },
    images: { clientPath: 'images/' },
    paint: a Paint object,
    newstop: String of value "same", "inverse", "black" or "white"
         OR object with one or both values {color: #Hex color, opac: number 0-1}
  }

- the Paint object is:
  Paint {
    type: String, // one of "none", "solidColor", "linearGradient", "radialGradient"
    alpha: Number representing opacity (0-100),
    solidColor: String representing #RRGGBB hex of color,
    linearGradient: object of interface SVGLinearGradientElement,
    radialGradient: object of interface SVGRadialGradientElement,
  }

$.jGraduate.Paint() -> constructs a 'none' color
$.jGraduate.Paint({copy: o}) -> creates a copy of the paint o
$.jGraduate.Paint({hex: '#rrggbb'}) -> creates a solid color paint with hex = "#rrggbb"
$.jGraduate.Paint({linearGradient: o, a: 50}) -> creates a linear gradient paint with opacity=0.5
$.jGraduate.Paint({radialGradient: o, a: 7}) -> creates a radial gradient paint with opacity=0.07
$.jGraduate.Paint({hex: '#rrggbb', linearGradient: o}) -> throws an exception?

- picker accepts the following object as input:
  {
    okCallback: function to call when Ok is pressed
    cancelCallback: function to call when Cancel is pressed
    paint: object describing the paint to display initially, if not set, then default to opaque white
  }

- okCallback receives a Paint object

 *
*/
var ns = {
  svg: 'http://www.w3.org/2000/svg',
  xlink: 'http://www.w3.org/1999/xlink'
};

if (!window.console) {
  window.console = {
    log: function log(str) {},
    dir: function dir(str) {}
  };
}

function jqPluginJGraduate ($) {
  if (!$.loadingStylesheets) {
    $.loadingStylesheets = [];
  }
  var stylesheet = 'jgraduate/css/jgraduate.css';
  if (!$.loadingStylesheets.includes(stylesheet)) {
    $.loadingStylesheets.push(stylesheet);
  }
  $.jGraduate = {
    Paint: function Paint(opt) {
      var options = opt || {};
      this.alpha = isNaN(options.alpha) ? 100 : options.alpha;
      // copy paint object
      if (options.copy) {
        this.type = options.copy.type;
        this.alpha = options.copy.alpha;
        this.solidColor = null;
        this.linearGradient = null;
        this.radialGradient = null;

        switch (this.type) {
          case 'none':
            break;
          case 'solidColor':
            this.solidColor = options.copy.solidColor;
            break;
          case 'linearGradient':
            this.linearGradient = options.copy.linearGradient.cloneNode(true);
            break;
          case 'radialGradient':
            this.radialGradient = options.copy.radialGradient.cloneNode(true);
            break;
        }
        // create linear gradient paint
      } else if (options.linearGradient) {
        this.type = 'linearGradient';
        this.solidColor = null;
        this.radialGradient = null;
        this.linearGradient = options.linearGradient.cloneNode(true);
        // create linear gradient paint
      } else if (options.radialGradient) {
        this.type = 'radialGradient';
        this.solidColor = null;
        this.linearGradient = null;
        this.radialGradient = options.radialGradient.cloneNode(true);
        // create solid color paint
      } else if (options.solidColor) {
        this.type = 'solidColor';
        this.solidColor = options.solidColor;
        // create empty paint
      } else {
        this.type = 'none';
        this.solidColor = null;
        this.linearGradient = null;
        this.radialGradient = null;
      }
    }
  };

  $.fn.jGraduateDefaults = {
    paint: new $.jGraduate.Paint(),
    window: {
      pickerTitle: 'Drag markers to pick a paint'
    },
    images: {
      clientPath: 'images/'
    },
    newstop: 'inverse' // same, inverse, black, white
  };

  var isGecko = navigator.userAgent.includes('Gecko/');

  function setAttrs(elem, attrs) {
    if (isGecko) {
      for (var aname in attrs) {
        elem.setAttribute(aname, attrs[aname]);
      }
    } else {
      for (var _aname in attrs) {
        var val = attrs[_aname],
            prop = elem[_aname];
        if (prop && prop.constructor === 'SVGLength') {
          prop.baseVal.value = val;
        } else {
          elem.setAttribute(_aname, val);
        }
      }
    }
  }

  function mkElem(name, attrs, newparent) {
    var elem = document.createElementNS(ns.svg, name);
    setAttrs(elem, attrs);
    if (newparent) {
      newparent.append(elem);
    }
    return elem;
  }

  $.fn.jGraduate = function (options) {
    var $arguments = arguments;
    return this.each(function () {
      var $this = $(this),
          $settings = $.extend(true, {}, $.fn.jGraduateDefaults, options),
          id = $this.attr('id'),
          idref = '#' + $this.attr('id') + ' ';

      if (!idref) {
        alert('Container element must have an id attribute to maintain unique id strings for sub-elements.');
        return;
      }

      var okClicked = function okClicked() {
        switch ($this.paint.type) {
          case 'radialGradient':
            $this.paint.linearGradient = null;
            break;
          case 'linearGradient':
            $this.paint.radialGradient = null;
            break;
          case 'solidColor':
            $this.paint.radialGradient = $this.paint.linearGradient = null;
            break;
        }
        typeof $this.okCallback === 'function' && $this.okCallback($this.paint);
        $this.hide();
      };
      var cancelClicked = function cancelClicked() {
        typeof $this.cancelCallback === 'function' && $this.cancelCallback();
        $this.hide();
      };

      $.extend(true, $this, { // public properties, methods, and callbacks
        // make a copy of the incoming paint
        paint: new $.jGraduate.Paint({ copy: $settings.paint }),
        okCallback: typeof $arguments[1] === 'function' && $arguments[1] || null,
        cancelCallback: typeof $arguments[2] === 'function' && $arguments[2] || null
      });

      var // pos = $this.position(),
      color = null;
      var $win = $(window);

      if ($this.paint.type === 'none') {
        $this.paint = $.jGraduate.Paint({ solidColor: 'ffffff' });
      }

      $this.addClass('jGraduate_Picker');
      $this.html('<ul class="jGraduate_tabs">' + '<li class="jGraduate_tab_color jGraduate_tab_current" data-type="col">Solid Color</li>' + '<li class="jGraduate_tab_lingrad" data-type="lg">Linear Gradient</li>' + '<li class="jGraduate_tab_radgrad" data-type="rg">Radial Gradient</li>' + '</ul>' + '<div class="jGraduate_colPick"></div>' + '<div class="jGraduate_gradPick"></div>' + '<div class="jGraduate_LightBox"></div>' + '<div id="' + id + '_jGraduate_stopPicker" class="jGraduate_stopPicker"></div>');
      var colPicker = $(idref + '> .jGraduate_colPick');
      var gradPicker = $(idref + '> .jGraduate_gradPick');

      gradPicker.html('<div id="' + id + '_jGraduate_Swatch" class="jGraduate_Swatch">' + '<h2 class="jGraduate_Title">' + $settings.window.pickerTitle + '</h2>' + '<div id="' + id + '_jGraduate_GradContainer" class="jGraduate_GradContainer"></div>' + '<div id="' + id + '_jGraduate_StopSlider" class="jGraduate_StopSlider"></div>' + '</div>' + '<div class="jGraduate_Form jGraduate_Points jGraduate_lg_field">' + '<div class="jGraduate_StopSection">' + '<label class="jGraduate_Form_Heading">Begin Point</label>' + '<div class="jGraduate_Form_Section">' + '<label>x:</label>' + '<input type="text" id="' + id + '_jGraduate_x1" size="3" title="Enter starting x value between 0.0 and 1.0"/>' + '<label>y:</label>' + '<input type="text" id="' + id + '_jGraduate_y1" size="3" title="Enter starting y value between 0.0 and 1.0"/>' + '</div>' + '</div>' + '<div class="jGraduate_StopSection">' + '<label class="jGraduate_Form_Heading">End Point</label>' + '<div class="jGraduate_Form_Section">' + '<label>x:</label>' + '<input type="text" id="' + id + '_jGraduate_x2" size="3" title="Enter ending x value between 0.0 and 1.0"/>' + '<label>y:</label>' + '<input type="text" id="' + id + '_jGraduate_y2" size="3" title="Enter ending y value between 0.0 and 1.0"/>' + '</div>' + '</div>' + '</div>' + '<div class="jGraduate_Form jGraduate_Points jGraduate_rg_field">' + '<div class="jGraduate_StopSection">' + '<label class="jGraduate_Form_Heading">Center Point</label>' + '<div class="jGraduate_Form_Section">' + '<label>x:</label>' + '<input type="text" id="' + id + '_jGraduate_cx" size="3" title="Enter x value between 0.0 and 1.0"/>' + '<label>y:</label>' + '<input type="text" id="' + id + '_jGraduate_cy" size="3" title="Enter y value between 0.0 and 1.0"/>' + '</div>' + '</div>' + '<div class="jGraduate_StopSection">' + '<label class="jGraduate_Form_Heading">Focal Point</label>' + '<div class="jGraduate_Form_Section">' + '<label>Match center: <input type="checkbox" checked="checked" id="' + id + '_jGraduate_match_ctr"/></label><br/>' + '<label>x:</label>' + '<input type="text" id="' + id + '_jGraduate_fx" size="3" title="Enter x value between 0.0 and 1.0"/>' + '<label>y:</label>' + '<input type="text" id="' + id + '_jGraduate_fy" size="3" title="Enter y value between 0.0 and 1.0"/>' + '</div>' + '</div>' + '</div>' + '<div class="jGraduate_StopSection jGraduate_SpreadMethod">' + '<label class="jGraduate_Form_Heading">Spread method</label>' + '<div class="jGraduate_Form_Section">' + '<select class="jGraduate_spreadMethod">' + '<option value=pad selected>Pad</option>' + '<option value=reflect>Reflect</option>' + '<option value=repeat>Repeat</option>' + '</select>' + '</div>' + '</div>' + '<div class="jGraduate_Form">' + '<div class="jGraduate_Slider jGraduate_RadiusField jGraduate_rg_field">' + '<label class="prelabel">Radius:</label>' + '<div id="' + id + '_jGraduate_Radius" class="jGraduate_SliderBar jGraduate_Radius" title="Click to set radius">' + '<img id="' + id + '_jGraduate_RadiusArrows" class="jGraduate_RadiusArrows" src="' + $settings.images.clientPath + 'rangearrows2.gif">' + '</div>' + '<label><input type="text" id="' + id + '_jGraduate_RadiusInput" size="3" value="100"/>%</label>' + '</div>' + '<div class="jGraduate_Slider jGraduate_EllipField jGraduate_rg_field">' + '<label class="prelabel">Ellip:</label>' + '<div id="' + id + '_jGraduate_Ellip" class="jGraduate_SliderBar jGraduate_Ellip" title="Click to set Ellip">' + '<img id="' + id + '_jGraduate_EllipArrows" class="jGraduate_EllipArrows" src="' + $settings.images.clientPath + 'rangearrows2.gif">' + '</div>' + '<label><input type="text" id="' + id + '_jGraduate_EllipInput" size="3" value="0"/>%</label>' + '</div>' + '<div class="jGraduate_Slider jGraduate_AngleField jGraduate_rg_field">' + '<label class="prelabel">Angle:</label>' + '<div id="' + id + '_jGraduate_Angle" class="jGraduate_SliderBar jGraduate_Angle" title="Click to set Angle">' + '<img id="' + id + '_jGraduate_AngleArrows" class="jGraduate_AngleArrows" src="' + $settings.images.clientPath + 'rangearrows2.gif">' + '</div>' + '<label><input type="text" id="' + id + '_jGraduate_AngleInput" size="3" value="0"/>deg</label>' + '</div>' + '<div class="jGraduate_Slider jGraduate_OpacField">' + '<label class="prelabel">Opac:</label>' + '<div id="' + id + '_jGraduate_Opac" class="jGraduate_SliderBar jGraduate_Opac" title="Click to set Opac">' + '<img id="' + id + '_jGraduate_OpacArrows" class="jGraduate_OpacArrows" src="' + $settings.images.clientPath + 'rangearrows2.gif">' + '</div>' + '<label><input type="text" id="' + id + '_jGraduate_OpacInput" size="3" value="100"/>%</label>' + '</div>' + '</div>' + '<div class="jGraduate_OkCancel">' + '<input type="button" id="' + id + '_jGraduate_Ok" class="jGraduate_Ok" value="OK"/>' + '<input type="button" id="' + id + '_jGraduate_Cancel" class="jGraduate_Cancel" value="Cancel"/>' + '</div>');

      // --------------
      // Set up all the SVG elements (the gradient, stops and rectangle)
      var MAX = 256,
          MARGINX = 0,
          MARGINY = 0,

      // STOP_RADIUS = 15 / 2,
      SIZEX = MAX - 2 * MARGINX,
          SIZEY = MAX - 2 * MARGINY;

      var attrInput = {};

      var SLIDERW = 145;
      $('.jGraduate_SliderBar').width(SLIDERW);

      var container = $('#' + id + '_jGraduate_GradContainer')[0];

      var svg = mkElem('svg', {
        id: id + '_jgraduate_svg',
        width: MAX,
        height: MAX,
        xmlns: ns.svg
      }, container);

      // This wasn't working as designed
      // let curType;
      // curType = curType || $this.paint.type;

      // if we are sent a gradient, import it
      var curType = $this.paint.type;

      var grad = $this.paint[curType];
      var curGradient = grad;

      var gradalpha = $this.paint.alpha;

      var isSolid = curType === 'solidColor';

      // Make any missing gradients
      switch (curType) {
        case 'solidColor':
        // fall through
        case 'linearGradient':
          if (!isSolid) {
            curGradient.id = id + '_lg_jgraduate_grad';
            grad = curGradient = svg.appendChild(curGradient); // .cloneNode(true));
          }
          mkElem('radialGradient', {
            id: id + '_rg_jgraduate_grad'
          }, svg);
          if (curType === 'linearGradient') {
            break;
          }
        // fall through
        case 'radialGradient':
          if (!isSolid) {
            curGradient.id = id + '_rg_jgraduate_grad';
            grad = curGradient = svg.appendChild(curGradient); // .cloneNode(true));
          }
          mkElem('linearGradient', {
            id: id + '_lg_jgraduate_grad'
          }, svg);
      }

      var stopGroup = void 0; // eslint-disable-line prefer-const
      if (isSolid) {
        grad = curGradient = $('#' + id + '_lg_jgraduate_grad')[0];
        color = $this.paint[curType];
        mkStop(0, '#' + color, 1);

        var type = _typeof($settings.newstop);

        if (type === 'string') {
          switch ($settings.newstop) {
            case 'same':
              mkStop(1, '#' + color, 1);
              break;

            case 'inverse':
              // Invert current color for second stop
              var inverted = '';
              for (var i = 0; i < 6; i += 2) {
                // const ch = color.substr(i, 2);
                var inv = (255 - parseInt(color.substr(i, 2), 16)).toString(16);
                if (inv.length < 2) inv = 0 + inv;
                inverted += inv;
              }
              mkStop(1, '#' + inverted, 1);
              break;

            case 'white':
              mkStop(1, '#ffffff', 1);
              break;

            case 'black':
              mkStop(1, '#000000', 1);
              break;
          }
        } else if (type === 'object') {
          var opac = 'opac' in $settings.newstop ? $settings.newstop.opac : 1;
          mkStop(1, $settings.newstop.color || '#' + color, opac);
        }
      }

      var x1 = parseFloat(grad.getAttribute('x1') || 0.0),
          y1 = parseFloat(grad.getAttribute('y1') || 0.0),
          x2 = parseFloat(grad.getAttribute('x2') || 1.0),
          y2 = parseFloat(grad.getAttribute('y2') || 0.0);

      var cx = parseFloat(grad.getAttribute('cx') || 0.5),
          cy = parseFloat(grad.getAttribute('cy') || 0.5),
          fx = parseFloat(grad.getAttribute('fx') || cx),
          fy = parseFloat(grad.getAttribute('fy') || cy);

      var previewRect = mkElem('rect', {
        id: id + '_jgraduate_rect',
        x: MARGINX,
        y: MARGINY,
        width: SIZEX,
        height: SIZEY,
        fill: 'url(#' + id + '_jgraduate_grad)',
        'fill-opacity': gradalpha / 100
      }, svg);

      // stop visuals created here
      var beginCoord = $('<div/>').attr({
        class: 'grad_coord jGraduate_lg_field',
        title: 'Begin Stop'
      }).text(1).css({
        top: y1 * MAX,
        left: x1 * MAX
      }).data('coord', 'start').appendTo(container);

      var endCoord = beginCoord.clone().text(2).css({
        top: y2 * MAX,
        left: x2 * MAX
      }).attr('title', 'End stop').data('coord', 'end').appendTo(container);

      var centerCoord = $('<div/>').attr({
        class: 'grad_coord jGraduate_rg_field',
        title: 'Center stop'
      }).text('C').css({
        top: cy * MAX,
        left: cx * MAX
      }).data('coord', 'center').appendTo(container);

      var focusCoord = centerCoord.clone().text('F').css({
        top: fy * MAX,
        left: fx * MAX,
        display: 'none'
      }).attr('title', 'Focus point').data('coord', 'focus').appendTo(container);

      focusCoord[0].id = id + '_jGraduate_focusCoord';

      // const coords = $(idref + ' .grad_coord');

      // $(container).hover(function () {
      //   coords.animate({
      //     opacity: 1
      //   }, 500);
      // }, function () {
      //   coords.animate({
      //     opacity: .2
      //   }, 500);
      // });

      var showFocus = void 0;
      $.each(['x1', 'y1', 'x2', 'y2', 'cx', 'cy', 'fx', 'fy'], function (i, attr) {
        var isRadial = isNaN(attr[1]);

        var attrval = curGradient.getAttribute(attr);
        if (!attrval) {
          // Set defaults
          if (isRadial) {
            // For radial points
            attrval = '0.5';
          } else {
            // Only x2 is 1
            attrval = attr === 'x2' ? '1.0' : '0.0';
          }
        }

        attrInput[attr] = $('#' + id + '_jGraduate_' + attr).val(attrval).change(function () {
          // TODO: Support values < 0 and > 1 (zoomable preview?)
          if (isNaN(parseFloat(this.value)) || this.value < 0) {
            this.value = 0.0;
          } else if (this.value > 1) {
            this.value = 1.0;
          }

          if (!(attr[0] === 'f' && !showFocus)) {
            if (isRadial && curType === 'radialGradient' || !isRadial && curType === 'linearGradient') {
              curGradient.setAttribute(attr, this.value);
            }
          }

          var $elem = isRadial ? attr[0] === 'c' ? centerCoord : focusCoord : attr[1] === '1' ? beginCoord : endCoord;

          var cssName = attr.includes('x') ? 'left' : 'top';

          $elem.css(cssName, this.value * MAX);
        }).change();
      });

      function mkStop(n, color, opac, sel, stopElem) {
        var stop = stopElem || mkElem('stop', { 'stop-color': color, 'stop-opacity': opac, offset: n }, curGradient);
        if (stopElem) {
          color = stopElem.getAttribute('stop-color');
          opac = stopElem.getAttribute('stop-opacity');
          n = stopElem.getAttribute('offset');
        } else {
          curGradient.append(stop);
        }
        if (opac === null) opac = 1;

        var pickerD = 'M-6.2,0.9c3.6-4,6.7-4.3,6.7-12.4c-0.2,7.9,3.1,8.8,6.5,12.4c3.5,3.8,2.9,9.6,0,12.3c-3.1,2.8-10.4,2.7-13.2,0C-9.6,9.9-9.4,4.4-6.2,0.9z';

        var pathbg = mkElem('path', {
          d: pickerD,
          fill: 'url(#jGraduate_trans)',
          transform: 'translate(' + (10 + n * MAX) + ', 26)'
        }, stopGroup);

        var path = mkElem('path', {
          d: pickerD,
          fill: color,
          'fill-opacity': opac,
          transform: 'translate(' + (10 + n * MAX) + ', 26)',
          stroke: '#000',
          'stroke-width': 1.5
        }, stopGroup);

        $(path).mousedown(function (e) {
          selectStop(this);
          drag = curStop;
          $win.mousemove(dragColor).mouseup(remDrags);
          stopOffset = stopMakerDiv.offset();
          e.preventDefault();
          return false;
        }).data('stop', stop).data('bg', pathbg).dblclick(function () {
          $('div.jGraduate_LightBox').show();
          var colorhandle = this;
          var stopOpacity = +stop.getAttribute('stop-opacity') || 1;
          var stopColor = stop.getAttribute('stop-color') || 1;
          var thisAlpha = (parseFloat(stopOpacity) * 255).toString(16);
          while (thisAlpha.length < 2) {
            thisAlpha = '0' + thisAlpha;
          }
          color = stopColor.substr(1) + thisAlpha;
          $('#' + id + '_jGraduate_stopPicker').css({ left: 100, bottom: 15 }).jPicker({
            window: { title: 'Pick the start color and opacity for the gradient' },
            images: { clientPath: $settings.images.clientPath },
            color: { active: color, alphaSupport: true }
          }, function (color, arg2) {
            stopColor = color.val('hex') ? '#' + color.val('hex') : 'none';
            stopOpacity = color.val('a') !== null ? color.val('a') / 256 : 1;
            colorhandle.setAttribute('fill', stopColor);
            colorhandle.setAttribute('fill-opacity', stopOpacity);
            stop.setAttribute('stop-color', stopColor);
            stop.setAttribute('stop-opacity', stopOpacity);
            $('div.jGraduate_LightBox').hide();
            $('#' + id + '_jGraduate_stopPicker').hide();
          }, null, function () {
            $('div.jGraduate_LightBox').hide();
            $('#' + id + '_jGraduate_stopPicker').hide();
          });
        });

        $(curGradient).find('stop').each(function () {
          var curS = $(this);
          if (+this.getAttribute('offset') > n) {
            if (!color) {
              var newcolor = this.getAttribute('stop-color');
              var newopac = this.getAttribute('stop-opacity');
              stop.setAttribute('stop-color', newcolor);
              path.setAttribute('fill', newcolor);
              stop.setAttribute('stop-opacity', newopac === null ? 1 : newopac);
              path.setAttribute('fill-opacity', newopac === null ? 1 : newopac);
            }
            curS.before(stop);
            return false;
          }
        });
        if (sel) selectStop(path);
        return stop;
      }

      function remStop() {
        delStop.setAttribute('display', 'none');
        var path = $(curStop);
        var stop = path.data('stop');
        var bg = path.data('bg');
        $([curStop, stop, bg]).remove();
      }

      var stopMakerDiv = $('#' + id + '_jGraduate_StopSlider');

      var stops = void 0,
          curStop = void 0,
          drag = void 0;

      var delStop = mkElem('path', {
        d: 'm9.75,-6l-19.5,19.5m0,-19.5l19.5,19.5',
        fill: 'none',
        stroke: '#D00',
        'stroke-width': 5,
        display: 'none'
      }, undefined); // stopMakerSVG);

      function selectStop(item) {
        if (curStop) curStop.setAttribute('stroke', '#000');
        item.setAttribute('stroke', 'blue');
        curStop = item;
        curStop.parentNode.append(curStop);
        //   stops = $('stop');
        //   opac_select.val(curStop.attr('fill-opacity') || 1);
        //   root.append(delStop);
      }

      var stopOffset = void 0;

      function remDrags() {
        $win.unbind('mousemove', dragColor);
        if (delStop.getAttribute('display') !== 'none') {
          remStop();
        }
        drag = null;
      }

      var scaleX = 1,
          scaleY = 1,
          angle = 0;

      var cX = cx;
      var cY = cy;
      function xform() {
        var rot = angle ? 'rotate(' + angle + ',' + cX + ',' + cY + ') ' : '';
        if (scaleX === 1 && scaleY === 1) {
          curGradient.removeAttribute('gradientTransform');
          // $('#ang').addClass('dis');
        } else {
          var x = -cX * (scaleX - 1);
          var y = -cY * (scaleY - 1);
          curGradient.setAttribute('gradientTransform', rot + 'translate(' + x + ',' + y + ') scale(' + scaleX + ',' + scaleY + ')');
          // $('#ang').removeClass('dis');
        }
      }

      function dragColor(evt) {
        var x = evt.pageX - stopOffset.left;
        var y = evt.pageY - stopOffset.top;
        x = x < 10 ? 10 : x > MAX + 10 ? MAX + 10 : x;

        var xfStr = 'translate(' + x + ', 26)';
        if (y < -60 || y > 130) {
          delStop.setAttribute('display', 'block');
          delStop.setAttribute('transform', xfStr);
        } else {
          delStop.setAttribute('display', 'none');
        }

        drag.setAttribute('transform', xfStr);
        $.data(drag, 'bg').setAttribute('transform', xfStr);
        var stop = $.data(drag, 'stop');
        var sX = (x - 10) / MAX;

        stop.setAttribute('offset', sX);

        var last = 0;
        $(curGradient).find('stop').each(function (i) {
          var cur = this.getAttribute('offset');
          var t = $(this);
          if (cur < last) {
            t.prev().before(t);
            stops = $(curGradient).find('stop');
          }
          last = cur;
        });
      }

      var stopMakerSVG = mkElem('svg', {
        width: '100%',
        height: 45
      }, stopMakerDiv[0]);

      var transPattern = mkElem('pattern', {
        width: 16,
        height: 16,
        patternUnits: 'userSpaceOnUse',
        id: 'jGraduate_trans'
      }, stopMakerSVG);

      var transImg = mkElem('image', {
        width: 16,
        height: 16
      }, transPattern);

      var bgImage = $settings.images.clientPath + 'map-opacity.png';

      transImg.setAttributeNS(ns.xlink, 'xlink:href', bgImage);

      $(stopMakerSVG).click(function (evt) {
        stopOffset = stopMakerDiv.offset();
        var target = evt.target;

        if (target.tagName === 'path') return;
        var x = evt.pageX - stopOffset.left - 8;
        x = x < 10 ? 10 : x > MAX + 10 ? MAX + 10 : x;
        mkStop(x / MAX, 0, 0, true);
        evt.stopPropagation();
      });

      $(stopMakerSVG).mouseover(function () {
        stopMakerSVG.append(delStop);
      });

      stopGroup = mkElem('g', {}, stopMakerSVG);

      mkElem('line', {
        x1: 10,
        y1: 15,
        x2: MAX + 10,
        y2: 15,
        'stroke-width': 2,
        stroke: '#000'
      }, stopMakerSVG);

      var spreadMethodOpt = gradPicker.find('.jGraduate_spreadMethod').change(function () {
        curGradient.setAttribute('spreadMethod', $(this).val());
      });

      // handle dragging the stop around the swatch
      var draggingCoord = null;

      var onCoordDrag = function onCoordDrag(evt) {
        var x = evt.pageX - offset.left;
        var y = evt.pageY - offset.top;

        // clamp stop to the swatch
        x = x < 0 ? 0 : x > MAX ? MAX : x;
        y = y < 0 ? 0 : y > MAX ? MAX : y;

        draggingCoord.css('left', x).css('top', y);

        // calculate stop offset
        var fracx = x / SIZEX;
        var fracy = y / SIZEY;

        var type = draggingCoord.data('coord');
        var grad = curGradient;

        switch (type) {
          case 'start':
            attrInput.x1.val(fracx);
            attrInput.y1.val(fracy);
            grad.setAttribute('x1', fracx);
            grad.setAttribute('y1', fracy);
            break;
          case 'end':
            attrInput.x2.val(fracx);
            attrInput.y2.val(fracy);
            grad.setAttribute('x2', fracx);
            grad.setAttribute('y2', fracy);
            break;
          case 'center':
            attrInput.cx.val(fracx);
            attrInput.cy.val(fracy);
            grad.setAttribute('cx', fracx);
            grad.setAttribute('cy', fracy);
            cX = fracx;
            cY = fracy;
            xform();
            break;
          case 'focus':
            attrInput.fx.val(fracx);
            attrInput.fy.val(fracy);
            grad.setAttribute('fx', fracx);
            grad.setAttribute('fy', fracy);
            xform();
        }

        evt.preventDefault();
      };

      var onCoordUp = function onCoordUp() {
        draggingCoord = null;
        $win.unbind('mousemove', onCoordDrag).unbind('mouseup', onCoordUp);
      };

      // Linear gradient
      // (function () {

      stops = curGradient.getElementsByTagNameNS(ns.svg, 'stop');

      var numstops = stops.length;
      // if there are not at least two stops, then
      if (numstops < 2) {
        while (numstops < 2) {
          curGradient.append(document.createElementNS(ns.svg, 'stop'));
          ++numstops;
        }
        stops = curGradient.getElementsByTagNameNS(ns.svg, 'stop');
      }

      for (var _i = 0; _i < numstops; _i++) {
        mkStop(0, 0, 0, 0, stops[_i]);
      }

      spreadMethodOpt.val(curGradient.getAttribute('spreadMethod') || 'pad');

      var offset = void 0;

      // No match, so show focus point
      showFocus = false;

      previewRect.setAttribute('fill-opacity', gradalpha / 100);

      $('#' + id + ' div.grad_coord').mousedown(function (evt) {
        evt.preventDefault();
        draggingCoord = $(this);
        // const sPos = draggingCoord.offset();
        offset = draggingCoord.parent().offset();
        $win.mousemove(onCoordDrag).mouseup(onCoordUp);
      });

      // bind GUI elements
      $('#' + id + '_jGraduate_Ok').bind('click', function () {
        $this.paint.type = curType;
        $this.paint[curType] = curGradient.cloneNode(true);
        $this.paint.solidColor = null;
        okClicked();
      });
      $('#' + id + '_jGraduate_Cancel').bind('click', function (paint) {
        cancelClicked();
      });

      if (curType === 'radialGradient') {
        if (showFocus) {
          focusCoord.show();
        } else {
          focusCoord.hide();
          attrInput.fx.val('');
          attrInput.fy.val('');
        }
      }

      $('#' + id + '_jGraduate_match_ctr')[0].checked = !showFocus;

      var lastfx = void 0,
          lastfy = void 0;

      $('#' + id + '_jGraduate_match_ctr').change(function () {
        showFocus = !this.checked;
        focusCoord.toggle(showFocus);
        attrInput.fx.val('');
        attrInput.fy.val('');
        var grad = curGradient;
        if (!showFocus) {
          lastfx = grad.getAttribute('fx');
          lastfy = grad.getAttribute('fy');
          grad.removeAttribute('fx');
          grad.removeAttribute('fy');
        } else {
          var _fx = lastfx || 0.5;
          var _fy = lastfy || 0.5;
          grad.setAttribute('fx', _fx);
          grad.setAttribute('fy', _fy);
          attrInput.fx.val(_fx);
          attrInput.fy.val(_fy);
        }
      });

      stops = curGradient.getElementsByTagNameNS(ns.svg, 'stop');
      numstops = stops.length;
      // if there are not at least two stops, then
      if (numstops < 2) {
        while (numstops < 2) {
          curGradient.append(document.createElementNS(ns.svg, 'stop'));
          ++numstops;
        }
        stops = curGradient.getElementsByTagNameNS(ns.svg, 'stop');
      }

      var slider = void 0;

      var setSlider = function setSlider(e) {
        var _slider = slider,
            offset = _slider.offset;

        var div = slider.parent;
        var x = e.pageX - offset.left - parseInt(div.css('border-left-width'));
        if (x > SLIDERW) x = SLIDERW;
        if (x <= 0) x = 0;
        var posx = x - 5;
        x /= SLIDERW;

        switch (slider.type) {
          case 'radius':
            x = Math.pow(x * 2, 2.5);
            if (x > 0.98 && x < 1.02) x = 1;
            if (x <= 0.01) x = 0.01;
            curGradient.setAttribute('r', x);
            break;
          case 'opacity':
            $this.paint.alpha = parseInt(x * 100);
            previewRect.setAttribute('fill-opacity', x);
            break;
          case 'ellip':
            scaleX = 1;
            scaleY = 1;
            if (x < 0.5) {
              x /= 0.5; // 0.001
              scaleX = x <= 0 ? 0.01 : x;
            } else if (x > 0.5) {
              x /= 0.5; // 2
              x = 2 - x;
              scaleY = x <= 0 ? 0.01 : x;
            }
            xform();
            x -= 1;
            if (scaleY === x + 1) {
              x = Math.abs(x);
            }
            break;
          case 'angle':
            x = x - 0.5;
            angle = x *= 180;
            xform();
            x /= 100;
            break;
        }
        slider.elem.css({ 'margin-left': posx });
        x = Math.round(x * 100);
        slider.input.val(x);
      };

      var ellipVal = 0,
          angleVal = 0;

      if (curType === 'radialGradient') {
        var tlist = curGradient.gradientTransform.baseVal;
        if (tlist.numberOfItems === 2) {
          var t = tlist.getItem(0);
          var s = tlist.getItem(1);
          if (t.type === 2 && s.type === 3) {
            var m = s.matrix;
            if (m.a !== 1) {
              ellipVal = Math.round(-(1 - m.a) * 100);
            } else if (m.d !== 1) {
              ellipVal = Math.round((1 - m.d) * 100);
            }
          }
        } else if (tlist.numberOfItems === 3) {
          // Assume [R][T][S]
          var r = tlist.getItem(0);
          var _t = tlist.getItem(1);
          var _s = tlist.getItem(2);

          if (r.type === 4 && _t.type === 2 && _s.type === 3) {
            angleVal = Math.round(r.angle);
            var _m = _s.matrix;
            if (_m.a !== 1) {
              ellipVal = Math.round(-(1 - _m.a) * 100);
            } else if (_m.d !== 1) {
              ellipVal = Math.round((1 - _m.d) * 100);
            }
          }
        }
      }

      var sliders = {
        radius: {
          handle: '#' + id + '_jGraduate_RadiusArrows',
          input: '#' + id + '_jGraduate_RadiusInput',
          val: (curGradient.getAttribute('r') || 0.5) * 100
        },
        opacity: {
          handle: '#' + id + '_jGraduate_OpacArrows',
          input: '#' + id + '_jGraduate_OpacInput',
          val: $this.paint.alpha || 100
        },
        ellip: {
          handle: '#' + id + '_jGraduate_EllipArrows',
          input: '#' + id + '_jGraduate_EllipInput',
          val: ellipVal
        },
        angle: {
          handle: '#' + id + '_jGraduate_AngleArrows',
          input: '#' + id + '_jGraduate_AngleInput',
          val: angleVal
        }
      };

      $.each(sliders, function (type, data) {
        var handle = $(data.handle);
        handle.mousedown(function (evt) {
          var parent = handle.parent();
          slider = {
            type: type,
            elem: handle,
            input: $(data.input),
            parent: parent,
            offset: parent.offset()
          };
          $win.mousemove(dragSlider).mouseup(stopSlider);
          evt.preventDefault();
        });

        $(data.input).val(data.val).change(function () {
          var isRad = curType === 'radialGradient';
          var val = +this.value;
          var xpos = 0;
          switch (type) {
            case 'radius':
              if (isRad) curGradient.setAttribute('r', val / 100);
              xpos = Math.pow(val / 100, 1 / 2.5) / 2 * SLIDERW;
              break;

            case 'opacity':
              $this.paint.alpha = val;
              previewRect.setAttribute('fill-opacity', val / 100);
              xpos = val * (SLIDERW / 100);
              break;

            case 'ellip':
              scaleX = scaleY = 1;
              if (val === 0) {
                xpos = SLIDERW * 0.5;
                break;
              }
              if (val > 99.5) val = 99.5;
              if (val > 0) {
                scaleY = 1 - val / 100;
              } else {
                scaleX = -(val / 100) - 1;
              }

              xpos = SLIDERW * ((val + 100) / 2) / 100;
              if (isRad) xform();
              break;

            case 'angle':
              angle = val;
              xpos = angle / 180;
              xpos += 0.5;
              xpos *= SLIDERW;
              if (isRad) xform();
          }
          if (xpos > SLIDERW) {
            xpos = SLIDERW;
          } else if (xpos < 0) {
            xpos = 0;
          }
          handle.css({ 'margin-left': xpos - 5 });
        }).change();
      });

      var dragSlider = function dragSlider(evt) {
        setSlider(evt);
        evt.preventDefault();
      };

      var stopSlider = function stopSlider(evt) {
        $win.unbind('mousemove', dragSlider).unbind('mouseup', stopSlider);
        slider = null;
      };

      // --------------
      var thisAlpha = ($this.paint.alpha * 255 / 100).toString(16);
      while (thisAlpha.length < 2) {
        thisAlpha = '0' + thisAlpha;
      }
      thisAlpha = thisAlpha.split('.')[0];
      color = $this.paint.solidColor === 'none' ? '' : $this.paint.solidColor + thisAlpha;

      if (!isSolid) {
        color = stops[0].getAttribute('stop-color');
      }

      // This should be done somewhere else, probably
      $.extend($.fn.jPicker.defaults.window, {
        alphaSupport: true, effects: { type: 'show', speed: 0 }
      });

      colPicker.jPicker({
        window: { title: $settings.window.pickerTitle },
        images: { clientPath: $settings.images.clientPath },
        color: { active: color, alphaSupport: true }
      }, function (color) {
        $this.paint.type = 'solidColor';
        $this.paint.alpha = color.val('ahex') ? Math.round(color.val('a') / 255 * 100) : 100;
        $this.paint.solidColor = color.val('hex') ? color.val('hex') : 'none';
        $this.paint.radialGradient = null;
        okClicked();
      }, null, function () {
        cancelClicked();
      });

      var tabs = $(idref + ' .jGraduate_tabs li');
      tabs.click(function () {
        tabs.removeClass('jGraduate_tab_current');
        $(this).addClass('jGraduate_tab_current');
        $(idref + ' > div').hide();
        var type = $(this).attr('data-type');
        /* const container = */$(idref + ' .jGraduate_gradPick').show();
        if (type === 'rg' || type === 'lg') {
          // Show/hide appropriate fields
          $('.jGraduate_' + type + '_field').show();
          $('.jGraduate_' + (type === 'lg' ? 'rg' : 'lg') + '_field').hide();

          $('#' + id + '_jgraduate_rect')[0].setAttribute('fill', 'url(#' + id + '_' + type + '_jgraduate_grad)');

          // Copy stops

          curType = type === 'lg' ? 'linearGradient' : 'radialGradient';

          $('#' + id + '_jGraduate_OpacInput').val($this.paint.alpha).change();

          var newGrad = $('#' + id + '_' + type + '_jgraduate_grad')[0];

          if (curGradient !== newGrad) {
            var curStops = $(curGradient).find('stop');
            $(newGrad).empty().append(curStops);
            curGradient = newGrad;
            var sm = spreadMethodOpt.val();
            curGradient.setAttribute('spreadMethod', sm);
          }
          showFocus = type === 'rg' && curGradient.getAttribute('fx') != null && !(cx === fx && cy === fy);
          $('#' + id + '_jGraduate_focusCoord').toggle(showFocus);
          if (showFocus) {
            $('#' + id + '_jGraduate_match_ctr')[0].checked = false;
          }
        } else {
          $(idref + ' .jGraduate_gradPick').hide();
          $(idref + ' .jGraduate_colPick').show();
        }
      });
      $(idref + ' > div').hide();
      tabs.removeClass('jGraduate_tab_current');
      var tab = void 0;
      switch ($this.paint.type) {
        case 'linearGradient':
          tab = $(idref + ' .jGraduate_tab_lingrad');
          break;
        case 'radialGradient':
          tab = $(idref + ' .jGraduate_tab_radgrad');
          break;
        default:
          tab = $(idref + ' .jGraduate_tab_color');
          break;
      }
      $this.show();

      // jPicker will try to show after a 0ms timeout, so need to fire this after that
      setTimeout(function () {
        tab.addClass('jGraduate_tab_current').click();
      }, 10);
    });
  };
  return $;
}

/* SpinButton control
 *
 * Adds bells and whistles to any ordinary textbox to
 * make it look and feel like a SpinButton Control.
 *
 * Originally written by George Adamson, Software Unity (george.jquery@softwareunity.com) August 2006.
 * - Added min/max options
 * - Added step size option
 * - Added bigStep (page up/down) option
 *
 * Modifications made by Mark Gibson, (mgibson@designlinks.net) September 2006:
 * - Converted to jQuery plugin
 * - Allow limited or unlimited min/max values
 * - Allow custom class names, and add class to input element
 * - Removed global vars
 * - Reset (to original or through config) when invalid value entered
 * - Repeat whilst holding mouse button down (with initial pause, like keyboard repeat)
 * - Support mouse wheel in Firefox
 * - Fix double click in IE
 * - Refactored some code and renamed some vars
 *
 * Modifications by Jeff Schiller, June 2009:
 * - provide callback function for when the value changes based on the following
 *   https://www.mail-archive.com/jquery-en@googlegroups.com/msg36070.html
 * Modifications by Jeff Schiller, July 2009:
 * - improve styling for widget in Opera
 * - consistent key-repeat handling cross-browser
 * Modifications by Alexis Deveria, October 2009:
 * - provide "stepfunc" callback option to allow custom function to run when changing a value
 * - Made adjustValue(0) only run on certain keyup events, not all.
 *
 * Tested in IE6, Opera9, Firefox 1.5
 * v1.0  11 Aug 2006 - George Adamson  - First release
 * v1.1     Aug 2006 - George Adamson  - Minor enhancements
 * v1.2  27 Sep 2006 - Mark Gibson    - Major enhancements
 * v1.3a 28 Sep 2006 - George Adamson  - Minor enhancements
 * v1.4  18 Jun 2009 - Jeff Schiller    - Added callback function
 * v1.5  06 Jul 2009 - Jeff Schiller    - Fixes for Opera.
 * v1.6  13 Oct 2009 - Alexis Deveria   - Added stepfunc function
 * v1.7  21 Oct 2009 - Alexis Deveria   - Minor fixes
 *                                        Fast-repeat for keys and live updating as you type.
 * v1.8  12 Jan 2010 - Benjamin Thomas  - Fixes for mouseout behavior.
 *                                        Added smallStep
 * ? 20 May 2018 - Brett Zamir - Avoid SVGEdit dependency via `stateObj` config;
  convert to ES6 module
 Sample usage:

  // Create group of settings to initialise spinbutton(s). (Optional)
  const myOptions = {
    min: 0, // Set lower limit.
    max: 100, // Set upper limit.
    step: 1, // Set increment size.
    smallStep: 0.5, // Set shift-click increment size.
    stateObj: {tool_scale: 1}, // Object to allow passing in live-updating scale
    spinClass: mySpinBtnClass, // CSS class to style the spinbutton. (Class also specifies url of the up/down button image.)
    upClass: mySpinUpClass, // CSS class for style when mouse over up button.
    downClass: mySpinDnClass // CSS class for style when mouse over down button.
  };

  $(function () {
    // Initialise INPUT element(s) as SpinButtons: (passing options if desired)
    $("#myInputElement").SpinButton(myOptions);
  });
 */
function jqPluginSpinBtn ($) {
  if (!$.loadingStylesheets) {
    $.loadingStylesheets = [];
  }
  var stylesheet = 'spinbtn/JQuerySpinBtn.css';
  if (!$.loadingStylesheets.includes(stylesheet)) {
    $.loadingStylesheets.push(stylesheet);
  }
  $.fn.SpinButton = function (cfg) {
    cfg = cfg || {};
    function coord(el, prop) {
      var b = document.body;

      var c = el[prop];
      while ((el = el.offsetParent) && el !== b) {
        if (!$.browser.msie || el.currentStyle.position !== 'relative') {
          c += el[prop];
        }
      }

      return c;
    }

    return this.each(function () {
      this.repeating = false;

      // Apply specified options or defaults:
      // (Ought to refactor this some day to use $.extend() instead)
      this.spinCfg = {
        // min: cfg.min ? Number(cfg.min) : null,
        // max: cfg.max ? Number(cfg.max) : null,
        min: !isNaN(parseFloat(cfg.min)) ? Number(cfg.min) : null, // Fixes bug with min:0
        max: !isNaN(parseFloat(cfg.max)) ? Number(cfg.max) : null,
        step: cfg.step ? Number(cfg.step) : 1,
        stepfunc: cfg.stepfunc || false,
        page: cfg.page ? Number(cfg.page) : 10,
        upClass: cfg.upClass || 'up',
        downClass: cfg.downClass || 'down',
        reset: cfg.reset || this.value,
        delay: cfg.delay ? Number(cfg.delay) : 500,
        interval: cfg.interval ? Number(cfg.interval) : 100,
        _btn_width: 20,
        _direction: null,
        _delay: null,
        _repeat: null,
        callback: cfg.callback || null
      };

      // if a smallStep isn't supplied, use half the regular step
      this.spinCfg.smallStep = cfg.smallStep || this.spinCfg.step / 2;

      this.adjustValue = function (i) {
        var v = void 0;
        if (isNaN(this.value)) {
          v = this.spinCfg.reset;
        } else if (typeof this.spinCfg.stepfunc === 'function') {
          v = this.spinCfg.stepfunc(this, i);
        } else {
          // weirdest JavaScript bug ever: 5.1 + 0.1 = 5.199999999
          v = Number((Number(this.value) + Number(i)).toFixed(5));
        }
        if (this.spinCfg.min !== null) {
          v = Math.max(v, this.spinCfg.min);
        }
        if (this.spinCfg.max !== null) {
          v = Math.min(v, this.spinCfg.max);
        }
        this.value = v;
        if (typeof this.spinCfg.callback === 'function') {
          this.spinCfg.callback(this);
        }
      };

      $(this).addClass(cfg.spinClass || 'spin-button').mousemove(function (e) {
        // Determine which button mouse is over, or not (spin direction):
        var x = e.pageX || e.x;
        var y = e.pageY || e.y;
        var el = e.target;
        var scale = cfg.stateObj.tool_scale || 1;
        var height = $(el).height() / 2;

        var direction = x > coord(el, 'offsetLeft') + el.offsetWidth * scale - this.spinCfg._btn_width ? y < coord(el, 'offsetTop') + height * scale ? 1 : -1 : 0;

        if (direction !== this.spinCfg._direction) {
          // Style up/down buttons:
          switch (direction) {
            case 1:
              // Up arrow:
              $(this).removeClass(this.spinCfg.downClass).addClass(this.spinCfg.upClass);
              break;
            case -1:
              // Down arrow:
              $(this).removeClass(this.spinCfg.upClass).addClass(this.spinCfg.downClass);
              break;
            default:
              // Mouse is elsewhere in the textbox
              $(this).removeClass(this.spinCfg.upClass).removeClass(this.spinCfg.downClass);
          }

          // Set spin direction:
          this.spinCfg._direction = direction;
        }
      }).mouseout(function () {
        // Reset up/down buttons to their normal appearance when mouse moves away:
        $(this).removeClass(this.spinCfg.upClass).removeClass(this.spinCfg.downClass);
        this.spinCfg._direction = null;
        window.clearInterval(this.spinCfg._repeat);
        window.clearTimeout(this.spinCfg._delay);
      }).mousedown(function (e) {
        var _this = this;

        if (e.button === 0 && this.spinCfg._direction !== 0) {
          // Respond to click on one of the buttons:
          var stepSize = e.shiftKey ? this.spinCfg.smallStep : this.spinCfg.step;

          var adjust = function adjust() {
            _this.adjustValue(_this.spinCfg._direction * stepSize);
          };

          adjust();

          // Initial delay before repeating adjustment
          this.spinCfg._delay = window.setTimeout(function () {
            adjust();
            // Repeat adjust at regular intervals
            _this.spinCfg._repeat = window.setInterval(adjust, _this.spinCfg.interval);
          }, this.spinCfg.delay);
        }
      }).mouseup(function (e) {
        // Cancel repeating adjustment
        window.clearInterval(this.spinCfg._repeat);
        window.clearTimeout(this.spinCfg._delay);
      }).dblclick(function (e) {
        if ($.browser.msie) {
          this.adjustValue(this.spinCfg._direction * this.spinCfg.step);
        }
      }).keydown(function (e) {
        // Respond to up/down arrow keys.
        switch (e.keyCode) {
          case 38:
            this.adjustValue(this.spinCfg.step);break; // Up
          case 40:
            this.adjustValue(-this.spinCfg.step);break; // Down
          case 33:
            this.adjustValue(this.spinCfg.page);break; // PageUp
          case 34:
            this.adjustValue(-this.spinCfg.page);break; // PageDown
        }
      })

      /*
      http://unixpapa.com/js/key.html describes the current state-of-affairs for
      key repeat events:
      - Safari 3.1 changed their model so that keydown is reliably repeated going forward
      - Firefox and Opera still only repeat the keypress event, not the keydown
      */
      .keypress(function (e) {
        if (this.repeating) {
          // Respond to up/down arrow keys.
          switch (e.keyCode) {
            case 38:
              this.adjustValue(this.spinCfg.step);break; // Up
            case 40:
              this.adjustValue(-this.spinCfg.step);break; // Down
            case 33:
              this.adjustValue(this.spinCfg.page);break; // PageUp
            case 34:
              this.adjustValue(-this.spinCfg.page);break; // PageDown
          }
          // we always ignore the first keypress event (use the keydown instead)
        } else {
          this.repeating = true;
        }
      })

      // clear the 'repeating' flag
      .keyup(function (e) {
        this.repeating = false;
        switch (e.keyCode) {
          case 38: // Up
          case 40: // Down
          case 33: // PageUp
          case 34: // PageDown
          case 13:
            this.adjustValue(0);break; // Enter/Return
        }
      }).bind('mousewheel', function (e) {
        // Respond to mouse wheel in IE. (It returns up/dn motion in multiples of 120)
        if (e.wheelDelta >= 120) {
          this.adjustValue(this.spinCfg.step);
        } else if (e.wheelDelta <= -120) {
          this.adjustValue(-this.spinCfg.step);
        }

        e.preventDefault();
      }).change(function (e) {
        this.adjustValue(0);
      });

      if (this.addEventListener) {
        // Respond to mouse wheel in Firefox
        this.addEventListener('DOMMouseScroll', function (e) {
          if (e.detail > 0) {
            this.adjustValue(-this.spinCfg.step);
          } else if (e.detail < 0) {
            this.adjustValue(this.spinCfg.step);
          }

          e.preventDefault();
        }, false);
      }
    });
  };
  return $;
}

// Todo: Update to latest version and adapt (and needs jQuery update as well): https://github.com/swisnl/jQuery-contextMenu

function jqPluginContextMenu ($) {
  var win = $(window);
  var doc = $(document);

  $.extend($.fn, {
    contextMenu: function contextMenu(o, callback) {
      // Defaults
      if (o.menu === undefined) return false;
      if (o.inSpeed === undefined) o.inSpeed = 150;
      if (o.outSpeed === undefined) o.outSpeed = 75;
      // 0 needs to be -1 for expected results (no fade)
      if (o.inSpeed === 0) o.inSpeed = -1;
      if (o.outSpeed === 0) o.outSpeed = -1;
      // Loop each context menu
      $(this).each(function () {
        var el = $(this);
        var offset = $(el).offset();

        var menu = $('#' + o.menu);

        // Add contextMenu class
        menu.addClass('contextMenu');
        // Simulate a true right click
        $(this).bind('mousedown', function (e) {
          var evt = e;
          $(this).mouseup(function (e) {
            var srcElement = $(this);
            srcElement.unbind('mouseup');
            if (evt.button === 2 || o.allowLeft || evt.ctrlKey && isMac()) {
              e.stopPropagation();
              // Hide context menus that may be showing
              $('.contextMenu').hide();
              // Get this context menu

              if (el.hasClass('disabled')) return false;

              // Detect mouse position
              var x = e.pageX,
                  y = e.pageY;

              var xOff = win.width() - menu.width(),
                  yOff = win.height() - menu.height();

              if (x > xOff - 15) x = xOff - 15;
              if (y > yOff - 30) y = yOff - 30; // 30 is needed to prevent scrollbars in FF

              // Show the menu
              doc.unbind('click');
              menu.css({ top: y, left: x }).fadeIn(o.inSpeed);
              // Hover events
              menu.find('A').mouseover(function () {
                menu.find('LI.hover').removeClass('hover');
                $(this).parent().addClass('hover');
              }).mouseout(function () {
                menu.find('LI.hover').removeClass('hover');
              });

              // Keyboard
              doc.keypress(function (e) {
                switch (e.keyCode) {
                  case 38:
                    // up
                    if (!menu.find('LI.hover').length) {
                      menu.find('LI:last').addClass('hover');
                    } else {
                      menu.find('LI.hover').removeClass('hover').prevAll('LI:not(.disabled)').eq(0).addClass('hover');
                      if (!menu.find('LI.hover').length) menu.find('LI:last').addClass('hover');
                    }
                    break;
                  case 40:
                    // down
                    if (!menu.find('LI.hover').length) {
                      menu.find('LI:first').addClass('hover');
                    } else {
                      menu.find('LI.hover').removeClass('hover').nextAll('LI:not(.disabled)').eq(0).addClass('hover');
                      if (!menu.find('LI.hover').length) menu.find('LI:first').addClass('hover');
                    }
                    break;
                  case 13:
                    // enter
                    menu.find('LI.hover A').trigger('click');
                    break;
                  case 27:
                    // esc
                    doc.trigger('click');
                    break;
                }
              });

              // When items are selected
              menu.find('A').unbind('mouseup');
              menu.find('LI:not(.disabled) A').mouseup(function () {
                doc.unbind('click').unbind('keypress');
                $('.contextMenu').hide();
                // Callback
                if (callback) callback($(this).attr('href').substr(1), $(srcElement), { x: x - offset.left, y: y - offset.top, docX: x, docY: y });
                return false;
              });

              // Hide bindings
              setTimeout(function () {
                // Delay for Mozilla
                doc.click(function () {
                  doc.unbind('click').unbind('keypress');
                  menu.fadeOut(o.outSpeed);
                  return false;
                });
              }, 0);
            }
          });
        });

        // Disable text selection
        if ($.browser.mozilla) {
          $('#' + o.menu).each(function () {
            $(this).css({ MozUserSelect: 'none' });
          });
        } else if ($.browser.msie) {
          $('#' + o.menu).each(function () {
            $(this).bind('selectstart.disableTextSelect', function () {
              return false;
            });
          });
        } else {
          $('#' + o.menu).each(function () {
            $(this).bind('mousedown.disableTextSelect', function () {
              return false;
            });
          });
        }
        // Disable browser context menu (requires both selectors to work in IE/Safari + FF/Chrome)
        $(el).add($('UL.contextMenu')).bind('contextmenu', function () {
          return false;
        });
      });
      return $(this);
    },


    // Disable context menu items on the fly
    disableContextMenuItems: function disableContextMenuItems(o) {
      if (o === undefined) {
        // Disable all
        $(this).find('LI').addClass('disabled');
        return $(this);
      }
      $(this).each(function () {
        if (o !== undefined) {
          var d = o.split(',');
          for (var i = 0; i < d.length; i++) {
            $(this).find('A[href="' + d[i] + '"]').parent().addClass('disabled');
          }
        }
      });
      return $(this);
    },


    // Enable context menu items on the fly
    enableContextMenuItems: function enableContextMenuItems(o) {
      if (o === undefined) {
        // Enable all
        $(this).find('LI.disabled').removeClass('disabled');
        return $(this);
      }
      $(this).each(function () {
        if (o !== undefined) {
          var d = o.split(',');
          for (var i = 0; i < d.length; i++) {
            $(this).find('A[href="' + d[i] + '"]').parent().removeClass('disabled');
          }
        }
      });
      return $(this);
    },


    // Disable context menu(s)
    disableContextMenu: function disableContextMenu() {
      $(this).each(function () {
        $(this).addClass('disabled');
      });
      return $(this);
    },


    // Enable context menu(s)
    enableContextMenu: function enableContextMenu() {
      $(this).each(function () {
        $(this).removeClass('disabled');
      });
      return $(this);
    },


    // Destroy context menu(s)
    destroyContextMenu: function destroyContextMenu() {
      // Destroy specified context menus
      $(this).each(function () {
        // Disable action
        $(this).unbind('mousedown').unbind('mouseup');
      });
      return $(this);
    }
  });
  return $;
}

/*
 * jPicker (Adapted from version 1.1.6)
 *
 * jQuery Plugin for Photoshop style color picker
 *
 * Copyright (c) 2010 Christopher T. Tillman
 * Digital Magic Productions, Inc. (http://www.digitalmagicpro.com/)
 * MIT style license, FREE to use, alter, copy, sell, and especially ENHANCE
 *
 * Painstakingly ported from John Dyers' excellent work on his own color picker based on the Prototype framework.
 *
 * John Dyers' website: (http://johndyer.name)
 * Color Picker page:   (http://johndyer.name/post/2007/09/PhotoShop-like-JavaScript-Color-Picker.aspx)
 *
 */

Math.precision = function (value, precision) {
  if (precision === undefined) precision = 0;
  return Math.round(value * Math.pow(10, precision)) / Math.pow(10, precision);
};

var jPicker = function jPicker($) {
  if (!$.loadingStylesheets) {
    $.loadingStylesheets = [];
  }
  var stylesheet = 'jgraduate/css/jPicker.css';
  if (!$.loadingStylesheets.includes(stylesheet)) {
    $.loadingStylesheets.push(stylesheet);
  }
  /**
  * Encapsulate slider functionality for the ColorMap and ColorBar -
  * could be useful to use a jQuery UI draggable for this with certain extensions
  */
  function Slider(bar, options) {
    var $this = this;
    function fireChangeEvents(context) {
      for (var i = 0; i < changeEvents.length; i++) {
        changeEvents[i].call($this, $this, context);
      }
    }
    // bind the mousedown to the bar not the arrow for quick snapping to the clicked location
    function mouseDown(e) {
      var off = bar.offset();
      offset = { l: off.left | 0, t: off.top | 0 };
      clearTimeout(timeout);
      // using setTimeout for visual updates - once the style is updated the browser will re-render internally allowing the next Javascript to run
      timeout = setTimeout(function () {
        setValuesFromMousePosition.call($this, e);
      }, 0);
      // Bind mousemove and mouseup event to the document so it responds when dragged of of the bar - we will unbind these when on mouseup to save processing
      $(document).bind('mousemove', mouseMove).bind('mouseup', mouseUp);
      e.preventDefault(); // don't try to select anything or drag the image to the desktop
    }
    // set the values as the mouse moves
    function mouseMove(e) {
      clearTimeout(timeout);
      timeout = setTimeout(function () {
        setValuesFromMousePosition.call($this, e);
      }, 0);
      e.stopPropagation();
      e.preventDefault();
      return false;
    }
    // unbind the document events - they aren't needed when not dragging
    function mouseUp(e) {
      $(document).unbind('mouseup', mouseUp).unbind('mousemove', mouseMove);
      e.stopPropagation();
      e.preventDefault();
      return false;
    }
    // calculate mouse position and set value within the current range
    function setValuesFromMousePosition(e) {
      var barW = bar.w,
          // local copies for YUI compressor
      barH = bar.h;
      var locX = e.pageX - offset.l,
          locY = e.pageY - offset.t;
      // keep the arrow within the bounds of the bar
      if (locX < 0) locX = 0;else if (locX > barW) locX = barW;
      if (locY < 0) locY = 0;else if (locY > barH) locY = barH;
      val.call($this, 'xy', { x: locX / barW * rangeX + minX, y: locY / barH * rangeY + minY });
    }
    function draw() {
      var barW = bar.w,
          barH = bar.h,
          arrowW = arrow.w,
          arrowH = arrow.h;
      var arrowOffsetX = 0,
          arrowOffsetY = 0;
      setTimeout(function () {
        if (rangeX > 0) {
          // range is greater than zero
          // constrain to bounds
          if (x === maxX) arrowOffsetX = barW;else arrowOffsetX = x / rangeX * barW | 0;
        }
        if (rangeY > 0) {
          // range is greater than zero
          // constrain to bounds
          if (y === maxY) arrowOffsetY = barH;else arrowOffsetY = y / rangeY * barH | 0;
        }
        // if arrow width is greater than bar width, center arrow and prevent horizontal dragging
        if (arrowW >= barW) arrowOffsetX = (barW >> 1) - (arrowW >> 1); // number >> 1 - superfast bitwise divide by two and truncate (move bits over one bit discarding lowest)
        else arrowOffsetX -= arrowW >> 1;
        // if arrow height is greater than bar height, center arrow and prevent vertical dragging
        if (arrowH >= barH) arrowOffsetY = (barH >> 1) - (arrowH >> 1);else arrowOffsetY -= arrowH >> 1;
        // set the arrow position based on these offsets
        arrow.css({ left: arrowOffsetX + 'px', top: arrowOffsetY + 'px' });
      }, 0);
    }
    function val(name, value, context) {
      var set$$1 = value !== undefined;
      if (!set$$1) {
        if (name === undefined || name == null) name = 'xy';
        switch (name.toLowerCase()) {
          case 'x':
            return x;
          case 'y':
            return y;
          case 'xy':
          default:
            return { x: x, y: y };
        }
      }
      if (context != null && context === $this) return;
      var changed = false;

      var newX = void 0,
          newY = void 0;
      if (name == null) name = 'xy';
      switch (name.toLowerCase()) {
        case 'x':
          newX = value && (value.x && value.x | 0 || value | 0) || 0;
          break;
        case 'y':
          newY = value && (value.y && value.y | 0 || value | 0) || 0;
          break;
        case 'xy':
        default:
          newX = value && value.x && value.x | 0 || 0;
          newY = value && value.y && value.y | 0 || 0;
          break;
      }
      if (newX != null) {
        if (newX < minX) newX = minX;else if (newX > maxX) newX = maxX;
        if (x !== newX) {
          x = newX;
          changed = true;
        }
      }
      if (newY != null) {
        if (newY < minY) newY = minY;else if (newY > maxY) newY = maxY;
        if (y !== newY) {
          y = newY;
          changed = true;
        }
      }
      changed && fireChangeEvents.call($this, context || $this);
    }
    function range(name, value) {
      var set$$1 = value !== undefined;
      if (!set$$1) {
        if (name === undefined || name == null) name = 'all';
        switch (name.toLowerCase()) {
          case 'minx':
            return minX;
          case 'maxx':
            return maxX;
          case 'rangex':
            return { minX: minX, maxX: maxX, rangeX: rangeX };
          case 'miny':
            return minY;
          case 'maxy':
            return maxY;
          case 'rangey':
            return { minY: minY, maxY: maxY, rangeY: rangeY };
          case 'all':
          default:
            return { minX: minX, maxX: maxX, rangeX: rangeX, minY: minY, maxY: maxY, rangeY: rangeY };
        }
      }
      var // changed = false,
      newMinX = void 0,
          newMaxX = void 0,
          newMinY = void 0,
          newMaxY = void 0;
      if (name == null) name = 'all';
      switch (name.toLowerCase()) {
        case 'minx':
          newMinX = value && (value.minX && value.minX | 0 || value | 0) || 0;
          break;
        case 'maxx':
          newMaxX = value && (value.maxX && value.maxX | 0 || value | 0) || 0;
          break;
        case 'rangex':
          newMinX = value && value.minX && value.minX | 0 || 0;
          newMaxX = value && value.maxX && value.maxX | 0 || 0;
          break;
        case 'miny':
          newMinY = value && (value.minY && value.minY | 0 || value | 0) || 0;
          break;
        case 'maxy':
          newMaxY = value && (value.maxY && value.maxY | 0 || value | 0) || 0;
          break;
        case 'rangey':
          newMinY = value && value.minY && value.minY | 0 || 0;
          newMaxY = value && value.maxY && value.maxY | 0 || 0;
          break;
        case 'all':
        default:
          newMinX = value && value.minX && value.minX | 0 || 0;
          newMaxX = value && value.maxX && value.maxX | 0 || 0;
          newMinY = value && value.minY && value.minY | 0 || 0;
          newMaxY = value && value.maxY && value.maxY | 0 || 0;
          break;
      }
      if (newMinX != null && minX !== newMinX) {
        minX = newMinX;
        rangeX = maxX - minX;
      }
      if (newMaxX != null && maxX !== newMaxX) {
        maxX = newMaxX;
        rangeX = maxX - minX;
      }
      if (newMinY != null && minY !== newMinY) {
        minY = newMinY;
        rangeY = maxY - minY;
      }
      if (newMaxY != null && maxY !== newMaxY) {
        maxY = newMaxY;
        rangeY = maxY - minY;
      }
    }
    function bind(callback) {
      if (typeof callback === 'function') changeEvents.push(callback);
    }
    function unbind(callback) {
      if (typeof callback !== 'function') return;
      var i = void 0;
      while (i = changeEvents.includes(callback)) {
        changeEvents.splice(i, 1);
      }
    }
    function destroy() {
      // unbind all possible events and null objects
      $(document).unbind('mouseup', mouseUp).unbind('mousemove', mouseMove);
      bar.unbind('mousedown', mouseDown);
      bar = null;
      arrow = null;
      changeEvents = null;
    }
    var offset = void 0,
        timeout = void 0,
        x = 0,
        y = 0,
        minX = 0,
        maxX = 100,
        rangeX = 100,
        minY = 0,
        maxY = 100,
        rangeY = 100,
        arrow = bar.find('img:first'),
        // the arrow image to drag
    changeEvents = [];

    $.extend(true, $this, // public properties, methods, and event bindings - these we need to access from other controls
    {
      val: val,
      range: range,
      bind: bind,
      unbind: unbind,
      destroy: destroy
    });
    // initialize this control
    arrow.src = options.arrow && options.arrow.image;
    arrow.w = options.arrow && options.arrow.width || arrow.width();
    arrow.h = options.arrow && options.arrow.height || arrow.height();
    bar.w = options.map && options.map.width || bar.width();
    bar.h = options.map && options.map.height || bar.height();
    // bind mousedown event
    bar.bind('mousedown', mouseDown);
    bind.call($this, draw);
  }
  // controls for all the input elements for the typing in color values
  function ColorValuePicker(picker, color, bindedHex, alphaPrecision) {
    var $this = this; // private properties and methods
    var inputs = picker.find('td.Text input');
    // input box key down - use arrows to alter color
    function keyDown(e) {
      if (e.target.value === '' && e.target !== hex.get(0) && (bindedHex != null && e.target !== bindedHex.get(0) || bindedHex == null)) return;
      if (!validateKey(e)) return e;
      switch (e.target) {
        case red.get(0):
          switch (e.keyCode) {
            case 38:
              red.val(setValueInRange.call($this, (red.val() << 0) + 1, 0, 255));
              color.val('r', red.val(), e.target);
              return false;
            case 40:
              red.val(setValueInRange.call($this, (red.val() << 0) - 1, 0, 255));
              color.val('r', red.val(), e.target);
              return false;
          }
          break;
        case green.get(0):
          switch (e.keyCode) {
            case 38:
              green.val(setValueInRange.call($this, (green.val() << 0) + 1, 0, 255));
              color.val('g', green.val(), e.target);
              return false;
            case 40:
              green.val(setValueInRange.call($this, (green.val() << 0) - 1, 0, 255));
              color.val('g', green.val(), e.target);
              return false;
          }
          break;
        case blue.get(0):
          switch (e.keyCode) {
            case 38:
              blue.val(setValueInRange.call($this, (blue.val() << 0) + 1, 0, 255));
              color.val('b', blue.val(), e.target);
              return false;
            case 40:
              blue.val(setValueInRange.call($this, (blue.val() << 0) - 1, 0, 255));
              color.val('b', blue.val(), e.target);
              return false;
          }
          break;
        case alpha && alpha.get(0):
          switch (e.keyCode) {
            case 38:
              alpha.val(setValueInRange.call($this, parseFloat(alpha.val()) + 1, 0, 100));
              color.val('a', Math.precision(alpha.val() * 255 / 100, alphaPrecision), e.target);
              return false;
            case 40:
              alpha.val(setValueInRange.call($this, parseFloat(alpha.val()) - 1, 0, 100));
              color.val('a', Math.precision(alpha.val() * 255 / 100, alphaPrecision), e.target);
              return false;
          }
          break;
        case hue.get(0):
          switch (e.keyCode) {
            case 38:
              hue.val(setValueInRange.call($this, (hue.val() << 0) + 1, 0, 360));
              color.val('h', hue.val(), e.target);
              return false;
            case 40:
              hue.val(setValueInRange.call($this, (hue.val() << 0) - 1, 0, 360));
              color.val('h', hue.val(), e.target);
              return false;
          }
          break;
        case saturation.get(0):
          switch (e.keyCode) {
            case 38:
              saturation.val(setValueInRange.call($this, (saturation.val() << 0) + 1, 0, 100));
              color.val('s', saturation.val(), e.target);
              return false;
            case 40:
              saturation.val(setValueInRange.call($this, (saturation.val() << 0) - 1, 0, 100));
              color.val('s', saturation.val(), e.target);
              return false;
          }
          break;
        case value.get(0):
          switch (e.keyCode) {
            case 38:
              value.val(setValueInRange.call($this, (value.val() << 0) + 1, 0, 100));
              color.val('v', value.val(), e.target);
              return false;
            case 40:
              value.val(setValueInRange.call($this, (value.val() << 0) - 1, 0, 100));
              color.val('v', value.val(), e.target);
              return false;
          }
          break;
      }
    }
    // input box key up - validate value and set color
    function keyUp(e) {
      if (e.target.value === '' && e.target !== hex.get(0) && (bindedHex != null && e.target !== bindedHex.get(0) || bindedHex == null)) return;
      if (!validateKey(e)) return e;
      switch (e.target) {
        case red.get(0):
          red.val(setValueInRange.call($this, red.val(), 0, 255));
          color.val('r', red.val(), e.target);
          break;
        case green.get(0):
          green.val(setValueInRange.call($this, green.val(), 0, 255));
          color.val('g', green.val(), e.target);
          break;
        case blue.get(0):
          blue.val(setValueInRange.call($this, blue.val(), 0, 255));
          color.val('b', blue.val(), e.target);
          break;
        case alpha && alpha.get(0):
          alpha.val(setValueInRange.call($this, alpha.val(), 0, 100));
          color.val('a', Math.precision(alpha.val() * 255 / 100, alphaPrecision), e.target);
          break;
        case hue.get(0):
          hue.val(setValueInRange.call($this, hue.val(), 0, 360));
          color.val('h', hue.val(), e.target);
          break;
        case saturation.get(0):
          saturation.val(setValueInRange.call($this, saturation.val(), 0, 100));
          color.val('s', saturation.val(), e.target);
          break;
        case value.get(0):
          value.val(setValueInRange.call($this, value.val(), 0, 100));
          color.val('v', value.val(), e.target);
          break;
        case hex.get(0):
          hex.val(hex.val().replace(/[^a-fA-F0-9]/g, '').toLowerCase().substring(0, 6));
          bindedHex && bindedHex.val(hex.val());
          color.val('hex', hex.val() !== '' ? hex.val() : null, e.target);
          break;
        case bindedHex && bindedHex.get(0):
          bindedHex.val(bindedHex.val().replace(/[^a-fA-F0-9]/g, '').toLowerCase().substring(0, 6));
          hex.val(bindedHex.val());
          color.val('hex', bindedHex.val() !== '' ? bindedHex.val() : null, e.target);
          break;
        case ahex && ahex.get(0):
          ahex.val(ahex.val().replace(/[^a-fA-F0-9]/g, '').toLowerCase().substring(0, 2));
          color.val('a', ahex.val() != null ? parseInt(ahex.val(), 16) : null, e.target);
          break;
      }
    }
    // input box blur - reset to original if value empty
    function blur(e) {
      if (color.val() != null) {
        switch (e.target) {
          case red.get(0):
            red.val(color.val('r'));break;
          case green.get(0):
            green.val(color.val('g'));break;
          case blue.get(0):
            blue.val(color.val('b'));break;
          case alpha && alpha.get(0):
            alpha.val(Math.precision(color.val('a') * 100 / 255, alphaPrecision));break;
          case hue.get(0):
            hue.val(color.val('h'));break;
          case saturation.get(0):
            saturation.val(color.val('s'));break;
          case value.get(0):
            value.val(color.val('v'));break;
          case hex.get(0):
          case bindedHex && bindedHex.get(0):
            hex.val(color.val('hex'));
            bindedHex && bindedHex.val(color.val('hex'));
            break;
          case ahex && ahex.get(0):
            ahex.val(color.val('ahex').substring(6));break;
        }
      }
    }
    function validateKey(e) {
      switch (e.keyCode) {
        case 9:
        case 16:
        case 29:
        case 37:
        case 39:
          return false;
        case 'c'.charCodeAt():
        case 'v'.charCodeAt():
          if (e.ctrlKey) return false;
      }
      return true;
    }
    // constrain value within range
    function setValueInRange(value, min, max) {
      if (value === '' || isNaN(value)) return min;
      if (value > max) return max;
      if (value < min) return min;
      return value;
    }
    function colorChanged(ui, context) {
      var all = ui.val('all');
      if (context !== red.get(0)) red.val(all != null ? all.r : '');
      if (context !== green.get(0)) green.val(all != null ? all.g : '');
      if (context !== blue.get(0)) blue.val(all != null ? all.b : '');
      if (alpha && context !== alpha.get(0)) alpha.val(all != null ? Math.precision(all.a * 100 / 255, alphaPrecision) : '');
      if (context !== hue.get(0)) hue.val(all != null ? all.h : '');
      if (context !== saturation.get(0)) saturation.val(all != null ? all.s : '');
      if (context !== value.get(0)) value.val(all != null ? all.v : '');
      if (context !== hex.get(0) && (bindedHex && context !== bindedHex.get(0) || !bindedHex)) hex.val(all != null ? all.hex : '');
      if (bindedHex && context !== bindedHex.get(0) && context !== hex.get(0)) bindedHex.val(all != null ? all.hex : '');
      if (ahex && context !== ahex.get(0)) ahex.val(all != null ? all.ahex.substring(6) : '');
    }
    function destroy() {
      // unbind all events and null objects
      red.add(green).add(blue).add(alpha).add(hue).add(saturation).add(value).add(hex).add(bindedHex).add(ahex).unbind('keyup', keyUp).unbind('blur', blur);
      red.add(green).add(blue).add(alpha).add(hue).add(saturation).add(value).unbind('keydown', keyDown);
      color.unbind(colorChanged);
      red = null;
      green = null;
      blue = null;
      alpha = null;
      hue = null;
      saturation = null;
      value = null;
      hex = null;
      ahex = null;
    }
    var red = inputs.eq(3),
        green = inputs.eq(4),
        blue = inputs.eq(5),
        alpha = inputs.length > 7 ? inputs.eq(6) : null,
        hue = inputs.eq(0),
        saturation = inputs.eq(1),
        value = inputs.eq(2),
        hex = inputs.eq(inputs.length > 7 ? 7 : 6),
        ahex = inputs.length > 7 ? inputs.eq(8) : null;
    $.extend(true, $this, {
      // public properties and methods
      destroy: destroy
    });
    red.add(green).add(blue).add(alpha).add(hue).add(saturation).add(value).add(hex).add(bindedHex).add(ahex).bind('keyup', keyUp).bind('blur', blur);
    red.add(green).add(blue).add(alpha).add(hue).add(saturation).add(value).bind('keydown', keyDown);
    color.bind(colorChanged);
  }

  $.jPicker = {
    List: [], // array holding references to each active instance of the control
    // color object - we will be able to assign by any color space type or retrieve any color space info
    // we want this public so we can optionally assign new color objects to initial values using inputs other than a string hex value (also supported)
    Color: function Color(init) {
      classCallCheck(this, Color);

      var $this = this;
      function fireChangeEvents(context) {
        for (var i = 0; i < changeEvents.length; i++) {
          changeEvents[i].call($this, $this, context);
        }
      }
      function val(name, value, context) {
        // Kind of ugly
        var set$$1 = Boolean(value);
        if (set$$1 && value.ahex === '') value.ahex = '00000000';
        if (!set$$1) {
          if (name === undefined || name == null || name === '') name = 'all';
          if (r == null) return null;
          switch (name.toLowerCase()) {
            case 'ahex':
              return ColorMethods.rgbaToHex({ r: r, g: g, b: b, a: a });
            case 'hex':
              return val('ahex').substring(0, 6);
            case 'all':
              return { r: r, g: g, b: b, a: a, h: h, s: s, v: v, hex: val.call($this, 'hex'), ahex: val.call($this, 'ahex') };
            default:
              var ret = {};
              for (var i = 0; i < name.length; i++) {
                switch (name.charAt(i)) {
                  case 'r':
                    if (name.length === 1) ret = r;else ret.r = r;
                    break;
                  case 'g':
                    if (name.length === 1) ret = g;else ret.g = g;
                    break;
                  case 'b':
                    if (name.length === 1) ret = b;else ret.b = b;
                    break;
                  case 'a':
                    if (name.length === 1) ret = a;else ret.a = a;
                    break;
                  case 'h':
                    if (name.length === 1) ret = h;else ret.h = h;
                    break;
                  case 's':
                    if (name.length === 1) ret = s;else ret.s = s;
                    break;
                  case 'v':
                    if (name.length === 1) ret = v;else ret.v = v;
                    break;
                }
              }
              return !name.length ? val.call($this, 'all') : ret;
          }
        }
        if (context != null && context === $this) return;
        if (name == null) name = '';

        var changed = false;
        if (value == null) {
          if (r != null) {
            r = null;
            changed = true;
          }
          if (g != null) {
            g = null;
            changed = true;
          }
          if (b != null) {
            b = null;
            changed = true;
          }
          if (a != null) {
            a = null;
            changed = true;
          }
          if (h != null) {
            h = null;
            changed = true;
          }
          if (s != null) {
            s = null;
            changed = true;
          }
          if (v != null) {
            v = null;
            changed = true;
          }
          changed && fireChangeEvents.call($this, context || $this);
          return;
        }
        switch (name.toLowerCase()) {
          case 'ahex':
          case 'hex':
            var _ret = ColorMethods.hexToRgba(value && (value.ahex || value.hex) || value || 'none');
            val.call($this, 'rgba', { r: _ret.r, g: _ret.g, b: _ret.b, a: name === 'ahex' ? _ret.a : a != null ? a : 255 }, context);
            break;
          default:
            if (value && (value.ahex != null || value.hex != null)) {
              val.call($this, 'ahex', value.ahex || value.hex || '00000000', context);
              return;
            }
            var newV = {};
            var rgb = false,
                hsv = false;
            if (value.r !== undefined && !name.includes('r')) name += 'r';
            if (value.g !== undefined && !name.includes('g')) name += 'g';
            if (value.b !== undefined && !name.includes('b')) name += 'b';
            if (value.a !== undefined && !name.includes('a')) name += 'a';
            if (value.h !== undefined && !name.includes('h')) name += 'h';
            if (value.s !== undefined && !name.includes('s')) name += 's';
            if (value.v !== undefined && !name.includes('v')) name += 'v';
            for (var _i = 0; _i < name.length; _i++) {
              switch (name.charAt(_i)) {
                case 'r':
                  if (hsv) continue;
                  rgb = true;
                  newV.r = value && value.r && value.r | 0 || value && value | 0 || 0;
                  if (newV.r < 0) newV.r = 0;else if (newV.r > 255) newV.r = 255;
                  if (r !== newV.r) {
                    r = newV.r;

                    changed = true;
                  }
                  break;
                case 'g':
                  if (hsv) continue;
                  rgb = true;
                  newV.g = value && value.g && value.g | 0 || value && value | 0 || 0;
                  if (newV.g < 0) newV.g = 0;else if (newV.g > 255) newV.g = 255;
                  if (g !== newV.g) {
                    g = newV.g;

                    changed = true;
                  }
                  break;
                case 'b':
                  if (hsv) continue;
                  rgb = true;
                  newV.b = value && value.b && value.b | 0 || value && value | 0 || 0;
                  if (newV.b < 0) newV.b = 0;else if (newV.b > 255) newV.b = 255;
                  if (b !== newV.b) {
                    b = newV.b;

                    changed = true;
                  }
                  break;
                case 'a':
                  newV.a = value && value.a != null ? value.a | 0 : value != null ? value | 0 : 255;
                  if (newV.a < 0) newV.a = 0;else if (newV.a > 255) newV.a = 255;
                  if (a !== newV.a) {
                    a = newV.a;

                    changed = true;
                  }
                  break;
                case 'h':
                  if (rgb) continue;
                  hsv = true;
                  newV.h = value && value.h && value.h | 0 || value && value | 0 || 0;
                  if (newV.h < 0) newV.h = 0;else if (newV.h > 360) newV.h = 360;
                  if (h !== newV.h) {
                    h = newV.h;

                    changed = true;
                  }
                  break;
                case 's':
                  if (rgb) continue;
                  hsv = true;
                  newV.s = value && value.s != null ? value.s | 0 : value != null ? value | 0 : 100;
                  if (newV.s < 0) newV.s = 0;else if (newV.s > 100) newV.s = 100;
                  if (s !== newV.s) {
                    s = newV.s;

                    changed = true;
                  }
                  break;
                case 'v':
                  if (rgb) continue;
                  hsv = true;
                  newV.v = value && value.v != null ? value.v | 0 : value != null ? value | 0 : 100;
                  if (newV.v < 0) newV.v = 0;else if (newV.v > 100) newV.v = 100;
                  if (v !== newV.v) {
                    v = newV.v;

                    changed = true;
                  }
                  break;
              }
            }
            if (changed) {
              if (rgb) {
                r = r || 0;
                g = g || 0;
                b = b || 0;
                var _ret2 = ColorMethods.rgbToHsv({ r: r, g: g, b: b });
                h = _ret2.h;
                s = _ret2.s;
                v = _ret2.v;
              } else if (hsv) {
                h = h || 0;
                s = s != null ? s : 100;
                v = v != null ? v : 100;
                var _ret3 = ColorMethods.hsvToRgb({ h: h, s: s, v: v });
                r = _ret3.r;
                g = _ret3.g;
                b = _ret3.b;
              }
              a = a != null ? a : 255;
              fireChangeEvents.call($this, context || $this);
            }
            break;
        }
      }
      function bind(callback) {
        if (typeof callback === 'function') changeEvents.push(callback);
      }
      function unbind(callback) {
        if (typeof callback !== 'function') return;
        var i = void 0;
        while (i = changeEvents.includes(callback)) {
          changeEvents.splice(i, 1);
        }
      }
      function destroy() {
        changeEvents = null;
      }
      var r = void 0,
          g = void 0,
          b = void 0,
          a = void 0,
          h = void 0,
          s = void 0,
          v = void 0,
          changeEvents = [];

      $.extend(true, $this, {
        // public properties and methods
        val: val,
        bind: bind,
        unbind: unbind,
        destroy: destroy
      });
      if (init) {
        if (init.ahex != null) {
          val('ahex', init);
        } else if (init.hex != null) {
          val((init.a != null ? 'a' : '') + 'hex', init.a != null ? { ahex: init.hex + ColorMethods.intToHex(init.a) } : init);
        } else if (init.r != null && init.g != null && init.b != null) {
          val('rgb' + (init.a != null ? 'a' : ''), init);
        } else if (init.h != null && init.s != null && init.v != null) {
          val('hsv' + (init.a != null ? 'a' : ''), init);
        }
      }
    },
    // color conversion methods  - make public to give use to external scripts
    ColorMethods: {
      hexToRgba: function hexToRgba(hex) {
        if (hex === '' || hex === 'none') return { r: null, g: null, b: null, a: null };
        hex = this.validateHex(hex);
        var r = '00',
            g = '00',
            b = '00',
            a = '255';
        if (hex.length === 6) hex += 'ff';
        if (hex.length > 6) {
          r = hex.substring(0, 2);
          g = hex.substring(2, 4);
          b = hex.substring(4, 6);
          a = hex.substring(6, hex.length);
        } else {
          if (hex.length > 4) {
            r = hex.substring(4, hex.length);
            hex = hex.substring(0, 4);
          }
          if (hex.length > 2) {
            g = hex.substring(2, hex.length);
            hex = hex.substring(0, 2);
          }
          if (hex.length > 0) b = hex.substring(0, hex.length);
        }
        return { r: this.hexToInt(r), g: this.hexToInt(g), b: this.hexToInt(b), a: this.hexToInt(a) };
      },
      validateHex: function validateHex(hex) {
        // if (typeof hex === 'object') return '';
        hex = hex.toLowerCase().replace(/[^a-f0-9]/g, '');
        if (hex.length > 8) hex = hex.substring(0, 8);
        return hex;
      },
      rgbaToHex: function rgbaToHex(rgba) {
        return this.intToHex(rgba.r) + this.intToHex(rgba.g) + this.intToHex(rgba.b) + this.intToHex(rgba.a);
      },
      intToHex: function intToHex(dec) {
        var result = (dec | 0).toString(16);
        if (result.length === 1) result = '0' + result;
        return result.toLowerCase();
      },
      hexToInt: function hexToInt(hex) {
        return parseInt(hex, 16);
      },
      rgbToHsv: function rgbToHsv(rgb) {
        var r = rgb.r / 255,
            g = rgb.g / 255,
            b = rgb.b / 255,
            hsv = { h: 0, s: 0, v: 0 };
        var min = 0,
            max = 0;
        if (r >= g && r >= b) {
          max = r;
          min = g > b ? b : g;
        } else if (g >= b && g >= r) {
          max = g;
          min = r > b ? b : r;
        } else {
          max = b;
          min = g > r ? r : g;
        }
        hsv.v = max;
        hsv.s = max ? (max - min) / max : 0;
        var delta = void 0;
        if (!hsv.s) hsv.h = 0;else {
          delta = max - min;
          if (r === max) hsv.h = (g - b) / delta;else if (g === max) hsv.h = 2 + (b - r) / delta;else hsv.h = 4 + (r - g) / delta;
          hsv.h = parseInt(hsv.h * 60);
          if (hsv.h < 0) hsv.h += 360;
        }
        hsv.s = hsv.s * 100 | 0;
        hsv.v = hsv.v * 100 | 0;
        return hsv;
      },
      hsvToRgb: function hsvToRgb(hsv) {
        var rgb = { r: 0, g: 0, b: 0, a: 100 };
        var h = hsv.h,
            s = hsv.s,
            v = hsv.v;

        if (s === 0) {
          if (v === 0) rgb.r = rgb.g = rgb.b = 0;else rgb.r = rgb.g = rgb.b = v * 255 / 100 | 0;
        } else {
          if (h === 360) h = 0;
          h /= 60;
          s = s / 100;
          v = v / 100;
          var i = h | 0,
              f = h - i,
              p = v * (1 - s),
              q = v * (1 - s * f),
              t = v * (1 - s * (1 - f));
          switch (i) {
            case 0:
              rgb.r = v;
              rgb.g = t;
              rgb.b = p;
              break;
            case 1:
              rgb.r = q;
              rgb.g = v;
              rgb.b = p;
              break;
            case 2:
              rgb.r = p;
              rgb.g = v;
              rgb.b = t;
              break;
            case 3:
              rgb.r = p;
              rgb.g = q;
              rgb.b = v;
              break;
            case 4:
              rgb.r = t;
              rgb.g = p;
              rgb.b = v;
              break;
            case 5:
              rgb.r = v;
              rgb.g = p;
              rgb.b = q;
              break;
          }
          rgb.r = rgb.r * 255 | 0;
          rgb.g = rgb.g * 255 | 0;
          rgb.b = rgb.b * 255 | 0;
        }
        return rgb;
      }
    }
  };
  var _$$jPicker = $.jPicker,
      Color = _$$jPicker.Color,
      List = _$$jPicker.List,
      ColorMethods = _$$jPicker.ColorMethods; // local copies for YUI compressor

  $.fn.jPicker = function (options) {
    var $arguments = arguments;
    return this.each(function () {
      var $this = this,
          settings = $.extend(true, {}, $.fn.jPicker.defaults, options); // local copies for YUI compressor
      if ($($this).get(0).nodeName.toLowerCase() === 'input') {
        // Add color picker icon if binding to an input element and bind the events to the input
        $.extend(true, settings, {
          window: {
            bindToInput: true,
            expandable: true,
            input: $($this)
          }
        });
        if ($($this).val() === '') {
          settings.color.active = new Color({ hex: null });
          settings.color.current = new Color({ hex: null });
        } else if (ColorMethods.validateHex($($this).val())) {
          settings.color.active = new Color({ hex: $($this).val(), a: settings.color.active.val('a') });
          settings.color.current = new Color({ hex: $($this).val(), a: settings.color.active.val('a') });
        }
      }
      if (settings.window.expandable) {
        $($this).after('<span class="jPicker"><span class="Icon"><span class="Color">&nbsp;</span><span class="Alpha">&nbsp;</span><span class="Image" title="Click To Open Color Picker">&nbsp;</span><span class="Container">&nbsp;</span></span></span>');
      } else {
        settings.window.liveUpdate = false; // Basic control binding for inline use - You will need to override the liveCallback or commitCallback function to retrieve results
      }
      var isLessThanIE7 = parseFloat(navigator.appVersion.split('MSIE')[1]) < 7 && document.body.filters; // needed to run the AlphaImageLoader function for IE6
      // set color mode and update visuals for the new color mode
      function setColorMode(colorMode) {
        var active = color.active,
            hex = active.val('hex');
        var rgbMap = void 0,
            rgbBar = void 0;
        settings.color.mode = colorMode;
        switch (colorMode) {
          case 'h':
            setTimeout(function () {
              setBG.call($this, colorMapDiv, 'transparent');
              setImgLoc.call($this, colorMapL1, 0);
              setAlpha.call($this, colorMapL1, 100);
              setImgLoc.call($this, colorMapL2, 260);
              setAlpha.call($this, colorMapL2, 100);
              setBG.call($this, colorBarDiv, 'transparent');
              setImgLoc.call($this, colorBarL1, 0);
              setAlpha.call($this, colorBarL1, 100);
              setImgLoc.call($this, colorBarL2, 260);
              setAlpha.call($this, colorBarL2, 100);
              setImgLoc.call($this, colorBarL3, 260);
              setAlpha.call($this, colorBarL3, 100);
              setImgLoc.call($this, colorBarL4, 260);
              setAlpha.call($this, colorBarL4, 100);
              setImgLoc.call($this, colorBarL6, 260);
              setAlpha.call($this, colorBarL6, 100);
            }, 0);
            colorMap.range('all', { minX: 0, maxX: 100, minY: 0, maxY: 100 });
            colorBar.range('rangeY', { minY: 0, maxY: 360 });
            if (active.val('ahex') == null) break;
            colorMap.val('xy', { x: active.val('s'), y: 100 - active.val('v') }, colorMap);
            colorBar.val('y', 360 - active.val('h'), colorBar);
            break;
          case 's':
            setTimeout(function () {
              setBG.call($this, colorMapDiv, 'transparent');
              setImgLoc.call($this, colorMapL1, -260);
              setImgLoc.call($this, colorMapL2, -520);
              setImgLoc.call($this, colorBarL1, -260);
              setImgLoc.call($this, colorBarL2, -520);
              setImgLoc.call($this, colorBarL6, 260);
              setAlpha.call($this, colorBarL6, 100);
            }, 0);
            colorMap.range('all', { minX: 0, maxX: 360, minY: 0, maxY: 100 });
            colorBar.range('rangeY', { minY: 0, maxY: 100 });
            if (active.val('ahex') == null) break;
            colorMap.val('xy', { x: active.val('h'), y: 100 - active.val('v') }, colorMap);
            colorBar.val('y', 100 - active.val('s'), colorBar);
            break;
          case 'v':
            setTimeout(function () {
              setBG.call($this, colorMapDiv, '000000');
              setImgLoc.call($this, colorMapL1, -780);
              setImgLoc.call($this, colorMapL2, 260);
              setBG.call($this, colorBarDiv, hex);
              setImgLoc.call($this, colorBarL1, -520);
              setImgLoc.call($this, colorBarL2, 260);
              setAlpha.call($this, colorBarL2, 100);
              setImgLoc.call($this, colorBarL6, 260);
              setAlpha.call($this, colorBarL6, 100);
            }, 0);
            colorMap.range('all', { minX: 0, maxX: 360, minY: 0, maxY: 100 });
            colorBar.range('rangeY', { minY: 0, maxY: 100 });
            if (active.val('ahex') == null) break;
            colorMap.val('xy', { x: active.val('h'), y: 100 - active.val('s') }, colorMap);
            colorBar.val('y', 100 - active.val('v'), colorBar);
            break;
          case 'r':
            rgbMap = -1040;
            rgbBar = -780;
            colorMap.range('all', { minX: 0, maxX: 255, minY: 0, maxY: 255 });
            colorBar.range('rangeY', { minY: 0, maxY: 255 });
            if (active.val('ahex') == null) break;
            colorMap.val('xy', { x: active.val('b'), y: 255 - active.val('g') }, colorMap);
            colorBar.val('y', 255 - active.val('r'), colorBar);
            break;
          case 'g':
            rgbMap = -1560;
            rgbBar = -1820;
            colorMap.range('all', { minX: 0, maxX: 255, minY: 0, maxY: 255 });
            colorBar.range('rangeY', { minY: 0, maxY: 255 });
            if (active.val('ahex') == null) break;
            colorMap.val('xy', { x: active.val('b'), y: 255 - active.val('r') }, colorMap);
            colorBar.val('y', 255 - active.val('g'), colorBar);
            break;
          case 'b':
            rgbMap = -2080;
            rgbBar = -2860;
            colorMap.range('all', { minX: 0, maxX: 255, minY: 0, maxY: 255 });
            colorBar.range('rangeY', { minY: 0, maxY: 255 });
            if (active.val('ahex') == null) break;
            colorMap.val('xy', { x: active.val('r'), y: 255 - active.val('g') }, colorMap);
            colorBar.val('y', 255 - active.val('b'), colorBar);
            break;
          case 'a':
            setTimeout(function () {
              setBG.call($this, colorMapDiv, 'transparent');
              setImgLoc.call($this, colorMapL1, -260);
              setImgLoc.call($this, colorMapL2, -520);
              setImgLoc.call($this, colorBarL1, 260);
              setImgLoc.call($this, colorBarL2, 260);
              setAlpha.call($this, colorBarL2, 100);
              setImgLoc.call($this, colorBarL6, 0);
              setAlpha.call($this, colorBarL6, 100);
            }, 0);
            colorMap.range('all', { minX: 0, maxX: 360, minY: 0, maxY: 100 });
            colorBar.range('rangeY', { minY: 0, maxY: 255 });
            if (active.val('ahex') == null) break;
            colorMap.val('xy', { x: active.val('h'), y: 100 - active.val('v') }, colorMap);
            colorBar.val('y', 255 - active.val('a'), colorBar);
            break;
          default:
            throw new Error('Invalid Mode');
        }
        switch (colorMode) {
          case 'h':
            break;
          case 's':
          case 'v':
          case 'a':
            setTimeout(function () {
              setAlpha.call($this, colorMapL1, 100);
              setAlpha.call($this, colorBarL1, 100);
              setImgLoc.call($this, colorBarL3, 260);
              setAlpha.call($this, colorBarL3, 100);
              setImgLoc.call($this, colorBarL4, 260);
              setAlpha.call($this, colorBarL4, 100);
            }, 0);
            break;
          case 'r':
          case 'g':
          case 'b':
            setTimeout(function () {
              setBG.call($this, colorMapDiv, 'transparent');
              setBG.call($this, colorBarDiv, 'transparent');
              setAlpha.call($this, colorBarL1, 100);
              setAlpha.call($this, colorMapL1, 100);
              setImgLoc.call($this, colorMapL1, rgbMap);
              setImgLoc.call($this, colorMapL2, rgbMap - 260);
              setImgLoc.call($this, colorBarL1, rgbBar - 780);
              setImgLoc.call($this, colorBarL2, rgbBar - 520);
              setImgLoc.call($this, colorBarL3, rgbBar);
              setImgLoc.call($this, colorBarL4, rgbBar - 260);
              setImgLoc.call($this, colorBarL6, 260);
              setAlpha.call($this, colorBarL6, 100);
            }, 0);
            break;
        }
        if (active.val('ahex') == null) return;
        activeColorChanged.call($this, active);
      }
      // Update color when user changes text values
      function activeColorChanged(ui, context) {
        if (context == null || context !== colorBar && context !== colorMap) positionMapAndBarArrows.call($this, ui, context);
        setTimeout(function () {
          updatePreview.call($this, ui);
          updateMapVisuals.call($this, ui);
          updateBarVisuals.call($this, ui);
        }, 0);
      }
      // user has dragged the ColorMap pointer
      function mapValueChanged(ui, context) {
        var active = color.active;

        if (context !== colorMap && active.val() == null) return;
        var xy = ui.val('all');
        switch (settings.color.mode) {
          case 'h':
            active.val('sv', { s: xy.x, v: 100 - xy.y }, context);
            break;
          case 's':
          case 'a':
            active.val('hv', { h: xy.x, v: 100 - xy.y }, context);
            break;
          case 'v':
            active.val('hs', { h: xy.x, s: 100 - xy.y }, context);
            break;
          case 'r':
            active.val('gb', { g: 255 - xy.y, b: xy.x }, context);
            break;
          case 'g':
            active.val('rb', { r: 255 - xy.y, b: xy.x }, context);
            break;
          case 'b':
            active.val('rg', { r: xy.x, g: 255 - xy.y }, context);
            break;
        }
      }
      // user has dragged the ColorBar slider
      function colorBarValueChanged(ui, context) {
        var active = color.active;

        if (context !== colorBar && active.val() == null) return;
        switch (settings.color.mode) {
          case 'h':
            active.val('h', { h: 360 - ui.val('y') }, context);
            break;
          case 's':
            active.val('s', { s: 100 - ui.val('y') }, context);
            break;
          case 'v':
            active.val('v', { v: 100 - ui.val('y') }, context);
            break;
          case 'r':
            active.val('r', { r: 255 - ui.val('y') }, context);
            break;
          case 'g':
            active.val('g', { g: 255 - ui.val('y') }, context);
            break;
          case 'b':
            active.val('b', { b: 255 - ui.val('y') }, context);
            break;
          case 'a':
            active.val('a', 255 - ui.val('y'), context);
            break;
        }
      }
      // position map and bar arrows to match current color
      function positionMapAndBarArrows(ui, context) {
        if (context !== colorMap) {
          switch (settings.color.mode) {
            case 'h':
              var sv = ui.val('sv');
              colorMap.val('xy', { x: sv != null ? sv.s : 100, y: 100 - (sv != null ? sv.v : 100) }, context);
              break;
            case 's':
            case 'a':
              var hv = ui.val('hv');
              colorMap.val('xy', { x: hv && hv.h || 0, y: 100 - (hv != null ? hv.v : 100) }, context);
              break;
            case 'v':
              var hs = ui.val('hs');
              colorMap.val('xy', { x: hs && hs.h || 0, y: 100 - (hs != null ? hs.s : 100) }, context);
              break;
            case 'r':
              var bg = ui.val('bg');
              colorMap.val('xy', { x: bg && bg.b || 0, y: 255 - (bg && bg.g || 0) }, context);
              break;
            case 'g':
              var br = ui.val('br');
              colorMap.val('xy', { x: br && br.b || 0, y: 255 - (br && br.r || 0) }, context);
              break;
            case 'b':
              var rg = ui.val('rg');
              colorMap.val('xy', { x: rg && rg.r || 0, y: 255 - (rg && rg.g || 0) }, context);
              break;
          }
        }
        if (context !== colorBar) {
          switch (settings.color.mode) {
            case 'h':
              colorBar.val('y', 360 - (ui.val('h') || 0), context);
              break;
            case 's':
              var _s = ui.val('s');
              colorBar.val('y', 100 - (_s != null ? _s : 100), context);
              break;
            case 'v':
              var _v = ui.val('v');
              colorBar.val('y', 100 - (_v != null ? _v : 100), context);
              break;
            case 'r':
              colorBar.val('y', 255 - (ui.val('r') || 0), context);
              break;
            case 'g':
              colorBar.val('y', 255 - (ui.val('g') || 0), context);
              break;
            case 'b':
              colorBar.val('y', 255 - (ui.val('b') || 0), context);
              break;
            case 'a':
              var _a = ui.val('a');
              colorBar.val('y', 255 - (_a != null ? _a : 255), context);
              break;
          }
        }
      }
      function updatePreview(ui) {
        try {
          var all = ui.val('all');
          activePreview.css({ backgroundColor: all && '#' + all.hex || 'transparent' });
          setAlpha.call($this, activePreview, all && Math.precision(all.a * 100 / 255, 4) || 0);
        } catch (e) {}
      }
      function updateMapVisuals(ui) {
        switch (settings.color.mode) {
          case 'h':
            setBG.call($this, colorMapDiv, new Color({ h: ui.val('h') || 0, s: 100, v: 100 }).val('hex'));
            break;
          case 's':
          case 'a':
            var _s2 = ui.val('s');
            setAlpha.call($this, colorMapL2, 100 - (_s2 != null ? _s2 : 100));
            break;
          case 'v':
            var _v2 = ui.val('v');
            setAlpha.call($this, colorMapL1, _v2 != null ? _v2 : 100);
            break;
          case 'r':
            setAlpha.call($this, colorMapL2, Math.precision((ui.val('r') || 0) / 255 * 100, 4));
            break;
          case 'g':
            setAlpha.call($this, colorMapL2, Math.precision((ui.val('g') || 0) / 255 * 100, 4));
            break;
          case 'b':
            setAlpha.call($this, colorMapL2, Math.precision((ui.val('b') || 0) / 255 * 100));
            break;
        }
        var a = ui.val('a');
        setAlpha.call($this, colorMapL3, Math.precision((255 - (a || 0)) * 100 / 255, 4));
      }
      function updateBarVisuals(ui) {
        switch (settings.color.mode) {
          case 'h':
            var _a2 = ui.val('a');
            setAlpha.call($this, colorBarL5, Math.precision((255 - (_a2 || 0)) * 100 / 255, 4));
            break;
          case 's':
            var hva = ui.val('hva'),
                saturatedColor = new Color({ h: hva && hva.h || 0, s: 100, v: hva != null ? hva.v : 100 });
            setBG.call($this, colorBarDiv, saturatedColor.val('hex'));
            setAlpha.call($this, colorBarL2, 100 - (hva != null ? hva.v : 100));
            setAlpha.call($this, colorBarL5, Math.precision((255 - (hva && hva.a || 0)) * 100 / 255, 4));
            break;
          case 'v':
            var hsa = ui.val('hsa'),
                valueColor = new Color({ h: hsa && hsa.h || 0, s: hsa != null ? hsa.s : 100, v: 100 });
            setBG.call($this, colorBarDiv, valueColor.val('hex'));
            setAlpha.call($this, colorBarL5, Math.precision((255 - (hsa && hsa.a || 0)) * 100 / 255, 4));
            break;
          case 'r':
          case 'g':
          case 'b':
            var rgba = ui.val('rgba');
            var hValue = 0,
                vValue = 0;
            if (settings.color.mode === 'r') {
              hValue = rgba && rgba.b || 0;
              vValue = rgba && rgba.g || 0;
            } else if (settings.color.mode === 'g') {
              hValue = rgba && rgba.b || 0;
              vValue = rgba && rgba.r || 0;
            } else if (settings.color.mode === 'b') {
              hValue = rgba && rgba.r || 0;
              vValue = rgba && rgba.g || 0;
            }
            var middle = vValue > hValue ? hValue : vValue;
            setAlpha.call($this, colorBarL2, hValue > vValue ? Math.precision((hValue - vValue) / (255 - vValue) * 100, 4) : 0);
            setAlpha.call($this, colorBarL3, vValue > hValue ? Math.precision((vValue - hValue) / (255 - hValue) * 100, 4) : 0);
            setAlpha.call($this, colorBarL4, Math.precision(middle / 255 * 100, 4));
            setAlpha.call($this, colorBarL5, Math.precision((255 - (rgba && rgba.a || 0)) * 100 / 255, 4));
            break;
          case 'a':
            {
              var _a3 = ui.val('a');
              setBG.call($this, colorBarDiv, ui.val('hex') || '000000');
              setAlpha.call($this, colorBarL5, _a3 != null ? 0 : 100);
              setAlpha.call($this, colorBarL6, _a3 != null ? 100 : 0);
              break;
            }
        }
      }
      function setBG(el, c) {
        el.css({ backgroundColor: c && c.length === 6 && '#' + c || 'transparent' });
      }
      function setImg(img, src) {
        if (isLessThanIE7 && (src.includes('AlphaBar.png') || src.includes('Bars.png') || src.includes('Maps.png'))) {
          img.attr('pngSrc', src);
          img.css({ backgroundImage: 'none', filter: 'progid:DXImageTransform.Microsoft.AlphaImageLoader(src=\'' + src + '\', sizingMethod=\'scale\')' });
        } else img.css({ backgroundImage: 'url(\'' + src + '\')' });
      }
      function setImgLoc(img, y) {
        img.css({ top: y + 'px' });
      }
      function setAlpha(obj, alpha) {
        obj.css({ visibility: alpha > 0 ? 'visible' : 'hidden' });
        if (alpha > 0 && alpha < 100) {
          if (isLessThanIE7) {
            var src = obj.attr('pngSrc');
            if (src != null && (src.includes('AlphaBar.png') || src.includes('Bars.png') || src.includes('Maps.png'))) {
              obj.css({ filter: 'progid:DXImageTransform.Microsoft.AlphaImageLoader(src=\'' + src + '\', sizingMethod=\'scale\') progid:DXImageTransform.Microsoft.Alpha(opacity=' + alpha + ')' });
            } else obj.css({ opacity: Math.precision(alpha / 100, 4) });
          } else obj.css({ opacity: Math.precision(alpha / 100, 4) });
        } else if (alpha === 0 || alpha === 100) {
          if (isLessThanIE7) {
            var _src = obj.attr('pngSrc');
            if (_src != null && (_src.includes('AlphaBar.png') || _src.includes('Bars.png') || _src.includes('Maps.png'))) {
              obj.css({ filter: 'progid:DXImageTransform.Microsoft.AlphaImageLoader(src=\'' + _src + '\', sizingMethod=\'scale\')' });
            } else obj.css({ opacity: '' });
          } else obj.css({ opacity: '' });
        }
      }
      // revert color to original color when opened
      function revertColor() {
        color.active.val('ahex', color.current.val('ahex'));
      }
      // commit the color changes
      function commitColor() {
        color.current.val('ahex', color.active.val('ahex'));
      }
      function radioClicked(e) {
        $(this).parents('tbody:first').find('input:radio[value!="' + e.target.value + '"]').removeAttr('checked');
        setColorMode.call($this, e.target.value);
      }
      function currentClicked() {
        revertColor.call($this);
      }
      function cancelClicked() {
        revertColor.call($this);
        settings.window.expandable && hide.call($this);
        typeof cancelCallback === 'function' && cancelCallback.call($this, color.active, cancelButton);
      }
      function okClicked() {
        commitColor.call($this);
        settings.window.expandable && hide.call($this);
        typeof commitCallback === 'function' && commitCallback.call($this, color.active, okButton);
      }
      function iconImageClicked() {
        show.call($this);
      }
      function currentColorChanged(ui, context) {
        var hex = ui.val('hex');
        currentPreview.css({ backgroundColor: hex && '#' + hex || 'transparent' });
        setAlpha.call($this, currentPreview, Math.precision((ui.val('a') || 0) * 100 / 255, 4));
      }
      function expandableColorChanged(ui, context) {
        var hex = ui.val('hex');
        var va = ui.val('va');
        iconColor.css({ backgroundColor: hex && '#' + hex || 'transparent' });
        setAlpha.call($this, iconAlpha, Math.precision((255 - (va && va.a || 0)) * 100 / 255, 4));
        if (settings.window.bindToInput && settings.window.updateInputColor) {
          settings.window.input.css({
            backgroundColor: hex && '#' + hex || 'transparent',
            color: va == null || va.v > 75 ? '#000000' : '#ffffff'
          });
        }
      }
      function moveBarMouseDown(e) {
        // const {element} = settings.window, // local copies for YUI compressor
        //     {page} = settings.window;
        elementStartX = parseInt(container.css('left'));
        elementStartY = parseInt(container.css('top'));
        pageStartX = e.pageX;
        pageStartY = e.pageY;
        // bind events to document to move window - we will unbind these on mouseup
        $(document).bind('mousemove', documentMouseMove).bind('mouseup', documentMouseUp);
        e.preventDefault(); // prevent attempted dragging of the column
      }
      function documentMouseMove(e) {
        container.css({ left: elementStartX - (pageStartX - e.pageX) + 'px', top: elementStartY - (pageStartY - e.pageY) + 'px' });
        if (settings.window.expandable && !$.support.boxModel) container.prev().css({ left: container.css('left'), top: container.css('top') });
        e.stopPropagation();
        e.preventDefault();
        return false;
      }
      function documentMouseUp(e) {
        $(document).unbind('mousemove', documentMouseMove).unbind('mouseup', documentMouseUp);
        e.stopPropagation();
        e.preventDefault();
        return false;
      }
      function quickPickClicked(e) {
        e.preventDefault();
        e.stopPropagation();
        color.active.val('ahex', $(this).attr('title') || null, e.target);
        return false;
      }
      function show() {
        color.current.val('ahex', color.active.val('ahex'));
        function attachIFrame() {
          if (!settings.window.expandable || $.support.boxModel) return;
          var table = container.find('table:first');
          container.before('<iframe/>');
          container.prev().css({ width: table.width(), height: container.height(), opacity: 0, position: 'absolute', left: container.css('left'), top: container.css('top') });
        }
        if (settings.window.expandable) {
          $(document.body).children('div.jPicker.Container').css({ zIndex: 10 });
          container.css({ zIndex: 20 });
        }
        switch (settings.window.effects.type) {
          case 'fade':
            container.fadeIn(settings.window.effects.speed.show, attachIFrame);
            break;
          case 'slide':
            container.slideDown(settings.window.effects.speed.show, attachIFrame);
            break;
          case 'show':
          default:
            container.show(settings.window.effects.speed.show, attachIFrame);
            break;
        }
      }
      function hide() {
        function removeIFrame() {
          if (settings.window.expandable) container.css({ zIndex: 10 });
          if (!settings.window.expandable || $.support.boxModel) return;
          container.prev().remove();
        }
        switch (settings.window.effects.type) {
          case 'fade':
            container.fadeOut(settings.window.effects.speed.hide, removeIFrame);
            break;
          case 'slide':
            container.slideUp(settings.window.effects.speed.hide, removeIFrame);
            break;
          case 'show':
          default:
            container.hide(settings.window.effects.speed.hide, removeIFrame);
            break;
        }
      }
      function initialize() {
        var win = settings.window,
            popup = win.expandable ? $($this).next().find('.Container:first') : null;
        container = win.expandable ? $('<div/>') : $($this);
        container.addClass('jPicker Container');
        if (win.expandable) container.hide();
        container.get(0).onselectstart = function (event) {
          if (event.target.nodeName.toLowerCase() !== 'input') return false;
        };
        // inject html source code - we are using a single table for this control - I know tables are considered bad, but it takes care of equal height columns and
        // this control really is tabular data, so I believe it is the right move
        var all = color.active.val('all');
        if (win.alphaPrecision < 0) win.alphaPrecision = 0;else if (win.alphaPrecision > 2) win.alphaPrecision = 2;
        var controlHtml = '<table class="jPicker" cellpadding="0" cellspacing="0"><tbody>' + (win.expandable ? '<tr><td class="Move" colspan="5">&nbsp;</td></tr>' : '') + '<tr><td rowspan="9"><h2 class="Title">' + (win.title || localization.text.title) + '</h2><div class="Map"><span class="Map1">&nbsp;</span><span class="Map2">&nbsp;</span><span class="Map3">&nbsp;</span><img src="' + images.clientPath + images.colorMap.arrow.file + '" class="Arrow"/></div></td><td rowspan="9"><div class="Bar"><span class="Map1">&nbsp;</span><span class="Map2">&nbsp;</span><span class="Map3">&nbsp;</span><span class="Map4">&nbsp;</span><span class="Map5">&nbsp;</span><span class="Map6">&nbsp;</span><img src="' + images.clientPath + images.colorBar.arrow.file + '" class="Arrow"/></div></td><td colspan="2" class="Preview">' + localization.text.newColor + '<div><span class="Active" title="' + localization.tooltips.colors.newColor + '">&nbsp;</span><span class="Current" title="' + localization.tooltips.colors.currentColor + '">&nbsp;</span></div>' + localization.text.currentColor + '</td><td rowspan="9" class="Button"><input type="button" class="Ok" value="' + localization.text.ok + '" title="' + localization.tooltips.buttons.ok + '"/><input type="button" class="Cancel" value="' + localization.text.cancel + '" title="' + localization.tooltips.buttons.cancel + '"/><hr/><div class="Grid">&nbsp;</div></td></tr><tr class="Hue"><td class="Radio"><label title="' + localization.tooltips.hue.radio + '"><input type="radio" value="h"' + (settings.color.mode === 'h' ? ' checked="checked"' : '') + '/>H:</label></td><td class="Text"><input type="text" maxlength="3" value="' + (all != null ? all.h : '') + '" title="' + localization.tooltips.hue.textbox + '"/>&nbsp;&deg;</td></tr><tr class="Saturation"><td class="Radio"><label title="' + localization.tooltips.saturation.radio + '"><input type="radio" value="s"' + (settings.color.mode === 's' ? ' checked="checked"' : '') + '/>S:</label></td><td class="Text"><input type="text" maxlength="3" value="' + (all != null ? all.s : '') + '" title="' + localization.tooltips.saturation.textbox + '"/>&nbsp;%</td></tr><tr class="Value"><td class="Radio"><label title="' + localization.tooltips.value.radio + '"><input type="radio" value="v"' + (settings.color.mode === 'v' ? ' checked="checked"' : '') + '/>V:</label><br/><br/></td><td class="Text"><input type="text" maxlength="3" value="' + (all != null ? all.v : '') + '" title="' + localization.tooltips.value.textbox + '"/>&nbsp;%<br/><br/></td></tr><tr class="Red"><td class="Radio"><label title="' + localization.tooltips.red.radio + '"><input type="radio" value="r"' + (settings.color.mode === 'r' ? ' checked="checked"' : '') + '/>R:</label></td><td class="Text"><input type="text" maxlength="3" value="' + (all != null ? all.r : '') + '" title="' + localization.tooltips.red.textbox + '"/></td></tr><tr class="Green"><td class="Radio"><label title="' + localization.tooltips.green.radio + '"><input type="radio" value="g"' + (settings.color.mode === 'g' ? ' checked="checked"' : '') + '/>G:</label></td><td class="Text"><input type="text" maxlength="3" value="' + (all != null ? all.g : '') + '" title="' + localization.tooltips.green.textbox + '"/></td></tr><tr class="Blue"><td class="Radio"><label title="' + localization.tooltips.blue.radio + '"><input type="radio" value="b"' + (settings.color.mode === 'b' ? ' checked="checked"' : '') + '/>B:</label></td><td class="Text"><input type="text" maxlength="3" value="' + (all != null ? all.b : '') + '" title="' + localization.tooltips.blue.textbox + '"/></td></tr><tr class="Alpha"><td class="Radio">' + (win.alphaSupport ? '<label title="' + localization.tooltips.alpha.radio + '"><input type="radio" value="a"' + (settings.color.mode === 'a' ? ' checked="checked"' : '') + '/>A:</label>' : '&nbsp;') + '</td><td class="Text">' + (win.alphaSupport ? '<input type="text" maxlength="' + (3 + win.alphaPrecision) + '" value="' + (all != null ? Math.precision(all.a * 100 / 255, win.alphaPrecision) : '') + '" title="' + localization.tooltips.alpha.textbox + '"/>&nbsp;%' : '&nbsp;') + '</td></tr><tr class="Hex"><td colspan="2" class="Text"><label title="' + localization.tooltips.hex.textbox + '">#:<input type="text" maxlength="6" class="Hex" value="' + (all != null ? all.hex : '') + '"/></label>' + (win.alphaSupport ? '<input type="text" maxlength="2" class="AHex" value="' + (all != null ? all.ahex.substring(6) : '') + '" title="' + localization.tooltips.hex.alpha + '"/></td>' : '&nbsp;') + '</tr></tbody></table>';
        if (win.expandable) {
          container.html(controlHtml);
          if (!$(document.body).children('div.jPicker.Container').length) {
            $(document.body).prepend(container);
          } else {
            $(document.body).children('div.jPicker.Container:last').after(container);
          }
          container.mousedown(function () {
            $(document.body).children('div.jPicker.Container').css({ zIndex: 10 });
            container.css({ zIndex: 20 });
          });
          container.css( // positions must be set and display set to absolute before source code injection or IE will size the container to fit the window
          {
            left: win.position.x === 'left' ? popup.offset().left - 530 - (win.position.y === 'center' ? 25 : 0) + 'px' : win.position.x === 'center' ? popup.offset().left - 260 + 'px' : win.position.x === 'right' ? popup.offset().left - 10 + (win.position.y === 'center' ? 25 : 0) + 'px' : win.position.x === 'screenCenter' ? ($(document).width() >> 1) - 260 + 'px' : popup.offset().left + parseInt(win.position.x) + 'px',
            position: 'absolute',
            top: win.position.y === 'top' ? popup.offset().top - 312 + 'px' : win.position.y === 'center' ? popup.offset().top - 156 + 'px' : win.position.y === 'bottom' ? popup.offset().top + 25 + 'px' : popup.offset().top + parseInt(win.position.y) + 'px'
          });
        } else {
          container = $($this);
          container.html(controlHtml);
        }
        // initialize the objects to the source code just injected
        var tbody = container.find('tbody:first');
        colorMapDiv = tbody.find('div.Map:first');
        colorBarDiv = tbody.find('div.Bar:first');
        var MapMaps = colorMapDiv.find('span');
        var BarMaps = colorBarDiv.find('span');
        colorMapL1 = MapMaps.filter('.Map1:first');
        colorMapL2 = MapMaps.filter('.Map2:first');
        colorMapL3 = MapMaps.filter('.Map3:first');
        colorBarL1 = BarMaps.filter('.Map1:first');
        colorBarL2 = BarMaps.filter('.Map2:first');
        colorBarL3 = BarMaps.filter('.Map3:first');
        colorBarL4 = BarMaps.filter('.Map4:first');
        colorBarL5 = BarMaps.filter('.Map5:first');
        colorBarL6 = BarMaps.filter('.Map6:first');
        // create color pickers and maps
        colorMap = new Slider(colorMapDiv, {
          map: {
            width: images.colorMap.width,
            height: images.colorMap.height
          },
          arrow: {
            image: images.clientPath + images.colorMap.arrow.file,
            width: images.colorMap.arrow.width,
            height: images.colorMap.arrow.height
          }
        });
        colorMap.bind(mapValueChanged);
        colorBar = new Slider(colorBarDiv, {
          map: {
            width: images.colorBar.width,
            height: images.colorBar.height
          },
          arrow: {
            image: images.clientPath + images.colorBar.arrow.file,
            width: images.colorBar.arrow.width,
            height: images.colorBar.arrow.height
          }
        });
        colorBar.bind(colorBarValueChanged);
        colorPicker = new ColorValuePicker(tbody, color.active, win.expandable && win.bindToInput ? win.input : null, win.alphaPrecision);
        var hex = all != null ? all.hex : null,
            preview = tbody.find('.Preview'),
            button = tbody.find('.Button');
        activePreview = preview.find('.Active:first').css({ backgroundColor: hex && '#' + hex || 'transparent' });
        currentPreview = preview.find('.Current:first').css({ backgroundColor: hex && '#' + hex || 'transparent' }).bind('click', currentClicked);
        setAlpha.call($this, currentPreview, Math.precision(color.current.val('a') * 100) / 255, 4);
        okButton = button.find('.Ok:first').bind('click', okClicked);
        cancelButton = button.find('.Cancel:first').bind('click', cancelClicked);
        grid = button.find('.Grid:first');
        setTimeout(function () {
          setImg.call($this, colorMapL1, images.clientPath + 'Maps.png');
          setImg.call($this, colorMapL2, images.clientPath + 'Maps.png');
          setImg.call($this, colorMapL3, images.clientPath + 'map-opacity.png');
          setImg.call($this, colorBarL1, images.clientPath + 'Bars.png');
          setImg.call($this, colorBarL2, images.clientPath + 'Bars.png');
          setImg.call($this, colorBarL3, images.clientPath + 'Bars.png');
          setImg.call($this, colorBarL4, images.clientPath + 'Bars.png');
          setImg.call($this, colorBarL5, images.clientPath + 'bar-opacity.png');
          setImg.call($this, colorBarL6, images.clientPath + 'AlphaBar.png');
          setImg.call($this, preview.find('div:first'), images.clientPath + 'preview-opacity.png');
        }, 0);
        tbody.find('td.Radio input').bind('click', radioClicked);
        // initialize quick list
        if (color.quickList && color.quickList.length > 0) {
          var html = '';
          for (var i = 0; i < color.quickList.length; i++) {
            /* if default colors are hex strings, change them to color objects */
            if (_typeof(color.quickList[i]).toString().toLowerCase() === 'string') color.quickList[i] = new Color({ hex: color.quickList[i] });
            var alpha = color.quickList[i].val('a');
            var ahex = color.quickList[i].val('ahex');
            if (!win.alphaSupport && ahex) ahex = ahex.substring(0, 6) + 'ff';
            var quickHex = color.quickList[i].val('hex');
            if (!ahex) ahex = '00000000';
            html += '<span class="QuickColor"' + (ahex && ' title="#' + ahex + '"' || 'none') + ' style="background-color:' + (quickHex && '#' + quickHex || '') + ';' + (quickHex ? '' : 'background-image:url(' + images.clientPath + 'NoColor.png)') + (win.alphaSupport && alpha && alpha < 255 ? ';opacity:' + Math.precision(alpha / 255, 4) + ';filter:Alpha(opacity=' + Math.precision(alpha / 2.55, 4) + ')' : '') + '">&nbsp;</span>';
          }
          setImg.call($this, grid, images.clientPath + 'bar-opacity.png');
          grid.html(html);
          grid.find('.QuickColor').click(quickPickClicked);
        }
        setColorMode.call($this, settings.color.mode);
        color.active.bind(activeColorChanged);
        typeof liveCallback === 'function' && color.active.bind(liveCallback);
        color.current.bind(currentColorChanged);
        // bind to input
        if (win.expandable) {
          $this.icon = popup.parents('.Icon:first');
          iconColor = $this.icon.find('.Color:first').css({ backgroundColor: hex && '#' + hex || 'transparent' });
          iconAlpha = $this.icon.find('.Alpha:first');
          setImg.call($this, iconAlpha, images.clientPath + 'bar-opacity.png');
          setAlpha.call($this, iconAlpha, Math.precision((255 - (all != null ? all.a : 0)) * 100 / 255, 4));
          iconImage = $this.icon.find('.Image:first').css({
            backgroundImage: 'url(\'' + images.clientPath + images.picker.file + '\')'
          }).bind('click', iconImageClicked);
          if (win.bindToInput && win.updateInputColor) {
            win.input.css({
              backgroundColor: hex && '#' + hex || 'transparent',
              color: all == null || all.v > 75 ? '#000000' : '#ffffff'
            });
          }
          moveBar = tbody.find('.Move:first').bind('mousedown', moveBarMouseDown);
          color.active.bind(expandableColorChanged);
        } else show.call($this);
      }
      function destroy() {
        container.find('td.Radio input').unbind('click', radioClicked);
        currentPreview.unbind('click', currentClicked);
        cancelButton.unbind('click', cancelClicked);
        okButton.unbind('click', okClicked);
        if (settings.window.expandable) {
          iconImage.unbind('click', iconImageClicked);
          moveBar.unbind('mousedown', moveBarMouseDown);
          $this.icon = null;
        }
        container.find('.QuickColor').unbind('click', quickPickClicked);
        colorMapDiv = null;
        colorBarDiv = null;
        colorMapL1 = null;
        colorMapL2 = null;
        colorMapL3 = null;
        colorBarL1 = null;
        colorBarL2 = null;
        colorBarL3 = null;
        colorBarL4 = null;
        colorBarL5 = null;
        colorBarL6 = null;
        colorMap.destroy();
        colorMap = null;
        colorBar.destroy();
        colorBar = null;
        colorPicker.destroy();
        colorPicker = null;
        activePreview = null;
        currentPreview = null;
        okButton = null;
        cancelButton = null;
        grid = null;
        commitCallback = null;
        cancelCallback = null;
        liveCallback = null;
        container.html('');
        for (var i = 0; i < List.length; i++) {
          if (List[i] === $this) {
            List.splice(i, 1);
          }
        }
      }
      var images = settings.images,
          localization = settings.localization; // local copies for YUI compressor

      var color = {
        active: _typeof(settings.color.active).toString().toLowerCase() === 'string' ? new Color({ ahex: !settings.window.alphaSupport && settings.color.active ? settings.color.active.substring(0, 6) + 'ff' : settings.color.active
        }) : new Color({ ahex: !settings.window.alphaSupport && settings.color.active.val('ahex') ? settings.color.active.val('ahex').substring(0, 6) + 'ff' : settings.color.active.val('ahex')
        }),
        current: _typeof(settings.color.active).toString().toLowerCase() === 'string' ? new Color({ ahex: !settings.window.alphaSupport && settings.color.active ? settings.color.active.substring(0, 6) + 'ff' : settings.color.active }) : new Color({ ahex: !settings.window.alphaSupport && settings.color.active.val('ahex') ? settings.color.active.val('ahex').substring(0, 6) + 'ff' : settings.color.active.val('ahex')
        }),
        quickList: settings.color.quickList
      };

      var elementStartX = null,
          // Used to record the starting css positions for dragging the control
      elementStartY = null,
          pageStartX = null,
          // Used to record the mousedown coordinates for dragging the control
      pageStartY = null,
          container = null,
          colorMapDiv = null,
          colorBarDiv = null,
          colorMapL1 = null,
          // different layers of colorMap and colorBar
      colorMapL2 = null,
          colorMapL3 = null,
          colorBarL1 = null,
          colorBarL2 = null,
          colorBarL3 = null,
          colorBarL4 = null,
          colorBarL5 = null,
          colorBarL6 = null,
          colorMap = null,
          // color maps
      colorBar = null,
          colorPicker = null,
          activePreview = null,
          // color boxes above the radio buttons
      currentPreview = null,
          okButton = null,
          cancelButton = null,
          grid = null,
          // preset colors grid
      iconColor = null,
          // iconColor for popup icon
      iconAlpha = null,
          // iconAlpha for popup icon
      iconImage = null,
          // iconImage popup icon
      moveBar = null,
          // drag bar
      commitCallback = typeof $arguments[1] === 'function' ? $arguments[1] : null,
          liveCallback = typeof $arguments[2] === 'function' ? $arguments[2] : null,
          cancelCallback = typeof $arguments[3] === 'function' ? $arguments[3] : null;

      $.extend(true, $this, {
        // public properties, methods, and callbacks
        commitCallback: commitCallback, // commitCallback function can be overridden to return the selected color to a method you specify when the user clicks "OK"
        liveCallback: liveCallback, // liveCallback function can be overridden to return the selected color to a method you specify in live mode (continuous update)
        cancelCallback: cancelCallback, // cancelCallback function can be overridden to a method you specify when the user clicks "Cancel"
        color: color,
        show: show,
        hide: hide,
        destroy: destroy // destroys this control entirely, removing all events and objects, and removing itself from the List
      });
      List.push($this);
      setTimeout(function () {
        initialize.call($this);
      }, 0);
    });
  };
  /**
  * jPicker defaults - you can change anything in this section (such as the
  * clientPath to your images) without fear of breaking the program
  */
  $.fn.jPicker.defaults = {
    window: {
      title: null, /* any title for the jPicker window itself - displays "Drag Markers To Pick A Color" if left null */
      effects: {
        type: 'slide', /* effect used to show/hide an expandable picker. Acceptable values "slide", "show", "fade" */
        speed: {
          show: 'slow', /* duration of "show" effect. Acceptable values are "fast", "slow", or time in ms */
          hide: 'fast' /* duration of "hide" effect. Acceptable values are "fast", "slow", or time in ms */
        }
      },
      position: {
        x: 'screenCenter', /* acceptable values "left", "center", "right", "screenCenter", or relative px value */
        y: 'top' /* acceptable values "top", "bottom", "center", or relative px value */
      },
      expandable: false, /* default to large static picker - set to true to make an expandable picker (small icon with popup) - set automatically when binded to input element */
      liveUpdate: true, /* set false if you want the user to have to click "OK" before the binded input box updates values (always "true" for expandable picker) */
      alphaSupport: false, /* set to true to enable alpha picking */
      alphaPrecision: 0, /* set decimal precision for alpha percentage display - hex codes do not map directly to percentage integers - range 0-2 */
      updateInputColor: true /* set to false to prevent binded input colors from changing */
    },
    color: {
      mode: 'h', /* acceptabled values "h" (hue), "s" (saturation), "v" (value), "r" (red), "g" (green), "b" (blue), "a" (alpha) */
      active: new Color({ ahex: '#ffcc00ff' }), /* acceptable values are any declared $.jPicker.Color object or string HEX value (e.g. #ffc000) WITH OR WITHOUT the "#" prefix */
      // the quick pick color list
      quickList: [new Color({ h: 360, s: 33, v: 100 }), /* acceptable values are any declared $.jPicker.Color object or string HEX value (e.g. #ffc000) WITH OR WITHOUT the "#" prefix */
      new Color({ h: 360, s: 66, v: 100 }), new Color({ h: 360, s: 100, v: 100 }), new Color({ h: 360, s: 100, v: 75 }), new Color({ h: 360, s: 100, v: 50 }), new Color({ h: 180, s: 0, v: 100 }), new Color({ h: 30, s: 33, v: 100 }), new Color({ h: 30, s: 66, v: 100 }), new Color({ h: 30, s: 100, v: 100 }), new Color({ h: 30, s: 100, v: 75 }), new Color({ h: 30, s: 100, v: 50 }), new Color({ h: 180, s: 0, v: 90 }), new Color({ h: 60, s: 33, v: 100 }), new Color({ h: 60, s: 66, v: 100 }), new Color({ h: 60, s: 100, v: 100 }), new Color({ h: 60, s: 100, v: 75 }), new Color({ h: 60, s: 100, v: 50 }), new Color({ h: 180, s: 0, v: 80 }), new Color({ h: 90, s: 33, v: 100 }), new Color({ h: 90, s: 66, v: 100 }), new Color({ h: 90, s: 100, v: 100 }), new Color({ h: 90, s: 100, v: 75 }), new Color({ h: 90, s: 100, v: 50 }), new Color({ h: 180, s: 0, v: 70 }), new Color({ h: 120, s: 33, v: 100 }), new Color({ h: 120, s: 66, v: 100 }), new Color({ h: 120, s: 100, v: 100 }), new Color({ h: 120, s: 100, v: 75 }), new Color({ h: 120, s: 100, v: 50 }), new Color({ h: 180, s: 0, v: 60 }), new Color({ h: 150, s: 33, v: 100 }), new Color({ h: 150, s: 66, v: 100 }), new Color({ h: 150, s: 100, v: 100 }), new Color({ h: 150, s: 100, v: 75 }), new Color({ h: 150, s: 100, v: 50 }), new Color({ h: 180, s: 0, v: 50 }), new Color({ h: 180, s: 33, v: 100 }), new Color({ h: 180, s: 66, v: 100 }), new Color({ h: 180, s: 100, v: 100 }), new Color({ h: 180, s: 100, v: 75 }), new Color({ h: 180, s: 100, v: 50 }), new Color({ h: 180, s: 0, v: 40 }), new Color({ h: 210, s: 33, v: 100 }), new Color({ h: 210, s: 66, v: 100 }), new Color({ h: 210, s: 100, v: 100 }), new Color({ h: 210, s: 100, v: 75 }), new Color({ h: 210, s: 100, v: 50 }), new Color({ h: 180, s: 0, v: 30 }), new Color({ h: 240, s: 33, v: 100 }), new Color({ h: 240, s: 66, v: 100 }), new Color({ h: 240, s: 100, v: 100 }), new Color({ h: 240, s: 100, v: 75 }), new Color({ h: 240, s: 100, v: 50 }), new Color({ h: 180, s: 0, v: 20 }), new Color({ h: 270, s: 33, v: 100 }), new Color({ h: 270, s: 66, v: 100 }), new Color({ h: 270, s: 100, v: 100 }), new Color({ h: 270, s: 100, v: 75 }), new Color({ h: 270, s: 100, v: 50 }), new Color({ h: 180, s: 0, v: 10 }), new Color({ h: 300, s: 33, v: 100 }), new Color({ h: 300, s: 66, v: 100 }), new Color({ h: 300, s: 100, v: 100 }), new Color({ h: 300, s: 100, v: 75 }), new Color({ h: 300, s: 100, v: 50 }), new Color({ h: 180, s: 0, v: 0 }), new Color({ h: 330, s: 33, v: 100 }), new Color({ h: 330, s: 66, v: 100 }), new Color({ h: 330, s: 100, v: 100 }), new Color({ h: 330, s: 100, v: 75 }), new Color({ h: 330, s: 100, v: 50 }), new Color()]
    },
    images: {
      clientPath: '/jPicker/images/', /* Path to image files */
      colorMap: {
        width: 256,
        height: 256,
        arrow: {
          file: 'mappoint.gif', /* ColorMap arrow icon */
          width: 15,
          height: 15
        }
      },
      colorBar: {
        width: 20,
        height: 256,
        arrow: {
          file: 'rangearrows.gif', /* ColorBar arrow icon */
          width: 20,
          height: 7
        }
      },
      picker: {
        file: 'picker.gif', /* Color Picker icon */
        width: 25,
        height: 24
      }
    },
    // alter these to change the text presented by the picker (e.g. different language) */
    localization: {
      text: {
        title: 'Drag Markers To Pick A Color',
        newColor: 'new',
        currentColor: 'current',
        ok: 'OK',
        cancel: 'Cancel'
      },
      tooltips: {
        colors: {
          newColor: 'New Color - Press &ldquo;OK&rdquo; To Commit',
          currentColor: 'Click To Revert To Original Color'
        },
        buttons: {
          ok: 'Commit To This Color Selection',
          cancel: 'Cancel And Revert To Original Color'
        },
        hue: {
          radio: 'Set To &ldquo;Hue&rdquo; Color Mode',
          textbox: 'Enter A &ldquo;Hue&rdquo; Value (0-360&deg;)'
        },
        saturation: {
          radio: 'Set To &ldquo;Saturation&rdquo; Color Mode',
          textbox: 'Enter A &ldquo;Saturation&rdquo; Value (0-100%)'
        },
        value: {
          radio: 'Set To &ldquo;Value&rdquo; Color Mode',
          textbox: 'Enter A &ldquo;Value&rdquo; Value (0-100%)'
        },
        red: {
          radio: 'Set To &ldquo;Red&rdquo; Color Mode',
          textbox: 'Enter A &ldquo;Red&rdquo; Value (0-255)'
        },
        green: {
          radio: 'Set To &ldquo;Green&rdquo; Color Mode',
          textbox: 'Enter A &ldquo;Green&rdquo; Value (0-255)'
        },
        blue: {
          radio: 'Set To &ldquo;Blue&rdquo; Color Mode',
          textbox: 'Enter A &ldquo;Blue&rdquo; Value (0-255)'
        },
        alpha: {
          radio: 'Set To &ldquo;Alpha&rdquo; Color Mode',
          textbox: 'Enter A &ldquo;Alpha&rdquo; Value (0-100)'
        },
        hex: {
          textbox: 'Enter A &ldquo;Hex&rdquo; Color Value (#000000-#ffffff)',
          alpha: 'Enter A &ldquo;Alpha&rdquo; Value (#00-#ff)'
        }
      }
    }
  };
  return $;
};

/* globals jQuery */

var $$a = jQuery;

var langParam = void 0;
function setStrings(type, obj, ids) {
  // Root element to look for element from
  var parent = $$a('#svg_editor').parent();
  Object.entries(obj).forEach(function (_ref) {
    var _ref2 = slicedToArray(_ref, 2),
        sel = _ref2[0],
        val = _ref2[1];

    if (!val) {
      console.log(sel);
    }

    if (ids) {
      sel = '#' + sel;
    }
    var $elem = parent.find(sel);
    if ($elem.length) {
      var elem = parent.find(sel)[0];

      switch (type) {
        case 'content':
          for (var i = 0, node; node = elem.childNodes[i]; i++) {
            if (node.nodeType === 3 && node.textContent.trim()) {
              node.textContent = val;
              break;
            }
          }
          break;

        case 'title':
          elem.title = val;
          break;
      }
    } else {
      console.log('Missing: ' + sel);
    }
  });
}

var editor_ = void 0;
var init$7 = function init(editor) {
  editor_ = editor;
};

var readLang = function readLang(langData) {
  var more = editor_.addLangData(langParam);
  $$a.each(more, function (i, m) {
    if (m.data) {
      langData = $$a.merge(langData, m.data);
    }
  });

  // Old locale file, do nothing for now.
  if (!langData.tools) {
    return;
  }

  var _langData = langData,
      tools = _langData.tools,
      properties = _langData.properties,
      config = _langData.config,
      layers = _langData.layers,
      common = _langData.common,
      ui = _langData.ui;


  setStrings('content', {
    // copyrightLabel: misc.powered_by, // Currently commented out in svg-editor.html
    curve_segments: properties.curve_segments,
    fitToContent: tools.fitToContent,
    fit_to_all: tools.fit_to_all,
    fit_to_canvas: tools.fit_to_canvas,
    fit_to_layer_content: tools.fit_to_layer_content,
    fit_to_sel: tools.fit_to_sel,

    icon_large: config.icon_large,
    icon_medium: config.icon_medium,
    icon_small: config.icon_small,
    icon_xlarge: config.icon_xlarge,
    image_opt_embed: config.image_opt_embed,
    image_opt_ref: config.image_opt_ref,
    includedImages: config.included_images,

    largest_object: tools.largest_object,

    layersLabel: layers.layers,
    page: tools.page,
    relativeToLabel: tools.relativeTo,
    selLayerLabel: layers.move_elems_to,
    selectedPredefined: config.select_predefined,

    selected_objects: tools.selected_objects,
    smallest_object: tools.smallest_object,
    straight_segments: properties.straight_segments,

    svginfo_bg_url: config.editor_img_url + ':',
    svginfo_bg_note: config.editor_bg_note,
    svginfo_change_background: config.background,
    svginfo_dim: config.doc_dims,
    svginfo_editor_prefs: config.editor_prefs,
    svginfo_height: common.height,
    svginfo_icons: config.icon_size,
    svginfo_image_props: config.image_props,
    svginfo_lang: config.language,
    svginfo_title: config.doc_title,
    svginfo_width: common.width,

    tool_docprops_cancel: common.cancel,
    tool_docprops_save: common.ok,

    tool_source_cancel: common.cancel,
    tool_source_save: common.ok,

    tool_prefs_cancel: common.cancel,
    tool_prefs_save: common.ok,

    sidepanel_handle: layers.layers.split('').join(' '),

    tool_clear: tools.new_doc,
    tool_docprops: tools.docprops,
    tool_export: tools.export_img,
    tool_import: tools.import_doc,
    tool_open: tools.open_doc,
    tool_save: tools.save_doc,

    svginfo_units_rulers: config.units_and_rulers,
    svginfo_rulers_onoff: config.show_rulers,
    svginfo_unit: config.base_unit,

    svginfo_grid_settings: config.grid,
    svginfo_snap_onoff: config.snapping_onoff,
    svginfo_snap_step: config.snapping_stepsize,
    svginfo_grid_color: config.grid_color
  }, true);

  // Shape categories
  var cats = {};
  for (var o in langData.shape_cats) {
    cats['#shape_cats [data-cat="' + o + '"]'] = langData.shape_cats[o];
  }

  // TODO: Find way to make this run after shapelib ext has loaded
  setTimeout(function () {
    setStrings('content', cats);
  }, 2000);

  // Context menus
  var opts = {};
  $$a.each(['cut', 'copy', 'paste', 'paste_in_place', 'delete', 'group', 'ungroup', 'move_front', 'move_up', 'move_down', 'move_back'], function () {
    opts['#cmenu_canvas a[href="#' + this + '"]'] = tools[this];
  });

  $$a.each(['dupe', 'merge_down', 'merge_all'], function () {
    opts['#cmenu_layers a[href="#' + this + '"]'] = layers[this];
  });

  opts['#cmenu_layers a[href="#delete"]'] = layers.del;

  setStrings('content', opts);

  setStrings('title', {
    align_relative_to: tools.align_relative_to,
    circle_cx: properties.circle_cx,
    circle_cy: properties.circle_cy,
    circle_r: properties.circle_r,
    cornerRadiusLabel: properties.corner_radius,
    ellipse_cx: properties.ellipse_cx,
    ellipse_cy: properties.ellipse_cy,
    ellipse_rx: properties.ellipse_rx,
    ellipse_ry: properties.ellipse_ry,
    fill_color: properties.fill_color,
    font_family: properties.font_family,
    idLabel: properties.id,
    image_height: properties.image_height,
    image_url: properties.image_url,
    image_width: properties.image_width,
    layer_delete: layers.del,
    layer_down: layers.move_down,
    layer_new: layers['new'],
    layer_rename: layers.rename,
    layer_moreopts: common.more_opts,
    layer_up: layers.move_up,
    line_x1: properties.line_x1,
    line_x2: properties.line_x2,
    line_y1: properties.line_y1,
    line_y2: properties.line_y2,
    linecap_butt: properties.linecap_butt,
    linecap_round: properties.linecap_round,
    linecap_square: properties.linecap_square,
    linejoin_bevel: properties.linejoin_bevel,
    linejoin_miter: properties.linejoin_miter,
    linejoin_round: properties.linejoin_round,
    main_icon: tools.main_menu,
    mode_connect: tools.mode_connect,
    tools_shapelib_show: tools.mode_shapelib,
    palette: ui.palette_info,
    zoom_panel: ui.zoom_level,
    path_node_x: properties.node_x,
    path_node_y: properties.node_y,
    rect_height_tool: properties.rect_height,
    rect_width_tool: properties.rect_width,
    seg_type: properties.seg_type,
    selLayerNames: layers.move_selected,
    selected_x: properties.pos_x,
    selected_y: properties.pos_y,
    stroke_color: properties.stroke_color,
    stroke_style: properties.stroke_style,
    stroke_width: properties.stroke_width,
    svginfo_title: config.doc_title,
    text: properties.text_contents,
    toggle_stroke_tools: ui.toggle_stroke_tools,
    tool_add_subpath: tools.add_subpath,
    tool_alignbottom: tools.align_bottom,
    tool_aligncenter: tools.align_center,
    tool_alignleft: tools.align_left,
    tool_alignmiddle: tools.align_middle,
    tool_alignright: tools.align_right,
    tool_aligntop: tools.align_top,
    tool_angle: properties.angle,
    tool_blur: properties.blur,
    tool_bold: properties.bold,
    tool_circle: tools.mode_circle,
    tool_clone: tools.clone,
    tool_clone_multi: tools.clone,
    tool_delete: tools.del,
    tool_delete_multi: tools.del,
    tool_ellipse: tools.mode_ellipse,
    tool_eyedropper: tools.mode_eyedropper,
    tool_fhellipse: tools.mode_fhellipse,
    tool_fhpath: tools.mode_fhpath,
    tool_fhrect: tools.mode_fhrect,
    tool_font_size: properties.font_size,
    tool_group_elements: tools.group_elements,
    tool_make_link: tools.make_link,
    tool_link_url: tools.set_link_url,
    tool_image: tools.mode_image,
    tool_italic: properties.italic,
    tool_line: tools.mode_line,
    tool_move_bottom: tools.move_bottom,
    tool_move_top: tools.move_top,
    tool_node_clone: tools.node_clone,
    tool_node_delete: tools.node_delete,
    tool_node_link: tools.node_link,
    tool_opacity: properties.opacity,
    tool_openclose_path: tools.openclose_path,
    tool_path: tools.mode_path,
    tool_position: tools.align_to_page,
    tool_rect: tools.mode_rect,
    tool_redo: tools.redo,
    tool_reorient: tools.reorient_path,
    tool_select: tools.mode_select,
    tool_source: tools.source_save,
    tool_square: tools.mode_square,
    tool_text: tools.mode_text,
    tool_topath: tools.to_path,
    tool_undo: tools.undo,
    tool_ungroup: tools.ungroup,
    tool_wireframe: tools.wireframe_mode,
    view_grid: tools.toggle_grid,
    tool_zoom: tools.mode_zoom,
    url_notice: tools.no_embed

  }, true);

  editor_.setLang(langParam, langData);
};

var putLocale = function () {
  var _ref3 = asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(givenParam, goodLangs, conf) {
    var url;
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            if (givenParam) {
              langParam = givenParam;
            } else {
              langParam = $$a.pref('lang');
              if (!langParam) {
                if (navigator.userLanguage) {
                  // Explorer
                  langParam = navigator.userLanguage;
                } else if (navigator.language) {
                  // FF, Opera, ...
                  langParam = navigator.language;
                }
              }

              console.log('Lang: ' + langParam);

              // Set to English if language is not in list of good langs
              if (!goodLangs.includes(langParam) && langParam !== 'test') {
                langParam = 'en';
              }

              // don't bother on first run if language is English
              // The following line prevents setLang from running
              //    extensions which depend on updated uiStrings,
              //    so commenting it out.
              // if (langParam.startsWith('en')) {return;}
            }

            url = conf.langPath + 'lang.' + langParam + '.js';
            _context.t0 = readLang;
            _context.next = 5;
            return importSetGlobalDefault(url, {
              global: 'svgEditorLang_' + langParam.replace(/-/g, '_')
            });

          case 5:
            _context.t1 = _context.sent;
            return _context.abrupt('return', (0, _context.t0)(_context.t1));

          case 7:
          case 'end':
            return _context.stop();
        }
      }
    }, _callee, this);
  }));

  return function putLocale(_x, _x2, _x3) {
    return _ref3.apply(this, arguments);
  };
}();

function loadStylesheets(stylesheets) {
    var _ref = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {},
        beforeDefault = _ref.before,
        afterDefault = _ref.after,
        faviconDefault = _ref.favicon,
        canvasDefault = _ref.canvas,
        _ref$image = _ref.image,
        imageDefault = _ref$image === undefined ? true : _ref$image,
        acceptErrors = _ref.acceptErrors;

    stylesheets = Array.isArray(stylesheets) ? stylesheets : [stylesheets];

    function setupLink(stylesheetURL) {
        var options = {};
        if (Array.isArray(stylesheetURL)) {
            var _stylesheetURL = stylesheetURL;

            var _stylesheetURL2 = slicedToArray(_stylesheetURL, 2);

            stylesheetURL = _stylesheetURL2[0];
            var _stylesheetURL2$ = _stylesheetURL2[1];
            options = _stylesheetURL2$ === undefined ? {} : _stylesheetURL2$;
        }
        var _options = options,
            _options$favicon = _options.favicon,
            favicon = _options$favicon === undefined ? faviconDefault : _options$favicon;
        var _options2 = options,
            _options2$before = _options2.before,
            before = _options2$before === undefined ? beforeDefault : _options2$before,
            _options2$after = _options2.after,
            after = _options2$after === undefined ? afterDefault : _options2$after,
            _options2$canvas = _options2.canvas,
            canvas = _options2$canvas === undefined ? canvasDefault : _options2$canvas,
            _options2$image = _options2.image,
            image = _options2$image === undefined ? imageDefault : _options2$image;

        function addLink() {
            if (before) {
                before.before(link);
            } else if (after) {
                after.after(link);
            } else {
                document.head.appendChild(link);
            }
        }

        var link = document.createElement('link');
        return new Promise(function (resolve, reject) {
            if (acceptErrors) {
                reject = typeof acceptErrors === 'function' ? function (error) {
                    acceptErrors({ error: error, stylesheetURL: stylesheetURL, options: options, resolve: resolve, reject: reject });
                } : resolve;
            }
            if (stylesheetURL.endsWith('.css')) {
                favicon = false;
            } else if (stylesheetURL.endsWith('.ico')) {
                favicon = true;
            }
            if (favicon) {
                link.rel = 'shortcut icon';
                link.type = 'image/x-icon';

                if (image === false) {
                    link.href = stylesheetURL;
                    addLink();
                    resolve(link);
                    return;
                }

                var cnv = document.createElement('canvas');
                cnv.width = 16;
                cnv.height = 16;
                var context = cnv.getContext('2d');
                var img = document.createElement('img');
                img.addEventListener('error', function (error) {
                    reject(error);
                });
                img.addEventListener('load', function () {
                    context.drawImage(img, 0, 0);
                    link.href = canvas ? cnv.toDataURL('image/x-icon') : stylesheetURL;
                    addLink();
                    resolve(link);
                });
                img.src = stylesheetURL;
                return;
            }
            link.rel = 'stylesheet';
            link.type = 'text/css';
            link.href = stylesheetURL;
            addLink();
            link.addEventListener('error', function (error) {
                reject(error);
            });
            link.addEventListener('load', function () {
                resolve(link);
            });
        });
    }

    return Promise.all(stylesheets.map(setupLink));
}

/* globals jQuery */

var $$b = [jqPluginJSHotkeys, jqPluginBBQ, jqPluginSVGIcons, jqPluginJGraduate, jqPluginSpinBtn, jqPluginSVG, jqPluginContextMenu, jPicker].reduce(function ($, cb) {
  return cb($);
}, jQuery);

/*
if (!$.loadingStylesheets) {
  $.loadingStylesheets = [];
}
*/
var stylesheet = 'svg-editor.css';
if (!$$b.loadingStylesheets.includes(stylesheet)) {
  $$b.loadingStylesheets.push(stylesheet);
}
var favicon = 'images/logo.png';
if ($$b.loadingStylesheets.some(function (item) {
  return !Array.isArray(item) || item[0] !== favicon;
})) {
  $$b.loadingStylesheets.push([favicon, { favicon: true }]);
}

var editor = {};

// EDITOR PROPERTIES: (defined below)
//    curPrefs, curConfig, canvas, storage, uiStrings
//
// STATE MAINTENANCE PROPERTIES
editor.tool_scale = 1; // Dependent on icon size, so any use to making configurable instead? Used by JQuerySpinBtn.js
editor.exportWindowCt = 0;
editor.langChanged = false;
editor.showSaveWarning = false;
editor.storagePromptClosed = false; // For use with ext-storage.js

var callbacks = [],

/**
* PREFS AND CONFIG
*/
// The iteration algorithm for defaultPrefs does not currently support array/objects
defaultPrefs = {
  // EDITOR OPTIONS (DIALOG)
  lang: '', // Default to "en" if locale.js detection does not detect another language
  iconsize: '', // Will default to 's' if the window height is smaller than the minimum height and 'm' otherwise
  bkgd_color: '#FFF',
  bkgd_url: '',
  // DOCUMENT PROPERTIES (DIALOG)
  img_save: 'embed',
  // ALERT NOTICES
  // Only shows in UI as far as alert notices, but useful to remember, so keeping as pref
  save_notice_done: false,
  export_notice_done: false
},
    defaultExtensions = ['ext-overview_window.js', 'ext-markers.js', 'ext-connector.js', 'ext-eyedropper.js', 'ext-shapes.js', 'ext-imagelib.js', 'ext-grid.js', 'ext-polygon.js', 'ext-star.js', 'ext-panning.js', 'ext-storage.js'],
    defaultConfig = {
  // Todo: svgcanvas.js also sets and checks: show_outside_canvas, selectNew; add here?
  // Change the following to preferences and add pref controls to the UI (e.g., initTool, wireframe, showlayers)?
  canvasName: 'default',
  canvas_expansion: 3,
  initFill: {
    color: 'FF0000', // solid red
    opacity: 1
  },
  initStroke: {
    width: 5,
    color: '000000', // solid black
    opacity: 1
  },
  text: {
    stroke_width: 0,
    font_size: 24,
    font_family: 'serif'
  },
  initOpacity: 1,
  colorPickerCSS: null, // Defaults to 'left' with a position equal to that of the fill_color or stroke_color element minus 140, and a 'bottom' equal to 40
  initTool: 'select',
  exportWindowType: 'new', // 'same' (todo: also support 'download')
  wireframe: false,
  showlayers: false,
  no_save_warning: false,
  // PATH CONFIGURATION
  // The following path configuration items are disallowed in the URL (as should any future path configurations)
  imgPath: 'images/',
  langPath: 'locale/', // Default will be changed if this is a modular load
  extPath: 'extensions/', // Default will be changed if this is a modular load
  canvgPath: 'canvg/', // Default will be changed if this is a modular load
  jspdfPath: 'jspdf/', // Default will be changed if this is a modular load
  extIconsPath: 'extensions/',
  jGraduatePath: 'jgraduate/images/',
  // DOCUMENT PROPERTIES
  // Change the following to a preference (already in the Document Properties dialog)?
  dimensions: [640, 480],
  // EDITOR OPTIONS
  // Change the following to preferences (already in the Editor Options dialog)?
  gridSnapping: false,
  gridColor: '#000',
  baseUnit: 'px',
  snappingStep: 10,
  showRulers: true,
  // URL BEHAVIOR CONFIGURATION
  preventAllURLConfig: false,
  preventURLContentLoading: false,
  // EXTENSION CONFIGURATION (see also preventAllURLConfig)
  lockExtensions: false, // Disallowed in URL setting
  noDefaultExtensions: false, // noDefaultExtensions can only be meaningfully used in `svgedit-config-iife.js` or in the URL
  // EXTENSION-RELATED (GRID)
  showGrid: false, // Set by ext-grid.js
  // EXTENSION-RELATED (STORAGE)
  noStorageOnLoad: false, // Some interaction with ext-storage.js; prevent even the loading of previously saved local storage
  forceStorage: false, // Some interaction with ext-storage.js; strongly discouraged from modification as it bypasses user privacy by preventing them from choosing whether to keep local storage or not
  emptyStorageOnDecline: false // Used by ext-storage.js; empty any prior storage if the user declines to store
},

/**
* LOCALE
*/
uiStrings$1 = editor.uiStrings = {};

var svgCanvas = void 0,
    urldata = void 0,
    isReady = false,
    customExportImage = false,
    customExportPDF = false,
    curPrefs = {},

// Note: The difference between Prefs and Config is that Prefs
//   can be changed in the UI and are stored in the browser,
//   while config cannot
curConfig = {
  // We do not put on defaultConfig to simplify object copying
  //   procedures (we obtain instead from defaultExtensions)
  extensions: [],
  stylesheets: [],
  /**
  * Can use window.location.origin to indicate the current
  * origin. Can contain a '*' to allow all domains or 'null' (as
  * a string) to support all file:// URLs. Cannot be set by
  * URL for security reasons (not safe, at least for
  * privacy or data integrity of SVG content).
  * Might have been fairly safe to allow
  *   `new URL(window.location.href).origin` by default but
  *   avoiding it ensures some more security that even third
  *   party apps on the same domain also cannot communicate
  *   with this app by default.
  * For use with ext-xdomain-messaging.js
  * @todo We might instead make as a user-facing preference.
  */
  allowedOrigins: []
};

function loadSvgString(str, callback) {
  var success = svgCanvas.setSvgString(str) !== false;
  callback = callback || $$b.noop;
  if (success) {
    callback(true); // eslint-disable-line standard/no-callback-literal
  } else {
    $$b.alert(uiStrings$1.notification.errorLoadingSVG, function () {
      callback(false); // eslint-disable-line standard/no-callback-literal
    });
  }
}

/**
* EXPORTS
*/

/**
* Store and retrieve preferences
* @param {string} key The preference name to be retrieved or set
* @param {string} [val] The value. If the value supplied is missing or falsey, no change to the preference will be made.
* @returns {string} If val is missing or falsey, the value of the previously stored preference will be returned.
* @todo Can we change setting on the jQuery namespace (onto editor) to avoid conflicts?
* @todo Review whether any remaining existing direct references to
*  getting curPrefs can be changed to use $.pref() getting to ensure
*  defaultPrefs fallback (also for sake of allowInitialUserOverride); specifically, bkgd_color could be changed so that
*  the pref dialog has a button to auto-calculate background, but otherwise uses $.pref() to be able to get default prefs
*  or overridable settings
*/
$$b.pref = function (key, val) {
  if (val) {
    curPrefs[key] = val;
    editor.curPrefs = curPrefs; // Update exported value
    return;
  }
  return key in curPrefs ? curPrefs[key] : defaultPrefs[key];
};

/**
* EDITOR PUBLIC METHODS
* @todo Sort these methods per invocation order, ideally with init at the end
* @todo Prevent execution until init executes if dependent on it?
*/
editor.putLocale = putLocale;
editor.readLang = readLang;

/**
* Where permitted, sets canvas and/or defaultPrefs based on previous
*  storage. This will override URL settings (for security reasons) but
*  not `svgedit-config-iife.js` configuration (unless initial user
*  overriding is explicitly permitted there via `allowInitialUserOverride`).
* @todo Split `allowInitialUserOverride` into `allowOverrideByURL` and
*  `allowOverrideByUserStorage` so `svgedit-config-iife.js` can disallow some
*  individual items for URL setting but allow for user storage AND/OR
*  change URL setting so that it always uses a different namespace,
*  so it won't affect pre-existing user storage (but then if users saves
*  that, it will then be subject to tampering
*/
editor.loadContentAndPrefs = function () {
  if (!curConfig.forceStorage && (curConfig.noStorageOnLoad || !document.cookie.match(/(?:^|;\s*)store=(?:prefsAndContent|prefsOnly)/))) {
    return;
  }

  // LOAD CONTENT
  if (editor.storage && ( // Cookies do not have enough available memory to hold large documents
  curConfig.forceStorage || !curConfig.noStorageOnLoad && document.cookie.match(/(?:^|;\s*)store=prefsAndContent/))) {
    var name = 'svgedit-' + curConfig.canvasName;
    var cached = editor.storage.getItem(name);
    if (cached) {
      editor.loadFromString(cached);
    }
  }

  // LOAD PREFS
  for (var key in defaultPrefs) {
    if (defaultPrefs.hasOwnProperty(key)) {
      // It's our own config, so we don't need to iterate up the prototype chain
      var storeKey = 'svg-edit-' + key;
      if (editor.storage) {
        var val = editor.storage.getItem(storeKey);
        if (val) {
          defaultPrefs[key] = String(val); // Convert to string for FF (.value fails in Webkit)
        }
      } else if (window.widget) {
        defaultPrefs[key] = window.widget.preferenceForKey(storeKey);
      } else {
        var result = document.cookie.match(new RegExp('(?:^|;\\s*)' + regexEscape(encodeURIComponent(storeKey)) + '=([^;]+)'));
        defaultPrefs[key] = result ? decodeURIComponent(result[1]) : '';
      }
    }
  }
};

/**
* Allows setting of preferences or configuration (including extensions).
* @param {Object} opts The preferences or configuration (including extensions)
* @param {Object} [cfgCfg] Describes configuration which applies to the
*    particular batch of supplied options
* @param {boolean} [cfgCfg.allowInitialUserOverride=false] Set to true if you wish
*  to allow initial overriding of settings by the user via the URL
*  (if permitted) or previously stored preferences (if permitted);
*  note that it will be too late if you make such calls in extension
*  code because the URL or preference storage settings will
*   have already taken place.
* @param {boolean} [cfgCfg.overwrite=true] Set to false if you wish to
*  prevent the overwriting of prior-set preferences or configuration
*  (URL settings will always follow this requirement for security
*  reasons, so `svgedit-config-iife.js` settings cannot be overridden unless it
*  explicitly permits via `allowInitialUserOverride` but extension config
*  can be overridden as they will run after URL settings). Should
*   not be needed in `svgedit-config-iife.js`.
*/
editor.setConfig = function (opts, cfgCfg) {
  cfgCfg = cfgCfg || {};
  function extendOrAdd(cfgObj, key, val) {
    if (cfgObj[key] && _typeof(cfgObj[key]) === 'object') {
      $$b.extend(true, cfgObj[key], val);
    } else {
      cfgObj[key] = val;
    }
  }
  $$b.each(opts, function (key, val) {
    if (opts.hasOwnProperty(key)) {
      // Only allow prefs defined in defaultPrefs
      if (defaultPrefs.hasOwnProperty(key)) {
        if (cfgCfg.overwrite === false && (curConfig.preventAllURLConfig || curPrefs.hasOwnProperty(key))) {
          return;
        }
        if (cfgCfg.allowInitialUserOverride === true) {
          defaultPrefs[key] = val;
        } else {
          $$b.pref(key, val);
        }
      } else if (['extensions', 'stylesheets', 'allowedOrigins'].includes(key)) {
        if (cfgCfg.overwrite === false && (curConfig.preventAllURLConfig || ['allowedOrigins', 'stylesheets'].includes(key) || key === 'extensions' && curConfig.lockExtensions)) {
          return;
        }
        curConfig[key] = curConfig[key].concat(val); // We will handle any dupes later
        // Only allow other curConfig if defined in defaultConfig
      } else if (defaultConfig.hasOwnProperty(key)) {
        if (cfgCfg.overwrite === false && (curConfig.preventAllURLConfig || curConfig.hasOwnProperty(key))) {
          return;
        }
        // Potentially overwriting of previously set config
        if (curConfig.hasOwnProperty(key)) {
          if (cfgCfg.overwrite === false) {
            return;
          }
          extendOrAdd(curConfig, key, val);
        } else {
          if (cfgCfg.allowInitialUserOverride === true) {
            extendOrAdd(defaultConfig, key, val);
          } else {
            if (defaultConfig[key] && _typeof(defaultConfig[key]) === 'object') {
              curConfig[key] = {};
              $$b.extend(true, curConfig[key], val); // Merge properties recursively, e.g., on initFill, initStroke objects
            } else {
              curConfig[key] = val;
            }
          }
        }
      }
    }
  });
  editor.curConfig = curConfig; // Update exported value
};

/**
* @param {Object} opts Extension mechanisms may call setCustomHandlers with three functions: opts.open, opts.save, and opts.exportImage
* opts.open's responsibilities are:
*  - invoke a file chooser dialog in 'open' mode
*  - let user pick a SVG file
*  - calls svgCanvas.setSvgString() with the string contents of that file
*  opts.save's responsibilities are:
*  - accept the string contents of the current document
*  - invoke a file chooser dialog in 'save' mode
*  - save the file to location chosen by the user
*  opts.exportImage's responsibilities (with regard to the object it is supplied in its 2nd argument) are:
*  - inform user of any issues supplied via the "issues" property
*  - convert the "svg" property SVG string into an image for export;
*    utilize the properties "type" (currently 'PNG', 'JPEG', 'BMP',
*    'WEBP', 'PDF'), "mimeType", and "quality" (for 'JPEG' and 'WEBP'
*    types) to determine the proper output.
*/
editor.setCustomHandlers = function (opts) {
  editor.ready(function () {
    if (opts.open) {
      $$b('#tool_open > input[type="file"]').remove();
      $$b('#tool_open').show();
      svgCanvas.open = opts.open;
    }
    if (opts.save) {
      editor.showSaveWarning = false;
      svgCanvas.bind('saved', opts.save);
    }
    if (opts.exportImage) {
      customExportImage = opts.exportImage;
      svgCanvas.bind('exported', customExportImage); // canvg and our RGBColor will be available to the method
    }
    if (opts.exportPDF) {
      customExportPDF = opts.exportPDF;
      svgCanvas.bind('exportedPDF', customExportPDF); // jsPDF and our RGBColor will be available to the method
    }
  });
};

editor.randomizeIds = function () {
  svgCanvas.randomizeIds(arguments);
};

editor.init = function () {
  var modularVersion = !('svgEditor' in window) || !window.svgEditor || window.svgEditor.modules !== false;
  if (!modularVersion) {
    Object.assign(defaultConfig, {
      langPath: '../dist/locale/',
      extPath: '../dist/extensions/',
      canvgPath: '../dist/',
      jspdfPath: '../dist/'
    });
  }

  // const host = location.hostname,
  //  onWeb = host && host.includes('.');
  // Some FF versions throw security errors here when directly accessing
  try {
    if ('localStorage' in window) {
      // && onWeb removed so Webkit works locally
      editor.storage = localStorage;
    }
  } catch (err) {}

  // Todo: Avoid var-defined functions and group functions together, etc. where possible
  var goodLangs = [];
  $$b('#lang_select option').each(function () {
    goodLangs.push(this.value);
  });

  function setupCurPrefs() {
    curPrefs = $$b.extend(true, {}, defaultPrefs, curPrefs); // Now safe to merge with priority for curPrefs in the event any are already set
    // Export updated prefs
    editor.curPrefs = curPrefs;
  }
  function setupCurConfig() {
    curConfig = $$b.extend(true, {}, defaultConfig, curConfig); // Now safe to merge with priority for curConfig in the event any are already set

    // Now deal with extensions and other array config
    if (!curConfig.noDefaultExtensions) {
      curConfig.extensions = curConfig.extensions.concat(defaultExtensions);
    }
    // ...and remove any dupes
    $$b.each(['extensions', 'stylesheets', 'allowedOrigins'], function (i, cfg) {
      curConfig[cfg] = $$b.grep(curConfig[cfg], function (n, i) {
        // Supposedly faster than filter per http://amandeep1986.blogspot.hk/2015/02/jquery-grep-vs-js-filter.html
        return i === curConfig[cfg].indexOf(n);
      });
    });
    // Export updated config
    editor.curConfig = curConfig;
  }
  (function () {
    // Load config/data from URL if given
    var src = void 0,
        qstr = void 0;
    urldata = $$b.deparam.querystring(true);
    if (!$$b.isEmptyObject(urldata)) {
      if (urldata.dimensions) {
        urldata.dimensions = urldata.dimensions.split(',');
      }

      if (urldata.bkgd_color) {
        urldata.bkgd_color = '#' + urldata.bkgd_color;
      }

      if (urldata.extensions) {
        // For security reasons, disallow cross-domain or cross-folder extensions via URL
        urldata.extensions = urldata.extensions.match(/[:/\\]/) ? '' : urldata.extensions.split(',');
      }

      // Disallowing extension paths via URL for
      // security reasons, even for same-domain
      // ones given potential to interact in undesirable
      // ways with other script resources
      $$b.each(['extPath', 'imgPath', 'extIconsPath', 'canvgPath', 'langPath', 'jGraduatePath', 'jspdfPath'], function (pathConfig) {
        if (urldata[pathConfig]) {
          delete urldata[pathConfig];
        }
      });

      editor.setConfig(urldata, { overwrite: false }); // Note: source and url (as with storagePrompt later) are not set on config but are used below

      setupCurConfig();

      if (!curConfig.preventURLContentLoading) {
        src = urldata.source;
        qstr = $$b.param.querystring();
        if (!src) {
          // urldata.source may have been null if it ended with '='
          if (qstr.includes('source=data:')) {
            src = qstr.match(/source=(data:[^&]*)/)[1];
          }
        }
        if (src) {
          if (src.startsWith('data:')) {
            editor.loadFromDataURI(src);
          } else {
            editor.loadFromString(src);
          }
          return;
        }
        if (urldata.url) {
          editor.loadFromURL(urldata.url);
          return;
        }
      }
      if (!urldata.noStorageOnLoad || curConfig.forceStorage) {
        editor.loadContentAndPrefs();
      }
      setupCurPrefs();
    } else {
      setupCurConfig();
      editor.loadContentAndPrefs();
      setupCurPrefs();
    }
  })();

  var setIcon = editor.setIcon = function (elem, iconId, forcedSize) {
    var icon = typeof iconId === 'string' ? $$b.getSvgIcon(iconId, true) : iconId.clone();
    if (!icon) {
      console.log('NOTE: Icon image missing: ' + iconId);
      return;
    }
    $$b(elem).empty().append(icon);
  };

  var extFunc = function () {
    var _ref = asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2() {
      var _this = this;

      return regeneratorRuntime.wrap(function _callee2$(_context2) {
        while (1) {
          switch (_context2.prev = _context2.next) {
            case 0:
              _context2.prev = 0;
              _context2.next = 3;
              return Promise.all(curConfig.extensions.map(function () {
                var _ref2 = asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(extname) {
                  var extName, url, imported, name, init$$1;
                  return regeneratorRuntime.wrap(function _callee$(_context) {
                    while (1) {
                      switch (_context.prev = _context.next) {
                        case 0:
                          extName = extname.match(/^ext-(.+)\.js/);

                          if (extName) {
                            _context.next = 3;
                            break;
                          }

                          return _context.abrupt('return');

                        case 3:
                          url = curConfig.extPath + extname;
                          // Todo: Replace this with `return import(url);` when
                          //   `import()` widely supported

                          _context.next = 6;
                          return importSetGlobalDefault(url, {
                            global: 'svgEditorExtension_' + extName[1].replace(/-/g, '_')
                          });

                        case 6:
                          imported = _context.sent;
                          name = imported.name, init$$1 = imported.init;
                          return _context.abrupt('return', editor.addExtension(name, init$$1 && init$$1.bind(editor) || imported));

                        case 9:
                        case 'end':
                          return _context.stop();
                      }
                    }
                  }, _callee, _this);
                }));

                return function (_x) {
                  return _ref2.apply(this, arguments);
                };
              }()));

            case 3:
              _context2.next = 8;
              break;

            case 5:
              _context2.prev = 5;
              _context2.t0 = _context2['catch'](0);

              console.log(_context2.t0);

            case 8:
              return _context2.abrupt('return', editor.putLocale(null, goodLangs, curConfig));

            case 9:
            case 'end':
              return _context2.stop();
          }
        }
      }, _callee2, this, [[0, 5]]);
    }));

    return function extFunc() {
      return _ref.apply(this, arguments);
    };
  }();

  var stateObj = { tool_scale: editor.tool_scale };

  var setFlyoutPositions = function setFlyoutPositions() {
    $$b('.tools_flyout').each(function () {
      var shower = $$b('#' + this.id + '_show');
      var pos = shower.offset();
      var w = shower.outerWidth();
      $$b(this).css({ left: (pos.left + w) * editor.tool_scale, top: pos.top });
    });
  };

  var uaPrefix = function () {
    var regex = /^(Moz|Webkit|Khtml|O|ms|Icab)(?=[A-Z])/;
    var someScript = document.getElementsByTagName('script')[0];
    for (var prop in someScript.style) {
      if (regex.test(prop)) {
        // test is faster than match, so it's better to perform
        // that on the lot and match only when necessary
        return prop.match(regex)[0];
      }
    }
    // Nothing found so far?
    if ('WebkitOpacity' in someScript.style) {
      return 'Webkit';
    }
    if ('KhtmlOpacity' in someScript.style) {
      return 'Khtml';
    }

    return '';
  }();

  var scaleElements = function scaleElements(elems, scale) {
    // const prefix = '-' + uaPrefix.toLowerCase() + '-'; // Currently unused
    var sides = ['top', 'left', 'bottom', 'right'];

    elems.each(function () {
      // Handled in CSS
      // this.style[uaPrefix + 'Transform'] = 'scale(' + scale + ')';
      var el = $$b(this);
      var w = el.outerWidth() * (scale - 1);
      var h = el.outerHeight() * (scale - 1);
      // const margins = {}; // Currently unused

      for (var i = 0; i < 4; i++) {
        var s = sides[i];
        var cur = el.data('orig_margin-' + s);
        if (cur == null) {
          cur = parseInt(el.css('margin-' + s), 10);
          // Cache the original margin
          el.data('orig_margin-' + s, cur);
        }
        var val = cur * scale;
        if (s === 'right') {
          val += w;
        } else if (s === 'bottom') {
          val += h;
        }

        el.css('margin-' + s, val);
        // el.css('outline', '1px solid red');
      }
    });
  };

  var setIconSize = editor.setIconSize = function (size) {
    // const elems = $('.tool_button, .push_button, .tool_button_current, .disabled, .icon_label, #url_notice, #tool_open');
    var selToscale = '#tools_top .toolset, #editor_panel > *, #history_panel > *,' + '        #main_button, #tools_left > *, #path_node_panel > *, #multiselected_panel > *,' + '        #g_panel > *, #tool_font_size > *, .tools_flyout';

    var elems = $$b(selToscale);

    var scale = 1;
    if (typeof size === 'number') {
      scale = size;
    } else {
      var iconSizes = { s: 0.75, m: 1, l: 1.25, xl: 1.5 };
      scale = iconSizes[size];
    }

    stateObj.tool_scale = editor.tool_scale = scale;

    setFlyoutPositions();
    // $('.tools_flyout').each(function () {
    //   const pos = $(this).position();
    //   console.log($(this), pos.left+(34 * scale));
    //   $(this).css({left: pos.left+(34 * scale), top: pos.top+(77 * scale)});
    //   console.log('l', $(this).css('left'));
    // });
    //
    // const scale = .75;

    var hiddenPs = elems.parents(':hidden');
    hiddenPs.css('visibility', 'hidden').show();
    scaleElements(elems, scale);
    hiddenPs.css('visibility', 'visible').hide();
    // return;

    $$b.pref('iconsize', size);
    $$b('#iconsize').val(size);

    // Change icon size
    // $('.tool_button, .push_button, .tool_button_current, .disabled, .icon_label, #url_notice, #tool_open')
    // .find('> svg, > img').each(function () {
    //   this.setAttribute('width',size_num);
    //   this.setAttribute('height',size_num);
    // });
    //
    // $.resizeSvgIcons({
    //   '.flyout_arrow_horiz > svg, .flyout_arrow_horiz > img': size_num / 5,
    //   '#logo > svg, #logo > img': size_num * 1.3,
    //   '#tools_bottom .icon_label > *': (size_num === 16 ? 18 : size_num * .75)
    // });
    // if (size != 's') {
    //   $.resizeSvgIcons({'#layerbuttons svg, #layerbuttons img': size_num * .6});
    // }

    // Note that all rules will be prefixed with '#svg_editor' when parsed
    var cssResizeRules = {
      // '.tool_button,\
      // .push_button,\
      // .tool_button_current,\
      // .push_button_pressed,\
      // .disabled,\
      // .icon_label,\
      // .tools_flyout .tool_button': {
      //   width: {s: '16px', l: '32px', xl: '48px'},
      //   height: {s: '16px', l: '32px', xl: '48px'},
      //   padding: {s: '1px', l: '2px', xl: '3px'}
      // },
      // '.tool_sep': {
      //   height: {s: '16px', l: '32px', xl: '48px'},
      //   margin: {s: '2px 2px', l: '2px 5px', xl: '2px 8px'}
      // },
      // '#main_icon': {
      //   width: {s: '31px', l: '53px', xl: '75px'},
      //   height: {s: '22px', l: '42px', xl: '64px'}
      // },
      '#tools_top': {
        left: 50 + $$b('#main_button').width(),
        height: 72
      },
      '#tools_left': {
        width: 31,
        top: 74
      },
      'div#workarea': {
        left: 38,
        top: 74
        // '#tools_bottom': {
        //   left: {s: '27px', l: '46px', xl: '65px'},
        //   height: {s: '58px', l: '98px', xl: '145px'}
        // },
        // '#color_tools': {
        //   'border-spacing': {s: '0 1px'},
        //   'margin-top': {s: '-1px'}
        // },
        // '#color_tools .icon_label': {
        //   width: {l:'43px', xl: '60px'}
        // },
        // '.color_tool': {
        //   height: {s: '20px'}
        // },
        // '#tool_opacity': {
        //   top: {s: '1px'},
        //   height: {s: 'auto', l:'auto', xl:'auto'}
        // },
        // '#tools_top input, #tools_bottom input': {
        //   'margin-top': {s: '2px', l: '4px', xl: '5px'},
        //   height: {s: 'auto', l: 'auto', xl: 'auto'},
        //   border: {s: '1px solid #555', l: 'auto', xl: 'auto'},
        //   'font-size': {s: '.9em', l: '1.2em', xl: '1.4em'}
        // },
        // '#zoom_panel': {
        //   'margin-top': {s: '3px', l: '4px', xl: '5px'}
        // },
        // '#copyright, #tools_bottom .label': {
        //   'font-size': {l: '1.5em', xl: '2em'},
        //   'line-height': {s: '15px'}
        // },
        // '#tools_bottom_2': {
        //   width: {l: '295px', xl: '355px'},
        //   top: {s: '4px'}
        // },
        // '#tools_top > div, #tools_top': {
        //   'line-height': {s: '17px', l: '34px', xl: '50px'}
        // },
        // '.dropdown button': {
        //   height: {s: '18px', l: '34px', xl: '40px'},
        //   'line-height': {s: '18px', l: '34px', xl: '40px'},
        //   'margin-top': {s: '3px'}
        // },
        // '#tools_top label, #tools_bottom label': {
        //   'font-size': {s: '1em', l: '1.5em', xl: '2em'},
        //   height: {s: '25px', l: '42px', xl: '64px'}
        // },
        // 'div.toolset': {
        //   height: {s: '25px', l: '42px', xl: '64px'}
        // },
        // '#tool_bold, #tool_italic': {
        //   'font-size': {s: '1.5em', l: '3em', xl: '4.5em'}
        // },
        // '#sidepanels': {
        //   top: {s: '50px', l: '88px', xl: '125px'},
        //   bottom: {s: '51px', l: '68px', xl: '65px'}
        // },
        // '#layerbuttons': {
        //   width: {l: '130px', xl: '175px'},
        //   height: {l: '24px', xl: '30px'}
        // },
        // '#layerlist': {
        //   width: {l: '128px', xl: '150px'}
        // },
        // '.layer_button': {
        //   width: {l: '19px', xl: '28px'},
        //   height: {l: '19px', xl: '28px'}
        // },
        // 'input.spin-button': {
        //   'background-image': {l: 'url('images/spinbtn_updn_big.png')', xl: 'url('images/spinbtn_updn_big.png')'},
        //   'background-position': {l: '100% -5px', xl: '100% -2px'},
        //   'padding-right': {l: '24px', xl: '24px' }
        // },
        // 'input.spin-button.up': {
        //   'background-position': {l: '100% -45px', xl: '100% -42px'}
        // },
        // 'input.spin-button.down': {
        //   'background-position': {l: '100% -85px', xl: '100% -82px'}
        // },
        // '#position_opts': {
        //   width: {all: (size_num*4) +'px'}
        // }
      } };

    var ruleElem = $$b('#tool_size_rules');
    if (!ruleElem.length) {
      ruleElem = $$b('<style id="tool_size_rules"></style>').appendTo('head');
    } else {
      ruleElem.empty();
    }

    if (size !== 'm') {
      var styleStr = '';
      $$b.each(cssResizeRules, function (selector, rules) {
        selector = '#svg_editor ' + selector.replace(/,/g, ', #svg_editor');
        styleStr += selector + '{';
        $$b.each(rules, function (prop, values) {
          var val = void 0;
          if (typeof values === 'number') {
            val = values * scale + 'px';
          } else if (values[size] || values.all) {
            val = values[size] || values.all;
          }
          styleStr += prop + ':' + val + ';';
        });
        styleStr += '}';
      });
      // this.style[uaPrefix + 'Transform'] = 'scale(' + scale + ')';
      var prefix = '-' + uaPrefix.toLowerCase() + '-';
      styleStr += selToscale + '{' + prefix + 'transform: scale(' + scale + ');}' + ' #svg_editor div.toolset .toolset {' + prefix + 'transform: scale(1); margin: 1px !important;}' + // Hack for markers
      ' #svg_editor .ui-slider {' + prefix + 'transform: scale(' + 1 / scale + ');}' // Hack for sliders
      ;
      ruleElem.text(styleStr);
    }

    setFlyoutPositions();
  };
  $$b.svgIcons(curConfig.imgPath + 'svg_edit_icons.svg', {
    w: 24, h: 24,
    id_match: false,
    no_img: !isWebkit(), // Opera & Firefox 4 gives odd behavior w/images
    fallback_path: curConfig.imgPath,
    fallback: {
      new_image: 'clear.png',
      save: 'save.png',
      open: 'open.png',
      source: 'source.png',
      docprops: 'document-properties.png',
      wireframe: 'wireframe.png',

      undo: 'undo.png',
      redo: 'redo.png',

      select: 'select.png',
      select_node: 'select_node.png',
      pencil: 'fhpath.png',
      pen: 'line.png',
      square: 'square.png',
      rect: 'rect.png',
      fh_rect: 'freehand-square.png',
      circle: 'circle.png',
      ellipse: 'ellipse.png',
      fh_ellipse: 'freehand-circle.png',
      path: 'path.png',
      text: 'text.png',
      image: 'image.png',
      zoom: 'zoom.png',

      clone: 'clone.png',
      node_clone: 'node_clone.png',
      delete: 'delete.png',
      node_delete: 'node_delete.png',
      group: 'shape_group_elements.png',
      ungroup: 'shape_ungroup.png',
      move_top: 'move_top.png',
      move_bottom: 'move_bottom.png',
      to_path: 'to_path.png',
      link_controls: 'link_controls.png',
      reorient: 'reorient.png',

      align_left: 'align-left.png',
      align_center: 'align-center.png',
      align_right: 'align-right.png',
      align_top: 'align-top.png',
      align_middle: 'align-middle.png',
      align_bottom: 'align-bottom.png',

      go_up: 'go-up.png',
      go_down: 'go-down.png',

      ok: 'save.png',
      cancel: 'cancel.png',

      arrow_right: 'flyouth.png',
      arrow_down: 'dropdown.gif'
    },
    placement: {
      '#logo': 'logo',

      '#tool_clear div,#layer_new': 'new_image',
      '#tool_save div': 'save',
      '#tool_export div': 'export',
      '#tool_open div div': 'open',
      '#tool_import div div': 'import',
      '#tool_source': 'source',
      '#tool_docprops > div': 'docprops',
      '#tool_wireframe': 'wireframe',

      '#tool_undo': 'undo',
      '#tool_redo': 'redo',

      '#tool_select': 'select',
      '#tool_fhpath': 'pencil',
      '#tool_line': 'pen',
      '#tool_rect,#tools_rect_show': 'rect',
      '#tool_square': 'square',
      '#tool_fhrect': 'fh_rect',
      '#tool_ellipse,#tools_ellipse_show': 'ellipse',
      '#tool_circle': 'circle',
      '#tool_fhellipse': 'fh_ellipse',
      '#tool_path': 'path',
      '#tool_text,#layer_rename': 'text',
      '#tool_image': 'image',
      '#tool_zoom': 'zoom',

      '#tool_clone,#tool_clone_multi': 'clone',
      '#tool_node_clone': 'node_clone',
      '#layer_delete,#tool_delete,#tool_delete_multi': 'delete',
      '#tool_node_delete': 'node_delete',
      '#tool_add_subpath': 'add_subpath',
      '#tool_openclose_path': 'open_path',
      '#tool_move_top': 'move_top',
      '#tool_move_bottom': 'move_bottom',
      '#tool_topath': 'to_path',
      '#tool_node_link': 'link_controls',
      '#tool_reorient': 'reorient',
      '#tool_group_elements': 'group_elements',
      '#tool_ungroup': 'ungroup',
      '#tool_unlink_use': 'unlink_use',

      '#tool_alignleft, #tool_posleft': 'align_left',
      '#tool_aligncenter, #tool_poscenter': 'align_center',
      '#tool_alignright, #tool_posright': 'align_right',
      '#tool_aligntop, #tool_postop': 'align_top',
      '#tool_alignmiddle, #tool_posmiddle': 'align_middle',
      '#tool_alignbottom, #tool_posbottom': 'align_bottom',
      '#cur_position': 'align',

      '#linecap_butt,#cur_linecap': 'linecap_butt',
      '#linecap_round': 'linecap_round',
      '#linecap_square': 'linecap_square',

      '#linejoin_miter,#cur_linejoin': 'linejoin_miter',
      '#linejoin_round': 'linejoin_round',
      '#linejoin_bevel': 'linejoin_bevel',

      '#url_notice': 'warning',

      '#layer_up': 'go_up',
      '#layer_down': 'go_down',
      '#layer_moreopts': 'context_menu',
      '#layerlist td.layervis': 'eye',

      '#tool_source_save,#tool_docprops_save,#tool_prefs_save': 'ok',
      '#tool_source_cancel,#tool_docprops_cancel,#tool_prefs_cancel': 'cancel',

      '#rwidthLabel, #iwidthLabel': 'width',
      '#rheightLabel, #iheightLabel': 'height',
      '#cornerRadiusLabel span': 'c_radius',
      '#angleLabel': 'angle',
      '#linkLabel,#tool_make_link,#tool_make_link_multi': 'globe_link',
      '#zoomLabel': 'zoom',
      '#tool_fill label': 'fill',
      '#tool_stroke .icon_label': 'stroke',
      '#group_opacityLabel': 'opacity',
      '#blurLabel': 'blur',
      '#font_sizeLabel': 'fontsize',

      '.flyout_arrow_horiz': 'arrow_right',
      '.dropdown button, #main_button .dropdown': 'arrow_down',
      '#palette .palette_item:first, #fill_bg, #stroke_bg': 'no_color'
    },
    resize: {
      '#logo .svg_icon': 28,
      '.flyout_arrow_horiz .svg_icon': 5,
      '.layer_button .svg_icon, #layerlist td.layervis .svg_icon': 14,
      '.dropdown button .svg_icon': 7,
      '#main_button .dropdown .svg_icon': 9,
      '.palette_item:first .svg_icon': 15,
      '#fill_bg .svg_icon, #stroke_bg .svg_icon': 16,
      '.toolbar_button button .svg_icon': 16,
      '.stroke_tool div div .svg_icon': 20,
      '#tools_bottom label .svg_icon': 18
    },
    callback: function callback(icons) {
      $$b('.toolbar_button button > svg, .toolbar_button button > img').each(function () {
        $$b(this).parent().prepend(this);
      });

      var tleft = $$b('#tools_left');

      var minHeight = void 0;
      if (tleft.length) {
        minHeight = tleft.offset().top + tleft.outerHeight();
      }

      var size = $$b.pref('iconsize');
      editor.setIconSize(size || ($$b(window).height() < minHeight ? 's' : 'm'));

      // Look for any missing flyout icons from plugins
      $$b('.tools_flyout').each(function () {
        var shower = $$b('#' + this.id + '_show');
        var sel = shower.attr('data-curopt');
        // Check if there's an icon here
        if (!shower.children('svg, img').length) {
          var clone = $$b(sel).children().clone();
          if (clone.length) {
            clone[0].removeAttribute('style'); // Needed for Opera
            shower.append(clone);
          }
        }
      });

      function getStylesheetPriority(stylesheet) {
        switch (stylesheet) {
          case 'jgraduate/css/jPicker.css':
            return 1;
          case 'jgraduate/css/jgraduate.css':
            return 2;
          case 'svg-editor.css':
            return 3;
          case 'spinbtn/JQuerySpinBtn.css':
            return 4;
          default:
            return Infinity;
        }
      }
      var stylesheets = $$b.loadingStylesheets.sort(function (a, b) {
        var priorityA = getStylesheetPriority(a);
        var priorityB = getStylesheetPriority(b);
        if (priorityA === priorityB) {
          return 0;
        }
        return priorityA > priorityB;
      });
      if (curConfig.stylesheets.length) {
        // Ensure a copy with unique items
        stylesheets = [].concat(toConsumableArray(new Set(curConfig.stylesheets)));
        var idx = stylesheets.indexOf('@default');
        if (idx > -1) {
          var _stylesheets;

          (_stylesheets = stylesheets).splice.apply(_stylesheets, [idx, 1].concat(toConsumableArray($$b.loadingStylesheets)));
        }
      }
      loadStylesheets(stylesheets, { acceptErrors: function acceptErrors(_ref3) {
          var stylesheetURL = _ref3.stylesheetURL,
              reject = _ref3.reject,
              resolve = _ref3.resolve;

          if ($$b.loadingStylesheets.includes(stylesheetURL)) {
            reject(new Error('Missing expected stylesheet: ' + stylesheetURL));
            return;
          }
          resolve();
        } }).then(function () {
        $$b('#svg_container')[0].style.visibility = 'visible';
        editor.runCallbacks();

        setTimeout(function () {
          $$b('.flyout_arrow_horiz:empty').each(function () {
            $$b(this).append($$b.getSvgIcon('arrow_right').width(5).height(5));
          });
        }, 1);
      });
    }
  });

  editor.canvas = svgCanvas = new SvgCanvas(document.getElementById('svgcanvas'), curConfig);
  var palette = [// Todo: Make into configuration item?
  '#000000', '#3f3f3f', '#7f7f7f', '#bfbfbf', '#ffffff', '#ff0000', '#ff7f00', '#ffff00', '#7fff00', '#00ff00', '#00ff7f', '#00ffff', '#007fff', '#0000ff', '#7f00ff', '#ff00ff', '#ff007f', '#7f0000', '#7f3f00', '#7f7f00', '#3f7f00', '#007f00', '#007f3f', '#007f7f', '#003f7f', '#00007f', '#3f007f', '#7f007f', '#7f003f', '#ffaaaa', '#ffd4aa', '#ffffaa', '#d4ffaa', '#aaffaa', '#aaffd4', '#aaffff', '#aad4ff', '#aaaaff', '#d4aaff', '#ffaaff', '#ffaad4'],
      modKey = isMac() ? 'meta+' : 'ctrl+',
      path = svgCanvas.pathActions,
      _svgCanvas = svgCanvas,
      undoMgr = _svgCanvas.undoMgr,
      workarea = $$b('#workarea'),
      canvMenu = $$b('#cmenu_canvas'),
      paintBox = { fill: null, stroke: null };


  var resizeTimer = void 0,
      curScrollPos = void 0;
  var exportWindow = null,
      defaultImageURL = curConfig.imgPath + 'logo.png',
      zoomInIcon = 'crosshair',
      zoomOutIcon = 'crosshair',
      uiContext = 'toolbars';

  // For external openers
  (function () {
    // let the opener know SVG Edit is ready (now that config is set up)
    var w = window.opener || window.parent;
    var svgEditorReadyEvent = void 0;
    if (w) {
      try {
        svgEditorReadyEvent = w.document.createEvent('Event');
        svgEditorReadyEvent.initEvent('svgEditorReady', true, true);
        w.document.documentElement.dispatchEvent(svgEditorReadyEvent);
      } catch (e) {}
    }
  })();

  // This sets up alternative dialog boxes. They mostly work the same way as
  // their UI counterparts, expect instead of returning the result, a callback
  // needs to be included that returns the result as its first parameter.
  // In the future we may want to add additional types of dialog boxes, since
  // they should be easy to handle this way.
  (function () {
    $$b('#dialog_container').draggable({
      cancel: '#dialog_content, #dialog_buttons *',
      containment: 'window'
    }).css('position', 'absolute');
    var box = $$b('#dialog_box'),
        btnHolder = $$b('#dialog_buttons'),
        dialogContent = $$b('#dialog_content'),
        dbox = function dbox(type, msg, callback, defaultVal, opts, changeCb, checkbox) {
      dialogContent.html('<p>' + msg.replace(/\n/g, '</p><p>') + '</p>').toggleClass('prompt', type === 'prompt');
      btnHolder.empty();

      var ok = $$b('<input type="button" value="' + uiStrings$1.common.ok + '">').appendTo(btnHolder);

      if (type !== 'alert') {
        $$b('<input type="button" value="' + uiStrings$1.common.cancel + '">').appendTo(btnHolder).click(function () {
          box.hide();
          if (callback) {
            callback(false); // eslint-disable-line standard/no-callback-literal
          }
        });
      }

      var ctrl = void 0,
          chkbx = void 0;
      if (type === 'prompt') {
        ctrl = $$b('<input type="text">').prependTo(btnHolder);
        ctrl.val(defaultVal || '');
        ctrl.bind('keydown', 'return', function () {
          ok.click();
        });
      } else if (type === 'select') {
        var div = $$b('<div style="text-align:center;">');
        ctrl = $$b('<select>').appendTo(div);
        if (checkbox) {
          var label = $$b('<label>').text(checkbox.label);
          chkbx = $$b('<input type="checkbox">').appendTo(label);
          chkbx.val(checkbox.value);
          if (checkbox.tooltip) {
            label.attr('title', checkbox.tooltip);
          }
          chkbx.prop('checked', !!checkbox.checked);
          div.append($$b('<div>').append(label));
        }
        $$b.each(opts || [], function (opt, val) {
          if ((typeof val === 'undefined' ? 'undefined' : _typeof(val)) === 'object') {
            ctrl.append($$b('<option>').val(val.value).html(val.text));
          } else {
            ctrl.append($$b('<option>').html(val));
          }
        });
        dialogContent.append(div);
        if (defaultVal) {
          ctrl.val(defaultVal);
        }
        if (changeCb) {
          ctrl.bind('change', 'return', changeCb);
        }
        ctrl.bind('keydown', 'return', function () {
          ok.click();
        });
      } else if (type === 'process') {
        ok.hide();
      }

      box.show();

      ok.click(function () {
        box.hide();
        var resp = type === 'prompt' || type === 'select' ? ctrl.val() : true;
        if (callback) {
          if (chkbx) {
            callback(resp, chkbx.prop('checked'));
          } else {
            callback(resp);
          }
        }
      }).focus();

      if (type === 'prompt' || type === 'select') {
        ctrl.focus();
      }
    };

    $$b.alert = function (msg, cb) {
      dbox('alert', msg, cb);
    };
    $$b.confirm = function (msg, cb) {
      dbox('confirm', msg, cb);
    };
    $$b.process_cancel = function (msg, cb) {
      dbox('process', msg, cb);
    };
    $$b.prompt = function (msg, txt, cb) {
      dbox('prompt', msg, cb, txt);
    };
    $$b.select = function (msg, opts, cb, changeCb, txt, checkbox) {
      dbox('select', msg, cb, txt, opts, changeCb, checkbox);
    };
  })();

  var setSelectMode = function setSelectMode() {
    var curr = $$b('.tool_button_current');
    if (curr.length && curr[0].id !== 'tool_select') {
      curr.removeClass('tool_button_current').addClass('tool_button');
      $$b('#tool_select').addClass('tool_button_current').removeClass('tool_button');
      $$b('#styleoverrides').text('#svgcanvas svg *{cursor:move;pointer-events:all} #svgcanvas svg{cursor:default}');
    }
    svgCanvas.setMode('select');
    workarea.css('cursor', 'auto');
  };

  // used to make the flyouts stay on the screen longer the very first time
  // const flyoutspeed = 1250; // Currently unused
  // let textBeingEntered = false; // Currently unused
  var origTitle = $$b('title:first').text();
  // Make [1,2,5] array
  var rIntervals = [];
  for (var i = 0.1; i < 1E5; i *= 10) {
    rIntervals.push(i);
    rIntervals.push(2 * i);
    rIntervals.push(5 * i);
  }

  // This function highlights the layer passed in (by fading out the other layers)
  // if no layer is passed in, this function restores the other layers
  var toggleHighlightLayer = function toggleHighlightLayer(layerNameToHighlight) {
    var i = void 0;
    var curNames = [],
        numLayers = svgCanvas.getCurrentDrawing().getNumLayers();
    for (i = 0; i < numLayers; i++) {
      curNames[i] = svgCanvas.getCurrentDrawing().getLayerName(i);
    }

    if (layerNameToHighlight) {
      for (i = 0; i < numLayers; ++i) {
        if (curNames[i] !== layerNameToHighlight) {
          svgCanvas.getCurrentDrawing().setLayerOpacity(curNames[i], 0.5);
        }
      }
    } else {
      for (i = 0; i < numLayers; ++i) {
        svgCanvas.getCurrentDrawing().setLayerOpacity(curNames[i], 1.0);
      }
    }
  };

  var populateLayers = function populateLayers() {
    svgCanvas.clearSelection();
    var layerlist = $$b('#layerlist tbody').empty();
    var selLayerNames = $$b('#selLayerNames').empty();
    var drawing = svgCanvas.getCurrentDrawing();
    var currentLayerName = drawing.getCurrentLayerName();
    var icon = $$b.getSvgIcon('eye');
    var layer = svgCanvas.getCurrentDrawing().getNumLayers();
    // we get the layers in the reverse z-order (the layer rendered on top is listed first)
    while (layer--) {
      var name = drawing.getLayerName(layer);
      var layerTr = $$b('<tr class="layer">').toggleClass('layersel', name === currentLayerName);
      var layerVis = $$b('<td class="layervis">').toggleClass('layerinvis', !drawing.getLayerVisibility(name));
      var layerName = $$b('<td class="layername">' + name + '</td>');
      layerlist.append(layerTr.append(layerVis, layerName));
      selLayerNames.append('<option value="' + name + '">' + name + '</option>');
    }
    if (icon !== undefined) {
      var copy = icon.clone();
      $$b('td.layervis', layerlist).append(copy);
      $$b.resizeSvgIcons({ 'td.layervis .svg_icon': 14 });
    }
    // handle selection of layer
    $$b('#layerlist td.layername').mouseup(function (evt) {
      $$b('#layerlist tr.layer').removeClass('layersel');
      $$b(this.parentNode).addClass('layersel');
      svgCanvas.setCurrentLayer(this.textContent);
      evt.preventDefault();
    }).mouseover(function () {
      toggleHighlightLayer(this.textContent);
    }).mouseout(function () {
      toggleHighlightLayer();
    });
    $$b('#layerlist td.layervis').click(function () {
      var row = $$b(this.parentNode).prevAll().length;
      var name = $$b('#layerlist tr.layer:eq(' + row + ') td.layername').text();
      var vis = $$b(this).hasClass('layerinvis');
      svgCanvas.setLayerVisibility(name, vis);
      $$b(this).toggleClass('layerinvis');
    });

    // if there were too few rows, let's add a few to make it not so lonely
    var num = 5 - $$b('#layerlist tr.layer').size();
    while (num-- > 0) {
      // FIXME: there must a better way to do this
      layerlist.append('<tr><td style="color:white">_</td><td/></tr>');
    }
  };

  var editingsource = false;
  var origSource = '';
  var showSourceEditor = function showSourceEditor(e, forSaving) {
    if (editingsource) {
      return;
    }

    editingsource = true;
    origSource = svgCanvas.getSvgString();
    $$b('#save_output_btns').toggle(!!forSaving);
    $$b('#tool_source_back').toggle(!forSaving);
    $$b('#svg_source_textarea').val(origSource);
    $$b('#svg_source_editor').fadeIn();
    $$b('#svg_source_textarea').focus();
  };

  var selectedElement = null;
  var multiselected = false;

  var togglePathEditMode = function togglePathEditMode(editmode, elems) {
    $$b('#path_node_panel').toggle(editmode);
    $$b('#tools_bottom_2,#tools_bottom_3').toggle(!editmode);
    if (editmode) {
      // Change select icon
      $$b('.tool_button_current').removeClass('tool_button_current').addClass('tool_button');
      $$b('#tool_select').addClass('tool_button_current').removeClass('tool_button');
      setIcon('#tool_select', 'select_node');
      multiselected = false;
      if (elems.length) {
        selectedElement = elems[0];
      }
    } else {
      setTimeout(function () {
        setIcon('#tool_select', 'select');
      }, 1000);
    }
  };

  var saveHandler = function saveHandler(wind, svg) {
    editor.showSaveWarning = false;

    // by default, we add the XML prolog back, systems integrating SVG-edit (wikis, CMSs)
    // can just provide their own custom save handler and might not want the XML prolog
    svg = '<?xml version="1.0"?>\n' + svg;

    // IE9 doesn't allow standalone Data URLs
    // https://connect.microsoft.com/IE/feedback/details/542600/data-uri-images-fail-when-loaded-by-themselves
    if (isIE()) {
      showSourceEditor(0, true);
      return;
    }

    // Since saving SVGs by opening a new window was removed in Chrome use artificial link-click
    // https://stackoverflow.com/questions/45603201/window-is-not-allowed-to-navigate-top-frame-navigations-to-data-urls
    var a = document.createElement('a');
    a.href = 'data:image/svg+xml;base64,' + encode64(svg);
    a.download = 'icon.svg';

    a.click();

    // Alert will only appear the first time saved OR the
    //   first time the bug is encountered
    var done = $$b.pref('save_notice_done');
    if (done !== 'all') {
      var note = uiStrings$1.notification.saveFromBrowser.replace('%s', 'SVG');
      // Check if FF and has <defs/>
      if (isGecko()) {
        if (svg.includes('<defs')) {
          // warning about Mozilla bug #308590 when applicable (seems to be fixed now in Feb 2013)
          note += '\n\n' + uiStrings$1.notification.defsFailOnSave;
          $$b.pref('save_notice_done', 'all');
          done = 'all';
        } else {
          $$b.pref('save_notice_done', 'part');
        }
      } else {
        $$b.pref('save_notice_done', 'all');
      }
      if (done !== 'part') {
        alert(note);
      }
    }
  };

  var exportHandler = function exportHandler(win, data) {
    var issues = data.issues,
        exportWindowName = data.exportWindowName;


    if (exportWindowName) {
      exportWindow = window.open(blankPageObjectURL || '', exportWindowName); // A hack to get the window via JSON-able name without opening a new one
    }

    if (!exportWindow || exportWindow.closed) {
      $$b.alert(uiStrings$1.notification.popupWindowBlocked);
      return;
    }

    exportWindow.location.href = data.bloburl || data.datauri;
    var done = $$b.pref('export_notice_done');
    if (done !== 'all') {
      var note = uiStrings$1.notification.saveFromBrowser.replace('%s', data.type);

      // Check if there are issues
      if (issues.length) {
        var pre = '\n \u2022 ';
        note += '\n\n' + uiStrings$1.notification.noteTheseIssues + pre + issues.join(pre);
      }

      // Note that this will also prevent the notice even though new issues may appear later.
      // May want to find a way to deal with that without annoying the user
      $$b.pref('export_notice_done', 'all');
      exportWindow.alert(note);
    }
  };

  var operaRepaint = function operaRepaint() {
    // Repaints canvas in Opera. Needed for stroke-dasharray change as well as fill change
    if (!window.opera) {
      return;
    }
    $$b('<p/>').hide().appendTo('body').remove();
  };

  function setStrokeOpt(opt, changeElem) {
    var id = opt.id;

    var bits = id.split('_');
    var pre = bits[0];
    var val = bits[1];

    if (changeElem) {
      svgCanvas.setStrokeAttr('stroke-' + pre, val);
    }
    operaRepaint();
    setIcon('#cur_' + pre, id, 20);
    $$b(opt).addClass('current').siblings().removeClass('current');
  }

  /**
  * This is a common function used when a tool has been clicked (chosen)
  * It does several common things:
  * - removes the `tool_button_current` class from whatever tool currently has it
  * - hides any flyouts
  * - adds the `tool_button_current` class to the button passed in
  * @param {String|Element} button The DOM element or string selector representing the toolbar button
  * @param {Boolean} noHiding Whether not to hide any flyouts
  * @returns {Boolean} Whether the button was disabled or not
  */
  var toolButtonClick = editor.toolButtonClick = function (button, noHiding) {
    if ($$b(button).hasClass('disabled')) {
      return false;
    }
    if ($$b(button).parent().hasClass('tools_flyout')) {
      return true;
    }
    var fadeFlyouts = 'normal';
    if (!noHiding) {
      $$b('.tools_flyout').fadeOut(fadeFlyouts);
    }
    $$b('#styleoverrides').text('');
    workarea.css('cursor', 'auto');
    $$b('.tool_button_current').removeClass('tool_button_current').addClass('tool_button');
    $$b(button).addClass('tool_button_current').removeClass('tool_button');
    return true;
  };

  /**
  * Unless the select toolbar button is disabled, sets the button
  * and sets the select mode and cursor styles.
  */
  var clickSelect = editor.clickSelect = function () {
    if (toolButtonClick('#tool_select')) {
      svgCanvas.setMode('select');
      $$b('#styleoverrides').text('#svgcanvas svg *{cursor:move;pointer-events:all}, #svgcanvas svg{cursor:default}');
    }
  };

  /**
  * Set a selected image's URL
  * @param {String} url
  */
  var setImageURL = editor.setImageURL = function (url) {
    if (!url) {
      url = defaultImageURL;
    }
    svgCanvas.setImageURL(url);
    $$b('#image_url').val(url);

    if (url.startsWith('data:')) {
      // data URI found
      $$b('#image_url').hide();
      $$b('#change_image_url').show();
    } else {
      // regular URL
      svgCanvas.embedImage(url, function (dataURI) {
        // Couldn't embed, so show warning
        $$b('#url_notice').toggle(!dataURI);
        defaultImageURL = url;
      });
      $$b('#image_url').show();
      $$b('#change_image_url').hide();
    }
  };

  function setBackground(color, url) {
    // if (color == $.pref('bkgd_color') && url == $.pref('bkgd_url')) { return; }
    $$b.pref('bkgd_color', color);
    $$b.pref('bkgd_url', url);

    // This should be done in svgcanvas.js for the borderRect fill
    svgCanvas.setBackground(color, url);
  }

  function promptImgURL() {
    var _ref4 = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
        _ref4$cancelDeletes = _ref4.cancelDeletes,
        cancelDeletes = _ref4$cancelDeletes === undefined ? false : _ref4$cancelDeletes;

    var curhref = svgCanvas.getHref(selectedElement);
    curhref = curhref.startsWith('data:') ? '' : curhref;
    $$b.prompt(uiStrings$1.notification.enterNewImgURL, curhref, function (url) {
      if (url) {
        setImageURL(url);
      } else if (cancelDeletes) {
        svgCanvas.deleteSelectedElements();
      }
    });
  }

  var setInputWidth = function setInputWidth(elem) {
    var w = Math.min(Math.max(12 + elem.value.length * 6, 50), 300);
    $$b(elem).width(w);
  };

  function updateRulers(scanvas, zoom) {
    if (!zoom) {
      zoom = svgCanvas.getZoom();
    }
    if (!scanvas) {
      scanvas = $$b('#svgcanvas');
    }

    var d = void 0,
        i = void 0;
    var limit = 30000;
    var contentElem = svgCanvas.getContentElem();
    var units = getTypeMap();
    var unit = units[curConfig.baseUnit]; // 1 = 1px

    // draw x ruler then y ruler
    for (d = 0; d < 2; d++) {
      var isX = d === 0;
      var dim = isX ? 'x' : 'y';
      var lentype = isX ? 'width' : 'height';
      var contentDim = Number(contentElem.getAttribute(dim));

      var $hcanvOrig = $$b('#ruler_' + dim + ' canvas:first');

      // Bit of a hack to fully clear the canvas in Safari & IE9
      var $hcanv = $hcanvOrig.clone();
      $hcanvOrig.replaceWith($hcanv);

      var hcanv = $hcanv[0];

      // Set the canvas size to the width of the container
      var rulerLen = scanvas[lentype]();
      var totalLen = rulerLen;
      hcanv.parentNode.style[lentype] = totalLen + 'px';
      var ctx = hcanv.getContext('2d');
      var ctxArr = void 0,
          num = void 0,
          ctxArrNum = void 0;

      ctx.fillStyle = 'rgb(200,0,0)';
      ctx.fillRect(0, 0, hcanv.width, hcanv.height);

      // Remove any existing canvasses
      $hcanv.siblings().remove();

      // Create multiple canvases when necessary (due to browser limits)
      if (rulerLen >= limit) {
        ctxArrNum = parseInt(rulerLen / limit, 10) + 1;
        ctxArr = [];
        ctxArr[0] = ctx;
        var copy = void 0;
        for (i = 1; i < ctxArrNum; i++) {
          hcanv[lentype] = limit;
          copy = hcanv.cloneNode(true);
          hcanv.parentNode.append(copy);
          ctxArr[i] = copy.getContext('2d');
        }

        copy[lentype] = rulerLen % limit;

        // set copy width to last
        rulerLen = limit;
      }

      hcanv[lentype] = rulerLen;

      var uMulti = unit * zoom;

      // Calculate the main number interval
      var rawM = 50 / uMulti;
      var multi = 1;
      for (i = 0; i < rIntervals.length; i++) {
        num = rIntervals[i];
        multi = num;
        if (rawM <= num) {
          break;
        }
      }

      var bigInt = multi * uMulti;

      ctx.font = '9px sans-serif';

      var rulerD = contentDim / uMulti % multi * uMulti;
      var labelPos = rulerD - bigInt;
      // draw big intervals
      var ctxNum = 0;
      while (rulerD < totalLen) {
        labelPos += bigInt;
        // const realD = rulerD - contentDim; // Currently unused

        var curD = Math.round(rulerD) + 0.5;
        if (isX) {
          ctx.moveTo(curD, 15);
          ctx.lineTo(curD, 0);
        } else {
          ctx.moveTo(15, curD);
          ctx.lineTo(0, curD);
        }

        num = (labelPos - contentDim) / uMulti;
        var label = void 0;
        if (multi >= 1) {
          label = Math.round(num);
        } else {
          var decs = String(multi).split('.')[1].length;
          label = num.toFixed(decs);
        }

        // Change 1000s to Ks
        if (label !== 0 && label !== 1000 && label % 1000 === 0) {
          label = label / 1000 + 'K';
        }

        if (isX) {
          ctx.fillText(label, rulerD + 2, 8);
        } else {
          // draw label vertically
          var _str = String(label).split('');
          for (i = 0; i < _str.length; i++) {
            ctx.fillText(_str[i], 1, rulerD + 9 + i * 9);
          }
        }

        var part = bigInt / 10;
        // draw the small intervals
        for (i = 1; i < 10; i++) {
          var subD = Math.round(rulerD + part * i) + 0.5;
          if (ctxArr && subD > rulerLen) {
            ctxNum++;
            ctx.stroke();
            if (ctxNum >= ctxArrNum) {
              i = 10;
              rulerD = totalLen;
              continue;
            }
            ctx = ctxArr[ctxNum];
            rulerD -= limit;
            subD = Math.round(rulerD + part * i) + 0.5;
          }

          // odd lines are slighly longer
          var lineNum = i % 2 ? 12 : 10;
          if (isX) {
            ctx.moveTo(subD, 15);
            ctx.lineTo(subD, lineNum);
          } else {
            ctx.moveTo(15, subD);
            ctx.lineTo(lineNum, subD);
          }
        }
        rulerD += bigInt;
      }
      ctx.strokeStyle = '#000';
      ctx.stroke();
    }
  }

  /**
  * @param center
  * @param newCtr
  */
  var updateCanvas = editor.updateCanvas = function (center, newCtr) {
    var zoom = svgCanvas.getZoom();
    var wArea = workarea;
    var cnvs = $$b('#svgcanvas');

    var w = workarea.width(),
        h = workarea.height();
    var wOrig = w,
        hOrig = h;
    var oldCtr = {
      x: wArea[0].scrollLeft + wOrig / 2,
      y: wArea[0].scrollTop + hOrig / 2
    };
    var multi = curConfig.canvas_expansion;
    w = Math.max(wOrig, svgCanvas.contentW * zoom * multi);
    h = Math.max(hOrig, svgCanvas.contentH * zoom * multi);

    if (w === wOrig && h === hOrig) {
      workarea.css('overflow', 'hidden');
    } else {
      workarea.css('overflow', 'scroll');
    }

    var oldCanY = cnvs.height() / 2;
    var oldCanX = cnvs.width() / 2;
    cnvs.width(w).height(h);
    var newCanY = h / 2;
    var newCanX = w / 2;
    var offset = svgCanvas.updateCanvas(w, h);

    var ratio = newCanX / oldCanX;

    var scrollX = w / 2 - wOrig / 2;
    var scrollY = h / 2 - hOrig / 2;

    if (!newCtr) {
      var oldDistX = oldCtr.x - oldCanX;
      var newX = newCanX + oldDistX * ratio;

      var oldDistY = oldCtr.y - oldCanY;
      var newY = newCanY + oldDistY * ratio;

      newCtr = {
        x: newX,
        y: newY
      };
    } else {
      newCtr.x += offset.x;
      newCtr.y += offset.y;
    }

    if (center) {
      // Go to top-left for larger documents
      if (svgCanvas.contentW > wArea.width()) {
        // Top-left
        workarea[0].scrollLeft = offset.x - 10;
        workarea[0].scrollTop = offset.y - 10;
      } else {
        // Center
        wArea[0].scrollLeft = scrollX;
        wArea[0].scrollTop = scrollY;
      }
    } else {
      wArea[0].scrollLeft = newCtr.x - wOrig / 2;
      wArea[0].scrollTop = newCtr.y - hOrig / 2;
    }
    if (curConfig.showRulers) {
      updateRulers(cnvs, zoom);
      workarea.scroll();
    }
    if (urldata.storagePrompt !== true && !editor.storagePromptClosed) {
      $$b('#dialog_box').hide();
    }
  };

  var updateToolButtonState = function updateToolButtonState() {
    var index = void 0,
        button = void 0;
    var bNoFill = svgCanvas.getColor('fill') === 'none';
    var bNoStroke = svgCanvas.getColor('stroke') === 'none';
    var buttonsNeedingStroke = ['#tool_fhpath', '#tool_line'];
    var buttonsNeedingFillAndStroke = ['#tools_rect .tool_button', '#tools_ellipse .tool_button', '#tool_text', '#tool_path'];
    if (bNoStroke) {
      for (index in buttonsNeedingStroke) {
        button = buttonsNeedingStroke[index];
        if ($$b(button).hasClass('tool_button_current')) {
          clickSelect();
        }
        $$b(button).addClass('disabled');
      }
    } else {
      for (index in buttonsNeedingStroke) {
        button = buttonsNeedingStroke[index];
        $$b(button).removeClass('disabled');
      }
    }

    if (bNoStroke && bNoFill) {
      for (index in buttonsNeedingFillAndStroke) {
        button = buttonsNeedingFillAndStroke[index];
        if ($$b(button).hasClass('tool_button_current')) {
          clickSelect();
        }
        $$b(button).addClass('disabled');
      }
    } else {
      for (index in buttonsNeedingFillAndStroke) {
        button = buttonsNeedingFillAndStroke[index];
        $$b(button).removeClass('disabled');
      }
    }

    svgCanvas.runExtensions('toolButtonStateUpdate', {
      nofill: bNoFill,
      nostroke: bNoStroke
    });

    // Disable flyouts if all inside are disabled
    $$b('.tools_flyout').each(function () {
      var shower = $$b('#' + this.id + '_show');
      var hasEnabled = false;
      $$b(this).children().each(function () {
        if (!$$b(this).hasClass('disabled')) {
          hasEnabled = true;
        }
      });
      shower.toggleClass('disabled', !hasEnabled);
    });

    operaRepaint();
  };

  // Updates the toolbar (colors, opacity, etc) based on the selected element
  // This function also updates the opacity and id elements that are in the context panel
  var updateToolbar = function updateToolbar() {
    var i = void 0,
        len = void 0;
    if (selectedElement != null) {
      switch (selectedElement.tagName) {
        case 'use':
        case 'image':
        case 'foreignObject':
          break;
        case 'g':
        case 'a':
          // Look for common styles
          var childs = selectedElement.getElementsByTagName('*');
          var gWidth = null;
          for (i = 0, len = childs.length; i < len; i++) {
            var swidth = childs[i].getAttribute('stroke-width');

            if (i === 0) {
              gWidth = swidth;
            } else if (gWidth !== swidth) {
              gWidth = null;
            }
          }

          $$b('#stroke_width').val(gWidth === null ? '' : gWidth);

          paintBox.fill.update(true);
          paintBox.stroke.update(true);

          break;
        default:
          paintBox.fill.update(true);
          paintBox.stroke.update(true);

          $$b('#stroke_width').val(selectedElement.getAttribute('stroke-width') || 1);
          $$b('#stroke_style').val(selectedElement.getAttribute('stroke-dasharray') || 'none');

          var attr = selectedElement.getAttribute('stroke-linejoin') || 'miter';

          if ($$b('#linejoin_' + attr).length) {
            setStrokeOpt($$b('#linejoin_' + attr)[0]);
          }

          attr = selectedElement.getAttribute('stroke-linecap') || 'butt';

          if ($$b('#linecap_' + attr).length) {
            setStrokeOpt($$b('#linecap_' + attr)[0]);
          }
      }
    }

    // All elements including image and group have opacity
    if (selectedElement != null) {
      var opacPerc = (selectedElement.getAttribute('opacity') || 1.0) * 100;
      $$b('#group_opacity').val(opacPerc);
      $$b('#opac_slider').slider('option', 'value', opacPerc);
      $$b('#elem_id').val(selectedElement.id);
      $$b('#elem_class').val(selectedElement.getAttribute('class'));
    }

    updateToolButtonState();
  };

  // updates the context panel tools based on the selected element
  var updateContextPanel = function updateContextPanel() {
    var elem = selectedElement;
    // If element has just been deleted, consider it null
    if (elem != null && !elem.parentNode) {
      elem = null;
    }
    var currentLayerName = svgCanvas.getCurrentDrawing().getCurrentLayerName();
    var currentMode = svgCanvas.getMode();
    var unit = curConfig.baseUnit !== 'px' ? curConfig.baseUnit : null;

    var isNode = currentMode === 'pathedit'; // elem ? (elem.id && elem.id.startsWith('pathpointgrip')) : false;
    var menuItems = $$b('#cmenu_canvas li');
    $$b('#selected_panel, #multiselected_panel, #g_panel, #rect_panel, #circle_panel,' + '#ellipse_panel, #line_panel, #text_panel, #image_panel, #container_panel,' + ' #use_panel, #a_panel').hide();
    if (elem != null) {
      var elname = elem.nodeName;
      // If this is a link with no transform and one child, pretend
      // its child is selected
      // if (elname === 'a') { // && !$(elem).attr('transform')) {
      //   elem = elem.firstChild;
      // }

      var angle = svgCanvas.getRotationAngle(elem);
      $$b('#angle').val(angle);

      var blurval = svgCanvas.getBlur(elem);
      $$b('#blur').val(blurval);
      $$b('#blur_slider').slider('option', 'value', blurval);

      if (svgCanvas.addedNew) {
        if (elname === 'image' && svgCanvas.getMode() === 'image') {
          // Prompt for URL if not a data URL
          if (!svgCanvas.getHref(elem).startsWith('data:')) {
            promptImgURL({ cancelDeletes: true });
          }
        }
        /* else if (elname == 'text') {
          // TODO: Do something here for new text
        } */
      }

      if (!isNode && currentMode !== 'pathedit') {
        $$b('#selected_panel').show();
        // Elements in this array already have coord fields
        if (['line', 'circle', 'ellipse'].includes(elname)) {
          $$b('#xy_panel').hide();
        } else {
          var x = void 0,
              y = void 0;

          // Get BBox vals for g, polyline and path
          if (['g', 'polyline', 'path'].includes(elname)) {
            var bb = svgCanvas.getStrokedBBox([elem]);
            if (bb) {
              x = bb.x;
              y = bb.y;
            }
          } else {
            x = elem.getAttribute('x');
            y = elem.getAttribute('y');
          }

          if (unit) {
            x = convertUnit(x);
            y = convertUnit(y);
          }

          $$b('#selected_x').val(x || 0);
          $$b('#selected_y').val(y || 0);
          $$b('#xy_panel').show();
        }

        // Elements in this array cannot be converted to a path
        var noPath = !['image', 'text', 'path', 'g', 'use'].includes(elname);
        $$b('#tool_topath').toggle(noPath);
        $$b('#tool_reorient').toggle(elname === 'path');
        $$b('#tool_reorient').toggleClass('disabled', angle === 0);
      } else {
        var point = path.getNodePoint();
        $$b('#tool_add_subpath').removeClass('push_button_pressed').addClass('tool_button');
        $$b('#tool_node_delete').toggleClass('disabled', !path.canDeleteNodes);

        // Show open/close button based on selected point
        setIcon('#tool_openclose_path', path.closed_subpath ? 'open_path' : 'close_path');

        if (point) {
          var segType = $$b('#seg_type');
          if (unit) {
            point.x = convertUnit(point.x);
            point.y = convertUnit(point.y);
          }
          $$b('#path_node_x').val(point.x);
          $$b('#path_node_y').val(point.y);
          if (point.type) {
            segType.val(point.type).removeAttr('disabled');
          } else {
            segType.val(4).attr('disabled', 'disabled');
          }
        }
        return;
      }

      // update contextual tools here
      var panels = {
        g: [],
        a: [],
        rect: ['rx', 'width', 'height'],
        image: ['width', 'height'],
        circle: ['cx', 'cy', 'r'],
        ellipse: ['cx', 'cy', 'rx', 'ry'],
        line: ['x1', 'y1', 'x2', 'y2'],
        text: [],
        use: []
      };

      var _elem = elem,
          tagName = _elem.tagName;

      // if ($(elem).data('gsvg')) {
      //   $('#g_panel').show();
      // }

      var linkHref = null;
      if (tagName === 'a') {
        linkHref = svgCanvas.getHref(elem);
        $$b('#g_panel').show();
      }

      if (elem.parentNode.tagName === 'a') {
        if (!$$b(elem).siblings().length) {
          $$b('#a_panel').show();
          linkHref = svgCanvas.getHref(elem.parentNode);
        }
      }

      // Hide/show the make_link buttons
      $$b('#tool_make_link, #tool_make_link').toggle(!linkHref);

      if (linkHref) {
        $$b('#link_url').val(linkHref);
      }

      if (panels[tagName]) {
        var curPanel = panels[tagName];

        $$b('#' + tagName + '_panel').show();

        $$b.each(curPanel, function (i, item) {
          var attrVal = elem.getAttribute(item);
          if (curConfig.baseUnit !== 'px' && elem[item]) {
            var bv = elem[item].baseVal.value;
            attrVal = convertUnit(bv);
          }
          $$b('#' + tagName + '_' + item).val(attrVal || 0);
        });

        if (tagName === 'text') {
          $$b('#text_panel').css('display', 'inline');
          $$b('#tool_font_size').css('display', 'inline');
          if (svgCanvas.getItalic()) {
            $$b('#tool_italic').addClass('push_button_pressed').removeClass('tool_button');
          } else {
            $$b('#tool_italic').removeClass('push_button_pressed').addClass('tool_button');
          }
          if (svgCanvas.getBold()) {
            $$b('#tool_bold').addClass('push_button_pressed').removeClass('tool_button');
          } else {
            $$b('#tool_bold').removeClass('push_button_pressed').addClass('tool_button');
          }
          $$b('#font_family').val(elem.getAttribute('font-family'));
          $$b('#font_size').val(elem.getAttribute('font-size'));
          $$b('#text').val(elem.textContent);
          if (svgCanvas.addedNew) {
            // Timeout needed for IE9
            setTimeout(function () {
              $$b('#text').focus().select();
            }, 100);
          }
          // text
        } else if (tagName === 'image' && svgCanvas.getMode() === 'image') {
          setImageURL(svgCanvas.getHref(elem));
          // image
        } else if (tagName === 'g' || tagName === 'use') {
          $$b('#container_panel').show();
          var title = svgCanvas.getTitle();
          var label = $$b('#g_title')[0];
          label.value = title;
          setInputWidth(label);
          $$b('#g_title').prop('disabled', tagName === 'use');
        }
      }
      menuItems[(tagName === 'g' ? 'en' : 'dis') + 'ableContextMenuItems']('#ungroup');
      menuItems[(tagName === 'g' || !multiselected ? 'dis' : 'en') + 'ableContextMenuItems']('#group');
      // if (elem != null)
    } else if (multiselected) {
      $$b('#multiselected_panel').show();
      menuItems.enableContextMenuItems('#group').disableContextMenuItems('#ungroup');
    } else {
      menuItems.disableContextMenuItems('#delete,#cut,#copy,#group,#ungroup,#move_front,#move_up,#move_down,#move_back');
    }

    // update history buttons
    $$b('#tool_undo').toggleClass('disabled', undoMgr.getUndoStackSize() === 0);
    $$b('#tool_redo').toggleClass('disabled', undoMgr.getRedoStackSize() === 0);

    svgCanvas.addedNew = false;

    if (elem && !isNode || multiselected) {
      // update the selected elements' layer
      $$b('#selLayerNames').removeAttr('disabled').val(currentLayerName);

      // Enable regular menu options
      canvMenu.enableContextMenuItems('#delete,#cut,#copy,#move_front,#move_up,#move_down,#move_back');
    } else {
      $$b('#selLayerNames').attr('disabled', 'disabled');
    }
  };

  var updateWireFrame = function updateWireFrame() {
    // Test support
    if (supportsNonSS) {
      return;
    }

    var rule = '#workarea.wireframe #svgcontent * { stroke-width: ' + 1 / svgCanvas.getZoom() + 'px; }';
    $$b('#wireframe_rules').text(workarea.hasClass('wireframe') ? rule : '');
  };

  var curContext = '';

  var updateTitle = function updateTitle(title) {
    title = title || svgCanvas.getDocumentTitle();
    var newTitle = origTitle + (title ? ': ' + title : '');

    // Remove title update with current context info, isn't really necessary
    // if (curContext) {
    //   new_title = new_title + curContext;
    // }
    $$b('title:first').text(newTitle);
  };

  // called when we've selected a different element
  /**
  *
  * @param win
  * @param elems Array of elements that were selected
  */
  var selectedChanged = function selectedChanged(win, elems) {
    var mode = svgCanvas.getMode();
    if (mode === 'select') {
      setSelectMode();
    }
    var isNode = mode === 'pathedit';
    // if elems[1] is present, then we have more than one element
    selectedElement = elems.length === 1 || elems[1] == null ? elems[0] : null;
    multiselected = elems.length >= 2 && elems[1] != null;
    if (selectedElement != null) {
      // unless we're already in always set the mode of the editor to select because
      // upon creation of a text element the editor is switched into
      // select mode and this event fires - we need our UI to be in sync

      if (!isNode) {
        updateToolbar();
      }
    } // if (elem != null)

    // Deal with pathedit mode
    togglePathEditMode(isNode, elems);
    updateContextPanel();
    svgCanvas.runExtensions('selectedChanged', {
      elems: elems,
      selectedElement: selectedElement,
      multiselected: multiselected
    });
  };

  // Call when part of element is in process of changing, generally
  // on mousemove actions like rotate, move, etc.
  var elementTransition = function elementTransition(win, elems) {
    var mode = svgCanvas.getMode();
    var elem = elems[0];

    if (!elem) {
      return;
    }

    multiselected = elems.length >= 2 && elems[1] != null;
    // Only updating fields for single elements for now
    if (!multiselected) {
      switch (mode) {
        case 'rotate':
          var ang = svgCanvas.getRotationAngle(elem);
          $$b('#angle').val(ang);
          $$b('#tool_reorient').toggleClass('disabled', ang === 0);
          break;

        // TODO: Update values that change on move/resize, etc
        // case 'select':
        // case 'resize':
        //   break;
      }
    }
    svgCanvas.runExtensions('elementTransition', {
      elems: elems
    });
  };

  /**
   * Test whether an element is a layer or not.
   * @param {SVGGElement} elem - The SVGGElement to test.
   * @returns {boolean} True if the element is a layer
   */
  function isLayer(elem) {
    return elem && elem.tagName === 'g' && Layer.CLASS_REGEX.test(elem.getAttribute('class'));
  }

  // called when any element has changed
  var elementChanged = function elementChanged(win, elems) {
    var mode = svgCanvas.getMode();
    if (mode === 'select') {
      setSelectMode();
    }

    for (var _i = 0; _i < elems.length; ++_i) {
      var elem = elems[_i];

      var isSvgElem = elem && elem.tagName === 'svg';
      if (isSvgElem || isLayer(elem)) {
        populateLayers();
        // if the element changed was the svg, then it could be a resolution change
        if (isSvgElem) {
          updateCanvas();
        }
        // Update selectedElement if element is no longer part of the image.
        // This occurs for the text elements in Firefox
      } else if (elem && selectedElement && selectedElement.parentNode == null) {
        // || elem && elem.tagName == "path" && !multiselected) { // This was added in r1430, but not sure why
        selectedElement = elem;
      }
    }

    editor.showSaveWarning = true;

    // we update the contextual panel with potentially new
    // positional/sizing information (we DON'T want to update the
    // toolbar here as that creates an infinite loop)
    // also this updates the history buttons

    // we tell it to skip focusing the text control if the
    // text element was previously in focus
    updateContextPanel();

    // In the event a gradient was flipped:
    if (selectedElement && mode === 'select') {
      paintBox.fill.update();
      paintBox.stroke.update();
    }

    svgCanvas.runExtensions('elementChanged', {
      elems: elems
    });
  };

  var zoomDone = function zoomDone() {
    updateWireFrame();
    // updateCanvas(); // necessary?
  };

  var zoomChanged = svgCanvas.zoomChanged = function (win, bbox, autoCenter) {
    var scrbar = 15,

    // res = svgCanvas.getResolution(), // Currently unused
    wArea = workarea;
    // const canvasPos = $('#svgcanvas').position(); // Currently unused
    var zInfo = svgCanvas.setBBoxZoom(bbox, wArea.width() - scrbar, wArea.height() - scrbar);
    if (!zInfo) {
      return;
    }
    var zoomlevel = zInfo.zoom,
        bb = zInfo.bbox;

    if (zoomlevel < 0.001) {
      changeZoom({ value: 0.1 });
      return;
    }

    $$b('#zoom').val((zoomlevel * 100).toFixed(1));

    if (autoCenter) {
      updateCanvas();
    } else {
      updateCanvas(false, { x: bb.x * zoomlevel + bb.width * zoomlevel / 2, y: bb.y * zoomlevel + bb.height * zoomlevel / 2 });
    }

    if (svgCanvas.getMode() === 'zoom' && bb.width) {
      // Go to select if a zoom box was drawn
      setSelectMode();
    }

    zoomDone();
  };

  var changeZoom = function changeZoom(ctl) {
    var zoomlevel = ctl.value / 100;
    if (zoomlevel < 0.001) {
      ctl.value = 0.1;
      return;
    }
    var zoom = svgCanvas.getZoom();
    var wArea = workarea;

    zoomChanged(window, {
      width: 0,
      height: 0,
      // center pt of scroll position
      x: (wArea[0].scrollLeft + wArea.width() / 2) / zoom,
      y: (wArea[0].scrollTop + wArea.height() / 2) / zoom,
      zoom: zoomlevel
    }, true);
  };

  $$b('#cur_context_panel').delegate('a', 'click', function () {
    var link = $$b(this);
    if (link.attr('data-root')) {
      svgCanvas.leaveContext();
    } else {
      svgCanvas.setContext(link.text());
    }
    svgCanvas.clearSelection();
    return false;
  });

  var contextChanged = function contextChanged(win, context) {
    var linkStr = '';
    if (context) {
      var _str2 = '';
      linkStr = '<a href="#" data-root="y">' + svgCanvas.getCurrentDrawing().getCurrentLayerName() + '</a>';

      $$b(context).parentsUntil('#svgcontent > g').andSelf().each(function () {
        if (this.id) {
          _str2 += ' > ' + this.id;
          if (this !== context) {
            linkStr += ' > <a href="#">' + this.id + '</a>';
          } else {
            linkStr += ' > ' + this.id;
          }
        }
      });

      curContext = _str2;
    } else {
      curContext = null;
    }
    $$b('#cur_context_panel').toggle(!!context).html(linkStr);

    updateTitle();
  };

  // Makes sure the current selected paint is available to work with
  var prepPaints = function prepPaints() {
    paintBox.fill.prep();
    paintBox.stroke.prep();
  };

  var flyoutFuncs = {};

  var setFlyoutTitles = function setFlyoutTitles() {
    $$b('.tools_flyout').each(function () {
      var shower = $$b('#' + this.id + '_show');
      if (shower.data('isLibrary')) {
        return;
      }

      var tooltips = [];
      $$b(this).children().each(function () {
        tooltips.push(this.title);
      });
      shower[0].title = tooltips.join(' / ');
    });
  };

  var setupFlyouts = function setupFlyouts(holders) {
    $$b.each(holders, function (holdSel, btnOpts) {
      var buttons = $$b(holdSel).children();
      var showSel = holdSel + '_show';
      var shower = $$b(showSel);
      var def = false;
      buttons.addClass('tool_button').unbind('click mousedown mouseup') // may not be necessary
      .each(function (i) {
        // Get this buttons options
        var opts = btnOpts[i];

        // Remember the function that goes with this ID
        flyoutFuncs[opts.sel] = opts.fn;

        if (opts.isDefault) {
          def = i;
        }

        // Clicking the icon in flyout should set this set's icon
        var func = function func(event) {
          var options = opts;
          // Find the currently selected tool if comes from keystroke
          if (event.type === 'keydown') {
            var flyoutIsSelected = $$b(options.parent + '_show').hasClass('tool_button_current');
            var currentOperation = $$b(options.parent + '_show').attr('data-curopt');
            $$b.each(holders[opts.parent], function (i, tool) {
              if (tool.sel === currentOperation) {
                if (!event.shiftKey || !flyoutIsSelected) {
                  options = tool;
                } else {
                  options = holders[opts.parent][i + 1] || holders[opts.parent][0];
                }
              }
            });
          }
          if ($$b(this).hasClass('disabled')) {
            return false;
          }
          if (toolButtonClick(showSel)) {
            options.fn();
          }
          var icon = void 0;
          if (options.icon) {
            icon = $$b.getSvgIcon(options.icon, true);
          } else {
            icon = $$b(options.sel).children().eq(0).clone();
          }

          icon[0].setAttribute('width', shower.width());
          icon[0].setAttribute('height', shower.height());
          shower.children(':not(.flyout_arrow_horiz)').remove();
          shower.append(icon).attr('data-curopt', options.sel); // This sets the current mode
        };

        $$b(this).mouseup(func);

        if (opts.key) {
          $$b(document).bind('keydown', opts.key[0] + ' shift+' + opts.key[0], func);
        }
      });

      if (def) {
        shower.attr('data-curopt', btnOpts[def].sel);
      } else if (!shower.attr('data-curopt')) {
        // Set first as default
        shower.attr('data-curopt', btnOpts[0].sel);
      }

      var timer = void 0;
      var pos = $$b(showSel).position();

      // Clicking the "show" icon should set the current mode
      shower.mousedown(function (evt) {
        if (shower.hasClass('disabled')) {
          return false;
        }
        var holder = $$b(holdSel);
        var l = pos.left + 34;
        var w = holder.width() * -1;
        var time = holder.data('shown_popop') ? 200 : 0;
        timer = setTimeout(function () {
          // Show corresponding menu
          if (!shower.data('isLibrary')) {
            holder.css('left', w).show().animate({
              left: l
            }, 150);
          } else {
            holder.css('left', l).show();
          }
          holder.data('shown_popop', true);
        }, time);
        evt.preventDefault();
      }).mouseup(function (evt) {
        clearTimeout(timer);
        var opt = $$b(this).attr('data-curopt');
        // Is library and popped up, so do nothing
        if (shower.data('isLibrary') && $$b(showSel.replace('_show', '')).is(':visible')) {
          toolButtonClick(showSel, true);
          return;
        }
        if (toolButtonClick(showSel) && flyoutFuncs[opt]) {
          flyoutFuncs[opt]();
        }
      });
      // $('#tools_rect').mouseleave(function () { $('#tools_rect').fadeOut(); });
    });
    setFlyoutTitles();
    setFlyoutPositions();
  };

  var makeFlyoutHolder = function makeFlyoutHolder(id, child) {
    var div = $$b('<div>', {
      class: 'tools_flyout',
      id: id
    }).appendTo('#svg_editor').append(child);

    return div;
  };

  // TODO: Combine this with addDropDown or find other way to optimize
  var addAltDropDown = function addAltDropDown(elem, list, callback, opts) {
    var button = $$b(elem);
    var dropUp = opts.dropUp;

    list = $$b(list);
    if (dropUp) {
      $$b(elem).addClass('dropup');
    }
    list.find('li').bind('mouseup', function () {
      if (opts.seticon) {
        setIcon('#cur_' + button[0].id, $$b(this).children());
        $$b(this).addClass('current').siblings().removeClass('current');
      }
      callback.apply(this, arguments);
    });

    var onButton = false;
    $$b(window).mouseup(function (evt) {
      if (!onButton) {
        button.removeClass('down');
        list.hide();
        list.css({ top: 0, left: 0 });
      }
      onButton = false;
    });

    // const height = list.height(); // Currently unused
    button.bind('mousedown', function () {
      var off = button.offset();
      if (dropUp) {
        off.top -= list.height();
        off.left += 8;
      } else {
        off.top += button.height();
      }
      list.offset(off);

      if (!button.hasClass('down')) {
        list.show();
        onButton = true;
      } else {
        // CSS position must be reset for Webkit
        list.hide();
        list.css({ top: 0, left: 0 });
      }
      button.toggleClass('down');
    }).hover(function () {
      onButton = true;
    }).mouseout(function () {
      onButton = false;
    });

    if (opts.multiclick) {
      list.mousedown(function () {
        onButton = true;
      });
    }
  };

  var extsPreLang = [];
  var extAdded = function extAdded(win, ext) {
    if (!ext) {
      return;
    }
    var cbCalled = false;
    var resizeDone = false;
    var cbReady = true; // Set to false to delay callback (e.g. wait for $.svgIcons)

    if (ext.langReady) {
      if (editor.langChanged) {
        // We check for this since the "lang" pref could have been set by storage
        var lang = $$b.pref('lang');
        ext.langReady({ lang: lang, uiStrings: uiStrings$1 });
      } else {
        extsPreLang.push(ext);
      }
    }

    function prepResize() {
      if (resizeTimer) {
        clearTimeout(resizeTimer);
        resizeTimer = null;
      }
      if (!resizeDone) {
        resizeTimer = setTimeout(function () {
          resizeDone = true;
          setIconSize($$b.pref('iconsize'));
        }, 50);
      }
    }

    var runCallback = function runCallback() {
      if (ext.callback && !cbCalled && cbReady) {
        cbCalled = true;
        ext.callback.call(editor);
      }
    };

    var btnSelects = [];

    if (ext.context_tools) {
      $$b.each(ext.context_tools, function (i, tool) {
        // Add select tool
        var contId = tool.container_id ? ' id="' + tool.container_id + '"' : '';

        var panel = $$b('#' + tool.panel);
        // create the panel if it doesn't exist
        if (!panel.length) {
          panel = $$b('<div>', { id: tool.panel }).appendTo('#tools_top');
        }

        var html = void 0;
        // TODO: Allow support for other types, or adding to existing tool
        switch (tool.type) {
          case 'tool_button':
            html = '<div class="tool_button">' + tool.id + '</div>';
            var div = $$b(html).appendTo(panel);
            if (tool.events) {
              $$b.each(tool.events, function (evt, func) {
                $$b(div).bind(evt, func);
              });
            }
            break;
          case 'select':
            html = '<label' + contId + '>' + '<select id="' + tool.id + '">';
            $$b.each(tool.options, function (val, text) {
              var sel = val === tool.defval ? ' selected' : '';
              html += '<option value="' + val + '"' + sel + '>' + text + '</option>';
            });
            html += '</select></label>';
            // Creates the tool, hides & adds it, returns the select element
            var sel = $$b(html).appendTo(panel).find('select');

            $$b.each(tool.events, function (evt, func) {
              $$b(sel).bind(evt, func);
            });
            break;
          case 'button-select':
            html = '<div id="' + tool.id + '" class="dropdown toolset" title="' + tool.title + '">' + '<div id="cur_' + tool.id + '" class="icon_label"></div><button></button></div>';

            var list = $$b('<ul id="' + tool.id + '_opts"></ul>').appendTo('#option_lists');

            if (tool.colnum) {
              list.addClass('optcols' + tool.colnum);
            }

            // Creates the tool, hides & adds it, returns the select element
            /* const dropdown = */$$b(html).appendTo(panel).children();

            btnSelects.push({
              elem: '#' + tool.id,
              list: '#' + tool.id + '_opts',
              title: tool.title,
              callback: tool.events.change,
              cur: '#cur_' + tool.id
            });

            break;
          case 'input':
            html = '<label' + contId + '>' + '<span id="' + tool.id + '_label">' + tool.label + ':</span>' + '<input id="' + tool.id + '" title="' + tool.title + '" size="' + (tool.size || '4') + '" value="' + (tool.defval || '') + '" type="text"/></label>';

            // Creates the tool, hides & adds it, returns the select element

            // Add to given tool.panel
            var inp = $$b(html).appendTo(panel).find('input');

            if (tool.spindata) {
              inp.SpinButton(tool.spindata);
            }

            if (tool.events) {
              $$b.each(tool.events, function (evt, func) {
                inp.bind(evt, func);
              });
            }
            break;

          default:
            break;
        }
      });
    }

    if (ext.buttons) {
      var fallbackObj = {},
          placementObj = {},
          svgicons = ext.svgicons,
          holders = {};

      // Add buttons given by extension
      $$b.each(ext.buttons, function (i, btn) {
        var icon = void 0,
            svgicon = void 0,
            tlsId = void 0;

        var id = btn.id;

        var num = i;
        // Give button a unique ID
        while ($$b('#' + id).length) {
          id = btn.id + '_' + ++num;
        }

        if (!svgicons) {
          icon = $$b('<img src="' + btn.icon + '">');
        } else {
          fallbackObj[id] = btn.icon;
          svgicon = btn.svgicon || btn.id;
          if (btn.type === 'app_menu') {
            placementObj['#' + id + ' > div'] = svgicon;
          } else {
            placementObj['#' + id] = svgicon;
          }
        }

        var cls = void 0,
            parent = void 0;

        // Set button up according to its type
        switch (btn.type) {
          case 'mode_flyout':
          case 'mode':
            cls = 'tool_button';
            parent = '#tools_left';
            break;
          case 'context':
            cls = 'tool_button';
            parent = '#' + btn.panel;
            // create the panel if it doesn't exist
            if (!$$b(parent).length) {
              $$b('<div>', { id: btn.panel }).appendTo('#tools_top');
            }
            break;
          case 'app_menu':
            cls = '';
            parent = '#main_menu ul';
            break;
        }
        var flyoutHolder = void 0,
            curH = void 0,
            showBtn = void 0,
            refData = void 0,
            refBtn = void 0;
        var button = $$b(btn.list || btn.type === 'app_menu' ? '<li/>' : '<div/>').attr('id', id).attr('title', btn.title).addClass(cls);
        if (!btn.includeWith && !btn.list) {
          if ('position' in btn) {
            if ($$b(parent).children().eq(btn.position).length) {
              $$b(parent).children().eq(btn.position).before(button);
            } else {
              $$b(parent).children().last().before(button);
            }
          } else {
            button.appendTo(parent);
          }

          if (btn.type === 'mode_flyout') {
            // Add to flyout menu / make flyout menu
            // const opts = btn.includeWith;
            // // opts.button, default, position
            refBtn = $$b(button);

            flyoutHolder = refBtn.parent();
            // Create a flyout menu if there isn't one already
            if (!refBtn.parent().hasClass('tools_flyout')) {
              // Create flyout placeholder
              tlsId = refBtn[0].id.replace('tool_', 'tools_');
              showBtn = refBtn.clone().attr('id', tlsId + '_show').append($$b('<div>', { class: 'flyout_arrow_horiz' }));

              refBtn.before(showBtn);

              // Create a flyout div
              flyoutHolder = makeFlyoutHolder(tlsId, refBtn);
              flyoutHolder.data('isLibrary', true);
              showBtn.data('isLibrary', true);
            }
            // refData = Actions.getButtonData(opts.button);

            placementObj['#' + tlsId + '_show'] = btn.id;
            // TODO: Find way to set the current icon using the iconloader if this is not default

            // Include data for extension button as well as ref button
            curH = holders['#' + flyoutHolder[0].id] = [{
              sel: '#' + id,
              fn: btn.events.click,
              icon: btn.id,
              // key: btn.key,
              isDefault: true
            }, refData];
            //
            // // {sel:'#tool_rect', fn: clickRect, evt: 'mouseup', key: 4, parent: '#tools_rect', icon: 'rect'}
            //
            // const pos = ('position' in opts)?opts.position:'last';
            // const len = flyoutHolder.children().length;
            //
            // // Add at given position or end
            // if (!isNaN(pos) && pos >= 0 && pos < len) {
            //   flyoutHolder.children().eq(pos).before(button);
            // } else {
            //   flyoutHolder.append(button);
            //   curH.reverse();
            // }
          } else if (btn.type === 'app_menu') {
            button.append('<div>').append(btn.title);
          }
        } else if (btn.list) {
          // Add button to list
          button.addClass('push_button');
          $$b('#' + btn.list + '_opts').append(button);
          if (btn.isDefault) {
            $$b('#cur_' + btn.list).append(button.children().clone());
            svgicon = btn.svgicon || btn.id;
            placementObj['#cur_' + btn.list] = svgicon;
          }
        } else if (btn.includeWith) {
          // Add to flyout menu / make flyout menu
          var opts = btn.includeWith;
          // opts.button, default, position
          refBtn = $$b(opts.button);

          flyoutHolder = refBtn.parent();
          // Create a flyout menu if there isn't one already
          if (!refBtn.parent().hasClass('tools_flyout')) {
            // Create flyout placeholder
            tlsId = refBtn[0].id.replace('tool_', 'tools_');
            showBtn = refBtn.clone().attr('id', tlsId + '_show').append($$b('<div>', { class: 'flyout_arrow_horiz' }));

            refBtn.before(showBtn);

            // Create a flyout div
            flyoutHolder = makeFlyoutHolder(tlsId, refBtn);
          }

          refData = Actions.getButtonData(opts.button);

          if (opts.isDefault) {
            placementObj['#' + tlsId + '_show'] = btn.id;
          }
          // TODO: Find way to set the current icon using the iconloader if this is not default

          // Include data for extension button as well as ref button
          curH = holders['#' + flyoutHolder[0].id] = [{
            sel: '#' + id,
            fn: btn.events.click,
            icon: btn.id,
            key: btn.key,
            isDefault: btn.includeWith ? btn.includeWith.isDefault : 0
          }, refData];

          // {sel:'#tool_rect', fn: clickRect, evt: 'mouseup', key: 4, parent: '#tools_rect', icon: 'rect'}

          var pos = 'position' in opts ? opts.position : 'last';
          var len = flyoutHolder.children().length;

          // Add at given position or end
          if (!isNaN(pos) && pos >= 0 && pos < len) {
            flyoutHolder.children().eq(pos).before(button);
          } else {
            flyoutHolder.append(button);
            curH.reverse();
          }
        }

        if (!svgicons) {
          button.append(icon);
        }

        if (!btn.list) {
          // Add given events to button
          $$b.each(btn.events, function (name, func) {
            if (name === 'click' && btn.type === 'mode') {
              if (btn.includeWith) {
                button.bind(name, func);
              } else {
                button.bind(name, function () {
                  if (toolButtonClick(button)) {
                    func();
                  }
                });
              }
              if (btn.key) {
                $$b(document).bind('keydown', btn.key, func);
                if (btn.title) {
                  button.attr('title', btn.title + ' [' + btn.key + ']');
                }
              }
            } else {
              button.bind(name, func);
            }
          });
        }

        setupFlyouts(holders);
      });

      $$b.each(btnSelects, function () {
        addAltDropDown(this.elem, this.list, this.callback, { seticon: true });
      });

      if (svgicons) {
        cbReady = false; // Delay callback
      }

      $$b.svgIcons(svgicons, {
        w: 24, h: 24,
        id_match: false,
        no_img: !isWebkit(),
        fallback: fallbackObj,
        placement: placementObj,
        callback: function callback(icons) {
          // Non-ideal hack to make the icon match the current size
          // if (curPrefs.iconsize && curPrefs.iconsize !== 'm') {
          if ($$b.pref('iconsize') !== 'm') {
            prepResize();
          }
          cbReady = true; // Ready for callback
          runCallback();
        }
      });
    }

    runCallback();
  };

  var getPaint = function getPaint(color, opac, type) {
    // update the editor's fill paint
    var opts = { alpha: opac };
    if (color.startsWith('url(#')) {
      var refElem = svgCanvas.getRefElem(color);
      if (refElem) {
        refElem = refElem.cloneNode(true);
      } else {
        refElem = $$b('#' + type + '_color defs *')[0];
      }
      opts[refElem.tagName] = refElem;
    } else if (color.startsWith('#')) {
      opts.solidColor = color.substr(1);
    } else {
      opts.solidColor = 'none';
    }
    return new $$b.jGraduate.Paint(opts);
  };

  // $('#text').focus(function () { textBeingEntered = true; });
  // $('#text').blur(function () { textBeingEntered = false; });

  // bind the selected event to our function that handles updates to the UI
  svgCanvas.bind('selected', selectedChanged);
  svgCanvas.bind('transition', elementTransition);
  svgCanvas.bind('changed', elementChanged);
  svgCanvas.bind('saved', saveHandler);
  svgCanvas.bind('exported', exportHandler);
  svgCanvas.bind('exportedPDF', function (win, data) {
    var exportWindowName = data.exportWindowName;

    if (exportWindowName) {
      exportWindow = window.open('', exportWindowName); // A hack to get the window via JSON-able name without opening a new one
    }
    if (!exportWindow || exportWindow.closed) {
      $$b.alert(uiStrings$1.notification.popupWindowBlocked);
      return;
    }
    exportWindow.location.href = data.dataurlstring;
  });
  svgCanvas.bind('zoomed', zoomChanged);
  svgCanvas.bind('zoomDone', zoomDone);
  svgCanvas.bind('updateCanvas', function (win, _ref5) {
    var center = _ref5.center,
        newCtr = _ref5.newCtr;

    updateCanvas(center, newCtr);
  });
  svgCanvas.bind('contextset', contextChanged);
  svgCanvas.bind('extension_added', extAdded);
  svgCanvas.textActions.setInputElem($$b('#text')[0]);

  var str = '<div class="palette_item" data-rgb="none"></div>';
  $$b.each(palette, function (i, item) {
    str += '<div class="palette_item" style="background-color: ' + item + ';" data-rgb="' + item + '"></div>';
  });
  $$b('#palette').append(str);

  // Set up editor background functionality
  // TODO add checkerboard as "pattern"
  var colorBlocks = ['#FFF', '#888', '#000']; // ,'url(data:image/gif;base64,R0lGODlhEAAQAIAAAP%2F%2F%2F9bW1iH5BAAAAAAALAAAAAAQABAAAAIfjG%2Bgq4jM3IFLJgpswNly%2FXkcBpIiVaInlLJr9FZWAQA7)'];
  str = '';
  $$b.each(colorBlocks, function () {
    str += '<div class="color_block" style="background-color:' + this + ';"></div>';
  });
  $$b('#bg_blocks').append(str);
  var blocks = $$b('#bg_blocks div');
  var curBg = 'cur_background';
  blocks.each(function () {
    var blk = $$b(this);
    blk.click(function () {
      blocks.removeClass(curBg);
      $$b(this).addClass(curBg);
    });
  });

  setBackground($$b.pref('bkgd_color'), $$b.pref('bkgd_url'));

  $$b('#image_save_opts input').val([$$b.pref('img_save')]);

  var changeRectRadius = function changeRectRadius(ctl) {
    svgCanvas.setRectRadius(ctl.value);
  };

  var changeFontSize = function changeFontSize(ctl) {
    svgCanvas.setFontSize(ctl.value);
  };

  var changeStrokeWidth = function changeStrokeWidth(ctl) {
    var val = ctl.value;
    if (val === 0 && selectedElement && ['line', 'polyline'].includes(selectedElement.nodeName)) {
      val = ctl.value = 1;
    }
    svgCanvas.setStrokeWidth(val);
  };

  var changeRotationAngle = function changeRotationAngle(ctl) {
    svgCanvas.setRotationAngle(ctl.value);
    $$b('#tool_reorient').toggleClass('disabled', parseInt(ctl.value, 10) === 0);
  };

  var changeOpacity = function changeOpacity(ctl, val) {
    if (val == null) {
      val = ctl.value;
    }
    $$b('#group_opacity').val(val);
    if (!ctl || !ctl.handle) {
      $$b('#opac_slider').slider('option', 'value', val);
    }
    svgCanvas.setOpacity(val / 100);
  };

  var changeBlur = function changeBlur(ctl, val, noUndo) {
    if (val == null) {
      val = ctl.value;
    }
    $$b('#blur').val(val);
    var complete = false;
    if (!ctl || !ctl.handle) {
      $$b('#blur_slider').slider('option', 'value', val);
      complete = true;
    }
    if (noUndo) {
      svgCanvas.setBlurNoUndo(val);
    } else {
      svgCanvas.setBlur(val, complete);
    }
  };

  $$b('#stroke_style').change(function () {
    svgCanvas.setStrokeAttr('stroke-dasharray', $$b(this).val());
    operaRepaint();
  });

  $$b('#stroke_linejoin').change(function () {
    svgCanvas.setStrokeAttr('stroke-linejoin', $$b(this).val());
    operaRepaint();
  });

  // Lose focus for select elements when changed (Allows keyboard shortcuts to work better)
  $$b('select').change(function () {
    $$b(this).blur();
  });

  // fired when user wants to move elements to another layer
  var promptMoveLayerOnce = false;
  $$b('#selLayerNames').change(function () {
    var destLayer = this.options[this.selectedIndex].value;
    var confirmStr = uiStrings$1.notification.QmoveElemsToLayer.replace('%s', destLayer);
    var moveToLayer = function moveToLayer(ok) {
      if (!ok) {
        return;
      }
      promptMoveLayerOnce = true;
      svgCanvas.moveSelectedToLayer(destLayer);
      svgCanvas.clearSelection();
      populateLayers();
    };
    if (destLayer) {
      if (promptMoveLayerOnce) {
        moveToLayer(true);
      } else {
        $$b.confirm(confirmStr, moveToLayer);
      }
    }
  });

  $$b('#font_family').change(function () {
    svgCanvas.setFontFamily(this.value);
  });

  $$b('#seg_type').change(function () {
    svgCanvas.setSegType($$b(this).val());
  });

  $$b('#text').bind('keyup input', function () {
    svgCanvas.setTextContent(this.value);
  });

  $$b('#image_url').change(function () {
    setImageURL(this.value);
  });

  $$b('#link_url').change(function () {
    if (this.value.length) {
      svgCanvas.setLinkURL(this.value);
    } else {
      svgCanvas.removeHyperlink();
    }
  });

  $$b('#g_title').change(function () {
    svgCanvas.setGroupTitle(this.value);
  });

  $$b('.attr_changer').change(function () {
    var attr = this.getAttribute('data-attr');
    var val = this.value;
    var valid = isValidUnit(attr, val, selectedElement);

    if (!valid) {
      $$b.alert(uiStrings$1.notification.invalidAttrValGiven);
      this.value = selectedElement.getAttribute(attr);
      return false;
    }

    if (attr !== 'id' && attr !== 'class') {
      if (isNaN(val)) {
        val = svgCanvas.convertToNum(attr, val);
      } else if (curConfig.baseUnit !== 'px') {
        // Convert unitless value to one with given unit

        var unitData = getTypeMap();

        if (selectedElement[attr] || svgCanvas.getMode() === 'pathedit' || attr === 'x' || attr === 'y') {
          val *= unitData[curConfig.baseUnit];
        }
      }
    }

    // if the user is changing the id, then de-select the element first
    // change the ID, then re-select it with the new ID
    if (attr === 'id') {
      var elem = selectedElement;
      svgCanvas.clearSelection();
      elem.id = val;
      svgCanvas.addToSelection([elem], true);
    } else {
      svgCanvas.changeSelectedAttribute(attr, val);
    }
    this.blur();
  });

  // Prevent selection of elements when shift-clicking
  $$b('#palette').mouseover(function () {
    var inp = $$b('<input type="hidden">');
    $$b(this).append(inp);
    inp.focus().remove();
  });

  $$b('.palette_item').mousedown(function (evt) {
    // shift key or right click for stroke
    var picker = evt.shiftKey || evt.button === 2 ? 'stroke' : 'fill';
    var color = $$b(this).data('rgb');
    var paint = void 0;

    // Webkit-based browsers returned 'initial' here for no stroke
    if (color === 'none' || color === 'transparent' || color === 'initial') {
      color = 'none';
      paint = new $$b.jGraduate.Paint();
    } else {
      paint = new $$b.jGraduate.Paint({ alpha: 100, solidColor: color.substr(1) });
    }

    paintBox[picker].setPaint(paint);
    svgCanvas.setColor(picker, color);

    if (color !== 'none' && svgCanvas.getPaintOpacity(picker) !== 1) {
      svgCanvas.setPaintOpacity(picker, 1.0);
    }
    updateToolButtonState();
  }).bind('contextmenu', function (e) {
    e.preventDefault();
  });

  $$b('#toggle_stroke_tools').on('click', function () {
    $$b('#tools_bottom').toggleClass('expanded');
  });

  (function () {
    var wArea = workarea[0];

    var lastX = null,
        lastY = null,
        panning = false,
        keypan = false;

    $$b('#svgcanvas').bind('mousemove mouseup', function (evt) {
      if (panning === false) {
        return;
      }

      wArea.scrollLeft -= evt.clientX - lastX;
      wArea.scrollTop -= evt.clientY - lastY;

      lastX = evt.clientX;
      lastY = evt.clientY;

      if (evt.type === 'mouseup') {
        panning = false;
      }
      return false;
    }).mousedown(function (evt) {
      if (evt.button === 1 || keypan === true) {
        panning = true;
        lastX = evt.clientX;
        lastY = evt.clientY;
        return false;
      }
    });

    $$b(window).mouseup(function () {
      panning = false;
    });

    $$b(document).bind('keydown', 'space', function (evt) {
      svgCanvas.spaceKey = keypan = true;
      evt.preventDefault();
    }).bind('keyup', 'space', function (evt) {
      evt.preventDefault();
      svgCanvas.spaceKey = keypan = false;
    }).bind('keydown', 'shift', function (evt) {
      if (svgCanvas.getMode() === 'zoom') {
        workarea.css('cursor', zoomOutIcon);
      }
    }).bind('keyup', 'shift', function (evt) {
      if (svgCanvas.getMode() === 'zoom') {
        workarea.css('cursor', zoomInIcon);
      }
    });

    /**
    * @param {Boolean} active
    */
    editor.setPanning = function (active) {
      svgCanvas.spaceKey = keypan = active;
    };
  })();

  (function () {
    var button = $$b('#main_icon');
    var overlay = $$b('#main_icon span');
    var list = $$b('#main_menu');

    var onButton = false;
    var height = 0;
    var jsHover = true;
    var setClick = false;

    /*
    // Currently unused
    const hideMenu = function () {
      list.fadeOut(200);
    };
    */

    $$b(window).mouseup(function (evt) {
      if (!onButton) {
        button.removeClass('buttondown');
        // do not hide if it was the file input as that input needs to be visible
        // for its change event to fire
        if (evt.target.tagName !== 'INPUT') {
          list.fadeOut(200);
        } else if (!setClick) {
          setClick = true;
          $$b(evt.target).click(function () {
            list.css('margin-left', '-9999px').show();
          });
        }
      }
      onButton = false;
    }).mousedown(function (evt) {
      // $('.contextMenu').hide();
      var islib = $$b(evt.target).closest('div.tools_flyout, .contextMenu').length;
      if (!islib) {
        $$b('.tools_flyout:visible,.contextMenu').fadeOut(250);
      }
    });

    overlay.bind('mousedown', function () {
      if (!button.hasClass('buttondown')) {
        // Margin must be reset in case it was changed before;
        list.css('margin-left', 0).show();
        if (!height) {
          height = list.height();
        }
        // Using custom animation as slideDown has annoying 'bounce effect'
        list.css('height', 0).animate({
          height: height
        }, 200);
        onButton = true;
      } else {
        list.fadeOut(200);
      }
      button.toggleClass('buttondown buttonup');
    }).hover(function () {
      onButton = true;
    }).mouseout(function () {
      onButton = false;
    });

    var listItems = $$b('#main_menu li');

    // Check if JS method of hovering needs to be used (Webkit bug)
    listItems.mouseover(function () {
      jsHover = $$b(this).css('background-color') === 'rgba(0, 0, 0, 0)';

      listItems.unbind('mouseover');
      if (jsHover) {
        listItems.mouseover(function () {
          this.style.backgroundColor = '#FFC';
        }).mouseout(function () {
          this.style.backgroundColor = 'transparent';
          return true;
        });
      }
    });
  })();
  // Made public for UI customization.
  // TODO: Group UI functions into a public editor.ui interface.
  /**
  * @param {Element|String} elem DOM Element or selector
  * @param {Function} callback Mouseup callback
  * @param {Boolean} dropUp
  */
  editor.addDropDown = function (elem, callback, dropUp) {
    if (!$$b(elem).length) {
      return;
    } // Quit if called on non-existent element
    var button = $$b(elem).find('button');
    var list = $$b(elem).find('ul').attr('id', $$b(elem)[0].id + '-list');
    if (dropUp) {
      $$b(elem).addClass('dropup');
    } else {
      // Move list to place where it can overflow container
      $$b('#option_lists').append(list);
    }
    list.find('li').bind('mouseup', callback);

    var onButton = false;
    $$b(window).mouseup(function (evt) {
      if (!onButton) {
        button.removeClass('down');
        list.hide();
      }
      onButton = false;
    });

    button.bind('mousedown', function () {
      if (!button.hasClass('down')) {
        if (!dropUp) {
          var pos = $$b(elem).position();
          list.css({
            top: pos.top + 24,
            left: pos.left - 10
          });
        }
        list.show();
        onButton = true;
      } else {
        list.hide();
      }
      button.toggleClass('down');
    }).hover(function () {
      onButton = true;
    }).mouseout(function () {
      onButton = false;
    });
  };

  editor.addDropDown('#font_family_dropdown', function () {
    $$b('#font_family').val($$b(this).text()).change();
  });

  editor.addDropDown('#opacity_dropdown', function () {
    if ($$b(this).find('div').length) {
      return;
    }
    var perc = parseInt($$b(this).text().split('%')[0], 10);
    changeOpacity(false, perc);
  }, true);

  // For slider usage, see: http://jqueryui.com/demos/slider/
  $$b('#opac_slider').slider({
    start: function start() {
      $$b('#opacity_dropdown li:not(.special)').hide();
    },
    stop: function stop() {
      $$b('#opacity_dropdown li').show();
      $$b(window).mouseup();
    },
    slide: function slide(evt, ui) {
      changeOpacity(ui);
    }
  });

  editor.addDropDown('#blur_dropdown', $$b.noop);

  var slideStart = false;
  $$b('#blur_slider').slider({
    max: 10,
    step: 0.1,
    stop: function stop(evt, ui) {
      slideStart = false;
      changeBlur(ui);
      $$b('#blur_dropdown li').show();
      $$b(window).mouseup();
    },
    start: function start() {
      slideStart = true;
    },
    slide: function slide(evt, ui) {
      changeBlur(ui, null, slideStart);
    }
  });

  editor.addDropDown('#zoom_dropdown', function () {
    var item = $$b(this);
    var val = item.data('val');
    if (val) {
      zoomChanged(window, val);
    } else {
      changeZoom({ value: parseFloat(item.text()) });
    }
  }, true);

  addAltDropDown('#stroke_linecap', '#linecap_opts', function () {
    setStrokeOpt(this, true);
  }, { dropUp: true });

  addAltDropDown('#stroke_linejoin', '#linejoin_opts', function () {
    setStrokeOpt(this, true);
  }, { dropUp: true });

  addAltDropDown('#tool_position', '#position_opts', function () {
    var letter = this.id.replace('tool_pos', '').charAt(0);
    svgCanvas.alignSelectedElements(letter, 'page');
  }, { multiclick: true });

  /*
   When a flyout icon is selected
    (if flyout) {
    - Change the icon
    - Make pressing the button run its stuff
    }
    - Run its stuff
   When its shortcut key is pressed
    - If not current in list, do as above
    , else:
    - Just run its stuff
   */

  // Unfocus text input when workarea is mousedowned.
  (function () {
    var inp = void 0;
    var unfocus = function unfocus() {
      $$b(inp).blur();
    };

    $$b('#svg_editor').find('button, select, input:not(#text)').focus(function () {
      inp = this;
      uiContext = 'toolbars';
      workarea.mousedown(unfocus);
    }).blur(function () {
      uiContext = 'canvas';
      workarea.unbind('mousedown', unfocus);
      // Go back to selecting text if in textedit mode
      if (svgCanvas.getMode() === 'textedit') {
        $$b('#text').focus();
      }
    });
  })();

  var clickFHPath = function clickFHPath() {
    if (toolButtonClick('#tool_fhpath')) {
      svgCanvas.setMode('fhpath');
    }
  };

  var clickLine = function clickLine() {
    if (toolButtonClick('#tool_line')) {
      svgCanvas.setMode('line');
    }
  };

  var clickSquare = function clickSquare() {
    if (toolButtonClick('#tool_square')) {
      svgCanvas.setMode('square');
    }
  };

  var clickRect = function clickRect() {
    if (toolButtonClick('#tool_rect')) {
      svgCanvas.setMode('rect');
    }
  };

  var clickFHRect = function clickFHRect() {
    if (toolButtonClick('#tool_fhrect')) {
      svgCanvas.setMode('fhrect');
    }
  };

  var clickCircle = function clickCircle() {
    if (toolButtonClick('#tool_circle')) {
      svgCanvas.setMode('circle');
    }
  };

  var clickEllipse = function clickEllipse() {
    if (toolButtonClick('#tool_ellipse')) {
      svgCanvas.setMode('ellipse');
    }
  };

  var clickFHEllipse = function clickFHEllipse() {
    if (toolButtonClick('#tool_fhellipse')) {
      svgCanvas.setMode('fhellipse');
    }
  };

  var clickImage = function clickImage() {
    if (toolButtonClick('#tool_image')) {
      svgCanvas.setMode('image');
    }
  };

  var clickZoom = function clickZoom() {
    if (toolButtonClick('#tool_zoom')) {
      svgCanvas.setMode('zoom');
      workarea.css('cursor', zoomInIcon);
    }
  };

  var zoomImage = function zoomImage(multiplier) {
    var res = svgCanvas.getResolution();
    multiplier = multiplier ? res.zoom * multiplier : 1;
    // setResolution(res.w * multiplier, res.h * multiplier, true);
    $$b('#zoom').val(multiplier * 100);
    svgCanvas.setZoom(multiplier);
    zoomDone();
    updateCanvas(true);
  };

  var dblclickZoom = function dblclickZoom() {
    if (toolButtonClick('#tool_zoom')) {
      zoomImage();
      setSelectMode();
    }
  };

  var clickText = function clickText() {
    if (toolButtonClick('#tool_text')) {
      svgCanvas.setMode('text');
    }
  };

  var clickPath = function clickPath() {
    if (toolButtonClick('#tool_path')) {
      svgCanvas.setMode('path');
    }
  };

  // Delete is a contextual tool that only appears in the ribbon if
  // an element has been selected
  var deleteSelected = function deleteSelected() {
    if (selectedElement != null || multiselected) {
      svgCanvas.deleteSelectedElements();
    }
  };

  var cutSelected = function cutSelected() {
    if (selectedElement != null || multiselected) {
      svgCanvas.cutSelectedElements();
    }
  };

  var copySelected = function copySelected() {
    if (selectedElement != null || multiselected) {
      svgCanvas.copySelectedElements();
    }
  };

  var pasteInCenter = function pasteInCenter() {
    var zoom = svgCanvas.getZoom();
    var x = (workarea[0].scrollLeft + workarea.width() / 2) / zoom - svgCanvas.contentW;
    var y = (workarea[0].scrollTop + workarea.height() / 2) / zoom - svgCanvas.contentH;
    svgCanvas.pasteElements('point', x, y);
  };

  var moveToTopSelected = function moveToTopSelected() {
    if (selectedElement != null) {
      svgCanvas.moveToTopSelectedElement();
    }
  };

  var moveToBottomSelected = function moveToBottomSelected() {
    if (selectedElement != null) {
      svgCanvas.moveToBottomSelectedElement();
    }
  };

  var moveUpDownSelected = function moveUpDownSelected(dir) {
    if (selectedElement != null) {
      svgCanvas.moveUpDownSelected(dir);
    }
  };

  var convertToPath$$1 = function convertToPath$$1() {
    if (selectedElement != null) {
      svgCanvas.convertToPath();
    }
  };

  var reorientPath = function reorientPath() {
    if (selectedElement != null) {
      path.reorient();
    }
  };

  var makeHyperlink = function makeHyperlink() {
    if (selectedElement != null || multiselected) {
      $$b.prompt(uiStrings$1.notification.enterNewLinkURL, 'http://', function (url) {
        if (url) {
          svgCanvas.makeHyperlink(url);
        }
      });
    }
  };

  var moveSelected = function moveSelected(dx, dy) {
    if (selectedElement != null || multiselected) {
      if (curConfig.gridSnapping) {
        // Use grid snap value regardless of zoom level
        var multi = svgCanvas.getZoom() * curConfig.snappingStep;
        dx *= multi;
        dy *= multi;
      }
      svgCanvas.moveSelectedElements(dx, dy);
    }
  };

  var linkControlPoints = function linkControlPoints() {
    $$b('#tool_node_link').toggleClass('push_button_pressed tool_button');
    var linked = $$b('#tool_node_link').hasClass('push_button_pressed');
    path.linkControlPoints(linked);
  };

  var clonePathNode = function clonePathNode() {
    if (path.getNodePoint()) {
      path.clonePathNode();
    }
  };

  var deletePathNode = function deletePathNode() {
    if (path.getNodePoint()) {
      path.deletePathNode();
    }
  };

  var addSubPath = function addSubPath() {
    var button = $$b('#tool_add_subpath');
    var sp = !button.hasClass('push_button_pressed');
    button.toggleClass('push_button_pressed tool_button');
    path.addSubPath(sp);
  };

  var opencloseSubPath = function opencloseSubPath() {
    path.opencloseSubPath();
  };

  var selectNext = function selectNext() {
    svgCanvas.cycleElement(1);
  };

  var selectPrev = function selectPrev() {
    svgCanvas.cycleElement(0);
  };

  var rotateSelected = function rotateSelected(cw, step) {
    if (selectedElement == null || multiselected) {
      return;
    }
    if (!cw) {
      step *= -1;
    }
    var angle = parseFloat($$b('#angle').val()) + step;
    svgCanvas.setRotationAngle(angle);
    updateContextPanel();
  };

  var clickClear = function clickClear() {
    var dims = curConfig.dimensions;
    $$b.confirm(uiStrings$1.notification.QwantToClear, function (ok) {
      if (!ok) {
        return;
      }
      setSelectMode();
      svgCanvas.clear();
      svgCanvas.setResolution(dims[0], dims[1]);
      updateCanvas(true);
      zoomImage();
      populateLayers();
      updateContextPanel();
      prepPaints();
      svgCanvas.runExtensions('onNewDocument');
    });
  };

  var clickBold = function clickBold() {
    svgCanvas.setBold(!svgCanvas.getBold());
    updateContextPanel();
    return false;
  };

  var clickItalic = function clickItalic() {
    svgCanvas.setItalic(!svgCanvas.getItalic());
    updateContextPanel();
    return false;
  };

  var clickSave = function clickSave() {
    // In the future, more options can be provided here
    var saveOpts = {
      images: $$b.pref('img_save'),
      round_digits: 6
    };
    svgCanvas.save(saveOpts);
  };

  var loadingURL = void 0;
  var clickExport = function clickExport() {
    $$b.select('Select an image type for export: ', [
    // See http://kangax.github.io/jstests/toDataUrl_mime_type_test/ for a useful list of MIME types and browser support
    // 'ICO', // Todo: Find a way to preserve transparency in SVG-Edit if not working presently and do full packaging for x-icon; then switch back to position after 'PNG'
    'PNG', 'JPEG', 'BMP', 'WEBP', 'PDF'], function (imgType) {
      // todo: replace hard-coded msg with uiStrings.notification.
      if (!imgType) {
        return;
      }
      // Open placeholder window (prevents popup)
      var exportWindowName = void 0;
      function openExportWindow() {
        var str = uiStrings$1.notification.loadingImage;
        if (curConfig.exportWindowType === 'new') {
          editor.exportWindowCt++;
        }
        exportWindowName = curConfig.canvasName + editor.exportWindowCt;
        var popHTML = void 0,
            popURL = void 0;
        if (loadingURL) {
          popURL = loadingURL;
        } else {
          popHTML = '<!DOCTYPE html><html><head><meta charset="utf-8"><title>' + str + '</title></head><body><h1>' + str + '</h1></body><html>';
          if ((typeof URL === 'undefined' ? 'undefined' : _typeof(URL)) && URL.createObjectURL) {
            var blob = new Blob([popHTML], { type: 'text/html' });
            popURL = URL.createObjectURL(blob);
          } else {
            popURL = 'data:text/html;base64;charset=utf-8,' + encode64(popHTML);
          }
          loadingURL = popURL;
        }
        exportWindow = window.open(popURL, exportWindowName);
      }
      if (imgType === 'PDF') {
        if (!customExportPDF) {
          openExportWindow();
        }
        svgCanvas.exportPDF(exportWindowName);
      } else {
        if (!customExportImage) {
          openExportWindow();
        }
        var quality = parseInt($$b('#image-slider').val(), 10) / 100;
        svgCanvas.rasterExport(imgType, quality, exportWindowName);
      }
    }, function () {
      var sel = $$b(this);
      if (sel.val() === 'JPEG' || sel.val() === 'WEBP') {
        if (!$$b('#image-slider').length) {
          $$b('<div><label>' + uiStrings$1.ui.quality + '\n              <input id="image-slider"\n                type="range" min="1" max="100" value="92" />\n            </label></div>').appendTo(sel.parent());
        }
      } else {
        $$b('#image-slider').parent().remove();
      }
    });
  };

  // by default, svgCanvas.open() is a no-op.
  // it is up to an extension mechanism (opera widget, etc)
  // to call setCustomHandlers() which will make it do something
  var clickOpen = function clickOpen() {
    svgCanvas.open();
  };

  var clickImport = function clickImport() {};

  var clickUndo = function clickUndo() {
    if (undoMgr.getUndoStackSize() > 0) {
      undoMgr.undo();
      populateLayers();
    }
  };

  var clickRedo = function clickRedo() {
    if (undoMgr.getRedoStackSize() > 0) {
      undoMgr.redo();
      populateLayers();
    }
  };

  var clickGroup = function clickGroup() {
    // group
    if (multiselected) {
      svgCanvas.groupSelectedElements();
      // ungroup
    } else if (selectedElement) {
      svgCanvas.ungroupSelectedElement();
    }
  };

  var clickClone = function clickClone() {
    svgCanvas.cloneSelectedElements(20, 20);
  };

  var clickAlign = function clickAlign() {
    var letter = this.id.replace('tool_align', '').charAt(0);
    svgCanvas.alignSelectedElements(letter, $$b('#align_relative_to').val());
  };

  var clickWireframe = function clickWireframe() {
    $$b('#tool_wireframe').toggleClass('push_button_pressed tool_button');
    workarea.toggleClass('wireframe');

    if (supportsNonSS) {
      return;
    }
    var wfRules = $$b('#wireframe_rules');
    if (!wfRules.length) {
      wfRules = $$b('<style id="wireframe_rules"></style>').appendTo('head');
    } else {
      wfRules.empty();
    }

    updateWireFrame();
  };

  $$b('#svg_docprops_container, #svg_prefs_container').draggable({
    cancel: 'button,fieldset',
    containment: 'window'
  }).css('position', 'absolute');

  var docprops = false;
  var preferences = false;

  var showDocProperties = function showDocProperties() {
    if (docprops) {
      return;
    }
    docprops = true;

    // This selects the correct radio button by using the array notation
    $$b('#image_save_opts input').val([$$b.pref('img_save')]);

    // update resolution option with actual resolution
    var res = svgCanvas.getResolution();
    if (curConfig.baseUnit !== 'px') {
      res.w = convertUnit(res.w) + curConfig.baseUnit;
      res.h = convertUnit(res.h) + curConfig.baseUnit;
    }

    $$b('#canvas_width').val(res.w);
    $$b('#canvas_height').val(res.h);
    $$b('#canvas_title').val(svgCanvas.getDocumentTitle());

    $$b('#svg_docprops').show();
  };

  var showPreferences = function showPreferences() {
    if (preferences) {
      return;
    }
    preferences = true;
    $$b('#main_menu').hide();

    // Update background color with current one
    var blocks = $$b('#bg_blocks div');
    var curBg = 'cur_background';
    var canvasBg = curPrefs.bkgd_color;
    var url = $$b.pref('bkgd_url');
    blocks.each(function () {
      var blk = $$b(this);
      var isBg = blk.css('background-color') === canvasBg;
      blk.toggleClass(curBg, isBg);
      if (isBg) {
        $$b('#canvas_bg_url').removeClass(curBg);
      }
    });
    if (!canvasBg) {
      blocks.eq(0).addClass(curBg);
    }
    if (url) {
      $$b('#canvas_bg_url').val(url);
    }
    $$b('#grid_snapping_on').prop('checked', curConfig.gridSnapping);
    $$b('#grid_snapping_step').attr('value', curConfig.snappingStep);
    $$b('#grid_color').attr('value', curConfig.gridColor);

    $$b('#svg_prefs').show();
  };

  var hideSourceEditor = function hideSourceEditor() {
    $$b('#svg_source_editor').hide();
    editingsource = false;
    $$b('#svg_source_textarea').blur();
  };

  var saveSourceEditor = function saveSourceEditor() {
    if (!editingsource) {
      return;
    }

    var saveChanges = function saveChanges() {
      svgCanvas.clearSelection();
      hideSourceEditor();
      zoomImage();
      populateLayers();
      updateTitle();
      prepPaints();
    };

    if (!svgCanvas.setSvgString($$b('#svg_source_textarea').val())) {
      $$b.confirm(uiStrings$1.notification.QerrorsRevertToSource, function (ok) {
        if (!ok) {
          return false;
        }
        saveChanges();
      });
    } else {
      saveChanges();
    }
    setSelectMode();
  };

  var hideDocProperties = function hideDocProperties() {
    $$b('#svg_docprops').hide();
    $$b('#canvas_width,#canvas_height').removeAttr('disabled');
    $$b('#resolution')[0].selectedIndex = 0;
    $$b('#image_save_opts input').val([$$b.pref('img_save')]);
    docprops = false;
  };

  var hidePreferences = function hidePreferences() {
    $$b('#svg_prefs').hide();
    preferences = false;
  };

  var saveDocProperties = function saveDocProperties() {
    // set title
    var newTitle = $$b('#canvas_title').val();
    updateTitle(newTitle);
    svgCanvas.setDocumentTitle(newTitle);

    // update resolution
    var width = $$b('#canvas_width'),
        w = width.val();
    var height = $$b('#canvas_height'),
        h = height.val();

    if (w !== 'fit' && !isValidUnit('width', w)) {
      $$b.alert(uiStrings$1.notification.invalidAttrValGiven);
      width.parent().addClass('error');
      return false;
    }

    width.parent().removeClass('error');

    if (h !== 'fit' && !isValidUnit('height', h)) {
      $$b.alert(uiStrings$1.notification.invalidAttrValGiven);
      height.parent().addClass('error');
      return false;
    }

    height.parent().removeClass('error');

    if (!svgCanvas.setResolution(w, h)) {
      $$b.alert(uiStrings$1.notification.noContentToFitTo);
      return false;
    }

    // Set image save option
    $$b.pref('img_save', $$b('#image_save_opts :checked').val());
    updateCanvas();
    hideDocProperties();
  };

  /**
  * Save user preferences based on current values in the UI
  */
  var savePreferences = editor.savePreferences = function () {
    // Set background
    var color = $$b('#bg_blocks div.cur_background').css('background-color') || '#FFF';
    setBackground(color, $$b('#canvas_bg_url').val());

    // set language
    var lang = $$b('#lang_select').val();
    if (lang !== $$b.pref('lang')) {
      editor.putLocale(lang, goodLangs, curConfig);
    }

    // set icon size
    setIconSize($$b('#iconsize').val());

    // set grid setting
    curConfig.gridSnapping = $$b('#grid_snapping_on')[0].checked;
    curConfig.snappingStep = $$b('#grid_snapping_step').val();
    curConfig.gridColor = $$b('#grid_color').val();
    curConfig.showRulers = $$b('#show_rulers')[0].checked;

    $$b('#rulers').toggle(curConfig.showRulers);
    if (curConfig.showRulers) {
      updateRulers();
    }
    curConfig.baseUnit = $$b('#base_unit').val();

    svgCanvas.setConfig(curConfig);

    updateCanvas();
    hidePreferences();
  };

  var resetScrollPos = $$b.noop;

  var cancelOverlays = function cancelOverlays() {
    $$b('#dialog_box').hide();
    if (!editingsource && !docprops && !preferences) {
      if (curContext) {
        svgCanvas.leaveContext();
      }
      return;
    }

    if (editingsource) {
      if (origSource !== $$b('#svg_source_textarea').val()) {
        $$b.confirm(uiStrings$1.notification.QignoreSourceChanges, function (ok) {
          if (ok) {
            hideSourceEditor();
          }
        });
      } else {
        hideSourceEditor();
      }
    } else if (docprops) {
      hideDocProperties();
    } else if (preferences) {
      hidePreferences();
    }
    resetScrollPos();
  };

  var winWh = { width: $$b(window).width(), height: $$b(window).height() };

  // Fix for Issue 781: Drawing area jumps to top-left corner on window resize (IE9)
  if (isIE()) {
    (function () {
      resetScrollPos = function resetScrollPos() {
        if (workarea[0].scrollLeft === 0 && workarea[0].scrollTop === 0) {
          workarea[0].scrollLeft = curScrollPos.left;
          workarea[0].scrollTop = curScrollPos.top;
        }
      };

      curScrollPos = {
        left: workarea[0].scrollLeft,
        top: workarea[0].scrollTop
      };

      $$b(window).resize(resetScrollPos);
      editor.ready(function () {
        // TODO: Find better way to detect when to do this to minimize
        // flickering effect
        setTimeout(function () {
          resetScrollPos();
        }, 500);
      });

      workarea.scroll(function () {
        curScrollPos = {
          left: workarea[0].scrollLeft,
          top: workarea[0].scrollTop
        };
      });
    })();
  }

  $$b(window).resize(function (evt) {
    $$b.each(winWh, function (type, val) {
      var curval = $$b(window)[type]();
      workarea[0]['scroll' + (type === 'width' ? 'Left' : 'Top')] -= (curval - val) / 2;
      winWh[type] = curval;
    });
    setFlyoutPositions();
  });

  (function () {
    workarea.scroll(function () {
      // TODO: jQuery's scrollLeft/Top() wouldn't require a null check
      if ($$b('#ruler_x').length) {
        $$b('#ruler_x')[0].scrollLeft = workarea[0].scrollLeft;
      }
      if ($$b('#ruler_y').length) {
        $$b('#ruler_y')[0].scrollTop = workarea[0].scrollTop;
      }
    });
  })();

  $$b('#url_notice').click(function () {
    $$b.alert(this.title);
  });

  $$b('#change_image_url').click(promptImgURL);

  // added these event handlers for all the push buttons so they
  // behave more like buttons being pressed-in and not images
  (function () {
    var toolnames = ['clear', 'open', 'save', 'source', 'delete', 'delete_multi', 'paste', 'clone', 'clone_multi', 'move_top', 'move_bottom'];
    var curClass = 'tool_button_current';

    var allTools = '';

    $$b.each(toolnames, function (i, item) {
      allTools += (i ? ',' : '') + '#tool_' + item;
    });

    $$b(allTools).mousedown(function () {
      $$b(this).addClass(curClass);
    }).bind('mousedown mouseout', function () {
      $$b(this).removeClass(curClass);
    });

    $$b('#tool_undo, #tool_redo').mousedown(function () {
      if (!$$b(this).hasClass('disabled')) {
        $$b(this).addClass(curClass);
      }
    }).bind('mousedown mouseout', function () {
      $$b(this).removeClass(curClass);
    });
  })();

  // switch modifier key in tooltips if mac
  // NOTE: This code is not used yet until I can figure out how to successfully bind ctrl/meta
  // in Opera and Chrome
  if (isMac() && !window.opera) {
    var shortcutButtons = ['tool_clear', 'tool_save', 'tool_source', 'tool_undo', 'tool_redo', 'tool_clone'];
    var _i2 = shortcutButtons.length;
    while (_i2--) {
      var button = document.getElementById(shortcutButtons[_i2]);
      if (button) {
        var title = button.title;

        var index = title.indexOf('Ctrl+');
        button.title = [title.substr(0, index), 'Cmd+', title.substr(index + 5)].join('');
      }
    }
  }

  // TODO: go back to the color boxes having white background-color and then setting
  //  background-image to none.png (otherwise partially transparent gradients look weird)
  var colorPicker = function colorPicker(elem) {
    var picker = elem.attr('id') === 'stroke_color' ? 'stroke' : 'fill';
    // const opacity = (picker == 'stroke' ? $('#stroke_opacity') : $('#fill_opacity'));
    var title = picker === 'stroke' ? 'Pick a Stroke Paint and Opacity' : 'Pick a Fill Paint and Opacity';
    // let wasNone = false; // Currently unused
    var pos = elem.offset();
    var paint = paintBox[picker].paint;

    $$b('#color_picker').draggable({
      cancel: '.jGraduate_tabs, .jGraduate_colPick, .jGraduate_gradPick, .jPicker',
      containment: 'window'
    }).css(curConfig.colorPickerCSS || { left: pos.left - 140, bottom: 40 }).jGraduate({
      paint: paint,
      window: { pickerTitle: title },
      images: { clientPath: curConfig.jGraduatePath },
      newstop: 'inverse'
    }, function (p) {
      paint = new $$b.jGraduate.Paint(p);
      paintBox[picker].setPaint(paint);
      svgCanvas.setPaint(picker, paint);
      $$b('#color_picker').hide();
    }, function () {
      $$b('#color_picker').hide();
    });
  };

  var PaintBox = function PaintBox(container, type) {
    var paintColor = void 0,
        paintOpacity = void 0;
    var cur = curConfig[type === 'fill' ? 'initFill' : 'initStroke'];
    // set up gradients to be used for the buttons
    var svgdocbox = new DOMParser().parseFromString('<svg xmlns="http://www.w3.org/2000/svg"><rect width="16.5" height="16.5"' + '          fill="#' + cur.color + '" opacity="' + cur.opacity + '"/>' + '          <defs><linearGradient id="gradbox_"/></defs></svg>', 'text/xml');

    var docElem = svgdocbox.documentElement;
    docElem = $$b(container)[0].appendChild(document.importNode(docElem, true));
    docElem.setAttribute('width', 16.5);

    this.rect = docElem.firstChild;
    this.defs = docElem.getElementsByTagName('defs')[0];
    this.grad = this.defs.firstChild;
    this.paint = new $$b.jGraduate.Paint({ solidColor: cur.color });
    this.type = type;

    this.setPaint = function (paint, apply) {
      this.paint = paint;

      var ptype = paint.type;
      var opac = paint.alpha / 100;

      var fillAttr = 'none';
      switch (ptype) {
        case 'solidColor':
          fillAttr = paint[ptype] !== 'none' ? '#' + paint[ptype] : paint[ptype];
          break;
        case 'linearGradient':
        case 'radialGradient':
          this.grad.remove();
          this.grad = this.defs.appendChild(paint[ptype]);
          var id = this.grad.id = 'gradbox_' + this.type;
          fillAttr = 'url(#' + id + ')';
          break;
      }

      this.rect.setAttribute('fill', fillAttr);
      this.rect.setAttribute('opacity', opac);

      if (apply) {
        svgCanvas.setColor(this.type, paintColor, true);
        svgCanvas.setPaintOpacity(this.type, paintOpacity, true);
      }
    };

    this.update = function (apply) {
      if (!selectedElement) {
        return;
      }

      var type = this.type;

      switch (selectedElement.tagName) {
        case 'use':
        case 'image':
        case 'foreignObject':
          // These elements don't have fill or stroke, so don't change
          // the current value
          return;
        case 'g':
        case 'a':
          {
            var childs = selectedElement.getElementsByTagName('*');

            var gPaint = null;
            for (var _i3 = 0, len = childs.length; _i3 < len; _i3++) {
              var elem = childs[_i3];
              var p = elem.getAttribute(type);
              if (_i3 === 0) {
                gPaint = p;
              } else if (gPaint !== p) {
                gPaint = null;
                break;
              }
            }

            if (gPaint === null) {
              // No common color, don't update anything
              paintColor = null;
              return;
            }
            paintColor = gPaint;
            paintOpacity = 1;
            break;
          }default:
          paintOpacity = parseFloat(selectedElement.getAttribute(type + '-opacity'));
          if (isNaN(paintOpacity)) {
            paintOpacity = 1.0;
          }

          var defColor = type === 'fill' ? 'black' : 'none';
          paintColor = selectedElement.getAttribute(type) || defColor;
      }

      if (apply) {
        svgCanvas.setColor(type, paintColor, true);
        svgCanvas.setPaintOpacity(type, paintOpacity, true);
      }

      paintOpacity *= 100;

      var paint = getPaint(paintColor, paintOpacity, type);
      // update the rect inside #fill_color/#stroke_color
      this.setPaint(paint);
    };

    this.prep = function () {
      var ptype = this.paint.type;

      switch (ptype) {
        case 'linearGradient':
        case 'radialGradient':
          var paint = new $$b.jGraduate.Paint({ copy: this.paint });
          svgCanvas.setPaint(type, paint);
          break;
      }
    };
  };

  paintBox.fill = new PaintBox('#fill_color', 'fill');
  paintBox.stroke = new PaintBox('#stroke_color', 'stroke');

  $$b('#stroke_width').val(curConfig.initStroke.width);
  $$b('#group_opacity').val(curConfig.initOpacity * 100);

  // Use this SVG elem to test vectorEffect support
  var testEl = paintBox.fill.rect.cloneNode(false);
  testEl.setAttribute('style', 'vector-effect:non-scaling-stroke');
  var supportsNonSS = testEl.style.vectorEffect === 'non-scaling-stroke';
  testEl.removeAttribute('style');
  var svgdocbox = paintBox.fill.rect.ownerDocument;
  // Use this to test support for blur element. Seems to work to test support in Webkit
  var blurTest = svgdocbox.createElementNS(NS.SVG, 'feGaussianBlur');
  if (blurTest.stdDeviationX === undefined) {
    $$b('#tool_blur').hide();
  }
  $$b(blurTest).remove();

  // Test for zoom icon support
  (function () {
    var pre = '-' + uaPrefix.toLowerCase() + '-zoom-';
    var zoom = pre + 'in';
    workarea.css('cursor', zoom);
    if (workarea.css('cursor') === zoom) {
      zoomInIcon = zoom;
      zoomOutIcon = pre + 'out';
    }
    workarea.css('cursor', 'auto');
  })();

  // Test for embedImage support (use timeout to not interfere with page load)
  setTimeout(function () {
    svgCanvas.embedImage('images/logo.png', function (datauri) {
      if (!datauri) {
        // Disable option
        $$b('#image_save_opts [value=embed]').attr('disabled', 'disabled');
        $$b('#image_save_opts input').val(['ref']);
        $$b.pref('img_save', 'ref');
        $$b('#image_opt_embed').css('color', '#666').attr('title', uiStrings$1.notification.featNotSupported);
      }
    });
  }, 1000);

  $$b('#fill_color, #tool_fill .icon_label').click(function () {
    colorPicker($$b('#fill_color'));
    updateToolButtonState();
  });

  $$b('#stroke_color, #tool_stroke .icon_label').click(function () {
    colorPicker($$b('#stroke_color'));
    updateToolButtonState();
  });

  $$b('#group_opacityLabel').click(function () {
    $$b('#opacity_dropdown button').mousedown();
    $$b(window).mouseup();
  });

  $$b('#zoomLabel').click(function () {
    $$b('#zoom_dropdown button').mousedown();
    $$b(window).mouseup();
  });

  $$b('#tool_move_top').mousedown(function (evt) {
    $$b('#tools_stacking').show();
    evt.preventDefault();
  });

  $$b('.layer_button').mousedown(function () {
    $$b(this).addClass('layer_buttonpressed');
  }).mouseout(function () {
    $$b(this).removeClass('layer_buttonpressed');
  }).mouseup(function () {
    $$b(this).removeClass('layer_buttonpressed');
  });

  $$b('.push_button').mousedown(function () {
    if (!$$b(this).hasClass('disabled')) {
      $$b(this).addClass('push_button_pressed').removeClass('push_button');
    }
  }).mouseout(function () {
    $$b(this).removeClass('push_button_pressed').addClass('push_button');
  }).mouseup(function () {
    $$b(this).removeClass('push_button_pressed').addClass('push_button');
  });

  // ask for a layer name
  $$b('#layer_new').click(function () {
    var uniqName = void 0,
        i = svgCanvas.getCurrentDrawing().getNumLayers();
    do {
      uniqName = uiStrings$1.layers.layer + ' ' + ++i;
    } while (svgCanvas.getCurrentDrawing().hasLayer(uniqName));

    $$b.prompt(uiStrings$1.notification.enterUniqueLayerName, uniqName, function (newName) {
      if (!newName) {
        return;
      }
      if (svgCanvas.getCurrentDrawing().hasLayer(newName)) {
        $$b.alert(uiStrings$1.notification.dupeLayerName);
        return;
      }
      svgCanvas.createLayer(newName);
      updateContextPanel();
      populateLayers();
    });
  });

  function deleteLayer() {
    if (svgCanvas.deleteCurrentLayer()) {
      updateContextPanel();
      populateLayers();
      // This matches what SvgCanvas does
      // TODO: make this behavior less brittle (svg-editor should get which
      // layer is selected from the canvas and then select that one in the UI)
      $$b('#layerlist tr.layer').removeClass('layersel');
      $$b('#layerlist tr.layer:first').addClass('layersel');
    }
  }

  function cloneLayer() {
    var name = svgCanvas.getCurrentDrawing().getCurrentLayerName() + ' copy';

    $$b.prompt(uiStrings$1.notification.enterUniqueLayerName, name, function (newName) {
      if (!newName) {
        return;
      }
      if (svgCanvas.getCurrentDrawing().hasLayer(newName)) {
        $$b.alert(uiStrings$1.notification.dupeLayerName);
        return;
      }
      svgCanvas.cloneLayer(newName);
      updateContextPanel();
      populateLayers();
    });
  }

  function mergeLayer() {
    if ($$b('#layerlist tr.layersel').index() === svgCanvas.getCurrentDrawing().getNumLayers() - 1) {
      return;
    }
    svgCanvas.mergeLayer();
    updateContextPanel();
    populateLayers();
  }

  function moveLayer(pos) {
    var total = svgCanvas.getCurrentDrawing().getNumLayers();

    var curIndex = $$b('#layerlist tr.layersel').index();
    if (curIndex > 0 || curIndex < total - 1) {
      curIndex += pos;
      svgCanvas.setCurrentLayerPosition(total - curIndex - 1);
      populateLayers();
    }
  }

  $$b('#layer_delete').click(deleteLayer);

  $$b('#layer_up').click(function () {
    moveLayer(-1);
  });

  $$b('#layer_down').click(function () {
    moveLayer(1);
  });

  $$b('#layer_rename').click(function () {
    // const curIndex = $('#layerlist tr.layersel').prevAll().length; // Currently unused
    var oldName = $$b('#layerlist tr.layersel td.layername').text();
    $$b.prompt(uiStrings$1.notification.enterNewLayerName, '', function (newName) {
      if (!newName) {
        return;
      }
      if (oldName === newName || svgCanvas.getCurrentDrawing().hasLayer(newName)) {
        $$b.alert(uiStrings$1.notification.layerHasThatName);
        return;
      }

      svgCanvas.renameCurrentLayer(newName);
      populateLayers();
    });
  });

  var SIDEPANEL_MAXWIDTH = 300;
  var SIDEPANEL_OPENWIDTH = 150;
  var sidedrag = -1,
      sidedragging = false,
      allowmove = false;

  var changeSidePanelWidth = function changeSidePanelWidth(delta) {
    var rulerX = $$b('#ruler_x');
    $$b('#sidepanels').width('+=' + delta);
    $$b('#layerpanel').width('+=' + delta);
    rulerX.css('right', parseInt(rulerX.css('right'), 10) + delta);
    workarea.css('right', parseInt(workarea.css('right'), 10) + delta);
    svgCanvas.runExtensions('workareaResized');
  };

  var resizeSidePanel = function resizeSidePanel(evt) {
    if (!allowmove) {
      return;
    }
    if (sidedrag === -1) {
      return;
    }
    sidedragging = true;
    var deltaX = sidedrag - evt.pageX;
    var sideWidth = $$b('#sidepanels').width();
    if (sideWidth + deltaX > SIDEPANEL_MAXWIDTH) {
      deltaX = SIDEPANEL_MAXWIDTH - sideWidth;
      sideWidth = SIDEPANEL_MAXWIDTH;
    } else if (sideWidth + deltaX < 2) {
      deltaX = 2 - sideWidth;
      sideWidth = 2;
    }
    if (deltaX === 0) {
      return;
    }
    sidedrag -= deltaX;
    changeSidePanelWidth(deltaX);
  };

  // if width is non-zero, then fully close it, otherwise fully open it
  // the optional close argument forces the side panel closed
  var toggleSidePanel = function toggleSidePanel(close) {
    var w = $$b('#sidepanels').width();
    var deltaX = (w > 2 || close ? 2 : SIDEPANEL_OPENWIDTH) - w;
    changeSidePanelWidth(deltaX);
  };

  $$b('#sidepanel_handle').mousedown(function (evt) {
    sidedrag = evt.pageX;
    $$b(window).mousemove(resizeSidePanel);
    allowmove = false;
    // Silly hack for Chrome, which always runs mousemove right after mousedown
    setTimeout(function () {
      allowmove = true;
    }, 20);
  }).mouseup(function (evt) {
    if (!sidedragging) {
      toggleSidePanel();
    }
    sidedrag = -1;
    sidedragging = false;
  });

  $$b(window).mouseup(function () {
    sidedrag = -1;
    sidedragging = false;
    $$b('#svg_editor').unbind('mousemove', resizeSidePanel);
  });

  populateLayers();

  // function changeResolution (x,y) {
  //   const {zoom} = svgCanvas.getResolution();
  //   setResolution(x * zoom, y * zoom);
  // }

  var centerCanvas = function centerCanvas() {
    // this centers the canvas vertically in the workarea (horizontal handled in CSS)
    workarea.css('line-height', workarea.height() + 'px');
  };

  $$b(window).bind('load resize', centerCanvas);

  function stepFontSize(elem, step) {
    var origVal = Number(elem.value);
    var sugVal = origVal + step;
    var increasing = sugVal >= origVal;
    if (step === 0) {
      return origVal;
    }

    if (origVal >= 24) {
      if (increasing) {
        return Math.round(origVal * 1.1);
      }
      return Math.round(origVal / 1.1);
    }
    if (origVal <= 1) {
      if (increasing) {
        return origVal * 2;
      }
      return origVal / 2;
    }
    return sugVal;
  }

  function stepZoom(elem, step) {
    var origVal = Number(elem.value);
    if (origVal === 0) {
      return 100;
    }
    var sugVal = origVal + step;
    if (step === 0) {
      return origVal;
    }

    if (origVal >= 100) {
      return sugVal;
    }
    if (sugVal >= origVal) {
      return origVal * 2;
    }
    return origVal / 2;
  }

  // function setResolution (w, h, center) {
  //   updateCanvas();
  //   // w -= 0; h -= 0;
  //   // $('#svgcanvas').css({width: w, height: h});
  //   // $('#canvas_width').val(w);
  //   // $('#canvas_height').val(h);
  //   //
  //   // if (center) {
  //   //   const wArea = workarea;
  //   //   const scrollY = h/2 - wArea.height()/2;
  //   //   const scrollX = w/2 - wArea.width()/2;
  //   //   wArea[0].scrollTop = scrollY;
  //   //   wArea[0].scrollLeft = scrollX;
  //   // }
  // }

  $$b('#resolution').change(function () {
    var wh = $$b('#canvas_width,#canvas_height');
    if (!this.selectedIndex) {
      if ($$b('#canvas_width').val() === 'fit') {
        wh.removeAttr('disabled').val(100);
      }
    } else if (this.value === 'content') {
      wh.val('fit').attr('disabled', 'disabled');
    } else {
      var dims = this.value.split('x');
      $$b('#canvas_width').val(dims[0]);
      $$b('#canvas_height').val(dims[1]);
      wh.removeAttr('disabled');
    }
  });

  // Prevent browser from erroneously repopulating fields
  $$b('input,select').attr('autocomplete', 'off');

  // Associate all button actions as well as non-button keyboard shortcuts
  var Actions = function () {
    // sel:'selector', fn:function, evt:'event', key:[key, preventDefault, NoDisableInInput]
    var toolButtons = [{ sel: '#tool_select', fn: clickSelect, evt: 'click', key: ['V', true] }, { sel: '#tool_fhpath', fn: clickFHPath, evt: 'click', key: ['Q', true] }, { sel: '#tool_line', fn: clickLine, evt: 'click', key: ['L', true] }, { sel: '#tool_rect', fn: clickRect, evt: 'mouseup', key: ['R', true], parent: '#tools_rect', icon: 'rect' }, { sel: '#tool_square', fn: clickSquare, evt: 'mouseup', parent: '#tools_rect', icon: 'square' }, { sel: '#tool_fhrect', fn: clickFHRect, evt: 'mouseup', parent: '#tools_rect', icon: 'fh_rect' }, { sel: '#tool_ellipse', fn: clickEllipse, evt: 'mouseup', key: ['E', true], parent: '#tools_ellipse', icon: 'ellipse' }, { sel: '#tool_circle', fn: clickCircle, evt: 'mouseup', parent: '#tools_ellipse', icon: 'circle' }, { sel: '#tool_fhellipse', fn: clickFHEllipse, evt: 'mouseup', parent: '#tools_ellipse', icon: 'fh_ellipse' }, { sel: '#tool_path', fn: clickPath, evt: 'click', key: ['P', true] }, { sel: '#tool_text', fn: clickText, evt: 'click', key: ['T', true] }, { sel: '#tool_image', fn: clickImage, evt: 'mouseup' }, { sel: '#tool_zoom', fn: clickZoom, evt: 'mouseup', key: ['Z', true] }, { sel: '#tool_clear', fn: clickClear, evt: 'mouseup', key: ['N', true] }, { sel: '#tool_save', fn: function fn() {
        if (editingsource) {
          saveSourceEditor();
        } else {
          clickSave();
        }
      },
      evt: 'mouseup', key: ['S', true] }, { sel: '#tool_export', fn: clickExport, evt: 'mouseup' }, { sel: '#tool_open', fn: clickOpen, evt: 'mouseup', key: ['O', true] }, { sel: '#tool_import', fn: clickImport, evt: 'mouseup' }, { sel: '#tool_source', fn: showSourceEditor, evt: 'click', key: ['U', true] }, { sel: '#tool_wireframe', fn: clickWireframe, evt: 'click', key: ['F', true] }, { sel: '#tool_source_cancel,.overlay,#tool_docprops_cancel,#tool_prefs_cancel', fn: cancelOverlays, evt: 'click', key: ['esc', false, false], hidekey: true }, { sel: '#tool_source_save', fn: saveSourceEditor, evt: 'click' }, { sel: '#tool_docprops_save', fn: saveDocProperties, evt: 'click' }, { sel: '#tool_docprops', fn: showDocProperties, evt: 'mouseup' }, { sel: '#tool_prefs_save', fn: savePreferences, evt: 'click' }, { sel: '#tool_prefs_option', fn: function fn() {
        showPreferences();return false;
      },
      evt: 'mouseup' }, { sel: '#tool_delete,#tool_delete_multi', fn: deleteSelected, evt: 'click', key: ['del/backspace', true] }, { sel: '#tool_reorient', fn: reorientPath, evt: 'click' }, { sel: '#tool_node_link', fn: linkControlPoints, evt: 'click' }, { sel: '#tool_node_clone', fn: clonePathNode, evt: 'click' }, { sel: '#tool_node_delete', fn: deletePathNode, evt: 'click' }, { sel: '#tool_openclose_path', fn: opencloseSubPath, evt: 'click' }, { sel: '#tool_add_subpath', fn: addSubPath, evt: 'click' }, { sel: '#tool_move_top', fn: moveToTopSelected, evt: 'click', key: 'ctrl+shift+]' }, { sel: '#tool_move_bottom', fn: moveToBottomSelected, evt: 'click', key: 'ctrl+shift+[' }, { sel: '#tool_topath', fn: convertToPath$$1, evt: 'click' }, { sel: '#tool_make_link,#tool_make_link_multi', fn: makeHyperlink, evt: 'click' }, { sel: '#tool_undo', fn: clickUndo, evt: 'click' }, { sel: '#tool_redo', fn: clickRedo, evt: 'click' }, { sel: '#tool_clone,#tool_clone_multi', fn: clickClone, evt: 'click', key: ['D', true] }, { sel: '#tool_group_elements', fn: clickGroup, evt: 'click', key: ['G', true] }, { sel: '#tool_ungroup', fn: clickGroup, evt: 'click' }, { sel: '#tool_unlink_use', fn: clickGroup, evt: 'click' }, { sel: '[id^=tool_align]', fn: clickAlign, evt: 'click' },
    // these two lines are required to make Opera work properly with the flyout mechanism
    // {sel: '#tools_rect_show', fn: clickRect, evt: 'click'},
    // {sel: '#tools_ellipse_show', fn: clickEllipse, evt: 'click'},
    { sel: '#tool_bold', fn: clickBold, evt: 'mousedown' }, { sel: '#tool_italic', fn: clickItalic, evt: 'mousedown' }, { sel: '#sidepanel_handle', fn: toggleSidePanel, key: ['X'] }, { sel: '#copy_save_done', fn: cancelOverlays, evt: 'click' },

    // Shortcuts not associated with buttons

    { key: 'ctrl+left', fn: function fn() {
        rotateSelected(0, 1);
      }
    }, { key: 'ctrl+right', fn: function fn() {
        rotateSelected(1, 1);
      }
    }, { key: 'ctrl+shift+left', fn: function fn() {
        rotateSelected(0, 5);
      }
    }, { key: 'ctrl+shift+right', fn: function fn() {
        rotateSelected(1, 5);
      }
    }, { key: 'shift+O', fn: selectPrev }, { key: 'shift+P', fn: selectNext }, { key: [modKey + 'up', true], fn: function fn() {
        zoomImage(2);
      }
    }, { key: [modKey + 'down', true], fn: function fn() {
        zoomImage(0.5);
      }
    }, { key: [modKey + ']', true], fn: function fn() {
        moveUpDownSelected('Up');
      }
    }, { key: [modKey + '[', true], fn: function fn() {
        moveUpDownSelected('Down');
      }
    }, { key: ['up', true], fn: function fn() {
        moveSelected(0, -1);
      }
    }, { key: ['down', true], fn: function fn() {
        moveSelected(0, 1);
      }
    }, { key: ['left', true], fn: function fn() {
        moveSelected(-1, 0);
      }
    }, { key: ['right', true], fn: function fn() {
        moveSelected(1, 0);
      }
    }, { key: 'shift+up', fn: function fn() {
        moveSelected(0, -10);
      }
    }, { key: 'shift+down', fn: function fn() {
        moveSelected(0, 10);
      }
    }, { key: 'shift+left', fn: function fn() {
        moveSelected(-10, 0);
      }
    }, { key: 'shift+right', fn: function fn() {
        moveSelected(10, 0);
      }
    }, { key: ['alt+up', true], fn: function fn() {
        svgCanvas.cloneSelectedElements(0, -1);
      }
    }, { key: ['alt+down', true], fn: function fn() {
        svgCanvas.cloneSelectedElements(0, 1);
      }
    }, { key: ['alt+left', true], fn: function fn() {
        svgCanvas.cloneSelectedElements(-1, 0);
      }
    }, { key: ['alt+right', true], fn: function fn() {
        svgCanvas.cloneSelectedElements(1, 0);
      }
    }, { key: ['alt+shift+up', true], fn: function fn() {
        svgCanvas.cloneSelectedElements(0, -10);
      }
    }, { key: ['alt+shift+down', true], fn: function fn() {
        svgCanvas.cloneSelectedElements(0, 10);
      }
    }, { key: ['alt+shift+left', true], fn: function fn() {
        svgCanvas.cloneSelectedElements(-10, 0);
      }
    }, { key: ['alt+shift+right', true], fn: function fn() {
        svgCanvas.cloneSelectedElements(10, 0);
      }
    }, { key: 'A', fn: function fn() {
        svgCanvas.selectAllInCurrentLayer();
      }
    },

    // Standard shortcuts
    { key: modKey + 'z', fn: clickUndo }, { key: modKey + 'shift+z', fn: clickRedo }, { key: modKey + 'y', fn: clickRedo }, { key: modKey + 'x', fn: cutSelected }, { key: modKey + 'c', fn: copySelected }, { key: modKey + 'v', fn: pasteInCenter }];

    // Tooltips not directly associated with a single function
    var keyAssocs = {
      '4/Shift+4': '#tools_rect_show',
      '5/Shift+5': '#tools_ellipse_show'
    };

    return {
      setAll: function setAll() {
        var flyouts = {};

        $$b.each(toolButtons, function (i, opts) {
          // Bind function to button
          var btn = void 0;
          if (opts.sel) {
            btn = $$b(opts.sel);
            if (!btn.length) {
              return true;
            } // Skip if markup does not exist
            if (opts.evt) {
              if (isTouch() && opts.evt === 'click') {
                opts.evt = 'mousedown';
              }
              btn[opts.evt](opts.fn);
            }

            // Add to parent flyout menu, if able to be displayed
            if (opts.parent && $$b(opts.parent + '_show').length) {
              var fH = $$b(opts.parent);
              if (!fH.length) {
                fH = makeFlyoutHolder(opts.parent.substr(1));
              }

              fH.append(btn);

              if (!Array.isArray(flyouts[opts.parent])) {
                flyouts[opts.parent] = [];
              }
              flyouts[opts.parent].push(opts);
            }
          }

          // Bind function to shortcut key
          if (opts.key) {
            // Set shortcut based on options
            var keyval = void 0,

            // disInInp = true,
            pd = false;
            if (Array.isArray(opts.key)) {
              keyval = opts.key[0];
              if (opts.key.length > 1) {
                pd = opts.key[1];
              }
              // if (opts.key.length > 2) { disInInp = opts.key[2]; }
            } else {
              keyval = opts.key;
            }
            keyval += '';

            var fn = opts.fn;

            $$b.each(keyval.split('/'), function (i, key) {
              $$b(document).bind('keydown', key, function (e) {
                fn();
                if (pd) {
                  e.preventDefault();
                }
                // Prevent default on ALL keys?
                return false;
              });
            });

            // Put shortcut in title
            if (opts.sel && !opts.hidekey && btn.attr('title')) {
              var newTitle = btn.attr('title').split('[')[0] + ' (' + keyval + ')';
              keyAssocs[keyval] = opts.sel;
              // Disregard for menu items
              if (!btn.parents('#main_menu').length) {
                btn.attr('title', newTitle);
              }
            }
          }
        });

        // Setup flyouts
        setupFlyouts(flyouts);

        // Misc additional actions

        // Make 'return' keypress trigger the change event
        $$b('.attr_changer, #image_url').bind('keydown', 'return', function (evt) {
          $$b(this).change();
          evt.preventDefault();
        });

        $$b(window).bind('keydown', 'tab', function (e) {
          if (uiContext === 'canvas') {
            e.preventDefault();
            selectNext();
          }
        }).bind('keydown', 'shift+tab', function (e) {
          if (uiContext === 'canvas') {
            e.preventDefault();
            selectPrev();
          }
        });

        $$b('#tool_zoom').dblclick(dblclickZoom);
      },
      setTitles: function setTitles() {
        $$b.each(keyAssocs, function (keyval, sel) {
          var menu = $$b(sel).parents('#main_menu').length;

          $$b(sel).each(function () {
            var t = void 0;
            if (menu) {
              t = $$b(this).text().split(' [')[0];
            } else {
              t = this.title.split(' [')[0];
            }
            var keyStr = '';
            // Shift+Up
            $$b.each(keyval.split('/'), function (i, key) {
              var modBits = key.split('+');
              var mod = '';
              if (modBits.length > 1) {
                mod = modBits[0] + '+';
                key = modBits[1];
              }
              keyStr += (i ? '/' : '') + mod + (uiStrings$1['key_' + key] || key);
            });
            if (menu) {
              this.lastChild.textContent = t + ' [' + keyStr + ']';
            } else {
              this.title = t + ' [' + keyStr + ']';
            }
          });
        });
      },
      getButtonData: function getButtonData(sel) {
        var b = void 0;
        $$b.each(toolButtons, function (i, btn) {
          if (btn.sel === sel) {
            b = btn;
          }
        });
        return b;
      }
    };
  }();

  Actions.setAll();

  // Select given tool
  editor.ready(function () {
    var tool = void 0;
    var itool = curConfig.initTool,
        container = $$b('#tools_left, #svg_editor .tools_flyout'),
        preTool = container.find('#tool_' + itool),
        regTool = container.find('#' + itool);
    if (preTool.length) {
      tool = preTool;
    } else if (regTool.length) {
      tool = regTool;
    } else {
      tool = $$b('#tool_select');
    }
    tool.click().mouseup();

    if (curConfig.wireframe) {
      $$b('#tool_wireframe').click();
    }

    if (curConfig.showlayers) {
      toggleSidePanel();
    }

    $$b('#rulers').toggle(!!curConfig.showRulers);

    if (curConfig.showRulers) {
      $$b('#show_rulers')[0].checked = true;
    }

    if (curConfig.baseUnit) {
      $$b('#base_unit').val(curConfig.baseUnit);
    }

    if (curConfig.gridSnapping) {
      $$b('#grid_snapping_on')[0].checked = true;
    }

    if (curConfig.snappingStep) {
      $$b('#grid_snapping_step').val(curConfig.snappingStep);
    }

    if (curConfig.gridColor) {
      $$b('#grid_color').val(curConfig.gridColor);
    }
  });

  // init SpinButtons
  $$b('#rect_rx').SpinButton({ min: 0, max: 1000, stateObj: stateObj, callback: changeRectRadius });
  $$b('#stroke_width').SpinButton({ min: 0, max: 99, smallStep: 0.1, stateObj: stateObj, callback: changeStrokeWidth });
  $$b('#angle').SpinButton({ min: -180, max: 180, step: 5, stateObj: stateObj, callback: changeRotationAngle });
  $$b('#font_size').SpinButton({ min: 0.001, stepfunc: stepFontSize, stateObj: stateObj, callback: changeFontSize });
  $$b('#group_opacity').SpinButton({ min: 0, max: 100, step: 5, stateObj: stateObj, callback: changeOpacity });
  $$b('#blur').SpinButton({ min: 0, max: 10, step: 0.1, stateObj: stateObj, callback: changeBlur });
  $$b('#zoom').SpinButton({ min: 0.001, max: 10000, step: 50, stepfunc: stepZoom, stateObj: stateObj, callback: changeZoom })
  // Set default zoom
  .val(svgCanvas.getZoom() * 100);

  $$b('#workarea').contextMenu({
    menu: 'cmenu_canvas',
    inSpeed: 0
  }, function (action, el, pos) {
    switch (action) {
      case 'delete':
        deleteSelected();
        break;
      case 'cut':
        cutSelected();
        break;
      case 'copy':
        copySelected();
        break;
      case 'paste':
        svgCanvas.pasteElements();
        break;
      case 'paste_in_place':
        svgCanvas.pasteElements('in_place');
        break;
      case 'group':
      case 'group_elements':
        svgCanvas.groupSelectedElements();
        break;
      case 'ungroup':
        svgCanvas.ungroupSelectedElement();
        break;
      case 'move_front':
        moveToTopSelected();
        break;
      case 'move_up':
        moveUpDownSelected('Up');
        break;
      case 'move_down':
        moveUpDownSelected('Down');
        break;
      case 'move_back':
        moveToBottomSelected();
        break;
      default:
        if (hasCustomHandler(action)) {
          getCustomHandler(action).call();
        }
        break;
    }
  });

  var lmenuFunc = function lmenuFunc(action, el, pos) {
    switch (action) {
      case 'dupe':
        cloneLayer();
        break;
      case 'delete':
        deleteLayer();
        break;
      case 'merge_down':
        mergeLayer();
        break;
      case 'merge_all':
        svgCanvas.mergeAllLayers();
        updateContextPanel();
        populateLayers();
        break;
    }
  };

  $$b('#layerlist').contextMenu({
    menu: 'cmenu_layers',
    inSpeed: 0
  }, lmenuFunc);

  $$b('#layer_moreopts').contextMenu({
    menu: 'cmenu_layers',
    inSpeed: 0,
    allowLeft: true
  }, lmenuFunc);

  $$b('.contextMenu li').mousedown(function (ev) {
    ev.preventDefault();
  });

  $$b('#cmenu_canvas li').disableContextMenu();
  canvMenu.enableContextMenuItems('#delete,#cut,#copy');

  function enableOrDisableClipboard() {
    var svgeditClipboard = void 0;
    try {
      svgeditClipboard = localStorage.getItem('svgedit_clipboard');
    } catch (err) {}
    canvMenu[(svgeditClipboard ? 'en' : 'dis') + 'ableContextMenuItems']('#paste,#paste_in_place');
  }
  enableOrDisableClipboard();

  window.addEventListener('storage', function (e) {
    if (e.key !== 'svgedit_clipboard') {
      return;
    }

    enableOrDisableClipboard();
  });

  window.addEventListener('beforeunload', function (e) {
    // Suppress warning if page is empty
    if (undoMgr.getUndoStackSize() === 0) {
      editor.showSaveWarning = false;
    }

    // showSaveWarning is set to 'false' when the page is saved.
    if (!curConfig.no_save_warning && editor.showSaveWarning) {
      // Browser already asks question about closing the page
      e.returnValue = uiStrings$1.notification.unsavedChanges; // Firefox needs this when beforeunload set by addEventListener (even though message is not used)
      return uiStrings$1.notification.unsavedChanges;
    }
  }, false);

  /**
  * Expose the uiStrings
  */
  editor.canvas.getUIStrings = function () {
    return uiStrings$1;
  };

  /**
  * @param {Function} func Confirmation dialog callback
  */
  editor.openPrep = function (func) {
    $$b('#main_menu').hide();
    if (undoMgr.getUndoStackSize() === 0) {
      func(true);
    } else {
      $$b.confirm(uiStrings$1.notification.QwantToOpen, func);
    }
  };

  function onDragEnter(e) {
    e.stopPropagation();
    e.preventDefault();
    // and indicator should be displayed here, such as "drop files here"
  }

  function onDragOver(e) {
    e.stopPropagation();
    e.preventDefault();
  }

  function onDragLeave(e) {
    e.stopPropagation();
    e.preventDefault();
    // hypothetical indicator should be removed here
  }
  // Use HTML5 File API: http://www.w3.org/TR/FileAPI/
  // if browser has HTML5 File API support, then we will show the open menu item
  // and provide a file input to click. When that change event fires, it will
  // get the text contents of the file and send it to the canvas
  if (window.FileReader) {
    var importImage = function importImage(e) {
      $$b.process_cancel(uiStrings$1.notification.loadingImage);
      e.stopPropagation();
      e.preventDefault();
      $$b('#workarea').removeAttr('style');
      $$b('#main_menu').hide();
      var file = e.type === 'drop' ? e.dataTransfer.files[0] : this.files[0];
      if (!file) {
        $$b('#dialog_box').hide();
        return;
      }
      /* if (file.type === 'application/pdf') { // Todo: Handle PDF imports
       }
      else */
      if (file.type.includes('image')) {
        // Detected an image
        // svg handling
        var reader = void 0;
        if (file.type.includes('svg')) {
          reader = new FileReader();
          reader.onloadend = function (e) {
            var newElement = svgCanvas.importSvgString(e.target.result, true);
            svgCanvas.ungroupSelectedElement();
            svgCanvas.ungroupSelectedElement();
            svgCanvas.groupSelectedElements();
            svgCanvas.alignSelectedElements('m', 'page');
            svgCanvas.alignSelectedElements('c', 'page');
            // highlight imported element, otherwise we get strange empty selectbox
            svgCanvas.selectOnly([newElement]);
            $$b('#dialog_box').hide();
          };
          reader.readAsText(file);
        } else {
          // bitmap handling
          reader = new FileReader();
          reader.onloadend = function (e) {
            // let's insert the new image until we know its dimensions
            var insertNewImage = function insertNewImage(width, height) {
              var newImage = svgCanvas.addSvgElementFromJson({
                element: 'image',
                attr: {
                  x: 0,
                  y: 0,
                  width: width,
                  height: height,
                  id: svgCanvas.getNextId(),
                  style: 'pointer-events:inherit'
                }
              });
              svgCanvas.setHref(newImage, e.target.result);
              svgCanvas.selectOnly([newImage]);
              svgCanvas.alignSelectedElements('m', 'page');
              svgCanvas.alignSelectedElements('c', 'page');
              updateContextPanel();
              $$b('#dialog_box').hide();
            };
            // create dummy img so we know the default dimensions
            var imgWidth = 100;
            var imgHeight = 100;
            var img = new Image();
            img.src = e.target.result;
            img.style.opacity = 0;
            img.onload = function () {
              imgWidth = img.offsetWidth;
              imgHeight = img.offsetHeight;
              insertNewImage(imgWidth, imgHeight);
            };
          };
          reader.readAsDataURL(file);
        }
      }
    };

    workarea[0].addEventListener('dragenter', onDragEnter, false);
    workarea[0].addEventListener('dragover', onDragOver, false);
    workarea[0].addEventListener('dragleave', onDragLeave, false);
    workarea[0].addEventListener('drop', importImage, false);

    var open = $$b('<input type="file">').change(function () {
      var f = this;
      editor.openPrep(function (ok) {
        if (!ok) {
          return;
        }
        svgCanvas.clear();
        if (f.files.length === 1) {
          $$b.process_cancel(uiStrings$1.notification.loadingImage);
          var reader = new FileReader();
          reader.onloadend = function (e) {
            loadSvgString(e.target.result);
            updateCanvas();
          };
          reader.readAsText(f.files[0]);
        }
      });
    });
    $$b('#tool_open').show().prepend(open);

    var imgImport = $$b('<input type="file">').change(importImage);
    $$b('#tool_import').show().prepend(imgImport);
  }

  // $(function () {
  updateCanvas(true);
  // });

  //  const revnums = 'svg-editor.js ($Rev$) ';
  //  revnums += svgCanvas.getVersion();
  //  $('#copyright')[0].setAttribute('title', revnums);

  /**
  * @param {String} lang The language code
  * @param {Object} allStrings
  */
  var setLang = editor.setLang = function (lang, allStrings) {
    editor.langChanged = true;
    $$b.pref('lang', lang);
    $$b('#lang_select').val(lang);
    if (!allStrings) {
      return;
    }
    $$b.extend(uiStrings$1, allStrings);

    // const notif = allStrings.notification; // Currently unused
    // $.extend will only replace the given strings
    var oldLayerName = $$b('#layerlist tr.layersel td.layername').text();
    var renameLayer = oldLayerName === uiStrings$1.common.layer + ' 1';

    svgCanvas.setUiStrings(allStrings);
    Actions.setTitles();

    if (renameLayer) {
      svgCanvas.renameCurrentLayer(uiStrings$1.common.layer + ' 1');
      populateLayers();
    }

    // In case extensions loaded before the locale, now we execute a callback on them
    if (extsPreLang.length) {
      while (extsPreLang.length) {
        var ext = extsPreLang.shift();
        ext.langReady({ lang: lang, uiStrings: uiStrings$1 });
      }
    } else {
      svgCanvas.runExtensions('langReady', { lang: lang, uiStrings: uiStrings$1 });
    }
    svgCanvas.runExtensions('langChanged', lang);

    // Update flyout tooltips
    setFlyoutTitles();

    // Copy title for certain tool elements
    var elems = {
      '#stroke_color': '#tool_stroke .icon_label, #tool_stroke .color_block',
      '#fill_color': '#tool_fill label, #tool_fill .color_block',
      '#linejoin_miter': '#cur_linejoin',
      '#linecap_butt': '#cur_linecap'
    };

    $$b.each(elems, function (source, dest) {
      $$b(dest).attr('title', $$b(source)[0].title);
    });

    // Copy alignment titles
    $$b('#multiselected_panel div[id^=tool_align]').each(function () {
      $$b('#tool_pos' + this.id.substr(10))[0].title = this.title;
    });
  };
  init$7({
    addLangData: function addLangData(langParam) {
      return editor.canvas.runExtensions('addlangData', langParam, true);
    },

    curConfig: curConfig,
    setLang: setLang
  });
  // Load extensions
  // Bit of a hack to run extensions in local Opera/IE9
  if (document.location.protocol === 'file:') {
    setTimeout(extFunc, 100);
  } else {
    // Returns a promise (if we wanted to fire 'extensions-loaded' event)
    extFunc();
  }
};

/**
* Queues a callback to be invoked when the editor is ready (or
*   to be invoked immediately if it is already ready)--i.e.,
*   once all callbacks set by `svgEditor.runCallbacks` have been run
* @param {Function} cb Callback to be queued to invoke
*/
editor.ready = function (cb) {
  if (!isReady) {
    callbacks.push(cb);
  } else {
    cb();
  }
};

/**
* Invokes the callbacks previous set by `svgEditor.ready`
*/
editor.runCallbacks = function () {
  // Todo: See if there is any benefit to refactoring some
  //   of the existing `editor.ready()` calls to return Promises
  return Promise.all(callbacks.map(function (cb) {
    return cb();
  })).then(function () {
    isReady = true;
  });
};

/**
* @param {String} str The SVG string to load
*/
editor.loadFromString = function (str) {
  editor.ready(function () {
    loadSvgString(str);
  });
};

/**
* Not presently in use
* @param featList
*/
editor.disableUI = function (featList) {
  // $(function () {
  //   $('#tool_wireframe, #tool_image, #main_button, #tool_source, #sidepanels').remove();
  //   $('#tools_top').css('left', 5);
  // });
};

/**
* @param url URL from which to load an SVG string via Ajax
* @param {Object} [opts] May contain properties: `cache`, `callback` (invoked with `true` or `false` depending on success)
*/
editor.loadFromURL = function (url, opts) {
  if (!opts) {
    opts = {};
  }

  var _opts = opts,
      cache = _opts.cache,
      cb = _opts.callback;


  editor.ready(function () {
    $$b.ajax({
      url: url,
      dataType: 'text',
      cache: !!cache,
      beforeSend: function beforeSend() {
        $$b.process_cancel(uiStrings$1.notification.loadingImage);
      },
      success: function success(str) {
        loadSvgString(str, cb);
      },
      error: function error(xhr, stat, err) {
        if (xhr.status !== 404 && xhr.responseText) {
          loadSvgString(xhr.responseText, cb);
        } else {
          $$b.alert(uiStrings$1.notification.URLloadFail + ': \n' + err, cb);
        }
      },
      complete: function complete() {
        $$b('#dialog_box').hide();
      }
    });
  });
};

/**
* @param {String} str The Data URI to base64-decode (if relevant) and load
*/
editor.loadFromDataURI = function (str) {
  editor.ready(function () {
    var base64 = false;
    var pre = str.match(/^data:image\/svg\+xml;base64,/);
    if (pre) {
      base64 = true;
    } else {
      pre = str.match(/^data:image\/svg\+xml(?:;(?:utf8)?)?,/);
    }
    if (pre) {
      pre = pre[0];
    }
    var src = str.slice(pre.length);
    loadSvgString(base64 ? decode64(src) : decodeURIComponent(src));
  });
};

/**
* @param {...*} args Arguments to pass to `svgCanvas.addExtension` (though invoked on `svgEditor`)
*/
editor.addExtension = function () {
  // Note that we don't want this on editor.ready since some extensions
  // may want to run before then (like server_opensave).
  // $(function () {
  if (svgCanvas) {
    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    svgCanvas.addExtension.apply(this, args);
  }
  // });
};

// Defer injection to wait out initial menu processing. This probably goes
//    away once all context menu behavior is brought to context menu.
editor.ready(function () {
  injectExtendedContextMenuItemsIntoDom();
});

// Run init once DOM is loaded
// jQuery(editor.init);
Promise.resolve().then(function () {
  // We wait a micro-task to let the svgEditor variable be defined for module checks
  editor.init();
});

export default editor;
