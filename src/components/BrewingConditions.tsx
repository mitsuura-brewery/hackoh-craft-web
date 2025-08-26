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
          <select
            className="px-4 py-2 border border-ferment-secondary/30 rounded-lg bg-white text-ferment-dark focus:outline-none focus:ring-2 focus:ring-ferment-primary/50 focus:border-ferment-primary"
            value={selectedRegion}
            onChange={(e) => onRegionChange(e.target.value)}
          >
            <option value="北海道">北海道</option>
            <option value="東北">東北</option>
            <option value="北関東">北関東</option>
            <option value="関東">関東</option>
            <option value="北陸">北陸</option>
            <option value="東海">東海</option>
            <option value="関西">関西</option>
            <option value="中国">中国</option>
            <option value="四国">四国</option>
            <option value="九州">九州</option>
            <option value="沖縄">沖縄</option>
          </select>
        </div>
        <div className="flex items-center gap-2">
          <label className="text-sm font-medium text-ferment-dark">仕込む月</label>
          <select
            className="px-4 py-2 border border-ferment-secondary/30 rounded-lg bg-white text-ferment-dark focus:outline-none focus:ring-2 focus:ring-ferment-primary/50 focus:border-ferment-primary"
            value={selectedMonth}
            onChange={(e) => onMonthChange(Number(e.target.value))}
          >
            <option value={1}>1月</option>
            <option value={2}>2月</option>
            <option value={3}>3月</option>
            <option value={4}>4月</option>
            <option value={5}>5月</option>
            <option value={6}>6月</option>
            <option value={7}>7月</option>
            <option value={8}>8月</option>
            <option value={9}>9月</option>
            <option value={10}>10月</option>
            <option value={11}>11月</option>
            <option value={12}>12月</option>
          </select>
        </div>
      </div>
    </div>
  );
}
