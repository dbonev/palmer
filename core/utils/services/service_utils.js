'use strict';

const fs_utils = require('../fs/fs_utils.js');
const path = require('path');

module.exports = {
    enumerate_services: enumerate_services
}

function enumerate_services(callback, filter){
    function __add_frontend(service_directories){
        const fe = fs_utils.get_dirs('./');
        if (fe.filter(f => f === 'frontend').length){
            service_directories.push('frontend');
        }
    }

    function __create_dtos(){
        var result = [];
        for (const dir of service_directories){
            const service_dto = { 
                directory: dir,
                name: path.basename(dir).replace(/_/g, '-')
            };
            if (filter
                    && !filter(service_dto)){
                continue;
            }
            result.push(service_dto);
        }

        return result;
    }

    function __sort_dirs(service_directories){
        const SERVICE_REGISTRY = 'services/service_registry';
        service_directories.sort((a, b) => {
            if (a === b){
                return 0;
            }
            if (a === SERVICE_REGISTRY) {
                return -1;
            }
            if (b === SERVICE_REGISTRY) {
                return 1;
            }
            return a < b ? -1 : 1;
        });
    }

    var service_directories = fs_utils.get_dirs('./services');
    __sort_dirs(service_directories);
    __add_frontend(service_directories);
    const dtos = __create_dtos();

    for (const dto of dtos){
        dto.count = dtos.length;
        callback(dto);
    }
}
