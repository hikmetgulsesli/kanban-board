/**
 * Board Context Definition
 * 
 * Separate file for context definition to satisfy fast refresh requirements
 */

import { createContext } from 'react';
import type { BoardContextValue } from './BoardContextValue.js';

export const BoardContext = createContext<BoardContextValue | null>(null);
