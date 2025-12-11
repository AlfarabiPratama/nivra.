/**
 * PANDUAN UPDATE HARI LIBUR & HARI PENTING
 * ==========================================
 *
 * File ini berisi data hari libur nasional Indonesia dan hari penting internasional.
 *
 * CARA UPDATE UNTUK TAHUN BARU:
 * 1. Tambahkan data holiday baru di array HOLIDAYS dengan format yang sama
 * 2. HOLIDAY_YEARS akan otomatis update (auto-generated dari data)
 * 3. Deploy aplikasi, tidak perlu update code lain
 *
 * FORMAT DATA:
 * {
 *   country: "id" | "global",      // id = Indonesia, global = Internasional
 *   year: 2027,                     // Tahun (YYYY)
 *   date: "2027-01-01",            // Format: YYYY-MM-DD
 *   label: "Tahun Baru Masehi",    // Nama hari libur/penting
 *   type: "national" | "international"  // Jenis (libur nasional atau hari internasional)
 * }
 *
 * SUMBER DATA:
 * - Indonesia: https://dayoffapi.vercel.app/ (auto-fetch jika API aktif)
 * - Fallback: Data manual di file ini
 * - International: https://www.un.org/en/observances/international-days
 *
 * HARI INTERNASIONAL YANG SUDAH ADA:
 * - New Year's Day (1 Jan)
 * - Valentine's Day (14 Feb)
 * - International Women's Day (8 Mar) - Hari Perempuan Sedunia
 * - World Poetry Day (21 Mar) - Hari Puisi Sedunia
 * - Earth Day (22 Apr) - Hari Bumi
 * - Labour Day (1 Mei) - Hari Buruh Sedunia
 * - World Environment Day (5 Jun) - Hari Lingkungan Hidup Sedunia
 * - World Population Day (11 Jul) - Hari Kependudukan Sedunia
 * - International Youth Day (12 Ags) - Hari Pemuda Internasional
 * - International Literacy Day (8 Sep) - Hari Aksara Internasional
 * - World Teachers' Day (5 Okt) - Hari Guru Sedunia
 * - World Food Day (16 Okt) - Hari Pangan Sedunia
 * - International Day for Tolerance (16 Nov) - Hari Toleransi Internasional
 * - Human Rights Day (10 Des) - Hari HAM Sedunia
 */

