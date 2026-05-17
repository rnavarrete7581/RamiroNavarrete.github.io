// script.js - Calculadora avanzada + Descargas manuales (usuario rnavarrete7581)
document.addEventListener('DOMContentLoaded', function() {
    console.log('✅ DOM cargado - Iniciando aplicación');

    // ========== 1. SECCIÓN DESCARGAS (MANUAL, SIN API) ==========
    function cargarArchivosDescargables() {
        const contenedor = document.getElementById('lista-archivos');
        if (!contenedor) return;

        // ✅ LISTA MANUAL DE TUS ARCHIVOS (usa la URL raw de GitHub)
        // IMPORTANTE: Reemplaza 'nombre-del-archivo.pdf' y 'URL-raw'
        const archivos = [
            { 
                nombre: "Ramiro Navarrete ACT 1.pdf", 
                url: "https://raw.githubusercontent.com/rnavarrete7581/rnavarrete7581.github.io/main/downloads/Ramiro%20Navarrete%20ACT%201.pdf"
            }
            // Añade más archivos aquí si los tienes
        ];

        if (archivos.length === 0) {
            contenedor.innerHTML = '<p>📁 No hay archivos disponibles aún. Vuelve pronto.</p>';
            return;
        }

        let listaHtml = '<div class="file-list">';
        archivos.forEach(archivo => {
            listaHtml += `
                <div class="file-item">
                    <span class="file-name">📄 ${escapeHtml(archivo.nombre)}</span>
                    <a href="${archivo.url}" class="download-btn" download>⬇️ Descargar</a>
                </div>
            `;
        });
        listaHtml += '</div>';
        contenedor.innerHTML = listaHtml;
    }

    function escapeHtml(texto) {
        const div = document.createElement('div');
        div.textContent = texto;
        return div.innerHTML;
    }

    cargarArchivosDescargables();

    // ========== 2. CALCULADORA AVANZADA (sin cambios) ==========
    const expresionDiv = document.getElementById('expresion');
    const resultadoDiv = document.getElementById('resultado');
    const historialMini = document.getElementById('historial-mini');
    const listaHistorial = document.getElementById('lista-historial');
    const borrarHistorialBtn = document.getElementById('borrar-historial');

    if (!expresionDiv) {
        console.error('No se encontró el elemento expresion');
        return;
    }

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
