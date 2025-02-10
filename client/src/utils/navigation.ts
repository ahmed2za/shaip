import { NextRouter } from 'next/router';

export const navigateTo = async (
  path: string,
  router: NextRouter,
  options: { shallow?: boolean; replace?: boolean } = {}
) => {
  try {
    const method = options.replace ? router.replace : router.push;
    await method(path, undefined, { shallow: options.shallow });
    return true;
  } catch (error) {
    console.error('Navigation error:', error);
    return false;
  }
};

export const handleNavigation = async (
  event: React.MouseEvent,
  path: string,
  router: NextRouter,
  options: { shallow?: boolean; replace?: boolean } = {}
) => {
  if (event) {
    event.preventDefault();
  }
  return navigateTo(path, router, options);
};

// Pre-fetch common routes
export const prefetchCommonRoutes = (router: NextRouter) => {
  const commonRoutes = [
    '/',
    '/companies',
    '/about',
    '/contact',
    '/login',
    '/auth/register',
  ];

  commonRoutes.forEach(route => {
    router.prefetch(route);
  });
};
