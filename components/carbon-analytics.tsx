"use client";

import { useEffect, useState } from "react";
import { Card, CardBody, CardHeader } from "@heroui/react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { TrendingUp, TrendingDown, AlertCircle } from "lucide-react";

interface CarbonStockData {
  year: string;
  carbon: number;
  type: "actual" | "prediction";
}

interface RegionCarbonData {
  region: string;
  carbon: number;
}

interface GeoJSONFeature {
  type: "Feature";
  properties: {
    KAB_KOTA: string | null;
    PROVINSI: string;
    layer: string;
    "2020": number | null;
    "2021": number | null;
    "2022": number | null;
    "2023": number | null;
    "2024": number | null;
    "2025": number | null;
    [key: string]: string | number | null | undefined;
  };
  geometry: GeoJSON.Geometry;
}

interface GeoJSONData {
  type: "FeatureCollection";
  features: GeoJSONFeature[];
}

interface CarbonDataLookup {
  [region: string]: {
    provinsi: string;
    layer: string;
    carbonStock: {
      [year: string]: number | null;
    };
  };
}

const CustomTooltip = ({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: {
    name: string;
    value: number;
    color?: string;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    [key: string]: any;
  }[];
  label?: string;
}) => {
  if (active && payload && payload.length) {
    return (
      <div
        style={{
          position: "relative",
          zIndex: 99999,
          backgroundColor: "hsl(var(--background))",
          border: "1px solid hsl(var(--foreground) / 0.2)",
          borderRadius: "8px",
          padding: "8px 12px",
          boxShadow: "0 8px 16px rgba(0, 0, 0, 0.2)",
          pointerEvents: "none",
        }}
        className="text-sm text-default-700"
      >
        <p className="font-semibold text-lg mb-1">{label}</p>
        {payload?.map((item, index: number) => (
          <p key={index} style={{ color: item.color || "currentColor" }}>
            {`${item.name}: `}
            <span className="font-bold">{`${item.value.toFixed(
              2
            )} tC/ha`}</span>
          </p>
        ))}
      </div>
    );
  }

  return null;
};

// --- Main Component ---

