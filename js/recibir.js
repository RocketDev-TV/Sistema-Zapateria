// js/recibir.js
import { supabase } from './supabaseClient.js';

const input = document.getElementById('scan-input');
const params = new URLSearchParams(location.search);
const idAlmacen = 14; // tienda actual (ajusta)

if (input) {
  input.addEventListener('keydown', async (e) => {
    if (e.key !== 'Enter') return;
    const sscc = input.value.trim();
    if (!sscc) return;

    // Llama a tu función/PROCEDURE en Postgres (definida en tu BD de Supabase)
    // Si seguiste mi script, el RPC se llama sp_recibir_sscc(sscc, id_almacen, creado_por)
    const user = JSON.parse(localStorage.getItem('sf_user') || '{}');
    const creado_por = user?.id_usuario || null;

    const { data, error } = await supabase.rpc('sp_recibir_sscc', {
      sscc,
      id_almacen: idAlmacen,
      creado_por,
    });

    if (error) {
      alert('Error al recibir SSCC: ' + error.message);
      console.error(error);
      return;
    }

    alert('Paquete recibido correctamente');
    input.value = '';
  });
}
