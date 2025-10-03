/**
 * Karnaugh Map Generator
 * Generates K-maps from truth table data (2-6 variables)
 */

class KarnaughMap {
    constructor() {
        // Gray code sequences for K-map ordering
        this.grayCode = {
            1: ['0', '1'],
            2: ['00', '01', '11', '10'],
            3: ['000', '001', '011', '010', '110', '111', '101', '100'],
            4: ['0000', '0001', '0011', '0010', '0110', '0111', '0101', '0100',
                '1100', '1101', '1111', '1110', '1010', '1011', '1001', '1000']
        };
    }

    /**
     * Generate K-map from truth table
     * @param {Object} truthTable - Truth table data
     * @returns {Object} - K-map data structure
     */
    generate(truthTable) {
        const { variables, minterms, numVars, dontCares = [] } = truthTable;

        if (numVars < 2 || numVars > 6) {
            throw new Error('K-map supports 2-6 variables only');
        }

        // Create K-map based on number of variables
        let kmap;
        switch (numVars) {
            case 2:
                kmap = this.create2VarKMap(variables, minterms, dontCares);
                break;
            case 3:
                kmap = this.create3VarKMap(variables, minterms, dontCares);
                break;
            case 4:
                kmap = this.create4VarKMap(variables, minterms, dontCares);
                break;
            case 5:
                kmap = this.create5VarKMap(variables, minterms, dontCares);
                break;
            case 6:
                kmap = this.create6VarKMap(variables, minterms, dontCares);
                break;
        }

        return {
            ...kmap,
            variables: variables,
            minterms: minterms,
            dontCares: dontCares,
            numVars: numVars
        };
    }

    /**
     * Create 2-variable K-map (2x2)
     */
    create2VarKMap(variables, minterms, dontCares = []) {
        const grid = [
            [0, 0],
            [0, 0]
        ];

        minterms.forEach(m => {
            const row = Math.floor(m / 2);
            const col = m % 2;
            grid[row][col] = 1;
        });

        dontCares.forEach(m => {
            const row = Math.floor(m / 2);
            const col = m % 2;
            grid[row][col] = 'X';
        });

        return {
            grid: grid,
            rowLabels: ['0', '1'],
            colLabels: ['0', '1'],
            rowVars: [variables[0]],
            colVars: [variables[1]],
            dimensions: { rows: 2, cols: 2 }
        };
    }

    /**
     * Create 3-variable K-map (2x4)
     */
    create3VarKMap(variables, minterms, dontCares = []) {
        const grid = [
            [0, 0, 0, 0],
            [0, 0, 0, 0]
        ];

        const grayCode = ['00', '01', '11', '10'];

        minterms.forEach(m => {
            const binary = m.toString(2).padStart(3, '0');
            const rowBit = binary[0];
            const colBits = binary.slice(1);

            const row = parseInt(rowBit);
            const col = grayCode.indexOf(colBits);

            grid[row][col] = 1;
        });

        dontCares.forEach(m => {
            const binary = m.toString(2).padStart(3, '0');
            const rowBit = binary[0];
            const colBits = binary.slice(1);

            const row = parseInt(rowBit);
            const col = grayCode.indexOf(colBits);

            grid[row][col] = 'X';
        });

        return {
            grid: grid,
            rowLabels: ['0', '1'],
            colLabels: ['00', '01', '11', '10'],
            rowVars: [variables[0]],
            colVars: [variables[1], variables[2]],
            dimensions: { rows: 2, cols: 4 }
        };
    }

    /**
     * Create 4-variable K-map (4x4)
     */
    create4VarKMap(variables, minterms, dontCares = []) {
        const grid = [
            [0, 0, 0, 0],
            [0, 0, 0, 0],
            [0, 0, 0, 0],
            [0, 0, 0, 0]
        ];

        const grayCode = ['00', '01', '11', '10'];

        minterms.forEach(m => {
            const binary = m.toString(2).padStart(4, '0');
            const rowBits = binary.slice(0, 2);
            const colBits = binary.slice(2);

            const row = grayCode.indexOf(rowBits);
            const col = grayCode.indexOf(colBits);

            grid[row][col] = 1;
        });

        dontCares.forEach(m => {
            const binary = m.toString(2).padStart(4, '0');
            const rowBits = binary.slice(0, 2);
            const colBits = binary.slice(2);

            const row = grayCode.indexOf(rowBits);
            const col = grayCode.indexOf(colBits);

            grid[row][col] = 'X';
        });

        return {
            grid: grid,
            rowLabels: ['00', '01', '11', '10'],
            colLabels: ['00', '01', '11', '10'],
            rowVars: [variables[0], variables[1]],
            colVars: [variables[2], variables[3]],
            dimensions: { rows: 4, cols: 4 }
        };
    }

    /**
     * Create 5-variable K-map (4x8 or 2 4x4 maps)
     */
    create5VarKMap(variables, minterms, dontCares = []) {
        const grid1 = Array(4).fill(0).map(() => Array(4).fill(0));
        const grid2 = Array(4).fill(0).map(() => Array(4).fill(0));

        const grayCode = ['00', '01', '11', '10'];

        minterms.forEach(m => {
            const binary = m.toString(2).padStart(5, '0');
            const firstBit = binary[0];
            const rowBits = binary.slice(1, 3);
            const colBits = binary.slice(3);

            const row = grayCode.indexOf(rowBits);
            const col = grayCode.indexOf(colBits);

            if (firstBit === '0') {
                grid1[row][col] = 1;
            } else {
                grid2[row][col] = 1;
            }
        });

        dontCares.forEach(m => {
            const binary = m.toString(2).padStart(5, '0');
            const firstBit = binary[0];
            const rowBits = binary.slice(1, 3);
            const colBits = binary.slice(3);

            const row = grayCode.indexOf(rowBits);
            const col = grayCode.indexOf(colBits);

            if (firstBit === '0') {
                grid1[row][col] = 'X';
            } else {
                grid2[row][col] = 'X';
            }
        });

        return {
            grid: [grid1, grid2],
            rowLabels: ['00', '01', '11', '10'],
            colLabels: ['00', '01', '11', '10'],
            rowVars: [variables[1], variables[2]],
            colVars: [variables[3], variables[4]],
            mapLabels: [variables[0] + "=0", variables[0] + "=1"],
            dimensions: { rows: 4, cols: 4, maps: 2 }
        };
    }

