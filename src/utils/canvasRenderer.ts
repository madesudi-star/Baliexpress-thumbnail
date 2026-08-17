import { ThumbnailConfig } from '../types';

export const CANVAS_WIDTH = 1080;
export const CANVAS_HEIGHT = 1350;

/**
 * Loads an image from a URL or Data URI safely with crossOrigin enabled
 */
export function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => resolve(img);
    img.onerror = (err) => reject(new Error(`Failed to load image: ${err}`));
    img.src = src;
  });
}

interface WrappedTextResult {
  lines: string[];
  fontSize: number;
  lineHeight: number;
  totalTextHeight: number;
}

/**
 * Draws the official TikTok Icon Badge
 */
function drawTikTokBadge(ctx: CanvasRenderingContext2D, cx: number, cy: number, size: number) {
  ctx.save();
  ctx.translate(cx, cy);
  const radius = size / 2;

  // Black circular badge background
  ctx.fillStyle = '#010101';
  ctx.beginPath();
  ctx.arc(0, 0, radius, 0, Math.PI * 2);
  ctx.fill();

  // Subtle border
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
  ctx.lineWidth = 1;
  ctx.stroke();

  // Scale for icon glyph
  const s = size / 32;
  ctx.scale(s, s);

  // TikTok musical note glyph
  ctx.fillStyle = '#FFFFFF';
  ctx.beginPath();
  ctx.moveTo(1, -7);
  ctx.lineTo(1, 3.5);
  ctx.bezierCurveTo(1, 6, -1, 7.5, -3.5, 7.5);
  ctx.bezierCurveTo(-6, 7.5, -7.5, 6, -7.5, 3.5);
  ctx.bezierCurveTo(-7.5, 1, -6, -0.5, -3.5, -0.5);
  ctx.bezierCurveTo(-2.7, -0.5, -2, -0.2, -1.5, 0.3);
  ctx.lineTo(-1.5, -7);
  ctx.lineTo(1, -7);
  ctx.bezierCurveTo(2.8, -4.5, 5.2, -3.5, 8, -3.5);
  ctx.lineTo(8, -6.5);
  ctx.bezierCurveTo(5.8, -6.5, 3.8, -7.8, 3.2, -10);
  ctx.lineTo(1, -10);
  ctx.closePath();
  ctx.fill();

  ctx.restore();
}

/**
 * Draws the official Facebook Icon Badge
 */
function drawFacebookBadge(ctx: CanvasRenderingContext2D, cx: number, cy: number, size: number) {
  ctx.save();
  ctx.translate(cx, cy);
  const radius = size / 2;

  // Blue circular background
  ctx.fillStyle = '#1877F2';
  ctx.beginPath();
  ctx.arc(0, 0, radius, 0, Math.PI * 2);
  ctx.fill();

  // White 'f' letter
  ctx.fillStyle = '#FFFFFF';
  ctx.font = `bold ${Math.round(size * 0.72)}px "Helvetica Neue", Arial, sans-serif`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('f', radius * 0.08, radius * 0.12);

  ctx.restore();
}

/**
 * Draws the official Instagram Icon Badge
 */
