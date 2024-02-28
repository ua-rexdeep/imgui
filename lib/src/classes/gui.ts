import { DelayBeforeNullResponse, GetFreeRID, requestedItems, store } from '../imgui';

export class ImGUI {
    private readonly id: string;
    constructor(private readonly init: any) {
        this.id = init.id;
        if(store[init.id]) store[init.id].gui = this;
        else {
            store[init.id] = { 
                gui: this, 
                components: {}
            };
        }
    }
    GetID() { return this.id; }
    GetComponentById<T = any>(id: string | number): Promise<T> {
        if(store[this.GetID()]?.components[id]) return store[this.GetID()].components[id] as any as Promise<T>;
        const rid = GetFreeRID();
        return new Promise((done: (component: T) => void) => {
            requestedItems[rid] = { cb: done, gui: this };
            emit('imgui:requestComponent', this.GetID(), id, rid);
            setTimeout(done, DelayBeforeNullResponse, null);
        });
    }

    Deploy() {
        emit('imgui:deployGUI', this.GetID(), this.JSON());
    }

    JSON() {
        return {
            id: this.GetID(),
            ...this.init,
            contents: {},
        };
    }
}