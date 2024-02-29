Store = {};
Requests = {};

if not AddEventHandler then
    local mb = {};
    function AddEventHandler(event, callback)
        mb[event] = callback;
    end
    function TriggerEvent(event, ...)
        local args = table.pack(...);
        if event == 'imgui:requestGUI' then
            mb['imgui:returnGUI'](args[2], GUI(table.pack(...)[1], {}));
        elseif event == 'imgui:requestComponent' then
            local component = GUIPanel(GUI(args[1], {}), {
                id = args[2],
                type = "vertical",
            });
            mb['imgui:returnComponent'](args[3], component);
        end
    end
end

AddEventHandler("imgui:returnGUI", function(rid, item)
    if (Requests[rid]) then
        if item then
            local gui = GUI(item.id, item);
            if Store[item.id] then
                Store[item.id].gui = gui;
            else
                Store[item.id] = {
                    gui = gui,
                    components = {},
                }
            end
            Requests[rid].cb(gui);
        else
            Store[Requests[rid].id] = nil;
            Requests[rid].cb(nil);
        end
    end
    Requests[rid] = nil;
end)

AddEventHandler("imgui:returnComponent", function(rid, item)
    if not Requests[rid] then
        return
    end
    local gui = Requests[rid] and Requests[rid].gui or nil;
    print('ret comp', rid, item)
    if (Requests[rid] and item) then
        if not gui then
            error("No GUI on return");
        end
        local component;
        if item.type == "horizontal" or item.type == "vertical" then
            component = GUIPanel(gui, item)
        elseif item.type == "text" then
            component = GUIText(gui, item.id, item.value, item);
        elseif item.type == "input" then
            component = GUIInput(gui, item.id, item.value, item);
        elseif item.type == "check" then
            component = GUICheck(gui, item.id, item.checked, item);
        elseif item.type == "select" then
            component = GUISelect(gui, item.id, item.value, item.options, item);
        elseif item.type == "button" then
            component = GUIButton(gui, item.id, item.text, item);
        else
            error("Wrong component type on return: " .. (item and item.type or 'nil'));
        end

        if Store[gui.id] then
            Store[gui.id].components[item.id] = component;
        end
        Requests[rid].cb(component);
    end
    if not item then
        Requests[rid].cb(nil);
        if gui then
            Store[gui.id] = nil;
        end
    end
    Requests[rid] = nil;
end)

AddEventHandler('gui:componentTrigger', function(guiid, componentId, event, value)
    if Store[guiid] and Store[guiid].components[componentId] then
        Store[guiid].components[componentId].TriggerEvent(event, value);
    end
end)

AddEventHandler('gui:returnValue', function(rid, value)
    if Requests[rid] then
        Requests[rid](value);
    end
end)

ImGUI = {
    GetGUI = function(id, cb)
        local rid = 'gui_' .. id;
        Requests[rid] = {
            id = id,
            cb = cb,
        }
        TriggerEvent('imgui:requestGUI', id, rid);
    end,
    CreateGUI = function(id, init)
        if not init then
            init = {}
        end
        init.id = id;
        return GUI(id, init).Deploy();
    end,
}

---------------------------------------
function GUI(id, init)
    local this = {
        id = id,
        init = init,
    }

    if Store[id] then
        Store[id].gui = this;
    else
        Store[id] = {
            gui = this,
            components = {},
        }
    end

    function this.GetComponentById(id, cb)
        if Store[this.id].components[id] then
            return cb(Store[this.id].components[id])
        end
        local rid = "comp_" .. this.id .. '_' .. id;
        Requests[rid] = {
            gui = this,
            cb = cb,
        }
        TriggerEvent('imgui:requestComponent', this.id, id, rid);
    end

    function this.GetComponentValueById(id, cb)
        local rid = "value_" .. this.id .. '_' .. id;
        Requests[rid] = cb;
        TriggerEvent('imgui:requestValue', this.id, id, rid);
    end

    function this.UpdateComponentById(id, updateTable)
        if type(updateTable) ~= 'table' then
            error("UpdateComponentById: UpdateTable must be table")
        end
        TriggerEvent('imgui:updateComponent', this.id, id, updateTable);
    end

    function this.AddComponent(parent, component)
        print("ADD", 'imgui:addComponent', this.id, parent.id, json.encode(component.JSON()))
        TriggerEvent('imgui:addComponent', this.id, parent.id, component.JSON())
    end

    function this.Deploy()
        TriggerEvent('imgui:deployGUI', this.id, this.JSON())
        return this;
    end

    this.nextComponentID = 0;
    function this.GetNextComponentID()
        this.nextComponentID = this.nextComponentID + 1;
        return this.nextComponentID;
    end

    function this.JSON()
        local json = {
            id = this.id,
            contents = {},
        }
        for key, value in pairs(this.init) do
            json[key] = value;
        end
        return json;
    end

    return this;
