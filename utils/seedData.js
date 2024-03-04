const { faker } = require('@faker-js/faker');
const mysql = require('mysql2');
const moment = require('moment')

//create connection
const db = mysql.createConnection({
    host: 'bvzzumngzym9bu3paqxv-mysql.services.clever-cloud.com',
    user: 'uhr22tbb9p5ffmio',
    password: '8EUbrpvv9PnLtibL50rm',
    database: 'bvzzumngzym9bu3paqxv'
})

db.connect((err) => {
    if (err) throw err

    console.log('Connected to mysql database')
})

for (let i = 0; i < 10000; i++) {
    const name = faker.person.firstName()
    const score = Math.floor(Math.random() * 1000)
    const country = faker.location.countryCode('alpha-2')
    const timestamp = moment(faker.date.between({ from: '2024-03-3T00:00:00.000Z', to: '2024-03-6T00:00:00.000Z' })).format('YYYY-MM-DD HH:mm:ss');
    const UID = faker.string.uuid()

    const query = `INSERT INTO game_score (UID, Name, Score, Country, TimeStamp)
        VALUES ('${UID}', '${name}', ${score}, '${country}', '${timestamp}');
    `;

    db.query(query, (error, results, fields) => {
        if (error) throw error;
    });
}



//end connection after inserting dummy data
db.end((err) => {
    if (err) throw err

    console.log('Disconnected to mysql database')
}
);