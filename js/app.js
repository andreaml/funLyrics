const API_URL = 'http://api.musixmatch.com/ws/1.1/'
const API_KEY = '0db172a8abf3bc2cf394cb39165f81c9'

$('document').ready(function() {
    $('#songTitle').on('keyup', searchTrack)
})

function searchTrack(event) {
    let trackTitle = event.currentTarget.value
    getTrackMatches(trackTitle, function(tracks, err) {
        if (!err) {
            $('#trackList').empty()
            $('#trackCounter').text(`${tracks.length} songs found`)
            tracks.forEach(function(track) {
                renderTrack(track.track)
            })
        }
    });
}

function buildRequest(uri, customData) {
    let data = {
        apikey: API_KEY,
        format: "jsonp"
    }
    return {
        url: `${API_URL}${uri}`,
        method: 'GET',
        dataType: "jsonp",
        contentType: 'application/json',
        data: $.extend(data, customData)
    }
}

function getTrackMatches(trackTitle, callback) {
    $.ajax(buildRequest('track.search', { 'q_track': trackTitle }))
    .done(function(response) { callback(response.message.body.track_list) })
    .fail(function(error) { callback(null, error) })
}

function renderTrack(track) {
    let listTrackElement = $('<li></li>')
    let listTrackName = $(`
    <div id="${track.track_id}" class="track" onclick="renderTrackLyrics(event.target.id)" data-toggle="collapse" data-target="#content-${track.track_id}" aria-expanded="true" aria-controls="content-${track.track_id}">
        <h3 class="mb-0">
            <strong>${track.track_name}</strong>
        </h3>
        <small class="font-weight-light">${track.artist_name}</small>
    </div>`)
    let listTrackLyric = $(`
    <div id="content-${track.track_id}" class="collapse" aria-labelledby="${track.track_id}" data-parent="#trackList">
        <div class="card-body"></div>
    </div>`)
    listTrackElement.append(listTrackName, listTrackLyric)
    $('#trackList').append(listTrackElement)
}

function renderTrackLyrics(trackId) {
    getTrackLyrics(trackId, function(trackLyrics, err) {
        let lyrics = (trackLyrics) ?  `${trackLyrics.lyrics_body}<br><small>${trackLyrics.lyrics_copyright}</small>` : 'No lyrics available.';
        $(`#content-${trackId} .card-body`).html(lyrics)            
    })
}

function getTrackLyrics(trackId, callback) {
    $.ajax(buildRequest('track.lyrics.get', { 'track_id': trackId }))
    .done(function(response) { callback(response.message.body.lyrics) })
    .fail(function(error) { callback(null, error) })
}