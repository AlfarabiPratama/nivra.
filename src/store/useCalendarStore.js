import { create } from "zustand";
import { persist } from "zustand/middleware";
import { HOLIDAYS, getHolidaysForMonth } from "../constants/holidays";

const fetchHolidaysFromApi = async (country, year) => {
  // Preferred: DayOff API (Indonesia only, no API key)
  if (country.toLowerCase() === "id") {
    try {
      const dayOffUrl = `https://dayoffapi.vercel.app/api?year=${year}`;
      const res = await fetch(dayOffUrl, {
        signal: AbortSignal.timeout(5000), // 5 second timeout
      });
      if (!res.ok) throw new Error("dayoffapi error");
      const list = await res.json();
      return (list || []).map((h) => ({
        country: "id",
        year,
        date: h.tanggal,
        label: h.keterangan || "Libur",
        type: h.is_cuti ? "national" : "national",
      }));
    } catch (error) {
      console.warn("DayOff API failed:", error.message);
      return null;
    }
  }

  // Fallback: Api Ninjas (requires key)
  const apiKey = import.meta.env.VITE_HOLIDAY_API_KEY;
  if (!apiKey) return null;

  try {
    const url = `https://api.api-ninjas.com/v1/holidays?country=${country.toUpperCase()}&year=${year}`;
    const res = await fetch(url, {
      headers: {
        "X-Api-Key": apiKey,
      },
      signal: AbortSignal.timeout(5000),
    });
    if (!res.ok) throw new Error("holiday API error");
    const data = await res.json();
    return data.map((h) => ({
      country: country.toLowerCase(),
      year,
      date: h.date,
      label: h.name,
      type: h.type?.toLowerCase().includes("national")
        ? "national"
        : "international",
    }));
  } catch (error) {
    console.warn("Holiday API failed:", error.message);
    return null;
  }
};

export const useCalendarStore = create(
  persist(
    (set, get) => ({
      showAgenda: false,
      showHolidays: false,
      showIntlHolidays: false,
      holidayCountry: "id",
      holidayCache: {}, // key: `${country}-${year}` -> holidays[]
      loadingHolidays: false,
      holidayError: null,

      setPreference: (key, value) => set({ [key]: value }),

      ensureHolidays: async (country, year) => {
        const key = `${country}-${year}`;
        const cache = get().holidayCache[key];
        if (cache && cache.length > 0) return cache;

        set({ loadingHolidays: true, holidayError: null });
        try {
          const apiData = await fetchHolidaysFromApi(country, year);
          const source =
            apiData ||
            HOLIDAYS.filter(
              (h) => h.country === country || h.country === "global"
            ).filter((h) => h.year === year);

          set((state) => ({
            holidayCache: { ...state.holidayCache, [key]: source },
            loadingHolidays: false,
          }));
          return source;
        } catch (error) {
          set({
            holidayError: error.message,
            loadingHolidays: false,
          });
          // Fallback to bundled list
          const fallback = HOLIDAYS.filter(
            (h) => h.country === country || h.country === "global"
          ).filter((h) => h.year === year);
          set((state) => ({
            holidayCache: { ...state.holidayCache, [key]: fallback },
          }));
          return fallback;
        }
      },

      getMonthHolidays: (year, month, countries = ["id", "global"]) => {
        const { holidayCache } = get();
        const all = countries.flatMap((c) => {
          const key = `${c}-${year}`;
          const cached = holidayCache[key];
          if (cached) return cached;
          return getHolidaysForMonth(year, month, [c]);
        });
        return all.filter(
          (h) => new Date(h.date).getMonth() === month && h.year === year
        );
      },
    }),
    { name: "calendar-preferences" }
  )
);
