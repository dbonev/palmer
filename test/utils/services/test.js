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
        var index = 0;
        service_utils.enumerate_services(s => {
            assert(s.directory);
            if (index === 0){
                console.log(s);
                assert(s.name === 'service-registry');
            }

            index++;
            if (s.directory === 'services/test_service_one'){
                found_service_one = true;
                assert(s.name === 'test-service-one');
                assert(s.test_directory === 'test/test/test_service_one');
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

    it('Should get service test directory', function(done){
        process.chdir('./tmp');
        var index = 0;
        service_utils.get_test_dir('test-service-one', dir => {
            assert(dir === 'test/test/test_service_one');
            process.chdir('..');
            done();
        });
    });
});
