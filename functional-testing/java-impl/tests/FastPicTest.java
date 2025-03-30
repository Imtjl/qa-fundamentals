import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertTrue;

import java.nio.file.Paths;
import java.time.Duration;
import java.util.List;

import org.junit.jupiter.api.AfterAll;
import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.chrome.ChromeDriver;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.WebDriverWait;

import io.github.bonigarcia.wdm.WebDriverManager;

public class FastPicTest {
    public static WebDriver driver;
    
    public static final String BASE_URL = "https://fastpic.org";
    
    public static final int DEFAULT_TIMEOUT = 3;
    
    public static final String JPG_IMAGE_PATH = "images/test.jpg";
    public static final String PNG_IMAGE_PATH = "images/test.png";
    public static final String GIF_IMAGE_PATH = "images/test.gif";
    public static final String LARGE_IMAGE_PATH = "images/large.jpg";
    
    public static final String TEST_IMAGE_URL = "https://placekitten.com/800/600";

    @BeforeAll
    public static void setup() {
        WebDriverManager.chromiumdriver().setup();
        driver = new ChromeDriver();
        driver.manage().window().maximize();
    }

    @AfterAll
    public static void teardown() {
        if (driver != null) {
            driver.quit();
        }
    }

    @BeforeEach
    public void beforeEach() {
        driver.get(BASE_URL);
    }
    
    private WebElement findByXPath(String xpath) {
        return findByXPath(xpath, DEFAULT_TIMEOUT);
    }
    
    private WebElement findByXPath(String xpath, int timeoutInSeconds) {
        WebDriverWait wait = new WebDriverWait(driver, Duration.ofSeconds(timeoutInSeconds));
        return wait.until(ExpectedConditions.presenceOfElementLocated(By.xpath(xpath)));
    }

    /**
     * Проверка главной страницы
     */
    @Test
    @DisplayName("Проверка главной страницы")
    public void testMainPage() {
        String title = driver.getTitle();
        assertTrue(title.contains("FastPic"), "Заголовок страницы должен содержать 'FastPic'");

        WebElement fileInput = findByXPath("//input[@type='file']");
        assertTrue(fileInput.isDisplayed(), "Элемент загрузки файла должен быть видим");

        WebElement uploadSettings = findByXPath("//div[contains(@class, 'upload_settings')]");
        assertTrue(uploadSettings.isDisplayed(), "Настройки загрузки должны быть видимы");

        WebElement uploadButton = findByXPath("//input[@type='submit' and @id='uploadButton']");
        assertTrue(uploadButton.isDisplayed(), "Кнопка загрузки должна быть видима");
    }

    /**
     * Загрузка JPG изображения с компьютера
     */
    @Test
    @DisplayName("Загрузка JPG изображения с компьютера")
    public void testUploadJpgImage() {
        WebElement fileInput = findByXPath("//input[@type='file' and @id='file']");

        String imagePath = Paths.get("images/test.jpg").toAbsolutePath().toString();
        fileInput.sendKeys(imagePath);

        WebElement uploadButton = findByXPath("//input[@type='submit' and @id='uploadButton']");
        uploadButton.click();

        WebElement picInfoDiv = new WebDriverWait(driver, Duration.ofSeconds(8))
                    .until(ExpectedConditions.presenceOfElementLocated(By.xpath("//div[contains(@class, 'picinfo')]")));
        assertTrue(picInfoDiv.isDisplayed(), "Информация об изображении должна отображаться");
        
        WebElement codesList = findByXPath("//ul[contains(@class, 'codes-list')]");
        assertTrue(codesList.isDisplayed(), "Список кодов для вставки должен отображаться");
        
        List<WebElement> linkInputs = driver.findElements(By.xpath("//ul[contains(@class, 'codes-list')]//input"));
        assertTrue(linkInputs.size() > 0, "Должна быть хотя бы одна ссылка на изображение");
        
        String directLink = linkInputs.get(0).getAttribute("value");
        assertFalse(directLink.isEmpty(), "Прямая ссылка не должна быть пустой");
        assertTrue(directLink.contains("fastpic."), "Ссылка должна указывать на fastpic");
    }

