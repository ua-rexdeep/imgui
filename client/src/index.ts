// import { json, urlencoded } from 'body-parser';
// import * as cors from 'cors';
// import * as express from 'express';

import { MainRuntime } from './runtime';
import { GUIService } from './services/guiService';
import { Threads } from './threads';

const threads = new Threads();
const service = new GUIService();

type GUINUICallback = {
    GUIID: string,
    actionType: string,
    componentID: string | number,
}

if(process.env.NODE_ENV == 'production') {
    RegisterNuiCallback('event', ({ GUIID, actionType, componentID, ...data }: GUINUICallback) => {
        if(actionType == '__internal__') {
            service.DeleteById(GUIID);
            return;
        }
        const gui = service.GetByID(GUIID);
        if(gui != null) {
            const component = gui.GetContentById(componentID);
            if(component && 'Trigger' in component) component.Trigger(actionType as never, data);
        }
    });

    setTimeout(() => {
        new MainRuntime(threads);
    }, 100);
}

// if(process.env.NODE_ENV == 'development') {
//     const app = express();
//     app.use(cors());
//     app.use(urlencoded({ extended: false }));
//     app.use(json());

//     const Vehicle = service.Create('vehicle', {
//         title: 'Vehicle: ?',
//         height: 500,
//         width: 400,
//     });

//     app.get('/', (req: any, res: any) => {
//         res.json(Vehicle.JSON());
//     });

//     app.post('/event', (req: any, res: any) => {
//         const { GUIID, componentID, actionType, ...data } = req.body;
//         const gui = service.GetByID(GUIID);
//         if(gui != null) {
//             const component = gui.GetContentById(componentID);
//             if(component && 'Trigger' in component) component.Trigger(actionType as never, data);
//         }
//         res.end();
//     });

//     setInterval(() => {
//         console.clear();
//         console.log(JSON.stringify(Vehicle.JSON(), null, 4));
//     }, 1000);

//     app.listen(3000, () => console.log('RUNNING'));
// }