import { ImGUI } from './gui';

export class GUIButton {
    private readonly id: string | number;
    constructor(
        private readonly GUI: ImGUI,
        private readonly init: any,
    ){
        this.id = init.id;
    }
    GetID() { return this.id; }

    SetText(text: string) {
        emit('imgui:updateComponent', this.GUI.GetID(), this.GetID(), { text });
    }

    JSON() {
        return {
            id: this.GetID(),
            type: 'button',
            ...this.init,
        };
    }

    private eventListeners: Record<string, (thisComponent: GUIButton) => void> = {};
    On(event: string, cb: (thisComponent: GUIButton) => void) {
        this.eventListeners[event] = cb;
    }
    Trigger(event: string) {
        if(this.eventListeners[event]) this.eventListeners[event](this);
    }
}