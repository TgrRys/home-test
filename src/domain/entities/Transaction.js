/**
 * Transaction entity
 * 
 * This is a domain entity representing a transaction in the system.
 * It contains the core business logic and validation rules for transactions.
 */
class Transaction {
    constructor(data) {
        this.id = data.id;
        this.invoice_number = data.invoice_number;
        this.user_id = data.user_id;
        this.service_code = data.service_code;
        this.service_name = data.service_name;
        this.transaction_type = data.transaction_type;
        this.total_amount = data.total_amount;
        this.description = data.description;
        this.created_on = data.created_on;
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

        if (!this.transaction_type) {
            const error = new Error('Transaction type diperlukan');
            error.statusCode = 400;
            error.errorCode = 102;
            throw error;
        }

        if (!['TOPUP', 'PAYMENT'].includes(this.transaction_type)) {
            const error = new Error('Transaction type harus TOPUP atau PAYMENT');
            error.statusCode = 400;
            error.errorCode = 102;
            throw error;
        }

        if (!this.total_amount || this.total_amount <= 0) {
            const error = new Error('Paramter amount hanya boleh angka dan tidak boleh lebih kecil dari 0');
            error.statusCode = 400;
            error.errorCode = 102;
            throw error;
        }
    }

    static generateInvoiceNumber() {
        const now = new Date();
        const dateStr = now.toISOString().split('T')[0].replace(/-/g, '');
        const timeStr = now.getTime().toString().slice(-3);
        return `INV${dateStr}-${timeStr}`;
    }

    toJSON() {
        return {
            invoice_number: this.invoice_number,
            service_code: this.service_code,
            service_name: this.service_name,
            transaction_type: this.transaction_type,
            total_amount: this.total_amount,
            created_on: this.created_on
        };
    }

    toHistoryJSON() {
        return {
            invoice_number: this.invoice_number,
            transaction_type: this.transaction_type,
            description: this.description,
            total_amount: this.total_amount,
            created_on: this.created_on
        };
    }
}

module.exports = Transaction;
