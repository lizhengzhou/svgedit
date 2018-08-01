/* globals jQuery */
/*
 * ext-wcspointmerge.js
 *
 *
 * Copyright(c) 2010 CloudCanvas, Inc.
 * All rights reserved
 *
 */
export default {
  name: 'wcspointmerge',
  init(S) {
    const svgEditor = this;
    const $ = jQuery;
    const svgCanvas = svgEditor.canvas;
    var seNs = svgCanvas.getEditorNS(true);
    let selElem;


    return {
      name: 'dot',
      svgicons: svgEditor.curConfig.extIconsPath + 'wcspointmerge-icon.xml',
      buttons: [{
        id: 'wcspointmerge',
        type: 'mode',
        title: 'Merge two Points',
        events: {
          click() {
            svgCanvas.setMode('wcspointmerge');
          }
        }
      }],

      mouseDown(opts) {
        if (svgCanvas.getMode() === 'wcspointmerge') {
          var mouseTarget = opts.event.target;
          if (mouseTarget && mouseTarget.tagName === 'circle' && mouseTarget.getAttribute('class') === 'point') {
            mouseTarget.setAttribute('fill', 'orange');
            selElem = mouseTarget;
          }
        }
        return {
          started: true
        };
      },

      mouseUp(opts) {
        if (svgCanvas.getMode() === 'wcspointmerge') {
          var mouseTarget = opts.event.target;
          if (mouseTarget && mouseTarget.tagName === 'circle' && mouseTarget.getAttribute('class') === 'point') {
            if (selElem && selElem != mouseTarget) {
              mergePoint(selElem, mouseTarget);
            }
          }

          if (selElem) {
            selElem.setAttribute('fill', 'white');
          }

          return {
            keep: true
          };
        }
      }

    };



    function mergePoint(selElem, mouseTarget) {
      // $.alert('123');
      var routers = $(svgcontent).find('.route');
      var route, pos;
      routers.each(function () {
        var points = this.getAttributeNS(seNs, 'route').split(' ');
        if (points[0] == selElem.id || points[1] == selElem.id) {
          route = this;
          if (points[0] == selElem.id) pos = 'start';
          else if (points[1] == selElem.id) pos = 'end';
        }
      });

      if (route) {
        var points = route.getAttributeNS(seNs, 'route').split(' ');

        var cx = mouseTarget.getAttribute('cx'),
          cy = mouseTarget.getAttribute('cy');

        if (pos == 'start') {
          points[0] = mouseTarget.id;

          var move = route.pathSegList.getItem(0);
          move.x = cx;
          move.y = cy;

        } else if (pos == 'end') {
          points[1] = mouseTarget.id;

          var curve = route.pathSegList.getItem(1);
          curve.x = cx;
          curve.y = cy;
        }

        route.setAttributeNS(seNs, 'se:route', points.join(' '));

        selElem.remove();
      }
    }


  }
};