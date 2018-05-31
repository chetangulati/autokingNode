$("#lhead").click(function () {
  $("#lhead").addClass("activelogin");
  $("#signup").removeClass("as");
  $("#login").addClass("al");
  $("#shead").removeClass("activesignup");
});

$("#shead").click(function (){
  $("#lhead").removeClass("activelogin");
  $("#signup").addClass("as");
  $("#login").removeClass("al");
  $("#shead").addClass("activesignup");
});

// error
$(document).ready(function () {
  setTimeout(function () {
    $("#err").slideUp();
  }, 3000);
});

//
// $(".userForm").submit(function (e) {
//   e.preventDefault();
//   $.ajax({
//     url: "/register",
//     type: "post",
//     contentType: "application/json; charset=UTF-8",
//     dataType: "json",
//     data: JSON.stringify({
//       name: $('.userForm input[name=name]').val(),
//       contact: $('.userForm input[name=contact]').val(),
//       email: $('.userForm input[name=email]').val(),
//       password: $('.userForm input[name=password]').val()
//     }),
//     success: function (d) {
//       console.log(d);
//     },
//     error: function (d) {
//       console.error(d);
//     }
//   });
// });
