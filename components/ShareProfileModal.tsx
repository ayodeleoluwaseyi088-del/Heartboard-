import React, { useState } from 'react';
import { Download, Link, Check } from 'lucide-react';

interface ShareProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  userHandle: string;
  userName?: string;
  profileImage: string | null;
  onShowToast?: (message: string) => void;
}

export const ShareProfileModal: React.FC<ShareProfileModalProps> = ({
  isOpen,
  onClose,
  userHandle,
  userName,
  profileImage,
  onShowToast,
}) => {
  const [copiedLink, setCopiedLink] = useState(false);
  const [downloading, setDownloading] = useState(false);

  if (!isOpen) return null;

  const getShareUrl = () => {
    const cleanHandle = userHandle.startsWith('@') ? userHandle.slice(1) : userHandle;
    return `${window.location.origin}/#${cleanHandle}`;
  };

  const handleCopyOnlyLink = async () => {
    const url = getShareUrl();
    try {
      await navigator.clipboard.writeText(url);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
      onShowToast?.('Profile link copied to clipboard!');
    } catch {
      // Fallback
      const input = document.createElement('input');
      input.value = url;
      document.body.appendChild(input);
      input.select();
      document.execCommand('copy');
      document.body.removeChild(input);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
      onShowToast?.('Profile link copied to clipboard!');
    }
  };

  const handleDownloadAndCopyLink = async () => {
    setDownloading(true);
    
    // First copy link
    await handleCopyOnlyLink();

    // Create synthesized share card image canvas
    try {
      const canvas = document.createElement('canvas');
      canvas.width = 760;
      canvas.height = 948;
      const ctx = canvas.getContext('2d');

      if (ctx) {
        // Outer background (#FF5C43 coral)
        ctx.fillStyle = '#FF5C43';
        ctx.beginPath();
        ctx.roundRect(0, 0, 760, 948, 64);
        ctx.fill();

        // Concentric Peach Ring (#FFA585)
        ctx.fillStyle = '#FFA585';
        ctx.beginPath();
        ctx.ellipse(380, 474, 430, 430, 0, 0, 2 * Math.PI);
        ctx.fill();

        // Concentric Inner Soft Pink Fill (#FCDAD1)
        ctx.fillStyle = '#FCDAD1';
        ctx.beginPath();
        ctx.ellipse(380, 474, 330, 330, 0, 0, 2 * Math.PI);
        ctx.fill();

        // Function to draw text & finish download
        const drawTextAndDownload = (imgElement?: HTMLImageElement) => {
          // Profile image circular cutout
          const avatarSize = 340;
          const avatarX = (760 - avatarSize) / 2;
          const avatarY = 160;

          if (imgElement) {
            ctx.save();
            ctx.beginPath();
            ctx.arc(380, avatarY + avatarSize / 2, avatarSize / 2, 0, Math.PI * 2);
            ctx.closePath();
            ctx.clip();
            ctx.drawImage(imgElement, avatarX, avatarY, avatarSize, avatarSize);
            ctx.restore();
          } else {
            // Default avatar circle
            ctx.fillStyle = '#FDF4F2';
            ctx.beginPath();
            ctx.arc(380, avatarY + avatarSize / 2, avatarSize / 2, 0, Math.PI * 2);
            ctx.fill();
            
            ctx.fillStyle = '#FFB5A9';
            ctx.font = 'bold 120px Nunito, sans-serif';
            ctx.textAlign = 'center';
            ctx.fillText(userName ? userName.charAt(0).toUpperCase() : 'M', 380, avatarY + avatarSize / 2 + 40);
          }

          // Handle text
          ctx.fillStyle = '#1A1B25';
          ctx.font = '800 52px Nunito, sans-serif';
          ctx.textAlign = 'center';
          ctx.fillText(userHandle, 380, 620);

          // Subtitle text
          ctx.fillStyle = '#353849';
          ctx.font = '600 32px Nunito, sans-serif';
          ctx.fillText('Write messages on my', 380, 680);
          ctx.fillText('Heartboard wall', 380, 725);

          // Trigger download
          const link = document.createElement('a');
          const cleanHandle = userHandle.startsWith('@') ? userHandle.slice(1) : userHandle;
          link.download = `heartboard-${cleanHandle}.png`;
          link.href = canvas.toDataURL('image/png');
          link.click();

          setDownloading(false);
          onShowToast?.('Profile card image downloaded & link copied!');
        };

        if (profileImage) {
          const img = new Image();
          img.crossOrigin = 'anonymous';
          img.onload = () => drawTextAndDownload(img);
          img.onerror = () => drawTextAndDownload();
          img.src = profileImage;
        } else {
          drawTextAndDownload();
        }
      }
    } catch {
      setDownloading(false);
      onShowToast?.('Profile link copied to clipboard!');
    }
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/65 backdrop-blur-xs p-4 animate-in fade-in duration-200"
      onClick={onClose}
    >
      {/* White Pop-up Card Overlay Container */}
      <div 
        className="relative w-full max-w-[943px] max-h-[90vh] sm:max-h-[715px] bg-white rounded-[32px] sm:rounded-[40px] p-6 sm:p-8 flex flex-col items-center justify-center gap-6 animate-in zoom-in-95 duration-200 overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Inner centered share container wrapper */}
        <div className="w-full max-w-[350px] sm:max-w-[380px] flex flex-col items-center gap-4 sm:gap-5">
          {/* 
            Main Share Card Asset matching attached reference image strictly:
            Coral Red background with Concentric Peach & Soft Pink Ring layers
          */}
          <div className="relative w-full aspect-[340/420] rounded-[32px] bg-[#FF5C43] overflow-hidden flex flex-col items-center justify-center p-6 select-none">
            {/* Concentric Ring Backgrounds */}
            <div className="absolute inset-0 pointer-events-none">
              <svg 
                className="w-full h-full" 
                viewBox="0 0 340 420" 
                preserveAspectRatio="none" 
                fill="none" 
                xmlns="http://www.w3.org/2000/svg"
              >
                {/* Outer Coral Base */}
                <rect width="340" height="420" fill="#FF5C43" />
                
                {/* Outer Concentric Peach Ring */}
                <ellipse cx="170" cy="210" rx="195" ry="195" fill="#FFA585" />
                
                {/* Inner Concentric Soft Pink Fill */}
                <ellipse cx="170" cy="210" rx="150" ry="150" fill="#FCDAD1" />
              </svg>
            </div>

            {/* Card Content Layer */}
            <div className="relative z-10 flex flex-col items-center text-center w-full px-4">
              {/* Center Profile Image */}
              <div className="w-32 h-32 sm:w-36 sm:h-36 rounded-full overflow-hidden bg-[#FDF4F2] flex items-center justify-center shrink-0 mb-3.5">
                {profileImage ? (
                  <img 
                    src={profileImage} 
                    alt={userHandle} 
                    className="w-full h-full object-cover" 
                  />
                ) : (
                  <svg className="w-24 h-24 text-[#FFB5A9] fill-current transform translate-y-2" viewBox="0 0 24 24">
                    <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                  </svg>
                )}
              </div>

              {/* User Handle */}
              <h2 className="text-2xl sm:text-3xl font-extrabold text-[#1A1B25] tracking-tight leading-tight mb-1.5 font-sans">
                {userHandle}
              </h2>

              {/* Subtitle */}
              <p className="text-xs sm:text-sm font-semibold text-[#353849] leading-snug max-w-[200px]">
                Write messages on my Heartboard wall
              </p>
            </div>
          </div>

          {/* 
            CTA Buttons Stack floating inside the white overlay below the card:
            1. Filled Coral Primary Button: "Download & Copy Link"
            2. Secondary Button: "Copy Link"
          */}
          <div className="w-full flex flex-col gap-2.5 sm:gap-3">
            {/* Button 1: Download & Copy Link */}
            <button
              onClick={handleDownloadAndCopyLink}
              disabled={downloading}
              className="w-full py-3.5 sm:py-4 rounded-full bg-[#FF5C43] hover:bg-[#E84B33] active:scale-[0.98] text-white font-extrabold text-sm sm:text-base transition-all cursor-pointer flex items-center justify-center gap-2"
            >
              {downloading ? (
                <span className="inline-block animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent" />
              ) : (
                <span>Download & Copy Link</span>
              )}
            </button>

            {/* Button 2: Copy Link */}
            <button
              onClick={handleCopyOnlyLink}
              className="w-full py-3.5 sm:py-4 rounded-full bg-gray-50 hover:bg-gray-100 active:scale-[0.98] text-[#1A1B25] font-extrabold text-sm sm:text-base transition-all cursor-pointer flex items-center justify-center gap-2"
            >
              {copiedLink ? (
                <>
                  <Check className="w-5 h-5 text-emerald-600 stroke-[2.5]" />
                  <span className="text-emerald-700">Link Copied!</span>
                </>
              ) : (
                <span>Copy Link</span>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
