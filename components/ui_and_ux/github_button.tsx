/**
 * @author @abhi-arya1
 * @function GitHubButton
 * @fileoverview This is simply a GitHub Repository Access Button in the bottom-right of the App.
 */

import { GitHub } from "@mui/icons-material";
import { IconButton } from "@mui/material";

const GitHubButton = () => {
  return (
    <div className="fixed bottom-0 right-0 p-4 text-white">
      <IconButton
        sx={{
          color: "#FFFFFF",
        }}
        onClick={() => {
          // eslint-disable-next-line no-restricted-globals
          open("https://github.com/Team-Cartographer/SUITS-2024-LMCC");
        }}
      >
        <GitHub />
      </IconButton>
    </div>
  );
};

export default GitHubButton;
