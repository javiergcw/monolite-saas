# Monolite SaaS SDK

SDK para interactuar con la API de Monolite SaaS.

## Instalación

```bash
npm install monolite-saas
# o
yarn add monolite-saas
```

## Configuración

Hay dos formas de configurar el SDK:

### 1. Configuración desde package.json (Recomendado)

Agrega la configuración en tu `package.json`:

```json
{
  "monolite": {
    "baseURL": "https://api.autoxpert.com.co",
    "licenseKey": "tu-licencia-aqui"
  }
}
```

### 2. Configuración programática

```typescript
import { configManager } from 'monolite-saas';

// Configurar la URL base
configManager.setBaseURL('https://api.autoxpert.com.co');

// Configurar la clave de licencia
configManager.setLicenseKey('tu-licencia-aqui');
```

## Uso básico

```typescript
import { bannersService } from 'monolite-saas';

async function obtenerBanners() {
  try {
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

## Servicios disponibles

### Banners

```typescript
import { bannersService } from 'monolite-saas';

// Obtener todos los banners
const banners = await bannersService.getBanners();
```

## Manejo de errores

El SDK incluye un sistema de notificaciones visual que mostrará automáticamente errores cuando:

- No se pueda leer la configuración del package.json
- La URL base o la licencia estén vacías
- Ocurran errores de red o del servidor

Además, puedes manejar los errores programáticamente:

```typescript
try {
  const banners = await bannersService.getBanners();
} catch (error) {
  if (error.message.includes('Error del servidor')) {
    // Manejar error del servidor (404, 500, etc.)
  } else if (error.message.includes('Error de red')) {
    // Manejar error de red o timeout
  }
}
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

## Características

- ✨ Configuración automática desde package.json
- 🚀 Sistema de notificaciones de errores integrado
- 💾 Caché automático de respuestas
- 🔄 Fallback a caché en caso de errores de red
- 📝 Tipado completo con TypeScript
- 🎨 Componentes estilizados con styled-components

## Requisitos

- React ≥ 18.0.0
- Next.js ≥ 13.0.0
- Node.js ≥ 14.0.0

## Licencia

ISC
