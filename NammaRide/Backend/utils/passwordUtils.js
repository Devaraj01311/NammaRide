const crypto = require('crypto');
const bcrypt = require('bcrypt');

function generateResetToken() {
    // Generate random reset token (for URL)
    const token = crypto.randomBytes(32).toString('hex');

    // Hash token for DB storage (for security)
    const hashed = crypto.createHash('sha256').update(token).digest('hex');

    return { token, hashed };
}

module.exports = { generateResetToken };
