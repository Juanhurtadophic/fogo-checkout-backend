const express = require('express');
const cors = require('cors');
const mercadopago = require('mercadopago');
require('dotenv').config();

const app = express();
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
    res.status(500).json({ error: 'No se pudo crear la preferencia.' });
  }
});

const PORT = process.env.PORT; // ⚠️ SIN || 3000
app.listen(PORT, () => {
  console.log(`🚀 Servidor escuchando en el puerto ${PORT}`);
});



