// babel.config.js
module.exports = function (api) {
    api.cache(true);
    return {
        presets: [
            // preset Expo + indicazione a NativeWind per il JSX
            ["babel-preset-expo", { jsxImportSource: "nativewind" }],
            // NativeWind come *preset*, non come plugin
            "nativewind/babel",
        ],
    };
};
