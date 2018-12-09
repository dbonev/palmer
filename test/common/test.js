const fs = require('fs');
const assert = require('assert');
const test_utils = require('./test_utils');

describe('Test utils', function(){
    it('Should create mockup environment', function(done){
        test_utils.create_mockup_env(() => {
            // check it's there
            fs.lstatSync('./tmp/services');
            fs.lstatSync('./tmp/services/test_service_one');

            // tear it down
            test_utils.destroy_mockup_env(() => {
                // see it's not there
                fs.lstat('./tmp/services', (error, result) => {
                    assert(error);
                    assert(error.code === 'ENOENT');
                    done();
                });
            });
        });
    });
});

