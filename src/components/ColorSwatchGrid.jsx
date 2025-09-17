import React from "react";
import "./ColorSwatchGrid.css";


/**
* ColorSwatchGrid
* Props:
* - colors: Array<{ id: string; name: string; image: string; driveUrl: string }>
*/
export default function ColorSwatchGrid({ colors = [] }) {
function openDrive(url) {
// Open in a new, secure tab
window.open(url, "_blank", "noopener,noreferrer");
}


return (
<div className="swatch-wrapper">
<header className="swatch-header">
<h1 className="brand">APlus Color Selection</h1>
<p className="subtitle">Tap a color to view the example</p>
</header>


<ul className="swatch-grid" role="list">
{colors.map((c) => (
<li key={c.id} className="swatch-item">
<button
type="button"
className="swatch"
onClick={() => openDrive(c.driveUrl)}
aria-label={`Open ${c.name} in Google Drive`}
>
<img
src={c.image}
alt={c.name}
loading="lazy"
width={120}
height={120}
/>
</button>
<div className="swatch-name" title={c.name}>{c.name}</div>
</li>
))}
</ul>
</div>
);
}