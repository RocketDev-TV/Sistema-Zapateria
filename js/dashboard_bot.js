/* === js/dashboard_charts.js === */
/*
 * VERSIÓN SÚPER LIGERA:
 * Se eliminaron las gráficas de Cobertura y Calidad.
 * Esas gráficas ahora se hacen con PURO CSS (ver style.css).
 * Solo se mantiene Chart.js para la gráfica de líneas (Tendencia).
 */
document.addEventListener('DOMContentLoaded', () => {

    /* --- DATOS (Eventualmente vendrán del Backend) --- */
    const kpiData = {
        tendencia_dias: ['Oct 1', 'Oct 5', 'Oct 10', 'Oct 15', 'Oct 20', 'Oct 25', 'Oct 30'],
        tendencia_valores: [60, 55, 58, 45, 50, 42, 45] // Tiempos de recepción
    };

    // Colores
    const COLOR_AZUL = 'rgb(59, 130, 246)';


    /* --- GRÁFICA DE TENDENCIA (Líneas) --- */
    // Esta es la ÚNICA gráfica que usará Chart.js
    const ctxTendencia = document.getElementById('chart-tendencia');
    if (ctxTendencia) {
        new Chart(ctxTendencia, {
            type: 'line',
            data: {
                labels: kpiData.tendencia_dias,
                datasets: [{
                    label: 'Tiempo Promedio de Recepción (Min)',
                    data: kpiData.tendencia_valores,
                    fill: false,
                    borderColor: COLOR_AZUL,
                    tension: 0.1 // Suaviza la línea
                }]
            },
            options: {
                animation: false, // La dejamos sin animación por si acaso
                responsive: true,
                maintainAspectRatio: false, // Permite que se adapte al 'min-height' del CSS
                plugins: {
                    legend: {
                        position: 'top',
                    }
                },
                scales: {
                    y: {
                        beginAtZero: false,
                        title: {
                            display: true,
                            text: 'Minutos'
                        }
                    }
                }
            }
        });
    }
});