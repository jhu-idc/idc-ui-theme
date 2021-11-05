import Mirador from 'mirador';

const maybeInitMirador = async () => {
  const itemContainer = document.getElementById('item-container');

  if (itemContainer) {
    const nodeId = itemContainer.dataset.nodeId;
    const res = await fetch(`/node/${nodeId}/manifest`);
    const manifest = await res.json();

    if (manifest.sequences[0]?.canvases?.length) {
      const config = await setupConfig();

      const miradorContainer = document.getElementById('mirador-container');
      miradorContainer.classList.add('h-mirador-container', 'relative', 'p-4', 'my-4');

      Mirador.viewer(config, plugins);
    }
  }
};

const setupConfig = async () => {
  const el = document.getElementById('item-container');
  const nodeId = el.dataset.nodeId;

  const config = {
    id: 'mirador-container',
    windows: [
      {
        loadedManifest: `/node/${nodeId}/manifest`,
        view: 'single',
      },
    ],
    window: {
      defaultView: 'single',
      allowClose: false, // Configure if windows can be closed or not
      allowFullscreen: true, // Configure to show a "fullscreen" button in the WindowTopBar
      allowMaximize: true, // Configure if windows can be maximized or not
      allowTopMenuButton: false, // Configure if window view and thumbnail display menu are visible or not
      allowWindowSideBar: true, // Configure if side bar menu is visible or not
      hideWindowTitle: true, // Configure if the window title is shown in the window title bar or not
    },
    workspaceControlPanel: {
      enabled: false, // Configure if the control panel should be rendered.  Useful if you want to lock the viewer down to only the configured manifests
    },
    catalog: [],
    thumbnailNavigation: {
      defaultPosition: 'far-bottom',
    },
    themes: {},
    translations: {},
  };

  return config;
};

const plugins = [];

maybeInitMirador();
