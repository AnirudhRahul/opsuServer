module.exports = function(app) {
  var userController = require('../controllers/userController.js');
  var beatmapController = require('../controllers/beatmapController.js');

  app.route('/users/')
    // login route
    .get(userController.get_user)
    // sign up route
    .put(userController.add_user);

  // app.route('/recover/:secretKey')
  //   // forgot password route
  //   .put(userController.add_user);
  //
  // // retrieve leaderboard route
  // app.route('/beatmaps/:beatmapId/:name?')
  //   // get Beatmap scores
  //   .get(beatmapController.get_leaderboard)
  //   // post beatmap score
  //   .put(beatmapController.update_a_task);

};
