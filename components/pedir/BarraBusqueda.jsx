import { TextField, IconButton, InputAdornment } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import CloseIcon from '@mui/icons-material/Close';
import Box from '@mui/material/Box';

const BarraBusqueda = ({ busquedaActiva, setBusquedaActiva, productoBusqueda, setProductoBusqueda, limpiarBusqueda, categorias }) => {
    const resaltarCoincidencias = (texto, busqueda) => {
        if (!busqueda) return texto;
        
        const regex = new RegExp(`(${busqueda})`, 'gi');
        const partes = texto.split(regex);
        
        return partes.map((parte, index) => 
            regex.test(parte) ? (
                <span key={index} style={{ color: '#1976d2', fontWeight: 'bold' }}>
                    {parte}
                </span>
            ) : (
                <span key={index}>{parte}</span>
            )
        );
    };

    return (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <TextField
                size="small"
                placeholder="Buscar producto..."
                value={productoBusqueda}
                onChange={(e) => {
                    setProductoBusqueda(e.target.value);
                    setBusquedaActiva(e.target.value.length > 0);
                }}
                InputProps={{
                    startAdornment: (
                        <InputAdornment position="start">
                            <SearchIcon />
                        </InputAdornment>
                    ),
                    endAdornment: busquedaActiva && (
                        <InputAdornment position="end">
                            <IconButton onClick={limpiarBusqueda}>
                                <CloseIcon />
                            </IconButton>
                        </InputAdornment>
                    ),
                }}
            />
        </Box>
    );
};

export default BarraBusqueda;
