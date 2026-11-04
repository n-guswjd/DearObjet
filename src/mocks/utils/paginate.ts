export const paginate = <T>(items: T[], page: number, size: number) => {
  const totalPages = Math.max(1, Math.ceil(items.length / size));
  const start = (page - 1) * size;

  return {
    items: items.slice(start, start + size),
    page,
    totalPages,
  };
};
