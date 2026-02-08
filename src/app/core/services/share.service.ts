import { Injectable } from '@angular/core';
import { toPng } from 'html-to-image';

@Injectable({ providedIn: 'root' })
export class ShareService {
  async shareCard(elementId: string) {
    const node = document.getElementById(elementId);
    if (!node) return;

    try {
      // 1. توليد الـ Data URL
      const dataUrl = await toPng(node, {
        pixelRatio: 3,
        cacheBust: true,
        backgroundColor: '#120202',
      });

      // 2. تحويل الـ Data URL إلى Blob يدوياً لتجاوز حماية الـ CSP
      const blob = this.dataURItoBlob(dataUrl);
      const file = new File([blob], `Marsa-${Date.now()}.png`, { type: 'image/png' });

      // 3. المشاركة أو التحميل
      if (navigator.canShare && navigator.canShare({ files: [file] })) {
        await navigator.share({
          files: [file],
          title: 'Marsa AI',
          text: 'صدى مشاعري عبر شجن AI',
        });
      } else {
        this.downloadFallback(dataUrl);
      }
    } catch (error) {
      console.error('Error sharing card:', error);
    }
  }

  // دالة تحويل يدوية لا تحتاج لـ fetch
  private dataURItoBlob(dataURI: string) {
    const byteString = atob(dataURI.split(',')[1]);
    const mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];
    const ab = new ArrayBuffer(byteString.length);
    const ia = new Uint8Array(ab);
    for (let i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i);
    }
    return new Blob([ab], { type: mimeString });
  }

  private downloadFallback(dataUrl: string) {
    const link = document.createElement('a');
    link.download = `Marsa-echo-${Date.now()}.png`;
    link.href = dataUrl;
    link.click();
  }
}
