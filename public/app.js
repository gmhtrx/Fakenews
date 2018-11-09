alert(1);

$.getJSON("/articles", function(data) {
    console.log(data);
    for (let i = 0; i < data.length; i++) {
        $("#articles").append(`<h3 data-id="${data[i]._id}"><a href="${data[i].link}">${data[i].title}</a></h3>`);
        $("#articles").append(`<p data-id="${data[i]._id}"><a href="${data[i].link}">${data[i].description}</a></p>`);
        $("#articles").append(`<a href="/comments/${data[i]._id}">Comments</a>`);
    }
});

$.get("/comments/:id"), function(data) {
    console.log(data);
}