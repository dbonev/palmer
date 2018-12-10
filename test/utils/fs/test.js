'use strict';

const assert = require('assert');
const fs_utils = require('../../../core/utils/fs/fs_utils.js');
const cp = require('../../../core/utils/fs/cp.js');
const fs = require('fs');
const test_utils = require('../../common/test_utils');

describe('Core fs utils', function(){
    it('Should get directories', function(){
        // just a check we're in the right place
        var sanity_check = ['arch', 'core', 'doc'];
        const palmer_dirs = fs_utils.get_dirs('./');
        palmer_dirs.forEach(d => {
            assert(fs.lstatSync(d).isDirectory());
            sanity_check.splice(sanity_check.indexOf(d), 1);
        });

        assert(sanity_check.length === 0);
    });
});

describe('cp tests', function(){
    it('Should be able to cp utils', function(done){
        test_utils.create_mockup_env(function() {
            process.chdir('./tmp');
            cp.cp_utils(function() {
                // see it did the job
                assert(fs.lstatSync('./services/test_service_one/utils').isDirectory());
                assert(fs.lstatSync('./services/test_service_two/utils').isDirectory());
                process.chdir('..');
                test_utils.destroy_mockup_env(done);
            });
        });
    });

    it('Should be able to cp utils with filter', function(done){
        test_utils.create_mockup_env(function() {
            process.chdir('./tmp');
            cp.cp_utils(function() {
                // see it did the job
                assert(fs.lstatSync('./services/test_service_one/utils').isDirectory());
                try {
                    fs.lstatSync('./services/test_service_two/utils').isDirectory();
                } catch (err){
                    assert(err);
                }
                process.chdir('..');
                test_utils.destroy_mockup_env(done);
            }, s => s.name === 'test_service_one');
        });
    });
});
