import { BrowserRouter as Router, Routes, Route, Link, useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';

// Componente que carga y muestra los libros de una categoría
function ListaLibros() {
  const { genre } = useParams();
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const controller = new AbortController();
    
    setLoading(true);
    setError(null);

    // Hacemos la petición a nuestra API simulada
    fetch(`/api/books?genre=${encodeURIComponent(genre)}`, { signal: controller.signal })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Error ${response.status}: No pudimos cargar los libros de esta categoría.`);
        }
        return response.json();
      })
      .then((data) => {
        setBooks(data);
        setLoading(false);
      })
      .catch((err) => {
        if (err.name === 'AbortError') return; // Ignorar si se canceló por cambio rápido de pestaña
        setError(err.message);
        setLoading(false);
      });

    return () => controller.abort(); 
  }, [genre]);

  // Manejo de estado de carga
  if (loading) return <div>⏳ Cargando libros de {genre}...</div>;
  
  // Manejo de errores
  if (error) return (
    <div style={{ color: '#d32f2f', padding: '10px', border: '1px solid #d32f2f', borderRadius: '5px' }}>
      <p>❌ {error}</p>
      <button onClick={() => window.location.reload()}>Reintentar</button>
    </div>
  );

  // Renderizado exitoso
  return (
    <div>
      <h2>Categoría: {genre}</h2>
      {books.length === 0 ? (
        <p>No hay libros disponibles en esta categoría.</p>
      ) : (
        <ul>
          {books.map((book) => (
            <li key={book.id} style={{ marginBottom: '10px' }}>
              <strong>{book.title}</strong> por {book.author} <br/> 
              <span style={{ color: 'green' }}>{book.price}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

// Componente Principal de la App con la barra de navegación
export default function App() {
  return (
    <Router>
      <div style={{ padding: '20px', maxWidth: '600px', margin: '0 auto', fontFamily: 'system-ui' }}>
        <header>
          <h1>📚 Mi Tienda de Libros</h1>
          <nav style={{ display: 'flex', gap: '15px', marginBottom: '30px', flexWrap: 'wrap' }}>
            <Link to="/Ficcion">Ficción</Link>
            <Link to="/CienciaFiccion">Ciencia Ficción</Link>
            <Link to="/Drama">Drama (Vacío)</Link>
            <Link to="/Terror">Terror (Error 404)</Link>
          </nav>
        </header>
        
        <main>
          <Routes>
            <Route path="/" element={<p>👆 Selecciona una categoría arriba para comenzar.</p>} />
            <Route path="/:genre" element={<ListaLibros />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}
