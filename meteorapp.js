if (Meteor.isClient) {
  Template.hello.greeting = function () {
    return "Welcome to meteorapp.";
  };

  Template.hello.events({
    'click input' : function () {
      // template data, if any, is available in 'this'
      if (typeof console !== 'undefined')
        console.log("You pressed the button");
    }
  });

    /*getGists = function getGists(user, callback) {
        console.log("call Gists");
        Meteor.call('getGists', user, callback);
    }*/
    getGists= Meteor.call('getGists');
    console.log("Gists"+getGists);

}

if (Meteor.isServer) {
  Meteor.startup(function () {
    // code to run on server at startup
  });

    Meteor.methods({
        'getGists': function getGists(user) {
            var GithubApi = Meteor.require('github');
            var github = new GithubApi({
                version: "3.0.0"
            });

            var gists = Async.runSync(function(done) {
                github.gists.getFromUser({user: 'arunoda'}, function(err, data) {
                    done(null, data);
                });
            });

            //rob
            console.log("TESTING");
            return gists.result;
        }
    });
    console.log("Server2");

    var pubnub = Meteor.require("pubnub").init({
        publish_key   : "demo",
        subscribe_key : "demo"
    });

    var pb = Meteor.require("pubnub").init({
        publish_key   : "demo",
        subscribe_key : "demo"
    });

   console.log(pb.uuid());
    console.log(pb.unique());
    console.log('time pb'+pb.time(function(time){console.log('Pubnub2 ',time)}));
     /* ---------------------------------------------------------------------------
     Listen for Messages
     --------------------------------------------------------------------------- */
    /*var pub = Meteor.sync(function(done) {
        pubnub.subscribe({
            channel  : "my_channel11",
            callback : function(message) {
                console.log( " > ", message );
            }
        });
    });*/

    pubnub.here_now({
        channel : 'my_channel11',
        callback : function(m){console.log('Here Now: ',m)}
    });

    pubnub.time(
        function(time){console.log('Pubnub ',time)}
    );
    pubnub.subscribe({
        channel  : "my_channel11",
        windowing : 10000,
        connect:function () {
            console.log("Connect");
        },
        callback : function(message) {
            console.log( " > ", message );
        }
    });
    /* ---------------------------------------------------------------------------
     Type Console Message
     --------------------------------------------------------------------------- */
    var stdin = process.openStdin();
    stdin.on( 'data', function(chunk) {
        pubnub.publish({
            channel : "my_channel11",
            message : ''+chunk
        });
    });

    pubnub.publish({
        channel : "my_channel11",
        message : 'rob'    });

    //creating a global server logger
    logger = Meteor.require('winston');
    logger.info('user connected');


}
