/*
 * ==========================================
 * CEREBRO ÚNICO DE SIMULACIÓN (main.js)
 * ==========================================
 * - Sin backend, todo simulado en el frontend.
 * - Controla todas las páginas:
 * 1. Login (index.html)
 * 2. Dashboard (html/dashboard.html)
 * 3. App Almacén (html/operador_menu.html, surtir.html, recibir.html)
 * 4. App Caja (html/caja.html)
 */

// --- Base de Datos Falsa (Simulación) ---
const FAKE_DB = {
    // Productos que existen en el sistema
    productos: {
        "SNK-001": { nombre: "Tenis Runner Pro", precio: 1899.90 },
        "BOT-456": { nombre: "Bota de Piel Clásica", precio: 2499.50 },
        "ZAP-123": { nombre: "Zapato Casual Hombre", precio: 1200.00 },
        "SAN-777": { nombre: "Sandalia Dama Verano", precio: 799.00 },
        "TAC-999": { nombre: "Zapatilla Elegante Tacón", precio: 1599.00 }
    },
    // Tareas pendientes para el auxiliar
    tareas: {
        "T-1001": {
            titulo: "Surtir T-1001",
            destino: "Tienda 9",
            items: [
                { sku: "SNK-001", nombre: "Tenis Runner Pro", ubicacion: "A-01-C", total: 1 },
                { sku: "BOT-456", nombre: "Bota de Piel Clásica", ubicacion: "B-03-A", total: 1 }
            ]
        },
        "P-890": {
            titulo: "Recibir P-890",
            origen: "CEDIS Central",
            items: [
                { sku: "ZAP-123", nombre: "Zapato Casual Hombre", total: 5 },
                { sku: "SAN-777", nombre: "Sandalia Dama Verano", total: 10 }
            ]
        },
        "F-12345": {
            titulo: "Recibir F-12345",
            origen: "Proveedor 'Calzado del Sol'",
            items: [
                { sku: "TAC-999", nombre: "Zapatilla Elegante Tacón", total: 8 }
            ]
        }
    }
};

// --- ROUTER: Decide qué hacer en cada página ---

document.addEventListener('DOMContentLoaded', () => {
    const path = window.location.pathname;

    // Detecta la página sin importar si tiene /html/ o no
    if (path.includes('index.html') || path.endsWith('/')) {
        setupLoginPage();
    } 
    else if (path.includes('dashboard.html')) {
        setupDashboardPage(); // Función modificada
    }
    else if (path.includes('operador_menu.html')) {
        setupMenuPage();
    }
    else if (path.includes('surtir.html')) {
        setupSurtirPage();
    }
    else if (path.includes('recibir.html')) {
        setupRecibirPage();
    }
    else if (path.includes('caja.html')) {
        setupCajaPage();
    }
});


// --- 1. LÓGICA DE LOGIN (index.html) ---

function setupLoginPage() {
    const loginBtn = document.getElementById('login-btn');
    const userTypeSelect = document.getElementById('user-type');

    if (loginBtn) {
        loginBtn.addEventListener('click', () => {
            const selectedRole = userTypeSelect.value;
            
            loginBtn.textContent = 'Ingresando...';
            
            // Simula un pequeño retraso y redirecciona
            setTimeout(() => {
                switch (selectedRole) {
                    case 'gerente':
                        window.location.href = 'html/dashboard.html';
                        break;
                    case 'auxiliar':
                        window.location.href = 'html/operador_menu.html';
                        break;
                    case 'vendedor':
                        window.location.href = 'html/caja.html';
                        break;
                }
            }, 500);
        });
    }
}


// --- 2. LÓGICA DEL DASHBOARD (html/dashboard.html) ---

