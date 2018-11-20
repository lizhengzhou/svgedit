var svgEditorExtension_wcsfindpath = (function () {
  'use strict';
  /* globals jQuery */
  /*
   * ext-wcsfindpath.js
   *
   *
   * Copyright(c) 2010 CloudCanvas, Inc.
   * All rights reserved
   *
   */
  // import Dijkstra from '../dijkstra/Dijkstra.js';

  var wcsfindpath = {
    name: 'findpath',
    init(S) {
      const $ = jQuery;
      const svgEditor = this;
      const svgCanvas = svgEditor.canvas;
      const seNs = svgCanvas.getEditorNS(true);
      const getElem = S.getElem;
      let svgcontent = S.svgcontent;
      let finding, startPoint;

      const {
        lang
      } = svgEditor.curPrefs;

      // 多语言处理
      const langList = {
        en: [{
          id: 'findpath',
          title: 'Find shortest Path'
        }],
        zh_CN: [{
          id: 'findpath',
          title: '寻找最短路径'
        }]
      };

      return {
        name: 'findpath',
        svgicons: svgEditor.curConfig.extIconsPath + 'wcsfindpath-icon.xml',
        buttons: [{
          id: 'findpath',
          type: 'mode',
          title: getTitle('findpath'),
          events: {
            click() {
              svgCanvas.setMode('findpath');
            }
          }
        }
        ],
        mouseDown: function mouseDown(opts) {
          const mode = svgCanvas.getMode();
          if (mode === 'findpath' && !finding) {
            const mouseTarget = opts.event.target;
            if (mouseTarget && mouseTarget !== startPoint && mouseTarget.tagName === 'circle' && mouseTarget.getAttribute('class') === 'point') {
              startPoint = mouseTarget;
              startPoint.orignRadis = startPoint.getAttribute('r');
              startPoint.setAttribute('r', startPoint.orignRadis * 3);

              console.log(startPoint.id);
              finding = true;

              getSvgMap().then(function (map) {
                console.log(map);
                getMatrix(map).then(function (matrix) {
                  console.log(matrix);
                  const graph = new Dijkstra(matrix);
                  console.log(graph.findShortestPath(startPoint.id, 'svg_10'));
                  finding = false;
                });
              });
            }
            // const map = { svg_1: { svg_2: 3, svg_3: 1 }, svg_2: { svg_1: 2, svg_3: 1 }, svg_3: { svg_1: 4, svg_2: 1 } },
            //   graph = new Dijkstra(map);

            // console.log(graph.findShortestPath('svg_1', 'svg_2'));
            // console.log(graph.findShortestPath('svg_1', 'svg_3'));
            // console.log(graph.findShortestPath('svg_2', 'svg_1'));
            // console.log(graph.findShortestPath('svg_2', 'svg_3', 'svg_2'));
            // console.log(graph.findShortestPath('svg_3', 'svg_1', 'svg_2'));
            // console.log(graph.findShortestPath('svg_3', 'svg_2', 'svg_1'));
          }
        },
        /**
         * 元素有修改时触发
         * @param {元素修改事件} opts
         */
        elementChanged: function elementChanged(opts) {
          const elem = opts.elems[0];
          if (elem && elem.tagName === 'svg' && elem.id === 'svgcontent') {
            // Update svgcontent (can change on import)
            svgcontent = elem;
          }
        },
        modeChanged: function modeChanged(opts) {
          const mode = opts.mode;
          if (mode !== 'findpath') {
            if (startPoint) {
              startPoint.setAttribute('r', startPoint.orignRadis);
              startPoint.orignRadis = null;
              startPoint = null;
            }
          }
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

      /**
        * 异步获取svg获取点和线清单
      */
      function getSvgMap() {
        return new Promise(function (resolve, reject) {
          const map = {};
          map.Routes = [];
          map.Points = [];

          $(svgcontent).find('.route').each(function () {
            const route = {};

            route.svgId = this.id;

            const pointsAttr = this.getAttributeNS(seNs, 'points');
            const points = pointsAttr.trim().split(' ');
            const control = getElem(points[2]);

            route.startSvgId = points[0];
            route.endSvgId = points[1];

            route.IsPositive = this.getAttributeNS(seNs, 'IsPositive');
            route.Direction = this.getAttributeNS(seNs, 'Direction');
            route.Speed = this.getAttributeNS(seNs, 'Speed');

            if (control) {
              const controlX = parseInt(control.getAttribute('cx')),
                ControlY = parseInt(control.getAttribute('cy'));
              route.ControlX = controlX;
              route.ControlY = ControlY;
            }

            map.Routes.push(route);
          });

          $(svgcontent).find('.point').each(function () {
            const point = {};

            point.svgId = this.id;
            point.Code = this.getAttributeNS(seNs, 'Code');
            point.PositionX = parseInt(this.getAttribute('cx'));
            point.PositionY = parseInt(this.getAttribute('cy'));

            point.IsKey = this.getAttributeNS(seNs, 'IsKey');
            point.IsCharge = this.getAttributeNS(seNs, 'IsCharge');
            point.IsControl = this.getAttributeNS(seNs, 'IsControl');
            point.IsMaterial = this.getAttributeNS(seNs, 'IsMaterial');
            point.IsDefault = this.getAttributeNS(seNs, 'IsDefault');

            map.Points.push(point);
          });

          resolve(map);
        });
      }

      function getMatrix(map) {
        return new Promise(function (resolve, reject) {
          const matrix = {};
          map.Points.forEach(function (point) {
            matrix[point.svgId] = {};
            const startRoutes = map.Routes.filter(function (route) { return route.startSvgId === point.svgId; });
            startRoutes.forEach(function (route) {
              matrix[point.svgId][route.endSvgId] = 1;
            });
          });
          resolve(matrix);
        });
      }
    }
  };
  return wcsfindpath;
}());
