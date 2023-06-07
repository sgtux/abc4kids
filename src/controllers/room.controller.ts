import { Application } from 'express'
import { BaseController } from '.'
import { roomRepository, userRepository } from '../repositories'
import { AppRequest, AppResponse, Room, RoomStudent, RoomWord, UserType } from '../models'
import { exceptionHandler } from '../handlers/exception.handler'
import { validationErrorHandler } from '../handlers/validation-error.handler'

export class RoomController extends BaseController {

    route(app: Application) {
        app.get('/room', (req, res) => void exceptionHandler(req, res, this.getAll))
        app.post('/room', (req, res) => void exceptionHandler(req, res, this.createRoom))
        app.put('/room/status', (req, res) => void exceptionHandler(req, res, this.updateStatus))
        app.delete('/room/:id', (req, res) => void exceptionHandler(req, res, this.remove))
        app.post('/room/word', (req, res) => void exceptionHandler(req, res, this.addWord))
        app.delete('/room/:id/word/:word', (req, res) => void exceptionHandler(req, res, this.removeWord))
        app.post('/room/student', (req, res) => void exceptionHandler(req, res, this.addStudent))
        app.delete('/room/:id/student/:student', (req, res) => void exceptionHandler(req, res, this.removeStudent))
    }

    private async getAll(req: AppRequest, res: AppResponse) {
        const rooms = await roomRepository.getAllByTeacher(req.user.id)
        res.json(rooms)
    }

    private async createRoom(req: AppRequest, res: AppResponse) {
        const { description } = (req.body || {}) as Room

        if (req.user.type !== UserType.Teacher)
            return validationErrorHandler('Apenas professores podem criar salas.', res)

        await roomRepository.createRoom(req.user.id, description)
        res.json({ message: 'A sala criada com sucesso.' })
    }

    private async updateStatus(req: AppRequest, res: AppResponse) {
        const { id, status } = (req.body || {}) as Room

        const room = await roomRepository.getById(id)

        if (!room)
            return validationErrorHandler('A sala informada não foi encontrada.', res)

        if (room.teacherId !== req.user.id)
            return validationErrorHandler('A sala informada pertence à outro usuário.', res)

        await roomRepository.updateStatus(id, status)
        res.json({ message: 'O status da sala foi atualizado com sucesso.' })
    }

    private async remove(req: AppRequest, res: AppResponse) {
        const id = Number(req.params.id)
        const room = await roomRepository.getById(id)

        if (!room)
            return validationErrorHandler('A sala informada não foi encontrada.', res)

        if (room.teacherId !== req.user.id)
            return validationErrorHandler('A sala informada pertence à outro usuário.', res)

        await roomRepository.remove(id)

        res.json({ message: 'A sala foi removida com sucesso.' })
    }

    private async addWord(req: AppRequest, res: AppResponse) {
        const { roomId, word } = (req.body || {}) as RoomWord

        if (!word)
            return validationErrorHandler('A palavra é obrigatória.', res)

        const room = await roomRepository.getById(roomId)

        if (!room)
            return validationErrorHandler('A sala informada não foi encontrada.', res)

        if (room.teacherId !== req.user.id)
            return validationErrorHandler('A sala informada pertence à outro usuário.', res)

        await roomRepository.addWord(roomId, word.toLowerCase())
        res.json({ message: 'A palavra foi adicionada à sala com sucesso.' })
    }

    private async removeWord(req: AppRequest, res: AppResponse) {
        const roomId = Number(req.params.id)
        const word = req.params.word

        if (!word)
            return validationErrorHandler('A palavra é obrigatória.', res)

        const room = await roomRepository.getById(roomId)

        if (!room)
            return validationErrorHandler('A sala informada não foi encontrada.', res)

        if (room.teacherId !== req.user.id)
            return validationErrorHandler('A sala informada pertence à outro usuário.', res)

        await roomRepository.removeWord(roomId, word.toLowerCase())
        res.json({ message: 'A palavra foi removida da sala com sucesso.' })
    }

    private async addStudent(req: AppRequest, res: AppResponse) {
        const { roomId, studentId } = (req.body || {}) as RoomStudent

        if (!studentId)
            return validationErrorHandler('O aluno é obrigatório.', res)

        const user = await userRepository.findUserById(studentId)
        if (!user)
            return validationErrorHandler('O aluno informado não foi encontrado.', res)

        if (user.type !== UserType.Student)
            return validationErrorHandler('Apenas alunos podem ser incluídos nas salas.', res)

        const room = await roomRepository.getById(roomId)

        if (!room)
            return validationErrorHandler('A sala informada não foi encontrada.', res)

        if (room.teacherId !== req.user.id)
            return validationErrorHandler('A sala informada pertence à outro usuário.', res)

        await roomRepository.addStudent(roomId, studentId)
        res.json({ message: 'O aluno foi adicionado à sala com sucesso.' })
    }

    private async removeStudent(req: AppRequest, res: AppResponse) {
        const roomId = Number(req.params.id)
        const studentId = Number(req.params.student)

        if (!studentId)
            return validationErrorHandler('O aluno é obrigatório.', res)

        const room = await roomRepository.getById(roomId)

        if (!room)
            return validationErrorHandler('A sala informada não foi encontrada.', res)

        if (room.teacherId !== req.user.id)
            return validationErrorHandler('A sala informada pertence à outro usuário.', res)

        await roomRepository.removeStudent(roomId, studentId)
        res.json({ message: 'O aluno foi removido da sala com sucesso.' })
    }
}