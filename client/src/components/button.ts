import { API } from '../api';
import { ImGUI } from '../imgui';

export interface GUIButtonInit {
    text: string,
    width?: number | string,
    height?: number | string,
    style?: 'error' | 'warning',
    disabled?: boolean,
}

export class GUIButton {
    API = new API();
    constructor(
        private readonly GUI: ImGUI, 
        public readonly componentID: string | number, 
        private data: GUIButtonInit) {
        
    }

    get type() { return 'button'; };
    get id() { return this.componentID; }
    GetGUI() { return this.GUI; }

    SetText(text: string) {
        this.data.text = text;
        this.API.UpdateComponentById(this.GUI.GetID(), this, { text });
    }

    SetDisabled(disabled: boolean) {
        this.data.disabled = disabled;
        this.API.UpdateComponentById(this.GUI.GetID(), this, { disabled });
    }

    JSON() {
        return {
            id: this.id,
            type: this.type,
            ...this.data,
        };
    }

    private eventListeners: Record<string, (thisComponent: GUIButton) => void> = {};
    On(event: string, cb: (thisComponent: GUIButton) => void) {
        this.eventListeners[event] = cb;
    }

    Trigger(event: 'click') {
        if(this.eventListeners[event]) this.eventListeners[event](this);
        emit('gui:componentTrigger', this.GUI.GetID(), this.id, event);
    }
}