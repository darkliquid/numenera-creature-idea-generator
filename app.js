function loadCGHubImage() {
    $.getJSON('http://whateverorigin.org/get?url=' + encodeURIComponent('http://google.com') + '&callback=?', function(data){
        alert(data.contents);
    });
}