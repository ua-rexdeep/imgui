import { TContents } from './imgui';

export class API {
    UpdateComponentById(GUIID: string, component: TContents, updatedData: Record<string, any>) {
        // console.log(`UpdateComponentById -> ${GUIID} -> ${component.id} set`, updatedData);
        SendNUIMessage({
            event: 'UpdateComponentById',
            GUIID,
            componentID: component.id,
            updatedData,
        });
    }

    UpdateGUITitle(GUIID: string, newTitle: string) {
        SendNUIMessage({
            event: 'UpdateGUITitle',
            GUIID,
            newTitle,
        });
    }
}