# Boolean Logic Simplification Tool

A comprehensive web-based tool for Boolean logic expression analysis, featuring automatic conversion between Boolean expressions, truth tables, and Karnaugh maps (K-maps), with integrated simplification algorithms.

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
└── README.md             # This file
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


