import assert from 'node:assert'
import { httpClient } from './utils'

describe('Rooms', () => {

    describe('Get all by user', () => {

        it('Return 2 alice\'s rooms', async () => {
            const cookie = (await httpClient
                .post('/login')
                .send({ username: 'alice1', password: '123456' }))
                .headers['set-cookie'][0]
            const result = await httpClient
                .get('/room')
                .set('Cookie', cookie)
            assert.equal(result.body.length, 3, 'Should be returned 3 rooms.')
        })

        it('Return 1 carlos\'s room', async () => {
            const cookie = (await httpClient
                .post('/login')
                .send({ username: 'carlos', password: '123456' }))
                .headers['set-cookie'][0]
            const result = await httpClient
                .get('/room')
                .set('Cookie', cookie)
            assert.equal(result.body.length, 1, 'Should be returned 2 rooms.')
        })
    })

    describe('Create room', () => {
        it('With no description', async () => {
            const cookie = (await httpClient
                .post('/login')
                .send({ username: 'bobb', password: '123456' }))
                .headers['set-cookie'][0]

            const result = await httpClient
                .post('/room')
                .set('Cookie', cookie)
                .send({ description: '' })

            assert.equal(result.body.errors[0], 'O campo descrição é obrigatório.')
        })

        it('Students cat\'n create rooms', async () => {
            const cookie = (await httpClient
                .post('/login')
                .send({ username: 'aluno1', password: '123456' }))
                .headers['set-cookie'][0]

            const result = await httpClient
                .post('/room')
                .set('Cookie', cookie)
                .send({ description: '' })

            assert.equal(result.body.errors[0], 'Apenas professores podem criar salas.')
        })

        it('Successfully', async () => {
            const cookie = (await httpClient
                .post('/login')
                .send({ username: 'bobb', password: '123456' }))
                .headers['set-cookie'][0]

            const result = await httpClient
                .post('/room')
                .set('Cookie', cookie)
                .send({ description: 'bobb\'s sala 1' })

            assert.equal(result.body.message, 'A sala criada com sucesso.')
        })
    })

    describe('Update room status', () => {
        it('Room not found', async () => {
            const cookie = (await httpClient
                .post('/login')
                .send({ username: 'alice1', password: '123456' }))
                .headers['set-cookie'][0]

            const result = await httpClient
                .put('/room/status')
                .set('Cookie', cookie)
                .send({ id: 99, status: 'OPENED' })

            assert.equal(result.body.errors[0], 'A sala informada não foi encontrada.')
        })

        it('Room belongs another user', async () => {
            const cookie = (await httpClient
                .post('/login')
                .send({ username: 'alice1', password: '123456' }))
                .headers['set-cookie'][0]

            const result = await httpClient
                .put('/room/status')
                .set('Cookie', cookie)
                .send({ id: 3, status: 'OPENED' })

            assert.equal(result.body.errors[0], 'A sala informada pertence à outro usuário.')
        })

        it('Invalid status', async () => {
            const cookie = (await httpClient
                .post('/login')
                .send({ username: 'alice1', password: '123456' }))
                .headers['set-cookie'][0]

            const result = await httpClient
                .put('/room/status')
                .set('Cookie', cookie)
                .send({ id: 2, status: 'OPENE' })

            assert.equal(result.body.errors[0], 'O status informado é inválido.')
        })

        it('Successfully', async () => {
            const cookie = (await httpClient
                .post('/login')
                .send({ username: 'alice1', password: '123456' }))
                .headers['set-cookie'][0]

            const result = await httpClient
                .put('/room/status')
                .set('Cookie', cookie)
                .send({ id: 2, status: 'OPEN' })

            assert.equal(result.body.message, 'O status da sala foi atualizado com sucesso.')
        })
    })

    describe('Remove room', () => {

        it('Room not found', async () => {
            const cookie = (await httpClient
                .post('/login')
                .send({ username: 'alice1', password: '123456' }))
                .headers['set-cookie'][0]

            const result = await httpClient
                .delete('/room/99')
                .set('Cookie', cookie)
                .send({ id: 99, status: 'OPENED' })

            assert.equal(result.body.errors[0], 'A sala informada não foi encontrada.')
        })

        it('Room belongs another user', async () => {
            const cookie = (await httpClient
                .post('/login')
                .send({ username: 'alice1', password: '123456' }))
                .headers['set-cookie'][0]

            const result = await httpClient
                .delete('/room/3')
                .set('Cookie', cookie)

            assert.equal(result.body.errors[0], 'A sala informada pertence à outro usuário.')
        })

        it('Remove successfully', async () => {
            const cookie = (await httpClient
                .post('/login')
                .send({ username: 'alice1', password: '123456' }))
                .headers['set-cookie'][0]

            const result = await httpClient
                .delete('/room/4')
                .set('Cookie', cookie)

            assert.equal(result.body.message, 'A sala foi removida com sucesso.')
        })
    })

    describe('Add Word', () => {

        it('Null word', async () => {
            const cookie = (await httpClient
                .post('/login')
                .send({ username: 'alice1', password: '123456' }))
                .headers['set-cookie'][0]

            const result = await httpClient
                .post('/room/word')
                .set('Cookie', cookie)
                .send({ roomId: 2 })

            assert.equal(result.body.errors[0], 'A palavra é obrigatória.')
        })

        it('Empty word', async () => {
            const cookie = (await httpClient
                .post('/login')
                .send({ username: 'alice1', password: '123456' }))
                .headers['set-cookie'][0]

            const result = await httpClient
                .post('/room/word')
                .set('Cookie', cookie)
                .send({ roomId: 2, word: '' })

            assert.equal(result.body.errors[0], 'A palavra é obrigatória.')
        })

        it('Room not found', async () => {
            const cookie = (await httpClient
                .post('/login')
                .send({ username: 'alice1', password: '123456' }))
                .headers['set-cookie'][0]

            const result = await httpClient
                .post('/room/word')
                .set('Cookie', cookie)
                .send({ roomId: 99, word: 'TABLE' })

            assert.equal(result.body.errors[0], 'A sala informada não foi encontrada.')
        })

        it('Room belongs another user', async () => {
            const cookie = (await httpClient
                .post('/login')
                .send({ username: 'alice1', password: '123456' }))
                .headers['set-cookie'][0]

            const result = await httpClient
                .post('/room/word')
                .set('Cookie', cookie)
                .send({ roomId: 3, word: 'TABLE' })

            assert.equal(result.body.errors[0], 'A sala informada pertence à outro usuário.')
        })

        it('Add word successfully', async () => {
            const cookie = (await httpClient
                .post('/login')
                .send({ username: 'alice1', password: '123456' }))
                .headers['set-cookie'][0]

            const result = await httpClient
                .post('/room/word')
                .set('Cookie', cookie)
                .send({ roomId: 2, word: 'TABLE' })

            assert.equal(result.body.message, 'A palavra foi adicionada à sala com sucesso.')
        })
    })

    describe('Remove Word', () => {

        it('Room not found', async () => {
            const cookie = (await httpClient
                .post('/login')
                .send({ username: 'alice1', password: '123456' }))
                .headers['set-cookie'][0]

            const result = await httpClient
                .delete('/room/99/word/a')
                .set('Cookie', cookie)

            assert.equal(result.body.errors[0], 'A sala informada não foi encontrada.')
        })

        it('Room belongs another user', async () => {
            const cookie = (await httpClient
                .post('/login')
                .send({ username: 'alice1', password: '123456' }))
                .headers['set-cookie'][0]

            const result = await httpClient
                .delete('/room/3/word/table')
                .set('Cookie', cookie)

            assert.equal(result.body.errors[0], 'A sala informada pertence à outro usuário.')
        })

        it('Remove word successfully', async () => {
            const cookie = (await httpClient
                .post('/login')
                .send({ username: 'alice1', password: '123456' }))
                .headers['set-cookie'][0]

            const result = await httpClient
                .delete('/room/2/word/table')
                .set('Cookie', cookie)

            assert.equal(result.body.message, 'A palavra foi removida da sala com sucesso.')
        })
    })

    describe('Add Student', () => {

        it('Null student', async () => {
            const cookie = (await httpClient
                .post('/login')
                .send({ username: 'alice1', password: '123456' }))
                .headers['set-cookie'][0]

            const result = await httpClient
                .post('/room/student')
                .set('Cookie', cookie)
                .send({ roomId: 2 })

            assert.equal(result.body.errors[0], 'O aluno é obrigatório.')
        })

        it('Student does not exist', async () => {
            const cookie = (await httpClient
                .post('/login')
                .send({ username: 'alice1', password: '123456' }))
                .headers['set-cookie'][0]

            const result = await httpClient
                .post('/room/student')
                .set('Cookie', cookie)
                .send({ roomId: 2, studentId: 99 })

            assert.equal(result.body.errors[0], 'O aluno informado não foi encontrado.')
        })

        it('Room not found', async () => {
            const cookie = (await httpClient
                .post('/login')
                .send({ username: 'alice1', password: '123456' }))
                .headers['set-cookie'][0]

            const result = await httpClient
                .post('/room/student')
                .set('Cookie', cookie)
                .send({ roomId: 99, studentId: 4 })

            assert.equal(result.body.errors[0], 'A sala informada não foi encontrada.')
        })

        it('Room belongs another user', async () => {
            const cookie = (await httpClient
                .post('/login')
                .send({ username: 'alice1', password: '123456' }))
                .headers['set-cookie'][0]

            const result = await httpClient
                .post('/room/student')
                .set('Cookie', cookie)
                .send({ roomId: 3, studentId: 4 })

            assert.equal(result.body.errors[0], 'A sala informada pertence à outro usuário.')
        })

        it('User is not a student', async () => {
            const cookie = (await httpClient
                .post('/login')
                .send({ username: 'alice1', password: '123456' }))
                .headers['set-cookie'][0]

            const result = await httpClient
                .post('/room/student')
                .set('Cookie', cookie)
                .send({ roomId: 2, studentId: 2 })

            assert.equal(result.body.errors[0], 'Apenas alunos podem ser incluídos nas salas.')
        })

        it('Add student successfully', async () => {
            const cookie = (await httpClient
                .post('/login')
                .send({ username: 'alice1', password: '123456' }))
                .headers['set-cookie'][0]

            const result = await httpClient
                .post('/room/student')
                .set('Cookie', cookie)
                .send({ roomId: 2, studentId: 4 })

            assert.equal(result.body.message, 'O aluno foi adicionado à sala com sucesso.')
        })
    })

    describe('Remove Student', () => {

        it('Room not found', async () => {
            const cookie = (await httpClient
                .post('/login')
                .send({ username: 'alice1', password: '123456' }))
                .headers['set-cookie'][0]

            const result = await httpClient
                .delete('/room/99/student/4')
                .set('Cookie', cookie)

            assert.equal(result.body.errors[0], 'A sala informada não foi encontrada.')
        })

        it('Room belongs another user', async () => {
            const cookie = (await httpClient
                .post('/login')
                .send({ username: 'alice1', password: '123456' }))
                .headers['set-cookie'][0]

            const result = await httpClient
                .delete('/room/3/student/4')
                .set('Cookie', cookie)

            assert.equal(result.body.errors[0], 'A sala informada pertence à outro usuário.')
        })

        it('Remove student successfully', async () => {
            const cookie = (await httpClient
                .post('/login')
                .send({ username: 'alice1', password: '123456' }))
                .headers['set-cookie'][0]

            const result = await httpClient
                .delete('/room/2/student/4')
                .set('Cookie', cookie)

            assert.equal(result.body.message, 'O aluno foi removido da sala com sucesso.')
        })
    })

})