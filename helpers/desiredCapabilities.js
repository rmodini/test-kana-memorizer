exports.desiredCapabilities = {
    host: "localhost",
    port: 4723,
    path: "/wd/hub",
    capabilities: {
        deviceName: "emulator-5554",
        platformName: "android",
        appPackage: "com.ramusoft.learnjapanesekana",
        appActivity: "host.exp.exponent.MainActivity",
        noReset: true,
        automationName: "uiautomator2",
        avdReadyTimeout: "20000",
    },
};
