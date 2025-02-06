import { Client } from 'fauna';

export const client = new Client({
  secret: process.env.FAUNADB_STATIC_FUN_KEY
});
