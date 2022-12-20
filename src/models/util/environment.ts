export {};

declare global {
    namespace NodeJS {
        interface ProcessEnv {
            RIOT_API_KEY: string
        }
    }
}