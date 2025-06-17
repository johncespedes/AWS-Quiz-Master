 // ===== VARIABLES GLOBALES =====
let currentQuestion = 0;
let score = 0;
let selectedAnswer = null;
let quizCompleted = false;
let timerInterval = null;
let timerSeconds = 10;
// ===== BASE DE DATOS DE PREGUNTAS =====
const questions = [
    {
        question: "¿Qué servicio de AWS se puede utilizar para almacenar y entregar mensajes de forma fiable a través de sistemas distribuidos?",
        options: [
            "Amazon Simple Queue Service",
            "AWS Storage Gateway", 
            "Amazon Simple Email Service",
            "Amazon Simple Storage Service"
        ],
        correct: 0,
        explanation: "Amazon Simple Queue Service."
    },
    {
        question: "¿Cuál es el servicio de almacenamiento primario utilizado por las instancias de base de datos de Amazon RDS?",
        options: [
            "Amazon Glacier",
            "Amazon EBS", 
            "Amazon S3",
            "Amazon EFS"
        ],
        correct: 1,
        explanation: "Amazon EBS, funcionando como un disco duro virtual para las instancias de la nube de AWS."
    },
    {
        question: "¿Qué servicio de AWS se puede utilizar para registrar un nuevo nombre de dominio?",
        options: [
            "Amazon Personalize",
            "AWS KMS", 
            "AWS Config",
            "Amazon Route 53"
        ],
        correct: 3,
        explanation: "Amazon Route 53."
    },
    {
        question: "¿Para qué se usa AWS Lambda?",
        options: [
            "Iaas y SaaS",
            "IaaS", 
            "SaaS",
            "PaaS"
        ],
        correct: 1,
        explanation: "IaaS."
    },
    {
        question: "¿Cuál es la base de datos NoSQL de AWS?",
        options: [
            "RDS",
            "Aurora", 
            "Redshift",
            "DynamoDB"
        ],
        correct: 3,
        explanation: "DynamoDB es la base de datos NoSQL completamente administrada de AWS."
    }
];
// ===== ELEMENTOS DEL DOM =====
const welcomeScreen = document.getElementById('welcome-screen');
const quizScreen = document.getElementById('quiz-screen');
const resultsScreen = document.getElementById('results-screen');
const questionText = document.getElementById('question-text');
const optionsContainer = document.getElementById('options-container');
const nextButton = document.getElementById('next-button');
const progressFill = document.getElementById('progress-fill');
const progressText = document.getElementById('progress-text');
const scoreText = document.getElementById('score-text');
const scoreMessage = document.getElementById('score-message');
// ===== FUNCIONES PRINCIPALES =====
/**
 * Inicia el quiz
 */
function startQuiz() {
    console.log('🚀 Iniciando quiz...');
    
    // Resetear variables
    currentQuestion = 0;
    score = 0;
    selectedAnswer = null;
    quizCompleted = false;
    
    // Cambiar pantallas
    hideAllScreens();
    showScreen(quizScreen);
    
    // Mostrar primera pregunta
    displayQuestion();
    
    // Actualizar progreso
    updateProgress();
}
/**
 * Muestra la pregunta actual
 */
function displayQuestion() {
    const question = questions[currentQuestion];
    
    console.log(`📝 Mostrando pregunta ${currentQuestion + 1}: ${question.question}`);
    
    // Mostrar texto de la pregunta
    questionText.textContent = question.question;
    
    // Limpiar opciones anteriores
    optionsContainer.innerHTML = '';
    
    // Crear botones de opciones
    question.options.forEach((option, index) => {
        const optionButton = document.createElement('button');
        optionButton.className = 'option-button';
        optionButton.textContent = option;
        optionButton.onclick = () => selectAnswer(index);
        optionsContainer.appendChild(optionButton);
    });
    
    // Ocultar botón siguiente
    nextButton.classList.add('hidden');
    selectedAnswer = null;
    
    // Actualizar progreso
    updateProgress();
    iniciarTemporizador();
}
function iniciarTemporizador() {
    clearInterval(timerInterval);
    timerSeconds = 10;
    const timerDisplay = document.getElementById('timer');
    timerDisplay.classList.remove('tiempo-agotado');
    timerDisplay.innerHTML = `<span class="timer-icon">⏰</span> <span class="timer-text">${timerSeconds}s</span>`;
    reproducirTemporizador();

    timerInterval = setInterval(() => {
        timerSeconds--;
        if (timerSeconds > 0) {
            timerDisplay.innerHTML = `<span class="timer-icon">⏰</span> <span class="timer-text">${timerSeconds}s</span>`;
        } else {
            clearInterval(timerInterval);
            timerDisplay.innerHTML = `<span class="timer-icon">⏰</span> <span class="timer-agotado">¡Tiempo agotado!</span>`;
            timerDisplay.classList.add('tiempo-agotado');
            selectAnswer(-1);
            setTimeout(() => {
                nextQuestion();
                timerDisplay.classList.remove('tiempo-agotado');
            }, 1600);
        }
    }, 1000);
}
/**
 * Selecciona una respuesta
 */
