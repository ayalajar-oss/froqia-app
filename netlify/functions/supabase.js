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

    // REGISTRO
    if (action === "register") {
      const { email, password, nombre } = data;
      const { data: authData, error } = await supabase.auth.signUp({ 
        email, 
        password,
        options: { data: { nombre } }
      });
      if (error) return { statusCode: 200, headers, body: JSON.stringify({ error: error.message }) };
      return { statusCode: 200, headers, body: JSON.stringify({ 
        user: authData.user, 
        session: authData.session 
      })};
    }

    // LOGIN
    if (action === "login") {
      const { email, password } = data;
      const { data: authData, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) return { statusCode: 200, headers, body: JSON.stringify({ error: error.message }) };
      
      // Obtener perfil
      const { data: perfil } = await supabase
        .from("perfiles")
        .select("*")
        .eq("id", authData.user.id)
        .single();

      return { statusCode: 200, headers, body: JSON.stringify({ 
        user: authData.user, 
        session: authData.session,
        perfil 
      })};
    }

    // Obtener perfil
    if (action === "getPerfil") {
      const { user_id } = data;
      const { data: perfil, error } = await supabase
        .from("perfiles")
        .select("*")
        .eq("id", user_id)
        .single();
      if (error) return { statusCode: 200, headers, body: JSON.stringify({ error: error.message }) };
      return { statusCode: 200, headers, body: JSON.stringify({ perfil }) };
    }

    // Guardar/actualizar perfil
    if (action === "updatePerfil") {
      const { user_id, perfil } = data;
      const { error } = await supabase
        .from("perfiles")
        .upsert({
          id: user_id,
          ...perfil,
          updated_at: new Date().toISOString()
        });
      if (error) return { statusCode: 200, headers, body: JSON.stringify({ error: error.message }) };
      return { statusCode: 200, headers, body: JSON.stringify({ ok: true }) };
    }

    // Guardar rutina completada
    if (action === "saveRutina") {
      const { user_id, nombre, ejercicios, calorias, grupo_muscular } = data;
      const { error } = await supabase.from("rutinas").insert({
        user_id,
        nombre,
        ejercicios,
        calorias,
        grupo_muscular,
        fecha: new Date().toISOString().split("T")[0]
      });
      
      // Actualizar último entrenamiento
      await supabase.from("perfiles")
        .update({ ultimo_entrenamiento: new Date().toISOString().split("T")[0] })
        .eq("id", user_id);

      if (error) return { statusCode: 200, headers, body: JSON.stringify({ error: error.message }) };
      return { statusCode: 200, headers, body: JSON.stringify({ ok: true }) };
    }

    // Obtener rutinas
    if (action === "getRutinas") {
      const { user_id } = data;
      const { data: rutinas, error } = await supabase
        .from("rutinas")
        .select("*")
        .eq("user_id", user_id)
        .order("fecha", { ascending: false })
        .limit(30);
      if (error) return { statusCode: 200, headers, body: JSON.stringify({ error: error.message }) };
      return { statusCode: 200, headers, body: JSON.stringify({ rutinas }) };
    }

    // Guardar progreso de peso
    if (action === "saveProgreso") {
      const { user_id, peso, notas } = data;
      const { error } = await supabase.from("progreso").insert({
        user_id,
        peso,
        notas,
        fecha: new Date().toISOString().split("T")[0]
      });
      if (error) return { statusCode: 200, headers, body: JSON.stringify({ error: error.message }) };
      return { statusCode: 200, headers, body: JSON.stringify({ ok: true }) };
    }

    // Obtener progreso
    if (action === "getProgreso") {
      const { user_id } = data;
      const { data: progreso, error } = await supabase
        .from("progreso")
        .select("*")
        .eq("user_id", user_id)
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
