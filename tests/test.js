const wdio = require("webdriverio");
const assert = require("chai").assert;
const expect = require("chai").expect;
const config = require("../helpers/desiredCapabilities");
const sendIncorrectAnswer = require("../helpers/sendIncorrectAnswer").func;
const startQuiz = require("../helpers/startQuiz").func;
const startMemorizer = require("../helpers/startMemorizer").func;

describe("Integration tests", function () {
    this.timeout(50000);
    let client;

    beforeEach(async function () {
        client = await wdio.remote(config.desiredCapabilities);
    });

    afterEach(async function () {
        return await client.deleteSession();
    });

    it("native keyboard should appear when new quiz is started", async function () {
        // Wair for Splash Screen to dissapear
        await client.setImplicitTimeout(50000);

        await startQuiz(client);

        // Wait first kana element to load so keyboard has time to appear
        await client.findElement(
            "xpath",
            "/hierarchy/android.widget.FrameLayout/android.widget.LinearLayout/android.widget.FrameLayout/android.widget.LinearLayout/android.widget.FrameLayout/android.widget.FrameLayout/android.widget.FrameLayout/android.widget.FrameLayout/android.view.ViewGroup/android.view.ViewGroup/android.view.ViewGroup/android.view.ViewGroup[2]/android.view.ViewGroup[2]/android.view.ViewGroup/android.view.ViewGroup/android.view.ViewGroup[2]/android.view.ViewGroup/android.view.ViewGroup[2]/android.view.ViewGroup/android.view.ViewGroup/android.widget.TextView"
        );

        let keyboardShown = await client.isKeyboardShown();

        expect(keyboardShown).to.be.true;
        // or assert.equal(keyboardShown, true);
    });

    it("kana counter should be 46 when Katakana radio button is selected", async function () {
        // Wair for Splash Screen to dissapear
        await client.setImplicitTimeout(50000);

        await startMemorizer(client);

        const katakanaRadioBtn = await client.findElement(
            "xpath",
            '//android.view.ViewGroup[@content-desc="radioButtonInput1"]'
        );

        await client.elementClick(katakanaRadioBtn.ELEMENT);

        const kanaNumber = await client.findElement(
            "xpath",
            "/hierarchy/android.widget.FrameLayout/android.widget.LinearLayout/android.widget.FrameLayout/android.widget.LinearLayout/android.widget.FrameLayout/android.widget.FrameLayout/android.widget.FrameLayout/android.widget.FrameLayout/android.view.ViewGroup/android.view.ViewGroup/android.view.ViewGroup/android.view.ViewGroup/android.view.ViewGroup[2]/android.view.ViewGroup/android.view.ViewGroup/android.view.ViewGroup[2]/android.view.ViewGroup[2]/android.view.ViewGroup/android.widget.TextView[5]"
        );

        const numberK = await client.getElementText(kanaNumber.ELEMENT);

        expect(numberK).to.be.equal("46");
        // or assert.equal(numberK, 46);
    });

    it("feedback text should be 'Incorrect!' when incorrect answer given", async function () {
        // Wair for Splash Screen to dissapear
        await client.setImplicitTimeout(50000);

        await startQuiz(client);

        const textField = await client.findElement(
            "xpath",
            "/hierarchy/android.widget.FrameLayout/android.widget.LinearLayout/android.widget.FrameLayout/android.widget.LinearLayout/android.widget.FrameLayout/android.widget.FrameLayout/android.widget.FrameLayout/android.widget.FrameLayout/android.view.ViewGroup/android.view.ViewGroup/android.view.ViewGroup/android.view.ViewGroup[2]/android.view.ViewGroup[2]/android.view.ViewGroup/android.view.ViewGroup/android.view.ViewGroup[2]/android.view.ViewGroup/android.view.ViewGroup[2]/android.view.ViewGroup/android.view.ViewGroup/android.widget.EditText"
        );

        await client.elementClick(textField.ELEMENT);

        // enter incorrect answer "asd"
        await client.pressKeyCode(29);
        await client.pressKeyCode(47);
        await client.pressKeyCode(32);

        // press "Enter"
        await client.pressKeyCode(66);

        const feedback = await client.findElement(
            "xpath",
            "/hierarchy/android.widget.FrameLayout/android.widget.LinearLayout/android.widget.FrameLayout/android.widget.LinearLayout/android.widget.FrameLayout/android.widget.FrameLayout/android.widget.FrameLayout/android.widget.FrameLayout/android.view.ViewGroup/android.view.ViewGroup/android.view.ViewGroup/android.view.ViewGroup[2]/android.view.ViewGroup[2]/android.view.ViewGroup/android.view.ViewGroup/android.view.ViewGroup[2]/android.view.ViewGroup/android.view.ViewGroup[1]/android.view.ViewGroup/android.widget.TextView"
        );

        const feedbackText = await client.getElementText(feedback.ELEMENT);

        expect(feedbackText).to.be.equal("Incorrect!");
    });

    it("should fail the test with 0% correctness when failed all questons", async function () {
        // Wair for Splash Screen to dissapear
        await client.setImplicitTimeout(50000);

        await startQuiz(client);

        for (let i = 0; i < 3; i++) {
            await sendIncorrectAnswer(client);
        }

        const finishBtn = await client.findElement(
            "xpath",
            "/hierarchy/android.widget.FrameLayout/android.widget.LinearLayout/android.widget.FrameLayout/android.widget.LinearLayout/android.widget.FrameLayout/android.widget.FrameLayout/android.widget.FrameLayout/android.widget.FrameLayout/android.view.ViewGroup/android.view.ViewGroup/android.view.ViewGroup/android.view.ViewGroup[2]/android.view.ViewGroup[2]/android.view.ViewGroup/android.view.ViewGroup/android.view.ViewGroup[2]/android.view.ViewGroup/android.view.ViewGroup[1]/android.widget.Button/android.widget.TextView"
        );

        await client.elementClick(finishBtn.ELEMENT);

        const percentageAnswers = await client.findElement(
            "xpath",
            "/hierarchy/android.widget.FrameLayout/android.widget.LinearLayout/android.widget.FrameLayout/android.widget.LinearLayout/android.widget.FrameLayout/android.widget.FrameLayout/android.widget.FrameLayout/android.widget.FrameLayout/android.view.ViewGroup/android.view.ViewGroup/android.view.ViewGroup/android.view.ViewGroup[2]/android.view.ViewGroup[2]/android.view.ViewGroup/android.view.ViewGroup/android.view.ViewGroup[2]/android.view.ViewGroup/android.view.ViewGroup[1]/android.view.ViewGroup/android.view.ViewGroup/android.view.ViewGroup[3]/android.widget.TextView"
        );

        const percentage = await client.getElementText(
            percentageAnswers.ELEMENT
        );

        expect(percentage).to.be.equal("0.00%");
    });
});
