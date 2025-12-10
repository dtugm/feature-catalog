"use client";

import { Card, CardBody, CardHeader, Button } from "@heroui/react";
import {
  BookOpen,
  Leaf,
  DollarSign,
  AlertTriangle,
  Users,
  ArrowLeft,
} from "lucide-react";
import Link from "next/link";

export default function MethodologyPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-default-50">
      <div className="container mx-auto px-4 py-8 max-w-5xl">
        {/* Back Button */}
        <div className="mb-6">
          <Link href="/features/carbon-stock">
            <Button
              variant="light"
              startContent={<ArrowLeft size={18} />}
              className="font-semibold"
            >
              Back to Carbon Stock Analysis
            </Button>
          </Link>
        </div>

        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <BookOpen className="text-primary" size={32} />
            <h1 className="text-3xl md:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary">
              Methodology
            </h1>
          </div>
          <p className="text-default-600 text-lg">
            Carbon Stock Estimation and Economic Valuation Framework
          </p>

          {/* Authors */}
          <div className="mt-4 p-4 bg-primary/5 border border-primary/20 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <Users size={18} className="text-primary" />
              <p className="font-semibold text-sm">Authors:</p>
            </div>
            <div className="text-sm text-default-600 space-y-1">
              <p>1. Fairuz Akmal Pradana (Methodology)</p>
              <p>2. Aulia Nur Fajriyah (Visualization)</p>
            </div>
          </div>
        </div>

        {/* Section 1: Carbon Stock Estimation */}
        <Card className="mb-6 bg-background/80 backdrop-blur-xl border border-default-200/50">
          <CardHeader className="flex gap-3 items-center pb-3">
            <Leaf className="text-success" size={24} />
            <div>
              <h2 className="text-2xl font-bold">
                1. Forest Carbon Stock Estimation
              </h2>
            </div>
          </CardHeader>
          <CardBody className="space-y-6">
            {/* 1.1 IPCC Framework */}
            <div>
              <h3 className="text-xl font-semibold mb-3 text-primary">
                1.1 IPCC Framework
              </h3>
              <p className="text-default-700 mb-3">
                This research adopts the four carbon pools approach according to
                the 2019 Refinement to the 2006 IPCC Guidelines for National
                Greenhouse Gas Inventories (IPCC, 2019). Total forest carbon
                stock is calculated using the formula:
              </p>
              <div className="bg-default-100 p-4 rounded-lg font-mono text-sm mb-3">
                C<sub>total</sub> = C<sub>above</sub> + C<sub>below</sub> + C
                <sub>soil</sub> + C<sub>dead</sub>
              </div>
              <div className="text-sm text-default-600 space-y-1 ml-4">
                <p>
                  • C<sub>above</sub> = above-ground biomass carbon (Mg C/ha)
                </p>
                <p>
                  • C<sub>below</sub> = below-ground biomass/root carbon (Mg
                  C/ha)
                </p>
                <p>
                  • C<sub>soil</sub> = soil organic carbon 0-30 cm (Mg C/ha)
                </p>
                <p>
                  • C<sub>dead</sub> = dead organic matter/litter carbon (Mg
                  C/ha)
                </p>
              </div>
            </div>

            {/* 1.2 Remote Sensing Integration */}
            <div>
              <h3 className="text-xl font-semibold mb-3 text-primary">
                1.2 Remote Sensing and Deep Learning Integration
              </h3>

              {/* A. U-Net */}
              <div className="mb-4">
                <h4 className="font-semibold text-secondary mb-2">
                  A. Land Cover Detection with U-Net AI Model
                </h4>
                <p className="text-default-700 text-sm mb-2">
                  Land cover classification is performed using Deep Learning
                  with U-Net architecture (Ronneberger et al., 2015). U-Net was
                  chosen for its excellence in semantic segmentation, capable of
                  maintaining spatial location information while capturing
                  feature context through contracting (encoder) and expanding
                  (decoder) pathways.
                </p>
                <p className="text-default-700 text-sm">
                  The model is trained using Sentinel-2 multispectral imagery to
                  separate land cover classes (Forest, Non-Forest, Shrubland,
                  etc.). U-Net segmentation results are used as the spatial
                  basis for determining soil carbon (C<sub>soil</sub>) and dead
                  organic matter (C<sub>dead</sub>) parameters according to land
                  cover type.
                </p>
              </div>

              {/* B. NDVI */}
              <div className="mb-4">
                <h4 className="font-semibold text-secondary mb-2">
                  B. Biomass Estimation from NDVI (Sentinel-2)
                </h4>
                <p className="text-default-700 text-sm mb-2">
                  Normalized Difference Vegetation Index (NDVI) is calculated
                  from Sentinel-2 Surface Reflectance using the standard formula
                  (Tucker, 1979):
                </p>
                <div className="bg-default-100 p-3 rounded-lg font-mono text-xs mb-2">
                  NDVI = (ρ<sub>NIR</sub> - ρ<sub>Red</sub>) / (ρ<sub>NIR</sub>{" "}
                  + ρ<sub>Red</sub>)
                </div>
                <p className="text-default-700 text-sm mb-2">
                  Above-ground biomass (AGB) is estimated using an exponential
                  model calibrated for Sumatran Dipterocarp forests (Basuki et
                  al., 2009):
                </p>
                <div className="bg-default-100 p-3 rounded-lg font-mono text-xs">
                  AGB<sub>Sentinel</sub> = exp(2.13 + 2.55 × NDVI)
                  <br />
                  <span className="text-default-500">
                    R² = 0.72, RMSE = 45.3 Mg/ha
                  </span>
                </div>
              </div>

              {/* C. WHRC Integration */}
              <div className="mb-4">
                <h4 className="font-semibold text-secondary mb-2">
                  C. Integration with WHRC Reference Data
                </h4>
                <p className="text-default-700 text-sm mb-2">
                  To reduce uncertainty, Sentinel-2 estimates are combined with
                  the Woods Hole Research Center (WHRC) pantropical biomass
                  dataset at 500m resolution (Baccini et al., 2012) using
                  weighted averaging:
                </p>
                <div className="bg-default-100 p-3 rounded-lg font-mono text-xs">
                  AGB<sub>combined</sub> = 0.5 × AGB<sub>Sentinel</sub> + 0.5 ×
                  AGB<sub>WHRC</sub>
                </div>
              </div>

              {/* D. Conversion */}
              <div>
                <h4 className="font-semibold text-secondary mb-2">
                  D. Biomass to Carbon Conversion and Other Pool Estimation
                </h4>
                <p className="text-default-700 text-sm mb-2">
                  Biomass is converted to carbon using a carbon fraction of 0.47
                  (IPCC, 2019):
                </p>
                <div className="bg-default-100 p-3 rounded-lg font-mono text-xs mb-3">
                  C<sub>above</sub> = AGB<sub>combined</sub> × 0.47
                </div>
                <p className="text-default-700 text-sm mb-2">
                  Below-ground biomass carbon is estimated using a root-to-shoot
                  ratio of 0.25 for tropical forests (IPCC, 2019, Table 4.4):
                </p>
                <div className="bg-default-100 p-3 rounded-lg font-mono text-xs mb-3">
                  C<sub>below</sub> = C<sub>above</sub> × 0.25
                </div>
                <p className="text-default-700 text-sm">
                  Soil carbon (C<sub>soil</sub>) and dead organic matter (C
                  <sub>dead</sub>) are obtained from IPCC 2019 Refinement carbon
                  density tables for Tropical Asia region (IPCC, 2019, Tables
                  4.7, 4.9, 4.12) mapped based on U-Net land cover
                  classification.
                </p>
              </div>
            </div>

            {/* Table */}
            <div>
              <h4 className="font-semibold mb-3">
                Table 1. Carbon Density per Land Cover Class (IPCC, 2019)
              </h4>
              <div className="overflow-x-auto">
                <table className="w-full text-sm border-collapse">
                  <thead>
                    <tr className="bg-primary/10">
                      <th className="border border-divider p-2 text-left">
                        Land Cover Class
                      </th>
                      <th className="border border-divider p-2 text-center">
                        C<sub>above</sub>
                      </th>
                      <th className="border border-divider p-2 text-center">
                        C<sub>below</sub>
                      </th>
                      <th className="border border-divider p-2 text-center">
                        C<sub>soil</sub>
                      </th>
                      <th className="border border-divider p-2 text-center">
                        C<sub>dead</sub>
                      </th>
                      <th className="border border-divider p-2 text-center">
                        Total
                      </th>
                    </tr>
                  </thead>
                  <tbody className="text-default-700">
                    <tr>
                      <td className="border border-divider p-2">
                        Forest (Tree Cover)
                      </td>
                      <td className="border border-divider p-2 text-center">
                        180
                      </td>
                      <td className="border border-divider p-2 text-center">
                        45
                      </td>
                      <td className="border border-divider p-2 text-center">
                        90
                      </td>
                      <td className="border border-divider p-2 text-center">
                        15
                      </td>
                      <td className="border border-divider p-2 text-center font-semibold">
                        330
                      </td>
                    </tr>
                    <tr className="bg-default-50">
                      <td className="border border-divider p-2">Shrubland</td>
                      <td className="border border-divider p-2 text-center">
                        40
                      </td>
                      <td className="border border-divider p-2 text-center">
                        10
                      </td>
                      <td className="border border-divider p-2 text-center">
                        75
                      </td>
                      <td className="border border-divider p-2 text-center">
                        5
                      </td>
                      <td className="border border-divider p-2 text-center font-semibold">
                        130
                      </td>
                    </tr>
                    <tr>
                      <td className="border border-divider p-2">Grassland</td>
                      <td className="border border-divider p-2 text-center">
                        15
                      </td>
                      <td className="border border-divider p-2 text-center">
                        7.5
                      </td>
                      <td className="border border-divider p-2 text-center">
                        80
                      </td>
                      <td className="border border-divider p-2 text-center">
                        2.5
                      </td>
                      <td className="border border-divider p-2 text-center font-semibold">
                        105
                      </td>
                    </tr>
                    <tr className="bg-default-50">
                      <td className="border border-divider p-2">
                        Agricultural Land
                      </td>
                      <td className="border border-divider p-2 text-center">
                        5
                      </td>
                      <td className="border border-divider p-2 text-center">
                        2.5
                      </td>
                      <td className="border border-divider p-2 text-center">
                        65
                      </td>
                      <td className="border border-divider p-2 text-center">
                        0
                      </td>
                      <td className="border border-divider p-2 text-center font-semibold">
                        72.5
                      </td>
                    </tr>
                    <tr>
                      <td className="border border-divider p-2">Mangrove</td>
                      <td className="border border-divider p-2 text-center">
                        150
                      </td>
                      <td className="border border-divider p-2 text-center">
                        37.5
                      </td>
                      <td className="border border-divider p-2 text-center">
                        100
                      </td>
                      <td className="border border-divider p-2 text-center">
                        12.5
                      </td>
                      <td className="border border-divider p-2 text-center font-semibold">
                        300
                      </td>
                    </tr>
                    <tr className="bg-default-50">
                      <td className="border border-divider p-2">Wetland</td>
                      <td className="border border-divider p-2 text-center">
                        30
                      </td>
                      <td className="border border-divider p-2 text-center">
                        15
                      </td>
                      <td className="border border-divider p-2 text-center">
                        100
                      </td>
                      <td className="border border-divider p-2 text-center">
                        10
                      </td>
                      <td className="border border-divider p-2 text-center font-semibold">
                        155
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <p className="text-xs text-default-500 mt-2 italic">
                Note: All values in Mg C/ha (megagram carbon per hectare)
              </p>
            </div>

            {/* 1.3 Data and Analysis Period */}
            <div>
              <h3 className="text-xl font-semibold mb-3 text-primary">
                1.3 Data and Analysis Period
              </h3>
              <p className="text-default-700 text-sm mb-3">
                Temporal analysis is conducted for the period 2020-2025 using:
              </p>
              <ul className="text-sm text-default-700 space-y-2 ml-4">
                <li>
                  • <strong>Land Cover:</strong> Generated from U-Net model
                  using training data referenced from ESA WorldCover v100/v200
                  (Zanaga et al., 2021) and Google Dynamic World (Brown et al.,
                  2022)
                </li>
                <li>
                  • <strong>Biomass:</strong> Sentinel-2 SR Harmonized (10m
                  resolution, cloud cover &lt;20%) and WHRC Pantropical Biomass
                  (500m resolution) (Baccini et al., 2012)
                </li>
              </ul>
              <p className="text-default-700 text-sm mt-3">
                Area of Interest (AOI) covers Aceh, North Sumatra, and West
                Sumatra provinces with a total area of ~173,000 km². Analysis is
                performed using Google Earth Engine platform for cloud-based
                computation (Gorelick et al., 2017).
              </p>
            </div>
          </CardBody>
        </Card>

        {/* Section 2: Economic Valuation */}
        <Card className="mb-6 bg-background/80 backdrop-blur-xl border border-default-200/50">
          <CardHeader className="flex gap-3 items-center pb-3">
            <DollarSign className="text-warning" size={24} />
            <div>
              <h2 className="text-2xl font-bold">
                2. Carbon Economic Valuation
              </h2>
            </div>
          </CardHeader>
          <CardBody className="space-y-6">
            {/* 2.1 CO2 Conversion */}
            <div>
              <h3 className="text-xl font-semibold mb-3 text-primary">
                2.1 Carbon to CO₂ Equivalent Conversion
              </h3>
              <p className="text-default-700 text-sm mb-3">
                Carbon stock is converted to CO₂ equivalent using the standard
                IPCC stoichiometric conversion factor (IPCC, 2006, Volume 1,
                Chapter 3):
              </p>
              <div className="bg-default-100 p-4 rounded-lg font-mono text-sm mb-3">
                CO₂e = C<sub>stock</sub> × 3.67
              </div>
              <p className="text-default-700 text-sm">
                The factor 3.67 is derived from the molecular mass ratio of CO₂
                (44 g/mol) to atomic mass of C (12 g/mol). This conversion is
                necessary because carbon trading mechanisms and UNFCCC reporting
                use CO₂ equivalent units, not elemental carbon (UNFCCC, 2015).
              </p>
            </div>

            {/* 2.2 Economic Value Calculation */}
            <div>
              <h3 className="text-xl font-semibold mb-3 text-primary">
                2.2 Economic Value Calculation
              </h3>
              <p className="text-default-700 text-sm mb-3">
                Economic value of carbon per hectare is calculated using the
                formula:
              </p>
              <div className="bg-default-100 p-4 rounded-lg font-mono text-sm mb-3">
                USD<sub>ha</sub> = CO₂e × P<sub>carbon</sub>
              </div>
              <p className="text-default-700 text-sm mb-3">
                Where P<sub>carbon</sub> is the carbon price in USD per tonne
                CO₂e. This research uses four price scenarios based on global
                carbon market conditions (World Bank, 2023):
              </p>

              {/* Price Scenarios Table */}
              <div className="overflow-x-auto mb-4">
                <table className="w-full text-sm border-collapse">
                  <thead>
                    <tr className="bg-warning/10">
                      <th className="border border-divider p-2 text-left">
                        Scenario
                      </th>
                      <th className="border border-divider p-2 text-center">
                        Price (USD/tonne CO₂e)
                      </th>
                      <th className="border border-divider p-2 text-left">
                        Basis
                      </th>
                    </tr>
                  </thead>
                  <tbody className="text-default-700">
                    <tr>
                      <td className="border border-divider p-2 font-semibold">
                        Conservative
                      </td>
                      <td className="border border-divider p-2 text-center">
                        6.34
                      </td>
                      <td className="border border-divider p-2">
                        Average REDD+ projects Asia-Pacific 2020-2022
                      </td>
                    </tr>
                    <tr className="bg-default-50">
                      <td className="border border-divider p-2 font-semibold">
                        Moderate
                      </td>
                      <td className="border border-divider p-2 text-center">
                        15.00
                      </td>
                      <td className="border border-divider p-2">
                        Global voluntary carbon market median 2023
                      </td>
                    </tr>
                    <tr>
                      <td className="border border-divider p-2 font-semibold">
                        High
                      </td>
                      <td className="border border-divider p-2 text-center">
                        27.00
                      </td>
                      <td className="border border-divider p-2">
                        Projects with high co-benefits
                      </td>
                    </tr>
                    <tr className="bg-default-50">
                      <td className="border border-divider p-2 font-semibold">
                        Compliance
                      </td>
                      <td className="border border-divider p-2 text-center">
                        50.00
                      </td>
                      <td className="border border-divider p-2">
                        Average compliance market (EU ETS)
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <p className="text-default-700 text-sm">
                The conservative scenario (USD 6.34) is chosen as baseline as it
                is representative for Indonesian REDD+ projects and consistent
                with historical prices of the Indonesia-Norway REDD+ program
                (Government of Indonesia, 2020; Ecosystem Marketplace, 2023).
              </p>
            </div>

            {/* 2.3 Temporal Change Analysis */}
            <div>
              <h3 className="text-xl font-semibold mb-3 text-primary">
                2.3 Temporal Change and Regional Total Analysis
              </h3>
              <p className="text-default-700 text-sm mb-2">
                Carbon emission/sequestration change (2020-2025):
              </p>
              <div className="bg-default-100 p-3 rounded-lg font-mono text-xs mb-3">
                ΔCO₂e = CO₂e<sub>2025</sub> - CO₂e<sub>2020</sub>
              </div>
              <p className="text-default-700 text-sm mb-3">
                Negative values indicate emissions (deforestation/degradation),
                positive values indicate sequestration (reforestation/forest
                growth).
              </p>
              <p className="text-default-700 text-sm mb-2">
                Economic value change:
              </p>
              <div className="bg-default-100 p-3 rounded-lg font-mono text-xs mb-3">
                ΔUSD = ΔCO₂e × P<sub>carbon</sub>
              </div>
              <p className="text-default-700 text-sm mb-2">
                Total regional economic value:
              </p>
              <div className="bg-default-100 p-3 rounded-lg font-mono text-xs">
                USD<sub>total</sub> = Σ(CO₂e<sub>i</sub> × A<sub>i</sub>) × P
                <sub>carbon</sub>
              </div>
              <p className="text-default-700 text-sm mt-2">
                Where A<sub>i</sub> is the area of pixel i in hectares (0.09 ha
                for 30m resolution).
              </p>
            </div>

            {/* 2.4 Computational Implementation */}
            <div>
              <h3 className="text-xl font-semibold mb-3 text-primary">
                2.4 Computational Implementation
              </h3>
              <p className="text-default-700 text-sm mb-3">
                The valuation algorithm is implemented in Python with GeoJSON
                input data extracted from Google Earth Engine. For each
                feature/pixel:
              </p>
              <ol className="text-sm text-default-700 space-y-2 ml-4">
                <li>
                  1. <strong>Conversion:</strong> CO₂e = C<sub>stock</sub> ×
                  3.67 for each year (2020-2025)
                </li>
                <li>
                  2. <strong>Valuation:</strong> USD<sub>ha</sub> = CO₂e × P
                  <sub>carbon</sub> according to scenario
                </li>
                <li>
                  3. <strong>Temporal change:</strong> ΔCO₂e and ΔUSD for period
                  2020-2025
                </li>
                <li>
                  4. <strong>Aggregation:</strong> Total regional CO₂e and USD,
                  average per hectare
                </li>
              </ol>
              <p className="text-default-700 text-sm mt-3">
                Output includes additional properties: {"{year}"}_CO2e,{" "}
                {"{year}"}_USD_per_ha, CO2e_change_2020_2025,
                USD_change_2020_2025, and metadata (carbon price, conversion
                factor, calculation date, price scenario).
              </p>
            </div>
          </CardBody>
        </Card>

        {/* Section 3: Uncertainty and Applications */}
        <Card className="mb-6 bg-background/80 backdrop-blur-xl border border-default-200/50">
          <CardHeader className="flex gap-3 items-center pb-3">
            <AlertTriangle className="text-danger" size={24} />
            <div>
              <h2 className="text-2xl font-bold">
                2.5 Uncertainty and Applications
              </h2>
            </div>
          </CardHeader>
          <CardBody className="space-y-6">
            {/* Uncertainty Sources */}
            <div>
              <h3 className="text-xl font-semibold mb-3 text-primary">
                Sources of Uncertainty
              </h3>
              <ul className="text-sm text-default-700 space-y-2 ml-4">
                <li>
                  • <strong>Carbon stock estimation:</strong> ±25-35% (U-Net
                  classification error, NDVI model, spatial variability)
                  (Mitchard et al., 2013)
                </li>
                <li>
                  • <strong>Carbon price:</strong> ±50-100% (market volatility,
                  project type differences) (Ecosystem Marketplace, 2023)
                </li>
                <li>
                  • <strong>Total uncertainty:</strong> ±60-110%
                </li>
              </ul>
            </div>

            {/* Applications */}
            <div>
              <h3 className="text-xl font-semibold mb-3 text-primary">
                Valuation Applications
              </h3>
              <ol className="text-sm text-default-700 space-y-2 ml-4">
                <li>
                  1. Baseline for REDD+ projects according to UNFCCC framework
                  (UNFCCC, 2015)
                </li>
                <li>
                  2. Contribution to Indonesia&apos;s Nationally Determined
                  Contributions (NDC) targeting 29-41% emission reduction by
                  2030 (Republic of Indonesia, 2016)
                </li>
                <li>
                  3. Identification of priority conservation areas based on high
                  carbon value
                </li>
                <li>
                  4. Cost-benefit analysis of conservation vs. land conversion
                </li>
                <li>
                  5. Communication of ecosystem service economic value to
                  stakeholders
                </li>
              </ol>
              <div className="mt-4 p-4 bg-warning/10 border border-warning/30 rounded-lg">
                <p className="text-sm text-default-700">
                  <strong>Note:</strong> This valuation is suitable for initial
                  screening and strategic planning, but requires field
                  verification for actual carbon credit transactions according
                  to Verified Carbon Standard (Verra, 2023).
                </p>
              </div>
            </div>
          </CardBody>
        </Card>

        {/* References */}
        <Card className="bg-background/80 backdrop-blur-xl border border-default-200/50">
          <CardHeader>
            <h2 className="text-2xl font-bold">References</h2>
          </CardHeader>
          <CardBody>
            <div className="text-xs text-default-600 space-y-2">
              <p>
                Baccini, A., et al. (2012). Estimated carbon dioxide emissions
                from tropical deforestation improved by carbon-density maps.{" "}
                <em>Nature Climate Change, 2</em>(3), 182-185.
              </p>
              <p>
                Basuki, T. M., et al. (2009). Allometric equations for
                estimating the above-ground biomass in tropical lowland
                Dipterocarp forests. <em>Forest Ecology and Management, 257</em>
                (8), 1684-1694.
              </p>
              <p>
                Brown, C. F., et al. (2022). Dynamic World, near real-time
                global 10 m land use land cover mapping.{" "}
                <em>Scientific Data, 9</em>(1), 251.
              </p>
              <p>
                Ecosystem Marketplace. (2023).{" "}
                <em>State of the voluntary carbon markets 2023</em>. Forest
                Trends.
              </p>
              <p>
                Gorelick, N., et al. (2017). Google Earth Engine:
                Planetary-scale geospatial analysis for everyone.{" "}
                <em>Remote Sensing of Environment, 202</em>, 18-27.
              </p>
              <p>
                Government of Indonesia. (2020).{" "}
                <em>
                  Indonesia&apos;s REDD+ results and the Norway partnership
                </em>
                . Ministry of Environment and Forestry.
              </p>
              <p>
                IPCC. (2006).{" "}
                <em>
                  2006 IPCC Guidelines for National Greenhouse Gas Inventories,
                  Volume 4: Agriculture, Forestry and Other Land Use
                </em>
                .
              </p>
              <p>
                IPCC. (2019).{" "}
                <em>
                  2019 Refinement to the 2006 IPCC Guidelines for National
                  Greenhouse Gas Inventories, Volume 4: Agriculture, Forestry
                  and Other Land Use
                </em>
                .
              </p>
              <p>
                Mitchard, E. T., et al. (2013). Uncertainty in the spatial
                distribution of tropical forest biomass: A comparison of
                pan-tropical maps. <em>Carbon Balance and Management, 8</em>(1),
                10.
              </p>
              <p>
                Republik Indonesia. (2016).{" "}
                <em>
                  First nationally determined contribution Republic of Indonesia
                </em>
                . Submitted to UNFCCC.
              </p>
              <p>
                Ronneberger, O., Fischer, P., & Brox, T. (2015). U-Net:
                Convolutional Networks for Biomedical Image Segmentation.{" "}
                <em>
                  Medical Image Computing and Computer-Assisted Intervention
                  (MICCAI), 9351
                </em>
                , 234–241.
              </p>
              <p>
                Tucker, C. J. (1979). Red and photographic infrared linear
                combinations for monitoring vegetation.{" "}
                <em>Remote Sensing of Environment, 8</em>(2), 127-150.
              </p>
              <p>
                UNFCCC. (2015). <em>Adoption of the Paris Agreement</em>. UNFCCC
                Decision 1/CP.21.
              </p>
              <p>
                Verra. (2023). <em>VCS Standard, Version 4.5</em>. Verified
                Carbon Standard.
              </p>
              <p>
                World Bank. (2023).{" "}
                <em>State and trends of carbon pricing 2023</em>. World Bank
                Group.
              </p>
              <p>
                Zanaga, D., et al. (2021).{" "}
                <em>ESA WorldCover 10 m 2020 v100</em>. European Space Agency.
              </p>
            </div>
          </CardBody>
        </Card>
      </div>
    </div>
  );
}
