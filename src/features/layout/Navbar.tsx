import { Box, Button, Paper, Typography } from "@mui/material"
import { invoke } from "@tauri-apps/api/core";
import { useState } from "react";
import Video from "../video/Video";
import ConfigModal from "../config/ConfigModal";

interface NavbarProps {
    setVideos: (videos: Video[])=>void
}

const Navbar = ({setVideos}: NavbarProps)=>{
    const [searchQuery, setSearchQuery] = useState("");
    
    async function search(){
    invoke("search", {query: searchQuery}).then(r =>{console.log(r);setVideos(r as Video[])})
  }
    return (
        <Paper elevation={2} className="absolute p-3 top-0 left-0 w-screen flex justify-between items-center">
            <Box>
                <Typography variant="h5">
                    YT Downloader
                </Typography>
            </Box>
            <Box>
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
                placeholder="Buscar un video..."
                />
                <Button type="submit">🔍</Button>
            </form>
            </Box>
            <Box>
                <ConfigModal/>
            </Box>
        </Paper>
    )
}

export default Navbar