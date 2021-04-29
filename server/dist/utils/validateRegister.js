"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateRegister = void 0;
const validateRegister = (options) => {
    let errors = [];
    if (!options.email.includes("@")) {
        errors.push({
            field: "email",
            message: "invalid email",
        });
    }
    if (options.username.includes("@")) {
        errors.push({
            field: "username",
            message: "cannot include @ sign",
        });
    }
    if (options.username.length <= 3) {
        errors.push({
            field: "username",
            message: "length must be greater than 3",
        });
    }
    if (options.password.length <= 3) {
        errors.push({
            field: "password",
            message: "length must be greater than 3",
        });
    }
    return errors.length === 0 ? null : errors;
};
exports.validateRegister = validateRegister;
//# sourceMappingURL=validateRegister.js.map