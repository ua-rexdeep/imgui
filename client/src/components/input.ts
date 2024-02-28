import { API } from '../api';
import { ImGUI } from '../imgui';

export interface GUIInputInit {
    value: string,
    placeholder?: string,
    width?: string | number,
    height?: string | number,
    disabled?: boolean,
    override?: string,
    onEnter?: boolean,
    debounce?: number, // 300
}
export class GUIInput {
    API = new API();
    constructor(
        private readonly GUI: ImGUI, 
        public readonly componentID: string | number, 
        private data: GUIInputInit) {}

    get type() { return 'input'; }
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

    SetDisabled(disabled: boolean) {
        this.data.disabled = disabled;
        this.API.UpdateComponentById(this.GUI.GetID(), this, { disabled });
    }

    private eventListeners: Record<string, (thisComponent: GUIInput, data: any) => void> = {};
    On(event: string, cb: (thisComponent: GUIInput, data: any) => void) {
        this.eventListeners[event] = cb;
    }
    Trigger(event: string, data: any) {
        if(this.eventListeners[event]) this.eventListeners[event](this, data);
        emit('gui:componentTrigger', this.GUI.GetID(), this.id, event, data.value);
    }
}