import bcrypt from 'bcrypt'

export async function passwordHash(password) {
    const salt = await bcrypt.genSalt(10)
    let hashed_password = null
    hashed_password = await bcrypt.hash(password, salt)
    return hashed_password
}

export async function verifyPassword(data) {

    const password          = data.password
    const hashedPassword    = data.hashedPassword

    return bcrypt.compare(password, hashedPassword)
}
