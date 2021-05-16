import { promises as fs } from 'fs';
import path from 'path';
import { translate, parse } from '../src';

test('translate', async () => {
  const input = await fs.readFile(path.join(__dirname, '__fixtures__', 'input', 'add'), 'utf-8');
  const output = await fs.readFile(path.join(__dirname, '__fixtures__', 'output', 'add'), 'utf-8');

  expect(translate(parse(input))).toEqual(output);
});

test('translate with labels', async () => {
  const input = await fs.readFile(path.join(__dirname, '__fixtures__', 'input', 'max'), 'utf-8');
  const output = await fs.readFile(path.join(__dirname, '__fixtures__', 'output', 'max'), 'utf-8');

  expect(translate(parse(input))).toEqual(output);
});
