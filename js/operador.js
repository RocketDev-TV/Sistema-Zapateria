const BASE = ""; // mismo origen (Flask sirve los archivos). Si separas front/back, pon la URL del backend.

export async function listarProductos() {
  const r = await fetch(`${BASE}/api/productos`);
  return await r.json();
}

export async function verStock(idAlmacen) {
  const r = await fetch(`${BASE}/api/stock?id_almacen=${idAlmacen}`);
  return await r.json();
}

export async function crearVenta({ id_almacen, id_usuario, detalles }) {
  const r = await fetch(`${BASE}/api/ventas`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ id_almacen, id_usuario, detalles })
  });
  return await r.json();
}

export async function crearPedido({ id_origen, id_destino, creado_por, detalles }) {
  const r = await fetch(`${BASE}/api/pedidos`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ id_origen, id_destino, creado_por, detalles })
  });
  return await r.json();
}

export async function surtirPedido(id_pedido, detalles) {
  const r = await fetch(`${BASE}/api/pedidos/${id_pedido}/surtir`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ detalles })
  });
  return await r.json();
}

export async function recibirSSCC({ sscc, id_almacen, creado_por }) {
  const r = await fetch(`${BASE}/api/recepcion/sscc`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ sscc, id_almacen, creado_por })
  });
  return await r.json();
}
