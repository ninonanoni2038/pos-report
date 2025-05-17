import React, { useState, useMemo, useEffect } from 'react';
import { Surface, Text, Border, Object as ObjectColor } from '../../styles/semanticColors';
import { ProductSalesData } from '../../types/sales';
import { formatCurrency } from '../../utils/formatters';

interface TopProductsChartProps {
  data: ProductSalesData[];
  totalAmount: number;  // その日/月の売上合計
  totalCount: number;   // その日/月の売上個数合計
  totalProfit: number;  // その日/月の粗利合計
}

/**
 * 売れ筋商品ランキングコンポーネント
 * 売上金額順に上位10商品をテーブルで表示する
 */
const TopProductsChart: React.FC<TopProductsChartProps> = ({
  data,
  totalAmount,
  totalCount,
  totalProfit
}) => {
  // 状態管理
  const [sortConfig, setSortConfig] = useState<{ key: keyof ProductSalesData; direction: 'asc' | 'desc' }>({
    key: 'amount',
    direction: 'desc'
  });
  const [filters, setFilters] = useState({ menu: 'all', category: 'all', subCategory: 'all' });
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');

  // 検索用デバウンス処理
  useEffect(() => {
    const timerId = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 300);
    
    return () => {
      clearTimeout(timerId);
    };
  }, [searchTerm]);

  // ヘルパー関数
  const calculatePercentage = (value: number, total: number): number => {
    if (total === 0) return 0;
    return (value / total) * 100;
  };

  const formatPercentage = (percentage: number): string => {
    return `${percentage.toFixed(1)}%`;
  };

  // ソート関数
  const handleSort = (key: keyof ProductSalesData) => {
    setSortConfig(prevConfig => ({
      key,
      direction: prevConfig.key === key && prevConfig.direction === 'desc' ? 'asc' : 'desc'
    }));
  };

  // 利用可能なフィルターオプションの計算
  const filterOptions = useMemo(() => {
    // Setを配列に変換してから展開
    const menuSet = new Set(data.map(item => item.menu).filter(Boolean) as string[]);
    const menus = ['all', ...Array.from(menuSet)];
    
    const categorySet = new Set(
      data
        .filter(item => filters.menu === 'all' || item.menu === filters.menu)
        .map(item => item.category)
        .filter(Boolean) as string[]
    );
    const categories = ['all', ...Array.from(categorySet)];
    
    const subCategorySet = new Set(
      data
        .filter(item =>
          (filters.menu === 'all' || item.menu === filters.menu) &&
          (filters.category === 'all' || item.category === filters.category)
        )
        .map(item => item.subCategory)
        .filter(Boolean) as string[]
    );
    const subCategories = ['all', ...Array.from(subCategorySet)];
    
    console.log('Available menus:', menus);
    
    return { menus, categories, subCategories };
  }, [data, filters.menu, filters.category]);

  // フィルタリングと検索を適用したデータ
  const filteredData = useMemo(() => {
    return data.filter(item =>
      (filters.menu === 'all' || item.menu === filters.menu) &&
      (filters.category === 'all' || item.category === filters.category) &&
      (filters.subCategory === 'all' || item.subCategory === filters.subCategory) &&
      (debouncedSearchTerm === '' ||
        item.name.toLowerCase().includes(debouncedSearchTerm.toLowerCase()))
    );
  }, [data, filters, debouncedSearchTerm]);

  // ソート済みデータの計算
  const sortedData = useMemo(() => {
    const sorted = [...filteredData];
    sorted.sort((a, b) => {
      // オプショナルプロパティの場合、undefinedの可能性を考慮
      const valueA = a[sortConfig.key] ?? 0;
      const valueB = b[sortConfig.key] ?? 0;
      
      if (valueA < valueB) {
        return sortConfig.direction === 'asc' ? -1 : 1;
      }
      if (valueA > valueB) {
        return sortConfig.direction === 'asc' ? 1 : -1;
      }
      return 0;
    });
    // 表示件数を制限（必要に応じて）
    return sorted.slice(0, 30);
  }, [filteredData, sortConfig]);

  // ソートアイコンの表示
  const getSortIcon = (key: keyof ProductSalesData) => {
    if (sortConfig.key !== key) return '▽';
    return sortConfig.direction === 'asc' ? '△' : '▼';
  };

  return (
    <div style={{
      background: Surface.Primary,
      padding: 16,
      borderRadius: 8,
      boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      boxSizing: 'border-box'
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <h3 style={{ margin: 0, color: Text.HighEmphasis }}>売れ筋商品</h3>
        <div style={{ display: 'flex', gap: 8 }}>
          <select
            value={filters.menu}
            onChange={(e) => setFilters(prev => ({ ...prev, menu: e.target.value, category: 'all', subCategory: 'all' }))}
            style={{
              padding: '4px 8px',
              borderRadius: 4,
              border: `1px solid ${Border.LowEmphasis}`,
              backgroundColor: Surface.Primary
            }}
          >
            <option value="all">すべてのメニュー</option>
            {filterOptions.menus.filter(menu => menu !== 'all').map(menu => (
              <option key={menu} value={menu}>{menu}</option>
            ))}
          </select>
          
          <select
            value={filters.category}
            onChange={(e) => setFilters(prev => ({ ...prev, category: e.target.value, subCategory: 'all' }))}
            style={{
              padding: '4px 8px',
              borderRadius: 4,
              border: `1px solid ${Border.LowEmphasis}`,
              backgroundColor: Surface.Primary
            }}
          >
            <option value="all">すべてのカテゴリ</option>
            {filterOptions.categories.filter(category => category !== 'all').map(category => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>
          
          <select
            value={filters.subCategory}
            onChange={(e) => setFilters(prev => ({ ...prev, subCategory: e.target.value }))}
            style={{
              padding: '4px 8px',
              borderRadius: 4,
              border: `1px solid ${Border.LowEmphasis}`,
              backgroundColor: Surface.Primary
            }}
          >
            <option value="all">すべてのサブカテゴリ</option>
            {filterOptions.subCategories.filter(subCategory => subCategory !== 'all').map(subCategory => (
              <option key={subCategory} value={subCategory}>{subCategory}</option>
            ))}
          </select>
          
          <input
            type="text"
            placeholder="🔍 検索"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              padding: '4px 8px',
              borderRadius: 4,
              border: `1px solid ${Border.LowEmphasis}`,
              backgroundColor: Surface.Primary
            }}
          />
        </div>
      </div>
      <div style={{ flex: 1, overflow: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead style={{ position: 'sticky', top: 0, background: Surface.Primary }}>
            <tr>
              <th style={{
                width: '40%',
                textAlign: 'left',
                padding: '8px 16px',
                borderBottom: `1px solid ${Border.LowEmphasis}`
              }}>
                商品名
                <span
                  onClick={() => handleSort('name')}
                  style={{ cursor: 'pointer', marginLeft: 4 }}
                  title="商品名で並び替え"
                >
                  {getSortIcon('name')}
                </span>
              </th>
              <th style={{
                textAlign: 'right',
                padding: '8px 16px',
                borderBottom: `1px solid ${Border.LowEmphasis}`
              }}>
                売上金額
                <span
                  onClick={() => handleSort('amount')}
                  style={{ cursor: 'pointer', marginLeft: 4 }}
                  title="売上金額で並び替え"
                >
                  {getSortIcon('amount')}
                </span>
              </th>
              <th style={{
                textAlign: 'right',
                padding: '8px 16px',
                borderBottom: `1px solid ${Border.LowEmphasis}`
              }}>
                売上個数
                <span
                  onClick={() => handleSort('count')}
                  style={{ cursor: 'pointer', marginLeft: 4 }}
                  title="売上個数で並び替え"
                >
                  {getSortIcon('count')}
                </span>
              </th>
              <th style={{
                textAlign: 'right',
                padding: '8px 16px',
                borderBottom: `1px solid ${Border.LowEmphasis}`
              }}>
                粗利
                <span
                  onClick={() => handleSort('profit')}
                  style={{ cursor: 'pointer', marginLeft: 4 }}
                  title="粗利で並び替え"
                >
                  {getSortIcon('profit')}
                </span>
              </th>
            </tr>
          </thead>
          <tbody>
            {sortedData.map((item, index) => (
              <tr key={index} style={{
                backgroundColor: index % 2 === 0 ? Surface.Primary : Surface.Secondary
              }}>
                <td style={{
                  padding: '8px 16px',
                //   borderBottom: `1px solid ${Border.LowEmphasis}`,
                  maxWidth: '40%',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                //   display: '-webkit-box',
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: 'vertical'
                }}>
                  {item.name}
                </td>
                <td style={{
                  textAlign: 'right',
                  padding: '8px 16px',
                  borderBottom: `1px solid ${Border.LowEmphasis}`
                }}>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
                    <div style={{ fontWeight: 'bold' }}>
                      {formatPercentage(calculatePercentage(item.amount, totalAmount))}
                    </div>
                    <div style={{ fontSize: '0.8em', color: Text.MediumEmphasis }}>
                      ({formatCurrency(item.amount)})
                    </div>
                  </div>
                </td>
                <td style={{
                  textAlign: 'right',
                  padding: '8px 16px',
                  borderBottom: `1px solid ${Border.LowEmphasis}`
                }}>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
                    <div style={{ fontWeight: 'bold' }}>
                      {formatPercentage(calculatePercentage(item.count, totalCount))}
                    </div>
                    <div style={{ fontSize: '0.8em', color: Text.MediumEmphasis }}>
                      ({item.count.toLocaleString()}個)
                    </div>
                  </div>
                </td>
                <td style={{
                  textAlign: 'right',
                  padding: '8px 16px',
                  borderBottom: `1px solid ${Border.LowEmphasis}`
                }}>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
                    <div style={{ fontWeight: 'bold' }}>
                      {formatPercentage(calculatePercentage(item.profit, totalProfit))}
                    </div>
                    <div style={{ fontSize: '0.8em', color: Text.MediumEmphasis }}>
                      ({formatCurrency(item.profit)})
                    </div>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TopProductsChart;