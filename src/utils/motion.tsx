import React from 'react';
import { motion } from 'framer-motion';

// Cast motion elements to broadly-typed React components to avoid TS friction
export const MotionDiv = motion.div as unknown as React.FC<any>;
export const MotionSection = motion.section as unknown as React.FC<any>;
export const MotionFooter = motion.footer as unknown as React.FC<any>;
export const MotionA = motion.a as unknown as React.FC<any>;
export const MotionP = motion.p as unknown as React.FC<any>;
