export interface IHostConnector{
    pingTheServer(): void
    setServer(hostId: string): void
}