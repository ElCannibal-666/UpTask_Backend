"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkPassword = exports.hashPassword = void 0;
const bcryptjs = require('bcryptjs');
const hashPassword = async (password) => {
    // Hasheo de password
    const salt = await bcryptjs.genSalt(10);
    return await bcryptjs.hash(password, salt);
};
exports.hashPassword = hashPassword;
const checkPassword = async (enteredPassword, storedHash) => {
    return await bcryptjs.compare(enteredPassword, storedHash);
};
exports.checkPassword = checkPassword;
//# sourceMappingURL=auth.js.map