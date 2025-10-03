/**
 * Boolean Expression Parser
 * Parses Boolean expressions and extracts variables
 */

class BooleanParser {
    constructor() {
        this.operators = {
            'NOT': ['!', "'", '~'],
            'AND': ['*', '·', '.', '&', '∧'],
            'OR': ['+', '|', '∨'],
            'XOR': ['^', '⊕']
        };
    }

    /**
     * Parse expression and return standardized format
     * @param {string} expression - Boolean expression
     * @returns {Object} - Parsed expression data
     */
    parse(expression) {
        try {
            // Remove whitespace
            let cleaned = expression.replace(/\s+/g, '');

            // Extract variables (A-Z, a-z)
            const variables = this.extractVariables(cleaned);

            // Convert to evaluable format
            const evaluable = this.toEvaluableFormat(cleaned);

            return {
                original: expression,
                cleaned: cleaned,
                variables: variables.sort(),
                evaluable: evaluable,
                valid: true
            };
        } catch (error) {
            return {
                original: expression,
                valid: false,
                error: error.message
            };
        }
    }

    /**
     * Extract unique variables from expression
     * @param {string} expression - Cleaned expression
     * @returns {Array} - Array of variable names
     */
    extractVariables(expression) {
        const varPattern = /[A-Za-z]/g;
        const matches = expression.match(varPattern) || [];
        return [...new Set(matches)].sort();
    }

    /**
     * Convert Boolean expression to JavaScript evaluable format
     * @param {string} expression - Cleaned expression
     * @returns {string} - JavaScript evaluable expression
     */
    toEvaluableFormat(expression) {
        let result = expression;

        // Replace NOT operators with !
        this.operators.NOT.forEach(op => {
            if (op !== '!') {
                // Handle postfix notation (A')
                result = result.replace(new RegExp(`([A-Za-z])\\${op}`, 'g'), '!$1');
                // Handle prefix notation (~A)
                result = result.replace(new RegExp(`\\${op}([A-Za-z])`, 'g'), '!$1');
            }
        });

        // Replace OR operators with ||
        this.operators.OR.forEach(op => {
            result = result.replace(new RegExp(`\\${op}`, 'g'), '||');
        });

        // Replace AND operators with &&
        this.operators.AND.forEach(op => {
            if (op !== '&') {
                result = result.replace(new RegExp(`\\${op}`, 'g'), '&&');
            }
        });

        // Handle implicit AND (AB -> A&&B)
        result = result.replace(/([A-Za-z!)\]])([A-Za-z(!])/g, '$1&&$2');

        // Replace XOR operators with !=
        this.operators.XOR.forEach(op => {
            result = result.replace(new RegExp(`\\${op}`, 'g'), '!=');
        });

        return result;
    }

    /**
     * Evaluate expression for given variable values
     * @param {string} evaluable - Evaluable expression
     * @param {Object} values - Variable values {A: 1, B: 0, ...}
     * @returns {number} - Result (0 or 1)
     */
    evaluate(evaluable, values) {
        let expression = evaluable;

        // Replace variables with their values
        Object.keys(values).forEach(variable => {
            const value = values[variable];
            expression = expression.replace(new RegExp(variable, 'g'), value);
        });

        try {
            // Evaluate the expression
            const result = eval(expression);
            return result ? 1 : 0;
        } catch (error) {
            throw new Error(`Evaluation error: ${error.message}`);
        }
    }

    /**
     * Validate expression syntax
     * @param {string} expression - Expression to validate
     * @returns {boolean} - True if valid
     */
    validate(expression) {
        try {
            // Check for balanced parentheses
            let depth = 0;
            for (let char of expression) {
                if (char === '(') depth++;
                if (char === ')') depth--;
                if (depth < 0) return false;
            }
            if (depth !== 0) return false;

            // Check for valid characters
            const validChars = /^[A-Za-z0-1()\s!'*+·.&|^~∧∨⊕]+$/;
            if (!validChars.test(expression)) return false;

            return true;
        } catch {
            return false;
        }
    }

    /**
     * Convert expression to SOP (Sum of Products) format
     * @param {Array} minterms - Array of minterm indices
     * @param {Array} variables - Variable names
     * @returns {string} - SOP expression
     */
    toSOP(minterms, variables) {
        if (minterms.length === 0) return '0';
        if (minterms.length === Math.pow(2, variables.length)) return '1';

        const terms = minterms.map(minterm => {
            const binary = minterm.toString(2).padStart(variables.length, '0');
            const literals = binary.split('').map((bit, idx) => {
                return bit === '1' ? variables[idx] : variables[idx] + "'";
            });
            return literals.join('');
        });

        return terms.join(' + ');
    }

    /**
     * Convert expression to POS (Product of Sums) format
     * @param {Array} maxterms - Array of maxterm indices
     * @param {Array} variables - Variable names
     * @returns {string} - POS expression
     */
    toPOS(maxterms, variables) {
        if (maxterms.length === 0) return '1';
        if (maxterms.length === Math.pow(2, variables.length)) return '0';

        const terms = maxterms.map(maxterm => {
            const binary = maxterm.toString(2).padStart(variables.length, '0');
            const literals = binary.split('').map((bit, idx) => {
                return bit === '0' ? variables[idx] : variables[idx] + "'";
            });
            return '(' + literals.join(' + ') + ')';
        });

        return terms.join('');
    }
}

// Make available globally
if (typeof module !== 'undefined' && module.exports) {
    module.exports = BooleanParser;
}
