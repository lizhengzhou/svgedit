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
  
  var extWcsmapediter =  {
    name: 'Wcs Map Editer',
    init (S) {
      var $ = jQuery;
      var svgEditor = this;
      var svgCanvas = svgEditor.canvas;
      var svgroot = S.svgroot,
          getNextId = S.getNextId,
          getElem = S.getElem,
          addElem = S.addSvgElementFromJson,
          selManager = S.selectorManager,
          connSel = '.se_connector',
          elData = $.data;
      var startX = void 0,
          startY = void 0,
          curLine = void 0,
          startElem = void 0,
          endElem = void 0,
          seNs = void 0,
          svgcontent = S.svgcontent,
          started = false,
          connections = [],
          selElems = [];
  
      var setHref = function setHref(elem, val) {
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
  
      
      function getOffset(side, line) {
        var giveOffset = !!line.getAttribute('marker-' + side);
        // const giveOffset = $(line).data(side+'_off');
  
        // TODO: Make this number (5) be based on marker width/height
        var size = line.getAttribute('stroke-width') * 5;
        return giveOffset ? size : 0;
      }
  
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
  
  
  
  
      return {
        name: 'Wcs Map Editer',
        // For more notes on how to make an icon file, see the source of
        // the helloworld-icon.xml
        svgicons: svgEditor.curConfig.extIconsPath + 'line-horizontal-icon.xml',
  
        // Multiple buttons can be added in this array
        buttons: [{
          // Must match the icon ID in helloworld-icon.xml
          id: 'line_horizontal',
  
          // This indicates that the button will be added to the "mode"
          // button panel on the left side
          type: 'mode',
  
          // Tooltip text
          title: "mode_lineH",
  
          // Events
          events: {
            click () {
              // The action taken when the button is clicked on.
              // For "mode" buttons, any other button will
              // automatically be de-pressed.
              svgCanvas.setMode('line_horizontal');
            }
          }
        }],
        // This is triggered when the main mouse button is pressed down
        // on the editor canvas (not the tool panels)
        mouseDown () {
          // Check the mode on mousedown
          if (svgCanvas.getMode() === 'line_horizontal') {
            // The returned object must include "started" with
            // a value of true in order for mouseUp to be triggered
            return {started: true};
          }
        },
  
        // This is triggered from anywhere, but "started" must have been set
        // to true (see above). Note that "opts" is an object with event info
        mouseUp (opts) {
          // Check the mode on mouseup
          if (svgCanvas.getMode() === 'line_horizontal') {
            const zoom = svgCanvas.getZoom();
  
            // Get the actual coordinate by dividing by the zoom value
            const x = opts.mouse_x / zoom;
            const y = opts.mouse_y / zoom;
  
            const text = 'Hello World!\n\nYou clicked here: ' +
              x + ', ' + y;
  
            // Show the text using the custom alert function
            //$.alert(text);
  
            //svgdoc = S.svgroot.parentNode.ownerDocument,
  
            // S.addSvgElementFromJson("hellp ");
  
            //  S.addSvgElementFromJson({
            //   element: 'text',
            //   curStyles: true,
            //   attr: {
            //     x: x,
            //     y: y,
            //     id: S.getNextId(),
            //     fill: curText.fill,
            //     'stroke-width': curText.stroke_width,
            //     'font-size': curText.font_size,
            //     'font-family': curText.font_family,
            //     'text-anchor': 'middle',
            //     'xml:space': 'preserve',
            //     opacity: curShape.opacity
            //   }
            // });
  
           /*    S.addSvgElementFromJson({
                element: 'rect',
                curStyles: true,
                attr: {
                  x: x,
                  y: y,
                  width: 100,
                  height: 100,
                  id: S.getNextId(),
                  fill:'red'
                }
              }); */
  
              var image1 = S.addSvgElementFromJson({
                element: 'image',
                attr: {
                  x: x,
                  y: y,
                  width:16,
                  height: 16,
                  id: S.getNextId(),
                  //opacity: curShape.opacity / 2,
                  style: 'pointer-events:inherit'
                }
              });
              setHref(image1, 'data:image/png;svgedit_url=images%2Ficon-dot.png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAABWElEQVQ4T62TOyxDURjHf6eNLk0tDAYdmEQl1YHdY2jjMXYxVWrwGDAjEeaWoRaNWixGKulA7Qw0cTGJxGJgoYg27ZHj5l63xfU82/l/3/fL9xRUvzXZioMokhDQ9GqWXOAgQ5kkw+LUGiLMz6Z08UAMGAUc78C6UAZWcTNFWDwpQQeo4Ed2kPR+ElgtZ3ETIiwKOiAlE8CY4dXvhWkfdNTpyuEtxDRIX1VwEkTEhGBd+pDkAKcyzwdgzv9xHos5mD0ybSUEfkFKxoFJJfc1QvqLIgb3YPstkyUFOANaFCAbhK4G+y7sX0N3xvQ5V4BnwKWkuyHw1NgD7otQu2H6FH4MyBfBYwAE+b+WoFU0ccALWz32JVQ1cVmQlG04OTbGuBCAme+OsUS77SJ11uvZHNxAXKsYn5JXiIjxf1pl4x5+fUzWvumrPQIEgWagAFwCu5RIEhUnVvcX53+ADevpyPcAAAAASUVORK5CYII=');
              //S.preventClickDefault(image1);
  
              
              var image2 = S.addSvgElementFromJson({
                element: 'image',
                attr: {
                  x: x+100,
                  y: y,
                  width: 16,
                  height: 16,
                  id: S.getNextId(),
                  //opacity: curShape.opacity / 2,
                  style: 'pointer-events:inherit'
                }
              });
              setHref(image2, 'data:image/png;svgedit_url=images%2Ficon-dot.png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAABWElEQVQ4T62TOyxDURjHf6eNLk0tDAYdmEQl1YHdY2jjMXYxVWrwGDAjEeaWoRaNWixGKulA7Qw0cTGJxGJgoYg27ZHj5l63xfU82/l/3/fL9xRUvzXZioMokhDQ9GqWXOAgQ5kkw+LUGiLMz6Z08UAMGAUc78C6UAZWcTNFWDwpQQeo4Ed2kPR+ElgtZ3ETIiwKOiAlE8CY4dXvhWkfdNTpyuEtxDRIX1VwEkTEhGBd+pDkAKcyzwdgzv9xHos5mD0ybSUEfkFKxoFJJfc1QvqLIgb3YPstkyUFOANaFCAbhK4G+y7sX0N3xvQ5V4BnwKWkuyHw1NgD7otQu2H6FH4MyBfBYwAE+b+WoFU0ccALWz32JVQ1cVmQlG04OTbGuBCAme+OsUS77SJ11uvZHNxAXKsYn5JXiIjxf1pl4x5+fUzWvumrPQIEgWagAFwCu5RIEhUnVvcX53+ADevpyPcAAAAASUVORK5CYII=');
              //S.preventClickDefault(image2);
            
              // var dAttr=(x+16)+','+y+' '+(x+100)+','+y+' ';
              // S.addSvgElementFromJson({
              //   element: 'polyline',
              //   curStyles: true,
              //   attr: {
              //     points: dAttr,
              //     id: S.getNextId(),
              //     fill: 'none',
              //     //opacity: curShape.opacity / 2,
              //     'stroke-linecap': 'round',
              //     style: 'pointer-events:none',
              //     stroke:"#000000", 
              //     'stroke-width':'5'
              //   }
              // });
  
  
              startX = opts.mouse_x;
              startY = opts.mouse_y;
  
              var initStroke = svgEditor.curConfig.initStroke;
  
              var bb = svgCanvas.getStrokedBBox([image1]);
              var bx = bb.x + bb.width / 2;
              var by = bb.y + bb.height / 2;
  
              curLine = addElem({
                element: 'polyline',
                attr: {
                  id: getNextId(),
                  points: bx + ',' + by + ' ' + bx + ',' + by + ' ' + startX + ',' + startY,
                  stroke: '#' + initStroke.color,
                  'stroke-width': initStroke.width,
                  fill: 'none',
                  opacity: initStroke.opacity,
                  style: 'pointer-events:none'
                }
              });
              elData(curLine, 'start_bb', bb);
  
              startElem=image1;
              
              endElem = image2;
  
              var startId = startElem.id,
                  endId = endElem.id;
              var connStr = startId + ' ' + endId;
              var altStr = endId + ' ' + startId;
  
              var bb = svgCanvas.getStrokedBBox([endElem]);
  
              var pt = getBBintersect(startX, startY, bb, getOffset('start', curLine));
              setPoint(curLine, 'end', pt.x, pt.y, true);
              $(curLine).data('c_start', startId).data('c_end', endId).data('end_bb', bb);
              seNs = svgCanvas.getEditorNS(true);
              curLine.setAttributeNS(seNs, 'se:connector', connStr);
              curLine.setAttribute('class', connSel.substr(1));
              curLine.setAttribute('opacity', 1);
              svgCanvas.addToSelection([curLine]);
              svgCanvas.moveToBottomSelectedElement();
              selManager.requestSelector(curLine).showGrips(false);
  
  
          }
        }
      };
    }
  };
  
  
  return extWcsmapediter;
  
  }());