import { Modal, Button, Box, Typography } from "@mui/material"
import { useEffect, useState } from "react"
import { Config, ConfigType } from "./config"

const ConfigModal = ()=>{
    const [open, setOpen] = useState(false)
    const [config, setConfig] = useState<ConfigType | null>(null)

    useEffect(()=>{
        if(!config){
            Config.getConfig().then(c=>setConfig(c))
        }
    })

    return(
        <>
            <Button onClick={()=>setOpen(true)}>⚙️</Button>
            <Modal open={open} onClose={()=>setOpen(false)}>
                <Box className="modal">
                    <Typography variant="h5">Configuración</Typography>
                    <p>Directorio: {config?.output_dir}</p>
                </Box>
            </Modal>
        </>

    )
}

export default ConfigModal