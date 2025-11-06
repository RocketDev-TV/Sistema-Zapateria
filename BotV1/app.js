document.addEventListener("DOMContentLoaded", () => {
    
    // --- Referencias a elementos del DOM ---
    const chatBubble = document.getElementById("chat-bubble");
    const chatWidget = document.getElementById("chat-widget-container");
    const closeChatBtn = document.getElementById("close-chat");
    const chatbox = document.getElementById("chatbox");
    const userInput = document.getElementById("userInput");
    const sendButton = document.getElementById("sendButton");
    const notificationDot = document.getElementById("chat-notification");

    let chatInitialized = false; // Para que el bot solo salude una vez

    // --- EL CEREBRO DEL BOT FALSO ---
    const botResponses = {
        "gancho": "¡Buen día, Gerente! Soy el Asistente SmartFoot. Detecté una oportunidad para reducir el Exceso Tóxico. El producto 'Bota Vaquera SKU 12345' lleva 1.2 años sin venderse en la Tienda 14 (7.0 meses de cobertura), pero la Tienda 9 tiene alta demanda. ¿Quieres que genere una orden de traspaso automático?",
        "sí, crear traspaso": "¡Hecho! He generado la orden de traspaso #T-1001. Para esto, ya le asigné una 'Misión de Resurtido' prioritaria al equipo operativo de Tienda 14.",
        "ignorar": "Entendido. Dejaré esta sugerencia pendiente y la re-evaluaré en 7 días.",
        "default": "No entendí esa respuesta. Por favor, elige 'Sí, crear traspaso' o 'Ignorar'."
    };

    // --- Lógica para abrir/cerrar el chat ---
    chatBubble.addEventListener("click", () => {
        chatWidget.classList.toggle("show");
        notificationDot.style.display = "none"; // Oculta la notificación al abrir
        
        if (!chatInitialized) {
            initChat();
            chatInitialized = true;
        }
    });

    closeChatBtn.addEventListener("click", () => {
        chatWidget.classList.remove("show");
    });

    // --- Funciones del Chat ---
    function addMessage(sender, text) {
        const message = document.createElement("p");
        message.classList.add("message", sender === "SmartFoot Bot" ? "bot" : "user");
        message.innerHTML = `<strong>${sender}:</strong> ${text}`;
        chatbox.appendChild(message);
        chatbox.scrollTop = chatbox.scrollHeight;
    }

    function initChat() {
        setTimeout(() => {
            addMessage("SmartFoot Bot", botResponses.gancho);
            addMessage("SmartFoot Bot", "Escribe: 'Sí, crear traspaso' o 'Ignorar'");
        }, 1000); // Espera 1 seg
    }

    // 2. Manejar respuesta del usuario
    function handleUserResponse(userText) {
        const cleanText = userText.trim().toLowerCase();
        let botReply = "";

        if (cleanText.includes("sí") || cleanText.includes("crear")) {
            botReply = botResponses["sí, crear traspaso"];
        } else if (cleanText.includes("ignorar")) {
            botReply = botResponses["ignorar"];
        } else {
            botReply = botResponses["default"];
        }

        setTimeout(() => {
            addMessage("SmartFoot Bot", botReply);
        }, 1200); // Espera un poquito
    }
    
    // 3. Conectar botón de Enviar
    sendButton.addEventListener("click", () => {
        const text = userInput.value.trim();
        if (text) {
            addMessage("Gerente", text);
            handleUserResponse(text);
            userInput.value = "";
        }
    });

    // (Opcional) Simular que el bot te busca primero
    setTimeout(() => {
        notificationDot.style.display = "block";
    }, 5000);

});