const express = require('express');
const cors = require('cors');
const mercadopago = require('mercadopago');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(cors());

// Configurar credencial de acceso
mercadopago.configure({
  access_token: process.env.MP_ACCESS_TOKEN,
});

// Ruta principal para probar que el backend está vivo
app.get('/', (req, res) => {
  res.send('⚡ Backend FOGO MercadoPago está corriendo.');
});

// Ruta para crear preferencia de pago
app.post('/crear-preferencia', async (req, res) => {
  try {
    const { items } = req.body;

    console.log('🧾 Items recibidos:', items);

    const preference = {
      items: items.map(item => ({
        title: item.title,
        unit_price: Number(item.unit_price),
        quantity: Number(item.quantity),
        currency_id: 'COP',
      })),
      back_urls: {
        success: process.env.BACK_URL_SUCCESS,
        failure: process.env.BACK_URL_FAILURE,
        pending: process.env.BACK_URL_FAILURE,
      },
      auto_return: 'approved',
    };

    console.log('📦 Preferencia a enviar:', preference);

    const response = await mercadopago.preferences.create(preference);
    console.log('✅ Preferencia creada:', response.body.init_point);

    res.json({ init_point: response.body.init_point });
  } catch (error) {
    console.error('❌ Error al crear la preferencia:', error);
    res.status(500).json({ error: 'Error al crear la preferencia' });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Servidor escuchando en http://localhost:${PORT}`);
});

