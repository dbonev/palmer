'use strict';

const path = require('path');
const exec = require('child_process').exec;
const spawn = require('child_process').spawn;
const __empty = () => {};

module.exports = {
    get_scriipt_path: get_script_path,
    script_out: script_out,
    resolve_palmer_script: resolve_palmer_script,
    spawn: spawn_process,
    empty: __empty
};

function get_script_path(script){
    var result = path.resolve(__dirname, '../../arch/script/', script);
    return result;
}

function script_out(err, stdout, stderr){
    if (err){
        console.log(err);
    }
    console.log(stderr);
    console.log(stdout);
}

function resolve_palmer_script(script){
    if (!script){
        return;
    }

    if (script.endsWith('bash')){
        return get_script_path(script);
    }

    return script;
}

function spawn_process(script, args, callback, options){
    callback = callback || __empty;

    var spawned = spawn(resolve_palmer_script(script), args, options);
    spawned.stdout.on('data', function(data){
        callback(data);
        process.stdout.write(data.toString());
    });
    spawned.stderr.on('data', function(data){
        callback(null, data);
        process.stdout.write(data.toString());
    });
    spawned.on('exit', function(code){
        callback(null, null, code);
    });
}
