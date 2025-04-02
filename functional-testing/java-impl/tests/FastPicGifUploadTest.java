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


public class FastPicGifUploadTest {
    public static WebDriver driver;
    
    public static final String BASE_URL = "https://fastpic.org";
    
    public static final int DEFAULT_TIMEOUT = 3;
    
    public static final String JPG_IMAGE_PATH = "../../docs/test.jpg";
    public static final String PNG_IMAGE_PATH = "../../docs/test.png";
    public static final String GIF_IMAGE_PATH = "../../docs/test.gif";
    public static final String LARGE_IMAGE_PATH = "../../docs/large.jpg";
    
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
     * Тест 6: Загрузка GIF изображения с компьютера
     */
    @Test
    @DisplayName("Загрузка GIF изображения с компьютера")
    public void testUploadGifImage() {
        WebElement fileInput = findByXPath("//input[@type='file' and @id='file']");

        String imagePath = Paths.get(GIF_IMAGE_PATH).toAbsolutePath().toString();
        fileInput.sendKeys(imagePath);

        WebElement uploadButton = findByXPath("//input[@type='submit' and @id='uploadButton']");
        uploadButton.click();

        WebElement picInfoDiv = new WebDriverWait(driver, Duration.ofSeconds(20))
                .until(ExpectedConditions.presenceOfElementLocated(By.xpath("//div[contains(@class, 'picinfo')]")));
        assertTrue(picInfoDiv.isDisplayed(), "Информация об изображении должна отображаться");

        List<WebElement> linkInputs = driver.findElements(By.xpath("//ul[contains(@class, 'codes-list')]//input"));
        assertTrue(linkInputs.size() > 0, "Должна быть хотя бы одна ссылка на изображение");
    }
}