function selectAnswer(answerIndex) {
    clearInterval(timerInterval); // Detiene el temporizador
    // Detiene el sonido del temporizador
    const audioTemporizador = document.getElementById('sonido-temporizador');
    if (audioTemporizador) {
        audioTemporizador.pause();
        audioTemporizador.currentTime = 0;
    }
    if (selectedAnswer !== null) return; // Ya se seleccionó una respuesta

    selectedAnswer = answerIndex;
    const question = questions[currentQuestion];
    const optionButtons = document.querySelectorAll('.option-button');

    if (answerIndex !== -1) {
        // Deshabilitar todos los botones
        optionButtons.forEach(button => {
            button.disabled = true;
        });

        // Marcar respuesta seleccionada
        optionButtons[answerIndex].classList.add('selected');
    } else {
        // Si no se seleccionó ninguna respuesta (tiempo agotado), deshabilita todos los botones
        optionButtons.forEach(button => {
            button.disabled = true;
        });
    }

    // Mostrar respuesta correcta/incorrecta después de un breve delay
    setTimeout(() => {
        showAnswerFeedback(optionButtons, question.correct);
    }, 500);
}
/**
 * Muestra feedback de la respuesta
 */
function showAnswerFeedback(optionButtons, correctIndex) {
    // Marcar respuesta correcta
    optionButtons[correctIndex].classList.add('correct');

    if (selectedAnswer === -1) {
        // Tiempo agotado, no se seleccionó ninguna opción
        reproducirIncorrecto();
        showNotification('⏰ Tiempo agotado', 'error');
        console.log('⏰ Tiempo agotado, pregunta fallida');
    } else if (selectedAnswer !== correctIndex) {
        optionButtons[selectedAnswer].classList.add('incorrect');
        reproducirIncorrecto();
        console.log(`❌ Respuesta incorrecta: ${selectedAnswer}`);
        showNotification('❌ Incorrecto', 'error');
    } else {
        score++;
        reproducirAcierto();
        console.log(`✅ Respuesta correcta: ${selectedAnswer}`);
        showNotification('✅ ¡Correcto!', 'success');
        console.log(`🎉 ¡Respuesta correcta! Puntuación actual: ${score}`);
    }

    // Mostrar botón siguiente después del feedback
    setTimeout(() => {
        nextButton.classList.remove('hidden');
    }, 1000);
}
/**
 * Avanza a la siguiente pregunta
 */
function nextQuestion() {
    // Evita que se ejecute dos veces al final
    if (quizCompleted) return;

    reproducirPop();
    currentQuestion++;

    if (currentQuestion < questions.length) {
        console.log(`➡️ Avanzando a pregunta ${currentQuestion + 1}`);
        displayQuestion();
    } else {
        console.log('🏁 Quiz completado');
        quizCompleted = true; // <-- Marca como completado
        showResults();
    }
}
/**
 * Muestra los resultados finales
 */
