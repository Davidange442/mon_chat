const express = require('express');
const router = express.Router();

// Fonction pour envoyer un message à l'API Gemini
const askGemini = async (query) => {
    // Liste des salutations
    const greetings = ['bonjour', 'salut', 'coucou', 'hello', 'yo', 'bonsoir'];
    const lowerCaseQuery = query.toLowerCase();

    // Première étape: Gérer les salutations
    if (greetings.some(greeting => lowerCaseQuery.includes(greeting))) {
        return "Salut ! Pose-moi une question sur le football africain.";
    }

    const API_KEY = process.env.GEMINI_API_KEY;
    const API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-05-20:generateContent?key=" + API_KEY;
    
    // Deuxième étape: Demander à l'IA si la question concerne le football africain.
    const relevancePrompt = `La question suivante est-elle liée au football africain? Répondez par "Oui" ou "Non" uniquement. Question: "${query}"`;
    const relevancePayload = {
        contents: [{ parts: [{ text: relevancePrompt }] }],
    };

    try {
        const relevanceResponse = await fetch(API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(relevancePayload)
        });
        
        const relevanceResult = await relevanceResponse.json();
        const relevanceText = relevanceResult?.candidates?.[0]?.content?.parts?.[0]?.text.trim();

        if (relevanceText.toLowerCase() !== 'oui') {
            return "Désolé, je ne réponds qu'aux questions sur le football africain.";
        }
    } catch (error) {
        console.error("Erreur lors de la vérification de la pertinence:", error);
        return "Une erreur s'est produite lors de la connexion au serveur. Veuillez réessayer plus tard.";
    }

    // Troisième étape: Si la question est pertinente, demander la réponse détaillée.
    const mainPayload = {
        contents: [{ parts: [{ text: query }] }],
        tools: [{ "google_search": {} }],
        systemInstruction: {
            parts: [{ text: "You are a helpful chatbot that answers questions about African football. Be concise and accurate." }]
        },
    };
    
    try {
        const mainResponse = await fetch(API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(mainPayload)
        });
        
        const mainResult = await mainResponse.json();
        const generatedText = mainResult?.candidates?.[0]?.content?.parts?.[0]?.text || "Désolé, je n'ai pas pu générer de réponse.";
        return generatedText;
    } catch (error) {
        console.error("Erreur lors de l'appel à l'API Gemini:", error);
        return "Une erreur s'est produite lors de la connexion au serveur. Veuillez réessayer plus tard.";
    }
};

router.post('/chat', async (req, res) => {
    const userMessage = req.body.message;
    try {
        const reply = await askGemini(userMessage);
        res.json({ reply });
    } catch (error) {
        console.error("Erreur lors de la gestion du chat:", error);
        res.status(500).json({ reply: "Une erreur interne s'est produite." });
    }
});

module.exports = router;
