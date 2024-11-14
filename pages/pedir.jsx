import React, { useEffect, useState } from 'react';
import { Box, Typography, Container } from '@mui/material';
import Image from 'next/image';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import bannerImage from '../public/imagenes/logo.png';
import segundoBannerImage from '../public/imagenes/publicidad1.png';
import tercerBannerImage from '../public/imagenes/publicidad2.png';
import ProductoCard from '../components/pedir/ProductoCard';
import BarraBusqueda from '../components/pedir/BarraBusqueda';
import Link from 'next/link'; // Importa Link para la navegación

const Pedir = () => {
    const [productos, setProductos] = useState([]);
    const [busquedaActiva, setBusquedaActiva] = useState(false);
    const [productoBusqueda, setProductoBusqueda] = useState('');
    const [total, setTotal] = useState(0);
    const [categorias, setCategorias] = useState([]);
    const [categoriaActual, setCategoriaActual] = useState('');
    const [indexBanner, setIndexBanner] = useState(0); // Estado para la imagen del banner

    // Imágenes del banner
    const banners = [tercerBannerImage, segundoBannerImage]; // Añade más imágenes si es necesario

    useEffect(() => {
        const fetchProductos = async () => {
            try {
                const response = await fetch('http://localhost:3000/productos');
                const data = await response.json();
                setProductos(data);
                const categoriasUnicas = [...new Set(data.map(producto => producto.categoria.nombre))];
                setCategorias(categoriasUnicas);
            } catch (error) {
                console.error("Error al cargar productos:", error);
            }
        };

        fetchProductos();

        // Cambiar de banner cada 3 segundos
        const interval = setInterval(() => {
            setIndexBanner(prevIndex => (prevIndex + 1) % banners.length);
        }, 4000); // Cambia el tiempo según sea necesario

        return () => clearInterval(interval); // Limpia el intervalo
    }, []);

    const agregarAlCarrito = (producto) => {
        setTotal(prevTotal => prevTotal + producto.precio);
    };

    const limpiarBusqueda = () => {
        setProductoBusqueda('');
        setBusquedaActiva(false);
    };

    const productosFiltrados = busquedaActiva
        ? productos.filter(producto => producto.nombre.toLowerCase().includes(productoBusqueda.toLowerCase()))
        : productos;

    const productosEnMenu = productosFiltrados.filter(producto => producto.enMenu);

    const productosPorCategoria = productosEnMenu.reduce((acc, producto) => {
        const categoriaNombre = producto.categoria.nombre;
        if (!acc[categoriaNombre]) {
            acc[categoriaNombre] = [];
        }
        acc[categoriaNombre].push(producto);
        return acc;
    }, {});

    const scrollToCategoria = (categoria) => {
        const categoriaElement = document.getElementById(categoria);
        if (categoriaElement) {
            categoriaElement.scrollIntoView({ behavior: 'smooth' });
            setCategoriaActual(categoria);
        }
    };

    return (
        <>
            {/* Primer Banner */}
            <Box sx={{ my: 2, display: 'flex', justifyContent: 'center', mb: 4 }}>
                <Image
                    src={bannerImage}
                    alt="Logo de la Cafetería"
                    layout="intrinsic" // Cambiado a intrinsic para que se ajuste a su contenido
                    width={500} // Ajusta el tamaño según sea necesario
                    height={800} // Ajusta el tamaño según sea necesario
                />
            </Box>

            {/* Mensajes debajo del primer banner */}
            <Box sx={{ my: 2, display: 'flex', justifyContent: 'space-between' }}>
                <Link href="/pedir" passHref>
                    <Typography
                        variant="h6"
                        sx={{
                            cursor: 'pointer',
                            marginLeft: 50,
                            fontSize: '2rem',
                            fontWeight: 'bold' // Pone el texto en negrita
                        }}
                    >
                        Pide aquí
                    </Typography>
                </Link>
                <Link href="/conocenos" passHref>
                    <Typography
                        variant="h6"
                        sx={{
                            cursor: 'pointer',
                            marginRight: 50,
                            fontSize: '2rem',
                            fontWeight: 'bold' // Pone el texto en negrita
                        }}
                    >
                        Conócenos
                    </Typography>
                </Link>
            </Box>

            {/* Banners rotativos */}
            <Container>
                <Box sx={{ my: 2, position: 'relative', overflow: 'hidden', height: '300px' }}>
                    {banners.map((banner, i) => (
                        <Box
                            key={i}
                            sx={{
                                position: 'absolute',
                                top: 0,
                                left: `${(i - indexBanner) * 100}%`, // Posiciona las imágenes
                                width: '100%',
                                height: '100%',
                                transition: 'left 0.5s ease-in-out', // Transición suave
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center',
                            }}
                        >
                            <Image
                                src={banner}
                                alt={`Banner ${i}`}
                                layout="responsive"
                                width={500}
                                height={300}
                            />
                        </Box>
                    ))}
                </Box>
            </Container>

            {/* Barra de búsqueda y total justo debajo del banner */}
            <Box
                sx={{
                    backgroundColor: 'black',
                    color: 'white',
                    padding: 2,
                    position: 'sticky',
                    top: 0,
                    zIndex: 10,
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    width: '100%',
                }}
            >
                <Typography variant="h6">Total: {total.toLocaleString('es-CL')} CLP</Typography>
                <ShoppingCartIcon sx={{ color: 'white' }} />
            </Box>

            {/* Contenedor para la barra de búsqueda y categorías */}
            <Box
                sx={{
                    position: 'sticky',
                    top: 65,
                    zIndex: 10,
                    backgroundColor: 'white',
                    padding: 2,
                    boxShadow: '0 2px 5px rgba(0, 0, 0, 0.1)',
                    display: 'flex',
                    flexDirection: 'row',
                    justifyContent: 'flex-start',
                    alignItems: 'center',
                    maxWidth: '800px',
                    margin: '0 auto',
                }}
            >
                <BarraBusqueda
                    busquedaActiva={busquedaActiva}
                    setBusquedaActiva={setBusquedaActiva}
                    productoBusqueda={productoBusqueda}
                    setProductoBusqueda={setProductoBusqueda}
                    limpiarBusqueda={limpiarBusqueda}
                />

                {/* Espacio entre la barra de búsqueda y las categorías */}
                <Box sx={{ marginLeft: 2 }}>
                    <Box
                        sx={{
                            display: 'flex',
                            gap: 1, // Espaciado entre categorías
                        }}
                    >
                        {categorias.map((categoria) => (
                            <Typography
                                key={categoria}
                                onClick={() => scrollToCategoria(categoria)}
                                sx={{
                                    color: 'black',
                                    fontWeight: 'normal',
                                    cursor: 'pointer',
                                    '&:hover': { textDecoration: 'underline' }
                                }}
                            >
                                {categoria}
                            </Typography>
                        ))}
                    </Box>
                </Box>
            </Box>

            {/* Contenido del Menú */}
            <Container>
                <Typography variant="h3" gutterBottom sx={{ mt: 2 }}>Menú</Typography>

                {Object.keys(productosPorCategoria).map(categoria => (
                    <Box key={categoria} id={categoria} sx={{ mb: 4 }}>
                        <Typography 
                            variant="h4" 
                            gutterBottom 
                            sx={{
                                position: 'relative',
                                paddingBottom: '10px', // Espacio entre el texto y la línea
                                marginBottom: '20px', // Espacio después de la línea
                                '&::after': {
                                    content: '""',
                                    position: 'absolute',
                                    bottom: 0,
                                    left: 0,
                                    width: '100%',
                                    height: '2px', // Grosor de la línea
                                    backgroundColor: '#000000', // Color de la línea
                                    borderRadius: '1px' // Bordes suavizados
                                }
                            }}
                        >
                            {categoria}
                        </Typography>
                        <Box sx={{ 
                            display: 'grid', 
                            gridTemplateColumns: { 
                                xs: '1fr', 
                                sm: 'repeat(2, 1fr)', 
                                md: 'repeat(3, 1fr)' 
                            }, 
                            gap: 2 
                        }}>
                            {productosPorCategoria[categoria].map(producto => (
                                <ProductoCard
                                    key={producto._id}
                                    producto={producto}
                                    agregarAlCarrito={agregarAlCarrito}
                                />
                            ))}
                        </Box>
                    </Box>
                ))}
            </Container>
        </>
    );
};

export default Pedir;
