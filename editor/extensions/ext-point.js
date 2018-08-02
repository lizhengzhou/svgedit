/* globals jQuery */
/*
 * ext-point.js
 *
 *
 * Copyright(c) 2010 CloudCanvas, Inc.
 * All rights reserved
 *
 */
export default {
  name: 'point',
  init(S) {
    const svgEditor = this;
    const $ = jQuery;
    const svgCanvas = svgEditor.canvas,
      addElem = S.addSvgElementFromJson;
    var seNs = svgCanvas.getEditorNS(true);
    var getNextId = S.getNextId,
      getElem = S.getElem;
    var svgUtils = svgCanvas.getPrivateMethods();
    var assignAttributes = svgCanvas.assignAttributes;

    const imgSrc = {
      'control': 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACIAAAAqCAYAAADWFImvAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyZpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNi1jMTM4IDc5LjE1OTgyNCwgMjAxNi8wOS8xNC0wMTowOTowMSAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIDIwMTcgKFdpbmRvd3MpIiB4bXBNTTpJbnN0YW5jZUlEPSJ4bXAuaWlkOjQ2REU3N0M3NjQ5ODExRThCRUE4REU0OEE1NEY2OEVGIiB4bXBNTTpEb2N1bWVudElEPSJ4bXAuZGlkOjQ2REU3N0M4NjQ5ODExRThCRUE4REU0OEE1NEY2OEVGIj4gPHhtcE1NOkRlcml2ZWRGcm9tIHN0UmVmOmluc3RhbmNlSUQ9InhtcC5paWQ6NDZERTc3QzU2NDk4MTFFOEJFQThERTQ4QTU0RjY4RUYiIHN0UmVmOmRvY3VtZW50SUQ9InhtcC5kaWQ6NDZERTc3QzY2NDk4MTFFOEJFQThERTQ4QTU0RjY4RUYiLz4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz5FRvNLAAAE5ElEQVR42rxYW0xcVRRdM8wDoYMF6hQBU9raArE+qjb6gdhotEDRaPxpjak1rbVtam2iadQPI40mStKf8mH5qnyAxg8TTVuBtNg6xrfU1hJRg0yFAsOzDAzMZZi57n3mDEzb4T5gxn2ycu6957HX7HP2PvuM5dnBRpgQN6GK8ChhA6GIkCXb/AQv4TLhPKGZMKA34ee3PS9qW8QYgUcIhwkVPGaBPiskHiTsJIQJXxFqCR49BbaIqtm+hnCMsBXmJY1QLXGKcJDwjwaRBZlsJxyPM/1SZKu06j5CU2IiiQe+Q6hBcoV/EG/IOwlHbiISvtkib6eARLzUyP3zvtYe2X5jhxTJe3K/fJLIIqsJ9fj/hHX9QOjmFyvvEYk6givuPdVgXXUxVpay3gauy4z4eoqk3FOwwxNbmsNmRjosaah3V6LYlkOxk4JnTw/5AjlDTg5+U3w4MNRCv1g1Ot0bbAQrbVY3oZI3rVEUpLlQbM8VJMZ3vQjlsc24tm8XMDqK+5wrkWvNgIn5qh7uaXCzRao0wraQnVl3Y5nVIZ7blQEMzk5FGzo7kfH1N7AHFQrmrUBvr7AKW+Oh9Hzc78wT3SYjM/jY//uCQZXPLyIiDjBNWWVfjurMtdFTL5CJE+Ny0nXroFQ8AfVMG0KVFXAWForPNCcqMtaiMnONeD8Z6BLfNGQzW2SDHpF3h79Foc1FZneLlZ9b/4ICLGugYOn1wsEksrPFZz42Ynrbgz4xPqxqMrmL3bdIz9UUNYKDg2fxb8gfVTTncxy4+4F7/qQlGaF3y3Xt3P/QUJsYr6NjNVvEZWRrD89OY4+vFaWOXMwflL2YjjyOdEsfKbsd6dYz9K1ULMPZwBUcG2sX4wyIi/eIxaifdc/4BdY7suWXX0h5H02gwmkhy+AnQYS94eRkt6lgwmnABNW5Wp22ZZUgS3rNBWUQ/rAiWzYiHFmPNMtfUNVVsFg3ze2RB9JXYqPTHU3dyGs+9XdqqZjgpenWI1KWUYAtmUXi+cuJLnw0dlG2FMFm/ZnqS7Q9VlGdL71GxTZXCZ52RT2tJeBF4/gfWiq8HNA69ILOof5z6FBGxAhVIvqswocpOrlsVNv56JIWme9zKTgsxuvouGwNQz1HgBYm1RBe6mtB/2xAKA9LNdNUDgQ/QPnMM3ht+qh4h3RvLtx/d3+rGK+j4zznI5zgzupF16uhAF642ox7nSsQy2EmqLRbv0PI4cOvyvdQqNxChds9U32oG70oxukI6z7Ne8QnU/9qvREdwRGBO+xRj19O5UPbm6gPNWG/fQcyqbA1eHM2Xus06jDNA8V7fLEMrdYIkZhcmZnA/r42lDpz8NytT+IpexX98mkcH+vAheAQRmcVM55bK5NnwcQjU37D14bP/H+LelNGHvJteeii479m6Eezucjp4ZJXPDfmrHzvKOcoZ2oqdb6KqKZGcvx6NS5nnWvgZHavTPkNyxbvF4vNzPbGX7hs6vWZVJO8d6TyOhHbF016V84j8jL0eopInCC8leCmpy6URyIFZJjE7vhMYn5pVM2kNplkFiRh5G+JZJHRJKFnkWSR0SWRyGuSTcYQCcyd28YvQkdTQcIsETNkTJFYDBEjZEyTWCwRLTJM4mWzJJZCJBGZGInwYiazLTE+xLwpZykkkkEkRsa6mOWIl/8EGADyH4OsfMBFOwAAAABJRU5ErkJggg==',
      'charge': 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACIAAAAqCAYAAADWFImvAAADi0lEQVRYhb2YXUgUURTHf7tOZR8afWCIUbZKPWQQEUFfWPQS6ltW2EMEZhR9QCSBBYFRL1FBBJER1EsGQRRRJlRgLplUYFCxRKFGJVpK5ZZm7c7pYWbd2XU/7h21A5edOXPu//7m3Jk7565HnqxEw3KAEqAYKALygWz7Wj/QCbwGHgONQHdaxVUtABiIqACsBQ4DGwEjScxsuy0HdgBh4D5wCvCnG8CLCCmaD5G7iDQjUoaIkSbe2TLsPs22hi9hnAJIBSJtiJRqDJ6sldpa25KBJJuaY0CtwpTpWDZwDSgEjsdfTARyZBwgnFaL9fycjAUxY0Aq4gPGyU4A7cD1KIiYkeMFQN1/gIhYHdAKdNggwxk5D2Rpy81YAcvi+EM/oXUTDH1J1TPLHrMMwIspYMoaTCm1jzUaULBv5BDvzsFgj4pGKQ+WrrUzYoK1WOlbznqYviTW970NPt4AlBZKgGrA75HGohzgM8lXzMTm8cKqmzCtMOoz/0BLOfzq0FEKAXkGppRoQwDklcRCALyvg2C7rpIBlBiIWawN4Z0AhXtjfcF30H4Zx1uoY+sMTCnS7jZvM0yZ63AIBE6DJxMyMkfG/+1Pp7jYI3cWfcX6aqpZxmTY8BAmzVKLf38JAmfTRfUZiKm3dvi2q0N0P7Ig0k9XloEpHmWIidOhYKda7I8APD8I4bBSuIFIEFC7xcIqmKCQwMFueFoFoQElWSBoIGaHMkj/W2g7GuubOh8W7oqehwehdQ8MdKlCAHQamPIGq7xTCL810rekxnEi8OwQ9L3UgQB47UWkyXXl5cmA/E1RuVen4FODG63HBiL3sZZZ/dU1d0P0DfpwGwIXtCXssRu8iPQg0ugqI/lbLaneF9aUuMtsI1s+9BiYJlglf5nWfUzJhdxiCHZCcyWEhtxkIzL2cBXvR+SeXjbKrdfTXwm/e91mo4GKT34nCIgcQCSoJgD4toJ/F3wLuIUIIrI/khYnSDsiu5VE5qyGwEXoanILgT3WcM0Qv52ox9p3pN5OhIfg7VW3z0Tkuah3OhLta45jbYYOJZXpaR0NxBWgJt6ZbKdXbf8mh3EPsROr7I4xb4pO1cCZ/wEB6f+WGKvMpIRQARkLmLQQkHpq4mHcTJMShA6IGxhlCF0QHRgtCDcgKjDaEG5BUsFcAap0IUYDkggmAqFWtseZflU2EgZg5mggxgIkAuPFxXQ47R+n886QTuG5WwAAAABJRU5ErkJggg=='
    };

    return {
      name: 'point',
      svgicons: svgEditor.curConfig.extIconsPath + 'wcs-point-icon.xml',
      buttons: [{
          id: 'point',
          type: 'mode',
          title: 'Draw a Point',
          position: '5',
          events: {
            click() {
              svgCanvas.setMode('point');
            }
          }
        },
        {
          id: 'point_IsControl',
          type: 'mode',
          title: 'Draw a Control Point',
          position: '5',
          events: {
            click() {
              svgCanvas.setMode('point_IsControl');
            }
          }
        },
        {
          id: 'point_IsCharge',
          type: 'mode',
          title: 'Draw a Charge Point',
          position: '5',
          events: {
            click() {
              svgCanvas.setMode('point_IsCharge');
            }
          }
        }
      ],
      mouseDown(opts) {
        var mode = svgCanvas.getMode();
        if (mode.split('_')[0] === 'point') {

          var mouseTarget = opts.event.target;
          if (mouseTarget && mouseTarget.tagName === 'path' && mouseTarget.getAttribute('class') === 'route') {
            const x = opts.start_x;
            const y = opts.start_y;

            var route = mouseTarget;
            var curve = route.pathSegList.getItem(1);

            var path = addElem({
              element: 'path',
              attr: {
                id: getNextId(),
                d: 'M' + x + ',' + y + ' L' + curve.x + ',' + curve.y,
                stroke: '#ff7f00',
                'stroke-width': 4,
                fill: 'none',
                'class': 'route'
              }
            });

            var point = addElem({
              element: 'circle',
              attr: {
                id: getNextId(),
                cx: x,
                cy: y,
                r: 8,
                stroke: '#00ffff',
                'stroke-width': 4,
                fill: '#fff',
                'class': 'point'
              }
            });

            point.setAttributeNS(seNs, 'se:routes', route.id + ' ' + path.id);

            if (mode.split('_')[1]) {
              var imgElem = addElem({
                element: 'image',
                attr: {
                  id: getNextId(),
                  x: x - 17,
                  y: y - 50,
                  width: 34,
                  heigth: 42
                }
              });

              var href = imgSrc.control;
              switch (mode.split('_')[1]) {
                case 'IsCharge':
                  href = imgSrc.charge;
                  break;
                default:
                  href = imgSrc.control;
              }
              setHref(imgElem, href);
              svgUtils.preventClickDefault(imgElem);

              imgElem.setAttributeNS(seNs, 'se:point', point.id);
              point.setAttributeNS(seNs, 'se:nebor', imgElem.id);
              point.setAttributeNS(seNs, 'se:' + mode.split('_')[1], true);
            }

            var points = route.getAttributeNS(seNs, 'points').split(' ');
            var startElem1 = getElem(points[0]),
              endElem1 = point,
              startElem2 = point,
              endElem2 = getElem(points[1]);

            curve.x = x;
            curve.y = y;

            route.setAttributeNS(seNs, 'se:points', [points[0], point.id, points[2]].join(' '));

            endElem2.before(path);
            path.setAttributeNS(seNs, 'se:points', startElem2.id + ' ' + endElem2.id);

            var endRoute = [];
            var endRouteAttr = endElem2.getAttributeNS(seNs, 'routes');
            if (endRouteAttr) {
              endRoute = endRouteAttr.trim().split(' ');
            }
            endRoute.push(path.id);
            endElem2.setAttributeNS(seNs, 'se:routes', endRoute.join(' '));

            svgCanvas.setMode('select');
          }
        }
      },
      mouseMove: function mouseMove(opts) {

        const zoom = svgCanvas.getZoom();
        const x = opts.mouse_x / zoom;
        const y = opts.mouse_y / zoom;

        if (svgCanvas.getSelectedElems().length == 1) {
          var elems = svgCanvas.getSelectedElems();
          var elem = elems[0];
          if (elem && elem.tagName === 'circle' && elem.getAttribute('class') === 'point') {
            //Point Group Changed
            if (elem.getAttributeNS(seNs, 'nebor')) {
              var bebor = getElem(elem.getAttributeNS(seNs, 'nebor'));
              bebor.setAttribute('x', x - 17);
              bebor.setAttribute('y', y - 50);
            }
          } else if (elem && elem.tagName === 'image' && elem.getAttributeNS(seNs, 'point')) {
            var point = getElem(elem.getAttributeNS(seNs, 'point'));
            if (point) {
              assignAttributes(point, {
                cx: x,
                cy: y + 30
              });
              svgCanvas.call('changed', [point]);
            }
          }
        }
      },
      elementChanged: function elementChanged(opts) {
        opts.elems.forEach(function (elem) {
          if (!svgcontent.getElementById(elem.id)) {
            if (elem.tagName === 'circle' && elem.getAttribute('class') === 'point') {
              if (elem.getAttributeNS(seNs, 'nebor')) {
                var bebor = getElem(elem.getAttributeNS(seNs, 'nebor'));
                if (bebor) bebor.remove();
              }
            } else if (elem.tagName === 'image' && elem.getAttributeNS(seNs, 'point')) {
              var point = getElem(elem.getAttributeNS(seNs, 'point'));
              if (point) {
                point.remove();
                svgCanvas.call('changed', [point]);
              }
            }
          }
        });
      }
    };

    function setHref(elem, val) {
      elem.setAttributeNS(S.NS.XLINK, 'xlink:href', val);
    };


  }
};