'use strict';

var path = require('path');
var fs = require('fs');

module.exports = {
    get_dirs: get_dirs
}

function get_dirs(parent_dir){
    const contents = fs.readdirSync(parent_dir);
    const result = contents
                    .map(dir_entry => path.join(parent_dir, dir_entry))
                    .filter(dir_entry => fs.lstatSync(dir_entry).isDirectory());
    return result;
}
