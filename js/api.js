import { supabase } from './supabaseClient.js';

/* === LECTURAS === */
export async function listarProductos() {
  const { data, error } = await supabase.from('producto')
    .select('id_producto, sku, nombre, precio, activo')
    .eq('activo', true)
    .order('nombre', { ascending: true });
  if (error) throw error;
  return data;
}

export async function verStock(id_almacen) {
  const { data, error } = await supabase.from('stock')
    .select('id_producto, pzas')
    .eq('id_almacen', id_almacen);
  if (error) throw error;
  return data;
}

/* === VENTA === */
export async function crearVenta({ id_almacen, id_usuario, detalles }) {
  const { data, error } = await supabase.rpc('crear_venta', {
    p_id_almacen: id_almacen,
    p_id_usuario: id_usuario,
    p_detalles: detalles // array de objetos -> supabase lo envía como jsonb
  });
  if (error) throw error;
  return data; // id_venta
}

/* === PEDIDO === */
export async function crearPedido({ id_origen, id_destino, creado_por, detalles }) {
  const { data, error } = await supabase.rpc('crear_pedido', {
    p_id_origen: id_origen,
    p_id_destino: id_destino,
    p_creado_por: creado_por,
    p_detalles: detalles
  });
  if (error) throw error;
  return data; // id_pedido
}

export async function surtirPedido(id_pedido, detalles) {
  const { error } = await supabase.rpc('surtir_pedido', {
    p_id_pedido: id_pedido,
    p_detalles: detalles
  });
  if (error) throw error;
  return true;
}

/* === RECEPCIÓN POR SSCC === */
export async function recibirSSCC({ sscc, id_almacen, creado_por }) {
  const { data, error } = await supabase.rpc('recibir_sscc', {
    p_sscc: sscc,
    p_id_almacen: id_almacen,
    p_creado_por: creado_por
  });
  if (error) throw error;
  return data; // id_entrada
}
