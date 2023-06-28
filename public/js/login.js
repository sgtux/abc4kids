'use strict'

import { storageService } from './storage.service.js'
import { httpService } from './http.service.js'

const lkChangeMode = document.getElementById('lkChangeMode')
const divErrorList = document.getElementById('divErrorList')
const txtUsername = document.getElementById('txtUsername')
const txtPassword = document.getElementById('txtPassword')
const txtPasswordConfirm = document.getElementById('txtPasswordConfirm')
const divAvatarsList = document.getElementById('divAvatarsList')
const divPasswordConfirm = document.getElementById('divPasswordConfirm')
const divType = document.getElementById('divType')
const imgAvatarLogin = document.getElementById('imgAvatarLogin')
const btnLogin = document.getElementById('btnLogin')
const usernameErrorMessage = document.getElementById('usernameErrorMessage')
const passwordErrorMessage = document.getElementById('passwordErrorMessage')
const divSuccessMessage = document.getElementById('divSuccessMessage')
const divLoginAccount = document.getElementById('divLoginAccount')

const SCREEN_MODES = {
    LOGIN: 1,
    CREATE: 2
}

let screenMode = SCREEN_MODES.CREATE

let usernameOk = false

let selectedAvatar

let selectedType

const isLoginMode = () => screenMode === SCREEN_MODES.LOGIN

async function validateUsernameLoginMode() {
    const username = txtUsername.value
    if (username && username !== storageService.getUsername()) {
        storageService.setUsername(username)
        const result = await httpService.getAvatar(username)
        imgAvatarLogin.classList.remove('fade-in-effect')
        let srcImg
        if (result.avatar) {
            usernameErrorMessage.style.display = 'none'
            usernameOk = true
            srcImg = `./avatars/${result.avatar}.png`
        }
        else {
            srcImg = './avatars/avatar-blank.png'
            usernameErrorMessage.innerText = 'Usuário não encontrado'
            usernameErrorMessage.style.display = 'block'
            usernameOk = false
        }
        setTimeout(() => {
            imgAvatarLogin.src = srcImg
            imgAvatarLogin.classList.add('fade-in-effect')
            storageService.setAvatar(Number(imgAvatarLogin.src.split('/').pop().replace(/\.[a-zA-Z]*/g, '')))
        }, 1)
        validateForm()
    }
}

async function validateUsernameCreateMode() {
    const username = txtUsername.value
    if (username) {
        const result = await httpService.getAvatar(username)
        if (result.avatar) {
            usernameErrorMessage.innerText = 'Nome já existe'
            usernameErrorMessage.style.display = 'block'
            usernameOk = false
        }
        else {
            usernameErrorMessage.style.display = 'none'
            usernameOk = true
        }
        validateForm()
    }
}

async function sendForm() {
    const username = txtUsername.value
    const password = txtPassword.value
    const confirm = txtPasswordConfirm.value
    if (screenMode === SCREEN_MODES.LOGIN) {
        const result = await httpService.login(username, password)
        if ((result.errors || []).length)
            passwordErrorMessage.style.display = 'block'
        else {
            passwordErrorMessage.style.display = 'none'
            storageService.setUsername(username)
            location.href = '/'
        }
    } else {
        const result = await httpService.createUser(username, password, confirm, selectedType, selectedAvatar)
        if ((result.errors || []).length) {
            let html = ''
            for (const error of result.errors) {
                html += `<div class="error-box">${error}</div>`
            }
            divErrorList.innerHTML = html
        } else {
            clearForm()
            divSuccessMessage.innerText = 'Usuário criado!'
            divSuccessMessage.style.display = 'block'
            validateForm()
            setTimeout(() => changeScreenMode(), 1000)
        }
    }
}

async function validateUsername() {
    if (isLoginMode()) {
        await validateUsernameLoginMode()
    } else {
        await validateUsernameCreateMode()
    }
}

function changeScreenMode() {
    clearForm()
    divLoginAccount.classList.remove('fade-out-fade-in-effect')
    setTimeout(() => {
        divLoginAccount.classList.add('fade-out-fade-in-effect')
    }, 1)
    setTimeout(() => {
        if (screenMode === SCREEN_MODES.LOGIN) {
            screenMode = SCREEN_MODES.CREATE
            lkChangeMode.innerHTML = 'Entrar'
            divPasswordConfirm.style.display = 'flex'
            divAvatarsList.style.display = 'block'
            imgAvatarLogin.style.display = 'none'
            btnLogin.innerText = 'Criar'
            divType.style.display = 'flex'
            validateFormCreateMode()
        } else {
            screenMode = SCREEN_MODES.LOGIN
            lkChangeMode.innerHTML = 'Criar Conta'
            divPasswordConfirm.style.display = 'none'
            divAvatarsList.style.display = 'none'
            imgAvatarLogin.style.display = 'block'
            divType.style.display = 'none'
            btnLogin.innerText = 'Entrar'
            btnLogin.setAttribute('disabled', true)
        }
    }, 300)
}

function validateFormLoginMode() {
    if (usernameOk && (txtPassword.value || '').length > 3) {
        btnLogin.removeAttribute('disabled')
        usernameErrorMessage.style.display = 'none'
        passwordErrorMessage.style.display = 'none'
    } else {
        btnLogin.setAttribute('disabled', true)
    }
}

function validateFormCreateMode() {
    if (usernameOk
        && (txtPassword.value || '').length > 3
        && txtPassword.value === txtPasswordConfirm.value
        && selectedAvatar
        && selectedType) {
        usernameErrorMessage.style.display = 'none'
        passwordErrorMessage.style.display = 'none'
    }

    if (selectedAvatar && selectedType)
        btnLogin.removeAttribute('disabled')
}

function validateForm() {
    if (isLoginMode())
        validateFormLoginMode()
    else
        validateFormCreateMode()
};

function clearForm() {
    txtUsername.value = ''
    txtPassword.value = ''
    txtPasswordConfirm.value = ''
    usernameErrorMessage.style.display = 'none'
    passwordErrorMessage.style.display = 'none'
    divErrorList.innerHTML = ''
    divSuccessMessage.innerText = ''
    divSuccessMessage.style.display = 'none'
}

function fadeInForm() {
    screenMode = SCREEN_MODES.LOGIN
    lkChangeMode.innerHTML = 'Criar Conta'
    divPasswordConfirm.style.display = 'none'
    divAvatarsList.style.display = 'none'
    imgAvatarLogin.style.display = 'block'
    divType.style.display = 'none'
    btnLogin.innerText = 'Entrar'
    divLoginAccount.classList.add('fade-in-effect')
    divLoginAccount.style.opacity = 1
    setTimeout(() => divLoginAccount.classList.remove('fade-in-effect'), 500)
}

window.validateForm = validateForm;
window.sendForm = sendForm;
window.validateUsername = validateUsername;
window.changeScreenMode = changeScreenMode;

(function () {
    localStorage.clear()

    fadeInForm()

    for (const item of divAvatarsList.getElementsByTagName('img'))
        item.addEventListener('mousedown', e => {
            for (const elem of divAvatarsList.getElementsByTagName('img')) {
                if (elem.src === e.target.src) {
                    elem.classList.add('selected')
                    selectedAvatar = Number(elem.src.split('/').pop().replace(/\.[a-zA-Z]*/g, ''))
                    validateForm()
                }
                else
                    elem.classList.remove('selected')
            }
        })


    for (const item of divType.getElementsByTagName('input'))
        item.addEventListener('click', () => {
            selectedType = Number(item.value)
            validateForm()
        })

})()