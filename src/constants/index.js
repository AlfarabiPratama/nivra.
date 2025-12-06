// Lo-Fi Design Tokens from manifesto
// Note: This file is safe to commit - no sensitive data
// If you need API keys or secrets, use environment variables with VITE_ prefix
export const THEMES = {
  dark: {
    bg: '#1c1b19', // Arang Hangat (Warm Charcoal)
    card: '#232220',
    border: '#3e3b36',
    textMain: '#e0d8cc', // Putih Gading (Ivory White)
    textMuted: '#8a847a',
    accent: '#7f9e96', // Sage Green Pudar
    noiseOpacity: 0.04
  },
  light: {
    bg: '#e8e4dc', // Kertas Tua (Old Paper)
    card: '#f2efe9',
    border: '#d1cdc5',
    textMain: '#2c2b29', // Tinta Pudar (Faded Ink)
    textMuted: '#78756e',
    accent: '#5c7c74', // Darker Sage
    noiseOpacity: 0.06
  }
};

// Mock Data
export const MOCK_USER = { 
  name: "Alex", 
  motto: "Perlahan tapi pasti." 
};

export const INITIAL_BOOKS = [
  { 
    id: 1, 
    title: "Atomic Habits", 
    author: "James Clear", 
    cover: "https://m.media-amazon.com/images/I/81wgcld4wxL._AC_UF1000,1000_QL80_.jpg", 
    progress: 120, 
    total: 320, 
    status: "reading", 
    color: "#8da399" 
  },
  { 
    id: 2, 
    title: "Sapiens", 
    author: "Yuval Noah Harari", 
    cover: "https://m.media-amazon.com/images/I/713jIoMO3UL._AC_UF1000,1000_QL80_.jpg", 
    progress: 350, 
    total: 450, 
    status: "reading", 
    color: "#8FA6CB" 
  },
  { 
    id: 4, 
    title: "Filosofi Teras", 
    author: "Henry Manampiring", 
    cover: "https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1551952937i/44803839.jpg", 
    status: "finished", 
    rating: 5, 
    finishedDate: "10/10/23" 
  },
];
