export type EventReturn = string | Buffer;

export type EventCallback = {
    (key?: EventReturn): void
}

export type Events = {
    [name: string]: EventCallback
}