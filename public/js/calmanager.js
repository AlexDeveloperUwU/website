$(document).ready(function () {
  $("#showAddEventForm").on("click", function () {
    $("#addEventFormContainer").removeClass("hidden");
    $("#deleteEventFormContainer").addClass("hidden");
  });

  $("#showDeleteEventForm").on("click", function () {
    $("#deleteEventFormContainer").removeClass("hidden");
    $("#addEventFormContainer").addClass("hidden");
  });

  $("#submitAddEventForm").on("click", function () {
    var username = $("#userAddEvent").val();
    var password = $("#passwordAddEvent").val();
    var formData = $("#addEventForm").serialize();

    $.ajax({
      url: "https://alexdevuwu.com/addEvent",
      type: "POST",
      headers: {
        Authorization: "Basic " + btoa(username + ":" + password),
        "Content-Type": "application/x-www-form-urlencoded",
      },
      data: formData,
      success: function (response) {
        console.log("Success:", response);
      },
      error: function (jqXHR, textStatus, errorThrown) {
        console.error("Error:", textStatus, errorThrown);
      },
    });
  });

  $("#submitDeleteEventForm").on("click", function () {
    var username = $("#userDeleteEvent").val();
    var password = $("#passwordDeleteEvent").val();
    var formData = $("#deleteEventForm").serialize();

    $.ajax({
      url: "https://alexdevuwu.com/removeEvent",
      type: "POST",
      headers: {
        Authorization: "Basic " + btoa(username + ":" + password),
        "Content-Type": "application/x-www-form-urlencoded",
      },
      data: formData,
      success: function (response) {
        console.log("Success:", response);
      },
      error: function (jqXHR, textStatus, errorThrown) {
        console.error("Error:", textStatus, errorThrown);
      },
    });
  });
});
