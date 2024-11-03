// pages/crearMenu/ListaCategorias.jsx
import { Grid, Button } from '@mui/material';

const ListaCategorias = ({ categorias, onDelete }) => {
    if (!categorias || !Array.isArray(categorias)) {
        return <div>No hay categorías disponibles</div>;
    }

    return (
        <Grid container spacing={2}>
            {categorias.map(categoria => (
                <Grid item key={categoria._id} xs={12} sm="auto">
                    <div style={{ display: 'flex', alignItems: 'center', position: 'relative', marginBottom: '8px' }}>
                        <div style={{
                            backgroundColor: 'black',
                            color: 'white',
                            padding: '6px 12px',
                            borderRadius: '15px',
                            marginRight: '8px', // Ajusta la distancia entre categoría y botón
                        }}>
                            {categoria.nombre_categoria}
                        </div>
                        <Button
                            variant="contained"
                            color="error"
                            size="small"
                            onClick={() => onDelete(categoria._id)}
                            style={{
                                backgroundColor: 'black',
                                color: 'white',
                                borderRadius: '50%',
                                minWidth: '30px',
                                height: '30px',
                                padding: '0',
                                display: 'flex',
                                marginRight: '-0px',
                                marginTop: '-20px',
                                marginLeft: '-20px',
                    
                            }}
                            onMouseEnter={(e) => {
                                e.target.style.backgroundColor = 'red';
                                e.target.style.color = 'white';
                            }}
                            onMouseLeave={(e) => {
                                e.target.style.backgroundColor = 'black';
                                e.target.style.color = 'white';
                            }}
                        >
                            &times;
                        </Button>
                    </div>
                </Grid>
            ))}
        </Grid>
    );
};

export default ListaCategorias;
