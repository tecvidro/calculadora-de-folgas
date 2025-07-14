import { useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { Box } from "@/components/shared/Box";
import { Title } from "@/components/shared/BoxTitle";
import { InputNumber } from "@/components/shared/InputNumber";
import type { LockProps } from "@/Types/types";

export default function Lock({
  title,
  description,
  text,
  defaultValues,
  label,
  setLockDiscounts,
}: LockProps) {
  const [lockValues, setLockValues] = useState<number[]>(defaultValues);

  useEffect(() => {
    setLockDiscounts(lockValues);
  }, [lockValues, setLockDiscounts]);

  const handleLockChange = (index: number, value: number) => {
    setLockValues((prevValues) => {
      const newValues = [...prevValues];
      newValues[index] = value;
      return newValues;
    });
  };

  return (
    <Box className="flex flex-col gap-4">
      <Title title={title} />
      <p>{description}</p>
      <div className="flex justify-between gap-4">
        {defaultValues.map((_, i) => (
          <InputNumber
            defaultValue={lockValues[i]}
            key={uuidv4()}
            label={`${label} ${i + 1}`}
            name={`${label}_${i + 1}`}
            onChange={(value) => handleLockChange(i, value)}
          />
        ))}
      </div>
      {text?.map((item) => <p key={item.index}>{item.text}</p>)}
    </Box>
  );
}
