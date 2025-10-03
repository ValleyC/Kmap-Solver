/**
 * Simple test runner for Boolean Logic Tool
 */

const BooleanParser = require('../js/parser.js');
const TruthTableGenerator = require('../js/truthTable.js');
const KarnaughMap = require('../js/kmap.js');
const KMapSimplifier = require('../js/simplifier.js');

class TestRunner {
    constructor() {
        this.tests = [];
        this.passed = 0;
        this.failed = 0;
    }

    test(description, fn) {
        this.tests.push({ description, fn });
    }

    assertEqual(actual, expected, message = '') {
        const actualStr = JSON.stringify(actual);
        const expectedStr = JSON.stringify(expected);

        if (actualStr !== expectedStr) {
            throw new Error(`${message}\nExpected: ${expectedStr}\nActual: ${actualStr}`);
        }
    }

    assertTrue(condition, message = '') {
        if (!condition) {
            throw new Error(message || 'Expected true but got false');
        }
    }

    async run() {
        console.log('Running Boolean Logic Tool Tests...\n');

        for (const test of this.tests) {
            try {
                await test.fn(this);
                console.log(`✓ ${test.description}`);
                this.passed++;
            } catch (error) {
                console.log(`✗ ${test.description}`);
                console.log(`  Error: ${error.message}\n`);
                this.failed++;
            }
        }

        console.log(`\n${this.passed} passed, ${this.failed} failed`);
        process.exit(this.failed > 0 ? 1 : 0);
    }
}

// Create test runner
const runner = new TestRunner();

// ===== Parser Tests =====
runner.test('Parser: Extract variables from simple expression', (t) => {
    const parser = new BooleanParser();
    const result = parser.parse('AB + CD');
    t.assertEqual(result.variables, ['A', 'B', 'C', 'D']);
});

runner.test('Parser: Handle NOT operator variations', (t) => {
    const parser = new BooleanParser();
    const result1 = parser.parse("A'B");
    const result2 = parser.parse("~AB");
    const result3 = parser.parse("!AB");

    t.assertTrue(result1.evaluable.includes('!A'));
    t.assertTrue(result2.evaluable.includes('!A'));
    t.assertTrue(result3.evaluable.includes('!A'));
});

runner.test('Parser: Convert to evaluable format', (t) => {
    const parser = new BooleanParser();
    const result = parser.parse('A + B');
    t.assertTrue(result.evaluable.includes('||'));
});

runner.test('Parser: Evaluate simple expression', (t) => {
    const parser = new BooleanParser();
    const result = parser.evaluate('A||B', { A: 1, B: 0 });
    t.assertEqual(result, 1);
});

// ===== Truth Table Tests =====
runner.test('TruthTable: Generate 2-variable table', (t) => {
    const parser = new BooleanParser();
    const ttGen = new TruthTableGenerator();
    const parsed = parser.parse('A + B');
    const tt = ttGen.generate(parsed);

    t.assertEqual(tt.numVars, 2);
    t.assertEqual(tt.rows.length, 4);
    t.assertEqual(tt.minterms, [1, 2, 3]); // A+B is 1 except when both are 0
});

runner.test('TruthTable: Generate 3-variable table', (t) => {
    const parser = new BooleanParser();
    const ttGen = new TruthTableGenerator();
    const parsed = parser.parse('ABC');
    const tt = ttGen.generate(parsed);

    t.assertEqual(tt.numVars, 3);
    t.assertEqual(tt.rows.length, 8);
    t.assertEqual(tt.minterms, [7]); // Only 111 = 1
});

runner.test('TruthTable: Generate from outputs', (t) => {
    const ttGen = new TruthTableGenerator();
    const outputs = [0, 1, 1, 0];
    const tt = ttGen.generateFromOutputs(['A', 'B'], outputs);

    t.assertEqual(tt.minterms, [1, 2]);
});

runner.test('TruthTable: Export to CSV', (t) => {
    const parser = new BooleanParser();
    const ttGen = new TruthTableGenerator();
    const parsed = parser.parse('AB');
    const tt = ttGen.generate(parsed);
    const csv = ttGen.toCSV(tt);

    t.assertTrue(csv.includes('A,B,Output'));
    t.assertTrue(csv.includes('1,1,1')); // Last row should be 1,1,1
});

// ===== K-map Tests =====
runner.test('KMap: Generate 2-variable K-map', (t) => {
    const parser = new BooleanParser();
    const ttGen = new TruthTableGenerator();
    const kmapGen = new KarnaughMap();

    const parsed = parser.parse('A + B');
    const tt = ttGen.generate(parsed);
    const kmap = kmapGen.generate(tt);

    t.assertEqual(kmap.dimensions.rows, 2);
    t.assertEqual(kmap.dimensions.cols, 2);
});

