'use strict';

const { TestDirector } = require('test-director');

const tests = new TestDirector();

require('./cli/coverage-node.test')(tests);
require('./private/semver.test')(tests);
require('./private/sourceRange.test')(tests);
require('./public/analyseCoverage.test')(tests);

tests.run();
