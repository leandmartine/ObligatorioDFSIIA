import { Groq } from "groq-sdk";

const DEFAULT_MODEL = "openai/gpt-oss-120b";

const crearErrorProveedorIA = (error, operacion) => {
  const errorIA = new Error(
    `No se pudo ${operacion} con el servicio de IA. Intente nuevamente.`,
  );
  errorIA.status = 502;
  errorIA.code = "AI_PROVIDER_ERROR";
  errorIA.providerCode = error?.error?.code || error?.code;
  return errorIA;
};

const getGroqClient = () => {
  if (!process.env.GROQ_API_KEY) {
    const error = new Error("El servicio de IA no está configurado");
    error.status = 503;
    throw error;
  }

  return new Groq({ apiKey: process.env.GROQ_API_KEY });
};

const completar = async (content) => {
  const groq = getGroqClient();
  let completion;
  try {
    completion = await groq.chat.completions.create({
      messages: [
        {
          role: "user",
          content,
        },
      ],
      model: process.env.GROQ_MODEL || DEFAULT_MODEL,
      temperature: 0.2,
      max_completion_tokens: 400,
      stream: false,
    });
  } catch (error) {
    throw crearErrorProveedorIA(error, "generar la descripción");
  }

  const result = completion.choices[0]?.message?.content?.trim();
  if (!result) {
    const error = new Error("El servicio de IA no devolvió una respuesta válida");
    error.status = 502;
    throw error;
  }

  return result;
};

const completarCategoria = async (titulo, categorias, categoriaActual) => {
  const groq = getGroqClient();
  let completion;
  try {
    completion = await groq.chat.completions.create({
      messages: [
        {
          role: "system",
          content: [
            "Eres un clasificador de publicaciones.",
            "Debes elegir exactamente una categoría de la lista recibida.",
            'Responde únicamente un JSON válido con este formato: {"categoria":"NOMBRE_EXACTO"}.',
            "No agregues explicaciones, markdown ni texto fuera del JSON.",
            "El valor de categoria debe copiar exactamente uno de los nombres permitidos.",
          ].join(" "),
        },
        {
          role: "user",
          content: JSON.stringify({
            titulo,
            categoriaRecibida: categoriaActual || null,
            categoriasPermitidas: categorias,
          }),
        },
      ],
      model: process.env.GROQ_MODEL || DEFAULT_MODEL,
      temperature: 0,
      max_completion_tokens: 100,
      stream: false,
    });
  } catch (error) {
    throw crearErrorProveedorIA(error, "clasificar la categoría");
  }

  const result = completion.choices[0]?.message?.content?.trim();
  if (!result) {
    const error = new Error("El servicio de IA no devolvió una categoría");
    error.status = 502;
    throw error;
  }

  try {
    const parsed = JSON.parse(result);
    if (
      typeof parsed.categoria !== "string" ||
      Object.keys(parsed).length !== 1
    ) {
      throw new Error("Formato de categoría inválido");
    }
    return parsed.categoria.trim();
  } catch {
    const error = new Error("El servicio de IA devolvió una categoría inválida");
    error.status = 502;
    throw error;
  }
};

export const generarDescripcionConIA = async (titulo) => {
  const descripcion = await completar(
    [
      "Genera una descripción clara y atractiva para una publicación de compraventa.",
      "Debe estar en español, describir únicamente lo que puede inferirse del título,",
      "no inventar precio, estado ni características específicas, y tener entre 10 y 2000 caracteres.",
      `Título: ${titulo}`,
      "Devuelve únicamente la descripción, sin comillas ni texto adicional.",
    ].join(" "),
  );

  if (descripcion.length < 10 || descripcion.length > 2000) {
    const error = new Error("La IA devolvió una descripción con longitud inválida");
    error.status = 502;
    throw error;
  }

  return descripcion;
};

const normalizarTexto = (texto) =>
  texto
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim()
    .toLowerCase();

export const generarCategoriaConIA = async (titulo, categorias, categoriaActual) => {
  const categoriaSugerida = await completarCategoria(
    titulo,
    categorias,
    categoriaActual,
  );

  const categoriaNormalizada = normalizarTexto(categoriaSugerida);
  const categoriaValida = categorias.find(
    (categoria) => normalizarTexto(categoria) === categoriaNormalizada,
  );

  if (!categoriaValida) {
    const error = new Error("La IA no devolvió una categoría válida");
    error.status = 502;
    throw error;
  }

  return categoriaValida;
};
