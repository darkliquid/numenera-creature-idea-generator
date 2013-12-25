function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function loadCGHubImagePromise() {
    var tags = ['creature', 'monster', 'alien'],
        tag = tags[Math.floor(Math.random()*tags.length)],
        url = 'http://cghub.com/images/tag/' + tag;
    return $.getJSON('http://whateverorigin.org/get?url=' + encodeURIComponent(url) + '&callback=?')
    .then(function(data){
        var html = $($.parseHTML(data.contents)),
            last_page_link = html.find('#main .paging .last a').prop('href'),
            page_count = 1;

        if(last_page_link && last_page_link.length > 0) {
            page_count = last_page_link.match(/\:(\d+)\/$/)[1];
        }
        
        var page = getRandomInt(1, page_count);

        return $.getJSON('http://whateverorigin.org/get?url=' + encodeURIComponent(url+'/page:'+page+'/') + '&callback=?');
    })
    .done(function(data){
        var html = $($.parseHTML(data.contents)),
            creatures = html.find('.detgallery li'),
            creature = creatures.eq(Math.floor(Math.random()*creatures.length)),
            image = creature.find('img.m').eq(0),
            info = creature.find('h4 > a, h4 > small:first'),
            attribution = $('<div class="attribution"></div>').append(info);

            $('#creature').append(image).append('<br>').append(attribution);
    });
}

function generatePowers() {
    $('#creature').append('<p class="power">Power goes here</p>');
}

function generateStats() {
    var level = getRandomInt(1, 6) + getRandomInt(1,3),
        armour = level - 2,
        health = level * 4,
        primary_attack = level + 1,
        power_attack = level + 3,
        maneuvering_attack = level - 1;

    $('#creature').append(['<dl class="stats">',
        '<dt>Level:</dt><dd>'+level+'</dd>',
        '<dt>Armour:</dt><dd>'+armour+'</dd>',
        '<dt>Health:</dt><dd>'+health+'</dd>',
        '<dt>Primary Attack:</dt><dd>'+primary_attack+' damage</dd>',
        '<dt>Power Attack:</dt><dd>'+power_attack+' damage</dd>',
        '<dt>Maneuvering Attack:</dt><dd>'+maneuvering_attack+' damage</dd>',
    '</dl>'].join(''));
}

function generate() {
    loadCGHubImagePromise().done(generatePowers).done(generateStats).done(function() {
        $('#creature').append('<hr>');
    });
}

function init() {
    $('#generate').on('click', function(e) {
        e.preventDefault();
        generate();
    });

    $('#clear-all').on('click', function(e) {
        e.preventDefault();
        $('#generate').html('');
        generate();
    });

    generate();
}

$(init);
