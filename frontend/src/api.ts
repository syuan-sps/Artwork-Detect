import axios from 'axios';
import { GalleryResult } from './types';

export async function fetchGalleryProfile(query: string): Promise<GalleryResult> {
  const response = await axios.post('/api/profile', { query });
  return response.data;
}

export async function fetchGalleryList(): Promise<{ name: string; url: string }[]> {
  const response = await axios.get('/api/galleries');
  return response.data;
}