    /**
     * Create 6-variable K-map (4 4x4 maps)
     */
    create6VarKMap(variables, minterms, dontCares = []) {
        const grids = [
            Array(4).fill(0).map(() => Array(4).fill(0)),
            Array(4).fill(0).map(() => Array(4).fill(0)),
            Array(4).fill(0).map(() => Array(4).fill(0)),
            Array(4).fill(0).map(() => Array(4).fill(0))
        ];

        const grayCode = ['00', '01', '11', '10'];

        minterms.forEach(m => {
            const binary = m.toString(2).padStart(6, '0');
            const firstTwoBits = binary.slice(0, 2);
            const rowBits = binary.slice(2, 4);
            const colBits = binary.slice(4);

            const mapIndex = grayCode.indexOf(firstTwoBits);
            const row = grayCode.indexOf(rowBits);
            const col = grayCode.indexOf(colBits);

            grids[mapIndex][row][col] = 1;
        });

        dontCares.forEach(m => {
            const binary = m.toString(2).padStart(6, '0');
            const firstTwoBits = binary.slice(0, 2);
            const rowBits = binary.slice(2, 4);
            const colBits = binary.slice(4);

            const mapIndex = grayCode.indexOf(firstTwoBits);
            const row = grayCode.indexOf(rowBits);
            const col = grayCode.indexOf(colBits);

            grids[mapIndex][row][col] = 'X';
        });

        return {
            grid: grids,
            rowLabels: ['00', '01', '11', '10'],
            colLabels: ['00', '01', '11', '10'],
            rowVars: [variables[2], variables[3]],
            colVars: [variables[4], variables[5]],
            mapLabels: [
                variables[0] + variables[1] + "=00",
                variables[0] + variables[1] + "=01",
                variables[0] + variables[1] + "=11",
                variables[0] + variables[1] + "=10"
            ],
            dimensions: { rows: 4, cols: 4, maps: 4 }
        };
    }

    /**
     * Render K-map as HTML
     * @param {Object} kmap - K-map data
     * @returns {string} - HTML string
     */
    renderHTML(kmap) {
        const { grid, rowLabels, colLabels, rowVars, colVars, dimensions, mapLabels } = kmap;

        let html = '';

        // Handle multiple maps (5-6 variables)
        if (Array.isArray(grid[0][0]) === false) {
            // Single map (2-4 variables)
            html += this.renderSingleMap(grid, rowLabels, colLabels, rowVars, colVars);
        } else {
            // Multiple maps (5-6 variables)
            grid.forEach((singleGrid, index) => {
                html += `<div class="kmap-label">${mapLabels[index]}</div>`;
                html += this.renderSingleMap(singleGrid, rowLabels, colLabels, rowVars, colVars);
                html += '<br>';
            });
        }

        return html;
    }

    /**
     * Render a single K-map grid
     */
    renderSingleMap(grid, rowLabels, colLabels, rowVars, colVars) {
        let html = '<div class="kmap-grid">';

        // Column headers
        html += '<div class="kmap-row">';
        html += `<div class="kmap-cell header">${rowVars.join('')}\\${colVars.join('')}</div>`;
        colLabels.forEach(label => {
            html += `<div class="kmap-cell header">${label}</div>`;
        });
        html += '</div>';

        // Data rows
        grid.forEach((row, rowIndex) => {
            html += '<div class="kmap-row">';
            html += `<div class="kmap-cell header">${rowLabels[rowIndex]}</div>`;
            row.forEach(value => {
                let className;
                if (value === 'X') {
                    className = 'dontcare';
                } else if (value === 1) {
                    className = 'one';
                } else {
                    className = 'zero';
                }
                html += `<div class="kmap-cell ${className}">${value}</div>`;
            });
            html += '</div>';
        });

        html += '</div>';
        return html;
    }

    /**
     * Get minterm index from K-map position
     * @param {number} row - Row index
     * @param {number} col - Column index
     * @param {number} numVars - Number of variables
     * @param {number} mapIndex - Map index (for 5-6 var K-maps)
     * @returns {number} - Minterm index
     */
    getMintermFromPosition(row, col, numVars, mapIndex = 0) {
        const grayCode = ['00', '01', '11', '10'];

        switch (numVars) {
            case 2:
                return row * 2 + col;
            case 3:
                return parseInt(row + grayCode[col], 2);
            case 4:
                return parseInt(grayCode[row] + grayCode[col], 2);
            case 5:
                return parseInt(mapIndex + grayCode[row] + grayCode[col], 2);
            case 6:
                return parseInt(grayCode[mapIndex] + grayCode[row] + grayCode[col], 2);
            default:
                return 0;
        }
    }
}

// Make available globally
if (typeof module !== 'undefined' && module.exports) {
    module.exports = KarnaughMap;
}
