'use strict';

const fs_utils = require('../fs/fs_utils.js');
const path = require('path');

module.exports = {
    enumerate_services: enumerate_services
}

function enumerate_services(callback, filter){
    function __create_dtos(){
        var result = [];
        for (const dir of service_directories){
            const service_dto = { 
                directory: dir,
                name: path.basename(dir)
            };
            if (filter
                    && !filter(service_dto)){
                continue;
            }
            result.push(service_dto);
        }

        return result;
    }

    const service_directories = fs_utils.get_dirs('./services');
    const dtos = __create_dtos();

    for (const dto of dtos){
        dto.count = dtos.length;
        callback(dto);
    }
}
