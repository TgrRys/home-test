/**
 * Balance entity
 * 
 * This is a domain entity representing user balance in the system.
 * It contains the core business logic and validation rules for balance management.
 */
class Balance {
    constructor(data) {
        this.user_id = data.user_id;
        this.balance = data.balance || 0;
        this.updated_at = data.updated_at;

        this.validate();
    }

    validate() {
        if (!this.user_id) {
            const error = new Error('User ID diperlukan');
            error.statusCode = 400;
            error.errorCode = 102;
            throw error;
        }

        if (this.balance < 0) {
            const error = new Error('Balance tidak boleh negatif');
            error.statusCode = 400;
            error.errorCode = 102;
            throw error;
        }
    }

    addBalance(amount) {
        if (amount <= 0) {
            const error = new Error('Paramter amount hanya boleh angka dan tidak boleh lebih kecil dari 0');
            error.statusCode = 400;
            error.errorCode = 102;
            throw error;
        }
        this.balance += amount;
    }

    deductBalance(amount) {
        if (amount <= 0) {
            const error = new Error('Paramter amount hanya boleh angka dan tidak boleh lebih kecil dari 0');
            error.statusCode = 400;
            error.errorCode = 102;
            throw error;
        }

        if (this.balance < amount) {
            const error = new Error('Balance tidak mencukupi');
            error.statusCode = 400;
            error.errorCode = 102;
            throw error;
        }

        this.balance -= amount;
    }

    toJSON() {
        return {
            balance: this.balance
        };
    }
}

module.exports = Balance;
