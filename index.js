const express = require('express');
const cors = require('cors');
const mercadopago = require('mercadopago');
require('dotenv').config();

const app = express();

// Configura Mercado Pago
mercadopago.configure({
  access_token: process.env.MP_ACCESS_TOKEN,
});

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.send('✅ Backend FOGO conectado correctamente');
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
    console.error('❌ Error al crear preferencia:', error.message);
    res.status(500).json({ error: 'Error al crear la preferencia' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Servidor FOGO escuchando en el puerto ${PORT}`);
});