// *************** FUNCIÓN MODIFICADA: SIN LÓGICA DE GRÁFICA ***************
function setupDashboardPage() {
    
    // --- Lógica de la Gráfica (SIMPLIFICADA: NO SE HACE NADA AQUÍ) ---
    // NOTA: EL HTML ahora muestra un dato estático grande en lugar del canvas.
    
    // --- Lógica del Asistente (FAQ) ---
    const chatBubble = document.getElementById('chat-bubble');
    const chatWidget = document.getElementById('chat-widget-container');
    const closeChatBtn = document.getElementById('close-chat');
    const chatbox = document.getElementById('chatbox');
    const sendButton = document.getElementById('sendButton');
    const faqSelect = document.getElementById('faq-select'); 
    const chatNotification = document.getElementById('chat-notification');

    if (!chatBubble) return;

    // Respuestas predefinidas
    const FAQ_RESPONSES = {
        '1': "El inventario está en <strong>7.0 meses</strong> porque tenemos un problema de rotación (< 3.5 vueltas). Específicamente, hay **150 unidades** del SKU 'SNK-001' que llevan 90 días sin venderse.",
        '2': "La baja <strong>Calidad de Inventario</strong> indica que el 41.8% de nuestro stock ($3.6M) está en riesgo de obsolescencia. Esto está relacionado con el problema de sobre-stock en modelos lentos como el 'SNK-001'.",
        '3': "Un <strong>Tiempo Promedio de Recepción</strong> de 45 minutos (Meta: < 15min) genera un cuello de botella logístico. Esto retrasa la disponibilidad de la nueva mercancía y presiona al Auxiliar de Almacén.",
        '4': "El plan para subir la <strong>Exactitud (IRA)</strong> del 91% al 99% es implementar un **Ciclo de Conteo Diario** de 5 SKUs clave. Esto nos ayudará a detectar errores de ubicación y minimizar las pérdidas por diferencias de inventario."
    };

    // Inicialización del chat
    addBotMessage("Bienvenido al Asistente. Por favor, selecciona una de las preguntas frecuentes para obtener un diagnóstico rápido.");
    chatNotification.style.display = 'block'; // Muestra la notificación al inicio

    // Abrir y cerrar el chat
    chatBubble.addEventListener('click', () => {
        chatWidget.classList.add('show');
        chatNotification.style.display = 'none';
    });
    closeChatBtn.addEventListener('click', () => {
        chatWidget.classList.remove('show');
    });

    // Habilitar/Deshabilitar botón de Enviar
    faqSelect.addEventListener('change', () => {
        sendButton.disabled = !faqSelect.value;
    });

    // Manejar el envío (ahora selección del FAQ)
    sendButton.addEventListener('click', handleFaqSelection);

    function handleFaqSelection() {
        const questionId = faqSelect.value;
        const questionText = faqSelect.options[faqSelect.selectedIndex].text;

        if (!questionId) return;

        // 1. Muestra la pregunta del usuario
        addUserMessage(questionText);

        // 2. Muestra la respuesta del bot
        setTimeout(() => {
            addBotMessage(FAQ_RESPONSES[questionId]);
            // Opcional: Sugerencia de acción para el Gerente
            if (questionId === '1') {
                addBotMessage("¿Deseas generar el **Traspaso #T-1001** para mover ese stock a una tienda de mayor demanda?");
            }
            
            // 3. Resetea el select
            faqSelect.value = '';
            sendButton.disabled = true;

        }, 1000);
    }

    function addBotMessage(message) {
        const msgElement = document.createElement('div');
        msgElement.classList.add('message', 'bot');
        msgElement.innerHTML = `<p>${message}</p>`;
        chatbox.appendChild(msgElement);
        chatbox.scrollTop = chatbox.scrollHeight;
    }

    function addUserMessage(message) {
        const msgElement = document.createElement('div');
        msgElement.classList.add('message', 'user');
        msgElement.innerHTML = `<p>${message}</p>`;
        chatbox.appendChild(msgElement);
        chatbox.scrollTop = chatbox.scrollHeight;
    }
}


// --- 3. LÓGICA DE ALMACÉN (operador_menu.html, surtir.html, recibir.html) ---

// Estado global para la simulación de escaneo
let taskState = {};
let itemsToScan = 0;
let itemsScanned = 0;

function setupMenuPage() {
    console.log("Menú de operador cargado.");
}

// Lógica de Surtir
function setupSurtirPage() {
    // Obtiene el ID de la tarea de la URL, si no, usa T-1001
    const params = new URLSearchParams(window.location.search);
    const taskId = params.get('task') || "T-1001";
    const taskData = FAKE_DB.tareas[taskId];

    if (!taskData) {
        alert('Error: Tarea no encontrada');
        window.location.href = 'operador_menu.html';
        return;
    }

    // Reinicia el estado y calcula totales
    taskState = {};
    itemsScanned = 0;
    itemsToScan = taskData.items.reduce((sum, item) => sum + item.total, 0);

    // Llenar la info de la cabecera
    document.getElementById('task-title').textContent = taskData.titulo;
    document.getElementById('task-destino').textContent = taskData.destino;
    document.getElementById('task-total-prods').textContent = taskData.items.length;

    // Llenar la lista de items
    const itemList = document.getElementById('item-list');
    itemList.innerHTML = '';
    taskData.items.forEach(item => {
        taskState[item.sku] = {
            scanned: 0,
            total: item.total
        };

        const li = document.createElement('li');
        li.className = 'task-item-detailed';
        li.dataset.sku = item.sku;
        
        li.innerHTML = `
            <div class="item-info">
                <h4>${item.nombre}</h4>
                <p>SKU: <strong>${item.sku}</strong></p>
                <p>Ubicación: <strong>${item.ubicacion}</strong></p>
            </div>
            <span class="item-qty-badge" id="qty-${item.sku}">0 / ${item.total}</span>
        `;
        itemList.appendChild(li);
    });
    
    // Configurar el input de escaneo
    const scanInput = document.getElementById('scan-input');
    const completeBtn = document.getElementById('complete-task-btn');

    scanInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            const sku = scanInput.value.trim().toUpperCase();
            if (taskState[sku]) {
                handleScan(sku);
            } else {
                alert(`SKU "${sku}" no encontrado en esta tarea.`);
            }
            scanInput.value = '';
        }
    });
    
    completeBtn.addEventListener('click', () => {
        alert(`¡Tarea "${taskData.titulo}" completada exitosamente!`);
        window.location.href = 'operador_menu.html';
    });
}

