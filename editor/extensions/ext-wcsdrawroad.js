// /* globals jQuery */
/*
 * ext-wcsdrawroad.js
 *
 * Licensed under the MIT License
 *
 * Copyright(c) 2010 Alexis Deveria
 *
 */

/*
  WCS 地图编辑器，画路线
*/

export default {
  name: 'drawroad',
  init (S) {
    const svgEditor = this;
    // const $ = jQuery;
    const svgCanvas = svgEditor.canvas;
    const addElem = S.addSvgElementFromJson;
    const getNextId = S.getNextId;
    const seNs = svgCanvas.getEditorNS(true);

    let focusPoint, IsDrawing, startElem, endElem, currentRoute, IsControl, controlElem;
    const currentStrokeWidth = 4, pointRadius = 2, controlRadius = 4;

    return {
      name: 'drawroad',
      svgicons: svgEditor.curConfig.extIconsPath + 'wcsdrawroad-icon.xml',
      buttons: [{
        id: 'drawroad',
        type: 'mode',
        title: '画复杂线路 直线/弧线[空格]',
        events: {
          click () {
            svgCanvas.setMode('drawroad');
          }
        }
      }],
      mouseDown: function mouseMove (opts) {
        if (svgCanvas.getMode() === 'drawroad') {
          const zoom = svgCanvas.getZoom();
          if (!IsDrawing) {
            let x, y;
            IsDrawing = true;
            if (focusPoint) {
              x = focusPoint.getAttribute('cx');
              y = focusPoint.getAttribute('cy');

              startElem = focusPoint;
            } else {
              x = opts.start_x / zoom;
              y = opts.start_y / zoom;

              startElem = addElem({
                element: 'circle',
                attr: {
                  id: getNextId(),
                  cx: x,
                  cy: y,
                  r: pointRadius / zoom,
                  stroke: '#ff7f00',
                  'stroke-width': currentStrokeWidth,
                  fill: '#ff7f00',
                  class: 'point'
                }
              });
            }

            currentRoute = addElem({
              element: 'path',
              attr: {
                id: getNextId(),
                d: 'M' + x + ',' + y + ' L' + x + ',' + y,
                stroke: 'url(#roadpattern)',
                'stroke-width': currentStrokeWidth,
                fill: 'none',
                class: 'route'
              }
            });
          } else if (IsControl) {
            const x = opts.start_x / zoom,
              y = opts.start_y / zoom;

            controlElem = addElem({
              element: 'circle',
              attr: {
                id: getNextId(),
                cx: x,
                cy: y,
                r: controlRadius / zoom,
                stroke: 'none',
                fill: 'red',
                class: 'control'
              }
            });

            controlElem.setAttributeNS(seNs, 'se:path', currentRoute.id);

            const x1 = startElem.getAttribute('cx');
            const y1 = startElem.getAttribute('cy');
            const x2 = endElem.getAttribute('cx');
            const y2 = endElem.getAttribute('cy');

            currentRoute.setAttribute('d', 'M' + x1 + ',' + y1 + ' Q' + x + ',' + y + ' ' + x2 + ',' + y2);

            currentRoute.setAttributeNS(seNs, 'se:points', startElem.id + ' ' + endElem.id + ' ' + controlElem.id);
          }
        }
      },
      mouseMove: function mouseMove (opts) {
        if (svgCanvas.getMode() === 'drawroad') {
          if (!IsDrawing) {
            const mouseTarget = opts.event.target;
            if (mouseTarget && mouseTarget !== focusPoint && mouseTarget.tagName === 'circle' && mouseTarget.getAttribute('class') === 'point') {
              focusPoint = mouseTarget;
              focusPoint.orignRadis = focusPoint.getAttribute('r');
              focusPoint.setAttribute('r', focusPoint.orignRadis * 2);
            } else if (focusPoint) {
              focusPoint.setAttribute('r', focusPoint.orignRadis);
              focusPoint = null;
            }
          } else {
            const zoom = svgCanvas.getZoom();
            const x = opts.mouse_x / zoom,
              y = opts.mouse_y / zoom;

            if (!IsControl) {
              const curve = currentRoute.pathSegList.getItem(1);
              curve.x = x;
              curve.y = y;
            } else if (IsControl && controlElem) {
              controlElem.setAttribute('cx', x);
              controlElem.setAttribute('cy', y);

              const curve = currentRoute.pathSegList.getItem(1);
              curve.x1 = x;
              curve.y1 = y;
            }
          }
        }
      },
      mouseUp (opts) {
        if (svgCanvas.getMode() === 'drawroad') {
          if (IsDrawing && !IsControl) {
            const curve = currentRoute.pathSegList.getItem(1);

            const zoom = svgCanvas.getZoom();

            endElem = addElem({
              element: 'circle',
              attr: {
                id: getNextId(),
                cx: curve.x,
                cy: curve.y,
                r: pointRadius / zoom,
                stroke: '#ff7f00',
                'stroke-width': currentStrokeWidth,
                fill: '#ff7f00',
                class: 'point'
              }
            });
            endElem.setAttributeNS(seNs, 'se:routes', currentRoute.id);

            startElem.setAttributeNS(seNs, 'se:routes', currentRoute.id);

            currentRoute.setAttributeNS(seNs, 'se:points', startElem.id + ' ' + endElem.id);

            if (svgCanvas.getSelectedElems().length > 0) {
              svgCanvas.clearSelection();
            }

            if (focusPoint) {
              focusPoint.setAttribute('r', focusPoint.orignRadis);
              focusPoint = null;
            }

            if (svgCanvas.spaceKey) {
              IsControl = true;
            } else {
              IsDrawing = false;
              svgEditor.clickSelect();
            }

            return {
              keep: true
            };
          } else if (IsDrawing && IsControl) {
            IsControl = false;
            IsDrawing = false;
            svgEditor.clickSelect();

            return {
              keep: true
            };
          }
        }
      }
    };
  }
};