    /**
     * Загрузка БОЛЬШОГО JPG изображения с компьютера
     * sdfsf
     */
    @Test
    @DisplayName("Загрузка БОЛЬШОГО JPG изображения с компьютера")
    public void testUploadLargeJpgImage() {
        WebElement fileInput = findByXPath("//input[@type='file' and @id='file']");

        String imagePath = Paths.get("images/large.jpg").toAbsolutePath().toString();
        fileInput.sendKeys(imagePath);

        WebElement uploadButton = findByXPath("//input[@type='submit' and @id='uploadButton']");
        uploadButton.click();

        WebElement picInfoDiv = new WebDriverWait(driver, Duration.ofSeconds(18))
                    .until(ExpectedConditions.presenceOfElementLocated(By.xpath("//div[contains(@class, 'picinfo')]")));
        assertTrue(picInfoDiv.isDisplayed(), "Информация об изображении должна отображаться");
        
        WebElement codesList = findByXPath("//ul[contains(@class, 'codes-list')]");
        assertTrue(codesList.isDisplayed(), "Список кодов для вставки должен отображаться");
        
        List<WebElement> linkInputs = driver.findElements(By.xpath("//ul[contains(@class, 'codes-list')]//input"));
        assertTrue(linkInputs.size() > 0, "Должна быть хотя бы одна ссылка на изображение");
        
        String directLink = linkInputs.get(0).getAttribute("value");
        assertFalse(directLink.isEmpty(), "Прямая ссылка не должна быть пустой");
        assertTrue(directLink.contains("fastpic."), "Ссылка должна указывать на fastpic");
    }
   

    /**
     * Проверка переключения между вкладками
     */
    @Test
    @DisplayName("Проверка переключения между вкладками")
    public void testTabSwitching() {
        WebElement urlTabLink = findByXPath("//a[@id='switch_to_copy']");
        urlTabLink.click();

        WebElement urlTextarea = findByXPath("//textarea[@id='upload_files']");
        assertTrue(urlTextarea.isDisplayed(), "Поле для ввода URL должно быть видимым");

        WebElement fileTabLink = findByXPath("//a[@id='switch_to_upload']");
        fileTabLink.click();

        WebElement fileInput = findByXPath("//input[@type='file' and @id='file']");
        assertTrue(fileInput.isDisplayed(), "Поле для загрузки файла должно быть видимым");
    }

    /**
     * Загрузка PNG изображения с компьютера
     */
    @Test
    @DisplayName("Загрузка PNG изображения с компьютера")
    public void testUploadPngImage() {
        WebElement fileInput = findByXPath("//input[@type='file' and @id='file']");

        String imagePath = Paths.get(PNG_IMAGE_PATH).toAbsolutePath().toString();
        fileInput.sendKeys(imagePath);

        WebElement uploadButton = findByXPath("//input[@type='submit' and @id='uploadButton']");
        uploadButton.click();

        WebElement picInfoDiv = new WebDriverWait(driver, Duration.ofSeconds(8))
                .until(ExpectedConditions.presenceOfElementLocated(By.xpath("//div[contains(@class, 'picinfo')]")));
        assertTrue(picInfoDiv.isDisplayed(), "Информация об изображении должна отображаться");

        List<WebElement> linkInputs = driver.findElements(By.xpath("//ul[contains(@class, 'codes-list')]//input"));
        assertTrue(linkInputs.size() > 0, "Должна быть хотя бы одна ссылка на изображение");
    }


