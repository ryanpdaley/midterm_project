$(document).ready(function () {
  gapi.load('auth2', function () {

    const GoogleAuth = gapi.auth2.init();

    $("#sign_in").on("click", function () {
      GoogleAuth.then((res) => {
        GoogleAuth.signIn().then((res)=>{
          const id_token = GoogleAuth.currentUser.get().getAuthResponse().id_token;
          
        }, (err)=>{
          console.log(err);
        })
      }, (err) => {
        console.error(err);
      });
    });

    $("#sign_out").on("click", function () {
      if (GoogleAuth.isSignedIn.get()) {
        GoogleAuth.signOut().then(function () {
          console.log('User signed out.');
        });
      }
    });


  });


});