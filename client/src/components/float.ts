import { API } from '../api';
import { ImGUI } from '../imgui';

export interface GUIFloatInit {
    value: number,
    min: number,
    max: number,
    step: number,
    override?: string, // XYZ: %
    width?: number | string,
}
export class GUIFloat {
    API = new API();
    constructor(
        private readonly GUI: ImGUI, 
        public readonly componentID: string | number, 
        private data: GUIFloatInit) {}

    get type() { return 'float'; };
    get id() { return this.componentID; }
    GetGUI() { return this.GUI; }

    SetValue(value: number) {
        this.data.value = value;
        this.API.UpdateComponentById(this.GUI.GetID(), this, { value });
    }

    GetValue() {
        return this.data.value;
    }

    JSON() {
        return {
            id: this.id,
            type: this.type,
            ...this.data,
        };
    }

    private eventListeners: Record<string, (thisComponent: GUIFloat, data: any) => void> = {};
    On(event: 'change', cb: (thisComponent: GUIFloat, data: any) => void) {
        this.eventListeners[event] = cb;
        return this;
    }

    Trigger(event: 'change', data: Record<string, any>) {
        if(event == 'change') {
            this.data.value = data.value;
            emit('gui:componentTrigger', this.GUI.GetID(), this.id, event, data.value);
        }
        if(this.eventListeners[event]) this.eventListeners[event](this, data);
    }
}