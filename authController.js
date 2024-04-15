const Visitor = require('./models/Visitor')
const Role = require('./models/Role')
const bcrypt = require('bcryptjs')
const { validationResult } = require('express-validator')
const jwt = require('jsonwebtoken')
const { secret } = require('./config')

const generateToken = (id, role) => {
    const payload = {
        id,
        role
    }
    return jwt.sign(payload, secret, { expiresIn: "24h" })
}

class authController {
    async register(req, res) {
        try {
            const errors = validationResult(req)
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() })
            }
            const { name, password } = req.body
            const candidate = await Visitor.findOne({ name })
            if (candidate) {
                return res.status(400).json({ message: 'Такой пользователь уже существует' })
            }

            const hashPassword = bcrypt.hashSync(password, 5)
            const visitRole = await Role.findOne({ value: 'USER' })
            const visit = await new Visitor({ name, password: hashPassword, roles: [visitRole.value] })
            await visit.save()
            res.json(visit)
        } catch (error) {
            console.log(error)
            res.status(500).json(error)
        }
    }

    async login(req, res) {
        try {
            const { name, password } = req.body
            const user = await Visitor.findOne({ name })
            if (!user) {
                return res.status(400).json({ message: 'Пользователь не найден' })
            }
            const validPass = bcrypt.compareSync(password, user.password)
            if (!validPass) {
                return res.status(400).json({ message: 'Введен неверный пароль' })
            }
            const token = generateToken(user._id, user.roles)
            return res.json(token)
        } catch (error) {
            console.log(error)
            res.status(500).json(error)
        }
    }

    async getUsers(req, res) {
        try {
            const users =await  Visitor.find() 
            res.json(users)
        } catch (error) {
            console.log(error)
            res.status(500).json(error)
        }
    }
}

module.exports = new authController()
