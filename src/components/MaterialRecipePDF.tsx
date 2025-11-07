import { Document, Page, Text, View, StyleSheet, Font, Image } from '@react-pdf/renderer';
import { Material } from '@/types/material';
import { MaterialSpecs } from '@/utils/material';
import QRCode from 'qrcode';

// 日本語フォントの登録（Noto Sans JPをGoogle Fontsから）
Font.register({
  family: 'Noto Sans JP',
  fonts: [
    {
      src: 'https://fonts.gstatic.com/s/notosansjp/v52/-F6jfjtqLzI2JPCgQBnw7HFyzSD-AsregP8VFBEi75vY0rw-oME.ttf',
      fontWeight: 400,
    },
    {
      src: 'https://fonts.gstatic.com/s/notosansjp/v52/-F6jfjtqLzI2JPCgQBnw7HFyzSD-AsregP8VFBEi75vY0rw-oME.ttf',
      fontWeight: 700,
    },
  ],
});

const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontFamily: 'Noto Sans JP',
    fontSize: 11,
  },
  header: {
    marginBottom: 12,
    borderBottom: '2pt solid #8B4513',
    paddingBottom: 8,
  },
  title: {
    fontSize: 24,
    color: '#8B4513',
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 10,
    color: '#666',
  },
  section: {
    marginTop: 8,
    marginBottom: 6,
  },
  sectionTitle: {
    fontSize: 13,
    color: '#8B4513',
    marginBottom: 6,
  },
  materialList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  materialChip: {
    backgroundColor: '#F5E6D3',
    border: '1pt solid #D4A574',
    borderRadius: 12,
    padding: '4 10',
    fontSize: 10,
  },
  specsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  specItem: {
    width: '18%',
    padding: 6,
    backgroundColor: '#F9F9F9',
    borderRadius: 6,
  },
  linkSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 6,
    padding: 8,
    backgroundColor: '#F9F9F9',
    borderRadius: 6,
    border: '1pt solid #DDD',
  },
  linkTextContainer: {
    flex: 1,
  },
  linkText: {
    fontSize: 9,
    color: '#333',
    marginBottom: 3,
  },
  linkUrl: {
    fontSize: 8,
    color: '#0066CC',
    textDecoration: 'underline',
  },
  qrCode: {
    width: 50,
    height: 50,
  },
  specLabel: {
    fontSize: 9,
    color: '#666',
    marginBottom: 3,
  },
  specValue: {
    fontSize: 13,
    color: '#333',
  },
  conditionText: {
    fontSize: 11,
    marginBottom: 4,
  },
  noteText: {
    fontSize: 10,
    marginBottom: 3,
  },
  footer: {
    position: 'absolute',
    bottom: 30,
    left: 40,
    right: 40,
    fontSize: 8,
    color: '#999',
    textAlign: 'center',
    borderTop: '1pt solid #DDD',
    paddingTop: 10,
  },
});

interface MaterialRecipePDFProps {
  materials: Material[];
  specs: MaterialSpecs;
  misoInfo: { name: string; image: string } | null;
  month: number;
  region: string;
  shopifyUrl: string;
  combiNumber: string;
  simulationQRCode: string;
  purchaseQRCode: string;
}

// QRコードを生成する関数（export for use in DownloadPDFButton）
export const generateQRCode = async (url: string): Promise<string> => {
  try {
    return await QRCode.toDataURL(url, {
      width: 200,
      margin: 1,
    });
  } catch (error) {
    console.error('QRコード生成エラー:', error);
    return '';
  }
};

