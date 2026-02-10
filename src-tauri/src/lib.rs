use std::{env, path::PathBuf};
use tauri::{AppHandle, Emitter};
use tauri_plugin_store::StoreExt;
use yt_dlp::client::deps::Libraries;
use yt_dlp::Youtube;
use yt_search::{SearchFilters, SortBy, VideoResult, YouTubeSearch};
// Learn more about Tauri commands at https://tauri.app/develop/calling-rust/

pub async fn download_libs(output_str: String) -> Result<(), Box<dyn std::error::Error>> {
    let executables_dir = PathBuf::from("libs");
    let output_dir = PathBuf::from(output_str);
    let _ = Youtube::with_new_binaries(executables_dir, output_dir).await?;
    Ok(())
}

#[tauri::command]
async fn search(query: String) -> Option<Vec<VideoResult>> {
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
        Ok(results) => Some(results),
        Err(e) => {
            eprintln!("Search error: {}", e);
            None
        }
    }
}

#[tauri::command]
async fn download_audio(app: AppHandle, url: String, video_name: String) {
    let libraries_dir = PathBuf::from("libs");
    let youtube = libraries_dir.join("yt-dlp");
    let ffmpeg = libraries_dir.join("ffmpeg");
    println!("checking store...");
    let store = app.store("config.json").unwrap();
    let output_val = store.get("output_dir").unwrap();
    let output_dir = output_val.as_str().unwrap();
    println!("checking libraries...");
    if !youtube.exists() || !ffmpeg.exists() {
        app.emit("status", "Descargando librerias...").unwrap();

        let _ = match download_libs(String::from(output_dir)).await {
            Ok(_) => app.emit("status", "Descarga de librerias completa"),
            Err(e) => {
                eprintln!("library downloading error: {}", e);
                app.emit("status", "Error descargando las librerias")
            }
        };
    }
    println!("libraries found...");
    let libraries = Libraries::new(youtube, ffmpeg);
    let fetcher = Youtube::new(libraries, output_dir).await;
    match fetcher {
        Ok(f) => {
            app.emit("status", "Descargando video...").unwrap();
            let _ = match f.download_audio_stream_from_url(url, video_name).await {
                Ok(_) => app.emit("status", "Descarga completa"),
                Err(e) => {
                    eprintln!("Search error: {}", e);
                    app.emit("status", "Descarga fallida")
                }
            };
        }
        Err(e) => {
            println!("Download error: {}", e)
        }
    }
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_dialog::init())
        .plugin(tauri_plugin_store::Builder::new().build())
        .plugin(tauri_plugin_store::Builder::default().build())
        .setup(|app| {
            let store = app.store("config.json")?;
            match store.get("output_dir") {
                Some(_) => Ok(()),
                None => {
                    let path = env::current_dir()?;
                    store.set("output_dir", path.join("music").to_str());
                    Ok(())
                }
            }
        })
        .plugin(tauri_plugin_opener::init())
        .invoke_handler(tauri::generate_handler![search, download_audio])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
