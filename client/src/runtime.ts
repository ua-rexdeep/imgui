import { Threads } from './threads';

let IsNUICursor = false;
export class MainRuntime {
    constructor(
        readonly threads: Threads,
    ) {
        threads.AddThread('MainRuntime', this.tick.bind(this));

        RegisterNuiCallback('nuifocus', () => {
            IsNUICursor = false;
            SetNuiFocus(IsNUICursor, IsNUICursor);
            // SetNuiFocusKeepInput(true);
        });
    }

    private tick() {

        const IsALTPressed = (IsControlPressed(0, 19) || IsDisabledControlPressed(0, 19));
        if(IsALTPressed) DisableControlAction(1, 267, true);

        if(IsDisabledControlJustPressed(1, 267) && IsALTPressed) {
            IsNUICursor = !IsNUICursor;
            SetNuiFocus(IsNUICursor, IsNUICursor);
            // SetNuiFocusKeepInput(true);
        }

        if(IsNUICursor) {
            DisableControlAction(1, 257, IsNUICursor);
            DisableControlAction(1, 37, IsNUICursor);
            DisableControlAction(1, 24, IsNUICursor);
            DisableControlAction(1, 25, IsNUICursor);
            DisableControlAction(1, 17, IsNUICursor);
            DisableControlAction(1, 16, IsNUICursor);
        }
    }
}