// @ts-check

import TestDirector from "test-director";

import test_analyseCoverage from "./analyseCoverage.test.mjs";
import test_childProcessPromise from "./childProcessPromise.test.mjs";
import test_CliError from "./CliError.test.mjs";
import test_cli_coverage_node from "./coverage-node.test.mjs";
import test_reportCliError from "./reportCliError.test.mjs";
import test_sourceRange from "./sourceRange.test.mjs";

const tests = new TestDirector();

test_CliError(tests);
test_analyseCoverage(tests);
test_childProcessPromise(tests);
test_cli_coverage_node(tests);
test_reportCliError(tests);
test_sourceRange(tests);

tests.run();
