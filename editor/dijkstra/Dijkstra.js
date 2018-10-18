export default class Dijkstra {
  constructor (map) {
    this.map = map;
  }

  extractKeys (obj) {
    const keys = []; let key;
    for (key in obj) {
      Object.prototype.hasOwnProperty.call(obj, key) && keys.push(key);
    }
    return keys;
  }

  sorter (a, b) {
    return parseFloat(a) - parseFloat(b);
  }

  findPaths (map, start, end, infinity) {
    infinity = infinity || Infinity;

    const costs = {},
      open = {0: [start]},
      predecessors = {};
    let keys;

    const addToOpen = function (cost, vertex) {
      const key = '' + cost;
      if (!open[key]) open[key] = [];
      open[key].push(vertex);
    };

    costs[start] = 0;

    while (true) {
      if (!(keys = this.extractKeys(open)).length) break;

      keys.sort(this.sorter);

      const key = keys[0],
        bucket = open[key],
        node = bucket.shift(),
        currentCost = parseFloat(key),
        adjacentNodes = map[node] || {};

      if (!bucket.length) delete open[key];

      for (const vertex in adjacentNodes) {
        if (Object.prototype.hasOwnProperty.call(adjacentNodes, vertex)) {
          const cost = adjacentNodes[vertex],
            totalCost = cost + currentCost,
            vertexCost = costs[vertex];

          if ((vertexCost === undefined) || (vertexCost > totalCost)) {
            costs[vertex] = totalCost;
            addToOpen(totalCost, vertex);
            predecessors[vertex] = node;
          }
        }
      }
    }

    if (costs[end] === undefined) {
      return null;
    } else {
      return predecessors;
    }
  }

  extractShortest (predecessors, end) {
    const nodes = [];
    let u = end;

    while (u !== undefined) {
      nodes.push(u);
      u = predecessors[u];
    }

    nodes.reverse();
    return nodes;
  }

  findShortestPathInner (map, nodes) {
    let start = nodes.shift(),
      end,
      predecessors,
      shortest;
    const path = [];

    while (nodes.length) {
      end = nodes.shift();
      predecessors = this.findPaths(map, start, end);

      if (predecessors) {
        shortest = this.extractShortest(predecessors, end);
        if (nodes.length) {
          path.push.apply(path, shortest.slice(0, -1));
        } else {
          return path.concat(shortest);
        }
      } else {
        return null;
      }

      start = end;
    }
  }

  toArray (list, offset) {
    try {
      return Array.prototype.slice.call(list, offset);
    } catch (e) {
      const a = [];
      for (let i = offset || 0, l = list.length; i < l; ++i) {
        a.push(list[i]);
      }
      return a;
    }
  }

  findShortestPath (start, end) {
    if (Object.prototype.toString.call(start) === '[object Array]') {
      return this.findShortestPathInner(this.map, start);
    } else if (arguments.length === 2) {
      return this.findShortestPathInner(this.map, [start, end]);
    } else {
      return this.findShortestPathInner(this.map, this.toArray(arguments));
    }
  }
}
