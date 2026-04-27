const { Kafka } = require('kafkajs');
const xml2js = require('xml2js');
const { Client } = require('pg');

const kafka = new Kafka({ clientId: 'processing', brokers: ['kafka:9092'] });
const consumer = kafka.consumer({ groupId: 'grupo-notas' });

const db = new Client({
  user: 'fiscal',
  host: 'postgres',
  database: 'fiscal_db',
  password: 'fiscal',
  port: 5432,
});

(async () => {
  await db.connect();
  await consumer.connect();
  await consumer.subscribe({ topic: 'nota.recebida' });

  await consumer.run({
    eachMessage: async ({ message }) => {
      const xml = message.value.toString();

      const parsed = await xml2js.parseStringPromise(xml);

      const chave = parsed?.nfeProc?.protNFe?.infProt?.chNFe?.[0];

      await db.query(
        'INSERT INTO notas_fiscais(chave_acesso) VALUES($1)',
        [chave]
      );

      console.log('Nota processada:', chave);
    }
  });
})();