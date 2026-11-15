'use client';

import React, { useRef, useState } from 'react';
import { QRCodeCanvas, QRCodeSVG } from 'qrcode.react';

export default function GeneradorQRBodaPage() {
  // ==========================================================================
  // 1. PARÁMETROS CONFIGURABLES (ENLACE CORTO DE TU PROYECTO EN VERCEL)
  // ==========================================================================
  const [urlGaleria, setUrlGaleria] = useState<string>('https://jw-solutions.vercel.app/dm');
  const [colorQR, setColorQR] = useState<string>('#4a443f'); // Café/carbón elegante
  const canvasRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<HTMLDivElement>(null);

  // ==========================================================================
  // 2. DESCARGAR COMO IMAGEN PNG (ALTA RESOLUCIÓN 1024x1024)
  // ==========================================================================
  const descargarPNG = () => {
    const canvas = canvasRef.current?.querySelector('canvas');
    if (!canvas) return;

    const urlImagen = canvas.toDataURL('image/png');
    const enlace = document.createElement('a');
    enlace.href = urlImagen;
    enlace.download = 'QR-Boda-Diego-y-Magali.png';
    enlace.click();
  };

  // ==========================================================================
  // 3. DESCARGAR COMO VECTOR SVG (PARA IMPRENTA / DISEÑO GRÁFICO)
  // ==========================================================================
  const descargarSVG = () => {
    const svg = svgRef.current?.querySelector('svg');
    if (!svg) return;

    const serializer = new XMLSerializer();
    const svgString = serializer.serializeToString(svg);
    const blob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' });
    const urlBlob = URL.createObjectURL(blob);

    const enlace = document.createElement('a');
    enlace.href = urlBlob;
    enlace.download = 'QR-Boda-Diego-y-Magali.svg';
    enlace.click();
    URL.revokeObjectURL(urlBlob);
  };

  return (
    <div className="min-h-screen bg-[#fbf9f5] text-[#4a443f] flex flex-col items-center justify-center p-4">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,600;1,400&family=Great+Vibes&family=Montserrat:wght@400;500;600&display=swap');
        .font-script { font-family: 'Great Vibes', cursive; }
        .font-editorial { font-family: 'Cormorant Garamond', Georgia, serif; }
        .font-body { font-family: 'Montserrat', sans-serif; }
      `}</style>

      <div className="max-w-md w-full bg-white p-8 rounded-3xl shadow-sm border border-[#ebe3d7] text-center font-body">
        <span className="text-[11px] uppercase tracking-[0.25em] text-[#8d9b87] font-semibold">
          21.11.2026 · Álbum en Vivo
        </span>

        <h1 className="font-script text-5xl text-[#5c5146] mt-2">
          Diego <span className="text-[#b59870] text-4xl">&amp;</span> Magali
        </h1>

        <p className="font-editorial italic text-lg text-[#7a7167] mt-1 mb-6">
          Escanea para compartir tus fotos y videos
        </p>

        {/* Código QR visible */}
        <div
          ref={canvasRef}
          className="bg-[#fbf9f5] p-6 rounded-2xl border border-[#e0d7ca] inline-flex items-center justify-center shadow-inner mb-6"
        >
          <QRCodeCanvas
            value={urlGaleria}
            size={1024}
            style={{ width: '220px', height: '220px' }}
            bgColor="#fbf9f5"
            fgColor={colorQR}
            level="H"
            marginSize={2}
          />
        </div>

        {/* Versión SVG oculta para descarga vectorial */}
        <div ref={svgRef} className="hidden">
          <QRCodeSVG
            value={urlGaleria}
            size={1024}
            bgColor="#ffffff"
            fgColor={colorQR}
            level="H"
            marginSize={2}
          />
        </div>

        {/* Panel de ajuste rápido */}
        <div className="text-left space-y-3 mb-6 bg-[#fbf9f5] p-4 rounded-2xl border border-[#ece5da]">
          <div>
            <label className="block text-[10px] font-semibold uppercase tracking-wider text-[#7a7167] mb-1">
              Enlace corto de destino
            </label>
            <input
              type="url"
              value={urlGaleria}
              onChange={(e) => setUrlGaleria(e.target.value)}
              className="w-full px-3 py-2 rounded-lg bg-white border border-[#dfd6c9] text-xs text-[#4a443f] focus:outline-none focus:border-[#8d9b87]"
            />
          </div>

          <div className="flex items-center justify-between pt-1">
            <span className="text-[10px] font-semibold uppercase tracking-wider text-[#7a7167]">
              Color del código:
            </span>
            <div className="flex gap-2">
              {[
                { nombre: 'Café', hex: '#4a443f' },
                { nombre: 'Salvia', hex: '#55634f' },
                { nombre: 'Dorado', hex: '#8c6d46' },
                { nombre: 'Negro', hex: '#111111' },
              ].map((c) => (
                <button
                  key={c.hex}
                  type="button"
                  onClick={() => setColorQR(c.hex)}
                  title={c.nombre}
                  className={`w-6 h-6 rounded-full border-2 cursor-pointer transition-transform ${
                    colorQR === c.hex ? 'scale-115 border-[#b59870]' : 'border-white shadow-xs'
                  }`}
                  style={{ backgroundColor: c.hex }}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Botones de descarga */}
        <div className="flex flex-col sm:flex-row gap-3">
          <button
            type="button"
            onClick={descargarPNG}
            className="flex-1 py-3 px-4 rounded-full bg-[#7c8c75] hover:bg-[#677661] text-white text-xs font-medium uppercase tracking-widest transition-colors cursor-pointer"
          >
            Descargar PNG
          </button>
          <button
            type="button"
            onClick={descargarSVG}
            className="flex-1 py-3 px-4 rounded-full border border-[#c5b8a5] hover:bg-[#f5f0e8] text-[#5c5146] text-xs font-medium uppercase tracking-widest transition-colors cursor-pointer"
          >
            Descargar SVG
          </button>
        </div>
      </div>
    </div>
  );
}