# Boolean Logic Simplification Tool

A comprehensive web-based tool for Boolean logic expression analysis, featuring automatic conversion between Boolean expressions, truth tables, and Karnaugh maps (K-maps), with integrated simplification algorithms.

## Features

### Core Functionality
- **Boolean Expression Parser** - Supports multiple operator notations (', ~, !, +, ·, *, etc.)
- **Truth Table Generator** - Automatically generates complete truth tables from expressions
- **Truth Table Input Mode** - ⭐ NEW: Start directly from truth table values
- **K-map Construction** - Creates Karnaugh maps for 2-6 variables
- **Expression Simplification** - Uses Quine-McCluskey algorithm for minimization
- **Bidirectional Conversion** - Convert between expressions, truth tables, and K-maps
- **Circuit Schematic Generator** - ⭐ NEW: Automatic logic circuit diagrams using AND, OR, NOT gates
- **Multiple Output Support** - ⭐ NEW: Handle up to 4 outputs simultaneously
- **Export Functionality** - Export results in JSON, CSV, and text formats

### Two Input Methods
1. **Boolean Expression Mode** - Enter expressions like `A'B + AC + BC`
2. **Truth Table Mode** - ⭐ NEW: Input output values directly via interactive checkboxes
   - Supports 1-4 outputs
   - Each output gets independent K-map and simplified expression
   - Automatic circuit schematic for each output

### Supported Operations
- **NOT**: `'`, `~`, `!`
- **AND**: `*`, `·`, `.`, `&`
- **OR**: `+`, `|`
- **XOR**: `^`

## Project Structure

```
Kmap/
├── index.html              # Main web interface
├── styles.css              # Application styling
├── js/
│   ├── parser.js          # Boolean expression parser
│   ├── truthTable.js      # Truth table generator
│   ├── kmap.js            # K-map construction logic
│   ├── simplifier.js      # Simplification algorithms
│   ├── schematic.js       # Circuit schematic generator (NEW)
│   └── main.js            # Main application controller
├── tests/
│   └── run-tests.js       # Test suite
├── package.json           # Project metadata
├── README.md             # This file
├── QUICKSTART.md         # Quick start guide
└── EXAMPLES.md           # Detailed usage examples
```

## Usage

### Running the Application

1. **Open in Browser**
   ```bash
   # Simply open index.html in any modern web browser
   # Or use a local server:
   npx http-server .
   ```

### Input Methods

The tool supports **two input modes**:

#### Mode 1: Boolean Expression Input
2. **Enter Boolean Expression**
   - Type your expression using supported operators
   - Examples:
     - `A'B + AC + BC`
     - `AB + CD`
     - `~A*B + C`

3. **Generate Results**
   - Click "Generate Results" to see:
     - Complete truth table
     - K-map visualization
     - Simplified SOP and POS forms

#### Mode 2: Truth Table Input
2. **Switch to Truth Table Mode**
   - Click the "Truth Table" button at the top

3. **Configure Variables**
   - Select number of variables (2-6)
   - Enter variable names (comma-separated, e.g., `A,B,C`)

4. **Create and Fill Truth Table**
   - Click "Create Truth Table" to generate input table
   - Check boxes for output value = 1, uncheck for 0
   - Each row represents a minterm combination

5. **Generate Results**
   - Click "Generate Results" to see:
     - Completed truth table
     - K-map visualization
     - Simplified SOP and POS expressions

### Exporting Results

6. **Export Results**
   - Click "Export Results" to download JSON file containing:
     - Truth table data (CSV and text formats)
     - K-map structure
     - Simplified expressions
     - Prime implicants

### Running Tests

```bash
node tests/run-tests.js
```

## Examples

### Example 1: From Boolean Expression
```
Input Mode: Boolean Expression
Input: A + B
Output SOP: A + B
Output POS: (A + B)
```

### Example 2: 3-Variable Expression
```
Input Mode: Boolean Expression
Input: A'B + BC + AC
Output: Simplified using K-map grouping
```

### Example 3: From Truth Table
```
Input Mode: Truth Table
Variables: A, B, C (3 variables)
Outputs: [0, 0, 0, 1, 0, 1, 1, 1]
         (rows 3, 5, 6, 7 have output = 1)
Result:
  - Truth table displayed
  - K-map generated showing minterms 3, 5, 6, 7
  - Simplified SOP expression generated
```

### Example 4: 4-Variable Expression
```
Input Mode: Boolean Expression
Input: AB + CD + A'C'D'
Output: Minimized SOP/POS forms
```

## Technical Details

### Parser Module
- Converts Boolean expressions to evaluable JavaScript format
- Extracts variables automatically
- Validates expression syntax
- Handles multiple operator notations

### Truth Table Generator
- Generates all 2^n combinations
- Tracks minterms and maxterms
- Supports direct output specification
- Exports to CSV and text formats

### K-map Generator
- Uses Gray code ordering for proper adjacency
- Supports 2-6 variable maps
- Multiple map visualization for 5-6 variables
- Proper labeling with variable combinations

### Simplification Engine
- Implements Quine-McCluskey algorithm
- Finds all prime implicants
- Identifies essential prime implicants
- Generates minimal SOP and POS forms

## API Documentation

### BooleanParser
```javascript
const parser = new BooleanParser();
const result = parser.parse('A + B');
// result: { original, cleaned, variables, evaluable, valid }
```

### TruthTableGenerator
```javascript
const ttGen = new TruthTableGenerator();
const truthTable = ttGen.generate(parsedExpression);
// truthTable: { variables, rows, minterms, maxterms, numVars }
```

### KarnaughMap
```javascript
const kmapGen = new KarnaughMap();
const kmap = kmapGen.generate(truthTable);
// kmap: { grid, rowLabels, colLabels, dimensions, ... }
```

### KMapSimplifier
```javascript
const simplifier = new KMapSimplifier();
const result = simplifier.simplify(kmap);
// result: { sop, pos, primeImplicants, essentialPrimeImplicants }
```

## Limitations

- Maximum 6 variables for K-map visualization
- Minimum 2 variables required
- Expression must use supported operators
- Variables must be single letters (A-Z)

## Future Enhancements

- [ ] Visual grouping indicators on K-maps
- [ ] Step-by-step simplification explanation
- [ ] Don't care condition support (X values)
- [ ] Multiple output function handling
- [ ] Additional export formats (PNG, PDF)
- [ ] Dark mode support
- [ ] Save/load project functionality

## Browser Compatibility

- Chrome/Edge: ✓
- Firefox: ✓
- Safari: ✓
- Opera: ✓

Requires ES6+ support.

## Quick Links

- 📖 **[Quick Start Guide](QUICKSTART.md)** - Get started in 2 minutes
- 📚 **[Detailed Examples](EXAMPLES.md)** - Step-by-step usage examples
- 🧪 **[Running Tests](tests/run-tests.js)** - Test suite for verification

## License

MIT License - Feel free to use and modify for educational and commercial purposes.

## Contributing

Contributions are welcome! Please feel free to submit pull requests or open issues for bugs and feature requests.

## Authors

Created for digital logic design education and engineering applications.

---

## What's New

### v1.2.0 - Multiple Outputs & Circuit Schematics
- 🎨 **Circuit Schematic Generator** - Automatic logic circuit diagrams with AND, OR, NOT gates
- 🔢 **Multiple Output Support** - Handle 1-4 outputs simultaneously
- 📊 **Multi-Output K-maps** - Independent K-maps for each output
- 🔌 **Visual Circuit Design** - SVG-based gate-level schematics
- ⚡ Enhanced truth table input with custom output names

### v1.1.0 - Truth Table Input Mode
- ⭐ Added interactive truth table input mode
- ✨ Users can now start from truth table values directly
- 🎯 Select 2-6 variables and check output boxes
- 🔄 Automatic K-map generation and SOP/POS simplification
- 📝 Enhanced documentation with examples and quick start guide
