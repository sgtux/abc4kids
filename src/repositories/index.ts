import { Sequelize } from 'sequelize'

import {
    UserRepository,
    createUserModelAttributes,
    createUserModelOptions
} from './user.repository'

import {
    RoomRepository,
    createRoomModelAttributes,
    createRoomModelOptions,
    createRoomStudentModelAttributes,
    createRoomStudentModelOptions,
    createRoomWordModelAttributes,
    createRoomWordModelOptions
} from './room.repository'

const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: './db.sqlite',
    logging: false
})

const userModel = sequelize.define('User', createUserModelAttributes(), createUserModelOptions())
const roomModel = sequelize.define('Room', createRoomModelAttributes(), createRoomModelOptions())
const roomWordModel = sequelize.define('RoomWord', createRoomWordModelAttributes(), createRoomWordModelOptions())
const roomStudentModel = sequelize.define('RoomStudent', createRoomStudentModelAttributes(), createRoomStudentModelOptions())

let updateDatabase = true

export const synchronizeDatabase = async (force = false) => {
    if (updateDatabase)
        await sequelize.sync({ force: force })
    updateDatabase = false
}

export const userRepository = new UserRepository(userModel)
export const roomRepository = new RoomRepository(roomModel, roomWordModel, roomStudentModel)