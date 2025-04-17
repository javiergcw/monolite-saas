# Monolite SaaS SDK

SDK para interactuar con la API de Monolite SaaS.

## Instalación

```bash
npm install monolite-saas
# o
yarn add monolite-saas
```

## Uso básico

```typescript
import { configManager, bannersService } from 'monolite-saas';

async function obtenerBanners() {
  try {
    // Configurar la API
    configManager.setBaseURL('https://api.autoxpert.com.co');
    configManager.setLicenseKey('tu-licencia-aqui');

    // Obtener los banners
    const banners = await bannersService.getBanners();
    
    // Usar los datos
    banners.forEach(banner => {
      console.log('Banner:', {
        id: banner.id,
        title: banner.title,
        subtitle: banner.subtitle,
        webUrl: banner.web_banner_url,
        mobileUrl: banner.mobile_banner_url
      });
    });

  } catch (error) {
    console.error('Error:', error.message);
  }
}
```

## Configuración

### Configuración de la API

```typescript
import { configManager } from 'monolite-saas';

// Configurar la URL base
configManager.setBaseURL('https://api.autoxpert.com.co');

// Configurar la clave de licencia
configManager.setLicenseKey('tu-licencia-aqui');
```

## Servicios disponibles

### Banners

```typescript
import { bannersService } from 'monolite-saas';

// Obtener todos los banners
const banners = await bannersService.getBanners();
```

## Tipos

```typescript
import type { Banner } from 'monolite-saas';

// Interfaz Banner
interface Banner {
  id: number;
  title: string;
  subtitle: string;
  web_banner_url: string;
  mobile_banner_url: string;
  popup_banner_url?: string;
  redirect_url: string;
  start_date: string;
  end_date: string;
  active: boolean;
  zone_code: string;
}
```

## Manejo de errores

El SDK maneja diferentes tipos de errores:

- Errores de red
- Errores del servidor (404, 500, etc.)
- Errores de autenticación

```typescript
try {
  const banners = await bannersService.getBanners();
} catch (error) {
  if (error.message.includes('Error del servidor')) {
    // Manejar error del servidor
  } else if (error.message.includes('Error de red')) {
    // Manejar error de red
  }
}
```
