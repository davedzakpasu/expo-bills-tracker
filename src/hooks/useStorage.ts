import AsyncStorage from "@react-native-async-storage/async-storage";

export async function saveJSON(key: string, value: any) {
  try {
    await AsyncStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.warn("saveJSON error", e);
  }
}

export async function loadJSON<T = any>(key: string): Promise<T | null> {
  try {
    const v = await AsyncStorage.getItem(key);
    return v ? (JSON.parse(v) as T) : null;
  } catch (e) {
    console.warn("loadJSON error", e);
    return null;
  }
}
