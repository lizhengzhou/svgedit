export default {
  select_lib: '选择图库',
  show_list: '显示图库清单',
  import_single: '单个导入',
  import_multi: '批量导入',
  open: '导入到新地图',
  imgLibs: [
    {
      name: '图例库 (local)',
      url ({path, modularVersion}) {
        return path + 'imagelib/index' + (modularVersion ? '-es' : '') + '.html';
      },
      description: '地图图标'
    },
    // {
    //   name: 'IAN Symbol Libraries',
    //   url: 'https://ian.umces.edu/symbols/catalog/svgedit/album_chooser.php',
    //   description: 'Free library of illustrations'
    // },
    // {
    //   name: 'Openclipart',
    //   url: 'https://openclipart.org/svgedit',
    //   description: 'Share and Use Images. Over 50,000 Public Domain SVG Images and Growing.'
    // }
  ]
};
