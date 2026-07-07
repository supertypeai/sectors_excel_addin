import { useState } from "react";
import { Check, Copy, Info, Plus } from "lucide-react";
import { API_SCHEMA } from "@sectors/core/schema";
import { buildFunctionTree } from "./build-function-tree";
import { callServer } from "../call-server";
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "./ui/accordion";
import { ToggleGroup, ToggleGroupItem } from "./ui/toggle-group";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "./ui/tooltip";
import { TypographySmall } from "./typography/header";
import { TypographyExternal } from "./typography/paragraph";
import Garuda from "./commons/countryIcon/Garuda";
import Merlion from "./commons/countryIcon/Merlion";
import KLCC from "./commons/countryIcon/KLCC";

const functionData = buildFunctionTree(API_SCHEMA);
const DOCS_BASE = "https://docs.sectors.app/api-references/";

const EXCHANGE_ICONS: Record<string, React.FC<{ className?: string }>> = {
  idx: Garuda,
  sgx: Merlion,
  klse: KLCC,
};

// Spectral indices cycling for parameter coloring
const PARAM_SPECTRAL = [2, 3, 4, 7, 8, 9, 10, 12];

interface FunctionToolsProps {
  hasParams: boolean;
  showDescriptions: boolean;
  onToggleDescriptions: () => void;
  copied: boolean;
  onCopy: () => void;
  applying: boolean;
  onApply: () => void;
}

