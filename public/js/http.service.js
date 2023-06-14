async function doRequest(url, method, data) {
    let result = null
    if (data)
        result = await fetch(url, {
            method,
            body: JSON.stringify(data),
            headers: {
                'Content-Type': 'application/json'
            },
        })
    else
        result = await fetch(url, { method })

    if (result.status === 401)
        location.href = '/login.html'

    return await result.json()
}

async function getRooms() {
    return await doRequest('/room', 'get')
}

async function getAvatar(username) {
    return await doRequest('/user-avatar/' + username, 'get')
}

async function login(username, password) {
    return await doRequest('/login', 'post', { username, password })
}

async function createUser(username, password, type, avatar) {
    return await doRequest('/user', 'post', { username, password, type, avatar })
}

export const httpService = {
    getRooms,
    getAvatar,
    login,
    createUser
}