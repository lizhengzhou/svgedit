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
  name: 'Wcs Map Editer',
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
    var initStroke = svgEditor.curConfig.initStroke;
    var seNs = svgCanvas.getEditorNS(true);


    var langList = {
      en: [{
        id: 'line_horizontal',
        title: 'Draw horizontal line'
      }],
      zh_CN: [{
        id: 'line_horizontal',
        title: '画横线'
      }],
      en: [{
        id: 'line_vertical',
        title: 'Draw vertical line'
      }],
      zh_CN: [{
        id: 'line_vertical',
        title: '画竖线'
      }]
    };

    /*
     * 
     */
    svgEditor.setCustomHandlers({
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
      save(win, data) {

        var formData = new FormData();
        formData.append("map.svg", data);
        // Save svg
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
            var data=JSON.parse(request.responseText);
              $.alert(data.Message);
          }
        });


        var map = {};
        map.Routes = [];
        map.Points = [];

        new Promise(function (resolve, reject) {
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

          
          $.ajax({
            url: svgEditor.curConfig.serverApi + '/SaveMap',
            type: 'post',
            dataType: "json",
            contentType:"application/json",
            data: JSON.stringify(map),
            success: function (data) {
              if(data)
              {
                $.alert('保存成功');
              }
            },
            error: function (request) {
              var data=JSON.parse(request.responseText);
              $.alert(data.Message);
            }
        });

          resolve();
        });

        new Promise(function (resolve, reject) {

          //To Do gennerate Monitor
          $(svgcontent).find('.control').each(function () {
            this.remove();
          });
          $(svgcontent).find('.point').each(function () {
            if (!this.getAttributeNS(seNs, 'nebor')) {
              this.setAttribute('stroke', 'none');
              this.setAttribute('fill', 'none');
            }
          });

          var clearSvgStr = svgCanvas.svgCanvasToString();

          var formData = new FormData();
          formData.append("monitor.svg", clearSvgStr);
          // Save svg
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

          svgCanvas.setSvgString(data);

          resolve();
        });
      }
    });

    var extConfig = {
      name: 'Wcs Map Editer',
      // For more notes on how to make an icon file, see the source of
      // the helloworld-icon.xml
      svgicons: svgEditor.curConfig.extIconsPath + 'wcs-map-editer-icon.xml',
      // Multiple buttons can be added in this array
      buttons: [{
          // Must match the icon ID in wcs-map-editer-icon.xml
          id: 'line_horizontal',
          // This indicates that the button will be added to the "mode"
          // button panel on the left side
          type: 'mode',
          // Tooltip text
          title: "Draw horizontal line",
          position: '11',
          // Events
          events: {
            click() {
              // The action taken when the button is clicked on.
              // For "mode" buttons, any other button will
              // automatically be de-pressed.              
              svgCanvas.setMode('line_horizontal');
            }
          }
        }, {
          // Must match the icon ID in helloworld-icon.xml
          id: 'line_vertical',
          // This indicates that the button will be added to the "mode"
          // button panel on the left side
          type: 'mode',
          position: '12',
          // Tooltip text
          title: "Draw vertical line",
          // Events
          events: {
            click() {
              // The action taken when the button is clicked on.
              // For "mode" buttons, any other button will
              // automatically be de-pressed.              
              svgCanvas.setMode('line_vertical');
            }
          }
        },
        {
          id: 'line_arc_upleft',
          type: 'mode',
          position: '21',
          title: "Draw arc line",
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
          title: "Draw arc line",
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
          title: "Draw arc line",
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
          title: "Draw arc line",
          events: {
            click() {
              svgCanvas.setMode('line_arc_downright');
            }
          }
        },
        {
          id: 'uparrow',
          svgicon: 'uparrow',
          title: 'forword direction',
          type: 'context',
          events: {
            click: setRouteDirection
          },
          panel: 'wcsline_panel',
          list: 'direction_list',
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
      context_tools: [{
          type: 'input',
          panel: 'wcsline_panel',
          title: 'X',
          id: 'wcsline_x1',
          label: 'X',
          size: 3,
          events: {
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
      callback: function callback() {
        $('#wcsline_panel').hide();
      },
      addLangData: function addLangData(lang) {
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
        if (svgCanvas.getSelectedElems().length == 1) {
          var elems = svgCanvas.getSelectedElems();
          var elem = elems[0];
          if (elem && elem.tagName === 'circle' && elem.getAttribute('class') === 'point') {
            //Point Group Changed
            pointMove(elem, opts);
          } else if (elem && elem.tagName === 'circle' && elem.getAttribute('class') === 'control') {
            //be line control point move
            controlMove(elem, opts);
          }
        }
      },
      // This is triggered from anywhere, but "started" must have been set
      // to true (see above). Note that "opts" is an object with event info
      mouseUp(opts) {
        // Check the mode on mouseup
        //if (svgCanvas.getMode() === 'line_horizontal') {          
        //}
      },
      selectedChanged: function selectedChanged(opts) {
        if (svgCanvas.getSelectedElems().length == 0) {
          showPointPanel(false);
          showRoutePanel(false);
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
          if (elem && !svgcontent.getElementById(elem.id)) {
            if (elem && elem.tagName === 'circle' && elem.getAttribute('class') === 'point') {
              routeDelete(elem, 'point');
            } else if (elem && elem.tagName === 'circle' && elem.getAttribute('class') === 'control') {
              routeDelete(elem, 'control');
            } else if (elem && elem.tagName === 'path' && elem.getAttribute('class') === 'route') {
              routeDelete(elem, 'route');
            }
          } else {
            if (elem && elem.tagName === 'circle' && elem.getAttribute('class') === 'point') {
              //Point Group Changed
              pointMove(elem);

            } else if (elem && elem.tagName === 'path' && elem.getAttribute('class') === 'route') {
              //route move
              routeMove(elem);
            } else if (elem && elem.tagName === 'circle' && elem.getAttribute('class') === 'control') {
              //be line control point move
              controlMove(elem);
            }
          }
        });
      }
    };


    // Do on reset
    function init() {
      return;
      // Make sure all routes have data set
      $(svgcontent).find('*').each(function () {
        var pointsAttr = this.getAttributeNS(seNs, 'points');
        if (pointsAttr) {
          this.setAttribute('class', 'route');

          var points = pointsAttr.trim().split(' ');

          var startElem = getElem(points[0]),
            endElem = getElem(points[1]);

          if (startElem) {
            startElem.setAttribute('class', 'point');
          }

          if (endElem) {
            endElem.setAttribute('class', 'point');
          }

          if (points[2]) {
            var control = getElem(points[2]);
            if (control) control.setAttribute('class', 'control');
          }
        }
      });
    }

    //draw Mode Functions
    //draw Horiaontal Line
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
          r: 8,
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
          r: 8,
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

    /*
     *  draw arc line
     *  opts where mouse down
     *  direction where the control point will place
     * */
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
          r: 8,
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
          r: 8,
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
          r: 8,
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

    function selectPoint(elem) {
      var code = elem.getAttributeNS(seNs, 'Code');
      $('#wcspoint_code').val(code);
    }

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

    function routeDelete(elem, type) {
      if (type == 'point') {
        var routersAttr = elem.getAttributeNS(seNs, 'routes');
        if (routersAttr) {
          var routers = routersAttr.trim().split(' ');
          routers.forEach(function (routeid) {
            var route = getElem(routeid);
            if (route) {
              var routeattr = route.getAttributeNS(seNs, 'points');
              if (routeattr) {
                var points = routeattr.trim().split(' ');
                if (points.length >= 2) {
                  if (points[0] == elem.id) {
                    checkOrdeletePoint(points[1], routeid);
                  } else if (points[1] == elem.id) {
                    checkOrdeletePoint(points[0], routeid);
                  }
                }

                if (points.length >= 3) {
                  var control = getElem(points[2]);
                  if (control) control.remove();
                }
              }
              route.remove();
            }
          });
        }
      } else if (type == 'control') {
        var pathid = elem.getAttributeNS(seNs, 'path');
        var route = getElem(pathid);
        if (route) {
          var elemids = route.getAttributeNS(seNs, 'points').split(' ');
          if (elemids.length > 2) {
            var startElem = getElem(elemids[0]);
            if (startElem) startElem.remove();
            var endElem = getElem(elemids[1]);
            if (endElem) endElem.remove();
          }
          route.remove();
        }
      } else if (type == 'route') {
        var pointsAttr = elem.getAttributeNS(seNs, 'points');
        if (pointsAttr) {
          var points = pointsAttr.trim().split(' ');
          if (points.length >= 2) {
            checkOrdeletePoint(points[0], elem.id);
            checkOrdeletePoint(points[1], elem.id);
          }

          if (points.length >= 3) {
            var control = getElem(points[2]);
            if (control) control.remove();
          }
        }
      }
    }

    function checkOrdeletePoint(elemid, routeid) {
      if (!elemid) return;
      var elem = getElem(elemid);
      if (elem) {
        var routeAttr = elem.getAttributeNS(seNs, 'routes');
        if (routeAttr) {
          var routes = routeAttr.trim().split(' ');
          if (routes && routes.length > 0) {
            if (routes.length == 1) {
              elem.remove();
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
    // End draw functions



    //utils  Functions
    function showRoutePanel(on) {
      var connRules = $('#wcsline_rules');
      if (!connRules.length) {
        connRules = $('<style id="wcsline_rules"></style>').appendTo('head');
      }
      connRules.text(!on ? '' : '#xy_panel { display: none !important; }');
      $('#wcsline_panel').toggle(on);
    }

    function showPointPanel(on) {
      $('#g_panel').toggle(!on);
      $('#group_title').toggle(!on);
      $('#wcspoint_panel').toggle(on);
    }

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

          if (this.id == 'wcsline_x1') {
            if (startElem) {
              startElem.setAttribute('cx', this.value);
              move.x = this.value;
            }
          } else if (this.id == 'wcsline_y1') {
            if (startElem) {
              startElem.setAttribute('cy', this.value);
              move.y = this.value;
            }
          } else if (this.id == 'wcsline_width') {
            if (startElem && endElem) {
              var cx = startElem.getAttribute('cx');
              cx = parseFloat(cx) + parseFloat(this.value);

              endElem.setAttribute('cx', cx);
              curve.x = cx;
            }
          } else if (this.id == 'wcsline_height') {
            if (startElem && endElem) {
              var cy = startElem.getAttribute('cy');
              cy = parseFloat(cy) + parseFloat(this.value);

              endElem.setAttribute('cy', cy);
              curve.y = cy;
            }
          }
        }
        svgCanvas.addToSelection(selElems);
      }
    }

    //End utils  Functions



    return extConfig;
  }
};