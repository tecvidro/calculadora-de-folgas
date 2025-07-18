type Calculator = {
  params: {
    gap: {
      width: number;
      height: number;
    };
    glasses: {
      panels: number;
      doors: number;
    };
    lock: number[];
    adjustments: {
      profile: number;
      transpass: number;
      heightDiscount: number;
      doorAdjustment: number;
    };
  };
};

export const calculator = ({ params }: Calculator) => {
  const gapWidth = params.gap.width;
  const gapHeight = params.gap.height;
  const panelsCount = params.glasses.panels;
  const doorsCount = params.glasses.doors;

  const totalProfileDiscount = params.adjustments.profile * 2;
  const totalTranpass =
    params.adjustments.transpass * (panelsCount + doorsCount - 1);
  const lockDiscounts = params.lock.reduce((sum, current) => sum + current, 0);

  const totalGap =
    gapWidth - totalProfileDiscount + (totalTranpass - lockDiscounts);

  const finalHeight = Math.ceil(gapHeight - params.adjustments.heightDiscount);

  const panelsWidth = Math.ceil(totalGap / (panelsCount + doorsCount));

  const doorsWidth = Array.from({ length: doorsCount }, (_, index) => {
    const doorWidth =
      panelsWidth + params.lock[index] - params.adjustments.doorAdjustment;
    return { id: index + 1, width: Math.ceil(doorWidth) };
  });

  return {
    panelsWidth: panelsWidth,
    doorsWidth: doorsWidth,
    finalHeight: finalHeight,
  };
};
