import React from 'react';
import { X, Folder, Image as ImageIcon, Rocket, CheckCircle2, Terminal } from 'lucide-react';
import { FRAME_CONFIG } from '../config';

interface UploadGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const UploadGuideModal: React.FC<UploadGuideModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-[#1d092b] border border-purple-800/60 rounded-3xl shadow-2xl shadow-purple-950/90 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-5 border-b border-purple-900/40 flex items-center justify-between bg-[#160623]">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#3E9B3A]/20 flex items-center justify-center">
              <Folder className="w-5 h-5 text-[#3E9B3A]" />
            </div>
            <div>
              <h3 className="font-display text-lg sm:text-xl font-bold text-white">
                Como Subir os Frames e Publicar o Site
              </h3>
              <p className="text-xs text-purple-300/70">
                Guia passo a passo para a animação cinematográfica
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-full text-purple-300 hover:text-white hover:bg-purple-900/50 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-6 text-sm text-purple-100/90">
          {/* Step 1: Video & In-Browser Extraction */}
          <div className="bg-[#240c36] rounded-2xl p-5 border border-purple-800/40">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-6 h-6 rounded-full bg-[#3E9B3A] text-white flex items-center justify-center text-xs font-bold">
                1
              </div>
              <h4 className="font-display text-base font-bold text-white">
                Extração de Frames no Navegador (Já Ativa!)
              </h4>
            </div>
            <p className="text-xs sm:text-sm text-purple-200/80 mb-3 leading-relaxed">
              O site agora carrega o vídeo oficial <code className="px-2 py-0.5 rounded bg-purple-950 text-[#FFF4E0] border border-purple-700/50 font-mono">public/assets/aistudio/video-acai_ae0feae3.mp4</code> e extrai os 96 frames diretamente no navegador com aceleração de hardware (ImageBitmap).
            </p>
            <div className="bg-[#14041f] rounded-xl p-3 border border-purple-900/60 font-mono text-xs text-purple-200">
              <div className="text-emerald-400 font-semibold mb-1">📂 Arquivos disponíveis:</div>
              <div>meu-projeto/</div>
              <div>├── public/</div>
              <div>│   ├── assets/aistudio/video-acai_ae0feae3.mp4 (vídeo original)</div>
              <div>│   └── frames/ (sequência de 96 JPGs pré-gerados de backup)</div>
              <div className="text-[#3E9B3A]">│       ├── frame00001.jpg a frame00191.jpg</div>
            </div>
          </div>

          {/* Step 2: Converting Video to Sequence */}
          <div className="bg-[#240c36] rounded-2xl p-5 border border-purple-800/40">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-6 h-6 rounded-full bg-[#3E9B3A] text-white flex items-center justify-center text-xs font-bold">
                2
              </div>
              <h4 className="font-display text-base font-bold text-white">
                Como exportar do vídeo com FFmpeg (Opcional)
              </h4>
            </div>
            <p className="text-xs sm:text-sm text-purple-200/80 mb-3 leading-relaxed">
              Se você tem o vídeo mp4 (720x1280) e quer extrair exatamente os frames ímpares em JPG:
            </p>
            <div className="bg-[#14041f] rounded-xl p-3 border border-purple-900/60 font-mono text-xs text-emerald-300 overflow-x-auto flex items-center gap-2">
              <Terminal className="w-4 h-4 text-purple-400 shrink-0" />
              <span>ffmpeg -i video.mp4 -vf "scale=720:1280" -q:v 2 frames/frame%05d.jpg</span>
            </div>
          </div>

          {/* Step 3: Deployment */}
          <div className="bg-[#240c36] rounded-2xl p-5 border border-purple-800/40">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-6 h-6 rounded-full bg-[#3E9B3A] text-white flex items-center justify-center text-xs font-bold">
                3
              </div>
              <h4 className="font-display text-base font-bold text-white">
                Como publicar o site
              </h4>
            </div>
            <ul className="space-y-2 text-xs sm:text-sm text-purple-200/80">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#3E9B3A] shrink-0 mt-0.5" />
                <span>
                  <strong>Vercel ou Netlify:</strong> Basta conectar seu repositório Git ou arrastar a pasta. O comando de build é <code className="px-1.5 py-0.5 rounded bg-purple-950 font-mono text-white">npm run build</code> e a pasta de saída é <code className="px-1.5 py-0.5 rounded bg-purple-950 font-mono text-white">dist</code>.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#3E9B3A] shrink-0 mt-0.5" />
                <span>
                  <strong>Hospedagem Estática (Apache / Nginx / Hostgator):</strong> Execute <code className="px-1.5 py-0.5 rounded bg-purple-950 font-mono text-white">npm run build</code> e suba os arquivos de dentro da pasta <code className="px-1.5 py-0.5 rounded bg-purple-950 font-mono text-white">dist/</code> para a sua hospedagem.
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Footer */}
        <div className="p-5 bg-[#160623] border-t border-purple-900/40 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-6 py-2.5 rounded-full bg-[#3E9B3A] hover:bg-[#348630] text-white font-semibold text-xs tracking-wide transition-colors"
          >
            Entendi, fechar guia
          </button>
        </div>
      </div>
    </div>
  );
};
