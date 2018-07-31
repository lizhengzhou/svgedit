/* globals jQuery */
/*
 * ext-dot.js
 *
 *
 * Copyright(c) 2010 CloudCanvas, Inc.
 * All rights reserved
 *
 */
export default {
  name: 'dot',
  init (S) {
    const svgEditor = this;
    const $ = jQuery;
    const svgCanvas = svgEditor.canvas;

    let // {svgcontent} = S,
      selElems,
      // editingitex = false,
      // svgdoc = S.svgroot.parentNode.ownerDocument,
      started,
      newFO;
      // edg = 0,
      // newFOG, newFOGParent, newDef, newImageName, newMaskID,
      // undoCommand = 'Not image',
      // modeChangeG, ccZoom, wEl, hEl, wOffset, hOffset, ccRgbEl, brushW, brushH;

    function showPanel (on) {
      let fcRules = $('#fc_rules');
      if (!fcRules.length) {
        fcRules = $('<style id="fc_rules"></style>').appendTo('head');
      }
      fcRules.text(!on ? '' : ' #tool_topath { display: none !important; }');
      $('#dot_panel').toggle(on);
    }

    /*
    function toggleSourceButtons(on){
      $('#star_save, #star_cancel').toggle(on);
    }
    */

    function setAttr (attr, val) {
      svgCanvas.changeSelectedAttribute(attr, val);
      S.call('changed', selElems);
    }

    /*
    function cot(n){
      return 1 / Math.tan(n);
    }

    function sec(n){
      return 1 / Math.cos(n);
    }
    */

    return {
      name: 'dot',
      svgicons: svgEditor.curConfig.extIconsPath + 'dot-icon.xml',
      buttons: [{
        id: 'dot',
        type: 'mode',
        title: 'Dot',
        position: '5',
        events: {
          click () {
            showPanel(true);
            svgCanvas.setMode('dot');
          }
        }
      }],

      mouseDown (opts) {
        const rgb = svgCanvas.getColor('fill');
        // const ccRgbEl = rgb.substring(1, rgb.length);
        const sRgb = svgCanvas.getColor('stroke');
        // const ccSRgbEl = sRgb.substring(1, rgb.length);
        const sWidth = svgCanvas.getStrokeWidth();

        if (svgCanvas.getMode() === 'dot') {
          started = true;
          const x = opts.start_x;
          const y = opts.start_y;
  
          newFO = S.addSvgElementFromJson({
            element: 'circle',
            attr: {
              cx: x,
              cy: y,
              r: 8,
              stroke: '#00ffff',
              'stroke-width': 4,
              fill: '#fff',
              'class': 'point'
            }
          });
          return {
            started: true
          };
        }
      },

      mouseUp () {
        if (svgCanvas.getMode() === 'dot') {
          const attrs = $(newFO).attr(['r']);
          // svgCanvas.addToSelection([newFO], true);
          return {
            keep: (attrs.r !== '0'),
            element: newFO
          };
        }
      },
      selectedChanged (opts) {
        // Use this to update the current selected elements
        selElems = opts.elems;

        let i = selElems.length;
        while (i--) {
          const elem = selElems[i];
          if (elem && elem.getAttributeNS(null, 'shape') === 'dot') {
            if (opts.selectedElement && !opts.multiselected) {
              // $('#starRadiusMulitplier').val(elem.getAttribute('r2'));
              $('#dotNumPoints').val(elem.getAttribute('point'));
              $('#radialShift').val(elem.getAttribute('radialshift'));
              showPanel(true);
            } else {
              showPanel(false);
            }
          } else {
            showPanel(false);
          }
        }
      },
      elementChanged (opts) {
        // const elem = opts.elems[0];
      }
      
    };
  }
};
