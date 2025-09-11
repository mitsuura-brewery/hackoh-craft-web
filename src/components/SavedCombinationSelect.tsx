'use client';

import { useState, useEffect } from 'react';
import { Material } from '@/types/material';
import { SavedCombination } from '@/types/combination';
import { getSavedCombinations, expandCombination, findMatchingCombination } from '@/utils/combination';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface SavedCombinationSelectProps {
  allMaterials: Material[];
  selectedMaterials: Material[];
  onSelect: (materials: Material[]) => void;
  refreshTrigger?: number;
}

export default function SavedCombinationSelect({
  allMaterials,
  selectedMaterials,
  onSelect,
  refreshTrigger,
}: SavedCombinationSelectProps) {
  const [combinations, setCombinations] = useState<SavedCombination[]>([]);
  const [selectedValue, setSelectedValue] = useState('');

  const loadCombinations = () => {
    setCombinations(getSavedCombinations());
  };

  useEffect(() => {
    loadCombinations();
  }, [refreshTrigger]);

  // 素材の変更に応じてセレクトボックスの選択状態を更新
  useEffect(() => {
    const matching = findMatchingCombination(selectedMaterials, combinations);
    setSelectedValue(matching ? matching.id : '');
  }, [selectedMaterials, combinations]);

  const handleSelect = (value: string) => {
    setSelectedValue(value);

    if (value === '') {
      return;
    }

    const combination = combinations.find((c) => c.id === value);
    if (combination) {
      const materials = expandCombination(combination, allMaterials);
      onSelect(materials);
    }
  };


  return (
    <Select
      value={selectedValue}
      onValueChange={handleSelect}
    >
      <SelectTrigger className={`w-[140px] h-8 text-xs bg-white ${selectedValue ? 'text-red-600' : ''}`}>
        <SelectValue placeholder={combinations.length === 0 ? "保存なし" : "保存したもの"} />
      </SelectTrigger>
      <SelectContent>
        {combinations.length === 0 ? (
          <SelectItem value="empty" disabled>
            保存された組み合わせがありません
          </SelectItem>
        ) : (
          combinations.map((combination) => (
            <SelectItem key={combination.id} value={combination.id}>
              {combination.label}
            </SelectItem>
          ))
        )}
      </SelectContent>
    </Select>
  );
}
