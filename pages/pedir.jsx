import React, { useEffect, useState, useMemo, useRef } from 'react';
import { Box, Typography, Container, TextField, IconButton } from '@mui/material';
import Image from 'next/image';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import bannerImage from '../public/imagenes/logo.png';
import segundoBannerImage from '../public/imagenes/publicidad1.png';
import tercerBannerImage from '../public/imagenes/publicidad2.png';
import ProductoCard from '../components/pedir/ProductoCard';
import BarraBusqueda from '../components/pedir/BarraBusqueda';
import Link from 'next/link'; // Importa Link para la navegación
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import SearchIcon from '@mui/icons-material/Search';
import ClickAwayListener from '@mui/material/ClickAwayListener';

const Pedir = () => {
    const [productos, setProductos] = useState([]);
    const [busquedaActiva, setBusquedaActiva] = useState(false);
    const [productoBusqueda, setProductoBusqueda] = useState('');
    const [total, setTotal] = useState(0);
    const [categorias, setCategorias] = useState([]);
    const [categoriaActual, setCategoriaActual] = useState('');
    const [indexBanner, setIndexBanner] = useState(0); // Estado para la imagen del banner
    const [direction, setDirection] = useState('right'); // Nuevo estado para la dirección
    const [slidePosition, setSlidePosition] = useState(0);
    const [searchTerm, setSearchTerm] = useState('');
    const [showSearch, setShowSearch] = useState(false);
    const searchRef = useRef(null);

    // Imágenes del banner
    const banners = [tercerBannerImage, segundoBannerImage]; // Añade más imágenes si es necesario

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

    // Función para normalizar texto (quitar acentos y convertir a minúsculas)
    const normalizeText = (text) => {
        return text.normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "")
            .toLowerCase();
    };

    // Función para filtrar productos
    const filteredProducts = useMemo(() => {
        if (!searchTerm) return productosPorCategoria;

        const normalized = normalizeText(searchTerm);
        const filtered = {};

        Object.entries(productosPorCategoria).forEach(([categoria, productos]) => {
            const matchingProducts = productos.filter(producto => 
                normalizeText(producto.nombre).includes(normalized)
            );
            if (matchingProducts.length > 0) {
                filtered[categoria] = matchingProducts;
            }
        });

        return filtered;
    }, [searchTerm, productosPorCategoria]);

    // Primer useEffect para cargar productos
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
            setDirection('right'); // Establece la dirección por defecto
            setIndexBanner(prevIndex => (prevIndex + 1) % banners.length);
        }, 4000); // Cambia el tiempo según sea necesario

        return () => clearInterval(interval); // Limpia el intervalo
    }, []);

    // Segundo useEffect para el observer de categorías
    useEffect(() => {
        if (!productos.length) return;

        const observerOptions = {
            root: null,
            rootMargin: '-20% 0px -50% 0px', // Ajustado para mejor cobertura
            threshold: [0, 0.25, 0.5, 0.75, 1] // Más puntos de detección
        };

        const handleScroll = () => {
            // Obtener todas las secciones de categoría
            const sections = Object.keys(productosPorCategoria).map(categoria => 
                document.getElementById(categoria)
            ).filter(Boolean);

            // Si no hay secciones, salir
            if (sections.length === 0) return;

            // Obtener la posición actual del scroll
            const scrollPosition = window.scrollY + window.innerHeight * 0.3; // 30% de la ventana

            // Encontrar la sección actual
            let currentSection = sections[0];
            for (const section of sections) {
                if (section.offsetTop <= scrollPosition) {
                    currentSection = section;
                } else {
                    break;
                }
            }

            // Verificar si estamos cerca del final de la página
            const isNearBottom = window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 100;
            
            if (isNearBottom) {
                // Si estamos cerca del final, seleccionar la última categoría
                setCategoriaActual(sections[sections.length - 1].id);
            } else {
                // Si no, seleccionar la categoría actual
                setCategoriaActual(currentSection.id);
            }
        };

        // Agregar event listener para el scroll
        window.addEventListener('scroll', handleScroll);
        // Ejecutar una vez al montar para establecer la categoría inicial
        handleScroll();

        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, [productos, productosPorCategoria]);

    const agregarAlCarrito = (producto) => {
        setTotal(prevTotal => prevTotal + producto.precio);
    };

    const limpiarBusqueda = () => {
        setProductoBusqueda('');
        setBusquedaActiva(false);
    };

    const scrollToCategoria = (categoria) => {
        const categoriaElement = document.getElementById(categoria);
        if (categoriaElement) {
            categoriaElement.scrollIntoView({ behavior: 'smooth' });
            setCategoriaActual(categoria);
        }
    };

    const handlePrevBanner = () => {
        setSlidePosition(prev => prev + 100);
        setIndexBanner(prevIndex => {
            const newIndex = prevIndex === 0 ? banners.length - 1 : prevIndex - 1;
            setTimeout(() => {
                setSlidePosition(-(newIndex * 100));
            }, 0);
            return newIndex;
        });
    };

    const handleNextBanner = () => {
        setSlidePosition(prev => prev - 100);
        setIndexBanner(prevIndex => {
            const newIndex = (prevIndex + 1) % banners.length;
            if (newIndex === 0) {
                setSlidePosition(-(banners.length - 1) * 100);
            }
            return newIndex;
        });
    };

    // Función para manejar el cierre del buscador
    const handleClickAway = () => {
        if (showSearch && !searchTerm) {
            setShowSearch(false);
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
            <Box sx={{ 
                mt: -2,
                mb: 2,
                display: 'flex', 
                justifyContent: 'center',
                gap: '100px',
                width: '100%',
                maxWidth: '800px',
                margin: '0 auto',
                position: 'relative',
                zIndex: 1
            }}>
                <Link href="/pedir" passHref>
                    <Typography
                        variant="h6"
                        sx={{
                            cursor: 'pointer',
                            fontSize: '2rem',
                            fontWeight: 'bold',
                            position: 'relative',
                            paddingBottom: '10px',
                            '&::after': {
                                content: '""',
                                position: 'absolute',
                                bottom: '5px',
                                left: 0,
                                width: '100%',
                                height: '3px',
                                backgroundColor: '#000',
                                borderRadius: '2px',
                                display: 'block'
                            }
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
                            fontSize: '2rem',
                            fontWeight: 'bold'
                        }}
                    >
                        Conócenos
                    </Typography>
                </Link>
            </Box>

            {/* Banners rotativos */}
            <Box 
                sx={{ 
                    position: 'relative',
                    width: '100vw',
                    height: '700px',
                    overflow: 'hidden',
                    left: '50%',
                    right: '50%',
                    marginLeft: '-50vw',
                    marginRight: '-50vw',
                    backgroundColor: '#000',
                    marginBottom: '30px',
                    '&:hover .navigation-button': { // Muestra los botones al hacer hover
                        opacity: 1,
                    }
                }}
            >
                {/* Botón Anterior */}
                <Box
                    className="navigation-button" // Clase para el hover
                    onClick={handlePrevBanner}
                    sx={{
                        position: 'absolute',
                        left: 0,
                        top: '50%',
                        transform: 'translateY(-50%)',
                        zIndex: 2,
                        backgroundColor: 'rgba(0, 0, 0, 0.3)',
                        borderRadius: '0 4px 4px 0',
                        padding: '20px 10px',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        opacity: 0, // Inicialmente oculto
                        transition: 'all 0.3s ease', // Transición suave
                        '&:hover': {
                            backgroundColor: 'rgba(0, 0, 0, 0.5)'
                        }
                    }}
                >
                    <ArrowBackIosNewIcon sx={{ color: 'white' }} />
                </Box>

                {/* Botón Siguiente */}
                <Box
                    className="navigation-button" // Clase para el hover
                    onClick={handleNextBanner}
                    sx={{
                        position: 'absolute',
                        right: 0,
                        top: '50%',
                        transform: 'translateY(-50%)',
                        zIndex: 2,
                        backgroundColor: 'rgba(0, 0, 0, 0.3)',
                        borderRadius: '4px 0 0 4px',
                        padding: '20px 10px',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        opacity: 0, // Inicialmente oculto
                        transition: 'all 0.3s ease', // Transición suave
                        '&:hover': {
                            backgroundColor: 'rgba(0, 0, 0, 0.5)'
                        }
                    }}
                >
                    <ArrowForwardIosIcon sx={{ color: 'white' }} />
                </Box>

                {/* Banners */}
                {banners.map((banner, i) => (
                    <Box
                        key={i}
                        sx={{
                            position: 'absolute',
                            top: 0,
                            left: `${(i - indexBanner) * 100}%`,
                            width: '100%',
                            height: '100%',
                            transition: 'left 0.5s ease-in-out',
                        }}
                    >
                        <Image
                            src={banner}
                            alt={`Banner ${i}`}
                            layout="fill"
                            objectFit="cover"
                            quality={100}
                            priority={i === 0}
                            style={{
                                width: '100%',
                                height: '100%',
                            }}
                        />
                    </Box>
                ))}
            </Box>

            {/* Barra de búsqueda y total con categorías integradas */}
            <Box
                sx={{
                    position: 'sticky',
                    top: 0,
                    zIndex: 10,
                    backgroundColor: 'black',
                    color: 'white',
                    padding: '8px 16px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 2,
                    height: '80px', // Aumentamos la altura del banner negro
                }}
            >
                {/* Total y carrito arriba a la derecha */}
                <Box sx={{ 
                    display: 'flex', 
                    justifyContent: 'flex-end', 
                    alignItems: 'center', 
                    gap: 2 
                }}>
                    <Typography variant="h6">
                        Total: {total.toLocaleString('es-CL')} CLP
                    </Typography>
                    <ShoppingCartIcon sx={{ color: 'white' }} />
                </Box>

                {/* Barra de búsqueda centrada */}
                <Box sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    width: '100%',
                    marginTop: '-35px', // Aumentamos el margen negativo para subir más la barra
                    position: 'relative', // Añadido para mejor control del posicionamiento
                }}>
                    <Box
                        sx={{
                            backgroundColor: 'white',
                            borderRadius: '20px',
                            padding: '4px 16px',
                            maxWidth: '60%',
                            display: 'flex',
                            alignItems: 'center',
                            gap: 2,
                        }}
                    >
                        {/* Categorías */}
                        <Box
                            sx={{
                                display: 'flex',
                                overflowX: 'auto',
                                '&::-webkit-scrollbar': { height: '4px' },
                                '&::-webkit-scrollbar-track': { background: '#f0f0f0' },
                                '&::-webkit-scrollbar-thumb': { background: '#888', borderRadius: '4px' },
                                paddingBottom: '8px', // Añadimos padding inferior
                            }}
                        >
                            {categorias.map((categoria) => (
                                <Typography
                                    key={categoria}
                                    onClick={() => scrollToCategoria(categoria)}
                                    sx={{
                                        color: categoriaActual === categoria ? '#0d47a1' : 'black',
                                        fontWeight: categoriaActual === categoria ? 'bold' : 'normal',
                                        cursor: 'pointer',
                                        padding: '4px 20px',
                                        margin: '0 2px',
                                        borderRadius: '15px',
                                        transition: 'all 0.3s ease',
                                        position: 'relative',
                                        whiteSpace: 'nowrap',
                                        fontSize: '0.95rem',
                                        letterSpacing: '0.5px',
                                        '&::after': {
                                            content: '""',
                                            position: 'absolute',
                                            bottom: 0,
                                            left: 0,
                                            width: '100%',
                                            height: '2px',
                                            backgroundColor: '#0d47a1',
                                            transform: categoriaActual === categoria ? 'scaleX(1)' : 'scaleX(0)',
                                            transition: 'transform 0.3s ease',
                                        },
                                        '&:hover': {
                                            color: '#0d47a1',
                                            backgroundColor: 'rgba(13, 71, 161, 0.08)',
                                            '&::after': {
                                                transform: 'scaleX(1)',
                                            }
                                        }
                                    }}
                                >
                                    {categoria}
                                </Typography>
                            ))}
                        </Box>

                        {/* Buscador con ClickAwayListener */}
                        <ClickAwayListener onClickAway={handleClickAway}>
                            <Box sx={{ 
                                display: 'flex', 
                                alignItems: 'center',
                                minWidth: showSearch ? '150px' : 'auto',
                                transition: 'all 0.3s ease',
                            }}>
                                {showSearch ? (
                                    <TextField
                                        size="small"
                                        placeholder="Buscar..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        autoFocus
                                        ref={searchRef}
                                        sx={{
                                            '& .MuiOutlinedInput-root': {
                                                borderRadius: '20px',
                                                height: '32px',
                                                backgroundColor: 'white',
                                            },
                                            '& .MuiOutlinedInput-input': {
                                                padding: '4px 12px',
                                            }
                                        }}
                                    />
                                ) : (
                                    <IconButton 
                                        onClick={() => setShowSearch(true)}
                                        sx={{ 
                                            color: 'black',
                                            padding: '4px',
                                        }}
                                    >
                                        <SearchIcon />
                                    </IconButton>
                                )}
                            </Box>
                        </ClickAwayListener>
                    </Box>
                </Box>
            </Box>

            {/* Contenido del Menú */}
            <Container>
                <Typography variant="h3" gutterBottom sx={{ mt: 2 }}>Menú</Typography>

                {Object.keys(filteredProducts).map((categoria) => (
                    <Box 
                        key={categoria} 
                        id={categoria} 
                        sx={{ mb: 4 }}
                    >
                        <Typography 
                            variant="h4" 
                            gutterBottom
                            sx={{
                                position: 'relative',
                                paddingBottom: '10px',
                                marginBottom: '20px',
                                '&::after': {
                                    content: '""',
                                    position: 'absolute',
                                    bottom: 0,
                                    left: 0,
                                    width: '100%',
                                    height: '2px',
                                    backgroundColor: 'black',
                                    borderRadius: '1px'
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
                            {filteredProducts[categoria].map(producto => (
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

            {/* Banner negro inferior */}
            <Box
                sx={{
                    backgroundColor: 'black',
                    color: 'white',
                    width: '100%',
                    padding: '40px 0',
                    marginTop: '50px', // Espacio antes del banner
                    textAlign: 'center',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: 3,
                }}
            >
                <Box
                    sx={{
                        display: 'flex',
                        justifyContent: 'center',
                        gap: 8,
                        flexWrap: 'wrap',
                        maxWidth: '1200px',
                        margin: '0 auto',
                        padding: '0 20px',
                    }}
                >
                    <Box>
                        <Typography variant="h6" gutterBottom>
                            Contacto
                        </Typography>
                        <Typography>+56 9 1234 5678</Typography>
                        <Typography>contacto@cafeteria.cl</Typography>
                    </Box>

                    <Box>
                        <Typography variant="h6" gutterBottom>
                            Ubicación
                        </Typography>
                        <Typography>Av. Principal 123</Typography>
                        <Typography>Santiago, Chile</Typography>
                    </Box>
                </Box>
            </Box>
        </>
    );
};

export default Pedir;
