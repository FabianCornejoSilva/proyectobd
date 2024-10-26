import React from 'react';
import Link from 'next/link';
import styles from './Main.module.css'; // Para estilos opcionales

const Main = ({ children }) => {
  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1>Cafetería</h1>
        <nav>
          <ul>
            <li><Link href="/">Inicio</Link></li>
            <li><Link href="/menu">Menú</Link></li>
            <li><Link href="/contact">Contacto</Link></li>
            <li><Link href="/prueba">Prueba</Link></li>
          </ul>
        </nav>
      </header>
      <main>{children}</main>
      <footer className={styles.footer}>
        <p>&copy; {new Date().getFullYear()} Cafetería. Todos los derechos reservados.</p>
      </footer>
    </div>
  );
};

export default Main;
