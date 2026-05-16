// script.js - Carga de archivos + Calculadora avanzada

document.addEventListener('DOMContentLoaded', () => {
    console.log('🚀 Sitio de Ramiro Navarrete ');

    // ========== 1. ACTUALIZAR AÑO EN FOOTER ==========
    const footerYear = document.querySelector('footer p');
    if (footerYear) {
        const currentYear = new Date().getFullYear();
        footerYear.innerHTML = `&copy; ${currentYear} Ramiro Navarrete. Hecho con ☕ y dedicación.`;
    }

    // ========== 2. EFECTO DE SOMBRA EN SECCIONES ==========
    const sections = document.querySelectorAll('section');
    sections.forEach(section => {
        section.addEventListener('mouseenter', () => {
            section.style.boxShadow = '0 8px 20px rgba(0,0,0,0.1)';
        });
        section.addEventListener('mouseleave', () => {
            section.style.boxShadow = '0 4px 12px rgba(0,0,0,0.05)';
        });
    });

    // ========== 3. CARGAR ARCHIVOS DESCARGABLES ==========
    cargarArchivosDescargables();

    async function cargarArchivosDescargables() {
        const contenedor = document.getElementById('lista-archivos');
        if (!contenedor) return;

        //
        const usuario = 'RamiroNavarrete';
        const repositorio = 'RamiroNavarrete.github.io';
        const ruta = 'downloads';

        const apiUrl = `https://api.github.com/repos/${usuario}/${repositorio}/contents/${ruta}`;

        try {
            const respuesta = await fetch(apiUrl);
            if (!respuesta.ok) {
                if (respuesta.status === 404) {
                    contenedor.innerHTML = '<p class="file-list-mensaje">📁 No hay archivos disponibles aún. Vuelve más tarde.</p>';
                } else {
                    contenedor.innerHTML = '<p class="file-list-mensaje">❌ Error al cargar los archivos.</p>';
                }
                return;
            }

            const archivos = await respuesta.json();
            const soloArchivos = archivos.filter(item => item.type === 'file');

            if (soloArchivos.length === 0) {
                contenedor.innerHTML = '<p class="file-list-mensaje">📁 No hay archivos en la carpeta downloads/ todavía.</p>';
                return;
            }

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

    function escapeHtml(texto) {
        const div = document.createElement('div');
        div.textContent = texto;
        return div.innerHTML;
    }

    // ========== 4. CALCULADORA AVANZADA ==========
    let expresionActual = '';
    let resultadoActual = '';
    let memoria = 0;
    let historial = [];

    // Elementos DOM
    const expresionDiv = document.getElementById('expresion');
    const resultadoDiv = document.getElementById('resultado');
    const historialMini = document.getElementById('historial-mini');
    const listaHistorial = document.getElementById('lista-historial');
    const botonBorrarHistorial = document.getElementById('borrar-historial');

    function actualizarPantalla() {
        expresionDiv.innerText = expresionActual || '0';
        if (resultadoActual !== undefined && resultadoActual !== '') {
            resultadoDiv.innerText = '= ' + resultadoActual;
        } else {
            resultadoDiv.innerText = '';
        }
    }

    function agregarHistorial(operacion, resultado) {
        if (!operacion || operacion === '0') return;
        const entrada = `${operacion} = ${resultado}`;
        historial.unshift(entrada); // los más recientes arriba
        if (historial.length > 10) historial.pop();
        renderizarHistorial();
        if (historialMini) historialMini.innerText = operacion;
    }

    function renderizarHistorial() {
        if (!listaHistorial) return;
        listaHistorial.innerHTML = '';
        historial.forEach(item => {
            const li = document.createElement('li');
            li.textContent = item;
            listaHistorial.appendChild(li);
        });
    }

    function borrarHistorial() {
        historial = [];
        renderizarHistorial();
        if (historialMini) historialMini.innerText = '';
    }

    function evaluarExpresion(expr) {
        // Reemplazar símbolos visuales por operadores JS
        let exprJs = expr.replace(/×/g, '*').replace(/÷/g, '/');
        // Evaluar funciones científicas: sin(, cos(, tan(, sqrt(, log(, ln(
        // Convertir, por ejemplo, 'sin(30)' a Math.sin(30 * Math.PI/180) para grados
        // Pero para simplificar, usaremos radianes en funciones trigonométricas (el usuario puede ingresar radianes)
        // Soporte para potencias: x^y -> **
        exprJs = exprJs.replace(/(\d+(?:\.\d+)?)\s*\^\s*(\d+(?:\.\d+)?)/g, 'Math.pow($1, $2)');
        exprJs = exprJs.replace(/sqrt\(([^)]+)\)/g, 'Math.sqrt($1)');
        exprJs = exprJs.replace(/sin\(([^)]+)\)/g, 'Math.sin($1)');
        exprJs = exprJs.replace(/cos\(([^)]+)\)/g, 'Math.cos($1)');
        exprJs = exprJs.replace(/tan\(([^)]+)\)/g, 'Math.tan($1)');
        exprJs = exprJs.replace(/log\(([^)]+)\)/g, 'Math.log10($1)');
        exprJs = exprJs.replace(/ln\(([^)]+)\)/g, 'Math.log($1)');
        
        try {
            // Usar Function para evaluar (con precaución, pero es una calculadora local)
            const resultado = Function('"use strict"; return (' + exprJs + ')')();
            if (isNaN(resultado) || !isFinite(resultado)) throw new Error('Resultado no válido');
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
            setTimeout(() => {
                resultadoDiv.innerText = '';
            }, 1500);
        }
    }

    function manejarOperador(op) {
        if (expresionActual === '' && op === '-') {
            expresionActual = '-';
            actualizarPantalla();
            return;
        }
        if (expresionActual === '') return;
        const ultimoChar = expresionActual.slice(-1);
        if ('+-*/×÷'.includes(ultimoChar)) {
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
        if (num === '.' && expresionActual.slice(-1) === '.') return;
        expresionActual += num;
        actualizarPantalla();
    }

    function manejarFuncion(func) {
        switch(func) {
            case 'clear':
                expresionActual = '';
                resultadoActual = '';
                actualizarPantalla();
                break;
            case 'backspace':
                expresionActual = expresionActual.slice(0, -1);
                actualizarPantalla();
                break;
            case 'igual':
                manejarIgual();
                break;
            case 'memoria-mc':
                memoria = 0;
                break;
            case 'memoria-m-plus':
                const val = parseFloat(expresionActual);
                if (!isNaN(val)) memoria += val;
                break;
            case 'memoria-m-minus':
                const val2 = parseFloat(expresionActual);
                if (!isNaN(val2)) memoria -= val2;
                break;
            case 'memoria-mr':
                expresionActual = memoria.toString();
                resultadoActual = '';
                actualizarPantalla();
                break;
            case 'sqrt':
                if (expresionActual) {
                    const num = parseFloat(expresionActual);
                    if (!isNaN(num)) {
                        expresionActual = `sqrt(${num})`;
                        manejarIgual();
                    }
                } else {
                    expresionActual = 'sqrt(';
                    actualizarPantalla();
                }
                break;
            case 'pow2':
                if (expresionActual) {
                    const num = parseFloat(expresionActual);
                    if (!isNaN(num)) {
                        expresionActual = `${num}^2`;
                        manejarIgual();
                    }
                }
                break;
            case 'pow':
                expresionActual += '^';
                actualizarPantalla();
                break;
            case 'sin':
            case 'cos':
            case 'tan':
            case 'log':
            case 'ln':
                expresionActual += `${func}(`;
                actualizarPantalla();
                break;
            default:
                break;
        }
    }

    // Eventos de botones
    document.querySelectorAll('.btn-num').forEach(btn => {
        btn.addEventListener('click', () => manejarNumero(btn.getAttribute('data-num')));
    });
    document.querySelectorAll('.btn-op').forEach(btn => {
        btn.addEventListener('click', () => manejarOperador(btn.getAttribute('data-op')));
    });
    document.querySelectorAll('.btn-func, .btn-cientifico').forEach(btn => {
        btn.addEventListener('click', () => manejarFuncion(btn.getAttribute('data-func')));
    });
    if (botonBorrarHistorial) {
        botonBorrarHistorial.addEventListener('click', borrarHistorial);
    }

    // Soporte teclado
    window.addEventListener('keydown', (e) => {
        const key = e.key;
        if (/[0-9]/.test(key)) manejarNumero(key);
        else if (key === '.') manejarNumero('.');
        else if (key === '+' || key === '-' || key === '*' || key === '/') {
            let op = key;
            if (op === '*') op = '×';
            if (op === '/') op = '÷';
            manejarOperador(op);
        }
        else if (key === 'Enter' || key === '=') manejarFuncion('igual');
        else if (key === 'Escape') manejarFuncion('clear');
        else if (key === 'Backspace') manejarFuncion('backspace');
    });

    actualizarPantalla();
});
