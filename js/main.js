/**
 * Main Application Controller
 * Handles UI interactions and coordinates between modules
 */

class BooleanLogicApp {
    constructor() {
        this.parser = new BooleanParser();
        this.truthTableGen = new TruthTableGenerator();
        this.kmapGen = new KarnaughMap();
        this.simplifier = new KMapSimplifier();
        this.schematicGen = new SchematicGenerator();

        this.currentData = {
            parsed: null,
            truthTable: null,
            kmap: null,
            simplified: null,
            schematic: null
        };

        this.currentMode = 'expression'; // 'expression' or 'truthtable'
        this.truthTableInputData = null;
        this.multiOutputData = []; // For multiple outputs

        this.initializeEventListeners();
    }

    /**
     * Initialize UI event listeners
     */
    initializeEventListeners() {
        const generateBtn = document.getElementById('generate-btn');
        const exportBtn = document.getElementById('export-btn');
        const expressionInput = document.getElementById('expression-input');
        const modeExpressionBtn = document.getElementById('mode-expression-btn');
        const modeTruthtableBtn = document.getElementById('mode-truthtable-btn');
        const createTableBtn = document.getElementById('create-table-btn');
        const numVariablesSelect = document.getElementById('num-variables');

        if (generateBtn) {
            generateBtn.addEventListener('click', () => this.handleGenerate());
        }

        if (exportBtn) {
            exportBtn.addEventListener('click', () => this.handleExport());
        }

        if (expressionInput) {
            expressionInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    this.handleGenerate();
                }
            });
        }

        if (modeExpressionBtn) {
            modeExpressionBtn.addEventListener('click', () => this.switchMode('expression'));
        }

        if (modeTruthtableBtn) {
            modeTruthtableBtn.addEventListener('click', () => this.switchMode('truthtable'));
        }

        if (createTableBtn) {
            createTableBtn.addEventListener('click', () => this.createTruthTableInput());
        }

        if (numVariablesSelect) {
            numVariablesSelect.addEventListener('change', () => this.updateVariableNames());
        }

        const numOutputsSelect = document.getElementById('num-outputs');
        if (numOutputsSelect) {
            numOutputsSelect.addEventListener('change', () => this.updateOutputNames());
        }
    }

    /**
     * Update output names input based on number of outputs
     */
    updateOutputNames() {
        const numOutputs = parseInt(document.getElementById('num-outputs').value);
        const outputNames = document.getElementById('output-names');
        const defaultNames = Array.from({ length: numOutputs }, (_, i) =>
            String.fromCharCode(70 + i) // F, G, H, I...
        ).join(',');
        outputNames.value = defaultNames;
    }

    /**
     * Switch between input modes
     * @param {string} mode - 'expression' or 'truthtable'
     */
    switchMode(mode) {
        this.currentMode = mode;

        const expressionMode = document.getElementById('expression-input-mode');
        const truthtableMode = document.getElementById('truthtable-input-mode');
        const expressionBtn = document.getElementById('mode-expression-btn');
        const truthtableBtn = document.getElementById('mode-truthtable-btn');

        if (mode === 'expression') {
            expressionMode.style.display = 'block';
            truthtableMode.style.display = 'none';
            expressionBtn.classList.add('active');
            truthtableBtn.classList.remove('active');
        } else {
            expressionMode.style.display = 'none';
            truthtableMode.style.display = 'block';
            expressionBtn.classList.remove('active');
            truthtableBtn.classList.add('active');
        }
    }

    /**
     * Update variable names input based on number of variables
     */
    updateVariableNames() {
        const numVars = parseInt(document.getElementById('num-variables').value);
        const variableNames = document.getElementById('variable-names');
        const defaultNames = Array.from({ length: numVars }, (_, i) =>
            String.fromCharCode(65 + i)
        ).join(',');
        variableNames.value = defaultNames;
    }

    /**
     * Create interactive truth table input
     */
    createTruthTableInput() {
        const numVars = parseInt(document.getElementById('num-variables').value);
        const numOutputs = parseInt(document.getElementById('num-outputs').value);
        const variableNamesInput = document.getElementById('variable-names').value;
        const outputNamesInput = document.getElementById('output-names').value;

        const variables = variableNamesInput.split(',').map(v => v.trim()).filter(v => v);
        const outputNames = outputNamesInput.split(',').map(v => v.trim()).filter(v => v);

        if (variables.length !== numVars) {
            this.showError(`Please enter exactly ${numVars} variable names`);
            return;
        }

        if (outputNames.length !== numOutputs) {
            this.showError(`Please enter exactly ${numOutputs} output names`);
            return;
        }

        const container = document.getElementById('truth-table-input-container');
        const numRows = Math.pow(2, numVars);

        let html = '<div class="truth-table-input">';
        html += '<p><strong>Enter output values (check for 1, uncheck for 0):</strong></p>';
        html += '<table><thead><tr>';

        // Input variable headers
        variables.forEach(v => {
            html += `<th>${v}</th>`;
        });

        // Output headers
        outputNames.forEach(outName => {
            html += `<th>${outName}</th>`;
        });
        html += '</tr></thead><tbody>';

        // Rows
        for (let i = 0; i < numRows; i++) {
            const binary = i.toString(2).padStart(numVars, '0');
            html += '<tr>';

            // Input columns
            binary.split('').forEach(bit => {
                html += `<td>${bit}</td>`;
            });

            // Output columns with three-state buttons (0, 1, X)
            outputNames.forEach((outName, outIdx) => {
                html += `<td class="input-cell">
                    <button class="output-cell" data-row="${i}" data-output="${outIdx}" data-state="0">0</button>
                </td>`;
            });
            html += '</tr>';
        }

        html += '</tbody></table></div>';
        container.innerHTML = html;

        // Add click event listeners for three-state buttons
        setTimeout(() => {
            const buttons = document.querySelectorAll('.output-cell');
            buttons.forEach(button => {
                button.addEventListener('click', () => this.toggleOutputState(button));
            });
        }, 0);

        // Store reference for later
        this.truthTableInputData = {
            variables: variables,
            numVars: numVars,
            outputNames: outputNames,
            numOutputs: numOutputs
        };
    }

    /**
     * Toggle output cell between 0, 1, and X (don't care)
     * @param {HTMLElement} button - The button element
     */
    toggleOutputState(button) {
        const currentState = button.getAttribute('data-state');
        let newState;

        // Cycle: 0 → 1 → X → 0
        switch (currentState) {
            case '0':
                newState = '1';
                button.textContent = '1';
                button.setAttribute('data-state', '1');
                button.className = 'output-cell state-1';
                break;
            case '1':
                newState = 'X';
                button.textContent = 'X';
                button.setAttribute('data-state', 'X');
                button.className = 'output-cell state-x';
                break;
            case 'X':
                newState = '0';
                button.textContent = '0';
                button.setAttribute('data-state', '0');
                button.className = 'output-cell state-0';
                break;
        }
    }

    /**
     * Handle generate button click
     */
    handleGenerate() {
        if (this.currentMode === 'expression') {
            this.handleGenerateFromExpression();
        } else {
            this.handleGenerateFromTruthTable();
        }
    }

    /**
     * Generate from Boolean expression
     */
    handleGenerateFromExpression() {
        const input = document.getElementById('expression-input');
        const expression = input.value.trim();

        if (!expression) {
            this.showError('Please enter a Boolean expression');
            return;
        }

        try {
            // Parse expression
            this.currentData.parsed = this.parser.parse(expression);

            if (!this.currentData.parsed.valid) {
                this.showError('Invalid expression: ' + this.currentData.parsed.error);
                return;
            }

            const numVars = this.currentData.parsed.variables.length;

            if (numVars < 2) {
                this.showError('Expression must have at least 2 variables');
                return;
            }

            if (numVars > 6) {
                this.showError('K-map supports maximum 6 variables');
                return;
            }

            // Generate truth table
            this.currentData.truthTable = this.truthTableGen.generate(this.currentData.parsed);

            // Generate K-map
            this.currentData.kmap = this.kmapGen.generate(this.currentData.truthTable);

            // Simplify
            this.currentData.simplified = this.simplifier.simplify(this.currentData.kmap);

            // Display results
            this.displayResults();

        } catch (error) {
            this.showError('Error: ' + error.message);
            console.error(error);
        }
    }

    /**
     * Generate from truth table input
     */
    handleGenerateFromTruthTable() {
        if (!this.truthTableInputData) {
            this.showError('Please create a truth table first');
            return;
        }

        try {
            const { variables, numVars, outputNames, numOutputs } = this.truthTableInputData;
            this.multiOutputData = [];

            if (numOutputs === 1) {
                // Single output
                const buttons = document.querySelectorAll('.output-cell');
                const outputs = [];
                const dontCares = [];

                buttons.forEach((button, idx) => {
                    const state = button.getAttribute('data-state');
                    if (state === '1') {
                        outputs.push(1);
                    } else if (state === 'X') {
                        outputs.push('X');
                        dontCares.push(idx);
                    } else {
                        outputs.push(0);
                    }
                });

                this.currentData.truthTable = this.truthTableGen.generateFromOutputs(variables, outputs, dontCares);
                this.currentData.kmap = this.kmapGen.generate(this.currentData.truthTable);
                this.currentData.simplified = this.simplifier.simplify(this.currentData.kmap);

                // Display results
                this.displayResults();
            } else {
                // Multiple outputs
                const numRows = Math.pow(2, numVars);

                for (let outIdx = 0; outIdx < numOutputs; outIdx++) {
                    const outputs = [];
                    const dontCares = [];

                    // Collect outputs for this output column
                    for (let row = 0; row < numRows; row++) {
                        const button = document.querySelector(
                            `.output-cell[data-row="${row}"][data-output="${outIdx}"]`
                        );

                        if (button) {
                            const state = button.getAttribute('data-state');
                            if (state === '1') {
                                outputs.push(1);
                            } else if (state === 'X') {
                                outputs.push('X');
                                dontCares.push(row);
                            } else {
                                outputs.push(0);
                            }
                        } else {
                            outputs.push(0);
                        }
                    }

                    // Generate truth table, K-map, and simplified expression for this output
                    const truthTable = this.truthTableGen.generateFromOutputs(variables, outputs, dontCares);
                    const kmap = this.kmapGen.generate(truthTable);
                    const simplified = this.simplifier.simplify(kmap);

                    this.multiOutputData.push({
                        name: outputNames[outIdx],
                        truthTable: truthTable,
                        kmap: kmap,
                        simplified: simplified
                    });
                }

                // Display multi-output results
                this.displayMultiOutputResults();
            }

        } catch (error) {
            this.showError('Error: ' + error.message);
            console.error(error);
        }
    }

    /**
     * Display all results
     */
    displayResults() {
        this.displayTruthTable();
        this.displayKMap();
        this.displaySimplified();
        this.displaySchematic();
    }

    /**
     * Display truth table
     */
    displayTruthTable() {
        const container = document.getElementById('truth-table');
        if (!container) return;

        const html = this.truthTableGen.renderHTML(this.currentData.truthTable);
        container.innerHTML = html;
    }

    /**
     * Display K-map
     */
    displayKMap() {
        const container = document.getElementById('kmap');
        if (!container) return;

        const html = this.kmapGen.renderHTML(this.currentData.kmap);
        container.innerHTML = html;
    }

    /**
     * Display simplified results
     */
    displaySimplified() {
        const sopElement = document.getElementById('sop-result');
        const posElement = document.getElementById('pos-result');

        if (sopElement) {
            sopElement.textContent = this.currentData.simplified.sop;
        }

        if (posElement) {
            posElement.textContent = this.currentData.simplified.pos;
        }
    }

    /**
     * Display circuit schematic
     */
    displaySchematic() {
        const container = document.getElementById('schematic');
        if (!container) return;

        const outputName = this.truthTableInputData ?
            (this.truthTableInputData.outputNames ? this.truthTableInputData.outputNames[0] : 'F') : 'F';

        const svg = this.schematicGen.generateFromSOP(
            this.currentData.simplified.sop,
            this.currentData.truthTable.variables,
            outputName
        );

        container.innerHTML = svg;
    }

    /**
     * Display multi-output results
     */
    displayMultiOutputResults() {
        const { variables } = this.truthTableInputData;

        // Display combined truth table
        this.displayMultiOutputTruthTable();

        // Display K-maps for each output
        this.displayMultiOutputKMaps();

        // Display simplified expressions
        this.displayMultiOutputSimplified();

        // Display schematics
        this.displayMultiOutputSchematics();
    }

    /**
     * Display combined truth table for multiple outputs
     */
    displayMultiOutputTruthTable() {
        const container = document.getElementById('truth-table');
        if (!container) return;

        const { variables, outputNames, numVars } = this.truthTableInputData;
        const numRows = Math.pow(2, numVars);

        let html = '<table><thead><tr>';

        // Input headers
        variables.forEach(variable => {
            html += `<th>${variable}</th>`;
        });

        // Output headers
        outputNames.forEach(outName => {
            html += `<th>${outName}</th>`;
        });

        html += '</tr></thead><tbody>';

        // Rows
        for (let i = 0; i < numRows; i++) {
            const binary = i.toString(2).padStart(numVars, '0');
            html += '<tr>';

            // Input columns
            binary.split('').forEach(bit => {
                html += `<td>${bit}</td>`;
            });

            // Output columns
            this.multiOutputData.forEach(output => {
                const value = output.truthTable.rows[i].output;
                html += `<td class="output-${value}">${value}</td>`;
            });

            html += '</tr>';
        }

        html += '</tbody></table>';
        container.innerHTML = html;
    }

    /**
     * Display K-maps for multiple outputs
     */
    displayMultiOutputKMaps() {
        const container = document.getElementById('kmap');
        if (!container) return;

        let html = '';
        this.multiOutputData.forEach(output => {
            html += `<h3>K-map for ${output.name}</h3>`;
            html += this.kmapGen.renderHTML(output.kmap);
            html += '<br><br>';
        });

        container.innerHTML = html;
    }

    /**
     * Display simplified expressions for multiple outputs
     */
    displayMultiOutputSimplified() {
        const sopElement = document.getElementById('sop-result');
        const posElement = document.getElementById('pos-result');

        if (sopElement) {
            let sopHtml = '';
            this.multiOutputData.forEach(output => {
                sopHtml += `<div><strong>${output.name}:</strong> ${output.simplified.sop}</div>`;
            });
            sopElement.innerHTML = sopHtml;
        }

        if (posElement) {
            let posHtml = '';
            this.multiOutputData.forEach(output => {
                posHtml += `<div><strong>${output.name}:</strong> ${output.simplified.pos}</div>`;
            });
            posElement.innerHTML = posHtml;
        }
    }

    /**
     * Display schematics for multiple outputs
     */
    displayMultiOutputSchematics() {
        const container = document.getElementById('schematic');
        if (!container) return;

        const { variables } = this.truthTableInputData;
        const outputs = this.multiOutputData.map(output => ({
            name: output.name,
            sopExpression: output.simplified.sop
        }));

        const html = this.schematicGen.generateMultiOutput(outputs, variables);
        container.innerHTML = html;
    }

    /**
     * Handle export functionality
     */
    handleExport() {
        if (!this.currentData.truthTable) {
            this.showError('No data to export. Generate results first.');
            return;
        }

        try {
            const data = this.prepareExportData();
            this.downloadAsJSON(data, 'boolean-logic-results.json');
            this.showSuccess('Results exported successfully!');
        } catch (error) {
            this.showError('Export failed: ' + error.message);
        }
    }

    /**
     * Prepare data for export
     * @returns {Object} - Export data
     */
    prepareExportData() {
        return {
            expression: this.currentData.parsed.original,
            variables: this.currentData.parsed.variables,
            truthTable: {
                csv: this.truthTableGen.toCSV(this.currentData.truthTable),
                text: this.truthTableGen.toText(this.currentData.truthTable),
                minterms: this.currentData.truthTable.minterms,
                maxterms: this.currentData.truthTable.maxterms
            },
            kmap: {
                variables: this.currentData.kmap.variables,
                minterms: this.currentData.kmap.minterms,
                dimensions: this.currentData.kmap.dimensions
            },
            simplified: {
                sop: this.currentData.simplified.sop,
                pos: this.currentData.simplified.pos,
                primeImplicants: this.currentData.simplified.primeImplicants.map(pi => ({
                    binary: pi.binary,
                    minterms: pi.minterms
                }))
            },
            timestamp: new Date().toISOString()
        };
    }

    /**
     * Download data as JSON file
     * @param {Object} data - Data to download
     * @param {string} filename - Filename
     */
    downloadAsJSON(data, filename) {
        const json = JSON.stringify(data, null, 2);
        const blob = new Blob([json], { type: 'application/json' });
        const url = URL.createObjectURL(blob);

        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }

    /**
     * Show error message
     * @param {string} message - Error message
     */
    showError(message) {
        this.showMessage(message, 'error');
    }

    /**
     * Show success message
     * @param {string} message - Success message
     */
    showSuccess(message) {
        this.showMessage(message, 'success');
    }

    /**
     * Show message to user
     * @param {string} message - Message text
     * @param {string} type - Message type ('error' or 'success')
     */
    showMessage(message, type = 'error') {
        // Remove existing messages
        const existing = document.querySelectorAll('.error-message, .success-message');
        existing.forEach(el => el.remove());

        // Create new message
        const messageDiv = document.createElement('div');
        messageDiv.className = type === 'error' ? 'error-message' : 'success-message';
        messageDiv.textContent = message;

        // Insert after input section
        const inputSection = document.querySelector('.input-section');
        if (inputSection) {
            inputSection.after(messageDiv);

            // Auto-remove after 5 seconds
            setTimeout(() => {
                messageDiv.remove();
            }, 5000);
        }
    }

    /**
     * Load example expression
     * @param {string} expression - Example expression
     */
    loadExample(expression) {
        const input = document.getElementById('expression-input');
        if (input) {
            input.value = expression;
            this.handleGenerate();
        }
    }
}

// Initialize app when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.app = new BooleanLogicApp();

    // Load a default example
    // Uncomment to auto-load an example on page load
    // window.app.loadExample("A'B + AC + BC");
});

// Expose app globally for debugging
if (typeof module !== 'undefined' && module.exports) {
    module.exports = BooleanLogicApp;
}
