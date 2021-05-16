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

const COMPUTATIONS = {
  0: '101010',
  1: '111111',
  '-1': '111010',
  D: '001100',
  A: '110000',

  'D+A': '000010',
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

        const compValue = COMPUTATIONS[instruction.data.comp];
        if (!compValue) {
          throw new Error(`Invalid comp provided: "${instruction.data.comp}"`);
        }

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

        return `1110${compValue}${destValue}${jmpValue}`;
      }
      default:
        throw new Error(`Unknown type: "${instruction.type}"`);
    }
  });

  return translated.join('\n');
};
