// script.js - Carga dinámica de archivos desde la carpeta /downloads/

document.addEventListener('DOMContentLoaded', () => {
    console.log('🚀 ¡Sitio de Ramiro Navarrete cargado correctamente!');

    // Cambiar dinámicamente el año en el footer
    const footerYear = document.querySelector('footer p');
    if (footerYear) {
        const currentYear = new Date().getFullYear();
        footerYear.innerHTML = `&copy; ${currentYear} Ramiro Navarrete. Hecho con ☕ y dedicación.`;
    }

    // Agregar un efecto sutil al pasar el mouse sobre las secciones
    const sections = document.querySelectorAll('section');
    sections.forEach(section => {
        section.addEventListener('mouseenter', () => {
            section.style.boxShadow = '0 8px 20px rgba(0,0,0,0.1)';
        });
        section.addEventListener('mouseleave', () => {
            section.style.boxShadow = '0 4px 12px rgba(0,0,0,0.05)';
        });
    });

    // Función para cargar y mostrar los archivos de la carpeta /downloads/
    cargarArchivosDescargables();

    async function cargarArchivosDescargables() {
        const contenedor = document.getElementById('lista-archivos');
        if (!contenedor) return;

        // Usamos la API de GitHub para listar el contenido de la carpeta "downloads"
        // 
        const usuario = 'rnavarrete7581'; // 
        const repositorio = 'RamiroNavarrete.github.io';
        const ruta = 'downloads'; // carpeta donde están los archivos

        const apiUrl = `https://api.github.com/repos/${usuario}/${repositorio}/contents/${ruta}`;

        try {
            const respuesta = await fetch(apiUrl);
            if (!respuesta.ok) {
                // Si la carpeta no existe o no hay archivos, mostramos mensaje
                if (respuesta.status === 404) {
                    contenedor.innerHTML = '<p class="file-list-mensaje">📁 No hay archivos disponibles aún. Vuelve más tarde.</p>';
                } else {
                    contenedor.innerHTML = '<p class="file-list-mensaje">❌ Error al cargar los archivos.</p>';
                }
                return;
            }

            const archivos = await respuesta.json();
            // Filtramos solo los que son archivos (no directorios)
            const soloArchivos = archivos.filter(item => item.type === 'file');

            if (soloArchivos.length === 0) {
                contenedor.innerHTML = '<p class="file-list-mensaje">📁 No hay archivos en la carpeta downloads/ todavía.</p>';
                return;
            }

            // Generar la lista HTML
            let listaHtml = '<div class="file-list">';
            soloArchivos.forEach(archivo => {
                const nombre = archivo.name;
                const urlDescarga = archivo.download_url;
                listaHtml += `
                    <div class="file-item">
                        <span class="file-name">${escapeHtml(nombre)}</span>
                        <a href="${urlDescarga}" class="download-btn" download>⬇️ Descargar</a>
                    </div>
                `;
            });
            listaHtml += '</div>';
            contenedor.innerHTML = listaHtml;

        } catch (error) {
            console.error('Error al obtener archivos:', error);
            contenedor.innerHTML = '<p class="file-list-mensaje">⚠️ No se pudo conectar con GitHub. Inténtalo más tarde.</p>';
        }
    }

    // Función auxiliar para evitar inyección HTML
    function escapeHtml(texto) {
        const div = document.createElement('div');
        div.textContent = texto;
        return div.innerHTML;
    }

    // Pequeño mensaje de bienvenida en consola
    const estiloBienvenida = 'color: #3b82f6; font-size: 16px; font-weight: bold;';
    console.log('%c✨ ¡Bienvenido/a al sitio de Ramiro! ✨', estiloBienvenida);
    console.log('Explora, contacta o descarga archivos desde la sección correspondiente 😊');
});
