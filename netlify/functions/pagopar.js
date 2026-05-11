const crypto = require('crypto');
const PRIVATE_KEY = "34c7c327e58cdb13e2e197dcda305fee";

function generarTokenPaso1(idPedido, montoTotal) {
  const monto = String(parseFloat(montoTotal));
  const stringToHash = PRIVATE_KEY + idPedido + monto;
  return crypto.createHash('sha1').update(stringToHash).digest('hex');
}

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

  if (event.httpMethod === "POST") {
    let body;
    try { body = JSON.parse(event.body || "{}"); } catch { body = {}; }
    
    // PASO 3: PagoPar notifica pago
    if (body?.resultado && Array.isArray(body.resultado)) {
      const item = body.resultado[0];
      
      if (item?.hash_pedido && item?.token) {
        console.log("Paso 3: Validando token para hash:", item.hash_pedido);
        
        const expectedToken = crypto
          .createHash('sha1')
          .update(PRIVATE_KEY + item.hash_pedido)
          .digest('hex');
        
        if (item.token !== expectedToken) {
          console.log("Token inválido");
          return {
            statusCode: 200,
            headers,
            body: JSON.stringify({ error: "Token no coincide" })
          };
        }
        
        console.log("Paso 3: Token válido - Pedido pagado");
        return {
          statusCode: 200,
          headers,
          body: JSON.stringify(body.resultado)
        };
      }
    }

    // PASO 1: Crear transacción
    console.log("Paso 1: Creando transacción");
    
    try {
      const idPedido = body.id_pedido_comercio || "1";
      const monto = body.monto_total || "0";
      
      const tokenGenerado = generarTokenPaso1(idPedido, monto);
      
      const payloadCorregido = {
        ...body,
        token: tokenGenerado,
      };
      
      console.log("Token generado:", tokenGenerado);
      
      const response = await fetch(
        "https://api.pagopar.com/api/comercios/2.0/iniciar-transaccion",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payloadCorregido),
        }
      );

      const data = await response.json();
      console.log("Respuesta PagoPar:", data.respuesta ? "✅" : "❌");
      
      return { statusCode: 200, headers, body: JSON.stringify(data) };
    } catch (err) {
      console.error("Error:", err.message);
      return { statusCode: 500, headers, body: JSON.stringify({ error: err.message }) };
    }
  }

  return { statusCode: 200, headers, body: JSON.stringify({ ok: true }) };
};