function FunctionTools({
  hasParams, showDescriptions, onToggleDescriptions,
  copied, onCopy, applying, onApply,
}: FunctionToolsProps) {
  return (
    <TooltipProvider>
      <div className="flex flex-col bg-white rounded-lg border border-stone-200 p-0.5">
        {hasParams && (
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                className={`p-1.5 rounded cursor-pointer transition-colors ${
                  showDescriptions ? "text-foreground/70" : "text-foreground/30 hover:text-foreground/70"
                }`}
                onClick={onToggleDescriptions}
              >
                <Info className="w-3 h-3" />
              </button>
            </TooltipTrigger>
            <TooltipContent>Show parameter descriptions</TooltipContent>
          </Tooltip>
        )}
        <Tooltip>
          <TooltipTrigger asChild>
            <button
              className="p-1.5 text-foreground/50 hover:text-foreground rounded cursor-pointer transition-colors"
              onClick={onCopy}
            >
              {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
            </button>
          </TooltipTrigger>
          <TooltipContent>{copied ? "Copied!" : "Copy formula"}</TooltipContent>
        </Tooltip>
        <Tooltip>
          <TooltipTrigger asChild>
            <button
              className="p-1.5 text-foreground/50 hover:text-foreground rounded cursor-pointer transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              onClick={onApply}
              disabled={applying}
            >
              <Plus className="w-3 h-3" />
            </button>
          </TooltipTrigger>
          <TooltipContent>{applying ? "Applying..." : "Apply to selected cell"}</TooltipContent>
        </Tooltip>
      </div>
    </TooltipProvider>
  );
}

export default function FunctionsSection() {
  const [exchange, setExchange] = useState(functionData[0].key);
  const [copiedFn, setCopiedFn] = useState<string | null>(null);
  const [applyingFn, setApplyingFn] = useState<string | null>(null);
  const [openParamDesc, setOpenParamDesc] = useState<Set<string>>(new Set());

  function handleCopy(example: string, fnName: string) {
    navigator.clipboard.writeText(example).then(() => {
      setCopiedFn(fnName);
      setTimeout(() => setCopiedFn(null), 2000);
    });
  }

  async function handleApply(example: string, fnName: string) {
    setApplyingFn(fnName);
    try {
      await callServer("applyFormulaToCell", example);
    } finally {
      setApplyingFn(null);
    }
  }

  return (
    <>
      <ToggleGroup
        type="single"
        value={exchange}
        onValueChange={(v) => v && setExchange(v)}
        className="flex w-full py-2"
      >
        <div className="flex w-full justify-around gap-2 px-2">
          {functionData.map((group) => {
            const Icon = EXCHANGE_ICONS[group.key];
            return (
              <ToggleGroupItem
                key={group.key}
                value={group.key}
                className="flex-1 gap-1 shadow-sm cursor-pointer data-[state=on]:text-spectral1"
              >
                {Icon && <Icon className="w-4 h-4" />}
                <TypographySmall className="text-inherit">{group.name}</TypographySmall>
              </ToggleGroupItem>
            );
          })}
        </div>
      </ToggleGroup>

      {functionData.map((group) => (
        exchange === group.key && (
          <Accordion
            type="multiple"
            defaultValue={group.categories.length > 0 ? [group.categories[0].name] : []}
          >
            <div>
              {group.categories.map((category) => (
            <div>
              <AccordionItem key={category.name} value={category.name} className="border-none">
                <AccordionTrigger className="cursor-pointer px-2 rounded-lg hover:bg-card text-foreground/70 hover:text-foreground data-[state=open]:text-spectral1 transition-colors">
                  {category.name}
                </AccordionTrigger>
                <AccordionContent>
                  <div>
                    {category.functions.map((fn, fnIdx) => {
                      const exampleValues = (() => {
                        const m = fn.example.match(/^=([A-Z_]+)\((.*)\)$/);
                        return m ? m[2].split(',').map(p => p.trim()) : [];
                      })();
                      return (
                      <div
                        key={fn.name}
                      >
                        <Accordion type="single" collapsible defaultValue={fnIdx === 0 ? "details" : undefined}>
                          <AccordionItem value="details" className="border-none">
                            <div className="break-words min-w-0 w-fit">
                              <AccordionTrigger className="py-1 px-2 ml-2 rounded-lg cursor-pointer [&>svg]:hidden hover:bg-background-muted text-foreground/70 hover:text-foreground data-[state=open]:text-spectral1 transition-colors">
                                <TypographySmall className="text-left">
                                  {fn.description}
                                </TypographySmall>
                              </AccordionTrigger>
                            </div>
                            <AccordionContent className="bg-card rounded-lg ml-2 shadow-sm my-1 mb-4">
                              {fn.xMdxPath && (
                                <TypographyExternal
                                  href={DOCS_BASE + fn.xMdxPath}
                                  className="text-[10px] ml-4 text-stone-500"
                                >
                                  Documentation
                                </TypographyExternal>
                              )}

                              {/* Merged signature + example block */}
                              <div className="group/tools relative bg-white rounded-lg mx-2 border border-stone-200 p-2">
                                {/* FunctionTools — vertical, pops to the left on block hover */}
                                <div className="absolute right-0 top-1/2 -translate-y-1/2 -translate-x-1 z-10 opacity-0 group-hover/tools:opacity-80 transition-opacity duration-150">
                                  <FunctionTools
                                    hasParams={fn.params.length > 0}
                                    showDescriptions={openParamDesc.has(fn.name)}
                                    onToggleDescriptions={() => {
                                      const next = new Set(openParamDesc);
                                      if (next.has(fn.name)) next.delete(fn.name);
                                      else next.add(fn.name);
                                      setOpenParamDesc(next);
                                    }}
                                    copied={copiedFn === fn.name}
                                    onCopy={() => handleCopy(fn.example, fn.name)}
                                    applying={applyingFn === fn.name}
                                    onApply={() => handleApply(fn.example, fn.name)}
                                  />
                                </div>

                                  {/* Function name header */}
                                  <div className="font-mono text-xs">
                                    <span className="break-all">{fn.name}</span>
                                    <span> (</span>
                                  </div>

                                  {/* Params with inline example values */}
                                  {fn.params.length > 0 ? (
                                    <div className="pl-4">
                                      {fn.params.map((p, idx) => {
                                        const spectral = PARAM_SPECTRAL[idx % PARAM_SPECTRAL.length];
                                        const value = exampleValues[idx];
                                        return (
                                          <div key={p.name} className="font-mono flex flex-col text-xs">
                                            <span>
                                              <span className="text-foreground/90">
                                                {p.optional ? `[${p.name}]` : p.name}
                                              </span>
                                              {value && (
                                                <span style={{ color: `hsl(var(--spectral${spectral}))` }}>
                                                  {" "}{value}
                                                </span>
                                              )}
                                              {","}
                                            </span>
                                            {openParamDesc.has(fn.name) && (
                                              <div className="pl-4 text-xs text-foreground/60 font-sans">
                                                {p.description}
                                              </div>
                                            )}
                                          </div>
                                        );
                                      })}
                                    </div>
                                  ) : (
                                    <div className="ml-2 text-xs text-foreground/40 italic font-mono">
                                      No parameters required, you can invoke it right away
                                    </div>
                                  )}

                                  <span className="font-mono text-xs">)</span>
                              </div>
                            </AccordionContent>
                          </AccordionItem>
                        </Accordion>
                      </div>
                      );
                    })}
                  </div>
                </AccordionContent>
              </AccordionItem>
            </div>
          ))}
            </div>
          </Accordion>
        )
      ))}
    </>
  );
}