function drawInstagramBadge(ctx: CanvasRenderingContext2D, cx: number, cy: number, size: number) {
  ctx.save();
  ctx.translate(cx, cy);
  const radius = size / 2;

  // Instagram Gradient Background
  const grad = ctx.createLinearGradient(-radius, radius, radius, -radius);
  grad.addColorStop(0, '#FFDC80');
  grad.addColorStop(0.25, '#F77737');
  grad.addColorStop(0.5, '#F56040');
  grad.addColorStop(0.75, '#E1306C');
  grad.addColorStop(1, '#833AB4');

  ctx.fillStyle = grad;
  ctx.beginPath();
  ctx.roundRect
    ? ctx.roundRect(-radius, -radius, size, size, radius * 0.38)
    : ctx.arc(0, 0, radius, 0, Math.PI * 2);
  ctx.fill();

  // Instagram Camera Glyph in White
  const s = size / 28;
  ctx.scale(s, s);
  ctx.strokeStyle = '#FFFFFF';
  ctx.lineWidth = 2.2;
  ctx.fillStyle = '#FFFFFF';

  // Outer rounded camera box
  ctx.beginPath();
  ctx.roundRect
    ? ctx.roundRect(-7.5, -7.5, 15, 15, 4)
    : ctx.strokeRect(-7.5, -7.5, 15, 15);
  ctx.stroke();

  // Center lens circle
  ctx.beginPath();
  ctx.arc(0, 0, 3.8, 0, Math.PI * 2);
  ctx.stroke();

  // Top-right flash dot
  ctx.beginPath();
  ctx.arc(4.6, -4.6, 1.1, 0, Math.PI * 2);
  ctx.fill();

  ctx.restore();
}

/**
 * Draws the Bali Express Logo in the Top-Left Corner
 */
async function drawLogoLayer(
  ctx: CanvasRenderingContext2D,
  config: ThumbnailConfig,
  loadedLogoImg?: HTMLImageElement | null
): Promise<void> {
  if (config.showLogo === false) return;

  const targetWidth = Math.max(160, Math.min(380, config.logoSize || 260));
  const badgeStyle = config.logoBadgeStyle || 'transparent';
  const isTransparent = badgeStyle === 'transparent';

  const badgePadX = isTransparent ? 0 : 16;
  const badgePadY = isTransparent ? 0 : 12;
  const logoInnerWidth = targetWidth;
  const logoInnerHeight = Math.round(logoInnerWidth * 0.32); // aspect ratio ~3.1:1
  const badgeWidth = logoInnerWidth + badgePadX * 2;
  const badgeHeight = logoInnerHeight + badgePadY * 2;

  const posX = Math.max(20, Math.min(CANVAS_WIDTH - badgeWidth - 20, 48 + (config.logoOffsetX || 0)));
  const posY = Math.max(20, Math.min(CANVAS_HEIGHT - badgeHeight - 20, 48 + (config.logoOffsetY || 0)));

  ctx.save();

  // Check if custom logo image is uploaded
  let logoImg = loadedLogoImg;
  if (!logoImg && config.logoSrc) {
    try {
      logoImg = await loadImage(config.logoSrc);
    } catch {
      // fallback to vector drawing
    }
  }

  if (badgeStyle === 'white_badge') {
    // Crisp white card badge with smooth rounded corners and drop shadow
    ctx.shadowColor = 'rgba(0, 0, 0, 0.45)';
    ctx.shadowBlur = 18;
    ctx.shadowOffsetX = 0;
    ctx.shadowOffsetY = 6;

    ctx.fillStyle = '#FFFFFF';
    ctx.beginPath();
    ctx.roundRect
      ? ctx.roundRect(posX, posY, badgeWidth, badgeHeight, 10)
      : ctx.rect(posX, posY, badgeWidth, badgeHeight);
    ctx.fill();

    // Reset shadow for inner vector elements
    ctx.shadowColor = 'transparent';
    ctx.shadowBlur = 0;
    ctx.shadowOffsetY = 0;
  } else if (badgeStyle === 'dark_badge') {
    // Dark slate card badge
    ctx.shadowColor = 'rgba(0, 0, 0, 0.65)';
    ctx.shadowBlur = 18;
    ctx.shadowOffsetX = 0;
    ctx.shadowOffsetY = 6;

    ctx.fillStyle = '#0F172A';
    ctx.beginPath();
    ctx.roundRect
      ? ctx.roundRect(posX, posY, badgeWidth, badgeHeight, 10)
      : ctx.rect(posX, posY, badgeWidth, badgeHeight);
    ctx.fill();

    ctx.shadowColor = 'transparent';
    ctx.shadowBlur = 0;
    ctx.shadowOffsetY = 0;
  } else {
    // Transparent style: Natural transparent background with soft readable shadow
    ctx.shadowColor = 'rgba(0, 0, 0, 0.85)';
    ctx.shadowBlur = 10;
    ctx.shadowOffsetX = 0;
    ctx.shadowOffsetY = 2;
  }

  const innerX = isTransparent ? posX : posX + badgePadX;
  const innerY = isTransparent ? posY : posY + badgePadY;

  if (logoImg && logoImg.complete && logoImg.naturalWidth > 0) {
    const imgRatio = logoImg.naturalWidth / logoImg.naturalHeight;
    let drawW = logoInnerWidth;
    let drawH = drawW / imgRatio;
    if (drawH > logoInnerHeight) {
      drawH = logoInnerHeight;
      drawW = drawH * imgRatio;
    }
    const drawX = innerX + (logoInnerWidth - drawW) / 2;
    const drawY = innerY + (logoInnerHeight - drawH) / 2;
    ctx.drawImage(logoImg, drawX, drawY, drawW, drawH);
  } else {
    // Render authentic vector Bali Express typography exactly matching the official logo
    const jpFontSize = Math.round(logoInnerHeight * 0.28);
    const beFontSize = Math.round(logoInnerHeight * 0.62);

    const jpColor = badgeStyle === 'dark_badge' ? '#E2E8F0' : isTransparent ? '#FFFFFF' : '#1E293B';
    const beColor = '#E1251B'; // Authentic Bali Express Red

    ctx.textAlign = 'center';
    const centerX = innerX + logoInnerWidth / 2;

    // 1. "Jawa Pos Group" serif headline
    ctx.font = `600 ${jpFontSize}px "Times New Roman", Times, Georgia, serif`;
    ctx.fillStyle = jpColor;
    ctx.textBaseline = 'top';
    ctx.fillText('Jawa Pos Group', centerX, innerY);

    // 2. "BALI EXPRESS" bold italic red brand name
    ctx.font = `italic 900 ${beFontSize}px "Montserrat", "Arial Black", Impact, sans-serif`;
    ctx.fillStyle = beColor;
    ctx.textBaseline = 'bottom';
    ctx.fillText('BALI EXPRESS', centerX, innerY + logoInnerHeight + 3);
  }

  ctx.restore();
}

