"use strict";

var Influx = require('influx')
var winston = require('winston');
var ds18b20 = require('./ds18b20-hp');

var recordInterval = process.env.TEMP_RECORD_INTERVAL || 300;
var deviceName = process.env.RESIN_DEVICE_UUID || 'pi';
var deviceLocation = process.env.DEVICE_LOCATION || 'living_room';
var influxDBHost = process.env.INFLUXDB_HOST || '192.168.1.11';
var influxDBName = process.env.INFLUXDB_HOST || 'tado';

winston.configure({
	transports: [
		new(winston.transports.Console)({
			colorize: true
		})
	]
});

winston.log('info', 'Reading temperature from DS1820');

var influx = new Influx.InfluxDB({
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
	var currentTemp = ds18b20.temperatureSync('10-000802b59799');

	winston.log('info', 'Current temperature is:' +currentTemp);

	influx.writePoints([{
		measurement: 'temperature',
		tags: {
			location: deviceLocation,
			device: deviceName
		},
		fields: {
			reading: currentTemp
		}
	}]).catch(function(err) {
		winston.log('error', 'Error saving data to InfluxDB!' + err.stack)
	});
};

setInterval(function() {
	recordTemperature();
}, recordInterval * 1000);
