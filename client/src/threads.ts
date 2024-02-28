import { Logger } from './logger';

export class Threads {
    private readonly logger = new Logger('Threads');

    AddThread(name: string, func: () => void, interval?: number) {
        let errorCatched = false;
        setTick(async () => {
            try {
                errorCatched = false;
                func();
            } catch(e) {
                if(!errorCatched) {
                    errorCatched = true;
                    this.logger.Error(`Error cathed in thread(${name})`);
                    console.trace(e);
                }
            }
            if(interval != null) await new Promise((done) => setTimeout(done, interval));
        });
        this.logger.Log(`New thread(${name}) with interval ${interval}ms created.`);
    }
}