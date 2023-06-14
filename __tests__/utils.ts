import supertest from 'supertest'

import { App } from '../src/app'

import { userRepository, roomRepository } from '../src/repositories'
import { UserType } from '../src/models'

const app = new App(80)

export const httpClient = supertest(app.getExpressApp())

beforeAll(async () => {
    await app.synchronizeDatabase(true)

    await userRepository.createUser('alice1', '123456', UserType.Teacher, 1)
    await userRepository.createUser('carlos', '123456', UserType.Teacher, 2)
    await userRepository.createUser('bobb', '123456', UserType.Teacher, 1)

    await userRepository.createUser('aluno1', '123456', UserType.Student, 1)

    await roomRepository.createRoom(1, 'Alice Room 1')
    await roomRepository.createRoom(1, 'Alice Room 2')
    await roomRepository.createRoom(2, 'Carlos Room 1')
    await roomRepository.createRoom(1, 'Alice Room 3')
})