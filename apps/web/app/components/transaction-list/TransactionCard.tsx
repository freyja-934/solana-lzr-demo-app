import { Transaction } from '@repo/types';
import { Card, Row } from '@repo/ui';

export const TransactionCard = ({
  from,
  to,
  value,
  hash,
  timestamp,
  status,
}: Transaction) => {
  return (
    <Card>
      <div className="flex flex-col gap-4">
        <div>
          <p className="text-lg font-semibold text-gray-500">Event</p>
          <div className="text-2xl font-semibold">Transfer</div>
        </div>
        <hr />
        <Row label="Block" value="12345678" />
        <Row label="Network" value="Ethereum" />
        <hr />
        <div className="grid grid-cols-3">
          <div className="text-gray-500 font-medium">Params</div>
          <div className="col-span-2">
            <Row label="From" value={from} />
            <Row label="To" value={to} />
            <Row label="Value" value={value} />
            <Row label="Hash" value={hash} />
            <Row label="Timestamp" value={timestamp} />
          </div>
        </div>
      </div>
    </Card>
  );
};
