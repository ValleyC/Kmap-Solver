/**
 * Logic Circuit Schematic Generator
 * Generates SVG schematics for Boolean logic circuits using AND, OR, NOT gates
 */

class SchematicGenerator {
    constructor() {
        this.gateWidth = 80;
        this.gateHeight = 60;
        this.spacing = 120;
        this.inputSpacing = 40;
        this.wireColor = '#333';
        this.gateColor = '#667eea';
        this.textColor = '#fff';
    }

    /**
     * Generate circuit schematic from SOP expression
     * @param {string} sopExpression - Simplified SOP expression
     * @param {Array} variables - Input variable names
     * @param {string} outputName - Output signal name
     * @returns {string} - SVG string
     */
    generateFromSOP(sopExpression, variables, outputName = 'F') {
        if (sopExpression === '0') {
            return this.generateConstantCircuit(0, variables, outputName);
        }
        if (sopExpression === '1') {
            return this.generateConstantCircuit(1, variables, outputName);
        }

        // Parse SOP into product terms
        const productTerms = this.parseSOPTerms(sopExpression);

        if (productTerms.length === 0) {
            return this.generateConstantCircuit(0, variables, outputName);
        }

        // Generate circuit
        return this.generateSOPCircuit(productTerms, variables, outputName);
    }

    /**
     * Generate schematic for multiple outputs
     * @param {Array} outputs - Array of {name, sopExpression} objects
     * @param {Array} variables - Input variable names
     * @returns {string} - SVG string with multiple output circuits
     */
    generateMultiOutput(outputs, variables) {
        let allSVGs = [];

        outputs.forEach(output => {
            const svg = this.generateFromSOP(output.sopExpression, variables, output.name);
            allSVGs.push({
                name: output.name,
                svg: svg,
                expression: output.sopExpression
            });
        });

        return this.combineMultiOutputSVGs(allSVGs, variables);
    }

    /**
     * Parse SOP expression into product terms
     * @param {string} sop - SOP expression
     * @returns {Array} - Array of product term objects
     */
    parseSOPTerms(sop) {
        // Split by + (OR)
        const terms = sop.split('+').map(t => t.trim());

        return terms.map(term => {
            const literals = [];
            let i = 0;

            while (i < term.length) {
                const char = term[i];

                if (/[A-Z]/i.test(char)) {
                    // Check if followed by '
                    if (i + 1 < term.length && term[i + 1] === "'") {
                        literals.push({ variable: char, inverted: true });
                        i += 2;
                    } else {
                        literals.push({ variable: char, inverted: false });
                        i++;
                    }
                } else {
                    i++;
                }
            }

            return { literals };
        });
    }

    /**
     * Generate SOP circuit schematic
     * @param {Array} productTerms - Array of product terms
     * @param {Array} variables - Variable names
     * @param {string} outputName - Output name
     * @returns {string} - SVG string
     */
    generateSOPCircuit(productTerms, variables, outputName) {
        const layers = {
            inputs: [],
            notGates: [],
            andGates: [],
            orGate: null,
            output: null
        };

        // Calculate required NOT gates
        const neededInversions = new Set();
        productTerms.forEach(term => {
            term.literals.forEach(lit => {
                if (lit.inverted) {
                    neededInversions.add(lit.variable);
                }
            });
        });

        // Layer 1: Inputs
        let yPos = 50;
        variables.forEach((variable, idx) => {
            layers.inputs.push({
                name: variable,
                x: 50,
                y: yPos,
                needsInversion: neededInversions.has(variable)
            });
            yPos += this.inputSpacing;
        });

        // Layer 2: NOT gates for inverted inputs
        let notYPos = 50;
        neededInversions.forEach(variable => {
            const inputY = layers.inputs.find(inp => inp.name === variable).y;
            layers.notGates.push({
                variable: variable,
                x: 150,
                y: inputY
            });
        });

        // Layer 3: AND gates (one per product term)
        let andYPos = 50;
        productTerms.forEach((term, idx) => {
            layers.andGates.push({
                index: idx,
                x: 300,
                y: andYPos,
                inputs: term.literals
            });
            andYPos += this.gateHeight + 30;
        });

        // Layer 4: OR gate (if multiple terms)
        if (productTerms.length > 1) {
            layers.orGate = {
                x: 450,
                y: 50 + (productTerms.length * (this.gateHeight + 30)) / 3,
                inputCount: productTerms.length
            };
        }

        // Layer 5: Output
        const outputX = productTerms.length > 1 ? 600 : 450;
        layers.output = {
            name: outputName,
            x: outputX,
            y: productTerms.length > 1 ? layers.orGate.y : layers.andGates[0].y
        };

        // Generate SVG
        const svgWidth = outputX + 50;
        const svgHeight = Math.max(andYPos, 300);

        return this.renderCircuitSVG(layers, svgWidth, svgHeight);
    }

