import clsx from "clsx";

/**
 * Card Component - Kontainer konten dengan berbagai variant border
 *
 * @param {Object} props
 * @param {React.ReactNode} props.children - Konten card
 * @param {'solid'|'dashed'} props.variant - Style border (default: 'solid')
 * @param {string} props.className - Custom CSS classes
 * @param {boolean} props.hover - Enable hover effect
 *
 * ## PANDUAN PENGGUNAAN VARIANT (UX Best Practice)
 *
 * ### variant="solid" (DEFAULT) - Untuk konten final/permanen:
 * - Widget dengan data/informasi (stats, progress, analytics)
 * - Card dengan konten lengkap (book card, habit card, journal entry)
 * - Settings dan konfigurasi
 * - Semua card yang menampilkan data yang sudah ada
 *
 * ### variant="dashed" - HANYA untuk:
 * - **Empty State**: Area kosong yang menunggu diisi
 * - **Drop Zone**: Area drag-and-drop (file upload)
 * - **Form/Input Area**: Form untuk input baru (tulis jurnal, tambah buku)
 * - **Placeholder**: Slot untuk konten yang akan datang ("Add New" buttons)
 *
 * ⚠️ JANGAN gunakan dashed untuk card yang berisi konten final,
 * karena memberikan kesan "belum selesai" atau "temporary".
 *
 * @example
 * // Content card (solid border - default)
 * <Card>
 *   <h3>Statistik Harian</h3>
 *   <p>Data sudah final</p>
 * </Card>
 *
 * @example
 * // Empty state or input form (dashed border)
 * <Card variant="dashed">
 *   <p>Belum ada data. Tambah sekarang?</p>
 * </Card>
 */
export const Card = ({
  children,
  variant = "solid",
  className = "",
  hover = false,
  ...props
}) => {
  return (
    <div
      className={clsx(
        "bg-(--card-color) p-4 md:p-6 rounded-subtle",
        variant === "dashed" ? "dashed-border" : "solid-border",
        "border-(--border-color)",
        hover && "transition-all duration-slow hover:border-(--accent)",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};
