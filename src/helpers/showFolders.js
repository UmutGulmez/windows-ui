export const setShowFolders = (value) => {
  if (localStorage.getItem("windows-settings")) {
    const settings = JSON.parse(localStorage.getItem("windows-settings"));
    settings.showFolders = value;
    localStorage.setItem("windows-settings", JSON.stringify(settings));
  } else {
    localStorage.setItem(
      "windows-settings",
      JSON.stringify({
        showFolders: value,
      })
    );
  }
};

export const getShowFolders = () => {
  if (localStorage.getItem("windows-settings")) {
    const settings = JSON.parse(localStorage.getItem("windows-settings"));
    if (settings.showFolders || settings.showFolders === false) {
      return settings.showFolders;
    } else {
      settings.showFolders = true;
      localStorage.setItem("windows-settings", JSON.stringify(settings));
      return true;
    }
  } else {
    localStorage.setItem(
      "windows-settings",
      JSON.stringify({
        showFolders: true,
      })
    );
    return true;
  }
};
