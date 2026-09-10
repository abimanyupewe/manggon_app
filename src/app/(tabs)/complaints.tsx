/**
 * Complaints Tab Route Entrypoint
 */

import React from 'react';
import { SafeScreen } from '../../presentation/components/common';
import { ComplaintsScreen } from '../../presentation/screens/complaints/ComplaintsScreen';

export default function ComplaintsTabPage() {
  return (
    <SafeScreen>
      <ComplaintsScreen />
    </SafeScreen>
  );
}
