import { Box } from "@/components/shared/Box";
import { Title } from "@/components/shared/BoxTitle";

type ResultsProps = {
  product: string;
};

export const Results = ({ product }: ResultsProps) => {
  const panelCount = 2;
  const doorsCount = 2;
  const gapWidth = 4000;
  const gapHeight = 2000;
  const lockDiscount = 50;

  return (
    <div>
      <Title title={`Resultado de folgas para ${product}`} />
      <div className="grid grid-cols-2">
        <Box variant="gray">
          <div>
            <h3>Informações e medidas</h3>
            <p>Número de vidros:</p>
            <p>Painéis: {panelCount} </p>
            <p>Portas: {doorsCount} </p>
            <p>Medidas do vão:</p>
            <p>Largura: {gapWidth} mm </p>
            <p>Altura: {gapHeight} mm </p>
            <p>Descontos de fechadura: {lockDiscount}</p>
          </div>
        </Box>
      </div>
    </div>
  );
};
