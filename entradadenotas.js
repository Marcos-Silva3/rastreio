const express = require('express');
const { Kafka } = require('kafkajs');
const fs = require('fs');

const app = express();
app.use(express.json());

const kafka = new Kafka({ clientId: 'ingestion', brokers: ['kafka:9092'] });
const producer = kafka.producer();

app.post('/upload-xml', async (req, res) => {
  const xml = req.body.xml;

  await producer.connect();
  await producer.send({
    topic: 'nota.recebida',
    messages: [{ value: xml }]
  });

  res.send({ status: 'enviado para processamento' });
});

app.listen(3001, () => console.log('Ingestion rodando'));