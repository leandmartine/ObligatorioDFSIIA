

// no se coloca servicio de ai ya que no tenemos definido cual usar.
export const ai = async (req, res) => {
  const { prompt } = req.body;
  const promptDepurado = `${prompt}`;
  const aiResponse = await aiService(promptDepurado);
  res.json({ response: aiResponse });
}