// Lógica de Recibir
function setupRecibirPage() {
    // Obtener ID de la URL
    const params = new URLSearchParams(window.location.search);
    const taskId = params.get('task') || "P-890"; // Default a P-890 si no hay task
    const taskData = FAKE_DB.tareas[taskId];

    if (!taskData) {
        alert('Error: Tarea no encontrada');
        window.location.href = 'operador_menu.html';
        return;
    }

    // Reinicia el estado y calcula totales
    taskState = {};
    itemsScanned = 0;
    itemsToScan = taskData.items.reduce((sum, item) => sum + item.total, 0);

    // Llenar la info de la cabecera
    document.getElementById('task-title').textContent = taskData.titulo;
    document.getElementById('task-origen').textContent = taskData.origen;
    document.getElementById('task-total-prods').textContent = taskData.items.length;

    // Llenar la lista de items
    const itemList = document.getElementById('item-list');
    itemList.innerHTML = ''; // Limpiar lista
    taskData.items.forEach(item => {
        taskState[item.sku] = {
            scanned: 0,
            total: item.total
        };

        const li = document.createElement('li');
        li.className = 'task-item-detailed';
        li.dataset.sku = item.sku;
        
        li.innerHTML = `
            <div class="item-info">
                <h4>${item.nombre}</h4>
                <p>SKU: <strong>${item.sku}</strong></p>
            </div>
            <span class="item-qty-badge" id="qty-${item.sku}">0 / ${item.total}</span>
        `;
        itemList.appendChild(li);
    });
    
    // Configurar el input de escaneo
    const scanInput = document.getElementById('scan-input');
    const completeBtn = document.getElementById('complete-task-btn');

    scanInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            const sku = scanInput.value.trim().toUpperCase();
            if (taskState[sku]) {
                handleScan(sku);
            } else {
                alert(`SKU "${sku}" no encontrado en esta tarea.`);
            }
            scanInput.value = '';
        }
    });
    
    completeBtn.addEventListener('click', () => {
        alert(`¡Tarea "${taskData.titulo}" completada exitosamente!`);
        window.location.href = 'operador_menu.html';
    });
}


function handleScan(sku) {
    const item = taskState[sku];
    const completeBtn = document.getElementById('complete-task-btn');
    
    if (item.scanned < item.total) {
        item.scanned++;
        itemsScanned++;

        // Actualizar UI
        const qtyBadge = document.getElementById(`qty-${sku}`);
        qtyBadge.textContent = `${item.scanned} / ${item.total}`;

        if (item.scanned === item.total) {
            // Marcar item como completo
            const li = document.querySelector(`li[data-sku="${sku}"]`);
            li.classList.add('scanned');
        }
        
        // Verificar si la tarea está completa
        if (itemsScanned === itemsToScan) {
            completeBtn.disabled = false;
            completeBtn.textContent = 'Completar Tarea';
        }
    } else {
        alert(`SKU "${sku}" ya está completo.`);
    }
}


// --- 4. LÓGICA DE CAJA (html/caja.html) ---

let cart = {}; // { "SNK-001": { data: {...}, qty: 1 }, ... }

function setupCajaPage() {
    const scanInput = document.getElementById('caja-scan-input');
    const addBtn = document.getElementById('caja-add-btn');
    const chargeBtn = document.getElementById('caja-charge-btn');
    const modal = document.getElementById('success-modal');
    const closeModalBtn = document.getElementById('modal-close-btn');

    addBtn.addEventListener('click', addProductToCart);
    scanInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            addProductToCart();
        }
    });
    
    chargeBtn.addEventListener('click', handleCharge);
    closeModalBtn.addEventListener('click', resetCart);

    updateCartUI(); // Inicializa la UI
}

