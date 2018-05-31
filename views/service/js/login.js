$('#fpForm').submit(function (e) {
  e.preventDefault();
  $('form').css('display', 'none');
  // set an ajax function for sending the link
  $('.lds-dual-ring').css('display', 'block');
  setTimeout(function () {
    $('.lds-dual-ring').css('display', 'none');
    $('.msg').html('We have sent you an email with password reset link');
  }, 1000);
});
