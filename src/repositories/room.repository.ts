import { DataTypes, ModelOptions, ModelAttributes, Model, ModelStatic } from 'sequelize'
import { Room, RoomStudent, RoomWord } from '../models'

export const createRoomModelOptions = (): ModelOptions => ({ tableName: 'room', timestamps: false, createdAt: false, updatedAt: false })

export const createRoomWordModelOptions = (): ModelOptions => ({ tableName: 'room_word', timestamps: false, createdAt: false, updatedAt: false })

export const createRoomStudentModelOptions = (): ModelOptions => ({ tableName: 'room_student', timestamps: false, createdAt: false, updatedAt: false })

export const createRoomModelAttributes = (): ModelAttributes<Model<any, any>, Room> => ({
    id: { type: DataTypes.INTEGER, allowNull: false, primaryKey: true, autoIncrement: true },
    teacherId: { type: DataTypes.INTEGER, allowNull: false, validate: { notNull: { msg: 'O campo professor é obrigatório.' }, } },
    description: { type: DataTypes.STRING(100), allowNull: false, validate: { notNull: { msg: 'O campo descrição é obrigatório.' }, notEmpty: { msg: 'O campo descrição é obrigatório.' } } },
    status: { type: DataTypes.STRING(20), allowNull: false, validate: { isIn: { args: [['CLOSED', 'OPEN']], msg: 'O status informado é inválido.' }, notNull: { msg: 'O campo status é obrigatório.' }, } }
})

export const createRoomWordModelAttributes = (): ModelAttributes<Model<any, any>, RoomWord> => ({
    roomId: { type: DataTypes.INTEGER, allowNull: false, validate: { notNull: { msg: 'O campo sala é obrigatório.' }, } },
    word: { type: DataTypes.STRING(50), allowNull: false, validate: { notNull: { msg: 'A palavra é obrigatória.' }, notEmpty: { msg: 'A palavra é obrigatória.' } } }
})

export const createRoomStudentModelAttributes = (): ModelAttributes<Model<any, any>, RoomStudent> => ({
    roomId: { type: DataTypes.INTEGER, allowNull: false, validate: { notNull: { msg: 'O campo sala é obrigatório.' }, } },
    studentId: { type: DataTypes.STRING(50), allowNull: false, validate: { notNull: { msg: 'O campo aluno é obrigatório.' }, } }
})

export class RoomRepository {

    roomModel: ModelStatic<Model<Room, any>>

    roomWordModel: ModelStatic<Model<RoomWord, any>>

    roomStudentModel: ModelStatic<Model<RoomStudent, any>>

    constructor(roomModel: ModelStatic<Model<Room, any>>,
        roomWordModel: ModelStatic<Model<RoomWord, any>>,
        roomStudentModel: ModelStatic<Model<RoomStudent, any>>) {
        this.roomModel = roomModel
        this.roomWordModel = roomWordModel
        this.roomStudentModel = roomStudentModel
    }

    async getAllByTeacher(teacherId: number) {
        const list: Room[] = []
        for (const item of await this.roomModel.findAll({ where: { teacherId } }))
            list.push(item.toJSON())
        return list
    }

    async getById(id: number) {
        const result = await this.roomModel.findOne({ where: { id } })
        return result?.toJSON()
    }

    createRoom(teacherId: number, description: string) {
        return this.roomModel.create({ teacherId, description, status: 'CLOSED' })
    }

    updateStatus(roomId: number, status: string) {
        return this.roomModel.update({ status }, { where: { id: roomId } })
    }

    remove(roomId: number) {
        return this.roomModel.destroy({ where: { id: roomId } })
    }

    addWord(roomId: number, word: string) {
        return this.roomWordModel.create({ roomId, word })
    }

    removeWord(roomId: number, word: string) {
        return this.roomWordModel.destroy({ where: { roomId, word } })
    }

    addStudent(roomId: number, studentId: number) {
        return this.roomStudentModel.create({ roomId, studentId })
    }

    removeStudent(roomId: number, studentId: number) {
        return this.roomStudentModel.destroy({ where: { roomId, studentId } })
    }

}