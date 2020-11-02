const User = require("../../models/User")
const { validateRegisterInput } = require("../../utils/validators")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
const { SECRET_KEY } = require("../../config")
const { UserInputError } = require("apollo-server")

module.exports = {
    Mutation: {
        async register(_, { username, email, password, confirmPassword }, context, info) {
            //TODO validate user data 
            //TODO make sure user doesn't already exist 
            // Hash password and create auth token

            const { errors, valid } = validateRegisterInput(username, email, password, confirmPassword);

            if (!valid) {
              throw new UserInputError('Errors', { errors });
            }

            const user = await User.findOne({ username })
            if(user) {
                throw new UserInputError('Username is taken', {
                    errors: {
                        username: 'This username is already taken'
                    }
                })
            }
            password = await bcrypt.hash(password, 12)

            const newUser = new User({
                email, 
                username, 
                password, 
                createdAt: new Date().toISOString()
            })

            const res = await newUser.save()

            const token = jwt.sign({
                id: res.id, 
                email: res.email, 
                username: res.username
            }, SECRET_KEY, { expiresIn: "1h" })

            return {
                ...res._doc, 
                id: res._id, 
                token
            }
        }
    },
}