'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { createClient } from '@supabase/supabase-js';

// ============================================================================
// 1. CONFIGURACIÓN DE SUPABASE (COLOCA AQUÍ TUS CREDENCIALES REALES)
// ============================================================================
const SUPABASE_URL = 'https://mwxsgpokbmcbtcrxhbpd.supabase.co'; // Ej: https://abcdefgh.supabase.co
const SUPABASE_PUBLISHABLE_KEY = 'sb_publishable_76y-p3Bk8_pH6JiTzMFGIg_1GXIdgAr'; // Tu llave completa
const MAX_MB = 50; // Límite de peso por archivo en Megabytes
const MAX_ARCHIVOS_POR_TANDA = 10; // Cantidad máxima de archivos seleccionables a la vez

const supabase = createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);

interface Recuerdo {
  id: string;
  created_at: string;
  nombre_invitado: string;
  url_archivo: string;
  ruta_storage: string;
  tipo_archivo: 'imagen' | 'video';
  user_id: string;
}

interface Notificacion {
  titulo: string;
  mensaje: string;
  tipo: 'exito' | 'error' | 'advertencia' | 'info';
}

const AdornoFloral = ({ className = '' }: { className?: string }) => (
  <svg
    viewBox="0 0 120 120"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={`pointer-events-none opacity-45 select-none ${className}`}
    aria-hidden="true"
  >
    <path
      d="M10 110C35 85 55 55 95 25M35 85C25 70 28 52 42 45C45 60 42 75 35 85ZM60 60C52 42 60 25 76 22C75 38 68 52 60 60ZM45 78C62 78 78 70 84 56C68 58 55 66 45 78ZM22 98C38 98 52 92 58 80C44 81 32 88 22 98Z"
      stroke="#8d9b87"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <circle cx="96" cy="24" r="3" fill="#c5a880" />
    <circle cx="84" cy="34" r="2" fill="#d8c3a5" />
    <circle cx="102" cy="36" r="2" fill="#8d9b87" />
  </svg>
);

