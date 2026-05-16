// script.js - pequeñas interacciones para el sitio de Ramiro Navarrete

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

    // Pequeño mensaje de bienvenida en consola (solo para curiosos)
    const estiloBienvenida = 'color: #3b82f6; font-size: 16px; font-weight: bold;';
    console.log('%c✨ ¡Bienvenido/a al sitio de Ramiro! ✨', estiloBienvenida);
    console.log('Explora, contacta o simplemente disfruta 😊');
});
