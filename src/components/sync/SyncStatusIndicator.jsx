import { useSyncStore } from "../../store/useSyncStore";
import { Cloud, CloudOff, RefreshCw, Check, AlertCircle } from "lucide-react";
import clsx from "clsx";

/**
 * Sync Status Indicator Component
 * Shows current sync status in the UI
 */
export const SyncStatusIndicator = ({ className = "" }) => {
  const { isAuthenticated, isSyncing, lastSyncAt, syncError, syncEnabled } =
    useSyncStore();

  if (!syncEnabled) {
    return null; // Hide if sync is disabled
  }

  const getStatusIcon = () => {
    if (syncError) {
      return <AlertCircle size={14} className="text-red-500" />;
    }
    if (isSyncing) {
      return <RefreshCw size={14} className="text-(--accent) animate-spin" />;
    }
    if (isAuthenticated) {
      return <Cloud size={14} className="text-(--accent)" />;
    }
    return <CloudOff size={14} className="text-(--text-muted)" />;
  };

  const getStatusText = () => {
    if (syncError) {
      return "sync error";
    }
    if (isSyncing) {
      return "syncing...";
    }
    if (isAuthenticated && lastSyncAt) {
      const syncTime = new Date(lastSyncAt);
      const now = new Date();
      const diffMinutes = Math.floor((now - syncTime) / 60000);

      if (diffMinutes < 1) return "synced just now";
      if (diffMinutes < 60) return `synced ${diffMinutes}m ago`;
      return "synced";
    }
    if (isAuthenticated) {
      return "connected";
    }
    return "offline";
  };

  return (
    <div
      className={clsx(
        "flex items-center gap-2 px-3 py-1.5 border border-(--border-color) bg-(--card-color)",
        className
      )}
    >
      {getStatusIcon()}
      <span className="font-mono text-xs text-(--text-muted)">
        {getStatusText()}
      </span>
      {isAuthenticated && !isSyncing && !syncError && (
        <Check size={12} className="text-green-500" />
      )}
    </div>
  );
};

/**
 * Compact Sync Status - untuk tampil di corner/header
 */
export const SyncStatusBadge = () => {
  const { isAuthenticated, isSyncing, syncError, syncEnabled } = useSyncStore();

  if (!syncEnabled) return null;

  return (
    <div
      className={clsx(
        "flex items-center gap-1.5 px-2 py-1 border",
        syncError
          ? "border-red-500/30 bg-red-500/5"
          : isAuthenticated
          ? "border-(--accent)/30 bg-(--accent)/5"
          : "border-(--border-color) bg-(--card-color)"
      )}
      title={
        syncError
          ? `Sync error: ${syncError}`
          : isAuthenticated
          ? "Connected and syncing"
          : "Offline mode"
      }
    >
      {isSyncing ? (
        <RefreshCw size={12} className="text-(--accent) animate-spin" />
      ) : syncError ? (
        <AlertCircle size={12} className="text-red-500" />
      ) : isAuthenticated ? (
        <Cloud size={12} className="text-(--accent)" />
      ) : (
        <CloudOff size={12} className="text-(--text-muted) opacity-50" />
      )}
    </div>
  );
};
