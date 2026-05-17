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
    
// ========== 2. CALCULADORA AVANZADA ==========
    const expresionDiv = document.getElementById('expresion');
    const resultadoDiv = document.getElementById('resultado');
    const historialMini = document.getElementById('historial-mini');
    const listaHistorial = document.getElementById('lista-historial');
    const borrarHistorialBtn = document.getElementById('borrar-historial');

    if (!expresionDiv) {
        console.error('❌ No se encontró el elemento "expresion". Verifica que el HTML tenga <div id="expresion">');
        return;
    }

    console.log('✅ Inicializando calculadora');

    let expresionActual = '';
    let resultadoActual = '';
    let memoria = 0;
    let historial = [];

    function actualizarPantalla() {
        expresionDiv.innerText = expresionActual === '' ? '0' : expresionActual;
        resultadoDiv.innerText = resultadoActual ? `= ${resultadoActual}` : '';
    }

    function agregarHistorial(operacion, resultado) {
        if (!operacion || operacion === '0') return;
        historial.unshift(`${operacion} = ${resultado}`);
        if (historial.length > 10) historial.pop();
        if (listaHistorial) {
            listaHistorial.innerHTML = historial.map(item => `<li>${item}</li>`).join('');
        }
        if (historialMini) historialMini.innerText = operacion;
    }

    if (borrarHistorialBtn) {
        borrarHistorialBtn.addEventListener('click', () => {
            historial = [];
            if (listaHistorial) listaHistorial.innerHTML = '';
            if (historialMini) historialMini.innerText = '';
        });
    }

    function evaluarExpresion(expr) {
        try {
            let exprJs = expr.replace(/×/g, '*').replace(/÷/g, '/');
            exprJs = exprJs.replace(/(\d+(?:\.\d+)?)\s*\^\s*(\d+(?:\.\d+)?)/g, 'Math.pow($1, $2)');
            exprJs = exprJs.replace(/sqrt\(([^)]+)\)/g, 'Math.sqrt($1)');
            exprJs = exprJs.replace(/sin\(([^)]+)\)/g, 'Math.sin($1)');
            exprJs = exprJs.replace(/cos\(([^)]+)\)/g, 'Math.cos($1)');
            exprJs = exprJs.replace(/tan\(([^)]+)\)/g, 'Math.tan($1)');
            exprJs = exprJs.replace(/log\(([^)]+)\)/g, 'Math.log10($1)');
            exprJs = exprJs.replace(/ln\(([^)]+)\)/g, 'Math.log($1)');
            const resultado = Function('"use strict";return (' + exprJs + ')')();
            if (isNaN(resultado) || !isFinite(resultado)) throw new Error();
            return parseFloat(resultado.toFixed(8));
        } catch (e) {
            return null;
        }
    }

    function manejarIgual() {
        if (!expresionActual) return;
        const resultado = evaluarExpresion(expresionActual);
        if (resultado !== null) {
            resultadoActual = resultado.toString();
            agregarHistorial(expresionActual, resultadoActual);
            expresionActual = resultadoActual;
            resultadoActual = '';
            actualizarPantalla();
        } else {
            resultadoDiv.innerText = 'Error';
            setTimeout(() => resultadoDiv.innerText = '', 1500);
        }
    }

    function manejarOperador(op) {
        if (expresionActual === '' && op === '-') {
            expresionActual = '-';
            actualizarPantalla();
            return;
        }
        if (expresionActual === '') return;
        const ultimo = expresionActual.slice(-1);
        if ('+-*/×÷'.includes(ultimo)) {
            expresionActual = expresionActual.slice(0, -1) + op;
        } else {
            expresionActual += op;
        }
        actualizarPantalla();
    }

    function manejarNumero(num) {
        if (resultadoActual !== '') {
            expresionActual = '';
            resultadoActual = '';
        }
        if (num === '.' && expresionActual.includes('.')) return;
        expresionActual += num;
        actualizarPantalla();
    }

    function manejarFuncion(func) {
        switch(func) {
            case 'clear': expresionActual = ''; resultadoActual = ''; actualizarPantalla(); break;
            case 'backspace': expresionActual = expresionActual.slice(0, -1); actualizarPantalla(); break;
            case 'igual': manejarIgual(); break;
            case 'memoria-mc': memoria = 0; break;
            case 'memoria-m-plus': memoria += parseFloat(expresionActual) || 0; break;
            case 'memoria-m-minus': memoria -= parseFloat(expresionActual) || 0; break;
            case 'memoria-mr': expresionActual = memoria.toString(); resultadoActual = ''; actualizarPantalla(); break;
            case 'sqrt': 
                if (expresionActual) {
                    let n = parseFloat(expresionActual);
                    if (!isNaN(n)) { expresionActual = `sqrt(${n})`; manejarIgual(); }
                } else expresionActual = 'sqrt('; actualizarPantalla(); break;
            case 'pow2':
                if (expresionActual) {
                    let n = parseFloat(expresionActual);
                    if (!isNaN(n)) { expresionActual = `${n}^2`; manejarIgual(); }
                } break;
            case 'pow': expresionActual += '^'; actualizarPantalla(); break;
            case 'sin': case 'cos': case 'tan': case 'log': case 'ln':
                expresionActual += `${func}(`; actualizarPantalla(); break;
            default:
                if (func === '(' || func === ')') {
                    expresionActual += func;
                    actualizarPantalla();
                }
        }
    }

    // Asignar eventos a los botones de la calculadora
    document.querySelectorAll('.btn-num').forEach(btn => {
        btn.addEventListener('click', () => manejarNumero(btn.getAttribute('data-num')));
    });
    document.querySelectorAll('.btn-op').forEach(btn => {
        btn.addEventListener('click', () => manejarOperador(btn.getAttribute('data-op')));
    });
    document.querySelectorAll('.btn-func, .btn-cientifico').forEach(btn => {
        btn.addEventListener('click', () => {
            const func = btn.getAttribute('data-func');
            if (func) manejarFuncion(func);
            else {
                const op = btn.getAttribute('data-op');
                if (op) manejarOperador(op);
            }
        });
    });

    // Teclado
    window.addEventListener('keydown', (e) => {
        const key = e.key;
        if (/[0-9]/.test(key)) manejarNumero(key);
        else if (key === '.') manejarNumero('.');
        else if (key === '+') manejarOperador('+');
        else if (key === '-') manejarOperador('-');
        else if (key === '*') manejarOperador('×');
        else if (key === '/') manejarOperador('÷');
        else if (key === 'Enter' || key === '=') manejarFuncion('igual');
        else if (key === 'Escape') manejarFuncion('clear');
        else if (key === 'Backspace') manejarFuncion('backspace');
    });

    actualizarPantalla();
    console.log('🚀 Calculadora lista');
});
