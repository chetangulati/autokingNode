(function($) {
  "use strict"; // Start of use strict
  // Configure tooltips for collapsed side navigation
  $('.navbar-sidenav [data-toggle="tooltip"]').tooltip({
    template: '<div class="tooltip navbar-sidenav-tooltip" role="tooltip" style="pointer-events: none;"><div class="arrow"></div><div class="tooltip-inner"></div></div>'
  })
  // Toggle the side navigation
  $("#sidenavToggler").click(function(e) {
    e.preventDefault();
    $("body").toggleClass("sidenav-toggled");
    $(".navbar-sidenav .nav-link-collapse").addClass("collapsed");
    $(".navbar-sidenav .sidenav-second-level, .navbar-sidenav .sidenav-third-level").removeClass("show");
  });
  $(document).ready(function() {
    $('.table').DataTable();
} );
  // Force the toggled class to be removed when a collapsible nav link is clicked
  $(".navbar-sidenav .nav-link-collapse").click(function(e) {
    e.preventDefault();
    $("body").removeClass("sidenav-toggled");
  });

  $(".nav-link").click(function (e) {
    e.preventDefault();
    $(".nav-link").removeClass("active show");
  });
  // Prevent the content wrapper from scrolling when the fixed side navigation hovered over
  $('body.fixed-nav .navbar-sidenav, body.fixed-nav .sidenav-toggler, body.fixed-nav .navbar-collapse').on('mousewheel DOMMouseScroll', function(e) {
    var e0 = e.originalEvent,
      delta = e0.wheelDelta || -e0.detail;
    this.scrollTop += (delta < 0 ? 1 : -1) * 30;
    e.preventDefault();
  });
  // Scroll to top button appear
  $(document).scroll(function() {
    var scrollDistance = $(this).scrollTop();
    if (scrollDistance > 100) {
      $('.scroll-to-top').fadeIn();
    } else {
      $('.scroll-to-top').fadeOut();
    }
  });
  // Configure tooltips globally
  $('[data-toggle="tooltip"]').tooltip()
  // Smooth scrolling using jQuery easing
  $(document).on('click', 'a.scroll-to-top', function(event) {
    var $anchor = $(this);
    $('html, body').stop().animate({
      scrollTop: ($($anchor.attr('href')).offset().top)
    }, 1000, 'easeInOutExpo');
    event.preventDefault();
  });
})(jQuery); // End of use strict

$(document).on('click',".approve",function () {
  var sp = $(this).attr('data-sp');
  $.ajax({
    'url': '/approve',
    'method': 'post',
    'data': {
      'sp': sp
    },
    'dataType': 'json',
    success: function (e) {
      $("#reg").html(e.reg);
      $("#app").html(e.app);
      window.alert("Service provider approved successfully");
    },
    error: function (e) {
      console.log(e);
      window.alert('Some error Occured');
    }
  });
})

$(document).on('click', ".disapprove",function () {
  var sp = $(this).attr('data-sp');
  $.ajax({
    'url': '/disapprove',
    'method': 'post',
    'data': {
      'sp': sp
    },
    success: function (e) {
      $("#reg").html(e.reg);
      $("#app").html(e.app);
      window.alert("Service provider disapproved successfully");
    },
    error: function (e) {
      console.log(e);
      window.alert('Some error Occured');
    }
  });
})

$("#addBrand").submit(function (e) {
  e.preventDefault();
  var data = JSON.stringify({
    "vehicleType": $("#addBrand select[name=vehicleType]").val(),
    "brand": $("#addBrand input[name=brand]").val(),
  });
  $.ajax({
    method: "POST",
    url: "/addBrand",
    contentType: "application/json",
    data: data,
    success: function (e) {
      window.alert("Brand Added successfully");
      console.log(e);
    },
    error: function (e) {
      window.alert("Brand Already added");
    }
  });
})

$("#addModel").submit(function (e) {
  e.preventDefault();
  var data = JSON.stringify({
    "vehicleType": $("#addModel select[name=vehicleType]").val(),
    "brand": $("#addModel input[name=brand]").val(),
    "name": $("#addModel input[name=model]").val(),
    "cartype": $("#addModel select[name=cartype]").val(),
    "automatic": $("#addModel input[fuel-value=automatic]:checked").val(),
    "electric": $("#addModel input[fuel-value=electric]:checked").val(),
    "petrolauto": $("#addModel input[fuel-value=petrolauto]:checked").val(),
    "dieselauto": $("#addModel input[fuel-value=dieselauto]:checked").val(),
    "petrol": $("#addModel input[fuel-value=petrol]:checked").val(),
    "diesel": $("#addModel input[fuel-value=diesel]:checked").val(),
    "cng": $("#addModel input[fuel-value=cng]:checked").val(),
    "hybrid": $("#addModel input[fuel-value=hybrid]:checked").val(),
  });
  $.ajax({
    method: "POST",
    url: "/addModel",
    contentType: "application/json",
    data: data,
    success: function (e) {
      window.alert("Model Added successfully");
      console.log(e);
    },
    error: function () {
      window.alert("some error occoured");
    }
  });
})

