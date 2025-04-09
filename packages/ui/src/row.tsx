interface RowProps {
  label: string;
  value: string | number;
  classNames?: {
    label?: string;
    value?: string;
  };
}

export function Row({ label, value, classNames }: RowProps) {
  return (
    <div
      className={`flex flex-row w-full justify-between ${classNames?.label}`}
    >
      <div
        className={`text-gray-500 font-medium text-left ${classNames?.label}`}
      >
        {label}
      </div>
      <div
        className={` line-clamp-1 text-ellipsis max-w-[50%] ${classNames?.value}`}
      >
        {value}
      </div>
    </div>
  );
}
