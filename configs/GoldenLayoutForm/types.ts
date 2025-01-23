interface GoldenContainer {
  height: number;
  width: number;
  on: (event: string, handler: () => void) => void;
  off: (event: string, handler?: () => void) => void;

  [key: string]: unknown;
}

interface GoldenLayoutItem {
  container: GoldenContainer;
}

export type { GoldenLayoutItem, GoldenContainer };
