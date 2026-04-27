CREATE TABLE notas_fiscais (
  id SERIAL PRIMARY KEY,
  chave_acesso VARCHAR(44) UNIQUE,
  created_at TIMESTAMP DEFAULT NOW()
);