export const MaterialRecipePDF = ({
  materials,
  specs,
  misoInfo,
  month,
  region,
  shopifyUrl,
  combiNumber,
  simulationQRCode,
  purchaseQRCode,
}: MaterialRecipePDFProps) => {
  // 完成予定日を計算
  const completionDate = new Date();
  completionDate.setDate(completionDate.getDate() + specs.materialPeriod);
  const completionStr = `${completionDate.getFullYear()}年${completionDate.getMonth() + 1}月頃`;

  // 材料のカウント
  const materialCounts = materials.reduce((acc, material) => {
    acc[material.id] = acc[material.id] || { material, count: 0 };
    acc[material.id].count++;
    return acc;
  }, {} as Record<string, { material: Material; count: number }>);

  // シミュレーションURL
  const simulationUrl = `https://mitsuura-brewery.github.io/hackoh-craft-web/?combi-number=${combiNumber}`;

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* ヘッダー */}
        <View style={styles.header}>
          <Text style={styles.title}>味噌材料レシピ</Text>
          <Text style={styles.subtitle}>
            作成日: {new Date().toLocaleDateString('ja-JP')}
          </Text>
        </View>

        {/* シミュレーションリンク */}
        {simulationQRCode && (
          <View style={styles.linkSection}>
            <View style={styles.linkTextContainer}>
              <Text style={styles.linkText}>
                この組み合わせから変更や調整をされる方はシミュレーションサイトをご利用ください。
              </Text>
              <Text style={styles.linkUrl}>{simulationUrl}</Text>
            </View>
            <Image src={simulationQRCode} style={styles.qrCode} />
          </View>
        )}

        {/* 購入リンク */}
        {purchaseQRCode && (
          <View style={styles.linkSection}>
            <View style={styles.linkTextContainer}>
              <Text style={styles.linkText}>
                この組み合わせを購入される方は購入サイトをご利用ください。
              </Text>
              <Text style={styles.linkText}>※新規注文となるためご注意ください</Text>
              <Text style={styles.linkUrl}>{shopifyUrl}</Text>
            </View>
            <Image src={purchaseQRCode} style={styles.qrCode} />
          </View>
        )}

        {/* 選択した材料 */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>選択した材料</Text>
          <View style={styles.materialList}>
            {Object.values(materialCounts).map(({ material, count }) => (
              <View key={material.id} style={styles.materialChip}>
                <Text>
                  {material.shortName} {count > 1 ? `x${count}` : ''}
                </Text>
              </View>
            ))}
          </View>
        </View>

        {/* 仕込み条件 */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>仕込み条件</Text>
          <Text style={styles.conditionText}>地域: {region}</Text>
          <Text style={styles.conditionText}>仕込み月: {month}月</Text>
          {misoInfo && (
            <Text style={styles.conditionText}>類似する味噌: {misoInfo.name}</Text>
          )}
          <Text style={styles.conditionText}>
            完成予定: {completionStr} ({specs.materialPeriod}日後)
          </Text>
        </View>

        {/* 基本スペック */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>基本スペック</Text>
          <View style={styles.specsGrid}>
            {renderSpecItem('麹歩合', specs.kojiRatio, '')}
            {renderSpecItem('加水量', specs.waterAmount, 'ml')}
            {renderSpecItem('塩分', specs.saltRatio.toFixed(1), '%')}
            {renderSpecItem('重量', specs.totalWeight, 'g')}
            {renderSpecItem('期間目安', specs.materialPeriod, '日')}
          </View>
        </View>

        {/* 詳細スペック */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>詳細な成分・酵素情報</Text>
          <View style={styles.specsGrid}>
            {renderSpecItem('たんぱく質', specs.totalProtein.toFixed(1), 'g')}
            {renderSpecItem('脂質', specs.totalFat.toFixed(1), 'g')}
            {renderSpecItem('でんぷん', specs.totalStarch.toFixed(1), 'g')}
            {renderSpecItem('水分', specs.moistureRatio.toFixed(1), '%')}
            {renderSpecItem('対水食塩濃度', specs.saltConcentration.toFixed(1), '%')}
            {renderSpecItem('初期pH', specs.initialPH.toFixed(2), '')}
            {renderSpecItem('αアミラーゼ', specs.averageAlphaAmylase.toFixed(1), '')}
            {renderSpecItem(
              'グルコアミラーゼ',
              specs.averageGlucoAmylase.toFixed(1),
              ''
            )}
            {renderSpecItem('プロテアーゼ', specs.averageProtease.toFixed(1), '')}
          </View>
        </View>

        {/* 注意事項 */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>ご注意</Text>
          <Text style={styles.noteText}>
            • 発酵期間は季節や環境により変動する場合があります
          </Text>
          <Text style={styles.noteText}>
            • 初回製造時は説明書をよくお読みください
          </Text>
          <Text style={styles.noteText}>• 保存方法により品質が左右されます</Text>
        </View>

        {/* フッター */}
        <View style={styles.footer}>
          <Text>HackOH - 発酵シミュレーション | https://hackoh.jp</Text>
        </View>
      </Page>
    </Document>
  );
};

const renderSpecItem = (label: string, value: number | string, unit: string) => (
  <View style={styles.specItem}>
    <Text style={styles.specLabel}>{label}</Text>
    <Text style={styles.specValue}>
      {value}
      {unit}
    </Text>
  </View>
);
