export async function sleep(ms, { signal } = {}) {
  return new Promise((resolve, _reject) => {
    setTimeout(resolve, ms);
  });
}
