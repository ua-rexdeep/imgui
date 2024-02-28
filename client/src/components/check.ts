import { API } from '../api';
import { ImGUI } from '../imgui';

export interface GUICheckInit {
    checked: boolean,
}
export class GUICheck {
    API = new API();
    constructor(
        private readonly GUI: ImGUI, 
        public readonly componentID: string | number, 
        private data: GUICheckInit) {
        
    }

    get type() { return 'check'; };
    get id() { return this.componentID; }
    GetGUI() { return this.GUI; }

    SetChecked(checked: boolean) {
        this.data.checked = checked;
        this.API.UpdateComponentById(this.GUI.GetID(), this, { checked });
    }

    IsChecked() {
        return this.data.checked;
    }

    JSON() {
        return {
            id: this.id,
            type: this.type,
            ...this.data,
        };
    }

    private eventListeners: Record<string, (thisComponent: GUICheck, data: any) => void> = {};
    On(event: string, cb: (thisComponent: GUICheck, data: any) => void) {
        this.eventListeners[event] = cb;
    }

    Trigger(event: 'change', data: Record<string, any>) {
        if(event == 'change') {
            this.data.checked = data.value;
            emit('gui:componentTrigger', this.GUI.GetID(), this.id, event, data.value);
        }
        if(this.eventListeners[event]) this.eventListeners[event](this, data);
    }
}