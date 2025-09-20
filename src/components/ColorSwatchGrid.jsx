import { useEffect, useMemo, useState } from "react";
import "./ColorSwatchGrid.css";


/**
 * Convert common Google Drive/Docs links into an embeddable preview URL.
 * Works for:
 *  - drive.google.com/file/d/<ID>/view...
 *  - drive.google.com/open?id=<ID>   or  .../uc?id=<ID>
 *  - docs.google.com/document|spreadsheets|presentation/d/<ID>/...
 */


function getDrivePreviewUrl(url = "") {
  try {
    const u = new URL(url);
    const host = u.hostname;
    const parts = u.pathname.split("/").filter(Boolean); /* e.g. ["file", "d", "<ID>", "view"] */

    /* Google Drive "file" URLs: /file/d/<ID>/... */
    if (host.includes("drive.google.com")) {
      if (parts[0] === "file" && parts[1] === "d" && parts[2]) {
        const id = parts[2];
        return `https://drive.google.com/file/d/${id}/preview`;
      }
      /* Open/uc URLs with ?id=<ID> */
      const id = u.searchParams.get("id");
      if (id) {
        return `https://drive.google.com/file/d/${id}/preview`;
      }
    }

    /* Google Docs/Sheets/Slides: /<type>/d/<ID>/... */
    if (host.includes("docs.google.com")) {
      const type = parts[0]; /* document | spreadsheets | presentation */
      if (
        ["document", "spreadsheets", "presentation"].includes(type) &&
        parts[1] === "d" &&
        parts[2]
      ) {
        const id = parts[2];
        return `https://docs.google.com/${type}/d/${id}/preview`;
      }
    }
  } catch (_) {
  /* ignore */
  }
  /* Fallback */
  return url;
}


export default function ColorSwatchGrid({ colors = [] }) {
  const [active, setActive] = useState(null); /* { name, driveUrl, previewUrl } */

  function openModal(color) {
    setActive({
      ...color,
      previewUrl: getDrivePreviewUrl(color.driveUrl),
    });
  }
  function closeModal() {
    setActive(null);
  }

  /* ESC to close + lock background scroll */
  useEffect(() => {
    function onKey(e) { if (e.key === "Escape") closeModal(); }
    if (active) {
      document.addEventListener("keydown", onKey);
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [active]);

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
              onClick={() => openModal(c)}
              aria-label={`Open ${c.name} preview`}
            >
              <img src={c.image} alt={c.name} loading="lazy" width={120} height={120} />
            </button>
            <div className="swatch-name" title={c.name}>{c.name}</div>
          </li>
        ))}
      </ul>


      {/********************************************************* Modal *********************************************************/}


      {active && (
        <div
          className="gd-modal-overlay"
          role="dialog"
          aria-modal="true"
          aria-label={`${active.name} preview`}
          onClick={closeModal}
        >
          <div className="gd-modal" onClick={(e) => e.stopPropagation()}>
            <div className="gd-modal-header">
              <span className="gd-modal-title">{active.name}</span>
              <button className="gd-modal-close" onClick={closeModal} aria-label="Close">×</button>
            </div>
            <div className="gd-modal-body">
              <iframe
                title={`${active.name} preview`}
                src={active.previewUrl}
                allow="autoplay"
                allowFullScreen
                loading="lazy"
              />
            </div>
            <div className="gd-modal-footer">



                {/********************************************* Not all links are Drive links right now *********************************************/}



              {/* <a className="gd-open-drive" href={active.driveUrl} target="_blank" rel="noopener noreferrer">
                Open in Google Drive ↗
              </a> */}



            </div>
          </div>
        </div>
      )}
    </div>
  );
}
