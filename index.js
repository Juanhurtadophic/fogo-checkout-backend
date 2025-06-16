const express = require('express');
const cors = require('cors');
const mercadopago = require('mercadopago');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Configura el token de Mercado Pago desde el archivo .env
mercadopago.configure({
  access_token: process.env.MP_ACCESS_TOKEN
});

// Ruta principal
app.get('/', (req, res) => {
  res.send('🔥 Backend de FOGO activo');
});

// Ruta para crear la preferencia de pago
app.post('/crear-preferencia', async (req, res) => {
  try {
    const { items } = req.body;

    console.log('📦 ITEMS recibidos desde Shopify:');
    console.log(items);

    const preference = {
      items: items,
      back_urls: {
        success: process.env.BACK_URL_SUCCESS,
        failure: process.env.BACK_URL_FAILURE,
        pending: process.env.BACK_URL_FAILURE
      },
      auto_return: 'approved'
    };

    const response = await mercadopago.preferences.create(preference);

    console.log('✅ init_point generado:', response.body.init_point);

    res.json({ init_point: response.body.init_point });

  } catch (error) {
    console.error('❌ Error al crear preferencia:');
    console.error(error);

    res.status(500).json({ error: 'Error al generar link de pago', detalle: error.message });
  }
});

// Inicia el servidor
app.listen(PORT, () => {
  console.log(`🚀 Servidor FOGO escuchando en el puerto ${PORT}`);
});
