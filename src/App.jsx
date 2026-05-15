import { useState, useEffect, useRef } from "react";

// ─── CONFIG ───────────────────────────────────────────────────────────────────
const PAGOPAR_CONFIG = {
  PUBLIC_KEY: "ee939b5cf36d53c02decb7666ab82fd2",
  PRIVATE_KEY: "9186345beb9c478b0a295800eb006daf",
  API_URL: "/.netlify/functions/pagopar",
  CHECKOUT_URL: "https://www.pagopar.com/pagos/",
};

// ─── BRAND ────────────────────────────────────────────────────────────────────
const BRAND = {
  name: "FROQIA",
  tagline: "Tu salud inteligente",
  color: "#e84a2e",
  accent: "#f59e0b",
  logo: "🏆",
};

// ─── BODY TYPES — lenguaje positivo, sin etiquetas negativas ──────────────────
const BODY_TYPES = [
  {
    id: "ectomorph",
    label: "Cuerpo Ligero",
    sublabel: "Ectomorfo",
    emoji: "⚡",
    color: "#06b6d4",
    tagline: "Velocidad y agilidad natural",
    proteinFactor: 2.2,
    desc: "Complexión fina, metabolismo activo y alta energía",
    details: "Tu cuerpo procesa la energía muy rápido. Tenés una base perfecta para construir un físico atlético y definido con el plan correcto.",
    strengths: ["Metabolismo rápido y activo", "Naturalmente definido", "Alta resistencia cardio"],
    plan: "Entrenamientos cortos e intensos, superávit calórico moderado. Tu cuerpo necesita combustible para crecer.",
    gifUrl: "https://media.giphy.com/media/l0HlBO7eyXzSZkJri/giphy.gif",
    imageKeywords: "athletic slim runner body fitness",
  },
  {
    id: "mesomorph",
    label: "Cuerpo Atlético",
    sublabel: "Mesomorfo",
    emoji: "💪",
    color: "#e84a2e",
    tagline: "Respuesta óptima al entrenamiento",
    proteinFactor: 1.8,
    desc: "Proporción equilibrada, músculo natural y buena recuperación",
    details: "Tenés la genética más favorable para el deporte. Tu cuerpo responde muy bien tanto al entrenamiento de fuerza como de resistencia.",
    strengths: ["Gana músculo con facilidad", "Recuperación rápida", "Resultados visibles pronto"],
    plan: "Podés combinar fuerza e hipertrofia. Variá los estímulos para seguir progresando semana a semana.",
    gifUrl: "https://media.giphy.com/media/3o7TKwBCtM3SaMKMKc/giphy.gif",
    imageKeywords: "athletic muscular fit body fitness gym",
  },
  {
    id: "endomorph",
    label: "Cuerpo Fuerte",
    sublabel: "Endomorfo",
    emoji: "🔥",
    color: "#f59e0b",
    tagline: "Potencial de transformación extraordinario",
    proteinFactor: 2.0,
    desc: "Estructura sólida, gran fuerza natural y enorme potencial",
    details: "Tu cuerpo tiene una base muscular poderosa. Con el plan correcto podés lograr transformaciones físicas que sorprenden. Tu constancia es tu superpoder.",
    strengths: ["Gran fuerza natural de base", "Potencial de transformación enorme", "Resistencia muscular elevada"],
    plan: "Combiná pesas con cardio moderado. El déficit calórico inteligente más músculo = transformación real y duradera.",
    gifUrl: "https://media.giphy.com/media/xT9IgG50Lg7rusRgXa/giphy.gif",
    imageKeywords: "strong powerful body transformation fitness",
  },
];

// ─── GOALS ────────────────────────────────────────────────────────────────────
const GOALS = [
  {
    id: "muscle_gain", label: "Ganar Músculo", emoji: "💪", color: "#e84a2e", proteinMultiplier: 2.2,
    desc: "Construí el cuerpo que siempre quisiste. Más músculo = mejor metabolismo y más fuerza en el día a día.",
    timeline: ["Semana 1-2: Fuerza neural", "Mes 1: Músculos más firmes", "Mes 2-3: Cambios visibles", "Mes 4-6: Transformación real"],
  },
  {
    id: "fat_loss", label: "Quemar Grasa", emoji: "🔥", color: "#f59e0b", proteinMultiplier: 2.4,
    desc: "Pérdida de grasa inteligente preservando músculo. Déficit calórico + pesas = el combo perfecto.",
    timeline: ["Semana 1-2: Menos retención", "Mes 1: Ropa más suelta", "Mes 2-3: Definición visible", "Mes 4-6: Nuevo físico"],
  },
  {
    id: "strength", label: "Fuerza Máxima", emoji: "🏋️", color: "#8b5cf6", proteinMultiplier: 2.0,
    desc: "La fuerza es la base de todo. Más fuerza = mejor postura, menos lesiones y mayor calidad de vida.",
    timeline: ["Semana 1-3: Adaptación neural", "Mes 1: Primeros PRs", "Mes 2-3: Fuerza real", "Mes 4-6: Atleta de fuerza"],
  },
  {
    id: "toning", label: "Tonificar", emoji: "✨", color: "#06b6d4", proteinMultiplier: 1.8,
    desc: "Cuerpo firme, compacto y definido. Sin volumen excesivo. Ideal para verte y sentirte mejor.",
    timeline: ["Semana 1-2: Más energía", "Mes 1: Ropa diferente", "Mes 2-3: Definición clara", "Mes 4-6: Cuerpo soñado"],
  },
  {
    id: "endurance", label: "Resistencia", emoji: "🏅", color: "#10b981", proteinMultiplier: 1.6,
    desc: "Más energía, más aguante, más vida. Con mayor resistencia, todo se vuelve más fácil.",
    timeline: ["Semana 1-2: Menos cansancio", "Mes 1: Corazón más fuerte", "Mes 2-3: Resistencia real", "Mes 4-6: Atleta completo"],
  },
];

// ─── EQUIPAMIENTO FLEXIBLE — multi-marca, cualquier gym ──────────────────────
// Categorías de equipamiento organizadas por tipo, no por marca
const EQUIPMENT_CATEGORIES = [
  {
    id: "machines_upper",
    label: "Máquinas — Tren Superior",
    emoji: "🏋️",
    color: "#e84a2e",
    items: [
      { id: "chest_press_m", name: "Chest Press (máquina)", muscle: "Pectoral", videoId: "xUm0BiZCWlQ", tips: ["Codos a 45°", "Exhala al empujar", "No bloquees los codos"], muscles_worked: ["Pectoral mayor", "Tríceps", "Deltoides anterior"] },
      { id: "pec_fly_m", name: "Pec Fly / Mariposa (máquina)", muscle: "Pectoral", videoId: "Z57CtFmRMxA", tips: ["Leve flexión de codos", "Abre con control", "Cierra apretando el pecho"], muscles_worked: ["Pectoral mayor", "Deltoides anterior"] },
      { id: "shoulder_press_m", name: "Shoulder Press (máquina)", muscle: "Hombros", videoId: "qEwKCR5JCog", tips: ["Espalda recta", "No encogés los hombros", "Rango completo"], muscles_worked: ["Deltoides", "Tríceps", "Trapecio"] },
      { id: "lat_pulldown_m", name: "Jalón al Pecho (máquina)", muscle: "Dorsal", videoId: "CAwf7n6Luuc", tips: ["Jalá hacia el pecho", "Abre el pecho", "Control en la vuelta"], muscles_worked: ["Dorsal ancho", "Bíceps", "Romboides"] },
      { id: "seated_row_m", name: "Remo Sentado (máquina)", muscle: "Espalda Media", videoId: "GZbfZ033f74", tips: ["Aprieta omóplatos", "Codos pegados al cuerpo", "Espalda erguida"], muscles_worked: ["Romboides", "Trapecio medio", "Bíceps"] },
      { id: "rear_delt_m", name: "Deltoides Posterior (máquina)", muscle: "Deltoides Post.", videoId: "EA7u4Q_8HQ0", tips: ["Codos ligeramente flexionados", "Jalá hacia atrás", "Aprieta escápulas"], muscles_worked: ["Deltoides posterior", "Romboides"] },
      { id: "pullover_m", name: "Pullover (máquina)", muscle: "Dorsal", videoId: "jr2_P_c5_6I", tips: ["Agarre firme", "Codos ligeramente flexionados", "Sentís el dorsal"], muscles_worked: ["Dorsal ancho", "Serrato anterior"] },
    ]
  },
  {
    id: "machines_arms",
    label: "Máquinas — Brazos",
    emoji: "💪",
    color: "#8b5cf6",
    items: [
      { id: "bicep_curl_m", name: "Curl de Bíceps (máquina)", muscle: "Bíceps", videoId: "ykJmrZ5v0Oo", tips: ["Codos fijos", "Sube lento, baja lento", "Sin balanceo"], muscles_worked: ["Bíceps braquial", "Braquialis"] },
      { id: "tricep_ext_m", name: "Extensión de Tríceps (máquina)", muscle: "Tríceps", videoId: "2-LAMcpzODU", tips: ["Codos fijos", "Extensión completa", "Control total"], muscles_worked: ["Tríceps (3 cabezas)"] },
      { id: "tricep_dip_m", name: "Fondos en Máquina (tríceps)", muscle: "Tríceps", videoId: "2-LAMcpzODU", tips: ["Torso ligeramente inclinado", "Baja controlado", "Extensión completa"], muscles_worked: ["Tríceps", "Pectoral inferior"] },
    ]
  },
  {
    id: "machines_lower",
    label: "Máquinas — Tren Inferior",
    emoji: "🦵",
    color: "#f59e0b",
    items: [
      { id: "leg_press_m", name: "Prensa de Piernas (máquina)", muscle: "Cuádriceps", videoId: "IZxyjW7MPJQ", tips: ["Pies al ancho de hombros", "Rodillas no sobrepasen pies", "Espalda pegada"], muscles_worked: ["Cuádriceps", "Glúteos", "Isquiotibiales"] },
      { id: "leg_curl_m", name: "Curl de Isquiotibiales (máquina)", muscle: "Isquiotibiales", videoId: "ELOCsoDSmrg", tips: ["Cadera pegada al asiento", "Contracción completa", "Baja controlado"], muscles_worked: ["Isquiotibiales", "Gemelos"] },
      { id: "leg_ext_m", name: "Extensión de Cuádriceps (máquina)", muscle: "Cuádriceps", videoId: "YyvSfVjQeL0", tips: ["Extensión completa arriba", "No rebotes", "Contrae el cuádriceps"], muscles_worked: ["Cuádriceps (4 cabezas)"] },
      { id: "calf_raise_m", name: "Elevación de Gemelos (máquina)", muscle: "Gemelos", videoId: "gwLzBJYoWlI", tips: ["Rango completo de movimiento", "Pausa arriba", "Baja lento"], muscles_worked: ["Gastrocnemio", "Sóleo"] },
      { id: "hip_abductor_m", name: "Abductor de Cadera (máquina)", muscle: "Abductores", videoId: "IZxyjW7MPJQ", tips: ["Espalda recta", "Movimiento controlado", "Aprieta al tope"], muscles_worked: ["Abductores", "Glúteo medio"] },
      { id: "hip_adductor_m", name: "Aductor de Cadera (máquina)", muscle: "Aductores", videoId: "IZxyjW7MPJQ", tips: ["Espalda recta", "Sin impulso", "Control en la apertura"], muscles_worked: ["Aductores", "Glúteo menor"] },
      { id: "glute_m", name: "Glúteo (máquina / kickback)", muscle: "Glúteos", videoId: "IZxyjW7MPJQ", tips: ["Core activado", "No arqueés la espalda", "Contrae el glúteo al tope"], muscles_worked: ["Glúteo mayor", "Isquiotibiales"] },
    ]
  },
  {
    id: "machines_core",
    label: "Máquinas — Core",
    emoji: "🎯",
    color: "#10b981",
    items: [
      { id: "ab_crunch_m", name: "Crunch Abdominal (máquina)", muscle: "Abdomen", videoId: "Xyd_fa5zoEU", tips: ["No jalés el cuello", "Contrae el core", "Exhala al subir"], muscles_worked: ["Recto abdominal", "Oblicuos"] },
      { id: "back_ext_m", name: "Extensión Lumbar (máquina)", muscle: "Lumbar", videoId: "ph3pddpKzzw", tips: ["Movimiento controlado", "No hiperextendas", "Aprieta glúteos arriba"], muscles_worked: ["Erector espinal", "Glúteos"] },
      { id: "rotary_torso_m", name: "Rotación de Torso (máquina)", muscle: "Oblicuos", videoId: "5FGnJGJoMHI", tips: ["Giro controlado", "No uses impulso", "Rotación desde la cintura"], muscles_worked: ["Oblicuos", "Transverso abdominal"] },
    ]
  },
  {
    id: "free_weights",
    label: "Peso Libre",
    emoji: "🏋️",
    color: "#06b6d4",
    items: [
      { id: "barbell_bench", name: "Press de Banca (barra)", muscle: "Pectoral", videoId: "rT7DgCr-3pg", tips: ["Escápulas juntas", "Pies en el suelo", "Baja la barra al pecho"], muscles_worked: ["Pectoral mayor", "Tríceps", "Deltoides anterior"] },
      { id: "barbell_squat", name: "Sentadilla con Barra", muscle: "Cuádriceps", videoId: "ultWZbUMPL8", tips: ["Espalda recta", "Rodillas hacia afuera", "Baja hasta paralelo"], muscles_worked: ["Cuádriceps", "Glúteos", "Isquiotibiales"] },
      { id: "barbell_deadlift", name: "Peso Muerto con Barra", muscle: "Espalda / Glúteos", videoId: "op9kVnSso6Q", tips: ["Espalda neutral", "Barra pegada al cuerpo", "Empuja con las piernas"], muscles_worked: ["Isquiotibiales", "Glúteos", "Erector espinal"] },
      { id: "barbell_row", name: "Remo con Barra", muscle: "Espalda", videoId: "G8l_8chR5BE", tips: ["Espalda a 45°", "Codos pegados", "Aprieta omóplatos"], muscles_worked: ["Dorsal", "Romboides", "Bíceps"] },
      { id: "dumbbell_curl", name: "Curl de Bíceps con Mancuernas", muscle: "Bíceps", videoId: "ykJmrZ5v0Oo", tips: ["Alterna o simultáneo", "Sin balanceo", "Rota la muñeca al subir"], muscles_worked: ["Bíceps braquial", "Braquialis"] },
      { id: "dumbbell_press", name: "Press de Hombros con Mancuernas", muscle: "Hombros", videoId: "qEwKCR5JCog", tips: ["Codos a 90°", "No bloquees arriba", "Controlado en la bajada"], muscles_worked: ["Deltoides", "Tríceps"] },
      { id: "dumbbell_row", name: "Remo con Mancuerna", muscle: "Espalda", videoId: "GZbfZ033f74", tips: ["Espalda paralela al suelo", "Codo pegado al cuerpo", "Contrae el dorsal"], muscles_worked: ["Dorsal", "Romboides", "Bíceps"] },
      { id: "dumbbell_lunge", name: "Estocada con Mancuernas", muscle: "Piernas", videoId: "IZxyjW7MPJQ", tips: ["Torso erguido", "Rodilla no pasa el pie", "Paso amplio"], muscles_worked: ["Cuádriceps", "Glúteos", "Isquiotibiales"] },
    ]
  },
  {
    id: "cables",
    label: "Poleas / Cables",
    emoji: "🔗",
    color: "#f59e0b",
    items: [
      { id: "cable_fly", name: "Aperturas con Polea", muscle: "Pectoral", videoId: "Z57CtFmRMxA", tips: ["Leve flexión de codos", "Mantén el ángulo", "Control total"], muscles_worked: ["Pectoral mayor", "Deltoides anterior"] },
      { id: "cable_row", name: "Remo en Polea Baja", muscle: "Espalda", videoId: "GZbfZ033f74", tips: ["Espalda recta", "Aprieta omóplatos", "Control en la vuelta"], muscles_worked: ["Dorsal", "Romboides", "Bíceps"] },
      { id: "cable_pulldown", name: "Jalón con Polea Alta", muscle: "Dorsal", videoId: "CAwf7n6Luuc", tips: ["Agarre al ancho de hombros", "Jalá al pecho", "Control en la vuelta"], muscles_worked: ["Dorsal ancho", "Bíceps", "Romboides"] },
      { id: "cable_tricep", name: "Extensión de Tríceps en Polea", muscle: "Tríceps", videoId: "2-LAMcpzODU", tips: ["Codos fijos", "Extensión completa", "Control al volver"], muscles_worked: ["Tríceps (3 cabezas)"] },
      { id: "cable_curl", name: "Curl de Bíceps en Polea", muscle: "Bíceps", videoId: "ykJmrZ5v0Oo", tips: ["Codos fijos al cuerpo", "Contrae al máximo", "Baja controlado"], muscles_worked: ["Bíceps braquial"] },
      { id: "cable_lateral", name: "Elevación Lateral con Polea", muscle: "Hombros", videoId: "qEwKCR5JCog", tips: ["Leve flexión de codo", "Llega a la altura del hombro", "No balancees"], muscles_worked: ["Deltoides lateral"] },
    ]
  },
  {
    id: "bodyweight",
    label: "Peso Corporal",
    emoji: "🤸",
    color: "#10b981",
    items: [
      { id: "pushup", name: "Flexiones de Brazos", muscle: "Pectoral / Tríceps", videoId: "IODxDxX7oi4", tips: ["Core activado", "Cuerpo recto", "Codos a 45°"], muscles_worked: ["Pectoral", "Tríceps", "Core"] },
      { id: "pullup", name: "Dominadas", muscle: "Dorsal / Bíceps", videoId: "eGo4IYlbE5g", tips: ["Agarre supino o prono", "Sube el pecho a la barra", "Baja controlado"], muscles_worked: ["Dorsal", "Bíceps", "Romboides"] },
      { id: "dip", name: "Fondos en Paralelas", muscle: "Pectoral / Tríceps", videoId: "2z8JmcrW-As", tips: ["Inclináte hacia adelante", "Baja hasta 90°", "Sin balanceo"], muscles_worked: ["Pectoral inferior", "Tríceps", "Deltoides anterior"] },
      { id: "squat_bw", name: "Sentadilla (peso corporal)", muscle: "Piernas", videoId: "YaXPRqUwItQ", tips: ["Peso en los talones", "Rodillas hacia afuera", "Pecho erguido"], muscles_worked: ["Cuádriceps", "Glúteos"] },
      { id: "plank", name: "Plancha", muscle: "Core", videoId: "pSHjTRCQxIw", tips: ["Cuerpo recto", "No bajes la cadera", "Respira de forma regular"], muscles_worked: ["Core completo", "Hombros"] },
      { id: "hip_thrust_bw", name: "Hip Thrust (peso corporal)", muscle: "Glúteos", videoId: "LM8XHLYJoYs", tips: ["Empuje desde talones", "Aprieta glúteos arriba", "Espalda apoyada"], muscles_worked: ["Glúteo mayor", "Isquiotibiales"] },
    ]
  },
  {
    id: "elastic",
    label: "Gomas / Bandas Elásticas",
    emoji: "🟡",
    color: "#f59e0b",
    items: [
      { id: "band_squat", name: "Sentadilla con Banda", muscle: "Piernas / Glúteos", videoId: "YaXPRqUwItQ", tips: ["Banda en rodillas", "Rodillas hacia afuera", "Activa glúteos"], muscles_worked: ["Cuádriceps", "Glúteo medio", "Aductores"] },
      { id: "band_hip_thrust", name: "Hip Thrust con Banda", muscle: "Glúteos", videoId: "LM8XHLYJoYs", tips: ["Banda en caderas", "Empuje desde talones", "Contrae al tope"], muscles_worked: ["Glúteo mayor", "Isquiotibiales"] },
      { id: "band_row", name: "Remo con Banda Elástica", muscle: "Espalda", videoId: "GZbfZ033f74", tips: ["Espalda recta", "Aprieta omóplatos", "Control al extender"], muscles_worked: ["Dorsal", "Romboides", "Bíceps"] },
      { id: "band_chest", name: "Press de Pecho con Banda", muscle: "Pectoral", videoId: "xUm0BiZCWlQ", tips: ["Banda detrás de la espalda", "Empuje firme", "Control al volver"], muscles_worked: ["Pectoral", "Tríceps"] },
      { id: "band_curl", name: "Curl de Bíceps con Banda", muscle: "Bíceps", videoId: "ykJmrZ5v0Oo", tips: ["Pisa la banda", "Sube controlado", "Sin balanceo"], muscles_worked: ["Bíceps braquial"] },
      { id: "band_lateral", name: "Caminata Lateral con Banda", muscle: "Abductores / Glúteos", videoId: "IZxyjW7MPJQ", tips: ["Banda en tobillos o rodillas", "Posición de semi-sentadilla", "Pasos controlados"], muscles_worked: ["Glúteo medio", "Abductores"] },
      { id: "band_warmup", name: "Calentamiento con Banda (rotaciones)", muscle: "Movilidad", videoId: "EA7u4Q_8HQ0", tips: ["Movimientos lentos y amplios", "Sin tensión excesiva", "Ideal para el inicio"], muscles_worked: ["Hombros", "Cadera", "Columna"] },
    ]
  },
  {
    id: "cardio",
    label: "Cardio / Aeróbico",
    emoji: "🏃",
    color: "#06b6d4",
    items: [
      { id: "treadmill", name: "Cinta / Trotadora", muscle: "Cardio", videoId: "tTej59yPYIo", tips: ["Postura erguida", "Brazos relajados", "Empieza lento y aumenta"], muscles_worked: ["Cardio", "Piernas", "Core"] },
      { id: "bike", name: "Bicicleta Estática", muscle: "Cardio", videoId: "tTej59yPYIo", tips: ["Asiento a altura de cadera", "Pedaleado fluido", "Resistencia progresiva"], muscles_worked: ["Cardio", "Cuádriceps", "Glúteos"] },
      { id: "elliptical", name: "Elíptica", muscle: "Cardio", videoId: "tTej59yPYIo", tips: ["Espalda recta", "Usa los brazos también", "Ritmo constante"], muscles_worked: ["Cardio", "Cuerpo completo"] },
      { id: "rowing_machine", name: "Remo (máquina)", muscle: "Cardio / Espalda", videoId: "GZbfZ033f74", tips: ["Empuje con las piernas primero", "Luego inclináte atrás", "Finaliza con los brazos"], muscles_worked: ["Cardio", "Espalda", "Piernas"] },
      { id: "jump_rope", name: "Cuerda de Saltar", muscle: "Cardio", videoId: "tTej59yPYIo", tips: ["Muñecas hacen el movimiento", "Aterrizás suave", "Empieza 30 seg y aumenta"], muscles_worked: ["Cardio", "Gemelos", "Coordinación"] },
      { id: "stair_climber", name: "Escaladora / Stepper", muscle: "Cardio / Glúteos", videoId: "tTej59yPYIo", tips: ["No te apoyes demasiado", "Pasos completos", "Ritmo constante"], muscles_worked: ["Glúteos", "Cuádriceps", "Cardio"] },
    ]
  },
  {
    id: "functional",
    label: "Funcional / Complementos",
    emoji: "⚡",
    color: "#e84a2e",
    items: [
      { id: "trx", name: "TRX / Suspensión", muscle: "Cuerpo completo", videoId: "IODxDxX7oi4", tips: ["Ajustá el ángulo para dificultad", "Core siempre activado", "Movimientos lentos y controlados"], muscles_worked: ["Core", "Cuerpo completo"] },
      { id: "kettlebell", name: "Kettlebell", muscle: "Funcional", videoId: "op9kVnSso6Q", tips: ["Swing desde cadera", "Espalda neutral", "Explosividad controlada"], muscles_worked: ["Glúteos", "Core", "Espalda"] },
      { id: "bosu", name: "BOSU / Plataforma inestable", muscle: "Equilibrio / Core", videoId: "pSHjTRCQxIw", tips: ["Activa el core para estabilizar", "Movimientos controlados", "Ideal para movilidad"], muscles_worked: ["Core", "Equilibrio", "Estabilizadores"] },
      { id: "medicine_ball", name: "Pelota Medicinal", muscle: "Core / Explosivo", videoId: "Xyd_fa5zoEU", tips: ["Lanzamientos explosivos", "Contrae el core", "Variá los ejercicios"], muscles_worked: ["Core", "Hombros", "Pectoral"] },
      { id: "box_jump", name: "Cajón Pliométrico", muscle: "Explosividad", videoId: "YaXPRqUwItQ", tips: ["Aterrizá suave", "Flexión de rodillas al caer", "Completá la extensión arriba"], muscles_worked: ["Cuádriceps", "Glúteos", "Core"] },
      { id: "ab_wheel", name: "Rueda Abdominal", muscle: "Core / Abdomen", videoId: "Xyd_fa5zoEU", tips: ["Espalda neutral", "Extensión gradual", "Empezá con rango corto"], muscles_worked: ["Recto abdominal", "Oblicuos", "Hombros"] },
      { id: "foam_roller", name: "Foam Roller (recuperación)", muscle: "Recuperación", videoId: "ph3pddpKzzw", tips: ["Rueda despacio", "Pausa en puntos tensos", "Ideal post-entreno"], muscles_worked: ["Recuperación muscular", "Fascia"] },
    ]
  },
];

// Accesores planos para compatibilidad con la lógica de la app
const ALL_EQUIPMENT = EQUIPMENT_CATEGORIES.flatMap(c => c.items.map(i => ({ ...i, category: c.id, categoryLabel: c.label, categoryColor: c.color })));
const getMachineData = (name) => ALL_EQUIPMENT.find(m => name?.toLowerCase().includes(m.name.toLowerCase().split("(")[0].trim()) || m.name.toLowerCase().includes((name || "").toLowerCase().split("(")[0].trim()));

// Extras de calentamiento, abdominales y cierre
const WARMUP_EXTRAS = [
  { id: "band_warmup_rot", name: "Rotaciones con banda elástica", desc: "5 min — Hombros, cadera y columna. Activa articulaciones antes del trabajo principal.", emoji: "🟡" },
  { id: "dynamic_stretch", name: "Estiramientos dinámicos", desc: "5 min — Piernas, brazos y tronco. Sin rebotes, movimientos fluidos.", emoji: "🤸" },
  { id: "bike_warmup", name: "Bicicleta estática (calentamiento)", desc: "5-8 min a ritmo suave. Eleva la temperatura muscular gradualmente.", emoji: "🚴" },
  { id: "jump_rope_warmup", name: "Cuerda de saltar (calentamiento)", desc: "3-5 min a ritmo moderado. Activa el sistema cardiovascular.", emoji: "🪢" },
  { id: "joint_mobility", name: "Movilidad articular completa", desc: "5 min — Tobillos, rodillas, caderas, hombros y cuello en círculos.", emoji: "🔄" },
];

const FINISHER_OPTIONS = [
  { id: "abs_circuit", name: "Circuito abdominal de cierre", desc: "3 rondas: 20 crunches + 30 seg plancha + 15 elevaciones de piernas. Sin descanso entre ejercicios.", emoji: "🎯", category: "Core" },
  { id: "cardio_finish", name: "Cardio finalizador", desc: "10-15 min en bicicleta o cinta a intensidad moderada. Quema calorías extra y mejora recuperación.", emoji: "🏃", category: "Cardio" },
  { id: "band_glute_finish", name: "Activación de glúteos con banda", desc: "3 series: 20 caminatas laterales + 15 hip thrusts con banda. Perfecto para días de piernas.", emoji: "🟡", category: "Glúteos" },
  { id: "core_plank_finish", name: "Plancha y variantes", desc: "Plancha frontal 45 seg + plancha lateral 30 seg/lado + plancha con toque 20 reps. 2 rondas.", emoji: "💪", category: "Core" },
  { id: "stretch_finish", name: "Estiramiento profundo de cierre", desc: "10 min — Enfriamiento completo con estiramientos estáticos. Fundamental para recuperación.", emoji: "🧘", category: "Recuperación" },
  { id: "hiit_finish", name: "HIIT finalizador (5 min)", desc: "5 rounds: 30 seg de burpees o saltos al cajón + 30 seg de descanso. Para acelerar la quema calórica.", emoji: "⚡", category: "Cardio" },
];



