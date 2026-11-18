const BASE_URL = 'https://webdev-music-003b5b991590.herokuapp.com';

export type Track = {
  _id: number;
  name: string;
  author: string;
  release_date: string;
  genre: string[];
  duration_in_seconds: number;
  album: string;
  logo: {
    type: string;
    data: number[];
  } | null;
  track_file: string;
  staredUser: number[];
};

export type TracksResponse = {
  success: boolean;
  data: Track[];
};

export type Collection = {
  _id: number;
  name?: string;
  items: number[];
  owner: number[];
  __v?: number;
};

export type CollectionsResponse = {
  success: boolean;
  data: Collection[];
};

export type CollectionResponse = {
  success: boolean;
  data: Collection;
};

export type User = {
  _id: number;
  username: string;
  email: string;
};

export type Tokens = {
  access: string;
  refresh: string;
};

// Обновление access-токена
export async function refreshToken(
  refresh: string,
): Promise<{ access: string }> {
  return request('/user/token/refresh/', {
    method: 'POST',
    body: JSON.stringify({ refresh }),
  });
}

// Повтор авторизованного запроса при ошибке 401
async function withReAuth(
  makeRequest: (accessToken: string) => Promise<Response>,
): Promise<Response> {
  const access = localStorage.getItem('access');

  if (!access) {
    throw new Error('Пользователь не авторизован');
  }

  let response = await makeRequest(access);

  if (response.status !== 401) {
    return response;
  }

  const refresh = localStorage.getItem('refresh');

  if (!refresh) {
    throw new Error('Отсутствует refresh-токен');
  }

  try {
    const tokens = await refreshToken(refresh);

    localStorage.setItem('access', tokens.access);

    response = await makeRequest(tokens.access);

    if (response.status === 401) {
      throw new Error('Не удалось выполнить авторизованный запрос');
    }

    return response;
  } catch (error) {
    localStorage.removeItem('access');
    localStorage.removeItem('refresh');
    localStorage.removeItem('user');

    throw error;
  }
}

// Основная функция запросов
async function request<T>(
  endpoint: string,
  options: RequestInit = {},
  withAuth = false,
): Promise<T> {
  const makeRequest = (accessToken?: string) => {
    const headers = new Headers(options.headers);

    headers.set('Content-Type', 'application/json');

    if (accessToken) {
      headers.set('Authorization', `Bearer ${accessToken}`);
    }

    return fetch(`${BASE_URL}${endpoint}`, {
      ...options,
      headers,
    });
  };

  const response = withAuth
    ? await withReAuth(makeRequest)
    : await makeRequest();

  if (!response.ok) {
    const errorData = await response.json().catch(() => null);

    throw new Error(
      errorData?.message ||
        errorData?.detail ||
        'Произошла ошибка при обращении к серверу',
    );
  }

  return response.json() as Promise<T>;
}

// Получение всех треков
export async function getTracks(): Promise<Track[]> {
  const response = await request<TracksResponse>('/catalog/track/all/');

  return response.data;
}

// Получение одного трека
export function getTrack(id: number): Promise<Track> {
  return request<Track>(`/catalog/track/${id}/`);
}

// Регистрация пользователя
export function registerUser(
  email: string,
  password: string,
  username: string,
): Promise<{ message: string; result: User; success: boolean }> {
  return request('/user/signup/', {
    method: 'POST',
    body: JSON.stringify({ email, password, username }),
  });
}

// Авторизация пользователя
export function loginUser(email: string, password: string): Promise<User> {
  return request('/user/login/', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });
}

// Получение токенов
export function getTokens(email: string, password: string): Promise<Tokens> {
  return request('/user/token/', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });
}

// Получение всех подборок
export async function getCollections(): Promise<Collection[]> {
  const response = await request<CollectionsResponse>('/catalog/selection/all');

  return response.data;
}

// Получение одной подборки
export async function getCollection(id: number): Promise<Collection> {
  const response = await request<CollectionResponse>(
    `/catalog/selection/${id}/`,
  );

  return response.data;
}

// Получение треков конкретной подборки
export async function getCollectionTracks(id: number): Promise<Track[]> {
  const collection = await getCollection(id);
  const tracks = await getTracks();

  return collection.items
    .map((trackId) => tracks.find((track) => track._id === trackId))
    .filter((track): track is Track => track !== undefined);
}

// Получение избранных треков
export async function getFavoriteTracks(): Promise<Track[]> {
  const response = await request<TracksResponse>(
    '/catalog/track/favorite/all/',
    {},
    true,
  );

  return response.data;
}

// Добавление трека в избранное
export function addTrackToFavorite(id: number): Promise<unknown> {
  return request(`/catalog/track/${id}/favorite/`, { method: 'POST' }, true);
}

// Удаление трека из избранного
export function removeTrackFromFavorite(id: number): Promise<unknown> {
  return request(`/catalog/track/${id}/favorite/`, { method: 'DELETE' }, true);
}
