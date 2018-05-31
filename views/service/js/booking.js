$('#chatOpen').click(() => {
  $('#chat').removeClass('deactivated');
  $('#chat').addClass('active');
});
$('#close').click(() => {
  $('#chat').removeClass('active');
  $('#chat').addClass('deactivated');
});
