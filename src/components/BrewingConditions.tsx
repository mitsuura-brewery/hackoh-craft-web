import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface BrewingConditionsProps {
  selectedMonth: number;
  selectedRegion: string;
  onMonthChange: (month: number) => void;
  onRegionChange: (region: string) => void;
}

export default function BrewingConditions({
  selectedMonth,
  selectedRegion,
  onMonthChange,
  onRegionChange,
}: BrewingConditionsProps) {
  return (
    <div className="flex flex-col items-center gap-2">
      <div className="flex flex-col sm:flex-row items-end gap-6">
        <div className="flex items-center gap-2">
          <label className="text-sm font-medium text-ferment-dark">お住まいの地域</label>
          <Select value={selectedRegion} onValueChange={onRegionChange}>
            <SelectTrigger className="w-[140px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="北海道">北海道</SelectItem>
              <SelectItem value="東北">東北</SelectItem>
              <SelectItem value="北関東">北関東</SelectItem>
              <SelectItem value="関東">関東</SelectItem>
              <SelectItem value="北陸">北陸</SelectItem>
              <SelectItem value="東海">東海</SelectItem>
              <SelectItem value="関西">関西</SelectItem>
              <SelectItem value="中国">中国</SelectItem>
              <SelectItem value="四国">四国</SelectItem>
              <SelectItem value="九州">九州</SelectItem>
              <SelectItem value="沖縄">沖縄</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="flex items-center gap-2">
          <label className="text-sm font-medium text-ferment-dark">仕込む月</label>
          <Select value={selectedMonth.toString()} onValueChange={(value) => onMonthChange(Number(value))}>
            <SelectTrigger className="w-[100px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1">1月</SelectItem>
              <SelectItem value="2">2月</SelectItem>
              <SelectItem value="3">3月</SelectItem>
              <SelectItem value="4">4月</SelectItem>
              <SelectItem value="5">5月</SelectItem>
              <SelectItem value="6">6月</SelectItem>
              <SelectItem value="7">7月</SelectItem>
              <SelectItem value="8">8月</SelectItem>
              <SelectItem value="9">9月</SelectItem>
              <SelectItem value="10">10月</SelectItem>
              <SelectItem value="11">11月</SelectItem>
              <SelectItem value="12">12月</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
}
