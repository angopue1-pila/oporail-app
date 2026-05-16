const newQuestions = [
  // --- BATCH 1: AVLO & BÁSICOS ---
  {
    categoria: "Actividad Comercial",
    enunciado: "¿Con cuánta antelación finaliza el control de acceso al tren en los servicios AVLO?",
    opcion_a: "5 minutos antes de la salida.",
    opcion_b: "2 minutos antes de la salida.",
    opcion_c: "10 minutos antes de la salida.",
    opcion_d: "30 segundos antes de la salida.",
    respuesta_correcta: "B",
    explicacion: "Según la normativa específica de AVLO (T.E. 7 I.1.1), el acceso al tren finaliza 2 minutos antes de la salida del tren."
  },
  {
    categoria: "Actividad Comercial",
    enunciado: "¿Qué dimensiones máximas debe tener el 'bolso de mano' gratuito incluido en el billete AVLO?",
    opcion_a: "36x27x25 cm.",
    opcion_b: "55x35x25 cm.",
    opcion_c: "40x30x20 cm.",
    opcion_d: "85x60x35 cm.",
    respuesta_correcta: "A",
    explicacion: "El equipaje de mano gratuito incluye un bolso/mochila de 36x27x25 cm y una maleta de cabina de 55x35x25 cm."
  },
  {
    categoria: "Actividad Comercial",
    enunciado: "En AVLO, ¿cuál es el peso máximo permitido para una mascota (perro, gato, hurón, etc.)?",
    opcion_a: "6 kg.",
    opcion_b: "8 kg.",
    opcion_c: "10 kg.",
    opcion_d: "12 kg.",
    respuesta_correcta: "C",
    explicacion: "El peso máximo de la mascota no debe exceder de 10 kg, incluyendo el transportín."
  },
  {
    categoria: "Actividad Comercial",
    enunciado: "¿Cuál es la penalización por viajar sin título de transporte válido en un tren de Alta Velocidad-Larga Distancia?",
    opcion_a: "100 euros.",
    opcion_b: "200 euros.",
    opcion_c: "300 euros.",
    opcion_d: "500 euros.",
    respuesta_correcta: "C",
    explicacion: "Las Condiciones Generales (Título VIII, 3.2) establecen una penalización de 300€ para AV-LD."
  },
  {
    categoria: "Actividad Comercial",
    enunciado: "¿Qué indemnización corresponde a un viajero de AVLO por un retraso superior a 90 minutos?",
    opcion_a: "Devolución del 50% del importe.",
    opcion_b: "Devolución del 100% del importe.",
    opcion_c: "Devolución del 25% del importe.",
    opcion_d: "No tiene derecho a indemnización por ser low-cost.",
    respuesta_correcta: "B",
    explicacion: "En AVLO, los retrasos iguales o superiores a 60 min devuelven el 50%, y superiores a 90 min el 100%."
  },
  {
    categoria: "Actividad Comercial",
    enunciado: "¿Cuál es el precio fijo establecido para billetes de niños (4-13 años) en AVLO, con un máximo de dos por adulto?",
    opcion_a: "Gratis.",
    opcion_b: "3 euros.",
    opcion_c: "5 euros.",
    opcion_d: "10 euros.",
    respuesta_correcta: "C",
    explicacion: "Se ofrece un precio fijo de 5€ para menores de 14 años (máximo 2 por adulto de 18+ años)."
  },
  {
    categoria: "Actividad Comercial",
    enunciado: "¿Durante cuántas horas es válido el Combinado Cercanías para obtener el billete gratuito?",
    opcion_a: "2 horas previas a la salida o tras la llegada.",
    opcion_b: "3 horas previas a la salida o tras la llegada.",
    opcion_c: "4 horas previas a la salida o tras la llegada.",
    opcion_d: "Todo el día de la fecha del billete principal.",
    respuesta_correcta: "C",
    explicacion: "El Combinado Cercanías puede utilizarse durante las 4 horas previas a la salida o tras la llegada del tren de LD."
  },
  {
    categoria: "Actividad Comercial",
    enunciado: "Según las Condiciones Generales, ¿cuándo se considera que un viaje ha sido cancelado?",
    opcion_a: "Cuando el tren se retrasa más de 30 minutos.",
    opcion_b: "Cuando no se realiza el viaje en las condiciones previstas en el título de transporte.",
    opcion_c: "Solo cuando hay huelga de personal.",
    opcion_d: "Cuando el viajero decide no viajar por motivos personales.",
    respuesta_correcta: "B",
    explicacion: "La cancelación es la no realización del viaje en las condiciones pactadas (Título IX, 2.1)."
  },
  {
    categoria: "Actividad Comercial",
    enunciado: "Si un viajero decide voluntariamente interrumpir su viaje en una estación intermedia:",
    opcion_a: "Tiene derecho al reintegro del trayecto no utilizado.",
    opcion_b: "No tendrá derecho a ningún reintegro y el título quedará invalidado.",
    opcion_c: "Podrá continuar el viaje al día siguiente con el mismo billete.",
    opcion_d: "Debe abonar una penalización de 50 euros.",
    respuesta_correcta: "B",
    explicacion: "La interrupción voluntaria invalida el billete y no genera derecho a reembolso (Título IV, Cap 4)."
  },
  {
    categoria: "Actividad Comercial",
    enunciado: "¿Qué objetos están expresamente prohibidos en los trenes de Renfe desde diciembre de 2023?",
    opcion_a: "Bicicletas plegables.",
    opcion_b: "Patinetes eléctricos y monociclos eléctricos.",
    opcion_c: "Maletas de más de 25 kg.",
    opcion_d: "Instrumentos musicales de gran tamaño.",
    respuesta_correcta: "B",
    explicacion: "Se prohíbe el acceso con patinetes y dispositivos de movilidad personal eléctricos por seguridad (Título VIII, 3.3)."
  },
  {
    categoria: "Actividad Comercial",
    enunciado: "¿Cuál es la penalización por viajar sin billete válido en los servicios de Cercanías?",
    opcion_a: "50 euros.",
    opcion_b: "100 euros.",
    opcion_c: "150 euros.",
    opcion_d: "200 euros.",
    respuesta_correcta: "B",
    explicacion: "La penalización por viajar sin título válido en Cercanías es de 100€ (Título VIII, 3.2)."
  },

  // --- BATCH 2: PASES, MENORES Y RESPONSABILIDAD ---
  {
    categoria: "Actividad Comercial",
    enunciado: "¿Qué pase internacional está diseñado específicamente para residentes en Europa?",
    opcion_a: "Eurail Pass.",
    opcion_b: "Interrail Pass.",
    opcion_c: "Renfe Spain Pass.",
    opcion_d: "FIP Pass.",
    respuesta_correcta: "B",
    explicacion: "Interrail es el pase para ciudadanos o residentes europeos, mientras que Eurail es para no residentes."
  },
  {
    categoria: "Actividad Comercial",
    enunciado: "En servicios de Larga Distancia, ¿qué edad máxima permite a un niño viajar gratis sin ocupar plaza?",
    opcion_a: "Menores de 2 años.",
    opcion_b: "Menores de 4 años.",
    opcion_c: "Menores de 6 años.",
    opcion_d: "Menores de 14 años.",
    respuesta_correcta: "B",
    explicacion: "Los menores de 4 años pueden viajar gratuitamente compartiendo plaza con un adulto."
  },
  {
    categoria: "Actividad Comercial",
    enunciado: "¿Con cuánta antelación mínima se recomienda presentarse al control de acceso de un tren AVLO?",
    opcion_a: "10 minutos.",
    opcion_b: "20 minutos.",
    opcion_c: "30 minutos.",
    opcion_d: "60 minutos.",
    respuesta_correcta: "C",
    explicacion: "Se recomienda presentarse con al menos 30 minutos de antelación para pasar los controles sin prisas."
  },
  {
    categoria: "Actividad Comercial",
    enunciado: "¿Qué dimensiones máximas debe tener la funda de una bicicleta desmontada en AVLO?",
    opcion_a: "120 x 80 x 30 cm.",
    opcion_b: "140 x 90 x 40 cm.",
    opcion_c: "180 cm sumando las tres dimensiones.",
    opcion_d: "No se permiten bicicletas en AVLO.",
    respuesta_correcta: "B",
    explicacion: "Las bicicletas desmontadas en funda deben medir máximo 140x90x40 cm para ser admitidas como equipaje adicional."
  },
  {
    categoria: "Actividad Comercial",
    enunciado: "Si un tren AV-LD se cancela dentro de las 4 horas previas a la salida, y el viajero NO acepta la alternativa:",
    opcion_a: "No tiene derecho a nada.",
    opcion_b: "Tiene derecho al reintegro del importe del billete.",
    opcion_c: "Tiene derecho al doble del importe del título de transporte.",
    opcion_d: "Se le da un bono para otro viaje.",
    respuesta_correcta: "C",
    explicacion: "Si se cancela en las 4h previas y el cliente rechaza la alternativa, tiene derecho al doble del importe (Título IX, 2.1)."
  },
  {
    categoria: "Actividad Comercial",
    enunciado: "¿Cuál es el coste del complemento de 'Anulación o Cambio' en AVLO?",
    opcion_a: "5 euros.",
    opcion_b: "8 euros.",
    opcion_c: "10 euros.",
    opcion_d: "Es gratuito.",
    respuesta_correcta: "B",
    explicacion: "El complemento de Anulación o Cambio tiene un precio fijo de 8 euros por billete."
  },
  {
    categoria: "Actividad Comercial",
    enunciado: "¿Qué documento NO es válido para acreditar la identidad de un niño menor de 14 años en AVLO?",
    opcion_a: "DNI.",
    opcion_b: "Pasaporte.",
    opcion_c: "Libro de Familia.",
    opcion_d: "Carné de la biblioteca.",
    respuesta_correcta: "D",
    explicacion: "Se aceptan DNI, Pasaporte, Tarjeta de Residencia o Libro de Familia para menores."
  },
  {
    categoria: "Actividad Comercial",
    enunciado: "¿Cuál es el importe máximo de equipajes adicionales que puede llevar una composición sencilla de AVLO?",
    opcion_a: "50 equipajes.",
    opcion_b: "100 equipajes.",
    opcion_c: "200 equipajes.",
    opcion_d: "No hay límite mientras paguen.",
    respuesta_correcta: "B",
    explicacion: "Hay una limitación de 100 equipajes adicionales por composición sencilla (200 en doble)."
  },
  {
    categoria: "Actividad Comercial",
    enunciado: "En el caso de objetos olvidados, ¿quién es el responsable de su custodia?",
    opcion_a: "La Policía Nacional.",
    opcion_b: "El responsable del ámbito correspondiente (estación o tren).",
    opcion_c: "El viajero que lo encuentre.",
    opcion_d: "Se destruyen inmediatamente por seguridad.",
    respuesta_correcta: "B",
    explicacion: "Los objetos hallados se entregan al responsable del ámbito para su custodia temporal (Título VII, Cap 4)."
  }
];

async function importQuestions() {
  console.log("Iniciando importación masiva de preguntas (Temario 2026)...");
  let insertCount = 0;
  let errorCount = 0;
  
  for (const q of newQuestions) {
    // Check if it exists
    const { data: existing } = await client
      .from('preguntas')
      .select('id')
      .eq('enunciado', q.enunciado);

    if (!existing || existing.length === 0) {
      const { error } = await client.from('preguntas').insert([q]);
      if (error) {
        console.error("Error al importar la pregunta:", q.enunciado, error);
        errorCount++;
      } else {
        insertCount++;
      }
    }
  }

  console.log(`¡Éxito! Base de datos revisada. Se insertaron ${insertCount} nuevas preguntas.`);
  if (errorCount > 0) {
    alert(`Proceso terminado. Se añadieron ${insertCount} preguntas nuevas (hubo errores en ${errorCount}). Las que ya existían se han omitido para no crear duplicados.`);
  } else {
    alert(`¡Proceso terminado! Se han añadido ${insertCount} preguntas nuevas al temario. Las que ya existían se han omitido de forma segura para no duplicarlas.`);
  }
}
