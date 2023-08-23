import * as t from 'io-ts';
import { pipe } from 'fp-ts/function';
import getStore from './schema';
import { chain, left, map, tryCatch } from 'fp-ts/TaskEither';
import { TaskEither } from 'fp-ts/lib/TaskEither';
import { RecordTypes } from '../shared/types';

function create(params: t.TypeOf<typeof CreateParams>): TaskEither<Error, void> {
  const findExistingRecord = pipe(
    tryCatch(() => getStore(params.table).findOneAsync(params.record), e => e as Error),
    map(existingRecord => existingRecord ? left(new Error('Record already exists')) : {})
  );

  const insertRecord = pipe(
    tryCatch(() => getStore(params.table).insertAsync(params.record as RecordTypes), e => e as Error),
    map(() => {})
  );

  return pipe(
    findExistingRecord,
    chain(() => insertRecord)
  );
}

function read(params: t.TypeOf<typeof ReadParams>): TaskEither<Error, any[]> {
  return tryCatch(() => {
    const cursor = getStore(params.table).findAsync(params.query || {});

    if (params.order) cursor.sort(params.order);
    if (params.limit && params.limit !== -1) cursor.limit(params.limit);
    
    return cursor.skip(params.skip || 0).execAsync();
  }, e => e as Error);
}

function update(params: t.TypeOf<typeof UpdateParams>): TaskEither<Error, { message: string }> {
  return pipe(
    tryCatch(() => getStore(params.table).updateAsync(params.query, params.updateQuery, { upsert: true }), e => e as Error),
    map(() => ({ message: 'Record updated successfully' }))
  );
}

function _delete(params: t.TypeOf<typeof DeleteParams>): TaskEither<Error, { message: string }> {
  return pipe(
    tryCatch(() => getStore(params.table).removeAsync(params.query, { multi: true }), e => e as Error),
    map(() => ({ message: 'Record deleted successfully' }))
  );
}

const TableKey = t.keyof({
  days: null,
  papers: null,
  config: null
});
const CreateParams = t.type({
  table: TableKey,
  record: t.unknown
});
export const ReadParams = t.type({
  table: TableKey,
  query: t.union([t.unknown, t.undefined]),
  skip: t.union([t.number, t.undefined]),
  limit: t.union([t.number, t.undefined]),
  order: t.union([t.unknown, t.undefined])
});
const UpdateParams = t.type({
  table: TableKey,
  query: t.unknown,
  updateQuery: t.unknown
});
const DeleteParams = t.type({
  table: TableKey,
  query: t.unknown
});
const CreatePayload = t.intersection([t.type({ operation: t.literal('create') }), CreateParams]);
const UpdatePayload = t.intersection([t.type({ operation: t.literal('update') }), UpdateParams]);
const DeletePayload = t.intersection([t.type({ operation: t.literal('delete') }), DeleteParams]);
export const Payload = t.union([CreatePayload, UpdatePayload, DeletePayload]);
type OperationPayloads = {
  create: t.TypeOf<typeof CreatePayload>;
  update: t.TypeOf<typeof UpdatePayload>;
  delete: t.TypeOf<typeof DeletePayload>;
};
export type Dispatcher = {
  [K in keyof OperationPayloads]: (params: OperationPayloads[K]) => TaskEither<Error, any>;
};

const postDispatcher: Dispatcher = { create, update, delete: _delete };

export { read, postDispatcher }