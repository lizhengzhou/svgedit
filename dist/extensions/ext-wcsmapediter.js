var svgEditorExtension_wcsmapediter = (function () {
  'use strict';

  /* globals jQuery */
  /*
   * ext-wcsmapediter.js
   *
   * Licensed under the MIT License
   *
   * Copyright(c) 2010 Alexis Deveria
   *
   */

  /*
      WCS Map Editer Plugin
  */
  var extWcsmapediter = {
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
        selManager = S.selectorManager,
        // seNs = void 0,
        connections = [],
        selElems = [],
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
          formData.append("svg", data);
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


          var map = svgcontent;
          //To Do gennerate Routes and Points


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
            // Events
            events: {
              click() {
                // The action taken when the button is clicked on.
                // For "mode" buttons, any other button will
                // automatically be de-pressed.
                showPanel(true);
                svgCanvas.setMode('line_horizontal');
              }
            }
          }, {
            // Must match the icon ID in helloworld-icon.xml
            id: 'line_vertical',
            // This indicates that the button will be added to the "mode"
            // button panel on the left side
            type: 'mode',
            // Tooltip text
            title: "Draw vertical line",
            // Events
            events: {
              click() {
                // The action taken when the button is clicked on.
                // For "mode" buttons, any other button will
                // automatically be de-pressed.
                showPanel(true);
                svgCanvas.setMode('line_vertical');
              }
            }
          },
          {
            id: 'line_arc_up',
            type: 'mode',
            title: "Draw arc line",
            events: {
              click() {
                //showLinePanel(true);
                svgCanvas.setMode('line_arc_up');
              }
            }
          },
          {
            id: 'line_arc_down',
            type: 'mode',
            title: "Draw arc line",
            events: {
              click() {
                //showLinePanel(true);
                svgCanvas.setMode('line_arc_down');
              }
            }
          },
          {
            id: 'line_arc_left',
            type: 'mode',
            title: "Draw arc line",
            events: {
              click() {
                //showLinePanel(true);
                svgCanvas.setMode('line_arc_left');
              }
            }
          },
          {
            id: 'line_arc_right',
            type: 'mode',
            title: "Draw arc line",
            events: {
              click() {
                //showLinePanel(true);
                svgCanvas.setMode('line_arc_right');
              }
            }
          },
          {
            id: 'uparrow',
            svgicon: 'uparrow',
            title: 'forword direction',
            type: 'context',
            events: {
              click: setDirectionFromButton
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
              click: setDirectionFromButton
            },
            panel: 'wcsline_panel',
            list: 'direction_list',
            isDefault: true
          }
        ],
        context_tools: [{
          type: 'button-select',
          panel: 'wcsline_panel',
          title: 'select direction',
          id: 'direction_list',
          label: 'Direction',
          colnum: 3,
          events: {
            change: setDirectionFromButton
          }
        }, {
          type: 'input',
          panel: 'wcsline_panel',
          title: 'Speed',
          id: 'speed',
          label: 'Speed',
          size: 3,
          defval: 10,
          events: {
            change: function change() {
              setAttr('Speed', this.value);
            }
          }
        }],
        callback: function callback() {
          $('#wcsline_panel').hide();
          // const endChanges = function(){};
        },
        addLangData: function addLangData(lang) {
          return {
            data: langList[lang]
          };
        },
        // This is triggered when the main mouse button is pressed down
        // on the editor canvas (not the tool panels)
        mouseDown(opts) {
          // Check the mode on mousedown
          var mode = svgCanvas.getMode();
          if (mode === 'line_horizontal') {
            // The returned object must include "started" with
            // a value of true in order for mouseUp to be triggered
            //horizontal line
            drawLine(opts);
            //return {started: true};
          } else if (mode === 'line_vertical') {
            // The returned object must include "started" with
            // a value of true in order for mouseUp to be triggered
            //vertical line
            drawLine(opts, false);
            //return {started: true};
          } else if (mode == 'line_arc_up') {
            drawArcLine(opts, 'up');
          } else if (mode == 'line_arc_down') {
            drawArcLine(opts, 'down');
          } else if (mode == 'line_arc_left') {
            drawArcLine(opts, 'left');
          } else if (mode == 'line_arc_right') {
            drawArcLine(opts, 'right');
          }

          if (mode == 'select') {
            return {
              started: true
            };
          }
        },
        mouseMove: function mouseMove(opts) {
          if (svgCanvas.getSelectedElems().length == 1) {
            var elem = opts.selected;
            if (elem && elem.tagName === 'g' && elem.getAttribute('class') === 'pointgroup') {
              //Point Group Changed
              pointMove(elem, opts);
            } else if (elem && elem.tagName === 'path' && elem.getAttribute('class') === 'route') {
              //Route Move
              routemove(elem);
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

        },
        elementChanged: function elementChanged(opts) {
          var elem = opts.elems[0];
          if (elem && elem.tagName === 'svg' && elem.id === 'svgcontent') {
            // Update svgcontent (can change on import)
            svgcontent = elem;
            init();
          }
        },
      };


      // Do on reset
      function init() {
        // Make sure all routes have data set
        $(svgcontent).find('*').each(function () {
          var conn = this.getAttributeNS(seNs, 'route');
          if (conn) {
            this.setAttribute('class', 'route');
            svgCanvas.getEditorNS(true);
          }
        });
      }

      //draw Mode Functions
      //draw Horiaontal Line
      function drawLine(opts, IsHoriaontal = true) {
        const zoom = svgCanvas.getZoom();
        // Get the actual coordinate by dividing by the zoom value
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
          element: 'g',
          attr: {
            id: getNextId(),
            'class': 'pointgroup'
          }
        });

        var circle = addElem({
          element: 'circle',
          attr: {
            cx: x1,
            cy: y1,
            r: 8,
            stroke: '#00ffff',
            'stroke-width': 4,
            fill: '#fff',
            'class': 'point'
          }
        })
        startElem.append(circle);


        var endElem = addElem({
          element: 'g',
          attr: {
            id: getNextId(),
            'class': 'pointgroup'
          }
        });

        var circle = addElem({
          element: 'circle',
          attr: {
            cx: x2,
            cy: y2,
            r: 8,
            stroke: '#00ffff',
            'stroke-width': 4,
            fill: '#fff',
            'class': 'point'
          }
        })
        endElem.append(circle);

        path.setAttributeNS(seNs, 'se:route', startElem.id + ' ' + endElem.id);
       
        svgCanvas.clearSelection();
        svgCanvas.addToSelection([startElem, endElem, path]);

        var batchCmd = new S.BatchCommand();
        batchCmd.addSubCommand(new S.InsertElementCommand(endElem));
        batchCmd.addSubCommand(new S.InsertElementCommand(startElem));
        batchCmd.addSubCommand(new S.InsertElementCommand(path));
        S.addCommandToHistory(batchCmd);

        return {
          keep: true
        };
      }

      /*
       *  draw arc line
       *  opts where mouse down
       *  direction where the control point will place
       * */
      function drawArcLine(opts, direction = 'up') {
        const zoom = svgCanvas.getZoom();
        const x = opts.start_x;
        const y = opts.start_y;

        var x1, y1, x2, y2, cx, cy;
        if (direction == 'up') {
          x1 = x - 50;
          y1 = y;
          x2 = x + 50;
          y2 = y
          cx = x;
          cy = y + 50;
        } else if (direction == 'down') {
          x1 = x - 50;
          y1 = y;
          x2 = x + 50;
          y2 = y
          cx = x;
          cy = y - 50;
        } else if (direction == 'left') {
          x1 = x;
          y1 = y - 50;
          x2 = x;
          y2 = y + 50
          cx = x + 50;
          cy = y;
        } else if (direction == 'right') {
          x1 = x;
          y1 = y - 50;
          x2 = x;
          y2 = y + 50
          cx = x - 50;
          cy = y;
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
          element: 'g',
          attr: {
            id: getNextId(),
            'class': 'pointgroup'
          }
        });

        var circle = addElem({
          element: 'circle',
          attr: {
            cx: x1,
            cy: y1,
            r: 8,
            stroke: '#00ffff',
            'stroke-width': 4,
            fill: '#fff',
            'class': 'point'
          }
        })
        startElem.append(circle);


        var endElem = addElem({
          element: 'g',
          attr: {
            id: getNextId(),
            'class': 'pointgroup'
          }
        });

        var circle = addElem({
          element: 'circle',
          attr: {
            cx: x2,
            cy: y2,
            r: 8,
            stroke: '#00ffff',
            'stroke-width': 4,
            fill: '#fff',
            'class': 'point'
          }
        })
        endElem.append(circle);

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
        path.setAttributeNS(seNs, 'se:route', startElem.id + ' ' + endElem.id + ' ' + control.id);

        svgCanvas.clearSelection();
        svgCanvas.addToSelection([startElem, endElem, path, control]);

        var batchCmd = new S.BatchCommand();
        batchCmd.addSubCommand(new S.InsertElementCommand(control));
        batchCmd.addSubCommand(new S.InsertElementCommand(endElem));
        batchCmd.addSubCommand(new S.InsertElementCommand(startElem));
        batchCmd.addSubCommand(new S.InsertElementCommand(path));
        S.addCommandToHistory(batchCmd);

        return {
          keep: true
        };
      }

      function pointMove(elem, opts) {
        var routers = $(svgcontent).find('.route');
        var route, pos;
        routers.each(function () {
          var points = this.getAttributeNS(seNs, 'route').split(' ');
          if (points[0] == elem.id || points[1] == elem.id) {
            route = this;
            if (points[0] == elem.id) pos = 'start';
            else if (points[1] == elem.id) pos = 'end';
          }
        });

        if (route) {
          if (elem.children.length > 0) {
            var cx = opts ? opts.mouse_x : elem.children[0].getAttribute('cx'),
              cy = opts ? opts.mouse_y : elem.children[0].getAttribute('cy');

            if (pos == 'start') {
              var move = route.pathSegList.getItem(0);
              move.x = cx;
              move.y = cy;
            } else if (pos = 'end') {
              var curve = route.pathSegList.getItem(1);
              curve.x = cx;
              curve.y = cy;
            }
          }
        }
      }

      function routemove(elem) {
        var points = elem.getAttributeNS(seNs, 'route').split(' ');
        var startElem = getElem(points[0]),
          endElem = getElem(points[1]),
          control = getElem(points[2]);

        var selectedElems = svgCanvas.getSelectedElems();
        if (!selectedElems.includes(control)) {
          svgCanvas.addToSelection([startElem, endElem, control]);
        }
      }

      function controlMove(elem, opts) {
        var routeid = elem.getAttributeNS(seNs, 'path');
        var route = getElem(routeid);

        var x1 = opts ? opts.mouse_x : elem.getAttribute('cx');
        var y1 = opts ? opts.mouse_y : elem.getAttribute('cy');

        var contollSeg = route.pathSegList.getItem(1);
        contollSeg.x1 = x1;
        contollSeg.y1 = y1;
      }
      // End draw functions



      //utils  Functions
      function showPanel(on) {
        var connRules = $('#wcsline_rules');
        if (!connRules.length) {
          connRules = $('<style id="wcsline_rules"></style>').appendTo('head');
        }
        connRules.text(!on ? '' : '#tool_clone, #tool_topath, #tool_angle, #xy_panel { display: none !important; }');
        $('#wcsline_panel').toggle(on);
      }

      function setAttr(attr, val) {
        svgCanvas.changeSelectedAttribute(attr, val);
        S.call('changed', selElems);
      }




      function setDirectionFromButton() {

        var val = 0;
        if (this.id == 'uparrow') {
          val = 10;
        } else if (this.id == 'downarrow') {
          val = 20;
        }

        let selElem = selElems[0];
        if (selElem) {
          selElem.setAttribute('Direction', val);
        }
      }
      //End utils  Functions



      return extConfig;
    }
  };


  return extWcsmapediter;

}());