import { Modal, Button, Box, Typography } from "@mui/material"
import { useEffect, useState } from "react"
import { Config, ConfigType } from "./config"
import { open } from "@tauri-apps/plugin-dialog"

const ConfigModal = ()=>{
    const [openModal, setOpenModal] = useState(false)
    const [config, setConfig] = useState<ConfigType | null>(null)


    useEffect(()=>{
        if(!config){
            Config.getConfig().then(c=>setConfig(c))
        }
    }, [config])

    const selectDir = async ()=>{
        const dir = await open({
            multiple:false,
            directory:true,
        })
        if(!dir) return;
        const config = await Config.getConfig();
        config.output_dir = dir as string;
        setConfig({...config})
        await Config.setConfig(config);
    }

    return(
        <>
            <Button onClick={()=>setOpenModal(true)}>⚙️</Button>
            <Modal open={openModal} onClose={()=>setOpenModal(false)}>
                <Box className="modal">
                    <Typography variant="h5">Configuración</Typography>
                    <p>Directorio: {config?.output_dir}</p>
                    <Button onClick={selectDir}>
                        Seleccionar carpeta...
                    </Button>
                </Box>
            </Modal>
        </>

    )
}

export default ConfigModal