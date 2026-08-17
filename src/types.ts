export type StylePresetId = 'breaking' | 'clean' | 'dramatic' | 'custom';

export type TextHighlightStyle = 'line_box' | 'block_box' | 'none';

export interface StylePreset {
  id: StylePresetId;
  name: string;
  badge: string;
  description: string;
  headlineBgColor: string; // Background area judul (e.g. Hitam)
  headlineTextColor: string; // Teks judul (e.g. Putih)
  textHighlightBgColor: string; // Background merah pada tulisan paragraph judul
  textHighlightStyle: TextHighlightStyle;
  showTextHighlight: boolean;
  dividerColor: string;
  dividerThickness: number;
  showRedDivider: boolean;
  showBlackGradient: boolean;
  gradientIntensity: number; // 0 to 1
  fontFamily: 'Inter' | 'Montserrat' | 'Oswald' | 'Arial';
  textTransform: 'none' | 'uppercase';
  headlineHeightRatio: number; // ratio of canvas height, e.g. 0.28
  badgeText: string;
  showBadge: boolean;
}

export type LogoBadgeStyle = 'white_badge' | 'dark_badge' | 'transparent';
export type SocialFooterStyle = 'sleek_bar' | 'badge_pill' | 'minimal';

export interface ThumbnailConfig {
  headline: string;
  imageSrc: string | null;
  imageFileName: string | null;
  stylePreset: StylePresetId;
  showRedDivider: boolean;
  dividerColor: string;
  dividerThickness: number;
  showBlackGradient: boolean;
  gradientIntensity: number;
  headlineBgColor: string; // Background area judul (Hitam)
  headlineTextColor: string; // Warna teks (Putih)
  textHighlightBgColor: string; // Background merah pada tulisan paragraph judul
  textHighlightStyle: TextHighlightStyle;
  showTextHighlight: boolean;
  headlineHeightRatio: number;
  fontFamily: 'Inter' | 'Montserrat' | 'Oswald' | 'Arial';
  textTransform: 'none' | 'uppercase';
  imageOffsetX: number; // Geser manual horizontal foto (-500 to 500 px)
  imageOffsetY: number; // Geser manual vertikal foto (-500 to 500 px)
  imageZoom: number; // Skala zoom manual (0.8 - 3.5)
  showBadge: boolean;
  badgeText: string;
  badgeBgColor: string;
  badgeTextColor: string;
  
  // Logo Bali Express (Pojok Kiri Atas)
  showLogo: boolean;
  logoSrc: string | null;
  logoBadgeStyle: LogoBadgeStyle;
  logoSize: number; // Lebar logo dalam pixel canvas (180 - 360 px)
  logoOffsetX: number;
  logoOffsetY: number;

  // Social Media Bar (Bagian Bawah)
  showSocialMedia: boolean;
  socialHandle: string; // default: "koranbaliexpress"
  showTikTok: boolean;
  showFacebook: boolean;
  showInstagram: boolean;
  socialStyle: SocialFooterStyle;
}

export interface SampleNewsItem {
  id: string;
  title: string;
  category: string;
  imageSrc?: string | null;
  imageCaption?: string;
  preset: StylePresetId;
}
