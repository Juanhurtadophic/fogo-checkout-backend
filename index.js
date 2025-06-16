const express = require('express');
const cors = require('cors');
const mercadopago = require('mercadopago');
const dotenv = require('dotenv');

dotenv.config(); // Carga las variables del archivo .env

console.log('TOKEN ENCONTRADO:', process.env.MP_ACCESS_TOKEN); // DEBUG opcional

// Configura Mercado Pago con el token del .env
mercadopago.configure({
  access_token: process.env.MP_ACCESS_TOKEN,
});

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(cors());

// Ruta para crear preferencia
app.post(['/crear-preferencia', '/create_preference'], async (req, res) => {
  try {
    const { items, back_urls } = req.body;

    const preference = {
      items,
      back_urls: back_urls || {
        success: 'https://soyfogo.com/pages/gracias',
        failure: 'https://soyfogo.com/pages/error',
        pending: 'https://soyfogo.com/pages/pendiente',
      },
      auto_return: 'approved',
      currency_id: 'COP', // 👈 Asegura que el pago sea en pesos colombianos
    };

    const response = await mercadopago.preferences.create(preference);
    res.json({ init_point: response.body.init_point });

  } catch (error) {
    console.error('❌ Error al crear preferencia:', error.message);
    res.status(500).json({ error: 'No se pudo crear la preferencia' });
  }
});

// Levanta el servidor
app.listen(PORT, () => {
  console.log(`✅ Servidor FOGO corriendo en puerto ${PORT}`);
});


