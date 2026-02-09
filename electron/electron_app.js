import electron from 'electron';
const { app, BrowserWindow } = electron;

function createWindow() {
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
  });

  mainWindow.loadURL('https://aiplp.vercel.app');
}

app.whenReady().then(() => {
  createWindow();

  app.on('activate', () => {
    // On macOS it's common to recreate a window when the dock icon is clicked
    // and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', () => {
  // On macOS, apps generally stay open until the user explicitly quits.
  if (process.platform !== 'darwin') {
    app.quit();
  }
});
