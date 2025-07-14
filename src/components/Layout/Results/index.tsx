import { v4 as uuidv4 } from "uuid";
import { Box } from "@/components/shared/Box";
import { Title } from "@/components/shared/BoxTitle";
import { useCalculator } from "@/context/calculator-context";

type ResultsProps = {
  product: string;
};

export const Results = ({ product }: ResultsProps) => {
  const { panelCount, doorsCount, gapWidth, gapHeight, lockDiscounts } =
    useCalculator();

  return (
    <div className="w-full">
      <Title title={`Resultado de folgas para ${product}`} />
      <div className="grid w-full grid-cols-2 gap-4">
        <Box className="w-full" variant="gray">
          <div>
            <h3>Informações e medidas</h3>
            <p>Número de vidros:</p>
            <p>Painéis: {panelCount}</p>
            <p>Portas: {doorsCount}</p>
            <p>Medidas do vão:</p>
            <p>Largura: {gapWidth} mm</p>
            <p>Altura: {gapHeight} mm</p>
            <p>Descontos de fechadura:</p>
            {lockDiscounts.map((discount, index) => (
              <p key={uuidv4()}>
                Porta {index + 1}: {discount} mm
              </p>
            ))}
          </div>
        </Box>
        <Box variant="blue">
          <div>
            <h3>Dimensões dos vidros</h3>
          </div>
        </Box>
      </div>
    </div>
  );
};
