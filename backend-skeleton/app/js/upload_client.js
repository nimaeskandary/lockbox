$('#input').on('click', '#upload-text', function() {
    var textUpload = {
        created: new Date().toISOString().slice(0, 19).replace('T', ' '),
        type: 'text',
        record: $('#text-data').val()
    };
    $.ajax({
        type: 'POST',
        url: '/textUpload',
        data: textUpload
    })
        .done(function (response){
            alert(response);
        })
        .fail(function (error) {
            alert(error.responseText);
        })
});
