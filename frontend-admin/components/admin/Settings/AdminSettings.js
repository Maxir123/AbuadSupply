// AdminSettings.js
import React, { useState } from "react";
import { Tabs, Tab, Box, Typography, Paper, Container } from "@mui/material";
import ProfileSettings from "./ProfileSettings";
import GeneralSettings from "./GeneralSettings";
import SecuritySettings from "./SecuritySettings";
import NotificationSettings from "./NotificationSettings";
import AdvancedSettings from "./AdvancedSettings";

const AdminSettings = () => {
  const [tabIndex, setTabIndex] = useState(0);
  const handleTabChange = (event, newValue) => setTabIndex(newValue);

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" component="h1" fontWeight="bold" gutterBottom>
        Admin Settings
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        Manage your account preferences and configurations
      </Typography>

      <Paper elevation={0} sx={{ borderRadius: 3, overflow: "hidden", border: "1px solid", borderColor: "grey.100" }}>
        <Box sx={{ borderBottom: 1, borderColor: "divider", bgcolor: "background.paper" }}>
          <Tabs
            value={tabIndex}
            onChange={handleTabChange}
            variant="scrollable"
            scrollButtons="auto"
            allowScrollButtonsMobile
            sx={{
              "& .MuiTab-root": {
                textTransform: "none",
                fontWeight: 500,
                fontSize: "0.875rem",
                py: 1.5,
                minWidth: 100,
              },
            }}
          >
            <Tab label="Profile" />
            <Tab label="General" />
            <Tab label="Security" />
            <Tab label="Notifications" />
            <Tab label="Integrations" />
            <Tab label="Advanced" />
          </Tabs>
        </Box>

        <Box sx={{ p: { xs: 2, sm: 3 } }}>
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
      </Paper>
    </Container>
  );
};

const TabPanel = ({ children, value, index, ...other }) => {
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`settings-tabpanel-${index}`}
      aria-labelledby={`settings-tab-${index}`}
      {...other}
    >
      {value === index && children}
    </div>
  );
};

export default AdminSettings;