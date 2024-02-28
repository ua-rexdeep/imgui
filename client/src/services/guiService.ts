import { GUICheck } from '../components/check';
import { GUIFloat } from '../components/float';
import { GUIInput } from '../components/input';
import { GUIPanel } from '../components/panel';
import { GUIInit, ImGUI } from '../imgui';

export class GUIService {
    private guiArray: (ImGUI | null)[] = [];

    constructor() {

        on('imgui:deployGUI', (id: string, data: any) => {
            const gui = this.Create(id, data);
            gui.AddPanel('main', 'vertical');
            gui.Deploy();
        });

        on('imgui:requestGUI', (id: string, rid: number) => {
            emit('imgui:returnGUI', rid, this.GetByID(id)?.JSON(false));
        });

        on('imgui:requestComponent', (guiid: string, componentId: string | number, rid: number) => {
            emit('imgui:returnComponent', rid, this.GetByID(guiid)?.GetContentById(componentId)?.JSON());
        });

        on('imgui:requestValue', (guiid: string, componentId: string | number, rid: number) => {
            const component = this.GetByID(guiid)?.GetContentById(componentId);
            let value = null;
            if(component instanceof GUIFloat) value = component.GetValue();
            else if(component instanceof GUIInput) value = component.GetValue();
            else if(component instanceof GUICheck) value = component.IsChecked();
            else console.warn(`GUIService request value of component type ${typeof(component)} is not able`);
            emit('imgui:returnValue', rid, value);
        });

        on('imgui:updateComponent', (guiid: string, componentId: string | number, data: any) => {
            if(!this.GetByID(guiid)?.GetContentById(componentId)) emit('imgui:componentNotExist', guiid, componentId);
            else this.GetByID(guiid)?.UpdateContentById(componentId, data);
        }); 

        on('imgui:addComponent', (guiid: string, parentId: string, data: any) => {
            const gui = this.GetByID(guiid);
            
            if(data.type == 'float') gui?.GetContentById<GUIPanel>(parentId)?.AddFloat(data.id, data.value, data.min, data.max, data.step, data);
            else if(data.type == 'text') gui?.GetContentById<GUIPanel>(parentId)?.AddText(data.id, data.value, data);
            else if(data.type == 'button') gui?.GetContentById<GUIPanel>(parentId)?.AddButton(data.id, data.text, data);
            else if(data.type == 'vertical' || data.type == 'horizontal') gui?.GetContentById<GUIPanel>(parentId)?.AddPanel(data.id, data.text, data);
            else if(data.type == 'divider') gui?.GetContentById<GUIPanel>(parentId)?.AddDivider();
            else if(data.type == 'input') gui?.GetContentById<GUIPanel>(parentId)?.AddInput(data.id, data.value, data);
            else if(data.type == 'check') gui?.GetContentById<GUIPanel>(parentId)?.AddCheck(data.id, data.checked, data);
            else console.error(`addComponent error: no type to add ${data.type}`, data);
        });
    }

    Create(id: string, init: GUIInit) {
        if(this.GetByID(id)) throw new Error(`GUI with id ${id} already exists`);
        
        const gui = new ImGUI(id, init);
        this.guiArray.push(gui);
        return gui;
    }

    GetByID(id: string) {
        return this.guiArray.find((ui) => ui?.GetID() == id);
    }

    GetAll() {
        return this.guiArray.filter((ui) => ui != null);
    }

    DeleteById(id: string | number) {
        this.guiArray[this.guiArray.findIndex((ui) => ui?.GetID() == id)] = null;
        SendNUIMessage({
            id,
            event: 'DeleteGUI',
        });
    }
}