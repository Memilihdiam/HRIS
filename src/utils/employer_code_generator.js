/**
 * Generate employee code based on position and sequences
 * @param {String} position_code - The position code (e.g., 'DEV')
 * @param {Number} nextDeptSeq - The next sequence number in the department
 * @param {Number} nextPosSeq - The next sequence number in the position
 * @returns {String} - The generated employee code (e.g., 'DEV001001')
 */
exports.employer_code_gen = (position_code, nextDeptSeq, nextPosSeq) => {
    const deptSeqPadded = String(nextDeptSeq).padStart(3, '0');
    const posSeqPadded = String(nextPosSeq).padStart(3, '0');
    return `${position_code}${deptSeqPadded}${posSeqPadded}`;
};
