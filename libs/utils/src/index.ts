export function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: ReturnType<typeof setTimeout> | null = null;

  return function executedFunction(...args: Parameters<T>) {
    const later = () => {
      timeout = null;
      func(...args);
    };

    if (timeout) {
      clearTimeout(timeout);
    }
    timeout = setTimeout(later, wait);
  };
}

export function calculatePagination(
  total: number,
  page: number,
  limit: number
): {
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
  startIndex: number;
  endIndex: number;
} {
  const totalPages = Math.ceil(total / limit);
  const hasNext = page < totalPages;
  const hasPrev = page > 1;
  const startIndex = (page - 1) * limit;
  const endIndex = Math.min(startIndex + limit, total);

  return {
    totalPages,
    hasNext,
    hasPrev,
    startIndex,
    endIndex,
  };
}

export function filterPosts<T extends { title: string; body: string; userId?: number }>(
  posts: T[],
  search?: string,
  userId?: number
): T[] {
  return posts.filter((post) => {
    const matchesSearch =
      !search ||
      post.title.toLowerCase().includes(search.toLowerCase()) ||
      post.body.toLowerCase().includes(search.toLowerCase());
    const matchesUserId = !userId || post.userId === userId;

    return matchesSearch && matchesUserId;
  });
}

