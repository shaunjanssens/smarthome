// @flow
export type DeviceType = {
  id: string,
  name: string,
  platform: string,
  state: string,
  type: string
};

export type SensorType = {
  id: string,
  platform: string,
  type: string,
  value: string
};

export type RoomType = {
  id: string,
  name: string,
  devices: array<string>
};

export type PageType = {
  index: number,
  id: string,
  name: string,
  next?: string,
  devices?: Array<string>
};

export type SystemType = {
  name: string,
  description: string
};