// ─── PROTEIN FOODS ────────────────────────────────────────────────────────────
const PROTEIN_FOODS = [
  // unit: "g" = gramos libres | "unit" = contable con nombre
  { name: "Pechuga de pollo", emoji: "🍗", per100g: 31, cal100g: 165, fat: 3.6, carbs: 0, tag: "lean", desc: "La mejor fuente magra. Ideal post-entreno.", unit: "g", defaultGrams: 150 },
  { name: "Carne vacuna magra", emoji: "🥩", per100g: 26, cal100g: 218, fat: 13, carbs: 0, tag: "lean", desc: "Rica en hierro y zinc. 2-3 veces/semana.", unit: "g", defaultGrams: 150 },
  { name: "Huevo entero", emoji: "🥚", per100g: 13, cal100g: 155, fat: 11, carbs: 1.1, tag: "complete", desc: "Proteína completa y económica. ~6g prot. c/u.", unit: "unit", unitName: "huevo", unitGrams: 50, defaultUnits: 2 },
  { name: "Clara de huevo", emoji: "🍳", per100g: 11, cal100g: 52, fat: 0.2, carbs: 0.7, tag: "lean", desc: "Casi pura proteína, sin grasa. ~4g prot. c/u.", unit: "unit", unitName: "clara", unitGrams: 33, defaultUnits: 3 },
  { name: "Atún al agua", emoji: "🐟", per100g: 25, cal100g: 116, fat: 1, carbs: 0, tag: "lean", desc: "~20g proteína por lata. Máx 3 veces/semana.", unit: "unit", unitName: "lata (80g)", unitGrams: 80, defaultUnits: 1 },
  { name: "Salmón", emoji: "🐠", per100g: 20, cal100g: 208, fat: 13, carbs: 0, tag: "omega", desc: "Rico en omega-3. Excelente para recuperación.", unit: "g", defaultGrams: 120 },
  { name: "Yogurt griego (0%)", emoji: "🥛", per100g: 10, cal100g: 59, fat: 0.4, carbs: 3.6, tag: "dairy", desc: "~10g proteína por pote. Ideal para merienda.", unit: "unit", unitName: "pote (200g)", unitGrams: 200, defaultUnits: 1 },
  { name: "Yogurt griego (entero)", emoji: "🫙", per100g: 9, cal100g: 97, fat: 5, carbs: 3.6, tag: "dairy", desc: "Más grasa y saciante. Desayuno ideal.", unit: "unit", unitName: "pote (200g)", unitGrams: 200, defaultUnits: 1 },
  { name: "Queso cottage", emoji: "🧀", per100g: 11, cal100g: 98, fat: 4.3, carbs: 3.4, tag: "dairy", desc: "Digestión lenta. Perfecto antes de dormir.", unit: "g", defaultGrams: 150 },
  { name: "Pavo (pechuga)", emoji: "🦃", per100g: 29, cal100g: 135, fat: 1, carbs: 0, tag: "lean", desc: "Más magro que el pollo. Muy versátil.", unit: "g", defaultGrams: 100 },
  { name: "Proteína Whey", emoji: "💊", per100g: 75, cal100g: 380, fat: 4, carbs: 8, tag: "supp", desc: "Absorción rápida post-entreno.", unit: "unit", unitName: "scoop (30g)", unitGrams: 30, defaultUnits: 1 },
  { name: "Lentejas cocidas", emoji: "🫘", per100g: 9, cal100g: 116, fat: 0.4, carbs: 20, tag: "plant", desc: "Proteína vegetal + fibra. 2-3 veces/semana.", unit: "g", defaultGrams: 150 },
];

// Helper: devuelve los gramos totales de una entrada del plan
function getFoodGrams(food, planEntry) {
  // planEntry = { grams? } o { units? }
  if (food.unit === "unit") return (planEntry.units || food.defaultUnits) * food.unitGrams;
  return planEntry.grams || food.defaultGrams;
}

// Helper: proteína de una entrada del plan
function getFoodProtein(food, planEntry) {
  return (food.per100g * getFoodGrams(food, planEntry)) / 100;
}

// Genera un plan sugerido que alcance la meta de proteína
function generateSuggestedPlan(daily, excluded = []) {
  const available = PROTEIN_FOODS.filter(f => !excluded.includes(f.name));
  // Plantilla balanceada: desayuno, almuerzo, merienda, cena
  const templates = [
    // desayuno
    ["Huevo entero", "Yogurt griego (0%)"],
    // almuerzo
    ["Pechuga de pollo"],
    // merienda
    ["Proteína Whey"],
    // cena
    ["Atún al agua", "Clara de huevo"],
  ];

  const plan = {};
  let total = 0;

  // Primera pasada: agregar porciones base según plantilla
  for (const group of templates) {
    for (const name of group) {
      const food = available.find(f => f.name === name);
      if (!food) continue;
      const entry = food.unit === "unit"
        ? { units: food.defaultUnits }
        : { grams: food.defaultGrams };
      plan[name] = entry;
      total += getFoodProtein(food, entry);
    }
  }

  // Segunda pasada: si falta proteína, aumentar porciones de pollo/pavo
  const boosters = ["Pechuga de pollo", "Pavo (pechuga)", "Carne vacuna magra"];
  let iterations = 0;
  while (total < daily * 0.9 && iterations < 20) {
    for (const name of boosters) {
      const food = available.find(f => f.name === name);
      if (!food) continue;
      if (!plan[name]) plan[name] = { grams: food.defaultGrams };
      plan[name].grams = Math.min(400, (plan[name].grams || food.defaultGrams) + 50);
      total = Object.entries(plan).reduce((acc, [n, entry]) => {
        const f = PROTEIN_FOODS.find(f => f.name === n);
        return f ? acc + getFoodProtein(f, entry) : acc;
      }, 0);
      if (total >= daily * 0.9) break;
    }
    iterations++;
  }

  return plan;
}



const TAG_LABELS = { lean: "Magro", complete: "Completo", omega: "Omega-3", dairy: "Lácteo", supp: "Suplemento", plant: "Vegetal" };
const TAG_COLORS = { lean: "#10b981", complete: "#f59e0b", omega: "#06b6d4", dairy: "#8b5cf6", supp: "#e84a2e", plant: "#84cc16" };

const PLANES = [
  { id: "trial", nombre: "Prueba Gratis", precio: 0, precioLabel: "GRATIS", periodo: "7 días", color: "#10b981", trial: true, features: ["✓ Rutinas diarias con IA", "✓ Calculadora de proteína", "✓ Tabla nutricional", "✓ Videos de ejercicios", "✗ Análisis médico con IA"] },
  { id: "mensual", nombre: "Plan Mensual", precio: 75000, precioLabel: "₲ 75.000", periodo: "/ mes", color: "#e84a2e", popular: false, features: ["Todo del trial +", "Análisis de informes médicos IA", "Historial extendido", "Plan nutricional personalizado"] },
  { id: "trimestral", nombre: "Plan Trimestral", precio: 195000, precioLabel: "₲ 195.000", periodo: "/ 3 meses", color: "#f59e0b", popular: true, ahorro: "Ahorrás ₲ 30.000", features: ["Todo del plan mensual +", "Análisis de progreso avanzado", "Soporte prioritario"] },
  { id: "anual", nombre: "Plan Anual", precio: 650000, precioLabel: "₲ 650.000", periodo: "/ año", color: "#8b5cf6", popular: false, ahorro: "Ahorrás ₲ 250.000", features: ["Todo lo anterior +", "Coach virtual 24/7", "Alertas de salud basadas en análisis"] },
];

// ─── SHA1 ─────────────────────────────────────────────────────────────────────
async function sha1(str) {
  const buf = await crypto.subtle.digest("SHA-1", new TextEncoder().encode(str));
  return Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2, "0")).join("");
}

function calcProtein(user) {
  const goal = GOALS.find(g => g.id === user.goal);
  const w = parseFloat(user.weight) || 70;
  const baseMult = goal?.proteinMultiplier || 1.8;
  // Mujeres: ligeramente menor multiplicador (masa muscular base menor)
  const sexFactor = user.sex === "female" ? 0.9 : 1.0;
  const mult = parseFloat((baseMult * sexFactor).toFixed(1));
  const daily = Math.round(w * mult);
  return { daily, perMeal: Math.round(daily / 4), mult };
}

// ─── UI ATOMS ─────────────────────────────────────────────────────────────────
const card = { background: "rgba(255,255,255,0.04)", borderRadius: 16, border: "1px solid rgba(255,255,255,0.08)" };

function Pill({ children, color = "#e84a2e" }) {
  return <span style={{ background: color + "22", color, border: `1px solid ${color}44`, borderRadius: 999, padding: "2px 10px", fontSize: 11, fontWeight: 700 }}>{children}</span>;
}

function Btn({ children, onClick, variant = "primary", style = {}, disabled, loading }) {
  const base = { border: "none", borderRadius: 13, padding: "13px 22px", fontWeight: 700, fontSize: 14, cursor: disabled || loading ? "not-allowed" : "pointer", transition: "all 0.2s", display: "flex", alignItems: "center", justifyContent: "center", gap: 8, opacity: disabled ? 0.5 : 1, fontFamily: "'DM Sans',sans-serif" };
  const v = {
    primary: { background: "linear-gradient(135deg,#e84a2e,#c53d25)", color: "#fff", boxShadow: "0 4px 24px rgba(232,74,46,0.35)" },
    ghost: { background: "rgba(255,255,255,0.06)", color: "#aaa", border: "1px solid rgba(255,255,255,0.1)" },
    success: { background: "linear-gradient(135deg,#10b981,#059669)", color: "#fff", boxShadow: "0 4px 20px rgba(16,185,129,0.3)" },
    amber: { background: "linear-gradient(135deg,#f59e0b,#d97706)", color: "#fff" },
    purple: { background: "linear-gradient(135deg,#8b5cf6,#7c3aed)", color: "#fff", boxShadow: "0 4px 20px rgba(139,92,246,0.3)" },
    trial: { background: "linear-gradient(135deg,#10b981,#059669)", color: "#fff", boxShadow: "0 4px 20px rgba(16,185,129,0.4)" },
  };
  return (
    <button onClick={onClick} disabled={disabled || loading} style={{ ...base, ...v[variant], ...style }}>
      {loading ? <span style={{ width: 16, height: 16, border: "2px solid rgba(255,255,255,0.3)", borderTopColor: "#fff", borderRadius: "50%", display: "inline-block", animation: "spin 0.7s linear infinite" }} /> : children}
    </button>
  );
}

function Avatar({ photo, name, size = 60 }) {
  const initials = name ? name.split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase() : "MG";
  return (
    <div style={{ width: size, height: size, borderRadius: "50%", flexShrink: 0, background: photo ? "transparent" : "linear-gradient(135deg,#e84a2e,#f59e0b)", border: "2.5px solid #e84a2e44", overflow: "hidden", display: "flex", alignItems: "center", justifyContent: "center", fontSize: size * 0.35, fontWeight: 800, color: "#fff" }}>
      {photo ? <img src={photo} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} /> : initials}
    </div>
  );
}

function Input({ label, type = "text", value, onChange, placeholder, prefix }) {
  return (
    <div>
      {label && <label style={{ color: "rgba(255,255,255,0.5)", fontSize: 11, fontWeight: 700, letterSpacing: 0.8, display: "block", marginBottom: 6 }}>{label.toUpperCase()}</label>}
      <div style={{ position: "relative" }}>
        {prefix && <span style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", color: "rgba(255,255,255,0.3)", fontSize: 15 }}>{prefix}</span>}
        <input type={type} value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder}
          style={{ width: "100%", boxSizing: "border-box", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 12, padding: `12px 14px 12px ${prefix ? "36px" : "14px"}`, color: "#fff", fontSize: 15, outline: "none", fontFamily: "'DM Sans',sans-serif" }}
          onFocus={e => e.target.style.borderColor = "#e84a2e66"}
          onBlur={e => e.target.style.borderColor = "rgba(255,255,255,0.1)"} />
      </div>
    </div>
  );
}

