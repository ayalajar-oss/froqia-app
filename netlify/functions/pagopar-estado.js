const crypto = require('crypto');
const PRIVATE_KEY = "9186345beb9c478b0a295800eb006daf";
const PUBLIC_KEY = "ee939b5cf36d53c02decb7666ab82fd2";
exports.handler = async (event) => {
  const headers = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Allow-Methods": "POST, GET, OPTIONS",
    "Content-Type": "application/json",
  };

  if (event.httpMethod === "OPTIONS") {
    return { statusCode: 200, headers, body: "" };
  }

  try {
    const { hash_pedido } = JSON.parse(event.body || "{}");
    console.log("Paso 4: Consultando estado para hash:", hash_pedido);

    const token = crypto
      .createHash('sha1')
      .update(PRIVATE_KEY + "CONSULTA")
      .digest('hex');

    console.log("Token CONSULTA generado:", token);

    const response = await fetch(
      "https://api.pagopar.com/api/pedidos/1.1/traer",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          hash_pedido: hash_pedido,
          token: token,
          token_publico: PUBLIC_KEY,
        }),
      }
    );

    const data = await response.json();
    console.log("Estado del pedido:", data.respuesta ? "✅" : "❌");
    
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify(data),
    };
  } catch (err) {
    console.error("Error:", err.message);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: err.message }),
    };
  }
};
