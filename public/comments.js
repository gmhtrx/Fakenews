var a = location.pathname.split("/");
console.log(a);

$.ajax({
    method: "GET",
    url: "/api/" + a[2]
  })
    // With that done, add the note information to the page
    .then(function(data) {
      console.log(data);
            $("#articles").append(`<h3 id="title" data-id="${data._id}"><a href="${data.link}">${data.title}</a></h3>`);
            $("#articles").append(`<p data-id="${data._id}"><a href="${data.link}">${data.description}</a></p>`);
            $("#articles").append(`<a href="/comments/${data._id}">Comments</a>`);
        });

$("#postcomment").on("click", function () {
    var thisId = $("#title").attr("data-id");
    console.log(thisId);
    console.log($("#commenter").val())
    $.ajax({
        method: "POST",
        url: "/api/" + thisId,
        data: {
            commenter: $("#commenter").val(),
            body: $("#body").val()
        }
    })
        // With that done
        .then(function (data) {
            // Log the response
            console.log(data);
            // Empty the notes section
        });

    // Also, remove the values entered in the input and textarea for note entry
    $("#titleinput").val("");
    $("#bodyinput").val("");
});