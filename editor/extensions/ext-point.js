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
  init (S) {
    const $ = jQuery;
    const svgEditor = this;
    const svgCanvas = svgEditor.canvas,
      addElem = S.addSvgElementFromJson;
    const seNs = svgCanvas.getEditorNS(true);
    const getNextId = S.getNextId,
      getElem = S.getElem;
    const svgUtils = svgCanvas.getPrivateMethods();
    // const assignAttributes = svgCanvas.assignAttributes;
    let svgcontent = S.svgcontent;
    // const {curConfig: {initStroke}} = svgEditor;
    let currentStrokeWidth = 4, keyPointRadius = 6;

    //  导入undo/redo
    const {
      // MoveElementCommand,
      InsertElementCommand,
      // RemoveElementCommand,
      ChangeElementCommand,
      BatchCommand
      // UndoManager,
      // HistoryEventTypes
    } = svgUtils;

    const {
      lang
    } = svgEditor.curPrefs;

    // 多语言处理
    const langList = {
      en: [{
        id: 'point',
        title: 'Draw a Point'
      },
      {
        id: 'point_IsControl',
        title: 'Draw a Control Point'
      },
      {
        id: 'point_IsCharge',
        title: 'Draw a Charge Point'
      }],
      zh_CN: [{
        id: 'point',
        title: '增加地标点'
      },
      {
        id: 'point_IsControl',
        title: '增加交通管制点'
      },
      {
        id: 'point_IsCharge',
        title: '增加充电点'
      },
      {
        id: 'point_IsDefault',
        title: '默认点'
      },
      {
        id: 'point_IsMaterial',
        title: '物料点'
      }]
    };

    return {
      name: 'point',
      svgicons: svgEditor.curConfig.extIconsPath + 'wcs-point-icon.xml',
      buttons: [{
        id: 'point',
        type: 'mode',
        title: getTitle('point'),
        events: {
          click () {
            if (svgCanvas.getSelectedElems().length > 0) {
              svgCanvas.clearSelection();
            }
            svgCanvas.setMode('point');
          }
        }
      },
      {
        id: 'point_IsControl',
        type: 'mode',
        title: getTitle('point_IsControl'),
        events: {
          click () {
            if (svgCanvas.getSelectedElems().length > 0) {
              svgCanvas.clearSelection();
            }
            svgCanvas.setMode('point_IsControl');
          }
        }
      },
      {
        id: 'point_IsCharge',
        type: 'mode',
        title: getTitle('point_IsCharge'),
        events: {
          click () {
            if (svgCanvas.getSelectedElems().length > 0) {
              svgCanvas.clearSelection();
            }
            svgCanvas.setMode('point_IsCharge');
          }
        }
      },
      {
        id: 'point_IsMaterial',
        type: 'mode',
        title: getTitle('point_IsMaterial'),
        events: {
          click () {
            if (svgCanvas.getSelectedElems().length > 0) {
              svgCanvas.clearSelection();
            }
            svgCanvas.setMode('point_IsMaterial');
          }
        }
      }
      ],
      mouseDown (opts) {
        const mode = svgCanvas.getMode();
        if (mode.split('_')[0] === 'point') {
          const mouseTarget = opts.event.target;
          if (mouseTarget && mouseTarget.tagName === 'path' && mouseTarget.getAttribute('class') === 'route') {
            const cmdArr = [];
            const x = opts.start_x;
            const y = opts.start_y;

            const route = mouseTarget;
            const curve = route.pathSegList.getItem(1);

            const strokeWidth = currentStrokeWidth;
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

            let stroke = '#505050';
            switch (mode.split('_')[1]) {
            case 'IsControl':
              stroke = '#84BD00';
              break;
            case 'IsCharge':
              stroke = '#0077C8';
              break;
            case 'IsMaterial':
              stroke = '#CB3338';
              break;
            }

            const point = addElem({
              element: 'circle',
              attr: {
                id: getNextId(),
                cx: x,
                cy: y,
                r: keyPointRadius,
                stroke: stroke,
                'stroke-width': strokeWidth,
                fill: '#fff',
                class: 'point'
              }
            });
            point.setAttributeNS(seNs, 'se:IsKey', true);
            point.setAttributeNS(seNs, 'se:routes', route.id + ' ' + path.id);
            cmdArr.push(new InsertElementCommand(point));
            if (mode.split('_')[1]) {
              point.setAttributeNS(seNs, 'se:' + mode.split('_')[1], true);

              cmdArr.push(new ChangeElementCommand(point, {
                'se:IsCharge': null,
                'se:IsControl': null
              }));
            }

            const routeAttr = route.getAttributeNS(seNs, 'points');
            const points = routeAttr.split(' ');
            const startElem1 = getElem(points[0]),
              // endElem1 = point,
              startElem2 = point,
              endElem2 = getElem(points[1]);

            const od = route.getAttribute('d');

            curve.x = x;
            curve.y = y;

            route.setAttributeNS(seNs, 'se:points', [points[0], point.id, points[2]].join(' '));

            cmdArr.push(new ChangeElementCommand(route, {
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
                  return v === route.id;
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
          }
        }
      },
      mouseMove: function mouseMove (opts) {
      },
      selectedChanged: function selectedChanged (opts) {
        if (svgCanvas.getSelectedElems().length === 1) {
          const elem = opts.elems[0];
          if (elem.hasAttributeNS(seNs, 'point')) {
            $('#selectorGroup0')[0].setAttribute('display', 'none');
          }
        }
      },
      elementChanged: function elementChanged (opts) {
        const elem = opts.elems[0];
        if (elem && elem.tagName === 'svg' && elem.id === 'svgcontent') {
          // Update svgcontent (can change on import)
          svgcontent = elem;
        }

        opts.elems.forEach(function (elem) {
          if (svgcontent.getElementById(elem.id)) {
          }
        });

        opts.elems.forEach(function (elem) {
          if (!svgcontent.getElementById(elem.id)) {

          } else {
            if (elem.tagName === 'circle' && elem.getAttribute('class') === 'point' && elem.getAttribute('se:IsKey')) {
              const r = elem.getAttribute('r');
              if (r <= 0) {
                elem.setAttribute('r', keyPointRadius);
              }
              keyPointRadius = r;

              const strokeWidth = elem.getAttribute('stroke-width');
              if (strokeWidth !== currentStrokeWidth) {
                currentStrokeWidth = strokeWidth;
              }
            } else if (elem.tagName === 'path' && elem.getAttribute('class') === 'route') {
              const strokeWidth = elem.getAttribute('stroke-width');
              if (strokeWidth !== currentStrokeWidth) {
                currentStrokeWidth = strokeWidth;
              }
            }
          }
        });
      }
    };

    /**
     * 获取多语言标题
     */
    function getTitle (id, curLang = lang) {
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