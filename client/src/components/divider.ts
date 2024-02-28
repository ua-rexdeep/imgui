import { API } from '../api';
import { ImGUI } from '../imgui';

export interface GUIDividerInit {
    
}
export class GUIDivider {
    API = new API();
    constructor(
        private readonly GUI: ImGUI, 
        public readonly componentID: string | number, 
        private data?: GUIDividerInit) {
    }

    get type() { return 'divider'; };
    get id() { return this.componentID; }
    GetGUI() { return this.GUI; }

    JSON() {
        return {
            id: this.id,
            type: this.type,
            ...this.data,
        };
    }
}