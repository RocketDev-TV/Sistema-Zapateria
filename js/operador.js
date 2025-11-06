/* ================================================= */
/* LÓGICA DE LA APP OPERATIVA (Simulación Hackathon) */
/* ================================================= */

document.addEventListener("DOMContentLoaded", () => {
    // Revisa en qué página estamos
    if (document.body.classList.contains("login-page-body")) {
        initLoginPage(); // Lógica de login.html
    } else if (document.body.innerHTML.includes("Misiones Pendientes")) {
        // Menú, no necesita JS por ahora
    } else if (window.location.pathname.includes("surtir.html")) {
        initSurtirPage(); // Lógica de surtir.html
    } else if (window.location.pathname.includes("recibir.html")) {
        initRecibirPage(); // Lógica de recibir.html
    }
});

/* --- LÓGICA DE LOGIN --- */
function initLoginPage() {
    const loginBtn = document.getElementById("login-btn");
    const errorMsg = document.getElementById("error-msg");
    
    loginBtn.addEventListener("click", () => {
        const user = document.getElementById("usuario").value;
        const pass = document.getElementById("password").value;

        // Simulación
        if (user === "operador1" && pass === "1234") {
            window.location.href = "operador_menu.html";
        } else {
            errorMsg.style.display = "block";
        }
    });
}

/* --- Base de Datos de Tareas (Simulada) --- */
const TAREAS_DB = {
    "T-1001": { // Surtir Pedido
        tipo: "SURTIDO",
        titulo: "Surtir Traspaso #T-1001",
        destino: "Tienda 9 (Bot)",
        productos: [
            { id: "SKU-BOTA-12345", nombre: "Bota Vaquera", ubicacion: "PASILLO A-01-B", total: 5 },
            { id: "SKU-TENIS-987", nombre: "Tenis Blanco", ubicacion: "PASILLO C-04-A", total: 10 }
        ]
    },
    "P-890": { // Recibir Pedido
        tipo: "RECEPCION",
        titulo: "Recibir Pedido #P-890",
        origen: "CEDIS Central",
        productos: [
            { id: "SKU-SANDALIA-001", nombre: "Sandalia Dama", total: 20 }
        ]
    },
    "F-12345": { // Recibir Proveedor
        tipo: "RECEPCION",
        titulo: "Recibir Proveedor #F-12345",
        origen: "Proveedor 'Calzado León'",
        productos: [
            { id: "SKU-BOTA-12345", nombre: "Bota Vaquera", total: 50 },
            { id: "SKU-TENIS-987", nombre: "Tenis Blanco", total: 100 }
        ]
    }
};

let TAREA_ACTUAL = null;
let productosPendientes = {}; // { "SKU-BOTA-12345": { total: 5, escaneado: 0 }, ... }

/* --- LÓGICA DE PÁGINA DE SURTIDO --- */
function initSurtirPage() {
    // 1. Obtener qué tarea es de la URL
    const params = new URLSearchParams(window.location.search);
    const taskId = params.get("task") || "T-1001";
    
    TAREA_ACTUAL = TAREAS_DB[taskId];
    if (!TAREA_ACTUAL || TAREA_ACTUAL.tipo !== "SURTIDO") {
        alert("Error: Tarea no válida.");
        window.location.href = "operador_menu.html";
        return;
    }
    
    // 2. Poblar la cabecera
    document.getElementById("task-title").innerText = TAREA_ACTUAL.titulo;
    document.getElementById("task-destino").innerText = TAREA_ACTUAL.destino;
    document.getElementById("task-total-prods").innerText = TAREA_ACTUAL.productos.length;

    // 3. Poblar la lista de productos
    const itemList = document.getElementById("item-list");
    itemList.innerHTML = ""; // Limpiar
    
    TAREA_ACTUAL.productos.forEach(prod => {
        productosPendientes[prod.id] = { total: prod.total, escaneado: 0 };
        
        const li = document.createElement("li");
        li.className = "task-item-detailed";
        li.id = `item-${prod.id}`;
        li.innerHTML = `
            <div class="item-info">
                <h4>${prod.nombre} (${prod.id})</h4>
                <p>Ubicación: <strong>${prod.ubicacion}</strong></p>
            </div>
            <div class="item-qty-badge" id="badge-${prod.id}">
                <span>0 / ${prod.total}</span>
            </div>
        `;
        itemList.appendChild(li);
    });

    // 4. Configurar botón de escaneo
    document.getElementById("scan-button").addEventListener("click", () => simularEscaneo("SURTIDO"));
}

