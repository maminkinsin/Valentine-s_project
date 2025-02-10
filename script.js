document.addEventListener("DOMContentLoaded", function() {
    // Элементы управления
    const yesBtn = document.getElementById("yes-btn");
    const noBtn = document.getElementById("no-btn");
    const startBtn = document.querySelector(".start-btn");
    const nextBtn = document.querySelectorAll(".next-btn");
   //const nextBtnBel = document.getElementById(".next-btn-bel");
    const entWishBtn = document.getElementById('enterWishBtn'); 
    const answers = document.querySelectorAll(".answer");

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
        document.getElementById("frame14")
    ];

    // Текущий фрейм и результаты
    let currentFrameIndex = 0;
    let results = { "⏳": 0, "🤗": 0, "🎁": 0, "💬": 0 };

    // ========================
    // ОСНОВНЫЕ ОБРАБОТЧИКИ
    // ========================

    // 1. Переход на фрейм с инструкцией (Of course)
    yesBtn.addEventListener("click", () => switchFrame(frames[0], frames[1]));

    // 2. Переход к первому вопросу (Start)
    document.addEventListener("keydown", (e) => {
        if (e.key === " " && currentFrameIndex === 1) {
            switchFrame(frames[1], frames[2]);
        }
    })

    document.addEventListener("keydown", (e) => {
        if (e.key === " " && currentFrameIndex === 11) {
            switchFrame(frames[11], frames[12]);
        }
    })


    startBtn.addEventListener("click", () => switchFrame(frames[2], frames[3]));
    // 3. Обработка выбора ответов
    answers.forEach(answer => {
        answer.addEventListener("click", () => handleAnswerClick(answer));
    });

    // 4. Обработка кнопок NEXT
    nextBtn.forEach((btn, index) => {
        btn.addEventListener("click", () => handleNextButton(index));
    });
    entWishBtn.addEventListener("click", () => switchFrame(frames[12], frames[13]));

    // nextBtnBel.forEach((btn, index) => {
    //     btn.addEventListener("click", () => switchFrame(frames[10], frames[11]));
    // });
    
    


    // 5. Убегающая кнопка "Nope"
        document.addEventListener("mousemove", moveButton);

    let targetX = 0, targetY = 0;
    let isMoving = false;

    function moveButton(event) {
        const btnRect = noBtn.getBoundingClientRect();
        const distance = Math.sqrt(
            Math.pow(event.clientX - (btnRect.left + btnRect.width / 2), 2) +
            Math.pow(event.clientY - (btnRect.top + btnRect.height / 2), 2)
        );

        if (distance < 350 && !isMoving) {
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
        let startX = parseFloat(noBtn.style.left) || 0;
        let startY = parseFloat(noBtn.style.top) || 0;
        let progress = 0;
        let speed = 0.05; // Чем меньше, тем плавнее движение

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


    // Переключение фреймов с анимацией
    function switchFrame(currentFrame, nextFrame) {
        if(currentFrameIndex > 1 && currentFrameIndex < 10){
        
        currentFrame.classList.add("hidden-right");
        }
        else{
            currentFrame.classList.add("hidden-down");
        }
        setTimeout(() => {
            currentFrame.style.display = "none";
            nextFrame.style.display = "flex";
            currentFrameIndex+=1

        }, 500);
    }

    // Обработка выбора ответа
    function handleAnswerClick(answer) {
        const selectedAnswers = document.querySelectorAll(".answer.selected");
        
        if (answer.classList.contains("selected")) {
            // Отмена выбора
            answer.classList.remove("selected");
            results[answer.dataset.emoji] -= 1;
        } else if (selectedAnswers.length < 2) {
            // Выбор (максимум 2 ответа)
            answer.classList.add("selected");
            results[answer.dataset.emoji] += 1;
        }
    }

    // Обработка кнопки NEXT
    function handleNextButton(btnIndex) {
        // Сброс выбранных ответов перед переходом
        document.querySelectorAll(".answer.selected").forEach(answer => {
            answer.classList.remove("selected");
        });

         //Переход к следующему фрейму или результатам
         if (currentFrameIndex < 9 || currentFrameIndex >9 ) { // 7 вопросов (frame3-frame9)
             switchFrame(frames[currentFrameIndex], frames[currentFrameIndex + 1]);
             
         } else if(currentFrameIndex ==9) {
             switchFrame(frames[currentFrameIndex], frames[10]);
             showResults();
         }
        
    }

    // Показ результатов
    // function showResults() {
    //     const resultText = document.getElementById("result-text");
    //     const maxEmoji = Object.entries(results).reduce(
    //         (a, b) => a[1] > b[1] ? a : b
    //     )[0];
        
    //     // Тексты результатов (можно настроить)
    //     const resultMessages = {
    //         "⏳": "Твой стиль любви: Время вместе! 🕰️",
    //         "🤗": "Твой стиль любви: Физическая близость! 💞",
    //         "🎁": "Твой стиль любви: Подарки и забота! 🎀",
    //         "💬": "Твой стиль любви: Слова поддержки! 💌"
    //     };
        
    //     resultText.textContent = resultMessages[maxEmoji];
    // }

    // ... (предыдущий код без изменений)

function showResults() {
    const resultText = document.getElementById("result-text");
    const resultDescriptionText = document.getElementById("result-description-text");
    // Формируем текст с результатами
    let resultHTML;
    let resultDescText;
    let switchResult;
    if(getMaxResult().length > 1){
        let switchResultArray = getMaxResult().split(",");
        switchResult = switchResultArray[0];
        console.log(switchResult);
    }   
    else {
        switchResult = getMaxResult();
    }
    switch(switchResult)
    {
        case '⏳': resultHTML =` <div class="result-title">Твой стиль любви: «ВРЕМЯ ВМЕСТЕ»:</div>`;
                    resultDescText = `<div class="result-title">Ты ценишь время, проведённое</div>
                                    <div class="result-title"> с любимым человеком.</div>
                                    <div class="result-title">Главное для тебя — внимание </div>
                                    <div class="result-title">  и совместные моменты ⏳ </div>
                                        
                    `;
        break;

        case '🤗': resultHTML =` <div class="result-title">Твой стиль любви: «ПРИКОСНОВЕНИЯ»:</div>`;
                    resultDescText = `<div class="result-title">Ты ценишь физическую близость: </div>
                                        <div class="result-title">объятия, поцелуи, держаться за руки.</div>
                                        <div class="result-title"> Это твой главный язык любви🤗 </div>
                    `;
        break;
        case '🎁': resultHTML =` <div class="result-title">Твой стиль любви: «ПОДАРКИ»:</div>`;
                    resultDescText = `<div class="result-title">Для тебя важны знаки   </div>
                                        <div class="result-title">внимания и сюрпризы.</div>
                                        <div class="result-title">Ты любишь радовать и</div>
                                        <div class="result-title"> получать подарки,</div>
                                        <div class="result-title">наполненные смыслом 🎁 </div>
                    
                    `;
        break;
        case '💬':resultHTML =` <div class="result-title">Твой стиль любви: «СЛОВА ПОДДЕРЖКИ»:</div>`;
                resultDescText = `<div class="result-title">Ты выражаешь чувства через   благодарность 💬 </div>
                                    <div class="result-title">комплименты, признания и поддержку.</div>
                                    <div class="result-title">Для тебя важны тёплые слова и</div>
                                    <div class="result-title">благодарность 💬</div>
                `;  
        break;
        default:resultHTML =` <div class="result-title">${getMaxResult()}</div>`;

    }

    resultText.innerHTML = resultHTML;
    resultDescriptionText.innerHTML = resultDescText;
    //document.getElementById("frame11").style.display = "flex";
}

function getMaxResult() {
    const max = Math.max(...Object.values(results));
    const emojis = Object.entries(results)
        .filter(([_, value]) => value === max)
        .map(([emoji]) => emoji);
        
    return emojis.join(",");
}
document.addEventListener("DOMContentLoaded", function () {
    const compliments = document.querySelectorAll(".compliment");

    compliments.forEach((compliment, index) => {
        // Задержка для каждого комплимента
        setTimeout(() => {
            compliment.style.animation = "fadeInUp 1s forwards";
        }, index * 500); // Каждый комплимент появляется через 0.5 секунды после предыдущего
    });

    // Показываем фрейм
    document.getElementById("frame12").style.display = "flex";
});
document.getElementById('next-frame-button').addEventListener('click', function() {
    // Переход к следующему фрейму (можно добавить логику перехода)
    alert('Переход к следующему фрейму!');
});
});


document.getElementById('enterWishBtn').addEventListener('click', function() {
    const wish1 = document.getElementById('wish1').value;
    const wish2 = document.getElementById('wish2').value;
    const wish3 = document.getElementById('wish3').value;

    const message = `1. ${wish1}\n2. ${wish2}\n3. ${wish3}`;

    // Инициализация EmailJS
    emailjs.init('2oLkdF0MbjFbovK35'); // Замените на ваш User ID из EmailJS

    // Отправка email
    emailjs.send('service_vvz1cvm', 'template_n3qxkku', {
        message: message
    }).then(function(response) {
        //alert('Ваши желания отправлены!');
    }, function(error) {
        //alert('Ошибка при отправке: ' + JSON.stringify(error));
    });
});