import { useState } from "react"
import Video from "./Video"
import { Paper, Typography } from "@mui/material"

const Player = ()=>{
    const [video, setVideo] = useState<Video | null>(null)
    const [playing, setPlaying] = useState(false)

    return (
        <Paper elevation={2}>
            <Typography>{playing?"▶️":"⏸️"}</Typography>
            <Typography>{video?.channel_name} {video?.title}</Typography>
        </Paper>
    )

    
}

export default Player