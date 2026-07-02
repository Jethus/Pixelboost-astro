// Plausible's queue stub (see BaseLayout.astro): callable, with a `q` array
// that buffers calls made before the analytics script loads.
interface Window {
  plausible: {
    (event: string, options?: { props?: Record<string, unknown>; u?: string }): void;
    q?: IArguments[];
  };
}
