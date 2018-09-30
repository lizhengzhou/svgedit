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

export default {
  name: 'drawroad',
  init (S) {
    const svgEditor = this;
    const $ = jQuery;
    const svgCanvas = svgEditor.canvas;
    const addElem = S.addSvgElementFromJson;
    const getNextId = S.getNextId;
    const svgUtils = svgCanvas.getPrivateMethods();
    const seNs = svgCanvas.getEditorNS(true);

    let fromElem, toElem, IsDrawing, startElem, endElem, path, currentRoute, IsControl, controlElem;
    const currentStrokeWidth = 4, pointRadius = 2, controlRadius = 4;
    let startElemCmd;

    const {
      InsertElementCommand,
      ChangeElementCommand,
      BatchCommand
    } = svgUtils;

    $(document).bind('keydown', 'esc', escFunc)
      .bind('keydown', 'ctrl', ctrlDownFunc)
      .bind('keyup', 'ctrl', ctrlUpFunc);

    function escFunc () {
      if (IsDrawing) {
        if (currentRoute) {
          currentRoute.remove();
        }
        clearDrawing();
      }
    }

    function ctrlDownFunc () {
      if (IsDrawing && !IsControl) {
        IsControl = true;
        if (currentRoute) {
          currentRoute.setAttribute('display', 'none');
        }
      }
    }

    function ctrlUpFunc () {
      if (IsDrawing && IsControl) {
        IsControl = false;
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

            return;
          }

          if (IsDrawing && !IsControl) {
            if (toElem) {
              endElem = toElem;

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

              // if (!orgRouteAttr) {
              //   startElemCmd = new InsertElementCommand(endElem);
              // } else {
              //   startElemCmd = new ChangeElementCommand(endElem, {
              //     'se:routes': orgRouteAttr
              //   });
              // }

              currentRoute.setAttributeNS(seNs, 'se:points', startElem.id + ' ' + endElem.id);

              clearDrawing();
            } else {
              /**
             * 画终点
             */
              const curve = currentRoute.pathSegList.getItem(1);

              const x = curve.x, y = curve.y;

              endElem = addElem({
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

              /**
             * 开始点为上一个结束点，新画线
             */
              startElem = endElem;
              path = currentRoute;

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
            }
          }

          if (IsDrawing && IsControl) {
            const x = opts.start_x.toFixed(0),
              y = opts.start_y.toFixed(0);

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

            controlElem.setAttributeNS(seNs, 'se:path', path.id);

            const move = path.pathSegList.getItem(0);
            const curve = path.pathSegList.getItem(1);

            const x1 = move.x, y1 = move.y,
              x2 = curve.x, y2 = curve.y;

            path.setAttribute('d', 'M' + x1 + ',' + y1 + ' Q' + x + ',' + y + ' ' + x2 + ',' + y2);

            const pointAttr = path.getAttribute('se:points');
            path.setAttributeNS(seNs, 'se:points', pointAttr + ' ' + controlElem.id);
          }
          // else if (IsControl) {
          //   /**
          //    * 画控制点
          //    */
          //   const x = opts.start_x,
          //     y = opts.start_y;

          //   controlElem = addElem({
          //     element: 'circle',
          //     attr: {
          //       id: getNextId(),
          //       cx: x,
          //       cy: y,
          //       r: controlRadius / zoom,
          //       stroke: 'none',
          //       fill: 'red',
          //       class: 'control'
          //     }
          //   });

          //   controlElem.setAttributeNS(seNs, 'se:path', currentRoute.id);

          //   const x1 = startElem.getAttribute('cx');
          //   const y1 = startElem.getAttribute('cy');
          //   const x2 = endElem.getAttribute('cx');
          //   const y2 = endElem.getAttribute('cy');

          //   currentRoute.setAttribute('d', 'M' + x1 + ',' + y1 + ' Q' + x + ',' + y + ' ' + x2 + ',' + y2);

          //   currentRoute.setAttributeNS(seNs, 'se:points', startElem.id + ' ' + endElem.id + ' ' + controlElem.id);
          // }
        }
      },
      mouseMove: function mouseMove (opts) {
        if (svgCanvas.getMode() === 'drawroad') {
          if (!IsDrawing) {
            /**
             * 突出显示选中的起始点
             */
            const mouseTarget = opts.event.target;
            if (mouseTarget && mouseTarget !== fromElem && mouseTarget.tagName === 'circle' && mouseTarget.getAttribute('class') === 'point') {
              fromElem = mouseTarget;
              fromElem.orignRadis = fromElem.getAttribute('r');
              fromElem.setAttribute('r', fromElem.orignRadis * 3);
            } else if (fromElem && mouseTarget && mouseTarget.tagName === 'svg') {
              fromElem.setAttribute('r', fromElem.orignRadis);
              fromElem = null;
            }
          } else {
            /**
             * 突出显示选中的终点
             */
            const mouseTarget = opts.event.target;
            if (mouseTarget && endElem && mouseTarget !== toElem && mouseTarget.tagName === 'circle' && mouseTarget.getAttribute('class') === 'point') {
              toElem = mouseTarget;
              toElem.orignRadis2 = toElem.getAttribute('r');
              toElem.setAttribute('r', toElem.orignRadis2 * 3);
            } else if (toElem && mouseTarget && mouseTarget.tagName === 'svg') {
              toElem.setAttribute('r', toElem.orignRadis2);
              toElem = null;
            }
          }

          if (currentRoute) {
            /**
             * 移动路线终点或者控制点
             */
            const zoom = svgCanvas.getZoom();
            const x = (opts.mouse_x / zoom).toFixed(0),
              y = (opts.mouse_y / zoom).toFixed(0);

            // if (!IsControl) {
            const curve = currentRoute.pathSegList.getItem(1);
            curve.x = x;
            curve.y = y;
            // } else if (IsControl && controlElem) {
            //   controlElem.setAttribute('cx', x);
            //   controlElem.setAttribute('cy', y);

            //   const curve = currentRoute.pathSegList.getItem(1);
            //   curve.x1 = x;
            //   curve.y1 = y;
            // }
          }
        }
      },
      mouseUp (opts) {
        if (svgCanvas.getMode() === 'drawroad') {
          // if (IsDrawing && !IsControl) {
          //   /**
          //    * 画终点并结束
          //    */
          //   const curve = currentRoute.pathSegList.getItem(1);

          //   const zoom = svgCanvas.getZoom();

          //   endElem = addElem({
          //     element: 'circle',
          //     attr: {
          //       id: getNextId(),
          //       cx: curve.x,
          //       cy: curve.y,
          //       r: pointRadius / zoom,
          //       stroke: '#ff7f00',
          //       'stroke-width': currentStrokeWidth,
          //       fill: '#ff7f00',
          //       class: 'point'
          //     }
          //   });
          //   endElem.setAttributeNS(seNs, 'se:routes', currentRoute.id);

          //   let routeAttr = startElem.getAttributeNS(seNs, 'routes');
          //   const orgRouteAttr = routeAttr;
          //   if (!routeAttr) {
          //     routeAttr = currentRoute.id;
          //   } else {
          //     routeAttr += ' ' + currentRoute.id;
          //   }
          //   startElem.setAttributeNS(seNs, 'se:routes', routeAttr);

          //   if (!orgRouteAttr) {
          //     startElemCmd = new InsertElementCommand(startElem);
          //   } else {
          //     startElemCmd = new ChangeElementCommand(startElem, {
          //       'se:routes': orgRouteAttr
          //     });
          //   }

          //   currentRoute.setAttributeNS(seNs, 'se:points', startElem.id + ' ' + endElem.id);

          //   if (svgCanvas.getSelectedElems().length > 0) {
          //     svgCanvas.clearSelection();
          //   }

          //   if (fromElem) {
          //     fromElem.setAttribute('r', fromElem.orignRadis);
          //     fromElem = null;
          //   }

          //   /**
          //    * 如果按了空格键，则继续点击画控制点
          //    */
          //   if (svgCanvas.spaceKey) {
          //     IsControl = true;
          //   } else {
          //     const batchCmd = new BatchCommand();
          //     batchCmd.addSubCommand(new InsertElementCommand(endElem));
          //     batchCmd.addSubCommand(new InsertElementCommand(currentRoute));
          //     batchCmd.addSubCommand(startElemCmd);
          //     S.addCommandToHistory(batchCmd);

          //     IsDrawing = false;
          //     // svgEditor.clickSelect();
          //   }

          //   return {
          //     keep: true
          //   };
          // } else if (IsDrawing && IsControl) {
          //   /**
          //    * 结束弧线绘制
          //    */
          //   const batchCmd = new BatchCommand();
          //   batchCmd.addSubCommand(new InsertElementCommand(controlElem));
          //   batchCmd.addSubCommand(new InsertElementCommand(endElem));
          //   batchCmd.addSubCommand(new InsertElementCommand(currentRoute));
          //   batchCmd.addSubCommand(startElemCmd);
          //   S.addCommandToHistory(batchCmd);

          //   IsControl = false;
          //   IsDrawing = false;
          //   // svgEditor.clickSelect();

          return {
            keep: true
          };
          // }
        }
      }
    };

    function clearDrawing () {
      if (IsDrawing) {
        IsDrawing = false;

        if (toElem) {
          toElem.setAttribute('r', toElem.orignRadis2);
          toElem = null;
        }
        if (fromElem) {
          fromElem.setAttribute('r', fromElem.orignRadis);
          fromElem = null;
        }
        if (currentRoute) {
          currentRoute = null;
        }
        if (startElem) {
          startElem = null;
        }
        if (endElem) {
          endElem = null;
        }
      }
    }

    return drawRoadCfg;
  }
};
