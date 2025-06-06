declare module 'timesync' {
    export interface TimeSyncOptions {
        interval?: number;
        timeout?: number;
        delay?: number;
        repeat?: number;
        peers?: string | string[];
        server?: string;
        now?: () => number;
    }

    export interface TimeSync {
        destroy();
        now(): number;
        on(event: 'change', callback: (offset: number) => void);
        on(event: 'error', callback: (err: any) => void);
        on(event: 'sync', callback: (value: 'start' | 'end') => void);
        off(event: 'change' | 'error' | 'sync', callback?: () => void);
        sync();

        send(to: string, data: object, timeout: number): Promise<void>;
        receive(from: string, data: object);
    }

    export function create(options?: TimeSyncOptions): TimeSync;
    export default { create };
}
