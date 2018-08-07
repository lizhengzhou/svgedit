# ![alt text](https://svg-edit.github.io/svgedit/images/logo48x48.svg "svg-edit logo of a pencil") SVG-edit

SVG-edit是一个快速的，基于Web的，javascript驱动的SVG绘图编辑器，适用于任何现代浏览器。

## 示例

### [点击尝试](http://admin.wcs2.mooho.com.cn/editor/editor/svg-editor-es.html)

(也可以在 [发布版本](https://github.com/SVG-Edit/svgedit/releases))[下载](https://github.com/SVG-Edit/svgedit/releases/download/svg-edit-2.8.1/svg-edit-2.8.1.zip) .

你也可以尝试 [预发布版本](https://svg-edit.github.io/svgedit/releases/svg-edit-3.0.0-alpha.4/editor/svg-editor.html) (或者 [ES6-模块打包](https://svg-edit.github.io/svgedit/releases/svg-edit-3.0.0-alpha.4/editor/svg-editor.html) 版本, 适应最新浏览器).

## 安装

请注意，只有在您希望集成SVG-edit到你自己的npm包中时，才需要执行以下1-2步骤;
否则，您可以跳过这些步骤到svgedit Git拷贝中操作，而不是
`node_modules/svgedit`目录。


1. 初始化npm包安装环境: `npm init` (填写引号中内容).
1. 安装SVG-edit包到你的项目中: `npm i svgedit`
1. 复制 `svgedit-config-sample-es.js` (在SVG-edit项目根目录;
    查看 `node_modules/svgedit`) 重命名为 `svgedit-config-es.js`.
  1.  这将使`svg-editor-es.html`能够通过ES6模块直接运行HTML文件。 
    请注意，此方式仅适用于现代浏览器。HTML文件会引用创建的js配置文件。
   
1. 如果你还是想创建一个rolled-up，Babelified的，
  允许`svg-editor.html`工作的非ES模块（IIFE），
  一个不依赖于ES6模块支持的JavaScript文件，请按照下列步骤操作：  
  1. 在目录 `node_modules/svgedit` 下运行 `npm install` 
     安装SVG-edit构建工具 .
  1. 在`node_modules/svgedit` 目录中运行 `npm run build-config` 指令.
1. 如果您想对HTML进行更改，请修改`svg-editor-es.html`，
   然后运行`npm run build-html`将更改复制到`SVG-editor.html`。
  

## Recent news
  * 2018-05-26 Published 3.0.0-alpha.2 with ES6 Modules support
  * 2017-07 Added to Packagist: https://packagist.org/packages/svg-edit/svgedit
  * 2015-12-02 SVG-edit 2.8.1 was released.
  * 2015-11-24 SVG-edit 2.8 was released.
  * 2015-11-24 Code, issue tracking, and docs are being moved to github (previously [code.google.com](https://code.google.com/p/svg-edit)).
  * 2014-04-17 2.7 and stable branches updated to reflect 2.7.1 important bug fixes for the embedded editor.
  * 2014-04-07 SVG-edit 2.7 was released.
  * 2013-01-15 SVG-edit 2.6 was released.

## Videos

  * [SVG-edit 2.4 Part 1](https://www.youtube.com/watch?v=zpC7b1ZJvvM)
  * [SVG-edit 2.4 Part 2](https://www.youtube.com/watch?v=mDzZEoGUDe8)
  * [SVG-edit 2.3 Features](https://www.youtube.com/watch?v=RVIcIy5fXOc)
  * [Introduction to SVG-edit](https://www.youtube.com/watch?v=ZJKmEI06YiY) (Version 2.2)

## Supported browsers

The following browsers had been tested for 2.6 or earlier and will probably continue to work with 2.8.
  * Firefox 1.5+
  * Opera 9.50+
  * Safari 4+
  * Chrome 1+
  * IE 9+ and Edge

## Further reading and more information

 * See [docs](docs/) for more documentation. See the [JSDocs for our latest release](https://svg-edit.github.io/svgedit/releases/svg-edit-3.0.0-alpha.4/docs/jsdoc/index.html).
 * [Acknowledgements](docs/Acknowledgements.md) lists open source projects used in svg-edit.
 * See [AUTHORS](AUTHORS) file for authors.
 * [Stackoverflow](https://stackoverflow.com/tags/svg-edit) group.
 * Join the [svg-edit mailing list](https://groups.google.com/forum/#!forum/svg-edit).
 * Join us on `#svg-edit` on `freenode.net` (or use the [web client](https://webchat.freenode.net/?channels=svg-edit)).