$(".brandComplete").keyup(function (e) {
  if (e.keyCode != 40 && e.keyCode != 38 && e.keyCode != 9 && e.keyCode != 16 && e.keyCode != 17 && e.keyCode != 18 && e.keyCode != 37 && e.keyCode != 39 && e.keyCode != 20 && e.keyCode != 13) {
    var inp = $(".brandComplete").val();
    var v = $("#addModel select[name=vehicleType]").val();
    var re = /^[ A-Za-z0-9,._@#&]*$/;
    if (re.test(inp) && inp !== "") {
      $.ajax({
        type: 'get',
        url: '/brand',
        data: 'q='+inp+'&v='+v,
        success: function (data) {
          $(".brandCompletes ul").empty();
          $.each(data, function (i) {
            $("<li id='" +data[i]._id+ "'>" + data[i].brand + "</li>").appendTo($(".brandCompletes ul"));
          });
          $(".brandCompletes li").first().addClass("hlight")
          $(".brandCompletes ul li").click(function () {
            $(".brandComplete").val($(this).html());
            $(".brandCompletes ul").empty();
          });
          $(".brandComplete").focus();
        },
        error: function () {
          console.error("Error");
        }
      });
    }
    else{
      $(".brandCompletes ul").empty()
    }
  }
  });
  $(document).keyup(function(e) {
      var $hlight = $('.brandCompletes li.hlight'), $div = $('.brandCompletes li');
      if (e.keyCode == 40) {
          $hlight.removeClass('hlight').next().addClass('hlight');
          if ($hlight.next().length == 0) {
              $div.eq(0).addClass('hlight')
          }
      } else if (e.keyCode === 38) {
          $hlight.removeClass('hlight').prev().addClass('hlight');
          if ($hlight.prev().length == 0) {
              $div.eq(-1).addClass('hlight')
          }
      }
  });
  $(window).keydown(function (e) {
    if (e.keyCode == 13 && ($(".brandCompletes ul").html() != "")) {
        $(".brandComplete").val($('.brandCompletes li.hlight').html());
        $(".brandCompletes ul").empty();
    }
  });



  $("#model").keyup(function (e) {
    if (e.keyCode != 40 && e.keyCode != 38 && e.keyCode != 9 && e.keyCode != 16 && e.keyCode != 17 && e.keyCode != 18 && e.keyCode != 37 && e.keyCode != 39 && e.keyCode != 20 && e.keyCode != 13) {
      var inp = $("#model").val();
      var v = $("input[name=vehicleType]:checked").val();
      var brand = $(".brandComplete").val();
      var re = /^[ A-Za-z0-9,._@#&]*$/;
      if (re.test(inp) && inp !== "") {
        $.ajax({
          type: 'get',
          url: '/model',
          data: 'q='+inp+'&b='+brand+'&v='+v,
          dataType: 'json',
          success: function (data) {
            $("#models ul").empty();
            $.each(data, function (i) {
              $("<li id='" +data[i]._id+ "'>" + data[i].name + "</li>").appendTo($("#models ul"));
            });
            $("#models li").first().addClass("hlight")
            $("#models ul li").click(function () {
              $("#model").val($(this).html());
              $("#models ul").empty();
            });
            $("#model").focus();
          },
          error: function () {
            console.error("Error");
          }
        });
      }
      else{
        $("#models ul").empty()
      }
    }
    });
    $(document).keyup(function(e) {
        var $hlight = $('#models li.hlight'), $div = $('#models li');
        if (e.keyCode == 40) {
            $hlight.removeClass('hlight').next().addClass('hlight');
            if ($hlight.next().length == 0) {
                $div.eq(0).addClass('hlight')
            }
        } else if (e.keyCode === 38) {
            $hlight.removeClass('hlight').prev().addClass('hlight');
            if ($hlight.prev().length == 0) {
                $div.eq(-1).addClass('hlight')
            }
        }
    });
    $(window).keydown(function (e) {
      if (e.keyCode == 13 && ($("#models ul").html() != "")) {
          console.log($("#models ul").html());
          $("#model").val($('#models li.hlight').html());
          $("#models ul").empty();
      }
    });
