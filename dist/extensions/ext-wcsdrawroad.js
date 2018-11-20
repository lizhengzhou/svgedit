var svgEditorExtension_wcsdrawroad = (function () {
  'use strict';
  /* globals jQuery */
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

  var extwcsdrawroad = {
    name: 'drawroad',
    init(S) {
      const svgEditor = this;
      const $ = jQuery;
      const svgCanvas = svgEditor.canvas;
      const addElem = S.addSvgElementFromJson;
      const getElem = S.getElem;
      const getNextId = S.getNextId;
      const svgUtils = svgCanvas.getPrivateMethods();
      const seNs = svgCanvas.getEditorNS(true);

      let fromElem, toElem, IsDrawing, startElem, endElem, path, currentRoute, IsControl, controlElem;
      let fromElemOrignRadis, toElemOrignRadis;
      let batchCmdList = [];
      let startElemCmd, endElemCmd, controlElemCmd;
      let selRoute;

      const {
        InsertElementCommand,
        ChangeElementCommand,
        BatchCommand
      } = svgUtils;

      $(document).bind('keydown', 'esc', escFunc)
        .bind('keydown', 'ctrl', ctrlDownFunc)
        .bind('keyup', 'ctrl', ctrlUpFunc);

      function escFunc() {
        if (IsDrawing) {
          if (currentRoute) {
            currentRoute.remove();
          }
          if (!path) {
            startElem.remove();
          }
          clearDrawing();
          if (batchCmdList.length > 0) {
            const batchCmd = new BatchCommand();
            batchCmdList.reverse();
            batchCmdList.forEach((v) => {
              batchCmd.addSubCommand(v);
            });
            batchCmdList = [];
            S.addCommandToHistory(batchCmd);
          }
        }
      }

      function ctrlDownFunc() {
        if (IsDrawing && !IsControl) {
          IsControl = true;
          if (currentRoute) {
            currentRoute.setAttribute('display', 'none');
          }
        }
      }

      function ctrlUpFunc() {
        if (IsDrawing && IsControl) {
          IsControl = false;
          controlElem = null;
          if (currentRoute) {
            currentRoute.setAttribute('display', 'block');
          }
        }
      }

      const drawRoadCfg = {
        name: 'drawroad',
        svgicons: svgEditor.curConfig.extIconsPath + 'wcsdrawroad-icon.xml',
        buttons: [{
          id: 'drawroad',
          type: 'mode',
          title: '画复杂线路 直线/弧线[空格]',
          events: {
            click() {
              svgCanvas.setMode('drawroad');
            }
          }
        }],
        mouseDown: function mouseMove(opts) {
          if (svgCanvas.getMode() === 'drawroad') {
            if (!IsDrawing) {
              /**
               * 如果选择了起始点，则使用起始点画路线；如果没有选择起始点，则新画一个起始点
               */
              let x, y;
              IsDrawing = true;
              if (fromElem) {
                x = fromElem.getAttribute('cx');
                y = fromElem.getAttribute('cy');

                startElem = fromElem;
              } else {
                x = opts.start_x.toFixed(0);
                y = opts.start_y.toFixed(0);

                startElem = addElem({
                  element: 'circle',
                  attr: {
                    id: getNextId(),
                    cx: x,
                    cy: y,
                    r: $('#default_stroke_width input').val() / 2,
                    stroke: 'none',
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
                  'stroke-width': $('#default_stroke_width input').val(),
                  fill: 'none',
                  class: 'route'
                }
              });

              return;
            }

            if (IsDrawing && !IsControl) {
              const curve = currentRoute.pathSegList.getItem(1);
              const x = curve.x, y = curve.y;

              if (toElem) {
                endElem = toElem;
              } else {
                /**
                 * 画终点
                 */
                endElem = addElem({
                  element: 'circle',
                  attr: {
                    id: getNextId(),
                    cx: x,
                    cy: y,
                    r: $('#default_stroke_width input').val() / 2,
                    stroke: 'none',
                    fill: '#ff7f00',
                    class: 'point'
                  }
                });
              }

              let routeAttr = startElem.getAttributeNS(seNs, 'routes');
              let orgRouteAttr = routeAttr;
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

              routeAttr = endElem.getAttributeNS(seNs, 'routes');
              orgRouteAttr = routeAttr;
              if (!routeAttr) {
                routeAttr = currentRoute.id;
              } else {
                routeAttr += ' ' + currentRoute.id;
              }
              endElem.setAttributeNS(seNs, 'se:routes', routeAttr);

              if (!orgRouteAttr) {
                endElemCmd = new InsertElementCommand(endElem);
              } else {
                endElemCmd = new ChangeElementCommand(endElem, {
                  'se:routes': orgRouteAttr
                });
              }

              currentRoute.setAttributeNS(seNs, 'se:points', startElem.id + ' ' + endElem.id);

              batchCmdList.push(startElemCmd);
              batchCmdList.push(new InsertElementCommand(currentRoute));
              if (controlElemCmd) {
                batchCmdList.push(controlElemCmd);
                controlElemCmd = null;
              }
              batchCmdList.push(endElemCmd);

              /**
             * 开始点为上一个结束点，新画线
             */
              startElem = endElem;
              endElem = null;
              path = currentRoute;

              currentRoute = addElem({
                element: 'path',
                attr: {
                  id: getNextId(),
                  d: 'M' + x + ',' + y + ' L' + x + ',' + y,
                  stroke: 'url(#roadpattern)',
                  'stroke-width': $('#default_stroke_width input').val(),
                  fill: 'none',
                  class: 'route'
                }
              });
            }

            if (IsDrawing && IsControl && !controlElem) {
              const x = opts.start_x.toFixed(0),
                y = opts.start_y.toFixed(0);

              controlElem = addElem({
                element: 'circle',
                attr: {
                  id: getNextId(),
                  cx: x,
                  cy: y,
                  r: $('#default_stroke_width input').val(),
                  stroke: 'none',
                  fill: 'red',
                  class: 'control'
                }
              });

              controlElem.setAttributeNS(seNs, 'se:path', path.id);

              const move = path.pathSegList.getItem(0);
              const curve = path.pathSegList.getItem(1);

              const x1 = move.x, y1 = move.y,
                x2 = curve.x, y2 = curve.y;

              path.setAttribute('d', 'M' + x1 + ',' + y1 + ' Q' + x + ',' + y + ' ' + x2 + ',' + y2);

              const pointAttr = path.getAttribute('se:points');
              path.setAttributeNS(seNs, 'se:points', pointAttr + ' ' + controlElem.id);

              controlElemCmd = new InsertElementCommand(controlElem);
            }
          }
        },
        mouseMove: function mouseMove(opts) {
          if (svgCanvas.getMode() === 'drawroad') {
            const mouseTarget = opts.event.target;
            if (mouseTarget && mouseTarget !== selRoute && mouseTarget.tagName === 'path' && mouseTarget.getAttribute('class') === 'route') {
              selRoute = mouseTarget;
              focusRoute(selRoute);
            }

            if (!IsDrawing) {
              /**
               * 突出显示选中的起始点
               */
              if (mouseTarget && mouseTarget !== fromElem && mouseTarget.tagName === 'circle' && mouseTarget.getAttribute('class') === 'point') {
                fromElem = mouseTarget;
                fromElemOrignRadis = fromElem.getAttribute('r');
                fromElem.setAttribute('r', fromElemOrignRadis * 3);
              } else if (fromElem && mouseTarget && mouseTarget.tagName === 'svg') {
                fromElem.setAttribute('r', fromElemOrignRadis);
                fromElemOrignRadis = null;
                fromElem = null;
              }
            } else {
              /**
               * 突出显示选中的终点
               */
              if (mouseTarget && mouseTarget !== toElem && mouseTarget.tagName === 'circle' && mouseTarget.getAttribute('class') === 'point') {
                toElem = mouseTarget;
                if (toElem !== fromElem) {
                  toElemOrignRadis = toElem.getAttribute('r');
                } else {
                  toElemOrignRadis = fromElemOrignRadis;
                }
                toElem.setAttribute('r', toElemOrignRadis * 3);
              } else if (toElem && mouseTarget && mouseTarget.tagName === 'svg') {
                toElem.setAttribute('r', toElemOrignRadis);
                toElemOrignRadis = null;
                toElem = null;
              }
            }

            const zoom = svgCanvas.getZoom();
            const x = (opts.mouse_x / zoom).toFixed(0),
              y = (opts.mouse_y / zoom).toFixed(0);

            if (IsDrawing && currentRoute) {
              /**
               * 移动路线终点或者控制点
               */
              const curve = currentRoute.pathSegList.getItem(1);
              curve.x = x;
              curve.y = y;
            }

            if (IsDrawing && IsControl && path && controlElem) {
              controlElem.setAttribute('cx', x);
              controlElem.setAttribute('cy', y);

              const curve = path.pathSegList.getItem(1);
              curve.x1 = x;
              curve.y1 = y;
            }
          }
        },
        mouseUp(opts) {
          if (svgCanvas.getMode() === 'drawroad') {
            return {
              keep: true
            };
          }
        }
      };

      function clearDrawing() {
        if (IsDrawing) {
          if (toElem) {
            toElem.setAttribute('r', toElemOrignRadis);
            toElemOrignRadis = null;
            toElem = null;
          }
          if (fromElem) {
            fromElem.setAttribute('r', fromElemOrignRadis);
            fromElemOrignRadis = null;
            fromElem = null;
          }
          if (currentRoute) {
            currentRoute = null;
          }
          if (path) {
            path = null;
          }
          if (startElem) {
            startElem = null;
          }
          if (endElem) {
            endElem = null;
          }

          IsDrawing = false;
        }
      }

      function focusRoute(route) {
        const pointAttr = route.getAttribute('se:points');
        if (pointAttr) {
          const points = pointAttr.trim().split(' ');
          points.forEach(function (pointId) {
            const point = getElem(pointId);
            moveToFront(point);
          });
        }
      }

      function moveToFront(point) {
        const routeAttr = point.getAttribute('se:routes');
        if (routeAttr) {
          const routes = routeAttr.trim().split(' ');
          routes.forEach(function (routeid) {
            const route = getElem(routeid);
            point.before(route);
          });
        }
      }

      return drawRoadCfg;
    }
  };
  return extwcsdrawroad;
}());