    /**
     * Render circuit as SVG
     * @param {Object} layers - Circuit layer data
     * @param {number} width - SVG width
     * @param {number} height - SVG height
     * @returns {string} - SVG string
     */
    renderCircuitSVG(layers, width, height) {
        let svg = `<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">`;
        svg += '<defs>';
        svg += '<marker id="arrowhead" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">';
        svg += '<polygon points="0 0, 10 3.5, 0 7" fill="#333" />';
        svg += '</marker>';
        svg += '</defs>';

        // Draw inputs
        layers.inputs.forEach(input => {
            svg += this.drawInput(input.name, input.x, input.y);
        });

        // Draw NOT gates
        layers.notGates.forEach(notGate => {
            const input = layers.inputs.find(inp => inp.name === notGate.variable);
            svg += this.drawWire(input.x + 40, input.y, notGate.x, notGate.y);
            svg += this.drawNOTGate(notGate.x, notGate.y, notGate.variable + "'");
        });

        // Draw AND gates
        layers.andGates.forEach(andGate => {
            svg += this.drawANDGate(andGate.x, andGate.y, andGate.inputs.length);

            // Draw wires from inputs to AND gates
            andGate.inputs.forEach((literal, idx) => {
                const sourceX = literal.inverted ? 150 + 60 : 50 + 40;
                const sourceInput = layers.inputs.find(inp => inp.name === literal.variable);
                const sourceY = sourceInput.y;

                const targetX = andGate.x;
                const targetY = andGate.y - 15 + (idx * 30);

                svg += this.drawWire(sourceX, sourceY, targetX, targetY);
            });
        });

        // Draw OR gate (if exists)
        if (layers.orGate) {
            svg += this.drawORGate(layers.orGate.x, layers.orGate.y, layers.orGate.inputCount);

            // Draw wires from AND gates to OR gate
            layers.andGates.forEach((andGate, idx) => {
                const sourceX = andGate.x + this.gateWidth;
                const sourceY = andGate.y;
                const targetX = layers.orGate.x;
                const targetY = layers.orGate.y - 20 + (idx * 40);

                svg += this.drawWire(sourceX, sourceY, targetX, targetY);
            });

            // Wire from OR to output
            svg += this.drawWire(layers.orGate.x + this.gateWidth, layers.orGate.y,
                                 layers.output.x - 20, layers.output.y);
        } else if (layers.andGates.length > 0) {
            // Direct wire from single AND to output
            const andGate = layers.andGates[0];
            svg += this.drawWire(andGate.x + this.gateWidth, andGate.y,
                                 layers.output.x - 20, layers.output.y);
        }

        // Draw output
        svg += this.drawOutput(layers.output.name, layers.output.x, layers.output.y);

        svg += '</svg>';
        return svg;
    }

    /**
     * Draw input terminal
     */
    drawInput(name, x, y) {
        return `<circle cx="${x}" cy="${y}" r="5" fill="${this.wireColor}" />
                <text x="${x - 20}" y="${y + 5}" font-family="Arial" font-size="14" fill="${this.wireColor}">${name}</text>
                <line x1="${x}" y1="${y}" x2="${x + 40}" y2="${y}" stroke="${this.wireColor}" stroke-width="2" />`;
    }

