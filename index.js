'use strict';

var Stream = require('stream');
var Path = require('path');
var _ = require('lodash');

function gulpBowerFixCssPath(obj) {
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

    //init config object
    if(obj == null){
        obj = {};
    }
    obj = _.merge(config,obj);


    var log = function(str){
        if(!!obj.debug){
            console.log(str);
        }
    };

    var stream = new Stream.Transform({objectMode: true});

    stream._transform = function (file, unused, callback) {

        var urls = "";

        //regex detect all url('"...?..."') "with args after extension"
        var url = /url\(["']*[[-a-zA-Z0-9@:%_\+.~#?&//=]{2,256}\.[a-z]{2,4}[0-9]?\b(\?[=.&#0-9a-zA-Z]*)*['"]?\)/gi;

        var content = String(file.contents);
        var replace_obj = {};

        while ((urls = url.exec(content)) !== null) {
            var path = urls[0];
            var absolute = path;

            //replace all ', " ( ) for empty and remove "url", return us just the path to the file
            var path = path.replace(/[\'\"\(\)]/g,"").substring(3);
            var args = "";

            // if file has some get arguments "?v=1.2.1", split them and work only in url
            // at the end of this code, join the arguments again
            if(path.indexOf("?")>=0){
                var path_array = path.split("?");
                path = !!path_array[0]?path_array[0]:"";
                //args = !!path_array[1]?path_array[1]:"";
            }

            //props from path
            var extname = Path.extname(path); //extension
            var basename = Path.basename(path, extname); //absename without path

            //in case of path is absolute we leave it, cdn, global repository ..
            if (path.search(/(http|ftp)/i) >= 0) {
                continue;
            }

            //begin our scripts to detect if this extension file has some especific folder to prefix
            //at the end we replace all ../path/to/folder/ from git repository to our folder config like "fonts/"
            var prefixPath = "";
            //loop our config type of files

            var types = obj.types;
            for (var type in types) {
                //double check, detect if type exists in our config
                if (types.hasOwnProperty(type) && types[type] != undefined) {

                    //get the possible extensions fot that type
                    var extensions = types[type].extensions;

                    //if the path with the especific extension was detected break loop and sabe the prefixPath
                    if (extensions.indexOf(extname) >= 0) {
                        prefixPath = types[type].prefixPath;
                        break;
                    }
                }
            }

            //build the new url
            var absolutePath = (!!obj.absolutePath ? obj.absolutePath : '');
            var convertPath = "url('" + absolutePath + prefixPath + basename + extname + (!!args?"?"+args:"") + "')";

            //add string to replace on array
            replace_obj[absolute] = convertPath;

        }

        //if file have path to change
        if(!!Object.keys(replace_obj).length) {
            log(replace_obj);
            //replace all url with the new path url
            _.forEach(replace_obj, function (replaceToUrl, url) {
                content = content.split(url).join(replaceToUrl);
            });
            file.contents = new Buffer(content);
        }
        callback(null, file);
    };

    return stream;
}

module.exports = gulpBowerFixCssPath;
