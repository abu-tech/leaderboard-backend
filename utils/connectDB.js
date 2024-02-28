const mysql = require('mysql2')

const connectDb = () => {
    //connect to mysql database
    const db = mysql.createConnection({
        host: 'localhost',
        user: 'root',
        password: '8801',
        database: 'backlight'
    })

    db.connect((err) => {
        if (err) throw err

        console.log('Connected to mysql database')
    })
}

module.exports = {
    connectDb
}