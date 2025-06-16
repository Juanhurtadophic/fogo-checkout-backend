const express = require('express');
const cors = require('cors');
const mercadopago = require('mercadopago');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Configura Mercado Pago
mercadopago.configure({
  access_token: process.env.MP_ACCESS_TOKEN,
});

// Ruta para crear la preferencia
app.post('/crear-preferencia', async (req, res) => {
  try {
    const { items, back_urls } = req.body;

    // Log de lo recibido
    console.log('📦 ITEMS recibidos desde Shopify:\n', items);

    const preference = {
      items: items,
      back_urls: back_urls,
      auto_return: 'approved',
    };

    const response = await mercadopago.preferences.create(preference);
    console.log('✅ Preferencia creada:', response.body.id);

    res.json({ init_point: response.body.init_point });
  } catch (error) {
    console.error('❌ Error al crear preferencia:\n', error.message);
    res.status(500).json({ error: 'No se pudo generar la preferencia.' });
  }
});

// Iniciar el servidor
app.listen(PORT, () => {
  console.log(`🚀 Servidor FOGO escuchando en el puerto ${PORT}`);
});

