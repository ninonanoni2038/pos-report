import React from 'react';
import { PaymentMethodData } from '../../types/sales';
import { formatCurrency } from '../../utils/formatters';
import { Surface, Border, Text } from '../../styles/semanticColors';

interface PaymentMethodTableProps {
  data: PaymentMethodData[];
  totalAmount: number;
}

const PaymentMethodTable: React.FC<PaymentMethodTableProps> = ({ data, totalAmount }) => {
  return (
    <div>
      <h3 style={{ margin: '0 0 16px 0' }}>支払い方法別データ</h3>
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              <th style={{ 
                textAlign: 'left', 
                padding: '8px 16px', 
                borderBottom: `1px solid ${Border.LowEmphasis}`,
                color: Text.HighEmphasis
              }}>
                支払い方法
              </th>
              <th style={{ 
                textAlign: 'right', 
                padding: '8px 16px', 
                borderBottom: `1px solid ${Border.LowEmphasis}`,
                color: Text.HighEmphasis
              }}>
                総売上
              </th>
            </tr>
          </thead>
          <tbody>
            {data.map((item, index) => (
              <tr key={index}>
                <td style={{ 
                  padding: '8px 16px', 
                  borderBottom: `1px solid ${Border.LowEmphasis}`,
                  color: Text.HighEmphasis
                }}>
                  {item.name}
                </td>
                <td style={{ 
                  textAlign: 'right', 
                  padding: '8px 16px', 
                  borderBottom: `1px solid ${Border.LowEmphasis}`
                }}>
                  <div style={{ fontWeight: 'bold', color: Text.HighEmphasis }}>
                    {formatCurrency(item.value)}
                  </div>
                  <div style={{ fontSize: '0.8em', color: Text.MediumEmphasis }}>
                    ({((item.value / totalAmount) * 100).toFixed(1)}%)
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

export default PaymentMethodTable;