runner.test('KMap: Generate 3-variable K-map', (t) => {
    const parser = new BooleanParser();
    const ttGen = new TruthTableGenerator();
    const kmapGen = new KarnaughMap();

    const parsed = parser.parse('AB + BC');
    const tt = ttGen.generate(parsed);
    const kmap = kmapGen.generate(tt);

    t.assertEqual(kmap.dimensions.rows, 2);
    t.assertEqual(kmap.dimensions.cols, 4);
});

runner.test('KMap: Generate 4-variable K-map', (t) => {
    const parser = new BooleanParser();
    const ttGen = new TruthTableGenerator();
    const kmapGen = new KarnaughMap();

    const parsed = parser.parse('AB + CD');
    const tt = ttGen.generate(parsed);
    const kmap = kmapGen.generate(tt);

    t.assertEqual(kmap.dimensions.rows, 4);
    t.assertEqual(kmap.dimensions.cols, 4);
});

// ===== Simplifier Tests =====
runner.test('Simplifier: Handle trivial case - all zeros', (t) => {
    const simplifier = new KMapSimplifier();
    const kmap = {
        minterms: [],
        variables: ['A', 'B'],
        numVars: 2
    };

    const result = simplifier.simplify(kmap);
    t.assertEqual(result.sop, '0');
});

runner.test('Simplifier: Handle trivial case - all ones', (t) => {
    const simplifier = new KMapSimplifier();
    const kmap = {
        minterms: [0, 1, 2, 3],
        variables: ['A', 'B'],
        numVars: 2
    };

    const result = simplifier.simplify(kmap);
    t.assertEqual(result.sop, '1');
});

runner.test('Simplifier: Combine binary terms', (t) => {
    const simplifier = new KMapSimplifier();
    const combined = simplifier.combineBinary('1010', '1011');
    t.assertEqual(combined, '101-');
});

runner.test('Simplifier: Quine-McCluskey basic test', (t) => {
    const simplifier = new KMapSimplifier();
    const primeImplicants = simplifier.quineMcCluskey([0, 1, 2], 2);

    // Should find prime implicants for A'B' + A'B + AB' = A' + B'
    t.assertTrue(primeImplicants.length > 0);
});

runner.test('Integration: Full workflow for 2-variable expression', (t) => {
    const parser = new BooleanParser();
    const ttGen = new TruthTableGenerator();
    const kmapGen = new KarnaughMap();
    const simplifier = new KMapSimplifier();

    // Test expression: A + B
    const parsed = parser.parse('A + B');
    const tt = ttGen.generate(parsed);
    const kmap = kmapGen.generate(tt);
    const simplified = simplifier.simplify(kmap);

    t.assertTrue(parsed.valid);
    t.assertEqual(tt.numVars, 2);
    t.assertTrue(simplified.sop.length > 0);
});

runner.test('Integration: Full workflow for 3-variable expression', (t) => {
    const parser = new BooleanParser();
    const ttGen = new TruthTableGenerator();
    const kmapGen = new KarnaughMap();
    const simplifier = new KMapSimplifier();

    // Test expression: AB + BC + AC
    const parsed = parser.parse('AB + BC + AC');
    const tt = ttGen.generate(parsed);
    const kmap = kmapGen.generate(tt);
    const simplified = simplifier.simplify(kmap);

    t.assertTrue(parsed.valid);
    t.assertEqual(tt.numVars, 3);
    t.assertTrue(simplified.sop.length > 0);
});

runner.test('Integration: Truth table input to K-map workflow', (t) => {
    const ttGen = new TruthTableGenerator();
    const kmapGen = new KarnaughMap();
    const simplifier = new KMapSimplifier();

    // Test direct truth table input
    const variables = ['A', 'B', 'C'];
    const outputs = [0, 0, 0, 1, 0, 1, 1, 1]; // Minterms: 3, 5, 6, 7

    const tt = ttGen.generateFromOutputs(variables, outputs);
    const kmap = kmapGen.generate(tt);
    const simplified = simplifier.simplify(kmap);

    t.assertEqual(tt.minterms, [3, 5, 6, 7]);
    t.assertEqual(tt.numVars, 3);
    t.assertTrue(simplified.sop.length > 0);
});

runner.test('Integration: Truth table input with different patterns', (t) => {
    const ttGen = new TruthTableGenerator();
    const kmapGen = new KarnaughMap();
    const simplifier = new KMapSimplifier();

    // Test pattern: alternating outputs for 2 variables
    const variables = ['X', 'Y'];
    const outputs = [0, 1, 0, 1]; // Minterms: 1, 3

    const tt = ttGen.generateFromOutputs(variables, outputs);
    const kmap = kmapGen.generate(tt);
    const simplified = simplifier.simplify(kmap);

    t.assertEqual(tt.minterms, [1, 3]);
    t.assertTrue(simplified.sop.includes('Y')); // Should simplify to just Y
});

// Run all tests
runner.run();
