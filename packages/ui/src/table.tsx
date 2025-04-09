const headerStyles =
  'bg-gray-50 dark:bg-dark-surface text-gray-600 dark:text-dark-text-secondary font-medium p-4 text-left';
const cellStyles =
  'border-t border-gray-200 dark:border-gray-700 p-4 dark:text-dark-text';

interface RowProps {
  label: string;
  value: string | number;
}

function Row({ label, value }: RowProps) {
  return (
    <tr>
      <td className={headerStyles}>{label}</td>
      <td className={cellStyles}>{value}</td>
    </tr>
  );
}

interface TableProps {
  headers: string[];
  rows: (string | number)[][];
  direction?: 'row' | 'column';
}

export function Table({ headers, rows, direction = 'row' }: TableProps) {
  if (direction === 'column') {
    return (
      <table className="w-full">
        <tbody>
          {headers.map((header, index) => {
            const value = rows[0]?.[index] ?? '';
            return <Row key={header} label={header} value={value} />;
          })}
        </tbody>
      </table>
    );
  }

  return (
    <table className="w-full">
      <thead>
        <tr>
          {headers.map(header => (
            <th key={header} className={headerStyles}>
              {header}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {rows.map((row, rowIndex) => (
          <tr key={rowIndex}>
            {row.map((cell, cellIndex) => (
              <td key={cellIndex} className={cellStyles}>
                {cell}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}