function showResults() {
     // Detener sonido del temporizador si está sonando
    const audioTemporizador = document.getElementById('sonido-temporizador');
    if (audioTemporizador) {
        audioTemporizador.pause();
        audioTemporizador.currentTime = 0;
    }
    // Detener sonido de fondo si está sonando
    const audioFondo = document.getElementById('sonido-fondo');
    if (audioFondo) {
        audioFondo.pause();
        audioFondo.currentTime = 0;
    }
    hideAllScreens();
    showScreen(resultsScreen);
    
    // Calcular porcentaje
    const percentage = Math.round((score / questions.length) * 100);
    
    // Mostrar puntuación
    scoreText.textContent = `${score}/${questions.length}`;
    
    // Mensaje personalizado según puntuación
    let message = '';
    let emoji = '';
    
   if (percentage >= 80) {
    message = '¡Excelente! Dominas los conceptos básicos de AWS';
    emoji = '<img src="imagenes/trofeo.png" alt="trofeo" style="height: 3em; vertical-align: middle;">';
    reproducirExcelente();
} else if (percentage >= 60) {
    message = '¡Bien hecho! Tienes una buena base de AWS';
    emoji = '<img src="imagenes/ok.png" alt="ok" style="height: 3em; vertical-align: middle;">';
    reproducirBienHecho();
} else if (percentage >= 40) {
    message = 'No está mal, pero necesitas estudiar más AWS';
    emoji = '<img src="imagenes/tercer_puesto.png" alt="tercer puesto" style="height: 3em; vertical-align: middle;">';
    reproducirNoEstaMal();
} else {
    message = 'Necesitas repasar los fundamentos de AWS';
    emoji = '<img src="imagenes/esfuerzo.png" alt="esfuerzo" style="height: 4em; vertical-align: middle;">';
    reproducirRepasar();
}
    
    scoreMessage.innerHTML = `
        <div style="font-size: 3rem; margin-bottom: 15px;">${emoji}</div>
        <div style="font-size: 1.8rem; color:rgb(247, 246, 244); margin-bottom: 10px;">${percentage}%</div>
        <div>${message}</div>
    `;
    
    console.log(`📊 Resultados finales: ${score}/${questions.length} (${percentage}%)`);
    
    // Guardar resultado en localStorage para persistencia
    saveQuizResult(score, questions.length, percentage);
}
/**
 * Reinicia el quiz
 */
function restartQuiz() {
    console.log('🔄 Reiniciando quiz...');
    hideAllScreens();
    showScreen(welcomeScreen);
}
/**
 * Comparte el resultado (funcionalidad básica)
 */
function shareScore() {
    const percentage = Math.round((score / questions.length) * 100);
    const shareText = `🚀 ¡Acabo de completar el AWS Quiz Básico!\n\nMi puntuación: ${score}/${questions.length} (${percentage}%)\n\n¿Puedes superarme? 💪`;
    
    // Intentar usar Web Share API si está disponible
    if (navigator.share) {
        navigator.share({
            title: 'AWS Quiz Básico - Mi Resultado',
            text: shareText,
            url: window.location.href
        }).then(() => {
            console.log('✅ Resultado compartido exitosamente');
            showNotification('¡Resultado compartido!', 'success');
        }).catch((error) => {
            console.log('❌ Error al compartir:', error);
            fallbackShare(shareText);
        });
    } else {
        fallbackShare(shareText);
    }
}
/**
 * Fallback para compartir en navegadores que no soportan Web Share API
 */
function fallbackShare(text) {
    // Copiar al portapapeles
    if (navigator.clipboard) {
        navigator.clipboard.writeText(text).then(() => {
            showNotification('¡Texto copiado al portapapeles!', 'success');
        }).catch(() => {
            showShareModal(text);
        });
    } else {
        showShareModal(text);
    }
}
/**
 * Muestra modal para compartir manualmente
 */
function showShareModal(text) {
    alert(`Copia este texto para compartir tu resultado:\n\n${text}`);
}
// ===== FUNCIONES DE UTILIDAD =====
/**
 * Oculta todas las pantallas
 */
function hideAllScreens() {
    welcomeScreen.classList.add('hidden');
    quizScreen.classList.add('hidden');
    resultsScreen.classList.add('hidden');
}
/**
 * Muestra una pantalla específica
 */
function showScreen(screen) {
    screen.classList.remove('hidden');
}
/**
 * Actualiza la barra de progreso
 */
