const express = require('express');
const cors = require('cors');
const mercadopago = require('mercadopago');
const dotenv = require('dotenv');

dotenv.config();

console.log('✅ TOKEN ENCONTRADO:', process.env.MP_ACCESS_TOKEN);

mercadopago.configure({
  access_token: process.env.MP_ACCESS_TOKEN,
});

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(cors());

app.post('/crear-preferencia', async (req, res) => {
  try {
    const { items, back_urls } = req.body;

    const preference = {
      items: items.map(item => ({
        ...item,
        currency_id: 'COP'
      })),
      back_urls,
      auto_return: 'approved',
    };

    console.log("📦 Enviando preferencia a MP:", preference);

    const response = await mercadopago.preferences.create(preference);

    console.log("✅ init_point:", response.body.init_point);

    res.json({ init_point: response.body.init_point });

  } catch (error) {
    console.error('❌ Error al crear preferencia:', error);
    res.status(500).json({ error: 'Error al crear la preferencia' });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Servidor FOGO escuchando en http://localhost:${PORT}`);
});


