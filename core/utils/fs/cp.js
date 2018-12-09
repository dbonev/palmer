'use strict';

const path = require('path');
const fs = require('fs');
const service_utils = require('../services/service_utils');
const proc = require('../../proc');

module.exports = {
    cp_utils: cp_utils
}

function cp_utils(callback){
    function __cp_utils_to_service(service){
        proc.spawn('cp', ['-r', 'utils', service.directory], callback);
    }

    var processed = 0;
    service_utils.enumerate_services(service => {
        __cp_utils_to_service(service, s => {
            if (++processed === s.count){
                callback();
            }
        });
    });
}
