/*
 * ext-wcspointmerge.js
 * https://github.com/lizhengzhou/svgedit.git
 * Licensed under the MIT License
 *
 * Copyright(c) 2010 CloudCanvas, Inc.
 * All rights reserved
 *
 */
export default {
  /**
   * WCS地图插件——点合并工具
   */
  name: 'wcspointmerge',
  init (S) {
    const svgEditor = this;
    const svgCanvas = svgEditor.canvas,
      addElem = S.addSvgElementFromJson,
      getElem = S.getElem;
    const svgUtils = svgCanvas.getPrivateMethods();
    const seNs = svgCanvas.getEditorNS(true);
    let selElem, line;

    const {
      lang
    } = svgEditor.curPrefs;

    //  导入undo/redo
    const {
      // MoveElementCommand,
      // InsertElementCommand,
      RemoveElementCommand,
      ChangeElementCommand,
      BatchCommand
      // UndoManager,
      // HistoryEventTypes
    } = svgUtils;

    // 多语言处理
    const langList = {
      en: [{
        id: 'wcspointmerge',
        title: 'Merge two Points'
      }],
      zh_CN: [{
        id: 'wcspointmerge',
        title: '合并两个点'
      }]
    };

    return {
      name: 'wcspointmerge',
      svgicons: svgEditor.curConfig.extIconsPath + 'wcspointmerge-icon.xml',
      buttons: [{
        id: 'wcspointmerge',
        type: 'mode',
        title: getTitle('wcspointmerge'),
        events: {
          click () {
            if (svgCanvas.getSelectedElems().length > 0) {
              svgCanvas.clearSelection();
            }
            svgCanvas.setMode('wcspointmerge');
          }
        }
      }],
      mouseDown (opts) {
        if (svgCanvas.getMode() === 'wcspointmerge') {
          const mouseTarget = opts.event.target;
          if (mouseTarget && mouseTarget.tagName === 'circle' && mouseTarget.getAttribute('class') === 'point') {
            mouseTarget.setAttribute('fill', 'orange');
            selElem = mouseTarget;

            const x = opts.start_x;
            const y = opts.start_y;

            const zoom = svgCanvas.getZoom();

            line = addElem({
              element: 'line',
              attr: {
                x1: x,
                y1: y,
                x2: x,
                y2: y,
                stroke: '#ff7f00',
                'stroke-width': 2 / zoom,
                'stroke-dasharray': '5,5'
              }
            });
          }
        }
        return {
          started: true
        };
      },
      mouseMove (opts) {
        if (svgCanvas.getMode() === 'wcspointmerge') {
          const zoom = svgCanvas.getZoom();

          let x2 = opts.mouse_x / zoom,
            y2 = opts.mouse_y / zoom;

          if (line) {
            const x1 = line.getAttribute('x1'),
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
      mouseUp (opts) {
        if (svgCanvas.getMode() === 'wcspointmerge') {
          const mouseTarget = opts.event.target;
          if (mouseTarget && mouseTarget.tagName === 'circle' && mouseTarget.getAttribute('class') === 'point') {
            if (selElem && selElem !== mouseTarget) {
              mergePoint(selElem, mouseTarget);
              svgCanvas.setMode('select');
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

    /**
     *
     * @param {起始点} selElem
     * @param {目标点} mouseTarget
     */
    function mergePoint (selElem, mouseTarget) {
      const cmdArr = [];
      const cx = mouseTarget.getAttribute('cx'),
        cy = mouseTarget.getAttribute('cy');

      let targetRoutes = [];
      const targetroutesAttr = mouseTarget.getAttributeNS(seNs, 'routes');
      if (targetroutesAttr) {
        targetRoutes = targetroutesAttr.trim().split(' ');
      }

      const routersAttr = selElem.getAttributeNS(seNs, 'routes');
      if (routersAttr) {
        const routers = routersAttr.trim().split(' ');
        routers.forEach(function (routeid) {
          const route = getElem(routeid);
          const move = route.pathSegList.getItem(0);
          const curve = route.pathSegList.getItem(1);
          const routeattr = route.getAttributeNS(seNs, 'points');
          if (routeattr) {
            const points = routeattr.split(' ');
            if (points.length >= 2) {
              const od = route.getAttribute('d');
              if (points[0] === selElem.id) {
                points[0] = mouseTarget.id;
                move.x = cx;
                move.y = cy;
              } else if (points[1] === selElem.id) {
                points[1] = mouseTarget.id;
                curve.x = cx;
                curve.y = cy;
              }
              cmdArr.push(new ChangeElementCommand(route, {
                d: od
              }));
              route.setAttributeNS(seNs, 'se:points', points.join(' '));
              cmdArr.push(new ChangeElementCommand(route, {
                'se:points': routeattr
              }));
            }
          }
          targetRoutes.push(route.id);
          mouseTarget.before(route);

          cmdArr.push(new RemoveElementCommand(selElem, selElem.nextSibling, selElem.parentNode));
          selElem.remove();
        });
      }

      mouseTarget.setAttributeNS(seNs, 'se:routes', targetRoutes.join(' '));
      cmdArr.push(new ChangeElementCommand(mouseTarget, {
        'se:routes': targetroutesAttr
      }));

      if (cmdArr.length > 0) {
        const batchCmd = new BatchCommand('mergePoint');
        cmdArr.forEach((v) => {
          batchCmd.addSubCommand(v);
        });
        svgCanvas.undoMgr.addCommandToHistory(batchCmd);
      }
    }

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
