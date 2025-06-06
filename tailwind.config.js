import colors from './src/config/colors';
import fontSize from './src/config/fontSize';
import defaultTheme from 'tailwindcss/defaultTheme';

/** @type {import('tailwindcss').Config} */
export default {
    content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
    theme: {
        colors,
        fontSize,
        fontFamily: {
            determination: ['determination'],
            jetbrains: ['JetBrains Mono', ...defaultTheme.fontFamily.mono]
        },
        screens: {
            xxs: "390px",
            // => @media (min-width: 400px) { ... }

            xs: "480px",
            // => @media (min-width: 480px) { ... }
      
            sm: "640px",
            // => @media (min-width: 640px) { ... }
      
            md: "768px",
            // => @media (min-width: 768px) { ... }
      
            lg: "1024px",
            // => @media (min-width: 1024px) { ... }
      
            xl: "1280px",
            // => @media (min-width: 1280px) { ... }
      
            "2xl": "1536px",
            // => @media (min-width: 1536px) { ... }
          },
        extend: {
            boxShadow: {
                sm: '0px 0px 14px 0px rgba(0, 87, 255, 0.30)',
                task: '4px 4px 0px 0px #2B2B37',
                copy: '0px 4px 19px 0px rgba(255, 7, 107, 0.30)',
                feed: '0px 1px 19px 0px #3BD9751F',
                tab: "0px 0px 4px 0px #FFF"
            },
            listStyleType: {
                square: 'square',
                roman: 'upper-roman'
            },
            screens: {
                tall: { raw: '(min-height: 688px)' }
            },
            borderWidth: {
                0.5: '0.5px'
            },
            ringWidth: {
                0.5: '0.5px'
            },
            animation: {
                'bounce-right': 'bounceRight'
            },
            keyframes: {
                bounceRight: {
                    '0%,20%,50%,80%,100%': {
                        // - ms - transform: translateX(0);
                        transform: 'translateX(0)'
                    },
                    '40%': {
                        transform: 'translateX(-6px)'
                    },
                    '60%': {
                        transform: 'translateX(-3px)'
                    }
                }
            }
        }
    },
    plugins: []
};
// @keyframes bounceRight {
//   0%,
//   20%,
//   50%,
//   80%,
//   100% {
//     -ms-transform: translateX(0);
//     transform: translateX(0);
//   }
//   40% {
//     -ms-transform: translateX(-30px);
//     transform: translateX(-30px);
//   }
//   60% {
//     -ms-transform: translateX(-15px);
//     transform: translateX(-15px);
//   }
// }
