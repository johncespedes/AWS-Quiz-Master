 // ===== VARIABLES GLOBALES =====
let currentQuestion = 0;
let score = 0;
let selectedAnswer = null;
let quizCompleted = false;
// ===== BASE DE DATOS DE PREGUNTAS =====
const questions = [
    {
        question: "¿Qué significa AWS?",
        options: [
            "Amazon Web Services",
            "Advanced Web System", 
            "Automated Web Solutions",
            "Amazon Website Services"
        ],
        correct: 0,
        explanation: "AWS significa Amazon Web Services, la plataforma de servicios en la nube de Amazon."
    },
    {
        question: "¿Cuál es el servicio de almacenamiento de objetos de AWS?",
        options: [
            "EC2",
            "RDS", 
            "S3",
            "Lambda"
        ],
        correct: 2,
        explanation: "S3 (Simple Storage Service) es el servicio de almacenamiento de objetos de AWS."
    },
    {
        question: "¿Qué es Amazon EC2?",
        options: [
            "Elastic Compute Cloud - Servidores virtuales",
            "Easy Cloud Computing - Computación simple", 
            "Extended Cloud Capacity - Capacidad extendida",
            "Electronic Commerce Cloud - Comercio electrónico"
        ],
        correct: 0,
        explanation: "EC2 (Elastic Compute Cloud) proporciona servidores virtuales escalables en la nube."
    },
    {
        question: "¿Para qué se usa AWS Lambda?",
        options: [
            "Almacenar archivos",
            "Ejecutar código sin servidores", 
            "Crear bases de datos",
            "Enviar emails"
        ],
        correct: 1,
        explanation: "Lambda permite ejecutar código sin necesidad de administrar servidores (serverless computing)."
    },
    {
        question: "¿Cuál es la base de datos NoSQL de AWS?",
        options: [
            "RDS",
            "Aurora", 
            "DynamoDB",
            "Redshift"
        ],
        correct: 2,
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
}
/**
 * Selecciona una respuesta
 */
function selectAnswer(answerIndex) {
    if (selectedAnswer !== null) return; // Ya se seleccionó una respuesta
    
    selectedAnswer = answerIndex;
    const question = questions[currentQuestion];
    const optionButtons = document.querySelectorAll('.option-button');
    
    console.log(`✋ Respuesta seleccionada: ${answerIndex} (Correcta: ${question.correct})`);
    
    // Deshabilitar todos los botones
    optionButtons.forEach(button => {
        button.disabled = true;
    });
    
    // Marcar respuesta seleccionada
    optionButtons[answerIndex].classList.add('selected');
    
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
    
    // Si la respuesta seleccionada es incorrecta, marcarla
    if (selectedAnswer !== correctIndex) {
        optionButtons[selectedAnswer].classList.add('incorrect');
        showNotification('❌ Incorrecto', 'error');
    } else {
        score++;
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
    currentQuestion++;
    
    if (currentQuestion < questions.length) {
        console.log(`➡️ Avanzando a pregunta ${currentQuestion + 1}`);
        displayQuestion();
    } else {
        console.log('🏁 Quiz completado');
        showResults();
    }
}
/**
 * Muestra los resultados finales
 */
function showResults() {
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
} else if (percentage >= 60) {
    message = '¡Bien hecho! Tienes una buena base de AWS';
    emoji = '<img src="imagenes/ok.png" alt="ok" style="height: 3em; vertical-align: middle;">';
} else if (percentage >= 40) {
    message = 'No está mal, pero necesitas estudiar más AWS';
    emoji = '<img src="imagenes/tercer_puesto.png" alt="tercer puesto" style="height: 3em; vertical-align: middle;">';
} else {
    message = 'Necesitas repasar los fundamentos de AWS';
    emoji = '<img src="imagenes/esfuerzo.png" alt="esfuerzo" style="height: 4em; vertical-align: middle;">';
}
    
    scoreMessage.innerHTML = `
        <div style="font-size: 3rem; margin-bottom: 15px;">${emoji}</div>
        <div style="font-size: 1.8rem; color: #FF9900; margin-bottom: 10px;">${percentage}%</div>
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
        fontSize: '1.1rem',
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
// ===== INICIALIZACIÓN =====
// Función que se ejecuta cuando se carga la página
document.addEventListener('DOMContentLoaded', () => {
    console.log('🎯 AWS Quiz Básico cargado correctamente');
    console.log(`📚 Total de preguntas disponibles: ${questions.length}`);
    
    // Mostrar estadísticas previas si existen
    const stats = getUserStats();
    if (stats) {
        console.log('📊 Estadísticas del usuario:', stats);
        
        // Opcional: Mostrar estadísticas en la pantalla de bienvenida
        const welcomeP = welcomeScreen.querySelector('.mensaje-bienvenida');
        welcomeP.innerHTML += `<br><br><small style="opacity: 0.7;">
            Intentos anteriores: ${stats.totalAttempts} | 
            Mejor puntuación: ${stats.bestScore}% | 
            Promedio: ${stats.averageScore}%
        </small>`;
    }
    
    // Mensaje de bienvenida en consola
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
});
// ===== FUNCIONES ADICIONALES PARA EXPANSIÓN FUTURA =====
/**
 * Añade una nueva pregunta al quiz (para expansión futura)
 */
function addQuestion(questionData) {
    questions.push(questionData);
    console.log(`➕ Nueva pregunta añadida. Total: ${questions.length}`);
}
/**
 * Mezcla las preguntas aleatoriamente
 */
function shuffleQuestions() {
    for (let i = questions.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [questions[i], questions[j]] = [questions[j], questions[i]];
    }
    console.log('🔀 Preguntas mezcladas aleatoriamente');
}
/**
 * Obtiene una pregunta aleatoria
 */
function getRandomQuestion() {
    return questions[Math.floor(Math.random() * questions.length)];
}
// ===== MODO DEBUG (solo en desarrollo) =====
if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
    window.awsQuizDebug = {
        questions,
        skipToQuestion: (index) => {
            currentQuestion = index;
            displayQuestion();
        },
        setScore: (newScore) => {
            score = newScore;
        },
        showAllAnswers: () => {
            questions.forEach((q, i) => {
                console.log(`${i + 1}. ${q.question}`);
                console.log(`   Respuesta: ${q.options[q.correct]}`);
            });
        },
        clearStats: () => {
            localStorage.removeItem('awsQuizResults');
            console.log('🗑️ Estadísticas borradas');
        }
    };
    
    console.log('🛠️ Modo debug activado. Usa awsQuizDebug en la consola para funciones especiales.');
}