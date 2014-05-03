function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function loadVisualArtImagePromise() {
    var tags = ['creature', 'monster', 'alien', 'animal', 'beast'],
        tag = tags[Math.floor(Math.random()*tags.length)],
        url = 'http://www.visualart.me/search/index?type=tags&q=' + tag;
    return $.getJSON('http://whateverorigin.org/get?url=' + encodeURIComponent(url) + '&callback=?')
    .then(function(data){
        var html = $($.parseHTML(data.contents)),
            last_page_link = html.find('#main #pagination li:not([class]):last a').prop('href'),
            page_count = 1;

        if(last_page_link && last_page_link.length > 0) {
            page_count = last_page_link.match(/page=(\d+)/)[1];
        }
        
        var page = getRandomInt(1, page_count);

        return $.getJSON('http://whateverorigin.org/get?url=' + encodeURIComponent(url+'&page='+page) + '&callback=?');
    })
    .done(function(data){
        var html = $($.parseHTML(data.contents)),
            creatures = html.find('#main .browse .photo .thumb'),
            creature = creatures.eq(Math.floor(Math.random()*creatures.length)),
            image = creature.find('img').eq(0),
            info = creature.find('.info .left'),
            attribution = $('<div class="attribution"></div>').append(info);
            image.prop('src', image.data('href'));
            $('#creature').append(image).append('<br>').append(attribution);
    });
}

function generatePowers() {
    var powers = ["altering it's appearance", "becoming gigantic", "becoming tiny", "breathing underwater", "camoflaging it's body", "controlling air", "controlling arachnids", "controlling earth", "controlling electricity", "controlling fire", "controlling insects", "controlling water", "creating fire", "creating force fields", "detecting lies", "draining life energy", "eating anything", "an elastic body", "an enhanced sense of smell", "flight", "freezing things", "healing quickly", "healing others", "high jumping", "imitating voices", "immunity to most diseases", "immunity to most forms of radiation", "immunity to most toxins", "invisibility", "near-invulnerability to physical damage", "learning the complete history of an object by touching it", "manipulating emotions", "manipulating gravity", "manipulating light", "manipulating metal", "manipulating plants", "manipulating shadows", "manipulating time", "passing through solid objects", "prehensile hair", "a prehensile tail", "a prehensile tongue", "projecting illusions", "rapid learning", "reading minds", "seeing in the dark", "seeing the future", "seeing through illusions", "seeing through solid objects", "seeing remote events", "sensing emotions", "shooting energy beams", "super aiming skills", "super balance", "super hearing", "super intelligence", "super memory", "super navigation skills", "super speed", "super strength", "telepathy", "teleportation", "transforming into a gaseous form", "transforming into a liquid form", "withstanding extreme cold", "withstanding extreme heat"],
    num_powers = getRandomInt(1, 3),
    power_string = '',
    selected_powers = [];
    
    for(var i = 0; i <= num_powers; i++) {
        var index = Math.floor(Math.random()*powers.length);
        if(i == num_powers) {
            selected_powers = [selected_powers.join(', ')];
            selected_powers.push('and');
        }
        selected_powers.push(powers.splice(index, 1)[0]);
    }

    $('#creature').append('<p class="power">This creature has the power of '+selected_powers.join(' ')+'</p>');
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
    loadVisualArtImagePromise().done(generatePowers).done(generateStats).done(function() {
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
        $('#creature').html('');
        generate();
    });

    generate();
}

$(init);
