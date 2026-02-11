
import React, { useRef, useEffect, useState } from 'react';
import { Download, X, Share2, ShieldCheck } from 'lucide-react';
import { Transaction } from '../types';

interface Props {
  transaction: Transaction;
  onClose: () => void;
}

const DigitalReceipt: React.FC<Props> = ({ transaction, onClose }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [receiptUrl, setReceiptUrl] = useState<string | null>(null);

  useEffect(() => {
    const generateReceipt = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      // Set Dimensions (POS Slip Style)
      canvas.width = 400;
      canvas.height = 600;

      // Background
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Watermark
      ctx.save();
      ctx.translate(canvas.width / 2, canvas.height / 2);
      ctx.rotate(-Math.PI / 4);
      ctx.font = 'bold 40px sans-serif';
      ctx.fillStyle = 'rgba(15, 23, 42, 0.05)';
      ctx.textAlign = 'center';
      ctx.fillText('FINTRACK PREMIUM', 0, 0);
      ctx.restore();

      // Header Branding
      ctx.fillStyle = '#0ea5e9'; // sky-500
      ctx.font = 'bold 24px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('FinTrack Digital Receipt', canvas.width / 2, 50);
      
      ctx.fillStyle = '#64748b'; // slate-500
      ctx.font = '12px sans-serif';
      ctx.fillText('Smart Financial Assistant', canvas.width / 2, 70);

      // Divider
      ctx.strokeStyle = '#e2e8f0';
      ctx.setLineDash([5, 5]);
      ctx.beginPath();
      ctx.moveTo(20, 90);
      ctx.lineTo(380, 90);
      ctx.stroke();
      ctx.setLineDash([]);

      // Transaction Details
      ctx.textAlign = 'left';
      ctx.fillStyle = '#1e293b'; // slate-800
      ctx.font = 'bold 14px sans-serif';
      
      const details = [
        { label: 'Transaction ID:', value: transaction.id.slice(0, 8).toUpperCase() },
        { label: 'Date:', value: transaction.date },
        { label: 'Type:', value: transaction.type === 'Income' ? 'আয় (Income)' : 'ব্যয় (Expense)' },
        { label: 'Category:', value: transaction.category },
        { label: 'Payment Mode:', value: transaction.paymentMode },
      ];

      let yPos = 130;
      details.forEach(item => {
        ctx.fillStyle = '#64748b';
        ctx.font = '12px sans-serif';
        ctx.fillText(item.label, 40, yPos);
        
        ctx.fillStyle = '#1e293b';
        ctx.font = 'bold 13px sans-serif';
        ctx.fillText(item.value, 160, yPos);
        yPos += 35;
      });

      // Amount Box
      ctx.fillStyle = transaction.type === 'Income' ? '#f0fdf4' : '#fef2f2';
      ctx.fillRect(40, yPos, 320, 60);
      ctx.strokeStyle = transaction.type === 'Income' ? '#22c55e' : '#ef4444';
      ctx.strokeRect(40, yPos, 320, 60);
      
      ctx.textAlign = 'center';
      ctx.fillStyle = transaction.type === 'Income' ? '#15803d' : '#b91c1c';
      ctx.font = 'bold 28px sans-serif';
      ctx.fillText(`৳ ${transaction.amount.toLocaleString()}`, canvas.width / 2, yPos + 40);

      yPos += 90;

      // Note
      if (transaction.note) {
        ctx.textAlign = 'left';
        ctx.fillStyle = '#64748b';
        ctx.font = 'italic 12px sans-serif';
        ctx.fillText('Note:', 40, yPos);
        ctx.fillStyle = '#334155';
        ctx.fillText(transaction.note.length > 40 ? transaction.note.slice(0, 37) + '...' : transaction.note, 40, yPos + 20);
      }

      // QR Code Mockup (using canvas drawing for performance)
      const qrSize = 80;
      const qrX = canvas.width / 2 - qrSize / 2;
      const qrY = canvas.height - 150;
      ctx.fillStyle = '#1e293b';
      // Simulate QR Pattern
      for(let i=0; i<8; i++) {
          for(let j=0; j<8; j++) {
              if((i+j)%2 === 0 || (i*j)%3 === 0) {
                  ctx.fillRect(qrX + (i*10), qrY + (j*10), 8, 8);
              }
          }
      }
      // QR Borders
      ctx.strokeRect(qrX - 5, qrY - 5, qrSize + 10, qrSize + 10);

      // Footer
      ctx.textAlign = 'center';
      ctx.fillStyle = '#94a3b8';
      ctx.font = 'bold 10px sans-serif';
      ctx.fillText('VERIFIED DIGITAL RECEIPT', canvas.width / 2, canvas.height - 40);
      ctx.fillStyle = '#0ea5e9';
      ctx.font = 'bold 12px sans-serif';
      ctx.fillText('CREATED BY @SHOHAG VAII', canvas.width / 2, canvas.height - 20);

      setReceiptUrl(canvas.toDataURL('image/png'));
    };

    generateReceipt();
  }, [transaction]);

  const handleDownload = () => {
    if (!receiptUrl) return;
    const link = document.createElement('a');
    link.href = receiptUrl;
    link.download = `FinTrack_Receipt_${transaction.id.slice(0,6)}.png`;
    link.click();
  };

  return (
    <div className="fixed inset-0 z-[250] flex items-center justify-center bg-black/90 backdrop-blur-md p-4 overflow-y-auto">
      <div className="w-full max-w-sm flex flex-col gap-6 animate-slide-up">
        <div className="flex justify-between items-center text-white">
          <div className="flex items-center gap-2">
            <ShieldCheck className="text-sky-400" />
            <h3 className="font-bold">ডিজিটাল রসিদ</h3>
          </div>
          <button onClick={onClose} className="p-2 bg-white/10 rounded-full">
            <X size={20} />
          </button>
        </div>

        <div className="bg-white rounded-3xl overflow-hidden shadow-2xl shadow-sky-500/20">
          <canvas ref={canvasRef} className="hidden" />
          {receiptUrl ? (
            <img src={receiptUrl} alt="Digital Receipt" className="w-full h-auto" />
          ) : (
            <div className="h-[500px] flex items-center justify-center text-slate-400">রসিদ জেনারেট হচ্ছে...</div>
          )}
        </div>

        <div className="flex gap-4">
          <button 
            onClick={handleDownload}
            className="flex-1 py-4 bg-sky-500 hover:bg-sky-600 rounded-2xl font-bold flex items-center justify-center gap-2 shadow-lg shadow-sky-500/30 transition-all active:scale-95"
          >
            <Download size={20} /> ডাউনলোড করুন
          </button>
          <button 
            className="w-16 h-14 bg-white/10 rounded-2xl flex items-center justify-center text-white hover:bg-white/20 transition-all"
            onClick={() => {
                if(navigator.share && receiptUrl) {
                    fetch(receiptUrl).then(res => res.blob()).then(blob => {
                        const file = new File([blob], 'receipt.png', { type: 'image/png' });
                        navigator.share({
                            files: [file],
                            title: 'FinTrack Receipt',
                            text: 'My digital transaction receipt from FinTrack.'
                        }).catch(console.error);
                    });
                }
            }}
          >
            <Share2 size={24} />
          </button>
        </div>
        
        <p className="text-center text-[10px] text-slate-500 uppercase font-black tracking-[0.3em]">
          Verified by FinTrack AI Core
        </p>
      </div>
    </div>
  );
};

export default DigitalReceipt;
