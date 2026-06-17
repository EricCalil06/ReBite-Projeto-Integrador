import { useEffect } from "react";

function SuccessModal({ mensagem, aoFechar, duracao = 2000 }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      aoFechar();
    }, duracao);
    return () => clearTimeout(timer);
  }, [aoFechar, duracao]);

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl shadow-xl px-10 py-10 flex flex-col items-center gap-4 mx-4 max-w-sm">
        <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center">
          <svg
            className="w-9 h-9 text-green-500"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={3}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <p className="text-gray-800 font-semibold text-center text-lg">
          {mensagem}
        </p>
      </div>
    </div>
  );
}

export default SuccessModal;