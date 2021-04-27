import TestDirector from 'test-director';
import testCoverageNodeCli from './cli/coverage-node.test.mjs';
import testChildProcessPromise from './private/childProcessPromise.test.mjs';
import testReportCliError from './private/reportCliError.test.mjs';
import testSemver from './private/semver.test.mjs';
import testSourceRange from './private/sourceRange.test.mjs';
import testAnalyseCoverage from './public/analyseCoverage.test.mjs';
import testReplaceStackTraces from './replaceStackTraces.test.mjs';

const tests = new TestDirector();

testReplaceStackTraces(tests);
testCoverageNodeCli(tests);
testChildProcessPromise(tests);
testReportCliError(tests);
testSemver(tests);
testSourceRange(tests);
testAnalyseCoverage(tests);

tests.run();
