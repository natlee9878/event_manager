const mysql = require('mysql')
const config = require('./databaseConfig');

async function query(sql) {
  	const connection = mysql.createConnection(config.params);
  	let query = new Promise(function(resolve, reject) {
  		connection.query(sql, (err, rows, fields) => {
		  	if (err) {
		  		console.log('DATABASE ERROR',err);
		  		resolve(null);
		  	}
		  	else
		  		resolve(rows);
		});
	});
	let results = await query; 
	return results;
}

module.exports = {query}