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
      }],

      mouseDown(opts) {
        if (svgCanvas.getMode() === 'point') {

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

            var points = route.getAttributeNS(seNs, 'route').split(' ');
            var startElem1 = getElem(points[0]),
              endElem1 = point,
              startElem2 = point,
              endElem2 = getElem(points[1]);

            curve.x = x;
            curve.y = y;

            route.setAttributeNS(seNs, 'se:route', [points[0], point.id, points[2]].join(' '));

            endElem2.before(path);
            path.setAttributeNS(seNs, 'se:route', startElem2.id + ' ' + endElem2.id);

            svgCanvas.setMode('select');
          }
        }
      }
    };
  }
};