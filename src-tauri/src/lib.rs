use yt_search::{SearchFilters, SortBy, VideoResult, YouTubeSearch};
use yt_dlp::Youtube;
use std::path::PathBuf;
use yt_dlp::client::deps::Libraries;
use tauri::{AppHandle, Emitter};
// Learn more about Tauri commands at https://tauri.app/develop/calling-rust/

pub async fn download_libs() -> Result<(), Box<dyn std::error::Error>> {
    let executables_dir = PathBuf::from("libs");
    let output_dir = PathBuf::from("output");

    let _ = Youtube::with_new_binaries(executables_dir, output_dir).await?;
    Ok(())
}

#[tauri::command]
async fn search(query: String) -> Option<Vec<VideoResult>>{
    let search = match YouTubeSearch::new(None, false) {
        Ok(search) => search,
        Err(e) => {
            eprintln!("Failed to initialize YouTubeSearch: {}", e);
            return None;
        }
    };
    let filters = SearchFilters {
        sort_by: Some(SortBy::ViewCount),
        duration: None,
    };

    match search.search(&query, filters).await {
        Ok(results)=>Some(results),
        Err(e) => {eprintln!("Search error: {}", e); None},
    }
}

#[tauri::command]
async fn download_audio(app: AppHandle, url: String) {
    let libraries_dir = PathBuf::from("libs");
    let output_dir = PathBuf::from("output");

    let youtube = libraries_dir.join("yt-dlp");
    let ffmpeg = libraries_dir.join("ffmpeg");

    if !youtube.exists() || !ffmpeg.exists() {
        app.emit("status", "Descargando librerias...").unwrap();
        let _ = match download_libs().await {
            Ok(_) => {app.emit("status", "Descarga de librerias completa")},
            Err(e) => {
                eprintln!("library downloading error: {}", e);
                app.emit("status", "Error descargando las librerias")
            },
        };
        
    }

    let libraries = Libraries::new(youtube, ffmpeg);
    let fetcher = Youtube::new(libraries, output_dir).await;
    match fetcher {
        Ok(f) => {
            app.emit("status", "Descargando video...").unwrap();
            let _ = match f.download_audio_stream_from_url(url, "test.mp3").await {
                Ok(_) => {app.emit("status", "Descarga completa")},
            Err(e) => {
                eprintln!("Search error: {}", e);
                app.emit("status", "Descarga fallida")
            },
            };
        },
        Err(e) => {println!("Download error: {}", e)},
    }
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())
        .invoke_handler(tauri::generate_handler![search, download_audio])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
