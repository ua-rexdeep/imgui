import { defineStore } from 'pinia';
import { ref } from 'vue';
import { GUI } from './services/gui';

export const UseImGUI = defineStore("ImGUI", () => {
    
    const UIStorage = ref([]);
    
    const font = ref('proggy');

    function SetFont(value) {
        font.value = value;
    }

    /**
     * @param {string} id
     * @param {object} init
     * @param {string} init.title
     * @param {string} init.titleBackground
     * @param {number} init.width 240 <> 1920
     * @param {number} init.height 120 <> 1080
     * @param {boolean} init.resize
     * @param {boolean} init.collapsed
     * @param {Array} init.contents
     */
    function CreateGUI(id, init) {
        if(GetById(id) != null) throw new Error(`GUI with id ${id} already exists`);

        const ui = new GUI(id, init);

        if(localStorage.getItem(`imgui_${id}`) == null) {
            const step = GetAll().filter((ui) => {
                if(ui.GetX() % 35 == 0 && ui.GetY() % 35 == 0) return true;
                if(ui.GetX() == 35 * 0.5 || ui.GetY() == 35 * 0.5) return true;
                return false;
            }).length;
            console.log(step)
            ui.Move((step || 0.5) * 35, (step || 0.5) * 35);
        }

        UIStorage.value.push(ui);
        return ui;
    }

    function GetById(id) {
        return UIStorage.value.find((ui) => ui?.GetID() == id);
    }

    function GetAll() {
        return UIStorage.value.filter((ui) => ui != null);
    }

    function DeleteById(id) {
        UIStorage.value[UIStorage.value.findIndex((ui) => ui?.GetID() == id)] = null;
    }

    function DeleteByIdWithTrigger(id) {
        GetById(id)?.OnAction(id, "__internal__", "delete");
        DeleteById(id);
    }

    function Log(text, object) {
        const csl = GetById("Console");
        if (!csl) return;
        csl.UpdateContentById('consoleLogs', { 
            content: [
                ...csl.GetContentById('consoleLogs').content.slice(-9), 
                { 
                    type: 'text', 
                    value: `%pink%[ImGUI | ${new Date().toLocaleTimeString()}] %white%${text}`, 
                    object,
                }
            ] 
        });
    }

    window.addEventListener('message', ({ data}) => {
        // console.log("EV", data)
        let logit = false;
        if(data.event == "CreateGUI") {
            CreateGUI(data.id, data);
            Log(`%lime%GUI with id(${data.id}) created.`, data);
            logit = true;
        }
        if(data.event == "DeleteGUI"){
            DeleteById(data.id);
            Log(`%red%GUI with id(${data.id}) deleted.`, data);
            logit = true;
        }
        if(data.event == "UpdateGUI"){
            const gui = GetById(data.id);
            if(!gui) return console.error(`UpdateGUI error: gui(${data.id}) not found`)
            gui.SetTitle(data.title);
            gui.SetContents(data.contents);
            Log(`%red%GUI with id(${data.id}) updated.`, data);
            logit = true;
        }
        if(data.event == "UpdateGUITitle") {
            const gui = GetById(data.GUIID);
            if(gui) gui.SetTitle(data.newTitle);
        }
        if(data.event == "UpdateComponentById") {
            const gui = GetById(data.GUIID);
            if(gui) gui.UpdateContentById(data.componentID, data.updatedData)
        }
        if(logit) Log(`APIEvent %lightblue%"${data.event}"`, data);
    })

    return {
        font,
        
        CreateGUI,
        GetAll,
        GetById,
        DeleteById,
        DeleteByIdWithTrigger,
        SetFont,
        Log,
    };

});