/* --- LÓGICA DE PÁGINA DE RECEPCIÓN --- */
function initRecibirPage() {
    // 1. Obtener qué tarea es de la URL
    const params = new URLSearchParams(window.location.search);
    const taskId = params.get("task") || "P-890";
    
    TAREA_ACTUAL = TAREAS_DB[taskId];
    if (!TAREA_ACTUAL || TAREA_ACTUAL.tipo !== "RECEPCION") {
        alert("Error: Tarea no válida.");
        window.location.href = "operador_menu.html";
        return;
    }
    
    // 2. Poblar la cabecera
    document.getElementById("task-title").innerText = TAREA_ACTUAL.titulo;
    document.getElementById("task-origen").innerText = TAREA_ACTUAL.origen;
    document.getElementById("task-total-prods").innerText = TAREA_ACTUAL.productos.length;

    // 3. Poblar la lista de productos
    const itemList = document.getElementById("item-list");
    itemList.innerHTML = ""; // Limpiar
    
    TAREA_ACTUAL.productos.forEach(prod => {
        productosPendientes[prod.id] = { total: prod.total, escaneado: 0 };
        
        const li = document.createElement("li");
        li.className = "task-item-detailed verification";
        li.id = `item-${prod.id}`;
        li.innerHTML = `
            <div class="item-info">
                <h4>${prod.nombre} (${prod.id})</h4>
            </div>
            <div class="item-qty-verification" id="badge-${prod.id}">
                <span>Esperado: <strong>${prod.total}</strong></span>
                <span>Recibido: <strong class="qty-recibido">0</strong></span>
            </div>
        `;
        itemList.appendChild(li);
    });

    // 4. Configurar botón de escaneo
    document.getElementById("scan-button").addEventListener("click", () => simularEscaneo("RECEPCION"));
}

/* --- LÓGICA DE ESCANEO (Común para ambas) --- */
function simularEscaneo(tipoPagina) {
    const skuEscaneado = prompt("Simulador de Escáner:\nEscriba el SKU a escanear:", "SKU-BOTA-12345");
    if (!skuEscaneado) return;

    if (!productosPendientes[skuEscaneado]) {
        alert(`Error: El SKU "${skuEscaneado}" no pertenece a esta tarea.`);
        return;
    }

    const item = productosPendientes[skuEscaneado];
    const li = document.getElementById(`item-${skuEscaneado}`);

    // Incrementar el conteo
    item.escaneado++;
    console.log("BEEP!");

    if (tipoPagina === "SURTIDO") {
        // Lógica de Surtido (Picking)
        const badge = document.getElementById(`badge-${skuEscaneado}`);
        badge.querySelector("span").innerText = `${item.escaneado} / ${item.total}`;

        if (item.escaneado === item.total) {
            li.classList.add("scanned"); // "scanned" pone el badge verde
        } else if (item.escaneado > item.total) {
            alert(`¡Cuidado! Ya surtió ${item.escaneado} de ${item.total}.`);
            // En un sistema real, esto podría bloquearse o requerir autorización
            badge.style.backgroundColor = "var(--color-danger)"; // Alerta visual
            badge.style.color = "white";
        }

    } else if (tipoPagina === "RECEPCION") {
        // Lógica de Recepción (Verificación)
        const badge = document.getElementById(`badge-${skuEscaneado}`);
        badge.querySelector(".qty-recibido").innerText = item.escaneado;
        
        // Clases de estado visual
        li.classList.remove("scanned-partial", "scanned-ok", "scanned-over");
        if (item.escaneado < item.total) {
            li.classList.add("scanned-partial"); // Amarillo
        } else if (item.escaneado === item.total) {
            li.classList.add("scanned-ok"); // Verde
        } else {
            li.classList.add("scanned-over"); // Rojo (recibió de más)
        }
    }

    // Checar si ya se acabó toda la tarea
    verificarFinTarea(tipoPagina);
}

function verificarFinTarea(tipoPagina) {
    let tareaCompleta = true;
    for (const sku in productosPendientes) {
        if (tipoPagina === "SURTIDO") {
            // En surtido, DEBE ser exacto
            if (productosPendientes[sku].escaneado !== productosPendientes[sku].total) {
                tareaCompleta = false;
                break;
            }
        } else if (tipoPagina === "RECEPCION") {
            // En recepción, puede continuar incluso si hay discrepancias
            // Por ahora, solo checamos si al menos se escaneó 1 de cada
            if (productosPendientes[sku].escaneado === 0) {
                tareaCompleta = false;
                break;
            }
        }
    }

    if (tareaCompleta) {
        // Si la tarea está completa, cambiamos el botón a "Finalizar"
        const scanButton = document.getElementById("scan-button");
        scanButton.innerText = "Completar Tarea";
        scanButton.style.backgroundColor = "var(--color-success)";
        scanButton.onclick = () => {
            alert("¡Tarea Completada!\n\nTodos los productos fueron procesados. Redirigiendo al menú.");
            // En un proyecto real, aquí harías el FETCH al backend para
            // actualizar la DB (ej. `UPDATE pedido_det SET cant_surt = ...`)
            window.location.href = "operador_menu.html";
        };
    }
}