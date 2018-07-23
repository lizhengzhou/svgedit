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
        connSel = '.se_connector';



      return {
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
          title: "mode_lineH",
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
          // Tooltip text
          title: "mode_lineV",
          // Events
          events: {
            click() {
              // The action taken when the button is clicked on.
              // For "mode" buttons, any other button will
              // automatically be de-pressed.
              svgCanvas.setMode('line_vertical');
            }
          }
        }],
        // This is triggered when the main mouse button is pressed down
        // on the editor canvas (not the tool panels)
        mouseDown(opts) {
          // Check the mode on mousedown
          if (svgCanvas.getMode() === 'line_horizontal') {
            // The returned object must include "started" with
            // a value of true in order for mouseUp to be triggered
            //horizontal line
            drawLine(opts);
            //return {started: true};
          } else if (svgCanvas.getMode() === 'line_vertical') {
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
        }
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
            style: 'pointer-events:none'
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
        svgCanvas.addToSelection([startElem, curLine, endElem]);

        return {
          keep: true
        };
      }
      // End draw functions



      //utils  Functions

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

      //get Offset by elem¡®s Width
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
      //End utils  Functions



    }
  };


  return extWcsmapediter;

}());