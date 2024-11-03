// pages/index.js
import { useEffect } from 'react';
import { useRouter } from 'next/router';

export default function Home() {
    const router = useRouter();

    useEffect(() => {
        router.replace('/pedir'); // Redirige a /pedir
    }, [router]);

    return null; // No muestra contenido en la raíz
}
