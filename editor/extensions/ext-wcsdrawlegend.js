// /* globals jQuery */
/*
 * ext-wcsdrawlegend.js
 *
 *
 * Copyright(c) 2010 CloudCanvas, Inc.
 * All rights reserved
 *
 */

export default {
  name: 'drawlegend',
  init (S) {
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
          click () {
            drawLegend();
          }
        }
      }]
    };

    /**
     * 获取多语言标题
     */
    function getTitle (id, curLang = lang) {
      const list = langList[lang];
      for (const i in list) {
        if (list.hasOwnProperty(i) && list[i].id === id) {
          return list[i].title;
        }
      }
      return id;
    }

    function drawLegend () {
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
          height: '20', width: '50', x: '1225.88097', 'xlink:href': 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEAYABgAAD/2wBDAAgGBgcGBQgHBwcJCQgKDBQNDAsLDBkSEw8UHRofHh0aHBwgJC4nICIsIxwcKDcpLDAxNDQ0Hyc5PTgyPC4zNDL/2wBDAQkJCQwLDBgNDRgyIRwhMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjL/wgARCAAKACcDASIAAhEBAxEB/8QAFwABAQEBAAAAAAAAAAAAAAAAAAQDBv/EABYBAQEBAAAAAAAAAAAAAAAAAAADAf/aAAwDAQACEAMQAAAB7FQmnUDNopn/xAAYEAEBAAMAAAAAAAAAAAAAAAAAIwISIP/aAAgBAQABBQKqqqrHbr//xAAWEQEBAQAAAAAAAAAAAAAAAAASABD/2gAIAQMBAT8BUs//xAAYEQACAwAAAAAAAAAAAAAAAAAAARETYv/aAAgBAgEBPwGrTKtMShQf/8QAGhAAAwADAQAAAAAAAAAAAAAAAAIxESAigf/aAAgBAQAGPwKKRSKRTrHm3//EABoQAAMBAAMAAAAAAAAAAAAAAAABEeEgMWH/2gAIAQEAAT8hull0sull0s7Z8cn/2gAMAwEAAgADAAAAEMcQP//EABcRAQEBAQAAAAAAAAAAAAAAAAEAEXH/2gAIAQMBAT8Q4Lgl12//xAAaEQACAwEBAAAAAAAAAAAAAAAAEQHR4TFx/9oACAECAQE/EG0ihtIo7R+n/8QAGRAAAgMBAAAAAAAAAAAAAAAAAREgITFx/9oACAEBAAE/EIKKKKGdDlhPW5f/2Q==', y: '276.45239'
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
          id: getNextId(), height: '20', width: '50', x: '1226.88097',
          'xlink:href': 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEAYABgAAD/2wBDAAgGBgcGBQgHBwcJCQgKDBQNDAsLDBkSEw8UHRofHh0aHBwgJC4nICIsIxwcKDcpLDAxNDQ0Hyc5PTgyPC4zNDL/2wBDAQkJCQwLDBgNDRgyIRwhMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjL/wgARCAATAC8DASIAAhEBAxEB/8QAGQABAQEAAwAAAAAAAAAAAAAAAAMBBAUG/8QAFwEAAwEAAAAAAAAAAAAAAAAAAAEDAv/aAAwDAQACEAMQAAAB9yyGVVwVZdihedcGkAAH/8QAGxABAAICAwAAAAAAAAAAAAAAAgEDABAREjD/2gAIAQEAAQUC0lBgouN9bMcSbDEu7izw/8QAGBEAAwEBAAAAAAAAAAAAAAAAAAESICL/2gAIAQMBAT8BSL7keP/EABsRAAICAwEAAAAAAAAAAAAAAAIRAAESIEEj/9oACAECAQE/ASK644vPNQSfNP/EACIQAAICAAQHAAAAAAAAAAAAAAECABEDECIyIDAxUWGRof/aAAgBAQAGPwLK2NCWpBHBv+RGxNaDxGfC0JXbrN49cj//xAAdEAACAQQDAAAAAAAAAAAAAAABEQAhMVFhECAw/9oACAEBAAE/IeEcZCZtBAPTTm9EGBYcqVhABW9lQODIPB//2gAMAwEAAgADAAAAED6gf/8A/wD/xAAbEQADAAIDAAAAAAAAAAAAAAABETEAQSBxkf/aAAgBAwEBPxABpXuEhJNbcb61gAQvh//EAB0RAAIBBAMAAAAAAAAAAAAAAAERMQAhccEgQVH/2gAIAQIBAT8QUosFsig1w1FvUpnuaINyGVonh//EAB0QAQADAAIDAQAAAAAAAAAAAAEAESExQTBhkfH/2gAIAQEAAT8QyZFhdzSJ13LUTJkbqfhoc6/V3GIc9/YVSg5BrhesuGYg6Zs++D//2Q==',
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
          id: getNextId(), height: '29', width: '63', x: '1346.88097',
          'xlink:href': 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEAYABgAAD/2wBDAAgGBgcGBQgHBwcJCQgKDBQNDAsLDBkSEw8UHRofHh0aHBwgJC4nICIsIxwcKDcpLDAxNDQ0Hyc5PTgyPC4zNDL/2wBDAQkJCQwLDBgNDRgyIRwhMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjL/wgARCAAiACIDASIAAhEBAxEB/8QAGgABAQADAQEAAAAAAAAAAAAAAAUBAwQCBv/EABkBAQEBAAMAAAAAAAAAAAAAAAABAwIEBf/aAAwDAQACEAMQAAAB+2j1Yk8/dZhW12Dl3Uzs4pl6pS+03i6sFMgEf//EAB4QAAMAAQQDAAAAAAAAAAAAAAECAwQAEBESEyAj/9oACAEBAAEFAmPVSz1IZ56B5GqDtOFBN70FHQdU2yccMMaAQbMXBc/VCfIhcn2//8QAGxEBAAEFAQAAAAAAAAAAAAAAAgQAAQMQIjL/2gAIAQMBAT8BlLsleairtE+dSAVj6qOCcfOr1bX/xAAYEQADAQEAAAAAAAAAAAAAAAABAhASAP/aAAgBAgEBPwE8sQhnzznL5gv/xAAjEAABAwIFBQAAAAAAAAAAAAACAAERECIDEhMhQSAjMWHB/9oACAEBAAY/AndO/CYuFNCZlcoHyhb1XOOxLOW5VtGUOuMYf1HoN21cMdf/xAAfEAEBAAIBBAMAAAAAAAAAAAABEQAxECFRYXFBkbH/2gAIAQEAAT8hFHQXOqCPozelz04RjSXh9qTpkSI3fbBAWpb+Y6uwHLKAb84KgmvHM4I73KKQD5PbCJVydr8zOjITd5Skck1z/9oADAMBAAIAAwAAABC7IM44NyAP/8QAGxEAAgIDAQAAAAAAAAAAAAAAAREAMRBBYbH/2gAIAQMBAT8QUYRXANWFYKAhBW67xQECAe9e3ihlBj//xAAbEQABBQEBAAAAAAAAAAAAAAABABARIUExUf/aAAgBAgEBPxATFIDFtWp3DniDROZ6Jtuket//xAAgEAEAAgICAgMBAAAAAAAAAAABABEhMRBhUXFBgZHR/9oACAEBAAE/ENiKUsyrFC6AWvwlbWNF3Ql1nTTNIyH3xtw4PLLa8CymiUnt+osUhQkWgoeLN/OJsIR7rjERPIFaD/Y5AWjYeu5iYmEt7EzHp4i3pYdXuGZ6x7xMaiUy0AOf3kEAR2JAAAAaDn//2Q==', y: '274.45239'
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
          id: getNextId(), height: '41', width: '41', x: '1356.88097',
          'xlink:href': 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEAYABgAAD/2wBDAAgGBgcGBQgHBwcJCQgKDBQNDAsLDBkSEw8UHRofHh0aHBwgJC4nICIsIxwcKDcpLDAxNDQ0Hyc5PTgyPC4zNDL/2wBDAQkJCQwLDBgNDRgyIRwhMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjL/wgARCAApACkDASIAAhEBAxEB/8QAGgAAAgMBAQAAAAAAAAAAAAAAAAIDBAUBBv/EABgBAQEBAQEAAAAAAAAAAAAAAAIEAQMF/9oADAMBAAIQAxAAAAH3PO0uevNVgio1QPSkIJlCxLnbcneYVrp1TPDtiWkMaT5QV//EAB4QAAICAgMBAQAAAAAAAAAAAAECAAMQERITMSAw/9oACAEBAAEFAp5O4RWDfF50KQCqHVubU5rspKKznychGPYyWI67BwQDOCTrsSJSiIFA/D//xAAdEQACAQQDAAAAAAAAAAAAAAABAhEAAxASBDFB/9oACAEDAQE/Aba7NFGypkDzCkgyKblhxqveJNKupkY//8QAHxEAAgEEAgMAAAAAAAAAAAAAAQIAAxESMQQQEyFB/9oACAECAQE/Aa1TxoWicmoMS2j04Vhi0p8E02yc+vkveFFOxGOQsYABqf/EACMQAAEDAwMFAQAAAAAAAAAAAAEAAhEgITEDEBIwMkFRYYH/2gAIAQEABj8C2wrUAImRKEXo+otXM/lGQpbpcw3JlBwKztcLtCcNJzQ13vwg2JVgOh//xAAhEAEAAgEDBAMAAAAAAAAAAAABABExIUFhECBx8TBRsf/aAAgBAQABPyGKC3EbdEwf8dj7AzGIaXtKcsqvs0fZifWl0ZeNE2dVMkJ7aXd41oL45gkATdhiB8PQWgfM9XBaAXQy4lANN0zE7E8Hwf/aAAwDAQACAAMAAAAQHpDFwASiD//EABwRAQACAwADAAAAAAAAAAAAAAEAESExURBxgf/aAAgBAwEBPxCm7hWz4BtxKe5bx8x2Im4EUMGwb9xVyz//xAAdEQEAAgICAwAAAAAAAAAAAAABABEhURBxMYHB/9oACAECAQE/EMC3UTWK+NcNUwzK8NvedfYAWMQsF6mKxOiAUKn/xAAgEAEAAgIBBQEBAAAAAAAAAAABABEhMWEQQVFx8SAw/9oACAEBAAE/EMR64DKsNQDzdRwrJtbJiY6GZpFeajjtoOdO6kqBDjaRx+MNaS3zESD7zXiIIo2d+ep1keVqfES9vBHcbBWksN2ABOEjVNbqyYhISNgLnyMViVrVttN+mHqtpMq7rHykVYGP4f/Z',
          y: '315.45239'
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
