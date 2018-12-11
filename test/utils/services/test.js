'use strict';

const service_utils = require('../../../core/utils/services/service_utils.js');
const test_utils = require('../../common/test_utils');
const assert = require('assert');

describe('Service Utils', function(){
    before(function(done){
        test_utils.create_mockup_env(done);
    });

    after(function(done){
        test_utils.destroy_mockup_env(done);
    });

    it('Should enumerate services', function(done){
        let processed = 0;
        let found_service_one = false;
        let found_service_two = false;
        let found_frontend = false;
        process.chdir('./tmp');
        service_utils.enumerate_services(s => {
            assert(s.directory);
            if (s.directory === 'services/test_service_one'){
                found_service_one = true;
                assert(s.name === 'test-service-one');
            }
            if (s.directory === 'services/test_service_two'){
                found_service_two = true;
                assert(s.name === 'test-service-two');
            }
            if (s.directory === 'frontend'){
                found_frontend = true;
            }
            if (++processed === s.count){
                assert(found_service_one);
                assert(found_service_two);
                assert(found_frontend);
                process.chdir('..');
                done();
            }
        });
    });
});
