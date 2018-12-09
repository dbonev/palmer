var fs_utils = require('../fs/fs_utils.js');

module.exports = {
    enumerate_services: enumerate_services
}

function enumerate_services(callback){
    var service_directories = fs_utils.get_dirs('./');
    for (const dir of service_directories){
        callback({ 
            directory: dir 
        });
    }
}
