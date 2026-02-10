import Video from "./Video"
import { Paper, Typography } from "@mui/material"


interface PlayerProps {
    video: Video | null;
}

const Player = ({video}: PlayerProps)=>{

    return (
        <Paper elevation={2} className=" fixed bottom-4 left-3 p-2 w-[275px] h-[185px]">
            <iframe id='video-player' src={`https://www.youtube.com/embed/${video?.video_id}`} height={150} width={250} />
            <Typography className="block overflow-hidden text-ellipsis text-nowrap">
                {video?`${video.channel_name} - ${video.title}`:"Selecciona un video"}
            </Typography>
        </Paper>
    )

    
}

export default Player