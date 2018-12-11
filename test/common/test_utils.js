const fs = require('fs');
const exec = require('child_process').exec;

module.exports = {
    create_mockup_env: create_mockup_env,
    destroy_mockup_env: destroy_mockup_env
}

function create_mockup_env(callback){
    destroy_mockup_env(() => {
        fs.mkdirSync('./tmp');
        // frontend
        fs.mkdirSync('./tmp/frontend/');

        // services
        fs.mkdirSync('./tmp/services/');
        fs.mkdirSync('./tmp/services/test_service_one/');
        fs.mkdirSync('./tmp/services/test_service_two/');
        fs.mkdirSync('./tmp/services/test_service_three/');
        // utils
        fs.mkdirSync('./tmp/utils');

        callback();
    });
}

function destroy_mockup_env(callback){
    // node.js implementation of rmdir
    // calls the POSIX syscall which
    // doesn't allow for empty dirs removal
    exec('rm -rf ./tmp', function(error, stdout, stderr){
        callback();
    });
}
