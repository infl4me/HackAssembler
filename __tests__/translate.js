import { promises as fs } from 'fs';
import path from 'path';
import { translate, parse } from '../src';

test('translate (add)', async () => {
  const input = await fs.readFile(path.join(__dirname, '__fixtures__', 'input', 'add'), 'utf-8');
  const output = await fs.readFile(path.join(__dirname, '__fixtures__', 'output', 'add'), 'utf-8');

  expect(translate(parse(input))).toEqual(output);
});

test('translate (max)', async () => {
  const input = await fs.readFile(path.join(__dirname, '__fixtures__', 'input', 'max'), 'utf-8');
  const output = await fs.readFile(path.join(__dirname, '__fixtures__', 'output', 'max'), 'utf-8');

  expect(translate(parse(input))).toEqual(output);
});

test('translate (rect)', async () => {
  const input = await fs.readFile(path.join(__dirname, '__fixtures__', 'input', 'rect'), 'utf-8');
  const output = await fs.readFile(path.join(__dirname, '__fixtures__', 'output', 'rect'), 'utf-8');

  expect(translate(parse(input))).toEqual(output);
});
