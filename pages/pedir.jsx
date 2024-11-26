import React, { useEffect, useState, useMemo, useRef } from 'react';
import { Box, Typography, Container, TextField, IconButton, Divider, Badge, Button, Menu, MenuItem } from '@mui/material';
import Image from 'next/image';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import bannerImage from '../public/imagenes/logo.png';
import bannerImage2 from '../public/imagenes/logo2.png';
import segundoBannerImage from '../public/imagenes/publicidad1.png';
import tercerBannerImage from '../public/imagenes/publicidad2.png';
import ProductoCard from '../components/pedir/ProductoCard';
import BarraBusqueda from '../components/pedir/BarraBusqueda';
import Link from 'next/link'; // Importa Link para la navegación
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import SearchIcon from '@mui/icons-material/Search';
import ClickAwayListener from '@mui/material/ClickAwayListener';
import Carrito from '../components/pedir/Carrito';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import LogoutIcon from '@mui/icons-material/Logout';
import Sesion from '../components/pedir/Sesion';

const Pedir = () => {
    const [productos, setProductos] = useState([]);
    const [busquedaActiva, setBusquedaActiva] = useState(false);
    const [productoBusqueda, setProductoBusqueda] = useState('');
    const [categorias, setCategorias] = useState([]);
    const [categoriaActual, setCategoriaActual] = useState('');
    const [indexBanner, setIndexBanner] = useState(0); // Estado para la imagen del banner
    const [direction, setDirection] = useState('right'); // Nuevo estado para la dirección
    const [slidePosition, setSlidePosition] = useState(0);
    const [searchTerm, setSearchTerm] = useState('');
    const [showSearch, setShowSearch] = useState(false);
    const searchRef = useRef(null);
    const [carrito, setCarrito] = useState([]); // Nuevo estado para los items del carrito
    const [showCarrito, setShowCarrito] = useState(false); // Estado para mostrar/ocultar el carrito
    const [usuario, setUsuario] = useState(null);
    const [anchorEl, setAnchorEl] = useState(null); // Nuevo estado para el menú

    // Calcular el total basado en el carrito
    const total = useMemo(() => {
        return carrito.reduce((sum, item) => sum + (item.precio * item.cantidad), 0);
    }, [carrito]);

    // Imágenes del banner
    const banners = [segundoBannerImage, tercerBannerImage]; // Añade más imágenes si es necesario

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
                
                // Filtrar solo productos en menú
                const productosEnMenu = data.filter(producto => producto.enMenu);
                
                // Obtener categorías solo de productos en menú
                const categoriasUnicas = [...new Set(
                    productosEnMenu
                        .map(producto => producto.categoria?.nombre)
                        .filter(Boolean)
                )];

                setProductos(data);
                setCategorias(categoriasUnicas);
            } catch (error) {
                console.error("Error al cargar productos:", error);
            }
        };

        fetchProductos();

        // Configurar un intervalo para actualizar los datos
        const intervalId = setInterval(fetchProductos, 5000); // Actualiza cada 5 segundos

        return () => clearInterval(intervalId); // Limpia el intervalo
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
        setCarrito(prevCarrito => {
            const itemExistente = prevCarrito.find(item => item._id === producto._id);
            
            if (itemExistente) {
                // Si el producto ya existe, incrementar cantidad
                return prevCarrito.map(item =>
                    item._id === producto._id
                        ? { ...item, cantidad: item.cantidad + 1 }
                        : item
                );
            }
            // Si es nuevo producto, agregarlo con cantidad 1
            return [...prevCarrito, { ...producto, cantidad: 1 }];
        });
    };

    const removerDelCarrito = (productoId) => {
        setCarrito(prevCarrito => {
            const itemExistente = prevCarrito.find(item => item._id === productoId);
            
            if (itemExistente.cantidad > 1) {
                return prevCarrito.map(item =>
                    item._id === productoId
                        ? { ...item, cantidad: item.cantidad - 1 }
                        : item
                );
            }
            return prevCarrito.filter(item => item._id !== productoId);
        });
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
        setIndexBanner((prevIndex) => (prevIndex - 1 + banners.length) % banners.length);
    };

    const handleNextBanner = () => {
        setIndexBanner((prevIndex) => (prevIndex + 1) % banners.length);
    };

    const handleSearchClick = () => {
        setShowSearch(true);
    };

    const handleClickAway = () => {
        if (!searchTerm) {  // Solo cierra si no hay texto
            setShowSearch(false);
        }
    };

    // Al inicio del componente, añade este useEffect para la rotación automática
    useEffect(() => {
        const timer = setInterval(() => {
            setIndexBanner((prevIndex) => (prevIndex + 1) % banners.length);
        }, 5000); // Cambia cada 5 segundos

        return () => clearInterval(timer); // Limpia el intervalo cuando el componente se desmonta
    }, []);

    const limpiarCarrito = () => {
        setCarrito([]);
    };

    useEffect(() => {
        // Verificar si hay un usuario en localStorage al cargar
        const usuarioGuardado = localStorage.getItem('usuario');
        if (usuarioGuardado) {
            setUsuario(JSON.parse(usuarioGuardado));
        }
    }, []);

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleLogout = () => {
        localStorage.removeItem('usuario'); // Eliminar usuario del localStorage
        handleClose(); // Cerrar el menú
        window.location.reload(); // Recargar la página
    };

    return (
        <Box sx={{ width: '100%' }}>
            {/* Barra negra superior */}
            <Box
                sx={{
                    position: 'sticky',
                    top: 0,
                    zIndex: 1000,
                    backgroundColor: 'black',
                    color: 'white',
                    padding: '8px 16px',
                    width: '100%',
                    minHeight: '80px',
                    display: 'flex',
                    alignItems: 'center'
                }}
            >
                {/* Contenedor principal en una sola fila */}
                <Box sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'flex-start',
                    width: '100%',
                    gap: 2
                }}>
                    {/* Logo y botones */}
                    <Box sx={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 2,
                        flex: '0 0 auto'
                    }}>
                        <Image
                            src={bannerImage2}
                            alt="Logo"
                            width={140}
                            height={119}
                            style={{
                                objectFit: 'contain',
                                width: '150px',
                                height: 'auto',
                                marginRight: '20px'
                            }}
                        />

                        {/* Botones condicionales */}
                        <Box sx={{
                            display: 'flex',
                            gap: 2,
                            alignItems: 'center'
                        }}>
                            <Sesion />
                            
                            <Link href="/conocenos" passHref>
                                <Box sx={{
                                    backgroundColor: 'white',
                                    color: 'black',
                                    padding: { xs: '4px 12px', sm: '8px 16px' },
                                    borderRadius: '20px',
                                    cursor: 'pointer',
                                    transition: 'all 0.3s ease',
                                    '&:hover': {
                                        transform: 'scale(1.05)',
                                        boxShadow: '0 0 10px rgba(255,255,255,0.3)'
                                    }
                                }}>
                                    <Typography sx={{
                                        fontSize: { xs: '0.8rem', sm: '0.9rem' },
                                        fontWeight: 'bold',
                                        whiteSpace: 'nowrap'
                                    }}>
                                        CONÓCENOS
                                    </Typography>
                                </Box>
                            </Link>
                        </Box>
                    </Box>

                    {/* Barra de búsqueda y categorías */}
                    <Box sx={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 2,
                        flex: '0 1 auto',
                        maxWidth: '1000px',
                        marginLeft: '300px'
                    }}>
                        {/* Barra de búsqueda */}
                        <ClickAwayListener onClickAway={handleClickAway}>
                            <Box
                                sx={{
                                    backgroundColor: 'white',
                                    borderRadius: '20px',
                                    padding: showSearch ? '8px 16px' : '4px 8px',
                                    width: showSearch ? '300px' : 'auto',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: showSearch ? 1.5 : 0.5,
                                    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                                    transition: 'all 0.3s ease-in-out',
                                    minWidth: showSearch ? '40px' : '35px',
                                    height: showSearch ? '45px' : '35px',
                                    marginRight: '9px'
                                }}
                            >
                                <SearchIcon 
                                    sx={{ 
                                        color: 'gray',
                                        cursor: 'pointer',
                                        fontSize: showSearch ? '1.5rem' : '1.3rem'
                                    }} 
                                    onClick={handleSearchClick}
                                />

                                {showSearch && (
                                    <TextField
                                        variant="standard"
                                        placeholder="Buscar productos..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        autoFocus
                                        InputProps={{
                                            disableUnderline: true,
                                        }}
                                        sx={{
                                            flex: 1,
                                            '& input': {
                                                padding: '4px 0',
                                                fontSize: '1rem'
                                            }
                                        }}
                                    />
                                )}
                            </Box>
                        </ClickAwayListener>

                        {/* Categorías */}
                        <Box 
                            sx={{ 
                                display: { xs: 'none', sm: 'flex' },
                                alignItems: 'center',
                                backgroundColor: 'white',
                                borderRadius: '20px',
                                padding: '8px 16px',
                                boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                                maxWidth: '500px',
                                position: 'relative',
                                width: '100%',
                                flex: 1
                            }}
                        >
                            {/* Contenedor con scroll */}
                            <Box
                                sx={{
                                    display: 'flex',
                                    gap: 2,
                                    alignItems: 'center',
                                    overflow: 'auto',
                                    whiteSpace: 'nowrap',
                                    scrollBehavior: 'smooth',
                                    msOverflowStyle: 'none',
                                    scrollbarWidth: 'none',
                                    '&::-webkit-scrollbar': {
                                        display: 'none'
                                    },
                                    width: '100%',
                                    position: 'relative',
                                    padding: '0 20px',
                                }}
                            >
                                {categorias.map((categoria) => (
                                    <Typography
                                        key={categoria}
                                        onClick={() => scrollToCategoria(categoria)}
                                        sx={{
                                            cursor: 'pointer',
                                            color: categoriaActual === categoria ? 'primary.main' : 'text.secondary',
                                            fontWeight: categoriaActual === categoria ? 'bold' : 'normal',
                                            fontSize: '0.9rem',
                                            padding: '4px 8px',
                                            borderRadius: '12px',
                                            transition: 'all 0.2s',
                                            position: 'relative',
                                            flex: '0 0 auto',
                                            '&:after': {
                                                content: '""',
                                                position: 'absolute',
                                                bottom: 0,
                                                left: '50%',
                                                width: categoriaActual === categoria ? '100%' : '0%',
                                                height: '2px',
                                                backgroundColor: 'primary.main',
                                                transition: 'all 0.3s ease',
                                                transform: 'translateX(-50%)',
                                            },
                                            '&:hover': {
                                                color: 'primary.main',
                                                backgroundColor: 'rgba(0,0,0,0.04)',
                                                '&:after': {
                                                    width: '100%'
                                                }
                                            }
                                        }}
                                    >
                                        {categoria}
                                    </Typography>
                                ))}
                            </Box>
                        </Box>
                    </Box>

                    {/* Total y carrito */}
                    <Box sx={{
                        marginLeft: 'auto',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 2,
                        flex: '0 0 auto',
                        backgroundColor: 'white',
                        color: 'black',
                        padding: '8px 16px',
                        borderRadius: '20px',
                        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                        cursor: 'pointer',
                        '&:hover': {
                            backgroundColor: '#f5f5f5'
                        }
                    }} onClick={() => setShowCarrito(!showCarrito)}>
                        <Typography sx={{
                            fontSize: { xs: '0.8rem', sm: '1rem' },
                            fontWeight: 'bold',
                            whiteSpace: 'nowrap'
                        }}>
                            {total.toLocaleString('es-CL')} CLP
                        </Typography>
                        <Badge badgeContent={carrito.length} color="primary">
                            <ShoppingCartIcon sx={{ 
                                fontSize: { xs: '1.2rem', sm: '1.5rem' },
                                color: 'black'
                            }} />
                        </Badge>
                    </Box>
                </Box>
            </Box>

            {/* Banners rotativos */}
            <Box 
                sx={{ 
                    width: '100%',
                    height: '700px',
                    position: 'relative',
                    overflow: 'hidden'
                }}
            >
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
                        />
                    </Box>
                ))}

                {/* Solo los botones de navegación del banner */}
                <Box
                    className="navigation-button"
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
                        opacity: 0,
                        transition: 'all 0.3s ease',
                        '&:hover': {
                            backgroundColor: 'rgba(0, 0, 0, 0.5)'
                        }
                    }}
                >
                    <ArrowBackIosNewIcon sx={{ color: 'white' }} />
                </Box>

                <Box
                    className="navigation-button"
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
                        opacity: 0,
                        transition: 'all 0.3s ease',
                        '&:hover': {
                            backgroundColor: 'rgba(0, 0, 0, 0.5)'
                        }
                    }}
                >
                    <ArrowForwardIosIcon sx={{ color: 'white' }} />
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
                        <Typography>+56 9 6666 6666</Typography>
                        <Typography>contacto@cafeteria.cl</Typography>
                    </Box>

                    <Box>
                        <Typography variant="h6" gutterBottom>
                            Ubicación
                        </Typography>
                        <Typography>Av.calle 123, Valparaíso</Typography>
                        <Typography>Valparaíso, Chile</Typography>
                    </Box>
                </Box>
            </Box>

            {/* Banner negro con botón */}
            <Box sx={{ 
                width: '100%',
                height: '80px',
                backgroundColor: 'black',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center'
            }}>
               
               
            </Box>

            {/* Reemplazar el carrito existente con el nuevo componente */}
            <Carrito 
                showCarrito={showCarrito}
                carrito={carrito}
                total={total}
                agregarAlCarrito={agregarAlCarrito}
                removerDelCarrito={removerDelCarrito}
                limpiarCarrito={limpiarCarrito}
            />
        </Box>
    );
};

export default Pedir;