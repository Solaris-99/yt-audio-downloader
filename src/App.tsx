import { useState } from "react";
import "./App.css";
import Video from "./features/video/Video";
import VideoCard from "./features/video/VideoCard";
import { listen } from "@tauri-apps/api/event";
import { Box, Snackbar } from "@mui/material";
import Navbar from "./features/layout/Navbar";
import Player from "./features/video/Player";

function App() {
  const [videos, setVideos] = useState<Video[]>([]);
  const [toast, setToast] = useState("");
  const [toastOpen, setToastOpen] = useState(false)
  const [currentVideo, setCurrentVideo] = useState<Video|null>(null)
  // Learn more about Tauri commands at https://tauri.app/develop/calling-rust/
  
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
      <Navbar setVideos={setVideos}/>

      <Box className="w-screen mt-20">
        {videos.map(e=><VideoCard setVideoPlayer={setCurrentVideo} key={e.video_id} video={e}/>)}
      </Box>
    <Snackbar
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        open={toastOpen}
        onClose={()=>setToastOpen(false)}
        message={toast}
        key={'toast_message'}
      />
      <Player video={currentVideo}/>
    </main>
  );
}

export default App;
