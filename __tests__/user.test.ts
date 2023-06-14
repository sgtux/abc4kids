import assert from 'node:assert'
import { httpClient } from './utils'
import { User } from '../src/models'

describe('Users', () => {

    describe('Get All', () => {

        it('_', async () => {
            const cookie = (await httpClient
                .post('/login')
                .send({ username: 'alice1', password: '123456' }))
                .headers['set-cookie'][0]
            const result = await httpClient
                .get('/user')
                .set('Cookie', cookie)
            assert.equal(result.body.length, 4, 'Should be returned 4 users.')
        })
    })

    describe('Validade if user exists returning avatar', () => {

        it('Exists', async () => {

            const result = await httpClient
                .get('/user-avatar/carlos')
                .send({ username: 'carlos' })

            assert.equal(result.body.avatar, 2, 'Should be returned 2.')
        })

        it('Don\'t exists', async () => {

            const result = await httpClient
                .get('/user-avatar/carloss')

            assert.equal(!!result.body.avatar, false, 'Should be returned false.')
        })
    })

    describe('Create User', () => {

        it('Username field is required', async () => {
            const result = await httpClient
                .post('/user')
                .send({ username: '', password: '123456', type: 2, avatar: 2 })
                .expect(400)
            assert.equal(result.body.errors[0], 'O campo nome é obrigatório.')
        })

        it('Username with less then 4 chars', async () => {
            const result = await httpClient
                .post('/user')
                .send({ username: 'ali', password: '123456', type: 2, avatar: 2 })
            assert.equal(result.body.errors[0], 'O campo nome deve ter entre 4 e 20 caracteres.')
        })

        it('Username with more then 20 chars', async () => {
            const result = await httpClient
                .post('/user')
                .send({ username: 'alicealicealicealicea', password: '123456', type: 2, avatar: 2 })
            assert.equal(result.body.errors[0], 'O campo nome deve ter entre 4 e 20 caracteres.')
        })

        it('Username with invalid chars', async () => {
            const result = await httpClient
                .post('/user')
                .send({ username: 'alic@e1', password: '123456', type: 2, avatar: 2 })
            assert.equal(result.body.errors[0], 'O campo nome possui caracteres inválidos.')
        })

        it('Password field is required', async () => {
            const result = await httpClient
                .post('/user')
                .send({ username: 'alice1', password: '', type: 2, avatar: 2 })
            assert.equal(result.body.errors[0], 'O campo senha é obrigatório.')
        })

        it('Password with less then 6 chars', async () => {
            const result = await httpClient
                .post('/user')
                .send({ username: 'alice1', password: '12345', type: 2, avatar: 2 })
            assert.equal(result.body.errors[0], 'O campo senha deve ter entre 6 e 20 caracteres.')
        })

        it('Password with more then 20 chars', async () => {
            const result = await httpClient
                .post('/user')
                .send({ username: 'alice1', password: '123451234512345123451', type: 2, avatar: 2 })
            assert.equal(result.body.errors[0], 'O campo senha deve ter entre 6 e 20 caracteres.')
        })

        it('Password field with invalid chars', async () => {
            const result = await httpClient
                .post('/user')
                .send({ username: 'alice1', password: '123*456', type: 2, avatar: 2 })
            assert.equal(result.body.errors[0], 'O campo senha possui caracteres inválidos.')
        })

        it('Type field is required', async () => {
            const result = await httpClient
                .post('/user')
                .send({ username: 'alice1', password: '', avatar: 2 })
            assert.equal(result.body.errors[0], 'O campo tipo é obrigatório.')
        })

        it('Invalid type field', async () => {
            const result = await httpClient
                .post('/user')
                .send({ username: 'alice1', password: '123456', type: 3, avatar: 2 })
            assert.equal(result.body.errors[0], 'O tipo informado é inválido.')
        })

        it('Avatar field is required', async () => {
            const result = await httpClient
                .post('/user')
                .send({ username: 'alice1', password: '123456', type: 2 })
            assert.equal(result.body.errors[0], 'O campo avatar é obrigatório.')
        })

        it('Invalid avatar field', async () => {
            const result = await httpClient
                .post('/user')
                .send({ username: 'alice1', password: '123456', type: 2, avatar: 0 })
            assert.equal(result.body.errors[0], 'O avatar informado é inválido.')
        })

        it('Create user successfully', async () => {
            const result = await httpClient
                .post('/user')
                .send({ username: 'alice10', password: '123456', type: 2, avatar: 2 })
            assert.equal((result.body.errors || []).length, 0, 'Should returns with no errors.')
        })

    })

    describe('Login', () => {

        it('With no name', async () => {
            const result = await httpClient
                .post('/login')
                .send({ username: '', password: '123456' })
            assert.equal(result.body.errors[0], 'Os campos nome e senha são obrigatórios.')
        })

        it('With no password', async () => {
            const result = await httpClient
                .post('/login')
                .send({ username: 'carlos', password: '' })
            assert.equal(result.body.errors[0], 'Os campos nome e senha são obrigatórios.')
        })

        it('User not found', async () => {
            const result = await httpClient
                .post('/login')
                .send({ username: 'carloss', password: '123456' })
            assert.equal(result.body.errors[0], 'O nome informado não foi encontrado.')
        })

        it('Invalid password', async () => {
            const result = await httpClient
                .post('/login')
                .send({ username: 'carlos', password: '123456e' })
            assert.equal(result.body.errors[0], 'A senha informada é inválida.')
        })

        it('Successfully', async () => {
            const result = await httpClient
                .post('/login')
                .send({ username: 'carlos', password: '123456' })
            assert.equal(result.body.message, 'Autenticado com sucesso.')
        })

    })

    describe('Logout', () => {

        it('Logout Successfully', async () => {

            let result = await httpClient
                .post('/login')
                .send({ username: 'alice1', password: '123456' })

            result = await httpClient
                .get('/logout')
                .set('Cookie', result.headers['set-cookie'][0])
                .send({ username: 'carlos' })

            const cookie = result.headers['set-cookie'][0]

            assert.equal(cookie, 'abc4kids_token=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT', 'Cookie returned is invalid.')
        })
    })
})