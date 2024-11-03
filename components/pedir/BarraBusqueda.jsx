import { TextField, IconButton } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import CloseIcon from '@mui/icons-material/Close';

const BarraBusqueda = ({ busquedaActiva, setBusquedaActiva, productoBusqueda, setProductoBusqueda, limpiarBusqueda }) => {
    return (
        <>
            {busquedaActiva ? (
                <TextField
                    autoFocus
                    size="small"
                    variant="outlined"
                    placeholder="Buscar producto"
                    value={productoBusqueda}
                    onChange={(e) => setProductoBusqueda(e.target.value)}
                    sx={{ minWidth: '200px' }}
                    InputProps={{
                        endAdornment: (
                            <IconButton onClick={limpiarBusqueda}>
                                <CloseIcon />
                            </IconButton>
                        ),
                    }}
                />
            ) : (
                <IconButton onClick={() => setBusquedaActiva(true)} sx={{ color: 'black' }}>
                    <SearchIcon />
                </IconButton>
            )}
        </>
    );
};

export default BarraBusqueda;
