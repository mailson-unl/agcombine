/**
 * University of Nebraska-Lincoln Official Brand Theme
 * Compliant with UNL Visual Identity Standards
 * 
 * IMPORTANT: 
 * - Scarlet must always be used at 100% opacity - no tints/transparency
 * - Accent colors are for charts/infographics only - not dominant in layouts
 * - Only use official logos - no modifications allowed
 */

// UNL Primary Brand Colors
export const UNL_COLORS = {
  // Primary Colors
  scarlet: '#D00000',        // Must always be at 100% - no tints/transparency
  cream: '#F5F1E7',
  creamLight: '#FEFDFA',     // Digital only
  gray: '#C7C8CA',
  
  // Accent Colors (for charts/infographics only)
  navy: '#001226',
  cerulean: '#249AB5',
  green: '#BCCB2A',
  orange: '#F58A1F',
  lapis: '#005D84',
  yellow: '#FFD74F',
  purple: '#A5228D',
} as const;

// UNL Typography
export const UNL_FONTS = {
  // Primary Sans: Work Sans
  primary: '"Work Sans", system-ui, sans-serif',
  // Primary Serif: Source Serif 4  
  serif: '"Source Serif 4", Georgia, serif',
  // Narrow/Condensed: Oswald
  condensed: '"Oswald", "Arial Narrow", sans-serif',
  // Display: Liberator (if available)
  display: '"Liberator", Impact, sans-serif',
} as const;

// UNL Brand Guidelines
export const UNL_BRAND = {
  // Logo spacing requirements
  logoMinClearSpace: '1.5rem',
  
  // Color usage rules
  usageRules: {
    scarletOnly100Percent: true,
    accentColorsChartsOnly: true,
    maintainContrast: true,
  },
  
  // Typography hierarchy
  typography: {
    body: UNL_FONTS.primary,
    longForm: UNL_FONTS.serif,
    labels: UNL_FONTS.condensed,
    headlines: UNL_FONTS.condensed,
    display: UNL_FONTS.display,
  },
} as const;

// UNL Component Styles (for consistent application)
export const UNL_COMPONENT_STYLES = {
  // Primary CTA Button
  primaryButton: {
    backgroundColor: UNL_COLORS.scarlet,
    color: 'white',
    borderRadius: '0.375rem',
    padding: '0.75rem 1.5rem',
    fontFamily: UNL_FONTS.primary,
    fontWeight: '600',
    boxShadow: '0 4px 6px -1px rgba(208, 0, 0, 0.1)',
    hover: {
      boxShadow: '0 10px 15px -3px rgba(208, 0, 0, 0.2)',
    },
  },
  
  // Secondary Button
  secondaryButton: {
    backgroundColor: 'white',
    color: UNL_COLORS.scarlet,
    border: `2px solid ${UNL_COLORS.scarlet}`,
    borderRadius: '0.375rem',
    padding: '0.75rem 1.5rem',
    fontFamily: UNL_FONTS.primary,
    fontWeight: '600',
  },
  
  // Links
  link: {
    color: UNL_COLORS.scarlet,
    textDecoration: 'underline',
    fontFamily: UNL_FONTS.primary,
  },
  
  // Headers
  header: {
    backgroundColor: UNL_COLORS.scarlet,
    color: 'white',
    fontFamily: UNL_FONTS.primary,
  },
  
  // Cards
  card: {
    backgroundColor: 'white',
    border: `1px solid ${UNL_COLORS.gray}`,
    borderRadius: '0.5rem',
    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
  },
} as const;

// CSS Custom Properties for UNL Theme
export const UNL_CSS_VARIABLES = `
  :root {
    /* UNL Brand Colors */
    --unl-scarlet: ${UNL_COLORS.scarlet};
    --unl-cream: ${UNL_COLORS.cream};
    --unl-cream-light: ${UNL_COLORS.creamLight};
    --unl-gray: ${UNL_COLORS.gray};
    
    /* UNL Accent Colors */
    --unl-navy: ${UNL_COLORS.navy};
    --unl-cerulean: ${UNL_COLORS.cerulean};
    --unl-green: ${UNL_COLORS.green};
    --unl-orange: ${UNL_COLORS.orange};
    --unl-lapis: ${UNL_COLORS.lapis};
    --unl-yellow: ${UNL_COLORS.yellow};
    --unl-purple: ${UNL_COLORS.purple};
    
    /* UNL Typography */
    --unl-font-primary: ${UNL_FONTS.primary};
    --unl-font-serif: ${UNL_FONTS.serif};
    --unl-font-condensed: ${UNL_FONTS.condensed};
    --unl-font-display: ${UNL_FONTS.display};
  }
`;

// Utility function to get Google Fonts URL
export const getGoogleFontsURL = () => {
  const fonts = [
    'Work+Sans:wght@300;400;500;600;700',
    'Source+Serif+4:wght@400;500;600;700',
    'Oswald:wght@300;400;500;600;700',
  ];
  
  return `https://fonts.googleapis.com/css2?${fonts.map(font => `family=${font}`).join('&')}&display=swap`;
};

// Accessibility compliance helpers
export const UNL_ACCESSIBILITY = {
  // WCAG 2.1 AA compliant contrast ratios
  contrastRatios: {
    normal: 4.5,
    large: 3.0,
  },
  
  // Validated color combinations
  validCombinations: [
    { background: 'white', text: UNL_COLORS.scarlet },
    { background: UNL_COLORS.scarlet, text: 'white' },
    { background: UNL_COLORS.cream, text: UNL_COLORS.scarlet },
    { background: UNL_COLORS.creamLight, text: UNL_COLORS.scarlet },
  ],
} as const;

export default {
  colors: UNL_COLORS,
  fonts: UNL_FONTS,
  brand: UNL_BRAND,
  components: UNL_COMPONENT_STYLES,
  cssVariables: UNL_CSS_VARIABLES,
  googleFontsURL: getGoogleFontsURL(),
  accessibility: UNL_ACCESSIBILITY,
};