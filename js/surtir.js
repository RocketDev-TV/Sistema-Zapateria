// js/surtir.js
import { supabase } from './supabaseClient.js';

const input = document.getElementById('scan-input');
const params = new URLSearchParams(location.search);
const idPedido = Number(params.get('pedido'));     // viene desde el menú
const idAlmacen = 14; // origen

// 1) Pintar líneas del pedido
(async () => {
  const ul = document.getElementById('item-list');
  const { data: det, error } = await supabase
    .from('pedido_det')
    .select('renglon, id_producto, cant_sol, cant_surt, producto:producto(nombre, sku)')
    .eq('id_pedido', idPedido);

  if (error) return console.error(error);
  det?.forEach(d => {
    const li = document.createElement('li');
    li.id = `ln-${d.renglon}`;
    li.textContent = `${d.producto?.nombre || d.id_producto}  ${d.cant_surt}/${d.cant_sol}`;
    ul.appendChild(li);
  });
})();

// 2) Escaneo: incrementa cant_surt de la línea correspondiente
if (input) {
  input.addEventListener('keydown', async (e) => {
    if (e.key !== 'Enter') return;
    const sku = input.value.trim();
    if (!sku) return;
    input.value = '';

    // Resuelve línea por SKU
    const { data: prod } = await supabase
      .from('producto').select('id_producto').eq('sku', sku).maybeSingle();

    if (!prod?.id_producto) { alert('SKU no existe'); return; }

    const { data: linea } = await supabase
      .from('pedido_det')
      .select('id_pedido, renglon, cant_sol, cant_surt')
      .eq('id_pedido', idPedido)
      .eq('id_producto', prod.id_producto)
      .maybeSingle();

    if (!linea) { alert('SKU no está en el pedido'); return; }
    if (linea.cant_surt >= linea.cant_sol) { alert('Línea completa'); return; }

    // Actualiza +1 (tu trigger descarga stock y crea mov_inv)
    const { error: errUpd } = await supabase
      .from('pedido_det')
      .update({ cant_surt: linea.cant_surt + 1 })
      .eq('id_pedido', idPedido)
      .eq('renglon', linea.renglon);

    if (errUpd) { alert('Error: '+errUpd.message); return; }

    // Refresca UI
    const li = document.getElementById(`ln-${linea.renglon}`);
    if (li) li.textContent = li.textContent.replace(
      `${linea.cant_surt}/${linea.cant_sol}`,
      `${linea.cant_surt + 1}/${linea.cant_sol}`
    );
  });
}
