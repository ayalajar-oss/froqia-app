const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
);

exports.handler = async (event) => {
  const headers = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Content-Type": "application/json",
  };

  if (event.httpMethod === "OPTIONS") {
    return { statusCode: 200, headers, body: "" };
  }

  try {
    const { action, data } = JSON.parse(event.body || "{}");

    // Obtener perfil
    if (action === "getPerfil") {
      const { email } = data;
      const { data: perfil, error } = await supabase
        .from("perfiles")
        .select("*")
        .eq("email", email)
        .single();
      if (error) return { statusCode: 200, headers, body: JSON.stringify({ error: error.message }) };
      return { statusCode: 200, headers, body: JSON.stringify({ perfil }) };
    }

    // Guardar/actualizar perfil completo
    if (action === "updatePerfil") {
      const { email, perfil } = data;
      const { error } = await supabase
        .from("perfiles")
        .upsert({
          ...perfil,
          email,
          updated_at: new Date().toISOString()
        }, { onConflict: "email" });
      if (error) return { statusCode: 200, headers, body: JSON.stringify({ error: error.message }) };
      return { statusCode: 200, headers, body: JSON.stringify({ ok: true }) };
    }

    // Guardar rutina completada
    if (action === "saveRutina") {
      const { email, nombre, ejercicios, calorias, grupo_muscular } = data;
      
      // Guardar en tabla rutinas
      const { error } = await supabase.from("rutinas").insert({
        nombre,
        ejercicios,
        calorias,
        grupo_muscular,
        fecha: new Date().toISOString().split("T")[0]
      });
      
      // Actualizar último entrenamiento en perfil
      await supabase
        .from("perfiles")
        .update({ 
          ultimo_entrenamiento: new Date().toISOString().split("T")[0],
          updated_at: new Date().toISOString()
        })
        .eq("email", email);

      if (error) return { statusCode: 200, headers, body: JSON.stringify({ error: error.message }) };
      return { statusCode: 200, headers, body: JSON.stringify({ ok: true }) };
    }

    // Obtener historial de rutinas
    if (action === "getRutinas") {
      const { email } = data;
      
      // Primero obtener user_id desde email
      const { data: perfil } = await supabase
        .from("perfiles")
        .select("id")
        .eq("email", email)
        .single();

      const { data: rutinas, error } = await supabase
        .from("rutinas")
        .select("*")
        .order("fecha", { ascending: false })
        .limit(30);

      if (error) return { statusCode: 200, headers, body: JSON.stringify({ error: error.message }) };
      return { statusCode: 200, headers, body: JSON.stringify({ rutinas }) };
    }

    // Guardar progreso de peso
    if (action === "saveProgreso") {
      const { email, peso, notas } = data;
      const { error } = await supabase.from("progreso").insert({
        peso,
        notas,
        fecha: new Date().toISOString().split("T")[0]
      });
      if (error) return { statusCode: 200, headers, body: JSON.stringify({ error: error.message }) };
      return { statusCode: 200, headers, body: JSON.stringify({ ok: true }) };
    }

    // Obtener progreso de peso
    if (action === "getProgreso") {
      const { email } = data;
      const { data: progreso, error } = await supabase
        .from("progreso")
        .select("*")
        .order("fecha", { ascending: false })
        .limit(30);
      if (error) return { statusCode: 200, headers, body: JSON.stringify({ error: error.message }) };
      return { statusCode: 200, headers, body: JSON.stringify({ progreso }) };
    }

    return { statusCode: 400, headers, body: JSON.stringify({ error: "Acción no reconocida: " + action }) };

  } catch (err) {
    console.error("Error:", err.message);
    return { statusCode: 500, headers, body: JSON.stringify({ error: err.message }) };
  }
};