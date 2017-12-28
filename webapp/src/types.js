// @flow
export type DeviceType = {
  platform: string,
  name: string,
  topic: string
};

export type PageType = {
  title: string,
  platform?: string,
  next?: string
};

export type SystemType = {
  name: string,
  description: string
};