export default function GaleriaBodaPage() {
  // Estados principales (ahora 'archivos' es un arreglo File[] para selección múltiple)
  const [usuarioId, setUsuarioId] = useState<string | null>(null);
  const [nombre, setNombre] = useState<string>('');
  const [archivos, setArchivos] = useState<File[]>([]);
  const [progresoSubida, setProgresoSubida] = useState<string>('');
  const [recuerdos, setRecuerdos] = useState<Recuerdo[]>([]);
  const [filtro, setFiltro] = useState<'todos' | 'imagen' | 'video'>('todos');
  const [subiendo, setSubiendo] = useState<boolean>(false);
  const [cargandoGaleria, setCargandoGaleria] = useState<boolean>(true);
  const [descargandoId, setDescargandoId] = useState<string | null>(null);

  // Estados de interfaz
  const [notificacion, setNotificacion] = useState<Notificacion | null>(null);
  const [recuerdoAEliminar, setRecuerdoAEliminar] = useState<Recuerdo | null>(null);
  const [eliminando, setEliminando] = useState<boolean>(false);
  const [fotoAmpliada, setFotoAmpliada] = useState<Recuerdo | null>(null);

  const mostrarAlerta = useCallback(
    (
      titulo: string,
      mensaje: string,
      tipo: 'exito' | 'error' | 'advertencia' | 'info' = 'info',
      autoCerrar = true
    ) => {
      setNotificacion({ titulo, mensaje, tipo });
      if (autoCerrar) {
        setTimeout(() => {
          setNotificacion((actual) => (actual?.mensaje === mensaje ? null : actual));
        }, 4500);
      }
    },
    []
  );

  // ==========================================================================
  // 2. OBTENER RECUERDOS
  // ==========================================================================
  const obtenerRecuerdos = useCallback(async () => {
    const { data, error } = await supabase
      .from('recuerdos')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error al cargar la galería:', error);
      setCargandoGaleria(false);
      return;
    }

    if (data) setRecuerdos(data as Recuerdo[]);
    setCargandoGaleria(false);
  }, []);

  // ==========================================================================
  // 3. INICIALIZAR SESIÓN, REALTIME Y RECONEXIÓN MÓVIL
  // ==========================================================================
  useEffect(() => {
    const nombreGuardado = localStorage.getItem('boda_invitado_nombre');
    if (nombreGuardado) setNombre(nombreGuardado);

    const inicializar = async () => {
      const { data: { session } } = await supabase.auth.getSession();

      if (session?.user) {
        setUsuarioId(session.user.id);
      } else {
        const { data, error } = await supabase.auth.signInAnonymously();
        if (error) {
          console.error('Error de autenticación anónima:', error);
          mostrarAlerta(
            'Error de conexión',
            'No pudimos conectar con el álbum. Revisa tu conexión o recarga la página.',
            'error',
            false
          );
          setCargandoGaleria(false);
          return;
        }
        if (data.user) setUsuarioId(data.user.id);
      }

      await obtenerRecuerdos();
    };

    inicializar();

    const canal = supabase
      .channel('cambios-boda-diego-magali')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'recuerdos' },
        () => {
          obtenerRecuerdos();
        }
      )
      .subscribe();

    const manejarVisibilidad = () => {
      if (document.visibilityState === 'visible') {
        obtenerRecuerdos();
      }
    };

    const manejarTeclado = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setFotoAmpliada(null);
        setRecuerdoAEliminar(null);
      }
    };

    document.addEventListener('visibilitychange', manejarVisibilidad);
    window.addEventListener('keydown', manejarTeclado);

    return () => {
      supabase.removeChannel(canal);
      document.removeEventListener('visibilitychange', manejarVisibilidad);
      window.removeEventListener('keydown', manejarTeclado);
    };
  }, [obtenerRecuerdos, mostrarAlerta]);

  // ==========================================================================
  // 4. MANEJAR SELECCIÓN MÚLTIPLE DE ARCHIVOS
  // ==========================================================================
  const manejarSeleccionArchivos = (e: React.ChangeEvent<HTMLInputElement>) => {
    const listaArchivos = Array.from(e.target.files || []);
    if (listaArchivos.length === 0) {
      setArchivos([]);
      return;
    }

    if (listaArchivos.length > MAX_ARCHIVOS_POR_TANDA) {
      mostrarAlerta(
        'Límite por envío',
        `Puedes subir hasta ${MAX_ARCHIVOS_POR_TANDA} fotos o videos a la vez. Se seleccionaron los primeros ${MAX_ARCHIVOS_POR_TANDA}.`,
        'advertencia'
      );
      setArchivos(listaArchivos.slice(0, MAX_ARCHIVOS_POR_TANDA));
      return;
    }

    setArchivos(listaArchivos);
  };

  // ==========================================================================
  // 5. SUBIR MÚLTIPLES FOTOS O VIDEOS SECUENCIALMENTE
  // ==========================================================================
  const manejarSubida = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!nombre.trim()) {
      mostrarAlerta(
        'Falta tu nombre',
        'Por favor, escribe tu nombre para firmar tus recuerdos.',
        'advertencia'
      );
      return;
    }
    if (archivos.length === 0) {
      mostrarAlerta(
        'Selecciona archivos',
        'Elige una o varias fotos o videos de tu galería para compartir.',
        'advertencia'
      );
      return;
    }
    if (!usuarioId) {
      mostrarAlerta('Preparando sesión...', 'Intenta nuevamente en un instante.', 'info');
      return;
    }

    // Filtrar archivos que cumplan con el tamaño máximo permitido
    const archivosValidos = archivos.filter((f) => f.size / (1024 * 1024) <= MAX_MB);
    const omitidosPorPeso = archivos.length - archivosValidos.length;

    if (archivosValidos.length === 0) {
      mostrarAlerta(
        'Archivos muy pesados',
        `Ninguno de los archivos seleccionados cumple el límite de ${MAX_MB} MB.`,
        'advertencia'
      );
      return;
    }

    localStorage.setItem('boda_invitado_nombre', nombre.trim());
    setSubiendo(true);

    let subidosConExito = 0;
    const nuevosRegistros: Recuerdo[] = [];

    try {
      for (let i = 0; i < archivosValidos.length; i++) {
        const archivoActual = archivosValidos[i];
        const textoProgreso = `Subiendo ${i + 1} de ${archivosValidos.length}...`;
        setProgresoSubida(textoProgreso);
        mostrarAlerta(
          textoProgreso,
          'Mantén esta pantalla abierta hasta que terminen de guardarse.',
          'info',
          false
        );

        const extension = archivoActual.name.split('.').pop() || 'jpg';
        // Incluimos el índice 'i' para garantizar nombres únicos incluso en el mismo milisegundo
        const rutaArchivo = `${usuarioId}/${Date.now()}-${i}.${extension}`;
        const tipoArchivo = archivoActual.type.startsWith('video/') ? 'video' : 'imagen';

        const { error: errorStorage } = await supabase.storage
          .from('galeria-boda')
          .upload(rutaArchivo, archivoActual, {
            cacheControl: '3600',
            upsert: false,
          });

        if (errorStorage) {
          console.error(`Error subiendo archivo ${i + 1}:`, errorStorage);
          continue; // Si uno falla, continúa con los demás
        }

        const { data: urlData } = supabase.storage
          .from('galeria-boda')
          .getPublicUrl(rutaArchivo);

        const { data: registroInsertado, error: errorDB } = await supabase
          .from('recuerdos')
          .insert([
            {
              nombre_invitado: nombre.trim(),
              url_archivo: urlData.publicUrl,
              ruta_storage: rutaArchivo,
              tipo_archivo: tipoArchivo,
              user_id: usuarioId,
            },
          ])
          .select()
          .single();

        if (!errorDB && registroInsertado) {
          subidosConExito++;
          nuevosRegistros.push(registroInsertado as Recuerdo);
        }
      }

      // Actualizar la galería en pantalla inmediatamente
      if (nuevosRegistros.length > 0) {
        setRecuerdos((prev) => [...nuevosRegistros.reverse(), ...prev]);
      }

      // Limpiar selección
      setArchivos([]);
      const inputFile = document.getElementById('input-archivo') as HTMLInputElement;
      if (inputFile) inputFile.value = '';

      // Mensaje final detallado
      if (subidosConExito > 0) {
        const avisoExtra =
          omitidosPorPeso > 0
            ? ` (${omitidosPorPeso} se omitieron por superar los ${MAX_MB} MB).`
            : '.';
        mostrarAlerta(
          subidosConExito === 1
            ? '¡1 recuerdo compartido!'
            : `¡${subidosConExito} recuerdos compartidos!`,
          `Ya son visibles en el álbum de Diego & Magali${avisoExtra}`,
          'exito'
        );
      } else {
        mostrarAlerta(
          'No se pudieron subir',
          'Verifica tu conexión a internet e intenta nuevamente.',
          'error'
        );
      }
    } catch (error) {
      console.error('Error general en subida múltiple:', error);
      mostrarAlerta(
        'Error inesperado',
        'Ocurrió un problema durante la carga. Intenta de nuevo.',
        'error'
      );
    } finally {
      setSubiendo(false);
      setProgresoSubida('');
    }
  };

  // ==========================================================================
  // 6. DESCARGA DIRECTA COMPATIBLE CON IPHONE, ANDROID Y PC
  // ==========================================================================
  const descargarArchivo = async (item: Recuerdo) => {
    setDescargandoId(item.id);
    try {
      const respuesta = await fetch(item.url_archivo);
      const blob = await respuesta.blob();
      const urlBlob = window.URL.createObjectURL(blob);
      const enlace = document.createElement('a');
      const extension =
        item.ruta_storage.split('.').pop() || (item.tipo_archivo === 'video' ? 'mp4' : 'jpg');

      enlace.href = urlBlob;
      enlace.download = `Boda-Diego-Magali-${item.nombre_invitado.replace(/\s+/g, '_')}.${extension}`;
      document.body.appendChild(enlace);
      enlace.click();
      document.body.removeChild(enlace);
      window.URL.revokeObjectURL(urlBlob);
    } catch (error) {
      console.error('Error descargando archivo:', error);
      window.open(item.url_archivo, '_blank', 'noopener,noreferrer');
    } finally {
      setDescargandoId(null);
    }
  };

  // ==========================================================================
  // 7. ELIMINAR RECUERDO PROPIO
  // ==========================================================================
  const confirmarEliminacion = async () => {
    if (!recuerdoAEliminar) return;
    setEliminando(true);

    try {
      const { error: errorDB } = await supabase
        .from('recuerdos')
        .delete()
        .eq('id', recuerdoAEliminar.id);

      if (errorDB) throw errorDB;

      await supabase.storage
        .from('galeria-boda')
        .remove([recuerdoAEliminar.ruta_storage]);

      setRecuerdos((prev) => prev.filter((r) => r.id !== recuerdoAEliminar.id));
      mostrarAlerta('Recuerdo eliminado', 'El archivo ha sido retirado del álbum.', 'exito');
    } catch (error) {
      console.error('Error al eliminar:', error);
      mostrarAlerta('No se pudo eliminar', 'Ocurrió un error al intentar borrar el archivo.', 'error');
    } finally {
      setEliminando(false);
      setRecuerdoAEliminar(null);
    }
  };

  const recuerdosFiltrados = recuerdos.filter((item) => {
    if (filtro === 'todos') return true;
    return item.tipo_archivo === filtro;
  });

  const estilosNotificacion = {
    exito: 'bg-[#f4f7f2]/95 border-[#b7c7b0] text-[#3a4a35]',
    error: 'bg-[#fdf2f2]/95 border-[#e6b8b8] text-[#7a2e2e]',
    advertencia: 'bg-[#fcf8f0]/95 border-[#e3cfa8] text-[#6e5226]',
    info: 'bg-white/95 border-[#dfd6c9] text-[#5c4d3c]',
  };

  // ==========================================================================
  // 8. INTERFAZ VISUAL RESPONSIVE
  // ==========================================================================
  return (
    <div className="min-h-screen bg-[#fbf9f5] text-[#4a443f] pb-[calc(3rem+env(safe-area-inset-bottom))] relative overflow-x-hidden selection:bg-[#e8dfd1]">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,600;0,700;1,400&family=Great+Vibes&family=Montserrat:wght@300;400;500;600&display=swap');
        .font-script { font-family: 'Great Vibes', cursive; }
        .font-editorial { font-family: 'Cormorant Garamond', Georgia, serif; }
        .font-body { font-family: 'Montserrat', sans-serif; }
        button, a, input { touch-action: manipulation; }
      `}</style>

      {/* NOTIFICACIÓN FLOTANTE (TOAST) */}
      {notificacion && (
        <div className="fixed top-[calc(1rem+env(safe-area-inset-top))] left-1/2 -translate-x-1/2 z-50 w-[92%] max-w-md font-body">
          <div
            className={`flex items-start gap-3 p-4 rounded-2xl border shadow-xl backdrop-blur-md transition-all ${
              estilosNotificacion[notificacion.tipo]
            }`}
          >
            <span className="text-lg leading-none mt-0.5 select-none">
              {notificacion.tipo === 'exito' && '🌿'}
              {notificacion.tipo === 'error' && '⚠️'}
              {notificacion.tipo === 'advertencia' && '✨'}
              {notificacion.tipo === 'info' && '🤍'}
            </span>
            <div className="flex-1">
              <h4 className="font-semibold text-xs uppercase tracking-wider">{notificacion.titulo}</h4>
              <p className="text-xs opacity-90 mt-1 leading-relaxed">{notificacion.mensaje}</p>
            </div>
            <button
              onClick={() => setNotificacion(null)}
              className="opacity-60 hover:opacity-100 text-sm p-1.5 -mr-1 -mt-1 cursor-pointer"
              aria-label="Cerrar notificación"
            >
              ✕
            </button>
          </div>
        </div>
      )}

      {/* MODAL DE CONFIRMACIÓN PARA ELIMINAR */}
      {recuerdoAEliminar && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#2c2723]/60 backdrop-blur-xs p-4 font-body">
          <div className="bg-[#fbf9f5] rounded-3xl max-w-sm w-full p-7 shadow-2xl border border-[#e6dfd5] text-center relative overflow-hidden">
            <AdornoFloral className="w-20 h-20 absolute -top-2 -right-2 rotate-180" />
            <h3 className="text-2xl font-editorial font-bold text-[#4a443f] mt-1">
              ¿Eliminar este recuerdo?
            </h3>
            <p className="text-xs sm:text-sm text-[#787069] mt-2 mb-6 leading-relaxed">
              Esta foto o video se retirará del álbum de nuestra boda y no podrá recuperarse.
            </p>
            <div className="flex gap-3">
              <button
                type="button"
                disabled={eliminando}
                onClick={() => setRecuerdoAEliminar(null)}
                className="flex-1 min-h-[44px] py-2.5 px-4 rounded-full border border-[#d6cdc0] text-[#5e564f] font-medium text-xs uppercase tracking-wider hover:bg-[#f2ede4] active:scale-98 transition-all cursor-pointer"
              >
                Cancelar
              </button>
              <button
                type="button"
                disabled={eliminando}
                onClick={confirmarEliminacion}
                className="flex-1 min-h-[44px] py-2.5 px-4 rounded-full bg-[#b85c5c] hover:bg-[#9e4949] disabled:opacity-50 text-white font-medium text-xs uppercase tracking-wider active:scale-98 transition-all cursor-pointer"
              >
                {eliminando ? 'Borrando...' : 'Sí, eliminar'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* VISOR DE FOTOGRAFÍAS EN PANTALLA COMPLETA (LIGHTBOX) */}
      {fotoAmpliada && (
        <div
          onClick={() => setFotoAmpliada(null)}
          className="fixed inset-0 z-50 bg-[#1a1715]/95 backdrop-blur-md flex flex-col items-center justify-center p-4 pt-[calc(1rem+env(safe-area-inset-top))] pb-[calc(1rem+env(safe-area-inset-bottom))] font-body"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="max-w-4xl w-full flex flex-col items-center"
          >
            <div className="w-full flex justify-between items-center text-white/90 mb-3 px-1">
              <span className="font-editorial italic text-lg sm:text-xl truncate pr-4">
                Compartido por {fotoAmpliada.nombre_invitado}
              </span>
              <button
                onClick={() => setFotoAmpliada(null)}
                className="min-w-[44px] min-h-[44px] rounded-full bg-white/15 hover:bg-white/25 active:scale-95 flex items-center justify-center text-white text-base cursor-pointer shrink-0"
                aria-label="Cerrar vista ampliada"
              >
                ✕
              </button>
            </div>

            <img
              src={fotoAmpliada.url_archivo}
              alt={`Recuerdo de ${fotoAmpliada.nombre_invitado}`}
              className="max-h-[72vh] w-auto max-w-full rounded-xl shadow-2xl object-contain bg-black select-none"
            />

            <div className="mt-5 flex gap-3">
              <button
                onClick={() => descargarArchivo(fotoAmpliada)}
                disabled={descargandoId === fotoAmpliada.id}
                className="min-h-[44px] px-6 py-2.5 rounded-full bg-white/15 hover:bg-white/25 active:scale-95 text-white text-xs uppercase tracking-widest transition-all cursor-pointer"
              >
                {descargandoId === fotoAmpliada.id ? 'Descargando...' : 'Guardar en dispositivo'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ENCABEZADO EDITORIAL */}
      <header className="relative bg-white border-b border-[#ece5da] pt-[calc(2rem+env(safe-area-inset-top))] pb-8 px-4 text-center overflow-hidden">
        <AdornoFloral className="w-24 h-24 sm:w-36 sm:h-36 lg:w-44 lg:h-44 absolute top-0 left-0 -translate-x-3 -translate-y-3" />
        <AdornoFloral className="w-24 h-24 sm:w-36 sm:h-36 lg:w-44 lg:h-44 absolute bottom-0 right-0 translate-x-3 translate-y-3 rotate-180" />

        <div className="relative z-10 max-w-2xl mx-auto">
          <span className="font-body text-[11px] sm:text-xs uppercase tracking-[0.28em] text-[#8d9b87] font-semibold">
            Nuestra Boda · 21.11.2026
          </span>

          <h1 className="font-script text-5xl sm:text-6xl lg:text-7xl text-[#5c5146] mt-2 mb-3">
            Diego <span className="text-[#b59870] text-4xl sm:text-5xl lg:text-6xl">&amp;</span> Magali
          </h1>

          <div className="w-16 h-[1px] bg-[#d8cbb8] mx-auto my-3" />

          <h2 className="font-editorial text-xl sm:text-2xl lg:text-3xl font-semibold text-[#4a443f]">
            Compartimos este día junto a ti
          </h2>
          <p className="font-editorial italic text-base sm:text-lg lg:text-xl text-[#7a7167] mt-1.5 leading-relaxed max-w-xl mx-auto">
            “Comparte tus fotos y videos para que podamos revivir este día a través de tus ojos.”
          </p>
        </div>
      </header>

      {/* CONTENEDOR PRINCIPAL */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 sm:pt-8 font-body">
        {/* FORMULARIO DE SUBIDA MÚLTIPLE */}
        <form
          onSubmit={manejarSubida}
          className="max-w-3xl mx-auto bg-white p-5 sm:p-8 rounded-3xl shadow-[0_4px_25px_rgba(92,81,70,0.05)] border border-[#ebe3d7] flex flex-col gap-5 mb-8"
        >
          <div className="text-center">
            <span className="text-[11px] uppercase tracking-[0.2em] text-[#b59870] font-semibold">
              Álbum Colaborativo en Vivo
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
            <div>
              <label className="block text-[11px] font-semibold uppercase tracking-wider text-[#7a7167] mb-1.5">
                Tu Nombre o Familia
              </label>
              <input
                type="text"
                placeholder="Ej: Familia Gómez"
                maxLength={40}
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                className="w-full min-h-[46px] px-4 py-2.5 rounded-xl bg-[#fbf9f5] border border-[#e0d7ca] focus:outline-none focus:border-[#8d9b87] text-base sm:text-sm text-[#4a443f] transition-colors"
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold uppercase tracking-wider text-[#7a7167] mb-1.5">
                Fotos o Videos (Hasta {MAX_ARCHIVOS_POR_TANDA} a la vez)
              </label>
              <input
                id="input-archivo"
                type="file"
                multiple
                accept="image/*,video/*"
                onChange={manejarSeleccionArchivos}
                className="w-full min-h-[46px] text-xs sm:text-sm text-[#6e655c] bg-[#fbf9f5] border border-[#e0d7ca] rounded-xl p-1.5 file:mr-3 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-[#8d9b87]/15 file:text-[#55634f] hover:file:bg-[#8d9b87]/25 cursor-pointer"
              />
            </div>
          </div>

          {/* Resumen visual de archivos seleccionados antes de subir */}
          {archivos.length > 0 && (
            <div className="bg-[#fbf9f5] border border-[#e6dfd5] rounded-2xl px-4 py-3 flex items-center justify-between text-xs text-[#5c5146]">
              <span>
                📎 <strong>{archivos.length}</strong>{' '}
                {archivos.length === 1 ? 'archivo seleccionado' : 'archivos seleccionados'}
              </span>
              {!subiendo && (
                <button
                  type="button"
                  onClick={() => {
                    setArchivos([]);
                    const inputFile = document.getElementById('input-archivo') as HTMLInputElement;
                    if (inputFile) inputFile.value = '';
                  }}
                  className="text-[#b85c5c] hover:underline font-medium cursor-pointer"
                >
                  Quitar selección
                </button>
              )}
            </div>
          )}

          <button
            type="submit"
            disabled={subiendo}
            className="w-full sm:w-auto sm:min-w-[260px] sm:mx-auto min-h-[48px] bg-[#7c8c75] hover:bg-[#677661] active:scale-98 disabled:bg-[#d6d1ca] text-white font-medium text-xs uppercase tracking-[0.18em] py-3.5 px-8 rounded-full transition-all cursor-pointer shadow-sm"
          >
            {subiendo
              ? progresoSubida || 'Subiendo...'
              : archivos.length > 1
              ? `Subir ${archivos.length} recuerdos`
              : 'Subir al álbum'}
          </button>
        </form>

        {/* BARRA DE FILTROS Y CONTADOR */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-6 pb-2">
          <div className="text-center sm:text-left">
            <p className="font-editorial italic text-base sm:text-lg text-[#7a7167]">
              Presiona una foto para verla más grande...
            </p>
            <span className="text-[11px] uppercase tracking-widest text-[#a3998e]">
              {recuerdos.length}{' '}
              {recuerdos.length === 1 ? 'recuerdo compartido' : 'recuerdos compartidos'}
            </span>
          </div>

          <div className="flex gap-2 w-full sm:w-auto justify-center">
            {(['todos', 'imagen', 'video'] as const).map((tipo) => (
              <button
                key={tipo}
                onClick={() => setFiltro(tipo)}
                className={`flex-1 sm:flex-initial min-h-[40px] px-4 py-2 rounded-full text-xs uppercase tracking-wider font-medium transition-all cursor-pointer ${
                  filtro === tipo
                    ? 'bg-[#b59870] text-white shadow-xs'
                    : 'bg-white text-[#6e655c] border border-[#e3dbd0] hover:bg-[#f5f0e8]'
                }`}
              >
                {tipo === 'todos' ? 'Todos' : tipo === 'imagen' ? 'Fotos' : 'Videos'}
              </button>
            ))}
          </div>
        </div>

        {/* CUADRÍCULA ADAPTABLE */}
        {cargandoGaleria ? (
          <div className="text-center py-16">
            <p className="font-editorial italic text-xl text-[#8c8277] animate-pulse">
              Cargando recuerdos de la boda...
            </p>
          </div>
        ) : recuerdosFiltrados.length === 0 ? (
          <div className="text-center py-16 px-4 bg-white rounded-3xl border border-dashed border-[#dfd6c9]">
            <p className="font-editorial italic text-xl text-[#8c8277]">
              Aún no hay recuerdos publicados en esta sección.
            </p>
            <p className="text-xs text-[#a3998e] mt-1">
              ¡Sé el primero en capturar un momento especial!
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5">
            {recuerdosFiltrados.map((item) => {
              const esMio = item.user_id === usuarioId;

              return (
                <div
                  key={item.id}
                  className="bg-white p-2.5 rounded-2xl shadow-[0_3px_15px_rgba(0,0,0,0.04)] border border-[#ebe3d7] flex flex-col transition-transform duration-200 hover:-translate-y-1"
                >
                  <div
                    onClick={() => item.tipo_archivo === 'imagen' && setFotoAmpliada(item)}
                    className={`aspect-square rounded-xl overflow-hidden bg-[#1e1b18] relative ${
                      item.tipo_archivo === 'imagen' ? 'cursor-zoom-in' : ''
                    }`}
                  >
                    {item.tipo_archivo === 'video' ? (
                      <video
                        src={`${item.url_archivo}#t=0.001`}
                        controls
                        playsInline
                        preload="metadata"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <img
                        src={item.url_archivo}
                        alt={`Recuerdo de ${item.nombre_invitado}`}
                        loading="lazy"
                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                      />
                    )}
                  </div>

                  <div className="pt-3 pb-1 px-1 flex items-center justify-between gap-2">
                    <span className="font-editorial italic text-base sm:text-lg font-semibold text-[#4a443f] truncate">
                      {item.nombre_invitado}
                    </span>

                    <div className="flex items-center gap-1.5 shrink-0">
                      <button
                        onClick={() => descargarArchivo(item)}
                        disabled={descargandoId === item.id}
                        className="min-h-[34px] px-3 py-1.5 text-[11px] uppercase tracking-wider font-medium bg-[#f5f0e8] hover:bg-[#ebe3d7] active:scale-95 text-[#6e655c] rounded-full transition-all cursor-pointer"
                      >
                        {descargandoId === item.id ? '...' : 'Guardar'}
                      </button>

                      {esMio && (
                        <button
                          onClick={() => setRecuerdoAEliminar(item)}
                          className="min-h-[34px] px-3 py-1.5 text-[11px] uppercase tracking-wider font-medium bg-[#fdf2f2] hover:bg-[#fae3e3] active:scale-95 text-[#b85c5c] border border-[#f0d1d1] rounded-full transition-all cursor-pointer"
                        >
                          Borrar
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}