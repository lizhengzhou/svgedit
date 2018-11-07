const svgEditorExtension_wcsroutesplit = (function () {
  'use strict';
  // /* globals jQuery */
  /*
   * ext-wcsroutesplit.js
   *
   *
   * Copyright(c) 2010 CloudCanvas, Inc.
   * All rights reserved
   *
   */

  var wcsroutesplit = {
    name: 'routesplit',
    init(S) {
      // const $ = jQuery;
      const svgEditor = this;
      const svgCanvas = svgEditor.canvas;
      const addElem = S.addSvgElementFromJson;
      const getNextId = S.getNextId;
      const svgUtils = svgCanvas.getPrivateMethods();
      const seNs = svgCanvas.getEditorNS(true);
      const getElem = S.getElem;
      let selRoute;

      //  导入undo/redo
      const {
        InsertElementCommand,
        ChangeElementCommand,
        BatchCommand
      } = svgUtils;

      const {
        lang
      } = svgEditor.curPrefs;

      // 多语言处理
      const langList = {
        en: [{
          id: 'routesplit',
          title: 'split selected Path'
        }],
        zh_CN: [{
          id: 'routesplit',
          title: '打断选中路线'
        }]
      };

      return {
        name: 'routesplit',
        svgicons: svgEditor.curConfig.extIconsPath + 'wcs-map-editer-icon.xml',
        buttons: [{
          id: 'routesplit',
          type: 'mode',
          title: getTitle('routesplit'),
          events: {
            click() {
              svgCanvas.setMode('routesplit');
            }
          }
        }
        ],
        mouseDown: function mouseDown(opts) {
          const mode = svgCanvas.getMode();
          if (mode === 'routesplit') {
            const mouseTarget = opts.event.target;
            if (mouseTarget && mouseTarget !== selRoute && mouseTarget.tagName === 'path' && mouseTarget.getAttribute('class') === 'route') {
              const cmdArr = [];
              const x = opts.start_x.toFixed(0);
              const y = opts.start_y.toFixed(0);

              selRoute = mouseTarget;
              const curve = selRoute.pathSegList.getItem(1);

              const strokeWidth = selRoute.getAttribute('stroke-width');
              const path = addElem({
                element: 'path',
                attr: {
                  id: getNextId(),
                  d: 'M' + x + ',' + y + ' L' + curve.x + ',' + curve.y,
                  stroke: 'url(#roadpattern)',
                  'stroke-width': strokeWidth,
                  fill: 'none',
                  class: 'route'
                }
              });
              cmdArr.push(new InsertElementCommand(path));

              const point = addElem({
                element: 'circle',
                attr: {
                  id: getNextId(),
                  cx: x,
                  cy: y,
                  r: strokeWidth / 2,
                  stroke: 'none',
                  'stroke-width': strokeWidth,
                  fill: '#ff7f00',
                  class: 'point'
                }
              });
              point.setAttributeNS(seNs, 'se:routes', selRoute.id + ' ' + path.id);
              cmdArr.push(new InsertElementCommand(point));

              const routeAttr = selRoute.getAttributeNS(seNs, 'points');
              const points = routeAttr.split(' ');
              const startElem1 = getElem(points[0]),
                // endElem1 = point,
                startElem2 = point,
                endElem2 = getElem(points[1]);

              const od = selRoute.getAttribute('d');

              curve.x = x;
              curve.y = y;

              selRoute.setAttributeNS(seNs, 'se:points', [points[0], point.id, points[2]].join(' '));

              cmdArr.push(new ChangeElementCommand(selRoute, {
                d: od,
                'se:points': routeAttr
              }));

              startElem1.before(path);
              path.setAttributeNS(seNs, 'se:points', startElem2.id + ' ' + endElem2.id);

              cmdArr.push(new ChangeElementCommand(path, {
                'se:points': null
              }));

              let endRoute = [];
              const endRouteAttr = endElem2.getAttributeNS(seNs, 'routes');
              if (endRouteAttr) {
                endRoute = endRouteAttr.trim().split(' ');
                if (endRoute && endRoute.length > 0) {
                  const endRouteIndex = endRoute.findIndex(function (v) {
                    return v === selRoute.id;
                  });
                  endRoute.splice(endRouteIndex, 1);
                }
              }
              endRoute.push(path.id);
              endElem2.setAttributeNS(seNs, 'se:routes', endRoute.join(' '));
              cmdArr.push(new ChangeElementCommand(endElem2, {
                'se:routes': endRouteAttr
              }));
              if (cmdArr.length > 0) {
                const batchCmd = new BatchCommand('pointadd');
                cmdArr.forEach((v) => {
                  batchCmd.addSubCommand(v);
                });
                svgCanvas.undoMgr.addCommandToHistory(batchCmd);
              }

              svgEditor.clickSelect();

              selRoute = null;
            }
          }

          return {
            keep: true
          };
        }

      };

      /**
       * 获取多语言标题
       */
      function getTitle(id, curLang = lang) {
        const list = langList[lang];
        for (const i in list) {
          if (list.hasOwnProperty(i) && list[i].id === id) {
            return list[i].title;
          }
        }
        return id;
      }
    }

  };
  return wcsroutesplit;
}());
