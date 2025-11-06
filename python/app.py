import pyodbc
from flask import Flask, jsonify
from flask_cors import CORS

# =========================================================
#  Configuración
# =========================================================
app = Flask(__name__)
# Habilitamos CORS para que tu front-end pueda llamarnos
CORS(app) 

# --- ¡¡IMPORTANTE: CONFIGURA TU CONEXIÓN!! ---
# Actualiza esto con los datos de tu SQL Server
SERVER = '.\\SQLEXPRESS' # O el nombre de tu servidor: 'localhost', 'server.database.windows.net', etc.
DATABASE = 'zapateria_proto'
USERNAME = 'tu_usuario_sql'
PASSWORD = 'tu_contraseña_sql'
DRIVER = '{ODBC Driver 17 for SQL Server}' # Puede variar un poco si usas otro driver

CONNECTION_STRING = f"DRIVER={DRIVER};SERVER={SERVER};DATABASE={DATABASE};UID={USERNAME};PWD={PASSWORD}"

# Función helper para conectar y ejecutar queries
def get_db_connection():
    try:
        conn = pyodbc.connect(CONNECTION_STRING)
        return conn
    except Exception as e:
        print(f"Error conectando a la DB: {e}")
        return None

# =========================================================
#  API Endpoints
# =========================================================

@app.route('/')
def index():
    return "¡La API de Zapateria Proto está funcionando!"

# --- Endpoint para PRODUCTOS ---

@app.route('/api/productos', methods=['GET'])
def get_productos():
    """
    Obtiene la lista completa de productos.
    """
    conn = get_db_connection()
    if conn is None:
        return jsonify({"error": "No se pudo conectar a la base de datos"}), 500
    
    try:
        cursor = conn.cursor()
        # Ejecutamos el query directo a la tabla
        cursor.execute("SELECT id_producto, sku, nombre, precio, activo FROM producto WHERE activo = 1")
        
        # Obtenemos los nombres de las columnas
        columns = [column[0] for column in cursor.description]
        
        # Creamos una lista de diccionarios (perfecto para JSON)
        productos = []
        for row in cursor.fetchall():
            productos.append(dict(zip(columns, row)))
            
        conn.close()
        
        # Regresamos la lista de productos en formato JSON
        return jsonify(productos)

    except Exception as e:
        conn.close()
        return jsonify({"error": str(e)}), 500

#  Correr la aplicación
if __name__ == '__main__':
    app.run(port=5000, debug=True)