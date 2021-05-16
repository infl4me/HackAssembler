import { dec2bin } from './utils';

const DESTINATIONS = {
  null: '000',
  M: '001',
  D: '010',
  MD: '011',
  A: '100',
  AM: '101',
  AD: '110',
  AMD: '111',
};

const JUMPS = {
  null: '000',
  JGT: '001',
  JEQ: '010',
  JGE: '011',
  JLT: '100',
  JNE: '101',
  JLE: '110',
  JMP: '111',
};

const getComputation = (key) => {
  switch (key) {
    case '0':
      return '101010';
    case '1':
      return '111111';
    case '-1':
      return '111010';
    case 'D':
      return '001100';
    case 'A':
    case 'M':
      return '110000';
    case '!D':
      return '001101';
    case '!A':
    case '!M':
      return '110001';
    case '-D':
      return '001111';
    case '-A':
    case '-M':
      return '110011';
    case 'D+1':
      return '011111';
    case 'A+1':
    case 'M+1':
      return '110111';
    case 'D-1':
      return '001110';
    case 'A-1':
    case 'M-1':
      return '110010';
    case 'D+A':
    case 'D+M':
      return '000010';
    case 'D-A':
    case 'D-M':
      return '010011';
    case 'A-D':
    case 'M-D':
      return '000111';
    case 'D&A':
    case 'D&M':
      return '000000';
    case 'D|A':
    case 'D|M':
      return '010101';

    default:
      return null;
  }
};

export const translate = (instructions) => {
  const translated = instructions.map((instruction) => {
    switch (instruction.type) {
      case 'A': {
        return `0${dec2bin(instruction.data, 15)}`;
      }
      case 'C': {
        if (instruction.data.comp === undefined) {
          throw new Error('Computation is missed');
        } else if (instruction.data.dest === undefined && instruction.data.jmp === undefined) {
          throw new Error('No destination or jump provided');
        }

        const compValue = getComputation(instruction.data.comp);
        if (!compValue) {
          throw new Error(`Invalid comp provided: "${instruction.data.comp}"`);
        }
        const aBit = compValue.includes('M') ? '1' : '0';

        const destKey = instruction.data.dest === undefined ? null : instruction.data.dest;
        const destValue = DESTINATIONS[destKey];
        if (!destValue) {
          throw new Error(`Invalid dest provided: "${instruction.data.dest}"`);
        }

        const jmpKey = instruction.data.jmp === undefined ? null : instruction.data.jmp;
        const jmpValue = JUMPS[jmpKey];
        if (!jmpValue) {
          throw new Error(`Invalid jmp provided: "${instruction.data.jmp}"`);
        }

        return `111${aBit}${compValue}${destValue}${jmpValue}`;
      }
      default:
        throw new Error(`Unknown type: "${instruction.type}"`);
    }
  });

  return translated.join('\n');
};
