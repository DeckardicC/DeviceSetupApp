import {makeAutoObservable} from 'mobx';
import {Device, DeviceType, DeviceSubtype, Commutator, Port} from '../types';

class DeviceStore {
  selectedDeviceType: DeviceType | null = null;
  selectedDeviceSubtype: DeviceSubtype | null = null;
  selectedDevices: Device[] = [];
  selectedCommutator: Commutator | null = null;
  selectedPort: Port | null = null;

  devices: Device[] = [
    {
      id: '1',
      name: 'Подъезд №3',
      type: 'callPanel',
      subtype: 'mainEntrance',
      isConfigured: false,
    },
    {
      id: '2',
      name: 'Подъезд №5',
      type: 'callPanel',
      subtype: 'mainEntrance',
      isConfigured: false,
    },
    {
      id: '3',
      name: 'Калитка №1',
      type: 'callPanel',
      subtype: 'gate',
      isConfigured: false,
    },
    {
      id: '4',
      name: 'Камера №1',
      type: 'camera',
      subtype: 'external',
      isConfigured: false,
    },
    {
      id: '5',
      name: 'Камера №2',
      type: 'camera',
      subtype: 'internal',
      isConfigured: false,
    },
  ];

  commutators: Commutator[] = [
    {id: '1', name: 'Коммутатор 1', availablePorts: 24},
    {id: '2', name: 'Коммутатор 2', availablePorts: 16},
  ];

  constructor() {
    makeAutoObservable(this);
  }

  setDeviceType(type: DeviceType) {
    this.selectedDeviceType = type;
    this.selectedDeviceSubtype = null;
    this.selectedDevices = [];
  }

  setDeviceSubtype(subtype: DeviceSubtype) {
    this.selectedDeviceSubtype = subtype;
    this.selectedDevices = [];
  }

  toggleDeviceSelection(device: Device) {
    const index = this.selectedDevices.findIndex(d => d.id === device.id);
    if (index > -1) {
      this.selectedDevices.splice(index, 1);
    } else {
      this.selectedDevices.push(device);
    }
  }

  isDeviceSelected(device: Device): boolean {
    return this.selectedDevices.some(d => d.id === device.id);
  }

  setCommutator(commutator: Commutator) {
    this.selectedCommutator = commutator;
  }

  setPort(port: Port) {
    this.selectedPort = port;
  }

  reset() {
    this.selectedDeviceType = null;
    this.selectedDeviceSubtype = null;
    this.selectedDevices = [];
    this.selectedCommutator = null;
    this.selectedPort = null;
  }

  completeConfiguration() {
    this.selectedDevices.forEach(device => {
      const deviceInStore = this.devices.find(d => d.id === device.id);
      if (deviceInStore) {
        deviceInStore.isConfigured = true;
      }
    });
    this.reset();
  }
}

export const deviceStore = new DeviceStore();

