import { RouteParams, Router } from 'ziggy-js';
import type { Config } from 'ziggy-js';

declare global {
    function route(): Router;
    function route(name: string, params?: RouteParams<typeof name> | undefined, absolute?: boolean): string;
}

declare module '@vue/runtime-core' {
    interface ComponentCustomProperties {
        route: typeof route;
    }
}

declare module '@inertiajs/core' {
    interface PageProps {
        ziggy: Config & {
            location: string;
        };
    }
}
