import { DataTypes, ModelOptions, ModelAttributes, Model, ModelStatic } from 'sequelize'
import { User, UserType } from '../models'

export const createUserModelOptions = (): ModelOptions => ({
    tableName: 'user',
    timestamps: false,
    createdAt: false,
    updatedAt: false
})

export const createUserModelAttributes = (): ModelAttributes<Model<any, any>, User> => ({
    id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
    },
    username: {
        type: DataTypes.STRING(20),
        allowNull: false,
        validate: {
            notNull: { msg: 'O campo nome é obrigatório.' },
            notEmpty: { msg: 'O campo nome é obrigatório.' },
            len: { args: [4, 20], msg: 'O campo nome deve ter entre 4 e 20 caracteres.' },
            is: {
                msg: 'O campo nome possui caracteres inválidos.',
                args: /^[0-9a-z]*$/i
            },
        }
    },
    password: {
        type: DataTypes.STRING(20),
        allowNull: false,
        validate: {
            notNull: { msg: 'O campo senha é obrigatório.' },
            notEmpty: { msg: 'O campo senha é obrigatório.' },
            len: { args: [6, 20], msg: 'O campo senha deve ter entre 6 e 20 caracteres.' },
            is: {
                msg: 'O campo senha possui caracteres inválidos.',
                args: /^[0-9a-z]*$/i
            },
        }
    },
    type: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
            notNull: { msg: 'O campo tipo é obrigatório.' },
            notEmpty: { msg: 'O campo tipo é obrigatório.' },
            isIn: { args: [[1, 2]], msg: 'O tipo informado é inválido.' }
        }
    },
    avatar: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
            notNull: { msg: 'O campo avatar é obrigatório.' },
            notEmpty: { msg: 'O campo avatar é obrigatório.' },
            min: { args: [1], msg: 'O avatar informado é inválido.' }
        }
    }
})

export class UserRepository {

    userModel: ModelStatic<Model<User, any>>

    constructor(userModel: ModelStatic<Model<User, any>>) {
        this.userModel = userModel
    }

    async getAll() {
        const users: User[] = []
        for (const user of await this.userModel.findAll())
            users.push(user.toJSON())
        return users
    }

    async findUserByUsername(username: string) {
        const user = await this.userModel.findOne({ where: { username } })
        return user?.toJSON()
    }

    async findUserById(id: number) {
        const user = await this.userModel.findOne({ where: { id } })
        return user?.toJSON()
    }

    createUser(username: string, password: string, type: UserType, avatar: number) {
        return this.userModel.create({ username, password, type, avatar })
    }

}