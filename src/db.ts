import { Sequelize, DataTypes } from 'sequelize'

const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: './db.sqlite'
})

const User = sequelize.define('User', {
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
            len: { args: [4, 20], msg: 'O campo nome deve ter entre 4 e 20 caracteres.' },
            is: {
                msg: 'O campo nome possui caracteres inválidos.',
                args: /^[0-9a-z]*$/i
            },
            notNull: { msg: 'O campo nome é obrigatório.' },
        }
    },
    password: {
        type: DataTypes.STRING(20),
        allowNull: false,
        validate: {
            len: { args: [6, 20], msg: 'O campo senha deve ter entre 6 e 20 caracteres.' },
            is: {
                msg: 'O campo senha possui caracteres inválidos.',
                args: /^[0-9a-z]*$/i
            },
            notNull: { msg: 'O campo senha é obrigatório.' },
        }
    },
    teacher: {
        type: DataTypes.BOOLEAN
    }
}, {
    tableName: 'user',
    timestamps: false,
    createdAt: false,
    updatedAt: false
})

export const findUserByUsername = (username: string) => {
    return User.findOne({ where: { username } })
}

export const createUser = (username: string, password: string, teacher: boolean) => {
    return User.create({ username, password, teacher })
}

export const updateDb = () => sequelize.sync()