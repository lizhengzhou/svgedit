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
    const svgUtils = svgCanvas.getPrivateMethods();
    const seNs = svgCanvas.getEditorNS(true);

    let focusPoint, IsDrawing, startElem, endElem, currentRoute, IsControl, controlElem;
    const currentStrokeWidth = 4, pointRadius = 2, controlRadius = 4;
    let startElemCmd;

    const {
      InsertElementCommand,
      ChangeElementCommand,
      BatchCommand
    } = svgUtils;

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
            /**
             * 如果选择了起始点，则使用起始点画路线；如果没有选择起始点，则新画一个起始点
             */
            let x, y;
            IsDrawing = true;
            if (focusPoint) {
              x = focusPoint.getAttribute('cx');
              y = focusPoint.getAttribute('cy');

              startElem = focusPoint;
            } else {
              x = opts.start_x.toFixed(0);
              y = opts.start_y.toFixed(0);

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
            /**
             * 画控制点
             */
            const x = opts.start_x,
              y = opts.start_y;

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
            /**
             * 突出显示选中的点
             */
            const mouseTarget = opts.event.target;
            if (mouseTarget && mouseTarget !== focusPoint && mouseTarget.tagName === 'circle' && mouseTarget.getAttribute('class') === 'point') {
              focusPoint = mouseTarget;
              focusPoint.orignRadis = focusPoint.getAttribute('r');
              focusPoint.setAttribute('r', focusPoint.orignRadis * 3);
            } else if (focusPoint && mouseTarget && mouseTarget.tagName === 'svg') {
              focusPoint.setAttribute('r', focusPoint.orignRadis);
              focusPoint = null;
            }
          } else {
            /**
             * 移动路线终点或者控制点
             */
            const zoom = svgCanvas.getZoom();
            const x = (opts.mouse_x / zoom).toFixed(0),
              y = (opts.mouse_y / zoom).toFixed(0);

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
            /**
             * 画终点并结束
             */
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

            let routeAttr = startElem.getAttributeNS(seNs, 'routes');
            const orgRouteAttr = routeAttr;
            if (!routeAttr) {
              routeAttr = currentRoute.id;
            } else {
              routeAttr += ' ' + currentRoute.id;
            }
            startElem.setAttributeNS(seNs, 'se:routes', routeAttr);

            if (!orgRouteAttr) {
              startElemCmd = new InsertElementCommand(startElem);
            } else {
              startElemCmd = new ChangeElementCommand(startElem, {
                'se:routes': orgRouteAttr
              });
            }

            currentRoute.setAttributeNS(seNs, 'se:points', startElem.id + ' ' + endElem.id);

            if (svgCanvas.getSelectedElems().length > 0) {
              svgCanvas.clearSelection();
            }

            if (focusPoint) {
              focusPoint.setAttribute('r', focusPoint.orignRadis);
              focusPoint = null;
            }

            /**
             * 如果按了空格键，则继续点击画控制点
             */
            if (svgCanvas.spaceKey) {
              IsControl = true;
            } else {
              const batchCmd = new BatchCommand();
              batchCmd.addSubCommand(new InsertElementCommand(endElem));
              batchCmd.addSubCommand(new InsertElementCommand(currentRoute));
              batchCmd.addSubCommand(startElemCmd);
              S.addCommandToHistory(batchCmd);

              IsDrawing = false;
              svgEditor.clickSelect();
            }

            return {
              keep: true
            };
          } else if (IsDrawing && IsControl) {
            /**
             * 结束弧线绘制
             */
            const batchCmd = new BatchCommand();
            batchCmd.addSubCommand(new InsertElementCommand(controlElem));
            batchCmd.addSubCommand(new InsertElementCommand(endElem));
            batchCmd.addSubCommand(new InsertElementCommand(currentRoute));
            batchCmd.addSubCommand(startElemCmd);
            S.addCommandToHistory(batchCmd);

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
