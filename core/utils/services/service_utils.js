'use strict';

const fs_utils = require('../fs/fs_utils.js');

module.exports = {
    enumerate_services: enumerate_services
}

function enumerate_services(callback){
    const service_directories = fs_utils.get_dirs('./services');
    for (const dir of service_directories){
        callback({ 
            directory: dir,
            count: service_directories.length
        });
    }
}
