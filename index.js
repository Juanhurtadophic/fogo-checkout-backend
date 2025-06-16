const express = require('express');
const cors = require('cors');
const mercadopago = require('mercadopago');
require('dotenv').config();

const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// Configurar Mercado Pago con el token de producción
mercadopago.configure({
  access_token: process.env.MP_ACCESS_TOKEN,
});

// Ruta para crear una preferencia
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
    res.status(500).json({ error: 'Error al crear preferencia de pago.' });
  }
});

// Escuchar en el puerto asignado por Railway
const PORT = process.env.PORT; // NO pongas fallback como || 3000

app.listen(PORT, () => {
  console.log(`🚀 Servidor escuchando en el puerto ${PORT}`);
});


