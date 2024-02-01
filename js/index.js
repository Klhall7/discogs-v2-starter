'use strict';

document.addEventListener('DOMContentLoaded', function () {
    console.log('CONTENT LOADED');
    const greeting = document.createElement('h1');
    const root = document.querySelector('#root');
    greeting.textContent = 'Discogs API Lookup';
    root.append(greeting);

    // We're defining a default, but this will change!
    let artistId = '219213';
    let songsForPlaylist = [];

    function get(url) {
        return fetch(url, {
            method: 'GET',
            headers: {
                'User-Agent': 'SeanIsRad/3.0',
            },
        })
            .then(function (response) {
                return response.json();
            })
            .then(function (data) {
                return data;
            });
    }

    function showArtist(artistNam) {
        const artistHeader = document.createElement('h2');
        artistHeader.textContent = artistNam;
        root.appendChild(artistHeader);
    }

    function getReleases(url) {
        get(url + `?token=dEmdRkbzHyZaiaECsJccvowFtDNDqEzoVHUWngAB`).then(function (data) {
            // Destructure the releases
            const { releases } = data;
            // Create  UL
            const list = document.createElement('ul');
            // Append it to the #root
            root.appendChild(list);

            // Loop through the releases array
            releases.map(function (release) {
                // Create a list item
                const listItem = document.createElement('li');
                // Create a button
                const addToPlaylistBttn = document.createElement ('button');
                addToPlaylistBttn.textContent = 'Add to Playlist';
                // Add the release title to the list item
                listItem.textContent = `${release.title} -  ${release.year}`;
                // dynamically add the button to the list item
                listItem.appendChild(addToPlaylistBttn);
                // Append the list item to the list
                list.appendChild(listItem);

                //add event listener to button
                addToPlaylistBttn.addEventListener('click', function (e) {
                    songsForPlaylist =[...songsForPlaylist, release.title];
                    showPlaylist(songsForPlaylist);
                });
            });
        });
    }

    function showPlaylist(songs) {
        const playlistElement = document.querySelector('#playlist');

        if (!playlistElement) {
            const newPlaylistElement = document.createElement('div');
            newPlaylistElement.id = 'playlist' //dynamically add id to new playlist
            root.appendChild(newPlaylistElement);
            songsForPlaylist.map(function (song) { 
                const songParagraphElement = document.createElement('p');
                songParagraphElement.textContent = song;
                newPlaylistElement.appendChild(songParagraphElement);
            });

        } else {  
            let song = songsForPlaylist[0];
            if (songsForPlaylist.length >= 1) {
                song = songsForPlaylist[songsForPlaylist.length -1]
            }
            const songParagraphElement = document.createElement('p');
            songParagraphElement.textContent = song;
            playlistElement.appendChild(songParagraphElement);

            
        }
    }

    // This is an Immediately Invoked Function Expression aka IIFE (iffy)
    (function () {
        get(`https://api.discogs.com/artists/${artistId}?token=dEmdRkbzHyZaiaECsJccvowFtDNDqEzoVHUWngAB`).then(function (data) {
            // Destructure our data
            const { name, releases_url } = data;
            // Call it back
            showArtist(name);
            getReleases(releases_url);
        });
    })();
});
