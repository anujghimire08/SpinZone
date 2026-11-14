export const matchesRoute = (pathname: string, route: string) => {
  const basePath = route.endsWith("/*") ? route.slice(0, -2) : route;

  return pathname === basePath || pathname.startsWith(`${basePath}/`);
};
