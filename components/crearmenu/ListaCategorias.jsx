// pages/crearMenu/ListaCategorias.jsx
import { Grid, Button } from '@mui/material';

const ListaCategorias = ({ categorias, onDelete }) => {
    if (!categorias || !Array.isArray(categorias)) {
        return <div>No hay categorías disponibles</div>;
    }

    return (
        <div style={{
            border: '1px solid #e0e0e0',
            borderRadius: '8px',
            padding: '20px',
            backgroundColor: '#f8f8f8',
            maxWidth: '600px',
            margin: '20px auto'
        }}>
            <h3 style={{
                marginBottom: '20px',
                color: '#333',
                borderBottom: '2px solid #ddd',
                paddingBottom: '10px'
            }}>
                Categorías del Menú
            </h3>
            
            <Grid container spacing={2}>
                {categorias.map(categoria => (
                    <Grid item key={categoria._id} xs={12} sm={6} md={4}>
                        <div style={{ 
                            display: 'flex', 
                            alignItems: 'center',
                            backgroundColor: 'white',
                            padding: '8px',
                            borderRadius: '8px',
                            boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                            marginBottom: '8px'
                        }}>
                            <div style={{
                                backgroundColor: 'black',
                                color: 'white',
                                padding: '6px 12px',
                                borderRadius: '15px',
                                flex: 1
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
        </div>
    );
};

export default ListaCategorias;
