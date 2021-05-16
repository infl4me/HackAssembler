import { translate, parse } from '../src';
import { addInput } from '../__fixtures__/input/add';
import { addOutput } from '../__fixtures__/output/add';

test('translate', () => {
  expect(translate(parse(addInput))).toEqual(addOutput);
});
