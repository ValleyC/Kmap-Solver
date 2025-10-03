/**
 * K-map Simplification Engine
 * Implements grouping and minimization algorithms
 */

class KMapSimplifier {
    constructor() {
        this.primeImplicants = [];
        this.essentialPrimeImplicants = [];
    }

    /**
     * Simplify K-map and return minimized SOP expression
     * @param {Object} kmap - K-map data structure
     * @returns {Object} - Simplified expression data
     */
    simplify(kmap) {
        const { minterms, variables, numVars, dontCares = [] } = kmap;

        if (minterms.length === 0) {
            return {
                sop: '0',
                pos: '1',
                primeImplicants: [],
                essentialPrimeImplicants: []
            };
        }

        if (minterms.length === Math.pow(2, numVars)) {
            return {
                sop: '1',
                pos: '0',
                primeImplicants: [],
                essentialPrimeImplicants: []
            };
        }

        // Use Quine-McCluskey algorithm for minimization with don't cares
        // Treat don't cares as 1s for finding prime implicants
        const allOnes = [...minterms, ...dontCares];
        const primeImplicants = this.quineMcCluskey(allOnes, numVars);

        // But only cover the actual minterms (not don't cares)
        const essentialPIs = this.findEssentialPrimeImplicants(primeImplicants, minterms);

        // Convert to SOP expression
        const sop = this.convertToSOP(essentialPIs, variables);

        // Generate POS from maxterms (excluding don't cares)
        const allTerms = Array.from({ length: Math.pow(2, numVars) }, (_, i) => i);
        const maxterms = allTerms.filter(t => !minterms.includes(t) && !dontCares.includes(t));
        const pos = this.convertToPOS(maxterms, variables);

        return {
            sop: sop,
            pos: pos,
            primeImplicants: primeImplicants,
            essentialPrimeImplicants: essentialPIs,
            groups: this.findGroups(kmap)
        };
    }

    /**
     * Quine-McCluskey algorithm for finding prime implicants
     * @param {Array} minterms - Array of minterm indices
     * @param {number} numVars - Number of variables
     * @returns {Array} - Prime implicants
     */
    quineMcCluskey(minterms, numVars) {
        // Convert minterms to binary representation
        let terms = minterms.map(m => ({
            binary: m.toString(2).padStart(numVars, '0'),
            minterms: [m],
            used: false
        }));

        let primeImplicants = [];
        let iteration = 0;

        while (iteration < numVars) {
            let newTerms = [];
            let grouped = new Set();

            // Group by number of 1s
            const groups = this.groupByOnes(terms);

            // Try to combine adjacent groups
            for (let i = 0; i < groups.length - 1; i++) {
                const group1 = groups[i];
                const group2 = groups[i + 1];

                for (let term1 of group1) {
                    for (let term2 of group2) {
                        const combined = this.combineBinary(term1.binary, term2.binary);
                        if (combined) {
                            term1.used = true;
                            term2.used = true;
                            grouped.add(term1.binary);
                            grouped.add(term2.binary);

                            // Check if this combined term already exists
                            const exists = newTerms.some(t => t.binary === combined);
                            if (!exists) {
                                newTerms.push({
                                    binary: combined,
                                    minterms: [...new Set([...term1.minterms, ...term2.minterms])],
                                    used: false
                                });
                            }
                        }
                    }
                }
            }

            // Add unused terms as prime implicants
            terms.forEach(term => {
                if (!term.used) {
                    primeImplicants.push(term);
                }
            });

            if (newTerms.length === 0) break;
            terms = newTerms;
            iteration++;
        }

        // Add any remaining terms
        terms.forEach(term => {
            if (!term.used) {
                primeImplicants.push(term);
            }
        });

        return primeImplicants;
    }

    /**
     * Group terms by number of 1s in binary representation
     */
    groupByOnes(terms) {
        const groups = {};
        terms.forEach(term => {
            const ones = (term.binary.match(/1/g) || []).length;
            if (!groups[ones]) groups[ones] = [];
            groups[ones].push(term);
        });

        return Object.keys(groups).sort((a, b) => a - b).map(k => groups[k]);
    }

