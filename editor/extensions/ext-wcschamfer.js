
// /* globals jQuery */
/*
 * ext-wcschamfer.js
 *
 *
 * Copyright(c) 2010 CloudCanvas, Inc.
 * All rights reserved
 *
 */
export default {
  name: 'chamfer',
  init (S) {
    // const $ = jQuery;
    const svgEditor = this;
    const svgCanvas = svgEditor.canvas;
    const seNs = svgCanvas.getEditorNS(true);
    const getElem = S.getElem;
    // const svgUtils = svgCanvas.getPrivateMethods();
    const controlRadius = 4;
    let fromElem, toElem, startElem, endElem;

    // //  导入undo/redo
    // const {
    //   InsertElementCommand,
    //   ChangeElementCommand,
    //   BatchCommand
    // } = svgUtils;

    const {
      lang
    } = svgEditor.curPrefs;

    // 多语言处理
    const langList = {
      en: [{
        id: 'chamfer',
        title: 'Draw a Point'
      }],
      zh_CN: [{
        id: 'chamfer',
        title: '倒角'
      }]
    };

    return {
      name: 'chamfer',
      svgicons: svgEditor.curConfig.extIconsPath + 'wcschamfer-icon.xml',
      buttons: [{
        id: 'chamfer',
        type: 'mode',
        title: getTitle('chamfer'),
        events: {
          click () {
            svgCanvas.setMode('chamfer');
          }
        }
      }
      ],
      mouseDown (opts) {
        const mode = svgCanvas.getMode();
        if (mode === 'chamfer') {
          const zoom = svgCanvas.getZoom();
          if (!startElem) {
            if (fromElem) {
              startElem = fromElem;
            }
          } else {
            if (toElem) {
              endElem = toElem;

              const startPointAttr = startElem.getAttribute('se:points');
              const startElemp1 = startPointAttr.split(' ')[0],
                startElemp2 = startPointAttr.split(' ')[1];
              const endPointAttr = endElem.getAttribute('se:points');
              const endElemp1 = endPointAttr.split(' ')[0],
                endElemp2 = endPointAttr.split(' ')[1];
              const pointsArray = [startElemp1, startElemp2, endElemp1, endElemp2];
              let repeatPoint;
              pointsArray.forEach(function (point) {
                let count = 0;
                pointsArray.forEach(function (pointcheck) {
                  if (pointcheck === point) {
                    count++;
                  }
                });
                if (count > 1) {
                  repeatPoint = point;
                }
              });

              let startPoint, endPoint;

              if (startElemp1 === repeatPoint) {
                startPoint = getElem(startElemp2);
              } else {
                startPoint = getElem(startElemp1);
              }

              if (endElemp1 === repeatPoint) {
                endPoint = getElem(endElemp2);
              } else {
                endPoint = getElem(endElemp1);
              }

              const controlPoint = getElem(repeatPoint);
              controlPoint.setAttribute('class', 'control');
              controlPoint.setAttribute('fill', 'red');
              controlPoint.setAttribute('stroke', 'red');
              controlPoint.setAttribute('r', controlRadius / zoom);
              controlPoint.removeAttribute('se:routes');

              const x1 = startPoint.getAttribute('cx'),
                y1 = startPoint.getAttribute('cy'),
                x2 = endPoint.getAttribute('cx'),
                y2 = endPoint.getAttribute('cy'),
                controlX = controlPoint.getAttribute('cx'),
                controlY = controlPoint.getAttribute('cy');

              startElem.setAttribute('d', 'M' + x1 + ',' + y1 + ' Q' + controlX + ',' + controlY + ' ' + x2 + ',' + y2);
              startElem.setAttributeNS(seNs, 'se:points', startPoint.id + ' ' + endPoint.id + ' ' + controlPoint.id);

              controlPoint.setAttributeNS(seNs, 'se:path', startElem.id);

              const routersAttr = endPoint.getAttributeNS(seNs, 'routes');
              if (routersAttr) {
                const routers = routersAttr.trim().split(' ');
                const routeIndex = routers.filter(function (route) {
                  return route === endElem.id;
                });
                routers.splice(routeIndex, 1);
                routers.push(startElem.id);
                endPoint.setAttributeNS(seNs, 'se:routes', routers.join(' '));
              }

              endElem.remove();

              fromElem.setAttribute('stroke-width', fromElem.orignRadis);
              fromElem = null;
              toElem = null;
              startElem = null;
              endElem = null;
            }
          }
        }
      },
      mouseMove: function mouseMove (opts) {
        const mode = svgCanvas.getMode();
        if (mode === 'chamfer') {
          if (!startElem) {
            /**
             * 突出显示选中的起始点
             */
            const mouseTarget = opts.event.target;
            if (mouseTarget && mouseTarget !== fromElem && mouseTarget.tagName === 'path' && mouseTarget.getAttribute('class') === 'route') {
              fromElem = mouseTarget;
              fromElem.orignRadis = fromElem.getAttribute('stroke-width');
              fromElem.setAttribute('stroke-width', fromElem.orignRadis * 3);
            } else if (fromElem && mouseTarget && mouseTarget.tagName === 'svg') {
              fromElem.setAttribute('stroke-width', fromElem.orignRadis);
              fromElem = null;
            }
          } else {
            /**
             * 突出显示选中的终点
             */
            const mouseTarget = opts.event.target;
            if (mouseTarget && mouseTarget !== toElem && mouseTarget !== fromElem && mouseTarget.tagName === 'path' && mouseTarget.getAttribute('class') === 'route') {
              toElem = mouseTarget;
              toElem.orignRadis2 = toElem.getAttribute('stroke-width');
              toElem.setAttribute('stroke-width', toElem.orignRadis2 * 3);
            } else if (toElem && mouseTarget && mouseTarget.tagName === 'svg') {
              toElem.setAttribute('stroke-width', toElem.orignRadis2);
              toElem = null;
            }
          }
        }
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
