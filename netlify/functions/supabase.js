// Netlify Function - supabase proxy
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

    // Registro de usuario
    if (action === "register") {
      const { email, password, perfil } = data;
      const { data: authData, error } = await supabase.auth.signUp({ email, password });
      if (error) return { statusCode: 200, headers, body: JSON.stringify({ error: error.message }) };
      
      // Guardar perfil
      await supabase.from("perfiles").upsert({
        id: authData.user.id,
        email,
        ...perfil
      });
      
      return { statusCode: 200, headers, body: JSON.stringify({ user: authData.user, session: authData.session }) };
    }

    // Login
    if (action === "login") {
      const { email, password } = data;
      const { data: authData, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) return { statusCode: 200, headers, body: JSON.stringify({ error: error.message }) };
      
      // Obtener perfil
      const { data: perfil } = await supabase.from("perfiles").select("*").eq("id", authData.user.id).single();
      
      return { statusCode: 200, headers, body: JSON.stringify({ user: authData.user, session: authData.session, perfil }) };
    }

    // Obtener perfil
    if (action === "getPerfil") {
      const { user_id } = data;
      const { data: perfil, error } = await supabase.from("perfiles").select("*").eq("id", user_id).single();
      if (error) return { statusCode: 200, headers, body: JSON.stringify({ error: error.message }) };
      return { statusCode: 200, headers, body: JSON.stringify({ perfil }) };
    }

    // Actualizar perfil
    if (action === "updatePerfil") {
      const { user_id, perfil } = data;
      const { error } = await supabase.from("perfiles").upsert({ id: user_id, ...perfil, updated_at: new Date().toISOString() });
      if (error) return { statusCode: 200, headers, body: JSON.stringify({ error: error.message }) };
      return { statusCode: 200, headers, body: JSON.stringify({ ok: true }) };
    }

    // Guardar progreso
    if (action === "saveProgreso") {
      const { user_id, peso, notas } = data;
      const { error } = await supabase.from("progreso").insert({ user_id, peso, notas });
      if (error) return { statusCode: 200, headers, body: JSON.stringify({ error: error.message }) };
      return { statusCode: 200, headers, body: JSON.stringify({ ok: true }) };
    }

    // Obtener progreso
    if (action === "getProgreso") {
      const { user_id } = data;
      const { data: progreso, error } = await supabase.from("progreso").select("*").eq("user_id", user_id).order("fecha", { ascending: false }).limit(30);
      if (error) return { statusCode: 200, headers, body: JSON.stringify({ error: error.message }) };
      return { statusCode: 200, headers, body: JSON.stringify({ progreso }) };
    }

    // Guardar rutina completada
    if (action === "saveRutina") {
      const { user_id, nombre, ejercicios, calorias } = data;
      const { error } = await supabase.from("rutinas").insert({ user_id, nombre, ejercicios, calorias });
      if (error) return { statusCode: 200, headers, body: JSON.stringify({ error: error.message }) };
      return { statusCode: 200, headers, body: JSON.stringify({ ok: true }) };
    }

    return { statusCode: 400, headers, body: JSON.stringify({ error: "Acción no reconocida" }) };

  } catch (err) {
    return { statusCode: 500, headers, body: JSON.stringify({ error: err.message }) };
  }
};
