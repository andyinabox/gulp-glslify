const path = require('path');
const glsl = require('glslify');
const through = require('through2');

module.exports = (options = {}) => {
    return through.obj(function(file, encoding, callback) {
        if (file.isDirectory() || file.isNull() || file.isStream()) {
            return callback(null, file);
        }

        // get raw flag
        var raw = options.raw;
        delete options.raw;
        
        var content = String(file.contents);
        options.basedir = options.basedir || path.dirname(file.path);
        
        // compile shader
        content = glsl(content, options);
        
        // only export as js file if raw flag is not set to true
        if(!raw) {
            content = `module.exports = ${JSON.stringify(content)};`;
            file.path += '.js';
        }

        file.contents = new Buffer(content);        
        
        this.push(file);
        callback();
    });
};
