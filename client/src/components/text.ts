import { API } from '../api';
import { ImGUI } from '../imgui';

export interface GUITextInit {
    value: string,
    userSelect?: boolean,
    center?: boolean,
    width?: number | string,
    object?: unknown,
}
export class GUIText {
    API = new API();
    constructor(
        private readonly GUI: ImGUI, 
        public readonly componentID: string | number, 
        private data: GUITextInit) {
        
    }

    get type() { return 'text'; };
    get id() { return this.componentID; }
    GetGUI() { return this.GUI; }

    SetValue(value: string) {
        this.data.value = value;
        this.API.UpdateComponentById(this.GUI.GetID(), this, { value });
    }

    JSON() {
        return {
            id: this.id,
            type: this.type,
            ...this.data,
        };
    }
}