export type AddonItem = {
  id: string;
  addonGroupId?: string;
  name: string;
  pricePaise: number;
  rank?: number;
};

export type AddonGroup = {
  id: string;
  name: string;
  minSelection: number;
  maxSelection: number;
  items: AddonItem[];
};

export type VariationOption = {
  id: string;
  name: string;
  pricePaise: number;
  variationId?: string;
  groupName?: string;
};

export type CustomizationPayload = {
  addons: AddonGroup[];
  variations: VariationOption[];
  basePricePaise: number;
  maxPricePaise: number;
};
