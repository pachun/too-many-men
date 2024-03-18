// this function is never called and has no behavior so it's not covered by tests;
// - but it's required to initialize any contexts with default function values

//* c8 ignore start */
export default (): Promise<void> => {
  return Promise.resolve()
}
//* c8 ignore end */