function updateProgress() {
    const progress = ((currentQuestion + 1) / questions.length) * 100;
    progressFill.style.width = `${progress}%`;
    progressText.textContent = `Pregunta ${currentQuestion + 1} de ${questions.length}`;
}
/**
 * Muestra notificaciones temporales
 */
function showNotification(message, type = 'info') {
    // Crear elemento de notificación
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    
    // Estilos de la notificación
    Object.assign(notification.style, {
        position: 'fixed',
        top: '20px',
        right: '20px',
        padding: '15px 25px',
        borderRadius: '10px',
        color: 'white',
        fontWeight: 'bold',
        fontSize: '2.1rem',
        zIndex: '1000',
        opacity: '0',
        transform: 'translateX(100%)',
        transition: 'all 0.3s ease'
    });
    
    // Colores según tipo
    if (type === 'success') {
        notification.style.background = '#48BB78';
    } else if (type === 'error') {
        notification.style.background = '#F56565';
    } else {
        notification.style.background = '#4299E1';
    }
    
    // Añadir al DOM
    document.body.appendChild(notification);
    
    // Animar entrada
    setTimeout(() => {
        notification.style.opacity = '1';
        notification.style.transform = 'translateX(0)';
    }, 10);
    
    // Animar salida y remover
    setTimeout(() => {
        notification.style.opacity = '0';
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}
/**
 * Guarda el resultado del quiz en localStorage
 */
function saveQuizResult(score, total, percentage) {
    const result = {
        score: score,
        total: total,
        percentage: percentage,
        date: new Date().toISOString(),
        questions: questions.length
    };
    
    // Obtener resultados anteriores
    let previousResults = JSON.parse(localStorage.getItem('awsQuizResults') || '[]');
    
    // Añadir nuevo resultado
    previousResults.push(result);
    
    // Mantener solo los últimos 10 resultados
    if (previousResults.length > 10) {
        previousResults = previousResults.slice(-10);
    }
    
    // Guardar en localStorage
    localStorage.setItem('awsQuizResults', JSON.stringify(previousResults));
    
    console.log('💾 Resultado guardado:', result);
}
/**
 * Obtiene estadísticas del usuario
 */
function getUserStats() {
    const results = JSON.parse(localStorage.getItem('awsQuizResults') || '[]');
    
    if (results.length === 0) {
        return null;
    }
    
    const totalAttempts = results.length;
    const bestScore = Math.max(...results.map(r => r.percentage));
    const averageScore = Math.round(
        results.reduce((sum, r) => sum + r.percentage, 0) / totalAttempts
    );
    const lastAttempt = results[results.length - 1];
    
    return {
        totalAttempts,
        bestScore,
        averageScore,
        lastAttempt
    };
}
// ===== EVENT LISTENERS =====
// Navegación con teclado
document.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
        if (!welcomeScreen.classList.contains('hidden')) {
            startQuiz();
        } else if (!nextButton.classList.contains('hidden')) {
            nextQuestion();
        }
    }
    
    // Teclas numéricas para seleccionar opciones
    if (!quizScreen.classList.contains('hidden') && selectedAnswer === null) {
        const keyNumber = parseInt(event.key);
        if (keyNumber >= 1 && keyNumber <= 4) {
            const optionIndex = keyNumber - 1;
            const optionButtons = document.querySelectorAll('.option-button');
            if (optionButtons[optionIndex]) {
                selectAnswer(optionIndex);
            }
        }
    }
});
// Prevenir cierre accidental durante el quiz
window.addEventListener('beforeunload', (event) => {
    if (!quizScreen.classList.contains('hidden') && !quizCompleted) {
        event.preventDefault();
        event.returnValue = '¿Estás seguro de que quieres salir? Tu progreso se perderá.';
        return event.returnValue;
    }
});

function reproducirIncorrecto() {
  const audio = document.getElementById('sonido-incorrecto');
  if (audio) {
    audio.currentTime = 0;
    audio.play();
  }
}
function reproducirPop() {
  const audio = document.getElementById('sonido-pop');
  if (audio) {
    audio.currentTime = 0;
    audio.play();
  }
}
function reproducirInicio() {
    const audio = document.getElementById('sonido-inicio2');
    if (audio) {
        audio.currentTime = 0;
        audio.play();
    }
    }