/**
 * Draws the Social Media Footer Bar at the Bottom
 */
function drawSocialMediaFooter(
  ctx: CanvasRenderingContext2D,
  config: ThumbnailConfig
) {
  if (config.showSocialMedia === false) return;

  const footerHeight = 56;
  const footerY = CANVAS_HEIGHT - footerHeight;
  const handle = config.socialHandle?.trim() || 'koranbaliexpress';
  const socialStyle = config.socialStyle || 'sleek_bar';

  ctx.save();

  if (socialStyle === 'sleek_bar') {
    // Sleek Dark Bottom Bar with subtle divider line
    ctx.fillStyle = 'rgba(0, 0, 0, 0.92)';
    ctx.fillRect(0, footerY, CANVAS_WIDTH, footerHeight);

    // Top hairline accent
    ctx.fillStyle = 'rgba(255, 255, 255, 0.14)';
    ctx.fillRect(0, footerY, CANVAS_WIDTH, 1.5);
  } else if (socialStyle === 'badge_pill') {
    // Floating Pill Container
    const pillH = 42;
    const pillY = footerY + 7;
    const pillW = 440;
    const pillX = 48;

    ctx.fillStyle = 'rgba(15, 23, 42, 0.95)';
    ctx.beginPath();
    ctx.roundRect
      ? ctx.roundRect(pillX, pillY, pillW, pillH, 21)
      : ctx.rect(pillX, pillY, pillW, pillH);
    ctx.fill();

    ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
    ctx.lineWidth = 1;
    ctx.stroke();
  }

  const iconSize = 28;
  const iconSpacing = 8;
  const startX = 48;
  let currentX = startX;
  const centerY = footerY + footerHeight / 2;

  // 1. TikTok Icon
  if (config.showTikTok !== false) {
    drawTikTokBadge(ctx, currentX + iconSize / 2, centerY, iconSize);
    currentX += iconSize + iconSpacing;
  }

  // 2. Facebook Icon
  if (config.showFacebook !== false) {
    drawFacebookBadge(ctx, currentX + iconSize / 2, centerY, iconSize);
    currentX += iconSize + iconSpacing;
  }

  // 3. Instagram Icon
  if (config.showInstagram !== false) {
    drawInstagramBadge(ctx, currentX + iconSize / 2, centerY, iconSize);
    currentX += iconSize + iconSpacing;
  }

  // Spacing before handle name
  currentX += 8;

  // Social Handle Name: "koranbaliexpress"
  ctx.font = '700 22px "Montserrat", "Inter", sans-serif';
  ctx.fillStyle = '#FFFFFF';
  ctx.textAlign = 'left';
  ctx.textBaseline = 'middle';
  ctx.fillText(handle, currentX, centerY);

  // Right side portal branding: baliexpress.jawapos.com
  ctx.font = '600 18px "Inter", sans-serif';
  ctx.fillStyle = '#94A3B8';
  ctx.textAlign = 'right';
  ctx.textBaseline = 'middle';
  ctx.fillText('baliexpress.jawapos.com', CANVAS_WIDTH - 48, centerY);

  ctx.restore();
}

