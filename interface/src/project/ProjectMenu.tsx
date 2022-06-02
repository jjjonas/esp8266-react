import { FC } from 'react';

import { List } from '@mui/material';
import SettingsRemoteIcon from '@mui/icons-material/SettingsRemote';

import { PROJECT_PATH } from '../api/env';
import LayoutMenuItem from '../components/layout/LayoutMenuItem';

const ProjectMenu: FC = () => (
  <List>
    {/* <LayoutMenuItem icon={SettingsRemoteIcon} label="Demo Project" to={`/${PROJECT_PATH}/demo`} /> */}
    <LayoutMenuItem icon={SettingsRemoteIcon} label="Mr Curtain" to={`/${PROJECT_PATH}/curtain`} />
  </List>
);

export default ProjectMenu;
