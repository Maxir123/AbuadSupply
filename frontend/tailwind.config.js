/** @type {import('tailwindcss').Config} */
module.exports = {
    darkMode: ["class"],
    content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
  	fontFamily: {
  		Roboto: [
  			'Roboto',
  			'sans-serif'
  		],
  		Poppins: [
  			'Poppins',
  			'sans-serif'
  		]
  	},
  	extend: {
  		screens: {
  			lg990: '990px',
  			'1000px': '1050px',
  			'1100px': '1110px',
  			'800px': '800px',
  			'1300px': '1300px',
  			'400px': '400px'
  		},
  		backgroundImage: {
  			'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
  			'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))'
  		},
  		borderRadius: {
  			lg: 'var(--radius)',
  			md: 'calc(var(--radius) - 2px)',
  			sm: 'calc(var(--radius) - 4px)'
  		},
  		colors: {}
  	}
  },
  plugins: [require("tailwindcss-animate")],
};
