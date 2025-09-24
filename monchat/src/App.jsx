import React, { useState, useRef, useEffect } from 'react';

// Le composant principal de l'application.
const App = () => {
    // useState : Gère les états de l'application.
    // `messages` stocke toute la conversation entre l'utilisateur et le bot.
    const [messages, setMessages] = useState([]);
    // `input` stocke le texte que l'utilisateur tape dans la barre de saisie.
    const [input, setInput] = useState("");
    // `isTyping` est un drapeau qui indique si le bot est en train de répondre.
    const [isTyping, setIsTyping] = useState(false);

    // useRef : Crée une référence à un élément DOM.
    // `messagesEndRef` est utilisé pour faire défiler automatiquement la conversation vers le bas.
    const messagesEndRef = useRef(null);

    // Fonction asynchrone pour envoyer un message au backend.
    const sendMessageToBackend = async (query) => {
        // Active le voyant "en train de taper".
        setIsTyping(true);
        try {
            // Fait une requête POST vers le serveur Express local.
            const response = await fetch('https://mon-chat-3fcv.vercel.app/api/chat',{
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ message: query }),
            });
            // Extrait les données JSON de la réponse du serveur.
            const data = await response.json();
            // Désactive le voyant "en train de taper".
            setIsTyping(false);
            // Met à jour la conversation en ajoutant la réponse du bot.
            setMessages(prevMessages => [...prevMessages, { text: data.reply, sender: 'bot' }]);
        } catch (error) {
            // Gère les erreurs de connexion.
            console.error("Erreur lors de l'envoi du message au backend:", error);
            // Désactive le voyant "en train de taper".
            setIsTyping(false);
            // Affiche un message d'erreur si le serveur ne répond pas.
            setMessages(prevMessages => [...prevMessages, { text: "Une erreur s'est produite lors de la connexion au serveur. Veuillez réessayer plus tard.", sender: 'bot' }]);
        }
    };

    // Gère la soumission du formulaire (quand l'utilisateur envoie un message).
    const handleSendMessage = async (e) => {
        e.preventDefault(); // Empêche le rechargement de la page.
        // Si la saisie est vide, on ne fait rien.
        if (input.trim() === '') return;

        // Crée un objet pour le message de l'utilisateur.
        const userMessage = { text: input, sender: 'user' };
        // Ajoute le message de l'utilisateur à la conversation.
        setMessages(prevMessages => [...prevMessages, userMessage]);
        // Réinitialise le champ de saisie.
        setInput('');
        
        // Appelle la fonction pour envoyer le message au backend.
        await sendMessageToBackend(userMessage.text);
    };

    // useEffect : Exécute des effets secondaires après le rendu du composant.
    // Ce hook fait défiler la vue vers le bas à chaque fois que la liste des messages est mise à jour.
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]); // Le hook s'exécute à chaque changement de l'état `messages`.

    // Style de l'arrière-plan de l'application.
    const backgroundStyle = {
      backgroundImage:"url('/arriere plan.jpg')",
    };

    // Le rendu visuel de l'application (JSX).
    return (
        <>
            {/* Conteneur de l'arrière-plan fixe. */}
            <div 
                className="fixed inset-0 bg-cover bg-center" 
                style={backgroundStyle}
            >
                {/* L'overlay semi-transparent avec effet de flou. */}
                <div className="absolute inset-0 bg-black/40 backdrop-blur-md" />
            </div>

            {/* Conteneur principal de l'application avec le contenu défilable. */}
            <div className="relative w-screen min-h-screen flex flex-col items-center z-10">
                {/* En-tête de l'application avec le titre. */}
                <div className="w-full flex items-center justify-between p-4 z-10 text-white">
                    <h1 className="text-3xl font-bold font-['Poppins'] flex items-center">
                        AiFRICf⚽⚽t
                    </h1>
                </div>

                {/* DÉBUT DU CADRE DE CONVERSATION */}
                <div 
                    // Conteneur du chat avec défilement interne (`overflow-y-auto`).
                    className="flex-1 w-full max-w-2xl mx-auto my-4 p-4 rounded-3xl overflow-y-auto shadow-xl z-10 bg-black/40"
                >
                    {/* Affiche le message de bienvenue si la conversation est vide. */}
                    {messages.length === 0 ?(
                        <div className="flex flex-col items-center justify-center flex-1 text-center h-full">
                            <h1 className="text-4xl font-bold font-['Poppins'] text-white">Bienvenue sur AiFRICf⚽⚽t!</h1>
                            <p className="text-[20px] mt-2 text-gray-400">je réponds à toutes tes préoccupations concernant le football africain.</p>
                        </div>
                    ) : (
                        // Affiche tous les messages si la conversation n'est pas vide.
                        <div className="w-full">
                            {/* Utilise la fonction `map` pour créer une bulle de message pour chaque élément de la liste `messages`. */}
                            {messages.map((msg, index) => (
                                <div
                                    key={index}
                                    // Applique les styles CSS pour les bulles de l'utilisateur ou du bot.
                                    className={`my-4 p-4 rounded-3xl max-w-[80%] break-words shadow-md ${
                                        msg.sender === 'user'
                                            ? `ml-auto bg-blue-600 text-white`
                                            : `mr-auto bg-gray-700 text-white`
                                    }`}
                                >
                                    {msg.text}
                                </div>
                            ))}
                            {/* Affiche le voyant "en train de taper" si `isTyping` est vrai. */}
                            {isTyping && (
                                <div className="my-4 p-4 rounded-3xl mr-auto max-w-[80%] bg-gray-700">
                                    <span className="animate-pulse">...</span>
                                </div>
                            )}
                            {/* Div vide qui sert de cible pour le défilement automatique. */}
                            <div ref={messagesEndRef} />
                        </div>
                    )}
                </div>
                {/* FIN DU CADRE DE CONVERSATION */}
                
                {/* Formulaire de saisie de message en bas de l'écran. */}
                <form onSubmit={handleSendMessage} className="bottom w-full flex flex-col items-center p-4 z-10">
                    {/* Zone de saisie. */}
                    <div className="inputBox w-[75%] text-[15px] p-4 flex items-center rounded-[30px] shadow-lg bg-[#181818]">
                        <input
                            type="text"
                            // Champ de saisie.
                            className="bg-transparent flex-1 outline-none border-none text-white"
                            placeholder="écris quelque chose..."
                            id="messageBox"
                            value={input}
                            // Met à jour l'état `input` à chaque saisie.
                            onChange={(e) => setInput(e.target.value)}
                        />
                        {/* Bouton d'envoi. */}
                        <button type="submit" className="px-6 py-2 mr-2 rounded-full transition-colors bg-black text-white font-bold hover:black shadow-lg">
                            Envoyer
                        </button>
                    </div>
                    {/* Texte d'information en bas du formulaire. */}
                    <p className="text-[15px] mt-3 text-gray-300">AiFRICfoot, ton assistant spécialiste du football Africain.</p>
                </form>
            </div>
        </>
    );
};

export default App;
