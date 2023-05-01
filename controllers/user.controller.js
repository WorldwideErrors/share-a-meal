const database = require('../util/inmem-db');
const logger = require('../util/utils').logger;
const assert = require('assert');
const pool = require('../util/mysql-db');

const userController = {
    getAllUsers: (req, res, next) => {
      logger.info('Get all users');
  
      let sqlStatement = 'SELECT * FROM `user`';
      // Hier wil je misschien iets doen met mogelijke filterwaarden waarop je zoekt.
      if (req.query.isactive) {
        // voeg de benodigde SQL code toe aan het sql statement
        // bv sqlStatement += " WHERE `isActive=?`"
      }
  
      pool.getConnection(function (err, conn) {
        // Do something with the connection
        if (err) {
          console.log('error', err);
          next('error: ' + err.message);
        }
        if (conn) {
          conn.query(sqlStatement, function (err, results, fields) {
            if (err) {
              logger.err(err.message);
              next({
                code: 409,
                message: err.message
              });
            }
            if (results) {
              logger.info('Found', results.length, 'results');
              res.status(200).json({
                statusCode: 200,
                message: 'User getAll endpoint',
                data: results
              });
            }
          });
          pool.releaseConnection(conn);
        }
      });
    },

    getOneUser: (req, res, next) => {
        logger.info('Get specific user');
        const userId = req.params.userId;

        let sqlStatement = 'SELECT * FROM `user` WHERE id=' + userId;
    
        pool.getConnection(function (err, conn) {
          // Do something with the connection
          if (err) {
            console.log('error', err);
            next('error: ' + err.message);
          }
          if (conn) {
            conn.query(sqlStatement, function (err, results, fields) {
              if (err) {
                logger.err(err.message);
                next({
                  code: 409,
                  message: err.message
                });
              }
              if (results) {
                logger.info('Found', results.length, 'results');
                res.status(200).json({
                  statusCode: 200,
                  message: 'User getOne endpoint',
                  data: results
                });
              }
            });
            pool.releaseConnection(conn);
          }
        });
      },
  
    createUser: (req, res) => {
      logger.info('Register user');
  
      // De usergegevens zijn meegestuurd in de request body.
      // In de komende lessen gaan we testen of dat werkelijk zo is.
      const user = req.body;
      logger.debug('user = ', user);
  
      // Hier zie je hoe je binnenkomende user info kunt valideren.
      try {
        // assert(user === {}, 'Userinfo is missing');
        assert(typeof user.firstName === 'string', 'firstName must be a string');
        assert(
          typeof user.emailAdress === 'string',
          'emailAddress must be a string'
        );
      } catch (err) {
        logger.warn(err.message.toString());
        // Als één van de asserts failt sturen we een error response.
        res.status(400).json({
          status: 400,
          message: err.message.toString(),
          data: {}
        });
        // Nodejs is asynchroon. We willen niet dat de applicatie verder gaat
        // wanneer er al een response is teruggestuurd.
        return;
      }
  
      // Zorg dat de id van de nieuwe user toegevoegd wordt
      // en hoog deze op voor de volgende insert.
      user.id = database.index++;
      // User toevoegen aan database
      database['users'].push(user);
      logger.info('New user added to database');
  
      // Stuur het response terug
      res.status(200).json({
        status: 200,
        message: `User met id ${user.id} is toegevoegd`,
        // Wat je hier retourneert is een keuze; misschien wordt daar in het
        // ontwerpdocument iets over gezegd.
        data: user
      });
    },
  
    // Function to update the user to inactive instead of active.
    inactivateUser: (req, res) => {
      logger.info("Inactivate user");

      const userId = req.params.userId;

        let sqlStatement = 'UPDATE `user` SET `isActive` = 0  WHERE id=' + userId;
        
        pool.getConnection(function (err, conn) {
          // Do something with the connection
          if (err) {
            console.log('error', err);
            next('error: ' + err.message);
          }
          if (conn) {
            conn.query(sqlStatement, function (err, results, fields) {
              if (err) {
                logger.err(err.message);
                next({
                  code: 409,
                  message: err.message
                });
              }
              if (results) {
                logger.info('Found', results.length, 'results');
                res.status(200).json({
                  statusCode: 200,
                  message: 'User met id: ' + userId + ' is op inactief gezet' ,
                  data: results
                });
              }
            });
            pool.releaseConnection(conn);
          }
        });
    },

    // Function to delete the user from the database
    deleteUser: (req, res) => {
      logger.info("Delete user");

      const userId = req.params.userId;

        let sqlStatement = 'DELETE FROM `user` WHERE id=' + userId;
        
        pool.getConnection(function (err, conn) {
          // Do something with the connection
          if (err) {
            console.log('error', err);
            next('error: ' + err.message);
          }
          if (conn) {
            conn.query(sqlStatement, function (err, results, fields) {
              if (err) {
                logger.err(err.message);
                next({
                  code: 409,
                  message: err.message
                });
              }
              if (results) {
                logger.info('Found', results.length, 'results');
                res.status(200).json({
                  statusCode: 200,
                  message: 'User met id: ' + userId + ' verwijderd' ,
                  data: results
                });
              }
            });
            pool.releaseConnection(conn);
          }
        });
      }
  };
  
  module.exports = userController;