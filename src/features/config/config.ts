import { load } from "@tauri-apps/plugin-store";

export interface ConfigType {
    output_dir: string
}

export class Config {

    private static config : ConfigType | null;

    public static async getConfig(){
        if (!Config.config){
            const store = await load("config.json");
            console.log(store)
            const output_dir = await store.get<string>("output_dir")
            Config.config = {output_dir} as ConfigType
        }
        return Config.config;
    }

}

