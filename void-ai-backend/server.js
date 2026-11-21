
const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

const OLLAMA_URL = "http://127.0.0.1:11434/api/chat";
const MODELO = "qwen2.5:0.5b";

// Comprobar que el servidor funciona
app.get("/", (req, res) => {
    res.json({
        mensaje: "VOID AI está funcionando 🚀",
        motor: "Ollama",
        modelo: MODELO
    });
});

// Conversar con VOID AI
app.post("/api/chat", async (req, res) => {
    try {
        const { mensaje } = req.body;

        if (!mensaje || typeof mensaje !== "string" || !mensaje.trim()) {
            return res.status(400).json({
                error: "Escribe un mensaje."
            });
        }

        if (mensaje.length > 4000) {
            return res.status(400).json({
                error: "El mensaje es demasiado largo."
            });
        }

        const respuestaIA = await fetch(OLLAMA_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                model: MODELO,
                stream: false,
                messages: [
                    {
                        role: "system",
                        content: `
                            Eres VOID AI, el asistente inteligente
                            de la marca VOID WEAR.

                            Eres amable, creativo, juvenil y útil.
                            Ayudas con moda, ropa, diseños,
                            creatividad y preguntas generales.

                            Responde en el idioma del usuario.
                            Sé claro y evita respuestas innecesariamente largas.
                        `
                    },
                    {
                        role: "user",
                        content: mensaje.trim()
                    }
                ]
            })
        });

        if (!respuestaIA.ok) {
            throw new Error("Ollama no pudo generar la respuesta.");
        }

        const datos = await respuestaIA.json();

        res.json({
            respuesta: datos.message.content
        });

    } catch (error) {
        console.error("Error de VOID AI:", error.message);

        res.status(500).json({
            error: "VOID AI no pudo responder. Comprueba que Ollama esté funcionando."
        });
    }
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`VOID AI funcionando en http://localhost:${PORT}`);
});
