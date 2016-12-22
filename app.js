"use strict";

const Influx = require('influx')
const winston = require('winston');
const ds18b20 = require('./ds18b20-hp');

const recordInterval = process.env.TEMP_RECORD_INTERVAL || 300;
const deviceName = process.env.RESIN_DEVICE_UUID || 'pi';
const deviceLocation = process.env.DEVICE_LOCATION || 'living_room';
const influxDBHost = process.env.INFLUXDB_HOST || '192.168.1.11';
const influxDBName = process.env.INFLUXDB_HOST || 'tado';

winston.configure({
	transports: [
		new(winston.transports.Console)({
			colorize: true
		})
	]
});

winston.log('info', 'Reading temperature from DS1820');

const influx = new Influx.InfluxDB({
	host: influxDBHost,
	database: influxDBName,
	schema: [{
		measurement: 'temperature',
		fields: {
			reading: Influx.FieldType.FLOAT
		},
		tags: [
			'location',
			'device'
		]
	}]
});

function recordTemperature() {
	let currentTemp = ds18b20.temperatureSync('10-000802b59799');

	winston.log('info', `Current temperature is: ${currentTemp}`);

	influx.writePoints([{
		measurement: 'temperature',
		tags: {
			location: deviceLocation,
			device: deviceName
		},
		fields: {
			reading: currentTemp
		}
	}]).catch(err => {
		winston.log('error', `Error saving data to InfluxDB! ${err.stack}`)
	});
};

setInterval(() => {
	recordTemperature();
}, recordInterval * 1000);
