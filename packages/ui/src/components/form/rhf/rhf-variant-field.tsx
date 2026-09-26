"use client";
import * as React from "react";
import { useFieldArray, type Control, type FieldPath, type FieldValues } from "react-hook-form";
import { Plus, Trash2 } from "lucide-react";
import { Button } from "@repo/ui/components/core/button";
import { Card } from "@repo/ui/components/core/card";
import { Label } from "@repo/ui/components/core/label";
import { Input } from "@repo/ui/components/core/input";

type Props<T extends FieldValues> = { control: Control<T>; name: FieldPath<T>; label?: string };

// Supports all variant types: each variant holds N option/value pairs
// (e.g. Size:M + Color:Black), matching backend optionValues[] array.
export function RHFVariantField<T extends FieldValues>({ control, name, label }: Props<T>) {
  const { fields, append, remove, update } = useFieldArray({ control, name: name as never });
  const reg = (n: string) => (control as unknown as { register: (s: string) => object }).register(n);
  const get = (i: number) => (fields[i] as unknown as { optionValues?: { option: string; value: string }[] });

  return (
    <div className="space-y-3">
      {label && <Label variant="field" weight="semibold">{label}</Label>}
      {fields.length === 0 && <p className="text-xs text-muted-foreground">No variants yet. Add variant (supports Size, Color, Weight, Pack combos).</p>}
      {fields.map((f, i) => {
        const pairs = get(i)?.optionValues ?? [{ option: "", value: "" }];
        return (
          <Card key={f.id} className="gap-0 p-3 py-3">
            <div className="grid gap-2 md:grid-cols-3">
              <Input placeholder="SKU e.g. TS-BLK-M" {...reg(`${String(name)}.${i}.sku`)} />
              <Input placeholder="Price Override" type="number" {...reg(`${String(name)}.${i}.priceOverride`)} />
              <div className="flex items-center gap-2">
                <label className="flex items-center gap-1 text-xs"><input type="checkbox" {...reg(`${String(name)}.${i}.stock.isStock`)} /> In Stock</label>
                <Button type="button" variant="secondary" size="icon-sm" onClick={() => remove(i)}><Trash2 className="size-4" /></Button>
              </div>
            </div>
            <div className="mt-2 space-y-2">
              {pairs.map((_, j) => (
                <div key={j} className="grid gap-2 md:grid-cols-[1fr_1fr_auto]">
                  <Input placeholder="Option e.g. Size / Color" {...reg(`${String(name)}.${i}.optionValues.${j}.option`)} />
                  <Input placeholder="Value e.g. M / Black" {...reg(`${String(name)}.${i}.optionValues.${j}.value`)} />
                  <Button
                    type="button" appearance="ghost" size="icon-sm"
                    onClick={() => {
                      const cur = { ...(fields[i] as object) } as { optionValues: { option: string; value: string }[] };
                      cur.optionValues = cur.optionValues.filter((_, k) => k !== j);
                      update(i, cur as never);
                    }}
                  >
                    <Trash2 className="size-4" />
                  </Button>
                </div>
              ))}
              <Button
                type="button" appearance="outline" size="sm"
                onClick={() => {
                  const cur = { ...(fields[i] as object) } as { optionValues: { option: string; value: string }[] };
                  cur.optionValues = [...(cur.optionValues ?? []), { option: "", value: "" }];
                  update(i, cur as never);
                }}
              >
                <Plus className="size-4" /> Add option
              </Button>
            </div>
          </Card>
        );
      })}
      <Button type="button" size="sm" onClick={() => append({ sku: "", priceOverride: undefined, stock: { isStock: true }, isActive: true, optionValues: [{ option: "", value: "" }] } as never)}>
        <Plus className="size-4" /> Add Variant
      </Button>
    </div>
  );
}
