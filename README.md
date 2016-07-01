GulpBowerFixCssPaths
=========

Small tool module to use combining with bower (bower-installer).
Fix all css path (assets like fonts/images) in all diferent repositories that your project depends

## Installation

```shell
  npm install --save gulp-bower-fix-css-path
```

## Dependecies

```bower-installer
  
  This module is a complement of bower-installer

  bower.json example.
  The bower will download all vendor files to bower_components, after doing so it copies to a vendor folder just the specified files.
  In vendor folder bower-installer will organize your files like you specify in install.path.
  This node module will fix all css path to fix this re-organization process.

  {
    "name": "",
    "version": "1.0",
    "dependencies": {
        "jquery": "2.2.*",
        "jqueryui": "1.11.*",
        "bootstrap": "3.3.*",
    },
    "install": {
        "base": "./vendor",
        "path": {
            "js": "{name}",
            "css": "{name}",
            "eot": "{name}/fonts", "ttf": "{name}/fonts", "woff": "{name}/fonts", "woff2": "{name}/fonts", "otf": "{name}/fonts",
            "jpg": "{name}/img", "png": "{name}/img", "gif": "{name}/img", "jpeg": "{name}/img"
        },
        "sources": {
            "jquery": [
                "bower_components/jquery/dist/jquery.js",
                "bower_components/jquery/dist/jquery.min.js"
            ],
            "jqueryui": [
                "bower_components/jqueryui/jquery-ui.min.js",
                "bower_components/jqueryui/themes/smoothness/jquery-ui.min.css",
                "bower_components/jqueryui/themes/smoothness/images/*.*"
            ],
            "bootstrap": [
                "bower_components/bootstrap/dist/js/bootstrap.min.js",
                "bower_components/bootstrap/dist/css/bootstrap.min.css",
                "bower_components/bootstrap/dist/fonts/*"
            ]
        }
    }
}

```

## Usage

```js
  var bowerFixCss = require('gulp-bower-fix-css-path')

  gulp.task("bowerFixCssDefaultConfig", function () {
    return gulp.src([paths.srcVendor + '**/*.css'])
      .pipe(bowerFixCss())
      .pipe(gulp.dest(function (file) {
        return file.base;
      }));
  });

  var config = {
    "debug":false,
    "absolutePath": "/vendor/",
    "types":{
      "fonts":{
        extensions: [".eot", ".woff", ".ttf", ".woff2"],
        prefixPath: "fonts/"
      },
      "imgs":{
        extensions: [".png", ".jpg", ".gif", ".jpeg"],
        prefixPath: "img/"
      },
      "svgs":{
        extensions: [".svg"],
        prefixPath: "svg/"
      }
    }
  };

  gulp.task("bowerFixCssWithConfig", function () {
    return gulp.src([paths.srcVendor + '**/*.css'])
      .pipe(bowerFixCss(config))
      .pipe(gulp.dest(function (file) {
        return file.base;
      }));
  });

```


## Release History

* 0.0.1 Initial release