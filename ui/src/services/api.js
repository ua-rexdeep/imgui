import axios from 'axios';
import { UseImGUI } from '../store';

export class API {
    local = import.meta.env.DEV;

    SendComponentAction(GUIID = 'default', componentID = null, actionType, value) {
        // console.log("NetPost", GUIID, componentID, actionType, value)
        
        if(this.local || GUIID == '__web_settings__') {
            console.log("API", `${GUIID}.${componentID}.${actionType}`, `${GUIID}_${componentID}_${actionType}`, value);
            this[`${GUIID}_${componentID}_${actionType}`] && this[`${GUIID}_${componentID}_${actionType}`](value);
            axios.post(`http://localhost:3000/event`, {GUIID, componentID, actionType, value});
        } else {
            axios.post(`https://imgui/event`, JSON.stringify({GUIID, componentID, actionType, value}));
        }
    }

    TurnNUIFocusOff() {
        axios.post(`https://imgui/nuifocus`);
    }

    Demo2_scroll1_select(value) {
        const gui = UseImGUI();
        const demo3 = gui.GetById("Demo2");
        demo3.UpdateContentById("text1", { value: `Selected: ${value}` },)
    }

    Demo_saveBtn_click() {
        const gui = UseImGUI();
        const demo = gui.GetById("Demo");
        demo.UpdateContentById('savedSuccessText', { value: '%purple%Saved!' });
        setTimeout(() => {
            demo.UpdateContentById('savedSuccessText', { value: '' });
        }, 1000)
    }

    __web_settings___fontSelect_change(value) {
        const gui = UseImGUI();
        gui.SetFont(value);
    }

    __web_settings___hideGuiWhenNotFocused_change(value) {
        // TODO
    }

    __web_settings___clearLocalStorage_click() {
        localStorage.clear();
    }

    Console_consoleInput_enter(value) {
        const gui = UseImGUI();
        const csl = gui.GetById("Console");
        
        csl.UpdateContentById('consoleInput', { value: '' });
        csl.UpdateContentById('consoleLogs', { content: [...csl.GetContentById('consoleLogs').content, { type: 'text', value: `[ImGUI] Console input: ${value}`, width: 100 }] });
    }
}