---
title: "Global Supply Chain Network"
date: 2026-02-07
description: "Interactive visualization of our global commerce supply chain ecosystem."
layout: "single"
---

## Overview

Our integrated supply chain spans three primary value chains, converging at global distribution networks to serve diverse industrial and commercial markets worldwide.

### Complete Supply Chain Network

```mermaid
graph TD
    subgraph mining["⛏️ MINING & EXTRACTION"]
        A["🌍 Copper Ore"] -->|Flotation| B["Copper Concentrate"]
        C["🏜️ Salt Brine"] -->|Crystallization| D["Industrial Salt"]
    end
    
    subgraph petroleum["⛽ OIL & PETROCHEMICALS"]
        E["⛽ Brent Crude Oil"] -->|Distillation| F["Premium Diesel"]
        E -->|Distillation| G["Marine Fuel Oil"]
        E -->|Distillation| H["Petroleum Naphtha"]
        E -->|Distillation| I["Refined Bitumen"]
        E -->|Distillation| J["White Spirit"]
        E -->|Desulfurization| K["Refined Sulfur"]
        H -->|Cracking| L["Polybutadiene Rubber"]
    end
    
    subgraph construction["🏢 CONSTRUCTION MATERIALS"]
        M["🏔️ Gypsum"] -->|Manufacturing| N["Standard Wallboard"]
        M -->|Manufacturing| O["Fire-Resistant Board"]
        M -->|Manufacturing| P["Moisture-Resistant Board"]
        Q["🪨 Clay"] -->|Firing| R["Porcelain Tiles"]
        Q -->|Firing| S["Decorative Tiles"]
        Q -->|Firing| T["Floor Tiles"]
    end
    
    subgraph logistics["📦 GLOBAL LOGISTICS & DISTRIBUTION"]
        U["Distribution Centers"]
        V["Global Transport"]
        W["End Markets"]
        U --> V --> W
    end
    
    B --> U
    D --> U
    F --> U
    G --> U
    K --> U
    L --> U
    N --> U
    O --> U
    P --> U
    R --> U
    S --> U
    T --> U
    
    style mining fill:#e8f5e9
    style petroleum fill:#fff3e0
    style construction fill:#f3e5f5
    style logistics fill:#e3f2fd
```

---

## Mining & Extraction Supply Chain

```mermaid
graph TD
    A["🌍 Copper Ore Extraction"] -->|Raw Material| B["⚙️ Flotation Processing"]
    B -->|Concentration| C["Copper Concentrate"]
    C -->|High-purity product| D["Industrial Applications:<br/>Electronics, Construction,<br/>Power Generation"]
    
    E["🏜️ Salt Extraction<br/>Solar Pans & Brine"] -->|Raw Material| F["🔄 Crystallization &<br/>Refinement"]
    F -->|Purification| G["Industrial Salt"]
    G -->|De-icing, Chemical,<br/>Food Processing| H["Industrial Applications:<br/>Chemical Manufacturing,<br/>Agriculture, Food Industry"]
    
    style C fill:#ff9999
    style G fill:#99ccff
    style D fill:#ffe6e6
    style H fill:#e6f2ff
```

---

## Oil & Petrochemicals Supply Chain

```mermaid
graph TD
    A["⛽ Offshore Oil Extraction<br/>Brent Crude"] -->|Raw Material| B["🔥 Distillation Unit<br/>Primary Refining"]
    
    B -->|Fractions| C["Petroleum Naphtha<br/>Petrochemical Feedstock"]
    B -->|Refined| D["Premium Diesel<br/>Transportation Fuel"]
    B -->|Heavy Fraction| E["Marine Fuel Oil<br/>Bunker Fuel"]
    B -->|Residue| F["Refined Bitumen<br/>Road Construction"]
    B -->|Solvent Cut| G["White Spirit Solvent<br/>Industrial Cleaner"]
    
    H["🔬 Desulfurization Unit"] -->|Sulfur Extraction| I["Refined Sulfur<br/>Chemical Feedstock"]
    
    C -->|Cracking Unit| J["Polybutadiene Rubber<br/>Elastomer Product"]
    
    K["📦 Industrial Applications"]
    D --> K
    E --> K
    F --> K
    G --> K
    I --> K
    J --> K
    
    style C fill:#fff4e6
    style D fill:#ffcccc
    style E fill:#ffe6e6
    style F fill:#f0f0f0
    style G fill:#e6f3ff
    style I fill:#fffacd
    style J fill:#f0e6ff
```

---

## Construction Materials Supply Chain

```mermaid
graph TD
    A["🏔️ Gypsum Quarry<br/>Raw Gypsum Extraction"] -->|Raw Material| B["🏭 Gypsum Board Plant<br/>Manufacturing & Processing"]
    
    B -->|Standard Product| C["Standard Gypsum Wallboard<br/>Basic Interior Construction"]
    B -->|Fire-Rated| D["Fire-Resistant Gypsum Board<br/>Safety & Code Compliance"]
    B -->|Moisture-Resistant| E["Moisture-Resistant Gypsum Board<br/>Wet Areas & Humidity Control"]
    
    F["🪨 Clay Pit<br/>Raw Clay Extraction"] -->|Raw Material| G["🔥 Ceramic Kiln<br/>High-Temperature Firing"]
    
    G -->|Precision-Made| H["Premium Porcelain Tiles<br/>High-End Flooring"]
    G -->|Decorative| I["Decorative Wall Tiles<br/>Interior Design"]
    G -->|Durable| J["Unglazed Floor Tiles<br/>Commercial & Heavy-Use"]
    
    K["🏢 Construction & Interior Applications"]
    C --> K
    D --> K
    E --> K
    H --> K
    I --> K
    J --> K
    
    style C fill:#f5f5f5
    style D fill:#ffe6e6
    style E fill:#e6f3ff
    style H fill:#fff8e6
    style I fill:#f0e6ff
    style J fill:#e6ffe6
```
