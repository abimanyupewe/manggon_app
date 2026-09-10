/**
 * Home Tab Route Entrypoint
 */

import React from 'react';
import { SafeScreen } from '../../presentation/components/common';
import { HomeScreen } from '../../presentation/screens/home/HomeScreen';

export default function HomeTabPage() {
  return (
    <SafeScreen>
      <HomeScreen />
    </SafeScreen>
  );
}