/**
 * Calculates optimal font size and word wrapping to guarantee text fits
 * perfectly within the available headline bounding box without truncation.
 */
function fitHeadlineText(
  ctx: CanvasRenderingContext2D,
  text: string,
  maxWidth: number,
  maxHeight: number,
  fontFamily: string,
  textTransform: 'none' | 'uppercase' = 'none',
  hasTextHighlight: boolean = true
): WrappedTextResult {
  const processedText = textTransform === 'uppercase' ? text.toUpperCase() : text;
  const words = processedText.trim().split(/\s+/);

  // Leave space for padding around red text boxes
  const effectiveMaxWidth = hasTextHighlight ? maxWidth - 40 : maxWidth;

  // Iteratively try font sizes from 80px down to 32px
  let bestFit: WrappedTextResult = {
    lines: [processedText],
    fontSize: 48,
    lineHeight: 64,
    totalTextHeight: 64,
  };

  const minFontSize = 30;
  const maxFontSize = 80;

  for (let fontSize = maxFontSize; fontSize >= minFontSize; fontSize -= 2) {
    const lineSpacingMultiplier = hasTextHighlight ? 1.38 : 1.25;
    const lineHeight = Math.round(fontSize * lineSpacingMultiplier);
    ctx.font = `800 ${fontSize}px "${fontFamily}", Inter, system-ui, -apple-system, sans-serif`;

    const lines: string[] = [];
    let currentLine = '';

    for (let i = 0; i < words.length; i++) {
      const word = words[i];
      const testLine = currentLine ? `${currentLine} ${word}` : word;
      const testWidth = ctx.measureText(testLine).width;

      if (testWidth <= effectiveMaxWidth) {
        currentLine = testLine;
      } else {
        if (currentLine) {
          lines.push(currentLine);
          currentLine = word;
        } else {
          // A single word is wider than effectiveMaxWidth, let it wrap
          lines.push(word);
          currentLine = '';
        }
      }
    }
    if (currentLine) {
      lines.push(currentLine);
    }

    const totalHeight = lines.length * lineHeight;

    // Check if it fits vertically and within maximum recommended lines (1 to 5 lines)
    if (totalHeight <= maxHeight && lines.length <= 5) {
      bestFit = {
        lines,
        fontSize,
        lineHeight,
        totalTextHeight: totalHeight,
      };
      break;
    }
  }

  return bestFit;
}

