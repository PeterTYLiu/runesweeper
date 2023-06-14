import { createContext, useContext, type Dispatch } from "react";
import { sizesDict, difficultiesDict } from "../utils/settings";

export interface Settings {
  mineRatio: number;
  numOfRows: number;
  numOfColumns: number;
  swipeToFlag: boolean;
  swipeToChord: boolean;
  allowMaybe: boolean;
  instalose: boolean;
  isLandscape: boolean;
}

interface SettingsContextType {
  settings: Settings;
  setSettings: Dispatch<Settings>;
}

export const defaultSettings: Settings = {
  numOfColumns: sizesDict.m.h,
  numOfRows: sizesDict.m.w,
  mineRatio: difficultiesDict.medium.mineRatio,
  swipeToChord: true,
  swipeToFlag: true,
  allowMaybe: true,
  instalose: false,
  isLandscape: false,
};

const defaultValue: SettingsContextType = {
  settings: defaultSettings,
  setSettings: () => {},
};

export const SettingsContext = createContext(defaultValue);

export function useSettingsContext() {
  const { settings, setSettings } = useContext(SettingsContext);
  return { settings, setSettings };
}
