const express = require('express');
const cors = require('cors');
const mercadopago = require('mercadopago');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(cors());

mercadopago.configure({
  access_token: process.env.MP_ACCESS_TOKEN,
});

app.post('/crear-preferencia', async (req, res) => {
  try {
    const { items, back_urls } = req.body;

    const preference = {
      items,
      back_urls,
      auto_return: 'approved',
    };

    const response = await mercadopago.preferences.create(preference);
    res.json({ init_point: response.body.init_point });
  } catch (error) {
    console.error('Error al crear preferencia:', error.message);
    res.status(500).json({ error: 'No se pudo crear la preferencia' });
  }
});

app.get('/', (req, res) => {
  res.send('🚀 Backend FOGO está vivo!');
});

app.listen(PORT, () => {
  console.log(`Servidor corriendo en puerto ${PORT}`);
});
