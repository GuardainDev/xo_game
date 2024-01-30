require('dotenv').config({ path: '../.env' });


module.exports = {
	// DB_ENDPOINT: 'mongodb://localhost:27017',
	DB_ENDPOINT: process.env.DB_URL || 'mongodb://localhost:27017',
	DB_NAME: process.env.DB_NAME,
	POINTS: {
		WINNER: 2,
		DRAW: 1
	}

}