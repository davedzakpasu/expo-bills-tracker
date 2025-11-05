import AsyncStorage from "@react-native-async-storage/async-storage";
import { useCallback, useEffect, useState } from "react";

type ExchangeRateResult = {
  rate: number;
  loading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
};

const CACHE_KEY_PREFIX = "@exchange_rate_";

export function useExchangeRate(
  base: string,
  target: string
): ExchangeRateResult {
  const [rate, setRate] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const key = `${CACHE_KEY_PREFIX}${base}_${target}`;

  const fetchRate = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      // 1️⃣ Try cached value first
      const cached = await AsyncStorage.getItem(key);
      if (cached) {
        setRate(parseFloat(cached));
        setLoading(false);
      }

      // 2️⃣ Fetch fresh rate (ExchangeRate-API first, fallback to Frankfurter)
      let apiUrl = `https://open.er-api.com/v6/latest/${base.toUpperCase()}`;

      let res = await fetch(apiUrl);
      if (!res.ok) throw new Error("ExchangeRate-API failed");
      let data = await res.json();

      let fetchedRate = data.rates?.[target.toUpperCase()];
      if (!fetchedRate) {
        // fallback to Frankfurter
        const fallbackRes = await fetch(
          `https://api.frankfurter.app/latest?from=${base}&to=${target}`
        );
        if (!fallbackRes.ok) throw new Error("Fallback failed");
        const fallbackData = await fallbackRes.json();
        fetchedRate = fallbackData.rates?.[target.toUpperCase()];
      }

      if (fetchedRate) {
        await AsyncStorage.setItem(key, fetchedRate.toString());
        setRate(fetchedRate);
      } else {
        throw new Error("Invalid rate data");
      }
    } catch (err: any) {
      console.warn("Exchange rate fetch error:", err.message);
      const cached = await AsyncStorage.getItem(key);
      if (cached) {
        setRate(parseFloat(cached));
        setError("Offline mode — Using cached rate.");
      } else {
        setError("Rate fetch failed. No internet or cache available.");
        setRate(0);
      }
    } finally {
      setLoading(false);
    }
  }, [base, target, key]);

  useEffect(() => {
    fetchRate();
  }, [fetchRate]);

  return { rate, loading, error, refresh: fetchRate };
}
