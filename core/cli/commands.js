'use strict';

const exec = require('child_process').exec;
const spawn = require('child_process').spawn;
const path = require('path');
const __empty = () => {};

module.exports = {
    install: install,
    check: check,
    init: init,
    up: up,
    down: down,
    test: test,
    cleanup: cleanup,
    ps: ps
}

function __get_script_path(script){
    var result = path.resolve(__dirname, '../../arch/script/', script);
    return result;
}

function __script_out(err, stdout, stderr){
    if (err){
        console.log(err);
    }
    console.log(stderr);
    console.log(stdout);
}

function __resolve_palmer_script(script){
    if (!script){
        return;
    }

    if (script.endsWith('bash')){
        return __get_script_path(script);
    }

    return script;
}

function __spawn(script, args, callback){
    callback = callback || __empty;

    var spawned = spawn(__resolve_palmer_script(script), args);
    spawned.stdout.on('data', function(data){
        callback(data);
        console.log(data.toString());
    });
    spawned.stderr.on('data', function(data){
        callback(null, data);
        console.log(data.toString());
    });
    spawned.on('exit', function(code){
        callback(null, null, code);
    });
}

function install(cmd){
    console.log('Going to install palmer in /usr/bin');
    exec('sudo ln -s $(pwd)/palmer /usr/bin/palmer', function(err, stdout, stderr){
        if (err){
            console.log(err);
        }
        console.log(stdout);
    });
}

function check(cmd){
    console.log('Check OK');
}

function init(dir, cmd){
    console.log('Going to init in ' + dir);
}

function up(cmd){
    __spawn('env_up.bash');
}

function down(cmd){
    __spawn('env_down.bash');
}

function cleanup(cmd){
    __spawn('clear_docker_images.bash');
}

function test(a, b, c){
    console.log(a);
    console.log(b);
    console.log(c);
}

function ps(cmd){
    let options = ['ps'];
    if (cmd.all){
        options.push('-a');
    }
    __spawn('docker', options);
}
