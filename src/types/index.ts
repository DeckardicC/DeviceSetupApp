export type DeviceType = 'callPanel' | 'camera';
export type DeviceSubtype = 'mainEntrance' | 'gate' | 'external' | 'internal';

export interface Device {
  id: string;
  name: string;
  type: DeviceType;
  subtype: DeviceSubtype;
  isConfigured: boolean;
}

export interface Commutator {
  id: string;
  name: string;
  availablePorts: number;
}

export interface Port {
  id: number;
  name: string;
  isAvailable: boolean;
  isDisconnected?: boolean;
}

