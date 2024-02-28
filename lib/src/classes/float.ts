import { GetFreeRID, requestedItems } from '../imgui';
import { ImGUI } from './gui';

export class GUIFloat {
    private readonly id: string | number;
    constructor(
        private readonly GUI: ImGUI,
        private readonly init: any,
    ){
        this.id = init.id;
    }
    GetID() { return this.id; }

    GetValue() {
        const rid = GetFreeRID();
        return new Promise((done: (value: number) => void) => {
            requestedItems[rid] = { cb: done };
            emit('imgui:requestValue', this.GUI.GetID(), this.GetID(), rid);
        });
    }

    SetValue(value: number) {
        emit('imgui:updateComponent', this.GUI.GetID(), this.GetID(), { value });
    }

    SetOverride(text: string) {
        emit('imgui:updateComponent', this.GUI.GetID(), this.GetID(), { override: text });
    }

    private eventListeners: Record<string, (thisComponent: GUIFloat, data: any) => void> = {};
    On(event: string, cb: (thisComponent: GUIFloat, value: string | number | boolean) => void) {
        this.eventListeners[event] = cb;
    }
    Trigger(event: string, value: string | number | boolean) {
        if(this.eventListeners[event]) this.eventListeners[event](this, value);
    }

    JSON() {
        return {
            id: this.GetID(),
            type: 'float',
            ...this.init,
        };
    }
}