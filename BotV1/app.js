document.addEventListener("DOMContentLoaded", () => {
    
    const chatbox = document.getElementById("chatbox");
    const userInput = document.getElementById("userInput");
    const sendButton = document.getElementById("sendButton");
    
    // URL de tu backend en Flask (corriendo localmente)
    const API_URL = "http://127.0.0.1:5000"; 
    
    let sessionId = null;

    // Función para añadir mensajes al chatbox
    function addMessage(sender, text) {
        const message = document.createElement("p");
        message.innerHTML = `<strong>${sender}:</strong> ${text}`;
        chatbox.appendChild(message);
        chatbox.scrollTop = chatbox.scrollHeight; // Auto-scroll
    }

    // 1. Al cargar la página, crea una sesión
    async function initChat() {
        try {
            const response = await fetch(`${API_URL}/api/session`, { method: "POST" });
            const data = await response.json();
            sessionId = data.session_id;

            // 2. ¡EL TRUCO! Envía un mensaje vacío para disparar el "welcome" proactivo
            sendMessageToBot(""); 

        } catch (error) {
            addMessage("Error", "No se pudo conectar al servidor del bot.");
            console.error(error);
        }
    }

    // 3. Función para enviar mensaje (del usuario o el "truco" inicial)
    async function sendMessageToBot(messageText) {
        if (!sessionId) return; // No hacer nada si no hay sesión

        try {
            const response = await fetch(`${API_URL}/api/message`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    session_id: sessionId,
                    message: messageText
                })
            });

            const data = await response.json();
            // 4. Muestra la respuesta del bot
            addMessage("SmartFoot Bot", data.response);

        } catch (error) {
            addMessage("Error", "No se pudo obtener respuesta del bot.");
            console.error(error);
        }
    }
    
    // 5. Conecta el botón de Enviar
    sendButton.addEventListener("click", () => {
        const text = userInput.value.trim();
        if (text) {
            addMessage("Gerente", text); // Muestra el mensaje del usuario
            sendMessageToBot(text);   // Envía el mensaje al bot
            userInput.value = "";     // Limpia el input
        }
    });

    // Inicia el chat
    initChat();
});