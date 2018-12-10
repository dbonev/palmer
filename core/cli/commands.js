'use strict';

const proc = require('./proc');
const path = require('path');
const cp = require('../utils/fs/cp');

module.exports = {
    install: install,
    check: check,
    init: init,
    up: up,
    down: down,
    test: test,
    cleanup: cleanup,
    ps: ps,
    kill: kill,
    start: start,
    cp_utils: cp_utils
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
    proc.spawn('env_up.bash');
}

function down(cmd){
    proc.spawn('env_down.bash');
}

function cleanup(cmd){
    proc.spawn('clear_docker_images.bash');
}

function test(cmd){
    proc.spawn('mocha', ['--recursive']);
}

function ps(cmd){
    let options = ['ps'];
    if (cmd.all){
        options.push('-a');
    }
    proc.spawn('docker', options);
}

function cp_utils(cmd){
    var filter = null;
    if (cmd.serviceName){
        filter = s => s.name === cmd.serviceName;
    }
    cp.cp_utils(null, filter);
}

function kill(service, cmd){
    proc.spawn('docker',  ['kill', service]);
}

function start(service, cmd){
    proc.spawn('docker',  ['start', service]);
}
