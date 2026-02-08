import { useState } from "react";
import { invoke } from "@tauri-apps/api/core";
import "./App.css";
import Video from "./components/features/video/Video";
import VideoCard from "./components/features/video/VideoCard";
import { listen } from "@tauri-apps/api/event";
import { Snackbar } from "@mui/material";

function App() {
  const [searchQuery, setSearchQuery] = useState("");
  const [videos, setVideos] = useState<Video[]>([]);
  const [toast, setToast] = useState("");
  const [toastOpen, setToastOpen] = useState(false)
  // Learn more about Tauri commands at https://tauri.app/develop/calling-rust/
  async function search(){
    invoke("search", {query: searchQuery}).then(r =>{console.log(r);setVideos(r as Video[])})
  }
  listen<string>('status', (e)=>{
    setToast(e.payload);
    console.log(e)
    setToastOpen(true)
    setTimeout(()=>{
      setToastOpen(false)
    }, 5000)
  })

  return (
    <main className="container">
      <h1>Yt Downloader</h1>
      <form
        className="row"
        onSubmit={(e) => {
          e.preventDefault();
          search();
        }}
      >
        <input
          id="search-input"
          onChange={(e) => setSearchQuery(e.currentTarget.value)}
          placeholder="Buscar un vidio"
        />
        <button type="submit">Buscar</button>
      </form>

      <div>
        {videos.map(e=><VideoCard key={e.video_id} video={e}/>)}
      </div>
    <Snackbar
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        open={toastOpen}
        onClose={()=>setToastOpen(false)}
        message={toast}
        key={'toast_message'}
      />
    </main>
  );
}

export default App;
