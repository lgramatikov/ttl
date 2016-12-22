"use strict";

const Influx = require('influx')
const winston = require('winston');
const ds18b20 = require('./ds18b20-hp');

winston.configure({
    transports: [
        new (winston.transports.Console)({ colorize: true })
    ]
});

winston.log('info', 'Reading temperature from DS1820');

const influx = new Influx.InfluxDB({
  host: '192.168.1.11',
  database: 'tado',
  schema: [
    {
      measurement: 'temperature',
      fields: {
        reading: Influx.FieldType.FLOAT
      },
      tags: [
        'location'
      ]
    }
  ]
});

var currentTemp = ds18b20.temperatureSync('10-000802b59799');

winston.log('info',`Current temperature is: ${currentTemp}`);

influx.writePoints([
    {
        measurement: 'temperature',
        tags: { 
            location: 'living_room'
        },
        fields: {
            reading: currentTemp
        }
    }
    ]).catch(err => {
      winston.log('error',`Error saving data to InfluxDB! ${err.stack}`)
    });