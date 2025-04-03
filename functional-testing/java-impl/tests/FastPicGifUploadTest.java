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

    public static final String DOCS_BASE_PATH;
    public static final String JPG_IMAGE_PATH;
    public static final String PNG_IMAGE_PATH;
    public static final String GIF_IMAGE_PATH;
    public static final String LARGE_IMAGE_PATH;

    public static final String TEST_IMAGE_URL = "https://placekitten.com/800/600";

    static {
        DOCS_BASE_PATH = Paths.get("")
            .toAbsolutePath()
            .getParent() // up from java-impl 
            .resolve("docs") // to docs directory
            .toString();
        
        JPG_IMAGE_PATH = DOCS_BASE_PATH + "/test.jpg";
        PNG_IMAGE_PATH = DOCS_BASE_PATH + "/test.png";
        GIF_IMAGE_PATH = DOCS_BASE_PATH + "/test.gif";
        LARGE_IMAGE_PATH = DOCS_BASE_PATH + "/large.jpg";
    }
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

        fileInput.sendKeys(GIF_IMAGE_PATH);

        WebElement uploadButton = findByXPath("//input[@type='submit' and @id='uploadButton']");
        uploadButton.click();

        WebElement picInfoDiv = findByXPath("//div[contains(@class, 'picinfo')]");
        assertTrue(picInfoDiv.isDisplayed(), "Информация об изображении должна отображаться");

        List<WebElement> linkInputs = driver.findElements(By.xpath("//ul[contains(@class, 'codes-list')]//input"));
        assertTrue(linkInputs.size() > 0, "Должна быть хотя бы одна ссылка на изображение");
    }
}
