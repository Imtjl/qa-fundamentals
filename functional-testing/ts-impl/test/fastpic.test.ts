import { Builder, By, until, WebDriver, WebElement } from 'selenium-webdriver';
import * as chrome from 'selenium-webdriver/chrome';
import * as firefox from 'selenium-webdriver/firefox';
import * as edge from 'selenium-webdriver/edge';
import { assert } from 'chai';
import * as path from 'path';

const BASE_URL = 'https://fastpic.org';
const DEFAULT_TIMEOUT = 10000;

const DOCS_BASE_PATH = path.join(__dirname, '../../', 'docs');
const IMAGE_PATHS = {
    JPG: path.join(DOCS_BASE_PATH, 'test.jpg'),
    PNG: path.join(DOCS_BASE_PATH, 'test.png'),
    GIF: path.join(DOCS_BASE_PATH, 'test.gif'),
    LARGE: path.join(DOCS_BASE_PATH, 'large.jpg')
};

class FastPicTest {
    private driver: WebDriver;

    constructor(driver: WebDriver) {
        this.driver = driver;
    }

    async findByXPath(xpath: string, timeout: number = DEFAULT_TIMEOUT): Promise<WebElement> {
        return this.driver.wait(until.elementLocated(By.xpath(xpath)), timeout);
    }

    async testMainPage() {
        await this.driver.get(BASE_URL);

        const title = await this.driver.getTitle();
        assert.include(title, 'FastPic', 'Заголовок страницы должен содержать FastPic');

        const fileInput = await this.findByXPath("//input[@type='file']");
        assert.isTrue(await fileInput.isDisplayed(), 'Элемент загрузки файла должен быть видим');

        const uploadSettings = await this.findByXPath("//div[contains(@class, 'upload_settings')]");
        assert.isTrue(await uploadSettings.isDisplayed(), 'Настройки загрузки должны быть видимы');

        const uploadButton = await this.findByXPath("//input[@type='submit' and @id='uploadButton']");
        assert.isTrue(await uploadButton.isDisplayed(), 'Кнопка загрузки должна быть видима');
    }

    async testUploadImage(imagePath: string) {
        await this.driver.get(BASE_URL);

        const fileInput = await this.findByXPath("//input[@type='file' and @id='file']");
        await fileInput.sendKeys(imagePath);

        const uploadButton = await this.findByXPath("//input[@type='submit' and @id='uploadButton']");
        await uploadButton.click();

        const picInfoDiv = await this.findByXPath("//div[contains(@class, 'picinfo')]");
        assert.isTrue(await picInfoDiv.isDisplayed(), 'Информация об изображении должна отображаться');

        const codesList = await this.findByXPath("//ul[contains(@class, 'codes-list')]");
        assert.isTrue(await codesList.isDisplayed(), 'Список кодов для вставки должен отображаться');

        const linkInputs = await this.driver.findElements(By.xpath("//ul[contains(@class, 'codes-list')]//input"));
        assert.isAtLeast(linkInputs.length, 1, 'Должна быть хотя бы одна ссылка на изображение');

        const directLink = await linkInputs[0].getAttribute('value');
        assert.isNotEmpty(directLink, 'Прямая ссылка не должна быть пустой');
        assert.include(directLink, 'fastpic.', 'Ссылка должна указывать на fastpic');
    }

    async testTabSwitching() {
        await this.driver.get(BASE_URL);

        const urlTabLink = await this.findByXPath("//a[@id='switch_to_copy']");
        await urlTabLink.click();

        const urlTextarea = await this.findByXPath("//textarea[@id='upload_files']");
        assert.isTrue(await urlTextarea.isDisplayed(), 'Поле для ввода URL должно быть видимым');

        const fileTabLink = await this.findByXPath("//a[@id='switch_to_upload']");
        await fileTabLink.click();

        const fileInput = await this.findByXPath("//input[@type='file' and @id='file']");
        assert.isTrue(await fileInput.isDisplayed(), 'Поле для загрузки файла должно быть видимым');
    }

    async testImageResizeSettings() {
        await this.driver.get(BASE_URL);

        const resizeCheckbox = await this.findByXPath("//input[@id='check_orig_resize']");
        if (!(await resizeCheckbox.isSelected())) {
            await resizeCheckbox.click();
        }

        const resizeInput = await this.findByXPath("//input[@id='orig-resize']");
        await resizeInput.clear();
        await resizeInput.sendKeys('800');

        const fileInput = await this.findByXPath("//input[@type='file' and @id='file']");
        await fileInput.sendKeys(IMAGE_PATHS.JPG);

        const uploadButton = await this.findByXPath("//input[@id='uploadButton']");
        await uploadButton.click();

        const picInfoDiv = await this.findByXPath("//div[contains(@class, 'picinfo')]");
        assert.isTrue(await picInfoDiv.isDisplayed(), 'Информация об изображении должна отображаться');
    }
}

describe('FastPic Tests', () => {
    const browsers = [
        { name: 'chrome', options: new chrome.Options() },
        { name: 'firefox', options: new firefox.Options() },
        { name: 'MicrosoftEdge', options: new edge.Options() }
    ];

    browsers.forEach(({ name, options }) => {
        describe(`Testing in ${name}`, () => {
            let driver: WebDriver;
            let testInstance: FastPicTest;

            before(async () => {
                let builder = new Builder();

                // Устанавливаем опции для каждого браузера правильно
                switch (name) {
                    case 'chrome':
                        builder = builder
                            .forBrowser('chrome')
                            .setChromeOptions(options as chrome.Options);
                        break;
                    case 'firefox':
                        builder = builder
                            .forBrowser('firefox')
                            .setFirefoxOptions(options as firefox.Options);
                        break;
                    case 'MicrosoftEdge':
                        builder = builder
                            .forBrowser('MicrosoftEdge')
                            .setEdgeOptions(options as edge.Options);
                        break;
                }

                driver = await builder.build();
                testInstance = new FastPicTest(driver);
            });

            after(async () => {
                if (driver) await driver.quit();
            });

            it('Проверка главной страницы', async () => {
                await testInstance.testMainPage();
            });

            it('Загрузка JPG изображения', async () => {
                await testInstance.testUploadImage(IMAGE_PATHS.JPG);
            });

            it('Загрузка PNG изображения', async () => {
                await testInstance.testUploadImage(IMAGE_PATHS.PNG);
            });

            it('Проверка переключения вкладок', async () => {
                await testInstance.testTabSwitching();
            });

            it('Проверка настроек изменения размера', async () => {
                await testInstance.testImageResizeSettings();
            });
        });
    });
});
