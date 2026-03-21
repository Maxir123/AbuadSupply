// AdminSettings.js
import React, { useState } from "react";
import { Tabs, Tab, Box, Typography } from "@mui/material";
import ProfileSettings from "./ProfileSettings"; 
import GeneralSettings from "./GeneralSettings";
import SecuritySettings from "./SecuritySettings";
import NotificationSettings from "./NotificationSettings";
import AdvancedSettings from "./AdvancedSettings";

const AdminSettings = () => {
  const [tabIndex, setTabIndex] = useState(0);
  const handleTabChange = (event, newValue) => setTabIndex(newValue);

  return (
    <Box sx={{ width: "100%", p: 4 }}>
      <Typography variant="h4" gutterBottom>
        Admin Settings
      </Typography>
      <Tabs value={tabIndex} onChange={handleTabChange} variant="scrollable">
        <Tab label="Profile" />
        <Tab label="General" />
        <Tab label="Security" />
        <Tab label="Notifications" />
        <Tab label="Integrations" />
        <Tab label="Advanced" />
      </Tabs>
      <TabPanel value={tabIndex} index={0}>
        <ProfileSettings />
      </TabPanel>
      <TabPanel value={tabIndex} index={1}>
        <GeneralSettings />
      </TabPanel>
      <TabPanel value={tabIndex} index={2}>
        <SecuritySettings />
      </TabPanel>
      <TabPanel value={tabIndex} index={3}>
        <NotificationSettings />
      </TabPanel>
      <TabPanel value={tabIndex} index={5}>
        <AdvancedSettings />
      </TabPanel>
    </Box>
  );
};

const TabPanel = (props) => {
  const { children, value, index, ...other } = props;
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`settings-tabpanel-${index}`}
      aria-labelledby={`settings-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
};

export default AdminSettings;
