/* globals jQuery */
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
   * WCS地图插件——点合并工具,将鼠标按下选中的起始点合并到鼠标抬起时选中的目标点
   * 鼠标移动到点上时，点突出显示，半径放大3倍，操作完成后恢复
   * 将源路线连接到目标点上，将源点删除
   */
  name: 'wcspointmerge',
  init (S) {
    const $ = jQuery;
    const svgEditor = this;
    const svgCanvas = svgEditor.canvas,
      addElem = S.addSvgElementFromJson,
      getElem = S.getElem;
    const svgUtils = svgCanvas.getPrivateMethods();
    const seNs = svgCanvas.getEditorNS(true);
    let IsDrawing, fromElem, toElem, currentLine;

    const {
      lang
    } = svgEditor.curPrefs;

    //  导入undo/redo
    const {
      RemoveElementCommand,
      ChangeElementCommand,
      BatchCommand
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
            svgCanvas.setMode('wcspointmerge');
          }
        }
      }],
      mouseDown (opts) {
        if (svgCanvas.getMode() === 'wcspointmerge') {
          const zoom = svgCanvas.getZoom();
          if (!IsDrawing && fromElem) {
            /**
             * 选中起始点后，按下鼠标画一条临时的虚线
             */
            const x = fromElem.getAttribute('cx');
            const y = fromElem.getAttribute('cy');

            const defaultStrokeWidth = $('#default_stroke_width input').val();

            currentLine = addElem({
              element: 'line',
              attr: {
                x1: x,
                y1: y,
                x2: x,
                y2: y,
                stroke: '#ff7f00',
                'stroke-width': defaultStrokeWidth / zoom,
                'stroke-dasharray': '5,5'
              }
            });

            IsDrawing = true;
          }
        }
      },
      mouseMove (opts) {
        if (svgCanvas.getMode() === 'wcspointmerge') {
          const mouseTarget = opts.event.target;
          if (!IsDrawing) {
            /**
             * 移动鼠标到点上，突出显示，标记起始点
             */
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
             * 鼠标拖动过程中，选择目标点，突出显示
             */
            if (mouseTarget && mouseTarget !== toElem && mouseTarget !== fromElem && mouseTarget.tagName === 'circle' && mouseTarget.getAttribute('class') === 'point') {
              toElem = mouseTarget;
              toElem.orignRadis = toElem.getAttribute('r');
              toElem.setAttribute('r', toElem.orignRadis * 3);
            } else if (toElem && mouseTarget && mouseTarget.tagName === 'svg') {
              toElem.setAttribute('r', toElem.orignRadis);
              toElem = null;
            }

            /**
             * 虚线跟着鼠标移动
             */
            const zoom = svgCanvas.getZoom();
            let x2 = opts.mouse_x / zoom,
              y2 = opts.mouse_y / zoom;
            if (currentLine) {
              const x1 = currentLine.getAttribute('x1'),
                y1 = currentLine.getAttribute('y1');
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
              currentLine.setAttribute('x2', x2);
              currentLine.setAttribute('y2', y2);
            }
          }
          return {
            keep: true
          };
        }
      },
      mouseUp (opts) {
        if (svgCanvas.getMode() === 'wcspointmerge') {
          if (IsDrawing && toElem) {
            /**
             * 选中目标点后抬起鼠标，将两个点合并
             */
            mergePoint(fromElem, toElem);
            svgEditor.clickSelect();
          }

          /**
           * 恢复起始点状态
           */
          if (fromElem) {
            fromElem.setAttribute('r', fromElem.orignRadis);
            fromElem = null;
          }

          /**
           * 恢复目标点状态
           */
          if (toElem) {
            toElem.setAttribute('r', toElem.orignRadis);
            toElem = null;
          }

          /**
           * 删除临时虚线
           */
          if (currentLine) {
            currentLine.remove();
          }

          IsDrawing = false;

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