export const CarbonAnalytics = () => {
  const [carbonDataLookup, setCarbonDataLookup] =
    useState<CarbonDataLookup | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/data/admin_boundaries.geojson")
      .then((res) => res.json())
      .then((geojsonData: GeoJSONData) => {
        const lookup: CarbonDataLookup = {};

        geojsonData.features.forEach((feature) => {
          const regionName = feature.properties.KAB_KOTA;

          if (!regionName) return;

          lookup[regionName] = {
            provinsi: feature.properties.PROVINSI || "",
            layer: feature.properties.layer || "",
            carbonStock: {
              "2020": feature.properties["2020"],
              "2021": feature.properties["2021"],
              "2022": feature.properties["2022"],
              "2023": feature.properties["2023"],
              "2024": feature.properties["2024"],
              "2025": feature.properties["2025"],
            },
          };
        });

        setCarbonDataLookup(lookup);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error loading carbon data:", err);
        setLoading(false);
      });
  }, []);

  if (loading || !carbonDataLookup) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="bg-default-100 animate-pulse">
              <CardBody className="p-4 h-24" />
            </Card>
          ))}
        </div>
      </div>
    );
  }

  const YEARS = ["2020", "2021", "2022", "2024", "2025"];
  const regions = Object.keys(carbonDataLookup);
  const LATEST_YEAR = "2025";

  const yearlyAverages: CarbonStockData[] = YEARS.map((year) => {
    const values = regions
      .map((region) => carbonDataLookup[region].carbonStock[year])
      .filter((val): val is number => val !== null && val !== 0);

    const avg =
      values.length > 0
        ? values.reduce((sum, val) => sum + val, 0) / values.length
        : 0;

    return {
      year,
      carbon: parseFloat(avg.toFixed(2)),
      type: "actual",
    };
  });

  const recentYears = yearlyAverages.slice(-3);
  const avgGrowth =
    recentYears.length >= 2
      ? (recentYears[recentYears.length - 1].carbon - recentYears[0].carbon) /
        (recentYears.length - 1)
      : 0;
  const prediction2026 =
    yearlyAverages[yearlyAverages.length - 1].carbon + avgGrowth;

  const carbonTrendData: CarbonStockData[] = [
    ...yearlyAverages,
    {
      year: "2026",
      carbon: parseFloat(prediction2026.toFixed(2)),
      type: "prediction",
    },
  ];

  const latestAvgCarbon =
    yearlyAverages.find((d) => d.year === LATEST_YEAR)?.carbon || 0;
  const valuesCount = regions
    .map((region) => carbonDataLookup[region].carbonStock[LATEST_YEAR])
    .filter((val): val is number => val !== null && val !== 0).length;

  const growth2020to2025 =
    yearlyAverages.length >= 2
      ? ((yearlyAverages[yearlyAverages.length - 1].carbon -
          yearlyAverages[0].carbon) /
          yearlyAverages[0].carbon) *
        100
      : 0;

  const topRegions: RegionCarbonData[] = regions
    .map((region) => ({
      region: region,
      carbon: carbonDataLookup[region].carbonStock[LATEST_YEAR] || 0,
    }))
    .filter((item) => item.carbon > 0)
    .sort((a, b) => b.carbon - a.carbon)
    .slice(0, 10);

  const chartColors = {
    primary: "var(--chart-primary, #0077FF)",
    secondary: "var(--chart-secondary, #00A86B)",
    warning: "var(--chart-warning, #F15B22)",
    foreground: "var(--chart-foreground, #6B7280)",
    grid: "hsl(var(--foreground) / 0.15)",
  };

  return (
    <div className="space-y-8">
      {/* 📊 Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/20">
          <CardBody className="p-4">
            <p className="text-xs text-default-500 mb-1">
              Average Carbon Stock ({LATEST_YEAR})
            </p>
            <p className="text-2xl font-bold text-primary">
              {latestAvgCarbon.toFixed(2)} tC/ha
            </p>
            <p className="text-xs text-default-400 mt-1">
              Across {valuesCount} regions
            </p>
          </CardBody>
        </Card>

        <Card className="bg-gradient-to-br from-secondary/10 to-secondary/5 border border-secondary/20">
          <CardBody className="p-4">
            <p className="text-xs text-default-500 mb-1">
              Growth (2020-{LATEST_YEAR})
            </p>
            <p className="text-2xl font-bold text-secondary flex items-center gap-1">
              {growth2020to2025 >= 0 ? "+" : ""}
              {growth2020to2025.toFixed(2)}%
              {growth2020to2025 >= 0 ? (
                <TrendingUp size={20} />
              ) : (
                <TrendingDown size={20} />
              )}
            </p>
            <p className="text-xs text-default-400 mt-1">5-year change</p>
          </CardBody>
        </Card>

        <Card className="bg-gradient-to-br from-extra-orange/10 to-extra-orange/5 border border-extra-orange/20">
          <CardBody className="p-4">
            <p className="text-xs text-default-500 mb-1">2026 Forecast</p>
            <p className="text-2xl font-bold text-extra-orange">
              {prediction2026.toFixed(2)} tC/ha
            </p>
            <p className="text-xs text-default-400 mt-1">Predicted average</p>
          </CardBody>
        </Card>
      </div>

      {/* 📈 Time Series Chart (Line Chart) */}
      <Card className="bg-background/80 backdrop-blur-xl border border-default-200/50">
        <CardHeader className="flex flex-col items-start gap-2 pb-2">
          <h3 className="text-lg font-bold">
            Regional Average Carbon Stock Trend
          </h3>
          <div className="flex items-center gap-2">
            <AlertCircle size={16} className="text-extra-orange" />
            <p className="text-xs text-default-500">
              2026 data is a{" "}
              <span className="font-semibold text-extra-orange">
                prediction
              </span>{" "}
              based on historical trends
            </p>
          </div>
        </CardHeader>
        <CardBody>
          <ResponsiveContainer width="100%" height={280}>
            <LineChart data={carbonTrendData}>
              <CartesianGrid strokeDasharray="3 3" stroke={chartColors.grid} />
              <XAxis
                dataKey="year"
                stroke={chartColors.foreground}
                style={{ fontSize: "12px" }}
              />
              <YAxis
                stroke={chartColors.foreground}
                style={{ fontSize: "12px" }}
                domain={["dataMin - 5", "dataMax + 5"]}
              />
              <Legend wrapperStyle={{ paddingTop: "10px" }} iconType="circle" />
              <Tooltip
                wrapperStyle={{ zIndex: 9999 }}
                content={<CustomTooltip />}
              />
              <Line
                type="monotone"
                dataKey="carbon"
                stroke={chartColors.primary}
                strokeWidth={3}
                dot={(props) => {
                  const { cx, cy, payload } = props;
                  const dotColor =
                    payload.type === "prediction"
                      ? chartColors.warning
                      : chartColors.primary;

                  return (
                    <circle
                      cx={cx}
                      cy={cy}
                      r={5}
                      fill={dotColor}
                      stroke="hsl(var(--background))"
                      strokeWidth={2}
                    />
                  );
                }}
                name="Carbon Stock (tC/ha)"
              />
            </LineChart>
          </ResponsiveContainer>
        </CardBody>
      </Card>
      {/* � Top Regions - Ranked List with Progress Bars */}
      <Card className="bg-background/80 backdrop-blur-xl border border-default-200/50">
        <CardHeader>
          <h3 className="text-lg font-bold">
            Top 10 Regions by Carbon Stock ({LATEST_YEAR})
          </h3>
        </CardHeader>
        <CardBody>
          <div className="space-y-3">
            {topRegions.map((region, index) => {
              const maxCarbon = topRegions[0].carbon;
              const percentage = (region.carbon / maxCarbon) * 100;

              return (
                <div key={region.region} className="space-y-1">
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2 flex-1 min-w-0">
                      <span className="font-bold text-primary w-6 flex-shrink-0">
                        #{index + 1}
                      </span>
                      <span
                        className="font-medium truncate"
                        title={region.region}
                      >
                        {region.region}
                      </span>
                    </div>
                    <span className="font-bold text-secondary ml-2 flex-shrink-0">
                      {region.carbon.toFixed(2)} tC/ha
                    </span>
                  </div>
                  <div className="relative h-2 bg-default-100 rounded-full overflow-hidden">
                    <div
                      className="absolute top-0 left-0 h-full bg-gradient-to-r from-secondary to-success rounded-full transition-all duration-500"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>

          {/* Legend */}
          <div className="mt-4 pt-4 border-t border-divider">
            <p className="text-xs text-default-500">
              Values represent average carbon stock density in tonnes of carbon
              per hectare (tC/ha)
            </p>
          </div>
        </CardBody>
      </Card>
    </div>
  );
};
