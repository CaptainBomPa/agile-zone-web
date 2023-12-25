import React from "react";
import UserInformationTab from "./UserInformationTab";

import PropTypes from "prop-types";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Box from "@mui/material/Box";
import ChangePasswordTab from "./ChangePasswordTab";
import ChangeAvatarTab from "./ChangeAvatarTab";

function CustomTabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`full-width-tabpanel-${index}`}
      aria-labelledby={`full-width-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

function a11yProps(index) {
  return {
    id: `full-width-tab-${index}`,
    "aria-controls": `full-width-tabpanel-${index}`,
  };
}

export default function UserSettings({
  token,
  userDetails,
  setUserDetails,
  userAvatar,
  setUserAvatar,
}) {
  const [value, setValue] = React.useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <Box sx={{  marginTop: "64px", marginLeft: "64px" }}>
      <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
        <Tabs
          value={value}
          onChange={handleChange}
          indicatorColor="secondary"
          textColor="inherit"
          variant="fullWidth"
          aria-label="full width tabs example"
        >
          <Tab label="User Information" {...a11yProps(0)} />
          <Tab label="Change Password" {...a11yProps(1)} />
          <Tab label="Change Avatar" {...a11yProps(2)} />
        </Tabs>
      </Box>
      <CustomTabPanel value={value} index={0}>
        <UserInformationTab
          userDetails={userDetails}
          token={token}
          setUserDetails={setUserDetails}
        />
      </CustomTabPanel>
      <CustomTabPanel value={value} index={1}>
        <ChangePasswordTab
          userDetails={userDetails}
          token={token}
          setUserDetails={setUserDetails}
        />
      </CustomTabPanel>
      <CustomTabPanel value={value} index={2}>
        <ChangeAvatarTab
          token={token}
          userAvatar={userAvatar}
          setUserAvatar={setUserAvatar}
        />
      </CustomTabPanel>
    </Box>
  );
}

CustomTabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};
