import { GUICheck } from '../components/check';
import { GUIFloat } from '../components/float';
import { ImGUI } from '../imgui';
import { GUIService } from './guiService';

export class VehicleService {
    private store: Record<number, ImGUI> = {};
    constructor(
        private readonly guiService: GUIService,
    ){}

    CreateVehicleGUI(vehicle: number) {
        const Vehicle = this.guiService.Create(`vehicle${vehicle}`, {
            title: `Vehicle: ${vehicle} | Network: ${NetworkGetEntityIsNetworked(vehicle) ? `%lime%${NetworkGetNetworkIdFromEntity(vehicle)}` : '%red%local'}`,
            width: 500,
            height: 300,
        });
        
        Vehicle.AddText('vehicleModelText', `Model: ${GetDisplayNameFromVehicleModel(GetEntityModel(vehicle))}`);
        const [x,y,z] = GetEntityCoords(vehicle);
        Vehicle.AddText('vehiclePositionText', `XYZ: ${ x.toFixed(2) }, ${y.toFixed(2)}, ${z.toFixed(2)}`, { userSelect: true });
        Vehicle.AddText('vehicleDistanceText', 'Distance: 0 (0km)', { userSelect: true });
        
        const RotationPanel = Vehicle.AddPanel(null, 'horizontal');
        RotationPanel.AddText(null, 'Rotation(order 2):');
        
        const [ rx, ry, rz ] = GetEntityRotation(vehicle, 2);
        const XYZPanel = RotationPanel.AddPanel(null, 'vertical', { width: 50 });
        XYZPanel.AddFloat('vehicleRotationX', rx, 0, 360, 1, { override: 'X: %' })
            .On('change', (_, { value }) => SetEntityRotation(vehicle, value, ry, rz, 2, false));
        XYZPanel.AddFloat('vehicleRotationY', ry, 0, 360, 1, { override: 'Y: %' })
            .On('change', (_, { value }) => SetEntityRotation(vehicle, rx, value, rz, 2, false));
        XYZPanel.AddFloat('vehicleRotationZ', rz, 0, 360, 1, { override: 'Z: %' })
            .On('change', (_, { value }) => SetEntityRotation(vehicle, rx, ry, value, 2, false));
        
        const FreezePanel = Vehicle.AddPanel(null, 'horizontal');
        FreezePanel.AddText(null, 'Freeze:');
        FreezePanel.AddCheck('vehicleFreezeCheck', false).On('change', (_, { value }) => {
            FreezeEntityPosition(vehicle, value);
        });
        
        const DrawPanel = Vehicle.AddPanel(null, 'horizontal');
        DrawPanel.AddText(null, 'DrawLine:');
        DrawPanel.AddCheck('vehicleDrawLineCheck', false);
        DrawPanel.AddFloat('vehicleDrawFloatR', 0, 0, 255, 1, { override: 'R: %', width: 25 }).On('change', (_, { value }) => console.log('RGB', value));
        DrawPanel.AddFloat('vehicleDrawFloatG', 0, 0, 255, 1, { override: 'G: %', width: 25 }).On('change', (_, { value }) => console.log('RGB', value));
        DrawPanel.AddFloat('vehicleDrawFloatB', 0, 0, 255, 1, { override: 'B: %', width: 25 }).On('change', (_, { value }) => console.log('RGB', value));
        
        const PlatePanel = Vehicle.AddPanel(null, 'horizontal');
        PlatePanel.AddText(null, 'Plate number:');
        PlatePanel.AddInput(null, GetVehicleNumberPlateText(vehicle), { onEnter: true })
            .On('enter', (context, { value }) => {
                console.log('text', value);
                SetVehicleNumberPlateText(vehicle, value);
            });
        
        // const FuelPanel = Vehicle.AddPanel('fuelPanel', 'horizontal');
        // FuelPanel.AddText(null, 'Fuel level:');
        // FuelPanel.AddFloat('vehicleFuelFloat', 0, 0, 64, 0.01, { override: '%L / 0L', width: 50 });
        
        Vehicle.AddDivider();
        
        const ActionsPanel = Vehicle.AddPanel('actionsPanel', 'horizontal');
        ActionsPanel.AddButton(null, 'Warp into vehicle').On('click', () => {
            TaskWarpPedIntoVehicle(GetPlayerPed(-1), vehicle, -1);
        });
        ActionsPanel.AddButton(null, 'Warp to me').On('click', () => {
            const [x,y,z] = GetEntityCoords(GetPlayerPed(-1));
            SetEntityCoords(vehicle, x, y, z, true, false, false, false);;
        });
        ActionsPanel.AddButton(null, 'DELETE', { style: 'error' }).On('click', () => {
            SetEntityAsMissionEntity(vehicle, true, true);
            DeleteEntity(vehicle);
        });

        return Vehicle;
    }

    DeleteVehicleGUI(vehicle: number) {
        delete this.store[vehicle];
    }

    GetVehicleGUI(vehicle: number) {
        return this.store[vehicle];
    }

    // ---------------

    IsDrawLineChecked(vehicleGUI: ImGUI) {
        const component = vehicleGUI.GetContentById('vehicleDrawLineCheck');
        
        // console.log('comp', component, component?.IsChecked());
        if(component && component instanceof GUICheck) return component.IsChecked();
        else return false;
    }

    GetDrawLineColors(vehicleGUI: ImGUI) {
        const r = vehicleGUI.GetContentById('vehicleDrawFloatR');
        const g = vehicleGUI.GetContentById('vehicleDrawFloatG');
        const b = vehicleGUI.GetContentById('vehicleDrawFloatB');
        if(r instanceof GUIFloat && g instanceof GUIFloat && b instanceof GUIFloat) {
            return {
                r: r.GetValue(),
                g: g.GetValue(),
                b: b.GetValue(),
            };
        } else return {};
    }
}