---
title: "Global Supply Chain Network"
date: 2026-02-07
description: "Interactive visualization of our global commerce supply chain ecosystem."
layout: "single"
---

<div class="container-fluid px-0">
  <div class="card border-0 shadow-sm">
    <div class="card-header bg-light d-flex justify-content-between align-items-center">
      <h5 class="mb-0"><i class="bi bi-diagram-3 me-2"></i>Supply Chain Network</h5>
      <div class="btn-group btn-group-sm">
        <button id="zoom-in" class="btn btn-outline-secondary" title="Zoom In"><i class="bi bi-zoom-in"></i></button>
        <button id="zoom-out" class="btn btn-outline-secondary" title="Zoom Out"><i class="bi bi-zoom-out"></i></button>
        <button id="reset-zoom" class="btn btn-outline-secondary" title="Reset View"><i class="bi bi-arrows-fullscreen"></i></button>
      </div>
    </div>
    <div class="card-body p-0 overflow-hidden position-relative" style="height: 80vh; background-color: #f8f9fa;">
      <div id="svg-container" class="w-100 h-100 d-flex align-items-center justify-content-center">
        <!-- SVG will be injected here -->
        <object id="supply-chain-svg" type="image/svg+xml" data="/images/diagrams/main.svg" class="w-100 h-100"></object>
      </div>
    </div>
    <div class="card-footer text-muted small">
      <i class="bi bi-info-circle me-1"></i> Use mouse wheel to zoom, drag to pan. Highlighted nodes indicate products currently available in our catalog.
    </div>
  </div>
</div>

<script src="https://cdn.jsdelivr.net/npm/svg-pan-zoom@3.6.1/dist/svg-pan-zoom.min.js"></script>
<script>
  window.addEventListener('load', function() {
    const svgObject = document.getElementById('supply-chain-svg');
    
    svgObject.addEventListener('load', function() {
      // Access the inner document of the SVG
      const svgDoc = svgObject.contentDocument;
      const svgElement = svgDoc.documentElement;
      
      // Initialize pan-zoom directly on the SVG element
      svgPanZoom(svgObject, {
        zoomEnabled: true,
        controlIconsEnabled: false,
        fit: true,
        center: true,
        minZoom: 0.5,
        maxZoom: 10
      });
      
      // Connect custom buttons
      const panZoom = svgPanZoom(svgObject);
      
      document.getElementById('zoom-in').addEventListener('click', function(){
        panZoom.zoomIn();
      });
      
      document.getElementById('zoom-out').addEventListener('click', function(){
        panZoom.zoomOut();
      });
      
      document.getElementById('reset-zoom').addEventListener('click', function(){
        panZoom.resetZoom();
        panZoom.center();
      });
    });
  });
</script>
