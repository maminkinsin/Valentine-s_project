document.addEventListener("DOMContentLoaded", function() {
    // Элементы управления
    enableNopeButton();
    let mainMusicStarted = false;
    const yesBtn = document.getElementById("yes-btn");
    const noBtn = document.getElementById("no-btn");
    const startBtn = document.querySelector(".start-btn");
    const nextBtn = document.querySelectorAll(".next-btn");
    const entWishBtn = document.getElementById('enterWishBtn'); 
    
    

    const frames = [
        document.getElementById("frame1"),
        document.getElementById("frame2"),
        document.getElementById("frame3"),
        document.getElementById("frame4"),
        document.getElementById("frame5"),
        document.getElementById("frame6"),
        document.getElementById("frame7"),
        document.getElementById("frame8"),
        document.getElementById("frame9"),
        document.getElementById("frame10"),
        document.getElementById("frame11"),
        document.getElementById("frame12"),
        document.getElementById("frame13"),
        document.getElementById("frame14"),
        document.getElementById("frame15")
    ];
    // ========================
// КРАСИВЫЙ ПЕРЕХОД - FLOAT TRANSITION
// ========================

function floatTransition(currentFrame, nextFrame, nextIndex) {
    // Звук перехода (опционально)
    if (transitionSound) {
        transitionSound.currentTime = 0;
        transitionSound.play().catch(e => {});
    }
    
    // Создаем парящие сердечки
    for (let i = 0; i < 20; i++) {
        setTimeout(() => {
            const heart = document.createElement('div');
            heart.innerHTML = ['❤️', '💗', '💖', '💘', '💝', '💕', '💓'][Math.floor(Math.random() * 7)];
            heart.style.position = 'fixed';
            heart.style.left = Math.random() * 100 + '%';
            heart.style.bottom = '-50px';
            heart.style.fontSize = (Math.random() * 30 + 20) + 'px';
            heart.style.zIndex = '9999';
            heart.style.pointerEvents = 'none';
            heart.style.animation = `floatUp ${Math.random() * 2 + 3}s ease-out forwards`;
            heart.style.opacity = '0.8';
            heart.style.filter = 'drop-shadow(0 0 10px rgba(255,105,180,0.8))';
            heart.style.transform = `rotate(${Math.random() * 30 - 15}deg)`;
            
            document.body.appendChild(heart);
            
            setTimeout(() => {
                heart.remove();
            }, 5000);
        }, i * 70);
    }
    
    // Анимируем текущий фрейм - улетает вверх
    currentFrame.style.transition = 'transform 0.9s cubic-bezier(0.34, 1.56, 0.64, 1), opacity 0.9s ease';
    currentFrame.style.transform = 'translateY(-80px)';
    currentFrame.style.opacity = '0';
    
    setTimeout(() => {
        currentFrame.style.display = 'none';
        currentFrame.style.transform = 'translateY(0)';
        currentFrame.style.opacity = '1';
        
        // Подготавливаем следующий фрейм - прилетает снизу
        nextFrame.style.display = 'flex';
        nextFrame.style.transform = 'translateY(80px)';
        nextFrame.style.opacity = '0';
        
        setTimeout(() => {
            nextFrame.style.transition = 'transform 0.9s cubic-bezier(0.34, 1.56, 0.64, 1), opacity 0.9s ease';
            nextFrame.style.transform = 'translateY(0)';
            nextFrame.style.opacity = '1';
            
            // Завершаем переход
            setTimeout(() => {
                currentFrameIndex = nextIndex;
                isTransitioning = false;
                
                // Специфичные действия для определенных фреймов
                if (currentFrameIndex === 0) {
                    disableNopeButton();
                } else {
                    enableNopeButton();
                }
                
                if (currentFrameIndex === 11) {
                    activateFrame12Compliments();
                }
                
                if (currentFrameIndex === 10) {
                    showResults();
                }
                
                if (currentFrameIndex === 1) {
                    if (mainMusic && mainMusic.paused) {
                        mainMusic.volume = 0.5;
                        mainMusic.play().catch(e => console.log("Ошибка автозапуска:", e));
                    }
                }
            }, 900);
        }, 50);
    }, 900);
}

    // Текущий фрейм и результаты
    let currentFrameIndex = 0;
    let results = { "⏳": 0, "🤗": 0, "🎁": 0, "💬": 0 };
    let userAnswers = {};
    // ========================
    // ОСНОВНЫЕ ОБРАБОТЧИКИ
    // ========================

    // 1. Переход на фрейм с инструкцией (Of course)
    yesBtn.addEventListener("click", function() {
        switchToFrame(10);
    });
    // 2. Переход по пробелу
    document.addEventListener("keydown", function(e) {
        if (e.code === "Space") {
    
            if (imageOpened) return; // ← ВАЖНО
    
            if (currentFrameIndex === 1) switchToFrame(2);
            
            else if (currentFrameIndex === 13) switchToFrame(14);
        }
    });

    startBtn.addEventListener("click", function() {
        switchToFrame(3);
    });
    
    frames.forEach(frame => {
        frame.addEventListener("click", function (e) {
            const answer = e.target.closest(".answer");
            if (!answer) return;
            if (!frame.contains(answer)) return;
    
            handleAnswerClick(answer);
        });
    });

    // 4. Обработка кнопок NEXT
    nextBtn.forEach(function(btn) {
        btn.addEventListener("click", function() {
            handleNextButton();
        });
    });
    
    entWishBtn.addEventListener("click", function(e) {
        e.preventDefault();
    
        console.log('🚀 Нажали ЗАГАДАТЬ — отправляем письмо');
        sendTestResultsToEmail();
    
        setTimeout(() => {
            switchToFrame(13);
        }, 100);
    });

    // ========================
    // 5. УБЕГАЮЩАЯ КНОПКА "NOPE" - ТОЧНО КАК В ВАШЕМ КОДЕ
    // ========================
    
    let targetX = 0, targetY = 0;
    let isMoving = false;

    function enableNopeButton() {
        document.addEventListener("mousemove", moveButton);
    }
    
    function disableNopeButton() {
        document.removeEventListener("mousemove", moveButton);
    }
    

    function moveButton(event) {
        // Только на первом фрейме
        if (currentFrameIndex !== 0) return;
        
        const btnRect = noBtn.getBoundingClientRect();
        const distance = Math.sqrt(
            Math.pow(event.clientX - (btnRect.left + btnRect.width / 2), 2) +
            Math.pow(event.clientY - (btnRect.top + btnRect.height / 2), 2)
        );

        if (distance < 150 && !isMoving) {
            const { x, y } = getRandomPosition();
            targetX = x;
            targetY = y;
            isMoving = true;
            animateButton();
        }
    }

    function getRandomPosition() {
        return {
            x: Math.max(0, Math.min(
                Math.random() * (window.innerWidth - noBtn.offsetWidth),
                window.innerWidth - noBtn.offsetWidth
            )),
            y: Math.max(0, Math.min(
                Math.random() * (window.innerHeight - noBtn.offsetHeight),
                window.innerHeight - noBtn.offsetHeight
            ))
        };
    }

    function animateButton() {
        const rect = noBtn.getBoundingClientRect();
    
        let startX = rect.left;
        let startY = rect.top;
    
        noBtn.style.position = "fixed";
        noBtn.style.left = `${startX}px`;
        noBtn.style.top = `${startY}px`;
    
        let progress = 0;
        let speed = 0.1;
    
        function step() {
            progress += speed;
            if (progress >= 1) {
                progress = 1;
                isMoving = false;
            }
    
            noBtn.style.left = `${lerp(startX, targetX, progress)}px`;
            noBtn.style.top = `${lerp(startY, targetY, progress)}px`;
    
            if (progress < 1) {
                requestAnimationFrame(step);
            }
        }
    
        requestAnimationFrame(step);
    }
    
    function lerp(start, end, t) {
        return start + (end - start) * t;
    }

    noBtn.addEventListener("click", function(e) {
        e.preventDefault();
        e.stopPropagation();
        return false;
    });

    // ========================
    // ФУНКЦИИ ПЕРЕКЛЮЧЕНИЯ
    // ========================

    function switchToFrame(nextIndex) {
        if (nextIndex < 0 || nextIndex >= frames.length) return;
        if (nextIndex === currentFrameIndex) return;
    
        const currentFrame = frames[currentFrameIndex];
        const nextFrame = frames[nextIndex];
    
        // ТЕКУЩИЙ ФРЕЙМ - МЯГКО ИСЧЕЗАЕТ
        currentFrame.style.transition = 'opacity 0.4s ease';
        currentFrame.style.opacity = '0';
    
        setTimeout(() => {
            currentFrame.style.display = 'none';
            currentFrame.style.opacity = '1';
            
            // СЛЕДУЮЩИЙ ФРЕЙМ - ПЛАВНОЕ ПРИБЛИЖЕНИЕ
            nextFrame.style.display = 'flex';
            nextFrame.style.transform = 'scale(0.85)';
            nextFrame.style.opacity = '0';
            
            setTimeout(() => {
                nextFrame.style.transition = 'transform 0.45s cubic-bezier(0.25, 0.46, 0.45, 0.98), opacity 0.4s ease';
                nextFrame.style.transform = 'scale(1)';
                nextFrame.style.opacity = '1';
                
                // ОБНОВЛЯЕМ ИНДЕКС
                currentFrameIndex = nextIndex;
                
                // ВАША ЛОГИКА
                if (currentFrameIndex === 0) {
                    disableNopeButton();
                } else {
                    enableNopeButton();
                }
                
                if (currentFrameIndex === 1) {
                    if (mainMusic && mainMusic.paused) {
                        mainMusic.volume = 0.5;
                        mainMusic.play().catch(e => console.log("Ошибка автозапуска:", e));
                    }
                }
                
                if (currentFrameIndex === 11) {
                    const compliments = document.querySelectorAll(".compliment");
                    compliments.forEach((compliment, i) => {
                        compliment.style.opacity = "0";
                        compliment.style.transform = "scale(0.5) translateY(30px)";
                        setTimeout(() => {
                            compliment.style.opacity = "1";
                            compliment.style.transform = "scale(1) translateY(0)";
                        }, i * 400);
                    });
                }
                
                if (currentFrameIndex === 10) {
                    showResults();
                }
                
            }, 50);
        }, 400);
    }   

    function handleAnswerClick(answer) {
        const currentFrame = frames[currentFrameIndex];
        const selectedAnswers = currentFrame.querySelectorAll(".answer.selected");
        const frameId = currentFrame.id; // например frame4
    
        if (!userAnswers[frameId]) {
            userAnswers[frameId] = [];
        }
    
        if (answer.classList.contains("selected")) {
            answer.classList.remove("selected");
            results[answer.dataset.emoji]--;
    
            userAnswers[frameId] = userAnswers[frameId]
                .filter(text => text !== answer.textContent.trim());
    
        } else if (selectedAnswers.length < 2) {
            answer.classList.add("selected");
            results[answer.dataset.emoji]++;
    
            userAnswers[frameId].push(answer.textContent.trim());
        }
    }
    

    function handleNextButton() {
        const currentFrame = frames[currentFrameIndex];
    
        // очистка ответов
        if (currentFrameIndex >= 3 && currentFrameIndex <= 9) {
            currentFrame
                .querySelectorAll(".answer.selected")
                .forEach(a => a.classList.remove("selected"));
        }
    
        switchToFrame(currentFrameIndex + 1);
    }
    function showResults() {
        const resultText = document.getElementById("result-text");
        const resultDescriptionText = document.getElementById("result-description-text");
    
        const maxResults = getMaxResult(); // ← ОДИН РАЗ
        let switchResult = maxResults[0];  // если несколько — берём первый
    
        let resultHTML = "";
        let resultDescText = "";
    
        switch (switchResult) {
            case '⏳':
                resultHTML = `<div class="result-title">Твой стиль любви: «ВРЕМЯ ВМЕСТЕ»</div>`;
                resultDescText = `
                    <div class="result-title">Ты ценишь время, проведённое</div>
                    <div class="result-title">с любимым человеком.</div>
                    <div class="result-title">Главное для тебя — внимание</div>
                    <div class="result-title">и совместные моменты ⏳</div>
                `;
                break;
    
            case '🤗':
                resultHTML = `<div class="result-title">Твой стиль любви: «ПРИКОСНОВЕНИЯ»</div>`;
                resultDescText = `
                    <div class="result-title">Ты ценишь физическую близость:</div>
                    <div class="result-title">объятия, поцелуи, держаться за руки.</div>
                    <div class="result-title">Это твой главный язык любви 🤗</div>
                `;
                break;
    
            case '🎁':
                resultHTML = `<div class="result-title">Твой стиль любви: «ПОДАРКИ»</div>`;
                resultDescText = `
                    <div class="result-title">Для тебя важны знаки внимания</div>
                    <div class="result-title">и сюрпризы.</div>
                    <div class="result-title">Ты любишь радовать и получать</div>
                    <div class="result-title">подарки, наполненные смыслом 🎁</div>
                `;
                break;
    
            case '💬':
                resultHTML = `<div class="result-title">Твой стиль любви: «СЛОВА ПОДДЕРЖКИ»</div>`;
                resultDescText = `
                    <div class="result-title">Ты выражаешь чувства через</div>
                    <div class="result-title">комплименты, признания и поддержку 💬</div>
                    <div class="result-title">Тёплые слова для тебя очень важны</div>
                `;
                break;
    
            default:
                resultHTML = `<div class="result-title">${switchResult}</div>`;
                resultDescText = "";
        }
    
        resultText.innerHTML = resultHTML;
        resultDescriptionText.innerHTML = resultDescText;
    }
    
    function getMaxResult() {
        const max = Math.max(...Object.values(results));
    
        return Object.entries(results)
            .filter(([_, value]) => value === max)
            .map(([emoji]) => emoji);
    }
    
    

    // Анимация комплиментов
    let currentComplimentAudio = null;
    let complimentAudio = new Audio();

    const compliments = document.querySelectorAll("#frame12 .compliment");
    
    
    
    function activateFrame12Compliments() {
        const compliments = document.querySelectorAll("#frame12 .compliment");
        
        if (compliments.length) {
            // Сначала позиционируем кнопки
            positionComplimentsRandomly();
            
            // Скрываем все комплименты
            compliments.forEach(compliment => {
                compliment.style.opacity = "0";
                compliment.style.transform = "scale(0.5) translateY(30px)";
            });
            
            // Показываем комплименты по очереди
            compliments.forEach((compliment, index) => {
                setTimeout(() => {
                    compliment.style.opacity = "1";
                    compliment.style.transform = "scale(1) translateY(0)";
                }, index * 400);
            });
        }
    }
    const fullscreenImage = document.querySelector(".fullscreen-image");
    const fullscreenImgTag = fullscreenImage.querySelector("img");
    const spaceCard = document.querySelector(".space-card");
    
    const mainMusic = document.getElementById("main-music");
    const openMusic = document.getElementById("open-music");
    
    let imageOpened = false;
    
    // ===============================
    // ОТКРЫТИЕ КАРТИНКИ
    // ===============================
    
    compliments.forEach(btn => {
      btn.addEventListener("click", () => {
        if (imageOpened) return;
        imageOpened = true;
    
        // ИСПРАВЛЕНО: было data-image, а нужно data-img
        const imgSrc = btn.dataset.img; 
        fullscreenImgTag.src = imgSrc;
    
        fullscreenImage.classList.add("active");
        spaceCard.style.display = "flex";
    
        // Музыка
        if (mainMusic && !mainMusic.paused) {
            mainMusic.pause(); // ❗ без обнуления времени
        }
        
        // ИСПРАВЛЕНО: воспроизводим конкретный комплимент
        const audioSrc = btn.dataset.audio;
        if (audioSrc) {
            // Создаем новый аудио элемент для каждого комплимента
            if (currentComplimentAudio) {
                currentComplimentAudio.pause();
                currentComplimentAudio.currentTime = 0;
            }
            
            currentComplimentAudio = new Audio(audioSrc);
            currentComplimentAudio.play().catch(e => console.log("Ошибка:", e));
        }
    
        if (openMusic) {
          openMusic.currentTime = 0;
          openMusic.play();
        }
      });
    });
    
    // ===============================
    // ЗАКРЫТИЕ ПО ПРОБЕЛУ
    // ===============================
    
    document.addEventListener("keydown", (e) => {
      if (e.code !== "Space" || !imageOpened) return;
    
      e.preventDefault();
    
      fullscreenImage.classList.remove("active");
      spaceCard.style.display = "none";
    
      // Останавливаем все звуки
      if (currentComplimentAudio) {
        currentComplimentAudio.pause();
        currentComplimentAudio.currentTime = 0;
        currentComplimentAudio = null;
    }
    
    if (mainMusic && mainMusic.paused) {
        mainMusic.play().catch(e => console.log("Ошибка автозапуска:", e));
    }
    
      imageOpened = false;
    });
    
    
   
    
    // Предотвращаем скролл при пробеле
    window.addEventListener('keydown', function(e) {
        // Проверяем, не в поле ли ввода мы находимся
        const isInput = e.target.tagName === 'INPUT' || 
                        e.target.tagName === 'TEXTAREA' || 
                        e.target.isContentEditable;
        
        // Если это пробел И мы НЕ в поле ввода - отменяем
        if ((e.code === 'Space' || e.key === 'Space' || e.keyCode === 32) && !isInput) {
            e.preventDefault();
            
            // Ваша навигация
            if (imageOpened) return;
            if (currentFrameIndex === 1) switchToFrame(2);
            else if (currentFrameIndex === 13) switchToFrame(14);
        }
        // Если в поле ввода - НИЧЕГО НЕ ДЕЛАЕМ, пробел работает!
    }, false);
  // ========================
// EMAILJS - ОТПРАВКА РЕЗУЛЬТАТОВ
// ========================

// Функция отправки результатов (ОБЪЯВЛЯЕМ ОДИН РАЗ)
window.sendTestResultsToEmail = function() {
   
    
    // 1. Собираем ответы на вопросы
    let answersList = '';
    
    const questions = [
        { id: 4, text: 'Как ты чаще всего выражаешь свою любовь?' },
        { id: 5, text: 'Что для тебя важнее всего?' },
        { id: 6, text: 'Какой идеальный сюрприз для тебя?' },
        { id: 7, text: 'Какой романтический жест тебе ближе?' },
        { id: 8, text: 'Что тебя больше всего поддержит после тяжелого дня?' },
        { id: 9, text: 'Как ты предпочитаешь отмечать годовщины и праздники?' },
        { id: 10, text: 'Что тебя больше всего ранит в отношениях?' }
    ];
    
    questions.forEach((q, index) => {
        const answers = userAnswers[`frame${q.id}`] || [];
    
        const answerDisplay = answers.length
            ? answers.join(' | ')
            : 'Не выбран ответ';
    
        answersList += `${index + 1}. ${q.text}\n   Ответы: ${answerDisplay}\n\n`;
    });
    

    // 2. Получаем результат теста
    const resultTitle = document.querySelector('#result-text .result-title')?.textContent || 'Результат не определен';
    const resultDesc = document.querySelector('#result-description-text')?.innerText?.replace(/<[^>]*>/g, ' ') || '';
    
    // 3. Собираем статистику
    let stats = '';
    Object.entries(results).forEach(([emoji, count]) => {
        let style = '';
        switch(emoji) {
            case '⏳': style = 'Время вместе'; break;
            case '🤗': style = 'Прикосновения'; break;
            case '🎁': style = 'Подарки'; break;
            case '💬': style = 'Слова поддержки'; break;
        }
        stats += `${style}: ${count} баллов\n`;
    });

    // 4. Получаем желания
    const wish1 = document.getElementById('wish1')?.value || '—';
    const wish2 = document.getElementById('wish2')?.value || '—';
    const wish3 = document.getElementById('wish3')?.value || '—';
    const wishes = `1. ${wish1}\n2. ${wish2}\n3. ${wish3}`;

    // 5. Получаем максимальный результат
    const maxResults = getMaxResult();
    const loveStyle = maxResults.map(emoji => {
        switch(emoji) {
            case '⏳': return 'Время вместе (⏳)';
            case '🤗': return 'Прикосновения (🤗)';
            case '🎁': return 'Подарки (🎁)';
            case '💬': return 'Слова поддержки (💬)';
            default: return emoji;
        }
    }).join(', ');

    // 6. Формируем сообщение
    const fullMessage = `
🎯 РЕЗУЛЬТАТЫ ТЕСТА
━━━━━━━━━━━━━━━━━━━━
📊 СТАТИСТИКА ПО СТИЛЯМ:
${stats}

🏆 ОСНОВНОЙ СТИЛЬ ЛЮБВИ:
${loveStyle}
${resultDesc}

━━━━━━━━━━━━━━━━━━━━
📝 ОТВЕТЫ НА ВОПРОСЫ:
${answersList}
━━━━━━━━━━━━━━━━━━━━
💝 ЖЕЛАНИЯ:
${wishes}

📅 Дата: ${new Date().toLocaleString('ru-RU')}
    `;

    console.log('📧 Сообщение готово:', fullMessage);

    // 7. Отправка на почту
    if (typeof emailjs !== 'undefined') {
        emailjs.send('service_3q3z08l', 'template_qtzlnyy', {
            message: fullMessage,
            to_email: 'noname8787871@gmail.com', // ВАША ПОЧТА
            from_name: 'Valentine Test',
            subject: '💌 Результаты теста от Юленьки',
            love_style: loveStyle,
            wishes: wishes,
            date: new Date().toLocaleString('ru-RU')
        })
        .then(function(response) {
            console.log('✅ УСПЕШНО! Письмо отправлено!', response);
           
        }, function(error) {
            console.log('❌ ОШИБКА:', error);
           
        });
    } else {
        console.error('❌ EmailJS не подключен!');
    }

    return fullMessage;
};

})