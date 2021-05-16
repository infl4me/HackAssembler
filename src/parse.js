const COMMENT_SYMBOL = '/';
const SPACE_SYMBOL = ' ';
const LINE_END_SYMBOL = '\n';
const A_TRIGGER = '@';

const STATES = {
  BEFORE: 'BEFORE',
  AFTER: 'AFTER',
  INSIDE_A: 'INSIDE_A',
  INSIDE_C: 'INSIDE_C',
  INSIDE_COMMENT: 'INSIDE_COMMENT',
};

/**
 * parses string to instructions
 *
 * @param {string} input
 * @returns {array} instructions
 */
export const parse = (input) => {
  let state = STATES.BEFORE;
  const instructions = [];
  let currentInstructionValue = '';
  let cInstrctionParts = {};

  for (let i = 0; i < input.length; i += 1) {
    const currentSymbol = input[i];

    // console.log('state>>', state);
    // console.log('cInstrctionParts>>', cInstrctionParts);
    // console.log('currentInstructionValue>>', currentInstructionValue);
    // console.log('currentSymbol>>', currentSymbol);

    switch (state) {
      case STATES.BEFORE: {
        if (currentSymbol === A_TRIGGER) {
          state = STATES.INSIDE_A;
        } else if (currentSymbol === SPACE_SYMBOL || currentSymbol === LINE_END_SYMBOL) {
          currentInstructionValue = '';
        } else {
          state = STATES.INSIDE_C;
          currentInstructionValue += currentSymbol;
        }
        break;
      }
      case STATES.AFTER: {
        if (currentSymbol === LINE_END_SYMBOL) {
          state = STATES.BEFORE;
        }
        break;
      }
      case STATES.INSIDE_A: {
        if (currentSymbol === SPACE_SYMBOL || currentSymbol === LINE_END_SYMBOL) {
          instructions.push({
            type: 'A',
            data: currentInstructionValue,
          });

          state = currentSymbol === SPACE_SYMBOL ? STATES.AFTER : STATES.BEFORE;
          currentInstructionValue = '';
        } else {
          currentInstructionValue += currentSymbol;
        }
        break;
      }
      case STATES.INSIDE_C: {
        if (cInstrctionParts.comp) {
          if (currentSymbol === SPACE_SYMBOL || currentSymbol === LINE_END_SYMBOL) {
            cInstrctionParts.jmp = currentInstructionValue;
            instructions.push({
              type: 'C',
              data: cInstrctionParts,
            });
            currentInstructionValue = '';
            cInstrctionParts = {};
            state = currentSymbol === SPACE_SYMBOL ? STATES.AFTER : STATES.BEFORE;
          } else {
            currentInstructionValue += currentSymbol;
          }
        } else if (cInstrctionParts.dest) {
          if (currentSymbol === ';') {
            cInstrctionParts.comp = currentInstructionValue;
            currentInstructionValue = '';
          } else if (currentSymbol === SPACE_SYMBOL || currentSymbol === LINE_END_SYMBOL) {
            cInstrctionParts.comp = currentInstructionValue;
            instructions.push({
              type: 'C',
              data: cInstrctionParts,
            });
            currentInstructionValue = '';
            cInstrctionParts = {};
            state = currentSymbol === SPACE_SYMBOL ? STATES.AFTER : STATES.BEFORE;
          } else {
            currentInstructionValue += currentSymbol;
          }
        } else {
          if (currentSymbol === '=') {
            cInstrctionParts.dest = currentInstructionValue;
            currentInstructionValue = '';
          } else if (currentSymbol === ';') {
            cInstrctionParts.comp = currentInstructionValue;
            currentInstructionValue = '';
          } else if (currentSymbol === SPACE_SYMBOL || currentSymbol === LINE_END_SYMBOL) {
            cInstrctionParts.dest = currentInstructionValue;
            instructions.push({
              type: 'C',
              data: cInstrctionParts,
            });
            currentInstructionValue = '';
            cInstrctionParts = {};
            state = currentSymbol === SPACE_SYMBOL ? STATES.AFTER : STATES.BEFORE;
          } else {
            currentInstructionValue += currentSymbol;
          }
        }
        break;
      }
      default:
        break;
    }
  }

  return instructions;
};
