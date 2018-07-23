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
        selManager = S.selectorManager,
        seNs = void 0,
        connections = [],
        selElems = [],
        connSel = '.se_connector';

      var langList = {
        en: [{
          id: 'line_horizontal',
          title: 'Draw horizontal line'
        }],
        zh_cn: [{
          id: 'line_horizontal',
          title: 'ª≠∫·œﬂ'
        }],
        en: [{
          id: 'line_vertical',
          title: 'Draw vertical line'
        }],
        zh_cn: [{
          id: 'line_vertical',
          title: 'ª≠ ˙œﬂ'
        }]
      };

      svgEditor.setCustomHandlers({
        open() {
          $.ajax({
            url: svgEditor.curConfig.serverApi + '/open',
            type: 'get',
            success: function (data) {
              // alert(data);
              if (data) {
                svgCanvas.setSvgString(data);
                init();
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

      var ret = {
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
            id: 'leftarrow',
            svgicon: 'leftarrow',
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
            id: 'rightarrow',
            svgicon: 'rightarrow',
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
          // TODO: Find better way to skip operations if no connectors are in use
          if (!$(svgcontent).find(connSel).length) {
            return;
          }

          if (svgCanvas.getMode() === 'connector') {
            svgCanvas.setMode('select');
          }

          // Use this to update the current selected elements
          selElems = opts.elems;

          var i = selElems.length;
          if (i == 0) {
            showPanel(false);
          }
          while (i--) {
            var elem = selElems[i];
            if (elem && elData(elem, 'c_start')) {
              selManager.requestSelector(elem).showGrips(false);
              if (opts.selectedElement && !opts.multiselected) {
                // TODO: Set up context tools and hide most regular line tools
                showPanel(true);
              } else {
                showPanel(false);
              }
            } else {
              showPanel(false);
            }
          }
          updateConnectors();
        },
        elementChanged: function elementChanged(opts) {
          var elem = opts.elems[0];
          if (elem && elem.tagName === 'svg' && elem.id === 'svgcontent') {
            // Update svgcontent (can change on import)
            svgcontent = elem;
            init();
          }

          // Has marker, so change offset
          if (elem && (elem.getAttribute('marker-start') || elem.getAttribute('marker-mid') || elem.getAttribute('marker-end'))) {
            var start = elem.getAttribute('marker-start');
            var mid = elem.getAttribute('marker-mid');
            var end = elem.getAttribute('marker-end');
            curLine = elem;
            $(elem).data('start_off', !!start).data('end_off', !!end);

            if (elem.tagName === 'line' && mid) {
              // Convert to polyline to accept mid-arrow

              var x1 = Number(elem.getAttribute('x1'));
              var x2 = Number(elem.getAttribute('x2'));
              var y1 = Number(elem.getAttribute('y1'));
              var y2 = Number(elem.getAttribute('y2'));
              var _elem = elem,
                id = _elem.id;


              var midPt = ' ' + (x1 + x2) / 2 + ',' + (y1 + y2) / 2 + ' ';
              var pline = addElem({
                element: 'polyline',
                attr: {
                  points: x1 + ',' + y1 + midPt + x2 + ',' + y2,
                  stroke: elem.getAttribute('stroke'),
                  'stroke-width': elem.getAttribute('stroke-width'),
                  'marker-mid': mid,
                  fill: 'none',
                  opacity: elem.getAttribute('opacity') || 1                  
                }
              });
              $(elem).after(pline).remove();
              svgCanvas.clearSelection();
              pline.id = id;
              svgCanvas.addToSelection([pline]);
              elem = pline;
            }
          }
          // Update line if it's a connector
          if (elem.getAttribute('class') === connSel.substr(1)) {
            var _start = getElem(elData(elem, 'c_start'));
            updateConnectors([_start]);
          } else {
            updateConnectors();
          }
        },
        IDsUpdated: function IDsUpdated(input) {
          var remove = [];
          input.elems.forEach(function (elem) {
            if ('se:connector' in elem.attr) {
              elem.attr['se:connector'] = elem.attr['se:connector'].split(' ').map(function (oldID) {
                return input.changes[oldID];
              }).join(' ');

              // Check validity - the field would be something like 'svg_21 svg_22', but
              // if one end is missing, it would be 'svg_21' and therefore fail this test
              if (!/. ./.test(elem.attr['se:connector'])) {
                remove.push(elem.attr.id);
              }
            }
          });
          return {
            remove: remove
          };
        },
        // toolButtonStateUpdate: function toolButtonStateUpdate(opts) {
        //   if (opts.nostroke) {
        //     if ($('#mode_connect').hasClass('tool_button_current')) {
        //       svgEditor.clickSelect();
        //     }
        //   }
        //   $('#mode_connect').toggleClass('disabled', opts.nostroke);
        // }
      };




      //draw Mode Functions
      //draw Horiaontal Line
      function drawLine(opts, IsHoriaontal = true) {
        const zoom = svgCanvas.getZoom();
        // Get the actual coordinate by dividing by the zoom value
        const x = opts.start_x / zoom;
        const y = opts.start_y / zoom;
        var initStroke = svgEditor.curConfig.initStroke;

        var startElem = addElem({
          element: 'image',
          attr: {
            x: x,
            y: y,
            width: 16,
            height: 16,
            id: getNextId(),
            opacity: initStroke.opacity,
            style: 'pointer-events:inherit'
          }
        });
        setHref(startElem, 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAABWElEQVQ4T62TOyxDURjHf6eNLk0tDAYdmEQl1YHdY2jjMXYxVWrwGDAjEeaWoRaNWixGKulA7Qw0cTGJxGJgoYg27ZHj5l63xfU82/l/3/fL9xRUvzXZioMokhDQ9GqWXOAgQ5kkw+LUGiLMz6Z08UAMGAUc78C6UAZWcTNFWDwpQQeo4Ed2kPR+ElgtZ3ETIiwKOiAlE8CY4dXvhWkfdNTpyuEtxDRIX1VwEkTEhGBd+pDkAKcyzwdgzv9xHos5mD0ybSUEfkFKxoFJJfc1QvqLIgb3YPstkyUFOANaFCAbhK4G+y7sX0N3xvQ5V4BnwKWkuyHw1NgD7otQu2H6FH4MyBfBYwAE+b+WoFU0ccALWz32JVQ1cVmQlG04OTbGuBCAme+OsUS77SJ11uvZHNxAXKsYn5JXiIjxf1pl4x5+fUzWvumrPQIEgWagAFwCu5RIEhUnVvcX53+ADevpyPcAAAAASUVORK5CYII=');
        svgUtils.preventClickDefault(startElem);


        var endElem = addElem({
          element: 'image',
          attr: {
            x: IsHoriaontal ? (x + 100) : x,
            y: IsHoriaontal ? y : (y + 100),
            width: 16,
            height: 16,
            id: getNextId(),
            opacity: initStroke.opacity,
            style: 'pointer-events:inherit'
          }
        });
        setHref(endElem, 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAABWElEQVQ4T62TOyxDURjHf6eNLk0tDAYdmEQl1YHdY2jjMXYxVWrwGDAjEeaWoRaNWixGKulA7Qw0cTGJxGJgoYg27ZHj5l63xfU82/l/3/fL9xRUvzXZioMokhDQ9GqWXOAgQ5kkw+LUGiLMz6Z08UAMGAUc78C6UAZWcTNFWDwpQQeo4Ed2kPR+ElgtZ3ETIiwKOiAlE8CY4dXvhWkfdNTpyuEtxDRIX1VwEkTEhGBd+pDkAKcyzwdgzv9xHos5mD0ybSUEfkFKxoFJJfc1QvqLIgb3YPstkyUFOANaFCAbhK4G+y7sX0N3xvQ5V4BnwKWkuyHw1NgD7otQu2H6FH4MyBfBYwAE+b+WoFU0ccALWz32JVQ1cVmQlG04OTbGuBCAme+OsUS77SJ11uvZHNxAXKsYn5JXiIjxf1pl4x5+fUzWvumrPQIEgWagAFwCu5RIEhUnVvcX53+ADevpyPcAAAAASUVORK5CYII=');
        svgUtils.preventClickDefault(endElem);

        var bb = svgCanvas.getStrokedBBox([startElem]);
        var startx = bb.x + bb.width / 2;
        var starty = bb.y + bb.height / 2;

        var curLine = addElem({
          element: 'polyline',
          attr: {
            id: getNextId(),
            points: startx + ',' + starty + ' ' + startx + ',' + starty + ' ' + (x + 100) + ',' + y,
            stroke: '#' + initStroke.color,
            'stroke-width': initStroke.width,
            fill: 'none',
            opacity: initStroke.opacity,
            style: 'pointer-events:none',
            'Direction':0,
            'Speed':10
          }
        });
        elData(curLine, 'start_bb', bb);
        svgUtils.preventClickDefault(curLine);

        var startId = startElem.id,
          endId = endElem.id;
        var connStr = startId + ' ' + endId;

        bb = svgCanvas.getStrokedBBox([endElem]);

        var pt = getBBintersect(x, y, bb, getOffset('start', curLine));
        setPoint(curLine, 'end', pt.x, pt.y, true);
        $(curLine).data('c_start', startId).data('c_end', endId).data('end_bb', bb);
        var seNs = svgCanvas.getEditorNS(true);
        curLine.setAttributeNS(seNs, 'se:connector', connStr);
        curLine.setAttribute('class', connSel.substr(1));
        curLine.setAttribute('opacity', 1);
        svgCanvas.clearSelection();
        svgCanvas.addToSelection([curLine]);

        return {
          keep: true
        };
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
      //Set image href
      function setHref(elem, val) {
        elem.setAttributeNS(S.NS.XLINK, 'xlink:href', val);
      };

      function getBBintersect(x, y, bb, offset) {
        if (offset) {
          offset -= 0;
          bb = $.extend({}, bb);
          bb.width += offset;
          bb.height += offset;
          bb.x -= offset / 2;
          bb.y -= offset / 2;
        }

        var midX = bb.x + bb.width / 2;
        var midY = bb.y + bb.height / 2;
        var lenX = x - midX;
        var lenY = y - midY;

        var slope = Math.abs(lenY / lenX);

        var ratio = void 0;
        if (slope < bb.height / bb.width) {
          ratio = bb.width / 2 / Math.abs(lenX);
        } else {
          ratio = lenY ? bb.height / 2 / Math.abs(lenY) : 0;
        }

        return {
          x: midX + lenX * ratio,
          y: midY + lenY * ratio
        };
      }

      //get Offset by elem's Width
      function getOffset(side, line) {
        var giveOffset = !!line.getAttribute('marker-' + side);
        // const giveOffset = $(line).data(side+'_off');
        // TODO: Make this number (5) be based on marker width/height
        var size = line.getAttribute('stroke-width') * 5;
        return giveOffset ? size : 0;
      }

      //set polyline points
      function setPoint(elem, pos, x, y, setMid) {
        var pts = elem.points;
        var pt = svgroot.createSVGPoint();
        pt.x = x;
        pt.y = y;
        if (pos === 'end') {
          pos = pts.numberOfItems - 1;
        }
        // TODO: Test for this on init, then use alt only if needed
        try {
          pts.replaceItem(pt, pos);
        } catch (err) {
          // Should only occur in FF which formats points attr as "n,n n,n", so just split
          var ptArr = elem.getAttribute('points').split(' ');
          for (var i = 0; i < ptArr.length; i++) {
            if (i === pos) {
              ptArr[i] = x + ',' + y;
            }
          }
          elem.setAttribute('points', ptArr.join(' '));
        }

        if (setMid) {
          // Add center point
          var ptStart = pts.getItem(0);
          var ptEnd = pts.getItem(pts.numberOfItems - 1);
          setPoint(elem, 1, (ptEnd.x + ptStart.x) / 2, (ptEnd.y + ptStart.y) / 2);
        }
      }

      /**
       *
       * @param {array} [elem=selElems] Array of elements
       */
      function findConnectors() {
        var elems = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : selElems;
        if (!elems || elems.length == 0 && elems[0] === undefined) return;

        var connectors = $(svgcontent).find(connSel);
        connections = [];

        // Loop through connectors to see if one is connected to the element
        connectors.each(function () {
          var addThis = void 0;

          function add() {
            if (elems.includes(this)) {
              // Pretend this element is selected
              addThis = true;
            }
          }

          // Grab the ends
          var parts = [];
          ['start', 'end'].forEach(function (pos, i) {
            var key = 'c_' + pos;
            var part = elData(this, key);
            if (part == null) {
              part = document.getElementById(this.attributes['se:connector'].value.split(' ')[i]);
              elData(this, 'c_' + pos, part.id);
              elData(this, pos + '_bb', svgCanvas.getStrokedBBox([part]));
            } else part = document.getElementById(part);
            parts.push(part);
          }.bind(this));

          for (var i = 0; i < 2; i++) {
            var cElem = parts[i];

            addThis = false;
            // The connected element might be part of a selected group
            $(cElem).parents().each(add);

            if (!cElem || !cElem.parentNode) {
              $(this).remove();
              continue;
            }
            if (elems.includes(cElem) || addThis) {
              var bb = svgCanvas.getStrokedBBox([cElem]);
              connections.push({
                elem: cElem,
                connector: this,
                is_start: i === 0,
                start_x: bb.x,
                start_y: bb.y
              });
            }
          }
        });
      }

      function updateConnectors(elems) {
        // Updates connector lines based on selected elements
        // Is not used on mousemove, as it runs getStrokedBBox every time,
        // which isn't necessary there.
        findConnectors(elems);
        if (connections.length) {
          // Update line with element
          var i = connections.length;
          while (i--) {
            var conn = connections[i];
            var line = conn.connector;
            var elem = conn.elem;

            // const sw = line.getAttribute('stroke-width') * 5;

            var pre = conn.is_start ? 'start' : 'end';

            // Update bbox for this element
            var bb = svgCanvas.getStrokedBBox([elem]);
            bb.x = conn.start_x;
            bb.y = conn.start_y;
            elData(line, pre + '_bb', bb);
            /* const addOffset = */
            elData(line, pre + '_off');

            var altPre = conn.is_start ? 'end' : 'start';

            // Get center pt of connected element
            var bb2 = elData(line, altPre + '_bb');
            var srcX = bb2.x + bb2.width / 2;
            var srcY = bb2.y + bb2.height / 2;

            // Set point of element being moved
            var pt = getBBintersect(srcX, srcY, bb, getOffset(pre, line));
            setPoint(line, conn.is_start ? 0 : 'end', pt.x, pt.y, true);

            // Set point of connected element
            var pt2 = getBBintersect(pt.x, pt.y, elData(line, altPre + '_bb'), getOffset(altPre, line));
            setPoint(line, conn.is_start ? 'end' : 0, pt2.x, pt2.y, true);

            // Update points attribute manually for webkit
            if (navigator.userAgent.includes('AppleWebKit')) {
              var pts = line.points;
              var len = pts.numberOfItems;
              var ptArr = [];
              for (var j = 0; j < len; j++) {
                pt = pts.getItem(j);
                ptArr[j] = pt.x + ',' + pt.y;
              }
              line.setAttribute('points', ptArr.join(' '));
            }
          }
        }
      }

      // Do on reset
      function init() {
        // Make sure all connectors have data set
        $(svgcontent).find('*').each(function () {
          var conn = this.getAttributeNS(seNs, 'connector');
          if (conn) {
            this.setAttribute('class', connSel.substr(1));
            var connData = conn.split(' ');
            var sbb = svgCanvas.getStrokedBBox([getElem(connData[0])]);
            var ebb = svgCanvas.getStrokedBBox([getElem(connData[1])]);
            $(this).data('c_start', connData[0]).data('c_end', connData[1]).data('start_bb', sbb).data('end_bb', ebb);
            svgCanvas.getEditorNS(true);
          }
        });
        // updateConnectors();
      }


      function setDirectionFromButton() {

        var val = 0;
        if (this.id == 'leftarrow') {
          val = 10;
        } else if (this.id == 'rightarrow') {
          val = 20;
        }

        let selElem = selElems[0];
        if (selElem) {
          selElem.setAttribute('Direction', val);
        }
      }
      //End utils  Functions



      return ret;
    }
  };


  return extWcsmapediter;

}());