function reproducirExcelente() {
    const audio = document.getElementById('sonido-excelente');
  if (audio) {
    audio.currentTime = 0;
    audio.play();
  }
}

function reproducirBienHecho() {
    const audio = document.getElementById('sonido-bienhecho');
  if (audio) {
    audio.currentTime = 0;
    audio.play();
  }
}

function reproducirNoEstaMal() {
    const audio = document.getElementById('sonido-nomaldel');
  if (audio) {
    audio.currentTime = 0;
    audio.play();
  }
}

function reproducirRepasar() {
    const audio = document.getElementById('sonido-repasar');
  if (audio) {
    audio.currentTime = 0;
    audio.play();
  }
}
function reproducirAcierto() {
    const audio = document.getElementById('sonido-acierto');
    if (audio) {
        audio.currentTime = 0;
        audio.play();
    }
}
// ===== INICIALIZACIÓN =====
// ...funciones globales y lógica principal...
document.addEventListener('DOMContentLoaded', () => {
    // Mensajes y estadísticas
    console.log('🎯 AWS Quiz Básico cargado correctamente');
    console.log(`📚 Total de preguntas disponibles: ${questions.length}`);
    const stats = getUserStats();
    if (stats) {
        console.log('📊 Estadísticas del usuario:', stats);
        const welcomeP = welcomeScreen.querySelector('.mensaje-bienvenida');
        welcomeP.innerHTML += `<br><br><small style="opacity: 0.7;">
            Intentos anteriores: ${stats.totalAttempts} | 
            Mejor puntuación: ${stats.bestScore}% | 
            Promedio: ${stats.averageScore}%
        </small>`;
    }
    console.log(`
    🚀 ¡Bienvenido al AWS Quiz Básico!
    📖 Instrucciones:
    • Responde 5 preguntas sobre AWS
    • Usa el mouse o las teclas numéricas (1-4)
    • Presiona Enter para avanzar
    • Tu progreso se guarda automáticamente
    💡 Consejos:
    • Lee cada pregunta cuidadosamente
    • No hay límite de tiempo
    • Puedes repetir el quiz las veces que quieras
    ¡Buena suerte! 🍀
    `);

    // Sonido de fondo
    const audioFondo = document.getElementById('sonido-fondo');
    if (audioFondo) {
        audioFondo.volume = 0.8;
        audioFondo.play().catch(() => {
            document.body.addEventListener('click', () => {
                audioFondo.play();
            }, { once: true });
        });
    }
    // Sonido del temporizador (¡AGREGA ESTO!)
    const audioTemporizador = document.getElementById('sonido-temporizador');
    if (audioTemporizador) {
        audioTemporizador.volume = 0.4; // Volumen bajo para el temporizador
    }
    // Sonido hover en botones
    const playHoverSound = () => {
        const audio = document.getElementById('sonido-boton-rapido');
        if (audio) {
            audio.currentTime = 0;
            audio.play();
        }
    };
    function addHoverListeners() {
        document.querySelectorAll('button').forEach(btn => {
            if (!btn.hasAttribute('data-hover-sound')) {
                btn.addEventListener('mouseenter', playHoverSound);
                btn.setAttribute('data-hover-sound', 'true');
            }
        });
    }
    addHoverListeners();
    const observer = new MutationObserver(addHoverListeners);
    observer.observe(document.body, { childList: true, subtree: true });

    // Funciones de sonido de botones
    window.reproducirVolverIntentar = function() {
        const audio = document.getElementById('sonido-volver-intentar');
        if (audio) {
            audio.currentTime = 0;
            audio.play();
        }
    };
    window.reproducirCompartir = function() {
        const audio = document.getElementById('sonido-compartir');
        if (audio) {
            audio.currentTime = 0;
            audio.play();
        }
    };
    window.reproducirTemporizador = function() {
        const audio = document.getElementById('sonido-temporizador');
        if (audio) {
            audio.currentTime = 0.10;
            audio.play();
        }
    };
});