// Grab JSON Articles
$.getJSON("/articles", function (data) {
    console.log(data);
    for (var i = 0; i < data.length; i++) {
        // Display the apropos information on the page
        $("#articles").append("<p data-id='" + data[i]._id + "'>" + data[i].title + "<br />" + data[i].link + "</p>");
    }
});

// New scrape button
$("#scrapeButton").on("click", function () {
    $.ajax({
        method: "GET",
        url: "/scrape",
    }).done(function (data) {
        console.log(data)
        res.send(data)
    })
});

// Saving an article 
$("#saveButton").on("click", function () {
    var thisId = $(this).attr("data-id");
    $.ajax({
        method: "POST",
        url: "/articles/save/" + thisId
    }).done(function (data) {

    })
});

//On click for the write note button
$(document).on("click", "#articleNotes", function () {

    $("#notes").empty();

    var thisId = $(this).attr("data-id");

    $.ajax({
        method: "GET",
        url: "/articles/" + thisId
    })

        .then(function (data) {
            console.log(data);

            $("#notes").append("<h2>" + data.title + "</h2>");

            $("#notes").append("<input id='note-title' name='title' >");

            $("#notes").append("<textarea id='note-text-body' name='body'></textarea>");

            $("#notes").append("<button data-id='" + data._id + "' id='savenote-button'>Save Note</button>");


            if (data.note) {

                $("#note-title").val(data.note.title);

                $("#note-text-body").val(data.note.body);
            }
        });
});

// Clicking to save a note 
$(document).on("click", "#savenote", function () {
    var thisId = $(this).attr("data-id");

    $.ajax({
        method: "POST",
        url: "/articles" + thisId,
        data: {
            title: $("#note-title").val(),

            body: $("#note-text-body").val()
        }
            .then(function (data) {
                console.log(data);

                $("#notes").empty();

            })

    });
    $("#note-title").val("");
    $("#note-text-body").val("");

})
