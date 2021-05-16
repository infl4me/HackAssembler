import { promises as fs } from 'fs';
import path from 'path';
import { parse } from '../src';

test('parse add', async () => {
  const input = await fs.readFile(path.join(__dirname, '__fixtures__', 'input', 'add'), 'utf-8');

  expect(parse(input).instructions).toEqual([
    { data: '2', type: 'A' },
    { data: { comp: 'A', dest: 'D' }, type: 'C' },
    { data: '3', type: 'A' },
    { data: { comp: 'D+A', dest: 'D' }, type: 'C' },
    { data: '0', type: 'A' },
    { data: { comp: 'D', dest: 'M' }, type: 'C' },
  ]);
});

test('parse max', async () => {
  const input = await fs.readFile(path.join(__dirname, '__fixtures__', 'input', 'max'), 'utf-8');
  const { instructions, labelData } = parse(input);
  expect(instructions).toEqual([
    { data: 'R0', type: 'A' },
    { data: { comp: 'M', dest: 'D' }, type: 'C' },
    { data: 'R1', type: 'A' },
    { data: { comp: 'D-M', dest: 'D' }, type: 'C' },
    { data: 'OUTPUT_FIRST', type: 'A' },
    { data: { comp: 'D', jmp: 'JGT' }, type: 'C' },
    { data: 'R1', type: 'A' },
    { data: { comp: 'M', dest: 'D' }, type: 'C' },
    { data: 'OUTPUT_D', type: 'A' },
    { data: { comp: '0', jmp: 'JMP' }, type: 'C' },
    { data: 'R0', jumpLabels: ['OUTPUT_FIRST'], type: 'A' },
    { data: { comp: 'M', dest: 'D' }, type: 'C' },
    { data: 'R2', jumpLabels: ['OUTPUT_D'], type: 'A' },
    { data: { comp: 'D', dest: 'M' }, type: 'C' },
    { data: 'INFINITE_LOOP', jumpLabels: ['INFINITE_LOOP'], type: 'A' },
    { data: { comp: '0', jmp: 'JMP' }, type: 'C' },
  ]);
  expect(labelData).toEqual({
    INFINITE_LOOP: { position: 14 },
    OUTPUT_D: { position: 12 },
    OUTPUT_FIRST: { position: 10 },
  });
});

test('parse rect', async () => {
  const input = await fs.readFile(path.join(__dirname, '__fixtures__', 'input', 'rect'), 'utf-8');
  const { instructions, labelData } = parse(input);
  expect(instructions).toEqual([
    { data: '0', type: 'A' },
    { data: { comp: 'M', dest: 'D' }, type: 'C' },
    { data: 'INFINITE_LOOP', type: 'A' },
    { data: { comp: 'D', jmp: 'JLE' }, type: 'C' },
    { data: 'counter', type: 'A' },
    { data: { comp: 'D', dest: 'M' }, type: 'C' },
    { data: 'SCREEN', type: 'A' },
    { data: { comp: 'A', dest: 'D' }, type: 'C' },
    { data: 'address', type: 'A' },
    { data: { comp: 'D', dest: 'M' }, type: 'C' },
    { data: 'address', jumpLabels: ['LOOP'], type: 'A' },
    { data: { comp: 'M', dest: 'A' }, type: 'C' },
    { data: { comp: '-1', dest: 'M' }, type: 'C' },
    { data: 'address', type: 'A' },
    { data: { comp: 'M', dest: 'D' }, type: 'C' },
    { data: '32', type: 'A' },
    { data: { comp: 'D+A', dest: 'D' }, type: 'C' },
    { data: 'address', type: 'A' },
    { data: { comp: 'D', dest: 'M' }, type: 'C' },
    { data: 'counter', type: 'A' },
    { data: { comp: 'M-1', dest: 'MD' }, type: 'C' },
    { data: 'LOOP', type: 'A' },
    { data: { comp: 'D', jmp: 'JGT' }, type: 'C' },
    { data: 'INFINITE_LOOP', jumpLabels: ['INFINITE_LOOP'], type: 'A' },
    { data: { comp: '0', jmp: 'JMP' }, type: 'C' },
  ]);
  expect(labelData).toEqual({ INFINITE_LOOP: { position: 23 }, LOOP: { position: 10 } });
});
