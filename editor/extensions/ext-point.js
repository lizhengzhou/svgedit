/* globals jQuery */
/*
 * ext-point.js
 *
 *
 * Copyright(c) 2010 CloudCanvas, Inc.
 * All rights reserved
 *
 */
export default {
  name: 'point',
  init (S) {
    const $ = jQuery;
    const svgEditor = this;
    const svgCanvas = svgEditor.canvas,
      addElem = S.addSvgElementFromJson;
    const seNs = svgCanvas.getEditorNS(true);
    const getNextId = S.getNextId,
      getElem = S.getElem;
    const svgUtils = svgCanvas.getPrivateMethods();
    const assignAttributes = svgCanvas.assignAttributes;
    let svgcontent = S.svgcontent;
    const {curConfig: {initStroke}} = svgEditor;

    //  导入undo/redo
    const {
      // MoveElementCommand,
      InsertElementCommand,
      // RemoveElementCommand,
      ChangeElementCommand,
      BatchCommand
      // UndoManager,
      // HistoryEventTypes
    } = svgUtils;

    const {
      lang
    } = svgEditor.curPrefs;

    // 多语言处理
    const langList = {
      en: [{
        id: 'point',
        title: 'Draw a Point'
      },
      {
        id: 'point_IsControl',
        title: 'Draw a Control Point'
      },
      {
        id: 'point_IsCharge',
        title: 'Draw a Charge Point'
      }],
      zh_CN: [{
        id: 'point',
        title: '增加地标点'
      },
      {
        id: 'point_IsControl',
        title: '增加交通管制点'
      },
      {
        id: 'point_IsCharge',
        title: '增加充电点'
      },
      {
        id: 'point_IsDefault',
        title: '默认点'
      },
      {
        id: 'point_IsMaterial',
        title: '物料点'
      }]
    };

    const imgSrc = {
      IsControl: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACIAAAAqCAYAAADWFImvAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyZpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNi1jMTM4IDc5LjE1OTgyNCwgMjAxNi8wOS8xNC0wMTowOTowMSAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIDIwMTcgKFdpbmRvd3MpIiB4bXBNTTpJbnN0YW5jZUlEPSJ4bXAuaWlkOjQ2REU3N0M3NjQ5ODExRThCRUE4REU0OEE1NEY2OEVGIiB4bXBNTTpEb2N1bWVudElEPSJ4bXAuZGlkOjQ2REU3N0M4NjQ5ODExRThCRUE4REU0OEE1NEY2OEVGIj4gPHhtcE1NOkRlcml2ZWRGcm9tIHN0UmVmOmluc3RhbmNlSUQ9InhtcC5paWQ6NDZERTc3QzU2NDk4MTFFOEJFQThERTQ4QTU0RjY4RUYiIHN0UmVmOmRvY3VtZW50SUQ9InhtcC5kaWQ6NDZERTc3QzY2NDk4MTFFOEJFQThERTQ4QTU0RjY4RUYiLz4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz5FRvNLAAAE5ElEQVR42rxYW0xcVRRdM8wDoYMF6hQBU9raArE+qjb6gdhotEDRaPxpjak1rbVtam2iadQPI40mStKf8mH5qnyAxg8TTVuBtNg6xrfU1hJRg0yFAsOzDAzMZZi57n3mDEzb4T5gxn2ycu6957HX7HP2PvuM5dnBRpgQN6GK8ChhA6GIkCXb/AQv4TLhPKGZMKA34ee3PS9qW8QYgUcIhwkVPGaBPiskHiTsJIQJXxFqCR49BbaIqtm+hnCMsBXmJY1QLXGKcJDwjwaRBZlsJxyPM/1SZKu06j5CU2IiiQe+Q6hBcoV/EG/IOwlHbiISvtkib6eARLzUyP3zvtYe2X5jhxTJe3K/fJLIIqsJ9fj/hHX9QOjmFyvvEYk6givuPdVgXXUxVpay3gauy4z4eoqk3FOwwxNbmsNmRjosaah3V6LYlkOxk4JnTw/5AjlDTg5+U3w4MNRCv1g1Ot0bbAQrbVY3oZI3rVEUpLlQbM8VJMZ3vQjlsc24tm8XMDqK+5wrkWvNgIn5qh7uaXCzRao0wraQnVl3Y5nVIZ7blQEMzk5FGzo7kfH1N7AHFQrmrUBvr7AKW+Oh9Hzc78wT3SYjM/jY//uCQZXPLyIiDjBNWWVfjurMtdFTL5CJE+Ny0nXroFQ8AfVMG0KVFXAWForPNCcqMtaiMnONeD8Z6BLfNGQzW2SDHpF3h79Foc1FZneLlZ9b/4ICLGugYOn1wsEksrPFZz42Ynrbgz4xPqxqMrmL3bdIz9UUNYKDg2fxb8gfVTTncxy4+4F7/qQlGaF3y3Xt3P/QUJsYr6NjNVvEZWRrD89OY4+vFaWOXMwflL2YjjyOdEsfKbsd6dYz9K1ULMPZwBUcG2sX4wyIi/eIxaifdc/4BdY7suWXX0h5H02gwmkhy+AnQYS94eRkt6lgwmnABNW5Wp22ZZUgS3rNBWUQ/rAiWzYiHFmPNMtfUNVVsFg3ze2RB9JXYqPTHU3dyGs+9XdqqZjgpenWI1KWUYAtmUXi+cuJLnw0dlG2FMFm/ZnqS7Q9VlGdL71GxTZXCZ52RT2tJeBF4/gfWiq8HNA69ILOof5z6FBGxAhVIvqswocpOrlsVNv56JIWme9zKTgsxuvouGwNQz1HgBYm1RBe6mtB/2xAKA9LNdNUDgQ/QPnMM3ht+qh4h3RvLtx/d3+rGK+j4zznI5zgzupF16uhAF642ox7nSsQy2EmqLRbv0PI4cOvyvdQqNxChds9U32oG70oxukI6z7Ne8QnU/9qvREdwRGBO+xRj19O5UPbm6gPNWG/fQcyqbA1eHM2Xus06jDNA8V7fLEMrdYIkZhcmZnA/r42lDpz8NytT+IpexX98mkcH+vAheAQRmcVM55bK5NnwcQjU37D14bP/H+LelNGHvJteeii479m6Eezucjp4ZJXPDfmrHzvKOcoZ2oqdb6KqKZGcvx6NS5nnWvgZHavTPkNyxbvF4vNzPbGX7hs6vWZVJO8d6TyOhHbF016V84j8jL0eopInCC8leCmpy6URyIFZJjE7vhMYn5pVM2kNplkFiRh5G+JZJHRJKFnkWSR0SWRyGuSTcYQCcyd28YvQkdTQcIsETNkTJFYDBEjZEyTWCwRLTJM4mWzJJZCJBGZGInwYiazLTE+xLwpZykkkkEkRsa6mOWIl/8EGADyH4OsfMBFOwAAAABJRU5ErkJggg==',
      IsCharge: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACIAAAAqCAYAAADWFImvAAADi0lEQVRYhb2YXUgUURTHf7tOZR8afWCIUbZKPWQQEUFfWPQS6ltW2EMEZhR9QCSBBYFRL1FBBJER1EsGQRRRJlRgLplUYFCxRKFGJVpK5ZZm7c7pYWbd2XU/7h21A5edOXPu//7m3Jk7565HnqxEw3KAEqAYKALygWz7Wj/QCbwGHgONQHdaxVUtABiIqACsBQ4DGwEjScxsuy0HdgBh4D5wCvCnG8CLCCmaD5G7iDQjUoaIkSbe2TLsPs22hi9hnAJIBSJtiJRqDJ6sldpa25KBJJuaY0CtwpTpWDZwDSgEjsdfTARyZBwgnFaL9fycjAUxY0Aq4gPGyU4A7cD1KIiYkeMFQN1/gIhYHdAKdNggwxk5D2Rpy81YAcvi+EM/oXUTDH1J1TPLHrMMwIspYMoaTCm1jzUaULBv5BDvzsFgj4pGKQ+WrrUzYoK1WOlbznqYviTW970NPt4AlBZKgGrA75HGohzgM8lXzMTm8cKqmzCtMOoz/0BLOfzq0FEKAXkGppRoQwDklcRCALyvg2C7rpIBlBiIWawN4Z0AhXtjfcF30H4Zx1uoY+sMTCnS7jZvM0yZ63AIBE6DJxMyMkfG/+1Pp7jYI3cWfcX6aqpZxmTY8BAmzVKLf38JAmfTRfUZiKm3dvi2q0N0P7Ig0k9XloEpHmWIidOhYKda7I8APD8I4bBSuIFIEFC7xcIqmKCQwMFueFoFoQElWSBoIGaHMkj/W2g7GuubOh8W7oqehwehdQ8MdKlCAHQamPIGq7xTCL810rekxnEi8OwQ9L3UgQB47UWkyXXl5cmA/E1RuVen4FODG63HBiL3sZZZ/dU1d0P0DfpwGwIXtCXssRu8iPQg0ugqI/lbLaneF9aUuMtsI1s+9BiYJlglf5nWfUzJhdxiCHZCcyWEhtxkIzL2cBXvR+SeXjbKrdfTXwm/e91mo4GKT34nCIgcQCSoJgD4toJ/F3wLuIUIIrI/khYnSDsiu5VE5qyGwEXoanILgT3WcM0Qv52ox9p3pN5OhIfg7VW3z0Tkuah3OhLta45jbYYOJZXpaR0NxBWgJt6ZbKdXbf8mh3EPsROr7I4xb4pO1cCZ/wEB6f+WGKvMpIRQARkLmLQQkHpq4mHcTJMShA6IGxhlCF0QHRgtCDcgKjDaEG5BUsFcAap0IUYDkggmAqFWtseZflU2EgZg5mggxgIkAuPFxXQ47R+n886QTuG5WwAAAABJRU5ErkJggg==',
      IsMaterial: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAH+0lEQVR42u2Yf0hVZxjHXWssNlcTdMFgkBpubFoDbTnCrTazTINRZKvoB0kOLNiKoLK01MiQmpbVysiiLNPKysqsLLUyrUz7bWr5u9I0tem1TK/vns9LZ8Rgf9TV6o/7wss999z3nPP9fp/v87zPuTY21mEd1mEd1mEd1mEd78R4387OboCPj4/jpEmTfpw6dervwcHBaQsXLmxauXJlSVhYWMyIESM+nzhx4leLFy/+ac6cOS5Dhgz5+K0idnBwsBUQrmPHjp05a9asmKioqNRNmzYVHzp0qOP69euqqqpKPXnyRD148ECVlJQ83bx5c9bRo0drz507Zz558mTF9u3bE4cNG/bD4MGDP3xjoG1tbT/z8PAYJ6ATReGKhISEhlOnTpkErLm1tVU9ffpUmUwmdffuXZWTk6Nyc3PVjRs39PfGxkZVU1OjPyEo16nk5OSmwMDAdDc3t+97BfDIkSP7Tps2zTMkJCRiyZIlRbGxsV2isLp165YCcFdXlwZdX1+vHj58qOrq6tS1a9dUZWWlPvfo0SN19epVHQ2IQIjfJSKqublZr2fdzZs31Zo1a/LFbtMmTJjgJI/u2yMExM9BGRkZNY8fP1YtLS163rt3T7W3t+tZXV2t7t+/r4FACMAozJrbt29rsKhdWlqqysrKNEkIc5/Ozk7V0dGhyfLdbDarioqKroKCgkIRK1KiYmex+uLpVh4COADzeenSJZWXl6fBXrx4UUGOYya/YR2A8/2F/9WzZ890tJgvD+5JdIqKijQhosI9Tpw40RERERHu7u7+wWsTcHZ2/mLfvn3tokirhJnEU+fPn1eHDx/W/uVBfGdevnxZRwOVsUx5eblqaGhQ/ze6u7vV8+fPNWAiQIT279+v7ty5o88zCgsLGyU/fn5tAvb29p/MmDFjsre39x9Xrlxp3LVrl05GFE1PT1cHDhxQR44cUWfPntX+NqyB6kxU/+9AZdawHoL4v7a2Vq83cgIy2Im1q1atOmqRjaTE9R86dOhqUd9EBIQIPlXFxcVKyqGSCGkbMSVSWtkXXta5ARgSHtIcZ2VlaRsBjohxzDVG/nAMEa5n7Ny5s84iAtOnT/9TSp32aFxcnJKyqZOT7yQnkQCgkaxYgEi0tbVpm5ErrIcglQbiTU1N/+YCihuR4rxxLBHqlvVt8fHx2RYRmDx5cuy2bdtUWlqaSk1NVdHR0dpGAMnOztYR2L17t0pJSVFbt27V+QCZCxcuaHLiY60+pVcKgtq7d6++FsugtpG4RA3vQ4IKtmPHjvopU6bMdHFxsbeIQEBAwDhA438pp1plQAEWVfEyagOAxCUaVBWsJruuJig7tE58CBMFyHEPIgUJdmuOuRaiRFlajdwe2Qekp/l248aNTQCgWhw7dkyTIBGJBAAM7+JbgGMPEnTLli1qxYoVKjIyUokVdNJjx8TERMqkXk8Ck0t8RwyqGZudtB0Pg4KChr8W6OXLl/eR2W/8+PEhokaOWKEdJak2JKLREmCFlwkQ+vz8fO1hEjgmJkZHgWiJJQCl7cW9EAK7UToBzzn2D9bzDImKWZ4d9Vo7smwgZXJzsyhlxr8GcB4AWM5BgCgYBLAQFmBv4DtKU3GOHz+ukxigWJFInjlzRlHRpHXQhQFyqE8OIALWpJ+SvPpL4Lx6o7d27drMPXv2mMSv3VQFQko1ASDHqIzfIcGEECCxFgpDGHsBBEL8TiEgjygGCMF59gBEgCSWQwRsSvTkfKdYN1Tg9HllAq6urgM9PT3HS2NVSbIJGZ10PPj06dNaQfyL0gDHw4AlSTkGELsx51AcUuvXr9cWojKRqFgIAghESaYQEE2Smcok+VIxe/ZsV0v6IG/xY4PR16AuYSfEqMYmRPUgCan32ACFKZMQIVGpRpmZmbr8hoeH6yRmPdcRAZTGNuQAyhvthVit0c/Pz8nS8vlLUlJSM6B4MA/ENuQCDzNaY4AyIYDiEMRCRAClDx48qKNC5ACKt1GY6HGMbeifEIRz3Fve2FItLp/ypvSNqFYNGMJOQgIOb9MyAAh1iZBRSahK/E6tp5xiDewEaUjQN6G+0W7wyaDbxU6sg8TcuXO39sgeIGFcvW7dunYBaZYodEICcBDAUkSA8ofKTHIDImxE9P1YDlL4HKIbNmzQvwMW0EyjLzI2P9ksTUuXLv2up17I+o4aNSpg3rx5cZLUSVQfo8+nKhEBgGMxfE9UWIPqHJMPrMdarOU6oknrQd4gABWK6vaiJTfLG1+GtBD2Nj08+khX6omnsQW5ABBaC9oCbMYnEeITwKhMbvAdsEaloSpBhhwiT2jmICZdp5KqFy9vgF/K897rlffjBQsWpKAWDwYsQADIOSJiNHiozjmUxlZMIz+4DrsAHCsaQ5Rv6fV/JOTlxlfUbKP2Uy1ondkfyAsiQhLK5qO9j9JEgOhgD9aSB8aU67rDwsKqJBJmuV+XiBPT6wR8fX37y4aULF7tNt4BUJHEBKjxgoPibFSApm9CcY5JfJo1eWFXwcHB5WPGjPFatmyZT0hIiJ+/v7+9zZsYXl5eX0tnmSeW+Fu83rJo0aIC2TETZdOrF/t0CpFusZNJrFIbGhpaKufqxONtQrhZqlChh4fHb3IPB9kobd/aP3KOjo4DBfSv8rLj7+TkNIBqNXr06OECMFqauIT58+cHurm5OQ0aNKifs7OzuyTmdOls/T+V8a7/P0rr+5H1b2LrsA7rsA7reFPjHwul8gXIrsJdAAAAAElFTkSuQmCC',
      IsDefault: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACIAAAAqCAYAAADWFImvAAAACXBIWXMAAAsTAAALEwEAmpwYAAAFEmlUWHRYTUw6Y29tLmFkb2JlLnhtcAAAAAAAPD94cGFja2V0IGJlZ2luPSLvu78iIGlkPSJXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQiPz4gPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iQWRvYmUgWE1QIENvcmUgNS42LWMxNDIgNzkuMTYwOTI0LCAyMDE3LzA3LzEzLTAxOjA2OjM5ICAgICAgICAiPiA8cmRmOlJERiB4bWxuczpyZGY9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkvMDIvMjItcmRmLXN5bnRheC1ucyMiPiA8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0iIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtbG5zOmRjPSJodHRwOi8vcHVybC5vcmcvZGMvZWxlbWVudHMvMS4xLyIgeG1sbnM6cGhvdG9zaG9wPSJodHRwOi8vbnMuYWRvYmUuY29tL3Bob3Rvc2hvcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RFdnQ9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZUV2ZW50IyIgeG1wOkNyZWF0b3JUb29sPSJBZG9iZSBQaG90b3Nob3AgQ0MgKFdpbmRvd3MpIiB4bXA6Q3JlYXRlRGF0ZT0iMjAxOC0wNS0xOFQxNTozOToxNCswODowMCIgeG1wOk1vZGlmeURhdGU9IjIwMTgtMDUtMThUMTU6Mzk6MzYrMDg6MDAiIHhtcDpNZXRhZGF0YURhdGU9IjIwMTgtMDUtMThUMTU6Mzk6MzYrMDg6MDAiIGRjOmZvcm1hdD0iaW1hZ2UvcG5nIiBwaG90b3Nob3A6Q29sb3JNb2RlPSIzIiBwaG90b3Nob3A6SUNDUHJvZmlsZT0ic1JHQiBJRUM2MTk2Ni0yLjEiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6Y2NkZGIxODYtMmZhMi1mYzQzLWExNjYtYjdiYzJhNzVlN2EwIiB4bXBNTTpEb2N1bWVudElEPSJ4bXAuZGlkOmNjZGRiMTg2LTJmYTItZmM0My1hMTY2LWI3YmMyYTc1ZTdhMCIgeG1wTU06T3JpZ2luYWxEb2N1bWVudElEPSJ4bXAuZGlkOmNjZGRiMTg2LTJmYTItZmM0My1hMTY2LWI3YmMyYTc1ZTdhMCI+IDx4bXBNTTpIaXN0b3J5PiA8cmRmOlNlcT4gPHJkZjpsaSBzdEV2dDphY3Rpb249ImNyZWF0ZWQiIHN0RXZ0Omluc3RhbmNlSUQ9InhtcC5paWQ6Y2NkZGIxODYtMmZhMi1mYzQzLWExNjYtYjdiYzJhNzVlN2EwIiBzdEV2dDp3aGVuPSIyMDE4LTA1LTE4VDE1OjM5OjE0KzA4OjAwIiBzdEV2dDpzb2Z0d2FyZUFnZW50PSJBZG9iZSBQaG90b3Nob3AgQ0MgKFdpbmRvd3MpIi8+IDwvcmRmOlNlcT4gPC94bXBNTTpIaXN0b3J5PiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/PvZB32YAAAJESURBVFiF7di/TxNhHMfxdyk2YaLDFXYTYfIXhsR/QNhJBHZdqAbYBA1pMNHohsSWPwFkYHOgbk4SBX8tJCZuRgMlKSYuJc/3cejdeT2e0juvvevAJ2nuyXO5+77aS55+n0tpremG9CQNcNLrDG6/Bq1BS+NHvEfFBRHGteKWCKOiuChCVisQRVWE71rxXoQ3otjeWeQkKCTlPJoWkKwI81qRFyGnVX1elAtsHNfPVbRQFGHlwxLVVpAgj2Ya2AcKQC7oNwQs+5r9G8tMR4GkgRKwDgyGAPgzCKyPFChdXyIdFpIGNoGZCAB/ZoDNa4/MmGaQFWCijQgnE8CLoJAp4H4HEE7uXX3IVCtIFljtIMLJ6pUFsmdB5oGBGCADdi0jJAPkY0A4yV9+QMYEGSPcOhE1ObumERJ3xk2QkQQgbk0vZCgByCUTpD8BiFuza/oRL+Q4gfpuTS/kWwIQt6YXspsAZM8EKScAcWv6IUcxIg6BbROkBryMEVL6+pyaCQL1huggBsShXcuNH1IFZmOAzH551tjZmxa0V0Cxg4ji56ds+CebraxzwFYHEFv2vU+lGUQBk8BaGxFrwOSnJyjTyV7TpAeTB95S77z/t4U8AOb2lk8/Dm+C/OltAMPAY8KtM0f2NcO7hbMREHzv69+Ej4kwWvtduZnK9KMVnPw5pqfPemdvwsuiKO8s/lsn2g1pOH5csPwvV1KVSiXwT2aEhIllWc6wbZCubIwSzTnEn3OIP1EhPz3jX0lC7tqAH8CdKDf6C7yjBudNCyCkAAAAAElFTkSuQmCC'
    };

    return {
      name: 'point',
      svgicons: svgEditor.curConfig.extIconsPath + 'wcs-point-icon.xml',
      buttons: [{
        id: 'point',
        type: 'mode',
        title: getTitle('point'),
        events: {
          click () {
            if (svgCanvas.getSelectedElems().length > 0) {
              svgCanvas.clearSelection();
            }
            svgCanvas.setMode('point');
          }
        }
      },
      {
        id: 'point_IsControl',
        type: 'mode',
        title: getTitle('point_IsControl'),
        events: {
          click () {
            if (svgCanvas.getSelectedElems().length > 0) {
              svgCanvas.clearSelection();
            }
            svgCanvas.setMode('point_IsControl');
          }
        }
      },
      {
        id: 'point_IsCharge',
        type: 'mode',
        title: getTitle('point_IsCharge'),
        events: {
          click () {
            if (svgCanvas.getSelectedElems().length > 0) {
              svgCanvas.clearSelection();
            }
            svgCanvas.setMode('point_IsCharge');
          }
        }
      },
      {
        id: 'point_IsDefault',
        type: 'mode',
        title: getTitle('point_IsDefault'),
        events: {
          click () {
            if (svgCanvas.getSelectedElems().length > 0) {
              svgCanvas.clearSelection();
            }
            svgCanvas.setMode('point_IsDefault');
          }
        }
      },
      {
        id: 'point_IsMaterial',
        type: 'mode',
        title: getTitle('point_IsMaterial'),
        events: {
          click () {
            if (svgCanvas.getSelectedElems().length > 0) {
              svgCanvas.clearSelection();
            }
            svgCanvas.setMode('point_IsMaterial');
          }
        }
      }
      ],
      mouseDown (opts) {
        const mode = svgCanvas.getMode();
        if (mode.split('_')[0] === 'point') {
          const mouseTarget = opts.event.target;
          if (mouseTarget && mouseTarget.tagName === 'path' && mouseTarget.getAttribute('class') === 'route') {
            const cmdArr = [];
            const x = opts.start_x;
            const y = opts.start_y;

            const route = mouseTarget;
            const curve = route.pathSegList.getItem(1);

            const strokeWidth = ($('#stroke_width').val() !== initStroke.width) ? $('#stroke_width').val() : 4;
            const path = addElem({
              element: 'path',
              attr: {
                id: getNextId(),
                d: 'M' + x + ',' + y + ' L' + curve.x + ',' + curve.y,
                stroke: 'url(#roadpattern)',
                'stroke-width': strokeWidth,
                fill: 'none',
                class: 'route'
              }
            });
            cmdArr.push(new InsertElementCommand(path));
            const point = addElem({
              element: 'circle',
              attr: {
                id: getNextId(),
                cx: x,
                cy: y,
                r: 6,
                stroke: '#00ffff',
                'stroke-width': strokeWidth,
                fill: '#fff',
                class: 'point'
              }
            });
            point.setAttributeNS(seNs, 'se:routes', route.id + ' ' + path.id);
            cmdArr.push(new InsertElementCommand(point));
            if (mode.split('_')[1]) {
              const imgElem = addElem({
                element: 'image',
                attr: {
                  id: getNextId(),
                  x: x - 17,
                  y: y - 50,
                  width: 34,
                  heigth: 42
                }
              });

              const href = imgSrc[mode.split('_')[1]];
              // switch (mode.split('_')[1]) {
              // case 'IsCharge':
              //   href = imgSrc.charge;
              //   break;
              // default:
              //   href = imgSrc.control;
              // }
              setHref(imgElem, href);
              svgUtils.preventClickDefault(imgElem);

              imgElem.setAttributeNS(seNs, 'se:point', point.id);

              cmdArr.push(new InsertElementCommand(imgElem));

              point.setAttributeNS(seNs, 'se:nebor', imgElem.id);
              point.setAttributeNS(seNs, 'se:' + mode.split('_')[1], true);

              cmdArr.push(new ChangeElementCommand(point, {
                'se:nebor': null,
                'se:IsCharge': null,
                'se:IsControl': null
              }));
            }

            const routeAttr = route.getAttributeNS(seNs, 'points');
            const points = routeAttr.split(' ');
            const startElem1 = getElem(points[0]),
              // endElem1 = point,
              startElem2 = point,
              endElem2 = getElem(points[1]);

            const od = route.getAttribute('d');

            curve.x = x;
            curve.y = y;

            route.setAttributeNS(seNs, 'se:points', [points[0], point.id, points[2]].join(' '));

            cmdArr.push(new ChangeElementCommand(route, {
              d: od,
              'se:points': routeAttr
            }));

            startElem1.before(path);
            path.setAttributeNS(seNs, 'se:points', startElem2.id + ' ' + endElem2.id);

            cmdArr.push(new ChangeElementCommand(path, {
              'se:points': null
            }));

            let endRoute = [];
            const endRouteAttr = endElem2.getAttributeNS(seNs, 'routes');
            if (endRouteAttr) {
              endRoute = endRouteAttr.trim().split(' ');
              if (endRoute && endRoute.length > 0) {
                const endRouteIndex = endRoute.findIndex(function (v) {
                  return v === route.id;
                });
                endRoute.splice(endRouteIndex, 1);
              }
            }
            endRoute.push(path.id);
            endElem2.setAttributeNS(seNs, 'se:routes', endRoute.join(' '));
            cmdArr.push(new ChangeElementCommand(endElem2, {
              'se:routes': endRouteAttr
            }));
            if (cmdArr.length > 0) {
              const batchCmd = new BatchCommand('pointadd');
              cmdArr.forEach((v) => {
                batchCmd.addSubCommand(v);
              });
              svgCanvas.undoMgr.addCommandToHistory(batchCmd);
            }

            svgEditor.clickSelect();
          }
        }
      },
      mouseMove: function mouseMove (opts) {
        const zoom = svgCanvas.getZoom();
        const x = opts.mouse_x / zoom;
        const y = opts.mouse_y / zoom;

        if (svgCanvas.getSelectedElems().length === 1) {
          const elems = svgCanvas.getSelectedElems();
          const elem = elems[0];
          if (elem && elem.tagName === 'circle' && elem.getAttribute('class') === 'point') {
            // Point Group Changed
            if (elem.hasAttribute('se:nebor')) {
              const nebor = getElem(elem.getAttribute('se:nebor'));
              if (nebor) {
                nebor.setAttribute('x', x - 17);
                nebor.setAttribute('y', y - 50);
              }
            }
          } else if (elem && elem.tagName === 'image' && elem.getAttributeNS(seNs, 'point')) {
            const point = getElem(elem.getAttributeNS(seNs, 'point'));
            if (point) {
              assignAttributes(point, {
                cx: x,
                cy: y + 30
              });
              svgCanvas.call('changed', [point]);
            }
          }
        }
      },
      selectedChanged: function selectedChanged (opts) {
        if (svgCanvas.getSelectedElems().length === 1) {
          const elem = opts.elems[0];
          if (elem.hasAttributeNS(seNs, 'point')) {
            $('#selectorGroup0')[0].setAttribute('display', 'none');
          }
        }
      },
      elementChanged: function elementChanged (opts) {
        const elem = opts.elems[0];
        if (elem && elem.tagName === 'svg' && elem.id === 'svgcontent') {
          // Update svgcontent (can change on import)
          svgcontent = elem;
        }

        opts.elems.forEach(function (elem) {
          if (svgcontent.getElementById(elem.id)) {
            if (elem.tagName === 'image' && elem.getAttributeNS(seNs, 'point')) {
              const w = elem.getAttribute('width'),
                h = elem.getAttribute('height');
              if (w !== 34) {
                elem.setAttribute('width', 34);
              }

              if (h !== 42) {
                elem.setAttribute('height', 42);
              }
            }
          }
        });
        const selElems = svgCanvas.getSelectedElems();
        const selElem = selElems[0];
        opts.elems.forEach(function (elem) {
          if (!svgcontent.getElementById(elem.id)) {
            if (elem.tagName === 'circle' && elem.getAttribute('class') === 'point') {
              if (elem.getAttributeNS(seNs, 'nebor')) {
                const bebor = getElem(elem.getAttributeNS(seNs, 'nebor'));
                if (bebor) bebor.remove();
              }
            } else if (elem.tagName === 'image' && elem.getAttributeNS(seNs, 'point')) {
              const point = getElem(elem.getAttributeNS(seNs, 'point'));
              if (point) {
                point.remove();
                svgCanvas.call('changed', [point]);
              }
            }
          } else {
            if (selElem && selElem.tagName === 'point' && elem && elem.tagName === 'circle' && elem.getAttribute('class') === 'point') {
              // Point Group Changed
              if (elem.getAttributeNS(seNs, 'nebor')) {
                const x = elem.getAttribute('cx'),
                  y = elem.getAttribute('cy');

                const bebor = getElem(elem.getAttributeNS(seNs, 'nebor'));
                bebor.setAttribute('x', x - 17);
                bebor.setAttribute('y', y - 50);
              }
            }
          }
        });
      }
    };

    function setHref (elem, val) {
      elem.setAttributeNS(S.NS.XLINK, 'xlink:href', val);
    }

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
  }
};
