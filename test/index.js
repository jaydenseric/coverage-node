'use strict';

const { TestDirector } = require('test-director');

const tests = new TestDirector();

require('./cli/coverage-node.test')(tests);
require('./lib/analyseCoverage.test')(tests);
require('./lib/semver.test')(tests);
require('./lib/sourceRange.test')(tests);

tests.run();
