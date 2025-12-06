// Tambahkan methods ini ke useTaskStore.js

// Tambahkan setelah baris "isSyncActive: false,"

      // Initialize real-time sync
      initializeSync: () => {
        if (!isSyncEnabled() || get().isSyncActive) return;

        const syncState = useSyncStore.getState();
        if (!syncState.isAuthenticated) {
          console.log('ℹ️ Tasks: Waiting for authentication...');
          return;
        }

        try {
          unsubscribeTasks = subscribeToCollection('tasks', (firestoreTasks) => {
            const localTasks = get().tasks;
            const merged = [...firestoreTasks];

            // Add local tasks that don't exist in Firestore
            localTasks.forEach(localTask => {
              const existsInFirestore = firestoreTasks.some(ft => ft.id === localTask.id);
              if (!existsInFirestore) {
                merged.push(localTask);
                syncDocToFirestore('tasks', localTask.id, localTask);
              }
            });

            set({ tasks: merged, isSyncActive: true });
            console.log(`✅ Tasks synced: ${merged.length} items`);
          });
        } catch (error) {
          console.error('Tasks sync initialization error:', error);
        }
      },

      // Stop sync
      stopSync: () => {
        if (unsubscribeTasks) {
          unsubscribeTasks();
          unsubscribeTasks = null;
        }
        set({ isSyncActive: false });
      },

// Modifikasi existing addTask method - tambahkan di akhir fungsi sebelum return:

        // Sync to Firestore
        if (isSyncEnabled() && useSyncStore.getState().isAuthenticated) {
          syncDocToFirestore('tasks', newTask.id, newTask);
        }

// Modifikasi existing toggleTask method - tambahkan di akhir fungsi:

        // Sync to Firestore
        if (isSyncEnabled() && useSyncStore.getState().isAuthenticated) {
          const updatedTask = get().tasks.find(t => t.id === id);
          if (updatedTask) {
            syncDocToFirestore('tasks', id, updatedTask);
          }
        }

// Modifikasi existing deleteTask method - tambahkan di akhir fungsi:

        // Delete from Firestore
        if (isSyncEnabled() && useSyncStore.getState().isAuthenticated) {
          deleteDocFromFirestore('tasks', id);
        }
