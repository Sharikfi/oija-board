import readline from 'readline';
import { setTimeout } from 'timers/promises';
import fs from 'fs';
import path from 'path';

const colors = {
    cyan: '\x1b[36m',
    green: '\x1b[32m',
    yellow: '\x1b[33m',
    magenta: '\x1b[35m',
    red: '\x1b[31m',
    reset: '\x1b[0m'
};

const configDir = path.join('');
const configPath = path.join('config.json');

let config = {
    lang: 'ru'
};

function initConfig() {
    try {
        if (!fs.existsSync(configDir)) {
            fs.mkdirSync(configDir, { recursive: true });
        }

        if (fs.existsSync(configPath)) {
            const rawData = fs.readFileSync(configPath, 'utf8');
            const loadedConfig = JSON.parse(rawData);
            config = { ...config, ...loadedConfig };
        } else {
            fs.writeFileSync(configPath, JSON.stringify(config, null, 2));
        }

        if (!['ru', 'en'].includes(config.lang)) {
            throw new Error('Invalid language in config');
        }
        
    } catch (e) {
        console.error(colors.red + `Config error: ${e.message}. Using default settings.` + colors.reset);
        config.lang = 'ru';
    }
}

const locales = {
    ru: {
        welcome: `
                      ██                    ██                                      ▀███  
                                            ██                                        ██  
  ▄██▀██▄▀███  ▀███ ▀███  ▀███ ▄█▀██▄       ██▄████▄   ▄██▀██▄ ▄█▀██▄ ▀███▄███   ▄█▀▀███  
 ██▀   ▀██ ██    ██   ██    ████   ██       ██    ▀██ ██▀   ▀███   ██   ██▀ ▀▀ ▄██    ██  
 ██     ██ ██    ██   ██    ██ ▄█████       ██     ██ ██     ██▄█████   ██     ███    ██  
 ██▄   ▄██ ██    ██   ██    ████   ██       ██▄   ▄██ ██▄   ▄███   ██   ██     ▀██    ██  
  ▀█████▀  ▀████▀███▄████▄  ██▀████▀██▄     █▀█████▀   ▀█████▀▀████▀██▄████▄    ▀████▀███▄
                         ██ ██                                                            
                         ▀███                                                             
    
    
    Добро пожаловать в цифровую доску Уиджи!
    Задайте вопрос и получите ответ духов...
    Для выхода введите ${colors.red}exit${colors.yellow}`,
        question: 'Ваш вопрос >',
        exit: 'Сеанс завершен. Берегите себя...',
        error: 'Задайте настоящий вопрос!'
    },
    en: {
        welcome: `
                      ██                    ██                                      ▀███  
                                            ██                                        ██  
  ▄██▀██▄▀███  ▀███ ▀███  ▀███ ▄█▀██▄       ██▄████▄   ▄██▀██▄ ▄█▀██▄ ▀███▄███   ▄█▀▀███  
 ██▀   ▀██ ██    ██   ██    ████   ██       ██    ▀██ ██▀   ▀███   ██   ██▀ ▀▀ ▄██    ██  
 ██     ██ ██    ██   ██    ██ ▄█████       ██     ██ ██     ██▄█████   ██     ███    ██  
 ██▄   ▄██ ██    ██   ██    ████   ██       ██▄   ▄██ ██▄   ▄███   ██   ██     ▀██    ██  
  ▀█████▀  ▀████▀███▄████▄  ██▀████▀██▄     █▀█████▀   ▀█████▀▀████▀██▄████▄    ▀████▀███▄
                         ██ ██                                                            
                         ▀███                                                             
    
    
    Welcome to Digital Ouija Board!
    Ask a question and get spirit's answer...
    Type ${colors.red}exit${colors.yellow} to quit`,
        question: 'Your question >',
        exit: 'Session ended. Stay safe...',
        error: 'Please ask a real question!'
    }
};

const answers = {
    ru: [
        'ДА', 'НЕТ', 'ВОЗМОЖНО', 'СОВЕРШЕННО ВЕРНО',
        'НИКОГДА', 'СПРОСИ СНОВА', 'НЕ СЕЙЧАС', 'ДУХИ',
        'ТАЙНА', 'ПРОШЛОЕ', 'БУДУЩЕЕ', 'ОПАСНОСТЬ',
        'ОСТОРОЖНО', 'СМЕРТЬ', 'ЛЮБОВЬ', 'УСПЕХ'
    ],
    en: [
        'YES', 'NO', 'MAYBE', 'CERTAINLY',
        'NEVER', 'ASK AGAIN', 'NOT NOW', 'SPIRITS',
        'SECRET', 'PAST', 'FUTURE', 'DANGER',
        'CAUTION', 'DEATH', 'LOVE', 'SUCCESS'
    ]
};

async function typeEffect(text, delay = 30, color = colors.magenta) {
    process.stdout.write(color);
    for (const char of text) {
        process.stdout.write(char);
        await setTimeout(delay);
    }
    console.log(colors.reset + '\n');
}

function getAnswer() {
    return answers[config.lang][Math.floor(Math.random() * answers[config.lang].length)];
}

function startSession() {
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });

    console.log(colors.yellow + locales[config.lang].welcome + colors.reset);

    function ask() {
        rl.question(colors.cyan + locales[config.lang].question + ' ' + colors.reset, async (question) => {
            if (question.toLowerCase() === 'exit') {
                console.log(colors.yellow + '\n' + locales[config.lang].exit + '\n' + colors.reset);
                rl.close();
                return;
            }

            if (!question.trim()) {
                console.log(colors.red + locales[config.lang].error + colors.reset);
                return ask();
            }

            await typeEffect('🌀 ' + (config.lang === 'ru' ? 'Ответ:' : 'Answer:') + ' ' + getAnswer());
            ask();
        });
    }

    ask();
}

initConfig();
startSession();