/**
 * Main rendering function for the 1080x1350 Canvas
 */
export async function renderThumbnail(
  canvas: HTMLCanvasElement,
  config: ThumbnailConfig,
  loadedImg?: HTMLImageElement | null
): Promise<void> {
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  // Set explicit dimensions
  canvas.width = CANVAS_WIDTH;
  canvas.height = CANVAS_HEIGHT;

  // Clear canvas
  ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

  // Background fallback
  ctx.fillStyle = '#0F172A';
  ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

  // Calculate layout geometry
  const headlineRatio = Math.max(0.20, Math.min(0.40, config.headlineHeightRatio || 0.30));
  const headlineHeight = Math.round(CANVAS_HEIGHT * headlineRatio);
  const photoHeight = CANVAS_HEIGHT - headlineHeight;
  const photoBottomY = photoHeight;

  // 1. Draw Image Layer
  let img = loadedImg;
  if (!img && config.imageSrc) {
    try {
      img = await loadImage(config.imageSrc);
    } catch {
      // ignore, fallback drawing
    }
  }

  if (img && img.complete && img.naturalWidth > 0) {
    ctx.save();
    
    // Create clipping region for photo area
    ctx.beginPath();
    ctx.rect(0, 0, CANVAS_WIDTH, photoHeight + 10);
    ctx.clip();

    // Calculate free pan & zoom positioning
    const imgWidth = img.naturalWidth || img.width;
    const imgHeight = img.naturalHeight || img.height;

    const zoom = Math.max(0.5, Math.min(4.0, config.imageZoom || 1.0));
    const baseScale = Math.max(CANVAS_WIDTH / imgWidth, photoHeight / imgHeight);
    const scale = baseScale * zoom;
    
    const scaledWidth = imgWidth * scale;
    const scaledHeight = imgHeight * scale;

    const baseX = (CANVAS_WIDTH - scaledWidth) / 2;
    const baseY = (photoHeight - scaledHeight) / 2;

    const drawX = baseX + (config.imageOffsetX || 0);
    const drawY = baseY + (config.imageOffsetY || 0);

    ctx.filter = 'none';
    ctx.drawImage(img, drawX, drawY, scaledWidth, scaledHeight);

    ctx.restore();
  } else {
    // Placeholder background when no image
    ctx.fillStyle = '#1E293B';
    ctx.fillRect(0, 0, CANVAS_WIDTH, photoHeight);

    ctx.fillStyle = '#64748B';
    ctx.font = '600 32px Inter, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('Unggah Foto Utama Berita', CANVAS_WIDTH / 2, photoHeight / 2 - 20);
    ctx.font = '400 22px Inter, sans-serif';
    ctx.fillStyle = '#94A3B8';
    ctx.fillText('Format JPG, PNG, atau WEBP', CANVAS_WIDTH / 2, photoHeight / 2 + 25);
  }

  // 2. Draw Black Transition Gradient (if enabled)
  if (config.showBlackGradient) {
    const gradientHeight = Math.min(photoHeight * 0.75, 480);
    const gradStartY = photoBottomY - gradientHeight;
    const intensity = Math.min(1.0, Math.max(0.2, config.gradientIntensity ?? 0.95));

    const gradient = ctx.createLinearGradient(0, gradStartY, 0, photoBottomY);
    gradient.addColorStop(0, 'rgba(0, 0, 0, 0)');
    gradient.addColorStop(0.35, `rgba(0, 0, 0, ${intensity * 0.28})`);
    gradient.addColorStop(0.70, `rgba(0, 0, 0, ${intensity * 0.72})`);
    gradient.addColorStop(1, `rgba(0, 0, 0, ${intensity})`);

    ctx.fillStyle = gradient;
    ctx.fillRect(0, gradStartY, CANVAS_WIDTH, gradientHeight + 5);
  }

  // 2B. Draw Bali Express Logo in Top-Left Corner (Pojok Kiri Atas)
  if (config.showLogo !== false) {
    await drawLogoLayer(ctx, config);
  }

  // 3. Draw Headline Bottom Banner (Hitam / Black background)
  const bannerY = photoBottomY;
  ctx.fillStyle = config.headlineBgColor || '#000000';
  ctx.fillRect(0, bannerY, CANVAS_WIDTH, headlineHeight);

  // 4. Draw Red Divider Line (if enabled)
  if (config.showRedDivider) {
    const dividerThickness = Math.max(4, Math.min(20, config.dividerThickness || 8));
    ctx.fillStyle = config.dividerColor || '#FF3B30';
    ctx.fillRect(0, bannerY, CANVAS_WIDTH, dividerThickness);
  }

  // 5. Draw Headline Content (Badge + Red Text Background Box + White Headline)
  const paddingX = 48;
  const paddingY = 32;
  const contentWidth = CANVAS_WIDTH - paddingX * 2;
  
  // Reserve space for bottom social media bar so text never overlaps
  const hasSocialFooter = config.showSocialMedia !== false;
  const socialFooterSpace = hasSocialFooter ? 62 : 0;

  let currentY = bannerY + paddingY;
  let remainingHeight = headlineHeight - paddingY * 2 - socialFooterSpace;

  // Draw optional category/breaking badge
  if (config.showBadge && config.badgeText && config.badgeText.trim().length > 0) {
    const badgeText = config.badgeText.trim().toUpperCase();
    const badgeFont = '800 22px Inter, sans-serif';
    ctx.font = badgeFont;
    const badgeMetrics = ctx.measureText(badgeText);
    const badgePadX = 16;
    const badgeHeight = 34;
    const badgeWidth = badgeMetrics.width + badgePadX * 2;

    // Badge Background (Solid red or dark accent)
    ctx.fillStyle = config.badgeBgColor || '#D90000';
    ctx.beginPath();
    ctx.roundRect(paddingX, currentY, badgeWidth, badgeHeight, 6);
    ctx.fill();

    // Badge Text
    ctx.fillStyle = config.badgeTextColor || '#FFFFFF';
    ctx.font = badgeFont;
    ctx.textAlign = 'left';
    ctx.textBaseline = 'middle';
    ctx.fillText(badgeText, paddingX + badgePadX, currentY + badgeHeight / 2);

    const spaceAfterBadge = 16;
    currentY += badgeHeight + spaceAfterBadge;
    remainingHeight -= (badgeHeight + spaceAfterBadge);
  }

  // Auto-fit Headline Text
  const isHighlightActive = config.showTextHighlight !== false && config.textHighlightStyle !== 'none';
  const headlineText = config.headline.trim() || 'Masukkan Judul Berita Utama';
  const textFitting = fitHeadlineText(
    ctx,
    headlineText,
    contentWidth,
    remainingHeight,
    config.fontFamily || 'Inter',
    config.textTransform || 'uppercase',
    isHighlightActive
  );

  const fontSize = textFitting.fontSize;
  ctx.font = `800 ${fontSize}px "${config.fontFamily}", Inter, system-ui, -apple-system, sans-serif`;

  const redBgColor = config.textHighlightBgColor || '#D90000';
  const textColor = config.headlineTextColor || '#FFFFFF';

  // 5A. Render Red Background Boxes behind Text
  if (isHighlightActive) {
    const padX = Math.round(fontSize * 0.24);
    const padY = Math.round(fontSize * 0.12);
    const boxHeight = Math.round(fontSize * 1.30);

    if (config.textHighlightStyle === 'block_box') {
      // Solid block behind entire paragraph
      let maxWidth = 0;
      for (const line of textFitting.lines) {
        const w = ctx.measureText(line).width;
        if (w > maxWidth) maxWidth = w;
      }
      const totalBlockWidth = Math.min(contentWidth, maxWidth + padX * 2 + 10);
      const totalBlockHeight = (textFitting.lines.length - 1) * textFitting.lineHeight + boxHeight;

      ctx.fillStyle = redBgColor;
      ctx.beginPath();
      ctx.roundRect(paddingX, currentY - 2, totalBlockWidth, totalBlockHeight, 8);
      ctx.fill();

      // Render White Text on block
      ctx.fillStyle = textColor;
      ctx.textAlign = 'left';
      ctx.textBaseline = 'top';
      for (let i = 0; i < textFitting.lines.length; i++) {
        const lineY = currentY + i * textFitting.lineHeight;
        ctx.fillText(textFitting.lines[i], paddingX + padX, lineY + (boxHeight - fontSize) / 2 - 2);
      }
    } else {
      // Default 'line_box': Individual red ribbon boxes for each line of text
      for (let i = 0; i < textFitting.lines.length; i++) {
        const line = textFitting.lines[i];
        const lineMetrics = ctx.measureText(line);
        const boxWidth = Math.min(contentWidth, lineMetrics.width + padX * 2);
        const lineY = currentY + i * textFitting.lineHeight;
        const boxY = lineY - (boxHeight - fontSize) / 2 + 2;

        // Draw red box ribbon for this line
        ctx.fillStyle = redBgColor;
        ctx.beginPath();
        ctx.roundRect(paddingX, boxY, boxWidth, boxHeight, 6);
        ctx.fill();

        // Draw crisp white text
        ctx.fillStyle = textColor;
        ctx.textAlign = 'left';
        ctx.textBaseline = 'top';
        ctx.fillText(line, paddingX + padX, lineY + 2);
      }
    }
  } else {
    // Normal text rendering without highlight
    ctx.fillStyle = textColor;
    ctx.textAlign = 'left';
    ctx.textBaseline = 'top';

    // Text shadow for contrast
    ctx.shadowColor = 'rgba(0, 0, 0, 0.6)';
    ctx.shadowBlur = 8;
    ctx.shadowOffsetX = 0;
    ctx.shadowOffsetY = 3;

    for (let i = 0; i < textFitting.lines.length; i++) {
      const lineY = currentY + i * textFitting.lineHeight;
      ctx.fillText(textFitting.lines[i], paddingX, lineY);
    }

    ctx.shadowColor = 'transparent';
    ctx.shadowBlur = 0;
  }

  // 6. Draw Social Media Footer Bar at the Bottom
  if (config.showSocialMedia !== false) {
    drawSocialMediaFooter(ctx, config);
  }
}

