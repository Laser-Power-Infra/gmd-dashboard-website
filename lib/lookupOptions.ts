import { prisma } from './prisma';

/** Cost form field -> LookupOption.type that feeds its dropdown. */
const COST_LOOKUP_TYPES = {
  valveType: 'ITEM_TYPE',
  size: 'SIZE',
  pressure: 'PN_RATING',
  material: 'MOC',
} as const;

export type CostLookupField = keyof typeof COST_LOOKUP_TYPES;
export type CostFormOptions = Record<CostLookupField, string[]>;

// ITEM_TYPE also lists parts (WIRE NAIL, O-RING, ...); the cost form is for valves only.
const IS_VALVE_ITEM = /VALVE|SLUICE|STRAINER/i;

/** Active lookup values for the /cost dropdowns, in the lookup table's own order. */
export async function getCostFormOptions(): Promise<CostFormOptions> {
  const rows = await prisma.lookupOption.findMany({
    where: { type: { in: Object.values(COST_LOOKUP_TYPES) }, isActive: true },
    orderBy: [{ sortOrder: 'asc' }, { value: 'asc' }],
    select: { type: true, value: true },
  });
  const values = (type: string) => rows.filter((r) => r.type === type).map((r) => r.value);

  return {
    valveType: values(COST_LOOKUP_TYPES.valveType).filter((v) => IS_VALVE_ITEM.test(v)),
    size: values(COST_LOOKUP_TYPES.size),
    pressure: values(COST_LOOKUP_TYPES.pressure),
    material: values(COST_LOOKUP_TYPES.material),
  };
}
