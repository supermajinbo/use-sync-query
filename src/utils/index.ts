export const isWhiteSpace = (val: unknown): boolean => {
  if (val === null || val === undefined || val === '') return true;
  if (typeof val === 'string') {
    if (val.trim() === '') return true;
  }
  return false;
};
