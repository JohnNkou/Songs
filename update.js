import express from 'express'
import { app } from './index.js'
import db from './utilis/dbClass.js'
import { CloseServer, CommitHandler } from './router/index.js';

const app2 = express(),
procs = [];

app2.use(express.json());

app2.post('/webhookAction', CommitHandler({ app, db, closeFunction: CloseServer, procs }))

export default app2;