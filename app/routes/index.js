const authRoutes = require('./authentication_routes');
module.exports = function(app, db) {
  authRoutes(app, db);
  // Other route groups could go here, in the future
};