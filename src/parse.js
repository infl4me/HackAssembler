// const COMMENT_SYMBOL = '/';
const SPACE_SYMBOL = ' ';
const LINE_END_SYMBOL = '\n';
const A_TRIGGER = '@';
const LABEL_OPEN_TRIGGER = '(';
const LABEL_CLOSE_TRIGGER = ')';

const STATES = {
  BEFORE: 'BEFORE',
  AFTER: 'AFTER',
  INSIDE_A: 'INSIDE_A',
  INSIDE_C: 'INSIDE_C',
  INSIDE_LABEL: 'INSIDE_LABEL',
  INSIDE_COMMENT: 'INSIDE_COMMENT',
};

/**
 * parses string to instructions
 *
 * @param {string} input
 */
export const parse = (input) => {
  let state = STATES.BEFORE;
  const instructions = [];
  let currentInstructionValue = '';
  let cInstructionParts = {};
  let jumpLabel = null;
  const labelData = {};

  const endInstruction = (symbol, type, data) => {
    instructions.push({
      type,
      data,
      ...(jumpLabel && { jumpLabel }),
    });

    if (jumpLabel) {
      labelData[jumpLabel] = {
        position: instructions.length - 1,
      };
    }

    jumpLabel = null;
    cInstructionParts = {};
    currentInstructionValue = '';
    state = symbol === SPACE_SYMBOL ? STATES.AFTER : STATES.BEFORE;
  };

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
        } else if (currentSymbol === LABEL_OPEN_TRIGGER) {
          state = STATES.INSIDE_LABEL;
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
      case STATES.INSIDE_LABEL: {
        if (currentSymbol === LABEL_CLOSE_TRIGGER) {
          state = STATES.AFTER;
          jumpLabel = currentInstructionValue;
          currentInstructionValue = '';
        } else if (currentSymbol === SPACE_SYMBOL || currentSymbol === LINE_END_SYMBOL) {
          throw new Error('Sytax error');
        } else {
          currentInstructionValue += currentSymbol;
        }
        break;
      }
      case STATES.INSIDE_A: {
        if (currentSymbol === SPACE_SYMBOL || currentSymbol === LINE_END_SYMBOL) {
          endInstruction(currentSymbol, 'A', currentInstructionValue);
        } else {
          currentInstructionValue += currentSymbol;
        }
        break;
      }
      case STATES.INSIDE_C: {
        if (cInstructionParts.comp) {
          if (currentSymbol === SPACE_SYMBOL || currentSymbol === LINE_END_SYMBOL) {
            cInstructionParts.jmp = currentInstructionValue;
            endInstruction(currentSymbol, 'C', cInstructionParts);
          } else {
            currentInstructionValue += currentSymbol;
          }
        } else if (cInstructionParts.dest) {
          if (currentSymbol === ';') {
            cInstructionParts.comp = currentInstructionValue;
            currentInstructionValue = '';
          } else if (currentSymbol === SPACE_SYMBOL || currentSymbol === LINE_END_SYMBOL) {
            cInstructionParts.comp = currentInstructionValue;
            endInstruction(currentSymbol, 'C', cInstructionParts);
          } else {
            currentInstructionValue += currentSymbol;
          }
        } else if (currentSymbol === '=') {
          cInstructionParts.dest = currentInstructionValue;
          currentInstructionValue = '';
        } else if (currentSymbol === ';') {
          cInstructionParts.comp = currentInstructionValue;
          currentInstructionValue = '';
        } else if (currentSymbol === SPACE_SYMBOL || currentSymbol === LINE_END_SYMBOL) {
          cInstructionParts.dest = currentInstructionValue;
          endInstruction(currentSymbol, 'C', cInstructionParts);
        } else {
          currentInstructionValue += currentSymbol;
        }
        break;
      }
      default:
        throw new Error(`Unknown state: "${state}"`);
    }
  }

  return { instructions, labelData };
};
