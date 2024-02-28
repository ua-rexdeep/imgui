import { API } from './api';

export class GUI {

    static DefaultTitleBackground = '#0a0a0a';

    static MinWidth = 240;
    static get MaxWidth() { return window.innerWidth; };

    static MinHeight = 120;
    static get MaxHeight() { return window.innerHeight; };

    _id;
    _title;
    _titleBackground;
    _width = 120;
    _height = 240;
    _contents = [];
    _X = 0;
    _Y = 0;
    _collapsed = false;
    _resizeAllowed = false;

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
    constructor(id, init) {
        if(typeof(id) != "string") throw new Error("ID must be a string");
        this._id = id;

        if(typeof(init) != "object") throw new Error("Init param is not an object");
        if(Array.isArray(init)) throw new Error("Init param can not be array");
        
        this.SetTitle(init.title);
        if(init.titleBackground) this.SetTitleBackground(init.titleBackground)

        this.Resize(init.width, init.height);
        this.SetContents(init.contents);

        this._resizeAllowed = !!init.resize;

        let collapseState = !!init.collapsed;

        try {
            const localData = JSON.parse(localStorage.getItem(`imgui_${id}`) || '{}');
            if(localData.x != null && localData.y != null) this.Move(localData.x, localData.y);
            if(localData.collapsed == 0) collapseState = false;
            if(localData.collapsed == 1) collapseState = true;
        } catch(e) { /** empty */ }

        collapseState ? this.Collapse() : this.Expand();
    }

    /**
     * @param {string} title
     */
    SetTitle(title) {
        if(typeof(title) != "string") throw new Error("Title must be a string");
        this._title = title;
    }

    SetTitleBackground(background) {
        // TODO: check
        this._titleBackground = background;
    }
    GetTitleBackground() { return this._titleBackground || this.GetDefaultTitleBackground(); }
    GetDefaultTitleBackground() { return GUI.DefaultTitleBackground; }

    /**
     * 
     * @param {number} width 240 <> 1920
     * @param {number} height 120 <> 1080
    */
    Resize(width, height) {
        if(typeof(width) != "number") throw new Error("Width must be a number");
        if(width < GUI.MinWidth || width > GUI.MaxWidth) throw new Error(`Width must be between ${GUI.MinWidth} and ${GUI.MaxWidth}`);
        if(typeof(width) != "number") throw new Error("Width must be a number");
        if(height < GUI.MinHeight || height > GUI.MaxHeight) throw new Error(`Height must be between ${GUI.MinHeight} and ${GUI.MaxHeight}`);

        this._width = width;
        this._height = height;
    }

    /**
     * @param {Array} contents
     */
    SetContents(contents) {
        if(typeof(contents) != "object") throw new Error("Contents must be an object");
        
        if(Array.isArray(contents)) contents = {
            type: 'vertical',
            content: contents,
            id: 'main',
            height: 100,
        }

        this._contents = contents;
    }

    GetID() { return this._id; }
    GetWidth() { return this._width; }
    GetHeight() { return this._collapsed ? 20 : this._height; }
    GetTitle() { return this._title; }
    GetX() { return this._X }
    GetY() { return this._Y }
    Move(x, y) {
        // TODO: bounds
        this._X = x;
        this._Y = y;

        localStorage.setItem(`imgui_${this.GetID()}`, JSON.stringify({ x, y, collapsed: this._collapsed }));
    }

    Collapse() {
        this._collapsed = true;
        localStorage.setItem(`imgui_${this.GetID()}`, JSON.stringify({ x: this._X, y: this._Y, collapsed: 1 }));
    }

    Expand() {
        this._collapsed = false;
        localStorage.setItem(`imgui_${this.GetID()}`, JSON.stringify({ x: this._X, y: this._Y, collapsed: 0 }));
    }

    IsCollapsed() {
        return this._collapsed;
    }

    GetContent() {
        return this._contents;
    }

    UpdateContentById(id, content) {
        // console.log(`Update content for gui(${this.GetID()}) component(${id}) set `, content, this);
        this._NextUpdateContent(this._contents.content, id, content);
    }

    GetContentById(id) {
        // console.log(`Get content for gui(${this.GetID()}) component(${id})`, this);
        return this._NextGetContent(this._contents.content, id);
    }

    _NextUpdateContent(data, id, newValue) {
        for (let i = 0; i < data.length; i++) {
            const item = data[i];
            if(item.id == id) {
                data[i] = {
                    ...item,
                    ...newValue,
                };
            } else if(item.type == 'vertical' || item.type == 'horizontal') {
                this._NextUpdateContent(item.content, id, newValue);
            }
        }
    }

    _NextGetContent(data, id) {
        for (let i = 0; i < data.length; i++) {
            const item = data[i];
            if(item.id == id) {
                return item;
            } else if(item.type == 'vertical' || item.type == 'horizontal') {
                return this._NextGetContent(item.content, id);
            }
        }
    }

    OnAction(id, actionType, value) {
        const api = new API();

        if(!id) return console.error("No component id for action", this.GetID(), actionType, value);
        console.warn("OnAction", this.GetID(), id, actionType, value);
        api.SendComponentAction(this.GetID(), id, actionType, value);
    }

    IsResizeAllowed() {
        return this._resizeAllowed;
    }
}

window.GUI = GUI;