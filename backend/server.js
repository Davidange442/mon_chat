// Importer les modules nécessaires
const express = require('express');
const cors = require('cors');
// Importer le module dotenv pour les variables d'environnement
require('dotenv').config();

// AJOUT DE LA LIGNE DE DIAGNOSTIC
console.log('Clé d\'API chargée :', process.env.GEMINI_API_KEY ? 'Oui' : 'Non');

// Créer une instance de l'application Express
const app = express();
const port = process.env.PORT || 5000;

// Middleware pour gérer les requêtes
app.use(cors({origin:'https://mon-chat.vercel.app'}));
app.use(express.json()); // Permet d'analyser les corps de requête au format JSON

// Importer les routes de l'API
const chatRoutes = require('./routes/chat');

// Utiliser les routes pour l'API
// Le préfixe '/api' est ajouté à toutes les routes dans chatRoutes.js
app.use('/api', chatRoutes);

// Route de base pour tester que le serveur fonctionne
app.get('/', (req, res) => {
  res.send('Le serveur backend est opérationnel.');
});

// Démarrer le serveur
app.listen(port, () => {
  console.log(`Serveur démarré sur le port ${port}`);
});
