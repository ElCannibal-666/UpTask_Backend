const bcryptjs = require('bcryptjs')

export const hashPassword = async (password: string) =>{
    // Hasheo de password
    const salt = await bcryptjs.genSalt(10)
    return await bcryptjs.hash(password, salt)
}

export const checkPassword = async (enteredPassword: string, storedHash: string) => {
    return await bcryptjs.compare(enteredPassword, storedHash)
}