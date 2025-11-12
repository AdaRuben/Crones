/* eslint-disable */
declare namespace ymaps {
  class Map {
    constructor(
      element: HTMLElement | string,
      state: {
        center: number[];
        zoom: number;
        controls?: string[];
      },
      options?: {
        suppressMapOpenBlock?: boolean;
        restrictMapArea?: number[][];
      },
    );
    geoObjects: {
      add(object: any): void;
      remove(object: any): void;
    };
    behaviors: {
      enable(behavior: string): void;
      disable(behavior: string): void;
    };
    events: {
      add(event: string, handler: (e: any) => void): void;
    };
    options: {
      set(key: string, value: any): void;
    };
    destroy(): void;
  }

  namespace multiRouter {
    class MultiRoute {
      constructor(
        params: {
          referencePoints: number[][];
          params?: {
            routingMode?: string;
          };
        },
        options?: {
          boundsAutoApply?: boolean;
        },
      );
      model: {
        events: {
          add(event: string, handler: () => void): this;
        };
        destroy(): void;
      };
      getActiveRoute(): {
        properties: {
          get(property: string): any;
        };
      } | null;
    }
  }

  namespace geocode {
    function geocode(
      request: string | number[],
      options?: {
        results?: number;
        json?: boolean;
        kind?: string;
      },
    ): Promise<any>;
  }

  namespace suggest {
    function suggest(query: string, options?: { results?: number }): Promise<any>;
  }

  function ready(callback: () => void): void;
}

interface Window {
  ymaps: typeof ymaps;
}
