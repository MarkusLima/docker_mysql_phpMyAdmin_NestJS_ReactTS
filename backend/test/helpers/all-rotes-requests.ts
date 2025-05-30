function getAllRoutes(app): string[] {
  const router = app.getHttpAdapter().getInstance().router;
  const routes: string[] = [];

  router.stack.forEach((middleware) => {
    if (middleware.route) {
      const path = middleware.route.path;
      const methods = Object.keys(middleware.route.methods)
        .filter(m => middleware.route.methods[m])
        .map(m => m.toUpperCase());
      
      methods.forEach(method => {
        const urlReplace = path.replaceAll('/', '_').replace(':id', 'id');
        routes.push(`${method}${urlReplace}`);
      });
    }
  });

  return routes;
}

export { getAllRoutes };