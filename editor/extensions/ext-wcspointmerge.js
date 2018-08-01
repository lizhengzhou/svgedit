/* globals jQuery */
/*
 * ext-wcspointmerge.js
 *
 *
 * Copyright(c) 2010 CloudCanvas, Inc.
 * All rights reserved
 *
 */
export default {
  name: 'wcspointmerge',
  init(S) {
    const svgEditor = this;
    const $ = jQuery;
    const svgCanvas = svgEditor.canvas,
      addElem = S.addSvgElementFromJson;
    var seNs = svgCanvas.getEditorNS(true);
    let selElem, line;


    return {
      name: 'dot',
      svgicons: svgEditor.curConfig.extIconsPath + 'wcspointmerge-icon.xml',
      buttons: [{
        id: 'wcspointmerge',
        type: 'mode',
        title: 'Merge two Points',
        events: {
          click() {
            svgCanvas.setMode('wcspointmerge');
          }
        }
      }],
      mouseDown(opts) {
        if (svgCanvas.getMode() === 'wcspointmerge') {
          var mouseTarget = opts.event.target;
          if (mouseTarget && mouseTarget.tagName === 'circle' && mouseTarget.getAttribute('class') === 'point') {
            mouseTarget.setAttribute('fill', 'orange');
            selElem = mouseTarget;

            const x = opts.start_x;
            const y = opts.start_y;

            line = addElem({
              element: 'line',
              attr: {
                x1: x,
                y1: y,
                x2: x,
                y2: y,
                stroke: '#ff7f00',
                'stroke-width': 4,
                'stroke-dasharray': '5,5'
              }
            });
          }
        }
        return {
          started: true
        };
      },
      mouseMove(opts) {
        if (svgCanvas.getMode() === 'wcspointmerge') {
          const zoom = svgCanvas.getZoom();

          var x2 = opts.mouse_x / zoom,
            y2 = opts.mouse_y / zoom;

          if (line) {
            var x1 = line.getAttribute('x1'),
              y1 = line.getAttribute('y1');

            if (x2 > x1) {
              x2--;
            } else {
              x2++;
            }

            if (y2 > y1) {
              y2--;
            } else {
              y2++;
            }

            line.setAttribute('x2', x2);
            line.setAttribute('y2', y2);
          }
        }
      },
      mouseUp(opts) {
        if (svgCanvas.getMode() === 'wcspointmerge') {
          var mouseTarget = opts.event.target;
          if (mouseTarget && mouseTarget.tagName === 'circle' && mouseTarget.getAttribute('class') === 'point') {
            if (selElem && selElem != mouseTarget) {
              mergePoint(selElem, mouseTarget);
            }
          }

          if (selElem) {
            selElem.setAttribute('fill', 'white');
          }

          if (line) {
            line.remove();
          }

          return {
            keep: true
          };
        }
      }

    };



    function mergePoint(selElem, mouseTarget) {
      // $.alert('123');
      var routers = $(svgcontent).find('.route');
      var route, pos;
      routers.each(function () {
        var points = this.getAttributeNS(seNs, 'route').split(' ');
        if (points[0] == selElem.id || points[1] == selElem.id) {
          route = this;
          if (points[0] == selElem.id) pos = 'start';
          else if (points[1] == selElem.id) pos = 'end';

          var points = route.getAttributeNS(seNs, 'route').split(' ');

          var cx = mouseTarget.getAttribute('cx'),
            cy = mouseTarget.getAttribute('cy');

          if (pos == 'start') {
            points[0] = mouseTarget.id;

            var move = route.pathSegList.getItem(0);
            move.x = cx;
            move.y = cy;

          } else if (pos == 'end') {
            points[1] = mouseTarget.id;

            var curve = route.pathSegList.getItem(1);
            curve.x = cx;
            curve.y = cy;
          }

          mouseTarget.before(route);
          route.setAttributeNS(seNs, 'se:route', points.join(' '));

          selElem.remove();
        }
      });
    }


  }
};