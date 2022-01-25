import TestDirector from "test-director";
import test_cli_coverage_node from "./cli/coverage-node.test.mjs";
import test_childProcessPromise from "./private/childProcessPromise.test.mjs";
import test_reportCliError from "./private/reportCliError.test.mjs";
import test_semver from "./private/semver.test.mjs";
import test_sourceRange from "./private/sourceRange.test.mjs";
import test_analyseCoverage from "./public/analyseCoverage.test.mjs";
import test_replaceStackTraces from "./replaceStackTraces.test.mjs";

const tests = new TestDirector();

test_replaceStackTraces(tests);
test_cli_coverage_node(tests);
test_childProcessPromise(tests);
test_reportCliError(tests);
test_semver(tests);
test_sourceRange(tests);
test_analyseCoverage(tests);

tests.run();
