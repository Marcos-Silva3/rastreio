const express = require('express');
const { Client } = require('pg');

const app = express();

const db = new Client({
  user: 'fiscal',
  host: 'postgres',
  database: 'fiscal_db',
  password: 'fiscal',
  port: 5432,
});

db.connect();

app.get('/notas/:chave', async (req, res) => {
  const result = await db.query(
    'SELECT * FROM notas_fiscais WHERE chave_acesso=$1',
    [req.params.chave]
  );

  res.json(result.rows[0]);
});

app.listen(3003, () => console.log('Query rodando'));