// js/auth.js
import { supabase } from './supabaseClient.js';

const btn = document.getElementById('login-btn');
if (btn) {
  btn.addEventListener('click', async () => {
    const user = document.getElementById('usuario').value.trim();
    const pass = document.getElementById('password').value.trim();

    // Ejemplo básico: compara contra tabla "usuario" (password_hash de prueba)
    const { data, error } = await supabase
      .from('usuario')
      .select('id_usuario, nombre, username')
      .eq('username', user)
      .eq('password_hash', pass)
      .eq('activo', true)
      .limit(1)
      .maybeSingle();

    if (error) {
      console.error(error);
      document.getElementById('error-msg').style.display = 'block';
      return;
    }

    if (!data) {
      document.getElementById('error-msg').style.display = 'block';
      return;
    }

    // Guarda datos mínimos de sesión en localStorage
    localStorage.setItem('sf_user', JSON.stringify(data));
    window.location.href = 'operador_menu.html';
  });
}
