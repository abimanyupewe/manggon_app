/**
 * Security Tab Route Entrypoint
 */

import React from 'react';
import { SafeScreen } from '../../presentation/components/common';
import { SecurityScreen } from '../../presentation/screens/security/SecurityScreen';

export default function SecurityTabPage() {
  return (
    <SafeScreen>
      <SecurityScreen />
    </SafeScreen>
  );
}
