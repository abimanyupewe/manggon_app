/**
 * Profile Tab Route Entrypoint
 */

import React from 'react';
import { SafeScreen } from '../../presentation/components/common';
import { ProfileScreen } from '../../presentation/screens/profile/ProfileScreen';

export default function ProfileTabPage() {
  return (
    <SafeScreen>
      <ProfileScreen />
    </SafeScreen>
  );
}
