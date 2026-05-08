
/**
 * Wraps a promise with a timeout.
 * @param promise The promise to execute
 * @param timeoutMs Timeout in milliseconds
 * @returns The promise result or rejects if timeout is reached
 */
export const fetchWithTimeout = async <T>(promise: Promise<T>, timeoutMs: number): Promise<T> => {
  let timeoutId: any;
  const timeoutPromise = new Promise<never>((_, reject) => {
    timeoutId = setTimeout(() => reject(new Error('Fetch timeout')), timeoutMs);
  });
  const result = await Promise.race([promise, timeoutPromise]);
  clearTimeout(timeoutId);
  return result;
};
