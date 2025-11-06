/* ================================================= */
/* LÓGICA DE LA APP OPERATIVA (Simulación Hackathon) */
/* ================================================= */

document.addEventListener("DOMContentLoaded", () => {
    // Revisa en qué página estamos
    if (document.getElementById("login-btn")) {
        initLoginPage();
    } else if (document.body.innerHTML.includes("Misiones Pendientes")) {
        // Estamos en el menú, no necesita JS por ahora
    } else if (document.getElementById("scanner-preview")) {
        initScannerPage();
    }
});

/* --- LÓGICA DE LOGIN --- */
function initLoginPage() {
    const loginBtn = document.getElementById("login-btn");
    const errorMsg = document.getElementById("error-msg");
    
    loginBtn.addEventListener("click", () => {
        const user = document.getElementById("usuario").value;
        const pass = document.getElementById("password").value;

        // Simulación de login (en un proyecto real, esto es un fetch)
        if (user === "operador1" && pass === "1234") {
            // ¡Login exitoso! Redirige al menú de misiones
            window.location.href = "operador_menu.html";
        } else {
            // Error
            errorMsg.style.display = "block";
        }
    });
}

/* --- LÓGICA DE PANTALLA DE SCANNER --- */

// Datos de simulación para las tareas
const TAREAS_DB = {
    "surtido_traspaso": {
        titulo: "Surtir Traspaso #T-1001",
        productos: [
            { id: "SKU-BOTA-12345", nombre: "Bota Vaquera", total: 5 },
            { id: "SKU-TENIS-987", nombre: "Tenis Blanco", total: 10 }
        ]
    },
    "recibir_traspaso": {
        titulo: "Recibir Pedido #P-890",
        productos: [
            { id: "SKU-SANDALIA-001", nombre: "Sandalia Dama", total: 20 }
        ]
    },
    "recibir_proveedor": {
        titulo: "Recibir Proveedor #F-12345",
        productos: [
            { id: "SKU-BOTA-12345", nombre: "Bota Vaquera", total: 50 },
            { id: "SKU-TENIS-987", nombre: "Tenis Blanco", total: 100 }
        ]
    }
};

let TAREA_ACTUAL = null;
let productosPendientes = {}; // { "SKU-BOTA-12345": 5, ... }

function initScannerPage() {
    // 1. Obtener qué tarea es de la URL (ej. ?task=surtido_traspaso)
    const params = new URLSearchParams(window.location.search);
    const taskId = params.get("task") || "surtido_traspaso"; // Default por si acaso
    
    TAREA_ACTUAL = TAREAS_DB[taskId];
    
    // 2. Poblar la UI con los datos de la tarea
    document.getElementById("scan-title").innerText = TAREA_ACTUAL.titulo;
    const scanList = document.getElementById("scan-list");
    scanList.innerHTML = ""; // Limpiar lista

    TAREA_ACTUAL.productos.forEach(prod => {
        // Añadir a la lista de pendientes
        productosPendientes[prod.id] = {
            nombre: prod.nombre,
            total: prod.total,
            escaneado: 0
        };
        
        // Crear el HTML
        const li = document.createElement("li");
        li.className = "scan-item";
        li.id = `item-${prod.id}`;
        li.innerHTML = `
            <span>${prod.nombre} (${prod.id})</span>
            <span>0 / ${prod.total}</span>
        `;
        scanList.appendChild(li);
    });

    // 3. Configurar el botón de escaneo
    const scanButton = document.getElementById("scan-button");
    scanButton.addEventListener("click", simularEscaneo);
}

function simularEscaneo() {
    // En un proyecto real, aquí se abriría la cámara.
    // Para el hackathon, simulamos con un prompt.
    
    const skuEscaneado = prompt("Simulador de Escáner:\nEscriba el SKU a escanear:", "SKU-BOTA-12345");

    if (!skuEscaneado) return; // Si el usuario cancela

    // 4. Validar el SKU
    if (productosPendientes[skuEscaneado]) {
        const item = productosPendientes[skuEscaneado];
        
        if (item.escaneado < item.total) {
            // Escaneo exitoso
            item.escaneado++;
            
            // Actualizar UI
            const li = document.getElementById(`item-${skuEscaneado}`);
            li.querySelector("span:last-child").innerText = `${item.escaneado} / ${item.total}`;
            
            // Poner sonido de "beep" (simulado)
            console.log("BEEP!");
            
            // Si ya se escaneó todo de este item
            if (item.escaneado === item.total) {
                li.classList.add("scanned");
            }

            // Checar si ya se acabó toda la tarea
            verificarFinTarea();
            
        } else {
            alert(`Error: Ya se escanearon todos los ${item.total} pares de "${item.nombre}".`);
        }
    } else {
        alert(`Error: El SKU "${skuEscaneado}" no pertenece a esta tarea.`);
    }
}

function verificarFinTarea() {
    let tareaCompleta = true;
    for (const sku in productosPendientes) {
        if (productosPendientes[sku].escaneado < productosPendientes[sku].total) {
            tareaCompleta = false;
            break;
        }
    }

    if (tareaCompleta) {
        alert("¡Tarea Completada!\n\nTodos los productos fueron escaneados. Redirigiendo al menú.");
        // En un proyecto real, aquí harías el FETCH al backend para
        // actualizar la DB (ej. `UPDATE pedido_det SET cant_surt = ...`)
        window.location.href = "operador_menu.html";
    }
}