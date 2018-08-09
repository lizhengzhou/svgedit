/* globals jQuery */
/*
 * ext-wcsmapediter.js
 * https://github.com/lizhengzhou/svgedit.git
 *
 * Licensed under the MIT License
 *
 * Copyright(c) 2010 Alexis Deveria
 *
 */

/*
    WCS Map Editer Plugin
*/
export default {
  /*
  * WCS 地图编辑插件
  */
  name: 'Wcs Map Editer',
  /**
   * 
   * @param {编辑器上下文} S 
   */
  init(S) {
    var $ = jQuery;
    var elData = $.data;
    var svgEditor = this;
    var svgCanvas = svgEditor.canvas;
    var svgUtils = svgCanvas.getPrivateMethods();
    var svgroot = S.svgroot,
      svgcontent = S.svgcontent,
      getNextId = S.getNextId,
      getElem = S.getElem,
      addElem = S.addSvgElementFromJson,
      setAttrs = S.assignAttributes,
      selManager = svgCanvas.selectorManager,
      selRoute = void 0,
      selPoint = void 0,
      NS = S.NS,
      svgdoc = svgroot.ownerDocument;
    var curConfig = svgEditor.curConfig;
    var seNs = svgCanvas.getEditorNS(true);

    const {lang}=svgEditor.curPrefs;

    //导入undo/redo
    const {
      MoveElementCommand,
      InsertElementCommand,
      RemoveElementCommand,
      ChangeElementCommand,
      BatchCommand,
      UndoManager,
      HistoryEventTypes
    } = svgUtils;

    //刷新初始化
    init();

    //多语言处理
    var langList = {
      en: [{
        id: 'line_horizontal',
        title: 'Draw horizontal line'
      },{
        id: 'line_vertical',
        title: 'Draw vertical line'
      }],
      zh_CN: [{
        id: 'line_horizontal',
        title: '画横线'
      },{
        id: 'line_vertical',
        title: '画竖线'
      },{
        id: 'line_arc_upleft',
        title: '画左上弧线'
      },{
        id: 'line_arc_upright',
        title: '画右上弧线'
      },{
        id: 'line_arc_downleft',
        title: '画左下弧线'
      },{
        id: 'line_arc_downright',
        title: '画右下弧线'
      },{
        id: 'line_arc_downright',
        title: '画右下弧线'
      }]
    };

    /*
     * 绑定编辑器open和save事件，
     * 从后台svgEditor.curConfig.serverApi
     * 获取map.svg和保存地图到~/map/map.svg
     */
    svgEditor.setCustomHandlers({
      /**
       * 打开地图处理
       */
      open() {
        $.ajax({
          url: svgEditor.curConfig.serverApi + '/open',
          type: 'get',
          success: function (data) {
            // alert(data);
            if (data) {
              svgCanvas.setSvgString(data);
            }
          },
          error: function (err) {
            console.log(err);
          }
        });

      },
      /**
       * 
       * @param {窗口对象} win 
       * @param {待保存的SVG字符串} data 
       */
      save(win, data) {
        /**
         * 取消选择
         */
        if (svgCanvas.getSelectedElems().length > 0) {
          svgCanvas.clearSelection();
        }
        /**
         * 提交编辑SVG数据到后台保存成map.svg图片文件
         */
        var formData = new FormData();
        formData.append("map.svg", data);

        $.ajax({
          url: svgEditor.curConfig.serverApi + '/save',
          type: "POST",
          async: true,
          dataType: "json",
          data: formData,
          contentType: false,
          processData: false,
          success: function (data) {
            console.log(data);
          },
          error: function (err) {
            var data = JSON.parse(request.responseText);
            $.alert(data.Message);
          }
        });

        /**
         * 异步处理svg获取点和线清单
         */
        new Promise(function (resolve, reject) {
          var map = {};
          map.Routes = [];
          map.Points = [];
  
          $(svgcontent).find('.route').each(function () {
            var route = {};

            route.svgId = this.id;

            var pointsAttr = this.getAttributeNS(seNs, 'points');
            var points = pointsAttr.trim().split(' ');
            var control = getElem(points[2]);

            route.startSvgId = points[0];
            route.endSvgId = points[1];

            route.Direction = this.getAttributeNS(seNs, 'Direction');
            route.Speed = this.getAttributeNS(seNs, 'Direction');

            if (control) {
              route.ControlX = parseInt(control.getAttribute('cx')),
                route.ControlY = parseInt(control.getAttribute('cy'));
            }

            map.Routes.push(route);
          });

          $(svgcontent).find('.point').each(function () {
            var point = {};

            point.svgId = this.id;
            point.Code = this.getAttributeNS(seNs, 'Code');
            point.PositionX = parseInt(this.getAttribute('cx'));
            point.PositionY = parseInt(this.getAttribute('cy'));
            if (point.Code) point.IsKey = true;
            point.IsCharge = this.getAttributeNS(seNs, 'IsCharge');
            point.IsControl = this.getAttributeNS(seNs, 'IsControl');
            point.IsMaterial = this.getAttributeNS(seNs, 'IsMaterial');
            point.IsDefault = this.getAttributeNS(seNs, 'IsDefault');

            map.Points.push(point);
          });

          console.log(map);

          /***
           * 提交地图数据到后台
           */
          $.ajax({
            url: svgEditor.curConfig.serverApi + '/SaveMap',
            type: 'post',
            dataType: "json",
            contentType: "application/json",
            data: JSON.stringify(map),
            success: function (data) {
              if (data) {
                $.alert('保存成功');
              }
            },
            error: function (request) {
              var data = JSON.parse(request.responseText);
              $.alert(data.Message);
            }
          });

          resolve();
        });

        /**
         * 处理svg编辑图片生成监控图片并上传保存
         */
        new Promise(function (resolve, reject) {

          /**
           * 隐藏控制点
          */
          $(svgcontent).find('.control').each(function () {
            this.setAttribute('display', 'none');
          });
          /**
           * 隐藏普通点
           */
          $(svgcontent).find('.point').each(function () {
            if (!this.getAttributeNS(seNs, 'nebor')) {
              this.setAttribute('display', 'none');
            }
          });

          /**
           * 获取svg字符串
           */
          var clearSvgStr = svgCanvas.svgCanvasToString();

          /**
           * 提交并保存监控图片monitor.svg
           */
          var formData = new FormData();
          formData.append("monitor.svg", clearSvgStr);

          $.ajax({
            url: svgEditor.curConfig.serverApi + '/save',
            type: "POST",
            async: true,
            dataType: "json",
            data: formData,
            contentType: false,
            processData: false,
            success: function (data) {
              console.log(data);
            },
            error: function (err) {
              console.log(err);
            }
          });

          /**
           * 用原始svg编辑图片重置编辑器状态
           */
          svgCanvas.setSvgString(data);

          resolve();
        });
      }
    });

    /**
     * 编辑器配置对象
     */
    var extConfig = {
      /**
       * 编辑器名称
       */
      name: 'Wcs Map Editer',
      /***
       * 插件图标文件，注意ID对应关系
       */
      svgicons: svgEditor.curConfig.extIconsPath + 'wcs-map-editer-icon.xml',
      /**
       * 工具栏按钮
       */
      buttons: [{
          /**
           * 按钮ID，必须和上面图标文件中图标的ID一致
           */
          id: 'line_horizontal',
          /**
           * 标识当前按钮会被添加到左边工具栏
           */
          type: 'mode',
          /**
           * 按钮标题，鼠标放上去会显示
           */
          title: getTitle('line_horizontal'),
          /**
           * 按钮位置
           */
          position: '11',
          /**
           * 按钮事件
           */
          events: {
            click() {
              //单击按钮时执行的操作。
              //对于“模式”按钮，任何其他按钮都将
              //自动被压缩。
              svgCanvas.setMode('line_horizontal');
            }
          }
        }, {         
          id: 'line_vertical',
          type: 'mode',
          position: '12',
          title: getTitle('line_vertical'),
          events: {
            click() {
              svgCanvas.setMode('line_vertical');
            }
          }
        },
        {
          id: 'line_arc_upleft',
          type: 'mode',
          position: '21',
          title: getTitle('line_arc_upleft'),
          events: {
            click() {
              svgCanvas.setMode('line_arc_upleft');
            }
          }
        },
        {
          id: 'line_arc_upright',
          type: 'mode',
          position: '22',
          title: getTitle('line_arc_upright'),
          events: {
            click() {
              svgCanvas.setMode('line_arc_upright');
            }
          }
        },
        {
          id: 'line_arc_downleft',
          type: 'mode',
          position: '23',
          title: getTitle('line_arc_downleft'),
          events: {
            click() {
              svgCanvas.setMode('line_arc_downleft');
            }
          }
        },
        {
          id: 'line_arc_downright',
          type: 'mode',
          position: '24',
          title: getTitle('line_arc_downright'),
          events: {
            click() {
              svgCanvas.setMode('line_arc_downright');
            }
          }
        },
        {
          /**
           * 属性ID按钮
           */
          id: 'uparrow',
          /**
           * 按钮图标
           */
          svgicon: 'uparrow',
          /**
           * 按钮标题
           */
          title: 'forword direction',
          /**
           * 按钮类型为属性按钮
           */
          type: 'context',
          /**
           * 按钮事件
           */
          events: {
            click: setRouteDirection
          },
          /**
           * 该属性属于哪个面板
           */
          panel: 'wcsline_panel',
          /**
           * 该属性属于哪个清单
           */
          list: 'direction_list',
          /**
           * 是否默认选择
           */
          isDefault: true
        },
        {
          id: 'downarrow',
          svgicon: 'downarrow',
          title: 'backword direction',
          type: 'context',
          events: {
            click: setRouteDirection
          },
          panel: 'wcsline_panel',
          list: 'direction_list',
          isDefault: true
        }
      ],
      /**
       * 属性面板输入元素
       */
      context_tools: [{
          /**
           * 输入文本框
           */
          type: 'input',
          /**
           * 属于哪个面板
           */
          panel: 'wcsline_panel',
          /**
           * 线起始点坐标
           */
          title: 'X',
          /**
           * 属性ID
           */
          id: 'wcsline_x1',
          /**
           * Label
           */
          label: 'X',
          /**
           * 大小
           */
          size: 3,
          events: {
            /**
             * 修改事件
             */
            change: SetRouteXYWH
          }
        },
        {
          type: 'input',
          panel: 'wcsline_panel',
          title: 'Y',
          id: 'wcsline_y1',
          label: 'Y',
          size: 3,
          events: {
            change: SetRouteXYWH
          }
        },
        {
          type: 'input',
          panel: 'wcsline_panel',
          title: 'W',
          id: 'wcsline_width',
          label: 'W',
          size: 3,
          events: {
            change: SetRouteXYWH
          }
        },
        {
          type: 'input',
          panel: 'wcsline_panel',
          title: 'H',
          id: 'wcsline_height',
          label: 'H',
          size: 3,
          events: {
            change: SetRouteXYWH
          }
        },
        {
          type: 'button-select',
          panel: 'wcsline_panel',
          title: 'select direction',
          id: 'direction_list',
          label: 'Direction',
          colnum: 3,
          events: {
            change: setRouteDirection
          }
        },
        {
          type: 'input',
          panel: 'wcsline_panel',
          title: 'Speed',
          id: 'wcsline_speed',
          label: 'Speed',
          size: 3,
          defval: 10,
          events: {
            change: function change() {
              if (selRoute) {
                selRoute.setAttributeNS(seNs, 'se:Speed', this.value);
              }
            }
          }
        },
        {
          type: 'input',
          panel: 'wcspoint_panel',
          title: 'Code',
          id: 'wcspoint_code',
          label: 'Code',
          size: 3,
          events: {
            change: function change() {
              if (selPoint) {
                selPoint.setAttributeNS(seNs, 'se:Code', this.value);
              }
            }
          }
        }
      ],
      /**
       *  To DO 
       */
      callback: function callback() {
        $('#wcsline_panel').hide();
      },
      addlangData: function addlangData(lang) {
        return {
          data: langList[lang]
        };
      },
      mouseDown(opts) {
        var mode = svgCanvas.getMode();
        if (mode === 'line_horizontal') {
          drawLine(opts);
        } else if (mode === 'line_vertical') {
          drawLine(opts, false);
        } else if (mode == 'line_arc_upleft') {
          drawArcLine(opts, 'upleft');
        } else if (mode == 'line_arc_upright') {
          drawArcLine(opts, 'upright');
        } else if (mode == 'line_arc_downleft') {
          drawArcLine(opts, 'downleft');
        } else if (mode == 'line_arc_downright') {
          drawArcLine(opts, 'downright');
        } else if (mode == 'select') {
          return {
            started: true
          };
        }
      },
      mouseMove: function mouseMove(opts) {
        if (svgCanvas.getMode() === 'select') {

          if (svgCanvas.getSelectedElems().length == 1) {
            var elems = svgCanvas.getSelectedElems();
            var elem = elems[0];
            if (elem && elem.tagName === 'circle' && elem.getAttribute('class') === 'point') {
              //Point Group Changed
              pointMove(elem, opts);
            } else if (elem && elem.tagName === 'circle' && elem.getAttribute('class') === 'control') {
              //be line control point move
              controlMove(elem, opts);
            } else if (elem && elem.tagName === 'path' && elem.getAttribute('class') === 'route') {
              var pointsAttr = elem.getAttributeNS(seNs, 'points');
              if (pointsAttr) {
                var points = pointsAttr.trim().split(' ');
                if (points.length >= 2) {
                  getElem(points[0]).setAttribute('display', 'none');
                  getElem(points[1]).setAttribute('display', 'none');
                }
              }
            }
          }
          return {
            started: true
          };
        }
      },
      // This is triggered from anywhere, but "started" must have been set
      // to true (see above). Note that "opts" is an object with event info
      mouseUp(opts) {
        // Check the mode on mouseup
        if (svgCanvas.getMode() === 'select') {
          if (svgCanvas.getSelectedElems().length == 1) {
            var elems = svgCanvas.getSelectedElems();
            var elem = elems[0];

            if (elem && elem.tagName === 'path' && elem.getAttribute('class') === 'route') {
              var pointsAttr = elem.getAttributeNS(seNs, 'points');
              if (pointsAttr) {
                var points = pointsAttr.trim().split(' ');
                if (points.length >= 2) {
                  getElem(points[0]).setAttribute('display', 'inline');
                  getElem(points[1]).setAttribute('display', 'inline');
                }
              }
            }
          }
        }
      },
      selectedChanged: function selectedChanged(opts) {
        if (svgCanvas.getSelectedElems().length == 0) {
          showPointPanel(false);
          showRoutePanel(false);

          // $(svgcontent).find('.point').each(function () {
          //   if (!this.getAttributeNS(seNs, 'nebor')) {
          //     this.setAttribute('display', 'none');
          //   }
          // });
        }
        if (svgCanvas.getSelectedElems().length == 1) {
          var elem = opts.elems[0];
          if (elem && elem.tagName === 'path' && elem.getAttribute('class') === 'route') {
            selRoute = elem;
            selectRoute(selRoute);
            showRoutePanel(true);
            showPointPanel(false);
          } else if (elem && elem.tagName === 'circle' && elem.getAttribute('class') === 'point') {
            selPoint = elem;
            selectPoint(selPoint);
            showPointPanel(true);
            showRoutePanel(false);
          } else {
            showRoutePanel(false);
            showPointPanel(false);
          }
        }
      },
      elementChanged: function elementChanged(opts) {
        var elem = opts.elems[0];
        if (elem && elem.tagName === 'svg' && elem.id === 'svgcontent') {
          // Update svgcontent (can change on import)
          svgcontent = elem;
          init();
        }

        opts.elems.forEach(function (elem) {
          if (elem && svgcontent.getElementById(elem.id)) {
            if (elem.tagName === 'circle' && elem.getAttribute('class') === 'point') {
              var r = elem.getAttribute('r');
              if (r != 4) {
                elem.setAttribute('r', 4);
              }
            } else if (elem.tagName === 'circle' && elem.getAttribute('class') === 'control') {
              var r = elem.getAttribute('r');
              if (r != 6) {
                elem.setAttribute('r', 6);
              }
            }
          }
        });

        opts.elems.forEach(function (elem) {
          if (elem && !svgcontent.getElementById(elem.id)) {
            if (elem && elem.tagName === 'circle' && elem.getAttribute('class') === 'point') {
              routeDeleteByPoint(elem);
            } else if (elem && elem.tagName === 'circle' && elem.getAttribute('class') === 'control') {
              routeDeleteByControl(elem);
            } else if (elem && elem.tagName === 'path' && elem.getAttribute('class') === 'route') {
              routeDeleteByRoute(elem);
            }
          } else {
            if (elem && elem.tagName === 'circle' && elem.getAttribute('class') === 'point') {
              //Point Group Changed
              pointMove(elem);

            } else if (elem && elem.tagName === 'path' && elem.getAttribute('class') === 'route') {
              //route move
              routeMove(elem);

              var pointsAttr = elem.getAttributeNS(seNs, 'points');
              if (pointsAttr) {
                var points = pointsAttr.trim().split(' ');
                if (points.length >= 2) {
                  getElem(points[0]).setAttribute('display', 'inline');
                  getElem(points[1]).setAttribute('display', 'inline');
                }
              }
            } else if (elem && elem.tagName === 'circle' && elem.getAttribute('class') === 'control') {
              //be line control point move
              controlMove(elem);
            }
          }
        });
      }
    };


    // 初始化方法，在刷新或打开地图时导入svg字符串后执行
    function init() {
      // svgCanvas.changeSelectedAttribute('display', 'none', $(svgcontent).find('.point'));
      // $(svgcontent).find('.point').each(function () {
      //   if (this.hasAttributeNS(seNs, 'nebor')) {
      //     this.setAttribute('display', 'inline');
      //   }
      // });
    }

    /**
     * 
     * @param {鼠标点击事件} opts 
     * @param {直线方向，默认横向} IsHoriaontal 
     */
    function drawLine(opts, IsHoriaontal = true) {

      const x = opts.start_x;
      const y = opts.start_y;

      var x1, y1, x2, y2;
      if (IsHoriaontal) {
        x1 = x - 50;
        y1 = y;
        x2 = x + 50;
        y2 = y;
      } else {
        x1 = x;
        y1 = y - 50;
        x2 = x;
        y2 = y + 50;
      }

      var path = addElem({
        element: 'path',
        attr: {
          id: getNextId(),
          d: 'M' + x1 + ',' + y1 + ' L' + x2 + ',' + y2,
          stroke: '#ff7f00',
          'stroke-width': 4,
          fill: 'none',
          'class': 'route'
        }
      });

      var startElem = addElem({
        element: 'circle',
        attr: {
          id: getNextId(),
          cx: x1,
          cy: y1,
          r: 4,
          stroke: '#00ffff',
          'stroke-width': 4,
          fill: '#fff',
          'class': 'point'
        }
      });

      startElem.setAttributeNS(seNs, 'se:routes', path.id);

      var endElem = addElem({
        element: 'circle',
        attr: {
          id: getNextId(),
          cx: x2,
          cy: y2,
          r: 4,
          stroke: '#00ffff',
          'stroke-width': 4,
          fill: '#fff',
          'class': 'point'
        }
      });

      endElem.setAttributeNS(seNs, 'se:routes', path.id);

      path.setAttributeNS(seNs, 'se:points', startElem.id + ' ' + endElem.id);

      if (svgCanvas.getSelectedElems().length > 0) {
        svgCanvas.clearSelection();
      }
      svgCanvas.addToSelection([path]);

      var batchCmd = new S.BatchCommand();
      batchCmd.addSubCommand(new S.InsertElementCommand(endElem));
      batchCmd.addSubCommand(new S.InsertElementCommand(startElem));
      batchCmd.addSubCommand(new S.InsertElementCommand(path));
      S.addCommandToHistory(batchCmd);

      svgCanvas.setMode('select');

      return {
        keep: true
      };
    }

    /**
     * 
     * @param {鼠标点击事件} opts 
     * @param {弧线方向，默认控制点在弧线左上方} direction 
     */
    function drawArcLine(opts, direction = 'upleft') {
      const x = opts.start_x;
      const y = opts.start_y;

      var x1, y1, x2, y2, cx, cy;
      if (direction == 'upleft') {
        x1 = x - 50;
        y1 = y + 50;
        x2 = x + 50;
        y2 = y - 50
        cx = x - 50;
        cy = y - 50;
      } else if (direction == 'upright') {
        x1 = x - 50;
        y1 = y - 50;
        x2 = x + 50;
        y2 = y + 50;
        cx = x + 50;
        cy = y - 50;
      } else if (direction == 'downleft') {
        x1 = x - 50;
        y1 = y - 50;
        x2 = x + 50;
        y2 = y + 50
        cx = x - 50;
        cy = y + 50;
      } else if (direction == 'downright') {
        x1 = x - 50;
        y1 = y + 50;
        x2 = x + 50;
        y2 = y - 50
        cx = x + 50;
        cy = y + 50;
      }

      var path = addElem({
        element: 'path',
        attr: {
          id: getNextId(),
          d: 'M' + x1 + ',' + y1 + ' Q' + cx + ',' + cy + ' ' + x2 + ',' + y2,
          stroke: '#ff7f00',
          'stroke-width': 4,
          fill: 'none',
          'class': 'route'
        }
      });

      var startElem = addElem({
        element: 'circle',
        attr: {
          id: getNextId(),
          cx: x1,
          cy: y1,
          r: 4,
          stroke: '#00ffff',
          'stroke-width': 4,
          fill: '#fff',
          'class': 'point'
        }
      });

      startElem.setAttributeNS(seNs, 'se:routes', path.id);

      var endElem = addElem({
        element: 'circle',
        attr: {
          id: getNextId(),
          cx: x2,
          cy: y2,
          r: 4,
          stroke: '#00ffff',
          'stroke-width': 4,
          fill: '#fff',
          'class': 'point'
        }
      });

      endElem.setAttributeNS(seNs, 'se:routes', path.id);

      var control = addElem({
        element: 'circle',
        attr: {
          id: getNextId(),
          cx: cx,
          cy: cy,
          r: 4,
          stroke: 'none',
          fill: 'red',
          'class': 'control'
        }
      });

      control.setAttributeNS(seNs, 'se:path', path.id);

      path.setAttributeNS(seNs, 'se:points', startElem.id + ' ' + endElem.id + ' ' + control.id);

      if (svgCanvas.getSelectedElems().length > 0) {
        svgCanvas.clearSelection();
      }
      svgCanvas.addToSelection([path]);

      var batchCmd = new S.BatchCommand();
      batchCmd.addSubCommand(new S.InsertElementCommand(control));
      batchCmd.addSubCommand(new S.InsertElementCommand(endElem));
      batchCmd.addSubCommand(new S.InsertElementCommand(startElem));
      batchCmd.addSubCommand(new S.InsertElementCommand(path));
      S.addCommandToHistory(batchCmd);

      svgCanvas.setMode('select');

      return {
        keep: true
      };
    }

    /**
     * 
     * @param {鼠标拖动的svg元素} elem 
     * @param {拖动事件} opts 
     */
    function pointMove(elem, opts) {
      const zoom = svgCanvas.getZoom();
      var cx = opts ? opts.mouse_x / zoom : elem.getAttribute('cx'),
        cy = opts ? opts.mouse_y / zoom : elem.getAttribute('cy');

      var routersAttr = elem.getAttributeNS(seNs, 'routes');
      if (routersAttr) {
        var routers = routersAttr.trim().split(' ');
        routers.forEach(function (routeid) {
          var route = getElem(routeid);
          if (route) {
            var move = route.pathSegList.getItem(0);
            var curve = route.pathSegList.getItem(1);

            var routeattr = route.getAttributeNS(seNs, 'points');
            if (routeattr) {
              var points = routeattr.trim().split(' ');
              if (points.length >= 2) {
                if (points[0] == elem.id) {
                  move.x = cx;
                  move.y = cy;
                } else if (points[1] == elem.id) {
                  curve.x = cx;
                  curve.y = cy;
                }
              }
            }
          }
        });
      }
    }
    /**
     * 
     * @param {鼠标选择的线} elem 
     */
    function selectRoute(elem) {

      var move = elem.pathSegList.getItem(0);
      var curve = elem.pathSegList.getItem(1);

      $('#wcsline_x1').val(move.x);
      $('#wcsline_y1').val(move.y);
      $('#wcsline_width').val(curve.x - move.x);
      $('#wcsline_height').val(curve.x - move.y);

      var Direction = elem.getAttributeNS(seNs, 'Direction');
      if (Direction == 10) {
        svgEditor.setIcon('#cur_direction_list', 'uparrow');
      } else if (Direction == 20) {
        svgEditor.setIcon('#cur_direction_list', 'downarrow');
      }

      var speed = elem.getAttributeNS(seNs, 'Speed');
      $('#wcsline_speed').val(speed);
    }
    /**
     * 
     * @param {鼠标选择的点} elem 
     */
    function selectPoint(elem) {
      var code = elem.getAttributeNS(seNs, 'Code');
      $('#wcspoint_code').val(code);

      var routersAttr = elem.getAttributeNS(seNs, 'routes');
      if (routersAttr) {
        var routers = routersAttr.trim().split(' ');
        routers.forEach(function (routeid) {
          var route = getElem(routeid);
          if (route) {
            elem.before(route);
          }
        });
      }
    }
    /**
     * 
     * @param {鼠标移动的线} elem 
     * @param {鼠标移动事件} opts 
     */
    function routeMove(elem, opts) {
      var move = elem.pathSegList.getItem(0);
      var curve = elem.pathSegList.getItem(1);

      var startElem, endElem, control;
      var pattr = elem.getAttributeNS(seNs, 'points');
      if (pattr) {
        var points = pattr.trim().split(' ');
        if (points.length >= 2) {
          startElem = getElem(points[0]);
          endElem = getElem(points[1]);
        }
        if (points.length >= 3) {
          control = getElem(points[2]);
        }

        if (startElem) {
          startElem.setAttribute('cx', move.x);
          startElem.setAttribute('cy', move.y);
        }
        if (endElem) {
          endElem.setAttribute('cx', curve.x);
          endElem.setAttribute('cy', curve.y);
        }
        if (control) {
          control.setAttribute('cx', curve.x1);
          control.setAttribute('cy', curve.y1);
        }
      }
    }
    /**
     * 
     * @param {鼠标移动的控制点} elem 
     * @param {鼠标移动事件} opts 
     */
    function controlMove(elem, opts) {
      const zoom = svgCanvas.getZoom();
      var routeid = elem.getAttributeNS(seNs, 'path');
      var route = getElem(routeid);

      var x1 = opts ? opts.mouse_x / zoom : elem.getAttribute('cx');
      var y1 = opts ? opts.mouse_y / zoom : elem.getAttribute('cy');

      if (route) {
        var contollSeg = route.pathSegList.getItem(1);
        contollSeg.x1 = x1;
        contollSeg.y1 = y1;
      }
    }
    /**
     * 
     * @param {删除点} elem 
     */
    function routeDeleteByPoint(elem) {
      var cmdArr = [];
      var firstPoint, parentNode;
      var routersAttr = elem.getAttributeNS(seNs, 'routes');
      if (routersAttr) {
        var routers = routersAttr.trim().split(' ');
        routers.forEach(function (routeid) {
          var route = getElem(routeid);
          if (route) {
            firstPoint = route;
            if(firstPoint)parentNode = firstPoint.parentNode;
            var routeattr = route.getAttributeNS(seNs, 'points');
            if (routeattr) {
              var points = routeattr.trim().split(' ');
              if (points.length >= 2) {
                if (points[0] == elem.id) {
                  var cmd = checkOrdeletePoint(points[1], routeid);
                  if(cmd)cmdArr.push(cmd);
                } else if (points[1] == elem.id) {
                  var cmd = checkOrdeletePoint(points[0], routeid);
                  if(cmd)cmdArr.push(cmd);
                }
              }

              if (points.length >= 3) {
                var control = getElem(points[2]);
                if (control) {
                  cmdArr.push(new RemoveElementCommand(control, control.nextSibling, control.parentNode));
                  control.remove();
                }
              }
            }
            cmdArr.push(new RemoveElementCommand(route, route.nextSibling, route.parentNode));
            route.remove();
          }
        });
      }
      if (cmdArr.length > 0) {
        const batchCmd = new BatchCommand('routeDeleteByPoint');
        batchCmd.addSubCommand(new RemoveElementCommand(elem, firstPoint, parentNode));
        cmdArr.forEach((v) => {
          batchCmd.addSubCommand(v);
        });
        svgCanvas.undoMgr.addCommandToHistory(batchCmd);
      }
    }

    /**
     * @param {删除控制点} elem 
     */
    function routeDeleteByControl(elem) {
      var cmdArr = [];
      var firstPoint, parentNode;
      var pathid = elem.getAttributeNS(seNs, 'path');
      var route = getElem(pathid);
      if (route) {
        firstPoint = route;
        if(firstPoint)parentNode = firstPoint.parentNode;
        var elemids = route.getAttributeNS(seNs, 'points').split(' ');
        if (elemids.length > 2) {
          var startElem = getElem(elemids[0]);
          if (startElem) {
            cmdArr.push(new RemoveElementCommand(startElem, startElem.nextSibling, startElem.parentNode));
            startElem.remove();
          }
          var endElem = getElem(elemids[1]);
          if (endElem) {
            cmdArr.push(new RemoveElementCommand(endElem, endElem.nextSibling, endElem.parentNode));
            endElem.remove();
          }
        }
        cmdArr.push(new RemoveElementCommand(route, route.nextSibling, route.parentNode));
        route.remove();
      }
      if (cmdArr.length > 0) {
        const batchCmd = new BatchCommand('routeDeleteByControl');
        batchCmd.addSubCommand(new RemoveElementCommand(elem, firstPoint, parentNode));
        cmdArr.forEach((v) => {
          batchCmd.addSubCommand(v);
        });
        svgCanvas.undoMgr.addCommandToHistory(batchCmd);
      }
    }
    /**
     * 
     * @param {删除线} elem 
     */
    function routeDeleteByRoute(elem) {
      var cmdArr = [];
      var firstPoint, parentNode;
      var pointsAttr = elem.getAttributeNS(seNs, 'points');
      if (pointsAttr) {
        var points = pointsAttr.trim().split(' ');
        if (points.length >= 2) {
          firstPoint = getElem(points[1]);
          if(firstPoint)parentNode = firstPoint.parentNode;
          var cmd = checkOrdeletePoint(points[0], elem.id);
          if (cmd) cmdArr.push(cmd);
          cmd = checkOrdeletePoint(points[1], elem.id);
          if (cmd) cmdArr.push(cmd);
        }

        if (points.length >= 3) {
          var control = getElem(points[2]);
          if (control) {
            cmdArr.push(new RemoveElementCommand(control, control.nextSibling, control.parentNode));
            control.remove();
          }
        }
      }
      if (cmdArr.length > 0) {
        const batchCmd = new BatchCommand('routeDeleteByRoute');
        batchCmd.addSubCommand(new RemoveElementCommand(elem, firstPoint, parentNode));
        cmdArr.forEach((v) => {
          batchCmd.addSubCommand(v);
        });
        svgCanvas.undoMgr.addCommandToHistory(batchCmd);
      }
    }
    /**
     * @param {待检测点ID} elemid
     * @param {当前删除的线} routeid
     */
    function checkOrdeletePoint(elemid, routeid) {
      if (!elemid) return;
      var elem = getElem(elemid);
      if (elem) {
        var routeAttr = elem.getAttributeNS(seNs, 'routes');
        if (routeAttr) {
          var routes = routeAttr.trim().split(' ');
          if (routes && routes.length > 0) {
            if (routes.length == 1) {
              var comand = new RemoveElementCommand(elem, elem.nextSibling, elem.parentNode)
              elem.remove();
              return comand;
            } else {
              var routeindex = routes.findIndex(function (v) {
                return v == routeid;
              });
              routes.splice(routeindex, 1);
              elem.setAttributeNS(seNs, 'se:routes', routes.join(' '));
            }
          }
        }
      }
    }

    /**
     * 
     * @param {是否显示线的属性面板} on 
     */
    function showRoutePanel(on) {
      var connRules = $('#wcsline_rules');
      if (!connRules.length) {
        connRules = $('<style id="wcsline_rules"></style>').appendTo('head');
      }
      connRules.text(!on ? '' : '#xy_panel { display: none !important; }');
      $('#wcsline_panel').toggle(on);
    }
    /**
     * 
     * @param {是否显示点属性面板} on 
     */
    function showPointPanel(on) {
      $('#g_panel').toggle(!on);
      $('#group_title').toggle(!on);
      $('#wcspoint_panel').toggle(on);
    }
    /**
     * 根据属性面板修改的值设置线方向
     */
    function setRouteDirection() {
      var val = 0;
      if (this.id == 'uparrow') {
        val = 10;
      } else if (this.id == 'downarrow') {
        val = 20;
      }
      if (selRoute) {
        selRoute.setAttributeNS(seNs, 'se:Direction', val);
      }
    }
    /**
     * 根据属性面板修改的值设置起始结束点位置值
     */
    function SetRouteXYWH() {
      if (selRoute) {
        var selElems = svgCanvas.getSelectedElems();
        svgCanvas.clearSelection();

        var move = selRoute.pathSegList.getItem(0);
        var curve = selRoute.pathSegList.getItem(1);

        var startElem, endElem, control;
        var routeattr = selRoute.getAttributeNS(seNs, 'points');
        if (routeattr) {
          var points = routeattr.trim().split(' ');
          if (points.length >= 2) {
            startElem = getElem(points[0]);
            endElem = getElem(points[1]);
          }
          if (points.length >= 3) {
            control = getElem(points[2]);
          }
          const batchCmd = new BatchCommand('Set RouteXYWH');
          var od = selRoute.getAttribute('d');

          if (this.id == 'wcsline_x1') {
            if (startElem) {
              var ocx = startElem.getAttribute('cx');
              startElem.setAttribute('cx', this.value);
              batchCmd.addSubCommand(new ChangeElementCommand(startElem, {
                'cx': ocx
              }));
              move.x = this.value;
            }
          } else if (this.id == 'wcsline_y1') {
            if (startElem) {
              var ocy = startElem.getAttribute('cy');
              startElem.setAttribute('cy', this.value);
              batchCmd.addSubCommand(new ChangeElementCommand(startElem, {
                'cy': ocy
              }));
              move.y = this.value;
            }
          } else if (this.id == 'wcsline_width') {
            if (startElem && endElem) {
              var ocx = endElem.getAttribute('cx');

              var cx = startElem.getAttribute('cx');
              cx = parseFloat(cx) + parseFloat(this.value);

              endElem.setAttribute('cx', cx);
              batchCmd.addSubCommand(new ChangeElementCommand(endElem, {
                'cx': ocx
              }));
              curve.x = cx;
            }
          } else if (this.id == 'wcsline_height') {
            if (startElem && endElem) {
              var ocy = endElem.getAttribute('cy');

              var cy = startElem.getAttribute('cy');
              cy = parseFloat(cy) + parseFloat(this.value);

              endElem.setAttribute('cy', cy);
              batchCmd.addSubCommand(new ChangeElementCommand(endElem, {
                'cy': ocy
              }));
              curve.y = cy;
            }
          }
          batchCmd.addSubCommand(new ChangeElementCommand(selRoute, {
            'd': od
          }));
          if (!batchCmd.isEmpty()) {
            svgCanvas.undoMgr.addCommandToHistory(batchCmd);
          }
        }
        svgCanvas.addToSelection(selElems);
      }
    }

    /**
     * 获取多语言标题
     */
    function getTitle(id,curLang=lang) {
      var list = langList[lang];
      for (var i in list) {
        if (list.hasOwnProperty(i) && list[i].id === id) {
          return list[i].title;
        }
      }
      return id;
    }

    return extConfig;
  }
};