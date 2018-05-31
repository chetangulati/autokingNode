$("#nav li").click(function () {
  $("#nav li").removeClass('active');
  this.classList.add('active');
  $("#sideNav").toggleClass("open");
  $(".tab").removeClass("active");
  $(this.getAttribute('data-tab')).addClass("active");
})
$("#menuBtn").click(function () {
  $("#sideNav").toggleClass("open");
});