// ─── YOUTUBE VIDEO EMBED ──────────────────────────────────────────────────────
function ExerciseVideo({ machine, onClose }) {
  const [tab, setTab] = useState("video");
  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.92)", zIndex: 100, display: "flex", flexDirection: "column", backdropFilter: "blur(8px)" }}>
      {/* Header */}
      <div style={{ padding: "16px 20px", display: "flex", alignItems: "center", gap: 12, borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
        <button onClick={onClose} style={{ background: "rgba(255,255,255,0.08)", border: "none", color: "#fff", width: 36, height: 36, borderRadius: "50%", cursor: "pointer", fontSize: 18, display: "flex", alignItems: "center", justifyContent: "center" }}>✕</button>
        <div>
          <div style={{ fontWeight: 800, fontSize: 16, color: "#fff" }}>{machine.name}</div>
          <div style={{ color: "#e8a090", fontSize: 12 }}>{machine.muscle} · {machine.category === "Upper" ? "Tren Superior" : machine.category === "Lower" ? "Tren Inferior" : machine.category === "Arms" ? "Brazos" : "Core"}</div>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display: "flex", gap: 0, borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
        {[["video", "▶ Video"], ["info", "📋 Cómo hacerlo"], ["muscles", "💪 Músculos"]].map(([id, label]) => (
          <button key={id} onClick={() => setTab(id)} style={{ flex: 1, padding: "12px 0", border: "none", background: "none", color: tab === id ? "#e8a090" : "rgba(255,255,255,0.35)", fontWeight: tab === id ? 700 : 500, fontSize: 13, cursor: "pointer", borderBottom: `2px solid ${tab === id ? "#e84a2e" : "transparent"}`, fontFamily: "'DM Sans',sans-serif" }}>{label}</button>
        ))}
      </div>

      <div style={{ flex: 1, overflowY: "auto", padding: 20 }}>
        {tab === "video" && (
          <div>
            {/* YouTube embed */}
            <div style={{ position: "relative", paddingBottom: "56.25%", borderRadius: 14, overflow: "hidden", background: "#000", marginBottom: 16 }}>
              <iframe
                src={`https://www.youtube.com/embed/${machine.videoId}?autoplay=0&rel=0&modestbranding=1&cc_load_policy=1&cc_lang_pref=es&hl=es`}
                title={machine.name}
                style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%" }}
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
            <div style={{ ...card, padding: 14, background: "rgba(232,74,46,0.06)", borderColor: "rgba(232,74,46,0.2)" }}>
              <div style={{ color: "#e8a090", fontSize: 11, fontWeight: 800, marginBottom: 8 }}>🎯 PUNTOS CLAVE</div>
              {machine.tips.map((tip, i) => (
                <div key={i} style={{ display: "flex", gap: 10, marginBottom: 6 }}>
                  <span style={{ color: "#e84a2e", fontWeight: 800, fontSize: 14 }}>{i + 1}</span>
                  <span style={{ color: "rgba(255,255,255,0.7)", fontSize: 13 }}>{tip}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {tab === "info" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            <div style={{ ...card, padding: 16 }}>
              <div style={{ color: "#e8a090", fontSize: 11, fontWeight: 800, marginBottom: 12 }}>📌 TÉCNICA CORRECTA</div>
              {[
                { step: "Preparación", desc: "Ajustá el asiento y los pesos según tu nivel. La posición correcta es fundamental para evitar lesiones." },
                { step: "Posición inicial", desc: "Espalda recta, core contraído, pies apoyados en el suelo. Agarre firme pero sin tensión excesiva." },
                { step: "Fase concéntrica", desc: "Ejecutá el movimiento de forma controlada, sin impulso. Concentráte en el músculo objetivo." },
                { step: "Fase excéntrica", desc: "Volvé a la posición inicial de forma lenta (2-3 segundos). Esta fase es igual de importante." },
                { step: "Respiración", desc: "Exhala durante el esfuerzo (fase concéntrica). Inhala al volver a la posición inicial." },
              ].map((s, i) => (
                <div key={i} style={{ display: "flex", gap: 12, marginBottom: 14, paddingBottom: 14, borderBottom: i < 4 ? "1px solid rgba(255,255,255,0.05)" : "none" }}>
                  <div style={{ width: 28, height: 28, borderRadius: 8, background: "#e84a2e18", border: "1px solid #e84a2e44", display: "flex", alignItems: "center", justifyContent: "center", color: "#e8a090", fontWeight: 800, fontSize: 13, flexShrink: 0 }}>{i + 1}</div>
                  <div>
                    <div style={{ color: "#fff", fontWeight: 700, fontSize: 13, marginBottom: 3 }}>{s.step}</div>
                    <div style={{ color: "rgba(255,255,255,0.5)", fontSize: 12, lineHeight: 1.5 }}>{s.desc}</div>
                  </div>
                </div>
              ))}
            </div>
            <div style={{ ...card, padding: 14, background: "rgba(245,158,11,0.06)", borderColor: "rgba(245,158,11,0.2)" }}>
              <div style={{ color: "#f5d060", fontSize: 11, fontWeight: 800, marginBottom: 8 }}>⚠️ ERRORES COMUNES</div>
              {["Usar demasiado peso y sacrificar la técnica", "Hacer el movimiento muy rápido sin control", "No completar el rango completo de movimiento", "Contener la respiración durante el ejercicio"].map((e, i) => (
                <div key={i} style={{ display: "flex", gap: 8, marginBottom: 5 }}>
                  <span style={{ color: "#f59e0b" }}>✗</span>
                  <span style={{ color: "rgba(255,255,255,0.6)", fontSize: 13 }}>{e}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {tab === "muscles" && (
          <div>
            <div style={{ ...card, padding: 16, marginBottom: 14 }}>
              <div style={{ color: "#e8a090", fontSize: 11, fontWeight: 800, marginBottom: 12 }}>💪 MÚSCULOS TRABAJADOS</div>
              {machine.muscles_worked.map((m, i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 10, paddingBottom: 10, borderBottom: i < machine.muscles_worked.length - 1 ? "1px solid rgba(255,255,255,0.05)" : "none" }}>
                  <div style={{ width: 10, height: 10, borderRadius: "50%", background: i === 0 ? "#e84a2e" : "rgba(255,255,255,0.25)", flexShrink: 0 }} />
                  <div>
                    <div style={{ color: "#fff", fontWeight: i === 0 ? 700 : 500, fontSize: 14 }}>{m}</div>
                    <div style={{ color: "rgba(255,255,255,0.35)", fontSize: 11 }}>{i === 0 ? "Músculo principal" : "Músculo secundario"}</div>
                  </div>
                </div>
              ))}
            </div>
            <div style={{ ...card, padding: 14, background: "rgba(16,185,129,0.06)", borderColor: "rgba(16,185,129,0.2)" }}>
              <div style={{ color: "#10b981", fontSize: 11, fontWeight: 800, marginBottom: 8 }}>✅ BENEFICIOS CLAVE</div>
              {["Fortalece la cadena muscular de forma segura", "Aislamiento efectivo del músculo objetivo", "Ideal para principiantes e intermedios", "Menor riesgo de lesión que peso libre"].map((b, i) => (
                <div key={i} style={{ display: "flex", gap: 8, marginBottom: 5 }}>
                  <span style={{ color: "#10b981" }}>✓</span>
                  <span style={{ color: "rgba(255,255,255,0.6)", fontSize: 13 }}>{b}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── TUTORIAL ONBOARDING SLIDE ────────────────────────────────────────────────
function TutorialScreen({ onFinish }) {
  const [slide, setSlide] = useState(0);
  const slides = [
    {
      emoji: "🏆",
      title: "Bienvenido a FROQIA 🐸",
      desc: "Tu entrenador personal con inteligencia artificial. Rutinas diarias adaptadas a vos, tu cuerpo y el equipamiento disponible en tu gym.",
      color: "#e84a2e",
      points: ["IA que aprende de tu historial", "Rutinas 100% personalizadas", "Tips nutricionales diarios"],
    },
    {
      emoji: "🏋️",
      title: "Compatible con cualquier gym",
      desc: "Seleccioná el equipamiento disponible — máquinas, peso libre, poleas, bandas, cardio — y FROQIA generará rutinas con lo que tenés.",
      color: "#f59e0b",
      points: ["60+ equipos de todas las marcas", "Videos explicativos de cada ejercicio", "Calentamiento y finalizadores incluidos"],
    },
    {
      emoji: "🥗",
      title: "Nutrición personalizada",
      desc: "Calculamos exactamente cuánta proteína necesitás según tu peso y objetivo. Tabla interactiva con 12 alimentos clave.",
      color: "#10b981",
      points: ["Meta diaria de proteína calculada", "Distribución por comidas", "Tabla interactiva de alimentos"],
    },
    {
      emoji: "🧪",
      title: "Análisis médico con IA",
      desc: "Subí tus hemogramas e informes médicos. La IA los analiza y ajusta recomendaciones de entrenamiento y nutrición.",
      color: "#8b5cf6",
      points: ["PDF, JPG y PNG aceptados", "Análisis de valores clínicos", "Recomendaciones personalizadas"],
    },
    {
      emoji: "🎁",
      title: "7 días gratis, sin tarjeta",
      desc: "Probá FROQIA sin compromisos. Si te gusta, suscribite. Si no, no se cobra nada.",
      color: "#10b981",
      points: ["Sin tarjeta de crédito requerida", "Acceso completo 7 días", "Cancelás cuando querás"],
    },
  ];
  const s = slides[slide];

  return (
    <div style={{ minHeight: "100vh", background: "#080809", fontFamily: "'DM Sans',sans-serif", color: "#fff", display: "flex", flexDirection: "column", maxWidth: 520, margin: "0 auto" }}>
      {/* Top bar: idioma + saltar */}
      <div style={{ padding: "16px 20px 0", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        
        <button onClick={onFinish} style={{ background: "none", border: "none", color: "rgba(255,255,255,0.35)", cursor: "pointer", fontSize: 14, fontFamily: "'DM Sans',sans-serif" }}>Saltar →</button>
      </div>

      {/* Content */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "20px 28px", textAlign: "center" }}>
        {/* Logo FROQIA */}
        <div style={{ marginBottom: 8 }}>
          <span style={{ fontSize: 13, fontWeight: 800, color: s.color, letterSpacing: 2 }}>FROQIA</span>
        </div>

        {/* Emoji icon */}
        <div style={{ width: 100, height: 100, borderRadius: 28, background: s.color + "18", border: `2px solid ${s.color}33`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 48, marginBottom: 28 }}>
          {s.emoji}
        </div>

        <h1 style={{ fontSize: 26, fontWeight: 900, margin: "0 0 14px", lineHeight: 1.2 }}>{s.title}</h1>
        <p style={{ color: "rgba(255,255,255,0.55)", fontSize: 15, lineHeight: 1.7, margin: "0 0 28px", maxWidth: 320 }}>{s.desc}</p>

        {/* Points */}
        <div style={{ width: "100%", maxWidth: 340, display: "flex", flexDirection: "column", gap: 10, marginBottom: 32 }}>
          {s.points.map((p, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 12, background: s.color + "0d", border: `1px solid ${s.color}22`, borderRadius: 12, padding: "11px 14px" }}>
              <div style={{ width: 24, height: 24, borderRadius: 8, background: s.color + "25", border: `1px solid ${s.color}44`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <span style={{ color: s.color, fontSize: 12, fontWeight: 800 }}>✓</span>
              </div>
              <span style={{ color: "rgba(255,255,255,0.75)", fontSize: 14, textAlign: "left" }}>{p}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Navigation */}
      <div style={{ padding: "0 28px 40px" }}>
        {/* Dots */}
        <div style={{ display: "flex", justifyContent: "center", gap: 8, marginBottom: 20 }}>
          {slides.map((_, i) => (
            <div key={i} onClick={() => setSlide(i)} style={{ width: i === slide ? 24 : 8, height: 8, borderRadius: 99, background: i === slide ? "#e84a2e" : "rgba(255,255,255,0.15)", cursor: "pointer", transition: "all 0.3s" }} />
          ))}
        </div>

        {slide < slides.length - 1 ? (
          <div style={{ display: "flex", gap: 10 }}>
            {slide > 0 && <Btn variant="ghost" onClick={() => setSlide(s => s - 1)} style={{ flex: 0.4 }}>←</Btn>}
            <Btn onClick={() => setSlide(s => s + 1)} style={{ flex: 1 }}>Siguiente →</Btn>
          </div>
        ) : (
          <Btn onClick={onFinish} variant="trial" style={{ width: "100%", padding: 16, fontSize: 16 }}>
            🎁 Empezar prueba gratuita
          </Btn>
        )}
      </div>
    </div>
  );
}

// ─── LANDING ──────────────────────────────────────────────────────────────────
function LandingScreen({ onSelectPlan, onTutorial }) {
  
  return (
    <div style={{ minHeight: "100vh", background: "#080809", fontFamily: "'DM Sans',sans-serif", color: "#fff", paddingBottom: 60 }}>
      {/* Top bar con selector de idioma */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "14px 18px", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
        <div style={{ fontSize: 11, fontWeight: 800, color: "#e84a2e", letterSpacing: 3 }}>FROQIA</div>
        
      </div>

      {/* Hero */}
      <div style={{ textAlign: "center", padding: "40px 24px 36px", background: "radial-gradient(ellipse 80% 60% at 50% 0%, rgba(232,74,46,0.15) 0%, transparent 70%)" }}>
        <div style={{ fontSize: 48, marginBottom: 10 }}>🏆</div>
        <h1 style={{ fontSize: "clamp(26px,6vw,38px)", fontWeight: 900, background: "linear-gradient(135deg,#fff 30%,#e8a090)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", margin: "0 0 10px", lineHeight: 1.1 }}>Tu entrenador<br/>personal con IA</h1>
        <p style={{ color: "rgba(255,255,255,0.5)", fontSize: 15, maxWidth: 300, margin: "0 auto 20px", lineHeight: 1.7 }}>Rutinas con IA para cualquier gym, nutrición personalizada y análisis médico — todo adaptado a vos.</p>
        <button onClick={onTutorial} style={{ background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.15)", color: "rgba(255,255,255,0.7)", borderRadius: 99, padding: "7px 16px", fontSize: 13, cursor: "pointer", fontFamily: "'DM Sans',sans-serif", marginBottom: 20 }}>▶ Ver cómo funciona</button>
      </div>

      <div style={{ padding: "0 16px", maxWidth: 520, margin: "0 auto" }}>
        {/* Trial */}
        <div style={{ ...card, padding: 20, marginBottom: 18, background: "linear-gradient(135deg,rgba(16,185,129,0.14),rgba(16,185,129,0.04))", borderColor: "rgba(16,185,129,0.35)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 14 }}>
            <div style={{ fontSize: 38 }}>🎁</div>
            <div>
              <div style={{ color: "#10b981", fontWeight: 800, fontSize: 17 }}>7 días GRATIS</div>
              <div style={{ color: "rgba(255,255,255,0.55)", fontSize: 13 }}>Sin tarjeta de crédito. Sin compromisos.</div>
            </div>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 6, marginBottom: 14 }}>
            {PLANES[0].features.map(f => <div key={f} style={{ display: "flex", gap: 8 }}><span style={{ color: f.startsWith("✓") ? "#10b981" : "rgba(255,255,255,0.2)" }}>{f.startsWith("✓") ? "✓" : "✗"}</span><span style={{ color: f.startsWith("✓") ? "rgba(255,255,255,0.7)" : "rgba(255,255,255,0.25)", fontSize: 13 }}>{f.slice(2)}</span></div>)}
          </div>
          <Btn variant="trial" onClick={() => onSelectPlan(PLANES[0])} style={{ width: "100%", fontSize: 15, padding: 14 }}>🚀 Empezar prueba gratuita</Btn>
        </div>

        {/* Planes */}
        <div style={{ color: "rgba(255,255,255,0.4)", fontSize: 12, fontWeight: 700, textAlign: "center", marginBottom: 14, letterSpacing: 1 }}>— O ELEGÍ UN PLAN PREMIUM —</div>
        <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 20 }}>
          {PLANES.filter(p => !p.trial).map(plan => (
            <div key={plan.id} style={{ ...card, padding: "16px 18px", position: "relative", borderColor: plan.popular ? plan.color + "55" : "rgba(255,255,255,0.08)", background: plan.popular ? plan.color + "0a" : "rgba(255,255,255,0.02)" }}>
              {plan.popular && <div style={{ position: "absolute", top: -11, right: 16, background: `linear-gradient(135deg,${plan.color},${plan.color}bb)`, color: "#fff", fontSize: 10, fontWeight: 800, padding: "3px 12px", borderRadius: 99 }}>⭐ MÁS POPULAR</div>}
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                <div>
                  <div style={{ fontWeight: 800, fontSize: 15 }}>{plan.nombre}</div>
                  {plan.ahorro && <Pill color={plan.color}>{plan.ahorro}</Pill>}
                </div>
                <div style={{ textAlign: "right" }}>
                  <div style={{ fontSize: 18, fontWeight: 900, color: plan.color }}>{plan.precioLabel}</div>
                  <div style={{ color: "rgba(255,255,255,0.3)", fontSize: 12 }}>{plan.periodo}</div>
                </div>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 4, marginBottom: 12 }}>
                {plan.features.map(f => <div key={f} style={{ display: "flex", gap: 8 }}><span style={{ color: plan.color }}>✓</span><span style={{ color: "rgba(255,255,255,0.55)", fontSize: 13 }}>{f}</span></div>)}
              </div>
              <Btn onClick={() => onSelectPlan(plan)} variant={plan.popular ? "primary" : "ghost"} style={{ width: "100%", ...(plan.popular ? {} : { borderColor: plan.color + "44", color: plan.color }) }}>Elegir este plan →</Btn>
            </div>
          ))}
        </div>

        {/* PagoPar */}
        <div style={{ ...card, padding: 16, textAlign: "center" }}>
          <p style={{ color: "rgba(255,255,255,0.35)", fontSize: 11, fontWeight: 700, margin: "0 0 10px", letterSpacing: 0.8 }}>MEDIOS DE PAGO — PAGOPAR</p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 6, justifyContent: "center" }}>
            {["Visa", "Mastercard", "Tigo Money", "Personal Pay", "Aquí Pago", "WEPA", "Zimple"].map(m => <span key={m} style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 7, padding: "4px 9px", fontSize: 11, color: "rgba(255,255,255,0.5)", fontWeight: 600 }}>{m}</span>)}
          </div>
          <p style={{ color: "rgba(255,255,255,0.2)", fontSize: 11, margin: "10px 0 0" }}>🔒 Pagos seguros por PagoPar</p>
        </div>
      </div>
    </div>
  );
}

// ─── REGISTER ─────────────────────────────────────────────────────────────────
// Inline T&C link for register screen
function TermsInRegister() {
  const [show, setShow] = useState(false);
  return (
    <>
      {show && <TermsModal onClose={() => setShow(false)} />}
      <p style={{ color: "rgba(255,255,255,0.2)", fontSize: 11, textAlign: "center", marginTop: 12 }}>
        Al continuar aceptás los{" "}
        <button onClick={() => setShow(true)} style={{ background: "none", border: "none", color: "rgba(255,255,255,0.45)", cursor: "pointer", fontSize: 11, textDecoration: "underline", fontFamily: "'DM Sans',sans-serif", padding: 0 }}>
          Términos y Condiciones
        </button>{" "}
        y la Política de Privacidad
      </p>
    </>
  );
}

function RegisterScreen({ plan, onBack, onContinue }) {
  const [method, setMethod] = useState("email");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [nombre, setNombre] = useState("");
  const [cedula, setCedula] = useState("");
  const [password, setPassword] = useState("");
  const [showLogin, setShowLogin] = useState(false);
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!loginEmail || !loginPassword) return setError("Completá email y contraseña");
    setLoading(true);
    setError("");
    try {
      const res = await supabaseCall("login", { email: loginEmail, password: loginPassword });
      if (res.error) { 
        setError(res.error); 
        setLoading(false);
        return; 
      }
      if (res.user && res.perfil) {
        setLoading(false);
        onContinue({ 
          ...res.perfil, 
          email: loginEmail, 
          _supabaseUser: res.user,
          _session: res.session,
          _loginExistente: true 
        });
      } else if (res.user) {
  setLoading(false);
  // Buscar perfil en localStorage como fallback
  const savedRaw = localStorage.getItem("froqia_session");
  if (savedRaw) {
    try {
      const saved = JSON.parse(savedRaw);
      if (saved.perfil && saved.user?.email === loginEmail) {
        onContinue({ 
          ...saved.perfil, 
          email: loginEmail, 
          _supabaseUser: res.user,
          _session: res.session,
          _loginExistente: true 
        });
        return;
      }
    } catch {}
  }
  // Sin perfil local — necesita onboarding
  onContinue({ nombre: res.user.user_metadata?.nombre || "", email: loginEmail, _supabaseUser: res.user, _session: res.session });
}
    } catch(e) {
      setError("Error de conexión");
    }
    setLoading(false);
  };

  const handleSubmit = async () => {
    if (!nombre.trim()) return setError("Ingresá tu nombre completo");
    if (!cedula.trim()) return setError("Ingresá tu número de cédula");
    if (method === "email" && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return setError("Email inválido");
    if (method === "phone" && phone.replace(/\D/g, "").length < 9) return setError("Teléfono inválido");
    if (!password || password.length < 6) return setError("La contraseña debe tener al menos 6 caracteres");
    setLoading(true);
    setError("");
    try {
      const emailFinal = method === "email" ? email : `${phone.replace(/\D/g, "")}@froqia.com`;
      const res = await supabaseCall("register", { email: emailFinal, password, nombre });
      if (res.error) { setError(res.error); setLoading(false); return; }
      onContinue({ 
        nombre, cedula, 
        email: emailFinal, 
        phone: method === "phone" ? phone : "", 
        method,
        _supabaseUser: res.user,
        _session: res.session
      });
    } catch(e) {
      setError("Error de conexión");
    }
    setLoading(false);
  };

  return (
    <div style={{ minHeight: "100vh", background: "#080809", fontFamily: "'DM Sans',sans-serif", color: "#fff", padding: "24px 20px", maxWidth: 480, margin: "0 auto" }}>
      <button onClick={onBack} style={{ background: "none", border: "none", color: "rgba(255,255,255,0.4)", cursor: "pointer", fontSize: 14, padding: "0 0 20px", display: "flex", alignItems: "center", gap: 6 }}>← Volver</button>
      <div style={{ fontSize: 11, fontWeight: 800, color: "#e84a2e", letterSpacing: 2, marginBottom: 20 }}>FROQIA</div>
      <div style={{ ...card, padding: "12px 16px", marginBottom: 20, background: plan.color + "0d", borderColor: plan.color + "33", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <div style={{ color: plan.color, fontWeight: 700 }}>{plan.nombre}</div>
          {plan.trial && <div style={{ color: "#10b981", fontSize: 12 }}>Sin tarjeta requerida</div>}
        </div>
        <div style={{ fontWeight: 900, fontSize: 18, color: "#fff" }}>{plan.precioLabel}</div>
      </div>

      {showLogin ? (
        <>
          <h2 style={{ fontSize: 21, fontWeight: 800, margin: "0 0 4px" }}>Iniciar sesión</h2>
          <p style={{ color: "rgba(255,255,255,0.4)", fontSize: 14, margin: "0 0 20px" }}>Ya tenés cuenta en FROQIA</p>
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            <Input label="Email" type="email" value={loginEmail} onChange={setLoginEmail} placeholder="tu@correo.com" />
            <Input label="Contraseña" type="password" value={loginPassword} onChange={setLoginPassword} placeholder="Tu contraseña" />
          </div>
          {error && <div style={{ marginTop: 12, padding: "10px 13px", background: "rgba(232,74,46,0.1)", border: "1px solid rgba(232,74,46,0.3)", borderRadius: 10, color: "#e8a090", fontSize: 13 }}>⚠️ {error}</div>}
          <Btn onClick={handleLogin} disabled={loading} variant="primary" style={{ width: "100%", marginTop: 20, padding: 15, fontSize: 15 }}>
            {loading ? "Entrando..." : "🚀 Entrar →"}
          </Btn>
          <button onClick={() => { setShowLogin(false); setError(""); }} style={{ width: "100%", marginTop: 12, background: "none", border: "none", color: "rgba(255,255,255,0.4)", cursor: "pointer", fontSize: 13 }}>
            ← Crear cuenta nueva
          </button>
        </>
      ) : (
        <>
          <h2 style={{ fontSize: 21, fontWeight: 800, margin: "0 0 4px" }}>Crear tu cuenta</h2>
          <p style={{ color: "rgba(255,255,255,0.4)", fontSize: 14, margin: "0 0 20px" }}>{plan.trial ? "7 días completos gratis. Cancelás cuando querás." : "Ingresá tus datos para suscribirte."}</p>
          <div style={{ display: "flex", gap: 6, marginBottom: 16, background: "rgba(255,255,255,0.04)", borderRadius: 11, padding: 4 }}>
            {[["email", "📧 Email"], ["phone", "📱 Teléfono"]].map(([v, l]) => (
              <button key={v} onClick={() => setMethod(v)} style={{ flex: 1, padding: "9px 0", border: "none", borderRadius: 8, cursor: "pointer", background: method === v ? "#e84a2e" : "transparent", color: method === v ? "#fff" : "rgba(255,255,255,0.4)", fontWeight: 700, fontSize: 13, fontFamily: "'DM Sans',sans-serif" }}>{l}</button>
            ))}
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            <Input label="Nombre completo" value={nombre} onChange={setNombre} placeholder="Ej: Carlos González" />
            <Input label="Número de cédula" value={cedula} onChange={setCedula} placeholder="Ej: 5234567" />
            {method === "email" ? <Input label="Correo electrónico" type="email" value={email} onChange={setEmail} placeholder="tu@correo.com" prefix="✉" /> : <Input label="Teléfono" type="tel" value={phone} onChange={setPhone} placeholder="+595 971 123 456" prefix="📱" />}
            <Input label="Contraseña" type="password" value={password} onChange={setPassword} placeholder="Mínimo 6 caracteres" />
          </div>
          {error && <div style={{ marginTop: 12, padding: "10px 13px", background: "rgba(232,74,46,0.1)", border: "1px solid rgba(232,74,46,0.3)", borderRadius: 10, color: "#e8a090", fontSize: 13 }}>⚠️ {error}</div>}
          <Btn onClick={handleSubmit} disabled={loading} variant={plan.trial ? "trial" : "primary"} style={{ width: "100%", marginTop: 20, padding: 15, fontSize: 15 }}>
            {loading ? "Creando cuenta..." : plan.trial ? "🎁 Crear cuenta gratuita →" : "Continuar al pago →"}
          </Btn>
          <button onClick={() => { setShowLogin(true); setError(""); }} style={{ width: "100%", marginTop: 12, background: "none", border: "none", color: "rgba(255,255,255,0.4)", cursor: "pointer", fontSize: 13 }}>
            ¿Ya tenés cuenta? Iniciar sesión
          </button>
          <TermsInRegister />
        </>
      )}
    </div>
  );
}

// ─── CHECKOUT ─────────────────────────────────────────────────────────────────
function CheckoutScreen({ plan, userData, onBack, onSuccess }) {
  const [step, setStep] = useState("review");
  const [pedidoHash, setPedidoHash] = useState(null);
  const [numeroPedido, setNumeroPedido] = useState(null);
  const [errorDetail, setErrorDetail] = useState("");

  useEffect(() => {
    if (plan.trial) onSuccess({ plan, userData, pedidoHash: "TRIAL-" + Date.now(), trialExpiry: Date.now() + 7 * 24 * 60 * 60 * 1000 });
  }, []);

  if (plan.trial) return (
    <div style={{ minHeight: "100vh", background: "#080809", fontFamily: "'DM Sans',sans-serif", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ textAlign: "center" }}>
        <div style={{ width: 48, height: 48, border: "3px solid rgba(16,185,129,0.2)", borderTopColor: "#10b981", borderRadius: "50%", animation: "spin 0.8s linear infinite", margin: "0 auto 20px" }} />
        <p style={{ color: "rgba(255,255,255,0.5)" }}>Activando tu prueba gratuita...</p>
      </div>
    </div>
  );

  async function iniciarPago() {
    setStep("processing");
    try {
      const idPedido = `MG-${Date.now()}-${Math.random().toString(36).slice(2, 7).toUpperCase()}`;
      const token = await sha1(PAGOPAR_CONFIG.PRIVATE_KEY + idPedido + parseFloat(plan.precio).toString());
      const fechaMax = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().replace("T", " ").slice(0, 19);
      const payload = { token, public_key: PAGOPAR_CONFIG.PUBLIC_KEY, monto_total: plan.precio, tipo_pedido: "VENTA-COMERCIO", id_pedido_comercio: idPedido, descripcion_resumen: `FROQIA - ${plan.nombre}`, fecha_maxima_pago: fechaMax, comprador: { nombre: userData.nombre, email: userData.email || `${userData.phone.replace(/\D/g, "")}@froqia.com`, telefono: userData.phone || "", documento: userData.cedula, tipo_documento: "CI", ruc: "", ciudad: 1, direccion: "", direccion_referencia: null, coordenadas: "", razon_social: userData.nombre }, compras_items: [{ nombre: `FROQIA - ${plan.nombre}`, descripcion: `Acceso por ${plan.periodo}`, cantidad: 1, precio_total: plan.precio, id_producto: 2001, categoria: "909", ciudad: 1, public_key: PAGOPAR_CONFIG.PUBLIC_KEY, url_imagen: "", vendedor_telefono: "", vendedor_direccion: "", vendedor_direccion_referencia: "", vendedor_direccion_coordenadas: "" }] };
      const res = await fetch(PAGOPAR_CONFIG.API_URL, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
      const rawText = await res.text();
      console.log("PagoPar raw response:", rawText);
      console.log("HTTP status:", res.status);
      let data;
      try { data = JSON.parse(rawText); } catch { data = { raw: rawText }; }
      console.log("PagoPar parsed:", JSON.stringify(data));
      if (data.respuesta === true && data.resultado?.[0]?.data) { 
        setPedidoHash(data.resultado[0].data); setNumeroPedido(data.resultado[0].data || ""); setStep("redirect"); 
      } else {
        const errMsg = data.resultado?.[0]?.mensaje || data.mensaje || data.raw || JSON.stringify(data);
        setErrorDetail(`HTTP ${res.status} — ${errMsg}`);
        setStep("error");
      }
    } catch(e) {
      setErrorDetail(`Fetch error: ${e.message}`);
      setStep("error");
    }
  }

  return (
    <div style={{ minHeight: "100vh", background: "#080809", fontFamily: "'DM Sans',sans-serif", color: "#fff", padding: "24px 20px", maxWidth: 480, margin: "0 auto" }}>
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
      {step === "review" && (
        <>
          <button onClick={onBack} style={{ background: "none", border: "none", color: "rgba(255,255,255,0.4)", cursor: "pointer", fontSize: 14, padding: "0 0 20px", display: "flex", alignItems: "center", gap: 6 }}>← Volver</button>
          <div style={{ fontSize: 11, fontWeight: 800, color: "#e84a2e", letterSpacing: 2, marginBottom: 16 }}>FROQIA</div>
          <h2 style={{ fontSize: 20, fontWeight: 800, margin: "0 0 20px" }}>Resumen del pedido</h2>
          <div style={{ ...card, padding: 16, marginBottom: 12 }}>
            {[["Nombre", userData.nombre], ["Cédula", userData.cedula], [userData.method === "email" ? "Email" : "Teléfono", userData.email || userData.phone]].map(([k, v]) => (
              <div key={k} style={{ display: "flex", justifyContent: "space-between", borderBottom: "1px solid rgba(255,255,255,0.05)", paddingBottom: 8, marginBottom: 8 }}>
                <span style={{ color: "rgba(255,255,255,0.4)", fontSize: 13 }}>{k}</span>
                <span style={{ color: "#fff", fontSize: 13, fontWeight: 600 }}>{v}</span>
              </div>
            ))}
          </div>
          <div style={{ ...card, padding: "14px 18px", marginBottom: 20, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ fontWeight: 700 }}>FROQIA - {plan.nombre}</span>
            <span style={{ color: plan.color, fontWeight: 900, fontSize: 19 }}>{plan.precioLabel}</span>
          </div>
          <Btn onClick={iniciarPago} style={{ width: "100%", padding: 15 }}>💳 Pagar con PagoPar</Btn>
          {PAGOPAR_CONFIG.PUBLIC_KEY === "TU_PUBLIC_KEY_PAGOPAR" && <div style={{ marginTop: 10, padding: "9px 13px", background: "rgba(245,158,11,0.1)", border: "1px solid rgba(245,158,11,0.25)", borderRadius: 10, color: "#f5d060", fontSize: 12, textAlign: "center" }}>🧪 Modo DEMO — configurá credenciales PagoPar para producción</div>}
        </>
      )}
      {step === "processing" && <div style={{ textAlign: "center", paddingTop: 100 }}><div style={{ width: 48, height: 48, border: "3px solid rgba(255,255,255,0.08)", borderTopColor: "#e84a2e", borderRadius: "50%", animation: "spin 0.8s linear infinite", margin: "0 auto 20px" }} /><p style={{ color: "rgba(255,255,255,0.4)" }}>Conectando con PagoPar...</p></div>}
      {step === "redirect" && (
        <div style={{ textAlign: "center", paddingTop: 60 }}>
          <div style={{ fontSize: 60, marginBottom: 16 }}>💳</div>
          <h3 style={{ fontSize: 20 }}>¡Pedido creado!</h3>
          <p style={{ color: "rgba(255,255,255,0.5)", marginBottom: 24 }}>Completá el pago en el portal seguro de PagoPar.</p>
          <Btn onClick={() => { if (PAGOPAR_CONFIG.PUBLIC_KEY === "TU_PUBLIC_KEY_PAGOPAR") onSuccess({ plan, userData, pedidoHash }); else { const link = document.createElement("a"); link.href = `${PAGOPAR_CONFIG.CHECKOUT_URL}${pedidoHash}`; link.target = "_blank"; link.rel = "noopener noreferrer"; document.body.appendChild(link); link.click(); document.body.removeChild(link); } }} variant="amber" style={{ width: "100%", padding: 15 }}>🚀 Ir al checkout</Btn>
          <Btn onClick={async () => {
            try {
              await fetch("/.netlify/functions/pagopar-estado", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ hash_pedido: numeroPedido })
              });
            } catch(e) { console.log("Estado:", e.message); }
            onSuccess({ plan, userData, pedidoHash });
          }} variant="ghost" style={{ width: "100%", marginTop: 10, fontSize: 13 }}>Ya pagué → Continuar</Btn>
        </div>
      )}
      {step === "error" && <div style={{ textAlign: "center", paddingTop: 80 }}><div style={{ fontSize: 56 }}>❌</div><p style={{ color: "rgba(255,255,255,0.4)" }}>Error al conectar con PagoPar</p>{errorDetail && <div style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 10, padding: "10px 14px", margin: "12px 0", color: "#e8a090", fontSize: 12, textAlign: "left", wordBreak: "break-all" }}>{errorDetail}</div>}<Btn onClick={() => setStep("review")} variant="ghost" style={{ width: "100%" }}>← Reintentar</Btn></div>}
    </div>
  );
}

// ─── ONBOARDING ───────────────────────────────────────────────────────────────
function OnboardingScreen({ userData, onComplete }) {
  const [step, setStep] = useState(0);
  const [data, setData] = useState({ age: "", weight: "", height: "", sex: "", bodyType: "", goal: "", photo: null, machines: ALL_EQUIPMENT.map(m => m.id), daysPerWeek: 4, experience: "beginner" });
  const fileRef = useRef();
  const set = (k, v) => setData(d => ({ ...d, [k]: v }));
  const toggleMachine = id => set("machines", data.machines.includes(id) ? data.machines.filter(m => m !== id) : [...data.machines, id]);
  const handlePhoto = e => { const f = e.target.files[0]; if (f) { const r = new FileReader(); r.onload = ev => set("photo", ev.target.result); r.readAsDataURL(f); } };
  const canNext = () => { if (step === 0) return data.age && data.weight && data.height && data.sex; if (step === 1) return data.bodyType; if (step === 2) return data.goal; return data.machines.length > 0; };
  const catColor = { Upper: "#e84a2e", Lower: "#f59e0b", Arms: "#8b5cf6", Core: "#10b981" };
  const catLabel = { Upper: "TREN SUPERIOR", Lower: "TREN INFERIOR", Arms: "BRAZOS", Core: "CORE" };
  const steps = ["Tu cuerpo", "Tu tipo físico", "Tu objetivo", "Equipamiento"];

  // Physical profile description (replaces IMC label)
  const getPhysicalProfile = () => {
    const w = parseFloat(data.weight), h = parseFloat(data.height);
    if (!w || !h) return null;
    const bmi = w / ((h / 100) ** 2);
    if (bmi < 18.5) return { label: "Complexión ligera", color: "#06b6d4", icon: "⚡", tip: "Tu cuerpo tiene un metabolismo muy activo. Enfocate en ganar músculo con superávit calórico." };
    if (bmi < 25) return { label: "Complexión equilibrada", color: "#10b981", icon: "💪", tip: "Estás en un rango saludable. Podés trabajar cualquier objetivo con buena respuesta." };
    if (bmi < 30) return { label: "Complexión sólida", color: "#f59e0b", icon: "🔥", tip: "Tenés una base muscular interesante. Un plan combinado de pesas y cardio va a darte grandes resultados." };
    return { label: "Complexión robusta", color: "#e84a2e", icon: "🏆", tip: "Tu potencial de transformación es enorme. Con constancia y el plan correcto vas a lograr resultados que sorprenden." };
  };
  const profile = getPhysicalProfile();

  const previewProtein = data.weight && data.goal ? Math.round((parseFloat(data.weight) || 70) * (GOALS.find(g => g.id === data.goal)?.proteinMultiplier || 1.8)) : null;

  return (
    <div style={{ minHeight: "100vh", background: "#080809", fontFamily: "'DM Sans',sans-serif", color: "#fff", padding: "24px 20px 40px", maxWidth: 480, margin: "0 auto" }}>
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
      <div style={{ fontSize: 11, fontWeight: 800, color: "#e84a2e", letterSpacing: 2, marginBottom: 16 }}>FROQIA</div>

      {/* Progress */}
      <div style={{ marginBottom: 22 }}>
        <div style={{ display: "flex", gap: 5, marginBottom: 8 }}>
          {steps.map((_, i) => <div key={i} style={{ flex: 1, height: 3, borderRadius: 99, background: i <= step ? "#e84a2e" : "rgba(255,255,255,0.08)", transition: "background 0.4s" }} />)}
        </div>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <span style={{ color: "rgba(255,255,255,0.7)", fontSize: 16, fontWeight: 800 }}>{steps[step]}</span>
          <span style={{ color: "rgba(255,255,255,0.3)", fontSize: 12 }}>{step + 1} / {steps.length}</span>
        </div>
      </div>

      {/* Avatar */}
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 22 }}>
        <Avatar photo={data.photo} name={userData.nombre} size={44} />
        <div><div style={{ fontWeight: 700, fontSize: 14 }}>¡Hola, {userData.nombre.split(" ")[0]}! 👋</div><div style={{ color: "rgba(255,255,255,0.35)", fontSize: 12 }}>Configuremos tu perfil en FROQIA</div></div>
        <div style={{ marginLeft: "auto" }}>
          <input ref={fileRef} type="file" accept="image/*" style={{ display: "none" }} onChange={handlePhoto} />
          <Btn onClick={() => fileRef.current.click()} variant="ghost" style={{ fontSize: 11, padding: "6px 12px" }}>📷 Foto</Btn>
        </div>
      </div>

      {/* Step 0: datos físicos */}
      {step === 0 && (
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>

          {/* Sexo — primero, afecta todo el plan */}
          <div>
            <label style={{ color: "rgba(255,255,255,0.5)", fontSize: 11, fontWeight: 700, letterSpacing: 0.8, display: "block", marginBottom: 8 }}>SEXO BIOLÓGICO</label>
            <div style={{ display: "flex", gap: 8 }}>
              {[
                { v: "male", e: "♂️", l: "Hombre" },
                { v: "female", e: "♀️", l: "Mujer" },
                { v: "other", e: "⚧", l: "Prefiero no decir" },
              ].map(({ v, e, l }) => (
                <div key={v} onClick={() => set("sex", v)} style={{ flex: 1, padding: "12px 6px", textAlign: "center", borderRadius: 12, cursor: "pointer", background: data.sex === v ? "#e84a2e18" : "rgba(255,255,255,0.03)", border: `2px solid ${data.sex === v ? "#e84a2e" : "rgba(255,255,255,0.07)"}`, transition: "all 0.2s" }}>
                  <div style={{ fontSize: 22, marginBottom: 4 }}>{e}</div>
                  <div style={{ fontSize: 12, fontWeight: 700, color: data.sex === v ? "#e8a090" : "rgba(255,255,255,0.5)" }}>{l}</div>
                </div>
              ))}
            </div>
            <div style={{ color: "rgba(255,255,255,0.25)", fontSize: 11, marginTop: 6, lineHeight: 1.5 }}>
              Usamos esto para calcular correctamente tu meta de proteína, interpretar análisis médicos y personalizar tu plan.
            </div>
          </div>

          <div style={{ display: "flex", gap: 10 }}>
            <div style={{ flex: 1 }}><Input label="Edad" type="number" value={data.age} onChange={v => set("age", v)} placeholder="28" /></div>
            <div style={{ flex: 1 }}><Input label="Peso (kg)" type="number" value={data.weight} onChange={v => set("weight", v)} placeholder="80" /></div>
          </div>
          <Input label="Altura (cm)" type="number" value={data.height} onChange={v => set("height", v)} placeholder="175" />

          {/* Physical profile — sin mencionar IMC */}
          {profile && (
            <div style={{ ...card, padding: "13px 16px", background: profile.color + "0d", borderColor: profile.color + "33" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
                <span style={{ fontSize: 24 }}>{profile.icon}</span>
                <div>
                  <div style={{ color: profile.color, fontWeight: 800, fontSize: 14 }}>{profile.label}</div>
                </div>
              </div>
              <div style={{ color: "rgba(255,255,255,0.55)", fontSize: 12, lineHeight: 1.5 }}>{profile.tip}</div>
            </div>
          )}

          <div>
            <label style={{ color: "rgba(255,255,255,0.5)", fontSize: 11, fontWeight: 700, letterSpacing: 0.8, display: "block", marginBottom: 8 }}>EXPERIENCIA</label>
            <div style={{ display: "flex", gap: 7 }}>
              {[["beginner", "🌱", "Principiante", "< 6 meses"], ["intermediate", "⚡", "Intermedio", "6m - 2 años"], ["advanced", "🏆", "Avanzado", "+ 2 años"]].map(([v, e, l, h]) => (
                <div key={v} onClick={() => set("experience", v)} style={{ flex: 1, padding: "10px 6px", textAlign: "center", borderRadius: 11, cursor: "pointer", background: data.experience === v ? "#e84a2e18" : "rgba(255,255,255,0.03)", border: `1.5px solid ${data.experience === v ? "#e84a2e" : "rgba(255,255,255,0.07)"}` }}>
                  <div style={{ fontSize: 18, marginBottom: 2 }}>{e}</div>
                  <div style={{ fontSize: 11, fontWeight: 700, color: data.experience === v ? "#e8a090" : "rgba(255,255,255,0.5)" }}>{l}</div>
                  <div style={{ fontSize: 10, color: "rgba(255,255,255,0.25)", marginTop: 1 }}>{h}</div>
                </div>
              ))}
            </div>
          </div>

          <div>
            <label style={{ color: "rgba(255,255,255,0.5)", fontSize: 11, fontWeight: 700, letterSpacing: 0.8, display: "block", marginBottom: 6 }}>DÍAS POR SEMANA: <span style={{ color: "#e8a090" }}>{data.daysPerWeek} días</span></label>
            <input type="range" min={2} max={6} value={data.daysPerWeek} onChange={e => set("daysPerWeek", +e.target.value)} style={{ width: "100%", accentColor: "#e84a2e" }} />
            <div style={{ display: "flex", justifyContent: "space-between", color: "rgba(255,255,255,0.25)", fontSize: 11, marginTop: 3 }}>
              <span>2 días</span><span>4 ideal</span><span>6 días</span>
            </div>
          </div>
        </div>
      )}

      {/* Step 1: tipo de cuerpo — sin etiquetas negativas */}
      {step === 1 && (
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <div style={{ ...card, padding: "11px 14px", background: "rgba(6,182,212,0.06)", borderColor: "rgba(6,182,212,0.18)", marginBottom: 4 }}>
            <div style={{ color: "#06b6d4", fontSize: 12, fontWeight: 700, marginBottom: 4 }}>🔬 ¿Qué son los somatotipos?</div>
            <div style={{ color: "rgba(255,255,255,0.5)", fontSize: 12, lineHeight: 1.5 }}>Cada persona tiene una tendencia natural del cuerpo. Identificar la tuya nos permite crear el plan más efectivo para vos.</div>
          </div>

          {BODY_TYPES.map(bt => (
            <div key={bt.id} onClick={() => set("bodyType", bt.id)} style={{ ...card, padding: "16px 18px", cursor: "pointer", background: data.bodyType === bt.id ? bt.color + "0e" : "rgba(255,255,255,0.03)", border: `1.5px solid ${data.bodyType === bt.id ? bt.color : "rgba(255,255,255,0.07)"}`, transition: "all 0.2s" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                <div style={{ width: 48, height: 48, borderRadius: 14, background: bt.color + "18", border: `1px solid ${bt.color}33`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24, flexShrink: 0 }}>{bt.emoji}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}>
                    <span style={{ fontWeight: 800, fontSize: 15 }}>{bt.label}</span>
                    <Pill color={bt.color}>{bt.sublabel}</Pill>
                  </div>
                  <div style={{ color: "rgba(255,255,255,0.45)", fontSize: 12, marginTop: 3 }}>{bt.desc}</div>
                </div>
                <div style={{ width: 20, height: 20, borderRadius: "50%", border: `2px solid ${bt.color}`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  {data.bodyType === bt.id && <div style={{ width: 10, height: 10, borderRadius: "50%", background: bt.color }} />}
                </div>
              </div>
              {data.bodyType === bt.id && (
                <div style={{ marginTop: 12, padding: "10px 13px", background: bt.color + "10", borderRadius: 10, borderLeft: `3px solid ${bt.color}` }}>
                  <div style={{ color: bt.color, fontSize: 11, fontWeight: 800, marginBottom: 5 }}>✨ {bt.tagline}</div>
                  <div style={{ color: "rgba(255,255,255,0.6)", fontSize: 12, lineHeight: 1.5 }}>{bt.details}</div>
                  <div style={{ color: bt.color, fontSize: 12, fontWeight: 600, marginTop: 8 }}>💡 {bt.plan}</div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Step 2: objetivo */}
      {step === 2 && (
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {GOALS.map(g => (
            <div key={g.id} onClick={() => set("goal", g.id)} style={{ ...card, padding: "14px 16px", cursor: "pointer", background: data.goal === g.id ? g.color + "12" : "rgba(255,255,255,0.03)", border: `1.5px solid ${data.goal === g.id ? g.color : "rgba(255,255,255,0.07)"}`, transition: "all 0.2s" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 13 }}>
                <div style={{ width: 42, height: 42, borderRadius: 12, background: g.color + "18", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, flexShrink: 0 }}>{g.emoji}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 800, fontSize: 14 }}>{g.label}</div>
                  <div style={{ color: "rgba(255,255,255,0.4)", fontSize: 12, marginTop: 2 }}>{g.desc}</div>
                </div>
                <div style={{ width: 18, height: 18, borderRadius: "50%", border: `2px solid ${g.color}`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  {data.goal === g.id && <div style={{ width: 9, height: 9, borderRadius: "50%", background: g.color }} />}
                </div>
              </div>
              {data.goal === g.id && (
                <div style={{ marginTop: 10 }}>
                  <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                    {g.timeline.map((t, i) => (
                      <div key={i} style={{ background: "rgba(255,255,255,0.05)", borderRadius: 8, padding: "5px 10px", fontSize: 11, color: "rgba(255,255,255,0.55)" }}>
                        <span style={{ color: g.color, fontWeight: 700 }}>→</span> {t}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
          {previewProtein && (
            <div style={{ ...card, padding: "13px 16px", background: "rgba(16,185,129,0.08)", borderColor: "rgba(16,185,129,0.25)" }}>
              <div style={{ color: "#10b981", fontWeight: 700, fontSize: 14 }}>🥩 Tu meta proteica: <span style={{ fontSize: 22, color: "#fff", fontWeight: 900 }}>{previewProtein}g</span> / día</div>
              <div style={{ color: "rgba(255,255,255,0.4)", fontSize: 12, marginTop: 3 }}>Basado en {data.weight}kg × {GOALS.find(g => g.id === data.goal)?.proteinMultiplier}g</div>
            </div>
          )}
        </div>
      )}

      {/* Step 3: Equipamiento — selección por categoría, simple y visual */}
      {step === 3 && (
        <div>
          <div style={{ ...card, padding: "13px 16px", marginBottom: 18, background: "rgba(232,74,46,0.07)", borderColor: "rgba(232,74,46,0.2)" }}>
            <div style={{ color: "#e8a090", fontSize: 13, fontWeight: 700, marginBottom: 4 }}>🏋️ ¿Qué tiene tu gym?</div>
            <div style={{ color: "rgba(255,255,255,0.5)", fontSize: 12, lineHeight: 1.6 }}>
              Elegí las categorías disponibles. La IA sugerirá ejercicios y, si no tenés algo, podés pedir alternativa con un toque durante el entrenamiento.
            </div>
          </div>

          {/* Selector rápido por categoría — visual y simple */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 18 }}>
            {EQUIPMENT_CATEGORIES.map(cat => {
              const catIds = cat.items.map(i => i.id);
              const selected = catIds.every(id => data.machines.includes(id));
              const partial = !selected && catIds.some(id => data.machines.includes(id));
              return (
                <div key={cat.id} onClick={() => {
                  if (selected) set("machines", data.machines.filter(id => !catIds.includes(id)));
                  else set("machines", [...new Set([...data.machines, ...catIds])]);
                }} style={{
                  padding: "14px 14px", borderRadius: 14, cursor: "pointer",
                  background: selected ? cat.color + "15" : partial ? cat.color + "08" : "rgba(255,255,255,0.03)",
                  border: `2px solid ${selected ? cat.color : partial ? cat.color + "44" : "rgba(255,255,255,0.07)"}`,
                  transition: "all 0.2s", display: "flex", flexDirection: "column", gap: 6,
                }}>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <span style={{ fontSize: 24 }}>{cat.emoji}</span>
                    <div style={{
                      width: 22, height: 22, borderRadius: 7,
                      background: selected ? cat.color : "rgba(255,255,255,0.06)",
                      border: `2px solid ${selected ? cat.color : "rgba(255,255,255,0.15)"}`,
                      display: "flex", alignItems: "center", justifyContent: "center",
                      fontSize: 12, color: "#fff", fontWeight: 800, transition: "all 0.2s"
                    }}>
                      {selected ? "✓" : partial ? "·" : ""}
                    </div>
                  </div>
                  <div>
                    <div style={{ color: selected ? "#fff" : "rgba(255,255,255,0.7)", fontWeight: 700, fontSize: 13, lineHeight: 1.3 }}>
                      {cat.label.split(" — ")[1] || cat.label}
                    </div>
                    <div style={{ color: "rgba(255,255,255,0.3)", fontSize: 11, marginTop: 2 }}>
                      {cat.items.length} ejercicios
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Quick actions */}
          <div style={{ display: "flex", gap: 8, marginBottom: 18 }}>
            <button onClick={() => set("machines", ALL_EQUIPMENT.map(m => m.id))} style={{ flex: 1, background: "rgba(16,185,129,0.1)", border: "1px solid rgba(16,185,129,0.3)", color: "#10b981", borderRadius: 11, padding: "10px 0", fontSize: 13, fontWeight: 700, cursor: "pointer", fontFamily: "'DM Sans',sans-serif" }}>
              ✓ Seleccionar todo
            </button>
            <button onClick={() => set("machines", [])} style={{ flex: 1, background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.4)", borderRadius: 11, padding: "10px 0", fontSize: 13, fontWeight: 700, cursor: "pointer", fontFamily: "'DM Sans',sans-serif" }}>
              Limpiar todo
            </button>
          </div>

          {/* Info box */}
          <div style={{ ...card, padding: "12px 14px", background: "rgba(6,182,212,0.06)", borderColor: "rgba(6,182,212,0.2)" }}>
            <div style={{ color: "#06b6d4", fontSize: 11, fontWeight: 800, letterSpacing: 0.8, marginBottom: 6 }}>💡 DURANTE EL ENTRENAMIENTO</div>
            <div style={{ color: "rgba(255,255,255,0.5)", fontSize: 12, lineHeight: 1.6 }}>
              Si un ejercicio usa equipo que no tenés, tocá el botón <strong style={{ color: "#fff" }}>↔</strong> y la IA buscará una alternativa con lo que sí tenés disponible.
            </div>
          </div>

          {/* Extras calentamiento / cierre */}
          <div style={{ marginTop: 16 }}>
            <div style={{ color: "rgba(255,255,255,0.4)", fontSize: 11, fontWeight: 800, letterSpacing: 0.8, marginBottom: 10 }}>⚡ EXTRAS — CALENTAMIENTO Y CIERRE</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              {[...WARMUP_EXTRAS, ...FINISHER_OPTIONS].map(e => (
                <div key={e.id} onClick={() => toggleMachine(e.id)} style={{ display: "flex", gap: 12, padding: "10px 13px", borderRadius: 11, cursor: "pointer", background: data.machines.includes(e.id) ? "rgba(245,158,11,0.08)" : "rgba(255,255,255,0.02)", border: `1px solid ${data.machines.includes(e.id) ? "rgba(245,158,11,0.3)" : "rgba(255,255,255,0.05)"}`, transition: "all 0.15s" }}>
                  <div style={{ width: 18, height: 18, borderRadius: 6, flexShrink: 0, marginTop: 1, background: data.machines.includes(e.id) ? "#f59e0b" : "transparent", border: `2px solid ${data.machines.includes(e.id) ? "#f59e0b" : "rgba(255,255,255,0.18)"}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, color: "#fff" }}>
                    {data.machines.includes(e.id) && "✓"}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ color: "#fff", fontSize: 13, fontWeight: 600 }}>{e.emoji} {e.name}</div>
                    <div style={{ color: "rgba(255,255,255,0.35)", fontSize: 11, lineHeight: 1.4, marginTop: 2 }}>{e.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      <div style={{ display: "flex", gap: 10, marginTop: 24 }}>
        {step > 0 && <Btn variant="ghost" onClick={() => setStep(s => s - 1)} style={{ flex: 0.4 }}>← Atrás</Btn>}
        <Btn onClick={() => { if (step < 3) setStep(s => s + 1); else onComplete({ ...userData, ...data }); }} disabled={!canNext()} style={{ flex: 1 }}>
          {step === 3 ? "🚀 ¡Empezar en FROQIA!" : "Continuar →"}
        </Btn>
      </div>
    </div>
  );
}


// ─── PROTEIN CALCULATOR ───────────────────────────────────────────────────────

// ─── FRASES MOTIVADORAS DE CELEBRIDADES ──────────────────────────────────────
const MOTIVATIONAL_QUOTES = [
  { quote: "El dolor que sentís hoy será la fuerza que sentirás mañana.", author: "Arnold Schwarzenegger", sport: "Culturismo / Actor", emoji: "🏆" },
  { quote: "No cuentes los días. Hacé que los días cuenten.", author: "Muhammad Ali", sport: "Boxeo", emoji: "🥊" },
  { quote: "Los campeones no se hacen en los gimnasios. Se hacen de algo que llevan muy adentro: un deseo, un sueño, una visión.", author: "Muhammad Ali", sport: "Boxeo", emoji: "🥊" },
  { quote: "Si puedes soñarlo, puedes lograrlo. El límite está solo en tu mente.", author: "Usain Bolt", sport: "Atletismo", emoji: "⚡" },
  { quote: "Cada vez que entreno, pienso que alguien en algún lugar también está entrenando. Y cuando nos encontremos, él ganará.", author: "Lance Armstrong", sport: "Ciclismo", emoji: "🚴" },
  { quote: "El éxito no es final, el fracaso no es fatal. Lo que cuenta es el coraje de continuar.", author: "Winston Churchill", sport: "Liderazgo", emoji: "💪" },
  { quote: "No pares cuando estés cansado. Para cuando hayas terminado.", author: "Ronnie Coleman", sport: "Culturismo 8x Mr. Olympia", emoji: "🏋️" },
  { quote: "Soy el tipo de persona que si no estoy creciendo, estoy muriendo.", author: "Dwayne 'The Rock' Johnson", sport: "Wrestling / Actor", emoji: "🔥" },
  { quote: "Trabajá cuando estés cansado, entrená cuando duela, gana cuando nadie lo espere.", author: "Kobe Bryant", sport: "Basketball NBA", emoji: "🏀" },
  { quote: "El talento gana partidos, pero el trabajo en equipo y la inteligencia ganan campeonatos.", author: "Michael Jordan", sport: "Basketball NBA", emoji: "🏀" },
  { quote: "No busques el tiempo libre. Hacé que el tiempo libre sea productivo.", author: "Bruce Lee", sport: "Artes Marciales", emoji: "🥋" },
  { quote: "Conocete a vos mismo: si sabés dónde está tu debilidad, ya tenés la mitad de la batalla ganada.", author: "Bruce Lee", sport: "Artes Marciales", emoji: "🥋" },
  { quote: "Hoy es siempre el día más difícil. Mañana será más fácil porque ya lo hiciste.", author: "Serena Williams", sport: "Tenis", emoji: "🎾" },
  { quote: "La grandeza no es algo con lo que nacés, es algo que ganás.", author: "LeBron James", sport: "Basketball NBA", emoji: "🏀" },
  { quote: "Prefiero morir de pie que vivir toda la vida de rodillas.", author: "Ernesto 'Che' Guevara", sport: "Liderazgo", emoji: "✊" },
  { quote: "El cuerpo puede soportar casi cualquier cosa. Es la mente la que hay que convencer.", author: "Andrew Murphy", sport: "Entrenamiento", emoji: "🧠" },
  { quote: "Cuando pensás que terminaste, solo estás a un 40% de tu capacidad.", author: "David Goggins", sport: "Navy SEAL / Atleta extremo", emoji: "⚡" },
  { quote: "No te digas que no podés antes de intentarlo. El límite lo ponés vos.", author: "Ronaldinho", sport: "Fútbol", emoji: "⚽" },
  { quote: "La consistencia es lo que transforma el promedio en excelencia.", author: "Lionel Messi", sport: "Fútbol", emoji: "⚽" },
  { quote: "Cada mañana tienes dos opciones: seguir durmiendo con tus sueños o levantarte y perseguirlos.", author: "Cristiano Ronaldo", sport: "Fútbol", emoji: "⚽" },
  { quote: "Empezá por hacer lo necesario, luego lo posible, y de repente estarás haciendo lo imposible.", author: "San Francisco de Asís", sport: "Filosofía", emoji: "🌟" },
  { quote: "Si no desafías tus límites, nunca sabrás dónde están.", author: "Michael Phelps", sport: "Natación / 23 oros olímpicos", emoji: "🏊" },
  { quote: "El sudor de hoy es el éxito de mañana.", author: "Colin Powell", sport: "Liderazgo", emoji: "💦" },
  { quote: "Caé siete veces, levantáte ocho.", author: "Proverbio japonés", sport: "Sabiduría", emoji: "🎌" },
  { quote: "La única persona que podés ser es una versión mejorada de vos mismo.", author: "Tony Robbins", sport: "Desarrollo personal", emoji: "🚀" },
  { quote: "El dolor es temporal. El orgullo es para siempre.", author: "Eric Thomas", sport: "Motivación", emoji: "🏆" },
  { quote: "Lo que no te mata te hace más fuerte.", author: "Friedrich Nietzsche", sport: "Filosofía", emoji: "⚡" },
  { quote: "Sé el cambio que querés ver en el mundo — y en tu propio cuerpo.", author: "Mahatma Gandhi (adaptado)", sport: "Liderazgo", emoji: "🙏" },
  { quote: "Cada repetición es un ladrillo en el edificio de tu mejor versión.", author: "Joe Weider", sport: "Fundador del culturismo moderno", emoji: "🏗️" },
  { quote: "No te compares con nadie. Compará al que sos hoy con quien eras ayer.", author: "Jordan Peterson", sport: "Psicología", emoji: "📈" },
  { quote: "Nunca subestimes el poder de un entrenamiento. Puede cambiar tu día, tu semana, tu vida.", author: "Greg Plitt", sport: "Modelo fitness", emoji: "💥" },
  { quote: "Tu cuerpo puede hacerlo. Solo tenés que convencer a tu mente.", author: "Frase del fitness", sport: "Entrenamiento", emoji: "🧠" },
  { quote: "Hace seis meses hubieras querido estar donde estás hoy. No pares.", author: "Frase viral fitness", sport: "Motivación", emoji: "⏳" },
  { quote: "La disciplina es hacer lo que tenés que hacer, aunque no tengas ganas.", author: "Navy SEAL Ethos", sport: "Fuerzas especiales", emoji: "🎯" },
  { quote: "El mejor momento para empezar fue ayer. El segundo mejor momento es ahora.", author: "Proverbio chino", sport: "Sabiduría", emoji: "🐉" },
];

function getDailyQuote() {
  const day = new Date().getDay() + new Date().getDate();
  return MOTIVATIONAL_QUOTES[day % MOTIVATIONAL_QUOTES.length];
}

function MotivationalQuote() {
  const [quote, setQuote] = useState(getDailyQuote());
  const [animating, setAnimating] = useState(false);

  const nextQuote = () => {
    setAnimating(true);
    setTimeout(() => {
      const idx = MOTIVATIONAL_QUOTES.indexOf(quote);
      setQuote(MOTIVATIONAL_QUOTES[(idx + 1) % MOTIVATIONAL_QUOTES.length]);
      setAnimating(false);
    }, 200);
  };

  return (
    <div style={{
      ...card, padding: "16px 18px", marginBottom: 14,
      background: "linear-gradient(135deg, rgba(232,74,46,0.08), rgba(245,158,11,0.04))",
      borderColor: "rgba(232,74,46,0.2)", position: "relative", overflow: "hidden"
    }}>
      {/* decorative quote mark */}
      <div style={{ position: "absolute", top: 8, right: 14, fontSize: 48, color: "rgba(232,74,46,0.08)", fontFamily: "Georgia, serif", lineHeight: 1, userSelect: "none" }}>"</div>

      <div style={{ color: "#e8a090", fontSize: 10, fontWeight: 800, letterSpacing: 1, marginBottom: 10 }}>
        💬 FRASE DEL DÍA
      </div>

      <div style={{
        opacity: animating ? 0 : 1, transition: "opacity 0.2s",
      }}>
        <p style={{
          color: "#fff", fontSize: 14, fontWeight: 600, lineHeight: 1.65,
          margin: "0 0 12px", fontStyle: "italic",
        }}>
          "{quote.quote}"
        </p>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10 }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <span style={{ fontSize: 18 }}>{quote.emoji}</span>
              <div>
                <div style={{ color: "#e8a090", fontWeight: 700, fontSize: 13 }}>— {quote.author}</div>
                <div style={{ color: "rgba(255,255,255,0.3)", fontSize: 11 }}>{quote.sport}</div>
              </div>
            </div>
          </div>
          <button onClick={nextQuote} style={{
            background: "rgba(232,74,46,0.12)", border: "1px solid rgba(232,74,46,0.25)",
            color: "#e8a090", borderRadius: 10, padding: "6px 12px", fontSize: 12,
            cursor: "pointer", fontFamily: "'DM Sans',sans-serif", fontWeight: 600, flexShrink: 0
          }}>
            Otra ↻
          </button>
        </div>
      </div>
    </div>
  );
}


// ─── REST TIMER ───────────────────────────────────────────────────────────────
function RestTimer({ seconds, onDone, onSkip }) {
  
  const [remaining, setRemaining] = useState(seconds);
  const [paused, setPaused] = useState(false);
  const intervalRef = useRef(null);

  useEffect(() => {
    if (paused) return;
    intervalRef.current = setInterval(() => {
      setRemaining(r => {
        if (r <= 1) {
          clearInterval(intervalRef.current);
          if (navigator.vibrate) navigator.vibrate([300, 100, 300]);
          try {
            const ctx = new (window.AudioContext || window.webkitAudioContext)();
            [0, 0.3, 0.6].forEach(t => {
              const o = ctx.createOscillator(), g = ctx.createGain();
              o.connect(g); g.connect(ctx.destination);
              o.frequency.value = 880;
              g.gain.setValueAtTime(0.3, ctx.currentTime + t);
              g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + t + 0.25);
              o.start(ctx.currentTime + t); o.stop(ctx.currentTime + t + 0.3);
            });
          } catch {}
          setTimeout(onDone, 600);
          return 0;
        }
        return r - 1;
      });
    }, 1000);
    return () => clearInterval(intervalRef.current);
  }, [paused]);

  const pct = ((seconds - remaining) / seconds) * 100;
  const mins = Math.floor(remaining / 60);
  const secs = remaining % 60;
  const urgent = remaining <= 5;

  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.92)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 90, backdropFilter: "blur(14px)", flexDirection: "column", fontFamily: "'DM Sans',sans-serif" }}>
      <div style={{ position: "relative", width: 220, height: 220, marginBottom: 28 }}>
        <svg width="220" height="220" style={{ transform: "rotate(-90deg)" }}>
          <circle cx="110" cy="110" r="96" fill="none" stroke="rgba(255,255,255,0.07)" strokeWidth="12" />
          <circle cx="110" cy="110" r="96" fill="none" stroke={urgent ? "#e84a2e" : "#10b981"} strokeWidth="12" strokeLinecap="round"
            strokeDasharray={`${2 * Math.PI * 96}`}
            strokeDashoffset={`${2 * Math.PI * 96 * (1 - pct / 100)}`}
            style={{ transition: "stroke-dashoffset 1s linear, stroke 0.3s" }} />
        </svg>
        <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
          <div style={{ fontSize: 11, fontWeight: 800, color: "rgba(255,255,255,0.4)", letterSpacing: 2, marginBottom: 6 }}>{"DESCANSO"}</div>
          <div style={{ fontSize: 60, fontWeight: 900, color: urgent ? "#e84a2e" : "#fff", lineHeight: 1, transition: "color 0.3s" }}>
            {mins > 0 ? `${mins}:${secs.toString().padStart(2, "0")}` : secs}
          </div>
          <div style={{ fontSize: 13, color: "rgba(255,255,255,0.3)", marginTop: 5 }}>{"segundos"}</div>
        </div>
      </div>
      <p style={{ color: "rgba(255,255,255,0.45)", fontSize: 14, fontStyle: "italic", textAlign: "center", maxWidth: 280, lineHeight: 1.6, margin: "0 0 32px" }}>
        {remaining > 30 ? "Recuperá la respiración. La próxima serie será mejor." :
         remaining > 15 ? "Casi listo. Preparate para la siguiente serie." :
         remaining > 5  ? "¡Ya casi! Agarrá el equipo..." : "⚡ ¡Vamos!"}
      </p>
      <div style={{ display: "flex", gap: 12, marginBottom: 16 }}>
        <button onClick={() => setPaused(p => !p)} style={{ background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.2)", color: "#fff", borderRadius: 14, padding: "13px 24px", fontSize: 15, fontWeight: 700, cursor: "pointer", fontFamily: "'DM Sans',sans-serif" }}>
          {paused ? "▶ Reanudar" : "⏸ Pausar"}
        </button>
        <button onClick={onSkip} style={{ background: "linear-gradient(135deg,#e84a2e,#c53d25)", border: "none", color: "#fff", borderRadius: 14, padding: "13px 24px", fontSize: 15, fontWeight: 700, cursor: "pointer", fontFamily: "'DM Sans',sans-serif", boxShadow: "0 4px 20px rgba(232,74,46,0.4)" }}>
          Saltar →
        </button>
      </div>
      <div style={{ display: "flex", gap: 8 }}>
        {[15, 30, 60].map(s => (
          <button key={s} onClick={() => setRemaining(r => r + s)} style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.5)", borderRadius: 10, padding: "6px 14px", fontSize: 12, cursor: "pointer", fontFamily: "'DM Sans',sans-serif", fontWeight: 600 }}>
            +{s}s
          </button>
        ))}
      </div>
    </div>
  );
}

// ─── WARMUP CARD — pregunta si quiere calentar, siempre recuperable ──────────
function WarmupCard({ warmup }) {
  const [state, setState] = useState("ask"); // ask | doing | done | skipped

  // Skipped: muestra pastilla pequeña para retomar
  if (state === "skipped") return (
    <button onClick={() => setState("ask")} style={{
      width: "100%", marginBottom: 10,
      background: "rgba(16,185,129,0.05)", border: "1px dashed rgba(16,185,129,0.25)",
      borderRadius: 12, padding: "10px 16px", cursor: "pointer",
      display: "flex", alignItems: "center", gap: 10, fontFamily: "'DM Sans',sans-serif"
    }}>
      <span style={{ fontSize: 16 }}>🌡️</span>
      <span style={{ color: "rgba(255,255,255,0.4)", fontSize: 13 }}>Calentamiento omitido.</span>
      <span style={{ marginLeft: "auto", color: "#10b981", fontSize: 12, fontWeight: 700 }}>Retomar →</span>
    </button>
  );

  if (state === "done") return null;

  if (state === "ask") return (
    <div style={{ ...card, padding: 16, marginBottom: 12, borderColor: "rgba(16,185,129,0.25)", background: "rgba(16,185,129,0.06)" }}>
      <div style={{ color: "#10b981", fontSize: 10, fontWeight: 800, letterSpacing: 1, marginBottom: 8 }}>🌡️ CALENTAMIENTO SUGERIDO</div>
      <p style={{ color: "rgba(255,255,255,0.65)", fontSize: 13, lineHeight: 1.6, margin: "0 0 14px" }}>{warmup}</p>
      <div style={{ display: "flex", gap: 8 }}>
        <button onClick={() => setState("doing")} style={{ flex: 1, background: "linear-gradient(135deg,#10b981,#059669)", border: "none", color: "#fff", borderRadius: 11, padding: "11px 0", fontSize: 14, fontWeight: 700, cursor: "pointer", fontFamily: "'DM Sans',sans-serif" }}>
          ✓ Sí, voy a calentar
        </button>
        <button onClick={() => setState("skipped")} style={{ flex: 1, background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.45)", borderRadius: 11, padding: "11px 0", fontSize: 14, fontWeight: 700, cursor: "pointer", fontFamily: "'DM Sans',sans-serif" }}>
          → Ir al entreno
        </button>
      </div>
    </div>
  );

  if (state === "doing") return (
    <div style={{ ...card, padding: 16, marginBottom: 12, borderColor: "rgba(16,185,129,0.3)", background: "rgba(16,185,129,0.08)" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
        <div style={{ color: "#10b981", fontSize: 10, fontWeight: 800, letterSpacing: 1 }}>🌡️ CALENTANDO...</div>
        <button onClick={() => setState("ask")} style={{ background: "none", border: "none", color: "rgba(255,255,255,0.3)", cursor: "pointer", fontSize: 12, fontFamily: "'DM Sans',sans-serif" }}>← Volver</button>
      </div>
      <p style={{ color: "rgba(255,255,255,0.65)", fontSize: 13, lineHeight: 1.6, margin: "0 0 14px" }}>{warmup}</p>
      <button onClick={() => setState("done")} style={{ width: "100%", background: "rgba(16,185,129,0.15)", border: "1px solid rgba(16,185,129,0.35)", color: "#10b981", borderRadius: 11, padding: "11px 0", fontSize: 14, fontWeight: 700, cursor: "pointer", fontFamily: "'DM Sans',sans-serif" }}>
        ✅ Listo, empezar el entreno
      </button>
    </div>
  );

  return null;
}


// ─── EXERCISE DETAIL MODAL — estilo SmartFit ─────────────────────────────────
function ExerciseDetailModal({ ex, index, done, onToggle, onVideoClick, machineData, alternatives, loadingAlts, onPickAlternative, onLoadAlternatives, onClose }) {
  const [section, setSection] = useState(null); // null | "alternatives"
  const restSecs = parseInt((ex.rest || "60").match(/\d+/)?.[0] || "60");
  const [timerActive, setTimerActive] = useState(false);

  const showAlts = alternatives && Array.isArray(alternatives);

  return (
    <div style={{ position: "fixed", inset: 0, background: "#0d0d0f", zIndex: 80, overflowY: "auto", fontFamily: "'DM Sans',sans-serif", color: "#fff" }}>
      {/* Header */}
      <div style={{ padding: "16px 18px 0", display: "flex", alignItems: "center", gap: 14, position: "sticky", top: 0, background: "rgba(13,13,15,0.97)", zIndex: 10, paddingBottom: 14, borderBottom: "1px solid rgba(255,255,255,0.07)" }}>
        <button onClick={onClose} style={{ background: "rgba(255,255,255,0.08)", border: "none", color: "#fff", width: 36, height: 36, borderRadius: "50%", cursor: "pointer", fontSize: 18, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>←</button>
        {/* Position badge */}
        <div style={{ width: 28, height: 28, borderRadius: 8, background: done ? "#10b981" : "rgba(232,74,46,0.2)", border: `1.5px solid ${done ? "#10b981" : "#e84a2e66"}`, display: "flex", alignItems: "center", justifyContent: "center", color: done ? "#fff" : "#e8a090", fontWeight: 800, fontSize: 13, flexShrink: 0 }}>
          {done ? "✓" : index + 1}
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ fontWeight: 800, fontSize: 17, lineHeight: 1.2 }}>{ex.machine}</div>
          <div style={{ color: "rgba(255,255,255,0.4)", fontSize: 12, marginTop: 2 }}>
            {ex.muscle} · Ejercicio {index + 1}
          </div>
        </div>
        {machineData && (
          <button onClick={onVideoClick} style={{ background: "rgba(232,74,46,0.15)", border: "1px solid rgba(232,74,46,0.3)", color: "#e8a090", borderRadius: 10, padding: "7px 14px", fontSize: 13, cursor: "pointer", fontFamily: "'DM Sans',sans-serif", fontWeight: 600 }}>▶ Video</button>
        )}
      </div>

      <div style={{ padding: "18px 18px 100px" }}>

        {/* Series y Carga */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 10 }}>
          <div style={{ background: "rgba(255,255,255,0.05)", borderRadius: 14, padding: "14px 16px" }}>
            <div style={{ color: "rgba(255,255,255,0.4)", fontSize: 11, fontWeight: 700, marginBottom: 6 }}>Series y Repeticiones</div>
            <div style={{ color: "#fff", fontWeight: 900, fontSize: 22 }}>{ex.sets}×{ex.reps}</div>
          </div>
          <div style={{ background: "rgba(232,74,46,0.08)", borderRadius: 14, padding: "14px 16px", border: "1px solid rgba(232,74,46,0.2)" }}>
            <div style={{ color: "#e8a090", fontSize: 11, fontWeight: 700, marginBottom: 6 }}>⚖️ CARGA INICIAL</div>
            <div style={{ color: "#fff", fontWeight: 900, fontSize: 20, lineHeight: 1.1 }}>{ex.weight_suggestion || "—"}</div>
          </div>
        </div>

        {/* Nota de ajuste de carga */}
        <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 12, padding: "10px 14px", marginBottom: 14 }}>
          <div style={{ color: "rgba(255,255,255,0.5)", fontSize: 12, lineHeight: 1.55 }}>
            💡 <strong style={{ color: "rgba(255,255,255,0.75)" }}>¿Cómo ajustar?</strong> Empezá con el valor más bajo. Si podés hacer todas las reps con buena técnica y sin esfuerzo máximo, subí 2-5 kg la próxima serie. Si no llegás a las reps mínimas, bajá.
          </div>
        </div>

        {/* Temporizador de descanso */}
        <div style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 14, padding: "13px 16px", marginBottom: 14, display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ color: "rgba(255,255,255,0.5)", fontSize: 13 }}>
            <span style={{ fontWeight: 800, color: "#fff", fontSize: 18, fontFamily: "monospace" }}>
              {Math.floor(restSecs / 60) > 0 ? `${Math.floor(restSecs / 60)}:${(restSecs % 60).toString().padStart(2, "0")}` : `00:${restSecs.toString().padStart(2, "0")}`}
            </span>
            <span style={{ marginLeft: 8 }}>(Descanso entre series)</span>
          </div>
          <button onClick={() => setTimerActive(true)} style={{ marginLeft: "auto", background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.15)", color: "#fff", borderRadius: 10, width: 36, height: 36, cursor: "pointer", fontSize: 16, display: "flex", alignItems: "center", justifyContent: "center" }}>▶</button>
        </div>

        {/* Timer overlay si está activo */}
        {timerActive && <RestTimer seconds={restSecs} onDone={() => setTimerActive(false)} onSkip={() => setTimerActive(false)} />}

        {/* Tip técnico */}
        {ex.tip && (
          <div style={{ background: "rgba(232,74,46,0.07)", border: "1px solid rgba(232,74,46,0.2)", borderRadius: 14, padding: "13px 16px", marginBottom: 14 }}>
            <div style={{ color: "#e8a090", fontSize: 11, fontWeight: 800, letterSpacing: 0.8, marginBottom: 6 }}>💡 TÉCNICA</div>
            <div style={{ color: "rgba(255,255,255,0.7)", fontSize: 13, lineHeight: 1.6 }}>{ex.tip}</div>
          </div>
        )}

        {/* Activación muscular */}
        {machineData?.muscles_worked && (
          <div style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 14, padding: "13px 16px", marginBottom: 14 }}>
            <div style={{ color: "rgba(255,255,255,0.5)", fontSize: 11, fontWeight: 800, letterSpacing: 0.8, marginBottom: 10 }}>💪 ACTIVACIÓN MUSCULAR</div>
            {machineData.muscles_worked.map((m, i) => (
              <div key={m} style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 7 }}>
                <div style={{ width: 8, height: 8, borderRadius: "50%", background: i === 0 ? "#e84a2e" : "rgba(255,255,255,0.2)", flexShrink: 0 }} />
                <span style={{ color: i === 0 ? "#fff" : "rgba(255,255,255,0.5)", fontSize: 13, fontWeight: i === 0 ? 700 : 400 }}>{m}</span>
                {i === 0 && <span style={{ fontSize: 10, color: "#e8a090", fontWeight: 700 }}>PRINCIPAL</span>}
              </div>
            ))}
          </div>
        )}

        {/* ── CAMBIAR EJERCICIO — estilo SmartFit ── */}
        <div style={{ marginTop: 8 }}>
          <div style={{ fontWeight: 800, fontSize: 16, marginBottom: 6 }}>Cambiar ejercicio</div>
          <div style={{ color: "rgba(255,255,255,0.45)", fontSize: 13, lineHeight: 1.6, marginBottom: 16 }}>
            Los ejercicios propuestos trabajan los mismos grupos musculares que el ejercicio actual.
          </div>

          {!showAlts && !loadingAlts && (
            <button onClick={onLoadAlternatives} style={{ width: "100%", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.12)", color: "rgba(255,255,255,0.6)", borderRadius: 13, padding: "13px 0", fontSize: 14, fontWeight: 700, cursor: "pointer", fontFamily: "'DM Sans',sans-serif" }}>
              🔄 Ver alternativas disponibles
            </button>
          )}

          {loadingAlts && (
            <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "14px 16px", background: "rgba(245,158,11,0.07)", border: "1px solid rgba(245,158,11,0.2)", borderRadius: 13 }}>
              <div style={{ width: 18, height: 18, border: "2px solid rgba(245,158,11,0.3)", borderTopColor: "#f59e0b", borderRadius: "50%", animation: "spin 0.7s linear infinite", flexShrink: 0 }} />
              <span style={{ color: "#f5d060", fontSize: 13 }}>Buscando alternativas con tu equipamiento...</span>
            </div>
          )}

          {/* Lista de alternativas — igual que SmartFit */}
          {showAlts && (
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {alternatives.map((alt, ai) => {
                const altMachineData = getMachineData(alt.machine);
                return (
                  <div key={ai} onClick={() => onPickAlternative(alt)} style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.09)", borderRadius: 14, padding: "14px 16px", cursor: "pointer", display: "flex", alignItems: "center", gap: 14, transition: "all 0.15s" }}
                    onMouseEnter={e => { e.currentTarget.style.background = "rgba(232,74,46,0.1)"; e.currentTarget.style.borderColor = "rgba(232,74,46,0.3)"; }}
                    onMouseLeave={e => { e.currentTarget.style.background = "rgba(255,255,255,0.04)"; e.currentTarget.style.borderColor = "rgba(255,255,255,0.09)"; }}
                  >
                    {/* Thumbnail / ícono del ejercicio */}
                    <div style={{ width: 56, height: 56, borderRadius: 12, background: "rgba(232,74,46,0.12)", border: "1px solid rgba(232,74,46,0.2)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24, flexShrink: 0 }}>
                      {alt.machine.toLowerCase().includes("peso") || alt.machine.toLowerCase().includes("corporal") || alt.machine.toLowerCase().includes("flexion") ? "🤸" :
                       alt.machine.toLowerCase().includes("barra") ? "🏋️" :
                       alt.machine.toLowerCase().includes("mancuerna") ? "💪" :
                       alt.machine.toLowerCase().includes("banda") || alt.machine.toLowerCase().includes("goma") ? "🟡" :
                       alt.machine.toLowerCase().includes("polea") || alt.machine.toLowerCase().includes("cable") ? "🔗" :
                       alt.machine.toLowerCase().includes("cardio") || alt.machine.toLowerCase().includes("biciclet") ? "🚴" : "🏋️"}
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 700, fontSize: 14, color: "#fff", marginBottom: 3 }}>{alt.machine}</div>
                      <div style={{ color: "rgba(255,255,255,0.4)", fontSize: 12 }}>{alt.sets}×{alt.reps}</div>
                      {alt.reason && <div style={{ color: "rgba(255,255,255,0.35)", fontSize: 11, marginTop: 3, lineHeight: 1.4 }}>💡 {alt.reason}</div>}
                    </div>
                    <div style={{ color: "rgba(255,255,255,0.3)", fontSize: 20 }}>⇄</div>
                  </div>
                );
              })}
              <button onClick={() => onLoadAlternatives(true)} style={{ background: "none", border: "1px solid rgba(255,255,255,0.08)", color: "rgba(255,255,255,0.35)", borderRadius: 13, padding: "11px 0", fontSize: 13, cursor: "pointer", fontFamily: "'DM Sans',sans-serif", marginTop: 4 }}>
                🔄 Buscar más alternativas
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Bottom action bar */}
      <div style={{ position: "fixed", bottom: 0, left: "50%", transform: "translateX(-50%)", width: "100%", maxWidth: 520, background: "rgba(13,13,15,0.97)", backdropFilter: "blur(16px)", borderTop: "1px solid rgba(255,255,255,0.07)", padding: "14px 18px 28px", display: "flex", gap: 10 }}>
        <button onClick={onClose} style={{ flex: 0.4, background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", color: "#aaa", borderRadius: 13, padding: 14, fontWeight: 700, fontSize: 14, cursor: "pointer", fontFamily: "'DM Sans',sans-serif" }}>
          ← Volver
        </button>
        <button onClick={() => { onToggle(); onClose(); }} style={{ flex: 1, background: done ? "rgba(16,185,129,0.15)" : "linear-gradient(135deg,#e84a2e,#c53d25)", border: done ? "1px solid rgba(16,185,129,0.4)" : "none", color: done ? "#10b981" : "#fff", borderRadius: 13, padding: 14, fontWeight: 700, fontSize: 15, cursor: "pointer", fontFamily: "'DM Sans',sans-serif", boxShadow: done ? "none" : "0 4px 20px rgba(232,74,46,0.35)" }}>
          {done ? "✓ Completado" : "✅ Marcar como completado"}
        </button>
      </div>
    </div>
  );
}

// ─── SMART EXERCISE CARD — tarjeta compacta que abre el modal ─────────────────
function SmartExerciseCard({ ex, index, done, onToggle, onVideoClick, onSubstitute, isSubstituting, alternatives, onPickAlternative, onDismissAlternatives }) {
  const [showDetail, setShowDetail] = useState(false);
  const machineData = getMachineData(ex.machine);
  const loadingAlts = alternatives === "loading" || isSubstituting;
  const showAlts = alternatives && Array.isArray(alternatives);

  return (
    <>
      {/* Detail modal */}
      {showDetail && (
        <ExerciseDetailModal
          ex={ex}
          index={index}
          done={done}
          onToggle={onToggle}
          onVideoClick={onVideoClick}
          machineData={machineData}
          alternatives={showAlts ? alternatives : null}
          loadingAlts={loadingAlts}
          onPickAlternative={(alt) => { onPickAlternative(alt); setShowDetail(false); }}
          onLoadAlternatives={(force) => onSubstitute(force)}
          onClose={() => setShowDetail(false)}
        />
      )}

      {/* Compact card */}
      <div onClick={() => setShowDetail(true)} style={{ padding: "13px 14px", borderRadius: 13, cursor: "pointer", background: done ? "rgba(16,185,129,0.07)" : "rgba(255,255,255,0.03)", border: `1.5px solid ${done ? "rgba(16,185,129,0.28)" : "rgba(255,255,255,0.07)"}`, opacity: done ? 0.75 : 1, transition: "all 0.2s", display: "flex", alignItems: "center", gap: 12 }}>

        {/* Check */}
        <div onClick={e => { e.stopPropagation(); onToggle(); }} style={{ width: 30, height: 30, borderRadius: 9, flexShrink: 0, background: done ? "#10b981" : "rgba(232,74,46,0.1)", border: `2px solid ${done ? "#10b981" : "#e84a2e44"}`, display: "flex", alignItems: "center", justifyContent: "center", color: done ? "#fff" : "#e8a090", fontWeight: 800, fontSize: 13, transition: "all 0.2s" }}>
          {done ? "✓" : index + 1}
        </div>

        {/* Info */}
        <div style={{ flex: 1 }}>
          <div style={{ fontWeight: 700, fontSize: 14, textDecoration: done ? "line-through" : "none", color: done ? "rgba(255,255,255,0.35)" : "#fff" }}>{ex.machine}</div>
          <div style={{ color: "rgba(255,255,255,0.35)", fontSize: 11, marginTop: 1 }}>{ex.muscle} · {ex.sets}×{ex.reps} · {ex.rest}</div>
        </div>

        {/* Chevron — indica que es tappable */}
        <div style={{ color: "rgba(255,255,255,0.2)", fontSize: 16 }}>›</div>
      </div>
    </>
  );
}


function TermsModal({ onClose }) {
  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.88)", zIndex: 200, display: "flex", alignItems: "flex-end", justifyContent: "center", backdropFilter: "blur(6px)" }}>
      <div style={{ background: "#141416", borderRadius: "22px 22px 0 0", width: "100%", maxWidth: 520, maxHeight: "88vh", display: "flex", flexDirection: "column", border: "1px solid rgba(255,255,255,0.08)" }}>
        <div style={{ padding: "20px 20px 12px", borderBottom: "1px solid rgba(255,255,255,0.07)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ fontWeight: 800, fontSize: 17, color: "#fff" }}>📋 Términos y Condiciones</div>
          <button onClick={onClose} style={{ background: "rgba(255,255,255,0.08)", border: "none", color: "#fff", width: 32, height: 32, borderRadius: "50%", cursor: "pointer", fontSize: 16 }}>✕</button>
        </div>
        <div style={{ overflowY: "auto", padding: "20px 20px 32px", flex: 1 }}>
          <div style={{ color: "rgba(255,255,255,0.5)", fontSize: 12, lineHeight: 1.8 }}>
            {[
              { title: "1. Naturaleza del servicio", body: "FROQIA es una aplicación de bienestar y entrenamiento físico que utiliza inteligencia artificial para generar rutinas y recomendaciones nutricionales orientativas. No es un servicio médico ni un sustituto de atención profesional de salud." },
              { title: "2. Disclaimer nutricional", body: "Las sugerencias nutricionales de FROQIA son de carácter general e informativo. No constituyen asesoramiento dietético individualizado. Las tablas de alimentos, cálculos de proteína y recomendaciones son aproximaciones basadas en datos estándar y pueden no ser apropiadas para todas las personas." },
              { title: "3. Disclaimer médico", body: "El análisis de informes médicos realizado por la IA es orientativo y no reemplaza en ningún caso la evaluación de un médico, nutricionista o profesional de la salud certificado. Ante cualquier duda sobre tu salud, consultá a un profesional habilitado." },
              { title: "4. Limitación de responsabilidad", body: "FROQIA no asume responsabilidad por lesiones, efectos adversos o resultados derivados del uso de la aplicación. El usuario asume plena responsabilidad por la realización de cualquier rutina de ejercicios o cambio en su alimentación." },
              { title: "5. Alergias e intolerancias", body: "Las sugerencias de alimentos no tienen en cuenta condiciones médicas particulares. Si tenés alergias, intolerancias o restricciones alimentarias diagnosticadas, consultá siempre con un profesional de la salud antes de seguir cualquier recomendación." },
              { title: "6. Suscripción y prueba gratuita", body: "El período de prueba gratuita de 7 días no requiere tarjeta de crédito. Al finalizar el período, el acceso a funciones premium quedará restringido hasta que el usuario elija un plan de pago. No se realizan cobros automáticos." },
              { title: "7. Privacidad y datos", body: "Los datos personales ingresados (nombre, peso, altura, objetivos) se utilizan exclusivamente para personalizar la experiencia dentro de la app. No son compartidos con terceros ni utilizados con fines publicitarios. Los archivos médicos subidos son procesados por la IA y no se almacenan de forma permanente." },
              { title: "8. Propiedad intelectual", body: "Todo el contenido de FROQIA, incluyendo rutinas generadas, texto, diseño y software, está protegido por derechos de propiedad intelectual. Queda prohibida su reproducción sin autorización expresa." },
              { title: "9. Modificaciones", body: "FROQIA se reserva el derecho de modificar estos términos con previo aviso a los usuarios. El uso continuado de la aplicación implica la aceptación de los términos vigentes." },
              { title: "10. Legislación aplicable", body: "Estos términos se rigen por la legislación vigente en la República del Paraguay." },
            ].map(s => (
              <div key={s.title} style={{ marginBottom: 20 }}>
                <div style={{ color: "#e8a090", fontWeight: 700, fontSize: 13, marginBottom: 5 }}>{s.title}</div>
                <div style={{ color: "rgba(255,255,255,0.55)", fontSize: 13, lineHeight: 1.7 }}>{s.body}</div>
              </div>
            ))}
            <div style={{ marginTop: 24, padding: "14px 16px", background: "rgba(232,74,46,0.08)", borderRadius: 12, border: "1px solid rgba(232,74,46,0.2)" }}>
              <div style={{ color: "#e8a090", fontWeight: 700, fontSize: 13, marginBottom: 4 }}>Última actualización</div>
              <div style={{ color: "rgba(255,255,255,0.4)", fontSize: 12 }}>Versión 1.0 — Abril 2025. Para consultas: soporte@froqia.app</div>
            </div>
          </div>
        </div>
        <div style={{ padding: "12px 20px 28px" }}>
          <button onClick={onClose} style={{ width: "100%", background: "linear-gradient(135deg,#e84a2e,#c53d25)", border: "none", color: "#fff", borderRadius: 13, padding: 14, fontWeight: 700, fontSize: 15, cursor: "pointer", fontFamily: "'DM Sans',sans-serif" }}>Entendido</button>
        </div>
      </div>
    </div>
  );
}

// ─── PROTEIN CALCULATOR — Plan de comidas con sumatoria en tiempo real ────────
function ProteinCalculator({ user }) {
  const { daily, perMeal, mult } = calcProtein(user);
  const goal = GOALS.find(g => g.id === user.goal);

  const [excluded, setExcluded] = useState([]);
  const [allergies, setAllergies] = useState([]);
  const [showPrefs, setShowPrefs] = useState(false);
  const [showTerms, setShowTerms] = useState(false);
  const [filter, setFilter] = useState("all");
  const [tab, setTab] = useState("plan");
  // mealPlan: { [foodName]: { grams? number, units? number } }
  const [mealPlan, setMealPlan] = useState(() => generateSuggestedPlan(daily, []));
  // browsing grams (antes de agregar al plan)
  const [browseGrams, setBrowseGrams] = useState({});
  const [browseUnits, setBrowseUnits] = useState({});

  const ALLERGY_OPTIONS = [
    { id: "gluten", label: "Gluten / Trigo", emoji: "🌾", excludes: [] },
    { id: "lactose", label: "Lactosa / Lácteos", emoji: "🥛", excludes: ["Yogurt griego (0%)", "Yogurt griego (entero)", "Queso cottage"] },
    { id: "fish", label: "Pescado / Mariscos", emoji: "🐟", excludes: ["Atún al agua", "Salmón"] },
    { id: "eggs", label: "Huevos", emoji: "🥚", excludes: ["Huevo entero", "Clara de huevo"] },
    { id: "nuts", label: "Frutos secos", emoji: "🥜", excludes: [] },
    { id: "soy", label: "Soja", emoji: "🫘", excludes: [] },
  ];

  const toggleAllergy = (id) => {
    const allergy = ALLERGY_OPTIONS.find(a => a.id === id);
    setAllergies(prev => {
      const newList = prev.includes(id) ? prev.filter(a => a !== id) : [...prev, id];
      const autoExclude = ALLERGY_OPTIONS.filter(a => newList.includes(a.id)).flatMap(a => a.excludes);
      setExcluded(ex => [...new Set([...ex.filter(e => !allergy.excludes.includes(e)), ...autoExclude])]);
      return newList;
    });
  };
  const toggleExclude = (name) => setExcluded(prev => prev.includes(name) ? prev.filter(n => n !== name) : [...prev, name]);
  const isExcluded = (name) => excluded.includes(name);

  // ── Sumatoria del plan ──
  const planTotals = Object.entries(mealPlan).reduce((acc, [name, entry]) => {
    const food = PROTEIN_FOODS.find(f => f.name === name);
    if (!food) return acc;
    const g = getFoodGrams(food, entry);
    acc.protein += (food.per100g * g) / 100;
    acc.cal += (food.cal100g * g) / 100;
    acc.fat += (food.fat * g) / 100;
    acc.carbs += (food.carbs * g) / 100;
    return acc;
  }, { protein: 0, cal: 0, fat: 0, carbs: 0 });

  const planProtein = parseFloat(planTotals.protein.toFixed(1));
  const proteinPct = Math.min(100, (planProtein / daily) * 100);
  const planCount = Object.keys(mealPlan).length;
  const remaining = Math.max(0, daily - planProtein);
  const isOver = planProtein > daily;
  const statusColor = isOver ? "#f59e0b" : proteinPct >= 90 ? "#10b981" : proteinPct >= 60 ? "#06b6d4" : "#e84a2e";
  const statusLabel = isOver ? "¡Meta superada!" : proteinPct >= 90 ? "¡Casi llegás!" : proteinPct >= 60 ? "Vas bien" : "Seguí agregando";

  // ── Agregar al plan desde el explorador ──
  const addToMeal = (food) => {
    const entry = food.unit === "unit"
      ? { units: browseUnits[food.name] || food.defaultUnits }
      : { grams: browseGrams[food.name] || food.defaultGrams };
    setMealPlan(p => {
      const existing = p[food.name];
      if (!existing) return { ...p, [food.name]: entry };
      // Si ya existe, acumular
      if (food.unit === "unit") return { ...p, [food.name]: { units: (existing.units || food.defaultUnits) + (entry.units || food.defaultUnits) } };
      return { ...p, [food.name]: { grams: (existing.grams || food.defaultGrams) + (entry.grams || food.defaultGrams) } };
    });
  };
  const removeFromMeal = (name) => setMealPlan(p => { const n = { ...p }; delete n[name]; return n; });
  const updateMealEntry = (name, field, value) => setMealPlan(p => ({ ...p, [name]: { ...p[name], [field]: Math.max(field === "units" ? 1 : 10, value) } }));

  const visibleFoods = PROTEIN_FOODS.filter(f => filter === "all" || f.tag === filter).filter(f => !isExcluded(f.name));

  return (
    <div>
      {showTerms && <TermsModal onClose={() => setShowTerms(false)} />}

      {/* ── BARRA DE META — siempre visible, sticky ── */}
      <div style={{ ...card, padding: 16, marginBottom: 14, background: "linear-gradient(135deg,rgba(16,185,129,0.1),rgba(16,185,129,0.03))", borderColor: `${statusColor}44`, position: "sticky", top: 0, zIndex: 10, backdropFilter: "blur(10px)" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 10 }}>
          <div>
            <div style={{ color: "rgba(255,255,255,0.5)", fontSize: 11, fontWeight: 700, letterSpacing: 0.8 }}>🎯 META DIARIA</div>
            <div style={{ display: "flex", alignItems: "baseline", gap: 6, marginTop: 2 }}>
              <span style={{ fontSize: 36, fontWeight: 900, color: statusColor, lineHeight: 1, transition: "color 0.3s" }}>{planProtein.toFixed(0)}</span>
              <span style={{ color: "rgba(255,255,255,0.4)", fontSize: 16 }}>/ {daily}g</span>
            </div>
          </div>
          <div style={{ textAlign: "right" }}>
            <div style={{ color: statusColor, fontWeight: 700, fontSize: 13, transition: "color 0.3s" }}>{statusLabel}</div>
            {!isOver && <div style={{ color: "rgba(255,255,255,0.35)", fontSize: 12, marginTop: 2 }}>Faltan {remaining.toFixed(0)}g</div>}
            {isOver && <div style={{ color: "#f59e0b", fontSize: 12, marginTop: 2 }}>+{(planProtein - daily).toFixed(0)}g sobre la meta</div>}
          </div>
        </div>

        {/* Barra de progreso */}
        <div style={{ height: 10, background: "rgba(255,255,255,0.08)", borderRadius: 99, overflow: "hidden", marginBottom: 10 }}>
          <div style={{ height: "100%", borderRadius: 99, width: `${Math.min(100, proteinPct)}%`, background: `linear-gradient(90deg, ${statusColor}, ${statusColor}99)`, transition: "width 0.4s ease, background 0.3s" }} />
        </div>

        {/* Macros totales del plan */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 6 }}>
          {[
            ["Proteína", planProtein.toFixed(0) + "g", "#10b981"],
            ["Calorías", Math.round(planTotals.cal) + "", "#f59e0b"],
            ["Grasas", planTotals.fat.toFixed(1) + "g", "#8b5cf6"],
            ["Carbos", planTotals.carbs.toFixed(1) + "g", "#06b6d4"],
          ].map(([l, v, c]) => (
            <div key={l} style={{ background: c + "10", borderRadius: 8, padding: "6px 4px", textAlign: "center", border: `1px solid ${c}20` }}>
              <div style={{ color: c, fontWeight: 800, fontSize: 13 }}>{v}</div>
              <div style={{ color: "rgba(255,255,255,0.3)", fontSize: 10 }}>{l}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ── TABS ── */}
      <div style={{ display: "flex", gap: 6, marginBottom: 14, background: "rgba(255,255,255,0.04)", borderRadius: 12, padding: 4 }}>
        {[["plan", `📋 Mi plan${planCount > 0 ? ` (${planCount})` : ""}`], ["browse", "🔍 Explorar"]].map(([id, label]) => (
          <button key={id} onClick={() => setTab(id)} style={{ flex: 1, padding: "10px 0", border: "none", borderRadius: 9, cursor: "pointer", background: tab === id ? (id === "plan" ? "#10b981" : "#e84a2e") : "transparent", color: tab === id ? "#fff" : "rgba(255,255,255,0.45)", fontWeight: 700, fontSize: 13, transition: "all 0.2s", fontFamily: "'DM Sans',sans-serif" }}>{label}</button>
        ))}
      </div>

      {/* ── TAB: MI PLAN ── */}
      {tab === "plan" && (
        <div>
          {/* Botón regenerar plan */}
          <button onClick={() => setMealPlan(generateSuggestedPlan(daily, excluded))} style={{ width: "100%", background: "rgba(16,185,129,0.1)", border: "1px solid rgba(16,185,129,0.3)", color: "#10b981", borderRadius: 12, padding: "11px 0", fontSize: 13, fontWeight: 700, cursor: "pointer", fontFamily: "'DM Sans',sans-serif", marginBottom: 14, display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
            ✨ Regenerar plan sugerido
          </button>

          {planCount === 0 ? (
            <div style={{ textAlign: "center", padding: "36px 20px" }}>
              <div style={{ fontSize: 48, marginBottom: 12 }}>🍽️</div>
              <p style={{ color: "rgba(255,255,255,0.4)", fontSize: 14, lineHeight: 1.7 }}>Tu plan está vacío. Explorá los alimentos o tocá "Regenerar plan sugerido".</p>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 14 }}>
              {Object.entries(mealPlan).map(([name, entry]) => {
                const food = PROTEIN_FOODS.find(f => f.name === name);
                if (!food) return null;
                const g = getFoodGrams(food, entry);
                const prot = ((food.per100g * g) / 100).toFixed(1);
                const cal = Math.round((food.cal100g * g) / 100);
                const pct = Math.min(100, (parseFloat(prot) / daily) * 100);
                const isUnit = food.unit === "unit";
                const currentUnits = entry.units || food.defaultUnits;
                const currentGrams = entry.grams || food.defaultGrams;

                return (
                  <div key={name} style={{ ...card, padding: "13px 16px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 10 }}>
                      <span style={{ fontSize: 26 }}>{food.emoji}</span>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontWeight: 700, fontSize: 14 }}>{food.name}</div>
                        <div style={{ color: "#10b981", fontWeight: 700, fontSize: 13, marginTop: 2 }}>
                          {prot}g proteína · {cal} kcal
                        </div>
                      </div>
                      <button onClick={() => removeFromMeal(name)} style={{ background: "rgba(232,74,46,0.1)", border: "1px solid rgba(232,74,46,0.25)", color: "#e84a2e", borderRadius: 8, width: 30, height: 30, cursor: "pointer", fontSize: 16, display: "flex", alignItems: "center", justifyContent: "center" }}>✕</button>
                    </div>

                    {/* Control según tipo: unidades o gramos */}
                    {isUnit ? (
                      <div>
                        <div style={{ color: "rgba(255,255,255,0.5)", fontSize: 12, marginBottom: 8 }}>
                          Cantidad · {g}g total
                        </div>
                        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                          <button onClick={() => updateMealEntry(name, "units", currentUnits - 1)} style={{ width: 36, height: 36, borderRadius: 10, background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.12)", color: "#fff", fontSize: 20, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>−</button>
                          <div style={{ flex: 1, textAlign: "center" }}>
                            <div style={{ color: "#fff", fontWeight: 900, fontSize: 24 }}>{currentUnits}</div>
                            <div style={{ color: "rgba(255,255,255,0.35)", fontSize: 11 }}>{food.unitName}{currentUnits !== 1 ? "s" : ""}</div>
                          </div>
                          <button onClick={() => updateMealEntry(name, "units", currentUnits + 1)} style={{ width: 36, height: 36, borderRadius: 10, background: "rgba(232,74,46,0.15)", border: "1px solid rgba(232,74,46,0.3)", color: "#e8a090", fontSize: 20, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>+</button>
                        </div>
                      </div>
                    ) : (
                      <div>
                        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, marginBottom: 5 }}>
                          <span style={{ color: "rgba(255,255,255,0.4)" }}>Porción: <strong style={{ color: "#fff" }}>{currentGrams}g</strong></span>
                          <span style={{ color: "rgba(255,255,255,0.3)", fontSize: 11 }}>{pct.toFixed(0)}% de tu meta</span>
                        </div>
                        <input type="range" min={50} max={400} step={10} value={currentGrams}
                          onChange={e => updateMealEntry(name, "grams", +e.target.value)}
                          style={{ width: "100%", accentColor: TAG_COLORS[food.tag] }} />
                        <div style={{ display: "flex", gap: 5, marginTop: 6 }}>
                          {[100, 150, 200, 250].map(preset => (
                            <button key={preset} onClick={() => updateMealEntry(name, "grams", preset)} style={{ flex: 1, background: currentGrams === preset ? TAG_COLORS[food.tag] + "33" : "rgba(255,255,255,0.04)", border: `1px solid ${currentGrams === preset ? TAG_COLORS[food.tag] + "66" : "rgba(255,255,255,0.08)"}`, borderRadius: 8, padding: "5px 0", color: currentGrams === preset ? TAG_COLORS[food.tag] : "rgba(255,255,255,0.35)", fontSize: 11, cursor: "pointer", fontFamily: "'DM Sans',sans-serif", fontWeight: 700 }}>
                              {preset}g
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Mini barra */}
                    <div style={{ height: 3, background: "rgba(255,255,255,0.06)", borderRadius: 99, marginTop: 10 }}>
                      <div style={{ height: "100%", borderRadius: 99, width: `${pct}%`, background: `linear-gradient(90deg,#10b981,#06b6d4)`, transition: "width 0.3s" }} />
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Alertas */}
          {remaining > 10 && planCount > 0 && (
            <div style={{ ...card, padding: 13, marginBottom: 10, background: "rgba(232,74,46,0.06)", borderColor: "rgba(232,74,46,0.2)" }}>
              <div style={{ color: "#e8a090", fontWeight: 700, fontSize: 13, marginBottom: 5 }}>💡 Faltan {remaining.toFixed(0)}g</div>
              <div style={{ color: "rgba(255,255,255,0.5)", fontSize: 12, lineHeight: 1.5 }}>
                Podés agregar: {Math.ceil(remaining / 31 * 100)}g de pollo ({(remaining / 31 * 100).toFixed(0)}g ≈ {((remaining / 31 * 100) / 150).toFixed(1)} porción), {Math.ceil(remaining / 13 / 0.5)}  huevos, o {Math.ceil(remaining / 10)} potes de yogurt griego.
              </div>
            </div>
          )}
          {isOver && (
            <div style={{ ...card, padding: 13, marginBottom: 10, background: "rgba(245,158,11,0.06)", borderColor: "rgba(245,158,11,0.2)" }}>
              <div style={{ color: "#f5d060", fontWeight: 700, fontSize: 13, marginBottom: 4 }}>⚠️ +{(planProtein - daily).toFixed(0)}g sobre la meta</div>
              <div style={{ color: "rgba(255,255,255,0.5)", fontSize: 12 }}>Un pequeño exceso de proteína no es perjudicial. Ajustá porciones si querés estar justo en la meta.</div>
            </div>
          )}

          {planCount > 0 && (
            <button onClick={() => setMealPlan({})} style={{ width: "100%", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.3)", borderRadius: 12, padding: "11px 0", fontSize: 13, cursor: "pointer", fontFamily: "'DM Sans',sans-serif" }}>
              🗑️ Limpiar plan
            </button>
          )}
        </div>
      )}

      {/* ── TAB: EXPLORAR ── */}
      {tab === "browse" && (
        <div>
          {/* Disclaimer */}
          <div style={{ ...card, padding: "10px 14px", marginBottom: 12, background: "rgba(245,158,11,0.06)", borderColor: "rgba(245,158,11,0.2)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 10 }}>
              <div style={{ color: "rgba(255,255,255,0.5)", fontSize: 12, flex: 1 }}>⚠️ <strong style={{ color: "#f5d060" }}>Información orientativa.</strong> No sustituye asesoramiento nutricional.</div>
              <button onClick={() => setShowTerms(true)} style={{ background: "rgba(245,158,11,0.15)", border: "1px solid rgba(245,158,11,0.3)", color: "#f5d060", borderRadius: 8, padding: "4px 10px", fontSize: 11, cursor: "pointer", fontFamily: "'DM Sans',sans-serif", fontWeight: 700 }}>T&C</button>
            </div>
          </div>

          {/* Preferencias */}
          <div style={{ marginBottom: 12 }}>
            <button onClick={() => setShowPrefs(p => !p)} style={{ width: "100%", background: showPrefs ? "rgba(139,92,246,0.12)" : "rgba(255,255,255,0.04)", border: `1px solid ${showPrefs ? "rgba(139,92,246,0.35)" : "rgba(255,255,255,0.08)"}`, borderRadius: 12, padding: "11px 16px", color: "#fff", cursor: "pointer", display: "flex", justifyContent: "space-between", alignItems: "center", fontFamily: "'DM Sans',sans-serif" }}>
              <span style={{ fontWeight: 600, fontSize: 13 }}>⚙️ Preferencias y alergias {excluded.length > 0 ? `· ${excluded.length} excluidos` : ""}</span>
              <span style={{ color: "#8b5cf6" }}>{showPrefs ? "▲" : "▼"}</span>
            </button>
            {showPrefs && (
              <div style={{ ...card, padding: 14, marginTop: 6, borderColor: "rgba(139,92,246,0.2)", background: "rgba(139,92,246,0.04)" }}>
                <div style={{ color: "#8b5cf6", fontSize: 11, fontWeight: 800, marginBottom: 8 }}>🚨 ALERGIAS</div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 12 }}>
                  {ALLERGY_OPTIONS.map(a => (
                    <button key={a.id} onClick={() => toggleAllergy(a.id)} style={{ background: allergies.includes(a.id) ? "rgba(232,74,46,0.2)" : "rgba(255,255,255,0.05)", border: `1px solid ${allergies.includes(a.id) ? "rgba(232,74,46,0.5)" : "rgba(255,255,255,0.1)"}`, borderRadius: 10, padding: "6px 12px", color: allergies.includes(a.id) ? "#e8a090" : "rgba(255,255,255,0.5)", cursor: "pointer", fontSize: 13, fontFamily: "'DM Sans',sans-serif" }}>
                      {a.emoji} {a.label} {allergies.includes(a.id) ? "✓" : ""}
                    </button>
                  ))}
                </div>
                <div style={{ color: "#8b5cf6", fontSize: 11, fontWeight: 800, marginBottom: 8 }}>👎 NO ME GUSTA</div>
                <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
                  {PROTEIN_FOODS.map(food => (
                    <div key={food.name} onClick={() => toggleExclude(food.name)} style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 12px", borderRadius: 9, cursor: "pointer", background: isExcluded(food.name) ? "rgba(232,74,46,0.07)" : "rgba(255,255,255,0.02)", border: `1px solid ${isExcluded(food.name) ? "rgba(232,74,46,0.25)" : "rgba(255,255,255,0.05)"}` }}>
                      <span style={{ fontSize: 18 }}>{food.emoji}</span>
                      <span style={{ color: isExcluded(food.name) ? "rgba(255,255,255,0.3)" : "#fff", fontSize: 13, flex: 1, textDecoration: isExcluded(food.name) ? "line-through" : "none" }}>{food.name}</span>
                      <div style={{ width: 18, height: 18, borderRadius: 5, background: isExcluded(food.name) ? "rgba(232,74,46,0.2)" : "transparent", border: `1.5px solid ${isExcluded(food.name) ? "#e84a2e" : "rgba(255,255,255,0.15)"}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, color: "#e84a2e" }}>
                        {isExcluded(food.name) && "✕"}
                      </div>
                    </div>
                  ))}
                </div>
                {excluded.length > 0 && <button onClick={() => { setExcluded([]); setAllergies([]); }} style={{ marginTop: 10, width: "100%", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 10, padding: "8px 0", color: "rgba(255,255,255,0.4)", cursor: "pointer", fontSize: 13, fontFamily: "'DM Sans',sans-serif" }}>↺ Restablecer</button>}
              </div>
            )}
          </div>

          {/* Filtros */}
          <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 12 }}>
            <button onClick={() => setFilter("all")} style={{ background: filter === "all" ? "#e84a2e" : "rgba(255,255,255,0.06)", color: filter === "all" ? "#fff" : "rgba(255,255,255,0.5)", border: "none", borderRadius: 99, padding: "5px 12px", fontSize: 12, fontWeight: 700, cursor: "pointer", fontFamily: "'DM Sans',sans-serif" }}>Todos</button>
            {Object.entries(TAG_LABELS).map(([tag, label]) => (
              <button key={tag} onClick={() => setFilter(tag)} style={{ background: filter === tag ? TAG_COLORS[tag] : "rgba(255,255,255,0.06)", color: filter === tag ? "#fff" : "rgba(255,255,255,0.5)", border: "none", borderRadius: 99, padding: "5px 12px", fontSize: 12, fontWeight: 700, cursor: "pointer", fontFamily: "'DM Sans',sans-serif" }}>{label}</button>
            ))}
          </div>

          {/* Food cards */}
          <div style={{ display: "flex", flexDirection: "column", gap: 9 }}>
            {visibleFoods.map(food => {
              const isUnit = food.unit === "unit";
              const units = browseUnits[food.name] || food.defaultUnits;
              const grams = browseGrams[food.name] || food.defaultGrams;
              const g = isUnit ? units * food.unitGrams : grams;
              const prot = ((food.per100g * g) / 100).toFixed(1);
              const cal = Math.round((food.cal100g * g) / 100);
              const inPlan = !!mealPlan[food.name];
              const newTotal = planProtein + parseFloat(prot);
              const newPct = Math.min(100, (newTotal / daily) * 100);

              return (
                <div key={food.name} style={{ ...card, padding: "13px 16px", borderColor: inPlan ? TAG_COLORS[food.tag] + "44" : "rgba(255,255,255,0.08)", background: inPlan ? TAG_COLORS[food.tag] + "08" : "rgba(255,255,255,0.03)" }}>
                  <div style={{ display: "flex", alignItems: "flex-start", gap: 12, marginBottom: 10 }}>
                    <div style={{ fontSize: 26 }}>{food.emoji}</div>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
                        <span style={{ fontWeight: 800, fontSize: 14 }}>{food.name}</span>
                        <span style={{ background: TAG_COLORS[food.tag] + "22", color: TAG_COLORS[food.tag], border: `1px solid ${TAG_COLORS[food.tag]}44`, borderRadius: 99, padding: "2px 8px", fontSize: 11, fontWeight: 700 }}>{TAG_LABELS[food.tag]}</span>
                        {inPlan && <span style={{ background: "#10b98122", color: "#10b981", border: "1px solid #10b98144", borderRadius: 99, padding: "2px 8px", fontSize: 11, fontWeight: 700 }}>✓ En plan</span>}
                      </div>
                      <div style={{ color: "rgba(255,255,255,0.4)", fontSize: 12, marginTop: 2 }}>{food.desc}</div>
                    </div>
                    <button onClick={() => toggleExclude(food.name)} style={{ background: "none", border: "none", color: "rgba(255,255,255,0.2)", cursor: "pointer", fontSize: 16 }}>✕</button>
                  </div>

                  {/* Macros */}
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 5, marginBottom: 10 }}>
                    {[["Proteína", prot + "g", "#10b981"], ["Calorías", cal + "", "#f59e0b"], ["Grasas", ((food.fat * g) / 100).toFixed(1) + "g", "#8b5cf6"], ["Carbos", ((food.carbs * g) / 100).toFixed(1) + "g", "#06b6d4"]].map(([l, v, c]) => (
                      <div key={l} style={{ background: c + "10", borderRadius: 8, padding: "6px 4px", textAlign: "center", border: `1px solid ${c}20` }}>
                        <div style={{ color: c, fontWeight: 800, fontSize: 13 }}>{v}</div>
                        <div style={{ color: "rgba(255,255,255,0.3)", fontSize: 10 }}>{l}</div>
                      </div>
                    ))}
                  </div>

                  {/* Control porción — unidades o gramos */}
                  {isUnit ? (
                    <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 10 }}>
                      <button onClick={() => setBrowseUnits(b => ({ ...b, [food.name]: Math.max(1, units - 1) }))} style={{ width: 34, height: 34, borderRadius: 10, background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.12)", color: "#fff", fontSize: 18, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>−</button>
                      <div style={{ flex: 1, textAlign: "center" }}>
                        <span style={{ color: "#fff", fontWeight: 900, fontSize: 20 }}>{units}</span>
                        <span style={{ color: "rgba(255,255,255,0.4)", fontSize: 13, marginLeft: 6 }}>{food.unitName}{units !== 1 ? "s" : ""}</span>
                        <div style={{ color: "rgba(255,255,255,0.25)", fontSize: 11 }}>{g}g total</div>
                      </div>
                      <button onClick={() => setBrowseUnits(b => ({ ...b, [food.name]: units + 1 }))} style={{ width: 34, height: 34, borderRadius: 10, background: "rgba(232,74,46,0.15)", border: "1px solid rgba(232,74,46,0.3)", color: "#e8a090", fontSize: 18, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>+</button>
                    </div>
                  ) : (
                    <div style={{ marginBottom: 10 }}>
                      <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, marginBottom: 4 }}>
                        <span style={{ color: "rgba(255,255,255,0.4)" }}>Porción: <strong style={{ color: "#fff" }}>{grams}g</strong></span>
                      </div>
                      <input type="range" min={50} max={400} step={10} value={grams}
                        onChange={e => setBrowseGrams(b => ({ ...b, [food.name]: +e.target.value }))}
                        style={{ width: "100%", accentColor: TAG_COLORS[food.tag] }} />
                    </div>
                  )}

                  {/* Impacto */}
                  <div style={{ padding: "7px 10px", background: "rgba(255,255,255,0.03)", borderRadius: 9, marginBottom: 10 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12 }}>
                      <span style={{ color: "rgba(255,255,255,0.4)" }}>Si lo agregás → <strong style={{ color: newTotal > daily ? "#f59e0b" : "#10b981" }}>{newTotal.toFixed(0)}g prot.</strong></span>
                      <span style={{ color: newTotal > daily ? "#f59e0b" : "#10b981", fontSize: 11, fontWeight: 700 }}>{newPct.toFixed(0)}% de meta</span>
                    </div>
                  </div>

                  <button onClick={() => { addToMeal(food); setTab("plan"); }} style={{ width: "100%", border: "none", borderRadius: 11, padding: "11px 0", fontWeight: 700, fontSize: 14, cursor: "pointer", fontFamily: "'DM Sans',sans-serif", background: inPlan ? "rgba(16,185,129,0.15)" : `linear-gradient(135deg,${TAG_COLORS[food.tag]},${TAG_COLORS[food.tag]}cc)`, color: inPlan ? "#10b981" : "#fff" }}>
                    {inPlan ? `+ Agregar ${isUnit ? `${units} ${food.unitName}${units !== 1 ? "s" : ""} más` : `${grams}g más`}` : `+ Agregar al plan`}
                  </button>
                </div>
              );
            })}
          </div>
          <div style={{ marginTop: 18, textAlign: "center" }}>
            <button onClick={() => setShowTerms(true)} style={{ background: "none", border: "none", color: "rgba(255,255,255,0.2)", cursor: "pointer", fontSize: 12, fontFamily: "'DM Sans',sans-serif", textDecoration: "underline" }}>Ver Términos y Condiciones</button>
          </div>
        </div>
      )}
    </div>
  );
}







// ─── MEDICAL FILES ────────────────────────────────────────────────────────────
function MedicalFiles({ user, isPremium, onUpgrade }) {
  const [files, setFiles] = useState([]);
  const [analyzing, setAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState(null);
  const [currentFile, setCurrentFile] = useState(null);
  const [error, setError] = useState("");
  const [medTab, setMedTab] = useState("analysis"); // analysis | consulta
  const [consultaList, setConsultaList] = useState(null);
  const [loadingConsulta, setLoadingConsulta] = useState(false);
  const fileRef = useRef();

  const { daily } = calcProtein(user);
  const sexLabel = user.sex === "female" ? "Mujer" : user.sex === "male" ? "Hombre" : "No especificado";
  const goalInfo = GOALS.find(g => g.id === user.goal);

  async function generateConsulta() {
    setLoadingConsulta(true);
    const prompt = `Sos un médico deportólogo. Generá una lista de análisis de laboratorio recomendados para una persona con este perfil que hace ejercicio de forma regular.

PERFIL: ${user.nombre}, ${user.age} años, ${user.weight}kg, ${user.height}cm, Sexo: ${sexLabel}
OBJETIVO FITNESS: ${goalInfo?.label}
NIVEL: ${user.experience === "beginner" ? "Principiante" : user.experience === "intermediate" ? "Intermedio" : "Avanzado"}
DÍAS DE ENTRENAMIENTO: ${user.daysPerWeek} días/semana
META PROTEÍNA: ${daily}g/día

Considerá el sexo, edad y objetivo para priorizar los análisis más relevantes.
Para ${user.sex === "female" ? "mujeres incluí ferritina (mayor riesgo anemia por menstruación), hormonas femeninas si corresponde por la edad" : "hombres incluí testosterona total y libre, PSA si es mayor de 40"}.

SOLO JSON sin backticks ni texto extra:
{
  "prioritarios": [
    {"nombre": "string", "codigo": "string", "motivo": "por qué es clave para fitness (1-2 frases)", "impacto": "qué pasa si está bajo/alto", "frecuencia": "cada cuánto hacerlo"}
  ],
  "complementarios": [
    {"nombre": "string", "codigo": "string", "motivo": "string", "frecuencia": "string"}
  ],
  "nota": "nota final para el médico (1 frase)"
}`;

    try {
      const r = await fetch("/.netlify/functions/ai", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ model: "claude-sonnet-4-20250514", max_tokens: 1500, messages: [{ role: "user", content: prompt }] })
      });
      const d = await r.json();
      const text = d.content?.find(b => b.type === "text")?.text || "";
      const parsed = JSON.parse(text.replace(/```json|```/g, "").trim());
      setConsultaList(parsed);
    } catch {
      setConsultaList({
        prioritarios: [
          { nombre: "Hemograma completo", codigo: "CBC", motivo: "Base de toda evaluación. Detecta anemia, infecciones y estado general.", impacto: "Anemia = fatiga, bajo rendimiento en el gym.", frecuencia: "Cada 6 meses" },
          { nombre: "Ferritina + Hierro sérico", codigo: "FERR", motivo: "La ferritina baja es la causa más común de fatiga en atletas.", impacto: "Bajo = agotamiento crónico, poca recuperación.", frecuencia: "Cada 6 meses" },
          { nombre: "Vitamina D (25-OH)", codigo: "VIT-D", motivo: "Deficiencia muy común. Afecta fuerza, inmunidad y recuperación muscular.", impacto: "Bajo = más lesiones, recuperación lenta.", frecuencia: "1 vez al año" },
          { nombre: "Glucosa en ayunas", codigo: "GLU", motivo: "Detecta resistencia a la insulina antes de que sea diabetes.", impacto: "Alta = dificulta pérdida de grasa.", frecuencia: "Cada año" },
          { nombre: "Perfil lipídico completo", codigo: "LIPID", motivo: "Colesterol HDL/LDL/Triglicéridos. El ejercicio los mejora pero hay que tener base.", impacto: "Alterado = riesgo cardiovascular.", frecuencia: "Cada año" },
        ],
        complementarios: [
          { nombre: user.sex !== "female" ? "Testosterona total y libre" : "Estradiol + FSH + LH", codigo: "HORM", motivo: "Hormonas clave para masa muscular y recuperación.", frecuencia: "1 vez al año" },
          { nombre: "TSH (Tiroides)", codigo: "TSH", motivo: "Tiroides lenta = metabolismo lento, fatiga.", frecuencia: "Cada año" },
          { nombre: "Vitamina B12", codigo: "B12", motivo: "Esencial para energía y función nerviosa.", frecuencia: "Cada año" },
          { nombre: "Magnesio sérico", codigo: "MG", motivo: "Deficiencia afecta el rendimiento muscular y el sueño.", frecuencia: "Cada año" },
        ],
        nota: "Mostrá esta lista a tu médico y pedí que la adapte a tu historial clínico."
      });
    }
    setLoadingConsulta(false);
  }

  async function handleFileSelect(e) {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > 10 * 1024 * 1024) { setError("El archivo no puede superar 10 MB"); return; }
    setError("");
    const reader = new FileReader();
    reader.onload = ev => {
      const entry = { id: Date.now(), name: file.name, type: file.type, size: (file.size / 1024).toFixed(0) + " KB", date: new Date().toLocaleDateString("es-ES"), data: ev.target.result, analysis: null };
      setFiles(f => [entry, ...f]);
      setCurrentFile(entry);
      setAnalysis(null);
    };
    reader.readAsDataURL(file);
    e.target.value = "";
  }

  async function analyzeFile(fileEntry) {
    if (!isPremium) return;
    setCurrentFile(fileEntry); setAnalyzing(true); setAnalysis(null); setError("");
    try {
      const isImage = fileEntry.type.startsWith("image/");
      const base64 = fileEntry.data.split(",")[1];
      const ctx = `Paciente: ${user.nombre}, ${user.age}a, ${user.weight}kg, Sexo: ${sexLabel}. Objetivo: ${goalInfo?.label}. Meta proteína: ${daily}g/día.`;
      const messages = [{
        role: "user",
        content: [
          ...(isImage ? [{ type: "image", source: { type: "base64", media_type: fileEntry.type, data: base64 } }] : [{ type: "document", source: { type: "base64", media_type: "application/pdf", data: base64 } }]),
          { type: "text", text: `Analizá este informe médico. ${ctx}\n\nUsá los rangos de referencia correctos para ${sexLabel}.\n\nProporcioná:\n1. 📋 RESUMEN: Qué tipo de análisis es\n2. 🔬 VALORES CLAVE: Indicá NORMAL ✅, BAJO ⚠️ o ALTO 🔴 con rango de referencia para ${sexLabel}.\n3. 💪 IMPACTO FITNESS: Cómo afectan el entrenamiento y recuperación\n4. 🥗 NUTRICIÓN: Ajustes a la dieta según los valores\n5. ⚠️ ALERTAS: Valores que requieran atención médica\n\n⚕️ Advertí que esto no reemplaza consulta médica.` }
        ]
      }];
      const res = await fetch("/.netlify/functions/ai", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ model: "claude-sonnet-4-20250514", max_tokens: 1500, messages }) });
      const data = await res.json();
      const text = data.content?.find(b => b.type === "text")?.text || "No se pudo analizar.";
      setFiles(f => f.map(fi => fi.id === fileEntry.id ? { ...fi, analysis: text } : fi));
      setAnalysis(text);
    } catch { setError("Error al analizar. Verificá tu conexión."); }
    setAnalyzing(false);
  }

  if (!isPremium) return (
    <div style={{ textAlign: "center", padding: "32px 20px" }}>
      <div style={{ fontSize: 52, marginBottom: 14 }}>🔒</div>
      <h3 style={{ color: "#fff", margin: "0 0 10px", fontSize: 18 }}>Función Premium</h3>
      <p style={{ color: "rgba(255,255,255,0.5)", fontSize: 14, lineHeight: 1.7, marginBottom: 20 }}>El análisis de informes médicos con IA está disponible en los planes de pago.</p>
      <div style={{ ...card, padding: 16, marginBottom: 20, textAlign: "left" }}>
        {["Hemogramas y análisis de sangre completos", "Perfiles lipídicos y glucosa", "Vitaminas D, B12, hierro, ferritina", "Valores hormonales (testosterona, etc.)", "Recomendaciones de entrenamiento basadas en análisis", "Lista personalizada de análisis para tu próxima consulta"].map(f => <div key={f} style={{ display: "flex", gap: 10, marginBottom: 8 }}><span style={{ color: "#8b5cf6" }}>✓</span><span style={{ color: "rgba(255,255,255,0.6)", fontSize: 13 }}>{f}</span></div>)}
      </div>
      <Btn variant="purple" onClick={onUpgrade} style={{ width: "100%" }}>⭐ Ver planes de suscripción</Btn>
    </div>
  );

  return (
    <div>
      {/* Tabs médico */}
      <div style={{ display: "flex", gap: 6, marginBottom: 16, background: "rgba(255,255,255,0.04)", borderRadius: 12, padding: 4 }}>
        {[["analysis", "🧪 Mis análisis"], ["consulta", "🩺 Preparar consulta"]].map(([id, label]) => (
          <button key={id} onClick={() => setMedTab(id)} style={{ flex: 1, padding: "10px 0", border: "none", borderRadius: 9, cursor: "pointer", background: medTab === id ? "#8b5cf6" : "transparent", color: medTab === id ? "#fff" : "rgba(255,255,255,0.45)", fontWeight: 700, fontSize: 13, fontFamily: "'DM Sans',sans-serif", transition: "all 0.2s" }}>{label}</button>
        ))}
      </div>

      {/* ── TAB: ANÁLISIS ── */}
      {medTab === "analysis" && (
        <div>
          <div onClick={() => fileRef.current.click()} style={{ ...card, padding: 22, marginBottom: 14, textAlign: "center", cursor: "pointer", borderStyle: "dashed", borderColor: "rgba(139,92,246,0.4)", background: "rgba(139,92,246,0.05)" }}>
            <input ref={fileRef} type="file" accept=".pdf,.jpg,.jpeg,.png,.webp" style={{ display: "none" }} onChange={handleFileSelect} />
            <div style={{ fontSize: 36, marginBottom: 8 }}>📋</div>
            <div style={{ color: "#fff", fontWeight: 700, fontSize: 15, marginBottom: 6 }}>Subir análisis o informe médico</div>
            <div style={{ color: "rgba(255,255,255,0.4)", fontSize: 13 }}>PDF, JPG, PNG · Máx 10 MB</div>
            <div style={{ display: "flex", gap: 6, justifyContent: "center", flexWrap: "wrap", marginTop: 12 }}>
              {["🩸 Hemograma", "🧪 Análisis", "📄 Informe"].map(t => <Pill key={t} color="#8b5cf6">{t}</Pill>)}
            </div>
          </div>

          <div style={{ ...card, padding: "10px 14px", marginBottom: 14, background: "rgba(245,158,11,0.06)", borderColor: "rgba(245,158,11,0.2)" }}>
            <div style={{ color: "#f5d060", fontSize: 12 }}>⚠️ Análisis orientativo — <strong>no reemplaza la consulta médica</strong>. Rangos ajustados para <strong>{sexLabel}</strong>.</div>
          </div>

          {error && <div style={{ padding: "10px 13px", background: "rgba(232,74,46,0.1)", border: "1px solid rgba(232,74,46,0.3)", borderRadius: 10, color: "#e8a090", fontSize: 13, marginBottom: 12 }}>⚠️ {error}</div>}

          {files.length > 0 && (
            <div style={{ marginBottom: 14 }}>
              <div style={{ color: "rgba(255,255,255,0.35)", fontSize: 11, fontWeight: 800, marginBottom: 8 }}>ARCHIVOS ({files.length})</div>
              {files.map(f => (
                <div key={f.id} style={{ ...card, padding: "12px 14px", marginBottom: 8, borderColor: currentFile?.id === f.id ? "#8b5cf644" : "rgba(255,255,255,0.08)" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
                    <div style={{ fontSize: 22 }}>{f.type === "application/pdf" ? "📄" : "🖼️"}</div>
                    <div style={{ flex: 1 }}>
                      <div style={{ color: "#fff", fontWeight: 600, fontSize: 13, wordBreak: "break-word" }}>{f.name}</div>
                      <div style={{ color: "rgba(255,255,255,0.3)", fontSize: 11 }}>{f.size} · {f.date}</div>
                    </div>
                    {f.analysis && <Pill color="#10b981">✓</Pill>}
                  </div>
                  <Btn onClick={() => analyzeFile(f)} loading={analyzing && currentFile?.id === f.id} variant={f.analysis ? "ghost" : "purple"} style={{ width: "100%", fontSize: 13, padding: "10px" }}>
                    {analyzing && currentFile?.id === f.id ? "Analizando..." : f.analysis ? "🔄 Re-analizar" : "🤖 Analizar con IA"}
                  </Btn>
                </div>
              ))}
            </div>
          )}

          {analyzing && <div style={{ ...card, padding: 24, textAlign: "center" }}><div style={{ width: 36, height: 36, border: "3px solid rgba(139,92,246,0.2)", borderTopColor: "#8b5cf6", borderRadius: "50%", animation: "spin 0.8s linear infinite", margin: "0 auto 12px" }} /><div style={{ color: "#fff", fontWeight: 700 }}>Analizando tu informe...</div><div style={{ color: "rgba(255,255,255,0.4)", fontSize: 13 }}>Rangos ajustados para {sexLabel}</div></div>}

          {analysis && !analyzing && (
            <div style={{ ...card, padding: 18, borderColor: "rgba(139,92,246,0.25)", background: "rgba(139,92,246,0.04)" }}>
              <div style={{ color: "#8b5cf6", fontSize: 11, fontWeight: 800, marginBottom: 12 }}>🤖 ANÁLISIS — {currentFile?.name}</div>
              <div style={{ color: "rgba(255,255,255,0.8)", fontSize: 13, lineHeight: 1.8, whiteSpace: "pre-wrap" }}>{analysis}</div>
            </div>
          )}

          {files.length === 0 && !analyzing && <div style={{ textAlign: "center", padding: "20px 0", color: "rgba(255,255,255,0.25)", fontSize: 13 }}>Subí tu primer análisis médico para comenzar</div>}
        </div>
      )}

      {/* ── TAB: PREPARAR CONSULTA ── */}
      {medTab === "consulta" && (
        <div>
          <div style={{ ...card, padding: 16, marginBottom: 14, background: "rgba(139,92,246,0.07)", borderColor: "rgba(139,92,246,0.25)" }}>
            <div style={{ color: "#8b5cf6", fontSize: 11, fontWeight: 800, letterSpacing: 0.8, marginBottom: 8 }}>🩺 ANÁLISIS RECOMENDADOS PARA TU PERFIL</div>
            <div style={{ color: "rgba(255,255,255,0.55)", fontSize: 13, lineHeight: 1.6, marginBottom: 12 }}>
              Basado en tu perfil ({sexLabel}, {user.age} años, objetivo: {goalInfo?.label}), la IA genera la lista de análisis que más importan para tu rendimiento y salud.
            </div>
            {!consultaList && (
              <Btn onClick={generateConsulta} loading={loadingConsulta} variant="purple" style={{ width: "100%" }}>
                {loadingConsulta ? "Generando lista..." : "✨ Generar lista personalizada"}
              </Btn>
            )}
          </div>

          {loadingConsulta && (
            <div style={{ ...card, padding: 24, textAlign: "center" }}>
              <div style={{ width: 36, height: 36, border: "3px solid rgba(139,92,246,0.2)", borderTopColor: "#8b5cf6", borderRadius: "50%", animation: "spin 0.8s linear infinite", margin: "0 auto 12px" }} />
              <div style={{ color: "#fff", fontWeight: 700 }}>Preparando tu lista...</div>
              <div style={{ color: "rgba(255,255,255,0.4)", fontSize: 13 }}>Personalizando según tu perfil</div>
            </div>
          )}

          {consultaList && !loadingConsulta && (
            <div>
              {/* Prioritarios */}
              <div style={{ color: "#e84a2e", fontSize: 11, fontWeight: 800, letterSpacing: 0.8, marginBottom: 10 }}>⭐ ANÁLISIS PRIORITARIOS</div>
              <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 18 }}>
                {consultaList.prioritarios?.map((a, i) => (
                  <div key={i} style={{ ...card, padding: "14px 16px" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 }}>
                      <div style={{ fontWeight: 700, fontSize: 15, flex: 1, paddingRight: 8 }}>{a.nombre}</div>
                      <div style={{ background: "rgba(232,74,46,0.12)", border: "1px solid rgba(232,74,46,0.25)", color: "#e8a090", borderRadius: 8, padding: "3px 10px", fontSize: 11, fontWeight: 700, flexShrink: 0 }}>{a.codigo}</div>
                    </div>
                    <div style={{ color: "rgba(255,255,255,0.6)", fontSize: 13, lineHeight: 1.5, marginBottom: 6 }}>{a.motivo}</div>
                    {a.impacto && <div style={{ color: "#f59e0b", fontSize: 12, marginBottom: 6 }}>⚠️ {a.impacto}</div>}
                    <div style={{ color: "rgba(255,255,255,0.3)", fontSize: 11 }}>🔁 {a.frecuencia}</div>
                  </div>
                ))}
              </div>

              {/* Complementarios */}
              <div style={{ color: "#8b5cf6", fontSize: 11, fontWeight: 800, letterSpacing: 0.8, marginBottom: 10 }}>📋 COMPLEMENTARIOS</div>
              <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 16 }}>
                {consultaList.complementarios?.map((a, i) => (
                  <div key={i} style={{ ...card, padding: "12px 14px" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4 }}>
                      <div style={{ fontWeight: 600, fontSize: 14 }}>{a.nombre}</div>
                      <div style={{ background: "rgba(139,92,246,0.12)", border: "1px solid rgba(139,92,246,0.25)", color: "#a78bfa", borderRadius: 8, padding: "2px 8px", fontSize: 11, fontWeight: 700 }}>{a.codigo}</div>
                    </div>
                    <div style={{ color: "rgba(255,255,255,0.5)", fontSize: 12, marginBottom: 4 }}>{a.motivo}</div>
                    <div style={{ color: "rgba(255,255,255,0.3)", fontSize: 11 }}>🔁 {a.frecuencia}</div>
                  </div>
                ))}
              </div>

              {/* Nota para el médico */}
              {consultaList.nota && (
                <div style={{ ...card, padding: "12px 14px", background: "rgba(6,182,212,0.06)", borderColor: "rgba(6,182,212,0.2)", marginBottom: 14 }}>
                  <div style={{ color: "#06b6d4", fontSize: 11, fontWeight: 800, marginBottom: 5 }}>💬 NOTA PARA TU MÉDICO</div>
                  <div style={{ color: "rgba(255,255,255,0.6)", fontSize: 13, lineHeight: 1.5 }}>{consultaList.nota}</div>
                </div>
              )}

              <div style={{ ...card, padding: "11px 14px", background: "rgba(245,158,11,0.06)", borderColor: "rgba(245,158,11,0.2)", marginBottom: 14 }}>
                <div style={{ color: "rgba(255,255,255,0.5)", fontSize: 12, lineHeight: 1.5 }}>⚠️ Esta lista es orientativa. Tu médico decidirá cuáles solicitar según tu historial clínico.</div>
              </div>

              <Btn onClick={() => { setConsultaList(null); generateConsulta(); }} variant="ghost" style={{ width: "100%" }}>🔄 Regenerar lista</Btn>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ─── MAIN APP ─────────────────────────────────────────────────────────────────
function MainApp({ user, suscripcion, onLogout, onUpgradePlan }) {
  const [tab, setTab] = useState("home");
  const [routine, setRoutine] = useState(null);
  const [loading, setLoading] = useState(false);
  const [tip, setTip] = useState(null);
const [history, setHistory] = useState([]);
useEffect(() => {
  const userId = user.id || user._supabaseUser?.id;
  if (userId) {
    supabaseCall("getRutinas", { user_id: userId }).then(res => {
      if (res.rutinas) {
        setHistory(res.rutinas.map(r => ({
          date: r.fecha,
          focus: r.nombre,
          muscles: r.grupo_muscular ? [r.grupo_muscular] : [],
          completed: r.ejercicios,
          total: r.ejercicios
        })));
      }
    }).catch(() => {});
  }
}, []);
  const [done, setDone] = useState({});
  const [showFinish, setShowFinish] = useState(false);
  const [selectedMachine, setSelectedMachine] = useState(null);
  const [upgradeCheckout, setUpgradeCheckout] = useState(null);
  // Timer state
  const [timer, setTimer] = useState(null);
  // Substitution state
  const [substituting, setSubstituting] = useState(null);
  // Alternatives panel — { [exIndex]: [{machine,muscle,sets,reps,rest,tip,weight_suggestion}] | "loading" | null }
  const [alternatives, setAlternatives] = useState({});

  const goalInfo = GOALS.find(g => g.id === user.goal);
  const bodyInfo = BODY_TYPES.find(b => b.id === user.bodyType);
  const planInfo = PLANES.find(p => p.id === suscripcion.plan.id);
  const isPremium = !suscripcion.plan.trial;
  const { daily } = calcProtein(user);
  const trialDaysLeft = suscripcion.trialExpiry ? Math.max(0, Math.ceil((suscripcion.trialExpiry - Date.now()) / (1000 * 60 * 60 * 24))) : null;
  const dayName = ["Dom","Lun","Mar","Mié","Jue","Vie","Sáb"][new Date().getDay()];
  const greeting = new Date().getHours() < 12 ? "Buenos días" : new Date().getHours() < 19 ? "Buenas tardes" : "Buenas noches";
  const doneCount = Object.values(done).filter(Boolean).length;
  const totalEx = routine?.exercises?.length || 0;
  const tipColor = { "Nutrición": "#f59e0b", "Técnica": "#8b5cf6", "Recuperación": "#10b981", "Motivación": "#e84a2e" };

  useEffect(() => { generateRoutine(); }, []);

  async function generateRoutine() {
    setLoading(true); setDone({});
    const equipment = ALL_EQUIPMENT.filter(m => user.machines.includes(m.id));
    const warmupExtras = WARMUP_EXTRAS.filter(e => user.machines.includes(e.id));
    const finisherExtras = FINISHER_OPTIONS.filter(e => user.machines.includes(e.id));
    const hist = history.slice(-3).map(h => h.muscles.join(", ")).join(" | ") || "Sin historial";

    const warmupHint = warmupExtras.length > 0
      ? `Calentamiento disponible: ${warmupExtras.map(e => e.name).join(", ")}.`
      : "Calentamiento genérico 5-8 min.";
    const finisherHint = finisherExtras.length > 0
      ? `Opciones de cierre: ${finisherExtras.map(e => e.name).join(", ")}. Elegí UNO.`
      : "Cierre con estiramientos.";

    // Estimación de fuerza base según peso corporal y experiencia
    const expFactor = user.experience === "beginner" ? 0.4 : user.experience === "intermediate" ? 0.6 : 0.8;
    const baseStrength = Math.round(parseFloat(user.weight) * expFactor);

    const sexLabel = user.sex === "female" ? "Mujer" : user.sex === "male" ? "Hombre" : "No especificado";
    const prompt = `Sos un entrenador personal experto. Generá la rutina del día.
PERFIL: ${user.nombre}, ${user.age}a, ${user.weight}kg, ${sexLabel}. CUERPO: ${bodyInfo?.sublabel} | OBJETIVO: ${goalInfo?.label} | EXP: ${user.experience} | DÍAS/SEM: ${user.daysPerWeek}
META PROTEÍNA: ${daily}g/día | HISTORIAL RECIENTE: ${hist}
EQUIPAMIENTO DISPONIBLE: ${equipment.map(m => m.name).join(", ")}
FUERZA BASE ESTIMADA: ${baseStrength}kg (ajustá según el músculo y ejercicio)
${warmupHint}
${finisherHint}
INSTRUCCIONES:
- Elegí 4-6 ejercicios variando grupos musculares según historial
- ${user.sex === "female" ? "Para mujer: enfatizá glúteos, isquiotibiales y core. Incluí trabajo de tren inferior en cada sesión si el objetivo lo permite." : "Para hombre: equilibrá tren superior e inferior según el historial."}
- Adaptá series/reps al objetivo
- weight_suggestion DEBE ser un rango en kg concreto ej: "20-25 kg" o "15 kg" — NUNCA porcentajes. Estimá según fuerza base y músculo trabajado.
- Para peso corporal escribí "Peso corporal"
- El tip diario debe incluir gramos de proteína
SOLO JSON sin backticks:
{"dayFocus":"string","warmup":"descripción específica","exercises":[{"machine":"nombre","muscle":"músculo","sets":3,"reps":"8-12","rest":"60 seg","weight_suggestion":"20-25 kg","tip":""}],"finisher":{"name":"","desc":""},"cooldown":"string","duration":"string","musclesWorked":[""],"dailyTip":{"category":"Nutrición|Técnica|Recuperación|Motivación","title":"","content":""},"caloriesBurned":"","intensity":""}`;
    try {
      const r = await fetch("/.netlify/functions/ai", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ model: "claude-sonnet-4-20250514", max_tokens: 1200, messages: [{ role: "user", content: prompt }] }) });
      const d = await r.json();
      const t = d.content?.find(b => b.type === "text")?.text || "";
      const p = JSON.parse(t.replace(/```json|```/g, "").trim());
      setRoutine(p); setTip(p.dailyTip);
    } catch {
      const fb = {
        dayFocus: "Tren Superior - Pecho y Espalda",
        warmup: "Rotaciones con banda elástica 5 min + movilidad de hombros y cadera.",
        exercises: [
          { machine: "Chest Press (máquina)", muscle: "Pectoral", sets: 3, reps: "10-12", rest: "60 seg", weight_suggestion: "30-40 kg", tip: "Codos a 45°, exhala al empujar." },
          { machine: "Jalón al Pecho (máquina)", muscle: "Dorsal", sets: 3, reps: "8-10", rest: "60 seg", weight_suggestion: "35-45 kg", tip: "Jalá hacia el pecho, no atrás." },
          { machine: "Pec Fly / Mariposa (máquina)", muscle: "Pectoral", sets: 3, reps: "12-15", rest: "45 seg", weight_suggestion: "20-30 kg", tip: "Arco controlado, sin rebotes." },
          { machine: "Remo Sentado (máquina)", muscle: "Espalda Media", sets: 3, reps: "10-12", rest: "60 seg", weight_suggestion: "30-40 kg", tip: "Aprieta omóplatos al final." }
        ],
        finisher: { name: "Circuito abdominal de cierre", desc: "3 rondas: 20 crunches + 30 seg plancha + 15 elevaciones de piernas. Sin descanso entre ejercicios." },
        cooldown: "Estiramientos de pecho y dorsal 5 min.",
        duration: "50-60 min",
        musclesWorked: ["Pectoral", "Dorsal", "Espalda Media"],
        dailyTip: { category: "Nutrición", title: `Meta: ${daily}g de proteína hoy`, content: `Repartí ${daily}g en 4 comidas: desayuno ${Math.round(daily*0.25)}g, almuerzo ${Math.round(daily*0.3)}g, merienda ${Math.round(daily*0.15)}g, cena ${Math.round(daily*0.3)}g.` },
        caloriesBurned: "300-380", intensity: "Moderada"
      };
      setRoutine(fb); setTip(fb.dailyTip);
    }
    setLoading(false);
  }

  // ── Cargar alternativas para un ejercicio ─────────────────────────────────
  async function loadAlternatives(index, forceReload = false) {
    // Si ya están cargadas y no forzamos recarga, toggle — las oculta
    if (!forceReload && alternatives[index] && alternatives[index] !== "loading") {
      setAlternatives(a => ({ ...a, [index]: null }));
      return;
    }
    setAlternatives(a => ({ ...a, [index]: "loading" }));
    setSubstituting(index);

    const ex = routine.exercises[index];
    const equipment = ALL_EQUIPMENT.filter(m => user.machines.includes(m.id));
    const usedMachines = routine.exercises.map(e => e.machine);

    const expFactor = user.experience === "beginner" ? 0.4 : user.experience === "intermediate" ? 0.6 : 0.8;
    const baseStrength = Math.round(parseFloat(user.weight) * expFactor);

    const prompt = `El usuario quiere alternativas para "${ex.machine}" (músculo: ${ex.muscle}).
Equipamiento disponible: ${equipment.map(m => m.name).join(", ")}.
Ejercicios ya en la rutina (no repetir): ${usedMachines.join(", ")}.
Objetivo: ${goalInfo?.label}. Series originales: ${ex.sets}. Reps: ${ex.reps}.
Fuerza base estimada del usuario: ${baseStrength}kg.

Dame exactamente 3 alternativas que trabajen el mismo músculo (${ex.muscle}) con diferente equipo disponible.
Ordenalas de más a menos similar al ejercicio original.
weight_suggestion DEBE ser un rango en kg concreto ej: "15-20 kg" — NUNCA porcentajes. Para peso corporal escribí "Peso corporal".
SOLO JSON sin backticks:
[
  {"machine":"nombre","muscle":"músculo","sets":${ex.sets},"reps":"${ex.reps}","rest":"${ex.rest}","weight_suggestion":"X-Y kg","tip":"tip técnico corto","reason":"por qué es buena alternativa (1 frase)"},
  {"machine":"nombre","muscle":"músculo","sets":${ex.sets},"reps":"${ex.reps}","rest":"${ex.rest}","weight_suggestion":"X-Y kg","tip":"","reason":""},
  {"machine":"nombre","muscle":"músculo","sets":${ex.sets},"reps":"${ex.reps}","rest":"${ex.rest}","weight_suggestion":"X-Y kg","tip":"","reason":""}
]`;

    try {
      const r = await fetch("/.netlify/functions/ai", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ model: "claude-sonnet-4-20250514", max_tokens: 500, messages: [{ role: "user", content: prompt }] })
      });
      const d = await r.json();
      const t = d.content?.find(b => b.type === "text")?.text || "";
      const alts = JSON.parse(t.replace(/```json|```/g, "").trim());
      setAlternatives(a => ({ ...a, [index]: alts }));
    } catch {
      // Fallback con alternativas genéricas según músculo
      const fallbacks = {
        "Pectoral": [
          { machine: "Flexiones de Brazos", muscle: ex.muscle, sets: ex.sets, reps: "12-15", rest: ex.rest, weight_suggestion: "Peso corporal", tip: "Codos a 45°", reason: "Trabaja el pectoral sin equipo" },
          { machine: "Pec Fly / Mariposa (máquina)", muscle: ex.muscle, sets: ex.sets, reps: ex.reps, rest: ex.rest, weight_suggestion: "40% máx", tip: "Control en la apertura", reason: "Aislamiento de pectoral" },
          { machine: "Press de Banca (barra)", muscle: ex.muscle, sets: ex.sets, reps: ex.reps, rest: ex.rest, weight_suggestion: "60% máx", tip: "Escápulas juntas", reason: "Variante clásica con barra" },
        ],
        "Dorsal": [
          { machine: "Jalón al Pecho (máquina)", muscle: ex.muscle, sets: ex.sets, reps: ex.reps, rest: ex.rest, weight_suggestion: "55% máx", tip: "Jalá hacia el pecho", reason: "Misma función con polea" },
          { machine: "Remo con Mancuerna", muscle: ex.muscle, sets: ex.sets, reps: ex.reps, rest: ex.rest, weight_suggestion: "Moderado", tip: "Espalda paralela al suelo", reason: "Unilateral, mayor rango" },
          { machine: "Dominadas", muscle: ex.muscle, sets: ex.sets, reps: "al fallo", rest: ex.rest, weight_suggestion: "Peso corporal", tip: "Pecho a la barra", reason: "El mejor ejercicio de dorsal" },
        ],
      };
      const muscle = ex.muscle.split(" ")[0];
      const fb = fallbacks[muscle] || [
        { machine: "Ejercicio con peso corporal", muscle: ex.muscle, sets: ex.sets, reps: "12-15", rest: ex.rest, weight_suggestion: "Peso corporal", tip: "Controlá cada repetición", reason: "Sin equipo necesario" },
        { machine: "Remo con Banda Elástica", muscle: ex.muscle, sets: ex.sets, reps: ex.reps, rest: ex.rest, weight_suggestion: "Banda media", tip: "Aprieta al final", reason: "Con banda elástica" },
        { machine: "Press de Hombros con Mancuernas", muscle: ex.muscle, sets: ex.sets, reps: ex.reps, rest: ex.rest, weight_suggestion: `${Math.round(baseStrength * 0.2)}-${Math.round(baseStrength * 0.3)} kg`, tip: "No bloquees arriba", reason: "Variante libre" },
      ];
      setAlternatives(a => ({ ...a, [index]: fb }));
    }
    setSubstituting(null);
  }

  // ── Elegir una alternativa específica ─────────────────────────────────────
  function pickAlternative(index, alt) {
    // Reemplaza el ejercicio y limpia TODAS las alternativas de ese índice
    setRoutine(prev => ({
      ...prev,
      exercises: prev.exercises.map((e, i) => i === index ? { ...alt } : e)
    }));
    // Limpiar alternativas del índice reemplazado para que el nuevo ejercicio empiece limpio
    setAlternatives(a => {
      const next = { ...a };
      delete next[index];
      return next;
    });
    setSubstituting(null);
  }

  // ── Parsear segundos de descanso del string ────────────────────────────────
  function parseRestSecs(restStr) {
    const m = (restStr || "").match(/(\d+)/);
    return m ? parseInt(m[1]) : 60;
  }

  return (
    <div style={{ minHeight: "100vh", background: "#080809", fontFamily: "'DM Sans',sans-serif", color: "#fff", maxWidth: 520, margin: "0 auto", paddingBottom: 80 }}>
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>

      {/* Rest Timer overlay */}
      {timer && (
        <RestTimer
          seconds={timer.seconds}
          onDone={() => setTimer(null)}
          onSkip={() => setTimer(null)}
         
        />
      )}

      {/* Video modal */}
      {selectedMachine && <ExerciseVideo machine={selectedMachine} onClose={() => setSelectedMachine(null)} />}

      {/* Upgrade checkout modal */}
      {upgradeCheckout && (
        <UpgradeCheckout
          plan={upgradeCheckout}
          user={user}
          onCancel={() => setUpgradeCheckout(null)}
          onSuccess={(plan) => {
            setUpgradeCheckout(null);
            onUpgradePlan(plan);
          }}
        />
      )}

      {/* Trial banner */}
      {trialDaysLeft !== null && (
        <div style={{ background: "linear-gradient(90deg,#10b981,#059669)", padding: "10px 18px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span style={{ color: "#fff", fontSize: 13, fontWeight: 700 }}>🎁 Prueba gratis: {trialDaysLeft} {trialDaysLeft !== 1 ? "días restantes" : "día restante"}</span>
          <button onClick={() => setTab("upgrade")} style={{ background: "rgba(255,255,255,0.2)", border: "none", color: "#fff", borderRadius: 8, padding: "4px 10px", fontSize: 12, cursor: "pointer", fontFamily: "'DM Sans',sans-serif", fontWeight: 700 }}>⭐ Suscribirme</button>
        </div>
      )}

      {/* Header */}
      <div style={{ padding: "16px 18px 12px", borderBottom: "1px solid rgba(255,255,255,0.05)", position: "sticky", top: 0, background: "rgba(8,8,9,0.97)", backdropFilter: "blur(20px)", zIndex: 20 }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <Avatar photo={user.photo} name={user.nombre} size={40} />
            <div>
              <div style={{ color: "rgba(255,255,255,0.35)", fontSize: 11 }}>{greeting}</div>
              <div style={{ fontWeight: 800, fontSize: 15 }}>{user.nombre.split(" ")[0]}</div>
            </div>
          </div>
          <div style={{ display: "flex", gap: 6 }}>
            <span style={{ fontSize: 11, fontWeight: 800, color: "#e84a2e", letterSpacing: 1.5 }}>FROQIA</span>
          </div>
        </div>
      </div>

      <div style={{ padding: "0 18px" }}>

        {/* HOME */}
        {tab === "home" && (
          <>
            <div style={{ display: "flex", gap: 10, marginTop: 16, marginBottom: 12 }}>
              <div style={{ flex: 1, ...card, padding: "12px 14px", borderColor: "rgba(16,185,129,0.25)", background: "rgba(16,185,129,0.06)" }}>
                <div style={{ color: "rgba(255,255,255,0.35)", fontSize: 10, fontWeight: 700 }}>PROTEÍNA HOY</div>
                <div style={{ color: "#10b981", fontWeight: 900, fontSize: 22 }}>{daily}g</div>
                <div style={{ color: "rgba(255,255,255,0.25)", fontSize: 10 }}>meta diaria</div>
              </div>
              <div style={{ flex: 2, ...card, padding: "14px 16px", background: "linear-gradient(135deg,rgba(232,74,46,0.1),rgba(245,158,11,0.04))", borderColor: "rgba(232,74,46,0.18)" }}>
                <div style={{ color: "#e8a090", fontSize: 10, fontWeight: 800, letterSpacing: 1, marginBottom: 3 }}>{dayName.toUpperCase()} · HOY</div>
                <div style={{ fontWeight: 900, fontSize: 16, lineHeight: 1.3 }}>{loading ? "Generando..." : routine?.dayFocus || "—"}</div>
                {!loading && routine && <div style={{ display: "flex", gap: 5, marginTop: 6, flexWrap: "wrap" }}><Pill color="rgba(255,255,255,0.35)">⏱ {routine.duration}</Pill><Pill color="#f59e0b">🔥 {routine.caloriesBurned}</Pill></div>}
              </div>
            </div>

            {tip && (
              <div style={{ ...card, padding: 14, marginBottom: 12, background: (tipColor[tip.category] || "#e84a2e") + "0a", borderColor: (tipColor[tip.category] || "#e84a2e") + "2a" }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 7 }}>
                  <Pill color={tipColor[tip.category] || "#e84a2e"}>{tip.category}</Pill>
                  <button onClick={async () => { try { const r = await fetch("/.netlify/functions/ai", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ model: "claude-sonnet-4-20250514", max_tokens: 300, messages: [{ role: "user", content: `Consejo para ${goalInfo?.label}, ${bodyInfo?.sublabel}, ${user.weight}kg, meta ${daily}g proteína. SOLO JSON: {"category":"Nutrición|Técnica|Recuperación|Motivación","title":"...","content":"..."}` }] }) }); const d = await r.json(); setTip(JSON.parse(d.content?.find(b => b.type === "text")?.text?.replace(/```json|```/g,"").trim()||"{}")); } catch {} }} style={{ background: "none", border: "none", color: "rgba(255,255,255,0.25)", cursor: "pointer", fontSize: 12, fontFamily: "'DM Sans',sans-serif" }}>↻</button>
                </div>
                <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 4 }}>{tip.title}</div>
                <div style={{ color: "rgba(255,255,255,0.55)", fontSize: 13, lineHeight: 1.6 }}>{tip.content}</div>
              </div>
            )}

            {/* Frase motivadora del día */}
            <MotivationalQuote />

            {/* Calentamiento — pregunta si quiere hacer */}
            {!loading && routine?.warmup && <WarmupCard warmup={routine.warmup} />}

            {loading ? (
              <div style={{ textAlign: "center", padding: 48 }}>
                <div style={{ width: 38, height: 38, border: "3px solid rgba(255,255,255,0.07)", borderTopColor: "#e84a2e", borderRadius: "50%", animation: "spin 0.8s linear infinite", margin: "0 auto 14px" }} />
                <div style={{ color: "rgba(255,255,255,0.35)" }}>Preparando tu rutina...</div>
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: 9 }}>
                {routine?.exercises?.map((ex, i) => (
                  <SmartExerciseCard
                    key={`${i}-${ex.machine}`}
                    ex={ex}
                    index={i}
                    done={!!done[i]}
                    isSubstituting={substituting === i}
                    alternatives={alternatives[i] || null}
                    onToggle={() => {
                      const nowDone = !done[i];
                      setDone(d => ({ ...d, [i]: nowDone }));
                      if (nowDone && i < routine.exercises.length - 1) {
                        setTimer({ seconds: parseRestSecs(ex.rest), exIndex: i });
                      }
                    }}
                    onVideoClick={() => setSelectedMachine(getMachineData(ex.machine))}
                    onSubstitute={(force) => loadAlternatives(i, force)}
                    onPickAlternative={(alt) => pickAlternative(i, alt)}
                    onDismissAlternatives={() => setAlternatives(a => ({ ...a, [i]: null }))}
                  />
                ))}
              </div>
            )}

            {!loading && routine?.finisher && (
              <div style={{ ...card, padding: 14, marginTop: 9, borderColor: "rgba(245,158,11,0.3)", background: "rgba(245,158,11,0.06)" }}>
                <div style={{ color: "#f59e0b", fontSize: 10, fontWeight: 800, letterSpacing: 1, marginBottom: 6 }}>⚡ FINALIZADOR — {routine.finisher.name}</div>
                <div style={{ color: "rgba(255,255,255,0.7)", fontSize: 13, lineHeight: 1.6 }}>{routine.finisher.desc}</div>
              </div>
            )}
            {!loading && routine?.cooldown && <div style={{ ...card, padding: 12, marginTop: 9, borderColor: "rgba(139,92,246,0.2)", background: "rgba(139,92,246,0.04)" }}><div style={{ color: "#8b5cf6", fontSize: 10, fontWeight: 800, letterSpacing: 1, marginBottom: 5 }}>❄️ ENFRIAMIENTO</div><div style={{ color: "rgba(255,255,255,0.65)", fontSize: 13, lineHeight: 1.6 }}>{routine.cooldown}</div></div>}

       {!loading && doneCount > 0 && <Btn onClick={() => {
  if (showFinish) return; const newEntry = { date: new Date().toLocaleDateString(), focus: routine?.dayFocus, muscles: routine?.musclesWorked || [], completed: doneCount, total: totalEx }; setHistory(h => [newEntry, ...h]); const userId = JSON.parse(localStorage.getItem("froqia_session"))?.user?.id;; if (userId) { console.log("userId:", userId);
console.log("routine:", routine?.dayFocus);supabaseCall("saveRutina", { user_id: userId, nombre: routine?.dayFocus || "Entrenamiento", ejercicios: doneCount, calorias: routine?.caloriesBurned || "0", grupo_muscular: routine?.musclesWorked?.[0] || "" }).catch(() => {}); } setShowFinish(true); }} variant="success" style={{ width: "100%", marginTop: 14, padding: 14, fontSize: 15 }}>✅ Finalizar ({doneCount}/{totalEx})</Btn>}
            <Btn onClick={generateRoutine} variant="ghost" style={{ width: "100%", marginTop: 10, fontSize: 13 }}>🔄 Nueva rutina</Btn>
          </>
        )}

        {/* NUTRICIÓN */}
        {tab === "nutrition" && (
          <div style={{ paddingTop: 16 }}>
            <h3 style={{ margin: "0 0 16px", fontSize: 18, fontWeight: 800 }}>🥗 Nutrición & Proteína</h3>
            {!isPremium ? (
              <div style={{ textAlign: "center", padding: "40px 20px", background: "rgba(232,74,46,0.08)", borderRadius: 16, border: "1px solid rgba(232,74,46,0.2)" }}>
                <div style={{ fontSize: 48, marginBottom: 12 }}>🔒</div>
                <h3 style={{ margin: "0 0 8px", fontSize: 18, fontWeight: 800 }}>Plan Nutricional Personalizado</h3>
                <p style={{ color: "rgba(255,255,255,0.5)", fontSize: 14, margin: "0 0 20px", lineHeight: 1.5 }}>
                  Calculá tu meta de proteína, armá tu plan diario y accedé a la tabla interactiva de alimentos. Disponible en planes de pago.
                </p>
                <button onClick={() => setTab("upgrade")} style={{ background: "linear-gradient(135deg,#e84a2e,#c53d25)", border: "none", color: "#fff", borderRadius: 12, padding: "13px 28px", fontWeight: 700, fontSize: 15, cursor: "pointer", fontFamily: "'DM Sans',sans-serif", boxShadow: "0 4px 20px rgba(232,74,46,0.35)" }}>
                  ⭐ Ver planes de suscripción
                </button>
                <p style={{ color: "rgba(255,255,255,0.3)", fontSize: 12, marginTop: 12 }}>Desde ₲ 75.000/mes</p>
              </div>
            ) : (
              <ProteinCalculator user={user} />
            )}
          </div>
        )}

        {/* MÉDICO */}
        {tab === "medical" && <div style={{ paddingTop: 16 }}><h3 style={{ margin: "0 0 4px", fontSize: 18, fontWeight: 800 }}>🧪 Análisis Médico</h3><p style={{ color: "rgba(255,255,255,0.4)", fontSize: 13, margin: "0 0 16px" }}>Subí tus hemogramas e informes. La IA los analiza y ajusta tu plan.</p><MedicalFiles user={user} isPremium={isPremium} onUpgrade={() => setTab("upgrade")} /></div>}

        {/* UPGRADE */}
        {tab === "upgrade" && (
          <div style={{ paddingTop: 16 }}>
            <button onClick={() => setTab("medical")} style={{ background: "none", border: "none", color: "rgba(255,255,255,0.4)", cursor: "pointer", fontSize: 14, padding: "0 0 16px", display: "flex", alignItems: "center", gap: 6, fontFamily: "'DM Sans',sans-serif" }}>← Volver</button>
            <h3 style={{ margin: "0 0 4px", fontSize: 20, fontWeight: 800 }}>⭐ Planes Premium</h3>
            <p style={{ color: "rgba(255,255,255,0.4)", fontSize: 13, margin: "0 0 20px" }}>Desbloqueá el análisis médico con IA y más funciones.</p>
            {PLANES.filter(p => !p.trial).map(plan => (
              <div key={plan.id} style={{ background: plan.popular ? plan.color + "0a" : "rgba(255,255,255,0.02)", border: `1.5px solid ${plan.popular ? plan.color + "55" : "rgba(255,255,255,0.08)"}`, borderRadius: 16, padding: "16px 18px", marginBottom: 12, position: "relative" }}>
                {plan.popular && <div style={{ position: "absolute", top: -11, right: 16, background: `linear-gradient(135deg,${plan.color},${plan.color}bb)`, color: "#fff", fontSize: 10, fontWeight: 800, padding: "3px 12px", borderRadius: 99 }}>⭐ MÁS POPULAR</div>}
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
                  <div>
                    <div style={{ fontWeight: 800, fontSize: 16 }}>{plan.nombre}</div>
                    {plan.ahorro && <span style={{ background: plan.color + "22", color: plan.color, fontSize: 11, fontWeight: 700, borderRadius: 99, padding: "2px 10px" }}>{plan.ahorro}</span>}
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <div style={{ fontSize: 20, fontWeight: 900, color: plan.color }}>{plan.precioLabel}</div>
                    <div style={{ color: "rgba(255,255,255,0.3)", fontSize: 12 }}>{plan.periodo}</div>
                  </div>
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 5, marginBottom: 14 }}>
                  {plan.features.map(f => <div key={f} style={{ display: "flex", gap: 8 }}><span style={{ color: plan.color }}>✓</span><span style={{ color: "rgba(255,255,255,0.6)", fontSize: 13 }}>{f}</span></div>)}
                </div>
                <button onClick={() => setUpgradeCheckout(plan)} style={{
                  width: "100%", border: plan.popular ? "none" : `1px solid ${plan.color}44`,
                  background: plan.popular ? "linear-gradient(135deg,#e84a2e,#c53d25)" : "rgba(255,255,255,0.04)",
                  color: plan.popular ? "#fff" : plan.color,
                  borderRadius: 13, padding: 13, fontWeight: 700, fontSize: 14,
                  cursor: "pointer", fontFamily: "'DM Sans',sans-serif",
                  boxShadow: plan.popular ? "0 4px 20px rgba(232,74,46,0.3)" : "none"
                }}>
                  Suscribirme a este plan →
                </button>
              </div>
            ))}
          </div>
        )}

        {/* HISTORIAL */}
        {tab === "history" && (
          <>
            <h3 style={{ margin: "18px 0 14px", fontSize: 18, fontWeight: 800 }}>📊 Historial</h3>
            {history.length === 0 ? <div style={{ textAlign: "center", padding: "48px 20px" }}><div style={{ fontSize: 48, marginBottom: 14 }}>📋</div><p style={{ color: "rgba(255,255,255,0.3)", fontSize: 14 }}>Completá tu primer entrenamiento.</p></div>
              : history.map((h, i) => <div key={i} style={{ ...card, padding: "14px 16px", marginBottom: 9 }}><div style={{ display: "flex", justifyContent: "space-between", marginBottom: 7 }}><div style={{ fontWeight: 700, fontSize: 14 }}>{h.focus}</div><Pill color="#10b981">✓ {h.completed}/{h.total}</Pill></div><div style={{ color: "rgba(255,255,255,0.3)", fontSize: 12, marginBottom: 7 }}>{h.date}</div><div style={{ display: "flex", flexWrap: "wrap", gap: 5 }}>{h.muscles.map(m => <Pill key={m} color="rgba(255,255,255,0.2)">{m}</Pill>)}</div></div>)}
          </>
        )}

        {/* PERFIL */}
        {tab === "profile" && (
          <>
            <div style={{ textAlign: "center", padding: "22px 0 16px" }}>
              <Avatar photo={user.photo} name={user.nombre} size={76} />
              <h2 style={{ margin: "12px 0 3px", fontSize: 20, fontWeight: 800 }}>{user.nombre}</h2>
              <p style={{ color: "rgba(255,255,255,0.3)", margin: "0 0 12px", fontSize: 13 }}>{user.email || user.phone}</p>
              <div style={{ display: "flex", justifyContent: "center", gap: 8, flexWrap: "wrap" }}>
                <Pill color={goalInfo?.color}>{goalInfo?.emoji} {goalInfo?.label}</Pill>
                <Pill color={bodyInfo?.color}>{bodyInfo?.emoji} {bodyInfo?.sublabel}</Pill>
              </div>
            </div>
            <div style={{ ...card, padding: "13px 16px", marginBottom: 12, borderColor: planInfo?.color + "44", background: planInfo?.color + "0a" }}>
              <div style={{ color: planInfo?.color, fontSize: 10, fontWeight: 800, marginBottom: 6 }}>⭐ SUSCRIPCIÓN</div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div><div style={{ fontWeight: 800, fontSize: 15 }}>{planInfo?.nombre}</div>{trialDaysLeft !== null && <div style={{ color: "#10b981", fontSize: 13 }}>{trialDaysLeft} días restantes</div>}</div>
                <div style={{ fontWeight: 900, fontSize: 18, color: planInfo?.color }}>{planInfo?.precioLabel}</div>
              </div>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 9, marginBottom: 12 }}>
              {[["⚖️", user.weight + "kg", "Peso"], ["📏", user.height + "cm", "Altura"], ["🎂", user.age + "a", "Edad"], ["⚧", user.sex === "female" ? "Mujer" : user.sex === "male" ? "Hombre" : "N/E", "Sexo"], ["📅", user.daysPerWeek + "d/sem", "Frecuencia"], ["🥩", daily + "g", "Proteína/día"], ["🏋️", user.machines.length, "Máquinas"]].map(([e, v, l]) => <div key={l} style={{ ...card, padding: "10px 8px", textAlign: "center" }}><div style={{ fontSize: 18, marginBottom: 3 }}>{e}</div><div style={{ fontWeight: 800, fontSize: 15 }}>{v}</div><div style={{ color: "rgba(255,255,255,0.25)", fontSize: 10 }}>{l}</div></div>)}
            </div>
            {/* Language selector */}
            <div style={{ ...card, padding: "13px 16px", marginBottom: 12 }}>
              <div style={{ color: "rgba(255,255,255,0.4)", fontSize: 11, fontWeight: 800, letterSpacing: 0.8, marginBottom: 10 }}>🌐 Idioma</div>
              
            </div>

            <Btn onClick={onLogout} variant="ghost" style={{ width: "100%" }}>🚪 Cerrar sesión</Btn>
          </>
        )}
      </div>

      {/* Bottom nav */}
      <div style={{ position: "fixed", bottom: 0, left: "50%", transform: "translateX(-50%)", width: "100%", maxWidth: 520, background: "rgba(8,8,9,0.97)", backdropFilter: "blur(20px)", borderTop: "1px solid rgba(255,255,255,0.06)", display: "flex", justifyContent: "space-around", padding: "10px 0 18px" }}>
        {[["home", "🏠", "Inicio"], ["nutrition", "🥗", "Nutrición"], ["medical", "🧪", "Médico"], ["history", "📊", "Historial"], ["profile", "👤", "Perfil"]].map(([id, icon, label]) => (
          <button key={id} onClick={() => setTab(id)} style={{ background: "none", border: "none", cursor: "pointer", padding: "4px 10px", display: "flex", flexDirection: "column", alignItems: "center", gap: 3, color: tab === id ? "#e8a090" : "rgba(255,255,255,0.3)", fontFamily: "'DM Sans',sans-serif" }}>
            <span style={{ fontSize: 20 }}>{icon}</span>
            <span style={{ fontSize: 10, fontWeight: 700 }}>{label}</span>
          </button>
        ))}
      </div>

      {/* Finish modal */}
      {showFinish && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.85)", display: "flex", alignItems: "flex-end", justifyContent: "center", zIndex: 50, backdropFilter: "blur(8px)" }}>
          <div style={{ background: "#141416", borderRadius: "22px 22px 0 0", padding: 26, width: "100%", maxWidth: 520, border: "1px solid rgba(255,255,255,0.07)" }}>
            <div style={{ textAlign: "center", marginBottom: 16 }}>
              <div style={{ fontSize: 50 }}>🎉</div>
              <h3 style={{ margin: "10px 0 3px", fontSize: 20 }}>¡Sesión completada!</h3>
              <p style={{ color: "rgba(255,255,255,0.4)", margin: 0 }}>No olvidés tomar <strong style={{ color: "#10b981" }}>{Math.round(daily * 0.3)}g</strong> de proteína ahora</p>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 9, marginBottom: 16 }}>
              {[["Ejercicios", `${doneCount}/${totalEx}`], ["Calorías", `~${routine?.caloriesBurned}`], ["Proteína post", Math.round(daily * 0.3) + "g"], ["Intensidad", routine?.intensity]].map(([k, v]) => <div key={k} style={{ ...card, padding: "11px 13px", textAlign: "center" }}><div style={{ color: "rgba(255,255,255,0.3)", fontSize: 11 }}>{k}</div><div style={{ fontWeight: 700, fontSize: 14, marginTop: 3 }}>{v}</div></div>)}
            </div>
            <Btn onClick={() => { setShowFinish(false); setDone({}); generateRoutine(); }} style={{ width: "100%", padding: 14, fontSize: 15 }}>🔁 Nueva rutina</Btn>
           <Btn onClick={() => { setShowFinish(false); setDone({}); }} variant="ghost" style={{ width: "100%", marginTop: 9 }}>Cerrar</Btn>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── UPGRADE CHECKOUT — para usuarios que ya están en la app ─────────────────
function UpgradeCheckout({ plan, user, onSuccess, onCancel }) {
  const [step, setStep] = useState("review");
  const [pedidoHash, setPedidoHash] = useState(null);
  const [numeroPedido, setNumeroPedido] = useState(null);

  async function iniciarPago() {
    setStep("processing");
    try {
      const idPedido = `MG-UP-${Date.now()}-${Math.random().toString(36).slice(2, 6).toUpperCase()}`;
      const token = await sha1(PAGOPAR_CONFIG.PRIVATE_KEY + idPedido + parseFloat(plan.precio).toString());
      const fechaMax = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().replace("T", " ").slice(0, 19);
      const payload = {
        token, public_key: PAGOPAR_CONFIG.PUBLIC_KEY, monto_total: plan.precio,
        tipo_pedido: "VENTA-COMERCIO", id_pedido_comercio: idPedido,
        descripcion_resumen: `FROQIA - ${plan.nombre}`, fecha_maxima_pago: fechaMax,
        comprador: {
          nombre: user.nombre,
          email: user.email || `${(user.phone || "").replace(/\D/g, "")}@froqia.py`,
          telefono: user.phone || "", documento: user.cedula || "",
          tipo_documento: "CI", ruc: "", ciudad: 1, direccion: "",
          direccion_referencia: null, coordenadas: "", razon_social: user.nombre
        },
        compras_items: [{
          nombre: `FROQIA - ${plan.nombre}`, descripcion: `Acceso ${plan.periodo}`,
          cantidad: 1, precio_total: plan.precio, id_producto: 2002, categoria: "909",
          ciudad: 1, public_key: PAGOPAR_CONFIG.PUBLIC_KEY, url_imagen: "",
          vendedor_telefono: "", vendedor_direccion: "", vendedor_direccion_referencia: "", vendedor_direccion_coordenadas: ""
        }]
      };
      const res = await fetch(PAGOPAR_CONFIG.API_URL, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
      const data = await res.json();
      if (data.respuesta && data.resultado?.[0]?.data) { setPedidoHash(data.resultado[0].data); setNumeroPedido(data.resultado[0].data || ""); setStep("redirect"); }
      else throw new Error();
    } catch {
      if (PAGOPAR_CONFIG.PUBLIC_KEY === "TU_PUBLIC_KEY_PAGOPAR") { setPedidoHash("DEMO_UP_" + Date.now()); setStep("redirect"); }
      else setStep("error");
    }
  }

  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.92)", zIndex: 100, display: "flex", alignItems: "flex-end", justifyContent: "center", backdropFilter: "blur(8px)" }}>
      <div style={{ background: "#141416", borderRadius: "22px 22px 0 0", width: "100%", maxWidth: 520, maxHeight: "90vh", overflowY: "auto", border: "1px solid rgba(255,255,255,0.08)", padding: "24px 20px 36px" }}>
        <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>

        {step === "review" && (
          <>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
              <div style={{ fontWeight: 800, fontSize: 18, color: "#fff" }}>⭐ Suscribirse</div>
              <button onClick={onCancel} style={{ background: "rgba(255,255,255,0.07)", border: "none", color: "#fff", width: 32, height: 32, borderRadius: "50%", cursor: "pointer", fontSize: 16 }}>✕</button>
            </div>

            {/* Plan seleccionado */}
            <div style={{ background: plan.color + "0d", border: `1px solid ${plan.color}44`, borderRadius: 14, padding: "14px 18px", marginBottom: 16 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div>
                  <div style={{ fontWeight: 800, fontSize: 17, color: "#fff" }}>{plan.nombre}</div>
                  {plan.ahorro && <div style={{ color: plan.color, fontSize: 12, fontWeight: 700, marginTop: 3 }}>{plan.ahorro}</div>}
                </div>
                <div style={{ textAlign: "right" }}>
                  <div style={{ fontSize: 22, fontWeight: 900, color: plan.color }}>{plan.precioLabel}</div>
                  <div style={{ color: "rgba(255,255,255,0.35)", fontSize: 12 }}>{plan.periodo}</div>
                </div>
              </div>
              <div style={{ marginTop: 12, display: "flex", flexDirection: "column", gap: 5 }}>
                {plan.features.map(f => <div key={f} style={{ display: "flex", gap: 8 }}><span style={{ color: plan.color }}>✓</span><span style={{ color: "rgba(255,255,255,0.65)", fontSize: 13 }}>{f}</span></div>)}
              </div>
            </div>

            {/* Datos del comprador */}
            <div style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 12, padding: "13px 16px", marginBottom: 16 }}>
              <div style={{ color: "rgba(255,255,255,0.4)", fontSize: 11, fontWeight: 700, marginBottom: 10 }}>👤 COMPRADOR</div>
              {[["Nombre", user.nombre], ["Contacto", user.email || user.phone]].map(([k, v]) => (
                <div key={k} style={{ display: "flex", justifyContent: "space-between", borderBottom: "1px solid rgba(255,255,255,0.05)", paddingBottom: 7, marginBottom: 7 }}>
                  <span style={{ color: "rgba(255,255,255,0.4)", fontSize: 13 }}>{k}</span>
                  <span style={{ color: "#fff", fontSize: 13, fontWeight: 600 }}>{v}</span>
                </div>
              ))}
            </div>

            <div style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 12, padding: "12px 16px", marginBottom: 4, display: "flex", alignItems: "center", gap: 10 }}>
              <span style={{ fontSize: 20 }}>🔒</span>
              <div style={{ color: "rgba(255,255,255,0.5)", fontSize: 12 }}>Pago seguro procesado por <strong style={{ color: "#fff" }}>PagoPar</strong></div>
            </div>

            {PAGOPAR_CONFIG.PUBLIC_KEY === "TU_PUBLIC_KEY_PAGOPAR" && (
              <div style={{ padding: "8px 12px", background: "rgba(245,158,11,0.1)", border: "1px solid rgba(245,158,11,0.2)", borderRadius: 10, marginBottom: 14, color: "#f5d060", fontSize: 12, textAlign: "center" }}>🧪 Modo DEMO — simulando pago</div>
            )}

            <button onClick={iniciarPago} style={{ width: "100%", background: "linear-gradient(135deg,#e84a2e,#c53d25)", border: "none", color: "#fff", borderRadius: 13, padding: 16, fontWeight: 700, fontSize: 15, cursor: "pointer", fontFamily: "'DM Sans',sans-serif", marginTop: 14, boxShadow: "0 4px 24px rgba(232,74,46,0.35)" }}>
              💳 Pagar con PagoPar
            </button>
            <button onClick={onCancel} style={{ width: "100%", marginTop: 10, background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.5)", borderRadius: 13, padding: 13, fontWeight: 700, fontSize: 14, cursor: "pointer", fontFamily: "'DM Sans',sans-serif" }}>
              Cancelar
            </button>
          </>
        )}

        {step === "processing" && (
          <div style={{ textAlign: "center", padding: "48px 20px" }}>
            <div style={{ width: 48, height: 48, border: "3px solid rgba(255,255,255,0.08)", borderTopColor: "#e84a2e", borderRadius: "50%", animation: "spin 0.8s linear infinite", margin: "0 auto 20px" }} />
            <p style={{ color: "rgba(255,255,255,0.5)" }}>Conectando con PagoPar...</p>
          </div>
        )}

        {step === "redirect" && (
          <div style={{ textAlign: "center", padding: "24px 0" }}>
            <div style={{ fontSize: 52, marginBottom: 14 }}>💳</div>
            <h3 style={{ color: "#fff", margin: "0 0 10px", fontSize: 20 }}>¡Pedido creado!</h3>
            <p style={{ color: "rgba(255,255,255,0.5)", marginBottom: 24, lineHeight: 1.7 }}>
              Completá el pago en el portal seguro de <strong style={{ color: "#fff" }}>PagoPar</strong>.
            </p>
            <button onClick={() => {
              if (PAGOPAR_CONFIG.PUBLIC_KEY === "TU_PUBLIC_KEY_PAGOPAR") { onSuccess(plan); }
              else {
                // Crear link y simular click para abrir en browser nativo
                const link = document.createElement("a");
                link.href = `${PAGOPAR_CONFIG.CHECKOUT_URL}${pedidoHash}`;
                link.target = "_blank";
                link.rel = "noopener noreferrer";
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
              }
            }} style={{ width: "100%", background: "linear-gradient(135deg,#f59e0b,#d97706)", border: "none", color: "#fff", borderRadius: 13, padding: 15, fontWeight: 700, fontSize: 15, cursor: "pointer", fontFamily: "'DM Sans',sans-serif", marginBottom: 10 }}>
              🚀 Ir al checkout de PagoPar
            </button>
            <button onClick={() => onSuccess(plan)} style={{ width: "100%", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.5)", borderRadius: 13, padding: 13, fontWeight: 700, fontSize: 14, cursor: "pointer", fontFamily: "'DM Sans',sans-serif" }}>
              ✅ Ya pagué → Activar plan
            </button>
          </div>
        )}

        {step === "error" && (
          <div style={{ textAlign: "center", padding: "32px 0" }}>
            <div style={{ fontSize: 48, marginBottom: 14 }}>❌</div>
            <p style={{ color: "rgba(255,255,255,0.5)", marginBottom: 20 }}>Error al conectar con PagoPar. Intentá nuevamente.</p>
            <button onClick={() => setStep("review")} style={{ width: "100%", background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.12)", color: "#aaa", borderRadius: 13, padding: 14, fontWeight: 700, cursor: "pointer", fontFamily: "'DM Sans',sans-serif" }}>← Volver</button>
          </div>
        )}
      </div>
    </div>
  );
}


// Helper para llamar a la función de Supabase
async function supabaseCall(action, data) {
  const r = await fetch("/.netlify/functions/supabase", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ action, data })
  });
  return r.json();
}

export default function App() {
  const [screen, setScreen] = useState("loading");
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [userData, setUserData] = useState(null);
  const [suscripcion, setSuscripcion] = useState(null);
  const [fullUser, setFullUser] = useState(null);

  // Al cargar — verificar si hay sesión guardada y sincronizar con Supabase
  useEffect(() => {
    const saved = localStorage.getItem("froqia_session");
    if (saved) {
      try {
        const { user, perfil, suscripcion: sus } = JSON.parse(saved);
        if (user && perfil) {
          const susFinal = sus || { 
            plan: { id: "trial", nombre: "Prueba Gratis", trial: true, color: "#10b981", precioLabel: "GRATIS", periodo: "7 días" }, 
            trialExpiry: Date.now() + 7 * 24 * 60 * 60 * 1000 
          };
          setFullUser(perfil);
          setSuscripcion(susFinal);
          setScreen("app");
          
          setSuscripcion(susFinal);
          setScreen("app");
          
          // Sincronizar con Supabase en segundo plano
          supabaseCall("getPerfil", { user_id: user.id }).then(res => {
            if (res.perfil) {
              setFullUser(res.perfil);
              localStorage.setItem("froqia_session", JSON.stringify({
                user,
                perfil: res.perfil,
                suscripcion: susFinal
              }));
            }
          }).catch(() => {});
          return;
        }
      } catch {}
    }

    // Detectar si PagoPar redirigió de vuelta con un hash
    const path = window.location.pathname;
    if (path && path !== "/" && path !== "/index.html") {
      const hash = path.replace("/", "");
      if (hash && hash.length > 8) {
        setScreen("pagopar-success");
        window.history.replaceState({}, "", "/");
        return;
      }
    }
    setScreen("tutorial");
  }, []);

  if (screen === "pagopar-success") {
    return (
      <div style={{ minHeight: "100vh", background: "#080809", fontFamily: "'DM Sans',sans-serif", color: "#fff", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: 24 }}>
        <style>{`@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;700;900&display=swap');`}</style>
        <div style={{ fontSize: 72, marginBottom: 20 }}>🐸</div>
        <h1 style={{ fontSize: 28, fontWeight: 900, color: "#10b981", margin: "0 0 12px", textAlign: "center" }}>¡Pago exitoso!</h1>
        <p style={{ color: "rgba(255,255,255,0.6)", fontSize: 16, textAlign: "center", lineHeight: 1.7, marginBottom: 30, maxWidth: 320 }}>
          Tu suscripción a FROQIA fue procesada correctamente. ¡Bienvenido!
        </p>
        <button onClick={() => setScreen("tutorial")} style={{ background: "linear-gradient(135deg,#10b981,#059669)", border: "none", color: "#fff", borderRadius: 14, padding: "16px 32px", fontSize: 16, fontWeight: 700, cursor: "pointer", fontFamily: "'DM Sans',sans-serif" }}>
          🚀 Comenzar en FROQIA
        </button>
      </div>
    );
  }

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;700;800;900&display=swap');
        *{box-sizing:border-box;} body{margin:0;background:#080809;}
        input::placeholder{color:rgba(255,255,255,0.2)!important;}
        input[type=range]{-webkit-appearance:none;height:4px;border-radius:4px;background:rgba(255,255,255,0.1);}
        input[type=range]::-webkit-slider-thumb{-webkit-appearance:none;width:18px;height:18px;border-radius:50%;background:#e84a2e;cursor:pointer;}
        ::-webkit-scrollbar{width:3px;} ::-webkit-scrollbar-thumb{background:rgba(255,255,255,0.08);border-radius:4px;}
        @keyframes spin{to{transform:rotate(360deg)}}
        @keyframes pulse{0%,100%{opacity:1}50%{opacity:0.4}}
      `}</style>
      {screen === "loading" && (
        <div style={{ minHeight: "100vh", background: "#080809", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <div style={{ textAlign: "center", color: "#fff" }}>
            <div style={{ fontSize: 48, marginBottom: 16 }}>🐸</div>
            <div style={{ color: "rgba(255,255,255,0.4)", fontSize: 14 }}>Cargando FROQIA...</div>
          </div>
        </div>
      )}
      {screen === "tutorial" && <TutorialScreen onFinish={() => setScreen("landing")} />}
      {screen === "landing" && <LandingScreen onSelectPlan={p => { setSelectedPlan(p); setScreen("register"); }} onTutorial={() => setScreen("tutorial")} />}
      {screen === "register" && selectedPlan && <RegisterScreen plan={selectedPlan} onBack={() => setScreen("landing")} onContinue={async d => { 
        setUserData(d); 
       if (d._loginExistente && d.weight) {
  setFullUser({ ...d, machines: d.machines || [], nombre: d.nombre || d.email?.split('@')[0] || 'Usuario' });
          const sus = { plan: selectedPlan, trialExpiry: d.plan_expiry ? new Date(d.plan_expiry).getTime() : Date.now() + 7 * 24 * 60 * 60 * 1000 };
          setSuscripcion(sus);
          localStorage.setItem("froqia_session", JSON.stringify({
            user: { email: d.email, id: d._supabaseUser?.id },
            perfil: d,
            suscripcion: sus
          }));
          setScreen("app");
        } else {
          setScreen("checkout");
        }
      }} />}
      {screen === "checkout" && selectedPlan && userData && <CheckoutScreen plan={selectedPlan} userData={userData} onBack={() => setScreen("register")} onSuccess={r => { setSuscripcion(r); setScreen("onboarding"); }} />}
      {screen === "onboarding" && userData && <OnboardingScreen userData={userData} onComplete={async u => {
        const { _supabaseUser, _session, ...fullProfile } = u;
        const supabaseUser = userData._supabaseUser;
        
        const susFinal = suscripcion || { 
          plan: { id: "trial", nombre: "Prueba Gratis", trial: true, color: "#10b981", precioLabel: "GRATIS", periodo: "7 días" }, 
          trialExpiry: Date.now() + 7 * 24 * 60 * 60 * 1000 
        };

        // Guardar sesión local ANTES de setState
        localStorage.setItem("froqia_session", JSON.stringify({
          user: { email: userData.email, id: supabaseUser?.id },
          perfil: fullProfile,
          suscripcion: susFinal
        }));

        setFullUser(fullProfile);
        setSuscripcion(susFinal);
        
        // Guardar en Supabase en segundo plano
        if (supabaseUser?.id) {
          supabaseCall("updatePerfil", {
            user_id: supabaseUser.id,
            perfil: { 
              ...fullProfile, 
              email: userData.email,
              nombre: userData.nombre,
              plan_id: susFinal?.plan?.id || "trial",
              plan_expiry: susFinal?.trialExpiry ? new Date(susFinal.trialExpiry).toISOString() : null
            }
          }).catch(() => {});
        }

        setScreen("app");
      }} />}
      {screen === "app" && fullUser && suscripcion && (
        <MainApp
          user={fullUser}
          suscripcion={suscripcion}
          onUpgradePlan={(newPlan) => {
            setSuscripcion(prev => ({ ...prev, plan: newPlan, trialExpiry: null }));
            const saved = localStorage.getItem("froqia_session");
            if (saved) {
              const s = JSON.parse(saved);
              s.suscripcion = { ...s.suscripcion, plan: newPlan, trialExpiry: null };
              localStorage.setItem("froqia_session", JSON.stringify(s));
            }
          }}
          onLogout={() => {
            localStorage.removeItem("froqia_session");
            setScreen("landing");
            setFullUser(null);
            setSuscripcion(null);
            setUserData(null);
          }}
        />
      )}
    </>
  );
}
