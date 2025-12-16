/** @type {import('tailwindcss').Config} */
module.exports = {
    // adattalo alle tue cartelle (App + src)
    content: ["./App.{js,jsx,ts,tsx}", "./src/**/*.{js,jsx,ts,tsx}"],
    // preset di NativeWind
    presets: [require("nativewind/preset")],
    theme: {
        extend: {
            fontFamily: {
                sans: ["Inter_400Regular"],
                sansMedium: ["Inter_500Medium"],
                sansSemibold: ["Inter_600Semibold"],
                sansBold: ["Inter_700Bold"],
            },
            colors: {
                auth: {
                    bg: "#F7F7F7", // sfondo schermata auth
                    form: "#EBEBEB", // sfondo form
                },
                text: {
                    main: "#121212", // testo principale
                    light: "#868686", // placeholder, link non attivi
                },
                brand: {
                    primary: "#A76D99", // pulsanti principali, link attivi
                    darker: "#5E134C",
                    accent: "#FFA500", // colore alternativo (es. pulsanti secondari)
                },
            },
        },
    },
    plugins: [],
};
