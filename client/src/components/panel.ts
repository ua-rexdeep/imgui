import { ImGUI, TContents } from '../imgui';
import { GUIButton, GUIButtonInit } from './button';
import { GUICheck } from './check';
import { GUIDivider } from './divider';
import { GUIFloat, GUIFloatInit } from './float';
import { GUIInput, GUIInputInit } from './input';
import { GUISelect, GUISelectInit } from './select';
import { GUIText, GUITextInit } from './text';

export interface GUIPanelInit {
    type: 'vertical' | 'horizontal',
    width?: number | string,
    height?: number | string,
    reverseScroll?: boolean, // flex-col-reverse
}
export class GUIPanel {
    private contents: TContents[] = [];
    constructor(
        private readonly GUI: ImGUI, 
        public readonly componentID: string | number, 
        private data: GUIPanelInit) {
    }

    get type() { return this.data.type; };
    get id() { return this.componentID; }

    GetContent() { return this.contents; }
    GetGUI() { return this.GUI; }
    
    AddText(id: string | null, value: string, data?: Omit<GUITextInit, 'value'>) {
        if(id != null && this.GUI.GetContentById(id) != null) throw new Error(`GUI(${this.id}) component with id(${id}) already exists`);
        const component = new GUIText(this.GUI, id || this.GUI.GetNextComponentID(), {value, ...data});
        this.contents.push(component);
        if(this.GUI.IsDeployed()) this.GUI.Reload();
        return component;
    }
    
    AddPanel(id: string | null, type: 'vertical' | 'horizontal', data?: Omit<GUIPanelInit, 'type'>) {
        if(id != null && this.GUI.GetContentById(id) != null) throw new Error(`GUI(${this.id}) component with id(${id}) already exists`);
        const component = new GUIPanel(this.GUI, id || this.GUI.GetNextComponentID(), { type, ...data });
        this.contents.push(component);
        if(this.GUI.IsDeployed()) this.GUI.Reload();
        return component;
    }

    AddButton(id: string | null, text: string, data?: Omit<GUIButtonInit, 'text'>) {
        if(id != null && this.GUI.GetContentById(id) != null) throw new Error(`GUI(${this.id}) component with id(${id}) already exists`);
        const component = new GUIButton(this.GUI, id || this.GUI.GetNextComponentID(), { text, ...data });
        this.contents.push(component);
        if(this.GUI.IsDeployed()) this.GUI.Reload();
        return component;
    }

    AddFloat(id: string | null, value: number, min: number, max: number, step: number, data?: Partial<GUIFloatInit>) {
        if(id != null && this.GUI.GetContentById(id) != null) throw new Error(`GUI(${this.id}) component with id(${id}) already exists`);
        const component = new GUIFloat(this.GUI, id || this.GUI.GetNextComponentID(), 
            { ...data, value, min, max, step });
        this.contents.push(component);
        if(this.GUI.IsDeployed()) this.GUI.Reload();
        return component;
    }

    AddCheck(id: string | null, checked: boolean, data?: Omit<GUICheck, 'checked'>) {
        if(id != null && this.GUI.GetContentById(id) != null) throw new Error(`GUI(${this.id}) component with id(${id}) already exists`);
        const component = new GUICheck(this.GUI, id || this.GUI.GetNextComponentID(), { checked, ...data });
        this.contents.push(component);
        if(this.GUI.IsDeployed()) this.GUI.Reload();
        return component;
    }
    
    AddInput(id: string | null, value: string, data?: Partial<GUIInputInit>) {
        if(id != null && this.GUI.GetContentById(id) != null) throw new Error(`GUI(${this.id}) component with id(${id}) already exists`);
        const component = new GUIInput(this.GUI, id || this.GUI.GetNextComponentID(), 
            { ...data, value });
        this.contents.push(component);
        if(this.GUI.IsDeployed()) this.GUI.Reload();
        return component;
    }    

    AddDivider() {
        const component = new GUIDivider(this.GUI, this.GUI.GetNextComponentID());
        this.contents.push(component);
        if(this.GUI.IsDeployed()) this.GUI.Reload();
        return component;
    }

    AddSelect(id: string | null, value: string, options: Record<string | number, string>, data?: Partial<GUISelectInit>) {
        const component = new GUISelect(this.GUI, id || this.GUI.GetNextComponentID(), 
            { ...data, value, options });
        this.contents.push(component);
        if(this.GUI.IsDeployed()) this.GUI.Reload();
        return component;
    }

    JSON(): GUIPanelInit & { id: string | number, content?: any} {
        return {
            id: this.id,
            ...this.data,
            content: this.contents.map((c) => c.JSON()),
        };
    }
}