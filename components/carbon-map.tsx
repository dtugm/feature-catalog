"use client";

import { useEffect, useRef, useState } from "react";
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { useTheme } from "next-themes";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

interface CarbonMapProps {
  className?: string;
  year?: number;
  visualMode?: "landCover" | "carbonStock";
}

interface CarbonData {
  provinsi: string;
  carbonStock: Record<string, number | null>;
}

export const CarbonMap = ({
  className = "",
  year = 2024,
  visualMode = "landCover",
}: CarbonMapProps) => {
  const { theme } = useTheme();
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<maplibregl.Map | null>(null);
  const popup = useRef<maplibregl.Popup | null>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [selectedFeature, setSelectedFeature] = useState<any>(null);
  const [carbonDataLookup, setCarbonDataLookup] = useState<Record<
    string,
    CarbonData
  > | null>(null);

  // Fetch carbon data from admin boundaries GeoJSON
  useEffect(() => {
    fetch("/data/admin_boundaries.geojson")
      .then((res) => res.json())
      .then((geojsonData) => {
        const lookup: Record<string, CarbonData> = {};

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        geojsonData.features.forEach((feature: any) => {
          const regionName = feature.properties.KAB_KOTA;
          if (!regionName) return;

          lookup[regionName] = {
            provinsi: feature.properties.PROVINSI || "",
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
      })
      .catch((err) => console.error("Error loading carbon data:", err));
  }, []);

  // Initialize Map
  useEffect(() => {
    if (!mapContainer.current || map.current) return;

    map.current = new maplibregl.Map({
      container: mapContainer.current,
      style: {
        version: 8,
        sources: {
          osm: {
            type: "raster",
            tiles: ["https://tile.openstreetmap.org/{z}/{x}/{y}.png"],
            tileSize: 256,
            attribution: "&copy; OpenStreetMap Contributors",
          },
        },
        layers: [
          {
            id: "osm",
            type: "raster",
            source: "osm",
          },
        ],
      },
      center: [98.726785, 2.638013],
      zoom: 7,
    });

    map.current.addControl(new maplibregl.NavigationControl(), "top-right");

    map.current.on("load", () => {
      if (visualMode === "landCover") {
        const landCoverTilesUrl = `https://yzserver-production.up.railway.app/data/sumut_${year}/{z}/{x}/{y}.pbf`;
        const sourceLayerName = `sumut_${year}`;

        map.current?.addSource("land-cover", {
          type: "vector",
          tiles: [landCoverTilesUrl],
          minzoom: 0,
          maxzoom: 14,
        });

        map.current?.addLayer({
          id: "land-cover-layer",
          type: "fill",
          source: "land-cover",
          "source-layer": sourceLayerName,
          paint: {
            "fill-color": [
              "match",
              ["get", "kelas"],
              "Sawit",
              "#FF6B35", // Palm oil - Orange
              "Vegetasi Tinggi",
              "#2D6A4F", // High vegetation - Dark green
              "Vegetasi Rendah",
              "#95D5B2", // Low vegetation - Light green
              "Perkebunan Lain",
              "#FFB627", // Other plantations - Yellow
              "Badan Air",
              "#0077BE", // Water bodies - Blue
              "Tanah Terbuka",
              "#D4A373", // Open land - Brown
              "Emplacement",
              "#8B8B8B", // Emplacement - Gray
              "#CCCCCC", // Default - Light gray
            ],
            "fill-opacity": 0.7,
          },
        });
      } else {
        map.current?.addSource("carbon-stock", {
          type: "raster",
          tiles: [
            `https://digital-twin-ugm.s3.ap-southeast-1.amazonaws.com/carbon_stock/tiles2/${year}/{z}/{x}/{y}.png`,
          ],
          tileSize: 256,
          scheme: "tms",
          minzoom: 0,
          maxzoom: 21,
        });

        map.current?.addLayer({
          id: "carbon-stock-layer",
          type: "raster",
          source: "carbon-stock",
          paint: {
            "raster-opacity": 0.8,
          },
        });
      }

      map.current?.addSource("admin-boundary", {
        type: "geojson",
        data: "/data/admin_boundaries.geojson",
        promoteId: "KAB_KOTA", // Use KAB_KOTA property as the feature ID for feature-state
      });

      map.current?.addLayer({
        id: "admin-fill",
        type: "fill",
        source: "admin-boundary",
        paint: {
          "fill-color": "#0077FF",
          "fill-opacity": [
            "case",
            ["boolean", ["feature-state", "hover"], false],
            0.5,
            0,
          ],
        },
      });

      // Admin Outline Layer
      map.current?.addLayer({
        id: "admin-outline",
        type: "line",
        source: "admin-boundary",
        paint: {
          "line-color": "#000000",
          "line-width": 2,
        },
      });

      // Interaction: Hover effect with popup
      let hoveredStateId: string | number | null = null;

      map.current?.on("mousemove", "admin-fill", (e) => {
        if (e.features && e.features.length > 0) {
          if (hoveredStateId !== null) {
            map.current?.setFeatureState(
              { source: "admin-boundary", id: hoveredStateId },
              { hover: false }
            );
          }

          if (e.features[0].id !== undefined) {
            hoveredStateId = e.features[0].id;
            map.current?.setFeatureState(
              { source: "admin-boundary", id: hoveredStateId },
              { hover: true }
            );

            // Show popup with region name
            const regionName = e.features[0].properties.KAB_KOTA;
            if (regionName) {
              if (popup.current) {
                popup.current.remove();
              }

              popup.current = new maplibregl.Popup({
                closeButton: false,
                closeOnClick: false,
                className: "region-popup",
              })
                .setLngLat(e.lngLat)
                .setHTML(
                  `<div style="padding: 4px 8px; font-size: 12px; font-weight: 600; color: black;">${regionName}</div>`
                )
                .addTo(map.current!);
            }
          }
          map.current!.getCanvas().style.cursor = "pointer";
        }
      });

      map.current?.on("mouseleave", "admin-fill", () => {
        if (hoveredStateId !== null) {
          map.current?.setFeatureState(
            { source: "admin-boundary", id: hoveredStateId },
            { hover: false }
          );
        }
        hoveredStateId = null;
        map.current!.getCanvas().style.cursor = "";

        if (popup.current) {
          popup.current.remove();
          popup.current = null;
        }
      });

      // Interaction: Click to open drawer
      map.current?.on("click", "admin-fill", (e) => {
        if (e.features && e.features.length > 0) {
          const feature = e.features[0];
          setSelectedFeature(feature.properties);

          const coordinates = e.lngLat;
          map.current?.flyTo({
            center: coordinates,
            zoom: 9,
            essential: true,
          });
        }
      });
    });

    return () => {
      map.current?.remove();
      map.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Update layers when year or visualMode changes
  useEffect(() => {
    if (!map.current) return;

    const updateLayers = () => {
      const removeLayerAndSource = (layerId: string, sourceId: string) => {
        if (map.current?.getLayer(layerId)) {
          map.current.removeLayer(layerId);
        }
        if (map.current?.getSource(sourceId)) {
          map.current.removeSource(sourceId);
        }
      };
      removeLayerAndSource("land-cover-layer", "land-cover");
      removeLayerAndSource("carbon-stock-layer", "carbon-stock");

      if (visualMode === "landCover") {
        const landCoverTilesUrl = `https://yzserver-production.up.railway.app/data/sumut_${year}/{z}/{x}/{y}.pbf`;
        const sourceLayerName = `sumut_${year}`;

        map.current?.addSource("land-cover", {
          type: "vector",
          tiles: [landCoverTilesUrl],
          minzoom: 0,
          maxzoom: 14,
        });

        map.current?.addLayer(
          {
            id: "land-cover-layer",
            type: "fill",
            source: "land-cover",
            "source-layer": sourceLayerName,
            paint: {
              "fill-color": [
                "match",
                ["get", "kelas"],
                "Sawit",
                "#FF6B35",
                "Vegetasi Tinggi",
                "#2D6A4F",
                "Vegetasi Rendah",
                "#95D5B2",
                "Perkebunan Lain",
                "#FFB627",
                "Badan Air",
                "#0077BE",
                "Tanah Terbuka",
                "#D4A373",
                "Emplacement",
                "#8B8B8B",
                "#CCCCCC",
              ],
              "fill-opacity": 0.7,
            },
          },
          "admin-fill"
        );
      } else {
        // Carbon Stock mode (Direct tile URL with TMS)
        map.current?.addSource("carbon-stock", {
          type: "raster",
          tiles: [
            `https://digital-twin-ugm.s3.ap-southeast-1.amazonaws.com/carbon_stock/tiles2/${year}/{z}/{x}/{y}.png`,
          ],
          tileSize: 256,
          scheme: "tms",
          minzoom: 0,
          maxzoom: 21,
        });

        map.current?.addLayer(
          {
            id: "carbon-stock-layer",
            type: "raster",
            source: "carbon-stock",
            paint: {
              "raster-opacity": 0.8,
            },
          },
          "admin-fill"
        );
      }
    };

    if (map.current.loaded()) {
      updateLayers();
    } else {
      map.current.on("load", updateLayers);
    }
  }, [year, visualMode]);

  return (
    <div className={`relative ${className}`}>
      <div
        ref={mapContainer}
        className="w-full h-full rounded-xl overflow-hidden shadow-sm border border-divider"
      />

      {/* Legend / Info Overlay */}
      <div className="absolute top-4 left-4 bg-white/60 dark:bg-gray-900/60 backdrop-blur-md rounded-lg p-3 shadow-lg border border-divider/50 z-10">
        <h4 className="text-xs font-bold mb-2 text-foreground">
          {visualMode === "landCover" ? "Land Cover" : "Carbon Stock"} ({year})
        </h4>
        {visualMode === "landCover" ? (
          <div className="space-y-1 text-xs text-default-600">
            <div className="flex items-center gap-2">
              <div
                className="w-3 h-3 rounded-sm"
                style={{ backgroundColor: "#FF6B35" }}
              ></div>{" "}
              Sawit
            </div>
            <div className="flex items-center gap-2">
              <div
                className="w-3 h-3 rounded-sm"
                style={{ backgroundColor: "#2D6A4F" }}
              ></div>{" "}
              Vegetasi Tinggi
            </div>
            <div className="flex items-center gap-2">
              <div
                className="w-3 h-3 rounded-sm"
                style={{ backgroundColor: "#95D5B2" }}
              ></div>{" "}
              Vegetasi Rendah
            </div>
            <div className="flex items-center gap-2">
              <div
                className="w-3 h-3 rounded-sm"
                style={{ backgroundColor: "#FFB627" }}
              ></div>{" "}
              Perkebunan Lain
            </div>
            <div className="flex items-center gap-2">
              <div
                className="w-3 h-3 rounded-sm"
                style={{ backgroundColor: "#0077BE" }}
              ></div>{" "}
              Badan Air
            </div>
            <div className="flex items-center gap-2">
              <div
                className="w-3 h-3 rounded-sm"
                style={{ backgroundColor: "#D4A373" }}
              ></div>{" "}
              Tanah Terbuka
            </div>
            <div className="flex items-center gap-2">
              <div
                className="w-3 h-3 rounded-sm"
                style={{ backgroundColor: "#8B8B8B" }}
              ></div>{" "}
              Emplacement
            </div>
            <div className="flex items-center gap-2 mt-2 pt-2 border-t border-divider/50">
              <div className="w-3 h-3 border border-black"></div> Admin Area
            </div>
          </div>
        ) : (
          <div className="flex flex-col gap-2">
            <div className="text-xs font-semibold text-default-600">
              Carbon Density (tC/ha)
            </div>
            <div className="flex gap-2 h-32">
              {/* Gradient Bar */}
              <div
                className="w-4 h-full rounded-sm border border-default-300/50"
                style={{
                  background:
                    "linear-gradient(to top, #d7191c, #fdae61, #ffffbf, #D9EAB9, #B6E1AA, #64A7B3)",
                }}
              ></div>
              {/* Scale Labels */}
              <div className="flex flex-col justify-between text-[10px] text-default-500 font-medium py-0.5">
                <span>240</span>
                <span>192</span>
                <span>144</span>
                <span>96</span>
                <span>49</span>
                <span>1</span>
              </div>
            </div>
            <div className="flex items-center gap-2 mt-1 pt-2 border-t border-divider/50 text-[10px] text-default-500">
              <div className="w-3 h-3 border border-black dark:border-white/50"></div>{" "}
              Admin Area
            </div>
          </div>
        )}
      </div>

      {/* Admin Details Drawer */}
      <AnimatePresence>
        {selectedFeature && (
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 20, stiffness: 100 }}
            className="absolute top-0 right-0 h-full w-96 bg-white/50 dark:bg-gray-900/90 backdrop-blur-xl border-l border-divider shadow-2xl z-20 p-6 overflow-y-auto"
          >
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-foreground">
                {selectedFeature.KAB_KOTA ||
                  selectedFeature.name ||
                  "Area Details"}
              </h3>
              <button
                onClick={() => setSelectedFeature(null)}
                className="p-1 hover:bg-default-100 rounded-full transition-colors text-foreground"
                aria-label="Close"
              >
                <X size={20} />
              </button>
            </div>

            <div className="space-y-4">
              <div className="p-4 rounded-lg bg-default-100/50 border border-divider">
                <p className="text-xs text-default-700 uppercase tracking-wider mb-1">
                  Region
                </p>
                <p className="text-sm font-medium text-foreground">
                  {selectedFeature.KAB_KOTA || selectedFeature.name || "N/A"}
                </p>
              </div>

              {/* Carbon Stock Chart */}
              {carbonDataLookup &&
                selectedFeature.KAB_KOTA &&
                carbonDataLookup?.[selectedFeature.KAB_KOTA] && (
                  <div className="mt-6">
                    <h4 className="font-semibold mb-3 text-foreground">
                      Carbon Stock Trends
                    </h4>
                    <p className="text-xs text-default-700 mb-4">
                      Year-to-year carbon stock changes for this region (tC/ha)
                    </p>

                    <div className="bg-default-100/60 p-4 rounded-lg border border-divider">
                      <ResponsiveContainer width="100%" height={250}>
                        <LineChart
                          data={Object.entries(
                            carbonDataLookup?.[selectedFeature.KAB_KOTA]
                              ?.carbonStock || {}
                          )
                            .filter((entry) => entry[1] !== null)
                            .map(([year, value]) => ({
                              year,
                              carbonStock:
                                typeof value === "number"
                                  ? parseFloat(value.toFixed(2))
                                  : 0,
                            }))}
                          margin={{ top: 5, right: 10, left: 0, bottom: 5 }}
                        >
                          <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                          <XAxis
                            dataKey="year"
                            tick={{
                              fontSize: 12,
                              fill: theme === "dark" ? "#fff" : "#333",
                            }}
                            stroke="hsl(var(--nextui-foreground))"
                            className="text-foreground"
                          />
                          <YAxis
                            tick={{
                              fontSize: 12,
                              fill: theme === "dark" ? "#fff" : "#333",
                            }}
                            stroke="hsl(var(--nextui-foreground))"
                            className="text-foreground"
                            label={{
                              value: "tC/ha",
                              angle: -90,
                              position: "insideLeft",
                              fontSize: 11,
                              fill: theme === "dark" ? "#fff" : "#333",
                            }}
                          />
                          <Tooltip
                            contentStyle={{
                              backgroundColor: "hsl(var(--nextui-background))",
                              border: "1px solid hsl(var(--nextui-divider))",
                              borderRadius: "8px",
                              fontSize: "12px",
                            }}
                            formatter={(value: number) => [
                              `${value} tC/ha`,
                              "Carbon Stock",
                            ]}
                          />
                          <Legend
                            wrapperStyle={{ fontSize: "12px" }}
                            formatter={() => "Carbon Stock"}
                          />
                          <Line
                            type="monotone"
                            dataKey="carbonStock"
                            stroke="hsl(var(--nextui-primary))"
                            strokeWidth={3}
                            dot={(props) => {
                              const { cx, cy, index } = props;

                              const colors = [
                                "#0077FF", // Blue
                                "#00A86B", // Green
                                "#F59E0B", // Amber
                                "#EF4444", // Red
                                "#8B5CF6", // Purple
                                "#EC4899", // Pink
                              ];
                              const color = colors[index % colors.length];

                              return (
                                <circle
                                  cx={cx}
                                  cy={cy}
                                  r={5}
                                  fill={color}
                                  stroke="white"
                                  strokeWidth={2}
                                />
                              );
                            }}
                            activeDot={{ r: 7, strokeWidth: 2 }}
                          />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>

                    {/* Current Year Stats */}
                    <div className="mt-4 grid grid-cols-2 gap-3">
                      <div className="p-3 rounded-lg bg-primary/20 border border-primary/10">
                        <p className="text-xs text-default-700 mb-1">
                          Current Year ({year})
                        </p>
                        <p className="text-lg font-bold text-primary">
                          {carbonDataLookup?.[selectedFeature.KAB_KOTA]
                            ?.carbonStock?.[year]
                            ? carbonDataLookup?.[
                                selectedFeature.KAB_KOTA
                              ]?.carbonStock[year]?.toFixed(2)
                            : "N/A"}{" "}
                          tC/ha
                        </p>
                      </div>
                      <div className="p-3 rounded-lg bg-secondary/20 border border-secondary/10">
                        <p className="text-xs text-default-700 mb-1">
                          Province
                        </p>
                        <p className="text-sm font-bold text-secondary">
                          {carbonDataLookup?.[selectedFeature.KAB_KOTA]
                            ?.provinsi || "N/A"}
                        </p>
                      </div>
                    </div>

                    {/* Year-over-Year Change */}
                    {(() => {
                      const currentYearValue =
                        carbonDataLookup?.[selectedFeature.KAB_KOTA]
                          ?.carbonStock?.[year];
                      const previousYearValue =
                        carbonDataLookup?.[selectedFeature.KAB_KOTA]
                          ?.carbonStock?.[year - 1];

                      if (currentYearValue && previousYearValue) {
                        const change = currentYearValue - previousYearValue;
                        const percentChange = (
                          (change / previousYearValue) *
                          100
                        ).toFixed(2);
                        const isPositive = change > 0;

                        return (
                          <div className="mt-3 p-3 rounded-lg bg-default-100/80 border border-divider">
                            <p className="text-xs text-default-700 mb-1">
                              Year-over-Year Change
                            </p>
                            <p
                              className={`text-lg font-bold ${
                                isPositive ? "text-green-600" : "text-red-600"
                              }`}
                            >
                              {isPositive ? "+" : ""}
                              {change.toFixed(2)} tC/ha ({isPositive ? "+" : ""}
                              {percentChange}%)
                            </p>
                          </div>
                        );
                      }
                      return null;
                    })()}

                    {/* Carbon Price Information */}
                    {selectedFeature.carbon_price_usd_per_tonne && (
                      <div className="mt-6">
                        <h4 className="font-semibold mb-3 text-foreground">
                          Carbon Credit Valuation
                        </h4>

                        <div className="grid grid-cols-2 gap-3">
                          <div className="p-3 rounded-lg bg-success/20 border border-success/10">
                            <p className="text-xs text-default-700 mb-1">
                              Carbon Price
                            </p>
                            <p className="text-lg font-bold text-success">
                              $
                              {selectedFeature.carbon_price_usd_per_tonne.toFixed(
                                2
                              )}
                            </p>
                            <p className="text-xs text-default-400 mt-1">
                              per tonne CO₂
                            </p>
                          </div>

                          {carbonDataLookup[selectedFeature.KAB_KOTA]
                            ?.carbonStock[year] &&
                            selectedFeature.conversion_factor_C_to_CO2 && (
                              <div className="p-3 rounded-lg bg-warning/20 border border-warning/10">
                                <p className="text-xs text-default-700 mb-1">
                                  Potential Value
                                </p>
                                <p className="text-lg font-bold text-warning">
                                  $
                                  {(
                                    (carbonDataLookup?.[
                                      selectedFeature.KAB_KOTA
                                    ]?.carbonStock?.[year] || 0) *
                                    selectedFeature.conversion_factor_C_to_CO2 *
                                    selectedFeature.carbon_price_usd_per_tonne
                                  ).toFixed(2)}
                                </p>
                                <p className="text-xs text-default-400 mt-1">
                                  per hectare
                                </p>
                              </div>
                            )}
                        </div>

                        {selectedFeature.price_scenario && (
                          <div className="mt-2 text-xs text-default-700 flex items-center gap-1">
                            <span className="inline-block w-2 h-2 rounded-full bg-default-300"></span>
                            <span>
                              Scenario: {selectedFeature.price_scenario}
                            </span>
                            {selectedFeature.calculation_date && (
                              <span className="ml-auto">
                                Updated: {selectedFeature.calculation_date}
                              </span>
                            )}
                          </div>
                        )}
                      </div>
                    )}

                    {/* Carbon Stock & Price Relationship Insights */}
                    {selectedFeature.carbon_price_usd_per_tonne &&
                      carbonDataLookup[selectedFeature.KAB_KOTA]?.carbonStock[
                        year
                      ] && (
                        <div className="mt-6 p-4 rounded-lg bg-gradient-to-br from-primary/5 to-secondary/5 border border-primary/20">
                          <div className="flex items-start gap-2 mb-2">
                            <div className="mt-0.5">
                              <svg
                                className="w-4 h-4 text-primary"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                                />
                              </svg>
                            </div>
                            <div>
                              <h5 className="text-sm font-semibold text-primary mb-1">
                                Understanding Carbon Credits
                              </h5>
                              <p className="text-xs text-default-600 leading-relaxed">
                                Carbon stock represents the amount of carbon
                                stored in forests and soil. When protected or
                                enhanced, this stored carbon can generate{" "}
                                <strong>carbon credits</strong> that can be sold
                                in carbon markets.
                              </p>
                            </div>
                          </div>

                          <div className="mt-3 space-y-2 text-xs text-default-600">
                            <div className="flex items-start gap-2">
                              <span className="text-success font-bold mt-0.5">
                                •
                              </span>
                              <p>
                                <strong>Higher carbon stock</strong> = More
                                potential for carbon credits and revenue from
                                conservation
                              </p>
                            </div>
                            <div className="flex items-start gap-2">
                              <span className="text-warning font-bold mt-0.5">
                                •
                              </span>
                              <p>
                                <strong>Carbon price</strong> varies by market
                                demand, policy frameworks, and certification
                                standards
                              </p>
                            </div>
                            <div className="flex items-start gap-2">
                              <span className="text-primary font-bold mt-0.5">
                                •
                              </span>
                              <p>
                                <strong>Conversion factor</strong> (
                                {selectedFeature.conversion_factor_C_to_CO2}×)
                                converts carbon (C) to CO₂ equivalent for
                                trading
                              </p>
                            </div>
                          </div>

                          {(() => {
                            const currentYearValue =
                              carbonDataLookup[selectedFeature.KAB_KOTA]
                                .carbonStock[year];
                            const previousYearValue =
                              carbonDataLookup[selectedFeature.KAB_KOTA]
                                .carbonStock[year - 1];

                            if (currentYearValue && previousYearValue) {
                              const change =
                                currentYearValue - previousYearValue;
                              const isPositive = change > 0;
                              const valueChange =
                                change *
                                selectedFeature.conversion_factor_C_to_CO2 *
                                selectedFeature.carbon_price_usd_per_tonne;

                              return (
                                <div
                                  className={`mt-3 p-2 rounded-md ${
                                    isPositive
                                      ? "bg-success/10"
                                      : "bg-danger/10"
                                  }`}
                                >
                                  <p className="text-xs text-foreground">
                                    <strong
                                      className={
                                        isPositive
                                          ? "text-success"
                                          : "text-danger"
                                      }
                                    >
                                      {isPositive
                                        ? "📈 Positive trend:"
                                        : "📉 Declining trend:"}
                                    </strong>{" "}
                                    Carbon stock{" "}
                                    {isPositive ? "increased" : "decreased"} by{" "}
                                    {Math.abs(change).toFixed(2)} tC/ha,
                                    {isPositive ? " adding" : " reducing"}{" "}
                                    potential value by $
                                    {Math.abs(valueChange).toFixed(2)}/ha.
                                  </p>
                                </div>
                              );
                            }
                            return null;
                          })()}
                        </div>
                      )}
                  </div>
                )}

              {/* Fallback if no data available */}
              {(!carbonDataLookup ||
                !selectedFeature.KAB_KOTA ||
                !carbonDataLookup[selectedFeature.KAB_KOTA]) && (
                <div className="mt-6 p-4 rounded-lg bg-warning/10 border border-warning/20">
                  <p className="text-sm text-warning">
                    No carbon stock data available for this region.
                  </p>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
