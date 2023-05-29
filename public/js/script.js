const CATEGORIES = ["Frutas", "Móveis", "Objetos"]

const WORDS = {
    FRUITS: [
        "abacate",
        "acai",
        "banana",
        "caqui",
        "cereja",
        "laranja",
        "abacaxi",
        "acerola",
        "cacau",
        "carambola",
        "kiwi",
        "maca"
    ]
}

const FINAL_GRADE_STATUS = {
    TERRIBLE: {
        text: 'terrível',
        cssClassPrefix: 'terrible'
    },
    BAD: {
        text: 'ruim',
        cssClassPrefix: 'bad'
    },
    REGULAR: {
        text: 'regular',
        cssClassPrefix: 'regular'
    },
    GOOD: {
        text: 'bom',
        cssClassPrefix: 'good'
    },
    GREAT: {
        text: 'ótimo',
        cssClassPrefix: 'great'
    },
    EXCELENT: {
        text: 'excelente',
        cssClassPrefix: 'excelent'
    }
}

const sortFunc = () => .5 - Math.random()

const shuffledWords = [...WORDS.FRUITS].sort(sortFunc)

const nQuestions = shuffledWords.length

let currentWord = null
let answered = false
let rightQuestions = 0
let answeredQuestions = 0

const srcAudio = document.getElementById('srcAudio')
const ctrlAudio = document.getElementById('ctrlAudio')
const txtAnswer = document.getElementsByClassName('txt-answer')[0]
const errorMessage = document.getElementsByClassName('error-message')[0]
const successMessage = document.getElementsByClassName('success-message')[0]
const spanRightAnswer = document.getElementById('spanRightAnswer')
const btnCheck = document.getElementById('btnCheck')
const spanAnsweredNumber = document.getElementById('spanAnsweredNumber')
const spanQuestionNumber = document.getElementById('spanQuestionNumber')
const questionScreen = document.getElementById('questionScreen')
const feedbackScreen = document.getElementById('feedbackScreen')
const gradeText = document.getElementById('gradeText')
const gradeNumber = document.getElementById('gradeNumber')

spanQuestionNumber.innerText = '' + nQuestions

function loadNewWord() {
    currentWord = shuffledWords.pop()
    srcAudio.src = `./sounds/fruits/${currentWord}.pt-br.mp3`
    ctrlAudio.load()
}

function showSuccess() {
    errorMessage.style.width = '0'
    errorMessage.style.height = '0'

    successMessage.style.width = '500px'
    successMessage.style.height = '60px'
}

function showError() {
    successMessage.style.width = '0'
    successMessage.style.height = '0'

    errorMessage.style.width = '100%'
    errorMessage.style.height = '60px'

    spanRightAnswer.innerText = currentWord.toUpperCase()
}

function nextQuestion() {
    if (answeredQuestions === nQuestions) {
        showFeedbackScreen()
    } else {
        errorMessage.style.width = '0'
        errorMessage.style.height = '0'
        successMessage.style.width = '0'
        successMessage.style.height = '0'
        loadNewWord()
        txtAnswer.value = ''
    }
}

function checkAnswer() {
    if (answered) {
        answered = false
        btnCheck.textContent = 'corrigir'
        nextQuestion()
    } else {
        answeredQuestions++
        spanAnsweredNumber.innerText = '' + answeredQuestions
        answered = true
        btnCheck.textContent = 'próxima'
        if (txtAnswer.value === currentWord) {
            rightQuestions++
            showSuccess()
        } else {
            showError()
        }
    }
}

function showFeedbackScreen() {

    questionScreen.style.display = 'none'
    feedbackScreen.style.display = 'flex'

    const finalGrade = Number(((rightQuestions / answeredQuestions) * 10).toFixed(1))

    gradeAnimation(0, finalGrade)
}

function getStatusByGrade(grade) {
    if (grade < 2.5) {
        return FINAL_GRADE_STATUS.TERRIBLE
    } else if (grade < 5) {
        return FINAL_GRADE_STATUS.BAD
    } else if (grade < 6) {
        return FINAL_GRADE_STATUS.REGULAR
    } else if (grade < 7.5) {
        return FINAL_GRADE_STATUS.GOOD
    } else if (grade < 10) {
        return FINAL_GRADE_STATUS.GREAT
    } else {
        return FINAL_GRADE_STATUS.EXCELENT
    }
}

function gradeAnimation(current, ends) {
    const status = getStatusByGrade(current)

    gradeNumber.innerText = current + ''

    const className = status.cssClassPrefix + '-text'

    gradeNumber.classList = [className]
    gradeText.classList = [className]
    gradeText.innerText = status.text

    if (current < ends) {
        let nextValue = current + .2
        nextValue = Number((nextValue >= ends ? ends : nextValue).toFixed(1))
        setTimeout(() => gradeAnimation(nextValue, ends), 50)
    }
}

loadNewWord()