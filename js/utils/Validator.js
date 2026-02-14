class Validator {
    static isValidTimeInput(value) {
        return /^[1-9]\d*$/.test(value);
    }

    static sanitizeTimeInput(value) {
        if (!this.isValidTimeInput(value)) {
            throw new Error("TYPE INVALID: ENTER NUMBERS ONLY");
        }
        return parseInt(value, 10);
    }
}
