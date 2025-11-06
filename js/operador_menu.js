// js/operador_menu.js
import { supabase } from './supabaseClient.js';

// Ejemplo: pedidos pendientes para esta tienda (id_destino = 14)
// Ajusta ids, columnas/estados a tu modelo real
(async () => {
  const ul = document.querySelector('.task-list');
  if (!ul) return;

  // 1) Pedidos a recibir
  const { data: pedRec, error: err1 } = await supabase
    .from('pedido')
    .select('id_pedido, id_origen, id_destino, estado')
    .eq('estado', 'EN TRANSITO')
    .eq('id_destino', 14);

  if (err1) console.error(err1);

  pedRec?.forEach(p => {
    const li = document.createElement('li');
    li.className = 'task-item priority-normal';
    li.innerHTML = `
      <span class="material-icons task-icon">inventory_2</span>
      <div class="task-info">
        <h3>Recibir Pedido #${p.id_pedido}</h3>
        <p>De almacén: ${p.id_origen}</p>
      </div>`;
    li.onclick = () => location.href = `recibir.html?pedido=${p.id_pedido}`;
    ul.appendChild(li);
  });

  // 2) Pedidos a surtir (origen = esta tienda)
  const { data: pedSur, error: err2 } = await supabase
    .from('pedido')
    .select('id_pedido, id_origen, id_destino, estado')
    .eq('estado', 'CAPTURADO')
    .eq('id_origen', 14);

  if (err2) console.error(err2);

  pedSur?.forEach(p => {
    const li = document.createElement('li');
    li.className = 'task-item priority-high';
    li.innerHTML = `
      <span class="material-icons task-icon">task_alt</span>
      <div class="task-info">
        <h3>Surtir Pedido #${p.id_pedido}</h3>
        <p>Destino: ${p.id_destino}</p>
      </div>`;
    li.onclick = () => location.href = `surtir.html?pedido=${p.id_pedido}`;
    ul.appendChild(li);
  });
})();
