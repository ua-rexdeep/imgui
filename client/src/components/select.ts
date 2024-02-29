import { API } from '../api';
import { ImGUI } from '../imgui';

export interface GUISelectInit {
    value: string,
    width?: string | number,
    height?: string | number,
    options: Record<string | number, string>,
}
export class GUISelect {
    API = new API();
    constructor(
        private readonly GUI: ImGUI, 
        public readonly componentID: string | number, 
        private data: GUISelectInit) {}

    get type() { return 'select'; }
    get id() { return this.componentID; }
    GetGUI() { return this.GUI; }
    
    JSON() {
        return {
            id: this.id,
            type: this.type,
            ...this.data,
        };
    }

    SetValue(value: string) {
        this.data.value = value;
        this.API.UpdateComponentById(this.GUI.GetID(), this, { value });
    }

    GetValue() {
        return this.data.value;
    }

    private eventListeners: Record<string, (thisComponent: GUISelect, data: any) => void> = {};
    On(event: string, cb: (thisComponent: GUISelect, data: any) => void) {
        this.eventListeners[event] = cb;
    }
    Trigger(event: string, data: any) {
        if(this.eventListeners[event]) this.eventListeners[event](this, data);
        emit('gui:componentTrigger', this.GUI.GetID(), this.id, event, data.value);
    }
}