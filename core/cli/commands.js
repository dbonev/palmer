'use strict';

const proc = require('./proc');
const path = require('path');
const cp = require('../utils/fs/cp');
const service_utils = require('../utils/services/service_utils');

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
    cp_utils: cp_utils,
    ls_services: ls_services,
    shell_complete: shell_complete,
    compile: compile
}

function __get_service_filter(cmd){
    var filter = null;
    if (cmd && cmd.serviceName){
        filter = s => s.name === cmd.serviceName;
    }

    return filter;
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

function up(cmd, callback){
    function __kill_and_remove_service(service_name, kill_remove_ready_callback){
        kill(service_name, cmd, function(){
            proc.spawn('docker-compose', ['rm', '-f', service_name], function(data, error, exit_code){
                if (kill_remove_ready_callback && exit_code != null){
                    kill_remove_ready_callback(exit_code);
                }
            });
        });
    }

    function __rebuild_if_needed(callback){
        if (!cmd.rebuild){
            callback();
            return;
        }

        if (cmd.serviceName){
            __kill_and_remove_service(cmd.serviceName, () => callback());
        } else {
            down(cmd, () => callback());
        }

    }

    __rebuild_if_needed(function(){
        cp_utils(cmd, function(){
            compile(cmd, function(){
                var params = cmd.serviceName ? [cmd.serviceName] : undefined;
                proc.spawn('env_up.bash', params, callback);
            });
        });
    });
}

function down(cmd, callback){
    proc.spawn('env_down.bash', null, function(data, error, exit_code){
        if (callback && exit_code != null){
            callback(exit_code);
        }
    });
}

function cleanup(cmd){
    proc.spawn('clear_docker_images.bash');
    proc.spawn('clean_test_data.bash');
}

function test(cmd){
    function __up_if_needed(callback){
        var params = ['--recursive', '--timeout=60000'];
        if (cmd.serviceName){
            console.log('Executing tests for service ' + cmd.serviceName + ' rebuild: ' + cmd.rebuild);
            service_utils.get_test_dir(cmd.serviceName, function(dir){
                params.push(dir);
                if (!cmd.rebuild){
                    callback(params);
                    return;
                }
                up(cmd, function(data, err, exit_code){
                    if (exit_code === 0){
                        callback(params);
                    }
                });
            });
        } else {
            callback(params);
        }
    }

    __up_if_needed(function(params){
        proc.spawn('mocha', params);
    });
}

function ps(cmd){
    let options = ['ps'];
    if (cmd.all){
        options.push('-a');
    }
    proc.spawn('docker', options);
}

function cp_utils(cmd, callback){
    const filter = __get_service_filter(cmd);
    cp.cp_utils(callback, filter);
}

function compile(cmd, callback){
    function __done(data, error, exit_code){
        if (exit_code != null){
            processed++;
            console.log('Processed ' + processed + ' / ' + total_count);
        }
        if (data){
            process.stdout.write(data.toString());
        }
        if (error){
            process.stdout.write(error.toString());
        }

        if (callback && processed === total_count){
            callback();
        }
    }
    var processed = 0;
    var total_count = 0;
    var filter = __get_service_filter(cmd);
    service_utils.enumerate_services(s => {
        total_count = s.count;
        console.log('Running npm install in ' + s.directory);
        proc.spawn('npm', ['install'], __done, { cwd: s.directory });
    }, filter);
}

function ls_services(cmd){
    service_utils.enumerate_services(s => {
        console.log(s.name);
    });
}

function kill(service, cmd, callback){
    proc.spawn('docker',  ['kill', service], function(data, error, exit_code){
        if (callback && exit_code != null){
            callback(exit_code);
        }
    });
}

function start(service, cmd){
    proc.spawn('docker',  ['start', service]);
}

function shell_complete(cmd){
    proc.spawn('shell_completion.bash');
}

