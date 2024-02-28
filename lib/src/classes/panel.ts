import { store } from '../imgui';
import { GUIButton } from './button';
import { GUIFloat } from './float';
import { ImGUI } from './gui';
import { GUIText } from './text';

export class GUIPanel {
    private readonly id: string | number;
    private readonly type: 'vertical' | 'horizontal';
    constructor(
        private readonly GUI: ImGUI,
        private readonly init: any,
    ){
        this.id = init.id;
        this.type = init.type;
    }
    GetID() { return this.id; }

    AddFloat(id: string | null, value: number, min: number, max: number, step: number, data?: Record<string, any>) {
        const component = new GUIFloat(this.GUI, { id, ...data, value, min, max, step });
        emit('imgui:addComponent', this.GUI.GetID(), this.GetID(), component.JSON());
        if(id && store[this.GUI.GetID()]) store[this.GUI.GetID()].components[id] = component;
        return component;
    }

    AddText(id: string | null, value: string, data?: Record<string, any>) {
        const component = new GUIText(this.GUI, { id, ...data, value });
        emit('imgui:addComponent', this.GUI.GetID(), this.GetID(), component.JSON());
        if(id && store[this.GUI.GetID()]) store[this.GUI.GetID()].components[id] = component;
        return component;
    }

    AddButton(id: string | null, text: string, data?: Record<string, any>) {
        const component = new GUIButton(this.GUI, { id, ...data, text });
        emit('imgui:addComponent', this.GUI.GetID(), this.GetID(), component.JSON());
        if(id && store[this.GUI.GetID()]) store[this.GUI.GetID()].components[id] = component;
        return component;
    }

    AddPanel(id: string | null, type: 'vertical' | 'horizontal', data?: Record<string, any>) {
        const component = new GUIPanel(this.GUI, { id, ...data, type });
        emit('imgui:addComponent', this.GUI.GetID(), this.GetID(), component.JSON());
        if(id && store[this.GUI.GetID()]) store[this.GUI.GetID()].components[id] = component;
        return component;
    }

    JSON() {
        return {
            id: this.GetID(),
            type: this.type,
            ...this.init,
            content: [],
        };
    }
    
}