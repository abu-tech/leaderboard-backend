const express = require('express')

const router = express.Router()

router
    .route('/leaderboard/current-week')
    .get()

router
    .route('/leaderboard/last-week/:country')
    .get()

router
    .route('/user-rank/:userId')
    .get()


module.exports = router