end

----------------------------------------
function GUIPanel(gui, init)
    local this = {}
    this.id = init.id;
    this.init = init;
    this.type = init.type;
    this.gui = gui;

    print('panel', gui.id, Store[gui.id].components)

    Store[gui.id].components[this.id] = this;

    function this.AddPanel(id, type, init)
        if init then
            init.type = type;
            init.id = id;
        else
            init = {
                type = type,
                id = id,
            }
        end
        local component = GUIPanel(gui, init);
        this.gui.AddComponent(this, component);
        return component;
    end

    function this.AddText(id, text, init)
        local component = GUIText(gui, id, text, init);
        this.gui.AddComponent(this, component);
        return component;
    end

    function this.AddInput(id, value, init)
        local component = GUIInput(gui, id, value, init);
        this.gui.AddComponent(this, component);
        return component;
    end

    function this.AddFloat(id, value, min, max, step, init)
        local component = GUIFloat(gui, id, value, min, max, step, init);
        this.gui.AddComponent(this, component);
        return component;
    end

    function this.AddCheck(id, value, init)
        local component = GUICheck(gui, id, value, init);
        this.gui.AddComponent(this, component);
        return component;
    end

    function this.AddDivider(id)
        local component = GUIDivider(gui, id);
        this.gui.AddComponent(this, component);
        return component;
    end

    function this.AddButton(id, text, init)
        local component = GUIButton(gui, id, text, init);
        this.gui.AddComponent(this, component);
        return component;
    end

    function this.AddSelect(id, value, options, init)
        local component = GUISelect(gui, id, value, options, init);
        this.gui.AddComponent(this, component);
        return component;
    end

    function this.JSON()
        local json = {
            id = this.id,
            type = this.type,
            contents = {},
        }
        for key, value in pairs(this.init) do
            json[key] = value;
        end
        return json;
    end

    return this;
end
----------------------------------------
function GUIText(gui, id, text, init)
    local this = {}
    this.id = id or ('text_'..gui.GetNextComponentID());
    this.init = init or {};
    this.gui = gui;
    if type(text) ~= "string" then
        error("GUIText value must be string")
    end
    this.text = text;

    Store[gui.id].components[this.id] = this;

    function this.SetText(text)
        if type(text) ~= "string" then
            error("GUIText value must be string")
        end
        this.text = text;
        this.gui.UpdateComponentById(this.id, {
            value = text,
        });
    end

    function this.JSON()
        local json = {
            id = this.id,
            type = 'text',
            value = this.text,
        }
        for key, value in pairs(this.init) do
            json[key] = value;
        end
        return json;
    end

    return this;
end
----------------------------------------
function GUIDivider(gui, id)
    local this = {}
    this.id = id or ('divider_'..gui.GetNextComponentID());
    this.gui = gui;

    Store[gui.id].components[this.id] = this;

    function this.JSON()
        return {
            id = this.id,
            type = 'divider',
        };
    end

    return this;
end

----------------------------------------
function GUIFloat(gui, id, value, min, max, step, init)
    local this = {}
    this.id = id;
    this.init = init or {};
    this.gui = gui;
    if type(value) ~= "number" then error("GUIFloat value must be number"); end
    this.value = value;
    if type(min) ~= "number" then error("GUIFloat min must be number"); end
    this.min = min;
    if type(max) ~= "number" then error("GUIFloat max must be number"); end
    this.max = max;
    if type(step) ~= "number" then error("GUIFloat step must be number"); end
    this.step = step;

    Store[gui.id].components[this.id] = this;

    function this.GetValue(cb)
        this.gui.GetComponentValueById(this.id, cb);
    end

    function this.SetValue(value)
        if type(value) ~= "number" then
            error("GUIFloat value must be number")
        end
        this.value = value;
        this.gui.UpdateComponentById(this.id, {
            value = value,
        });
    end

    function this.JSON()
        local json = {
            id = this.id,
            type = 'float',
            value = this.value,
            min = this.min,
            max = this.max,
            step = this.step,
        }
        for key, value in pairs(this.init) do
            json[key] = value;
        end
        return json;
    end

    this.eventListeners = {};
    function this.AddEventListener(event, callback)
        this.eventListeners[event] = callback;
    end

    function this.TriggerEvent(event, value)
        if this.eventListeners[event] then
            this.value = value;
            this.eventListeners[event](value)
        end
    end

    return this;
