import { API } from './api';
import { GUIButton, GUIButtonInit } from './components/button';
import { GUICheck } from './components/check';
import { GUIDivider } from './components/divider';
import { GUIFloat, GUIFloatInit } from './components/float';
import { GUIInput, GUIInputInit } from './components/input';
import { GUIPanel, GUIPanelInit } from './components/panel';
import { GUISelect } from './components/select';
import { GUIText, GUITextInit } from './components/text';

export type GUIContent = any[] 

export interface GUIInit {
    title: string,
    titleBackground?: string,
    width: number,
    height: number,
    resize?: boolean,
    collapsed?: boolean,
}

export type TContents = GUIText | GUIPanel | GUIButton | GUIFloat | GUICheck | GUIInput | GUIDivider | GUISelect;

export class ImGUI {
    private readonly api = new API();
    private contents: TContents[] = [];
    private deployed = false;
    constructor(private readonly id: string, private init: GUIInit) {
    }

    GetID() { return this.id; }

    SetTitle(title: string) {
        this.init.title = title;
        this.api.UpdateGUITitle(this.GetID(), title);
    }

    GetTitle() { return this.init.title; }

    private nextComponentID = 0;
    public GetNextComponentID() {
        this.nextComponentID++;
        return this.nextComponentID;
    }

    AddText(id: string | null, value: string, data?: Omit<GUITextInit, 'value'>) {
        if(id != null && this.GetContentById(id) != null) throw new Error(`GUI(${this.GetID()}) component with id(${id}) already exists`);
        const component = new GUIText(this, id || this.GetNextComponentID(), {value, ...data});
        this.contents.push(component);
        if(this.IsDeployed()) this.Reload();
        return component;
    }
    
    AddPanel(id: string | null, type: 'vertical' | 'horizontal', data?: Omit<GUIPanelInit, 'type'>) {
        if(id != null && this.GetContentById(id) != null) throw new Error(`GUI(${this.GetID()}) component with id(${id}) already exists`);
        const component = new GUIPanel(this, id || this.GetNextComponentID(), { type, ...data });
        this.contents.push(component);
        if(this.IsDeployed()) this.Reload();
        return component;
    }

    AddButton(id: string | null, text: string, data?: Omit<GUIButtonInit, 'text'>) {
        if(id != null && this.GetContentById(id) != null) throw new Error(`GUI(${this.GetID()}) component with id(${id}) already exists`);
        const component = new GUIButton(this, id || this.GetNextComponentID(), { text, ...data });
        this.contents.push(component);
        if(this.IsDeployed()) this.Reload();
        return component;
    }

    AddCheck(id: string | null, checked: boolean, data?: Omit<GUICheck, 'checked'>) {
        if(id != null && this.GetContentById(id) != null) throw new Error(`GUI(${this.GetID()}) component with id(${id}) already exists`);
        const component = new GUICheck(this, id || this.GetNextComponentID(), { checked, ...data });
        this.contents.push(component);
        if(this.IsDeployed()) this.Reload();
        return component;
    }

    AddFloat(id: string | null, value: number, min: number, max: number, step: number, data?: Partial<GUIFloatInit>) {
        if(id != null && this.GetContentById(id) != null) throw new Error(`GUI(${this.GetID()}) component with id(${id}) already exists`);
        const component = new GUIFloat(this, id || this.GetNextComponentID(), 
            { ...data, value, min, max, step });
        this.contents.push(component);
        if(this.IsDeployed()) this.Reload();
        return component;
    }

    AddInput(id: string | null, value: string, data?: Partial<GUIInputInit>) {
        if(id != null && this.GetContentById(id) != null) throw new Error(`GUI(${this.GetID()}) component with id(${id}) already exists`);
        const component = new GUIInput(this, id || this.GetNextComponentID(), 
            { ...data, value });
        this.contents.push(component);
        if(this.IsDeployed()) this.Reload();
        return component;
    }

    AddDivider() {
        const component = new GUIDivider(this, this.GetNextComponentID());
        this.contents.push(component);
        if(this.IsDeployed()) this.Reload();
        return component;
    }

    IsDeployed() { return this.deployed; }

    // sends JSON of gui to frontend
    Deploy() {
        if(this.IsDeployed()) return;
        this.deployed = true;
        SendNUIMessage({
            event: 'CreateGUI',
            ...this.JSON(),
        });
        // console.log(JSON.stringify(this.contents.map((c) => c.JSON()), null, 4));
        return this.JSON();
    }

    Reload() {
        SendNUIMessage({
            event: 'UpdateGUI',
            ...this.JSON(),
        });
    }

    JSON(includeContent: boolean = true) {
        return {
            id: this.id,
            ...this.init,
            contents: includeContent ? this.contents.map((c) => c.JSON()) : undefined,
        };
    }

    private eventListeners: Record<string, (...data: any[]) => void> = {};
    On(event: string, cb: (...data: any[]) => void) {
        this.eventListeners[event] = cb;
    }

    Trigger(event: string, ...data: any[]) {
        if(this.eventListeners[event]) this.eventListeners[event](this, data);
    }

    UpdateContentById(id: string | number, newValue: Record<string, any>) {
        // console.log(`Update content for gui(${this.GetID()}) component(${id}) set `, newValue);
        this.api.UpdateComponentById(this.GetID(), this.GetContentById(id)!, newValue);
    }

    GetContentById<T = TContents>(id: string | number): T | null {
        // console.log(`Get content for gui(${this.GetID()}) component(${id})`);
        return this._NextGetContent<T>(this.contents, id);
    }

    _NextUpdateContent(data: any[], id: string | number, newValue: Record<string, any>) {
        for (let i = 0; i < data.length; i++) {
            const item = data[i];
            if(item.id == id) {
                data[i] = {
                    ...item,
                    ...newValue,
                };
            } else if(item instanceof GUIPanel) {
                this._NextUpdateContent(item.GetContent(), id, newValue);
            }
        }
    }

    _NextGetContent<T = TContents>(data: TContents[], id: string | number): T | null {
        for (let i = 0; i < data.length; i++) {
            const item = data[i];
            if(item.id == id) {
                return item as T;
            } else if(item instanceof GUIPanel) {
                const found: TContents | null = this._NextGetContent(item.GetContent(), id);
                if(found) return found as T;
            }
        }

        return null;
    }
}