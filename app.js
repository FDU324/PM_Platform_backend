/**
 * app.js
 *
 * Use `app.js` to run your app without `sails lift`.
 * To start the server, run: `node app.js`.
 *
 * This is handy in situations where the sails CLI is not relevant or useful.
 *
 * For example:
 *   => `node app.js`
 *   => `forever start app.js`
 *   => `node debug app.js`
 *   => `modulus deploy`
 *   => `heroku scale`
 *
 *
 * The same command-line arguments are supported, e.g.:
 * `node app.js --silent --port=80 --prod`
 */


// Ensure we're in the project directory, so cwd-relative paths work as expected
// no matter where we actually lift from.
// > Note: This is not required in order to lift, but it is a convenient default.
process.chdir(__dirname);

// Attempt to import `sails`.
var sails;
try {
  sails = require('sails');
} catch (e) {
  console.error('To run an app using `node app.js`, you usually need to have a version of `sails` installed in the same directory as your app.');
  console.error('To do that, run `npm install sails`');
  console.error('');
  console.error('Alternatively, if you have sails installed globally (i.e. you did `npm install -g sails`), you can use `sails lift`.');
  console.error('When you run `sails lift`, your app will still use a local `./node_modules/sails` dependency if it exists,');
  console.error('but if it doesn\'t, the app will run with the global sails instead!');
  return;
}

// --•
// Try to get `rc` dependency (for loading `.sailsrc` files).
var rc;
try {
  rc = require('rc');
} catch (e0) {
  try {
    rc = require('sails/node_modules/rc');
  } catch (e1) {
    console.error('Could not find dependency: `rc`.');
    console.error('Your `.sailsrc` file(s) will be ignored.');
    console.error('To resolve this, run:');
    console.error('npm install rc --save');
    rc = function () { return {}; };
  }
}

// Start server
sails.lift(rc('sails'));

var io = require('socket.io').listen(8081);


// usernames which are currently connected to the chat
var usernames = {};

io.sockets.on('connection', function (socket) {

  socket.on('test',function(data) {
    console.log(data);
  });
  socket.on('login',function(data) {
    console.log(data.username);
    //console.log(sails.models.friend);
/*            sails.models.friend.find({
                  friendUsername:'billy191',
                  read:0
              }).exec(function (error_receiveMsg,reqMsg) {
                console.log(error_receiveMsg);
                  if (error_receiveMsg==null) {
                    reqMsg.forEach(function(o) {
                        var request = {
                          Username : o.myUsername
                        }
                        PlayFabClientAPI.GetAccountInfo(
                          request,
                          OnGetAccountResult
                        );
                        function OnGetAccountResult(error,result) {
                          console.log(result.data.AccountInfo);
                          if (error==null) {
                              var user = {
                                username: result.data.AccountInfo.Username,
                                email: result.data.AccountInfo.PrivateInfo.Email,
                                nickname: result.data.AccountInfo.DisplayName
                              };
                              console.log(user);
                              sails.sockets.broadcast('acceptFriendReq',JSON.stringify(user));
                          }
                        }
                    });
      
                  }
              });
*/    
  
  });

  // when the user disconnects.. perform this
  socket.on('disconnect', function(){
    // remove the username from global usernames list
    delete usernames[socket.username];
    // update list of users in chat, client-side
    io.sockets.emit('updateusers', usernames);
    // echo globally that this client has left
    socket.broadcast.emit('updatechat', 'SERVER', socket.username + ' has disconnected');
  });
});
