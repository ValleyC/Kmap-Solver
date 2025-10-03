# Usage Examples

This document provides detailed examples of how to use the Boolean Logic Simplification Tool.

---

## Example 1: Simple Boolean Expression (2 Variables)

### Scenario
Simplify the expression: **A + B**

### Steps
1. Open the tool in your browser
2. Ensure "Boolean Expression" mode is selected (default)
3. Enter: `A + B`
4. Click "Generate Results"

### Expected Output
- **Truth Table**: 4 rows showing all combinations
  ```
  A | B | Output
  0 | 0 |   0
  0 | 1 |   1
  1 | 0 |   1
  1 | 1 |   1
  ```
- **K-map**: 2×2 grid with 3 cells marked as 1
- **SOP**: `A + B`
- **POS**: `(A + B)`

---

## Example 2: Three-Variable Expression

### Scenario
Simplify: **AB + BC + AC** (majority function)

### Steps
1. Select "Boolean Expression" mode
2. Enter: `AB + BC + AC`
3. Click "Generate Results"

### Expected Output
- **Truth Table**: 8 rows
  - Minterms: 3, 5, 6, 7 (rows where at least 2 variables are 1)
- **K-map**: 2×4 grid showing groupings
- **Simplified SOP**: Should identify optimal groupings
- **Minterms**: m(3, 5, 6, 7)

---

## Example 3: Using Truth Table Input Mode

### Scenario
Create a function where output is 1 for minterms 1, 2, 5, 6 with variables A, B, C

### Steps
1. Click "Truth Table" button to switch modes
2. Select "3 Variables" from dropdown
3. Variable names should auto-fill to: `A,B,C`
4. Click "Create Truth Table"
5. An interactive table appears with 8 rows
6. Check the boxes for rows:
   - Row 1 (001): ✓
   - Row 2 (010): ✓
   - Row 5 (101): ✓
   - Row 6 (110): ✓
7. Click "Generate Results"

### Expected Output
- **Truth Table**: Shows your selected outputs
- **K-map**: 2×4 grid with cells [1,2,5,6] marked
- **Simplified SOP**: Optimized expression (likely `A'BC' + AB'C' + ABC + AB'C`)
- Can be further simplified based on groupings

---

## Example 4: Four-Variable K-map

### Scenario (Expression Mode)
Simplify: **AB + CD**

### Steps
1. Use "Boolean Expression" mode
2. Enter: `AB + CD`
3. Click "Generate Results"

### Expected Output
- **Truth Table**: 16 rows
- **K-map**: 4×4 grid with Gray code ordering
- **Simplified SOP**: `AB + CD` (already minimal)

---

## Example 5: Custom Variables (Truth Table Mode)

### Scenario
Design a function with variables W, X, Y where output follows a specific pattern

### Steps
1. Switch to "Truth Table" mode
2. Select "3 Variables"
3. Change variable names to: `W,X,Y`
4. Click "Create Truth Table"
5. Fill in your desired output pattern
6. Click "Generate Results"

### Use Case
This is useful when:
- You have a specific truth table from a problem
- You're designing logic based on requirements
- You want to reverse-engineer an expression from outputs
- You're checking homework or textbook problems

---

## Example 6: Don't Care Conditions (Workaround)

### Scenario
While the tool doesn't have explicit don't-care support yet, you can:

### Approach 1: Maximize 1s
Mark don't-cares as 1 to get the most simplified expression

### Approach 2: Minimize 1s
Mark don't-cares as 0 for a different simplification

### Future Feature
Explicit X/don't-care support coming in future updates

---

## Example 7: Exporting Results

### After generating any result:
1. Click "Export Results" button
2. Downloads `boolean-logic-results.json`
3. Contains:
   - Original expression (if applicable)
   - Complete truth table in CSV format
   - K-map structure data
   - Simplified SOP and POS
   - All prime implicants
   - Timestamp

### Use the exported data for:
- Documentation
- Reports
- Further analysis
- Sharing with others
- Importing into other tools

---

## Tips and Tricks

### Input Operators
- NOT: `A'`, `~A`, or `!A`
- AND: `AB`, `A*B`, `A·B`, or `A&B`
- OR: `A+B` or `A|B`
- XOR: `A^B`

### Variable Naming
- Single letters A-Z work best
- Case-sensitive (use uppercase for consistency)
- In truth table mode, you can use custom names like W, X, Y, Z

### Validation
- Minimum 2 variables
- Maximum 6 variables for K-maps
- Expression mode validates syntax automatically
- Truth table mode validates variable count

### Common Mistakes
- ❌ `A + B + C + D + E + F + G` - Too many variables (>6)
- ❌ `a` - Use uppercase: `A`
- ❌ Forgetting to click "Create Truth Table" before "Generate Results"
- ✓ `A'B + BC + AC` - Correct format
- ✓ Create table first in truth table mode

---

## Real-World Applications

1. **Digital Circuit Design**
   - Minimize gate count
   - Optimize combinational logic
   - Verify circuit behavior

2. **Computer Science Education**
   - Learn Boolean algebra
   - Understand K-map simplification
   - Practice logic design

3. **Homework & Exams**
   - Verify manual simplifications
   - Check truth table conversions
   - Validate K-map groupings

4. **Embedded Systems**
   - Design control logic
   - Optimize state machines
   - Reduce hardware complexity
