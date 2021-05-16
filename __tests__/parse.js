import { parse } from '../src';
import { addInput } from '../__fixtures__/input/add';

test('parse', () => {
  expect(parse(addInput)).toEqual([
    { data: '2', type: 'A' },
    { data: { comp: 'A', dest: 'D' }, type: 'C' },
    { data: '3', type: 'A' },
    { data: { comp: 'D+A', dest: 'D' }, type: 'C' },
    { data: '0', type: 'A' },
    { data: { comp: 'D', dest: 'M' }, type: 'C' },
  ]);
});