end

----------------------------------------
function GUICheck(gui, id, checked, init)
    local this = {}
    this.id = id;
    this.init = init or {};
    this.gui = gui;
    if type(checked) ~= "boolean" then
        error("GUICheck value must be boolean | " .. (tostring(checked) or 'NULL'))
    end
    this.checked = checked;

    Store[gui.id].components[this.id] = this;

    function this.GetValue(cb)
        this.gui.GetComponentValueById(this.id, cb);
    end

    function this.SetChecked(checked)
        if type(checked) ~= "boolean" then
            error("GUICheck value must be boolean | " .. (tostring(checked) or 'NULL'))
        end
        this.checked = checked;
        this.gui.UpdateComponentById(this.id, {
            checked = checked,
        });
    end

    function this.IsChecked()
        return this.checked;
    end

    function this.JSON()
        local json = {
            id = this.id,
            type = 'check',
            checked = this.checked,
        }
        for key, value in pairs(this.init) do
            json[key] = value;
        end
        return json;
    end

    this.eventListeners = {};
    function this.AddEventListener(event, callback)
        this.eventListeners[event] = callback;
    end

    function this.TriggerEvent(event, value)
        if this.eventListeners[event] then
            this.checked = value;
            this.eventListeners[event](value)
        end
    end

    return this;
end


----------------------------------------
function GUIInput(gui, id, value, init)
    local this = {}
    this.id = id;
    this.init = init or {};
    this.gui = gui;
    if type(value) ~= "string" then
        error("GUIInput value must be string | ")
    end
    this.value = value;

    Store[gui.id].components[this.id] = this;

    function this.GetValue(cb)
        this.gui.GetComponentValueById(this.id, cb);
    end

    function this.SetValue(value)
        if type(value) ~= "string" then
            error("GUIInput value must be string | ")
        end
        this.value = value;
        this.gui.UpdateComponentById(this.id, {
            value = value,
        });
    end

    function this.JSON()
        local json = {
            id = this.id,
            type = 'input',
            value = this.value,
        }
        for key, value in pairs(this.init) do
            json[key] = value;
        end
        return json;
    end

    this.eventListeners = {};
    function this.AddEventListener(event, callback)
        this.eventListeners[event] = callback;
    end

    function this.TriggerEvent(event, value)
        if this.eventListeners[event] then
            this.value = value;
            this.eventListeners[event](value)
        end
    end

    return this;
end

----------------------------------------
function GUIButton(gui, id, text, init)
    local this = {}
    this.id = id;
    this.init = init or {};
    this.gui = gui;
    if type(text) ~= "string" then
        error("GUIButton text must be string | ")
    end
    this.text = text;

    Store[gui.id].components[this.id] = this;

    function this.SetText(text)
        if type(text) ~= "string" then
            error("GUIButton value must be string | ")
        end
        this.text = text;
        this.gui.UpdateComponentById(this.id, {
            text = text,
        });
    end

    function this.JSON()
        local json = {
            id = this.id,
            type = 'button',
            text = this.text,
        }
        for key, value in pairs(this.init) do
            json[key] = value;
        end
        return json;
    end

    this.eventListeners = {};
    function this.AddEventListener(event, callback)
        this.eventListeners[event] = callback;
    end

    function this.TriggerEvent(event)
        if this.eventListeners[event] then
            this.eventListeners[event]()
        end
    end

    return this;
end

----------------------------------------
function GUISelect(gui, id, value, options, init)
    local this = {}
    this.id = id;
    this.init = init or {};
    this.gui = gui;
    this.value = value;
    this.options = options;

    Store[gui.id].components[this.id] = this;

    function this.SetValue(value)
        this.value = value;
        this.gui.UpdateComponentById(this.id, {
            value = value,
        });
    end

    function this.JSON()
        local json = {
            id = this.id,
            type = 'select',
            value = this.value,
            options = this.options,
        }
        for key, value in pairs(this.init) do
            json[key] = value;
        end
        return json;
    end

    this.eventListeners = {};
    function this.AddEventListener(event, callback)
        this.eventListeners[event] = callback;
    end

    function this.TriggerEvent(event, value)
        if this.eventListeners[event] then
            this.eventListeners[event](value)
        end
    end

    return this;
end