    /**
     * Draw output terminal
     */
    drawOutput(name, x, y) {
        return `<circle cx="${x}" cy="${y}" r="5" fill="${this.wireColor}" />
                <text x="${x + 10}" y="${y + 5}" font-family="Arial" font-size="14" fill="${this.wireColor}">${name}</text>`;
    }

    /**
     * Draw wire/connection
     */
    drawWire(x1, y1, x2, y2) {
        return `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${this.wireColor}" stroke-width="2" marker-end="url(#arrowhead)" />`;
    }

    /**
     * Draw NOT gate
     */
    drawNOTGate(x, y, label = '') {
        const w = 60;
        const h = 40;
        return `<polygon points="${x},${y - h / 2} ${x + w - 10},${y} ${x},${y + h / 2}"
                fill="white" stroke="${this.gateColor}" stroke-width="2" />
                <circle cx="${x + w - 5}" cy="${y}" r="5" fill="white" stroke="${this.gateColor}" stroke-width="2" />
                <text x="${x + 10}" y="${y + 5}" font-family="Arial" font-size="12" fill="${this.gateColor}">NOT</text>`;
    }

    /**
     * Draw AND gate
     */
    drawANDGate(x, y, inputs = 2) {
        const w = this.gateWidth;
        const h = this.gateHeight;
        return `<rect x="${x}" y="${y - h / 2}" width="${w / 2}" height="${h}"
                fill="${this.gateColor}" stroke="${this.gateColor}" stroke-width="2" />
                <path d="M ${x + w / 2} ${y - h / 2} Q ${x + w} ${y} ${x + w / 2} ${y + h / 2}"
                fill="${this.gateColor}" stroke="${this.gateColor}" stroke-width="2" />
                <line x1="${x}" y1="${y - h / 2}" x2="${x}" y2="${y + h / 2}" stroke="${this.gateColor}" stroke-width="2" />
                <text x="${x + 15}" y="${y + 5}" font-family="Arial" font-size="12" fill="${this.textColor}">AND</text>`;
    }

    /**
     * Draw OR gate
     */
    drawORGate(x, y, inputs = 2) {
        const w = this.gateWidth;
        const h = this.gateHeight;
        return `<path d="M ${x} ${y - h / 2} Q ${x + 20} ${y} ${x} ${y + h / 2}
                Q ${x + w / 2} ${y + h / 2} ${x + w} ${y}
                Q ${x + w / 2} ${y - h / 2} ${x} ${y - h / 2}"
                fill="${this.gateColor}" stroke="${this.gateColor}" stroke-width="2" />
                <text x="${x + 20}" y="${y + 5}" font-family="Arial" font-size="12" fill="${this.textColor}">OR</text>`;
    }

    /**
     * Generate constant circuit (0 or 1)
     */
    generateConstantCircuit(value, variables, outputName) {
        const height = 100;
        const width = 300;

        let svg = `<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">`;
        svg += `<text x="50" y="50" font-family="Arial" font-size="16" fill="${this.wireColor}">Constant: ${value}</text>`;
        svg += `<circle cx="200" cy="50" r="5" fill="${this.wireColor}" />`;
        svg += `<text x="210" y="55" font-family="Arial" font-size="14" fill="${this.wireColor}">${outputName} = ${value}</text>`;
        svg += '</svg>';

        return svg;
    }

    /**
     * Combine multiple output SVGs into a single display
     */
    combineMultiOutputSVGs(outputs, variables) {
        let html = '';

        outputs.forEach((output, idx) => {
            html += `<div class="circuit-output">`;
            html += `<h3>Output ${output.name}: ${output.expression}</h3>`;
            html += output.svg;
            html += `</div>`;
            if (idx < outputs.length - 1) {
                html += '<hr style="margin: 30px 0; border: 1px solid #ddd;">';
            }
        });

        return html;
    }
}

// Make available globally
if (typeof module !== 'undefined' && module.exports) {
    module.exports = SchematicGenerator;
}