    /**
     * Combine two binary strings if they differ by exactly one bit
     * @param {string} bin1 - First binary string
     * @param {string} bin2 - Second binary string
     * @returns {string|null} - Combined binary with '-' for don't care, or null
     */
    combineBinary(bin1, bin2) {
        let differences = 0;
        let diffPos = -1;

        for (let i = 0; i < bin1.length; i++) {
            if (bin1[i] !== bin2[i]) {
                if (bin1[i] === '-' || bin2[i] === '-') return null;
                differences++;
                diffPos = i;
            }
        }

        if (differences === 1) {
            return bin1.substring(0, diffPos) + '-' + bin1.substring(diffPos + 1);
        }

        return null;
    }

    /**
     * Find essential prime implicants
     * @param {Array} primeImplicants - All prime implicants
     * @param {Array} minterms - Original minterms
     * @returns {Array} - Essential prime implicants
     */
    findEssentialPrimeImplicants(primeImplicants, minterms) {
        const coverage = {};
        minterms.forEach(m => {
            coverage[m] = [];
        });

        // Find which PIs cover which minterms
        primeImplicants.forEach((pi, index) => {
            pi.minterms.forEach(m => {
                if (coverage[m]) {
                    coverage[m].push(index);
                }
            });
        });

        // Find essential PIs (those that are the only ones covering a minterm)
        const essentialIndices = new Set();
        Object.values(coverage).forEach(piList => {
            if (piList.length === 1) {
                essentialIndices.add(piList[0]);
            }
        });

        // Get essential PIs
        const essentialPIs = Array.from(essentialIndices).map(i => primeImplicants[i]);

        // Cover remaining minterms with additional PIs if needed
        const coveredMinterms = new Set();
        essentialPIs.forEach(pi => {
            pi.minterms.forEach(m => coveredMinterms.add(m));
        });

        const uncovered = minterms.filter(m => !coveredMinterms.has(m));
        const additionalPIs = [];

        // Greedy selection for remaining minterms
        while (uncovered.length > 0) {
            let bestPI = null;
            let maxCoverage = 0;

            primeImplicants.forEach(pi => {
                if (!essentialPIs.includes(pi) && !additionalPIs.includes(pi)) {
                    const coverage = pi.minterms.filter(m => uncovered.includes(m)).length;
                    if (coverage > maxCoverage) {
                        maxCoverage = coverage;
                        bestPI = pi;
                    }
                }
            });

            if (bestPI) {
                additionalPIs.push(bestPI);
                bestPI.minterms.forEach(m => {
                    const index = uncovered.indexOf(m);
                    if (index > -1) uncovered.splice(index, 1);
                });
            } else {
                break;
            }
        }

        return [...essentialPIs, ...additionalPIs];
    }

    /**
     * Convert prime implicants to SOP expression
     * @param {Array} primeImplicants - Prime implicants
     * @param {Array} variables - Variable names
     * @returns {string} - SOP expression
     */
    convertToSOP(primeImplicants, variables) {
        if (primeImplicants.length === 0) return '0';

        const terms = primeImplicants.map(pi => {
            let term = '';
            for (let i = 0; i < pi.binary.length; i++) {
                if (pi.binary[i] === '1') {
                    term += variables[i];
                } else if (pi.binary[i] === '0') {
                    term += variables[i] + "'";
                }
                // '-' means don't care, skip it
            }
            return term || '1';
        });

        return terms.join(' + ');
    }

    /**
     * Convert maxterms to POS expression
     * @param {Array} maxterms - Array of maxterm indices
     * @param {Array} variables - Variable names
     * @returns {string} - POS expression
     */
    convertToPOS(maxterms, variables) {
        if (maxterms.length === 0) return '1';

        const terms = maxterms.map(maxterm => {
            const binary = maxterm.toString(2).padStart(variables.length, '0');
            const literals = binary.split('').map((bit, idx) => {
                return bit === '0' ? variables[idx] : variables[idx] + "'";
            });
            return '(' + literals.join(' + ') + ')';
        });

        return terms.join('·');
    }

    /**
     * Find visual groups in K-map for display
     * @param {Object} kmap - K-map data
     * @returns {Array} - Array of group objects
     */
    findGroups(kmap) {
        // This is a simplified version - full implementation would
        // identify rectangular groups of 1, 2, 4, 8, etc. cells
        const groups = [];
        const { minterms, numVars } = kmap;

        // For now, return individual cells as groups
        // A full implementation would merge adjacent cells
        minterms.forEach(m => {
            groups.push({
                minterms: [m],
                size: 1,
                binary: m.toString(2).padStart(numVars, '0')
            });
        });

        return groups;
    }
}

// Make available globally
if (typeof module !== 'undefined' && module.exports) {
    module.exports = KMapSimplifier;
}
