import axios from 'axios';
import { getConfig } from '../config';

// nueva función para obtener los banners
export async function getBanners() {
  const { baseURL, licenseKey } = getConfig();

  const response = await axios.get(`${baseURL}/banners/`, {
    headers: {
      'X-License-Key': licenseKey
    }
  });

  return response.data;
}
