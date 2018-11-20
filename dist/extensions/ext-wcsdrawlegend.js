var svgEditorExtension_wcsdrawlegend = (function () {
  'use strict';
  // /* globals jQuery */
  /*
   * ext-wcsdrawlegend.js
   *
   *
   * Copyright(c) 2010 CloudCanvas, Inc.
   * All rights reserved
   *
   */

  var wcsdrawlegend = {
    name: 'drawlegend',
    init(S) {
      // const $ = jQuery;
      const svgEditor = this;
      const svgCanvas = svgEditor.canvas;
      const getNextId = S.getNextId;

      const {
        lang
      } = svgEditor.curPrefs;

      // 多语言处理
      const langList = {
        en: [{
          id: 'drawlegend',
          title: 'Find shortest Path'
        }],
        zh_CN: [{
          id: 'drawlegend',
          title: '寻找最短路径'
        }]
      };

      return {
        name: 'drawlegend',
        svgicons: svgEditor.curConfig.extIconsPath + 'wcs-map-editer-icon.xml',
        buttons: [{
          id: 'drawlegend',
          type: 'mode',
          title: getTitle('drawlegend'),
          events: {
            click() {
              drawLegend();
            }
          }
        }]
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

      function drawLegend() {
        const group = svgCanvas.addSvgElementFromJson({
          element: 'g',
          attr: {
            id: svgCanvas.getNextId()
          }
        });

        const rect = svgCanvas.addSvgElementFromJson({
          element: 'rect',
          attr: {
            id: svgCanvas.getNextId(),
            fill: '#000000',
            'fill-opacity': 0,
            x: 1215,
            y: 269,
            height: 94,
            width: 308,
            stroke: '#000000'
          }
        });

        group.append(rect);

        let img = svgCanvas.addSvgElementFromJson({
          element: 'image',
          attr: {
            id: svgCanvas.getNextId(),
            height: '30', width: '48', x: '1225.88097',
            'xlink:href': 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEAYABgAAD/2wBDAAgGBgcGBQgHBwcJCQgKDBQNDAsLDBkSEw8UHRofHh0aHBwgJC4nICIsIxwcKDcpLDAxNDQ0Hyc5PTgyPC4zNDL/2wBDAQkJCQwLDBgNDRgyIRwhMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjL/wgARCAAwADADASIAAhEBAxEB/8QAGQABAAMBAQAAAAAAAAAAAAAAAAEDBAUG/8QAFgEBAQEAAAAAAAAAAAAAAAAAAAMC/9oADAMBAAIQAxAAAAH34AAIrnFKmxjT3ru5vSpgKzAA/8QAHRAAAgEEAwAAAAAAAAAAAAAAAQMTAAIEMBARFP/aAAgBAQABBQLYT0JV1KupV1Kvi+wMsGGsAYawBhrA8Kt3/8QAHhEAAgEDBQAAAAAAAAAAAAAAAQIAAxAREiAiMlH/2gAIAQMBAT8BugTHIzTR9jhB0Oz/xAAeEQACAQMFAAAAAAAAAAAAAAABAwACEBESICIyUf/aAAgBAgEBPwG9ZZniJqf5Flh7jZ//xAAeEAACAgICAwAAAAAAAAAAAAAAAgEhMpEwMRARM//aAAgBAQAGPwLk9yZrszXZmuz6LvxKz1JNtZNtZNtZ23N//8QAIBABAAICAgEFAAAAAAAAAAAAAREhAFExYTAQQXGB0f/aAAgBAQABPyHyAiAHu4JMV81wSYr5rgkxXzXB2BX4+kwfRgqV4bNjrrBUrw2bHXWCpXhs2OusAZl+z883/9oADAMBAAIAAwAAABDzzy07bzzz/8QAHBEAAQMFAAAAAAAAAAAAAAAAAQARYRAgQXGR/9oACAEDAQE/EKkuIDAwpPE1OHYs/8QAGxEAAgIDAQAAAAAAAAAAAAAAAREAQRAgUZH/2gAIAQIBAT8QyOgiFZuDh9jBQ4i9P//EACAQAQACAQQCAwAAAAAAAAAAAAERIQAxUXGBEDCRocH/2gAIAQEAAT8Q9gYWlSA7wZKDKKCQlvdDvBkoMooJCW90O8GSgyigkJb3Q7wEoMAIv34p/AModZ/MaYBmoNByGNMAzUGg5DGmAZqDQchhFRGYYn49z//Z',
            y: '276.45239'
          }
        });
        group.append(img);

        let text = svgCanvas.addSvgElementFromJson({
          element: 'text',
          attr: {
            id: svgCanvas.getNextId(),
            fill: '#000000', 'font-family': 'serif', 'font-size': '16', stroke: '#000000', 'stroke-dasharray': 'null', 'stroke-linecap': 'null',
            'stroke-linejoin': 'null', 'stroke-width': '0', 'text-anchor': 'middle', x: '1298.38097', y: '295.95239'
          }
        });
        text.append('路线');
        group.append(text);

        img = svgCanvas.addSvgElementFromJson({
          element: 'image',
          attr: {
            id: getNextId(), height: '30', width: '48', x: '1226.88097',
            'xlink:href': 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEAYABgAAD/2wBDAAgGBgcGBQgHBwcJCQgKDBQNDAsLDBkSEw8UHRofHh0aHBwgJC4nICIsIxwcKDcpLDAxNDQ0Hyc5PTgyPC4zNDL/2wBDAQkJCQwLDBgNDRgyIRwhMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjL/wgARCAAwADADASIAAhEBAxEB/8QAGAABAAMBAAAAAAAAAAAAAAAAAAMEBQb/xAAWAQEBAQAAAAAAAAAAAAAAAAAAAwL/2gAMAwEAAhADEAAAAe/AABHBPBGvOaeZp0no2qtrOgpgAD//xAAbEAADAQADAQAAAAAAAAAAAAACAwQBERQwAP/aAAgBAQABBQL0MxWPZTwVtdDZL8ckaVFvxgLB6yeCirnbJBiUjMod9f/EABwRAAEDBQAAAAAAAAAAAAAAABEAAiIQEhMgQv/aAAgBAwEBPwGrcQkSmgyT7ONP/8QAHREAAQQCAwAAAAAAAAAAAAAAEQACEyIDEBIgMf/aAAgBAgEBPwHb5TUBO5CvqxyC/T//xAAgEAABBAAHAQAAAAAAAAAAAAABAAIRIQMSFCIwYXEQ/9oACAEBAAY/AuSXGApz14n6UbG9InFpzTBUB9/IcJCjJXqfpTsd2iMW3OMlSGXzf//EACAQAQACAgAHAQAAAAAAAAAAAAEAESExMEFRYYGx8BD/2gAIAQEAAT8h4nRGJc9RBy+5Tw5oVO9yuoigab16YHvLBh/OqMSp7iLl9znhzQId7ldRFC0Vr2wPWGTLxv/aAAwDAQACAAMAAAAQ888qpV888//EAB0RAAIBBAMAAAAAAAAAAAAAABEhAAEQYcEgMYH/2gAIAQMBAT8QvqwAexJhjuPowyNcP//EAB0RAAIBBAMAAAAAAAAAAAAAABEhABAgMcFRYYH/2gAIAQIBAT8Qrtwk+R1OBxGFPR3Z/8QAIRABAAIBAgcBAAAAAAAAAAAAAREhADFhEDBBUYGRoXH/2gAIAQEAAT8Q5ke8lkW/wwJrJaainTd6wEgvdSEPdYaLx71gdCVATE/DfAuJgSl8nCPeaipfeTAmolroIdd3vLEK3UhB3SWy8O8YDQkAkTH02wLiZFofLzv/2Q==',
            y: '325.45239'
          }
        });
        group.append(img);

        text = svgCanvas.addSvgElementFromJson({
          element: 'text',
          attr: {
            id: svgCanvas.getNextId(),
            fill: '#000000', 'font-family': 'serif', 'font-size': '16', stroke: '#000000', 'stroke-dasharray': 'null', 'stroke-linecap': 'null',
            'stroke-linejoin': 'null', 'stroke-width': '0', 'text-anchor': 'middle', x: '1303.38097', y: '344.95239'
          }
        });
        text.append('地标点');
        group.append(text);

        img = svgCanvas.addSvgElementFromJson({
          element: 'image',
          attr: {
            id: getNextId(), height: '30', width: '48', x: '1346.88097',
            'xlink:href': 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEAYABgAAD/2wBDAAgGBgcGBQgHBwcJCQgKDBQNDAsLDBkSEw8UHRofHh0aHBwgJC4nICIsIxwcKDcpLDAxNDQ0Hyc5PTgyPC4zNDL/2wBDAQkJCQwLDBgNDRgyIRwhMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjL/wgARCAAwADADASIAAhEBAxEB/8QAGgABAAIDAQAAAAAAAAAAAAAAAAQFAQMGAv/EABgBAQEBAQEAAAAAAAAAAAAAAAMAAQQC/9oADAMBAAIQAxAAAAHvxQUFMYox97ZkaLyF0Ciu+t/QYoEncPATf//EAB4QAAICAgIDAAAAAAAAAAAAAAEDAgQQEhEwABMj/9oACAEBAAEFAu0kAG4yRRYDsnnWa7WlRq4pj9Lvqt+DnXEqapFa4qHR/8QAGhEAAgMBAQAAAAAAAAAAAAAAAREAAhADMf/aAAgBAwEBPwHa0YJcE6cxTwvFn//EABwRAAICAwEBAAAAAAAAAAAAAAECAxEAEBIxQf/aAAgBAgEBPwHcspTwXiyuOW6u/mRyF/VrSxIpsDX/xAAiEAACAQIFBQAAAAAAAAAAAAABEQACMQMQEjBxISMyYZL/2gAIAQEABj8C3WbTtYbESVWZV4dVTHM0moA+5qwrOeR+oHfN9RxFSNn/xAAdEAACAgIDAQAAAAAAAAAAAAABEQAhQVEQMGGx/9oACAEBAAE/Ie0jIgDJhDQ5IJ+R4SeOXANLRO5exNiA0Bktk452KBJFVmWyKAbWyN81O3aU3b96f//aAAwDAQACAAMAAAAQ888oI+8d8//EABwRAQABBAMAAAAAAAAAAAAAAAERABAhQTFRcf/aAAgBAwEBPxC4OgjTvypqZ5oAhl1YBm3/xAAdEQACAQQDAAAAAAAAAAAAAAABIRAAETFxQVGB/9oACAECAQE/EJEtQ4x7XKraLWqOEEs7ixeDH//EACAQAQABAwQDAQAAAAAAAAAAAAERACGBEDAxUUFhwdH/2gAIAQEAAT8Q3TXJI8BXc7UsdvhRccZZyJ2fmpJSMJIQsuaRHBJhUL8UpLQhcbJPNoMUiIJZBKCze3ugBHKcz+0SUBCQMLpnVvJKUIHCMYp/DrKbq9uz/9k=',
            y: '274.45239'
          }
        });
        group.append(img);

        text = svgCanvas.addSvgElementFromJson({
          element: 'text',
          attr: {
            id: svgCanvas.getNextId(),
            fill: '#000000', 'font-family': 'serif', 'font-size': '16', stroke: '#000000', 'stroke-dasharray': 'null', 'stroke-linecap': 'null', 'stroke-linejoin': 'null', 'stroke-width': '0', 'text-anchor': 'middle', x: '1465.38097', y: '294.95239'
          }
        });
        text.append('交通管制');
        group.append(text);

        img = svgCanvas.addSvgElementFromJson({
          element: 'image',
          attr: {
            id: getNextId(), height: '30', width: '48', x: '1346.88097',
            'xlink:href': 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEAYABgAAD/2wBDAAgGBgcGBQgHBwcJCQgKDBQNDAsLDBkSEw8UHRofHh0aHBwgJC4nICIsIxwcKDcpLDAxNDQ0Hyc5PTgyPC4zNDL/2wBDAQkJCQwLDBgNDRgyIRwhMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjL/wgARCAAwADADASIAAhEBAxEB/8QAGgABAQACAwAAAAAAAAAAAAAAAAQDBgECBf/EABgBAAMBAQAAAAAAAAAAAAAAAAACBQED/9oADAMBAAIQAxAAAAHfwAAAJqIUbxc8nShO2emKybT5HXnJlzNUMb//xAAeEAACAgICAwAAAAAAAAAAAAABAwIEERQTMAAFEP/aAAgBAQABBQLt2FYNy1ZZXvTDedWPCMiVWPBQtQqiUt72WtExAwPjaqXFalpj0f/EAB0RAAEEAgMAAAAAAAAAAAAAAAIBEBESADEhQlH/2gAIAQMBAT8BdKws7wT0VufMOnVqpMt//8QAHhEAAAYCAwAAAAAAAAAAAAAAAAECEBESEzEhQlH/2gAIAQIBAT8Bc72KNBSNlXj0IydmscQ3/8QAIxAAAgIBAwMFAAAAAAAAAAAAAQIAEQMEElEQMDETIkFhcf/aAAgBAQAGPwLu3vFQjSr7RPR1Q2tzL3jpR8R0QsN33HxZrU3xFOKwq/Mpndv0yh463kxgnmVjUKOz/8QAIRABAQACAAYDAQAAAAAAAAAAAREAITAxQVGBkRBx8KH/2gAIAQEAAT8h4igVYGbes0v76ycrrwvm6x12BM952gELgiUaYDhURMBGh85gX7W7eMhQgp0w3cZUqPN/c8AwgIHz6NEf5nfFE68H/9oADAMBAAIAAwAAABDzzxHWLw/z/8QAHREAAgEEAwAAAAAAAAAAAAAAAREhABBRYTFBcf/aAAgBAwEBPxC8s+Co/MJFHRzHXtAImXuwGkB5t//EABwRAQABBQEBAAAAAAAAAAAAAAERABAhQVFh8P/aAAgBAgEBPxC+Ij1NFBgBj1rO6aWIHnzZWRY5b//EACEQAQACAQMFAQEAAAAAAAAAAAERIQBBUWEwMYGRsaEQ/9oACAEBAAE/EOoiACVWAMgvuWIFmPr1iPWa9Giqp2+4Nse53omAVeiZflMRNLMfH1gICEiMiZPsLcDTlATUIJIJ4sneDbAgNzqDAKC6j9cCBCVAquFsHjGbzpYglVXd+ZHsLYBR/S8AxBWOVC46eGYbXK2+ej//2Q==',
            y: '321.45239'
          }
        });
        group.append(img);

        text = svgCanvas.addSvgElementFromJson({
          element: 'text',
          attr: {
            id: svgCanvas.getNextId(),
            fill: '#000000', 'font-family': 'serif', 'font-size': '16', stroke: '#000000', 'stroke-dasharray': 'null', 'stroke-linecap': 'null', 'stroke-linejoin': 'null', 'stroke-width': '0', 'text-anchor': 'middle', x: '1453.38097', y: '339.95239'
          }
        });
        text.append('充电点');
        group.append(text);

        svgEditor.clickSelect();
      }
    }
  };

  return wcsdrawlegend;
}());
