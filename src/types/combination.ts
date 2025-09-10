import { Material } from './material';

export interface SavedCombination {
  id: string;
  label: string;
  materials: { materialId: string; count: number }[];
  createdAt: string;
}

export interface CombinationWithMaterials {
  id: string;
  label: string;
  materials: Material[];
  createdAt: string;
}