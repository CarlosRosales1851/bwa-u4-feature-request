import React, { Component } from 'react';
import './App.css';
import SearchBar from '../SearchBar/SearchBar';
import SearchResults from '../SearchResults/SearchResults';
import Playlist from '../Playlist/Playlist';
import Spotify from '../../util/Spotify'

let audio= new Audio();

class App extends Component {
  constructor (props){
    super(props);
    this.state={
      searchResults:[],
      playlistName: 'New Playlist',
      playlistTracks:[],
      onPlay: false,
      audioSrc: ''
  };
  this.addTrack=this.addTrack.bind(this);
  this.removeTrack=this.removeTrack.bind(this);
  this.updatePlaylistName=this.updatePlaylistName.bind(this);
  this.savePlaylist=this.savePlaylist.bind(this);
  this.search=this.search.bind(this);
  this.playPreview=this.playPreview.bind(this);
  }
  addTrack(track){
    let found= false;
    for(let i = 0; i<this.state.playlistTracks.length; i ++){
      if(track.id===this.state.playlistTracks[i].id){
        found=true
      }
    }
    if(!found){
      let playlist=this.state.playlistTracks.push(track);
      this.setState({playlist});
    }
  }
  removeTrack(track){
    let playlist=this.state.playlistTracks;
    const pos= playlist.indexOf(track);
    playlist.splice(pos,1);
    this.setState({playlist});
  }
  updatePlaylistName(name){
    this.setState({playlistName: name});
  }
  savePlaylist(){
    Spotify.savePlaylist(this.state.playlistName,
      this.state.playlistTracks.map(track=>
        track.uri
      ));
  }
  search(term) {
   Spotify.search(term).then(searchResults => {
     this.setState({searchResults: searchResults});
   });
 }
 playPreview(track){
   if(this.state.onPlay){
     if(this.state.audioSrc !== track.preview){
       this.setState({onPlay: true});
       this.setState({audioSrc: track.preview});
       audio.src=track.preview;
       audio.play();
     }else{
       audio.pause();
       this.setState({onPlay: false});
     }
   }else{
     this.setState({onPlay: true});
       this.setState({audioSrc: track.preview});
       audio.src=track.preview;
     audio.play();
   }

 }
  render() {
    return (
      <div>
        <h1>Ja<span className="highlight">mmm</span>ing</h1>
        <div className="App">
          <SearchBar onSearch={this.search}/>
          <div className="App-playlist">
            <SearchResults searchResults={this.state.searchResults}
            onAdd={this.addTrack} onPlay={this.playPreview}/>
            <Playlist playlistName={this.state.playlistName}
            playlistTracks={this.state.playlistTracks}
            onRemove={this.removeTrack}
            onNameChange={this.updatePlaylistName}
            onSave={this.savePlaylist}
            onPlay={this.playPreview}/>
          </div>
        </div>
      </div>
    );
  }
}

export default App;
