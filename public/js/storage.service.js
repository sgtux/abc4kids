const KEYS = {
    USERNAME: '@ABC4KIDS_USERNAME',
    AVATAR: '@ABC4KIDS_AVATAR'
}

const setUsername = username => localStorage.setItem(KEYS.USERNAME, username)

const getUsername = () => localStorage.getItem(KEYS.USERNAME)

const setAvatar = avatar => localStorage.setItem(KEYS.AVATAR, avatar)

const getAvatar = () => localStorage.getItem(KEYS.AVATAR)

export const storageService = {
    getUsername,
    setUsername,
    getAvatar,
    setAvatar
}