/**
 * Clean filename helper from headline
 */
export function generateFilename(headline: string): string {
  if (!headline || !headline.trim()) {
    return 'thumbnail-berita-1080x1350.png';
  }
  const clean = headline
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 50);

  return clean ? `thumbnail-${clean}-1080x1350.png` : 'thumbnail-berita-1080x1350.png';
}

/**
 * Downloads the canvas as high-resolution PNG
 */
export function exportCanvasAsPNG(canvas: HTMLCanvasElement, headline: string): void {
  const filename = generateFilename(headline);
  const dataUrl = canvas.toDataURL('image/png', 1.0);
  
  const link = document.createElement('a');
  link.download = filename;
  link.href = dataUrl;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

/**
 * Copies the canvas image directly to clipboard
 */
export async function copyCanvasToClipboard(canvas: HTMLCanvasElement): Promise<boolean> {
  try {
    const blob = await new Promise<Blob | null>((resolve) =>
      canvas.toBlob((b) => resolve(b), 'image/png', 1.0)
    );
    if (!blob) return false;

    if (navigator.clipboard && navigator.clipboard.write) {
      await navigator.clipboard.write([
        new ClipboardItem({
          'image/png': blob,
        }),
      ]);
      return true;
    }
    return false;
  } catch (err) {
    console.error('Clipboard copy failed:', err);
    return false;
  }
}
