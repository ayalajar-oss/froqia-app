import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
);

export const handler = async (event) => {
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

    if (action === "register") {
      const { email, password, nombre, cedula } = data;
      if (cedula) {
        const { data: existing } = await supabase.from("perfiles").select("id").eq("cedula", cedula).maybeSingle();
        if (existing) return { statusCode: 200, headers, body: JSON.stringify({ error: "Esta cédula ya está registrada. Si ya tenés cuenta, iniciá sesión." }) };
      }
      const { data: authData, error } = await supabase.auth.signUp({
        email, password, options: { data: { nombre } }
      });
      if (error) return { statusCode: 200, headers, body: JSON.stringify({ error: error.message }) };
      return { statusCode: 200, headers, body: JSON.stringify({ user: authData.user, session: authData.session })};
    }

    if (action === "checkCedula") {
      const { cedula } = data;
      const { data: perfil } = await supabase.from("perfiles").select("id, plan_expiry").eq("cedula", cedula).maybeSingle();
      if (!perfil) return { statusCode: 200, headers, body: JSON.stringify({ exists: false }) };
      const ahora = new Date().toISOString();
      if (perfil.plan_expiry && perfil.plan_expiry > ahora) {
        return { statusCode: 200, headers, body: JSON.stringify({ exists: true, hadTrial: false, hasPlan: true }) };
      }
      return { statusCode: 200, headers, body: JSON.stringify({ exists: true, hadTrial: true }) };
    }

    if (action === "login") {
      const { email, password } = data;
      const { data: authData, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) return { statusCode: 200, headers, body: JSON.stringify({ error: error.message }) };
      const { data: perfil } = await supabase.from("perfiles").select("*").eq("id", authData.user.id).single();
      const perfilMapeado = perfil ? {
        ...perfil,
        weight: perfil.peso?.toString(),
        height: perfil.altura?.toString(),
        age: perfil.edad?.toString(),
        sex: perfil.sexo,
        goal: perfil.objetivo,
        bodyType: perfil.tipo_cuerpo,
        daysPerWeek: perfil.dias_semana,
        machines: perfil.equipos || [],
        experience: perfil.experiencia,
        cedula: perfil.cedula,
        fecha_nacimiento: perfil.fecha_nacimiento || null,
      } : null;
      return { statusCode: 200, headers, body: JSON.stringify({ user: authData.user, session: authData.session, perfil: perfilMapeado })};
    }

    if (action === "getPerfil") {
      const { user_id } = data;
      const { data: perfil } = await supabase.from("perfiles").select("*").eq("id", user_id).single();
      return { statusCode: 200, headers, body: JSON.stringify({ perfil: perfil || null }) };
    }

    if (action === "updatePerfil") {
      const { user_id, perfil } = data;
      console.log("updatePerfil user_id:", user_id);
      const { error } = await supabase.from("perfiles").upsert({
        id: user_id,
        nombre: perfil.nombre,
        email: perfil.email,
        peso: parseFloat(perfil.weight) || null,
        altura: parseFloat(perfil.height) || null,
        edad: parseInt(perfil.age) || null,
        sexo: perfil.sex,
        objetivo: perfil.goal,
        tipo_cuerpo: perfil.bodyType,
        dias_semana: perfil.daysPerWeek,
        equipos: perfil.machines || [],
        plan_id: perfil.plan_id || "trial",
        plan_expiry: perfil.plan_expiry || null,
        experiencia: perfil.experience,
        cedula: perfil.cedula || null,
        fecha_nacimiento: perfil.fecha_nacimiento || null,
        updated_at: new Date().toISOString()
      });      console.log("updatePerfil error:", JSON.stringify(error));
      if (error) return { statusCode: 200, headers, body: JSON.stringify({ error: error.message }) };
      return { statusCode: 200, headers, body: JSON.stringify({ ok: true }) };
    }

    if (action === "saveRutina") {
      const { user_id, nombre, ejercicios, calorias, grupo_muscular } = data;
      const { error } = await supabase.from("rutinas").insert({ user_id, nombre, ejercicios, calorias, grupo_muscular, fecha: new Date().toISOString().split("T")[0] });
      await supabase.from("perfiles").update({ ultimo_entrenamiento: new Date().toISOString().split("T")[0] }).eq("id", user_id);
      if (error) return { statusCode: 200, headers, body: JSON.stringify({ error: error.message }) };
      return { statusCode: 200, headers, body: JSON.stringify({ ok: true }) };
    }

    if (action === "getRutinas") {
      const { user_id } = data;
      const { data: rutinas, error } = await supabase.from("rutinas").select("*").eq("user_id", user_id).order("fecha", { ascending: false }).limit(30);
      if (error) return { statusCode: 200, headers, body: JSON.stringify({ error: error.message }) };
      return { statusCode: 200, headers, body: JSON.stringify({ rutinas }) };
    }

    if (action === "saveProgreso") {
      const { user_id, peso, notas } = data;
      const { error } = await supabase.from("progreso").insert({ user_id, peso, notas, fecha: new Date().toISOString().split("T")[0] });
      if (error) return { statusCode: 200, headers, body: JSON.stringify({ error: error.message }) };
      return { statusCode: 200, headers, body: JSON.stringify({ ok: true }) };
    }

    if (action === "getProgreso") {
      const { user_id } = data;
      const { data: progreso, error } = await supabase.from("progreso").select("*").eq("user_id", user_id).order("fecha", { ascending: false }).limit(30);
      if (error) return { statusCode: 200, headers, body: JSON.stringify({ error: error.message }) };
      return { statusCode: 200, headers, body: JSON.stringify({ progreso }) };
    }

    if (action === "saveMedicalFile") {
      const { user_id, nombre_archivo, tipo, analisis, valores_clave, tipo_informe, fecha } = data;
      const { error } = await supabase.from("historial_medico").insert({
        user_id, nombre_archivo, tipo, analisis,
        valores_clave: valores_clave || {},
        tipo_informe: tipo_informe || nombre_archivo,
        fecha: fecha || new Date().toISOString().split("T")[0]
      });
      if (error) return { statusCode: 200, headers, body: JSON.stringify({ error: error.message }) };
      return { statusCode: 200, headers, body: JSON.stringify({ ok: true }) };
    }

    if (action === "getMedicalFiles") {
      const { user_id } = data;
      const { data: archivos, error } = await supabase.from("historial_medico").select("*").eq("user_id", user_id).order("fecha", { ascending: false }).limit(20);
      if (error) return { statusCode: 200, headers, body: JSON.stringify({ error: error.message }) };
      return { statusCode: 200, headers, body: JSON.stringify({ archivos }) };
    }

    return { statusCode: 400, headers, body: JSON.stringify({ error: "Acción no reconocida: " + action }) };

  } catch (err) {
    console.error("Error:", err.message);
    return { statusCode: 500, headers, body: JSON.stringify({ error: err.message }) };
  }
};
