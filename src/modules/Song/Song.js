import React from 'react';
import { useState } from 'react';
import './Song.css';

function Song() {

  const API_KEY = process.env.REACT_APP_NAPSTER_API_KEY;
  const [songDetailsData, setSongDetailsData] = useState([]);
  const [songListData, setSongListData] = useState([]);


  // For Song Details:
  // Pass in track ID -> tracks API -> (song) name, artistName
  // From tracks API -> albumID for albums API

  // From albums API -> released, label
  // From albums API -> links { image { href = images API }} for album image API

  // From albums images API -> 170 x 170 pixels image


  // For Song Album:
  // From albums API, use the API link to find tracks -> list of tracks each has: (song) name, previewURL

  // Hardcoded for now
  let trackID = 'tra.327023395';
  
  // Song Details
  if (!songDetailsData.length) {

    console.log(songDetailsData);
    let songDetails =  {
      songImageSrc: null,
      songName: null,
      artistName: null,
      released: null,
      label: null,
      tracks: null,
    };
    let songList = [];

    // fetch track using track ID.
    fetch('http://api.napster.com/v2.2/tracks/'+ trackID + '?apikey=' + API_KEY)
      .then(function (response) {
        // Track API successful response
        console.log("Track API fetched successfully");
        return response.json();
      })
      .then(function (response) {
        console.log(response);

        songDetails.songName = response.tracks[0].name;
        songDetails.artistName = response.tracks[0].artistName;

        console.log(songDetails);

        // Fetch from albums API
        return fetch('https://api.napster.com/v2.2/albums/' + response.tracks[0].albumId + '?apikey=' + API_KEY);
      }).then(function (response) {
        // Albums API successful response
        console.log("Albums API fetched successfully");
        return response.json();
      })
      .then(function (response) {
        console.log(response);

        songDetails.released = (new Date(response.albums[0].released)).toDateString();
        songDetails.label = response.albums[0].label;
        songDetails.tracks = response.albums[0].links.tracks.href + '?apikey=' + API_KEY;

        console.log(songDetails);

        // Fetch data from (albums) images API
        return fetch(response.albums[0].links.images.href + '?apikey=' + API_KEY);
      }).then(function (response) {
        // (Albums) images API successful response
        console.log("Images API fetched successfully");
        return response.json();
      })
      .then(function (response) {
        console.log(response);

        songDetails.songImageSrc = response.images[0].url;

        console.log(songDetails);
        setSongDetailsData([songDetails]);

        // Fetch the list of tracks now
        return fetch(songDetails.tracks);
      })
      .then(function (response) {
        // Albums tracks API successful response
        console.log("Tracks have been fetched successfully.");
        return response.json();
      })
      .then(function (response) {
        // For every track in an album 
        // create an object and push on to songList array
        response.tracks.forEach(track => {
          songList.push({
            trackName: track.name,
            trackPreviewSrc: track.previewURL,
          })
        });
        console.log(songList);
        setSongListData(songList);
      })
      .catch(function (err) {
        // Error fetching image from API
        console.log("Error: unable to fetch data from one or more APIs");
      });
  }

  let songDetailsDOMElement = [];
  songDetailsData.forEach(song => {
    console.log('updated song details');
    songDetailsDOMElement.push(
      <div className="Song-details row">
        <img src={song.songImageSrc} alt={"Image Representing " + song.songName} className="image col" />
        <div className="song-info col">
          <p>
            SONG<br />
            {song.songName}<br />
            {song.artistName}<br />
            Released: {song.released}<br />
            Label: {song.label}
          </p>
        </div>
      </div>
    )}
  );

  let songListDOMElement = [];
  songListData.forEach(track => { 
    console.log('updated song list');
    songListDOMElement.push(
      <div className="song row">
        <div className="play-button col">
          <div className="play-button-image">Play Button Here</div>
          <div className="powered">Powered by Napster</div>
        </div>
        <div className="song-name col">
          {track.trackName}
        </div>
      </div>
    )
  });

  return(
    // Change to ids
    <div className="Song">

      {songDetailsDOMElement}

      <div className="Song-album">
        <h2 className="album-header">Songs</h2>
        <div className="song-list-container flex-row-container">
          <div className="flex-row-item"></div>
          <div className="song-list flex-row-item">
            {songListDOMElement}
          </div>
          <div className="flex-row-item"></div>
        </div>
      </div>

    </div>
  );
}

export default Song;