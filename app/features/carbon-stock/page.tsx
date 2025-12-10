"use client";

import { useState } from "react";
import { CarbonMap } from "@/components/carbon-map";
import { CarbonAnalytics } from "@/components/carbon-analytics";
import { Info, BookOpen } from "lucide-react";
import { Card, CardBody, Button } from "@heroui/react";
import Link from "next/link";

export default function CarbonStockPage() {
  const [selectedYear, setSelectedYear] = useState(2024);
  const [visualMode, setVisualMode] = useState<"landCover" | "carbonStock">(
    "landCover"
  );
  const years = [2020, 2021, 2022, 2024, 2025];

  return (
    <div className="space-y-8 pb-12">
      {/* Header Section */}
      <div className="space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary mb-2">
              Carbon Stock Analysis
            </h1>
          </div>

          {/* Methodology Button */}
          <Link href="/features/carbon-stock/method">
            <Button
              color="primary"
              variant="bordered"
              startContent={<BookOpen size={18} />}
              className="font-semibold"
            >
              View Methodology
            </Button>
          </Link>
        </div>

        <p className="text-default-600 max-w-3xl">
          Monitor and analyze carbon stock distribution across different zones.
          Track historical trends and predict future carbon sequestration
          patterns.
        </p>

        {/* Data Timeline Explanation */}
        <Card className="bg-primary/5 border border-primary/20">
          <CardBody className="p-4">
            <div className="flex gap-3">
              <Info className="text-primary flex-shrink-0 mt-0.5" size={20} />
              <div className="space-y-1">
                <p className="text-sm font-semibold text-primary">
                  Data Timeline Information
                </p>
                <div className="text-sm text-default-600">
                  <span className="font-medium">
                    Currently viewing:{" "}
                    <span className="text-primary font-bold">
                      {selectedYear}
                    </span>
                  </span>
                  <span className="mx-2">•</span>
                  <span>2021–2025: Actual measured data.</span>
                  <span className="mx-2">•</span>
                  <span>
                    2026:{" "}
                    <span className="text-extra-orange font-semibold">
                      Prediction
                    </span>
                    .
                  </span>
                </div>
              </div>
            </div>
          </CardBody>
        </Card>
      </div>

      {/* Main Content: Map + Analytics */}
      <div className="grid grid-cols-1  gap-6">
        <div className="flex justify-between items-center w-full">
          {/* Visual Selector */}

          <div className="flex flex-wrap gap-1.5 p-1.5 rounded-xl border border-divider/20 bg-background/50 backdrop-blur-xl backdrop-saturate-150 shadow-md">
            <Button
              size="sm"
              variant={visualMode === "landCover" ? "solid" : "light"}
              color={visualMode === "landCover" ? "primary" : "default"}
              onPress={() => setVisualMode("landCover")}
              className={`font-semibold text-sm min-w-0 px-3 ${
                visualMode === "landCover"
                  ? "shadow-lg shadow-primary/30 text-white font-bold"
                  : "text-default-500 hover:text-foreground/80 hover:bg-default-200/50"
              }`}
            >
              Land Cover
            </Button>
            <Button
              size="sm"
              variant={visualMode === "carbonStock" ? "solid" : "light"}
              color={visualMode === "carbonStock" ? "primary" : "default"}
              onPress={() => setVisualMode("carbonStock")}
              className={`font-semibold text-sm min-w-0 px-3 ${
                visualMode === "carbonStock"
                  ? "shadow-lg shadow-primary/30 text-white font-bold"
                  : "text-default-500 hover:text-foreground/80 hover:bg-default-200/50"
              }`}
            >
              Carbon Stock
            </Button>
          </div>

          {/* Year Selector */}

          <div className="flex flex-wrap gap-1.5 p-1.5 rounded-xl border border-divider/20 bg-background/50 backdrop-blur-xl backdrop-saturate-150 shadow-md">
            {years.map((year) => (
              <Button
                key={year}
                size="sm"
                variant={selectedYear === year ? "solid" : "light"}
                color={selectedYear === year ? "primary" : "default"}
                onPress={() => setSelectedYear(year)}
                className={`font-semibold text-sm min-w-0 px-3 ${
                  selectedYear === year
                    ? "shadow-lg shadow-primary/30 text-white font-bold"
                    : "text-default-500 hover:text-foreground/80 hover:bg-default-200/50"
                }`}
              >
                {year}
              </Button>
            ))}
          </div>
        </div>

        {/* Map Section */}
        <div className="order-1 lg:order-1">
          <Card className="bg-background/80 backdrop-blur-xl border-none h-full">
            <CardBody className="p-0">
              <CarbonMap
                className="h-[500px] lg:h-[700px]"
                year={selectedYear}
                visualMode={visualMode}
              />
            </CardBody>
          </Card>
        </div>

        {/* Analytics Section */}
        <div className="order-2 lg:order-2">
          <CarbonAnalytics />
        </div>
      </div>
    </div>
  );
}
