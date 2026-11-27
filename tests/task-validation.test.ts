import assert from 'node:assert/strict';
import test from 'node:test';
import { parseTaskId, parseTaskListOptions, validateCreateTask, validateUpdateTask } from '../src/validation/task-validation.js';

test('create validation accepts supported fields and preserves the submitted values', () => {
  assert.deepEqual(validateCreateTask({ title: ' Prepare release ', description: null }), {
    title: ' Prepare release ',
    description: null,
  });
});

test('create validation rejects unexpected keys and blank titles', () => {
  assert.throws(() => validateCreateTask({ title: 'Task', owner: 'someone' }), /Unexpected field/);
  assert.throws(() => validateCreateTask({ title: '   ' }), /Title must contain/);
});

test('update validation requires supported changes', () => {
  assert.throws(() => validateUpdateTask({}), /At least one task field/);
  assert.throws(() => validateUpdateTask({ status: 'blocked' }), /Status must be one of/);
  assert.deepEqual(validateUpdateTask({ status: 'completed' }), { status: 'completed' });
});

test('task IDs must be positive safe integers', () => {
  assert.equal(parseTaskId('42'), 42);
  assert.throws(() => parseTaskId('0'), /positive integer/);
  assert.throws(() => parseTaskId('9007199254740992'), /supported range/);
});

test('pagination options have bounded defaults and reject invalid ranges', () => {
  assert.deepEqual(parseTaskListOptions(undefined, undefined), { limit: 20, offset: 0 });
  assert.deepEqual(parseTaskListOptions('50', '4'), { limit: 50, offset: 4 });
  assert.throws(() => parseTaskListOptions('0', '0'), /limit must be between/);
  assert.throws(() => parseTaskListOptions('101', '0'), /limit must be between/);
  assert.throws(() => parseTaskListOptions('10', '-1'), /non-negative integer/);
});