function addProductToCart() {
    const scanInput = document.getElementById('caja-scan-input');
    const sku = scanInput.value.trim().toUpperCase();
    const productData = FAKE_DB.productos[sku];

    if (!productData) {
        alert(`Error: Producto con SKU "${sku}" no encontrado.`);
        scanInput.value = '';
        scanInput.focus();
        return;
    }

    if (cart[sku]) {
        // Si ya está en el carrito, suma 1
        cart[sku].qty++;
    } else {
        // Si es nuevo, lo agrega
        cart[sku] = {
            data: productData,
            qty: 1
        };
    }
    
    scanInput.value = '';
    scanInput.focus();
    updateCartUI();
}

function updateCartUI() {
    const cartItemsContainer = document.getElementById('caja-cart-items');
    const totalAmountEl = document.getElementById('caja-total-amount');
    const chargeBtn = document.getElementById('caja-charge-btn');
    
    let totalAmount = 0;
    cartItemsContainer.innerHTML = ''; // Limpiar carrito

    const skus = Object.keys(cart);

    if (skus.length === 0) {
        chargeBtn.disabled = true;
        // Mostrar mensaje de carrito vacío
        cartItemsContainer.innerHTML = `
            <div class="empty-cart-message" id="empty-cart-msg">
                <span class="material-icons">shopping_cart_checkout</span>
                Aún no hay productos en el carrito
            </div>
        `;
    } else {
        chargeBtn.disabled = false;
        skus.forEach(sku => {
            const item = cart[sku];
            const subtotal = item.data.precio * item.qty;
            totalAmount += subtotal;

            const itemEl = document.createElement('div');
            itemEl.className = 'cart-item';
            itemEl.innerHTML = `
                <div class="cart-item-name">
                    ${item.data.nombre}
                    <span>SKU: ${sku}</span>
                </div>
                <div class="cart-item-price">$${item.data.precio.toFixed(2)}</div>
                <div class="cart-item-qty">
                    <button class="btn-qty-minus" data-sku="${sku}">-</button>
                    <input type="number" value="${item.qty}" data-sku="${sku}" min="1">
                    <button class="btn-qty-plus" data-sku="${sku}">+</button>
                </div>
                <div class="cart-item-subtotal">$${subtotal.toFixed(2)}</div>
                <div class="cart-item-remove">
                    <button class="btn btn-danger btn-sm" data-sku="${sku}">
                        <span class="material-icons">delete</span>
                    </button>
                </div>
            `;
            cartItemsContainer.appendChild(itemEl);
        });
    }

    totalAmountEl.textContent = `$${totalAmount.toFixed(2)}`;

    // Añadir listeners a los botones del carrito
    document.querySelectorAll('.btn-qty-plus').forEach(btn => btn.addEventListener('click', e => updateQty(e.target.dataset.sku, 1)));
    document.querySelectorAll('.btn-qty-minus').forEach(btn => btn.addEventListener('click', e => updateQty(e.target.dataset.sku, -1)));
    document.querySelectorAll('.cart-item-remove button').forEach(btn => btn.addEventListener('click', e => updateQty(e.currentTarget.dataset.sku, 0)));
    document.querySelectorAll('.cart-item-qty input').forEach(input => input.addEventListener('change', e => setQty(e.target.dataset.sku, parseInt(e.target.value, 10))));
}

function updateQty(sku, change) {
    if (!cart[sku]) return;

    if (change === 0) { // 0 significa borrar
        delete cart[sku];
    } else {
        cart[sku].qty += change;
        if (cart[sku].qty < 1) {
            delete cart[sku]; // Si baja de 1, se borra
        }
    }
    updateCartUI();
}

function setQty(sku, newQty) {
    if (!cart[sku]) return;
    
    if (newQty < 1 || !newQty) {
        delete cart[sku]; // Si ponen 0 o un número inválido, se borra
    } else {
        cart[sku].qty = newQty;
    }
    updateCartUI();
}

function handleCharge() {
    const modal = document.getElementById('success-modal');
    const modalTotal = document.getElementById('modal-total-amount');
    const totalAmount = document.getElementById('caja-total-amount').textContent;

    modalTotal.textContent = totalAmount;
    modal.classList.add('show');
}

function resetCart() {
    const modal = document.getElementById('success-modal');
    cart = {}; // Vacía el carrito
    modal.classList.remove('show');
    updateCartUI();
    document.getElementById('caja-scan-input').focus();
}