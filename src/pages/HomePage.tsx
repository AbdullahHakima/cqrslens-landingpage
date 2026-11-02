import React from 'react';
import { HeroSection } from '../components/hero/HeroSection';
import { ArchitectureWorkbench } from '../components/sections/ArchitectureWorkbench';
import { PipelineSection } from '../components/sections/PipelineSection';
import { ChecksLedgerSection } from '../components/sections/ChecksLedgerSection';
import { BenchmarksSection } from '../components/sections/BenchmarksSection';
import { InstallSection } from '../components/sections/InstallSection';

export const HomePage: React.FC = () => (
  <>
    <HeroSection />
    <ArchitectureWorkbench />
    <PipelineSection />
    <ChecksLedgerSection />
    <BenchmarksSection />
    <InstallSection />
  </>
);

export default HomePage;
