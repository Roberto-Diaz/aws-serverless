'use strict';
const queryString = require('queryString');

module.exports.hello = async (event) => {
  return {
    statusCode: 200,
    body: JSON.stringify(
      {
        message: `Hola ${event.pathParameters.name}`,
        input: event.name,
      },
      null,
      2
    ),
  };
};

module.exports.showUser = async (event) => {
  const body = queryString.parse(event['body']);
  return {
    statusCode: 200,
    body: JSON.stringify(
      {
        message: `funcion post`,
        input: `Hola ${body.name} ${body.lastname}`,
      },
      null,
      2
    ),
  };
};

