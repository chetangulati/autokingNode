$("#sideNav li").click(function (e) {
  $("#sideNav").toggleClass('active');
  $(".filter").toggleClass('active');
  $("#sideNav li").removeClass('active');
  this.classList.add('active');
  var index = $("#sideNav li").index(this);
  $("#vslide").css("top", index*46 + "px");
  $(".tab").css("display", "none");
  $(this.getAttribute('data-tab')).css("display","block");
});

$(".vacationMode").click(function () {
  if ($(".vacationMode").hasClass('active') ) {
    var data ={
      "vac": false
    };
    $.ajax({
      url: "/vacation",
      method: "post",
      data: JSON.stringify(data),
      contentType: "application/json",
      success: function (){
        window.alert('Vacation Mode deactivated');
      },
      error: function (e) {
        console.error(e);
      }
    });
  }
  else {
    var data ={
      "vac": true
    };
    $.ajax({
      url: "/vacation",
      method: "post",
      data: JSON.stringify(data),
      contentType: "application/json",
      success: function (){
        window.alert('Vacation Mode Activated');
      },
      error: function (e) {
        console.error(e);
      }
    });
  }

  $(".vacationMode").toggleClass('active');
  $(".slide").toggleClass('active');
});


$("#q").click(function () {
  if ($('#sideNav').hasClass('active')) {
    $("#sideNav").removeClass('active');
    $(".filter").removeClass('active');
  }
  $(".tab").css("display", "none");
  $("#book").css("display", "block");
  $("#vslide").css("top", "0px");
  $("#sideNav li").removeClass('active');
  $("li[data-tab='#book']").addClass('active');
});


//menuBtn
$(".menuBtn").click(() => {
  $("#sideNav").toggleClass('active');
  $(".filter").toggleClass('active');
});

$(".filter").click(()=>{
  $("#sideNav").toggleClass('active');
  $(".filter").toggleClass('active');
});

// search
$("#q").on("keyup", function() {
    var value = $(this).val();

    $("table tr").each(function(index) {
        if (index != 0) {

            $row = $(this);

            var id = $row.find("td:first").text();

            if (id.indexOf(value) != 0) {
                $(this).hide();
            }
            else {
                $(this).show();
            }
        }
    });
  });



  var bigValueSlider = document.getElementById('time-slider'),
  startSpan = document.getElementById('start-time');
  start = document.getElementById('slotstart');
  endSpan = document.getElementById('end-time');
  end = document.getElementById('slotend');

  noUiSlider.create(bigValueSlider, {
    start: [5,6],
    connect: true,
    	step: 1,
      margin: 1,
    	format: wNumb({
    		decimals: 0
    	}),
    	range: {
    		min: 0,
    		max: 12
    	}
  });



  var range = [
    '9:00 AM','10:00 AM','11:00 AM',
    '12:00 PM','1:00 PM','2:00 PM','3:00 PM',
    '4:00 PM','5:00 PM','6:00 PM','7:00 PM',
    '8:00 PM','9:00 PM'
  ];

  bigValueSlider.noUiSlider.on('update', function ( values, handle ) {
    if (handle) {
      endSpan.innerHTML = range[values[handle]];
      end.value = values[handle];
    }
    else {
      start.value = values[handle];
      startSpan.innerHTML = range[values[handle]];
    }
  });

$('#slotAdd').click(function () {
  var data = {
    "start": $('#slotstart').val(),
    "end": $('#slotend').val()
  };
  $(".loader").addClass('active');
  $.ajax({
    url: '/slots',
    method: 'post',
    contentType: 'application/json',
    data: JSON.stringify(data),
    success: function () {
      window.alert('Slot Added successfully');
    },
    error: function (e) {
      window.alert('Some error Occured');
      console.log(e);
    }
  });
});

$("#boostForm").submit(function (e) {
  e.preventDefault();
  var data = {
    "message": $("#boostForm textarea").val(),
    "pack": $("#boostForm select").val(),
  };
  $.ajax({
    url: '/boost',
    method: "post",
    data: JSON.stringify(data),
    contentType: 'application/json',
    success: function () {
      window.alert('Request Submitted successfully');
    },
    error: function () {
      window.alert('Some error occoured');
    }
  })
});

$("#file-input").change(function (e) {
  var formData = new FormData();

  formData.append("picchange", $("#file-input")[0].files[0]);

  $.ajax({
    url: '/profilepic',
    method: "post",
    contentType: false,
    processData: false,
    cache: false,
    data: formData,
    success: function () {
      window.alert('Changes successfull');
    },
    error: function (e) {
      window.alert('Error occoured ');
      console.log(e);
    }
  })
});

// chart
Chart.defaults.global.defaultFontFamily = '-apple-system,system-ui,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif';
Chart.defaults.global.defaultFontColor = '#292b2c';
// -- Area Chart Example
var ctx = document.getElementById("myAreaChart");
var myLineChart = new Chart(ctx, {
  type: 'line',
  data: {
    labels: ["Mar 1", "Mar 2", "Mar 3", "Mar 4", "Mar 5", "Mar 6", "Mar 7", "Mar 8", "Mar 9", "Mar 10", "Mar 11", "Mar 12", "Mar 13"],
    datasets: [{
      label: "Sessions",
      lineTension: 0.3,
      backgroundColor: "rgba(2,117,216,0.2)",
      borderColor: "rgba(2,117,216,1)",
      pointRadius: 5,
      pointBackgroundColor: "rgba(2,117,216,1)",
      pointBorderColor: "rgba(255,255,255,0.8)",
      pointHoverRadius: 5,
      pointHoverBackgroundColor: "rgba(2,117,216,1)",
      pointHitRadius: 20,
      pointBorderWidth: 2,
      data: [10000, 30162, 26263, 18394, 18287, 28682, 31274, 33259, 25849, 24159, 32651, 31984, 38451],
    }],
  },
  options: {
    scales: {
      xAxes: [{
        time: {
          unit: 'date'
        },
        gridLines: {
          display: false
        },
        ticks: {
          maxTicksLimit: 7
        }
      }],
      yAxes: [{
        ticks: {
          min: 0,
          max: 40000,
          maxTicksLimit: 5
        },
        gridLines: {
          color: "rgba(0, 0, 0, .125)",
        }
      }],
    },
    legend: {
      display: false
    }
  }
});
