const CONFIG = require('../common/inc.config');
const { MongoClient } = require('mongodb');

class dbconn {
    constructor() {
        this.mongo_client = MongoClient;
        this.client = null; // Initialize the client as null initially
        //this.connect();
    }

    async connect() {
        console.log("Db data:::", CONFIG.DB_ENDPOINT)
        if (!this.client) {
            try {
                this.client = await this.mongo_client.connect(CONFIG.DB_ENDPOINT, {
                    // useNewUrlParser: true,
                    // useUnifiedTopology: true,
                    maxPoolSize: 4
                });
                this.db = this.client.db(CONFIG.DB_NAME);
                //console.log('Connected to MongoDB successfully!');
            } catch (err) {
                console.error('Error connecting to MongoDB:', err);
                throw err; // Rethrow the error to handle it outside the class
            }
        } else {
            console.log('Already connected to MongoDB.');
        }
    }

    async dbclose() {
        try {
            if (this.client) {
                await this.client.close();
                this.client = null; // Reset the client to null after closing the connection
                //console.log('Connection closed successfully!');
            } else {
                console.log('No active connection to close.');
            }
        } catch (err) {
            console.error('Error closing MongoDB connection:', err);
        }
    }
}

module.exports = dbconn;

// const CONFIG = require('../common/inc.config');
// module.exports = class dbconn {
//     constructor() {
//         this.mongo_client = require('mongodb').MongoClient;
//         this.client = new this.mongo_client(CONFIG.DB_ENDPOINT, { useNewUrlParser: true, useUnifiedTopology: true });
//         this.connection = this.client.connect();
//         this.db = this.client.db(CONFIG.DB_NAME);
//         this.cgdb = this.client.db(CONFIG.CGDB_NAME);
//         this.mrdb = this.client.db(CONFIG.MRDB_NAME);
//         //this.dbName = 'mr_racer';
//     }

//     async dbclose() {
//         //this.client.close();
//         //await (await this.connection).close();
//         //(await this.connection).close();
//         //await this.connection.close();
//         try {
//             await this.client.close();
//             console.log('MongoDB connection closed.');
//         } catch (err) {
//             console.error('Error closing MongoDB connection:', err);
//         }
//     }
// }