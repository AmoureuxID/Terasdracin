const API_BASE = 'https://api.sansekai.my.id/api';

export interface Drama {
  bookId: string;
  title?: string;
  name?: string;
  cover?: string;
  coverVertical?: string;
  coverHorizontal?: string;
  posterUrl?: string;
  introduction?: string;
  description?: string;
  score?: number;
  episodeCount?: number;
  totalEpisodes?: number;
  tags?: string[];
  category?: string[];
}

export interface Episode {
  episodeId?: string;
  chapterId?: string;
  title?: string;
  episodeIndex?: number;
  episodeNumber?: number;
  streamUrl?: string;
  definition?: Array<{ url: string; definition: string }>;
}

export interface DramaDetail extends Drama {
  episodes?: Episode[];
  director?: string;
  actors?: string[];
}

// Helper function to handle API responses
async function fetchAPI(endpoint: string) {
  const response = await fetch(`${API_BASE}${endpoint}`);
  if (!response.ok) {
    throw new Error(`API Error: ${response.statusText}`);
  }
  return response.json();
}

export const dramaboxAPI = {
  trending: () => fetchAPI('/dramabox/trending'),
  latest: () => fetchAPI('/dramabox/latest'),
  forYou: (page = 1) => fetchAPI(`/dramabox/foryou?page=${page}`),
  dubIndo: (classify = 'terpopuler', page = 1) => 
    fetchAPI(`/dramabox/dubindo?classify=${classify}&page=${page}`),
  detail: (bookId: string) => fetchAPI(`/dramabox/detail?bookId=${bookId}`),
  allEpisodes: (bookId: string) => fetchAPI(`/dramabox/allepisode?bookId=${bookId}`),
  search: (query: string) => fetchAPI(`/dramabox/search?query=${encodeURIComponent(query)}`),
};
