import { Box } from "@/components/shared/Box";
import { Title } from "@/components/shared/BoxTitle";
import type { ModelProps } from "@/Types/types";

export default function Model({ title, description, options }: ModelProps) {
  return (
    <Box variant="dashed">
      <Title title={title} />
      {!!description && <p>{description}</p>}
    </Box>
  );
}
