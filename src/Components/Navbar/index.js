import React, { useState } from "react";
import "./navbar.css";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import SettingsIcon from "@mui/icons-material/Settings";
import Link from "@mui/material/Link";
import {
  FormControlLabel,
  FormGroup,
  Menu,
  MenuItem,
  Switch,
} from "@mui/material";
import { useDispatch } from "react-redux";
import { setSimpleDeck } from "../../Redux/Reducers/Settings";

const Navbar = () => {
  const dispatch=useDispatch();
  const [settingsAnchor, setSettingsAnchor] = useState(null);
  const open = Boolean(settingsAnchor);
  const handleClick = (event) => {
    setSettingsAnchor(event.currentTarget);
  };
  const handleClose = () => {
    setSettingsAnchor(null);
  };
  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>
          <MenuItem>
            <Typography>
              <Link href="/" color="inherit">
                Home
              </Link>
            </Typography>
          </MenuItem>
          <MenuItem>
            <Typography>
              <Link href="/notes" color="inherit">
                Notes
              </Link>
            </Typography>
          </MenuItem>
          <MenuItem>
            <Typography>
              <Link href="/export" color="inherit">
                Export
              </Link>
            </Typography>
          </MenuItem>
          <MenuItem>
            <Typography>
              <Link href="/import" color="inherit">
                Import
              </Link>
            </Typography>
          </MenuItem>
          <MenuItem>
            <Typography>
              <Link href="/reset" color="inherit">
                Reset
              </Link>
            </Typography>
          </MenuItem>

          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="menu"
            sx={{ mr: 2 }}
            onClick={handleClick}
          >
            <SettingsIcon />
          </IconButton>
          <Menu
            id="settings-menu"
            anchorEl={settingsAnchor}
            open={open}
            onClose={handleClose}
            sx={{ maxWidth: "100%" }}
          >
            <MenuItem>
              <FormGroup>
                <FormControlLabel
                  control={
                    <Switch onChange={(e) => dispatch(setSimpleDeck(e.target.checked))} />
                  }
                  label="Simple deck view"
                />
              </FormGroup>
            </MenuItem>
          </Menu>
        </Toolbar>
      </AppBar>
    </Box>
  );
};
export default Navbar;
