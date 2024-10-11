// src/recharts.d.ts
// declare module 'recharts' {
//     import * as React from 'react';
  
//     export interface PieChartProps {
//       width: number;
//       height: number;
//       children?: React.ReactNode; // This is fine for PieChart
//     }
  
//     export interface PieData {
//       name: string;
//       value: number;
//     }
  
//     export interface PieProps {
//       data: PieData[];
//       cx?: number;
//       cy?: number;
//       labelLine?: boolean;
//       label?: (entry: PieData) => React.ReactNode; // Specify the label type
//       outerRadius?: number;
//       fill?: string;
//       dataKey: keyof PieData; // Ensures dataKey corresponds to keys in PieData
//       children: JSX.Element[];// Removed 'children' from here
//     }
  
//     export interface CellProps {
//       fill: string;
//     }
  
//     // export interface TooltipProps {
//     //   // Define props as needed
//     // }
  
//     // export interface LegendProps {
//     //   // Define props as needed
//     // }
  
//     export const PieChart: React.FC<PieChartProps>;
//     export const Pie: React.FC<PieProps>;
//     export const Cell: React.FC<CellProps>;
//     export const Tooltip: React.FC<TooltipProps>;
//     export const Legend: React.FC<LegendProps>;
//   }
  