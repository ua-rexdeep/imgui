import { GUIService } from './services/guiService';
import { VehicleService } from './services/vehicleService';
import { Threads } from './threads';

export class VehicleRuntime {
    constructor(
        readonly threads: Threads,
        private readonly guiService: GUIService,
    ) {
        threads.AddThread('VehicleRuntime', this.tick.bind(this));

        const service = new VehicleService(guiService);

        on('ImGUI:AddVehicleGUI', (vehicle: number) => {
            service.CreateVehicleGUI(vehicle).Deploy();
        });
    }

    private tick() {

    }
}