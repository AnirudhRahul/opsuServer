module.exports = function(app) {
  var userController = require('../controllers/userController.js');
  var beatmapController = require('../controllers/beatmapController.js');

  // login route
  app.route('/users/:email/:password')
    .get(userController.get_user);

  // sign up route
  app.route('/users/:email/:password/:username')
    .put(userController.add_user);

  // forgot password route
  app.route('/users/:secretKey')
    .put(userController.add_user);

  // retrieve leaderboard route
  app.route('/beatmaps/:beatmapId/:name?')
    .get(beatmapController.get_leaderboard);

  // post leaderboard route
  app.route('/beatmaps/:beatmapData)
    .put(beatmapController.update_a_task);

};
