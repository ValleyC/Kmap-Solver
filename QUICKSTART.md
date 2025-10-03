# Quick Start Guide

Get started with the Boolean Logic Simplification Tool in 2 minutes!

---

## Opening the Tool

1. Navigate to the `Kmap` folder
2. Open `index.html` in any modern web browser
   - Or run a local server: `npx http-server .`

---

## Method 1: From Boolean Expression (Fast)

Perfect when you already have a Boolean expression to simplify.

```
┌─────────────────────────────────────────┐
│  Input: Boolean Expression              │
├─────────────────────────────────────────┤
│  A'B + AC + BC                          │
│                                         │
│  [Generate Results]                     │
└─────────────────────────────────────────┘
         ↓
┌─────────────────────────────────────────┐
│  Truth Table | K-map | Simplified SOP  │
└─────────────────────────────────────────┘
```

### Example Input Formats
- `A + B`
- `A'B + C`
- `~A*B + C*D`
- `(A+B)(C+D)`

### Supported Operators
- **NOT**: `'` `~` `!`
- **AND**: `*` `·` `.` (or implicit: `AB`)
- **OR**: `+` `|`

---

## Method 2: From Truth Table (Visual)

Perfect when you have specific outputs or requirements.

### Step 1: Switch Mode
```
┌──────────────────────────────────────┐
│ [Boolean Expression] [Truth Table]  │  ← Click "Truth Table"
└──────────────────────────────────────┘
```

### Step 2: Configure
```
Number of Variables: [3 ▼]
Variable Names: A,B,C
[Create Truth Table]
```

### Step 3: Set Outputs
```
┌────────────────────────────────┐
│ A │ B │ C │ Output            │
├───┼───┼───┼───────────────────┤
│ 0 │ 0 │ 0 │ [ ]  ← Check for 1│
│ 0 │ 0 │ 1 │ [ ]               │
│ 0 │ 1 │ 0 │ [✓]               │
│ 0 │ 1 │ 1 │ [✓]               │
│ 1 │ 0 │ 0 │ [ ]               │
│ 1 │ 0 │ 1 │ [✓]               │
│ 1 │ 1 │ 0 │ [✓]               │
│ 1 │ 1 │ 1 │ [✓]               │
└───┴───┴───┴───────────────────┘
```

### Step 4: Generate
```
[Generate Results]
```

---

## Understanding the Output

### 1. Truth Table
Shows all input combinations and outputs
- Helps verify your logic
- Shows minterms (rows with output=1)

### 2. K-map (Karnaugh Map)
Visual representation with Gray code ordering
- Green cells = 1
- Red cells = 0
- Grouped for simplification

### 3. Simplified Expressions
- **SOP** (Sum of Products): OR of AND terms
- **POS** (Product of Sums): AND of OR terms

---

## Common Use Cases

### 🎓 Students
```
Problem: Simplify F(A,B,C) = Σm(1,3,5,7)

Solution:
1. Switch to "Truth Table" mode
2. Select 3 variables (A,B,C)
3. Check rows 1, 3, 5, 7
4. Click Generate
5. Get simplified SOP!
```

### 🔧 Engineers
```
Need: 3-input majority function

Steps:
1. Truth Table mode, 3 variables
2. Check outputs where ≥2 inputs are 1
3. Generate → Get minimal circuit
4. Export results for documentation
```

### 📚 Educators
```
Teaching: K-map grouping

Demo:
1. Enter expression like "AB + BC + AC"
2. Show students truth table
3. Display K-map visualization
4. Explain groupings in simplified result
```

---

## Export Your Work

After generating results:

```
[Export Results]  ← Downloads JSON file
```

Contains:
- ✓ Truth table (CSV & text formats)
- ✓ K-map data
- ✓ SOP & POS expressions
- ✓ Prime implicants
- ✓ Timestamp

---

## Variable Limits

| Variables | K-map Size | Total Rows |
|-----------|------------|------------|
| 2         | 2×2        | 4          |
| 3         | 2×4        | 8          |
| 4         | 4×4        | 16         |
| 5         | 2× (4×4)   | 32         |
| 6         | 4× (4×4)   | 64         |

---

## Pro Tips

✨ **Keyboard Shortcut**: Press `Enter` after typing expression

⚡ **Quick Test**: Try example `A'B + AC + BC`

🎯 **Variable Names**: Use uppercase for best results

🔄 **Switch Modes**: Freely switch between Expression and Truth Table modes

📤 **Export Early**: Export results before making changes

---

## Need Help?

- Check `EXAMPLES.md` for detailed examples
- See `README.md` for full documentation
- Review test files in `tests/` for usage patterns

---

## Ready to Start!

1. Open `index.html`
2. Choose your input method
3. Enter your data
4. Click "Generate Results"
5. View simplified Boolean expressions!

**Happy simplifying! 🎉**