export const HOLIDAYS = [
  // Indonesia National Holidays 2025
  {
    country: "id",
    year: 2025,
    date: "2025-01-01",
    label: "Tahun Baru Masehi",
    type: "national",
  },
  {
    country: "id",
    year: 2025,
    date: "2025-01-29",
    label: "Tahun Baru Imlek",
    type: "national",
  },
  {
    country: "id",
    year: 2025,
    date: "2025-03-29",
    label: "Hari Suci Nyepi",
    type: "national",
  },
  {
    country: "id",
    year: 2025,
    date: "2025-03-31",
    label: "Isra Miraj",
    type: "national",
  },
  {
    country: "id",
    year: 2025,
    date: "2025-04-18",
    label: "Wafat Isa Al Masih",
    type: "national",
  },
  {
    country: "id",
    year: 2025,
    date: "2025-05-01",
    label: "Hari Buruh Internasional",
    type: "national",
  },
  {
    country: "id",
    year: 2025,
    date: "2025-05-12",
    label: "Kenaikan Isa Al Masih",
    type: "national",
  },
  {
    country: "id",
    year: 2025,
    date: "2025-05-29",
    label: "Hari Raya Waisak",
    type: "national",
  },
  {
    country: "id",
    year: 2025,
    date: "2025-06-01",
    label: "Hari Lahir Pancasila",
    type: "national",
  },
  {
    country: "id",
    year: 2025,
    date: "2025-08-17",
    label: "Hari Kemerdekaan RI",
    type: "national",
  },
  {
    country: "id",
    year: 2025,
    date: "2025-12-25",
    label: "Hari Raya Natal",
    type: "national",
  },

  // International Days 2025
  {
    country: "global",
    year: 2025,
    date: "2025-01-01",
    label: "New Year's Day",
    type: "international",
  },
  {
    country: "global",
    year: 2025,
    date: "2025-02-14",
    label: "Valentine's Day",
    type: "international",
  },
  {
    country: "global",
    year: 2025,
    date: "2025-03-08",
    label: "International Women's Day",
    type: "international",
  },
  {
    country: "global",
    year: 2025,
    date: "2025-03-21",
    label: "World Poetry Day",
    type: "international",
  },
  {
    country: "global",
    year: 2025,
    date: "2025-04-22",
    label: "Earth Day",
    type: "international",
  },
  {
    country: "global",
    year: 2025,
    date: "2025-05-01",
    label: "Labour Day",
    type: "international",
  },
  {
    country: "global",
    year: 2025,
    date: "2025-06-05",
    label: "World Environment Day",
    type: "international",
  },
  {
    country: "global",
    year: 2025,
    date: "2025-07-11",
    label: "World Population Day",
    type: "international",
  },
  {
    country: "global",
    year: 2025,
    date: "2025-08-12",
    label: "International Youth Day",
    type: "international",
  },
  {
    country: "global",
    year: 2025,
    date: "2025-09-08",
    label: "International Literacy Day",
    type: "international",
  },
  {
    country: "global",
    year: 2025,
    date: "2025-10-05",
    label: "World Teachers' Day",
    type: "international",
  },
  {
    country: "global",
    year: 2025,
    date: "2025-10-16",
    label: "World Food Day",
    type: "international",
  },
  {
    country: "global",
    year: 2025,
    date: "2025-11-16",
    label: "International Day for Tolerance",
    type: "international",
  },
  {
    country: "global",
    year: 2025,
    date: "2025-12-10",
    label: "Human Rights Day",
    type: "international",
  },

  // Indonesia National Holidays 2026
  {
    country: "id",
    year: 2026,
    date: "2026-01-01",
    label: "Tahun Baru Masehi",
    type: "national",
  },
  {
    country: "id",
    year: 2026,
    date: "2026-02-17",
    label: "Tahun Baru Imlek",
    type: "national",
  },
  {
    country: "id",
    year: 2026,
    date: "2026-03-11",
    label: "Isra Miraj",
    type: "national",
  },
  {
    country: "id",
    year: 2026,
    date: "2026-03-19",
    label: "Hari Suci Nyepi",
    type: "national",
  },
  {
    country: "id",
    year: 2026,
    date: "2026-04-03",
    label: "Wafat Isa Al Masih",
    type: "national",
  },
  {
    country: "id",
    year: 2026,
    date: "2026-05-01",
    label: "Hari Buruh Internasional",
    type: "national",
  },
  {
    country: "id",
    year: 2026,
    date: "2026-05-14",
    label: "Kenaikan Isa Al Masih",
    type: "national",
  },
  {
    country: "id",
    year: 2026,
    date: "2026-05-21",
    label: "Hari Raya Waisak",
    type: "national",
  },
  {
    country: "id",
    year: 2026,
    date: "2026-06-01",
    label: "Hari Lahir Pancasila",
    type: "national",
  },
  {
    country: "id",
    year: 2026,
    date: "2026-08-17",
    label: "Hari Kemerdekaan RI",
    type: "national",
  },
  {
    country: "id",
    year: 2026,
    date: "2026-12-25",
    label: "Hari Raya Natal",
    type: "national",
  },

  // International Days 2026
  {
    country: "global",
    year: 2026,
    date: "2026-01-01",
    label: "New Year's Day",
    type: "international",
  },
  {
    country: "global",
    year: 2026,
    date: "2026-02-14",
    label: "Valentine's Day",
    type: "international",
  },
  {
    country: "global",
    year: 2026,
    date: "2026-03-08",
    label: "International Women's Day",
    type: "international",
  },
  {
    country: "global",
    year: 2026,
    date: "2026-03-21",
    label: "World Poetry Day",
    type: "international",
  },
  {
    country: "global",
    year: 2026,
    date: "2026-04-22",
    label: "Earth Day",
    type: "international",
  },
  {
    country: "global",
    year: 2026,
    date: "2026-05-01",
    label: "Labour Day",
    type: "international",
  },
  {
    country: "global",
    year: 2026,
    date: "2026-06-05",
    label: "World Environment Day",
    type: "international",
  },
  {
    country: "global",
    year: 2026,
    date: "2026-07-11",
    label: "World Population Day",
    type: "international",
  },
  {
    country: "global",
    year: 2026,
    date: "2026-08-12",
    label: "International Youth Day",
    type: "international",
  },
  {
    country: "global",
    year: 2026,
    date: "2026-09-08",
    label: "International Literacy Day",
    type: "international",
  },
  {
    country: "global",
    year: 2026,
    date: "2026-10-05",
    label: "World Teachers' Day",
    type: "international",
  },
  {
    country: "global",
    year: 2026,
    date: "2026-10-16",
    label: "World Food Day",
    type: "international",
  },
  {
    country: "global",
    year: 2026,
    date: "2026-11-16",
    label: "International Day for Tolerance",
    type: "international",
  },
  {
    country: "global",
    year: 2026,
    date: "2026-12-10",
    label: "Human Rights Day",
    type: "international",
  },
];

export const HOLIDAY_COUNTRIES = [
  { id: "id", label: "Indonesia" },
  { id: "global", label: "Internasional" },
];

// Auto-generate available years from HOLIDAYS data
const uniqueYears = [...new Set(HOLIDAYS.map((h) => h.year))].sort(
  (a, b) => a - b
);
export const HOLIDAY_YEARS =
  uniqueYears.length > 0 ? uniqueYears : [new Date().getFullYear()];

export const getHolidaysForMonth = (year, month, countryIds = ["id"]) => {
  return HOLIDAYS.filter(
    (h) =>
      countryIds.includes(h.country) &&
      h.year === year &&
      new Date(h.date).getMonth() === month
  );
};

export const getHolidaysForYear = (year, countryIds = ["id"]) => {
  return HOLIDAYS.filter(
    (h) => countryIds.includes(h.country) && h.year === year
  ).sort((a, b) => new Date(a.date) - new Date(b.date));
};
