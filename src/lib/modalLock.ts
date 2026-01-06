let activeModalId: string | null = null;

export const modalLock = {
  canOpen: (id: string) => activeModalId === null || activeModalId === id,
  requestOpen: (id: string) => {
    if (activeModalId && activeModalId !== id) {
      return false;
    }
    activeModalId = id;
    return true;
  },
  release: (id: string) => {
    if (activeModalId === id) {
      activeModalId = null;
    }
  },
};
