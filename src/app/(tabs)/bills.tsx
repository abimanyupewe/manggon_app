/**
 * Bills Tab Route Entrypoint
 */

import React from 'react';
import { SafeScreen } from '../../presentation/components/common';
import { BillsScreen } from '../../presentation/screens/bills/BillsScreen';

export default function BillsTabPage() {
  return (
    <SafeScreen>
      <BillsScreen />
    </SafeScreen>
  );
}
