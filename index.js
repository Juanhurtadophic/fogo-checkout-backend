const express = require('express');
const cors = require('cors');
const mercadopago = require('mercadopago');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Configura el token de Mercado Pago desde el archivo .env o desde variables de entorno en Railway
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
    const { items, back_urls } = req.body;

    // ⬇️ DEBUG: imprimimos el contenido recibido para validar errores
    console.log('🟡 Datos recibidos del frontend:', JSON.stringify(req.body, null, 2));

    const preference = {
      items,
      back_urls,
      auto_return: 'approved'
    };

    const response = await mercadopago.preferences.create(preference);
    res.json({ init_point: response.body.init_point });
  } catch (error) {
    console.error('❌ Error al crear preferencia:', error.message);
    res.status(500).json({ error: 'No se pudo generar el link de pago' });
  }
});

// Arranca el servidor
app.listen(PORT, () => {
  console.log(`🚀 Servidor backend escuchando en el puerto ${PORT}`);
});
