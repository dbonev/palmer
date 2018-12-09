'use strict';

const assert = require('assert');
const fs_utils = require('../../../core/utils/fs/fs_utils.js');
const fs = require('fs');

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
});
