"use client";

import { Card, CardHeader, CardBody, CardFooter, Button } from "@heroui/react";
import { Feature } from "@/config/features";
import Link from "next/link";
import {
  ArrowRight,
  Leaf,
  Map,
  BarChart3,
  Settings,
  LucideIcon,
  Zap,
  Sparkles,
} from "lucide-react";

const IconMap: Record<string, LucideIcon> = {
  Leaf,
  Map,
  BarChart3,
  Settings,
  Zap,
  Sparkles,
};

type FeatureStatus = "New" | "Beta" | "Pro" | null;

interface FeatureCardProps {
  feature: Feature;
  status?: FeatureStatus;
}

export const FeatureCard = ({ feature, status = null }: FeatureCardProps) => {
  const Icon = IconMap[feature.iconName] || Map;

  const statusConfig = status
    ? {
        New: {
          text: "NEW",
          icon: Sparkles,
          gradient: "from-[#00A86B]/80 to-[#00A86B]/60",
          glow: "shadow-[0_0_20px_rgba(0,168,107,0.6)]",
        },
        Beta: {
          text: "BETA",
          icon: Zap,
          gradient: "from-[#FFB200]/80 to-[#FFB200]/60",
          glow: "shadow-[0_0_20px_rgba(255,178,0,0.6)]",
        },
        Pro: {
          text: "PRO",
          icon: Sparkles,
          gradient: "from-[#F1677C]/80 to-[#F1677C]/60",
          glow: "shadow-[0_0_20px_rgba(241,103,124,0.6)]",
        },
      }[status]
    : null;

  return (
    <Link
      href={`/features/${feature.slug}`}
      className="group block h-full focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0077FF]/50 focus-visible:ring-offset-2 focus-visible:ring-offset-transparent rounded-3xl"
      aria-label={`Explore ${feature.title.en}`}
    >
      <div className="relative h-full p-[1px] rounded-3xl bg-gradient-to-br from-white/20 via-white/10 to-white/5 dark:from-white/10 dark:via-white/5 dark:to-transparent group-hover:from-[#0077FF]/30 group-hover:via-[#00A86B]/20 group-hover:to-transparent transition-all duration-500">
        {/* Outer glow effect */}
        <div
          className="absolute -inset-[2px] bg-gradient-to-br from-[#0077FF]/0 via-[#00A86B]/0 to-transparent rounded-3xl opacity-0 group-hover:opacity-100 blur-xl transition-opacity duration-500"
          aria-hidden="true"
        />

        <Card
          className="relative h-full bg-white/10 dark:bg-white/5 backdrop-blur-xl backdrop-saturate-150 border border-white/20 dark:border-white/10 rounded-3xl shadow-[0_8px_32px_0_rgba(0,119,255,0.1)] group-hover:shadow-[0_8px_32px_0_rgba(0,119,255,0.3)] group-hover:bg-white/15 dark:group-hover:bg-white/10 transition-all duration-500"
          shadow="none"
        >
          {/* Floating orbs background */}
          <div
            className="absolute inset-0 overflow-hidden rounded-3xl"
            aria-hidden="true"
          >
            <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-[#0077FF]/20 to-transparent rounded-full blur-3xl group-hover:scale-150 transition-transform duration-700" />
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-gradient-to-tr from-[#00A86B]/20 to-transparent rounded-full blur-3xl group-hover:scale-150 transition-transform duration-700 delay-100" />
          </div>

          {/* Header */}
          <CardHeader className="flex-row gap-4 pb-3 items-start relative z-10">
            {/* Glass icon container */}
            <div className="relative group/icon">
              <div
                className="absolute inset-0 bg-gradient-to-br from-[#0077FF]/30 to-[#00A86B]/30 rounded-2xl blur-md opacity-0 group-hover/icon:opacity-100 transition-opacity duration-300"
                aria-hidden="true"
              />
              <div className="relative p-3.5 rounded-2xl bg-gradient-to-br from-white/20 to-white/10 dark:from-white/10 dark:to-white/5 backdrop-blur-md border border-white/30 dark:border-white/20 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.3)] group-hover:scale-110 group-hover:rotate-6 transition-all duration-500">
                <Icon
                  size={26}
                  strokeWidth={2}
                  className="text-[#0077FF] dark:text-[#0077FF] drop-shadow-[0_2px_8px_rgba(0,119,255,0.5)]"
                  aria-hidden="true"
                />
              </div>
            </div>

            {/* Title and status */}
            <div className="flex flex-col gap-1.5 flex-1 min-w-0">
              <div className="flex items-start justify-between gap-2">
                <h3 className="text-lg font-bold text-foreground dark:text-white/90 group-hover:text-[#0077FF] dark:group-hover:text-[#0077FF] transition-colors duration-300 line-clamp-2 drop-shadow-sm">
                  {feature.title.en}
                </h3>

                {statusConfig && (
                  <div
                    className={`shrink-0 flex items-center gap-1.5 px-3 py-1 rounded-full bg-gradient-to-r ${statusConfig.gradient} backdrop-blur-md border border-white/30 dark:border-white/20 ${statusConfig.glow} group-hover:scale-105 transition-all duration-300`}
                  >
                    <statusConfig.icon size={12} className="text-white" />
                    <span className="text-xs font-bold text-white tracking-wide">
                      {statusConfig.text}
                    </span>
                  </div>
                )}
              </div>

              <p className="text-xs text-foreground/60 dark:text-white/50 line-clamp-1 font-medium">
                {feature.title.id}
              </p>
            </div>
          </CardHeader>

          {/* Body */}
          <CardBody className="pt-1 pb-4 gap-3 relative z-10">
            <p className="text-sm text-foreground/80 dark:text-white/70 leading-relaxed line-clamp-3 font-medium">
              {feature.description.en}
            </p>

            {/* Glass tags */}
            <div className="flex flex-wrap gap-2">
              {feature.tags.map((tag) => (
                <div
                  key={tag}
                  className="px-3 py-1.5 rounded-full bg-white/20 dark:bg-white/10 backdrop-blur-md border border-white/30 dark:border-white/20 text-xs font-semibold text-foreground/80 dark:text-white/80 shadow-sm hover:bg-[#0077FF]/30 hover:border-[#0077FF]/40 hover:text-[#0077FF] dark:hover:text-white hover:shadow-[0_0_12px_rgba(0,119,255,0.4)] hover:scale-105 transition-all duration-300 cursor-pointer"
                >
                  {tag}
                </div>
              ))}
            </div>
          </CardBody>

          {/* Footer */}
          <CardFooter className="pt-0 relative z-10">
            <div className="w-full relative group/button">
              {/* Button glow */}
              <div
                className="absolute inset-0 bg-gradient-to-r from-[#0077FF] to-[#00A86B] rounded-2xl opacity-0 group-hover/button:opacity-100 blur-xl transition-opacity duration-300"
                aria-hidden="true"
              />

              <Button
                className="relative w-full h-12 bg-gradient-to-r from-[#0077FF]/90 to-[#00A86B]/90 hover:from-[#0077FF] hover:to-[#00A86B] backdrop-blur-md border border-white/30 text-white font-semibold shadow-[0_4px_16px_rgba(0,119,255,0.3)] hover:shadow-[0_8px_24px_rgba(0,119,255,0.5)] hover:-translate-y-0.5 transition-all duration-300 rounded-2xl"
                endContent={
                  <ArrowRight
                    size={18}
                    className="transition-transform duration-300 group-hover:translate-x-1"
                    aria-hidden="true"
                  />
                }
                tabIndex={-1}
              >
                <span className="drop-shadow-sm">Explore Feature</span>
              </Button>
            </div>
          </CardFooter>
        </Card>
      </div>
    </Link>
  );
};
