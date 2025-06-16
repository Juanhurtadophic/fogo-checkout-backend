const express = require('express');
const cors = require('cors');
const mercadopago = require('mercadopago');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Configura tu token de producción de Mercado Pago
mercadopago.configure({
  access_token: process.env.MP_ACCESS_TOKEN,
});

app.get('/', (req, res) => {
  res.send('✅ Backend FOGO conectado correctamente');
});

app.post('/crear-preferencia', async (req, res) => {
  try {
    const { items, back_urls } = req.body;

    console.log('🧾 ITEMS recibidos desde Shopify:');
    console.log(items);

    const preference = {
      items,
      back_urls,
      auto_return: 'approved',
    };

    const response = await mercadopago.preferences.create(preference);

    console.log('✅ Preferencia creada correctamente');
    console.log('🔗 Link de pago:', response.body.init_point);

    res.json({ init_point: response.body.init_point });

  } catch (error) {
    console.error('❌ Error al crear preferencia:');
    if (error.response) {
      console.error(error.response);
    } else {
      console.error(error.message);
    }

    res.status(500).json({ error: 'Fallo al crear preferencia' });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Servidor FOGO escuchando en el puerto ${PORT}`);
});

