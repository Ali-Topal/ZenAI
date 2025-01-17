'use client';
import React from 'react';
import { Lottery } from './components/Lottery';
import { DatabaseTest } from './components/DatabaseTest';

export default function Home() {
  return (
    <main>
      <Lottery />
      <DatabaseTest />
    </main>
  );
} 