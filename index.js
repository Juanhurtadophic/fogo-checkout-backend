const express = require('express');
const cors = require('cors');
const mercadopago = require('mercadopago');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(cors());

// 🔐 Configura tu Access Token desde las variables de entorno
mercadopago.configure({
  access_token: process.env.MP_ACCESS_TOKEN,
});

// 🟢 Ruta principal para probar si está vivo
app.get('/', (req, res) => {
  res.send('🚀 Backend FOGO está vivo y listo para cobrar');
});

// 🧾 Ruta para crear preferencia (compatible con ambos nombres)
app.post(['/crear-preferencia', '/create_preference'], async (req, res) => {
  try {
    const { items, back_urls } = req.body;

    const preference = {
      items,
      back_urls: back_urls || {
        success: 'https://soyfogo.com/pages/gracias',
        failure: 'https://soyfogo.com/pages/error',
        pending: 'https://soyfogo.com/pages/pendiente'
      },
      auto_return: 'approved',
    };

    const response = await mercadopago.preferences.create(preference);
    res.json({ init_point: response.body.init_point });
  } catch (error) {
    console.error('❌ Error al crear preferencia:', error.message);
    res.status(500).json({ error: 'No se pudo crear la preferencia' });
  }
});

// 🟢 Levanta el servidor
app.listen(PORT, () => {
  console.log(`✅ Servidor FOGO corriendo en puerto ${PORT}`);
});

