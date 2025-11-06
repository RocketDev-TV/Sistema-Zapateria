# app.py
import os
from flask import Flask, request, jsonify
from flask_cors import CORS
from ibm_watson import AssistantV2
from ibm_cloud_sdk_core.authenticators import IAMAuthenticator

app = Flask(__name__)
CORS(app) # Permite que tu HTML le hable a este servidor

# --- CONFIGURACIÓN DE IBM WATSON ---
# Pon tus credenciales aquí (para el hackathon está bien, 
# en producción se usan variables de entorno)
ASSISTANT_API_KEY = "TU_API_KEY_AQUI"
ASSISTANT_ID = "TU_ASSISTANT_ID_AQUI"
ASSISTANT_URL = "TU_SERVICE_URL_AQUI"

# Autenticación
authenticator = IAMAuthenticator(ASSISTANT_API_KEY)
assistant = AssistantV2(
    version='2021-06-14',
    authenticator=authenticator
)
assistant.set_service_url(ASSISTANT_URL)
# --- FIN DE CONFIGURACIÓN ---


# RUTA 1: Crear una sesión de chat
@app.route("/api/session", methods=["POST"])
def create_session():
    try:
        response = assistant.create_session(assistant_id=ASSISTANT_ID).get_result()
        return jsonify(response)
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# RUTA 2: Enviar un mensaje
@app.route("/api/message", methods=["POST"])
def send_message():
    try:
        data = request.json
        session_id = data.get('session_id')
        message_text = data.get('message', '') # Si está vacío, dispara el "welcome"

        response = assistant.message(
            assistant_id=ASSISTANT_ID,
            session_id=session_id,
            input={'message_type': 'text', 'text': message_text}
        ).get_result()
        
        # Extraer solo el texto de la respuesta
        bot_response = response['output']['generic'][0]['text']
        
        return jsonify({"response": bot_response})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# Corre el servidor
if __name__ == "__main__":
    app.run(debug=True, port=5000)