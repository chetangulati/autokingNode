$('#chatOpen').click(() => {
  $('#chat').removeClass('deactivated');
  $('#chat').addClass('active');
});
$('#close').click(() => {
  $('#chat').removeClass('active');
  $('#chat').addClass('deactivated');
});

$("#cnfirm").submit(function (e) {
  e.preventDefault();
  var formData = $(this).serialize();
  $.ajax({
    url: "/confirmotp",
    method: "post",
    data: formData,
    success: function (e) {
      alert(e);
      window.location.reload(true);
    },
    error: function (e) {
      console.log(e);
      alert(e);
    }
  });
});
function getParameterByName(parameterName) {
    var result = null,
        tmp = [];
    var items = location.search.substr(1).split("&");
    for (var index = 0; index < items.length; index++) {
        tmp = items[index].split("=");
        if (tmp[0] === parameterName) result = decodeURIComponent(tmp[1]);
    }
    return result;
}
$("#cancel").click(function () {
  var id = getParameterByName("bookid");
  $.ajax({
    url: "/cancel",
    method: "post",
    data: "id="+id,
    success: function (e) {
      alert(e.responseText);
    },
    error: function (e) {
      alert(e.responseText);
    }
  });
});