    /**
     * Тестирование настроек изображения (уменьшение размера)
     */
    @Test
    @DisplayName("Настройка уменьшения размера изображения")
    public void testImageResizeSettings() {
        WebElement resizeCheckbox = findByXPath("//input[@id='check_orig_resize']");
        if (!resizeCheckbox.isSelected()) {
            resizeCheckbox.click();
        }

        WebElement resizeInput = findByXPath("//input[@id='orig-resize']");
        resizeInput.clear();
        resizeInput.sendKeys("800");

        WebElement fileInput = findByXPath("//input[@type='file' and @id='file']");
        String imagePath = Paths.get(JPG_IMAGE_PATH).toAbsolutePath().toString();
        fileInput.sendKeys(imagePath);

        WebElement uploadButton = findByXPath("//input[@id='uploadButton']");
        uploadButton.click();

        WebElement picInfoDiv = new WebDriverWait(driver, Duration.ofSeconds(8))
                .until(ExpectedConditions.presenceOfElementLocated(By.xpath("//div[contains(@class, 'picinfo')]")));
        assertTrue(picInfoDiv.isDisplayed(), "Информация об изображении должна отображаться");
    }

    /**
     * Просмотр и проверка страницы "Мои загрузки"
     */
    @Test
    @DisplayName("Проверка страницы 'Мои загрузки'")
    public void testMyUploadsPage() {
        WebElement fileInput = findByXPath("//input[@type='file' and @id='file']");

        String imagePath = Paths.get("images/test.jpg").toAbsolutePath().toString();
        fileInput.sendKeys(imagePath);

        WebElement uploadButton = findByXPath("//input[@type='submit' and @id='uploadButton']");
        uploadButton.click();

        WebElement picInfoDiv = new WebDriverWait(driver, Duration.ofSeconds(8))
                    .until(ExpectedConditions.presenceOfElementLocated(By.xpath("//div[contains(@class, 'picinfo')]")));


        driver.get(BASE_URL + "/my.php");

        WebElement checkAllLink = findByXPath("//a[@id='check_all']");
        assertTrue(checkAllLink.isDisplayed(), "Ссылка 'выбрать всё' должна отображаться");
        
        WebElement manageForm = findByXPath("//form[@id='manage-form']");
        assertTrue(manageForm.isDisplayed(), "Форма управления изображениями должна отображаться");
        
        List<WebElement> thumbs = driver.findElements(By.xpath("//div[contains(@class, 'thumb')]"));
        assertTrue(thumbs.size() > 0, "Должно быть хотя бы одно изображение на странице");
        
        WebElement firstThumb = thumbs.get(0);
        WebElement thumbImage = firstThumb.findElement(By.xpath(".//img"));
        assertTrue(thumbImage.isDisplayed(), "Миниатюра изображения должна отображаться");
    }

    /**
     * Тестирование проверки ссылок на изображение
     */
    @Test
    @DisplayName("Проверка сгенерированных ссылок")
    public void testImageLinks() {
        // Загружаем изображение
        WebElement fileInput = findByXPath("//input[@type='file' and @id='file']");
        String imagePath = Paths.get(JPG_IMAGE_PATH).toAbsolutePath().toString();
        fileInput.sendKeys(imagePath);

        WebElement uploadButton = findByXPath("//input[@id='uploadButton']");
        uploadButton.click();

        // Ждем завершения загрузки и получения ссылок
        WebElement picInfoDiv = new WebDriverWait(driver, Duration.ofSeconds(8))
                .until(ExpectedConditions.presenceOfElementLocated(By.xpath("//div[contains(@class, 'picinfo')]")));

        // Получаем все ссылки
        List<WebElement> linkInputs = driver.findElements(By.xpath("//ul[contains(@class, 'codes-list')]//input"));
        assertTrue(linkInputs.size() > 0, "Должна быть хотя бы одна ссылка на изображение");

        // Проверяем прямую ссылку
        String directLink = linkInputs.get(0).getAttribute("value");
        assertFalse(directLink.isEmpty(), "Прямая ссылка не должна быть пустой");
        assertTrue(directLink.contains("fastpic."), "Ссылка должна указывать на fastpic");

        // Проверяем BB-код для форумов (вторая ссылка)
        if (linkInputs.size() > 1) {
            String bbCode = linkInputs.get(1).getAttribute("value");
            assertFalse(bbCode.isEmpty(), "BB-код не должен быть пустым");
            assertTrue(bbCode.contains("[URL") && bbCode.contains("[IMG"),
                    "BB-код должен содержать теги [URL] и [IMG]");
        }
    }
}
