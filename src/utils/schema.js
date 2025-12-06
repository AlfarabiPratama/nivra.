export const CURRENT_SCHEMA_VERSION = 1;

const stores = {
  'nivra-app-storage': ['user', 'notifications'],
  'nivra-tasks-storage': ['tasks'],
  'nivra-habits': ['habits', 'checkIns'],
  'nivra-journal-storage': ['entries'],
  'nivra-books': ['books', 'yearlyGoal'],
  'nivra-finance': ['transactions', 'budgets'],
  'nivra-pomodoro': ['completedSessions', 'totalFocusTime', 'settings'],
  'nivra-achievements': ['unlockedAchievements'],
  'nivra-layout': ['widgetOrder', 'hiddenWidgets'],
  'nivra-theme': ['isDarkMode', 'theme'],
};

export const migrateValue = (key, raw) => {
  try {
    const parsed = JSON.parse(raw);
    // no-op for now, reserved for future migrations
    return parsed;
  } catch {
    return null;
  }
};

export const checkIntegrity = () => {
  const result = [];
  Object.keys(stores).forEach((name) => {
    const raw = localStorage.getItem(name);
    if (!raw) {
      result.push({ name, status: 'missing' });
      return;
    }
    const parsed = migrateValue(name, raw);
    if (!parsed) {
      result.push({ name, status: 'corrupt' });
      return;
    }
    const keys = stores[name];
    const missing = keys.filter((k) => parsed[k] === undefined);
    result.push({
      name,
      status: missing.length === 0 ? 'ok' : 'incomplete',
      size: raw.length,
      missing,
    });
  });
  return result;
};

export const resetStore = (name) => {
  localStorage.removeItem(name);
};
