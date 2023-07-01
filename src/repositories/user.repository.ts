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
            is: {
                msg: 'O nome informado possui caracteres inválidos, os caracteres permitidos são apenas letras números e os caracteres especiais (_@#&)',
                args: /[a-zA-Z0-9_@#&]*$/i
            },
            customLen(value: string) {
                if (value && (value.length < 4 || value.length > 20))
                    throw Error('O campo nome deve ter entre 4 e 20 caracteres.')
            }
        }
    },
    password: {
        type: DataTypes.STRING(20),
        allowNull: false,
        validate: {
            notNull: { msg: 'O campo senha é obrigatório.' },
            notEmpty: { msg: 'O campo senha é obrigatório.' },
            is: {
                msg: 'O campo senha possui caracteres inválidos.',
                args: /^[0-9a-z]*$/i
            },
            customLen(value: string) {
                if (value && (value.length < 6 || value.length > 20))
                    throw Error('O campo senha deve ter entre 6 e 20 caracteres.')
            }
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