import { useState } from 'react'

export default function App() {
  const [hashPedido, setHashPedido] = useState(null)
  const [loading, setLoading] = useState(false)
  const [mensaje, setMensaje] = useState('')

  const crearPedido = async () => {
    setLoading(true)
    setMensaje('Creando pedido...')
    
    try {
   const payload = {
  public_key: "ee939b5cf36d53c02decb7666ab82fd2",
  monto_total: 75000,
  tipo_pedido: "VENTA-COMERCIO",
  id_pedido_comercio: "TEST" + Date.now(),
  descripcion_resumen: "Plan Mensual FROQIA",
  forma_pago: 9,
  comprador: {
    nombre: "Test User",
    email: "test@froqia.com",
    documento: "1234567",
    tipo_documento: "CI",
    ciudad: 1,
    telefono: "+595971111111",
    ruc: "",
    direccion: "",
    coordenadas: "",
    razon_social: "",
    direccion_referencia: null
  },
  compras_items: [{
    nombre: "Plan Mensual FROQIA",
    descripcion: "Plan Mensual FROQIA - Entrenamiento con IA",
    cantidad: 1,
    precio_total: 75000,
    categoria: "909",
    id_producto: 1,
    ciudad: "1",
    public_key: "ee939b5cf36d53c02decb7666ab82fd2",
    url_imagen: "",
    vendedor_telefono: "",
    vendedor_direccion: "",
    vendedor_direccion_referencia: "",
    vendedor_direccion_coordenadas: ""
  }],
  fecha_maxima_pago: "2026-05-18 12:00:00"
}

      const response = await fetch('/.netlify/functions/pagopar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })

      const data = await response.json()
      console.log('Paso 1 - Respuesta:', data)

      if (data.respuesta === true && data.resultado?.[0]?.data) {
        const hash = data.resultado[0].data
        setHashPedido(hash)
        setMensaje('✅ Pedido creado. Redirigiendo a PagoPar...')
        
        setTimeout(() => {
          window.location.href = `https://www.pagopar.com/pagos/${hash}`
        }, 1500)
      } else {
        setMensaje('❌ Error: ' + (data.resultado?.[0]?.mensaje || JSON.stringify(data)))
      }
    } catch (error) {
      setMensaje('❌ Error: ' + error.message)
    }
    setLoading(false)
  }

  const consultarEstado = async () => {
    if (!hashPedido) {
      setMensaje('❌ Sin hash guardado')
      return
    }

    setLoading(true)
    setMensaje('Consultando estado...')

    try {
      const response = await fetch('/.netlify/functions/pagopar-estado', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ hash_pedido: hashPedido })
      })

      const data = await response.json()
      console.log('Paso 4 - Respuesta:', data)

      if (data.respuesta === true && data.resultado?.[0]) {
        if (data.resultado[0].pagado === true) {
          setMensaje('✅ ¡PAGO COMPLETADO!')
        } else {
          setMensaje('⏳ Pago pendiente')
        }
      } else {
        setMensaje('❌ Error: ' + JSON.stringify(data.resultado))
      }
    } catch (error) {
      setMensaje('❌ Error: ' + error.message)
    }
    setLoading(false)
  }

  return (
    <div style={{ maxWidth: 600, margin: '0 auto', padding: 20, color: '#fff', minHeight: '100vh' }}>
      <h1 style={{ textAlign: 'center' }}>🏃 FROQIA</h1>
      <p style={{ textAlign: 'center', color: '#aaa' }}>Tu salud inteligente</p>

      <div style={{ marginTop: 40 }}>
        <button 
          onClick={crearPedido} 
          disabled={loading}
          style={{
            width: '100%',
            padding: 15,
            fontSize: 16,
            cursor: loading ? 'not-allowed' : 'pointer',
            background: '#E84A2E',
            color: '#fff',
            border: 'none',
            borderRadius: 8,
            opacity: loading ? 0.6 : 1
          }}
        >
          {loading ? 'Procesando...' : '1️⃣ Crear Pedido'}
        </button>
        
        {hashPedido && (
          <button 
            onClick={consultarEstado}
            disabled={loading}
            style={{
              width: '100%',
              padding: 15,
              fontSize: 16,
              marginTop: 10,
              cursor: loading ? 'not-allowed' : 'pointer',
              background: '#10B981',
              color: '#fff',
              border: 'none',
              borderRadius: 8,
              opacity: loading ? 0.6 : 1
            }}
          >
            {loading ? 'Consultando...' : '4️⃣ Consultar Estado'}
          </button>
        )}

        <div style={{
          marginTop: 20,
          padding: 15,
          background: '#1a1a2e',
          borderRadius: 8,
          border: '1px solid #333',
          minHeight: 60
        }}>
          <p style={{ margin: '0 0 10px 0', fontSize: 12, color: '#888' }}>
            Hash guardado: {hashPedido ? hashPedido.substring(0, 30) + '...' : 'ninguno'}
          </p>
          <p style={{ margin: 0, fontSize: 14 }}>{mensaje}</p>
        </div>
      </div>
    </div>
  )
}
