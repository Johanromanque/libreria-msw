import { http, HttpResponse, delay } from 'msw';

const booksByGenre = {
  'Ficcion': [
    { id: 1, title: 'Cien Años de Soledad', author: 'Gabriel García Márquez', price: '$12.99' },
    { id: 2, title: '1984', author: 'George Orwell', price: '$13.99' }
  ],
  'CienciaFiccion': [
    { id: 3, title: 'Dune', author: 'Frank Herbert', price: '$15.99' },
    { id: 4, title: 'Neuromante', author: 'William Gibson', price: '$12.99' }
  ],
  'Drama': [] // Categoría vacía para probar
};

export const handlers = [
  http.get('/api/books', async (req) => {
    const url = new URL(req.request.url);
    const genre = url.searchParams.get("genre");

    await delay(1000); // Simula el retraso de internet

    const books = booksByGenre[genre];

    if (!books) {
      return HttpResponse.json(
        { message: `No se encontraron libros para la categoría "${genre}"` }, 
        { status: 404 }
      );
    }

    return HttpResponse.json(books);
  })
];
