import { translate } from '../src';
import { addInput } from '../__fixtures__/input/add';
import { addOutput } from '../__fixtures__/output/add';

test('translate', () => {
  expect(translate(addInput)).toBe(addOutput);
});
