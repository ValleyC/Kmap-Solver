/**
 * Truth Table Generator
 * Generates truth tables from parsed Boolean expressions
 */

class TruthTableGenerator {
    /**
     * Generate truth table for given expression
     * @param {Object} parsedExpression - Parsed expression from BooleanParser
     * @returns {Object} - Truth table data
     */
    generate(parsedExpression) {
        const { variables, evaluable } = parsedExpression;
        const numVars = variables.length;
        const numRows = Math.pow(2, numVars);

        const rows = [];
        const minterms = [];
        const maxterms = [];

        // Generate all combinations
        for (let i = 0; i < numRows; i++) {
            const binary = i.toString(2).padStart(numVars, '0');
            const values = {};

            // Create variable value mapping
            variables.forEach((variable, index) => {
                values[variable] = parseInt(binary[index]);
            });

            // Evaluate expression
            const parser = new BooleanParser();
            const output = parser.evaluate(evaluable, values);

            // Track minterms and maxterms
            if (output === 1) {
                minterms.push(i);
            } else {
                maxterms.push(i);
            }

            rows.push({
                index: i,
                inputs: values,
                output: output,
                binary: binary
            });
        }

        return {
            variables: variables,
            rows: rows,
            minterms: minterms,
            maxterms: maxterms,
            numVars: numVars
        };
    }

    /**
     * Render truth table as HTML
     * @param {Object} truthTable - Truth table data
     * @returns {string} - HTML string
     */
    renderHTML(truthTable) {
        const { variables, rows } = truthTable;

        let html = '<table><thead><tr>';

        // Headers
        variables.forEach(variable => {
            html += `<th>${variable}</th>`;
        });
        html += '<th>Output</th>';
        html += '</tr></thead><tbody>';

        // Rows
        rows.forEach(row => {
            html += '<tr>';
            variables.forEach(variable => {
                html += `<td>${row.inputs[variable]}</td>`;
            });
            html += `<td class="output-${row.output}">${row.output}</td>`;
            html += '</tr>';
        });

        html += '</tbody></table>';
        return html;
    }

    /**
     * Generate truth table from direct input (no expression)
     * @param {Array} variables - Variable names
     * @param {Array} outputs - Output values for each row (0, 1, or 'X')
     * @param {Array} dontCares - Array of indices for don't care terms (optional)
     * @returns {Object} - Truth table data
     */
    generateFromOutputs(variables, outputs, dontCares = []) {
        const numVars = variables.length;
        const numRows = Math.pow(2, numVars);

        if (outputs.length !== numRows) {
            throw new Error(`Expected ${numRows} output values, got ${outputs.length}`);
        }

        const rows = [];
        const minterms = [];
        const maxterms = [];
        const dontCareTerms = [];

        for (let i = 0; i < numRows; i++) {
            const binary = i.toString(2).padStart(numVars, '0');
            const values = {};

            variables.forEach((variable, index) => {
                values[variable] = parseInt(binary[index]);
            });

            let output = outputs[i];

            // Handle don't care
            if (output === 'X' || dontCares.includes(i)) {
                output = 'X';
                dontCareTerms.push(i);
            } else {
                output = output ? 1 : 0;
                if (output === 1) {
                    minterms.push(i);
                } else {
                    maxterms.push(i);
                }
            }

            rows.push({
                index: i,
                inputs: values,
                output: output,
                binary: binary,
                isDontCare: output === 'X'
            });
        }

        return {
            variables: variables,
            rows: rows,
            minterms: minterms,
            maxterms: maxterms,
            dontCares: dontCareTerms,
            numVars: numVars
        };
    }

    /**
     * Export truth table to CSV format
     * @param {Object} truthTable - Truth table data
     * @returns {string} - CSV string
     */
    toCSV(truthTable) {
        const { variables, rows } = truthTable;

        // Headers
        let csv = variables.join(',') + ',Output\n';

        // Rows
        rows.forEach(row => {
            const inputs = variables.map(v => row.inputs[v]).join(',');
            csv += `${inputs},${row.output}\n`;
        });

        return csv;
    }

    /**
     * Export truth table to plain text
     * @param {Object} truthTable - Truth table data
     * @returns {string} - Text string
     */
    toText(truthTable) {
        const { variables, rows } = truthTable;

        // Calculate column widths
        const colWidth = 4;

        // Headers
        let text = variables.map(v => v.padEnd(colWidth)).join('') + 'Output\n';
        text += '-'.repeat((variables.length + 1) * colWidth) + '\n';

        // Rows
        rows.forEach(row => {
            const inputs = variables.map(v => String(row.inputs[v]).padEnd(colWidth)).join('');
            text += `${inputs}${row.output}\n`;
        });

        return text;
    }
}

// Make available globally
if (typeof module !== 'undefined' && module.exports) {
    module.exports = TruthTableGenerator;
}
