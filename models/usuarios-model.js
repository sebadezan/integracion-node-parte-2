var pool = require('./bd');
var md5 = require('md5');

async function getUserAndPassword(user, password) {
    try {
        var query = 'SELECT * FROM usuarios WHERE usuario = ? AND password = ? LIMIT 1';
        var rows = await pool.query(query, [user, md5(password)]);

        if (rows.length > 0) {
            return rows[0];
        } else {
            return null;
        }

    } catch (error) {
        console.log('Error en getUserAndPassword:', error);
        return null;
    }
}

module.exports = { getUserAndPassword };
