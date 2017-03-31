$(document).ready(function () {
  gapi.load('auth2', function () {

    const GoogleAuth = gapi.auth2.init();

    $("#sign_in").on("click", function (event) {
      event.preventDefault();
      GoogleAuth.then(() => {
        GoogleAuth.signIn().then(()=>{
          const id_token = GoogleAuth.currentUser.get().getAuthResponse().id_token;

          
          //Hide Sign In Button

          /*add code here*/


          $("input[name = 'id_token']").val(id_token);
          $(this).parent("form").submit();
        }, (err)=>{
          console.log(err);
        })
      }, (err)=>{
        console.log(err);
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