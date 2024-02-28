import { GetFreeRID, requestedItems } from '../imgui';
import { ImGUI } from './gui';

export class GUIText {
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

    JSON() {
        return {
            id: this.GetID(),
            type: 'text',
            ...this.init,
        };
    }
}