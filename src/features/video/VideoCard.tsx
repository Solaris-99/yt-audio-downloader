import { Button, Card, CardActions, CardContent, CardMedia, Divider, Typography } from "@mui/material"
import { invoke } from "@tauri-apps/api/core";
import Video from "./Video"

interface VideoCardProps {
    video: Video
    setVideoPlayer: (video: Video)=>void;
}

const VideoCard = ({video, setVideoPlayer} : VideoCardProps)=>{
    const download = (url: String)=>{
        url = "https://www.youtube.com/watch?v=" + url
        invoke("download_audio", {url, videoName: `${video.channel_name} - ${video.title}.mp3`})
    }

    return (
        <Card  className="grid grid-cols-4 my-2 video-card">
            <CardMedia
            className="block my-auto"
            component={"img"}
            alt={video.title}
            image={video.thumbnail_url}
            />
            <CardContent className="col-span-3">
                <Typography gutterBottom variant="h5" component={"div"}>
                    {video.title}
                </Typography>
                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                {video.description_snippet}
                </Typography>
                <Divider/>
                <Typography variant="body2" sx={{ color: 'text.secondary', fontSize: "small" }}>
                {video.channel_name}, {video.published_time}, {video.view_count}
                </Typography>
                <Divider/>
                <CardActions>
                    <Button size="small" onClick={()=>download(video.video_id)}>
                        Descargar
                    </Button>
                    <Button onClick={()=>setVideoPlayer(video)}>
                        Play
                    </Button>
                </CardActions>
            </CardContent>
        </Card>
    )

}

export default VideoCard