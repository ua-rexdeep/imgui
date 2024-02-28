import '@citizenfx/client';
import { GUIButton } from './classes/button';
import { GUIFloat } from './classes/float';
import { ImGUI } from './classes/gui';
import { GUIPanel } from './classes/panel';
import { GUIText } from './classes/text';

export const DelayBeforeNullResponse = 1000;

export const store: Record<string, { gui: ImGUI, components: Record<string, GUIFloat | GUIText | GUIButton | GUIPanel> }> = {};

export const requestedItems: { cb: (gui: any) => void, gui?: ImGUI, guiid?: string }[] = [];
export const GetFreeRID = () => {
    let rid = 0;
    while(requestedItems[rid] != null) rid++;
    return rid;
};

on('imgui:returnGUI', (rid: number, item: any) => {
    if(requestedItems[rid] && item) {
        if(item) {
            const gui = new ImGUI(item);
            if(store[item.id]) {
                store[item.id].gui = gui; // gui exists in store, replace
            }
            else {
                store[item.id] = { gui, components: {} }; // add new gui to store, to not request it every time
            }
            requestedItems[rid].cb(gui);
        } else { // gui no longer exists
            requestedItems[rid].cb(null);
            delete store[item.id];
        }
    }
    if(!item) { // component no longer exists, we clear gui to receive it again
        requestedItems[rid].cb(null);
        delete store[requestedItems[rid].guiid!];
    }
    delete requestedItems[rid];
});

on('imgui:returnComponent', (rid: number, item: any) => {
    const gui = requestedItems[rid]?.gui;
    if(requestedItems[rid] && item) {
        if(!gui) throw new Error('No GUI on return');
        let component;
        if(item.type == 'float') component = new GUIFloat(gui, item);
        else if(item.type == 'text') component = new GUIText(gui, item);
        else if(item.type == 'horizontal' || item.type == 'vertical') component = new GUIPanel(gui, item);
        else if(item.type == 'button') component = new GUIButton(gui, item);
        else console.error('imguilib error, wrong type', item);

        // set store gui component, to not request it every time
        if(component && store[gui.GetID()]) {
            store[gui.GetID()].components[item.id] = component;
        }
        requestedItems[rid].cb(component);
    }
    if(!item) { // component no longer exists, we clear gui to receive it again
        requestedItems[rid].cb(null);
        if(gui) delete store[gui.GetID()];
    }
    delete requestedItems[rid];
});

on('imgui:returnValue', (rid: number, value: string | number | boolean) => {
    requestedItems[rid]?.cb(value);
    delete requestedItems[rid];
});

on('gui:componentTrigger', (guiid: string, componentId: string | number, event: string, data: any) => {
    const component = store[guiid]?.components[componentId];
    if(component && 'Trigger' in component) component.Trigger(event, data);
});

// component no longer exists
on('imgui:componentNotExist', (guiid: string, componentId: string | number) => {
    if(store[guiid]) delete store[guiid].components[componentId];
});

export async function GetGUI(id: string){
    const rid = GetFreeRID();

    return new Promise((done: (gui: ImGUI | null) => void) => {
        requestedItems[rid] = { cb: done, guiid: id };
        emit('imgui:requestGUI', id, rid);

        setTimeout(done, DelayBeforeNullResponse, null);
    });
}